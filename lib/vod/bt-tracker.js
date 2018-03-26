/**
 * Created by xieting on 2018/3/23.
 */

import EventEmitter from 'events';
import BTScheduler from './bt-scheduler';
import sha1 from 'simple-sha1';

class BTTracker extends EventEmitter {
    constructor(channel, config, info) {
        super();

        this.config = config;
        this.browserInfo = info;
        this.connected = false;
        this.channel = channel;
        this.scheduler = new BTScheduler(config);
        this.DCMap = new Map();                                  //{key: remotePeerId, value: DataChannnel}
        this.failedDCMap = new Map();                            //{key: remotePeerId, value: boolean}
        config.announce = `${config.announce}?key=${window.encodeURIComponent(config.key)}&room=${window.encodeURIComponent(channel)}&mode=${window.encodeURIComponent(config.mode)}`;
        console.log('connecting to :' + config.announce);
        this.signalerWs = null;                                  //信令服务器ws


        this._setupScheduler(this.scheduler);
    }

    set currentPlaySN(sn) {

    }

    _setupScheduler(scheduler) {

    }

    send(msg) {

    }

    resumeP2P() {

    }
}

export default BTTracker;