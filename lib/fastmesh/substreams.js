/**
 * Created by xieting on 2018/3/9.
 */
import EventEmitter from 'events';
import Events from '../events';

class Substreams extends EventEmitter {
    constructor(config) {
        super();

        this.bitrate = 0;                                             //总的码率
        this.totalStreams = config.defaultSubstreams;                 //子流的数量

        this.target = 0;                                        //下次下载的目标子流

        this.streams = [];                                            //每个元素是DataChannel的实例
    }

    get substreamRate() {                                             //子流的码率
        return Math.round(this.bitrate/this.totalStreams);
    }

    get streamCount() {
        return this.streams.length
    }

    get requestFromP2P() {
        return this.target < this.streams.length;
    }

    get currentStreamer() {
        return this.streams[this.target];
    }

    get p2pStreamRate() {                                          //目前p2p的总的bitrate
        return this.substreamRate * this.streamCount;
    }

    requestData(relurl) {
        let stream = this.streams[this.target];
        stream.clearQueue();
        console.warn(`stream ${stream.remotePeerId} requestData ${relurl}`);
        stream.requestData(relurl);
        this.adjustTarget()
    }

    adjustTarget() {
        this.target = (this.target >= this.totalStreams -1 ? 0 : this.target + 1);
    }

    clear() {
        if (this.streams.length > 0) {
            this.streams = [];
        }
    }

    addSubstreams(stream, copys) {
        for (let i=0;i<copys;++i) {
            if (this.streams.length >= this.totalStreams) break;
            this.streams.push(stream);
        }
    }

    deleteSubstream(id) {
        // let newStreams = [];
        // for (let stream of this.streams) {
        //     if (stream.remotePeerId !== id) {
        //         newStreams.push(stream);
        //     }
        // }
        // this.streams = newStreams;
        this.streams = this.streams.filter(stream => stream.remotePeerId !== id);
    }

    needMoreStreams() {
        return this.streams.length < this.totalStreams;
    }
}

export default Substreams;
