/**
 * Created by xieting on 2018/1/2.
 */

import EventEmitter from 'events';
import defaultP2PConfig from './config';
import {Tracker, FragLoader} from './bittorrent';
import BufferManager from './buffer-manager';
import UAParser from 'ua-parser-js';
import {Events, Fetcher, getBrowserRTC} from './cdnbye-core';
import Logger from './utils/logger';

const uaParserResult = (new UAParser()).getResult();
// let logger;

class P2PEngine extends EventEmitter {

    static get Events() {
        return Events;
    }

    static get uaParserResult() {
        return uaParserResult;
    }

    constructor(hlsjs, p2pConfig) {

        super();

        this.config = Object.assign({}, defaultP2PConfig, p2pConfig);
        this.hlsjs = hlsjs;
        this.p2pEnabled = this.config.disableP2P === false ? false : true;                                      //默认开启P2P

        hlsjs.config.currLoaded = hlsjs.config.currPlay = 0;

        const onLevelLoaded = (event, data) => {

            const isLive = data.details.live;
            this.config.live = isLive;
            let channel = hlsjs.url.split('?')[0];

            //初始化logger
            let logger = new Logger(this.config, channel);
            window.logger = logger;

            this._init(channel);

            hlsjs.off(hlsjs.constructor.Events.LEVEL_LOADED, onLevelLoaded);
        };

        hlsjs.on(hlsjs.constructor.Events.LEVEL_LOADED, onLevelLoaded);



        //streaming rate
        // this.streamingRate = 0;                        //单位bps
        // this.fragLoadedCounter = 0;
    }

    _init(channel) {

        //上传浏览器信息
        let browserInfo = {
            browser: uaParserResult.browser.name,
            device: uaParserResult.device.type === 'mobile' ? 'mobile' : 'PC',
            os: uaParserResult.os.name
        };


        this.hlsjs.config.p2pEnabled = this.p2pEnabled;
        //实例化BufferManager
        this.bufMgr = new BufferManager(this.config);
        this.hlsjs.config.bufMgr = this.bufMgr;


        //实例化Fetcher
        let fetcher = new Fetcher(this.config.key, window.encodeURIComponent(channel), this.config.announce, browserInfo);
        this.fetcher = fetcher;
        //实例化tracker服务器
        this.signaler = new Tracker(fetcher, this.config);
        this.signaler.scheduler.bufferManager = this.bufMgr;
        //替换fLoader
        this.hlsjs.config.fLoader = FragLoader;
        //向loader导入scheduler
        this.hlsjs.config.scheduler = this.signaler.scheduler;
        //在fLoader中使用fetcher
        this.hlsjs.config.fetcher = fetcher;
        //统计下载和上次信息
        this.signaler.on('download', info => {
            this.emit('download', info);
        })
            .on('upload', info => {
                this.emit('upload', info);
            })
            .on('stats', info => {
                this.emit('stats', info);
            });


        this.hlsjs.on(this.hlsjs.constructor.Events.FRAG_LOADING, (id, data) => {
            // log('FRAG_LOADING: ' + JSON.stringify(data.frag));
            logger.debug('FRAG_LOADING: ' + data.frag.sn);
            this.signaler.currentLoadingSN = data.frag.sn;
        });

        this.signalTried = false;                                                   //防止重复连接ws
        this.hlsjs.on(this.hlsjs.constructor.Events.FRAG_LOADED, (id, data) => {
            let sn = data.frag.sn;
            this.hlsjs.config.currLoaded = sn;
            this.signaler.currentLoadedSN = sn;                                //用于BT算法
            this.hlsjs.config.currLoadedDuration = data.frag.duration;
            let bitrate = Math.round(data.frag.loaded*8/data.frag.duration);
            this.emit('stats', {bitrate});
            if (!this.signalTried && !this.signaler.connected && this.config.p2pEnabled) {

                this.signaler.scheduler.bitrate = bitrate;
                logger.info(`FRAG_LOADED bitrate ${bitrate}`);

                this.signaler.resumeP2P();
                this.signalTried = true;
            }
            // this.streamingRate = (this.streamingRate*this.fragLoadedCounter + bitrate)/(++this.fragLoadedCounter);
            // this.signaler.scheduler.streamingRate = Math.floor(this.streamingRate);

        });

        this.hlsjs.on(this.hlsjs.constructor.Events.FRAG_CHANGED, (id, data) => {
            // log('FRAG_CHANGED: '+JSON.stringify(data.frag, null, 2));
            logger.debug('FRAG_CHANGED: '+data.frag.sn);
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
        console.log(`disableP2P`);
        if (this.p2pEnabled) {
            this.p2pEnabled = false;
            this.config.p2pEnabled = this.hlsjs.config.p2pEnabled = this.p2pEnabled;
            if (this.signaler) {
                this.signaler.stopP2P();
            }
        }
    }

    enableP2P() {                                               //在停止的情况下重新启动P2P
        console.log(`enableP2P`);
        if (!this.p2pEnabled) {
            this.p2pEnabled = true;
            this.config.p2pEnabled = this.hlsjs.config.p2pEnabled = this.p2pEnabled;
            if (this.signaler) {
                this.signaler.resumeP2P();
            }
        }
    }



}

P2PEngine.WEBRTC_SUPPORT = !!getBrowserRTC();

P2PEngine.version = __VERSION__;

export default P2PEngine
