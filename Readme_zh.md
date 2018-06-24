<h1 align="center"><a href="" target="_blank" rel="noopener noreferrer"><img width="250" src="figs/cdnbye.png" alt="cdnbye logo"></a></h1>
<h4 align="center">It's time to say bye to CDN.</h4>
<p align="center">中小型视频网站省流量神器.</p>
<p align="center">
  <a href="https://www.npmjs.com/package/cdnbye"><img src="https://img.shields.io/npm/v/cdnbye.svg?style=flat" alt="npm"></a>
   <a href="https://www.jsdelivr.com/package/npm/cdnbye"><img src="https://data.jsdelivr.com/v1/package/npm/cdnbye/badge" alt="jsdelivr"></a>
 <a href="https://www.jsdelivr.com/package/npm/cdnbye"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
</p>

**[English](README.md)**


随着H5的普及，flash逐渐被淘汰已成为不可逆转的趋势。而在H5采用的视频传输格式中，hls由于兼容ios和android、可以穿过任何允许HTTP数据通过的防火墙、容易使用内容分发网络来传输媒体流和码率自适应等众多优势而在业界得到广泛使用。通过使用[hls.js](https://github.com/video-dev/hls.js)这个第三方库，几乎所有现代浏览器都可以播放hls视频。hls天生分片传输的优势，使其可以采用p2p的方式进行传输，从而减小服务器的负担。在web端，无插件化实现p2p传输能力的最好选择就是[WebRTC](https://en.wikipedia.org/wiki/WebRTC)技术，与hls.js类似，WebRTC也支持几乎所有现代浏览器。本项目的目标是开发一个hls.js的插件，通过WebRTC datachannel技术，在不影响用户体验的前提下，最大化p2p率，从而为CP节省流量成本。

该插件的优势如下：
- 采用仿BT算法，简化BT的流程，并且针对流媒体的特点对算法进行调整
- 不改动hls.js源码，并且可以与其无缝衔接，几行代码集成，便于在现有项目中快速集成
- 高可配置化，用户可以根据特定的使用环境调整各个参数
- 支持video.js、Clappr、Flowplayer等第三方播放器
- 通过有效的调度策略来保证用户的播放体验以及p2p率
- Tracker服务器根据访问IP的ISP、地域等进行智能调度

## 演示Demo
打开2个相同的网页：[demo](http://cdnbye.gitee.io/hlsjs-p2p-engine/videojs-demo.html)

## 快速入门
#### 快速入门Demo
将[quick-start.html](demo/quick-start.html)拷贝到您的网页中并运行。再打开另一个相同的网页。见证奇迹的时候到了！您已在两个网页之间建立了一个P2P连接，在不安装任何插件的情况下。如果在这个频道中（一个m3u8标识了一个频道）没有其它参与者，那么您打开的第一个网页将作为种子为第二个网页提供数据。

#### 在现有的hls.js项目中集成
只需要将原有的引入hls.js的script标签如：
 ```javascript
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
```
替换为
 ```javascript
<script src="https://cdn.jsdelivr.net/npm/cdnbye@latest"></script>
```
就是这么简单！

## 浏览器支持情况
由于WebRTC已成为HTML5标准，目前大部分主流浏览器都已经支持。CDNBye的浏览器兼容性取决于WebRTC和hls.js。需要注意的是iOS版Safari由于不支持MediaSource API，因此也不支持hls.js(不过Safari原生支持HLS播放)。

 兼容性|Chrome | Firefox | Mac Safari| iOS Safari | Opera | IE | Edge|   
:-: | :-: | :-: | :-: | :-: | :-: | :-:| :-:
WebRTC | Yes | Yes | Yes | Yes | Yes | No | No
Hls.js | Yes | Yes | Yes | No | Yes | Yes | Yes
CDNBye | Yes | Yes | Yes | No | Yes | No | No 

## 集成

#### 通过script标签集成
引入已经和hls.js打包的最新版本（推荐）：
```javascript
<script src="https://cdn.jsdelivr.net/npm/cdnbye@latest"></script>
```
或者引入没有与hls.js打包的独立版本：
```javascript
<script src="https://cdn.jsdelivr.net/npm/cdnbye@latest/dist/hlsjs-p2p-engine.min.js"></script>
```

#### 通过NPM安装依赖
```
cd yourProject && npm install cdnbye --save
```
在项目中通过import/require引入依赖包：
```javascript
import Hls from 'cdnbye';   // 打包了hls.js的依赖
```
或者
```javascript
import Hls from 'hls.js';     // 需要先执行"npm install --save hls.js"
import P2PEngine from 'cdnbye/dist/hlsjs-p2p-engine';   // 没有打包hls.js的JS库
```

## 使用方法
#### Bundle
在hlsjsConfig对象字面量中加入p2pConfig字段，然后在实例化hls.js时把hlsjsConfig作为参数传入。
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
#### Engine(没有打包hls.js的插件，需要自己引入hls.js)
实例化hls.js并将hlsjsConfig作为参数传入。然后实例化P2PEngine并将p2pConfig作为参数传入。调用hls.js的loadSource和attachMedia方法。
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

## API文档
参见 [API.md](docs/中文/API.md)

## 运作原理
参见 [设计.md](docs/中文/设计.md)

## FAQ
我们收集了一些[常见问题](docs/中文/常见问题.md)。在报告issue之前请先查看一下。

## 播放器集成
- [videojs](http://videojs.com/)
    - 参见 [videojs-demo.html](demo/videojs-demo.html)
- [flowplayer](https://flowplayer.com/)
    - 参见 [flowplayer-demo.html](demo/flowplayer-demo.html)
- [jwplayer](https://www.jwplayer.com/)
    - 参见 [jwplayer-demo.html](demo/jwplayer-demo.html)
- [DPlayer](https://github.com/MoePlayer/DPlayer)
    - 参见 [dplayer-demo.html](demo/dplayer-demo.html)
- [clappr](https://github.com/clappr/clappr)
    - 参见 [clappr-demo.html](demo/clappr-demo.html)
- [MediaElement.js](http://www.mediaelementjs.com/)
    - 参见 [mediaelement-demo.html](demo/mediaelement-demo.html)
- [Fluid Player](https://www.fluidplayer.com/)
    - coming soon!
- `欢迎贡献您的播放器demo`
    - CDNBye可以集成到内置hls.js的任何H5视频播放器中！

