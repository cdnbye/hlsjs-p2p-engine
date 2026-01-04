**[English](README.md) | 简体中文**

<h1 align="center"><a href="" target="_blank" rel="noopener noreferrer"><img width="250" src="https://www.swarmcloud.net/img/logo.png" alt="cdnbye logo"></a></h1>
<h4 align="center">Save Your Bandwidth using WebRTC.</h4>
<h4 align="center">视频网站省流量&加速神器.</h4>
<p align="center">
  <a href="https://www.npmjs.com/package/cdnbye"><img src="https://img.shields.io/npm/v/cdnbye.svg?style=flat" alt="npm"></a>
  <a href="https://www.jsdelivr.com/package/npm/cdnbye"><img src="https://data.jsdelivr.com/v1/package/npm/cdnbye/badge" alt="jsdelivr"></a>
</p>

P2P技术使观看相同内容的用户之间可以相互分享数据，不仅能效降低视频/直播网站的带宽成本，还可以提升用户的播放体验，降低卡顿、二次缓存的发生率。
另外，随着H5的普及，flash逐渐被淘汰已成为不可逆转的趋势。而在H5采用的视频传输格式中，hls由于兼容ios和android、可以穿过任何允许HTTP数据通过的防火墙、容易使用内容分发网络来传输媒体流和码率自适应等众多优势而在业界得到广泛使用。通过使用[hls.js](https://github.com/video-dev/hls.js)这个第三方库，几乎所有现代浏览器都可以播放hls视频。hls天生分片传输的优势，使其可以采用p2p的方式进行传输，从而减小服务器的负担。在web端，无插件化实现p2p传输能力的最好选择就是[WebRTC](https://zh.wikipedia.org/wiki/WebRTC)技术，与hls.js类似，WebRTC也支持几乎所有现代浏览器。本项目是一个hls.js的插件，通过WebRTC datachannel技术，在不影响用户体验的前提下，最大化p2p率，是面向未来的Web P2P技术。

该插件的优势如下：
- 浏览器原生支持，不需要安装任何插件，采用仿BT算法，在线人数越多效果越好
- 支持基于HLS流媒体协议(m3u8)的直播和点播场景
- 支持加密HLS传输
- 不改动hls.js源码，并且可以与其无缝衔接，几行代码集成，便于在现有项目中快速集成
- 浏览器不支持WebRTC时无缝切换到HTTP下载模式
- 高可配置化，用户可以根据特定的使用环境调整各个参数
- 支持video.js、Clappr、Flowplayer、DPlayer等第三方播放器
- 通过有效的调度策略来保证用户的播放体验以及p2p率
- Tracker服务器根据访问IP的ISP、地域等进行智能调度

## 演示Demo
打开2个相同的网页：[demo](https://demo.cdnbye.com/)

## 浏览器支持情况
由于WebRTC已成为HTML5标准，目前大部分主流浏览器都已经支持。CDNBye的浏览器兼容性取决于WebRTC和hls.js。需要注意的是iOS版Safari由于不支持MediaSource API，因此也不支持hls.js(不过Safari原生支持HLS播放)。

 兼容性|Chrome | Firefox | macOS Safari| 安卓微信/QQ | Opera | Edge | IE | iOS Safari | 
:-: | :-: | :-: | :-: | :-: | :-: | :-:| :-:| :-:
WebRTC Datachannel | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ❌ | ✔ |
Hls.js | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ❌ |
CDNBye | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ❌ | ❌ |

## 使用方法
参考[文档](https://www.cdnbye.com/web-hls/usage.html)

## 播放器集成  
支持几乎所有主流播放器，请点击[这里](https://www.cdnbye.com/web-hls/players.html)

## API文档
参见 [API.md](https://www.cdnbye.com/web-hls/API.html)

## 后台管理系统
在接入P2P插件后，访问[dashboard](https://dash.swarmcloud.net)，注册并绑定域名，即可查看该域名的P2P流量、在线人数、用户地理分布等信息。

## 相关项目
- [hls-sw-p2p-engine](https://github.com/swarm-cloud/hls-sw-p2p-engine) - 基于ServiceWorker的P2P流媒体加速引擎，适用于所有浏览器。
- [android-p2p-engine](https://gitee.com/cdnbye/android-p2p-engine) - 安卓端P2P流媒体加速引擎。
- [ios-p2p-engine](https://gitee.com/cdnbye/ios-p2p-engine) - iOS端P2P流媒体加速引擎。
- [flutter-p2p-engine](https://gitee.com/cdnbye/flutter-p2p-engine) - Flutter视频/直播APP省流量&加速神器, 由 [mjl0602](https://github.com/mjl0602) 贡献。
- [shaka-p2p-engine](https://github.com/cdnbye/shaka-p2p-engine) - 同时支持HLS和Mpeg-Dash格式。
- [dashjs-p2p-engine](https://github.com/cdnbye/dashjs-p2p-engine) - MPEG-dash协议的Web端P2P流媒体方案。
- [mp4-sw-p2p-engine](https://github.com/swarm-cloud/mp4-sw-p2p-engine) - 支持MP4的Web端P2P流媒体方案。

## FAQ
我们收集了一些[常见问题](https://www.cdnbye.com/faq.html)。在报告issue之前请先查看一下。

## 联系我们
邮箱：service@cdnbye.com
QQ：849433499

