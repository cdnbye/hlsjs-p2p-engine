/**
 * Created by xieting on 2018/1/2.
 */
// let UAParser = require('ua-parser-js');
import EventEmitter from 'events';
import {defaultP2PConfig} from './config';
import getPeerId from './peerid-generator';
import SimplePeer from 'simple-peer';
import P2PSignaler from './p2p-signaler';

class HlsPeerify extends EventEmitter {

    constructor(hlsjs, p2pConfig) {

        super();
        this.peerId = getPeerId();
        console.log('peerId: ' + this.peerId);
        this.hlsjs = hlsjs;
        this.config = Object.assign({}, defaultP2PConfig, p2pConfig);

        if (hlsjs.url) {
            let channel = hlsjs.url.split('?')[0];
            this._init(channel);
        } else {
            hlsjs.on(hlsjs.constructor.Events.MANIFEST_PARSED, (event, data) => {
                let channel = hlsjs.url.split('?')[0];
                this._init(channel);
            });
        }


    }

    _init(channel) {
        this.signaler = new P2PSignaler(channel, this.peerId);

        this.hlsjs.on(hlsjs.constructor.Events.FRAG_CHANGED,function(id, frag) {
            console.log('FRAG_CHANGED: '+JSON.stringify(frag));
        });

        this.hlsjs.on(hlsjs.constructor.Events.DESTROYING,function(id, frag) {
            console.log('FRAG_CHANGED: '+JSON.stringify(frag));
            this.signaler.destroy();
            this.signaler = null;
        });
    }

    stop() {

    }
}

HlsPeerify.WEBRTC_SUPPORT = SimplePeer.WEBRTC_SUPPORT;

HlsPeerify.version = __VERSION__;

export default HlsPeerify
