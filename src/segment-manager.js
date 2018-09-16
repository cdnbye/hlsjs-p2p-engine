
import EventEmitter from 'events';
import {Events, Buffer} from 'core';
// import {segmentId} from './utils/toolFuns';

class BufferManager extends EventEmitter {
    constructor(engine, config) {
        super();

        this.engine = engine;
        this.config = config;
        /* segment
        sn: number
        segId: string
        data: Buffer
        size: string
        fromPeerId: string
         */
        this._segPool = new Map();             //存放seg的Map            segId -> segment
        this._currBufSize = 0;                 //目前的buffer总大小
        this.sn2Id = new Map();               //以sn查找segId      sn -> segId
        this.overflowed = false;               //缓存是否溢出
    }

    get currBufSize() {
        return this._currBufSize;
    }

    hasSegOfId(segId) {                                                     //防止重复加入seg
        return this._segPool.has(segId);
    }

    hasSegOfSN(sn) {
        return this.sn2Id.has(sn);
    }

    handleFrag(sn, level, segId, data, fromPeerId = '', copy = false) {
        let targetBuffer;
        let byteLength = data.byteLength;
        if (copy) {
            let payloadBuf = Buffer.from(data);
            targetBuffer = new Buffer(byteLength);
            payloadBuf.copy(targetBuffer);
        } else {
            targetBuffer = data;
        }
        let segment = {
            sn,
            level,
            segId,
            data: targetBuffer,
            size: byteLength,
            fromPeerId
        };
        this._addSeg(segment);
        this.sn2Id.set(sn, segment.segId);
    }

    // copyAndAddBuffer(data, sn, segId, fromPeerId = '') {                                       //先复制再缓存
    //     let payloadBuf = Buffer.from(data);
    //     let byteLength = payloadBuf.byteLength;
    //     let targetBuffer = new Buffer(byteLength);
    //     payloadBuf.copy(targetBuffer);
    //
    //     let segment = {
    //         sn,
    //         segId,
    //         data: targetBuffer,
    //         size: byteLength,
    //         fromPeerId
    //     };
    //
    //     this._addSeg(segment);
    //     this.sn2Id.set(sn, segment.segId);
    // }
    //
    // addBuffer(sn, segId, buf, fromPeerId = '', copy = false) {                                             //直接缓存
    //     let segment = {
    //         sn,
    //         segId,
    //         data: buf,
    //         size: buf.byteLength,
    //         fromPeerId
    //     };
    //     this._addSeg(segment);
    //     this.sn2Id.set(sn, segment.segId);
    // }

    _addSeg(seg) {
        const { logger } = this.engine;
        this._segPool.set(seg.segId, seg);
        // this.urlSet.add(seg.relurl);
        logger.debug(`_segPool add seg ${seg.segId} level ${seg.level}`);
        this._currBufSize += parseInt(seg.size);
        // logger.debug(`seg.size ${seg.size} _currBufSize ${this._currBufSize} maxBufSize ${this.config.maxBufSize}`);
        while (this._currBufSize > this.config.maxBufSize) {                       //去掉多余的数据
            const lastSeg =[...this._segPool.values()].shift();
            logger.info(`pop seg ${lastSeg.segId} at ${lastSeg.sn}`);
            this._segPool.delete(lastSeg.segId);
            this.sn2Id.delete(lastSeg.sn);
            this._currBufSize -= parseInt(lastSeg.size);
            if (!this.overflowed) this.overflowed = true;
            this.emit(Events.BM_LOST, lastSeg.sn);
        }
    }

    getSegById(segId) {
        return this._segPool.get(segId);
    }

    getSegIdbySN(sn) {
        return this.sn2Id.get(sn);
    }

    clear() {
        this._segPool.clear();
        this.sn2Id.clear();
        this._currBufSize = 0;
    }

    destroy() {
        this.clear();
        this.removeAllListeners();
    }
}

export default BufferManager;