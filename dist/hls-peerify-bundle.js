(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Hls"] = factory();
	else
		root["Hls"] = factory();
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
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 22);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
EventEmitter.prototype.setMaxListeners = function (n) {
  if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function (type) {
  var er, handler, len, args, i, listeners;

  if (!this._events) this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
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

  if (isUndefined(handler)) return false;

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
    for (i = 0; i < len; i++) {
      listeners[i].apply(this, args);
    }
  }

  return true;
};

EventEmitter.prototype.addListener = function (type, listener) {
  var m;

  if (!isFunction(listener)) throw TypeError('listener must be a function');

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener) this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);else
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
      console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function (type, listener) {
  if (!isFunction(listener)) throw TypeError('listener must be a function');

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
EventEmitter.prototype.removeListener = function (type, listener) {
  var list, position, length, i;

  if (!isFunction(listener)) throw TypeError('listener must be a function');

  if (!this._events || !this._events[type]) return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener || isFunction(list.listener) && list.listener === listener) {
    delete this._events[type];
    if (this._events.removeListener) this.emit('removeListener', type, listener);
  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener || list[i].listener && list[i].listener === listener) {
        position = i;
        break;
      }
    }

    if (position < 0) return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener) this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function (type) {
  var key, listeners;

  if (!this._events) return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0) this._events = {};else if (this._events[type]) delete this._events[type];
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
    while (listeners.length) {
      this.removeListener(type, listeners[listeners.length - 1]);
    }
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function (type) {
  var ret;
  if (!this._events || !this._events[type]) ret = [];else if (isFunction(this._events[type])) ret = [this._events[type]];else ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function (type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener)) return 1;else if (evlistener) return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function (emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(24);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome && 'undefined' != typeof chrome.storage ? chrome.storage.local : localstorage();

/**
 * Colors.
 */

exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance ||
  // is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) ||
  // is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 ||
  // double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '') + this.namespace + (useColors ? ' %c' : ' ') + args[0] + (useColors ? '%c ' : ' ') + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit');

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function (match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === (typeof console === 'undefined' ? 'undefined' : _typeof(console)) && console.log && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch (e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch (e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    var TempCtor = function TempCtor() {};
    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  };
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.



/*<replacement>*/

var processNextTick = __webpack_require__(10);
/*</replacement>*/

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

module.exports = Duplex;

/*<replacement>*/
var util = __webpack_require__(9);
util.inherits = __webpack_require__(4);
/*</replacement>*/

var Readable = __webpack_require__(15);
var Writable = __webpack_require__(18);

util.inherits(Duplex, Readable);

var keys = objectKeys(Writable.prototype);
for (var v = 0; v < keys.length; v++) {
  var method = keys[v];
  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  processNextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex.prototype, 'destroyed', {
  get: function get() {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }
    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});

Duplex.prototype._destroy = function (err, cb) {
  this.push(null);
  this.end();

  processNextTick(cb, err);
};

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by xieting on 2018/1/9.
 */

exports.default = {

    //data-channel
    DC_SIGNAL: 'signal',
    DC_OPEN: 'open',
    DC_REQUEST: 'request',
    DC_REQUESTFAIL: 'request_fail', //当请求的数据找不到时触发
    DC_CLOSE: 'close',
    DC_RESPONSE: 'response',
    DC_ERROR: 'error',
    DC_BINARY: 'binary',

    //buffer-manager


    //loader-scheduler
    SEGMENT: 'segment'
};
module.exports = exports['default'];

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(25);
var ieee754 = __webpack_require__(26);
var isArray = __webpack_require__(14);

exports.Buffer = Buffer;
exports.SlowBuffer = SlowBuffer;
exports.INSPECT_MAX_BYTES = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength();

function typedArraySupport() {
  try {
    var arr = new Uint8Array(1);
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function foo() {
        return 42;
      } };
    return arr.foo() === 42 && // typed array instances can be augmented
    typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
    arr.subarray(1, 1).byteLength === 0; // ie10 has broken `subarray`
  } catch (e) {
    return false;
  }
}

function kMaxLength() {
  return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
}

function createBuffer(that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length');
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }
    that.length = length;
  }

  return that;
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer(arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length);
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error('If encoding is specified then the first argument must be a string');
    }
    return allocUnsafe(this, arg);
  }
  return from(this, arg, encodingOrOffset, length);
}

Buffer.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr;
};

function from(that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number');
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length);
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset);
  }

  return fromObject(that, value);
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length);
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
  if (typeof Symbol !== 'undefined' && Symbol.species && Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    });
  }
}

function assertSize(size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number');
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative');
  }
}

function alloc(that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size);
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string' ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill);
  }
  return createBuffer(that, size);
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding);
};

function allocUnsafe(that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that;
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size);
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size);
};

function fromString(that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding');
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that;
}

function fromArrayLike(that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that;
}

function fromArrayBuffer(that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds');
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds');
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that;
}

function fromObject(that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that;
    }

    obj.copy(that, 0, 0, len);
    return that;
  }

  if (obj) {
    if (typeof ArrayBuffer !== 'undefined' && obj.buffer instanceof ArrayBuffer || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0);
      }
      return fromArrayLike(that, obj);
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data);
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
}

function checked(length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
  }
  return length | 0;
}

function SlowBuffer(length) {
  if (+length != length) {
    // eslint-disable-line eqeqeq
    length = 0;
  }
  return Buffer.alloc(+length);
}

Buffer.isBuffer = function isBuffer(b) {
  return !!(b != null && b._isBuffer);
};

Buffer.compare = function compare(a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers');
  }

  if (a === b) return 0;

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};

Buffer.isEncoding = function isEncoding(encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true;
    default:
      return false;
  }
};

Buffer.concat = function concat(list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers');
  }

  if (list.length === 0) {
    return Buffer.alloc(0);
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};

function byteLength(string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length;
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength;
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0;

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len;
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length;
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2;
      case 'hex':
        return len >>> 1;
      case 'base64':
        return base64ToBytes(string).length;
      default:
        if (loweredCase) return utf8ToBytes(string).length; // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString(encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return '';
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return '';
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return '';
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end);

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end);

      case 'ascii':
        return asciiSlice(this, start, end);

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end);

      case 'base64':
        return base64Slice(this, start, end);

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end);

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true;

function swap(b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16() {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits');
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this;
};

Buffer.prototype.swap32 = function swap32() {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits');
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this;
};

Buffer.prototype.swap64 = function swap64() {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits');
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this;
};

Buffer.prototype.toString = function toString() {
  var length = this.length | 0;
  if (length === 0) return '';
  if (arguments.length === 0) return utf8Slice(this, 0, length);
  return slowToString.apply(this, arguments);
};

Buffer.prototype.equals = function equals(b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
  if (this === b) return true;
  return Buffer.compare(this, b) === 0;
};

Buffer.prototype.inspect = function inspect() {
  var str = '';
  var max = exports.INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }
  return '<Buffer ' + str + '>';
};

Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer');
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index');
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0;
  }
  if (thisStart >= thisEnd) {
    return -1;
  }
  if (start >= end) {
    return 1;
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0;

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1;

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset; // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : buffer.length - 1;
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1;else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;else return -1;
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1;
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
  }

  throw new TypeError('val must be string, number or Buffer');
}

function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1;
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read(buf, i) {
    if (indexSize === 1) {
      return buf[i];
    } else {
      return buf.readUInt16BE(i * indexSize);
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break;
        }
      }
      if (found) return i;
    }
  }

  return -1;
}

Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1;
};

Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};

Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};

function hexWrite(buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string');

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i;
    buf[offset + i] = parsed;
  }
  return i;
}

function utf8Write(buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}

function asciiWrite(buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length);
}

function latin1Write(buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length);
}

function base64Write(buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length);
}

function ucs2Write(buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}

Buffer.prototype.write = function write(string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
    // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
    // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
    // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds');
  }

  if (!encoding) encoding = 'utf8';

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length);

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length);

      case 'ascii':
        return asciiWrite(this, string, offset, length);

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length);

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length);

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length);

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON() {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
};

function base64Slice(buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf);
  } else {
    return base64.fromByteArray(buf.slice(start, end));
  }
}

function utf8Slice(buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break;
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res);
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray(codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
  }
  return res;
}

function asciiSlice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret;
}

function latin1Slice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret;
}

function hexSlice(buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out;
}

function utf16leSlice(buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res;
}

Buffer.prototype.slice = function slice(start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf;
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset(offset, ext, length) {
  if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
}

Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val;
};

Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val;
};

Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset];
};

Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | this[offset + 1] << 8;
};

Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] << 8 | this[offset + 1];
};

Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
};

Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
};

Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val;
};

Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val;
};

Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return this[offset];
  return (0xff - this[offset] + 1) * -1;
};

Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | this[offset + 1] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};

Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | this[offset] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};

Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
};

Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
};

Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, true, 23, 4);
};

Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, false, 23, 4);
};

Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, true, 52, 8);
};

Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, false, 52, 8);
};

function checkInt(buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
}

Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = value & 0xff;
  return offset + 1;
};

function objectWriteUInt16(buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2;
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2;
};

function objectWriteUInt32(buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4;
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4;
};

Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = value & 0xff;
  return offset + 1;
};

Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2;
};

Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2;
};

Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4;
};

Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4;
};

function checkIEEE754(buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
  if (offset < 0) throw new RangeError('Index out of range');
}

function writeFloat(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4;
}

Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert);
};

Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert);
};

function writeDouble(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8;
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert);
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert);
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy(target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0;
  if (target.length === 0 || this.length === 0) return 0;

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds');
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
  if (end < 0) throw new RangeError('sourceEnd out of bounds');

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
  }

  return len;
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill(val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string');
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding);
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index');
  }

  if (end <= start) {
    return this;
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = Buffer.isBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this;
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean(str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return '';
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str;
}

function stringtrim(str) {
  if (str.trim) return str.trim();
  return str.replace(/^\s+|\s+$/g, '');
}

function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        }

        // valid lead
        leadSurrogate = codePoint;

        continue;
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue;
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break;
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break;
      bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break;
      bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break;
      bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else {
      throw new Error('Invalid code point');
    }
  }

  return bytes;
}

function asciiToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray;
}

function utf16leToBytes(str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break;

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray;
}

function base64ToBytes(str) {
  return base64.toByteArray(base64clean(str));
}

function blitBuffer(src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if (i + offset >= dst.length || i >= src.length) break;
    dst[i + offset] = src[i];
  }
  return i;
}

function isnan(val) {
  return val !== val; // eslint-disable-line no-self-compare
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable node/no-deprecated-api */
var buffer = __webpack_require__(7);
var Buffer = buffer.Buffer;

// alternative to using Object.keys for old browsers
function copyProps(src, dst) {
  for (var key in src) {
    dst[key] = src[key];
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer;
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports);
  exports.Buffer = SafeBuffer;
}

function SafeBuffer(arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length);
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer);

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number');
  }
  return Buffer(arg, encodingOrOffset, length);
};

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number');
  }
  var buf = Buffer(size);
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding);
    } else {
      buf.fill(fill);
    }
  } else {
    buf.fill(0);
  }
  return buf;
};

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number');
  }
  return Buffer(size);
};

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number');
  }
  return buffer.SlowBuffer(size);
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return objectToString(e) === '[object Error]' || e instanceof Error;
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'symbol' || // ES6 symbol
  typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7).Buffer))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

if (!process.version || process.version.indexOf('v0.') === 0 || process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = nextTick;
} else {
  module.exports = process.nextTick;
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
    case 0:
    case 1:
      return process.nextTick(fn);
    case 2:
      return process.nextTick(function afterTickOne() {
        fn.call(null, arg1);
      });
    case 3:
      return process.nextTick(function afterTickTwo() {
        fn.call(null, arg1, arg2);
      });
    case 4:
      return process.nextTick(function afterTickThree() {
        fn.call(null, arg1, arg2, arg3);
      });
    default:
      args = new Array(len - 1);
      i = 0;
      while (i < args.length) {
        args[i++] = arguments[i];
      }
      return process.nextTick(function afterTick() {
        fn.apply(null, args);
      });
  }
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function (val, options) {
  options = options || {};
  var type = typeof val === 'undefined' ? 'undefined' : _typeof(val);
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') || plural(ms, h, 'hour') || plural(ms, m, 'minute') || plural(ms, s, 'second') || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by xieting on 2018/1/3.
 */

var recommendedHlsjsConfig = {
    maxBufferSize: 0,
    maxBufferLength: 30,
    liveSyncDuration: 30,
    fragLoadingTimeOut: 4000 // used by fragment-loader
};

//时间单位统一为秒
var defaultP2PConfig = {
    websocketAddr: 'ws://120.78.168.126:3389', //信令&调度服务器地址
    websocketRetryDelay: 2, //发送数据重试时间间隔

    dcKeepAliveInterval: 10, //datachannel多少秒发送一次keep-alive信息
    dcKeepAliveAckTimeout: 2, //datachannel接收keep-alive-ack信息的超时时间，超时则认为连接失败并主动关闭
    dcRequestTimeout: 2, //datachannel接收二进制数据的超时时间
    packetSize: 60 * 1024, //每次通过datachannel发送的包的大小
    maxBufSize: 1024 * 1024 * 100, //p2p缓存的最大数据量
    live: true, //直播或点播
    loadTimeout: 5, //p2p下载的超时时间
    reportInterval: 30 //统计信息上报的时间间隔
};

exports.recommendedHlsjsConfig = recommendedHlsjsConfig;
exports.defaultP2PConfig = defaultP2PConfig;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = Peer;

var debug = __webpack_require__(27)('simple-peer');
var getBrowserRTC = __webpack_require__(29);
var inherits = __webpack_require__(4);
var randombytes = __webpack_require__(30);
var stream = __webpack_require__(31);

var MAX_BUFFERED_AMOUNT = 64 * 1024;

inherits(Peer, stream.Duplex);

/**
 * WebRTC peer connection. Same API as node core `net.Socket`, plus a few extra methods.
 * Duplex stream.
 * @param {Object} opts
 */
function Peer(opts) {
  var self = this;
  if (!(self instanceof Peer)) return new Peer(opts);

  self._id = randombytes(4).toString('hex').slice(0, 7);
  self._debug('new peer %o', opts);

  opts = Object.assign({
    allowHalfOpen: false
  }, opts);

  stream.Duplex.call(self, opts);

  self.channelName = opts.initiator ? opts.channelName || randombytes(20).toString('hex') : null;

  // Needed by _transformConstraints, so set this early
  self._isChromium = typeof window !== 'undefined' && !!window.webkitRTCPeerConnection;

  self.initiator = opts.initiator || false;
  self.channelConfig = opts.channelConfig || Peer.channelConfig;
  self.config = opts.config || Peer.config;
  self.constraints = self._transformConstraints(opts.constraints || Peer.constraints);
  self.offerConstraints = self._transformConstraints(opts.offerConstraints || {});
  self.answerConstraints = self._transformConstraints(opts.answerConstraints || {});
  self.reconnectTimer = opts.reconnectTimer || false;
  self.sdpTransform = opts.sdpTransform || function (sdp) {
    return sdp;
  };
  self.stream = opts.stream || false;
  self.trickle = opts.trickle !== undefined ? opts.trickle : true;
  self._earlyMessage = null;

  self.destroyed = false;
  self.connected = false;

  self.remoteAddress = undefined;
  self.remoteFamily = undefined;
  self.remotePort = undefined;
  self.localAddress = undefined;
  self.localPort = undefined;

  self._wrtc = opts.wrtc && _typeof(opts.wrtc) === 'object' ? opts.wrtc : getBrowserRTC();

  if (!self._wrtc) {
    if (typeof window === 'undefined') {
      throw new Error('No WebRTC support: Specify `opts.wrtc` option in this environment');
    } else {
      throw new Error('No WebRTC support: Not a supported browser');
    }
  }

  self._pcReady = false;
  self._channelReady = false;
  self._iceComplete = false; // ice candidate trickle done (got null candidate)
  self._channel = null;
  self._pendingCandidates = [];
  self._previousStreams = [];

  self._chunk = null;
  self._cb = null;
  self._interval = null;
  self._reconnectTimeout = null;

  self._pc = new self._wrtc.RTCPeerConnection(self.config, self.constraints);

  // We prefer feature detection whenever possible, but sometimes that's not
  // possible for certain implementations.
  self._isWrtc = Array.isArray(self._pc.RTCIceConnectionStates);
  self._isReactNativeWebrtc = typeof self._pc._peerConnectionId === 'number';

  self._pc.oniceconnectionstatechange = function () {
    self._onIceStateChange();
  };
  self._pc.onicegatheringstatechange = function () {
    self._onIceStateChange();
  };
  self._pc.onsignalingstatechange = function () {
    self._onSignalingStateChange();
  };
  self._pc.onicecandidate = function (event) {
    self._onIceCandidate(event);
  };

  // Other spec events, unused by this implementation:
  // - onconnectionstatechange
  // - onicecandidateerror
  // - onfingerprintfailure

  if (self.initiator) {
    var createdOffer = false;
    self._pc.onnegotiationneeded = function () {
      if (!createdOffer) self._createOffer();
      createdOffer = true;
    };

    self._setupData({
      channel: self._pc.createDataChannel(self.channelName, self.channelConfig)
    });
  } else {
    self._pc.ondatachannel = function (event) {
      self._setupData(event);
    };
  }

  if ('addTrack' in self._pc) {
    // WebRTC Spec, Firefox
    if (self.stream) {
      self.stream.getTracks().forEach(function (track) {
        self._pc.addTrack(track, self.stream);
      });
    }
    self._pc.ontrack = function (event) {
      self._onTrack(event);
    };
  } else {
    // Chrome, etc. This can be removed once all browsers support `ontrack`
    if (self.stream) self._pc.addStream(self.stream);
    self._pc.onaddstream = function (event) {
      self._onAddStream(event);
    };
  }

  // HACK: wrtc doesn't fire the 'negotionneeded' event
  if (self.initiator && self._isWrtc) {
    self._pc.onnegotiationneeded();
  }

  self._onFinishBound = function () {
    self._onFinish();
  };
  self.once('finish', self._onFinishBound);
}

Peer.WEBRTC_SUPPORT = !!getBrowserRTC();

/**
 * Expose config, constraints, and data channel config for overriding all Peer
 * instances. Otherwise, just set opts.config, opts.constraints, or opts.channelConfig
 * when constructing a Peer.
 */
Peer.config = {
  iceServers: [{
    urls: 'stun:stun.l.google.com:19302'
  }, {
    urls: 'stun:global.stun.twilio.com:3478?transport=udp'
  }]
};
Peer.constraints = {};
Peer.channelConfig = {};

Object.defineProperty(Peer.prototype, 'bufferSize', {
  get: function get() {
    var self = this;
    return self._channel && self._channel.bufferedAmount || 0;
  }
});

Peer.prototype.address = function () {
  var self = this;
  return { port: self.localPort, family: 'IPv4', address: self.localAddress };
};

Peer.prototype.signal = function (data) {
  var self = this;
  if (self.destroyed) throw new Error('cannot signal after peer is destroyed');
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (err) {
      data = {};
    }
  }
  self._debug('signal()');

  if (data.candidate) {
    if (self._pc.remoteDescription) self._addIceCandidate(data.candidate);else self._pendingCandidates.push(data.candidate);
  }
  if (data.sdp) {
    self._pc.setRemoteDescription(new self._wrtc.RTCSessionDescription(data), function () {
      if (self.destroyed) return;

      self._pendingCandidates.forEach(function (candidate) {
        self._addIceCandidate(candidate);
      });
      self._pendingCandidates = [];

      if (self._pc.remoteDescription.type === 'offer') self._createAnswer();
    }, function (err) {
      self._destroy(err);
    });
  }
  if (!data.sdp && !data.candidate) {
    self._destroy(new Error('signal() called with invalid signal data'));
  }
};

Peer.prototype._addIceCandidate = function (candidate) {
  var self = this;
  try {
    self._pc.addIceCandidate(new self._wrtc.RTCIceCandidate(candidate), noop, function (err) {
      self._destroy(err);
    });
  } catch (err) {
    self._destroy(new Error('error adding candidate: ' + err.message));
  }
};

/**
 * Send text/binary data to the remote peer.
 * @param {TypedArrayView|ArrayBuffer|Buffer|string|Blob|Object} chunk
 */
Peer.prototype.send = function (chunk) {
  var self = this;

  // HACK: `wrtc` module crashes on Node.js Buffer, so convert to Uint8Array
  // See: https://github.com/feross/simple-peer/issues/60
  if (self._isWrtc && Buffer.isBuffer(chunk)) {
    chunk = new Uint8Array(chunk);
  }

  self._channel.send(chunk);
};

Peer.prototype.destroy = function (onclose) {
  var self = this;
  self._destroy(null, onclose);
};

Peer.prototype._destroy = function (err, onclose) {
  var self = this;
  if (self.destroyed) return;
  if (onclose) self.once('close', onclose);

  self._debug('destroy (error: %s)', err && (err.message || err));

  self.readable = self.writable = false;

  if (!self._readableState.ended) self.push(null);
  if (!self._writableState.finished) self.end();

  self.destroyed = true;
  self.connected = false;
  self._pcReady = false;
  self._channelReady = false;
  self._previousStreams = null;
  self._earlyMessage = null;

  clearInterval(self._interval);
  clearTimeout(self._reconnectTimeout);
  self._interval = null;
  self._reconnectTimeout = null;
  self._chunk = null;
  self._cb = null;

  if (self._onFinishBound) self.removeListener('finish', self._onFinishBound);
  self._onFinishBound = null;

  if (self._pc) {
    try {
      self._pc.close();
    } catch (err) {}

    self._pc.oniceconnectionstatechange = null;
    self._pc.onicegatheringstatechange = null;
    self._pc.onsignalingstatechange = null;
    self._pc.onicecandidate = null;
    if ('addTrack' in self._pc) {
      self._pc.ontrack = null;
    } else {
      self._pc.onaddstream = null;
    }
    self._pc.onnegotiationneeded = null;
    self._pc.ondatachannel = null;
  }

  if (self._channel) {
    try {
      self._channel.close();
    } catch (err) {}

    self._channel.onmessage = null;
    self._channel.onopen = null;
    self._channel.onclose = null;
    self._channel.onerror = null;
  }
  self._pc = null;
  self._channel = null;

  if (err) self.emit('error', err);
  self.emit('close');
};

Peer.prototype._setupData = function (event) {
  var self = this;
  if (!event.channel) {
    // In some situations `pc.createDataChannel()` returns `undefined` (in wrtc),
    // which is invalid behavior. Handle it gracefully.
    // See: https://github.com/feross/simple-peer/issues/163
    return self._destroy(new Error('Data channel event is missing `channel` property'));
  }

  self._channel = event.channel;
  self._channel.binaryType = 'arraybuffer';

  if (typeof self._channel.bufferedAmountLowThreshold === 'number') {
    self._channel.bufferedAmountLowThreshold = MAX_BUFFERED_AMOUNT;
  }

  self.channelName = self._channel.label;

  self._channel.onmessage = function (event) {
    if (!self._channelReady) {
      // HACK: Workaround for Chrome not firing "open" between tabs
      self._earlyMessage = event;
      self._onChannelOpen();
    } else {
      self._onChannelMessage(event);
    }
  };
  self._channel.onbufferedamountlow = function () {
    self._onChannelBufferedAmountLow();
  };
  self._channel.onopen = function () {
    if (!self._channelReady) self._onChannelOpen();
  };
  self._channel.onclose = function () {
    self._onChannelClose();
  };
  self._channel.onerror = function (err) {
    self._destroy(err);
  };
};

Peer.prototype._read = function () {};

Peer.prototype._write = function (chunk, encoding, cb) {
  var self = this;
  if (self.destroyed) return cb(new Error('cannot write after peer is destroyed'));

  if (self.connected) {
    try {
      self.send(chunk);
    } catch (err) {
      return self._destroy(err);
    }
    if (self._channel.bufferedAmount > MAX_BUFFERED_AMOUNT) {
      self._debug('start backpressure: bufferedAmount %d', self._channel.bufferedAmount);
      self._cb = cb;
    } else {
      cb(null);
    }
  } else {
    self._debug('write before connect');
    self._chunk = chunk;
    self._cb = cb;
  }
};

// When stream finishes writing, close socket. Half open connections are not
// supported.
Peer.prototype._onFinish = function () {
  var self = this;
  if (self.destroyed) return;

  if (self.connected) {
    destroySoon();
  } else {
    self.once('connect', destroySoon);
  }

  // Wait a bit before destroying so the socket flushes.
  // TODO: is there a more reliable way to accomplish this?
  function destroySoon() {
    setTimeout(function () {
      self._destroy();
    }, 1000);
  }
};

Peer.prototype._createOffer = function () {
  var self = this;
  if (self.destroyed) return;

  self._pc.createOffer(function (offer) {
    if (self.destroyed) return;
    offer.sdp = self.sdpTransform(offer.sdp);
    self._pc.setLocalDescription(offer, onSuccess, onError);

    function onSuccess() {
      if (self.destroyed) return;
      if (self.trickle || self._iceComplete) sendOffer();else self.once('_iceComplete', sendOffer); // wait for candidates
    }

    function onError(err) {
      self._destroy(err);
    }

    function sendOffer() {
      var signal = self._pc.localDescription || offer;
      self._debug('signal');
      self.emit('signal', {
        type: signal.type,
        sdp: signal.sdp
      });
    }
  }, function (err) {
    self._destroy(err);
  }, self.offerConstraints);
};

Peer.prototype._createAnswer = function () {
  var self = this;
  if (self.destroyed) return;

  self._pc.createAnswer(function (answer) {
    if (self.destroyed) return;
    answer.sdp = self.sdpTransform(answer.sdp);
    self._pc.setLocalDescription(answer, onSuccess, onError);

    function onSuccess() {
      if (self.destroyed) return;
      if (self.trickle || self._iceComplete) sendAnswer();else self.once('_iceComplete', sendAnswer);
    }

    function onError(err) {
      self._destroy(err);
    }

    function sendAnswer() {
      var signal = self._pc.localDescription || answer;
      self._debug('signal');
      self.emit('signal', {
        type: signal.type,
        sdp: signal.sdp
      });
    }
  }, function (err) {
    self._destroy(err);
  }, self.answerConstraints);
};

Peer.prototype._onIceStateChange = function () {
  var self = this;
  if (self.destroyed) return;
  var iceConnectionState = self._pc.iceConnectionState;
  var iceGatheringState = self._pc.iceGatheringState;

  self._debug('iceStateChange (connection: %s) (gathering: %s)', iceConnectionState, iceGatheringState);
  self.emit('iceStateChange', iceConnectionState, iceGatheringState);

  if (iceConnectionState === 'connected' || iceConnectionState === 'completed') {
    clearTimeout(self._reconnectTimeout);
    self._pcReady = true;
    self._maybeReady();
  }
  if (iceConnectionState === 'disconnected') {
    if (self.reconnectTimer) {
      // If user has set `opt.reconnectTimer`, allow time for ICE to attempt a reconnect
      clearTimeout(self._reconnectTimeout);
      self._reconnectTimeout = setTimeout(function () {
        self._destroy();
      }, self.reconnectTimer);
    } else {
      self._destroy();
    }
  }
  if (iceConnectionState === 'failed') {
    self._destroy(new Error('Ice connection failed.'));
  }
  if (iceConnectionState === 'closed') {
    self._destroy();
  }
};

Peer.prototype.getStats = function (cb) {
  var self = this;

  // Promise-based getStats() (standard)
  if (self._pc.getStats.length === 0) {
    self._pc.getStats().then(function (res) {
      var reports = [];
      res.forEach(function (report) {
        reports.push(report);
      });
      cb(null, reports);
    }, function (err) {
      cb(err);
    });

    // Two-parameter callback-based getStats() (deprecated, former standard)
  } else if (self._isReactNativeWebrtc) {
    self._pc.getStats(null, function (res) {
      var reports = [];
      res.forEach(function (report) {
        reports.push(report);
      });
      cb(null, reports);
    }, function (err) {
      cb(err);
    });

    // Single-parameter callback-based getStats() (non-standard)
  } else if (self._pc.getStats.length > 0) {
    self._pc.getStats(function (res) {
      // If we destroy connection in `connect` callback this code might happen to run when actual connection is already closed
      if (self.destroyed) return;

      var reports = [];
      res.result().forEach(function (result) {
        var report = {};
        result.names().forEach(function (name) {
          report[name] = result.stat(name);
        });
        report.id = result.id;
        report.type = result.type;
        report.timestamp = result.timestamp;
        reports.push(report);
      });
      cb(null, reports);
    }, function (err) {
      cb(err);
    });

    // Unknown browser, skip getStats() since it's anyone's guess which style of
    // getStats() they implement.
  } else {
    cb(null, []);
  }
};

Peer.prototype._maybeReady = function () {
  var self = this;
  self._debug('maybeReady pc %s channel %s', self._pcReady, self._channelReady);
  if (self.connected || self._connecting || !self._pcReady || !self._channelReady) return;

  self._connecting = true;

  // HACK: We can't rely on order here, for details see https://github.com/js-platform/node-webrtc/issues/339
  function findCandidatePair() {
    if (self.destroyed) return;

    self.getStats(function (err, items) {
      if (self.destroyed) return;

      // Treat getStats error as non-fatal. It's not essential.
      if (err) items = [];

      var remoteCandidates = {};
      var localCandidates = {};
      var candidatePairs = {};
      var foundSelectedCandidatePair = false;

      items.forEach(function (item) {
        // TODO: Once all browsers support the hyphenated stats report types, remove
        // the non-hypenated ones
        if (item.type === 'remotecandidate' || item.type === 'remote-candidate') {
          remoteCandidates[item.id] = item;
        }
        if (item.type === 'localcandidate' || item.type === 'local-candidate') {
          localCandidates[item.id] = item;
        }
        if (item.type === 'candidatepair' || item.type === 'candidate-pair') {
          candidatePairs[item.id] = item;
        }
      });

      items.forEach(function (item) {
        // Spec-compliant
        if (item.type === 'transport') {
          setSelectedCandidatePair(candidatePairs[item.selectedCandidatePairId]);
        }

        // Old implementations
        if (item.type === 'googCandidatePair' && item.googActiveConnection === 'true' || (item.type === 'candidatepair' || item.type === 'candidate-pair') && item.selected) {
          setSelectedCandidatePair(item);
        }
      });

      function setSelectedCandidatePair(selectedCandidatePair) {
        foundSelectedCandidatePair = true;

        var local = localCandidates[selectedCandidatePair.localCandidateId];

        if (local && local.ip) {
          // Spec
          self.localAddress = local.ip;
          self.localPort = Number(local.port);
        } else if (local && local.ipAddress) {
          // Firefox
          self.localAddress = local.ipAddress;
          self.localPort = Number(local.portNumber);
        } else if (typeof selectedCandidatePair.googLocalAddress === 'string') {
          // TODO: remove this once Chrome 58 is released
          local = selectedCandidatePair.googLocalAddress.split(':');
          self.localAddress = local[0];
          self.localPort = Number(local[1]);
        }

        var remote = remoteCandidates[selectedCandidatePair.remoteCandidateId];

        if (remote && remote.ip) {
          // Spec
          self.remoteAddress = remote.ip;
          self.remotePort = Number(remote.port);
        } else if (remote && remote.ipAddress) {
          // Firefox
          self.remoteAddress = remote.ipAddress;
          self.remotePort = Number(remote.portNumber);
        } else if (typeof selectedCandidatePair.googRemoteAddress === 'string') {
          // TODO: remove this once Chrome 58 is released
          remote = selectedCandidatePair.googRemoteAddress.split(':');
          self.remoteAddress = remote[0];
          self.remotePort = Number(remote[1]);
        }
        self.remoteFamily = 'IPv4';

        self._debug('connect local: %s:%s remote: %s:%s', self.localAddress, self.localPort, self.remoteAddress, self.remotePort);
      }

      if (!foundSelectedCandidatePair && items.length) {
        setTimeout(findCandidatePair, 100);
        return;
      } else {
        self._connecting = false;
        self.connected = true;
      }

      if (self._chunk) {
        try {
          self.send(self._chunk);
        } catch (err) {
          return self._destroy(err);
        }
        self._chunk = null;
        self._debug('sent chunk from "write before connect"');

        var cb = self._cb;
        self._cb = null;
        cb(null);
      }

      // If `bufferedAmountLowThreshold` and 'onbufferedamountlow' are unsupported,
      // fallback to using setInterval to implement backpressure.
      if (typeof self._channel.bufferedAmountLowThreshold !== 'number') {
        self._interval = setInterval(function () {
          self._onInterval();
        }, 150);
        if (self._interval.unref) self._interval.unref();
      }

      self._debug('connect');
      self.emit('connect');
      if (self._earlyMessage) {
        // HACK: Workaround for Chrome not firing "open" between tabs
        self._onChannelMessage(self._earlyMessage);
        self._earlyMessage = null;
      }
    });
  }
  findCandidatePair();
};

Peer.prototype._onInterval = function () {
  if (!this._cb || !this._channel || this._channel.bufferedAmount > MAX_BUFFERED_AMOUNT) {
    return;
  }
  this._onChannelBufferedAmountLow();
};

Peer.prototype._onSignalingStateChange = function () {
  var self = this;
  if (self.destroyed) return;
  self._debug('signalingStateChange %s', self._pc.signalingState);
  self.emit('signalingStateChange', self._pc.signalingState);
};

Peer.prototype._onIceCandidate = function (event) {
  var self = this;
  if (self.destroyed) return;
  if (event.candidate && self.trickle) {
    self.emit('signal', {
      candidate: {
        candidate: event.candidate.candidate,
        sdpMLineIndex: event.candidate.sdpMLineIndex,
        sdpMid: event.candidate.sdpMid
      }
    });
  } else if (!event.candidate) {
    self._iceComplete = true;
    self.emit('_iceComplete');
  }
};

Peer.prototype._onChannelMessage = function (event) {
  var self = this;
  if (self.destroyed) return;
  var data = event.data;
  if (data instanceof ArrayBuffer) data = Buffer.from(data);
  self.push(data);
};

Peer.prototype._onChannelBufferedAmountLow = function () {
  var self = this;
  if (self.destroyed || !self._cb) return;
  self._debug('ending backpressure: bufferedAmount %d', self._channel.bufferedAmount);
  var cb = self._cb;
  self._cb = null;
  cb(null);
};

Peer.prototype._onChannelOpen = function () {
  var self = this;
  if (self.connected || self.destroyed) return;
  self._debug('on channel open');
  self._channelReady = true;
  self._maybeReady();
};

Peer.prototype._onChannelClose = function () {
  var self = this;
  if (self.destroyed) return;
  self._debug('on channel close');
  self._destroy();
};

Peer.prototype._onAddStream = function (event) {
  var self = this;
  if (self.destroyed) return;
  self._debug('on add stream');
  self.emit('stream', event.stream);
};

Peer.prototype._onTrack = function (event) {
  var self = this;
  if (self.destroyed) return;
  self._debug('on track');
  var id = event.streams[0].id;
  if (self._previousStreams.indexOf(id) !== -1) return; // Only fire one 'stream' event, even though there may be multiple tracks per stream
  self._previousStreams.push(id);
  self.emit('stream', event.streams[0]);
};

Peer.prototype._debug = function () {
  var self = this;
  var args = [].slice.call(arguments);
  args[0] = '[' + self._id + '] ' + args[0];
  debug.apply(null, args);
};

// Transform constraints objects into the new format (unless Chromium)
// TODO: This can be removed when Chromium supports the new format
Peer.prototype._transformConstraints = function (constraints) {
  var self = this;

  if (Object.keys(constraints).length === 0) {
    return constraints;
  }

  if ((constraints.mandatory || constraints.optional) && !self._isChromium) {
    // convert to new format

    // Merge mandatory and optional objects, prioritizing mandatory
    var newConstraints = Object.assign({}, constraints.optional, constraints.mandatory);

    // fix casing
    if (newConstraints.OfferToReceiveVideo !== undefined) {
      newConstraints.offerToReceiveVideo = newConstraints.OfferToReceiveVideo;
      delete newConstraints['OfferToReceiveVideo'];
    }

    if (newConstraints.OfferToReceiveAudio !== undefined) {
      newConstraints.offerToReceiveAudio = newConstraints.OfferToReceiveAudio;
      delete newConstraints['OfferToReceiveAudio'];
    }

    return newConstraints;
  } else if (!constraints.mandatory && !constraints.optional && self._isChromium) {
    // convert to old format

    // fix casing
    if (constraints.offerToReceiveVideo !== undefined) {
      constraints.OfferToReceiveVideo = constraints.offerToReceiveVideo;
      delete constraints['offerToReceiveVideo'];
    }

    if (constraints.offerToReceiveAudio !== undefined) {
      constraints.OfferToReceiveAudio = constraints.offerToReceiveAudio;
      delete constraints['offerToReceiveAudio'];
    }

    return {
      mandatory: constraints // NOTE: All constraints are upgraded to mandatory
    };
  }

  return constraints;
};

function noop() {}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7).Buffer))

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
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



/*<replacement>*/

var processNextTick = __webpack_require__(10);
/*</replacement>*/

module.exports = Readable;

/*<replacement>*/
var isArray = __webpack_require__(14);
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = __webpack_require__(0).EventEmitter;

var EElistenerCount = function EElistenerCount(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream = __webpack_require__(16);
/*</replacement>*/

// TODO(bmeurer): Change this back to const once hole checks are
// properly optimized away early in Ignition+TurboFan.
/*<replacement>*/
var Buffer = __webpack_require__(8).Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*</replacement>*/

/*<replacement>*/
var util = __webpack_require__(9);
util.inherits = __webpack_require__(4);
/*</replacement>*/

/*<replacement>*/
var debugUtil = __webpack_require__(32);
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function debug() {};
}
/*</replacement>*/

var BufferList = __webpack_require__(33);
var destroyImpl = __webpack_require__(17);
var StringDecoder;

util.inherits(Readable, Stream);

var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') {
    return emitter.prependListener(event, fn);
  } else {
    // This is a hack to make sure that our error handler is attached before any
    // userland ones.  NEVER DO THIS. This is here only because this code needs
    // to continue to work with older versions of Node.js that do not include
    // the prependListener() method. The goal is to eventually remove this hack.
    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
  }
}

function ReadableState(options, stream) {
  Duplex = Duplex || __webpack_require__(5);

  options = options || {};

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // has it been destroyed
  this.destroyed = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = __webpack_require__(19).StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || __webpack_require__(5);

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  Stream.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  get: function get() {
    if (this._readableState === undefined) {
      return false;
    }
    return this._readableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
  }
});

Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;
Readable.prototype._destroy = function (err, cb) {
  this.push(null);
  cb(err);
};

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;
      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }
      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  var state = stream._readableState;
  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);
    if (er) {
      stream.emit('error', er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) stream.emit('error', new Error('stream.unshift() after end event'));else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        stream.emit('error', new Error('stream.push() after EOF'));
      } else {
        state.reading = false;
        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
    }
  }

  return needMoreData(state);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    stream.emit('data', chunk);
    stream.read(0);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

    if (state.needReadable) emitReadable(stream);
  }
  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;
  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = __webpack_require__(19).StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) processNextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    processNextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) processNextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');
    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.
  var increasedAwaitDrain = false;
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);
    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = { hasUnpiped: false };

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, unpipeInfo);
    }return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;

  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this, unpipeInfo);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      if (!state.reading) {
        processNextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    processNextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null) {}
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], self.emit.bind(self, kProxyEvents[n]));
  }

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;

  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }

  return ret;
}

// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}

// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
  var ret = Buffer.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    processNextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(1)))

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(0).EventEmitter;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*<replacement>*/

var processNextTick = __webpack_require__(10);
/*</replacement>*/

// undocumented cb() API, needed for core, not for public API
function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
      processNextTick(emitErrorNT, this, err);
    }
    return;
  }

  // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks

  if (this._readableState) {
    this._readableState.destroyed = true;
  }

  // if this is a duplex stream mark the writable part as destroyed as well
  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      processNextTick(emitErrorNT, _this, err);
      if (_this._writableState) {
        _this._writableState.errorEmitted = true;
      }
    } else if (cb) {
      cb(err);
    }
  });
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

module.exports = {
  destroy: destroy,
  undestroy: undestroy
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, setImmediate, global) {// Copyright Joyent, Inc. and other Node contributors.
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

// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.



/*<replacement>*/

var processNextTick = __webpack_require__(10);
/*</replacement>*/

module.exports = Writable;

/* <replacement> */
function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;
  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = __webpack_require__(9);
util.inherits = __webpack_require__(4);
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: __webpack_require__(36)
};
/*</replacement>*/

/*<replacement>*/
var Stream = __webpack_require__(16);
/*</replacement>*/

/*<replacement>*/
var Buffer = __webpack_require__(8).Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*</replacement>*/

var destroyImpl = __webpack_require__(17);

util.inherits(Writable, Stream);

function nop() {}

function WritableState(options, stream) {
  Duplex = Duplex || __webpack_require__(5);

  options = options || {};

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // if _final has been called
  this.finalCalled = false;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // has it been destroyed
  this.destroyed = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function value(object) {
      if (realHasInstance.call(this, object)) return true;

      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function realHasInstance(object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || __webpack_require__(5);

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
    return new Writable(options);
  }

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;

    if (typeof options.final === 'function') this._final = options.final;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  processNextTick(cb, er);
}

// Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;

  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    processNextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;
  var isBuf = _isUint8Array(chunk) && !state.objectMode;

  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);
    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    processNextTick(cb, er);
    // this can emit finish, and it will always happen
    // after error
    processNextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
    // this can emit finish, but finish must
    // always follow error
    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    var allBuffers = true;
    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }
    buffer.allBuffers = allBuffers;

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequestCount = 0;
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}
function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;
    if (err) {
      stream.emit('error', err);
    }
    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}
function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function') {
      state.pendingcb++;
      state.finalCalled = true;
      processNextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    prefinish(stream, state);
    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) processNextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;
  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  }
  if (state.corkedRequestsFree) {
    state.corkedRequestsFree.next = corkReq;
  } else {
    state.corkedRequestsFree = corkReq;
  }
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  get: function get() {
    if (this._writableState === undefined) {
      return false;
    }
    return this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._writableState.destroyed = value;
  }
});

Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;
Writable.prototype._destroy = function (err, cb) {
  this.end();
  cb(err);
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(34).setImmediate, __webpack_require__(3)))

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Buffer = __webpack_require__(8).Buffer;

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return -1;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// UTF-8 replacement characters ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\uFFFD'.repeat(p);
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\uFFFD'.repeat(p + 1);
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\uFFFD'.repeat(p + 2);
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character for each buffered byte of a (partial)
// character needs to be added to the output.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\uFFFD'.repeat(this.lastTotal - this.lastNeed);
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.



module.exports = Transform;

var Duplex = __webpack_require__(5);

/*<replacement>*/
var util = __webpack_require__(9);
util.inherits = __webpack_require__(4);
/*</replacement>*/

util.inherits(Transform, Duplex);

function TransformState(stream) {
  this.afterTransform = function (er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
  this.writeencoding = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) {
    return stream.emit('error', new Error('write callback called multiple times'));
  }

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined) stream.push(data);

  cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(this);

  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.once('prefinish', function () {
    if (typeof this._flush === 'function') this._flush(function (er, data) {
      done(stream, er, data);
    });else done(stream);
  });
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform.prototype._destroy = function (err, cb) {
  var _this = this;

  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
    _this.emit('close');
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  if (data !== null && data !== undefined) stream.push(data);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

  if (ts.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = __webpack_require__(23);

var _index2 = _interopRequireDefault(_index);

var _hls = __webpack_require__(47);

var _hls2 = _interopRequireDefault(_hls);

var _events = __webpack_require__(6);

var _events2 = _interopRequireDefault(_events);

var _config = __webpack_require__(12);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by xieting on 2018/1/2.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var HlsPeerifyBundle = function (_Hlsjs) {
    _inherits(HlsPeerifyBundle, _Hlsjs);

    _createClass(HlsPeerifyBundle, null, [{
        key: 'P2PEvents',
        get: function get() {
            return _events2.default;
        }
    }, {
        key: 'uaParserResult',
        get: function get() {
            return _index2.default.uaParserResult;
        }
    }]);

    function HlsPeerifyBundle(p2pConfig) {
        var hlsjsConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, HlsPeerifyBundle);

        var mergedHlsjsConfig = Object.assign({}, _config.recommendedHlsjsConfig, hlsjsConfig);

        var _this = _possibleConstructorReturn(this, (HlsPeerifyBundle.__proto__ || Object.getPrototypeOf(HlsPeerifyBundle)).call(this, mergedHlsjsConfig));

        if (_index2.default.WEBRTC_SUPPORT) {
            _this.p2pPlugin = new _index2.default(_this, p2pConfig);
        }

        return _this;
    }

    _createClass(HlsPeerifyBundle, [{
        key: 'enableP2P',
        value: function enableP2P() {
            this.p2pPlugin.enableP2P();
        }
    }, {
        key: 'disableP2P',
        value: function disableP2P() {
            this.p2pPlugin.disableP2P();
        }
    }]);

    return HlsPeerifyBundle;
}(_hls2.default);

HlsPeerifyBundle.pluginVersion = _index2.default.version;

exports.default = HlsPeerifyBundle;
module.exports = exports['default'];

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = __webpack_require__(2);

var _debug2 = _interopRequireDefault(_debug);

var _events = __webpack_require__(6);

var _events2 = _interopRequireDefault(_events);

var _events3 = __webpack_require__(0);

var _events4 = _interopRequireDefault(_events3);

var _config = __webpack_require__(12);

var _simplePeer = __webpack_require__(13);

var _simplePeer2 = _interopRequireDefault(_simplePeer);

var _p2pSignaler = __webpack_require__(38);

var _p2pSignaler2 = _interopRequireDefault(_p2pSignaler);

var _hybridLoader = __webpack_require__(41);

var _hybridLoader2 = _interopRequireDefault(_hybridLoader);

var _bufferManager = __webpack_require__(43);

var _bufferManager2 = _interopRequireDefault(_bufferManager);

var _uaParserJs = __webpack_require__(44);

var _uaParserJs2 = _interopRequireDefault(_uaParserJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by xieting on 2018/1/2.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var log = (0, _debug2.default)('index.hls-peerify');
var uaParserResult = new _uaParserJs2.default().getResult();

var HlsPeerify = function (_EventEmitter) {
    _inherits(HlsPeerify, _EventEmitter);

    _createClass(HlsPeerify, null, [{
        key: 'Events',
        get: function get() {
            return _events2.default;
        }
    }, {
        key: 'uaParserResult',
        get: function get() {
            return uaParserResult;
        }
    }]);

    function HlsPeerify(hlsjs, p2pConfig) {
        _classCallCheck(this, HlsPeerify);

        var _this = _possibleConstructorReturn(this, (HlsPeerify.__proto__ || Object.getPrototypeOf(HlsPeerify)).call(this));

        _this.config = Object.assign({}, _config.defaultP2PConfig, p2pConfig);
        if (_this.config.debug) {
            _debug2.default.enable('*');
        } else {
            _debug2.default.disable();
        }

        _this.hlsjs = hlsjs;
        _this.p2pEnabled = true; //默认开启P2P

        hlsjs.config.currLoaded = hlsjs.config.currPlay = 0;

        if (hlsjs.url) {
            var channel = hlsjs.url.split('?')[0];
            _this._init(channel);
        } else {
            hlsjs.on(hlsjs.constructor.Events.MANIFEST_PARSED, function (event, data) {
                var channel = hlsjs.url.split('?')[0];
                _this._init(channel);
            });
        }

        //level上报
        _this.levelCounter = 0;
        _this.averageLevel = -1;
        //流量上报
        _this.cdnDownloaded = 0;
        _this.p2pDownloaded = 0;
        _this.reportIntervalId = window.setInterval(_this._statisticsReport.bind(_this), _this.config.reportInterval * 1000);
        return _this;
    }

    _createClass(HlsPeerify, [{
        key: '_init',
        value: function _init(channel) {
            var _this2 = this;

            //上传浏览器信息
            var browserInfo = {
                browser: uaParserResult.browser.name,
                device: uaParserResult.device.type === 'mobile' ? 'mobile' : 'PC',
                os: uaParserResult.os.name

                //实例化信令
            };this.signaler = new _p2pSignaler2.default(channel, this.config, browserInfo);

            //实例化BufferManager
            this.bufMgr = new _bufferManager2.default(this.config);
            this.hlsjs.config.bufMgr = this.bufMgr;

            //通过config向hybrid-loader导入p2p-scheduler
            this.hlsjs.config.p2pLoader = this.signaler.scheduler;

            //向hybrid-loader导入buffer-manager
            this.hlsjs.config.p2pLoader.bufMgr = this.bufMgr;

            //替换fLoader
            this.hlsjs.config.fLoader = _hybridLoader2.default;

            this.hlsjs.config.p2pEnabled = this.p2pEnabled;

            this.hlsjs.on(this.hlsjs.constructor.Events.FRAG_LOADING, function (id, data) {
                // log('FRAG_LOADING: ' + JSON.stringify(data.frag));
                log('FRAG_LOADING: ' + data.frag.sn);

                //level统计
                _this2.averageLevel = (_this2.averageLevel * _this2.levelCounter + data.frag.level) / ++_this2.levelCounter;
            });

            this.hlsjs.on(this.hlsjs.constructor.Events.FRAG_LOADED, function (id, data) {
                _this2.hlsjs.config.currLoaded = data.frag.sn;
                _this2.hlsjs.config.currLoadedDuration = data.frag.duration;
                if (data.frag.loadByXhr) {
                    log('FRAG_LOADED ' + data.frag.sn + ' loadByXhr');
                    _this2.cdnDownloaded += data.frag.loaded;
                } else {
                    log('FRAG_LOADED ' + data.frag.sn + ' loadByP2P');
                    _this2.p2pDownloaded += data.frag.loaded;
                }
            });

            this.hlsjs.on(this.hlsjs.constructor.Events.FRAG_CHANGED, function (id, data) {
                // log('FRAG_CHANGED: '+JSON.stringify(data.frag, null, 2));
                log('FRAG_CHANGED: ' + data.frag.sn);
                _this2.hlsjs.config.currPlay = data.frag.sn;
            });

            // this.hlsjs.on(this.hlsjs.constructor.Events.LEVEL_LOADED, (id, data) => {
            //     log('LEVEL_LOADED totalduration: '+JSON.stringify(data.details.totalduration, null, 2));
            //     log('LEVEL_LOADED live: '+JSON.stringify(data.details.live, null, 2));
            // });


            this.hlsjs.on(this.hlsjs.constructor.Events.DESTROYING, function () {
                // log('DESTROYING: '+JSON.stringify(frag));
                _this2.signaler.destroy();
                _this2.signaler = null;

                window.clearInterval(_this2.reportIntervalId);
            });
        }
    }, {
        key: 'disableP2P',
        value: function disableP2P() {
            //停止p2p
            if (this.p2pEnabled) {
                this.p2pEnabled = false;
                this.hlsjs.config.p2pEnabled = this.p2pEnabled;
                this.signaler.stopP2P();
            }
        }
    }, {
        key: 'enableP2P',
        value: function enableP2P() {
            //在停止的情况下重新启动P2P
            log('enableP2P');
            if (!this.p2pEnabled) {
                this.p2pEnabled = true;
                this.hlsjs.config.p2pEnabled = this.p2pEnabled;
            }
        }
    }, {
        key: '_statisticsReport',
        value: function _statisticsReport() {

            if (this.signaler) {
                var msg = {
                    action: 'statistics',
                    level: this.averageLevel.toFixed(2),
                    cdn: Math.round(this.cdnDownloaded / 1024), //单位KB
                    p2p: Math.round(this.p2pDownloaded / 1024)
                };
                this.signaler.send(msg);
                this.cdnDownloaded = this.p2pDownloaded = 0; //上报的是增量部分
            }
        }
    }]);

    return HlsPeerify;
}(_events4.default);

HlsPeerify.WEBRTC_SUPPORT = _simplePeer2.default.WEBRTC_SUPPORT;

HlsPeerify.version = "0.0.1";

exports.default = HlsPeerify;
module.exports = exports['default'];

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(11);

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0,
      i;

  for (i in namespace) {
    hash = (hash << 5) - hash + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy() {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength;
exports.toByteArray = toByteArray;
exports.fromByteArray = fromByteArray;

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}

revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;

function placeHoldersCount(b64) {
  var len = b64.length;
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4');
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;
}

function byteLength(b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64);
}

function toByteArray(b64) {
  var i, l, tmp, placeHolders, arr;
  var len = b64.length;
  placeHolders = placeHoldersCount(b64);

  arr = new Arr(len * 3 / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0; i < l; i += 4) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = tmp >> 16 & 0xFF;
    arr[L++] = tmp >> 8 & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[L++] = tmp >> 8 & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr;
}

function tripletToBase64(num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
}

function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
    output.push(tripletToBase64(tmp));
  }
  return output.join('');
}

function fromByteArray(uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[tmp << 4 & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    output += lookup[tmp >> 10];
    output += lookup[tmp >> 4 & 0x3F];
    output += lookup[tmp << 2 & 0x3F];
    output += '=';
  }

  parts.push(output);

  return parts.join('');
}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(28);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome && 'undefined' != typeof chrome.storage ? chrome.storage.local : localstorage();

/**
 * Colors.
 */

exports.colors = ['lightseagreen', 'forestgreen', 'goldenrod', 'dodgerblue', 'darkorchid', 'crimson'];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance ||
  // is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) ||
  // is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 ||
  // double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '') + this.namespace + (useColors ? ' %c' : ' ') + args[0] + (useColors ? '%c ' : ' ') + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit');

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function (match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === (typeof console === 'undefined' ? 'undefined' : _typeof(console)) && console.log && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch (e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch (e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(11);

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0,
      i;

  for (i in namespace) {
    hash = (hash << 5) - hash + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// originally pulled out of simple-peer

module.exports = function getBrowserRTC() {
  if (typeof window === 'undefined') return null;
  var wrtc = {
    RTCPeerConnection: window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection,
    RTCSessionDescription: window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription,
    RTCIceCandidate: window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate
  };
  if (!wrtc.RTCPeerConnection) return null;
  return wrtc;
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {

function oldBrowser() {
  throw new Error('secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11');
}

var Buffer = __webpack_require__(8).Buffer;
var crypto = global.crypto || global.msCrypto;

if (crypto && crypto.getRandomValues) {
  module.exports = randomBytes;
} else {
  module.exports = oldBrowser;
}

function randomBytes(size, cb) {
  // phantomjs needs to throw
  if (size > 65536) throw new Error('requested too many random bytes');
  // in case browserify  isn't using the Uint8Array version
  var rawBytes = new global.Uint8Array(size);

  // This will not work in older browsers.
  // See https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues
  if (size > 0) {
    // getRandomValues fails on IE if size == 0
    crypto.getRandomValues(rawBytes);
  }

  // XXX: phantomjs doesn't like a buffer being passed here
  var bytes = Buffer.from(rawBytes.buffer);

  if (typeof cb === 'function') {
    return process.nextTick(function () {
      cb(null, bytes);
    });
  }

  return bytes;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(1)))

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports = module.exports = __webpack_require__(15);
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = __webpack_require__(18);
exports.Duplex = __webpack_require__(5);
exports.Transform = __webpack_require__(20);
exports.PassThrough = __webpack_require__(37);

/***/ }),
/* 32 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*<replacement>*/

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Buffer = __webpack_require__(8).Buffer;
/*</replacement>*/

function copyBuffer(src, target, offset) {
  src.copy(target, offset);
}

module.exports = function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  BufferList.prototype.push = function push(v) {
    var entry = { data: v, next: null };
    if (this.length > 0) this.tail.next = entry;else this.head = entry;
    this.tail = entry;
    ++this.length;
  };

  BufferList.prototype.unshift = function unshift(v) {
    var entry = { data: v, next: this.head };
    if (this.length === 0) this.tail = entry;
    this.head = entry;
    ++this.length;
  };

  BufferList.prototype.shift = function shift() {
    if (this.length === 0) return;
    var ret = this.head.data;
    if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
    --this.length;
    return ret;
  };

  BufferList.prototype.clear = function clear() {
    this.head = this.tail = null;
    this.length = 0;
  };

  BufferList.prototype.join = function join(s) {
    if (this.length === 0) return '';
    var p = this.head;
    var ret = '' + p.data;
    while (p = p.next) {
      ret += s + p.data;
    }return ret;
  };

  BufferList.prototype.concat = function concat(n) {
    if (this.length === 0) return Buffer.alloc(0);
    if (this.length === 1) return this.head.data;
    var ret = Buffer.allocUnsafe(n >>> 0);
    var p = this.head;
    var i = 0;
    while (p) {
      copyBuffer(p.data, ret, i);
      i += p.data.length;
      p = p.next;
    }
    return ret;
  };

  return BufferList;
}();

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function () {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function () {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout = exports.clearInterval = function (timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function () {};
Timeout.prototype.close = function () {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function (item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function (item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function (item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout) item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(35);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {

(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
        // Callback can either be a function or a string
        if (typeof callback !== "function") {
            callback = new Function("" + callback);
        }
        // Copy function arguments
        var args = new Array(arguments.length - 1);
        for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i + 1];
        }
        // Store and register the task
        var task = { callback: callback, args: args };
        tasksByHandle[nextHandle] = task;
        registerImmediate(nextHandle);
        return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
            case 0:
                callback();
                break;
            case 1:
                callback(args[0]);
                break;
            case 2:
                callback(args[0], args[1]);
                break;
            case 3:
                callback(args[0], args[1], args[2]);
                break;
            default:
                callback.apply(undefined, args);
                break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function registerImmediate(handle) {
            process.nextTick(function () {
                runIfPresent(handle);
            });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function () {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function onGlobalMessage(event) {
            if (event.source === global && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function registerImmediate(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function (event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function registerImmediate(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function registerImmediate(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function registerImmediate(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();
    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();
    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();
    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();
    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
})(typeof self === "undefined" ? typeof global === "undefined" ? undefined : global : self);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(1)))

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate(fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config(name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.



module.exports = PassThrough;

var Transform = __webpack_require__(20);

/*<replacement>*/
var util = __webpack_require__(9);
util.inherits = __webpack_require__(4);
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = __webpack_require__(2);

var _debug2 = _interopRequireDefault(_debug);

var _events = __webpack_require__(0);

var _events2 = _interopRequireDefault(_events);

var _events3 = __webpack_require__(6);

var _events4 = _interopRequireDefault(_events3);

var _dataChannel = __webpack_require__(39);

var _dataChannel2 = _interopRequireDefault(_dataChannel);

var _p2pScheduler = __webpack_require__(40);

var _p2pScheduler2 = _interopRequireDefault(_p2pScheduler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by xieting on 2018/1/3.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/*
TODO:
 */

var log = (0, _debug2.default)('p2p-signaler');

var P2PSignaler = function (_EventEmitter) {
    _inherits(P2PSignaler, _EventEmitter);

    function P2PSignaler(channel, config, info) {
        _classCallCheck(this, P2PSignaler);

        var _this = _possibleConstructorReturn(this, (P2PSignaler.__proto__ || Object.getPrototypeOf(P2PSignaler)).call(this));

        _this.config = config;
        _this.connected = false;
        _this.channel = channel; //频道
        _this.scheduler = new _p2pScheduler2.default(config);
        _this.DCMap = new Map(); //{key: channelId, value: DataChannnel}
        log('connecting to :' + config.websocketAddr);
        _this.websocket = new WebSocket(config.websocketAddr);

        _this._init(_this.websocket, info);

        return _this;
    }

    _createClass(P2PSignaler, [{
        key: 'send',
        value: function send(msg) {
            if (this.connected) {
                this.websocket.send(msg);
            }
        }
    }, {
        key: 'stopP2P',
        value: function stopP2P() {
            this.scheduler.clearAllStreamers();
            var msg = {
                action: 'leave'
            };
            this.send(msg);
        }
    }, {
        key: '_init',
        value: function _init(websocket, info) {
            var _this2 = this;

            websocket.onopen = function () {
                log('websocket connection opened with channel: ' + _this2.channel);
                _this2.connected = true;

                //发送进入频道请求
                var msg = {
                    action: 'enter',
                    channel: _this2.channel
                };

                if (info) {
                    msg = Object.assign(msg, info);
                }

                websocket.push(JSON.stringify(msg));
            };

            websocket.push = websocket.send;
            websocket.send = function (msg) {
                if (websocket.readyState != 1) {
                    log('websocket connection is not opened yet.');
                    //重新连接
                    websocket.close();
                    _this2.websocket = new WebSocket(_this2.config.websocketAddr);
                    _this2._init(_this2.websocket);

                    return setTimeout(function () {
                        websocket.send(msg);
                    }, _this2.config.websocketRetryDelay * 1000);
                }
                var msgStr = JSON.stringify(Object.assign({ channel: _this2.channel }, msg));
                log("send to websocket is " + msgStr);
                websocket.push(msgStr);
            };
            websocket.onmessage = function (e) {
                log('websocket on msg: ' + e.data);
                var msg = JSON.parse(e.data);
                var action = msg.action;
                switch (action) {
                    case 'signal':
                        log('start _handleSignal');
                        _this2._handleSignal(msg.from_peer_id, msg.data);
                        break;
                    case 'connect':
                        log('start _handleConnect');
                        _this2._handleConnect(msg.to_peer_id, msg.initiator);
                        break;
                    case 'disconnect':

                        break;
                    case 'accept':
                        _this2.peerId = msg.peer_id; //获取本端Id
                        break;
                    case 'reject':
                        _this2.connected = false; //如果拒绝进入频道则不允许发消息
                        break;
                    default:
                        log('websocket unknown action ' + action);

                }
            };
            websocket.onerror = websocket.onclose = function () {
                //websocket断开时清除datachannel
                _this2.scheduler.clearAllStreamers();
            };
        }
    }, {
        key: '_handleSignal',
        value: function _handleSignal(remotePeerId, data) {
            var datachannel = this.DCMap.get(remotePeerId);
            if (datachannel) {
                datachannel.receiveSignal(data);
            } else {
                log('can not find datachannel remotePeerId ' + remotePeerId);
            }
        }
    }, {
        key: '_handleConnect',
        value: function _handleConnect(remotePeerId, isInitiator) {
            var datachannel = new _dataChannel2.default(this.peerId, remotePeerId, isInitiator, this.config);
            this.DCMap.set(remotePeerId, datachannel); //将对等端Id作为键
            this._setupDC(datachannel);
        }
    }, {
        key: '_setupDC',
        value: function _setupDC(datachannel) {
            var _this3 = this;

            datachannel.on('signal', function (data) {
                var msg = {
                    action: 'signal',
                    peer_id: _this3.peerId,
                    to_peer_id: datachannel.remotePeerId,
                    data: data
                };
                _this3.websocket.send(msg);
            }).once('error', function () {
                var msg = {
                    action: 'dc_failed',
                    dc_id: datachannel.channelId
                };
                _this3.websocket.send(msg);
                log('datachannel error ' + datachannel.channelId);
                _this3.scheduler.deleteDataChannel(datachannel);
                datachannel.destroy();
            }).once(_events4.default.DC_CLOSE, function () {

                log('datachannel closed ' + datachannel.channelId + ' ');
                var msg = {
                    action: 'dc_closed',
                    dc_id: datachannel.channelId
                };
                _this3.websocket.send(msg);
                _this3.scheduler.deleteDataChannel(datachannel);
                datachannel.destroy();
            }).once(_events4.default.DC_OPEN, function () {

                _this3.scheduler.addDataChannel(datachannel);
                if (datachannel.isReceiver) {
                    //子节点发送已连接消息
                    var msg = {
                        action: 'dc_opened',
                        dc_id: datachannel.channelId
                    };
                    _this3.websocket.send(msg);
                }
            });
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.websocket.close();
            this.websocket = null;
        }
    }]);

    return P2PSignaler;
}(_events2.default);

exports.default = P2PSignaler;
module.exports = exports['default'];

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = __webpack_require__(2);

var _debug2 = _interopRequireDefault(_debug);

var _simplePeer = __webpack_require__(13);

var _simplePeer2 = _interopRequireDefault(_simplePeer);

var _events = __webpack_require__(0);

var _events2 = _interopRequireDefault(_events);

var _events3 = __webpack_require__(6);

var _events4 = _interopRequireDefault(_events3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by xieting on 2018/1/4.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Buffer = __webpack_require__(7).Buffer;

var log = (0, _debug2.default)('data-channel');

var DataChannel = function (_EventEmitter) {
    _inherits(DataChannel, _EventEmitter);

    function DataChannel(peerId, remotePeerId, isInitiator, config) {
        _classCallCheck(this, DataChannel);

        var _this = _possibleConstructorReturn(this, (DataChannel.__proto__ || Object.getPrototypeOf(DataChannel)).call(this));

        _this.config = config;
        _this.remotePeerId = remotePeerId;
        _this.channelId = peerId + remotePeerId; //标识该channel

        _this.connected = false;

        //下载控制
        _this.queue = []; //下载队列
        _this.loading = false;

        _this._datachannel = new _simplePeer2.default({ initiator: isInitiator, objectMode: true });
        _this.isReceiver = isInitiator; //主动发起连接的为数据接受者，用于标识本节点的类型
        _this._init(_this._datachannel);
        return _this;
    }

    _createClass(DataChannel, [{
        key: '_init',
        value: function _init(datachannel) {
            var _this2 = this;

            datachannel.on('error', function (err) {
                log('datachannel error', err);
                _this2.emit(_events4.default.DC_ERROR);
            });

            datachannel.on('signal', function (data) {
                // log('SIGNAL', JSON.stringify(data));
                _this2.emit(_events4.default.DC_SIGNAL, data);
            });

            datachannel.once('connect', function () {
                log('datachannel CONNECTED to ' + _this2.remotePeerId);
                _this2.emit(_events4.default.DC_OPEN);
                // if (this.isReceiver) {
                //     this.keepAliveInterval = window.setInterval(() => {                      //数据接收者每隔一段时间发送keep-alive信息
                //         let msg = {
                //             event: 'KEEPALIVE'
                //         };
                //         datachannel.send(JSON.stringify(msg));
                //         // this.keepAliveAckTimeout = window.setTimeout(this._handleKeepAliveAckTimeout.bind(this),
                //         //     config.dcKeepAliveAckTimeout*1000);
                //     }, config.dcKeepAliveInterval*1000);
                // }
            });

            datachannel.on('data', function (data) {
                if (typeof data === 'string') {
                    log('datachannel receive string: ' + data);

                    var msg = JSON.parse(data);
                    var event = msg.event;
                    switch (event) {
                        // case 'KEEPALIVE':
                        //     this._handleKeepAlive(msg);
                        //     break;
                        // case 'KEEPALIVE-ACK':
                        //     this._handleKeepAliveAck(msg);
                        //     break;
                        case 'BINARY':
                            _this2.emit(_events4.default.DC_BINARY);
                            _this2._prepareForBinary(msg.attachments, msg.url, msg.sn, msg.size);
                            break;
                        case 'REQUEST':
                            _this2.emit(_events4.default.DC_REQUEST, msg);
                            break;
                        case 'LACK':
                            _this2.loading = false;
                            _this2.emit(_events4.default.DC_REQUESTFAIL, msg);
                            break;
                        case 'CLOSE':
                            _this2.emit(_events4.default.DC_CLOSE);
                            break;
                        default:

                    }
                } else if (data instanceof Buffer) {
                    //binary data
                    // log(`datachannel receive binary data size ${data.byteLength}`);
                    _this2.bufArr.push(data);
                    _this2.remainAttachments--;
                    if (_this2.remainAttachments === 0) {
                        _this2._handleBanaryData();
                    }
                }
            });

            datachannel.once('close', function () {
                _this2.emit(_events4.default.DC_CLOSE);
            });
        }
    }, {
        key: 'send',
        value: function send(data) {
            if (this._datachannel && this._datachannel.connected) {
                this._datachannel.send(data);
            }
        }
    }, {
        key: 'request',
        value: function request(data) {
            //由于需要阻塞下载数据，因此request请求用新的API
            if (this._datachannel && this._datachannel.connected) {
                if (this.loading) {
                    this.queue.push(data);
                } else {
                    this._datachannel.send(data);
                    this.loading = true;
                }
            }
        }
    }, {
        key: 'receiveSignal',
        value: function receiveSignal(data) {
            log('datachannel receive siganl ' + JSON.stringify(data));
            this._datachannel.signal(data);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            // window.clearInterval(this.keepAliveInterval);
            // this.keepAliveInterval = null;
            // window.clearTimeout(this.keepAliveAckTimeout);
            // this.keepAliveAckTimeout = null;
            this._datachannel.removeAllListeners();
            this.removeAllListeners();
            this._datachannel.destroy();
        }
    }, {
        key: 'clearQueue',
        value: function clearQueue() {
            if (this.queue.length > 0) {
                this.queue = [];
            }
        }
    }, {
        key: '_prepareForBinary',
        value: function _prepareForBinary(attachments, url, sn, expectedSize) {
            this.bufArr = [];
            this.remainAttachments = attachments;
            this.bufUrl = url;
            this.bufSN = sn;
            this.expectedSize = expectedSize;
        }
    }, {
        key: '_handleBanaryData',
        value: function _handleBanaryData() {
            log('datachannel _handleBanaryData');
            var payload = Buffer.concat(this.bufArr);
            if (payload.byteLength == this.expectedSize) {
                //校验数据
                this.emit(_events4.default.DC_RESPONSE, { url: this.bufUrl, sn: this.bufSN, data: payload });
            }
            this.bufUrl = '';
            this.bufArr = [];
            this.expectedSize = -1;

            this.loading = false;
            if (this.queue.length > 0) {
                //如果下载队列不为空
                var data = this.queue.shift();
                this.request(data);
            }
        }

        // _handleKeepAlive() {
        //     let msg = {
        //         event: 'KEEPALIVE-ACK'
        //     };
        //     this._datachannel.send(JSON.stringify(msg));
        // }

        // _handleKeepAliveAck() {
        //     window.clearTimeout(this.keepAliveAckTimeout);
        // }

        // _handleKeepAliveAckTimeout() {
        //     log('KeepAliveAckTimeout');
        //     this.emit(Events.DC_ERROR);
        // }

    }]);

    return DataChannel;
}(_events2.default);

exports.default = DataChannel;
module.exports = exports['default'];

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = __webpack_require__(2);

var _debug2 = _interopRequireDefault(_debug);

var _events = __webpack_require__(0);

var _events2 = _interopRequireDefault(_events);

var _events3 = __webpack_require__(6);

var _events4 = _interopRequireDefault(_events3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by xieting on 2018/1/4.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var log = (0, _debug2.default)('p2p-scheduler');

var P2PScheduler = function (_EventEmitter) {
    _inherits(P2PScheduler, _EventEmitter);

    function P2PScheduler(config) {
        _classCallCheck(this, P2PScheduler);

        var _this = _possibleConstructorReturn(this, (P2PScheduler.__proto__ || Object.getPrototypeOf(P2PScheduler)).call(this));

        _this.p2pConfig = config;
        _this.upstreamers = []; //存放父节点的数组
        _this.downstreamers = []; //存放子节点的数组

        //标识当前下载
        _this.expectedSeg = null; //type {sn: number, relurl: string}
        _this.bufMgr = null;
        return _this;
    }

    _createClass(P2PScheduler, [{
        key: 'load',
        value: function load(context, config, callbacks) {

            this.target = 0; //当前下载目标父节点的索引
            this.context = context;
            var frag = context.frag;
            this.expectedSeg = { sn: frag.sn, relurl: frag.relurl };
            log('p2pLoader load ' + frag.relurl + ' at ' + frag.sn);
            // this.config = config;
            this.callbacks = callbacks;
            this.stats = { trequest: performance.now(), retry: 0, tfirst: 0, tload: 0, loaded: 0 };
            this.retryDelay = config.retryDelay;
            var timeout = Math.min(this.p2pConfig.loadTimeout, config.p2pTimeout); //p2p下载最大允许时间是一个块的时长
            // setup timeout before we perform request
            this.requestTimeout = window.setTimeout(this._loadtimeout.bind(this), timeout * 1000);
            this._loadInternal();
        }
    }, {
        key: 'abort',
        value: function abort() {
            log('p2pLoader abort');
            this.expectedSeg = null;
            //清除定时器
            this.currUpstreamer.clearQueue();
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            log('p2pLoader destroy');
        }
    }, {
        key: '_loadInternal',
        value: function _loadInternal() {

            var peer = this.upstreamers[this.target];
            this.currUpstreamer = peer; //目前用于下载的父节点

            peer.clearQueue(); //先清空下载队列


            var msg = {
                event: 'REQUEST',
                url: this.context.frag.relurl,
                sn: this.context.frag.sn
            };
            peer.request(JSON.stringify(msg));
        }
    }, {
        key: '_addUpStreamer',
        value: function _addUpStreamer(channel) {
            var _this2 = this;

            this.upstreamers.push(channel);

            this._setupChannel(channel); //设置通用监听

            channel.on(_events4.default.DC_RESPONSE, function (response) {
                //response: {url: string, sn: number, payload: Buffer}
                log('receive response sn ' + response.sn + ' url ' + response.url + ' size ' + response.data.byteLength + ' from ' + channel.remotePeerId);
                if (_this2.expectedSeg && response.url === _this2.expectedSeg.relurl && _this2.requestTimeout) {
                    window.clearTimeout(_this2.requestTimeout); //清除定时器
                    _this2.requestTimeout = null;
                    if (!_this2.stats.tload) {
                        var stats = _this2.stats;
                        stats.tload = Math.max(stats.tfirst, performance.now());
                        stats.loaded = stats.total = response.data.byteLength;
                        var onProgress = _this2.callbacks.onProgress;
                        if (onProgress) {
                            // third arg is to provide on progress data
                            onProgress(stats, _this2.context, null);
                        }
                    }
                    _this2.callbacks.onSuccess(response, _this2.stats, _this2.context);
                    //将获取成功的节点放在最前
                    var _ref = [_this2.upstreamers[_this2.target], _this2.upstreamers[0]];
                    _this2.upstreamers[0] = _ref[0];
                    _this2.upstreamers[_this2.target] = _ref[1];
                } else {
                    //不是目前request的则保存到buffer-manager
                    if (_this2.bufMgr && !_this2.bufMgr.hasSegOfURL(response.url)) {
                        _this2._addSegToBuf(response);
                    }
                }
                // log(`this.upstreamers.length ${this.upstreamers.length}`);
            }).on(_events4.default.DC_REQUESTFAIL, function () {
                //当请求的数据找不到时触发
                if (_this2.requestTimeout) {
                    //如果还没有超时
                    _this2.target++;
                    if (_this2.target < _this2.upstreamers.length) {
                        log('load one more time');
                        _this2.stats.retry++;
                        _this2._loadInternal();
                    }
                }
            }).on(_events4.default.DC_BINARY, function () {
                //接收到binary事件，用于tfirst
                if (!_this2.stats.tfirst) {
                    _this2.stats.tfirst = Math.max(performance.now(), _this2.stats.trequest);
                }
            });
        }
    }, {
        key: '_loadtimeout',
        value: function _loadtimeout() {
            log('timeout while loading ' + this.context.url);
            this.callbacks.onTimeout(this.stats, this.context, null);
            this.requestTimeout = null;
        }
    }, {
        key: '_addDownStreamer',
        value: function _addDownStreamer(channel) {
            var _this3 = this;

            this.downstreamers.push(channel);

            this._setupChannel(channel); //设置通用监听

            channel.on(_events4.default.DC_REQUEST, function (msg) {
                var sn = msg.sn,
                    url = msg.url;

                log('receive request sn ' + sn + ' url ' + url);
                if (_this3.bufMgr) {
                    var seg = void 0;
                    if (_this3.bufMgr.hasSegOfURL(url)) {
                        //首先根据url精确查找
                        seg = _this3.bufMgr.getSegByURL(url);
                    }
                    if (seg) {
                        log('bufMgr found seg sn ' + sn + ' url ' + seg.relurl);
                        var payload = seg.data,
                            //二进制数据
                        dataSize = seg.size,
                            //二进制数据大小
                        packetSize = _this3.p2pConfig.packetSize,
                            //每个数据包的大小
                        remainder = 0,
                            //最后一个包的大小
                        attachments = 0; //分多少个包发
                        if (dataSize % packetSize === 0) {
                            attachments = dataSize / packetSize;
                        } else {
                            attachments = Math.floor(dataSize / packetSize) + 1;
                            remainder = dataSize % packetSize;
                        }
                        var response = {
                            event: 'BINARY',
                            attachments: attachments,
                            url: seg.relurl,
                            sn: seg.sn,
                            size: payload.byteLength
                        };
                        channel.send(JSON.stringify(response));
                        var bufArr = _this3._dividePayload(payload, packetSize, attachments, remainder);
                        for (var j = 0; j < bufArr.length; j++) {
                            channel.send(bufArr[j]);
                        }
                        log('datachannel send binary data total size ' + payload.byteLength);
                    } else {
                        //缓存找不到请求的数据
                        var _response = {
                            event: 'LACK',
                            url: url,
                            sn: sn
                        };
                        channel.send(JSON.stringify(_response));
                    }
                }
            });
        }
    }, {
        key: '_dividePayload',
        value: function _dividePayload(payload, packetSize, attachments, remainder) {
            var bufArr = [];
            if (remainder) {
                var packet = void 0;
                for (var i = 0; i < attachments - 1; i++) {
                    packet = payload.slice(i * packetSize, (i + 1) * packetSize);
                    bufArr.push(packet);
                }
                packet = payload.slice(payload.byteLength - remainder, payload.byteLength);
                bufArr.push(packet);
            } else {
                var _packet = void 0;
                for (var _i = 0; _i < attachments; _i++) {
                    _packet = payload.slice(_i * packetSize, (_i + 1) * packetSize);
                    bufArr.push(_packet);
                }
            }
            return bufArr;
        }
    }, {
        key: 'addDataChannel',
        value: function addDataChannel(channel) {
            if (channel.isReceiver) {
                //分别存放父节点和子节点
                this._addUpStreamer(channel);
            } else {
                this._addDownStreamer(channel);
            }
        }
    }, {
        key: 'deleteDataChannel',
        value: function deleteDataChannel(channel) {
            log('delete datachannel ' + channel.channelId);
            for (var i = 0; i < this.downstreamers.length; ++i) {
                if (this.downstreamers[i] === channel) {
                    this.downstreamers.splice(i, 1);
                    return;
                }
            }
            for (var _i2 = 0; _i2 < this.upstreamers.length; ++_i2) {
                if (this.upstreamers[_i2] === channel) {
                    this.upstreamers.splice(_i2, 1);
                    return;
                }
            }
        }
    }, {
        key: 'clearUpstreamers',
        value: function clearUpstreamers() {
            for (var i = 0; i < this.upstreamers.length; ++i) {
                var streamer = this.upstreamers.pop();
                var msg = {
                    event: 'CLOSE'
                };
                streamer.send(JSON.stringify(msg));
                streamer.destroy();
            }
        }
    }, {
        key: 'clearDownstreamers',
        value: function clearDownstreamers() {
            for (var i = 0; i < this.downstreamers.length; ++i) {
                var streamer = this.downstreamers.pop();
                var msg = {
                    event: 'CLOSE'
                };
                streamer.send(JSON.stringify(msg));
                streamer.destroy();
            }
        }
    }, {
        key: 'clearAllStreamers',
        value: function clearAllStreamers() {
            this.clearUpstreamers();
            this.clearDownstreamers();
        }
    }, {
        key: '_setupChannel',
        value: function _setupChannel(channel) {

            // channel.once('close', () => {
            //
            //     log(`datachannel closed ${channel.channelId} `);
            //     // this.emit(Events.SIG_DCCLOSED, datachannel);
            //     this.deleteDataChannel(channel);
            //     channel.destroy();
            // })
        }
    }, {
        key: '_addSegToBuf',
        value: function _addSegToBuf(response) {
            log('_addSegToBuf sn ' + response.sn + ' relurl ' + response.relurl);
            var segment = {
                sn: response.sn,
                relurl: response.relurl,
                data: response.data,
                size: response.data.byteLength
            };
            this.bufMgr.addSeg(segment);
        }
    }, {
        key: 'hasUpstreamer',
        get: function get() {
            return this.upstreamers.length > 0;
        }
    }, {
        key: 'hasDownstreamer',
        get: function get() {
            return this.downstreamers.length > 0;
        }
    }]);

    return P2PScheduler;
}(_events2.default);

exports.default = P2PScheduler;
module.exports = exports['default'];

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = __webpack_require__(2);

var _debug2 = _interopRequireDefault(_debug);

var _events = __webpack_require__(0);

var _events2 = _interopRequireDefault(_events);

var _xhrLoader = __webpack_require__(42);

var _xhrLoader2 = _interopRequireDefault(_xhrLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by xieting on 2018/1/5.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

// import Events from './events';


// import Buffer from 'buffer';
var Buffer = __webpack_require__(7).Buffer;

var log = (0, _debug2.default)('hybrid-loader');

var LoaderScheduler = function (_EventEmitter) {
    _inherits(LoaderScheduler, _EventEmitter);

    function LoaderScheduler(config) {
        _classCallCheck(this, LoaderScheduler);

        //denoted by sn
        var _this = _possibleConstructorReturn(this, (LoaderScheduler.__proto__ || Object.getPrototypeOf(LoaderScheduler)).call(this));

        _this.currLoaded = config.currLoaded;
        _this.currLoadedDuration = config.currLoadedDuration; //最新下载的块的时长
        _this.currPlay = config.currPlay;

        _this.bufMgr = config.bufMgr;
        _this.xhrLoader = new _xhrLoader2.default(config);
        _this.p2pLoader = config.p2pLoader;
        _this.p2pEnabled = config.p2pEnabled;

        _this.loader = _this.xhrLoader; //loader是当前用来下载的loader
        return _this;
    }

    _createClass(LoaderScheduler, [{
        key: 'destroy',
        value: function destroy() {
            this.abort();
            this.loader = null;
        }
    }, {
        key: 'abort',
        value: function abort() {
            this.loader.abort();
        }

        /*
          首先从缓存中寻找请求的seg，如果缓存中找不到则在urgent情况下用http请求，非urgent情况下用p2p请求。
         */

    }, {
        key: 'load',
        value: function load(context, config, callbacks) {
            var _this2 = this;

            var frag = context.frag;
            this.loadByP2P = frag.sn - this.currPlay > 1 && frag.sn - this.currLoaded == 1 && this.currLoaded - this.currPlay > 1 && this.p2pLoader.hasUpstreamer;
            log('loading ' + frag.sn + ' loaded ' + this.currLoaded + ' play ' + this.currPlay + ' loaded by ' + (this.loadByP2P ? 'P2P' : 'HTTP'));

            if (this.p2pEnabled && this.loadByP2P) {
                //如果非urgent且有父节点则用p2p下载
                config.p2pTimeout = this.currLoadedDuration; //本次p2p下载允许最大超时时间
                this.loader = this.p2pLoader;
            } else {
                log('xhrLoader load ' + frag.relurl + ' at ' + frag.sn);
                this.loader = this.xhrLoader;
                context.frag.loadByXhr = true;
            }

            var onSuccess = callbacks.onSuccess;
            callbacks.onSuccess = function (response, stats, context) {
                if (_this2.bufMgr && !_this2.bufMgr.hasSegOfURL(frag.relurl)) {
                    _this2._copyFrag(response.data, frag.relurl, frag.sn);
                }
                onSuccess(response, stats, context);
            };
            var onTimeout = callbacks.onTimeout;
            callbacks.onTimeout = function (stats, context) {
                if (context.frag.loadByXhr && _this2.p2pLoader.hasUpstreamer && _this2.p2pEnabled) {
                    //如果用xhrloader请求超时，则改成p2p下载
                    log('last loaded by xhr');
                    context.frag.loadByXhr = false;
                    _this2.p2pLoader.load(context, config, callbacks);
                } else {
                    onTimeout(stats, context, null);
                }
            };
            this.loader.load(context, config, callbacks);
        }
    }, {
        key: '_copyFrag',
        value: function _copyFrag(data, url, sn) {
            var payloadBuf = Buffer.from(data);
            var byteLength = payloadBuf.byteLength;
            var targetBuffer = new Buffer(byteLength);
            payloadBuf.copy(targetBuffer);

            var segment = {
                sn: sn,
                relurl: url,
                data: targetBuffer,
                size: byteLength
            };

            this.bufMgr.addSeg(segment);
            // this.emit(Events.SEGMENT, segment);
        }
    }]);

    return LoaderScheduler;
}(_events2.default);

exports.default = LoaderScheduler;
module.exports = exports['default'];

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * XHR based logger
 */

var XhrLoader = function () {
    function XhrLoader(config) {
        _classCallCheck(this, XhrLoader);

        if (config && config.xhrSetup) {
            this.xhrSetup = config.xhrSetup;
        }
    }

    _createClass(XhrLoader, [{
        key: 'destroy',
        value: function destroy() {
            this.abort();
            this.loader = null;
        }
    }, {
        key: 'abort',
        value: function abort() {
            var loader = this.loader;
            if (loader && loader.readyState !== 4) {
                this.stats.aborted = true;
                loader.abort();
            }

            window.clearTimeout(this.requestTimeout);
            this.requestTimeout = null;
            window.clearTimeout(this.retryTimeout);
            this.retryTimeout = null;
        }
    }, {
        key: 'load',
        value: function load(context, config, callbacks) {
            this.context = context;
            this.config = config;
            this.callbacks = callbacks;
            this.stats = { trequest: performance.now(), retry: 0 };
            this.retryDelay = config.retryDelay;
            this.loadInternal();
        }
    }, {
        key: 'loadInternal',
        value: function loadInternal() {
            var xhr,
                context = this.context;
            xhr = this.loader = new XMLHttpRequest();

            var stats = this.stats;
            stats.tfirst = 0;
            stats.loaded = 0;
            var xhrSetup = this.xhrSetup;

            try {
                if (xhrSetup) {
                    try {
                        xhrSetup(xhr, context.url);
                    } catch (e) {
                        // fix xhrSetup: (xhr, url) => {xhr.setRequestHeader("Content-Language", "test");}
                        // not working, as xhr.setRequestHeader expects xhr.readyState === OPEN
                        xhr.open('GET', context.url, true);
                        xhrSetup(xhr, context.url);
                    }
                }
                if (!xhr.readyState) {
                    xhr.open('GET', context.url, true);
                }
            } catch (e) {
                // IE11 throws an exception on xhr.open if attempting to access an HTTP resource over HTTPS
                this.callbacks.onError({ code: xhr.status, text: e.message }, context, xhr);
                return;
            }

            if (context.rangeEnd) {
                xhr.setRequestHeader('Range', 'bytes=' + context.rangeStart + '-' + (context.rangeEnd - 1));
            }
            xhr.onreadystatechange = this.readystatechange.bind(this);
            xhr.onprogress = this.loadprogress.bind(this);
            xhr.responseType = context.responseType;

            // setup timeout before we perform request
            this.requestTimeout = window.setTimeout(this.loadtimeout.bind(this), this.config.timeout);
            xhr.send();
        }
    }, {
        key: 'readystatechange',
        value: function readystatechange(event) {
            var xhr = event.currentTarget,
                readyState = xhr.readyState,
                stats = this.stats,
                context = this.context,
                config = this.config;

            // don't proceed if xhr has been aborted
            if (stats.aborted) {
                return;
            }

            // >= HEADERS_RECEIVED
            if (readyState >= 2) {
                // clear xhr timeout and rearm it if readyState less than 4
                window.clearTimeout(this.requestTimeout);
                if (stats.tfirst === 0) {
                    stats.tfirst = Math.max(performance.now(), stats.trequest);
                }
                if (readyState === 4) {
                    var status = xhr.status;
                    // http status between 200 to 299 are all successful
                    if (status >= 200 && status < 300) {
                        stats.tload = Math.max(stats.tfirst, performance.now());
                        var data = void 0,
                            len = void 0;
                        if (context.responseType === 'arraybuffer') {
                            data = xhr.response;
                            len = data.byteLength;
                        } else {
                            data = xhr.responseText;
                            len = data.length;
                        }
                        stats.loaded = stats.total = len;
                        var response = { url: xhr.responseURL, data: data };
                        this.callbacks.onSuccess(response, stats, context, xhr);
                    } else {
                        // if max nb of retries reached or if http status between 400 and 499 (such error cannot be recovered, retrying is useless), return error
                        if (stats.retry >= config.maxRetry || status >= 400 && status < 499) {
                            // logger.error(`${status} while loading ${context.url}` );
                            this.callbacks.onError({ code: status, text: xhr.statusText }, context, xhr);
                        } else {
                            // retry
                            // logger.warn(`${status} while loading ${context.url}, retrying in ${this.retryDelay}...`);
                            // aborts and resets internal state
                            this.destroy();
                            // schedule retry
                            this.retryTimeout = window.setTimeout(this.loadInternal.bind(this), this.retryDelay);
                            // set exponential backoff
                            this.retryDelay = Math.min(2 * this.retryDelay, config.maxRetryDelay);
                            stats.retry++;
                        }
                    }
                } else {
                    // readyState >= 2 AND readyState !==4 (readyState = HEADERS_RECEIVED || LOADING) rearm timeout as xhr not finished yet
                    this.requestTimeout = window.setTimeout(this.loadtimeout.bind(this), config.timeout);
                }
            }
        }
    }, {
        key: 'loadtimeout',
        value: function loadtimeout() {
            // logger.warn(`timeout while loading ${this.context.url}` );
            this.callbacks.onTimeout(this.stats, this.context, null);
        }
    }, {
        key: 'loadprogress',
        value: function loadprogress(event) {
            var xhr = event.currentTarget,
                stats = this.stats;

            stats.loaded = event.loaded;
            if (event.lengthComputable) {
                stats.total = event.total;
            }
            var onProgress = this.callbacks.onProgress;
            if (onProgress) {
                // third arg is to provide on progress data
                onProgress(stats, this.context, null, xhr);
            }
        }
    }]);

    return XhrLoader;
}();

exports.default = XhrLoader;
module.exports = exports['default'];

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(0);

var _events2 = _interopRequireDefault(_events);

var _debug = __webpack_require__(2);

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by xieting on 2018/1/9.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var log = (0, _debug2.default)('buffer-manager');

var BufferManager = function (_EventEmitter) {
    _inherits(BufferManager, _EventEmitter);

    function BufferManager(config) {
        _classCallCheck(this, BufferManager);

        var _this = _possibleConstructorReturn(this, (BufferManager.__proto__ || Object.getPrototypeOf(BufferManager)).call(this));

        _this.config = config;
        /* segment
        sn: number
        relurl: string
        data: Buffer
        size: number
         */
        _this._segArray = []; //最新的数据加在最左端
        _this._currBufSize = 0; //目前的buffer总大小
        _this.urlSet = new Set(); //用于按url查找
        return _this;
    }

    _createClass(BufferManager, [{
        key: 'hasSegOfURL',
        value: function hasSegOfURL(url) {
            //防止重复加入seg
            return this.urlSet.has(url);
        }
    }, {
        key: 'addSeg',
        value: function addSeg(seg) {
            log('add seg ' + seg.sn + ' url ' + seg.relurl + ' size ' + seg.data.byteLength);
            this._segArray.unshift(seg);
            this.urlSet.add(seg.relurl);
            this._currBufSize += seg.size;
            while (this._currBufSize > this.config.maxBufSize) {
                //去掉多余的数据
                var lastSeg = this._segArray.pop();
                this.urlSet.delete(lastSeg.relurl);
                this._currBufSize -= lastSeg.size;
            }
        }
    }, {
        key: 'getSegByURL',
        value: function getSegByURL(relurl) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._segArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var seg = _step.value;

                    if (seg.relurl === relurl) {
                        return seg;
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

            return null;
        }
    }, {
        key: 'getSegBySN',
        value: function getSegBySN(sn) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this._segArray[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var seg = _step2.value;

                    if (seg.sn === sn) {
                        return seg;
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

            return null;
        }
    }, {
        key: 'clear',
        value: function clear() {
            this._segArray = [];
            this._currBufSize = 0;
            this.urlSet.clear();
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
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
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


    var LIBVERSION = '0.7.17',
        EMPTY = '',
        UNKNOWN = '?',
        FUNC_TYPE = 'function',
        UNDEF_TYPE = 'undefined',
        OBJ_TYPE = 'object',
        STR_TYPE = 'string',
        MAJOR = 'major',
        // deprecated
    MODEL = 'model',
        NAME = 'name',
        TYPE = 'type',
        VENDOR = 'vendor',
        VERSION = 'version',
        ARCHITECTURE = 'architecture',
        CONSOLE = 'console',
        MOBILE = 'mobile',
        TABLET = 'tablet',
        SMARTTV = 'smarttv',
        WEARABLE = 'wearable',
        EMBEDDED = 'embedded';

    ///////////
    // Helper
    //////////


    var util = {
        extend: function extend(regexes, extensions) {
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
        has: function has(str1, str2) {
            if (typeof str1 === "string") {
                return str2.toLowerCase().indexOf(str1.toLowerCase()) !== -1;
            } else {
                return false;
            }
        },
        lowerize: function lowerize(str) {
            return str.toLowerCase();
        },
        major: function major(version) {
            return (typeof version === 'undefined' ? 'undefined' : _typeof(version)) === STR_TYPE ? version.replace(/[^\d\.]/g, '').split(".")[0] : undefined;
        },
        trim: function trim(str) {
            return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        }
    };

    ///////////////
    // Map helper
    //////////////


    var mapper = {

        rgx: function rgx(ua, arrays) {

            //var result = {},
            var i = 0,
                j,
                k,
                p,
                q,
                matches,
                match; //, args = arguments;

            /*// construct object barebones
            for (p = 0; p < args[1].length; p++) {
                q = args[1][p];
                result[typeof q === OBJ_TYPE ? q[0] : q] = undefined;
            }*/

            // loop through all regexes maps
            while (i < arrays.length && !matches) {

                var regex = arrays[i],
                    // even sequence (0,2,4,..)
                props = arrays[i + 1]; // odd sequence (1,3,5,..)
                j = k = 0;

                // try matching uastring with regexes
                while (j < regex.length && !matches) {

                    matches = regex[j++].exec(ua);

                    if (!!matches) {
                        for (p = 0; p < props.length; p++) {
                            match = matches[++k];
                            q = props[p];
                            // check if given property is actually array
                            if ((typeof q === 'undefined' ? 'undefined' : _typeof(q)) === OBJ_TYPE && q.length > 0) {
                                if (q.length == 2) {
                                    if (_typeof(q[1]) == FUNC_TYPE) {
                                        // assign modified match
                                        this[q[0]] = q[1].call(this, match);
                                    } else {
                                        // assign given value, ignore regex match
                                        this[q[0]] = q[1];
                                    }
                                } else if (q.length == 3) {
                                    // check whether function or regex
                                    if (_typeof(q[1]) === FUNC_TYPE && !(q[1].exec && q[1].test)) {
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

        str: function str(_str, map) {

            for (var i in map) {
                // check if array
                if (_typeof(map[i]) === OBJ_TYPE && map[i].length > 0) {
                    for (var j = 0; j < map[i].length; j++) {
                        if (util.has(map[i][j], _str)) {
                            return i === UNKNOWN ? undefined : i;
                        }
                    }
                } else if (util.has(map[i], _str)) {
                    return i === UNKNOWN ? undefined : i;
                }
            }
            return _str;
        }
    };

    ///////////////
    // String map
    //////////////


    var maps = {

        browser: {
            oldsafari: {
                version: {
                    '1.0': '/8',
                    '1.2': '/1',
                    '1.3': '/3',
                    '2.0': '/412',
                    '2.0.2': '/416',
                    '2.0.3': '/417',
                    '2.0.4': '/419',
                    '?': '/'
                }
            }
        },

        device: {
            amazon: {
                model: {
                    'Fire Phone': ['SD', 'KF']
                }
            },
            sprint: {
                model: {
                    'Evo Shift 4G': '7373KT'
                },
                vendor: {
                    'HTC': 'APA',
                    'Sprint': 'Sprint'
                }
            }
        },

        os: {
            windows: {
                version: {
                    'ME': '4.90',
                    'NT 3.11': 'NT3.51',
                    'NT 4.0': 'NT4.0',
                    '2000': 'NT 5.0',
                    'XP': ['NT 5.1', 'NT 5.2'],
                    'Vista': 'NT 6.0',
                    '7': 'NT 6.1',
                    '8': 'NT 6.2',
                    '8.1': 'NT 6.3',
                    '10': ['NT 6.4', 'NT 10.0'],
                    'RT': 'ARM'
                }
            }
        }
    };

    //////////////
    // Regex map
    /////////////


    var regexes = {

        browser: [[

        // Presto based
        /(opera\smini)\/([\w\.-]+)/i, // Opera Mini
        /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i, // Opera Mobi/Tablet
        /(opera).+version\/([\w\.]+)/i, // Opera > 9.80
        /(opera)[\/\s]+([\w\.]+)/i // Opera < 9.80
        ], [NAME, VERSION], [/(opios)[\/\s]+([\w\.]+)/i // Opera mini on iphone >= 8.0
        ], [[NAME, 'Opera Mini'], VERSION], [/\s(opr)\/([\w\.]+)/i // Opera Webkit
        ], [[NAME, 'Opera'], VERSION], [

        // Mixed
        /(kindle)\/([\w\.]+)/i, // Kindle
        /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i,
        // Lunascape/Maxthon/Netfront/Jasmine/Blazer

        // Trident based
        /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,
        // Avant/IEMobile/SlimBrowser/Baidu
        /(?:ms|\()(ie)\s([\w\.]+)/i, // Internet Explorer

        // Webkit/KHTML based
        /(rekonq)\/([\w\.]+)*/i, // Rekonq
        /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser)\/([\w\.-]+)/i
        // Chromium/Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser
        ], [NAME, VERSION], [/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i // IE11
        ], [[NAME, 'IE'], VERSION], [/(edge)\/((\d+)?[\w\.]+)/i // Microsoft Edge
        ], [NAME, VERSION], [/(yabrowser)\/([\w\.]+)/i // Yandex
        ], [[NAME, 'Yandex'], VERSION], [/(puffin)\/([\w\.]+)/i // Puffin
        ], [[NAME, 'Puffin'], VERSION], [/((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i
        // UCBrowser
        ], [[NAME, 'UCBrowser'], VERSION], [/(comodo_dragon)\/([\w\.]+)/i // Comodo Dragon
        ], [[NAME, /_/g, ' '], VERSION], [/(micromessenger)\/([\w\.]+)/i // WeChat
        ], [[NAME, 'WeChat'], VERSION], [/(QQ)\/([\d\.]+)/i // QQ, aka ShouQ
        ], [NAME, VERSION], [/m?(qqbrowser)[\/\s]?([\w\.]+)/i // QQBrowser
        ], [NAME, VERSION], [/xiaomi\/miuibrowser\/([\w\.]+)/i // MIUI Browser
        ], [VERSION, [NAME, 'MIUI Browser']], [/;fbav\/([\w\.]+);/i // Facebook App for iOS & Android
        ], [VERSION, [NAME, 'Facebook']], [/headlesschrome(?:\/([\w\.]+)|\s)/i // Chrome Headless
        ], [VERSION, [NAME, 'Chrome Headless']], [/\swv\).+(chrome)\/([\w\.]+)/i // Chrome WebView
        ], [[NAME, /(.+)/, '$1 WebView'], VERSION], [/((?:oculus|samsung)browser)\/([\w\.]+)/i], [[NAME, /(.+(?:g|us))(.+)/, '$1 $2'], VERSION], [// Oculus / Samsung Browser

        /android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i // Android Browser
        ], [VERSION, [NAME, 'Android Browser']], [/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i
        // Chrome/OmniWeb/Arora/Tizen/Nokia
        ], [NAME, VERSION], [/(dolfin)\/([\w\.]+)/i // Dolphin
        ], [[NAME, 'Dolphin'], VERSION], [/((?:android.+)crmo|crios)\/([\w\.]+)/i // Chrome for Android/iOS
        ], [[NAME, 'Chrome'], VERSION], [/(coast)\/([\w\.]+)/i // Opera Coast
        ], [[NAME, 'Opera Coast'], VERSION], [/fxios\/([\w\.-]+)/i // Firefox for iOS
        ], [VERSION, [NAME, 'Firefox']], [/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i // Mobile Safari
        ], [VERSION, [NAME, 'Mobile Safari']], [/version\/([\w\.]+).+?(mobile\s?safari|safari)/i // Safari & Safari Mobile
        ], [VERSION, NAME], [/webkit.+?(gsa)\/([\w\.]+).+?(mobile\s?safari|safari)(\/[\w\.]+)/i // Google Search Appliance on iOS
        ], [[NAME, 'GSA'], VERSION], [/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i // Safari < 3.0
        ], [NAME, [VERSION, mapper.str, maps.browser.oldsafari.version]], [/(konqueror)\/([\w\.]+)/i, // Konqueror
        /(webkit|khtml)\/([\w\.]+)/i], [NAME, VERSION], [

        // Gecko based
        /(navigator|netscape)\/([\w\.-]+)/i // Netscape
        ], [[NAME, 'Netscape'], VERSION], [/(swiftfox)/i, // Swiftfox
        /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
        // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
        /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i,
        // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
        /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i, // Mozilla

        // Other
        /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,
        // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir
        /(links)\s\(([\w\.]+)/i, // Links
        /(gobrowser)\/?([\w\.]+)*/i, // GoBrowser
        /(ice\s?browser)\/v?([\w\._]+)/i, // ICE Browser
        /(mosaic)[\/\s]([\w\.]+)/i // Mosaic
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

        cpu: [[/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i // AMD64
        ], [[ARCHITECTURE, 'amd64']], [/(ia32(?=;))/i // IA32 (quicktime)
        ], [[ARCHITECTURE, util.lowerize]], [/((?:i[346]|x)86)[;\)]/i // IA32
        ], [[ARCHITECTURE, 'ia32']], [

        // PocketPC mistakenly identified as PowerPC
        /windows\s(ce|mobile);\sppc;/i], [[ARCHITECTURE, 'arm']], [/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i // PowerPC
        ], [[ARCHITECTURE, /ower/, '', util.lowerize]], [/(sun4\w)[;\)]/i // SPARC
        ], [[ARCHITECTURE, 'sparc']], [/((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i
        // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
        ], [[ARCHITECTURE, util.lowerize]]],

        device: [[/\((ipad|playbook);[\w\s\);-]+(rim|apple)/i // iPad/PlayBook
        ], [MODEL, VENDOR, [TYPE, TABLET]], [/applecoremedia\/[\w\.]+ \((ipad)/ // iPad
        ], [MODEL, [VENDOR, 'Apple'], [TYPE, TABLET]], [/(apple\s{0,1}tv)/i // Apple TV
        ], [[MODEL, 'Apple TV'], [VENDOR, 'Apple']], [/(archos)\s(gamepad2?)/i, // Archos
        /(hp).+(touchpad)/i, // HP TouchPad
        /(hp).+(tablet)/i, // HP Tablet
        /(kindle)\/([\w\.]+)/i, // Kindle
        /\s(nook)[\w\s]+build\/(\w+)/i, // Nook
        /(dell)\s(strea[kpr\s\d]*[\dko])/i // Dell Streak
        ], [VENDOR, MODEL, [TYPE, TABLET]], [/(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i // Kindle Fire HD
        ], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [/(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i // Fire Phone
        ], [[MODEL, mapper.str, maps.device.amazon.model], [VENDOR, 'Amazon'], [TYPE, MOBILE]], [/\((ip[honed|\s\w*]+);.+(apple)/i // iPod/iPhone
        ], [MODEL, VENDOR, [TYPE, MOBILE]], [/\((ip[honed|\s\w*]+);/i // iPod/iPhone
        ], [MODEL, [VENDOR, 'Apple'], [TYPE, MOBILE]], [/(blackberry)[\s-]?(\w+)/i, // BlackBerry
        /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i,
        // BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
        /(hp)\s([\w\s]+\w)/i, // HP iPAQ
        /(asus)-?(\w+)/i // Asus
        ], [VENDOR, MODEL, [TYPE, MOBILE]], [/\(bb10;\s(\w+)/i // BlackBerry 10
        ], [MODEL, [VENDOR, 'BlackBerry'], [TYPE, MOBILE]], [
        // Asus Tablets
        /android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone)/i], [MODEL, [VENDOR, 'Asus'], [TYPE, TABLET]], [/(sony)\s(tablet\s[ps])\sbuild\//i, // Sony
        /(sony)?(?:sgp.+)\sbuild\//i], [[VENDOR, 'Sony'], [MODEL, 'Xperia Tablet'], [TYPE, TABLET]], [/android.+\s([c-g]\d{4}|so[-l]\w+)\sbuild\//i], [MODEL, [VENDOR, 'Sony'], [TYPE, MOBILE]], [/\s(ouya)\s/i, // Ouya
        /(nintendo)\s([wids3u]+)/i // Nintendo
        ], [VENDOR, MODEL, [TYPE, CONSOLE]], [/android.+;\s(shield)\sbuild/i // Nvidia
        ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, CONSOLE]], [/(playstation\s[34portablevi]+)/i // Playstation
        ], [MODEL, [VENDOR, 'Sony'], [TYPE, CONSOLE]], [/(sprint\s(\w+))/i // Sprint Phones
        ], [[VENDOR, mapper.str, maps.device.sprint.vendor], [MODEL, mapper.str, maps.device.sprint.model], [TYPE, MOBILE]], [/(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i // Lenovo tablets
        ], [VENDOR, MODEL, [TYPE, TABLET]], [/(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i, // HTC
        /(zte)-(\w+)*/i, // ZTE
        /(alcatel|geeksphone|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i
        // Alcatel/GeeksPhone/Lenovo/Nexian/Panasonic/Sony
        ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [/(nexus\s9)/i // HTC Nexus 9
        ], [MODEL, [VENDOR, 'HTC'], [TYPE, TABLET]], [/d\/huawei([\w\s-]+)[;\)]/i, /(nexus\s6p)/i // Huawei
        ], [MODEL, [VENDOR, 'Huawei'], [TYPE, MOBILE]], [/(microsoft);\s(lumia[\s\w]+)/i // Microsoft Lumia
        ], [VENDOR, MODEL, [TYPE, MOBILE]], [/[\s\(;](xbox(?:\sone)?)[\s\);]/i // Microsoft Xbox
        ], [MODEL, [VENDOR, 'Microsoft'], [TYPE, CONSOLE]], [/(kin\.[onetw]{3})/i // Microsoft Kin
        ], [[MODEL, /\./g, ' '], [VENDOR, 'Microsoft'], [TYPE, MOBILE]], [

        // Motorola
        /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i, /mot[\s-]?(\w+)*/i, /(XT\d{3,4}) build\//i, /(nexus\s6)/i], [MODEL, [VENDOR, 'Motorola'], [TYPE, MOBILE]], [/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i], [MODEL, [VENDOR, 'Motorola'], [TYPE, TABLET]], [/hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i // HbbTV devices
        ], [[VENDOR, util.trim], [MODEL, util.trim], [TYPE, SMARTTV]], [/hbbtv.+maple;(\d+)/i], [[MODEL, /^/, 'SmartTV'], [VENDOR, 'Samsung'], [TYPE, SMARTTV]], [/\(dtv[\);].+(aquos)/i // Sharp
        ], [MODEL, [VENDOR, 'Sharp'], [TYPE, SMARTTV]], [/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i, /((SM-T\w+))/i], [[VENDOR, 'Samsung'], MODEL, [TYPE, TABLET]], [// Samsung
        /smart-tv.+(samsung)/i], [VENDOR, [TYPE, SMARTTV], MODEL], [/((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i, /(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i, /sec-((sgh\w+))/i], [[VENDOR, 'Samsung'], MODEL, [TYPE, MOBILE]], [/sie-(\w+)*/i // Siemens
        ], [MODEL, [VENDOR, 'Siemens'], [TYPE, MOBILE]], [/(maemo|nokia).*(n900|lumia\s\d+)/i, // Nokia
        /(nokia)[\s_-]?([\w-]+)*/i], [[VENDOR, 'Nokia'], MODEL, [TYPE, MOBILE]], [/android\s3\.[\s\w;-]{10}(a\d{3})/i // Acer
        ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [/android.+([vl]k\-?\d{3})\s+build/i // LG Tablet
        ], [MODEL, [VENDOR, 'LG'], [TYPE, TABLET]], [/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i // LG Tablet
        ], [[VENDOR, 'LG'], MODEL, [TYPE, TABLET]], [/(lg) netcast\.tv/i // LG SmartTV
        ], [VENDOR, MODEL, [TYPE, SMARTTV]], [/(nexus\s[45])/i, // LG
        /lg[e;\s\/-]+(\w+)*/i, /android.+lg(\-?[\d\w]+)\s+build/i], [MODEL, [VENDOR, 'LG'], [TYPE, MOBILE]], [/android.+(ideatab[a-z0-9\-\s]+)/i // Lenovo
        ], [MODEL, [VENDOR, 'Lenovo'], [TYPE, TABLET]], [/linux;.+((jolla));/i // Jolla
        ], [VENDOR, MODEL, [TYPE, MOBILE]], [/((pebble))app\/[\d\.]+\s/i // Pebble
        ], [VENDOR, MODEL, [TYPE, WEARABLE]], [/android.+;\s(oppo)\s?([\w\s]+)\sbuild/i // OPPO
        ], [VENDOR, MODEL, [TYPE, MOBILE]], [/crkey/i // Google Chromecast
        ], [[MODEL, 'Chromecast'], [VENDOR, 'Google']], [/android.+;\s(glass)\s\d/i // Google Glass
        ], [MODEL, [VENDOR, 'Google'], [TYPE, WEARABLE]], [/android.+;\s(pixel c)\s/i // Google Pixel C
        ], [MODEL, [VENDOR, 'Google'], [TYPE, TABLET]], [/android.+;\s(pixel xl|pixel)\s/i // Google Pixel
        ], [MODEL, [VENDOR, 'Google'], [TYPE, MOBILE]], [/android.+(\w+)\s+build\/hm\1/i, // Xiaomi Hongmi 'numeric' models
        /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i, // Xiaomi Hongmi
        /android.+(mi[\s\-_]*(?:one|one[\s_]plus|note lte)?[\s_]*(?:\d\w)?)\s+build/i, // Xiaomi Mi
        /android.+(redmi[\s\-_]*(?:note)?(?:[\s_]*[\w\s]+)?)\s+build/i // Redmi Phones
        ], [[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, MOBILE]], [/android.+(mi[\s\-_]*(?:pad)?(?:[\s_]*[\w\s]+)?)\s+build/i // Mi Pad tablets
        ], [[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, TABLET]], [/android.+;\s(m[1-5]\snote)\sbuild/i // Meizu Tablet
        ], [MODEL, [VENDOR, 'Meizu'], [TYPE, TABLET]], [/android.+a000(1)\s+build/i // OnePlus
        ], [MODEL, [VENDOR, 'OnePlus'], [TYPE, MOBILE]], [/android.+[;\/]\s*(RCT[\d\w]+)\s+build/i // RCA Tablets
        ], [MODEL, [VENDOR, 'RCA'], [TYPE, TABLET]], [/android.+[;\/]\s*(Venue[\d\s]*)\s+build/i // Dell Venue Tablets
        ], [MODEL, [VENDOR, 'Dell'], [TYPE, TABLET]], [/android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i // Verizon Tablet
        ], [MODEL, [VENDOR, 'Verizon'], [TYPE, TABLET]], [/android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(V?.*)\s+build/i // Barnes & Noble Tablet
        ], [[VENDOR, 'Barnes & Noble'], MODEL, [TYPE, TABLET]], [/android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i // Barnes & Noble Tablet
        ], [MODEL, [VENDOR, 'NuVision'], [TYPE, TABLET]], [/android.+[;\/]\s*(zte)?.+(k\d{2})\s+build/i // ZTE K Series Tablet
        ], [[VENDOR, 'ZTE'], MODEL, [TYPE, TABLET]], [/android.+[;\/]\s*(gen\d{3})\s+build.*49h/i // Swiss GEN Mobile
        ], [MODEL, [VENDOR, 'Swiss'], [TYPE, MOBILE]], [/android.+[;\/]\s*(zur\d{3})\s+build/i // Swiss ZUR Tablet
        ], [MODEL, [VENDOR, 'Swiss'], [TYPE, TABLET]], [/android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i // Zeki Tablets
        ], [MODEL, [VENDOR, 'Zeki'], [TYPE, TABLET]], [/(android).+[;\/]\s+([YR]\d{2}x?.*)\s+build/i, /android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(.+)\s+build/i // Dragon Touch Tablet
        ], [[VENDOR, 'Dragon Touch'], MODEL, [TYPE, TABLET]], [/android.+[;\/]\s*(NS-?.+)\s+build/i // Insignia Tablets
        ], [MODEL, [VENDOR, 'Insignia'], [TYPE, TABLET]], [/android.+[;\/]\s*((NX|Next)-?.+)\s+build/i // NextBook Tablets
        ], [MODEL, [VENDOR, 'NextBook'], [TYPE, TABLET]], [/android.+[;\/]\s*(Xtreme\_?)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i], [[VENDOR, 'Voice'], MODEL, [TYPE, MOBILE]], [// Voice Xtreme Phones

        /android.+[;\/]\s*(LVTEL\-?)?(V1[12])\s+build/i // LvTel Phones
        ], [[VENDOR, 'LvTel'], MODEL, [TYPE, MOBILE]], [/android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i // Envizen Tablets
        ], [MODEL, [VENDOR, 'Envizen'], [TYPE, TABLET]], [/android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(.*\b)\s+build/i // Le Pan Tablets
        ], [VENDOR, MODEL, [TYPE, TABLET]], [/android.+[;\/]\s*(Trio[\s\-]*.*)\s+build/i // MachSpeed Tablets
        ], [MODEL, [VENDOR, 'MachSpeed'], [TYPE, TABLET]], [/android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i // Trinity Tablets
        ], [VENDOR, MODEL, [TYPE, TABLET]], [/android.+[;\/]\s*TU_(1491)\s+build/i // Rotor Tablets
        ], [MODEL, [VENDOR, 'Rotor'], [TYPE, TABLET]], [/android.+(KS(.+))\s+build/i // Amazon Kindle Tablets
        ], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [/android.+(Gigaset)[\s\-]+(Q.+)\s+build/i // Gigaset Tablets
        ], [VENDOR, MODEL, [TYPE, TABLET]], [/\s(tablet|tab)[;\/]/i, // Unidentifiable Tablet
        /\s(mobile)(?:[;\/]|\ssafari)/i // Unidentifiable Mobile
        ], [[TYPE, util.lowerize], VENDOR, MODEL], [/(android.+)[;\/].+build/i // Generic Android Device
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

        engine: [[/windows.+\sedge\/([\w\.]+)/i // EdgeHTML
        ], [VERSION, [NAME, 'EdgeHTML']], [/(presto)\/([\w\.]+)/i, // Presto
        /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i, // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m
        /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i, // KHTML/Tasman/Links
        /(icab)[\/\s]([23]\.[\d\.]+)/i // iCab
        ], [NAME, VERSION], [/rv\:([\w\.]+).*(gecko)/i // Gecko
        ], [VERSION, NAME]],

        os: [[

        // Windows based
        /microsoft\s(windows)\s(vista|xp)/i // Windows (iTunes)
        ], [NAME, VERSION], [/(windows)\snt\s6\.2;\s(arm)/i, // Windows RT
        /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s]+\w)*/i, // Windows Phone
        /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i], [NAME, [VERSION, mapper.str, maps.os.windows.version]], [/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i], [[NAME, 'Windows'], [VERSION, mapper.str, maps.os.windows.version]], [

        // Mobile/Embedded OS
        /\((bb)(10);/i // BlackBerry 10
        ], [[NAME, 'BlackBerry'], VERSION], [/(blackberry)\w*\/?([\w\.]+)*/i, // Blackberry
        /(tizen)[\/\s]([\w\.]+)/i, // Tizen
        /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i,
        // Android/WebOS/Palm/QNX/Bada/RIM/MeeGo/Contiki
        /linux;.+(sailfish);/i // Sailfish OS
        ], [NAME, VERSION], [/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i // Symbian
        ], [[NAME, 'Symbian'], VERSION], [/\((series40);/i // Series 40
        ], [NAME], [/mozilla.+\(mobile;.+gecko.+firefox/i // Firefox OS
        ], [[NAME, 'Firefox OS'], VERSION], [

        // Console
        /(nintendo|playstation)\s([wids34portablevu]+)/i, // Nintendo/Playstation

        // GNU/Linux based
        /(mint)[\/\s\(]?(\w+)*/i, // Mint
        /(mageia|vectorlinux)[;\s]/i, // Mageia/VectorLinux
        /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]+)*/i,
        // Joli/Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware
        // Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus
        /(hurd|linux)\s?([\w\.]+)*/i, // Hurd/Linux
        /(gnu)\s?([\w\.]+)*/i // GNU
        ], [NAME, VERSION], [/(cros)\s[\w]+\s([\w\.]+\w)/i // Chromium OS
        ], [[NAME, 'Chromium OS'], VERSION], [

        // Solaris
        /(sunos)\s?([\w\.]+\d)*/i // Solaris
        ], [[NAME, 'Solaris'], VERSION], [

        // BSD based
        /\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i // FreeBSD/NetBSD/OpenBSD/PC-BSD/DragonFly
        ], [NAME, VERSION], [/(haiku)\s(\w+)/i // Haiku
        ], [NAME, VERSION], [/cfnetwork\/.+darwin/i, /ip[honead]+(?:.*os\s([\w]+)\slike\smac|;\sopera)/i // iOS
        ], [[VERSION, /_/g, '.'], [NAME, 'iOS']], [/(mac\sos\sx)\s?([\w\s\.]+\w)*/i, /(macintosh|mac(?=_powerpc)\s)/i // Mac OS
        ], [[NAME, 'Mac OS'], [VERSION, /_/g, '.']], [

        // Other
        /((?:open)?solaris)[\/\s-]?([\w\.]+)*/i, // Solaris
        /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i, // AIX
        /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i,
        // Plan9/Minix/BeOS/OS2/AmigaOS/MorphOS/RISCOS/OpenVMS
        /(unix)\s?([\w\.]+)*/i // UNIX
        ], [NAME, VERSION]]
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
    var UAParser = function UAParser(uastring, extensions) {

        if ((typeof uastring === 'undefined' ? 'undefined' : _typeof(uastring)) === 'object') {
            extensions = uastring;
            uastring = undefined;
        }

        if (!(this instanceof UAParser)) {
            return new UAParser(uastring, extensions).getResult();
        }

        var ua = uastring || (window && window.navigator && window.navigator.userAgent ? window.navigator.userAgent : EMPTY);
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
                ua: this.getUA(),
                browser: this.getBrowser(),
                engine: this.getEngine(),
                os: this.getOS(),
                device: this.getDevice(),
                cpu: this.getCPU()
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
        NAME: NAME,
        MAJOR: MAJOR, // deprecated
        VERSION: VERSION
    };
    UAParser.CPU = {
        ARCHITECTURE: ARCHITECTURE
    };
    UAParser.DEVICE = {
        MODEL: MODEL,
        VENDOR: VENDOR,
        TYPE: TYPE,
        CONSOLE: CONSOLE,
        MOBILE: MOBILE,
        SMARTTV: SMARTTV,
        TABLET: TABLET,
        WEARABLE: WEARABLE,
        EMBEDDED: EMBEDDED
    };
    UAParser.ENGINE = {
        NAME: NAME,
        VERSION: VERSION
    };
    UAParser.OS = {
        NAME: NAME,
        VERSION: VERSION
    };
    //UAParser.Utils = util;

    ///////////
    // Export
    //////////


    // check js environment
    if (( false ? 'undefined' : _typeof(exports)) !== UNDEF_TYPE) {
        // nodejs env
        if (( false ? 'undefined' : _typeof(module)) !== UNDEF_TYPE && module.exports) {
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
        if (( false ? 'undefined' : _typeof(__webpack_require__(45))) === FUNC_TYPE && __webpack_require__(46)) {
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
    if ((typeof $ === 'undefined' ? 'undefined' : _typeof($)) !== UNDEF_TYPE) {
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
})((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' ? window : undefined);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21)(module)))

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = function() {
	throw new Error("define cannot be used indirect");
};


/***/ }),
/* 46 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (t, e) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "object" == ( false ? "undefined" : _typeof(module)) ? module.exports = e() :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (e),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? exports.Hls = e() : t.Hls = e();
}(this, function () {
  return function (t) {
    function e(i) {
      if (r[i]) return r[i].exports;var a = r[i] = { i: i, l: !1, exports: {} };return t[i].call(a.exports, a, a.exports, e), a.l = !0, a.exports;
    }var r = {};return e.m = t, e.c = r, e.d = function (t, r, i) {
      e.o(t, r) || Object.defineProperty(t, r, { configurable: !1, enumerable: !0, get: i });
    }, e.n = function (t) {
      var r = t && t.__esModule ? function () {
        return t.default;
      } : function () {
        return t;
      };return e.d(r, "a", r), r;
    }, e.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }, e.p = "/dist/", e(e.s = 8);
  }([function (t, e, r) {
    "use strict";
    function i() {}function a(t, e) {
      return e = "[" + t + "] > " + e;
    }function n(t) {
      var e = self.console[t];return e ? function () {
        for (var r = arguments.length, i = Array(r), n = 0; n < r; n++) {
          i[n] = arguments[n];
        }i[0] && (i[0] = a(t, i[0])), e.apply(self.console, i);
      } : i;
    }function o(t) {
      for (var e = arguments.length, r = Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++) {
        r[i - 1] = arguments[i];
      }r.forEach(function (e) {
        u[e] = t[e] ? t[e].bind(t) : n(e);
      });
    }r.d(e, "a", function () {
      return d;
    }), r.d(e, "b", function () {
      return h;
    });var s = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
      return typeof t === "undefined" ? "undefined" : _typeof(t);
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t === "undefined" ? "undefined" : _typeof(t);
    },
        l = { trace: i, debug: i, log: i, warn: i, info: i, error: i },
        u = l,
        d = function d(t) {
      if (!0 === t || "object" === (void 0 === t ? "undefined" : s(t))) {
        o(t, "debug", "log", "info", "warn", "error");try {
          u.log();
        } catch (t) {
          u = l;
        }
      } else u = l;
    },
        h = u;
  }, function (t, e, r) {
    "use strict";
    e.a = { MEDIA_ATTACHING: "hlsMediaAttaching", MEDIA_ATTACHED: "hlsMediaAttached", MEDIA_DETACHING: "hlsMediaDetaching", MEDIA_DETACHED: "hlsMediaDetached", BUFFER_RESET: "hlsBufferReset", BUFFER_CODECS: "hlsBufferCodecs", BUFFER_CREATED: "hlsBufferCreated", BUFFER_APPENDING: "hlsBufferAppending", BUFFER_APPENDED: "hlsBufferAppended", BUFFER_EOS: "hlsBufferEos", BUFFER_FLUSHING: "hlsBufferFlushing", BUFFER_FLUSHED: "hlsBufferFlushed", MANIFEST_LOADING: "hlsManifestLoading", MANIFEST_LOADED: "hlsManifestLoaded", MANIFEST_PARSED: "hlsManifestParsed", LEVEL_SWITCH: "hlsLevelSwitch", LEVEL_SWITCHING: "hlsLevelSwitching", LEVEL_SWITCHED: "hlsLevelSwitched", LEVEL_LOADING: "hlsLevelLoading", LEVEL_LOADED: "hlsLevelLoaded", LEVEL_UPDATED: "hlsLevelUpdated", LEVEL_PTS_UPDATED: "hlsLevelPtsUpdated", AUDIO_TRACKS_UPDATED: "hlsAudioTracksUpdated", AUDIO_TRACK_SWITCH: "hlsAudioTrackSwitch", AUDIO_TRACK_SWITCHING: "hlsAudioTrackSwitching", AUDIO_TRACK_SWITCHED: "hlsAudioTrackSwitched", AUDIO_TRACK_LOADING: "hlsAudioTrackLoading", AUDIO_TRACK_LOADED: "hlsAudioTrackLoaded", SUBTITLE_TRACKS_UPDATED: "hlsSubtitleTracksUpdated", SUBTITLE_TRACK_SWITCH: "hlsSubtitleTrackSwitch", SUBTITLE_TRACK_LOADING: "hlsSubtitleTrackLoading", SUBTITLE_TRACK_LOADED: "hlsSubtitleTrackLoaded", SUBTITLE_FRAG_PROCESSED: "hlsSubtitleFragProcessed", INIT_PTS_FOUND: "hlsInitPtsFound", FRAG_LOADING: "hlsFragLoading", FRAG_LOAD_PROGRESS: "hlsFragLoadProgress", FRAG_LOAD_EMERGENCY_ABORTED: "hlsFragLoadEmergencyAborted", FRAG_LOADED: "hlsFragLoaded", FRAG_DECRYPTED: "hlsFragDecrypted", FRAG_PARSING_INIT_SEGMENT: "hlsFragParsingInitSegment", FRAG_PARSING_USERDATA: "hlsFragParsingUserdata", FRAG_PARSING_METADATA: "hlsFragParsingMetadata", FRAG_PARSING_DATA: "hlsFragParsingData", FRAG_PARSED: "hlsFragParsed", FRAG_BUFFERED: "hlsFragBuffered", FRAG_CHANGED: "hlsFragChanged", FPS_DROP: "hlsFpsDrop", FPS_DROP_LEVEL_CAPPING: "hlsFpsDropLevelCapping", ERROR: "hlsError", DESTROYING: "hlsDestroying", KEY_LOADING: "hlsKeyLoading", KEY_LOADED: "hlsKeyLoaded", STREAM_STATE_TRANSITION: "hlsStreamStateTransition" };
  }, function (t, e, r) {
    "use strict";
    r.d(e, "b", function () {
      return i;
    }), r.d(e, "a", function () {
      return a;
    });var i = { NETWORK_ERROR: "networkError", MEDIA_ERROR: "mediaError", MUX_ERROR: "muxError", OTHER_ERROR: "otherError" },
        a = { MANIFEST_LOAD_ERROR: "manifestLoadError", MANIFEST_LOAD_TIMEOUT: "manifestLoadTimeOut", MANIFEST_PARSING_ERROR: "manifestParsingError", MANIFEST_INCOMPATIBLE_CODECS_ERROR: "manifestIncompatibleCodecsError", LEVEL_LOAD_ERROR: "levelLoadError", LEVEL_LOAD_TIMEOUT: "levelLoadTimeOut", LEVEL_SWITCH_ERROR: "levelSwitchError", AUDIO_TRACK_LOAD_ERROR: "audioTrackLoadError", AUDIO_TRACK_LOAD_TIMEOUT: "audioTrackLoadTimeOut", FRAG_LOAD_ERROR: "fragLoadError", FRAG_LOOP_LOADING_ERROR: "fragLoopLoadingError", FRAG_LOAD_TIMEOUT: "fragLoadTimeOut", FRAG_DECRYPT_ERROR: "fragDecryptError", FRAG_PARSING_ERROR: "fragParsingError", REMUX_ALLOC_ERROR: "remuxAllocError", KEY_LOAD_ERROR: "keyLoadError", KEY_LOAD_TIMEOUT: "keyLoadTimeOut", BUFFER_ADD_CODEC_ERROR: "bufferAddCodecError", BUFFER_APPEND_ERROR: "bufferAppendError", BUFFER_APPENDING_ERROR: "bufferAppendingError", BUFFER_STALLED_ERROR: "bufferStalledError", BUFFER_FULL_ERROR: "bufferFullError", BUFFER_SEEK_OVER_HOLE: "bufferSeekOverHole", BUFFER_NUDGE_ON_STALL: "bufferNudgeOnStall", INTERNAL_EXCEPTION: "internalException" };
  }, function (t, e, r) {
    "use strict";
    function i(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }r.d(e, "b", function () {
      return n;
    });var a = function () {
      function t() {
        i(this, t);
      }return t.isHeader = function (t, e) {
        return e + 10 <= t.length && 73 === t[e] && 68 === t[e + 1] && 51 === t[e + 2] && t[e + 3] < 255 && t[e + 4] < 255 && t[e + 6] < 128 && t[e + 7] < 128 && t[e + 8] < 128 && t[e + 9] < 128;
      }, t.isFooter = function (t, e) {
        return e + 10 <= t.length && 51 === t[e] && 68 === t[e + 1] && 73 === t[e + 2] && t[e + 3] < 255 && t[e + 4] < 255 && t[e + 6] < 128 && t[e + 7] < 128 && t[e + 8] < 128 && t[e + 9] < 128;
      }, t.getID3Data = function (e, r) {
        for (var i = r, a = 0; t.isHeader(e, r);) {
          a += 10;a += t._readSize(e, r + 6), t.isFooter(e, r + 10) && (a += 10), r += a;
        }if (a > 0) return e.subarray(i, i + a);
      }, t._readSize = function (t, e) {
        var r = 0;return r = (127 & t[e]) << 21, r |= (127 & t[e + 1]) << 14, r |= (127 & t[e + 2]) << 7, r |= 127 & t[e + 3];
      }, t.getTimeStamp = function (e) {
        for (var r = t.getID3Frames(e), i = 0; i < r.length; i++) {
          var a = r[i];if (t.isTimeStampFrame(a)) return t._readTimeStamp(a);
        }
      }, t.isTimeStampFrame = function (t) {
        return t && "PRIV" === t.key && "com.apple.streaming.transportStreamTimestamp" === t.info;
      }, t._getFrameData = function (e) {
        var r = String.fromCharCode(e[0], e[1], e[2], e[3]),
            i = t._readSize(e, 4);return { type: r, size: i, data: e.subarray(10, 10 + i) };
      }, t.getID3Frames = function (e) {
        for (var r = 0, i = []; t.isHeader(e, r);) {
          var a = t._readSize(e, r + 6);r += 10;for (var n = r + a; r + 8 < n;) {
            var o = t._getFrameData(e.subarray(r)),
                s = t._decodeFrame(o);s && i.push(s), r += o.size + 10;
          }t.isFooter(e, r) && (r += 10);
        }return i;
      }, t._decodeFrame = function (e) {
        return "PRIV" === e.type ? t._decodePrivFrame(e) : "T" === e.type[0] ? t._decodeTextFrame(e) : "W" === e.type[0] ? t._decodeURLFrame(e) : void 0;
      }, t._readTimeStamp = function (t) {
        if (8 === t.data.byteLength) {
          var e = new Uint8Array(t.data),
              r = 1 & e[3],
              i = (e[4] << 23) + (e[5] << 15) + (e[6] << 7) + e[7];return i /= 45, r && (i += 47721858.84), Math.round(i);
        }
      }, t._decodePrivFrame = function (e) {
        if (!(e.size < 2)) {
          var r = t._utf8ArrayToStr(e.data, !0),
              i = new Uint8Array(e.data.subarray(r.length + 1));return { key: e.type, info: r, data: i.buffer };
        }
      }, t._decodeTextFrame = function (e) {
        if (!(e.size < 2)) {
          if ("TXXX" === e.type) {
            var r = 1,
                i = t._utf8ArrayToStr(e.data.subarray(r));r += i.length + 1;var a = t._utf8ArrayToStr(e.data.subarray(r));return { key: e.type, info: i, data: a };
          }var n = t._utf8ArrayToStr(e.data.subarray(1));return { key: e.type, data: n };
        }
      }, t._decodeURLFrame = function (e) {
        if ("WXXX" === e.type) {
          if (e.size < 2) return;var r = 1,
              i = t._utf8ArrayToStr(e.data.subarray(r));r += i.length + 1;var a = t._utf8ArrayToStr(e.data.subarray(r));return { key: e.type, info: i, data: a };
        }var n = t._utf8ArrayToStr(e.data);return { key: e.type, data: n };
      }, t._utf8ArrayToStr = function (t) {
        for (var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], r = t.length, i = void 0, a = void 0, n = void 0, o = "", s = 0; s < r;) {
          if (0 === (i = t[s++]) && e) return o;if (0 !== i && 3 !== i) switch (i >> 4) {case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:
              o += String.fromCharCode(i);break;case 12:case 13:
              a = t[s++], o += String.fromCharCode((31 & i) << 6 | 63 & a);break;case 14:
              a = t[s++], n = t[s++], o += String.fromCharCode((15 & i) << 12 | (63 & a) << 6 | (63 & n) << 0);}
        }return o;
      }, t;
    }(),
        n = a._utf8ArrayToStr;e.a = a;
  }, function (t, e, r) {
    "use strict";
    function i(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function a(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function n(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function o(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }var s = function () {
      function t(e, r) {
        i(this, t), this.subtle = e, this.aesIV = r;
      }return t.prototype.decrypt = function (t, e) {
        return this.subtle.decrypt({ name: "AES-CBC", iv: this.aesIV }, e, t);
      }, t;
    }(),
        l = s,
        u = function () {
      function t(e, r) {
        a(this, t), this.subtle = e, this.key = r;
      }return t.prototype.expandKey = function () {
        return this.subtle.importKey("raw", this.key, { name: "AES-CBC" }, !1, ["encrypt", "decrypt"]);
      }, t;
    }(),
        d = u,
        h = function () {
      function t() {
        n(this, t), this.rcon = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], this.subMix = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)], this.invSubMix = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)], this.sBox = new Uint32Array(256), this.invSBox = new Uint32Array(256), this.key = new Uint32Array(0), this.initTable();
      }return t.prototype.uint8ArrayToUint32Array_ = function (t) {
        for (var e = new DataView(t), r = new Uint32Array(4), i = 0; i < 4; i++) {
          r[i] = e.getUint32(4 * i);
        }return r;
      }, t.prototype.initTable = function () {
        var t = this.sBox,
            e = this.invSBox,
            r = this.subMix,
            i = r[0],
            a = r[1],
            n = r[2],
            o = r[3],
            s = this.invSubMix,
            l = s[0],
            u = s[1],
            d = s[2],
            h = s[3],
            c = new Uint32Array(256),
            f = 0,
            p = 0,
            g = 0;for (g = 0; g < 256; g++) {
          c[g] = g < 128 ? g << 1 : g << 1 ^ 283;
        }for (g = 0; g < 256; g++) {
          var v = p ^ p << 1 ^ p << 2 ^ p << 3 ^ p << 4;v = v >>> 8 ^ 255 & v ^ 99, t[f] = v, e[v] = f;var y = c[f],
              m = c[y],
              b = c[m],
              E = 257 * c[v] ^ 16843008 * v;i[f] = E << 24 | E >>> 8, a[f] = E << 16 | E >>> 16, n[f] = E << 8 | E >>> 24, o[f] = E, E = 16843009 * b ^ 65537 * m ^ 257 * y ^ 16843008 * f, l[v] = E << 24 | E >>> 8, u[v] = E << 16 | E >>> 16, d[v] = E << 8 | E >>> 24, h[v] = E, f ? (f = y ^ c[c[c[b ^ y]]], p ^= c[c[p]]) : f = p = 1;
        }
      }, t.prototype.expandKey = function (t) {
        for (var e = this.uint8ArrayToUint32Array_(t), r = !0, i = 0; i < e.length && r;) {
          r = e[i] === this.key[i], i++;
        }if (!r) {
          this.key = e;var a = this.keySize = e.length;if (4 !== a && 6 !== a && 8 !== a) throw new Error("Invalid aes key size=" + a);var n = this.ksRows = 4 * (a + 6 + 1),
              o = void 0,
              s = void 0,
              l = this.keySchedule = new Uint32Array(n),
              u = this.invKeySchedule = new Uint32Array(n),
              d = this.sBox,
              h = this.rcon,
              c = this.invSubMix,
              f = c[0],
              p = c[1],
              g = c[2],
              v = c[3],
              y = void 0,
              m = void 0;for (o = 0; o < n; o++) {
            o < a ? y = l[o] = e[o] : (m = y, o % a == 0 ? (m = m << 8 | m >>> 24, m = d[m >>> 24] << 24 | d[m >>> 16 & 255] << 16 | d[m >>> 8 & 255] << 8 | d[255 & m], m ^= h[o / a | 0] << 24) : a > 6 && o % a == 4 && (m = d[m >>> 24] << 24 | d[m >>> 16 & 255] << 16 | d[m >>> 8 & 255] << 8 | d[255 & m]), l[o] = y = (l[o - a] ^ m) >>> 0);
          }for (s = 0; s < n; s++) {
            o = n - s, m = 3 & s ? l[o] : l[o - 4], u[s] = s < 4 || o <= 4 ? m : f[d[m >>> 24]] ^ p[d[m >>> 16 & 255]] ^ g[d[m >>> 8 & 255]] ^ v[d[255 & m]], u[s] = u[s] >>> 0;
          }
        }
      }, t.prototype.networkToHostOrderSwap = function (t) {
        return t << 24 | (65280 & t) << 8 | (16711680 & t) >> 8 | t >>> 24;
      }, t.prototype.decrypt = function (t, e, r) {
        for (var i, a, n = this.keySize + 6, o = this.invKeySchedule, s = this.invSBox, l = this.invSubMix, u = l[0], d = l[1], h = l[2], c = l[3], f = this.uint8ArrayToUint32Array_(r), p = f[0], g = f[1], v = f[2], y = f[3], m = new Int32Array(t), b = new Int32Array(m.length), E = void 0, T = void 0, R = void 0, A = void 0, S = void 0, L = void 0, _ = void 0, w = void 0, D = void 0, I = void 0, k = void 0, O = void 0, C = this.networkToHostOrderSwap; e < m.length;) {
          for (D = C(m[e]), I = C(m[e + 1]), k = C(m[e + 2]), O = C(m[e + 3]), S = D ^ o[0], L = O ^ o[1], _ = k ^ o[2], w = I ^ o[3], i = 4, a = 1; a < n; a++) {
            E = u[S >>> 24] ^ d[L >> 16 & 255] ^ h[_ >> 8 & 255] ^ c[255 & w] ^ o[i], T = u[L >>> 24] ^ d[_ >> 16 & 255] ^ h[w >> 8 & 255] ^ c[255 & S] ^ o[i + 1], R = u[_ >>> 24] ^ d[w >> 16 & 255] ^ h[S >> 8 & 255] ^ c[255 & L] ^ o[i + 2], A = u[w >>> 24] ^ d[S >> 16 & 255] ^ h[L >> 8 & 255] ^ c[255 & _] ^ o[i + 3], S = E, L = T, _ = R, w = A, i += 4;
          }E = s[S >>> 24] << 24 ^ s[L >> 16 & 255] << 16 ^ s[_ >> 8 & 255] << 8 ^ s[255 & w] ^ o[i], T = s[L >>> 24] << 24 ^ s[_ >> 16 & 255] << 16 ^ s[w >> 8 & 255] << 8 ^ s[255 & S] ^ o[i + 1], R = s[_ >>> 24] << 24 ^ s[w >> 16 & 255] << 16 ^ s[S >> 8 & 255] << 8 ^ s[255 & L] ^ o[i + 2], A = s[w >>> 24] << 24 ^ s[S >> 16 & 255] << 16 ^ s[L >> 8 & 255] << 8 ^ s[255 & _] ^ o[i + 3], i += 3, b[e] = C(E ^ p), b[e + 1] = C(A ^ g), b[e + 2] = C(R ^ v), b[e + 3] = C(T ^ y), p = D, g = I, v = k, y = O, e += 4;
        }return b.buffer;
      }, t.prototype.destroy = function () {
        this.key = void 0, this.keySize = void 0, this.ksRows = void 0, this.sBox = void 0, this.invSBox = void 0, this.subMix = void 0, this.invSubMix = void 0, this.keySchedule = void 0, this.invKeySchedule = void 0, this.rcon = void 0;
      }, t;
    }(),
        c = h,
        f = r(2),
        p = r(0),
        g = function () {
      function t(e, r) {
        o(this, t), this.observer = e, this.config = r, this.logEnabled = !0;try {
          var i = crypto || self.crypto;this.subtle = i.subtle || i.webkitSubtle;
        } catch (t) {}this.disableWebCrypto = !this.subtle;
      }return t.prototype.isSync = function () {
        return this.disableWebCrypto && this.config.enableSoftwareAES;
      }, t.prototype.decrypt = function (t, e, r, i) {
        var a = this;if (this.disableWebCrypto && this.config.enableSoftwareAES) {
          this.logEnabled && (p.b.log("JS AES decrypt"), this.logEnabled = !1);var n = this.decryptor;n || (this.decryptor = n = new c()), n.expandKey(e), i(n.decrypt(t, 0, r));
        } else {
          this.logEnabled && (p.b.log("WebCrypto AES decrypt"), this.logEnabled = !1);var o = this.subtle;this.key !== e && (this.key = e, this.fastAesKey = new d(o, e)), this.fastAesKey.expandKey().then(function (n) {
            new l(o, r).decrypt(t, n).catch(function (n) {
              a.onWebCryptoError(n, t, e, r, i);
            }).then(function (t) {
              i(t);
            });
          }).catch(function (n) {
            a.onWebCryptoError(n, t, e, r, i);
          });
        }
      }, t.prototype.onWebCryptoError = function (t, e, r, i, a) {
        this.config.enableSoftwareAES ? (p.b.log("WebCrypto Error, disable WebCrypto API"), this.disableWebCrypto = !0, this.logEnabled = !0, this.decrypt(e, r, i, a)) : (p.b.error("decrypting error : " + t.message), this.observer.trigger(Event.ERROR, { type: f.b.MEDIA_ERROR, details: f.a.FRAG_DECRYPT_ERROR, fatal: !0, reason: t.message }));
      }, t.prototype.destroy = function () {
        var t = this.decryptor;t && (t.destroy(), this.decryptor = void 0);
      }, t;
    }();e.a = g;
  }, function (t, e) {
    function r() {
      this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0;
    }function i(t) {
      return "function" == typeof t;
    }function a(t) {
      return "number" == typeof t;
    }function n(t) {
      return "object" == (typeof t === "undefined" ? "undefined" : _typeof(t)) && null !== t;
    }function o(t) {
      return void 0 === t;
    }t.exports = r, r.EventEmitter = r, r.prototype._events = void 0, r.prototype._maxListeners = void 0, r.defaultMaxListeners = 10, r.prototype.setMaxListeners = function (t) {
      if (!a(t) || t < 0 || isNaN(t)) throw TypeError("n must be a positive number");return this._maxListeners = t, this;
    }, r.prototype.emit = function (t) {
      var e, r, a, s, l, u;if (this._events || (this._events = {}), "error" === t && (!this._events.error || n(this._events.error) && !this._events.error.length)) {
        if ((e = arguments[1]) instanceof Error) throw e;var d = new Error('Uncaught, unspecified "error" event. (' + e + ")");throw d.context = e, d;
      }if (r = this._events[t], o(r)) return !1;if (i(r)) switch (arguments.length) {case 1:
          r.call(this);break;case 2:
          r.call(this, arguments[1]);break;case 3:
          r.call(this, arguments[1], arguments[2]);break;default:
          s = Array.prototype.slice.call(arguments, 1), r.apply(this, s);} else if (n(r)) for (s = Array.prototype.slice.call(arguments, 1), u = r.slice(), a = u.length, l = 0; l < a; l++) {
        u[l].apply(this, s);
      }return !0;
    }, r.prototype.addListener = function (t, e) {
      var a;if (!i(e)) throw TypeError("listener must be a function");return this._events || (this._events = {}), this._events.newListener && this.emit("newListener", t, i(e.listener) ? e.listener : e), this._events[t] ? n(this._events[t]) ? this._events[t].push(e) : this._events[t] = [this._events[t], e] : this._events[t] = e, n(this._events[t]) && !this._events[t].warned && (a = o(this._maxListeners) ? r.defaultMaxListeners : this._maxListeners) && a > 0 && this._events[t].length > a && (this._events[t].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[t].length), "function" == typeof console.trace && console.trace()), this;
    }, r.prototype.on = r.prototype.addListener, r.prototype.once = function (t, e) {
      function r() {
        this.removeListener(t, r), a || (a = !0, e.apply(this, arguments));
      }if (!i(e)) throw TypeError("listener must be a function");var a = !1;return r.listener = e, this.on(t, r), this;
    }, r.prototype.removeListener = function (t, e) {
      var r, a, o, s;if (!i(e)) throw TypeError("listener must be a function");if (!this._events || !this._events[t]) return this;if (r = this._events[t], o = r.length, a = -1, r === e || i(r.listener) && r.listener === e) delete this._events[t], this._events.removeListener && this.emit("removeListener", t, e);else if (n(r)) {
        for (s = o; s-- > 0;) {
          if (r[s] === e || r[s].listener && r[s].listener === e) {
            a = s;break;
          }
        }if (a < 0) return this;1 === r.length ? (r.length = 0, delete this._events[t]) : r.splice(a, 1), this._events.removeListener && this.emit("removeListener", t, e);
      }return this;
    }, r.prototype.removeAllListeners = function (t) {
      var e, r;if (!this._events) return this;if (!this._events.removeListener) return 0 === arguments.length ? this._events = {} : this._events[t] && delete this._events[t], this;if (0 === arguments.length) {
        for (e in this._events) {
          "removeListener" !== e && this.removeAllListeners(e);
        }return this.removeAllListeners("removeListener"), this._events = {}, this;
      }if (r = this._events[t], i(r)) this.removeListener(t, r);else if (r) for (; r.length;) {
        this.removeListener(t, r[r.length - 1]);
      }return delete this._events[t], this;
    }, r.prototype.listeners = function (t) {
      return this._events && this._events[t] ? i(this._events[t]) ? [this._events[t]] : this._events[t].slice() : [];
    }, r.prototype.listenerCount = function (t) {
      if (this._events) {
        var e = this._events[t];if (i(e)) return 1;if (e) return e.length;
      }return 0;
    }, r.listenerCount = function (t, e) {
      return t.listenerCount(e);
    };
  }, function (t, e, r) {
    !function (e) {
      var r = /^((?:[^\/;?#]+:)?)(\/\/[^\/\;?#]*)?(.*?)??(;.*?)?(\?.*?)?(#.*?)?$/,
          i = /^([^\/;?#]*)(.*)$/,
          a = /(?:\/|^)\.(?=\/)/g,
          n = /(?:\/|^)\.\.\/(?!\.\.\/).*?(?=\/)/g,
          o = { buildAbsoluteURL: function buildAbsoluteURL(t, e, r) {
          if (r = r || {}, t = t.trim(), !(e = e.trim())) {
            if (!r.alwaysNormalize) return t;var a = this.parseURL(t);if (!s) throw new Error("Error trying to parse base URL.");return a.path = o.normalizePath(a.path), o.buildURLFromParts(a);
          }var n = this.parseURL(e);if (!n) throw new Error("Error trying to parse relative URL.");if (n.scheme) return r.alwaysNormalize ? (n.path = o.normalizePath(n.path), o.buildURLFromParts(n)) : e;var s = this.parseURL(t);if (!s) throw new Error("Error trying to parse base URL.");if (!s.netLoc && s.path && "/" !== s.path[0]) {
            var l = i.exec(s.path);s.netLoc = l[1], s.path = l[2];
          }s.netLoc && !s.path && (s.path = "/");var u = { scheme: s.scheme, netLoc: n.netLoc, path: null, params: n.params, query: n.query, fragment: n.fragment };if (!n.netLoc && (u.netLoc = s.netLoc, "/" !== n.path[0])) if (n.path) {
            var d = s.path,
                h = d.substring(0, d.lastIndexOf("/") + 1) + n.path;u.path = o.normalizePath(h);
          } else u.path = s.path, n.params || (u.params = s.params, n.query || (u.query = s.query));return null === u.path && (u.path = r.alwaysNormalize ? o.normalizePath(n.path) : n.path), o.buildURLFromParts(u);
        }, parseURL: function parseURL(t) {
          var e = r.exec(t);return e ? { scheme: e[1] || "", netLoc: e[2] || "", path: e[3] || "", params: e[4] || "", query: e[5] || "", fragment: e[6] || "" } : null;
        }, normalizePath: function normalizePath(t) {
          for (t = t.split("").reverse().join("").replace(a, ""); t.length !== (t = t.replace(n, "")).length;) {}return t.split("").reverse().join("");
        }, buildURLFromParts: function buildURLFromParts(t) {
          return t.scheme + t.netLoc + t.path + t.params + t.query + t.fragment;
        } };t.exports = o;
    }();
  }, function (t, e, r) {
    "use strict";
    function i(t, e, r, i) {
      var a,
          n,
          o,
          s,
          l,
          u = navigator.userAgent.toLowerCase(),
          d = i,
          h = [96e3, 88200, 64e3, 48e3, 44100, 32e3, 24e3, 22050, 16e3, 12e3, 11025, 8e3, 7350];return a = 1 + ((192 & e[r + 2]) >>> 6), (n = (60 & e[r + 2]) >>> 2) > h.length - 1 ? void t.trigger(Event.ERROR, { type: L.b.MEDIA_ERROR, details: L.a.FRAG_PARSING_ERROR, fatal: !0, reason: "invalid ADTS sampling index:" + n }) : (s = (1 & e[r + 2]) << 2, s |= (192 & e[r + 3]) >>> 6, w.b.log("manifest codec:" + i + ",ADTS data:type:" + a + ",sampleingIndex:" + n + "[" + h[n] + "Hz],channelConfig:" + s), /firefox/i.test(u) ? n >= 6 ? (a = 5, l = new Array(4), o = n - 3) : (a = 2, l = new Array(2), o = n) : -1 !== u.indexOf("android") ? (a = 2, l = new Array(2), o = n) : (a = 5, l = new Array(4), i && (-1 !== i.indexOf("mp4a.40.29") || -1 !== i.indexOf("mp4a.40.5")) || !i && n >= 6 ? o = n - 3 : ((i && -1 !== i.indexOf("mp4a.40.2") && (n >= 6 && 1 === s || /vivaldi/i.test(u)) || !i && 1 === s) && (a = 2, l = new Array(2)), o = n)), l[0] = a << 3, l[0] |= (14 & n) >> 1, l[1] |= (1 & n) << 7, l[1] |= s << 3, 5 === a && (l[1] |= (14 & o) >> 1, l[2] = (1 & o) << 7, l[2] |= 8, l[3] = 0), { config: l, samplerate: h[n], channelCount: s, codec: "mp4a.40." + a, manifestCodec: d });
    }function a(t, e) {
      return 255 === t[e] && 240 == (246 & t[e + 1]);
    }function n(t, e) {
      return 1 & t[e + 1] ? 7 : 9;
    }function o(t, e) {
      return (3 & t[e + 3]) << 11 | t[e + 4] << 3 | (224 & t[e + 5]) >>> 5;
    }function s(t, e) {
      return !!(e + 1 < t.length && a(t, e));
    }function l(t, e) {
      if (e + 1 < t.length && a(t, e)) {
        var r = n(t, e),
            i = r;e + 5 < t.length && (i = o(t, e));var s = e + i;if (s === t.length || s + 1 < t.length && a(t, s)) return !0;
      }return !1;
    }function u(t, e, r, a, n) {
      if (!t.samplerate) {
        var o = i(e, r, a, n);t.config = o.config, t.samplerate = o.samplerate, t.channelCount = o.channelCount, t.codec = o.codec, t.manifestCodec = o.manifestCodec, w.b.log("parsed codec:" + t.codec + ",rate:" + o.samplerate + ",nb channel:" + o.channelCount);
      }
    }function d(t) {
      return 9216e4 / t;
    }function h(t, e, r, i, a) {
      var s,
          l,
          u,
          d = t.length;if (s = n(t, e), l = o(t, e), (l -= s) > 0 && e + s + l <= d) return u = r + i * a, { headerLength: s, frameLength: l, stamp: u };
    }function c(t, e, r, i, a) {
      var n = d(t.samplerate),
          o = h(e, r, i, a, n);if (o) {
        var s = o.stamp,
            l = o.headerLength,
            u = o.frameLength,
            c = { unit: e.subarray(r + l, r + l + u), pts: s, dts: s };return t.samples.push(c), t.len += u, { sample: c, length: u + l };
      }
    }function f(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function p(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function g(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function v(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function y(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function m(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function b(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function E(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function T(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function R(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function A(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }var S = r(1),
        L = r(2),
        _ = r(4),
        w = r(0),
        D = r(3),
        I = function () {
      function t(e, r, i) {
        f(this, t), this.observer = e, this.config = i, this.remuxer = r;
      }return t.prototype.resetInitSegment = function (t, e, r, i) {
        this._audioTrack = { container: "audio/adts", type: "audio", id: 0, sequenceNumber: 0, isAAC: !0, samples: [], len: 0, manifestCodec: e, duration: i, inputTimeScale: 9e4 };
      }, t.prototype.resetTimeStamp = function () {}, t.probe = function (t) {
        if (!t) return !1;for (var e = D.a.getID3Data(t, 0) || [], r = e.length, i = t.length; r < i; r++) {
          if (l(t, r)) return w.b.log("ADTS sync word found !"), !0;
        }return !1;
      }, t.prototype.append = function (t, e, r, i) {
        for (var a = this._audioTrack, n = D.a.getID3Data(t, 0) || [], o = D.a.getTimeStamp(n), l = o ? 90 * o : 9e4 * e, d = 0, h = l, f = t.length, p = n.length, g = [{ pts: h, dts: h, data: n }]; p < f - 1;) {
          if (s(t, p) && p + 5 < f) {
            u(a, this.observer, t, p, a.manifestCodec);var v = c(a, t, p, l, d);if (!v) {
              w.b.log("Unable to parse AAC frame");break;
            }p += v.length, h = v.sample.pts, d++;
          } else D.a.isHeader(t, p) ? (n = D.a.getID3Data(t, p), g.push({ pts: h, dts: h, data: n }), p += n.length) : p++;
        }this.remuxer.remux(a, { samples: [] }, { samples: g, inputTimeScale: 9e4 }, { samples: [] }, e, r, i);
      }, t.prototype.destroy = function () {}, t;
    }(),
        k = I,
        O = Math.pow(2, 32) - 1,
        C = function () {
      function t(e, r) {
        p(this, t), this.observer = e, this.remuxer = r;
      }return t.prototype.resetTimeStamp = function (t) {
        this.initPTS = t;
      }, t.prototype.resetInitSegment = function (e, r, i, a) {
        if (e && e.byteLength) {
          var n = this.initData = t.parseInitSegment(e);null == r && (r = "mp4a.40.5"), null == i && (i = "avc1.42e01e");var o = {};n.audio && n.video ? o.audiovideo = { container: "video/mp4", codec: r + "," + i, initSegment: a ? e : null } : (n.audio && (o.audio = { container: "audio/mp4", codec: r, initSegment: a ? e : null }), n.video && (o.video = { container: "video/mp4", codec: i, initSegment: a ? e : null })), this.observer.trigger(S.a.FRAG_PARSING_INIT_SEGMENT, { tracks: o });
        } else r && (this.audioCodec = r), i && (this.videoCodec = i);
      }, t.probe = function (e) {
        return t.findBox({ data: e, start: 0, end: Math.min(e.length, 16384) }, ["moof"]).length > 0;
      }, t.bin2str = function (t) {
        return String.fromCharCode.apply(null, t);
      }, t.readUint32 = function (t, e) {
        t.data && (e += t.start, t = t.data);var r = t[e] << 24 | t[e + 1] << 16 | t[e + 2] << 8 | t[e + 3];return r < 0 ? 4294967296 + r : r;
      }, t.writeUint32 = function (t, e, r) {
        t.data && (e += t.start, t = t.data), t[e] = r >> 24, t[e + 1] = r >> 16 & 255, t[e + 2] = r >> 8 & 255, t[e + 3] = 255 & r;
      }, t.findBox = function (e, r) {
        var i,
            a,
            n,
            o,
            s,
            l,
            u,
            d = [];if (e.data ? (l = e.start, o = e.end, e = e.data) : (l = 0, o = e.byteLength), !r.length) return null;for (i = l; i < o;) {
          a = t.readUint32(e, i), n = t.bin2str(e.subarray(i + 4, i + 8)), u = a > 1 ? i + a : o, n === r[0] && (1 === r.length ? d.push({ data: e, start: i + 8, end: u }) : (s = t.findBox({ data: e, start: i + 8, end: u }, r.slice(1)), s.length && (d = d.concat(s)))), i = u;
        }return d;
      }, t.parseInitSegment = function (e) {
        var r = [];return t.findBox(e, ["moov", "trak"]).forEach(function (e) {
          var i = t.findBox(e, ["tkhd"])[0];if (i) {
            var a = i.data[i.start],
                n = 0 === a ? 12 : 20,
                o = t.readUint32(i, n),
                s = t.findBox(e, ["mdia", "mdhd"])[0];if (s) {
              a = s.data[s.start], n = 0 === a ? 12 : 20;var l = t.readUint32(s, n),
                  u = t.findBox(e, ["mdia", "hdlr"])[0];if (u) {
                var d = t.bin2str(u.data.subarray(u.start + 8, u.start + 12)),
                    h = { soun: "audio", vide: "video" }[d];if (h) {
                  var c = t.findBox(e, ["mdia", "minf", "stbl", "stsd"]);if (c.length) {
                    c = c[0];var f = t.bin2str(c.data.subarray(c.start + 12, c.start + 16));w.b.log("MP4Demuxer:" + h + ":" + f + " found");
                  }r[o] = { timescale: l, type: h }, r[h] = { timescale: l, id: o };
                }
              }
            }
          }
        }), r;
      }, t.getStartDTS = function (e, r) {
        var i, a, n;return i = t.findBox(r, ["moof", "traf"]), a = [].concat.apply([], i.map(function (r) {
          return t.findBox(r, ["tfhd"]).map(function (i) {
            var a, n;return a = t.readUint32(i, 4), n = e[a].timescale || 9e4, t.findBox(r, ["tfdt"]).map(function (e) {
              var r, i;return r = e.data[e.start], i = t.readUint32(e, 4), 1 === r && (i *= Math.pow(2, 32), i += t.readUint32(e, 8)), i;
            })[0] / n;
          });
        })), n = Math.min.apply(null, a), isFinite(n) ? n : 0;
      }, t.offsetStartDTS = function (e, r, i) {
        t.findBox(r, ["moof", "traf"]).map(function (r) {
          return t.findBox(r, ["tfhd"]).map(function (a) {
            var n = t.readUint32(a, 4),
                o = e[n].timescale || 9e4;t.findBox(r, ["tfdt"]).map(function (e) {
              var r = e.data[e.start],
                  a = t.readUint32(e, 4);if (0 === r) t.writeUint32(e, 4, a - i * o);else {
                a *= Math.pow(2, 32), a += t.readUint32(e, 8), a -= i * o, a = Math.max(a, 0);var n = Math.floor(a / (O + 1)),
                    s = Math.floor(a % (O + 1));t.writeUint32(e, 4, n), t.writeUint32(e, 8, s);
              }
            });
          });
        });
      }, t.prototype.append = function (e, r, i, a) {
        var n = this.initData;n || (this.resetInitSegment(e, this.audioCodec, this.videoCodec), n = this.initData);var o = void 0,
            s = this.initPTS;if (void 0 === s) {
          var l = t.getStartDTS(n, e);this.initPTS = s = l - r, this.observer.trigger(S.a.INIT_PTS_FOUND, { initPTS: s });
        }t.offsetStartDTS(n, e, s), o = t.getStartDTS(n, e), this.remuxer.remux(n.audio, n.video, null, null, o, i, a, e);
      }, t.prototype.destroy = function () {}, t;
    }(),
        P = C,
        x = { BitratesMap: [32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160], SamplingRateMap: [44100, 48e3, 32e3, 22050, 24e3, 16e3, 11025, 12e3, 8e3], SamplesCoefficients: [[0, 72, 144, 12], [0, 0, 0, 0], [0, 72, 144, 12], [0, 144, 144, 12]], BytesInSlot: [0, 1, 1, 4], appendFrame: function appendFrame(t, e, r, i, a) {
        if (!(r + 24 > e.length)) {
          var n = this.parseHeader(e, r);if (n && r + n.frameLength <= e.length) {
            var o = 9e4 * n.samplesPerFrame / n.sampleRate,
                s = i + a * o,
                l = { unit: e.subarray(r, r + n.frameLength), pts: s, dts: s };return t.config = [], t.channelCount = n.channelCount, t.samplerate = n.sampleRate, t.samples.push(l), t.len += n.frameLength, { sample: l, length: n.frameLength };
          }
        }
      }, parseHeader: function parseHeader(t, e) {
        var r = t[e + 1] >> 3 & 3,
            i = t[e + 1] >> 1 & 3,
            a = t[e + 2] >> 4 & 15,
            n = t[e + 2] >> 2 & 3,
            o = t[e + 2] >> 1 & 1;if (1 !== r && 0 !== a && 15 !== a && 3 !== n) {
          var s = 3 === r ? 3 - i : 3 === i ? 3 : 4,
              l = 1e3 * x.BitratesMap[14 * s + a - 1],
              u = 3 === r ? 0 : 2 === r ? 1 : 2,
              d = x.SamplingRateMap[3 * u + n],
              h = t[e + 3] >> 6 == 3 ? 1 : 2,
              c = x.SamplesCoefficients[r][i],
              f = x.BytesInSlot[i],
              p = 8 * c * f;return { sampleRate: d, channelCount: h, frameLength: parseInt(c * l / d + o, 10) * f, samplesPerFrame: p };
        }
      }, isHeaderPattern: function isHeaderPattern(t, e) {
        return 255 === t[e] && 224 == (224 & t[e + 1]) && 0 != (6 & t[e + 1]);
      }, isHeader: function isHeader(t, e) {
        return !!(e + 1 < t.length && this.isHeaderPattern(t, e));
      }, probe: function probe(t, e) {
        if (e + 1 < t.length && this.isHeaderPattern(t, e)) {
          var r = this.parseHeader(t, e),
              i = 4;r && r.frameLength && (i = r.frameLength);var a = e + i;if (a === t.length || a + 1 < t.length && this.isHeaderPattern(t, a)) return !0;
        }return !1;
      } },
        F = x,
        N = function () {
      function t(e) {
        g(this, t), this.data = e, this.bytesAvailable = e.byteLength, this.word = 0, this.bitsAvailable = 0;
      }return t.prototype.loadWord = function () {
        var t = this.data,
            e = this.bytesAvailable,
            r = t.byteLength - e,
            i = new Uint8Array(4),
            a = Math.min(4, e);if (0 === a) throw new Error("no bytes available");i.set(t.subarray(r, r + a)), this.word = new DataView(i.buffer).getUint32(0), this.bitsAvailable = 8 * a, this.bytesAvailable -= a;
      }, t.prototype.skipBits = function (t) {
        var e;this.bitsAvailable > t ? (this.word <<= t, this.bitsAvailable -= t) : (t -= this.bitsAvailable, e = t >> 3, t -= e >> 3, this.bytesAvailable -= e, this.loadWord(), this.word <<= t, this.bitsAvailable -= t);
      }, t.prototype.readBits = function (t) {
        var e = Math.min(this.bitsAvailable, t),
            r = this.word >>> 32 - e;return t > 32 && w.b.error("Cannot read more than 32 bits at a time"), this.bitsAvailable -= e, this.bitsAvailable > 0 ? this.word <<= e : this.bytesAvailable > 0 && this.loadWord(), e = t - e, e > 0 && this.bitsAvailable ? r << e | this.readBits(e) : r;
      }, t.prototype.skipLZ = function () {
        var t;for (t = 0; t < this.bitsAvailable; ++t) {
          if (0 != (this.word & 2147483648 >>> t)) return this.word <<= t, this.bitsAvailable -= t, t;
        }return this.loadWord(), t + this.skipLZ();
      }, t.prototype.skipUEG = function () {
        this.skipBits(1 + this.skipLZ());
      }, t.prototype.skipEG = function () {
        this.skipBits(1 + this.skipLZ());
      }, t.prototype.readUEG = function () {
        var t = this.skipLZ();return this.readBits(t + 1) - 1;
      }, t.prototype.readEG = function () {
        var t = this.readUEG();return 1 & t ? 1 + t >>> 1 : -1 * (t >>> 1);
      }, t.prototype.readBoolean = function () {
        return 1 === this.readBits(1);
      }, t.prototype.readUByte = function () {
        return this.readBits(8);
      }, t.prototype.readUShort = function () {
        return this.readBits(16);
      }, t.prototype.readUInt = function () {
        return this.readBits(32);
      }, t.prototype.skipScalingList = function (t) {
        var e,
            r,
            i = 8,
            a = 8;for (e = 0; e < t; e++) {
          0 !== a && (r = this.readEG(), a = (i + r + 256) % 256), i = 0 === a ? i : a;
        }
      }, t.prototype.readSPS = function () {
        var t,
            e,
            r,
            i,
            a,
            n,
            o,
            s = 0,
            l = 0,
            u = 0,
            d = 0,
            h = this.readUByte.bind(this),
            c = this.readBits.bind(this),
            f = this.readUEG.bind(this),
            p = this.readBoolean.bind(this),
            g = this.skipBits.bind(this),
            v = this.skipEG.bind(this),
            y = this.skipUEG.bind(this),
            m = this.skipScalingList.bind(this);if (h(), t = h(), c(5), g(3), h(), y(), 100 === t || 110 === t || 122 === t || 244 === t || 44 === t || 83 === t || 86 === t || 118 === t || 128 === t) {
          var b = f();if (3 === b && g(1), y(), y(), g(1), p()) for (n = 3 !== b ? 8 : 12, o = 0; o < n; o++) {
            p() && m(o < 6 ? 16 : 64);
          }
        }y();var E = f();if (0 === E) f();else if (1 === E) for (g(1), v(), v(), e = f(), o = 0; o < e; o++) {
          v();
        }y(), g(1), r = f(), i = f(), a = c(1), 0 === a && g(1), g(1), p() && (s = f(), l = f(), u = f(), d = f());var T = [1, 1];if (p() && p()) {
          switch (h()) {case 1:
              T = [1, 1];break;case 2:
              T = [12, 11];break;case 3:
              T = [10, 11];break;case 4:
              T = [16, 11];break;case 5:
              T = [40, 33];break;case 6:
              T = [24, 11];break;case 7:
              T = [20, 11];break;case 8:
              T = [32, 11];break;case 9:
              T = [80, 33];break;case 10:
              T = [18, 11];break;case 11:
              T = [15, 11];break;case 12:
              T = [64, 33];break;case 13:
              T = [160, 99];break;case 14:
              T = [4, 3];break;case 15:
              T = [3, 2];break;case 16:
              T = [2, 1];break;case 255:
              T = [h() << 8 | h(), h() << 8 | h()];}
        }return { width: Math.ceil(16 * (r + 1) - 2 * s - 2 * l), height: (2 - a) * (i + 1) * 16 - (a ? 2 : 4) * (u + d), pixelRatio: T };
      }, t.prototype.readSliceType = function () {
        return this.readUByte(), this.readUEG(), this.readUEG();
      }, t;
    }(),
        M = N,
        U = function () {
      function t(e, r, i, a) {
        v(this, t), this.decryptdata = i, this.discardEPB = a, this.decrypter = new _.a(e, r);
      }return t.prototype.decryptBuffer = function (t, e) {
        this.decrypter.decrypt(t, this.decryptdata.key.buffer, this.decryptdata.iv.buffer, e);
      }, t.prototype.decryptAacSample = function (t, e, r, i) {
        var a = t[e].unit,
            n = a.subarray(16, a.length - a.length % 16),
            o = n.buffer.slice(n.byteOffset, n.byteOffset + n.length),
            s = this;this.decryptBuffer(o, function (n) {
          n = new Uint8Array(n), a.set(n, 16), i || s.decryptAacSamples(t, e + 1, r);
        });
      }, t.prototype.decryptAacSamples = function (t, e, r) {
        for (;; e++) {
          if (e >= t.length) return void r();if (!(t[e].unit.length < 32)) {
            var i = this.decrypter.isSync();if (this.decryptAacSample(t, e, r, i), !i) return;
          }
        }
      }, t.prototype.getAvcEncryptedData = function (t) {
        for (var e = 16 * Math.floor((t.length - 48) / 160) + 16, r = new Int8Array(e), i = 0, a = 32; a <= t.length - 16; a += 160, i += 16) {
          r.set(t.subarray(a, a + 16), i);
        }return r;
      }, t.prototype.getAvcDecryptedUnit = function (t, e) {
        e = new Uint8Array(e);for (var r = 0, i = 32; i <= t.length - 16; i += 160, r += 16) {
          t.set(e.subarray(r, r + 16), i);
        }return t;
      }, t.prototype.decryptAvcSample = function (t, e, r, i, a, n) {
        var o = this.discardEPB(a.data),
            s = this.getAvcEncryptedData(o),
            l = this;this.decryptBuffer(s.buffer, function (s) {
          a.data = l.getAvcDecryptedUnit(o, s), n || l.decryptAvcSamples(t, e, r + 1, i);
        });
      }, t.prototype.decryptAvcSamples = function (t, e, r, i) {
        for (;; e++, r = 0) {
          if (e >= t.length) return void i();for (var a = t[e].units; !(r >= a.length); r++) {
            var n = a[r];if (!(n.length <= 48 || 1 !== n.type && 5 !== n.type)) {
              var o = this.decrypter.isSync();if (this.decryptAvcSample(t, e, r, i, n, o), !o) return;
            }
          }
        }
      }, t;
    }(),
        B = U,
        G = { video: 0, audio: 1, id3: 2, text: 3 },
        j = function () {
      function t(e, r, i, a) {
        y(this, t), this.observer = e, this.config = i, this.typeSupported = a, this.remuxer = r, this.sampleAes = null;
      }return t.prototype.setDecryptData = function (t) {
        null != t && null != t.key && "SAMPLE-AES" === t.method ? this.sampleAes = new B(this.observer, this.config, t, this.discardEPB) : this.sampleAes = null;
      }, t.probe = function (e) {
        var r = t._syncOffset(e);return !(r < 0) && (r && w.b.warn("MPEG2-TS detected but first sync word found @ offset " + r + ", junk ahead ?"), !0);
      }, t._syncOffset = function (t) {
        for (var e = Math.min(1e3, t.length - 564), r = 0; r < e;) {
          if (71 === t[r] && 71 === t[r + 188] && 71 === t[r + 376]) return r;r++;
        }return -1;
      }, t.createTrack = function (t, e) {
        return { container: "video" === t || "audio" === t ? "video/mp2t" : void 0, type: t, id: G[t], pid: -1, inputTimeScale: 9e4, sequenceNumber: 0, samples: [], len: 0, dropped: "video" === t ? 0 : void 0, isAAC: "audio" === t || void 0, duration: "audio" === t ? e : void 0 };
      }, t.prototype.resetInitSegment = function (e, r, i, a) {
        this.pmtParsed = !1, this._pmtId = -1, this._avcTrack = t.createTrack("video", a), this._audioTrack = t.createTrack("audio", a), this._id3Track = t.createTrack("id3", a), this._txtTrack = t.createTrack("text", a), this.aacOverFlow = null, this.aacLastPTS = null, this.avcSample = null, this.audioCodec = r, this.videoCodec = i, this._duration = a;
      }, t.prototype.resetTimeStamp = function () {}, t.prototype.append = function (e, r, i, a) {
        var n,
            o,
            s,
            l,
            u,
            d = e.length,
            h = !1;this.contiguous = i;var c = this.pmtParsed,
            f = this._avcTrack,
            p = this._audioTrack,
            g = this._id3Track,
            v = f.pid,
            y = p.pid,
            m = g.pid,
            b = this._pmtId,
            E = f.pesData,
            T = p.pesData,
            R = g.pesData,
            A = this._parsePAT,
            _ = this._parsePMT,
            D = this._parsePES,
            I = this._parseAVCPES.bind(this),
            k = this._parseAACPES.bind(this),
            O = this._parseMPEGPES.bind(this),
            C = this._parseID3PES.bind(this),
            P = t._syncOffset(e);for (d -= (d + P) % 188, n = P; n < d; n += 188) {
          if (71 === e[n]) {
            if (o = !!(64 & e[n + 1]), s = ((31 & e[n + 1]) << 8) + e[n + 2], (48 & e[n + 3]) >> 4 > 1) {
              if ((l = n + 5 + e[n + 4]) === n + 188) continue;
            } else l = n + 4;switch (s) {case v:
                o && (E && (u = D(E)) && I(u, !1), E = { data: [], size: 0 }), E && (E.data.push(e.subarray(l, n + 188)), E.size += n + 188 - l);break;case y:
                o && (T && (u = D(T)) && (p.isAAC ? k(u) : O(u)), T = { data: [], size: 0 }), T && (T.data.push(e.subarray(l, n + 188)), T.size += n + 188 - l);break;case m:
                o && (R && (u = D(R)) && C(u), R = { data: [], size: 0 }), R && (R.data.push(e.subarray(l, n + 188)), R.size += n + 188 - l);break;case 0:
                o && (l += e[l] + 1), b = this._pmtId = A(e, l);break;case b:
                o && (l += e[l] + 1);var x = _(e, l, !0 === this.typeSupported.mpeg || !0 === this.typeSupported.mp3, null != this.sampleAes);v = x.avc, v > 0 && (f.pid = v), y = x.audio, y > 0 && (p.pid = y, p.isAAC = x.isAAC), m = x.id3, m > 0 && (g.pid = m), h && !c && (w.b.log("reparse from beginning"), h = !1, n = P - 188), c = this.pmtParsed = !0;break;case 17:case 8191:
                break;default:
                h = !0;}
          } else this.observer.trigger(S.a.ERROR, { type: L.b.MEDIA_ERROR, details: L.a.FRAG_PARSING_ERROR, fatal: !1, reason: "TS packet did not start with 0x47" });
        }E && (u = D(E)) ? (I(u, !0), f.pesData = null) : f.pesData = E, T && (u = D(T)) ? (p.isAAC ? k(u) : O(u), p.pesData = null) : (T && T.size && w.b.log("last AAC PES packet truncated,might overlap between fragments"), p.pesData = T), R && (u = D(R)) ? (C(u), g.pesData = null) : g.pesData = R, null == this.sampleAes ? this.remuxer.remux(p, f, g, this._txtTrack, r, i, a) : this.decryptAndRemux(p, f, g, this._txtTrack, r, i, a);
      }, t.prototype.decryptAndRemux = function (t, e, r, i, a, n, o) {
        if (t.samples && t.isAAC) {
          var s = this;this.sampleAes.decryptAacSamples(t.samples, 0, function () {
            s.decryptAndRemuxAvc(t, e, r, i, a, n, o);
          });
        } else this.decryptAndRemuxAvc(t, e, r, i, a, n, o);
      }, t.prototype.decryptAndRemuxAvc = function (t, e, r, i, a, n, o) {
        if (e.samples) {
          var s = this;this.sampleAes.decryptAvcSamples(e.samples, 0, 0, function () {
            s.remuxer.remux(t, e, r, i, a, n, o);
          });
        } else this.remuxer.remux(t, e, r, i, a, n, o);
      }, t.prototype.destroy = function () {
        this._initPTS = this._initDTS = void 0, this._duration = 0;
      }, t.prototype._parsePAT = function (t, e) {
        return (31 & t[e + 10]) << 8 | t[e + 11];
      }, t.prototype._parsePMT = function (t, e, r, i) {
        var a,
            n,
            o,
            s,
            l = { audio: -1, avc: -1, id3: -1, isAAC: !0 };for (a = (15 & t[e + 1]) << 8 | t[e + 2], n = e + 3 + a - 4, o = (15 & t[e + 10]) << 8 | t[e + 11], e += 12 + o; e < n;) {
          switch (s = (31 & t[e + 1]) << 8 | t[e + 2], t[e]) {case 207:
              if (!i) {
                w.b.log("unkown stream type:" + t[e]);break;
              }case 15:
              -1 === l.audio && (l.audio = s);break;case 21:
              -1 === l.id3 && (l.id3 = s);break;case 219:
              if (!i) {
                w.b.log("unkown stream type:" + t[e]);break;
              }case 27:
              -1 === l.avc && (l.avc = s);break;case 3:case 4:
              r ? -1 === l.audio && (l.audio = s, l.isAAC = !1) : w.b.log("MPEG audio found, not supported in this browser for now");break;case 36:
              w.b.warn("HEVC stream type found, not supported for now");break;default:
              w.b.log("unkown stream type:" + t[e]);}e += 5 + ((15 & t[e + 3]) << 8 | t[e + 4]);
        }return l;
      }, t.prototype._parsePES = function (t) {
        var e,
            r,
            i,
            a,
            n,
            o,
            s,
            l,
            u = 0,
            d = t.data;if (!t || 0 === t.size) return null;for (; d[0].length < 19 && d.length > 1;) {
          var h = new Uint8Array(d[0].length + d[1].length);h.set(d[0]), h.set(d[1], d[0].length), d[0] = h, d.splice(1, 1);
        }if (e = d[0], 1 === (e[0] << 16) + (e[1] << 8) + e[2]) {
          if ((i = (e[4] << 8) + e[5]) && i > t.size - 6) return null;r = e[7], 192 & r && (o = 536870912 * (14 & e[9]) + 4194304 * (255 & e[10]) + 16384 * (254 & e[11]) + 128 * (255 & e[12]) + (254 & e[13]) / 2, o > 4294967295 && (o -= 8589934592), 64 & r ? (s = 536870912 * (14 & e[14]) + 4194304 * (255 & e[15]) + 16384 * (254 & e[16]) + 128 * (255 & e[17]) + (254 & e[18]) / 2, s > 4294967295 && (s -= 8589934592), o - s > 54e5 && (w.b.warn(Math.round((o - s) / 9e4) + "s delta between PTS and DTS, align them"), o = s)) : s = o), a = e[8], l = a + 9, t.size -= l, n = new Uint8Array(t.size);for (var c = 0, f = d.length; c < f; c++) {
            e = d[c];var p = e.byteLength;if (l) {
              if (l > p) {
                l -= p;continue;
              }e = e.subarray(l), p -= l, l = 0;
            }n.set(e, u), u += p;
          }return i && (i -= a + 3), { data: n, pts: o, dts: s, len: i };
        }return null;
      }, t.prototype.pushAccesUnit = function (t, e) {
        if (t.units.length && t.frame) {
          var r = e.samples,
              i = r.length;!this.config.forceKeyFrameOnDiscontinuity || !0 === t.key || e.sps && (i || this.contiguous) ? (t.id = i, r.push(t)) : e.dropped++;
        }t.debug.length && w.b.log(t.pts + "/" + t.dts + ":" + t.debug);
      }, t.prototype._parseAVCPES = function (t, e) {
        var r,
            i,
            a,
            n = this,
            o = this._avcTrack,
            s = this._parseAVCNALu(t.data),
            l = this.avcSample,
            u = !1,
            d = this.pushAccesUnit.bind(this),
            h = function h(t, e, r, i) {
          return { key: t, pts: e, dts: r, units: [], debug: i };
        };t.data = null, l && s.length && !o.audFound && (d(l, o), l = this.avcSample = h(!1, t.pts, t.dts, "")), s.forEach(function (e) {
          switch (e.type) {case 1:
              i = !0, l || (l = n.avcSample = h(!0, t.pts, t.dts, "")), l.frame = !0;var s = e.data;if (u && s.length > 4) {
                var c = new M(s).readSliceType();2 !== c && 4 !== c && 7 !== c && 9 !== c || (l.key = !0);
              }break;case 5:
              i = !0, l || (l = n.avcSample = h(!0, t.pts, t.dts, "")), l.key = !0, l.frame = !0;break;case 6:
              i = !0, r = new M(n.discardEPB(e.data)), r.readUByte();for (var f = 0, p = 0, g = !1, v = 0; !g && r.bytesAvailable > 1;) {
                f = 0;do {
                  v = r.readUByte(), f += v;
                } while (255 === v);p = 0;do {
                  v = r.readUByte(), p += v;
                } while (255 === v);if (4 === f && 0 !== r.bytesAvailable) {
                  g = !0;if (181 === r.readUByte()) {
                    if (49 === r.readUShort()) {
                      if (1195456820 === r.readUInt()) {
                        if (3 === r.readUByte()) {
                          var y = r.readUByte(),
                              m = r.readUByte(),
                              b = 31 & y,
                              E = [y, m];for (a = 0; a < b; a++) {
                            E.push(r.readUByte()), E.push(r.readUByte()), E.push(r.readUByte());
                          }n._insertSampleInOrder(n._txtTrack.samples, { type: 3, pts: t.pts, bytes: E });
                        }
                      }
                    }
                  }
                } else if (p < r.bytesAvailable) for (a = 0; a < p; a++) {
                  r.readUByte();
                }
              }break;case 7:
              if (i = !0, u = !0, !o.sps) {
                r = new M(e.data);var T = r.readSPS();o.width = T.width, o.height = T.height, o.pixelRatio = T.pixelRatio, o.sps = [e.data], o.duration = n._duration;var R = e.data.subarray(1, 4),
                    A = "avc1.";for (a = 0; a < 3; a++) {
                  var S = R[a].toString(16);S.length < 2 && (S = "0" + S), A += S;
                }o.codec = A;
              }break;case 8:
              i = !0, o.pps || (o.pps = [e.data]);break;case 9:
              i = !1, o.audFound = !0, l && d(l, o), l = n.avcSample = h(!1, t.pts, t.dts, "");break;case 12:
              i = !1;break;default:
              i = !1, l && (l.debug += "unknown NAL " + e.type + " ");}if (l && i) {
            l.units.push(e);
          }
        }), e && l && (d(l, o), this.avcSample = null);
      }, t.prototype._insertSampleInOrder = function (t, e) {
        var r = t.length;if (r > 0) {
          if (e.pts >= t[r - 1].pts) t.push(e);else for (var i = r - 1; i >= 0; i--) {
            if (e.pts < t[i].pts) {
              t.splice(i, 0, e);break;
            }
          }
        } else t.push(e);
      }, t.prototype._getLastNalUnit = function () {
        var t = this.avcSample,
            e = void 0;if (!t || 0 === t.units.length) {
          var r = this._avcTrack,
              i = r.samples;t = i[i.length - 1];
        }if (t) {
          var a = t.units;e = a[a.length - 1];
        }return e;
      }, t.prototype._parseAVCNALu = function (t) {
        var e,
            r,
            i,
            a,
            n,
            o = 0,
            s = t.byteLength,
            l = this._avcTrack,
            u = l.naluState || 0,
            d = u,
            h = [],
            c = -1;for (-1 === u && (c = 0, n = 31 & t[0], u = 0, o = 1); o < s;) {
          if (e = t[o++], u) {
            if (1 !== u) {
              if (e) {
                if (1 === e) {
                  if (c >= 0) i = { data: t.subarray(c, o - u - 1), type: n }, h.push(i);else {
                    var f = this._getLastNalUnit();if (f && (d && o <= 4 - d && f.state && (f.data = f.data.subarray(0, f.data.byteLength - d)), (r = o - u - 1) > 0)) {
                      var p = new Uint8Array(f.data.byteLength + r);p.set(f.data, 0), p.set(t.subarray(0, r), f.data.byteLength), f.data = p;
                    }
                  }o < s ? (a = 31 & t[o], c = o, n = a, u = 0) : u = -1;
                } else u = 0;
              } else u = 3;
            } else u = e ? 0 : 2;
          } else u = e ? 0 : 1;
        }if (c >= 0 && u >= 0 && (i = { data: t.subarray(c, s), type: n, state: u }, h.push(i)), 0 === h.length) {
          var g = this._getLastNalUnit();if (g) {
            var v = new Uint8Array(g.data.byteLength + t.byteLength);v.set(g.data, 0), v.set(t, g.data.byteLength), g.data = v;
          }
        }return l.naluState = u, h;
      }, t.prototype.discardEPB = function (t) {
        for (var e, r, i = t.byteLength, a = [], n = 1; n < i - 2;) {
          0 === t[n] && 0 === t[n + 1] && 3 === t[n + 2] ? (a.push(n + 2), n += 2) : n++;
        }if (0 === a.length) return t;e = i - a.length, r = new Uint8Array(e);var o = 0;for (n = 0; n < e; o++, n++) {
          o === a[0] && (o++, a.shift()), r[n] = t[o];
        }return r;
      }, t.prototype._parseAACPES = function (t) {
        var e,
            r,
            i,
            a,
            n,
            o = this._audioTrack,
            l = t.data,
            h = t.pts,
            f = this.aacOverFlow,
            p = this.aacLastPTS;if (f) {
          var g = new Uint8Array(f.byteLength + l.byteLength);g.set(f, 0), g.set(l, f.byteLength), l = g;
        }for (i = 0, n = l.length; i < n - 1 && !s(l, i); i++) {}if (i) {
          var v, y;if (i < n - 1 ? (v = "AAC PES did not start with ADTS header,offset:" + i, y = !1) : (v = "no ADTS header found in AAC PES", y = !0), w.b.warn("parsing error:" + v), this.observer.trigger(S.a.ERROR, { type: L.b.MEDIA_ERROR, details: L.a.FRAG_PARSING_ERROR, fatal: y, reason: v }), y) return;
        }if (u(o, this.observer, l, i, this.audioCodec), r = 0, e = d(o.samplerate), f && p) {
          var m = p + e;Math.abs(m - h) > 1 && (w.b.log("AAC: align PTS for overlapping frames by " + Math.round((m - h) / 90)), h = m);
        }for (; i < n;) {
          if (s(l, i) && i + 5 < n) {
            var b = c(o, l, i, h, r);if (!b) break;i += b.length, a = b.sample.pts, r++;
          } else i++;
        }f = i < n ? l.subarray(i, n) : null, this.aacOverFlow = f, this.aacLastPTS = a;
      }, t.prototype._parseMPEGPES = function (t) {
        for (var e = t.data, r = e.length, i = 0, a = 0, n = t.pts; a < r;) {
          if (F.isHeader(e, a)) {
            var o = F.appendFrame(this._audioTrack, e, a, n, i);if (!o) break;a += o.length, i++;
          } else a++;
        }
      }, t.prototype._parseID3PES = function (t) {
        this._id3Track.samples.push(t);
      }, t;
    }(),
        H = j,
        K = function () {
      function t(e, r, i) {
        m(this, t), this.observer = e, this.config = i, this.remuxer = r;
      }return t.prototype.resetInitSegment = function (t, e, r, i) {
        this._audioTrack = { container: "audio/mpeg", type: "audio", id: -1, sequenceNumber: 0, isAAC: !1, samples: [], len: 0, manifestCodec: e, duration: i, inputTimeScale: 9e4 };
      }, t.prototype.resetTimeStamp = function () {}, t.probe = function (t) {
        var e,
            r,
            i = D.a.getID3Data(t, 0);if (i && void 0 !== D.a.getTimeStamp(i)) for (e = i.length, r = Math.min(t.length - 1, e + 100); e < r; e++) {
          if (F.probe(t, e)) return w.b.log("MPEG Audio sync word found !"), !0;
        }return !1;
      }, t.prototype.append = function (t, e, r, i) {
        for (var a = D.a.getID3Data(t, 0), n = D.a.getTimeStamp(a), o = n ? 90 * n : 9e4 * e, s = a.length, l = t.length, u = 0, d = 0, h = this._audioTrack, c = [{ pts: o, dts: o, data: a }]; s < l;) {
          if (F.isHeader(t, s)) {
            var f = F.appendFrame(h, t, s, o, u);if (!f) break;s += f.length, d = f.sample.pts, u++;
          } else D.a.isHeader(t, s) ? (a = D.a.getID3Data(t, s), c.push({ pts: d, dts: d, data: a }), s += a.length) : s++;
        }this.remuxer.remux(h, { samples: [] }, { samples: c, inputTimeScale: 9e4 }, { samples: [] }, e, r, i);
      }, t.prototype.destroy = function () {}, t;
    }(),
        W = K,
        V = function () {
      function t() {
        b(this, t);
      }return t.getSilentFrame = function (t, e) {
        switch (t) {case "mp4a.40.2":
            if (1 === e) return new Uint8Array([0, 200, 0, 128, 35, 128]);if (2 === e) return new Uint8Array([33, 0, 73, 144, 2, 25, 0, 35, 128]);if (3 === e) return new Uint8Array([0, 200, 0, 128, 32, 132, 1, 38, 64, 8, 100, 0, 142]);if (4 === e) return new Uint8Array([0, 200, 0, 128, 32, 132, 1, 38, 64, 8, 100, 0, 128, 44, 128, 8, 2, 56]);if (5 === e) return new Uint8Array([0, 200, 0, 128, 32, 132, 1, 38, 64, 8, 100, 0, 130, 48, 4, 153, 0, 33, 144, 2, 56]);if (6 === e) return new Uint8Array([0, 200, 0, 128, 32, 132, 1, 38, 64, 8, 100, 0, 130, 48, 4, 153, 0, 33, 144, 2, 0, 178, 0, 32, 8, 224]);break;default:
            if (1 === e) return new Uint8Array([1, 64, 34, 128, 163, 78, 230, 128, 186, 8, 0, 0, 0, 28, 6, 241, 193, 10, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 94]);if (2 === e) return new Uint8Array([1, 64, 34, 128, 163, 94, 230, 128, 186, 8, 0, 0, 0, 0, 149, 0, 6, 241, 161, 10, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 94]);if (3 === e) return new Uint8Array([1, 64, 34, 128, 163, 94, 230, 128, 186, 8, 0, 0, 0, 0, 149, 0, 6, 241, 161, 10, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 94]);}return null;
      }, t;
    }(),
        Y = V,
        z = Math.pow(2, 32) - 1,
        X = function () {
      function t() {
        E(this, t);
      }return t.init = function () {
        t.types = { avc1: [], avcC: [], btrt: [], dinf: [], dref: [], esds: [], ftyp: [], hdlr: [], mdat: [], mdhd: [], mdia: [], mfhd: [], minf: [], moof: [], moov: [], mp4a: [], ".mp3": [], mvex: [], mvhd: [], pasp: [], sdtp: [], stbl: [], stco: [], stsc: [], stsd: [], stsz: [], stts: [], tfdt: [], tfhd: [], traf: [], trak: [], trun: [], trex: [], tkhd: [], vmhd: [], smhd: [] };var e;for (e in t.types) {
          t.types.hasOwnProperty(e) && (t.types[e] = [e.charCodeAt(0), e.charCodeAt(1), e.charCodeAt(2), e.charCodeAt(3)]);
        }var r = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 118, 105, 100, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 105, 100, 101, 111, 72, 97, 110, 100, 108, 101, 114, 0]),
            i = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 115, 111, 117, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 83, 111, 117, 110, 100, 72, 97, 110, 100, 108, 101, 114, 0]);t.HDLR_TYPES = { video: r, audio: i };var a = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 12, 117, 114, 108, 32, 0, 0, 0, 1]),
            n = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);t.STTS = t.STSC = t.STCO = n, t.STSZ = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), t.VMHD = new Uint8Array([0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]), t.SMHD = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]), t.STSD = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1]);var o = new Uint8Array([105, 115, 111, 109]),
            s = new Uint8Array([97, 118, 99, 49]),
            l = new Uint8Array([0, 0, 0, 1]);t.FTYP = t.box(t.types.ftyp, o, l, o, s), t.DINF = t.box(t.types.dinf, t.box(t.types.dref, a));
      }, t.box = function (t) {
        for (var e, r = Array.prototype.slice.call(arguments, 1), i = 8, a = r.length, n = a; a--;) {
          i += r[a].byteLength;
        }for (e = new Uint8Array(i), e[0] = i >> 24 & 255, e[1] = i >> 16 & 255, e[2] = i >> 8 & 255, e[3] = 255 & i, e.set(t, 4), a = 0, i = 8; a < n; a++) {
          e.set(r[a], i), i += r[a].byteLength;
        }return e;
      }, t.hdlr = function (e) {
        return t.box(t.types.hdlr, t.HDLR_TYPES[e]);
      }, t.mdat = function (e) {
        return t.box(t.types.mdat, e);
      }, t.mdhd = function (e, r) {
        r *= e;var i = Math.floor(r / (z + 1)),
            a = Math.floor(r % (z + 1));return t.box(t.types.mdhd, new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3, e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, 255 & e, i >> 24, i >> 16 & 255, i >> 8 & 255, 255 & i, a >> 24, a >> 16 & 255, a >> 8 & 255, 255 & a, 85, 196, 0, 0]));
      }, t.mdia = function (e) {
        return t.box(t.types.mdia, t.mdhd(e.timescale, e.duration), t.hdlr(e.type), t.minf(e));
      }, t.mfhd = function (e) {
        return t.box(t.types.mfhd, new Uint8Array([0, 0, 0, 0, e >> 24, e >> 16 & 255, e >> 8 & 255, 255 & e]));
      }, t.minf = function (e) {
        return "audio" === e.type ? t.box(t.types.minf, t.box(t.types.smhd, t.SMHD), t.DINF, t.stbl(e)) : t.box(t.types.minf, t.box(t.types.vmhd, t.VMHD), t.DINF, t.stbl(e));
      }, t.moof = function (e, r, i) {
        return t.box(t.types.moof, t.mfhd(e), t.traf(i, r));
      }, t.moov = function (e) {
        for (var r = e.length, i = []; r--;) {
          i[r] = t.trak(e[r]);
        }return t.box.apply(null, [t.types.moov, t.mvhd(e[0].timescale, e[0].duration)].concat(i).concat(t.mvex(e)));
      }, t.mvex = function (e) {
        for (var r = e.length, i = []; r--;) {
          i[r] = t.trex(e[r]);
        }return t.box.apply(null, [t.types.mvex].concat(i));
      }, t.mvhd = function (e, r) {
        r *= e;var i = Math.floor(r / (z + 1)),
            a = Math.floor(r % (z + 1)),
            n = new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3, e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, 255 & e, i >> 24, i >> 16 & 255, i >> 8 & 255, 255 & i, a >> 24, a >> 16 & 255, a >> 8 & 255, 255 & a, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255, 255]);return t.box(t.types.mvhd, n);
      }, t.sdtp = function (e) {
        var r,
            i,
            a = e.samples || [],
            n = new Uint8Array(4 + a.length);for (i = 0; i < a.length; i++) {
          r = a[i].flags, n[i + 4] = r.dependsOn << 4 | r.isDependedOn << 2 | r.hasRedundancy;
        }return t.box(t.types.sdtp, n);
      }, t.stbl = function (e) {
        return t.box(t.types.stbl, t.stsd(e), t.box(t.types.stts, t.STTS), t.box(t.types.stsc, t.STSC), t.box(t.types.stsz, t.STSZ), t.box(t.types.stco, t.STCO));
      }, t.avc1 = function (e) {
        var r,
            i,
            a,
            n = [],
            o = [];for (r = 0; r < e.sps.length; r++) {
          i = e.sps[r], a = i.byteLength, n.push(a >>> 8 & 255), n.push(255 & a), n = n.concat(Array.prototype.slice.call(i));
        }for (r = 0; r < e.pps.length; r++) {
          i = e.pps[r], a = i.byteLength, o.push(a >>> 8 & 255), o.push(255 & a), o = o.concat(Array.prototype.slice.call(i));
        }var s = t.box(t.types.avcC, new Uint8Array([1, n[3], n[4], n[5], 255, 224 | e.sps.length].concat(n).concat([e.pps.length]).concat(o))),
            l = e.width,
            u = e.height,
            d = e.pixelRatio[0],
            h = e.pixelRatio[1];return t.box(t.types.avc1, new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, l >> 8 & 255, 255 & l, u >> 8 & 255, 255 & u, 0, 72, 0, 0, 0, 72, 0, 0, 0, 0, 0, 0, 0, 1, 18, 100, 97, 105, 108, 121, 109, 111, 116, 105, 111, 110, 47, 104, 108, 115, 46, 106, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 17, 17]), s, t.box(t.types.btrt, new Uint8Array([0, 28, 156, 128, 0, 45, 198, 192, 0, 45, 198, 192])), t.box(t.types.pasp, new Uint8Array([d >> 24, d >> 16 & 255, d >> 8 & 255, 255 & d, h >> 24, h >> 16 & 255, h >> 8 & 255, 255 & h])));
      }, t.esds = function (t) {
        var e = t.config.length;return new Uint8Array([0, 0, 0, 0, 3, 23 + e, 0, 1, 0, 4, 15 + e, 64, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5].concat([e]).concat(t.config).concat([6, 1, 2]));
      }, t.mp4a = function (e) {
        var r = e.samplerate;return t.box(t.types.mp4a, new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, e.channelCount, 0, 16, 0, 0, 0, 0, r >> 8 & 255, 255 & r, 0, 0]), t.box(t.types.esds, t.esds(e)));
      }, t.mp3 = function (e) {
        var r = e.samplerate;return t.box(t.types[".mp3"], new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, e.channelCount, 0, 16, 0, 0, 0, 0, r >> 8 & 255, 255 & r, 0, 0]));
      }, t.stsd = function (e) {
        return "audio" === e.type ? e.isAAC || "mp3" !== e.codec ? t.box(t.types.stsd, t.STSD, t.mp4a(e)) : t.box(t.types.stsd, t.STSD, t.mp3(e)) : t.box(t.types.stsd, t.STSD, t.avc1(e));
      }, t.tkhd = function (e) {
        var r = e.id,
            i = e.duration * e.timescale,
            a = e.width,
            n = e.height,
            o = Math.floor(i / (z + 1)),
            s = Math.floor(i % (z + 1));return t.box(t.types.tkhd, new Uint8Array([1, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3, r >> 24 & 255, r >> 16 & 255, r >> 8 & 255, 255 & r, 0, 0, 0, 0, o >> 24, o >> 16 & 255, o >> 8 & 255, 255 & o, s >> 24, s >> 16 & 255, s >> 8 & 255, 255 & s, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 0, 0, 0, a >> 8 & 255, 255 & a, 0, 0, n >> 8 & 255, 255 & n, 0, 0]));
      }, t.traf = function (e, r) {
        var i = t.sdtp(e),
            a = e.id,
            n = Math.floor(r / (z + 1)),
            o = Math.floor(r % (z + 1));return t.box(t.types.traf, t.box(t.types.tfhd, new Uint8Array([0, 0, 0, 0, a >> 24, a >> 16 & 255, a >> 8 & 255, 255 & a])), t.box(t.types.tfdt, new Uint8Array([1, 0, 0, 0, n >> 24, n >> 16 & 255, n >> 8 & 255, 255 & n, o >> 24, o >> 16 & 255, o >> 8 & 255, 255 & o])), t.trun(e, i.length + 16 + 20 + 8 + 16 + 8 + 8), i);
      }, t.trak = function (e) {
        return e.duration = e.duration || 4294967295, t.box(t.types.trak, t.tkhd(e), t.mdia(e));
      }, t.trex = function (e) {
        var r = e.id;return t.box(t.types.trex, new Uint8Array([0, 0, 0, 0, r >> 24, r >> 16 & 255, r >> 8 & 255, 255 & r, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1]));
      }, t.trun = function (e, r) {
        var i,
            a,
            n,
            o,
            s,
            l,
            u = e.samples || [],
            d = u.length,
            h = 12 + 16 * d,
            c = new Uint8Array(h);for (r += 8 + h, c.set([0, 0, 15, 1, d >>> 24 & 255, d >>> 16 & 255, d >>> 8 & 255, 255 & d, r >>> 24 & 255, r >>> 16 & 255, r >>> 8 & 255, 255 & r], 0), i = 0; i < d; i++) {
          a = u[i], n = a.duration, o = a.size, s = a.flags, l = a.cts, c.set([n >>> 24 & 255, n >>> 16 & 255, n >>> 8 & 255, 255 & n, o >>> 24 & 255, o >>> 16 & 255, o >>> 8 & 255, 255 & o, s.isLeading << 2 | s.dependsOn, s.isDependedOn << 6 | s.hasRedundancy << 4 | s.paddingValue << 1 | s.isNonSync, 61440 & s.degradPrio, 15 & s.degradPrio, l >>> 24 & 255, l >>> 16 & 255, l >>> 8 & 255, 255 & l], 12 + 16 * i);
        }return t.box(t.types.trun, c);
      }, t.initSegment = function (e) {
        t.types || t.init();var r,
            i = t.moov(e);return r = new Uint8Array(t.FTYP.byteLength + i.byteLength), r.set(t.FTYP), r.set(i, t.FTYP.byteLength), r;
      }, t;
    }(),
        q = X,
        Q = function () {
      function t(e, r, i, a) {
        T(this, t), this.observer = e, this.config = r, this.typeSupported = i;var n = navigator.userAgent;this.isSafari = a && a.indexOf("Apple") > -1 && n && !n.match("CriOS"), this.ISGenerated = !1;
      }return t.prototype.destroy = function () {}, t.prototype.resetTimeStamp = function (t) {
        this._initPTS = this._initDTS = t;
      }, t.prototype.resetInitSegment = function () {
        this.ISGenerated = !1;
      }, t.prototype.remux = function (t, e, r, i, a, n, o) {
        if (this.ISGenerated || this.generateIS(t, e, a), this.ISGenerated) {
          var s = t.samples.length,
              l = e.samples.length,
              u = a,
              d = a;if (s && l) {
            var h = (t.samples[0].dts - e.samples[0].dts) / e.inputTimeScale;u += Math.max(0, h), d += Math.max(0, -h);
          }if (s) {
            t.timescale || (w.b.warn("regenerate InitSegment as audio detected"), this.generateIS(t, e, a));var c = this.remuxAudio(t, u, n, o);if (l) {
              var f = void 0;c && (f = c.endPTS - c.startPTS), e.timescale || (w.b.warn("regenerate InitSegment as video detected"), this.generateIS(t, e, a)), this.remuxVideo(e, d, n, f, o);
            }
          } else {
            var p = void 0;l && (p = this.remuxVideo(e, d, n, o)), p && t.codec && this.remuxEmptyAudio(t, u, n, p);
          }
        }r.samples.length && this.remuxID3(r, a), i.samples.length && this.remuxText(i, a), this.observer.trigger(S.a.FRAG_PARSED);
      }, t.prototype.generateIS = function (t, e, r) {
        var i,
            a,
            n = this.observer,
            o = t.samples,
            s = e.samples,
            l = this.typeSupported,
            u = "audio/mp4",
            d = {},
            h = { tracks: d },
            c = void 0 === this._initPTS;if (c && (i = a = 1 / 0), t.config && o.length && (t.timescale = t.samplerate, w.b.log("audio sampling rate : " + t.samplerate), t.isAAC || (l.mpeg ? (u = "audio/mpeg", t.codec = "") : l.mp3 && (t.codec = "mp3")), d.audio = { container: u, codec: t.codec, initSegment: !t.isAAC && l.mpeg ? new Uint8Array() : q.initSegment([t]), metadata: { channelCount: t.channelCount } }, c && (i = a = o[0].pts - t.inputTimeScale * r)), e.sps && e.pps && s.length) {
          var f = e.inputTimeScale;e.timescale = f, d.video = { container: "video/mp4", codec: e.codec, initSegment: q.initSegment([e]), metadata: { width: e.width, height: e.height } }, c && (i = Math.min(i, s[0].pts - f * r), a = Math.min(a, s[0].dts - f * r), this.observer.trigger(S.a.INIT_PTS_FOUND, { initPTS: i }));
        }Object.keys(d).length ? (n.trigger(S.a.FRAG_PARSING_INIT_SEGMENT, h), this.ISGenerated = !0, c && (this._initPTS = i, this._initDTS = a)) : n.trigger(S.a.ERROR, { type: L.b.MEDIA_ERROR, details: L.a.FRAG_PARSING_ERROR, fatal: !1, reason: "no audio/video samples found" });
      }, t.prototype.remuxVideo = function (t, e, r, i, a) {
        var n,
            o,
            s,
            l,
            u,
            d,
            h,
            c = 8,
            f = t.timescale,
            p = t.samples,
            g = [],
            v = p.length,
            y = this._PTSNormalize,
            m = this._initDTS,
            b = this.nextAvcDts,
            E = this.isSafari;E && (r |= p.length && b && (a && Math.abs(e - b / f) < .1 || Math.abs(p[0].pts - b - m) < f / 5)), r || (b = e * f), p.forEach(function (t) {
          t.pts = y(t.pts - m, b), t.dts = y(t.dts - m, b);
        }), p.sort(function (t, e) {
          var r = t.dts - e.dts,
              i = t.pts - e.pts;return r || i || t.id - e.id;
        });var T = p.reduce(function (t, e) {
          return Math.max(Math.min(t, e.pts - e.dts), -18e3);
        }, 0);if (T < 0) {
          w.b.warn("PTS < DTS detected in video samples, shifting DTS by " + Math.round(T / 90) + " ms to overcome this issue");for (var R = 0; R < p.length; R++) {
            p[R].dts += T;
          }
        }var A = p[0];u = Math.max(A.dts, 0), l = Math.max(A.pts, 0);var _ = Math.round((u - b) / 90);r && _ && (_ > 1 ? w.b.log("AVC:" + _ + " ms hole between fragments detected,filling it") : _ < -1 && w.b.log("AVC:" + -_ + " ms overlapping between fragments detected"), u = b, p[0].dts = u, l = Math.max(l - _, b), p[0].pts = l, w.b.log("Video/PTS/DTS adjusted: " + Math.round(l / 90) + "/" + Math.round(u / 90) + ",delta:" + _ + " ms")), A = p[p.length - 1], h = Math.max(A.dts, 0), d = Math.max(A.pts, 0, h), E && (n = Math.round((h - u) / (p.length - 1)));for (var D = 0, I = 0, k = 0; k < v; k++) {
          for (var O = p[k], C = O.units, P = C.length, x = 0, F = 0; F < P; F++) {
            x += C[F].data.length;
          }I += x, D += P, O.length = x, O.dts = E ? u + k * n : Math.max(O.dts, u), O.pts = Math.max(O.pts, O.dts);
        }var N = I + 4 * D + 8;try {
          o = new Uint8Array(N);
        } catch (t) {
          return void this.observer.trigger(S.a.ERROR, { type: L.b.MUX_ERROR, details: L.a.REMUX_ALLOC_ERROR, fatal: !1, bytes: N, reason: "fail allocating video mdat " + N });
        }var M = new DataView(o.buffer);M.setUint32(0, N), o.set(q.types.mdat, 4);for (var U = 0; U < v; U++) {
          for (var B = p[U], G = B.units, j = 0, H = void 0, K = 0, W = G.length; K < W; K++) {
            var V = G[K],
                Y = V.data,
                z = V.data.byteLength;M.setUint32(c, z), c += 4, o.set(Y, c), c += z, j += 4 + z;
          }if (E) H = Math.max(0, n * Math.round((B.pts - B.dts) / n));else {
            if (U < v - 1) n = p[U + 1].dts - B.dts;else {
              var X = this.config,
                  Q = B.dts - p[U > 0 ? U - 1 : U].dts;if (X.stretchShortVideoTrack) {
                var J = X.maxBufferHole,
                    $ = X.maxSeekHole,
                    Z = Math.floor(Math.min(J, $) * f),
                    tt = (i ? l + i * f : this.nextAudioPts) - B.pts;tt > Z ? (n = tt - Q, n < 0 && (n = Q), w.b.log("It is approximately " + tt / 90 + " ms to the next segment; using duration " + n / 90 + " ms for the last video frame.")) : n = Q;
              } else n = Q;
            }H = Math.round(B.pts - B.dts);
          }g.push({ size: j, duration: n, cts: H, flags: { isLeading: 0, isDependedOn: 0, hasRedundancy: 0, degradPrio: 0, dependsOn: B.key ? 2 : 1, isNonSync: B.key ? 0 : 1 } });
        }this.nextAvcDts = h + n;var et = t.dropped;if (t.len = 0, t.nbNalu = 0, t.dropped = 0, g.length && navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
          var rt = g[0].flags;rt.dependsOn = 2, rt.isNonSync = 0;
        }t.samples = g, s = q.moof(t.sequenceNumber++, u, t), t.samples = [];var it = { data1: s, data2: o, startPTS: l / f, endPTS: (d + n) / f, startDTS: u / f, endDTS: this.nextAvcDts / f, type: "video", nb: g.length, dropped: et };return this.observer.trigger(S.a.FRAG_PARSING_DATA, it), it;
      }, t.prototype.remuxAudio = function (t, e, r, i) {
        var a,
            n,
            o,
            s,
            l,
            u,
            d,
            h = t.inputTimeScale,
            c = t.timescale,
            f = h / c,
            p = t.isAAC ? 1024 : 1152,
            g = p * f,
            v = this._PTSNormalize,
            y = this._initDTS,
            m = !t.isAAC && this.typeSupported.mpeg,
            b = t.samples,
            E = [],
            T = this.nextAudioPts;if (r |= b.length && T && (i && Math.abs(e - T / h) < .1 || Math.abs(b[0].pts - T - y) < 20 * g), b.forEach(function (t) {
          t.pts = t.dts = v(t.pts - y, e * h);
        }), b = b.filter(function (t) {
          return t.pts >= 0;
        }), 0 !== b.length) {
          if (r || (T = i ? e * h : b[0].pts), t.isAAC) for (var R = this.config.maxAudioFramesDrift, A = 0, _ = T; A < b.length;) {
            var D,
                I = b[A],
                k = I.pts;D = k - _;var O = Math.abs(1e3 * D / h);if (D <= -R * g) w.b.warn("Dropping 1 audio frame @ " + (_ / h).toFixed(3) + "s due to " + Math.round(O) + " ms overlap."), b.splice(A, 1), t.len -= I.unit.length;else if (D >= R * g && O < 1e4 && _) {
              var C = Math.round(D / g);w.b.warn("Injecting " + C + " audio frame @ " + (_ / h).toFixed(3) + "s due to " + Math.round(1e3 * D / h) + " ms gap.");for (var P = 0; P < C; P++) {
                var x = Math.max(_, 0);o = Y.getSilentFrame(t.manifestCodec || t.codec, t.channelCount), o || (w.b.log("Unable to get silent frame for given audio codec; duplicating last frame instead."), o = I.unit.subarray()), b.splice(A, 0, { unit: o, pts: x, dts: x }), t.len += o.length, _ += g, A++;
              }I.pts = I.dts = _, _ += g, A++;
            } else Math.abs(D), I.pts = I.dts = _, _ += g, A++;
          }for (var F = 0, N = b.length; F < N; F++) {
            var M = b[F],
                U = M.unit,
                B = M.pts;if (void 0 !== d) n.duration = Math.round((B - d) / f);else {
              var G = Math.round(1e3 * (B - T) / h),
                  j = 0;if (r && t.isAAC && G) {
                if (G > 0 && G < 1e4) j = Math.round((B - T) / g), w.b.log(G + " ms hole between AAC samples detected,filling it"), j > 0 && (o = Y.getSilentFrame(t.manifestCodec || t.codec, t.channelCount), o || (o = U.subarray()), t.len += j * o.length);else if (G < -12) {
                  w.b.log("drop overlapping AAC sample, expected/parsed/delta:" + (T / h).toFixed(3) + "s/" + (B / h).toFixed(3) + "s/" + -G + "ms"), t.len -= U.byteLength;continue;
                }B = T;
              }if (u = B, !(t.len > 0)) return;var H = m ? t.len : t.len + 8;a = m ? 0 : 8;try {
                s = new Uint8Array(H);
              } catch (t) {
                return void this.observer.trigger(S.a.ERROR, { type: L.b.MUX_ERROR, details: L.a.REMUX_ALLOC_ERROR, fatal: !1, bytes: H, reason: "fail allocating audio mdat " + H });
              }if (!m) {
                new DataView(s.buffer).setUint32(0, H), s.set(q.types.mdat, 4);
              }for (var K = 0; K < j; K++) {
                o = Y.getSilentFrame(t.manifestCodec || t.codec, t.channelCount), o || (w.b.log("Unable to get silent frame for given audio codec; duplicating this frame instead."), o = U.subarray()), s.set(o, a), a += o.byteLength, n = { size: o.byteLength, cts: 0, duration: 1024, flags: { isLeading: 0, isDependedOn: 0, hasRedundancy: 0, degradPrio: 0, dependsOn: 1 } }, E.push(n);
              }
            }s.set(U, a);var W = U.byteLength;a += W, n = { size: W, cts: 0, duration: 0, flags: { isLeading: 0, isDependedOn: 0, hasRedundancy: 0, degradPrio: 0, dependsOn: 1 } }, E.push(n), d = B;
          }var V = 0,
              z = E.length;if (z >= 2 && (V = E[z - 2].duration, n.duration = V), z) {
            this.nextAudioPts = T = d + f * V, t.len = 0, t.samples = E, l = m ? new Uint8Array() : q.moof(t.sequenceNumber++, u / f, t), t.samples = [];var X = u / h,
                Q = T / h,
                J = { data1: l, data2: s, startPTS: X, endPTS: Q, startDTS: X, endDTS: Q, type: "audio", nb: z };return this.observer.trigger(S.a.FRAG_PARSING_DATA, J), J;
          }return null;
        }
      }, t.prototype.remuxEmptyAudio = function (t, e, r, i) {
        var a = t.inputTimeScale,
            n = t.samplerate ? t.samplerate : a,
            o = a / n,
            s = this.nextAudioPts,
            l = (void 0 !== s ? s : i.startDTS * a) + this._initDTS,
            u = i.endDTS * a + this._initDTS,
            d = 1024 * o,
            h = Math.ceil((u - l) / d),
            c = Y.getSilentFrame(t.manifestCodec || t.codec, t.channelCount);if (w.b.warn("remux empty Audio"), !c) return void w.b.trace("Unable to remuxEmptyAudio since we were unable to get a silent frame for given audio codec!");for (var f = [], p = 0; p < h; p++) {
          var g = l + p * d;f.push({ unit: c, pts: g, dts: g }), t.len += c.length;
        }t.samples = f, this.remuxAudio(t, e, r);
      }, t.prototype.remuxID3 = function (t, e) {
        var r,
            i = t.samples.length,
            a = t.inputTimeScale,
            n = this._initPTS,
            o = this._initDTS;if (i) {
          for (var s = 0; s < i; s++) {
            r = t.samples[s], r.pts = (r.pts - n) / a, r.dts = (r.dts - o) / a;
          }this.observer.trigger(S.a.FRAG_PARSING_METADATA, { samples: t.samples });
        }t.samples = [], e = e;
      }, t.prototype.remuxText = function (t, e) {
        t.samples.sort(function (t, e) {
          return t.pts - e.pts;
        });var r,
            i = t.samples.length,
            a = t.inputTimeScale,
            n = this._initPTS;if (i) {
          for (var o = 0; o < i; o++) {
            r = t.samples[o], r.pts = (r.pts - n) / a;
          }this.observer.trigger(S.a.FRAG_PARSING_USERDATA, { samples: t.samples });
        }t.samples = [], e = e;
      }, t.prototype._PTSNormalize = function (t, e) {
        var r;if (void 0 === e) return t;for (r = e < t ? -8589934592 : 8589934592; Math.abs(t - e) > 4294967296;) {
          t += r;
        }return t;
      }, t;
    }(),
        J = Q,
        $ = function () {
      function t(e) {
        R(this, t), this.observer = e;
      }return t.prototype.destroy = function () {}, t.prototype.resetTimeStamp = function () {}, t.prototype.resetInitSegment = function () {}, t.prototype.remux = function (t, e, r, i, a, n, o, s) {
        var l = this.observer,
            u = "";t && (u += "audio"), e && (u += "video"), l.trigger(S.a.FRAG_PARSING_DATA, { data1: s, startPTS: a, startDTS: a, type: u, nb: 1, dropped: 0 }), l.trigger(S.a.FRAG_PARSED);
      }, t;
    }(),
        Z = $,
        tt = function () {
      function t(e, r, i, a) {
        A(this, t), this.observer = e, this.typeSupported = r, this.config = i, this.vendor = a;
      }return t.prototype.destroy = function () {
        var t = this.demuxer;t && t.destroy();
      }, t.prototype.push = function (t, e, r, i, a, n, o, s, l, u, d, h) {
        if (t.byteLength > 0 && null != e && null != e.key && "AES-128" === e.method) {
          var c = this.decrypter;null == c && (c = this.decrypter = new _.a(this.observer, this.config));var f,
              p = this;try {
            f = performance.now();
          } catch (t) {
            f = Date.now();
          }c.decrypt(t, e.key.buffer, e.iv.buffer, function (t) {
            var c;try {
              c = performance.now();
            } catch (t) {
              c = Date.now();
            }p.observer.trigger(S.a.FRAG_DECRYPTED, { stats: { tstart: f, tdecrypt: c } }), p.pushDecrypted(new Uint8Array(t), e, new Uint8Array(r), i, a, n, o, s, l, u, d, h);
          });
        } else this.pushDecrypted(new Uint8Array(t), e, new Uint8Array(r), i, a, n, o, s, l, u, d, h);
      }, t.prototype.pushDecrypted = function (t, e, r, i, a, n, o, s, l, u, d, h) {
        var c = this.demuxer;if (!c || o && !this.probe(t)) {
          for (var f = this.observer, p = this.typeSupported, g = this.config, v = [{ demux: H, remux: J }, { demux: P, remux: Z }, { demux: k, remux: J }, { demux: W, remux: J }], y = 0, m = v.length; y < m; y++) {
            var b = v[y],
                E = b.demux.probe;if (E(t)) {
              var T = this.remuxer = new b.remux(f, g, p, this.vendor);c = new b.demux(f, T, g, p), this.probe = E;break;
            }
          }if (!c) return void f.trigger(S.a.ERROR, { type: L.b.MEDIA_ERROR, details: L.a.FRAG_PARSING_ERROR, fatal: !0, reason: "no demux matching with content found" });this.demuxer = c;
        }var R = this.remuxer;(o || s) && (c.resetInitSegment(r, i, a, u), R.resetInitSegment()), o && (c.resetTimeStamp(h), R.resetTimeStamp(h)), "function" == typeof c.setDecryptData && c.setDecryptData(e), c.append(t, n, l, d);
      }, t;
    }();e.a = tt;
  }, function (t, e, r) {
    "use strict";
    function i(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function a(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function n(t, e) {
      var r = jt[e];return !!r && !0 === r[t.slice(0, 4)];
    }function o(t, e) {
      return MediaSource.isTypeSupported((e || "video") + '/mp4;codecs="' + t + '"');
    }function s(t, e) {
      if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !e || "object" != (typeof e === "undefined" ? "undefined" : _typeof(e)) && "function" != typeof e ? t : e;
    }function l(t, e) {
      if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + (typeof e === "undefined" ? "undefined" : _typeof(e)));t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
    }function u(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function d(t, e) {
      if (!t) return null;for (var r = null, i = 0; i < t.length; i++) {
        var a = t[i];a.id === e && (r = a);
      }return r;
    }function h(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function c(t, e) {
      if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !e || "object" != (typeof e === "undefined" ? "undefined" : _typeof(e)) && "function" != typeof e ? t : e;
    }function f(t, e) {
      if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + (typeof e === "undefined" ? "undefined" : _typeof(e)));t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
    }function p(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function g(t, e) {
      if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !e || "object" != (typeof e === "undefined" ? "undefined" : _typeof(e)) && "function" != typeof e ? t : e;
    }function v(t, e) {
      if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + (typeof e === "undefined" ? "undefined" : _typeof(e)));t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
    }function y() {
      if ("undefined" != typeof window) return window.MediaSource || window.WebKitMediaSource;
    }function m(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function b(t, e, r) {
      var i = t[e],
          a = t[r],
          n = a.startPTS;isNaN(n) ? a.start = r > e ? i.start + i.duration : Math.max(i.start - a.duration, 0) : r > e ? (i.duration = n - i.start, i.duration < 0 && Pt.b.warn("negative duration computed for frag " + i.sn + ",level " + i.level + ", there should be some duration drift between playlist and fragment!")) : (a.duration = i.start - n, a.duration < 0 && Pt.b.warn("negative duration computed for frag " + a.sn + ",level " + a.level + ", there should be some duration drift between playlist and fragment!"));
    }function E(t, e, r, i, a, n) {
      var o = r;if (!isNaN(e.startPTS)) {
        var s = Math.abs(e.startPTS - r);isNaN(e.deltaPTS) ? e.deltaPTS = s : e.deltaPTS = Math.max(s, e.deltaPTS), o = Math.max(r, e.startPTS), r = Math.min(r, e.startPTS), i = Math.max(i, e.endPTS), a = Math.min(a, e.startDTS), n = Math.max(n, e.endDTS);
      }var l = r - e.start;e.start = e.startPTS = r, e.maxStartPTS = o, e.endPTS = i, e.startDTS = a, e.endDTS = n, e.duration = i - r;var u = e.sn;if (!t || u < t.startSN || u > t.endSN) return 0;var d, h, c;for (d = u - t.startSN, h = t.fragments, h[d] = e, c = d; c > 0; c--) {
        b(h, c, c - 1);
      }for (c = d; c < h.length - 1; c++) {
        b(h, c, c + 1);
      }return t.PTSKnown = !0, l;
    }function T(t, e) {
      var r,
          i = Math.max(t.startSN, e.startSN) - e.startSN,
          a = Math.min(t.endSN, e.endSN) - e.startSN,
          n = e.startSN - t.startSN,
          o = t.fragments,
          s = e.fragments,
          l = 0;if (a < i) return void (e.PTSKnown = !1);for (var u = i; u <= a; u++) {
        var d = o[n + u],
            h = s[u];h && d && (l = d.cc - h.cc, isNaN(d.startPTS) || (h.start = h.startPTS = d.startPTS, h.endPTS = d.endPTS, h.duration = d.duration, h.backtracked = d.backtracked, h.dropped = d.dropped, r = h));
      }if (l) for (Pt.b.log("discontinuity sliding from playlist, take drift into account"), u = 0; u < s.length; u++) {
        s[u].cc += l;
      }if (r) E(e, r, r.startPTS, r.endPTS, r.startDTS, r.endDTS);else if (n >= 0 && n < o.length) {
        var c = o[n].start;for (u = 0; u < s.length; u++) {
          s[u].start += c;
        }
      }e.PTSKnown = t.PTSKnown;
    }function R(t, e) {
      for (var r = null, i = 0; i < t.length; i += 1) {
        var a = t[i];if (a && a.cc === e) {
          r = a;break;
        }
      }return r;
    }function A(t, e) {
      return re.search(t, function (t) {
        return t.cc < e ? 1 : t.cc > e ? -1 : 0;
      });
    }function S(t, e, r) {
      var i = !1;return e && e.details && r && (r.endCC > r.startCC || t && t.cc < r.startCC) && (i = !0), i;
    }function L(t, e) {
      var r = t.fragments,
          i = e.fragments;if (!i.length || !r.length) return void Pt.b.log("No fragments to align");var a = R(r, i[0].cc);return !a || a && !a.startPTS ? void Pt.b.log("No frag in previous level to align on") : a;
    }function _(t, e) {
      e.fragments.forEach(function (e) {
        if (e) {
          var r = e.start + t;e.start = e.startPTS = r, e.endPTS = r + e.duration;
        }
      }), e.PTSKnown = !0;
    }function w(t, e, r) {
      if (S(t, e, r)) {
        var i = L(e.details, r);i && (Pt.b.log("Adjusting PTS using last level due to CC increase within current level"), _(i.start, r));
      }if (!1 === r.PTSKnown && e && e.details) {
        var a = e.details.programDateTime,
            n = r.programDateTime,
            o = (n - a) / 1e3 + e.details.fragments[0].start;isNaN(o) || (Pt.b.log("adjusting PTS using programDateTime delta, sliding:" + o.toFixed(3)), _(o, r));
      }
    }function D(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function I(t, e) {
      if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !e || "object" != (typeof e === "undefined" ? "undefined" : _typeof(e)) && "function" != typeof e ? t : e;
    }function k(t, e) {
      if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + (typeof e === "undefined" ? "undefined" : _typeof(e)));t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
    }function O(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function C(t, e) {
      if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !e || "object" != (typeof e === "undefined" ? "undefined" : _typeof(e)) && "function" != typeof e ? t : e;
    }function P(t, e) {
      if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + (typeof e === "undefined" ? "undefined" : _typeof(e)));t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
    }function x(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function F(t, e) {
      if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !e || "object" != (typeof e === "undefined" ? "undefined" : _typeof(e)) && "function" != typeof e ? t : e;
    }function N(t, e) {
      if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + (typeof e === "undefined" ? "undefined" : _typeof(e)));t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
    }function M() {
      var t = y(),
          e = window.SourceBuffer || window.WebKitSourceBuffer,
          r = t && "function" == typeof t.isTypeSupported && t.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"'),
          i = !e || e.prototype && "function" == typeof e.prototype.appendBuffer && "function" == typeof e.prototype.remove;return !!r && !!i;
    }function U(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function B(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function G(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function j(t, e) {
      if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !e || "object" != (typeof e === "undefined" ? "undefined" : _typeof(e)) && "function" != typeof e ? t : e;
    }function H(t, e) {
      if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + (typeof e === "undefined" ? "undefined" : _typeof(e)));t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
    }function K(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function W(t, e) {
      if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !e || "object" != (typeof e === "undefined" ? "undefined" : _typeof(e)) && "function" != typeof e ? t : e;
    }function V(t, e) {
      if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + (typeof e === "undefined" ? "undefined" : _typeof(e)));t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
    }function Y(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function z(t, e) {
      if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !e || "object" != (typeof e === "undefined" ? "undefined" : _typeof(e)) && "function" != typeof e ? t : e;
    }function X(t, e) {
      if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + (typeof e === "undefined" ? "undefined" : _typeof(e)));t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
    }function q(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function Q(t, e) {
      if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !e || "object" != (typeof e === "undefined" ? "undefined" : _typeof(e)) && "function" != typeof e ? t : e;
    }function J(t, e) {
      if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + (typeof e === "undefined" ? "undefined" : _typeof(e)));t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
    }function $(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function Z(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function tt(t, e) {
      if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !e || "object" != (typeof e === "undefined" ? "undefined" : _typeof(e)) && "function" != typeof e ? t : e;
    }function et(t, e) {
      if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + (typeof e === "undefined" ? "undefined" : _typeof(e)));t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
    }function rt(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function it(t, e) {
      if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !e || "object" != (typeof e === "undefined" ? "undefined" : _typeof(e)) && "function" != typeof e ? t : e;
    }function at(t, e) {
      if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + (typeof e === "undefined" ? "undefined" : _typeof(e)));t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
    }function nt() {
      this.window = window, this.state = "INITIAL", this.buffer = "", this.decoder = new Qe(), this.regionList = [];
    }function ot(t) {
      function e(t, e, r, i) {
        return 3600 * (0 | t) + 60 * (0 | e) + (0 | r) + (0 | i) / 1e3;
      }var r = t.match(/^(\d+):(\d{2})(:\d{2})?\.(\d{3})/);return r ? r[3] ? e(r[1], r[2], r[3].replace(":", ""), r[4]) : r[1] > 59 ? e(r[1], r[2], 0, r[4]) : e(0, r[1], r[2], r[4]) : null;
    }function st() {
      this.values = Object.create(null);
    }function lt(t, e, r, i) {
      var a = i ? t.split(i) : [t];for (var n in a) {
        if ("string" == typeof a[n]) {
          var o = a[n].split(r);if (2 === o.length) {
            var s = o[0],
                l = o[1];e(s, l);
          }
        }
      }
    }function ut(t, e, r) {
      function i() {
        var e = ot(t);if (null === e) throw new Error("Malformed timestamp: " + n);return t = t.replace(/^[^\sa-zA-Z-]+/, ""), e;
      }function a() {
        t = t.replace(/^\s+/, "");
      }var n = t;if (a(), e.startTime = i(), a(), "--\x3e" !== t.substr(0, 3)) throw new Error("Malformed time stamp (time stamps must be separated by '--\x3e'): " + n);t = t.substr(3), a(), e.endTime = i(), a(), function (t, e) {
        var i = new st();lt(t, function (t, e) {
          switch (t) {case "region":
              for (var a = r.length - 1; a >= 0; a--) {
                if (r[a].id === e) {
                  i.set(t, r[a].region);break;
                }
              }break;case "vertical":
              i.alt(t, e, ["rl", "lr"]);break;case "line":
              var n = e.split(","),
                  o = n[0];i.integer(t, o), i.percent(t, o) && i.set("snapToLines", !1), i.alt(t, o, ["auto"]), 2 === n.length && i.alt("lineAlign", n[1], ["start", $e, "end"]);break;case "position":
              n = e.split(","), i.percent(t, n[0]), 2 === n.length && i.alt("positionAlign", n[1], ["start", $e, "end", "line-left", "line-right", "auto"]);break;case "size":
              i.percent(t, e);break;case "align":
              i.alt(t, e, ["start", $e, "end", "left", "right"]);}
        }, /:/, /\s/), e.region = i.get("region", null), e.vertical = i.get("vertical", "");var a = i.get("line", "auto");"auto" === a && -1 === Je.line && (a = -1), e.line = a, e.lineAlign = i.get("lineAlign", "start"), e.snapToLines = i.get("snapToLines", !0), e.size = i.get("size", 100), e.align = i.get("align", $e);var n = i.get("position", "auto");"auto" === n && 50 === Je.position && (n = "start" === e.align || "left" === e.align ? 0 : "end" === e.align || "right" === e.align ? 100 : 50), e.position = n;
      }(t, e);
    }function dt(t) {
      return t.replace(/<br(?: \/)?>/gi, "\n");
    }function ht(t, e, r, i) {
      for (var a, n, o, s, l, u = window.VTTCue || window.TextTrackCue, d = 0; d < i.rows.length; d++) {
        if (a = i.rows[d], o = !0, s = 0, l = "", !a.isEmpty()) {
          for (var h = 0; h < a.chars.length; h++) {
            a.chars[h].uchar.match(/\s/) && o ? s++ : (l += a.chars[h].uchar, o = !1);
          }a.cueStartTime = e, e === r && (r += 1e-4), n = new u(e, r, dt(l.trim())), s >= 16 ? s-- : s++, navigator.userAgent.match(/Firefox\//) ? n.line = d + 1 : n.line = d > 7 ? d - 2 : d + 1, n.align = "left", n.position = Math.max(0, Math.min(100, s / 32 * 100 + (navigator.userAgent.match(/Firefox\//) ? 50 : 0))), t.addCue(n);
        }
      }
    }function ct(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function ft(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function pt(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function gt(t, e) {
      if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !e || "object" != (typeof e === "undefined" ? "undefined" : _typeof(e)) && "function" != typeof e ? t : e;
    }function vt(t, e) {
      if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + (typeof e === "undefined" ? "undefined" : _typeof(e)));t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
    }function yt(t) {
      if (t && t.cues) for (; t.cues.length > 0;) {
        t.removeCue(t.cues[0]);
      }
    }function mt(t, e) {
      return t && t.label === e.name && !(t.textTrack1 || t.textTrack2);
    }function bt(t, e, r, i) {
      return Math.min(e, i) - Math.max(t, r);
    }function Et(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function Tt(t, e) {
      if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !e || "object" != (typeof e === "undefined" ? "undefined" : _typeof(e)) && "function" != typeof e ? t : e;
    }function Rt(t, e) {
      if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + (typeof e === "undefined" ? "undefined" : _typeof(e)));t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
    }function At(t) {
      for (var e = [], r = 0; r < t.length; r++) {
        "subtitles" === t[r].kind && e.push(t[r]);
      }return e;
    }function St(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }function Lt(t, e) {
      if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !e || "object" != (typeof e === "undefined" ? "undefined" : _typeof(e)) && "function" != typeof e ? t : e;
    }function _t(t, e) {
      if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + (typeof e === "undefined" ? "undefined" : _typeof(e)));t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
    }function wt(t, e) {
      if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(e, "__esModule", { value: !0 });var Dt = {};r.d(Dt, "newCue", function () {
      return ht;
    });var It = r(6),
        kt = r.n(It),
        Ot = r(1),
        Ct = r(2),
        Pt = r(0),
        xt = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
      return typeof t === "undefined" ? "undefined" : _typeof(t);
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t === "undefined" ? "undefined" : _typeof(t);
    },
        Ft = function () {
      function t(e) {
        i(this, t), this.hls = e, this.onEvent = this.onEvent.bind(this);for (var r = arguments.length, a = Array(r > 1 ? r - 1 : 0), n = 1; n < r; n++) {
          a[n - 1] = arguments[n];
        }this.handledEvents = a, this.useGenericHandler = !0, this.registerListeners();
      }return t.prototype.destroy = function () {
        this.unregisterListeners();
      }, t.prototype.isEventHandler = function () {
        return "object" === xt(this.handledEvents) && this.handledEvents.length && "function" == typeof this.onEvent;
      }, t.prototype.registerListeners = function () {
        this.isEventHandler() && this.handledEvents.forEach(function (t) {
          if ("hlsEventGeneric" === t) throw new Error("Forbidden event name: " + t);this.hls.on(t, this.onEvent);
        }, this);
      }, t.prototype.unregisterListeners = function () {
        this.isEventHandler() && this.handledEvents.forEach(function (t) {
          this.hls.off(t, this.onEvent);
        }, this);
      }, t.prototype.onEvent = function (t, e) {
        this.onEventGeneric(t, e);
      }, t.prototype.onEventGeneric = function (t, e) {
        var r = function r(t, e) {
          var r = "on" + t.replace("hls", "");if ("function" != typeof this[r]) throw new Error("Event " + t + " has no generic handler in this " + this.constructor.name + " class (tried " + r + ")");return this[r].bind(this, e);
        };try {
          r.call(this, t, e).call();
        } catch (e) {
          Pt.b.error("internal error happened while processing " + t + ":" + e.message), this.hls.trigger(Ot.a.ERROR, { type: Ct.b.OTHER_ERROR, details: Ct.a.INTERNAL_EXCEPTION, fatal: !1, event: t, err: e });
        }
      }, t;
    }(),
        Nt = Ft,
        Mt = /^(\d+)x(\d+)$/,
        Ut = /\s*(.+?)\s*=((?:\".*?\")|.*?)(?:,|$)/g,
        Bt = function () {
      function t(e) {
        a(this, t), "string" == typeof e && (e = t.parseAttrList(e));for (var r in e) {
          e.hasOwnProperty(r) && (this[r] = e[r]);
        }
      }return t.prototype.decimalInteger = function (t) {
        var e = parseInt(this[t], 10);return e > Number.MAX_SAFE_INTEGER ? 1 / 0 : e;
      }, t.prototype.hexadecimalInteger = function (t) {
        if (this[t]) {
          var e = (this[t] || "0x").slice(2);e = (1 & e.length ? "0" : "") + e;for (var r = new Uint8Array(e.length / 2), i = 0; i < e.length / 2; i++) {
            r[i] = parseInt(e.slice(2 * i, 2 * i + 2), 16);
          }return r;
        }return null;
      }, t.prototype.hexadecimalIntegerAsNumber = function (t) {
        var e = parseInt(this[t], 16);return e > Number.MAX_SAFE_INTEGER ? 1 / 0 : e;
      }, t.prototype.decimalFloatingPoint = function (t) {
        return parseFloat(this[t]);
      }, t.prototype.enumeratedString = function (t) {
        return this[t];
      }, t.prototype.decimalResolution = function (t) {
        var e = Mt.exec(this[t]);if (null !== e) return { width: parseInt(e[1], 10), height: parseInt(e[2], 10) };
      }, t.parseAttrList = function (t) {
        var e,
            r = {};for (Ut.lastIndex = 0; null !== (e = Ut.exec(t));) {
          var i = e[2];0 === i.indexOf('"') && i.lastIndexOf('"') === i.length - 1 && (i = i.slice(1, -1)), r[e[1]] = i;
        }return r;
      }, t;
    }(),
        Gt = Bt,
        jt = { audio: { a3ds: !0, "ac-3": !0, "ac-4": !0, alac: !0, alaw: !0, dra1: !0, "dts+": !0, "dts-": !0, dtsc: !0, dtse: !0, dtsh: !0, "ec-3": !0, enca: !0, g719: !0, g726: !0, m4ae: !0, mha1: !0, mha2: !0, mhm1: !0, mhm2: !0, mlpa: !0, mp4a: !0, "raw ": !0, Opus: !0, samr: !0, sawb: !0, sawp: !0, sevc: !0, sqcp: !0, ssmv: !0, twos: !0, ulaw: !0 }, video: { avc1: !0, avc2: !0, avc3: !0, avc4: !0, avcp: !0, drac: !0, dvav: !0, dvhe: !0, encv: !0, hev1: !0, hvc1: !0, mjp2: !0, mp4v: !0, mvc1: !0, mvc2: !0, mvc3: !0, mvc4: !0, resv: !0, rv60: !0, s263: !0, svc1: !0, svc2: !0, "vc-1": !0, vp08: !0, vp09: !0 } },
        Ht = function () {
      function t(t, e) {
        for (var r = 0; r < e.length; r++) {
          var i = e[r];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i);
        }
      }return function (e, r, i) {
        return r && t(e.prototype, r), i && t(e, i), e;
      };
    }(),
        Kt = /#EXT-X-STREAM-INF:([^\n\r]*)[\r\n]+([^\r\n]+)/g,
        Wt = /#EXT-X-MEDIA:(.*)/g,
        Vt = new RegExp([/#EXTINF:\s*(\d*(?:\.\d+)?)(?:,(.*)\s+)?/.source, /|(?!#)(\S+)/.source, /|#EXT-X-BYTERANGE:*(.+)/.source, /|#EXT-X-PROGRAM-DATE-TIME:(.+)/.source, /|#.*/.source].join(""), "g"),
        Yt = /(?:(?:#(EXTM3U))|(?:#EXT-X-(PLAYLIST-TYPE):(.+))|(?:#EXT-X-(MEDIA-SEQUENCE): *(\d+))|(?:#EXT-X-(TARGETDURATION): *(\d+))|(?:#EXT-X-(KEY):(.+))|(?:#EXT-X-(START):(.+))|(?:#EXT-X-(ENDLIST))|(?:#EXT-X-(DISCONTINUITY-SEQ)UENCE:(\d+))|(?:#EXT-X-(DIS)CONTINUITY))|(?:#EXT-X-(VERSION):(\d+))|(?:#EXT-X-(MAP):(.+))|(?:(#)(.*):(.*))|(?:(#)(.*))(?:.*)\r?\n?/,
        zt = function () {
      function t() {
        u(this, t), this.method = null, this.key = null, this.iv = null, this._uri = null;
      }return Ht(t, [{ key: "uri", get: function get() {
          return !this._uri && this.reluri && (this._uri = kt.a.buildAbsoluteURL(this.baseuri, this.reluri, { alwaysNormalize: !0 })), this._uri;
        } }]), t;
    }(),
        Xt = function () {
      function t() {
        u(this, t), this._url = null, this._byteRange = null, this._decryptdata = null, this.tagList = [];
      }return t.prototype.createInitializationVector = function (t) {
        for (var e = new Uint8Array(16), r = 12; r < 16; r++) {
          e[r] = t >> 8 * (15 - r) & 255;
        }return e;
      }, t.prototype.fragmentDecryptdataFromLevelkey = function (t, e) {
        var r = t;return t && t.method && t.uri && !t.iv && (r = new zt(), r.method = t.method, r.baseuri = t.baseuri, r.reluri = t.reluri, r.iv = this.createInitializationVector(e)), r;
      }, t.prototype.cloneObj = function (t) {
        return JSON.parse(JSON.stringify(t));
      }, Ht(t, [{ key: "url", get: function get() {
          return !this._url && this.relurl && (this._url = kt.a.buildAbsoluteURL(this.baseurl, this.relurl, { alwaysNormalize: !0 })), this._url;
        }, set: function set(t) {
          this._url = t;
        } }, { key: "programDateTime", get: function get() {
          return !this._programDateTime && this.rawProgramDateTime && (this._programDateTime = new Date(Date.parse(this.rawProgramDateTime))), this._programDateTime;
        } }, { key: "byteRange", get: function get() {
          if (!this._byteRange) {
            var t = this._byteRange = [];if (this.rawByteRange) {
              var e = this.rawByteRange.split("@", 2);if (1 === e.length) {
                var r = this.lastByteRangeEndOffset;t[0] = r || 0;
              } else t[0] = parseInt(e[1]);t[1] = parseInt(e[0]) + t[0];
            }
          }return this._byteRange;
        } }, { key: "byteRangeStartOffset", get: function get() {
          return this.byteRange[0];
        } }, { key: "byteRangeEndOffset", get: function get() {
          return this.byteRange[1];
        } }, { key: "decryptdata", get: function get() {
          return this._decryptdata || (this._decryptdata = this.fragmentDecryptdataFromLevelkey(this.levelkey, this.sn)), this._decryptdata;
        } }]), t;
    }(),
        qt = function (t) {
      function e(r) {
        u(this, e);var i = s(this, t.call(this, r, Ot.a.MANIFEST_LOADING, Ot.a.LEVEL_LOADING, Ot.a.AUDIO_TRACK_LOADING, Ot.a.SUBTITLE_TRACK_LOADING));return i.loaders = {}, i;
      }return l(e, t), e.prototype.destroy = function () {
        for (var t in this.loaders) {
          var e = this.loaders[t];e && e.destroy();
        }this.loaders = {}, Nt.prototype.destroy.call(this);
      }, e.prototype.onManifestLoading = function (t) {
        this.load(t.url, { type: "manifest" });
      }, e.prototype.onLevelLoading = function (t) {
        this.load(t.url, { type: "level", level: t.level, id: t.id });
      }, e.prototype.onAudioTrackLoading = function (t) {
        this.load(t.url, { type: "audioTrack", id: t.id });
      }, e.prototype.onSubtitleTrackLoading = function (t) {
        this.load(t.url, { type: "subtitleTrack", id: t.id });
      }, e.prototype.load = function (t, e) {
        var r = this.loaders[e.type];if (void 0 !== r) {
          var i = r.context;if (i && i.url === t) return void Pt.b.trace("playlist request ongoing");Pt.b.warn("abort previous loader for type:" + e.type), r.abort();
        }var a = this.hls.config,
            n = void 0,
            o = void 0,
            s = void 0,
            l = void 0;"manifest" === e.type ? (n = a.manifestLoadingMaxRetry, o = a.manifestLoadingTimeOut, s = a.manifestLoadingRetryDelay, l = a.manifestLoadingMaxRetryTimeout) : "level" === e.type ? (n = 0, o = a.levelLoadingTimeOut) : (n = a.levelLoadingMaxRetry, o = a.levelLoadingTimeOut, s = a.levelLoadingRetryDelay, l = a.levelLoadingMaxRetryTimeout, Pt.b.log("loading playlist for " + e.type + " " + (e.level || e.id))), r = this.loaders[e.type] = e.loader = void 0 !== a.pLoader ? new a.pLoader(a) : new a.loader(a), e.url = t, e.responseType = "";var u = void 0,
            d = void 0;u = { timeout: o, maxRetry: n, retryDelay: s, maxRetryDelay: l }, d = { onSuccess: this.loadsuccess.bind(this), onError: this.loaderror.bind(this), onTimeout: this.loadtimeout.bind(this) }, r.load(e, u, d);
      }, e.prototype.resolve = function (t, e) {
        return kt.a.buildAbsoluteURL(e, t, { alwaysNormalize: !0 });
      }, e.prototype.parseMasterPlaylist = function (t, e) {
        var r = [],
            i = void 0;for (Kt.lastIndex = 0; null != (i = Kt.exec(t));) {
          var a = {},
              o = a.attrs = new Gt(i[1]);a.url = this.resolve(i[2], e);var s = o.decimalResolution("RESOLUTION");s && (a.width = s.width, a.height = s.height), a.bitrate = o.decimalInteger("AVERAGE-BANDWIDTH") || o.decimalInteger("BANDWIDTH"), a.name = o.NAME, function (t, e) {
            ["video", "audio"].forEach(function (r) {
              var i = t.filter(function (t) {
                return n(t, r);
              });if (i.length) {
                var a = i.filter(function (t) {
                  return 0 === t.lastIndexOf("avc1", 0) || 0 === t.lastIndexOf("mp4a", 0);
                });e[r + "Codec"] = a.length > 0 ? a[0] : i[0], t = t.filter(function (t) {
                  return -1 === i.indexOf(t);
                });
              }
            }), e.unknownCodecs = t;
          }([].concat((o.CODECS || "").split(/[ ,]+/)), a), a.videoCodec && -1 !== a.videoCodec.indexOf("avc1") && (a.videoCodec = this.avc1toavcoti(a.videoCodec)), r.push(a);
        }return r;
      }, e.prototype.parseMasterPlaylistMedia = function (t, e, r) {
        var i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : [],
            a = void 0,
            n = [],
            o = 0;for (Wt.lastIndex = 0; null !== (a = Wt.exec(t));) {
          var s = {},
              l = new Gt(a[1]);if (l.TYPE === r) {
            if (s.groupId = l["GROUP-ID"], s.name = l.NAME, s.type = r, s.default = "YES" === l.DEFAULT, s.autoselect = "YES" === l.AUTOSELECT, s.forced = "YES" === l.FORCED, l.URI && (s.url = this.resolve(l.URI, e)), s.lang = l.LANGUAGE, s.name || (s.name = s.lang), i.length) {
              var u = d(i, s.groupId);s.audioCodec = u ? u.codec : i[0].codec;
            }s.id = o++, n.push(s);
          }
        }return n;
      }, e.prototype.avc1toavcoti = function (t) {
        var e,
            r = t.split(".");return r.length > 2 ? (e = r.shift() + ".", e += parseInt(r.shift()).toString(16), e += ("000" + parseInt(r.shift()).toString(16)).substr(-4)) : e = t, e;
      }, e.prototype.parseLevelPlaylist = function (t, e, r, i) {
        var a,
            n,
            o = 0,
            s = 0,
            l = { type: null, version: null, url: e, fragments: [], live: !0, startSN: 0 },
            u = new zt(),
            d = 0,
            h = null,
            c = new Xt();for (Vt.lastIndex = 0; null !== (a = Vt.exec(t));) {
          var f = a[1];if (f) {
            c.duration = parseFloat(f);var p = (" " + a[2]).slice(1);c.title = p || null, c.tagList.push(p ? ["INF", f, p] : ["INF", f]);
          } else if (a[3]) {
            if (!isNaN(c.duration)) {
              var g = o++;c.type = i, c.start = s, c.levelkey = u, c.sn = g, c.level = r, c.cc = d, c.baseurl = e, c.relurl = (" " + a[3]).slice(1), l.fragments.push(c), h = c, s += c.duration, c = new Xt();
            }
          } else if (a[4]) {
            if (c.rawByteRange = (" " + a[4]).slice(1), h) {
              var v = h.byteRangeEndOffset;v && (c.lastByteRangeEndOffset = v);
            }
          } else if (a[5]) c.rawProgramDateTime = (" " + a[5]).slice(1), c.tagList.push(["PROGRAM-DATE-TIME", c.rawProgramDateTime]), void 0 === l.programDateTime && (l.programDateTime = new Date(new Date(Date.parse(a[5])) - 1e3 * s));else {
            for (a = a[0].match(Yt), n = 1; n < a.length && void 0 === a[n]; n++) {}var y = (" " + a[n + 1]).slice(1),
                m = (" " + a[n + 2]).slice(1);switch (a[n]) {case "#":
                c.tagList.push(m ? [y, m] : [y]);break;case "PLAYLIST-TYPE":
                l.type = y.toUpperCase();break;case "MEDIA-SEQUENCE":
                o = l.startSN = parseInt(y);break;case "TARGETDURATION":
                l.targetduration = parseFloat(y);break;case "VERSION":
                l.version = parseInt(y);break;case "EXTM3U":
                break;case "ENDLIST":
                l.live = !1;break;case "DIS":
                d++, c.tagList.push(["DIS"]);break;case "DISCONTINUITY-SEQ":
                d = parseInt(y);break;case "KEY":
                var b = y,
                    E = new Gt(b),
                    T = E.enumeratedString("METHOD"),
                    R = E.URI,
                    A = E.hexadecimalInteger("IV");T && (u = new zt(), R && ["AES-128", "SAMPLE-AES"].indexOf(T) >= 0 && (u.method = T, u.baseuri = e, u.reluri = R, u.key = null, u.iv = A));break;case "START":
                var S = y,
                    L = new Gt(S),
                    _ = L.decimalFloatingPoint("TIME-OFFSET");isNaN(_) || (l.startTimeOffset = _);break;case "MAP":
                var w = new Gt(y);c.relurl = w.URI, c.rawByteRange = w.BYTERANGE, c.baseurl = e, c.level = r, c.type = i, c.sn = "initSegment", l.initSegment = c, c = new Xt();break;default:
                Pt.b.warn("line parsed but not handled: " + a);}
          }
        }return c = h, c && !c.relurl && (l.fragments.pop(), s -= c.duration), l.totalduration = s, l.averagetargetduration = s / l.fragments.length, l.endSN = o - 1, l.startCC = l.fragments[0] ? l.fragments[0].cc : 0, l.endCC = d, l;
      }, e.prototype.loadsuccess = function (t, e, r) {
        var i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null,
            a = t.data,
            n = t.url,
            o = r.type,
            s = r.id,
            l = r.level,
            u = this.hls;if (this.loaders[o] = void 0, void 0 !== n && 0 !== n.indexOf("data:") || (n = r.url), e.tload = performance.now(), 0 === a.indexOf("#EXTM3U")) {
          if (a.indexOf("#EXTINF:") > 0) {
            var d = "audioTrack" !== o && "subtitleTrack" !== o,
                h = isNaN(l) ? isNaN(s) ? 0 : s : l,
                c = this.parseLevelPlaylist(a, n, h, "audioTrack" === o ? "audio" : "subtitleTrack" === o ? "subtitle" : "main");c.tload = e.tload, "manifest" === o && u.trigger(Ot.a.MANIFEST_LOADED, { levels: [{ url: n, details: c }], audioTracks: [], url: n, stats: e, networkDetails: i }), e.tparsed = performance.now(), c.targetduration ? d ? u.trigger(Ot.a.LEVEL_LOADED, { details: c, level: l || 0, id: s || 0, stats: e, networkDetails: i }) : "audioTrack" === o ? u.trigger(Ot.a.AUDIO_TRACK_LOADED, { details: c, id: s, stats: e, networkDetails: i }) : "subtitleTrack" === o && u.trigger(Ot.a.SUBTITLE_TRACK_LOADED, { details: c, id: s, stats: e, networkDetails: i }) : u.trigger(Ot.a.ERROR, { type: Ct.b.NETWORK_ERROR, details: Ct.a.MANIFEST_PARSING_ERROR, fatal: !0, url: n, reason: "invalid targetduration", networkDetails: i });
          } else {
            var f = this.parseMasterPlaylist(a, n);if (f.length) {
              var p = f.map(function (t) {
                return { id: t.attrs.AUDIO, codec: t.audioCodec };
              }),
                  g = this.parseMasterPlaylistMedia(a, n, "AUDIO", p),
                  v = this.parseMasterPlaylistMedia(a, n, "SUBTITLES");if (g.length) {
                var y = !1;g.forEach(function (t) {
                  t.url || (y = !0);
                }), !1 === y && f[0].audioCodec && !f[0].attrs.AUDIO && (Pt.b.log("audio codec signaled in quality level, but no embedded audio track signaled, create one"), g.unshift({ type: "main", name: "main" }));
              }u.trigger(Ot.a.MANIFEST_LOADED, { levels: f, audioTracks: g, subtitles: v, url: n, stats: e, networkDetails: i });
            } else u.trigger(Ot.a.ERROR, { type: Ct.b.NETWORK_ERROR, details: Ct.a.MANIFEST_PARSING_ERROR, fatal: !0, url: n, reason: "no level found in manifest", networkDetails: i });
          }
        } else u.trigger(Ot.a.ERROR, { type: Ct.b.NETWORK_ERROR, details: Ct.a.MANIFEST_PARSING_ERROR, fatal: !0, url: n, reason: "no EXTM3U delimiter", networkDetails: i });
      }, e.prototype.loaderror = function (t, e) {
        var r,
            i,
            a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
            n = e.loader;switch (e.type) {case "manifest":
            r = Ct.a.MANIFEST_LOAD_ERROR, i = !0;break;case "level":
            r = Ct.a.LEVEL_LOAD_ERROR, i = !1;break;case "audioTrack":
            r = Ct.a.AUDIO_TRACK_LOAD_ERROR, i = !1;}n && (n.abort(), this.loaders[e.type] = void 0), this.hls.trigger(Ot.a.ERROR, { type: Ct.b.NETWORK_ERROR, details: r, fatal: i, url: n.url, loader: n, response: t, context: e, networkDetails: a });
      }, e.prototype.loadtimeout = function (t, e) {
        var r,
            i,
            a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
            n = e.loader;switch (e.type) {case "manifest":
            r = Ct.a.MANIFEST_LOAD_TIMEOUT, i = !0;break;case "level":
            r = Ct.a.LEVEL_LOAD_TIMEOUT, i = !1;break;case "audioTrack":
            r = Ct.a.AUDIO_TRACK_LOAD_TIMEOUT, i = !1;}n && (n.abort(), this.loaders[e.type] = void 0), this.hls.trigger(Ot.a.ERROR, { type: Ct.b.NETWORK_ERROR, details: r, fatal: i, url: n.url, loader: n, context: e, networkDetails: a });
      }, e;
    }(Nt),
        Qt = qt,
        Jt = function (t) {
      function e(r) {
        h(this, e);var i = c(this, t.call(this, r, Ot.a.FRAG_LOADING));return i.loaders = {}, i;
      }return f(e, t), e.prototype.destroy = function () {
        var t = this.loaders;for (var e in t) {
          var r = t[e];r && r.destroy();
        }this.loaders = {}, Nt.prototype.destroy.call(this);
      }, e.prototype.onFragLoading = function (t) {
        var e = t.frag,
            r = e.type,
            i = this.loaders[r],
            a = this.hls.config;e.loaded = 0, i && (Pt.b.warn("abort previous fragment loader for type:" + r), i.abort()), i = this.loaders[r] = e.loader = void 0 !== a.fLoader ? new a.fLoader(a) : new a.loader(a);var n = void 0,
            o = void 0,
            s = void 0;n = { url: e.url, frag: e, responseType: "arraybuffer", progressData: !1 };var l = e.byteRangeStartOffset,
            u = e.byteRangeEndOffset;isNaN(l) || isNaN(u) || (n.rangeStart = l, n.rangeEnd = u), o = { timeout: a.fragLoadingTimeOut, maxRetry: 0, retryDelay: 0, maxRetryDelay: a.fragLoadingMaxRetryTimeout }, s = { onSuccess: this.loadsuccess.bind(this), onError: this.loaderror.bind(this), onTimeout: this.loadtimeout.bind(this), onProgress: this.loadprogress.bind(this) }, i.load(n, o, s);
      }, e.prototype.loadsuccess = function (t, e, r) {
        var i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null,
            a = t.data,
            n = r.frag;n.loader = void 0, this.loaders[n.type] = void 0, this.hls.trigger(Ot.a.FRAG_LOADED, { payload: a, frag: n, stats: e, networkDetails: i });
      }, e.prototype.loaderror = function (t, e) {
        var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
            i = e.loader;i && i.abort(), this.loaders[e.type] = void 0, this.hls.trigger(Ot.a.ERROR, { type: Ct.b.NETWORK_ERROR, details: Ct.a.FRAG_LOAD_ERROR, fatal: !1, frag: e.frag, response: t, networkDetails: r });
      }, e.prototype.loadtimeout = function (t, e) {
        var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
            i = e.loader;i && i.abort(), this.loaders[e.type] = void 0, this.hls.trigger(Ot.a.ERROR, { type: Ct.b.NETWORK_ERROR, details: Ct.a.FRAG_LOAD_TIMEOUT, fatal: !1, frag: e.frag, networkDetails: r });
      }, e.prototype.loadprogress = function (t, e, r) {
        var i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null,
            a = e.frag;a.loaded = t.loaded, this.hls.trigger(Ot.a.FRAG_LOAD_PROGRESS, { frag: a, stats: t, networkDetails: i });
      }, e;
    }(Nt),
        $t = Jt,
        Zt = function (t) {
      function e(r) {
        p(this, e);var i = g(this, t.call(this, r, Ot.a.KEY_LOADING));return i.loaders = {}, i.decryptkey = null, i.decrypturl = null, i;
      }return v(e, t), e.prototype.destroy = function () {
        for (var t in this.loaders) {
          var e = this.loaders[t];e && e.destroy();
        }this.loaders = {}, Nt.prototype.destroy.call(this);
      }, e.prototype.onKeyLoading = function (t) {
        var e = t.frag,
            r = e.type,
            i = this.loaders[r],
            a = e.decryptdata,
            n = a.uri;if (n !== this.decrypturl || null === this.decryptkey) {
          var o = this.hls.config;i && (Pt.b.warn("abort previous key loader for type:" + r), i.abort()), e.loader = this.loaders[r] = new o.loader(o), this.decrypturl = n, this.decryptkey = null;var s = void 0,
              l = void 0,
              u = void 0;s = { url: n, frag: e, responseType: "arraybuffer" }, l = { timeout: o.fragLoadingTimeOut, maxRetry: o.fragLoadingMaxRetry, retryDelay: o.fragLoadingRetryDelay, maxRetryDelay: o.fragLoadingMaxRetryTimeout }, u = { onSuccess: this.loadsuccess.bind(this), onError: this.loaderror.bind(this), onTimeout: this.loadtimeout.bind(this) }, e.loader.load(s, l, u);
        } else this.decryptkey && (a.key = this.decryptkey, this.hls.trigger(Ot.a.KEY_LOADED, { frag: e }));
      }, e.prototype.loadsuccess = function (t, e, r) {
        var i = r.frag;this.decryptkey = i.decryptdata.key = new Uint8Array(t.data), i.loader = void 0, this.loaders[i.type] = void 0, this.hls.trigger(Ot.a.KEY_LOADED, { frag: i });
      }, e.prototype.loaderror = function (t, e) {
        var r = e.frag,
            i = r.loader;i && i.abort(), this.loaders[e.type] = void 0, this.hls.trigger(Ot.a.ERROR, { type: Ct.b.NETWORK_ERROR, details: Ct.a.KEY_LOAD_ERROR, fatal: !1, frag: r, response: t });
      }, e.prototype.loadtimeout = function (t, e) {
        var r = e.frag,
            i = r.loader;i && i.abort(), this.loaders[e.type] = void 0, this.hls.trigger(Ot.a.ERROR, { type: Ct.b.NETWORK_ERROR, details: Ct.a.KEY_LOAD_TIMEOUT, fatal: !1, frag: r });
      }, e;
    }(Nt),
        te = Zt,
        ee = { search: function search(t, e) {
        for (var r = 0, i = t.length - 1, a = null, n = null; r <= i;) {
          a = (r + i) / 2 | 0, n = t[a];var o = e(n);if (o > 0) r = a + 1;else {
            if (!(o < 0)) return n;i = a - 1;
          }
        }return null;
      } },
        re = ee,
        ie = { isBuffered: function isBuffered(t, e) {
        try {
          if (t) for (var r = t.buffered, i = 0; i < r.length; i++) {
            if (e >= r.start(i) && e <= r.end(i)) return !0;
          }
        } catch (t) {}return !1;
      }, bufferInfo: function bufferInfo(t, e, r) {
        try {
          if (t) {
            var i,
                a = t.buffered,
                n = [];for (i = 0; i < a.length; i++) {
              n.push({ start: a.start(i), end: a.end(i) });
            }return this.bufferedInfo(n, e, r);
          }
        } catch (t) {}return { len: 0, start: e, end: e, nextStart: void 0 };
      }, bufferedInfo: function bufferedInfo(t, e, r) {
        var i,
            a,
            n,
            o,
            s,
            l = [];for (t.sort(function (t, e) {
          var r = t.start - e.start;return r || e.end - t.end;
        }), s = 0; s < t.length; s++) {
          var u = l.length;if (u) {
            var d = l[u - 1].end;t[s].start - d < r ? t[s].end > d && (l[u - 1].end = t[s].end) : l.push(t[s]);
          } else l.push(t[s]);
        }for (s = 0, i = 0, a = n = e; s < l.length; s++) {
          var h = l[s].start,
              c = l[s].end;if (e + r >= h && e < c) a = h, n = c, i = n - e;else if (e + r < h) {
            o = h;break;
          }
        }return { len: i, start: a, end: n, nextStart: o };
      } },
        ae = ie,
        ne = r(7),
        oe = r(5),
        se = r.n(oe),
        le = r(9),
        ue = r.n(le),
        de = y(),
        he = function () {
      function t(e, r) {
        m(this, t), this.hls = e, this.id = r;var i = this.observer = new se.a(),
            a = e.config;i.trigger = function (t) {
          for (var e = arguments.length, r = Array(e > 1 ? e - 1 : 0), a = 1; a < e; a++) {
            r[a - 1] = arguments[a];
          }i.emit.apply(i, [t, t].concat(r));
        }, i.off = function (t) {
          for (var e = arguments.length, r = Array(e > 1 ? e - 1 : 0), a = 1; a < e; a++) {
            r[a - 1] = arguments[a];
          }i.removeListener.apply(i, [t].concat(r));
        };var n = function (t, r) {
          r = r || {}, r.frag = this.frag, r.id = this.id, e.trigger(t, r);
        }.bind(this);i.on(Ot.a.FRAG_DECRYPTED, n), i.on(Ot.a.FRAG_PARSING_INIT_SEGMENT, n), i.on(Ot.a.FRAG_PARSING_DATA, n), i.on(Ot.a.FRAG_PARSED, n), i.on(Ot.a.ERROR, n), i.on(Ot.a.FRAG_PARSING_METADATA, n), i.on(Ot.a.FRAG_PARSING_USERDATA, n), i.on(Ot.a.INIT_PTS_FOUND, n);var o = { mp4: de.isTypeSupported("video/mp4"), mpeg: de.isTypeSupported("audio/mpeg"), mp3: de.isTypeSupported('audio/mp4; codecs="mp3"') },
            s = navigator.vendor;if (a.enableWorker && "undefined" != typeof Worker) {
          Pt.b.log("demuxing in webworker");var l = void 0;try {
            l = this.w = ue()(10), this.onwmsg = this.onWorkerMessage.bind(this), l.addEventListener("message", this.onwmsg), l.onerror = function (t) {
              e.trigger(Ot.a.ERROR, { type: Ct.b.OTHER_ERROR, details: Ct.a.INTERNAL_EXCEPTION, fatal: !0, event: "demuxerWorker", err: { message: t.message + " (" + t.filename + ":" + t.lineno + ")" } });
            }, l.postMessage({ cmd: "init", typeSupported: o, vendor: s, id: r, config: JSON.stringify(a) });
          } catch (t) {
            Pt.b.error("error while initializing DemuxerWorker, fallback on DemuxerInline"), l && URL.revokeObjectURL(l.objectURL), this.demuxer = new ne.a(i, o, a, s), this.w = void 0;
          }
        } else this.demuxer = new ne.a(i, o, a, s);
      }return t.prototype.destroy = function () {
        var t = this.w;if (t) t.removeEventListener("message", this.onwmsg), t.terminate(), this.w = null;else {
          var e = this.demuxer;e && (e.destroy(), this.demuxer = null);
        }var r = this.observer;r && (r.removeAllListeners(), this.observer = null);
      }, t.prototype.push = function (t, e, r, i, a, n, o, s) {
        var l = this.w,
            u = isNaN(a.startDTS) ? a.start : a.startDTS,
            d = a.decryptdata,
            h = this.frag,
            c = !(h && a.cc === h.cc),
            f = !(h && a.level === h.level),
            p = h && a.sn === h.sn + 1,
            g = !f && p;if (c && Pt.b.log(this.id + ":discontinuity detected"), f && Pt.b.log(this.id + ":switch detected"), this.frag = a, l) l.postMessage({ cmd: "demux", data: t, decryptdata: d, initSegment: e, audioCodec: r, videoCodec: i, timeOffset: u, discontinuity: c, trackSwitch: f, contiguous: g, duration: n, accurateTimeOffset: o, defaultInitPTS: s }, t instanceof ArrayBuffer ? [t] : []);else {
          var v = this.demuxer;v && v.push(t, d, e, r, i, u, c, f, g, n, o, s);
        }
      }, t.prototype.onWorkerMessage = function (t) {
        var e = t.data,
            r = this.hls;switch (e.event) {case "init":
            URL.revokeObjectURL(this.w.objectURL);break;case Ot.a.FRAG_PARSING_DATA:
            e.data.data1 = new Uint8Array(e.data1), e.data2 && (e.data.data2 = new Uint8Array(e.data2));default:
            e.data = e.data || {}, e.data.frag = this.frag, e.data.id = this.id, r.trigger(e.event, e.data);}
      }, t;
    }(),
        ce = he,
        fe = { toString: function toString(t) {
        for (var e = "", r = t.length, i = 0; i < r; i++) {
          e += "[" + t.start(i).toFixed(3) + "," + t.end(i).toFixed(3) + "]";
        }return e;
      } },
        pe = fe,
        ge = function () {
      function t(t, e) {
        for (var r = 0; r < e.length; r++) {
          var i = e[r];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i);
        }
      }return function (e, r, i) {
        return r && t(e.prototype, r), i && t(e, i), e;
      };
    }(),
        ve = { STOPPED: "STOPPED", IDLE: "IDLE", KEY_LOADING: "KEY_LOADING", FRAG_LOADING: "FRAG_LOADING", FRAG_LOADING_WAITING_RETRY: "FRAG_LOADING_WAITING_RETRY", WAITING_LEVEL: "WAITING_LEVEL", PARSING: "PARSING", PARSED: "PARSED", BUFFER_FLUSHING: "BUFFER_FLUSHING", ENDED: "ENDED", ERROR: "ERROR" },
        ye = function (t) {
      function e(r) {
        D(this, e);var i = I(this, t.call(this, r, Ot.a.MEDIA_ATTACHED, Ot.a.MEDIA_DETACHING, Ot.a.MANIFEST_LOADING, Ot.a.MANIFEST_PARSED, Ot.a.LEVEL_LOADED, Ot.a.KEY_LOADED, Ot.a.FRAG_LOADED, Ot.a.FRAG_LOAD_EMERGENCY_ABORTED, Ot.a.FRAG_PARSING_INIT_SEGMENT, Ot.a.FRAG_PARSING_DATA, Ot.a.FRAG_PARSED, Ot.a.ERROR, Ot.a.AUDIO_TRACK_SWITCHING, Ot.a.AUDIO_TRACK_SWITCHED, Ot.a.BUFFER_CREATED, Ot.a.BUFFER_APPENDED, Ot.a.BUFFER_FLUSHED));return i.config = r.config, i.audioCodecSwap = !1, i.ticks = 0, i._state = ve.STOPPED, i.ontick = i.tick.bind(i), i;
      }return k(e, t), e.prototype.destroy = function () {
        this.stopLoad(), this.timer && (clearInterval(this.timer), this.timer = null), Nt.prototype.destroy.call(this), this.state = ve.STOPPED;
      }, e.prototype.startLoad = function (t) {
        if (this.levels) {
          var e = this.lastCurrentTime,
              r = this.hls;if (this.stopLoad(), this.timer || (this.timer = setInterval(this.ontick, 100)), this.level = -1, this.fragLoadError = 0, !this.startFragRequested) {
            var i = r.startLevel;-1 === i && (i = 0, this.bitrateTest = !0), this.level = r.nextLoadLevel = i, this.loadedmetadata = !1;
          }e > 0 && -1 === t && (Pt.b.log("override startPosition with lastCurrentTime @" + e.toFixed(3)), t = e), this.state = ve.IDLE, this.nextLoadPosition = this.startPosition = this.lastCurrentTime = t, this.tick();
        } else this.forceStartLoad = !0, this.state = ve.STOPPED;
      }, e.prototype.stopLoad = function () {
        var t = this.fragCurrent;t && (t.loader && t.loader.abort(), this.fragCurrent = null), this.fragPrevious = null, this.demuxer && (this.demuxer.destroy(), this.demuxer = null), this.state = ve.STOPPED, this.forceStartLoad = !1;
      }, e.prototype.tick = function () {
        1 === ++this.ticks && (this.doTick(), this.ticks > 1 && setTimeout(this.tick, 1), this.ticks = 0);
      }, e.prototype.doTick = function () {
        switch (this.state) {case ve.ERROR:
            break;case ve.BUFFER_FLUSHING:
            this.fragLoadError = 0;break;case ve.IDLE:
            this._doTickIdle();break;case ve.WAITING_LEVEL:
            var t = this.levels[this.level];t && t.details && (this.state = ve.IDLE);break;case ve.FRAG_LOADING_WAITING_RETRY:
            var e = performance.now(),
                r = this.retryDate;(!r || e >= r || this.media && this.media.seeking) && (Pt.b.log("mediaController: retryDate reached, switch back to IDLE state"), this.state = ve.IDLE);break;case ve.ERROR:case ve.STOPPED:case ve.FRAG_LOADING:case ve.PARSING:case ve.PARSED:case ve.ENDED:}this._checkBuffer(), this._checkFragmentChanged();
      }, e.prototype._doTickIdle = function () {
        var t = this.hls,
            e = t.config,
            r = this.media;if (void 0 !== this.levelLastLoaded && (r || !this.startFragRequested && e.startFragPrefetch)) {
          var i = void 0;i = this.loadedmetadata ? r.currentTime : this.nextLoadPosition;var a = t.nextLoadLevel,
              n = this.levels[a];if (n) {
            var o = n.bitrate,
                s = void 0;s = o ? Math.max(8 * e.maxBufferSize / o, e.maxBufferLength) : e.maxBufferLength, s = Math.min(s, e.maxMaxBufferLength);var l = ae.bufferInfo(this.mediaBuffer ? this.mediaBuffer : r, i, e.maxBufferHole),
                u = l.len;if (!(u >= s)) {
              Pt.b.trace("buffer length of " + u.toFixed(3) + " is below max of " + s.toFixed(3) + ". checking for more payload ..."), this.level = t.nextLoadLevel = a;var d = n.details;if (void 0 === d || !0 === d.live && this.levelLastLoaded !== a) return void (this.state = ve.WAITING_LEVEL);var h = this.fragPrevious;if (!d.live && h && !h.backtracked && h.sn === d.endSN && !l.nextStart) {
                if (Math.min(r.duration, h.start + h.duration) - Math.max(l.end, h.start) <= Math.max(.2, h.duration)) {
                  var c = {};return this.altAudio && (c.type = "video"), this.hls.trigger(Ot.a.BUFFER_EOS, c), void (this.state = ve.ENDED);
                }
              }this._fetchPayloadOrEos(i, l, d);
            }
          }
        }
      }, e.prototype._fetchPayloadOrEos = function (t, e, r) {
        var i = this.fragPrevious,
            a = this.level,
            n = r.fragments,
            o = n.length;if (0 !== o) {
          var s = n[0].start,
              l = n[o - 1].start + n[o - 1].duration,
              u = e.end,
              d = void 0;if (r.initSegment && !r.initSegment.data) d = r.initSegment;else if (r.live) {
            var h = this.config.initialLiveManifestSize;if (o < h) return void Pt.b.warn("Can not start playback of a level, reason: not enough fragments " + o + " < " + h);if (null === (d = this._ensureFragmentAtLivePoint(r, u, s, l, i, n, o))) return;
          } else u < s && (d = n[0]);d || (d = this._findFragment(s, i, o, n, u, l, r)), d && this._loadFragmentOrKey(d, a, r, t, u);
        }
      }, e.prototype._ensureFragmentAtLivePoint = function (t, e, r, i, a, n, o) {
        var s = this.hls.config,
            l = this.media,
            u = void 0,
            d = void 0 !== s.liveMaxLatencyDuration ? s.liveMaxLatencyDuration : s.liveMaxLatencyDurationCount * t.targetduration;if (e < Math.max(r - s.maxFragLookUpTolerance, i - d)) {
          var h = this.liveSyncPosition = this.computeLivePosition(r, t);Pt.b.log("buffer end: " + e.toFixed(3) + " is located too far from the end of live sliding playlist, reset currentTime to : " + h.toFixed(3)), e = h, l && l.readyState && l.duration > h && (l.currentTime = h), this.nextLoadPosition = h;
        }if (t.PTSKnown && e > i && l && l.readyState) return null;if (this.startFragRequested && !t.PTSKnown) {
          if (a) {
            var c = a.sn + 1;if (c >= t.startSN && c <= t.endSN) {
              var f = n[c - t.startSN];a.cc === f.cc && (u = f, Pt.b.log("live playlist, switching playlist, load frag with next SN: " + u.sn));
            }u || (u = re.search(n, function (t) {
              return a.cc - t.cc;
            })) && Pt.b.log("live playlist, switching playlist, load frag with same CC: " + u.sn);
          }u || (u = n[Math.min(o - 1, Math.round(o / 2))], Pt.b.log("live playlist, switching playlist, unknown, load middle frag : " + u.sn));
        }return u;
      }, e.prototype._findFragment = function (t, e, r, i, a, n, o) {
        var s = this.hls.config,
            l = void 0,
            u = void 0,
            d = s.maxFragLookUpTolerance,
            h = e ? i[e.sn - i[0].sn + 1] : void 0,
            c = function c(t) {
          var e = Math.min(d, t.duration + (t.deltaPTS ? t.deltaPTS : 0));return t.start + t.duration - e <= a ? 1 : t.start - e > a && t.start ? -1 : 0;
        };if (a < n ? (a > n - d && (d = 0), u = h && !c(h) ? h : re.search(i, c)) : u = i[r - 1], u) {
          l = u;var f = l.sn - o.startSN,
              p = e && l.level === e.level,
              g = i[f - 1],
              v = i[f + 1];if (e && l.sn === e.sn) if (p && !l.backtracked) {
            if (l.sn < o.endSN) {
              var y = e.deltaPTS;y && y > s.maxBufferHole && e.dropped && f ? (l = g, Pt.b.warn("SN just loaded, with large PTS gap between audio and video, maybe frag is not starting with a keyframe ? load previous one to try to overcome this"), e.loadCounter--) : (l = v, Pt.b.log("SN just loaded, load next one: " + l.sn));
            } else l = null;
          } else l.backtracked && (v && v.backtracked ? (Pt.b.warn("Already backtracked from fragment " + v.sn + ", will not backtrack to fragment " + l.sn + ". Loading fragment " + v.sn), l = v) : (Pt.b.warn("Loaded fragment with dropped frames, backtracking 1 segment to find a keyframe"), l.dropped = 0, g ? (g.loadCounter && g.loadCounter--, l = g, l.backtracked = !0) : f && (l = null)));
        }return l;
      }, e.prototype._loadFragmentOrKey = function (t, e, r, i, a) {
        var n = this.hls,
            o = n.config;if (!t.decryptdata || null == t.decryptdata.uri || null != t.decryptdata.key) {
          if (Pt.b.log("Loading " + t.sn + " of [" + r.startSN + " ," + r.endSN + "],level " + e + ", currentTime:" + i.toFixed(3) + ",bufferEnd:" + a.toFixed(3)), void 0 !== this.fragLoadIdx ? this.fragLoadIdx++ : this.fragLoadIdx = 0, t.loadCounter) {
            t.loadCounter++;var s = o.fragLoadingLoopThreshold;if (t.loadCounter > s && Math.abs(this.fragLoadIdx - t.loadIdx) < s) return void n.trigger(Ot.a.ERROR, { type: Ct.b.MEDIA_ERROR, details: Ct.a.FRAG_LOOP_LOADING_ERROR, fatal: !1, frag: t });
          } else t.loadCounter = 1;return t.loadIdx = this.fragLoadIdx, t.autoLevel = n.autoLevelEnabled, t.bitrateTest = this.bitrateTest, this.fragCurrent = t, this.startFragRequested = !0, isNaN(t.sn) || t.bitrateTest || (this.nextLoadPosition = t.start + t.duration), n.trigger(Ot.a.FRAG_LOADING, { frag: t }), this.demuxer || (this.demuxer = new ce(n, "main")), void (this.state = ve.FRAG_LOADING);
        }Pt.b.log("Loading key for " + t.sn + " of [" + r.startSN + " ," + r.endSN + "],level " + e), this.state = ve.KEY_LOADING, n.trigger(Ot.a.KEY_LOADING, { frag: t });
      }, e.prototype.getBufferedFrag = function (t) {
        return re.search(this._bufferedFrags, function (e) {
          return t < e.startPTS ? -1 : t > e.endPTS ? 1 : 0;
        });
      }, e.prototype.followingBufferedFrag = function (t) {
        return t ? this.getBufferedFrag(t.endPTS + .5) : null;
      }, e.prototype._checkFragmentChanged = function () {
        var t,
            e,
            r = this.media;if (r && r.readyState && !1 === r.seeking && (e = r.currentTime, e > r.playbackRate * this.lastCurrentTime && (this.lastCurrentTime = e), ae.isBuffered(r, e) ? t = this.getBufferedFrag(e) : ae.isBuffered(r, e + .1) && (t = this.getBufferedFrag(e + .1)), t)) {
          var i = t;if (i !== this.fragPlaying) {
            this.hls.trigger(Ot.a.FRAG_CHANGED, { frag: i });var a = i.level;this.fragPlaying && this.fragPlaying.level === a || this.hls.trigger(Ot.a.LEVEL_SWITCHED, { level: a }), this.fragPlaying = i;
          }
        }
      }, e.prototype.immediateLevelSwitch = function () {
        if (Pt.b.log("immediateLevelSwitch"), !this.immediateSwitch) {
          this.immediateSwitch = !0;var t = this.media,
              e = void 0;t ? (e = t.paused, t.pause()) : e = !0, this.previouslyPaused = e;
        }var r = this.fragCurrent;r && r.loader && r.loader.abort(), this.fragCurrent = null, void 0 !== this.fragLoadIdx && (this.fragLoadIdx += 2 * this.config.fragLoadingLoopThreshold), this.flushMainBuffer(0, Number.POSITIVE_INFINITY);
      }, e.prototype.immediateLevelSwitchEnd = function () {
        var t = this.media;t && t.buffered.length && (this.immediateSwitch = !1, ae.isBuffered(t, t.currentTime) && (t.currentTime -= 1e-4), this.previouslyPaused || t.play());
      }, e.prototype.nextLevelSwitch = function () {
        var t = this.media;if (t && t.readyState) {
          var e = void 0,
              r = void 0,
              i = void 0;if (void 0 !== this.fragLoadIdx && (this.fragLoadIdx += 2 * this.config.fragLoadingLoopThreshold), r = this.getBufferedFrag(t.currentTime), r && r.startPTS > 1 && this.flushMainBuffer(0, r.startPTS - 1), t.paused) e = 0;else {
            var a = this.hls.nextLoadLevel,
                n = this.levels[a],
                o = this.fragLastKbps;e = o && this.fragCurrent ? this.fragCurrent.duration * n.bitrate / (1e3 * o) + 1 : 0;
          }if ((i = this.getBufferedFrag(t.currentTime + e)) && (i = this.followingBufferedFrag(i))) {
            var s = this.fragCurrent;s && s.loader && s.loader.abort(), this.fragCurrent = null, this.flushMainBuffer(i.maxStartPTS, Number.POSITIVE_INFINITY);
          }
        }
      }, e.prototype.flushMainBuffer = function (t, e) {
        this.state = ve.BUFFER_FLUSHING;var r = { startOffset: t, endOffset: e };this.altAudio && (r.type = "video"), this.hls.trigger(Ot.a.BUFFER_FLUSHING, r);
      }, e.prototype.onMediaAttached = function (t) {
        var e = this.media = this.mediaBuffer = t.media;this.onvseeking = this.onMediaSeeking.bind(this), this.onvseeked = this.onMediaSeeked.bind(this), this.onvended = this.onMediaEnded.bind(this), e.addEventListener("seeking", this.onvseeking), e.addEventListener("seeked", this.onvseeked), e.addEventListener("ended", this.onvended);var r = this.config;this.levels && r.autoStartLoad && this.hls.startLoad(r.startPosition);
      }, e.prototype.onMediaDetaching = function () {
        var t = this.media;t && t.ended && (Pt.b.log("MSE detaching and video ended, reset startPosition"), this.startPosition = this.lastCurrentTime = 0);var e = this.levels;e && e.forEach(function (t) {
          t.details && t.details.fragments.forEach(function (t) {
            t.loadCounter = void 0, t.backtracked = void 0;
          });
        }), t && (t.removeEventListener("seeking", this.onvseeking), t.removeEventListener("seeked", this.onvseeked), t.removeEventListener("ended", this.onvended), this.onvseeking = this.onvseeked = this.onvended = null), this.media = this.mediaBuffer = null, this.loadedmetadata = !1, this.stopLoad();
      }, e.prototype.onMediaSeeking = function () {
        var t = this.media,
            e = t ? t.currentTime : void 0,
            r = this.config;isNaN(e) || Pt.b.log("media seeking to " + e.toFixed(3));var i = this.mediaBuffer ? this.mediaBuffer : t,
            a = ae.bufferInfo(i, e, this.config.maxBufferHole);if (this.state === ve.FRAG_LOADING) {
          var n = this.fragCurrent;if (0 === a.len && n) {
            var o = r.maxFragLookUpTolerance,
                s = n.start - o,
                l = n.start + n.duration + o;e < s || e > l ? (n.loader && (Pt.b.log("seeking outside of buffer while fragment load in progress, cancel fragment load"), n.loader.abort()), this.fragCurrent = null, this.fragPrevious = null, this.state = ve.IDLE) : Pt.b.log("seeking outside of buffer but within currently loaded fragment range");
          }
        } else this.state === ve.ENDED && (0 === a.len && (this.fragPrevious = 0), this.state = ve.IDLE);t && (this.lastCurrentTime = e), this.state !== ve.FRAG_LOADING && void 0 !== this.fragLoadIdx && (this.fragLoadIdx += 2 * r.fragLoadingLoopThreshold), this.loadedmetadata || (this.nextLoadPosition = this.startPosition = e), this.tick();
      }, e.prototype.onMediaSeeked = function () {
        var t = this.media,
            e = t ? t.currentTime : void 0;isNaN(e) || Pt.b.log("media seeked to " + e.toFixed(3)), this.tick();
      }, e.prototype.onMediaEnded = function () {
        Pt.b.log("media ended"), this.startPosition = this.lastCurrentTime = 0;
      }, e.prototype.onManifestLoading = function () {
        Pt.b.log("trigger BUFFER_RESET"), this.hls.trigger(Ot.a.BUFFER_RESET), this._bufferedFrags = [], this.stalled = !1, this.startPosition = this.lastCurrentTime = 0;
      }, e.prototype.onManifestParsed = function (t) {
        var e,
            r = !1,
            i = !1;t.levels.forEach(function (t) {
          (e = t.audioCodec) && (-1 !== e.indexOf("mp4a.40.2") && (r = !0), -1 !== e.indexOf("mp4a.40.5") && (i = !0));
        }), this.audioCodecSwitch = r && i, this.audioCodecSwitch && Pt.b.log("both AAC/HE-AAC audio found in levels; declaring level codec as HE-AAC"), this.levels = t.levels, this.startFragRequested = !1;var a = this.config;(a.autoStartLoad || this.forceStartLoad) && this.hls.startLoad(a.startPosition);
      }, e.prototype.onLevelLoaded = function (t) {
        var e = t.details,
            r = t.level,
            i = this.levels[this.levelLastLoaded],
            a = this.levels[r],
            n = e.totalduration,
            o = 0;if (Pt.b.log("level " + r + " loaded [" + e.startSN + "," + e.endSN + "],duration:" + n), e.live) {
          var s = a.details;s && e.fragments.length > 0 ? (T(s, e), o = e.fragments[0].start, this.liveSyncPosition = this.computeLivePosition(o, s), e.PTSKnown && !isNaN(o) ? Pt.b.log("live playlist sliding:" + o.toFixed(3)) : (Pt.b.log("live playlist - outdated PTS, unknown sliding"), w(this.fragPrevious, i, e))) : (Pt.b.log("live playlist - first load, unknown sliding"), e.PTSKnown = !1, w(this.fragPrevious, i, e));
        } else e.PTSKnown = !1;if (a.details = e, this.levelLastLoaded = r, this.hls.trigger(Ot.a.LEVEL_UPDATED, { details: e, level: r }), !1 === this.startFragRequested) {
          if (-1 === this.startPosition || -1 === this.lastCurrentTime) {
            var l = e.startTimeOffset;isNaN(l) ? e.live ? (this.startPosition = this.computeLivePosition(o, e), Pt.b.log("configure startPosition to " + this.startPosition)) : this.startPosition = 0 : (l < 0 && (Pt.b.log("negative start time offset " + l + ", count from end of last fragment"), l = o + n + l), Pt.b.log("start time offset found in playlist, adjust startPosition to " + l), this.startPosition = l), this.lastCurrentTime = this.startPosition;
          }this.nextLoadPosition = this.startPosition;
        }this.state === ve.WAITING_LEVEL && (this.state = ve.IDLE), this.tick();
      }, e.prototype.onKeyLoaded = function () {
        this.state === ve.KEY_LOADING && (this.state = ve.IDLE, this.tick());
      }, e.prototype.onFragLoaded = function (t) {
        var e = this.fragCurrent,
            r = t.frag;if (this.state === ve.FRAG_LOADING && e && "main" === r.type && r.level === e.level && r.sn === e.sn) {
          var i = t.stats,
              a = this.levels[e.level],
              n = a.details;if (Pt.b.log("Loaded  " + e.sn + " of [" + n.startSN + " ," + n.endSN + "],level " + e.level), this.bitrateTest = !1, this.stats = i, !0 === r.bitrateTest && this.hls.nextLoadLevel) this.state = ve.IDLE, this.startFragRequested = !1, i.tparsed = i.tbuffered = performance.now(), this.hls.trigger(Ot.a.FRAG_BUFFERED, { stats: i, frag: e, id: "main" }), this.tick();else if ("initSegment" === r.sn) this.state = ve.IDLE, i.tparsed = i.tbuffered = performance.now(), n.initSegment.data = t.payload, this.hls.trigger(Ot.a.FRAG_BUFFERED, { stats: i, frag: e, id: "main" }), this.tick();else {
            this.state = ve.PARSING;var o = n.totalduration,
                s = e.level,
                l = e.sn,
                u = this.config.defaultAudioCodec || a.audioCodec;this.audioCodecSwap && (Pt.b.log("swapping playlist audio codec"), void 0 === u && (u = this.lastAudioCodec), u && (u = -1 !== u.indexOf("mp4a.40.5") ? "mp4a.40.2" : "mp4a.40.5")), this.pendingBuffering = !0, this.appended = !1, Pt.b.log("Parsing " + l + " of [" + n.startSN + " ," + n.endSN + "],level " + s + ", cc " + e.cc);var d = this.demuxer;d || (d = this.demuxer = new ce(this.hls, "main"));var h = this.media,
                c = h && h.seeking,
                f = !c && (n.PTSKnown || !n.live),
                p = n.initSegment ? n.initSegment.data : [];d.push(t.payload, p, u, a.videoCodec, e, o, f, void 0);
          }
        }this.fragLoadError = 0;
      }, e.prototype.onFragParsingInitSegment = function (t) {
        var e = this.fragCurrent,
            r = t.frag;if (e && "main" === t.id && r.sn === e.sn && r.level === e.level && this.state === ve.PARSING) {
          var i,
              a,
              n = t.tracks;if (n.audio && this.altAudio && delete n.audio, a = n.audio) {
            var o = this.levels[this.level].audioCodec,
                s = navigator.userAgent.toLowerCase();o && this.audioCodecSwap && (Pt.b.log("swapping playlist audio codec"), o = -1 !== o.indexOf("mp4a.40.5") ? "mp4a.40.2" : "mp4a.40.5"), this.audioCodecSwitch && 1 !== a.metadata.channelCount && -1 === s.indexOf("firefox") && (o = "mp4a.40.5"), -1 !== s.indexOf("android") && "audio/mpeg" !== a.container && (o = "mp4a.40.2", Pt.b.log("Android: force audio codec to " + o)), a.levelCodec = o, a.id = t.id;
          }a = n.video, a && (a.levelCodec = this.levels[this.level].videoCodec, a.id = t.id), this.hls.trigger(Ot.a.BUFFER_CODECS, n);for (i in n) {
            a = n[i], Pt.b.log("main track:" + i + ",container:" + a.container + ",codecs[level/parsed]=[" + a.levelCodec + "/" + a.codec + "]");var l = a.initSegment;l && (this.appended = !0, this.pendingBuffering = !0, this.hls.trigger(Ot.a.BUFFER_APPENDING, { type: i, data: l, parent: "main", content: "initSegment" }));
          }this.tick();
        }
      }, e.prototype.onFragParsingData = function (t) {
        var e = this,
            r = this.fragCurrent,
            i = t.frag;if (r && "main" === t.id && i.sn === r.sn && i.level === r.level && ("audio" !== t.type || !this.altAudio) && this.state === ve.PARSING) {
          var a = this.levels[this.level],
              n = r;if (isNaN(t.endPTS) && (t.endPTS = t.startPTS + r.duration, t.endDTS = t.startDTS + r.duration), Pt.b.log("Parsed " + t.type + ",PTS:[" + t.startPTS.toFixed(3) + "," + t.endPTS.toFixed(3) + "],DTS:[" + t.startDTS.toFixed(3) + "/" + t.endDTS.toFixed(3) + "],nb:" + t.nb + ",dropped:" + (t.dropped || 0)), "video" === t.type) if (n.dropped = t.dropped, n.dropped) {
            if (n.backtracked) Pt.b.warn("Already backtracked on this fragment, appending with the gap");else {
              var o = a.details;if (!o || n.sn !== o.startSN) return Pt.b.warn("missing video frame(s), backtracking fragment"), n.backtracked = !0, this.nextLoadPosition = t.startPTS, this.state = ve.IDLE, this.fragPrevious = n, void this.tick();Pt.b.warn("missing video frame(s) on first frag, appending with gap");
            }
          } else n.backtracked = !1;var s = E(a.details, n, t.startPTS, t.endPTS, t.startDTS, t.endDTS),
              l = this.hls;l.trigger(Ot.a.LEVEL_PTS_UPDATED, { details: a.details, level: this.level, drift: s, type: t.type, start: t.startPTS, end: t.endPTS }), [t.data1, t.data2].forEach(function (r) {
            r && r.length && e.state === ve.PARSING && (e.appended = !0, e.pendingBuffering = !0, l.trigger(Ot.a.BUFFER_APPENDING, { type: t.type, data: r, parent: "main", content: "data" }));
          }), this.tick();
        }
      }, e.prototype.onFragParsed = function (t) {
        var e = this.fragCurrent,
            r = t.frag;e && "main" === t.id && r.sn === e.sn && r.level === e.level && this.state === ve.PARSING && (this.stats.tparsed = performance.now(), this.state = ve.PARSED, this._checkAppendedParsed());
      }, e.prototype.onAudioTrackSwitching = function (t) {
        var e = !!t.url,
            r = t.id;if (!e) {
          if (this.mediaBuffer !== this.media) {
            Pt.b.log("switching on main audio, use media.buffered to schedule main fragment loading"), this.mediaBuffer = this.media;var i = this.fragCurrent;i.loader && (Pt.b.log("switching to main audio track, cancel main fragment load"), i.loader.abort()), this.fragCurrent = null, this.fragPrevious = null, this.demuxer && (this.demuxer.destroy(), this.demuxer = null), this.state = ve.IDLE;
          }var a = this.hls;a.trigger(Ot.a.BUFFER_FLUSHING, { startOffset: 0, endOffset: Number.POSITIVE_INFINITY, type: "audio" }), a.trigger(Ot.a.AUDIO_TRACK_SWITCHED, { id: r }), this.altAudio = !1;
        }
      }, e.prototype.onAudioTrackSwitched = function (t) {
        var e = t.id,
            r = !!this.hls.audioTracks[e].url;if (r) {
          var i = this.videoBuffer;i && this.mediaBuffer !== i && (Pt.b.log("switching on alternate audio, use video.buffered to schedule main fragment loading"), this.mediaBuffer = i);
        }this.altAudio = r, this.tick();
      }, e.prototype.onBufferCreated = function (t) {
        var e = t.tracks,
            r = void 0,
            i = void 0,
            a = !1;for (var n in e) {
          var o = e[n];"main" === o.id ? (i = n, r = o, "video" === n && (this.videoBuffer = e[n].buffer)) : a = !0;
        }a && r ? (Pt.b.log("alternate track found, use " + i + ".buffered to schedule main fragment loading"), this.mediaBuffer = r.buffer) : this.mediaBuffer = this.media;
      }, e.prototype.onBufferAppended = function (t) {
        if ("main" === t.parent) {
          var e = this.state;e !== ve.PARSING && e !== ve.PARSED || (this.pendingBuffering = t.pending > 0, this._checkAppendedParsed());
        }
      }, e.prototype._checkAppendedParsed = function () {
        if (!(this.state !== ve.PARSED || this.appended && this.pendingBuffering)) {
          var t = this.fragCurrent;if (t) {
            var e = this.mediaBuffer ? this.mediaBuffer : this.media;Pt.b.log("main buffered : " + pe.toString(e.buffered));var r = this._bufferedFrags.filter(function (t) {
              return ae.isBuffered(e, (t.startPTS + t.endPTS) / 2);
            });r.push(t), this._bufferedFrags = r.sort(function (t, e) {
              return t.startPTS - e.startPTS;
            }), this.fragPrevious = t;var i = this.stats;i.tbuffered = performance.now(), this.fragLastKbps = Math.round(8 * i.total / (i.tbuffered - i.tfirst)), this.hls.trigger(Ot.a.FRAG_BUFFERED, { stats: i, frag: t, id: "main" }), this.state = ve.IDLE;
          }this.tick();
        }
      }, e.prototype.onError = function (t) {
        var e = t.frag || this.fragCurrent;if (!e || "main" === e.type) {
          var r = !!this.media && ae.isBuffered(this.media, this.media.currentTime) && ae.isBuffered(this.media, this.media.currentTime + .5);switch (t.details) {case Ct.a.FRAG_LOAD_ERROR:case Ct.a.FRAG_LOAD_TIMEOUT:case Ct.a.KEY_LOAD_ERROR:case Ct.a.KEY_LOAD_TIMEOUT:
              if (!t.fatal) if (this.fragLoadError + 1 <= this.config.fragLoadingMaxRetry) {
                var i = Math.min(Math.pow(2, this.fragLoadError) * this.config.fragLoadingRetryDelay, this.config.fragLoadingMaxRetryTimeout);e.loadCounter = 0, Pt.b.warn("mediaController: frag loading failed, retry in " + i + " ms"), this.retryDate = performance.now() + i, this.loadedmetadata || (this.startFragRequested = !1, this.nextLoadPosition = this.startPosition), this.fragLoadError++, this.state = ve.FRAG_LOADING_WAITING_RETRY;
              } else Pt.b.error("mediaController: " + t.details + " reaches max retry, redispatch as fatal ..."), t.fatal = !0, this.state = ve.ERROR;break;case Ct.a.FRAG_LOOP_LOADING_ERROR:
              t.fatal || (r ? (this._reduceMaxBufferLength(e.duration), this.state = ve.IDLE) : e.autoLevel && 0 !== e.level || (t.fatal = !0, this.state = ve.ERROR));break;case Ct.a.LEVEL_LOAD_ERROR:case Ct.a.LEVEL_LOAD_TIMEOUT:
              this.state !== ve.ERROR && (t.fatal ? (this.state = ve.ERROR, Pt.b.warn("streamController: " + t.details + ",switch to " + this.state + " state ...")) : t.levelRetry || this.state !== ve.WAITING_LEVEL || (this.state = ve.IDLE));break;case Ct.a.BUFFER_FULL_ERROR:
              "main" !== t.parent || this.state !== ve.PARSING && this.state !== ve.PARSED || (r ? (this._reduceMaxBufferLength(this.config.maxBufferLength), this.state = ve.IDLE) : (Pt.b.warn("buffer full error also media.currentTime is not buffered, flush everything"), this.fragCurrent = null, this.flushMainBuffer(0, Number.POSITIVE_INFINITY)));}
        }
      }, e.prototype._reduceMaxBufferLength = function (t) {
        var e = this.config;e.maxMaxBufferLength >= t && (e.maxMaxBufferLength /= 2, Pt.b.warn("main:reduce max buffer length to " + e.maxMaxBufferLength + "s"), void 0 !== this.fragLoadIdx && (this.fragLoadIdx += 2 * e.fragLoadingLoopThreshold));
      }, e.prototype._checkBuffer = function () {
        var t = this.media,
            e = this.config;if (t && t.readyState) {
          var r = t.currentTime,
              i = this.mediaBuffer ? this.mediaBuffer : t,
              a = i.buffered;if (!this.loadedmetadata && a.length) {
            this.loadedmetadata = !0;var n = t.seeking ? r : this.startPosition,
                o = ae.isBuffered(i, n),
                s = a.start(0),
                l = !o && Math.abs(n - s) < e.maxSeekHole;(r !== n || l) && (Pt.b.log("target start position:" + n), l && (n = s, Pt.b.log("target start position not buffered, seek to buffered.start(0) " + n)), Pt.b.log("adjust currentTime from " + r + " to " + n), t.currentTime = n);
          } else if (this.immediateSwitch) this.immediateLevelSwitchEnd();else {
            var u = ae.bufferInfo(t, r, 0),
                d = !(t.paused || t.ended || 0 === t.buffered.length),
                h = r !== this.lastCurrentTime;if (h) this.stallReported && (Pt.b.warn("playback not stuck anymore @" + r + ", after " + Math.round(performance.now() - this.stalled) + "ms"), this.stallReported = !1), this.stalled = void 0, this.nudgeRetry = 0;else if (d) {
              var c = performance.now(),
                  f = this.hls;if (this.stalled) {
                var p = c - this.stalled,
                    g = u.len,
                    v = this.nudgeRetry || 0;if (g <= .5 && p > 1e3 * e.lowBufferWatchdogPeriod) {
                  this.stallReported || (this.stallReported = !0, Pt.b.warn("playback stalling in low buffer @" + r), f.trigger(Ot.a.ERROR, { type: Ct.b.MEDIA_ERROR, details: Ct.a.BUFFER_STALLED_ERROR, fatal: !1, buffer: g }));var y = u.nextStart,
                      m = y - r;if (y && m < e.maxSeekHole && m > 0) {
                    this.nudgeRetry = ++v;var b = v * e.nudgeOffset;Pt.b.log("adjust currentTime from " + t.currentTime + " to next buffered @ " + y + " + nudge " + b), t.currentTime = y + b, this.stalled = void 0, f.trigger(Ot.a.ERROR, { type: Ct.b.MEDIA_ERROR, details: Ct.a.BUFFER_SEEK_OVER_HOLE, fatal: !1, hole: y + b - r });
                  }
                } else if (g > .5 && p > 1e3 * e.highBufferWatchdogPeriod) if (this.stallReported || (this.stallReported = !0, Pt.b.warn("playback stalling in high buffer @" + r), f.trigger(Ot.a.ERROR, { type: Ct.b.MEDIA_ERROR, details: Ct.a.BUFFER_STALLED_ERROR, fatal: !1, buffer: g })), this.stalled = void 0, this.nudgeRetry = ++v, v < e.nudgeMaxRetry) {
                  var E = t.currentTime,
                      T = E + v * e.nudgeOffset;Pt.b.log("adjust currentTime from " + E + " to " + T), t.currentTime = T, f.trigger(Ot.a.ERROR, { type: Ct.b.MEDIA_ERROR, details: Ct.a.BUFFER_NUDGE_ON_STALL, fatal: !1 });
                } else Pt.b.error("still stuck in high buffer @" + r + " after " + e.nudgeMaxRetry + ", raise fatal error"), f.trigger(Ot.a.ERROR, { type: Ct.b.MEDIA_ERROR, details: Ct.a.BUFFER_STALLED_ERROR, fatal: !0 });
              } else this.stalled = c, this.stallReported = !1;
            }
          }
        }
      }, e.prototype.onFragLoadEmergencyAborted = function () {
        this.state = ve.IDLE, this.loadedmetadata || (this.startFragRequested = !1, this.nextLoadPosition = this.startPosition), this.tick();
      }, e.prototype.onBufferFlushed = function () {
        var t = this.mediaBuffer ? this.mediaBuffer : this.media;this._bufferedFrags = this._bufferedFrags.filter(function (e) {
          return ae.isBuffered(t, (e.startPTS + e.endPTS) / 2);
        }), void 0 !== this.fragLoadIdx && (this.fragLoadIdx += 2 * this.config.fragLoadingLoopThreshold), this.state = ve.IDLE, this.fragPrevious = null;
      }, e.prototype.swapAudioCodec = function () {
        this.audioCodecSwap = !this.audioCodecSwap;
      }, e.prototype.computeLivePosition = function (t, e) {
        var r = void 0 !== this.config.liveSyncDuration ? this.config.liveSyncDuration : this.config.liveSyncDurationCount * e.targetduration;return t + Math.max(0, e.totalduration - r);
      }, ge(e, [{ key: "state", set: function set(t) {
          if (this.state !== t) {
            var e = this.state;this._state = t, Pt.b.log("main stream:" + e + "->" + t), this.hls.trigger(Ot.a.STREAM_STATE_TRANSITION, { previousState: e, nextState: t });
          }
        }, get: function get() {
          return this._state;
        } }, { key: "currentLevel", get: function get() {
          var t = this.media;if (t) {
            var e = this.getBufferedFrag(t.currentTime);if (e) return e.level;
          }return -1;
        } }, { key: "nextBufferedFrag", get: function get() {
          var t = this.media;return t ? this.followingBufferedFrag(this.getBufferedFrag(t.currentTime)) : null;
        } }, { key: "nextLevel", get: function get() {
          var t = this.nextBufferedFrag;return t ? t.level : -1;
        } }, { key: "liveSyncPosition", get: function get() {
          return this._liveSyncPosition;
        }, set: function set(t) {
          this._liveSyncPosition = t;
        } }]), e;
    }(Nt),
        me = ye,
        be = function () {
      function t(t, e) {
        for (var r = 0; r < e.length; r++) {
          var i = e[r];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i);
        }
      }return function (e, r, i) {
        return r && t(e.prototype, r), i && t(e, i), e;
      };
    }(),
        Ee = function (t) {
      function e(r) {
        O(this, e);var i = C(this, t.call(this, r, Ot.a.MANIFEST_LOADED, Ot.a.LEVEL_LOADED, Ot.a.FRAG_LOADED, Ot.a.ERROR));return i.canload = !1, i.currentLevelIndex = null, i.manualLevelIndex = -1, i.timer = null, i;
      }return P(e, t), e.prototype.destroy = function () {
        this.cleanTimer(), this.manualLevelIndex = -1;
      }, e.prototype.cleanTimer = function () {
        null !== this.timer && (clearTimeout(this.timer), this.timer = null);
      }, e.prototype.startLoad = function () {
        var t = this._levels;this.canload = !0, this.levelRetryCount = 0, t && t.forEach(function (t) {
          t.loadError = 0;var e = t.details;e && e.live && (t.details = void 0);
        }), null !== this.timer && this.loadLevel();
      }, e.prototype.stopLoad = function () {
        this.canload = !1;
      }, e.prototype.onManifestLoaded = function (t) {
        var e = [],
            r = void 0,
            i = {},
            a = null,
            n = !1,
            s = !1,
            l = /chrome|firefox/.test(navigator.userAgent.toLowerCase()),
            u = [];if (t.levels.forEach(function (t) {
          t.loadError = 0, t.fragmentError = !1, n = n || !!t.videoCodec, s = s || !!t.audioCodec || !(!t.attrs || !t.attrs.AUDIO), !0 === l && t.audioCodec && -1 !== t.audioCodec.indexOf("mp4a.40.34") && (t.audioCodec = void 0), a = i[t.bitrate], void 0 === a ? (t.url = [t.url], t.urlId = 0, i[t.bitrate] = t, e.push(t)) : a.url.push(t.url);
        }), !0 === n && !0 === s && (e = e.filter(function (t) {
          return !!t.videoCodec;
        })), e = e.filter(function (t) {
          var e = t.audioCodec,
              r = t.videoCodec;return (!e || o(e)) && (!r || o(r));
        }), t.audioTracks && (u = t.audioTracks.filter(function (t) {
          return !t.audioCodec || o(t.audioCodec, "audio");
        })), e.length > 0) {
          r = e[0].bitrate, e.sort(function (t, e) {
            return t.bitrate - e.bitrate;
          }), this._levels = e;for (var d = 0; d < e.length; d++) {
            if (e[d].bitrate === r) {
              this._firstLevel = d, Pt.b.log("manifest loaded," + e.length + " level(s) found, first bitrate:" + r);break;
            }
          }this.hls.trigger(Ot.a.MANIFEST_PARSED, { levels: e, audioTracks: u, firstLevel: this._firstLevel, stats: t.stats, audio: s, video: n, altAudio: u.length > 0 });
        } else this.hls.trigger(Ot.a.ERROR, { type: Ct.b.MEDIA_ERROR, details: Ct.a.MANIFEST_INCOMPATIBLE_CODECS_ERROR, fatal: !0, url: this.hls.url, reason: "no level with compatible codecs found in manifest" });
      }, e.prototype.setLevelInternal = function (t) {
        var e = this._levels,
            r = this.hls;if (t >= 0 && t < e.length) {
          if (this.cleanTimer(), this.currentLevelIndex !== t) {
            Pt.b.log("switching to level " + t), this.currentLevelIndex = t;var i = e[t];i.level = t, r.trigger(Ot.a.LEVEL_SWITCH, i), r.trigger(Ot.a.LEVEL_SWITCHING, i);
          }var a = e[t],
              n = a.details;if (!n || !0 === n.live) {
            var o = a.urlId;r.trigger(Ot.a.LEVEL_LOADING, { url: a.url[o], level: t, id: o });
          }
        } else r.trigger(Ot.a.ERROR, { type: Ct.b.OTHER_ERROR, details: Ct.a.LEVEL_SWITCH_ERROR, level: t, fatal: !1, reason: "invalid level idx" });
      }, e.prototype.onError = function (t) {
        if (!0 === t.fatal) return void (t.type === Ct.b.NETWORK_ERROR && this.cleanTimer());var e = !1,
            r = !1,
            i = void 0;switch (t.details) {case Ct.a.FRAG_LOAD_ERROR:case Ct.a.FRAG_LOAD_TIMEOUT:case Ct.a.FRAG_LOOP_LOADING_ERROR:case Ct.a.KEY_LOAD_ERROR:case Ct.a.KEY_LOAD_TIMEOUT:
            i = t.frag.level, r = !0;break;case Ct.a.LEVEL_LOAD_ERROR:case Ct.a.LEVEL_LOAD_TIMEOUT:
            i = t.context.level, e = !0;break;case Ct.a.REMUX_ALLOC_ERROR:
            i = t.level, e = !0;}void 0 !== i && this.recoverLevel(t, i, e, r);
      }, e.prototype.recoverLevel = function (t, e, r, i) {
        var a = this,
            n = this.hls.config,
            o = t.details,
            s = this._levels[e],
            l = void 0,
            u = void 0,
            d = void 0;if (s.loadError++, s.fragmentError = i, !0 === r) {
          if (!(this.levelRetryCount + 1 <= n.levelLoadingMaxRetry)) return Pt.b.error("level controller, cannot recover from " + o + " error"), this.currentLevelIndex = null, this.cleanTimer(), void (t.fatal = !0);u = Math.min(Math.pow(2, this.levelRetryCount) * n.levelLoadingRetryDelay, n.levelLoadingMaxRetryTimeout), this.timer = setTimeout(function () {
            return a.loadLevel();
          }, u), t.levelRetry = !0, this.levelRetryCount++, Pt.b.warn("level controller, " + o + ", retry in " + u + " ms, current retry count is " + this.levelRetryCount);
        }!0 !== r && !0 !== i || (l = s.url.length, l > 1 && s.loadError < l ? (Pt.b.warn("level controller, " + o + " for level " + e + ": switching to redundant stream id " + s.urlId), s.urlId = (s.urlId + 1) % l, s.details = void 0) : -1 === this.manualLevelIndex ? (d = 0 === e ? this._levels.length - 1 : e - 1, Pt.b.warn("level controller, " + o + ": switch to " + d), this.hls.nextAutoLevel = this.currentLevelIndex = d) : !0 === i && (Pt.b.warn("level controller, " + o + ": reload a fragment"), this.currentLevelIndex = null));
      }, e.prototype.onFragLoaded = function (t) {
        var e = t.frag;if (void 0 !== e && "main" === e.type) {
          var r = this._levels[e.level];void 0 !== r && (r.fragmentError = !1, r.loadError = 0, this.levelRetryCount = 0);
        }
      }, e.prototype.onLevelLoaded = function (t) {
        var e = this,
            r = t.level;if (r === this.currentLevelIndex) {
          var i = this._levels[r];!1 === i.fragmentError && (i.loadError = 0, this.levelRetryCount = 0);var a = t.details;if (a.live) {
            var n = 1e3 * (a.averagetargetduration ? a.averagetargetduration : a.targetduration),
                o = i.details;o && a.endSN === o.endSN && (n /= 2, Pt.b.log("same live playlist, reload twice faster")), n -= performance.now() - t.stats.trequest, n = Math.max(1e3, Math.round(n)), Pt.b.log("live playlist, reload in " + n + " ms"), this.timer = setTimeout(function () {
              return e.loadLevel();
            }, n);
          } else this.cleanTimer();
        }
      }, e.prototype.loadLevel = function () {
        var t = void 0,
            e = void 0;null !== this.currentLevelIndex && !0 === this.canload && void 0 !== (t = this._levels[this.currentLevelIndex]) && t.url.length > 0 && (e = t.urlId, this.hls.trigger(Ot.a.LEVEL_LOADING, { url: t.url[e], level: this.currentLevelIndex, id: e }));
      }, be(e, [{ key: "levels", get: function get() {
          return this._levels;
        } }, { key: "level", get: function get() {
          return this.currentLevelIndex;
        }, set: function set(t) {
          var e = this._levels;e && (t = Math.min(t, e.length - 1), this.currentLevelIndex === t && void 0 !== e[t].details || this.setLevelInternal(t));
        } }, { key: "manualLevel", get: function get() {
          return this.manualLevelIndex;
        }, set: function set(t) {
          this.manualLevelIndex = t, void 0 === this._startLevel && (this._startLevel = t), -1 !== t && (this.level = t);
        } }, { key: "firstLevel", get: function get() {
          return this._firstLevel;
        }, set: function set(t) {
          this._firstLevel = t;
        } }, { key: "startLevel", get: function get() {
          if (void 0 === this._startLevel) {
            var t = this.hls.config.startLevel;return void 0 !== t ? t : this._firstLevel;
          }return this._startLevel;
        }, set: function set(t) {
          this._startLevel = t;
        } }, { key: "nextLoadLevel", get: function get() {
          return -1 !== this.manualLevelIndex ? this.manualLevelIndex : this.hls.nextAutoLevel;
        }, set: function set(t) {
          this.level = t, -1 === this.manualLevelIndex && (this.hls.nextAutoLevel = t);
        } }]), e;
    }(Nt),
        Te = Ee,
        Re = r(3),
        Ae = function (t) {
      function e(r) {
        x(this, e);var i = F(this, t.call(this, r, Ot.a.MEDIA_ATTACHED, Ot.a.MEDIA_DETACHING, Ot.a.FRAG_PARSING_METADATA));return i.id3Track = void 0, i.media = void 0, i;
      }return N(e, t), e.prototype.destroy = function () {
        Nt.prototype.destroy.call(this);
      }, e.prototype.onMediaAttached = function (t) {
        this.media = t.media, this.media;
      }, e.prototype.onMediaDetaching = function () {
        this.media = void 0;
      }, e.prototype.onFragParsingMetadata = function (t) {
        var e = t.frag,
            r = t.samples;this.id3Track || (this.id3Track = this.media.addTextTrack("metadata", "id3"), this.id3Track.mode = "hidden");for (var i = window.WebKitDataCue || window.VTTCue || window.TextTrackCue, a = 0; a < r.length; a++) {
          var n = Re.a.getID3Frames(r[a].data);if (n) {
            var o = r[a].pts,
                s = a < r.length - 1 ? r[a + 1].pts : e.endPTS;o === s && (s += 1e-4);for (var l = 0; l < n.length; l++) {
              var u = n[l];if (!Re.a.isTimeStampFrame(u)) {
                var d = new i(o, s, "");d.value = u, this.id3Track.addCue(d);
              }
            }
          }
        }
      }, e;
    }(Nt),
        Se = Ae,
        Le = function () {
      function t(e) {
        U(this, t), this.alpha_ = e ? Math.exp(Math.log(.5) / e) : 0, this.estimate_ = 0, this.totalWeight_ = 0;
      }return t.prototype.sample = function (t, e) {
        var r = Math.pow(this.alpha_, t);this.estimate_ = e * (1 - r) + r * this.estimate_, this.totalWeight_ += t;
      }, t.prototype.getTotalWeight = function () {
        return this.totalWeight_;
      }, t.prototype.getEstimate = function () {
        if (this.alpha_) {
          var t = 1 - Math.pow(this.alpha_, this.totalWeight_);return this.estimate_ / t;
        }return this.estimate_;
      }, t;
    }(),
        _e = Le,
        we = function () {
      function t(e, r, i, a) {
        B(this, t), this.hls = e, this.defaultEstimate_ = a, this.minWeight_ = .001, this.minDelayMs_ = 50, this.slow_ = new _e(r), this.fast_ = new _e(i);
      }return t.prototype.sample = function (t, e) {
        t = Math.max(t, this.minDelayMs_);var r = 8e3 * e / t,
            i = t / 1e3;this.fast_.sample(i, r), this.slow_.sample(i, r);
      }, t.prototype.canEstimate = function () {
        var t = this.fast_;return t && t.getTotalWeight() >= this.minWeight_;
      }, t.prototype.getEstimate = function () {
        return this.canEstimate() ? Math.min(this.fast_.getEstimate(), this.slow_.getEstimate()) : this.defaultEstimate_;
      }, t.prototype.destroy = function () {}, t;
    }(),
        De = we,
        Ie = function () {
      function t(t, e) {
        for (var r = 0; r < e.length; r++) {
          var i = e[r];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i);
        }
      }return function (e, r, i) {
        return r && t(e.prototype, r), i && t(e, i), e;
      };
    }(),
        ke = function (t) {
      function e(r) {
        G(this, e);var i = j(this, t.call(this, r, Ot.a.FRAG_LOADING, Ot.a.FRAG_LOADED, Ot.a.FRAG_BUFFERED, Ot.a.ERROR));return i.lastLoadedFragLevel = 0, i._nextAutoLevel = -1, i.hls = r, i.timer = null, i._bwEstimator = null, i.onCheck = i._abandonRulesCheck.bind(i), i;
      }return H(e, t), e.prototype.destroy = function () {
        this.clearTimer(), Nt.prototype.destroy.call(this);
      }, e.prototype.onFragLoading = function (t) {
        var e = t.frag;if ("main" === e.type) {
          if (this.timer || (this.timer = setInterval(this.onCheck, 100)), !this._bwEstimator) {
            var r = this.hls,
                i = t.frag.level,
                a = r.levels[i].details.live,
                n = r.config,
                o = void 0,
                s = void 0;a ? (o = n.abrEwmaFastLive, s = n.abrEwmaSlowLive) : (o = n.abrEwmaFastVoD, s = n.abrEwmaSlowVoD), this._bwEstimator = new De(r, s, o, n.abrEwmaDefaultEstimate);
          }this.fragCurrent = e;
        }
      }, e.prototype._abandonRulesCheck = function () {
        var t = this.hls,
            e = t.media,
            r = this.fragCurrent,
            i = r.loader,
            a = t.minAutoLevel;if (!i || i.stats && i.stats.aborted) return Pt.b.warn("frag loader destroy or aborted, disarm abandonRules"), this.clearTimer(), void (this._nextAutoLevel = -1);var n = i.stats;if (e && n && (!e.paused && 0 !== e.playbackRate || !e.readyState) && r.autoLevel && r.level) {
          var o = performance.now() - n.trequest,
              s = Math.abs(e.playbackRate);if (o > 500 * r.duration / s) {
            var l = t.levels,
                u = Math.max(1, n.bw ? n.bw / 8 : 1e3 * n.loaded / o),
                d = l[r.level],
                h = d.realBitrate ? Math.max(d.realBitrate, d.bitrate) : d.bitrate,
                c = n.total ? n.total : Math.max(n.loaded, Math.round(r.duration * h / 8)),
                f = e.currentTime,
                p = (c - n.loaded) / u,
                g = (ae.bufferInfo(e, f, t.config.maxBufferHole).end - f) / s;if (g < 2 * r.duration / s && p > g) {
              var v = void 0,
                  y = void 0;for (y = r.level - 1; y > a; y--) {
                var m = l[y].realBitrate ? Math.max(l[y].realBitrate, l[y].bitrate) : l[y].bitrate;if ((v = r.duration * m / (6.4 * u)) < g) break;
              }v < p && (Pt.b.warn("loading too slow, abort fragment loading and switch to level " + y + ":fragLoadedDelay[" + y + "]<fragLoadedDelay[" + (r.level - 1) + "];bufferStarvationDelay:" + v.toFixed(1) + "<" + p.toFixed(1) + ":" + g.toFixed(1)), t.nextLoadLevel = y, this._bwEstimator.sample(o, n.loaded), i.abort(), this.clearTimer(), t.trigger(Ot.a.FRAG_LOAD_EMERGENCY_ABORTED, { frag: r, stats: n }));
            }
          }
        }
      }, e.prototype.onFragLoaded = function (t) {
        var e = t.frag;if ("main" === e.type && !isNaN(e.sn)) {
          if (this.clearTimer(), this.lastLoadedFragLevel = e.level, this._nextAutoLevel = -1, this.hls.config.abrMaxWithRealBitrate) {
            var r = this.hls.levels[e.level],
                i = (r.loaded ? r.loaded.bytes : 0) + t.stats.loaded,
                a = (r.loaded ? r.loaded.duration : 0) + t.frag.duration;r.loaded = { bytes: i, duration: a }, r.realBitrate = Math.round(8 * i / a);
          }if (t.frag.bitrateTest) {
            var n = t.stats;n.tparsed = n.tbuffered = n.tload, this.onFragBuffered(t);
          }
        }
      }, e.prototype.onFragBuffered = function (t) {
        var e = t.stats,
            r = t.frag;if (!(!0 === e.aborted || 1 !== r.loadCounter || "main" !== r.type || isNaN(r.sn) || r.bitrateTest && e.tload !== e.tbuffered)) {
          var i = e.tparsed - e.trequest;Pt.b.log("latency/loading/parsing/append/kbps:" + Math.round(e.tfirst - e.trequest) + "/" + Math.round(e.tload - e.tfirst) + "/" + Math.round(e.tparsed - e.tload) + "/" + Math.round(e.tbuffered - e.tparsed) + "/" + Math.round(8 * e.loaded / (e.tbuffered - e.trequest))), this._bwEstimator.sample(i, e.loaded), e.bwEstimate = this._bwEstimator.getEstimate(), r.bitrateTest ? this.bitrateTestDelay = i / 1e3 : this.bitrateTestDelay = 0;
        }
      }, e.prototype.onError = function (t) {
        switch (t.details) {case Ct.a.FRAG_LOAD_ERROR:case Ct.a.FRAG_LOAD_TIMEOUT:
            this.clearTimer();}
      }, e.prototype.clearTimer = function () {
        clearInterval(this.timer), this.timer = null;
      }, e.prototype._findBestLevel = function (t, e, r, i, a, n, o, s, l) {
        for (var u = a; u >= i; u--) {
          var d = l[u],
              h = d.details,
              c = h ? h.totalduration / h.fragments.length : e,
              f = !!h && h.live,
              p = void 0;p = u <= t ? o * r : s * r;var g = l[u].realBitrate ? Math.max(l[u].realBitrate, l[u].bitrate) : l[u].bitrate,
              v = g * c / p;if (Pt.b.trace("level/adjustedbw/bitrate/avgDuration/maxFetchDuration/fetchDuration: " + u + "/" + Math.round(p) + "/" + g + "/" + c + "/" + n + "/" + v), p > g && (!v || f && !this.bitrateTestDelay || v < n)) return u;
        }return -1;
      }, Ie(e, [{ key: "nextAutoLevel", get: function get() {
          var t = this._nextAutoLevel,
              e = this._bwEstimator;if (!(-1 === t || e && e.canEstimate())) return t;var r = this._nextABRAutoLevel;return -1 !== t && (r = Math.min(t, r)), r;
        }, set: function set(t) {
          this._nextAutoLevel = t;
        } }, { key: "_nextABRAutoLevel", get: function get() {
          var t = this.hls,
              e = t.maxAutoLevel,
              r = t.levels,
              i = t.config,
              a = t.minAutoLevel,
              n = t.media,
              o = this.lastLoadedFragLevel,
              s = this.fragCurrent ? this.fragCurrent.duration : 0,
              l = n ? n.currentTime : 0,
              u = n && 0 !== n.playbackRate ? Math.abs(n.playbackRate) : 1,
              d = this._bwEstimator ? this._bwEstimator.getEstimate() : i.abrEwmaDefaultEstimate,
              h = (ae.bufferInfo(n, l, i.maxBufferHole).end - l) / u,
              c = this._findBestLevel(o, s, d, a, e, h, i.abrBandWidthFactor, i.abrBandWidthUpFactor, r);if (c >= 0) return c;Pt.b.trace("rebuffering expected to happen, lets try to find a quality level minimizing the rebuffering");var f = s ? Math.min(s, i.maxStarvationDelay) : i.maxStarvationDelay,
              p = i.abrBandWidthFactor,
              g = i.abrBandWidthUpFactor;if (0 === h) {
            var v = this.bitrateTestDelay;if (v) {
              f = (s ? Math.min(s, i.maxLoadingDelay) : i.maxLoadingDelay) - v, Pt.b.trace("bitrate test took " + Math.round(1e3 * v) + "ms, set first fragment max fetchDuration to " + Math.round(1e3 * f) + " ms"), p = g = 1;
            }
          }return c = this._findBestLevel(o, s, d, a, e, h + f, p, g, r), Math.max(c, 0);
        } }]), e;
    }(Nt),
        Oe = ke,
        Ce = y(),
        Pe = function (t) {
      function e(r) {
        K(this, e);var i = W(this, t.call(this, r, Ot.a.MEDIA_ATTACHING, Ot.a.MEDIA_DETACHING, Ot.a.MANIFEST_PARSED, Ot.a.BUFFER_RESET, Ot.a.BUFFER_APPENDING, Ot.a.BUFFER_CODECS, Ot.a.BUFFER_EOS, Ot.a.BUFFER_FLUSHING, Ot.a.LEVEL_PTS_UPDATED, Ot.a.LEVEL_UPDATED));return i._msDuration = null, i._levelDuration = null, i._live = null, i._objectUrl = null, i.onsbue = i.onSBUpdateEnd.bind(i), i.onsbe = i.onSBUpdateError.bind(i), i.pendingTracks = {}, i.tracks = {}, i;
      }return V(e, t), e.prototype.destroy = function () {
        Nt.prototype.destroy.call(this);
      }, e.prototype.onLevelPtsUpdated = function (t) {
        var e = t.type,
            r = this.tracks.audio;if ("audio" === e && r && "audio/mpeg" === r.container) {
          var i = this.sourceBuffer.audio;if (Math.abs(i.timestampOffset - t.start) > .1) {
            var a = i.updating;try {
              i.abort();
            } catch (t) {
              a = !0, Pt.b.warn("can not abort audio buffer: " + t);
            }a ? this.audioTimestampOffset = t.start : (Pt.b.warn("change mpeg audio timestamp offset from " + i.timestampOffset + " to " + t.start), i.timestampOffset = t.start);
          }
        }
      }, e.prototype.onManifestParsed = function (t) {
        var e = t.audio,
            r = t.video || t.levels.length && t.audio,
            i = 0;t.altAudio && (e || r) && (i = (e ? 1 : 0) + (r ? 1 : 0), Pt.b.log(i + " sourceBuffer(s) expected")), this.sourceBufferNb = i;
      }, e.prototype.onMediaAttaching = function (t) {
        var e = this.media = t.media;if (e) {
          var r = this.mediaSource = new Ce();this.onmso = this.onMediaSourceOpen.bind(this), this.onmse = this.onMediaSourceEnded.bind(this), this.onmsc = this.onMediaSourceClose.bind(this), r.addEventListener("sourceopen", this.onmso), r.addEventListener("sourceended", this.onmse), r.addEventListener("sourceclose", this.onmsc), e.src = URL.createObjectURL(r), this._objectUrl = e.src;
        }
      }, e.prototype.onMediaDetaching = function () {
        Pt.b.log("media source detaching");var t = this.mediaSource;if (t) {
          if ("open" === t.readyState) try {
            t.endOfStream();
          } catch (t) {
            Pt.b.warn("onMediaDetaching:" + t.message + " while calling endOfStream");
          }t.removeEventListener("sourceopen", this.onmso), t.removeEventListener("sourceended", this.onmse), t.removeEventListener("sourceclose", this.onmsc), this.media && (URL.revokeObjectURL(this._objectUrl), this.media.src === this._objectUrl ? (this.media.removeAttribute("src"), this.media.load()) : Pt.b.warn("media.src was changed by a third party - skip cleanup")), this.mediaSource = null, this.media = null, this._objectUrl = null, this.pendingTracks = {}, this.tracks = {}, this.sourceBuffer = {}, this.flushRange = [], this.segments = [], this.appended = 0;
        }this.onmso = this.onmse = this.onmsc = null, this.hls.trigger(Ot.a.MEDIA_DETACHED);
      }, e.prototype.onMediaSourceOpen = function () {
        Pt.b.log("media source opened"), this.hls.trigger(Ot.a.MEDIA_ATTACHED, { media: this.media });var t = this.mediaSource;t && t.removeEventListener("sourceopen", this.onmso), this.checkPendingTracks();
      }, e.prototype.checkPendingTracks = function () {
        var t = this.pendingTracks,
            e = Object.keys(t).length;e && (this.sourceBufferNb <= e || 0 === this.sourceBufferNb) && (this.createSourceBuffers(t), this.pendingTracks = {}, this.doAppending());
      }, e.prototype.onMediaSourceClose = function () {
        Pt.b.log("media source closed");
      }, e.prototype.onMediaSourceEnded = function () {
        Pt.b.log("media source ended");
      }, e.prototype.onSBUpdateEnd = function () {
        if (this.audioTimestampOffset) {
          var t = this.sourceBuffer.audio;Pt.b.warn("change mpeg audio timestamp offset from " + t.timestampOffset + " to " + this.audioTimestampOffset), t.timestampOffset = this.audioTimestampOffset, delete this.audioTimestampOffset;
        }this._needsFlush && this.doFlush(), this._needsEos && this.checkEos(), this.appending = !1;var e = this.parent,
            r = this.segments.reduce(function (t, r) {
          return r.parent === e ? t + 1 : t;
        }, 0);this.hls.trigger(Ot.a.BUFFER_APPENDED, { parent: e, pending: r }), this._needsFlush || this.doAppending(), this.updateMediaElementDuration();
      }, e.prototype.onSBUpdateError = function (t) {
        Pt.b.error("sourceBuffer error:", t), this.hls.trigger(Ot.a.ERROR, { type: Ct.b.MEDIA_ERROR, details: Ct.a.BUFFER_APPENDING_ERROR, fatal: !1 });
      }, e.prototype.onBufferReset = function () {
        var t = this.sourceBuffer;for (var e in t) {
          var r = t[e];try {
            this.mediaSource.removeSourceBuffer(r), r.removeEventListener("updateend", this.onsbue), r.removeEventListener("error", this.onsbe);
          } catch (t) {}
        }this.sourceBuffer = {}, this.flushRange = [], this.segments = [], this.appended = 0;
      }, e.prototype.onBufferCodecs = function (t) {
        if (0 === Object.keys(this.sourceBuffer).length) {
          for (var e in t) {
            this.pendingTracks[e] = t[e];
          }var r = this.mediaSource;r && "open" === r.readyState && this.checkPendingTracks();
        }
      }, e.prototype.createSourceBuffers = function (t) {
        var e = this.sourceBuffer,
            r = this.mediaSource;for (var i in t) {
          if (!e[i]) {
            var a = t[i],
                n = a.levelCodec || a.codec,
                o = a.container + ";codecs=" + n;Pt.b.log("creating sourceBuffer(" + o + ")");try {
              var s = e[i] = r.addSourceBuffer(o);s.addEventListener("updateend", this.onsbue), s.addEventListener("error", this.onsbe), this.tracks[i] = { codec: n, container: a.container }, a.buffer = s;
            } catch (t) {
              Pt.b.error("error while trying to add sourceBuffer:" + t.message), this.hls.trigger(Ot.a.ERROR, { type: Ct.b.MEDIA_ERROR, details: Ct.a.BUFFER_ADD_CODEC_ERROR, fatal: !1, err: t, mimeType: o });
            }
          }
        }this.hls.trigger(Ot.a.BUFFER_CREATED, { tracks: t });
      }, e.prototype.onBufferAppending = function (t) {
        this._needsFlush || (this.segments ? this.segments.push(t) : this.segments = [t], this.doAppending());
      }, e.prototype.onBufferAppendFail = function (t) {
        Pt.b.error("sourceBuffer error:", t.event), this.hls.trigger(Ot.a.ERROR, { type: Ct.b.MEDIA_ERROR, details: Ct.a.BUFFER_APPENDING_ERROR, fatal: !1 });
      }, e.prototype.onBufferEos = function (t) {
        var e = this.sourceBuffer,
            r = t.type;for (var i in e) {
          r && i !== r || e[i].ended || (e[i].ended = !0, Pt.b.log(i + " sourceBuffer now EOS"));
        }this.checkEos();
      }, e.prototype.checkEos = function () {
        var t = this.sourceBuffer,
            e = this.mediaSource;if (!e || "open" !== e.readyState) return void (this._needsEos = !1);for (var r in t) {
          var i = t[r];if (!i.ended) return;if (i.updating) return void (this._needsEos = !0);
        }Pt.b.log("all media data available, signal endOfStream() to MediaSource and stop loading fragment");try {
          e.endOfStream();
        } catch (t) {
          Pt.b.warn("exception while calling mediaSource.endOfStream()");
        }this._needsEos = !1;
      }, e.prototype.onBufferFlushing = function (t) {
        this.flushRange.push({ start: t.startOffset, end: t.endOffset, type: t.type }), this.flushBufferCounter = 0, this.doFlush();
      }, e.prototype.onLevelUpdated = function (t) {
        var e = t.details;e.fragments.length > 0 && (this._levelDuration = e.totalduration + e.fragments[0].start, this._live = e.live, this.updateMediaElementDuration());
      }, e.prototype.updateMediaElementDuration = function () {
        var t = this.hls.config,
            e = void 0;if (null !== this._levelDuration && this.media && this.mediaSource && this.sourceBuffer && 0 !== this.media.readyState && "open" === this.mediaSource.readyState) {
          for (var r in this.sourceBuffer) {
            if (!0 === this.sourceBuffer[r].updating) return;
          }e = this.media.duration, null === this._msDuration && (this._msDuration = this.mediaSource.duration), !0 === this._live && !0 === t.liveDurationInfinity ? (Pt.b.log("Media Source duration is set to Infinity"), this._msDuration = this.mediaSource.duration = 1 / 0) : (this._levelDuration > this._msDuration && this._levelDuration > e || e === 1 / 0 || isNaN(e)) && (Pt.b.log("Updating Media Source duration to " + this._levelDuration.toFixed(3)), this._msDuration = this.mediaSource.duration = this._levelDuration);
        }
      }, e.prototype.doFlush = function () {
        for (; this.flushRange.length;) {
          var t = this.flushRange[0];if (!this.flushBuffer(t.start, t.end, t.type)) return void (this._needsFlush = !0);this.flushRange.shift(), this.flushBufferCounter = 0;
        }if (0 === this.flushRange.length) {
          this._needsFlush = !1;var e = 0,
              r = this.sourceBuffer;try {
            for (var i in r) {
              e += r[i].buffered.length;
            }
          } catch (t) {
            Pt.b.error("error while accessing sourceBuffer.buffered");
          }this.appended = e, this.hls.trigger(Ot.a.BUFFER_FLUSHED);
        }
      }, e.prototype.doAppending = function () {
        var t = this.hls,
            e = this.sourceBuffer,
            r = this.segments;if (Object.keys(e).length) {
          if (this.media.error) return this.segments = [], void Pt.b.error("trying to append although a media error occured, flush segment and abort");if (this.appending) return;if (r && r.length) {
            var i = r.shift();try {
              var a = i.type,
                  n = e[a];n ? n.updating ? r.unshift(i) : (n.ended = !1, this.parent = i.parent, n.appendBuffer(i.data), this.appendError = 0, this.appended++, this.appending = !0) : this.onSBUpdateEnd();
            } catch (e) {
              Pt.b.error("error while trying to append buffer:" + e.message), r.unshift(i);var o = { type: Ct.b.MEDIA_ERROR, parent: i.parent };if (22 === e.code) return this.segments = [], o.details = Ct.a.BUFFER_FULL_ERROR, o.fatal = !1, void t.trigger(Ot.a.ERROR, o);if (this.appendError ? this.appendError++ : this.appendError = 1, o.details = Ct.a.BUFFER_APPEND_ERROR, this.appendError > t.config.appendErrorMaxRetry) return Pt.b.log("fail " + t.config.appendErrorMaxRetry + " times to append segment in sourceBuffer"), r = [], o.fatal = !0, void t.trigger(Ot.a.ERROR, o);o.fatal = !1, t.trigger(Ot.a.ERROR, o);
            }
          }
        }
      }, e.prototype.flushBuffer = function (t, e, r) {
        var i,
            a,
            n,
            o,
            s,
            l,
            u = this.sourceBuffer;if (Object.keys(u).length) {
          if (Pt.b.log("flushBuffer,pos/start/end: " + this.media.currentTime.toFixed(3) + "/" + t + "/" + e), this.flushBufferCounter < this.appended) {
            for (var d in u) {
              if (!r || d === r) {
                if (i = u[d], i.ended = !1, i.updating) return Pt.b.warn("cannot flush, sb updating in progress"), !1;try {
                  for (a = 0; a < i.buffered.length; a++) {
                    if (n = i.buffered.start(a), o = i.buffered.end(a), -1 !== navigator.userAgent.toLowerCase().indexOf("firefox") && e === Number.POSITIVE_INFINITY ? (s = t, l = e) : (s = Math.max(n, t), l = Math.min(o, e)), Math.min(l, o) - s > .5) return this.flushBufferCounter++, Pt.b.log("flush " + d + " [" + s + "," + l + "], of [" + n + "," + o + "], pos:" + this.media.currentTime), i.remove(s, l), !1;
                  }
                } catch (t) {
                  Pt.b.warn("exception while accessing sourcebuffer, it might have been removed from MediaSource");
                }
              }
            }
          } else Pt.b.warn("abort flushing too many retries");Pt.b.log("buffer flushed");
        }return !0;
      }, e;
    }(Nt),
        xe = Pe,
        Fe = function () {
      function t(t, e) {
        for (var r = 0; r < e.length; r++) {
          var i = e[r];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i);
        }
      }return function (e, r, i) {
        return r && t(e.prototype, r), i && t(e, i), e;
      };
    }(),
        Ne = function (t) {
      function e(r) {
        return Y(this, e), z(this, t.call(this, r, Ot.a.FPS_DROP_LEVEL_CAPPING, Ot.a.MEDIA_ATTACHING, Ot.a.MANIFEST_PARSED));
      }return X(e, t), e.prototype.destroy = function () {
        this.hls.config.capLevelToPlayerSize && (this.media = this.restrictedLevels = null, this.autoLevelCapping = Number.POSITIVE_INFINITY, this.timer && (this.timer = clearInterval(this.timer)));
      }, e.prototype.onFpsDropLevelCapping = function (t) {
        e.isLevelAllowed(t.droppedLevel, this.restrictedLevels) && this.restrictedLevels.push(t.droppedLevel);
      }, e.prototype.onMediaAttaching = function (t) {
        this.media = t.media instanceof HTMLVideoElement ? t.media : null;
      }, e.prototype.onManifestParsed = function (t) {
        var e = this.hls;this.restrictedLevels = [], e.config.capLevelToPlayerSize && (this.autoLevelCapping = Number.POSITIVE_INFINITY, this.levels = t.levels, e.firstLevel = this.getMaxLevel(t.firstLevel), clearInterval(this.timer), this.timer = setInterval(this.detectPlayerSize.bind(this), 1e3), this.detectPlayerSize());
      }, e.prototype.detectPlayerSize = function () {
        if (this.media) {
          var t = this.levels ? this.levels.length : 0;if (t) {
            var e = this.hls;e.autoLevelCapping = this.getMaxLevel(t - 1), e.autoLevelCapping > this.autoLevelCapping && e.streamController.nextLevelSwitch(), this.autoLevelCapping = e.autoLevelCapping;
          }
        }
      }, e.prototype.getMaxLevel = function (t) {
        var r = this;if (!this.levels) return -1;var i = this.levels.filter(function (i, a) {
          return e.isLevelAllowed(a, r.restrictedLevels) && a <= t;
        });return e.getMaxLevelByMediaSize(i, this.mediaWidth, this.mediaHeight);
      }, e.isLevelAllowed = function (t) {
        return -1 === (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : []).indexOf(t);
      }, e.getMaxLevelByMediaSize = function (t, e, r) {
        if (!t || t && !t.length) return -1;for (var i = t.length - 1, a = 0; a < t.length; a += 1) {
          var n = t[a];if ((n.width >= e || n.height >= r) && function (t, e) {
            return !e || t.width !== e.width || t.height !== e.height;
          }(n, t[a + 1])) {
            i = a;break;
          }
        }return i;
      }, Fe(e, [{ key: "mediaWidth", get: function get() {
          var t = void 0,
              r = this.media;return r && (t = r.width || r.clientWidth || r.offsetWidth, t *= e.contentScaleFactor), t;
        } }, { key: "mediaHeight", get: function get() {
          var t = void 0,
              r = this.media;return r && (t = r.height || r.clientHeight || r.offsetHeight, t *= e.contentScaleFactor), t;
        } }], [{ key: "contentScaleFactor", get: function get() {
          var t = 1;try {
            t = window.devicePixelRatio;
          } catch (t) {}return t;
        } }]), e;
    }(Nt),
        Me = Ne,
        Ue = function (t) {
      function e(r) {
        return q(this, e), Q(this, t.call(this, r, Ot.a.MEDIA_ATTACHING));
      }return J(e, t), e.prototype.destroy = function () {
        this.timer && clearInterval(this.timer), this.isVideoPlaybackQualityAvailable = !1;
      }, e.prototype.onMediaAttaching = function (t) {
        var e = this.hls.config;if (e.capLevelOnFPSDrop) {
          "function" == typeof (this.video = t.media instanceof HTMLVideoElement ? t.media : null).getVideoPlaybackQuality && (this.isVideoPlaybackQualityAvailable = !0), clearInterval(this.timer), this.timer = setInterval(this.checkFPSInterval.bind(this), e.fpsDroppedMonitoringPeriod);
        }
      }, e.prototype.checkFPS = function (t, e, r) {
        var i = performance.now();if (e) {
          if (this.lastTime) {
            var a = i - this.lastTime,
                n = r - this.lastDroppedFrames,
                o = e - this.lastDecodedFrames,
                s = 1e3 * n / a,
                l = this.hls;if (l.trigger(Ot.a.FPS_DROP, { currentDropped: n, currentDecoded: o, totalDroppedFrames: r }), s > 0 && n > l.config.fpsDroppedMonitoringThreshold * o) {
              var u = l.currentLevel;Pt.b.warn("drop FPS ratio greater than max allowed value for currentLevel: " + u), u > 0 && (-1 === l.autoLevelCapping || l.autoLevelCapping >= u) && (u -= 1, l.trigger(Ot.a.FPS_DROP_LEVEL_CAPPING, { level: u, droppedLevel: l.currentLevel }), l.autoLevelCapping = u, l.streamController.nextLevelSwitch());
            }
          }this.lastTime = i, this.lastDroppedFrames = r, this.lastDecodedFrames = e;
        }
      }, e.prototype.checkFPSInterval = function () {
        var t = this.video;if (t) if (this.isVideoPlaybackQualityAvailable) {
          var e = t.getVideoPlaybackQuality();this.checkFPS(t, e.totalVideoFrames, e.droppedVideoFrames);
        } else this.checkFPS(t, t.webkitDecodedFrameCount, t.webkitDroppedFrameCount);
      }, e;
    }(Nt),
        Be = Ue,
        Ge = function () {
      function t(e) {
        $(this, t), e && e.xhrSetup && (this.xhrSetup = e.xhrSetup);
      }return t.prototype.destroy = function () {
        this.abort(), this.loader = null;
      }, t.prototype.abort = function () {
        var t = this.loader;t && 4 !== t.readyState && (this.stats.aborted = !0, t.abort()), window.clearTimeout(this.requestTimeout), this.requestTimeout = null, window.clearTimeout(this.retryTimeout), this.retryTimeout = null;
      }, t.prototype.load = function (t, e, r) {
        this.context = t, this.config = e, this.callbacks = r, this.stats = { trequest: performance.now(), retry: 0 }, this.retryDelay = e.retryDelay, this.loadInternal();
      }, t.prototype.loadInternal = function () {
        var t,
            e = this.context;t = this.loader = new XMLHttpRequest();var r = this.stats;r.tfirst = 0, r.loaded = 0;var i = this.xhrSetup;try {
          if (i) try {
            i(t, e.url);
          } catch (r) {
            t.open("GET", e.url, !0), i(t, e.url);
          }t.readyState || t.open("GET", e.url, !0);
        } catch (r) {
          return void this.callbacks.onError({ code: t.status, text: r.message }, e, t);
        }e.rangeEnd && t.setRequestHeader("Range", "bytes=" + e.rangeStart + "-" + (e.rangeEnd - 1)), t.onreadystatechange = this.readystatechange.bind(this), t.onprogress = this.loadprogress.bind(this), t.responseType = e.responseType, this.requestTimeout = window.setTimeout(this.loadtimeout.bind(this), this.config.timeout), t.send();
      }, t.prototype.readystatechange = function (t) {
        var e = t.currentTarget,
            r = e.readyState,
            i = this.stats,
            a = this.context,
            n = this.config;if (!i.aborted && r >= 2) if (window.clearTimeout(this.requestTimeout), 0 === i.tfirst && (i.tfirst = Math.max(performance.now(), i.trequest)), 4 === r) {
          var o = e.status;if (o >= 200 && o < 300) {
            i.tload = Math.max(i.tfirst, performance.now());var s = void 0,
                l = void 0;"arraybuffer" === a.responseType ? (s = e.response, l = s.byteLength) : (s = e.responseText, l = s.length), i.loaded = i.total = l;var u = { url: e.responseURL, data: s };this.callbacks.onSuccess(u, i, a, e);
          } else i.retry >= n.maxRetry || o >= 400 && o < 499 ? (Pt.b.error(o + " while loading " + a.url), this.callbacks.onError({ code: o, text: e.statusText }, a, e)) : (Pt.b.warn(o + " while loading " + a.url + ", retrying in " + this.retryDelay + "..."), this.destroy(), this.retryTimeout = window.setTimeout(this.loadInternal.bind(this), this.retryDelay), this.retryDelay = Math.min(2 * this.retryDelay, n.maxRetryDelay), i.retry++);
        } else this.requestTimeout = window.setTimeout(this.loadtimeout.bind(this), n.timeout);
      }, t.prototype.loadtimeout = function () {
        Pt.b.warn("timeout while loading " + this.context.url), this.callbacks.onTimeout(this.stats, this.context, null);
      }, t.prototype.loadprogress = function (t) {
        var e = t.currentTarget,
            r = this.stats;r.loaded = t.loaded, t.lengthComputable && (r.total = t.total);var i = this.callbacks.onProgress;i && i(r, this.context, null, e);
      }, t;
    }(),
        je = Ge,
        He = function () {
      function t(t, e) {
        for (var r = 0; r < e.length; r++) {
          var i = e[r];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i);
        }
      }return function (e, r, i) {
        return r && t(e.prototype, r), i && t(e, i), e;
      };
    }(),
        Ke = function (t) {
      function e(r) {
        Z(this, e);var i = tt(this, t.call(this, r, Ot.a.MANIFEST_LOADING, Ot.a.MANIFEST_PARSED, Ot.a.AUDIO_TRACK_LOADED, Ot.a.ERROR));return i.ticks = 0, i.ontick = i.tick.bind(i), i;
      }return et(e, t), e.prototype.destroy = function () {
        this.cleanTimer(), Nt.prototype.destroy.call(this);
      }, e.prototype.cleanTimer = function () {
        this.timer && (clearTimeout(this.timer), this.timer = null);
      }, e.prototype.tick = function () {
        1 === ++this.ticks && (this.doTick(), this.ticks > 1 && setTimeout(this.tick, 1), this.ticks = 0);
      }, e.prototype.doTick = function () {
        this.updateTrack(this.trackId);
      }, e.prototype.onError = function (t) {
        t.fatal && t.type === Ct.b.NETWORK_ERROR && this.cleanTimer();
      }, e.prototype.onManifestLoading = function () {
        this.tracks = [], this.trackId = -1;
      }, e.prototype.onManifestParsed = function (t) {
        var e = this,
            r = t.audioTracks || [],
            i = !1;this.tracks = r, this.hls.trigger(Ot.a.AUDIO_TRACKS_UPDATED, { audioTracks: r });var a = 0;r.forEach(function (t) {
          if (t.default && !i) return e.audioTrack = a, void (i = !0);a++;
        }), !1 === i && r.length && (Pt.b.log("no default audio track defined, use first audio track as default"), this.audioTrack = 0);
      }, e.prototype.onAudioTrackLoaded = function (t) {
        t.id < this.tracks.length && (Pt.b.log("audioTrack " + t.id + " loaded"), this.tracks[t.id].details = t.details, t.details.live && !this.timer && (this.timer = setInterval(this.ontick, 1e3 * t.details.targetduration)), !t.details.live && this.timer && this.cleanTimer());
      }, e.prototype.setAudioTrackInternal = function (t) {
        if (t >= 0 && t < this.tracks.length) {
          this.cleanTimer(), this.trackId = t, Pt.b.log("switching to audioTrack " + t);var e = this.tracks[t],
              r = this.hls,
              i = e.type,
              a = e.url,
              n = { id: t, type: i, url: a };r.trigger(Ot.a.AUDIO_TRACK_SWITCH, n), r.trigger(Ot.a.AUDIO_TRACK_SWITCHING, n);var o = e.details;!a || void 0 !== o && !0 !== o.live || (Pt.b.log("(re)loading playlist for audioTrack " + t), r.trigger(Ot.a.AUDIO_TRACK_LOADING, { url: a, id: t }));
        }
      }, e.prototype.updateTrack = function (t) {
        if (t >= 0 && t < this.tracks.length) {
          this.cleanTimer(), this.trackId = t, Pt.b.log("updating audioTrack " + t);var e = this.tracks[t],
              r = e.url,
              i = e.details;!r || void 0 !== i && !0 !== i.live || (Pt.b.log("(re)loading playlist for audioTrack " + t), this.hls.trigger(Ot.a.AUDIO_TRACK_LOADING, { url: r, id: t }));
        }
      }, He(e, [{ key: "audioTracks", get: function get() {
          return this.tracks;
        } }, { key: "audioTrack", get: function get() {
          return this.trackId;
        }, set: function set(t) {
          this.trackId === t && void 0 !== this.tracks[t].details || this.setAudioTrackInternal(t);
        } }]), e;
    }(Nt),
        We = Ke,
        Ve = function () {
      function t(t, e) {
        for (var r = 0; r < e.length; r++) {
          var i = e[r];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i);
        }
      }return function (e, r, i) {
        return r && t(e.prototype, r), i && t(e, i), e;
      };
    }(),
        Ye = { STOPPED: "STOPPED", STARTING: "STARTING", IDLE: "IDLE", PAUSED: "PAUSED", KEY_LOADING: "KEY_LOADING", FRAG_LOADING: "FRAG_LOADING", FRAG_LOADING_WAITING_RETRY: "FRAG_LOADING_WAITING_RETRY", WAITING_TRACK: "WAITING_TRACK", PARSING: "PARSING", PARSED: "PARSED", BUFFER_FLUSHING: "BUFFER_FLUSHING", ENDED: "ENDED", ERROR: "ERROR", WAITING_INIT_PTS: "WAITING_INIT_PTS" },
        ze = function (t) {
      function e(r) {
        rt(this, e);var i = it(this, t.call(this, r, Ot.a.MEDIA_ATTACHED, Ot.a.MEDIA_DETACHING, Ot.a.AUDIO_TRACKS_UPDATED, Ot.a.AUDIO_TRACK_SWITCHING, Ot.a.AUDIO_TRACK_LOADED, Ot.a.KEY_LOADED, Ot.a.FRAG_LOADED, Ot.a.FRAG_PARSING_INIT_SEGMENT, Ot.a.FRAG_PARSING_DATA, Ot.a.FRAG_PARSED, Ot.a.ERROR, Ot.a.BUFFER_RESET, Ot.a.BUFFER_CREATED, Ot.a.BUFFER_APPENDED, Ot.a.BUFFER_FLUSHED, Ot.a.INIT_PTS_FOUND));return i.config = r.config, i.audioCodecSwap = !1, i.ticks = 0, i._state = Ye.STOPPED, i.ontick = i.tick.bind(i), i.initPTS = [], i.waitingFragment = null, i.videoTrackCC = null, i;
      }return at(e, t), e.prototype.destroy = function () {
        this.stopLoad(), this.timer && (clearInterval(this.timer), this.timer = null), Nt.prototype.destroy.call(this), this.state = Ye.STOPPED;
      }, e.prototype.onInitPtsFound = function (t) {
        var e = t.id,
            r = t.frag.cc,
            i = t.initPTS;"main" === e && (this.initPTS[r] = i, this.videoTrackCC = r, Pt.b.log("InitPTS for cc:" + r + " found from video track:" + i), this.state === Ye.WAITING_INIT_PTS && this.tick());
      }, e.prototype.startLoad = function (t) {
        if (this.tracks) {
          var e = this.lastCurrentTime;this.stopLoad(), this.timer || (this.timer = setInterval(this.ontick, 100)), this.fragLoadError = 0, e > 0 && -1 === t ? (Pt.b.log("audio:override startPosition with lastCurrentTime @" + e.toFixed(3)), this.state = Ye.IDLE) : (this.lastCurrentTime = this.startPosition ? this.startPosition : t, this.state = Ye.STARTING), this.nextLoadPosition = this.startPosition = this.lastCurrentTime, this.tick();
        } else this.startPosition = t, this.state = Ye.STOPPED;
      }, e.prototype.stopLoad = function () {
        var t = this.fragCurrent;t && (t.loader && t.loader.abort(), this.fragCurrent = null), this.fragPrevious = null, this.demuxer && (this.demuxer.destroy(), this.demuxer = null), this.state = Ye.STOPPED;
      }, e.prototype.tick = function () {
        1 === ++this.ticks && (this.doTick(), this.ticks > 1 && setTimeout(this.tick, 1), this.ticks = 0);
      }, e.prototype.doTick = function () {
        var t,
            e,
            r,
            i = this.hls,
            a = i.config;switch (this.state) {case Ye.ERROR:case Ye.PAUSED:case Ye.BUFFER_FLUSHING:
            break;case Ye.STARTING:
            this.state = Ye.WAITING_TRACK, this.loadedmetadata = !1;break;case Ye.IDLE:
            var n = this.tracks;if (!n) break;if (!this.media && (this.startFragRequested || !a.startFragPrefetch)) break;if (this.loadedmetadata) t = this.media.currentTime;else if (void 0 === (t = this.nextLoadPosition)) break;var o = this.mediaBuffer ? this.mediaBuffer : this.media,
                s = this.videoBuffer ? this.videoBuffer : this.media,
                l = ae.bufferInfo(o, t, a.maxBufferHole),
                u = ae.bufferInfo(s, t, a.maxBufferHole),
                d = l.len,
                h = l.end,
                c = this.fragPrevious,
                f = Math.max(a.maxBufferLength, u.len),
                p = this.audioSwitch,
                g = this.trackId;if ((d < f || p) && g < n.length) {
              if (void 0 === (r = n[g].details)) {
                this.state = Ye.WAITING_TRACK;break;
              }if (!p && !r.live && c && c.sn === r.endSN && !l.nextStart && (!this.media.seeking || this.media.duration - h < c.duration / 2)) {
                this.hls.trigger(Ot.a.BUFFER_EOS, { type: "audio" }), this.state = Ye.ENDED;break;
              }var v = r.fragments,
                  y = v.length,
                  m = v[0].start,
                  b = v[y - 1].start + v[y - 1].duration,
                  E = void 0;if (p) if (r.live && !r.PTSKnown) Pt.b.log("switching audiotrack, live stream, unknown PTS,load first fragment"), h = 0;else if (h = t, r.PTSKnown && t < m) {
                if (!(l.end > m || l.nextStart)) return;Pt.b.log("alt audio track ahead of main track, seek to start of alt audio track"), this.media.currentTime = m + .05;
              }if (r.initSegment && !r.initSegment.data) E = r.initSegment;else if (h <= m) {
                if (E = v[0], null !== this.videoTrackCC && E.cc !== this.videoTrackCC && (E = A(v, this.videoTrackCC)), r.live && E.loadIdx && E.loadIdx === this.fragLoadIdx) {
                  var T = l.nextStart ? l.nextStart : m;return Pt.b.log("no alt audio available @currentTime:" + this.media.currentTime + ", seeking @" + (T + .05)), void (this.media.currentTime = T + .05);
                }
              } else {
                var R = void 0,
                    S = a.maxFragLookUpTolerance,
                    L = c ? v[c.sn - v[0].sn + 1] : void 0,
                    _ = function _(t) {
                  var e = Math.min(S, t.duration);return t.start + t.duration - e <= h ? 1 : t.start - e > h && t.start ? -1 : 0;
                };h < b ? (h > b - S && (S = 0), R = L && !_(L) ? L : re.search(v, _)) : R = v[y - 1], R && (E = R, m = R.start, c && E.level === c.level && E.sn === c.sn && (E.sn < r.endSN ? (E = v[E.sn + 1 - r.startSN], Pt.b.log("SN just loaded, load next one: " + E.sn)) : E = null));
              }if (E) if (E.decryptdata && null != E.decryptdata.uri && null == E.decryptdata.key) Pt.b.log("Loading key for " + E.sn + " of [" + r.startSN + " ," + r.endSN + "],track " + g), this.state = Ye.KEY_LOADING, i.trigger(Ot.a.KEY_LOADING, { frag: E });else {
                if (Pt.b.log("Loading " + E.sn + ", cc: " + E.cc + " of [" + r.startSN + " ," + r.endSN + "],track " + g + ", currentTime:" + t + ",bufferEnd:" + h.toFixed(3)), void 0 !== this.fragLoadIdx ? this.fragLoadIdx++ : this.fragLoadIdx = 0, E.loadCounter) {
                  E.loadCounter++;var w = a.fragLoadingLoopThreshold;if (E.loadCounter > w && Math.abs(this.fragLoadIdx - E.loadIdx) < w) return void i.trigger(Ot.a.ERROR, { type: Ct.b.MEDIA_ERROR, details: Ct.a.FRAG_LOOP_LOADING_ERROR, fatal: !1, frag: E });
                } else E.loadCounter = 1;E.loadIdx = this.fragLoadIdx, this.fragCurrent = E, this.startFragRequested = !0, isNaN(E.sn) || (this.nextLoadPosition = E.start + E.duration), i.trigger(Ot.a.FRAG_LOADING, { frag: E }), this.state = Ye.FRAG_LOADING;
              }
            }break;case Ye.WAITING_TRACK:
            e = this.tracks[this.trackId], e && e.details && (this.state = Ye.IDLE);break;case Ye.FRAG_LOADING_WAITING_RETRY:
            var D = performance.now(),
                I = this.retryDate;o = this.media;var k = o && o.seeking;(!I || D >= I || k) && (Pt.b.log("audioStreamController: retryDate reached, switch back to IDLE state"), this.state = Ye.IDLE);break;case Ye.WAITING_INIT_PTS:
            var O = this.videoTrackCC;if (void 0 === this.initPTS[O]) break;var C = this.waitingFragment;if (C) {
              var P = C.frag.cc;O !== P ? (e = this.tracks[this.trackId], e.details && e.details.live && (Pt.b.warn("Waiting fragment CC (" + P + ") does not match video track CC (" + O + ")"), this.waitingFragment = null, this.state = Ye.IDLE)) : (this.state = Ye.FRAG_LOADING, this.onFragLoaded(this.waitingFragment), this.waitingFragment = null);
            } else this.state = Ye.IDLE;break;case Ye.STOPPED:case Ye.FRAG_LOADING:case Ye.PARSING:case Ye.PARSED:case Ye.ENDED:}
      }, e.prototype.onMediaAttached = function (t) {
        var e = this.media = this.mediaBuffer = t.media;this.onvseeking = this.onMediaSeeking.bind(this), this.onvended = this.onMediaEnded.bind(this), e.addEventListener("seeking", this.onvseeking), e.addEventListener("ended", this.onvended);var r = this.config;this.tracks && r.autoStartLoad && this.startLoad(r.startPosition);
      }, e.prototype.onMediaDetaching = function () {
        var t = this.media;t && t.ended && (Pt.b.log("MSE detaching and video ended, reset startPosition"), this.startPosition = this.lastCurrentTime = 0);var e = this.tracks;e && e.forEach(function (t) {
          t.details && t.details.fragments.forEach(function (t) {
            t.loadCounter = void 0;
          });
        }), t && (t.removeEventListener("seeking", this.onvseeking), t.removeEventListener("ended", this.onvended), this.onvseeking = this.onvseeked = this.onvended = null), this.media = this.mediaBuffer = this.videoBuffer = null, this.loadedmetadata = !1, this.stopLoad();
      }, e.prototype.onMediaSeeking = function () {
        this.state === Ye.ENDED && (this.state = Ye.IDLE), this.media && (this.lastCurrentTime = this.media.currentTime), void 0 !== this.fragLoadIdx && (this.fragLoadIdx += 2 * this.config.fragLoadingLoopThreshold), this.tick();
      }, e.prototype.onMediaEnded = function () {
        this.startPosition = this.lastCurrentTime = 0;
      }, e.prototype.onAudioTracksUpdated = function (t) {
        Pt.b.log("audio tracks updated"), this.tracks = t.audioTracks;
      }, e.prototype.onAudioTrackSwitching = function (t) {
        var e = !!t.url;this.trackId = t.id, this.fragCurrent = null, this.state = Ye.PAUSED, this.waitingFragment = null, e ? this.timer || (this.timer = setInterval(this.ontick, 100)) : this.demuxer && (this.demuxer.destroy(), this.demuxer = null), e && (this.audioSwitch = !0, this.state = Ye.IDLE, void 0 !== this.fragLoadIdx && (this.fragLoadIdx += 2 * this.config.fragLoadingLoopThreshold)), this.tick();
      }, e.prototype.onAudioTrackLoaded = function (t) {
        var e = t.details,
            r = t.id,
            i = this.tracks[r],
            a = e.totalduration,
            n = 0;if (Pt.b.log("track " + r + " loaded [" + e.startSN + "," + e.endSN + "],duration:" + a), e.live) {
          var o = i.details;o && e.fragments.length > 0 ? (T(o, e), n = e.fragments[0].start, e.PTSKnown ? Pt.b.log("live audio playlist sliding:" + n.toFixed(3)) : Pt.b.log("live audio playlist - outdated PTS, unknown sliding")) : (e.PTSKnown = !1, Pt.b.log("live audio playlist - first load, unknown sliding"));
        } else e.PTSKnown = !1;if (i.details = e, !this.startFragRequested) {
          if (-1 === this.startPosition) {
            var s = e.startTimeOffset;isNaN(s) ? this.startPosition = 0 : (Pt.b.log("start time offset found in playlist, adjust startPosition to " + s), this.startPosition = s);
          }this.nextLoadPosition = this.startPosition;
        }this.state === Ye.WAITING_TRACK && (this.state = Ye.IDLE), this.tick();
      }, e.prototype.onKeyLoaded = function () {
        this.state === Ye.KEY_LOADING && (this.state = Ye.IDLE, this.tick());
      }, e.prototype.onFragLoaded = function (t) {
        var e = this.fragCurrent,
            r = t.frag;if (this.state === Ye.FRAG_LOADING && e && "audio" === r.type && r.level === e.level && r.sn === e.sn) {
          var i = this.tracks[this.trackId],
              a = i.details,
              n = a.totalduration,
              o = e.level,
              s = e.sn,
              l = e.cc,
              u = this.config.defaultAudioCodec || i.audioCodec || "mp4a.40.2",
              d = this.stats = t.stats;if ("initSegment" === s) this.state = Ye.IDLE, d.tparsed = d.tbuffered = performance.now(), a.initSegment.data = t.payload, this.hls.trigger(Ot.a.FRAG_BUFFERED, { stats: d, frag: e, id: "audio" }), this.tick();else {
            this.state = Ye.PARSING, this.appended = !1, this.demuxer || (this.demuxer = new ce(this.hls, "audio"));var h = this.initPTS[l],
                c = a.initSegment ? a.initSegment.data : [];if (a.initSegment || void 0 !== h) {
              this.pendingBuffering = !0, Pt.b.log("Demuxing " + s + " of [" + a.startSN + " ," + a.endSN + "],track " + o);this.demuxer.push(t.payload, c, u, null, e, n, !1, h);
            } else Pt.b.log("unknown video PTS for continuity counter " + l + ", waiting for video PTS before demuxing audio frag " + s + " of [" + a.startSN + " ," + a.endSN + "],track " + o), this.waitingFragment = t, this.state = Ye.WAITING_INIT_PTS;
          }
        }this.fragLoadError = 0;
      }, e.prototype.onFragParsingInitSegment = function (t) {
        var e = this.fragCurrent,
            r = t.frag;if (e && "audio" === t.id && r.sn === e.sn && r.level === e.level && this.state === Ye.PARSING) {
          var i = t.tracks,
              a = void 0;if (i.video && delete i.video, a = i.audio) {
            a.levelCodec = a.codec, a.id = t.id, this.hls.trigger(Ot.a.BUFFER_CODECS, i), Pt.b.log("audio track:audio,container:" + a.container + ",codecs[level/parsed]=[" + a.levelCodec + "/" + a.codec + "]");var n = a.initSegment;if (n) {
              var o = { type: "audio", data: n, parent: "audio", content: "initSegment" };this.audioSwitch ? this.pendingData = [o] : (this.appended = !0, this.pendingBuffering = !0, this.hls.trigger(Ot.a.BUFFER_APPENDING, o));
            }this.tick();
          }
        }
      }, e.prototype.onFragParsingData = function (t) {
        var e = this,
            r = this.fragCurrent,
            i = t.frag;if (r && "audio" === t.id && "audio" === t.type && i.sn === r.sn && i.level === r.level && this.state === Ye.PARSING) {
          var a = this.trackId,
              n = this.tracks[a],
              o = this.hls;isNaN(t.endPTS) && (t.endPTS = t.startPTS + r.duration, t.endDTS = t.startDTS + r.duration), Pt.b.log("parsed " + t.type + ",PTS:[" + t.startPTS.toFixed(3) + "," + t.endPTS.toFixed(3) + "],DTS:[" + t.startDTS.toFixed(3) + "/" + t.endDTS.toFixed(3) + "],nb:" + t.nb), E(n.details, r, t.startPTS, t.endPTS);var s = this.audioSwitch,
              l = this.media,
              u = !1;if (s && l) if (l.readyState) {
            var d = l.currentTime;Pt.b.log("switching audio track : currentTime:" + d), d >= t.startPTS && (Pt.b.log("switching audio track : flushing all audio"), this.state = Ye.BUFFER_FLUSHING, o.trigger(Ot.a.BUFFER_FLUSHING, { startOffset: 0, endOffset: Number.POSITIVE_INFINITY, type: "audio" }), u = !0, this.audioSwitch = !1, o.trigger(Ot.a.AUDIO_TRACK_SWITCHED, { id: a }));
          } else this.audioSwitch = !1, o.trigger(Ot.a.AUDIO_TRACK_SWITCHED, { id: a });var h = this.pendingData;this.audioSwitch || ([t.data1, t.data2].forEach(function (e) {
            e && e.length && h.push({ type: t.type, data: e, parent: "audio", content: "data" });
          }), !u && h.length && (h.forEach(function (t) {
            e.state === Ye.PARSING && (e.pendingBuffering = !0, e.hls.trigger(Ot.a.BUFFER_APPENDING, t));
          }), this.pendingData = [], this.appended = !0)), this.tick();
        }
      }, e.prototype.onFragParsed = function (t) {
        var e = this.fragCurrent,
            r = t.frag;e && "audio" === t.id && r.sn === e.sn && r.level === e.level && this.state === Ye.PARSING && (this.stats.tparsed = performance.now(), this.state = Ye.PARSED, this._checkAppendedParsed());
      }, e.prototype.onBufferReset = function () {
        this.mediaBuffer = this.videoBuffer = null, this.loadedmetadata = !1;
      }, e.prototype.onBufferCreated = function (t) {
        var e = t.tracks.audio;e && (this.mediaBuffer = e.buffer, this.loadedmetadata = !0), t.tracks.video && (this.videoBuffer = t.tracks.video.buffer);
      }, e.prototype.onBufferAppended = function (t) {
        if ("audio" === t.parent) {
          var e = this.state;e !== Ye.PARSING && e !== Ye.PARSED || (this.pendingBuffering = t.pending > 0, this._checkAppendedParsed());
        }
      }, e.prototype._checkAppendedParsed = function () {
        if (!(this.state !== Ye.PARSED || this.appended && this.pendingBuffering)) {
          var t = this.fragCurrent,
              e = this.stats,
              r = this.hls;if (t) {
            this.fragPrevious = t, e.tbuffered = performance.now(), r.trigger(Ot.a.FRAG_BUFFERED, { stats: e, frag: t, id: "audio" });var i = this.mediaBuffer ? this.mediaBuffer : this.media;Pt.b.log("audio buffered : " + pe.toString(i.buffered)), this.audioSwitch && this.appended && (this.audioSwitch = !1, r.trigger(Ot.a.AUDIO_TRACK_SWITCHED, { id: this.trackId })), this.state = Ye.IDLE;
          }this.tick();
        }
      }, e.prototype.onError = function (t) {
        var e = t.frag;if (!e || "audio" === e.type) switch (t.details) {case Ct.a.FRAG_LOAD_ERROR:case Ct.a.FRAG_LOAD_TIMEOUT:
            if (!t.fatal) {
              var r = this.fragLoadError;r ? r++ : r = 1;var i = this.config;if (r <= i.fragLoadingMaxRetry) {
                this.fragLoadError = r, e.loadCounter = 0;var a = Math.min(Math.pow(2, r - 1) * i.fragLoadingRetryDelay, i.fragLoadingMaxRetryTimeout);Pt.b.warn("audioStreamController: frag loading failed, retry in " + a + " ms"), this.retryDate = performance.now() + a, this.state = Ye.FRAG_LOADING_WAITING_RETRY;
              } else Pt.b.error("audioStreamController: " + t.details + " reaches max retry, redispatch as fatal ..."), t.fatal = !0, this.state = Ye.ERROR;
            }break;case Ct.a.FRAG_LOOP_LOADING_ERROR:case Ct.a.AUDIO_TRACK_LOAD_ERROR:case Ct.a.AUDIO_TRACK_LOAD_TIMEOUT:case Ct.a.KEY_LOAD_ERROR:case Ct.a.KEY_LOAD_TIMEOUT:
            this.state !== Ye.ERROR && (this.state = t.fatal ? Ye.ERROR : Ye.IDLE, Pt.b.warn("audioStreamController: " + t.details + " while loading frag,switch to " + this.state + " state ..."));break;case Ct.a.BUFFER_FULL_ERROR:
            if ("audio" === t.parent && (this.state === Ye.PARSING || this.state === Ye.PARSED)) {
              var n = this.mediaBuffer,
                  o = this.media.currentTime;if (n && ae.isBuffered(n, o) && ae.isBuffered(n, o + .5)) {
                var s = this.config;s.maxMaxBufferLength >= s.maxBufferLength && (s.maxMaxBufferLength /= 2, Pt.b.warn("audio:reduce max buffer length to " + s.maxMaxBufferLength + "s"), this.fragLoadIdx += 2 * s.fragLoadingLoopThreshold), this.state = Ye.IDLE;
              } else Pt.b.warn("buffer full error also media.currentTime is not buffered, flush audio buffer"), this.fragCurrent = null, this.state = Ye.BUFFER_FLUSHING, this.hls.trigger(Ot.a.BUFFER_FLUSHING, { startOffset: 0, endOffset: Number.POSITIVE_INFINITY, type: "audio" });
            }}
      }, e.prototype.onBufferFlushed = function () {
        var t = this,
            e = this.pendingData;e && e.length ? (Pt.b.log("appending pending audio data on Buffer Flushed"), e.forEach(function (e) {
          t.hls.trigger(Ot.a.BUFFER_APPENDING, e);
        }), this.appended = !0, this.pendingData = [], this.state = Ye.PARSED) : (this.state = Ye.IDLE, this.fragPrevious = null, this.tick());
      }, Ve(e, [{ key: "state", set: function set(t) {
          if (this.state !== t) {
            var e = this.state;this._state = t, Pt.b.log("audio stream:" + e + "->" + t);
          }
        }, get: function get() {
          return this._state;
        } }]), e;
    }(Nt),
        Xe = ze,
        qe = function () {
      function t(t) {
        return "string" == typeof t && !!n[t.toLowerCase()] && t.toLowerCase();
      }function e(t) {
        return "string" == typeof t && !!o[t.toLowerCase()] && t.toLowerCase();
      }function r(t) {
        for (var e = 1; e < arguments.length; e++) {
          var r = arguments[e];for (var i in r) {
            t[i] = r[i];
          }
        }return t;
      }function i(i, n, o) {
        var s = this,
            l = function () {
          if ("undefined" != typeof navigator) return (/MSIE\s8\.0/.test(navigator.userAgent)
          );
        }(),
            u = {};l ? s = document.createElement("custom") : u.enumerable = !0, s.hasBeenReset = !1;var d = "",
            h = !1,
            c = i,
            f = n,
            p = o,
            g = null,
            v = "",
            y = !0,
            m = "auto",
            b = "start",
            E = 50,
            T = "middle",
            R = 50,
            A = "middle";if (Object.defineProperty(s, "id", r({}, u, { get: function get() {
            return d;
          }, set: function set(t) {
            d = "" + t;
          } })), Object.defineProperty(s, "pauseOnExit", r({}, u, { get: function get() {
            return h;
          }, set: function set(t) {
            h = !!t;
          } })), Object.defineProperty(s, "startTime", r({}, u, { get: function get() {
            return c;
          }, set: function set(t) {
            if ("number" != typeof t) throw new TypeError("Start time must be set to a number.");c = t, this.hasBeenReset = !0;
          } })), Object.defineProperty(s, "endTime", r({}, u, { get: function get() {
            return f;
          }, set: function set(t) {
            if ("number" != typeof t) throw new TypeError("End time must be set to a number.");f = t, this.hasBeenReset = !0;
          } })), Object.defineProperty(s, "text", r({}, u, { get: function get() {
            return p;
          }, set: function set(t) {
            p = "" + t, this.hasBeenReset = !0;
          } })), Object.defineProperty(s, "region", r({}, u, { get: function get() {
            return g;
          }, set: function set(t) {
            g = t, this.hasBeenReset = !0;
          } })), Object.defineProperty(s, "vertical", r({}, u, { get: function get() {
            return v;
          }, set: function set(e) {
            var r = t(e);if (!1 === r) throw new SyntaxError("An invalid or illegal string was specified.");v = r, this.hasBeenReset = !0;
          } })), Object.defineProperty(s, "snapToLines", r({}, u, { get: function get() {
            return y;
          }, set: function set(t) {
            y = !!t, this.hasBeenReset = !0;
          } })), Object.defineProperty(s, "line", r({}, u, { get: function get() {
            return m;
          }, set: function set(t) {
            if ("number" != typeof t && t !== a) throw new SyntaxError("An invalid number or illegal string was specified.");m = t, this.hasBeenReset = !0;
          } })), Object.defineProperty(s, "lineAlign", r({}, u, { get: function get() {
            return b;
          }, set: function set(t) {
            var r = e(t);if (!r) throw new SyntaxError("An invalid or illegal string was specified.");b = r, this.hasBeenReset = !0;
          } })), Object.defineProperty(s, "position", r({}, u, { get: function get() {
            return E;
          }, set: function set(t) {
            if (t < 0 || t > 100) throw new Error("Position must be between 0 and 100.");E = t, this.hasBeenReset = !0;
          } })), Object.defineProperty(s, "positionAlign", r({}, u, { get: function get() {
            return T;
          }, set: function set(t) {
            var r = e(t);if (!r) throw new SyntaxError("An invalid or illegal string was specified.");T = r, this.hasBeenReset = !0;
          } })), Object.defineProperty(s, "size", r({}, u, { get: function get() {
            return R;
          }, set: function set(t) {
            if (t < 0 || t > 100) throw new Error("Size must be between 0 and 100.");R = t, this.hasBeenReset = !0;
          } })), Object.defineProperty(s, "align", r({}, u, { get: function get() {
            return A;
          }, set: function set(t) {
            var r = e(t);if (!r) throw new SyntaxError("An invalid or illegal string was specified.");A = r, this.hasBeenReset = !0;
          } })), s.displayState = void 0, l) return s;
      }if ("undefined" != typeof window && window.VTTCue) return window.VTTCue;var a = "auto",
          n = { "": !0, lr: !0, rl: !0 },
          o = { start: !0, middle: !0, end: !0, left: !0, right: !0 };return i.prototype.getCueAsHTML = function () {
        return window.WebVTT.convertCueToDOMTree(window, this.text);
      }, i;
    }(),
        Qe = function Qe() {
      return { decode: function decode(t) {
          if (!t) return "";if ("string" != typeof t) throw new Error("Error - expected string data.");return decodeURIComponent(encodeURIComponent(t));
        } };
    };st.prototype = { set: function set(t, e) {
        this.get(t) || "" === e || (this.values[t] = e);
      }, get: function get(t, e, r) {
        return r ? this.has(t) ? this.values[t] : e[r] : this.has(t) ? this.values[t] : e;
      }, has: function has(t) {
        return t in this.values;
      }, alt: function alt(t, e, r) {
        for (var i = 0; i < r.length; ++i) {
          if (e === r[i]) {
            this.set(t, e);break;
          }
        }
      }, integer: function integer(t, e) {
        /^-?\d+$/.test(e) && this.set(t, parseInt(e, 10));
      }, percent: function percent(t, e) {
        return !!(e.match(/^([\d]{1,3})(\.[\d]*)?%$/) && (e = parseFloat(e)) >= 0 && e <= 100) && (this.set(t, e), !0);
      } };var Je = new qe(0, 0, 0),
        $e = "middle" === Je.align ? "middle" : "center";nt.prototype = { parse: function parse(t) {
        function e() {
          var t = r.buffer,
              e = 0;for (t = dt(t); e < t.length && "\r" !== t[e] && "\n" !== t[e];) {
            ++e;
          }var i = t.substr(0, e);return "\r" === t[e] && ++e, "\n" === t[e] && ++e, r.buffer = t.substr(e), i;
        }var r = this;t && (r.buffer += r.decoder.decode(t, { stream: !0 }));try {
          var i;if ("INITIAL" === r.state) {
            if (!/\r\n|\n/.test(r.buffer)) return this;i = e();var a = i.match(/^(ï»¿)?WEBVTT([ \t].*)?$/);if (!a || !a[0]) throw new Error("Malformed WebVTT signature.");r.state = "HEADER";
          }for (var n = !1; r.buffer;) {
            if (!/\r\n|\n/.test(r.buffer)) return this;switch (n ? n = !1 : i = e(), r.state) {case "HEADER":
                /:/.test(i) ? function (t) {
                  lt(t, function (t, e) {
                    switch (t) {case "Region":
                        console.log("parse region", e);}
                  }, /:/);
                }(i) : i || (r.state = "ID");continue;case "NOTE":
                i || (r.state = "ID");continue;case "ID":
                if (/^NOTE($|[ \t])/.test(i)) {
                  r.state = "NOTE";break;
                }if (!i) continue;if (r.cue = new qe(0, 0, ""), r.state = "CUE", -1 === i.indexOf("--\x3e")) {
                  r.cue.id = i;continue;
                }case "CUE":
                try {
                  ut(i, r.cue, r.regionList);
                } catch (t) {
                  r.cue = null, r.state = "BADCUE";continue;
                }r.state = "CUETEXT";continue;case "CUETEXT":
                var o = -1 !== i.indexOf("--\x3e");if (!i || o && (n = !0)) {
                  r.oncue && r.oncue(r.cue), r.cue = null, r.state = "ID";continue;
                }r.cue.text && (r.cue.text += "\n"), r.cue.text += i;continue;case "BADCUE":
                i || (r.state = "ID");continue;}
          }
        } catch (t) {
          "CUETEXT" === r.state && r.cue && r.oncue && r.oncue(r.cue), r.cue = null, r.state = "INITIAL" === r.state ? "BADWEBVTT" : "BADCUE";
        }return this;
      }, flush: function flush() {
        var t = this;try {
          if (t.buffer += t.decoder.decode(), (t.cue || "HEADER" === t.state) && (t.buffer += "\n\n", t.parse()), "INITIAL" === t.state) throw new Error("Malformed WebVTT signature.");
        } catch (t) {
          throw t;
        }return t.onflush && t.onflush(), this;
      } };var Ze = nt,
        tr = { 42: 225, 92: 233, 94: 237, 95: 243, 96: 250, 123: 231, 124: 247, 125: 209, 126: 241, 127: 9608, 128: 174, 129: 176, 130: 189, 131: 191, 132: 8482, 133: 162, 134: 163, 135: 9834, 136: 224, 137: 32, 138: 232, 139: 226, 140: 234, 141: 238, 142: 244, 143: 251, 144: 193, 145: 201, 146: 211, 147: 218, 148: 220, 149: 252, 150: 8216, 151: 161, 152: 42, 153: 8217, 154: 9473, 155: 169, 156: 8480, 157: 8226, 158: 8220, 159: 8221, 160: 192, 161: 194, 162: 199, 163: 200, 164: 202, 165: 203, 166: 235, 167: 206, 168: 207, 169: 239, 170: 212, 171: 217, 172: 249, 173: 219, 174: 171, 175: 187, 176: 195, 177: 227, 178: 205, 179: 204, 180: 236, 181: 210, 182: 242, 183: 213, 184: 245, 185: 123, 186: 125, 187: 92, 188: 94, 189: 95, 190: 124, 191: 8764, 192: 196, 193: 228, 194: 214, 195: 246, 196: 223, 197: 165, 198: 164, 199: 9475, 200: 197, 201: 229, 202: 216, 203: 248, 204: 9487, 205: 9491, 206: 9495, 207: 9499 },
        er = function er(t) {
      var e = t;return tr.hasOwnProperty(t) && (e = tr[t]), String.fromCharCode(e);
    },
        rr = 15,
        ir = 100,
        ar = { 17: 1, 18: 3, 21: 5, 22: 7, 23: 9, 16: 11, 19: 12, 20: 14 },
        nr = { 17: 2, 18: 4, 21: 6, 22: 8, 23: 10, 19: 13, 20: 15 },
        or = { 25: 1, 26: 3, 29: 5, 30: 7, 31: 9, 24: 11, 27: 12, 28: 14 },
        sr = { 25: 2, 26: 4, 29: 6, 30: 8, 31: 10, 27: 13, 28: 15 },
        lr = ["white", "green", "blue", "cyan", "red", "yellow", "magenta", "black", "transparent"],
        ur = { verboseFilter: { DATA: 3, DEBUG: 3, INFO: 2, WARNING: 2, TEXT: 1, ERROR: 0 }, time: null, verboseLevel: 0, setTime: function setTime(t) {
        this.time = t;
      }, log: function log(t, e) {
        var r = this.verboseFilter[t];this.verboseLevel >= r && console.log(this.time + " [" + t + "] " + e);
      } },
        dr = function dr(t) {
      for (var e = [], r = 0; r < t.length; r++) {
        e.push(t[r].toString(16));
      }return e;
    },
        hr = function () {
      function t(e, r, i, a, n) {
        ct(this, t), this.foreground = e || "white", this.underline = r || !1, this.italics = i || !1, this.background = a || "black", this.flash = n || !1;
      }return t.prototype.reset = function () {
        this.foreground = "white", this.underline = !1, this.italics = !1, this.background = "black", this.flash = !1;
      }, t.prototype.setStyles = function (t) {
        for (var e = ["foreground", "underline", "italics", "background", "flash"], r = 0; r < e.length; r++) {
          var i = e[r];t.hasOwnProperty(i) && (this[i] = t[i]);
        }
      }, t.prototype.isDefault = function () {
        return "white" === this.foreground && !this.underline && !this.italics && "black" === this.background && !this.flash;
      }, t.prototype.equals = function (t) {
        return this.foreground === t.foreground && this.underline === t.underline && this.italics === t.italics && this.background === t.background && this.flash === t.flash;
      }, t.prototype.copy = function (t) {
        this.foreground = t.foreground, this.underline = t.underline, this.italics = t.italics, this.background = t.background, this.flash = t.flash;
      }, t.prototype.toString = function () {
        return "color=" + this.foreground + ", underline=" + this.underline + ", italics=" + this.italics + ", background=" + this.background + ", flash=" + this.flash;
      }, t;
    }(),
        cr = function () {
      function t(e, r, i, a, n, o) {
        ct(this, t), this.uchar = e || " ", this.penState = new hr(r, i, a, n, o);
      }return t.prototype.reset = function () {
        this.uchar = " ", this.penState.reset();
      }, t.prototype.setChar = function (t, e) {
        this.uchar = t, this.penState.copy(e);
      }, t.prototype.setPenState = function (t) {
        this.penState.copy(t);
      }, t.prototype.equals = function (t) {
        return this.uchar === t.uchar && this.penState.equals(t.penState);
      }, t.prototype.copy = function (t) {
        this.uchar = t.uchar, this.penState.copy(t.penState);
      }, t.prototype.isEmpty = function () {
        return " " === this.uchar && this.penState.isDefault();
      }, t;
    }(),
        fr = function () {
      function t() {
        ct(this, t), this.chars = [];for (var e = 0; e < ir; e++) {
          this.chars.push(new cr());
        }this.pos = 0, this.currPenState = new hr();
      }return t.prototype.equals = function (t) {
        for (var e = !0, r = 0; r < ir; r++) {
          if (!this.chars[r].equals(t.chars[r])) {
            e = !1;break;
          }
        }return e;
      }, t.prototype.copy = function (t) {
        for (var e = 0; e < ir; e++) {
          this.chars[e].copy(t.chars[e]);
        }
      }, t.prototype.isEmpty = function () {
        for (var t = !0, e = 0; e < ir; e++) {
          if (!this.chars[e].isEmpty()) {
            t = !1;break;
          }
        }return t;
      }, t.prototype.setCursor = function (t) {
        this.pos !== t && (this.pos = t), this.pos < 0 ? (ur.log("ERROR", "Negative cursor position " + this.pos), this.pos = 0) : this.pos > ir && (ur.log("ERROR", "Too large cursor position " + this.pos), this.pos = ir);
      }, t.prototype.moveCursor = function (t) {
        var e = this.pos + t;if (t > 1) for (var r = this.pos + 1; r < e + 1; r++) {
          this.chars[r].setPenState(this.currPenState);
        }this.setCursor(e);
      }, t.prototype.backSpace = function () {
        this.moveCursor(-1), this.chars[this.pos].setChar(" ", this.currPenState);
      }, t.prototype.insertChar = function (t) {
        t >= 144 && this.backSpace();var e = er(t);if (this.pos >= ir) return void ur.log("ERROR", "Cannot insert " + t.toString(16) + " (" + e + ") at position " + this.pos + ". Skipping it!");this.chars[this.pos].setChar(e, this.currPenState), this.moveCursor(1);
      }, t.prototype.clearFromPos = function (t) {
        var e;for (e = t; e < ir; e++) {
          this.chars[e].reset();
        }
      }, t.prototype.clear = function () {
        this.clearFromPos(0), this.pos = 0, this.currPenState.reset();
      }, t.prototype.clearToEndOfRow = function () {
        this.clearFromPos(this.pos);
      }, t.prototype.getTextString = function () {
        for (var t = [], e = !0, r = 0; r < ir; r++) {
          var i = this.chars[r].uchar;" " !== i && (e = !1), t.push(i);
        }return e ? "" : t.join("");
      }, t.prototype.setPenStyles = function (t) {
        this.currPenState.setStyles(t), this.chars[this.pos].setPenState(this.currPenState);
      }, t;
    }(),
        pr = function () {
      function t() {
        ct(this, t), this.rows = [];for (var e = 0; e < rr; e++) {
          this.rows.push(new fr());
        }this.currRow = rr - 1, this.nrRollUpRows = null, this.reset();
      }return t.prototype.reset = function () {
        for (var t = 0; t < rr; t++) {
          this.rows[t].clear();
        }this.currRow = rr - 1;
      }, t.prototype.equals = function (t) {
        for (var e = !0, r = 0; r < rr; r++) {
          if (!this.rows[r].equals(t.rows[r])) {
            e = !1;break;
          }
        }return e;
      }, t.prototype.copy = function (t) {
        for (var e = 0; e < rr; e++) {
          this.rows[e].copy(t.rows[e]);
        }
      }, t.prototype.isEmpty = function () {
        for (var t = !0, e = 0; e < rr; e++) {
          if (!this.rows[e].isEmpty()) {
            t = !1;break;
          }
        }return t;
      }, t.prototype.backSpace = function () {
        this.rows[this.currRow].backSpace();
      }, t.prototype.clearToEndOfRow = function () {
        this.rows[this.currRow].clearToEndOfRow();
      }, t.prototype.insertChar = function (t) {
        this.rows[this.currRow].insertChar(t);
      }, t.prototype.setPen = function (t) {
        this.rows[this.currRow].setPenStyles(t);
      }, t.prototype.moveCursor = function (t) {
        this.rows[this.currRow].moveCursor(t);
      }, t.prototype.setCursor = function (t) {
        ur.log("INFO", "setCursor: " + t), this.rows[this.currRow].setCursor(t);
      }, t.prototype.setPAC = function (t) {
        ur.log("INFO", "pacData = " + JSON.stringify(t));var e = t.row - 1;if (this.nrRollUpRows && e < this.nrRollUpRows - 1 && (e = this.nrRollUpRows - 1), this.nrRollUpRows && this.currRow !== e) {
          for (var r = 0; r < rr; r++) {
            this.rows[r].clear();
          }var i = this.currRow + 1 - this.nrRollUpRows,
              a = this.lastOutputScreen;if (a) {
            var n = a.rows[i].cueStartTime;if (n && n < ur.time) for (var o = 0; o < this.nrRollUpRows; o++) {
              this.rows[e - this.nrRollUpRows + o + 1].copy(a.rows[i + o]);
            }
          }
        }this.currRow = e;var s = this.rows[this.currRow];if (null !== t.indent) {
          var l = t.indent,
              u = Math.max(l - 1, 0);s.setCursor(t.indent), t.color = s.chars[u].penState.foreground;
        }var d = { foreground: t.color, underline: t.underline, italics: t.italics, background: "black", flash: !1 };this.setPen(d);
      }, t.prototype.setBkgData = function (t) {
        ur.log("INFO", "bkgData = " + JSON.stringify(t)), this.backSpace(), this.setPen(t), this.insertChar(32);
      }, t.prototype.setRollUpRows = function (t) {
        this.nrRollUpRows = t;
      }, t.prototype.rollUp = function () {
        if (null === this.nrRollUpRows) return void ur.log("DEBUG", "roll_up but nrRollUpRows not set yet");ur.log("TEXT", this.getDisplayText());var t = this.currRow + 1 - this.nrRollUpRows,
            e = this.rows.splice(t, 1)[0];e.clear(), this.rows.splice(this.currRow, 0, e), ur.log("INFO", "Rolling up");
      }, t.prototype.getDisplayText = function (t) {
        t = t || !1;for (var e = [], r = "", i = -1, a = 0; a < rr; a++) {
          var n = this.rows[a].getTextString();n && (i = a + 1, t ? e.push("Row " + i + ": '" + n + "'") : e.push(n.trim()));
        }return e.length > 0 && (r = t ? "[" + e.join(" | ") + "]" : e.join("\n")), r;
      }, t.prototype.getTextAndFormat = function () {
        return this.rows;
      }, t;
    }(),
        gr = function () {
      function t(e, r) {
        ct(this, t), this.chNr = e, this.outputFilter = r, this.mode = null, this.verbose = 0, this.displayedMemory = new pr(), this.nonDisplayedMemory = new pr(), this.lastOutputScreen = new pr(), this.currRollUpRow = this.displayedMemory.rows[rr - 1], this.writeScreen = this.displayedMemory, this.mode = null, this.cueStartTime = null;
      }return t.prototype.reset = function () {
        this.mode = null, this.displayedMemory.reset(), this.nonDisplayedMemory.reset(), this.lastOutputScreen.reset(), this.currRollUpRow = this.displayedMemory.rows[rr - 1], this.writeScreen = this.displayedMemory, this.mode = null, this.cueStartTime = null, this.lastCueEndTime = null;
      }, t.prototype.getHandler = function () {
        return this.outputFilter;
      }, t.prototype.setHandler = function (t) {
        this.outputFilter = t;
      }, t.prototype.setPAC = function (t) {
        this.writeScreen.setPAC(t);
      }, t.prototype.setBkgData = function (t) {
        this.writeScreen.setBkgData(t);
      }, t.prototype.setMode = function (t) {
        t !== this.mode && (this.mode = t, ur.log("INFO", "MODE=" + t), "MODE_POP-ON" === this.mode ? this.writeScreen = this.nonDisplayedMemory : (this.writeScreen = this.displayedMemory, this.writeScreen.reset()), "MODE_ROLL-UP" !== this.mode && (this.displayedMemory.nrRollUpRows = null, this.nonDisplayedMemory.nrRollUpRows = null), this.mode = t);
      }, t.prototype.insertChars = function (t) {
        for (var e = 0; e < t.length; e++) {
          this.writeScreen.insertChar(t[e]);
        }var r = this.writeScreen === this.displayedMemory ? "DISP" : "NON_DISP";ur.log("INFO", r + ": " + this.writeScreen.getDisplayText(!0)), "MODE_PAINT-ON" !== this.mode && "MODE_ROLL-UP" !== this.mode || (ur.log("TEXT", "DISPLAYED: " + this.displayedMemory.getDisplayText(!0)), this.outputDataUpdate());
      }, t.prototype.ccRCL = function () {
        ur.log("INFO", "RCL - Resume Caption Loading"), this.setMode("MODE_POP-ON");
      }, t.prototype.ccBS = function () {
        ur.log("INFO", "BS - BackSpace"), "MODE_TEXT" !== this.mode && (this.writeScreen.backSpace(), this.writeScreen === this.displayedMemory && this.outputDataUpdate());
      }, t.prototype.ccAOF = function () {}, t.prototype.ccAON = function () {}, t.prototype.ccDER = function () {
        ur.log("INFO", "DER- Delete to End of Row"), this.writeScreen.clearToEndOfRow(), this.outputDataUpdate();
      }, t.prototype.ccRU = function (t) {
        ur.log("INFO", "RU(" + t + ") - Roll Up"), this.writeScreen = this.displayedMemory, this.setMode("MODE_ROLL-UP"), this.writeScreen.setRollUpRows(t);
      }, t.prototype.ccFON = function () {
        ur.log("INFO", "FON - Flash On"), this.writeScreen.setPen({ flash: !0 });
      }, t.prototype.ccRDC = function () {
        ur.log("INFO", "RDC - Resume Direct Captioning"), this.setMode("MODE_PAINT-ON");
      }, t.prototype.ccTR = function () {
        ur.log("INFO", "TR"), this.setMode("MODE_TEXT");
      }, t.prototype.ccRTD = function () {
        ur.log("INFO", "RTD"), this.setMode("MODE_TEXT");
      }, t.prototype.ccEDM = function () {
        ur.log("INFO", "EDM - Erase Displayed Memory"), this.displayedMemory.reset(), this.outputDataUpdate(!0);
      }, t.prototype.ccCR = function () {
        ur.log("CR - Carriage Return"), this.writeScreen.rollUp(), this.outputDataUpdate(!0);
      }, t.prototype.ccENM = function () {
        ur.log("INFO", "ENM - Erase Non-displayed Memory"), this.nonDisplayedMemory.reset();
      }, t.prototype.ccEOC = function () {
        if (ur.log("INFO", "EOC - End Of Caption"), "MODE_POP-ON" === this.mode) {
          var t = this.displayedMemory;this.displayedMemory = this.nonDisplayedMemory, this.nonDisplayedMemory = t, this.writeScreen = this.nonDisplayedMemory, ur.log("TEXT", "DISP: " + this.displayedMemory.getDisplayText());
        }this.outputDataUpdate(!0);
      }, t.prototype.ccTO = function (t) {
        ur.log("INFO", "TO(" + t + ") - Tab Offset"), this.writeScreen.moveCursor(t);
      }, t.prototype.ccMIDROW = function (t) {
        var e = { flash: !1 };if (e.underline = t % 2 == 1, e.italics = t >= 46, e.italics) e.foreground = "white";else {
          var r = Math.floor(t / 2) - 16,
              i = ["white", "green", "blue", "cyan", "red", "yellow", "magenta"];e.foreground = i[r];
        }ur.log("INFO", "MIDROW: " + JSON.stringify(e)), this.writeScreen.setPen(e);
      }, t.prototype.outputDataUpdate = function () {
        var t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
            e = ur.time;null !== e && this.outputFilter && (null !== this.cueStartTime || this.displayedMemory.isEmpty() ? this.displayedMemory.equals(this.lastOutputScreen) || (this.outputFilter.newCue && (this.outputFilter.newCue(this.cueStartTime, e, this.lastOutputScreen), !0 === t && this.outputFilter.dispatchCue && this.outputFilter.dispatchCue()), this.cueStartTime = this.displayedMemory.isEmpty() ? null : e) : this.cueStartTime = e, this.lastOutputScreen.copy(this.displayedMemory));
      }, t.prototype.cueSplitAtTime = function (t) {
        this.outputFilter && (this.displayedMemory.isEmpty() || (this.outputFilter.newCue && this.outputFilter.newCue(this.cueStartTime, t, this.displayedMemory), this.cueStartTime = t));
      }, t;
    }(),
        vr = function () {
      function t(e, r, i) {
        ct(this, t), this.field = e || 1, this.outputs = [r, i], this.channels = [new gr(1, r), new gr(2, i)], this.currChNr = -1, this.lastCmdA = null, this.lastCmdB = null, this.bufferedData = [], this.startTime = null, this.lastTime = null, this.dataCounters = { padding: 0, char: 0, cmd: 0, other: 0 };
      }return t.prototype.getHandler = function (t) {
        return this.channels[t].getHandler();
      }, t.prototype.setHandler = function (t, e) {
        this.channels[t].setHandler(e);
      }, t.prototype.addData = function (t, e) {
        var r,
            i,
            a,
            n = !1;this.lastTime = t, ur.setTime(t);for (var o = 0; o < e.length; o += 2) {
          if (i = 127 & e[o], a = 127 & e[o + 1], 0 !== i || 0 !== a) {
            if (ur.log("DATA", "[" + dr([e[o], e[o + 1]]) + "] -> (" + dr([i, a]) + ")"), r = this.parseCmd(i, a), r || (r = this.parseMidrow(i, a)), r || (r = this.parsePAC(i, a)), r || (r = this.parseBackgroundAttributes(i, a)), !r && (n = this.parseChars(i, a))) if (this.currChNr && this.currChNr >= 0) {
              var s = this.channels[this.currChNr - 1];s.insertChars(n);
            } else ur.log("WARNING", "No channel found yet. TEXT-MODE?");r ? this.dataCounters.cmd += 2 : n ? this.dataCounters.char += 2 : (this.dataCounters.other += 2, ur.log("WARNING", "Couldn't parse cleaned data " + dr([i, a]) + " orig: " + dr([e[o], e[o + 1]])));
          } else this.dataCounters.padding += 2;
        }
      }, t.prototype.parseCmd = function (t, e) {
        var r = null,
            i = (20 === t || 28 === t) && 32 <= e && e <= 47,
            a = (23 === t || 31 === t) && 33 <= e && e <= 35;if (!i && !a) return !1;if (t === this.lastCmdA && e === this.lastCmdB) return this.lastCmdA = null, this.lastCmdB = null, ur.log("DEBUG", "Repeated command (" + dr([t, e]) + ") is dropped"), !0;r = 20 === t || 23 === t ? 1 : 2;var n = this.channels[r - 1];return 20 === t || 28 === t ? 32 === e ? n.ccRCL() : 33 === e ? n.ccBS() : 34 === e ? n.ccAOF() : 35 === e ? n.ccAON() : 36 === e ? n.ccDER() : 37 === e ? n.ccRU(2) : 38 === e ? n.ccRU(3) : 39 === e ? n.ccRU(4) : 40 === e ? n.ccFON() : 41 === e ? n.ccRDC() : 42 === e ? n.ccTR() : 43 === e ? n.ccRTD() : 44 === e ? n.ccEDM() : 45 === e ? n.ccCR() : 46 === e ? n.ccENM() : 47 === e && n.ccEOC() : n.ccTO(e - 32), this.lastCmdA = t, this.lastCmdB = e, this.currChNr = r, !0;
      }, t.prototype.parseMidrow = function (t, e) {
        var r = null;if ((17 === t || 25 === t) && 32 <= e && e <= 47) {
          if ((r = 17 === t ? 1 : 2) !== this.currChNr) return ur.log("ERROR", "Mismatch channel in midrow parsing"), !1;return this.channels[r - 1].ccMIDROW(e), ur.log("DEBUG", "MIDROW (" + dr([t, e]) + ")"), !0;
        }return !1;
      }, t.prototype.parsePAC = function (t, e) {
        var r = null,
            i = null,
            a = (17 <= t && t <= 23 || 25 <= t && t <= 31) && 64 <= e && e <= 127,
            n = (16 === t || 24 === t) && 64 <= e && e <= 95;if (!a && !n) return !1;if (t === this.lastCmdA && e === this.lastCmdB) return this.lastCmdA = null, this.lastCmdB = null, !0;r = t <= 23 ? 1 : 2, i = 64 <= e && e <= 95 ? 1 === r ? ar[t] : or[t] : 1 === r ? nr[t] : sr[t];var o = this.interpretPAC(i, e);return this.channels[r - 1].setPAC(o), this.lastCmdA = t, this.lastCmdB = e, this.currChNr = r, !0;
      }, t.prototype.interpretPAC = function (t, e) {
        var r = e,
            i = { color: null, italics: !1, indent: null, underline: !1, row: t };return r = e > 95 ? e - 96 : e - 64, i.underline = 1 == (1 & r), r <= 13 ? i.color = ["white", "green", "blue", "cyan", "red", "yellow", "magenta", "white"][Math.floor(r / 2)] : r <= 15 ? (i.italics = !0, i.color = "white") : i.indent = 4 * Math.floor((r - 16) / 2), i;
      }, t.prototype.parseChars = function (t, e) {
        var r = null,
            i = null,
            a = null;if (t >= 25 ? (r = 2, a = t - 8) : (r = 1, a = t), 17 <= a && a <= 19) {
          var n = e;n = 17 === a ? e + 80 : 18 === a ? e + 112 : e + 144, ur.log("INFO", "Special char '" + er(n) + "' in channel " + r), i = [n];
        } else 32 <= t && t <= 127 && (i = 0 === e ? [t] : [t, e]);if (i) {
          var o = dr(i);ur.log("DEBUG", "Char codes =  " + o.join(",")), this.lastCmdA = null, this.lastCmdB = null;
        }return i;
      }, t.prototype.parseBackgroundAttributes = function (t, e) {
        var r,
            i,
            a,
            n,
            o = (16 === t || 24 === t) && 32 <= e && e <= 47,
            s = (23 === t || 31 === t) && 45 <= e && e <= 47;return !(!o && !s) && (r = {}, 16 === t || 24 === t ? (i = Math.floor((e - 32) / 2), r.background = lr[i], e % 2 == 1 && (r.background = r.background + "_semi")) : 45 === e ? r.background = "transparent" : (r.foreground = "black", 47 === e && (r.underline = !0)), a = t < 24 ? 1 : 2, n = this.channels[a - 1], n.setBkgData(r), this.lastCmdA = null, this.lastCmdB = null, !0);
      }, t.prototype.reset = function () {
        for (var t = 0; t < this.channels.length; t++) {
          this.channels[t] && this.channels[t].reset();
        }this.lastCmdA = null, this.lastCmdB = null;
      }, t.prototype.cueSplitAtTime = function (t) {
        for (var e = 0; e < this.channels.length; e++) {
          this.channels[e] && this.channels[e].cueSplitAtTime(t);
        }
      }, t;
    }(),
        yr = vr,
        mr = function () {
      function t(e, r) {
        ft(this, t), this.timelineController = e, this.track = r, this.startTime = null, this.endTime = null, this.screen = null;
      }return t.prototype.dispatchCue = function () {
        null !== this.startTime && (this.timelineController.addCues("textTrack" + this.track, this.startTime, this.endTime, this.screen), this.startTime = null);
      }, t.prototype.newCue = function (t, e, r) {
        (null === this.startTime || this.startTime > t) && (this.startTime = t), this.endTime = e, this.screen = r, this.timelineController.createCaptionsTrack(this.track);
      }, t;
    }(),
        br = mr,
        Er = function Er(t, e, r) {
      return t.substr(r || 0, e.length) === e;
    },
        Tr = function Tr(t) {
      var e = parseInt(t.substr(-3)),
          r = parseInt(t.substr(-6, 2)),
          i = parseInt(t.substr(-9, 2)),
          a = t.length > 9 ? parseInt(t.substr(0, t.indexOf(":"))) : 0;return isNaN(e) || isNaN(r) || isNaN(i) || isNaN(a) ? -1 : (e += 1e3 * r, e += 6e4 * i, e += 36e5 * a);
    },
        Rr = function Rr(t) {
      for (var e = 5381, r = t.length; r;) {
        e = 33 * e ^ t.charCodeAt(--r);
      }return (e >>> 0).toString();
    },
        Ar = function Ar(t, e, r) {
      var i = t[e],
          a = t[i.prevCC];if (!a || !a.new && i.new) return t.ccOffset = t.presentationOffset = i.start, void (i.new = !1);for (; a && a.new;) {
        t.ccOffset += i.start - a.start, i.new = !1, i = a, a = t[i.prevCC];
      }t.presentationOffset = r;
    },
        Sr = { parse: function parse(t, e, r, i, a, n) {
        var o = /\r\n|\n\r|\n|\r/g,
            s = Object(Re.b)(new Uint8Array(t)).trim().replace(o, "\n").split("\n"),
            l = "00:00.000",
            u = 0,
            d = 0,
            h = 0,
            c = [],
            f = void 0,
            p = !0,
            g = new Ze();g.oncue = function (t) {
          var e = r[i],
              a = r.ccOffset;e && e.new && (void 0 !== d ? a = r.ccOffset = e.start : Ar(r, i, h)), h && (a = h + r.ccOffset - r.presentationOffset), t.startTime += a - d, t.endTime += a - d, t.id = Rr(t.startTime.toString()) + Rr(t.endTime.toString()) + Rr(t.text), t.text = decodeURIComponent(encodeURIComponent(t.text)), t.endTime > 0 && c.push(t);
        }, g.onparsingerror = function (t) {
          f = t;
        }, g.onflush = function () {
          if (f && n) return void n(f);a(c);
        }, s.forEach(function (t) {
          if (p) {
            if (Er(t, "X-TIMESTAMP-MAP=")) {
              p = !1, t.substr(16).split(",").forEach(function (t) {
                Er(t, "LOCAL:") ? l = t.substr(6) : Er(t, "MPEGTS:") && (u = parseInt(t.substr(7)));
              });try {
                e = e < 0 ? e + 8589934592 : e, u -= e, d = Tr(l) / 1e3, h = u / 9e4, -1 === d && (f = new Error("Malformed X-TIMESTAMP-MAP: " + t));
              } catch (e) {
                f = new Error("Malformed X-TIMESTAMP-MAP: " + t);
              }return;
            }"" === t && (p = !1);
          }g.parse(t + "\n");
        }), g.flush();
      } },
        Lr = Sr,
        _r = function (t) {
      function e(r) {
        pt(this, e);var i = gt(this, t.call(this, r, Ot.a.MEDIA_ATTACHING, Ot.a.MEDIA_DETACHING, Ot.a.FRAG_PARSING_USERDATA, Ot.a.FRAG_DECRYPTED, Ot.a.MANIFEST_LOADING, Ot.a.MANIFEST_LOADED, Ot.a.FRAG_LOADED, Ot.a.LEVEL_SWITCHING, Ot.a.INIT_PTS_FOUND));if (i.hls = r, i.config = r.config, i.enabled = !0, i.Cues = r.config.cueHandler, i.textTracks = [], i.tracks = [], i.unparsedVttFrags = [], i.initPTS = void 0, i.cueRanges = [], i.config.enableCEA708Captions) {
          var a = new br(i, 1),
              n = new br(i, 2);i.cea608Parser = new yr(0, a, n);
        }return i;
      }return vt(e, t), e.prototype.addCues = function (t, e, r, i) {
        for (var a = this.cueRanges, n = !1, o = a.length; o--;) {
          var s = a[o],
              l = bt(s[0], s[1], e, r);if (l >= 0 && (s[0] = Math.min(s[0], e), s[1] = Math.max(s[1], r), n = !0, l / (r - e) > .5)) return;
        }n || a.push([e, r]), this.Cues.newCue(this[t], e, r, i);
      }, e.prototype.onInitPtsFound = function (t) {
        var e = this;void 0 === this.initPTS && (this.initPTS = t.initPTS), this.unparsedVttFrags.length && (this.unparsedVttFrags.forEach(function (t) {
          e.onFragLoaded(t);
        }), this.unparsedVttFrags = []);
      }, e.prototype.getExistingTrack = function (t) {
        var e = this.media;if (e) for (var r = 0; r < e.textTracks.length; r++) {
          var i = e.textTracks[r],
              a = "textTrack" + t;if (!0 === i[a]) return i;
        }return null;
      }, e.prototype.sendAddTrackEvent = function (t, e) {
        var r = null;try {
          r = new window.Event("addtrack");
        } catch (t) {
          r = document.createEvent("Event"), r.initEvent("addtrack", !1, !1);
        }r.track = t, e.dispatchEvent(r);
      }, e.prototype.createCaptionsTrack = function (t) {
        var e = "textTrack" + t;if (!this[e]) {
          var r = this.getExistingTrack(t);if (r) this[e] = r, yt(this[e]), this.sendAddTrackEvent(this[e], this.media);else {
            var i = this.createTextTrack("captions", this.config["captionsTextTrack" + t + "Label"], this.config.captionsTextTrack1LanguageCode);i && (i[e] = !0, this[e] = i);
          }
        }
      }, e.prototype.createTextTrack = function (t, e, r) {
        var i = this.media;if (i) return i.addTextTrack(t, e, r);
      }, e.prototype.destroy = function () {
        Nt.prototype.destroy.call(this);
      }, e.prototype.onMediaAttaching = function (t) {
        this.media = t.media, this._cleanTracks();
      }, e.prototype.onMediaDetaching = function () {
        yt(this.textTrack1), yt(this.textTrack2);
      }, e.prototype.onManifestLoading = function () {
        this.lastSn = -1, this.prevCC = -1, this.vttCCs = { ccOffset: 0, presentationOffset: 0 }, this._cleanTracks();
      }, e.prototype._cleanTracks = function () {
        var t = this.media;if (t) {
          var e = t.textTracks;if (e) for (var r = 0; r < e.length; r++) {
            yt(e[r]);
          }
        }
      }, e.prototype.onManifestLoaded = function (t) {
        var e = this;if (this.textTracks = [], this.unparsedVttFrags = this.unparsedVttFrags || [], this.initPTS = void 0, this.cueRanges = [], this.config.enableWebVTT) {
          this.tracks = t.subtitles || [];var r = this.media ? this.media.textTracks : [];this.tracks.forEach(function (t, i) {
            var a = void 0;if (i < r.length) {
              var n = r[i];mt(n, t) && (a = n);
            }a || (a = e.createTextTrack("subtitles", t.name, t.lang)), a.mode = t.default ? "showing" : "hidden", e.textTracks.push(a);
          });
        }
      }, e.prototype.onLevelSwitching = function () {
        this.enabled = "NONE" !== this.hls.currentLevel.closedCaptions;
      }, e.prototype.onFragLoaded = function (t) {
        var e = t.frag,
            r = t.payload;if ("main" === e.type) {
          var i = e.sn;if (i !== this.lastSn + 1) {
            var a = this.cea608Parser;a && a.reset();
          }this.lastSn = i;
        } else if ("subtitle" === e.type) if (r.byteLength) {
          if (void 0 === this.initPTS) return void this.unparsedVttFrags.push(t);var n = e.decryptdata;null != n && null != n.key && "AES-128" === n.method || this._parseVTTs(e, r);
        } else this.hls.trigger(Ot.a.SUBTITLE_FRAG_PROCESSED, { success: !1, frag: e });
      }, e.prototype._parseVTTs = function (t, e) {
        var r = this.vttCCs;r[t.cc] || (r[t.cc] = { start: t.start, prevCC: this.prevCC, new: !0 }, this.prevCC = t.cc);var i = this.textTracks,
            a = this.hls;Lr.parse(e, this.initPTS, r, t.cc, function (e) {
          var r = i[t.trackId];e.forEach(function (t) {
            if (!r.cues.getCueById(t.id)) try {
              r.addCue(t);
            } catch (i) {
              var e = new window.TextTrackCue(t.startTime, t.endTime, t.text);e.id = t.id, r.addCue(e);
            }
          }), a.trigger(Ot.a.SUBTITLE_FRAG_PROCESSED, { success: !0, frag: t });
        }, function (e) {
          Pt.b.log("Failed to parse VTT cue: " + e), a.trigger(Ot.a.SUBTITLE_FRAG_PROCESSED, { success: !1, frag: t });
        });
      }, e.prototype.onFragDecrypted = function (t) {
        var e = t.payload,
            r = t.frag;if ("subtitle" === r.type) {
          if (void 0 === this.initPTS) return void this.unparsedVttFrags.push(t);this._parseVTTs(r, e);
        }
      }, e.prototype.onFragParsingUserdata = function (t) {
        if (this.enabled && this.config.enableCEA708Captions) for (var e = 0; e < t.samples.length; e++) {
          var r = this.extractCea608Data(t.samples[e].bytes);this.cea608Parser.addData(t.samples[e].pts, r);
        }
      }, e.prototype.extractCea608Data = function (t) {
        for (var e, r, i, a, n, o = 31 & t[0], s = 2, l = [], u = 0; u < o; u++) {
          e = t[s++], r = 127 & t[s++], i = 127 & t[s++], a = 0 != (4 & e), n = 3 & e, 0 === r && 0 === i || a && 0 === n && (l.push(r), l.push(i));
        }return l;
      }, e;
    }(Nt),
        wr = _r,
        Dr = function () {
      function t(t, e) {
        for (var r = 0; r < e.length; r++) {
          var i = e[r];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i);
        }
      }return function (e, r, i) {
        return r && t(e.prototype, r), i && t(e, i), e;
      };
    }(),
        Ir = function (t) {
      function e(r) {
        Et(this, e);var i = Tt(this, t.call(this, r, Ot.a.MEDIA_ATTACHED, Ot.a.MEDIA_DETACHING, Ot.a.MANIFEST_LOADING, Ot.a.MANIFEST_LOADED, Ot.a.SUBTITLE_TRACK_LOADED));return i.tracks = [], i.trackId = -1, i.media = void 0, i.subtitleDisplay = !1, i;
      }return Rt(e, t), e.prototype._onTextTracksChanged = function () {
        if (this.media) {
          for (var t = -1, e = At(this.media.textTracks), r = 0; r < e.length; r++) {
            "showing" === e[r].mode && (t = r);
          }this.subtitleTrack = t;
        }
      }, e.prototype.destroy = function () {
        Nt.prototype.destroy.call(this);
      }, e.prototype.onMediaAttached = function (t) {
        var e = this;this.media = t.media, this.media && (void 0 !== this.queuedDefaultTrack && (this.subtitleTrack = this.queuedDefaultTrack, delete this.queuedDefaultTrack), this.trackChangeListener = this._onTextTracksChanged.bind(this), this.useTextTrackPolling = !(this.media.textTracks && "onchange" in this.media.textTracks), this.useTextTrackPolling ? this.subtitlePollingInterval = setInterval(function () {
          e.trackChangeListener();
        }, 500) : this.media.textTracks.addEventListener("change", this.trackChangeListener));
      }, e.prototype.onMediaDetaching = function () {
        this.media && (this.useTextTrackPolling ? clearInterval(this.subtitlePollingInterval) : this.media.textTracks.removeEventListener("change", this.trackChangeListener), this.media = void 0);
      }, e.prototype.onManifestLoading = function () {
        this.tracks = [], this.trackId = -1;
      }, e.prototype.onManifestLoaded = function (t) {
        var e = this,
            r = t.subtitles || [];this.tracks = r, this.trackId = -1, this.hls.trigger(Ot.a.SUBTITLE_TRACKS_UPDATED, { subtitleTracks: r }), r.forEach(function (t) {
          t.default && (e.media ? e.subtitleTrack = t.id : e.queuedDefaultTrack = t.id);
        });
      }, e.prototype.onTick = function () {
        var t = this.trackId,
            e = this.tracks[t];if (e) {
          var r = e.details;void 0 !== r && !0 !== r.live || (Pt.b.log("(re)loading playlist for subtitle track " + t), this.hls.trigger(Ot.a.SUBTITLE_TRACK_LOADING, { url: e.url, id: t }));
        }
      }, e.prototype.onSubtitleTrackLoaded = function (t) {
        var e = this;t.id < this.tracks.length && (Pt.b.log("subtitle track " + t.id + " loaded"), this.tracks[t.id].details = t.details, t.details.live && !this.timer && (this.timer = setInterval(function () {
          e.onTick();
        }, 1e3 * t.details.targetduration, this)), !t.details.live && this.timer && (clearInterval(this.timer), this.timer = null));
      }, e.prototype.setSubtitleTrackInternal = function (t) {
        if (!(t < -1 || t >= this.tracks.length)) {
          this.timer && (clearInterval(this.timer), this.timer = null);var e = At(this.media.textTracks);if (-1 !== this.trackId && this.subtitleDisplay && (e[this.trackId].mode = "hidden"), this.trackId = t, Pt.b.log("switching to subtitle track " + t), this.hls.trigger(Ot.a.SUBTITLE_TRACK_SWITCH, { id: t }), -1 !== t) {
            var r = this.tracks[t];this.subtitleDisplay && (e[t].mode = "showing");var i = r.details;void 0 !== i && !0 !== i.live || (Pt.b.log("(re)loading playlist for subtitle track " + t), this.hls.trigger(Ot.a.SUBTITLE_TRACK_LOADING, { url: r.url, id: t }));
          }
        }
      }, Dr(e, [{ key: "subtitleTracks", get: function get() {
          return this.tracks;
        } }, { key: "subtitleTrack", get: function get() {
          return this.trackId;
        }, set: function set(t) {
          this.trackId !== t && this.setSubtitleTrackInternal(t);
        } }]), e;
    }(Nt),
        kr = Ir,
        Or = r(4),
        Cr = { STOPPED: "STOPPED", IDLE: "IDLE", KEY_LOADING: "KEY_LOADING", FRAG_LOADING: "FRAG_LOADING" },
        Pr = function (t) {
      function e(r) {
        St(this, e);var i = Lt(this, t.call(this, r, Ot.a.MEDIA_ATTACHED, Ot.a.ERROR, Ot.a.KEY_LOADED, Ot.a.FRAG_LOADED, Ot.a.SUBTITLE_TRACKS_UPDATED, Ot.a.SUBTITLE_TRACK_SWITCH, Ot.a.SUBTITLE_TRACK_LOADED, Ot.a.SUBTITLE_FRAG_PROCESSED));return i.config = r.config, i.vttFragSNsProcessed = {}, i.vttFragQueues = void 0, i.currentlyProcessing = null, i.state = Cr.STOPPED, i.currentTrackId = -1, i.ticks = 0, i.decrypter = new Or.a(r.observer, r.config), i;
      }return _t(e, t), e.prototype.destroy = function () {
        Nt.prototype.destroy.call(this), this.state = Cr.STOPPED;
      }, e.prototype.clearVttFragQueues = function () {
        var t = this;this.vttFragQueues = {}, this.tracks.forEach(function (e) {
          t.vttFragQueues[e.id] = [];
        });
      }, e.prototype.nextFrag = function () {
        if (null === this.currentlyProcessing && this.currentTrackId > -1 && this.vttFragQueues[this.currentTrackId].length) {
          var t = this.currentlyProcessing = this.vttFragQueues[this.currentTrackId].shift();this.fragCurrent = t, this.hls.trigger(Ot.a.FRAG_LOADING, { frag: t }), this.state = Cr.FRAG_LOADING;
        }
      }, e.prototype.onSubtitleFragProcessed = function (t) {
        t.success && this.vttFragSNsProcessed[t.frag.trackId].push(t.frag.sn), this.currentlyProcessing = null, this.state = Cr.IDLE, this.nextFrag();
      }, e.prototype.onMediaAttached = function () {
        this.state = Cr.IDLE;
      }, e.prototype.onError = function (t) {
        var e = t.frag;e && "subtitle" !== e.type || this.currentlyProcessing && (this.currentlyProcessing = null, this.nextFrag());
      }, e.prototype.tick = function () {
        var t = this;1 === ++this.ticks && (this.doTick(), this.ticks > 1 && setTimeout(function () {
          t.tick();
        }, 1), this.ticks = 0);
      }, e.prototype.doTick = function () {
        var t = this;switch (this.state) {case Cr.IDLE:
            var e = this.tracks,
                r = this.currentTrackId,
                i = this.vttFragSNsProcessed[r],
                a = this.vttFragQueues[r],
                n = this.currentlyProcessing ? this.currentlyProcessing.sn : -1,
                o = function o(t) {
              return i.indexOf(t.sn) > -1;
            },
                s = function s(t) {
              return a.some(function (e) {
                return e.sn === t.sn;
              });
            };if (!e) break;var l;if (r < e.length && (l = e[r].details), void 0 === l) break;l.fragments.forEach(function (e) {
              o(e) || e.sn === n || s(e) || (e.decryptdata && null != e.decryptdata.uri && null == e.decryptdata.key ? (Pt.b.log("Loading key for " + e.sn), t.state = Cr.KEY_LOADING, t.hls.trigger(Ot.a.KEY_LOADING, { frag: e })) : (e.trackId = r, a.push(e), t.nextFrag()));
            });}
      }, e.prototype.onSubtitleTracksUpdated = function (t) {
        var e = this;Pt.b.log("subtitle tracks updated"), this.tracks = t.subtitleTracks, this.clearVttFragQueues(), this.vttFragSNsProcessed = {}, this.tracks.forEach(function (t) {
          e.vttFragSNsProcessed[t.id] = [];
        });
      }, e.prototype.onSubtitleTrackSwitch = function (t) {
        this.currentTrackId = t.id, this.clearVttFragQueues();
      }, e.prototype.onSubtitleTrackLoaded = function () {
        this.tick();
      }, e.prototype.onKeyLoaded = function () {
        this.state === Cr.KEY_LOADING && (this.state = Cr.IDLE, this.tick());
      }, e.prototype.onFragLoaded = function (t) {
        var e = this.fragCurrent,
            r = t.frag.decryptdata,
            i = t.frag,
            a = this.hls;if (this.state === Cr.FRAG_LOADING && e && "subtitle" === t.frag.type && e.sn === t.frag.sn && t.payload.byteLength > 0 && null != r && null != r.key && "AES-128" === r.method) {
          var n;try {
            n = performance.now();
          } catch (t) {
            n = Date.now();
          }this.decrypter.decrypt(t.payload, r.key.buffer, r.iv.buffer, function (t) {
            var e;try {
              e = performance.now();
            } catch (t) {
              e = Date.now();
            }a.trigger(Ot.a.FRAG_DECRYPTED, { frag: i, payload: t, stats: { tstart: n, tdecrypt: e } });
          });
        }
      }, e;
    }(Nt),
        xr = Pr,
        Fr = { autoStartLoad: !0, startPosition: -1, defaultAudioCodec: void 0, debug: !1, capLevelOnFPSDrop: !1, capLevelToPlayerSize: !1, initialLiveManifestSize: 1, maxBufferLength: 30, maxBufferSize: 6e7, maxBufferHole: .5, maxSeekHole: 2, lowBufferWatchdogPeriod: .5, highBufferWatchdogPeriod: 3, nudgeOffset: .1, nudgeMaxRetry: 3, maxFragLookUpTolerance: .25, liveSyncDurationCount: 3, liveMaxLatencyDurationCount: 1 / 0, liveSyncDuration: void 0, liveMaxLatencyDuration: void 0, liveDurationInfinity: !1, maxMaxBufferLength: 600, enableWorker: !0, enableSoftwareAES: !0, manifestLoadingTimeOut: 1e4, manifestLoadingMaxRetry: 1, manifestLoadingRetryDelay: 1e3, manifestLoadingMaxRetryTimeout: 64e3, startLevel: void 0, levelLoadingTimeOut: 1e4, levelLoadingMaxRetry: 4, levelLoadingRetryDelay: 1e3, levelLoadingMaxRetryTimeout: 64e3, fragLoadingTimeOut: 2e4, fragLoadingMaxRetry: 6, fragLoadingRetryDelay: 1e3, fragLoadingMaxRetryTimeout: 64e3, fragLoadingLoopThreshold: 3, startFragPrefetch: !1, fpsDroppedMonitoringPeriod: 5e3, fpsDroppedMonitoringThreshold: .2, appendErrorMaxRetry: 3, loader: je, fLoader: void 0, pLoader: void 0, xhrSetup: void 0, fetchSetup: void 0, abrController: Oe, bufferController: xe, capLevelController: Me, fpsController: Be, stretchShortVideoTrack: !1, maxAudioFramesDrift: 1, forceKeyFrameOnDiscontinuity: !0, abrEwmaFastLive: 3, abrEwmaSlowLive: 9, abrEwmaFastVoD: 3, abrEwmaSlowVoD: 9, abrEwmaDefaultEstimate: 5e5, abrBandWidthFactor: .95, abrBandWidthUpFactor: .7, abrMaxWithRealBitrate: !1, maxStarvationDelay: 4, maxLoadingDelay: 4, minAutoBitrate: 0 };Fr.subtitleStreamController = xr, Fr.subtitleTrackController = kr, Fr.timelineController = wr, Fr.cueHandler = Dt, Fr.enableCEA708Captions = !0, Fr.enableWebVTT = !0, Fr.captionsTextTrack1Label = "English", Fr.captionsTextTrack1LanguageCode = "en", Fr.captionsTextTrack2Label = "Spanish", Fr.captionsTextTrack2LanguageCode = "es", Fr.audioStreamController = Xe, Fr.audioTrackController = We;var Nr = function () {
      function t(t, e) {
        for (var r = 0; r < e.length; r++) {
          var i = e[r];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i);
        }
      }return function (e, r, i) {
        return r && t(e.prototype, r), i && t(e, i), e;
      };
    }(),
        Mr = function () {
      function t() {
        var e = this,
            r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};wt(this, t);var i = t.DefaultConfig;if ((r.liveSyncDurationCount || r.liveMaxLatencyDurationCount) && (r.liveSyncDuration || r.liveMaxLatencyDuration)) throw new Error("Illegal hls.js config: don't mix up liveSyncDurationCount/liveMaxLatencyDurationCount and liveSyncDuration/liveMaxLatencyDuration");for (var a in i) {
          a in r || (r[a] = i[a]);
        }if (void 0 !== r.liveMaxLatencyDurationCount && r.liveMaxLatencyDurationCount <= r.liveSyncDurationCount) throw new Error('Illegal hls.js config: "liveMaxLatencyDurationCount" must be gt "liveSyncDurationCount"');if (void 0 !== r.liveMaxLatencyDuration && (r.liveMaxLatencyDuration <= r.liveSyncDuration || void 0 === r.liveSyncDuration)) throw new Error('Illegal hls.js config: "liveMaxLatencyDuration" must be gt "liveSyncDuration"');Object(Pt.a)(r.debug), this.config = r, this._autoLevelCapping = -1;var n = this.observer = new se.a();n.trigger = function (t) {
          for (var e = arguments.length, r = Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++) {
            r[i - 1] = arguments[i];
          }n.emit.apply(n, [t, t].concat(r));
        }, n.off = function (t) {
          for (var e = arguments.length, r = Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++) {
            r[i - 1] = arguments[i];
          }n.removeListener.apply(n, [t].concat(r));
        }, this.on = n.on.bind(n), this.off = n.off.bind(n), this.trigger = n.trigger.bind(n);var o = this.abrController = new r.abrController(this),
            s = new r.bufferController(this),
            l = new r.capLevelController(this),
            u = new r.fpsController(this),
            d = new Qt(this),
            h = new $t(this),
            c = new te(this),
            f = new Se(this),
            p = this.levelController = new Te(this),
            g = this.streamController = new me(this),
            v = [p, g],
            y = r.audioStreamController;y && v.push(new y(this)), this.networkControllers = v;var m = [d, h, c, o, s, l, u, f];if (y = r.audioTrackController) {
          var b = new y(this);this.audioTrackController = b, m.push(b);
        }if (y = r.subtitleTrackController) {
          var E = new y(this);this.subtitleTrackController = E, m.push(E);
        }[r.subtitleStreamController, r.timelineController].forEach(function (t) {
          t && m.push(new t(e));
        }), this.coreComponents = m;
      }return t.isSupported = function () {
        return M();
      }, Nr(t, null, [{ key: "version", get: function get() {
          return "0.8.9";
        } }, { key: "Events", get: function get() {
          return Ot.a;
        } }, { key: "ErrorTypes", get: function get() {
          return Ct.b;
        } }, { key: "ErrorDetails", get: function get() {
          return Ct.a;
        } }, { key: "DefaultConfig", get: function get() {
          return t.defaultConfig ? t.defaultConfig : Fr;
        }, set: function set(e) {
          t.defaultConfig = e;
        } }]), t.prototype.destroy = function () {
        Pt.b.log("destroy"), this.trigger(Ot.a.DESTROYING), this.detachMedia(), this.coreComponents.concat(this.networkControllers).forEach(function (t) {
          t.destroy();
        }), this.url = null, this.observer.removeAllListeners(), this._autoLevelCapping = -1;
      }, t.prototype.attachMedia = function (t) {
        Pt.b.log("attachMedia"), this.media = t, this.trigger(Ot.a.MEDIA_ATTACHING, { media: t });
      }, t.prototype.detachMedia = function () {
        Pt.b.log("detachMedia"), this.trigger(Ot.a.MEDIA_DETACHING), this.media = null;
      }, t.prototype.loadSource = function (t) {
        t = kt.a.buildAbsoluteURL(window.location.href, t, { alwaysNormalize: !0 }), Pt.b.log("loadSource:" + t), this.url = t, this.trigger(Ot.a.MANIFEST_LOADING, { url: t });
      }, t.prototype.startLoad = function () {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : -1;Pt.b.log("startLoad(" + t + ")"), this.networkControllers.forEach(function (e) {
          e.startLoad(t);
        });
      }, t.prototype.stopLoad = function () {
        Pt.b.log("stopLoad"), this.networkControllers.forEach(function (t) {
          t.stopLoad();
        });
      }, t.prototype.swapAudioCodec = function () {
        Pt.b.log("swapAudioCodec"), this.streamController.swapAudioCodec();
      }, t.prototype.recoverMediaError = function () {
        Pt.b.log("recoverMediaError");var t = this.media;this.detachMedia(), this.attachMedia(t);
      }, Nr(t, [{ key: "levels", get: function get() {
          return this.levelController.levels;
        } }, { key: "currentLevel", get: function get() {
          return this.streamController.currentLevel;
        }, set: function set(t) {
          Pt.b.log("set currentLevel:" + t), this.loadLevel = t, this.streamController.immediateLevelSwitch();
        } }, { key: "nextLevel", get: function get() {
          return this.streamController.nextLevel;
        }, set: function set(t) {
          Pt.b.log("set nextLevel:" + t), this.levelController.manualLevel = t, this.streamController.nextLevelSwitch();
        } }, { key: "loadLevel", get: function get() {
          return this.levelController.level;
        }, set: function set(t) {
          Pt.b.log("set loadLevel:" + t), this.levelController.manualLevel = t;
        } }, { key: "nextLoadLevel", get: function get() {
          return this.levelController.nextLoadLevel;
        }, set: function set(t) {
          this.levelController.nextLoadLevel = t;
        } }, { key: "firstLevel", get: function get() {
          return Math.max(this.levelController.firstLevel, this.minAutoLevel);
        }, set: function set(t) {
          Pt.b.log("set firstLevel:" + t), this.levelController.firstLevel = t;
        } }, { key: "startLevel", get: function get() {
          return this.levelController.startLevel;
        }, set: function set(t) {
          Pt.b.log("set startLevel:" + t);var e = this;-1 !== t && (t = Math.max(t, e.minAutoLevel)), e.levelController.startLevel = t;
        } }, { key: "autoLevelCapping", get: function get() {
          return this._autoLevelCapping;
        }, set: function set(t) {
          Pt.b.log("set autoLevelCapping:" + t), this._autoLevelCapping = t;
        } }, { key: "autoLevelEnabled", get: function get() {
          return -1 === this.levelController.manualLevel;
        } }, { key: "manualLevel", get: function get() {
          return this.levelController.manualLevel;
        } }, { key: "minAutoLevel", get: function get() {
          for (var t = this, e = t.levels, r = t.config.minAutoBitrate, i = e ? e.length : 0, a = 0; a < i; a++) {
            if ((e[a].realBitrate ? Math.max(e[a].realBitrate, e[a].bitrate) : e[a].bitrate) > r) return a;
          }return 0;
        } }, { key: "maxAutoLevel", get: function get() {
          var t = this,
              e = t.levels,
              r = t.autoLevelCapping;return -1 === r && e && e.length ? e.length - 1 : r;
        } }, { key: "nextAutoLevel", get: function get() {
          var t = this;return Math.min(Math.max(t.abrController.nextAutoLevel, t.minAutoLevel), t.maxAutoLevel);
        }, set: function set(t) {
          var e = this;e.abrController.nextAutoLevel = Math.max(e.minAutoLevel, t);
        } }, { key: "audioTracks", get: function get() {
          var t = this.audioTrackController;return t ? t.audioTracks : [];
        } }, { key: "audioTrack", get: function get() {
          var t = this.audioTrackController;return t ? t.audioTrack : -1;
        }, set: function set(t) {
          var e = this.audioTrackController;e && (e.audioTrack = t);
        } }, { key: "liveSyncPosition", get: function get() {
          return this.streamController.liveSyncPosition;
        } }, { key: "subtitleTracks", get: function get() {
          var t = this.subtitleTrackController;return t ? t.subtitleTracks : [];
        } }, { key: "subtitleTrack", get: function get() {
          var t = this.subtitleTrackController;return t ? t.subtitleTrack : -1;
        }, set: function set(t) {
          var e = this.subtitleTrackController;e && (e.subtitleTrack = t);
        } }, { key: "subtitleDisplay", get: function get() {
          var t = this.subtitleTrackController;return !!t && t.subtitleDisplay;
        }, set: function set(t) {
          var e = this.subtitleTrackController;e && (e.subtitleDisplay = t);
        } }]), t;
    }();e.default = Mr;
  }, function (t, e, r) {
    function i(t) {
      function e(i) {
        if (r[i]) return r[i].exports;var a = r[i] = { i: i, l: !1, exports: {} };return t[i].call(a.exports, a, a.exports, e), a.l = !0, a.exports;
      }var r = {};e.m = t, e.c = r, e.i = function (t) {
        return t;
      }, e.d = function (t, r, i) {
        e.o(t, r) || Object.defineProperty(t, r, { configurable: !1, enumerable: !0, get: i });
      }, e.n = function (t) {
        var r = t && t.__esModule ? function () {
          return t.default;
        } : function () {
          return t;
        };return e.d(r, "a", r), r;
      }, e.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
      }, e.p = "/", e.oe = function (t) {
        throw console.error(t), t;
      };var i = e(e.s = ENTRY_MODULE);return i.default || i;
    }function a(t) {
      return (t + "").replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
    }function n(t) {
      var e = [],
          r = t.toString(),
          i = r.match(/^function\s?\(\w+,\s*\w+,\s*(\w+)\)/);if (!i) return e;for (var n, o = i[1], s = new RegExp("(\\\\n|\\W)" + a(o) + "\\((/\\*.*?\\*/)?s?.*?([\\.|\\-|\\w|/|@]+).*?\\)", "g"); n = s.exec(r);) {
        e.push(n[3]);
      }return e;
    }function o(t, e) {
      for (var r = [e], i = [], a = {}; r.length;) {
        var o = r.pop();if (!a[o] && t[o]) {
          a[o] = !0, i.push(o);var s = n(t[o]);r = r.concat(s);
        }
      }return i;
    }t.exports = function (t, e) {
      e = e || {};var a = r.m,
          n = e.all ? Object.keys(a) : o(a, t),
          s = "(" + i.toString().replace("ENTRY_MODULE", JSON.stringify(t)) + ")({" + n.map(function (t) {
        return JSON.stringify(t) + ": " + a[t].toString();
      }).join(",") + "})(self);",
          l = new window.Blob([s], { type: "text/javascript" });if (e.bare) return l;var u = window.URL || window.webkitURL || window.mozURL || window.msURL,
          d = u.createObjectURL(l),
          h = new window.Worker(d);return h.objectURL = d, h;
    };
  }, function (t, e, r) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });var i = r(7),
        a = r(1),
        n = r(0),
        o = r(5),
        s = r.n(o),
        l = function l(t) {
      var e = new s.a();e.trigger = function (t) {
        for (var r = arguments.length, i = Array(r > 1 ? r - 1 : 0), a = 1; a < r; a++) {
          i[a - 1] = arguments[a];
        }e.emit.apply(e, [t, t].concat(i));
      }, e.off = function (t) {
        for (var r = arguments.length, i = Array(r > 1 ? r - 1 : 0), a = 1; a < r; a++) {
          i[a - 1] = arguments[a];
        }e.removeListener.apply(e, [t].concat(i));
      };var r = function r(e, _r2) {
        t.postMessage({ event: e, data: _r2 });
      };t.addEventListener("message", function (a) {
        var o = a.data;switch (o.cmd) {case "init":
            var s = JSON.parse(o.config);t.demuxer = new i.a(e, o.typeSupported, s, o.vendor);try {
              Object(n.a)(!0 === s.debug);
            } catch (t) {
              console.warn("demuxerWorker: unable to enable logs");
            }r("init", null);break;case "demux":
            t.demuxer.push(o.data, o.decryptdata, o.initSegment, o.audioCodec, o.videoCodec, o.timeOffset, o.discontinuity, o.trackSwitch, o.contiguous, o.duration, o.accurateTimeOffset, o.defaultInitPTS);}
      }), e.on(a.a.FRAG_DECRYPTED, r), e.on(a.a.FRAG_PARSING_INIT_SEGMENT, r), e.on(a.a.FRAG_PARSED, r), e.on(a.a.ERROR, r), e.on(a.a.FRAG_PARSING_METADATA, r), e.on(a.a.FRAG_PARSING_USERDATA, r), e.on(a.a.INIT_PTS_FOUND, r), e.on(a.a.FRAG_PARSING_DATA, function (e, r) {
        var i = [],
            a = { event: e, data: r };r.data1 && (a.data1 = r.data1.buffer, i.push(r.data1.buffer), delete r.data1), r.data2 && (a.data2 = r.data2.buffer, i.push(r.data2.buffer), delete r.data2), t.postMessage(a, i);
      });
    };e.default = l;
  }]).default;
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21)(module)))

/***/ })
/******/ ]);
});
//# sourceMappingURL=hls-peerify-bundle.js.map