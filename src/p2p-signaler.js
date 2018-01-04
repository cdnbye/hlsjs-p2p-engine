/**
 * Created by xieting on 2018/1/3.
 */

import EventEmitter from 'events';
import {defaultP2PConfig as config} from './config';
import DataChannel from './data-channel';
import P2PScheduler from './p2p-scheduler';

export default class P2PSignaler extends EventEmitter {
    constructor(channel, peerId) {
        super();

        this.connected = false;
        this.channel = channel;
        this.peerId = peerId;

        console.log('connecting to :' + config.websocketAddr);
        this.websocket = new WebSocket(config.websocketAddr);

        this._init(this.websocket);
    }

    _init(websocket) {

        websocket.onopen = () => {
            console.log('websocket connection opened with channel: ' + this.channel);
            this.connected = true;

            //发送进入频道请求
            let msg = {
                action: 'enter',
                peer_id: this.peerId,
                channel: this.channel
            }

            websocket.push(JSON.stringify(msg));
        };

        websocket.push = websocket.send;
        websocket.send = msg => {
            if (websocket.readyState != 1) {
                console.warn('websocket connection is not opened yet.');
                return setTimeout(function() {
                    websocket.send(data);
                }, 1000);
            }
            let msgStr = JSON.stringify(Object.assign({channel: this.channel}, msg));
            console.log("send to signal is " + msgStr);
            websocket.push(msgStr);
        };
        websocket.onmessage = (e) => {
            console.log('websocket on msg: ' + e.data);
            let msg = JSON.parse(e.data);
            let action = msg.action;
            switch (action) {
                case 'signal':
                    console.log('start _handleSignal');
                    this._handleSignal(msg.data);
                    break;
                case 'connect':
                    console.log('start _handleConnect');
                    this._handleConnect(msg.to_peer_id, msg.initiator);       //将to_peer_id作为channelId
                    break;
                case 'disconnect':

                    break;
                case 'accept':

                    break;
                case 'reject':

                    break;
                default:
                    console.log('websocket unknown action ' + action);

            }

        };
    }

    _handleSignal(data) {
        this.datachannel.receiveSignal(data);
    }

    _handleConnect(channelId, isInitiator) {
        let datachannel = new DataChannel(channelId, isInitiator);
        this.datachannel = datachannel;
        this._setupDC(datachannel);
    }

    _setupDC(datachannel) {
        datachannel.on('signal', data => {
            let msg = {
                action: 'signal',
                peer_id: this.peerId,
                to_peer_id: datachannel.channelId,
                data: data
            };
            this.websocket.send(msg);
        })
            .on('error', () => {
                datachannel.destroy();
                let msg = {
                    action: 'dc_failed',
                    peer_id: this.peerId,
                    to_peer_id: datachannel.channelId,
                };
                this.websocket.send(msg);
            })
            .on('open', () => {

                let msg = {
                    action: 'dc_opened',
                    peer_id: this.peerId,
                    to_peer_id: datachannel.channelId,
                };
                this.websocket.send(msg);
            })
    }

    destroy() {
        this.websocket.close();
        this.websocket = null;
    }
}