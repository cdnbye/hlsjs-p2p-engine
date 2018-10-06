<h1 align="center"><a href="" target="_blank" rel="noopener noreferrer"><img width="250" src="figs/cdnbye.png" alt="cdnbye logo"></a></h1>
<h4 align="center">Save Your Bandwidth using WebRTC.</h4>
<p align="center">
  <a href="https://www.npmjs.com/package/cdnbye"><img src="https://img.shields.io/npm/v/cdnbye.svg?style=flat" alt="npm"></a>
   <a href="https://www.jsdelivr.com/package/npm/cdnbye"><img src="https://data.jsdelivr.com/v1/package/npm/cdnbye/badge" alt="jsdelivr"></a>
  <a href="https://github.com/cdnbye/hlsjs-p2p-engine/tree/master/dist"><img src="https://badge-size.herokuapp.com/cdnbye/hlsjs-p2p-engine/master/dist/hlsjs-p2p-engine.min.js?compression=gzip&style=flat-square" alt="size"></a>
 <a href="https://www.jsdelivr.com/package/npm/cdnbye"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
</p>

**[中文](Readme_zh.md)**

This JS library implements [WebRTC](https://en.wikipedia.org/wiki/WebRTC) datachannel to scale live/vod video streaming by peer-to-peer network using bittorrent-like protocol. The forming peer network can be layed over other CDNs or on top of the origin server. Powered by [hls.js](https://github.com/video-dev/hls.js), it can play HLS on any platform with many popular HTML5 players such as video.js, JWPlayer and Flowplayer. 

This library is a part of CDNBye project which attempts to deliver high quality video streams, decreasing the number of requests to CDN servers, reducing the cost of transmission and enhancing system’s scalability. As the name suggests, CDNBye will help you offload bandwidth from expensive traditional CDNs，while also maximizing a user’s viewing experience.

## Notice
v0.2.x is deprecated, please update to the latest version.

## Playground
[Click me!](https://cdnbye.github.io/hlsjs-p2p-demo/)

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
See [demos](https://github.com/cdnbye/hlsjs-p2p-engine#player-integration), maybe you want to try [P2P-DPlayer](https://github.com/cdnbye/P2P-DPlayer) and [P2P-CKPlayer](https://github.com/cdnbye/P2P-CKPlayer).

## Browser Support
WebRTC has already been incorporated into the HTML5 standard and it is broadly deployed in modern browsers. The compatibility of CDNBye depends on the browser support of WebRTC and Hls.js. Please note that iOS Safari "Mobile" does not support the MediaSource API.

 Compatibility|Chrome | Firefox | Mac Safari| iOS Safari | Opera | IE | Edge|   
:-: | :-: | :-: | :-: | :-: | :-: | :-:| :-:
WebRTC | Yes | Yes | Yes | Yes | Yes | No | No
Hls.js | Yes | Yes | Yes | No | Yes | Yes | Yes
CDNBye | Yes | Yes | Yes | No | Yes | No | No 

## Installation

#### Pre-built Script
Include the latest version bundled with hls.js(recommended): 
```javascript
<script src="https://cdn.jsdelivr.net/npm/cdnbye@latest"></script>
```
Or include the latest version without hls.js:
```javascript
<script src="https://cdn.jsdelivr.net/npm/cdnbye@latest/dist/hlsjs-p2p-engine.min.js"></script>
```

#### Via NPM
```
cd yourProject && npm install cdnbye --save
```
In your application import/require the package you want to use as the following examples:
```javascript
import Hls from 'cdnbye';   // the package with hls.js
```
Or 
```javascript
import Hls from 'hls.js';     // please run "npm install --save hls.js" first
import P2PEngine from 'cdnbye/dist/hlsjs-p2p-engine';   // the package without hls.js
```

## Usage
#### Bundle
Add p2pConfig as a property of hlsjsConfig, then Create hls.js instance passing hlsjsConfig as constructor param.
```javascript
var hlsjsConfig = {
    debug: true,
    // Other hlsjsConfig options provided by hls.js
    p2pConfig: {
        logLevel: 'debug',
        // Other p2pConfig options if applicable
    }
};
// Hls constructor is overriden by included bundle
var hls = new Hls(hlsjsConfig);
// Use `hls` just like the usual hls.js ...
```
#### Engine(the library without hls.js)
Create hls.js instance passsing hlsjsConfig as param. Create P2PEngine instance passing hls.js instance and p2pConfig as params. Call hls.js loadSource and attachMedia methods.
```javascript
var hlsjsConfig = {
    maxBufferSize: 0,       // Highly recommended setting
    maxBufferLength: 30,    // Highly recommended setting
    liveSyncDuration: 30    // Highly recommended setting
};

var p2pConfig = {
    logLevel: 'debug',
    // Other p2pConfig options if applicable
};

var hls = new Hls(hlsjsConfig);
if (P2PEngine.isSupported()) {
    new P2PEngine(hls, p2pConfig);        // Key step
}

// Use `hls` just like your usual hls.js…
hls.loadSource(contentUrl);
hls.attachMedia(video);
hls.on(Hls.Events.MANIFEST_PARSED,function() {
    video.play();
});
```

## Player Integration
- [videojs](http://videojs.com/)
    - See [videojs-demo.html](demo/videojs-demo.html)
- [flowplayer](https://flowplayer.com/)
    - See [flowplayer-demo.html](demo/flowplayer-demo.html)
- [jwplayer](https://www.jwplayer.com/)
    - See [jwplayer-demo.html](demo/jwplayer-demo.html)
- [DPlayer](https://github.com/MoePlayer/DPlayer)
    - See [dplayer-demo.html](demo/dplayer-demo.html)
- [P2P-DPlayer](https://github.com/cdnbye/P2P-DPlayer)
    - [DPlayer](https://github.com/MoePlayer/DPlayer) with hlsjs-p2p-engine built-in.
- [P2P-CKPlayer](https://github.com/cdnbye/P2P-CKPlayer)
    - [CKPlayer](http://www.ckplayer.com/) with hlsjs-p2p-engine built-in.
- [clappr](https://github.com/clappr/clappr)
    - See [clappr-demo.html](demo/clappr-demo.html)
- [MediaElement.js](http://www.mediaelementjs.com/)
    - See [mediaelement-demo.html](demo/mediaelement-demo.html)
- [TCPlayer](https://cloud.tencent.com/document/product/267/7479)(Tencent Cloud Player)
    - See [tcplayer-demo.html](demo/tcplayer-demo.html)
- `Add your customized player here`
    - CDNBye can be integrated into any HTML5 video player that with hls.js built in.

## CDN
- [jsDelivr](https://www.jsdelivr.com/package/npm/cdnbye)
- [unpkg](https://unpkg.com/cdnbye@latest/)

## API and Configuration
See [API.md](docs/English/API.md)

## Signaling Server
To communicate with another peer you simply need to exchange contact information and the rest will be done by WebRTC. The process of connecting to the other peers is also known as signaling.
- Deploy your own Signaling Server (recommended)
    - [gosignaler](https://github.com/cdnbye/gosignaler) (written by Golang)
    - [php-signaler](https://github.com/cdnbye/php-signaler) (written by PHP)
- Use free Signaling Server
    - 'wss://signal.cdnbye.com/wss' (provided by cdnbye, sometimes overloaded, not recommended)
    - 'wss://free.freesignal.net' (contributed by freesignal.net, recommended)

## They are using CDNBye
[<img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531253035445&di=7af6cc9ad4abe3d06ba376af22d85131&imgtype=0&src=http%3A%2F%2Fimg.kuai8.com%2Fattaches%2Fintro%2F1213%2F201612131436417407.png" width="120">](http://egame.qq.com/)

Your website here – Send a pull request with your logo and URL!

## How It Works
See [design.md](docs/English/design.md)

## FAQ
We have collected some [frequently asked questions](docs/English/FAQ.md). Before reporting an issue, please search if the FAQ has the answer to your problem.

## Contact Us
Email: service@cdnbye.com







