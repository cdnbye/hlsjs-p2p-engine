/**
 * Created by xieting on 2018/1/3.
 */

let recommendedHlsjsConfig = {
    maxBufferSize: 0,
    maxBufferLength: 30,
    liveSyncDuration: 30,
};

let defaultP2PConfig = {
    websocketAddr: 'ws://localhost:12034',
    websocketRetryDelay: 5,
    maxCacheSize: 1024*1024*100                 //p2p缓存的最大数据量
};

export {recommendedHlsjsConfig, defaultP2PConfig}
