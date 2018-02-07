/**
 * Created by xieting on 2018/1/4.
 */

import EventEmitter from 'events';
import Events from './events';

const log = console.log;

class P2PScheduler extends EventEmitter {
    constructor(config) {
        super();

        this.p2pConfig = config;
        this.upstreamers = [];                            //存放父节点的数组
        this.downstreamers = [];                          //存放子节点的数组

        //标识当前下载
        this.expectedSeg = null;                          //type {sn: number, relurl: string}
        this.bufMgr = null;

        //当前播放的sn
        this._currPlaySN = -1;
        this.leadingCounter = 0;                          //对播放慢于此节点的父节点进行计数

        //fastmesh
        this.totalUploadBW = config.defaultUploadBW;
        this.streamingRate = 0;                           //单位bps
        if (config.transitionEnabled) this.tranInspectorId = this._setupTransInspector();
        this.grantAncestors = [];                         //跃迁中候选的祖先节点
        this.transitioning = false;                       //是否在跃迁中
        this.transitionTries = 0;                         //当前跃迁次数
        this.targetAncestorId = ''                        //跃迁要替换的目标节点Id
    }

    load(context, config, callbacks) {

        this.target = 0;                                  //当前下载目标父节点的索引
        this.context = context;
        const frag = context.frag;
        this.expectedSeg = {sn: frag.sn, relurl: frag.relurl};
        log(`p2pLoader load ${frag.relurl} at ${frag.sn}`);
        // this.config = config;
        this.callbacks = callbacks;
        this.stats = {trequest: performance.now(), retry: 0, tfirst: 0, tload: 0, loaded: 0};
        this.retryDelay = config.retryDelay;
        let timeout = Math.min(this.p2pConfig.loadTimeout, config.p2pTimeout);             //p2p下载最大允许时间是一个块的时长
        // setup timeout before we perform request
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
        clearInterval(this.tranInspectorId);
    }

    _loadInternal() {

        const peer = this.upstreamers[this.target];
        this.currUpstreamer = peer;                                      //目前用于下载的父节点

        peer.clearQueue();                                               //先清空下载队列


        const msg = {
            event: 'REQUEST',
            url: this.context.frag.relurl,
            sn: this.context.frag.sn,
            br: this.streamingRate
        };
        peer.request(JSON.stringify(msg));
        console.log(`load ${msg.url} from peer ${peer.peerId} targetIdx ${this.target}`);
    }

    get hasUpstreamer() {
        console.warn(`upstreamers.length ${this.upstreamers.length}`);
        return this.upstreamers.length > 0;
    }

    get hasDownstreamer() {
        return this.downstreamers.length > 0;
    }

    get residualBW() {
        let br = 0;
        for (let channel of this.downstreamers) {
            br += channel.streamingRate;
        }
        return this.totalUploadBW - br;
    }

    set currentPlaySN(sn) {
        this._currPlaySN = sn;
    }

    _addUpStreamer(channel) {
        this.upstreamers.unshift(channel);                    //最新加的优先级最高

        this._setupChannel(channel);                          //设置通用监听



    }

    _loadtimeout() {
        log(`timeout while loading ${this.context.url}` );
        this.callbacks.onTimeout(this.stats, this.context, null);
        this.requestTimeout = null;
        this.leadingCounter = 0;
    }

