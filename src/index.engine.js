import EventEmitter from 'events';
import URLToolkit from 'url-toolkit';
import defaultP2PConfig from './config';
import {Tracker, FragLoader} from './bittorrent';
import SegmentManager from './segment-manager';
import {Events, Fetcher, getBrowserRTC, DataChannel} from 'core';
import Logger from './utils/logger';
import platform from './utils/platform';
import { defaultChannelId, defaultSegmentId, isBlockType} from './utils/toolFuns';

class P2PEngine extends EventEmitter {

    static get Events() {
        return Events;
    }

    constructor(hlsjs, p2pConfig) {

        super();

        this.config = Object.assign({}, defaultP2PConfig, p2pConfig);

        if (!this.config.channelId || typeof this.config.channelId !== 'function') {
            this.config.channelId = defaultChannelId;
        }
        if (!this.config.segmentId || typeof this.config.segmentId !== 'function') {
            this.config.segmentId = defaultSegmentId;
        }
        hlsjs.config.segmentId = this.config.segmentId;

        this.hlsjs = hlsjs;

        this.p2pEnabled = this.config.p2pEnabled === false ? false : true;                                      //默认开启P2P

        hlsjs.config.currLoaded = hlsjs.config.currPlay = 0;

        this.HLSEvents = hlsjs.constructor.Events;

        const onLevelLoaded = (event, data) => {

            const isLive = data.details.live;
            this.config.live = isLive;
            // 浏览器信息
            this.browserInfo = {
                device: platform.getPlatform(),
                netType: platform.getNetType() || undefined,
                version: P2PEngine.version,
                tag: this.config.tag || this.hlsjs.constructor.version,
                live: isLive,
                agent: this.config.agent || undefined,
            };
            const signalId = URLToolkit.parseURL(this.config.wsSignalerAddr).netLoc.substr(2);
            this.channel = `${this.config.channelId(hlsjs.url, this.browserInfo)}|${signalId}[${DataChannel.VERSION}]`;
            //初始化logger
            let logger = new Logger(this.config, this.channel);
            this.hlsjs.config.logger = this.logger = logger;
            logger.info(`CDNBye version: ${P2PEngine.version} Hlsjs version: ${hlsjs.constructor.version}`);
            logger.info(`channel ${this.channel}`);
            this._init(this.channel, this.browserInfo);

            hlsjs.off(this.HLSEvents.LEVEL_LOADED, onLevelLoaded);
        };

        hlsjs.on(this.HLSEvents.LEVEL_LOADED, onLevelLoaded);

        // const onManifestParsed = (event, data) => {
        //
        //     console.warn(`manifest loaded ${JSON.stringify(data, null, 2)}`);
        //
        //     hlsjs.off(this.HLSEvents.MANIFEST_PARSED, onManifestParsed);
        // };
        //
        // hlsjs.on(this.HLSEvents.MANIFEST_PARSED, onManifestParsed);



        // console.log(`CDNBye v${P2PEngine.version} -- A Free and Infinitely Scalable Video P2P Engine. (https://github.com/cdnbye/hlsjs-p2p-engine)`);

    }

