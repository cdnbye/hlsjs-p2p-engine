/**
 * Created by xieting on 2018/1/4.
 */

import debug from 'debug';
import EventEmitter from 'events';
import Events from './events';
import {defaultP2PConfig as p2pConfig} from './config';

const log = debug('p2p-scheduler');

class P2PScheduler extends EventEmitter {
    constructor() {
        super();

        this.upstreamers = [];                        //存放父节点的数组
        this.downstreamers = [];                      //存放子节点的数组

        //标识当前下载
        this.expectedSeg = null;                         //type {sn: number, relurl: string}
        this.bufMgr = null;
    }

    load(context, config, callbacks) {

        this.target = 0;                                  //当前下载目标父节点的索引

        this.context = context;
        const frag = context.frag;
        this.expectedSeg = {sn: frag.sn, relurl: frag.relurl};
        log(`p2pLoader load ${frag.relurl} at ${frag.sn}`);
        this.config = config;
        this.callbacks = callbacks;
        this.stats = {trequest: performance.now(), retry: 0, tfirst: 0, tload: 0, loaded: 0};
        this.retryDelay = config.retryDelay;
        let timeout = Math.min(p2pConfig.loadTimeout, config.p2pTimeout);             //p2p下载最大允许时间是一个块的时长
        this.requestTimeout = window.setTimeout(this._loadtimeout.bind(this), timeout*1000);
        this._loadInternal();
    }

    abort() {
        log(`p2pLoader abort`);
        this.expectedSeg = null;
        //清除定时器
        this.currUpstreamer.clearQueue();
    }

    destroy() {
        log(`p2pLoader destroy`);
    }

    _loadInternal() {

        const peer = this.upstreamers[this.target];
        this.currUpstreamer = peer;                                      //目前用于下载的父节点

        peer.clearQueue();                                               //先清空下载队列
        // setup timeout before we perform request

        const msg = {
            event: 'REQUEST',
            url: this.context.frag.relurl,
            sn: this.context.frag.sn
        };
        peer.request(JSON.stringify(msg));
    }

    get hasUpstreamer() {
        return this.upstreamers.length > 0;
    }

    get hasDownstreamer() {
        return this.downstreamers.length > 0;
    }

    _addUpStreamer(channel) {
        this.upstreamers.push(channel);

        this._setupChannel(channel);                          //设置通用监听

        channel.on(Events.DC_RESPONSE, response => {         //response: {url: string, sn: number, payload: Buffer}
            log(`receive response sn ${response.sn} url ${response.url} size ${response.data.byteLength} from ${channel.remotePeerId}`);
            if (this.expectedSeg && response.url === this.expectedSeg.relurl && this.requestTimeout) {
                window.clearTimeout(this.requestTimeout);                            //清除定时器
                this.requestTimeout = null;
                if (!this.stats.tload) {
                    let stats = this.stats;
                    stats.tload = Math.max(stats.tfirst, performance.now());
                    stats.loaded = stats.total = response.data.byteLength;
                    let onProgress = this.callbacks.onProgress;
                    if (onProgress) {
                        // third arg is to provide on progress data
                        onProgress(stats, this.context, null);
                    }
                }
                this.callbacks.onSuccess(response, this.stats, this.context);
                [this.upstreamers[0], this.upstreamers[this.target]] = [this.upstreamers[this.target], this.upstreamers[0]]; //将获取成功的节点放在最前
            } else {                                                            //不是目前request的则保存到buffer-manager
                if (this.bufMgr && !this.bufMgr.hasSegOfURL(response.url)) {
                    this._addSegToBuf(response);
                }
            }
            // log(`this.upstreamers.length ${this.upstreamers.length}`);
        })
            .on(Events.DC_REQUESTFAIL, () => {                                  //当请求的数据找不到时触发
                if (this.requestTimeout) {                                      //如果还没有超时
                    this.target ++;
                    if (this.target < this.upstreamers.length) {
                        log(`load one more time`);
                        this.stats.retry ++;
                        this._loadInternal();
                    }
                }

            })
            .on(Events.DC_BINARY, () => {                                        //接收到binary事件，用于tfirst
                if (!this.stats.tfirst) {
                    this.stats.tfirst = Math.max(performance.now(), this.stats.trequest);
                }
            })
    }

