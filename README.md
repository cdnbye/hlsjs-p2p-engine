**English | [简体中文](Readme_zh.md)**

<h1 align="center"><a href="" target="_blank" rel="noopener noreferrer"><img width="250" src="figs/cdnbye.png" alt="cdnbye logo"></a></h1>
<h4 align="center">Save Your Bandwidth using WebRTC.</h4>
<p align="center">
  <a href="https://www.npmjs.com/package/cdnbye"><img src="https://img.shields.io/npm/v/cdnbye.svg?style=flat" alt="npm"></a>
  <a href="https://www.jsdelivr.com/package/npm/cdnbye"><img src="https://data.jsdelivr.com/v1/package/npm/cdnbye/badge" alt="jsdelivr"></a>
  <a href="https://github.com/cdnbye/hlsjs-p2p-engine/tree/master/dist"><img src="https://badge-size.herokuapp.com/cdnbye/hlsjs-p2p-engine/master/dist/hlsjs-p2p-engine.min.js?compression=gzip&style=flat-square" alt="size"></a>
  <a href="https://www.jsdelivr.com/package/npm/cdnbye"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
</p>


CDNBye hlsjs-p2p-engine implements [WebRTC](https://en.wikipedia.org/wiki/WebRTC) datachannel to scale live/vod video streaming by peer-to-peer network using bittorrent-like protocol. The forming peer network can be layed over other CDNs or on top of the origin server. Powered by [hls.js](https://github.com/video-dev/hls.js), it can play HLS on any platform with many popular HTML5 players such as video.js, JWPlayer and Flowplayer. BTW, you can view how much traffic has been saved [here](https://oms.cdnbye.com)!
## Features
- WebRTC data channels for lightweight peer-to-peer communication with no plugins
- Support live and VOD streams over HLS protocol(m3u8)
- Very easy to  integrate with an existing hls.js project
- Seamlessly fallback to normal server usage if a browser doesn't support WebRTC
- Highly configurable for users
- Support most popular HTML5 players such as video.js、Clappr、Flowplayer
- Efficient scheduling policies to enhance the performance of P2P streaming
- Use IP database to group up peers by ISP and regions
- API frozen, new releases will not break your code

## Notice
All domain names that are not bound in the management system (https://oms.cdnbye.com) will stop providing P2P services. Please bind your domain names in time to avoid being affected.

## Playground
[Click me!](https://demo.cdnbye.com/)

## Getting Started
#### Quick Start Demo
Put the [quick-start.html](demo/quick-start.html) in your web page, run it. Wait for a few seconds，then open the same page from another browser. Now you have a direct P2P connection between two browsers without plugin!
The first web peer will serve as a seed, if no one else in the same channel.
#### Integrate to Your Hls.js Project
Simply replace the hls.js script tag like:
 ```javascript
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
```
with 
 ```javascript
<script src="https://cdn.jsdelivr.net/npm/cdnbye@latest"></script>
```
That's it!
#### Integrate to HTML5 Players
See [demos](https://github.com/cdnbye/hlsjs-p2p-engine#player-integration).

## Browser Support
WebRTC has already been incorporated into the HTML5 standard and it is broadly deployed in modern browsers. The compatibility of CDNBye depends on the browser support of WebRTC and Hls.js. Please note that iOS Safari "Mobile" does not support the MediaSource API.

 Compatibility|Chrome | Firefox | macOS Safari| Android Wechat/QQ | Opera | IE | Edge| iOS Safari | 
:-: | :-: | :-: | :-: | :-: | :-: | :-:| :-:| :-:
WebRTC Datachannel | ✔ | ✔ | ✔ | ✔ | ✔ | ❌ | ❌ | ✔ |
Hls.js | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ❌ |
CDNBye | ✔ | ✔ | ✔ | ✔ | ✔ | ❌ | ❌ | ❌ |

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
See [Usage](http://docs.cdnbye.com/#/en/web/usage?id=usage)

## Player Integration
- [videojs](http://videojs.com/)
    - See [videojs demo](https://docs.cdnbye.com/#/en/web/players?id=videojs)
- [flowplayer](https://flowplayer.com/)
    - See [flowplayer demo](https://docs.cdnbye.com/#/en/web/players?id=flowplayer)
- [jwplayer](https://www.jwplayer.com/)
    - See [jwplayer demo](https://docs.cdnbye.com/#/en/web/players?id=jwplayer)
- [DPlayer](https://github.com/MoePlayer/DPlayer)
    - See [dplayer demo](https://docs.cdnbye.com/#/en/web/players?id=dplayer)
- [CKPlayer](http://www.ckplayer.com/)
    - See [ckplayer demo](https://docs.cdnbye.com/#/en/web/players?id=ckplayer) based on [P2P-CKPlayer](https://github.com/cdnbye/P2P-CKPlayer)
- [clappr](https://github.com/clappr/clappr)
    - See [clappr demo](https://docs.cdnbye.com/#/en/web/players?id=clappr)
- [MediaElement.js](http://www.mediaelementjs.com/)
    - See [mediaelement demo](https://docs.cdnbye.com/#/en/web/players?id=mediaelementjs)
- [TCPlayer](https://cloud.tencent.com/document/product/267/7479)(Tencent Cloud Player)
    - See [tcplayer demo](https://docs.cdnbye.com/#/en/web/players?id=tcplayer)
- [Chimee](http://chimee.org/)
    - See [chimee demo](https://docs.cdnbye.com/#/en/web/players?id=chimee)
- [XGPlayer](http://h5player.bytedance.com/en/)
    - See [xgplayer demo](https://docs.cdnbye.com/#/en/web/players?id=xgplayer)
- [fluidplayer](https://www.fluidplayer.com/)
    - See [fluidplayer demo](https://docs.cdnbye.com/#/en/web/players?id=fluidplayer)
- [OpenPlayer](https://www.openplayerjs.com/)
    - See [OpenPlayer demo](https://docs.cdnbye.com/#/en/web/players?id=openplayer)
- [Plyr](https://plyr.io/)
    - See [Plyr demo](https://docs.cdnbye.com/#/en/web/players?id=plyr)
- `Add your customized player here`
    - CDNBye can be integrated into any HTML5 video player that with hls.js built in.


## API and Configuration
See [API.md](https://docs.cdnbye.com/#/en/web/API)

## Console
Bind your domain in `https://oms.cdnbye.com`, where you can view p2p-related information.

## Related Projects
- [ios-p2p-engine](https://github.com/cdnbye/ios-p2p-engine) - iOS Video P2P Engine for Any Player.

## They are using CDNBye
[<img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531253035445&di=7af6cc9ad4abe3d06ba376af22d85131&imgtype=0&src=http%3A%2F%2Fimg.kuai8.com%2Fattaches%2Fintro%2F1213%2F201612131436417407.png" width="120">](https://egame.qq.com/?hls=1&p2p=1&_debug=1)

## FAQ
We have collected some [frequently asked questions](https://docs.cdnbye.com/#/en/FAQ). Before reporting an issue, please search if the FAQ has the answer to your problem.

## Contact Us
Email: service@cdnbye.com







