
// var HLSJS_PATH = __HLSJS_PATH__

import P2PEngine from './index.engine';
var a = false;
const Hlsjs = (a === true ? require('hls.js') : require('hls.js/dist/hls.light.js'));

// import Hlsjs from HLSJS_PATH;

let recommendedHlsjsConfig = {
    maxBufferSize: 0,
    maxBufferLength: 30,
    liveSyncDuration: 30,
    fragLoadingTimeOut: 4000,              // used by fragment-loader
};

class CDNByeHlsjs extends Hlsjs{

    static get P2PEvents() {
        return P2PEngine.Events;
    }

    static get uaParserResult() {
        return P2PEngine.uaParserResult;
    }

    constructor(config = {}) {

        let p2pConfig = config.p2pConfig || {};
        delete config.p2pConfig;

        let mergedHlsjsConfig = Object.assign({}, recommendedHlsjsConfig, config);

        super(mergedHlsjsConfig);

        if (P2PEngine.WEBRTC_SUPPORT) {
            this.engine = new P2PEngine(this, p2pConfig);
        }


    }

    enableP2P() {
        this.engine.enableP2P();
    }

    disableP2P() {
        this.engine.disableP2P();
    }


}

CDNByeHlsjs.engineVersion = P2PEngine.version;           //the current version of p2p engine

CDNByeHlsjs.WEBRTC_SUPPORT = P2PEngine.WEBRTC_SUPPORT;   //check if webrtc is supported in this browser

export default CDNByeHlsjs
