(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["P2PEngine"] = factory();
	else
		root["P2PEngine"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cdnbyeCore = __webpack_require__(8);

Object.keys(_cdnbyeCore).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _cdnbyeCore[key];
    }
  });
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.config = exports.FragLoader = exports.Tracker = undefined;

var _btTracker = __webpack_require__(6);

var _btTracker2 = _interopRequireDefault(_btTracker);

var _btLoader = __webpack_require__(10);

var _btLoader2 = _interopRequireDefault(_btLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {
    announce: "https://tracker.cdnbye.com", //tracker服务器地址
    neighbours: 12, //连接的节点数量
    urgentOffset: 3 //播放点的后多少个buffer为urgent

};

exports.Tracker = _btTracker2.default;
exports.FragLoader = _btLoader2.default;
exports.config = config;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

;
;
;
var isWebSocket = function (constructor) {
    return constructor && constructor.CLOSING === 2;
};
var isGlobalWebSocket = function () {
    return typeof WebSocket !== 'undefined' && isWebSocket(WebSocket);
};
var getDefaultOptions = function () { return ({
    constructor: isGlobalWebSocket() ? WebSocket : null,
    maxReconnectionDelay: 10000,
    minReconnectionDelay: 1500,
    reconnectionDelayGrowFactor: 1.3,
    connectionTimeout: 4000,
    maxRetries: Infinity,
    debug: false,
}); };
var bypassProperty = function (src, dst, name) {
    Object.defineProperty(dst, name, {
        get: function () { return src[name]; },
        set: function (value) { src[name] = value; },
        enumerable: true,
        configurable: true,
    });
};
var initReconnectionDelay = function (config) {
    return (config.minReconnectionDelay + Math.random() * config.minReconnectionDelay);
};
var updateReconnectionDelay = function (config, previousDelay) {
    var newDelay = previousDelay * config.reconnectionDelayGrowFactor;
    return (newDelay > config.maxReconnectionDelay)
        ? config.maxReconnectionDelay
        : newDelay;
};
var LEVEL_0_EVENTS = ['onopen', 'onclose', 'onmessage', 'onerror'];
var reassignEventListeners = function (ws, oldWs, listeners) {
    Object.keys(listeners).forEach(function (type) {
        listeners[type].forEach(function (_a) {
            var listener = _a[0], options = _a[1];
            ws.addEventListener(type, listener, options);
        });
    });
    if (oldWs) {
        LEVEL_0_EVENTS.forEach(function (name) {
            ws[name] = oldWs[name];
        });
    }
};
var ReconnectingWebsocket = function (url, protocols, options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    var ws;
    var connectingTimeout;
    var reconnectDelay = 0;
    var retriesCount = 0;
    var shouldRetry = true;
    var savedOnClose = null;
    var listeners = {};
    // require new to construct
    if (!(this instanceof ReconnectingWebsocket)) {
        throw new TypeError("Failed to construct 'ReconnectingWebSocket': Please use the 'new' operator");
    }
    // Set config. Not using `Object.assign` because of IE11
    var config = getDefaultOptions();
    Object.keys(config)
        .filter(function (key) { return options.hasOwnProperty(key); })
        .forEach(function (key) { return config[key] = options[key]; });
    if (!isWebSocket(config.constructor)) {
        throw new TypeError('Invalid WebSocket constructor. Set `options.constructor`');
    }
    var log = config.debug ? function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        return console.log.apply(console, ['RWS:'].concat(params));
    } : function () { };
    /**
     * Not using dispatchEvent, otherwise we must use a DOM Event object
     * Deferred because we want to handle the close event before this
     */
    var emitError = function (code, msg) { return setTimeout(function () {
        var err = new Error(msg);
        err.code = code;
        if (Array.isArray(listeners.error)) {
            listeners.error.forEach(function (_a) {
                var fn = _a[0];
                return fn(err);
            });
        }
        if (ws.onerror) {
            ws.onerror(err);
        }
    }, 0); };
    var handleClose = function () {
        log('handleClose', { shouldRetry: shouldRetry });
        retriesCount++;
        log('retries count:', retriesCount);
        if (retriesCount > config.maxRetries) {
            emitError('EHOSTDOWN', 'Too many failed connection attempts');
            return;
        }
        if (!reconnectDelay) {
            reconnectDelay = initReconnectionDelay(config);
        }
        else {
            reconnectDelay = updateReconnectionDelay(config, reconnectDelay);
        }
        log('handleClose - reconnectDelay:', reconnectDelay);
        if (shouldRetry) {
            setTimeout(connect, reconnectDelay);
        }
    };
    var connect = function () {
        if (!shouldRetry) {
            return;
        }
        log('connect');
        var oldWs = ws;
        var wsUrl = (typeof url === 'function') ? url() : url;
        ws = new config.constructor(wsUrl, protocols);
        connectingTimeout = setTimeout(function () {
            log('timeout');
            ws.close();
            emitError('ETIMEDOUT', 'Connection timeout');
        }, config.connectionTimeout);
        log('bypass properties');
        for (var key in ws) {
            // @todo move to constant
            if (['addEventListener', 'removeEventListener', 'close', 'send'].indexOf(key) < 0) {
                bypassProperty(ws, _this, key);
            }
        }
        ws.addEventListener('open', function () {
            clearTimeout(connectingTimeout);
            log('open');
            reconnectDelay = initReconnectionDelay(config);
            log('reconnectDelay:', reconnectDelay);
            retriesCount = 0;
        });
        ws.addEventListener('close', handleClose);
        reassignEventListeners(ws, oldWs, listeners);
        // because when closing with fastClose=true, it is saved and set to null to avoid double calls
        ws.onclose = ws.onclose || savedOnClose;
        savedOnClose = null;
    };
    log('init');
    connect();
    this.close = function (code, reason, _a) {
        if (code === void 0) { code = 1000; }
        if (reason === void 0) { reason = ''; }
        var _b = _a === void 0 ? {} : _a, _c = _b.keepClosed, keepClosed = _c === void 0 ? false : _c, _d = _b.fastClose, fastClose = _d === void 0 ? true : _d, _e = _b.delay, delay = _e === void 0 ? 0 : _e;
        log('close - params:', { reason: reason, keepClosed: keepClosed, fastClose: fastClose, delay: delay, retriesCount: retriesCount, maxRetries: config.maxRetries });
        shouldRetry = !keepClosed && retriesCount <= config.maxRetries;
        if (delay) {
            reconnectDelay = delay;
        }
        ws.close(code, reason);
        if (fastClose) {
            var fakeCloseEvent_1 = {
                code: code,
                reason: reason,
                wasClean: true,
            };
            // execute close listeners soon with a fake closeEvent
            // and remove them from the WS instance so they
            // don't get fired on the real close.
            handleClose();
            ws.removeEventListener('close', handleClose);
            // run and remove level2
            if (Array.isArray(listeners.close)) {
                listeners.close.forEach(function (_a) {
                    var listener = _a[0], options = _a[1];
                    listener(fakeCloseEvent_1);
                    ws.removeEventListener('close', listener, options);
                });
            }
            // run and remove level0
            if (ws.onclose) {
                savedOnClose = ws.onclose;
                ws.onclose(fakeCloseEvent_1);
                ws.onclose = null;
            }
        }
    };
    this.send = function (data) {
        ws.send(data);
    };
    this.addEventListener = function (type, listener, options) {
        if (Array.isArray(listeners[type])) {
            if (!listeners[type].some(function (_a) {
                var l = _a[0];
                return l === listener;
            })) {
                listeners[type].push([listener, options]);
            }
        }
        else {
            listeners[type] = [[listener, options]];
        }
        ws.addEventListener(type, listener, options);
    };
    this.removeEventListener = function (type, listener, options) {
        if (Array.isArray(listeners[type])) {
            listeners[type] = listeners[type].filter(function (_a) {
                var l = _a[0];
                return l !== listener;
            });
        }
        ws.removeEventListener(type, listener, options);
    };
};
module.exports = ReconnectingWebsocket;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(0);

var _events2 = _interopRequireDefault(_events);

var _config = __webpack_require__(5);

var _config2 = _interopRequireDefault(_config);

var _bittorrent = __webpack_require__(2);

var _bufferManager = __webpack_require__(11);

var _bufferManager2 = _interopRequireDefault(_bufferManager);

var _uaParserJs = __webpack_require__(12);

var _uaParserJs2 = _interopRequireDefault(_uaParserJs);

var _cdnbyeCore = __webpack_require__(1);

var _logger = __webpack_require__(14);

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var uaParserResult = new _uaParserJs2.default().getResult();
// let logger;

var P2PEngine = function (_EventEmitter) {
    _inherits(P2PEngine, _EventEmitter);

    _createClass(P2PEngine, null, [{
        key: 'Events',
        get: function get() {
            return _cdnbyeCore.Events;
        }
    }, {
        key: 'uaParserResult',
        get: function get() {
            return uaParserResult;
        }
    }]);

    function P2PEngine(hlsjs, p2pConfig) {
        _classCallCheck(this, P2PEngine);

        var _this = _possibleConstructorReturn(this, (P2PEngine.__proto__ || Object.getPrototypeOf(P2PEngine)).call(this));

        _this.config = Object.assign({}, _config2.default, p2pConfig);
        _this.hlsjs = hlsjs;
        _this.p2pEnabled = _this.config.disableP2P === false ? false : true; //默认开启P2P

        hlsjs.config.currLoaded = hlsjs.config.currPlay = 0;

        var onLevelLoaded = function onLevelLoaded(event, data) {

            var isLive = data.details.live;
            _this.config.live = isLive;
            var channel = hlsjs.url.split('?')[0];

            //初始化logger
            var logger = new _logger2.default(_this.config, channel);
            _this.hlsjs.config.logger = _this.logger = logger;

            _this._init(channel);

            hlsjs.off(hlsjs.constructor.Events.LEVEL_LOADED, onLevelLoaded);
        };

        hlsjs.on(hlsjs.constructor.Events.LEVEL_LOADED, onLevelLoaded);

        //streaming rate
        // this.streamingRate = 0;                        //单位bps
        // this.fragLoadedCounter = 0;
        return _this;
    }

    _createClass(P2PEngine, [{
        key: '_init',
        value: function _init(channel) {
            var _this2 = this;

            var logger = this.logger;
            //上传浏览器信息

            var browserInfo = {
                browser: uaParserResult.browser.name,
                device: uaParserResult.device.type === 'mobile' ? 'mobile' : 'PC',
                os: uaParserResult.os.name,
                host: window.location.host
            };

            this.hlsjs.config.p2pEnabled = this.p2pEnabled;
            //实例化BufferManager
            this.bufMgr = new _bufferManager2.default(this, this.config);
            this.hlsjs.config.bufMgr = this.bufMgr;

            //实例化Fetcher
            var fetcher = new _cdnbyeCore.Fetcher(this, this.config.key, window.encodeURIComponent(channel), this.config.announce, browserInfo);
            this.fetcher = fetcher;
            //实例化tracker服务器
            this.signaler = new _bittorrent.Tracker(this, fetcher, this.config);
            this.signaler.scheduler.bufferManager = this.bufMgr;
            //替换fLoader
            this.hlsjs.config.fLoader = _bittorrent.FragLoader;
            //向fLoader导入scheduler
            this.hlsjs.config.scheduler = this.signaler.scheduler;
            //在fLoader中使用fetcher
            this.hlsjs.config.fetcher = fetcher;

            this.hlsjs.on(this.hlsjs.constructor.Events.FRAG_LOADING, function (id, data) {
                // log('FRAG_LOADING: ' + JSON.stringify(data.frag));
                logger.debug('FRAG_LOADING: ' + data.frag.sn);
                _this2.signaler.currentLoadingSN = data.frag.sn;
            });

            this.signalTried = false; //防止重复连接ws
            this.hlsjs.on(this.hlsjs.constructor.Events.FRAG_LOADED, function (id, data) {
                var sn = data.frag.sn;
                _this2.hlsjs.config.currLoaded = sn;
                _this2.signaler.currentLoadedSN = sn; //用于BT算法
                _this2.hlsjs.config.currLoadedDuration = data.frag.duration;
                var bitrate = Math.round(data.frag.loaded * 8 / data.frag.duration);
                if (!_this2.signalTried && !_this2.signaler.connected && _this2.config.p2pEnabled) {

                    _this2.signaler.scheduler.bitrate = bitrate;
                    logger.info('FRAG_LOADED bitrate ' + bitrate);

                    _this2.signaler.resumeP2P();
                    _this2.signalTried = true;
                }
                // this.streamingRate = (this.streamingRate*this.fragLoadedCounter + bitrate)/(++this.fragLoadedCounter);
                // this.signaler.scheduler.streamingRate = Math.floor(this.streamingRate);
                if (!data.frag.loadByHTTP) {
                    data.frag.loadByP2P = false;
                    data.frag.loadByHTTP = true;
                }
            });

            this.hlsjs.on(this.hlsjs.constructor.Events.FRAG_CHANGED, function (id, data) {
                // log('FRAG_CHANGED: '+JSON.stringify(data.frag, null, 2));
                logger.debug('FRAG_CHANGED: ' + data.frag.sn);
                var sn = data.frag.sn;
                _this2.hlsjs.config.currPlay = sn;
                _this2.signaler.currentPlaySN = sn;
            });

            this.hlsjs.on(this.hlsjs.constructor.Events.ERROR, function (event, data) {
                logger.error('errorType ' + data.type + ' details ' + data.details + ' errorFatal ' + data.fatal);
                var errDetails = _this2.hlsjs.constructor.ErrorDetails;
                switch (data.details) {
                    case errDetails.FRAG_LOAD_ERROR:
                    case errDetails.FRAG_LOAD_TIMEOUT:
                        _this2.fetcher.errsFragLoad++;
                        break;
                    case errDetails.BUFFER_STALLED_ERROR:
                        _this2.fetcher.errsBufStalled++;
                        break;
                    case errDetails.INTERNAL_EXCEPTION:
                        _this2.fetcher.errsInternalExpt++;
                        break;
                    default:
                }
            });

            this.hlsjs.on(this.hlsjs.constructor.Events.DESTROYING, function () {
                // log('DESTROYING: '+JSON.stringify(frag));
                _this2.signaler.destroy();
                _this2.signaler = null;
            });
        }
    }, {
        key: 'disableP2P',
        value: function disableP2P() {
            //停止p2p
            var logger = this.logger;

            logger.warn('disableP2P');
            if (this.p2pEnabled) {
                this.p2pEnabled = false;
                this.config.p2pEnabled = this.hlsjs.config.p2pEnabled = this.p2pEnabled;
                if (this.signaler) {
                    this.signaler.stopP2P();
                }
            }
        }
    }, {
        key: 'enableP2P',
        value: function enableP2P() {
            //在停止的情况下重新启动P2P
            var logger = this.logger;

            logger.warn('enableP2P');
            if (!this.p2pEnabled) {
                this.p2pEnabled = true;
                this.config.p2pEnabled = this.hlsjs.config.p2pEnabled = this.p2pEnabled;
                if (this.signaler) {
                    this.signaler.resumeP2P();
                }
            }
        }
    }]);

    return P2PEngine;
}(_events2.default);

P2PEngine.WEBRTC_SUPPORT = !!(0, _cdnbyeCore.getBrowserRTC)();

P2PEngine.version = "0.1.2";

exports.default = P2PEngine;
module.exports = exports['default'];

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _bittorrent = __webpack_require__(2);

//时间单位统一为秒
var defaultP2PConfig = _extends({
    key: 'free', //连接tracker服务器的API key

    wsSignalerAddr: 'wss://signal.cdnbye.com/wss', //信令服务器地址
    wsMaxRetries: 3, //发送数据重试次数
    wsReconnectInterval: 5, //websocket重连时间间隔

    p2pEnabled: true, //是否开启P2P，默认true

    dcRequestTimeout: 3, //datachannel接收二进制数据的超时时间
    dcUploadTimeout: 3, //datachannel上传二进制数据的超时时间
    dcPings: 5, //datachannel发送ping数据包的数量
    dcTolerance: 4, //请求超时或错误多少次淘汰该peer

    packetSize: 16 * 1024, //每次通过datachannel发送的包的大小
    maxBufSize: 1024 * 1024 * 50, //p2p缓存的最大数据量
    loadTimeout: 5, //p2p下载的超时时间

    enableLogUpload: false, //上传log到服务器，默认true
    logUploadAddr: "wss://api.cdnbye.com/trace", //log上传地址
    logUploadLevel: 'warn', //log上传level，分为debug、info、warn、error、none，默认warn
    logLevel: 'none' }, _bittorrent.config);

// let p2pConfig;
//
// if (__EXCLUDE_LIVE__) {
//     p2pConfig = Object.assign(defaultP2PConfig, vodConfig);
// } else if (__EXCLUDE_VOD__) {
//     p2pConfig = Object.assign(defaultP2PConfig, liveConfig);
// } else {
//     p2pConfig = Object.assign(defaultP2PConfig, liveConfig, vodConfig);
// }


exports.default = defaultP2PConfig;
module.exports = exports['default'];

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(0);

var _events2 = _interopRequireDefault(_events);

var _btScheduler = __webpack_require__(7);

var _btScheduler2 = _interopRequireDefault(_btScheduler);

var _signalClient = __webpack_require__(9);

var _signalClient2 = _interopRequireDefault(_signalClient);

var _cdnbyeCore = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BTTracker = function (_EventEmitter) {
    _inherits(BTTracker, _EventEmitter);

    function BTTracker(engine, fetcher, config) {
        _classCallCheck(this, BTTracker);

        var _this = _possibleConstructorReturn(this, (BTTracker.__proto__ || Object.getPrototypeOf(BTTracker)).call(this));

        _this.engine = engine;
        _this.config = config;
        _this.connected = false;
        _this.scheduler = new _btScheduler2.default(engine, config);
        _this.DCMap = new Map(); //{key: remotePeerId, value: DataChannnel} 目前已经建立连接或正在建立连接的dc
        _this.failedDCSet = new Set(); //{remotePeerId} 建立连接失败的dc
        _this.signalerWs = null; //信令服务器ws
        _this.heartbeatInterval = 30;
        //tracker request API
        _this.fetcher = fetcher;
        /*
        peers: Array<Object{id:string}>
         */
        _this.peers = [];

        _this._setupScheduler(_this.scheduler);
        return _this;
    }

    _createClass(BTTracker, [{
        key: 'resumeP2P',
        value: function resumeP2P() {
            var _this2 = this;

            var logger = this.engine.logger;

            this.fetcher.btAnnounce().then(function (json) {
                logger.info('announceURL response ' + JSON.stringify(json));
                _this2.peerId = json.peer_id;
                logger.identifier = _this2.peerId;
                _this2.fetcher.btHeartbeat(json.heartbeat_interval);
                _this2.fetcher.btStatsStart(json.report_limit);
                _this2.signalerWs = _this2._initSignalerWs(); //连上tracker后开始连接信令服务器
                _this2._handlePeers(json.peers);
                _this2.engine.emit('peerId', _this2.peerId);
            }).catch(function (err) {});
        }
    }, {
        key: 'stopP2P',
        value: function stopP2P() {
            var logger = this.engine.logger;

            logger.warn('\u672A\u5B9E\u73B0');
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            window.clearInterval(this.heartbeater);
            this.heartbeater = null;
        }
    }, {
        key: '_handlePeers',
        value: function _handlePeers(peers) {
            var _this3 = this;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = peers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var peer = _step.value;

                    this.peers.push({
                        id: peer.id
                    });
                }
                //过滤掉已经连接的节点和连接失败的节点
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.peers = this.peers.filter(function (node) {
                var _arr = [].concat(_toConsumableArray(_this3.DCMap.keys()), _toConsumableArray(_this3.failedDCSet.keys()));

                for (var _i = 0; _i < _arr.length; _i++) {
                    var peerId = _arr[_i];
                    if (node.id === peerId) {
                        return false;
                    }
                }
                return true;
            });
        }
    }, {
        key: '_tryConnectToPeer',
        value: function _tryConnectToPeer() {
            var logger = this.engine.logger;

            if (this.peers.length === 0) return;
            var remotePeerId = this.peers.pop().id;
            logger.info('tryConnectToPeer ' + remotePeerId);
            var datachannel = new _cdnbyeCore.DataChannel(this.engine, this.peerId, remotePeerId, true, this.config);
            this.DCMap.set(remotePeerId, datachannel); //将对等端Id作为键
            this._setupDC(datachannel);
        }
    }, {
        key: '_setupDC',
        value: function _setupDC(datachannel) {
            var _this4 = this;

            var logger = this.engine.logger;

            datachannel.on(_cdnbyeCore.Events.DC_SIGNAL, function (data) {
                var remotePeerId = datachannel.remotePeerId;
                _this4.signalerWs.sendSignal(remotePeerId, data);
                //启动定时器，如果指定时间对方没有响应则连接下一个
                if (!_this4.signalTimer && !_this4.failedDCSet.has(remotePeerId)) {
                    _this4.signalTimer = window.setTimeout(function () {
                        _this4.DCMap.delete(remotePeerId);
                        _this4.failedDCSet.add(remotePeerId); //记录失败的连接
                        logger.warn('signaling ' + remotePeerId + ' timeout');
                        _this4.signalTimer = null;
                        _this4._tryConnectToPeer();
                    }, 10000);
                }
            }).once(_cdnbyeCore.Events.DC_ERROR, function () {
                logger.warn('datachannel error ' + datachannel.channelId);
                _this4.scheduler.deletePeer(datachannel);
                _this4.DCMap.delete(datachannel.remotePeerId);
                _this4.failedDCSet.add(datachannel.remotePeerId); //记录失败的连接
                _this4._tryConnectToPeer();
                datachannel.destroy();

                _this4._requestMorePeers();

                //更新conns
                if (datachannel.isInitiator) {
                    if (datachannel.connected) {
                        //连接断开
                        _this4.fetcher.decreConns();
                    } else {
                        //连接失败
                        _this4.fetcher.increFailConns();
                    }
                }
            }).once(_cdnbyeCore.Events.DC_CLOSE, function () {

                logger.warn('datachannel closed ' + datachannel.channelId + ' ');
                _this4.scheduler.deletePeer(datachannel);
                _this4.DCMap.delete(datachannel.remotePeerId);
                _this4.failedDCSet.add(datachannel.remotePeerId); //记录断开的连接
                _this4._tryConnectToPeer();

                datachannel.destroy();

                _this4._requestMorePeers();

                //更新conns
                _this4.fetcher.decreConns();
            }).once(_cdnbyeCore.Events.DC_OPEN, function () {

                _this4.scheduler.handshakePeer(datachannel);

                //如果dc数量不够则继续尝试连接
                if (_this4.DCMap.size < _this4.config.neighbours) {
                    _this4._tryConnectToPeer();
                }

                //更新conns
                _this4.fetcher.increConns();
            });
        }
    }, {
        key: '_initSignalerWs',
        value: function _initSignalerWs() {
            var _this5 = this;

            var logger = this.engine.logger;

            var websocket = new _signalClient2.default(this.engine, this.peerId, this.config);
            websocket.onopen = function () {
                _this5.connected = true;
                _this5._tryConnectToPeer();
            };

            websocket.onmessage = function (e) {
                var msg = JSON.parse(e.data);
                var action = msg.action;
                switch (action) {
                    case 'signal':
                        if (_this5.failedDCSet.has(msg.from_peer_id)) return;
                        logger.debug('start handle signal of ' + msg.from_peer_id);
                        window.clearTimeout(_this5.signalTimer); //接收到信令后清除定时器
                        _this5.signalTimer = null;
                        if (!msg.data) {
                            //如果对等端已不在线
                            _this5.DCMap.delete(msg.from_peer_id);
                            _this5.failedDCSet.add(msg.from_peer_id); //记录失败的连接
                            logger.info('signaling ' + msg.from_peer_id + ' not found');
                            _this5._tryConnectToPeer();
                        } else {
                            _this5._handleSignal(msg.from_peer_id, msg.data);
                        }
                        break;
                    case 'reject':
                        _this5.stopP2P();
                        break;
                    default:
                        logger.warn('Signaler websocket unknown action ' + action);

                }
            };
            websocket.onclose = function () {
                //websocket断开时清除datachannel
                _this5.connected = false;
                _this5.destroy();
            };
            return websocket;
        }
    }, {
        key: '_handleSignal',
        value: function _handleSignal(remotePeerId, data) {
            var logger = this.engine.logger;

            var datachannel = this.DCMap.get(remotePeerId);
            if (datachannel && datachannel.connected) {
                logger.info('datachannel had connected, signal ignored');
                return;
            }
            if (!datachannel) {
                //收到子节点连接请求
                logger.debug('receive node ' + remotePeerId + ' connection request');
                if (this.failedDCSet.has(remotePeerId)) return;
                datachannel = new _cdnbyeCore.DataChannel(this.engine, this.peerId, remotePeerId, false, this.config);
                this.DCMap.set(remotePeerId, datachannel); //将对等端Id作为键
                this._setupDC(datachannel);
            }
            datachannel.receiveSignal(data);
        }
    }, {
        key: '_setupScheduler',
        value: function _setupScheduler(s) {}
    }, {
        key: '_heartbeat',
        value: function _heartbeat() {
            var _this6 = this;

            this.heartbeater = window.setInterval(function () {
                _this6.fetcher.btHeartbeat();
            }, this.heartbeatInterval * 1000);
        }
    }, {
        key: '_requestMorePeers',
        value: function _requestMorePeers() {
            var _this7 = this;

            var logger = this.engine.logger;

            if (this.scheduler.peerMap.size <= Math.floor(this.config.neighbours / 2)) {
                this.fetcher.btGetPeers().then(function (json) {
                    logger.info('_requestMorePeers ' + JSON.stringify(json));
                    _this7._handlePeers(json.peers);
                    _this7._tryConnectToPeer();
                });
            }
        }
    }, {
        key: 'currentPlaySN',
        set: function set(sn) {
            this.scheduler.updatePlaySN(sn);
        }
    }, {
        key: 'currentLoadingSN',
        set: function set(sn) {
            this.scheduler.updateLoadingSN(sn);
        }
    }, {
        key: 'currentLoadedSN',
        set: function set(sn) {
            this.scheduler.updateLoadedSN(sn); //更新bitmap
        }
    }]);

    return BTTracker;
}(_events2.default);

