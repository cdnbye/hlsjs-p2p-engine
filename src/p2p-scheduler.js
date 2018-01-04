/**
 * Created by xieting on 2018/1/4.
 */

import EventEmitter from 'events';

class P2PScheduler extends EventEmitter {
    constructor() {
        super();

        this.upstreamers = [];
        this.downstreamers = [];
    }

    addUpStreamer(node) {

    }

    addDownStreamer(node) {

    }
}

export default P2PScheduler;