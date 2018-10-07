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

        // let merged = Object.assign({}, recommendedHlsjsConfig, config);
        // console.warn(`merged ${JSON.stringify(merged, null, 2)}`);

        if (config.liveSyncDurationCount) delete recommendedHlsjsConfig.liveSyncDuration;

        let mergedHlsjsConfig = recommendedHlsjsConfig;
        for (let prop in config) {
            mergedHlsjsConfig[prop] = config[prop];
        }

        super(mergedHlsjsConfig);

        if (P2PEngine.isSupported()) {
            this._p2pEngine = new P2PEngine(this, p2pConfig);
        }

        this.on(Hlsjs.Events.DESTROYING, () => {
            console.warn('destroying hlsjs');
            this._p2pEngine.destroy();
            this._p2pEngine = null;
        });
    }

    get p2pEngine() {
        return this._p2pEngine;
    }

    get engine() {
        console.warn(`The property 'engine' is deprecated, use p2pEngine instead`);
        return this._p2pEngine;
    }

    enableP2P() {
        this._p2pEngine.enableP2P();
    }

    disableP2P() {
        this._p2pEngine.disableP2P();
    }


}

CDNByeHlsjs.engineVersion = P2PEngine.version;           //the current version of p2p engine

CDNByeHlsjs.WEBRTC_SUPPORT = P2PEngine.isSupported();   //check if webrtc is supported in this browser

export default CDNByeHlsjs
