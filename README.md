<h1 align="center"><a href="" target="_blank" rel="noopener noreferrer"><img width="250" src="figs/cdnbye.png" alt="cdnbye logo"></a></h1>
<h4 align="center">It's time to say bye to CDN.</h4>


**[中文](docs/中文/README_CH.md)**

This JS library implements [WebRTC](https://en.wikipedia.org/wiki/WebRTC) datachannel to scale live/vod video streaming by peer-to-peer network using bittorrent-like protocol. Powered by [hls.js](https://github.com/video-dev/hls.js), it can play HLS on any platform with many popular HTML5 players such as video.js, Clappr and Flowplayer. This library is a part of CDNBye project which attempts to deliver high quality video streams, decreasing the number of requests to CDN servers, reducing the cost of transmission and enhancing system’s scalability. As the name suggests, CDNBye will help you offload bandwidth from expensive traditional CDNs，while also maximizing a user’s viewing experience.

## Playground
coming soon...

## Getting Started
#### Quick Start Demo
Put the [quick-start.html](demo/quick-start.html) in your web page, run it. Wait for a few seconds，then open the same page from another browser(the receiver). Now you have a direct P2P connection between two browsers without plugin!
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

## Browser Support
WebRTC has already been incorporated into the HTML5 standard and it is broadly deployed in modern browsers. The compatibility of CDNBye depends on the browser support of WebRTC and MSE. Please note that iOS Safari "Mobile" does not support the MediaSource API.

 Compatibility|Chrome | Firefox | Mac Safari| iOS Safari | Opera | IE | Edge|   
:-: | :-: | :-: | :-: | :-: | :-: | :-:| :-:
WebRTC | Yes | Yes | Yes | Yes | Yes | No | No
+MSE | Yes | Yes | Yes | No | Yes | Yes | Yes
=CDNBye | Yes | Yes | Yes | No | Yes | No | No 

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
import Hls from 'hls.js';     //please run "npm install --save hls.js" first
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
Create hls.js instance passsing hlsjsConfig as param. Create CDNbye instance passing hls.js instance and p2pConfig as params. Call hls.js loadSource and attachMedia methods.
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
var p2pEngine = new P2PEngine(hls, p2pConfig);        // Key step

// Use `hls` just like your usual hls.js…
hls.loadSource(contentUrl);
hls.attachMedia(video);
hls.on(Hls.Events.MANIFEST_PARSED,function() {
    video.play();
});
```

## API and Configuration
See [API.md](docs/English/API.md)

## Design
See [design.md](docs/English/design.md)

## FAQ
We have collected some [frequently asked questions](docs/English/FAQ.md). Before reporting an issue, please search if the FAQ has the answer to your problem.

## Player integration
- [flowplayer](https://flowplayer.com/docs/player/setup#hlsjs-lite)

## Donation
If you find CDNBye useful, you can buy me a cup of coffee :)<br>
<img width="200" src="figs/pay.jpeg" alt="donation">







