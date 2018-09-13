import URLToolkit from 'url-toolkit';

// 根据参数决定是否去掉ts的url的查询参数
export function handleTSUrl(url, config) {
    const matched = config.tsStrictMatched || false;
    if(config.pathModified) {
	    	const action = config.pathModified.action;
	        if(action && action == "remove") {
			const _index = config.pathModified.index;
			if(_index) {
    				let _url = url.split('/').filter(function(e,i){return i!=_index}).join('/');
				url=_url;
			}
		}
    }

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
export function defaultChannelId(url, browserInfo = {}, config = {}) {
    const streamParsed = URLToolkit.parseURL(url);
    let _path =  streamParsed.path;
    if(config.pathModified) {
                const action = config.pathModified.action;
                if(action && action == "remove") {
                        const _index = config.pathModified.index;
			if(_index) {
                        	let _url = _path.split('/').filter(function(e,i){return i!=_index}).join('/');
                        	_path=_url;
			}
                }
    }


    const streamId = streamParsed.netLoc.substr(2) + _path.split('.')[0];
    return `${streamId}`;
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
