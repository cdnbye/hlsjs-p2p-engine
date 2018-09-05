## 使用文档
CDNBye通过WebRTC datachannel技术和BT算法，在观看同一视频/直播的用户之间构建P2P网络，在节省带宽成本的同时，提升用户的播放体验。

采用本插件的前提是浏览器支持WebRTC (Chrome, Firefox, Opera, Safari)。

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
当前插件的版本号

### `Hls.WEBRTC_SUPPORT` (static method)
判断当前浏览器是否支持WebRTC

```javascript
if (Hls.WEBRTC_SUPPORT) {
  // WebRTC is supported
} else {
  // Use a fallback
}
```

### `var hls = new Hls({p2pConfig: [opts]});`  
创建一个新的`Hls`实例。

如果指定了`opts`，那么对应的默认值将会被覆盖。

| 字段 | 类型 | 默认值 | 描述 |
| :-: | :-: | :-: | :-: |
| `logLevel` | string or boolean | 'none' | log的等级，分为debug、info、warn、error、none，设为true等于debug，设为false等于none。
| `announce` | string | 'https://api.cdnbye.com/v1' | tracker服务器地址。
| `wsSignalerAddr` | string | 'wss://signal.cdnbye.com/wss' | 信令服务器地址。
| `wsMaxRetries` | number | 3 |websocket连接重试次数。
| `wsReconnectInterval` | number | 5 | websocket重连时间间隔。
| `loadTimeout` | number | 3 | p2p下载的超时时间。
| `maxBufSize` | number | 1024 * 1024 * 50 | p2p缓存的最大数据量。
| `p2pEnabled` | boolean | true | 是否开启P2P。
| `tsStrictMatched` | boolean | false | p2p传输的ts是否要严格匹配（去掉查询参数）。
| `tag` | string | [hlsjs version] | 用户自定义标签，可用于在后台查看参数调整效果。
| `channelId` | function | - | 标识channel的字段，同一个channel的用户可以共享数据。
| `packetSize` | number | 64 * 1024 | 每次通过datachannel发送的包的大小，64KB适用于较新版本的浏览器，如果要兼容低版本浏览器可以设置成16KB。
| `webRTCConfig` | Object | {} | 用于配置stun和datachannel的[字典](https://github.com/feross/simple-peer)。

## P2PEngine事件

### `hls.engine.on('peerId', function (peerId) {})`
当从服务端获取到peerId时回调该事件。

### `hls.engine.on('peers', function (peers) {})`
当与新的节点成功建立p2p连接时回调该事件。

### `hls.engine.on('stats', function ({totalHTTPDownloaded, totalP2PDownloaded, totalP2PUploaded}) {})`
该回调函数可以获取p2p信息，包括：
totalHTTPDownloaded: 从HTTP(CDN)下载的数据量（单位KB）
totalP2PDownloaded: 从P2P下载的数据量（单位KB）
totalP2PUploaded: P2P上传的数据量（单位KB）

## P2PEngine运行时API

### `hls.engine.enableP2P()`
在p2p暂停或未启动情况下启动p2p。

### `hls.engine.disableP2P()` 
停止p2p并释放内存。

### `hls.engine.destroy()`
停止p2p、销毁engine并释放内存。



