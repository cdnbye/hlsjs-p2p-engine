/**
 * Created by xieting on 2018/1/2.
 */

import HlsPeerify from './index.hls-peerify';
import Hlsjs from 'hls.js';
import Events from './events';

import {recommendedHlsjsConfig} from './config';


class HlsPeerifyBundle extends Hlsjs{

    static get P2PEvents() {
        return Events;
    }

    constructor(p2pConfig, hlsjsConfig = {}) {


        let mergedHlsjsConfig = Object.assign({}, recommendedHlsjsConfig, hlsjsConfig);

        super(mergedHlsjsConfig);

        if (HlsPeerify.WEBRTC_SUPPORT) {
            this.p2pPlugin = new HlsPeerify(this, p2pConfig);
        }


    }


}

HlsPeerifyBundle.pluginVersion = HlsPeerify.version;

export default HlsPeerifyBundle
