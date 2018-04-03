/**
 * Created by xieting on 2018/4/3.
 */

class Fetcher {
    constructor(key, room, baseUrl) {

        let queryStr = `?key=${window.encodeURIComponent(key)}&info_hash=${room}`;
        this.announceURL = baseUrl + '/announce/' + queryStr;
        this.heartbeatURL = baseUrl + '/heartbeat/' + queryStr;
        this.getPeersURL = baseUrl + '/get_peers/' + queryStr;
        this.statsURL = baseUrl + '/stats/' + queryStr;
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

    btHeartbeat() {
        fetch(this.heartbeatURL+`&peer_id=${this.peerId}`).then(response => {

        }).catch(err => {

        })
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
}

export default Fetcher;