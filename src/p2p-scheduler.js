/**
 * Created by xieting on 2018/1/4.
 */

import debug from 'debug';
import EventEmitter from 'events';
import Events from './events';

const log = debug('p2p-scheduler');

class P2PScheduler extends EventEmitter {
    constructor(config) {
        super();

        this.upstreamers = [];                        //存放父节点的数组
        this.downstreamers = [];                      //存放子节点的数组

    }

    load(context, config, callbacks) {


        this.context = context;
        this.config = config;
        this.callbacks = callbacks;
        this.stats = {trequest: performance.now(), retry: 0};
        this.retryDelay = config.retryDelay;
        this._loadInternal();
    }

    abort() {
        log(`p2pLoader abort`);

        this.currUpstreamer.clearQueue();
    }

    destroy() {
        log(`p2pLoader destroy`);
    }

    _loadInternal() {
        let stats = this.stats;
        stats.tfirst = 0;
        stats.loaded = 0;

        const peer = this.upstreamers[0];
        this.currUpstreamer = peer;                                      //目前用于下载的父节点
        const frag = this.context.frag;
        log(`p2pLoader load ${frag.relurl} at ${frag.sn}`);
        const msg = {
            event: 'REQUEST',
            url: this.context.frag.relurl,
            sn: this.context.frag.sn
        }
        peer.request(JSON.stringify(msg));
    }

    get hasUpstreamer() {
        return this.upstreamers.length > 0 ? true : false;
    }

    _addUpStreamer(channel) {
        this.upstreamers.push(channel);

        this._setupChannel(channel);
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

    _setupChannel(channel) {
        channel.on(Events.DC_RESPONSE, response => {

            this.callbacks.onSuccess(response, this.stats, this.context);
        })
    }
}

export default P2PScheduler;