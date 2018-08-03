import EventEmitter from 'events';
import {Events} from 'core';
import {handleTSUrl} from '../utils/toolFuns';

class BTScheduler extends EventEmitter {
    constructor(engine, config) {
        super();

        this.engine = engine;
        this.config = config;
        this.bufMgr = null;
        this.peerMap = new Map();                 // remotePeerId -> dc
        this.bitset = new Set();                  //本节点的bitfield
        this.bitCounts = new Map();               //记录peers的每个buffer的总和，用于BT的rearest first策略  index -> count

        // 传输控制(单位ms)

    }

    updateLoadedSN(sn) {
        this.bitset.add(sn);                      //在bitset中记录
        if (this.bitCounts.has(sn)) {
            this.bitCounts.delete(sn)             //在bitCounts清除，防止重复下载
        }
        if (this.peerMap.size > 0) {
            const msg = {
                event: Events.DC_HAVE,
                sn: sn
            };
            this._broadcastToPeers(msg);
        }
    }

    updateLoadingSN(sn) {                                                           //防止下载hls.js正在下载的sn
        this.loadingSN = sn;
    }

    updatePlaySN(sn) {
        const { logger } = this.engine;
        if (this.config.live) return;                                                 //rearest first只用于vod
        if (!this.hasPeers) return;
        let requested = [];
        for (let idx=sn+1;idx<=sn+this.config.urgentOffset+1;idx++) {
            if (!this.bitset.has(idx) && idx !== this.loadingSN && this.bitCounts.has(idx)) {                  //如果这个块没有缓存并且peers有
                for (let peer of this.peerMap.values()) {                           //找到拥有这个块并且空闲的peer
                    if (peer.isAvailable && peer.bitset.has(idx)) {
                        peer.requestDataBySN(idx, true);
                        logger.debug(`request urgent ${idx} from peer ${peer.remotePeerId}`);
                        requested.push(idx);
                        break;
                    }
                }
            }
        }

        //检查是否有空闲的节点，有的话采用rearest first策略下载(由于上行带宽有限，暂停这个策略)
        // let idlePeers = this._getIdlePeer();
        // if (idlePeers.length === 0 || this.bitCounts.size === 0 || this.bufMgr.overflowed) return;        //缓存溢出则停止rearest first
        // let sortedArr = [...this.bitCounts.entries()].sort((item1, item2) => {
        //     return item1[1] < item2[1];
        // });
        // if (sortedArr.length === 0) return;
        // //每次只下载一个rearest块
        // let rearest = sortedArr.pop()[0];
        // while (rearest === this.loadingSN || requested.includes(rearest)) {         //排除掉loading的和requested的
        //     if (sortedArr.length === 0) return;
        //     rearest = sortedArr.pop()[0];
        // }
        // for (let peer of idlePeers) {
        //     if (peer.bitset.has(rearest)) {
        //         peer.requestDataBySN(rearest, false);
        //         logger.debug(`request rearest ${rearest} from peer ${peer.remotePeerId}`);
        //         break;
        //     }
        // }

    }

    deletePeer(dc) {
        if (this.peerMap.has(dc.remotePeerId)) {
            dc.bitset.forEach( value => {
                this._decreBitCounts(value);
            });
            this.peerMap.delete(dc.remotePeerId);
        }
        this.engine.emit('peers', [...this.peerMap.keys()]);
    }

    handshakePeer(dc) {
        this._setupDC(dc);
        dc.sendBitField(Array.from(this.bitset))            //向peer发送bitfield
    }

    addPeer(peer) {
        const { logger } = this.engine;
        logger.info(`add peer ${peer.remotePeerId}`);
        this.peerMap.set(peer.remotePeerId, peer);

        this.engine.emit('peers', [...this.peerMap.keys()]);
    }

    peersHasSN(sn) {
        return this.bitCounts.has(sn);
    }

    load(context, config, callbacks) {
        const { logger } = this.engine;
        this.context = context;
        const frag = context.frag;
        const handledUrl = handleTSUrl(frag.relurl, this.config.tsStrictMatched);
        this.callbacks = callbacks;
        this.stats = {trequest: performance.now(), retry: 0, tfirst: 0, tload: 0, loaded: 0};
        this.criticalSeg = {sn: frag.sn, relurl: handledUrl};

        let target;
        for (let peer of this.peerMap.values()) {
            if (peer.isAvailable && peer.bitset.has(frag.sn)) {
                target = peer;
            }
        }

        if (target) {
            // target.requestDataBySN(frag.sn, true);
            target.requestDataByURL(handledUrl, true);                            //critical的根据url请求
            logger.info(`request criticalSeg url ${frag.relurl} at ${frag.sn}`);
            this.criticaltimeouter = window.setTimeout(this._criticaltimeout.bind(this), this.config.loadTimeout*1000);
        } else {
            logger.info(`no expected sn in peers for criticalSeg url ${frag.relurl} at ${frag.sn}`);
            this._criticaltimeout();
        }

    }

    get hasPeers() {
        return this.peerMap.size > 0;
    }

    get hasIdlePeers() {
        const { logger } = this.engine;
        const idles = this._getIdlePeer().length;
        logger.info(`peers: ${this.peerMap.size} idle peers: ${idles}`);
        return idles > 0;
    }

