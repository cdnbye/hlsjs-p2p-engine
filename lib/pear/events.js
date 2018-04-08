/**
 * Created by xieting on 2018/4/3.
 */

export default {
    //data-channel
    DC_PING: 'PING',
    DC_PONG: 'PONG',
    DC_SIGNAL: 'SIGNAL',
    DC_OPEN: 'OPEN',
    DC_REQUEST: 'REQUEST',
    DC_REQUESTFAIL: 'REQUEST_FAIL',                    //当请求的数据找不到时触发
    DC_CLOSE: 'CLOSE',
    DC_RESPONSE: 'RESPONSE',
    DC_ERROR: 'ERROR',
    DC_PIECE: "PIECE",
    DC_TIMEOUT: "TIMEOUT",
    DC_PIECE_ACK: "PIECE_ACK",
    //---------------------------live---------------------------------------------------------
    DC_TRANSITION: 'TRANSITION',
    DC_GRANT: 'GRANT',
    DC_LACK: "LACK",
    DC_DISPLACE: "DISPLACE",
    //---------------------------vod---------------------------------------------------------
    DC_BITFIELD: "BITFIELD",
    DC_CHOKE: "CHOKE",
    DC_UNCHOKE: "UNCHOKE",
    DC_INTERESTED: "INTERESTED",
    DC_NOTINTERESTED: "NOT_INTERESTED",
    DC_HAVE: "HAVE",
}