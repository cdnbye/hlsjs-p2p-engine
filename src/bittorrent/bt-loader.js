import EventEmitter from 'events';
// import URLToolkit from 'url-toolkit';
import {isBlockType} from '../utils/toolFuns';

class FragLoader extends EventEmitter {
    constructor(config) {
        super();

        this.logger = config.logger;
        //denoted by sn
        this.currLoaded = config.currLoaded;
        this.currLoadedDuration = config.currLoadedDuration;              //最新下载的块的时长
        this.currPlay = config.currPlay;

        this.bufMgr = config.bufMgr;
        this.xhrLoader = new config.loader(config);
        this.p2pEnabled = config.p2pEnabled;
        this.scheduler = config.scheduler;
        this.fetcher = config.fetcher;
        this.segmentId = config.segmentId;
        this.blockTypes = config.p2pBlackList;

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
        const { logger } = this;
        const frag = context.frag;
        // console.warn(`frag.duration: ${frag.duration}`);
        frag.loadByP2P = false;                //初始化flag
        frag.loadByHTTP = false;
        // console.warn(`load frag level ${frag.level} sn ${frag.sn}`);

        // 音频等非ts文件不使用P2P
        if (isBlockType(frag.url, this.blockTypes)) {
            logger.debug(`HTTP load blockType ${frag.url}`);
            context.frag.loadByHTTP = true;
            const onSuccess = callbacks.onSuccess;
            callbacks.onSuccess = (response, stats, context) => {                       //在onsucess回调中复制并缓存二进制数据
                this.fetcher.reportFlow(stats, false);
                logger.info(`HTTP load time ${stats.tload - stats.trequest}ms`);
                onSuccess(response,stats,context);
            };
            return this.xhrLoader.load(context, config, callbacks);
        }

        const segId = this.segmentId(frag.level, frag.sn, frag.url);
        if (this.p2pEnabled && this.bufMgr.hasSegOfId(segId)) {                                     //如果命中缓存
            logger.debug(`bufMgr found seg sn ${frag.sn} url ${frag.url}`);
            let seg = this.bufMgr.getSegById(segId);
            let response = { url : context.url, data : seg.data }, trequest, tfirst, tload, loaded, total;
            trequest = performance.now();
            tfirst = tload = trequest + 50;
            loaded = total = frag.loaded = seg.size;
            let stats={ trequest, tfirst, tload, loaded, total, retry: 0 };
            frag.loadByP2P = true;
            context.frag.fromPeerId = seg.fromPeerId;
            logger.debug(`bufMgr loaded ${frag.relurl} at ${frag.sn}`)
            window.setTimeout(() => {                                                   //必须是异步回调
                this.fetcher.reportFlow(stats, true);
                callbacks.onSuccess(response, stats, context);
            }, 50)
        } else if (this.p2pEnabled && this.scheduler.hasAndSetTargetPeer(frag.sn)) {                             //如果在peers的bitmap中找到
            context.frag.loadByP2P = true;
            this.scheduler.load(context, config, callbacks);
            const onTimeout = callbacks.onTimeout;
            callbacks.onTimeout = (stats, context) => {                             //如果P2P下载超时则立即切换到xhr下载
                logger.debug(`P2P timeout switched to HTTP load ${frag.relurl} at ${frag.sn}`);
                frag.loadByP2P = false;
                frag.loadByHTTP = true;
                this.xhrLoader.load(context, config, callbacks);
                callbacks.onTimeout = onTimeout;
            };
            const onSuccess = callbacks.onSuccess;
            callbacks.onSuccess = (response, stats, context) => {                       //在onsucess回调中复制并缓存二进制数据
                if (!this.bufMgr.hasSegOfId(segId)) {
                    this.bufMgr.handleFrag(frag.sn, frag.level, segId, response.data, frag.fromPeerId || this.fetcher.peerId, true);
                }
                this.fetcher.reportFlow(stats, frag.loadByP2P);
                frag.loaded = stats.loaded;
                logger.debug(`${frag.loadByP2P ? 'P2P' : 'HTTP'} loaded segment id ${segId}`);
                onSuccess(response,stats,context);
            };
        } else {
            logger.debug(`HTTP load ${frag.relurl} at ${frag.sn} level ${frag.level}`);
            context.frag.loadByHTTP = true;
            this.xhrLoader.load(context, config, callbacks);
            const onSuccess = callbacks.onSuccess;
            callbacks.onSuccess = (response, stats, context) => {                       //在onsucess回调中复制并缓存二进制数据
                if (!this.bufMgr.hasSegOfId(segId)) {
                    this.bufMgr.handleFrag(frag.sn, frag.level, segId, response.data, this.fetcher.peerId, true);
                }
                this.fetcher.reportFlow(stats, false);
                logger.info(`HTTP load time ${stats.tload - stats.trequest}ms`)
                this.scheduler.loadTimeSample = stats.tload - stats.trequest;
                onSuccess(response,stats,context);
            };
        }

        if (this.p2pEnabled) {
            this.scheduler.nextFragLoadTime = frag.duration;
        }
    }
}


export default FragLoader;