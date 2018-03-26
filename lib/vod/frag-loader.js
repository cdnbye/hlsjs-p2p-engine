/**
 * Created by xieting on 2018/3/23.
 */

import EventEmitter from 'events';
// import Events from './events';
import XhrLoader from '../utils/xhr-loader';
// import Buffer from 'buffer';

const log = console.log;

class FragLoader extends EventEmitter {
    constructor(config) {
        super();

        //denoted by sn
        this.currLoaded = config.currLoaded;
        this.currLoadedDuration = config.currLoadedDuration;              //最新下载的块的时长
        this.currPlay = config.currPlay;

        this.bufMgr = config.bufMgr;
        this.xhrLoader = new XhrLoader(config);
        this.p2pEnabled = config.p2pEnabled;
    }

    destroy() {
        this.abort();
    }

    abort() {
        this.xhrLoader.abort();
    }

    /*
     首先从缓存中寻找请求的seg，如果缓存中找不到则用http请求。
     */
    load(context, config, callbacks) {
        const frag = context.frag;
        if (this.bufMgr.hasSegOfURL(frag.relurl)) {                                     //如果命中缓存
            console.warn(`bufMgr found seg sn ${frag.sn} url ${frag.relurl}`);
            let seg = this.bufMgr.getSegByURL(frag.relurl);
            let response = { url : context.url, data : seg.data }, trequest, tfirst, tload, loaded, total;
            trequest = performance.now();
            tfirst = tload = trequest + 50;
            loaded = total = seg.size;
            let stats={ trequest, tfirst, tload, loaded, total, retry: 0 };
            // console.warn(`bufMgr onSuccess ${JSON.stringify(this.bufMgr.tmp.data.byteLength, null, 1)}  ${JSON.stringify(stats, null, 1)} ${JSON.stringify(context, null, 1)}`)
            window.setTimeout(() => {                                                   //必须是异步回调
                callbacks.onSuccess(response, stats, context);
            }, 50)
        } else {                                                                        //否则用http下载
            log(`xhrLoader load ${frag.relurl} at ${frag.sn}`);
            this.loader = this.xhrLoader;
            context.frag.loadByXhr = true;
            const onSuccess = callbacks.onSuccess;
            callbacks.onSuccess = (response, stats, context) => {
                if (!this.bufMgr.hasSegOfURL(frag.relurl)) {
                    this.bufMgr.copyAndAddSeg(response.data, frag.relurl, frag.sn);
                }
                onSuccess(response,stats,context);
            };
            this.xhrLoader.load(context, config, callbacks);
        }
    }


}


export default FragLoader;