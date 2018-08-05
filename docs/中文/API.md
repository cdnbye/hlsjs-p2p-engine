## 使用文档

CDNBye implements [WebRTC](https://en.wikipedia.org/wiki/WebRTC) datachannel to scale live/vod video streaming by peer-to-peer network using bittorrent-like protocol.

To use CDNBye hlsjs-p2p-engine, WebRTC support is required (Chrome, Firefox, Opera, Safari).

#### 安装
```bash
npm install cdnbye --save
```

#### 快速开始
```javascript
  var Hls = require('cdnbye');
  var video = document.getElementById('video');
  if(Hls.isSupported()) {
    var hls = new Hls();
    hls.loadSource('https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8');
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED,function() {
      video.play();
    });
  }
```

## 在Hls.js增加的新API

### `Hls.engineVersion` (static method)
Show the current version of CDNBye plugin.

### `Hls.WEBRTC_SUPPORT` (static method)
Is WebRTC natively supported in the environment?
```javascript
if (Hls.WEBRTC_SUPPORT) {
  // WebRTC is supported
} else {
  // Use a fallback
}
```

### `var hls = new Hls([opts]);`
Create a new `Hls` instance.

If `opts` is specified, then the default options (shown below) will be overridden.

```javascript
{
    // hlsjsConfig options provided by hls.js
    p2pConfig: {
        logLevel: string or boolean         // log的level，分为debug、info、warn、error、none，设为true等于debug，设为false等于none，默认none
        announce: string                    // tracker服务器地址
        wsSignalerAddr: string              // 信令服务器地址 (default=wss://signal.cdnbye.com/wss)
        wsMaxRetries: number                // websocket连接重试次数 (default=3)
        wsReconnectInterval: number         // websocket重连时间间隔 (default=5)
        loadTimeout: number                 // p2p下载的超时时间 (default=3)
        maxBufSize: number                  // p2p缓存的最大数据量 (default=1024*1024*50)
        p2pEnabled: boolean                 // 是否开启P2P (default=true)
        tsStrictMatched: boolean            // p2p传输的ts是否要严格匹配（去掉查询参数） (default=false)
        tag: string                         // 用户自定义标签，可用于在后台查看参数调整效果 (default=[hlsjs version])
        // advanced options
        channelId: function                 // 标识channel的字段 (default: see utils/toolFuns)
        dcRequestTimeout: number            // datachannel接收二进制数据的超时时间 (default=3)
        dcUploadTimeout: number             // datachannel上传二进制数据的超时时间 (default=3)
        packetSize: number                  // 每次通过datachannel发送的包的大小(default=64*1024)
        enableLogUpload: boolean            // 上传log到服务器 (default=false)
        logUploadAddr: string               // log上传地址 (default=wss://api.cdnbye.com/trace)
        logUploadLevel: string              // log上传level，分为debug、info、warn、error、none (default=warn)                          
    }
}
```

## P2PEngine事件

### `hls.engine.on('peerId', function (peerId) {})`
Emitted when the peer Id of this client is obtained from server.

### `hls.engine.on('peers', function (peers) {})`
Emitted when successfully connected with new peer.

### `hls.engine.on('stats', function ({totalHTTPDownloaded, totalP2PDownloaded, totalP2PUploaded}) {})`
Emitted when data is downloaded/uploaded.
totalHTTPDownloaded: total data downloaded by HTTP(KB).
totalP2PDownloaded: total data downloaded by P2P(KB).
totalP2PUploaded: total data uploaded by P2P(KB).

## P2PEngine运行时API

### `hls.engine.enableP2P()`
Resume P2P if it has been stopped.

### `hls.engine.disableP2P()` （暂未实现）
Disable P2P if it is not stopped.





