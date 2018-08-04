import URLToolkit from 'url-toolkit';

// 根据参数决定是否去掉ts的url的查询参数
export function handleTSUrl(url, matched = false) {
    if (!matched) {
        return url.split("?")[0];
    }
    return url;
}

// 函数节流，默认冷却时间30秒
export function throttle(method, context, colddown = 30) {

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
export function defaultChannelId(url, protocol, browserInfo = {}) {
    const path = URLToolkit.parseURL(url).path.split('.')[0];
    return `${path}[${protocol}]`;
}
