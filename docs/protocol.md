## datachannel传输协议

### datachannel KEEPALIVE   （暂时未使用）
```javastript       
{
    event: 'KEEPALIVE'
    current:        //目前最新缓存的序号
}
```

### datachannel KEEPALIVE-ACK   （暂时未使用）
```javastript       
{
    event: 'KEEPALIVE-ACK'
    current:        //目前最新缓存的序号
}
```

### 请求数据 
```javastript       
{
    event: 'REQUEST'   
    url: string             //ts数据的url（相对url）
    sn: number              //ts数据的播放序号
    br: number              //码率
}
```

### 返回二进制数据头
```javastript       
{
    event: 'PIECE'   
    attachments：number    //接下来传输几个二进制包
    url: string    //ts文件的url（相对url）
    sn: number         //ts数据的播放序号
    size: number    //二进制数据的总大小，可用于校验
    current:        //目前最新缓存的序号
}
```

### 未找到请求数据
```javastript     
{
    event: 'LACK'  
    url: string    //ts文件的url（相对url）
    current: number         //当前播放序号
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

---fastmesh protocol--------------------------------

### 通知对方成为子节点         
```javastript       
{
    event: 'DISPLACE'  
}
```

### 向父节点发送跃迁请求
```javastript       
{
    event: 'TRANSITION'
    ul_bw: number             //总上行带宽（单位bps）
    TTL: number
    source_TTL: number        //原来的TTL(固定值)
    from_peer_id: string      //本节点Id
}
```

### 向子节点发送同意跃迁响应
```javastript       
{
    event: 'GRANT'
    delay: number             //source-to-end delay, 目前用level表示
    TTL: number
    parents: Array<{peer_id,substreams}>           
    from_peer_id: string     
    to_peer_id: string
}
```

## websocket传输协议   

### peer ---> server    进入频道请求
```javastript
{
    action: 'enter'                
    channel: string               //频道标识，目前是m3u0的url
    ul_bw: number                 //初始设置的上行带宽
    browser:   string              //浏览器名
    device: string               //mobile 或 PC
    os: string                    //操作系统 
    
    test: boolean                //测试模式
    ISP: string                
    province: string
}
```

### server ---> peer    允许进入频道
```javastript
{
    action: 'accept'  
    peer_id: string                //本节点唯一标识
    speed_test: string             //测速url
    report_span: number            //上报统计信息的时间间隔
    substreams: number             //分几个子流
}   
```

### peer ---> server    离开频道请求
```javastript
{
   action: 'leave'             
}
```

### peer ---> server    返回上行带宽
```javastript
{
   action: 'ul_bw'
   value: number            
}
```

### peer ---> server    datachannel建立成功(子节点发出，父节点不发)
```javastript
{
    action: 'dc_opened'                
    dc_id: string            //datachannel的Id
    substreams: number       //子流数量
    stream_rate: number      //每个子流的码率
}
```

### peer ---> server    datachannel关闭
```javastript
{
    action: 'dc_closed'                
    dc_id: string            //datachannel的Id
    substreams: number       //子流数量
    stream_rate: number      //每个子流的码率
}
```

### peer ---> server    datachannel建立失败
```javastript
{
    action: 'dc_failed'            
    dc_id: string            //datachannel的Id
}
```

### server ---> peer        发送连接命令给peer
```javastript
{
    action: 'connect'           
    to_peer_id: string            //父节点的Id
}
```



### server ---> peer        发送断开连接命令给peer
```javastript
{
    action: 'disconnect'           
    to_peers: Array<string>            //断开连接的节点的Id数组
}
```


### peer ---> server    定时上报统计信息
```javastript
{
    action: 'statistics'            
    level:   number              //平均level，用于调度
    source: number               //源站下载的流量大小（单位KB）
    p2p: number                  //p2p下载的流量大小（单位KB）
    ul_srs: {                    暂时不用 //当前每个data channel上行streaming rate(单位bit/s)
        map[string]number{
            remotePeerId: sr
        }
    }
    plr: number                  //当前丢包率
}
```

### peer ---> server    请求成为父节点（跃迁2层）
```javastript
{
    action: 'transition'         
}
```

### server ---> peer    请求跃迁成功/失败
```javastript
{
    action: 'transition'
    success: boolean         //成功/失败
}
```


---fastmesh protocol--------------------------------

### server ---> peer        发送候选父节点给peer
```javastript
{
    action: 'parents'           
    nodes: Array<Object<peer_id:string, residual_bw:number>>
}
```

###  peer ---> server       请求候选父节点(需要在连接上信令后再发送)
```javastript
{
    action: 'get_parents'           
}
```

### peer ---> server    跃迁成功后通知ancestor成为其子节点
```javastript
{
    action: 'adopt'          
    to_peer_id: string
}
```

### server ---> peer    通知ancestor成为parentId子节点
```javastript
{
    action: 'adopt'          
    parent_id: string
    residual_bw: number                      
}
```

---bittorrent protocol--------------------------------

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
    report_span: number            //上报统计信息的时间间隔 
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
    source: number
    p2p: number
}
```
#### 返回
```javastript
{
                         
}
```

## fastmesh拓扑结构可视化协议

### 请求当前拓扑结构
```javastript
{
    action: "get_topology"
}
```

### 返回当前的拓扑结构
```javastript
{
    action: "topology"                   //刚建立连接时返回的整个拓扑结构
    totalstreams: number
    nodes: [
        {
            id: 1,
            parents: [{id:id1,substreams:2}, {id:id2,substreams:2}...]
            info: {
                ISP: string,
                country: string
                province: string
                city: string
            }
        },
        {
            id: 2,
            parents: [{id:id1,substreams:2}, {id:id2,substreams:2}...]
            info: {
                ISP: string
                country: string
                province: string
                city: string
            }
        }
    ]
}
```

### 新节点加入
```javastript
{
    action: "join"              
    node: {
        id: 3
        info: {
            ISP: string
            country: string
            province: string
            city: string
            ul_bw: number,
            substreams: number
        }
    }
}
```

### 旧节点离开
```javastript
{
    action: "leave",                   
    node: {
        id: 1
    }
}
```

### 建立连接
```javastript
{
    action: "connect",                   
    edge: {
        from: 1,                           //父节点
        to: 2,                             //子节点
        substreams: 2                      //子流数量
    }
}
```

### 断开连接
```javastript
{
    action: "disconnect",                   
    edge: {
        from: 1,                           //父节点
        to: 2,                             //子节点
    }
}
```

### 发送节点实时统计信息
```javascript
{
   action: "statistics"
   result: {
       source: number              
       p2p: number 
   } 
                   
}
```

### 获取实时统计信息
```javascript
{
    action: "get_stats"
}
```