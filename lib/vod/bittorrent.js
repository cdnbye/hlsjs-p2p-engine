/**
 * Created by xieting on 2018/3/26.
 */

import Tracker from './bt-tracker';
import FragLoader from './frag-loader';

let config = {
    announce: "http://127.0.0.1:8080",                               //tracker服务器地址
    neighbours: 4,                                                   //连接的节点数量
    urgentOffset: 3,                                                 //播放点的后多少个buffer为urgent
}

export {
    Tracker,
    FragLoader,
    config
}