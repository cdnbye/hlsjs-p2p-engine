## CDNBye Documentation

CDNBye implements [WebRTC](https://en.wikipedia.org/wiki/WebRTC) datachannel to scale live/vod video streaming by peer-to-peer network using bittorrent-like protocol.

To use CDNBye hlsjs-p2p-engine, WebRTC support is required (Chrome, Firefox, Opera, Safari).

#### Install
```bash
npm install cdnbye --save
```

#### Quick Example
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

## New API to Hls.js

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
        key: 'free',                                      // API key to connected with tracker server (default=free)
        wsSignalerAddr: 'wss://signal.cdnbye.com/wss',    // The address of signal server
        wsMaxRetries: 3,                                  // The maximum number of reconnection attempts that will be made by websocket before giving up (default=3)
        wsReconnectInterval: 5,                           // The number of seconds to delay before attempting to reconnect by websocket (default=5)
        p2pEnabled: true,                                 // Enable P2P (default=true)
        dcRequestTimeout: 3,                              // The request timeout of datachannel (default=3)
        dcUploadTimeout: 3,                               // The upload timeout of datachannel (default=3)
        dcPings: 5,                                       // The ping times of datachannel (default=5)
        dcTolerance: 4,                                   // The maximum times of request timeout or errors allowed to make by peer before eliminating (default=4)
        packetSize: 16*1024,                              // The maximum package size sent by datachannel per time (default=16KB)
        maxBufSize: 1024*1024*50,                         // The cache size of binary data (default=50MB)
        loadTimeout: 5,                                   // Timeout of downloading by p2p (default=5)
        enableLogUpload: false,                           // Enable upload logs to server (default=false)
        logUploadAddr: "wss://api.cdnbye.com/trace",      // Log upload address
        logUploadLevel: 'warn',                           // Log upload level(debug, info, warn, error, none) (default=warn)
        logLevel: 'none',                                 // Print log level(debug, info, warn, error, none) (default=none)
        announce: "https://tracker.cdnbye.com",           // The address of tracker server
        neighbours: 12,                                   // The maximum number of peers allowed to connect (default=12)                             
    }
}
```
