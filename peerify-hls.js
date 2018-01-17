/**
 * Created by xieting on 2018/1/2.
 */

import HlsPeerify from './hls-peerify';
import Hlsjs from 'hls.js';
// import Hlsjs from 'hls.js/dist/hls.light';

let recommendedHlsjsConfig = {
    maxBufferSize: 0,
    maxBufferLength: 20,
    liveSyncDuration: 30,
    fragLoadingTimeOut: 4000,              // used by fragment-loader
};

class HlsPeerifyBundle extends Hlsjs{

    static get P2PEvents() {
        return HlsPeerify.Events;
    }

    static get uaParserResult() {
        return HlsPeerify.uaParserResult;
    }

    constructor(config = {}) {

        let p2pConfig = config.p2pConfig || {};
        delete config.p2pConfig;

        let mergedHlsjsConfig = Object.assign({}, recommendedHlsjsConfig, config);

        super(mergedHlsjsConfig);

        if (HlsPeerify.WEBRTC_SUPPORT) {
            this.p2pPlugin = new HlsPeerify(this, p2pConfig);
        }


    }

    enableP2P() {
        this.p2pPlugin.enableP2P();
    }

    disableP2P() {
        this.p2pPlugin.disableP2P();
    }


}

HlsPeerifyBundle.pluginVersion = HlsPeerify.version;

export default HlsPeerifyBundle
