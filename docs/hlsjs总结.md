### 如何在直播中通过打时差为p2p传输提供条件
- 通过配置liveSyncDurationCount，比如设为5，将从playlist倒数第6个ts开始播放
- 或者配置liveSyncDuration（以秒为单位）

### 事件总结
- 通过FRAG_BUFFERED可以获取估算带宽（单位bit）
- 通过FRAG_CHANGED可以获取目前播放的frag序号