## 浏览器P2P项目对接文档

### 项目概况
本项目目标是利用P2P技术在直播情境下降低CDN成本，P2P技术基于WebRTC，采用HLS作为直播协议，
具体实现采用hls.js这个第三方js库。我们构建的P2P模块作为hls.js的插件，在不改动hls.js源代码的前提下
进行集成工作。P2P算法采用目前公认效果较好的fastmesh算法。

### 前置知识
- WebRTC(可百度，谷歌，重点是其中的Data Channel技术) 
- [Simple-Peer](https://github.com/feross/simple-peer)(封装了WebRTC)（必须）
- HLS协议(可百度，谷歌)
- [hls.js](https://github.com/video-dev/hls.js)（必须）
- [ES6](http://es6.ruanyifeng.com/)
- [webpack](http://webpack.github.io/)
- WebSocket
- [fastmesh](http://xueshu.baidu.com/s?wd=paperuri%3A%280a483ef567e6cffa731e9b37cfa152c8%29&filter=sc_long_sign&sc_ks_para=q%3DFast-Mesh%3A%20A%20Low-Delay%20High-Bandwidth%20Mesh%20for%20Peer-to-Peer%20Live%20Streaming&sc_us=568579752793288703&tn=SE_baiduxueshu_c1gjeupa&ie=utf-8)（必须）
- [vis.js可视化框架](http://visjs.org/)（可选）
- go语言(RP服务器实现语言)（必须）
- [npm前端依赖管理工具](https://www.npmjs.com/)
- [React](https://reactjs.org/)（可选）

### 技术架构
#### 前端组成模块
- index.hls-peerify
本p2p插件的入口文件，接收hls.js实例，并替换数据请求模块fLoader为我们自己实现的hybrid-loader
- hybrid-loader
根据目前播放进度在http下载和p2p下载之间切换，同时将下载的数据缓存在buffer-manager中
- buffer-manager
缓存数据，用于向子节点提供数据
- config
默认配置参数
- events
保存全部事件的键值对
- data-channel
封装了simple-peer，提供底层p2p能力
- p2p-scheduler
p2p调度模块，实现了fastmesh算法
- p2p-signaler
信令模块，负责处理两节点间的信令，同时负责与RP服务器交换信息
- substreams
实现了fastmesh中的子流逻辑

#### RP服务器
负责提供若干个父节点给当前节点，父节点需要经过ISP、地区等过滤，保证p2p连接率和稳定性。传输协议请参考./docs/protocol.md的websocket传输协议

#### 私有协议
- data channel传输协议
用于节点之间的信息传输，请参考./docs/protocol.md的datachannel传输协议
- websocket传输协议
用于RP服务器与节点之间的信息传输，请参考./docs/protocol.md的websocket传输协议
- 信令协议
请参考./docs/信令协议.md
- 拓扑结构可视化协议
用于RP服务器与可视化客户端的信息传输，请参考./docs/protocol.md的拓扑结构可视化协议

#### 使用方法
- 启动RP服务器
```go
cd goscheduler
go run main.go
```
- 打开hls播放页面 peerify-script-demo.html
- 打开可视化页面
```bash
cd vis-fastmesh
npm run start
```

#### 调试方法
- RP服务器
```go
//修改代码后执行
go build main.go
```
- hls插件
```bash
//修改代码后执行
npm run build-hls-peerify
//然后打开hls播放页面 peerify-script-demo.html 即可看到效果
```
- 可视化模块
```bash
npm run start
//react是自动监听代码更新的，不需要重启
```

### 任务
#### 可视化模块开发
目前的可视化模块vis-fastmesh比较简陋，需要增加功能，以及美化界面（目前是采用react框架，但react-vis框架
不好用，所以可以考虑用原生的vis.js，灵活性更大一点）
- 要求：1. 界面上有输入框，可以输入url进入相应的频道  2. 增量更新，当有拓扑结构变动时只更新变化的部分
3. 拓扑图的线（子流）必须准确  4. 鼠标移动到节点上需要显示节点的详细信息（ISP、省份、城市、p2p率等）

#### RP服务器开发
RP服务器存储了频道中各个节点的信息，为节点提供可靠的父节点。
- 要求是1. go语言实现  2. 一个良好的过滤算法（需要考虑影响p2p连接成功率的因素） 3. 服务器稳定可靠，代码健壮
4. 并发性能好
- 参考资源：https://github.com/gorilla/websocket

#### 插件兼容Safari
目前我们的插件在Safari浏览器上还没有p2p效果，可能是浏览器兼容问题，需要根据浏览器的特性修改代码，达到在
Chrome、Firefox、Safari上都可以兼容的效果

#### 优化fastmesh算法
例如通过WebRTC的getStats API来实时监测丢包率，进而调整上行带宽等，或者在上行带宽难以测量的情况下如何
更好的实现fastmesh算法
具体参考论文和代码进行优化

#### 加分项 完成自己发掘的需求

#### 提交形式
- 文档，详细的文档
- 代码，需要当场演示并code review
- 测试用例




