/**
 * Created by xieting on 2018/1/3.
 */

import EventEmitter from 'events';

export default class P2PSignaler extends EventEmitter {
    constructor(channel, config) {
        super();

        this.connected = false;
        this.channel = channel;
        this.config = config;
        this.peer = null;
    }
}