    _init(channel, browserInfo) {
        const { logger } = this;
        if (!this.p2pEnabled) return;

        this.hlsjs.config.p2pEnabled = this.p2pEnabled;
        //实例化SegmentManager
        this.bufMgr = new SegmentManager(this, this.config);
        this.hlsjs.config.bufMgr = this.bufMgr;


        //实例化Fetcher
        let fetcher = new Fetcher(this, 'free', window.encodeURIComponent(channel), this.config.announce, browserInfo);
        this.fetcher = fetcher;
        //实例化tracker服务器
        this.tracker = new Tracker(this, fetcher, this.config);
        this.tracker.scheduler.bufferManager = this.bufMgr;
        //替换fLoader
        this.hlsjs.config.fLoader = FragLoader;
        //向fLoader导入scheduler
        this.hlsjs.config.scheduler = this.tracker.scheduler;
        //在fLoader中使用fetcher
        this.hlsjs.config.fetcher = fetcher;
        //向fLoader导入p2pBlackList
        this.hlsjs.config.p2pBlackList = this.config.p2pBlackList;


        this.hlsjs.on(this.HLSEvents.FRAG_LOADING, (id, data) => {
            // log('FRAG_LOADING: ' + JSON.stringify(data.frag));
            let sn = data.frag.sn;
            if (!isBlockType(data.frag.url, this.config.p2pBlackList)) {
                logger.debug('loading frag ' + sn);
                this.emit(Events.FRAG_LOADING, sn);
            }
        });

        this.trackerTried = false;                                                   //防止重复连接ws
        this.hlsjs.on(this.HLSEvents.FRAG_LOADED, (id, data) => {
            let sn = data.frag.sn;
            if (!isBlockType(data.frag.url, this.config.p2pBlackList)) {
                this.hlsjs.config.currLoaded = sn;
                this.emit(Events.FRAG_LOADED, sn);
                this.hlsjs.config.currLoadedDuration = data.frag.duration;
                let bitrate = Math.round(data.frag.loaded*8/data.frag.duration);
                if (!this.trackerTried && !this.tracker.connected && this.config.p2pEnabled) {

                    this.tracker.scheduler.bitrate = bitrate;
                    logger.info(`bitrate ${bitrate}`);

                    this.tracker.resumeP2P();
                    this.trackerTried = true;
                }
                // this.streamingRate = (this.streamingRate*this.fragLoadedCounter + bitrate)/(++this.fragLoadedCounter);
                // this.tracker.scheduler.streamingRate = Math.floor(this.streamingRate);
                if (!data.frag.loadByHTTP) {
                    data.frag.loadByP2P = false;
                    data.frag.loadByHTTP = true;
                }
                // console.warn(`data.frag.url ${data.frag.url}`);
                // if (!this.checkTSPath(sn, data.frag.url)) {
                //     logger.warn(`ts path of ${sn} equal to the previous, set tsStrictMatched to true`);
                //     this.config.tsStrictMatched = true;
                //     this.checkTSPath = noop;
                // }

                // 实验性功能
                if (this.config.p2pEnabled && this.bufMgr.hasSegOfSN(sn+1)) {
                    // console.warn(`found next seg in pool, sn ${sn+1}`);
                    // set the level for next loaded fragment
                    const nextSegId = this.bufMgr.getSegIdbySN(sn+1);
                    const nextLevel = this.bufMgr.getSegById(nextSegId).level
                    // console.warn(`change nextLoadLevel to ${nextLevel}`);
                    this.hlsjs.nextLoadLevel = nextLevel;
                }
            }
        });

        this.hlsjs.on(this.HLSEvents.FRAG_CHANGED, (id, data) => {
            if (!isBlockType(data.frag.url, this.config.p2pBlackList)) {
                logger.debug('frag changed: '+data.frag.sn);
                const sn = data.frag.sn;
                this.hlsjs.config.currPlay = sn;
                this.emit(Events.FRAG_CHANGED, sn);
            }
        });

        this.hlsjs.on(this.HLSEvents.ERROR, (event, data) => {
            logger.error(`errorType ${data.type} details ${data.details} errorFatal ${data.fatal}`);
            const errDetails = this.hlsjs.constructor.ErrorDetails;
            switch (data.details) {
                case errDetails.BUFFER_STALLED_ERROR:
                    this.fetcher.errsBufStalled ++;
                    break;
                case errDetails.INTERNAL_EXCEPTION:
                    this.fetcher.errsInternalExpt ++;
                    break;
                default:
            }
        });

    }

    disableP2P() {                                              //停止p2p
        if (this.logger) this.logger.warn(`disable P2P`);   // 防止在未初始化时就调用
        if (this.p2pEnabled) {
            this.p2pEnabled = false;
            this.config.p2pEnabled = this.hlsjs.config.p2pEnabled = this.p2pEnabled;
            if (this.tracker) {
                this.tracker.stopP2P();
                this.tracker = {};
                this.fetcher = null;
                this.bufMgr.destroy();
                this.bufMgr = null;
                this.hlsjs.config.fLoader = this.hlsjs.constructor.DefaultConfig.loader;
            }
        }
    }

    enableP2P() {                                               //在停止的情况下重新启动P2P
        if (!this.p2pEnabled) {
            this.logger.warn(`enable P2P`);
            this.p2pEnabled = true;
            this.config.p2pEnabled = this.hlsjs.config.p2pEnabled = this.p2pEnabled;
            this._init(this.channel, this.browserInfo);
        }
    }

    destroy() {
        this.disableP2P();
        this.removeAllListeners();
        this.logger.warn(`destroy p2p engine`);
    }

    get version() {
        return P2PEngine.version;
    }

    static isSupported() {
        const browserRTC = getBrowserRTC();
        return (browserRTC && (browserRTC.RTCPeerConnection.prototype.createDataChannel !== undefined));
    }

}

P2PEngine.WEBRTC_SUPPORT = !!getBrowserRTC();   // deprecated

P2PEngine.version = __VERSION__;

export default P2PEngine
