## datachannel传输协议

### ts文件传输协议
从 https://github.com/tomcartwrightuk/socket.io-p2p-parser 得到启发，当开始传输某个ts文件时，先传输一个json，告诉peer接下来的二进制文件分几片传，peer接收到这个信息后开辟相应的内存空间（buffer），接收到指定片数的二进制数据后拼接起来，形成完整的ts文件。

datachannel KEEPALIVE
```javastript       
{
    event: 'KEEPALIVE'
    current:        //目前最新缓存的序号
}
```

datachannel KEEPALIVE-ACK
```javastript       
{
    event: 'KEEPALIVE-ACK'
    current:        //目前最新缓存的序号
}
```

请求数据
```javastript       
{
    event: 'REQUEST'   
    url: string             //ts数据的url（相对url）
    sn: number              //ts数据的播放序号
}
```

返回二进制数据头
```javastript       
{
    event: 'BINARY'   
    attachments：number    //接下来传输几个二进制包
    url: string    //ts文件的url（相对url）
    sn: number         //ts数据的播放序号
    size: number    //二进制数据的总大小，可用于校验
    current:        //目前最新缓存的序号
}
```

未找到请求数据
```javastript     
{
    event: 'LACK'  
    url: string    //ts文件的url（相对url）
    sn: number         //ts数据的播放序号
}
```

关闭datachannel
```javastript    
{
    event: 'CLOSE' 
}
```

datachannel 发生错误
```javastript       
{
    event: 'ERROR'  
}
```

## websocket传输协议

### peer ---> server    进入频道请求
```javastript
{
    action: 'enter'                
    channel: string               //频道标识，目前是m3u0的url  
    browser:   string              //浏览器名
    device: string               //mobile 或 PC
    os: string                    //操作系统          
}
```

### server ---> peer    允许进入频道
```javastript
{
    action: 'accept'  
    live: boolean                   //直播或点播    
    peer_id: string                //本节点唯一标识
}   
```

### peer ---> server    离开频道请求
   ```javastript
   {
       action: 'leave'             
   }
   ```

### peer ---> server    发送信令给peer
```javastript
{
    action: 'signal'               
    to_peer_id: string            //对等端的Id
    data: string                  //需要传送的数据
}
```

### peer ---> server    datachannel建立成功
```javastript
{
    action: 'dc_opened'                
    dc_id: string            //datachannel的Id
}
```

### peer ---> server    datachannel关闭
```javastript
{
    action: 'dc_closed'                
    dc_id: string            //datachannel的Id
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

### server ---> peer        发送信令给peer
```javastript
{
    action: 'signal'           
    from_peer_id: string            //对等端的Id
    data: string                    //需要传送的数据
}
```

### peer ---> server    定时上报统计信息
```javastript
{
    action: 'statistics'            
    level:   number              //平均level，用于调度
    cdn: number                  //cdn下载的流量大小（单位KB）
    p2p: number                  //p2p下载的流量大小（单位KB）
}
```

## server data model （live）

### Peer model
```javastript
{
    peerId: string
    parents: Map<peerId, Peer>
    children: Map<peerId, Peer>
    parentNum: number
    childNum: number
    info: {
        browser:   string              //浏览器名
        device: string                //mobile 或 PC
        os: string                    //操作系统
        ISP: string                   //运营商
        province: string                //省份
        IP: string                   
    }
    CDN: number                       //cdn下载的数据量（KB）
    P2P: number                       //p2p下载的数据量（KB）
    level: number                     //平均level，用于调度
    class: number                     //所属阶层（0，1，2，3……）
    upBW: number                      //上行带宽
}
```

### Channel model
```javastript
{
    ID: string
    nodes: Map<peerId, Peer>
    filterClass:   //class-->ISP-->Prov-->level
    CDN: number                       //cdn下载的数据量（KB）
    P2P: number                       //p2p下载的数据量（KB）
    host: string                      //域名
    type: string                      //"live", "vod"
}
```