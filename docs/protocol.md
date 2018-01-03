## datachannel传输协议

### ts文件传输协议
- 方案一：从 https://github.com/tomcartwrightuk/socket.io-p2p-parser 得到启发，当开始传输某个ts文件时，先传输一个json，告诉peer接下来的二进制文件分几片传，peer接收到这个信息后开辟相应的内存空间（buffer），接收到指定片数的二进制数据后拼接起来，形成完整的ts文件。
```javastript
{
    attachments：number    //接下来传输几个二进制包
    event: string   //'KEEPALIVE','KEEPALIVE-ACK','BINARY','ERROR','LACK','REQUEST','CLOSE'等
    url: string    //ts文件的url（相对url）
    size: number    //二进制数据的总大小，可用于校验
}
```