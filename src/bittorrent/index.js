
import Tracker from './bt-tracker';
import Loader from './bt-loader';

let config = {
    announce: "https://api.cdnbye.com/v1",                           // tracker服务器地址
    urgentOffset: 3,                                                 // 播放点的后多少个buffer为urgent

};

export {
    Tracker,
    Loader as FragLoader,
    config
}