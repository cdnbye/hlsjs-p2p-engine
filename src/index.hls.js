/**
 * Created by xieting on 2018/1/2.
 */

import CDNBye from './index.engine';
import Hlsjs from 'hls.js';
// import Hlsjs from 'hls.js/dist/hls.light';

let recommendedHlsjsConfig = {
    maxBufferSize: 0,
    maxBufferLength: 30,
    liveSyncDuration: 30,
    fragLoadingTimeOut: 4000,              // used by fragment-loader
};

class CDNByeHlsjs extends Hlsjs{

    static get P2PEvents() {
        return CDNBye.Events;
    }

    static get uaParserResult() {
        return CDNBye.uaParserResult;
    }

    constructor(config = {}) {

        let p2pConfig = config.p2pConfig || {};
        delete config.p2pConfig;

        let mergedHlsjsConfig = Object.assign({}, recommendedHlsjsConfig, config);

        super(mergedHlsjsConfig);

        if (CDNBye.WEBRTC_SUPPORT) {
            this.p2pPlugin = new CDNBye(this, p2pConfig);
        }


    }

    enableP2P() {
        this.p2pPlugin.enableP2P();
    }

    disableP2P() {
        this.p2pPlugin.disableP2P();
    }


}

CDNByeHlsjs.pluginVersion = CDNBye.version;

export default CDNByeHlsjs
