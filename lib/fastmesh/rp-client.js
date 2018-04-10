/**
 * Created by xieting on 2018/1/3.
 */

/*
TODO:
 */

import EventEmitter from 'events';
import {Events} from '../pear';
import DataChannel from '../pear';
import P2PScheduler from './p2p-scheduler';
import ReconnectingWebSocket from 'reconnecting-websocket';
import SignalClient from '../signal-client';

// const log = console.log;

export default class P2PSignaler extends EventEmitter {
    constructor(channel, config, info) {
        super();

        this.config = config;
        this.browserInfo = info;
        this.connected = false;
        this.channel = channel;                                  //频道
        this.scheduler = new P2PScheduler(config);
        this.DCMap = new Map();                                  //{key: remotePeerId, value: DataChannnel}
        this.failedDCMap = new Map();                            //{key: remotePeerId, value: boolean}
        config.wsSchedulerAddr = `${config.wsSchedulerAddr}?key=${window.encodeURIComponent(config.key)}&room=${window.encodeURIComponent(channel)}&mode=${window.encodeURIComponent(config.mode)}`;
        console.log('connecting to :' + config.wsSchedulerAddr);
        this.schedulerWs = null;                                 //调度服务器ws
        this.signalerWs = null;                                  //信令服务器ws
        // if (config.p2pEnabled) {
        //     this.schedulerWs = this._initSchedulerWs(info);
        // }


        this._setupScheduler(this.scheduler);

        //fastmesh
        this.candidateParents = [];                               //候选父节点，最后的优先级最高
        this.getParentsTimes = 0;                                 //当前获取父节点的次数
    }

    send(msg) {
        if (this.connected) {
            this.schedulerWs.send(msg);
        }
    }

    stopP2P() {
        this.scheduler.clearAllStreamers();
        // let msg = {
        //     action: 'leave'
        // };
        // this.send(msg);
        this.schedulerWs.close(1000, '', {keepClosed: true, fastClose: true});

    }

    resumeP2P() {
        if (!this.connected) {
            this.schedulerWs = this._initSchedulerWs(this.browserInfo);
        }
    }

    set currentPlaySN(sn) {
        this.scheduler.currentPlaySN = sn;
    }

    set currentLoadedSN(sn) {

    }

    _setupScheduler(scheduler) {

        this.tranPending = false;

        scheduler.on(Events.TRANSITION, () => {                               //监听跃迁请求

            if (!this.tranPending) {                                          //防止重复发送请求
                let msg = {
                    action: 'transition'
                };
                this.send(msg);
                this.tranPending = true;
            }
        })
        //parents: {peer_id, substreams}
            .on(Events.CONNECT, parents => {                                  //爬树中尝试与所有peer建立data channel
                parents.forEach(parent => {
                    this._createDatachannel(parent.peer_id, true, parent.substreams);
                })
            })
            .on(Events.ADOPT, peerId => {
                // let adoptMsg = {
                //     action: 'adopt',
                //     to_peer_id: peerId
                // };
                // this.websocket.send(adoptMsg);
                this._adoptAncestor(peerId);
            })
    }

    _initSignalerWs() {

        let websocket = new SignalClient(this.peerId, this.config);
        websocket.onopen = () => {
            this.connected = true;
            //向scheduler websocket发送获取父节点信息
            let msg = {
                action: 'get_parents'
            };
            if (!!this.schedulerWs) {
                this.schedulerWs.send(msg);
            }
        };

        websocket.onmessage = (e) => {
            let msg = JSON.parse(e.data);
            let action = msg.action;
            switch (action) {
                case 'signal':
                    console.log('start _handleSignal');
                    this._handleSignal(msg.from_peer_id, msg.data);
                    break;
                case 'reject':
                    this.stopP2P();
                    break;
                default:
                    console.log('Signaler websocket unknown action ' + action);

            }

        };
        websocket.onclose = () => {                                            //websocket断开时清除datachannel
            this.connected = false;
        };
        return websocket;
    }

