/**
 * Created by xieting on 2018/3/26.
 */

import Tracker from './bt-tracker';
import Loader from './bt-loader';

let config = {
    announce: "http://127.0.0.1:8088",                               //tracker服务器地址
    neighbours: 6,                                                   //连接的节点数量
    urgentOffset: 3,                                                 //播放点的后多少个buffer为urgent

};

export {
    Tracker,
    Loader as FragLoader,
    config
}