    set bufferManager(bm) {
        this.bufMgr = bm;

        bm.on(Events.BM_LOST, sn => {
            this._broadcastToPeers({                                //向peers广播已经不缓存的sn
                event: Events.DC_LOST,
                sn: sn
            });
            this.bitset.delete(sn);
        })
    }

    get requestTimeout() {

    }

    _setupDC(dc) {
        const { logger } = this.engine;
        dc.on(Events.DC_BITFIELD, msg => {
            if (!msg.field) return;
            let bitset = new Set(msg.field);
            dc.bitset = bitset;
            msg.field.forEach( value => {
                if (!this.bitset.has(value)) {              //防止重复下载
                    this._increBitCounts(value);
                }
            });
            this.addPeer(dc);                               //只有获取bitfield之后才加入peerMap
        })
            .on(Events.DC_HAVE, msg => {
                if (!msg.sn || !dc.bitset) return;
                const sn = msg.sn;
                dc.bitset.add(sn);
                if (!this.bitset.has(sn)) {              //防止重复下载
                    this._increBitCounts(sn);
                }
            })
            .on(Events.DC_LOST, msg => {
                if (!msg.sn || !dc.bitset) return;
                const sn = msg.sn;
                dc.bitset.delete(sn);
                this._decreBitCounts(sn);
            })
            .on(Events.DC_PIECE_ACK, msg => {
                if (msg.size) {
                    this.engine.fetcher.reportUploaded(msg.size);
                }
            })
            .on(Events.DC_PIECE, msg => {                                                  //接收到piece事件，即二进制包头
                if (this.criticalSeg && this.criticalSeg.relurl === msg.url) {                    //接收到critical的响应
                    this.stats.tfirst = Math.max(performance.now(), this.stats.trequest);
                }
            })
            .on(Events.DC_PIECE_NOT_FOUND, msg => {
                if (this.criticalSeg && this.criticalSeg.relurl === msg.url) {                    //接收到critical未找到的响应
                    window.clearTimeout(this.criticaltimeouter);                             //清除定时器
                    // this.criticaltimeouter = null;
                    logger.info(`DC_PIECE_NOT_FOUND`);
                    this._criticaltimeout();                                                   //触发超时，由xhr下载
                }
            })
            .on(Events.DC_RESPONSE, response => {                                            //接收到完整二进制数据
                if (this.criticalSeg && this.criticalSeg.relurl === response.url && this.criticaltimeouter) {
                    logger.info(`receive criticalSeg url ${response.url}`);
                    window.clearTimeout(this.criticaltimeouter);                             //清除定时器
                    this.criticaltimeouter = null;
                    let stats = this.stats;
                    stats.tload = Math.max(stats.tfirst, performance.now());
                    stats.loaded = stats.total = response.data.byteLength;
                    this.criticalSeg = null;
                    this.context.frag.fromPeerId = dc.remotePeerId;
                    this.callbacks.onSuccess(response, stats, this.context);
                } else {
                    this.bufMgr.addBuffer(response.sn, response.url, response.data, dc.remotePeerId);
                }
                this.updateLoadedSN(response.sn);
            })
            .on(Events.DC_REQUEST, msg => {
                let url = '';
                if (!msg.url) {                                    //请求sn的request
                    url = this.bufMgr.getURLbySN(msg.sn);
                } else {                                           //请求url的request
                    url = msg.url;
                }
                if (url && this.bufMgr.hasSegOfURL(url)) {
                    let seg = this.bufMgr.getSegByURL(url);
                    dc.sendBuffer(msg.sn, seg.relurl, seg.data);
                } else {
                    dc.sendJson({
                        event: Events.DC_PIECE_NOT_FOUND,
                        url: url,
                        sn: msg.sn
                    })
                }
            })
            .on(Events.DC_TIMEOUT, () => {
                logger.warn(`DC_TIMEOUT`);
                if (this.criticaltimeouter) {
                    window.clearTimeout(this.criticaltimeouter);                             //清除定时器
                    this._criticaltimeout();
                }
            })
    }

    _broadcastToPeers(msg) {
        for (let peer of this.peerMap.values()) {
            peer.sendJson(msg);
        }
    }

    _getIdlePeer() {
        return [...this.peerMap.values()].filter(peer => {
            return peer.isAvailable;
        });
    }

    _decreBitCounts(index) {
        if (this.bitCounts.has(index)) {
            let last = this.bitCounts.get(index);
            // this.bitCounts.set(index, last-1);
            // if (this.bitCounts.get(index) === 0) {
            //     this.bitCounts.delete(index);
            // }
            if (last === 1) {
                this.bitCounts.delete(index);
            } else {
                this.bitCounts.set(index, last-1);
            }
        }
    }

    _increBitCounts(index) {
        if (!this.bitCounts.has(index)) {
            this.bitCounts.set(index, 1);
        } else {
            let last = this.bitCounts.get(index);
            this.bitCounts.set(index, last+1);
        }
    }

    _criticaltimeout() {
        const { logger } = this.engine;
        logger.warn(`critical request timeout`);
        this.criticalSeg = null;
        this.criticaltimeouter = null;
        this.callbacks.onTimeout(this.stats, this.context, null);
    }
}

function handleUrl(url) {
    // return url;
    return url.split("?")[0];
}


export default BTScheduler;