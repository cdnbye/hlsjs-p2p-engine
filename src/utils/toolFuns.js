import URLToolkit from 'url-toolkit';

// 根据参数决定是否去掉ts的url的查询参数
export function handleTSUrl(url, matched = false) {
    if (!matched) {
        return url.split("?")[0];
    }
    return url;
}

/*
    fun: channelId generator
    streamId: 用于标识流地址的ID
    signalId: 用于标识信令地址的ID，在channelID加上这个可以防止不同信令服务器下的节点混在一起
 */
export function defaultChannelId(url, signalAddr, browserInfo = {}) {
    const streamParsed = URLToolkit.parseURL(url);
    const streamId = streamParsed.netLoc.substr(2) + streamParsed.path.split('.')[0];
    const signalId = URLToolkit.parseURL(signalAddr).netLoc.substr(2);
    return `${streamId}|${signalId}`;
}

export function tsPathChecker() {
    let lastSN = -1;
    let lastPath = '';
    return function (sn, path) {
        path = path.split('?')[0];
        let isOK = true;
        if (lastSN !== sn && lastPath === path) {
            isOK = false;
        }
        // if (lastSN !== sn && lastPath === path) {
        //     console.warn(`path of ${sn} equal to path of ${lastSN}`);
        // }
        lastSN = sn;
        lastPath = path;
        return isOK;
    }
}

export function noop() {
    return true;
}