exports.default = BTTracker;
module.exports = exports['default'];

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(0);

var _events2 = _interopRequireDefault(_events);

var _cdnbyeCore = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BTScheduler = function (_EventEmitter) {
    _inherits(BTScheduler, _EventEmitter);

    function BTScheduler(engine, config) {
        _classCallCheck(this, BTScheduler);

        var _this = _possibleConstructorReturn(this, (BTScheduler.__proto__ || Object.getPrototypeOf(BTScheduler)).call(this));

        _this.engine = engine;
        _this.config = config;
        _this.bufMgr = null;
        _this.peerMap = new Map(); // remotePeerId -> dc
        _this.bitset = new Set(); //本节点的bitfield
        _this.bitCounts = new Map(); //记录peers的每个buffer的总和，用于BT的rearest first策略  index -> count

        return _this;
    }

    _createClass(BTScheduler, [{
        key: 'updateLoadedSN',
        value: function updateLoadedSN(sn) {
            this.bitset.add(sn); //在bitset中记录
            if (this.bitCounts.has(sn)) {
                this.bitCounts.delete(sn); //在bitCounts清除，防止重复下载
            }
            if (this.peerMap.size > 0) {
                var msg = {
                    event: _cdnbyeCore.Events.DC_HAVE,
                    sn: sn
                };
                this._broadcastToPeers(msg);
            }
        }
    }, {
        key: 'updateLoadingSN',
        value: function updateLoadingSN(sn) {
            //防止下载hls.js正在下载的sn
            this.loadingSN = sn;
        }
    }, {
        key: 'updatePlaySN',
        value: function updatePlaySN(sn) {
            var logger = this.engine.logger;

            if (this.config.live) return; //rearest first只用于vod
            if (!this.hasPeers) return;
            var requested = [];
            for (var idx = sn + 1; idx <= sn + this.config.urgentOffset + 1; idx++) {
                if (!this.bitset.has(idx) && idx !== this.loadingSN && this.bitCounts.has(idx)) {
                    //如果这个块没有缓存并且peers有
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = this.peerMap.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var peer = _step.value;
                            //找到拥有这个块并且空闲的peer
                            if (peer.downloading === false && peer.bitset.has(idx)) {
                                peer.requestDataBySN(idx, true);
                                logger.debug('request urgent ' + idx + ' from peer ' + peer.remotePeerId);
                                requested.push(idx);
                                break;
                            }
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                }
            }

            //检查是否有空闲的节点，有的话采用rearest first策略下载
            var idlePeers = this._getIdlePeer();
            if (idlePeers.length === 0 || this.bitCounts.size === 0 || this.bufMgr.overflowed) return; //缓存溢出则停止rearest first
            var sortedArr = [].concat(_toConsumableArray(this.bitCounts.entries())).sort(function (item1, item2) {
                return item1[1] < item2[1];
            });
            if (sortedArr.length === 0) return;
            //每次只下载一个rearest块
            var rearest = sortedArr.pop()[0];
            while (rearest === this.loadingSN || requested.includes(rearest)) {
                //排除掉loading的和requested的
                if (sortedArr.length === 0) return;
                rearest = sortedArr.pop()[0];
            }
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = idlePeers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _peer = _step2.value;

                    if (_peer.bitset.has(rearest)) {
                        _peer.requestDataBySN(rearest, false);
                        logger.debug('request rearest ' + rearest + ' from peer ' + _peer.remotePeerId);
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }, {
        key: 'deletePeer',
        value: function deletePeer(dc) {
            var _this2 = this;

            if (this.peerMap.has(dc.remotePeerId)) {
                dc.bitset.forEach(function (value) {
                    _this2._decreBitCounts(value);
                });
                this.peerMap.delete(dc.remotePeerId);
            }
            this.engine.emit('peers', [].concat(_toConsumableArray(this.peerMap.keys())));
        }
    }, {
        key: 'handshakePeer',
        value: function handshakePeer(dc) {
            this._setupDC(dc);
            dc.sendBitField(Array.from(this.bitset)); //向peer发送bitfield
        }
    }, {
        key: 'addPeer',
        value: function addPeer(peer) {
            var logger = this.engine.logger;

            logger.info('add peer ' + peer.remotePeerId);
            this.peerMap.set(peer.remotePeerId, peer);

            this.engine.emit('peers', [].concat(_toConsumableArray(this.peerMap.keys())));
        }
    }, {
        key: 'peersHasSN',
        value: function peersHasSN(sn) {
            return this.bitCounts.has(sn);
        }
    }, {
        key: 'load',
        value: function load(context, config, callbacks) {
            var logger = this.engine.logger;

            this.context = context;
            var frag = context.frag;
            this.callbacks = callbacks;
            this.stats = { trequest: performance.now(), retry: 0, tfirst: 0, tload: 0, loaded: 0 };
            this.criticalSeg = { sn: frag.sn, relurl: frag.relurl };

            var target = void 0;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.peerMap.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var peer = _step3.value;

                    if (peer.bitset.has(frag.sn)) {
                        target = peer;
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            if (target) {
                // target.requestDataBySN(frag.sn, true);
                target.requestDataByURL(frag.relurl, true); //critical的根据url请求
                logger.info('request criticalSeg url ' + frag.relurl + ' at ' + frag.sn);
            }
            this.criticaltimeouter = window.setTimeout(this._criticaltimeout.bind(this), this.config.loadTimeout * 1000);
        }
    }, {
        key: '_setupDC',
        value: function _setupDC(dc) {
            var _this3 = this;

            var logger = this.engine.logger;

            dc.on(_cdnbyeCore.Events.DC_BITFIELD, function (msg) {
                if (!msg.field) return;
                var bitset = new Set(msg.field);
                dc.bitset = bitset;
                msg.field.forEach(function (value) {
                    if (!_this3.bitset.has(value)) {
                        //防止重复下载
                        _this3._increBitCounts(value);
                    }
                });
                _this3.addPeer(dc); //只有获取bitfield之后才加入peerMap
            }).on(_cdnbyeCore.Events.DC_HAVE, function (msg) {
                if (!msg.sn || !dc.bitset) return;
                var sn = msg.sn;
                dc.bitset.add(sn);
                if (!_this3.bitset.has(sn)) {
                    //防止重复下载
                    _this3._increBitCounts(sn);
                }
            }).on(_cdnbyeCore.Events.DC_LOST, function (msg) {
                if (!msg.sn || !dc.bitset) return;
                var sn = msg.sn;
                dc.bitset.delete(sn);
                _this3._decreBitCounts(sn);
            }).on(_cdnbyeCore.Events.DC_PIECE, function (msg) {
                //接收到piece事件，即二进制包头
                if (_this3.criticalSeg && _this3.criticalSeg.relurl === msg.url) {
                    //接收到critical的响应
                    _this3.stats.tfirst = Math.max(performance.now(), _this3.stats.trequest);
                }
            }).on(_cdnbyeCore.Events.DC_PIECE_NOT_FOUND, function (msg) {
                if (_this3.criticalSeg && _this3.criticalSeg.relurl === msg.url) {
                    //接收到critical未找到的响应
                    window.clearTimeout(_this3.criticaltimeouter); //清除定时器
                    _this3.criticaltimeouter = null;
                    _this3._criticaltimeout(); //触发超时，由xhr下载
                }
            }).on(_cdnbyeCore.Events.DC_RESPONSE, function (response) {
                //接收到完整二进制数据
                if (_this3.criticalSeg && _this3.criticalSeg.relurl === response.url && _this3.criticaltimeouter) {
                    logger.info('receive criticalSeg url ' + response.url);
                    window.clearTimeout(_this3.criticaltimeouter); //清除定时器
                    _this3.criticaltimeouter = null;
                    var stats = _this3.stats;
                    stats.tload = Math.max(stats.tfirst, performance.now());
                    stats.loaded = stats.total = response.data.byteLength;
                    _this3.criticalSeg = null;
                    _this3.callbacks.onSuccess(response, stats, _this3.context);
                } else {
                    _this3.bufMgr.addBuffer(response.sn, response.url, response.data);
                }
                _this3.updateLoadedSN(response.sn);
            }).on(_cdnbyeCore.Events.DC_REQUEST, function (msg) {
                var url = '';
                if (!msg.url) {
                    //请求sn的request
                    url = _this3.bufMgr.getURLbySN(msg.sn);
                } else {
                    //请求url的request
                    url = msg.url;
                }
                if (url && _this3.bufMgr.hasSegOfURL(url)) {
                    var seg = _this3.bufMgr.getSegByURL(url);
                    dc.sendBuffer(msg.sn, seg.relurl, seg.data);
                } else {
                    dc.sendJson({
                        event: _cdnbyeCore.Events.DC_PIECE_NOT_FOUND,
                        url: url,
                        sn: msg.sn
                    });
                }
            }).on(_cdnbyeCore.Events.DC_TIMEOUT, function () {
                logger.warn('DC_TIMEOUT');
            });
        }
    }, {
        key: '_broadcastToPeers',
        value: function _broadcastToPeers(msg) {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this.peerMap.values()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var peer = _step4.value;

                    peer.sendJson(msg);
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
    }, {
        key: '_getIdlePeer',
        value: function _getIdlePeer() {
            return [].concat(_toConsumableArray(this.peerMap.values())).filter(function (peer) {
                return peer.downloading === false;
            });
        }
    }, {
        key: '_decreBitCounts',
        value: function _decreBitCounts(index) {
            if (this.bitCounts.has(index)) {
                var last = this.bitCounts.get(index);
                // this.bitCounts.set(index, last-1);
                // if (this.bitCounts.get(index) === 0) {
                //     this.bitCounts.delete(index);
                // }
                if (last === 1) {
                    this.bitCounts.delete(index);
                } else {
                    this.bitCounts.set(index, last - 1);
                }
            }
        }
    }, {
        key: '_increBitCounts',
        value: function _increBitCounts(index) {
            if (!this.bitCounts.has(index)) {
                this.bitCounts.set(index, 1);
            } else {
                var last = this.bitCounts.get(index);
                this.bitCounts.set(index, last + 1);
            }
        }
    }, {
        key: '_criticaltimeout',
        value: function _criticaltimeout() {
            var logger = this.engine.logger;

            logger.warn('_criticaltimeout');
            this.criticalSeg = null;
            this.callbacks.onTimeout(this.stats, this.context, null);
            this.criticaltimeouter = null;
        }
    }, {
        key: 'hasPeers',
        get: function get() {
            return this.peerMap.size > 0;
        }
    }, {
        key: 'bufferManager',
        set: function set(bm) {
            var _this4 = this;

            this.bufMgr = bm;

            bm.on(_cdnbyeCore.Events.BM_LOST, function (sn) {
                _this4._broadcastToPeers({ //向peers广播已经不缓存的sn
                    event: _cdnbyeCore.Events.DC_LOST,
                    sn: sn
                });
                _this4.bitset.delete(sn);
            });
        }
    }]);

    return BTScheduler;
}(_events2.default);

exports.default = BTScheduler;
module.exports = exports['default'];

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/*The core component of cdnbye project*/
!function(e,t){ true?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.CDNByeCore=t():e.CDNByeCore=t()}("undefined"!=typeof self?self:this,function(){return function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=18)}([function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t){function n(){throw new Error("setTimeout has not been defined")}function r(){throw new Error("clearTimeout has not been defined")}function i(e){if(f===setTimeout)return setTimeout(e,0);if((f===n||!f)&&setTimeout)return f=setTimeout,setTimeout(e,0);try{return f(e,0)}catch(t){try{return f.call(null,e,0)}catch(t){return f.call(this,e,0)}}}function o(e){if(l===clearTimeout)return clearTimeout(e);if((l===r||!l)&&clearTimeout)return l=clearTimeout,clearTimeout(e);try{return l(e)}catch(t){try{return l.call(null,e)}catch(t){return l.call(this,e)}}}function a(){g&&d&&(g=!1,d.length?p=d.concat(p):y=-1,p.length&&s())}function s(){if(!g){var e=i(a);g=!0;for(var t=p.length;t;){for(d=p,p=[];++y<t;)d&&d[y].run();y=-1,t=p.length}d=null,g=!1,o(e)}}function u(e,t){this.fun=e,this.array=t}function c(){}var f,l,h=e.exports={};!function(){try{f="function"==typeof setTimeout?setTimeout:n}catch(e){f=n}try{l="function"==typeof clearTimeout?clearTimeout:r}catch(e){l=r}}();var d,p=[],g=!1,y=-1;h.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];p.push(new u(e,t)),1!==p.length||g||i(s)},u.prototype.run=function(){this.fun.apply(null,this.array)},h.title="browser",h.browser=!0,h.env={},h.argv=[],h.version="",h.versions={},h.on=c,h.addListener=c,h.once=c,h.off=c,h.removeListener=c,h.removeAllListeners=c,h.emit=c,h.prependListener=c,h.prependOnceListener=c,h.listeners=function(e){return[]},h.binding=function(e){throw new Error("process.binding is not supported")},h.cwd=function(){return"/"},h.chdir=function(e){throw new Error("process.chdir is not supported")},h.umask=function(){return 0}},function(e,t){"function"==typeof Object.create?e.exports=function(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}:e.exports=function(e,t){e.super_=t;var n=function(){};n.prototype=t.prototype,e.prototype=new n,e.prototype.constructor=e}},function(e,t,n){"use strict";function r(e){if(!(this instanceof r))return new r(e);c.call(this,e),f.call(this,e),e&&!1===e.readable&&(this.readable=!1),e&&!1===e.writable&&(this.writable=!1),this.allowHalfOpen=!0,e&&!1===e.allowHalfOpen&&(this.allowHalfOpen=!1),this.once("end",i)}function i(){this.allowHalfOpen||this._writableState.ended||a.nextTick(o,this)}function o(e){e.end()}var a=n(7),s=Object.keys||function(e){var t=[];for(var n in e)t.push(n);return t};e.exports=r;var u=n(6);u.inherits=n(2);var c=n(11),f=n(14);u.inherits(r,c);for(var l=s(f.prototype),h=0;h<l.length;h++){var d=l[h];r.prototype[d]||(r.prototype[d]=f.prototype[d])}Object.defineProperty(r.prototype,"writableHighWaterMark",{enumerable:!1,get:function(){return this._writableState.highWaterMark}}),Object.defineProperty(r.prototype,"destroyed",{get:function(){return void 0!==this._readableState&&void 0!==this._writableState&&(this._readableState.destroyed&&this._writableState.destroyed)},set:function(e){void 0!==this._readableState&&void 0!==this._writableState&&(this._readableState.destroyed=e,this._writableState.destroyed=e)}}),r.prototype._destroy=function(e,t){this.push(null),this.end(),a.nextTick(t,e)}},function(e,t,n){"use strict";(function(e){function r(){return o.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function i(e,t){if(r()<t)throw new RangeError("Invalid typed array length");return o.TYPED_ARRAY_SUPPORT?(e=new Uint8Array(t),e.__proto__=o.prototype):(null===e&&(e=new o(t)),e.length=t),e}function o(e,t,n){if(!(o.TYPED_ARRAY_SUPPORT||this instanceof o))return new o(e,t,n);if("number"==typeof e){if("string"==typeof t)throw new Error("If encoding is specified then the first argument must be a string");return c(this,e)}return a(this,e,t,n)}function a(e,t,n,r){if("number"==typeof t)throw new TypeError('"value" argument must not be a number');return"undefined"!=typeof ArrayBuffer&&t instanceof ArrayBuffer?h(e,t,n,r):"string"==typeof t?f(e,t,n):d(e,t)}function s(e){if("number"!=typeof e)throw new TypeError('"size" argument must be a number');if(e<0)throw new RangeError('"size" argument must not be negative')}function u(e,t,n,r){return s(t),t<=0?i(e,t):void 0!==n?"string"==typeof r?i(e,t).fill(n,r):i(e,t).fill(n):i(e,t)}function c(e,t){if(s(t),e=i(e,t<0?0:0|p(t)),!o.TYPED_ARRAY_SUPPORT)for(var n=0;n<t;++n)e[n]=0;return e}function f(e,t,n){if("string"==typeof n&&""!==n||(n="utf8"),!o.isEncoding(n))throw new TypeError('"encoding" must be a valid string encoding');var r=0|y(t,n);e=i(e,r);var a=e.write(t,n);return a!==r&&(e=e.slice(0,a)),e}function l(e,t){var n=t.length<0?0:0|p(t.length);e=i(e,n);for(var r=0;r<n;r+=1)e[r]=255&t[r];return e}function h(e,t,n,r){if(t.byteLength,n<0||t.byteLength<n)throw new RangeError("'offset' is out of bounds");if(t.byteLength<n+(r||0))throw new RangeError("'length' is out of bounds");return t=void 0===n&&void 0===r?new Uint8Array(t):void 0===r?new Uint8Array(t,n):new Uint8Array(t,n,r),o.TYPED_ARRAY_SUPPORT?(e=t,e.__proto__=o.prototype):e=l(e,t),e}function d(e,t){if(o.isBuffer(t)){var n=0|p(t.length);return e=i(e,n),0===e.length?e:(t.copy(e,0,0,n),e)}if(t){if("undefined"!=typeof ArrayBuffer&&t.buffer instanceof ArrayBuffer||"length"in t)return"number"!=typeof t.length||V(t.length)?i(e,0):l(e,t);if("Buffer"===t.type&&Z(t.data))return l(e,t.data)}throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}function p(e){if(e>=r())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+r().toString(16)+" bytes");return 0|e}function g(e){return+e!=e&&(e=0),o.alloc(+e)}function y(e,t){if(o.isBuffer(e))return e.length;if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(e)||e instanceof ArrayBuffer))return e.byteLength;"string"!=typeof e&&(e=""+e);var n=e.length;if(0===n)return 0;for(var r=!1;;)switch(t){case"ascii":case"latin1":case"binary":return n;case"utf8":case"utf-8":case void 0:return z(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*n;case"hex":return n>>>1;case"base64":return J(e).length;default:if(r)return z(e).length;t=(""+t).toLowerCase(),r=!0}}function m(e,t,n){var r=!1;if((void 0===t||t<0)&&(t=0),t>this.length)return"";if((void 0===n||n>this.length)&&(n=this.length),n<=0)return"";if(n>>>=0,t>>>=0,n<=t)return"";for(e||(e="utf8");;)switch(e){case"hex":return D(this,t,n);case"utf8":case"utf-8":return k(this,t,n);case"ascii":return I(this,t,n);case"latin1":case"binary":return x(this,t,n);case"base64":return A(this,t,n);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return O(this,t,n);default:if(r)throw new TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),r=!0}}function v(e,t,n){var r=e[t];e[t]=e[n],e[n]=r}function _(e,t,n,r,i){if(0===e.length)return-1;if("string"==typeof n?(r=n,n=0):n>2147483647?n=2147483647:n<-2147483648&&(n=-2147483648),n=+n,isNaN(n)&&(n=i?0:e.length-1),n<0&&(n=e.length+n),n>=e.length){if(i)return-1;n=e.length-1}else if(n<0){if(!i)return-1;n=0}if("string"==typeof t&&(t=o.from(t,r)),o.isBuffer(t))return 0===t.length?-1:b(e,t,n,r,i);if("number"==typeof t)return t&=255,o.TYPED_ARRAY_SUPPORT&&"function"==typeof Uint8Array.prototype.indexOf?i?Uint8Array.prototype.indexOf.call(e,t,n):Uint8Array.prototype.lastIndexOf.call(e,t,n):b(e,[t],n,r,i);throw new TypeError("val must be string, number or Buffer")}function b(e,t,n,r,i){function o(e,t){return 1===a?e[t]:e.readUInt16BE(t*a)}var a=1,s=e.length,u=t.length;if(void 0!==r&&("ucs2"===(r=String(r).toLowerCase())||"ucs-2"===r||"utf16le"===r||"utf-16le"===r)){if(e.length<2||t.length<2)return-1;a=2,s/=2,u/=2,n/=2}var c;if(i){var f=-1;for(c=n;c<s;c++)if(o(e,c)===o(t,-1===f?0:c-f)){if(-1===f&&(f=c),c-f+1===u)return f*a}else-1!==f&&(c-=c-f),f=-1}else for(n+u>s&&(n=s-u),c=n;c>=0;c--){for(var l=!0,h=0;h<u;h++)if(o(e,c+h)!==o(t,h)){l=!1;break}if(l)return c}return-1}function w(e,t,n,r){n=Number(n)||0;var i=e.length-n;r?(r=Number(r))>i&&(r=i):r=i;var o=t.length;if(o%2!=0)throw new TypeError("Invalid hex string");r>o/2&&(r=o/2);for(var a=0;a<r;++a){var s=parseInt(t.substr(2*a,2),16);if(isNaN(s))return a;e[n+a]=s}return a}function C(e,t,n,r){return Q(z(t,e.length-n),e,n,r)}function T(e,t,n,r){return Q(G(t),e,n,r)}function E(e,t,n,r){return T(e,t,n,r)}function S(e,t,n,r){return Q(J(t),e,n,r)}function R(e,t,n,r){return Q(H(t,e.length-n),e,n,r)}function A(e,t,n){return 0===t&&n===e.length?K.fromByteArray(e):K.fromByteArray(e.slice(t,n))}function k(e,t,n){n=Math.min(e.length,n);for(var r=[],i=t;i<n;){var o=e[i],a=null,s=o>239?4:o>223?3:o>191?2:1;if(i+s<=n){var u,c,f,l;switch(s){case 1:o<128&&(a=o);break;case 2:u=e[i+1],128==(192&u)&&(l=(31&o)<<6|63&u)>127&&(a=l);break;case 3:u=e[i+1],c=e[i+2],128==(192&u)&&128==(192&c)&&(l=(15&o)<<12|(63&u)<<6|63&c)>2047&&(l<55296||l>57343)&&(a=l);break;case 4:u=e[i+1],c=e[i+2],f=e[i+3],128==(192&u)&&128==(192&c)&&128==(192&f)&&(l=(15&o)<<18|(63&u)<<12|(63&c)<<6|63&f)>65535&&l<1114112&&(a=l)}}null===a?(a=65533,s=1):a>65535&&(a-=65536,r.push(a>>>10&1023|55296),a=56320|1023&a),r.push(a),i+=s}return P(r)}function P(e){var t=e.length;if(t<=X)return String.fromCharCode.apply(String,e);for(var n="",r=0;r<t;)n+=String.fromCharCode.apply(String,e.slice(r,r+=X));return n}function I(e,t,n){var r="";n=Math.min(e.length,n);for(var i=t;i<n;++i)r+=String.fromCharCode(127&e[i]);return r}function x(e,t,n){var r="";n=Math.min(e.length,n);for(var i=t;i<n;++i)r+=String.fromCharCode(e[i]);return r}function D(e,t,n){var r=e.length;(!t||t<0)&&(t=0),(!n||n<0||n>r)&&(n=r);for(var i="",o=t;o<n;++o)i+=W(e[o]);return i}function O(e,t,n){for(var r=e.slice(t,n),i="",o=0;o<r.length;o+=2)i+=String.fromCharCode(r[o]+256*r[o+1]);return i}function L(e,t,n){if(e%1!=0||e<0)throw new RangeError("offset is not uint");if(e+t>n)throw new RangeError("Trying to access beyond buffer length")}function M(e,t,n,r,i,a){if(!o.isBuffer(e))throw new TypeError('"buffer" argument must be a Buffer instance');if(t>i||t<a)throw new RangeError('"value" argument is out of bounds');if(n+r>e.length)throw new RangeError("Index out of range")}function N(e,t,n,r){t<0&&(t=65535+t+1);for(var i=0,o=Math.min(e.length-n,2);i<o;++i)e[n+i]=(t&255<<8*(r?i:1-i))>>>8*(r?i:1-i)}function B(e,t,n,r){t<0&&(t=4294967295+t+1);for(var i=0,o=Math.min(e.length-n,4);i<o;++i)e[n+i]=t>>>8*(r?i:3-i)&255}function F(e,t,n,r,i,o){if(n+r>e.length)throw new RangeError("Index out of range");if(n<0)throw new RangeError("Index out of range")}function U(e,t,n,r,i){return i||F(e,t,n,4,3.4028234663852886e38,-3.4028234663852886e38),$.write(e,t,n,r,23,4),n+4}function j(e,t,n,r,i){return i||F(e,t,n,8,1.7976931348623157e308,-1.7976931348623157e308),$.write(e,t,n,r,52,8),n+8}function q(e){if(e=Y(e).replace(ee,""),e.length<2)return"";for(;e.length%4!=0;)e+="=";return e}function Y(e){return e.trim?e.trim():e.replace(/^\s+|\s+$/g,"")}function W(e){return e<16?"0"+e.toString(16):e.toString(16)}function z(e,t){t=t||1/0;for(var n,r=e.length,i=null,o=[],a=0;a<r;++a){if((n=e.charCodeAt(a))>55295&&n<57344){if(!i){if(n>56319){(t-=3)>-1&&o.push(239,191,189);continue}if(a+1===r){(t-=3)>-1&&o.push(239,191,189);continue}i=n;continue}if(n<56320){(t-=3)>-1&&o.push(239,191,189),i=n;continue}n=65536+(i-55296<<10|n-56320)}else i&&(t-=3)>-1&&o.push(239,191,189);if(i=null,n<128){if((t-=1)<0)break;o.push(n)}else if(n<2048){if((t-=2)<0)break;o.push(n>>6|192,63&n|128)}else if(n<65536){if((t-=3)<0)break;o.push(n>>12|224,n>>6&63|128,63&n|128)}else{if(!(n<1114112))throw new Error("Invalid code point");if((t-=4)<0)break;o.push(n>>18|240,n>>12&63|128,n>>6&63|128,63&n|128)}}return o}function G(e){for(var t=[],n=0;n<e.length;++n)t.push(255&e.charCodeAt(n));return t}function H(e,t){for(var n,r,i,o=[],a=0;a<e.length&&!((t-=2)<0);++a)n=e.charCodeAt(a),r=n>>8,i=n%256,o.push(i),o.push(r);return o}function J(e){return K.toByteArray(q(e))}function Q(e,t,n,r){for(var i=0;i<r&&!(i+n>=t.length||i>=e.length);++i)t[i+n]=e[i];return i}function V(e){return e!==e}var K=n(21),$=n(22),Z=n(9);t.Buffer=o,t.SlowBuffer=g,t.INSPECT_MAX_BYTES=50,o.TYPED_ARRAY_SUPPORT=void 0!==e.TYPED_ARRAY_SUPPORT?e.TYPED_ARRAY_SUPPORT:function(){try{var e=new Uint8Array(1);return e.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===e.foo()&&"function"==typeof e.subarray&&0===e.subarray(1,1).byteLength}catch(e){return!1}}(),t.kMaxLength=r(),o.poolSize=8192,o._augment=function(e){return e.__proto__=o.prototype,e},o.from=function(e,t,n){return a(null,e,t,n)},o.TYPED_ARRAY_SUPPORT&&(o.prototype.__proto__=Uint8Array.prototype,o.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&o[Symbol.species]===o&&Object.defineProperty(o,Symbol.species,{value:null,configurable:!0})),o.alloc=function(e,t,n){return u(null,e,t,n)},o.allocUnsafe=function(e){return c(null,e)},o.allocUnsafeSlow=function(e){return c(null,e)},o.isBuffer=function(e){return!(null==e||!e._isBuffer)},o.compare=function(e,t){if(!o.isBuffer(e)||!o.isBuffer(t))throw new TypeError("Arguments must be Buffers");if(e===t)return 0;for(var n=e.length,r=t.length,i=0,a=Math.min(n,r);i<a;++i)if(e[i]!==t[i]){n=e[i],r=t[i];break}return n<r?-1:r<n?1:0},o.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},o.concat=function(e,t){if(!Z(e))throw new TypeError('"list" argument must be an Array of Buffers');if(0===e.length)return o.alloc(0);var n;if(void 0===t)for(t=0,n=0;n<e.length;++n)t+=e[n].length;var r=o.allocUnsafe(t),i=0;for(n=0;n<e.length;++n){var a=e[n];if(!o.isBuffer(a))throw new TypeError('"list" argument must be an Array of Buffers');a.copy(r,i),i+=a.length}return r},o.byteLength=y,o.prototype._isBuffer=!0,o.prototype.swap16=function(){var e=this.length;if(e%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var t=0;t<e;t+=2)v(this,t,t+1);return this},o.prototype.swap32=function(){var e=this.length;if(e%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var t=0;t<e;t+=4)v(this,t,t+3),v(this,t+1,t+2);return this},o.prototype.swap64=function(){var e=this.length;if(e%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var t=0;t<e;t+=8)v(this,t,t+7),v(this,t+1,t+6),v(this,t+2,t+5),v(this,t+3,t+4);return this},o.prototype.toString=function(){var e=0|this.length;return 0===e?"":0===arguments.length?k(this,0,e):m.apply(this,arguments)},o.prototype.equals=function(e){if(!o.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this===e||0===o.compare(this,e)},o.prototype.inspect=function(){var e="",n=t.INSPECT_MAX_BYTES;return this.length>0&&(e=this.toString("hex",0,n).match(/.{2}/g).join(" "),this.length>n&&(e+=" ... ")),"<Buffer "+e+">"},o.prototype.compare=function(e,t,n,r,i){if(!o.isBuffer(e))throw new TypeError("Argument must be a Buffer");if(void 0===t&&(t=0),void 0===n&&(n=e?e.length:0),void 0===r&&(r=0),void 0===i&&(i=this.length),t<0||n>e.length||r<0||i>this.length)throw new RangeError("out of range index");if(r>=i&&t>=n)return 0;if(r>=i)return-1;if(t>=n)return 1;if(t>>>=0,n>>>=0,r>>>=0,i>>>=0,this===e)return 0;for(var a=i-r,s=n-t,u=Math.min(a,s),c=this.slice(r,i),f=e.slice(t,n),l=0;l<u;++l)if(c[l]!==f[l]){a=c[l],s=f[l];break}return a<s?-1:s<a?1:0},o.prototype.includes=function(e,t,n){return-1!==this.indexOf(e,t,n)},o.prototype.indexOf=function(e,t,n){return _(this,e,t,n,!0)},o.prototype.lastIndexOf=function(e,t,n){return _(this,e,t,n,!1)},o.prototype.write=function(e,t,n,r){if(void 0===t)r="utf8",n=this.length,t=0;else if(void 0===n&&"string"==typeof t)r=t,n=this.length,t=0;else{if(!isFinite(t))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");t|=0,isFinite(n)?(n|=0,void 0===r&&(r="utf8")):(r=n,n=void 0)}var i=this.length-t;if((void 0===n||n>i)&&(n=i),e.length>0&&(n<0||t<0)||t>this.length)throw new RangeError("Attempt to write outside buffer bounds");r||(r="utf8");for(var o=!1;;)switch(r){case"hex":return w(this,e,t,n);case"utf8":case"utf-8":return C(this,e,t,n);case"ascii":return T(this,e,t,n);case"latin1":case"binary":return E(this,e,t,n);case"base64":return S(this,e,t,n);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return R(this,e,t,n);default:if(o)throw new TypeError("Unknown encoding: "+r);r=(""+r).toLowerCase(),o=!0}},o.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var X=4096;o.prototype.slice=function(e,t){var n=this.length;e=~~e,t=void 0===t?n:~~t,e<0?(e+=n)<0&&(e=0):e>n&&(e=n),t<0?(t+=n)<0&&(t=0):t>n&&(t=n),t<e&&(t=e);var r;if(o.TYPED_ARRAY_SUPPORT)r=this.subarray(e,t),r.__proto__=o.prototype;else{var i=t-e;r=new o(i,void 0);for(var a=0;a<i;++a)r[a]=this[a+e]}return r},o.prototype.readUIntLE=function(e,t,n){e|=0,t|=0,n||L(e,t,this.length);for(var r=this[e],i=1,o=0;++o<t&&(i*=256);)r+=this[e+o]*i;return r},o.prototype.readUIntBE=function(e,t,n){e|=0,t|=0,n||L(e,t,this.length);for(var r=this[e+--t],i=1;t>0&&(i*=256);)r+=this[e+--t]*i;return r},o.prototype.readUInt8=function(e,t){return t||L(e,1,this.length),this[e]},o.prototype.readUInt16LE=function(e,t){return t||L(e,2,this.length),this[e]|this[e+1]<<8},o.prototype.readUInt16BE=function(e,t){return t||L(e,2,this.length),this[e]<<8|this[e+1]},o.prototype.readUInt32LE=function(e,t){return t||L(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+16777216*this[e+3]},o.prototype.readUInt32BE=function(e,t){return t||L(e,4,this.length),16777216*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3])},o.prototype.readIntLE=function(e,t,n){e|=0,t|=0,n||L(e,t,this.length);for(var r=this[e],i=1,o=0;++o<t&&(i*=256);)r+=this[e+o]*i;return i*=128,r>=i&&(r-=Math.pow(2,8*t)),r},o.prototype.readIntBE=function(e,t,n){e|=0,t|=0,n||L(e,t,this.length);for(var r=t,i=1,o=this[e+--r];r>0&&(i*=256);)o+=this[e+--r]*i;return i*=128,o>=i&&(o-=Math.pow(2,8*t)),o},o.prototype.readInt8=function(e,t){return t||L(e,1,this.length),128&this[e]?-1*(255-this[e]+1):this[e]},o.prototype.readInt16LE=function(e,t){t||L(e,2,this.length);var n=this[e]|this[e+1]<<8;return 32768&n?4294901760|n:n},o.prototype.readInt16BE=function(e,t){t||L(e,2,this.length);var n=this[e+1]|this[e]<<8;return 32768&n?4294901760|n:n},o.prototype.readInt32LE=function(e,t){return t||L(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24},o.prototype.readInt32BE=function(e,t){return t||L(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]},o.prototype.readFloatLE=function(e,t){return t||L(e,4,this.length),$.read(this,e,!0,23,4)},o.prototype.readFloatBE=function(e,t){return t||L(e,4,this.length),$.read(this,e,!1,23,4)},o.prototype.readDoubleLE=function(e,t){return t||L(e,8,this.length),$.read(this,e,!0,52,8)},o.prototype.readDoubleBE=function(e,t){return t||L(e,8,this.length),$.read(this,e,!1,52,8)},o.prototype.writeUIntLE=function(e,t,n,r){if(e=+e,t|=0,n|=0,!r){M(this,e,t,n,Math.pow(2,8*n)-1,0)}var i=1,o=0;for(this[t]=255&e;++o<n&&(i*=256);)this[t+o]=e/i&255;return t+n},o.prototype.writeUIntBE=function(e,t,n,r){if(e=+e,t|=0,n|=0,!r){M(this,e,t,n,Math.pow(2,8*n)-1,0)}var i=n-1,o=1;for(this[t+i]=255&e;--i>=0&&(o*=256);)this[t+i]=e/o&255;return t+n},o.prototype.writeUInt8=function(e,t,n){return e=+e,t|=0,n||M(this,e,t,1,255,0),o.TYPED_ARRAY_SUPPORT||(e=Math.floor(e)),this[t]=255&e,t+1},o.prototype.writeUInt16LE=function(e,t,n){return e=+e,t|=0,n||M(this,e,t,2,65535,0),o.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8):N(this,e,t,!0),t+2},o.prototype.writeUInt16BE=function(e,t,n){return e=+e,t|=0,n||M(this,e,t,2,65535,0),o.TYPED_ARRAY_SUPPORT?(this[t]=e>>>8,this[t+1]=255&e):N(this,e,t,!1),t+2},o.prototype.writeUInt32LE=function(e,t,n){return e=+e,t|=0,n||M(this,e,t,4,4294967295,0),o.TYPED_ARRAY_SUPPORT?(this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=255&e):B(this,e,t,!0),t+4},o.prototype.writeUInt32BE=function(e,t,n){return e=+e,t|=0,n||M(this,e,t,4,4294967295,0),o.TYPED_ARRAY_SUPPORT?(this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e):B(this,e,t,!1),t+4},o.prototype.writeIntLE=function(e,t,n,r){if(e=+e,t|=0,!r){var i=Math.pow(2,8*n-1);M(this,e,t,n,i-1,-i)}var o=0,a=1,s=0;for(this[t]=255&e;++o<n&&(a*=256);)e<0&&0===s&&0!==this[t+o-1]&&(s=1),this[t+o]=(e/a>>0)-s&255;return t+n},o.prototype.writeIntBE=function(e,t,n,r){if(e=+e,t|=0,!r){var i=Math.pow(2,8*n-1);M(this,e,t,n,i-1,-i)}var o=n-1,a=1,s=0;for(this[t+o]=255&e;--o>=0&&(a*=256);)e<0&&0===s&&0!==this[t+o+1]&&(s=1),this[t+o]=(e/a>>0)-s&255;return t+n},o.prototype.writeInt8=function(e,t,n){return e=+e,t|=0,n||M(this,e,t,1,127,-128),o.TYPED_ARRAY_SUPPORT||(e=Math.floor(e)),e<0&&(e=255+e+1),this[t]=255&e,t+1},o.prototype.writeInt16LE=function(e,t,n){return e=+e,t|=0,n||M(this,e,t,2,32767,-32768),o.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8):N(this,e,t,!0),t+2},o.prototype.writeInt16BE=function(e,t,n){return e=+e,t|=0,n||M(this,e,t,2,32767,-32768),o.TYPED_ARRAY_SUPPORT?(this[t]=e>>>8,this[t+1]=255&e):N(this,e,t,!1),t+2},o.prototype.writeInt32LE=function(e,t,n){return e=+e,t|=0,n||M(this,e,t,4,2147483647,-2147483648),o.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24):B(this,e,t,!0),t+4},o.prototype.writeInt32BE=function(e,t,n){return e=+e,t|=0,n||M(this,e,t,4,2147483647,-2147483648),e<0&&(e=4294967295+e+1),o.TYPED_ARRAY_SUPPORT?(this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e):B(this,e,t,!1),t+4},o.prototype.writeFloatLE=function(e,t,n){return U(this,e,t,!0,n)},o.prototype.writeFloatBE=function(e,t,n){return U(this,e,t,!1,n)},o.prototype.writeDoubleLE=function(e,t,n){return j(this,e,t,!0,n)},o.prototype.writeDoubleBE=function(e,t,n){return j(this,e,t,!1,n)},o.prototype.copy=function(e,t,n,r){if(n||(n=0),r||0===r||(r=this.length),t>=e.length&&(t=e.length),t||(t=0),r>0&&r<n&&(r=n),r===n)return 0;if(0===e.length||0===this.length)return 0;if(t<0)throw new RangeError("targetStart out of bounds");if(n<0||n>=this.length)throw new RangeError("sourceStart out of bounds");if(r<0)throw new RangeError("sourceEnd out of bounds");r>this.length&&(r=this.length),e.length-t<r-n&&(r=e.length-t+n);var i,a=r-n;if(this===e&&n<t&&t<r)for(i=a-1;i>=0;--i)e[i+t]=this[i+n];else if(a<1e3||!o.TYPED_ARRAY_SUPPORT)for(i=0;i<a;++i)e[i+t]=this[i+n];else Uint8Array.prototype.set.call(e,this.subarray(n,n+a),t);return a},o.prototype.fill=function(e,t,n,r){if("string"==typeof e){if("string"==typeof t?(r=t,t=0,n=this.length):"string"==typeof n&&(r=n,n=this.length),1===e.length){var i=e.charCodeAt(0);i<256&&(e=i)}if(void 0!==r&&"string"!=typeof r)throw new TypeError("encoding must be a string");if("string"==typeof r&&!o.isEncoding(r))throw new TypeError("Unknown encoding: "+r)}else"number"==typeof e&&(e&=255);if(t<0||this.length<t||this.length<n)throw new RangeError("Out of range index");if(n<=t)return this;t>>>=0,n=void 0===n?this.length:n>>>0,e||(e=0);var a;if("number"==typeof e)for(a=t;a<n;++a)this[a]=e;else{var s=o.isBuffer(e)?e:z(new o(e,r).toString()),u=s.length;for(a=0;a<n-t;++a)this[a+t]=s[a%u]}return this};var ee=/[^+\/0-9A-Za-z-_]/g}).call(t,n(0))},function(e,t,n){function r(e,t){for(var n in e)t[n]=e[n]}function i(e,t,n){return a(e,t,n)}var o=n(4),a=o.Buffer;a.from&&a.alloc&&a.allocUnsafe&&a.allocUnsafeSlow?e.exports=o:(r(o,t),t.Buffer=i),r(a,i),i.from=function(e,t,n){if("number"==typeof e)throw new TypeError("Argument must not be a number");return a(e,t,n)},i.alloc=function(e,t,n){if("number"!=typeof e)throw new TypeError("Argument must be a number");var r=a(e);return void 0!==t?"string"==typeof n?r.fill(t,n):r.fill(t):r.fill(0),r},i.allocUnsafe=function(e){if("number"!=typeof e)throw new TypeError("Argument must be a number");return a(e)},i.allocUnsafeSlow=function(e){if("number"!=typeof e)throw new TypeError("Argument must be a number");return o.SlowBuffer(e)}},function(e,t,n){(function(e){function n(e){return Array.isArray?Array.isArray(e):"[object Array]"===y(e)}function r(e){return"boolean"==typeof e}function i(e){return null===e}function o(e){return null==e}function a(e){return"number"==typeof e}function s(e){return"string"==typeof e}function u(e){return"symbol"==typeof e}function c(e){return void 0===e}function f(e){return"[object RegExp]"===y(e)}function l(e){return"object"==typeof e&&null!==e}function h(e){return"[object Date]"===y(e)}function d(e){return"[object Error]"===y(e)||e instanceof Error}function p(e){return"function"==typeof e}function g(e){return null===e||"boolean"==typeof e||"number"==typeof e||"string"==typeof e||"symbol"==typeof e||void 0===e}function y(e){return Object.prototype.toString.call(e)}t.isArray=n,t.isBoolean=r,t.isNull=i,t.isNullOrUndefined=o,t.isNumber=a,t.isString=s,t.isSymbol=u,t.isUndefined=c,t.isRegExp=f,t.isObject=l,t.isDate=h,t.isError=d,t.isFunction=p,t.isPrimitive=g,t.isBuffer=e.isBuffer}).call(t,n(4).Buffer)},function(e,t,n){"use strict";(function(t){function n(e,n,r,i){if("function"!=typeof e)throw new TypeError('"callback" argument must be a function');var o,a,s=arguments.length;switch(s){case 0:case 1:return t.nextTick(e);case 2:return t.nextTick(function(){e.call(null,n)});case 3:return t.nextTick(function(){e.call(null,n,r)});case 4:return t.nextTick(function(){e.call(null,n,r,i)});default:for(o=new Array(s-1),a=0;a<o.length;)o[a++]=arguments[a];return t.nextTick(function(){e.apply(null,o)})}}!t.version||0===t.version.indexOf("v0.")||0===t.version.indexOf("v1.")&&0!==t.version.indexOf("v1.8.")?e.exports={nextTick:n}:e.exports=t}).call(t,n(1))},function(e,t){function n(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function r(e){return"function"==typeof e}function i(e){return"number"==typeof e}function o(e){return"object"==typeof e&&null!==e}function a(e){return void 0===e}e.exports=n,n.EventEmitter=n,n.prototype._events=void 0,n.prototype._maxListeners=void 0,n.defaultMaxListeners=10,n.prototype.setMaxListeners=function(e){if(!i(e)||e<0||isNaN(e))throw TypeError("n must be a positive number");return this._maxListeners=e,this},n.prototype.emit=function(e){var t,n,i,s,u,c;if(this._events||(this._events={}),"error"===e&&(!this._events.error||o(this._events.error)&&!this._events.error.length)){if((t=arguments[1])instanceof Error)throw t;var f=new Error('Uncaught, unspecified "error" event. ('+t+")");throw f.context=t,f}if(n=this._events[e],a(n))return!1;if(r(n))switch(arguments.length){case 1:n.call(this);break;case 2:n.call(this,arguments[1]);break;case 3:n.call(this,arguments[1],arguments[2]);break;default:s=Array.prototype.slice.call(arguments,1),n.apply(this,s)}else if(o(n))for(s=Array.prototype.slice.call(arguments,1),c=n.slice(),i=c.length,u=0;u<i;u++)c[u].apply(this,s);return!0},n.prototype.addListener=function(e,t){var i;if(!r(t))throw TypeError("listener must be a function");return this._events||(this._events={}),this._events.newListener&&this.emit("newListener",e,r(t.listener)?t.listener:t),this._events[e]?o(this._events[e])?this._events[e].push(t):this._events[e]=[this._events[e],t]:this._events[e]=t,o(this._events[e])&&!this._events[e].warned&&(i=a(this._maxListeners)?n.defaultMaxListeners:this._maxListeners)&&i>0&&this._events[e].length>i&&(this._events[e].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[e].length),"function"==typeof console.trace&&console.trace()),this},n.prototype.on=n.prototype.addListener,n.prototype.once=function(e,t){function n(){this.removeListener(e,n),i||(i=!0,t.apply(this,arguments))}if(!r(t))throw TypeError("listener must be a function");var i=!1;return n.listener=t,this.on(e,n),this},n.prototype.removeListener=function(e,t){var n,i,a,s;if(!r(t))throw TypeError("listener must be a function");if(!this._events||!this._events[e])return this;if(n=this._events[e],a=n.length,i=-1,n===t||r(n.listener)&&n.listener===t)delete this._events[e],this._events.removeListener&&this.emit("removeListener",e,t);else if(o(n)){for(s=a;s-- >0;)if(n[s]===t||n[s].listener&&n[s].listener===t){i=s;break}if(i<0)return this;1===n.length?(n.length=0,delete this._events[e]):n.splice(i,1),this._events.removeListener&&this.emit("removeListener",e,t)}return this},n.prototype.removeAllListeners=function(e){var t,n;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[e]&&delete this._events[e],this;if(0===arguments.length){for(t in this._events)"removeListener"!==t&&this.removeAllListeners(t);return this.removeAllListeners("removeListener"),this._events={},this}if(n=this._events[e],r(n))this.removeListener(e,n);else if(n)for(;n.length;)this.removeListener(e,n[n.length-1]);return delete this._events[e],this},n.prototype.listeners=function(e){return this._events&&this._events[e]?r(this._events[e])?[this._events[e]]:this._events[e].slice():[]},n.prototype.listenerCount=function(e){if(this._events){var t=this._events[e];if(r(t))return 1;if(t)return t.length}return 0},n.listenerCount=function(e,t){return e.listenerCount(t)}},function(e,t){var n={}.toString;e.exports=Array.isArray||function(e){return"[object Array]"==n.call(e)}},function(e,t){e.exports=function(){if("undefined"==typeof window)return null;var e={RTCPeerConnection:window.RTCPeerConnection||window.mozRTCPeerConnection||window.webkitRTCPeerConnection,RTCSessionDescription:window.RTCSessionDescription||window.mozRTCSessionDescription||window.webkitRTCSessionDescription,RTCIceCandidate:window.RTCIceCandidate||window.mozRTCIceCandidate||window.webkitRTCIceCandidate};return e.RTCPeerConnection?e:null}},function(e,t,n){"use strict";(function(t,r){function i(e){return B.from(e)}function o(e){return B.isBuffer(e)||e instanceof F}function a(e,t,n){if("function"==typeof e.prependListener)return e.prependListener(t,n);e._events&&e._events[t]?L(e._events[t])?e._events[t].unshift(n):e._events[t]=[n,e._events[t]]:e.on(t,n)}function s(e,t){O=O||n(3),e=e||{};var r=t instanceof O;this.objectMode=!!e.objectMode,r&&(this.objectMode=this.objectMode||!!e.readableObjectMode);var i=e.highWaterMark,o=e.readableHighWaterMark,a=this.objectMode?16:16384;this.highWaterMark=i||0===i?i:r&&(o||0===o)?o:a,this.highWaterMark=Math.floor(this.highWaterMark),this.buffer=new W,this.length=0,this.pipes=null,this.pipesCount=0,this.flowing=null,this.ended=!1,this.endEmitted=!1,this.reading=!1,this.sync=!0,this.needReadable=!1,this.emittedReadable=!1,this.readableListening=!1,this.resumeScheduled=!1,this.destroyed=!1,this.defaultEncoding=e.defaultEncoding||"utf8",this.awaitDrain=0,this.readingMore=!1,this.decoder=null,this.encoding=null,e.encoding&&(Y||(Y=n(15).StringDecoder),this.decoder=new Y(e.encoding),this.encoding=e.encoding)}function u(e){if(O=O||n(3),!(this instanceof u))return new u(e);this._readableState=new s(e,this),this.readable=!0,e&&("function"==typeof e.read&&(this._read=e.read),"function"==typeof e.destroy&&(this._destroy=e.destroy)),N.call(this)}function c(e,t,n,r,o){var a=e._readableState;if(null===t)a.reading=!1,g(e,a);else{var s;o||(s=l(a,t)),s?e.emit("error",s):a.objectMode||t&&t.length>0?("string"==typeof t||a.objectMode||Object.getPrototypeOf(t)===B.prototype||(t=i(t)),r?a.endEmitted?e.emit("error",new Error("stream.unshift() after end event")):f(e,a,t,!0):a.ended?e.emit("error",new Error("stream.push() after EOF")):(a.reading=!1,a.decoder&&!n?(t=a.decoder.write(t),a.objectMode||0!==t.length?f(e,a,t,!1):v(e,a)):f(e,a,t,!1))):r||(a.reading=!1)}return h(a)}function f(e,t,n,r){t.flowing&&0===t.length&&!t.sync?(e.emit("data",n),e.read(0)):(t.length+=t.objectMode?1:n.length,r?t.buffer.unshift(n):t.buffer.push(n),t.needReadable&&y(e)),v(e,t)}function l(e,t){var n;return o(t)||"string"==typeof t||void 0===t||e.objectMode||(n=new TypeError("Invalid non-string/buffer chunk")),n}function h(e){return!e.ended&&(e.needReadable||e.length<e.highWaterMark||0===e.length)}function d(e){return e>=H?e=H:(e--,e|=e>>>1,e|=e>>>2,e|=e>>>4,e|=e>>>8,e|=e>>>16,e++),e}function p(e,t){return e<=0||0===t.length&&t.ended?0:t.objectMode?1:e!==e?t.flowing&&t.length?t.buffer.head.data.length:t.length:(e>t.highWaterMark&&(t.highWaterMark=d(e)),e<=t.length?e:t.ended?t.length:(t.needReadable=!0,0))}function g(e,t){if(!t.ended){if(t.decoder){var n=t.decoder.end();n&&n.length&&(t.buffer.push(n),t.length+=t.objectMode?1:n.length)}t.ended=!0,y(e)}}function y(e){var t=e._readableState;t.needReadable=!1,t.emittedReadable||(q("emitReadable",t.flowing),t.emittedReadable=!0,t.sync?D.nextTick(m,e):m(e))}function m(e){q("emit readable"),e.emit("readable"),E(e)}function v(e,t){t.readingMore||(t.readingMore=!0,D.nextTick(_,e,t))}function _(e,t){for(var n=t.length;!t.reading&&!t.flowing&&!t.ended&&t.length<t.highWaterMark&&(q("maybeReadMore read 0"),e.read(0),n!==t.length);)n=t.length;t.readingMore=!1}function b(e){return function(){var t=e._readableState;q("pipeOnDrain",t.awaitDrain),t.awaitDrain&&t.awaitDrain--,0===t.awaitDrain&&M(e,"data")&&(t.flowing=!0,E(e))}}function w(e){q("readable nexttick read 0"),e.read(0)}function C(e,t){t.resumeScheduled||(t.resumeScheduled=!0,D.nextTick(T,e,t))}function T(e,t){t.reading||(q("resume read 0"),e.read(0)),t.resumeScheduled=!1,t.awaitDrain=0,e.emit("resume"),E(e),t.flowing&&!t.reading&&e.read(0)}function E(e){var t=e._readableState;for(q("flow",t.flowing);t.flowing&&null!==e.read(););}function S(e,t){if(0===t.length)return null;var n;return t.objectMode?n=t.buffer.shift():!e||e>=t.length?(n=t.decoder?t.buffer.join(""):1===t.buffer.length?t.buffer.head.data:t.buffer.concat(t.length),t.buffer.clear()):n=R(e,t.buffer,t.decoder),n}function R(e,t,n){var r;return e<t.head.data.length?(r=t.head.data.slice(0,e),t.head.data=t.head.data.slice(e)):r=e===t.head.data.length?t.shift():n?A(e,t):k(e,t),r}function A(e,t){var n=t.head,r=1,i=n.data;for(e-=i.length;n=n.next;){var o=n.data,a=e>o.length?o.length:e;if(a===o.length?i+=o:i+=o.slice(0,e),0===(e-=a)){a===o.length?(++r,n.next?t.head=n.next:t.head=t.tail=null):(t.head=n,n.data=o.slice(a));break}++r}return t.length-=r,i}function k(e,t){var n=B.allocUnsafe(e),r=t.head,i=1;for(r.data.copy(n),e-=r.data.length;r=r.next;){var o=r.data,a=e>o.length?o.length:e;if(o.copy(n,n.length-e,0,a),0===(e-=a)){a===o.length?(++i,r.next?t.head=r.next:t.head=t.tail=null):(t.head=r,r.data=o.slice(a));break}++i}return t.length-=i,n}function P(e){var t=e._readableState;if(t.length>0)throw new Error('"endReadable()" called on non-empty stream');t.endEmitted||(t.ended=!0,D.nextTick(I,t,e))}function I(e,t){e.endEmitted||0!==e.length||(e.endEmitted=!0,t.readable=!1,t.emit("end"))}function x(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1}var D=n(7);e.exports=u;var O,L=n(9);u.ReadableState=s;var M=(n(8).EventEmitter,function(e,t){return e.listeners(t).length}),N=n(12),B=n(5).Buffer,F=t.Uint8Array||function(){},U=n(6);U.inherits=n(2);var j=n(28),q=void 0;q=j&&j.debuglog?j.debuglog("stream"):function(){};var Y,W=n(29),z=n(13);U.inherits(u,N);var G=["error","close","destroy","pause","resume"];Object.defineProperty(u.prototype,"destroyed",{get:function(){return void 0!==this._readableState&&this._readableState.destroyed},set:function(e){this._readableState&&(this._readableState.destroyed=e)}}),u.prototype.destroy=z.destroy,u.prototype._undestroy=z.undestroy,u.prototype._destroy=function(e,t){this.push(null),t(e)},u.prototype.push=function(e,t){var n,r=this._readableState;return r.objectMode?n=!0:"string"==typeof e&&(t=t||r.defaultEncoding,t!==r.encoding&&(e=B.from(e,t),t=""),n=!0),c(this,e,t,!1,n)},u.prototype.unshift=function(e){return c(this,e,null,!0,!1)},u.prototype.isPaused=function(){return!1===this._readableState.flowing},u.prototype.setEncoding=function(e){return Y||(Y=n(15).StringDecoder),this._readableState.decoder=new Y(e),this._readableState.encoding=e,this};var H=8388608;u.prototype.read=function(e){q("read",e),e=parseInt(e,10);var t=this._readableState,n=e;if(0!==e&&(t.emittedReadable=!1),0===e&&t.needReadable&&(t.length>=t.highWaterMark||t.ended))return q("read: emitReadable",t.length,t.ended),0===t.length&&t.ended?P(this):y(this),null;if(0===(e=p(e,t))&&t.ended)return 0===t.length&&P(this),null;var r=t.needReadable;q("need readable",r),(0===t.length||t.length-e<t.highWaterMark)&&(r=!0,q("length less than watermark",r)),t.ended||t.reading?(r=!1,q("reading or ended",r)):r&&(q("do read"),t.reading=!0,t.sync=!0,0===t.length&&(t.needReadable=!0),this._read(t.highWaterMark),t.sync=!1,t.reading||(e=p(n,t)));var i;return i=e>0?S(e,t):null,null===i?(t.needReadable=!0,e=0):t.length-=e,0===t.length&&(t.ended||(t.needReadable=!0),n!==e&&t.ended&&P(this)),null!==i&&this.emit("data",i),i},u.prototype._read=function(e){this.emit("error",new Error("_read() is not implemented"))},u.prototype.pipe=function(e,t){function n(e,t){q("onunpipe"),e===h&&t&&!1===t.hasUnpiped&&(t.hasUnpiped=!0,o())}function i(){q("onend"),e.end()}function o(){q("cleanup"),e.removeListener("close",c),e.removeListener("finish",f),e.removeListener("drain",y),e.removeListener("error",u),e.removeListener("unpipe",n),h.removeListener("end",i),h.removeListener("end",l),h.removeListener("data",s),m=!0,!d.awaitDrain||e._writableState&&!e._writableState.needDrain||y()}function s(t){q("ondata"),v=!1,!1!==e.write(t)||v||((1===d.pipesCount&&d.pipes===e||d.pipesCount>1&&-1!==x(d.pipes,e))&&!m&&(q("false write response, pause",h._readableState.awaitDrain),h._readableState.awaitDrain++,v=!0),h.pause())}function u(t){q("onerror",t),l(),e.removeListener("error",u),0===M(e,"error")&&e.emit("error",t)}function c(){e.removeListener("finish",f),l()}function f(){q("onfinish"),e.removeListener("close",c),l()}function l(){q("unpipe"),h.unpipe(e)}var h=this,d=this._readableState;switch(d.pipesCount){case 0:d.pipes=e;break;case 1:d.pipes=[d.pipes,e];break;default:d.pipes.push(e)}d.pipesCount+=1,q("pipe count=%d opts=%j",d.pipesCount,t);var p=(!t||!1!==t.end)&&e!==r.stdout&&e!==r.stderr,g=p?i:l;d.endEmitted?D.nextTick(g):h.once("end",g),e.on("unpipe",n);var y=b(h);e.on("drain",y);var m=!1,v=!1;return h.on("data",s),a(e,"error",u),e.once("close",c),e.once("finish",f),e.emit("pipe",h),d.flowing||(q("pipe resume"),h.resume()),e},u.prototype.unpipe=function(e){var t=this._readableState,n={hasUnpiped:!1};if(0===t.pipesCount)return this;if(1===t.pipesCount)return e&&e!==t.pipes?this:(e||(e=t.pipes),t.pipes=null,t.pipesCount=0,t.flowing=!1,e&&e.emit("unpipe",this,n),this);if(!e){var r=t.pipes,i=t.pipesCount;t.pipes=null,t.pipesCount=0,t.flowing=!1;for(var o=0;o<i;o++)r[o].emit("unpipe",this,n);return this}var a=x(t.pipes,e);return-1===a?this:(t.pipes.splice(a,1),t.pipesCount-=1,1===t.pipesCount&&(t.pipes=t.pipes[0]),e.emit("unpipe",this,n),this)},u.prototype.on=function(e,t){var n=N.prototype.on.call(this,e,t);if("data"===e)!1!==this._readableState.flowing&&this.resume();else if("readable"===e){var r=this._readableState;r.endEmitted||r.readableListening||(r.readableListening=r.needReadable=!0,r.emittedReadable=!1,r.reading?r.length&&y(this):D.nextTick(w,this))}return n},u.prototype.addListener=u.prototype.on,u.prototype.resume=function(){var e=this._readableState;return e.flowing||(q("resume"),e.flowing=!0,C(this,e)),this},u.prototype.pause=function(){return q("call pause flowing=%j",this._readableState.flowing),!1!==this._readableState.flowing&&(q("pause"),this._readableState.flowing=!1,this.emit("pause")),this},u.prototype.wrap=function(e){var t=this,n=this._readableState,r=!1;e.on("end",function(){if(q("wrapped end"),n.decoder&&!n.ended){var e=n.decoder.end();e&&e.length&&t.push(e)}t.push(null)}),e.on("data",function(i){if(q("wrapped data"),n.decoder&&(i=n.decoder.write(i)),(!n.objectMode||null!==i&&void 0!==i)&&(n.objectMode||i&&i.length)){t.push(i)||(r=!0,e.pause())}});for(var i in e)void 0===this[i]&&"function"==typeof e[i]&&(this[i]=function(t){return function(){return e[t].apply(e,arguments)}}(i));for(var o=0;o<G.length;o++)e.on(G[o],this.emit.bind(this,G[o]));return this._read=function(t){q("wrapped _read",t),r&&(r=!1,e.resume())},this},Object.defineProperty(u.prototype,"readableHighWaterMark",{enumerable:!1,get:function(){return this._readableState.highWaterMark}}),u._fromList=S}).call(t,n(0),n(1))},function(e,t,n){e.exports=n(8).EventEmitter},function(e,t,n){"use strict";function r(e,t){var n=this,r=this._readableState&&this._readableState.destroyed,i=this._writableState&&this._writableState.destroyed;return r||i?(t?t(e):!e||this._writableState&&this._writableState.errorEmitted||a.nextTick(o,this,e),this):(this._readableState&&(this._readableState.destroyed=!0),this._writableState&&(this._writableState.destroyed=!0),this._destroy(e||null,function(e){!t&&e?(a.nextTick(o,n,e),n._writableState&&(n._writableState.errorEmitted=!0)):t&&t(e)}),this)}function i(){this._readableState&&(this._readableState.destroyed=!1,this._readableState.reading=!1,this._readableState.ended=!1,this._readableState.endEmitted=!1),this._writableState&&(this._writableState.destroyed=!1,this._writableState.ended=!1,this._writableState.ending=!1,this._writableState.finished=!1,this._writableState.errorEmitted=!1)}function o(e,t){e.emit("error",t)}var a=n(7);e.exports={destroy:r,undestroy:i}},function(e,t,n){"use strict";(function(t,r,i){function o(e){var t=this;this.next=null,this.entry=null,this.finish=function(){A(t,e)}}function a(e){return L.from(e)}function s(e){return L.isBuffer(e)||e instanceof M}function u(){}function c(e,t){P=P||n(3),e=e||{};var r=t instanceof P;this.objectMode=!!e.objectMode,r&&(this.objectMode=this.objectMode||!!e.writableObjectMode);var i=e.highWaterMark,a=e.writableHighWaterMark,s=this.objectMode?16:16384;this.highWaterMark=i||0===i?i:r&&(a||0===a)?a:s,this.highWaterMark=Math.floor(this.highWaterMark),this.finalCalled=!1,this.needDrain=!1,this.ending=!1,this.ended=!1,this.finished=!1,this.destroyed=!1;var u=!1===e.decodeStrings;this.decodeStrings=!u,this.defaultEncoding=e.defaultEncoding||"utf8",this.length=0,this.writing=!1,this.corked=0,this.sync=!0,this.bufferProcessing=!1,this.onwrite=function(e){v(t,e)},this.writecb=null,this.writelen=0,this.bufferedRequest=null,this.lastBufferedRequest=null,this.pendingcb=0,this.prefinished=!1,this.errorEmitted=!1,this.bufferedRequestCount=0,this.corkedRequestsFree=new o(this)}function f(e){if(P=P||n(3),!(B.call(f,this)||this instanceof P))return new f(e);this._writableState=new c(e,this),this.writable=!0,e&&("function"==typeof e.write&&(this._write=e.write),"function"==typeof e.writev&&(this._writev=e.writev),"function"==typeof e.destroy&&(this._destroy=e.destroy),"function"==typeof e.final&&(this._final=e.final)),O.call(this)}function l(e,t){var n=new Error("write after end");e.emit("error",n),k.nextTick(t,n)}function h(e,t,n,r){var i=!0,o=!1;return null===n?o=new TypeError("May not write null values to stream"):"string"==typeof n||void 0===n||t.objectMode||(o=new TypeError("Invalid non-string/buffer chunk")),o&&(e.emit("error",o),k.nextTick(r,o),i=!1),i}function d(e,t,n){return e.objectMode||!1===e.decodeStrings||"string"!=typeof t||(t=L.from(t,n)),t}function p(e,t,n,r,i,o){if(!n){var a=d(t,r,i);r!==a&&(n=!0,i="buffer",r=a)}var s=t.objectMode?1:r.length;t.length+=s;var u=t.length<t.highWaterMark;if(u||(t.needDrain=!0),t.writing||t.corked){var c=t.lastBufferedRequest;t.lastBufferedRequest={chunk:r,encoding:i,isBuf:n,callback:o,next:null},c?c.next=t.lastBufferedRequest:t.bufferedRequest=t.lastBufferedRequest,t.bufferedRequestCount+=1}else g(e,t,!1,s,r,i,o);return u}function g(e,t,n,r,i,o,a){t.writelen=r,t.writecb=a,t.writing=!0,t.sync=!0,n?e._writev(i,t.onwrite):e._write(i,o,t.onwrite),t.sync=!1}function y(e,t,n,r,i){--t.pendingcb,n?(k.nextTick(i,r),k.nextTick(S,e,t),e._writableState.errorEmitted=!0,e.emit("error",r)):(i(r),e._writableState.errorEmitted=!0,e.emit("error",r),S(e,t))}function m(e){e.writing=!1,e.writecb=null,e.length-=e.writelen,e.writelen=0}function v(e,t){var n=e._writableState,r=n.sync,i=n.writecb;if(m(n),t)y(e,n,r,t,i);else{var o=C(n);o||n.corked||n.bufferProcessing||!n.bufferedRequest||w(e,n),r?I(_,e,n,o,i):_(e,n,o,i)}}function _(e,t,n,r){n||b(e,t),t.pendingcb--,r(),S(e,t)}function b(e,t){0===t.length&&t.needDrain&&(t.needDrain=!1,e.emit("drain"))}function w(e,t){t.bufferProcessing=!0;var n=t.bufferedRequest;if(e._writev&&n&&n.next){var r=t.bufferedRequestCount,i=new Array(r),a=t.corkedRequestsFree;a.entry=n;for(var s=0,u=!0;n;)i[s]=n,n.isBuf||(u=!1),n=n.next,s+=1;i.allBuffers=u,g(e,t,!0,t.length,i,"",a.finish),t.pendingcb++,t.lastBufferedRequest=null,a.next?(t.corkedRequestsFree=a.next,a.next=null):t.corkedRequestsFree=new o(t),t.bufferedRequestCount=0}else{for(;n;){var c=n.chunk,f=n.encoding,l=n.callback;if(g(e,t,!1,t.objectMode?1:c.length,c,f,l),n=n.next,t.bufferedRequestCount--,t.writing)break}null===n&&(t.lastBufferedRequest=null)}t.bufferedRequest=n,t.bufferProcessing=!1}function C(e){return e.ending&&0===e.length&&null===e.bufferedRequest&&!e.finished&&!e.writing}function T(e,t){e._final(function(n){t.pendingcb--,n&&e.emit("error",n),t.prefinished=!0,e.emit("prefinish"),S(e,t)})}function E(e,t){t.prefinished||t.finalCalled||("function"==typeof e._final?(t.pendingcb++,t.finalCalled=!0,k.nextTick(T,e,t)):(t.prefinished=!0,e.emit("prefinish")))}function S(e,t){var n=C(t);return n&&(E(e,t),0===t.pendingcb&&(t.finished=!0,e.emit("finish"))),n}function R(e,t,n){t.ending=!0,S(e,t),n&&(t.finished?k.nextTick(n):e.once("finish",n)),t.ended=!0,e.writable=!1}function A(e,t,n){var r=e.entry;for(e.entry=null;r;){var i=r.callback;t.pendingcb--,i(n),r=r.next}t.corkedRequestsFree?t.corkedRequestsFree.next=e:t.corkedRequestsFree=e}var k=n(7);e.exports=f;var P,I=!t.browser&&["v0.10","v0.9."].indexOf(t.version.slice(0,5))>-1?r:k.nextTick;f.WritableState=c;var x=n(6);x.inherits=n(2);var D={deprecate:n(33)},O=n(12),L=n(5).Buffer,M=i.Uint8Array||function(){},N=n(13);x.inherits(f,O),c.prototype.getBuffer=function(){for(var e=this.bufferedRequest,t=[];e;)t.push(e),e=e.next;return t},function(){try{Object.defineProperty(c.prototype,"buffer",{get:D.deprecate(function(){return this.getBuffer()},"_writableState.buffer is deprecated. Use _writableState.getBuffer instead.","DEP0003")})}catch(e){}}();var B;"function"==typeof Symbol&&Symbol.hasInstance&&"function"==typeof Function.prototype[Symbol.hasInstance]?(B=Function.prototype[Symbol.hasInstance],Object.defineProperty(f,Symbol.hasInstance,{value:function(e){return!!B.call(this,e)||this===f&&(e&&e._writableState instanceof c)}})):B=function(e){return e instanceof this},f.prototype.pipe=function(){this.emit("error",new Error("Cannot pipe, not readable"))},f.prototype.write=function(e,t,n){var r=this._writableState,i=!1,o=!r.objectMode&&s(e);return o&&!L.isBuffer(e)&&(e=a(e)),"function"==typeof t&&(n=t,t=null),o?t="buffer":t||(t=r.defaultEncoding),"function"!=typeof n&&(n=u),r.ended?l(this,n):(o||h(this,r,e,n))&&(r.pendingcb++,i=p(this,r,o,e,t,n)),i},f.prototype.cork=function(){this._writableState.corked++},f.prototype.uncork=function(){var e=this._writableState;e.corked&&(e.corked--,e.writing||e.corked||e.finished||e.bufferProcessing||!e.bufferedRequest||w(this,e))},f.prototype.setDefaultEncoding=function(e){if("string"==typeof e&&(e=e.toLowerCase()),!(["hex","utf8","utf-8","ascii","binary","base64","ucs2","ucs-2","utf16le","utf-16le","raw"].indexOf((e+"").toLowerCase())>-1))throw new TypeError("Unknown encoding: "+e);return this._writableState.defaultEncoding=e,this},Object.defineProperty(f.prototype,"writableHighWaterMark",{enumerable:!1,get:function(){return this._writableState.highWaterMark}}),f.prototype._write=function(e,t,n){n(new Error("_write() is not implemented"))},f.prototype._writev=null,f.prototype.end=function(e,t,n){var r=this._writableState;"function"==typeof e?(n=e,e=null,t=null):"function"==typeof t&&(n=t,t=null),null!==e&&void 0!==e&&this.write(e,t),r.corked&&(r.corked=1,this.uncork()),r.ending||r.finished||R(this,r,n)},Object.defineProperty(f.prototype,"destroyed",{get:function(){return void 0!==this._writableState&&this._writableState.destroyed},set:function(e){this._writableState&&(this._writableState.destroyed=e)}}),f.prototype.destroy=N.destroy,f.prototype._undestroy=N.undestroy,f.prototype._destroy=function(e,t){this.end(),t(e)}}).call(t,n(1),n(31).setImmediate,n(0))},function(e,t,n){"use strict";function r(e){if(!e)return"utf8";for(var t;;)switch(e){case"utf8":case"utf-8":return"utf8";case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return"utf16le";case"latin1":case"binary":return"latin1";case"base64":case"ascii":case"hex":return e;default:if(t)return;e=(""+e).toLowerCase(),t=!0}}function i(e){var t=r(e);if("string"!=typeof t&&(v.isEncoding===_||!_(e)))throw new Error("Unknown encoding: "+e);return t||e}function o(e){this.encoding=i(e);var t;switch(this.encoding){case"utf16le":this.text=h,this.end=d,t=4;break;case"utf8":this.fillLast=c,t=4;break;case"base64":this.text=p,this.end=g,t=3;break;default:return this.write=y,void(this.end=m)}this.lastNeed=0,this.lastTotal=0,this.lastChar=v.allocUnsafe(t)}function a(e){return e<=127?0:e>>5==6?2:e>>4==14?3:e>>3==30?4:e>>6==2?-1:-2}function s(e,t,n){var r=t.length-1;if(r<n)return 0;var i=a(t[r]);return i>=0?(i>0&&(e.lastNeed=i-1),i):--r<n||-2===i?0:(i=a(t[r]))>=0?(i>0&&(e.lastNeed=i-2),i):--r<n||-2===i?0:(i=a(t[r]),i>=0?(i>0&&(2===i?i=0:e.lastNeed=i-3),i):0)}function u(e,t,n){if(128!=(192&t[0]))return e.lastNeed=0,"�";if(e.lastNeed>1&&t.length>1){if(128!=(192&t[1]))return e.lastNeed=1,"�";if(e.lastNeed>2&&t.length>2&&128!=(192&t[2]))return e.lastNeed=2,"�"}}function c(e){var t=this.lastTotal-this.lastNeed,n=u(this,e,t);return void 0!==n?n:this.lastNeed<=e.length?(e.copy(this.lastChar,t,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal)):(e.copy(this.lastChar,t,0,e.length),void(this.lastNeed-=e.length))}function f(e,t){var n=s(this,e,t);if(!this.lastNeed)return e.toString("utf8",t);this.lastTotal=n;var r=e.length-(n-this.lastNeed);return e.copy(this.lastChar,0,r),e.toString("utf8",t,r)}function l(e){var t=e&&e.length?this.write(e):"";return this.lastNeed?t+"�":t}function h(e,t){if((e.length-t)%2==0){var n=e.toString("utf16le",t);if(n){var r=n.charCodeAt(n.length-1);if(r>=55296&&r<=56319)return this.lastNeed=2,this.lastTotal=4,this.lastChar[0]=e[e.length-2],this.lastChar[1]=e[e.length-1],n.slice(0,-1)}return n}return this.lastNeed=1,this.lastTotal=2,this.lastChar[0]=e[e.length-1],e.toString("utf16le",t,e.length-1)}function d(e){var t=e&&e.length?this.write(e):"";if(this.lastNeed){var n=this.lastTotal-this.lastNeed;return t+this.lastChar.toString("utf16le",0,n)}return t}function p(e,t){var n=(e.length-t)%3;return 0===n?e.toString("base64",t):(this.lastNeed=3-n,this.lastTotal=3,1===n?this.lastChar[0]=e[e.length-1]:(this.lastChar[0]=e[e.length-2],this.lastChar[1]=e[e.length-1]),e.toString("base64",t,e.length-n))}function g(e){var t=e&&e.length?this.write(e):"";return this.lastNeed?t+this.lastChar.toString("base64",0,3-this.lastNeed):t}function y(e){return e.toString(this.encoding)}function m(e){return e&&e.length?this.write(e):""}var v=n(5).Buffer,_=v.isEncoding||function(e){switch((e=""+e)&&e.toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":case"raw":return!0;default:return!1}};t.StringDecoder=o,o.prototype.write=function(e){if(0===e.length)return"";var t,n;if(this.lastNeed){if(void 0===(t=this.fillLast(e)))return"";n=this.lastNeed,this.lastNeed=0}else n=0;return n<e.length?t?t+this.text(e,n):this.text(e,n):t||""},o.prototype.end=l,o.prototype.text=f,o.prototype.fillLast=function(e){if(this.lastNeed<=e.length)return e.copy(this.lastChar,this.lastTotal-this.lastNeed,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal);e.copy(this.lastChar,this.lastTotal-this.lastNeed,0,e.length),this.lastNeed-=e.length}},function(e,t,n){"use strict";function r(e,t){var n=this._transformState;n.transforming=!1;var r=n.writecb;if(!r)return this.emit("error",new Error("write callback called multiple times"));n.writechunk=null,n.writecb=null,null!=t&&this.push(t),r(e);var i=this._readableState;i.reading=!1,(i.needReadable||i.length<i.highWaterMark)&&this._read(i.highWaterMark)}function i(e){if(!(this instanceof i))return new i(e);s.call(this,e),this._transformState={afterTransform:r.bind(this),needTransform:!1,transforming:!1,writecb:null,writechunk:null,writeencoding:null},this._readableState.needReadable=!0,this._readableState.sync=!1,e&&("function"==typeof e.transform&&(this._transform=e.transform),"function"==typeof e.flush&&(this._flush=e.flush)),this.on("prefinish",o)}function o(){var e=this;"function"==typeof this._flush?this._flush(function(t,n){a(e,t,n)}):a(this,null,null)}function a(e,t,n){if(t)return e.emit("error",t);if(null!=n&&e.push(n),e._writableState.length)throw new Error("Calling transform done when ws.length != 0");if(e._transformState.transforming)throw new Error("Calling transform done when still transforming");return e.push(null)}e.exports=i;var s=n(3),u=n(6);u.inherits=n(2),u.inherits(i,s),i.prototype.push=function(e,t){return this._transformState.needTransform=!1,s.prototype.push.call(this,e,t)},i.prototype._transform=function(e,t,n){throw new Error("_transform() is not implemented")},i.prototype._write=function(e,t,n){var r=this._transformState;if(r.writecb=n,r.writechunk=e,r.writeencoding=t,!r.transforming){var i=this._readableState;(r.needTransform||i.needReadable||i.length<i.highWaterMark)&&this._read(i.highWaterMark)}},i.prototype._read=function(e){var t=this._transformState;null!==t.writechunk&&t.writecb&&!t.transforming?(t.transforming=!0,this._transform(t.writechunk,t.writeencoding,t.afterTransform)):t.needTransform=!0},i.prototype._destroy=function(e,t){var n=this;s.prototype._destroy.call(this,e,function(e){t(e),n.emit("close")})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={DC_PING:"PING",DC_PONG:"PONG",DC_SIGNAL:"SIGNAL",DC_OPEN:"OPEN",DC_REQUEST:"REQUEST",DC_PIECE_NOT_FOUND:"PIECE_NOT_FOUND",DC_CLOSE:"CLOSE",DC_RESPONSE:"RESPONSE",DC_ERROR:"ERROR",DC_PIECE:"PIECE",DC_TIMEOUT:"TIMEOUT",DC_PIECE_ACK:"PIECE_ACK",DC_TRANSITION:"TRANSITION",DC_GRANT:"GRANT",DC_LACK:"LACK",DC_DISPLACE:"DISPLACE",DC_BITFIELD:"BITFIELD",DC_CHOKE:"CHOKE",DC_UNCHOKE:"UNCHOKE",DC_INTERESTED:"INTERESTED",DC_NOTINTERESTED:"NOT_INTERESTED",DC_HAVE:"HAVE",DC_LOST:"LOST",BM_LOST:"lost",SEGMENT:"segment",TRANSITION:"transition",DISPLACE:"displace",CONNECT:"connect",ADOPT:"adopt"},e.exports=t.default},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.getBrowserRTC=t.Buffer=t.Fetcher=t.Events=t.DataChannel=void 0;var i=n(19),o=r(i),a=n(17),s=r(a),u=n(35),c=r(u),f=n(10),l=r(f),h=n(4).Buffer;t.DataChannel=o.default,t.Events=s.default,t.Fetcher=c.default,t.Buffer=h,t.getBrowserRTC=l.default},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function s(e,t,n,r){var i=[];if(r){for(var o=void 0,a=0;a<n-1;a++)o=e.slice(a*t,(a+1)*t),i.push(o);o=e.slice(e.byteLength-r,e.byteLength),i.push(o)}else for(var s=void 0,u=0;u<n;u++)s=e.slice(u*t,(u+1)*t),i.push(s);return i}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=n(20),f=r(c),l=n(8),h=r(l),d=n(17),p=r(d),g=n(4).Buffer,y=function(e){function t(e,n,r,a,s){i(this,t);var u=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return u.engine=e,u.config=s,u.remotePeerId=r,u.channelId=a?n+"-"+r:r+"-"+n,u.connected=!1,u.msgQueue=[],u.miss=0,u.rcvdReqQueue=[],u.downloading=!1,u.uploading=!1,u.delays=[],u._datachannel=new f.default({initiator:a,objectMode:!0}),u.isInitiator=a,u._init(u._datachannel),u.streamingRate=0,u.recordSended=u._adjustStreamingRate(10),u}return a(t,e),u(t,[{key:"_init",value:function(e){var t=this,n=this.engine.logger;e.on("error",function(e){t.emit(p.default.DC_ERROR)}),e.on("signal",function(e){t.emit(p.default.DC_SIGNAL,e)});var r=function(){for(n.info("datachannel CONNECTED to "+t.remotePeerId),t.connected=!0,t.emit(p.default.DC_OPEN),t._sendPing();t.msgQueue.length>0;){var e=t.msgQueue.shift();t.emit(e.event,e)}};e.once("connect",r),e.on("data",function(e){if("string"==typeof e){n.debug("datachannel receive string: "+e+"from "+t.remotePeerId);var r=JSON.parse(e);if(!t.connected)return void t.msgQueue.push(r);switch(r.event){case p.default.DC_PONG:t._handlePongMsg();break;case p.default.DC_PING:t.sendJson({event:p.default.DC_PONG});break;case p.default.DC_PIECE:t._prepareForBinary(r.attachments,r.url,r.sn,r.size),t.emit(r.event,r);break;case p.default.DC_PIECE_NOT_FOUND:window.clearTimeout(t.requestTimeout),t.requestTimeout=null,t.emit(r.event,r);break;case p.default.DC_REQUEST:t._handleRequestMsg(r);break;case p.default.DC_GRANT:t._handleGrant(r);break;case p.default.DC_PIECE_ACK:t._handlePieceAck();break;default:t.emit(r.event,r)}}else t.bufArr.push(e),0===--t.remainAttachments&&(window.clearTimeout(t.requestTimeout),t.requestTimeout=null,t.sendJson({event:p.default.DC_PIECE_ACK,sn:t.bufSN,url:t.bufUrl}),t._handleBinaryData())}),e.once("close",function(){t.emit(p.default.DC_CLOSE)})}},{key:"sendJson",value:function(e){this.send(JSON.stringify(e))}},{key:"send",value:function(e){this._datachannel&&this._datachannel.connected&&this._datachannel.send(e)}},{key:"sendBitField",value:function(e){this.sendJson({event:p.default.DC_BITFIELD,field:e})}},{key:"sendBuffer",value:function(e,t,n){this.uploading=!0,this.uploadTimeout=window.setTimeout(this._uploadtimeout.bind(this),1e3*this.config.dcUploadTimeout);var r=n.byteLength,i=this.config.packetSize,o=0,a=0;r%i==0?a=r/i:(a=Math.floor(r/i)+1,o=r%i);var u={event:p.default.DC_PIECE,attachments:a,url:t,sn:e,size:r};this.sendJson(u);for(var c=s(n,i,a,o),f=0;f<c.length;f++)this.send(c[f]);this.recordSended(r)}},{key:"requestDataByURL",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n={event:p.default.DC_REQUEST,url:e,urgent:t};this.downloading=!0,this.sendJson(n),t&&(this.requestTimeout=window.setTimeout(this._loadtimeout.bind(this),1e3*this.config.dcRequestTimeout))}},{key:"requestDataBySN",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n={event:p.default.DC_REQUEST,sn:e,urgent:t};this.downloading=!0,this.sendJson(n),t&&(this.requestTimeout=window.setTimeout(this._loadtimeout.bind(this),1e3*this.config.dcRequestTimeout))}},{key:"close",value:function(){this.destroy()}},{key:"receiveSignal",value:function(e){this._datachannel.signal(e)}},{key:"destroy",value:function(){window.clearInterval(this.adjustSRInterval),window.clearInterval(this.pinger),this._datachannel.removeAllListeners(),this.removeAllListeners(),this._datachannel.destroy()}},{key:"_handleRequestMsg",value:function(e){this.rcvdReqQueue.length>0?e.urgent?this.rcvdReqQueue.push(e.sn):this.rcvdReqQueue.unshift(e.sn):this.emit(p.default.DC_REQUEST,e)}},{key:"_handlePieceAck",value:function(){if(this.uploading=!1,window.clearTimeout(this.uploadTimeout),this.uploadTimeout=null,this.rcvdReqQueue.length>0){var e=this.rcvdReqQueue.pop();this.emit(p.default.DC_REQUEST,{sn:e})}}},{key:"_prepareForBinary",value:function(e,t,n,r){this.bufArr=[],this.remainAttachments=e,this.bufUrl=t,this.bufSN=n,this.expectedSize=r}},{key:"_handleBinaryData",value:function(){var e=g.concat(this.bufArr);e.byteLength==this.expectedSize&&this.emit(p.default.DC_RESPONSE,{url:this.bufUrl,sn:this.bufSN,data:e}),this.bufUrl="",this.bufArr=[],this.expectedSize=-1,this.downloading=!1}},{key:"_handleGrant",value:function(e){e.TTL>0&&this.emit(p.default.DC_GRANT,e)}},{key:"_adjustStreamingRate",value:function(e){var t=this,n=0;return this.adjustSRInterval=window.setInterval(function(){t.streamingRate=Math.round(8*n/e),n=0},1e3*e),function(e){n+=e}}},{key:"_loadtimeout",value:function(){var e=this.engine.logger;if(e.warn("datachannel timeout while downloading from "+this.remotePeerId),this.emit(p.default.DC_TIMEOUT),this.requestTimeout=null,this.downloading=!1,++this.miss>=this.config.dcTolerance){var t={event:p.default.DC_CLOSE};this.sendJson(t),e.warn("datachannel download miss reach dcTolerance, close "+this.remotePeerId),this.emit(p.default.DC_ERROR)}}},{key:"_uploadtimeout",value:function(){this.engine.logger.warn("datachannel timeout while uploading to "+this.remotePeerId),this.uploading=!1,this.rcvdReqQueue=[]}},{key:"_sendPing",value:function(){var e=this;this.ping=performance.now();for(var t=0;t<this.config.dcPings;t++)this.sendJson({event:p.default.DC_PING});window.setTimeout(function(){if(e.delays.length>0){var t=0,n=!0,r=!1,i=void 0;try{for(var o,a=e.delays[Symbol.iterator]();!(n=(o=a.next()).done);n=!0){t+=o.value}}catch(e){r=!0,i=e}finally{try{!n&&a.return&&a.return()}finally{if(r)throw i}}e.delay=t/e.delays.length,e.delays=[]}},100)}},{key:"_handlePongMsg",value:function(){var e=performance.now()-this.ping;this.delays.push(e)}},{key:"setupStats",value:function(){var e=this,t=this.engine.logger;setInterval(function(){e._datachannel.getStats(function(e,n){t.warn("reports: "+JSON.stringify(n,null,1))})},1e4)}}]),t}(h.default);t.default=y,e.exports=t.default},function(e,t,n){"use strict";(function(t){function r(e){var t=this;if(!(t instanceof r))return new r(e);if(t._id=c(4).toString("hex").slice(0,7),t._debug("new peer %o",e),e=Object.assign({allowHalfOpen:!1},e),f.Duplex.call(t,e),t.channelName=e.initiator?e.channelName||c(20).toString("hex"):null,t._isChromium="undefined"!=typeof window&&!!window.webkitRTCPeerConnection,t.initiator=e.initiator||!1,t.channelConfig=e.channelConfig||r.channelConfig,t.config=e.config||r.config,t.constraints=t._transformConstraints(e.constraints||r.constraints),t.offerConstraints=t._transformConstraints(e.offerConstraints||{}),t.answerConstraints=t._transformConstraints(e.answerConstraints||{}),t.reconnectTimer=e.reconnectTimer||!1,t.sdpTransform=e.sdpTransform||function(e){return e},t.stream=e.stream||!1,t.trickle=void 0===e.trickle||e.trickle,t.destroyed=!1,t.connected=!1,t.remoteAddress=void 0,t.remoteFamily=void 0,t.remotePort=void 0,t.localAddress=void 0,t.localPort=void 0,t._wrtc=e.wrtc&&"object"===o(e.wrtc)?e.wrtc:s(),!t._wrtc)throw"undefined"==typeof window?new Error("No WebRTC support: Specify `opts.wrtc` option in this environment"):new Error("No WebRTC support: Not a supported browser");if(t._pcReady=!1,t._channelReady=!1,t._iceComplete=!1,t._channel=null,t._pendingCandidates=[],t._previousStreams=[],t._chunk=null,t._cb=null,t._interval=null,t._reconnectTimeout=null,t._pc=new t._wrtc.RTCPeerConnection(t.config,t.constraints),t._isWrtc=Array.isArray(t._pc.RTCIceConnectionStates),t._isReactNativeWebrtc="number"==typeof t._pc._peerConnectionId,t._pc.oniceconnectionstatechange=function(){t._onIceStateChange()},t._pc.onicegatheringstatechange=function(){t._onIceStateChange()},t._pc.onsignalingstatechange=function(){t._onSignalingStateChange()},t._pc.onicecandidate=function(e){t._onIceCandidate(e)},t.initiator){var n=!1;t._pc.onnegotiationneeded=function(){n||t._createOffer(),n=!0},t._setupData({channel:t._pc.createDataChannel(t.channelName,t.channelConfig)})}else t._pc.ondatachannel=function(e){t._setupData(e)};"addTrack"in t._pc?(t.stream&&t.stream.getTracks().forEach(function(e){t._pc.addTrack(e,t.stream)}),t._pc.ontrack=function(e){t._onTrack(e)}):(t.stream&&t._pc.addStream(t.stream),t._pc.onaddstream=function(e){t._onAddStream(e)}),t.initiator&&t._isWrtc&&t._pc.onnegotiationneeded(),t._onFinishBound=function(){t._onFinish()},t.once("finish",t._onFinishBound)}function i(){}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};e.exports=r;var a=n(23)("simple-channel"),s=n(10),u=n(2),c=n(26),f=n(27);u(r,f.Duplex),r.WEBRTC_SUPPORT=!!s(),r.config={iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:global.stun.twilio.com:3478?transport=udp"}]},r.constraints={},r.channelConfig={},Object.defineProperty(r.prototype,"bufferSize",{get:function(){var e=this;return e._channel&&e._channel.bufferedAmount||0}}),r.prototype.address=function(){var e=this;return{port:e.localPort,family:"IPv4",address:e.localAddress}},r.prototype.signal=function(e){var t=this;if(t.destroyed)throw new Error("cannot signal after peer is destroyed");if("string"==typeof e)try{e=JSON.parse(e)}catch(t){e={}}t._debug("signal()"),e.candidate&&(t._pc.remoteDescription&&t._pc.remoteDescription.type?t._addIceCandidate(e.candidate):t._pendingCandidates.push(e.candidate)),e.sdp&&t._pc.setRemoteDescription(new t._wrtc.RTCSessionDescription(e),function(){t.destroyed||(t._pendingCandidates.forEach(function(e){t._addIceCandidate(e)}),t._pendingCandidates=[],"offer"===t._pc.remoteDescription.type&&t._createAnswer())},function(e){t.destroy(e)}),e.sdp||e.candidate||t.destroy(new Error("signal() called with invalid signal data"))},r.prototype._addIceCandidate=function(e){var t=this;try{t._pc.addIceCandidate(new t._wrtc.RTCIceCandidate(e),i,function(e){t.destroy(e)})}catch(e){t.destroy(new Error("error adding candidate: "+e.message))}},r.prototype.send=function(e){this._channel.send(e)},r.prototype.destroy=function(e){this._destroy(e,function(){})},r.prototype._destroy=function(e,t){var n=this;if(!n.destroyed){if(n._debug("destroy (error: %s)",e&&(e.message||e)),n.readable=n.writable=!1,n._readableState.ended||n.push(null),n._writableState.finished||n.end(),n.destroyed=!0,n.connected=!1,n._pcReady=!1,n._channelReady=!1,n._previousStreams=null,clearInterval(n._interval),clearTimeout(n._reconnectTimeout),n._interval=null,n._reconnectTimeout=null,n._chunk=null,n._cb=null,n._onFinishBound&&n.removeListener("finish",n._onFinishBound),n._onFinishBound=null,n._pc){try{n._pc.close()}catch(e){}n._pc.oniceconnectionstatechange=null,n._pc.onicegatheringstatechange=null,n._pc.onsignalingstatechange=null,n._pc.onicecandidate=null,"addTrack"in n._pc?n._pc.ontrack=null:n._pc.onaddstream=null,n._pc.onnegotiationneeded=null,n._pc.ondatachannel=null}if(n._channel){try{n._channel.close()}catch(e){}n._channel.onmessage=null,n._channel.onopen=null,n._channel.onclose=null,n._channel.onerror=null}n._pc=null,n._channel=null,e&&n.emit("error",e),n.emit("close"),t()}},r.prototype._setupData=function(e){var t=this;if(!e.channel)return t.destroy(new Error("Data channel event is missing `channel` property"));t._channel=e.channel,t._channel.binaryType="arraybuffer","number"==typeof t._channel.bufferedAmountLowThreshold&&(t._channel.bufferedAmountLowThreshold=65536),t.channelName=t._channel.label,t._channel.onmessage=function(e){t._onChannelMessage(e)},t._channel.onbufferedamountlow=function(){t._onChannelBufferedAmountLow()},t._channel.onopen=function(){t._onChannelOpen()},t._channel.onclose=function(){t._onChannelClose()},t._channel.onerror=function(e){t.destroy(e)}},r.prototype._read=function(){},r.prototype._write=function(e,t,n){var r=this;if(r.destroyed)return n(new Error("cannot write after peer is destroyed"));if(r.connected){try{r.send(e)}catch(e){return r.destroy(e)}r._channel.bufferedAmount>65536?(r._debug("start backpressure: bufferedAmount %d",r._channel.bufferedAmount),r._cb=n):n(null)}else r._debug("write before connect"),r._chunk=e,r._cb=n},r.prototype._onFinish=function(){function e(){setTimeout(function(){t.destroy()},1e3)}var t=this;t.destroyed||(t.connected?e():t.once("connect",e))},r.prototype._createOffer=function(){var e=this;e.destroyed||e._pc.createOffer(function(t){function n(){e.destroyed||(e.trickle||e._iceComplete?i():e.once("_iceComplete",i))}function r(t){e.destroy(t)}function i(){var n=e._pc.localDescription||t;e._debug("signal"),e.emit("signal",{type:n.type,sdp:n.sdp})}e.destroyed||(t.sdp=e.sdpTransform(t.sdp),e._pc.setLocalDescription(t,n,r))},function(t){e.destroy(t)},e.offerConstraints)},r.prototype._createAnswer=function(){var e=this;e.destroyed||e._pc.createAnswer(function(t){function n(){e.destroyed||(e.trickle||e._iceComplete?i():e.once("_iceComplete",i))}function r(t){e.destroy(t)}function i(){var n=e._pc.localDescription||t;e._debug("signal"),e.emit("signal",{type:n.type,sdp:n.sdp})}e.destroyed||(t.sdp=e.sdpTransform(t.sdp),e._pc.setLocalDescription(t,n,r))},function(t){e.destroy(t)},e.answerConstraints)},r.prototype._onIceStateChange=function(){var e=this;if(!e.destroyed){var t=e._pc.iceConnectionState,n=e._pc.iceGatheringState;e._debug("iceStateChange (connection: %s) (gathering: %s)",t,n),e.emit("iceStateChange",t,n),"connected"!==t&&"completed"!==t||(clearTimeout(e._reconnectTimeout),e._pcReady=!0,e._maybeReady()),"disconnected"===t&&(e.reconnectTimer?(clearTimeout(e._reconnectTimeout),e._reconnectTimeout=setTimeout(function(){e.destroy()},e.reconnectTimer)):e.destroy()),"failed"===t&&e.destroy(new Error("Ice connection failed.")),"closed"===t&&e.destroy()}},r.prototype.getStats=function(e){var t=this;0===t._pc.getStats.length?t._pc.getStats().then(function(t){var n=[];t.forEach(function(e){n.push(e)}),e(null,n)},function(t){e(t)}):t._isReactNativeWebrtc?t._pc.getStats(null,function(t){var n=[];t.forEach(function(e){n.push(e)}),e(null,n)},function(t){e(t)}):t._pc.getStats.length>0?t._pc.getStats(function(n){if(!t.destroyed){var r=[];n.result().forEach(function(e){var t={};e.names().forEach(function(n){t[n]=e.stat(n)}),t.id=e.id,t.type=e.type,t.timestamp=e.timestamp,r.push(t)}),e(null,r)}},function(t){e(t)}):e(null,[])},r.prototype._maybeReady=function(){function e(){t.destroyed||t.getStats(function(n,r){function i(e){u=!0;var n=a[e.localCandidateId];n&&n.ip?(t.localAddress=n.ip,t.localPort=Number(n.port)):n&&n.ipAddress?(t.localAddress=n.ipAddress,t.localPort=Number(n.portNumber)):"string"==typeof e.googLocalAddress&&(n=e.googLocalAddress.split(":"),t.localAddress=n[0],t.localPort=Number(n[1]));var r=o[e.remoteCandidateId];r&&r.ip?(t.remoteAddress=r.ip,t.remotePort=Number(r.port)):r&&r.ipAddress?(t.remoteAddress=r.ipAddress,t.remotePort=Number(r.portNumber)):"string"==typeof e.googRemoteAddress&&(r=e.googRemoteAddress.split(":"),t.remoteAddress=r[0],t.remotePort=Number(r[1])),t.remoteFamily="IPv4",t._debug("connect local: %s:%s remote: %s:%s",t.localAddress,t.localPort,t.remoteAddress,t.remotePort)}if(!t.destroyed){n&&(r=[]);var o={},a={},s={},u=!1;if(r.forEach(function(e){"remotecandidate"!==e.type&&"remote-candidate"!==e.type||(o[e.id]=e),"localcandidate"!==e.type&&"local-candidate"!==e.type||(a[e.id]=e),"candidatepair"!==e.type&&"candidate-pair"!==e.type||(s[e.id]=e)}),r.forEach(function(e){"transport"===e.type&&i(s[e.selectedCandidatePairId]),("googCandidatePair"===e.type&&"true"===e.googActiveConnection||("candidatepair"===e.type||"candidate-pair"===e.type)&&e.selected)&&i(e)}),!(u||Object.keys(s).length&&!Object.keys(a).length))return void setTimeout(e,100);if(t._connecting=!1,t.connected=!0,t._chunk){try{t.send(t._chunk)}catch(n){return t.destroy(n)}t._chunk=null,t._debug('sent chunk from "write before connect"');var c=t._cb;t._cb=null,c(null)}"number"!=typeof t._channel.bufferedAmountLowThreshold&&(t._interval=setInterval(function(){t._onInterval()},150),t._interval.unref&&t._interval.unref()),t._debug("connect"),t.emit("connect")}})}var t=this;t._debug("maybeReady pc %s channel %s",t._pcReady,t._channelReady),!t.connected&&!t._connecting&&t._pcReady&&t._channelReady&&(t._connecting=!0,e())},r.prototype._onInterval=function(){var e=this;!e._cb||!e._channel||e._channel.bufferedAmount>65536||e._onChannelBufferedAmountLow()},r.prototype._onSignalingStateChange=function(){var e=this;e.destroyed||(e._debug("signalingStateChange %s",e._pc.signalingState),e.emit("signalingStateChange",e._pc.signalingState))},r.prototype._onIceCandidate=function(e){var t=this;t.destroyed||(e.candidate&&t.trickle?t.emit("signal",{candidate:{candidate:e.candidate.candidate,sdpMLineIndex:e.candidate.sdpMLineIndex,sdpMid:e.candidate.sdpMid}}):e.candidate||(t._iceComplete=!0,t.emit("_iceComplete")))},r.prototype._onChannelMessage=function(e){var n=this;if(!n.destroyed){var r=e.data;r instanceof ArrayBuffer&&(r=t.from(r)),n.push(r)}},r.prototype._onChannelBufferedAmountLow=function(){var e=this;if(!e.destroyed&&e._cb){e._debug("ending backpressure: bufferedAmount %d",e._channel.bufferedAmount);var t=e._cb;e._cb=null,t(null)}},r.prototype._onChannelOpen=function(){var e=this;e.connected||e.destroyed||(e._debug("on channel open"),e._channelReady=!0,e._maybeReady())},r.prototype._onChannelClose=function(){var e=this;e.destroyed||(e._debug("on channel close"),e.destroy())},r.prototype._onAddStream=function(e){var t=this;t.destroyed||(t._debug("on add stream"),t.emit("stream",e.stream))},r.prototype._onTrack=function(e){var t=this;if(!t.destroyed){t._debug("on track");var n=e.streams[0].id;-1===t._previousStreams.indexOf(n)&&(t._previousStreams.push(n),t.emit("stream",e.streams[0]))}},r.prototype._debug=function(){var e=this,t=[].slice.call(arguments);t[0]="["+e._id+"] "+t[0],a.apply(null,t)},r.prototype._transformConstraints=function(e){var t=this;if(0===Object.keys(e).length)return e;if((e.mandatory||e.optional)&&!t._isChromium){var n=Object.assign({},e.optional,e.mandatory);return void 0!==n.OfferToReceiveVideo&&(n.offerToReceiveVideo=n.OfferToReceiveVideo,delete n.OfferToReceiveVideo),void 0!==n.OfferToReceiveAudio&&(n.offerToReceiveAudio=n.OfferToReceiveAudio,delete n.OfferToReceiveAudio),n}return e.mandatory||e.optional||!t._isChromium?e:(void 0!==e.offerToReceiveVideo&&(e.OfferToReceiveVideo=e.offerToReceiveVideo,delete e.offerToReceiveVideo),void 0!==e.offerToReceiveAudio&&(e.OfferToReceiveAudio=e.offerToReceiveAudio,delete e.offerToReceiveAudio),{mandatory:e})}}).call(t,n(4).Buffer)},function(e,t,n){"use strict";function r(e){var t=e.length;if(t%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var n=e.indexOf("=");return-1===n&&(n=t),[n,n===t?0:4-n%4]}function i(e){var t=r(e),n=t[0],i=t[1];return 3*(n+i)/4-i}function o(e,t,n){return 3*(t+n)/4-n}function a(e){for(var t,n=r(e),i=n[0],a=n[1],s=new h(o(e,i,a)),u=0,c=a>0?i-4:i,f=0;f<c;f+=4)t=l[e.charCodeAt(f)]<<18|l[e.charCodeAt(f+1)]<<12|l[e.charCodeAt(f+2)]<<6|l[e.charCodeAt(f+3)],s[u++]=t>>16&255,s[u++]=t>>8&255,s[u++]=255&t;return 2===a&&(t=l[e.charCodeAt(f)]<<2|l[e.charCodeAt(f+1)]>>4,s[u++]=255&t),1===a&&(t=l[e.charCodeAt(f)]<<10|l[e.charCodeAt(f+1)]<<4|l[e.charCodeAt(f+2)]>>2,s[u++]=t>>8&255,s[u++]=255&t),s}function s(e){return f[e>>18&63]+f[e>>12&63]+f[e>>6&63]+f[63&e]}function u(e,t,n){for(var r,i=[],o=t;o<n;o+=3)r=(e[o]<<16&16711680)+(e[o+1]<<8&65280)+(255&e[o+2]),i.push(s(r));return i.join("")}function c(e){for(var t,n=e.length,r=n%3,i=[],o=0,a=n-r;o<a;o+=16383)i.push(u(e,o,o+16383>a?a:o+16383));return 1===r?(t=e[n-1],i.push(f[t>>2]+f[t<<4&63]+"==")):2===r&&(t=(e[n-2]<<8)+e[n-1],i.push(f[t>>10]+f[t>>4&63]+f[t<<2&63]+"=")),i.join("")}t.byteLength=i,t.toByteArray=a,t.fromByteArray=c;for(var f=[],l=[],h="undefined"!=typeof Uint8Array?Uint8Array:Array,d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",p=0,g=d.length;p<g;++p)f[p]=d[p],l[d.charCodeAt(p)]=p;l["-".charCodeAt(0)]=62,l["_".charCodeAt(0)]=63},function(e,t){t.read=function(e,t,n,r,i){var o,a,s=8*i-r-1,u=(1<<s)-1,c=u>>1,f=-7,l=n?i-1:0,h=n?-1:1,d=e[t+l];for(l+=h,o=d&(1<<-f)-1,d>>=-f,f+=s;f>0;o=256*o+e[t+l],l+=h,f-=8);for(a=o&(1<<-f)-1,o>>=-f,f+=r;f>0;a=256*a+e[t+l],l+=h,f-=8);if(0===o)o=1-c;else{if(o===u)return a?NaN:1/0*(d?-1:1);a+=Math.pow(2,r),o-=c}return(d?-1:1)*a*Math.pow(2,o-r)},t.write=function(e,t,n,r,i,o){var a,s,u,c=8*o-i-1,f=(1<<c)-1,l=f>>1,h=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,d=r?0:o-1,p=r?1:-1,g=t<0||0===t&&1/t<0?1:0;for(t=Math.abs(t),isNaN(t)||t===1/0?(s=isNaN(t)?1:0,a=f):(a=Math.floor(Math.log(t)/Math.LN2),t*(u=Math.pow(2,-a))<1&&(a--,u*=2),t+=a+l>=1?h/u:h*Math.pow(2,1-l),t*u>=2&&(a++,u/=2),a+l>=f?(s=0,a=f):a+l>=1?(s=(t*u-1)*Math.pow(2,i),a+=l):(s=t*Math.pow(2,l-1)*Math.pow(2,i),a=0));i>=8;e[n+d]=255&s,d+=p,s/=256,i-=8);for(a=a<<i|s,c+=i;c>0;e[n+d]=255&a,d+=p,a/=256,c-=8);e[n+d-p]|=128*g}},function(e,t,n){(function(r){function i(){return!("undefined"==typeof window||!window.process||"renderer"!==window.process.type)||("undefined"==typeof navigator||!navigator.userAgent||!navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))&&("undefined"!=typeof document&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||"undefined"!=typeof window&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))}function o(e){var n=this.useColors;if(e[0]=(n?"%c":"")+this.namespace+(n?" %c":" ")+e[0]+(n?"%c ":" ")+"+"+t.humanize(this.diff),n){var r="color: "+this.color;e.splice(1,0,r,"color: inherit");var i=0,o=0;e[0].replace(/%[a-zA-Z%]/g,function(e){"%%"!==e&&(i++,"%c"===e&&(o=i))}),e.splice(o,0,r)}}function a(){return"object"==typeof console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)}function s(e){try{null==e?t.storage.removeItem("debug"):t.storage.debug=e}catch(e){}}function u(){var e;try{e=t.storage.debug}catch(e){}return!e&&void 0!==r&&"env"in r&&(e=r.env.DEBUG),e}t=e.exports=n(24),t.log=a,t.formatArgs=o,t.save=s,t.load=u,t.useColors=i,t.storage="undefined"!=typeof chrome&&void 0!==chrome.storage?chrome.storage.local:function(){try{return window.localStorage}catch(e){}}(),t.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"],t.formatters.j=function(e){try{return JSON.stringify(e)}catch(e){return"[UnexpectedJSONParseError]: "+e.message}},t.enable(u())}).call(t,n(1))},function(e,t,n){function r(e){var n,r=0;for(n in e)r=(r<<5)-r+e.charCodeAt(n),r|=0;return t.colors[Math.abs(r)%t.colors.length]}function i(e){function n(){if(n.enabled){var e=n,r=+new Date,o=r-(i||r);e.diff=o,e.prev=i,e.curr=r,i=r;for(var a=new Array(arguments.length),s=0;s<a.length;s++)a[s]=arguments[s];a[0]=t.coerce(a[0]),"string"!=typeof a[0]&&a.unshift("%O");var u=0;a[0]=a[0].replace(/%([a-zA-Z%])/g,function(n,r){if("%%"===n)return n;u++;var i=t.formatters[r];if("function"==typeof i){var o=a[u];n=i.call(e,o),a.splice(u,1),u--}return n}),t.formatArgs.call(e,a);(n.log||t.log||console.log.bind(console)).apply(e,a)}}var i;return n.namespace=e,n.enabled=t.enabled(e),n.useColors=t.useColors(),n.color=r(e),n.destroy=o,"function"==typeof t.init&&t.init(n),t.instances.push(n),n}function o(){var e=t.instances.indexOf(this);return-1!==e&&(t.instances.splice(e,1),!0)}function a(e){t.save(e),t.names=[],t.skips=[];var n,r=("string"==typeof e?e:"").split(/[\s,]+/),i=r.length;for(n=0;n<i;n++)r[n]&&(e=r[n].replace(/\*/g,".*?"),"-"===e[0]?t.skips.push(new RegExp("^"+e.substr(1)+"$")):t.names.push(new RegExp("^"+e+"$")));for(n=0;n<t.instances.length;n++){var o=t.instances[n];o.enabled=t.enabled(o.namespace)}}function s(){t.enable("")}function u(e){if("*"===e[e.length-1])return!0;var n,r;for(n=0,r=t.skips.length;n<r;n++)if(t.skips[n].test(e))return!1;for(n=0,r=t.names.length;n<r;n++)if(t.names[n].test(e))return!0;return!1}function c(e){return e instanceof Error?e.stack||e.message:e}t=e.exports=i.debug=i.default=i,t.coerce=c,t.disable=s,t.enable=a,t.enabled=u,t.humanize=n(25),t.instances=[],t.names=[],t.skips=[],t.formatters={}},function(e,t){function n(e){if(e=String(e),!(e.length>100)){var t=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(e);if(t){var n=parseFloat(t[1]);switch((t[2]||"ms").toLowerCase()){case"years":case"year":case"yrs":case"yr":case"y":return n*f;case"days":case"day":case"d":return n*c;case"hours":case"hour":case"hrs":case"hr":case"h":return n*u;case"minutes":case"minute":case"mins":case"min":case"m":return n*s;case"seconds":case"second":case"secs":case"sec":case"s":return n*a;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return n;default:return}}}}function r(e){return e>=c?Math.round(e/c)+"d":e>=u?Math.round(e/u)+"h":e>=s?Math.round(e/s)+"m":e>=a?Math.round(e/a)+"s":e+"ms"}function i(e){return o(e,c,"day")||o(e,u,"hour")||o(e,s,"minute")||o(e,a,"second")||e+" ms"}function o(e,t,n){if(!(e<t))return e<1.5*t?Math.floor(e/t)+" "+n:Math.ceil(e/t)+" "+n+"s"}var a=1e3,s=60*a,u=60*s,c=24*u,f=365.25*c;e.exports=function(e,t){t=t||{};var o=typeof e;if("string"===o&&e.length>0)return n(e);if("number"===o&&!1===isNaN(e))return t.long?i(e):r(e);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(e))}},function(e,t,n){"use strict";(function(t,r){function i(){throw new Error("Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11")}function o(e,n){if(e>65536)throw new Error("requested too many random bytes");var i=new t.Uint8Array(e);e>0&&s.getRandomValues(i);var o=a.from(i.buffer);return"function"==typeof n?r.nextTick(function(){n(null,o)}):o}var a=n(5).Buffer,s=t.crypto||t.msCrypto;s&&s.getRandomValues?e.exports=o:e.exports=i}).call(t,n(0),n(1))},function(e,t,n){t=e.exports=n(11),t.Stream=t,t.Readable=t,t.Writable=n(14),t.Duplex=n(3),t.Transform=n(16),t.PassThrough=n(34)},function(e,t){},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t,n){e.copy(t,n)}var o=n(5).Buffer,a=n(30);e.exports=function(){function e(){r(this,e),this.head=null,this.tail=null,this.length=0}return e.prototype.push=function(e){var t={data:e,next:null};this.length>0?this.tail.next=t:this.head=t,this.tail=t,++this.length},e.prototype.unshift=function(e){var t={data:e,next:this.head};0===this.length&&(this.tail=t),this.head=t,++this.length},e.prototype.shift=function(){if(0!==this.length){var e=this.head.data;return 1===this.length?this.head=this.tail=null:this.head=this.head.next,--this.length,e}},e.prototype.clear=function(){this.head=this.tail=null,this.length=0},e.prototype.join=function(e){if(0===this.length)return"";for(var t=this.head,n=""+t.data;t=t.next;)n+=e+t.data;return n},e.prototype.concat=function(e){if(0===this.length)return o.alloc(0);if(1===this.length)return this.head.data;for(var t=o.allocUnsafe(e>>>0),n=this.head,r=0;n;)i(n.data,t,r),r+=n.data.length,n=n.next;return t},e}(),a&&a.inspect&&a.inspect.custom&&(e.exports.prototype[a.inspect.custom]=function(){var e=a.inspect({length:this.length});return this.constructor.name+" "+e})},function(e,t){},function(e,t,n){(function(e){function r(e,t){this._id=e,this._clearFn=t}var i=void 0!==e&&e||"undefined"!=typeof self&&self||window,o=Function.prototype.apply;t.setTimeout=function(){return new r(o.call(setTimeout,i,arguments),clearTimeout)},t.setInterval=function(){return new r(o.call(setInterval,i,arguments),clearInterval)},t.clearTimeout=t.clearInterval=function(e){e&&e.close()},r.prototype.unref=r.prototype.ref=function(){},r.prototype.close=function(){this._clearFn.call(i,this._id)},t.enroll=function(e,t){clearTimeout(e._idleTimeoutId),e._idleTimeout=t},t.unenroll=function(e){clearTimeout(e._idleTimeoutId),e._idleTimeout=-1},t._unrefActive=t.active=function(e){clearTimeout(e._idleTimeoutId);var t=e._idleTimeout;t>=0&&(e._idleTimeoutId=setTimeout(function(){e._onTimeout&&e._onTimeout()},t))},n(32),t.setImmediate="undefined"!=typeof self&&self.setImmediate||void 0!==e&&e.setImmediate||this&&this.setImmediate,t.clearImmediate="undefined"!=typeof self&&self.clearImmediate||void 0!==e&&e.clearImmediate||this&&this.clearImmediate}).call(t,n(0))},function(e,t,n){(function(e,t){!function(e,n){"use strict";function r(e){"function"!=typeof e&&(e=new Function(""+e));for(var t=new Array(arguments.length-1),n=0;n<t.length;n++)t[n]=arguments[n+1];var r={callback:e,args:t};return c[u]=r,s(u),u++}function i(e){delete c[e]}function o(e){var t=e.callback,r=e.args;switch(r.length){case 0:t();break;case 1:t(r[0]);break;case 2:t(r[0],r[1]);break;case 3:t(r[0],r[1],r[2]);break;default:t.apply(n,r)}}function a(e){if(f)setTimeout(a,0,e);else{var t=c[e];if(t){f=!0;try{o(t)}finally{i(e),f=!1}}}}if(!e.setImmediate){var s,u=1,c={},f=!1,l=e.document,h=Object.getPrototypeOf&&Object.getPrototypeOf(e);h=h&&h.setTimeout?h:e,"[object process]"==={}.toString.call(e.process)?function(){s=function(e){t.nextTick(function(){a(e)})}}():function(){if(e.postMessage&&!e.importScripts){var t=!0,n=e.onmessage;return e.onmessage=function(){t=!1},e.postMessage("","*"),e.onmessage=n,t}}()?function(){var t="setImmediate$"+Math.random()+"$",n=function(n){n.source===e&&"string"==typeof n.data&&0===n.data.indexOf(t)&&a(+n.data.slice(t.length))};e.addEventListener?e.addEventListener("message",n,!1):e.attachEvent("onmessage",n),s=function(n){e.postMessage(t+n,"*")}}():e.MessageChannel?function(){var e=new MessageChannel;e.port1.onmessage=function(e){a(e.data)},s=function(t){e.port2.postMessage(t)}}():l&&"onreadystatechange"in l.createElement("script")?function(){var e=l.documentElement;s=function(t){var n=l.createElement("script");n.onreadystatechange=function(){a(t),n.onreadystatechange=null,e.removeChild(n),n=null},e.appendChild(n)}}():function(){s=function(e){setTimeout(a,0,e)}}(),h.setImmediate=r,h.clearImmediate=i}}("undefined"==typeof self?void 0===e?this:e:self)}).call(t,n(0),n(1))},function(e,t,n){(function(t){function n(e,t){function n(){if(!i){if(r("throwDeprecation"))throw new Error(t);r("traceDeprecation")?console.trace(t):console.warn(t),i=!0}return e.apply(this,arguments)}if(r("noDeprecation"))return e;var i=!1;return n}function r(e){try{if(!t.localStorage)return!1}catch(e){return!1}var n=t.localStorage[e];return null!=n&&"true"===String(n).toLowerCase()}e.exports=n}).call(t,n(0))},function(e,t,n){"use strict";function r(e){if(!(this instanceof r))return new r(e);i.call(this,e)}e.exports=r;var i=n(16),o=n(6);o.inherits=n(2),o.inherits(r,i),r.prototype._transform=function(e,t,n){n(null,e)}},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=function(){function e(t,n,i,o,a){r(this,e),this.engine=t,this.browserInfo=a;var s="?key="+window.encodeURIComponent(n)+"&info_hash="+i;this.announceURL=o+"/announce/"+s+"&browser="+a.browser+"&device="+a.device+"&host="+a.host,this.heartbeatURL=o+"/heartbeat/"+s,this.getPeersURL=o+"/get_peers/"+s,this.statsURL=o+"/stats/"+s,this.limit=10240,this.conns=0,this.failConns=0,this.totalHTTPDownloaded=0,this.totalP2PDownloaded=0,this.httpDownloaded=0,this.p2pDownloaded=0,this.errsFragLoad=0,this.errsBufStalled=0,this.errsInternalExpt=0}return i(e,[{key:"btAnnounce",value:function(){var e=this,t=this.engine.logger;return new Promise(function(n,r){fetch(e.announceURL).then(function(e){return e.json()}).then(function(t){e.peerId=t.peer_id,n(t)}).catch(function(e){t.error("[fetcher] btAnnounce error "+e),r(e)})})}},{key:"btHeartbeat",value:function(e){var t=this,n=this.engine.logger;this.heartbeater=window.setInterval(function(){fetch(t.heartbeatURL+"&peer_id="+t.peerId).then(function(e){}).catch(function(e){window.clearInterval(t.heartbeater),n.error("[fetcher] btHeartbeat error "+e)})},1e3*e)}},{key:"btGetPeers",value:function(){var e=this,t=this.engine.logger;return new Promise(function(n,r){fetch(e.getPeersURL+"&peer_id="+e.peerId).then(function(e){return e.json()}).then(function(e){n(e)}).catch(function(e){t.error("[fetcher] btGetPeers error "+e),r(e)})})}},{key:"increConns",value:function(){this.conns++}},{key:"decreConns",value:function(){this.conns--}},{key:"increFailConns",value:function(){this.failConns++}},{key:"btStatsStart",value:function(e){this.limit=1024*e}},{key:"reportFlow",value:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=Math.round(e.total/1024);t?(this.p2pDownloaded+=n,this.totalP2PDownloaded+=n):(this.httpDownloaded+=n,this.totalHTTPDownloaded+=n),this.engine.emit("stats",{totalHTTPDownloaded:this.totalHTTPDownloaded,totalP2PDownloaded:this.totalP2PDownloaded}),this._checkFlowLimit()}},{key:"destroy",value:function(){window.clearInterval(this.heartbeater)}},{key:"_checkFlowLimit",value:function(){var e=this,t=this.engine.logger;if(this.p2pDownloaded>=this.limit||this.httpDownloaded>=this.limit){var n={source:Math.round(this.httpDownloaded),p2p:Math.round(this.p2pDownloaded)};0!==this.conns&&(n.conns=this.conns),this.failConns>0&&(n.failConns=this.failConns),this.errsFragLoad>0&&(n.errsFragLoad=this.errsFragLoad),this.errsBufStalled>0&&(n.errsBufStalled=this.errsBufStalled),this.errsInternalExpt>0&&(n.errsInternalExpt=this.errsInternalExpt),t.info("reporting flow p2p "+this.p2pDownloaded+" http "+this.httpDownloaded),fetch(this.statsURL+"&peer_id="+this.peerId,{method:"POST",body:JSON.stringify(n)}).then(function(n){n.ok&&(t.info("sucessfully report flow"),e.httpDownloaded=0,e.p2pDownloaded=0,e.conns=0,e.failConns=0,e.errsFragLoad=0,e.errsBufStalled=0,e.errsInternalExpt=0)}).catch(function(e){t.error("[fetcher] stats upload error "+e)})}}}]),e}();t.default=o,e.exports=t.default}])});

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(0);

var _events2 = _interopRequireDefault(_events);

var _reconnectingWebsocket = __webpack_require__(3);

var _reconnectingWebsocket2 = _interopRequireDefault(_reconnectingWebsocket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SignalClient = function (_EventEmitter) {
    _inherits(SignalClient, _EventEmitter);

    function SignalClient(engine, peerId, config) {
        _classCallCheck(this, SignalClient);

        var _this = _possibleConstructorReturn(this, (SignalClient.__proto__ || Object.getPrototypeOf(SignalClient)).call(this));

        _this.engine = engine;
        _this.peerId = peerId;
        _this.config = config;
        _this.connected = false;
        _this._ws = _this._init(peerId);
        return _this;
    }

    _createClass(SignalClient, [{
        key: '_init',
        value: function _init(id) {
            var _this2 = this;

            var logger = this.engine.logger;

            var wsOptions = {
                maxRetries: this.config.wsMaxRetries,
                minReconnectionDelay: this.config.wsReconnectInterval * 1000
            };
            var queryStr = '?id=' + id;
            var websocket = new _reconnectingWebsocket2.default(this.config.wsSignalerAddr + queryStr, undefined, wsOptions);
            websocket.onopen = function () {
                logger.info('Signaler websocket connection opened');

                _this2.connected = true;
                if (_this2.onopen) _this2.onopen();
            };

            websocket.push = websocket.send;
            websocket.send = function (msg) {
                var msgStr = JSON.stringify(Object.assign({ peer_id: id }, msg));
                websocket.push(msgStr);
            };
            websocket.onmessage = function (e) {

                if (_this2.onmessage) _this2.onmessage(e);
            };
            websocket.onclose = function () {
                //websocket断开时清除datachannel
                logger.warn('Signaler websocket closed');
                if (_this2.onclose) _this2.onclose();
                _this2.connected = false;
            };
            return websocket;
        }
    }, {
        key: 'sendSignal',
        value: function sendSignal(remotePeerId, data) {
            var msg = {
                action: 'signal',
                peer_id: this.peerId,
                to_peer_id: remotePeerId,
                data: data
            };
            this.send(msg);
        }
    }, {
        key: 'send',
        value: function send(msg) {
            this._ws.send(msg);
        }
    }, {
        key: 'close',
        value: function close() {
            this._ws.close();
            this._ws = null;
        }
    }]);

    return SignalClient;
}(_events2.default);

exports.default = SignalClient;
module.exports = exports['default'];

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(0);

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FragLoader = function (_EventEmitter) {
    _inherits(FragLoader, _EventEmitter);

    function FragLoader(config) {
        _classCallCheck(this, FragLoader);

        var _this = _possibleConstructorReturn(this, (FragLoader.__proto__ || Object.getPrototypeOf(FragLoader)).call(this));

        _this.logger = config.logger;
        //denoted by sn
        _this.currLoaded = config.currLoaded;
        _this.currLoadedDuration = config.currLoadedDuration; //最新下载的块的时长
        _this.currPlay = config.currPlay;

        _this.bufMgr = config.bufMgr;
        _this.xhrLoader = new config.loader(config);
        _this.p2pEnabled = config.p2pEnabled;
        _this.scheduler = config.scheduler;
        _this.fetcher = config.fetcher;
        return _this;
    }

    _createClass(FragLoader, [{
        key: 'destroy',
        value: function destroy() {
            this.abort();
        }
    }, {
        key: 'abort',
        value: function abort() {
            this.xhrLoader.abort();
        }

        /*
         首先从缓存中寻找请求的seg，如果缓存中找不到则用http请求。
         */

    }, {
        key: 'load',
        value: function load(context, config, callbacks) {
            var _this2 = this;

            var logger = this.logger;

            var frag = context.frag;
            frag.loadByP2P = false; //初始化flag
            frag.loadByHTTP = false;
            if (this.bufMgr.hasSegOfURL(frag.relurl)) {
                //如果命中缓存
                logger.debug('bufMgr found seg sn ' + frag.sn + ' url ' + frag.relurl);
                var seg = this.bufMgr.getSegByURL(frag.relurl);
                var response = { url: context.url, data: seg.data },
                    trequest = void 0,
                    tfirst = void 0,
                    tload = void 0,
                    loaded = void 0,
                    total = void 0;
                trequest = performance.now();
                tfirst = tload = trequest + 50;
                loaded = total = frag.loaded = seg.size;
                var stats = { trequest: trequest, tfirst: tfirst, tload: tload, loaded: loaded, total: total, retry: 0 };
                frag.loadByP2P = true;
                window.setTimeout(function () {
                    //必须是异步回调
                    _this2.fetcher.reportFlow(stats, true);
                    callbacks.onSuccess(response, stats, context);
                }, 50);
            } else if (this.scheduler.peersHasSN(frag.sn)) {
                //如果在peers的bitmap中找到
                logger.info('found sn ' + frag.sn + ' from peers');
                context.frag.loadByP2P = true;
                this.scheduler.load(context, config, callbacks);
                callbacks.onTimeout = function (stats, context) {
                    //如果P2P下载超时则立即切换到xhr下载
                    logger.debug('xhrLoader load ' + frag.relurl + ' at ' + frag.sn);
                    frag.loadByP2P = false;
                    frag.loadByHTTP = true;
                    _this2.xhrLoader.load(context, config, callbacks);
                };
                var onSuccess = callbacks.onSuccess;
                callbacks.onSuccess = function (response, stats, context) {
                    //在onsucess回调中复制并缓存二进制数据
                    if (!_this2.bufMgr.hasSegOfURL(frag.relurl)) {
                        _this2.bufMgr.copyAndAddBuffer(response.data, frag.relurl, frag.sn);
                    }
                    _this2.fetcher.reportFlow(stats, true);
                    frag.loaded = stats.loaded;
                    onSuccess(response, stats, context);
                };
            } else {
                logger.debug('xhrLoader load ' + frag.relurl + ' at ' + frag.sn);
                context.frag.loadByHTTP = true;
                this.xhrLoader.load(context, config, callbacks);
                var _onSuccess = callbacks.onSuccess;
                callbacks.onSuccess = function (response, stats, context) {
                    //在onsucess回调中复制并缓存二进制数据
                    if (!_this2.bufMgr.hasSegOfURL(frag.relurl)) {
                        _this2.bufMgr.copyAndAddBuffer(response.data, frag.relurl, frag.sn);
                    }
                    _this2.fetcher.reportFlow(stats, false);
                    _onSuccess(response, stats, context);
                };
            }
        }
    }]);

    return FragLoader;
}(_events2.default);

exports.default = FragLoader;
module.exports = exports['default'];

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(0);

var _events2 = _interopRequireDefault(_events);

var _cdnbyeCore = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BufferManager = function (_EventEmitter) {
    _inherits(BufferManager, _EventEmitter);

    function BufferManager(engine, config) {
        _classCallCheck(this, BufferManager);

        var _this = _possibleConstructorReturn(this, (BufferManager.__proto__ || Object.getPrototypeOf(BufferManager)).call(this));

        _this.engine = engine;
        _this.config = config;
        /* segment
        sn: number
        relurl: string
        data: Buffer
        size: string
         */
        _this._segPool = new Map(); //存放seg的Map            relurl -> segment
        _this._currBufSize = 0; //目前的buffer总大小
        _this.sn2Url = new Map(); //以sn查找relurl      sn -> relurl
        _this.overflowed = false; //缓存是否溢出
        return _this;
    }

    _createClass(BufferManager, [{
        key: 'hasSegOfURL',
        value: function hasSegOfURL(url) {
            //防止重复加入seg
            return this._segPool.has(url);
        }
    }, {
        key: 'copyAndAddBuffer',
        value: function copyAndAddBuffer(data, url, sn) {
            //先复制再缓存
            var payloadBuf = _cdnbyeCore.Buffer.from(data);
            var byteLength = payloadBuf.byteLength;
            var targetBuffer = new _cdnbyeCore.Buffer(byteLength);
            payloadBuf.copy(targetBuffer);

            var segment = {
                sn: sn,
                relurl: url,
                data: targetBuffer,
                size: byteLength
            };

            this.addSeg(segment);
            this.sn2Url.set(sn, url);
        }
    }, {
        key: 'addBuffer',
        value: function addBuffer(sn, url, buf) {
            //直接缓存
            var segment = {
                sn: sn,
                relurl: url,
                data: buf,
                size: buf.byteLength
            };
            this.addSeg(segment);
            this.sn2Url.set(sn, url);
        }
    }, {
        key: 'addSeg',
        value: function addSeg(seg) {
            var logger = this.engine.logger;

            this._segPool.set(seg.relurl, seg);
            // this.urlSet.add(seg.relurl);
            this._currBufSize += parseInt(seg.size);
            // logger.debug(`seg.size ${seg.size} _currBufSize ${this._currBufSize} maxBufSize ${this.config.maxBufSize}`);
            while (this._currBufSize > this.config.maxBufSize) {
                //去掉多余的数据
                var lastSeg = [].concat(_toConsumableArray(this._segPool.values())).shift();
                logger.info('pop seg ' + lastSeg.relurl + ' at ' + lastSeg.sn);
                this._segPool.delete(lastSeg.relurl);
                this.sn2Url.delete(lastSeg.sn);
                this._currBufSize -= parseInt(lastSeg.size);
                if (!this.overflowed) this.overflowed = true;
                this.emit(_cdnbyeCore.Events.BM_LOST, lastSeg.sn);
            }
        }
    }, {
        key: 'getSegByURL',
        value: function getSegByURL(relurl) {
            return this._segPool.get(relurl);
        }
    }, {
        key: 'getURLbySN',
        value: function getURLbySN(sn) {
            return this.sn2Url.get(sn);
        }
    }, {
        key: 'clear',
        value: function clear() {
            this._segPool.clear();
            this.sn2Url.clear();
            this._currBufSize = 0;
        }
    }, {
        key: 'currBufSize',
        get: function get() {
            return this._currBufSize;
        }
    }]);

    return BufferManager;
}(_events2.default);

exports.default = BufferManager;
module.exports = exports['default'];

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/**
 * UAParser.js v0.7.17
 * Lightweight JavaScript-based User-Agent string parser
 * https://github.com/faisalman/ua-parser-js
 *
 * Copyright © 2012-2016 Faisal Salman <fyzlman@gmail.com>
 * Dual licensed under GPLv2 & MIT
 */

(function (window, undefined) {

    'use strict';

    //////////////
    // Constants
    /////////////


    var LIBVERSION  = '0.7.17',
        EMPTY       = '',
        UNKNOWN     = '?',
        FUNC_TYPE   = 'function',
        UNDEF_TYPE  = 'undefined',
        OBJ_TYPE    = 'object',
        STR_TYPE    = 'string',
        MAJOR       = 'major', // deprecated
        MODEL       = 'model',
        NAME        = 'name',
        TYPE        = 'type',
        VENDOR      = 'vendor',
        VERSION     = 'version',
        ARCHITECTURE= 'architecture',
        CONSOLE     = 'console',
        MOBILE      = 'mobile',
        TABLET      = 'tablet',
        SMARTTV     = 'smarttv',
        WEARABLE    = 'wearable',
        EMBEDDED    = 'embedded';


    ///////////
    // Helper
    //////////


    var util = {
        extend : function (regexes, extensions) {
            var margedRegexes = {};
            for (var i in regexes) {
                if (extensions[i] && extensions[i].length % 2 === 0) {
                    margedRegexes[i] = extensions[i].concat(regexes[i]);
                } else {
                    margedRegexes[i] = regexes[i];
                }
            }
            return margedRegexes;
        },
        has : function (str1, str2) {
          if (typeof str1 === "string") {
            return str2.toLowerCase().indexOf(str1.toLowerCase()) !== -1;
          } else {
            return false;
          }
        },
        lowerize : function (str) {
            return str.toLowerCase();
        },
        major : function (version) {
            return typeof(version) === STR_TYPE ? version.replace(/[^\d\.]/g,'').split(".")[0] : undefined;
        },
        trim : function (str) {
          return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        }
    };


    ///////////////
    // Map helper
    //////////////


    var mapper = {

        rgx : function (ua, arrays) {

            //var result = {},
            var i = 0, j, k, p, q, matches, match;//, args = arguments;

            /*// construct object barebones
            for (p = 0; p < args[1].length; p++) {
                q = args[1][p];
                result[typeof q === OBJ_TYPE ? q[0] : q] = undefined;
            }*/

            // loop through all regexes maps
            while (i < arrays.length && !matches) {

                var regex = arrays[i],       // even sequence (0,2,4,..)
                    props = arrays[i + 1];   // odd sequence (1,3,5,..)
                j = k = 0;

                // try matching uastring with regexes
                while (j < regex.length && !matches) {

                    matches = regex[j++].exec(ua);

                    if (!!matches) {
                        for (p = 0; p < props.length; p++) {
                            match = matches[++k];
                            q = props[p];
                            // check if given property is actually array
                            if (typeof q === OBJ_TYPE && q.length > 0) {
                                if (q.length == 2) {
                                    if (typeof q[1] == FUNC_TYPE) {
                                        // assign modified match
                                        this[q[0]] = q[1].call(this, match);
                                    } else {
                                        // assign given value, ignore regex match
                                        this[q[0]] = q[1];
                                    }
                                } else if (q.length == 3) {
                                    // check whether function or regex
                                    if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                                        // call function (usually string mapper)
                                        this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
                                    } else {
                                        // sanitize match using given regex
                                        this[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
                                    }
                                } else if (q.length == 4) {
                                        this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
                                }
                            } else {
                                this[q] = match ? match : undefined;
                            }
                        }
                    }
                }
                i += 2;
            }
            // console.log(this);
            //return this;
        },

        str : function (str, map) {

            for (var i in map) {
                // check if array
                if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
                    for (var j = 0; j < map[i].length; j++) {
                        if (util.has(map[i][j], str)) {
                            return (i === UNKNOWN) ? undefined : i;
                        }
                    }
                } else if (util.has(map[i], str)) {
                    return (i === UNKNOWN) ? undefined : i;
                }
            }
            return str;
        }
    };


    ///////////////
    // String map
    //////////////


    var maps = {

        browser : {
            oldsafari : {
                version : {
                    '1.0'   : '/8',
                    '1.2'   : '/1',
                    '1.3'   : '/3',
                    '2.0'   : '/412',
                    '2.0.2' : '/416',
                    '2.0.3' : '/417',
                    '2.0.4' : '/419',
                    '?'     : '/'
                }
            }
        },

        device : {
            amazon : {
                model : {
                    'Fire Phone' : ['SD', 'KF']
                }
            },
            sprint : {
                model : {
                    'Evo Shift 4G' : '7373KT'
                },
                vendor : {
                    'HTC'       : 'APA',
                    'Sprint'    : 'Sprint'
                }
            }
        },

        os : {
            windows : {
                version : {
                    'ME'        : '4.90',
                    'NT 3.11'   : 'NT3.51',
                    'NT 4.0'    : 'NT4.0',
                    '2000'      : 'NT 5.0',
                    'XP'        : ['NT 5.1', 'NT 5.2'],
                    'Vista'     : 'NT 6.0',
                    '7'         : 'NT 6.1',
                    '8'         : 'NT 6.2',
                    '8.1'       : 'NT 6.3',
                    '10'        : ['NT 6.4', 'NT 10.0'],
                    'RT'        : 'ARM'
                }
            }
        }
    };


    //////////////
    // Regex map
    /////////////


    var regexes = {

        browser : [[

            // Presto based
            /(opera\smini)\/([\w\.-]+)/i,                                       // Opera Mini
            /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,                      // Opera Mobi/Tablet
            /(opera).+version\/([\w\.]+)/i,                                     // Opera > 9.80
            /(opera)[\/\s]+([\w\.]+)/i                                          // Opera < 9.80
            ], [NAME, VERSION], [

            /(opios)[\/\s]+([\w\.]+)/i                                          // Opera mini on iphone >= 8.0
            ], [[NAME, 'Opera Mini'], VERSION], [

            /\s(opr)\/([\w\.]+)/i                                               // Opera Webkit
            ], [[NAME, 'Opera'], VERSION], [

            // Mixed
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i,
                                                                                // Lunascape/Maxthon/Netfront/Jasmine/Blazer

            // Trident based
            /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,
                                                                                // Avant/IEMobile/SlimBrowser/Baidu
            /(?:ms|\()(ie)\s([\w\.]+)/i,                                        // Internet Explorer

            // Webkit/KHTML based
            /(rekonq)\/([\w\.]+)*/i,                                            // Rekonq
            /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser)\/([\w\.-]+)/i
                                                                                // Chromium/Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser
            ], [NAME, VERSION], [

            /(trident).+rv[:\s]([\w\.]+).+like\sgecko/i                         // IE11
            ], [[NAME, 'IE'], VERSION], [

            /(edge)\/((\d+)?[\w\.]+)/i                                          // Microsoft Edge
            ], [NAME, VERSION], [

            /(yabrowser)\/([\w\.]+)/i                                           // Yandex
            ], [[NAME, 'Yandex'], VERSION], [

            /(puffin)\/([\w\.]+)/i                                              // Puffin
            ], [[NAME, 'Puffin'], VERSION], [

            /((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i
                                                                                // UCBrowser
            ], [[NAME, 'UCBrowser'], VERSION], [

            /(comodo_dragon)\/([\w\.]+)/i                                       // Comodo Dragon
            ], [[NAME, /_/g, ' '], VERSION], [

            /(micromessenger)\/([\w\.]+)/i                                      // WeChat
            ], [[NAME, 'WeChat'], VERSION], [

            /(QQ)\/([\d\.]+)/i                                                  // QQ, aka ShouQ
            ], [NAME, VERSION], [

            /m?(qqbrowser)[\/\s]?([\w\.]+)/i                                    // QQBrowser
            ], [NAME, VERSION], [

            /xiaomi\/miuibrowser\/([\w\.]+)/i                                   // MIUI Browser
            ], [VERSION, [NAME, 'MIUI Browser']], [

            /;fbav\/([\w\.]+);/i                                                // Facebook App for iOS & Android
            ], [VERSION, [NAME, 'Facebook']], [

            /headlesschrome(?:\/([\w\.]+)|\s)/i                                 // Chrome Headless
            ], [VERSION, [NAME, 'Chrome Headless']], [

            /\swv\).+(chrome)\/([\w\.]+)/i                                      // Chrome WebView
            ], [[NAME, /(.+)/, '$1 WebView'], VERSION], [

            /((?:oculus|samsung)browser)\/([\w\.]+)/i
            ], [[NAME, /(.+(?:g|us))(.+)/, '$1 $2'], VERSION], [                // Oculus / Samsung Browser

            /android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i        // Android Browser
            ], [VERSION, [NAME, 'Android Browser']], [

            /(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i
                                                                                // Chrome/OmniWeb/Arora/Tizen/Nokia
            ], [NAME, VERSION], [

            /(dolfin)\/([\w\.]+)/i                                              // Dolphin
            ], [[NAME, 'Dolphin'], VERSION], [

            /((?:android.+)crmo|crios)\/([\w\.]+)/i                             // Chrome for Android/iOS
            ], [[NAME, 'Chrome'], VERSION], [

            /(coast)\/([\w\.]+)/i                                               // Opera Coast
            ], [[NAME, 'Opera Coast'], VERSION], [

            /fxios\/([\w\.-]+)/i                                                // Firefox for iOS
            ], [VERSION, [NAME, 'Firefox']], [

            /version\/([\w\.]+).+?mobile\/\w+\s(safari)/i                       // Mobile Safari
            ], [VERSION, [NAME, 'Mobile Safari']], [

            /version\/([\w\.]+).+?(mobile\s?safari|safari)/i                    // Safari & Safari Mobile
            ], [VERSION, NAME], [

            /webkit.+?(gsa)\/([\w\.]+).+?(mobile\s?safari|safari)(\/[\w\.]+)/i  // Google Search Appliance on iOS
            ], [[NAME, 'GSA'], VERSION], [

            /webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i                     // Safari < 3.0
            ], [NAME, [VERSION, mapper.str, maps.browser.oldsafari.version]], [

            /(konqueror)\/([\w\.]+)/i,                                          // Konqueror
            /(webkit|khtml)\/([\w\.]+)/i
            ], [NAME, VERSION], [

            // Gecko based
            /(navigator|netscape)\/([\w\.-]+)/i                                 // Netscape
            ], [[NAME, 'Netscape'], VERSION], [
            /(swiftfox)/i,                                                      // Swiftfox
            /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
                                                                                // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
            /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i,
                                                                                // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
            /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,                          // Mozilla

            // Other
            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,
                                                                                // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir
            /(links)\s\(([\w\.]+)/i,                                            // Links
            /(gobrowser)\/?([\w\.]+)*/i,                                        // GoBrowser
            /(ice\s?browser)\/v?([\w\._]+)/i,                                   // ICE Browser
            /(mosaic)[\/\s]([\w\.]+)/i                                          // Mosaic
            ], [NAME, VERSION]

            /* /////////////////////
            // Media players BEGIN
            ////////////////////////

            , [

            /(apple(?:coremedia|))\/((\d+)[\w\._]+)/i,                          // Generic Apple CoreMedia
            /(coremedia) v((\d+)[\w\._]+)/i
            ], [NAME, VERSION], [

            /(aqualung|lyssna|bsplayer)\/((\d+)?[\w\.-]+)/i                     // Aqualung/Lyssna/BSPlayer
            ], [NAME, VERSION], [

            /(ares|ossproxy)\s((\d+)[\w\.-]+)/i                                 // Ares/OSSProxy
            ], [NAME, VERSION], [

            /(audacious|audimusicstream|amarok|bass|core|dalvik|gnomemplayer|music on console|nsplayer|psp-internetradioplayer|videos)\/((\d+)[\w\.-]+)/i,
                                                                                // Audacious/AudiMusicStream/Amarok/BASS/OpenCORE/Dalvik/GnomeMplayer/MoC
                                                                                // NSPlayer/PSP-InternetRadioPlayer/Videos
            /(clementine|music player daemon)\s((\d+)[\w\.-]+)/i,               // Clementine/MPD
            /(lg player|nexplayer)\s((\d+)[\d\.]+)/i,
            /player\/(nexplayer|lg player)\s((\d+)[\w\.-]+)/i                   // NexPlayer/LG Player
            ], [NAME, VERSION], [
            /(nexplayer)\s((\d+)[\w\.-]+)/i                                     // Nexplayer
            ], [NAME, VERSION], [

            /(flrp)\/((\d+)[\w\.-]+)/i                                          // Flip Player
            ], [[NAME, 'Flip Player'], VERSION], [

            /(fstream|nativehost|queryseekspider|ia-archiver|facebookexternalhit)/i
                                                                                // FStream/NativeHost/QuerySeekSpider/IA Archiver/facebookexternalhit
            ], [NAME], [

            /(gstreamer) souphttpsrc (?:\([^\)]+\)){0,1} libsoup\/((\d+)[\w\.-]+)/i
                                                                                // Gstreamer
            ], [NAME, VERSION], [

            /(htc streaming player)\s[\w_]+\s\/\s((\d+)[\d\.]+)/i,              // HTC Streaming Player
            /(java|python-urllib|python-requests|wget|libcurl)\/((\d+)[\w\.-_]+)/i,
                                                                                // Java/urllib/requests/wget/cURL
            /(lavf)((\d+)[\d\.]+)/i                                             // Lavf (FFMPEG)
            ], [NAME, VERSION], [

            /(htc_one_s)\/((\d+)[\d\.]+)/i                                      // HTC One S
            ], [[NAME, /_/g, ' '], VERSION], [

            /(mplayer)(?:\s|\/)(?:(?:sherpya-){0,1}svn)(?:-|\s)(r\d+(?:-\d+[\w\.-]+){0,1})/i
                                                                                // MPlayer SVN
            ], [NAME, VERSION], [

            /(mplayer)(?:\s|\/|[unkow-]+)((\d+)[\w\.-]+)/i                      // MPlayer
            ], [NAME, VERSION], [

            /(mplayer)/i,                                                       // MPlayer (no other info)
            /(yourmuze)/i,                                                      // YourMuze
            /(media player classic|nero showtime)/i                             // Media Player Classic/Nero ShowTime
            ], [NAME], [

            /(nero (?:home|scout))\/((\d+)[\w\.-]+)/i                           // Nero Home/Nero Scout
            ], [NAME, VERSION], [

            /(nokia\d+)\/((\d+)[\w\.-]+)/i                                      // Nokia
            ], [NAME, VERSION], [

            /\s(songbird)\/((\d+)[\w\.-]+)/i                                    // Songbird/Philips-Songbird
            ], [NAME, VERSION], [

            /(winamp)3 version ((\d+)[\w\.-]+)/i,                               // Winamp
            /(winamp)\s((\d+)[\w\.-]+)/i,
            /(winamp)mpeg\/((\d+)[\w\.-]+)/i
            ], [NAME, VERSION], [

            /(ocms-bot|tapinradio|tunein radio|unknown|winamp|inlight radio)/i  // OCMS-bot/tap in radio/tunein/unknown/winamp (no other info)
                                                                                // inlight radio
            ], [NAME], [

            /(quicktime|rma|radioapp|radioclientapplication|soundtap|totem|stagefright|streamium)\/((\d+)[\w\.-]+)/i
                                                                                // QuickTime/RealMedia/RadioApp/RadioClientApplication/
                                                                                // SoundTap/Totem/Stagefright/Streamium
            ], [NAME, VERSION], [

            /(smp)((\d+)[\d\.]+)/i                                              // SMP
            ], [NAME, VERSION], [

            /(vlc) media player - version ((\d+)[\w\.]+)/i,                     // VLC Videolan
            /(vlc)\/((\d+)[\w\.-]+)/i,
            /(xbmc|gvfs|xine|xmms|irapp)\/((\d+)[\w\.-]+)/i,                    // XBMC/gvfs/Xine/XMMS/irapp
            /(foobar2000)\/((\d+)[\d\.]+)/i,                                    // Foobar2000
            /(itunes)\/((\d+)[\d\.]+)/i                                         // iTunes
            ], [NAME, VERSION], [

            /(wmplayer)\/((\d+)[\w\.-]+)/i,                                     // Windows Media Player
            /(windows-media-player)\/((\d+)[\w\.-]+)/i
            ], [[NAME, /-/g, ' '], VERSION], [

            /windows\/((\d+)[\w\.-]+) upnp\/[\d\.]+ dlnadoc\/[\d\.]+ (home media server)/i
                                                                                // Windows Media Server
            ], [VERSION, [NAME, 'Windows']], [

            /(com\.riseupradioalarm)\/((\d+)[\d\.]*)/i                          // RiseUP Radio Alarm
            ], [NAME, VERSION], [

            /(rad.io)\s((\d+)[\d\.]+)/i,                                        // Rad.io
            /(radio.(?:de|at|fr))\s((\d+)[\d\.]+)/i
            ], [[NAME, 'rad.io'], VERSION]

            //////////////////////
            // Media players END
            ////////////////////*/

        ],

        cpu : [[

            /(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i                     // AMD64
            ], [[ARCHITECTURE, 'amd64']], [

            /(ia32(?=;))/i                                                      // IA32 (quicktime)
            ], [[ARCHITECTURE, util.lowerize]], [

            /((?:i[346]|x)86)[;\)]/i                                            // IA32
            ], [[ARCHITECTURE, 'ia32']], [

            // PocketPC mistakenly identified as PowerPC
            /windows\s(ce|mobile);\sppc;/i
            ], [[ARCHITECTURE, 'arm']], [

            /((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i                           // PowerPC
            ], [[ARCHITECTURE, /ower/, '', util.lowerize]], [

            /(sun4\w)[;\)]/i                                                    // SPARC
            ], [[ARCHITECTURE, 'sparc']], [

            /((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i
                                                                                // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
            ], [[ARCHITECTURE, util.lowerize]]
        ],

        device : [[

            /\((ipad|playbook);[\w\s\);-]+(rim|apple)/i                         // iPad/PlayBook
            ], [MODEL, VENDOR, [TYPE, TABLET]], [

            /applecoremedia\/[\w\.]+ \((ipad)/                                  // iPad
            ], [MODEL, [VENDOR, 'Apple'], [TYPE, TABLET]], [

            /(apple\s{0,1}tv)/i                                                 // Apple TV
            ], [[MODEL, 'Apple TV'], [VENDOR, 'Apple']], [

            /(archos)\s(gamepad2?)/i,                                           // Archos
            /(hp).+(touchpad)/i,                                                // HP TouchPad
            /(hp).+(tablet)/i,                                                  // HP Tablet
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /\s(nook)[\w\s]+build\/(\w+)/i,                                     // Nook
            /(dell)\s(strea[kpr\s\d]*[\dko])/i                                  // Dell Streak
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i                               // Kindle Fire HD
            ], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [
            /(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i                  // Fire Phone
            ], [[MODEL, mapper.str, maps.device.amazon.model], [VENDOR, 'Amazon'], [TYPE, MOBILE]], [

            /\((ip[honed|\s\w*]+);.+(apple)/i                                   // iPod/iPhone
            ], [MODEL, VENDOR, [TYPE, MOBILE]], [
            /\((ip[honed|\s\w*]+);/i                                            // iPod/iPhone
            ], [MODEL, [VENDOR, 'Apple'], [TYPE, MOBILE]], [

            /(blackberry)[\s-]?(\w+)/i,                                         // BlackBerry
            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i,
                                                                                // BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
            /(hp)\s([\w\s]+\w)/i,                                               // HP iPAQ
            /(asus)-?(\w+)/i                                                    // Asus
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /\(bb10;\s(\w+)/i                                                   // BlackBerry 10
            ], [MODEL, [VENDOR, 'BlackBerry'], [TYPE, MOBILE]], [
                                                                                // Asus Tablets
            /android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone)/i
            ], [MODEL, [VENDOR, 'Asus'], [TYPE, TABLET]], [

            /(sony)\s(tablet\s[ps])\sbuild\//i,                                  // Sony
            /(sony)?(?:sgp.+)\sbuild\//i
            ], [[VENDOR, 'Sony'], [MODEL, 'Xperia Tablet'], [TYPE, TABLET]], [
            /android.+\s([c-g]\d{4}|so[-l]\w+)\sbuild\//i
            ], [MODEL, [VENDOR, 'Sony'], [TYPE, MOBILE]], [

            /\s(ouya)\s/i,                                                      // Ouya
            /(nintendo)\s([wids3u]+)/i                                          // Nintendo
            ], [VENDOR, MODEL, [TYPE, CONSOLE]], [

            /android.+;\s(shield)\sbuild/i                                      // Nvidia
            ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, CONSOLE]], [

            /(playstation\s[34portablevi]+)/i                                   // Playstation
            ], [MODEL, [VENDOR, 'Sony'], [TYPE, CONSOLE]], [

            /(sprint\s(\w+))/i                                                  // Sprint Phones
            ], [[VENDOR, mapper.str, maps.device.sprint.vendor], [MODEL, mapper.str, maps.device.sprint.model], [TYPE, MOBILE]], [

            /(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i                         // Lenovo tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i,                               // HTC
            /(zte)-(\w+)*/i,                                                    // ZTE
            /(alcatel|geeksphone|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i
                                                                                // Alcatel/GeeksPhone/Lenovo/Nexian/Panasonic/Sony
            ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [

            /(nexus\s9)/i                                                       // HTC Nexus 9
            ], [MODEL, [VENDOR, 'HTC'], [TYPE, TABLET]], [

            /d\/huawei([\w\s-]+)[;\)]/i,
            /(nexus\s6p)/i                                                      // Huawei
            ], [MODEL, [VENDOR, 'Huawei'], [TYPE, MOBILE]], [

            /(microsoft);\s(lumia[\s\w]+)/i                                     // Microsoft Lumia
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /[\s\(;](xbox(?:\sone)?)[\s\);]/i                                   // Microsoft Xbox
            ], [MODEL, [VENDOR, 'Microsoft'], [TYPE, CONSOLE]], [
            /(kin\.[onetw]{3})/i                                                // Microsoft Kin
            ], [[MODEL, /\./g, ' '], [VENDOR, 'Microsoft'], [TYPE, MOBILE]], [

                                                                                // Motorola
            /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i,
            /mot[\s-]?(\w+)*/i,
            /(XT\d{3,4}) build\//i,
            /(nexus\s6)/i
            ], [MODEL, [VENDOR, 'Motorola'], [TYPE, MOBILE]], [
            /android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i
            ], [MODEL, [VENDOR, 'Motorola'], [TYPE, TABLET]], [

            /hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i            // HbbTV devices
            ], [[VENDOR, util.trim], [MODEL, util.trim], [TYPE, SMARTTV]], [

            /hbbtv.+maple;(\d+)/i
            ], [[MODEL, /^/, 'SmartTV'], [VENDOR, 'Samsung'], [TYPE, SMARTTV]], [

            /\(dtv[\);].+(aquos)/i                                              // Sharp
            ], [MODEL, [VENDOR, 'Sharp'], [TYPE, SMARTTV]], [

            /android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i,
            /((SM-T\w+))/i
            ], [[VENDOR, 'Samsung'], MODEL, [TYPE, TABLET]], [                  // Samsung
            /smart-tv.+(samsung)/i
            ], [VENDOR, [TYPE, SMARTTV], MODEL], [
            /((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i,
            /(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i,
            /sec-((sgh\w+))/i
            ], [[VENDOR, 'Samsung'], MODEL, [TYPE, MOBILE]], [

            /sie-(\w+)*/i                                                       // Siemens
            ], [MODEL, [VENDOR, 'Siemens'], [TYPE, MOBILE]], [

            /(maemo|nokia).*(n900|lumia\s\d+)/i,                                // Nokia
            /(nokia)[\s_-]?([\w-]+)*/i
            ], [[VENDOR, 'Nokia'], MODEL, [TYPE, MOBILE]], [

            /android\s3\.[\s\w;-]{10}(a\d{3})/i                                 // Acer
            ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [

            /android.+([vl]k\-?\d{3})\s+build/i                                 // LG Tablet
            ], [MODEL, [VENDOR, 'LG'], [TYPE, TABLET]], [
            /android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i                     // LG Tablet
            ], [[VENDOR, 'LG'], MODEL, [TYPE, TABLET]], [
            /(lg) netcast\.tv/i                                                 // LG SmartTV
            ], [VENDOR, MODEL, [TYPE, SMARTTV]], [
            /(nexus\s[45])/i,                                                   // LG
            /lg[e;\s\/-]+(\w+)*/i,
            /android.+lg(\-?[\d\w]+)\s+build/i
            ], [MODEL, [VENDOR, 'LG'], [TYPE, MOBILE]], [

            /android.+(ideatab[a-z0-9\-\s]+)/i                                  // Lenovo
            ], [MODEL, [VENDOR, 'Lenovo'], [TYPE, TABLET]], [

            /linux;.+((jolla));/i                                               // Jolla
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /((pebble))app\/[\d\.]+\s/i                                         // Pebble
            ], [VENDOR, MODEL, [TYPE, WEARABLE]], [

            /android.+;\s(oppo)\s?([\w\s]+)\sbuild/i                            // OPPO
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /crkey/i                                                            // Google Chromecast
            ], [[MODEL, 'Chromecast'], [VENDOR, 'Google']], [

            /android.+;\s(glass)\s\d/i                                          // Google Glass
            ], [MODEL, [VENDOR, 'Google'], [TYPE, WEARABLE]], [

            /android.+;\s(pixel c)\s/i                                          // Google Pixel C
            ], [MODEL, [VENDOR, 'Google'], [TYPE, TABLET]], [

            /android.+;\s(pixel xl|pixel)\s/i                                   // Google Pixel
            ], [MODEL, [VENDOR, 'Google'], [TYPE, MOBILE]], [

            /android.+(\w+)\s+build\/hm\1/i,                                    // Xiaomi Hongmi 'numeric' models
            /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,               // Xiaomi Hongmi
            /android.+(mi[\s\-_]*(?:one|one[\s_]plus|note lte)?[\s_]*(?:\d\w)?)\s+build/i,    // Xiaomi Mi
            /android.+(redmi[\s\-_]*(?:note)?(?:[\s_]*[\w\s]+)?)\s+build/i      // Redmi Phones
            ], [[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, MOBILE]], [
            /android.+(mi[\s\-_]*(?:pad)?(?:[\s_]*[\w\s]+)?)\s+build/i          // Mi Pad tablets
            ],[[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, TABLET]], [
            /android.+;\s(m[1-5]\snote)\sbuild/i                                // Meizu Tablet
            ], [MODEL, [VENDOR, 'Meizu'], [TYPE, TABLET]], [

            /android.+a000(1)\s+build/i                                         // OnePlus
            ], [MODEL, [VENDOR, 'OnePlus'], [TYPE, MOBILE]], [

            /android.+[;\/]\s*(RCT[\d\w]+)\s+build/i                            // RCA Tablets
            ], [MODEL, [VENDOR, 'RCA'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Venue[\d\s]*)\s+build/i                          // Dell Venue Tablets
            ], [MODEL, [VENDOR, 'Dell'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i                         // Verizon Tablet
            ], [MODEL, [VENDOR, 'Verizon'], [TYPE, TABLET]], [

            /android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(V?.*)\s+build/i     // Barnes & Noble Tablet
            ], [[VENDOR, 'Barnes & Noble'], MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i                           // Barnes & Noble Tablet
            ], [MODEL, [VENDOR, 'NuVision'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(zte)?.+(k\d{2})\s+build/i                        // ZTE K Series Tablet
            ], [[VENDOR, 'ZTE'], MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*(gen\d{3})\s+build.*49h/i                         // Swiss GEN Mobile
            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, MOBILE]], [

            /android.+[;\/]\s*(zur\d{3})\s+build/i                              // Swiss ZUR Tablet
            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, TABLET]], [

            /android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i                         // Zeki Tablets
            ], [MODEL, [VENDOR, 'Zeki'], [TYPE, TABLET]], [

            /(android).+[;\/]\s+([YR]\d{2}x?.*)\s+build/i,
            /android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(.+)\s+build/i          // Dragon Touch Tablet
            ], [[VENDOR, 'Dragon Touch'], MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*(NS-?.+)\s+build/i                                // Insignia Tablets
            ], [MODEL, [VENDOR, 'Insignia'], [TYPE, TABLET]], [

            /android.+[;\/]\s*((NX|Next)-?.+)\s+build/i                         // NextBook Tablets
            ], [MODEL, [VENDOR, 'NextBook'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Xtreme\_?)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i
            ], [[VENDOR, 'Voice'], MODEL, [TYPE, MOBILE]], [                    // Voice Xtreme Phones

            /android.+[;\/]\s*(LVTEL\-?)?(V1[12])\s+build/i                     // LvTel Phones
            ], [[VENDOR, 'LvTel'], MODEL, [TYPE, MOBILE]], [

            /android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i          // Envizen Tablets
            ], [MODEL, [VENDOR, 'Envizen'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(.*\b)\s+build/i             // Le Pan Tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*(Trio[\s\-]*.*)\s+build/i                         // MachSpeed Tablets
            ], [MODEL, [VENDOR, 'MachSpeed'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i                // Trinity Tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*TU_(1491)\s+build/i                               // Rotor Tablets
            ], [MODEL, [VENDOR, 'Rotor'], [TYPE, TABLET]], [

            /android.+(KS(.+))\s+build/i                                        // Amazon Kindle Tablets
            ], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [

            /android.+(Gigaset)[\s\-]+(Q.+)\s+build/i                           // Gigaset Tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /\s(tablet|tab)[;\/]/i,                                             // Unidentifiable Tablet
            /\s(mobile)(?:[;\/]|\ssafari)/i                                     // Unidentifiable Mobile
            ], [[TYPE, util.lowerize], VENDOR, MODEL], [

            /(android.+)[;\/].+build/i                                          // Generic Android Device
            ], [MODEL, [VENDOR, 'Generic']]


        /*//////////////////////////
            // TODO: move to string map
            ////////////////////////////

            /(C6603)/i                                                          // Sony Xperia Z C6603
            ], [[MODEL, 'Xperia Z C6603'], [VENDOR, 'Sony'], [TYPE, MOBILE]], [
            /(C6903)/i                                                          // Sony Xperia Z 1
            ], [[MODEL, 'Xperia Z 1'], [VENDOR, 'Sony'], [TYPE, MOBILE]], [

            /(SM-G900[F|H])/i                                                   // Samsung Galaxy S5
            ], [[MODEL, 'Galaxy S5'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-G7102)/i                                                       // Samsung Galaxy Grand 2
            ], [[MODEL, 'Galaxy Grand 2'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-G530H)/i                                                       // Samsung Galaxy Grand Prime
            ], [[MODEL, 'Galaxy Grand Prime'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-G313HZ)/i                                                      // Samsung Galaxy V
            ], [[MODEL, 'Galaxy V'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-T805)/i                                                        // Samsung Galaxy Tab S 10.5
            ], [[MODEL, 'Galaxy Tab S 10.5'], [VENDOR, 'Samsung'], [TYPE, TABLET]], [
            /(SM-G800F)/i                                                       // Samsung Galaxy S5 Mini
            ], [[MODEL, 'Galaxy S5 Mini'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-T311)/i                                                        // Samsung Galaxy Tab 3 8.0
            ], [[MODEL, 'Galaxy Tab 3 8.0'], [VENDOR, 'Samsung'], [TYPE, TABLET]], [

            /(T3C)/i                                                            // Advan Vandroid T3C
            ], [MODEL, [VENDOR, 'Advan'], [TYPE, TABLET]], [
            /(ADVAN T1J\+)/i                                                    // Advan Vandroid T1J+
            ], [[MODEL, 'Vandroid T1J+'], [VENDOR, 'Advan'], [TYPE, TABLET]], [
            /(ADVAN S4A)/i                                                      // Advan Vandroid S4A
            ], [[MODEL, 'Vandroid S4A'], [VENDOR, 'Advan'], [TYPE, MOBILE]], [

            /(V972M)/i                                                          // ZTE V972M
            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, MOBILE]], [

            /(i-mobile)\s(IQ\s[\d\.]+)/i                                        // i-mobile IQ
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /(IQ6.3)/i                                                          // i-mobile IQ IQ 6.3
            ], [[MODEL, 'IQ 6.3'], [VENDOR, 'i-mobile'], [TYPE, MOBILE]], [
            /(i-mobile)\s(i-style\s[\d\.]+)/i                                   // i-mobile i-STYLE
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /(i-STYLE2.1)/i                                                     // i-mobile i-STYLE 2.1
            ], [[MODEL, 'i-STYLE 2.1'], [VENDOR, 'i-mobile'], [TYPE, MOBILE]], [

            /(mobiistar touch LAI 512)/i                                        // mobiistar touch LAI 512
            ], [[MODEL, 'Touch LAI 512'], [VENDOR, 'mobiistar'], [TYPE, MOBILE]], [

            /////////////
            // END TODO
            ///////////*/

        ],

        engine : [[

            /windows.+\sedge\/([\w\.]+)/i                                       // EdgeHTML
            ], [VERSION, [NAME, 'EdgeHTML']], [

            /(presto)\/([\w\.]+)/i,                                             // Presto
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i,     // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m
            /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,                          // KHTML/Tasman/Links
            /(icab)[\/\s]([23]\.[\d\.]+)/i                                      // iCab
            ], [NAME, VERSION], [

            /rv\:([\w\.]+).*(gecko)/i                                           // Gecko
            ], [VERSION, NAME]
        ],

        os : [[

            // Windows based
            /microsoft\s(windows)\s(vista|xp)/i                                 // Windows (iTunes)
            ], [NAME, VERSION], [
            /(windows)\snt\s6\.2;\s(arm)/i,                                     // Windows RT
            /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s]+\w)*/i,                  // Windows Phone
            /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i
            ], [NAME, [VERSION, mapper.str, maps.os.windows.version]], [
            /(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i
            ], [[NAME, 'Windows'], [VERSION, mapper.str, maps.os.windows.version]], [

            // Mobile/Embedded OS
            /\((bb)(10);/i                                                      // BlackBerry 10
            ], [[NAME, 'BlackBerry'], VERSION], [
            /(blackberry)\w*\/?([\w\.]+)*/i,                                    // Blackberry
            /(tizen)[\/\s]([\w\.]+)/i,                                          // Tizen
            /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i,
                                                                                // Android/WebOS/Palm/QNX/Bada/RIM/MeeGo/Contiki
            /linux;.+(sailfish);/i                                              // Sailfish OS
            ], [NAME, VERSION], [
            /(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i                 // Symbian
            ], [[NAME, 'Symbian'], VERSION], [
            /\((series40);/i                                                    // Series 40
            ], [NAME], [
            /mozilla.+\(mobile;.+gecko.+firefox/i                               // Firefox OS
            ], [[NAME, 'Firefox OS'], VERSION], [

            // Console
            /(nintendo|playstation)\s([wids34portablevu]+)/i,                   // Nintendo/Playstation

            // GNU/Linux based
            /(mint)[\/\s\(]?(\w+)*/i,                                           // Mint
            /(mageia|vectorlinux)[;\s]/i,                                       // Mageia/VectorLinux
            /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]+)*/i,
                                                                                // Joli/Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware
                                                                                // Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus
            /(hurd|linux)\s?([\w\.]+)*/i,                                       // Hurd/Linux
            /(gnu)\s?([\w\.]+)*/i                                               // GNU
            ], [NAME, VERSION], [

            /(cros)\s[\w]+\s([\w\.]+\w)/i                                       // Chromium OS
            ], [[NAME, 'Chromium OS'], VERSION],[

            // Solaris
            /(sunos)\s?([\w\.]+\d)*/i                                           // Solaris
            ], [[NAME, 'Solaris'], VERSION], [

            // BSD based
            /\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i                   // FreeBSD/NetBSD/OpenBSD/PC-BSD/DragonFly
            ], [NAME, VERSION],[

            /(haiku)\s(\w+)/i                                                  // Haiku
            ], [NAME, VERSION],[

            /cfnetwork\/.+darwin/i,
            /ip[honead]+(?:.*os\s([\w]+)\slike\smac|;\sopera)/i                 // iOS
            ], [[VERSION, /_/g, '.'], [NAME, 'iOS']], [

            /(mac\sos\sx)\s?([\w\s\.]+\w)*/i,
            /(macintosh|mac(?=_powerpc)\s)/i                                    // Mac OS
            ], [[NAME, 'Mac OS'], [VERSION, /_/g, '.']], [

            // Other
            /((?:open)?solaris)[\/\s-]?([\w\.]+)*/i,                            // Solaris
            /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i,                               // AIX
            /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i,
                                                                                // Plan9/Minix/BeOS/OS2/AmigaOS/MorphOS/RISCOS/OpenVMS
            /(unix)\s?([\w\.]+)*/i                                              // UNIX
            ], [NAME, VERSION]
        ]
    };


    /////////////////
    // Constructor
    ////////////////
    /*
    var Browser = function (name, version) {
        this[NAME] = name;
        this[VERSION] = version;
    };
    var CPU = function (arch) {
        this[ARCHITECTURE] = arch;
    };
    var Device = function (vendor, model, type) {
        this[VENDOR] = vendor;
        this[MODEL] = model;
        this[TYPE] = type;
    };
    var Engine = Browser;
    var OS = Browser;
    */
    var UAParser = function (uastring, extensions) {

        if (typeof uastring === 'object') {
            extensions = uastring;
            uastring = undefined;
        }

        if (!(this instanceof UAParser)) {
            return new UAParser(uastring, extensions).getResult();
        }

        var ua = uastring || ((window && window.navigator && window.navigator.userAgent) ? window.navigator.userAgent : EMPTY);
        var rgxmap = extensions ? util.extend(regexes, extensions) : regexes;
        //var browser = new Browser();
        //var cpu = new CPU();
        //var device = new Device();
        //var engine = new Engine();
        //var os = new OS();

        this.getBrowser = function () {
            var browser = { name: undefined, version: undefined };
            mapper.rgx.call(browser, ua, rgxmap.browser);
            browser.major = util.major(browser.version); // deprecated
            return browser;
        };
        this.getCPU = function () {
            var cpu = { architecture: undefined };
            mapper.rgx.call(cpu, ua, rgxmap.cpu);
            return cpu;
        };
        this.getDevice = function () {
            var device = { vendor: undefined, model: undefined, type: undefined };
            mapper.rgx.call(device, ua, rgxmap.device);
            return device;
        };
        this.getEngine = function () {
            var engine = { name: undefined, version: undefined };
            mapper.rgx.call(engine, ua, rgxmap.engine);
            return engine;
        };
        this.getOS = function () {
            var os = { name: undefined, version: undefined };
            mapper.rgx.call(os, ua, rgxmap.os);
            return os;
        };
        this.getResult = function () {
            return {
                ua      : this.getUA(),
                browser : this.getBrowser(),
                engine  : this.getEngine(),
                os      : this.getOS(),
                device  : this.getDevice(),
                cpu     : this.getCPU()
            };
        };
        this.getUA = function () {
            return ua;
        };
        this.setUA = function (uastring) {
            ua = uastring;
            //browser = new Browser();
            //cpu = new CPU();
            //device = new Device();
            //engine = new Engine();
            //os = new OS();
            return this;
        };
        return this;
    };

    UAParser.VERSION = LIBVERSION;
    UAParser.BROWSER = {
        NAME    : NAME,
        MAJOR   : MAJOR, // deprecated
        VERSION : VERSION
    };
    UAParser.CPU = {
        ARCHITECTURE : ARCHITECTURE
    };
    UAParser.DEVICE = {
        MODEL   : MODEL,
        VENDOR  : VENDOR,
        TYPE    : TYPE,
        CONSOLE : CONSOLE,
        MOBILE  : MOBILE,
        SMARTTV : SMARTTV,
        TABLET  : TABLET,
        WEARABLE: WEARABLE,
        EMBEDDED: EMBEDDED
    };
    UAParser.ENGINE = {
        NAME    : NAME,
        VERSION : VERSION
    };
    UAParser.OS = {
        NAME    : NAME,
        VERSION : VERSION
    };
    //UAParser.Utils = util;

    ///////////
    // Export
    //////////


    // check js environment
    if (typeof(exports) !== UNDEF_TYPE) {
        // nodejs env
        if (typeof module !== UNDEF_TYPE && module.exports) {
            exports = module.exports = UAParser;
        }
        // TODO: test!!!!!!!!
        /*
        if (require && require.main === module && process) {
            // cli
            var jsonize = function (arr) {
                var res = [];
                for (var i in arr) {
                    res.push(new UAParser(arr[i]).getResult());
                }
                process.stdout.write(JSON.stringify(res, null, 2) + '\n');
            };
            if (process.stdin.isTTY) {
                // via args
                jsonize(process.argv.slice(2));
            } else {
                // via pipe
                var str = '';
                process.stdin.on('readable', function() {
                    var read = process.stdin.read();
                    if (read !== null) {
                        str += read;
                    }
                });
                process.stdin.on('end', function () {
                    jsonize(str.replace(/\n$/, '').split('\n'));
                });
            }
        }
        */
        exports.UAParser = UAParser;
    } else {
        // requirejs env (optional)
        if ("function" === FUNC_TYPE && __webpack_require__(13)) {
            !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
                return UAParser;
            }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        } else if (window) {
            // browser env
            window.UAParser = UAParser;
        }
    }

    // jQuery/Zepto specific (optional)
    // Note:
    //   In AMD env the global scope should be kept clean, but jQuery is an exception.
    //   jQuery always exports to global scope, unless jQuery.noConflict(true) is used,
    //   and we should catch that.
    var $ = window && (window.jQuery || window.Zepto);
    if (typeof $ !== UNDEF_TYPE) {
        var parser = new UAParser();
        $.ua = parser.getResult();
        $.ua.get = function () {
            return parser.getUA();
        };
        $.ua.set = function (uastring) {
            parser.setUA(uastring);
            var result = parser.getResult();
            for (var prop in result) {
                $.ua[prop] = result[prop];
            }
        };
    }

})(typeof window === 'object' ? window : this);


/***/ }),
/* 13 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reconnectingWebsocket = __webpack_require__(3);

var _reconnectingWebsocket2 = _interopRequireDefault(_reconnectingWebsocket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var logTypes = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    none: 4
};

var typesP = ['_debugP', '_infoP', '_warnP', '_errorP'];
var typesU = ['_debugU', '_infoU', '_warnU', '_errorU'];

var Logger = function () {
    function Logger(config, channel) {
        _classCallCheck(this, Logger);

        this.config = config;
        this.connected = false;
        if (config.enableLogUpload) {
            try {
                this._ws = this._initWs(channel);
            } catch (e) {
                this._ws = null;
            }
        }
        if (!(config.logLevel in logTypes)) config.logLevel = 'none';
        if (!(config.logUploadLevel in logTypes)) config.logUploadLevel = 'none';
        for (var i = 0; i < logTypes[config.logLevel]; i++) {
            this[typesP[i]] = noop;
        }
        for (var _i = 0; _i < logTypes[config.logUploadLevel]; _i++) {
            this[typesU[_i]] = noop;
        }
        this.identifier = '';
    }

    _createClass(Logger, [{
        key: 'debug',
        value: function debug(msg) {
            this._debugP(msg);
            this._debugU(msg);
        }
    }, {
        key: 'info',
        value: function info(msg) {
            this._infoP(msg);
            this._infoU(msg);
        }
    }, {
        key: 'warn',
        value: function warn(msg) {
            this._warnP(msg);
            this._warnU(msg);
        }
    }, {
        key: 'error',
        value: function error(msg) {
            this._errorP(msg);
            this._errorU(msg);
        }
    }, {
        key: '_debugP',
        value: function _debugP(msg) {
            console.log(msg);
        }
    }, {
        key: '_infoP',
        value: function _infoP(msg) {
            console.info(msg);
        }
    }, {
        key: '_warnP',
        value: function _warnP(msg) {
            console.warn(msg);
        }
    }, {
        key: '_errorP',
        value: function _errorP(msg) {
            console.error(msg);
        }
    }, {
        key: '_debugU',
        value: function _debugU(msg) {
            msg = '[' + this.identifier + ' debug] > ' + msg;
            this._uploadLog(msg);
        }
    }, {
        key: '_infoU',
        value: function _infoU(msg) {
            msg = '[' + this.identifier + ' info] > ' + msg;
            this._uploadLog(msg);
        }
    }, {
        key: '_warnU',
        value: function _warnU(msg) {
            msg = '[' + this.identifier + ' warn] > ' + msg;
            this._uploadLog(msg);
        }
    }, {
        key: '_errorU',
        value: function _errorU(msg) {
            msg = '[' + this.identifier + ' error] > ' + msg;
            this._uploadLog(msg);
        }
    }, {
        key: '_uploadLog',
        value: function _uploadLog(msg) {
            if (!this.connected) return;
            this._ws.send(msg);
        }
    }, {
        key: '_initWs',
        value: function _initWs(channel) {
            var _this = this;

            var wsOptions = {
                maxRetries: this.config.wsMaxRetries,
                minReconnectionDelay: this.config.wsReconnectInterval * 1000
            };
            var ws = new _reconnectingWebsocket2.default(this.config.logUploadAddr + ('?info_hash=' + window.encodeURIComponent(channel)), undefined, wsOptions);
            ws.onopen = function () {
                _this.debug('Log websocket connection opened');
                _this.connected = true;
            };
            // ws.onmessage = (e) => {
            //
            //
            // };
            ws.onclose = function () {
                //websocket断开时清除datachannel
                _this.warn('Log websocket closed');
                _this.connected = false;
            };
            return ws;
        }
    }]);

    return Logger;
}();

function noop() {}

exports.default = Logger;
module.exports = exports['default'];

/***/ })
/******/ ]);
});
//# sourceMappingURL=hlsjs-p2p-engine.js.map