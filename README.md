<h1 align="center"><a href="" target="_blank" rel="noopener noreferrer"><img width="250" src="figs/cdnbye.png" alt="cdnbye logo"></a></h1>
<h4 align="center">It's time to say bye to CDN.</h4>


**[中文](docs/中文/README_CH.md)**

This JS library implements [WebRTC](https://en.wikipedia.org/wiki/WebRTC) datachannel to scale live/vod video streaming by peer-to-peer network using bittorrent-like protocol. Powed by [hls.js](https://github.com/video-dev/hls.js), it can play HLS on any platform with many popular HTML5 players such as video.js, Clappr and Flowplayer.  This library is a part of CDNBye project which attempts to deliver high quality video streams， decreasing the number of requests to CDN servers, reducing the cost of transmission and enhancing system’s scalability. As the name suggests, CDNBye will help you offload bandwidth from expensive traditional CDNs，while also maximizing a user’s viewing experience.

## Quick Start
Put the [quick-start.html](demo/quick-start.html) in your web page, run it(the seed, if no one else in the channel). Wait for a few seconds，then open the same page from another browser(the receiver). Now you have a direct P2P connection between two browsers without plugin!

## Installation

### Pre-built Script
Include the latest version bundled with hls.js(recommended): 
```javascript
<script src="https://cdn.jsdelivr.net/npm/cdnbye@latest"></script>
```
Or include the latest version without hls.js:
```javascript
<script src="https://cdn.jsdelivr.net/npm/cdnbye@latest/dist/hlsjs-p2p-engine.min.js"></script>
```

### Via NPM
```
npm install cdnbye --save
```
In your application import/require the package you want to use as the following examples:
```javascript
import Hls from 'cdnbye/src/index.hls';   //the package with hls.js
```
```javascript
import CDNBye from 'cdnbye/src/index.engine';   //the package without hls.js
```

## usage
coming soon...

## API and Configuration
See [API.md](docs/English/API.md)

## Design
See [design.md](docs/English/design.md)