    _addDownStreamer(channel) {
        this.downstreamers.push(channel);

        this._setupChannel(channel);                          //设置通用监听


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

    moveUpstreamsersToDown() {
        const msg = {
            event: 'DISPLACE'
        };
        while (this.upstreamers.length > 0) {
            let streamer = this.upstreamers.pop();
            streamer.isReceiver = !streamer.isReceiver;
            this.downstreamers.push(streamer);
            streamer.send(JSON.stringify(msg));
        }
    }

    clearUpstreamers() {
        for (let i=0;i<this.upstreamers.length;++i){
            let streamer = this.upstreamers.pop();
            let msg = {
                event: 'CLOSE'
            };
            streamer.send(JSON.stringify(msg));
            streamer.destroy();
        }
    }

    clearDownstreamers() {
        for (let i=0;i<this.downstreamers.length;++i){
            let streamer = this.downstreamers.pop();
            let msg = {
                event: 'CLOSE'
            };
            streamer.send(JSON.stringify(msg));
            streamer.destroy();
        }
    }

    exchandeWithStreamser(streamer) {                                        //与streamer交换位置
        const msg = {
            event: 'DISPLACE'
        };
        if (streamer.isReceiver) {                                           //交换的对象是父节点
            this.upstreamers.splice(this.upstreamers.findIndex(item => item.remotePeerId === streamer.remotePeerId), 1);
            this.downstreamers.push(streamer);
        } else {
            this.downstreamers.splice(this.downstreamers.findIndex(item => item.remotePeerId === streamer.remotePeerId), 1);
            this.upstreamers.unshift(streamer);                             //放在最优先位置
        }
        streamer.isReceiver = !streamer.isReceiver;
        streamer.send(JSON.stringify(msg));
    }

    clearAllStreamers() {
        this.clearUpstreamers();
        this.clearDownstreamers();
    }

    broadcastToUpstreamers(msg) {                                //向父节点广播
        for (let streamer of this.upstreamers) {
            streamer.send(JSON.stringify(msg))
        }
    }

    broadcastToDownstreamers(msg) {                              //向子节点广播
        for (let streamer of this.downstreamers) {
            streamer.send(JSON.stringify(msg))
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

        //upstreamer
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
                        packetSize = this.p2pConfig.packetSize,                     //每个数据包的大小
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
                    const bufArr = dividePayload(payload, packetSize, attachments, remainder);
                    for (let j=0;j<bufArr.length;j++) {
                        channel.send(bufArr[j]);
                    }
                    log(`datachannel send binary data total size ${payload.byteLength}`);
                } else {                                                                        //缓存找不到请求的数据
                    let response = {
                        event: 'LACK',
                        url: url,
                        current: this._currPlaySN
                    };
                    channel.send(JSON.stringify(response));
                }
            }

        })
            .on(Events.DISPLACE, () => {                                                        //收到子节点要跃迁的事件
                const channelId = channel.channelId;
                channel.isReceiver = !channel.isReceiver;
                this.downstreamers.splice(this.downstreamers.findIndex(item => item.channelId === channelId), 1);
                this.upstreamers.unshift(channel);
                console.log(`datachannel ${channel.channelId} displaced`);
            })
            .on(Events.DC_GRANT, msg => {
                if (msg.to_peer_id === this.peerId) {

                    this.grantAncestors.push(msg);

                } else {                                                          //继续向子节点广播
                    msg.TTL --;
                    this.broadcastToDownstreamers(msg);
                }
            })

        //dowmstreamer
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
            this.leadingCounter = 0;
            // log(`this.upstreamers.length ${this.upstreamers.length}`);
        })
            .on(Events.DC_REQUESTFAIL, (msg) => {                                  //当请求的数据找不到时触发
                if (this.requestTimeout) {                                         //如果还没有超时
                    this.target ++;
                    if (this.target < this.upstreamers.length) {
                        log(`load one more time`);
                        this.stats.retry ++;
                        this._loadInternal();
                    }
                }
                const upStreamerCurr = msg.current;                         //父节点目前播放的sn
                if (this._currPlaySN - upStreamerCurr >= 2) {
                    this.leadingCounter ++;
                    if (this.leadingCounter === this.upstreamers.length) {    //如果播放快于所有父节点
                        // this.emit(Events.TRANSITION);
                    }
                } else {
                    this.leadingCounter = 0;
                }

            })
            .on(Events.DC_BINARY, () => {                                        //接收到binary事件，用于tfirst
                if (!this.stats.tfirst) {
                    this.stats.tfirst = Math.max(performance.now(), this.stats.trequest);
                }
            })
            .on(Events.DC_TRANSITION, (msg) => {
                if (msg.TTL > 0) {                                               //如果TTL大于0，则继续广播给父节点
                    msg.TTL --;
                    if (this.upstreamers.length > 0) this.broadcastToUpstreamers(msg);
                    if (msg.ul_bw > this.totalUploadBW) {                            //如果子节点上行带宽大于此节点上行带宽
                        let parents = [];
                        for (let channel of this.upstreamers) {
                            parents.push(channel.remotePeerId);
                        }
                        const resp = {
                            event: 'GRANT',
                            delay: 0,                                                //待修改
                            TTL: msg.source_TTL - msg.TTL,
                            parents: parents,
                            from_peer_id: this.peerId,
                            to_peer_id: msg.from_peer_id
                        };
                        channel.send(JSON.stringify(resp));                          //将GRANT返回给子节点
                    }
                }
            })
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

    _setupTransInspector() {                          //定时检查是否需要跃迁
        return window.setInterval(() => {
            if (this.residualBW > this.totalUploadBW/2 && this.upstreamers.length) {         //如果剩余带宽大于streaming rate并且有父节点
                const msg = {
                    event: 'TRANSITION',
                    ul_bw: this.totalUploadBW,                               //总上行带宽（单位bps）
                    TTL: this.p2pConfig.transitionTTL,
                    source_TTL: this.p2pConfig.transitionTTL,
                    from_peer_id: this.peerId
                };
                console.warn(`begin TRANSITION ${JSON.stringify(msg)}`);
                this.broadcastToUpstreamers(msg);
                window.setTimeout(() => {                                      //在一定时间间隔后开始跃迁
                    console.log(`grantAncestors: ${this.grantAncestors}`);
                    if (this.grantAncestors.length === 0) return;
                    this.grantAncestors.sort((a, b) => b.delay - a.delay);     //按delay从大到小排序
                    /*
                     {
                     event: 'GRANT'
                     delay: number             //source-to-end delay, 目前用level表示
                     TTL: number
                     parents: Array<peerId>
                     from_peer_id: string
                     to_peer_id: string
                     }
                     */
                    this.transitioning = true;
                    const ancestor = this.grantAncestors.pop();
                    this.targetAncestorId = ancestor.from_peer_id;
                    if (ancestor.parents.length > 0) {                         //如果ancestor有父节点则连接其父节点
                        this.emit(Events.CONNECT, ancestor.parents);
                    } else {                                                   //否则直接通知ancestor成为子节点
                        this.emit(Events.ADOPT, ancestor.from_peer_id);
                    }
                    this.grantAncestors = [];                                   //清空，为下次准备

                }, this.p2pConfig.transitionWaitTime*1000)
                this.transitionTries ++;                                        //跃迁尝试次数加1
                if (this.transitionTries === this.p2pConfig.maxTransitionTries) {
                    window.clearInterval(this.tranInspectorId);
                }
            }
            // console.warn(`residualBW: ${this.residualBW}`)
        }, this.p2pConfig.transitionCheckInterval*1000)
    }
}

function dividePayload(payload, packetSize, attachments, remainder) {
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

export default P2PScheduler;