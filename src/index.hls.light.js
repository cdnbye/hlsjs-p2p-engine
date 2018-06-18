

import P2PEngine from './index.engine';
import Hlsjs from 'hls.js/dist/hls.light';

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

CDNByeHlsjs.pluginVersion = P2PEngine.version;

export default CDNByeHlsjs
