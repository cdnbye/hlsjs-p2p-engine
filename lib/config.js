/**
 * Created by xieting on 2018/1/3.
 */
import {config as liveConfig} from './live/fastmesh';
import {config as vodConfig} from './vod/bittorrent';


//时间单位统一为秒
let defaultP2PConfig = {
    key: 'free',                                //连接RP服务器的API key
    mode: 'vod',                               //播放的流媒体类别，分为‘live‘和‘vod’两种，默认vod

    wsSignalerAddr: 'ws://120.78.168.126:8081/ws',          //信令服务器地址
    wsMaxRetries: 3,                           //发送数据重试次数
    wsReconnectInterval: 5,                     //websocket重连时间间隔

    p2pEnabled: true,                           //是否开启P2P，默认true

    dcKeepAliveInterval: 10,                    //datachannel多少秒发送一次keep-alive信息
    dcKeepAliveAckTimeout: 2,                   //datachannel接收keep-alive-ack信息的超时时间，超时则认为连接失败并主动关闭
    dcRequestTimeout: 2,                        //datachannel接收二进制数据的超时时间

    packetSize: 16*1024,                        //每次通过datachannel发送的包的大小
    maxBufSize: 1024*1024*50,                   //p2p缓存的最大数据量
    loadTimeout: 5,                             //p2p下载的超时时间
    reportInterval: 60,                         //统计信息上报的时间间隔

};

let p2pConfig;

if (__EXCLUDE_LIVE__) {
    p2pConfig = Object.assign(defaultP2PConfig, vodConfig);
} else if (__EXCLUDE_VOD__) {
    p2pConfig = Object.assign(defaultP2PConfig, liveConfig);
} else {
    p2pConfig = Object.assign(defaultP2PConfig, liveConfig, vodConfig);
}



export default p2pConfig;
