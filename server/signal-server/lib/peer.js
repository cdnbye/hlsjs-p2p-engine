/**
 * Created by xieting on 2018/1/18.
 */

/*
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
 */

class Peer {

    constructor(peerId, websocket, {browser = 'unknown', device = 'unknown', os = 'unknown'}) {

        this.peerId = peerId;
        this.websocket = websocket;
        this.browser = browser;
        this.device = device;
        this.os = os;

        this.class = 0;
        this.parentNum = 0;
        this.childNum = 0;
        this.parents = [];
        this.children = [];

        this.level = 0;

        console.log(`peerId ${peerId} browser ${browser} device ${device} os ${os}`);
    }

    send(msg) {
        this.websocket.sendUTF(JSON.stringify(msg));
    }
}

module.exports = Peer;