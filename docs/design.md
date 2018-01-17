
### src/loader-scheduler
用于切换xhr-loader和p2p-scheduler来下载buffer，根据urgent/prefetch原则，离播放点近的或发生seek用http下载，
离播放点远的用p2p下载。
调度算法：通过监听FRAG_CHANGE来获取当前播放的frag序号，只有大于改需要一定块间隔和时间间隔的frag才用p2p
下载.
currPlay:目前在播放的块  currLoading:目前在下载的块  currLoaded:目前刚下载完的块
方案一：
- currLoading-currPlay>1 && currLoading-currLoaded=1 的currLoading用p2p下载
- 其他情况用http下载

### src/p2p-scheduler
用于调度datachannel

