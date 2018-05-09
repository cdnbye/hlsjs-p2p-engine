/**
 * Created by xieting on 2018/1/3.
 */
import {config as liveConfig} from './fastmesh';
import {config as vodConfig} from './bittorrent';


//时间单位统一为秒
let defaultP2PConfig = {
    key: 'free',                                //连接RP服务器的API key
    engine: 'bt',                               //采用的算法，分为“bt”和“fastmesh”，默认“bt”

    wsSignalerAddr: 'ws://120.78.168.126:8081/ws',          //信令服务器地址
    wsMaxRetries: 3,                           //发送数据重试次数
    wsReconnectInterval: 5,                     //websocket重连时间间隔

    p2pEnabled: true,                           //是否开启P2P，默认true

    dcKeepAliveInterval: 10,                    //datachannel多少秒发送一次keep-alive信息
    dcKeepAliveAckTimeout: 2,                   //datachannel接收keep-alive-ack信息的超时时间，超时则认为连接失败并主动关闭
    dcRequestTimeout: 3,                        //datachannel接收二进制数据的超时时间
    dcUploadTimeout: 3,                         //datachannel上传二进制数据的超时时间
    dcPings: 5,                          //datachannel发送ping数据包的数量
    dcTolerance: 4,                             //请求超时或错误多少次淘汰该peer

    packetSize: 16*1024,                        //每次通过datachannel发送的包的大小
    maxBufSize: 1024*1024*50,                   //p2p缓存的最大数据量
    loadTimeout: 5,                             //p2p下载的超时时间
    reportInterval: 20,                         //统计信息上报的时间间隔(废弃)

    enableLogUpload: false,                      //上传log到服务器，默认true
    logUploadAddr: 'ws://localhost:3389/ws', //log上传地址
    logUploadLevel: 'info',                      //log上传level，默认info
    logLevel: 'warn',                           //log的level，默认warn

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
