/**
 * Created by xieting on 2018/3/23.
 */

import EventEmitter from 'events';

class FragLoader extends EventEmitter {
    constructor(config) {
        super();

        //denoted by sn
        this.currLoaded = config.currLoaded;
        this.currLoadedDuration = config.currLoadedDuration;              //最新下载的块的时长
        this.currPlay = config.currPlay;

        this.bufMgr = config.bufMgr;
        this.xhrLoader = new config.loader(config);
        this.p2pEnabled = config.p2pEnabled;
        this.scheduler = config.scheduler;
        this.fetcher = config.fetcher;
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
            logger.debug(`bufMgr found seg sn ${frag.sn} url ${frag.relurl}`);
            let seg = this.bufMgr.getSegByURL(frag.relurl);
            let response = { url : context.url, data : seg.data }, trequest, tfirst, tload, loaded, total;
            trequest = performance.now();
            tfirst = tload = trequest + 50;
            loaded = total = frag.loaded = seg.size;
            let stats={ trequest, tfirst, tload, loaded, total, retry: 0 };
            context.frag.loadByP2P = true;
            window.setTimeout(() => {                                                   //必须是异步回调
                this.fetcher.reportFlow(stats, true);
                callbacks.onSuccess(response, stats, context);
            }, 50)
        } else if (this.scheduler.peersHasSN(frag.sn)) {                             //如果在peers的bitmap中找到
            logger.info(`found sn ${frag.sn} from peers`);
            context.frag.loadByP2P = true;
            this.scheduler.load(context, config, callbacks);
            callbacks.onTimeout = (stats, context) => {                             //如果P2P下载超时则立即切换到xhr下载
                logger.debug(`xhrLoader load ${frag.relurl} at ${frag.sn}`);
                context.frag.loadByP2P = false;
                this.xhrLoader.load(context, config, callbacks);
            };
            const onSuccess = callbacks.onSuccess;
            callbacks.onSuccess = (response, stats, context) => {                       //在onsucess回调中复制并缓存二进制数据
                if (!this.bufMgr.hasSegOfURL(frag.relurl)) {
                    this.bufMgr.copyAndAddBuffer(response.data, frag.relurl, frag.sn);
                }
                this.fetcher.reportFlow(stats, true);
                frag.loaded = stats.loaded;
                onSuccess(response,stats,context);
            };
        } else {
            logger.debug(`xhrLoader load ${frag.relurl} at ${frag.sn}`);
            context.frag.loadByP2P = false;
            this.xhrLoader.load(context, config, callbacks);
            const onSuccess = callbacks.onSuccess;
            callbacks.onSuccess = (response, stats, context) => {                       //在onsucess回调中复制并缓存二进制数据
                if (!this.bufMgr.hasSegOfURL(frag.relurl)) {
                    this.bufMgr.copyAndAddBuffer(response.data, frag.relurl, frag.sn);
                }
                this.fetcher.reportFlow(stats, false);
                onSuccess(response,stats,context);
            };
        }
    }


}


export default FragLoader;