    _initSchedulerWs(info) {

        const wsOptions = {
            maxRetries: this.config.wsMaxRetries,
            minReconnectionDelay: this.config.wsReconnectInterval*1000

        };
        let websocket = new ReconnectingWebSocket(this.config.wsSchedulerAddr, undefined, wsOptions);


        websocket.onopen = () => {
            console.log('websocket connection opened with channel: ' + this.channel);

            //发送进入频道请求
            let msg = {
                action: 'enter',
                channel: this.channel,
                ul_bw: Math.round(this.config.defaultUploadBW)
            };

            if (info) {
                msg = Object.assign(msg, info);
            }

            websocket.push(JSON.stringify(msg));
        };

        websocket.push = websocket.send;
        websocket.send = msg => {
            let msgStr = JSON.stringify(Object.assign({channel: this.channel, peer_id: this.peerId}, msg));
            console.log("send to websocket is " + msgStr);
            websocket.push(msgStr);
        };
        websocket.onmessage = (e) => {
            console.log('websocket on msg: ' + e.data);
            let msg = JSON.parse(e.data);
            let action = msg.action;
            switch (action) {
                case 'signal':
                    console.log('start _handleSignal');
                    this._handleSignal(msg.from_peer_id, msg.data);
                    break;
                case 'parents':
                    console.log('receive parents');
                    this._handleParentsMsg(msg.nodes);
                    break;
                case 'connect':
                    console.log('start _handleConnect');
                    this._createDatachannel(msg.to_peer_id, true, 1);
                    break;
                case 'disconnect':
                    this._handleDisconnectMsg(msg);                        //未实现
                    break;
                case 'accept':
                    this._handleAcceptMsg(msg);
                    break;
                case 'transition':                                         //跃迁
                    this._handleTransitionMsg(msg);
                    break;
                case 'adopt':
                    console.log('start _handledopt');
                    this._handleAdoptMsg(msg);
                    break;
                case 'reject':
                    this.stopP2P();
                    break;
                default:
                    console.log('websocket unknown action ' + action);

            }

        };
        websocket.onclose = () => {                                            //websocket断开时清除datachannel
            console.warn(`websocket closed`);
            this.connected = false;
            this.scheduler.clearAllStreamers();
            this.DCMap.clear();
        };
        return websocket;
    }

    _handleSignal(remotePeerId, data) {
        let datachannel = this.DCMap.get(remotePeerId);
        if (datachannel && datachannel.connected) {
            console.warn(`datachannel had connected, signal ignored`);
            return
        }
        if (!datachannel) {                                               //收到子节点连接请求
            console.log(`receive child node connection request`);
            datachannel =  this._createDatachannel(remotePeerId, false, 1);
        }
        datachannel.receiveSignal(data);
    }

    /*
     nodes: Array<Object<peer_id:string, residual_bw:number>>
     */
    _handleParentsMsg(nodes) {
        if (nodes.length === 0) return;
        //过滤掉已经连接的节点和连接失败的节点
        nodes = nodes.filter(node => {

            for (let peerId of [...this.DCMap.keys(),...this.failedDCMap.keys()]) {
                if (node.peer_id === peerId) {
                    return false;
                }
            }
            return true;
        });
        //按上行带宽从小到大排序
        nodes.sort((a, b) => a.residual_bw - b.residual_bw);

        this.candidateParents = nodes;
        // console.log(`candidateParents: ${JSON.stringify(this.candidateParents)}`);
        if (nodes.length > 0) {
            this._handleParents();
        }
    }

    _handleParents() {
        let parent = this.candidateParents.pop();
        while (this.failedDCMap.get(parent.peer_id) || parent.peer_id === this.peerId) {             //过滤掉已经连接失败的节点)
            if (this.candidateParents.length === 0) return;
            parent = this.candidateParents.pop();
        }
        const subStreamRate = this.scheduler.substreams.substreamRate;
        if (parent.residual_bw >= subStreamRate) {
            let copys = Math.floor(parent.residual_bw/subStreamRate);
            console.warn(`residual_bw ${parent.residual_bw} subStreamRate ${subStreamRate}`);
            let remain = this.scheduler.substreams.totalStreams - this.scheduler.substreams.streamCount;
            copys = copys > remain ? remain : copys;
            this._createDatachannel(parent.peer_id, true, copys);                       //尝试与第一个连接
        }
    }

    _handleAdoptMsg(msg) {
        if (!msg.parent_id) return;
        this.scheduler.clearUpstreamers();                              //与当前所有父节点断开p2p连接
        const subStreamRate = this.scheduler.substreams.substreamRate;
        let copys = Math.floor(msg.residual_bw/subStreamRate);
        copys = copys > this.scheduler.substreams.totalStreams ? this.scheduler.substreams.totalStreams : copys;
        copys = copys >= 1 ? copys : 1;
        console.warn(`_createDatachannel parent_id ${msg.parent_id} copys ${copys}`);
        this._createDatachannel(msg.parent_id, true, copys);
    }

    _handleDisconnectMsg(msg) {

    }

    _handleAcceptMsg(msg) {
        console.log('accept');
        this.scheduler.peerId = this.peerId = msg.peer_id;                              //获取本端Id
        if (msg.substreams) this.scheduler.substreams.totalStreams = msg.substreams;
        this.signalerWs = this._initSignalerWs();
    }

    _handleTransitionMsg(msg) {
        this.tranPending = false;
        if (msg.success) {                                           //请求成功

            this.scheduler.moveUpstreamsersToDown();
        }
    }

