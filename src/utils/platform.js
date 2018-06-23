
var os = {
    //网络类型 wifi 4g 3g 2g unknown or ''
    getNetType: function () {
        return ((new RegExp('nettype\\/(\\w*)').exec(_getUA()) || [, ''])[1]).toLowerCase();
    },
    //获取设备类型
    getPlatform: function () {
        if (os.isAndroid()) {
            return 'android';
        } else if (os.isIOS()) {
            return 'iOS';
        } else {
            return 'PC';
        }
    },
    isX5: function () {
        return this.isAndroid() && /\s(TBS|X5Core)\/[\w\.\-]+/i.test(_getUA());
    },
    isPC: function () {
        return !_toNum(_platform('os ')) && !_toNum(_platform('android[/ ]'));
    },
    isIOS: function () {
        return _toNum(_platform('os '));
    },
    isAndroid: function () {
        return _toNum(_platform('android[/ ]'));
    },
    isSafari: function () {
        return this.isIOS() && /^((?!chrome|android).)*safari/i.test(_getUA());
    },
};

function _getUA() {
    return navigator.userAgent.toLowerCase();
}

function _platform(os) {
    var ver = ('' + (new RegExp(os + '(\\d+((\\.|_)\\d+)*)').exec(_getUA()) || [, 0])[1]);
    // undefined < 3 === false, but null < 3 === true
    return ver || undefined;
}

function _toNum(str) {
    return parseFloat((str || "").replace(/\_/g, '.')) || 0;
}

module.exports = os;
