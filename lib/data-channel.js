/**
 * Created by xieting on 2018/1/4.
 */

import SimplePeer from 'simple-peer';
import EventEmitter from 'events';
import Events from './events';
var Buffer = require('buffer/').Buffer;

const log = console.log;

class DataChannel extends EventEmitter {
    constructor(peerId, remotePeerId, isInitiator, config) {
        super();

        this.config = config;
        this.remotePeerId = remotePeerId;
        this.channelId = isInitiator ? peerId + '-' + remotePeerId : remotePeerId + '-' + peerId;                    //标识该channel
        // console.warn(`this.channelId ${this.channelId}`);
        this.connected = false;

        //下载控制
        this.queue = [];                           //下载队列
        this.loading = false;

        this._datachannel = new SimplePeer({ initiator: isInitiator, objectMode: true});
        this.isReceiver = isInitiator;                                           //主动发起连接的为数据接受者，用于标识本节点的类型
        this._init(this._datachannel);

        //fastmesh
        this.streamingRate = 0;                         //单位bit/s
        //记录发送的数据量，用于计算streaming rate
        this.recordSended = this._adjustStreamingRate(10);
    }

    _init(datachannel) {

        datachannel.on('error', (err) => {
            log('datachannel error', err);
            this.emit(Events.DC_ERROR);
        });

        datachannel.on('signal', data => {
            // log('SIGNAL', JSON.stringify(data));
            this.emit(Events.DC_SIGNAL, data);
        });

        datachannel.once('connect', () => {
            log('datachannel CONNECTED to ' + this.remotePeerId);
            this.emit(Events.DC_OPEN);
            // if (this.isReceiver) {
            //     this.keepAliveInterval = window.setInterval(() => {                      //数据接收者每隔一段时间发送keep-alive信息
            //         let msg = {
            //             event: 'KEEPALIVE'
            //         };
            //         datachannel.send(JSON.stringify(msg));
            //         // this.keepAliveAckTimeout = window.setTimeout(this._handleKeepAliveAckTimeout.bind(this),
            //         //     config.dcKeepAliveAckTimeout*1000);
            //     }, config.dcKeepAliveInterval*1000);
            // }
        });

        datachannel.on('data', data => {
            if (typeof data === 'string') {
                log('datachannel receive string: ' + data + 'from ' + this.remotePeerId);

                let msg = JSON.parse(data);
                let event = msg.event;
                switch (event) {
                    // case 'KEEPALIVE':
                    //     this._handleKeepAlive(msg);
                    //     break;
                    // case 'KEEPALIVE-ACK':
                    //     this._handleKeepAliveAck(msg);
                    //     break;
                    case 'BINARY':
                        this.emit(Events.DC_BINARY);
                        this._prepareForBinary(msg.attachments, msg.url, msg.sn, msg.size);
                        break;
                    case 'REQUEST':
                        // if (msg.br) this.streamingRate = msg.br;                       //记录该datachannel的码率(改成实时调整)
                        this.emit(Events.DC_REQUEST, msg);
                        break;
                    case 'LACK':
                        this.loading = false;
                        this.emit(Events.DC_REQUESTFAIL, msg);
                        break;
                    case 'DISPLACE':                                                   //通知对方成为子节点
                        this.emit(Events.DISPLACE);
                        break;
                    case 'CLOSE':
                        this.emit(Events.DC_CLOSE);
                        break;
                    case 'TRANSITION':                                                  //子节点的跃迁请求
                        this.emit(Events.DC_TRANSITION, msg);
                        break;
                    case 'GRANT':                                                       //收到GRANT信息后首先判断是否发给自己的，否则如果TTL>0则继续向子节点广播
                        this._handleGrant(msg);
                        break;
                    default:

                }
            } else if (data instanceof Buffer){                                       //binary data
                // log(`datachannel receive binary data size ${data.byteLength}`);
                this.bufArr.push(data);
                this.remainAttachments --;
                if (this.remainAttachments === 0) {
                    this._handleBanaryData();
                }
            }


        });

        datachannel.once('close', () => {
            this.emit(Events.DC_CLOSE);
        });
    }

    send(data) {
        if (this._datachannel && this._datachannel.connected) {
            this._datachannel.send(data);
        }
    }

    request(data) {                                     //由于需要阻塞下载数据，因此request请求用新的API
        if (this._datachannel && this._datachannel.connected) {
           if (this.loading) {
               this.queue.push(data);
           } else {
               this._datachannel.send(data);
               this.loading = true;
           }
        }
    }

    close() {
        this.destroy();
    }

    receiveSignal(data) {
        log('datachannel receive siganl ' + JSON.stringify(data));
        this._datachannel.signal(data);
    }

    destroy() {
        // window.clearInterval(this.keepAliveInterval);
        // this.keepAliveInterval = null;
        // window.clearTimeout(this.keepAliveAckTimeout);
        // this.keepAliveAckTimeout = null;
        window.clearInterval(this.adjustSRInterval);
        this._datachannel.removeAllListeners();
        this.removeAllListeners();
        this._datachannel.destroy();
    }

    clearQueue() {
        if (this.queue.length > 0) {
            this.queue = [];
        }
    }

    _prepareForBinary(attachments, url, sn, expectedSize) {
        this.bufArr = [];
        this.remainAttachments = attachments;
        this.bufUrl = url;
        this.bufSN = sn;
        this.expectedSize = expectedSize;
    }

    _handleBanaryData() {
        log(`datachannel _handleBanaryData`);
        let payload = Buffer.concat(this.bufArr);
        if (payload.byteLength == this.expectedSize) {                            //校验数据
            this.emit(Events.DC_RESPONSE, {url: this.bufUrl, sn: this.bufSN, data: payload});
        }
        this.bufUrl = '';
        this.bufArr = [];
        this.expectedSize = -1;

        this.loading = false;
        if (this.queue.length > 0) {                     //如果下载队列不为空
            let data = this.queue.shift();
            this.request(data);
        }
    }

    _handleGrant(msg) {
        if (msg.TTL > 0) {
            this.emit(Events.DC_GRANT, msg);
        }
    }

    // _handleKeepAlive() {
    //     let msg = {
    //         event: 'KEEPALIVE-ACK'
    //     };
    //     this._datachannel.send(JSON.stringify(msg));
    // }

    // _handleKeepAliveAck() {
    //     window.clearTimeout(this.keepAliveAckTimeout);
    // }

    // _handleKeepAliveAckTimeout() {
    //     log('KeepAliveAckTimeout');
    //     this.emit(Events.DC_ERROR);
    // }

    _adjustStreamingRate(interval) {                             //每隔一段时间计算streaming rate，单位bit/s
        let sended = 0;
        this.adjustSRInterval = window.setInterval(() => {
            this.streamingRate = Math.round(sended*8/interval);
            sended = 0;
            // console.warn(`streamingRate ${this.streamingRate/8/1024}KB/s`);
        }, interval*1000);
        return increment => {
            sended += increment;
        }
    }

}

export default DataChannel;