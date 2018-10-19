## CDNBye Documentation

CDNBye implements [WebRTC](https://en.wikipedia.org/wiki/WebRTC) datachannel to scale live/vod video streaming by peer-to-peer network using bittorrent-like protocol.

To use CDNBye hlsjs-p2p-engine, WebRTC support is required (Chrome, Firefox, Opera, Safari).

#### Example
```javascript
<script src="https://cdn.jsdelivr.net/npm/cdnbye@latest"></script>
<video id="video" controls></video>
<script>
    if(Hls.isSupported()) {
        var video = document.getElementById('video');
        var hls = new Hls({
            p2pConfig: {
                logLevel: false,
            }
        });
        hls.loadSource('https://video-dev.github.io/streams/x36xhzz/url_2/193039199_mp4_h264_aac_ld_7.m3u8');
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED,function(event, data) {
            video.play();
        });
        hls.p2pEngine.on('stats', function (stats) {
            console.log(`totalP2PDownloaded ${stats.totalP2PDownloaded}KB`);
        });
    }
</script>
```

## Use Hls.js wrapped with P2PEngine

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

### `var engine = hls.p2pEngine;`
Get the `P2PEngine` instance from `Hls` instance.

If `opts` is specified, then the default options (shown below) will be overridden.

| Field | Type | Default | Description |
| :-: | :-: | :-: | :-: |
| `logLevel` | string or boolean | 'none' | Print log level(debug, info, warn, error, none，false=none, true=debug).
| `announce` | string | 'https://api.cdnbye.com/v1' | The address of tracker server.
| `wsSignalerAddr` | string | 'wss://signal.cdnbye.com/wss' | The address of signal server.
| `wsMaxRetries` | number | 3 | The maximum number of reconnection attempts that will be made by websocket before giving up.
| `wsReconnectInterval` | number | 5 | The number of seconds to delay before attempting to reconnect by websocket.
| `loadTimeout` | number | 3 | Timeout to download a segment from a peer, if exceeded the segment is dropped.
| `maxBufferSize` | Object | {"pc": 1024 * 1024 * 100, "mobile": 1024 * 1024 * 50} | The max size of binary data that can be stored in the cache, property of mobile is not working for now.
| `p2pEnabled` | boolean | true | Enable or disable p2p engine.
| `channelId` | function | - | Pass a function to generate channel Id.(See advanced usage)
| `segmentId` | function | - | Pass a function to generate segment Id.(See advanced usage)
| `packetSize` | number | 64 * 1024 | The maximum package size sent by datachannel, 64KB should work with most of recent browsers. Set it to 16KB for older browsers support.
| `webRTCConfig` | Object | {} | A [Configuration dictionary](https://github.com/feross/simple-peer) providing options to configure WebRTC connections.
| `channelAlias` | string | '' | Alias for channel, which is used in CDNBye OMS. 

## P2PEngine API

### `var engine = new P2PEngine(hlsjs, p2pConfig);`
Create a new `P2PEngine` instance. Or you can get `P2PEngine` instance from hlsjs:
```javascript
var hls = new Hls();
var engine = hls.p2pEngine;
```

### `engine.version`
Get the version of `P2PEngine`.

### `engine.isSupported()`
Returns true if WebRTC data channel is supported by the browser.

### `engine.enableP2P()`
Resume P2P if it has been stopped.

### `engine.disableP2P()`
Disable P2P to stop p2p and free used resources.

### `engine.destroy()`
Stop p2p and free used resources, it will be called automatically before hls.js is destroyed.  

## P2PEngine Events

### `engine.on('peerId', function (peerId) {})`
Emitted when the peer Id of this client is obtained from server.

### `engine.on('peers', function (peers) {})`
Emitted when successfully connected with new peer.

### `engine.on('stats', function (stats) {})`
Emitted when data is downloaded/uploaded.</br>
stats.totalHTTPDownloaded: total data downloaded by HTTP(KB).</br>
stats.totalP2PDownloaded: total data downloaded by P2P(KB).</br>
stats.totalP2PUploaded: total data uploaded by P2P(KB).

## Advanced Usage
### Dynamic m3u8 path issue
Some m3u8 urls play the same live/vod but have different paths on them. For example, 
example.com/clientId1/file.m3u8 and example.com/clientId2/file.m3u8. In this case, you can format a common channelId for them.
```javascript
p2pConfig: {
    channelId: function (m3u8Url) {
        const formatedUrl = format(m3u8Url);   // format a channelId by removing the different part
        return formatedUrl;
    }
}
```

### Dynamic ts path issue
Like dynamic m3u8 path issue, you should format a common segmentId for the same ts file.
```javascript
p2pConfig: {
    segmentId: function (level, sn, tsUrl) {
        const formatedUrl = format(tsUrl);  // format a segmentId by removing the different part
        return formatedUrl;
    }
}
```

### Config STUN Servers
```javascript
p2pConfig: {
    webRTCConfig: { 
        config: {         // custom webrtc configuration (used by RTCPeerConnection constructor)
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }, 
                { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }
            ] 
        }
    }
}
```


