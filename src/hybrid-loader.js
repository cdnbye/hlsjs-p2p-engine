/**
 * Created by xieting on 2018/1/5.
 */

import debug from 'debug';
import EventEmitter from 'events';
import Events from './events';
import XhrLoader from 'hls.js/src/utils/xhr-loader';
// import Buffer from 'buffer';
var Buffer = require('buffer/').Buffer;

const log = debug('hybrid-loader');

class LoaderScheduler extends EventEmitter {
    constructor(config) {
        super();

        //denoted by sn
        this.currLoaded = config.currLoaded;
        this.currPlay = config.currPlay;

        this.bufMgr = config.bufMgr;
        this.xhrLoader = new XhrLoader(config);
        this.p2pLoader = config.p2pLoader;

        this.loader = this.xhrLoader;                 //loader是当前用来下载的loader
    }

    destroy() {
        this.abort();
        this.loader = null;
    }

    abort() {
        this.loader.abort();
    }

    /*
      currLoading-currPlay>1 && currLoading-currLoaded=1 的currLoading用p2p下载
      其他情况用http下载
     */
    load(context, config, callbacks) {
        const frag = context.frag;
        this.loadByP2P = (frag.sn - this.currPlay > 1) && (frag.sn - this.currLoaded == 1)
            && (this.currLoaded - this.currPlay >= 1) && this.p2pLoader.hasUpstreamer;
        log(`loading ${frag.sn} loaded ${this.currLoaded} play ${this.currPlay} loaded by ${this.loadByP2P?'P2P':'HTTP'}`);

        if (this.loadByP2P) {
            this.loader = this.p2pLoader;
        } else {
            log(`xhrLoader load ${frag.relurl} at ${frag.sn}`);
            this.loader = this.xhrLoader;
        }

        const onSuccess = callbacks.onSuccess;
        callbacks.onSuccess = (response, stats, context) => {
            this._copyFrag(response.data, frag.relurl, frag.sn);
            onSuccess(response,stats,context);
        };
        this.loader.load(context, config, callbacks);
    }

    _copyFrag(data, url, sn) {
        let payloadBuf = Buffer.from(data);
        let byteLength = payloadBuf.byteLength;
        let targetBuffer = new Buffer(byteLength);
        payloadBuf.copy(targetBuffer);

        let segment = {
            sn: sn,
            relurl: url,
            data: targetBuffer,
            size: byteLength
        };

        this.bufMgr.addSeg(segment);
        // this.emit(Events.SEGMENT, segment);

    }
}


export default LoaderScheduler;