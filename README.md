**English | [简体中文](Readme_zh.md)**

<h1 align="center"><a href="" target="_blank" rel="noopener noreferrer"><img width="250" src="https://www.swarmcloud.net/img/logo.png" alt="cdnbye logo"></a></h1>
<h4 align="center">Let your viewers become your unlimitedly scalable CDN.</h4>
<p align="center">
  <a href="https://www.npmjs.com/package/cdnbye"><img src="https://img.shields.io/npm/v/cdnbye.svg?style=flat" alt="npm"></a>
  <a href="https://www.jsdelivr.com/package/npm/cdnbye"><img src="https://data.jsdelivr.com/v1/package/npm/cdnbye/badge" alt="jsdelivr"></a>
</p>

CDNBye hlsjs-p2p-engine implements [WebRTC](https://en.wikipedia.org/wiki/WebRTC) datachannel to scale live/vod video streaming by peer-to-peer network using bittorrent-like protocol. The forming peer network can be layed over other CDNs or on top of the origin server. Powered by [hls.js](https://github.com/video-dev/hls.js), it can play HLS on any platform with many popular HTML5 players such as video.js, JWPlayer and Flowplayer.

## Features
- WebRTC data channels for lightweight peer-to-peer communication with no plugins
- Support live and VOD streams over HLS protocol(m3u8)
- Support encrypted HLS stream
- Very easy to integrate with an existing hls.js project
- Seamlessly fallback to normal server usage if a browser doesn't support WebRTC
- Compatible with all CDNs, agnostic to DRM and video codecs. No service side changes required.
- Support most popular HTML5 players such as video.js、Clappr、Flowplayer
- Efficient scheduling policies to enhance the performance of P2P streaming
- Use IP database to group up peers by ISP and regions

## Playground
[Click me!](https://demo.cdnbye.com/)

## Browser Support
WebRTC has already been incorporated into the HTML5 standard and it is broadly deployed in modern browsers. The compatibility of CDNBye depends on the browser support of WebRTC and Hls.js. Please note that iOS Safari "Mobile" does not support the MediaSource API.

 Compatibility|Chrome | Firefox | macOS Safari| Android Wechat/QQ | Opera | Edge | IE | iOS Safari | 
:-: | :-: | :-: | :-: | :-: | :-: | :-:| :-:| :-:
WebRTC Datachannel | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ❌ | ✔ |
Hls.js | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ❌ |
CDNBye | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ❌ | ❌ |

## Usage
See [documentation](https://docs.swarmcloud.net/web-hls)

## Player Integration
Support almost all web players, click [here](https://docs.swarmcloud.net/web-hls/players) for more information.

## API and Configuration
See [API.md](https://docs.swarmcloud.net/web-hls/API)

## Console
Register your domain in [dashboard](https://dash.swarmcloud.net), where you can view p2p-related information.

## Related Projects
- [hls-sw-p2p-engine](https://github.com/swarm-cloud/hls-sw-p2p-engine) - Live/VOD P2P Engine for all browsers including iOS Safari, with the help of ServiceWorker.
- [android-p2p-engine](https://github.com/cdnbye/android-p2p-engine) - Live/VOD P2P Engine for Android and Android TV.
- [ios-p2p-engine](https://github.com/cdnbye/ios-p2p-engine) - iOS Video P2P Engine for Any Player.
- [flutter-p2p-engine](https://github.com/cdnbye/flutter-p2p-engine) - Live/VOD P2P Engine for Flutter, contributed by [mjl0602](https://github.com/mjl0602).
- [shaka-p2p-engine](https://github.com/cdnbye/shaka-p2p-engine) - P2P engine for Shaka Player.
- [dashjs-p2p-engine](https://github.com/cdnbye/dashjs-p2p-engine) - Web Video Delivery Technology with No Plugins for MPEG-dash.
- [mp4-sw-p2p-engine](https://github.com/swarm-cloud/mp4-sw-p2p-engine) - Web Video Delivery Technology for MP4.

<!--
## They are using CDNBye
<table>
    <tr>
        <td ><center> <a target="_blank" href="https://wstream.video/"><img src="https://cdnbye.oss-cn-beijing.aliyuncs.com/pic/wstream.png" width="120"></a></center></td>
        <td ><center> <a target="_blank" href="https://cyclingentertainment.stream/"><img src="https://cdnbye.oss-cn-beijing.aliyuncs.com/pic/%20cyclingentertainment.png" width="120"></a></center></td>
    </tr>
</table>
-->

## FAQ
We have collected some [frequently asked questions](https://docs.swarmcloud.net/faq). Before reporting an issue, please search if the FAQ has the answer to your problem.

## Contact Us
Email: service@cdnbye.com
<br>
Skype: live:86755838
<br>
Telegram: @cdnbye










