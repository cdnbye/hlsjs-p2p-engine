/**
 * Created by xieting on 2018/4/2.
 */

import SimpleChannel from './simple-channel';
import EventEmitter from 'events';
import Events from './events';
var Buffer = require('buffer/').Buffer;

class DataChannel extends EventEmitter {
    constructor(peerId, remotePeerId, isInitiator, config) {
        super();

        this.config = config;
        this.remotePeerId = remotePeerId;
        this.channelId = isInitiator ? peerId + '-' + remotePeerId : remotePeerId + '-' + peerId;                    //标识该channel
        // console.warn(`this.channelId ${this.channelId}`);
        this.connected = false;
        this.msgQueue = [];
        this.miss = 0;                            //超时或者错误的次数

        //下载控制
        this.rcvdReqQueue = [];                   //接收到的请求的队列    队列末尾优先级最高 sn
        this.downloading = false;
        this.uploading = false;

        //延迟计算
        this.delays = [];

        this._datachannel = new SimpleChannel({ initiator: isInitiator, objectMode: true});
        this.isInitiator = isInitiator;                                           //是否主动发起连接的
        this._init(this._datachannel);

        this.streamingRate = 0;                                           //单位bit/s
        //记录发送的数据量，用于计算streaming rate
        this.recordSended = this._adjustStreamingRate(10);
    }

    _init(datachannel) {

        datachannel.on('error', (err) => {
            logger.error('datachannel error', err);
            this.emit(Events.DC_ERROR);
        });

        datachannel.on('signal', data => {
            this.emit(Events.DC_SIGNAL, data);
        });

        const _onConnect = () => {
            logger.info('datachannel CONNECTED to ' + this.remotePeerId);
            this.connected = true;
            this.emit(Events.DC_OPEN);
            //测试延迟
            this._sendPing();
            //发送消息队列中的消息
            while (this.msgQueue.length > 0) {
                let msg = this.msgQueue.shift();
                this.emit(msg.event, msg);
            }
        };

        datachannel.once('connect', _onConnect);

        datachannel.on('data', data => {
            if (typeof data === 'string') {
                logger.info('datachannel receive string: ' + data + 'from ' + this.remotePeerId);

                let msg = JSON.parse(data);
                //如果还没连接，则先保存在消息队列中
                if (!this.connected) {
                    this.msgQueue.push(msg);
                    // _onConnect();
                    return;
                }
                let event = msg.event;
                switch (event) {
                    case Events.DC_PONG:
                        this._handlePongMsg();
                        break;
                    case Events.DC_PING:
                        this.sendJson({
                            event: Events.DC_PONG
                        });
                        break;
                    case Events.DC_PIECE:
                        this._prepareForBinary(msg.attachments, msg.url, msg.sn, msg.size);
                        this.emit(msg.event, msg);
                        break;
                    case Events.DC_PIECE_NOT_FOUND:
                        window.clearTimeout(this.requestTimeout);                            //清除定时器
                        this.requestTimeout = null;
                        this.emit(msg.event, msg);
                        break;
                    case Events.DC_REQUEST:
                        this._handleRequestMsg(msg);
                        break;
                    case Events.DC_GRANT:                                                       //收到GRANT信息后首先判断是否发给自己的，否则如果TTL>0则继续向子节点广播
                        this._handleGrant(msg);
                        break;
                    case Events.DC_PIECE_ACK:
                        this._handlePieceAck();
                        break;
                    default:
                        this.emit(msg.event, msg);

                }
            } else {                                       //binary data
                // console.warn(`datachannel receive binary data size ${data.byteLength}`);
                this.bufArr.push(data);
                this.remainAttachments --;
                if (this.remainAttachments === 0) {
                    window.clearTimeout(this.requestTimeout);                            //清除定时器
                    this.requestTimeout = null;
                    this.sendJson({                                                      //发送给peer确认信息
                        event: Events.DC_PIECE_ACK,
                        sn: this.bufSN,
                        url: this.bufUrl
                    });
                    this._handleBinaryData();
                }
            }


        });

        datachannel.once('close', () => {
            this.emit(Events.DC_CLOSE);
        });
    }

    sendJson(json) {
        this.send(JSON.stringify(json));
    }

    send(data) {
        if (this._datachannel && this._datachannel.connected) {
            this._datachannel.send(data);
        }
    }

    sendBitField(field) {
        this.sendJson({                                        //向peer发送bitfield
            event: Events.DC_BITFIELD,
            field: field
        });
    }

    sendBuffer(sn, url, payload) {
        this.uploading = true;
        //开始计时
        this.uploadTimeout = window.setTimeout(this._uploadtimeout.bind(this), this.config.dcUploadTimeout*1000);

        let dataSize = payload.byteLength,                                //二进制数据大小
            packetSize = this.config.packetSize,                          //每个数据包的大小
            remainder = 0,                                                //最后一个包的大小
            attachments = 0;                                              //分多少个包发
        if (dataSize % packetSize === 0) {
            attachments = dataSize/packetSize;
        } else {
            attachments = Math.floor(dataSize/packetSize) + 1;
            remainder = dataSize % packetSize;
        }
        let response = {
            event: Events.DC_PIECE,
            attachments: attachments,
            url: url,
            sn: sn,
            size: dataSize
        };
        this.sendJson(response);
        const bufArr = dividePayload(payload, packetSize, attachments, remainder);
        for (let j=0;j<bufArr.length;j++) {
            this.send(bufArr[j]);
        }
        //记录streaming rate
        this.recordSended(dataSize);
    }

