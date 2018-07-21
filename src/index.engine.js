import EventEmitter from 'events';
import defaultP2PConfig from './config';
import {Tracker, FragLoader} from './bittorrent';
import BufferManager from './buffer-manager';
import {Events, Fetcher, getBrowserRTC, DataChannel} from 'core';
import Logger from './utils/logger';
import platform from './utils/platform';
import { defaultChannelId } from './utils/toolFuns';

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

        this.hlsjs = hlsjs;
        this.p2pEnabled = this.config.disableP2P === false ? false : true;                                      //默认开启P2P

        hlsjs.config.currLoaded = hlsjs.config.currPlay = 0;

        const onLevelLoaded = (event, data) => {

            const isLive = data.details.live;
            this.config.live = isLive;
            // 浏览器信息
            let browserInfo = {
                device: platform.getPlatform(),
                netType: platform.getNetType(),
                host: window.location.host,
                version: P2PEngine.version,
                tag: this.config.tag || this.hlsjs.constructor.version,
            };
            let channel = this.config.channelId(hlsjs.url, DataChannel.VERSION, browserInfo);
            //初始化logger
            let logger = new Logger(this.config, channel);
            this.hlsjs.config.logger = this.logger = logger;
            logger.info(`channel ${channel}`);
            this._init(channel, browserInfo);

            hlsjs.off(hlsjs.constructor.Events.LEVEL_LOADED, onLevelLoaded);
        };

        hlsjs.on(hlsjs.constructor.Events.LEVEL_LOADED, onLevelLoaded);

        // 免费版需要打印版本信息
        if (this.config.key === 'free') {
            console.log(`CDNBye v${P2PEngine.version} -- A Free and Infinitely Scalable Video P2P Engine. (https://github.com/cdnbye/hlsjs-p2p-engine)`);
        }
    }

    _init(channel, browserInfo) {
        const { logger } = this;


        this.hlsjs.config.p2pEnabled = this.p2pEnabled;
        //实例化BufferManager
        this.bufMgr = new BufferManager(this, this.config);
        this.hlsjs.config.bufMgr = this.bufMgr;


        //实例化Fetcher
        let fetcher = new Fetcher(this, this.config.key, window.encodeURIComponent(channel), this.config.announce, browserInfo);
        this.fetcher = fetcher;
        //实例化tracker服务器
        this.signaler = new Tracker(this, fetcher, this.config);
        this.signaler.scheduler.bufferManager = this.bufMgr;
        //替换fLoader
        this.hlsjs.config.fLoader = FragLoader;
        //向fLoader导入scheduler
        this.hlsjs.config.scheduler = this.signaler.scheduler;
        //在fLoader中使用fetcher
        this.hlsjs.config.fetcher = fetcher;


        this.hlsjs.on(this.hlsjs.constructor.Events.FRAG_LOADING, (id, data) => {
            // log('FRAG_LOADING: ' + JSON.stringify(data.frag));
            logger.debug('loading frag ' + data.frag.sn);
            this.signaler.currentLoadingSN = data.frag.sn;

        });

        this.signalTried = false;                                                   //防止重复连接ws
        this.hlsjs.on(this.hlsjs.constructor.Events.FRAG_LOADED, (id, data) => {
            let sn = data.frag.sn;
            this.hlsjs.config.currLoaded = sn;
            this.signaler.currentLoadedSN = sn;                                //用于BT算法
            this.hlsjs.config.currLoadedDuration = data.frag.duration;
            let bitrate = Math.round(data.frag.loaded*8/data.frag.duration);
            if (!this.signalTried && !this.signaler.connected && this.config.p2pEnabled) {

                this.signaler.scheduler.bitrate = bitrate;
                logger.info(`bitrate ${bitrate}`);

                this.signaler.resumeP2P();
                this.signalTried = true;
            }
            // this.streamingRate = (this.streamingRate*this.fragLoadedCounter + bitrate)/(++this.fragLoadedCounter);
            // this.signaler.scheduler.streamingRate = Math.floor(this.streamingRate);
            if (!data.frag.loadByHTTP) {
                data.frag.loadByP2P = false;
                data.frag.loadByHTTP = true;
            }
        });

        this.hlsjs.on(this.hlsjs.constructor.Events.FRAG_CHANGED, (id, data) => {
            // log('FRAG_CHANGED: '+JSON.stringify(data.frag, null, 2));
            logger.debug('frag changed: '+data.frag.sn);
            const sn = data.frag.sn;
            this.hlsjs.config.currPlay = sn;
            this.signaler.currentPlaySN = sn;
        });

        this.hlsjs.on(this.hlsjs.constructor.Events.ERROR, (event, data) => {
            logger.error(`errorType ${data.type} details ${data.details} errorFatal ${data.fatal}`);
            const errDetails = this.hlsjs.constructor.ErrorDetails;
            switch (data.details) {
                case errDetails.FRAG_LOAD_ERROR:
                case errDetails.FRAG_LOAD_TIMEOUT:
                    this.fetcher.errsFragLoad ++;
                    break;
                case errDetails.BUFFER_STALLED_ERROR:
                    this.fetcher.errsBufStalled ++;
                    break;
                case errDetails.INTERNAL_EXCEPTION:
                    this.fetcher.errsInternalExpt ++;
                    break;
                default:
            }
        });

        this.hlsjs.on(this.hlsjs.constructor.Events.DESTROYING, () => {
            // log('DESTROYING: '+JSON.stringify(frag));
            this.signaler.destroy();
            this.signaler = null;

        });
    }

    disableP2P() {                                              //停止p2p
        const { logger } = this;
        logger.warn(`disable P2P`);
        if (this.p2pEnabled) {
            this.p2pEnabled = false;
            this.config.p2pEnabled = this.hlsjs.config.p2pEnabled = this.p2pEnabled;
            if (this.signaler) {
                this.signaler.stopP2P();
            }
        }
    }

    enableP2P() {                                               //在停止的情况下重新启动P2P
        const { logger } = this;
        logger.warn(`enable P2P`);
        if (!this.p2pEnabled) {
            this.p2pEnabled = true;
            this.config.p2pEnabled = this.hlsjs.config.p2pEnabled = this.p2pEnabled;
            if (this.signaler) {
                this.signaler.resumeP2P();
            }
        }
    }

    get version() {
        return P2PEngine.version;
    }

}

P2PEngine.WEBRTC_SUPPORT = !!getBrowserRTC();

P2PEngine.version = __VERSION__;

export default P2PEngine
