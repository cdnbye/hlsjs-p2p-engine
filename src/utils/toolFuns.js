import URLToolkit from 'url-toolkit';

// 获取segment Id的函数
export function defaultSegmentId(streamLevel, segmentSn, segmentUrl) {
    return `${streamLevel}-${segmentSn}`
    // return `${streamLevel}-${segmentUrl}`
}

/*
    fun: channelId generator
    streamId: 用于标识流地址的ID
    signalId: 用于标识信令地址的ID，在channelID加上这个可以防止不同信令服务器下的节点混在一起
 */
export function defaultChannelId(url, browserInfo = {}) {
    const streamParsed = URLToolkit.parseURL(url);
    const streamId = streamParsed.netLoc.substr(2) + streamParsed.path.split('.')[0];
    return `${streamId}`;
}

export function noop() {
    return true;
}

export function getQueryParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null && r[2] !== '') return r[2].toString();
    return '';
}

export function isBlockType(url, blackList) {
    const urlObj = URLToolkit.parseURL(url);
    const mediaType = urlObj.path.split('.')[1];
    if (blackList.indexOf(mediaType) !== -1) {
        return true;
    }
    return false;
}
