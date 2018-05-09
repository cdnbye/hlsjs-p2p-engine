/**
 * Created by xieting on 2018/4/3.
 */

class Fetcher {
    constructor(key, room, baseUrl, info) {

        this.browserInfo = info;
        //-----------bt---------------------
        let queryStr = `?key=${window.encodeURIComponent(key)}&info_hash=${room}`;
        this.announceURL = baseUrl + '/announce/' + queryStr + `&browser=${info.browser}&device=${info.device}`;
        this.heartbeatURL = baseUrl + '/heartbeat/' + queryStr;
        this.getPeersURL = baseUrl + '/get_peers/' + queryStr;
        this.statsURL = baseUrl + '/stats/' + queryStr;

        //连接情况上报
        this.conns = 0;                                                 //连接的peer的增量
        this.failConns = 0;                                             //连接失败的peer的增量

        //流量上报
        this.cdnDownloaded = 0;
        this.p2pDownloaded = 0;

        //播放情况上报
        this.errsFragLoad = 0;                                      //数据下载错误数（包括错误和超时）
        this.errsBufStalled = 0;                                    //播放卡顿数
        this.errsInternalExpt = 0;                                 //插件内部错误

    }

    btAnnounce() {
        return new Promise((resolve, reject) => {
            fetch(this.announceURL).then(response => {
                return response.json()
            }).then(json => {
                this.peerId = json.peer_id;                            //保存peerId
                resolve(json);
            }).catch(err => {
                logger.error(`[fetcher] btAnnounce error ${err}`);
                reject(err)
            })
        })
    }

    btHeartbeat(interval) {
        this.heartbeater = window.setInterval(() => {
            fetch(this.heartbeatURL+`&peer_id=${this.peerId}`).then(response => {

            }).catch(err => {
                window.clearInterval(this.heartbeater);
                logger.error(`[fetcher] btHeartbeat error ${err}`);
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
                logger.error(`[fetcher] btGetPeers error ${err}`);
                reject(err)
            })
        })
    }

    increConns() {                                              //主动连接的负责报告(增量)
        this.conns ++;
    }

    decreConns() {
        this.conns --;
    }

    increFailConns() {
        this.failConns ++;
    }

    btStatsStart(interval) {
        this.statser = window.setInterval(() => {
            const body = {
                source:  Math.round(this.cdnDownloaded/1024),
                p2p:  Math.round(this.p2pDownloaded/1024)
            };
            if (this.conns !== 0) {
                body.conns = this.conns;
            }
            if (this.failConns > 0) {
                body.failConns = this.failConns;
            }
            if (this.errsFragLoad > 0) {
                body.errsFragLoad = this.errsFragLoad;
            }
            if (this.errsBufStalled > 0) {
                body.errsBufStalled = this.errsBufStalled;
            }
            if (this.errsInternalExpt > 0) {
                body.errsInternalExpt = this.errsInternalExpt;
            }
            fetch(this.statsURL+`&peer_id=${this.peerId}`, {
                method: 'POST',                                         // 指定是POST请求
                body: JSON.stringify(body)
            }).then(response => {
                if (response.ok) {
                    this.cdnDownloaded = 0;
                    this.p2pDownloaded = 0;
                    this.conns = 0;
                    this.failConns = 0;
                    this.errsFragLoad = 0;
                    this.errsBufStalled = 0;
                    this.errsInternalExpt = 0;
                }
            }).catch(err  => {
                logger.error(`[fetcher] stats upload error ${err}`);
                window.clearInterval(this.statser);
            })
        }, interval * 1000)

    }

    reportFlow(stats, p2p = true) {

        if (p2p) {
            this.p2pDownloaded += stats.total;
        } else {
            this.cdnDownloaded += stats.total;
        }
        // log(`cdnDownloaded ${this.cdnDownloaded} p2pDownloaded ${this.p2pDownloaded}`)
    }

    // reportError(errFragLoad = false, errBufStalled = false, errInternalExpt = false) {
    //     if (errFragLoad) this.errsFragLoad ++;
    //     if (errBufStalled) this.errsBufStalled ++;
    //     if (errInternalExpt) this.errsInternalExpt ++;
    // }

    destroy() {
        window.clearInterval(this.statser);
        window.clearInterval(this.heartbeater);
    }
}

export default Fetcher;