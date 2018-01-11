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
      首先从缓存中寻找请求的seg，如果缓存中找不到则在urgent情况下用http请求，非urgent情况下用p2p请求。
     */
    load(context, config, callbacks) {
        const frag = context.frag;
        let seg;

        if (this.bufMgr.hasSegOfURL(frag.relurl)) {
            seg = this.bufMgr.getSegByURL(frag.relurl);
        }
        if (false) {                                                                     //如果buffer-manager找到了seg
            log(`bufMgr found seg ${frag.relurl} at ${frag.sn}`);
            let response = {
                url: seg.relurl,
                payload: seg.data
            };
            let stats = {trequest: performance.now(), retry: 0, tfirst: performance.now(),
                loaded: seg.size, tload: performance.now(), total: seg.size};
            callbacks.onSuccess(response, stats, context);
        } else {
            this.loadByP2P = (frag.sn - this.currPlay > 1) && (frag.sn - this.currLoaded == 1)
                && (this.currLoaded - this.currPlay > 1) && this.p2pLoader.hasUpstreamer;
            log(`loading ${frag.sn} loaded ${this.currLoaded} play ${this.currPlay} loaded by ${this.loadByP2P?'P2P':'HTTP'}`);

            if (this.loadByP2P) {                                                      //如果非urgent且有父节点则用p2p下载
                this.loader = this.p2pLoader;
            } else {
                log(`xhrLoader load ${frag.relurl} at ${frag.sn}`);
                this.loader = this.xhrLoader;
                context.loadByXhr = true;
            }

            const onSuccess = callbacks.onSuccess;
            callbacks.onSuccess = (response, stats, context) => {
                if (this.bufMgr && !this.bufMgr.hasSegOfURL(frag.relurl)) {
                    this._copyFrag(response.data, frag.relurl, frag.sn);
                }
                onSuccess(response,stats,context);
            };
            const onTimeout = callbacks.onTimeout;
            callbacks.onTimeout = (stats, context) => {
                if (context.loadByXhr) {                                        //如果用xhrloader请求超时，则改成p2p下载
                    log(`last loaded by xhr`);
                    this.p2pLoader.load(context, config, callbacks);
                } else {
                    onTimeout(stats, context, null);
                }
            };
            this.loader.load(context, config, callbacks);
        }
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