/**
 * Created by xieting on 2018/1/3.
 */

/*
TODO:
 */

import EventEmitter from 'events';
import Events from './events';
import DataChannel from './data-channel';
import P2PScheduler from './p2p-scheduler';

// const log = console.log;

export default class P2PSignaler extends EventEmitter {
    constructor(channel, config, info) {
        super();

        this.config = config;
        this.browserInfo = info;
        this.connected = false;
        this.channel = channel;                                  //频道
        this.scheduler = new P2PScheduler(config);
        this.DCMap = new Map();                                  //{key: channelId, value: DataChannnel}
        console.log('connecting to :' + config.websocketAddr);
        this.websocket = null;

        if (config.p2pEnabled) {
            this.websocket = new WebSocket(config.websocketAddr);
            this._init(this.websocket, info);
        }



    }

    send(msg) {
        if (this.connected) {
            this.websocket.send(msg);
        }
    }

    stopP2P() {
        this.scheduler.clearAllStreamers();
        let msg = {
            action: 'leave'
        };
        this.send(msg);

    }

    resumeP2P() {
        if (!this.connected) {
            this.websocket = new WebSocket(this.config.websocketAddr);
            this._init(this.websocket, this.browserInfo);
        }
    }

    _init(websocket, info) {

        websocket.onopen = () => {
            console.log('websocket connection opened with channel: ' + this.channel);
            this.connected = true;

            //发送进入频道请求
            let msg = {
                action: 'enter',
                channel: this.channel
            };

            if (info) {
                msg = Object.assign(msg, info);
            }

            websocket.push(JSON.stringify(msg));
        };

        websocket.push = websocket.send;
        websocket.send = msg => {
            if (websocket.readyState != 1) {
                console.log('websocket connection is not opened yet.');
                //重新连接
                websocket.close();
                this.websocket = new WebSocket(this.config.websocketAddr);
                this._init(this.websocket);

                return setTimeout(function() {
                    websocket.send(msg);
                }, this.config.websocketRetryDelay*1000);
            }
            let msgStr = JSON.stringify(Object.assign({channel: this.channel}, msg));
            console.log("send to websocket is " + msgStr);
            websocket.push(msgStr);
        };
        websocket.onmessage = (e) => {
            console.log('websocket on msg: ' + e.data);
            let msg = JSON.parse(e.data);
            let action = msg.action;
            switch (action) {
                case 'signal':
                    console.log('start _handleSignal');
                    this._handleSignal(msg.from_peer_id, msg.data);
                    break;
                case 'connect':
                    console.log('start _handleConnect');
                    this._handleConnect(msg.to_peer_id, msg.initiator);
                    break;
                case 'disconnect':

                    break;
                case 'accept':
                    this.peerId = msg.peer_id;                              //获取本端Id
                    break;
                case 'reject':
                    this.connected = false;                                 //如果拒绝进入频道则不允许发消息
                    this.websocket.close();
                    break;
                default:
                    console.log('websocket unknown action ' + action);

            }

        };
        websocket.onerror = websocket.onclose = () => {              //websocket断开时清除datachannel
            this.scheduler.clearAllStreamers();
        };
    }

    _handleSignal(remotePeerId, data) {
        const datachannel = this.DCMap.get(remotePeerId);
        if (datachannel) {
            datachannel.receiveSignal(data);
        } else {
            console.log(`can not find datachannel remotePeerId ${remotePeerId}`);
        }
    }

    _handleConnect(remotePeerId, isInitiator) {
        let datachannel = new DataChannel(this.peerId, remotePeerId, isInitiator, this.config);
        this.DCMap.set(remotePeerId, datachannel);                                  //将对等端Id作为键
        this._setupDC(datachannel);
    }

    _setupDC(datachannel) {
        datachannel.on('signal', data => {
            let msg = {
                action: 'signal',
                peer_id: this.peerId,
                to_peer_id: datachannel.remotePeerId,
                data: data
            };
            this.websocket.send(msg);
        })
            .once('error', () => {
                let msg = {
                    action: 'dc_failed',
                    dc_id: datachannel.channelId,
                };
                this.websocket.send(msg);
                console.log(`datachannel error ${datachannel.channelId}`);
                this.scheduler.deleteDataChannel(datachannel);
                datachannel.destroy();
            })
            .once(Events.DC_CLOSE, () => {

                console.log(`datachannel closed ${datachannel.channelId} `);
                let msg = {
                    action: 'dc_closed',
                    dc_id: datachannel.channelId,
                };
                this.websocket.send(msg);
            this.scheduler.deleteDataChannel(datachannel);
            datachannel.destroy();
        })
            .once(Events.DC_OPEN, () => {

                this.scheduler.addDataChannel(datachannel);
                if (datachannel.isReceiver) {                              //子节点发送已连接消息
                    let msg = {
                        action: 'dc_opened',
                        dc_id: datachannel.channelId,
                    };
                    this.websocket.send(msg);
                }
            })
    }

    destroy() {
        this.websocket.close();
        this.websocket = null;
    }
}