
import datachannel from './cdnbye-core/src/datachannel';
import events from './cdnbye-core/src/events';
import fetcher from './cdnbye-core/src/fetcher';
import  getBrowserRTC from 'get-browser-rtc';

var Buffer = require('buffer/').Buffer;

export {
    datachannel as DataChannel,
    events as Events,
    fetcher as Fetcher,
    Buffer,
    getBrowserRTC
}
