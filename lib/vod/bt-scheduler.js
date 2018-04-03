/**
 * Created by xieting on 2018/3/23.
 */

import EventEmitter from 'events';
import {Events} from '../pear';

class BTScheduler extends EventEmitter {
    constructor(config) {
        super();

        this.config = config;
        this.bufMgr = null;
        this.peerMap = new Map();                 // remotePeerId -> dc
        this.bitset = new Set();                  //本节点的bitfield
        this.bitCounts = new Map();               //记录peers的每个buffer的总和，用于BT的rearest first策略  index -> count

    }

    addLoadedSN(sn) {
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

    addLoadingSN(sn) {                                                           //防止下载hls.js正在下载的sn
        this.loadingSN = sn;
    }

    addPlaySN(sn) {
        if (!this.hasPeers) return;
        let requested = [];
        for (let idx=sn+1;idx<=sn+this.config.urgentOffset+1;idx++) {
            if (!this.bitset.has(idx) && idx !== this.loadingSN && this.bitCounts.has(idx)) {                  //如果这个块没有缓存并且peers有
                for (let peer of this.peerMap.values()) {                           //找到拥有这个块并且空闲的peer
                    if (peer.downloading === false && peer.bitset.has(idx)) {
                        peer.requestDataBySN(idx, true);
                        console.warn(`request urgent ${idx} from peer ${peer.remotePeerId}`);
                        requested.push(idx);
                        break;
                    }
                }
            }
        }
        //检查是否有空闲的节点，有的话采用rearest first策略下载
        let idlePeers = this._getIdlePeer();
        if (idlePeers.length === 0 || this.bitCounts.size === 0) return;
        let sortedArr = [...this.bitCounts.entries()].sort((item1, item2) => {
            return item1[1] < item2[1];
        });
        if (sortedArr.length === 0) return;
        //每次只下载一个rearest块
        let rearest = sortedArr.pop()[0];
        while (rearest === this.loadingSN || requested.includes(rearest)) {         //排除掉loading的和requested的
            if (sortedArr.length === 0) return;
            rearest = sortedArr.pop()[0];
        }
        for (let peer of idlePeers) {
            if (peer.bitset.has(rearest)) {
                peer.requestDataBySN(rearest, false);
                console.warn(`request rearest ${rearest} from peer ${peer.remotePeerId}`);
                break;
            }
        }

    }

    deletePeer(dc) {
        if (this.peerMap.has(dc.remotePeerId)) {
            dc.bitset.forEach( value => {
                this._decreBitCounts(value);
            });
            this.peerMap.delete(dc.remotePeerId);
        }
    }

    addPeer(dc) {
        console.warn(`add peer ${dc.remotePeerId}`);
        this.peerMap.set(dc.remotePeerId, dc);
        this._setupDC(dc);
        dc.sendJson({                                        //向peer发送bitfield
            event: Events.DC_BITFIELD,
            field: Array.from(this.bitset)
        });
    }

    get hasPeers() {
        return this.peerMap.size > 0;
    }

    _setupDC(dc) {
        dc.on(Events.DC_BITFIELD, msg => {
            if (!msg.field) return;
            let bitset = new Set(msg.field);
            dc.bitset = bitset;
            msg.field.forEach( value => {
                if (!this.bitset.has(value)) {              //防止重复下载
                    this._increBitCounts(value);
                }
            });
        })
            .on(Events.DC_HAVE, msg => {
                if (!msg.sn) return;
                let sn = msg.sn;
                dc.bitset.add(sn);
                if (!this.bitset.has(sn)) {              //防止重复下载
                    this._increBitCounts(sn);
                }
            })
            .on(Events.DC_PIECE, () => {                                                  //接收到piece事件，即二进制包头

            })
            .on(Events.DC_RESPONSE, response => {                                         //接收到完整二进制数据
                this.bufMgr.addBuffer(response.sn, response.url, response.data);
                this.addLoadedSN(response.sn);
            })
            .on(Events.DC_REQUEST, msg => {
                let url = this.bufMgr.getURLbySN(msg.sn);
                if (url && this.bufMgr.hasSegOfURL(url)) {
                    let seg = this.bufMgr.getSegByURL(url);
                    dc.sendBuffer(msg.sn, seg.relurl, seg.data);
                }
            })
            .on(Events.DC_TIMEOUT, () => {
                console.warn(`DC_TIMEOUT`);
            })
    }

    _broadcastToPeers(msg) {
        for (let peer of this.peerMap.values()) {
            peer.sendJson(msg);
        }
    }

    _getIdlePeer() {
        return [...this.peerMap.values()].filter(peer => {
            return peer.downloading === false;
        });
    }

    /*
     _sendNextReq() {                                                 //每个周期向所有peers发送sendReqQueue的下一个req
     if (this.peerMap.size === 0) return;
     for (let peer of this.peerMap.values()) {
     if (this.sendReqQueue.length === 0) return;
     if (peer.loading === true) continue;
     let req = this.sendReqQueue.pop();
     while (this.bitmap.has(req.sn) ) {
     if (this.sendReqQueue.length === 0) return;
     req = this.sendReqQueue.pop();
     }
     peer.requestDataBySN(req.sn, req.urgent);
     }
     }
     */
    _decreBitCounts(index) {
        if (this.bitCounts.has(index)) {
            let last = this.bitCounts.get(index);
            this.bitCounts.set(index, last-1);
            if (this.bitCounts.get(index) === 0) {
                this.bitCounts.delete(index);
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
}


export default BTScheduler;