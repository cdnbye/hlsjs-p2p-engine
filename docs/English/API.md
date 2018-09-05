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

### `var hls = new Hls({p2pConfig: [opts]});` 
Create a new `Hls` instance.

If `opts` is specified, then the default options (shown below) will be overridden.

| Field | Type | Default | Description |
| :-: | :-: | :-: | :-: |
| `logLevel` | string or boolean | 'none' | Print log level(debug, info, warn, error, none，false=none, true=debug).
| `announce` | string | 'https://api.cdnbye.com/v1' | The address of tracker server.
| `wsSignalerAddr` | string | 'wss://signal.cdnbye.com/wss' | The address of signal server.
| `wsMaxRetries` | number | 3 | The maximum number of reconnection attempts that will be made by websocket before giving up.
| `wsReconnectInterval` | number | 5 | The number of seconds to delay before attempting to reconnect by websocket.
| `loadTimeout` | number | 3 | Timeout to download a segment from a peer, if exceeded the segment is dropped.
| `maxBufSize` | number | 1024 * 1024 * 50 | The max size of binary data that can be stored in the cache.
| `p2pEnabled` | boolean | true | Enable or disable p2p engine.
| `tsStrictMatched` | boolean | false | Drop the query string of ts url while sharing segment to peers.
| `tag` | string | [hlsjs version] | User defined tag which is useful for observing the effect of parameters turning.
| `channelId` | function | - | Pass a function to generate channel Id.
| `packetSize` | number | 64 * 1024 | The maximum package size sent by datachannel, 64KB should work with most of recent browsers. Set it to 16KB for older browsers support.

| Name | Type | Default Value | Description |

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
Disable P2P to stop p2p and free used resources.

### `hls.engine.destroy()`
Stop p2p and free used resources, it will be called automatically before hls.js is destroyed.  

