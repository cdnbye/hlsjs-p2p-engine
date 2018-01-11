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
    constructor(channel, peerId) {
        super();

        this.connected = false;
        this.channel = channel;
        this.peerId = peerId;
        this.scheduler = new P2PScheduler();

        log('connecting to :' + config.websocketAddr);
        this.websocket = new WebSocket(config.websocketAddr);

        this._init(this.websocket);


    }

    _init(websocket) {

        websocket.onopen = () => {
            log('websocket connection opened with channel: ' + this.channel);
            this.connected = true;

            //发送进入频道请求
            let msg = {
                action: 'enter',
                peer_id: this.peerId,
                channel: this.channel,
                isLive: config.live
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
                    this._handleSignal(msg.data);
                    break;
                case 'connect':
                    log('start _handleConnect');
                    this._handleConnect(msg.to_peer_id, msg.initiator);       //将to_peer_id作为channelId
                    break;
                case 'disconnect':

                    break;
                case 'accept':

                    break;
                case 'reject':

                    break;
                default:
                    log('websocket unknown action ' + action);

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
                let msg = {
                    action: 'dc_failed',
                    peer_id: this.peerId,
                    to_peer_id: datachannel.channelId,
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

                //将datachannel emit出去
                // this.emit(Events.SIG_DCOPENED, datachannel);

                let msg = {
                    action: 'dc_opened',
                    peer_id: this.peerId,
                    to_peer_id: datachannel.channelId,
                };
                this.websocket.send(msg);

                this.scheduler.addDataChannel(datachannel);
            })
    }

    destroy() {
        this.websocket.close();
        this.websocket = null;
    }
}