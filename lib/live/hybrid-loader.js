/**
 * Created by xieting on 2018/1/5.
 */

import EventEmitter from 'events';
// import Events from './events';
import XhrLoader from '../utils/xhr-loader';

const log = console.log;

class LoaderScheduler extends EventEmitter {
    constructor(config) {
        super();

        //denoted by sn
        this.currLoaded = config.currLoaded;
        this.currLoadedDuration = config.currLoadedDuration;              //最新下载的块的时长
        this.currPlay = config.currPlay;

        this.bufMgr = config.bufMgr;
        this.xhrLoader = new XhrLoader(config);
        this.p2pLoader = config.p2pLoader;
        this.p2pLoader.sourceStreamer = this.xhrLoader;                  //向p2pLoader注入源
        this.p2pEnabled = config.p2pEnabled;

        this.loader = this.xhrLoader;                                     //loader是当前用来下载的loader
    }

    destroy() {
        this.abort();
        this.loader = null;
    }

    abort() {
        this.loader.abort();
    }

    /*
      在urgent情况下用http请求，非urgent情况下用p2p请求。
     */
    load(context, config, callbacks) {
        const frag = context.frag;
        // console.warn(`${JSON.stringify(frag)}`)
        this.loadByP2P = (frag.sn - this.currPlay > 1) && (frag.sn - this.currLoaded == 1)
            && (this.currLoaded - this.currPlay >= 1) && this.p2pLoader.hasUpstreamer;
        log(`loading ${frag.sn} loaded ${this.currLoaded} play ${this.currPlay} loaded by ${this.loadByP2P?'P2P':'HTTP'}`);

        if (this.p2pEnabled && this.loadByP2P) {                                                      //如果非urgent且有父节点则用p2p下载
            config.p2pTimeout = this.currLoadedDuration;                             //本次p2p下载允许最大超时时间
            this.loader = this.p2pLoader;
        } else {
            log(`xhrLoader load ${frag.relurl} at ${frag.sn}`);
            this.loader = this.xhrLoader;
            context.frag.loadByXhr = true;
        }

        const onSuccess = callbacks.onSuccess;
        callbacks.onSuccess = (response, stats, context) => {
            if (this.bufMgr && !this.bufMgr.hasSegOfURL(frag.relurl)) {
                this.bufMgr.copyAndAddSeg(response.data, frag.relurl, frag.sn);
            }
            onSuccess(response,stats,context);
        };
        const onTimeout = callbacks.onTimeout;
        callbacks.onTimeout = (stats, context) => {
            if (context.frag.loadByXhr && this.p2pLoader.hasUpstreamer && this.p2pEnabled) {                                        //如果用xhrloader请求超时，则改成p2p下载
                log(`last loaded by xhr`);
                context.frag.loadByXhr = false;
                this.p2pLoader.load(context, config, callbacks);
            } else {
                onTimeout(stats, context, null);
            }
        };
        this.loader.load(context, config, callbacks);
    }
}


export default LoaderScheduler;