    _adoptAncestor(remotePeerId) {                                  //使祖先节点成为子节点，如果是直接父节点则不用再次建立p2p连接
        this.scheduler.upstreamers.forEach(item => {
            console.warn(`[_adoptAncestor] remotePeerId ${item.remotePeerId}`);
        })

        let streamer = this.scheduler.upstreamers.find(item => item.remotePeerId === remotePeerId);
        if (streamer) {
            // console.warn(`[_adoptAncestor] exchangeWithStreamser`);
            this.scheduler.exchangeWithStreamser(streamer);
            //同时发送断开和连接信息
            let msg = {
                action: 'dc_closed',
                dc_id: streamer.channelId,
                substreams: streamer.copys,
                stream_rate: this.scheduler.substreams.substreamRate
            };
            this.schedulerWs.send(msg);
            streamer.channelId = `${remotePeerId}-${this.peerId}`;
            msg.action = 'dc_opened';
            msg.dc_id = streamer.channelId;
            this.schedulerWs.send(msg);
            return
        }
        //不是直接父节点则通过websocket发送adopt信息
        let adoptMsg = {
            action: 'adopt',
            to_peer_id: remotePeerId
        };
        this.schedulerWs.send(adoptMsg);
    }

    _createDatachannel(remotePeerId, isInitiator, copys) {               //copys:占据多少条子流，默认1
        if (!copys) copys = 1;
        let datachannel = new DataChannel(this.peerId, remotePeerId, isInitiator, this.config);
        this.DCMap.set(remotePeerId, datachannel);                                  //将对等端Id作为键
        datachannel.copys = copys;
        this._setupDC(datachannel);
        return datachannel;
    }

    _setupDC(datachannel) {
        datachannel.on(Events.DC_SIGNAL, data => {
            this.signalerWs.sendSignal(datachannel.remotePeerId, data);
        })
            .once(Events.DC_ERROR, () => {
                let msg = {
                    action: 'dc_failed',
                    dc_id: datachannel.channelId,
                };
                this.schedulerWs.send(msg);
                console.log(`datachannel error ${datachannel.channelId}`);
                this.scheduler.deleteDataChannel(datachannel);
                this.DCMap.delete(datachannel.remotePeerId);
                this.failedDCMap.set(datachannel.remotePeerId, true);              //记录失败的连接


                if (this.candidateParents.length > 0) {                            //如果连接失败与剩余的尝试连接
                    this._handleParents();
                } else {                                                           //中途连接错误
                    //如果是这条channel的子节点并且父节点父节点不够了则向服务器请求候选父节点
                    if (datachannel.isReceiver && this.scheduler.substreams.needMoreStreams() && this.getParentsTimes <= this.config.maxGetParentsTries) {
                        let msg = {
                            action: 'get_parents'
                        };
                        this.schedulerWs.send(msg);
                        this.getParentsTimes ++;
                    }
                }

                datachannel.destroy();

            })
            .once(Events.DC_CLOSE, () => {

                console.warn(`datachannel closed ${datachannel.channelId} `);
                let msg = {
                    action: 'dc_closed',
                    dc_id: datachannel.channelId,
                    substreams: datachannel.copys,
                    stream_rate: this.scheduler.substreams.substreamRate
                };
                this.schedulerWs.send(msg);
                this.scheduler.deleteDataChannel(datachannel);
                this.DCMap.delete(datachannel.remotePeerId);

                //如果是这条channel的子节点并且没有父节点了则向服务器请求候选父节点
                console.warn(`this.scheduler.substreams.needMoreStreams ${this.scheduler.substreams.needMoreStreams()}`)
                if (datachannel.isReceiver && this.scheduler.substreams.needMoreStreams() && this.getParentsTimes <= this.config.maxGetParentsTries) {
                    let msg = {
                        action: 'get_parents'
                    };
                    this.schedulerWs.send(msg);
                    this.getParentsTimes ++;
                }

                datachannel.destroy();


        })
            .once(Events.DC_OPEN, () => {

                this.scheduler.addDataChannel(datachannel);
                datachannel.connected = true;
                if (this.scheduler.transitioning) {                            //跃迁中
                    this.scheduler.clearUpstreamers();                         //与当前所有父节点断开p2p连接
                    this.scheduler.transitioning = false;                      //跃迁成功
                    // if (this.scheduler.targetAncestorId) {
                    //     let adoptMsg = {
                    //         action: 'adopt',
                    //         to_peer_id: this.scheduler.targetAncestorId
                    //     };
                    //     this.schedulerWs.send(adoptMsg);
                    // }
                } else {                                                       //从RP获取节点
                    // this.candidateParents = [];                                //防止一段时间后连接上行带宽已发生变化
                    //如果父节点不够指定数量，则继续连接其它父节点
                    if (this.candidateParents.length > 0 && this.scheduler.substreams.needMoreStreams()) {
                        this._handleParents();
                        // console.warn(`dcopened connecting to ${parentId}`);
                    } else {
                        this.candidateParents = [];
                    }

                }

                if (datachannel.isReceiver) {                              //子节点发送已连接消息
                    let msg = {
                        action: 'dc_opened',
                        dc_id: datachannel.channelId,
                        substreams: datachannel.copys,
                        stream_rate: this.scheduler.substreams.substreamRate
                    };
                    this.schedulerWs.send(msg);
                }
                // console.warn(`parents num: ${this.scheduler.upstreamers.length}`);
            })
    }

    destroy() {
        this.schedulerWs.close();
        this.signalerWs.close();
        this.schedulerWs = null;
        this.signalerWs = null;
    }
}