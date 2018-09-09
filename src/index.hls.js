import P2PEngine from './index.engine';

var Hlsjs;
if (__IS_HLSJS_LIGHT__) {
    Hlsjs = require('hls.js/dist/hls.light');
} else {
    Hlsjs = require('hls.js');
}

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

    constructor(config = {}) {

        let p2pConfig = config.p2pConfig || {};
        delete config.p2pConfig;

        let mergedHlsjsConfig = Object.assign({}, recommendedHlsjsConfig, config);

        super(mergedHlsjsConfig);

        if (P2PEngine.isSupported()) {
            this.engine = new P2PEngine(this, p2pConfig);
        }

        this.on(Hlsjs.Events.DESTROYING, () => {
            console.warn('destroying hlsjs');
            this.engine.destroy();
            this.engine = null;
        });
    }

    enableP2P() {
        this.engine.enableP2P();
    }

    disableP2P() {
        this.engine.disableP2P();
    }


}

CDNByeHlsjs.engineVersion = P2PEngine.version;           //the current version of p2p engine

CDNByeHlsjs.WEBRTC_SUPPORT = P2PEngine.isSupported();   //check if webrtc is supported in this browser

export default CDNByeHlsjs
