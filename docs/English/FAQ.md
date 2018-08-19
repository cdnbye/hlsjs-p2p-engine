<h3>1. How does CDNBye work?</h3>
A: CDNBye implements WebRTC datachannel to scale live/vod video streaming 
by p2p network using bittorrent-like protocol. The built-in 
scheduling algorithm determines whether a peer should load the next 
segment from p2p network or the publisher’s alternative delivery system.
hlsjs-p2p-engine is a hls.js wrapper provided by CDNBye for streaming HLS. 
Today CDNBye supports the vast majority of HTML5 players including Hls.js, 
JWPlayer, Video.js, Clappr, Flowplayer and TCPlayer.

<h3>2. How secure is the CDNBye service?</h3>
A: CDNBye transfers data between peers using WebRTC data channel, 
which is secured by SCTP protocols and TLS encryption. Communication 
with the backend(tracker and signaling server) is done via HTTPS and 
secured WebSocket.

<h3>3. Does CDNBye interfere with DRM(Digital Right Management)?</h3>
A: No. P2P transmission is activated only after the user is authorized 
by the publisher’s server. Importantly, decryption key isn't transferred 
through the P2P network. The segments shared between peers are the same as 
that peers receive from the CDN. Also, content is never uploaded or stored 
 in our server.
 
<h3>4. Will CDNBye bring a delay to a user's stream?</h3>
A: No. The first Segment is always downloaded from CDN. Additionally, 
if a video segment cannot be loaded from peers within the timeout period, 
our scheduling algorithm will switch to CDN mode in time. That means CDNBye
will never bring a delay to a video stream.

<h3>5. What happens if a user‘s browser doesn't support WebRTC?</h3>
A: If that happened, the user will seamlessly fallback to normal HTTP request 
without any side effect.

