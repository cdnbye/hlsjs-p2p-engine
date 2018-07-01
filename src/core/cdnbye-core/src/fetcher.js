/**
 * Created by xieting on 2018/4/3.
 */

class Fetcher {
    constructor(engine, key, room, baseUrl, info) {

        this.engine = engine;
        //-----------bt---------------------
        let queryStr = `?key=${window.encodeURIComponent(key)}&info_hash=${room}`;
        this.announceURL = baseUrl + '/announce/' + queryStr + makeQueryStr(info);
        this.heartbeatURL = baseUrl + '/heartbeat/' + queryStr;
        this.getPeersURL = baseUrl + '/get_peers/' + queryStr;
        this.statsURL = baseUrl + '/stats/' + queryStr;

        //上报参数
        this.limit = 10*1024;                              //上报流量的阈值（单位：KB）

        //连接情况上报
        this.conns = 0;                                                 //连接的peer的增量
        this.failConns = 0;                                             //连接失败的peer的增量

        //流量上报(单位：KB)
        this.totalHTTPDownloaded = 0;         //HTTP累积量
        this.totalP2PDownloaded = 0;          //P2P累积量
        this.httpDownloaded = 0;
        this.p2pDownloaded = 0;

        //播放情况上报
        this.errsFragLoad = 0;                                      //数据下载错误数（包括错误和超时）
        this.errsBufStalled = 0;                                    //播放卡顿数
        this.errsInternalExpt = 0;                                 //插件内部错误

    }

    btAnnounce() {
        const { logger } = this.engine;
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
        const { logger } = this.engine;
        this.heartbeater = window.setInterval(() => {
            fetch(this.heartbeatURL+`&peer_id=${this.peerId}`).then(response => {

            }).catch(err => {
                window.clearInterval(this.heartbeater);
                logger.error(`[fetcher] btHeartbeat error ${err}`);
            })
        }, interval * 1000)

    }

    btGetPeers() {
        const { logger } = this.engine;
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

    btStatsStart(limit) {
        this.limit = limit*1024;              //MB转KB

    }

    reportFlow(stats, p2p = true) {
        const flow =  Math.round(stats.total/1024)
        if (p2p) {
            this.p2pDownloaded += flow;
            this.totalP2PDownloaded += flow;
        } else {
            this.httpDownloaded += flow;
            this.totalHTTPDownloaded += flow;
        }
        this.engine.emit('stats', {totalHTTPDownloaded: this.totalHTTPDownloaded, totalP2PDownloaded: this.totalP2PDownloaded});
        this._checkFlowLimit();
        // log(`cdnDownloaded ${this.cdnDownloaded} p2pDownloaded ${this.p2pDownloaded}`)
    }

    // reportError(errFragLoad = false, errBufStalled = false, errInternalExpt = false) {
    //     if (errFragLoad) this.errsFragLoad ++;
    //     if (errBufStalled) this.errsBufStalled ++;
    //     if (errInternalExpt) this.errsInternalExpt ++;
    // }

    destroy() {
        window.clearInterval(this.heartbeater);
    }

    _checkFlowLimit() {                            //检查是否需要上报流量
        const { logger } = this.engine;
        if (this.p2pDownloaded >= this.limit || this.httpDownloaded >= this.limit) {         //只有流量达到阈值才上报(单位：KB)
            const body = {
                source:  Math.round(this.httpDownloaded),    //上报以KB为单位
                p2p:  Math.round(this.p2pDownloaded)
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
            logger.info(`reporting flow p2p ${this.p2pDownloaded} http ${this.httpDownloaded}`);
            fetch(this.statsURL+`&peer_id=${this.peerId}`, {
                method: 'POST',                                         // 指定是POST请求
                body: JSON.stringify(body)
            }).then(response => {
                if (response.ok) {
                    logger.info(`sucessfully report flow`);
                    this.httpDownloaded = 0;
                    this.p2pDownloaded = 0;
                    this.conns = 0;
                    this.failConns = 0;
                    this.errsFragLoad = 0;
                    this.errsBufStalled = 0;
                    this.errsInternalExpt = 0;
                }
            }).catch(err  => {
                logger.error(`[fetcher] stats upload error ${err}`);
            })
        }
    }
}

function makeQueryStr(obj){
    var str = "&";
    for(var prop in obj){
        str += `${prop}=${obj[prop]}&`;
    }
    return str;
}

export default Fetcher;