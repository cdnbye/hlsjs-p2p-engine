/**
 * Created by xieting on 2018/1/2.
 */

import debug from 'debug';
import Events from './events';
import EventEmitter from 'events';
import {defaultP2PConfig} from './config';
import SimplePeer from 'simple-peer';
import P2PSignaler from './p2p-signaler';
import HybridLoader from './hybrid-loader';
import BufferManager from './buffer-manager';
import UAParser from 'ua-parser-js';

const log = debug('index.hls-peerify');
const uaParserResult = (new UAParser()).getResult();

class HlsPeerify extends EventEmitter {

    static get Events() {
        return Events;
    }

    static get uaParserResult() {
        return uaParserResult;
    }

    constructor(hlsjs, p2pConfig) {

        super();

        this.config = Object.assign({}, defaultP2PConfig, p2pConfig);
        if (this.config.debug) {
            debug.enable('*');
        } else {
            debug.disable();
        }

        this.hlsjs = hlsjs;
        this.p2pEnabled = true;                                      //默认开启P2P

       hlsjs.config.currLoaded = hlsjs.config.currPlay = 0;

        if (hlsjs.url) {
            let channel = hlsjs.url.split('?')[0];
            this._init(channel);
        } else {
            hlsjs.on(hlsjs.constructor.Events.MANIFEST_PARSED, (event, data) => {
                let channel = hlsjs.url.split('?')[0];
                this._init(channel);
            });
        }

        //level上报
        this.levelCounter = 0;
        this.averageLevel = -1;
        //流量上报
        this.cdnDownloaded = 0;
        this.p2pDownloaded = 0;
        this.reportIntervalId = window.setInterval(this._statisticsReport.bind(this), this.config.reportInterval*1000);
    }

    _init(channel) {

        //上传浏览器信息
        let browserInfo = {
            browser: uaParserResult.browser.name,
            device: uaParserResult.device.type === 'mobile' ? 'mobile' : 'PC',
            os: uaParserResult.os.name
        }

        //实例化信令
        this.signaler = new P2PSignaler(channel, this.config, browserInfo);

        //实例化BufferManager
        this.bufMgr = new BufferManager(this.config);
        this.hlsjs.config.bufMgr = this.bufMgr;

        //通过config向hybrid-loader导入p2p-scheduler
        this.hlsjs.config.p2pLoader = this.signaler.scheduler;

        //向hybrid-loader导入buffer-manager
        this.hlsjs.config.p2pLoader.bufMgr = this.bufMgr;

        //替换fLoader
        this.hlsjs.config.fLoader = HybridLoader;

        this.hlsjs.config.p2pEnabled = this.p2pEnabled;

        this.hlsjs.on(this.hlsjs.constructor.Events.FRAG_LOADING, (id, data) => {
            // log('FRAG_LOADING: ' + JSON.stringify(data.frag));
            log('FRAG_LOADING: ' + data.frag.sn);

            //level统计
            this.averageLevel = (this.averageLevel*this.levelCounter + data.frag.level)/(++this.levelCounter);
        });

        this.hlsjs.on(this.hlsjs.constructor.Events.FRAG_LOADED, (id, data) => {
            this.hlsjs.config.currLoaded = data.frag.sn;
            this.hlsjs.config.currLoadedDuration = data.frag.duration;
            if (data.frag.loadByXhr) {
                log(`FRAG_LOADED ${data.frag.sn} loadByXhr`);
                this.cdnDownloaded += data.frag.loaded;
            } else {
                log(`FRAG_LOADED ${data.frag.sn} loadByP2P`);
                this.p2pDownloaded += data.frag.loaded;
            }
        });

        this.hlsjs.on(this.hlsjs.constructor.Events.FRAG_CHANGED, (id, data) => {
            // log('FRAG_CHANGED: '+JSON.stringify(data.frag, null, 2));
            log('FRAG_CHANGED: '+data.frag.sn);
            this.hlsjs.config.currPlay = data.frag.sn;
        });

        // this.hlsjs.on(this.hlsjs.constructor.Events.LEVEL_LOADED, (id, data) => {
        //     log('LEVEL_LOADED totalduration: '+JSON.stringify(data.details.totalduration, null, 2));
        //     log('LEVEL_LOADED live: '+JSON.stringify(data.details.live, null, 2));
        // });



        this.hlsjs.on(this.hlsjs.constructor.Events.DESTROYING, () => {
            // log('DESTROYING: '+JSON.stringify(frag));
            this.signaler.destroy();
            this.signaler = null;

            window.clearInterval(this.reportIntervalId);
        });
    }

    disableP2P() {                                              //停止p2p
        if (this.p2pEnabled) {
            this.p2pEnabled = false;
            this.hlsjs.config.p2pEnabled = this.p2pEnabled;
            this.signaler.stopP2P();
        }
    }

    enableP2P() {                                               //在停止的情况下重新启动P2P
        log(`enableP2P`);
        if (!this.p2pEnabled) {
            this.p2pEnabled = true;
            this.hlsjs.config.p2pEnabled = this.p2pEnabled;
        }
    }

    _statisticsReport() {

        if (this.signaler) {
            let msg = {
                action: 'statistics',
                level: this.averageLevel.toFixed(2),
                cdn: Math.round(this.cdnDownloaded/1024),                  //单位KB
                p2p: Math.round(this.p2pDownloaded/1024)
            };
            this.signaler.send(msg);
            this.cdnDownloaded = this.p2pDownloaded = 0;                   //上报的是增量部分
        }
    }


}

HlsPeerify.WEBRTC_SUPPORT = SimplePeer.WEBRTC_SUPPORT;

HlsPeerify.version = __VERSION__;

export default HlsPeerify
