// 根据参数决定是否去掉ts的url的查询参数
export function handleTSUrl(url, matched = false) {
    if (!matched) {
        return url.split("?")[0];
    }
    return url;
}

// 函数节流
export function throttle(method, context, colddown = 15) {

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
