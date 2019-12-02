**[English](README.md) | 简体中文**

<h1 align="center"><a href="" target="_blank" rel="noopener noreferrer"><img width="250" src="https://cdnbye.oss-cn-beijing.aliyuncs.com/pic/cdnbye.png" alt="cdnbye logo"></a></h1>
<h4 align="center">Save Your Bandwidth using WebRTC.</h4>
<h4 align="center">视频网站省流量&加速神器.</h4>
<p align="center">
  <a href="https://www.npmjs.com/package/cdnbye"><img src="https://img.shields.io/npm/v/cdnbye.svg?style=flat" alt="npm"></a>
  <a href="https://www.jsdelivr.com/package/npm/cdnbye"><img src="https://data.jsdelivr.com/v1/package/npm/cdnbye/badge" alt="jsdelivr"></a>
  <a href="https://github.com/cdnbye/hlsjs-p2p-engine/tree/master/dist"><img src="https://badge-size.herokuapp.com/cdnbye/hlsjs-p2p-engine/master/dist/hlsjs-p2p-engine.min.js?compression=gzip&style=flat-square" alt="size"></a>
</p>

P2P技术使观看相同内容的用户之间可以相互分享数据，不仅能效降低视频/直播网站的带宽成本，还可以提升用户的播放体验，降低卡顿、二次缓存的发生率。
另外，随着H5的普及，flash逐渐被淘汰已成为不可逆转的趋势。而在H5采用的视频传输格式中，hls由于兼容ios和android、可以穿过任何允许HTTP数据通过的防火墙、容易使用内容分发网络来传输媒体流和码率自适应等众多优势而在业界得到广泛使用。通过使用[hls.js](https://github.com/video-dev/hls.js)这个第三方库，几乎所有现代浏览器都可以播放hls视频。hls天生分片传输的优势，使其可以采用p2p的方式进行传输，从而减小服务器的负担。在web端，无插件化实现p2p传输能力的最好选择就是[WebRTC](https://zh.wikipedia.org/wiki/WebRTC)技术，与hls.js类似，WebRTC也支持几乎所有现代浏览器。本项目是一个hls.js的插件，通过WebRTC datachannel技术，在不影响用户体验的前提下，最大化p2p率，是面向未来的Web P2P技术。
<br>想知道P2P效果如何吗，登录[后台管理系统](https://oms.cdnbye.com)并绑定域名就可以查看啦！

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
- API已经固化，新版本完全兼容旧版本代码

## 演示Demo
打开2个相同的网页：[demo](https://demo.cdnbye.com/)

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
#### 集成到第三方HTML5播放器
参考[demos](https://github.com/cdnbye/hlsjs-p2p-engine/blob/master/Readme_zh.md#%E6%92%AD%E6%94%BE%E5%99%A8%E9%9B%86%E6%88%90)。

## 浏览器支持情况
由于WebRTC已成为HTML5标准，目前大部分主流浏览器都已经支持。CDNBye的浏览器兼容性取决于WebRTC和hls.js。需要注意的是iOS版Safari由于不支持MediaSource API，因此也不支持hls.js(不过Safari原生支持HLS播放)。

 兼容性|Chrome | Firefox | macOS Safari| 安卓微信/QQ | Opera | Edge | IE | iOS Safari | 
:-: | :-: | :-: | :-: | :-: | :-: | :-:| :-:| :-:
WebRTC Datachannel | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ❌ | ✔ |
Hls.js | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ❌ |
CDNBye | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ❌ | ❌ | 

## 集成
通过script标签引入已经和hls.js打包的最新版本（推荐）：
```javascript
<script src="https://cdn.jsdelivr.net/npm/cdnbye@latest"></script>
```
或者引入没有与hls.js打包的独立版本：
```javascript
<script src="https://cdn.jsdelivr.net/npm/cdnbye@latest/dist/hlsjs-p2p-engine.min.js"></script>
```

## 使用方法
参考[文档](http://docs.cdnbye.com/#/web/usage?id=%E4%BD%BF%E7%94%A8%E6%8F%92%E4%BB%B6)

## 播放器集成  
- [videojs](http://videojs.com/)
    - 参见 [videojs demo](https://docs.cdnbye.com/#/web/players?id=videojs)
- [flowplayer](https://flowplayer.com/)
    - 参见 [flowplayer demo](https://docs.cdnbye.com/#/web/players?id=flowplayer)
- [jwplayer](https://www.jwplayer.com/)
    - 参见 [jwplayer demo](https://docs.cdnbye.com/#/web/players?id=jwplayer)
- [DPlayer](https://github.com/MoePlayer/DPlayer)
    - 参见 [dplayer demo](https://docs.cdnbye.com/#/web/players?id=dplayer%E6%8E%A8%E8%8D%90)
- [CKPlayer](http://www.ckplayer.com/)
    - 参见 [ckplayer demo](https://docs.cdnbye.com/#/web/players?id=ckplayer)，基于嵌入hlsjs-p2p-engine的[P2P-CKPlayer](https://github.com/cdnbye/P2P-CKPlayer)
- [clappr](https://github.com/clappr/clappr)
    - 参见 [clappr demo](https://docs.cdnbye.com/#/web/players?id=clappr)
- [MediaElement.js](http://www.mediaelementjs.com/)
    - 参见 [mediaelement demo](https://docs.cdnbye.com/#/web/players?id=mediaelementjs)
- [TCPlayer](https://cloud.tencent.com/document/product/881/20207)(腾讯云播放器)
    - 参见 [tcplayer demo](https://docs.cdnbye.com/#/web/players?id=tcplayer)
- [Chimee](http://chimee.org/)
    - 参见 [chimee demo](https://docs.cdnbye.com/#/web/players?id=chimee)
- [XGPlayer](http://h5player.bytedance.com/en/)
    - 参见 [xgplayer demo](https://docs.cdnbye.com/#/web/players?id=xgplayer)
- [fluidplayer](https://www.fluidplayer.com/)
    - 参见 [fluidplayer demo](https://docs.cdnbye.com/#/web/players?id=fluidplayer)
- [OpenPlayer](https://www.openplayerjs.com/)
    - 参见 [OpenPlayer demo](https://docs.cdnbye.com/#/web/players?id=openplayer)
- [Plyr](https://plyr.io/)
    - 参见 [Plyr demo](https://docs.cdnbye.com/#/web/players?id=plyr)
- [Playerjs](https://playerjs.com/)
    - 参见 [Playerjs demo](https://docs.cdnbye.com/#/web/players?id=playerjs)
- [CHPlayer](http://www.chplayer.com/)
    - 参见 [chplayer demo](https://docs.cdnbye.com/#/web/players?id=chplayer)，基于嵌入hlsjs-p2p-engine的[P2P-CHPlayer](https://github.com/cdnbye/P2P-CHPlayer)
- `欢迎贡献您的播放器demo`
    - CDNBye可以集成到内置hls.js的任何H5视频播放器中！

## API文档
参见 [API.md](https://docs.cdnbye.com/#/web/API)

## 后台管理系统
在接入P2P插件后，访问`https://oms.cdnbye.com`，注册并绑定域名，即可查看该域名的P2P流量、在线人数、用户地理分布等信息。

## 相关项目
- [android-p2p-engine](https://gitee.com/cdnbye/android-p2p-engine) - 安卓端P2P流媒体加速引擎。
- [ios-p2p-engine](https://gitee.com/cdnbye/ios-p2p-engine) - iOS端P2P流媒体加速引擎。
- [flutter-p2p-engine](https://gitee.com/cdnbye/flutter-p2p-engine) - Flutter视频/直播APP省流量&加速神器, 由 [mjl0602](https://github.com/mjl0602) 贡献。

## 客户案例
[<img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531253035445&di=7af6cc9ad4abe3d06ba376af22d85131&imgtype=0&src=http%3A%2F%2Fimg.kuai8.com%2Fattaches%2Fintro%2F1213%2F201612131436417407.png" width="120">](https://egame.qq.com/?hls=1&p2p=1&_debug=1)

## FAQ
我们收集了一些[常见问题](https://docs.cdnbye.com/#/FAQ)。在报告issue之前请先查看一下。

## 联系我们
邮箱：service@cdnbye.com