    requestDataByURL(relurl, urgent=false) {                                     //由于需要阻塞下载数据，因此request请求用新的API
        const msg = {
            event: Events.DC_REQUEST,
            url: relurl,
            urgent: urgent
        };
        this.downloading = true;
        this.sendJson(msg);
        //开始计时
        this.requestTimeout = window.setTimeout(this._loadtimeout.bind(this), this.config.dcRequestTimeout*1000);
    }

    requestDataBySN(sn, urgent=false) {                           //用于BT算法
        const msg = {
            event: Events.DC_REQUEST,
            sn: sn,                                               //ts数据的播放序号
            urgent: urgent                                        //是否紧急
        };
        this.downloading = true;
        this.sendJson(msg);
        //开始计时
        this.requestTimeout = window.setTimeout(this._loadtimeout.bind(this), this.config.dcRequestTimeout*1000);
    }

    close() {
        this.destroy();
    }

    receiveSignal(data) {
        this._datachannel.signal(data);
    }

    destroy() {
        // window.clearInterval(this.keepAliveInterval);
        // this.keepAliveInterval = null;
        // window.clearTimeout(this.keepAliveAckTimeout);
        // this.keepAliveAckTimeout = null;
        window.clearInterval(this.adjustSRInterval);
        window.clearInterval(this.pinger);
        this._datachannel.removeAllListeners();
        this.removeAllListeners();
        this._datachannel.destroy();
    }

    _handleRequestMsg(msg) {
        if (this.rcvdReqQueue.length > 0) {
            if (msg.urgent) {
                this.rcvdReqQueue.push(msg.sn);                       //urgent的放在队列末尾
            } else {
                this.rcvdReqQueue.unshift(msg.sn);
            }
        } else {
            this.emit(Events.DC_REQUEST, msg);
        }
    }

    _handlePieceAck() {
        this.uploading = false;
        window.clearTimeout(this.uploadTimeout);
        this.uploadTimeout = null;
        if (this.rcvdReqQueue.length > 0) {
            let sn = this.rcvdReqQueue.pop();
            this.emit(Events.DC_REQUEST, {sn})
        }
    }

    _prepareForBinary(attachments, url, sn, expectedSize) {
        this.bufArr = [];
        this.remainAttachments = attachments;
        this.bufUrl = url;
        this.bufSN = sn;
        this.expectedSize = expectedSize;
    }

    _handleBinaryData() {
        let payload = Buffer.concat(this.bufArr);
        if (payload.byteLength == this.expectedSize) {                            //校验数据
            this.emit(Events.DC_RESPONSE, {url: this.bufUrl, sn: this.bufSN, data: payload});
        }
        this.bufUrl = '';
        this.bufArr = [];
        this.expectedSize = -1;

        this.downloading = false;
    }

    _handleGrant(msg) {
        if (msg.TTL > 0) {
            this.emit(Events.DC_GRANT, msg);
        }
    }


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

    _loadtimeout() {                                             //下载超时
        logger.warn(`datachannel timeout while downloading` );
        this.emit(Events.DC_TIMEOUT);
        this.requestTimeout = null;
        this.downloading = false;
        this.miss ++;
        if (this.miss >= this.config.dcTolerance) {
            let msg = {
                event: Events.DC_CLOSE
            };
            this.sendJson(msg);
            this.emit(Events.DC_ERROR);
        }
    }

    _uploadtimeout() {                                           //上传超时
        logger.warn(`datachannel timeout while uploading` );
        this.uploading = false;
        if (this.rcvdReqQueue.length > 0) {
            let sn = this.rcvdReqQueue.pop();
            this.emit(Events.DC_REQUEST, {sn})
        }
    }

    _sendPing() {
        this.ping = performance.now();
        for (let i=0;i<this.config.dcPings;i++) {
            this.sendJson({
                event: Events.DC_PING
            });
        }
        window.setTimeout(() => {
            if (this.delays.length > 0) {
                let sum = 0;
                for (let delay of this.delays) {
                    sum += delay;
                }
                this.delay = sum/this.delays.length;
                this.delays = [];
            }
        }, 100);
    }

    _handlePongMsg() {
        let delay = performance.now() - this.ping;
        this.delays.push(delay);
    }
}

function dividePayload(payload, packetSize, attachments, remainder) {
    let bufArr = [];
    if (remainder) {
        let packet;
        for (let i=0;i<attachments-1;i++) {
            packet = payload.slice(i*packetSize, (i+1)*packetSize);
            bufArr.push(packet);
        }
        packet = payload.slice(payload.byteLength-remainder, payload.byteLength);
        bufArr.push(packet);
    } else {
        let packet;
        for (let i=0;i<attachments;i++) {
            packet = payload.slice(i*packetSize, (i+1)*packetSize);
            bufArr.push(packet);
        }
    }
    return bufArr;
}

export default DataChannel;
