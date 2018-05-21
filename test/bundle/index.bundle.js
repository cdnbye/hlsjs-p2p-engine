/**
 * Created by xieting on 2018/1/2.
 */
// import HlsPeerify from '../dist/hls-peerify';
// import Hls from 'hls.js';
// import Hls from '../dist/hls-peerify-bundle';
// var Hls = require('../dist/hls-peerify-bundle');

// import Hls from '../../src/index.hls';

if(Hls.isSupported()) {
    var video = document.querySelector('#video');
    video.muted=true;

    var hlsjsConfig = {
        // debug: true,
//      pLoader : pLoader,
        p2pConfig: {
            logLevel: 'debug',
        }
    };

    var hls = new Hls(hlsjsConfig);
    // new HlsPeerify(hls, p2pConfig);

    // hls.loadSource('https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8');
//        hls.loadSource('https://video-dev.github.io/streams/test_001/stream.m3u8');
//        hls.loadSource('http://112.90.52.139/hls/test.m3u8');
    hls.loadSource('https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8');
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED,function(event, data) {
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
    hls.on(Hls.Events.ERROR, function (event, data) {
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