    _loadtimeout() {
        log(`timeout while loading ${this.context.url}` );
        this.callbacks.onTimeout(this.stats, this.context, null);
        this.requestTimeout = null;
    }

    _addDownStreamer(channel) {
        this.downstreamers.push(channel);

        this._setupChannel(channel);                          //设置通用监听

        channel.on(Events.DC_REQUEST, msg => {
            const {sn, url} = msg;
            log(`receive request sn ${sn} url ${url}`);
            if (this.bufMgr) {
                let seg;
                if (this.bufMgr.hasSegOfURL(url)) {                          //首先根据url精确查找
                    seg = this.bufMgr.getSegByURL(url);
                }
                if (seg) {
                    log(`bufMgr found seg sn ${sn} url ${seg.relurl}`);
                    let payload = seg.data,                                 //二进制数据
                        dataSize = seg.size,                                //二进制数据大小
                        packetSize = p2pConfig.packetSize,                     //每个数据包的大小
                        remainder = 0,                                      //最后一个包的大小
                        attachments = 0;                                    //分多少个包发
                    if (dataSize % packetSize === 0) {
                        attachments = dataSize/packetSize;
                    } else {
                        attachments = Math.floor(dataSize/packetSize) + 1;
                        remainder = dataSize % packetSize;
                    }
                    let response = {
                        event: 'BINARY',
                        attachments: attachments,
                        url: seg.relurl,
                        sn: seg.sn,
                        size: payload.byteLength
                    };
                    channel.send(JSON.stringify(response));
                    const bufArr = this._dividePayload(payload, packetSize, attachments, remainder);
                    for (let j=0;j<bufArr.length;j++) {
                        channel.send(bufArr[j]);
                    }
                    log(`datachannel send binary data total size ${payload.byteLength}`);
                } else {                                                                        //缓存找不到请求的数据
                    let response = {
                        event: 'LACK',
                        url: url,
                        sn: sn
                    };
                    channel.send(JSON.stringify(response));
                }
            }

        })
    }

    _dividePayload(payload, packetSize, attachments, remainder) {
        let bufArr = [];
        if (remainder) {
            let packet;
            for (let i=0;i<attachments-1;i++) {
                packet = payload.slice(i*packetSize, (i+1)*packetSize);
                bufArr.push(packet);
            }
            packet = payload.slice(payload.byteLength-remainder, payload.byteLength);
            bufArr.push(packet);
        } else {
            let packet;
            for (let i=0;i<attachments;i++) {
                packet = payload.slice(i*packetSize, (i+1)*packetSize);
                bufArr.push(packet);
            }
        }
        return bufArr;
    }

    addDataChannel(channel) {
        if (channel.isReceiver) {                        //分别存放父节点和子节点
            this._addUpStreamer(channel);
        } else {
            this._addDownStreamer(channel);
        }
    }

    deleteDataChannel(channel) {
        log(`delete datachannel ${channel.channelId}`);
        for (let i=0;i<this.downstreamers.length;++i){
            if (this.downstreamers[i] === channel) {
                this.downstreamers.splice(i, 1);
                return;
            }
        }
        for (let i=0;i<this.upstreamers.length;++i){
            if (this.upstreamers[i] === channel) {
                this.upstreamers.splice(i, 1);
                return;
            }
        }
    }

    _setupChannel(channel) {

        // channel.once('close', () => {
        //
        //     log(`datachannel closed ${channel.channelId} `);
        //     // this.emit(Events.SIG_DCCLOSED, datachannel);
        //     this.deleteDataChannel(channel);
        //     channel.destroy();
        // })
    }

    _addSegToBuf(response) {
        log(`_addSegToBuf sn ${response.sn} relurl ${response.relurl}`);
        let segment = {
            sn: response.sn,
            relurl: response.relurl,
            data: response.data,
            size: response.data.byteLength
        };
        this.bufMgr.addSeg(segment);
    }
}

export default P2PScheduler;