/**
 * Created by xieting on 2018/1/9.
 */

import EventEmitter from 'events';
var Buffer = require('buffer/').Buffer;

const log = console.log;

class BufferManager extends EventEmitter {
    constructor(config) {
        super();

        this.config = config;
        /* segment
        sn: number
        relurl: string
        data: Buffer
        size: string
         */
        this._segPool = new Map();             //存放seg的Map
        this._currBufSize = 0;                 //目前的buffer总大小
    }

    get currBufSize() {
        return this._currBufSize;
    }

    hasSegOfURL(url) {                                                     //防止重复加入seg
        return this._segPool.has(url);
    }

    copyAndAddSeg(data, url, sn) {
        let payloadBuf = Buffer.from(data);
        let byteLength = payloadBuf.byteLength;
        let targetBuffer = new Buffer(byteLength);
        payloadBuf.copy(targetBuffer);

        let segment = {
            sn: sn,
            relurl: url,
            data: targetBuffer,
            size: byteLength
        };

        this.addSeg(segment);
    }

    addSeg(seg) {
        log(`add seg ${seg.sn} url ${seg.relurl} size ${seg.data.byteLength}`);
        this._segPool.set(seg.relurl, seg);
        // this.urlSet.add(seg.relurl);
        this._currBufSize += parseInt(seg.size);
        console.log(`seg.size ${seg.size} _currBufSize ${this._currBufSize} maxBufSize ${this.config.maxBufSize}`);
        while (this._currBufSize > this.config.maxBufSize) {         //去掉多余的数据
            const lastSeg =[...this._segPool.values()].shift();
            console.warn(`pop seg ${lastSeg.relurl}`);
            this._segPool.delete(lastSeg.relurl);
            this._currBufSize -= parseInt(lastSeg.size);

        }
    }

    getSegByURL(relurl) {
        return this._segPool.get(relurl);
    }

    clear() {
        this._segPool.clear();
        this._currBufSize = 0;
    }
}

export default BufferManager;