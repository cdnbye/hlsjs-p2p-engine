/**
 * Created by xieting on 2018/1/4.
 */

import EventEmitter from 'events';

class P2PScheduler extends EventEmitter {
    constructor() {
        super();

        this.upstreamers = [];                        //存放父节点的数组
        this.downstreamers = [];                      //存放子节点的数组
    }

    _addUpStreamer(channel) {
        this.upstreamers.push(channel);


    }

    _addDownStreamer(channel) {
        this.downstreamers.push(channel);
    }

    addDataChannel(channel) {
        if (channel.isReceiver) {                        //分别存放父节点和子节点
            this._addUpStreamer(channel);
        } else {
            this._addDownStreamer(channel);
        }
    }

    deleteDataChannel(channel) {
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
}

export default P2PScheduler;