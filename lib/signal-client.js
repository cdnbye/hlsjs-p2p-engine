/**
 * Created by xieting on 2018/3/23.
 */

import EventEmitter from 'events';
import ReconnectingWebSocket from 'reconnecting-websocket';

class SignalClient extends EventEmitter{
    constructor(peerId, config) {
        super();
        this.peerId = peerId;
        this.config = config;
        this.connected = false;
        this._ws = this._init(peerId);
    }

    _init(id) {
        const wsOptions = {
            maxRetries: this.config.wsMaxRetries,
            minReconnectionDelay: this.config.wsReconnectInterval*1000
        };
        let queryStr = `?id=${id}`;
        let websocket = new ReconnectingWebSocket(this.config.wsSignalerAddr+queryStr, undefined, wsOptions);
        websocket.onopen = () => {
            console.log('Signaler websocket connection opened');

            this.connected = true;
            if (this.onopen) this.onopen();
        };

        websocket.push = websocket.send;
        websocket.send = msg => {
            let msgStr = JSON.stringify(Object.assign({peer_id: id}, msg));
            if (websocket.readyState !== 1) {
                console.warn('websocket connection is not opened yet.');
                return setTimeout(function() {
                    websocket.send(data);
                }, 1000);
            }
            websocket.push(msgStr);
        };
        websocket.onmessage = (e) => {

            if (this.onmessage) this.onmessage(e)
        };
        websocket.onclose = () => {                                            //websocket断开时清除datachannel
            console.warn(`Signaler websocket closed`);
            if (this.onclose) this.onclose();
            this.connected = false;
        };
        return websocket;
    }

    sendSignal(remotePeerId, data) {
        let msg = {
            action: 'signal',
            peer_id: this.peerId,
            to_peer_id: remotePeerId,
            data: data
        };
        this.send(msg);
    }

    send(msg) {
        this._ws.send(msg);
    }

    close() {
        this._ws.close();
        this._ws = null;
    }
}

export default SignalClient;