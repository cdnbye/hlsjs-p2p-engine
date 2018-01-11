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
    peer_id: string                //唯一标识
    isLive: boolean                //直播或点播
}
```

### peer ---> server    允许进入频道
```javastript
{
    action: 'accept'  
    live: boolean                   //直播或点播                
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
    to_peer_id: string            //对等端的Id
}
```

### peer ---> server    datachannel建立失败
```javastript
{
    action: 'dc_failed'            
    to_peer_id: string            //对等端的Id
}
```


### server ---> peer
```javastript
{
    action: string                  //'accept':允许进入频道, 'reject':拒绝进入频道, 'signal':peer发送的信令, 'connect':建立datachannel请求, 'disconnect':断开datachannel请求
    initiator: boolean              //是否主动发起连接
    from_peer_id: string            //对等端的Id
    data: string                    //需要传送的数据
}
```