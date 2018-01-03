/**
 * Created by xieting on 2018/1/2.
 */
// let UAParser = require('ua-parser-js');


class HlsPeerify {

    constructor(hlsjs, p2pConfig) {


        hlsjs.on(hlsjs.constructor.Events.FRAG_CHANGED,function(id, frag) {
            console.log('FRAG_CHANGED: '+JSON.stringify(frag));
        });
    }


}

HlsPeerify.version = __VERSION__;

export default HlsPeerify
