/**
 * Created by xieting on 2018/1/2.
 */

import HlsPeerify from './index.hls-peerify';
import Hlsjs from 'hls.js';
import UAParser from 'ua-parser-js';
import {recommendedHlsjsConfig} from './config';

const uaParserResult = (new UAParser()).getResult();

class HlsPeerifyBundle extends Hlsjs{
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
