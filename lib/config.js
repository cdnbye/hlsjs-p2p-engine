/**
 * Created by xieting on 2018/1/3.
 */


//时间单位统一为秒
let defaultP2PConfig = {
    wsAddr: 'ws://120.78.168.126:3389',         //信令&调度服务器地址
    wsMaxRetries: 10,                           //发送数据重试时间间隔
    wsReconnectInterval: 5,                     //websocket重连时间间隔
    p2pEnabled: true,                           //是否开启P2P，默认true
    dcKeepAliveInterval: 10,                    //datachannel多少秒发送一次keep-alive信息
    dcKeepAliveAckTimeout: 2,                   //datachannel接收keep-alive-ack信息的超时时间，超时则认为连接失败并主动关闭
    dcRequestTimeout: 2,                        //datachannel接收二进制数据的超时时间
    packetSize: 16*1024,                        //每次通过datachannel发送的包的大小
    maxBufSize: 1024*1024*50,                   //p2p缓存的最大数据量
    loadTimeout: 5,                             //p2p下载的超时时间
    reportInterval: 60,                         //统计信息上报的时间间隔

    transitionEnabled: true,                    //是否允许节点自动跃迁
    transitionCheckInterval: 20,                //跃迁检查时间间隔
    transitionTTL: 2,                           //跃迁的最大跳数
    transitionWaitTime: 5,                      //跃迁等待Grant响应的时间
    defaultUploadBW: 1024*1024*4/8,             //总上行带宽默认4Mbps
    maxTransitionTries: 3,                      //最大跃迁次数（跃迁失败也算一次）
};

export {defaultP2PConfig}
