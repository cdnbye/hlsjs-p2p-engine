/**
 * Created by xieting on 2018/1/2.
 */

let HlsPeerify = require('./index.hls-peerify');
let Hlsjs = require('hls.js');
let UAParser = require('ua-parser-js');
//
// const uaParserResult = (new UAParser()).getResult();

class HlsPeerifyBundle {
    constructor() {

        new HlsPeerify(1,2);
        console.log('HlsPeerifyBundle')
    }
}

module.exports = HlsPeerifyBundle;
