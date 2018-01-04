/**
 * Created by xieting on 2018/1/2.
 */
// let UAParser = require('ua-parser-js');
import EventEmitter from 'events';
import {defaultP2PConfig} from './config';
import getPeerId from './peerid-generator';
import simplePeer from 'simple-peer';

class HlsPeerify extends EventEmitter {

    constructor(hlsjs, p2pConfig) {

        super();
        this.peerId = getPeerId();
        this.config = Object.assign({}, defaultP2PConfig, p2pConfig);

        if (hlsjs.url) {
            let channel = hlsjs.url.split('?')[0];
            console.log('channel:' + channel);
            this._init(channel);
        } else {
            hlsjs.on(hlsjs.constructor.Events.MANIFEST_PARSED, (event, data) => {
                let channel = hlsjs.url.split('?')[0];
                console.log('channel:' + channel);
                this._init(channel);
            });
        }

        hlsjs.on(hlsjs.constructor.Events.FRAG_CHANGED,function(id, frag) {
            console.log('FRAG_CHANGED: '+JSON.stringify(frag));
        });
    }

    _init(channel) {

    }
}

HlsPeerify.WEBRTC_SUPPORT = simplePeer.WEBRTC_SUPPORT;

HlsPeerify.version = __VERSION__;

export default HlsPeerify
