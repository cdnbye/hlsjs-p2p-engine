
import { config as btConfig } from './bittorrent';

//时间单位统一为秒
let defaultP2PConfig = {
    wsSignalerAddr: 'wss://signal.cdnbye.com/wss',          // 信令服务器地址
    wsMaxRetries: 3,                            // websocket连接重试次数
    wsReconnectInterval: 5,                     // websocket重连时间间隔

    p2pEnabled: true,                           // 是否开启P2P，默认true

    dcRequestTimeout: 4,                        // datachannel接收二进制数据的超时时间(废弃)
    dcUploadTimeout: 4,                         // datachannel上传二进制数据的超时时间
    dcPings: 5,                                 // datachannel发送ping数据包的数量
    dcTolerance: 5,                             // 请求超时或错误多少次淘汰该peer

    packetSize: 64*1024,                        // 每次通过datachannel发送的包的大小(如果要兼容旧浏览器可以设为16*1024)
    maxBufferSize: {                            // p2p缓存的最大数据量（分为PC和移动端）
        pc: 1024*1024*100,                      // PC端缓存大小
        mobile: 1024*1024*50,                   // 移动端缓存大小(暂未实现)
    },
    loadTimeout: 3.5,                             // p2p下载的超时时间(废弃)
    loadTimeoutRate: 0.7,                        // p2p下载的超时时间比率，乘以ts的duration得出超时时间

    logLevel: 'none',                            // log的level，分为debug、info、warn、error、none，设为true等于debug，设为false等于none，默认none

    tag: '',                                     // 用户自定义标签，默认为hlsjs版本号

    channelId: null,                             // 标识channel的字段，默认是'[path]-[protocol version]'
    channelAlias: '',                            // 频道别名，用于在后台OMS识别该频道
    segmentId: null,                             // 标识ts文件的字段，默认是'[level]-[sn]'

    webRTCConfig: {},                            // 传入channelConfig用于createDataChannel，config用于RTCPeerConnection

    p2pBlackList: ['aac', 'mp3'],                // 不参与P2P的文件类型，防止报错

    agent: '',                                   // 代理商标识，申请代理商请联系：service@cdnbye.com

    ...btConfig
};

export default defaultP2PConfig;
