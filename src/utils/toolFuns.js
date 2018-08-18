import URLToolkit from 'url-toolkit';

// 根据参数决定是否去掉ts的url的查询参数
export function handleTSUrl(url, matched = false) {
    if (!matched) {
        return url.split("?")[0];
    }
    return url;
}

// 函数节流，默认冷却时间30秒
export function throttle(method, context, colddown = 20) {

    var going = false;
    return function () {
        if (going) return;
        going = true;
        setTimeout(function(){
            method.call(context);
            going = false;
        }, colddown*1000);
    }
};

// channelId generator
export function defaultChannelId(url, browserInfo = {}) {
    const path = URLToolkit.parseURL(url).path.split('.')[0];
    return `${path}`;
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
