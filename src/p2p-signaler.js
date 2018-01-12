/**
 * Created by xieting on 2018/1/3.
 */

import debug from 'debug';
import EventEmitter from 'events';
import Events from './events';
import {defaultP2PConfig as config} from './config';
import DataChannel from './data-channel';
import P2PScheduler from './p2p-scheduler';

const log = debug('p2p-signal');

export default class P2PSignaler extends EventEmitter {
    constructor(channel) {
        super();

        this.connected = false;
        this.channel = channel;                                  //频道
        this.scheduler = new P2PScheduler();
        this.DCMap = new Map();                                  //{key: channelId, value: DataChannnel}
        log('connecting to :' + config.websocketAddr);
        this.websocket = new WebSocket(config.websocketAddr);

        this._init(this.websocket);


    }

    send(msg) {
        if (this.connected) {
            this.websocket.send(msg);
        }
    }

    _init(websocket) {

        websocket.onopen = () => {
            log('websocket connection opened with channel: ' + this.channel);
            this.connected = true;

            //发送进入频道请求
            let msg = {
                action: 'enter',
                channel: this.channel
            }

            websocket.push(JSON.stringify(msg));
        };

        websocket.push = websocket.send;
        websocket.send = msg => {
            if (websocket.readyState != 1) {
                log('websocket connection is not opened yet.');
                return setTimeout(function() {
                    websocket.send(data);
                }, 1000);
            }
            let msgStr = JSON.stringify(Object.assign({channel: this.channel}, msg));
            log("send to websocket is " + msgStr);
            websocket.push(msgStr);
        };
        websocket.onmessage = (e) => {
            log('websocket on msg: ' + e.data);
            let msg = JSON.parse(e.data);
            let action = msg.action;
            switch (action) {
                case 'signal':
                    log('start _handleSignal');
                    this._handleSignal(msg.from_peer_id, msg.data);
                    break;
                case 'connect':
                    log('start _handleConnect');
                    this._handleConnect(msg.to_peer_id, msg.initiator);
                    break;
                case 'disconnect':

                    break;
                case 'accept':
                    this.peerId = msg.peer_id;                              //获取本端Id
                    break;
                case 'reject':
                    this.connected = false;                                 //如果拒绝进入频道则不允许发消息
                    break;
                default:
                    log('websocket unknown action ' + action);

            }

        };
    }

    _handleSignal(remotePeerId, data) {
        const datachannel = this.DCMap.get(remotePeerId);
        if (datachannel) {
            datachannel.receiveSignal(data);
        } else {
            log(`can not find datachannel remotePeerId ${remotePeerId}`);
        }
    }

    _handleConnect(remotePeerId, isInitiator) {
        let datachannel = new DataChannel(this.peerId, remotePeerId, isInitiator);
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
            .on('error', () => {
                let msg = {
                    action: 'dc_failed',
                    dc_id: datachannel.channelId,
                };
                this.websocket.send(msg);
                log(`datachannel ${datachannel.channelId} error`);
                datachannel.destroy();
            })
            .on('close', () => {

                log(`datachannel ${data.channelId} closed`);
                // this.emit(Events.SIG_DCCLOSED, datachannel);
                this.scheduler.deleteDataChannel(datachannel);
                datachannel.destroy();
            })
            .on('open', () => {

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