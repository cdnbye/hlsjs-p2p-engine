/**
 * Created by xieting on 2018/1/9.
 */

export default {

    //data-channel
    DC_SIGNAL: 'signal',
    DC_OPEN: 'open',
    DC_REQUEST: 'request',
    DC_REQUESTFAIL: 'request_fail',                    //当请求的数据找不到时触发
    DC_CLOSE: 'close',
    DC_RESPONSE: 'response',
    DC_ERROR: 'error',
    DC_BINARY: 'binary',

    //buffer-manager


    //loader-scheduler
    SEGMENT: 'segment',
    TRANSITION: "transition",                         //跃迁事件
    DISPLACE: 'displace'
}