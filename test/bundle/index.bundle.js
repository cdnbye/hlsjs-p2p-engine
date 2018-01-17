/**
 * Created by xieting on 2018/1/2.
 */
// import HlsPeerify from '../dist/hls-peerify';
// import Hls from 'hls.js';
// import Hls from '../dist/hls-peerify-bundle';
// var Hls = require('../dist/hls-peerify-bundle');
import HlsJS from '../../peerify-hls';

if(HlsJS.isSupported()) {
    var video = document.querySelector('#video');
    video.muted=true;

    var hlsjsConfig = {
        // debug: true,
//      pLoader : pLoader,
    }

    var p2pConfig = {
        debug: true,
        websocketAddr: 'ws://120.78.168.126:3389',
        reportInterval: 36000,
    };

    // var hls = new Hlsjs(p2pConfig, hlsjsConfig);
    var hls = new HlsJS(hlsjsConfig);
    // new HlsPeerify(hls, p2pConfig);

    hls.loadSource('https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8');
//        hls.loadSource('https://video-dev.github.io/streams/test_001/stream.m3u8');
//        hls.loadSource('http://112.90.52.139/hls/test.m3u8');
//     hls.loadSource('http://wowza.peer5.com/live/smil:bbb_abr.smil/chunklist_w794046364_b2204000.m3u8');
    hls.attachMedia(video);
    hls.on(HlsJS.Events.MANIFEST_PARSED,function(event, data) {
        hls.loadLevel = 0;
        video.play();
        // cpm.downloadresult.classList.remove('sr-only');
    });
//     hls.on(Hls.Events.FRAG_LOADED, (id, data) => {
//         var frag = data.frag;
// //            console.warn(`sn ${frag.sn} relurl ${frag.relurl} level ${frag.level} downloaded ${frag.loaded} source ${frag.loadByXhr?'CDN':'P2P'}`);
//         var source = frag.loadByXhr?'CDN':'P2P';
//         addToTable(frag.sn, frag.relurl, frag.level, frag.loaded, source);
//     });
//
    hls.on(HlsJS.Events.ERROR, function (event, data) {
        var errorType = data.type;
        var errorDetails = data.details;
        var errorFatal = data.fatal;
        console.warn('warn details:'+errorDetails);
//      switch(data.details) {
//        case hls.ErrorDetails.FRAG_LOAD_ERROR:
//          // ....
//          break;
//        default:
//          break;
//      }
    });
}