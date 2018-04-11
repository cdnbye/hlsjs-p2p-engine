---bittorrent protocol--------------------------------

## tracker交互协议

### GET /announce (向tracker注册并请求peers)
#### 参数
```javastript
{  
    info_hash: string             //频道标识，目前是url的sha1值
    browser:   string             //浏览器名
    device: string                //mobile 或 PC
    os: string                    //操作系统                      
}
```
#### 返回
```javastript
{
    peer_id: string                //节点的唯一ID   
    report_interval: number        //上报统计信息的时间间隔 
    heartbeat_interval: number     //心跳时间间隔
    peers: [
        {id: string}                         
    ]
}
```

### GET /get_peers (向tracker请求peers)
#### 参数
```javastript
{  
    info_hash: string              //频道标识，目前是url的sha1值
    peer_id: string                //节点的唯一ID   
}
```
#### 返回
```javastript
{
    peers: [
        {id: string}                         
    ]
}
```

### POST /stats (向tracker请求peers)
#### 参数
```javastript
{  
    info_hash: string             //频道标识，目前是url的sha1值
    peer_id: string
}
```
#### Body
```javastript
{  
    source: number
    p2p: number
    conns: number                 //连接的peer数量
    failConns: number
}
```
#### 返回
```javastript
{
                         
}
```
### GET /heartbeat 
#### 参数
```javastript
{  
    info_hash: string             //频道标识，目前是url的sha1值
    peer_id: string
}
```
#### 返回
```javastript
{
                     
}
```

## datachannel交互协议


### 通过SN请求数据 
```javastript       
{
    event: 'REQUEST'   
    sn: number              //ts数据的播放序号
    urgent: boolean         //是否紧急
}
```


### 返回二进制数据头
```javastript       
{
    event: 'PIECE'   
    attachments：number      //接下来传输几个二进制包
    url: string              //ts文件的url（相对url）
    sn: number               //ts数据的播放序号
    size: number             //二进制数据的总大小，可用于校验
}
```

### 接收到所有二进制数据包后返回确认信息
```javastript       
{
    event: 'PIECE_ACK'   
    url: string              //ts文件的url（相对url）
    sn: number               //ts数据的播放序号
}
```

### 主动关闭datachannel
```javastript    
{
    event: 'CLOSE' 
}
```

### datachannel 发生错误
```javastript       
{
    event: 'ERROR'  
}
```

### 传递bitfield
```javastript       
{
    event: 'BITFIELD'  
    field: array
}
```

### 下载完一个ts后立即广播给所有peers
```javastript       
{
    event: 'HAVE'  
    sn: number               //ts数据的播放序号
}
```

### lost一个ts后立即广播给所有peers
```javastript       
{
    event: 'LOST'  
    sn: number               //ts数据的播放序号
}
```