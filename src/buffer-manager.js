
import EventEmitter from 'events';
import {Events, Buffer} from 'core';
import {handleTSUrl} from './utils/toolFuns';

class BufferManager extends EventEmitter {
    constructor(engine, config) {
        super();

        this.engine = engine;
        this.config = config;
        /* segment
        sn: number
        relurl: string
        data: Buffer
        size: string
        fromPeerId: string
         */
        this._segPool = new Map();             //存放seg的Map            relurl -> segment
        this._currBufSize = 0;                 //目前的buffer总大小
        this.sn2Url = new Map();               //以sn查找relurl      sn -> relurl
        this.overflowed = false;               //缓存是否溢出
    }

    get currBufSize() {
        return this._currBufSize;
    }

    hasSegOfURL(url) {                                                     //防止重复加入seg
        return this._segPool.has(url);
    }

    copyAndAddBuffer(data, url, sn, fromPeerId = '') {                                       //先复制再缓存
        const handledUrl = handleTSUrl(url, this.config.tsStrictMatched);
        let payloadBuf = Buffer.from(data);
        let byteLength = payloadBuf.byteLength;
        let targetBuffer = new Buffer(byteLength);
        payloadBuf.copy(targetBuffer);

        let segment = {
            sn,
            relurl: handledUrl,
            data: targetBuffer,
            size: byteLength,
            fromPeerId
        };

        this.addSeg(segment);
        this.sn2Url.set(sn, handledUrl);
    }

    addBuffer(sn, url, buf, fromPeerId = '') {                                             //直接缓存
        const handledUrl = handleTSUrl(url, this.config.tsStrictMatched);
        let segment = {
            sn,
            relurl: handledUrl,
            data: buf,
            size: buf.byteLength,
            fromPeerId
        };
        this.addSeg(segment);
        this.sn2Url.set(sn, handledUrl);
    }

    addSeg(seg) {
        const { logger } = this.engine;
        this._segPool.set(seg.relurl, seg);
        // this.urlSet.add(seg.relurl);
        // logger.debug(`_segPool add seg ${seg.relurl}`);
        this._currBufSize += parseInt(seg.size);
        // logger.debug(`seg.size ${seg.size} _currBufSize ${this._currBufSize} maxBufSize ${this.config.maxBufSize}`);
        while (this._currBufSize > this.config.maxBufSize) {                       //去掉多余的数据
            const lastSeg =[...this._segPool.values()].shift();
            logger.info(`pop seg ${lastSeg.relurl} at ${lastSeg.sn}`);
            this._segPool.delete(lastSeg.relurl);
            this.sn2Url.delete(lastSeg.sn);
            this._currBufSize -= parseInt(lastSeg.size);
            if (!this.overflowed) this.overflowed = true;
            this.emit(Events.BM_LOST, lastSeg.sn);
        }
    }

    getSegByURL(relurl) {
        return this._segPool.get(relurl);
    }

    getURLbySN(sn) {
        return this.sn2Url.get(sn);
    }

    clear() {
        this._segPool.clear();
        this.sn2Url.clear();
        this._currBufSize = 0;
    }

    destroy() {
        this.clear();
        this.removeAllListeners();
    }
}

export default BufferManager;