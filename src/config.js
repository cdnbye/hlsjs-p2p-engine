/**
 * Created by xieting on 2018/1/3.
 */

let recommendedHlsjsConfig = {
    maxBufferSize: 0,
    maxBufferLength: 30,
    liveSyncDuration: 30,
    fragLoadingTimeOut: 4000,              // used by fragment-loader
};

//时间单位统一为秒
let defaultP2PConfig = {
    websocketAddr: 'ws://120.78.168.126:3389',     //信令&调度服务器地址
    websocketRetryDelay: 2,                       //发送数据重试时间间隔

    dcKeepAliveInterval: 10,                    //datachannel多少秒发送一次keep-alive信息
    dcKeepAliveAckTimeout: 2,                    //datachannel接收keep-alive-ack信息的超时时间，超时则认为连接失败并主动关闭
    dcRequestTimeout: 2,                               //datachannel接收二进制数据的超时时间
    packetSize: 60*1024,                        //每次通过datachannel发送的包的大小
    maxBufSize: 1024*1024*100,                  //p2p缓存的最大数据量
    live: true,                                 //直播或点播
    loadTimeout: 5,                             //p2p下载的超时时间
    reportInterval: 30,                         //统计信息上报的时间间隔
};

export {recommendedHlsjsConfig, defaultP2PConfig}
