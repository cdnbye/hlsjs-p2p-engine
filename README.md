**English | [简体中文](Readme_zh.md)**

<h1 align="center"><a href="" target="_blank" rel="noopener noreferrer"><img width="250" src="https://cdnbye.oss-cn-beijing.aliyuncs.com/pic/cdnbye.png" alt="cdnbye logo"></a></h1>
<h4 align="center">Boost Your Stream using WebRTC.</h4>
<p align="center">
  <a href="https://www.npmjs.com/package/cdnbye"><img src="https://img.shields.io/npm/v/cdnbye.svg?style=flat" alt="npm"></a>
  <a href="https://www.jsdelivr.com/package/npm/cdnbye"><img src="https://data.jsdelivr.com/v1/package/npm/cdnbye/badge" alt="jsdelivr"></a>
  <a href="https://github.com/cdnbye/hlsjs-p2p-engine/tree/master/dist"><img src="https://badge-size.herokuapp.com/cdnbye/hlsjs-p2p-engine/master/dist/hlsjs-p2p-engine.min.js?compression=gzip&style=flat-square" alt="size"></a>
</p>

CDNBye hlsjs-p2p-engine implements [WebRTC](https://en.wikipedia.org/wiki/WebRTC) datachannel to scale live/vod video streaming by peer-to-peer network using bittorrent-like protocol. The forming peer network can be layed over other CDNs or on top of the origin server. Powered by [hls.js](https://github.com/video-dev/hls.js), it can play HLS on any platform with many popular HTML5 players such as video.js, JWPlayer and Flowplayer.

## Features
- WebRTC data channels for lightweight peer-to-peer communication with no plugins
- Support live and VOD streams over HLS protocol(m3u8)
- Support encrypted HLS stream
- Very easy to integrate with an existing hls.js project
- Seamlessly fallback to normal server usage if a browser doesn't support WebRTC
- Highly configurable for users
- Support most popular HTML5 players such as video.js、Clappr、Flowplayer
- Efficient scheduling policies to enhance the performance of P2P streaming
- Use IP database to group up peers by ISP and regions
- API frozen, new releases will not break your code

## Playground
[Click me!](https://demo.cdnbye.com/)

## Getting Started
#### Quick Start Demo
Put the [quick-start.html](demo/quick-start.html) in your web page, run it. Wait for a few seconds，then open the same page from another browser. Now you have a direct P2P connection between two browsers without plugin!
The first web peer will serve as a seed, if no one else in the same channel.
#### Integrate to Your Hls.js Project
Simply replace the hls.js script tag like:
 ```html
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
```
with 
 ```html
<script src="https://cdn.jsdelivr.net/npm/cdnbye@latest"></script>
```
That's it!
#### Integrate to HTML5 Players
See [demos](https://github.com/cdnbye/hlsjs-p2p-engine#player-integration).

## Browser Support
WebRTC has already been incorporated into the HTML5 standard and it is broadly deployed in modern browsers. The compatibility of CDNBye depends on the browser support of WebRTC and Hls.js. Please note that iOS Safari "Mobile" does not support the MediaSource API.

 Compatibility|Chrome | Firefox | macOS Safari| Android Wechat/QQ | Opera | Edge | IE | iOS Safari | 
:-: | :-: | :-: | :-: | :-: | :-: | :-:| :-:| :-:
WebRTC Datachannel | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ❌ | ✔ |
Hls.js | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ❌ |
CDNBye | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ❌ | ❌ |

## Include
Include the pre-built script of latest version bundled with hls.js(recommended): 
```javascript
<script src="https://cdn.jsdelivr.net/npm/cdnbye@latest"></script>
```
Or include the latest version without hls.js:
```javascript
<script src="https://cdn.jsdelivr.net/npm/cdnbye@latest/dist/hlsjs-p2p-engine.min.js"></script>
```

## Usage
See [Usage](https://p2p.cdnbye.com/en/views/web/usage.html)

## Player Integration
Support almost all web players, click [here](https://p2p.cdnbye.com/en/views/web/players.html) for more information.
- `Add your customized player here`
    - CDNBye can be integrated into any HTML5 video player that with hls.js built in.


## API and Configuration
See [API.md](https://p2p.cdnbye.com/en/views/web/API.html)

## Console
Bind your domain in `https://oms.cdnbye.com`, where you can view p2p-related information.

## Related Projects
- [android-p2p-engine](https://github.com/cdnbye/android-p2p-engine) - Live/VOD P2P Engine for Android and Android TV.
- [ios-p2p-engine](https://github.com/cdnbye/ios-p2p-engine) - iOS Video P2P Engine for Any Player.
- [flutter-p2p-engine](https://github.com/cdnbye/flutter-p2p-engine) - Live/VOD P2P Engine for Flutter, contributed by [mjl0602](https://github.com/mjl0602).
- [dashjs-p2p-engine](https://github.com/cdnbye/dashjs-p2p-engine) - Web Video Delivery Technology with No Plugins for MPEG-dash.
- [mp4-p2p-engine](https://github.com/cdnbye/mp4-p2p-engine) - Web Video Delivery Technology with No Plugins for MP4.

## They are using CDNBye
<table>
    <tr>
        <td ><center> <a target="_blank" href="https://wstream.video/"><img src="https://cdnbye.oss-cn-beijing.aliyuncs.com/pic/wstream.png" width="120"></a></center></td>
        <td ><center> <a target="_blank" href="https://cyclingentertainment.stream/"><img src="https://cdnbye.oss-cn-beijing.aliyuncs.com/pic/%20cyclingentertainment.png" width="120"></a></center></td>
    </tr>
</table>

## FAQ
We have collected some [frequently asked questions](https://p2p.cdnbye.com/en/views/FAQ.html). Before reporting an issue, please search if the FAQ has the answer to your problem.

## Contact Us
Email: service@cdnbye.com
<br>
Skype: live:86755838
<br>
Telegram: @cdnbye


### Join the Discussion
[Telegram Group](https://t.me/cdnbye_group)







