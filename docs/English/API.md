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
        logLevel: string or boolean         // Print log level(debug, info, warn, error, none，false=none, true=debug) (default='none')
        announce: string                    // The address of tracker server (default=https://tracker.cdnbye.com)
        wsSignalerAddr: string              // The address of signal server (default=wss://signal.cdnbye.com/wss)
        wsMaxRetries: number                // The maximum number of reconnection attempts that will be made by websocket before giving up (default=3)
        wsReconnectInterval: number         // The number of seconds to delay before attempting to reconnect by websocket (default=5)
        loadTimeout: number                 // Timeout of downloading by p2p (default=3)
        maxBufSize: number                  // The cache size of binary data (default=1024*1024*50)
        p2pEnabled: boolean                 // Enable P2P (default=true)
        tsStrictMatched: boolean            // Drop the query string of ts url while sharing segment to peers (default=false)
        key: string                         // API key to connected with tracker server (default=free)
        tag: string                         // User defined tag which is useful for observing the effect of parameters turning (default=[hlsjs version])
        // advanced options
        channelId: function                 // Pass a function to generate channel Id (default: see utils/toolFuns)
        dcRequestTimeout: number            // The request timeout of datachannel (default=3)
        dcUploadTimeout: number             // The upload timeout of datachannel (default=3)
        packetSize: number                  // The maximum package size sent by datachannel per time (default=64*1024)
        enableLogUpload: boolean            // Enable upload logs to server (default=false)
        logUploadAddr: string               // Log upload address (default=wss://api.cdnbye.com/trace)
        logUploadLevel: string              // Log upload level(debug, info, warn, error, none) (default=warn)
        neighbours: number                  // The maximum number of peers allowed to connect (default=12)                             
    }
}
```

## P2PEngine Events

### `hls.engine.on('peerId', function (peerId) {})`
Emitted when the peer Id of this client is obtained from server.

### `hls.engine.on('peers', function (peers) {})`
Emitted when successfully connected with new peer.

### `hls.engine.on('stats', function ({totalHTTPDownloaded, totalP2PDownloaded, totalP2PUploaded}) {})`
Emitted when data is downloaded/uploaded.
totalHTTPDownloaded: total data downloaded by HTTP(KB).
totalP2PDownloaded: total data downloaded by P2P(KB).
totalP2PUploaded: total data uploaded by P2P(KB).

## P2PEngine Runtime API

### `hls.engine.enableP2P()`
Resume P2P if it has been stopped.

### `hls.engine.disableP2P()`
Disable P2P if it is not stopped.

