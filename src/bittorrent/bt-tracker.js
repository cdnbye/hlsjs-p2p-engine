
import EventEmitter from 'events';
import BTScheduler from './bt-scheduler';
import SignalClient from '../signal-client';
import {DataChannel, Events, getPeersThrottle} from 'core';
import {throttle} from '../utils/toolFuns';

class BTTracker extends EventEmitter {
    constructor(engine, fetcher, config) {
        super();

        this.engine = engine;
        this.logger = engine.logger;
        this.config = config;
        this.connected = false;                                // 与信令的连接状态
        this.scheduler = new BTScheduler(engine, config);
        this.DCMap = new Map();                                  //{key: remotePeerId, value: DataChannnel} 目前已经建立连接或正在建立连接的dc
        this.failedDCSet= new Set();                            //{remotePeerId} 建立连接失败的dc
        this.signalerWs = null;                                  //信令服务器ws
        //tracker request API
        this.fetcher = fetcher;
        /*
        peers: Array<Object{id:string}>
         */
        this.peers = [];
        this.minConns = 0;

        // 防止调用频率过高
        this.requestMorePeers = getPeersThrottle(this._requestMorePeers, this);

        // this._setupScheduler(this.scheduler);
    }

    resumeP2P() {
        this.fetcher.btAnnounce().then(json => {
            this.logger.info(`announce request response ${JSON.stringify(json)}`)
            this.engine.peerId = this.peerId = json.id;
            this.minConns = json.min_conns;
            this.signalerWs = this._initSignalerWs();                         //连上tracker后开始连接信令服务器
            this._handlePeers(json.peers);
            this.engine.emit('peerId', this.peerId);
        }).catch(err => {
            console.warn(err);
        })
    }

    stopP2P() {
        this.fetcher.destroy();
        this.fetcher = null;
        this.requestMorePeers(true);          // 清空里面的定时器
        this.scheduler.destroy();
        this.scheduler = null;
        this.signalerWs.destroy();
        this.signalerWs = null;
        this.peers = [];

        // 销毁所有datachannel
        for (let dc of this.DCMap.values()) {
            dc.destroy();
        }
        this.DCMap.clear();

        this.failedDCSet.clear();
        this.logger.warn(`tracker stop p2p`);
    }

    destroy() {
        this.stopP2P();
        this.removeAllListeners();
        this.logger.warn(`destroy tracker`);
    }

    _handlePeers(peers) {
        for(let peer of peers) {
            this.peers.push({
                id: peer.id,
            })
        }
        //过滤掉已经连接的节点和连接失败的节点
        this.peers = this.peers.filter(node => {
            for (let peerId of [...this.DCMap.keys(),...this.failedDCSet.keys()]) {
                if (node.id === peerId) {
                    return false;
                }
            }
            return true;
        });
    }

    _tryConnectToAllPeers() {
        if (this.peers.length === 0) return;
        this.logger.info(`try connect to ${this.peers.length} peers`);
        this.peers.forEach(peer => {
            let datachannel = new DataChannel(this.engine, this.peerId, peer.id, true, this.config);
            this.DCMap.set(peer.id, datachannel);     // 将对等端Id作为键
            this._setupDC(datachannel);
        });
        // 清空peers
        this.peers = [];
    }

    _setupDC(datachannel) {
        datachannel.on(Events.DC_SIGNAL, data => {
            const remotePeerId = datachannel.remotePeerId;
            this.signalerWs.sendSignal(remotePeerId, data);
        })
            .once(Events.DC_ERROR, () => {
                this.logger.warn(`datachannel connect ${datachannel.channelId} failed`);
                if (this.scheduler) this.scheduler.deletePeer(datachannel);
                this.DCMap.delete(datachannel.remotePeerId);
                this.failedDCSet.add(datachannel.remotePeerId);                  //记录失败的连接
                datachannel.destroy();

                this.requestMorePeers();

                //更新conns
                if (datachannel.isInitiator) {
                    if (datachannel.connected) {                       //连接断开
                        this.fetcher.decreConns();
                    } else {                                           //连接失败
                        this.fetcher.increFailConns();
                    }
                }
            })
            .once(Events.DC_CLOSE, () => {

                this.logger.warn(`datachannel ${datachannel.channelId} closed`);
                if (this.scheduler) this.scheduler.deletePeer(datachannel);
                this.DCMap.delete(datachannel.remotePeerId);
                this.failedDCSet.add(datachannel.remotePeerId);              //记录断开的连接

                datachannel.destroy();

                this.requestMorePeers();

                //更新conns
                this.fetcher.decreConns();


            })
            .once(Events.DC_OPEN, () => {

                this.scheduler.handshakePeer(datachannel);
                //如果dc数量不够则继续尝试连接
                const cancel = this.scheduler.peersNum <= this.minConns ? false : true;
                this.requestMorePeers(cancel);

                //更新conns
                this.fetcher.increConns();

            })
    }

    _initSignalerWs() {
        let websocket = new SignalClient(this.engine, this.peerId, this.config);
        websocket.onopen = () => {
            this.connected = true;
            // 尝试与所有peers同时建立连接
            this._tryConnectToAllPeers();
        };

        websocket.onmessage = (e) => {
            let msg = JSON.parse(e.data);
            let action = msg.action;
            switch (action) {
                case 'signal':
                    const fromPeerId = msg.from_peer_id;
                    if (this.failedDCSet.has(fromPeerId) || !fromPeerId) return;
                    this.logger.debug(`handle signal of ${fromPeerId}`);
                    if (!msg.data) {                                             //如果对等端已不在线
                        this.logger.info(`signaling ${fromPeerId} not found`);
                        const datachannel = this.DCMap.get(fromPeerId);
                        if (datachannel)  {
                            datachannel.destroy();
                            this.DCMap.delete(fromPeerId);
                        }
                        this.failedDCSet.add(fromPeerId);              //记录失败的连接
                    } else {
                        this._handleSignal(fromPeerId, msg.data);
                    }
                    break;
                case 'reject':
                    this.stopP2P();
                    break;
                default:
                    this.logger.warn('Signaler websocket unknown action ' + action);

            }

        };
        websocket.onclose = () => {                                            //websocket断开时清除datachannel
            this.connected = false;
        };
        return websocket;
    }

    _handleSignal(remotePeerId, data) {
        let datachannel = this.DCMap.get(remotePeerId);
        if (datachannel && datachannel.connected) {
            this.logger.info(`datachannel had connected, signal ignored`);
            return
        }
        if (!datachannel) {                                               //收到子节点连接请求
            this.logger.debug(`receive node ${remotePeerId} connection request`);
            if (this.failedDCSet.has(remotePeerId)) return;
            datachannel = new DataChannel(this.engine, this.peerId, remotePeerId, false, this.config);
            this.DCMap.set(remotePeerId, datachannel);                                  //将对等端Id作为键
            this._setupDC(datachannel);
        }
        datachannel.receiveSignal(data);
    }

    // _setupScheduler(s) {
    //
    // }

    _requestMorePeers() {
        // 连接的节点<=3时请求更多节点
        if (this.scheduler.peersNum <= this.minConns) {
            this.fetcher.btGetPeers().then(json => {
                this.logger.info(`request more peers ${JSON.stringify(json)}`);
                this._handlePeers(json.peers);
                this._tryConnectToAllPeers();
            })
        }
    }


}

export default BTTracker;