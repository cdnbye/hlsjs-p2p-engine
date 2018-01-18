/**
 * Created by xieting on 2018/1/18.
 */

/*
 {
 ID: string
 nodes: Map<peerId, Peer>
 filterClass:   //class-->ISP-->Prov-->level
 CDN: number                       //cdn下载的数据量（KB）
 P2P: number                       //p2p下载的数据量（KB）
 host: string                      //域名
 type: string                      //"live", "vod"
 }
 */

class Channel {
    constructor(channelId, playType) {

        this.ID = channelId;
        this.type = playType;
        this.CDN = 0;
        this.P2P = 0;

        this.nodes = new Map();
    }

    addPeer(peer) {
        this.nodes.set(peer.peerId, peer);
    }

    get peerNum() {
        return this.nodes.size;
    }

    getPeer(peerId) {
        return this.nodes.get(peerId);
    }

    removePeer(peerId) {
        return this.nodes.delete(peerId);
    }

    hasPeer(peerId) {
        return this.nodes.has(peerId);
    }

    addTraffice(cdn, p2p) {
        this.CDN += cdn;
        this.P2P += p2p;
    }
}

module.exports =  Channel;
