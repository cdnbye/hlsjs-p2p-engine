### 如何在直播中通过打时差为p2p传输提供条件
- 通过配置liveSyncDurationCount，比如设为5，将从playlist倒数第6个ts开始播放
- 或者配置liveSyncDuration（以秒为单位）

### 事件总结
- 通过FRAG_BUFFERED可以获取估算带宽（单位bit）
- 通过FRAG_CHANGED可以获取目前播放的frag序号

### loaded的frag不会再重复下载(除非前面缓存的buffer被清空)，loading和loaded交替进行

### 码率必须匹配，不然会解析错误

### stats
- @param stats.tfirst {number} - performance.now() of first received byte
- @param stats.tload {number} - performance.now() on load complete
- @param stats.loaded {number} - nb of loaded bytes

```javascript
- [fragment-loader] loadsuccess stats:
{
  "trequest": 392.84000000000003,
  "retry": 0,
  "tfirst": 11654.220000000001,
  "loaded": 272412,
  "total": 272412,
  "tload": 11656.105
}

- [fragment-loader] loadsuccess context:
{
  "url": 
  "frag": 
  "responseType": 
  "progressData"：
  "rangeStart":
  "rangeEnd": 
}

- [fragment-loader] loadsuccess response:
{
  "url": https://video-dev.github.io/streams/x36xhzz/url_2/url_526/193039199_mp4_h264_aac_ld_7.ts
  "data": xhr.response
}

- [Events.FRAG_CHANGED] frag
{
  "frag": {
    "_url": "https://video-dev.github.io/streams/test_001/stream_110k_48k_416x234_000.ts",
    "_byteRange": [],
    "_decryptdata": {
      "method": null,
      "key": null,
      "iv": null,
      "_uri": null
    },
    "tagList": [
      [
        "EXT-X-ALLOW-CACHE",
        "YES"
      ],
      [
        "INF",
        "10.000000"
      ]
    ],
    "duration": 10,
    "title": null,
    "type": "main",
    "start": 0.13333333333333333,
    "levelkey": {
      "method": null,
      "key": null,
      "iv": null,
      "_uri": null
    },
    "sn": 0,
    "level": 0,
    "cc": 0,
    "baseurl": "https://video-dev.github.io/streams/test_001/stream_110k_48k_416x234.m3u8",
    "relurl": "stream_110k_48k_416x234_000.ts",
    "loadCounter": 1,
    "loadIdx": 0,
    "autoLevel": true,
    "loaded": 245528,
    "startPTS": 0.13333333333333333,
    "maxStartPTS": 0.13333333333333333,
    "endPTS": 10.133333333333333,
    "startDTS": 0,
    "endDTS": 10.032,
    "dropped": 0,
    "backtracked": false,
    "deltaPTS": 0
  }
}
```

```javascript
LevelDetails:
{
  version: 3,
  type: 'VOD', // null if EXT-X-PLAYLIST-TYPE not present
  startSN: 0,
  endSN: 50,
  totalduration: 510,
  targetduration: 10,
  fragments: Array(51),
  live: false
}
```