/**
 * Created by xieting on 2018/3/23.
 */

import EventEmitter from 'events';
import BTScheduler from './bt-scheduler';
import SignalClient from '../signal-client';
import {DataChannel, Events} from '../pear';

class BTTracker extends EventEmitter {
    constructor(fetcher, config) {
        super();

        this.config = config;
        this.connected = false;
        this.scheduler = new BTScheduler(config);
        this.DCMap = new Map();                                  //{key: remotePeerId, value: DataChannnel} 目前已经建立连接或正在建立连接的dc
        this.failedDCSet= new Set();                            //{remotePeerId} 建立连接失败的dc
        this.signalerWs = null;                                  //信令服务器ws
        this.heartbeatInterval = 30;
        //tracker request API
        this.fetcher = fetcher;
        /*
        peers: Array<Object{id:string}>
         */
        this.peers = [];

        this._setupScheduler(this.scheduler);
    }

    set currentPlaySN(sn) {
        this.scheduler.updatePlaySN(sn);
    }

    set currentLoadingSN(sn) {
        this.scheduler.updateLoadingSN(sn);
    }

    set currentLoadedSN(sn) {
        this.scheduler.updateLoadedSN(sn);                        //更新bitmap
    }

    resumeP2P() {

        this.fetcher.btAnnounce().then(json => {
            logger.warn(`announceURL response ${JSON.stringify(json)}`)
            this.peerId = json.peer_id;
            this.fetcher.btHeartbeat(json.heartbeat_interval);
            this.fetcher.btStatsStart(json.report_interval);
            this.signalerWs = this._initSignalerWs();                         //连上tracker后开始连接信令服务器
            this._handlePeers(json.peers);
        }).catch(err => {

        })
    }

    destroy() {
        window.clearInterval(this.heartbeater);
        this.heartbeater = null;
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

    _tryConnectToPeer() {
        if (this.peers.length === 0) return;
        let remotePeerId = this.peers.pop().id;
        logger.warn(`_tryConnectToPeer ${remotePeerId}`);
        let datachannel = new DataChannel(this.peerId, remotePeerId, true, this.config);
        this.DCMap.set(remotePeerId, datachannel);                                  //将对等端Id作为键
        this._setupDC(datachannel);
    }

    _setupDC(datachannel) {
        datachannel.on(Events.DC_SIGNAL, data => {
            this.signalerWs.sendSignal(datachannel.remotePeerId, data);
            //启动定时器，如果指定时间对方没有响应则连接下一个
            if (!this.signalTimer) {
                this.signalTimer = window.setTimeout(() => {
                    this.DCMap.delete(datachannel.remotePeerId);
                    this.failedDCSet.add(datachannel.remotePeerId);              //记录失败的连接
                    logger.warn(`${datachannel.remotePeerId} signaling timeout`);
                    this.signalTimer = null;
                    this._tryConnectToPeer();
                }, 2000)
            }


        })
            .once(Events.DC_ERROR, () => {
                logger.warn(`datachannel error ${datachannel.channelId}`);
                this.scheduler.deletePeer(datachannel);
                this.DCMap.delete(datachannel.remotePeerId);
                this.failedDCSet.add(datachannel.remotePeerId);                  //记录失败的连接
                this._tryConnectToPeer();
                datachannel.destroy();

                this._requestMorePeers();

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

                logger.warn(`datachannel closed ${datachannel.channelId} `);
                this.scheduler.deletePeer(datachannel);
                this.DCMap.delete(datachannel.remotePeerId);
                this.failedDCSet.add(datachannel.remotePeerId);              //记录断开的连接
                this._tryConnectToPeer();

                datachannel.destroy();

                this._requestMorePeers();

                //更新conns
                this.fetcher.decreConns();

            })
            .once(Events.DC_OPEN, () => {

                this.scheduler.handshakePeer(datachannel);

                //如果dc数量不够则继续尝试连接
                if (this.DCMap.size < this.config.neighbours) {
                    this._tryConnectToPeer();
                }

                //更新conns
                this.fetcher.increConns();
            })
    }

    _initSignalerWs() {

        let websocket = new SignalClient(this.peerId, this.config);
        websocket.onopen = () => {
            this.connected = true;
            this._tryConnectToPeer();
        };

        websocket.onmessage = (e) => {
            let msg = JSON.parse(e.data);
            let action = msg.action;
            switch (action) {
                case 'signal':
                    logger.debug('start _handleSignal');
                    window.clearTimeout(this.signalTimer);                       //接收到信令后清除定时器
                    this.signalTimer = null;
                    this._handleSignal(msg.from_peer_id, msg.data);
                    break;
                case 'reject':
                    this.stopP2P();
                    break;
                default:
                    logger.warn('Signaler websocket unknown action ' + action);

            }

        };
        websocket.onclose = () => {                                            //websocket断开时清除datachannel
            this.connected = false;
            this.destroy();
        };
        return websocket;
    }

    _handleSignal(remotePeerId, data) {
        let datachannel = this.DCMap.get(remotePeerId);
        if (datachannel && datachannel.connected) {
            logger.info(`datachannel had connected, signal ignored`);
            return
        }
        if (!datachannel) {                                               //收到子节点连接请求
            logger.debug(`receive child node connection request`);
            if (this.failedDCSet.has(remotePeerId)) return;
            datachannel = new DataChannel(this.peerId, remotePeerId, false, this.config);
            this.DCMap.set(remotePeerId, datachannel);                                  //将对等端Id作为键
            this._setupDC(datachannel);
        }
        datachannel.receiveSignal(data);
    }

    _setupScheduler(s) {

    }

    _heartbeat() {
        this.heartbeater = window.setInterval(() => {
            this.fetcher.btHeartbeat();
        }, this.heartbeatInterval * 1000)
    }

    _requestMorePeers() {
        if (this.scheduler.peerMap.size <= Math.floor(this.config.neighbours/2)) {
            this.fetcher.btGetPeers().then(json => {
                logger.warn(`_requestMorePeers ${JSON.stringify(json)}`);
                this._handlePeers(json.peers);
                this._tryConnectToPeer();
            })
        }
    }
}

export default BTTracker;