/**
 * Created by xieting on 2018/4/3.
 */
const log = console.warn;
class Fetcher {
    constructor(key, room, baseUrl) {

        //-----------bt---------------------
        let queryStr = `?key=${window.encodeURIComponent(key)}&info_hash=${room}`;
        this.announceURL = baseUrl + '/announce/' + queryStr;
        this.heartbeatURL = baseUrl + '/heartbeat/' + queryStr;
        this.getPeersURL = baseUrl + '/get_peers/' + queryStr;
        this.statsURL = baseUrl + '/stats/' + queryStr;

        this.conns = 0;                                            //连接的peer数量

        //流量上报
        this.cdnDownloaded = 0;
        this.p2pDownloaded = 0;
    }

    btAnnounce() {
        return new Promise((resolve, reject) => {
            fetch(this.announceURL).then(response => {
                return response.json()
            }).then(json => {
                this.peerId = json.peer_id;                            //保存peerId
                resolve(json);
            }).catch(err => {
                reject(err)
            })
        })
    }

    btHeartbeat(interval) {
        this.heartbeater = window.setInterval(() => {
            fetch(this.heartbeatURL+`&peer_id=${this.peerId}`).then(response => {

            }).catch(err => {

            })
        }, interval * 1000)

    }

    btGetPeers() {
        return new Promise((resolve, reject) => {
            fetch(this.getPeersURL+`&peer_id=${this.peerId}`).then(response => {
                return response.json()
            }).then(json => {
                resolve(json);
            }).catch(err => {
                reject(err)
            })
        })
    }

    btUpdateConns(n) {
        this.conns = n;
    }

    btStatsStart(interval) {
        this.statser = window.setInterval(() => {
            fetch(this.statsURL+`&peer_id=${this.peerId}`, {
                method: 'POST',                                         // 指定是POST请求
                body: JSON.stringify({
                    source:  Math.round(this.cdnDownloaded/1024),
                    p2p:  Math.round(this.p2pDownloaded/1024),
                    conns: this.conns
                })
            }).then(response => {
                if (response.ok) {
                    this.cdnDownloaded = 0;
                    this.p2pDownloaded = 0;
                }
            })
        }, interval * 1000)

    }

    reportFlow(stats, p2p = true) {

        if (p2p) {
            this.p2pDownloaded += stats.total;
        } else {
            this.cdnDownloaded += stats.total;
        }
        log(`cdnDownloaded ${this.cdnDownloaded} p2pDownloaded ${this.p2pDownloaded}`)
    }

    destroy() {
        window.clearInterval(this.statser);
        this.statser = null;
        window.clearInterval(this.heartbeater);
        this.heartbeater = null;
    }
}

export default Fetcher;