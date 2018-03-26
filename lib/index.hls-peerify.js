/**
 * Created by xieting on 2018/1/2.
 */

import Events from './events';
import EventEmitter from 'events';
import defaultP2PConfig from './config';
import SimplePeer from 'simple-peer';
import {RPClient, HybridLoader} from './live/fastmesh';
import {Tracker, FragLoader} from './vod/bittorrent';
import BufferManager from './buffer-manager';
import UAParser from 'ua-parser-js';

const log = console.log;
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
        console.warn(`${JSON.stringify(this.config, null, 1)}`);
        this.hlsjs = hlsjs;
        this.p2pEnabled = this.config.disableP2P === false ? false : true;                                      //默认开启P2P

        hlsjs.config.currLoaded = hlsjs.config.currPlay = 0;

        if (hlsjs.url) {
            let channel = hlsjs.url.split('?')[0];
            this._init(channel);
        } else {
            hlsjs.on(hlsjs.constructor.Events.MANIFEST_PARSED, (event, data) => {

                // this.bitrate = data.levels[0].bitrate;                                                //获取固定码率，用于子流
                let channel = hlsjs.url.split('?')[0];
                this._init(channel);
            });
        }

        //level上报
        this.levelCounter = 0;
        this.averageLevel = 0;
        //流量上报
        this.cdnDownloaded = 0;
        this.p2pDownloaded = 0;

        //streaming rate
        // this.streamingRate = 0;                        //单位bps
        // this.fragLoadedCounter = 0;
    }

    _init(channel) {

        this.reportIntervalId = window.setInterval(this._statisticsReport.bind(this), this.config.reportInterval*1000);

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

        if (this.config.mode === 'live') {                                          //直播模式，采用fastmesh算法
            //实例化RP服务器
            this.signaler = new RPClient(channel, this.config, browserInfo);


            //通过config向hybrid-loader导入p2p-scheduler
            this.hlsjs.config.p2pLoader = this.signaler.scheduler;


            //向hybrid-loader导入buffer-manager
            this.hlsjs.config.p2pLoader.bufMgr = this.bufMgr;

            //替换fLoader
            this.hlsjs.config.fLoader = HybridLoader;
        } else if (this.config.mode === 'vod') {                                    //点播模式。采用BT算法
            //实例化tracker服务器
            this.signaler = new Tracker(channel, this.config, browserInfo);
            //替换fLoader
            this.hlsjs.config.fLoader = FragLoader;

        }





        this.hlsjs.on(this.hlsjs.constructor.Events.FRAG_LOADING, (id, data) => {
            // log('FRAG_LOADING: ' + JSON.stringify(data.frag));
            log('FRAG_LOADING: ' + data.frag.sn);

            //level统计
            this.averageLevel = (this.averageLevel*this.levelCounter + data.frag.level)/(++this.levelCounter);
        });

        this.signalTried = false;                                                   //防止重复连接ws
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
            if (!this.signalTried && !this.signaler.connected && this.config.p2pEnabled) {

                //用一个ts的大小和时长来代表平均streaming rate
                let bitrate = data.frag.loaded*8/data.frag.duration;
                //计算子流码率
                this.signaler.scheduler.bitrate = Math.round(bitrate);
                console.warn(`FRAG_LOADED bitrate ${bitrate}`);

                this.signaler.resumeP2P();
                this.signalTried = true;
            }
            // this.streamingRate = (this.streamingRate*this.fragLoadedCounter + bitrate)/(++this.fragLoadedCounter);
            // this.signaler.scheduler.streamingRate = Math.floor(this.streamingRate);
        });

        this.hlsjs.on(this.hlsjs.constructor.Events.FRAG_CHANGED, (id, data) => {
            // log('FRAG_CHANGED: '+JSON.stringify(data.frag, null, 2));
            log('FRAG_CHANGED: '+data.frag.sn);
            const sn = data.frag.sn;
            this.hlsjs.config.currPlay = sn;
            this.signaler.currentPlaySN = sn;
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
        log(`disableP2P`);
        if (this.p2pEnabled) {
            this.p2pEnabled = false;
            this.config.p2pEnabled = this.hlsjs.config.p2pEnabled = this.p2pEnabled;
            if (this.signaler) {
                this.signaler.stopP2P();
            }
        }
    }

    enableP2P() {                                               //在停止的情况下重新启动P2P
        log(`enableP2P`);
        if (!this.p2pEnabled) {
            this.p2pEnabled = true;
            this.config.p2pEnabled = this.hlsjs.config.p2pEnabled = this.p2pEnabled;
            if (this.signaler) {
                this.signaler.resumeP2P();
            }
        }
    }

    _statisticsReport() {
        // let ul_srs = {};
        // let substreams = this.signaler.scheduler.substreams;
        // let substreamRate = Math.round(substreams.bitrate/substreams.total);
        // for (let stream of substreams) {
        //     // ul_srs[channel.remotePeerId] = channel.streamingRate;                 //用固定子流码率代替动态
        //     if (ul_srs[stream.remotePeerId]) {
        //
        //     }
        // }

        if (this.signaler) {
            let msg = {
                action: 'statistics',
                level: Number(this.averageLevel.toFixed(2)),
                source: Math.round(this.cdnDownloaded/1024),                  //单位KB
                p2p: Math.round(this.p2pDownloaded/1024),
                // ul_srs: ul_srs,
                plr: 0                                                        //todo
            };
            this.signaler.send(msg);
            this.cdnDownloaded = this.p2pDownloaded = 0;                   //上报的是增量部分
        }
    }


}

HlsPeerify.WEBRTC_SUPPORT = SimplePeer.WEBRTC_SUPPORT;

HlsPeerify.version = __VERSION__;

export default HlsPeerify
