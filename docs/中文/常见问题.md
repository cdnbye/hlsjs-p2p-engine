<h3>1. CDNBye的原理是什么？</h3>
CDNBye采用WebRTC data channel技术和BT算法来实现直播和点播的P2P加速。通过内置的调度算法，
在P2P和CDN之间进行无缝切换，从而在不影响用户播放体验的前提下最大化P2P率。hlsjs-p2p-engine
是CDNBye为播放HLS流而开发的hls.js插件。目前，CDNBye已经支持大部分的HTML5播放器，包括
Hls.js, JWPlayer, Video.js, Clappr, Flowplayer和TCPlayer等。

<h3>2. CDNBye的P2P服务安全吗？</h3>
CDNBye采用的WebRTC data channel技术，是基于SCTP协议和TLS加密的，无需担心数据传输的
安全问题。另外，与后台服务器的通信（包括tracker和信令服务器）是基于安全的HTTPS和WSS。
 
<h3>3. CDNBye的P2P技术会影响DRM(数字版权管理)吗?</h3>
不会。只有在用户获得发布者的服务器授权后才会激活P2P传输。而且，流秘钥是不会在P2P网络中
传输的。P2P网络中传输的ts文件和用户从CDN下载的完全一样。另外，播放的内容不会上传或者缓存在我们的服务器中。

<h3>4. CDNBye会不会造成用户视频播放延迟？</h3>
不会。首先，视频的首片数据总是从CDN下载的，因而不会造成首屏延迟。其次，如果在超时时间内无法从其他节点获取数据，那么内置的调度算法会及时切到CDN下载，因此本P2P技术不会带来任何额外的延迟。

<h3>5. 如果用户的浏览器不支持WebRTC，会如何处理？</h3>
在这种情况下，插件不起任何作用，用户和往常一样采用HTTP方式下载。



