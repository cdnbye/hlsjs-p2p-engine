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
import {Fetcher} from './pear';
import sha1 from 'simple-sha1';

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
        this.hlsjs = hlsjs;
        this.p2pEnabled = this.config.disableP2P === false ? false : true;                                      //默认开启P2P

        hlsjs.config.currLoaded = hlsjs.config.currPlay = 0;


        hlsjs.on(hlsjs.constructor.Events.MANIFEST_PARSED, (event, data) => {

            // this.bitrate = data.levels[0].bitrate;                                                //获取固定码率，用于子流
            let channel = hlsjs.url.split('?')[0];
            this._init(channel);
        });

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
            //实例化Fetcher
            let fetcher = new Fetcher(this.config.key, sha1.sync(channel), this.config.announce);
            //实例化tracker服务器
            this.signaler = new Tracker(fetcher, this.config, browserInfo);
            this.signaler.scheduler.bufMgr = this.bufMgr;
            //替换fLoader
            this.hlsjs.config.fLoader = FragLoader;
            //在fLoader中使用fetcher
            this.hlsjs.config.fetcher = fetcher;
        }





        this.hlsjs.on(this.hlsjs.constructor.Events.FRAG_LOADING, (id, data) => {
            // log('FRAG_LOADING: ' + JSON.stringify(data.frag));
            log('FRAG_LOADING: ' + data.frag.sn);
            this.signaler.currentLoadingSN = data.frag.sn;
        });

        this.signalTried = false;                                                   //防止重复连接ws
        this.hlsjs.on(this.hlsjs.constructor.Events.FRAG_LOADED, (id, data) => {
            let sn = data.frag.sn;
            this.hlsjs.config.currLoaded = sn;
            this.signaler.currentLoadedSN = sn;                                //用于BT算法
            this.hlsjs.config.currLoadedDuration = data.frag.duration;
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



}

HlsPeerify.WEBRTC_SUPPORT = SimplePeer.WEBRTC_SUPPORT;

HlsPeerify.version = __VERSION__;

export default HlsPeerify
