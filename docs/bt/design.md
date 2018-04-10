## 概述
随着H5越来越普及，flash逐渐被淘汰已成为不可逆转的趋势。而在H5采用的视频传输格式中，hls由于兼容ios
和android、可以穿过任何允许HTTP数据通过的防火墙、容易使用内容分发网络来传输媒体流和码率自适应等众多
优势而在业界得到广泛使用。通过使用[hls.js](https://github.com/video-dev/hls.js)这个第三方库，
几乎所有现代浏览器都可以播放hls视频。hls天生分片传输的优势，使其可以采用p2p的方式进行传输，从而减小
服务器的负担。在web端，无插件化实现p2p传输能力的最好选择就是WebRTC技术，与hls.js类似，WebRTC也
支持几乎所有现代浏览器。本项目的目标是开发一个hls.js的插件，通过WebRTC data channel技术，在不影响
用户体验的前提下，最大化p2p率，从而为CP节省流量成本。

## 适用场景
- 点播
- 高延时直播(1min以上)
- 在已有项目中使用hls.js或即将采用hls.js

## 设计理念
- 采用仿BT算法，简化BT的流程，针对项目的特点进行算法优化
- 不改动hls.js源码，并且可以与其无缝衔接，一行代码集成，便于在现有项目中简单集成。
- 高可配置化，用户可以根据特定的使用环境调整各个参数
- 支持video.js、Clappr、Floeplayer等第三方播放器
- 通过有效的调度策略来保证用户的播放体验以及p2p率

## 算法流程
1. 替换hls.js的fLoader(使用http请求ts文件的模块)为定制的frag-loader，并初始化bt-tracker，以ts文件为单位建立bitmap;
2. bt-tracker通过tracker服务器获取节点，并与节点建立p2p连接；
2. p2p连接建立成功后向peer发送bitmap，并在下载成功某个ts文件文件后将序号及时广播给其它peer；
3. 当hls.js请求数据时，先在buffer-manager中查找，如果找到则返回缓存的ts文件，否则进入下一步；
4. 查看peers的bitmap，如果找到则向相应pear请求，否则用http请求
5. 通过监听hls.js事件来实时获取目前的播放进度，将当前播放点的后几个待下载数据定义为urgent，其余则为非urgent；
6. 在获取peer传递过来的bitmap后首先查看peer是否有自己待下载的urgent数据，如果有则优先下载这些数据；
7. 每隔一段时间采用BT的最少优先策略，查看所有peers的bitmap，优先下载周围节点最少的ts文件

## 代码结构
- ./index.hls-peerify.js
    - 入口文件，用于初始化其它模块，替换fLoader
    - 监听hls.js的事件
    - 上报统计信息
- ./signal-client.js
    - 负责与信令服务器建立websocket连接与信令的发送和接收
- ./events.js
    - 定义了代码中使用的各自事件
- ./data-channel.js
    - 封装了WebRTC data channel
    - 负责传输过程中处理各自私有协议
    - 二进制数据的处理
- ./config.js
    - 默认配置文件
- ./buffer-manager
    - 对缓存数据进行管理
- ./bt/bt-loader
    - 用于替换hls.js的fLoader
    - 接收到数据请求时，先在buffer-manager中查找，如果找到则返回缓存的ts文件，否则用xhr-loader请求
- ./bt/bt-tracker
    - 负责通过tracker服务器获取节点
    - 初始化bt-scheduler
- ./bt/bt-scheduler
    - 负责管理所有data channel
    - 实现仿BT算法
- ./bt/bittorrent
    - ./vod的入口文件
    - 保存vod模块的默认配置
- ./utils/ua-parser
    - 获取用户端设备信息
    