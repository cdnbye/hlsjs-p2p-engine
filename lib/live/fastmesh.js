/**
 * Created by xieting on 2018/3/26.
 */

import RPClient from './rp-client';
import HybridLoader from './hybrid-loader';

let config = {
    wsSchedulerAddr: 'ws://120.78.168.126:3389',            //调度服务器地址
    transitionEnabled: true,                    //是否允许节点自动跃迁
    transitionCheckInterval: 30,                //跃迁检查时间间隔
    transitionTTL: 2,                           //跃迁的最大跳数
    transitionWaitTime: 5,                      //跃迁等待Grant响应的时间

    defaultUploadBW: 1024*1024*4/8,             //总上行带宽默认4Mbps
    maxTransitionTries: 1,                      //最大跃迁次数（跃迁失败也算一次）
    maxGetParentsTries: 3,                      //获取父节点的最大尝试次数(不包含ws连上后的请求)

    defaultSubstreams: 3,                       //默认子流数量
}

export {
    RPClient,
    HybridLoader,
    config
}
