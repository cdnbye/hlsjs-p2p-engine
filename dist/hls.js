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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
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
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*The core component of cdnbye project*/
!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "object" == ( false ? "undefined" : _typeof(module)) ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? exports.CDNByeCore = t() : e.CDNByeCore = t();
}("undefined" != typeof self ? self : undefined, function () {
  return function (e) {
    function t(r) {
      if (n[r]) return n[r].exports;var i = n[r] = { i: r, l: !1, exports: {} };return e[r].call(i.exports, i, i.exports, t), i.l = !0, i.exports;
    }var n = {};return t.m = e, t.c = n, t.d = function (e, n, r) {
      t.o(e, n) || Object.defineProperty(e, n, { configurable: !1, enumerable: !0, get: r });
    }, t.n = function (e) {
      var n = e && e.__esModule ? function () {
        return e.default;
      } : function () {
        return e;
      };return t.d(n, "a", n), n;
    }, t.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }, t.p = "", t(t.s = 19);
  }([function (e, t) {
    var n;n = function () {
      return this;
    }();try {
      n = n || Function("return this")() || (0, eval)("this");
    } catch (e) {
      "object" == (typeof window === "undefined" ? "undefined" : _typeof(window)) && (n = window);
    }e.exports = n;
  }, function (e, t) {
    function n() {
      throw new Error("setTimeout has not been defined");
    }function r() {
      throw new Error("clearTimeout has not been defined");
    }function i(e) {
      if (f === setTimeout) return setTimeout(e, 0);if ((f === n || !f) && setTimeout) return f = setTimeout, setTimeout(e, 0);try {
        return f(e, 0);
      } catch (t) {
        try {
          return f.call(null, e, 0);
        } catch (t) {
          return f.call(this, e, 0);
        }
      }
    }function o(e) {
      if (l === clearTimeout) return clearTimeout(e);if ((l === r || !l) && clearTimeout) return l = clearTimeout, clearTimeout(e);try {
        return l(e);
      } catch (t) {
        try {
          return l.call(null, e);
        } catch (t) {
          return l.call(this, e);
        }
      }
    }function a() {
      g && d && (g = !1, d.length ? p = d.concat(p) : y = -1, p.length && s());
    }function s() {
      if (!g) {
        var e = i(a);g = !0;for (var t = p.length; t;) {
          for (d = p, p = []; ++y < t;) {
            d && d[y].run();
          }y = -1, t = p.length;
        }d = null, g = !1, o(e);
      }
    }function u(e, t) {
      this.fun = e, this.array = t;
    }function c() {}var f,
        l,
        h = e.exports = {};!function () {
      try {
        f = "function" == typeof setTimeout ? setTimeout : n;
      } catch (e) {
        f = n;
      }try {
        l = "function" == typeof clearTimeout ? clearTimeout : r;
      } catch (e) {
        l = r;
      }
    }();var d,
        p = [],
        g = !1,
        y = -1;h.nextTick = function (e) {
      var t = new Array(arguments.length - 1);if (arguments.length > 1) for (var n = 1; n < arguments.length; n++) {
        t[n - 1] = arguments[n];
      }p.push(new u(e, t)), 1 !== p.length || g || i(s);
    }, u.prototype.run = function () {
      this.fun.apply(null, this.array);
    }, h.title = "browser", h.browser = !0, h.env = {}, h.argv = [], h.version = "", h.versions = {}, h.on = c, h.addListener = c, h.once = c, h.off = c, h.removeListener = c, h.removeAllListeners = c, h.emit = c, h.prependListener = c, h.prependOnceListener = c, h.listeners = function (e) {
      return [];
    }, h.binding = function (e) {
      throw new Error("process.binding is not supported");
    }, h.cwd = function () {
      return "/";
    }, h.chdir = function (e) {
      throw new Error("process.chdir is not supported");
    }, h.umask = function () {
      return 0;
    };
  }, function (e, t) {
    "function" == typeof Object.create ? e.exports = function (e, t) {
      e.super_ = t, e.prototype = Object.create(t.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } });
    } : e.exports = function (e, t) {
      e.super_ = t;var n = function n() {};n.prototype = t.prototype, e.prototype = new n(), e.prototype.constructor = e;
    };
  }, function (e, t, n) {
    "use strict";
    function r(e) {
      if (!(this instanceof r)) return new r(e);c.call(this, e), f.call(this, e), e && !1 === e.readable && (this.readable = !1), e && !1 === e.writable && (this.writable = !1), this.allowHalfOpen = !0, e && !1 === e.allowHalfOpen && (this.allowHalfOpen = !1), this.once("end", i);
    }function i() {
      this.allowHalfOpen || this._writableState.ended || a.nextTick(o, this);
    }function o(e) {
      e.end();
    }var a = n(7),
        s = Object.keys || function (e) {
      var t = [];for (var n in e) {
        t.push(n);
      }return t;
    };e.exports = r;var u = n(6);u.inherits = n(2);var c = n(11),
        f = n(14);u.inherits(r, c);for (var l = s(f.prototype), h = 0; h < l.length; h++) {
      var d = l[h];r.prototype[d] || (r.prototype[d] = f.prototype[d]);
    }Object.defineProperty(r.prototype, "writableHighWaterMark", { enumerable: !1, get: function get() {
        return this._writableState.highWaterMark;
      } }), Object.defineProperty(r.prototype, "destroyed", { get: function get() {
        return void 0 !== this._readableState && void 0 !== this._writableState && this._readableState.destroyed && this._writableState.destroyed;
      }, set: function set(e) {
        void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed = e, this._writableState.destroyed = e);
      } }), r.prototype._destroy = function (e, t) {
      this.push(null), this.end(), a.nextTick(t, e);
    };
  }, function (e, t, n) {
    "use strict";
    (function (e) {
      function r() {
        return o.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
      }function i(e, t) {
        if (r() < t) throw new RangeError("Invalid typed array length");return o.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t), e.__proto__ = o.prototype) : (null === e && (e = new o(t)), e.length = t), e;
      }function o(e, t, n) {
        if (!(o.TYPED_ARRAY_SUPPORT || this instanceof o)) return new o(e, t, n);if ("number" == typeof e) {
          if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");return c(this, e);
        }return a(this, e, t, n);
      }function a(e, t, n, r) {
        if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? h(e, t, n, r) : "string" == typeof t ? f(e, t, n) : d(e, t);
      }function s(e) {
        if ("number" != typeof e) throw new TypeError('"size" argument must be a number');if (e < 0) throw new RangeError('"size" argument must not be negative');
      }function u(e, t, n, r) {
        return s(t), t <= 0 ? i(e, t) : void 0 !== n ? "string" == typeof r ? i(e, t).fill(n, r) : i(e, t).fill(n) : i(e, t);
      }function c(e, t) {
        if (s(t), e = i(e, t < 0 ? 0 : 0 | p(t)), !o.TYPED_ARRAY_SUPPORT) for (var n = 0; n < t; ++n) {
          e[n] = 0;
        }return e;
      }function f(e, t, n) {
        if ("string" == typeof n && "" !== n || (n = "utf8"), !o.isEncoding(n)) throw new TypeError('"encoding" must be a valid string encoding');var r = 0 | y(t, n);e = i(e, r);var a = e.write(t, n);return a !== r && (e = e.slice(0, a)), e;
      }function l(e, t) {
        var n = t.length < 0 ? 0 : 0 | p(t.length);e = i(e, n);for (var r = 0; r < n; r += 1) {
          e[r] = 255 & t[r];
        }return e;
      }function h(e, t, n, r) {
        if (t.byteLength, n < 0 || t.byteLength < n) throw new RangeError("'offset' is out of bounds");if (t.byteLength < n + (r || 0)) throw new RangeError("'length' is out of bounds");return t = void 0 === n && void 0 === r ? new Uint8Array(t) : void 0 === r ? new Uint8Array(t, n) : new Uint8Array(t, n, r), o.TYPED_ARRAY_SUPPORT ? (e = t, e.__proto__ = o.prototype) : e = l(e, t), e;
      }function d(e, t) {
        if (o.isBuffer(t)) {
          var n = 0 | p(t.length);return e = i(e, n), 0 === e.length ? e : (t.copy(e, 0, 0, n), e);
        }if (t) {
          if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || V(t.length) ? i(e, 0) : l(e, t);if ("Buffer" === t.type && Z(t.data)) return l(e, t.data);
        }throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
      }function p(e) {
        if (e >= r()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + r().toString(16) + " bytes");return 0 | e;
      }function g(e) {
        return +e != e && (e = 0), o.alloc(+e);
      }function y(e, t) {
        if (o.isBuffer(e)) return e.length;if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength;"string" != typeof e && (e = "" + e);var n = e.length;if (0 === n) return 0;for (var r = !1;;) {
          switch (t) {case "ascii":case "latin1":case "binary":
              return n;case "utf8":case "utf-8":case void 0:
              return z(e).length;case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":
              return 2 * n;case "hex":
              return n >>> 1;case "base64":
              return Q(e).length;default:
              if (r) return z(e).length;t = ("" + t).toLowerCase(), r = !0;}
        }
      }function v(e, t, n) {
        var r = !1;if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";if ((void 0 === n || n > this.length) && (n = this.length), n <= 0) return "";if (n >>>= 0, t >>>= 0, n <= t) return "";for (e || (e = "utf8");;) {
          switch (e) {case "hex":
              return I(this, t, n);case "utf8":case "utf-8":
              return k(this, t, n);case "ascii":
              return x(this, t, n);case "latin1":case "binary":
              return O(this, t, n);case "base64":
              return A(this, t, n);case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":
              return D(this, t, n);default:
              if (r) throw new TypeError("Unknown encoding: " + e);e = (e + "").toLowerCase(), r = !0;}
        }
      }function m(e, t, n) {
        var r = e[t];e[t] = e[n], e[n] = r;
      }function b(e, t, n, r, i) {
        if (0 === e.length) return -1;if ("string" == typeof n ? (r = n, n = 0) : n > 2147483647 ? n = 2147483647 : n < -2147483648 && (n = -2147483648), n = +n, isNaN(n) && (n = i ? 0 : e.length - 1), n < 0 && (n = e.length + n), n >= e.length) {
          if (i) return -1;n = e.length - 1;
        } else if (n < 0) {
          if (!i) return -1;n = 0;
        }if ("string" == typeof t && (t = o.from(t, r)), o.isBuffer(t)) return 0 === t.length ? -1 : _(e, t, n, r, i);if ("number" == typeof t) return t &= 255, o.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(e, t, n) : Uint8Array.prototype.lastIndexOf.call(e, t, n) : _(e, [t], n, r, i);throw new TypeError("val must be string, number or Buffer");
      }function _(e, t, n, r, i) {
        function o(e, t) {
          return 1 === a ? e[t] : e.readUInt16BE(t * a);
        }var a = 1,
            s = e.length,
            u = t.length;if (void 0 !== r && ("ucs2" === (r = String(r).toLowerCase()) || "ucs-2" === r || "utf16le" === r || "utf-16le" === r)) {
          if (e.length < 2 || t.length < 2) return -1;a = 2, s /= 2, u /= 2, n /= 2;
        }var c;if (i) {
          var f = -1;for (c = n; c < s; c++) {
            if (o(e, c) === o(t, -1 === f ? 0 : c - f)) {
              if (-1 === f && (f = c), c - f + 1 === u) return f * a;
            } else -1 !== f && (c -= c - f), f = -1;
          }
        } else for (n + u > s && (n = s - u), c = n; c >= 0; c--) {
          for (var l = !0, h = 0; h < u; h++) {
            if (o(e, c + h) !== o(t, h)) {
              l = !1;break;
            }
          }if (l) return c;
        }return -1;
      }function w(e, t, n, r) {
        n = Number(n) || 0;var i = e.length - n;r ? (r = Number(r)) > i && (r = i) : r = i;var o = t.length;if (o % 2 != 0) throw new TypeError("Invalid hex string");r > o / 2 && (r = o / 2);for (var a = 0; a < r; ++a) {
          var s = parseInt(t.substr(2 * a, 2), 16);if (isNaN(s)) return a;e[n + a] = s;
        }return a;
      }function C(e, t, n, r) {
        return G(z(t, e.length - n), e, n, r);
      }function S(e, t, n, r) {
        return G(H(t), e, n, r);
      }function E(e, t, n, r) {
        return S(e, t, n, r);
      }function T(e, t, n, r) {
        return G(Q(t), e, n, r);
      }function R(e, t, n, r) {
        return G(J(t, e.length - n), e, n, r);
      }function A(e, t, n) {
        return 0 === t && n === e.length ? K.fromByteArray(e) : K.fromByteArray(e.slice(t, n));
      }function k(e, t, n) {
        n = Math.min(e.length, n);for (var r = [], i = t; i < n;) {
          var o = e[i],
              a = null,
              s = o > 239 ? 4 : o > 223 ? 3 : o > 191 ? 2 : 1;if (i + s <= n) {
            var u, c, f, l;switch (s) {case 1:
                o < 128 && (a = o);break;case 2:
                u = e[i + 1], 128 == (192 & u) && (l = (31 & o) << 6 | 63 & u) > 127 && (a = l);break;case 3:
                u = e[i + 1], c = e[i + 2], 128 == (192 & u) && 128 == (192 & c) && (l = (15 & o) << 12 | (63 & u) << 6 | 63 & c) > 2047 && (l < 55296 || l > 57343) && (a = l);break;case 4:
                u = e[i + 1], c = e[i + 2], f = e[i + 3], 128 == (192 & u) && 128 == (192 & c) && 128 == (192 & f) && (l = (15 & o) << 18 | (63 & u) << 12 | (63 & c) << 6 | 63 & f) > 65535 && l < 1114112 && (a = l);}
          }null === a ? (a = 65533, s = 1) : a > 65535 && (a -= 65536, r.push(a >>> 10 & 1023 | 55296), a = 56320 | 1023 & a), r.push(a), i += s;
        }return P(r);
      }function P(e) {
        var t = e.length;if (t <= X) return String.fromCharCode.apply(String, e);for (var n = "", r = 0; r < t;) {
          n += String.fromCharCode.apply(String, e.slice(r, r += X));
        }return n;
      }function x(e, t, n) {
        var r = "";n = Math.min(e.length, n);for (var i = t; i < n; ++i) {
          r += String.fromCharCode(127 & e[i]);
        }return r;
      }function O(e, t, n) {
        var r = "";n = Math.min(e.length, n);for (var i = t; i < n; ++i) {
          r += String.fromCharCode(e[i]);
        }return r;
      }function I(e, t, n) {
        var r = e.length;(!t || t < 0) && (t = 0), (!n || n < 0 || n > r) && (n = r);for (var i = "", o = t; o < n; ++o) {
          i += W(e[o]);
        }return i;
      }function D(e, t, n) {
        for (var r = e.slice(t, n), i = "", o = 0; o < r.length; o += 2) {
          i += String.fromCharCode(r[o] + 256 * r[o + 1]);
        }return i;
      }function M(e, t, n) {
        if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");if (e + t > n) throw new RangeError("Trying to access beyond buffer length");
      }function L(e, t, n, r, i, a) {
        if (!o.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');if (t > i || t < a) throw new RangeError('"value" argument is out of bounds');if (n + r > e.length) throw new RangeError("Index out of range");
      }function B(e, t, n, r) {
        t < 0 && (t = 65535 + t + 1);for (var i = 0, o = Math.min(e.length - n, 2); i < o; ++i) {
          e[n + i] = (t & 255 << 8 * (r ? i : 1 - i)) >>> 8 * (r ? i : 1 - i);
        }
      }function F(e, t, n, r) {
        t < 0 && (t = 4294967295 + t + 1);for (var i = 0, o = Math.min(e.length - n, 4); i < o; ++i) {
          e[n + i] = t >>> 8 * (r ? i : 3 - i) & 255;
        }
      }function N(e, t, n, r, i, o) {
        if (n + r > e.length) throw new RangeError("Index out of range");if (n < 0) throw new RangeError("Index out of range");
      }function U(e, t, n, r, i) {
        return i || N(e, t, n, 4, 3.4028234663852886e38, -3.4028234663852886e38), $.write(e, t, n, r, 23, 4), n + 4;
      }function j(e, t, n, r, i) {
        return i || N(e, t, n, 8, 1.7976931348623157e308, -1.7976931348623157e308), $.write(e, t, n, r, 52, 8), n + 8;
      }function q(e) {
        if (e = Y(e).replace(ee, ""), e.length < 2) return "";for (; e.length % 4 != 0;) {
          e += "=";
        }return e;
      }function Y(e) {
        return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");
      }function W(e) {
        return e < 16 ? "0" + e.toString(16) : e.toString(16);
      }function z(e, t) {
        t = t || 1 / 0;for (var n, r = e.length, i = null, o = [], a = 0; a < r; ++a) {
          if ((n = e.charCodeAt(a)) > 55295 && n < 57344) {
            if (!i) {
              if (n > 56319) {
                (t -= 3) > -1 && o.push(239, 191, 189);continue;
              }if (a + 1 === r) {
                (t -= 3) > -1 && o.push(239, 191, 189);continue;
              }i = n;continue;
            }if (n < 56320) {
              (t -= 3) > -1 && o.push(239, 191, 189), i = n;continue;
            }n = 65536 + (i - 55296 << 10 | n - 56320);
          } else i && (t -= 3) > -1 && o.push(239, 191, 189);if (i = null, n < 128) {
            if ((t -= 1) < 0) break;o.push(n);
          } else if (n < 2048) {
            if ((t -= 2) < 0) break;o.push(n >> 6 | 192, 63 & n | 128);
          } else if (n < 65536) {
            if ((t -= 3) < 0) break;o.push(n >> 12 | 224, n >> 6 & 63 | 128, 63 & n | 128);
          } else {
            if (!(n < 1114112)) throw new Error("Invalid code point");if ((t -= 4) < 0) break;o.push(n >> 18 | 240, n >> 12 & 63 | 128, n >> 6 & 63 | 128, 63 & n | 128);
          }
        }return o;
      }function H(e) {
        for (var t = [], n = 0; n < e.length; ++n) {
          t.push(255 & e.charCodeAt(n));
        }return t;
      }function J(e, t) {
        for (var n, r, i, o = [], a = 0; a < e.length && !((t -= 2) < 0); ++a) {
          n = e.charCodeAt(a), r = n >> 8, i = n % 256, o.push(i), o.push(r);
        }return o;
      }function Q(e) {
        return K.toByteArray(q(e));
      }function G(e, t, n, r) {
        for (var i = 0; i < r && !(i + n >= t.length || i >= e.length); ++i) {
          t[i + n] = e[i];
        }return i;
      }function V(e) {
        return e !== e;
      }var K = n(22),
          $ = n(23),
          Z = n(9);t.Buffer = o, t.SlowBuffer = g, t.INSPECT_MAX_BYTES = 50, o.TYPED_ARRAY_SUPPORT = void 0 !== e.TYPED_ARRAY_SUPPORT ? e.TYPED_ARRAY_SUPPORT : function () {
        try {
          var e = new Uint8Array(1);return e.__proto__ = { __proto__: Uint8Array.prototype, foo: function foo() {
              return 42;
            } }, 42 === e.foo() && "function" == typeof e.subarray && 0 === e.subarray(1, 1).byteLength;
        } catch (e) {
          return !1;
        }
      }(), t.kMaxLength = r(), o.poolSize = 8192, o._augment = function (e) {
        return e.__proto__ = o.prototype, e;
      }, o.from = function (e, t, n) {
        return a(null, e, t, n);
      }, o.TYPED_ARRAY_SUPPORT && (o.prototype.__proto__ = Uint8Array.prototype, o.__proto__ = Uint8Array, "undefined" != typeof Symbol && Symbol.species && o[Symbol.species] === o && Object.defineProperty(o, Symbol.species, { value: null, configurable: !0 })), o.alloc = function (e, t, n) {
        return u(null, e, t, n);
      }, o.allocUnsafe = function (e) {
        return c(null, e);
      }, o.allocUnsafeSlow = function (e) {
        return c(null, e);
      }, o.isBuffer = function (e) {
        return !(null == e || !e._isBuffer);
      }, o.compare = function (e, t) {
        if (!o.isBuffer(e) || !o.isBuffer(t)) throw new TypeError("Arguments must be Buffers");if (e === t) return 0;for (var n = e.length, r = t.length, i = 0, a = Math.min(n, r); i < a; ++i) {
          if (e[i] !== t[i]) {
            n = e[i], r = t[i];break;
          }
        }return n < r ? -1 : r < n ? 1 : 0;
      }, o.isEncoding = function (e) {
        switch (String(e).toLowerCase()) {case "hex":case "utf8":case "utf-8":case "ascii":case "latin1":case "binary":case "base64":case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":
            return !0;default:
            return !1;}
      }, o.concat = function (e, t) {
        if (!Z(e)) throw new TypeError('"list" argument must be an Array of Buffers');if (0 === e.length) return o.alloc(0);var n;if (void 0 === t) for (t = 0, n = 0; n < e.length; ++n) {
          t += e[n].length;
        }var r = o.allocUnsafe(t),
            i = 0;for (n = 0; n < e.length; ++n) {
          var a = e[n];if (!o.isBuffer(a)) throw new TypeError('"list" argument must be an Array of Buffers');a.copy(r, i), i += a.length;
        }return r;
      }, o.byteLength = y, o.prototype._isBuffer = !0, o.prototype.swap16 = function () {
        var e = this.length;if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");for (var t = 0; t < e; t += 2) {
          m(this, t, t + 1);
        }return this;
      }, o.prototype.swap32 = function () {
        var e = this.length;if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");for (var t = 0; t < e; t += 4) {
          m(this, t, t + 3), m(this, t + 1, t + 2);
        }return this;
      }, o.prototype.swap64 = function () {
        var e = this.length;if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");for (var t = 0; t < e; t += 8) {
          m(this, t, t + 7), m(this, t + 1, t + 6), m(this, t + 2, t + 5), m(this, t + 3, t + 4);
        }return this;
      }, o.prototype.toString = function () {
        var e = 0 | this.length;return 0 === e ? "" : 0 === arguments.length ? k(this, 0, e) : v.apply(this, arguments);
      }, o.prototype.equals = function (e) {
        if (!o.isBuffer(e)) throw new TypeError("Argument must be a Buffer");return this === e || 0 === o.compare(this, e);
      }, o.prototype.inspect = function () {
        var e = "",
            n = t.INSPECT_MAX_BYTES;return this.length > 0 && (e = this.toString("hex", 0, n).match(/.{2}/g).join(" "), this.length > n && (e += " ... ")), "<Buffer " + e + ">";
      }, o.prototype.compare = function (e, t, n, r, i) {
        if (!o.isBuffer(e)) throw new TypeError("Argument must be a Buffer");if (void 0 === t && (t = 0), void 0 === n && (n = e ? e.length : 0), void 0 === r && (r = 0), void 0 === i && (i = this.length), t < 0 || n > e.length || r < 0 || i > this.length) throw new RangeError("out of range index");if (r >= i && t >= n) return 0;if (r >= i) return -1;if (t >= n) return 1;if (t >>>= 0, n >>>= 0, r >>>= 0, i >>>= 0, this === e) return 0;for (var a = i - r, s = n - t, u = Math.min(a, s), c = this.slice(r, i), f = e.slice(t, n), l = 0; l < u; ++l) {
          if (c[l] !== f[l]) {
            a = c[l], s = f[l];break;
          }
        }return a < s ? -1 : s < a ? 1 : 0;
      }, o.prototype.includes = function (e, t, n) {
        return -1 !== this.indexOf(e, t, n);
      }, o.prototype.indexOf = function (e, t, n) {
        return b(this, e, t, n, !0);
      }, o.prototype.lastIndexOf = function (e, t, n) {
        return b(this, e, t, n, !1);
      }, o.prototype.write = function (e, t, n, r) {
        if (void 0 === t) r = "utf8", n = this.length, t = 0;else if (void 0 === n && "string" == typeof t) r = t, n = this.length, t = 0;else {
          if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");t |= 0, isFinite(n) ? (n |= 0, void 0 === r && (r = "utf8")) : (r = n, n = void 0);
        }var i = this.length - t;if ((void 0 === n || n > i) && (n = i), e.length > 0 && (n < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");r || (r = "utf8");for (var o = !1;;) {
          switch (r) {case "hex":
              return w(this, e, t, n);case "utf8":case "utf-8":
              return C(this, e, t, n);case "ascii":
              return S(this, e, t, n);case "latin1":case "binary":
              return E(this, e, t, n);case "base64":
              return T(this, e, t, n);case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":
              return R(this, e, t, n);default:
              if (o) throw new TypeError("Unknown encoding: " + r);r = ("" + r).toLowerCase(), o = !0;}
        }
      }, o.prototype.toJSON = function () {
        return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
      };var X = 4096;o.prototype.slice = function (e, t) {
        var n = this.length;e = ~~e, t = void 0 === t ? n : ~~t, e < 0 ? (e += n) < 0 && (e = 0) : e > n && (e = n), t < 0 ? (t += n) < 0 && (t = 0) : t > n && (t = n), t < e && (t = e);var r;if (o.TYPED_ARRAY_SUPPORT) r = this.subarray(e, t), r.__proto__ = o.prototype;else {
          var i = t - e;r = new o(i, void 0);for (var a = 0; a < i; ++a) {
            r[a] = this[a + e];
          }
        }return r;
      }, o.prototype.readUIntLE = function (e, t, n) {
        e |= 0, t |= 0, n || M(e, t, this.length);for (var r = this[e], i = 1, o = 0; ++o < t && (i *= 256);) {
          r += this[e + o] * i;
        }return r;
      }, o.prototype.readUIntBE = function (e, t, n) {
        e |= 0, t |= 0, n || M(e, t, this.length);for (var r = this[e + --t], i = 1; t > 0 && (i *= 256);) {
          r += this[e + --t] * i;
        }return r;
      }, o.prototype.readUInt8 = function (e, t) {
        return t || M(e, 1, this.length), this[e];
      }, o.prototype.readUInt16LE = function (e, t) {
        return t || M(e, 2, this.length), this[e] | this[e + 1] << 8;
      }, o.prototype.readUInt16BE = function (e, t) {
        return t || M(e, 2, this.length), this[e] << 8 | this[e + 1];
      }, o.prototype.readUInt32LE = function (e, t) {
        return t || M(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3];
      }, o.prototype.readUInt32BE = function (e, t) {
        return t || M(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
      }, o.prototype.readIntLE = function (e, t, n) {
        e |= 0, t |= 0, n || M(e, t, this.length);for (var r = this[e], i = 1, o = 0; ++o < t && (i *= 256);) {
          r += this[e + o] * i;
        }return i *= 128, r >= i && (r -= Math.pow(2, 8 * t)), r;
      }, o.prototype.readIntBE = function (e, t, n) {
        e |= 0, t |= 0, n || M(e, t, this.length);for (var r = t, i = 1, o = this[e + --r]; r > 0 && (i *= 256);) {
          o += this[e + --r] * i;
        }return i *= 128, o >= i && (o -= Math.pow(2, 8 * t)), o;
      }, o.prototype.readInt8 = function (e, t) {
        return t || M(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e];
      }, o.prototype.readInt16LE = function (e, t) {
        t || M(e, 2, this.length);var n = this[e] | this[e + 1] << 8;return 32768 & n ? 4294901760 | n : n;
      }, o.prototype.readInt16BE = function (e, t) {
        t || M(e, 2, this.length);var n = this[e + 1] | this[e] << 8;return 32768 & n ? 4294901760 | n : n;
      }, o.prototype.readInt32LE = function (e, t) {
        return t || M(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
      }, o.prototype.readInt32BE = function (e, t) {
        return t || M(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
      }, o.prototype.readFloatLE = function (e, t) {
        return t || M(e, 4, this.length), $.read(this, e, !0, 23, 4);
      }, o.prototype.readFloatBE = function (e, t) {
        return t || M(e, 4, this.length), $.read(this, e, !1, 23, 4);
      }, o.prototype.readDoubleLE = function (e, t) {
        return t || M(e, 8, this.length), $.read(this, e, !0, 52, 8);
      }, o.prototype.readDoubleBE = function (e, t) {
        return t || M(e, 8, this.length), $.read(this, e, !1, 52, 8);
      }, o.prototype.writeUIntLE = function (e, t, n, r) {
        if (e = +e, t |= 0, n |= 0, !r) {
          L(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);
        }var i = 1,
            o = 0;for (this[t] = 255 & e; ++o < n && (i *= 256);) {
          this[t + o] = e / i & 255;
        }return t + n;
      }, o.prototype.writeUIntBE = function (e, t, n, r) {
        if (e = +e, t |= 0, n |= 0, !r) {
          L(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);
        }var i = n - 1,
            o = 1;for (this[t + i] = 255 & e; --i >= 0 && (o *= 256);) {
          this[t + i] = e / o & 255;
        }return t + n;
      }, o.prototype.writeUInt8 = function (e, t, n) {
        return e = +e, t |= 0, n || L(this, e, t, 1, 255, 0), o.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), this[t] = 255 & e, t + 1;
      }, o.prototype.writeUInt16LE = function (e, t, n) {
        return e = +e, t |= 0, n || L(this, e, t, 2, 65535, 0), o.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : B(this, e, t, !0), t + 2;
      }, o.prototype.writeUInt16BE = function (e, t, n) {
        return e = +e, t |= 0, n || L(this, e, t, 2, 65535, 0), o.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : B(this, e, t, !1), t + 2;
      }, o.prototype.writeUInt32LE = function (e, t, n) {
        return e = +e, t |= 0, n || L(this, e, t, 4, 4294967295, 0), o.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e) : F(this, e, t, !0), t + 4;
      }, o.prototype.writeUInt32BE = function (e, t, n) {
        return e = +e, t |= 0, n || L(this, e, t, 4, 4294967295, 0), o.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : F(this, e, t, !1), t + 4;
      }, o.prototype.writeIntLE = function (e, t, n, r) {
        if (e = +e, t |= 0, !r) {
          var i = Math.pow(2, 8 * n - 1);L(this, e, t, n, i - 1, -i);
        }var o = 0,
            a = 1,
            s = 0;for (this[t] = 255 & e; ++o < n && (a *= 256);) {
          e < 0 && 0 === s && 0 !== this[t + o - 1] && (s = 1), this[t + o] = (e / a >> 0) - s & 255;
        }return t + n;
      }, o.prototype.writeIntBE = function (e, t, n, r) {
        if (e = +e, t |= 0, !r) {
          var i = Math.pow(2, 8 * n - 1);L(this, e, t, n, i - 1, -i);
        }var o = n - 1,
            a = 1,
            s = 0;for (this[t + o] = 255 & e; --o >= 0 && (a *= 256);) {
          e < 0 && 0 === s && 0 !== this[t + o + 1] && (s = 1), this[t + o] = (e / a >> 0) - s & 255;
        }return t + n;
      }, o.prototype.writeInt8 = function (e, t, n) {
        return e = +e, t |= 0, n || L(this, e, t, 1, 127, -128), o.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1;
      }, o.prototype.writeInt16LE = function (e, t, n) {
        return e = +e, t |= 0, n || L(this, e, t, 2, 32767, -32768), o.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : B(this, e, t, !0), t + 2;
      }, o.prototype.writeInt16BE = function (e, t, n) {
        return e = +e, t |= 0, n || L(this, e, t, 2, 32767, -32768), o.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : B(this, e, t, !1), t + 2;
      }, o.prototype.writeInt32LE = function (e, t, n) {
        return e = +e, t |= 0, n || L(this, e, t, 4, 2147483647, -2147483648), o.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : F(this, e, t, !0), t + 4;
      }, o.prototype.writeInt32BE = function (e, t, n) {
        return e = +e, t |= 0, n || L(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), o.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : F(this, e, t, !1), t + 4;
      }, o.prototype.writeFloatLE = function (e, t, n) {
        return U(this, e, t, !0, n);
      }, o.prototype.writeFloatBE = function (e, t, n) {
        return U(this, e, t, !1, n);
      }, o.prototype.writeDoubleLE = function (e, t, n) {
        return j(this, e, t, !0, n);
      }, o.prototype.writeDoubleBE = function (e, t, n) {
        return j(this, e, t, !1, n);
      }, o.prototype.copy = function (e, t, n, r) {
        if (n || (n = 0), r || 0 === r || (r = this.length), t >= e.length && (t = e.length), t || (t = 0), r > 0 && r < n && (r = n), r === n) return 0;if (0 === e.length || 0 === this.length) return 0;if (t < 0) throw new RangeError("targetStart out of bounds");if (n < 0 || n >= this.length) throw new RangeError("sourceStart out of bounds");if (r < 0) throw new RangeError("sourceEnd out of bounds");r > this.length && (r = this.length), e.length - t < r - n && (r = e.length - t + n);var i,
            a = r - n;if (this === e && n < t && t < r) for (i = a - 1; i >= 0; --i) {
          e[i + t] = this[i + n];
        } else if (a < 1e3 || !o.TYPED_ARRAY_SUPPORT) for (i = 0; i < a; ++i) {
          e[i + t] = this[i + n];
        } else Uint8Array.prototype.set.call(e, this.subarray(n, n + a), t);return a;
      }, o.prototype.fill = function (e, t, n, r) {
        if ("string" == typeof e) {
          if ("string" == typeof t ? (r = t, t = 0, n = this.length) : "string" == typeof n && (r = n, n = this.length), 1 === e.length) {
            var i = e.charCodeAt(0);i < 256 && (e = i);
          }if (void 0 !== r && "string" != typeof r) throw new TypeError("encoding must be a string");if ("string" == typeof r && !o.isEncoding(r)) throw new TypeError("Unknown encoding: " + r);
        } else "number" == typeof e && (e &= 255);if (t < 0 || this.length < t || this.length < n) throw new RangeError("Out of range index");if (n <= t) return this;t >>>= 0, n = void 0 === n ? this.length : n >>> 0, e || (e = 0);var a;if ("number" == typeof e) for (a = t; a < n; ++a) {
          this[a] = e;
        } else {
          var s = o.isBuffer(e) ? e : z(new o(e, r).toString()),
              u = s.length;for (a = 0; a < n - t; ++a) {
            this[a + t] = s[a % u];
          }
        }return this;
      };var ee = /[^+\/0-9A-Za-z-_]/g;
    }).call(t, n(0));
  }, function (e, t, n) {
    function r(e, t) {
      for (var n in e) {
        t[n] = e[n];
      }
    }function i(e, t, n) {
      return a(e, t, n);
    }var o = n(4),
        a = o.Buffer;a.from && a.alloc && a.allocUnsafe && a.allocUnsafeSlow ? e.exports = o : (r(o, t), t.Buffer = i), r(a, i), i.from = function (e, t, n) {
      if ("number" == typeof e) throw new TypeError("Argument must not be a number");return a(e, t, n);
    }, i.alloc = function (e, t, n) {
      if ("number" != typeof e) throw new TypeError("Argument must be a number");var r = a(e);return void 0 !== t ? "string" == typeof n ? r.fill(t, n) : r.fill(t) : r.fill(0), r;
    }, i.allocUnsafe = function (e) {
      if ("number" != typeof e) throw new TypeError("Argument must be a number");return a(e);
    }, i.allocUnsafeSlow = function (e) {
      if ("number" != typeof e) throw new TypeError("Argument must be a number");return o.SlowBuffer(e);
    };
  }, function (e, t, n) {
    (function (e) {
      function n(e) {
        return Array.isArray ? Array.isArray(e) : "[object Array]" === y(e);
      }function r(e) {
        return "boolean" == typeof e;
      }function i(e) {
        return null === e;
      }function o(e) {
        return null == e;
      }function a(e) {
        return "number" == typeof e;
      }function s(e) {
        return "string" == typeof e;
      }function u(e) {
        return "symbol" == (typeof e === "undefined" ? "undefined" : _typeof(e));
      }function c(e) {
        return void 0 === e;
      }function f(e) {
        return "[object RegExp]" === y(e);
      }function l(e) {
        return "object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) && null !== e;
      }function h(e) {
        return "[object Date]" === y(e);
      }function d(e) {
        return "[object Error]" === y(e) || e instanceof Error;
      }function p(e) {
        return "function" == typeof e;
      }function g(e) {
        return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == (typeof e === "undefined" ? "undefined" : _typeof(e)) || void 0 === e;
      }function y(e) {
        return Object.prototype.toString.call(e);
      }t.isArray = n, t.isBoolean = r, t.isNull = i, t.isNullOrUndefined = o, t.isNumber = a, t.isString = s, t.isSymbol = u, t.isUndefined = c, t.isRegExp = f, t.isObject = l, t.isDate = h, t.isError = d, t.isFunction = p, t.isPrimitive = g, t.isBuffer = e.isBuffer;
    }).call(t, n(4).Buffer);
  }, function (e, t, n) {
    "use strict";
    (function (t) {
      function n(e, n, r, i) {
        if ("function" != typeof e) throw new TypeError('"callback" argument must be a function');var o,
            a,
            s = arguments.length;switch (s) {case 0:case 1:
            return t.nextTick(e);case 2:
            return t.nextTick(function () {
              e.call(null, n);
            });case 3:
            return t.nextTick(function () {
              e.call(null, n, r);
            });case 4:
            return t.nextTick(function () {
              e.call(null, n, r, i);
            });default:
            for (o = new Array(s - 1), a = 0; a < o.length;) {
              o[a++] = arguments[a];
            }return t.nextTick(function () {
              e.apply(null, o);
            });}
      }!t.version || 0 === t.version.indexOf("v0.") || 0 === t.version.indexOf("v1.") && 0 !== t.version.indexOf("v1.8.") ? e.exports = { nextTick: n } : e.exports = t;
    }).call(t, n(1));
  }, function (e, t) {
    function n() {
      this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0;
    }function r(e) {
      return "function" == typeof e;
    }function i(e) {
      return "number" == typeof e;
    }function o(e) {
      return "object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) && null !== e;
    }function a(e) {
      return void 0 === e;
    }e.exports = n, n.EventEmitter = n, n.prototype._events = void 0, n.prototype._maxListeners = void 0, n.defaultMaxListeners = 10, n.prototype.setMaxListeners = function (e) {
      if (!i(e) || e < 0 || isNaN(e)) throw TypeError("n must be a positive number");return this._maxListeners = e, this;
    }, n.prototype.emit = function (e) {
      var t, n, i, s, u, c;if (this._events || (this._events = {}), "error" === e && (!this._events.error || o(this._events.error) && !this._events.error.length)) {
        if ((t = arguments[1]) instanceof Error) throw t;var f = new Error('Uncaught, unspecified "error" event. (' + t + ")");throw f.context = t, f;
      }if (n = this._events[e], a(n)) return !1;if (r(n)) switch (arguments.length) {case 1:
          n.call(this);break;case 2:
          n.call(this, arguments[1]);break;case 3:
          n.call(this, arguments[1], arguments[2]);break;default:
          s = Array.prototype.slice.call(arguments, 1), n.apply(this, s);} else if (o(n)) for (s = Array.prototype.slice.call(arguments, 1), c = n.slice(), i = c.length, u = 0; u < i; u++) {
        c[u].apply(this, s);
      }return !0;
    }, n.prototype.addListener = function (e, t) {
      var i;if (!r(t)) throw TypeError("listener must be a function");return this._events || (this._events = {}), this._events.newListener && this.emit("newListener", e, r(t.listener) ? t.listener : t), this._events[e] ? o(this._events[e]) ? this._events[e].push(t) : this._events[e] = [this._events[e], t] : this._events[e] = t, o(this._events[e]) && !this._events[e].warned && (i = a(this._maxListeners) ? n.defaultMaxListeners : this._maxListeners) && i > 0 && this._events[e].length > i && (this._events[e].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[e].length), "function" == typeof console.trace && console.trace()), this;
    }, n.prototype.on = n.prototype.addListener, n.prototype.once = function (e, t) {
      function n() {
        this.removeListener(e, n), i || (i = !0, t.apply(this, arguments));
      }if (!r(t)) throw TypeError("listener must be a function");var i = !1;return n.listener = t, this.on(e, n), this;
    }, n.prototype.removeListener = function (e, t) {
      var n, i, a, s;if (!r(t)) throw TypeError("listener must be a function");if (!this._events || !this._events[e]) return this;if (n = this._events[e], a = n.length, i = -1, n === t || r(n.listener) && n.listener === t) delete this._events[e], this._events.removeListener && this.emit("removeListener", e, t);else if (o(n)) {
        for (s = a; s-- > 0;) {
          if (n[s] === t || n[s].listener && n[s].listener === t) {
            i = s;break;
          }
        }if (i < 0) return this;1 === n.length ? (n.length = 0, delete this._events[e]) : n.splice(i, 1), this._events.removeListener && this.emit("removeListener", e, t);
      }return this;
    }, n.prototype.removeAllListeners = function (e) {
      var t, n;if (!this._events) return this;if (!this._events.removeListener) return 0 === arguments.length ? this._events = {} : this._events[e] && delete this._events[e], this;if (0 === arguments.length) {
        for (t in this._events) {
          "removeListener" !== t && this.removeAllListeners(t);
        }return this.removeAllListeners("removeListener"), this._events = {}, this;
      }if (n = this._events[e], r(n)) this.removeListener(e, n);else if (n) for (; n.length;) {
        this.removeListener(e, n[n.length - 1]);
      }return delete this._events[e], this;
    }, n.prototype.listeners = function (e) {
      return this._events && this._events[e] ? r(this._events[e]) ? [this._events[e]] : this._events[e].slice() : [];
    }, n.prototype.listenerCount = function (e) {
      if (this._events) {
        var t = this._events[e];if (r(t)) return 1;if (t) return t.length;
      }return 0;
    }, n.listenerCount = function (e, t) {
      return e.listenerCount(t);
    };
  }, function (e, t) {
    var n = {}.toString;e.exports = Array.isArray || function (e) {
      return "[object Array]" == n.call(e);
    };
  }, function (e, t) {
    e.exports = function () {
      if ("undefined" == typeof window) return null;var e = { RTCPeerConnection: window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection, RTCSessionDescription: window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription, RTCIceCandidate: window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate };return e.RTCPeerConnection ? e : null;
    };
  }, function (e, t, n) {
    "use strict";
    (function (t, r) {
      function i(e) {
        return F.from(e);
      }function o(e) {
        return F.isBuffer(e) || e instanceof N;
      }function a(e, t, n) {
        if ("function" == typeof e.prependListener) return e.prependListener(t, n);e._events && e._events[t] ? M(e._events[t]) ? e._events[t].unshift(n) : e._events[t] = [n, e._events[t]] : e.on(t, n);
      }function s(e, t) {
        D = D || n(3), e = e || {};var r = t instanceof D;this.objectMode = !!e.objectMode, r && (this.objectMode = this.objectMode || !!e.readableObjectMode);var i = e.highWaterMark,
            o = e.readableHighWaterMark,
            a = this.objectMode ? 16 : 16384;this.highWaterMark = i || 0 === i ? i : r && (o || 0 === o) ? o : a, this.highWaterMark = Math.floor(this.highWaterMark), this.buffer = new W(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.destroyed = !1, this.defaultEncoding = e.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, e.encoding && (Y || (Y = n(15).StringDecoder), this.decoder = new Y(e.encoding), this.encoding = e.encoding);
      }function u(e) {
        if (D = D || n(3), !(this instanceof u)) return new u(e);this._readableState = new s(e, this), this.readable = !0, e && ("function" == typeof e.read && (this._read = e.read), "function" == typeof e.destroy && (this._destroy = e.destroy)), B.call(this);
      }function c(e, t, n, r, o) {
        var a = e._readableState;if (null === t) a.reading = !1, g(e, a);else {
          var s;o || (s = l(a, t)), s ? e.emit("error", s) : a.objectMode || t && t.length > 0 ? ("string" == typeof t || a.objectMode || Object.getPrototypeOf(t) === F.prototype || (t = i(t)), r ? a.endEmitted ? e.emit("error", new Error("stream.unshift() after end event")) : f(e, a, t, !0) : a.ended ? e.emit("error", new Error("stream.push() after EOF")) : (a.reading = !1, a.decoder && !n ? (t = a.decoder.write(t), a.objectMode || 0 !== t.length ? f(e, a, t, !1) : m(e, a)) : f(e, a, t, !1))) : r || (a.reading = !1);
        }return h(a);
      }function f(e, t, n, r) {
        t.flowing && 0 === t.length && !t.sync ? (e.emit("data", n), e.read(0)) : (t.length += t.objectMode ? 1 : n.length, r ? t.buffer.unshift(n) : t.buffer.push(n), t.needReadable && y(e)), m(e, t);
      }function l(e, t) {
        var n;return o(t) || "string" == typeof t || void 0 === t || e.objectMode || (n = new TypeError("Invalid non-string/buffer chunk")), n;
      }function h(e) {
        return !e.ended && (e.needReadable || e.length < e.highWaterMark || 0 === e.length);
      }function d(e) {
        return e >= J ? e = J : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), e;
      }function p(e, t) {
        return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e !== e ? t.flowing && t.length ? t.buffer.head.data.length : t.length : (e > t.highWaterMark && (t.highWaterMark = d(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));
      }function g(e, t) {
        if (!t.ended) {
          if (t.decoder) {
            var n = t.decoder.end();n && n.length && (t.buffer.push(n), t.length += t.objectMode ? 1 : n.length);
          }t.ended = !0, y(e);
        }
      }function y(e) {
        var t = e._readableState;t.needReadable = !1, t.emittedReadable || (q("emitReadable", t.flowing), t.emittedReadable = !0, t.sync ? I.nextTick(v, e) : v(e));
      }function v(e) {
        q("emit readable"), e.emit("readable"), E(e);
      }function m(e, t) {
        t.readingMore || (t.readingMore = !0, I.nextTick(b, e, t));
      }function b(e, t) {
        for (var n = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (q("maybeReadMore read 0"), e.read(0), n !== t.length);) {
          n = t.length;
        }t.readingMore = !1;
      }function _(e) {
        return function () {
          var t = e._readableState;q("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, 0 === t.awaitDrain && L(e, "data") && (t.flowing = !0, E(e));
        };
      }function w(e) {
        q("readable nexttick read 0"), e.read(0);
      }function C(e, t) {
        t.resumeScheduled || (t.resumeScheduled = !0, I.nextTick(S, e, t));
      }function S(e, t) {
        t.reading || (q("resume read 0"), e.read(0)), t.resumeScheduled = !1, t.awaitDrain = 0, e.emit("resume"), E(e), t.flowing && !t.reading && e.read(0);
      }function E(e) {
        var t = e._readableState;for (q("flow", t.flowing); t.flowing && null !== e.read();) {}
      }function T(e, t) {
        if (0 === t.length) return null;var n;return t.objectMode ? n = t.buffer.shift() : !e || e >= t.length ? (n = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.head.data : t.buffer.concat(t.length), t.buffer.clear()) : n = R(e, t.buffer, t.decoder), n;
      }function R(e, t, n) {
        var r;return e < t.head.data.length ? (r = t.head.data.slice(0, e), t.head.data = t.head.data.slice(e)) : r = e === t.head.data.length ? t.shift() : n ? A(e, t) : k(e, t), r;
      }function A(e, t) {
        var n = t.head,
            r = 1,
            i = n.data;for (e -= i.length; n = n.next;) {
          var o = n.data,
              a = e > o.length ? o.length : e;if (a === o.length ? i += o : i += o.slice(0, e), 0 === (e -= a)) {
            a === o.length ? (++r, n.next ? t.head = n.next : t.head = t.tail = null) : (t.head = n, n.data = o.slice(a));break;
          }++r;
        }return t.length -= r, i;
      }function k(e, t) {
        var n = F.allocUnsafe(e),
            r = t.head,
            i = 1;for (r.data.copy(n), e -= r.data.length; r = r.next;) {
          var o = r.data,
              a = e > o.length ? o.length : e;if (o.copy(n, n.length - e, 0, a), 0 === (e -= a)) {
            a === o.length ? (++i, r.next ? t.head = r.next : t.head = t.tail = null) : (t.head = r, r.data = o.slice(a));break;
          }++i;
        }return t.length -= i, n;
      }function P(e) {
        var t = e._readableState;if (t.length > 0) throw new Error('"endReadable()" called on non-empty stream');t.endEmitted || (t.ended = !0, I.nextTick(x, t, e));
      }function x(e, t) {
        e.endEmitted || 0 !== e.length || (e.endEmitted = !0, t.readable = !1, t.emit("end"));
      }function O(e, t) {
        for (var n = 0, r = e.length; n < r; n++) {
          if (e[n] === t) return n;
        }return -1;
      }var I = n(7);e.exports = u;var D,
          M = n(9);u.ReadableState = s;var L = (n(8).EventEmitter, function (e, t) {
        return e.listeners(t).length;
      }),
          B = n(12),
          F = n(5).Buffer,
          N = t.Uint8Array || function () {},
          U = n(6);U.inherits = n(2);var j = n(29),
          q = void 0;q = j && j.debuglog ? j.debuglog("stream") : function () {};var Y,
          W = n(30),
          z = n(13);U.inherits(u, B);var H = ["error", "close", "destroy", "pause", "resume"];Object.defineProperty(u.prototype, "destroyed", { get: function get() {
          return void 0 !== this._readableState && this._readableState.destroyed;
        }, set: function set(e) {
          this._readableState && (this._readableState.destroyed = e);
        } }), u.prototype.destroy = z.destroy, u.prototype._undestroy = z.undestroy, u.prototype._destroy = function (e, t) {
        this.push(null), t(e);
      }, u.prototype.push = function (e, t) {
        var n,
            r = this._readableState;return r.objectMode ? n = !0 : "string" == typeof e && (t = t || r.defaultEncoding, t !== r.encoding && (e = F.from(e, t), t = ""), n = !0), c(this, e, t, !1, n);
      }, u.prototype.unshift = function (e) {
        return c(this, e, null, !0, !1);
      }, u.prototype.isPaused = function () {
        return !1 === this._readableState.flowing;
      }, u.prototype.setEncoding = function (e) {
        return Y || (Y = n(15).StringDecoder), this._readableState.decoder = new Y(e), this._readableState.encoding = e, this;
      };var J = 8388608;u.prototype.read = function (e) {
        q("read", e), e = parseInt(e, 10);var t = this._readableState,
            n = e;if (0 !== e && (t.emittedReadable = !1), 0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended)) return q("read: emitReadable", t.length, t.ended), 0 === t.length && t.ended ? P(this) : y(this), null;if (0 === (e = p(e, t)) && t.ended) return 0 === t.length && P(this), null;var r = t.needReadable;q("need readable", r), (0 === t.length || t.length - e < t.highWaterMark) && (r = !0, q("length less than watermark", r)), t.ended || t.reading ? (r = !1, q("reading or ended", r)) : r && (q("do read"), t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1, t.reading || (e = p(n, t)));var i;return i = e > 0 ? T(e, t) : null, null === i ? (t.needReadable = !0, e = 0) : t.length -= e, 0 === t.length && (t.ended || (t.needReadable = !0), n !== e && t.ended && P(this)), null !== i && this.emit("data", i), i;
      }, u.prototype._read = function (e) {
        this.emit("error", new Error("_read() is not implemented"));
      }, u.prototype.pipe = function (e, t) {
        function n(e, t) {
          q("onunpipe"), e === h && t && !1 === t.hasUnpiped && (t.hasUnpiped = !0, o());
        }function i() {
          q("onend"), e.end();
        }function o() {
          q("cleanup"), e.removeListener("close", c), e.removeListener("finish", f), e.removeListener("drain", y), e.removeListener("error", u), e.removeListener("unpipe", n), h.removeListener("end", i), h.removeListener("end", l), h.removeListener("data", s), v = !0, !d.awaitDrain || e._writableState && !e._writableState.needDrain || y();
        }function s(t) {
          q("ondata"), m = !1, !1 !== e.write(t) || m || ((1 === d.pipesCount && d.pipes === e || d.pipesCount > 1 && -1 !== O(d.pipes, e)) && !v && (q("false write response, pause", h._readableState.awaitDrain), h._readableState.awaitDrain++, m = !0), h.pause());
        }function u(t) {
          q("onerror", t), l(), e.removeListener("error", u), 0 === L(e, "error") && e.emit("error", t);
        }function c() {
          e.removeListener("finish", f), l();
        }function f() {
          q("onfinish"), e.removeListener("close", c), l();
        }function l() {
          q("unpipe"), h.unpipe(e);
        }var h = this,
            d = this._readableState;switch (d.pipesCount) {case 0:
            d.pipes = e;break;case 1:
            d.pipes = [d.pipes, e];break;default:
            d.pipes.push(e);}d.pipesCount += 1, q("pipe count=%d opts=%j", d.pipesCount, t);var p = (!t || !1 !== t.end) && e !== r.stdout && e !== r.stderr,
            g = p ? i : l;d.endEmitted ? I.nextTick(g) : h.once("end", g), e.on("unpipe", n);var y = _(h);e.on("drain", y);var v = !1,
            m = !1;return h.on("data", s), a(e, "error", u), e.once("close", c), e.once("finish", f), e.emit("pipe", h), d.flowing || (q("pipe resume"), h.resume()), e;
      }, u.prototype.unpipe = function (e) {
        var t = this._readableState,
            n = { hasUnpiped: !1 };if (0 === t.pipesCount) return this;if (1 === t.pipesCount) return e && e !== t.pipes ? this : (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this, n), this);if (!e) {
          var r = t.pipes,
              i = t.pipesCount;t.pipes = null, t.pipesCount = 0, t.flowing = !1;for (var o = 0; o < i; o++) {
            r[o].emit("unpipe", this, n);
          }return this;
        }var a = O(t.pipes, e);return -1 === a ? this : (t.pipes.splice(a, 1), t.pipesCount -= 1, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this, n), this);
      }, u.prototype.on = function (e, t) {
        var n = B.prototype.on.call(this, e, t);if ("data" === e) !1 !== this._readableState.flowing && this.resume();else if ("readable" === e) {
          var r = this._readableState;r.endEmitted || r.readableListening || (r.readableListening = r.needReadable = !0, r.emittedReadable = !1, r.reading ? r.length && y(this) : I.nextTick(w, this));
        }return n;
      }, u.prototype.addListener = u.prototype.on, u.prototype.resume = function () {
        var e = this._readableState;return e.flowing || (q("resume"), e.flowing = !0, C(this, e)), this;
      }, u.prototype.pause = function () {
        return q("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (q("pause"), this._readableState.flowing = !1, this.emit("pause")), this;
      }, u.prototype.wrap = function (e) {
        var t = this,
            n = this._readableState,
            r = !1;e.on("end", function () {
          if (q("wrapped end"), n.decoder && !n.ended) {
            var e = n.decoder.end();e && e.length && t.push(e);
          }t.push(null);
        }), e.on("data", function (i) {
          if (q("wrapped data"), n.decoder && (i = n.decoder.write(i)), (!n.objectMode || null !== i && void 0 !== i) && (n.objectMode || i && i.length)) {
            t.push(i) || (r = !0, e.pause());
          }
        });for (var i in e) {
          void 0 === this[i] && "function" == typeof e[i] && (this[i] = function (t) {
            return function () {
              return e[t].apply(e, arguments);
            };
          }(i));
        }for (var o = 0; o < H.length; o++) {
          e.on(H[o], this.emit.bind(this, H[o]));
        }return this._read = function (t) {
          q("wrapped _read", t), r && (r = !1, e.resume());
        }, this;
      }, Object.defineProperty(u.prototype, "readableHighWaterMark", { enumerable: !1, get: function get() {
          return this._readableState.highWaterMark;
        } }), u._fromList = T;
    }).call(t, n(0), n(1));
  }, function (e, t, n) {
    e.exports = n(8).EventEmitter;
  }, function (e, t, n) {
    "use strict";
    function r(e, t) {
      var n = this,
          r = this._readableState && this._readableState.destroyed,
          i = this._writableState && this._writableState.destroyed;return r || i ? (t ? t(e) : !e || this._writableState && this._writableState.errorEmitted || a.nextTick(o, this, e), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(e || null, function (e) {
        !t && e ? (a.nextTick(o, n, e), n._writableState && (n._writableState.errorEmitted = !0)) : t && t(e);
      }), this);
    }function i() {
      this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
    }function o(e, t) {
      e.emit("error", t);
    }var a = n(7);e.exports = { destroy: r, undestroy: i };
  }, function (e, t, n) {
    "use strict";
    (function (t, r, i) {
      function o(e) {
        var t = this;this.next = null, this.entry = null, this.finish = function () {
          A(t, e);
        };
      }function a(e) {
        return M.from(e);
      }function s(e) {
        return M.isBuffer(e) || e instanceof L;
      }function u() {}function c(e, t) {
        P = P || n(3), e = e || {};var r = t instanceof P;this.objectMode = !!e.objectMode, r && (this.objectMode = this.objectMode || !!e.writableObjectMode);var i = e.highWaterMark,
            a = e.writableHighWaterMark,
            s = this.objectMode ? 16 : 16384;this.highWaterMark = i || 0 === i ? i : r && (a || 0 === a) ? a : s, this.highWaterMark = Math.floor(this.highWaterMark), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;var u = !1 === e.decodeStrings;this.decodeStrings = !u, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function (e) {
          m(t, e);
        }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new o(this);
      }function f(e) {
        if (P = P || n(3), !(F.call(f, this) || this instanceof P)) return new f(e);this._writableState = new c(e, this), this.writable = !0, e && ("function" == typeof e.write && (this._write = e.write), "function" == typeof e.writev && (this._writev = e.writev), "function" == typeof e.destroy && (this._destroy = e.destroy), "function" == typeof e.final && (this._final = e.final)), D.call(this);
      }function l(e, t) {
        var n = new Error("write after end");e.emit("error", n), k.nextTick(t, n);
      }function h(e, t, n, r) {
        var i = !0,
            o = !1;return null === n ? o = new TypeError("May not write null values to stream") : "string" == typeof n || void 0 === n || t.objectMode || (o = new TypeError("Invalid non-string/buffer chunk")), o && (e.emit("error", o), k.nextTick(r, o), i = !1), i;
      }function d(e, t, n) {
        return e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = M.from(t, n)), t;
      }function p(e, t, n, r, i, o) {
        if (!n) {
          var a = d(t, r, i);r !== a && (n = !0, i = "buffer", r = a);
        }var s = t.objectMode ? 1 : r.length;t.length += s;var u = t.length < t.highWaterMark;if (u || (t.needDrain = !0), t.writing || t.corked) {
          var c = t.lastBufferedRequest;t.lastBufferedRequest = { chunk: r, encoding: i, isBuf: n, callback: o, next: null }, c ? c.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1;
        } else g(e, t, !1, s, r, i, o);return u;
      }function g(e, t, n, r, i, o, a) {
        t.writelen = r, t.writecb = a, t.writing = !0, t.sync = !0, n ? e._writev(i, t.onwrite) : e._write(i, o, t.onwrite), t.sync = !1;
      }function y(e, t, n, r, i) {
        --t.pendingcb, n ? (k.nextTick(i, r), k.nextTick(T, e, t), e._writableState.errorEmitted = !0, e.emit("error", r)) : (i(r), e._writableState.errorEmitted = !0, e.emit("error", r), T(e, t));
      }function v(e) {
        e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0;
      }function m(e, t) {
        var n = e._writableState,
            r = n.sync,
            i = n.writecb;if (v(n), t) y(e, n, r, t, i);else {
          var o = C(n);o || n.corked || n.bufferProcessing || !n.bufferedRequest || w(e, n), r ? x(b, e, n, o, i) : b(e, n, o, i);
        }
      }function b(e, t, n, r) {
        n || _(e, t), t.pendingcb--, r(), T(e, t);
      }function _(e, t) {
        0 === t.length && t.needDrain && (t.needDrain = !1, e.emit("drain"));
      }function w(e, t) {
        t.bufferProcessing = !0;var n = t.bufferedRequest;if (e._writev && n && n.next) {
          var r = t.bufferedRequestCount,
              i = new Array(r),
              a = t.corkedRequestsFree;a.entry = n;for (var s = 0, u = !0; n;) {
            i[s] = n, n.isBuf || (u = !1), n = n.next, s += 1;
          }i.allBuffers = u, g(e, t, !0, t.length, i, "", a.finish), t.pendingcb++, t.lastBufferedRequest = null, a.next ? (t.corkedRequestsFree = a.next, a.next = null) : t.corkedRequestsFree = new o(t), t.bufferedRequestCount = 0;
        } else {
          for (; n;) {
            var c = n.chunk,
                f = n.encoding,
                l = n.callback;if (g(e, t, !1, t.objectMode ? 1 : c.length, c, f, l), n = n.next, t.bufferedRequestCount--, t.writing) break;
          }null === n && (t.lastBufferedRequest = null);
        }t.bufferedRequest = n, t.bufferProcessing = !1;
      }function C(e) {
        return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing;
      }function S(e, t) {
        e._final(function (n) {
          t.pendingcb--, n && e.emit("error", n), t.prefinished = !0, e.emit("prefinish"), T(e, t);
        });
      }function E(e, t) {
        t.prefinished || t.finalCalled || ("function" == typeof e._final ? (t.pendingcb++, t.finalCalled = !0, k.nextTick(S, e, t)) : (t.prefinished = !0, e.emit("prefinish")));
      }function T(e, t) {
        var n = C(t);return n && (E(e, t), 0 === t.pendingcb && (t.finished = !0, e.emit("finish"))), n;
      }function R(e, t, n) {
        t.ending = !0, T(e, t), n && (t.finished ? k.nextTick(n) : e.once("finish", n)), t.ended = !0, e.writable = !1;
      }function A(e, t, n) {
        var r = e.entry;for (e.entry = null; r;) {
          var i = r.callback;t.pendingcb--, i(n), r = r.next;
        }t.corkedRequestsFree ? t.corkedRequestsFree.next = e : t.corkedRequestsFree = e;
      }var k = n(7);e.exports = f;var P,
          x = !t.browser && ["v0.10", "v0.9."].indexOf(t.version.slice(0, 5)) > -1 ? r : k.nextTick;f.WritableState = c;var O = n(6);O.inherits = n(2);var I = { deprecate: n(34) },
          D = n(12),
          M = n(5).Buffer,
          L = i.Uint8Array || function () {},
          B = n(13);O.inherits(f, D), c.prototype.getBuffer = function () {
        for (var e = this.bufferedRequest, t = []; e;) {
          t.push(e), e = e.next;
        }return t;
      }, function () {
        try {
          Object.defineProperty(c.prototype, "buffer", { get: I.deprecate(function () {
              return this.getBuffer();
            }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003") });
        } catch (e) {}
      }();var F;"function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (F = Function.prototype[Symbol.hasInstance], Object.defineProperty(f, Symbol.hasInstance, { value: function value(e) {
          return !!F.call(this, e) || this === f && e && e._writableState instanceof c;
        } })) : F = function F(e) {
        return e instanceof this;
      }, f.prototype.pipe = function () {
        this.emit("error", new Error("Cannot pipe, not readable"));
      }, f.prototype.write = function (e, t, n) {
        var r = this._writableState,
            i = !1,
            o = !r.objectMode && s(e);return o && !M.isBuffer(e) && (e = a(e)), "function" == typeof t && (n = t, t = null), o ? t = "buffer" : t || (t = r.defaultEncoding), "function" != typeof n && (n = u), r.ended ? l(this, n) : (o || h(this, r, e, n)) && (r.pendingcb++, i = p(this, r, o, e, t, n)), i;
      }, f.prototype.cork = function () {
        this._writableState.corked++;
      }, f.prototype.uncork = function () {
        var e = this._writableState;e.corked && (e.corked--, e.writing || e.corked || e.finished || e.bufferProcessing || !e.bufferedRequest || w(this, e));
      }, f.prototype.setDefaultEncoding = function (e) {
        if ("string" == typeof e && (e = e.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + e);return this._writableState.defaultEncoding = e, this;
      }, Object.defineProperty(f.prototype, "writableHighWaterMark", { enumerable: !1, get: function get() {
          return this._writableState.highWaterMark;
        } }), f.prototype._write = function (e, t, n) {
        n(new Error("_write() is not implemented"));
      }, f.prototype._writev = null, f.prototype.end = function (e, t, n) {
        var r = this._writableState;"function" == typeof e ? (n = e, e = null, t = null) : "function" == typeof t && (n = t, t = null), null !== e && void 0 !== e && this.write(e, t), r.corked && (r.corked = 1, this.uncork()), r.ending || r.finished || R(this, r, n);
      }, Object.defineProperty(f.prototype, "destroyed", { get: function get() {
          return void 0 !== this._writableState && this._writableState.destroyed;
        }, set: function set(e) {
          this._writableState && (this._writableState.destroyed = e);
        } }), f.prototype.destroy = B.destroy, f.prototype._undestroy = B.undestroy, f.prototype._destroy = function (e, t) {
        this.end(), t(e);
      };
    }).call(t, n(1), n(32).setImmediate, n(0));
  }, function (e, t, n) {
    "use strict";
    function r(e) {
      if (!e) return "utf8";for (var t;;) {
        switch (e) {case "utf8":case "utf-8":
            return "utf8";case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":
            return "utf16le";case "latin1":case "binary":
            return "latin1";case "base64":case "ascii":case "hex":
            return e;default:
            if (t) return;e = ("" + e).toLowerCase(), t = !0;}
      }
    }function i(e) {
      var t = r(e);if ("string" != typeof t && (m.isEncoding === b || !b(e))) throw new Error("Unknown encoding: " + e);return t || e;
    }function o(e) {
      this.encoding = i(e);var t;switch (this.encoding) {case "utf16le":
          this.text = h, this.end = d, t = 4;break;case "utf8":
          this.fillLast = c, t = 4;break;case "base64":
          this.text = p, this.end = g, t = 3;break;default:
          return this.write = y, void (this.end = v);}this.lastNeed = 0, this.lastTotal = 0, this.lastChar = m.allocUnsafe(t);
    }function a(e) {
      return e <= 127 ? 0 : e >> 5 == 6 ? 2 : e >> 4 == 14 ? 3 : e >> 3 == 30 ? 4 : e >> 6 == 2 ? -1 : -2;
    }function s(e, t, n) {
      var r = t.length - 1;if (r < n) return 0;var i = a(t[r]);return i >= 0 ? (i > 0 && (e.lastNeed = i - 1), i) : --r < n || -2 === i ? 0 : (i = a(t[r])) >= 0 ? (i > 0 && (e.lastNeed = i - 2), i) : --r < n || -2 === i ? 0 : (i = a(t[r]), i >= 0 ? (i > 0 && (2 === i ? i = 0 : e.lastNeed = i - 3), i) : 0);
    }function u(e, t, n) {
      if (128 != (192 & t[0])) return e.lastNeed = 0, "�";if (e.lastNeed > 1 && t.length > 1) {
        if (128 != (192 & t[1])) return e.lastNeed = 1, "�";if (e.lastNeed > 2 && t.length > 2 && 128 != (192 & t[2])) return e.lastNeed = 2, "�";
      }
    }function c(e) {
      var t = this.lastTotal - this.lastNeed,
          n = u(this, e, t);return void 0 !== n ? n : this.lastNeed <= e.length ? (e.copy(this.lastChar, t, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal)) : (e.copy(this.lastChar, t, 0, e.length), void (this.lastNeed -= e.length));
    }function f(e, t) {
      var n = s(this, e, t);if (!this.lastNeed) return e.toString("utf8", t);this.lastTotal = n;var r = e.length - (n - this.lastNeed);return e.copy(this.lastChar, 0, r), e.toString("utf8", t, r);
    }function l(e) {
      var t = e && e.length ? this.write(e) : "";return this.lastNeed ? t + "�" : t;
    }function h(e, t) {
      if ((e.length - t) % 2 == 0) {
        var n = e.toString("utf16le", t);if (n) {
          var r = n.charCodeAt(n.length - 1);if (r >= 55296 && r <= 56319) return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1], n.slice(0, -1);
        }return n;
      }return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = e[e.length - 1], e.toString("utf16le", t, e.length - 1);
    }function d(e) {
      var t = e && e.length ? this.write(e) : "";if (this.lastNeed) {
        var n = this.lastTotal - this.lastNeed;return t + this.lastChar.toString("utf16le", 0, n);
      }return t;
    }function p(e, t) {
      var n = (e.length - t) % 3;return 0 === n ? e.toString("base64", t) : (this.lastNeed = 3 - n, this.lastTotal = 3, 1 === n ? this.lastChar[0] = e[e.length - 1] : (this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1]), e.toString("base64", t, e.length - n));
    }function g(e) {
      var t = e && e.length ? this.write(e) : "";return this.lastNeed ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t;
    }function y(e) {
      return e.toString(this.encoding);
    }function v(e) {
      return e && e.length ? this.write(e) : "";
    }var m = n(5).Buffer,
        b = m.isEncoding || function (e) {
      switch ((e = "" + e) && e.toLowerCase()) {case "hex":case "utf8":case "utf-8":case "ascii":case "binary":case "base64":case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":case "raw":
          return !0;default:
          return !1;}
    };t.StringDecoder = o, o.prototype.write = function (e) {
      if (0 === e.length) return "";var t, n;if (this.lastNeed) {
        if (void 0 === (t = this.fillLast(e))) return "";n = this.lastNeed, this.lastNeed = 0;
      } else n = 0;return n < e.length ? t ? t + this.text(e, n) : this.text(e, n) : t || "";
    }, o.prototype.end = l, o.prototype.text = f, o.prototype.fillLast = function (e) {
      if (this.lastNeed <= e.length) return e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length), this.lastNeed -= e.length;
    };
  }, function (e, t, n) {
    "use strict";
    function r(e, t) {
      var n = this._transformState;n.transforming = !1;var r = n.writecb;if (!r) return this.emit("error", new Error("write callback called multiple times"));n.writechunk = null, n.writecb = null, null != t && this.push(t), r(e);var i = this._readableState;i.reading = !1, (i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
    }function i(e) {
      if (!(this instanceof i)) return new i(e);s.call(this, e), this._transformState = { afterTransform: r.bind(this), needTransform: !1, transforming: !1, writecb: null, writechunk: null, writeencoding: null }, this._readableState.needReadable = !0, this._readableState.sync = !1, e && ("function" == typeof e.transform && (this._transform = e.transform), "function" == typeof e.flush && (this._flush = e.flush)), this.on("prefinish", o);
    }function o() {
      var e = this;"function" == typeof this._flush ? this._flush(function (t, n) {
        a(e, t, n);
      }) : a(this, null, null);
    }function a(e, t, n) {
      if (t) return e.emit("error", t);if (null != n && e.push(n), e._writableState.length) throw new Error("Calling transform done when ws.length != 0");if (e._transformState.transforming) throw new Error("Calling transform done when still transforming");return e.push(null);
    }e.exports = i;var s = n(3),
        u = n(6);u.inherits = n(2), u.inherits(i, s), i.prototype.push = function (e, t) {
      return this._transformState.needTransform = !1, s.prototype.push.call(this, e, t);
    }, i.prototype._transform = function (e, t, n) {
      throw new Error("_transform() is not implemented");
    }, i.prototype._write = function (e, t, n) {
      var r = this._transformState;if (r.writecb = n, r.writechunk = e, r.writeencoding = t, !r.transforming) {
        var i = this._readableState;(r.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
      }
    }, i.prototype._read = function (e) {
      var t = this._transformState;null !== t.writechunk && t.writecb && !t.transforming ? (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform)) : t.needTransform = !0;
    }, i.prototype._destroy = function (e, t) {
      var n = this;s.prototype._destroy.call(this, e, function (e) {
        t(e), n.emit("close");
      });
    };
  }, function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 }), t.default = { DC_PING: "PING", DC_PONG: "PONG", DC_SIGNAL: "SIGNAL", DC_OPEN: "OPEN", DC_REQUEST: "REQUEST", DC_PIECE_NOT_FOUND: "PIECE_NOT_FOUND", DC_CLOSE: "CLOSE", DC_RESPONSE: "RESPONSE", DC_ERROR: "ERROR", DC_PIECE: "PIECE", DC_TIMEOUT: "TIMEOUT", DC_PIECE_ACK: "PIECE_ACK", DC_BITFIELD: "BITFIELD", DC_CHOKE: "CHOKE", DC_UNCHOKE: "UNCHOKE", DC_INTERESTED: "INTERESTED", DC_NOTINTERESTED: "NOT_INTERESTED", DC_HAVE: "HAVE", DC_LOST: "LOST", BM_LOST: "lost" }, e.exports = t.default;
  }, function (e, t) {
    (function (t) {
      e.exports = t;
    }).call(t, {});
  }, function (e, t, n) {
    "use strict";
    function r(e) {
      return e && e.__esModule ? e : { default: e };
    }Object.defineProperty(t, "__esModule", { value: !0 }), t.getBrowserRTC = t.Buffer = t.Fetcher = t.Events = t.DataChannel = void 0;var i = n(20),
        o = r(i),
        a = n(17),
        s = r(a),
        u = n(36),
        c = r(u),
        f = n(10),
        l = r(f),
        h = n(4).Buffer;t.DataChannel = o.default, t.Events = s.default, t.Fetcher = c.default, t.Buffer = h, t.getBrowserRTC = l.default;
  }, function (e, t, n) {
    "use strict";
    function r(e) {
      return e && e.__esModule ? e : { default: e };
    }function i(e, t) {
      if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
    }function o(e, t) {
      if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !t || "object" != (typeof t === "undefined" ? "undefined" : _typeof(t)) && "function" != typeof t ? e : t;
    }function a(e, t) {
      if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + (typeof t === "undefined" ? "undefined" : _typeof(t)));e.prototype = Object.create(t && t.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t);
    }function s(e, t, n, r) {
      var i = [];if (r) {
        for (var o = void 0, a = 0; a < n - 1; a++) {
          o = e.slice(a * t, (a + 1) * t), i.push(o);
        }o = e.slice(e.byteLength - r, e.byteLength), i.push(o);
      } else for (var s = void 0, u = 0; u < n; u++) {
        s = e.slice(u * t, (u + 1) * t), i.push(s);
      }return i;
    }function u(e) {
      for (var t = 0, n = 0; n < e.length - 1; n++) {
        t += e.charCodeAt(n);
      }return e[e.length - 1] === (t % 16).toString(16);
    }Object.defineProperty(t, "__esModule", { value: !0 });var c = function () {
      function e(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
        }
      }return function (t, n, r) {
        return n && e(t.prototype, n), r && e(t, r), t;
      };
    }(),
        f = n(21),
        l = r(f),
        h = n(8),
        d = r(h),
        p = n(17),
        g = r(p),
        y = n(4).Buffer,
        v = function (e) {
      function t(e, n, r, a, s) {
        i(this, t);var c = o(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));return c.engine = e, c.config = s, c.remotePeerId = r, c.channelId = a ? n + "-" + r : r + "-" + n, c.connected = !1, c.msgQueue = [], c.miss = 0, c.rcvdReqQueue = [], c.downloading = !1, c.uploading = !1, c.choked = !u(r), c.delays = [], c._datachannel = new l.default({ initiator: a, objectMode: !0 }), c.isInitiator = a, c._init(c._datachannel), c.streamingRate = 0, c.recordSended = c._adjustStreamingRate(10), c;
      }return a(t, e), c(t, null, [{ key: "VERSION", get: function get() {
          return "v1";
        } }]), c(t, [{ key: "_init", value: function value(e) {
          var t = this,
              n = this.engine.logger;e.on("error", function (e) {
            t.emit(g.default.DC_ERROR);
          }), e.on("signal", function (e) {
            t.emit(g.default.DC_SIGNAL, e);
          });var r = function r() {
            for (n.info("datachannel CONNECTED to " + t.remotePeerId), t.connected = !0, t.emit(g.default.DC_OPEN), t._sendPing(); t.msgQueue.length > 0;) {
              var e = t.msgQueue.shift();t.emit(e.event, e);
            }
          };e.once("connect", r), e.on("data", function (e) {
            if ("string" == typeof e) {
              var n = JSON.parse(e);if (!t.connected) return void t.msgQueue.push(n);switch (n.event) {case g.default.DC_PONG:
                  t._handlePongMsg();break;case g.default.DC_PING:
                  t.sendJson({ event: g.default.DC_PONG });break;case g.default.DC_PIECE:
                  t._prepareForBinary(n.attachments, n.url, n.sn, n.size), t.emit(n.event, n);break;case g.default.DC_PIECE_NOT_FOUND:
                  window.clearTimeout(t.requestTimeout), t.requestTimeout = null, t.emit(n.event, n);break;case g.default.DC_REQUEST:
                  t._handleRequestMsg(n);break;case g.default.DC_PIECE_ACK:
                  t._handlePieceAck(), t.emit(n.event, n);break;default:
                  t.emit(n.event, n);}
            } else t.bufArr.push(e), 0 === --t.remainAttachments && (window.clearTimeout(t.requestTimeout), t.requestTimeout = null, t.sendJson({ event: g.default.DC_PIECE_ACK, sn: t.bufSN, url: t.bufUrl, size: t.expectedSize }), t._handleBinaryData());
          }), e.once("close", function () {
            t.emit(g.default.DC_CLOSE);
          });
        } }, { key: "sendJson", value: function value(e) {
          this.send(JSON.stringify(e));
        } }, { key: "send", value: function value(e) {
          this._datachannel && this._datachannel.connected && this._datachannel.send(e);
        } }, { key: "sendBitField", value: function value(e) {
          this.sendJson({ event: g.default.DC_BITFIELD, field: e });
        } }, { key: "sendBuffer", value: function value(e, t, n) {
          this.uploading = !0, this.uploadTimeout = window.setTimeout(this._uploadtimeout.bind(this), 1e3 * this.config.dcUploadTimeout);var r = n.byteLength,
              i = this.config.packetSize,
              o = 0,
              a = 0;r % i == 0 ? a = r / i : (a = Math.floor(r / i) + 1, o = r % i);var u = { event: g.default.DC_PIECE, attachments: a, url: t, sn: e, size: r };this.sendJson(u);for (var c = s(n, i, a, o), f = 0; f < c.length; f++) {
            this.send(c[f]);
          }this.recordSended(r);
        } }, { key: "requestDataByURL", value: function value(e) {
          var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
              n = { event: g.default.DC_REQUEST, url: e, urgent: t };this.downloading = !0, this.sendJson(n), t && (this.requestTimeout = window.setTimeout(this._loadtimeout.bind(this), 1e3 * this.config.dcRequestTimeout));
        } }, { key: "requestDataBySN", value: function value(e) {
          var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
              n = { event: g.default.DC_REQUEST, sn: e, urgent: t };this.downloading = !0, this.sendJson(n), t && (this.requestTimeout = window.setTimeout(this._loadtimeout.bind(this), 1e3 * this.config.dcRequestTimeout));
        } }, { key: "close", value: function value() {
          this.destroy();
        } }, { key: "receiveSignal", value: function value(e) {
          this._datachannel.signal(e);
        } }, { key: "destroy", value: function value() {
          window.clearInterval(this.adjustSRInterval), window.clearInterval(this.pinger), this._datachannel.removeAllListeners(), this.removeAllListeners(), this._datachannel.destroy();
        } }, { key: "_handleRequestMsg", value: function value(e) {
          this.rcvdReqQueue.length > 0 ? e.urgent ? this.rcvdReqQueue.push(e.sn) : this.rcvdReqQueue.unshift(e.sn) : this.emit(g.default.DC_REQUEST, e);
        } }, { key: "_handlePieceAck", value: function value() {
          if (this.uploading = !1, window.clearTimeout(this.uploadTimeout), this.uploadTimeout = null, this.rcvdReqQueue.length > 0) {
            var e = this.rcvdReqQueue.pop();this.emit(g.default.DC_REQUEST, { sn: e });
          }
        } }, { key: "_prepareForBinary", value: function value(e, t, n, r) {
          this.bufArr = [], this.remainAttachments = e, this.bufUrl = t, this.bufSN = n, this.expectedSize = r;
        } }, { key: "_handleBinaryData", value: function value() {
          var e = y.concat(this.bufArr);e.byteLength == this.expectedSize && this.emit(g.default.DC_RESPONSE, { url: this.bufUrl, sn: this.bufSN, data: e }), this.bufUrl = "", this.bufArr = [], this.expectedSize = -1, this.downloading = !1;
        } }, { key: "_adjustStreamingRate", value: function value(e) {
          var t = this,
              n = 0;return this.adjustSRInterval = window.setInterval(function () {
            t.streamingRate = Math.round(8 * n / e), n = 0;
          }, 1e3 * e), function (e) {
            n += e;
          };
        } }, { key: "_loadtimeout", value: function value() {
          var e = this.engine.logger;if (e.warn("datachannel timeout while downloading from " + this.remotePeerId), this.emit(g.default.DC_TIMEOUT), this.requestTimeout = null, this.downloading = !1, ++this.miss >= this.config.dcTolerance) {
            var t = { event: g.default.DC_CLOSE };this.sendJson(t), e.warn("datachannel download miss reach dcTolerance, close " + this.remotePeerId), this.emit(g.default.DC_ERROR);
          }
        } }, { key: "_uploadtimeout", value: function value() {
          this.engine.logger.warn("datachannel timeout while uploading to " + this.remotePeerId), this.uploading = !1, this.rcvdReqQueue = [];
        } }, { key: "_sendPing", value: function value() {
          var e = this;this.ping = performance.now();for (var t = 0; t < this.config.dcPings; t++) {
            this.sendJson({ event: g.default.DC_PING });
          }window.setTimeout(function () {
            if (e.delays.length > 0) {
              var t = 0,
                  n = !0,
                  r = !1,
                  i = void 0;try {
                for (var o, a = e.delays[Symbol.iterator](); !(n = (o = a.next()).done); n = !0) {
                  t += o.value;
                }
              } catch (e) {
                r = !0, i = e;
              } finally {
                try {
                  !n && a.return && a.return();
                } finally {
                  if (r) throw i;
                }
              }e.delay = t / e.delays.length, e.delays = [];
            }
          }, 100);
        } }, { key: "_handlePongMsg", value: function value() {
          var e = performance.now() - this.ping;this.delays.push(e);
        } }, { key: "setupStats", value: function value() {
          var e = this,
              t = this.engine.logger;setInterval(function () {
            e._datachannel.getStats(function (e, n) {
              t.warn("reports: " + JSON.stringify(n, null, 1));
            });
          }, 1e4);
        } }, { key: "isAvailable", get: function get() {
          return !1 === this.downloading && !1 === this.choked;
        } }]), t;
    }(d.default);t.default = v, e.exports = t.default;
  }, function (e, t, n) {
    "use strict";
    (function (t) {
      function r(e) {
        var t = this;if (!(t instanceof r)) return new r(e);if (t._id = c(4).toString("hex").slice(0, 7), t._debug("new peer %o", e), e = Object.assign({ allowHalfOpen: !1 }, e), f.Duplex.call(t, e), t.channelName = e.initiator ? e.channelName || c(20).toString("hex") : null, t._isChromium = "undefined" != typeof window && !!window.webkitRTCPeerConnection, t.initiator = e.initiator || !1, t.channelConfig = e.channelConfig || r.channelConfig, t.config = e.config || r.config, t.constraints = t._transformConstraints(e.constraints || r.constraints), t.offerConstraints = t._transformConstraints(e.offerConstraints || {}), t.answerConstraints = t._transformConstraints(e.answerConstraints || {}), t.reconnectTimer = e.reconnectTimer || !1, t.sdpTransform = e.sdpTransform || function (e) {
          return e;
        }, t.stream = e.stream || !1, t.trickle = void 0 === e.trickle || e.trickle, t.destroyed = !1, t.connected = !1, t.remoteAddress = void 0, t.remoteFamily = void 0, t.remotePort = void 0, t.localAddress = void 0, t.localPort = void 0, t._wrtc = e.wrtc && "object" === o(e.wrtc) ? e.wrtc : s(), !t._wrtc) throw "undefined" == typeof window ? new Error("No WebRTC support: Specify `opts.wrtc` option in this environment") : new Error("No WebRTC support: Not a supported browser");if (t._pcReady = !1, t._channelReady = !1, t._iceComplete = !1, t._channel = null, t._pendingCandidates = [], t._previousStreams = [], t._chunk = null, t._cb = null, t._interval = null, t._reconnectTimeout = null, t._pc = new t._wrtc.RTCPeerConnection(t.config, t.constraints), t._isWrtc = Array.isArray(t._pc.RTCIceConnectionStates), t._isReactNativeWebrtc = "number" == typeof t._pc._peerConnectionId, t._pc.oniceconnectionstatechange = function () {
          t._onIceStateChange();
        }, t._pc.onicegatheringstatechange = function () {
          t._onIceStateChange();
        }, t._pc.onsignalingstatechange = function () {
          t._onSignalingStateChange();
        }, t._pc.onicecandidate = function (e) {
          t._onIceCandidate(e);
        }, t.initiator) {
          var n = !1;t._pc.onnegotiationneeded = function () {
            n || t._createOffer(), n = !0;
          }, t._setupData({ channel: t._pc.createDataChannel(t.channelName, t.channelConfig) });
        } else t._pc.ondatachannel = function (e) {
          t._setupData(e);
        };"addTrack" in t._pc ? (t.stream && t.stream.getTracks().forEach(function (e) {
          t._pc.addTrack(e, t.stream);
        }), t._pc.ontrack = function (e) {
          t._onTrack(e);
        }) : (t.stream && t._pc.addStream(t.stream), t._pc.onaddstream = function (e) {
          t._onAddStream(e);
        }), t.initiator && t._isWrtc && t._pc.onnegotiationneeded(), t._onFinishBound = function () {
          t._onFinish();
        }, t.once("finish", t._onFinishBound);
      }function i() {}var o = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
        return typeof e === "undefined" ? "undefined" : _typeof(e);
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof(e);
      };e.exports = r;var a = n(24)("simple-channel"),
          s = n(10),
          u = n(2),
          c = n(27),
          f = n(28);u(r, f.Duplex), r.WEBRTC_SUPPORT = !!s(), r.config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:global.stun.twilio.com:3478?transport=udp" }] }, r.constraints = {}, r.channelConfig = {}, Object.defineProperty(r.prototype, "bufferSize", { get: function get() {
          var e = this;return e._channel && e._channel.bufferedAmount || 0;
        } }), r.prototype.address = function () {
        var e = this;return { port: e.localPort, family: "IPv4", address: e.localAddress };
      }, r.prototype.signal = function (e) {
        var t = this;if (t.destroyed) throw new Error("cannot signal after peer is destroyed");if ("string" == typeof e) try {
          e = JSON.parse(e);
        } catch (t) {
          e = {};
        }t._debug("signal()"), e.candidate && (t._pc.remoteDescription && t._pc.remoteDescription.type ? t._addIceCandidate(e.candidate) : t._pendingCandidates.push(e.candidate)), e.sdp && t._pc.setRemoteDescription(new t._wrtc.RTCSessionDescription(e), function () {
          t.destroyed || (t._pendingCandidates.forEach(function (e) {
            t._addIceCandidate(e);
          }), t._pendingCandidates = [], "offer" === t._pc.remoteDescription.type && t._createAnswer());
        }, function (e) {
          t.destroy(e);
        }), e.sdp || e.candidate || t.destroy(new Error("signal() called with invalid signal data"));
      }, r.prototype._addIceCandidate = function (e) {
        var t = this;try {
          t._pc.addIceCandidate(new t._wrtc.RTCIceCandidate(e), i, function (e) {
            t.destroy(e);
          });
        } catch (e) {
          t.destroy(new Error("error adding candidate: " + e.message));
        }
      }, r.prototype.send = function (e) {
        this._channel.send(e);
      }, r.prototype.destroy = function (e) {
        this._destroy(e, function () {});
      }, r.prototype._destroy = function (e, t) {
        var n = this;if (!n.destroyed) {
          if (n._debug("destroy (error: %s)", e && (e.message || e)), n.readable = n.writable = !1, n._readableState.ended || n.push(null), n._writableState.finished || n.end(), n.destroyed = !0, n.connected = !1, n._pcReady = !1, n._channelReady = !1, n._previousStreams = null, clearInterval(n._interval), clearTimeout(n._reconnectTimeout), n._interval = null, n._reconnectTimeout = null, n._chunk = null, n._cb = null, n._onFinishBound && n.removeListener("finish", n._onFinishBound), n._onFinishBound = null, n._pc) {
            try {
              n._pc.close();
            } catch (e) {}n._pc.oniceconnectionstatechange = null, n._pc.onicegatheringstatechange = null, n._pc.onsignalingstatechange = null, n._pc.onicecandidate = null, "addTrack" in n._pc ? n._pc.ontrack = null : n._pc.onaddstream = null, n._pc.onnegotiationneeded = null, n._pc.ondatachannel = null;
          }if (n._channel) {
            try {
              n._channel.close();
            } catch (e) {}n._channel.onmessage = null, n._channel.onopen = null, n._channel.onclose = null, n._channel.onerror = null;
          }n._pc = null, n._channel = null, e && n.emit("error", e), n.emit("close"), t();
        }
      }, r.prototype._setupData = function (e) {
        var t = this;if (!e.channel) return t.destroy(new Error("Data channel event is missing `channel` property"));t._channel = e.channel, t._channel.binaryType = "arraybuffer", "number" == typeof t._channel.bufferedAmountLowThreshold && (t._channel.bufferedAmountLowThreshold = 65536), t.channelName = t._channel.label, t._channel.onmessage = function (e) {
          t._onChannelMessage(e);
        }, t._channel.onbufferedamountlow = function () {
          t._onChannelBufferedAmountLow();
        }, t._channel.onopen = function () {
          t._onChannelOpen();
        }, t._channel.onclose = function () {
          t._onChannelClose();
        }, t._channel.onerror = function (e) {
          t.destroy(e);
        };
      }, r.prototype._read = function () {}, r.prototype._write = function (e, t, n) {
        var r = this;if (r.destroyed) return n(new Error("cannot write after peer is destroyed"));if (r.connected) {
          try {
            r.send(e);
          } catch (e) {
            return r.destroy(e);
          }r._channel.bufferedAmount > 65536 ? (r._debug("start backpressure: bufferedAmount %d", r._channel.bufferedAmount), r._cb = n) : n(null);
        } else r._debug("write before connect"), r._chunk = e, r._cb = n;
      }, r.prototype._onFinish = function () {
        function e() {
          setTimeout(function () {
            t.destroy();
          }, 1e3);
        }var t = this;t.destroyed || (t.connected ? e() : t.once("connect", e));
      }, r.prototype._createOffer = function () {
        var e = this;e.destroyed || e._pc.createOffer(function (t) {
          function n() {
            e.destroyed || (e.trickle || e._iceComplete ? i() : e.once("_iceComplete", i));
          }function r(t) {
            e.destroy(t);
          }function i() {
            var n = e._pc.localDescription || t;e._debug("signal"), e.emit("signal", { type: n.type, sdp: n.sdp });
          }e.destroyed || (t.sdp = e.sdpTransform(t.sdp), e._pc.setLocalDescription(t, n, r));
        }, function (t) {
          e.destroy(t);
        }, e.offerConstraints);
      }, r.prototype._createAnswer = function () {
        var e = this;e.destroyed || e._pc.createAnswer(function (t) {
          function n() {
            e.destroyed || (e.trickle || e._iceComplete ? i() : e.once("_iceComplete", i));
          }function r(t) {
            e.destroy(t);
          }function i() {
            var n = e._pc.localDescription || t;e._debug("signal"), e.emit("signal", { type: n.type, sdp: n.sdp });
          }e.destroyed || (t.sdp = e.sdpTransform(t.sdp), e._pc.setLocalDescription(t, n, r));
        }, function (t) {
          e.destroy(t);
        }, e.answerConstraints);
      }, r.prototype._onIceStateChange = function () {
        var e = this;if (!e.destroyed) {
          var t = e._pc.iceConnectionState,
              n = e._pc.iceGatheringState;e._debug("iceStateChange (connection: %s) (gathering: %s)", t, n), e.emit("iceStateChange", t, n), "connected" !== t && "completed" !== t || (clearTimeout(e._reconnectTimeout), e._pcReady = !0, e._maybeReady()), "disconnected" === t && (e.reconnectTimer ? (clearTimeout(e._reconnectTimeout), e._reconnectTimeout = setTimeout(function () {
            e.destroy();
          }, e.reconnectTimer)) : e.destroy()), "failed" === t && e.destroy(new Error("Ice connection failed.")), "closed" === t && e.destroy();
        }
      }, r.prototype.getStats = function (e) {
        var t = this;0 === t._pc.getStats.length ? t._pc.getStats().then(function (t) {
          var n = [];t.forEach(function (e) {
            n.push(e);
          }), e(null, n);
        }, function (t) {
          e(t);
        }) : t._isReactNativeWebrtc ? t._pc.getStats(null, function (t) {
          var n = [];t.forEach(function (e) {
            n.push(e);
          }), e(null, n);
        }, function (t) {
          e(t);
        }) : t._pc.getStats.length > 0 ? t._pc.getStats(function (n) {
          if (!t.destroyed) {
            var r = [];n.result().forEach(function (e) {
              var t = {};e.names().forEach(function (n) {
                t[n] = e.stat(n);
              }), t.id = e.id, t.type = e.type, t.timestamp = e.timestamp, r.push(t);
            }), e(null, r);
          }
        }, function (t) {
          e(t);
        }) : e(null, []);
      }, r.prototype._maybeReady = function () {
        function e() {
          t.destroyed || t.getStats(function (n, r) {
            function i(e) {
              u = !0;var n = a[e.localCandidateId];n && n.ip ? (t.localAddress = n.ip, t.localPort = Number(n.port)) : n && n.ipAddress ? (t.localAddress = n.ipAddress, t.localPort = Number(n.portNumber)) : "string" == typeof e.googLocalAddress && (n = e.googLocalAddress.split(":"), t.localAddress = n[0], t.localPort = Number(n[1]));var r = o[e.remoteCandidateId];r && r.ip ? (t.remoteAddress = r.ip, t.remotePort = Number(r.port)) : r && r.ipAddress ? (t.remoteAddress = r.ipAddress, t.remotePort = Number(r.portNumber)) : "string" == typeof e.googRemoteAddress && (r = e.googRemoteAddress.split(":"), t.remoteAddress = r[0], t.remotePort = Number(r[1])), t.remoteFamily = "IPv4", t._debug("connect local: %s:%s remote: %s:%s", t.localAddress, t.localPort, t.remoteAddress, t.remotePort);
            }if (!t.destroyed) {
              n && (r = []);var o = {},
                  a = {},
                  s = {},
                  u = !1;if (r.forEach(function (e) {
                "remotecandidate" !== e.type && "remote-candidate" !== e.type || (o[e.id] = e), "localcandidate" !== e.type && "local-candidate" !== e.type || (a[e.id] = e), "candidatepair" !== e.type && "candidate-pair" !== e.type || (s[e.id] = e);
              }), r.forEach(function (e) {
                "transport" === e.type && i(s[e.selectedCandidatePairId]), ("googCandidatePair" === e.type && "true" === e.googActiveConnection || ("candidatepair" === e.type || "candidate-pair" === e.type) && e.selected) && i(e);
              }), !(u || Object.keys(s).length && !Object.keys(a).length)) return void setTimeout(e, 100);if (t._connecting = !1, t.connected = !0, t._chunk) {
                try {
                  t.send(t._chunk);
                } catch (n) {
                  return t.destroy(n);
                }t._chunk = null, t._debug('sent chunk from "write before connect"');var c = t._cb;t._cb = null, c(null);
              }"number" != typeof t._channel.bufferedAmountLowThreshold && (t._interval = setInterval(function () {
                t._onInterval();
              }, 150), t._interval.unref && t._interval.unref()), t._debug("connect"), t.emit("connect");
            }
          });
        }var t = this;t._debug("maybeReady pc %s channel %s", t._pcReady, t._channelReady), !t.connected && !t._connecting && t._pcReady && t._channelReady && (t._connecting = !0, e());
      }, r.prototype._onInterval = function () {
        var e = this;!e._cb || !e._channel || e._channel.bufferedAmount > 65536 || e._onChannelBufferedAmountLow();
      }, r.prototype._onSignalingStateChange = function () {
        var e = this;e.destroyed || (e._debug("signalingStateChange %s", e._pc.signalingState), e.emit("signalingStateChange", e._pc.signalingState));
      }, r.prototype._onIceCandidate = function (e) {
        var t = this;t.destroyed || (e.candidate && t.trickle ? t.emit("signal", { candidate: { candidate: e.candidate.candidate, sdpMLineIndex: e.candidate.sdpMLineIndex, sdpMid: e.candidate.sdpMid } }) : e.candidate || (t._iceComplete = !0, t.emit("_iceComplete")));
      }, r.prototype._onChannelMessage = function (e) {
        var n = this;if (!n.destroyed) {
          var r = e.data;r instanceof ArrayBuffer && (r = t.from(r)), n.push(r);
        }
      }, r.prototype._onChannelBufferedAmountLow = function () {
        var e = this;if (!e.destroyed && e._cb) {
          e._debug("ending backpressure: bufferedAmount %d", e._channel.bufferedAmount);var t = e._cb;e._cb = null, t(null);
        }
      }, r.prototype._onChannelOpen = function () {
        var e = this;e.connected || e.destroyed || (e._debug("on channel open"), e._channelReady = !0, e._maybeReady());
      }, r.prototype._onChannelClose = function () {
        var e = this;e.destroyed || (e._debug("on channel close"), e.destroy());
      }, r.prototype._onAddStream = function (e) {
        var t = this;t.destroyed || (t._debug("on add stream"), t.emit("stream", e.stream));
      }, r.prototype._onTrack = function (e) {
        var t = this;if (!t.destroyed) {
          t._debug("on track");var n = e.streams[0].id;-1 === t._previousStreams.indexOf(n) && (t._previousStreams.push(n), t.emit("stream", e.streams[0]));
        }
      }, r.prototype._debug = function () {
        var e = this,
            t = [].slice.call(arguments);t[0] = "[" + e._id + "] " + t[0], a.apply(null, t);
      }, r.prototype._transformConstraints = function (e) {
        var t = this;if (0 === Object.keys(e).length) return e;if ((e.mandatory || e.optional) && !t._isChromium) {
          var n = Object.assign({}, e.optional, e.mandatory);return void 0 !== n.OfferToReceiveVideo && (n.offerToReceiveVideo = n.OfferToReceiveVideo, delete n.OfferToReceiveVideo), void 0 !== n.OfferToReceiveAudio && (n.offerToReceiveAudio = n.OfferToReceiveAudio, delete n.OfferToReceiveAudio), n;
        }return e.mandatory || e.optional || !t._isChromium ? e : (void 0 !== e.offerToReceiveVideo && (e.OfferToReceiveVideo = e.offerToReceiveVideo, delete e.offerToReceiveVideo), void 0 !== e.offerToReceiveAudio && (e.OfferToReceiveAudio = e.offerToReceiveAudio, delete e.offerToReceiveAudio), { mandatory: e });
      };
    }).call(t, n(4).Buffer);
  }, function (e, t, n) {
    "use strict";
    function r(e) {
      var t = e.length;if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");var n = e.indexOf("=");return -1 === n && (n = t), [n, n === t ? 0 : 4 - n % 4];
    }function i(e) {
      var t = r(e),
          n = t[0],
          i = t[1];return 3 * (n + i) / 4 - i;
    }function o(e, t, n) {
      return 3 * (t + n) / 4 - n;
    }function a(e) {
      for (var t, n = r(e), i = n[0], a = n[1], s = new h(o(e, i, a)), u = 0, c = a > 0 ? i - 4 : i, f = 0; f < c; f += 4) {
        t = l[e.charCodeAt(f)] << 18 | l[e.charCodeAt(f + 1)] << 12 | l[e.charCodeAt(f + 2)] << 6 | l[e.charCodeAt(f + 3)], s[u++] = t >> 16 & 255, s[u++] = t >> 8 & 255, s[u++] = 255 & t;
      }return 2 === a && (t = l[e.charCodeAt(f)] << 2 | l[e.charCodeAt(f + 1)] >> 4, s[u++] = 255 & t), 1 === a && (t = l[e.charCodeAt(f)] << 10 | l[e.charCodeAt(f + 1)] << 4 | l[e.charCodeAt(f + 2)] >> 2, s[u++] = t >> 8 & 255, s[u++] = 255 & t), s;
    }function s(e) {
      return f[e >> 18 & 63] + f[e >> 12 & 63] + f[e >> 6 & 63] + f[63 & e];
    }function u(e, t, n) {
      for (var r, i = [], o = t; o < n; o += 3) {
        r = (e[o] << 16 & 16711680) + (e[o + 1] << 8 & 65280) + (255 & e[o + 2]), i.push(s(r));
      }return i.join("");
    }function c(e) {
      for (var t, n = e.length, r = n % 3, i = [], o = 0, a = n - r; o < a; o += 16383) {
        i.push(u(e, o, o + 16383 > a ? a : o + 16383));
      }return 1 === r ? (t = e[n - 1], i.push(f[t >> 2] + f[t << 4 & 63] + "==")) : 2 === r && (t = (e[n - 2] << 8) + e[n - 1], i.push(f[t >> 10] + f[t >> 4 & 63] + f[t << 2 & 63] + "=")), i.join("");
    }t.byteLength = i, t.toByteArray = a, t.fromByteArray = c;for (var f = [], l = [], h = "undefined" != typeof Uint8Array ? Uint8Array : Array, d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", p = 0, g = d.length; p < g; ++p) {
      f[p] = d[p], l[d.charCodeAt(p)] = p;
    }l["-".charCodeAt(0)] = 62, l["_".charCodeAt(0)] = 63;
  }, function (e, t) {
    t.read = function (e, t, n, r, i) {
      var o,
          a,
          s = 8 * i - r - 1,
          u = (1 << s) - 1,
          c = u >> 1,
          f = -7,
          l = n ? i - 1 : 0,
          h = n ? -1 : 1,
          d = e[t + l];for (l += h, o = d & (1 << -f) - 1, d >>= -f, f += s; f > 0; o = 256 * o + e[t + l], l += h, f -= 8) {}for (a = o & (1 << -f) - 1, o >>= -f, f += r; f > 0; a = 256 * a + e[t + l], l += h, f -= 8) {}if (0 === o) o = 1 - c;else {
        if (o === u) return a ? NaN : 1 / 0 * (d ? -1 : 1);a += Math.pow(2, r), o -= c;
      }return (d ? -1 : 1) * a * Math.pow(2, o - r);
    }, t.write = function (e, t, n, r, i, o) {
      var a,
          s,
          u,
          c = 8 * o - i - 1,
          f = (1 << c) - 1,
          l = f >> 1,
          h = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
          d = r ? 0 : o - 1,
          p = r ? 1 : -1,
          g = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (s = isNaN(t) ? 1 : 0, a = f) : (a = Math.floor(Math.log(t) / Math.LN2), t * (u = Math.pow(2, -a)) < 1 && (a--, u *= 2), t += a + l >= 1 ? h / u : h * Math.pow(2, 1 - l), t * u >= 2 && (a++, u /= 2), a + l >= f ? (s = 0, a = f) : a + l >= 1 ? (s = (t * u - 1) * Math.pow(2, i), a += l) : (s = t * Math.pow(2, l - 1) * Math.pow(2, i), a = 0)); i >= 8; e[n + d] = 255 & s, d += p, s /= 256, i -= 8) {}for (a = a << i | s, c += i; c > 0; e[n + d] = 255 & a, d += p, a /= 256, c -= 8) {}e[n + d - p] |= 128 * g;
    };
  }, function (e, t, n) {
    (function (r) {
      function i() {
        return !("undefined" == typeof window || !window.process || "renderer" !== window.process.type) || ("undefined" == typeof navigator || !navigator.userAgent || !navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) && ("undefined" != typeof document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || "undefined" != typeof window && window.console && (window.console.firebug || window.console.exception && window.console.table) || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
      }function o(e) {
        var n = this.useColors;if (e[0] = (n ? "%c" : "") + this.namespace + (n ? " %c" : " ") + e[0] + (n ? "%c " : " ") + "+" + t.humanize(this.diff), n) {
          var r = "color: " + this.color;e.splice(1, 0, r, "color: inherit");var i = 0,
              o = 0;e[0].replace(/%[a-zA-Z%]/g, function (e) {
            "%%" !== e && (i++, "%c" === e && (o = i));
          }), e.splice(o, 0, r);
        }
      }function a() {
        return "object" == (typeof console === "undefined" ? "undefined" : _typeof(console)) && console.log && Function.prototype.apply.call(console.log, console, arguments);
      }function s(e) {
        try {
          null == e ? t.storage.removeItem("debug") : t.storage.debug = e;
        } catch (e) {}
      }function u() {
        var e;try {
          e = t.storage.debug;
        } catch (e) {}return !e && void 0 !== r && "env" in r && (e = r.env.DEBUG), e;
      }t = e.exports = n(25), t.log = a, t.formatArgs = o, t.save = s, t.load = u, t.useColors = i, t.storage = "undefined" != typeof chrome && void 0 !== chrome.storage ? chrome.storage.local : function () {
        try {
          return window.localStorage;
        } catch (e) {}
      }(), t.colors = ["#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33"], t.formatters.j = function (e) {
        try {
          return JSON.stringify(e);
        } catch (e) {
          return "[UnexpectedJSONParseError]: " + e.message;
        }
      }, t.enable(u());
    }).call(t, n(1));
  }, function (e, t, n) {
    function r(e) {
      var n,
          r = 0;for (n in e) {
        r = (r << 5) - r + e.charCodeAt(n), r |= 0;
      }return t.colors[Math.abs(r) % t.colors.length];
    }function i(e) {
      function n() {
        if (n.enabled) {
          var e = n,
              r = +new Date(),
              o = r - (i || r);e.diff = o, e.prev = i, e.curr = r, i = r;for (var a = new Array(arguments.length), s = 0; s < a.length; s++) {
            a[s] = arguments[s];
          }a[0] = t.coerce(a[0]), "string" != typeof a[0] && a.unshift("%O");var u = 0;a[0] = a[0].replace(/%([a-zA-Z%])/g, function (n, r) {
            if ("%%" === n) return n;u++;var i = t.formatters[r];if ("function" == typeof i) {
              var o = a[u];n = i.call(e, o), a.splice(u, 1), u--;
            }return n;
          }), t.formatArgs.call(e, a);(n.log || t.log || console.log.bind(console)).apply(e, a);
        }
      }var i;return n.namespace = e, n.enabled = t.enabled(e), n.useColors = t.useColors(), n.color = r(e), n.destroy = o, "function" == typeof t.init && t.init(n), t.instances.push(n), n;
    }function o() {
      var e = t.instances.indexOf(this);return -1 !== e && (t.instances.splice(e, 1), !0);
    }function a(e) {
      t.save(e), t.names = [], t.skips = [];var n,
          r = ("string" == typeof e ? e : "").split(/[\s,]+/),
          i = r.length;for (n = 0; n < i; n++) {
        r[n] && (e = r[n].replace(/\*/g, ".*?"), "-" === e[0] ? t.skips.push(new RegExp("^" + e.substr(1) + "$")) : t.names.push(new RegExp("^" + e + "$")));
      }for (n = 0; n < t.instances.length; n++) {
        var o = t.instances[n];o.enabled = t.enabled(o.namespace);
      }
    }function s() {
      t.enable("");
    }function u(e) {
      if ("*" === e[e.length - 1]) return !0;var n, r;for (n = 0, r = t.skips.length; n < r; n++) {
        if (t.skips[n].test(e)) return !1;
      }for (n = 0, r = t.names.length; n < r; n++) {
        if (t.names[n].test(e)) return !0;
      }return !1;
    }function c(e) {
      return e instanceof Error ? e.stack || e.message : e;
    }t = e.exports = i.debug = i.default = i, t.coerce = c, t.disable = s, t.enable = a, t.enabled = u, t.humanize = n(26), t.instances = [], t.names = [], t.skips = [], t.formatters = {};
  }, function (e, t) {
    function n(e) {
      if (e = String(e), !(e.length > 100)) {
        var t = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(e);if (t) {
          var n = parseFloat(t[1]);switch ((t[2] || "ms").toLowerCase()) {case "years":case "year":case "yrs":case "yr":case "y":
              return n * f;case "days":case "day":case "d":
              return n * c;case "hours":case "hour":case "hrs":case "hr":case "h":
              return n * u;case "minutes":case "minute":case "mins":case "min":case "m":
              return n * s;case "seconds":case "second":case "secs":case "sec":case "s":
              return n * a;case "milliseconds":case "millisecond":case "msecs":case "msec":case "ms":
              return n;default:
              return;}
        }
      }
    }function r(e) {
      return e >= c ? Math.round(e / c) + "d" : e >= u ? Math.round(e / u) + "h" : e >= s ? Math.round(e / s) + "m" : e >= a ? Math.round(e / a) + "s" : e + "ms";
    }function i(e) {
      return o(e, c, "day") || o(e, u, "hour") || o(e, s, "minute") || o(e, a, "second") || e + " ms";
    }function o(e, t, n) {
      if (!(e < t)) return e < 1.5 * t ? Math.floor(e / t) + " " + n : Math.ceil(e / t) + " " + n + "s";
    }var a = 1e3,
        s = 60 * a,
        u = 60 * s,
        c = 24 * u,
        f = 365.25 * c;e.exports = function (e, t) {
      t = t || {};var o = typeof e === "undefined" ? "undefined" : _typeof(e);if ("string" === o && e.length > 0) return n(e);if ("number" === o && !1 === isNaN(e)) return t.long ? i(e) : r(e);throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(e));
    };
  }, function (e, t, n) {
    "use strict";
    (function (t, r) {
      function i() {
        throw new Error("Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11");
      }function o(e, n) {
        if (e > 65536) throw new Error("requested too many random bytes");var i = new t.Uint8Array(e);e > 0 && s.getRandomValues(i);var o = a.from(i.buffer);return "function" == typeof n ? r.nextTick(function () {
          n(null, o);
        }) : o;
      }var a = n(5).Buffer,
          s = t.crypto || t.msCrypto;s && s.getRandomValues ? e.exports = o : e.exports = i;
    }).call(t, n(0), n(1));
  }, function (e, t, n) {
    t = e.exports = n(11), t.Stream = t, t.Readable = t, t.Writable = n(14), t.Duplex = n(3), t.Transform = n(16), t.PassThrough = n(35);
  }, function (e, t) {}, function (e, t, n) {
    "use strict";
    function r(e, t) {
      if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
    }function i(e, t, n) {
      e.copy(t, n);
    }var o = n(5).Buffer,
        a = n(31);e.exports = function () {
      function e() {
        r(this, e), this.head = null, this.tail = null, this.length = 0;
      }return e.prototype.push = function (e) {
        var t = { data: e, next: null };this.length > 0 ? this.tail.next = t : this.head = t, this.tail = t, ++this.length;
      }, e.prototype.unshift = function (e) {
        var t = { data: e, next: this.head };0 === this.length && (this.tail = t), this.head = t, ++this.length;
      }, e.prototype.shift = function () {
        if (0 !== this.length) {
          var e = this.head.data;return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next, --this.length, e;
        }
      }, e.prototype.clear = function () {
        this.head = this.tail = null, this.length = 0;
      }, e.prototype.join = function (e) {
        if (0 === this.length) return "";for (var t = this.head, n = "" + t.data; t = t.next;) {
          n += e + t.data;
        }return n;
      }, e.prototype.concat = function (e) {
        if (0 === this.length) return o.alloc(0);if (1 === this.length) return this.head.data;for (var t = o.allocUnsafe(e >>> 0), n = this.head, r = 0; n;) {
          i(n.data, t, r), r += n.data.length, n = n.next;
        }return t;
      }, e;
    }(), a && a.inspect && a.inspect.custom && (e.exports.prototype[a.inspect.custom] = function () {
      var e = a.inspect({ length: this.length });return this.constructor.name + " " + e;
    });
  }, function (e, t) {}, function (e, t, n) {
    (function (e) {
      function r(e, t) {
        this._id = e, this._clearFn = t;
      }var i = void 0 !== e && e || "undefined" != typeof self && self || window,
          o = Function.prototype.apply;t.setTimeout = function () {
        return new r(o.call(setTimeout, i, arguments), clearTimeout);
      }, t.setInterval = function () {
        return new r(o.call(setInterval, i, arguments), clearInterval);
      }, t.clearTimeout = t.clearInterval = function (e) {
        e && e.close();
      }, r.prototype.unref = r.prototype.ref = function () {}, r.prototype.close = function () {
        this._clearFn.call(i, this._id);
      }, t.enroll = function (e, t) {
        clearTimeout(e._idleTimeoutId), e._idleTimeout = t;
      }, t.unenroll = function (e) {
        clearTimeout(e._idleTimeoutId), e._idleTimeout = -1;
      }, t._unrefActive = t.active = function (e) {
        clearTimeout(e._idleTimeoutId);var t = e._idleTimeout;t >= 0 && (e._idleTimeoutId = setTimeout(function () {
          e._onTimeout && e._onTimeout();
        }, t));
      }, n(33), t.setImmediate = "undefined" != typeof self && self.setImmediate || void 0 !== e && e.setImmediate || this && this.setImmediate, t.clearImmediate = "undefined" != typeof self && self.clearImmediate || void 0 !== e && e.clearImmediate || this && this.clearImmediate;
    }).call(t, n(0));
  }, function (e, t, n) {
    (function (e, t) {
      !function (e, n) {
        "use strict";
        function r(e) {
          "function" != typeof e && (e = new Function("" + e));for (var t = new Array(arguments.length - 1), n = 0; n < t.length; n++) {
            t[n] = arguments[n + 1];
          }var r = { callback: e, args: t };return c[u] = r, s(u), u++;
        }function i(e) {
          delete c[e];
        }function o(e) {
          var t = e.callback,
              r = e.args;switch (r.length) {case 0:
              t();break;case 1:
              t(r[0]);break;case 2:
              t(r[0], r[1]);break;case 3:
              t(r[0], r[1], r[2]);break;default:
              t.apply(n, r);}
        }function a(e) {
          if (f) setTimeout(a, 0, e);else {
            var t = c[e];if (t) {
              f = !0;try {
                o(t);
              } finally {
                i(e), f = !1;
              }
            }
          }
        }if (!e.setImmediate) {
          var s,
              u = 1,
              c = {},
              f = !1,
              l = e.document,
              h = Object.getPrototypeOf && Object.getPrototypeOf(e);h = h && h.setTimeout ? h : e, "[object process]" === {}.toString.call(e.process) ? function () {
            s = function s(e) {
              t.nextTick(function () {
                a(e);
              });
            };
          }() : function () {
            if (e.postMessage && !e.importScripts) {
              var t = !0,
                  n = e.onmessage;return e.onmessage = function () {
                t = !1;
              }, e.postMessage("", "*"), e.onmessage = n, t;
            }
          }() ? function () {
            var t = "setImmediate$" + Math.random() + "$",
                n = function n(_n) {
              _n.source === e && "string" == typeof _n.data && 0 === _n.data.indexOf(t) && a(+_n.data.slice(t.length));
            };e.addEventListener ? e.addEventListener("message", n, !1) : e.attachEvent("onmessage", n), s = function s(n) {
              e.postMessage(t + n, "*");
            };
          }() : e.MessageChannel ? function () {
            var e = new MessageChannel();e.port1.onmessage = function (e) {
              a(e.data);
            }, s = function s(t) {
              e.port2.postMessage(t);
            };
          }() : l && "onreadystatechange" in l.createElement("script") ? function () {
            var e = l.documentElement;s = function s(t) {
              var n = l.createElement("script");n.onreadystatechange = function () {
                a(t), n.onreadystatechange = null, e.removeChild(n), n = null;
              }, e.appendChild(n);
            };
          }() : function () {
            s = function s(e) {
              setTimeout(a, 0, e);
            };
          }(), h.setImmediate = r, h.clearImmediate = i;
        }
      }("undefined" == typeof self ? void 0 === e ? this : e : self);
    }).call(t, n(0), n(1));
  }, function (e, t, n) {
    (function (t) {
      function n(e, t) {
        function n() {
          if (!i) {
            if (r("throwDeprecation")) throw new Error(t);r("traceDeprecation") ? console.trace(t) : console.warn(t), i = !0;
          }return e.apply(this, arguments);
        }if (r("noDeprecation")) return e;var i = !1;return n;
      }function r(e) {
        try {
          if (!t.localStorage) return !1;
        } catch (e) {
          return !1;
        }var n = t.localStorage[e];return null != n && "true" === String(n).toLowerCase();
      }e.exports = n;
    }).call(t, n(0));
  }, function (e, t, n) {
    "use strict";
    function r(e) {
      if (!(this instanceof r)) return new r(e);i.call(this, e);
    }e.exports = r;var i = n(16),
        o = n(6);o.inherits = n(2), o.inherits(r, i), r.prototype._transform = function (e, t, n) {
      n(null, e);
    };
  }, function (e, t, n) {
    "use strict";
    function r(e, t) {
      if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(t, "__esModule", { value: !0 });var i = Object.assign || function (e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];for (var r in n) {
          Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
        }
      }return e;
    },
        o = function () {
      function e(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
        }
      }return function (t, n, r) {
        return n && e(t.prototype, n), r && e(t, r), t;
      };
    }(),
        a = n(37),
        s = function (e) {
      return e && e.__esModule ? e : { default: e };
    }(a),
        u = function () {
      function e(t, n, o, a, u) {
        r(this, e), this.engine = t, this.key = n, this.baseUrl = a, this.channelId = s.default.encode(o), this.announceInfo = i({}, u, { channel: this.channelId }), this.announceURL = a + "/channel", this.key = n, this.conns = 0, this.failConns = 0, this.totalHTTPDownloaded = 0, this.totalP2PDownloaded = 0, this.totalP2PUploaded = 0, this.httpDownloaded = 0, this.p2pDownloaded = 0, this.errsFragLoad = 0, this.errsBufStalled = 0, this.errsInternalExpt = 0;
      }return o(e, [{ key: "btAnnounce", value: function value() {
          var e = this,
              t = this.engine.logger;return new Promise(function (n, r) {
            fetch(e.announceURL, { headers: e._requestHeader, method: "POST", body: JSON.stringify(e.announceInfo) }).then(function (e) {
              return e.json();
            }).then(function (t) {
              if (-1 === t.ret) r(t.data.msg);else {
                var i = t.data;e.peerId = i.id, e.btStats(i.report_interval), e.getPeersURL = e.baseUrl + "/channel/" + e.channelId + "/node/" + e.peerId + "/peers", e.statsURL = e.baseUrl + "/channel/" + e.channelId + "/node/" + e.peerId + "/stats", n(t.data);
              }
            }).catch(function (e) {
              t.error("btAnnounce error " + e), r(e);
            });
          });
        } }, { key: "btStats", value: function value() {
          var e = this,
              t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 10,
              n = this.engine.logger;this.heartbeater = window.setInterval(function () {
            fetch(e.statsURL, { headers: e._requestHeader, method: "POST", body: JSON.stringify(e._makeStatsBody()) }).then(function (t) {
              t.ok && (n.info("sucessfully report stats"), e.httpDownloaded = 0, e.p2pDownloaded = 0, e.conns = 0, e.failConns = 0, e.errsFragLoad = 0, e.errsBufStalled = 0, e.errsInternalExpt = 0);
            }).catch(function (e) {
              n.error("btStats error " + e);
            });
          }, 1e3 * t);
        } }, { key: "btGetPeers", value: function value() {
          var e = this,
              t = this.engine.logger;return new Promise(function (n, r) {
            fetch(e.getPeersURL, { headers: e._requestHeader, method: "POST" }).then(function (e) {
              return e.json();
            }).then(function (e) {
              -1 === e.ret ? r(e.data.msg) : n(e.data);
            }).catch(function (e) {
              t.error("btGetPeers error " + e), r(e);
            });
          });
        } }, { key: "increConns", value: function value() {
          this.conns++;
        } }, { key: "decreConns", value: function value() {
          this.conns--;
        } }, { key: "increFailConns", value: function value() {
          this.failConns++;
        } }, { key: "reportFlow", value: function value(e) {
          var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1],
              n = Math.round(e.total / 1024);t ? (this.p2pDownloaded += n, this.totalP2PDownloaded += n) : (this.httpDownloaded += n, this.totalHTTPDownloaded += n), this._emitStats();
        } }, { key: "reportUploaded", value: function value() {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;this.totalP2PUploaded += Math.round(e / 1024), this._emitStats();
        } }, { key: "destroy", value: function value() {
          window.clearInterval(this.heartbeater);
        } }, { key: "_emitStats", value: function value() {
          this.engine.emit("stats", { totalHTTPDownloaded: this.totalHTTPDownloaded, totalP2PDownloaded: this.totalP2PDownloaded, totalP2PUploaded: this.totalP2PUploaded });
        } }, { key: "_makeStatsBody", value: function value() {
          var e = { conns: this.conns, failConns: this.failConns, errsFragLoad: this.errsFragLoad, errsBufStalled: this.errsBufStalled, errsInternalExpt: this.errsInternalExpt, http: Math.round(this.httpDownloaded), p2p: Math.round(this.p2pDownloaded) };return Object.keys(e).forEach(function (t) {
            0 === e[t] && delete e[t];
          }), e;
        } }, { key: "_requestHeader", get: function get() {
          return {};
        } }]), e;
    }();t.default = u, e.exports = t.default;
  }, function (e, t, n) {
    "use strict";
    (function (e, r) {
      var i,
          o = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
        return typeof e === "undefined" ? "undefined" : _typeof(e);
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof(e);
      };!function (a) {
        var s = "object" == o(t) && t,
            u = "object" == o(e) && e && e.exports == s && e,
            c = "object" == (void 0 === r ? "undefined" : o(r)) && r;c.global !== c && c.window !== c || (a = c);var f = function f(e) {
          this.message = e;
        };f.prototype = new Error(), f.prototype.name = "InvalidCharacterError";var l = function l(e) {
          throw new f(e);
        },
            h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            d = function d(e) {
          e = String(e), /[^\0-\xFF]/.test(e) && l("The string to be encoded contains characters outside of the Latin1 range.");for (var t, n, r, i, o = e.length % 3, a = "", s = -1, u = e.length - o; ++s < u;) {
            t = e.charCodeAt(s) << 16, n = e.charCodeAt(++s) << 8, r = e.charCodeAt(++s), i = t + n + r, a += h.charAt(i >> 18 & 63) + h.charAt(i >> 12 & 63) + h.charAt(i >> 6 & 63) + h.charAt(63 & i);
          }return 2 == o ? (t = e.charCodeAt(s) << 8, n = e.charCodeAt(++s), i = t + n, a += h.charAt(i >> 10) + h.charAt(i >> 4 & 63) + h.charAt(i << 2 & 63) + "=") : 1 == o && (i = e.charCodeAt(s), a += h.charAt(i >> 2) + h.charAt(i << 4 & 63) + "=="), a;
        },
            p = { encode: d, version: "<%= version %>" };if ("object" == o(n(18)) && n(18)) void 0 !== (i = function () {
          return p;
        }.call(t, n, t, e)) && (e.exports = i);else if (s && !s.nodeType) {
          if (u) u.exports = p;else for (var g in p) {
            p.hasOwnProperty(g) && (s[g] = p[g]);
          }
        } else a.base64 = p;
      }(void 0);
    }).call(t, n(38)(e), n(0));
  }, function (e, t) {
    e.exports = function (e) {
      return e.webpackPolyfill || (e.deprecate = function () {}, e.paths = [], e.children || (e.children = []), Object.defineProperty(e, "loaded", { enumerable: !0, get: function get() {
          return e.l;
        } }), Object.defineProperty(e, "id", { enumerable: !0, get: function get() {
          return e.i;
        } }), e.webpackPolyfill = 1), e;
    };
  }]);
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)(module)))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handleTSUrl = handleTSUrl;
exports.throttle = throttle;
exports.defaultChannelId = defaultChannelId;
exports.tsPathChecker = tsPathChecker;
exports.noop = noop;

var _urlToolkit = __webpack_require__(4);

var _urlToolkit2 = _interopRequireDefault(_urlToolkit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 根据参数决定是否去掉ts的url的查询参数
function handleTSUrl(url) {
    var matched = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (!matched) {
        return url.split("?")[0];
    }
    return url;
}

// 函数节流，默认冷却时间30秒
function throttle(method, context) {
    var colddown = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;


    var going = false;
    return function () {
        if (going) return;
        going = true;
        setTimeout(function () {
            method.call(context);
            going = false;
        }, colddown * 1000);
    };
};

// channelId generator
function defaultChannelId(url, protocol) {
    var browserInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var path = _urlToolkit2.default.parseURL(url).path.split('.')[0];
    return path + '[' + protocol + ']';
}

function tsPathChecker() {
    var lastSN = -1;
    var lastPath = '';
    return function (sn, path) {
        path = path.split('?')[0];
        var isOK = true;
        if (lastSN !== sn && lastPath === path) {
            isOK = false;
        }
        // if (lastSN !== sn && lastPath === path) {
        //     console.warn(`path of ${sn} equal to path of ${lastSN}`);
        // }
        lastSN = sn;
        lastPath = path;
        return isOK;
    };
}

function noop() {
    return true;
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.config = exports.FragLoader = exports.Tracker = undefined;

var _btTracker = __webpack_require__(9);

var _btTracker2 = _interopRequireDefault(_btTracker);

var _btLoader = __webpack_require__(13);

var _btLoader2 = _interopRequireDefault(_btLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {
    announce: "https://api.cdnbye.com/v1", // tracker服务器地址
    urgentOffset: 3 // 播放点的后多少个buffer为urgent

};

exports.Tracker = _btTracker2.default;
exports.FragLoader = _btLoader2.default;
exports.config = config;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// see https://tools.ietf.org/html/rfc1808

/* jshint ignore:start */
(function(root) { 
/* jshint ignore:end */

  var URL_REGEX = /^((?:[a-zA-Z0-9+\-.]+:)?)(\/\/[^\/\;?#]*)?(.*?)??(;.*?)?(\?.*?)?(#.*?)?$/;
  var FIRST_SEGMENT_REGEX = /^([^\/;?#]*)(.*)$/;
  var SLASH_DOT_REGEX = /(?:\/|^)\.(?=\/)/g;
  var SLASH_DOT_DOT_REGEX = /(?:\/|^)\.\.\/(?!\.\.\/).*?(?=\/)/g;

  var URLToolkit = { // jshint ignore:line
    // If opts.alwaysNormalize is true then the path will always be normalized even when it starts with / or //
    // E.g
    // With opts.alwaysNormalize = false (default, spec compliant)
    // http://a.com/b/cd + /e/f/../g => http://a.com/e/f/../g
    // With opts.alwaysNormalize = true (not spec compliant)
    // http://a.com/b/cd + /e/f/../g => http://a.com/e/g
    buildAbsoluteURL: function(baseURL, relativeURL, opts) {
      opts = opts || {};
      // remove any remaining space and CRLF
      baseURL = baseURL.trim();
      relativeURL = relativeURL.trim();
      if (!relativeURL) {
        // 2a) If the embedded URL is entirely empty, it inherits the
        // entire base URL (i.e., is set equal to the base URL)
        // and we are done.
        if (!opts.alwaysNormalize) {
          return baseURL;
        }
        var basePartsForNormalise = URLToolkit.parseURL(baseURL);
        if (!basePartsForNormalise) {
          throw new Error('Error trying to parse base URL.');
        }
        basePartsForNormalise.path = URLToolkit.normalizePath(basePartsForNormalise.path);
        return URLToolkit.buildURLFromParts(basePartsForNormalise);
      }
      var relativeParts = URLToolkit.parseURL(relativeURL);
      if (!relativeParts) {
        throw new Error('Error trying to parse relative URL.');
      }
      if (relativeParts.scheme) {
        // 2b) If the embedded URL starts with a scheme name, it is
        // interpreted as an absolute URL and we are done.
        if (!opts.alwaysNormalize) {
          return relativeURL;
        }
        relativeParts.path = URLToolkit.normalizePath(relativeParts.path);
        return URLToolkit.buildURLFromParts(relativeParts);
      }
      var baseParts = URLToolkit.parseURL(baseURL);
      if (!baseParts) {
        throw new Error('Error trying to parse base URL.');
      }
      if (!baseParts.netLoc && baseParts.path && baseParts.path[0] !== '/') {
        // If netLoc missing and path doesn't start with '/', assume everthing before the first '/' is the netLoc
        // This causes 'example.com/a' to be handled as '//example.com/a' instead of '/example.com/a'
        var pathParts = FIRST_SEGMENT_REGEX.exec(baseParts.path);
        baseParts.netLoc = pathParts[1];
        baseParts.path = pathParts[2];
      }
      if (baseParts.netLoc && !baseParts.path) {
        baseParts.path = '/';
      }
      var builtParts = {
        // 2c) Otherwise, the embedded URL inherits the scheme of
        // the base URL.
        scheme: baseParts.scheme,
        netLoc: relativeParts.netLoc,
        path: null,
        params: relativeParts.params,
        query: relativeParts.query,
        fragment: relativeParts.fragment
      };
      if (!relativeParts.netLoc) {
        // 3) If the embedded URL's <net_loc> is non-empty, we skip to
        // Step 7.  Otherwise, the embedded URL inherits the <net_loc>
        // (if any) of the base URL.
        builtParts.netLoc = baseParts.netLoc;
        // 4) If the embedded URL path is preceded by a slash "/", the
        // path is not relative and we skip to Step 7.
        if (relativeParts.path[0] !== '/') {
          if (!relativeParts.path) {
            // 5) If the embedded URL path is empty (and not preceded by a
            // slash), then the embedded URL inherits the base URL path
            builtParts.path = baseParts.path;
            // 5a) if the embedded URL's <params> is non-empty, we skip to
            // step 7; otherwise, it inherits the <params> of the base
            // URL (if any) and
            if (!relativeParts.params) {
              builtParts.params = baseParts.params;
              // 5b) if the embedded URL's <query> is non-empty, we skip to
              // step 7; otherwise, it inherits the <query> of the base
              // URL (if any) and we skip to step 7.
              if (!relativeParts.query) {
                builtParts.query = baseParts.query;
              }
            }
          } else {
            // 6) The last segment of the base URL's path (anything
            // following the rightmost slash "/", or the entire path if no
            // slash is present) is removed and the embedded URL's path is
            // appended in its place.
            var baseURLPath = baseParts.path;
            var newPath = baseURLPath.substring(0, baseURLPath.lastIndexOf('/') + 1) + relativeParts.path;
            builtParts.path = URLToolkit.normalizePath(newPath);
          }
        }
      }
      if (builtParts.path === null) {
        builtParts.path = opts.alwaysNormalize ? URLToolkit.normalizePath(relativeParts.path) : relativeParts.path;
      }
      return URLToolkit.buildURLFromParts(builtParts);
    },
    parseURL: function(url) {
      var parts = URL_REGEX.exec(url);
      if (!parts) {
        return null;
      }
      return {
        scheme: parts[1] || '',
        netLoc: parts[2] || '',
        path: parts[3] || '',
        params: parts[4] || '',
        query: parts[5] || '',
        fragment: parts[6] || ''
      };
    },
    normalizePath: function(path) {
      // The following operations are
      // then applied, in order, to the new path:
      // 6a) All occurrences of "./", where "." is a complete path
      // segment, are removed.
      // 6b) If the path ends with "." as a complete path segment,
      // that "." is removed.
      path = path.split('').reverse().join('').replace(SLASH_DOT_REGEX, '');
      // 6c) All occurrences of "<segment>/../", where <segment> is a
      // complete path segment not equal to "..", are removed.
      // Removal of these path segments is performed iteratively,
      // removing the leftmost matching pattern on each iteration,
      // until no matching pattern remains.
      // 6d) If the path ends with "<segment>/..", where <segment> is a
      // complete path segment not equal to "..", that
      // "<segment>/.." is removed.
      while (path.length !== (path = path.replace(SLASH_DOT_DOT_REGEX, '')).length) {} // jshint ignore:line
      return path.split('').reverse().join('');
    },
    buildURLFromParts: function(parts) {
      return parts.scheme + parts.netLoc + parts.path + parts.params + parts.query + parts.fragment;
    }
  };

/* jshint ignore:start */
  if(true)
    module.exports = URLToolkit;
  else if(typeof define === 'function' && define.amd)
    define([], function() { return URLToolkit; });
  else if(typeof exports === 'object')
    exports["URLToolkit"] = URLToolkit;
  else
    root["URLToolkit"] = URLToolkit;
})(this);
/* jshint ignore:end */


/***/ }),
/* 5 */
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = __webpack_require__(7);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Hlsjs;
if (false) {
    Hlsjs = require('hls.js/dist/hls.light');
} else {
    Hlsjs = __webpack_require__(17);
}

var recommendedHlsjsConfig = {
    maxBufferSize: 0,
    maxBufferLength: 30,
    liveSyncDuration: 30,
    fragLoadingTimeOut: 4000 // used by fragment-loader
};

var CDNByeHlsjs = function (_Hlsjs) {
    _inherits(CDNByeHlsjs, _Hlsjs);

    _createClass(CDNByeHlsjs, null, [{
        key: 'P2PEvents',
        get: function get() {
            return _index2.default.Events;
        }
    }, {
        key: 'uaParserResult',
        get: function get() {
            return _index2.default.uaParserResult;
        }
    }]);

    function CDNByeHlsjs() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, CDNByeHlsjs);

        var p2pConfig = config.p2pConfig || {};
        delete config.p2pConfig;

        var mergedHlsjsConfig = Object.assign({}, recommendedHlsjsConfig, config);

        var _this = _possibleConstructorReturn(this, (CDNByeHlsjs.__proto__ || Object.getPrototypeOf(CDNByeHlsjs)).call(this, mergedHlsjsConfig));

        if (_index2.default.WEBRTC_SUPPORT) {
            _this.engine = new _index2.default(_this, p2pConfig);
        }

        return _this;
    }

    _createClass(CDNByeHlsjs, [{
        key: 'enableP2P',
        value: function enableP2P() {
            this.engine.enableP2P();
        }
    }, {
        key: 'disableP2P',
        value: function disableP2P() {
            this.engine.disableP2P();
        }
    }]);

    return CDNByeHlsjs;
}(Hlsjs);

CDNByeHlsjs.engineVersion = _index2.default.version; //the current version of p2p engine

CDNByeHlsjs.WEBRTC_SUPPORT = _index2.default.WEBRTC_SUPPORT; //check if webrtc is supported in this browser

exports.default = CDNByeHlsjs;
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

var _config = __webpack_require__(8);

var _config2 = _interopRequireDefault(_config);

var _bittorrent = __webpack_require__(3);

var _bufferManager = __webpack_require__(14);

var _bufferManager2 = _interopRequireDefault(_bufferManager);

var _core = __webpack_require__(1);

var _logger = __webpack_require__(15);

var _logger2 = _interopRequireDefault(_logger);

var _platform = __webpack_require__(16);

var _platform2 = _interopRequireDefault(_platform);

var _toolFuns = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var P2PEngine = function (_EventEmitter) {
    _inherits(P2PEngine, _EventEmitter);

    _createClass(P2PEngine, null, [{
        key: 'Events',
        get: function get() {
            return _core.Events;
        }
    }]);

    function P2PEngine(hlsjs, p2pConfig) {
        _classCallCheck(this, P2PEngine);

        var _this = _possibleConstructorReturn(this, (P2PEngine.__proto__ || Object.getPrototypeOf(P2PEngine)).call(this));

        _this.config = Object.assign({}, _config2.default, p2pConfig);

        if (!_this.config.channelId || typeof _this.config.channelId !== 'function') {
            _this.config.channelId = _toolFuns.defaultChannelId;
        }

        _this.hlsjs = hlsjs;
        _this.p2pEnabled = _this.config.disableP2P === false ? false : true; //默认开启P2P

        hlsjs.config.currLoaded = hlsjs.config.currPlay = 0;

        _this.HLSEvents = hlsjs.constructor.Events;

        _this.checkTSPath = _this.config.tsStrictMatched ? _toolFuns.noop : (0, _toolFuns.tsPathChecker)();

        var onLevelLoaded = function onLevelLoaded(event, data) {

            var isLive = data.details.live;
            _this.config.live = isLive;
            // 浏览器信息
            var browserInfo = {
                device: _platform2.default.getPlatform(),
                netType: _platform2.default.getNetType(),
                host: window.location.host,
                version: P2PEngine.version,
                tag: _this.config.tag || _this.hlsjs.constructor.version
            };
            var channel = _this.config.channelId(hlsjs.url, _core.DataChannel.VERSION, browserInfo);
            //初始化logger
            var logger = new _logger2.default(_this.config, channel);
            _this.hlsjs.config.logger = _this.logger = logger;
            logger.info('channel ' + channel);
            _this._init(channel, browserInfo);

            hlsjs.off(_this.HLSEvents.LEVEL_LOADED, onLevelLoaded);
        };

        hlsjs.on(_this.HLSEvents.LEVEL_LOADED, onLevelLoaded);

        console.log('CDNBye v' + P2PEngine.version + ' -- A Free and Infinitely Scalable Video P2P Engine. (https://github.com/cdnbye/hlsjs-p2p-engine)');

        return _this;
    }

    _createClass(P2PEngine, [{
        key: '_init',
        value: function _init(channel, browserInfo) {
            var _this2 = this;

            var logger = this.logger;


            this.hlsjs.config.p2pEnabled = this.p2pEnabled;
            //实例化BufferManager
            this.bufMgr = new _bufferManager2.default(this, this.config);
            this.hlsjs.config.bufMgr = this.bufMgr;

            //实例化Fetcher
            var fetcher = new _core.Fetcher(this, 'free', window.encodeURIComponent(channel), this.config.announce, browserInfo);
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

            this.hlsjs.on(this.HLSEvents.FRAG_LOADING, function (id, data) {
                // log('FRAG_LOADING: ' + JSON.stringify(data.frag));
                logger.debug('loading frag ' + data.frag.sn);
                _this2.signaler.currentLoadingSN = data.frag.sn;
            });

            this.signalTried = false; //防止重复连接ws
            this.hlsjs.on(this.HLSEvents.FRAG_LOADED, function (id, data) {
                var sn = data.frag.sn;
                _this2.hlsjs.config.currLoaded = sn;
                _this2.signaler.currentLoadedSN = sn; //用于BT算法
                _this2.hlsjs.config.currLoadedDuration = data.frag.duration;
                var bitrate = Math.round(data.frag.loaded * 8 / data.frag.duration);
                if (!_this2.signalTried && !_this2.signaler.connected && _this2.config.p2pEnabled) {

                    _this2.signaler.scheduler.bitrate = bitrate;
                    logger.info('bitrate ' + bitrate);

                    _this2.signaler.resumeP2P();
                    _this2.signalTried = true;
                }
                // this.streamingRate = (this.streamingRate*this.fragLoadedCounter + bitrate)/(++this.fragLoadedCounter);
                // this.signaler.scheduler.streamingRate = Math.floor(this.streamingRate);
                if (!data.frag.loadByHTTP) {
                    data.frag.loadByP2P = false;
                    data.frag.loadByHTTP = true;
                }
                // console.warn(`data.frag.url ${data.frag.url}`);
                if (!_this2.checkTSPath(sn, data.frag.url)) {
                    logger.warn('ts path of ' + sn + ' equal to the previous, set tsStrictMatched to true');
                    _this2.config.tsStrictMatched = true;
                    _this2.checkTSPath = _toolFuns.noop;
                }
            });

            this.hlsjs.on(this.HLSEvents.FRAG_CHANGED, function (id, data) {
                // log('FRAG_CHANGED: '+JSON.stringify(data.frag, null, 2));
                logger.debug('frag changed: ' + data.frag.sn);
                var sn = data.frag.sn;
                _this2.hlsjs.config.currPlay = sn;
                _this2.signaler.currentPlaySN = sn;
            });

            this.hlsjs.on(this.HLSEvents.ERROR, function (event, data) {
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

            this.hlsjs.on(this.HLSEvents.DESTROYING, function () {
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

            logger.warn('disable P2P');
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

            logger.warn('enable P2P');
            if (!this.p2pEnabled) {
                this.p2pEnabled = true;
                this.config.p2pEnabled = this.hlsjs.config.p2pEnabled = this.p2pEnabled;
                if (this.signaler) {
                    this.signaler.resumeP2P();
                }
            }
        }
    }, {
        key: 'version',
        get: function get() {
            return P2PEngine.version;
        }
    }]);

    return P2PEngine;
}(_events2.default);

P2PEngine.WEBRTC_SUPPORT = !!(0, _core.getBrowserRTC)();

P2PEngine.version = "0.2.4";

exports.default = P2PEngine;
module.exports = exports['default'];

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _bittorrent = __webpack_require__(3);

//时间单位统一为秒
var defaultP2PConfig = _extends({
    wsSignalerAddr: 'wss://signal.cdnbye.com/wss', // 信令服务器地址
    wsMaxRetries: 3, // websocket连接重试次数
    wsReconnectInterval: 5, // websocket重连时间间隔

    p2pEnabled: true, // 是否开启P2P，默认true

    dcRequestTimeout: 3, // datachannel接收二进制数据的超时时间
    dcUploadTimeout: 3, // datachannel上传二进制数据的超时时间
    dcPings: 5, // datachannel发送ping数据包的数量
    dcTolerance: 4, // 请求超时或错误多少次淘汰该peer

    packetSize: 64 * 1024, // 每次通过datachannel发送的包的大小
    maxBufSize: 1024 * 1024 * 50, // p2p缓存的最大数据量
    loadTimeout: 3, // p2p下载的超时时间
    tsStrictMatched: false, // p2p传输的ts是否要严格匹配（去掉查询参数），默认false

    enableLogUpload: false, // 上传log到服务器，默认false
    logUploadAddr: "wss://api.cdnbye.com/trace", // log上传地址
    logUploadLevel: 'warn', // log上传level，分为debug、info、warn、error、none，默认warn
    logLevel: 'none', // log的level，分为debug、info、warn、error、none，设为true等于debug，设为false等于none，默认none

    tag: '', // 用户自定义标签，可用于在后台查看参数调整效果

    channelId: null }, _bittorrent.config);

exports.default = defaultP2PConfig;
module.exports = exports['default'];

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

var _btScheduler = __webpack_require__(10);

var _btScheduler2 = _interopRequireDefault(_btScheduler);

var _signalClient = __webpack_require__(12);

var _signalClient2 = _interopRequireDefault(_signalClient);

var _core = __webpack_require__(1);

var _toolFuns = __webpack_require__(2);

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
        //tracker request API
        _this.fetcher = fetcher;
        /*
        peers: Array<Object{id:string}>
         */
        _this.peers = [];

        // 防止调用频率过高
        _this.requestMorePeers = (0, _toolFuns.throttle)(_this._requestMorePeers, _this);

        _this._setupScheduler(_this.scheduler);
        return _this;
    }

    _createClass(BTTracker, [{
        key: 'resumeP2P',
        value: function resumeP2P() {
            var _this2 = this;

            var logger = this.engine.logger;

            this.fetcher.btAnnounce().then(function (json) {
                logger.info('announce request response ' + JSON.stringify(json));
                _this2.engine.peerId = _this2.peerId = json.id;
                logger.identifier = _this2.peerId;
                _this2.signalerWs = _this2._initSignalerWs(); //连上tracker后开始连接信令服务器
                _this2._handlePeers(json.peers);
                _this2.engine.emit('peerId', _this2.peerId);
            }).catch(function (err) {
                console.warn(err);
            });
        }
    }, {
        key: 'stopP2P',
        value: function stopP2P() {
            var logger = this.engine.logger;

            logger.warn('\u672A\u5B9E\u73B0');
        }
    }, {
        key: 'destroy',
        value: function destroy() {}
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
        key: '_tryConnectToAllPeers',
        value: function _tryConnectToAllPeers() {
            var _this4 = this;

            var logger = this.engine.logger;

            if (this.peers.length === 0) return;
            logger.info('try connect to ' + this.peers.length + ' peers');
            this.peers.forEach(function (peer) {
                var datachannel = new _core.DataChannel(_this4.engine, _this4.peerId, peer.id, true, _this4.config);
                _this4.DCMap.set(peer.id, datachannel); // 将对等端Id作为键
                _this4._setupDC(datachannel);
            });
            // 清空peers
            this.peers = [];
        }
    }, {
        key: '_setupDC',
        value: function _setupDC(datachannel) {
            var _this5 = this;

            var logger = this.engine.logger;

            datachannel.on(_core.Events.DC_SIGNAL, function (data) {
                var remotePeerId = datachannel.remotePeerId;
                _this5.signalerWs.sendSignal(remotePeerId, data);
            }).once(_core.Events.DC_ERROR, function () {
                logger.warn('datachannel connect ' + datachannel.channelId + ' failed');
                _this5.scheduler.deletePeer(datachannel);
                _this5.DCMap.delete(datachannel.remotePeerId);
                _this5.failedDCSet.add(datachannel.remotePeerId); //记录失败的连接
                datachannel.destroy();

                _this5.requestMorePeers();

                //更新conns
                if (datachannel.isInitiator) {
                    if (datachannel.connected) {
                        //连接断开
                        _this5.fetcher.decreConns();
                    } else {
                        //连接失败
                        _this5.fetcher.increFailConns();
                    }
                }
            }).once(_core.Events.DC_CLOSE, function () {

                logger.warn('datachannel ' + datachannel.channelId + ' closed');
                _this5.scheduler.deletePeer(datachannel);
                _this5.DCMap.delete(datachannel.remotePeerId);
                _this5.failedDCSet.add(datachannel.remotePeerId); //记录断开的连接

                datachannel.destroy();

                _this5.requestMorePeers();

                //更新conns
                _this5.fetcher.decreConns();
            }).once(_core.Events.DC_OPEN, function () {

                _this5.scheduler.handshakePeer(datachannel);

                //如果dc数量不够则继续尝试连接
                _this5.requestMorePeers();

                //更新conns
                _this5.fetcher.increConns();
            });
        }
    }, {
        key: '_initSignalerWs',
        value: function _initSignalerWs() {
            var _this6 = this;

            var logger = this.engine.logger;

            var websocket = new _signalClient2.default(this.engine, this.peerId, this.config);
            websocket.onopen = function () {
                _this6.connected = true;
                // 尝试与所有peers同时建立连接
                _this6._tryConnectToAllPeers();
            };

            websocket.onmessage = function (e) {
                var msg = JSON.parse(e.data);
                var action = msg.action;
                switch (action) {
                    case 'signal':
                        if (_this6.failedDCSet.has(msg.from_peer_id)) return;
                        logger.debug('handle signal of ' + msg.from_peer_id);
                        if (!msg.data) {
                            //如果对等端已不在线
                            _this6.DCMap.delete(msg.from_peer_id);
                            _this6.failedDCSet.add(msg.from_peer_id); //记录失败的连接
                            logger.info('signaling ' + msg.from_peer_id + ' not found');
                        } else {
                            _this6._handleSignal(msg.from_peer_id, msg.data);
                        }
                        break;
                    case 'reject':
                        _this6.stopP2P();
                        break;
                    default:
                        logger.warn('Signaler websocket unknown action ' + action);

                }
            };
            websocket.onclose = function () {
                //websocket断开时清除datachannel
                _this6.connected = false;
                _this6.destroy();
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
                datachannel = new _core.DataChannel(this.engine, this.peerId, remotePeerId, false, this.config);
                this.DCMap.set(remotePeerId, datachannel); //将对等端Id作为键
                this._setupDC(datachannel);
            }
            datachannel.receiveSignal(data);
        }
    }, {
        key: '_setupScheduler',
        value: function _setupScheduler(s) {}
    }, {
        key: '_requestMorePeers',
        value: function _requestMorePeers() {
            var _this7 = this;

            var logger = this.engine.logger;
            // 连接的节点<=3时请求更多节点

            if (this.scheduler.peerMap.size <= 3) {
                this.fetcher.btGetPeers().then(function (json) {
                    logger.info('request more peers ' + JSON.stringify(json));
                    _this7._handlePeers(json.peers);
                    _this7._tryConnectToAllPeers();
                });
            }
        }
    }, {
        key: 'currentPlaySN',
        set: function set(sn) {
            // console.warn(`currentPlaySN ${sn} ${performance.now()}`);
            this.scheduler.updatePlaySN(sn);
        }
    }, {
        key: 'currentLoadingSN',
        set: function set(sn) {
            // console.warn(`currentLoadingSN ${sn} ${performance.now()}`);
            this.scheduler.updateLoadingSN(sn);
        }
    }, {
        key: 'currentLoadedSN',
        set: function set(sn) {
            // console.warn(`currentLoadedSN ${sn} ${performance.now()}`);
            this.scheduler.updateLoadedSN(sn); //更新bitmap
        }
    }]);

    return BTTracker;
}(_events2.default);

exports.default = BTTracker;
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

var _core = __webpack_require__(1);

var _toolFuns = __webpack_require__(2);

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
        _this.bitset = new Set(); // 本节点的bitfield
        _this.bitCounts = new Map(); // 记录peers的每个buffer的总和，用于BT的rearest first策略  index -> count

        _this.targetPeer = null; // 当前的目标peer

        // 传输控制(单位ms)

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
                    event: _core.Events.DC_HAVE,
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
                            if (peer.isAvailable && peer.bitset.has(idx)) {
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

            //检查是否有空闲的节点，有的话采用rearest first策略下载(由于上行带宽有限，暂停这个策略)
            // let idlePeers = this._getIdlePeer();
            // if (idlePeers.length === 0 || this.bitCounts.size === 0 || this.bufMgr.overflowed) return;        //缓存溢出则停止rearest first
            // let sortedArr = [...this.bitCounts.entries()].sort((item1, item2) => {
            //     return item1[1] < item2[1];
            // });
            // if (sortedArr.length === 0) return;
            // //每次只下载一个rearest块
            // let rearest = sortedArr.pop()[0];
            // while (rearest === this.loadingSN || requested.includes(rearest)) {         //排除掉loading的和requested的
            //     if (sortedArr.length === 0) return;
            //     rearest = sortedArr.pop()[0];
            // }
            // for (let peer of idlePeers) {
            //     if (peer.bitset.has(rearest)) {
            //         peer.requestDataBySN(rearest, false);
            //         logger.debug(`request rearest ${rearest} from peer ${peer.remotePeerId}`);
            //         break;
            //     }
            // }
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
        key: 'hasAndSetTargetPeer',
        value: function hasAndSetTargetPeer(sn) {
            var logger = this.engine.logger;

            if (!(this.hasIdlePeers && this.peersHasSN(sn))) return false;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.peerMap.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var peer = _step2.value;

                    if (peer.isAvailable && peer.bitset.has(sn)) {
                        logger.info('found sn ' + sn + ' from peer ' + peer.remotePeerId);
                        this.targetPeer = peer;
                        return true;
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

            logger.warn('idle peers has not sn ' + sn);
            return false;
        }
    }, {
        key: 'load',
        value: function load(context, config, callbacks) {
            var logger = this.engine.logger;

            this.context = context;
            var frag = context.frag;
            var handledUrl = (0, _toolFuns.handleTSUrl)(frag.relurl, this.config.tsStrictMatched);
            this.callbacks = callbacks;
            this.stats = { trequest: performance.now(), retry: 0, tfirst: 0, tload: 0, loaded: 0 };
            this.criticalSeg = { sn: frag.sn, relurl: handledUrl };
            this.targetPeer.requestDataByURL(handledUrl, true);
            logger.info('request criticalSeg url ' + frag.relurl + ' at ' + frag.sn);
            this.criticaltimeouter = window.setTimeout(this._criticaltimeout.bind(this), this.config.loadTimeout * 1000);
        }
    }, {
        key: '_setupDC',
        value: function _setupDC(dc) {
            var _this3 = this;

            var logger = this.engine.logger;

            dc.on(_core.Events.DC_BITFIELD, function (msg) {
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
            }).on(_core.Events.DC_HAVE, function (msg) {
                if (!msg.sn || !dc.bitset) return;
                var sn = msg.sn;
                dc.bitset.add(sn);
                if (!_this3.bitset.has(sn)) {
                    //防止重复下载
                    _this3._increBitCounts(sn);
                }
            }).on(_core.Events.DC_LOST, function (msg) {
                if (!msg.sn || !dc.bitset) return;
                var sn = msg.sn;
                dc.bitset.delete(sn);
                _this3._decreBitCounts(sn);
            }).on(_core.Events.DC_PIECE_ACK, function (msg) {
                if (msg.size) {
                    _this3.engine.fetcher.reportUploaded(msg.size);
                }
            }).on(_core.Events.DC_PIECE, function (msg) {
                //接收到piece事件，即二进制包头
                if (_this3.criticalSeg && _this3.criticalSeg.relurl === msg.url) {
                    //接收到critical的响应
                    _this3.stats.tfirst = Math.max(performance.now(), _this3.stats.trequest);
                }
            }).on(_core.Events.DC_PIECE_NOT_FOUND, function (msg) {
                if (_this3.criticalSeg && _this3.criticalSeg.relurl === msg.url) {
                    //接收到critical未找到的响应
                    window.clearTimeout(_this3.criticaltimeouter); //清除定时器
                    // this.criticaltimeouter = null;
                    logger.info('DC_PIECE_NOT_FOUND');
                    _this3._criticaltimeout(); //触发超时，由xhr下载
                }
            }).on(_core.Events.DC_RESPONSE, function (response) {
                //接收到完整二进制数据
                if (_this3.criticalSeg && _this3.criticalSeg.relurl === response.url && _this3.criticaltimeouter) {
                    logger.info('receive criticalSeg url ' + response.url);
                    window.clearTimeout(_this3.criticaltimeouter); //清除定时器
                    _this3.criticaltimeouter = null;
                    var stats = _this3.stats;
                    stats.tload = Math.max(stats.tfirst, performance.now());
                    stats.loaded = stats.total = response.data.byteLength;
                    _this3.criticalSeg = null;
                    _this3.context.frag.fromPeerId = dc.remotePeerId;
                    _this3.callbacks.onSuccess(response, stats, _this3.context);
                } else {
                    _this3.bufMgr.addBuffer(response.sn, response.url, response.data, dc.remotePeerId);
                }
                _this3.updateLoadedSN(response.sn);
            }).on(_core.Events.DC_REQUEST, function (msg) {
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
                        event: _core.Events.DC_PIECE_NOT_FOUND,
                        url: url,
                        sn: msg.sn
                    });
                }
            }).on(_core.Events.DC_TIMEOUT, function () {
                logger.warn('DC_TIMEOUT');
                if (_this3.criticaltimeouter) {
                    window.clearTimeout(_this3.criticaltimeouter); //清除定时器
                    _this3._criticaltimeout();
                }
            });
        }
    }, {
        key: '_broadcastToPeers',
        value: function _broadcastToPeers(msg) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.peerMap.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var peer = _step3.value;

                    peer.sendJson(msg);
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
        }
    }, {
        key: '_getIdlePeer',
        value: function _getIdlePeer() {
            return [].concat(_toConsumableArray(this.peerMap.values())).filter(function (peer) {
                return peer.isAvailable;
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

            logger.warn('critical request timeout');
            this.criticalSeg = null;
            this.criticaltimeouter = null;
            this.callbacks.onTimeout(this.stats, this.context, null);
        }
    }, {
        key: 'hasPeers',
        get: function get() {
            return this.peerMap.size > 0;
        }
    }, {
        key: 'hasIdlePeers',
        get: function get() {
            var logger = this.engine.logger;

            var idles = this._getIdlePeer().length;
            logger.info('peers: ' + this.peerMap.size + ' idle peers: ' + idles);
            return idles > 0;
        }
    }, {
        key: 'bufferManager',
        set: function set(bm) {
            var _this4 = this;

            this.bufMgr = bm;

            bm.on(_core.Events.BM_LOST, function (sn) {
                _this4._broadcastToPeers({ //向peers广播已经不缓存的sn
                    event: _core.Events.DC_LOST,
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
/* 11 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(0);

var _events2 = _interopRequireDefault(_events);

var _reconnectingWebsocket = __webpack_require__(5);

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
        _this.msgQueue = [];
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

                // 发送所有没有成功发送的消息
                if (_this2.msgQueue.length > 0) {
                    logger.warn('resend all cached msg');
                    _this2.msgQueue.forEach(function (msg) {
                        _this2._ws.send(msg);
                    });
                    _this2.msgQueue = [];
                }

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
            this._send(msg);
        }
    }, {
        key: '_send',
        value: function _send(msg) {
            var logger = this.engine.logger;

            if (this.connected) {
                this._ws.send(msg);
            } else {
                logger.warn('signaler closed, msg is cached');
                this.msgQueue.push(msg);
            }
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(0);

var _events2 = _interopRequireDefault(_events);

var _urlToolkit = __webpack_require__(4);

var _urlToolkit2 = _interopRequireDefault(_urlToolkit);

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
            // console.warn(`frag.duration: ${frag.duration}`);
            // 获取ts的正确相对路径 obtain the correct path. Issue: https://github.com/cdnbye/hlsjs-p2p-engine/issues/9
            var urlObj = _urlToolkit2.default.parseURL(frag.url);
            frag.relurl = urlObj.path + urlObj.query;
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
                context.frag.fromPeerId = seg.fromPeerId;
                logger.debug('bufMgr loaded ' + frag.relurl + ' at ' + frag.sn);
                window.setTimeout(function () {
                    //必须是异步回调
                    _this2.fetcher.reportFlow(stats, true);
                    callbacks.onSuccess(response, stats, context);
                }, 50);
                // } else if (this.scheduler.hasIdlePeers && this.scheduler.peersHasSN(frag.sn)) {                             //如果在peers的bitmap中找到
            } else if (this.scheduler.hasAndSetTargetPeer(frag.sn)) {
                //如果在peers的bitmap中找到
                context.frag.loadByP2P = true;
                this.scheduler.load(context, config, callbacks);
                callbacks.onTimeout = function (stats, context) {
                    //如果P2P下载超时则立即切换到xhr下载
                    logger.debug('P2P timeout switched to HTTP load ' + frag.relurl + ' at ' + frag.sn);
                    frag.loadByP2P = false;
                    frag.loadByHTTP = true;
                    _this2.xhrLoader.load(context, config, callbacks);
                };
                var onSuccess = callbacks.onSuccess;
                callbacks.onSuccess = function (response, stats, context) {
                    //在onsucess回调中复制并缓存二进制数据
                    if (!_this2.bufMgr.hasSegOfURL(frag.relurl)) {
                        _this2.bufMgr.copyAndAddBuffer(response.data, frag.relurl, frag.sn, frag.fromPeerId || _this2.fetcher.peerId);
                    }
                    _this2.fetcher.reportFlow(stats, frag.loadByP2P);
                    frag.loaded = stats.loaded;
                    logger.debug((frag.loadByP2P ? 'P2P' : 'HTTP') + ' loaded ' + frag.relurl + ' at ' + frag.sn);
                    onSuccess(response, stats, context);
                };
            } else {
                logger.debug('HTTP load ' + frag.relurl + ' at ' + frag.sn);
                context.frag.loadByHTTP = true;
                this.xhrLoader.load(context, config, callbacks);
                var _onSuccess = callbacks.onSuccess;
                callbacks.onSuccess = function (response, stats, context) {
                    //在onsucess回调中复制并缓存二进制数据
                    if (!_this2.bufMgr.hasSegOfURL(frag.relurl)) {
                        _this2.bufMgr.copyAndAddBuffer(response.data, frag.relurl, frag.sn, _this2.fetcher.peerId);
                    }
                    _this2.fetcher.reportFlow(stats, false);
                    logger.info('HTTP load time ' + (stats.tload - stats.trequest) + 'ms');
                    _this2.scheduler.loadTimeSample = stats.tload - stats.trequest;
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(0);

var _events2 = _interopRequireDefault(_events);

var _core = __webpack_require__(1);

var _toolFuns = __webpack_require__(2);

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
        fromPeerId: string
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
            var fromPeerId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
            //先复制再缓存
            var handledUrl = (0, _toolFuns.handleTSUrl)(url, this.config.tsStrictMatched);
            var payloadBuf = _core.Buffer.from(data);
            var byteLength = payloadBuf.byteLength;
            var targetBuffer = new _core.Buffer(byteLength);
            payloadBuf.copy(targetBuffer);

            var segment = {
                sn: sn,
                relurl: handledUrl,
                data: targetBuffer,
                size: byteLength,
                fromPeerId: fromPeerId
            };

            this.addSeg(segment);
            this.sn2Url.set(sn, handledUrl);
        }
    }, {
        key: 'addBuffer',
        value: function addBuffer(sn, url, buf) {
            var fromPeerId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
            //直接缓存
            var handledUrl = (0, _toolFuns.handleTSUrl)(url, this.config.tsStrictMatched);
            var segment = {
                sn: sn,
                relurl: handledUrl,
                data: buf,
                size: buf.byteLength,
                fromPeerId: fromPeerId
            };
            this.addSeg(segment);
            this.sn2Url.set(sn, handledUrl);
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
                this.emit(_core.Events.BM_LOST, lastSeg.sn);
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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reconnectingWebsocket = __webpack_require__(5);

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
        if (config.logLevel === true) {
            config.logLevel = 'debug';
        } else if (!(config.logLevel in logTypes) || config.logLevel === false) {
            config.logLevel = 'none';
        }
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

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var os = {
    //网络类型 wifi 4g 3g 2g unknown or ''
    getNetType: function getNetType() {
        return (new RegExp('nettype\\/(\\w*)').exec(_getUA()) || [, ''])[1].toLowerCase();
    },
    //获取设备类型
    getPlatform: function getPlatform() {
        if (os.isAndroid()) {
            return 'android';
        } else if (os.isIOS()) {
            return 'iOS';
        } else {
            return 'PC';
        }
    },
    isX5: function isX5() {
        return this.isAndroid() && /\s(TBS|X5Core)\/[\w\.\-]+/i.test(_getUA());
    },
    isPC: function isPC() {
        return !_toNum(_platform('os ')) && !_toNum(_platform('android[/ ]'));
    },
    isIOS: function isIOS() {
        return _toNum(_platform('os '));
    },
    isAndroid: function isAndroid() {
        return _toNum(_platform('android[/ ]'));
    },
    isSafari: function isSafari() {
        return this.isIOS() && /^((?!chrome|android).)*safari/i.test(_getUA());
    }
};

function _getUA() {
    return navigator.userAgent.toLowerCase();
}

function _platform(os) {
    var ver = '' + (new RegExp(os + '(\\d+((\\.|_)\\d+)*)').exec(_getUA()) || [, 0])[1];
    // undefined < 3 === false, but null < 3 === true
    return ver || undefined;
}

function _toNum(str) {
    return parseFloat((str || "").replace(/\_/g, '.')) || 0;
}

module.exports = os;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Hls"] = factory();
	else
		root["Hls"] = factory();
})(this, function() {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return enableLogs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return logger; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__get_self_scope__ = __webpack_require__(3);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };



function noop() {}

var fakeLogger = {
  trace: noop,
  debug: noop,
  log: noop,
  warn: noop,
  info: noop,
  error: noop
};

var exportedLogger = fakeLogger;

// let lastCallTime;
// function formatMsgWithTimeInfo(type, msg) {
//   const now = Date.now();
//   const diff = lastCallTime ? '+' + (now - lastCallTime) : '0';
//   lastCallTime = now;
//   msg = (new Date(now)).toISOString() + ' | [' +  type + '] > ' + msg + ' ( ' + diff + ' ms )';
//   return msg;
// }

function formatMsg(type, msg) {
  msg = '[' + type + '] > ' + msg;
  return msg;
}

var global = Object(__WEBPACK_IMPORTED_MODULE_0__get_self_scope__["a" /* getSelfScope */])();

function consolePrintFn(type) {
  var func = global.console[type];
  if (func) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args[0]) {
        args[0] = formatMsg(type, args[0]);
      }

      func.apply(global.console, args);
    };
  }
  return noop;
}

function exportLoggerFunctions(debugConfig) {
  for (var _len2 = arguments.length, functions = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    functions[_key2 - 1] = arguments[_key2];
  }

  functions.forEach(function (type) {
    exportedLogger[type] = debugConfig[type] ? debugConfig[type].bind(debugConfig) : consolePrintFn(type);
  });
}

var enableLogs = function enableLogs(debugConfig) {
  if (debugConfig === true || (typeof debugConfig === 'undefined' ? 'undefined' : _typeof(debugConfig)) === 'object') {
    exportLoggerFunctions(debugConfig,
    // Remove out from list here to hard-disable a log-level
    // 'trace',
    'debug', 'log', 'info', 'warn', 'error');
    // Some browsers don't allow to use bind on console object anyway
    // fallback to default if needed
    try {
      exportedLogger.log();
    } catch (e) {
      exportedLogger = fakeLogger;
    }
  } else {
    exportedLogger = fakeLogger;
  }
};

var logger = exportedLogger;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * @readonly
 * @enum {string}
 */
var HlsEvents = {
  // fired before MediaSource is attaching to media element - data: { media }
  MEDIA_ATTACHING: 'hlsMediaAttaching',
  // fired when MediaSource has been succesfully attached to media element - data: { }
  MEDIA_ATTACHED: 'hlsMediaAttached',
  // fired before detaching MediaSource from media element - data: { }
  MEDIA_DETACHING: 'hlsMediaDetaching',
  // fired when MediaSource has been detached from media element - data: { }
  MEDIA_DETACHED: 'hlsMediaDetached',
  // fired when we buffer is going to be reset - data: { }
  BUFFER_RESET: 'hlsBufferReset',
  // fired when we know about the codecs that we need buffers for to push into - data: {tracks : { container, codec, levelCodec, initSegment, metadata }}
  BUFFER_CODECS: 'hlsBufferCodecs',
  // fired when sourcebuffers have been created - data: { tracks : tracks }
  BUFFER_CREATED: 'hlsBufferCreated',
  // fired when we append a segment to the buffer - data: { segment: segment object }
  BUFFER_APPENDING: 'hlsBufferAppending',
  // fired when we are done with appending a media segment to the buffer - data : { parent : segment parent that triggered BUFFER_APPENDING, pending : nb of segments waiting for appending for this segment parent}
  BUFFER_APPENDED: 'hlsBufferAppended',
  // fired when the stream is finished and we want to notify the media buffer that there will be no more data - data: { }
  BUFFER_EOS: 'hlsBufferEos',
  // fired when the media buffer should be flushed - data { startOffset, endOffset }
  BUFFER_FLUSHING: 'hlsBufferFlushing',
  // fired when the media buffer has been flushed - data: { }
  BUFFER_FLUSHED: 'hlsBufferFlushed',
  // fired to signal that a manifest loading starts - data: { url : manifestURL}
  MANIFEST_LOADING: 'hlsManifestLoading',
  // fired after manifest has been loaded - data: { levels : [available quality levels], audioTracks : [ available audio tracks], url : manifestURL, stats : { trequest, tfirst, tload, mtime}}
  MANIFEST_LOADED: 'hlsManifestLoaded',
  // fired after manifest has been parsed - data: { levels : [available quality levels], firstLevel : index of first quality level appearing in Manifest}
  MANIFEST_PARSED: 'hlsManifestParsed',
  // fired when a level switch is requested - data: { level : id of new level }
  LEVEL_SWITCHING: 'hlsLevelSwitching',
  // fired when a level switch is effective - data: { level : id of new level }
  LEVEL_SWITCHED: 'hlsLevelSwitched',
  // fired when a level playlist loading starts - data: { url : level URL, level : id of level being loaded}
  LEVEL_LOADING: 'hlsLevelLoading',
  // fired when a level playlist loading finishes - data: { details : levelDetails object, level : id of loaded level, stats : { trequest, tfirst, tload, mtime} }
  LEVEL_LOADED: 'hlsLevelLoaded',
  // fired when a level's details have been updated based on previous details, after it has been loaded - data: { details : levelDetails object, level : id of updated level }
  LEVEL_UPDATED: 'hlsLevelUpdated',
  // fired when a level's PTS information has been updated after parsing a fragment - data: { details : levelDetails object, level : id of updated level, drift: PTS drift observed when parsing last fragment }
  LEVEL_PTS_UPDATED: 'hlsLevelPtsUpdated',
  // fired to notify that audio track lists has been updated - data: { audioTracks : audioTracks }
  AUDIO_TRACKS_UPDATED: 'hlsAudioTracksUpdated',
  // fired when an audio track switching is requested - data: { id : audio track id }
  AUDIO_TRACK_SWITCHING: 'hlsAudioTrackSwitching',
  // fired when an audio track switch actually occurs - data: { id : audio track id }
  AUDIO_TRACK_SWITCHED: 'hlsAudioTrackSwitched',
  // fired when an audio track loading starts - data: { url : audio track URL, id : audio track id }
  AUDIO_TRACK_LOADING: 'hlsAudioTrackLoading',
  // fired when an audio track loading finishes - data: { details : levelDetails object, id : audio track id, stats : { trequest, tfirst, tload, mtime } }
  AUDIO_TRACK_LOADED: 'hlsAudioTrackLoaded',
  // fired to notify that subtitle track lists has been updated - data: { subtitleTracks : subtitleTracks }
  SUBTITLE_TRACKS_UPDATED: 'hlsSubtitleTracksUpdated',
  // fired when an subtitle track switch occurs - data: { id : subtitle track id }
  SUBTITLE_TRACK_SWITCH: 'hlsSubtitleTrackSwitch',
  // fired when a subtitle track loading starts - data: { url : subtitle track URL, id : subtitle track id }
  SUBTITLE_TRACK_LOADING: 'hlsSubtitleTrackLoading',
  // fired when a subtitle track loading finishes - data: { details : levelDetails object, id : subtitle track id, stats : { trequest, tfirst, tload, mtime } }
  SUBTITLE_TRACK_LOADED: 'hlsSubtitleTrackLoaded',
  // fired when a subtitle fragment has been processed - data: { success : boolean, frag : the processed frag }
  SUBTITLE_FRAG_PROCESSED: 'hlsSubtitleFragProcessed',
  // fired when the first timestamp is found - data: { id : demuxer id, initPTS: initPTS, frag : fragment object }
  INIT_PTS_FOUND: 'hlsInitPtsFound',
  // fired when a fragment loading starts - data: { frag : fragment object }
  FRAG_LOADING: 'hlsFragLoading',
  // fired when a fragment loading is progressing - data: { frag : fragment object, { trequest, tfirst, loaded } }
  FRAG_LOAD_PROGRESS: 'hlsFragLoadProgress',
  // Identifier for fragment load aborting for emergency switch down - data: { frag : fragment object }
  FRAG_LOAD_EMERGENCY_ABORTED: 'hlsFragLoadEmergencyAborted',
  // fired when a fragment loading is completed - data: { frag : fragment object, payload : fragment payload, stats : { trequest, tfirst, tload, length } }
  FRAG_LOADED: 'hlsFragLoaded',
  // fired when a fragment has finished decrypting - data: { id : demuxer id, frag: fragment object, payload : fragment payload, stats : { tstart, tdecrypt } }
  FRAG_DECRYPTED: 'hlsFragDecrypted',
  // fired when Init Segment has been extracted from fragment - data: { id : demuxer id, frag: fragment object, moov : moov MP4 box, codecs : codecs found while parsing fragment }
  FRAG_PARSING_INIT_SEGMENT: 'hlsFragParsingInitSegment',
  // fired when parsing sei text is completed - data: { id : demuxer id, frag: fragment object, samples : [ sei samples pes ] }
  FRAG_PARSING_USERDATA: 'hlsFragParsingUserdata',
  // fired when parsing id3 is completed - data: { id : demuxer id, frag: fragment object, samples : [ id3 samples pes ] }
  FRAG_PARSING_METADATA: 'hlsFragParsingMetadata',
  // fired when data have been extracted from fragment - data: { id : demuxer id, frag: fragment object, data1 : moof MP4 box or TS fragments, data2 : mdat MP4 box or null}
  FRAG_PARSING_DATA: 'hlsFragParsingData',
  // fired when fragment parsing is completed - data: { id : demuxer id, frag: fragment object }
  FRAG_PARSED: 'hlsFragParsed',
  // fired when fragment remuxed MP4 boxes have all been appended into SourceBuffer - data: { id : demuxer id, frag : fragment object, stats : { trequest, tfirst, tload, tparsed, tbuffered, length, bwEstimate } }
  FRAG_BUFFERED: 'hlsFragBuffered',
  // fired when fragment matching with current media position is changing - data : { id : demuxer id, frag : fragment object }
  FRAG_CHANGED: 'hlsFragChanged',
  // Identifier for a FPS drop event - data: { curentDropped, currentDecoded, totalDroppedFrames }
  FPS_DROP: 'hlsFpsDrop',
  // triggered when FPS drop triggers auto level capping - data: { level, droppedlevel }
  FPS_DROP_LEVEL_CAPPING: 'hlsFpsDropLevelCapping',
  // Identifier for an error event - data: { type : error type, details : error details, fatal : if true, hls.js cannot/will not try to recover, if false, hls.js will try to recover,other error specific data }
  ERROR: 'hlsError',
  // fired when hls.js instance starts destroying. Different from MEDIA_DETACHED as one could want to detach and reattach a media to the instance of hls.js to handle mid-rolls for example - data: { }
  DESTROYING: 'hlsDestroying',
  // fired when a decrypt key loading starts - data: { frag : fragment object }
  KEY_LOADING: 'hlsKeyLoading',
  // fired when a decrypt key loading is completed - data: { frag : fragment object, payload : key payload, stats : { trequest, tfirst, tload, length } }
  KEY_LOADED: 'hlsKeyLoaded',
  // fired upon stream controller state transitions - data: { previousState, nextState }
  STREAM_STATE_TRANSITION: 'hlsStreamStateTransition'
};

/* harmony default export */ __webpack_exports__["a"] = (HlsEvents);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ErrorTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ErrorDetails; });
var ErrorTypes = {
  // Identifier for a network error (loading error / timeout ...)
  NETWORK_ERROR: 'networkError',
  // Identifier for a media Error (video/parsing/mediasource error)
  MEDIA_ERROR: 'mediaError',
  // EME (encrypted media extensions) errors
  KEY_SYSTEM_ERROR: 'keySystemError',
  // Identifier for a mux Error (demuxing/remuxing)
  MUX_ERROR: 'muxError',
  // Identifier for all other errors
  OTHER_ERROR: 'otherError'
};

/**
 * @enum {ErrorDetails}
 * @typedef {string} ErrorDetail
 */
var ErrorDetails = {
  KEY_SYSTEM_NO_KEYS: 'keySystemNoKeys',
  KEY_SYSTEM_NO_ACCESS: 'keySystemNoAccess',
  KEY_SYSTEM_NO_SESSION: 'keySystemNoSession',
  KEY_SYSTEM_LICENSE_REQUEST_FAILED: 'keySystemLicenseRequestFailed',
  // Identifier for a manifest load error - data: { url : faulty URL, response : { code: error code, text: error text }}
  MANIFEST_LOAD_ERROR: 'manifestLoadError',
  // Identifier for a manifest load timeout - data: { url : faulty URL, response : { code: error code, text: error text }}
  MANIFEST_LOAD_TIMEOUT: 'manifestLoadTimeOut',
  // Identifier for a manifest parsing error - data: { url : faulty URL, reason : error reason}
  MANIFEST_PARSING_ERROR: 'manifestParsingError',
  // Identifier for a manifest with only incompatible codecs error - data: { url : faulty URL, reason : error reason}
  MANIFEST_INCOMPATIBLE_CODECS_ERROR: 'manifestIncompatibleCodecsError',
  // Identifier for a level load error - data: { url : faulty URL, response : { code: error code, text: error text }}
  LEVEL_LOAD_ERROR: 'levelLoadError',
  // Identifier for a level load timeout - data: { url : faulty URL, response : { code: error code, text: error text }}
  LEVEL_LOAD_TIMEOUT: 'levelLoadTimeOut',
  // Identifier for a level switch error - data: { level : faulty level Id, event : error description}
  LEVEL_SWITCH_ERROR: 'levelSwitchError',
  // Identifier for an audio track load error - data: { url : faulty URL, response : { code: error code, text: error text }}
  AUDIO_TRACK_LOAD_ERROR: 'audioTrackLoadError',
  // Identifier for an audio track load timeout - data: { url : faulty URL, response : { code: error code, text: error text }}
  AUDIO_TRACK_LOAD_TIMEOUT: 'audioTrackLoadTimeOut',
  // Identifier for fragment load error - data: { frag : fragment object, response : { code: error code, text: error text }}
  FRAG_LOAD_ERROR: 'fragLoadError',
  // Identifier for fragment load timeout error - data: { frag : fragment object}
  FRAG_LOAD_TIMEOUT: 'fragLoadTimeOut',
  // Identifier for a fragment decryption error event - data: {id : demuxer Id,frag: fragment object, reason : parsing error description }
  FRAG_DECRYPT_ERROR: 'fragDecryptError',
  // Identifier for a fragment parsing error event - data: { id : demuxer Id, reason : parsing error description }
  // will be renamed DEMUX_PARSING_ERROR and switched to MUX_ERROR in the next major release
  FRAG_PARSING_ERROR: 'fragParsingError',
  // Identifier for a remux alloc error event - data: { id : demuxer Id, frag : fragment object, bytes : nb of bytes on which allocation failed , reason : error text }
  REMUX_ALLOC_ERROR: 'remuxAllocError',
  // Identifier for decrypt key load error - data: { frag : fragment object, response : { code: error code, text: error text }}
  KEY_LOAD_ERROR: 'keyLoadError',
  // Identifier for decrypt key load timeout error - data: { frag : fragment object}
  KEY_LOAD_TIMEOUT: 'keyLoadTimeOut',
  // Triggered when an exception occurs while adding a sourceBuffer to MediaSource - data : {  err : exception , mimeType : mimeType }
  BUFFER_ADD_CODEC_ERROR: 'bufferAddCodecError',
  // Identifier for a buffer append error - data: append error description
  BUFFER_APPEND_ERROR: 'bufferAppendError',
  // Identifier for a buffer appending error event - data: appending error description
  BUFFER_APPENDING_ERROR: 'bufferAppendingError',
  // Identifier for a buffer stalled error event
  BUFFER_STALLED_ERROR: 'bufferStalledError',
  // Identifier for a buffer full event
  BUFFER_FULL_ERROR: 'bufferFullError',
  // Identifier for a buffer seek over hole event
  BUFFER_SEEK_OVER_HOLE: 'bufferSeekOverHole',
  // Identifier for a buffer nudge on stall (playback is stuck although currentTime is in a buffered area)
  BUFFER_NUDGE_ON_STALL: 'bufferNudgeOnStall',
  // Identifier for an internal exception happening inside hls.js while handling an event
  INTERNAL_EXCEPTION: 'internalException'
};

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getSelfScope;
function getSelfScope() {
  // see https://stackoverflow.com/a/11237259/589493
  if (typeof window === 'undefined') {
    /* eslint-disable-next-line no-undef */
    return self;
  } else {
    return window;
  }
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// see https://tools.ietf.org/html/rfc1808

/* jshint ignore:start */
(function(root) { 
/* jshint ignore:end */

  var URL_REGEX = /^((?:[a-zA-Z0-9+\-.]+:)?)(\/\/[^\/\;?#]*)?(.*?)??(;.*?)?(\?.*?)?(#.*?)?$/;
  var FIRST_SEGMENT_REGEX = /^([^\/;?#]*)(.*)$/;
  var SLASH_DOT_REGEX = /(?:\/|^)\.(?=\/)/g;
  var SLASH_DOT_DOT_REGEX = /(?:\/|^)\.\.\/(?!\.\.\/).*?(?=\/)/g;

  var URLToolkit = { // jshint ignore:line
    // If opts.alwaysNormalize is true then the path will always be normalized even when it starts with / or //
    // E.g
    // With opts.alwaysNormalize = false (default, spec compliant)
    // http://a.com/b/cd + /e/f/../g => http://a.com/e/f/../g
    // With opts.alwaysNormalize = true (not spec compliant)
    // http://a.com/b/cd + /e/f/../g => http://a.com/e/g
    buildAbsoluteURL: function(baseURL, relativeURL, opts) {
      opts = opts || {};
      // remove any remaining space and CRLF
      baseURL = baseURL.trim();
      relativeURL = relativeURL.trim();
      if (!relativeURL) {
        // 2a) If the embedded URL is entirely empty, it inherits the
        // entire base URL (i.e., is set equal to the base URL)
        // and we are done.
        if (!opts.alwaysNormalize) {
          return baseURL;
        }
        var basePartsForNormalise = this.parseURL(baseURL);
        if (!baseParts) {
          throw new Error('Error trying to parse base URL.');
        }
        basePartsForNormalise.path = URLToolkit.normalizePath(basePartsForNormalise.path);
        return URLToolkit.buildURLFromParts(basePartsForNormalise);
      }
      var relativeParts = this.parseURL(relativeURL);
      if (!relativeParts) {
        throw new Error('Error trying to parse relative URL.');
      }
      if (relativeParts.scheme) {
        // 2b) If the embedded URL starts with a scheme name, it is
        // interpreted as an absolute URL and we are done.
        if (!opts.alwaysNormalize) {
          return relativeURL;
        }
        relativeParts.path = URLToolkit.normalizePath(relativeParts.path);
        return URLToolkit.buildURLFromParts(relativeParts);
      }
      var baseParts = this.parseURL(baseURL);
      if (!baseParts) {
        throw new Error('Error trying to parse base URL.');
      }
      if (!baseParts.netLoc && baseParts.path && baseParts.path[0] !== '/') {
        // If netLoc missing and path doesn't start with '/', assume everthing before the first '/' is the netLoc
        // This causes 'example.com/a' to be handled as '//example.com/a' instead of '/example.com/a'
        var pathParts = FIRST_SEGMENT_REGEX.exec(baseParts.path);
        baseParts.netLoc = pathParts[1];
        baseParts.path = pathParts[2];
      }
      if (baseParts.netLoc && !baseParts.path) {
        baseParts.path = '/';
      }
      var builtParts = {
        // 2c) Otherwise, the embedded URL inherits the scheme of
        // the base URL.
        scheme: baseParts.scheme,
        netLoc: relativeParts.netLoc,
        path: null,
        params: relativeParts.params,
        query: relativeParts.query,
        fragment: relativeParts.fragment
      };
      if (!relativeParts.netLoc) {
        // 3) If the embedded URL's <net_loc> is non-empty, we skip to
        // Step 7.  Otherwise, the embedded URL inherits the <net_loc>
        // (if any) of the base URL.
        builtParts.netLoc = baseParts.netLoc;
        // 4) If the embedded URL path is preceded by a slash "/", the
        // path is not relative and we skip to Step 7.
        if (relativeParts.path[0] !== '/') {
          if (!relativeParts.path) {
            // 5) If the embedded URL path is empty (and not preceded by a
            // slash), then the embedded URL inherits the base URL path
            builtParts.path = baseParts.path;
            // 5a) if the embedded URL's <params> is non-empty, we skip to
            // step 7; otherwise, it inherits the <params> of the base
            // URL (if any) and
            if (!relativeParts.params) {
              builtParts.params = baseParts.params;
              // 5b) if the embedded URL's <query> is non-empty, we skip to
              // step 7; otherwise, it inherits the <query> of the base
              // URL (if any) and we skip to step 7.
              if (!relativeParts.query) {
                builtParts.query = baseParts.query;
              }
            }
          } else {
            // 6) The last segment of the base URL's path (anything
            // following the rightmost slash "/", or the entire path if no
            // slash is present) is removed and the embedded URL's path is
            // appended in its place.
            var baseURLPath = baseParts.path;
            var newPath = baseURLPath.substring(0, baseURLPath.lastIndexOf('/') + 1) + relativeParts.path;
            builtParts.path = URLToolkit.normalizePath(newPath);
          }
        }
      }
      if (builtParts.path === null) {
        builtParts.path = opts.alwaysNormalize ? URLToolkit.normalizePath(relativeParts.path) : relativeParts.path;
      }
      return URLToolkit.buildURLFromParts(builtParts);
    },
    parseURL: function(url) {
      var parts = URL_REGEX.exec(url);
      if (!parts) {
        return null;
      }
      return {
        scheme: parts[1] || '',
        netLoc: parts[2] || '',
        path: parts[3] || '',
        params: parts[4] || '',
        query: parts[5] || '',
        fragment: parts[6] || ''
      };
    },
    normalizePath: function(path) {
      // The following operations are
      // then applied, in order, to the new path:
      // 6a) All occurrences of "./", where "." is a complete path
      // segment, are removed.
      // 6b) If the path ends with "." as a complete path segment,
      // that "." is removed.
      path = path.split('').reverse().join('').replace(SLASH_DOT_REGEX, '');
      // 6c) All occurrences of "<segment>/../", where <segment> is a
      // complete path segment not equal to "..", are removed.
      // Removal of these path segments is performed iteratively,
      // removing the leftmost matching pattern on each iteration,
      // until no matching pattern remains.
      // 6d) If the path ends with "<segment>/..", where <segment> is a
      // complete path segment not equal to "..", that
      // "<segment>/.." is removed.
      while (path.length !== (path = path.replace(SLASH_DOT_DOT_REGEX, '')).length) {} // jshint ignore:line
      return path.split('').reverse().join('');
    },
    buildURLFromParts: function(parts) {
      return parts.scheme + parts.netLoc + parts.path + parts.params + parts.query + parts.fragment;
    }
  };

/* jshint ignore:start */
  if(true)
    module.exports = URLToolkit;
  else if(typeof define === 'function' && define.amd)
    define([], function() { return URLToolkit; });
  else if(typeof exports === 'object')
    exports["URLToolkit"] = URLToolkit;
  else
    root["URLToolkit"] = URLToolkit;
})(this);
/* jshint ignore:end */


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return utf8ArrayToStr; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ID3 parser
 */
var ID3 = function () {
  function ID3() {
    _classCallCheck(this, ID3);
  }

  /**
   * Returns true if an ID3 header can be found at offset in data
   * @param {Uint8Array} data - The data to search in
   * @param {number} offset - The offset at which to start searching
   * @return {boolean} - True if an ID3 header is found
   */
  ID3.isHeader = function isHeader(data, offset) {
    /*
    * http://id3.org/id3v2.3.0
    * [0]     = 'I'
    * [1]     = 'D'
    * [2]     = '3'
    * [3,4]   = {Version}
    * [5]     = {Flags}
    * [6-9]   = {ID3 Size}
    *
    * An ID3v2 tag can be detected with the following pattern:
    *  $49 44 33 yy yy xx zz zz zz zz
    * Where yy is less than $FF, xx is the 'flags' byte and zz is less than $80
    */
    if (offset + 10 <= data.length) {
      // look for 'ID3' identifier
      if (data[offset] === 0x49 && data[offset + 1] === 0x44 && data[offset + 2] === 0x33) {
        // check version is within range
        if (data[offset + 3] < 0xFF && data[offset + 4] < 0xFF) {
          // check size is within range
          if (data[offset + 6] < 0x80 && data[offset + 7] < 0x80 && data[offset + 8] < 0x80 && data[offset + 9] < 0x80) {
            return true;
          }
        }
      }
    }

    return false;
  };

  /**
   * Returns true if an ID3 footer can be found at offset in data
   * @param {Uint8Array} data - The data to search in
   * @param {number} offset - The offset at which to start searching
   * @return {boolean} - True if an ID3 footer is found
   */


  ID3.isFooter = function isFooter(data, offset) {
    /*
    * The footer is a copy of the header, but with a different identifier
    */
    if (offset + 10 <= data.length) {
      // look for '3DI' identifier
      if (data[offset] === 0x33 && data[offset + 1] === 0x44 && data[offset + 2] === 0x49) {
        // check version is within range
        if (data[offset + 3] < 0xFF && data[offset + 4] < 0xFF) {
          // check size is within range
          if (data[offset + 6] < 0x80 && data[offset + 7] < 0x80 && data[offset + 8] < 0x80 && data[offset + 9] < 0x80) {
            return true;
          }
        }
      }
    }

    return false;
  };

  /**
   * Returns any adjacent ID3 tags found in data starting at offset, as one block of data
   * @param {Uint8Array} data - The data to search in
   * @param {number} offset - The offset at which to start searching
   * @return {Uint8Array} - The block of data containing any ID3 tags found
   */


  ID3.getID3Data = function getID3Data(data, offset) {
    var front = offset;
    var length = 0;

    while (ID3.isHeader(data, offset)) {
      // ID3 header is 10 bytes
      length += 10;

      var size = ID3._readSize(data, offset + 6);
      length += size;

      if (ID3.isFooter(data, offset + 10)) {
        // ID3 footer is 10 bytes
        length += 10;
      }

      offset += length;
    }

    if (length > 0) {
      return data.subarray(front, front + length);
    }

    return undefined;
  };

  ID3._readSize = function _readSize(data, offset) {
    var size = 0;
    size = (data[offset] & 0x7f) << 21;
    size |= (data[offset + 1] & 0x7f) << 14;
    size |= (data[offset + 2] & 0x7f) << 7;
    size |= data[offset + 3] & 0x7f;
    return size;
  };

  /**
   * Searches for the Elementary Stream timestamp found in the ID3 data chunk
   * @param {Uint8Array} data - Block of data containing one or more ID3 tags
   * @return {number} - The timestamp
   */


  ID3.getTimeStamp = function getTimeStamp(data) {
    var frames = ID3.getID3Frames(data);
    for (var i = 0; i < frames.length; i++) {
      var frame = frames[i];
      if (ID3.isTimeStampFrame(frame)) {
        return ID3._readTimeStamp(frame);
      }
    }

    return undefined;
  };

  /**
   * Returns true if the ID3 frame is an Elementary Stream timestamp frame
   * @param {ID3 frame} frame
   */


  ID3.isTimeStampFrame = function isTimeStampFrame(frame) {
    return frame && frame.key === 'PRIV' && frame.info === 'com.apple.streaming.transportStreamTimestamp';
  };

  ID3._getFrameData = function _getFrameData(data) {
    /*
    Frame ID       $xx xx xx xx (four characters)
    Size           $xx xx xx xx
    Flags          $xx xx
    */
    var type = String.fromCharCode(data[0], data[1], data[2], data[3]);
    var size = ID3._readSize(data, 4);

    // skip frame id, size, and flags
    var offset = 10;

    return { type: type, size: size, data: data.subarray(offset, offset + size) };
  };

  /**
   * Returns an array of ID3 frames found in all the ID3 tags in the id3Data
   * @param {Uint8Array} id3Data - The ID3 data containing one or more ID3 tags
   * @return {ID3 frame[]} - Array of ID3 frame objects
   */


  ID3.getID3Frames = function getID3Frames(id3Data) {
    var offset = 0;
    var frames = [];

    while (ID3.isHeader(id3Data, offset)) {
      var size = ID3._readSize(id3Data, offset + 6);
      // skip past ID3 header
      offset += 10;
      var end = offset + size;
      // loop through frames in the ID3 tag
      while (offset + 8 < end) {
        var frameData = ID3._getFrameData(id3Data.subarray(offset));
        var frame = ID3._decodeFrame(frameData);
        if (frame) {
          frames.push(frame);
        }

        // skip frame header and frame data
        offset += frameData.size + 10;
      }

      if (ID3.isFooter(id3Data, offset)) {
        offset += 10;
      }
    }

    return frames;
  };

  ID3._decodeFrame = function _decodeFrame(frame) {
    if (frame.type === 'PRIV') {
      return ID3._decodePrivFrame(frame);
    } else if (frame.type[0] === 'T') {
      return ID3._decodeTextFrame(frame);
    } else if (frame.type[0] === 'W') {
      return ID3._decodeURLFrame(frame);
    }

    return undefined;
  };

  ID3._readTimeStamp = function _readTimeStamp(timeStampFrame) {
    if (timeStampFrame.data.byteLength === 8) {
      var data = new Uint8Array(timeStampFrame.data);
      // timestamp is 33 bit expressed as a big-endian eight-octet number,
      // with the upper 31 bits set to zero.
      var pts33Bit = data[3] & 0x1;
      var timestamp = (data[4] << 23) + (data[5] << 15) + (data[6] << 7) + data[7];
      timestamp /= 45;

      if (pts33Bit) {
        timestamp += 47721858.84;
      } // 2^32 / 90

      return Math.round(timestamp);
    }

    return undefined;
  };

  ID3._decodePrivFrame = function _decodePrivFrame(frame) {
    /*
    Format: <text string>\0<binary data>
    */
    if (frame.size < 2) {
      return undefined;
    }

    var owner = ID3._utf8ArrayToStr(frame.data, true);
    var privateData = new Uint8Array(frame.data.subarray(owner.length + 1));

    return { key: frame.type, info: owner, data: privateData.buffer };
  };

  ID3._decodeTextFrame = function _decodeTextFrame(frame) {
    if (frame.size < 2) {
      return undefined;
    }

    if (frame.type === 'TXXX') {
      /*
      Format:
      [0]   = {Text Encoding}
      [1-?] = {Description}\0{Value}
      */
      var index = 1;
      var description = ID3._utf8ArrayToStr(frame.data.subarray(index));

      index += description.length + 1;
      var value = ID3._utf8ArrayToStr(frame.data.subarray(index));

      return { key: frame.type, info: description, data: value };
    } else {
      /*
      Format:
      [0]   = {Text Encoding}
      [1-?] = {Value}
      */
      var text = ID3._utf8ArrayToStr(frame.data.subarray(1));
      return { key: frame.type, data: text };
    }
  };

  ID3._decodeURLFrame = function _decodeURLFrame(frame) {
    if (frame.type === 'WXXX') {
      /*
      Format:
      [0]   = {Text Encoding}
      [1-?] = {Description}\0{URL}
      */
      if (frame.size < 2) {
        return undefined;
      }

      var index = 1;
      var description = ID3._utf8ArrayToStr(frame.data.subarray(index));

      index += description.length + 1;
      var value = ID3._utf8ArrayToStr(frame.data.subarray(index));

      return { key: frame.type, info: description, data: value };
    } else {
      /*
      Format:
      [0-?] = {URL}
      */
      var url = ID3._utf8ArrayToStr(frame.data);
      return { key: frame.type, data: url };
    }
  };

  // http://stackoverflow.com/questions/8936984/uint8array-to-string-in-javascript/22373197
  // http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt
  /* utf.js - UTF-8 <=> UTF-16 convertion
   *
   * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
   * Version: 1.0
   * LastModified: Dec 25 1999
   * This library is free.  You can redistribute it and/or modify it.
   */


  ID3._utf8ArrayToStr = function _utf8ArrayToStr(array) {
    var exitOnNull = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var len = array.length;
    var c = void 0;
    var char2 = void 0;
    var char3 = void 0;
    var out = '';
    var i = 0;
    while (i < len) {
      c = array[i++];
      if (c === 0x00 && exitOnNull) {
        return out;
      } else if (c === 0x00 || c === 0x03) {
        // If the character is 3 (END_OF_TEXT) or 0 (NULL) then skip it
        continue;
      }
      switch (c >> 4) {
        case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:
          // 0xxxxxxx
          out += String.fromCharCode(c);
          break;
        case 12:case 13:
          // 110x xxxx   10xx xxxx
          char2 = array[i++];
          out += String.fromCharCode((c & 0x1F) << 6 | char2 & 0x3F);
          break;
        case 14:
          // 1110 xxxx  10xx xxxx  10xx xxxx
          char2 = array[i++];
          char3 = array[i++];
          out += String.fromCharCode((c & 0x0F) << 12 | (char2 & 0x3F) << 6 | (char3 & 0x3F) << 0);
          break;
        default:
      }
    }
    return out;
  };

  return ID3;
}();

var utf8ArrayToStr = ID3._utf8ArrayToStr;

/* harmony default export */ __webpack_exports__["a"] = (ID3);



/***/ }),
/* 6 */
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
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./src/crypt/aes-crypto.js
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AESCrypto = function () {
  function AESCrypto(subtle, iv) {
    _classCallCheck(this, AESCrypto);

    this.subtle = subtle;
    this.aesIV = iv;
  }

  AESCrypto.prototype.decrypt = function decrypt(data, key) {
    return this.subtle.decrypt({ name: 'AES-CBC', iv: this.aesIV }, key, data);
  };

  return AESCrypto;
}();

/* harmony default export */ var aes_crypto = (AESCrypto);
// CONCATENATED MODULE: ./src/crypt/fast-aes-key.js
function fast_aes_key__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FastAESKey = function () {
  function FastAESKey(subtle, key) {
    fast_aes_key__classCallCheck(this, FastAESKey);

    this.subtle = subtle;
    this.key = key;
  }

  FastAESKey.prototype.expandKey = function expandKey() {
    return this.subtle.importKey('raw', this.key, { name: 'AES-CBC' }, false, ['encrypt', 'decrypt']);
  };

  return FastAESKey;
}();

/* harmony default export */ var fast_aes_key = (FastAESKey);
// CONCATENATED MODULE: ./src/crypt/aes-decryptor.js
function aes_decryptor__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// PKCS7
function removePadding(buffer) {
  var outputBytes = buffer.byteLength;
  var paddingBytes = outputBytes && new DataView(buffer).getUint8(outputBytes - 1);
  if (paddingBytes) {
    return buffer.slice(0, outputBytes - paddingBytes);
  } else {
    return buffer;
  }
}

var AESDecryptor = function () {
  function AESDecryptor() {
    aes_decryptor__classCallCheck(this, AESDecryptor);

    // Static after running initTable
    this.rcon = [0x0, 0x1, 0x2, 0x4, 0x8, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];
    this.subMix = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)];
    this.invSubMix = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)];
    this.sBox = new Uint32Array(256);
    this.invSBox = new Uint32Array(256);

    // Changes during runtime
    this.key = new Uint32Array(0);

    this.initTable();
  }

  // Using view.getUint32() also swaps the byte order.


  AESDecryptor.prototype.uint8ArrayToUint32Array_ = function uint8ArrayToUint32Array_(arrayBuffer) {
    var view = new DataView(arrayBuffer);
    var newArray = new Uint32Array(4);
    for (var i = 0; i < 4; i++) {
      newArray[i] = view.getUint32(i * 4);
    }

    return newArray;
  };

  AESDecryptor.prototype.initTable = function initTable() {
    var sBox = this.sBox;
    var invSBox = this.invSBox;
    var subMix = this.subMix;
    var subMix0 = subMix[0];
    var subMix1 = subMix[1];
    var subMix2 = subMix[2];
    var subMix3 = subMix[3];
    var invSubMix = this.invSubMix;
    var invSubMix0 = invSubMix[0];
    var invSubMix1 = invSubMix[1];
    var invSubMix2 = invSubMix[2];
    var invSubMix3 = invSubMix[3];

    var d = new Uint32Array(256);
    var x = 0;
    var xi = 0;
    var i = 0;
    for (i = 0; i < 256; i++) {
      if (i < 128) {
        d[i] = i << 1;
      } else {
        d[i] = i << 1 ^ 0x11b;
      }
    }

    for (i = 0; i < 256; i++) {
      var sx = xi ^ xi << 1 ^ xi << 2 ^ xi << 3 ^ xi << 4;
      sx = sx >>> 8 ^ sx & 0xff ^ 0x63;
      sBox[x] = sx;
      invSBox[sx] = x;

      // Compute multiplication
      var x2 = d[x];
      var x4 = d[x2];
      var x8 = d[x4];

      // Compute sub/invSub bytes, mix columns tables
      var t = d[sx] * 0x101 ^ sx * 0x1010100;
      subMix0[x] = t << 24 | t >>> 8;
      subMix1[x] = t << 16 | t >>> 16;
      subMix2[x] = t << 8 | t >>> 24;
      subMix3[x] = t;

      // Compute inv sub bytes, inv mix columns tables
      t = x8 * 0x1010101 ^ x4 * 0x10001 ^ x2 * 0x101 ^ x * 0x1010100;
      invSubMix0[sx] = t << 24 | t >>> 8;
      invSubMix1[sx] = t << 16 | t >>> 16;
      invSubMix2[sx] = t << 8 | t >>> 24;
      invSubMix3[sx] = t;

      // Compute next counter
      if (!x) {
        x = xi = 1;
      } else {
        x = x2 ^ d[d[d[x8 ^ x2]]];
        xi ^= d[d[xi]];
      }
    }
  };

  AESDecryptor.prototype.expandKey = function expandKey(keyBuffer) {
    // convert keyBuffer to Uint32Array
    var key = this.uint8ArrayToUint32Array_(keyBuffer);
    var sameKey = true;
    var offset = 0;

    while (offset < key.length && sameKey) {
      sameKey = key[offset] === this.key[offset];
      offset++;
    }

    if (sameKey) {
      return;
    }

    this.key = key;
    var keySize = this.keySize = key.length;

    if (keySize !== 4 && keySize !== 6 && keySize !== 8) {
      throw new Error('Invalid aes key size=' + keySize);
    }

    var ksRows = this.ksRows = (keySize + 6 + 1) * 4;
    var ksRow = void 0;
    var invKsRow = void 0;

    var keySchedule = this.keySchedule = new Uint32Array(ksRows);
    var invKeySchedule = this.invKeySchedule = new Uint32Array(ksRows);
    var sbox = this.sBox;
    var rcon = this.rcon;

    var invSubMix = this.invSubMix;
    var invSubMix0 = invSubMix[0];
    var invSubMix1 = invSubMix[1];
    var invSubMix2 = invSubMix[2];
    var invSubMix3 = invSubMix[3];

    var prev = void 0;
    var t = void 0;

    for (ksRow = 0; ksRow < ksRows; ksRow++) {
      if (ksRow < keySize) {
        prev = keySchedule[ksRow] = key[ksRow];
        continue;
      }
      t = prev;

      if (ksRow % keySize === 0) {
        // Rot word
        t = t << 8 | t >>> 24;

        // Sub word
        t = sbox[t >>> 24] << 24 | sbox[t >>> 16 & 0xff] << 16 | sbox[t >>> 8 & 0xff] << 8 | sbox[t & 0xff];

        // Mix Rcon
        t ^= rcon[ksRow / keySize | 0] << 24;
      } else if (keySize > 6 && ksRow % keySize === 4) {
        // Sub word
        t = sbox[t >>> 24] << 24 | sbox[t >>> 16 & 0xff] << 16 | sbox[t >>> 8 & 0xff] << 8 | sbox[t & 0xff];
      }

      keySchedule[ksRow] = prev = (keySchedule[ksRow - keySize] ^ t) >>> 0;
    }

    for (invKsRow = 0; invKsRow < ksRows; invKsRow++) {
      ksRow = ksRows - invKsRow;
      if (invKsRow & 3) {
        t = keySchedule[ksRow];
      } else {
        t = keySchedule[ksRow - 4];
      }

      if (invKsRow < 4 || ksRow <= 4) {
        invKeySchedule[invKsRow] = t;
      } else {
        invKeySchedule[invKsRow] = invSubMix0[sbox[t >>> 24]] ^ invSubMix1[sbox[t >>> 16 & 0xff]] ^ invSubMix2[sbox[t >>> 8 & 0xff]] ^ invSubMix3[sbox[t & 0xff]];
      }

      invKeySchedule[invKsRow] = invKeySchedule[invKsRow] >>> 0;
    }
  };

  // Adding this as a method greatly improves performance.


  AESDecryptor.prototype.networkToHostOrderSwap = function networkToHostOrderSwap(word) {
    return word << 24 | (word & 0xff00) << 8 | (word & 0xff0000) >> 8 | word >>> 24;
  };

  AESDecryptor.prototype.decrypt = function decrypt(inputArrayBuffer, offset, aesIV, removePKCS7Padding) {
    var nRounds = this.keySize + 6;
    var invKeySchedule = this.invKeySchedule;
    var invSBOX = this.invSBox;

    var invSubMix = this.invSubMix;
    var invSubMix0 = invSubMix[0];
    var invSubMix1 = invSubMix[1];
    var invSubMix2 = invSubMix[2];
    var invSubMix3 = invSubMix[3];

    var initVector = this.uint8ArrayToUint32Array_(aesIV);
    var initVector0 = initVector[0];
    var initVector1 = initVector[1];
    var initVector2 = initVector[2];
    var initVector3 = initVector[3];

    var inputInt32 = new Int32Array(inputArrayBuffer);
    var outputInt32 = new Int32Array(inputInt32.length);

    var t0 = void 0,
        t1 = void 0,
        t2 = void 0,
        t3 = void 0;
    var s0 = void 0,
        s1 = void 0,
        s2 = void 0,
        s3 = void 0;
    var inputWords0 = void 0,
        inputWords1 = void 0,
        inputWords2 = void 0,
        inputWords3 = void 0;

    var ksRow = void 0,
        i = void 0;
    var swapWord = this.networkToHostOrderSwap;

    while (offset < inputInt32.length) {
      inputWords0 = swapWord(inputInt32[offset]);
      inputWords1 = swapWord(inputInt32[offset + 1]);
      inputWords2 = swapWord(inputInt32[offset + 2]);
      inputWords3 = swapWord(inputInt32[offset + 3]);

      s0 = inputWords0 ^ invKeySchedule[0];
      s1 = inputWords3 ^ invKeySchedule[1];
      s2 = inputWords2 ^ invKeySchedule[2];
      s3 = inputWords1 ^ invKeySchedule[3];

      ksRow = 4;

      // Iterate through the rounds of decryption
      for (i = 1; i < nRounds; i++) {
        t0 = invSubMix0[s0 >>> 24] ^ invSubMix1[s1 >> 16 & 0xff] ^ invSubMix2[s2 >> 8 & 0xff] ^ invSubMix3[s3 & 0xff] ^ invKeySchedule[ksRow];
        t1 = invSubMix0[s1 >>> 24] ^ invSubMix1[s2 >> 16 & 0xff] ^ invSubMix2[s3 >> 8 & 0xff] ^ invSubMix3[s0 & 0xff] ^ invKeySchedule[ksRow + 1];
        t2 = invSubMix0[s2 >>> 24] ^ invSubMix1[s3 >> 16 & 0xff] ^ invSubMix2[s0 >> 8 & 0xff] ^ invSubMix3[s1 & 0xff] ^ invKeySchedule[ksRow + 2];
        t3 = invSubMix0[s3 >>> 24] ^ invSubMix1[s0 >> 16 & 0xff] ^ invSubMix2[s1 >> 8 & 0xff] ^ invSubMix3[s2 & 0xff] ^ invKeySchedule[ksRow + 3];
        // Update state
        s0 = t0;
        s1 = t1;
        s2 = t2;
        s3 = t3;

        ksRow = ksRow + 4;
      }

      // Shift rows, sub bytes, add round key
      t0 = invSBOX[s0 >>> 24] << 24 ^ invSBOX[s1 >> 16 & 0xff] << 16 ^ invSBOX[s2 >> 8 & 0xff] << 8 ^ invSBOX[s3 & 0xff] ^ invKeySchedule[ksRow];
      t1 = invSBOX[s1 >>> 24] << 24 ^ invSBOX[s2 >> 16 & 0xff] << 16 ^ invSBOX[s3 >> 8 & 0xff] << 8 ^ invSBOX[s0 & 0xff] ^ invKeySchedule[ksRow + 1];
      t2 = invSBOX[s2 >>> 24] << 24 ^ invSBOX[s3 >> 16 & 0xff] << 16 ^ invSBOX[s0 >> 8 & 0xff] << 8 ^ invSBOX[s1 & 0xff] ^ invKeySchedule[ksRow + 2];
      t3 = invSBOX[s3 >>> 24] << 24 ^ invSBOX[s0 >> 16 & 0xff] << 16 ^ invSBOX[s1 >> 8 & 0xff] << 8 ^ invSBOX[s2 & 0xff] ^ invKeySchedule[ksRow + 3];
      ksRow = ksRow + 3;

      // Write
      outputInt32[offset] = swapWord(t0 ^ initVector0);
      outputInt32[offset + 1] = swapWord(t3 ^ initVector1);
      outputInt32[offset + 2] = swapWord(t2 ^ initVector2);
      outputInt32[offset + 3] = swapWord(t1 ^ initVector3);

      // reset initVector to last 4 unsigned int
      initVector0 = inputWords0;
      initVector1 = inputWords1;
      initVector2 = inputWords2;
      initVector3 = inputWords3;

      offset = offset + 4;
    }

    return removePKCS7Padding ? removePadding(outputInt32.buffer) : outputInt32.buffer;
  };

  AESDecryptor.prototype.destroy = function destroy() {
    this.key = undefined;
    this.keySize = undefined;
    this.ksRows = undefined;

    this.sBox = undefined;
    this.invSBox = undefined;
    this.subMix = undefined;
    this.invSubMix = undefined;
    this.keySchedule = undefined;
    this.invKeySchedule = undefined;

    this.rcon = undefined;
  };

  return AESDecryptor;
}();

/* harmony default export */ var aes_decryptor = (AESDecryptor);
// EXTERNAL MODULE: ./src/errors.js
var errors = __webpack_require__(2);

// EXTERNAL MODULE: ./src/utils/logger.js
var logger = __webpack_require__(0);

// EXTERNAL MODULE: ./src/events.js
var events = __webpack_require__(1);

// EXTERNAL MODULE: ./src/utils/get-self-scope.js
var get_self_scope = __webpack_require__(3);

// CONCATENATED MODULE: ./src/crypt/decrypter.js
function decrypter__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }












// see https://stackoverflow.com/a/11237259/589493
var global = Object(get_self_scope["a" /* getSelfScope */])(); // safeguard for code that might run both on worker and main thread

var decrypter_Decrypter = function () {
  function Decrypter(observer, config) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$removePKCS7Paddi = _ref.removePKCS7Padding,
        removePKCS7Padding = _ref$removePKCS7Paddi === undefined ? true : _ref$removePKCS7Paddi;

    decrypter__classCallCheck(this, Decrypter);

    this.logEnabled = true;
    this.observer = observer;
    this.config = config;
    this.removePKCS7Padding = removePKCS7Padding;
    // built in decryptor expects PKCS7 padding
    if (removePKCS7Padding) {
      try {
        var browserCrypto = global.crypto;
        if (browserCrypto) {
          this.subtle = browserCrypto.subtle || browserCrypto.webkitSubtle;
        }
      } catch (e) {}
    }
    this.disableWebCrypto = !this.subtle;
  }

  Decrypter.prototype.isSync = function isSync() {
    return this.disableWebCrypto && this.config.enableSoftwareAES;
  };

  Decrypter.prototype.decrypt = function decrypt(data, key, iv, callback) {
    var _this = this;

    if (this.disableWebCrypto && this.config.enableSoftwareAES) {
      if (this.logEnabled) {
        logger["b" /* logger */].log('JS AES decrypt');
        this.logEnabled = false;
      }
      var decryptor = this.decryptor;
      if (!decryptor) {
        this.decryptor = decryptor = new aes_decryptor();
      }

      decryptor.expandKey(key);
      callback(decryptor.decrypt(data, 0, iv, this.removePKCS7Padding));
    } else {
      if (this.logEnabled) {
        logger["b" /* logger */].log('WebCrypto AES decrypt');
        this.logEnabled = false;
      }
      var subtle = this.subtle;
      if (this.key !== key) {
        this.key = key;
        this.fastAesKey = new fast_aes_key(subtle, key);
      }

      this.fastAesKey.expandKey().then(function (aesKey) {
        // decrypt using web crypto
        var crypto = new aes_crypto(subtle, iv);
        crypto.decrypt(data, aesKey).catch(function (err) {
          _this.onWebCryptoError(err, data, key, iv, callback);
        }).then(function (result) {
          callback(result);
        });
      }).catch(function (err) {
        _this.onWebCryptoError(err, data, key, iv, callback);
      });
    }
  };

  Decrypter.prototype.onWebCryptoError = function onWebCryptoError(err, data, key, iv, callback) {
    if (this.config.enableSoftwareAES) {
      logger["b" /* logger */].log('WebCrypto Error, disable WebCrypto API');
      this.disableWebCrypto = true;
      this.logEnabled = true;
      this.decrypt(data, key, iv, callback);
    } else {
      logger["b" /* logger */].error('decrypting error : ' + err.message);
      this.observer.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].MEDIA_ERROR, details: errors["a" /* ErrorDetails */].FRAG_DECRYPT_ERROR, fatal: true, reason: err.message });
    }
  };

  Decrypter.prototype.destroy = function destroy() {
    var decryptor = this.decryptor;
    if (decryptor) {
      decryptor.destroy();
      this.decryptor = undefined;
    }
  };

  return Decrypter;
}();

/* harmony default export */ var decrypter = __webpack_exports__["a"] = (decrypter_Decrypter);

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_logger__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__events__ = __webpack_require__(1);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * MP4 demuxer
 */



var UINT32_MAX = Math.pow(2, 32) - 1;

var MP4Demuxer = function () {
  function MP4Demuxer(observer, remuxer) {
    _classCallCheck(this, MP4Demuxer);

    this.observer = observer;
    this.remuxer = remuxer;
  }

  MP4Demuxer.prototype.resetTimeStamp = function resetTimeStamp(initPTS) {
    this.initPTS = initPTS;
  };

  MP4Demuxer.prototype.resetInitSegment = function resetInitSegment(initSegment, audioCodec, videoCodec, duration) {
    // jshint unused:false
    if (initSegment && initSegment.byteLength) {
      var initData = this.initData = MP4Demuxer.parseInitSegment(initSegment);

      // default audio codec if nothing specified
      // TODO : extract that from initsegment
      if (audioCodec == null) {
        audioCodec = 'mp4a.40.5';
      }

      if (videoCodec == null) {
        videoCodec = 'avc1.42e01e';
      }

      var tracks = {};
      if (initData.audio && initData.video) {
        tracks.audiovideo = { container: 'video/mp4', codec: audioCodec + ',' + videoCodec, initSegment: duration ? initSegment : null };
      } else {
        if (initData.audio) {
          tracks.audio = { container: 'audio/mp4', codec: audioCodec, initSegment: duration ? initSegment : null };
        }

        if (initData.video) {
          tracks.video = { container: 'video/mp4', codec: videoCodec, initSegment: duration ? initSegment : null };
        }
      }
      this.observer.trigger(__WEBPACK_IMPORTED_MODULE_1__events__["a" /* default */].FRAG_PARSING_INIT_SEGMENT, { tracks: tracks });
    } else {
      if (audioCodec) {
        this.audioCodec = audioCodec;
      }

      if (videoCodec) {
        this.videoCodec = videoCodec;
      }
    }
  };

  MP4Demuxer.probe = function probe(data) {
    // ensure we find a moof box in the first 16 kB
    return MP4Demuxer.findBox({ data: data, start: 0, end: Math.min(data.length, 16384) }, ['moof']).length > 0;
  };

  MP4Demuxer.bin2str = function bin2str(buffer) {
    return String.fromCharCode.apply(null, buffer);
  };

  MP4Demuxer.readUint16 = function readUint16(buffer, offset) {
    if (buffer.data) {
      offset += buffer.start;
      buffer = buffer.data;
    }

    var val = buffer[offset] << 8 | buffer[offset + 1];

    return val < 0 ? 65536 + val : val;
  };

  MP4Demuxer.readUint32 = function readUint32(buffer, offset) {
    if (buffer.data) {
      offset += buffer.start;
      buffer = buffer.data;
    }

    var val = buffer[offset] << 24 | buffer[offset + 1] << 16 | buffer[offset + 2] << 8 | buffer[offset + 3];
    return val < 0 ? 4294967296 + val : val;
  };

  MP4Demuxer.writeUint32 = function writeUint32(buffer, offset, value) {
    if (buffer.data) {
      offset += buffer.start;
      buffer = buffer.data;
    }
    buffer[offset] = value >> 24;
    buffer[offset + 1] = value >> 16 & 0xff;
    buffer[offset + 2] = value >> 8 & 0xff;
    buffer[offset + 3] = value & 0xff;
  };

  // Find the data for a box specified by its path


  MP4Demuxer.findBox = function findBox(data, path) {
    var results = [],
        i = void 0,
        size = void 0,
        type = void 0,
        end = void 0,
        subresults = void 0,
        start = void 0,
        endbox = void 0;

    if (data.data) {
      start = data.start;
      end = data.end;
      data = data.data;
    } else {
      start = 0;
      end = data.byteLength;
    }

    if (!path.length) {
      // short-circuit the search for empty paths
      return null;
    }

    for (i = start; i < end;) {
      size = MP4Demuxer.readUint32(data, i);
      type = MP4Demuxer.bin2str(data.subarray(i + 4, i + 8));
      endbox = size > 1 ? i + size : end;

      if (type === path[0]) {
        if (path.length === 1) {
          // this is the end of the path and we've found the box we were
          // looking for
          results.push({ data: data, start: i + 8, end: endbox });
        } else {
          // recursively search for the next box along the path
          subresults = MP4Demuxer.findBox({ data: data, start: i + 8, end: endbox }, path.slice(1));
          if (subresults.length) {
            results = results.concat(subresults);
          }
        }
      }
      i = endbox;
    }

    // we've finished searching all of data
    return results;
  };

  MP4Demuxer.parseSegmentIndex = function parseSegmentIndex(initSegment) {
    var moov = MP4Demuxer.findBox(initSegment, ['moov'])[0];
    var moovEndOffset = moov ? moov.end : null; // we need this in case we need to chop of garbage of the end of current data

    var index = 0;
    var sidx = MP4Demuxer.findBox(initSegment, ['sidx']);
    var references = void 0;

    if (!sidx || !sidx[0]) {
      return null;
    }

    references = [];
    sidx = sidx[0];

    var version = sidx.data[0];

    // set initial offset, we skip the reference ID (not needed)
    index = version === 0 ? 8 : 16;

    var timescale = MP4Demuxer.readUint32(sidx, index);
    index += 4;

    // TODO: parse earliestPresentationTime and firstOffset
    // usually zero in our case
    var earliestPresentationTime = 0;
    var firstOffset = 0;

    if (version === 0) {
      index += 8;
    } else {
      index += 16;
    }

    // skip reserved
    index += 2;

    var startByte = sidx.end + firstOffset;

    var referencesCount = MP4Demuxer.readUint16(sidx, index);
    index += 2;

    for (var i = 0; i < referencesCount; i++) {
      var referenceIndex = index;

      var referenceInfo = MP4Demuxer.readUint32(sidx, referenceIndex);
      referenceIndex += 4;

      var referenceSize = referenceInfo & 0x7FFFFFFF;
      var referenceType = (referenceInfo & 0x80000000) >>> 31;

      if (referenceType === 1) {
        console.warn('SIDX has hierarchical references (not supported)');
        return;
      }

      var subsegmentDuration = MP4Demuxer.readUint32(sidx, referenceIndex);
      referenceIndex += 4;

      references.push({
        referenceSize: referenceSize,
        subsegmentDuration: subsegmentDuration, // unscaled
        info: {
          duration: subsegmentDuration / timescale,
          start: startByte,
          end: startByte + referenceSize - 1
        }
      });

      startByte += referenceSize;

      // Skipping 1 bit for |startsWithSap|, 3 bits for |sapType|, and 28 bits
      // for |sapDelta|.
      referenceIndex += 4;

      // skip to next ref
      index = referenceIndex;
    }

    return {
      earliestPresentationTime: earliestPresentationTime,
      timescale: timescale,
      version: version,
      referencesCount: referencesCount,
      references: references,
      moovEndOffset: moovEndOffset
    };
  };

  /**
   * Parses an MP4 initialization segment and extracts stream type and
   * timescale values for any declared tracks. Timescale values indicate the
   * number of clock ticks per second to assume for time-based values
   * elsewhere in the MP4.
   *
   * To determine the start time of an MP4, you need two pieces of
   * information: the timescale unit and the earliest base media decode
   * time. Multiple timescales can be specified within an MP4 but the
   * base media decode time is always expressed in the timescale from
   * the media header box for the track:
   * ```
   * moov > trak > mdia > mdhd.timescale
   * moov > trak > mdia > hdlr
   * ```
   * @param init {Uint8Array} the bytes of the init segment
   * @return {object} a hash of track type to timescale values or null if
   * the init segment is malformed.
   */


  MP4Demuxer.parseInitSegment = function parseInitSegment(initSegment) {
    var result = [];
    var traks = MP4Demuxer.findBox(initSegment, ['moov', 'trak']);

    traks.forEach(function (trak) {
      var tkhd = MP4Demuxer.findBox(trak, ['tkhd'])[0];
      if (tkhd) {
        var version = tkhd.data[tkhd.start];
        var index = version === 0 ? 12 : 20;
        var trackId = MP4Demuxer.readUint32(tkhd, index);

        var mdhd = MP4Demuxer.findBox(trak, ['mdia', 'mdhd'])[0];
        if (mdhd) {
          version = mdhd.data[mdhd.start];
          index = version === 0 ? 12 : 20;
          var timescale = MP4Demuxer.readUint32(mdhd, index);

          var hdlr = MP4Demuxer.findBox(trak, ['mdia', 'hdlr'])[0];
          if (hdlr) {
            var hdlrType = MP4Demuxer.bin2str(hdlr.data.subarray(hdlr.start + 8, hdlr.start + 12));
            var type = { 'soun': 'audio', 'vide': 'video' }[hdlrType];
            if (type) {
              // extract codec info. TODO : parse codec details to be able to build MIME type
              var codecBox = MP4Demuxer.findBox(trak, ['mdia', 'minf', 'stbl', 'stsd']);
              if (codecBox.length) {
                codecBox = codecBox[0];
                var codecType = MP4Demuxer.bin2str(codecBox.data.subarray(codecBox.start + 12, codecBox.start + 16));
                __WEBPACK_IMPORTED_MODULE_0__utils_logger__["b" /* logger */].log('MP4Demuxer:' + type + ':' + codecType + ' found');
              }
              result[trackId] = { timescale: timescale, type: type };
              result[type] = { timescale: timescale, id: trackId };
            }
          }
        }
      }
    });
    return result;
  };

  /**
  * Determine the base media decode start time, in seconds, for an MP4
  * fragment. If multiple fragments are specified, the earliest time is
  * returned.
  *
  * The base media decode time can be parsed from track fragment
  * metadata:
  * ```
  * moof > traf > tfdt.baseMediaDecodeTime
  * ```
  * It requires the timescale value from the mdhd to interpret.
  *
  * @param timescale {object} a hash of track ids to timescale values.
  * @return {number} the earliest base media decode start time for the
  * fragment, in seconds
  */


  MP4Demuxer.getStartDTS = function getStartDTS(initData, fragment) {
    var trafs = void 0,
        baseTimes = void 0,
        result = void 0;

    // we need info from two childrend of each track fragment box
    trafs = MP4Demuxer.findBox(fragment, ['moof', 'traf']);

    // determine the start times for each track
    baseTimes = [].concat.apply([], trafs.map(function (traf) {
      return MP4Demuxer.findBox(traf, ['tfhd']).map(function (tfhd) {
        var id = void 0,
            scale = void 0,
            baseTime = void 0;

        // get the track id from the tfhd
        id = MP4Demuxer.readUint32(tfhd, 4);
        // assume a 90kHz clock if no timescale was specified
        scale = initData[id].timescale || 90e3;

        // get the base media decode time from the tfdt
        baseTime = MP4Demuxer.findBox(traf, ['tfdt']).map(function (tfdt) {
          var version = void 0,
              result = void 0;

          version = tfdt.data[tfdt.start];
          result = MP4Demuxer.readUint32(tfdt, 4);
          if (version === 1) {
            result *= Math.pow(2, 32);

            result += MP4Demuxer.readUint32(tfdt, 8);
          }
          return result;
        })[0];
        // convert base time to seconds
        return baseTime / scale;
      });
    }));

    // return the minimum
    result = Math.min.apply(null, baseTimes);
    return isFinite(result) ? result : 0;
  };

  MP4Demuxer.offsetStartDTS = function offsetStartDTS(initData, fragment, timeOffset) {
    MP4Demuxer.findBox(fragment, ['moof', 'traf']).map(function (traf) {
      return MP4Demuxer.findBox(traf, ['tfhd']).map(function (tfhd) {
        // get the track id from the tfhd
        var id = MP4Demuxer.readUint32(tfhd, 4);
        // assume a 90kHz clock if no timescale was specified
        var timescale = initData[id].timescale || 90e3;

        // get the base media decode time from the tfdt
        MP4Demuxer.findBox(traf, ['tfdt']).map(function (tfdt) {
          var version = tfdt.data[tfdt.start];
          var baseMediaDecodeTime = MP4Demuxer.readUint32(tfdt, 4);
          if (version === 0) {
            MP4Demuxer.writeUint32(tfdt, 4, baseMediaDecodeTime - timeOffset * timescale);
          } else {
            baseMediaDecodeTime *= Math.pow(2, 32);
            baseMediaDecodeTime += MP4Demuxer.readUint32(tfdt, 8);
            baseMediaDecodeTime -= timeOffset * timescale;
            baseMediaDecodeTime = Math.max(baseMediaDecodeTime, 0);
            var upper = Math.floor(baseMediaDecodeTime / (UINT32_MAX + 1));
            var lower = Math.floor(baseMediaDecodeTime % (UINT32_MAX + 1));
            MP4Demuxer.writeUint32(tfdt, 4, upper);
            MP4Demuxer.writeUint32(tfdt, 8, lower);
          }
        });
      });
    });
  };

  // feed incoming data to the front of the parsing pipeline


  MP4Demuxer.prototype.append = function append(data, timeOffset, contiguous, accurateTimeOffset) {
    var initData = this.initData;
    if (!initData) {
      this.resetInitSegment(data, this.audioCodec, this.videoCodec, false);
      initData = this.initData;
    }
    var startDTS = void 0,
        initPTS = this.initPTS;
    if (initPTS === undefined) {
      var _startDTS = MP4Demuxer.getStartDTS(initData, data);
      this.initPTS = initPTS = _startDTS - timeOffset;
      this.observer.trigger(__WEBPACK_IMPORTED_MODULE_1__events__["a" /* default */].INIT_PTS_FOUND, { initPTS: initPTS });
    }
    MP4Demuxer.offsetStartDTS(initData, data, initPTS);
    startDTS = MP4Demuxer.getStartDTS(initData, data);
    this.remuxer.remux(initData.audio, initData.video, null, null, startDTS, contiguous, accurateTimeOffset, data);
  };

  MP4Demuxer.prototype.destroy = function destroy() {};

  return MP4Demuxer;
}();

/* harmony default export */ __webpack_exports__["a"] = (MP4Demuxer);

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./src/events.js
var events = __webpack_require__(1);

// EXTERNAL MODULE: ./src/errors.js
var errors = __webpack_require__(2);

// EXTERNAL MODULE: ./src/crypt/decrypter.js + 3 modules
var crypt_decrypter = __webpack_require__(7);

// EXTERNAL MODULE: ./src/utils/logger.js
var logger = __webpack_require__(0);

// EXTERNAL MODULE: ./src/utils/get-self-scope.js
var get_self_scope = __webpack_require__(3);

// CONCATENATED MODULE: ./src/demux/adts.js
/**
 *  ADTS parser helper
 */







function getAudioConfig(observer, data, offset, audioCodec) {
  var adtsObjectType = void 0,
      // :int
  adtsSampleingIndex = void 0,
      // :int
  adtsExtensionSampleingIndex = void 0,
      // :int
  adtsChanelConfig = void 0,
      // :int
  config = void 0,
      userAgent = navigator.userAgent.toLowerCase(),
      manifestCodec = audioCodec,
      adtsSampleingRates = [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350];
  // byte 2
  adtsObjectType = ((data[offset + 2] & 0xC0) >>> 6) + 1;
  adtsSampleingIndex = (data[offset + 2] & 0x3C) >>> 2;
  if (adtsSampleingIndex > adtsSampleingRates.length - 1) {
    observer.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].MEDIA_ERROR, details: errors["a" /* ErrorDetails */].FRAG_PARSING_ERROR, fatal: true, reason: 'invalid ADTS sampling index:' + adtsSampleingIndex });
    return;
  }
  adtsChanelConfig = (data[offset + 2] & 0x01) << 2;
  // byte 3
  adtsChanelConfig |= (data[offset + 3] & 0xC0) >>> 6;
  logger["b" /* logger */].log('manifest codec:' + audioCodec + ',ADTS data:type:' + adtsObjectType + ',sampleingIndex:' + adtsSampleingIndex + '[' + adtsSampleingRates[adtsSampleingIndex] + 'Hz],channelConfig:' + adtsChanelConfig);
  // firefox: freq less than 24kHz = AAC SBR (HE-AAC)
  if (/firefox/i.test(userAgent)) {
    if (adtsSampleingIndex >= 6) {
      adtsObjectType = 5;
      config = new Array(4);
      // HE-AAC uses SBR (Spectral Band Replication) , high frequencies are constructed from low frequencies
      // there is a factor 2 between frame sample rate and output sample rate
      // multiply frequency by 2 (see table below, equivalent to substract 3)
      adtsExtensionSampleingIndex = adtsSampleingIndex - 3;
    } else {
      adtsObjectType = 2;
      config = new Array(2);
      adtsExtensionSampleingIndex = adtsSampleingIndex;
    }
    // Android : always use AAC
  } else if (userAgent.indexOf('android') !== -1) {
    adtsObjectType = 2;
    config = new Array(2);
    adtsExtensionSampleingIndex = adtsSampleingIndex;
  } else {
    /*  for other browsers (Chrome/Vivaldi/Opera ...)
        always force audio type to be HE-AAC SBR, as some browsers do not support audio codec switch properly (like Chrome ...)
    */
    adtsObjectType = 5;
    config = new Array(4);
    // if (manifest codec is HE-AAC or HE-AACv2) OR (manifest codec not specified AND frequency less than 24kHz)
    if (audioCodec && (audioCodec.indexOf('mp4a.40.29') !== -1 || audioCodec.indexOf('mp4a.40.5') !== -1) || !audioCodec && adtsSampleingIndex >= 6) {
      // HE-AAC uses SBR (Spectral Band Replication) , high frequencies are constructed from low frequencies
      // there is a factor 2 between frame sample rate and output sample rate
      // multiply frequency by 2 (see table below, equivalent to substract 3)
      adtsExtensionSampleingIndex = adtsSampleingIndex - 3;
    } else {
      // if (manifest codec is AAC) AND (frequency less than 24kHz AND nb channel is 1) OR (manifest codec not specified and mono audio)
      // Chrome fails to play back with low frequency AAC LC mono when initialized with HE-AAC.  This is not a problem with stereo.
      if (audioCodec && audioCodec.indexOf('mp4a.40.2') !== -1 && (adtsSampleingIndex >= 6 && adtsChanelConfig === 1 || /vivaldi/i.test(userAgent)) || !audioCodec && adtsChanelConfig === 1) {
        adtsObjectType = 2;
        config = new Array(2);
      }
      adtsExtensionSampleingIndex = adtsSampleingIndex;
    }
  }
  /* refer to http://wiki.multimedia.cx/index.php?title=MPEG-4_Audio#Audio_Specific_Config
      ISO 14496-3 (AAC).pdf - Table 1.13 — Syntax of AudioSpecificConfig()
    Audio Profile / Audio Object Type
    0: Null
    1: AAC Main
    2: AAC LC (Low Complexity)
    3: AAC SSR (Scalable Sample Rate)
    4: AAC LTP (Long Term Prediction)
    5: SBR (Spectral Band Replication)
    6: AAC Scalable
   sampling freq
    0: 96000 Hz
    1: 88200 Hz
    2: 64000 Hz
    3: 48000 Hz
    4: 44100 Hz
    5: 32000 Hz
    6: 24000 Hz
    7: 22050 Hz
    8: 16000 Hz
    9: 12000 Hz
    10: 11025 Hz
    11: 8000 Hz
    12: 7350 Hz
    13: Reserved
    14: Reserved
    15: frequency is written explictly
    Channel Configurations
    These are the channel configurations:
    0: Defined in AOT Specifc Config
    1: 1 channel: front-center
    2: 2 channels: front-left, front-right
  */
  // audioObjectType = profile => profile, the MPEG-4 Audio Object Type minus 1
  config[0] = adtsObjectType << 3;
  // samplingFrequencyIndex
  config[0] |= (adtsSampleingIndex & 0x0E) >> 1;
  config[1] |= (adtsSampleingIndex & 0x01) << 7;
  // channelConfiguration
  config[1] |= adtsChanelConfig << 3;
  if (adtsObjectType === 5) {
    // adtsExtensionSampleingIndex
    config[1] |= (adtsExtensionSampleingIndex & 0x0E) >> 1;
    config[2] = (adtsExtensionSampleingIndex & 0x01) << 7;
    // adtsObjectType (force to 2, chrome is checking that object type is less than 5 ???
    //    https://chromium.googlesource.com/chromium/src.git/+/master/media/formats/mp4/aac.cc
    config[2] |= 2 << 2;
    config[3] = 0;
  }
  return { config: config, samplerate: adtsSampleingRates[adtsSampleingIndex], channelCount: adtsChanelConfig, codec: 'mp4a.40.' + adtsObjectType, manifestCodec: manifestCodec };
}

function isHeaderPattern(data, offset) {
  return data[offset] === 0xff && (data[offset + 1] & 0xf6) === 0xf0;
}

function getHeaderLength(data, offset) {
  return data[offset + 1] & 0x01 ? 7 : 9;
}

function getFullFrameLength(data, offset) {
  return (data[offset + 3] & 0x03) << 11 | data[offset + 4] << 3 | (data[offset + 5] & 0xE0) >>> 5;
}

function isHeader(data, offset) {
  // Look for ADTS header | 1111 1111 | 1111 X00X | where X can be either 0 or 1
  // Layer bits (position 14 and 15) in header should be always 0 for ADTS
  // More info https://wiki.multimedia.cx/index.php?title=ADTS
  if (offset + 1 < data.length && isHeaderPattern(data, offset)) {
    return true;
  }

  return false;
}

function adts_probe(data, offset) {
  // same as isHeader but we also check that ADTS frame follows last ADTS frame
  // or end of data is reached
  if (offset + 1 < data.length && isHeaderPattern(data, offset)) {
    // ADTS header Length
    var headerLength = getHeaderLength(data, offset);
    // ADTS frame Length
    var frameLength = headerLength;
    if (offset + 5 < data.length) {
      frameLength = getFullFrameLength(data, offset);
    }

    var newOffset = offset + frameLength;
    if (newOffset === data.length || newOffset + 1 < data.length && isHeaderPattern(data, newOffset)) {
      return true;
    }
  }
  return false;
}

function initTrackConfig(track, observer, data, offset, audioCodec) {
  if (!track.samplerate) {
    var config = getAudioConfig(observer, data, offset, audioCodec);
    track.config = config.config;
    track.samplerate = config.samplerate;
    track.channelCount = config.channelCount;
    track.codec = config.codec;
    track.manifestCodec = config.manifestCodec;
    logger["b" /* logger */].log('parsed codec:' + track.codec + ',rate:' + config.samplerate + ',nb channel:' + config.channelCount);
  }
}

function getFrameDuration(samplerate) {
  return 1024 * 90000 / samplerate;
}

function parseFrameHeader(data, offset, pts, frameIndex, frameDuration) {
  var headerLength = void 0,
      frameLength = void 0,
      stamp = void 0;
  var length = data.length;

  // The protection skip bit tells us if we have 2 bytes of CRC data at the end of the ADTS header
  headerLength = getHeaderLength(data, offset);
  // retrieve frame size
  frameLength = getFullFrameLength(data, offset);
  frameLength -= headerLength;

  if (frameLength > 0 && offset + headerLength + frameLength <= length) {
    stamp = pts + frameIndex * frameDuration;
    // logger.log(`AAC frame, offset/length/total/pts:${offset+headerLength}/${frameLength}/${data.byteLength}/${(stamp/90).toFixed(0)}`);
    return { headerLength: headerLength, frameLength: frameLength, stamp: stamp };
  }

  return undefined;
}

function appendFrame(track, data, offset, pts, frameIndex) {
  var frameDuration = getFrameDuration(track.samplerate);
  var header = parseFrameHeader(data, offset, pts, frameIndex, frameDuration);
  if (header) {
    var stamp = header.stamp;
    var headerLength = header.headerLength;
    var frameLength = header.frameLength;

    // logger.log(`AAC frame, offset/length/total/pts:${offset+headerLength}/${frameLength}/${data.byteLength}/${(stamp/90).toFixed(0)}`);
    var aacSample = {
      unit: data.subarray(offset + headerLength, offset + headerLength + frameLength),
      pts: stamp,
      dts: stamp
    };

    track.samples.push(aacSample);
    track.len += frameLength;

    return { sample: aacSample, length: frameLength + headerLength };
  }

  return undefined;
}
// EXTERNAL MODULE: ./src/demux/id3.js
var id3 = __webpack_require__(5);

// CONCATENATED MODULE: ./src/demux/aacdemuxer.js
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * AAC demuxer
 */




var aacdemuxer_AACDemuxer = function () {
  function AACDemuxer(observer, remuxer, config) {
    _classCallCheck(this, AACDemuxer);

    this.observer = observer;
    this.config = config;
    this.remuxer = remuxer;
  }

  AACDemuxer.prototype.resetInitSegment = function resetInitSegment(initSegment, audioCodec, videoCodec, duration) {
    this._audioTrack = { container: 'audio/adts', type: 'audio', id: 0, sequenceNumber: 0, isAAC: true, samples: [], len: 0, manifestCodec: audioCodec, duration: duration, inputTimeScale: 90000 };
  };

  AACDemuxer.prototype.resetTimeStamp = function resetTimeStamp() {};

  AACDemuxer.probe = function probe(data) {
    if (!data) {
      return false;
    }

    // Check for the ADTS sync word
    // Look for ADTS header | 1111 1111 | 1111 X00X | where X can be either 0 or 1
    // Layer bits (position 14 and 15) in header should be always 0 for ADTS
    // More info https://wiki.multimedia.cx/index.php?title=ADTS
    var id3Data = id3["a" /* default */].getID3Data(data, 0) || [];
    var offset = id3Data.length;

    for (var length = data.length; offset < length; offset++) {
      if (adts_probe(data, offset)) {
        logger["b" /* logger */].log('ADTS sync word found !');
        return true;
      }
    }
    return false;
  };

  // feed incoming data to the front of the parsing pipeline


  AACDemuxer.prototype.append = function append(data, timeOffset, contiguous, accurateTimeOffset) {
    var track = this._audioTrack;
    var id3Data = id3["a" /* default */].getID3Data(data, 0) || [];
    var timestamp = id3["a" /* default */].getTimeStamp(id3Data);
    var pts = timestamp ? 90 * timestamp : timeOffset * 90000;
    var frameIndex = 0;
    var stamp = pts;
    var length = data.length;
    var offset = id3Data.length;

    var id3Samples = [{ pts: stamp, dts: stamp, data: id3Data }];

    while (offset < length - 1) {
      if (isHeader(data, offset) && offset + 5 < length) {
        initTrackConfig(track, this.observer, data, offset, track.manifestCodec);
        var frame = appendFrame(track, data, offset, pts, frameIndex);
        if (frame) {
          offset += frame.length;
          stamp = frame.sample.pts;
          frameIndex++;
        } else {
          logger["b" /* logger */].log('Unable to parse AAC frame');
          break;
        }
      } else if (id3["a" /* default */].isHeader(data, offset)) {
        id3Data = id3["a" /* default */].getID3Data(data, offset);
        id3Samples.push({ pts: stamp, dts: stamp, data: id3Data });
        offset += id3Data.length;
      } else {
        // nothing found, keep looking
        offset++;
      }
    }

    this.remuxer.remux(track, { samples: [] }, { samples: id3Samples, inputTimeScale: 90000 }, { samples: [] }, timeOffset, contiguous, accurateTimeOffset);
  };

  AACDemuxer.prototype.destroy = function destroy() {};

  return AACDemuxer;
}();

/* harmony default export */ var aacdemuxer = (aacdemuxer_AACDemuxer);
// EXTERNAL MODULE: ./src/demux/mp4demuxer.js
var mp4demuxer = __webpack_require__(8);

// CONCATENATED MODULE: ./src/demux/mpegaudio.js
/**
 *  MPEG parser helper
 */

var MpegAudio = {

  BitratesMap: [32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],

  SamplingRateMap: [44100, 48000, 32000, 22050, 24000, 16000, 11025, 12000, 8000],

  SamplesCoefficients: [
  // MPEG 2.5
  [0, // Reserved
  72, // Layer3
  144, // Layer2
  12 // Layer1
  ],
  // Reserved
  [0, // Reserved
  0, // Layer3
  0, // Layer2
  0 // Layer1
  ],
  // MPEG 2
  [0, // Reserved
  72, // Layer3
  144, // Layer2
  12 // Layer1
  ],
  // MPEG 1
  [0, // Reserved
  144, // Layer3
  144, // Layer2
  12 // Layer1
  ]],

  BytesInSlot: [0, // Reserved
  1, // Layer3
  1, // Layer2
  4 // Layer1
  ],

  appendFrame: function appendFrame(track, data, offset, pts, frameIndex) {
    // Using http://www.datavoyage.com/mpgscript/mpeghdr.htm as a reference
    if (offset + 24 > data.length) {
      return undefined;
    }

    var header = this.parseHeader(data, offset);
    if (header && offset + header.frameLength <= data.length) {
      var frameDuration = header.samplesPerFrame * 90000 / header.sampleRate;
      var stamp = pts + frameIndex * frameDuration;
      var sample = { unit: data.subarray(offset, offset + header.frameLength), pts: stamp, dts: stamp };

      track.config = [];
      track.channelCount = header.channelCount;
      track.samplerate = header.sampleRate;
      track.samples.push(sample);
      track.len += header.frameLength;

      return { sample: sample, length: header.frameLength };
    }

    return undefined;
  },

  parseHeader: function parseHeader(data, offset) {
    var headerB = data[offset + 1] >> 3 & 3;
    var headerC = data[offset + 1] >> 1 & 3;
    var headerE = data[offset + 2] >> 4 & 15;
    var headerF = data[offset + 2] >> 2 & 3;
    var headerG = data[offset + 2] >> 1 & 1;
    if (headerB !== 1 && headerE !== 0 && headerE !== 15 && headerF !== 3) {
      var columnInBitrates = headerB === 3 ? 3 - headerC : headerC === 3 ? 3 : 4;
      var bitRate = MpegAudio.BitratesMap[columnInBitrates * 14 + headerE - 1] * 1000;
      var columnInSampleRates = headerB === 3 ? 0 : headerB === 2 ? 1 : 2;
      var sampleRate = MpegAudio.SamplingRateMap[columnInSampleRates * 3 + headerF];
      var channelCount = data[offset + 3] >> 6 === 3 ? 1 : 2; // If bits of channel mode are `11` then it is a single channel (Mono)
      var sampleCoefficient = MpegAudio.SamplesCoefficients[headerB][headerC];
      var bytesInSlot = MpegAudio.BytesInSlot[headerC];
      var samplesPerFrame = sampleCoefficient * 8 * bytesInSlot;
      var frameLength = parseInt(sampleCoefficient * bitRate / sampleRate + headerG, 10) * bytesInSlot;

      return { sampleRate: sampleRate, channelCount: channelCount, frameLength: frameLength, samplesPerFrame: samplesPerFrame };
    }

    return undefined;
  },

  isHeaderPattern: function isHeaderPattern(data, offset) {
    return data[offset] === 0xff && (data[offset + 1] & 0xe0) === 0xe0 && (data[offset + 1] & 0x06) !== 0x00;
  },

  isHeader: function isHeader(data, offset) {
    // Look for MPEG header | 1111 1111 | 111X XYZX | where X can be either 0 or 1 and Y or Z should be 1
    // Layer bits (position 14 and 15) in header should be always different from 0 (Layer I or Layer II or Layer III)
    // More info http://www.mp3-tech.org/programmer/frame_header.html
    if (offset + 1 < data.length && this.isHeaderPattern(data, offset)) {
      return true;
    }

    return false;
  },

  probe: function probe(data, offset) {
    // same as isHeader but we also check that MPEG frame follows last MPEG frame
    // or end of data is reached
    if (offset + 1 < data.length && this.isHeaderPattern(data, offset)) {
      // MPEG header Length
      var headerLength = 4;
      // MPEG frame Length
      var header = this.parseHeader(data, offset);
      var frameLength = headerLength;
      if (header && header.frameLength) {
        frameLength = header.frameLength;
      }

      var newOffset = offset + frameLength;
      if (newOffset === data.length || newOffset + 1 < data.length && this.isHeaderPattern(data, newOffset)) {
        return true;
      }
    }
    return false;
  }
};

/* harmony default export */ var mpegaudio = (MpegAudio);
// CONCATENATED MODULE: ./src/demux/exp-golomb.js
function exp_golomb__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Parser for exponential Golomb codes, a variable-bitwidth number encoding scheme used by h264.
*/



var exp_golomb_ExpGolomb = function () {
  function ExpGolomb(data) {
    exp_golomb__classCallCheck(this, ExpGolomb);

    this.data = data;
    // the number of bytes left to examine in this.data
    this.bytesAvailable = data.byteLength;
    // the current word being examined
    this.word = 0; // :uint
    // the number of bits left to examine in the current word
    this.bitsAvailable = 0; // :uint
  }

  // ():void


  ExpGolomb.prototype.loadWord = function loadWord() {
    var data = this.data,
        bytesAvailable = this.bytesAvailable,
        position = data.byteLength - bytesAvailable,
        workingBytes = new Uint8Array(4),
        availableBytes = Math.min(4, bytesAvailable);
    if (availableBytes === 0) {
      throw new Error('no bytes available');
    }

    workingBytes.set(data.subarray(position, position + availableBytes));
    this.word = new DataView(workingBytes.buffer).getUint32(0);
    // track the amount of this.data that has been processed
    this.bitsAvailable = availableBytes * 8;
    this.bytesAvailable -= availableBytes;
  };

  // (count:int):void


  ExpGolomb.prototype.skipBits = function skipBits(count) {
    var skipBytes = void 0; // :int
    if (this.bitsAvailable > count) {
      this.word <<= count;
      this.bitsAvailable -= count;
    } else {
      count -= this.bitsAvailable;
      skipBytes = count >> 3;
      count -= skipBytes >> 3;
      this.bytesAvailable -= skipBytes;
      this.loadWord();
      this.word <<= count;
      this.bitsAvailable -= count;
    }
  };

  // (size:int):uint


  ExpGolomb.prototype.readBits = function readBits(size) {
    var bits = Math.min(this.bitsAvailable, size),
        // :uint
    valu = this.word >>> 32 - bits; // :uint
    if (size > 32) {
      logger["b" /* logger */].error('Cannot read more than 32 bits at a time');
    }

    this.bitsAvailable -= bits;
    if (this.bitsAvailable > 0) {
      this.word <<= bits;
    } else if (this.bytesAvailable > 0) {
      this.loadWord();
    }

    bits = size - bits;
    if (bits > 0 && this.bitsAvailable) {
      return valu << bits | this.readBits(bits);
    } else {
      return valu;
    }
  };

  // ():uint


  ExpGolomb.prototype.skipLZ = function skipLZ() {
    var leadingZeroCount = void 0; // :uint
    for (leadingZeroCount = 0; leadingZeroCount < this.bitsAvailable; ++leadingZeroCount) {
      if ((this.word & 0x80000000 >>> leadingZeroCount) !== 0) {
        // the first bit of working word is 1
        this.word <<= leadingZeroCount;
        this.bitsAvailable -= leadingZeroCount;
        return leadingZeroCount;
      }
    }
    // we exhausted word and still have not found a 1
    this.loadWord();
    return leadingZeroCount + this.skipLZ();
  };

  // ():void


  ExpGolomb.prototype.skipUEG = function skipUEG() {
    this.skipBits(1 + this.skipLZ());
  };

  // ():void


  ExpGolomb.prototype.skipEG = function skipEG() {
    this.skipBits(1 + this.skipLZ());
  };

  // ():uint


  ExpGolomb.prototype.readUEG = function readUEG() {
    var clz = this.skipLZ(); // :uint
    return this.readBits(clz + 1) - 1;
  };

  // ():int


  ExpGolomb.prototype.readEG = function readEG() {
    var valu = this.readUEG(); // :int
    if (0x01 & valu) {
      // the number is odd if the low order bit is set
      return 1 + valu >>> 1; // add 1 to make it even, and divide by 2
    } else {
      return -1 * (valu >>> 1); // divide by two then make it negative
    }
  };

  // Some convenience functions
  // :Boolean


  ExpGolomb.prototype.readBoolean = function readBoolean() {
    return this.readBits(1) === 1;
  };

  // ():int


  ExpGolomb.prototype.readUByte = function readUByte() {
    return this.readBits(8);
  };

  // ():int


  ExpGolomb.prototype.readUShort = function readUShort() {
    return this.readBits(16);
  };
  // ():int


  ExpGolomb.prototype.readUInt = function readUInt() {
    return this.readBits(32);
  };

  /**
   * Advance the ExpGolomb decoder past a scaling list. The scaling
   * list is optionally transmitted as part of a sequence parameter
   * set and is not relevant to transmuxing.
   * @param count {number} the number of entries in this scaling list
   * @see Recommendation ITU-T H.264, Section 7.3.2.1.1.1
   */


  ExpGolomb.prototype.skipScalingList = function skipScalingList(count) {
    var lastScale = 8,
        nextScale = 8,
        j = void 0,
        deltaScale = void 0;
    for (j = 0; j < count; j++) {
      if (nextScale !== 0) {
        deltaScale = this.readEG();
        nextScale = (lastScale + deltaScale + 256) % 256;
      }
      lastScale = nextScale === 0 ? lastScale : nextScale;
    }
  };

  /**
   * Read a sequence parameter set and return some interesting video
   * properties. A sequence parameter set is the H264 metadata that
   * describes the properties of upcoming video frames.
   * @param data {Uint8Array} the bytes of a sequence parameter set
   * @return {object} an object with configuration parsed from the
   * sequence parameter set, including the dimensions of the
   * associated video frames.
   */


  ExpGolomb.prototype.readSPS = function readSPS() {
    var frameCropLeftOffset = 0,
        frameCropRightOffset = 0,
        frameCropTopOffset = 0,
        frameCropBottomOffset = 0,
        profileIdc = void 0,
        profileCompat = void 0,
        levelIdc = void 0,
        numRefFramesInPicOrderCntCycle = void 0,
        picWidthInMbsMinus1 = void 0,
        picHeightInMapUnitsMinus1 = void 0,
        frameMbsOnlyFlag = void 0,
        scalingListCount = void 0,
        i = void 0,
        readUByte = this.readUByte.bind(this),
        readBits = this.readBits.bind(this),
        readUEG = this.readUEG.bind(this),
        readBoolean = this.readBoolean.bind(this),
        skipBits = this.skipBits.bind(this),
        skipEG = this.skipEG.bind(this),
        skipUEG = this.skipUEG.bind(this),
        skipScalingList = this.skipScalingList.bind(this);

    readUByte();
    profileIdc = readUByte(); // profile_idc
    profileCompat = readBits(5); // constraint_set[0-4]_flag, u(5)
    skipBits(3); // reserved_zero_3bits u(3),
    levelIdc = readUByte(); // level_idc u(8)
    skipUEG(); // seq_parameter_set_id
    // some profiles have more optional data we don't need
    if (profileIdc === 100 || profileIdc === 110 || profileIdc === 122 || profileIdc === 244 || profileIdc === 44 || profileIdc === 83 || profileIdc === 86 || profileIdc === 118 || profileIdc === 128) {
      var chromaFormatIdc = readUEG();
      if (chromaFormatIdc === 3) {
        skipBits(1);
      } // separate_colour_plane_flag

      skipUEG(); // bit_depth_luma_minus8
      skipUEG(); // bit_depth_chroma_minus8
      skipBits(1); // qpprime_y_zero_transform_bypass_flag
      if (readBoolean()) {
        // seq_scaling_matrix_present_flag
        scalingListCount = chromaFormatIdc !== 3 ? 8 : 12;
        for (i = 0; i < scalingListCount; i++) {
          if (readBoolean()) {
            // seq_scaling_list_present_flag[ i ]
            if (i < 6) {
              skipScalingList(16);
            } else {
              skipScalingList(64);
            }
          }
        }
      }
    }
    skipUEG(); // log2_max_frame_num_minus4
    var picOrderCntType = readUEG();
    if (picOrderCntType === 0) {
      readUEG(); // log2_max_pic_order_cnt_lsb_minus4
    } else if (picOrderCntType === 1) {
      skipBits(1); // delta_pic_order_always_zero_flag
      skipEG(); // offset_for_non_ref_pic
      skipEG(); // offset_for_top_to_bottom_field
      numRefFramesInPicOrderCntCycle = readUEG();
      for (i = 0; i < numRefFramesInPicOrderCntCycle; i++) {
        skipEG();
      } // offset_for_ref_frame[ i ]
    }
    skipUEG(); // max_num_ref_frames
    skipBits(1); // gaps_in_frame_num_value_allowed_flag
    picWidthInMbsMinus1 = readUEG();
    picHeightInMapUnitsMinus1 = readUEG();
    frameMbsOnlyFlag = readBits(1);
    if (frameMbsOnlyFlag === 0) {
      skipBits(1);
    } // mb_adaptive_frame_field_flag

    skipBits(1); // direct_8x8_inference_flag
    if (readBoolean()) {
      // frame_cropping_flag
      frameCropLeftOffset = readUEG();
      frameCropRightOffset = readUEG();
      frameCropTopOffset = readUEG();
      frameCropBottomOffset = readUEG();
    }
    var pixelRatio = [1, 1];
    if (readBoolean()) {
      // vui_parameters_present_flag
      if (readBoolean()) {
        // aspect_ratio_info_present_flag
        var aspectRatioIdc = readUByte();
        switch (aspectRatioIdc) {
          case 1:
            pixelRatio = [1, 1];break;
          case 2:
            pixelRatio = [12, 11];break;
          case 3:
            pixelRatio = [10, 11];break;
          case 4:
            pixelRatio = [16, 11];break;
          case 5:
            pixelRatio = [40, 33];break;
          case 6:
            pixelRatio = [24, 11];break;
          case 7:
            pixelRatio = [20, 11];break;
          case 8:
            pixelRatio = [32, 11];break;
          case 9:
            pixelRatio = [80, 33];break;
          case 10:
            pixelRatio = [18, 11];break;
          case 11:
            pixelRatio = [15, 11];break;
          case 12:
            pixelRatio = [64, 33];break;
          case 13:
            pixelRatio = [160, 99];break;
          case 14:
            pixelRatio = [4, 3];break;
          case 15:
            pixelRatio = [3, 2];break;
          case 16:
            pixelRatio = [2, 1];break;
          case 255:
            {
              pixelRatio = [readUByte() << 8 | readUByte(), readUByte() << 8 | readUByte()];
              break;
            }
        }
      }
    }
    return {
      width: Math.ceil((picWidthInMbsMinus1 + 1) * 16 - frameCropLeftOffset * 2 - frameCropRightOffset * 2),
      height: (2 - frameMbsOnlyFlag) * (picHeightInMapUnitsMinus1 + 1) * 16 - (frameMbsOnlyFlag ? 2 : 4) * (frameCropTopOffset + frameCropBottomOffset),
      pixelRatio: pixelRatio
    };
  };

  ExpGolomb.prototype.readSliceType = function readSliceType() {
    // skip NALu type
    this.readUByte();
    // discard first_mb_in_slice
    this.readUEG();
    // return slice_type
    return this.readUEG();
  };

  return ExpGolomb;
}();

/* harmony default export */ var exp_golomb = (exp_golomb_ExpGolomb);
// CONCATENATED MODULE: ./src/demux/sample-aes.js
function sample_aes__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * SAMPLE-AES decrypter
*/



var sample_aes_SampleAesDecrypter = function () {
  function SampleAesDecrypter(observer, config, decryptdata, discardEPB) {
    sample_aes__classCallCheck(this, SampleAesDecrypter);

    this.decryptdata = decryptdata;
    this.discardEPB = discardEPB;
    this.decrypter = new crypt_decrypter["a" /* default */](observer, config, { removePKCS7Padding: false });
  }

  SampleAesDecrypter.prototype.decryptBuffer = function decryptBuffer(encryptedData, callback) {
    this.decrypter.decrypt(encryptedData, this.decryptdata.key.buffer, this.decryptdata.iv.buffer, callback);
  };

  // AAC - encrypt all full 16 bytes blocks starting from offset 16


  SampleAesDecrypter.prototype.decryptAacSample = function decryptAacSample(samples, sampleIndex, callback, sync) {
    var curUnit = samples[sampleIndex].unit;
    var encryptedData = curUnit.subarray(16, curUnit.length - curUnit.length % 16);
    var encryptedBuffer = encryptedData.buffer.slice(encryptedData.byteOffset, encryptedData.byteOffset + encryptedData.length);

    var localthis = this;
    this.decryptBuffer(encryptedBuffer, function (decryptedData) {
      decryptedData = new Uint8Array(decryptedData);
      curUnit.set(decryptedData, 16);

      if (!sync) {
        localthis.decryptAacSamples(samples, sampleIndex + 1, callback);
      }
    });
  };

  SampleAesDecrypter.prototype.decryptAacSamples = function decryptAacSamples(samples, sampleIndex, callback) {
    for (;; sampleIndex++) {
      if (sampleIndex >= samples.length) {
        callback();
        return;
      }

      if (samples[sampleIndex].unit.length < 32) {
        continue;
      }

      var sync = this.decrypter.isSync();

      this.decryptAacSample(samples, sampleIndex, callback, sync);

      if (!sync) {
        return;
      }
    }
  };

  // AVC - encrypt one 16 bytes block out of ten, starting from offset 32


  SampleAesDecrypter.prototype.getAvcEncryptedData = function getAvcEncryptedData(decodedData) {
    var encryptedDataLen = Math.floor((decodedData.length - 48) / 160) * 16 + 16;
    var encryptedData = new Int8Array(encryptedDataLen);
    var outputPos = 0;
    for (var inputPos = 32; inputPos <= decodedData.length - 16; inputPos += 160, outputPos += 16) {
      encryptedData.set(decodedData.subarray(inputPos, inputPos + 16), outputPos);
    }

    return encryptedData;
  };

  SampleAesDecrypter.prototype.getAvcDecryptedUnit = function getAvcDecryptedUnit(decodedData, decryptedData) {
    decryptedData = new Uint8Array(decryptedData);
    var inputPos = 0;
    for (var outputPos = 32; outputPos <= decodedData.length - 16; outputPos += 160, inputPos += 16) {
      decodedData.set(decryptedData.subarray(inputPos, inputPos + 16), outputPos);
    }

    return decodedData;
  };

  SampleAesDecrypter.prototype.decryptAvcSample = function decryptAvcSample(samples, sampleIndex, unitIndex, callback, curUnit, sync) {
    var decodedData = this.discardEPB(curUnit.data);
    var encryptedData = this.getAvcEncryptedData(decodedData);
    var localthis = this;

    this.decryptBuffer(encryptedData.buffer, function (decryptedData) {
      curUnit.data = localthis.getAvcDecryptedUnit(decodedData, decryptedData);

      if (!sync) {
        localthis.decryptAvcSamples(samples, sampleIndex, unitIndex + 1, callback);
      }
    });
  };

  SampleAesDecrypter.prototype.decryptAvcSamples = function decryptAvcSamples(samples, sampleIndex, unitIndex, callback) {
    for (;; sampleIndex++, unitIndex = 0) {
      if (sampleIndex >= samples.length) {
        callback();
        return;
      }

      var curUnits = samples[sampleIndex].units;
      for (;; unitIndex++) {
        if (unitIndex >= curUnits.length) {
          break;
        }

        var curUnit = curUnits[unitIndex];
        if (curUnit.length <= 48 || curUnit.type !== 1 && curUnit.type !== 5) {
          continue;
        }

        var sync = this.decrypter.isSync();

        this.decryptAvcSample(samples, sampleIndex, unitIndex, callback, curUnit, sync);

        if (!sync) {
          return;
        }
      }
    }
  };

  return SampleAesDecrypter;
}();

/* harmony default export */ var sample_aes = (sample_aes_SampleAesDecrypter);
// CONCATENATED MODULE: ./src/demux/tsdemuxer.js
function tsdemuxer__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * highly optimized TS demuxer:
 * parse PAT, PMT
 * extract PES packet from audio and video PIDs
 * extract AVC/H264 NAL units and AAC/ADTS samples from PES packet
 * trigger the remuxer upon parsing completion
 * it also tries to workaround as best as it can audio codec switch (HE-AAC to AAC and vice versa), without having to restart the MediaSource.
 * it also controls the remuxing process :
 * upon discontinuity or level switch detection, it will also notifies the remuxer so that it can reset its state.
*/






// import Hex from '../utils/hex';



// We are using fixed track IDs for driving the MP4 remuxer
// instead of following the TS PIDs.
// There is no reason not to do this and some browsers/SourceBuffer-demuxers
// may not like if there are TrackID "switches"
// See https://github.com/video-dev/hls.js/issues/1331
// Here we are mapping our internal track types to constant MP4 track IDs
// With MSE currently one can only have one track of each, and we are muxing
// whatever video/audio rendition in them.
var RemuxerTrackIdConfig = {
  video: 1,
  audio: 2,
  id3: 3,
  text: 4
};

var tsdemuxer_TSDemuxer = function () {
  function TSDemuxer(observer, remuxer, config, typeSupported) {
    tsdemuxer__classCallCheck(this, TSDemuxer);

    this.observer = observer;
    this.config = config;
    this.typeSupported = typeSupported;
    this.remuxer = remuxer;
    this.sampleAes = null;
  }

  TSDemuxer.prototype.setDecryptData = function setDecryptData(decryptdata) {
    if (decryptdata != null && decryptdata.key != null && decryptdata.method === 'SAMPLE-AES') {
      this.sampleAes = new sample_aes(this.observer, this.config, decryptdata, this.discardEPB);
    } else {
      this.sampleAes = null;
    }
  };

  TSDemuxer.probe = function probe(data) {
    var syncOffset = TSDemuxer._syncOffset(data);
    if (syncOffset < 0) {
      return false;
    } else {
      if (syncOffset) {
        logger["b" /* logger */].warn('MPEG2-TS detected but first sync word found @ offset ' + syncOffset + ', junk ahead ?');
      }

      return true;
    }
  };

  TSDemuxer._syncOffset = function _syncOffset(data) {
    // scan 1000 first bytes
    var scanwindow = Math.min(1000, data.length - 3 * 188);
    var i = 0;
    while (i < scanwindow) {
      // a TS fragment should contain at least 3 TS packets, a PAT, a PMT, and one PID, each starting with 0x47
      if (data[i] === 0x47 && data[i + 188] === 0x47 && data[i + 2 * 188] === 0x47) {
        return i;
      } else {
        i++;
      }
    }
    return -1;
  };

  /**
   * Creates a track model internal to demuxer used to drive remuxing input
   *
   * @param {string} type 'audio' | 'video' | 'id3' | 'text'
   * @param {number} duration
   * @return {object} TSDemuxer's internal track model
   */


  TSDemuxer.createTrack = function createTrack(type, duration) {
    return {
      container: type === 'video' || type === 'audio' ? 'video/mp2t' : undefined,
      type: type,
      id: RemuxerTrackIdConfig[type],
      pid: -1,
      inputTimeScale: 90000,
      sequenceNumber: 0,
      samples: [],
      len: 0,
      dropped: type === 'video' ? 0 : undefined,
      isAAC: type === 'audio' ? true : undefined,
      duration: type === 'audio' ? duration : undefined
    };
  };

  /**
   * Initializes a new init segment on the demuxer/remuxer interface. Needed for discontinuities/track-switches (or at stream start)
   * Resets all internal track instances of the demuxer.
   *
   * @override Implements generic demuxing/remuxing interface (see DemuxerInline)
   * @param {object} initSegment
   * @param {string} audioCodec
   * @param {string} videoCodec
   * @param {number} duration (in TS timescale = 90kHz)
   */


  TSDemuxer.prototype.resetInitSegment = function resetInitSegment(initSegment, audioCodec, videoCodec, duration) {
    this.pmtParsed = false;
    this._pmtId = -1;

    this._avcTrack = TSDemuxer.createTrack('video', duration);
    this._audioTrack = TSDemuxer.createTrack('audio', duration);
    this._id3Track = TSDemuxer.createTrack('id3', duration);
    this._txtTrack = TSDemuxer.createTrack('text', duration);

    // flush any partial content
    this.aacOverFlow = null;
    this.aacLastPTS = null;
    this.avcSample = null;
    this.audioCodec = audioCodec;
    this.videoCodec = videoCodec;
    this._duration = duration;
  };

  /**
   *
   * @override
   */


  TSDemuxer.prototype.resetTimeStamp = function resetTimeStamp() {};

  // feed incoming data to the front of the parsing pipeline


  TSDemuxer.prototype.append = function append(data, timeOffset, contiguous, accurateTimeOffset) {
    var start = void 0,
        len = data.length,
        stt = void 0,
        pid = void 0,
        atf = void 0,
        offset = void 0,
        pes = void 0,
        unknownPIDs = false;
    this.contiguous = contiguous;
    var pmtParsed = this.pmtParsed,
        avcTrack = this._avcTrack,
        audioTrack = this._audioTrack,
        id3Track = this._id3Track,
        avcId = avcTrack.pid,
        audioId = audioTrack.pid,
        id3Id = id3Track.pid,
        pmtId = this._pmtId,
        avcData = avcTrack.pesData,
        audioData = audioTrack.pesData,
        id3Data = id3Track.pesData,
        parsePAT = this._parsePAT,
        parsePMT = this._parsePMT,
        parsePES = this._parsePES,
        parseAVCPES = this._parseAVCPES.bind(this),
        parseAACPES = this._parseAACPES.bind(this),
        parseMPEGPES = this._parseMPEGPES.bind(this),
        parseID3PES = this._parseID3PES.bind(this);

    var syncOffset = TSDemuxer._syncOffset(data);

    // don't parse last TS packet if incomplete
    len -= (len + syncOffset) % 188;

    // loop through TS packets
    for (start = syncOffset; start < len; start += 188) {
      if (data[start] === 0x47) {
        stt = !!(data[start + 1] & 0x40);
        // pid is a 13-bit field starting at the last bit of TS[1]
        pid = ((data[start + 1] & 0x1f) << 8) + data[start + 2];
        atf = (data[start + 3] & 0x30) >> 4;
        // if an adaption field is present, its length is specified by the fifth byte of the TS packet header.
        if (atf > 1) {
          offset = start + 5 + data[start + 4];
          // continue if there is only adaptation field
          if (offset === start + 188) {
            continue;
          }
        } else {
          offset = start + 4;
        }
        switch (pid) {
          case avcId:
            if (stt) {
              if (avcData && (pes = parsePES(avcData)) && pes.pts !== undefined) {
                parseAVCPES(pes, false);
              }

              avcData = { data: [], size: 0 };
            }
            if (avcData) {
              avcData.data.push(data.subarray(offset, start + 188));
              avcData.size += start + 188 - offset;
            }
            break;
          case audioId:
            if (stt) {
              if (audioData && (pes = parsePES(audioData)) && pes.pts !== undefined) {
                if (audioTrack.isAAC) {
                  parseAACPES(pes);
                } else {
                  parseMPEGPES(pes);
                }
              }
              audioData = { data: [], size: 0 };
            }
            if (audioData) {
              audioData.data.push(data.subarray(offset, start + 188));
              audioData.size += start + 188 - offset;
            }
            break;
          case id3Id:
            if (stt) {
              if (id3Data && (pes = parsePES(id3Data)) && pes.pts !== undefined) {
                parseID3PES(pes);
              }

              id3Data = { data: [], size: 0 };
            }
            if (id3Data) {
              id3Data.data.push(data.subarray(offset, start + 188));
              id3Data.size += start + 188 - offset;
            }
            break;
          case 0:
            if (stt) {
              offset += data[offset] + 1;
            }

            pmtId = this._pmtId = parsePAT(data, offset);
            break;
          case pmtId:
            if (stt) {
              offset += data[offset] + 1;
            }

            var parsedPIDs = parsePMT(data, offset, this.typeSupported.mpeg === true || this.typeSupported.mp3 === true, this.sampleAes != null);

            // only update track id if track PID found while parsing PMT
            // this is to avoid resetting the PID to -1 in case
            // track PID transiently disappears from the stream
            // this could happen in case of transient missing audio samples for example
            // NOTE this is only the PID of the track as found in TS,
            // but we are not using this for MP4 track IDs.
            avcId = parsedPIDs.avc;
            if (avcId > 0) {
              avcTrack.pid = avcId;
            }

            audioId = parsedPIDs.audio;
            if (audioId > 0) {
              audioTrack.pid = audioId;
              audioTrack.isAAC = parsedPIDs.isAAC;
            }
            id3Id = parsedPIDs.id3;
            if (id3Id > 0) {
              id3Track.pid = id3Id;
            }

            if (unknownPIDs && !pmtParsed) {
              logger["b" /* logger */].log('reparse from beginning');
              unknownPIDs = false;
              // we set it to -188, the += 188 in the for loop will reset start to 0
              start = syncOffset - 188;
            }
            pmtParsed = this.pmtParsed = true;
            break;
          case 17:
          case 0x1fff:
            break;
          default:
            unknownPIDs = true;
            break;
        }
      } else {
        this.observer.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].MEDIA_ERROR, details: errors["a" /* ErrorDetails */].FRAG_PARSING_ERROR, fatal: false, reason: 'TS packet did not start with 0x47' });
      }
    }
    // try to parse last PES packets
    if (avcData && (pes = parsePES(avcData)) && pes.pts !== undefined) {
      parseAVCPES(pes, true);
      avcTrack.pesData = null;
    } else {
      // either avcData null or PES truncated, keep it for next frag parsing
      avcTrack.pesData = avcData;
    }

    if (audioData && (pes = parsePES(audioData)) && pes.pts !== undefined) {
      if (audioTrack.isAAC) {
        parseAACPES(pes);
      } else {
        parseMPEGPES(pes);
      }

      audioTrack.pesData = null;
    } else {
      if (audioData && audioData.size) {
        logger["b" /* logger */].log('last AAC PES packet truncated,might overlap between fragments');
      }

      // either audioData null or PES truncated, keep it for next frag parsing
      audioTrack.pesData = audioData;
    }

    if (id3Data && (pes = parsePES(id3Data)) && pes.pts !== undefined) {
      parseID3PES(pes);
      id3Track.pesData = null;
    } else {
      // either id3Data null or PES truncated, keep it for next frag parsing
      id3Track.pesData = id3Data;
    }

    if (this.sampleAes == null) {
      this.remuxer.remux(audioTrack, avcTrack, id3Track, this._txtTrack, timeOffset, contiguous, accurateTimeOffset);
    } else {
      this.decryptAndRemux(audioTrack, avcTrack, id3Track, this._txtTrack, timeOffset, contiguous, accurateTimeOffset);
    }
  };

  TSDemuxer.prototype.decryptAndRemux = function decryptAndRemux(audioTrack, videoTrack, id3Track, textTrack, timeOffset, contiguous, accurateTimeOffset) {
    if (audioTrack.samples && audioTrack.isAAC) {
      var localthis = this;
      this.sampleAes.decryptAacSamples(audioTrack.samples, 0, function () {
        localthis.decryptAndRemuxAvc(audioTrack, videoTrack, id3Track, textTrack, timeOffset, contiguous, accurateTimeOffset);
      });
    } else {
      this.decryptAndRemuxAvc(audioTrack, videoTrack, id3Track, textTrack, timeOffset, contiguous, accurateTimeOffset);
    }
  };

  TSDemuxer.prototype.decryptAndRemuxAvc = function decryptAndRemuxAvc(audioTrack, videoTrack, id3Track, textTrack, timeOffset, contiguous, accurateTimeOffset) {
    if (videoTrack.samples) {
      var localthis = this;
      this.sampleAes.decryptAvcSamples(videoTrack.samples, 0, 0, function () {
        localthis.remuxer.remux(audioTrack, videoTrack, id3Track, textTrack, timeOffset, contiguous, accurateTimeOffset);
      });
    } else {
      this.remuxer.remux(audioTrack, videoTrack, id3Track, textTrack, timeOffset, contiguous, accurateTimeOffset);
    }
  };

  TSDemuxer.prototype.destroy = function destroy() {
    this._initPTS = this._initDTS = undefined;
    this._duration = 0;
  };

  TSDemuxer.prototype._parsePAT = function _parsePAT(data, offset) {
    // skip the PSI header and parse the first PMT entry
    return (data[offset + 10] & 0x1F) << 8 | data[offset + 11];
    // logger.log('PMT PID:'  + this._pmtId);
  };

  TSDemuxer.prototype._parsePMT = function _parsePMT(data, offset, mpegSupported, isSampleAes) {
    var sectionLength = void 0,
        tableEnd = void 0,
        programInfoLength = void 0,
        pid = void 0,
        result = { audio: -1, avc: -1, id3: -1, isAAC: true };
    sectionLength = (data[offset + 1] & 0x0f) << 8 | data[offset + 2];
    tableEnd = offset + 3 + sectionLength - 4;
    // to determine where the table is, we have to figure out how
    // long the program info descriptors are
    programInfoLength = (data[offset + 10] & 0x0f) << 8 | data[offset + 11];
    // advance the offset to the first entry in the mapping table
    offset += 12 + programInfoLength;
    while (offset < tableEnd) {
      pid = (data[offset + 1] & 0x1F) << 8 | data[offset + 2];
      switch (data[offset]) {
        case 0xcf:
          // SAMPLE-AES AAC
          if (!isSampleAes) {
            logger["b" /* logger */].log('unkown stream type:' + data[offset]);
            break;
          }
        /* falls through */

        // ISO/IEC 13818-7 ADTS AAC (MPEG-2 lower bit-rate audio)
        case 0x0f:
          // logger.log('AAC PID:'  + pid);
          if (result.audio === -1) {
            result.audio = pid;
          }

          break;

        // Packetized metadata (ID3)
        case 0x15:
          // logger.log('ID3 PID:'  + pid);
          if (result.id3 === -1) {
            result.id3 = pid;
          }

          break;

        case 0xdb:
          // SAMPLE-AES AVC
          if (!isSampleAes) {
            logger["b" /* logger */].log('unkown stream type:' + data[offset]);
            break;
          }
        /* falls through */

        // ITU-T Rec. H.264 and ISO/IEC 14496-10 (lower bit-rate video)
        case 0x1b:
          // logger.log('AVC PID:'  + pid);
          if (result.avc === -1) {
            result.avc = pid;
          }

          break;

        // ISO/IEC 11172-3 (MPEG-1 audio)
        // or ISO/IEC 13818-3 (MPEG-2 halved sample rate audio)
        case 0x03:
        case 0x04:
          // logger.log('MPEG PID:'  + pid);
          if (!mpegSupported) {
            logger["b" /* logger */].log('MPEG audio found, not supported in this browser for now');
          } else if (result.audio === -1) {
            result.audio = pid;
            result.isAAC = false;
          }
          break;

        case 0x24:
          logger["b" /* logger */].warn('HEVC stream type found, not supported for now');
          break;

        default:
          logger["b" /* logger */].log('unkown stream type:' + data[offset]);
          break;
      }
      // move to the next table entry
      // skip past the elementary stream descriptors, if present
      offset += ((data[offset + 3] & 0x0F) << 8 | data[offset + 4]) + 5;
    }
    return result;
  };

  TSDemuxer.prototype._parsePES = function _parsePES(stream) {
    var i = 0,
        frag = void 0,
        pesFlags = void 0,
        pesPrefix = void 0,
        pesLen = void 0,
        pesHdrLen = void 0,
        pesData = void 0,
        pesPts = void 0,
        pesDts = void 0,
        payloadStartOffset = void 0,
        data = stream.data;
    // safety check
    if (!stream || stream.size === 0) {
      return null;
    }

    // we might need up to 19 bytes to read PES header
    // if first chunk of data is less than 19 bytes, let's merge it with following ones until we get 19 bytes
    // usually only one merge is needed (and this is rare ...)
    while (data[0].length < 19 && data.length > 1) {
      var newData = new Uint8Array(data[0].length + data[1].length);
      newData.set(data[0]);
      newData.set(data[1], data[0].length);
      data[0] = newData;
      data.splice(1, 1);
    }
    // retrieve PTS/DTS from first fragment
    frag = data[0];
    pesPrefix = (frag[0] << 16) + (frag[1] << 8) + frag[2];
    if (pesPrefix === 1) {
      pesLen = (frag[4] << 8) + frag[5];
      // if PES parsed length is not zero and greater than total received length, stop parsing. PES might be truncated
      // minus 6 : PES header size
      if (pesLen && pesLen > stream.size - 6) {
        return null;
      }

      pesFlags = frag[7];
      if (pesFlags & 0xC0) {
        /* PES header described here : http://dvd.sourceforge.net/dvdinfo/pes-hdr.html
            as PTS / DTS is 33 bit we cannot use bitwise operator in JS,
            as Bitwise operators treat their operands as a sequence of 32 bits */
        pesPts = (frag[9] & 0x0E) * 536870912 + // 1 << 29
        (frag[10] & 0xFF) * 4194304 + // 1 << 22
        (frag[11] & 0xFE) * 16384 + // 1 << 14
        (frag[12] & 0xFF) * 128 + // 1 << 7
        (frag[13] & 0xFE) / 2;
        // check if greater than 2^32 -1
        if (pesPts > 4294967295) {
          // decrement 2^33
          pesPts -= 8589934592;
        }
        if (pesFlags & 0x40) {
          pesDts = (frag[14] & 0x0E) * 536870912 + // 1 << 29
          (frag[15] & 0xFF) * 4194304 + // 1 << 22
          (frag[16] & 0xFE) * 16384 + // 1 << 14
          (frag[17] & 0xFF) * 128 + // 1 << 7
          (frag[18] & 0xFE) / 2;
          // check if greater than 2^32 -1
          if (pesDts > 4294967295) {
            // decrement 2^33
            pesDts -= 8589934592;
          }
          if (pesPts - pesDts > 60 * 90000) {
            logger["b" /* logger */].warn(Math.round((pesPts - pesDts) / 90000) + 's delta between PTS and DTS, align them');
            pesPts = pesDts;
          }
        } else {
          pesDts = pesPts;
        }
      }
      pesHdrLen = frag[8];
      // 9 bytes : 6 bytes for PES header + 3 bytes for PES extension
      payloadStartOffset = pesHdrLen + 9;

      stream.size -= payloadStartOffset;
      // reassemble PES packet
      pesData = new Uint8Array(stream.size);
      for (var j = 0, dataLen = data.length; j < dataLen; j++) {
        frag = data[j];
        var len = frag.byteLength;
        if (payloadStartOffset) {
          if (payloadStartOffset > len) {
            // trim full frag if PES header bigger than frag
            payloadStartOffset -= len;
            continue;
          } else {
            // trim partial frag if PES header smaller than frag
            frag = frag.subarray(payloadStartOffset);
            len -= payloadStartOffset;
            payloadStartOffset = 0;
          }
        }
        pesData.set(frag, i);
        i += len;
      }
      if (pesLen) {
        // payload size : remove PES header + PES extension
        pesLen -= pesHdrLen + 3;
      }
      return { data: pesData, pts: pesPts, dts: pesDts, len: pesLen };
    } else {
      return null;
    }
  };

  TSDemuxer.prototype.pushAccesUnit = function pushAccesUnit(avcSample, avcTrack) {
    if (avcSample.units.length && avcSample.frame) {
      var samples = avcTrack.samples;
      var nbSamples = samples.length;
      // only push AVC sample if starting with a keyframe is not mandatory OR
      //    if keyframe already found in this fragment OR
      //       keyframe found in last fragment (track.sps) AND
      //          samples already appended (we already found a keyframe in this fragment) OR fragment is contiguous
      if (!this.config.forceKeyFrameOnDiscontinuity || avcSample.key === true || avcTrack.sps && (nbSamples || this.contiguous)) {
        avcSample.id = nbSamples;
        samples.push(avcSample);
      } else {
        // dropped samples, track it
        avcTrack.dropped++;
      }
    }
    if (avcSample.debug.length) {
      logger["b" /* logger */].log(avcSample.pts + '/' + avcSample.dts + ':' + avcSample.debug);
    }
  };

  TSDemuxer.prototype._parseAVCPES = function _parseAVCPES(pes, last) {
    var _this = this;

    // logger.log('parse new PES');
    var track = this._avcTrack,
        units = this._parseAVCNALu(pes.data),
        debug = false,
        expGolombDecoder = void 0,
        avcSample = this.avcSample,
        push = void 0,
        spsfound = false,
        i = void 0,
        pushAccesUnit = this.pushAccesUnit.bind(this),
        createAVCSample = function createAVCSample(key, pts, dts, debug) {
      return { key: key, pts: pts, dts: dts, units: [], debug: debug };
    };
    // free pes.data to save up some memory
    pes.data = null;

    // if new NAL units found and last sample still there, let's push ...
    // this helps parsing streams with missing AUD (only do this if AUD never found)
    if (avcSample && units.length && !track.audFound) {
      pushAccesUnit(avcSample, track);
      avcSample = this.avcSample = createAVCSample(false, pes.pts, pes.dts, '');
    }

    units.forEach(function (unit) {
      switch (unit.type) {
        // NDR
        case 1:
          push = true;
          if (!avcSample) {
            avcSample = _this.avcSample = createAVCSample(true, pes.pts, pes.dts, '');
          }

          if (debug) {
            avcSample.debug += 'NDR ';
          }

          avcSample.frame = true;
          var data = unit.data;
          // only check slice type to detect KF in case SPS found in same packet (any keyframe is preceded by SPS ...)
          if (spsfound && data.length > 4) {
            // retrieve slice type by parsing beginning of NAL unit (follow H264 spec, slice_header definition) to detect keyframe embedded in NDR
            var sliceType = new exp_golomb(data).readSliceType();
            // 2 : I slice, 4 : SI slice, 7 : I slice, 9: SI slice
            // SI slice : A slice that is coded using intra prediction only and using quantisation of the prediction samples.
            // An SI slice can be coded such that its decoded samples can be constructed identically to an SP slice.
            // I slice: A slice that is not an SI slice that is decoded using intra prediction only.
            // if (sliceType === 2 || sliceType === 7) {
            if (sliceType === 2 || sliceType === 4 || sliceType === 7 || sliceType === 9) {
              avcSample.key = true;
            }
          }
          break;
        // IDR
        case 5:
          push = true;
          // handle PES not starting with AUD
          if (!avcSample) {
            avcSample = _this.avcSample = createAVCSample(true, pes.pts, pes.dts, '');
          }

          if (debug) {
            avcSample.debug += 'IDR ';
          }

          avcSample.key = true;
          avcSample.frame = true;
          break;
        // SEI
        case 6:
          push = true;
          if (debug && avcSample) {
            avcSample.debug += 'SEI ';
          }

          expGolombDecoder = new exp_golomb(_this.discardEPB(unit.data));

          // skip frameType
          expGolombDecoder.readUByte();

          var payloadType = 0;
          var payloadSize = 0;
          var endOfCaptions = false;
          var b = 0;

          while (!endOfCaptions && expGolombDecoder.bytesAvailable > 1) {
            payloadType = 0;
            do {
              b = expGolombDecoder.readUByte();
              payloadType += b;
            } while (b === 0xFF);

            // Parse payload size.
            payloadSize = 0;
            do {
              b = expGolombDecoder.readUByte();
              payloadSize += b;
            } while (b === 0xFF);

            // TODO: there can be more than one payload in an SEI packet...
            // TODO: need to read type and size in a while loop to get them all
            if (payloadType === 4 && expGolombDecoder.bytesAvailable !== 0) {
              endOfCaptions = true;

              var countryCode = expGolombDecoder.readUByte();

              if (countryCode === 181) {
                var providerCode = expGolombDecoder.readUShort();

                if (providerCode === 49) {
                  var userStructure = expGolombDecoder.readUInt();

                  if (userStructure === 0x47413934) {
                    var userDataType = expGolombDecoder.readUByte();

                    // Raw CEA-608 bytes wrapped in CEA-708 packet
                    if (userDataType === 3) {
                      var firstByte = expGolombDecoder.readUByte();
                      var secondByte = expGolombDecoder.readUByte();

                      var totalCCs = 31 & firstByte;
                      var byteArray = [firstByte, secondByte];

                      for (i = 0; i < totalCCs; i++) {
                        // 3 bytes per CC
                        byteArray.push(expGolombDecoder.readUByte());
                        byteArray.push(expGolombDecoder.readUByte());
                        byteArray.push(expGolombDecoder.readUByte());
                      }

                      _this._insertSampleInOrder(_this._txtTrack.samples, { type: 3, pts: pes.pts, bytes: byteArray });
                    }
                  }
                }
              }
            } else if (payloadSize < expGolombDecoder.bytesAvailable) {
              for (i = 0; i < payloadSize; i++) {
                expGolombDecoder.readUByte();
              }
            }
          }
          break;
        // SPS
        case 7:
          push = true;
          spsfound = true;
          if (debug && avcSample) {
            avcSample.debug += 'SPS ';
          }

          if (!track.sps) {
            expGolombDecoder = new exp_golomb(unit.data);
            var config = expGolombDecoder.readSPS();
            track.width = config.width;
            track.height = config.height;
            track.pixelRatio = config.pixelRatio;
            track.sps = [unit.data];
            track.duration = _this._duration;
            var codecarray = unit.data.subarray(1, 4);
            var codecstring = 'avc1.';
            for (i = 0; i < 3; i++) {
              var h = codecarray[i].toString(16);
              if (h.length < 2) {
                h = '0' + h;
              }

              codecstring += h;
            }
            track.codec = codecstring;
          }
          break;
        // PPS
        case 8:
          push = true;
          if (debug && avcSample) {
            avcSample.debug += 'PPS ';
          }

          if (!track.pps) {
            track.pps = [unit.data];
          }

          break;
        // AUD
        case 9:
          push = false;
          track.audFound = true;
          if (avcSample) {
            pushAccesUnit(avcSample, track);
          }

          avcSample = _this.avcSample = createAVCSample(false, pes.pts, pes.dts, debug ? 'AUD ' : '');
          break;
        // Filler Data
        case 12:
          push = false;
          break;
        default:
          push = false;
          if (avcSample) {
            avcSample.debug += 'unknown NAL ' + unit.type + ' ';
          }

          break;
      }
      if (avcSample && push) {
        var _units = avcSample.units;
        _units.push(unit);
      }
    });
    // if last PES packet, push samples
    if (last && avcSample) {
      pushAccesUnit(avcSample, track);
      this.avcSample = null;
    }
  };

  TSDemuxer.prototype._insertSampleInOrder = function _insertSampleInOrder(arr, data) {
    var len = arr.length;
    if (len > 0) {
      if (data.pts >= arr[len - 1].pts) {
        arr.push(data);
      } else {
        for (var pos = len - 1; pos >= 0; pos--) {
          if (data.pts < arr[pos].pts) {
            arr.splice(pos, 0, data);
            break;
          }
        }
      }
    } else {
      arr.push(data);
    }
  };

  TSDemuxer.prototype._getLastNalUnit = function _getLastNalUnit() {
    var avcSample = this.avcSample,
        lastUnit = void 0;
    // try to fallback to previous sample if current one is empty
    if (!avcSample || avcSample.units.length === 0) {
      var track = this._avcTrack,
          samples = track.samples;
      avcSample = samples[samples.length - 1];
    }
    if (avcSample) {
      var units = avcSample.units;
      lastUnit = units[units.length - 1];
    }
    return lastUnit;
  };

  TSDemuxer.prototype._parseAVCNALu = function _parseAVCNALu(array) {
    var i = 0,
        len = array.byteLength,
        value = void 0,
        overflow = void 0,
        track = this._avcTrack,
        state = track.naluState || 0,
        lastState = state;
    var units = [],
        unit = void 0,
        unitType = void 0,
        lastUnitStart = -1,
        lastUnitType = void 0;
    // logger.log('PES:' + Hex.hexDump(array));

    if (state === -1) {
      // special use case where we found 3 or 4-byte start codes exactly at the end of previous PES packet
      lastUnitStart = 0;
      // NALu type is value read from offset 0
      lastUnitType = array[0] & 0x1f;
      state = 0;
      i = 1;
    }

    while (i < len) {
      value = array[i++];
      // optimization. state 0 and 1 are the predominant case. let's handle them outside of the switch/case
      if (!state) {
        state = value ? 0 : 1;
        continue;
      }
      if (state === 1) {
        state = value ? 0 : 2;
        continue;
      }
      // here we have state either equal to 2 or 3
      if (!value) {
        state = 3;
      } else if (value === 1) {
        if (lastUnitStart >= 0) {
          unit = { data: array.subarray(lastUnitStart, i - state - 1), type: lastUnitType };
          // logger.log('pushing NALU, type/size:' + unit.type + '/' + unit.data.byteLength);
          units.push(unit);
        } else {
          // lastUnitStart is undefined => this is the first start code found in this PES packet
          // first check if start code delimiter is overlapping between 2 PES packets,
          // ie it started in last packet (lastState not zero)
          // and ended at the beginning of this PES packet (i <= 4 - lastState)
          var lastUnit = this._getLastNalUnit();
          if (lastUnit) {
            if (lastState && i <= 4 - lastState) {
              // start delimiter overlapping between PES packets
              // strip start delimiter bytes from the end of last NAL unit
              // check if lastUnit had a state different from zero
              if (lastUnit.state) {
                // strip last bytes
                lastUnit.data = lastUnit.data.subarray(0, lastUnit.data.byteLength - lastState);
              }
            }
            // If NAL units are not starting right at the beginning of the PES packet, push preceding data into previous NAL unit.
            overflow = i - state - 1;
            if (overflow > 0) {
              // logger.log('first NALU found with overflow:' + overflow);
              var tmp = new Uint8Array(lastUnit.data.byteLength + overflow);
              tmp.set(lastUnit.data, 0);
              tmp.set(array.subarray(0, overflow), lastUnit.data.byteLength);
              lastUnit.data = tmp;
            }
          }
        }
        // check if we can read unit type
        if (i < len) {
          unitType = array[i] & 0x1f;
          // logger.log('find NALU @ offset:' + i + ',type:' + unitType);
          lastUnitStart = i;
          lastUnitType = unitType;
          state = 0;
        } else {
          // not enough byte to read unit type. let's read it on next PES parsing
          state = -1;
        }
      } else {
        state = 0;
      }
    }
    if (lastUnitStart >= 0 && state >= 0) {
      unit = { data: array.subarray(lastUnitStart, len), type: lastUnitType, state: state };
      units.push(unit);
      // logger.log('pushing NALU, type/size/state:' + unit.type + '/' + unit.data.byteLength + '/' + state);
    }
    // no NALu found
    if (units.length === 0) {
      // append pes.data to previous NAL unit
      var _lastUnit = this._getLastNalUnit();
      if (_lastUnit) {
        var _tmp = new Uint8Array(_lastUnit.data.byteLength + array.byteLength);
        _tmp.set(_lastUnit.data, 0);
        _tmp.set(array, _lastUnit.data.byteLength);
        _lastUnit.data = _tmp;
      }
    }
    track.naluState = state;
    return units;
  };

  /**
   * remove Emulation Prevention bytes from a RBSP
   */


  TSDemuxer.prototype.discardEPB = function discardEPB(data) {
    var length = data.byteLength,
        EPBPositions = [],
        i = 1,
        newLength = void 0,
        newData = void 0;

    // Find all `Emulation Prevention Bytes`
    while (i < length - 2) {
      if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0x03) {
        EPBPositions.push(i + 2);
        i += 2;
      } else {
        i++;
      }
    }

    // If no Emulation Prevention Bytes were found just return the original
    // array
    if (EPBPositions.length === 0) {
      return data;
    }

    // Create a new array to hold the NAL unit data
    newLength = length - EPBPositions.length;
    newData = new Uint8Array(newLength);
    var sourceIndex = 0;

    for (i = 0; i < newLength; sourceIndex++, i++) {
      if (sourceIndex === EPBPositions[0]) {
        // Skip this byte
        sourceIndex++;
        // Remove this position index
        EPBPositions.shift();
      }
      newData[i] = data[sourceIndex];
    }
    return newData;
  };

  TSDemuxer.prototype._parseAACPES = function _parseAACPES(pes) {
    var track = this._audioTrack,
        data = pes.data,
        pts = pes.pts,
        startOffset = 0,
        aacOverFlow = this.aacOverFlow,
        aacLastPTS = this.aacLastPTS,
        frameDuration = void 0,
        frameIndex = void 0,
        offset = void 0,
        stamp = void 0,
        len = void 0;
    if (aacOverFlow) {
      var tmp = new Uint8Array(aacOverFlow.byteLength + data.byteLength);
      tmp.set(aacOverFlow, 0);
      tmp.set(data, aacOverFlow.byteLength);
      // logger.log(`AAC: append overflowing ${aacOverFlow.byteLength} bytes to beginning of new PES`);
      data = tmp;
    }
    // look for ADTS header (0xFFFx)
    for (offset = startOffset, len = data.length; offset < len - 1; offset++) {
      if (isHeader(data, offset)) {
        break;
      }
    }
    // if ADTS header does not start straight from the beginning of the PES payload, raise an error
    if (offset) {
      var reason = void 0,
          fatal = void 0;
      if (offset < len - 1) {
        reason = 'AAC PES did not start with ADTS header,offset:' + offset;
        fatal = false;
      } else {
        reason = 'no ADTS header found in AAC PES';
        fatal = true;
      }
      logger["b" /* logger */].warn('parsing error:' + reason);
      this.observer.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].MEDIA_ERROR, details: errors["a" /* ErrorDetails */].FRAG_PARSING_ERROR, fatal: fatal, reason: reason });
      if (fatal) {
        return;
      }
    }

    initTrackConfig(track, this.observer, data, offset, this.audioCodec);
    frameIndex = 0;
    frameDuration = getFrameDuration(track.samplerate);

    // if last AAC frame is overflowing, we should ensure timestamps are contiguous:
    // first sample PTS should be equal to last sample PTS + frameDuration
    if (aacOverFlow && aacLastPTS) {
      var newPTS = aacLastPTS + frameDuration;
      if (Math.abs(newPTS - pts) > 1) {
        logger["b" /* logger */].log('AAC: align PTS for overlapping frames by ' + Math.round((newPTS - pts) / 90));
        pts = newPTS;
      }
    }

    // scan for aac samples
    while (offset < len) {
      if (isHeader(data, offset) && offset + 5 < len) {
        var frame = appendFrame(track, data, offset, pts, frameIndex);
        if (frame) {
          // logger.log(`${Math.round(frame.sample.pts)} : AAC`);
          offset += frame.length;
          stamp = frame.sample.pts;
          frameIndex++;
        } else {
          // logger.log('Unable to parse AAC frame');
          break;
        }
      } else {
        // nothing found, keep looking
        offset++;
      }
    }

    if (offset < len) {
      aacOverFlow = data.subarray(offset, len);
      // logger.log(`AAC: overflow detected:${len-offset}`);
    } else {
      aacOverFlow = null;
    }

    this.aacOverFlow = aacOverFlow;
    this.aacLastPTS = stamp;
  };

  TSDemuxer.prototype._parseMPEGPES = function _parseMPEGPES(pes) {
    var data = pes.data;
    var length = data.length;
    var frameIndex = 0;
    var offset = 0;
    var pts = pes.pts;

    while (offset < length) {
      if (mpegaudio.isHeader(data, offset)) {
        var frame = mpegaudio.appendFrame(this._audioTrack, data, offset, pts, frameIndex);
        if (frame) {
          offset += frame.length;
          frameIndex++;
        } else {
          // logger.log('Unable to parse Mpeg audio frame');
          break;
        }
      } else {
        // nothing found, keep looking
        offset++;
      }
    }
  };

  TSDemuxer.prototype._parseID3PES = function _parseID3PES(pes) {
    this._id3Track.samples.push(pes);
  };

  return TSDemuxer;
}();

/* harmony default export */ var tsdemuxer = (tsdemuxer_TSDemuxer);
// CONCATENATED MODULE: ./src/demux/mp3demuxer.js
function mp3demuxer__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * MP3 demuxer
 */




var mp3demuxer_MP3Demuxer = function () {
  function MP3Demuxer(observer, remuxer, config) {
    mp3demuxer__classCallCheck(this, MP3Demuxer);

    this.observer = observer;
    this.config = config;
    this.remuxer = remuxer;
  }

  MP3Demuxer.prototype.resetInitSegment = function resetInitSegment(initSegment, audioCodec, videoCodec, duration) {
    this._audioTrack = { container: 'audio/mpeg', type: 'audio', id: -1, sequenceNumber: 0, isAAC: false, samples: [], len: 0, manifestCodec: audioCodec, duration: duration, inputTimeScale: 90000 };
  };

  MP3Demuxer.prototype.resetTimeStamp = function resetTimeStamp() {};

  MP3Demuxer.probe = function probe(data) {
    // check if data contains ID3 timestamp and MPEG sync word
    var offset = void 0,
        length = void 0;
    var id3Data = id3["a" /* default */].getID3Data(data, 0);
    if (id3Data && id3["a" /* default */].getTimeStamp(id3Data) !== undefined) {
      // Look for MPEG header | 1111 1111 | 111X XYZX | where X can be either 0 or 1 and Y or Z should be 1
      // Layer bits (position 14 and 15) in header should be always different from 0 (Layer I or Layer II or Layer III)
      // More info http://www.mp3-tech.org/programmer/frame_header.html
      for (offset = id3Data.length, length = Math.min(data.length - 1, offset + 100); offset < length; offset++) {
        if (mpegaudio.probe(data, offset)) {
          logger["b" /* logger */].log('MPEG Audio sync word found !');
          return true;
        }
      }
    }
    return false;
  };

  // feed incoming data to the front of the parsing pipeline


  MP3Demuxer.prototype.append = function append(data, timeOffset, contiguous, accurateTimeOffset) {
    var id3Data = id3["a" /* default */].getID3Data(data, 0);
    var timestamp = id3["a" /* default */].getTimeStamp(id3Data);
    var pts = timestamp ? 90 * timestamp : timeOffset * 90000;
    var offset = id3Data.length;
    var length = data.length;
    var frameIndex = 0,
        stamp = 0;
    var track = this._audioTrack;

    var id3Samples = [{ pts: pts, dts: pts, data: id3Data }];

    while (offset < length) {
      if (mpegaudio.isHeader(data, offset)) {
        var frame = mpegaudio.appendFrame(track, data, offset, pts, frameIndex);
        if (frame) {
          offset += frame.length;
          stamp = frame.sample.pts;
          frameIndex++;
        } else {
          // logger.log('Unable to parse Mpeg audio frame');
          break;
        }
      } else if (id3["a" /* default */].isHeader(data, offset)) {
        id3Data = id3["a" /* default */].getID3Data(data, offset);
        id3Samples.push({ pts: stamp, dts: stamp, data: id3Data });
        offset += id3Data.length;
      } else {
        // nothing found, keep looking
        offset++;
      }
    }

    this.remuxer.remux(track, { samples: [] }, { samples: id3Samples, inputTimeScale: 90000 }, { samples: [] }, timeOffset, contiguous, accurateTimeOffset);
  };

  MP3Demuxer.prototype.destroy = function destroy() {};

  return MP3Demuxer;
}();

/* harmony default export */ var mp3demuxer = (mp3demuxer_MP3Demuxer);
// CONCATENATED MODULE: ./src/remux/aac-helper.js
function aac_helper__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *  AAC helper
 */

var AAC = function () {
  function AAC() {
    aac_helper__classCallCheck(this, AAC);
  }

  AAC.getSilentFrame = function getSilentFrame(codec, channelCount) {
    switch (codec) {
      case 'mp4a.40.2':
        if (channelCount === 1) {
          return new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x23, 0x80]);
        } else if (channelCount === 2) {
          return new Uint8Array([0x21, 0x00, 0x49, 0x90, 0x02, 0x19, 0x00, 0x23, 0x80]);
        } else if (channelCount === 3) {
          return new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x20, 0x84, 0x01, 0x26, 0x40, 0x08, 0x64, 0x00, 0x8e]);
        } else if (channelCount === 4) {
          return new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x20, 0x84, 0x01, 0x26, 0x40, 0x08, 0x64, 0x00, 0x80, 0x2c, 0x80, 0x08, 0x02, 0x38]);
        } else if (channelCount === 5) {
          return new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x20, 0x84, 0x01, 0x26, 0x40, 0x08, 0x64, 0x00, 0x82, 0x30, 0x04, 0x99, 0x00, 0x21, 0x90, 0x02, 0x38]);
        } else if (channelCount === 6) {
          return new Uint8Array([0x00, 0xc8, 0x00, 0x80, 0x20, 0x84, 0x01, 0x26, 0x40, 0x08, 0x64, 0x00, 0x82, 0x30, 0x04, 0x99, 0x00, 0x21, 0x90, 0x02, 0x00, 0xb2, 0x00, 0x20, 0x08, 0xe0]);
        }

        break;
      // handle HE-AAC below (mp4a.40.5 / mp4a.40.29)
      default:
        if (channelCount === 1) {
          // ffmpeg -y -f lavfi -i "aevalsrc=0:d=0.05" -c:a libfdk_aac -profile:a aac_he -b:a 4k output.aac && hexdump -v -e '16/1 "0x%x," "\n"' -v output.aac
          return new Uint8Array([0x1, 0x40, 0x22, 0x80, 0xa3, 0x4e, 0xe6, 0x80, 0xba, 0x8, 0x0, 0x0, 0x0, 0x1c, 0x6, 0xf1, 0xc1, 0xa, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5e]);
        } else if (channelCount === 2) {
          // ffmpeg -y -f lavfi -i "aevalsrc=0|0:d=0.05" -c:a libfdk_aac -profile:a aac_he_v2 -b:a 4k output.aac && hexdump -v -e '16/1 "0x%x," "\n"' -v output.aac
          return new Uint8Array([0x1, 0x40, 0x22, 0x80, 0xa3, 0x5e, 0xe6, 0x80, 0xba, 0x8, 0x0, 0x0, 0x0, 0x0, 0x95, 0x0, 0x6, 0xf1, 0xa1, 0xa, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5e]);
        } else if (channelCount === 3) {
          // ffmpeg -y -f lavfi -i "aevalsrc=0|0|0:d=0.05" -c:a libfdk_aac -profile:a aac_he_v2 -b:a 4k output.aac && hexdump -v -e '16/1 "0x%x," "\n"' -v output.aac
          return new Uint8Array([0x1, 0x40, 0x22, 0x80, 0xa3, 0x5e, 0xe6, 0x80, 0xba, 0x8, 0x0, 0x0, 0x0, 0x0, 0x95, 0x0, 0x6, 0xf1, 0xa1, 0xa, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5a, 0x5e]);
        }
        break;
    }
    return null;
  };

  return AAC;
}();

/* harmony default export */ var aac_helper = (AAC);
// CONCATENATED MODULE: ./src/remux/mp4-generator.js
function mp4_generator__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Generate MP4 Box
*/

var UINT32_MAX = Math.pow(2, 32) - 1;

var MP4 = function () {
  function MP4() {
    mp4_generator__classCallCheck(this, MP4);
  }

  MP4.init = function init() {
    MP4.types = {
      avc1: [], // codingname
      avcC: [],
      btrt: [],
      dinf: [],
      dref: [],
      esds: [],
      ftyp: [],
      hdlr: [],
      mdat: [],
      mdhd: [],
      mdia: [],
      mfhd: [],
      minf: [],
      moof: [],
      moov: [],
      mp4a: [],
      '.mp3': [],
      mvex: [],
      mvhd: [],
      pasp: [],
      sdtp: [],
      stbl: [],
      stco: [],
      stsc: [],
      stsd: [],
      stsz: [],
      stts: [],
      tfdt: [],
      tfhd: [],
      traf: [],
      trak: [],
      trun: [],
      trex: [],
      tkhd: [],
      vmhd: [],
      smhd: []
    };

    var i = void 0;
    for (i in MP4.types) {
      if (MP4.types.hasOwnProperty(i)) {
        MP4.types[i] = [i.charCodeAt(0), i.charCodeAt(1), i.charCodeAt(2), i.charCodeAt(3)];
      }
    }

    var videoHdlr = new Uint8Array([0x00, // version 0
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, 0x00, 0x00, // pre_defined
    0x76, 0x69, 0x64, 0x65, // handler_type: 'vide'
    0x00, 0x00, 0x00, 0x00, // reserved
    0x00, 0x00, 0x00, 0x00, // reserved
    0x00, 0x00, 0x00, 0x00, // reserved
    0x56, 0x69, 0x64, 0x65, 0x6f, 0x48, 0x61, 0x6e, 0x64, 0x6c, 0x65, 0x72, 0x00 // name: 'VideoHandler'
    ]);

    var audioHdlr = new Uint8Array([0x00, // version 0
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, 0x00, 0x00, // pre_defined
    0x73, 0x6f, 0x75, 0x6e, // handler_type: 'soun'
    0x00, 0x00, 0x00, 0x00, // reserved
    0x00, 0x00, 0x00, 0x00, // reserved
    0x00, 0x00, 0x00, 0x00, // reserved
    0x53, 0x6f, 0x75, 0x6e, 0x64, 0x48, 0x61, 0x6e, 0x64, 0x6c, 0x65, 0x72, 0x00 // name: 'SoundHandler'
    ]);

    MP4.HDLR_TYPES = {
      'video': videoHdlr,
      'audio': audioHdlr
    };

    var dref = new Uint8Array([0x00, // version 0
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, 0x00, 0x01, // entry_count
    0x00, 0x00, 0x00, 0x0c, // entry_size
    0x75, 0x72, 0x6c, 0x20, // 'url' type
    0x00, // version 0
    0x00, 0x00, 0x01 // entry_flags
    ]);

    var stco = new Uint8Array([0x00, // version
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, 0x00, 0x00 // entry_count
    ]);

    MP4.STTS = MP4.STSC = MP4.STCO = stco;

    MP4.STSZ = new Uint8Array([0x00, // version
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, 0x00, 0x00, // sample_size
    0x00, 0x00, 0x00, 0x00 // sample_count
    ]);
    MP4.VMHD = new Uint8Array([0x00, // version
    0x00, 0x00, 0x01, // flags
    0x00, 0x00, // graphicsmode
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00 // opcolor
    ]);
    MP4.SMHD = new Uint8Array([0x00, // version
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, // balance
    0x00, 0x00 // reserved
    ]);

    MP4.STSD = new Uint8Array([0x00, // version 0
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, 0x00, 0x01]); // entry_count

    var majorBrand = new Uint8Array([105, 115, 111, 109]); // isom
    var avc1Brand = new Uint8Array([97, 118, 99, 49]); // avc1
    var minorVersion = new Uint8Array([0, 0, 0, 1]);

    MP4.FTYP = MP4.box(MP4.types.ftyp, majorBrand, minorVersion, majorBrand, avc1Brand);
    MP4.DINF = MP4.box(MP4.types.dinf, MP4.box(MP4.types.dref, dref));
  };

  MP4.box = function box(type) {
    var payload = Array.prototype.slice.call(arguments, 1),
        size = 8,
        i = payload.length,
        len = i,
        result = void 0;
    // calculate the total size we need to allocate
    while (i--) {
      size += payload[i].byteLength;
    }

    result = new Uint8Array(size);
    result[0] = size >> 24 & 0xff;
    result[1] = size >> 16 & 0xff;
    result[2] = size >> 8 & 0xff;
    result[3] = size & 0xff;
    result.set(type, 4);
    // copy the payload into the result
    for (i = 0, size = 8; i < len; i++) {
      // copy payload[i] array @ offset size
      result.set(payload[i], size);
      size += payload[i].byteLength;
    }
    return result;
  };

  MP4.hdlr = function hdlr(type) {
    return MP4.box(MP4.types.hdlr, MP4.HDLR_TYPES[type]);
  };

  MP4.mdat = function mdat(data) {
    return MP4.box(MP4.types.mdat, data);
  };

  MP4.mdhd = function mdhd(timescale, duration) {
    duration *= timescale;
    var upperWordDuration = Math.floor(duration / (UINT32_MAX + 1));
    var lowerWordDuration = Math.floor(duration % (UINT32_MAX + 1));
    return MP4.box(MP4.types.mdhd, new Uint8Array([0x01, // version 1
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, // creation_time
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, // modification_time
    timescale >> 24 & 0xFF, timescale >> 16 & 0xFF, timescale >> 8 & 0xFF, timescale & 0xFF, // timescale
    upperWordDuration >> 24, upperWordDuration >> 16 & 0xFF, upperWordDuration >> 8 & 0xFF, upperWordDuration & 0xFF, lowerWordDuration >> 24, lowerWordDuration >> 16 & 0xFF, lowerWordDuration >> 8 & 0xFF, lowerWordDuration & 0xFF, 0x55, 0xc4, // 'und' language (undetermined)
    0x00, 0x00]));
  };

  MP4.mdia = function mdia(track) {
    return MP4.box(MP4.types.mdia, MP4.mdhd(track.timescale, track.duration), MP4.hdlr(track.type), MP4.minf(track));
  };

  MP4.mfhd = function mfhd(sequenceNumber) {
    return MP4.box(MP4.types.mfhd, new Uint8Array([0x00, 0x00, 0x00, 0x00, // flags
    sequenceNumber >> 24, sequenceNumber >> 16 & 0xFF, sequenceNumber >> 8 & 0xFF, sequenceNumber & 0xFF // sequence_number
    ]));
  };

  MP4.minf = function minf(track) {
    if (track.type === 'audio') {
      return MP4.box(MP4.types.minf, MP4.box(MP4.types.smhd, MP4.SMHD), MP4.DINF, MP4.stbl(track));
    } else {
      return MP4.box(MP4.types.minf, MP4.box(MP4.types.vmhd, MP4.VMHD), MP4.DINF, MP4.stbl(track));
    }
  };

  MP4.moof = function moof(sn, baseMediaDecodeTime, track) {
    return MP4.box(MP4.types.moof, MP4.mfhd(sn), MP4.traf(track, baseMediaDecodeTime));
  };
  /**
  * @param tracks... (optional) {array} the tracks associated with this movie
  */


  MP4.moov = function moov(tracks) {
    var i = tracks.length,
        boxes = [];

    while (i--) {
      boxes[i] = MP4.trak(tracks[i]);
    }

    return MP4.box.apply(null, [MP4.types.moov, MP4.mvhd(tracks[0].timescale, tracks[0].duration)].concat(boxes).concat(MP4.mvex(tracks)));
  };

  MP4.mvex = function mvex(tracks) {
    var i = tracks.length,
        boxes = [];

    while (i--) {
      boxes[i] = MP4.trex(tracks[i]);
    }

    return MP4.box.apply(null, [MP4.types.mvex].concat(boxes));
  };

  MP4.mvhd = function mvhd(timescale, duration) {
    duration *= timescale;
    var upperWordDuration = Math.floor(duration / (UINT32_MAX + 1));
    var lowerWordDuration = Math.floor(duration % (UINT32_MAX + 1));
    var bytes = new Uint8Array([0x01, // version 1
    0x00, 0x00, 0x00, // flags
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, // creation_time
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, // modification_time
    timescale >> 24 & 0xFF, timescale >> 16 & 0xFF, timescale >> 8 & 0xFF, timescale & 0xFF, // timescale
    upperWordDuration >> 24, upperWordDuration >> 16 & 0xFF, upperWordDuration >> 8 & 0xFF, upperWordDuration & 0xFF, lowerWordDuration >> 24, lowerWordDuration >> 16 & 0xFF, lowerWordDuration >> 8 & 0xFF, lowerWordDuration & 0xFF, 0x00, 0x01, 0x00, 0x00, // 1.0 rate
    0x01, 0x00, // 1.0 volume
    0x00, 0x00, // reserved
    0x00, 0x00, 0x00, 0x00, // reserved
    0x00, 0x00, 0x00, 0x00, // reserved
    0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00, 0x00, 0x00, // transformation: unity matrix
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // pre_defined
    0xff, 0xff, 0xff, 0xff // next_track_ID
    ]);
    return MP4.box(MP4.types.mvhd, bytes);
  };

  MP4.sdtp = function sdtp(track) {
    var samples = track.samples || [],
        bytes = new Uint8Array(4 + samples.length),
        flags = void 0,
        i = void 0;
    // leave the full box header (4 bytes) all zero
    // write the sample table
    for (i = 0; i < samples.length; i++) {
      flags = samples[i].flags;
      bytes[i + 4] = flags.dependsOn << 4 | flags.isDependedOn << 2 | flags.hasRedundancy;
    }

    return MP4.box(MP4.types.sdtp, bytes);
  };

  MP4.stbl = function stbl(track) {
    return MP4.box(MP4.types.stbl, MP4.stsd(track), MP4.box(MP4.types.stts, MP4.STTS), MP4.box(MP4.types.stsc, MP4.STSC), MP4.box(MP4.types.stsz, MP4.STSZ), MP4.box(MP4.types.stco, MP4.STCO));
  };

  MP4.avc1 = function avc1(track) {
    var sps = [],
        pps = [],
        i = void 0,
        data = void 0,
        len = void 0;
    // assemble the SPSs

    for (i = 0; i < track.sps.length; i++) {
      data = track.sps[i];
      len = data.byteLength;
      sps.push(len >>> 8 & 0xFF);
      sps.push(len & 0xFF);

      // SPS
      sps = sps.concat(Array.prototype.slice.call(data));
    }

    // assemble the PPSs
    for (i = 0; i < track.pps.length; i++) {
      data = track.pps[i];
      len = data.byteLength;
      pps.push(len >>> 8 & 0xFF);
      pps.push(len & 0xFF);

      pps = pps.concat(Array.prototype.slice.call(data));
    }

    var avcc = MP4.box(MP4.types.avcC, new Uint8Array([0x01, // version
    sps[3], // profile
    sps[4], // profile compat
    sps[5], // level
    0xfc | 3, // lengthSizeMinusOne, hard-coded to 4 bytes
    0xE0 | track.sps.length // 3bit reserved (111) + numOfSequenceParameterSets
    ].concat(sps).concat([track.pps.length // numOfPictureParameterSets
    ]).concat(pps))),
        // "PPS"
    width = track.width,
        height = track.height,
        hSpacing = track.pixelRatio[0],
        vSpacing = track.pixelRatio[1];

    return MP4.box(MP4.types.avc1, new Uint8Array([0x00, 0x00, 0x00, // reserved
    0x00, 0x00, 0x00, // reserved
    0x00, 0x01, // data_reference_index
    0x00, 0x00, // pre_defined
    0x00, 0x00, // reserved
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // pre_defined
    width >> 8 & 0xFF, width & 0xff, // width
    height >> 8 & 0xFF, height & 0xff, // height
    0x00, 0x48, 0x00, 0x00, // horizresolution
    0x00, 0x48, 0x00, 0x00, // vertresolution
    0x00, 0x00, 0x00, 0x00, // reserved
    0x00, 0x01, // frame_count
    0x12, 0x64, 0x61, 0x69, 0x6C, // dailymotion/hls.js
    0x79, 0x6D, 0x6F, 0x74, 0x69, 0x6F, 0x6E, 0x2F, 0x68, 0x6C, 0x73, 0x2E, 0x6A, 0x73, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // compressorname
    0x00, 0x18, // depth = 24
    0x11, 0x11]), // pre_defined = -1
    avcc, MP4.box(MP4.types.btrt, new Uint8Array([0x00, 0x1c, 0x9c, 0x80, // bufferSizeDB
    0x00, 0x2d, 0xc6, 0xc0, // maxBitrate
    0x00, 0x2d, 0xc6, 0xc0])), // avgBitrate
    MP4.box(MP4.types.pasp, new Uint8Array([hSpacing >> 24, // hSpacing
    hSpacing >> 16 & 0xFF, hSpacing >> 8 & 0xFF, hSpacing & 0xFF, vSpacing >> 24, // vSpacing
    vSpacing >> 16 & 0xFF, vSpacing >> 8 & 0xFF, vSpacing & 0xFF])));
  };

  MP4.esds = function esds(track) {
    var configlen = track.config.length;
    return new Uint8Array([0x00, // version 0
    0x00, 0x00, 0x00, // flags

    0x03, // descriptor_type
    0x17 + configlen, // length
    0x00, 0x01, // es_id
    0x00, // stream_priority

    0x04, // descriptor_type
    0x0f + configlen, // length
    0x40, // codec : mpeg4_audio
    0x15, // stream_type
    0x00, 0x00, 0x00, // buffer_size
    0x00, 0x00, 0x00, 0x00, // maxBitrate
    0x00, 0x00, 0x00, 0x00, // avgBitrate

    0x05 // descriptor_type
    ].concat([configlen]).concat(track.config).concat([0x06, 0x01, 0x02])); // GASpecificConfig)); // length + audio config descriptor
  };

  MP4.mp4a = function mp4a(track) {
    var samplerate = track.samplerate;
    return MP4.box(MP4.types.mp4a, new Uint8Array([0x00, 0x00, 0x00, // reserved
    0x00, 0x00, 0x00, // reserved
    0x00, 0x01, // data_reference_index
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // reserved
    0x00, track.channelCount, // channelcount
    0x00, 0x10, // sampleSize:16bits
    0x00, 0x00, 0x00, 0x00, // reserved2
    samplerate >> 8 & 0xFF, samplerate & 0xff, //
    0x00, 0x00]), MP4.box(MP4.types.esds, MP4.esds(track)));
  };

  MP4.mp3 = function mp3(track) {
    var samplerate = track.samplerate;
    return MP4.box(MP4.types['.mp3'], new Uint8Array([0x00, 0x00, 0x00, // reserved
    0x00, 0x00, 0x00, // reserved
    0x00, 0x01, // data_reference_index
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // reserved
    0x00, track.channelCount, // channelcount
    0x00, 0x10, // sampleSize:16bits
    0x00, 0x00, 0x00, 0x00, // reserved2
    samplerate >> 8 & 0xFF, samplerate & 0xff, //
    0x00, 0x00]));
  };

  MP4.stsd = function stsd(track) {
    if (track.type === 'audio') {
      if (!track.isAAC && track.codec === 'mp3') {
        return MP4.box(MP4.types.stsd, MP4.STSD, MP4.mp3(track));
      }

      return MP4.box(MP4.types.stsd, MP4.STSD, MP4.mp4a(track));
    } else {
      return MP4.box(MP4.types.stsd, MP4.STSD, MP4.avc1(track));
    }
  };

  MP4.tkhd = function tkhd(track) {
    var id = track.id,
        duration = track.duration * track.timescale,
        width = track.width,
        height = track.height,
        upperWordDuration = Math.floor(duration / (UINT32_MAX + 1)),
        lowerWordDuration = Math.floor(duration % (UINT32_MAX + 1));
    return MP4.box(MP4.types.tkhd, new Uint8Array([0x01, // version 1
    0x00, 0x00, 0x07, // flags
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, // creation_time
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, // modification_time
    id >> 24 & 0xFF, id >> 16 & 0xFF, id >> 8 & 0xFF, id & 0xFF, // track_ID
    0x00, 0x00, 0x00, 0x00, // reserved
    upperWordDuration >> 24, upperWordDuration >> 16 & 0xFF, upperWordDuration >> 8 & 0xFF, upperWordDuration & 0xFF, lowerWordDuration >> 24, lowerWordDuration >> 16 & 0xFF, lowerWordDuration >> 8 & 0xFF, lowerWordDuration & 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // reserved
    0x00, 0x00, // layer
    0x00, 0x00, // alternate_group
    0x00, 0x00, // non-audio track volume
    0x00, 0x00, // reserved
    0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00, 0x00, 0x00, // transformation: unity matrix
    width >> 8 & 0xFF, width & 0xFF, 0x00, 0x00, // width
    height >> 8 & 0xFF, height & 0xFF, 0x00, 0x00 // height
    ]));
  };

  MP4.traf = function traf(track, baseMediaDecodeTime) {
    var sampleDependencyTable = MP4.sdtp(track),
        id = track.id,
        upperWordBaseMediaDecodeTime = Math.floor(baseMediaDecodeTime / (UINT32_MAX + 1)),
        lowerWordBaseMediaDecodeTime = Math.floor(baseMediaDecodeTime % (UINT32_MAX + 1));
    return MP4.box(MP4.types.traf, MP4.box(MP4.types.tfhd, new Uint8Array([0x00, // version 0
    0x00, 0x00, 0x00, // flags
    id >> 24, id >> 16 & 0XFF, id >> 8 & 0XFF, id & 0xFF]) // track_ID
    ), MP4.box(MP4.types.tfdt, new Uint8Array([0x01, // version 1
    0x00, 0x00, 0x00, // flags
    upperWordBaseMediaDecodeTime >> 24, upperWordBaseMediaDecodeTime >> 16 & 0XFF, upperWordBaseMediaDecodeTime >> 8 & 0XFF, upperWordBaseMediaDecodeTime & 0xFF, lowerWordBaseMediaDecodeTime >> 24, lowerWordBaseMediaDecodeTime >> 16 & 0XFF, lowerWordBaseMediaDecodeTime >> 8 & 0XFF, lowerWordBaseMediaDecodeTime & 0xFF])), MP4.trun(track, sampleDependencyTable.length + 16 + // tfhd
    20 + // tfdt
    8 + // traf header
    16 + // mfhd
    8 + // moof header
    8), // mdat header
    sampleDependencyTable);
  };

  /**
   * Generate a track box.
   * @param track {object} a track definition
   * @return {Uint8Array} the track box
   */


  MP4.trak = function trak(track) {
    track.duration = track.duration || 0xffffffff;
    return MP4.box(MP4.types.trak, MP4.tkhd(track), MP4.mdia(track));
  };

  MP4.trex = function trex(track) {
    var id = track.id;
    return MP4.box(MP4.types.trex, new Uint8Array([0x00, // version 0
    0x00, 0x00, 0x00, // flags
    id >> 24, id >> 16 & 0XFF, id >> 8 & 0XFF, id & 0xFF, // track_ID
    0x00, 0x00, 0x00, 0x01, // default_sample_description_index
    0x00, 0x00, 0x00, 0x00, // default_sample_duration
    0x00, 0x00, 0x00, 0x00, // default_sample_size
    0x00, 0x01, 0x00, 0x01 // default_sample_flags
    ]));
  };

  MP4.trun = function trun(track, offset) {
    var samples = track.samples || [],
        len = samples.length,
        arraylen = 12 + 16 * len,
        array = new Uint8Array(arraylen),
        i = void 0,
        sample = void 0,
        duration = void 0,
        size = void 0,
        flags = void 0,
        cts = void 0;
    offset += 8 + arraylen;
    array.set([0x00, // version 0
    0x00, 0x0f, 0x01, // flags
    len >>> 24 & 0xFF, len >>> 16 & 0xFF, len >>> 8 & 0xFF, len & 0xFF, // sample_count
    offset >>> 24 & 0xFF, offset >>> 16 & 0xFF, offset >>> 8 & 0xFF, offset & 0xFF // data_offset
    ], 0);
    for (i = 0; i < len; i++) {
      sample = samples[i];
      duration = sample.duration;
      size = sample.size;
      flags = sample.flags;
      cts = sample.cts;
      array.set([duration >>> 24 & 0xFF, duration >>> 16 & 0xFF, duration >>> 8 & 0xFF, duration & 0xFF, // sample_duration
      size >>> 24 & 0xFF, size >>> 16 & 0xFF, size >>> 8 & 0xFF, size & 0xFF, // sample_size
      flags.isLeading << 2 | flags.dependsOn, flags.isDependedOn << 6 | flags.hasRedundancy << 4 | flags.paddingValue << 1 | flags.isNonSync, flags.degradPrio & 0xF0 << 8, flags.degradPrio & 0x0F, // sample_flags
      cts >>> 24 & 0xFF, cts >>> 16 & 0xFF, cts >>> 8 & 0xFF, cts & 0xFF // sample_composition_time_offset
      ], 12 + 16 * i);
    }
    return MP4.box(MP4.types.trun, array);
  };

  MP4.initSegment = function initSegment(tracks) {
    if (!MP4.types) {
      MP4.init();
    }

    var movie = MP4.moov(tracks),
        result = void 0;
    result = new Uint8Array(MP4.FTYP.byteLength + movie.byteLength);
    result.set(MP4.FTYP);
    result.set(movie, MP4.FTYP.byteLength);
    return result;
  };

  return MP4;
}();

/* harmony default export */ var mp4_generator = (MP4);
// CONCATENATED MODULE: ./src/remux/mp4-remuxer.js
function mp4_remuxer__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * fMP4 remuxer
*/









// 10 seconds
var MAX_SILENT_FRAME_DURATION = 10 * 1000;

var mp4_remuxer_MP4Remuxer = function () {
  function MP4Remuxer(observer, config, typeSupported, vendor) {
    mp4_remuxer__classCallCheck(this, MP4Remuxer);

    this.observer = observer;
    this.config = config;
    this.typeSupported = typeSupported;
    var userAgent = navigator.userAgent;
    this.isSafari = vendor && vendor.indexOf('Apple') > -1 && userAgent && !userAgent.match('CriOS');
    this.ISGenerated = false;
  }

  MP4Remuxer.prototype.destroy = function destroy() {};

  MP4Remuxer.prototype.resetTimeStamp = function resetTimeStamp(defaultTimeStamp) {
    this._initPTS = this._initDTS = defaultTimeStamp;
  };

  MP4Remuxer.prototype.resetInitSegment = function resetInitSegment() {
    this.ISGenerated = false;
  };

  MP4Remuxer.prototype.remux = function remux(audioTrack, videoTrack, id3Track, textTrack, timeOffset, contiguous, accurateTimeOffset) {
    // generate Init Segment if needed
    if (!this.ISGenerated) {
      this.generateIS(audioTrack, videoTrack, timeOffset);
    }

    if (this.ISGenerated) {
      var nbAudioSamples = audioTrack.samples.length;
      var nbVideoSamples = videoTrack.samples.length;
      var audioTimeOffset = timeOffset;
      var videoTimeOffset = timeOffset;
      if (nbAudioSamples && nbVideoSamples) {
        // timeOffset is expected to be the offset of the first timestamp of this fragment (first DTS)
        // if first audio DTS is not aligned with first video DTS then we need to take that into account
        // when providing timeOffset to remuxAudio / remuxVideo. if we don't do that, there might be a permanent / small
        // drift between audio and video streams
        var audiovideoDeltaDts = (audioTrack.samples[0].dts - videoTrack.samples[0].dts) / videoTrack.inputTimeScale;
        audioTimeOffset += Math.max(0, audiovideoDeltaDts);
        videoTimeOffset += Math.max(0, -audiovideoDeltaDts);
      }
      // Purposefully remuxing audio before video, so that remuxVideo can use nextAudioPts, which is
      // calculated in remuxAudio.
      // logger.log('nb AAC samples:' + audioTrack.samples.length);
      if (nbAudioSamples) {
        // if initSegment was generated without video samples, regenerate it again
        if (!audioTrack.timescale) {
          logger["b" /* logger */].warn('regenerate InitSegment as audio detected');
          this.generateIS(audioTrack, videoTrack, timeOffset);
        }
        var audioData = this.remuxAudio(audioTrack, audioTimeOffset, contiguous, accurateTimeOffset);
        // logger.log('nb AVC samples:' + videoTrack.samples.length);
        if (nbVideoSamples) {
          var audioTrackLength = void 0;
          if (audioData) {
            audioTrackLength = audioData.endPTS - audioData.startPTS;
          }

          // if initSegment was generated without video samples, regenerate it again
          if (!videoTrack.timescale) {
            logger["b" /* logger */].warn('regenerate InitSegment as video detected');
            this.generateIS(audioTrack, videoTrack, timeOffset);
          }
          this.remuxVideo(videoTrack, videoTimeOffset, contiguous, audioTrackLength, accurateTimeOffset);
        }
      } else {
        // logger.log('nb AVC samples:' + videoTrack.samples.length);
        if (nbVideoSamples) {
          var videoData = this.remuxVideo(videoTrack, videoTimeOffset, contiguous, 0, accurateTimeOffset);
          if (videoData && audioTrack.codec) {
            this.remuxEmptyAudio(audioTrack, audioTimeOffset, contiguous, videoData);
          }
        }
      }
    }
    // logger.log('nb ID3 samples:' + audioTrack.samples.length);
    if (id3Track.samples.length) {
      this.remuxID3(id3Track, timeOffset);
    }

    // logger.log('nb ID3 samples:' + audioTrack.samples.length);
    if (textTrack.samples.length) {
      this.remuxText(textTrack, timeOffset);
    }

    // notify end of parsing
    this.observer.trigger(events["a" /* default */].FRAG_PARSED);
  };

  MP4Remuxer.prototype.generateIS = function generateIS(audioTrack, videoTrack, timeOffset) {
    var observer = this.observer,
        audioSamples = audioTrack.samples,
        videoSamples = videoTrack.samples,
        typeSupported = this.typeSupported,
        container = 'audio/mp4',
        tracks = {},
        data = { tracks: tracks },
        computePTSDTS = this._initPTS === undefined,
        initPTS = void 0,
        initDTS = void 0;

    if (computePTSDTS) {
      initPTS = initDTS = Infinity;
    }

    if (audioTrack.config && audioSamples.length) {
      // let's use audio sampling rate as MP4 time scale.
      // rationale is that there is a integer nb of audio frames per audio sample (1024 for AAC)
      // using audio sampling rate here helps having an integer MP4 frame duration
      // this avoids potential rounding issue and AV sync issue
      audioTrack.timescale = audioTrack.samplerate;
      logger["b" /* logger */].log('audio sampling rate : ' + audioTrack.samplerate);
      if (!audioTrack.isAAC) {
        if (typeSupported.mpeg) {
          // Chrome and Safari
          container = 'audio/mpeg';
          audioTrack.codec = '';
        } else if (typeSupported.mp3) {
          // Firefox
          audioTrack.codec = 'mp3';
        }
      }
      tracks.audio = {
        container: container,
        codec: audioTrack.codec,
        initSegment: !audioTrack.isAAC && typeSupported.mpeg ? new Uint8Array() : mp4_generator.initSegment([audioTrack]),
        metadata: {
          channelCount: audioTrack.channelCount
        }
      };
      if (computePTSDTS) {
        // remember first PTS of this demuxing context. for audio, PTS = DTS
        initPTS = initDTS = audioSamples[0].pts - audioTrack.inputTimeScale * timeOffset;
      }
    }

    if (videoTrack.sps && videoTrack.pps && videoSamples.length) {
      // let's use input time scale as MP4 video timescale
      // we use input time scale straight away to avoid rounding issues on frame duration / cts computation
      var inputTimeScale = videoTrack.inputTimeScale;
      videoTrack.timescale = inputTimeScale;
      tracks.video = {
        container: 'video/mp4',
        codec: videoTrack.codec,
        initSegment: mp4_generator.initSegment([videoTrack]),
        metadata: {
          width: videoTrack.width,
          height: videoTrack.height
        }
      };
      if (computePTSDTS) {
        initPTS = Math.min(initPTS, videoSamples[0].pts - inputTimeScale * timeOffset);
        initDTS = Math.min(initDTS, videoSamples[0].dts - inputTimeScale * timeOffset);
        this.observer.trigger(events["a" /* default */].INIT_PTS_FOUND, { initPTS: initPTS });
      }
    }

    if (Object.keys(tracks).length) {
      observer.trigger(events["a" /* default */].FRAG_PARSING_INIT_SEGMENT, data);
      this.ISGenerated = true;
      if (computePTSDTS) {
        this._initPTS = initPTS;
        this._initDTS = initDTS;
      }
    } else {
      observer.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].MEDIA_ERROR, details: errors["a" /* ErrorDetails */].FRAG_PARSING_ERROR, fatal: false, reason: 'no audio/video samples found' });
    }
  };

  MP4Remuxer.prototype.remuxVideo = function remuxVideo(track, timeOffset, contiguous, audioTrackLength, accurateTimeOffset) {
    var offset = 8,
        timeScale = track.timescale,
        mp4SampleDuration = void 0,
        mdat = void 0,
        moof = void 0,
        firstPTS = void 0,
        firstDTS = void 0,
        nextDTS = void 0,
        lastPTS = void 0,
        lastDTS = void 0,
        inputSamples = track.samples,
        outputSamples = [],
        nbSamples = inputSamples.length,
        ptsNormalize = this._PTSNormalize,
        initDTS = this._initDTS;

    // for (let i = 0; i < track.samples.length; i++) {
    //   let avcSample = track.samples[i];
    //   let units = avcSample.units;
    //   let unitsString = '';
    //   for (let j = 0; j < units.length ; j++) {
    //     unitsString += units[j].type + ',';
    //     if (units[j].data.length < 500) {
    //       unitsString += Hex.hexDump(units[j].data);
    //     }
    //   }
    //   logger.log(avcSample.pts + '/' + avcSample.dts + ',' + unitsString + avcSample.units.length);
    // }

    // if parsed fragment is contiguous with last one, let's use last DTS value as reference
    var nextAvcDts = this.nextAvcDts;

    var isSafari = this.isSafari;

    if (nbSamples === 0) {
      return;
    }

    // Safari does not like overlapping DTS on consecutive fragments. let's use nextAvcDts to overcome this if fragments are consecutive
    if (isSafari) {
      // also consider consecutive fragments as being contiguous (even if a level switch occurs),
      // for sake of clarity:
      // consecutive fragments are frags with
      //  - less than 100ms gaps between new time offset (if accurate) and next expected PTS OR
      //  - less than 200 ms PTS gaps (timeScale/5)
      contiguous |= inputSamples.length && nextAvcDts && (accurateTimeOffset && Math.abs(timeOffset - nextAvcDts / timeScale) < 0.1 || Math.abs(inputSamples[0].pts - nextAvcDts - initDTS) < timeScale / 5);
    }

    if (!contiguous) {
      // if not contiguous, let's use target timeOffset
      nextAvcDts = timeOffset * timeScale;
    }

    // PTS is coded on 33bits, and can loop from -2^32 to 2^32
    // ptsNormalize will make PTS/DTS value monotonic, we use last known DTS value as reference value
    inputSamples.forEach(function (sample) {
      sample.pts = ptsNormalize(sample.pts - initDTS, nextAvcDts);
      sample.dts = ptsNormalize(sample.dts - initDTS, nextAvcDts);
    });

    // sort video samples by DTS then PTS then demux id order
    inputSamples.sort(function (a, b) {
      var deltadts = a.dts - b.dts;
      var deltapts = a.pts - b.pts;
      return deltadts || deltapts || a.id - b.id;
    });

    // handle broken streams with PTS < DTS, tolerance up 200ms (18000 in 90kHz timescale)
    var PTSDTSshift = inputSamples.reduce(function (prev, curr) {
      return Math.max(Math.min(prev, curr.pts - curr.dts), -18000);
    }, 0);
    if (PTSDTSshift < 0) {
      logger["b" /* logger */].warn('PTS < DTS detected in video samples, shifting DTS by ' + Math.round(PTSDTSshift / 90) + ' ms to overcome this issue');
      for (var i = 0; i < inputSamples.length; i++) {
        inputSamples[i].dts += PTSDTSshift;
      }
    }

    // compute first DTS and last DTS, normalize them against reference value
    var sample = inputSamples[0];
    firstDTS = Math.max(sample.dts, 0);
    firstPTS = Math.max(sample.pts, 0);

    // check timestamp continuity accross consecutive fragments (this is to remove inter-fragment gap/hole)
    var delta = Math.round((firstDTS - nextAvcDts) / 90);
    // if fragment are contiguous, detect hole/overlapping between fragments
    if (contiguous) {
      if (delta) {
        if (delta > 1) {
          logger["b" /* logger */].log('AVC:' + delta + ' ms hole between fragments detected,filling it');
        } else if (delta < -1) {
          logger["b" /* logger */].log('AVC:' + -delta + ' ms overlapping between fragments detected');
        }

        // remove hole/gap : set DTS to next expected DTS
        firstDTS = nextAvcDts;
        inputSamples[0].dts = firstDTS;
        // offset PTS as well, ensure that PTS is smaller or equal than new DTS
        firstPTS = Math.max(firstPTS - delta, nextAvcDts);
        inputSamples[0].pts = firstPTS;
        logger["b" /* logger */].log('Video/PTS/DTS adjusted: ' + Math.round(firstPTS / 90) + '/' + Math.round(firstDTS / 90) + ',delta:' + delta + ' ms');
      }
    }
    nextDTS = firstDTS;

    // compute lastPTS/lastDTS
    sample = inputSamples[inputSamples.length - 1];
    lastDTS = Math.max(sample.dts, 0);
    lastPTS = Math.max(sample.pts, 0, lastDTS);

    // on Safari let's signal the same sample duration for all samples
    // sample duration (as expected by trun MP4 boxes), should be the delta between sample DTS
    // set this constant duration as being the avg delta between consecutive DTS.
    if (isSafari) {
      mp4SampleDuration = Math.round((lastDTS - firstDTS) / (inputSamples.length - 1));
    }

    var nbNalu = 0,
        naluLen = 0;
    for (var _i = 0; _i < nbSamples; _i++) {
      // compute total/avc sample length and nb of NAL units
      var _sample = inputSamples[_i],
          units = _sample.units,
          nbUnits = units.length,
          sampleLen = 0;
      for (var j = 0; j < nbUnits; j++) {
        sampleLen += units[j].data.length;
      }

      naluLen += sampleLen;
      nbNalu += nbUnits;
      _sample.length = sampleLen;

      // normalize PTS/DTS
      if (isSafari) {
        // sample DTS is computed using a constant decoding offset (mp4SampleDuration) between samples
        _sample.dts = firstDTS + _i * mp4SampleDuration;
      } else {
        // ensure sample monotonic DTS
        _sample.dts = Math.max(_sample.dts, firstDTS);
      }
      // ensure that computed value is greater or equal than sample DTS
      _sample.pts = Math.max(_sample.pts, _sample.dts);
    }

    /* concatenate the video data and construct the mdat in place
      (need 8 more bytes to fill length and mpdat type) */
    var mdatSize = naluLen + 4 * nbNalu + 8;
    try {
      mdat = new Uint8Array(mdatSize);
    } catch (err) {
      this.observer.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].MUX_ERROR, details: errors["a" /* ErrorDetails */].REMUX_ALLOC_ERROR, fatal: false, bytes: mdatSize, reason: 'fail allocating video mdat ' + mdatSize });
      return;
    }
    var view = new DataView(mdat.buffer);
    view.setUint32(0, mdatSize);
    mdat.set(mp4_generator.types.mdat, 4);

    for (var _i2 = 0; _i2 < nbSamples; _i2++) {
      var avcSample = inputSamples[_i2],
          avcSampleUnits = avcSample.units,
          mp4SampleLength = 0,
          compositionTimeOffset = void 0;
      // convert NALU bitstream to MP4 format (prepend NALU with size field)
      for (var _j = 0, _nbUnits = avcSampleUnits.length; _j < _nbUnits; _j++) {
        var unit = avcSampleUnits[_j],
            unitData = unit.data,
            unitDataLen = unit.data.byteLength;
        view.setUint32(offset, unitDataLen);
        offset += 4;
        mdat.set(unitData, offset);
        offset += unitDataLen;
        mp4SampleLength += 4 + unitDataLen;
      }

      if (!isSafari) {
        // expected sample duration is the Decoding Timestamp diff of consecutive samples
        if (_i2 < nbSamples - 1) {
          mp4SampleDuration = inputSamples[_i2 + 1].dts - avcSample.dts;
        } else {
          var config = this.config,
              lastFrameDuration = avcSample.dts - inputSamples[_i2 > 0 ? _i2 - 1 : _i2].dts;
          if (config.stretchShortVideoTrack) {
            // In some cases, a segment's audio track duration may exceed the video track duration.
            // Since we've already remuxed audio, and we know how long the audio track is, we look to
            // see if the delta to the next segment is longer than maxBufferHole.
            // If so, playback would potentially get stuck, so we artificially inflate
            // the duration of the last frame to minimize any potential gap between segments.
            var maxBufferHole = config.maxBufferHole,
                gapTolerance = Math.floor(maxBufferHole * timeScale),
                deltaToFrameEnd = (audioTrackLength ? firstPTS + audioTrackLength * timeScale : this.nextAudioPts) - avcSample.pts;
            if (deltaToFrameEnd > gapTolerance) {
              // We subtract lastFrameDuration from deltaToFrameEnd to try to prevent any video
              // frame overlap. maxBufferHole should be >> lastFrameDuration anyway.
              mp4SampleDuration = deltaToFrameEnd - lastFrameDuration;
              if (mp4SampleDuration < 0) {
                mp4SampleDuration = lastFrameDuration;
              }

              logger["b" /* logger */].log('It is approximately ' + deltaToFrameEnd / 90 + ' ms to the next segment; using duration ' + mp4SampleDuration / 90 + ' ms for the last video frame.');
            } else {
              mp4SampleDuration = lastFrameDuration;
            }
          } else {
            mp4SampleDuration = lastFrameDuration;
          }
        }
        compositionTimeOffset = Math.round(avcSample.pts - avcSample.dts);
      } else {
        compositionTimeOffset = Math.max(0, mp4SampleDuration * Math.round((avcSample.pts - avcSample.dts) / mp4SampleDuration));
      }

      // console.log('PTS/DTS/initDTS/normPTS/normDTS/relative PTS : ${avcSample.pts}/${avcSample.dts}/${initDTS}/${ptsnorm}/${dtsnorm}/${(avcSample.pts/4294967296).toFixed(3)}');
      outputSamples.push({
        size: mp4SampleLength,
        // constant duration
        duration: mp4SampleDuration,
        cts: compositionTimeOffset,
        flags: {
          isLeading: 0,
          isDependedOn: 0,
          hasRedundancy: 0,
          degradPrio: 0,
          dependsOn: avcSample.key ? 2 : 1,
          isNonSync: avcSample.key ? 0 : 1
        }
      });
    }
    // next AVC sample DTS should be equal to last sample DTS + last sample duration (in PES timescale)
    this.nextAvcDts = lastDTS + mp4SampleDuration;
    var dropped = track.dropped;
    track.len = 0;
    track.nbNalu = 0;
    track.dropped = 0;
    if (outputSamples.length && navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
      var flags = outputSamples[0].flags;
      // chrome workaround, mark first sample as being a Random Access Point to avoid sourcebuffer append issue
      // https://code.google.com/p/chromium/issues/detail?id=229412
      flags.dependsOn = 2;
      flags.isNonSync = 0;
    }
    track.samples = outputSamples;
    moof = mp4_generator.moof(track.sequenceNumber++, firstDTS, track);
    track.samples = [];

    var data = {
      data1: moof,
      data2: mdat,
      startPTS: firstPTS / timeScale,
      endPTS: (lastPTS + mp4SampleDuration) / timeScale,
      startDTS: firstDTS / timeScale,
      endDTS: this.nextAvcDts / timeScale,
      type: 'video',
      hasAudio: false,
      hasVideo: true,
      nb: outputSamples.length,
      dropped: dropped
    };
    this.observer.trigger(events["a" /* default */].FRAG_PARSING_DATA, data);
    return data;
  };

  MP4Remuxer.prototype.remuxAudio = function remuxAudio(track, timeOffset, contiguous, accurateTimeOffset) {
    var inputTimeScale = track.inputTimeScale,
        mp4timeScale = track.timescale,
        scaleFactor = inputTimeScale / mp4timeScale,
        mp4SampleDuration = track.isAAC ? 1024 : 1152,
        inputSampleDuration = mp4SampleDuration * scaleFactor,
        ptsNormalize = this._PTSNormalize,
        initDTS = this._initDTS,
        rawMPEG = !track.isAAC && this.typeSupported.mpeg;

    var offset = void 0,
        mp4Sample = void 0,
        fillFrame = void 0,
        mdat = void 0,
        moof = void 0,
        firstPTS = void 0,
        lastPTS = void 0,
        inputSamples = track.samples,
        outputSamples = [],
        nextAudioPts = this.nextAudioPts;

    // for audio samples, also consider consecutive fragments as being contiguous (even if a level switch occurs),
    // for sake of clarity:
    // consecutive fragments are frags with
    //  - less than 100ms gaps between new time offset (if accurate) and next expected PTS OR
    //  - less than 20 audio frames distance
    // contiguous fragments are consecutive fragments from same quality level (same level, new SN = old SN + 1)
    // this helps ensuring audio continuity
    // and this also avoids audio glitches/cut when switching quality, or reporting wrong duration on first audio frame
    contiguous |= inputSamples.length && nextAudioPts && (accurateTimeOffset && Math.abs(timeOffset - nextAudioPts / inputTimeScale) < 0.1 || Math.abs(inputSamples[0].pts - nextAudioPts - initDTS) < 20 * inputSampleDuration);

    // compute normalized PTS
    inputSamples.forEach(function (sample) {
      sample.pts = sample.dts = ptsNormalize(sample.pts - initDTS, timeOffset * inputTimeScale);
    });

    // filter out sample with negative PTS that are not playable anyway
    // if we don't remove these negative samples, they will shift all audio samples forward.
    // leading to audio overlap between current / next fragment
    inputSamples = inputSamples.filter(function (sample) {
      return sample.pts >= 0;
    });

    // in case all samples have negative PTS, and have been filtered out, return now
    if (inputSamples.length === 0) {
      return;
    }

    if (!contiguous) {
      if (!accurateTimeOffset) {
        // if frag are mot contiguous and if we cant trust time offset, let's use first sample PTS as next audio PTS
        nextAudioPts = inputSamples[0].pts;
      } else {
        // if timeOffset is accurate, let's use it as predicted next audio PTS
        nextAudioPts = timeOffset * inputTimeScale;
      }
    }

    // If the audio track is missing samples, the frames seem to get "left-shifted" within the
    // resulting mp4 segment, causing sync issues and leaving gaps at the end of the audio segment.
    // In an effort to prevent this from happening, we inject frames here where there are gaps.
    // When possible, we inject a silent frame; when that's not possible, we duplicate the last
    // frame.

    if (track.isAAC) {
      var maxAudioFramesDrift = this.config.maxAudioFramesDrift;
      for (var i = 0, nextPts = nextAudioPts; i < inputSamples.length;) {
        // First, let's see how far off this frame is from where we expect it to be
        var sample = inputSamples[i],
            delta;
        var pts = sample.pts;
        delta = pts - nextPts;

        var duration = Math.abs(1000 * delta / inputTimeScale);

        // If we're overlapping by more than a duration, drop this sample
        if (delta <= -maxAudioFramesDrift * inputSampleDuration) {
          logger["b" /* logger */].warn('Dropping 1 audio frame @ ' + (nextPts / inputTimeScale).toFixed(3) + 's due to ' + Math.round(duration) + ' ms overlap.');
          inputSamples.splice(i, 1);
          track.len -= sample.unit.length;
          // Don't touch nextPtsNorm or i
        } // eslint-disable-line brace-style

        // Insert missing frames if:
        // 1: We're more than maxAudioFramesDrift frame away
        // 2: Not more than MAX_SILENT_FRAME_DURATION away
        // 3: currentTime (aka nextPtsNorm) is not 0
        else if (delta >= maxAudioFramesDrift * inputSampleDuration && duration < MAX_SILENT_FRAME_DURATION && nextPts) {
            var missing = Math.round(delta / inputSampleDuration);
            logger["b" /* logger */].warn('Injecting ' + missing + ' audio frame @ ' + (nextPts / inputTimeScale).toFixed(3) + 's due to ' + Math.round(1000 * delta / inputTimeScale) + ' ms gap.');
            for (var j = 0; j < missing; j++) {
              var newStamp = Math.max(nextPts, 0);
              fillFrame = aac_helper.getSilentFrame(track.manifestCodec || track.codec, track.channelCount);
              if (!fillFrame) {
                logger["b" /* logger */].log('Unable to get silent frame for given audio codec; duplicating last frame instead.');
                fillFrame = sample.unit.subarray();
              }
              inputSamples.splice(i, 0, { unit: fillFrame, pts: newStamp, dts: newStamp });
              track.len += fillFrame.length;
              nextPts += inputSampleDuration;
              i++;
            }

            // Adjust sample to next expected pts
            sample.pts = sample.dts = nextPts;
            nextPts += inputSampleDuration;
            i++;
          } else {
            // Otherwise, just adjust pts
            if (Math.abs(delta) > 0.1 * inputSampleDuration) {
              // logger.log(`Invalid frame delta ${Math.round(delta + inputSampleDuration)} at PTS ${Math.round(pts / 90)} (should be ${Math.round(inputSampleDuration)}).`);
            }
            sample.pts = sample.dts = nextPts;
            nextPts += inputSampleDuration;
            i++;
          }
      }
    }

    for (var _j2 = 0, _nbSamples = inputSamples.length; _j2 < _nbSamples; _j2++) {
      var audioSample = inputSamples[_j2];
      var unit = audioSample.unit;
      var _pts = audioSample.pts;
      // logger.log(`Audio/PTS:${Math.round(pts/90)}`);
      // if not first sample
      if (lastPTS !== undefined) {
        mp4Sample.duration = Math.round((_pts - lastPTS) / scaleFactor);
      } else {
        var _delta = Math.round(1000 * (_pts - nextAudioPts) / inputTimeScale),
            numMissingFrames = 0;
        // if fragment are contiguous, detect hole/overlapping between fragments
        // contiguous fragments are consecutive fragments from same quality level (same level, new SN = old SN + 1)
        if (contiguous && track.isAAC) {
          // log delta
          if (_delta) {
            if (_delta > 0 && _delta < MAX_SILENT_FRAME_DURATION) {
              numMissingFrames = Math.round((_pts - nextAudioPts) / inputSampleDuration);
              logger["b" /* logger */].log(_delta + ' ms hole between AAC samples detected,filling it');
              if (numMissingFrames > 0) {
                fillFrame = aac_helper.getSilentFrame(track.manifestCodec || track.codec, track.channelCount);
                if (!fillFrame) {
                  fillFrame = unit.subarray();
                }

                track.len += numMissingFrames * fillFrame.length;
              }
              // if we have frame overlap, overlapping for more than half a frame duraion
            } else if (_delta < -12) {
              // drop overlapping audio frames... browser will deal with it
              logger["b" /* logger */].log('drop overlapping AAC sample, expected/parsed/delta:' + (nextAudioPts / inputTimeScale).toFixed(3) + 's/' + (_pts / inputTimeScale).toFixed(3) + 's/' + -_delta + 'ms');
              track.len -= unit.byteLength;
              continue;
            }
            // set PTS/DTS to expected PTS/DTS
            _pts = nextAudioPts;
          }
        }
        // remember first PTS of our audioSamples
        firstPTS = _pts;
        if (track.len > 0) {
          /* concatenate the audio data and construct the mdat in place
            (need 8 more bytes to fill length and mdat type) */
          var mdatSize = rawMPEG ? track.len : track.len + 8;
          offset = rawMPEG ? 0 : 8;
          try {
            mdat = new Uint8Array(mdatSize);
          } catch (err) {
            this.observer.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].MUX_ERROR, details: errors["a" /* ErrorDetails */].REMUX_ALLOC_ERROR, fatal: false, bytes: mdatSize, reason: 'fail allocating audio mdat ' + mdatSize });
            return;
          }
          if (!rawMPEG) {
            var view = new DataView(mdat.buffer);
            view.setUint32(0, mdatSize);
            mdat.set(mp4_generator.types.mdat, 4);
          }
        } else {
          // no audio samples
          return;
        }
        for (var _i3 = 0; _i3 < numMissingFrames; _i3++) {
          fillFrame = aac_helper.getSilentFrame(track.manifestCodec || track.codec, track.channelCount);
          if (!fillFrame) {
            logger["b" /* logger */].log('Unable to get silent frame for given audio codec; duplicating this frame instead.');
            fillFrame = unit.subarray();
          }
          mdat.set(fillFrame, offset);
          offset += fillFrame.byteLength;
          mp4Sample = {
            size: fillFrame.byteLength,
            cts: 0,
            duration: 1024,
            flags: {
              isLeading: 0,
              isDependedOn: 0,
              hasRedundancy: 0,
              degradPrio: 0,
              dependsOn: 1
            }
          };
          outputSamples.push(mp4Sample);
        }
      }
      mdat.set(unit, offset);
      var unitLen = unit.byteLength;
      offset += unitLen;
      // console.log('PTS/DTS/initDTS/normPTS/normDTS/relative PTS : ${audioSample.pts}/${audioSample.dts}/${initDTS}/${ptsnorm}/${dtsnorm}/${(audioSample.pts/4294967296).toFixed(3)}');
      mp4Sample = {
        size: unitLen,
        cts: 0,
        duration: 0,
        flags: {
          isLeading: 0,
          isDependedOn: 0,
          hasRedundancy: 0,
          degradPrio: 0,
          dependsOn: 1
        }
      };
      outputSamples.push(mp4Sample);
      lastPTS = _pts;
    }
    var lastSampleDuration = 0;
    var nbSamples = outputSamples.length;
    // set last sample duration as being identical to previous sample
    if (nbSamples >= 2) {
      lastSampleDuration = outputSamples[nbSamples - 2].duration;
      mp4Sample.duration = lastSampleDuration;
    }
    if (nbSamples) {
      // next audio sample PTS should be equal to last sample PTS + duration
      this.nextAudioPts = nextAudioPts = lastPTS + scaleFactor * lastSampleDuration;
      // logger.log('Audio/PTS/PTSend:' + audioSample.pts.toFixed(0) + '/' + this.nextAacDts.toFixed(0));
      track.len = 0;
      track.samples = outputSamples;
      if (rawMPEG) {
        moof = new Uint8Array();
      } else {
        moof = mp4_generator.moof(track.sequenceNumber++, firstPTS / scaleFactor, track);
      }

      track.samples = [];
      var start = firstPTS / inputTimeScale;
      var end = nextAudioPts / inputTimeScale;
      var audioData = {
        data1: moof,
        data2: mdat,
        startPTS: start,
        endPTS: end,
        startDTS: start,
        endDTS: end,
        type: 'audio',
        hasAudio: true,
        hasVideo: false,
        nb: nbSamples
      };
      this.observer.trigger(events["a" /* default */].FRAG_PARSING_DATA, audioData);
      return audioData;
    }
    return null;
  };

  MP4Remuxer.prototype.remuxEmptyAudio = function remuxEmptyAudio(track, timeOffset, contiguous, videoData) {
    var inputTimeScale = track.inputTimeScale,
        mp4timeScale = track.samplerate ? track.samplerate : inputTimeScale,
        scaleFactor = inputTimeScale / mp4timeScale,
        nextAudioPts = this.nextAudioPts,


    // sync with video's timestamp
    startDTS = (nextAudioPts !== undefined ? nextAudioPts : videoData.startDTS * inputTimeScale) + this._initDTS,
        endDTS = videoData.endDTS * inputTimeScale + this._initDTS,

    // one sample's duration value
    sampleDuration = 1024,
        frameDuration = scaleFactor * sampleDuration,


    // samples count of this segment's duration
    nbSamples = Math.ceil((endDTS - startDTS) / frameDuration),


    // silent frame
    silentFrame = aac_helper.getSilentFrame(track.manifestCodec || track.codec, track.channelCount);

    logger["b" /* logger */].warn('remux empty Audio');
    // Can't remux if we can't generate a silent frame...
    if (!silentFrame) {
      logger["b" /* logger */].trace('Unable to remuxEmptyAudio since we were unable to get a silent frame for given audio codec!');
      return;
    }

    var samples = [];
    for (var i = 0; i < nbSamples; i++) {
      var stamp = startDTS + i * frameDuration;
      samples.push({ unit: silentFrame, pts: stamp, dts: stamp });
      track.len += silentFrame.length;
    }
    track.samples = samples;

    this.remuxAudio(track, timeOffset, contiguous);
  };

  MP4Remuxer.prototype.remuxID3 = function remuxID3(track, timeOffset) {
    var length = track.samples.length,
        sample = void 0;
    var inputTimeScale = track.inputTimeScale;
    var initPTS = this._initPTS;
    var initDTS = this._initDTS;
    // consume samples
    if (length) {
      for (var index = 0; index < length; index++) {
        sample = track.samples[index];
        // setting id3 pts, dts to relative time
        // using this._initPTS and this._initDTS to calculate relative time
        sample.pts = (sample.pts - initPTS) / inputTimeScale;
        sample.dts = (sample.dts - initDTS) / inputTimeScale;
      }
      this.observer.trigger(events["a" /* default */].FRAG_PARSING_METADATA, {
        samples: track.samples
      });
    }

    track.samples = [];
    timeOffset = timeOffset;
  };

  MP4Remuxer.prototype.remuxText = function remuxText(track, timeOffset) {
    track.samples.sort(function (a, b) {
      return a.pts - b.pts;
    });

    var length = track.samples.length,
        sample = void 0;
    var inputTimeScale = track.inputTimeScale;
    var initPTS = this._initPTS;
    // consume samples
    if (length) {
      for (var index = 0; index < length; index++) {
        sample = track.samples[index];
        // setting text pts, dts to relative time
        // using this._initPTS and this._initDTS to calculate relative time
        sample.pts = (sample.pts - initPTS) / inputTimeScale;
      }
      this.observer.trigger(events["a" /* default */].FRAG_PARSING_USERDATA, {
        samples: track.samples
      });
    }

    track.samples = [];
    timeOffset = timeOffset;
  };

  MP4Remuxer.prototype._PTSNormalize = function _PTSNormalize(value, reference) {
    var offset = void 0;
    if (reference === undefined) {
      return value;
    }

    if (reference < value) {
      // - 2^33
      offset = -8589934592;
    } else {
      // + 2^33
      offset = 8589934592;
    }
    /* PTS is 33bit (from 0 to 2^33 -1)
      if diff between value and reference is bigger than half of the amplitude (2^32) then it means that
      PTS looping occured. fill the gap */
    while (Math.abs(value - reference) > 4294967296) {
      value += offset;
    }

    return value;
  };

  return MP4Remuxer;
}();

/* harmony default export */ var mp4_remuxer = (mp4_remuxer_MP4Remuxer);
// CONCATENATED MODULE: ./src/remux/passthrough-remuxer.js
function passthrough_remuxer__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * passthrough remuxer
*/


var passthrough_remuxer_PassThroughRemuxer = function () {
  function PassThroughRemuxer(observer) {
    passthrough_remuxer__classCallCheck(this, PassThroughRemuxer);

    this.observer = observer;
  }

  PassThroughRemuxer.prototype.destroy = function destroy() {};

  PassThroughRemuxer.prototype.resetTimeStamp = function resetTimeStamp() {};

  PassThroughRemuxer.prototype.resetInitSegment = function resetInitSegment() {};

  PassThroughRemuxer.prototype.remux = function remux(audioTrack, videoTrack, id3Track, textTrack, timeOffset, contiguous, accurateTimeOffset, rawData) {
    var observer = this.observer;
    var streamType = '';
    if (audioTrack) {
      streamType += 'audio';
    }

    if (videoTrack) {
      streamType += 'video';
    }

    observer.trigger(events["a" /* default */].FRAG_PARSING_DATA, {
      data1: rawData,
      startPTS: timeOffset,
      startDTS: timeOffset,
      type: streamType,
      hasAudio: !!audioTrack,
      hasVideo: !!videoTrack,
      nb: 1,
      dropped: 0
    });
    // notify end of parsing
    observer.trigger(events["a" /* default */].FRAG_PARSED);
  };

  return PassThroughRemuxer;
}();

/* harmony default export */ var passthrough_remuxer = (passthrough_remuxer_PassThroughRemuxer);
// CONCATENATED MODULE: ./src/demux/demuxer-inline.js
function demuxer_inline__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 * inline demuxer: probe fragments and instantiate
 * appropriate demuxer depending on content type (TSDemuxer, AACDemuxer, ...)
 *
 */













// see https://stackoverflow.com/a/11237259/589493
var global = Object(get_self_scope["a" /* getSelfScope */])(); // safeguard for code that might run both on worker and main thread
var performance = global;

var demuxer_inline_DemuxerInline = function () {
  function DemuxerInline(observer, typeSupported, config, vendor) {
    demuxer_inline__classCallCheck(this, DemuxerInline);

    this.observer = observer;
    this.typeSupported = typeSupported;
    this.config = config;
    this.vendor = vendor;
  }

  DemuxerInline.prototype.destroy = function destroy() {
    var demuxer = this.demuxer;
    if (demuxer) {
      demuxer.destroy();
    }
  };

  DemuxerInline.prototype.push = function push(data, decryptdata, initSegment, audioCodec, videoCodec, timeOffset, discontinuity, trackSwitch, contiguous, duration, accurateTimeOffset, defaultInitPTS) {
    if (data.byteLength > 0 && decryptdata != null && decryptdata.key != null && decryptdata.method === 'AES-128') {
      var decrypter = this.decrypter;
      if (decrypter == null) {
        decrypter = this.decrypter = new crypt_decrypter["a" /* default */](this.observer, this.config);
      }

      var localthis = this;
      // performance.now() not available on WebWorker, at least on Safari Desktop
      var startTime = void 0;
      try {
        startTime = performance.now();
      } catch (error) {
        startTime = Date.now();
      }
      decrypter.decrypt(data, decryptdata.key.buffer, decryptdata.iv.buffer, function (decryptedData) {
        var endTime = void 0;
        try {
          endTime = performance.now();
        } catch (error) {
          endTime = Date.now();
        }
        localthis.observer.trigger(events["a" /* default */].FRAG_DECRYPTED, { stats: { tstart: startTime, tdecrypt: endTime } });
        localthis.pushDecrypted(new Uint8Array(decryptedData), decryptdata, new Uint8Array(initSegment), audioCodec, videoCodec, timeOffset, discontinuity, trackSwitch, contiguous, duration, accurateTimeOffset, defaultInitPTS);
      });
    } else {
      this.pushDecrypted(new Uint8Array(data), decryptdata, new Uint8Array(initSegment), audioCodec, videoCodec, timeOffset, discontinuity, trackSwitch, contiguous, duration, accurateTimeOffset, defaultInitPTS);
    }
  };

  DemuxerInline.prototype.pushDecrypted = function pushDecrypted(data, decryptdata, initSegment, audioCodec, videoCodec, timeOffset, discontinuity, trackSwitch, contiguous, duration, accurateTimeOffset, defaultInitPTS) {
    var demuxer = this.demuxer;
    if (!demuxer ||
    // in case of continuity change, or track switch
    // we might switch from content type (AAC container to TS container, or TS to fmp4 for example)
    // so let's check that current demuxer is still valid
    (discontinuity || trackSwitch) && !this.probe(data)) {
      var observer = this.observer;
      var typeSupported = this.typeSupported;
      var config = this.config;
      // probing order is TS/AAC/MP3/MP4
      var muxConfig = [{ demux: tsdemuxer, remux: mp4_remuxer }, { demux: mp4demuxer["a" /* default */], remux: passthrough_remuxer }, { demux: aacdemuxer, remux: mp4_remuxer }, { demux: mp3demuxer, remux: mp4_remuxer }];

      // probe for content type
      for (var i = 0, len = muxConfig.length; i < len; i++) {
        var mux = muxConfig[i];
        var probe = mux.demux.probe;
        if (probe(data)) {
          var _remuxer = this.remuxer = new mux.remux(observer, config, typeSupported, this.vendor);
          demuxer = new mux.demux(observer, _remuxer, config, typeSupported);
          this.probe = probe;
          break;
        }
      }
      if (!demuxer) {
        observer.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].MEDIA_ERROR, details: errors["a" /* ErrorDetails */].FRAG_PARSING_ERROR, fatal: true, reason: 'no demux matching with content found' });
        return;
      }
      this.demuxer = demuxer;
    }
    var remuxer = this.remuxer;

    if (discontinuity || trackSwitch) {
      demuxer.resetInitSegment(initSegment, audioCodec, videoCodec, duration);
      remuxer.resetInitSegment();
    }
    if (discontinuity) {
      demuxer.resetTimeStamp(defaultInitPTS);
      remuxer.resetTimeStamp(defaultInitPTS);
    }
    if (typeof demuxer.setDecryptData === 'function') {
      demuxer.setDecryptData(decryptdata);
    }

    demuxer.append(data, timeOffset, contiguous, accurateTimeOffset);
  };

  return DemuxerInline;
}();

/* harmony default export */ var demuxer_inline = __webpack_exports__["a"] = (demuxer_inline_DemuxerInline);

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var cues_namespaceObject = {};
__webpack_require__.d(cues_namespaceObject, "newCue", function() { return newCue; });

// EXTERNAL MODULE: ./node_modules/url-toolkit/src/url-toolkit.js
var url_toolkit = __webpack_require__(4);
var url_toolkit_default = /*#__PURE__*/__webpack_require__.n(url_toolkit);

// EXTERNAL MODULE: ./src/errors.js
var errors = __webpack_require__(2);

// EXTERNAL MODULE: ./src/events.js
var events = __webpack_require__(1);

// EXTERNAL MODULE: ./src/utils/logger.js
var logger = __webpack_require__(0);

// CONCATENATED MODULE: ./src/event-handler.js
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
*
* All objects in the event handling chain should inherit from this class
*
*/





var FORBIDDEN_EVENT_NAMES = new Set(['hlsEventGeneric', 'hlsHandlerDestroying', 'hlsHandlerDestroyed']);

var event_handler_EventHandler = function () {
  function EventHandler(hls) {
    _classCallCheck(this, EventHandler);

    this.hls = hls;
    this.onEvent = this.onEvent.bind(this);

    for (var _len = arguments.length, events = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      events[_key - 1] = arguments[_key];
    }

    this.handledEvents = events;
    this.useGenericHandler = true;

    this.registerListeners();
  }

  EventHandler.prototype.destroy = function destroy() {
    this.onHandlerDestroying();
    this.unregisterListeners();
    this.onHandlerDestroyed();
  };

  EventHandler.prototype.onHandlerDestroying = function onHandlerDestroying() {};

  EventHandler.prototype.onHandlerDestroyed = function onHandlerDestroyed() {};

  EventHandler.prototype.isEventHandler = function isEventHandler() {
    return _typeof(this.handledEvents) === 'object' && this.handledEvents.length && typeof this.onEvent === 'function';
  };

  EventHandler.prototype.registerListeners = function registerListeners() {
    if (this.isEventHandler()) {
      this.handledEvents.forEach(function (event) {
        if (FORBIDDEN_EVENT_NAMES.has(event)) {
          throw new Error('Forbidden event-name: ' + event);
        }

        this.hls.on(event, this.onEvent);
      }, this);
    }
  };

  EventHandler.prototype.unregisterListeners = function unregisterListeners() {
    if (this.isEventHandler()) {
      this.handledEvents.forEach(function (event) {
        this.hls.off(event, this.onEvent);
      }, this);
    }
  };

  /**
   * arguments: event (string), data (any)
   */


  EventHandler.prototype.onEvent = function onEvent(event, data) {
    this.onEventGeneric(event, data);
  };

  EventHandler.prototype.onEventGeneric = function onEventGeneric(event, data) {
    var eventToFunction = function eventToFunction(event, data) {
      var funcName = 'on' + event.replace('hls', '');
      if (typeof this[funcName] !== 'function') {
        throw new Error('Event ' + event + ' has no generic handler in this ' + this.constructor.name + ' class (tried ' + funcName + ')');
      }

      return this[funcName].bind(this, data);
    };
    try {
      eventToFunction.call(this, event, data).call();
    } catch (err) {
      logger["b" /* logger */].error('An internal error happened while handling event ' + event + '. Error message: "' + err.message + '". Here is a stacktrace:', err);
      this.hls.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].OTHER_ERROR, details: errors["a" /* ErrorDetails */].INTERNAL_EXCEPTION, fatal: false, event: event, err: err });
    }
  };

  return EventHandler;
}();

/* harmony default export */ var event_handler = (event_handler_EventHandler);
// EXTERNAL MODULE: ./src/demux/mp4demuxer.js
var mp4demuxer = __webpack_require__(8);

// CONCATENATED MODULE: ./src/loader/level-key.js
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function level_key__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var level_key_LevelKey = function () {
  function LevelKey() {
    level_key__classCallCheck(this, LevelKey);

    this.method = null;
    this.key = null;
    this.iv = null;
    this._uri = null;
  }

  _createClass(LevelKey, [{
    key: 'uri',
    get: function get() {
      if (!this._uri && this.reluri) {
        this._uri = url_toolkit_default.a.buildAbsoluteURL(this.baseuri, this.reluri, { alwaysNormalize: true });
      }

      return this._uri;
    }
  }]);

  return LevelKey;
}();

/* harmony default export */ var level_key = (level_key_LevelKey);
// CONCATENATED MODULE: ./src/loader/fragment.js
var fragment__createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function fragment__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }





var fragment_Fragment = function () {
  function Fragment() {
    var _elementaryStreams;

    fragment__classCallCheck(this, Fragment);

    this._url = null;
    this._byteRange = null;
    this._decryptdata = null;
    this.tagList = [];

    // Holds the types of data this fragment supports
    this._elementaryStreams = (_elementaryStreams = {}, _elementaryStreams[Fragment.ElementaryStreamTypes.AUDIO] = false, _elementaryStreams[Fragment.ElementaryStreamTypes.VIDEO] = false, _elementaryStreams);
  }

  /**
   * `type` property for this._elementaryStreams
   *
   * @enum
   */


  /**
   * @param {ElementaryStreamType} type
   */
  Fragment.prototype.addElementaryStream = function addElementaryStream(type) {
    this._elementaryStreams[type] = true;
  };

  /**
   * @param {ElementaryStreamType} type
   */


  Fragment.prototype.hasElementaryStream = function hasElementaryStream(type) {
    return this._elementaryStreams[type] === true;
  };

  /**
   * Utility method for parseLevelPlaylist to create an initialization vector for a given segment
   * @returns {Uint8Array}
   */


  Fragment.prototype.createInitializationVector = function createInitializationVector(segmentNumber) {
    var uint8View = new Uint8Array(16);

    for (var i = 12; i < 16; i++) {
      uint8View[i] = segmentNumber >> 8 * (15 - i) & 0xff;
    }

    return uint8View;
  };

  /**
   * Utility method for parseLevelPlaylist to get a fragment's decryption data from the currently parsed encryption key data
   * @param levelkey - a playlist's encryption info
   * @param segmentNumber - the fragment's segment number
   * @returns {*} - an object to be applied as a fragment's decryptdata
   */


  Fragment.prototype.fragmentDecryptdataFromLevelkey = function fragmentDecryptdataFromLevelkey(levelkey, segmentNumber) {
    var decryptdata = levelkey;

    if (levelkey && levelkey.method && levelkey.uri && !levelkey.iv) {
      decryptdata = new level_key();
      decryptdata.method = levelkey.method;
      decryptdata.baseuri = levelkey.baseuri;
      decryptdata.reluri = levelkey.reluri;
      decryptdata.iv = this.createInitializationVector(segmentNumber);
    }

    return decryptdata;
  };

  fragment__createClass(Fragment, [{
    key: 'url',
    get: function get() {
      if (!this._url && this.relurl) {
        this._url = url_toolkit_default.a.buildAbsoluteURL(this.baseurl, this.relurl, { alwaysNormalize: true });
      }

      return this._url;
    },
    set: function set(value) {
      this._url = value;
    }
  }, {
    key: 'programDateTime',
    get: function get() {
      if (!this._programDateTime && this.rawProgramDateTime) {
        this._programDateTime = new Date(Date.parse(this.rawProgramDateTime));
      }

      return this._programDateTime;
    }
  }, {
    key: 'byteRange',
    get: function get() {
      if (!this._byteRange && !this.rawByteRange) {
        return [];
      }

      if (this._byteRange) {
        return this._byteRange;
      }

      var byteRange = [];
      if (this.rawByteRange) {
        var params = this.rawByteRange.split('@', 2);
        if (params.length === 1) {
          var lastByteRangeEndOffset = this.lastByteRangeEndOffset;
          byteRange[0] = lastByteRangeEndOffset || 0;
        } else {
          byteRange[0] = parseInt(params[1]);
        }
        byteRange[1] = parseInt(params[0]) + byteRange[0];
        this._byteRange = byteRange;
      }
      return byteRange;
    }

    /**
     * @type {number}
     */

  }, {
    key: 'byteRangeStartOffset',
    get: function get() {
      return this.byteRange[0];
    }
  }, {
    key: 'byteRangeEndOffset',
    get: function get() {
      return this.byteRange[1];
    }
  }, {
    key: 'decryptdata',
    get: function get() {
      if (!this._decryptdata) {
        this._decryptdata = this.fragmentDecryptdataFromLevelkey(this.levelkey, this.sn);
      }

      return this._decryptdata;
    }
  }, {
    key: 'encrypted',
    get: function get() {
      return !!(this.decryptdata && this.decryptdata.uri !== null && this.decryptdata.key === null);
    }
  }], [{
    key: 'ElementaryStreamTypes',
    get: function get() {
      return {
        AUDIO: 'audio',
        VIDEO: 'video'
      };
    }
  }]);

  return Fragment;
}();

/* harmony default export */ var loader_fragment = (fragment_Fragment);
// CONCATENATED MODULE: ./src/utils/attr-list.js
function attr_list__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DECIMAL_RESOLUTION_REGEX = /^(\d+)x(\d+)$/; // eslint-disable-line no-useless-escape
var ATTR_LIST_REGEX = /\s*(.+?)\s*=((?:\".*?\")|.*?)(?:,|$)/g; // eslint-disable-line no-useless-escape

// adapted from https://github.com/kanongil/node-m3u8parse/blob/master/attrlist.js

var AttrList = function () {
  function AttrList(attrs) {
    attr_list__classCallCheck(this, AttrList);

    if (typeof attrs === 'string') {
      attrs = AttrList.parseAttrList(attrs);
    }

    for (var attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        this[attr] = attrs[attr];
      }
    }
  }

  AttrList.prototype.decimalInteger = function decimalInteger(attrName) {
    var intValue = parseInt(this[attrName], 10);
    if (intValue > Number.MAX_SAFE_INTEGER) {
      return Infinity;
    }

    return intValue;
  };

  AttrList.prototype.hexadecimalInteger = function hexadecimalInteger(attrName) {
    if (this[attrName]) {
      var stringValue = (this[attrName] || '0x').slice(2);
      stringValue = (stringValue.length & 1 ? '0' : '') + stringValue;

      var value = new Uint8Array(stringValue.length / 2);
      for (var i = 0; i < stringValue.length / 2; i++) {
        value[i] = parseInt(stringValue.slice(i * 2, i * 2 + 2), 16);
      }

      return value;
    } else {
      return null;
    }
  };

  AttrList.prototype.hexadecimalIntegerAsNumber = function hexadecimalIntegerAsNumber(attrName) {
    var intValue = parseInt(this[attrName], 16);
    if (intValue > Number.MAX_SAFE_INTEGER) {
      return Infinity;
    }

    return intValue;
  };

  AttrList.prototype.decimalFloatingPoint = function decimalFloatingPoint(attrName) {
    return parseFloat(this[attrName]);
  };

  AttrList.prototype.enumeratedString = function enumeratedString(attrName) {
    return this[attrName];
  };

  AttrList.prototype.decimalResolution = function decimalResolution(attrName) {
    var res = DECIMAL_RESOLUTION_REGEX.exec(this[attrName]);
    if (res === null) {
      return undefined;
    }

    return {
      width: parseInt(res[1], 10),
      height: parseInt(res[2], 10)
    };
  };

  AttrList.parseAttrList = function parseAttrList(input) {
    var match = void 0,
        attrs = {};
    ATTR_LIST_REGEX.lastIndex = 0;
    while ((match = ATTR_LIST_REGEX.exec(input)) !== null) {
      var value = match[2],
          quote = '"';

      if (value.indexOf(quote) === 0 && value.lastIndexOf(quote) === value.length - 1) {
        value = value.slice(1, -1);
      }

      attrs[match[1]] = value;
    }
    return attrs;
  };

  return AttrList;
}();

/* harmony default export */ var attr_list = (AttrList);
// CONCATENATED MODULE: ./src/utils/codecs.js
// from http://mp4ra.org/codecs.html
var sampleEntryCodesISO = {
  audio: {
    'a3ds': true,
    'ac-3': true,
    'ac-4': true,
    'alac': true,
    'alaw': true,
    'dra1': true,
    'dts+': true,
    'dts-': true,
    'dtsc': true,
    'dtse': true,
    'dtsh': true,
    'ec-3': true,
    'enca': true,
    'g719': true,
    'g726': true,
    'm4ae': true,
    'mha1': true,
    'mha2': true,
    'mhm1': true,
    'mhm2': true,
    'mlpa': true,
    'mp4a': true,
    'raw ': true,
    'Opus': true,
    'samr': true,
    'sawb': true,
    'sawp': true,
    'sevc': true,
    'sqcp': true,
    'ssmv': true,
    'twos': true,
    'ulaw': true
  },
  video: {
    'avc1': true,
    'avc2': true,
    'avc3': true,
    'avc4': true,
    'avcp': true,
    'drac': true,
    'dvav': true,
    'dvhe': true,
    'encv': true,
    'hev1': true,
    'hvc1': true,
    'mjp2': true,
    'mp4v': true,
    'mvc1': true,
    'mvc2': true,
    'mvc3': true,
    'mvc4': true,
    'resv': true,
    'rv60': true,
    's263': true,
    'svc1': true,
    'svc2': true,
    'vc-1': true,
    'vp08': true,
    'vp09': true
  }
};

function isCodecType(codec, type) {
  var typeCodes = sampleEntryCodesISO[type];
  return !!typeCodes && typeCodes[codec.slice(0, 4)] === true;
}

function isCodecSupportedInMp4(codec, type) {
  return window.MediaSource.isTypeSupported((type || 'video') + '/mp4;codecs="' + codec + '"');
}


// CONCATENATED MODULE: ./src/loader/m3u8-parser.js
function m3u8_parser__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }










/**
 * M3U8 parser
 * @module
 */

// https://regex101.com is your friend
var MASTER_PLAYLIST_REGEX = /#EXT-X-STREAM-INF:([^\n\r]*)[\r\n]+([^\r\n]+)/g;
var MASTER_PLAYLIST_MEDIA_REGEX = /#EXT-X-MEDIA:(.*)/g;

var LEVEL_PLAYLIST_REGEX_FAST = new RegExp([/#EXTINF:\s*(\d*(?:\.\d+)?)(?:,(.*)\s+)?/.source, // duration (#EXTINF:<duration>,<title>), group 1 => duration, group 2 => title
/|(?!#)(\S+)/.source, // segment URI, group 3 => the URI (note newline is not eaten)
/|#EXT-X-BYTERANGE:*(.+)/.source, // next segment's byterange, group 4 => range spec (x@y)
/|#EXT-X-PROGRAM-DATE-TIME:(.+)/.source, // next segment's program date/time group 5 => the datetime spec
/|#.*/.source // All other non-segment oriented tags will match with all groups empty
].join(''), 'g');

var LEVEL_PLAYLIST_REGEX_SLOW = /(?:(?:#(EXTM3U))|(?:#EXT-X-(PLAYLIST-TYPE):(.+))|(?:#EXT-X-(MEDIA-SEQUENCE): *(\d+))|(?:#EXT-X-(TARGETDURATION): *(\d+))|(?:#EXT-X-(KEY):(.+))|(?:#EXT-X-(START):(.+))|(?:#EXT-X-(ENDLIST))|(?:#EXT-X-(DISCONTINUITY-SEQ)UENCE:(\d+))|(?:#EXT-X-(DIS)CONTINUITY))|(?:#EXT-X-(VERSION):(\d+))|(?:#EXT-X-(MAP):(.+))|(?:(#)(.*):(.*))|(?:(#)(.*))(?:.*)\r?\n?/;

var MP4_REGEX_SUFFIX = /\.(mp4|m4s|m4v|m4a)$/i;

var m3u8_parser_M3U8Parser = function () {
  function M3U8Parser() {
    m3u8_parser__classCallCheck(this, M3U8Parser);
  }

  M3U8Parser.findGroup = function findGroup(groups, mediaGroupId) {
    if (!groups) {
      return null;
    }

    var matchingGroup = null;

    for (var i = 0; i < groups.length; i++) {
      var group = groups[i];
      if (group.id === mediaGroupId) {
        matchingGroup = group;
      }
    }

    return matchingGroup;
  };

  M3U8Parser.convertAVC1ToAVCOTI = function convertAVC1ToAVCOTI(codec) {
    var result = void 0,
        avcdata = codec.split('.');
    if (avcdata.length > 2) {
      result = avcdata.shift() + '.';
      result += parseInt(avcdata.shift()).toString(16);
      result += ('000' + parseInt(avcdata.shift()).toString(16)).substr(-4);
    } else {
      result = codec;
    }
    return result;
  };

  M3U8Parser.resolve = function resolve(url, baseUrl) {
    return url_toolkit_default.a.buildAbsoluteURL(baseUrl, url, { alwaysNormalize: true });
  };

  M3U8Parser.parseMasterPlaylist = function parseMasterPlaylist(string, baseurl) {
    var levels = [],
        result = void 0;
    MASTER_PLAYLIST_REGEX.lastIndex = 0;

    function setCodecs(codecs, level) {
      ['video', 'audio'].forEach(function (type) {
        var filtered = codecs.filter(function (codec) {
          return isCodecType(codec, type);
        });
        if (filtered.length) {
          var preferred = filtered.filter(function (codec) {
            return codec.lastIndexOf('avc1', 0) === 0 || codec.lastIndexOf('mp4a', 0) === 0;
          });
          level[type + 'Codec'] = preferred.length > 0 ? preferred[0] : filtered[0];

          // remove from list
          codecs = codecs.filter(function (codec) {
            return filtered.indexOf(codec) === -1;
          });
        }
      });

      level.unknownCodecs = codecs;
    }

    while ((result = MASTER_PLAYLIST_REGEX.exec(string)) != null) {
      var level = {};

      var attrs = level.attrs = new attr_list(result[1]);
      level.url = M3U8Parser.resolve(result[2], baseurl);

      var resolution = attrs.decimalResolution('RESOLUTION');
      if (resolution) {
        level.width = resolution.width;
        level.height = resolution.height;
      }
      level.bitrate = attrs.decimalInteger('AVERAGE-BANDWIDTH') || attrs.decimalInteger('BANDWIDTH');
      level.name = attrs.NAME;

      setCodecs([].concat((attrs.CODECS || '').split(/[ ,]+/)), level);

      if (level.videoCodec && level.videoCodec.indexOf('avc1') !== -1) {
        level.videoCodec = M3U8Parser.convertAVC1ToAVCOTI(level.videoCodec);
      }

      levels.push(level);
    }
    return levels;
  };

  M3U8Parser.parseMasterPlaylistMedia = function parseMasterPlaylistMedia(string, baseurl, type) {
    var audioGroups = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

    var result = void 0;
    var medias = [];
    var id = 0;
    MASTER_PLAYLIST_MEDIA_REGEX.lastIndex = 0;
    while ((result = MASTER_PLAYLIST_MEDIA_REGEX.exec(string)) !== null) {
      var media = {};
      var attrs = new attr_list(result[1]);
      if (attrs.TYPE === type) {
        media.groupId = attrs['GROUP-ID'];
        media.name = attrs.NAME;
        media.type = type;
        media.default = attrs.DEFAULT === 'YES';
        media.autoselect = attrs.AUTOSELECT === 'YES';
        media.forced = attrs.FORCED === 'YES';
        if (attrs.URI) {
          media.url = M3U8Parser.resolve(attrs.URI, baseurl);
        }

        media.lang = attrs.LANGUAGE;
        if (!media.name) {
          media.name = media.lang;
        }

        if (audioGroups.length) {
          var groupCodec = M3U8Parser.findGroup(audioGroups, media.groupId);
          media.audioCodec = groupCodec ? groupCodec.codec : audioGroups[0].codec;
        }
        media.id = id++;
        medias.push(media);
      }
    }
    return medias;
  };

  M3U8Parser.parseLevelPlaylist = function parseLevelPlaylist(string, baseurl, id, type, levelUrlId) {
    var currentSN = 0,
        totalduration = 0,
        level = { type: null, version: null, url: baseurl, fragments: [], live: true, startSN: 0 },
        levelkey = new level_key(),
        cc = 0,
        prevFrag = null,
        frag = new loader_fragment(),
        result = void 0,
        i = void 0;

    LEVEL_PLAYLIST_REGEX_FAST.lastIndex = 0;

    while ((result = LEVEL_PLAYLIST_REGEX_FAST.exec(string)) !== null) {
      var duration = result[1];
      if (duration) {
        // INF
        frag.duration = parseFloat(duration);
        // avoid sliced strings    https://github.com/video-dev/hls.js/issues/939
        var title = (' ' + result[2]).slice(1);
        frag.title = title || null;
        frag.tagList.push(title ? ['INF', duration, title] : ['INF', duration]);
      } else if (result[3]) {
        // url
        if (!isNaN(frag.duration)) {
          var sn = currentSN++;
          frag.type = type;
          frag.start = totalduration;
          frag.levelkey = levelkey;
          frag.sn = sn;
          frag.level = id;
          frag.cc = cc;
          frag.urlId = levelUrlId;
          frag.baseurl = baseurl;
          // avoid sliced strings    https://github.com/video-dev/hls.js/issues/939
          frag.relurl = (' ' + result[3]).slice(1);

          if (level.programDateTime) {
            if (prevFrag) {
              if (frag.rawProgramDateTime) {
                // PDT discontinuity found
                frag.pdt = Date.parse(frag.rawProgramDateTime);
              } else {
                // Contiguous fragment
                frag.pdt = prevFrag.pdt + prevFrag.duration * 1000;
              }
            } else {
              // First fragment
              frag.pdt = Date.parse(level.programDateTime);
            }
            frag.endPdt = frag.pdt + frag.duration * 1000;
          }

          level.fragments.push(frag);
          prevFrag = frag;
          totalduration += frag.duration;

          frag = new loader_fragment();
        }
      } else if (result[4]) {
        // X-BYTERANGE
        frag.rawByteRange = (' ' + result[4]).slice(1);
        if (prevFrag) {
          var lastByteRangeEndOffset = prevFrag.byteRangeEndOffset;
          if (lastByteRangeEndOffset) {
            frag.lastByteRangeEndOffset = lastByteRangeEndOffset;
          }
        }
      } else if (result[5]) {
        // PROGRAM-DATE-TIME
        // avoid sliced strings    https://github.com/video-dev/hls.js/issues/939
        frag.rawProgramDateTime = (' ' + result[5]).slice(1);
        frag.tagList.push(['PROGRAM-DATE-TIME', frag.rawProgramDateTime]);
        if (level.programDateTime === undefined) {
          level.programDateTime = new Date(new Date(Date.parse(result[5])) - 1000 * totalduration);
        }
      } else {
        result = result[0].match(LEVEL_PLAYLIST_REGEX_SLOW);
        for (i = 1; i < result.length; i++) {
          if (result[i] !== undefined) {
            break;
          }
        }

        // avoid sliced strings    https://github.com/video-dev/hls.js/issues/939
        var value1 = (' ' + result[i + 1]).slice(1);
        var value2 = (' ' + result[i + 2]).slice(1);

        switch (result[i]) {
          case '#':
            frag.tagList.push(value2 ? [value1, value2] : [value1]);
            break;
          case 'PLAYLIST-TYPE':
            level.type = value1.toUpperCase();
            break;
          case 'MEDIA-SEQUENCE':
            currentSN = level.startSN = parseInt(value1);
            break;
          case 'TARGETDURATION':
            level.targetduration = parseFloat(value1);
            break;
          case 'VERSION':
            level.version = parseInt(value1);
            break;
          case 'EXTM3U':
            break;
          case 'ENDLIST':
            level.live = false;
            break;
          case 'DIS':
            cc++;
            frag.tagList.push(['DIS']);
            break;
          case 'DISCONTINUITY-SEQ':
            cc = parseInt(value1);
            break;
          case 'KEY':
            // https://tools.ietf.org/html/draft-pantos-http-live-streaming-08#section-3.4.4
            var decryptparams = value1;
            var keyAttrs = new attr_list(decryptparams);
            var decryptmethod = keyAttrs.enumeratedString('METHOD'),
                decrypturi = keyAttrs.URI,
                decryptiv = keyAttrs.hexadecimalInteger('IV');
            if (decryptmethod) {
              levelkey = new level_key();
              if (decrypturi && ['AES-128', 'SAMPLE-AES', 'SAMPLE-AES-CENC'].indexOf(decryptmethod) >= 0) {
                levelkey.method = decryptmethod;
                // URI to get the key
                levelkey.baseuri = baseurl;
                levelkey.reluri = decrypturi;
                levelkey.key = null;
                // Initialization Vector (IV)
                levelkey.iv = decryptiv;
              }
            }
            break;
          case 'START':
            var startParams = value1;
            var startAttrs = new attr_list(startParams);
            var startTimeOffset = startAttrs.decimalFloatingPoint('TIME-OFFSET');
            // TIME-OFFSET can be 0
            if (!isNaN(startTimeOffset)) {
              level.startTimeOffset = startTimeOffset;
            }

            break;
          case 'MAP':
            var mapAttrs = new attr_list(value1);
            frag.relurl = mapAttrs.URI;
            frag.rawByteRange = mapAttrs.BYTERANGE;
            frag.baseurl = baseurl;
            frag.level = id;
            frag.type = type;
            frag.sn = 'initSegment';
            level.initSegment = frag;
            frag = new loader_fragment();
            break;
          default:
            logger["b" /* logger */].warn('line parsed but not handled: ' + result);
            break;
        }
      }
    }
    frag = prevFrag;
    // logger.log('found ' + level.fragments.length + ' fragments');
    if (frag && !frag.relurl) {
      level.fragments.pop();
      totalduration -= frag.duration;
    }
    level.totalduration = totalduration;
    level.averagetargetduration = totalduration / level.fragments.length;
    level.endSN = currentSN - 1;
    level.startCC = level.fragments[0] ? level.fragments[0].cc : 0;
    level.endCC = cc;

    if (!level.initSegment && level.fragments.length) {
      // this is a bit lurky but HLS really has no other way to tell us
      // if the fragments are TS or MP4, except if we download them :/
      // but this is to be able to handle SIDX.
      if (level.fragments.every(function (frag) {
        return MP4_REGEX_SUFFIX.test(frag.relurl);
      })) {
        logger["b" /* logger */].warn('MP4 fragments found but no init segment (probably no MAP, incomplete M3U8), trying to fetch SIDX');

        frag = new loader_fragment();
        frag.relurl = level.fragments[0].relurl;
        frag.baseurl = baseurl;
        frag.level = id;
        frag.type = type;
        frag.sn = 'initSegment';

        level.initSegment = frag;
        level.needSidxRanges = true;
      }
    }

    return level;
  };

  return M3U8Parser;
}();

/* harmony default export */ var m3u8_parser = (m3u8_parser_M3U8Parser);
// CONCATENATED MODULE: ./src/loader/playlist-loader.js
var playlist_loader__createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function playlist_loader__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * PlaylistLoader - delegate for media manifest/playlist loading tasks. Takes care of parsing media to internal data-models.
 *
 * Once loaded, dispatches events with parsed data-models of manifest/levels/audio/subtitle tracks.
 *
 * Uses loader(s) set in config to do actual internal loading of resource tasks.
 *
 * @module
 *
 */










var _window = window,
    performance = _window.performance;

/**
 * `type` property values for this loaders' context object
 * @enum
 *
 */

var ContextType = {
  MANIFEST: 'manifest',
  LEVEL: 'level',
  AUDIO_TRACK: 'audioTrack',
  SUBTITLE_TRACK: 'subtitleTrack'
};

/**
 * @enum {string}
 */
var LevelType = {
  MAIN: 'main',
  AUDIO: 'audio',
  SUBTITLE: 'subtitle'
};

/**
 * @constructor
 */

var playlist_loader_PlaylistLoader = function (_EventHandler) {
  _inherits(PlaylistLoader, _EventHandler);

  /**
   * @constructs
   * @param {Hls} hls
   */
  function PlaylistLoader(hls) {
    playlist_loader__classCallCheck(this, PlaylistLoader);

    var _this = _possibleConstructorReturn(this, _EventHandler.call(this, hls, events["a" /* default */].MANIFEST_LOADING, events["a" /* default */].LEVEL_LOADING, events["a" /* default */].AUDIO_TRACK_LOADING, events["a" /* default */].SUBTITLE_TRACK_LOADING));

    _this.loaders = {};
    return _this;
  }

  /**
   * @param {ContextType} type
   * @returns {boolean}
   */
  PlaylistLoader.canHaveQualityLevels = function canHaveQualityLevels(type) {
    return type !== ContextType.AUDIO_TRACK && type !== ContextType.SUBTITLE_TRACK;
  };

  /**
   * Map context.type to LevelType
   * @param {{type: ContextType}} context
   * @returns {LevelType}
   */


  PlaylistLoader.mapContextToLevelType = function mapContextToLevelType(context) {
    var type = context.type;


    switch (type) {
      case ContextType.AUDIO_TRACK:
        return LevelType.AUDIO;
      case ContextType.SUBTITLE_TRACK:
        return LevelType.SUBTITLE;
      default:
        return LevelType.MAIN;
    }
  };

  PlaylistLoader.getResponseUrl = function getResponseUrl(response, context) {
    var url = response.url;
    // responseURL not supported on some browsers (it is used to detect URL redirection)
    // data-uri mode also not supported (but no need to detect redirection)
    if (url === undefined || url.indexOf('data:') === 0) {
      // fallback to initial URL
      url = context.url;
    }
    return url;
  };

  /**
   * Returns defaults or configured loader-type overloads (pLoader and loader config params)
   * Default loader is XHRLoader (see utils)
   * @param {object} context
   * @returns {XHRLoader} or other compatible configured overload
   */


  PlaylistLoader.prototype.createInternalLoader = function createInternalLoader(context) {
    var config = this.hls.config;
    var PLoader = config.pLoader;
    var Loader = config.loader;
    var InternalLoader = PLoader || Loader;

    var loader = new InternalLoader(config);

    context.loader = loader;
    this.loaders[context.type] = loader;

    return loader;
  };

  PlaylistLoader.prototype.getInternalLoader = function getInternalLoader(context) {
    return this.loaders[context.type];
  };

  PlaylistLoader.prototype.resetInternalLoader = function resetInternalLoader(contextType) {
    if (this.loaders[contextType]) {
      delete this.loaders[contextType];
    }
  };

  /**
   * Call `destroy` on all internal loader instances mapped (one per context type)
   */


  PlaylistLoader.prototype.destroyInternalLoaders = function destroyInternalLoaders() {
    for (var contextType in this.loaders) {
      var loader = this.loaders[contextType];
      if (loader) {
        loader.destroy();
      }

      this.resetInternalLoader(contextType);
    }
  };

  PlaylistLoader.prototype.destroy = function destroy() {
    this.destroyInternalLoaders();

    _EventHandler.prototype.destroy.call(this);
  };

  PlaylistLoader.prototype.onManifestLoading = function onManifestLoading(data) {
    this.load(data.url, { type: ContextType.MANIFEST, level: 0, id: null });
  };

  PlaylistLoader.prototype.onLevelLoading = function onLevelLoading(data) {
    this.load(data.url, { type: ContextType.LEVEL, level: data.level, id: data.id });
  };

  PlaylistLoader.prototype.onAudioTrackLoading = function onAudioTrackLoading(data) {
    this.load(data.url, { type: ContextType.AUDIO_TRACK, level: 0, id: data.id });
  };

  PlaylistLoader.prototype.onSubtitleTrackLoading = function onSubtitleTrackLoading(data) {
    this.load(data.url, { type: ContextType.SUBTITLE_TRACK, level: 0, id: data.id });
  };

  PlaylistLoader.prototype.load = function load(url, context) {
    var config = this.hls.config;

    logger["b" /* logger */].debug('Loading playlist of type ' + context.type + ', level: ' + context.level + ', id: ' + context.id);

    // Check if a loader for this context already exists
    var loader = this.getInternalLoader(context);
    if (loader) {
      var loaderContext = loader.context;
      if (loaderContext && loaderContext.url === url) {
        // same URL can't overlap
        logger["b" /* logger */].trace('playlist request ongoing');
        return false;
      } else {
        logger["b" /* logger */].warn('aborting previous loader for type: ' + context.type);
        loader.abort();
      }
    }

    var maxRetry = void 0,
        timeout = void 0,
        retryDelay = void 0,
        maxRetryDelay = void 0;

    // apply different configs for retries depending on
    // context (manifest, level, audio/subs playlist)
    switch (context.type) {
      case ContextType.MANIFEST:
        maxRetry = config.manifestLoadingMaxRetry;
        timeout = config.manifestLoadingTimeOut;
        retryDelay = config.manifestLoadingRetryDelay;
        maxRetryDelay = config.manifestLoadingMaxRetryTimeout;
        break;
      case ContextType.LEVEL:
        // Disable internal loader retry logic, since we are managing retries in Level Controller
        maxRetry = 0;
        timeout = config.levelLoadingTimeOut;
        // TODO Introduce retry settings for audio-track and subtitle-track, it should not use level retry config
        break;
      default:
        maxRetry = config.levelLoadingMaxRetry;
        timeout = config.levelLoadingTimeOut;
        retryDelay = config.levelLoadingRetryDelay;
        maxRetryDelay = config.levelLoadingMaxRetryTimeout;
        break;
    }

    loader = this.createInternalLoader(context);

    context.url = url;
    context.responseType = context.responseType || ''; // FIXME: (should not be necessary to do this)

    var loaderConfig = {
      timeout: timeout,
      maxRetry: maxRetry,
      retryDelay: retryDelay,
      maxRetryDelay: maxRetryDelay
    };

    var loaderCallbacks = {
      onSuccess: this.loadsuccess.bind(this),
      onError: this.loaderror.bind(this),
      onTimeout: this.loadtimeout.bind(this)
    };

    logger["b" /* logger */].debug('Calling internal loader delegate for URL: ' + url);

    loader.load(context, loaderConfig, loaderCallbacks);

    return true;
  };

  PlaylistLoader.prototype.loadsuccess = function loadsuccess(response, stats, context) {
    var networkDetails = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    if (context.isSidxRequest) {
      this._handleSidxRequest(response, context);
      this._handlePlaylistLoaded(response, stats, context, networkDetails);
      return;
    }

    this.resetInternalLoader(context.type);

    var string = response.data;

    stats.tload = performance.now();
    // stats.mtime = new Date(target.getResponseHeader('Last-Modified'));

    // Validate if it is an M3U8 at all
    if (string.indexOf('#EXTM3U') !== 0) {
      this._handleManifestParsingError(response, context, 'no EXTM3U delimiter', networkDetails);
      return;
    }

    // Check if chunk-list or master. handle empty chunk list case (first EXTINF not signaled, but TARGETDURATION present)
    if (string.indexOf('#EXTINF:') > 0 || string.indexOf('#EXT-X-TARGETDURATION:') > 0) {
      this._handleTrackOrLevelPlaylist(response, stats, context, networkDetails);
    } else {
      this._handleMasterPlaylist(response, stats, context, networkDetails);
    }
  };

  PlaylistLoader.prototype.loaderror = function loaderror(response, context) {
    var networkDetails = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    this._handleNetworkError(context, networkDetails);
  };

  PlaylistLoader.prototype.loadtimeout = function loadtimeout(stats, context) {
    var networkDetails = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    this._handleNetworkError(context, networkDetails, true);
  };

  PlaylistLoader.prototype._handleMasterPlaylist = function _handleMasterPlaylist(response, stats, context, networkDetails) {
    var hls = this.hls;
    var string = response.data;

    var url = PlaylistLoader.getResponseUrl(response, context);

    var levels = m3u8_parser.parseMasterPlaylist(string, url);
    if (!levels.length) {
      this._handleManifestParsingError(response, context, 'no level found in manifest', networkDetails);
      return;
    }

    // multi level playlist, parse level info

    var audioGroups = levels.map(function (level) {
      return {
        id: level.attrs.AUDIO,
        codec: level.audioCodec
      };
    });

    var audioTracks = m3u8_parser.parseMasterPlaylistMedia(string, url, 'AUDIO', audioGroups);
    var subtitles = m3u8_parser.parseMasterPlaylistMedia(string, url, 'SUBTITLES');

    if (audioTracks.length) {
      // check if we have found an audio track embedded in main playlist (audio track without URI attribute)
      var embeddedAudioFound = false;
      audioTracks.forEach(function (audioTrack) {
        if (!audioTrack.url) {
          embeddedAudioFound = true;
        }
      });

      // if no embedded audio track defined, but audio codec signaled in quality level,
      // we need to signal this main audio track this could happen with playlists with
      // alt audio rendition in which quality levels (main)
      // contains both audio+video. but with mixed audio track not signaled
      if (embeddedAudioFound === false && levels[0].audioCodec && !levels[0].attrs.AUDIO) {
        logger["b" /* logger */].log('audio codec signaled in quality level, but no embedded audio track signaled, create one');
        audioTracks.unshift({
          type: 'main',
          name: 'main'
        });
      }
    }

    hls.trigger(events["a" /* default */].MANIFEST_LOADED, {
      levels: levels,
      audioTracks: audioTracks,
      subtitles: subtitles,
      url: url,
      stats: stats,
      networkDetails: networkDetails
    });
  };

  PlaylistLoader.prototype._handleTrackOrLevelPlaylist = function _handleTrackOrLevelPlaylist(response, stats, context, networkDetails) {
    var hls = this.hls;

    var id = context.id,
        level = context.level,
        type = context.type;


    var url = PlaylistLoader.getResponseUrl(response, context);

    var levelUrlId = isNaN(id) ? 0 : id;
    var levelId = isNaN(level) ? levelUrlId : level; // level -> id -> 0
    var levelType = PlaylistLoader.mapContextToLevelType(context);

    var levelDetails = m3u8_parser.parseLevelPlaylist(response.data, url, levelId, levelType, levelUrlId);

    // set stats on level structure
    levelDetails.tload = stats.tload;

    // We have done our first request (Manifest-type) and receive
    // not a master playlist but a chunk-list (track/level)
    // We fire the manifest-loaded event anyway with the parsed level-details
    // by creating a single-level structure for it.
    if (type === ContextType.MANIFEST) {
      var singleLevel = {
        url: url,
        details: levelDetails
      };

      hls.trigger(events["a" /* default */].MANIFEST_LOADED, {
        levels: [singleLevel],
        audioTracks: [],
        url: url,
        stats: stats,
        networkDetails: networkDetails
      });
    }

    // save parsing time
    stats.tparsed = performance.now();

    // in case we need SIDX ranges
    // return early after calling load for
    // the SIDX box.
    if (levelDetails.needSidxRanges) {
      var sidxUrl = levelDetails.initSegment.url;
      this.load(sidxUrl, {
        isSidxRequest: true,
        type: type,
        level: level,
        levelDetails: levelDetails,
        id: id,
        rangeStart: 0,
        rangeEnd: 2048,
        responseType: 'arraybuffer'
      });
      return;
    }

    // extend the context with the new levelDetails property
    context.levelDetails = levelDetails;

    this._handlePlaylistLoaded(response, stats, context, networkDetails);
  };

  PlaylistLoader.prototype._handleSidxRequest = function _handleSidxRequest(response, context) {
    var sidxInfo = mp4demuxer["a" /* default */].parseSegmentIndex(new Uint8Array(response.data));
    sidxInfo.references.forEach(function (segmentRef, index) {
      var segRefInfo = segmentRef.info;
      var frag = context.levelDetails.fragments[index];

      if (frag.byteRange.length === 0) {
        frag.rawByteRange = String(1 + segRefInfo.end - segRefInfo.start) + '@' + String(segRefInfo.start);
      }
    });

    context.levelDetails.initSegment.rawByteRange = String(sidxInfo.moovEndOffset) + '@0';
  };

  PlaylistLoader.prototype._handleManifestParsingError = function _handleManifestParsingError(response, context, reason, networkDetails) {
    this.hls.trigger(events["a" /* default */].ERROR, {
      type: errors["b" /* ErrorTypes */].NETWORK_ERROR,
      details: errors["a" /* ErrorDetails */].MANIFEST_PARSING_ERROR,
      fatal: true,
      url: response.url,
      reason: reason,
      networkDetails: networkDetails
    });
  };

  PlaylistLoader.prototype._handleNetworkError = function _handleNetworkError(context, networkDetails) {
    var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    logger["b" /* logger */].info('A network error occured while loading a ' + context.type + '-type playlist');

    var details = void 0;
    var fatal = void 0;

    var loader = this.getInternalLoader(context);

    switch (context.type) {
      case ContextType.MANIFEST:
        details = timeout ? errors["a" /* ErrorDetails */].MANIFEST_LOAD_TIMEOUT : errors["a" /* ErrorDetails */].MANIFEST_LOAD_ERROR;
        fatal = true;
        break;
      case ContextType.LEVEL:
        details = timeout ? errors["a" /* ErrorDetails */].LEVEL_LOAD_TIMEOUT : errors["a" /* ErrorDetails */].LEVEL_LOAD_ERROR;
        fatal = false;
        break;
      case ContextType.AUDIO_TRACK:
        details = timeout ? errors["a" /* ErrorDetails */].AUDIO_TRACK_LOAD_TIMEOUT : errors["a" /* ErrorDetails */].AUDIO_TRACK_LOAD_ERROR;
        fatal = false;
        break;
      default:
        // details = ...?
        fatal = false;
    }

    if (loader) {
      loader.abort();
      this.resetInternalLoader(context.type);
    }

    this.hls.trigger(events["a" /* default */].ERROR, {
      type: errors["b" /* ErrorTypes */].NETWORK_ERROR,
      details: details,
      fatal: fatal,
      url: loader.url,
      loader: loader,
      context: context,
      networkDetails: networkDetails
    });
  };

  PlaylistLoader.prototype._handlePlaylistLoaded = function _handlePlaylistLoaded(response, stats, context, networkDetails) {
    var type = context.type,
        level = context.level,
        id = context.id,
        levelDetails = context.levelDetails;


    if (!levelDetails.targetduration) {
      this._handleManifestParsingError(response, context, 'invalid target duration', networkDetails);
      return;
    }

    var canHaveLevels = PlaylistLoader.canHaveQualityLevels(context.type);
    if (canHaveLevels) {
      this.hls.trigger(events["a" /* default */].LEVEL_LOADED, {
        details: levelDetails,
        level: level || 0,
        id: id || 0,
        stats: stats,
        networkDetails: networkDetails
      });
    } else {
      switch (type) {
        case ContextType.AUDIO_TRACK:
          this.hls.trigger(events["a" /* default */].AUDIO_TRACK_LOADED, {
            details: levelDetails,
            id: id,
            stats: stats,
            networkDetails: networkDetails
          });
          break;
        case ContextType.SUBTITLE_TRACK:
          this.hls.trigger(events["a" /* default */].SUBTITLE_TRACK_LOADED, {
            details: levelDetails,
            id: id,
            stats: stats,
            networkDetails: networkDetails
          });
          break;
      }
    }
  };

  playlist_loader__createClass(PlaylistLoader, null, [{
    key: 'ContextType',
    get: function get() {
      return ContextType;
    }
  }, {
    key: 'LevelType',
    get: function get() {
      return LevelType;
    }
  }]);

  return PlaylistLoader;
}(event_handler);

/* harmony default export */ var playlist_loader = (playlist_loader_PlaylistLoader);
// CONCATENATED MODULE: ./src/loader/fragment-loader.js
function fragment_loader__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function fragment_loader__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function fragment_loader__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * Fragment Loader
*/






var fragment_loader_FragmentLoader = function (_EventHandler) {
  fragment_loader__inherits(FragmentLoader, _EventHandler);

  function FragmentLoader(hls) {
    fragment_loader__classCallCheck(this, FragmentLoader);

    var _this = fragment_loader__possibleConstructorReturn(this, _EventHandler.call(this, hls, events["a" /* default */].FRAG_LOADING));

    _this.loaders = {};
    return _this;
  }

  FragmentLoader.prototype.destroy = function destroy() {
    var loaders = this.loaders;
    for (var loaderName in loaders) {
      var loader = loaders[loaderName];
      if (loader) {
        loader.destroy();
      }
    }
    this.loaders = {};

    _EventHandler.prototype.destroy.call(this);
  };

  FragmentLoader.prototype.onFragLoading = function onFragLoading(data) {
    var frag = data.frag,
        type = frag.type,
        loaders = this.loaders,
        config = this.hls.config,
        FragmentILoader = config.fLoader,
        DefaultILoader = config.loader;

    // reset fragment state
    frag.loaded = 0;

    var loader = loaders[type];
    if (loader) {
      logger["b" /* logger */].warn('abort previous fragment loader for type: ' + type);
      loader.abort();
    }

    loader = loaders[type] = frag.loader = config.fLoader ? new FragmentILoader(config) : new DefaultILoader(config);

    var loaderContext = void 0,
        loaderConfig = void 0,
        loaderCallbacks = void 0;

    loaderContext = { url: frag.url, frag: frag, responseType: 'arraybuffer', progressData: false };

    var start = frag.byteRangeStartOffset,
        end = frag.byteRangeEndOffset;

    if (!isNaN(start) && !isNaN(end)) {
      loaderContext.rangeStart = start;
      loaderContext.rangeEnd = end;
    }

    loaderConfig = {
      timeout: config.fragLoadingTimeOut,
      maxRetry: 0,
      retryDelay: 0,
      maxRetryDelay: config.fragLoadingMaxRetryTimeout
    };

    loaderCallbacks = {
      onSuccess: this.loadsuccess.bind(this),
      onError: this.loaderror.bind(this),
      onTimeout: this.loadtimeout.bind(this),
      onProgress: this.loadprogress.bind(this)
    };

    loader.load(loaderContext, loaderConfig, loaderCallbacks);
  };

  FragmentLoader.prototype.loadsuccess = function loadsuccess(response, stats, context) {
    var networkDetails = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    var payload = response.data,
        frag = context.frag;
    // detach fragment loader on load success
    frag.loader = undefined;
    this.loaders[frag.type] = undefined;
    this.hls.trigger(events["a" /* default */].FRAG_LOADED, { payload: payload, frag: frag, stats: stats, networkDetails: networkDetails });
  };

  FragmentLoader.prototype.loaderror = function loaderror(response, context) {
    var networkDetails = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var loader = context.loader;
    if (loader) {
      loader.abort();
    }

    this.loaders[context.type] = undefined;
    this.hls.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].NETWORK_ERROR, details: errors["a" /* ErrorDetails */].FRAG_LOAD_ERROR, fatal: false, frag: context.frag, response: response, networkDetails: networkDetails });
  };

  FragmentLoader.prototype.loadtimeout = function loadtimeout(stats, context) {
    var networkDetails = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var loader = context.loader;
    if (loader) {
      loader.abort();
    }

    this.loaders[context.type] = undefined;
    this.hls.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].NETWORK_ERROR, details: errors["a" /* ErrorDetails */].FRAG_LOAD_TIMEOUT, fatal: false, frag: context.frag, networkDetails: networkDetails });
  };

  // data will be used for progressive parsing


  FragmentLoader.prototype.loadprogress = function loadprogress(stats, context, data) {
    var networkDetails = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    // jshint ignore:line
    var frag = context.frag;
    frag.loaded = stats.loaded;
    this.hls.trigger(events["a" /* default */].FRAG_LOAD_PROGRESS, { frag: frag, stats: stats, networkDetails: networkDetails });
  };

  return FragmentLoader;
}(event_handler);

/* harmony default export */ var fragment_loader = (fragment_loader_FragmentLoader);
// CONCATENATED MODULE: ./src/loader/key-loader.js
function key_loader__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function key_loader__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function key_loader__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * Decrypt key Loader
*/






var key_loader_KeyLoader = function (_EventHandler) {
  key_loader__inherits(KeyLoader, _EventHandler);

  function KeyLoader(hls) {
    key_loader__classCallCheck(this, KeyLoader);

    var _this = key_loader__possibleConstructorReturn(this, _EventHandler.call(this, hls, events["a" /* default */].KEY_LOADING));

    _this.loaders = {};
    _this.decryptkey = null;
    _this.decrypturl = null;
    return _this;
  }

  KeyLoader.prototype.destroy = function destroy() {
    for (var loaderName in this.loaders) {
      var loader = this.loaders[loaderName];
      if (loader) {
        loader.destroy();
      }
    }
    this.loaders = {};
    event_handler.prototype.destroy.call(this);
  };

  KeyLoader.prototype.onKeyLoading = function onKeyLoading(data) {
    var frag = data.frag,
        type = frag.type,
        loader = this.loaders[type],
        decryptdata = frag.decryptdata,
        uri = decryptdata.uri;
    // if uri is different from previous one or if decrypt key not retrieved yet
    if (uri !== this.decrypturl || this.decryptkey === null) {
      var config = this.hls.config;

      if (loader) {
        logger["b" /* logger */].warn('abort previous key loader for type:' + type);
        loader.abort();
      }
      frag.loader = this.loaders[type] = new config.loader(config);
      this.decrypturl = uri;
      this.decryptkey = null;

      var loaderContext = void 0,
          loaderConfig = void 0,
          loaderCallbacks = void 0;
      loaderContext = { url: uri, frag: frag, responseType: 'arraybuffer' };
      loaderConfig = { timeout: config.fragLoadingTimeOut, maxRetry: config.fragLoadingMaxRetry, retryDelay: config.fragLoadingRetryDelay, maxRetryDelay: config.fragLoadingMaxRetryTimeout };
      loaderCallbacks = { onSuccess: this.loadsuccess.bind(this), onError: this.loaderror.bind(this), onTimeout: this.loadtimeout.bind(this) };
      frag.loader.load(loaderContext, loaderConfig, loaderCallbacks);
    } else if (this.decryptkey) {
      // we already loaded this key, return it
      decryptdata.key = this.decryptkey;
      this.hls.trigger(events["a" /* default */].KEY_LOADED, { frag: frag });
    }
  };

  KeyLoader.prototype.loadsuccess = function loadsuccess(response, stats, context) {
    var frag = context.frag;
    this.decryptkey = frag.decryptdata.key = new Uint8Array(response.data);
    // detach fragment loader on load success
    frag.loader = undefined;
    this.loaders[frag.type] = undefined;
    this.hls.trigger(events["a" /* default */].KEY_LOADED, { frag: frag });
  };

  KeyLoader.prototype.loaderror = function loaderror(response, context) {
    var frag = context.frag,
        loader = frag.loader;
    if (loader) {
      loader.abort();
    }

    this.loaders[context.type] = undefined;
    this.hls.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].NETWORK_ERROR, details: errors["a" /* ErrorDetails */].KEY_LOAD_ERROR, fatal: false, frag: frag, response: response });
  };

  KeyLoader.prototype.loadtimeout = function loadtimeout(stats, context) {
    var frag = context.frag,
        loader = frag.loader;
    if (loader) {
      loader.abort();
    }

    this.loaders[context.type] = undefined;
    this.hls.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].NETWORK_ERROR, details: errors["a" /* ErrorDetails */].KEY_LOAD_TIMEOUT, fatal: false, frag: frag });
  };

  return KeyLoader;
}(event_handler);

/* harmony default export */ var key_loader = (key_loader_KeyLoader);
// CONCATENATED MODULE: ./src/controller/fragment-tracker.js
function fragment_tracker__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function fragment_tracker__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function fragment_tracker__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




var FragmentState = {
  NOT_LOADED: 'NOT_LOADED',
  APPENDING: 'APPENDING',
  PARTIAL: 'PARTIAL',
  OK: 'OK'
};

var fragment_tracker_FragmentTracker = function (_EventHandler) {
  fragment_tracker__inherits(FragmentTracker, _EventHandler);

  function FragmentTracker(hls) {
    fragment_tracker__classCallCheck(this, FragmentTracker);

    var _this = fragment_tracker__possibleConstructorReturn(this, _EventHandler.call(this, hls, events["a" /* default */].BUFFER_APPENDED, events["a" /* default */].FRAG_BUFFERED, events["a" /* default */].FRAG_LOADED));

    _this.bufferPadding = 0.2;

    _this.fragments = Object.create(null);
    _this.timeRanges = Object.create(null);

    _this.config = hls.config;
    return _this;
  }

  FragmentTracker.prototype.destroy = function destroy() {
    this.fragments = null;
    this.timeRanges = null;
    this.config = null;
    event_handler.prototype.destroy.call(this);
    _EventHandler.prototype.destroy.call(this);
  };

  /**
   * Return a Fragment that match the position and levelType.
   * If not found any Fragment, return null
   * @param {number} position
   * @param {LevelType} levelType
   * @returns {Fragment|null}
   */


  FragmentTracker.prototype.getBufferedFrag = function getBufferedFrag(position, levelType) {
    var fragments = this.fragments;
    var bufferedFrags = Object.keys(fragments).filter(function (key) {
      var fragmentEntity = fragments[key];
      if (fragmentEntity.body.type !== levelType) {
        return false;
      }

      if (!fragmentEntity.buffered) {
        return false;
      }

      var frag = fragmentEntity.body;
      return frag.startPTS <= position && position <= frag.endPTS;
    });
    if (bufferedFrags.length === 0) {
      return null;
    } else {
      // https://github.com/video-dev/hls.js/pull/1545#discussion_r166229566
      var bufferedFragKey = bufferedFrags.pop();
      return fragments[bufferedFragKey].body;
    }
  };

  /**
   * Partial fragments effected by coded frame eviction will be removed
   * The browser will unload parts of the buffer to free up memory for new buffer data
   * Fragments will need to be reloaded when the buffer is freed up, removing partial fragments will allow them to reload(since there might be parts that are still playable)
   * @param {String} elementaryStream The elementaryStream of media this is (eg. video/audio)
   * @param {TimeRanges} timeRange TimeRange object from a sourceBuffer
   */


  FragmentTracker.prototype.detectEvictedFragments = function detectEvictedFragments(elementaryStream, timeRange) {
    var _this2 = this;

    var fragmentTimes = void 0,
        time = void 0;
    // Check if any flagged fragments have been unloaded
    Object.keys(this.fragments).forEach(function (key) {
      var fragmentEntity = _this2.fragments[key];
      if (fragmentEntity.buffered === true) {
        var esData = fragmentEntity.range[elementaryStream];
        if (esData) {
          fragmentTimes = esData.time;
          for (var i = 0; i < fragmentTimes.length; i++) {
            time = fragmentTimes[i];

            if (_this2.isTimeBuffered(time.startPTS, time.endPTS, timeRange) === false) {
              // Unregister partial fragment as it needs to load again to be reused
              _this2.removeFragment(fragmentEntity.body);
              break;
            }
          }
        }
      }
    });
  };

  /**
   * Checks if the fragment passed in is loaded in the buffer properly
   * Partially loaded fragments will be registered as a partial fragment
   * @param {Object} fragment Check the fragment against all sourceBuffers loaded
   */


  FragmentTracker.prototype.detectPartialFragments = function detectPartialFragments(fragment) {
    var _this3 = this;

    var fragKey = this.getFragmentKey(fragment);
    var fragmentEntity = this.fragments[fragKey];
    if (fragmentEntity) {
      fragmentEntity.buffered = true;

      Object.keys(this.timeRanges).forEach(function (elementaryStream) {
        if (fragment.hasElementaryStream(elementaryStream) === true) {
          var timeRange = _this3.timeRanges[elementaryStream];
          // Check for malformed fragments
          // Gaps need to be calculated for each elementaryStream
          fragmentEntity.range[elementaryStream] = _this3.getBufferedTimes(fragment.startPTS, fragment.endPTS, timeRange);
        }
      });
    }
  };

  FragmentTracker.prototype.getBufferedTimes = function getBufferedTimes(startPTS, endPTS, timeRange) {
    var fragmentTimes = [];
    var startTime = void 0,
        endTime = void 0;
    var fragmentPartial = false;
    for (var i = 0; i < timeRange.length; i++) {
      startTime = timeRange.start(i) - this.bufferPadding;
      endTime = timeRange.end(i) + this.bufferPadding;
      if (startPTS >= startTime && endPTS <= endTime) {
        // Fragment is entirely contained in buffer
        // No need to check the other timeRange times since it's completely playable
        fragmentTimes.push({
          startPTS: Math.max(startPTS, timeRange.start(i)),
          endPTS: Math.min(endPTS, timeRange.end(i))
        });
        break;
      } else if (startPTS < endTime && endPTS > startTime) {
        // Check for intersection with buffer
        // Get playable sections of the fragment
        fragmentTimes.push({
          startPTS: Math.max(startPTS, timeRange.start(i)),
          endPTS: Math.min(endPTS, timeRange.end(i))
        });
        fragmentPartial = true;
      } else if (endPTS <= startTime) {
        // No need to check the rest of the timeRange as it is in order
        break;
      }
    }

    return {
      time: fragmentTimes,
      partial: fragmentPartial
    };
  };

  FragmentTracker.prototype.getFragmentKey = function getFragmentKey(fragment) {
    return fragment.type + '_' + fragment.level + '_' + fragment.urlId + '_' + fragment.sn;
  };

  /**
   * Gets the partial fragment for a certain time
   * @param {Number} time
   * @returns {Object} fragment Returns a partial fragment at a time or null if there is no partial fragment
   */


  FragmentTracker.prototype.getPartialFragment = function getPartialFragment(time) {
    var _this4 = this;

    var timePadding = void 0,
        startTime = void 0,
        endTime = void 0;
    var bestFragment = null;
    var bestOverlap = 0;
    Object.keys(this.fragments).forEach(function (key) {
      var fragmentEntity = _this4.fragments[key];
      if (_this4.isPartial(fragmentEntity)) {
        startTime = fragmentEntity.body.startPTS - _this4.bufferPadding;
        endTime = fragmentEntity.body.endPTS + _this4.bufferPadding;
        if (time >= startTime && time <= endTime) {
          // Use the fragment that has the most padding from start and end time
          timePadding = Math.min(time - startTime, endTime - time);
          if (bestOverlap <= timePadding) {
            bestFragment = fragmentEntity.body;
            bestOverlap = timePadding;
          }
        }
      }
    });
    return bestFragment;
  };

  /**
   * @param {Object} fragment The fragment to check
   * @returns {String} Returns the fragment state when a fragment never loaded or if it partially loaded
   */


  FragmentTracker.prototype.getState = function getState(fragment) {
    var fragKey = this.getFragmentKey(fragment);
    var fragmentEntity = this.fragments[fragKey];
    var state = FragmentState.NOT_LOADED;

    if (fragmentEntity !== undefined) {
      if (!fragmentEntity.buffered) {
        state = FragmentState.APPENDING;
      } else if (this.isPartial(fragmentEntity) === true) {
        state = FragmentState.PARTIAL;
      } else {
        state = FragmentState.OK;
      }
    }

    return state;
  };

  FragmentTracker.prototype.isPartial = function isPartial(fragmentEntity) {
    return fragmentEntity.buffered === true && (fragmentEntity.range.video !== undefined && fragmentEntity.range.video.partial === true || fragmentEntity.range.audio !== undefined && fragmentEntity.range.audio.partial === true);
  };

  FragmentTracker.prototype.isTimeBuffered = function isTimeBuffered(startPTS, endPTS, timeRange) {
    var startTime = void 0,
        endTime = void 0;
    for (var i = 0; i < timeRange.length; i++) {
      startTime = timeRange.start(i) - this.bufferPadding;
      endTime = timeRange.end(i) + this.bufferPadding;
      if (startPTS >= startTime && endPTS <= endTime) {
        return true;
      }

      if (endPTS <= startTime) {
        // No need to check the rest of the timeRange as it is in order
        return false;
      }
    }

    return false;
  };

  /**
   * Fires when a fragment loading is completed
   */


  FragmentTracker.prototype.onFragLoaded = function onFragLoaded(e) {
    var fragment = e.frag;
    // don't track initsegment (for which sn is not a number)
    // don't track frags used for bitrateTest, they're irrelevant.
    if (!isNaN(fragment.sn) && !fragment.bitrateTest) {
      var fragKey = this.getFragmentKey(fragment);
      var fragmentEntity = {
        body: fragment,
        range: Object.create(null),
        buffered: false
      };
      this.fragments[fragKey] = fragmentEntity;
    }
  };

  /**
   * Fires when the buffer is updated
   */


  FragmentTracker.prototype.onBufferAppended = function onBufferAppended(e) {
    var _this5 = this;

    // Store the latest timeRanges loaded in the buffer
    this.timeRanges = e.timeRanges;
    Object.keys(this.timeRanges).forEach(function (elementaryStream) {
      var timeRange = _this5.timeRanges[elementaryStream];
      _this5.detectEvictedFragments(elementaryStream, timeRange);
    });
  };

  /**
   * Fires after a fragment has been loaded into the source buffer
   */


  FragmentTracker.prototype.onFragBuffered = function onFragBuffered(e) {
    this.detectPartialFragments(e.frag);
  };

  /**
   * Return true if fragment tracker has the fragment.
   * @param {Object} fragment
   * @returns {boolean}
   */


  FragmentTracker.prototype.hasFragment = function hasFragment(fragment) {
    var fragKey = this.getFragmentKey(fragment);
    return this.fragments[fragKey] !== undefined;
  };

  /**
   * Remove a fragment from fragment tracker until it is loaded again
   * @param {Object} fragment The fragment to remove
   */


  FragmentTracker.prototype.removeFragment = function removeFragment(fragment) {
    var fragKey = this.getFragmentKey(fragment);
    delete this.fragments[fragKey];
  };

  /**
   * Remove all fragments from fragment tracker.
   */


  FragmentTracker.prototype.removeAllFragments = function removeAllFragments() {
    this.fragments = Object.create(null);
  };

  return FragmentTracker;
}(event_handler);
// CONCATENATED MODULE: ./src/utils/binary-search.js
var BinarySearch = {
  /**
     * Searches for an item in an array which matches a certain condition.
     * This requires the condition to only match one item in the array,
     * and for the array to be ordered.
     *
     * @param {Array} list The array to search.
     * @param {Function} comparisonFunction
     *      Called and provided a candidate item as the first argument.
     *      Should return:
     *          > -1 if the item should be located at a lower index than the provided item.
     *          > 1 if the item should be located at a higher index than the provided item.
     *          > 0 if the item is the item you're looking for.
     *
     * @return {*} The object if it is found or null otherwise.
     */
  search: function search(list, comparisonFunction) {
    var minIndex = 0;
    var maxIndex = list.length - 1;
    var currentIndex = null;
    var currentElement = null;

    while (minIndex <= maxIndex) {
      currentIndex = (minIndex + maxIndex) / 2 | 0;
      currentElement = list[currentIndex];

      var comparisonResult = comparisonFunction(currentElement);
      if (comparisonResult > 0) {
        minIndex = currentIndex + 1;
      } else if (comparisonResult < 0) {
        maxIndex = currentIndex - 1;
      } else {
        return currentElement;
      }
    }

    return null;
  }
};

/* harmony default export */ var binary_search = (BinarySearch);
// CONCATENATED MODULE: ./src/utils/buffer-helper.js
function buffer_helper__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @module BufferHelper
 *
 * Providing methods dealing with buffer length retrieval for example.
 *
 * In general, a helper around HTML5 MediaElement TimeRanges gathered from `buffered` property.
 *
 * Also @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/buffered
*/

var BufferHelper = function () {
  function BufferHelper() {
    buffer_helper__classCallCheck(this, BufferHelper);
  }

  /**
   * Return true if `media`'s buffered include `position`
   * @param {HTMLMediaElement|SourceBuffer} media
   * @param {number} position
   * @returns {boolean}
   */
  BufferHelper.isBuffered = function isBuffered(media, position) {
    try {
      if (media) {
        var buffered = media.buffered;
        for (var i = 0; i < buffered.length; i++) {
          if (position >= buffered.start(i) && position <= buffered.end(i)) {
            return true;
          }
        }
      }
    } catch (error) {
      // this is to catch
      // InvalidStateError: Failed to read the 'buffered' property from 'SourceBuffer':
      // This SourceBuffer has been removed from the parent media source
    }
    return false;
  };

  BufferHelper.bufferInfo = function bufferInfo(media, pos, maxHoleDuration) {
    try {
      if (media) {
        var vbuffered = media.buffered,
            buffered = [],
            i = void 0;
        for (i = 0; i < vbuffered.length; i++) {
          buffered.push({ start: vbuffered.start(i), end: vbuffered.end(i) });
        }

        return this.bufferedInfo(buffered, pos, maxHoleDuration);
      }
    } catch (error) {
      // this is to catch
      // InvalidStateError: Failed to read the 'buffered' property from 'SourceBuffer':
      // This SourceBuffer has been removed from the parent media source
    }
    return { len: 0, start: pos, end: pos, nextStart: undefined };
  };

  BufferHelper.bufferedInfo = function bufferedInfo(buffered, pos, maxHoleDuration) {
    var buffered2 = [],

    // bufferStart and bufferEnd are buffer boundaries around current video position
    bufferLen = void 0,
        bufferStart = void 0,
        bufferEnd = void 0,
        bufferStartNext = void 0,
        i = void 0;
    // sort on buffer.start/smaller end (IE does not always return sorted buffered range)
    buffered.sort(function (a, b) {
      var diff = a.start - b.start;
      if (diff) {
        return diff;
      } else {
        return b.end - a.end;
      }
    });
    // there might be some small holes between buffer time range
    // consider that holes smaller than maxHoleDuration are irrelevant and build another
    // buffer time range representations that discards those holes
    for (i = 0; i < buffered.length; i++) {
      var buf2len = buffered2.length;
      if (buf2len) {
        var buf2end = buffered2[buf2len - 1].end;
        // if small hole (value between 0 or maxHoleDuration ) or overlapping (negative)
        if (buffered[i].start - buf2end < maxHoleDuration) {
          // merge overlapping time ranges
          // update lastRange.end only if smaller than item.end
          // e.g.  [ 1, 15] with  [ 2,8] => [ 1,15] (no need to modify lastRange.end)
          // whereas [ 1, 8] with  [ 2,15] => [ 1,15] ( lastRange should switch from [1,8] to [1,15])
          if (buffered[i].end > buf2end) {
            buffered2[buf2len - 1].end = buffered[i].end;
          }
        } else {
          // big hole
          buffered2.push(buffered[i]);
        }
      } else {
        // first value
        buffered2.push(buffered[i]);
      }
    }
    for (i = 0, bufferLen = 0, bufferStart = bufferEnd = pos; i < buffered2.length; i++) {
      var start = buffered2[i].start,
          end = buffered2[i].end;
      // logger.log('buf start/end:' + buffered.start(i) + '/' + buffered.end(i));
      if (pos + maxHoleDuration >= start && pos < end) {
        // play position is inside this buffer TimeRange, retrieve end of buffer position and buffer length
        bufferStart = start;
        bufferEnd = end;
        bufferLen = bufferEnd - pos;
      } else if (pos + maxHoleDuration < start) {
        bufferStartNext = start;
        break;
      }
    }
    return { len: bufferLen, start: bufferStart, end: bufferEnd, nextStart: bufferStartNext };
  };

  return BufferHelper;
}();
// EXTERNAL MODULE: ./node_modules/events/events.js
var events_events = __webpack_require__(6);
var events_default = /*#__PURE__*/__webpack_require__.n(events_events);

// EXTERNAL MODULE: ./node_modules/webworkify-webpack/index.js
var webworkify_webpack = __webpack_require__(11);
var webworkify_webpack_default = /*#__PURE__*/__webpack_require__.n(webworkify_webpack);

// EXTERNAL MODULE: ./src/demux/demuxer-inline.js + 11 modules
var demuxer_inline = __webpack_require__(9);

// CONCATENATED MODULE: ./src/utils/mediasource-helper.js
/**
 * MediaSource helper
 */

function getMediaSource() {
  if (typeof window !== 'undefined') {
    return window.MediaSource || window.WebKitMediaSource;
  }
}
// EXTERNAL MODULE: ./src/utils/get-self-scope.js
var get_self_scope = __webpack_require__(3);

// CONCATENATED MODULE: ./src/demux/demuxer.js
function demuxer__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }











// see https://stackoverflow.com/a/11237259/589493
var global = Object(get_self_scope["a" /* getSelfScope */])(); // safeguard for code that might run both on worker and main thread
var MediaSource = getMediaSource();

var demuxer_Demuxer = function () {
  function Demuxer(hls, id) {
    demuxer__classCallCheck(this, Demuxer);

    this.hls = hls;
    this.id = id;
    // observer setup
    var observer = this.observer = new events_default.a();
    var config = hls.config;
    observer.trigger = function trigger(event) {
      for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        data[_key - 1] = arguments[_key];
      }

      observer.emit.apply(observer, [event, event].concat(data));
    };

    observer.off = function off(event) {
      for (var _len2 = arguments.length, data = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        data[_key2 - 1] = arguments[_key2];
      }

      observer.removeListener.apply(observer, [event].concat(data));
    };

    var forwardMessage = function (ev, data) {
      data = data || {};
      data.frag = this.frag;
      data.id = this.id;
      hls.trigger(ev, data);
    }.bind(this);

    // forward events to main thread
    observer.on(events["a" /* default */].FRAG_DECRYPTED, forwardMessage);
    observer.on(events["a" /* default */].FRAG_PARSING_INIT_SEGMENT, forwardMessage);
    observer.on(events["a" /* default */].FRAG_PARSING_DATA, forwardMessage);
    observer.on(events["a" /* default */].FRAG_PARSED, forwardMessage);
    observer.on(events["a" /* default */].ERROR, forwardMessage);
    observer.on(events["a" /* default */].FRAG_PARSING_METADATA, forwardMessage);
    observer.on(events["a" /* default */].FRAG_PARSING_USERDATA, forwardMessage);
    observer.on(events["a" /* default */].INIT_PTS_FOUND, forwardMessage);

    var typeSupported = {
      mp4: MediaSource.isTypeSupported('video/mp4'),
      mpeg: MediaSource.isTypeSupported('audio/mpeg'),
      mp3: MediaSource.isTypeSupported('audio/mp4; codecs="mp3"')
    };
    // navigator.vendor is not always available in Web Worker
    // refer to https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/navigator
    var vendor = navigator.vendor;
    if (config.enableWorker && typeof Worker !== 'undefined') {
      logger["b" /* logger */].log('demuxing in webworker');
      var w = void 0;
      try {
        w = this.w = webworkify_webpack_default()(/*require.resolve*/(12));
        this.onwmsg = this.onWorkerMessage.bind(this);
        w.addEventListener('message', this.onwmsg);
        w.onerror = function (event) {
          hls.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].OTHER_ERROR, details: errors["a" /* ErrorDetails */].INTERNAL_EXCEPTION, fatal: true, event: 'demuxerWorker', err: { message: event.message + ' (' + event.filename + ':' + event.lineno + ')' } });
        };
        w.postMessage({ cmd: 'init', typeSupported: typeSupported, vendor: vendor, id: id, config: JSON.stringify(config) });
      } catch (err) {
        logger["b" /* logger */].error('error while initializing DemuxerWorker, fallback on DemuxerInline');
        if (w) {
          // revoke the Object URL that was used to create demuxer worker, so as not to leak it
          global.URL.revokeObjectURL(w.objectURL);
        }
        this.demuxer = new demuxer_inline["a" /* default */](observer, typeSupported, config, vendor);
        this.w = undefined;
      }
    } else {
      this.demuxer = new demuxer_inline["a" /* default */](observer, typeSupported, config, vendor);
    }
  }

  Demuxer.prototype.destroy = function destroy() {
    var w = this.w;
    if (w) {
      w.removeEventListener('message', this.onwmsg);
      w.terminate();
      this.w = null;
    } else {
      var demuxer = this.demuxer;
      if (demuxer) {
        demuxer.destroy();
        this.demuxer = null;
      }
    }
    var observer = this.observer;
    if (observer) {
      observer.removeAllListeners();
      this.observer = null;
    }
  };

  Demuxer.prototype.push = function push(data, initSegment, audioCodec, videoCodec, frag, duration, accurateTimeOffset, defaultInitPTS) {
    var w = this.w;
    var timeOffset = !isNaN(frag.startDTS) ? frag.startDTS : frag.start;
    var decryptdata = frag.decryptdata;
    var lastFrag = this.frag;
    var discontinuity = !(lastFrag && frag.cc === lastFrag.cc);
    var trackSwitch = !(lastFrag && frag.level === lastFrag.level);
    var nextSN = lastFrag && frag.sn === lastFrag.sn + 1;
    var contiguous = !trackSwitch && nextSN;
    if (discontinuity) {
      logger["b" /* logger */].log(this.id + ':discontinuity detected');
    }

    if (trackSwitch) {
      logger["b" /* logger */].log(this.id + ':switch detected');
    }

    this.frag = frag;
    if (w) {
      // post fragment payload as transferable objects for ArrayBuffer (no copy)
      w.postMessage({ cmd: 'demux', data: data, decryptdata: decryptdata, initSegment: initSegment, audioCodec: audioCodec, videoCodec: videoCodec, timeOffset: timeOffset, discontinuity: discontinuity, trackSwitch: trackSwitch, contiguous: contiguous, duration: duration, accurateTimeOffset: accurateTimeOffset, defaultInitPTS: defaultInitPTS }, data instanceof ArrayBuffer ? [data] : []);
    } else {
      var demuxer = this.demuxer;
      if (demuxer) {
        demuxer.push(data, decryptdata, initSegment, audioCodec, videoCodec, timeOffset, discontinuity, trackSwitch, contiguous, duration, accurateTimeOffset, defaultInitPTS);
      }
    }
  };

  Demuxer.prototype.onWorkerMessage = function onWorkerMessage(ev) {
    var data = ev.data,
        hls = this.hls;
    switch (data.event) {
      case 'init':
        // revoke the Object URL that was used to create demuxer worker, so as not to leak it
        global.URL.revokeObjectURL(this.w.objectURL);
        break;
      // special case for FRAG_PARSING_DATA: data1 and data2 are transferable objects
      case events["a" /* default */].FRAG_PARSING_DATA:
        data.data.data1 = new Uint8Array(data.data1);
        if (data.data2) {
          data.data.data2 = new Uint8Array(data.data2);
        }

      /* falls through */
      default:
        data.data = data.data || {};
        data.data.frag = this.frag;
        data.data.id = this.id;
        hls.trigger(data.event, data.data);
        break;
    }
  };

  return Demuxer;
}();

/* harmony default export */ var demux_demuxer = (demuxer_Demuxer);
// CONCATENATED MODULE: ./src/controller/level-helper.js
/**
 * @module LevelHelper
 *
 * Providing methods dealing with playlist sliding and drift
 *
 * TODO: Create an actual `Level` class/model that deals with all this logic in an object-oriented-manner.
 *
 * */



function addGroupId(level, type, id) {
  switch (type) {
    case 'audio':
      if (!level.audioGroupIds) {
        level.audioGroupIds = [];
      }
      level.audioGroupIds.push(id);
      break;
    case 'text':
      if (!level.textGroupIds) {
        level.textGroupIds = [];
      }
      level.textGroupIds.push(id);
      break;
  }
}

function updatePTS(fragments, fromIdx, toIdx) {
  var fragFrom = fragments[fromIdx],
      fragTo = fragments[toIdx],
      fragToPTS = fragTo.startPTS;
  // if we know startPTS[toIdx]
  if (!isNaN(fragToPTS)) {
    // update fragment duration.
    // it helps to fix drifts between playlist reported duration and fragment real duration
    if (toIdx > fromIdx) {
      fragFrom.duration = fragToPTS - fragFrom.start;
      if (fragFrom.duration < 0) {
        logger["b" /* logger */].warn('negative duration computed for frag ' + fragFrom.sn + ',level ' + fragFrom.level + ', there should be some duration drift between playlist and fragment!');
      }
    } else {
      fragTo.duration = fragFrom.start - fragToPTS;
      if (fragTo.duration < 0) {
        logger["b" /* logger */].warn('negative duration computed for frag ' + fragTo.sn + ',level ' + fragTo.level + ', there should be some duration drift between playlist and fragment!');
      }
    }
  } else {
    // we dont know startPTS[toIdx]
    if (toIdx > fromIdx) {
      fragTo.start = fragFrom.start + fragFrom.duration;
    } else {
      fragTo.start = Math.max(fragFrom.start - fragTo.duration, 0);
    }
  }
}

function updateFragPTSDTS(details, frag, startPTS, endPTS, startDTS, endDTS) {
  // update frag PTS/DTS
  var maxStartPTS = startPTS;
  if (!isNaN(frag.startPTS)) {
    // delta PTS between audio and video
    var deltaPTS = Math.abs(frag.startPTS - startPTS);
    if (isNaN(frag.deltaPTS)) {
      frag.deltaPTS = deltaPTS;
    } else {
      frag.deltaPTS = Math.max(deltaPTS, frag.deltaPTS);
    }

    maxStartPTS = Math.max(startPTS, frag.startPTS);
    startPTS = Math.min(startPTS, frag.startPTS);
    endPTS = Math.max(endPTS, frag.endPTS);
    startDTS = Math.min(startDTS, frag.startDTS);
    endDTS = Math.max(endDTS, frag.endDTS);
  }

  var drift = startPTS - frag.start;
  frag.start = frag.startPTS = startPTS;
  frag.maxStartPTS = maxStartPTS;
  frag.endPTS = endPTS;
  frag.startDTS = startDTS;
  frag.endDTS = endDTS;
  frag.duration = endPTS - startPTS;

  var sn = frag.sn;
  // exit if sn out of range
  if (!details || sn < details.startSN || sn > details.endSN) {
    return 0;
  }

  var fragIdx = void 0,
      fragments = void 0,
      i = void 0;
  fragIdx = sn - details.startSN;
  fragments = details.fragments;
  // update frag reference in fragments array
  // rationale is that fragments array might not contain this frag object.
  // this will happpen if playlist has been refreshed between frag loading and call to updateFragPTSDTS()
  // if we don't update frag, we won't be able to propagate PTS info on the playlist
  // resulting in invalid sliding computation
  fragments[fragIdx] = frag;
  // adjust fragment PTS/duration from seqnum-1 to frag 0
  for (i = fragIdx; i > 0; i--) {
    updatePTS(fragments, i, i - 1);
  }

  // adjust fragment PTS/duration from seqnum to last frag
  for (i = fragIdx; i < fragments.length - 1; i++) {
    updatePTS(fragments, i, i + 1);
  }

  details.PTSKnown = true;
  // logger.log(`                                            frag start/end:${startPTS.toFixed(3)}/${endPTS.toFixed(3)}`);

  return drift;
}

function mergeDetails(oldDetails, newDetails) {
  var start = Math.max(oldDetails.startSN, newDetails.startSN) - newDetails.startSN,
      end = Math.min(oldDetails.endSN, newDetails.endSN) - newDetails.startSN,
      delta = newDetails.startSN - oldDetails.startSN,
      oldfragments = oldDetails.fragments,
      newfragments = newDetails.fragments,
      ccOffset = 0,
      PTSFrag = void 0;

  // potentially retrieve cached initsegment
  if (newDetails.initSegment && oldDetails.initSegment) {
    newDetails.initSegment = oldDetails.initSegment;
  }

  // check if old/new playlists have fragments in common
  if (end < start) {
    newDetails.PTSKnown = false;
    return;
  }
  // loop through overlapping SN and update startPTS , cc, and duration if any found
  for (var i = start; i <= end; i++) {
    var oldFrag = oldfragments[delta + i],
        newFrag = newfragments[i];
    if (newFrag && oldFrag) {
      ccOffset = oldFrag.cc - newFrag.cc;
      if (!isNaN(oldFrag.startPTS)) {
        newFrag.start = newFrag.startPTS = oldFrag.startPTS;
        newFrag.endPTS = oldFrag.endPTS;
        newFrag.duration = oldFrag.duration;
        newFrag.backtracked = oldFrag.backtracked;
        newFrag.dropped = oldFrag.dropped;
        PTSFrag = newFrag;
      }
    }
  }

  if (ccOffset) {
    logger["b" /* logger */].log('discontinuity sliding from playlist, take drift into account');
    for (i = 0; i < newfragments.length; i++) {
      newfragments[i].cc += ccOffset;
    }
  }

  // if at least one fragment contains PTS info, recompute PTS information for all fragments
  if (PTSFrag) {
    updateFragPTSDTS(newDetails, PTSFrag, PTSFrag.startPTS, PTSFrag.endPTS, PTSFrag.startDTS, PTSFrag.endDTS);
  } else {
    // ensure that delta is within oldfragments range
    // also adjust sliding in case delta is 0 (we could have old=[50-60] and new=old=[50-61])
    // in that case we also need to adjust start offset of all fragments
    if (delta >= 0 && delta < oldfragments.length) {
      // adjust start by sliding offset
      var sliding = oldfragments[delta].start;
      for (i = 0; i < newfragments.length; i++) {
        newfragments[i].start += sliding;
      }
    }
  }
  // if we are here, it means we have fragments overlapping between
  // old and new level. reliable PTS info is thus relying on old level
  newDetails.PTSKnown = oldDetails.PTSKnown;
}
// CONCATENATED MODULE: ./src/utils/time-ranges.js
/**
 *  TimeRanges to string helper
 */

var TimeRanges = {
  toString: function toString(r) {
    var log = '',
        len = r.length;
    for (var i = 0; i < len; i++) {
      log += '[' + r.start(i).toFixed(3) + ',' + r.end(i).toFixed(3) + ']';
    }

    return log;
  }
};

/* harmony default export */ var time_ranges = (TimeRanges);
// CONCATENATED MODULE: ./src/utils/discontinuities.js



function findFirstFragWithCC(fragments, cc) {
  var firstFrag = null;

  for (var i = 0; i < fragments.length; i += 1) {
    var currentFrag = fragments[i];
    if (currentFrag && currentFrag.cc === cc) {
      firstFrag = currentFrag;
      break;
    }
  }

  return firstFrag;
}

function findFragWithCC(fragments, CC) {
  return binary_search.search(fragments, function (candidate) {
    if (candidate.cc < CC) {
      return 1;
    } else if (candidate.cc > CC) {
      return -1;
    } else {
      return 0;
    }
  });
}

function shouldAlignOnDiscontinuities(lastFrag, lastLevel, details) {
  var shouldAlign = false;
  if (lastLevel && lastLevel.details && details) {
    if (details.endCC > details.startCC || lastFrag && lastFrag.cc < details.startCC) {
      shouldAlign = true;
    }
  }
  return shouldAlign;
}

// Find the first frag in the previous level which matches the CC of the first frag of the new level
function findDiscontinuousReferenceFrag(prevDetails, curDetails) {
  var prevFrags = prevDetails.fragments;
  var curFrags = curDetails.fragments;

  if (!curFrags.length || !prevFrags.length) {
    logger["b" /* logger */].log('No fragments to align');
    return;
  }

  var prevStartFrag = findFirstFragWithCC(prevFrags, curFrags[0].cc);

  if (!prevStartFrag || prevStartFrag && !prevStartFrag.startPTS) {
    logger["b" /* logger */].log('No frag in previous level to align on');
    return;
  }

  return prevStartFrag;
}

function adjustPts(sliding, details) {
  details.fragments.forEach(function (frag) {
    if (frag) {
      var start = frag.start + sliding;
      frag.start = frag.startPTS = start;
      frag.endPTS = start + frag.duration;
    }
  });
  details.PTSKnown = true;
}

// If a change in CC is detected, the PTS can no longer be relied upon
// Attempt to align the level by using the last level - find the last frag matching the current CC and use it's PTS
// as a reference
function alignDiscontinuities(lastFrag, lastLevel, details) {
  if (shouldAlignOnDiscontinuities(lastFrag, lastLevel, details)) {
    var referenceFrag = findDiscontinuousReferenceFrag(lastLevel.details, details);
    if (referenceFrag) {
      logger["b" /* logger */].log('Adjusting PTS using last level due to CC increase within current level');
      adjustPts(referenceFrag.start, details);
    }
  }
  // try to align using programDateTime attribute (if available)
  if (details.PTSKnown === false && lastLevel && lastLevel.details && lastLevel.details.fragments && lastLevel.details.fragments.length) {
    // if last level sliding is 1000 and its first frag PROGRAM-DATE-TIME is 2017-08-20 1:10:00 AM
    // and if new details first frag PROGRAM DATE-TIME is 2017-08-20 1:10:08 AM
    // then we can deduce that playlist B sliding is 1000+8 = 1008s
    var lastPDT = lastLevel.details.programDateTime;
    var newPDT = details.programDateTime;
    // date diff is in ms. frag.start is in seconds
    var sliding = (newPDT - lastPDT) / 1000 + lastLevel.details.fragments[0].start;
    if (!isNaN(sliding)) {
      logger["b" /* logger */].log('adjusting PTS using programDateTime delta, sliding:' + sliding.toFixed(3));
      adjustPts(sliding, details);
    }
  }
}
// CONCATENATED MODULE: ./src/task-loop.js
function task_loop__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function task_loop__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function task_loop__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



/**
 * Sub-class specialization of EventHandler base class.
 *
 * TaskLoop allows to schedule a task function being called (optionnaly repeatedly) on the main loop,
 * scheduled asynchroneously, avoiding recursive calls in the same tick.
 *
 * The task itself is implemented in `doTick`. It can be requested and called for single execution
 * using the `tick` method.
 *
 * It will be assured that the task execution method (`tick`) only gets called once per main loop "tick",
 * no matter how often it gets requested for execution. Execution in further ticks will be scheduled accordingly.
 *
 * If further execution requests have already been scheduled on the next tick, it can be checked with `hasNextTick`,
 * and cancelled with `clearNextTick`.
 *
 * The task can be scheduled as an interval repeatedly with a period as parameter (see `setInterval`, `clearInterval`).
 *
 * Sub-classes need to implement the `doTick` method which will effectively have the task execution routine.
 *
 * Further explanations:
 *
 * The baseclass has a `tick` method that will schedule the doTick call. It may be called synchroneously
 * only for a stack-depth of one. On re-entrant calls, sub-sequent calls are scheduled for next main loop ticks.
 *
 * When the task execution (`tick` method) is called in re-entrant way this is detected and
 * we are limiting the task execution per call stack to exactly one, but scheduling/post-poning further
 * task processing on the next main loop iteration (also known as "next tick" in the Node/JS runtime lingo).
 */

var TaskLoop = function (_EventHandler) {
  task_loop__inherits(TaskLoop, _EventHandler);

  function TaskLoop(hls) {
    task_loop__classCallCheck(this, TaskLoop);

    for (var _len = arguments.length, events = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      events[_key - 1] = arguments[_key];
    }

    var _this = task_loop__possibleConstructorReturn(this, _EventHandler.call.apply(_EventHandler, [this, hls].concat(events)));

    _this._tickInterval = null;
    _this._tickTimer = null;
    _this._tickCallCount = 0;
    _this._boundTick = _this.tick.bind(_this);
    return _this;
  }

  /**
   * @override
   */


  TaskLoop.prototype.onHandlerDestroying = function onHandlerDestroying() {
    // clear all timers before unregistering from event bus
    this.clearNextTick();
    this.clearInterval();
  };

  /**
   * @returns {boolean}
   */


  TaskLoop.prototype.hasInterval = function hasInterval() {
    return !!this._tickInterval;
  };

  /**
   * @returns {boolean}
   */


  TaskLoop.prototype.hasNextTick = function hasNextTick() {
    return !!this._tickTimer;
  };

  /**
   * @param {number} millis Interval time (ms)
   * @returns {boolean} True when interval has been scheduled, false when already scheduled (no effect)
   */


  TaskLoop.prototype.setInterval = function (_setInterval) {
    function setInterval(_x) {
      return _setInterval.apply(this, arguments);
    }

    setInterval.toString = function () {
      return _setInterval.toString();
    };

    return setInterval;
  }(function (millis) {
    if (!this._tickInterval) {
      this._tickInterval = setInterval(this._boundTick, millis);
      return true;
    }
    return false;
  });

  /**
   * @returns {boolean} True when interval was cleared, false when none was set (no effect)
   */


  TaskLoop.prototype.clearInterval = function (_clearInterval) {
    function clearInterval() {
      return _clearInterval.apply(this, arguments);
    }

    clearInterval.toString = function () {
      return _clearInterval.toString();
    };

    return clearInterval;
  }(function () {
    if (this._tickInterval) {
      clearInterval(this._tickInterval);
      this._tickInterval = null;
      return true;
    }
    return false;
  });

  /**
   * @returns {boolean} True when timeout was cleared, false when none was set (no effect)
   */


  TaskLoop.prototype.clearNextTick = function clearNextTick() {
    if (this._tickTimer) {
      clearTimeout(this._tickTimer);
      this._tickTimer = null;
      return true;
    }
    return false;
  };

  /**
   * Will call the subclass doTick implementation in this main loop tick
   * or in the next one (via setTimeout(,0)) in case it has already been called
   * in this tick (in case this is a re-entrant call).
   */


  TaskLoop.prototype.tick = function tick() {
    this._tickCallCount++;
    if (this._tickCallCount === 1) {
      this.doTick();
      // re-entrant call to tick from previous doTick call stack
      // -> schedule a call on the next main loop iteration to process this task processing request
      if (this._tickCallCount > 1) {
        // make sure only one timer exists at any time at max
        this.clearNextTick();
        this._tickTimer = setTimeout(this._boundTick, 0);
      }
      this._tickCallCount = 0;
    }
  };

  /**
   * For subclass to implement task logic
   * @abstract
   */


  TaskLoop.prototype.doTick = function doTick() {};

  return TaskLoop;
}(event_handler);

/* harmony default export */ var task_loop = (TaskLoop);
// CONCATENATED MODULE: ./src/controller/fragment-finders.js


/**
 * Calculates the PDT of the next load position.
 * bufferEnd in this function is usually the position of the playhead.
 * @param {number} [start = 0] - The PTS of the first fragment within the level
 * @param {number} [bufferEnd = 0] - The end of the contiguous buffered range the playhead is currently within
 * @param {*} levelDetails - An object containing the parsed and computed properties of the currently playing level
 * @returns {number} nextPdt - The computed PDT
 */
function calculateNextPDT() {
  var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var bufferEnd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var levelDetails = arguments[2];

  var pdt = 0;
  if (levelDetails.programDateTime) {
    var parsedDateInt = Date.parse(levelDetails.programDateTime);
    if (!isNaN(parsedDateInt)) {
      pdt = bufferEnd * 1000 + parsedDateInt - 1000 * start;
    }
  }
  return pdt;
}

/**
 * Finds the first fragment whose endPDT value exceeds the given PDT.
 * @param {Array<Fragment>} fragments - The array of candidate fragments
 * @param {number|null} [PDTValue = null] - The PDT value which must be exceeded
 * @returns {*|null} fragment - The best matching fragment
 */
function findFragmentByPDT(fragments) {
  var PDTValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (!Array.isArray(fragments) || !fragments.length || PDTValue === null) {
    return null;
  }

  // if less than start
  var firstSegment = fragments[0];

  if (PDTValue < firstSegment.pdt) {
    return null;
  }

  var lastSegment = fragments[fragments.length - 1];

  if (PDTValue >= lastSegment.endPdt) {
    return null;
  }

  for (var seg = 0; seg < fragments.length; ++seg) {
    var frag = fragments[seg];
    if (PDTValue < frag.endPdt) {
      return frag;
    }
  }
  return null;
}

/**
 * Finds a fragment based on the SN of the previous fragment; or based on the needs of the current buffer.
 * This method compensates for small buffer gaps by applying a tolerance to the start of any candidate fragment, thus
 * breaking any traps which would cause the same fragment to be continuously selected within a small range.
 * @param {*} fragPrevious - The last frag successfully appended
 * @param {Array<Fragment>} fragments - The array of candidate fragments
 * @param {number} [bufferEnd = 0] - The end of the contiguous buffered range the playhead is currently within
 * @param {number} [end = 0] - The computed end time of the stream
 * @param {number} maxFragLookUpTolerance - The amount of time that a fragment's start can be within in order to be considered contiguous
 * @returns {*} foundFrag - The best matching fragment
 */
function findFragmentBySN(fragPrevious, fragments) {
  var bufferEnd = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var end = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var maxFragLookUpTolerance = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

  var foundFrag = void 0;
  var fragNext = fragPrevious ? fragments[fragPrevious.sn - fragments[0].sn + 1] : null;
  if (bufferEnd < end) {
    if (bufferEnd > end - maxFragLookUpTolerance) {
      maxFragLookUpTolerance = 0;
    }

    // Prefer the next fragment if it's within tolerance
    if (fragNext && !fragment_finders_fragmentWithinToleranceTest(bufferEnd, maxFragLookUpTolerance, fragNext)) {
      foundFrag = fragNext;
    } else {
      foundFrag = binary_search.search(fragments, fragment_finders_fragmentWithinToleranceTest.bind(null, bufferEnd, maxFragLookUpTolerance));
    }
  }
  return foundFrag;
}

/**
 * The test function used by the findFragmentBySn's BinarySearch to look for the best match to the current buffer conditions.
 * @param {*} candidate - The fragment to test
 * @param {number} [bufferEnd = 0] - The end of the current buffered range the playhead is currently within
 * @param {number} [maxFragLookUpTolerance = 0] - The amount of time that a fragment's start can be within in order to be considered contiguous
 * @returns {number} - 0 if it matches, 1 if too low, -1 if too high
 */
function fragment_finders_fragmentWithinToleranceTest() {
  var bufferEnd = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var maxFragLookUpTolerance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var candidate = arguments[2];

  // offset should be within fragment boundary - config.maxFragLookUpTolerance
  // this is to cope with situations like
  // bufferEnd = 9.991
  // frag[Ø] : [0,10]
  // frag[1] : [10,20]
  // bufferEnd is within frag[0] range ... although what we are expecting is to return frag[1] here
  //              frag start               frag start+duration
  //                  |-----------------------------|
  //              <--->                         <--->
  //  ...--------><-----------------------------><---------....
  // previous frag         matching fragment         next frag
  //  return -1             return 0                 return 1
  // logger.log(`level/sn/start/end/bufEnd:${level}/${candidate.sn}/${candidate.start}/${(candidate.start+candidate.duration)}/${bufferEnd}`);
  // Set the lookup tolerance to be small enough to detect the current segment - ensures we don't skip over very small segments
  var candidateLookupTolerance = Math.min(maxFragLookUpTolerance, candidate.duration + (candidate.deltaPTS ? candidate.deltaPTS : 0));
  if (candidate.start + candidate.duration - candidateLookupTolerance <= bufferEnd) {
    return 1;
  } else if (candidate.start - candidateLookupTolerance > bufferEnd && candidate.start) {
    // if maxFragLookUpTolerance will have negative value then don't return -1 for first element
    return -1;
  }

  return 0;
}
// CONCATENATED MODULE: ./src/controller/stream-controller.js
var stream_controller__createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function stream_controller__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function stream_controller__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function stream_controller__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * Stream Controller
*/
















var State = {
  STOPPED: 'STOPPED',
  IDLE: 'IDLE',
  KEY_LOADING: 'KEY_LOADING',
  FRAG_LOADING: 'FRAG_LOADING',
  FRAG_LOADING_WAITING_RETRY: 'FRAG_LOADING_WAITING_RETRY',
  WAITING_LEVEL: 'WAITING_LEVEL',
  PARSING: 'PARSING',
  PARSED: 'PARSED',
  BUFFER_FLUSHING: 'BUFFER_FLUSHING',
  ENDED: 'ENDED',
  ERROR: 'ERROR'
};

var stream_controller_StreamController = function (_TaskLoop) {
  stream_controller__inherits(StreamController, _TaskLoop);

  function StreamController(hls, fragmentTracker) {
    stream_controller__classCallCheck(this, StreamController);

    var _this = stream_controller__possibleConstructorReturn(this, _TaskLoop.call(this, hls, events["a" /* default */].MEDIA_ATTACHED, events["a" /* default */].MEDIA_DETACHING, events["a" /* default */].MANIFEST_LOADING, events["a" /* default */].MANIFEST_PARSED, events["a" /* default */].LEVEL_LOADED, events["a" /* default */].KEY_LOADED, events["a" /* default */].FRAG_LOADED, events["a" /* default */].FRAG_LOAD_EMERGENCY_ABORTED, events["a" /* default */].FRAG_PARSING_INIT_SEGMENT, events["a" /* default */].FRAG_PARSING_DATA, events["a" /* default */].FRAG_PARSED, events["a" /* default */].ERROR, events["a" /* default */].AUDIO_TRACK_SWITCHING, events["a" /* default */].AUDIO_TRACK_SWITCHED, events["a" /* default */].BUFFER_CREATED, events["a" /* default */].BUFFER_APPENDED, events["a" /* default */].BUFFER_FLUSHED));

    _this.fragmentTracker = fragmentTracker;
    _this.config = hls.config;
    _this.audioCodecSwap = false;
    _this._state = State.STOPPED;
    _this.stallReported = false;
    return _this;
  }

  StreamController.prototype.onHandlerDestroying = function onHandlerDestroying() {
    this.stopLoad();
    _TaskLoop.prototype.onHandlerDestroying.call(this);
  };

  StreamController.prototype.onHandlerDestroyed = function onHandlerDestroyed() {
    this.state = State.STOPPED;
    this.fragmentTracker = null;
    _TaskLoop.prototype.onHandlerDestroyed.call(this);
  };

  StreamController.prototype.startLoad = function startLoad(startPosition) {
    if (this.levels) {
      var lastCurrentTime = this.lastCurrentTime,
          hls = this.hls;
      this.stopLoad();
      this.setInterval(100);
      this.level = -1;
      this.fragLoadError = 0;
      if (!this.startFragRequested) {
        // determine load level
        var startLevel = hls.startLevel;
        if (startLevel === -1) {
          // -1 : guess start Level by doing a bitrate test by loading first fragment of lowest quality level
          startLevel = 0;
          this.bitrateTest = true;
        }
        // set new level to playlist loader : this will trigger start level load
        // hls.nextLoadLevel remains until it is set to a new value or until a new frag is successfully loaded
        this.level = hls.nextLoadLevel = startLevel;
        this.loadedmetadata = false;
      }
      // if startPosition undefined but lastCurrentTime set, set startPosition to last currentTime
      if (lastCurrentTime > 0 && startPosition === -1) {
        logger["b" /* logger */].log('override startPosition with lastCurrentTime @' + lastCurrentTime.toFixed(3));
        startPosition = lastCurrentTime;
      }
      this.state = State.IDLE;
      this.nextLoadPosition = this.startPosition = this.lastCurrentTime = startPosition;
      this.tick();
    } else {
      this.forceStartLoad = true;
      this.state = State.STOPPED;
    }
  };

  StreamController.prototype.stopLoad = function stopLoad() {
    var frag = this.fragCurrent;
    if (frag) {
      if (frag.loader) {
        frag.loader.abort();
      }

      this.fragmentTracker.removeFragment(frag);
      this.fragCurrent = null;
    }
    this.fragPrevious = null;
    if (this.demuxer) {
      this.demuxer.destroy();
      this.demuxer = null;
    }
    this.clearInterval();
    this.state = State.STOPPED;
    this.forceStartLoad = false;
  };

  StreamController.prototype.doTick = function doTick() {
    switch (this.state) {
      case State.BUFFER_FLUSHING:
        // in buffer flushing state, reset fragLoadError counter
        this.fragLoadError = 0;
        break;
      case State.IDLE:
        this._doTickIdle();
        break;
      case State.WAITING_LEVEL:
        var level = this.levels[this.level];
        // check if playlist is already loaded
        if (level && level.details) {
          this.state = State.IDLE;
        }

        break;
      case State.FRAG_LOADING_WAITING_RETRY:
        var now = window.performance.now();
        var retryDate = this.retryDate;
        // if current time is gt than retryDate, or if media seeking let's switch to IDLE state to retry loading
        if (!retryDate || now >= retryDate || this.media && this.media.seeking) {
          logger["b" /* logger */].log('mediaController: retryDate reached, switch back to IDLE state');
          this.state = State.IDLE;
        }
        break;
      case State.ERROR:
      case State.STOPPED:
      case State.FRAG_LOADING:
      case State.PARSING:
      case State.PARSED:
      case State.ENDED:
        break;
      default:
        break;
    }
    // check buffer
    this._checkBuffer();
    // check/update current fragment
    this._checkFragmentChanged();
  };

  // Ironically the "idle" state is the on we do the most logic in it seems ....
  // NOTE: Maybe we could rather schedule a check for buffer length after half of the currently
  //       played segment, or on pause/play/seek instead of naively checking every 100ms?


  StreamController.prototype._doTickIdle = function _doTickIdle() {
    var hls = this.hls,
        config = hls.config,
        media = this.media;

    // if start level not parsed yet OR
    // if video not attached AND start fragment already requested OR start frag prefetch disable
    // exit loop, as we either need more info (level not parsed) or we need media to be attached to load new fragment
    if (this.levelLastLoaded === undefined || !media && (this.startFragRequested || !config.startFragPrefetch)) {
      return;
    }

    // if we have not yet loaded any fragment, start loading from start position
    var pos = void 0;
    if (this.loadedmetadata) {
      pos = media.currentTime;
    } else {
      pos = this.nextLoadPosition;
    }

    // determine next load level
    var level = hls.nextLoadLevel,
        levelInfo = this.levels[level];

    if (!levelInfo) {
      return;
    }

    var levelBitrate = levelInfo.bitrate,
        maxBufLen = void 0;

    // compute max Buffer Length that we could get from this load level, based on level bitrate. don't buffer more than 60 MB and more than 30s
    if (levelBitrate) {
      maxBufLen = Math.max(8 * config.maxBufferSize / levelBitrate, config.maxBufferLength);
    } else {
      maxBufLen = config.maxBufferLength;
    }

    maxBufLen = Math.min(maxBufLen, config.maxMaxBufferLength);

    // determine next candidate fragment to be loaded, based on current position and end of buffer position
    // ensure up to `config.maxMaxBufferLength` of buffer upfront

    var bufferInfo = BufferHelper.bufferInfo(this.mediaBuffer ? this.mediaBuffer : media, pos, config.maxBufferHole),
        bufferLen = bufferInfo.len;
    // Stay idle if we are still with buffer margins
    if (bufferLen >= maxBufLen) {
      return;
    }

    // if buffer length is less than maxBufLen try to load a new fragment ...
    logger["b" /* logger */].trace('buffer length of ' + bufferLen.toFixed(3) + ' is below max of ' + maxBufLen.toFixed(3) + '. checking for more payload ...');

    // set next load level : this will trigger a playlist load if needed
    this.level = hls.nextLoadLevel = level;

    var levelDetails = levelInfo.details;
    // if level info not retrieved yet, switch state and wait for level retrieval
    // if live playlist, ensure that new playlist has been refreshed to avoid loading/try to load
    // a useless and outdated fragment (that might even introduce load error if it is already out of the live playlist)
    if (!levelDetails || levelDetails.live && this.levelLastLoaded !== level) {
      this.state = State.WAITING_LEVEL;
      return;
    }

    // we just got done loading the final fragment and there is no other buffered range after ...
    // rationale is that in case there are any buffered ranges after, it means that there are unbuffered portion in between
    // so we should not switch to ENDED in that case, to be able to buffer them
    // dont switch to ENDED if we need to backtrack last fragment
    var fragPrevious = this.fragPrevious;
    if (!levelDetails.live && fragPrevious && !fragPrevious.backtracked && fragPrevious.sn === levelDetails.endSN && !bufferInfo.nextStart) {
      // fragPrevious is last fragment. retrieve level duration using last frag start offset + duration
      // real duration might be lower than initial duration if there are drifts between real frag duration and playlist signaling
      var duration = Math.min(media.duration, fragPrevious.start + fragPrevious.duration);
      // if everything (almost) til the end is buffered, let's signal eos
      // we don't compare exactly media.duration === bufferInfo.end as there could be some subtle media duration difference (audio/video offsets...)
      // tolerate up to one frag duration to cope with these cases.
      // also cope with almost zero last frag duration (max last frag duration with 200ms) refer to https://github.com/video-dev/hls.js/pull/657
      if (duration - Math.max(bufferInfo.end, fragPrevious.start) <= Math.max(0.2, fragPrevious.duration)) {
        // Finalize the media stream
        var data = {};
        if (this.altAudio) {
          data.type = 'video';
        }

        this.hls.trigger(events["a" /* default */].BUFFER_EOS, data);
        this.state = State.ENDED;
        return;
      }
    }

    // if we have the levelDetails for the selected variant, lets continue enrichen our stream (load keys/fragments or trigger EOS, etc..)
    this._fetchPayloadOrEos(pos, bufferInfo, levelDetails);
  };

  StreamController.prototype._fetchPayloadOrEos = function _fetchPayloadOrEos(pos, bufferInfo, levelDetails) {
    var fragPrevious = this.fragPrevious,
        level = this.level,
        fragments = levelDetails.fragments,
        fragLen = fragments.length;

    // empty playlist
    if (fragLen === 0) {
      return;
    }

    // find fragment index, contiguous with end of buffer position
    var start = fragments[0].start,
        end = fragments[fragLen - 1].start + fragments[fragLen - 1].duration,
        bufferEnd = bufferInfo.end,
        frag = void 0;

    if (levelDetails.initSegment && !levelDetails.initSegment.data) {
      frag = levelDetails.initSegment;
    } else {
      // in case of live playlist we need to ensure that requested position is not located before playlist start
      if (levelDetails.live) {
        var initialLiveManifestSize = this.config.initialLiveManifestSize;
        if (fragLen < initialLiveManifestSize) {
          logger["b" /* logger */].warn('Can not start playback of a level, reason: not enough fragments ' + fragLen + ' < ' + initialLiveManifestSize);
          return;
        }

        frag = this._ensureFragmentAtLivePoint(levelDetails, bufferEnd, start, end, fragPrevious, fragments, fragLen);
        // if it explicitely returns null don't load any fragment and exit function now
        if (frag === null) {
          return;
        }
      } else {
        // VoD playlist: if bufferEnd before start of playlist, load first fragment
        if (bufferEnd < start) {
          frag = fragments[0];
        }
      }
    }
    if (!frag) {
      frag = this._findFragment(start, fragPrevious, fragLen, fragments, bufferEnd, end, levelDetails);
    }

    if (frag) {
      if (frag.encrypted) {
        logger["b" /* logger */].log('Loading key for ' + frag.sn + ' of [' + levelDetails.startSN + ' ,' + levelDetails.endSN + '],level ' + level);
        this._loadKey(frag);
      } else {
        logger["b" /* logger */].log('Loading ' + frag.sn + ' of [' + levelDetails.startSN + ' ,' + levelDetails.endSN + '],level ' + level + ', currentTime:' + pos.toFixed(3) + ',bufferEnd:' + bufferEnd.toFixed(3));
        this._loadFragment(frag);
      }
    }
  };

  StreamController.prototype._ensureFragmentAtLivePoint = function _ensureFragmentAtLivePoint(levelDetails, bufferEnd, start, end, fragPrevious, fragments, fragLen) {
    var config = this.hls.config,
        media = this.media;

    var frag = void 0;

    // check if requested position is within seekable boundaries :
    // logger.log(`start/pos/bufEnd/seeking:${start.toFixed(3)}/${pos.toFixed(3)}/${bufferEnd.toFixed(3)}/${this.media.seeking}`);
    var maxLatency = config.liveMaxLatencyDuration !== undefined ? config.liveMaxLatencyDuration : config.liveMaxLatencyDurationCount * levelDetails.targetduration;

    if (bufferEnd < Math.max(start - config.maxFragLookUpTolerance, end - maxLatency)) {
      var liveSyncPosition = this.liveSyncPosition = this.computeLivePosition(start, levelDetails);
      logger["b" /* logger */].log('buffer end: ' + bufferEnd.toFixed(3) + ' is located too far from the end of live sliding playlist, reset currentTime to : ' + liveSyncPosition.toFixed(3));
      bufferEnd = liveSyncPosition;
      if (media && media.readyState && media.duration > liveSyncPosition) {
        media.currentTime = liveSyncPosition;
      }

      this.nextLoadPosition = liveSyncPosition;
    }

    // if end of buffer greater than live edge, don't load any fragment
    // this could happen if live playlist intermittently slides in the past.
    // level 1 loaded [182580161,182580167]
    // level 1 loaded [182580162,182580169]
    // Loading 182580168 of [182580162 ,182580169],level 1 ..
    // Loading 182580169 of [182580162 ,182580169],level 1 ..
    // level 1 loaded [182580162,182580168] <============= here we should have bufferEnd > end. in that case break to avoid reloading 182580168
    // level 1 loaded [182580164,182580171]
    //
    // don't return null in case media not loaded yet (readystate === 0)
    if (levelDetails.PTSKnown && bufferEnd > end && media && media.readyState) {
      return null;
    }

    if (this.startFragRequested && !levelDetails.PTSKnown) {
      /* we are switching level on live playlist, but we don't have any PTS info for that quality level ...
         try to load frag matching with next SN.
         even if SN are not synchronized between playlists, loading this frag will help us
         compute playlist sliding and find the right one after in case it was not the right consecutive one */
      if (fragPrevious) {
        if (!levelDetails.programDateTime) {
          // Uses buffer and sequence number to calculate switch segment (required if using EXT-X-DISCONTINUITY-SEQUENCE)
          var targetSN = fragPrevious.sn + 1;
          if (targetSN >= levelDetails.startSN && targetSN <= levelDetails.endSN) {
            var fragNext = fragments[targetSN - levelDetails.startSN];
            if (fragPrevious.cc === fragNext.cc) {
              frag = fragNext;
              logger["b" /* logger */].log('live playlist, switching playlist, load frag with next SN: ' + frag.sn);
            }
          }
          // next frag SN not available (or not with same continuity counter)
          // look for a frag sharing the same CC
          if (!frag) {
            frag = binary_search.search(fragments, function (frag) {
              return fragPrevious.cc - frag.cc;
            });
            if (frag) {
              logger["b" /* logger */].log('live playlist, switching playlist, load frag with same CC: ' + frag.sn);
            }
          }
        } else {
          // Relies on PDT in order to switch bitrates (Support EXT-X-DISCONTINUITY without EXT-X-DISCONTINUITY-SEQUENCE)
          frag = findFragmentByPDT(fragments, fragPrevious.endPdt + 1);
        }
      }
      if (!frag) {
        /* we have no idea about which fragment should be loaded.
           so let's load mid fragment. it will help computing playlist sliding and find the right one
        */
        frag = fragments[Math.min(fragLen - 1, Math.round(fragLen / 2))];
        logger["b" /* logger */].log('live playlist, switching playlist, unknown, load middle frag : ' + frag.sn);
      }
    }
    return frag;
  };

  StreamController.prototype._findFragment = function _findFragment(start, fragPrevious, fragLen, fragments, bufferEnd, end, levelDetails) {
    var config = this.hls.config;
    var fragBySN = function fragBySN() {
      return findFragmentBySN(fragPrevious, fragments, bufferEnd, end, config.maxFragLookUpTolerance);
    };
    var frag = void 0;
    var foundFrag = void 0;

    if (bufferEnd < end) {
      if (!levelDetails.programDateTime) {
        // Uses buffer and sequence number to calculate switch segment (required if using EXT-X-DISCONTINUITY-SEQUENCE)
        foundFrag = findFragmentBySN(fragPrevious, fragments, bufferEnd, end, config.maxFragLookUpTolerance);
      } else {
        // Relies on PDT in order to switch bitrates (Support EXT-X-DISCONTINUITY without EXT-X-DISCONTINUITY-SEQUENCE)
        foundFrag = findFragmentByPDT(fragments, calculateNextPDT(start, bufferEnd, levelDetails));
        if (!foundFrag || fragment_finders_fragmentWithinToleranceTest(bufferEnd, config.maxFragLookUpTolerance, foundFrag)) {
          // Fall back to SN order if finding by PDT returns a frag which won't fit within the stream
          // fragmentWithToleranceTest returns 0 if the frag is within tolerance; 1 or -1 otherwise
          logger["b" /* logger */].warn('Frag found by PDT search did not fit within tolerance; falling back to finding by SN');
          foundFrag = fragBySN();
        }
      }
    } else {
      // reach end of playlist
      foundFrag = fragments[fragLen - 1];
    }
    if (foundFrag) {
      frag = foundFrag;
      var curSNIdx = frag.sn - levelDetails.startSN;
      var sameLevel = fragPrevious && frag.level === fragPrevious.level;
      var prevFrag = fragments[curSNIdx - 1];
      var nextFrag = fragments[curSNIdx + 1];
      // logger.log('find SN matching with pos:' +  bufferEnd + ':' + frag.sn);
      if (fragPrevious && frag.sn === fragPrevious.sn) {
        if (sameLevel && !frag.backtracked) {
          if (frag.sn < levelDetails.endSN) {
            var deltaPTS = fragPrevious.deltaPTS;
            // if there is a significant delta between audio and video, larger than max allowed hole,
            // and if previous remuxed fragment did not start with a keyframe. (fragPrevious.dropped)
            // let's try to load previous fragment again to get last keyframe
            // then we will reload again current fragment (that way we should be able to fill the buffer hole ...)
            if (deltaPTS && deltaPTS > config.maxBufferHole && fragPrevious.dropped && curSNIdx) {
              frag = prevFrag;
              logger["b" /* logger */].warn('SN just loaded, with large PTS gap between audio and video, maybe frag is not starting with a keyframe ? load previous one to try to overcome this');
            } else {
              frag = nextFrag;
              logger["b" /* logger */].log('SN just loaded, load next one: ' + frag.sn);
            }
          } else {
            frag = null;
          }
        } else if (frag.backtracked) {
          // Only backtrack a max of 1 consecutive fragment to prevent sliding back too far when little or no frags start with keyframes
          if (nextFrag && nextFrag.backtracked) {
            logger["b" /* logger */].warn('Already backtracked from fragment ' + nextFrag.sn + ', will not backtrack to fragment ' + frag.sn + '. Loading fragment ' + nextFrag.sn);
            frag = nextFrag;
          } else {
            // If a fragment has dropped frames and it's in a same level/sequence, load the previous fragment to try and find the keyframe
            // Reset the dropped count now since it won't be reset until we parse the fragment again, which prevents infinite backtracking on the same segment
            logger["b" /* logger */].warn('Loaded fragment with dropped frames, backtracking 1 segment to find a keyframe');
            frag.dropped = 0;
            if (prevFrag) {
              frag = prevFrag;
              frag.backtracked = true;
            } else if (curSNIdx) {
              // can't backtrack on very first fragment
              frag = null;
            }
          }
        }
      }
    }
    return frag;
  };

  StreamController.prototype._loadKey = function _loadKey(frag) {
    this.state = State.KEY_LOADING;
    this.hls.trigger(events["a" /* default */].KEY_LOADING, { frag: frag });
  };

  StreamController.prototype._loadFragment = function _loadFragment(frag) {
    // Check if fragment is not loaded
    var fragState = this.fragmentTracker.getState(frag);

    this.fragCurrent = frag;
    this.startFragRequested = true;
    // Don't update nextLoadPosition for fragments which are not buffered
    if (!isNaN(frag.sn) && !frag.bitrateTest) {
      this.nextLoadPosition = frag.start + frag.duration;
    }

    // Allow backtracked fragments to load
    if (frag.backtracked || fragState === FragmentState.NOT_LOADED || fragState === FragmentState.PARTIAL) {
      frag.autoLevel = this.hls.autoLevelEnabled;
      frag.bitrateTest = this.bitrateTest;

      this.hls.trigger(events["a" /* default */].FRAG_LOADING, { frag: frag });
      // lazy demuxer init, as this could take some time ... do it during frag loading
      if (!this.demuxer) {
        this.demuxer = new demux_demuxer(this.hls, 'main');
      }

      this.state = State.FRAG_LOADING;
    } else if (fragState === FragmentState.APPENDING) {
      // Lower the buffer size and try again
      if (this._reduceMaxBufferLength(frag.duration)) {
        this.fragmentTracker.removeFragment(frag);
      }
    }
  };

  StreamController.prototype.getBufferedFrag = function getBufferedFrag(position) {
    return this.fragmentTracker.getBufferedFrag(position, playlist_loader.LevelType.MAIN);
  };

  StreamController.prototype.followingBufferedFrag = function followingBufferedFrag(frag) {
    if (frag) {
      // try to get range of next fragment (500ms after this range)
      return this.getBufferedFrag(frag.endPTS + 0.5);
    }
    return null;
  };

  StreamController.prototype._checkFragmentChanged = function _checkFragmentChanged() {
    var fragPlayingCurrent = void 0,
        currentTime = void 0,
        video = this.media;
    if (video && video.readyState && video.seeking === false) {
      currentTime = video.currentTime;
      /* if video element is in seeked state, currentTime can only increase.
        (assuming that playback rate is positive ...)
        As sometimes currentTime jumps back to zero after a
        media decode error, check this, to avoid seeking back to
        wrong position after a media decode error
      */
      if (currentTime > this.lastCurrentTime) {
        this.lastCurrentTime = currentTime;
      }

      if (BufferHelper.isBuffered(video, currentTime)) {
        fragPlayingCurrent = this.getBufferedFrag(currentTime);
      } else if (BufferHelper.isBuffered(video, currentTime + 0.1)) {
        /* ensure that FRAG_CHANGED event is triggered at startup,
          when first video frame is displayed and playback is paused.
          add a tolerance of 100ms, in case current position is not buffered,
          check if current pos+100ms is buffered and use that buffer range
          for FRAG_CHANGED event reporting */
        fragPlayingCurrent = this.getBufferedFrag(currentTime + 0.1);
      }
      if (fragPlayingCurrent) {
        var fragPlaying = fragPlayingCurrent;
        if (fragPlaying !== this.fragPlaying) {
          this.hls.trigger(events["a" /* default */].FRAG_CHANGED, { frag: fragPlaying });
          var fragPlayingLevel = fragPlaying.level;
          if (!this.fragPlaying || this.fragPlaying.level !== fragPlayingLevel) {
            this.hls.trigger(events["a" /* default */].LEVEL_SWITCHED, { level: fragPlayingLevel });
          }

          this.fragPlaying = fragPlaying;
        }
      }
    }
  };

  /*
    on immediate level switch :
     - pause playback if playing
     - cancel any pending load request
     - and trigger a buffer flush
  */


  StreamController.prototype.immediateLevelSwitch = function immediateLevelSwitch() {
    logger["b" /* logger */].log('immediateLevelSwitch');
    if (!this.immediateSwitch) {
      this.immediateSwitch = true;
      var media = this.media,
          previouslyPaused = void 0;
      if (media) {
        previouslyPaused = media.paused;
        media.pause();
      } else {
        // don't restart playback after instant level switch in case media not attached
        previouslyPaused = true;
      }
      this.previouslyPaused = previouslyPaused;
    }
    var fragCurrent = this.fragCurrent;
    if (fragCurrent && fragCurrent.loader) {
      fragCurrent.loader.abort();
    }

    this.fragCurrent = null;
    // flush everything
    this.flushMainBuffer(0, Number.POSITIVE_INFINITY);
  };

  /**
   * on immediate level switch end, after new fragment has been buffered:
   * - nudge video decoder by slightly adjusting video currentTime (if currentTime buffered)
   * - resume the playback if needed
   */


  StreamController.prototype.immediateLevelSwitchEnd = function immediateLevelSwitchEnd() {
    var media = this.media;
    if (media && media.buffered.length) {
      this.immediateSwitch = false;
      if (BufferHelper.isBuffered(media, media.currentTime)) {
        // only nudge if currentTime is buffered
        media.currentTime -= 0.0001;
      }
      if (!this.previouslyPaused) {
        media.play();
      }
    }
  };

  /**
   * try to switch ASAP without breaking video playback:
   * in order to ensure smooth but quick level switching,
   * we need to find the next flushable buffer range
   * we should take into account new segment fetch time
   */


  StreamController.prototype.nextLevelSwitch = function nextLevelSwitch() {
    var media = this.media;
    // ensure that media is defined and that metadata are available (to retrieve currentTime)
    if (media && media.readyState) {
      var fetchdelay = void 0,
          fragPlayingCurrent = void 0,
          nextBufferedFrag = void 0;
      fragPlayingCurrent = this.getBufferedFrag(media.currentTime);
      if (fragPlayingCurrent && fragPlayingCurrent.startPTS > 1) {
        // flush buffer preceding current fragment (flush until current fragment start offset)
        // minus 1s to avoid video freezing, that could happen if we flush keyframe of current video ...
        this.flushMainBuffer(0, fragPlayingCurrent.startPTS - 1);
      }
      if (!media.paused) {
        // add a safety delay of 1s
        var nextLevelId = this.hls.nextLoadLevel,
            nextLevel = this.levels[nextLevelId],
            fragLastKbps = this.fragLastKbps;
        if (fragLastKbps && this.fragCurrent) {
          fetchdelay = this.fragCurrent.duration * nextLevel.bitrate / (1000 * fragLastKbps) + 1;
        } else {
          fetchdelay = 0;
        }
      } else {
        fetchdelay = 0;
      }
      // logger.log('fetchdelay:'+fetchdelay);
      // find buffer range that will be reached once new fragment will be fetched
      nextBufferedFrag = this.getBufferedFrag(media.currentTime + fetchdelay);
      if (nextBufferedFrag) {
        // we can flush buffer range following this one without stalling playback
        nextBufferedFrag = this.followingBufferedFrag(nextBufferedFrag);
        if (nextBufferedFrag) {
          // if we are here, we can also cancel any loading/demuxing in progress, as they are useless
          var fragCurrent = this.fragCurrent;
          if (fragCurrent && fragCurrent.loader) {
            fragCurrent.loader.abort();
          }

          this.fragCurrent = null;
          // start flush position is the start PTS of next buffered frag.
          // we use frag.naxStartPTS which is max(audio startPTS, video startPTS).
          // in case there is a small PTS Delta between audio and video, using maxStartPTS avoids flushing last samples from current fragment
          this.flushMainBuffer(nextBufferedFrag.maxStartPTS, Number.POSITIVE_INFINITY);
        }
      }
    }
  };

  StreamController.prototype.flushMainBuffer = function flushMainBuffer(startOffset, endOffset) {
    this.state = State.BUFFER_FLUSHING;
    var flushScope = { startOffset: startOffset, endOffset: endOffset };
    // if alternate audio tracks are used, only flush video, otherwise flush everything
    if (this.altAudio) {
      flushScope.type = 'video';
    }

    this.hls.trigger(events["a" /* default */].BUFFER_FLUSHING, flushScope);
  };

  StreamController.prototype.onMediaAttached = function onMediaAttached(data) {
    var media = this.media = this.mediaBuffer = data.media;
    this.onvseeking = this.onMediaSeeking.bind(this);
    this.onvseeked = this.onMediaSeeked.bind(this);
    this.onvended = this.onMediaEnded.bind(this);
    media.addEventListener('seeking', this.onvseeking);
    media.addEventListener('seeked', this.onvseeked);
    media.addEventListener('ended', this.onvended);
    var config = this.config;
    if (this.levels && config.autoStartLoad) {
      this.hls.startLoad(config.startPosition);
    }
  };

  StreamController.prototype.onMediaDetaching = function onMediaDetaching() {
    var media = this.media;
    if (media && media.ended) {
      logger["b" /* logger */].log('MSE detaching and video ended, reset startPosition');
      this.startPosition = this.lastCurrentTime = 0;
    }

    // reset fragment backtracked flag
    var levels = this.levels;
    if (levels) {
      levels.forEach(function (level) {
        if (level.details) {
          level.details.fragments.forEach(function (fragment) {
            fragment.backtracked = undefined;
          });
        }
      });
    }
    // remove video listeners
    if (media) {
      media.removeEventListener('seeking', this.onvseeking);
      media.removeEventListener('seeked', this.onvseeked);
      media.removeEventListener('ended', this.onvended);
      this.onvseeking = this.onvseeked = this.onvended = null;
    }
    this.media = this.mediaBuffer = null;
    this.loadedmetadata = false;
    this.stopLoad();
  };

  StreamController.prototype.onMediaSeeking = function onMediaSeeking() {
    var media = this.media,
        currentTime = media ? media.currentTime : undefined,
        config = this.config;
    if (!isNaN(currentTime)) {
      logger["b" /* logger */].log('media seeking to ' + currentTime.toFixed(3));
    }

    var mediaBuffer = this.mediaBuffer ? this.mediaBuffer : media;
    var bufferInfo = BufferHelper.bufferInfo(mediaBuffer, currentTime, this.config.maxBufferHole);
    if (this.state === State.FRAG_LOADING) {
      var fragCurrent = this.fragCurrent;
      // check if we are seeking to a unbuffered area AND if frag loading is in progress
      if (bufferInfo.len === 0 && fragCurrent) {
        var tolerance = config.maxFragLookUpTolerance,
            fragStartOffset = fragCurrent.start - tolerance,
            fragEndOffset = fragCurrent.start + fragCurrent.duration + tolerance;
        // check if we seek position will be out of currently loaded frag range : if out cancel frag load, if in, don't do anything
        if (currentTime < fragStartOffset || currentTime > fragEndOffset) {
          if (fragCurrent.loader) {
            logger["b" /* logger */].log('seeking outside of buffer while fragment load in progress, cancel fragment load');
            fragCurrent.loader.abort();
          }
          this.fragCurrent = null;
          this.fragPrevious = null;
          // switch to IDLE state to load new fragment
          this.state = State.IDLE;
        } else {
          logger["b" /* logger */].log('seeking outside of buffer but within currently loaded fragment range');
        }
      }
    } else if (this.state === State.ENDED) {
      // if seeking to unbuffered area, clean up fragPrevious
      if (bufferInfo.len === 0) {
        this.fragPrevious = 0;
      }

      // switch to IDLE state to check for potential new fragment
      this.state = State.IDLE;
    }
    if (media) {
      this.lastCurrentTime = currentTime;
    }

    // in case seeking occurs although no media buffered, adjust startPosition and nextLoadPosition to seek target
    if (!this.loadedmetadata) {
      this.nextLoadPosition = this.startPosition = currentTime;
    }

    // tick to speed up processing
    this.tick();
  };

  StreamController.prototype.onMediaSeeked = function onMediaSeeked() {
    var media = this.media,
        currentTime = media ? media.currentTime : undefined;
    if (!isNaN(currentTime)) {
      logger["b" /* logger */].log('media seeked to ' + currentTime.toFixed(3));
    }

    // tick to speed up FRAGMENT_PLAYING triggering
    this.tick();
  };

  StreamController.prototype.onMediaEnded = function onMediaEnded() {
    logger["b" /* logger */].log('media ended');
    // reset startPosition and lastCurrentTime to restart playback @ stream beginning
    this.startPosition = this.lastCurrentTime = 0;
  };

  StreamController.prototype.onManifestLoading = function onManifestLoading() {
    // reset buffer on manifest loading
    logger["b" /* logger */].log('trigger BUFFER_RESET');
    this.hls.trigger(events["a" /* default */].BUFFER_RESET);
    this.fragmentTracker.removeAllFragments();
    this.stalled = false;
    this.startPosition = this.lastCurrentTime = 0;
  };

  StreamController.prototype.onManifestParsed = function onManifestParsed(data) {
    var aac = false,
        heaac = false,
        codec = void 0;
    data.levels.forEach(function (level) {
      // detect if we have different kind of audio codecs used amongst playlists
      codec = level.audioCodec;
      if (codec) {
        if (codec.indexOf('mp4a.40.2') !== -1) {
          aac = true;
        }

        if (codec.indexOf('mp4a.40.5') !== -1) {
          heaac = true;
        }
      }
    });
    this.audioCodecSwitch = aac && heaac;
    if (this.audioCodecSwitch) {
      logger["b" /* logger */].log('both AAC/HE-AAC audio found in levels; declaring level codec as HE-AAC');
    }

    this.levels = data.levels;
    this.startFragRequested = false;
    var config = this.config;
    if (config.autoStartLoad || this.forceStartLoad) {
      this.hls.startLoad(config.startPosition);
    }
  };

  StreamController.prototype.onLevelLoaded = function onLevelLoaded(data) {
    var newDetails = data.details;
    var newLevelId = data.level;
    var lastLevel = this.levels[this.levelLastLoaded];
    var curLevel = this.levels[newLevelId];
    var duration = newDetails.totalduration;
    var sliding = 0;

    logger["b" /* logger */].log('level ' + newLevelId + ' loaded [' + newDetails.startSN + ',' + newDetails.endSN + '],duration:' + duration);

    if (newDetails.live) {
      var curDetails = curLevel.details;
      if (curDetails && newDetails.fragments.length > 0) {
        // we already have details for that level, merge them
        mergeDetails(curDetails, newDetails);
        sliding = newDetails.fragments[0].start;
        this.liveSyncPosition = this.computeLivePosition(sliding, curDetails);
        if (newDetails.PTSKnown && !isNaN(sliding)) {
          logger["b" /* logger */].log('live playlist sliding:' + sliding.toFixed(3));
        } else {
          logger["b" /* logger */].log('live playlist - outdated PTS, unknown sliding');
          alignDiscontinuities(this.fragPrevious, lastLevel, newDetails);
        }
      } else {
        logger["b" /* logger */].log('live playlist - first load, unknown sliding');
        newDetails.PTSKnown = false;
        alignDiscontinuities(this.fragPrevious, lastLevel, newDetails);
      }
    } else {
      newDetails.PTSKnown = false;
    }
    // override level info
    curLevel.details = newDetails;
    this.levelLastLoaded = newLevelId;
    this.hls.trigger(events["a" /* default */].LEVEL_UPDATED, { details: newDetails, level: newLevelId });

    if (this.startFragRequested === false) {
      // compute start position if set to -1. use it straight away if value is defined
      if (this.startPosition === -1 || this.lastCurrentTime === -1) {
        // first, check if start time offset has been set in playlist, if yes, use this value
        var startTimeOffset = newDetails.startTimeOffset;
        if (!isNaN(startTimeOffset)) {
          if (startTimeOffset < 0) {
            logger["b" /* logger */].log('negative start time offset ' + startTimeOffset + ', count from end of last fragment');
            startTimeOffset = sliding + duration + startTimeOffset;
          }
          logger["b" /* logger */].log('start time offset found in playlist, adjust startPosition to ' + startTimeOffset);
          this.startPosition = startTimeOffset;
        } else {
          // if live playlist, set start position to be fragment N-this.config.liveSyncDurationCount (usually 3)
          if (newDetails.live) {
            this.startPosition = this.computeLivePosition(sliding, newDetails);
            logger["b" /* logger */].log('configure startPosition to ' + this.startPosition);
          } else {
            this.startPosition = 0;
          }
        }
        this.lastCurrentTime = this.startPosition;
      }
      this.nextLoadPosition = this.startPosition;
    }
    // only switch batck to IDLE state if we were waiting for level to start downloading a new fragment
    if (this.state === State.WAITING_LEVEL) {
      this.state = State.IDLE;
    }

    // trigger handler right now
    this.tick();
  };

  StreamController.prototype.onKeyLoaded = function onKeyLoaded() {
    if (this.state === State.KEY_LOADING) {
      this.state = State.IDLE;
      this.tick();
    }
  };

  StreamController.prototype.onFragLoaded = function onFragLoaded(data) {
    var fragCurrent = this.fragCurrent,
        fragLoaded = data.frag;
    if (this.state === State.FRAG_LOADING && fragCurrent && fragLoaded.type === 'main' && fragLoaded.level === fragCurrent.level && fragLoaded.sn === fragCurrent.sn) {
      var stats = data.stats;
      var currentLevel = this.levels[fragCurrent.level];
      var details = currentLevel.details;
      logger["b" /* logger */].log('Loaded  ' + fragCurrent.sn + ' of [' + details.startSN + ' ,' + details.endSN + '],level ' + fragCurrent.level);
      // reset frag bitrate test in any case after frag loaded event
      this.bitrateTest = false;
      this.stats = stats;
      // if this frag was loaded to perform a bitrate test AND if hls.nextLoadLevel is greater than 0
      // then this means that we should be able to load a fragment at a higher quality level
      if (fragLoaded.bitrateTest === true && this.hls.nextLoadLevel) {
        // switch back to IDLE state ... we just loaded a fragment to determine adequate start bitrate and initialize autoswitch algo
        this.state = State.IDLE;
        this.startFragRequested = false;
        stats.tparsed = stats.tbuffered = window.performance.now();
        this.hls.trigger(events["a" /* default */].FRAG_BUFFERED, { stats: stats, frag: fragCurrent, id: 'main' });
        this.tick();
      } else if (fragLoaded.sn === 'initSegment') {
        this.state = State.IDLE;
        stats.tparsed = stats.tbuffered = window.performance.now();
        details.initSegment.data = data.payload;
        this.hls.trigger(events["a" /* default */].FRAG_BUFFERED, { stats: stats, frag: fragCurrent, id: 'main' });
        this.tick();
      } else {
        this.state = State.PARSING;
        // transmux the MPEG-TS data to ISO-BMFF segments
        var duration = details.totalduration,
            level = fragCurrent.level,
            sn = fragCurrent.sn,
            audioCodec = this.config.defaultAudioCodec || currentLevel.audioCodec;
        if (this.audioCodecSwap) {
          logger["b" /* logger */].log('swapping playlist audio codec');
          if (audioCodec === undefined) {
            audioCodec = this.lastAudioCodec;
          }

          if (audioCodec) {
            if (audioCodec.indexOf('mp4a.40.5') !== -1) {
              audioCodec = 'mp4a.40.2';
            } else {
              audioCodec = 'mp4a.40.5';
            }
          }
        }
        this.pendingBuffering = true;
        this.appended = false;
        logger["b" /* logger */].log('Parsing ' + sn + ' of [' + details.startSN + ' ,' + details.endSN + '],level ' + level + ', cc ' + fragCurrent.cc);
        var demuxer = this.demuxer;
        if (!demuxer) {
          demuxer = this.demuxer = new demux_demuxer(this.hls, 'main');
        }

        // time Offset is accurate if level PTS is known, or if playlist is not sliding (not live) and if media is not seeking (this is to overcome potential timestamp drifts between playlists and fragments)
        var media = this.media;
        var mediaSeeking = media && media.seeking;
        var accurateTimeOffset = !mediaSeeking && (details.PTSKnown || !details.live);
        var initSegmentData = details.initSegment ? details.initSegment.data : [];
        demuxer.push(data.payload, initSegmentData, audioCodec, currentLevel.videoCodec, fragCurrent, duration, accurateTimeOffset, undefined);
      }
    }
    this.fragLoadError = 0;
  };

  StreamController.prototype.onFragParsingInitSegment = function onFragParsingInitSegment(data) {
    var fragCurrent = this.fragCurrent;
    var fragNew = data.frag;

    if (fragCurrent && data.id === 'main' && fragNew.sn === fragCurrent.sn && fragNew.level === fragCurrent.level && this.state === State.PARSING) {
      var tracks = data.tracks,
          trackName = void 0,
          track = void 0;

      // if audio track is expected to come from audio stream controller, discard any coming from main
      if (tracks.audio && this.altAudio) {
        delete tracks.audio;
      }

      // include levelCodec in audio and video tracks
      track = tracks.audio;
      if (track) {
        var audioCodec = this.levels[this.level].audioCodec,
            ua = navigator.userAgent.toLowerCase();
        if (audioCodec && this.audioCodecSwap) {
          logger["b" /* logger */].log('swapping playlist audio codec');
          if (audioCodec.indexOf('mp4a.40.5') !== -1) {
            audioCodec = 'mp4a.40.2';
          } else {
            audioCodec = 'mp4a.40.5';
          }
        }
        // in case AAC and HE-AAC audio codecs are signalled in manifest
        // force HE-AAC , as it seems that most browsers prefers that way,
        // except for mono streams OR on FF
        // these conditions might need to be reviewed ...
        if (this.audioCodecSwitch) {
          // don't force HE-AAC if mono stream
          if (track.metadata.channelCount !== 1 &&
          // don't force HE-AAC if firefox
          ua.indexOf('firefox') === -1) {
            audioCodec = 'mp4a.40.5';
          }
        }
        // HE-AAC is broken on Android, always signal audio codec as AAC even if variant manifest states otherwise
        if (ua.indexOf('android') !== -1 && track.container !== 'audio/mpeg') {
          // Exclude mpeg audio
          audioCodec = 'mp4a.40.2';
          logger["b" /* logger */].log('Android: force audio codec to ' + audioCodec);
        }
        track.levelCodec = audioCodec;
        track.id = data.id;
      }
      track = tracks.video;
      if (track) {
        track.levelCodec = this.levels[this.level].videoCodec;
        track.id = data.id;
      }
      this.hls.trigger(events["a" /* default */].BUFFER_CODECS, tracks);
      // loop through tracks that are going to be provided to bufferController
      for (trackName in tracks) {
        track = tracks[trackName];
        logger["b" /* logger */].log('main track:' + trackName + ',container:' + track.container + ',codecs[level/parsed]=[' + track.levelCodec + '/' + track.codec + ']');
        var initSegment = track.initSegment;
        if (initSegment) {
          this.appended = true;
          // arm pending Buffering flag before appending a segment
          this.pendingBuffering = true;
          this.hls.trigger(events["a" /* default */].BUFFER_APPENDING, { type: trackName, data: initSegment, parent: 'main', content: 'initSegment' });
        }
      }
      // trigger handler right now
      this.tick();
    }
  };

  StreamController.prototype.onFragParsingData = function onFragParsingData(data) {
    var _this2 = this;

    var fragCurrent = this.fragCurrent;
    var fragNew = data.frag;
    if (fragCurrent && data.id === 'main' && fragNew.sn === fragCurrent.sn && fragNew.level === fragCurrent.level && !(data.type === 'audio' && this.altAudio) && // filter out main audio if audio track is loaded through audio stream controller
    this.state === State.PARSING) {
      var level = this.levels[this.level],
          frag = fragCurrent;
      if (isNaN(data.endPTS)) {
        data.endPTS = data.startPTS + fragCurrent.duration;
        data.endDTS = data.startDTS + fragCurrent.duration;
      }

      if (data.hasAudio === true) {
        frag.addElementaryStream(loader_fragment.ElementaryStreamTypes.AUDIO);
      }

      if (data.hasVideo === true) {
        frag.addElementaryStream(loader_fragment.ElementaryStreamTypes.VIDEO);
      }

      logger["b" /* logger */].log('Parsed ' + data.type + ',PTS:[' + data.startPTS.toFixed(3) + ',' + data.endPTS.toFixed(3) + '],DTS:[' + data.startDTS.toFixed(3) + '/' + data.endDTS.toFixed(3) + '],nb:' + data.nb + ',dropped:' + (data.dropped || 0));

      // Detect gaps in a fragment  and try to fix it by finding a keyframe in the previous fragment (see _findFragments)
      if (data.type === 'video') {
        frag.dropped = data.dropped;
        if (frag.dropped) {
          if (!frag.backtracked) {
            var levelDetails = level.details;
            if (levelDetails && frag.sn === levelDetails.startSN) {
              logger["b" /* logger */].warn('missing video frame(s) on first frag, appending with gap', frag.sn);
            } else {
              logger["b" /* logger */].warn('missing video frame(s), backtracking fragment', frag.sn);
              // Return back to the IDLE state without appending to buffer
              // Causes findFragments to backtrack a segment and find the keyframe
              // Audio fragments arriving before video sets the nextLoadPosition, causing _findFragments to skip the backtracked fragment
              this.fragmentTracker.removeFragment(frag);
              frag.backtracked = true;
              this.nextLoadPosition = data.startPTS;
              this.state = State.IDLE;
              this.fragPrevious = frag;
              this.tick();
              return;
            }
          } else {
            logger["b" /* logger */].warn('Already backtracked on this fragment, appending with the gap', frag.sn);
          }
        } else {
          // Only reset the backtracked flag if we've loaded the frag without any dropped frames
          frag.backtracked = false;
        }
      }

      var drift = updateFragPTSDTS(level.details, frag, data.startPTS, data.endPTS, data.startDTS, data.endDTS),
          hls = this.hls;
      hls.trigger(events["a" /* default */].LEVEL_PTS_UPDATED, { details: level.details, level: this.level, drift: drift, type: data.type, start: data.startPTS, end: data.endPTS });
      // has remuxer dropped video frames located before first keyframe ?
      [data.data1, data.data2].forEach(function (buffer) {
        // only append in PARSING state (rationale is that an appending error could happen synchronously on first segment appending)
        // in that case it is useless to append following segments
        if (buffer && buffer.length && _this2.state === State.PARSING) {
          _this2.appended = true;
          // arm pending Buffering flag before appending a segment
          _this2.pendingBuffering = true;
          hls.trigger(events["a" /* default */].BUFFER_APPENDING, { type: data.type, data: buffer, parent: 'main', content: 'data' });
        }
      });
      // trigger handler right now
      this.tick();
    }
  };

  StreamController.prototype.onFragParsed = function onFragParsed(data) {
    var fragCurrent = this.fragCurrent;
    var fragNew = data.frag;
    if (fragCurrent && data.id === 'main' && fragNew.sn === fragCurrent.sn && fragNew.level === fragCurrent.level && this.state === State.PARSING) {
      this.stats.tparsed = window.performance.now();
      this.state = State.PARSED;
      this._checkAppendedParsed();
    }
  };

  StreamController.prototype.onAudioTrackSwitching = function onAudioTrackSwitching(data) {
    // if any URL found on new audio track, it is an alternate audio track
    var altAudio = !!data.url,
        trackId = data.id;
    // if we switch on main audio, ensure that main fragment scheduling is synced with media.buffered
    // don't do anything if we switch to alt audio: audio stream controller is handling it.
    // we will just have to change buffer scheduling on audioTrackSwitched
    if (!altAudio) {
      if (this.mediaBuffer !== this.media) {
        logger["b" /* logger */].log('switching on main audio, use media.buffered to schedule main fragment loading');
        this.mediaBuffer = this.media;
        var fragCurrent = this.fragCurrent;
        // we need to refill audio buffer from main: cancel any frag loading to speed up audio switch
        if (fragCurrent.loader) {
          logger["b" /* logger */].log('switching to main audio track, cancel main fragment load');
          fragCurrent.loader.abort();
        }
        this.fragCurrent = null;
        this.fragPrevious = null;
        // destroy demuxer to force init segment generation (following audio switch)
        if (this.demuxer) {
          this.demuxer.destroy();
          this.demuxer = null;
        }
        // switch to IDLE state to load new fragment
        this.state = State.IDLE;
      }
      var hls = this.hls;
      // switching to main audio, flush all audio and trigger track switched
      hls.trigger(events["a" /* default */].BUFFER_FLUSHING, { startOffset: 0, endOffset: Number.POSITIVE_INFINITY, type: 'audio' });
      hls.trigger(events["a" /* default */].AUDIO_TRACK_SWITCHED, { id: trackId });
      this.altAudio = false;
    }
  };

  StreamController.prototype.onAudioTrackSwitched = function onAudioTrackSwitched(data) {
    var trackId = data.id,
        altAudio = !!this.hls.audioTracks[trackId].url;
    if (altAudio) {
      var videoBuffer = this.videoBuffer;
      // if we switched on alternate audio, ensure that main fragment scheduling is synced with video sourcebuffer buffered
      if (videoBuffer && this.mediaBuffer !== videoBuffer) {
        logger["b" /* logger */].log('switching on alternate audio, use video.buffered to schedule main fragment loading');
        this.mediaBuffer = videoBuffer;
      }
    }
    this.altAudio = altAudio;
    this.tick();
  };

  StreamController.prototype.onBufferCreated = function onBufferCreated(data) {
    var tracks = data.tracks,
        mediaTrack = void 0,
        name = void 0,
        alternate = false;
    for (var type in tracks) {
      var track = tracks[type];
      if (track.id === 'main') {
        name = type;
        mediaTrack = track;
        // keep video source buffer reference
        if (type === 'video') {
          this.videoBuffer = tracks[type].buffer;
        }
      } else {
        alternate = true;
      }
    }
    if (alternate && mediaTrack) {
      logger["b" /* logger */].log('alternate track found, use ' + name + '.buffered to schedule main fragment loading');
      this.mediaBuffer = mediaTrack.buffer;
    } else {
      this.mediaBuffer = this.media;
    }
  };

  StreamController.prototype.onBufferAppended = function onBufferAppended(data) {
    if (data.parent === 'main') {
      var state = this.state;
      if (state === State.PARSING || state === State.PARSED) {
        // check if all buffers have been appended
        this.pendingBuffering = data.pending > 0;
        this._checkAppendedParsed();
      }
    }
  };

  StreamController.prototype._checkAppendedParsed = function _checkAppendedParsed() {
    // trigger handler right now
    if (this.state === State.PARSED && (!this.appended || !this.pendingBuffering)) {
      var frag = this.fragCurrent;
      if (frag) {
        var media = this.mediaBuffer ? this.mediaBuffer : this.media;
        logger["b" /* logger */].log('main buffered : ' + time_ranges.toString(media.buffered));
        this.fragPrevious = frag;
        var stats = this.stats;
        stats.tbuffered = window.performance.now();
        // we should get rid of this.fragLastKbps
        this.fragLastKbps = Math.round(8 * stats.total / (stats.tbuffered - stats.tfirst));
        this.hls.trigger(events["a" /* default */].FRAG_BUFFERED, { stats: stats, frag: frag, id: 'main' });
        this.state = State.IDLE;
      }
      this.tick();
    }
  };

  StreamController.prototype.onError = function onError(data) {
    var frag = data.frag || this.fragCurrent;
    // don't handle frag error not related to main fragment
    if (frag && frag.type !== 'main') {
      return;
    }

    // 0.5 : tolerance needed as some browsers stalls playback before reaching buffered end
    var mediaBuffered = !!this.media && BufferHelper.isBuffered(this.media, this.media.currentTime) && BufferHelper.isBuffered(this.media, this.media.currentTime + 0.5);

    switch (data.details) {
      case errors["a" /* ErrorDetails */].FRAG_LOAD_ERROR:
      case errors["a" /* ErrorDetails */].FRAG_LOAD_TIMEOUT:
      case errors["a" /* ErrorDetails */].KEY_LOAD_ERROR:
      case errors["a" /* ErrorDetails */].KEY_LOAD_TIMEOUT:
        if (!data.fatal) {
          // keep retrying until the limit will be reached
          if (this.fragLoadError + 1 <= this.config.fragLoadingMaxRetry) {
            // exponential backoff capped to config.fragLoadingMaxRetryTimeout
            var delay = Math.min(Math.pow(2, this.fragLoadError) * this.config.fragLoadingRetryDelay, this.config.fragLoadingMaxRetryTimeout);
            logger["b" /* logger */].warn('mediaController: frag loading failed, retry in ' + delay + ' ms');
            this.retryDate = window.performance.now() + delay;
            // retry loading state
            // if loadedmetadata is not set, it means that we are emergency switch down on first frag
            // in that case, reset startFragRequested flag
            if (!this.loadedmetadata) {
              this.startFragRequested = false;
              this.nextLoadPosition = this.startPosition;
            }
            this.fragLoadError++;
            this.state = State.FRAG_LOADING_WAITING_RETRY;
          } else {
            logger["b" /* logger */].error('mediaController: ' + data.details + ' reaches max retry, redispatch as fatal ...');
            // switch error to fatal
            data.fatal = true;
            this.state = State.ERROR;
          }
        }
        break;
      case errors["a" /* ErrorDetails */].LEVEL_LOAD_ERROR:
      case errors["a" /* ErrorDetails */].LEVEL_LOAD_TIMEOUT:
        if (this.state !== State.ERROR) {
          if (data.fatal) {
            // if fatal error, stop processing
            this.state = State.ERROR;
            logger["b" /* logger */].warn('streamController: ' + data.details + ',switch to ' + this.state + ' state ...');
          } else {
            // in case of non fatal error while loading level, if level controller is not retrying to load level , switch back to IDLE
            if (!data.levelRetry && this.state === State.WAITING_LEVEL) {
              this.state = State.IDLE;
            }
          }
        }
        break;
      case errors["a" /* ErrorDetails */].BUFFER_FULL_ERROR:
        // if in appending state
        if (data.parent === 'main' && (this.state === State.PARSING || this.state === State.PARSED)) {
          // reduce max buf len if current position is buffered
          if (mediaBuffered) {
            this._reduceMaxBufferLength(this.config.maxBufferLength);
            this.state = State.IDLE;
          } else {
            // current position is not buffered, but browser is still complaining about buffer full error
            // this happens on IE/Edge, refer to https://github.com/video-dev/hls.js/pull/708
            // in that case flush the whole buffer to recover
            logger["b" /* logger */].warn('buffer full error also media.currentTime is not buffered, flush everything');
            this.fragCurrent = null;
            // flush everything
            this.flushMainBuffer(0, Number.POSITIVE_INFINITY);
          }
        }
        break;
      default:
        break;
    }
  };

  StreamController.prototype._reduceMaxBufferLength = function _reduceMaxBufferLength(minLength) {
    var config = this.config;
    if (config.maxMaxBufferLength >= minLength) {
      // reduce max buffer length as it might be too high. we do this to avoid loop flushing ...
      config.maxMaxBufferLength /= 2;
      logger["b" /* logger */].warn('main:reduce max buffer length to ' + config.maxMaxBufferLength + 's');
      return true;
    }
    return false;
  };

  /**
   * Checks the health of the buffer and attempts to resolve playback stalls.
   * @private
   */


  StreamController.prototype._checkBuffer = function _checkBuffer() {
    var config = this.config,
        media = this.media;

    var stallDebounceInterval = 1000;
    if (!media || media.readyState === 0) {
      // Exit early if we don't have media or if the media hasn't bufferd anything yet (readyState 0)
      return;
    }

    var currentTime = media.currentTime;
    var mediaBuffer = this.mediaBuffer ? this.mediaBuffer : media;
    var buffered = mediaBuffer.buffered;

    if (!this.loadedmetadata && buffered.length) {
      this.loadedmetadata = true;
      this._seekToStartPos();
    } else if (this.immediateSwitch) {
      this.immediateLevelSwitchEnd();
    } else {
      var expectedPlaying = !(media.paused && media.readyState > 1 || // not playing when media is paused and sufficiently buffered
      media.ended || // not playing when media is ended
      media.buffered.length === 0); // not playing if nothing buffered
      var tnow = window.performance.now();

      if (currentTime !== this.lastCurrentTime) {
        // The playhead is now moving, but was previously stalled
        if (this.stallReported) {
          logger["b" /* logger */].warn('playback not stuck anymore @' + currentTime + ', after ' + Math.round(tnow - this.stalled) + 'ms');
          this.stallReported = false;
        }
        this.stalled = null;
        this.nudgeRetry = 0;
      } else if (expectedPlaying) {
        // The playhead isn't moving but it should be
        // Allow some slack time to for small stalls to resolve themselves
        var stalledDuration = tnow - this.stalled;
        var bufferInfo = BufferHelper.bufferInfo(media, currentTime, config.maxBufferHole);
        if (!this.stalled) {
          this.stalled = tnow;
          return;
        } else if (stalledDuration >= stallDebounceInterval) {
          // Report stalling after trying to fix
          this._reportStall(bufferInfo.len);
        }

        this._tryFixBufferStall(bufferInfo, stalledDuration);
      }
    }
  };

  StreamController.prototype.onFragLoadEmergencyAborted = function onFragLoadEmergencyAborted() {
    this.state = State.IDLE;
    // if loadedmetadata is not set, it means that we are emergency switch down on first frag
    // in that case, reset startFragRequested flag
    if (!this.loadedmetadata) {
      this.startFragRequested = false;
      this.nextLoadPosition = this.startPosition;
    }
    this.tick();
  };

  StreamController.prototype.onBufferFlushed = function onBufferFlushed() {
    /* after successful buffer flushing, filter flushed fragments from bufferedFrags
      use mediaBuffered instead of media (so that we will check against video.buffered ranges in case of alt audio track)
    */
    var media = this.mediaBuffer ? this.mediaBuffer : this.media;
    if (media) {
      // filter fragments potentially evicted from buffer. this is to avoid memleak on live streams
      this.fragmentTracker.detectEvictedFragments(loader_fragment.ElementaryStreamTypes.VIDEO, media.buffered);
    }
    // move to IDLE once flush complete. this should trigger new fragment loading
    this.state = State.IDLE;
    // reset reference to frag
    this.fragPrevious = null;
  };

  StreamController.prototype.swapAudioCodec = function swapAudioCodec() {
    this.audioCodecSwap = !this.audioCodecSwap;
  };

  StreamController.prototype.computeLivePosition = function computeLivePosition(sliding, levelDetails) {
    var targetLatency = this.config.liveSyncDuration !== undefined ? this.config.liveSyncDuration : this.config.liveSyncDurationCount * levelDetails.targetduration;
    return sliding + Math.max(0, levelDetails.totalduration - targetLatency);
  };

  /**
   * Detects and attempts to fix known buffer stalling issues.
   * @param bufferInfo - The properties of the current buffer.
   * @param stalledDuration - The amount of time Hls.js has been stalling for.
   * @private
   */


  StreamController.prototype._tryFixBufferStall = function _tryFixBufferStall(bufferInfo, stalledDuration) {
    var config = this.config,
        media = this.media;

    var currentTime = media.currentTime;
    var jumpThreshold = 0.5; // tolerance needed as some browsers stalls playback before reaching buffered range end

    var partial = this.fragmentTracker.getPartialFragment(currentTime);
    if (partial) {
      // Try to skip over the buffer hole caused by a partial fragment
      // This method isn't limited by the size of the gap between buffered ranges
      this._trySkipBufferHole(partial);
    }

    if (bufferInfo.len > jumpThreshold && stalledDuration > config.highBufferWatchdogPeriod * 1000) {
      // Try to nudge currentTime over a buffer hole if we've been stalling for the configured amount of seconds
      // We only try to jump the hole if it's under the configured size
      // Reset stalled so to rearm watchdog timer
      this.stalled = null;
      this._tryNudgeBuffer();
    }
  };

  /**
   * Triggers a BUFFER_STALLED_ERROR event, but only once per stall period.
   * @param bufferLen - The playhead distance from the end of the current buffer segment.
   * @private
   */


  StreamController.prototype._reportStall = function _reportStall(bufferLen) {
    var hls = this.hls,
        media = this.media,
        stallReported = this.stallReported;

    if (!stallReported) {
      // Report stalled error once
      this.stallReported = true;
      logger["b" /* logger */].warn('Playback stalling at @' + media.currentTime + ' due to low buffer');
      hls.trigger(events["a" /* default */].ERROR, {
        type: errors["b" /* ErrorTypes */].MEDIA_ERROR,
        details: errors["a" /* ErrorDetails */].BUFFER_STALLED_ERROR,
        fatal: false,
        buffer: bufferLen
      });
    }
  };

  /**
   * Attempts to fix buffer stalls by jumping over known gaps caused by partial fragments
   * @param partial - The partial fragment found at the current time (where playback is stalling).
   * @private
   */


  StreamController.prototype._trySkipBufferHole = function _trySkipBufferHole(partial) {
    var hls = this.hls,
        media = this.media;

    var currentTime = media.currentTime;
    var lastEndTime = 0;
    // Check if currentTime is between unbuffered regions of partial fragments
    for (var i = 0; i < media.buffered.length; i++) {
      var startTime = media.buffered.start(i);
      if (currentTime >= lastEndTime && currentTime < startTime) {
        media.currentTime = Math.max(startTime, media.currentTime + 0.1);
        logger["b" /* logger */].warn('skipping hole, adjusting currentTime from ' + currentTime + ' to ' + media.currentTime);
        this.stalled = null;
        hls.trigger(events["a" /* default */].ERROR, {
          type: errors["b" /* ErrorTypes */].MEDIA_ERROR,
          details: errors["a" /* ErrorDetails */].BUFFER_SEEK_OVER_HOLE,
          fatal: false,
          reason: 'fragment loaded with buffer holes, seeking from ' + currentTime + ' to ' + media.currentTime,
          frag: partial
        });
        return;
      }
      lastEndTime = media.buffered.end(i);
    }
  };

  /**
   * Attempts to fix buffer stalls by advancing the mediaElement's current time by a small amount.
   * @private
   */


  StreamController.prototype._tryNudgeBuffer = function _tryNudgeBuffer() {
    var config = this.config,
        hls = this.hls,
        media = this.media;

    var currentTime = media.currentTime;
    var nudgeRetry = (this.nudgeRetry || 0) + 1;
    this.nudgeRetry = nudgeRetry;

    if (nudgeRetry < config.nudgeMaxRetry) {
      var targetTime = currentTime + nudgeRetry * config.nudgeOffset;
      logger["b" /* logger */].log('adjust currentTime from ' + currentTime + ' to ' + targetTime);
      // playback stalled in buffered area ... let's nudge currentTime to try to overcome this
      media.currentTime = targetTime;
      hls.trigger(events["a" /* default */].ERROR, {
        type: errors["b" /* ErrorTypes */].MEDIA_ERROR,
        details: errors["a" /* ErrorDetails */].BUFFER_NUDGE_ON_STALL,
        fatal: false
      });
    } else {
      logger["b" /* logger */].error('still stuck in high buffer @' + currentTime + ' after ' + config.nudgeMaxRetry + ', raise fatal error');
      hls.trigger(events["a" /* default */].ERROR, {
        type: errors["b" /* ErrorTypes */].MEDIA_ERROR,
        details: errors["a" /* ErrorDetails */].BUFFER_STALLED_ERROR,
        fatal: true
      });
    }
  };

  /**
   * Seeks to the set startPosition if not equal to the mediaElement's current time.
   * @private
   */


  StreamController.prototype._seekToStartPos = function _seekToStartPos() {
    var media = this.media;

    var currentTime = media.currentTime;
    // only adjust currentTime if different from startPosition or if startPosition not buffered
    // at that stage, there should be only one buffered range, as we reach that code after first fragment has been buffered
    var startPosition = media.seeking ? currentTime : this.startPosition;
    // if currentTime not matching with expected startPosition or startPosition not buffered but close to first buffered
    if (currentTime !== startPosition) {
      // if startPosition not buffered, let's seek to buffered.start(0)
      logger["b" /* logger */].log('target start position not buffered, seek to buffered.start(0) ' + startPosition + ' from current time ' + currentTime + ' ');
      media.currentTime = startPosition;
    }
  };

  stream_controller__createClass(StreamController, [{
    key: 'state',
    set: function set(nextState) {
      if (this.state !== nextState) {
        var previousState = this.state;
        this._state = nextState;
        logger["b" /* logger */].log('main stream:' + previousState + '->' + nextState);
        this.hls.trigger(events["a" /* default */].STREAM_STATE_TRANSITION, { previousState: previousState, nextState: nextState });
      }
    },
    get: function get() {
      return this._state;
    }
  }, {
    key: 'currentLevel',
    get: function get() {
      var media = this.media;
      if (media) {
        var frag = this.getBufferedFrag(media.currentTime);
        if (frag) {
          return frag.level;
        }
      }
      return -1;
    }
  }, {
    key: 'nextBufferedFrag',
    get: function get() {
      var media = this.media;
      if (media) {
        // first get end range of current fragment
        return this.followingBufferedFrag(this.getBufferedFrag(media.currentTime));
      } else {
        return null;
      }
    }
  }, {
    key: 'nextLevel',
    get: function get() {
      var frag = this.nextBufferedFrag;
      if (frag) {
        return frag.level;
      } else {
        return -1;
      }
    }
  }, {
    key: 'liveSyncPosition',
    get: function get() {
      return this._liveSyncPosition;
    },
    set: function set(value) {
      this._liveSyncPosition = value;
    }
  }]);

  return StreamController;
}(task_loop);

/* harmony default export */ var stream_controller = (stream_controller_StreamController);
// CONCATENATED MODULE: ./src/controller/level-controller.js
var level_controller__typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var level_controller__createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function level_controller__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function level_controller__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function level_controller__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * Level Controller
*/








var level_controller__window = window,
    level_controller_performance = level_controller__window.performance;

var level_controller_LevelController = function (_EventHandler) {
  level_controller__inherits(LevelController, _EventHandler);

  function LevelController(hls) {
    level_controller__classCallCheck(this, LevelController);

    var _this = level_controller__possibleConstructorReturn(this, _EventHandler.call(this, hls, events["a" /* default */].MANIFEST_LOADED, events["a" /* default */].LEVEL_LOADED, events["a" /* default */].AUDIO_TRACK_SWITCHED, events["a" /* default */].FRAG_LOADED, events["a" /* default */].ERROR));

    _this.canload = false;
    _this.currentLevelIndex = null;
    _this.manualLevelIndex = -1;
    _this.timer = null;
    return _this;
  }

  LevelController.prototype.onHandlerDestroying = function onHandlerDestroying() {
    this.clearTimer();
    this.manualLevelIndex = -1;
  };

  LevelController.prototype.clearTimer = function clearTimer() {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  };

  LevelController.prototype.startLoad = function startLoad() {
    var levels = this._levels;

    this.canload = true;
    this.levelRetryCount = 0;

    // clean up live level details to force reload them, and reset load errors
    if (levels) {
      levels.forEach(function (level) {
        level.loadError = 0;
        var levelDetails = level.details;
        if (levelDetails && levelDetails.live) {
          level.details = undefined;
        }
      });
    }
    // speed up live playlist refresh if timer exists
    if (this.timer !== null) {
      this.loadLevel();
    }
  };

  LevelController.prototype.stopLoad = function stopLoad() {
    this.canload = false;
  };

  LevelController.prototype.onManifestLoaded = function onManifestLoaded(data) {
    var levels = [];
    var bitrateStart = void 0;
    var levelSet = {};
    var levelFromSet = null;
    var videoCodecFound = false;
    var audioCodecFound = false;
    var chromeOrFirefox = /chrome|firefox/.test(navigator.userAgent.toLowerCase());
    var audioTracks = [];

    // regroup redundant levels together
    data.levels.forEach(function (level) {
      level.loadError = 0;
      level.fragmentError = false;

      videoCodecFound = videoCodecFound || !!level.videoCodec;
      audioCodecFound = audioCodecFound || !!level.audioCodec || !!(level.attrs && level.attrs.AUDIO);

      // erase audio codec info if browser does not support mp4a.40.34.
      // demuxer will autodetect codec and fallback to mpeg/audio
      if (chromeOrFirefox && level.audioCodec && level.audioCodec.indexOf('mp4a.40.34') !== -1) {
        level.audioCodec = undefined;
      }

      levelFromSet = levelSet[level.bitrate]; // FIXME: we would also have to match the resolution here

      if (!levelFromSet) {
        level.url = [level.url];
        level.urlId = 0;
        levelSet[level.bitrate] = level;
        levels.push(level);
      } else {
        levelFromSet.url.push(level.url);
      }

      if (level.attrs && level.attrs.AUDIO) {
        addGroupId(levelFromSet || level, 'audio', level.attrs.AUDIO);
      }

      if (level.attrs && level.attrs.SUBTITLES) {
        addGroupId(levelFromSet || level, 'text', level.attrs.SUBTITLES);
      }
    });

    // remove audio-only level if we also have levels with audio+video codecs signalled
    if (videoCodecFound && audioCodecFound) {
      levels = levels.filter(function (_ref) {
        var videoCodec = _ref.videoCodec;
        return !!videoCodec;
      });
    }

    // only keep levels with supported audio/video codecs
    levels = levels.filter(function (_ref2) {
      var audioCodec = _ref2.audioCodec,
          videoCodec = _ref2.videoCodec;

      return (!audioCodec || isCodecSupportedInMp4(audioCodec)) && (!videoCodec || isCodecSupportedInMp4(videoCodec));
    });

    if (data.audioTracks) {
      audioTracks = data.audioTracks.filter(function (track) {
        return !track.audioCodec || isCodecSupportedInMp4(track.audioCodec, 'audio');
      });
    }

    if (levels.length > 0) {
      // start bitrate is the first bitrate of the manifest
      bitrateStart = levels[0].bitrate;
      // sort level on bitrate
      levels.sort(function (a, b) {
        return a.bitrate - b.bitrate;
      });
      this._levels = levels;
      // find index of first level in sorted levels
      for (var i = 0; i < levels.length; i++) {
        if (levels[i].bitrate === bitrateStart) {
          this._firstLevel = i;
          logger["b" /* logger */].log('manifest loaded,' + levels.length + ' level(s) found, first bitrate:' + bitrateStart);
          break;
        }
      }
      this.hls.trigger(events["a" /* default */].MANIFEST_PARSED, {
        levels: levels,
        audioTracks: audioTracks,
        firstLevel: this._firstLevel,
        stats: data.stats,
        audio: audioCodecFound,
        video: videoCodecFound,
        altAudio: audioTracks.length > 0 && videoCodecFound
      });
    } else {
      this.hls.trigger(events["a" /* default */].ERROR, {
        type: errors["b" /* ErrorTypes */].MEDIA_ERROR,
        details: errors["a" /* ErrorDetails */].MANIFEST_INCOMPATIBLE_CODECS_ERROR,
        fatal: true,
        url: this.hls.url,
        reason: 'no level with compatible codecs found in manifest'
      });
    }
  };

  LevelController.prototype.setLevelInternal = function setLevelInternal(newLevel) {
    var levels = this._levels;
    var hls = this.hls;
    // check if level idx is valid
    if (newLevel >= 0 && newLevel < levels.length) {
      // stopping live reloading timer if any
      this.clearTimer();
      if (this.currentLevelIndex !== newLevel) {
        logger["b" /* logger */].log('switching to level ' + newLevel);
        this.currentLevelIndex = newLevel;
        var levelProperties = levels[newLevel];
        levelProperties.level = newLevel;
        hls.trigger(events["a" /* default */].LEVEL_SWITCHING, levelProperties);
      }
      var level = levels[newLevel];
      var levelDetails = level.details;

      // check if we need to load playlist for this level
      if (!levelDetails || levelDetails.live) {
        // level not retrieved yet, or live playlist we need to (re)load it
        var urlId = level.urlId;
        hls.trigger(events["a" /* default */].LEVEL_LOADING, { url: level.url[urlId], level: newLevel, id: urlId });
      }
    } else {
      // invalid level id given, trigger error
      hls.trigger(events["a" /* default */].ERROR, {
        type: errors["b" /* ErrorTypes */].OTHER_ERROR,
        details: errors["a" /* ErrorDetails */].LEVEL_SWITCH_ERROR,
        level: newLevel,
        fatal: false,
        reason: 'invalid level idx'
      });
    }
  };

  LevelController.prototype.onError = function onError(data) {
    if (data.fatal) {
      if (data.type === errors["b" /* ErrorTypes */].NETWORK_ERROR) {
        this.clearTimer();
      }

      return;
    }

    var levelError = false,
        fragmentError = false;
    var levelIndex = void 0;

    // try to recover not fatal errors
    switch (data.details) {
      case errors["a" /* ErrorDetails */].FRAG_LOAD_ERROR:
      case errors["a" /* ErrorDetails */].FRAG_LOAD_TIMEOUT:
      case errors["a" /* ErrorDetails */].KEY_LOAD_ERROR:
      case errors["a" /* ErrorDetails */].KEY_LOAD_TIMEOUT:
        levelIndex = data.frag.level;
        fragmentError = true;
        break;
      case errors["a" /* ErrorDetails */].LEVEL_LOAD_ERROR:
      case errors["a" /* ErrorDetails */].LEVEL_LOAD_TIMEOUT:
        levelIndex = data.context.level;
        levelError = true;
        break;
      case errors["a" /* ErrorDetails */].REMUX_ALLOC_ERROR:
        levelIndex = data.level;
        levelError = true;
        break;
    }

    if (levelIndex !== undefined) {
      this.recoverLevel(data, levelIndex, levelError, fragmentError);
    }
  };

  /**
   * Switch to a redundant stream if any available.
   * If redundant stream is not available, emergency switch down if ABR mode is enabled.
   *
   * @param {Object} errorEvent
   * @param {Number} levelIndex current level index
   * @param {Boolean} levelError
   * @param {Boolean} fragmentError
   */
  // FIXME Find a better abstraction where fragment/level retry management is well decoupled


  LevelController.prototype.recoverLevel = function recoverLevel(errorEvent, levelIndex, levelError, fragmentError) {
    var _this2 = this;

    var config = this.hls.config;
    var errorDetails = errorEvent.details;

    var level = this._levels[levelIndex];
    var redundantLevels = void 0,
        delay = void 0,
        nextLevel = void 0;

    level.loadError++;
    level.fragmentError = fragmentError;

    if (levelError) {
      if (this.levelRetryCount + 1 <= config.levelLoadingMaxRetry) {
        // exponential backoff capped to max retry timeout
        delay = Math.min(Math.pow(2, this.levelRetryCount) * config.levelLoadingRetryDelay, config.levelLoadingMaxRetryTimeout);
        // Schedule level reload
        this.timer = setTimeout(function () {
          return _this2.loadLevel();
        }, delay);
        // boolean used to inform stream controller not to switch back to IDLE on non fatal error
        errorEvent.levelRetry = true;
        this.levelRetryCount++;
        logger["b" /* logger */].warn('level controller, ' + errorDetails + ', retry in ' + delay + ' ms, current retry count is ' + this.levelRetryCount);
      } else {
        logger["b" /* logger */].error('level controller, cannot recover from ' + errorDetails + ' error');
        this.currentLevelIndex = null;
        // stopping live reloading timer if any
        this.clearTimer();
        // switch error to fatal
        errorEvent.fatal = true;
        return;
      }
    }

    // Try any redundant streams if available for both errors: level and fragment
    // If level.loadError reaches redundantLevels it means that we tried them all, no hope  => let's switch down
    if (levelError || fragmentError) {
      redundantLevels = level.url.length;

      if (redundantLevels > 1 && level.loadError < redundantLevels) {
        level.urlId = (level.urlId + 1) % redundantLevels;
        level.details = undefined;

        logger["b" /* logger */].warn('level controller, ' + errorDetails + ' for level ' + levelIndex + ': switching to redundant URL-id ' + level.urlId);

        // console.log('Current audio track group ID:', this.hls.audioTracks[this.hls.audioTrack].groupId);
        // console.log('New video quality level audio group id:', level.attrs.AUDIO);
      } else {
        // Search for available level
        if (this.manualLevelIndex === -1) {
          // When lowest level has been reached, let's start hunt from the top
          nextLevel = levelIndex === 0 ? this._levels.length - 1 : levelIndex - 1;
          logger["b" /* logger */].warn('level controller, ' + errorDetails + ': switch to ' + nextLevel);
          this.hls.nextAutoLevel = this.currentLevelIndex = nextLevel;
        } else if (fragmentError) {
          // Allow fragment retry as long as configuration allows.
          // reset this._level so that another call to set level() will trigger again a frag load
          logger["b" /* logger */].warn('level controller, ' + errorDetails + ': reload a fragment');
          this.currentLevelIndex = null;
        }
      }
    }
  };

  // reset errors on the successful load of a fragment


  LevelController.prototype.onFragLoaded = function onFragLoaded(_ref3) {
    var frag = _ref3.frag;

    if (frag !== undefined && frag.type === 'main') {
      var level = this._levels[frag.level];
      if (level !== undefined) {
        level.fragmentError = false;
        level.loadError = 0;
        this.levelRetryCount = 0;
      }
    }
  };

  LevelController.prototype.onLevelLoaded = function onLevelLoaded(data) {
    var _this3 = this;

    var levelId = data.level;
    // only process level loaded events matching with expected level
    if (levelId !== this.currentLevelIndex) {
      return;
    }

    var curLevel = this._levels[levelId];
    // reset level load error counter on successful level loaded only if there is no issues with fragments
    if (!curLevel.fragmentError) {
      curLevel.loadError = 0;
      this.levelRetryCount = 0;
    }
    var newDetails = data.details;
    // if current playlist is a live playlist, arm a timer to reload it
    if (newDetails.live) {
      var targetdurationMs = 1000 * (newDetails.averagetargetduration ? newDetails.averagetargetduration : newDetails.targetduration);
      var reloadInterval = targetdurationMs,
          curDetails = curLevel.details;
      if (curDetails && newDetails.endSN === curDetails.endSN) {
        // follow HLS Spec, If the client reloads a Playlist file and finds that it has not
        // changed then it MUST wait for a period of one-half the target
        // duration before retrying.
        reloadInterval /= 2;
        logger["b" /* logger */].log('same live playlist, reload twice faster');
      }
      // decrement reloadInterval with level loading delay
      reloadInterval -= level_controller_performance.now() - data.stats.trequest;
      // in any case, don't reload more than half of target duration
      reloadInterval = Math.max(targetdurationMs / 2, Math.round(reloadInterval));
      logger["b" /* logger */].log('live playlist, reload in ' + Math.round(reloadInterval) + ' ms');
      this.timer = setTimeout(function () {
        return _this3.loadLevel();
      }, reloadInterval);
    } else {
      this.clearTimer();
    }
  };

  LevelController.prototype.onAudioTrackSwitched = function onAudioTrackSwitched(data) {
    var audioGroupId = this.hls.audioTracks[data.id].groupId;

    var currentLevel = this.hls.levels[this.currentLevelIndex];
    if (!currentLevel) {
      return;
    }

    if (currentLevel.audioGroupIds) {
      var urlId = currentLevel.audioGroupIds.findIndex(function (groupId) {
        return groupId === audioGroupId;
      });
      if (urlId !== currentLevel.urlId) {
        currentLevel.urlId = urlId;
        this.startLoad();
      }
    }
  };

  LevelController.prototype.loadLevel = function loadLevel() {
    logger["b" /* logger */].debug('call to loadLevel');

    if (this.currentLevelIndex !== null && this.canload) {
      var levelObject = this._levels[this.currentLevelIndex];

      if ((typeof levelObject === 'undefined' ? 'undefined' : level_controller__typeof(levelObject)) === 'object' && levelObject.url.length > 0) {
        var level = this.currentLevelIndex;
        var id = levelObject.urlId;
        var url = levelObject.url[id];

        logger["b" /* logger */].log('Attempt loading level index ' + level + ' with URL-id ' + id);

        // console.log('Current audio track group ID:', this.hls.audioTracks[this.hls.audioTrack].groupId);
        // console.log('New video quality level audio group id:', levelObject.attrs.AUDIO, level);

        this.hls.trigger(events["a" /* default */].LEVEL_LOADING, { url: url, level: level, id: id });
      }
    }
  };

  level_controller__createClass(LevelController, [{
    key: 'levels',
    get: function get() {
      return this._levels;
    }
  }, {
    key: 'level',
    get: function get() {
      return this.currentLevelIndex;
    },
    set: function set(newLevel) {
      var levels = this._levels;
      if (levels) {
        newLevel = Math.min(newLevel, levels.length - 1);
        if (this.currentLevelIndex !== newLevel || !levels[newLevel].details) {
          this.setLevelInternal(newLevel);
        }
      }
    }
  }, {
    key: 'manualLevel',
    get: function get() {
      return this.manualLevelIndex;
    },
    set: function set(newLevel) {
      this.manualLevelIndex = newLevel;
      if (this._startLevel === undefined) {
        this._startLevel = newLevel;
      }

      if (newLevel !== -1) {
        this.level = newLevel;
      }
    }
  }, {
    key: 'firstLevel',
    get: function get() {
      return this._firstLevel;
    },
    set: function set(newLevel) {
      this._firstLevel = newLevel;
    }
  }, {
    key: 'startLevel',
    get: function get() {
      // hls.startLevel takes precedence over config.startLevel
      // if none of these values are defined, fallback on this._firstLevel (first quality level appearing in variant manifest)
      if (this._startLevel === undefined) {
        var configStartLevel = this.hls.config.startLevel;
        if (configStartLevel !== undefined) {
          return configStartLevel;
        } else {
          return this._firstLevel;
        }
      } else {
        return this._startLevel;
      }
    },
    set: function set(newLevel) {
      this._startLevel = newLevel;
    }
  }, {
    key: 'nextLoadLevel',
    get: function get() {
      if (this.manualLevelIndex !== -1) {
        return this.manualLevelIndex;
      } else {
        return this.hls.nextAutoLevel;
      }
    },
    set: function set(nextLevel) {
      this.level = nextLevel;
      if (this.manualLevelIndex === -1) {
        this.hls.nextAutoLevel = nextLevel;
      }
    }
  }]);

  return LevelController;
}(event_handler);

/* harmony default export */ var level_controller = (level_controller_LevelController);
// EXTERNAL MODULE: ./src/demux/id3.js
var id3 = __webpack_require__(5);

// CONCATENATED MODULE: ./src/utils/texttrack-utils.js

function sendAddTrackEvent(track, videoEl) {
  var event = null;
  try {
    event = new window.Event('addtrack');
  } catch (err) {
    // for IE11
    event = document.createEvent('Event');
    event.initEvent('addtrack', false, false);
  }
  event.track = track;
  videoEl.dispatchEvent(event);
}

function clearCurrentCues(track) {
  if (track && track.cues) {
    while (track.cues.length > 0) {
      track.removeCue(track.cues[0]);
    }
  }
}
// CONCATENATED MODULE: ./src/controller/id3-track-controller.js
function id3_track_controller__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function id3_track_controller__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function id3_track_controller__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * id3 metadata track controller
*/






var id3_track_controller_ID3TrackController = function (_EventHandler) {
  id3_track_controller__inherits(ID3TrackController, _EventHandler);

  function ID3TrackController(hls) {
    id3_track_controller__classCallCheck(this, ID3TrackController);

    var _this = id3_track_controller__possibleConstructorReturn(this, _EventHandler.call(this, hls, events["a" /* default */].MEDIA_ATTACHED, events["a" /* default */].MEDIA_DETACHING, events["a" /* default */].FRAG_PARSING_METADATA));

    _this.id3Track = undefined;
    _this.media = undefined;
    return _this;
  }

  ID3TrackController.prototype.destroy = function destroy() {
    event_handler.prototype.destroy.call(this);
  };

  // Add ID3 metatadata text track.


  ID3TrackController.prototype.onMediaAttached = function onMediaAttached(data) {
    this.media = data.media;
    if (!this.media) {}
  };

  ID3TrackController.prototype.onMediaDetaching = function onMediaDetaching() {
    clearCurrentCues(this.id3Track);
    this.id3Track = undefined;
    this.media = undefined;
  };

  ID3TrackController.prototype.getID3Track = function getID3Track(textTracks) {
    for (var i = 0; i < textTracks.length; i++) {
      var textTrack = textTracks[i];
      if (textTrack.kind === 'metadata' && textTrack.label === 'id3') {
        // send 'addtrack' when reusing the textTrack for metadata,
        // same as what we do for captions
        sendAddTrackEvent(textTrack, this.media);

        return textTrack;
      }
    }
    return this.media.addTextTrack('metadata', 'id3');
  };

  ID3TrackController.prototype.onFragParsingMetadata = function onFragParsingMetadata(data) {
    var fragment = data.frag;
    var samples = data.samples;

    // create track dynamically
    if (!this.id3Track) {
      this.id3Track = this.getID3Track(this.media.textTracks);
      this.id3Track.mode = 'hidden';
    }

    // Attempt to recreate Safari functionality by creating
    // WebKitDataCue objects when available and store the decoded
    // ID3 data in the value property of the cue
    var Cue = window.WebKitDataCue || window.VTTCue || window.TextTrackCue;

    for (var i = 0; i < samples.length; i++) {
      var frames = id3["a" /* default */].getID3Frames(samples[i].data);
      if (frames) {
        var startTime = samples[i].pts;
        var endTime = i < samples.length - 1 ? samples[i + 1].pts : fragment.endPTS;

        // Give a slight bump to the endTime if it's equal to startTime to avoid a SyntaxError in IE
        if (startTime === endTime) {
          endTime += 0.0001;
        }

        for (var j = 0; j < frames.length; j++) {
          var frame = frames[j];
          // Safari doesn't put the timestamp frame in the TextTrack
          if (!id3["a" /* default */].isTimeStampFrame(frame)) {
            var cue = new Cue(startTime, endTime, '');
            cue.value = frame;
            this.id3Track.addCue(cue);
          }
        }
      }
    }
  };

  return ID3TrackController;
}(event_handler);

/* harmony default export */ var id3_track_controller = (id3_track_controller_ID3TrackController);
// CONCATENATED MODULE: ./src/is-supported.js


function is_supported_isSupported() {
  var mediaSource = getMediaSource();
  var sourceBuffer = window.SourceBuffer || window.WebKitSourceBuffer;
  var isTypeSupported = mediaSource && typeof mediaSource.isTypeSupported === 'function' && mediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');

  // if SourceBuffer is exposed ensure its API is valid
  // safari and old version of Chrome doe not expose SourceBuffer globally so checking SourceBuffer.prototype is impossible
  var sourceBufferValidAPI = !sourceBuffer || sourceBuffer.prototype && typeof sourceBuffer.prototype.appendBuffer === 'function' && typeof sourceBuffer.prototype.remove === 'function';
  return !!isTypeSupported && !!sourceBufferValidAPI;
}
// CONCATENATED MODULE: ./src/utils/ewma.js
function ewma__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * compute an Exponential Weighted moving average
 * - https://en.wikipedia.org/wiki/Moving_average#Exponential_moving_average
 *  - heavily inspired from shaka-player
 */

var EWMA = function () {
  //  About half of the estimated value will be from the last |halfLife| samples by weight.
  function EWMA(halfLife) {
    ewma__classCallCheck(this, EWMA);

    // Larger values of alpha expire historical data more slowly.
    this.alpha_ = halfLife ? Math.exp(Math.log(0.5) / halfLife) : 0;
    this.estimate_ = 0;
    this.totalWeight_ = 0;
  }

  EWMA.prototype.sample = function sample(weight, value) {
    var adjAlpha = Math.pow(this.alpha_, weight);
    this.estimate_ = value * (1 - adjAlpha) + adjAlpha * this.estimate_;
    this.totalWeight_ += weight;
  };

  EWMA.prototype.getTotalWeight = function getTotalWeight() {
    return this.totalWeight_;
  };

  EWMA.prototype.getEstimate = function getEstimate() {
    if (this.alpha_) {
      var zeroFactor = 1 - Math.pow(this.alpha_, this.totalWeight_);
      return this.estimate_ / zeroFactor;
    } else {
      return this.estimate_;
    }
  };

  return EWMA;
}();

/* harmony default export */ var ewma = (EWMA);
// CONCATENATED MODULE: ./src/utils/ewma-bandwidth-estimator.js
function ewma_bandwidth_estimator__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * EWMA Bandwidth Estimator
 *  - heavily inspired from shaka-player
 * Tracks bandwidth samples and estimates available bandwidth.
 * Based on the minimum of two exponentially-weighted moving averages with
 * different half-lives.
 */



var ewma_bandwidth_estimator_EwmaBandWidthEstimator = function () {
  function EwmaBandWidthEstimator(hls, slow, fast, defaultEstimate) {
    ewma_bandwidth_estimator__classCallCheck(this, EwmaBandWidthEstimator);

    this.hls = hls;
    this.defaultEstimate_ = defaultEstimate;
    this.minWeight_ = 0.001;
    this.minDelayMs_ = 50;
    this.slow_ = new ewma(slow);
    this.fast_ = new ewma(fast);
  }

  EwmaBandWidthEstimator.prototype.sample = function sample(durationMs, numBytes) {
    durationMs = Math.max(durationMs, this.minDelayMs_);
    var bandwidth = 8000 * numBytes / durationMs,

    // console.log('instant bw:'+ Math.round(bandwidth));
    // we weight sample using loading duration....
    weight = durationMs / 1000;
    this.fast_.sample(weight, bandwidth);
    this.slow_.sample(weight, bandwidth);
  };

  EwmaBandWidthEstimator.prototype.canEstimate = function canEstimate() {
    var fast = this.fast_;
    return fast && fast.getTotalWeight() >= this.minWeight_;
  };

  EwmaBandWidthEstimator.prototype.getEstimate = function getEstimate() {
    if (this.canEstimate()) {
      // console.log('slow estimate:'+ Math.round(this.slow_.getEstimate()));
      // console.log('fast estimate:'+ Math.round(this.fast_.getEstimate()));
      // Take the minimum of these two estimates.  This should have the effect of
      // adapting down quickly, but up more slowly.
      return Math.min(this.fast_.getEstimate(), this.slow_.getEstimate());
    } else {
      return this.defaultEstimate_;
    }
  };

  EwmaBandWidthEstimator.prototype.destroy = function destroy() {};

  return EwmaBandWidthEstimator;
}();

/* harmony default export */ var ewma_bandwidth_estimator = (ewma_bandwidth_estimator_EwmaBandWidthEstimator);
// CONCATENATED MODULE: ./src/controller/abr-controller.js
var abr_controller__createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function abr_controller__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function abr_controller__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function abr_controller__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * simple ABR Controller
 *  - compute next level based on last fragment bw heuristics
 *  - implement an abandon rules triggered if we have less than 2 frag buffered and if computed bw shows that we risk buffer stalling
 */








var abr_controller__window = window,
    abr_controller_performance = abr_controller__window.performance;

var abr_controller_AbrController = function (_EventHandler) {
  abr_controller__inherits(AbrController, _EventHandler);

  function AbrController(hls) {
    abr_controller__classCallCheck(this, AbrController);

    var _this = abr_controller__possibleConstructorReturn(this, _EventHandler.call(this, hls, events["a" /* default */].FRAG_LOADING, events["a" /* default */].FRAG_LOADED, events["a" /* default */].FRAG_BUFFERED, events["a" /* default */].ERROR));

    _this.lastLoadedFragLevel = 0;
    _this._nextAutoLevel = -1;
    _this.hls = hls;
    _this.timer = null;
    _this._bwEstimator = null;
    _this.onCheck = _this._abandonRulesCheck.bind(_this);
    return _this;
  }

  AbrController.prototype.destroy = function destroy() {
    this.clearTimer();
    event_handler.prototype.destroy.call(this);
  };

  AbrController.prototype.onFragLoading = function onFragLoading(data) {
    var frag = data.frag;
    if (frag.type === 'main') {
      if (!this.timer) {
        this.fragCurrent = frag;
        this.timer = setInterval(this.onCheck, 100);
      }

      // lazy init of BwEstimator, rationale is that we use different params for Live/VoD
      // so we need to wait for stream manifest / playlist type to instantiate it.
      if (!this._bwEstimator) {
        var hls = this.hls;
        var config = hls.config;
        var level = frag.level;
        var isLive = hls.levels[level].details.live;

        var ewmaFast = void 0,
            ewmaSlow = void 0;
        if (isLive) {
          ewmaFast = config.abrEwmaFastLive;
          ewmaSlow = config.abrEwmaSlowLive;
        } else {
          ewmaFast = config.abrEwmaFastVoD;
          ewmaSlow = config.abrEwmaSlowVoD;
        }
        this._bwEstimator = new ewma_bandwidth_estimator(hls, ewmaSlow, ewmaFast, config.abrEwmaDefaultEstimate);
      }
    }
  };

  AbrController.prototype._abandonRulesCheck = function _abandonRulesCheck() {
    /*
      monitor fragment retrieval time...
      we compute expected time of arrival of the complete fragment.
      we compare it to expected time of buffer starvation
    */
    var hls = this.hls;
    var video = hls.media;
    var frag = this.fragCurrent;

    if (!frag) {
      return;
    }

    var loader = frag.loader;
    var minAutoLevel = hls.minAutoLevel;

    // if loader has been destroyed or loading has been aborted, stop timer and return
    if (!loader || loader.stats && loader.stats.aborted) {
      logger["b" /* logger */].warn('frag loader destroy or aborted, disarm abandonRules');
      this.clearTimer();
      // reset forced auto level value so that next level will be selected
      this._nextAutoLevel = -1;
      return;
    }
    var stats = loader.stats;
    /* only monitor frag retrieval time if
    (video not paused OR first fragment being loaded(ready state === HAVE_NOTHING = 0)) AND autoswitching enabled AND not lowest level (=> means that we have several levels) */
    if (video && stats && (!video.paused && video.playbackRate !== 0 || !video.readyState) && frag.autoLevel && frag.level) {
      var requestDelay = abr_controller_performance.now() - stats.trequest,
          playbackRate = Math.abs(video.playbackRate);
      // monitor fragment load progress after half of expected fragment duration,to stabilize bitrate
      if (requestDelay > 500 * frag.duration / playbackRate) {
        var levels = hls.levels,
            loadRate = Math.max(1, stats.bw ? stats.bw / 8 : stats.loaded * 1000 / requestDelay),
            // byte/s; at least 1 byte/s to avoid division by zero
        // compute expected fragment length using frag duration and level bitrate. also ensure that expected len is gte than already loaded size
        level = levels[frag.level],
            levelBitrate = level.realBitrate ? Math.max(level.realBitrate, level.bitrate) : level.bitrate,
            expectedLen = stats.total ? stats.total : Math.max(stats.loaded, Math.round(frag.duration * levelBitrate / 8)),
            pos = video.currentTime,
            fragLoadedDelay = (expectedLen - stats.loaded) / loadRate,
            bufferStarvationDelay = (BufferHelper.bufferInfo(video, pos, hls.config.maxBufferHole).end - pos) / playbackRate;
        // consider emergency switch down only if we have less than 2 frag buffered AND
        // time to finish loading current fragment is bigger than buffer starvation delay
        // ie if we risk buffer starvation if bw does not increase quickly
        if (bufferStarvationDelay < 2 * frag.duration / playbackRate && fragLoadedDelay > bufferStarvationDelay) {
          var fragLevelNextLoadedDelay = void 0,
              nextLoadLevel = void 0;
          // lets iterate through lower level and try to find the biggest one that could avoid rebuffering
          // we start from current level - 1 and we step down , until we find a matching level
          for (nextLoadLevel = frag.level - 1; nextLoadLevel > minAutoLevel; nextLoadLevel--) {
            // compute time to load next fragment at lower level
            // 0.8 : consider only 80% of current bw to be conservative
            // 8 = bits per byte (bps/Bps)
            var levelNextBitrate = levels[nextLoadLevel].realBitrate ? Math.max(levels[nextLoadLevel].realBitrate, levels[nextLoadLevel].bitrate) : levels[nextLoadLevel].bitrate;
            fragLevelNextLoadedDelay = frag.duration * levelNextBitrate / (8 * 0.8 * loadRate);
            if (fragLevelNextLoadedDelay < bufferStarvationDelay) {
              // we found a lower level that be rebuffering free with current estimated bw !
              break;
            }
          }
          // only emergency switch down if it takes less time to load new fragment at lowest level instead
          // of finishing loading current one ...
          if (fragLevelNextLoadedDelay < fragLoadedDelay) {
            logger["b" /* logger */].warn('loading too slow, abort fragment loading and switch to level ' + nextLoadLevel + ':fragLoadedDelay[' + nextLoadLevel + ']<fragLoadedDelay[' + (frag.level - 1) + '];bufferStarvationDelay:' + fragLevelNextLoadedDelay.toFixed(1) + '<' + fragLoadedDelay.toFixed(1) + ':' + bufferStarvationDelay.toFixed(1));
            // force next load level in auto mode
            hls.nextLoadLevel = nextLoadLevel;
            // update bw estimate for this fragment before cancelling load (this will help reducing the bw)
            this._bwEstimator.sample(requestDelay, stats.loaded);
            // abort fragment loading
            loader.abort();
            // stop abandon rules timer
            this.clearTimer();
            hls.trigger(events["a" /* default */].FRAG_LOAD_EMERGENCY_ABORTED, { frag: frag, stats: stats });
          }
        }
      }
    }
  };

  AbrController.prototype.onFragLoaded = function onFragLoaded(data) {
    var frag = data.frag;
    if (frag.type === 'main' && !isNaN(frag.sn)) {
      // stop monitoring bw once frag loaded
      this.clearTimer();
      // store level id after successful fragment load
      this.lastLoadedFragLevel = frag.level;
      // reset forced auto level value so that next level will be selected
      this._nextAutoLevel = -1;

      // compute level average bitrate
      if (this.hls.config.abrMaxWithRealBitrate) {
        var level = this.hls.levels[frag.level];
        var loadedBytes = (level.loaded ? level.loaded.bytes : 0) + data.stats.loaded;
        var loadedDuration = (level.loaded ? level.loaded.duration : 0) + data.frag.duration;
        level.loaded = { bytes: loadedBytes, duration: loadedDuration };
        level.realBitrate = Math.round(8 * loadedBytes / loadedDuration);
      }
      // if fragment has been loaded to perform a bitrate test,
      if (data.frag.bitrateTest) {
        var stats = data.stats;
        stats.tparsed = stats.tbuffered = stats.tload;
        this.onFragBuffered(data);
      }
    }
  };

  AbrController.prototype.onFragBuffered = function onFragBuffered(data) {
    var stats = data.stats;
    var frag = data.frag;
    // only update stats on first frag buffering
    // if same frag is loaded multiple times, it might be in browser cache, and loaded quickly
    // and leading to wrong bw estimation
    // on bitrate test, also only update stats once (if tload = tbuffered == on FRAG_LOADED)
    if (stats.aborted !== true && frag.type === 'main' && !isNaN(frag.sn) && (!frag.bitrateTest || stats.tload === stats.tbuffered)) {
      // use tparsed-trequest instead of tbuffered-trequest to compute fragLoadingProcessing; rationale is that  buffer appending only happens once media is attached
      // in case we use config.startFragPrefetch while media is not attached yet, fragment might be parsed while media not attached yet, but it will only be buffered on media attached
      // as a consequence it could happen really late in the process. meaning that appending duration might appears huge ... leading to underestimated throughput estimation
      var fragLoadingProcessingMs = stats.tparsed - stats.trequest;
      logger["b" /* logger */].log('latency/loading/parsing/append/kbps:' + Math.round(stats.tfirst - stats.trequest) + '/' + Math.round(stats.tload - stats.tfirst) + '/' + Math.round(stats.tparsed - stats.tload) + '/' + Math.round(stats.tbuffered - stats.tparsed) + '/' + Math.round(8 * stats.loaded / (stats.tbuffered - stats.trequest)));
      this._bwEstimator.sample(fragLoadingProcessingMs, stats.loaded);
      stats.bwEstimate = this._bwEstimator.getEstimate();
      // if fragment has been loaded to perform a bitrate test, (hls.startLevel = -1), store bitrate test delay duration
      if (frag.bitrateTest) {
        this.bitrateTestDelay = fragLoadingProcessingMs / 1000;
      } else {
        this.bitrateTestDelay = 0;
      }
    }
  };

  AbrController.prototype.onError = function onError(data) {
    // stop timer in case of frag loading error
    switch (data.details) {
      case errors["a" /* ErrorDetails */].FRAG_LOAD_ERROR:
      case errors["a" /* ErrorDetails */].FRAG_LOAD_TIMEOUT:
        this.clearTimer();
        break;
      default:
        break;
    }
  };

  AbrController.prototype.clearTimer = function clearTimer() {
    clearInterval(this.timer);
    this.timer = null;
  };

  // return next auto level


  AbrController.prototype._findBestLevel = function _findBestLevel(currentLevel, currentFragDuration, currentBw, minAutoLevel, maxAutoLevel, maxFetchDuration, bwFactor, bwUpFactor, levels) {
    for (var i = maxAutoLevel; i >= minAutoLevel; i--) {
      var levelInfo = levels[i],
          levelDetails = levelInfo.details,
          avgDuration = levelDetails ? levelDetails.totalduration / levelDetails.fragments.length : currentFragDuration,
          live = levelDetails ? levelDetails.live : false,
          adjustedbw = void 0;
      // follow algorithm captured from stagefright :
      // https://android.googlesource.com/platform/frameworks/av/+/master/media/libstagefright/httplive/LiveSession.cpp
      // Pick the highest bandwidth stream below or equal to estimated bandwidth.
      // consider only 80% of the available bandwidth, but if we are switching up,
      // be even more conservative (70%) to avoid overestimating and immediately
      // switching back.
      if (i <= currentLevel) {
        adjustedbw = bwFactor * currentBw;
      } else {
        adjustedbw = bwUpFactor * currentBw;
      }

      var bitrate = levels[i].realBitrate ? Math.max(levels[i].realBitrate, levels[i].bitrate) : levels[i].bitrate,
          fetchDuration = bitrate * avgDuration / adjustedbw;

      logger["b" /* logger */].trace('level/adjustedbw/bitrate/avgDuration/maxFetchDuration/fetchDuration: ' + i + '/' + Math.round(adjustedbw) + '/' + bitrate + '/' + avgDuration + '/' + maxFetchDuration + '/' + fetchDuration);
      // if adjusted bw is greater than level bitrate AND
      if (adjustedbw > bitrate && (
      // fragment fetchDuration unknown OR live stream OR fragment fetchDuration less than max allowed fetch duration, then this level matches
      // we don't account for max Fetch Duration for live streams, this is to avoid switching down when near the edge of live sliding window ...
      // special case to support startLevel = -1 (bitrateTest) on live streams : in that case we should not exit loop so that _findBestLevel will return -1
      !fetchDuration || live && !this.bitrateTestDelay || fetchDuration < maxFetchDuration)) {
        // as we are looping from highest to lowest, this will return the best achievable quality level
        return i;
      }
    }
    // not enough time budget even with quality level 0 ... rebuffering might happen
    return -1;
  };

  abr_controller__createClass(AbrController, [{
    key: 'nextAutoLevel',
    get: function get() {
      var forcedAutoLevel = this._nextAutoLevel;
      var bwEstimator = this._bwEstimator;
      // in case next auto level has been forced, and bw not available or not reliable, return forced value
      if (forcedAutoLevel !== -1 && (!bwEstimator || !bwEstimator.canEstimate())) {
        return forcedAutoLevel;
      }

      // compute next level using ABR logic
      var nextABRAutoLevel = this._nextABRAutoLevel;
      // if forced auto level has been defined, use it to cap ABR computed quality level
      if (forcedAutoLevel !== -1) {
        nextABRAutoLevel = Math.min(forcedAutoLevel, nextABRAutoLevel);
      }

      return nextABRAutoLevel;
    },
    set: function set(nextLevel) {
      this._nextAutoLevel = nextLevel;
    }
  }, {
    key: '_nextABRAutoLevel',
    get: function get() {
      var hls = this.hls,
          maxAutoLevel = hls.maxAutoLevel,
          levels = hls.levels,
          config = hls.config,
          minAutoLevel = hls.minAutoLevel;
      var video = hls.media,
          currentLevel = this.lastLoadedFragLevel,
          currentFragDuration = this.fragCurrent ? this.fragCurrent.duration : 0,
          pos = video ? video.currentTime : 0,

      // playbackRate is the absolute value of the playback rate; if video.playbackRate is 0, we use 1 to load as
      // if we're playing back at the normal rate.
      playbackRate = video && video.playbackRate !== 0 ? Math.abs(video.playbackRate) : 1.0,
          avgbw = this._bwEstimator ? this._bwEstimator.getEstimate() : config.abrEwmaDefaultEstimate,

      // bufferStarvationDelay is the wall-clock time left until the playback buffer is exhausted.
      bufferStarvationDelay = (BufferHelper.bufferInfo(video, pos, config.maxBufferHole).end - pos) / playbackRate;

      // First, look to see if we can find a level matching with our avg bandwidth AND that could also guarantee no rebuffering at all
      var bestLevel = this._findBestLevel(currentLevel, currentFragDuration, avgbw, minAutoLevel, maxAutoLevel, bufferStarvationDelay, config.abrBandWidthFactor, config.abrBandWidthUpFactor, levels);
      if (bestLevel >= 0) {
        return bestLevel;
      } else {
        logger["b" /* logger */].trace('rebuffering expected to happen, lets try to find a quality level minimizing the rebuffering');
        // not possible to get rid of rebuffering ... let's try to find level that will guarantee less than maxStarvationDelay of rebuffering
        // if no matching level found, logic will return 0
        var maxStarvationDelay = currentFragDuration ? Math.min(currentFragDuration, config.maxStarvationDelay) : config.maxStarvationDelay,
            bwFactor = config.abrBandWidthFactor,
            bwUpFactor = config.abrBandWidthUpFactor;
        if (bufferStarvationDelay === 0) {
          // in case buffer is empty, let's check if previous fragment was loaded to perform a bitrate test
          var bitrateTestDelay = this.bitrateTestDelay;
          if (bitrateTestDelay) {
            // if it is the case, then we need to adjust our max starvation delay using maxLoadingDelay config value
            // max video loading delay used in  automatic start level selection :
            // in that mode ABR controller will ensure that video loading time (ie the time to fetch the first fragment at lowest quality level +
            // the time to fetch the fragment at the appropriate quality level is less than ```maxLoadingDelay``` )
            // cap maxLoadingDelay and ensure it is not bigger 'than bitrate test' frag duration
            var maxLoadingDelay = currentFragDuration ? Math.min(currentFragDuration, config.maxLoadingDelay) : config.maxLoadingDelay;
            maxStarvationDelay = maxLoadingDelay - bitrateTestDelay;
            logger["b" /* logger */].trace('bitrate test took ' + Math.round(1000 * bitrateTestDelay) + 'ms, set first fragment max fetchDuration to ' + Math.round(1000 * maxStarvationDelay) + ' ms');
            // don't use conservative factor on bitrate test
            bwFactor = bwUpFactor = 1;
          }
        }
        bestLevel = this._findBestLevel(currentLevel, currentFragDuration, avgbw, minAutoLevel, maxAutoLevel, bufferStarvationDelay + maxStarvationDelay, bwFactor, bwUpFactor, levels);
        return Math.max(bestLevel, 0);
      }
    }
  }]);

  return AbrController;
}(event_handler);

/* harmony default export */ var abr_controller = (abr_controller_AbrController);
// CONCATENATED MODULE: ./src/controller/buffer-controller.js
function buffer_controller__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function buffer_controller__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function buffer_controller__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * Buffer Controller
*/







var buffer_controller_MediaSource = getMediaSource();

var buffer_controller_BufferController = function (_EventHandler) {
  buffer_controller__inherits(BufferController, _EventHandler);

  function BufferController(hls) {
    buffer_controller__classCallCheck(this, BufferController);

    // the value that we have set mediasource.duration to
    // (the actual duration may be tweaked slighly by the browser)
    var _this = buffer_controller__possibleConstructorReturn(this, _EventHandler.call(this, hls, events["a" /* default */].MEDIA_ATTACHING, events["a" /* default */].MEDIA_DETACHING, events["a" /* default */].MANIFEST_PARSED, events["a" /* default */].BUFFER_RESET, events["a" /* default */].BUFFER_APPENDING, events["a" /* default */].BUFFER_CODECS, events["a" /* default */].BUFFER_EOS, events["a" /* default */].BUFFER_FLUSHING, events["a" /* default */].LEVEL_PTS_UPDATED, events["a" /* default */].LEVEL_UPDATED));

    _this._msDuration = null;
    // the value that we want to set mediaSource.duration to
    _this._levelDuration = null;
    // current stream state: true - for live broadcast, false - for VoD content
    _this._live = null;
    // cache the self generated object url to detect hijack of video tag
    _this._objectUrl = null;

    // Source Buffer listeners
    _this.onsbue = _this.onSBUpdateEnd.bind(_this);
    _this.onsbe = _this.onSBUpdateError.bind(_this);
    _this.pendingTracks = {};
    _this.tracks = {};
    return _this;
  }

  BufferController.prototype.destroy = function destroy() {
    event_handler.prototype.destroy.call(this);
  };

  BufferController.prototype.onLevelPtsUpdated = function onLevelPtsUpdated(data) {
    var type = data.type;
    var audioTrack = this.tracks.audio;

    // Adjusting `SourceBuffer.timestampOffset` (desired point in the timeline where the next frames should be appended)
    // in Chrome browser when we detect MPEG audio container and time delta between level PTS and `SourceBuffer.timestampOffset`
    // is greater than 100ms (this is enough to handle seek for VOD or level change for LIVE videos). At the time of change we issue
    // `SourceBuffer.abort()` and adjusting `SourceBuffer.timestampOffset` if `SourceBuffer.updating` is false or awaiting `updateend`
    // event if SB is in updating state.
    // More info here: https://github.com/video-dev/hls.js/issues/332#issuecomment-257986486

    if (type === 'audio' && audioTrack && audioTrack.container === 'audio/mpeg') {
      // Chrome audio mp3 track
      var audioBuffer = this.sourceBuffer.audio;
      var delta = Math.abs(audioBuffer.timestampOffset - data.start);

      // adjust timestamp offset if time delta is greater than 100ms
      if (delta > 0.1) {
        var updating = audioBuffer.updating;

        try {
          audioBuffer.abort();
        } catch (err) {
          updating = true;
          logger["b" /* logger */].warn('can not abort audio buffer: ' + err);
        }

        if (!updating) {
          logger["b" /* logger */].warn('change mpeg audio timestamp offset from ' + audioBuffer.timestampOffset + ' to ' + data.start);
          audioBuffer.timestampOffset = data.start;
        } else {
          this.audioTimestampOffset = data.start;
        }
      }
    }
  };

  BufferController.prototype.onManifestParsed = function onManifestParsed(data) {
    var audioExpected = data.audio,
        videoExpected = data.video || data.levels.length && data.altAudio,
        sourceBufferNb = 0;
    // in case of alt audio 2 BUFFER_CODECS events will be triggered, one per stream controller
    // sourcebuffers will be created all at once when the expected nb of tracks will be reached
    // in case alt audio is not used, only one BUFFER_CODEC event will be fired from main stream controller
    // it will contain the expected nb of source buffers, no need to compute it
    if (data.altAudio && (audioExpected || videoExpected)) {
      sourceBufferNb = (audioExpected ? 1 : 0) + (videoExpected ? 1 : 0);
      logger["b" /* logger */].log(sourceBufferNb + ' sourceBuffer(s) expected');
    }
    this.sourceBufferNb = sourceBufferNb;
  };

  BufferController.prototype.onMediaAttaching = function onMediaAttaching(data) {
    var media = this.media = data.media;
    if (media) {
      // setup the media source
      var ms = this.mediaSource = new buffer_controller_MediaSource();
      // Media Source listeners
      this.onmso = this.onMediaSourceOpen.bind(this);
      this.onmse = this.onMediaSourceEnded.bind(this);
      this.onmsc = this.onMediaSourceClose.bind(this);
      ms.addEventListener('sourceopen', this.onmso);
      ms.addEventListener('sourceended', this.onmse);
      ms.addEventListener('sourceclose', this.onmsc);
      // link video and media Source
      media.src = window.URL.createObjectURL(ms);
      // cache the locally generated object url
      this._objectUrl = media.src;
    }
  };

  BufferController.prototype.onMediaDetaching = function onMediaDetaching() {
    logger["b" /* logger */].log('media source detaching');
    var ms = this.mediaSource;
    if (ms) {
      if (ms.readyState === 'open') {
        try {
          // endOfStream could trigger exception if any sourcebuffer is in updating state
          // we don't really care about checking sourcebuffer state here,
          // as we are anyway detaching the MediaSource
          // let's just avoid this exception to propagate
          ms.endOfStream();
        } catch (err) {
          logger["b" /* logger */].warn('onMediaDetaching:' + err.message + ' while calling endOfStream');
        }
      }
      ms.removeEventListener('sourceopen', this.onmso);
      ms.removeEventListener('sourceended', this.onmse);
      ms.removeEventListener('sourceclose', this.onmsc);

      // Detach properly the MediaSource from the HTMLMediaElement as
      // suggested in https://github.com/w3c/media-source/issues/53.
      if (this.media) {
        window.URL.revokeObjectURL(this._objectUrl);

        // clean up video tag src only if it's our own url. some external libraries might
        // hijack the video tag and change its 'src' without destroying the Hls instance first
        if (this.media.src === this._objectUrl) {
          this.media.removeAttribute('src');
          this.media.load();
        } else {
          logger["b" /* logger */].warn('media.src was changed by a third party - skip cleanup');
        }
      }

      this.mediaSource = null;
      this.media = null;
      this._objectUrl = null;
      this.pendingTracks = {};
      this.tracks = {};
      this.sourceBuffer = {};
      this.flushRange = [];
      this.segments = [];
      this.appended = 0;
    }
    this.onmso = this.onmse = this.onmsc = null;
    this.hls.trigger(events["a" /* default */].MEDIA_DETACHED);
  };

  BufferController.prototype.onMediaSourceOpen = function onMediaSourceOpen() {
    logger["b" /* logger */].log('media source opened');
    this.hls.trigger(events["a" /* default */].MEDIA_ATTACHED, { media: this.media });
    var mediaSource = this.mediaSource;
    if (mediaSource) {
      // once received, don't listen anymore to sourceopen event
      mediaSource.removeEventListener('sourceopen', this.onmso);
    }
    this.checkPendingTracks();
  };

  BufferController.prototype.checkPendingTracks = function checkPendingTracks() {
    // if any buffer codecs pending, check if we have enough to create sourceBuffers
    var pendingTracks = this.pendingTracks,
        pendingTracksNb = Object.keys(pendingTracks).length;
    // if any pending tracks and (if nb of pending tracks gt or equal than expected nb or if unknown expected nb)
    if (pendingTracksNb && (this.sourceBufferNb <= pendingTracksNb || this.sourceBufferNb === 0)) {
      // ok, let's create them now !
      this.createSourceBuffers(pendingTracks);
      this.pendingTracks = {};
      // append any pending segments now !
      this.doAppending();
    }
  };

  BufferController.prototype.onMediaSourceClose = function onMediaSourceClose() {
    logger["b" /* logger */].log('media source closed');
  };

  BufferController.prototype.onMediaSourceEnded = function onMediaSourceEnded() {
    logger["b" /* logger */].log('media source ended');
  };

  BufferController.prototype.onSBUpdateEnd = function onSBUpdateEnd() {
    // update timestampOffset
    if (this.audioTimestampOffset) {
      var audioBuffer = this.sourceBuffer.audio;
      logger["b" /* logger */].warn('change mpeg audio timestamp offset from ' + audioBuffer.timestampOffset + ' to ' + this.audioTimestampOffset);
      audioBuffer.timestampOffset = this.audioTimestampOffset;
      delete this.audioTimestampOffset;
    }

    if (this._needsFlush) {
      this.doFlush();
    }

    if (this._needsEos) {
      this.checkEos();
    }

    this.appending = false;
    var parent = this.parent;
    // count nb of pending segments waiting for appending on this sourcebuffer
    var pending = this.segments.reduce(function (counter, segment) {
      return segment.parent === parent ? counter + 1 : counter;
    }, 0);

    // this.sourceBuffer is better to use than media.buffered as it is closer to the PTS data from the fragments
    var timeRanges = {};
    var sourceBuffer = this.sourceBuffer;
    for (var streamType in sourceBuffer) {
      timeRanges[streamType] = sourceBuffer[streamType].buffered;
    }

    this.hls.trigger(events["a" /* default */].BUFFER_APPENDED, { parent: parent, pending: pending, timeRanges: timeRanges });
    // don't append in flushing mode
    if (!this._needsFlush) {
      this.doAppending();
    }

    this.updateMediaElementDuration();
  };

  BufferController.prototype.onSBUpdateError = function onSBUpdateError(event) {
    logger["b" /* logger */].error('sourceBuffer error:', event);
    // according to http://www.w3.org/TR/media-source/#sourcebuffer-append-error
    // this error might not always be fatal (it is fatal if decode error is set, in that case
    // it will be followed by a mediaElement error ...)
    this.hls.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].MEDIA_ERROR, details: errors["a" /* ErrorDetails */].BUFFER_APPENDING_ERROR, fatal: false });
    // we don't need to do more than that, as accordin to the spec, updateend will be fired just after
  };

  BufferController.prototype.onBufferReset = function onBufferReset() {
    var sourceBuffer = this.sourceBuffer;
    for (var type in sourceBuffer) {
      var sb = sourceBuffer[type];
      try {
        this.mediaSource.removeSourceBuffer(sb);
        sb.removeEventListener('updateend', this.onsbue);
        sb.removeEventListener('error', this.onsbe);
      } catch (err) {}
    }
    this.sourceBuffer = {};
    this.flushRange = [];
    this.segments = [];
    this.appended = 0;
  };

  BufferController.prototype.onBufferCodecs = function onBufferCodecs(tracks) {
    // if source buffer(s) not created yet, appended buffer tracks in this.pendingTracks
    // if sourcebuffers already created, do nothing ...
    if (Object.keys(this.sourceBuffer).length === 0) {
      for (var trackName in tracks) {
        this.pendingTracks[trackName] = tracks[trackName];
      }var mediaSource = this.mediaSource;
      if (mediaSource && mediaSource.readyState === 'open') {
        // try to create sourcebuffers if mediasource opened
        this.checkPendingTracks();
      }
    }
  };

  BufferController.prototype.createSourceBuffers = function createSourceBuffers(tracks) {
    var sourceBuffer = this.sourceBuffer,
        mediaSource = this.mediaSource;

    for (var trackName in tracks) {
      if (!sourceBuffer[trackName]) {
        var track = tracks[trackName];
        // use levelCodec as first priority
        var codec = track.levelCodec || track.codec;
        var mimeType = track.container + ';codecs=' + codec;
        logger["b" /* logger */].log('creating sourceBuffer(' + mimeType + ')');
        try {
          var sb = sourceBuffer[trackName] = mediaSource.addSourceBuffer(mimeType);
          sb.addEventListener('updateend', this.onsbue);
          sb.addEventListener('error', this.onsbe);
          this.tracks[trackName] = { codec: codec, container: track.container };
          track.buffer = sb;
        } catch (err) {
          logger["b" /* logger */].error('error while trying to add sourceBuffer:' + err.message);
          this.hls.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].MEDIA_ERROR, details: errors["a" /* ErrorDetails */].BUFFER_ADD_CODEC_ERROR, fatal: false, err: err, mimeType: mimeType });
        }
      }
    }
    this.hls.trigger(events["a" /* default */].BUFFER_CREATED, { tracks: tracks });
  };

  BufferController.prototype.onBufferAppending = function onBufferAppending(data) {
    if (!this._needsFlush) {
      if (!this.segments) {
        this.segments = [data];
      } else {
        this.segments.push(data);
      }

      this.doAppending();
    }
  };

  BufferController.prototype.onBufferAppendFail = function onBufferAppendFail(data) {
    logger["b" /* logger */].error('sourceBuffer error:', data.event);
    // according to http://www.w3.org/TR/media-source/#sourcebuffer-append-error
    // this error might not always be fatal (it is fatal if decode error is set, in that case
    // it will be followed by a mediaElement error ...)
    this.hls.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].MEDIA_ERROR, details: errors["a" /* ErrorDetails */].BUFFER_APPENDING_ERROR, fatal: false });
  };

  // on BUFFER_EOS mark matching sourcebuffer(s) as ended and trigger checkEos()


  BufferController.prototype.onBufferEos = function onBufferEos(data) {
    var sb = this.sourceBuffer;
    var dataType = data.type;
    for (var type in sb) {
      if (!dataType || type === dataType) {
        if (!sb[type].ended) {
          sb[type].ended = true;
          logger["b" /* logger */].log(type + ' sourceBuffer now EOS');
        }
      }
    }
    this.checkEos();
  };

  // if all source buffers are marked as ended, signal endOfStream() to MediaSource.


  BufferController.prototype.checkEos = function checkEos() {
    var sb = this.sourceBuffer,
        mediaSource = this.mediaSource;
    if (!mediaSource || mediaSource.readyState !== 'open') {
      this._needsEos = false;
      return;
    }
    for (var type in sb) {
      var sbobj = sb[type];
      if (!sbobj.ended) {
        return;
      }

      if (sbobj.updating) {
        this._needsEos = true;
        return;
      }
    }
    logger["b" /* logger */].log('all media data available, signal endOfStream() to MediaSource and stop loading fragment');
    // Notify the media element that it now has all of the media data
    try {
      mediaSource.endOfStream();
    } catch (e) {
      logger["b" /* logger */].warn('exception while calling mediaSource.endOfStream()');
    }
    this._needsEos = false;
  };

  BufferController.prototype.onBufferFlushing = function onBufferFlushing(data) {
    this.flushRange.push({ start: data.startOffset, end: data.endOffset, type: data.type });
    // attempt flush immediately
    this.flushBufferCounter = 0;
    this.doFlush();
  };

  BufferController.prototype.onLevelUpdated = function onLevelUpdated(_ref) {
    var details = _ref.details;

    if (details.fragments.length > 0) {
      this._levelDuration = details.totalduration + details.fragments[0].start;
      this._live = details.live;
      this.updateMediaElementDuration();
    }
  };

  /**
   * Update Media Source duration to current level duration or override to Infinity if configuration parameter
   * 'liveDurationInfinity` is set to `true`
   * More details: https://github.com/video-dev/hls.js/issues/355
   */


  BufferController.prototype.updateMediaElementDuration = function updateMediaElementDuration() {
    var config = this.hls.config;

    var duration = void 0;

    if (this._levelDuration === null || !this.media || !this.mediaSource || !this.sourceBuffer || this.media.readyState === 0 || this.mediaSource.readyState !== 'open') {
      return;
    }

    for (var type in this.sourceBuffer) {
      if (this.sourceBuffer[type].updating === true) {
        // can't set duration whilst a buffer is updating
        return;
      }
    }

    duration = this.media.duration;
    // initialise to the value that the media source is reporting
    if (this._msDuration === null) {
      this._msDuration = this.mediaSource.duration;
    }

    if (this._live === true && config.liveDurationInfinity === true) {
      // Override duration to Infinity
      logger["b" /* logger */].log('Media Source duration is set to Infinity');
      this._msDuration = this.mediaSource.duration = Infinity;
    } else if (this._levelDuration > this._msDuration && this._levelDuration > duration || duration === Infinity || isNaN(duration)) {
      // levelDuration was the last value we set.
      // not using mediaSource.duration as the browser may tweak this value
      // only update Media Source duration if its value increase, this is to avoid
      // flushing already buffered portion when switching between quality level
      logger["b" /* logger */].log('Updating Media Source duration to ' + this._levelDuration.toFixed(3));
      this._msDuration = this.mediaSource.duration = this._levelDuration;
    }
  };

  BufferController.prototype.doFlush = function doFlush() {
    // loop through all buffer ranges to flush
    while (this.flushRange.length) {
      var range = this.flushRange[0];
      // flushBuffer will abort any buffer append in progress and flush Audio/Video Buffer
      if (this.flushBuffer(range.start, range.end, range.type)) {
        // range flushed, remove from flush array
        this.flushRange.shift();
        this.flushBufferCounter = 0;
      } else {
        this._needsFlush = true;
        // avoid looping, wait for SB update end to retrigger a flush
        return;
      }
    }
    if (this.flushRange.length === 0) {
      // everything flushed
      this._needsFlush = false;

      // let's recompute this.appended, which is used to avoid flush looping
      var appended = 0;
      var sourceBuffer = this.sourceBuffer;
      try {
        for (var type in sourceBuffer) {
          appended += sourceBuffer[type].buffered.length;
        }
      } catch (error) {
        // error could be thrown while accessing buffered, in case sourcebuffer has already been removed from MediaSource
        // this is harmess at this stage, catch this to avoid reporting an internal exception
        logger["b" /* logger */].error('error while accessing sourceBuffer.buffered');
      }
      this.appended = appended;
      this.hls.trigger(events["a" /* default */].BUFFER_FLUSHED);
    }
  };

  BufferController.prototype.doAppending = function doAppending() {
    var hls = this.hls,
        sourceBuffer = this.sourceBuffer,
        segments = this.segments;
    if (Object.keys(sourceBuffer).length) {
      if (this.media.error) {
        this.segments = [];
        logger["b" /* logger */].error('trying to append although a media error occured, flush segment and abort');
        return;
      }
      if (this.appending) {
        // logger.log(`sb appending in progress`);
        return;
      }
      if (segments && segments.length) {
        var segment = segments.shift();
        try {
          var type = segment.type,
              sb = sourceBuffer[type];
          if (sb) {
            if (!sb.updating) {
              // reset sourceBuffer ended flag before appending segment
              sb.ended = false;
              // logger.log(`appending ${segment.content} ${type} SB, size:${segment.data.length}, ${segment.parent}`);
              this.parent = segment.parent;
              sb.appendBuffer(segment.data);
              this.appendError = 0;
              this.appended++;
              this.appending = true;
            } else {
              segments.unshift(segment);
            }
          } else {
            // in case we don't have any source buffer matching with this segment type,
            // it means that Mediasource fails to create sourcebuffer
            // discard this segment, and trigger update end
            this.onSBUpdateEnd();
          }
        } catch (err) {
          // in case any error occured while appending, put back segment in segments table
          logger["b" /* logger */].error('error while trying to append buffer:' + err.message);
          segments.unshift(segment);
          var event = { type: errors["b" /* ErrorTypes */].MEDIA_ERROR, parent: segment.parent };
          if (err.code !== 22) {
            if (this.appendError) {
              this.appendError++;
            } else {
              this.appendError = 1;
            }

            event.details = errors["a" /* ErrorDetails */].BUFFER_APPEND_ERROR;
            /* with UHD content, we could get loop of quota exceeded error until
              browser is able to evict some data from sourcebuffer. retrying help recovering this
            */
            if (this.appendError > hls.config.appendErrorMaxRetry) {
              logger["b" /* logger */].log('fail ' + hls.config.appendErrorMaxRetry + ' times to append segment in sourceBuffer');
              segments = [];
              event.fatal = true;
              hls.trigger(events["a" /* default */].ERROR, event);
            } else {
              event.fatal = false;
              hls.trigger(events["a" /* default */].ERROR, event);
            }
          } else {
            // QuotaExceededError: http://www.w3.org/TR/html5/infrastructure.html#quotaexceedederror
            // let's stop appending any segments, and report BUFFER_FULL_ERROR error
            this.segments = [];
            event.details = errors["a" /* ErrorDetails */].BUFFER_FULL_ERROR;
            event.fatal = false;
            hls.trigger(events["a" /* default */].ERROR, event);
          }
        }
      }
    }
  };

  /*
    flush specified buffered range,
    return true once range has been flushed.
    as sourceBuffer.remove() is asynchronous, flushBuffer will be retriggered on sourceBuffer update end
  */


  BufferController.prototype.flushBuffer = function flushBuffer(startOffset, endOffset, typeIn) {
    var sb = void 0,
        i = void 0,
        bufStart = void 0,
        bufEnd = void 0,
        flushStart = void 0,
        flushEnd = void 0,
        sourceBuffer = this.sourceBuffer;
    if (Object.keys(sourceBuffer).length) {
      logger["b" /* logger */].log('flushBuffer,pos/start/end: ' + this.media.currentTime.toFixed(3) + '/' + startOffset + '/' + endOffset);
      // safeguard to avoid infinite looping : don't try to flush more than the nb of appended segments
      if (this.flushBufferCounter < this.appended) {
        for (var type in sourceBuffer) {
          // check if sourcebuffer type is defined (typeIn): if yes, let's only flush this one
          // if no, let's flush all sourcebuffers
          if (typeIn && type !== typeIn) {
            continue;
          }

          sb = sourceBuffer[type];
          // we are going to flush buffer, mark source buffer as 'not ended'
          sb.ended = false;
          if (!sb.updating) {
            try {
              for (i = 0; i < sb.buffered.length; i++) {
                bufStart = sb.buffered.start(i);
                bufEnd = sb.buffered.end(i);
                // workaround firefox not able to properly flush multiple buffered range.
                if (navigator.userAgent.toLowerCase().indexOf('firefox') !== -1 && endOffset === Number.POSITIVE_INFINITY) {
                  flushStart = startOffset;
                  flushEnd = endOffset;
                } else {
                  flushStart = Math.max(bufStart, startOffset);
                  flushEnd = Math.min(bufEnd, endOffset);
                }
                /* sometimes sourcebuffer.remove() does not flush
                   the exact expected time range.
                   to avoid rounding issues/infinite loop,
                   only flush buffer range of length greater than 500ms.
                */
                if (Math.min(flushEnd, bufEnd) - flushStart > 0.5) {
                  this.flushBufferCounter++;
                  logger["b" /* logger */].log('flush ' + type + ' [' + flushStart + ',' + flushEnd + '], of [' + bufStart + ',' + bufEnd + '], pos:' + this.media.currentTime);
                  sb.remove(flushStart, flushEnd);
                  return false;
                }
              }
            } catch (e) {
              logger["b" /* logger */].warn('exception while accessing sourcebuffer, it might have been removed from MediaSource');
            }
          } else {
            // logger.log('abort ' + type + ' append in progress');
            // this will abort any appending in progress
            // sb.abort();
            logger["b" /* logger */].warn('cannot flush, sb updating in progress');
            return false;
          }
        }
      } else {
        logger["b" /* logger */].warn('abort flushing too many retries');
      }
      logger["b" /* logger */].log('buffer flushed');
    }
    // everything flushed !
    return true;
  };

  return BufferController;
}(event_handler);

/* harmony default export */ var buffer_controller = (buffer_controller_BufferController);
// CONCATENATED MODULE: ./src/controller/cap-level-controller.js
var cap_level_controller__createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function cap_level_controller__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function cap_level_controller__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function cap_level_controller__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * cap stream level to media size dimension controller
*/




var cap_level_controller_CapLevelController = function (_EventHandler) {
  cap_level_controller__inherits(CapLevelController, _EventHandler);

  function CapLevelController(hls) {
    cap_level_controller__classCallCheck(this, CapLevelController);

    var _this = cap_level_controller__possibleConstructorReturn(this, _EventHandler.call(this, hls, events["a" /* default */].FPS_DROP_LEVEL_CAPPING, events["a" /* default */].MEDIA_ATTACHING, events["a" /* default */].MANIFEST_PARSED, events["a" /* default */].BUFFER_CODECS));

    _this.autoLevelCapping = Number.POSITIVE_INFINITY;
    _this.firstLevel = null;
    _this.levels = [];
    _this.media = null;
    _this.restrictedLevels = [];
    _this.timer = null;
    return _this;
  }

  CapLevelController.prototype.destroy = function destroy() {
    if (this.hls.config.capLevelToPlayerSize) {
      this.media = null;
      this._stopCapping();
    }
  };

  CapLevelController.prototype.onFpsDropLevelCapping = function onFpsDropLevelCapping(data) {
    // Don't add a restricted level more than once
    if (CapLevelController.isLevelAllowed(data.droppedLevel, this.restrictedLevels)) {
      this.restrictedLevels.push(data.droppedLevel);
    }
  };

  CapLevelController.prototype.onMediaAttaching = function onMediaAttaching(data) {
    this.media = data.media instanceof window.HTMLVideoElement ? data.media : null;
  };

  CapLevelController.prototype.onManifestParsed = function onManifestParsed(data) {
    var hls = this.hls;
    this.restrictedLevels = [];
    this.levels = data.levels;
    this.firstLevel = data.firstLevel;
    if (hls.config.capLevelToPlayerSize && (data.video || data.levels.length && data.altAudio)) {
      // Start capping immediately if the manifest has signaled video codecs
      this._startCapping();
    }
  };

  // Only activate capping when playing a video stream; otherwise, multi-bitrate audio-only streams will be restricted
  // to the first level


  CapLevelController.prototype.onBufferCodecs = function onBufferCodecs(data) {
    var hls = this.hls;
    if (hls.config.capLevelToPlayerSize && data.video) {
      // If the manifest did not signal a video codec capping has been deferred until we're certain video is present
      this._startCapping();
    }
  };

  CapLevelController.prototype.onLevelsUpdated = function onLevelsUpdated(data) {
    this.levels = data.levels;
  };

  CapLevelController.prototype.detectPlayerSize = function detectPlayerSize() {
    if (this.media) {
      var levelsLength = this.levels ? this.levels.length : 0;
      if (levelsLength) {
        var hls = this.hls;
        hls.autoLevelCapping = this.getMaxLevel(levelsLength - 1);
        if (hls.autoLevelCapping > this.autoLevelCapping) {
          // if auto level capping has a higher value for the previous one, flush the buffer using nextLevelSwitch
          // usually happen when the user go to the fullscreen mode.
          hls.streamController.nextLevelSwitch();
        }
        this.autoLevelCapping = hls.autoLevelCapping;
      }
    }
  };

  /*
  * returns level should be the one with the dimensions equal or greater than the media (player) dimensions (so the video will be downscaled)
  */


  CapLevelController.prototype.getMaxLevel = function getMaxLevel(capLevelIndex) {
    var _this2 = this;

    if (!this.levels) {
      return -1;
    }

    var validLevels = this.levels.filter(function (level, index) {
      return CapLevelController.isLevelAllowed(index, _this2.restrictedLevels) && index <= capLevelIndex;
    });

    return CapLevelController.getMaxLevelByMediaSize(validLevels, this.mediaWidth, this.mediaHeight);
  };

  CapLevelController.prototype._startCapping = function _startCapping() {
    if (this.timer) {
      // Don't reset capping if started twice; this can happen if the manifest signals a video codec
      return;
    }
    this.autoLevelCapping = Number.POSITIVE_INFINITY;
    this.hls.firstLevel = this.getMaxLevel(this.firstLevel);
    clearInterval(this.timer);
    this.timer = setInterval(this.detectPlayerSize.bind(this), 1000);
    this.detectPlayerSize();
  };

  CapLevelController.prototype._stopCapping = function _stopCapping() {
    this.restrictedLevels = [];
    this.firstLevel = null;
    this.autoLevelCapping = Number.POSITIVE_INFINITY;
    if (this.timer) {
      this.timer = clearInterval(this.timer);
      this.timer = null;
    }
  };

  CapLevelController.isLevelAllowed = function isLevelAllowed(level) {
    var restrictedLevels = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    return restrictedLevels.indexOf(level) === -1;
  };

  CapLevelController.getMaxLevelByMediaSize = function getMaxLevelByMediaSize(levels, width, height) {
    if (!levels || levels && !levels.length) {
      return -1;
    }

    // Levels can have the same dimensions but differing bandwidths - since levels are ordered, we can look to the next
    // to determine whether we've chosen the greatest bandwidth for the media's dimensions
    var atGreatestBandiwdth = function atGreatestBandiwdth(curLevel, nextLevel) {
      if (!nextLevel) {
        return true;
      }

      return curLevel.width !== nextLevel.width || curLevel.height !== nextLevel.height;
    };

    // If we run through the loop without breaking, the media's dimensions are greater than every level, so default to
    // the max level
    var maxLevelIndex = levels.length - 1;

    for (var i = 0; i < levels.length; i += 1) {
      var level = levels[i];
      if ((level.width >= width || level.height >= height) && atGreatestBandiwdth(level, levels[i + 1])) {
        maxLevelIndex = i;
        break;
      }
    }

    return maxLevelIndex;
  };

  cap_level_controller__createClass(CapLevelController, [{
    key: 'mediaWidth',
    get: function get() {
      var width = void 0;
      var media = this.media;
      if (media) {
        width = media.width || media.clientWidth || media.offsetWidth;
        width *= CapLevelController.contentScaleFactor;
      }
      return width;
    }
  }, {
    key: 'mediaHeight',
    get: function get() {
      var height = void 0;
      var media = this.media;
      if (media) {
        height = media.height || media.clientHeight || media.offsetHeight;
        height *= CapLevelController.contentScaleFactor;
      }
      return height;
    }
  }], [{
    key: 'contentScaleFactor',
    get: function get() {
      var pixelRatio = 1;
      try {
        pixelRatio = window.devicePixelRatio;
      } catch (e) {}
      return pixelRatio;
    }
  }]);

  return CapLevelController;
}(event_handler);

/* harmony default export */ var cap_level_controller = (cap_level_controller_CapLevelController);
// CONCATENATED MODULE: ./src/controller/fps-controller.js
function fps_controller__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function fps_controller__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function fps_controller__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * FPS Controller
*/





var fps_controller__window = window,
    fps_controller_performance = fps_controller__window.performance;

var fps_controller_FPSController = function (_EventHandler) {
  fps_controller__inherits(FPSController, _EventHandler);

  function FPSController(hls) {
    fps_controller__classCallCheck(this, FPSController);

    return fps_controller__possibleConstructorReturn(this, _EventHandler.call(this, hls, events["a" /* default */].MEDIA_ATTACHING));
  }

  FPSController.prototype.destroy = function destroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.isVideoPlaybackQualityAvailable = false;
  };

  FPSController.prototype.onMediaAttaching = function onMediaAttaching(data) {
    var config = this.hls.config;
    if (config.capLevelOnFPSDrop) {
      var video = this.video = data.media instanceof window.HTMLVideoElement ? data.media : null;
      if (typeof video.getVideoPlaybackQuality === 'function') {
        this.isVideoPlaybackQualityAvailable = true;
      }

      clearInterval(this.timer);
      this.timer = setInterval(this.checkFPSInterval.bind(this), config.fpsDroppedMonitoringPeriod);
    }
  };

  FPSController.prototype.checkFPS = function checkFPS(video, decodedFrames, droppedFrames) {
    var currentTime = fps_controller_performance.now();
    if (decodedFrames) {
      if (this.lastTime) {
        var currentPeriod = currentTime - this.lastTime,
            currentDropped = droppedFrames - this.lastDroppedFrames,
            currentDecoded = decodedFrames - this.lastDecodedFrames,
            droppedFPS = 1000 * currentDropped / currentPeriod,
            hls = this.hls;
        hls.trigger(events["a" /* default */].FPS_DROP, { currentDropped: currentDropped, currentDecoded: currentDecoded, totalDroppedFrames: droppedFrames });
        if (droppedFPS > 0) {
          // logger.log('checkFPS : droppedFPS/decodedFPS:' + droppedFPS/(1000 * currentDecoded / currentPeriod));
          if (currentDropped > hls.config.fpsDroppedMonitoringThreshold * currentDecoded) {
            var currentLevel = hls.currentLevel;
            logger["b" /* logger */].warn('drop FPS ratio greater than max allowed value for currentLevel: ' + currentLevel);
            if (currentLevel > 0 && (hls.autoLevelCapping === -1 || hls.autoLevelCapping >= currentLevel)) {
              currentLevel = currentLevel - 1;
              hls.trigger(events["a" /* default */].FPS_DROP_LEVEL_CAPPING, { level: currentLevel, droppedLevel: hls.currentLevel });
              hls.autoLevelCapping = currentLevel;
              hls.streamController.nextLevelSwitch();
            }
          }
        }
      }
      this.lastTime = currentTime;
      this.lastDroppedFrames = droppedFrames;
      this.lastDecodedFrames = decodedFrames;
    }
  };

  FPSController.prototype.checkFPSInterval = function checkFPSInterval() {
    var video = this.video;
    if (video) {
      if (this.isVideoPlaybackQualityAvailable) {
        var videoPlaybackQuality = video.getVideoPlaybackQuality();
        this.checkFPS(video, videoPlaybackQuality.totalVideoFrames, videoPlaybackQuality.droppedVideoFrames);
      } else {
        this.checkFPS(video, video.webkitDecodedFrameCount, video.webkitDroppedFrameCount);
      }
    }
  };

  return FPSController;
}(event_handler);

/* harmony default export */ var fps_controller = (fps_controller_FPSController);
// CONCATENATED MODULE: ./src/utils/xhr-loader.js
function xhr_loader__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * XHR based logger
*/



var xhr_loader__window = window,
    xhr_loader_performance = xhr_loader__window.performance,
    XMLHttpRequest = xhr_loader__window.XMLHttpRequest;

var xhr_loader_XhrLoader = function () {
  function XhrLoader(config) {
    xhr_loader__classCallCheck(this, XhrLoader);

    if (config && config.xhrSetup) {
      this.xhrSetup = config.xhrSetup;
    }
  }

  XhrLoader.prototype.destroy = function destroy() {
    this.abort();
    this.loader = null;
  };

  XhrLoader.prototype.abort = function abort() {
    var loader = this.loader;
    if (loader && loader.readyState !== 4) {
      this.stats.aborted = true;
      loader.abort();
    }

    window.clearTimeout(this.requestTimeout);
    this.requestTimeout = null;
    window.clearTimeout(this.retryTimeout);
    this.retryTimeout = null;
  };

  XhrLoader.prototype.load = function load(context, config, callbacks) {
    this.context = context;
    this.config = config;
    this.callbacks = callbacks;
    this.stats = { trequest: xhr_loader_performance.now(), retry: 0 };
    this.retryDelay = config.retryDelay;
    this.loadInternal();
  };

  XhrLoader.prototype.loadInternal = function loadInternal() {
    var xhr = void 0,
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
  };

  XhrLoader.prototype.readystatechange = function readystatechange(event) {
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
        stats.tfirst = Math.max(xhr_loader_performance.now(), stats.trequest);
      }

      if (readyState === 4) {
        var status = xhr.status;
        // http status between 200 to 299 are all successful
        if (status >= 200 && status < 300) {
          stats.tload = Math.max(stats.tfirst, xhr_loader_performance.now());
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
            logger["b" /* logger */].error(status + ' while loading ' + context.url);
            this.callbacks.onError({ code: status, text: xhr.statusText }, context, xhr);
          } else {
            // retry
            logger["b" /* logger */].warn(status + ' while loading ' + context.url + ', retrying in ' + this.retryDelay + '...');
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
  };

  XhrLoader.prototype.loadtimeout = function loadtimeout() {
    logger["b" /* logger */].warn('timeout while loading ' + this.context.url);
    this.callbacks.onTimeout(this.stats, this.context, null);
  };

  XhrLoader.prototype.loadprogress = function loadprogress(event) {
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
  };

  return XhrLoader;
}();

/* harmony default export */ var xhr_loader = (xhr_loader_XhrLoader);
// CONCATENATED MODULE: ./src/controller/audio-track-controller.js
var audio_track_controller__createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function audio_track_controller__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function audio_track_controller__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function audio_track_controller__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






/**
 * @class AudioTrackController
 * @implements {EventHandler}
 *
 * Handles main manifest and audio-track metadata loaded,
 * owns and exposes the selectable audio-tracks data-models.
 *
 * Exposes internal interface to select available audio-tracks.
 *
 * Handles errors on loading audio-track playlists. Manages fallback mechanism
 * with redundants tracks (group-IDs).
 *
 * Handles level-loading and group-ID switches for video (fallback on video levels),
 * and eventually adapts the audio-track group-ID to match.
 *
 * @fires AUDIO_TRACK_LOADING
 * @fires AUDIO_TRACK_SWITCHING
 * @fires AUDIO_TRACKS_UPDATED
 * @fires ERROR
 *
 */

var audio_track_controller_AudioTrackController = function (_TaskLoop) {
  audio_track_controller__inherits(AudioTrackController, _TaskLoop);

  function AudioTrackController(hls) {
    audio_track_controller__classCallCheck(this, AudioTrackController);

    /**
     * @private
     * Currently selected index in `tracks`
     * @member {number} trackId
     */
    var _this = audio_track_controller__possibleConstructorReturn(this, _TaskLoop.call(this, hls, events["a" /* default */].MANIFEST_LOADING, events["a" /* default */].MANIFEST_PARSED, events["a" /* default */].AUDIO_TRACK_LOADED, events["a" /* default */].AUDIO_TRACK_SWITCHED, events["a" /* default */].LEVEL_LOADED, events["a" /* default */].ERROR));

    _this.trackId = -1;

    /**
     * @public
     * All tracks available
     * @member {AudioTrack[]}
     */
    _this.tracks = [];

    /**
     * @public
     * List of blacklisted audio track IDs (that have caused failure)
     * @member {number[]}
     */
    _this.trackIdBlacklist = Object.create(null);

    /**
     * @public
     * The currently running group ID for audio
     * (we grab this on manifest-parsed and new level-loaded)
     * @member {string}
     */
    _this.audioGroupId = null;
    return _this;
  }

  /**
   * Reset audio tracks on new manifest loading.
   */


  AudioTrackController.prototype.onManifestLoading = function onManifestLoading() {
    this.tracks = [];
    this.trackId = -1;
  };

  /**
   * Store tracks data from manifest parsed data.
   *
   * Trigger AUDIO_TRACKS_UPDATED event.
   *
   * @param {*} data
   */


  AudioTrackController.prototype.onManifestParsed = function onManifestParsed(data) {
    var tracks = this.tracks = data.audioTracks || [];
    this.hls.trigger(events["a" /* default */].AUDIO_TRACKS_UPDATED, { audioTracks: tracks });
  };

  /**
   * Store track details of loaded track in our data-model.
   *
   * Set-up metadata update interval task for live-mode streams.
   *
   * @param {} data
   */


  AudioTrackController.prototype.onAudioTrackLoaded = function onAudioTrackLoaded(data) {
    if (data.id >= this.tracks.length) {
      logger["b" /* logger */].warn('Invalid audio track id:', data.id);
      return;
    }

    logger["b" /* logger */].log('audioTrack ' + data.id + ' loaded');

    this.tracks[data.id].details = data.details;

    // check if current playlist is a live playlist
    // and if we have already our reload interval setup
    if (data.details.live && !this.hasInterval()) {
      // if live playlist we will have to reload it periodically
      // set reload period to playlist target duration
      var updatePeriodMs = data.details.targetduration * 1000;
      this.setInterval(updatePeriodMs);
    }

    if (!data.details.live && this.hasInterval()) {
      // playlist is not live and timer is scheduled: cancel it
      this.clearInterval();
    }
  };

  /**
   * Update the internal group ID to any audio-track we may have set manually
   * or because of a failure-handling fallback.
   *
   * Quality-levels should update to that group ID in this case.
   *
   * @param {*} data
   */


  AudioTrackController.prototype.onAudioTrackSwitched = function onAudioTrackSwitched(data) {
    var audioGroupId = this.tracks[data.id].groupId;
    if (audioGroupId && this.audioGroupId !== audioGroupId) {
      this.audioGroupId = audioGroupId;
    }
  };

  /**
   * When a level gets loaded, if it has redundant audioGroupIds (in the same ordinality as it's redundant URLs)
   * we are setting our audio-group ID internally to the one set, if it is different from the group ID currently set.
   *
   * If group-ID got update, we re-select the appropriate audio-track with this group-ID matching the currently
   * selected one (based on NAME property).
   *
   * @param {*} data
   */


  AudioTrackController.prototype.onLevelLoaded = function onLevelLoaded(data) {
    // FIXME: crashes because currentLevel is undefined
    // const levelInfo = this.hls.levels[this.hls.currentLevel];

    var levelInfo = this.hls.levels[data.level];

    if (!levelInfo.audioGroupIds) {
      return;
    }

    var audioGroupId = levelInfo.audioGroupIds[levelInfo.urlId];
    if (this.audioGroupId !== audioGroupId) {
      this.audioGroupId = audioGroupId;
      this._selectInitialAudioTrack();
    }
  };

  /**
   * Handle network errors loading audio track manifests
   * and also pausing on any netwok errors.
   *
   * @param {ErrorEventData} data
   */


  AudioTrackController.prototype.onError = function onError(data) {
    // Only handle network errors
    if (data.type !== errors["b" /* ErrorTypes */].NETWORK_ERROR) {
      return;
    }

    // If fatal network error, cancel update task
    if (data.fatal) {
      this.clearInterval();
    }

    // If not an audio-track loading error don't handle further
    if (data.details !== errors["a" /* ErrorDetails */].AUDIO_TRACK_LOAD_ERROR) {
      return;
    }

    logger["b" /* logger */].warn('Network failure on audio-track id:', data.context.id);
    this._handleLoadError();
  };

  /**
   * @type {AudioTrack[]} Audio-track list we own
   */


  /**
   * @override
   */
  AudioTrackController.prototype.doTick = function doTick() {
    this._updateTrack(this.trackId);
  };

  /**
   * Select initial track
   * @private
   */


  AudioTrackController.prototype._selectInitialAudioTrack = function _selectInitialAudioTrack() {
    var _this2 = this;

    var tracks = this.tracks;
    if (!tracks.length) {
      return;
    }

    var currentAudioTrack = this.tracks[this.trackId];

    var name = null;
    if (currentAudioTrack) {
      name = currentAudioTrack.name;
    }

    // Pre-select default tracks if there are any
    var defaultTracks = tracks.filter(function (track) {
      return track.default;
    });
    if (defaultTracks.length) {
      tracks = defaultTracks;
    } else {
      logger["b" /* logger */].warn('No default audio tracks defined');
    }

    var trackFound = false;

    var traverseTracks = function traverseTracks() {
      // Select track with right group ID
      tracks.forEach(function (track) {
        if (trackFound) {
          return;
        }
        // We need to match the (pre-)selected group ID
        // and the NAME of the current track.
        if ((!_this2.audioGroupId || track.groupId === _this2.audioGroupId) && (!name || name === track.name)) {
          // If there was a previous track try to stay with the same `NAME`.
          // It should be unique across tracks of same group, and consistent through redundant track groups.
          _this2.audioTrack = track.id;
          trackFound = true;
        }
      });
    };

    traverseTracks();

    if (!trackFound) {
      name = null;
      traverseTracks();
    }

    if (!trackFound) {
      logger["b" /* logger */].error('No track found for running audio group-ID: ' + this.audioGroupId);

      this.hls.trigger(events["a" /* default */].ERROR, {
        type: errors["b" /* ErrorTypes */].MEDIA_ERROR,
        details: errors["a" /* ErrorDetails */].AUDIO_TRACK_LOAD_ERROR,
        fatal: true
      });
    }
  };

  /**
   * @private
   * @param {AudioTrack} audioTrack
   * @returns {boolean}
   */


  AudioTrackController.prototype._needsTrackLoading = function _needsTrackLoading(audioTrack) {
    var details = audioTrack.details;


    if (!details) {
      return true;
    } else if (details.live) {
      return true;
    }
  };

  /**
   * @private
   * @param {AudioTrack} audioTrack
   */


  AudioTrackController.prototype._loadTrackDetailsIfNeeded = function _loadTrackDetailsIfNeeded(audioTrack) {
    if (this._needsTrackLoading(audioTrack)) {
      var url = audioTrack.url,
          id = audioTrack.id;
      // track not retrieved yet, or live playlist we need to (re)load it

      logger["b" /* logger */].log('loading audio-track playlist for id: ' + id);
      this.hls.trigger(events["a" /* default */].AUDIO_TRACK_LOADING, { url: url, id: id });
    }
  };

  /**
   * @private
   * @param {number} newId
   */


  AudioTrackController.prototype._updateTrack = function _updateTrack(newId) {
    // check if level idx is valid
    if (newId < 0 || newId >= this.tracks.length) {
      return;
    }

    // stopping live reloading timer if any
    this.clearInterval();
    this.trackId = newId;
    logger["b" /* logger */].log('trying to update audio-track ' + newId);
    var audioTrack = this.tracks[newId];
    this._loadTrackDetailsIfNeeded(audioTrack);
  };

  /**
   * @private
   */


  AudioTrackController.prototype._handleLoadError = function _handleLoadError() {
    // First, let's black list current track id
    this.trackIdBlacklist[this.trackId] = true;

    // Let's try to fall back on a functional audio-track with the same group ID
    var previousId = this.trackId;
    var _tracks$previousId = this.tracks[previousId],
        name = _tracks$previousId.name,
        language = _tracks$previousId.language,
        groupId = _tracks$previousId.groupId;


    logger["b" /* logger */].warn('Loading failed on audio track id: ' + previousId + ', group-id: ' + groupId + ', name/language: "' + name + '" / "' + language + '"');

    // Find a non-blacklisted track ID with the same NAME
    // At least a track that is not blacklisted, thus on another group-ID.
    var newId = previousId;
    for (var i = 0; i < this.tracks.length; i++) {
      if (this.trackIdBlacklist[i]) {
        continue;
      }
      var newTrack = this.tracks[i];
      if (newTrack.name === name) {
        newId = i;
        break;
      }
    }

    if (newId === previousId) {
      logger["b" /* logger */].warn('No fallback audio-track found for name/language: "' + name + '" / "' + language + '"');
      return;
    }

    logger["b" /* logger */].log('Attempting audio-track fallback id:', newId, 'group-id:', this.tracks[newId].groupId);

    this.audioTrack = newId;
  };

  audio_track_controller__createClass(AudioTrackController, [{
    key: 'audioTracks',
    get: function get() {
      return this.tracks;
    }

    /**
     * @type {number} Index into audio-tracks list of currently selected track.
     */

  }, {
    key: 'audioTrack',
    get: function get() {
      return this.trackId;
    }

    /**
     * Select current track by index
     */
    ,
    set: function set(newId) {
      // noop on same audio track id as already set
      if (this.trackId === newId && this.tracks[this.trackId].details) {
        logger["b" /* logger */].debug('Same id as current audio-track passed, and track details available -> no-op');
        return;
      }

      // check if level idx is valid
      if (newId < 0 || newId >= this.tracks.length) {
        logger["b" /* logger */].warn('Invalid id passed to audio-track controller');
        return;
      }

      var audioTrack = this.tracks[newId];

      logger["b" /* logger */].log('Now switching to audio-track index ' + newId);

      // stopping live reloading timer if any
      this.clearInterval();
      this.trackId = newId;

      var url = audioTrack.url,
          type = audioTrack.type,
          id = audioTrack.id;

      this.hls.trigger(events["a" /* default */].AUDIO_TRACK_SWITCHING, { id: id, type: type, url: url });
      this._loadTrackDetailsIfNeeded(audioTrack);
    }
  }]);

  return AudioTrackController;
}(task_loop);

/* harmony default export */ var audio_track_controller = (audio_track_controller_AudioTrackController);
// CONCATENATED MODULE: ./src/controller/audio-stream-controller.js
var audio_stream_controller__createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function audio_stream_controller__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function audio_stream_controller__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function audio_stream_controller__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * Audio Stream Controller
*/














var audio_stream_controller__window = window,
    audio_stream_controller_performance = audio_stream_controller__window.performance;


var audio_stream_controller_State = {
  STOPPED: 'STOPPED',
  STARTING: 'STARTING',
  IDLE: 'IDLE',
  PAUSED: 'PAUSED',
  KEY_LOADING: 'KEY_LOADING',
  FRAG_LOADING: 'FRAG_LOADING',
  FRAG_LOADING_WAITING_RETRY: 'FRAG_LOADING_WAITING_RETRY',
  WAITING_TRACK: 'WAITING_TRACK',
  PARSING: 'PARSING',
  PARSED: 'PARSED',
  BUFFER_FLUSHING: 'BUFFER_FLUSHING',
  ENDED: 'ENDED',
  ERROR: 'ERROR',
  WAITING_INIT_PTS: 'WAITING_INIT_PTS'
};

var audio_stream_controller_AudioStreamController = function (_TaskLoop) {
  audio_stream_controller__inherits(AudioStreamController, _TaskLoop);

  function AudioStreamController(hls, fragmentTracker) {
    audio_stream_controller__classCallCheck(this, AudioStreamController);

    var _this = audio_stream_controller__possibleConstructorReturn(this, _TaskLoop.call(this, hls, events["a" /* default */].MEDIA_ATTACHED, events["a" /* default */].MEDIA_DETACHING, events["a" /* default */].AUDIO_TRACKS_UPDATED, events["a" /* default */].AUDIO_TRACK_SWITCHING, events["a" /* default */].AUDIO_TRACK_LOADED, events["a" /* default */].KEY_LOADED, events["a" /* default */].FRAG_LOADED, events["a" /* default */].FRAG_PARSING_INIT_SEGMENT, events["a" /* default */].FRAG_PARSING_DATA, events["a" /* default */].FRAG_PARSED, events["a" /* default */].ERROR, events["a" /* default */].BUFFER_RESET, events["a" /* default */].BUFFER_CREATED, events["a" /* default */].BUFFER_APPENDED, events["a" /* default */].BUFFER_FLUSHED, events["a" /* default */].INIT_PTS_FOUND));

    _this.fragmentTracker = fragmentTracker;
    _this.config = hls.config;
    _this.audioCodecSwap = false;
    _this._state = audio_stream_controller_State.STOPPED;
    _this.initPTS = [];
    _this.waitingFragment = null;
    _this.videoTrackCC = null;
    return _this;
  }

  AudioStreamController.prototype.onHandlerDestroying = function onHandlerDestroying() {
    this.stopLoad();
    _TaskLoop.prototype.onHandlerDestroying.call(this);
  };

  AudioStreamController.prototype.onHandlerDestroyed = function onHandlerDestroyed() {
    this.state = audio_stream_controller_State.STOPPED;
    this.fragmentTracker = null;
    _TaskLoop.prototype.onHandlerDestroyed.call(this);
  };

  // Signal that video PTS was found


  AudioStreamController.prototype.onInitPtsFound = function onInitPtsFound(data) {
    var demuxerId = data.id,
        cc = data.frag.cc,
        initPTS = data.initPTS;
    if (demuxerId === 'main') {
      // Always update the new INIT PTS
      // Can change due level switch
      this.initPTS[cc] = initPTS;
      this.videoTrackCC = cc;
      logger["b" /* logger */].log('InitPTS for cc: ' + cc + ' found from video track: ' + initPTS);

      // If we are waiting we need to demux/remux the waiting frag
      // With the new initPTS
      if (this.state === audio_stream_controller_State.WAITING_INIT_PTS) {
        this.tick();
      }
    }
  };

  AudioStreamController.prototype.startLoad = function startLoad(startPosition) {
    if (this.tracks) {
      var lastCurrentTime = this.lastCurrentTime;
      this.stopLoad();
      this.setInterval(100);
      this.fragLoadError = 0;
      if (lastCurrentTime > 0 && startPosition === -1) {
        logger["b" /* logger */].log('audio:override startPosition with lastCurrentTime @' + lastCurrentTime.toFixed(3));
        this.state = audio_stream_controller_State.IDLE;
      } else {
        this.lastCurrentTime = this.startPosition ? this.startPosition : startPosition;
        this.state = audio_stream_controller_State.STARTING;
      }
      this.nextLoadPosition = this.startPosition = this.lastCurrentTime;
      this.tick();
    } else {
      this.startPosition = startPosition;
      this.state = audio_stream_controller_State.STOPPED;
    }
  };

  AudioStreamController.prototype.stopLoad = function stopLoad() {
    var frag = this.fragCurrent;
    if (frag) {
      if (frag.loader) {
        frag.loader.abort();
      }

      this.fragmentTracker.removeFragment(frag);
      this.fragCurrent = null;
    }
    this.fragPrevious = null;
    if (this.demuxer) {
      this.demuxer.destroy();
      this.demuxer = null;
    }
    this.state = audio_stream_controller_State.STOPPED;
  };

  AudioStreamController.prototype.doTick = function doTick() {
    var pos = void 0,
        track = void 0,
        trackDetails = void 0,
        hls = this.hls,
        config = hls.config;
    // logger.log('audioStream:' + this.state);
    switch (this.state) {
      case audio_stream_controller_State.ERROR:
      // don't do anything in error state to avoid breaking further ...
      case audio_stream_controller_State.PAUSED:
      // don't do anything in paused state either ...
      case audio_stream_controller_State.BUFFER_FLUSHING:
        break;
      case audio_stream_controller_State.STARTING:
        this.state = audio_stream_controller_State.WAITING_TRACK;
        this.loadedmetadata = false;
        break;
      case audio_stream_controller_State.IDLE:
        var tracks = this.tracks;
        // audio tracks not received => exit loop
        if (!tracks) {
          break;
        }

        // if video not attached AND
        // start fragment already requested OR start frag prefetch disable
        // exit loop
        // => if media not attached but start frag prefetch is enabled and start frag not requested yet, we will not exit loop
        if (!this.media && (this.startFragRequested || !config.startFragPrefetch)) {
          break;
        }

        // determine next candidate fragment to be loaded, based on current position and
        //  end of buffer position
        // if we have not yet loaded any fragment, start loading from start position
        if (this.loadedmetadata) {
          pos = this.media.currentTime;
        } else {
          pos = this.nextLoadPosition;
          if (pos === undefined) {
            break;
          }
        }
        var media = this.mediaBuffer ? this.mediaBuffer : this.media,
            videoBuffer = this.videoBuffer ? this.videoBuffer : this.media,
            bufferInfo = BufferHelper.bufferInfo(media, pos, config.maxBufferHole),
            mainBufferInfo = BufferHelper.bufferInfo(videoBuffer, pos, config.maxBufferHole),
            bufferLen = bufferInfo.len,
            bufferEnd = bufferInfo.end,
            fragPrevious = this.fragPrevious,

        // ensure we buffer at least config.maxBufferLength (default 30s) or config.maxMaxBufferLength (default: 600s)
        // whichever is smaller.
        // once we reach that threshold, don't buffer more than video (mainBufferInfo.len)
        maxConfigBuffer = Math.min(config.maxBufferLength, config.maxMaxBufferLength),
            maxBufLen = Math.max(maxConfigBuffer, mainBufferInfo.len),
            audioSwitch = this.audioSwitch,
            trackId = this.trackId;

        // if buffer length is less than maxBufLen try to load a new fragment
        if ((bufferLen < maxBufLen || audioSwitch) && trackId < tracks.length) {
          trackDetails = tracks[trackId].details;
          // if track info not retrieved yet, switch state and wait for track retrieval
          if (typeof trackDetails === 'undefined') {
            this.state = audio_stream_controller_State.WAITING_TRACK;
            break;
          }

          // check if we need to finalize media stream
          // we just got done loading the final fragment and there is no other buffered range after ...
          // rationale is that in case there are any buffered ranges after, it means that there are unbuffered portion in between
          // so we should not switch to ENDED in that case, to be able to buffer them
          if (!audioSwitch && !trackDetails.live && fragPrevious && fragPrevious.sn === trackDetails.endSN && !bufferInfo.nextStart) {
            // if we are not seeking or if we are seeking but everything (almost) til the end is buffered, let's signal eos
            // we don't compare exactly media.duration === bufferInfo.end as there could be some subtle media duration difference when switching
            // between different renditions. using half frag duration should help cope with these cases.
            if (!this.media.seeking || this.media.duration - bufferEnd < fragPrevious.duration / 2) {
              // Finalize the media stream
              this.hls.trigger(events["a" /* default */].BUFFER_EOS, { type: 'audio' });
              this.state = audio_stream_controller_State.ENDED;
              break;
            }
          }

          // find fragment index, contiguous with end of buffer position
          var fragments = trackDetails.fragments,
              fragLen = fragments.length,
              start = fragments[0].start,
              end = fragments[fragLen - 1].start + fragments[fragLen - 1].duration,
              frag = void 0;

          // When switching audio track, reload audio as close as possible to currentTime
          if (audioSwitch) {
            if (trackDetails.live && !trackDetails.PTSKnown) {
              logger["b" /* logger */].log('switching audiotrack, live stream, unknown PTS,load first fragment');
              bufferEnd = 0;
            } else {
              bufferEnd = pos;
              // if currentTime (pos) is less than alt audio playlist start time, it means that alt audio is ahead of currentTime
              if (trackDetails.PTSKnown && pos < start) {
                // if everything is buffered from pos to start or if audio buffer upfront, let's seek to start
                if (bufferInfo.end > start || bufferInfo.nextStart) {
                  logger["b" /* logger */].log('alt audio track ahead of main track, seek to start of alt audio track');
                  this.media.currentTime = start + 0.05;
                } else {
                  return;
                }
              }
            }
          }
          if (trackDetails.initSegment && !trackDetails.initSegment.data) {
            frag = trackDetails.initSegment;
          } // eslint-disable-line brace-style
          // if bufferEnd before start of playlist, load first fragment
          else if (bufferEnd <= start) {
              frag = fragments[0];
              if (this.videoTrackCC !== null && frag.cc !== this.videoTrackCC) {
                // Ensure we find a fragment which matches the continuity of the video track
                frag = findFragWithCC(fragments, this.videoTrackCC);
              }
              if (trackDetails.live && frag.loadIdx && frag.loadIdx === this.fragLoadIdx) {
                // we just loaded this first fragment, and we are still lagging behind the start of the live playlist
                // let's force seek to start
                var nextBuffered = bufferInfo.nextStart ? bufferInfo.nextStart : start;
                logger["b" /* logger */].log('no alt audio available @currentTime:' + this.media.currentTime + ', seeking @' + (nextBuffered + 0.05));
                this.media.currentTime = nextBuffered + 0.05;
                return;
              }
            } else {
              var foundFrag = void 0;
              var maxFragLookUpTolerance = config.maxFragLookUpTolerance;
              var fragNext = fragPrevious ? fragments[fragPrevious.sn - fragments[0].sn + 1] : undefined;
              var fragmentWithinToleranceTest = function fragmentWithinToleranceTest(candidate) {
                // offset should be within fragment boundary - config.maxFragLookUpTolerance
                // this is to cope with situations like
                // bufferEnd = 9.991
                // frag[Ø] : [0,10]
                // frag[1] : [10,20]
                // bufferEnd is within frag[0] range ... although what we are expecting is to return frag[1] here
                //              frag start               frag start+duration
                //                  |-----------------------------|
                //              <--->                         <--->
                //  ...--------><-----------------------------><---------....
                // previous frag         matching fragment         next frag
                //  return -1             return 0                 return 1
                // logger.log(`level/sn/start/end/bufEnd:${level}/${candidate.sn}/${candidate.start}/${(candidate.start+candidate.duration)}/${bufferEnd}`);
                // Set the lookup tolerance to be small enough to detect the current segment - ensures we don't skip over very small segments
                var candidateLookupTolerance = Math.min(maxFragLookUpTolerance, candidate.duration);
                if (candidate.start + candidate.duration - candidateLookupTolerance <= bufferEnd) {
                  return 1;
                } else if (candidate.start - candidateLookupTolerance > bufferEnd && candidate.start) {
                  // if maxFragLookUpTolerance will have negative value then don't return -1 for first element
                  return -1;
                }

                return 0;
              };

              if (bufferEnd < end) {
                if (bufferEnd > end - maxFragLookUpTolerance) {
                  maxFragLookUpTolerance = 0;
                }

                // Prefer the next fragment if it's within tolerance
                if (fragNext && !fragmentWithinToleranceTest(fragNext)) {
                  foundFrag = fragNext;
                } else {
                  foundFrag = binary_search.search(fragments, fragmentWithinToleranceTest);
                }
              } else {
                // reach end of playlist
                foundFrag = fragments[fragLen - 1];
              }
              if (foundFrag) {
                frag = foundFrag;
                start = foundFrag.start;
                // logger.log('find SN matching with pos:' +  bufferEnd + ':' + frag.sn);
                if (fragPrevious && frag.level === fragPrevious.level && frag.sn === fragPrevious.sn) {
                  if (frag.sn < trackDetails.endSN) {
                    frag = fragments[frag.sn + 1 - trackDetails.startSN];
                    logger["b" /* logger */].log('SN just loaded, load next one: ' + frag.sn);
                  } else {
                    frag = null;
                  }
                }
              }
            }
          if (frag) {
            // logger.log('      loading frag ' + i +',pos/bufEnd:' + pos.toFixed(3) + '/' + bufferEnd.toFixed(3));
            if (frag.encrypted) {
              logger["b" /* logger */].log('Loading key for ' + frag.sn + ' of [' + trackDetails.startSN + ' ,' + trackDetails.endSN + '],track ' + trackId);
              this.state = audio_stream_controller_State.KEY_LOADING;
              hls.trigger(events["a" /* default */].KEY_LOADING, { frag: frag });
            } else {
              logger["b" /* logger */].log('Loading ' + frag.sn + ', cc: ' + frag.cc + ' of [' + trackDetails.startSN + ' ,' + trackDetails.endSN + '],track ' + trackId + ', currentTime:' + pos + ',bufferEnd:' + bufferEnd.toFixed(3));
              // only load if fragment is not loaded or if in audio switch
              // we force a frag loading in audio switch as fragment tracker might not have evicted previous frags in case of quick audio switch
              if (audioSwitch || this.fragmentTracker.getState(frag) === FragmentState.NOT_LOADED) {
                this.fragCurrent = frag;
                this.startFragRequested = true;
                if (!isNaN(frag.sn)) {
                  this.nextLoadPosition = frag.start + frag.duration;
                }

                hls.trigger(events["a" /* default */].FRAG_LOADING, { frag: frag });
                this.state = audio_stream_controller_State.FRAG_LOADING;
              }
            }
          }
        }
        break;
      case audio_stream_controller_State.WAITING_TRACK:
        track = this.tracks[this.trackId];
        // check if playlist is already loaded
        if (track && track.details) {
          this.state = audio_stream_controller_State.IDLE;
        }

        break;
      case audio_stream_controller_State.FRAG_LOADING_WAITING_RETRY:
        var now = audio_stream_controller_performance.now();
        var retryDate = this.retryDate;
        media = this.media;
        var isSeeking = media && media.seeking;
        // if current time is gt than retryDate, or if media seeking let's switch to IDLE state to retry loading
        if (!retryDate || now >= retryDate || isSeeking) {
          logger["b" /* logger */].log('audioStreamController: retryDate reached, switch back to IDLE state');
          this.state = audio_stream_controller_State.IDLE;
        }
        break;
      case audio_stream_controller_State.WAITING_INIT_PTS:
        var videoTrackCC = this.videoTrackCC;
        if (this.initPTS[videoTrackCC] === undefined) {
          break;
        }

        // Ensure we don't get stuck in the WAITING_INIT_PTS state if the waiting frag CC doesn't match any initPTS
        var waitingFrag = this.waitingFragment;
        if (waitingFrag) {
          var waitingFragCC = waitingFrag.frag.cc;
          if (videoTrackCC !== waitingFragCC) {
            track = this.tracks[this.trackId];
            if (track.details && track.details.live) {
              logger["b" /* logger */].warn('Waiting fragment CC (' + waitingFragCC + ') does not match video track CC (' + videoTrackCC + ')');
              this.waitingFragment = null;
              this.state = audio_stream_controller_State.IDLE;
            }
          } else {
            this.state = audio_stream_controller_State.FRAG_LOADING;
            this.onFragLoaded(this.waitingFragment);
            this.waitingFragment = null;
          }
        } else {
          this.state = audio_stream_controller_State.IDLE;
        }

        break;
      case audio_stream_controller_State.STOPPED:
      case audio_stream_controller_State.FRAG_LOADING:
      case audio_stream_controller_State.PARSING:
      case audio_stream_controller_State.PARSED:
      case audio_stream_controller_State.ENDED:
        break;
      default:
        break;
    }
  };

  AudioStreamController.prototype.onMediaAttached = function onMediaAttached(data) {
    var media = this.media = this.mediaBuffer = data.media;
    this.onvseeking = this.onMediaSeeking.bind(this);
    this.onvended = this.onMediaEnded.bind(this);
    media.addEventListener('seeking', this.onvseeking);
    media.addEventListener('ended', this.onvended);
    var config = this.config;
    if (this.tracks && config.autoStartLoad) {
      this.startLoad(config.startPosition);
    }
  };

  AudioStreamController.prototype.onMediaDetaching = function onMediaDetaching() {
    var media = this.media;
    if (media && media.ended) {
      logger["b" /* logger */].log('MSE detaching and video ended, reset startPosition');
      this.startPosition = this.lastCurrentTime = 0;
    }

    // remove video listeners
    if (media) {
      media.removeEventListener('seeking', this.onvseeking);
      media.removeEventListener('ended', this.onvended);
      this.onvseeking = this.onvseeked = this.onvended = null;
    }
    this.media = this.mediaBuffer = this.videoBuffer = null;
    this.loadedmetadata = false;
    this.stopLoad();
  };

  AudioStreamController.prototype.onMediaSeeking = function onMediaSeeking() {
    if (this.state === audio_stream_controller_State.ENDED) {
      // switch to IDLE state to check for potential new fragment
      this.state = audio_stream_controller_State.IDLE;
    }
    if (this.media) {
      this.lastCurrentTime = this.media.currentTime;
    }

    // tick to speed up processing
    this.tick();
  };

  AudioStreamController.prototype.onMediaEnded = function onMediaEnded() {
    // reset startPosition and lastCurrentTime to restart playback @ stream beginning
    this.startPosition = this.lastCurrentTime = 0;
  };

  AudioStreamController.prototype.onAudioTracksUpdated = function onAudioTracksUpdated(data) {
    logger["b" /* logger */].log('audio tracks updated');
    this.tracks = data.audioTracks;
  };

  AudioStreamController.prototype.onAudioTrackSwitching = function onAudioTrackSwitching(data) {
    // if any URL found on new audio track, it is an alternate audio track
    var altAudio = !!data.url;
    this.trackId = data.id;

    this.fragCurrent = null;
    this.state = audio_stream_controller_State.PAUSED;
    this.waitingFragment = null;
    // destroy useless demuxer when switching audio to main
    if (!altAudio) {
      if (this.demuxer) {
        this.demuxer.destroy();
        this.demuxer = null;
      }
    } else {
      // switching to audio track, start timer if not already started
      this.setInterval(100);
    }

    // should we switch tracks ?
    if (altAudio) {
      this.audioSwitch = true;
      // main audio track are handled by stream-controller, just do something if switching to alt audio track
      this.state = audio_stream_controller_State.IDLE;
    }
    this.tick();
  };

  AudioStreamController.prototype.onAudioTrackLoaded = function onAudioTrackLoaded(data) {
    var newDetails = data.details,
        trackId = data.id,
        track = this.tracks[trackId],
        duration = newDetails.totalduration,
        sliding = 0;

    logger["b" /* logger */].log('track ' + trackId + ' loaded [' + newDetails.startSN + ',' + newDetails.endSN + '],duration:' + duration);

    if (newDetails.live) {
      var curDetails = track.details;
      if (curDetails && newDetails.fragments.length > 0) {
        // we already have details for that level, merge them
        mergeDetails(curDetails, newDetails);
        sliding = newDetails.fragments[0].start;
        // TODO
        // this.liveSyncPosition = this.computeLivePosition(sliding, curDetails);
        if (newDetails.PTSKnown) {
          logger["b" /* logger */].log('live audio playlist sliding:' + sliding.toFixed(3));
        } else {
          logger["b" /* logger */].log('live audio playlist - outdated PTS, unknown sliding');
        }
      } else {
        newDetails.PTSKnown = false;
        logger["b" /* logger */].log('live audio playlist - first load, unknown sliding');
      }
    } else {
      newDetails.PTSKnown = false;
    }
    track.details = newDetails;

    // compute start position
    if (!this.startFragRequested) {
      // compute start position if set to -1. use it straight away if value is defined
      if (this.startPosition === -1) {
        // first, check if start time offset has been set in playlist, if yes, use this value
        var startTimeOffset = newDetails.startTimeOffset;
        if (!isNaN(startTimeOffset)) {
          logger["b" /* logger */].log('start time offset found in playlist, adjust startPosition to ' + startTimeOffset);
          this.startPosition = startTimeOffset;
        } else {
          this.startPosition = 0;
        }
      }
      this.nextLoadPosition = this.startPosition;
    }
    // only switch batck to IDLE state if we were waiting for track to start downloading a new fragment
    if (this.state === audio_stream_controller_State.WAITING_TRACK) {
      this.state = audio_stream_controller_State.IDLE;
    }

    // trigger handler right now
    this.tick();
  };

  AudioStreamController.prototype.onKeyLoaded = function onKeyLoaded() {
    if (this.state === audio_stream_controller_State.KEY_LOADING) {
      this.state = audio_stream_controller_State.IDLE;
      this.tick();
    }
  };

  AudioStreamController.prototype.onFragLoaded = function onFragLoaded(data) {
    var fragCurrent = this.fragCurrent,
        fragLoaded = data.frag;
    if (this.state === audio_stream_controller_State.FRAG_LOADING && fragCurrent && fragLoaded.type === 'audio' && fragLoaded.level === fragCurrent.level && fragLoaded.sn === fragCurrent.sn) {
      var track = this.tracks[this.trackId],
          details = track.details,
          duration = details.totalduration,
          trackId = fragCurrent.level,
          sn = fragCurrent.sn,
          cc = fragCurrent.cc,
          audioCodec = this.config.defaultAudioCodec || track.audioCodec || 'mp4a.40.2',
          stats = this.stats = data.stats;
      if (sn === 'initSegment') {
        this.state = audio_stream_controller_State.IDLE;

        stats.tparsed = stats.tbuffered = audio_stream_controller_performance.now();
        details.initSegment.data = data.payload;
        this.hls.trigger(events["a" /* default */].FRAG_BUFFERED, { stats: stats, frag: fragCurrent, id: 'audio' });
        this.tick();
      } else {
        this.state = audio_stream_controller_State.PARSING;
        // transmux the MPEG-TS data to ISO-BMFF segments
        this.appended = false;
        if (!this.demuxer) {
          this.demuxer = new demux_demuxer(this.hls, 'audio');
        }

        // Check if we have video initPTS
        // If not we need to wait for it
        var initPTS = this.initPTS[cc];
        var initSegmentData = details.initSegment ? details.initSegment.data : [];
        if (details.initSegment || initPTS !== undefined) {
          this.pendingBuffering = true;
          logger["b" /* logger */].log('Demuxing ' + sn + ' of [' + details.startSN + ' ,' + details.endSN + '],track ' + trackId);
          // time Offset is accurate if level PTS is known, or if playlist is not sliding (not live)
          var accurateTimeOffset = false; // details.PTSKnown || !details.live;
          this.demuxer.push(data.payload, initSegmentData, audioCodec, null, fragCurrent, duration, accurateTimeOffset, initPTS);
        } else {
          logger["b" /* logger */].log('unknown video PTS for continuity counter ' + cc + ', waiting for video PTS before demuxing audio frag ' + sn + ' of [' + details.startSN + ' ,' + details.endSN + '],track ' + trackId);
          this.waitingFragment = data;
          this.state = audio_stream_controller_State.WAITING_INIT_PTS;
        }
      }
    }
    this.fragLoadError = 0;
  };

  AudioStreamController.prototype.onFragParsingInitSegment = function onFragParsingInitSegment(data) {
    var fragCurrent = this.fragCurrent;
    var fragNew = data.frag;
    if (fragCurrent && data.id === 'audio' && fragNew.sn === fragCurrent.sn && fragNew.level === fragCurrent.level && this.state === audio_stream_controller_State.PARSING) {
      var tracks = data.tracks,
          track = void 0;

      // delete any video track found on audio demuxer
      if (tracks.video) {
        delete tracks.video;
      }

      // include levelCodec in audio and video tracks
      track = tracks.audio;
      if (track) {
        track.levelCodec = track.codec;
        track.id = data.id;
        this.hls.trigger(events["a" /* default */].BUFFER_CODECS, tracks);
        logger["b" /* logger */].log('audio track:audio,container:' + track.container + ',codecs[level/parsed]=[' + track.levelCodec + '/' + track.codec + ']');
        var initSegment = track.initSegment;
        if (initSegment) {
          var appendObj = { type: 'audio', data: initSegment, parent: 'audio', content: 'initSegment' };
          if (this.audioSwitch) {
            this.pendingData = [appendObj];
          } else {
            this.appended = true;
            // arm pending Buffering flag before appending a segment
            this.pendingBuffering = true;
            this.hls.trigger(events["a" /* default */].BUFFER_APPENDING, appendObj);
          }
        }
        // trigger handler right now
        this.tick();
      }
    }
  };

  AudioStreamController.prototype.onFragParsingData = function onFragParsingData(data) {
    var _this2 = this;

    var fragCurrent = this.fragCurrent;
    var fragNew = data.frag;
    if (fragCurrent && data.id === 'audio' && data.type === 'audio' && fragNew.sn === fragCurrent.sn && fragNew.level === fragCurrent.level && this.state === audio_stream_controller_State.PARSING) {
      var trackId = this.trackId,
          track = this.tracks[trackId],
          hls = this.hls;

      if (isNaN(data.endPTS)) {
        data.endPTS = data.startPTS + fragCurrent.duration;
        data.endDTS = data.startDTS + fragCurrent.duration;
      }

      fragCurrent.addElementaryStream(loader_fragment.ElementaryStreamTypes.AUDIO);

      logger["b" /* logger */].log('parsed ' + data.type + ',PTS:[' + data.startPTS.toFixed(3) + ',' + data.endPTS.toFixed(3) + '],DTS:[' + data.startDTS.toFixed(3) + '/' + data.endDTS.toFixed(3) + '],nb:' + data.nb);
      updateFragPTSDTS(track.details, fragCurrent, data.startPTS, data.endPTS);

      var audioSwitch = this.audioSwitch,
          media = this.media,
          appendOnBufferFlush = false;
      // Only flush audio from old audio tracks when PTS is known on new audio track
      if (audioSwitch && media) {
        if (media.readyState) {
          var currentTime = media.currentTime;
          logger["b" /* logger */].log('switching audio track : currentTime:' + currentTime);
          if (currentTime >= data.startPTS) {
            logger["b" /* logger */].log('switching audio track : flushing all audio');
            this.state = audio_stream_controller_State.BUFFER_FLUSHING;
            hls.trigger(events["a" /* default */].BUFFER_FLUSHING, { startOffset: 0, endOffset: Number.POSITIVE_INFINITY, type: 'audio' });
            appendOnBufferFlush = true;
            // Lets announce that the initial audio track switch flush occur
            this.audioSwitch = false;
            hls.trigger(events["a" /* default */].AUDIO_TRACK_SWITCHED, { id: trackId });
          }
        } else {
          // Lets announce that the initial audio track switch flush occur
          this.audioSwitch = false;
          hls.trigger(events["a" /* default */].AUDIO_TRACK_SWITCHED, { id: trackId });
        }
      }

      var pendingData = this.pendingData;

      if (!pendingData) {
        logger["b" /* logger */].warn('Apparently attempt to enqueue media payload without codec initialization data upfront');
        hls.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].MEDIA_ERROR, details: null, fatal: true });
        return;
      }

      if (!this.audioSwitch) {
        [data.data1, data.data2].forEach(function (buffer) {
          if (buffer && buffer.length) {
            pendingData.push({ type: data.type, data: buffer, parent: 'audio', content: 'data' });
          }
        });
        if (!appendOnBufferFlush && pendingData.length) {
          pendingData.forEach(function (appendObj) {
            // only append in PARSING state (rationale is that an appending error could happen synchronously on first segment appending)
            // in that case it is useless to append following segments
            if (_this2.state === audio_stream_controller_State.PARSING) {
              // arm pending Buffering flag before appending a segment
              _this2.pendingBuffering = true;
              _this2.hls.trigger(events["a" /* default */].BUFFER_APPENDING, appendObj);
            }
          });
          this.pendingData = [];
          this.appended = true;
        }
      }
      // trigger handler right now
      this.tick();
    }
  };

  AudioStreamController.prototype.onFragParsed = function onFragParsed(data) {
    var fragCurrent = this.fragCurrent;
    var fragNew = data.frag;
    if (fragCurrent && data.id === 'audio' && fragNew.sn === fragCurrent.sn && fragNew.level === fragCurrent.level && this.state === audio_stream_controller_State.PARSING) {
      this.stats.tparsed = audio_stream_controller_performance.now();
      this.state = audio_stream_controller_State.PARSED;
      this._checkAppendedParsed();
    }
  };

  AudioStreamController.prototype.onBufferReset = function onBufferReset() {
    // reset reference to sourcebuffers
    this.mediaBuffer = this.videoBuffer = null;
    this.loadedmetadata = false;
  };

  AudioStreamController.prototype.onBufferCreated = function onBufferCreated(data) {
    var audioTrack = data.tracks.audio;
    if (audioTrack) {
      this.mediaBuffer = audioTrack.buffer;
      this.loadedmetadata = true;
    }
    if (data.tracks.video) {
      this.videoBuffer = data.tracks.video.buffer;
    }
  };

  AudioStreamController.prototype.onBufferAppended = function onBufferAppended(data) {
    if (data.parent === 'audio') {
      var state = this.state;
      if (state === audio_stream_controller_State.PARSING || state === audio_stream_controller_State.PARSED) {
        // check if all buffers have been appended
        this.pendingBuffering = data.pending > 0;
        this._checkAppendedParsed();
      }
    }
  };

  AudioStreamController.prototype._checkAppendedParsed = function _checkAppendedParsed() {
    // trigger handler right now
    if (this.state === audio_stream_controller_State.PARSED && (!this.appended || !this.pendingBuffering)) {
      var frag = this.fragCurrent,
          stats = this.stats,
          hls = this.hls;
      if (frag) {
        this.fragPrevious = frag;
        stats.tbuffered = audio_stream_controller_performance.now();
        hls.trigger(events["a" /* default */].FRAG_BUFFERED, { stats: stats, frag: frag, id: 'audio' });
        var media = this.mediaBuffer ? this.mediaBuffer : this.media;
        logger["b" /* logger */].log('audio buffered : ' + time_ranges.toString(media.buffered));
        if (this.audioSwitch && this.appended) {
          this.audioSwitch = false;
          hls.trigger(events["a" /* default */].AUDIO_TRACK_SWITCHED, { id: this.trackId });
        }
        this.state = audio_stream_controller_State.IDLE;
      }
      this.tick();
    }
  };

  AudioStreamController.prototype.onError = function onError(data) {
    var frag = data.frag;
    // don't handle frag error not related to audio fragment
    if (frag && frag.type !== 'audio') {
      return;
    }

    switch (data.details) {
      case errors["a" /* ErrorDetails */].FRAG_LOAD_ERROR:
      case errors["a" /* ErrorDetails */].FRAG_LOAD_TIMEOUT:
        var _frag = data.frag;
        // don't handle frag error not related to audio fragment
        if (_frag && _frag.type !== 'audio') {
          break;
        }

        if (!data.fatal) {
          var loadError = this.fragLoadError;
          if (loadError) {
            loadError++;
          } else {
            loadError = 1;
          }

          var config = this.config;
          if (loadError <= config.fragLoadingMaxRetry) {
            this.fragLoadError = loadError;
            // exponential backoff capped to config.fragLoadingMaxRetryTimeout
            var delay = Math.min(Math.pow(2, loadError - 1) * config.fragLoadingRetryDelay, config.fragLoadingMaxRetryTimeout);
            logger["b" /* logger */].warn('AudioStreamController: frag loading failed, retry in ' + delay + ' ms');
            this.retryDate = audio_stream_controller_performance.now() + delay;
            // retry loading state
            this.state = audio_stream_controller_State.FRAG_LOADING_WAITING_RETRY;
          } else {
            logger["b" /* logger */].error('AudioStreamController: ' + data.details + ' reaches max retry, redispatch as fatal ...');
            // switch error to fatal
            data.fatal = true;
            this.state = audio_stream_controller_State.ERROR;
          }
        }
        break;
      case errors["a" /* ErrorDetails */].AUDIO_TRACK_LOAD_ERROR:
      case errors["a" /* ErrorDetails */].AUDIO_TRACK_LOAD_TIMEOUT:
      case errors["a" /* ErrorDetails */].KEY_LOAD_ERROR:
      case errors["a" /* ErrorDetails */].KEY_LOAD_TIMEOUT:
        //  when in ERROR state, don't switch back to IDLE state in case a non-fatal error is received
        if (this.state !== audio_stream_controller_State.ERROR) {
          // if fatal error, stop processing, otherwise move to IDLE to retry loading
          this.state = data.fatal ? audio_stream_controller_State.ERROR : audio_stream_controller_State.IDLE;
          logger["b" /* logger */].warn('AudioStreamController: ' + data.details + ' while loading frag, now switching to ' + this.state + ' state ...');
        }
        break;
      case errors["a" /* ErrorDetails */].BUFFER_FULL_ERROR:
        // if in appending state
        if (data.parent === 'audio' && (this.state === audio_stream_controller_State.PARSING || this.state === audio_stream_controller_State.PARSED)) {
          var media = this.mediaBuffer,
              currentTime = this.media.currentTime,
              mediaBuffered = media && BufferHelper.isBuffered(media, currentTime) && BufferHelper.isBuffered(media, currentTime + 0.5);
          // reduce max buf len if current position is buffered
          if (mediaBuffered) {
            var _config = this.config;
            if (_config.maxMaxBufferLength >= _config.maxBufferLength) {
              // reduce max buffer length as it might be too high. we do this to avoid loop flushing ...
              _config.maxMaxBufferLength /= 2;
              logger["b" /* logger */].warn('AudioStreamController: reduce max buffer length to ' + _config.maxMaxBufferLength + 's');
            }
            this.state = audio_stream_controller_State.IDLE;
          } else {
            // current position is not buffered, but browser is still complaining about buffer full error
            // this happens on IE/Edge, refer to https://github.com/video-dev/hls.js/pull/708
            // in that case flush the whole audio buffer to recover
            logger["b" /* logger */].warn('AudioStreamController: buffer full error also media.currentTime is not buffered, flush audio buffer');
            this.fragCurrent = null;
            // flush everything
            this.state = audio_stream_controller_State.BUFFER_FLUSHING;
            this.hls.trigger(events["a" /* default */].BUFFER_FLUSHING, { startOffset: 0, endOffset: Number.POSITIVE_INFINITY, type: 'audio' });
          }
        }
        break;
      default:
        break;
    }
  };

  AudioStreamController.prototype.onBufferFlushed = function onBufferFlushed() {
    var _this3 = this;

    var pendingData = this.pendingData;
    if (pendingData && pendingData.length) {
      logger["b" /* logger */].log('AudioStreamController: appending pending audio data after buffer flushed');
      pendingData.forEach(function (appendObj) {
        _this3.hls.trigger(events["a" /* default */].BUFFER_APPENDING, appendObj);
      });
      this.appended = true;
      this.pendingData = [];
      this.state = audio_stream_controller_State.PARSED;
    } else {
      // move to IDLE once flush complete. this should trigger new fragment loading
      this.state = audio_stream_controller_State.IDLE;
      // reset reference to frag
      this.fragPrevious = null;
      this.tick();
    }
  };

  audio_stream_controller__createClass(AudioStreamController, [{
    key: 'state',
    set: function set(nextState) {
      if (this.state !== nextState) {
        var previousState = this.state;
        this._state = nextState;
        logger["b" /* logger */].log('audio stream:' + previousState + '->' + nextState);
      }
    },
    get: function get() {
      return this._state;
    }
  }]);

  return AudioStreamController;
}(task_loop);

/* harmony default export */ var audio_stream_controller = (audio_stream_controller_AudioStreamController);
// CONCATENATED MODULE: ./src/utils/vttcue.js
/**
 * Copyright 2013 vtt.js Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* harmony default export */ var vttcue = ((function () {
  if (typeof window !== 'undefined' && window.VTTCue) {
    return window.VTTCue;
  }

  var autoKeyword = 'auto';
  var directionSetting = {
    '': true,
    lr: true,
    rl: true
  };
  var alignSetting = {
    start: true,
    middle: true,
    end: true,
    left: true,
    right: true
  };

  function findDirectionSetting(value) {
    if (typeof value !== 'string') {
      return false;
    }

    var dir = directionSetting[value.toLowerCase()];
    return dir ? value.toLowerCase() : false;
  }

  function findAlignSetting(value) {
    if (typeof value !== 'string') {
      return false;
    }

    var align = alignSetting[value.toLowerCase()];
    return align ? value.toLowerCase() : false;
  }

  function extend(obj) {
    var i = 1;
    for (; i < arguments.length; i++) {
      var cobj = arguments[i];
      for (var p in cobj) {
        obj[p] = cobj[p];
      }
    }

    return obj;
  }

  function VTTCue(startTime, endTime, text) {
    var cue = this;
    var isIE8 = function () {
      if (typeof navigator === 'undefined') {
        return;
      }

      return (/MSIE\s8\.0/.test(navigator.userAgent)
      );
    }();
    var baseObj = {};

    if (isIE8) {
      cue = document.createElement('custom');
    } else {
      baseObj.enumerable = true;
    }

    /**
     * Shim implementation specific properties. These properties are not in
     * the spec.
     */

    // Lets us know when the VTTCue's data has changed in such a way that we need
    // to recompute its display state. This lets us compute its display state
    // lazily.
    cue.hasBeenReset = false;

    /**
     * VTTCue and TextTrackCue properties
     * http://dev.w3.org/html5/webvtt/#vttcue-interface
     */

    var _id = '';
    var _pauseOnExit = false;
    var _startTime = startTime;
    var _endTime = endTime;
    var _text = text;
    var _region = null;
    var _vertical = '';
    var _snapToLines = true;
    var _line = 'auto';
    var _lineAlign = 'start';
    var _position = 50;
    var _positionAlign = 'middle';
    var _size = 50;
    var _align = 'middle';

    Object.defineProperty(cue, 'id', extend({}, baseObj, {
      get: function get() {
        return _id;
      },
      set: function set(value) {
        _id = '' + value;
      }
    }));

    Object.defineProperty(cue, 'pauseOnExit', extend({}, baseObj, {
      get: function get() {
        return _pauseOnExit;
      },
      set: function set(value) {
        _pauseOnExit = !!value;
      }
    }));

    Object.defineProperty(cue, 'startTime', extend({}, baseObj, {
      get: function get() {
        return _startTime;
      },
      set: function set(value) {
        if (typeof value !== 'number') {
          throw new TypeError('Start time must be set to a number.');
        }

        _startTime = value;
        this.hasBeenReset = true;
      }
    }));

    Object.defineProperty(cue, 'endTime', extend({}, baseObj, {
      get: function get() {
        return _endTime;
      },
      set: function set(value) {
        if (typeof value !== 'number') {
          throw new TypeError('End time must be set to a number.');
        }

        _endTime = value;
        this.hasBeenReset = true;
      }
    }));

    Object.defineProperty(cue, 'text', extend({}, baseObj, {
      get: function get() {
        return _text;
      },
      set: function set(value) {
        _text = '' + value;
        this.hasBeenReset = true;
      }
    }));

    Object.defineProperty(cue, 'region', extend({}, baseObj, {
      get: function get() {
        return _region;
      },
      set: function set(value) {
        _region = value;
        this.hasBeenReset = true;
      }
    }));

    Object.defineProperty(cue, 'vertical', extend({}, baseObj, {
      get: function get() {
        return _vertical;
      },
      set: function set(value) {
        var setting = findDirectionSetting(value);
        // Have to check for false because the setting an be an empty string.
        if (setting === false) {
          throw new SyntaxError('An invalid or illegal string was specified.');
        }

        _vertical = setting;
        this.hasBeenReset = true;
      }
    }));

    Object.defineProperty(cue, 'snapToLines', extend({}, baseObj, {
      get: function get() {
        return _snapToLines;
      },
      set: function set(value) {
        _snapToLines = !!value;
        this.hasBeenReset = true;
      }
    }));

    Object.defineProperty(cue, 'line', extend({}, baseObj, {
      get: function get() {
        return _line;
      },
      set: function set(value) {
        if (typeof value !== 'number' && value !== autoKeyword) {
          throw new SyntaxError('An invalid number or illegal string was specified.');
        }

        _line = value;
        this.hasBeenReset = true;
      }
    }));

    Object.defineProperty(cue, 'lineAlign', extend({}, baseObj, {
      get: function get() {
        return _lineAlign;
      },
      set: function set(value) {
        var setting = findAlignSetting(value);
        if (!setting) {
          throw new SyntaxError('An invalid or illegal string was specified.');
        }

        _lineAlign = setting;
        this.hasBeenReset = true;
      }
    }));

    Object.defineProperty(cue, 'position', extend({}, baseObj, {
      get: function get() {
        return _position;
      },
      set: function set(value) {
        if (value < 0 || value > 100) {
          throw new Error('Position must be between 0 and 100.');
        }

        _position = value;
        this.hasBeenReset = true;
      }
    }));

    Object.defineProperty(cue, 'positionAlign', extend({}, baseObj, {
      get: function get() {
        return _positionAlign;
      },
      set: function set(value) {
        var setting = findAlignSetting(value);
        if (!setting) {
          throw new SyntaxError('An invalid or illegal string was specified.');
        }

        _positionAlign = setting;
        this.hasBeenReset = true;
      }
    }));

    Object.defineProperty(cue, 'size', extend({}, baseObj, {
      get: function get() {
        return _size;
      },
      set: function set(value) {
        if (value < 0 || value > 100) {
          throw new Error('Size must be between 0 and 100.');
        }

        _size = value;
        this.hasBeenReset = true;
      }
    }));

    Object.defineProperty(cue, 'align', extend({}, baseObj, {
      get: function get() {
        return _align;
      },
      set: function set(value) {
        var setting = findAlignSetting(value);
        if (!setting) {
          throw new SyntaxError('An invalid or illegal string was specified.');
        }

        _align = setting;
        this.hasBeenReset = true;
      }
    }));

    /**
     * Other <track> spec defined properties
     */

    // http://www.whatwg.org/specs/web-apps/current-work/multipage/the-video-element.html#text-track-cue-display-state
    cue.displayState = undefined;

    if (isIE8) {
      return cue;
    }
  }

  /**
   * VTTCue methods
   */

  VTTCue.prototype.getCueAsHTML = function () {
    // Assume WebVTT.convertCueToDOMTree is on the global.
    var WebVTT = window.WebVTT;
    return WebVTT.convertCueToDOMTree(window, this.text);
  };

  return VTTCue;
})());
// CONCATENATED MODULE: ./src/utils/vttparser.js
/*
 * Source: https://github.com/mozilla/vtt.js/blob/master/dist/vtt.js#L1716
 */



var StringDecoder = function StringDecoder() {
  return {
    decode: function decode(data) {
      if (!data) {
        return '';
      }

      if (typeof data !== 'string') {
        throw new Error('Error - expected string data.');
      }

      return decodeURIComponent(encodeURIComponent(data));
    }
  };
};

function VTTParser() {
  this.window = window;
  this.state = 'INITIAL';
  this.buffer = '';
  this.decoder = new StringDecoder();
  this.regionList = [];
}

// Try to parse input as a time stamp.
function parseTimeStamp(input) {
  function computeSeconds(h, m, s, f) {
    return (h | 0) * 3600 + (m | 0) * 60 + (s | 0) + (f | 0) / 1000;
  }

  var m = input.match(/^(\d+):(\d{2})(:\d{2})?\.(\d{3})/);
  if (!m) {
    return null;
  }

  if (m[3]) {
    // Timestamp takes the form of [hours]:[minutes]:[seconds].[milliseconds]
    return computeSeconds(m[1], m[2], m[3].replace(':', ''), m[4]);
  } else if (m[1] > 59) {
    // Timestamp takes the form of [hours]:[minutes].[milliseconds]
    // First position is hours as it's over 59.
    return computeSeconds(m[1], m[2], 0, m[4]);
  } else {
    // Timestamp takes the form of [minutes]:[seconds].[milliseconds]
    return computeSeconds(0, m[1], m[2], m[4]);
  }
}

// A settings object holds key/value pairs and will ignore anything but the first
// assignment to a specific key.
function Settings() {
  this.values = Object.create(null);
}

Settings.prototype = {
  // Only accept the first assignment to any key.
  set: function set(k, v) {
    if (!this.get(k) && v !== '') {
      this.values[k] = v;
    }
  },
  // Return the value for a key, or a default value.
  // If 'defaultKey' is passed then 'dflt' is assumed to be an object with
  // a number of possible default values as properties where 'defaultKey' is
  // the key of the property that will be chosen; otherwise it's assumed to be
  // a single value.
  get: function get(k, dflt, defaultKey) {
    if (defaultKey) {
      return this.has(k) ? this.values[k] : dflt[defaultKey];
    }

    return this.has(k) ? this.values[k] : dflt;
  },
  // Check whether we have a value for a key.
  has: function has(k) {
    return k in this.values;
  },
  // Accept a setting if its one of the given alternatives.
  alt: function alt(k, v, a) {
    for (var n = 0; n < a.length; ++n) {
      if (v === a[n]) {
        this.set(k, v);
        break;
      }
    }
  },
  // Accept a setting if its a valid (signed) integer.
  integer: function integer(k, v) {
    if (/^-?\d+$/.test(v)) {
      // integer
      this.set(k, parseInt(v, 10));
    }
  },
  // Accept a setting if its a valid percentage.
  percent: function percent(k, v) {
    var m = void 0;
    if (m = v.match(/^([\d]{1,3})(\.[\d]*)?%$/)) {
      v = parseFloat(v);
      if (v >= 0 && v <= 100) {
        this.set(k, v);
        return true;
      }
    }
    return false;
  }
};

// Helper function to parse input into groups separated by 'groupDelim', and
// interprete each group as a key/value pair separated by 'keyValueDelim'.
function parseOptions(input, callback, keyValueDelim, groupDelim) {
  var groups = groupDelim ? input.split(groupDelim) : [input];
  for (var i in groups) {
    if (typeof groups[i] !== 'string') {
      continue;
    }

    var kv = groups[i].split(keyValueDelim);
    if (kv.length !== 2) {
      continue;
    }

    var k = kv[0];
    var v = kv[1];
    callback(k, v);
  }
}

var defaults = new vttcue(0, 0, 0);
// 'middle' was changed to 'center' in the spec: https://github.com/w3c/webvtt/pull/244
//  Safari doesn't yet support this change, but FF and Chrome do.
var center = defaults.align === 'middle' ? 'middle' : 'center';

function parseCue(input, cue, regionList) {
  // Remember the original input if we need to throw an error.
  var oInput = input;
  // 4.1 WebVTT timestamp
  function consumeTimeStamp() {
    var ts = parseTimeStamp(input);
    if (ts === null) {
      throw new Error('Malformed timestamp: ' + oInput);
    }

    // Remove time stamp from input.
    input = input.replace(/^[^\sa-zA-Z-]+/, '');
    return ts;
  }

  // 4.4.2 WebVTT cue settings
  function consumeCueSettings(input, cue) {
    var settings = new Settings();

    parseOptions(input, function (k, v) {
      switch (k) {
        case 'region':
          // Find the last region we parsed with the same region id.
          for (var i = regionList.length - 1; i >= 0; i--) {
            if (regionList[i].id === v) {
              settings.set(k, regionList[i].region);
              break;
            }
          }
          break;
        case 'vertical':
          settings.alt(k, v, ['rl', 'lr']);
          break;
        case 'line':
          var vals = v.split(','),
              vals0 = vals[0];
          settings.integer(k, vals0);
          if (settings.percent(k, vals0)) {
            settings.set('snapToLines', false);
          }

          settings.alt(k, vals0, ['auto']);
          if (vals.length === 2) {
            settings.alt('lineAlign', vals[1], ['start', center, 'end']);
          }

          break;
        case 'position':
          vals = v.split(',');
          settings.percent(k, vals[0]);
          if (vals.length === 2) {
            settings.alt('positionAlign', vals[1], ['start', center, 'end', 'line-left', 'line-right', 'auto']);
          }

          break;
        case 'size':
          settings.percent(k, v);
          break;
        case 'align':
          settings.alt(k, v, ['start', center, 'end', 'left', 'right']);
          break;
      }
    }, /:/, /\s/);

    // Apply default values for any missing fields.
    cue.region = settings.get('region', null);
    cue.vertical = settings.get('vertical', '');
    var line = settings.get('line', 'auto');
    if (line === 'auto' && defaults.line === -1) {
      // set numeric line number for Safari
      line = -1;
    }
    cue.line = line;
    cue.lineAlign = settings.get('lineAlign', 'start');
    cue.snapToLines = settings.get('snapToLines', true);
    cue.size = settings.get('size', 100);
    cue.align = settings.get('align', center);
    var position = settings.get('position', 'auto');
    if (position === 'auto' && defaults.position === 50) {
      // set numeric position for Safari
      position = cue.align === 'start' || cue.align === 'left' ? 0 : cue.align === 'end' || cue.align === 'right' ? 100 : 50;
    }
    cue.position = position;
  }

  function skipWhitespace() {
    input = input.replace(/^\s+/, '');
  }

  // 4.1 WebVTT cue timings.
  skipWhitespace();
  cue.startTime = consumeTimeStamp(); // (1) collect cue start time
  skipWhitespace();
  if (input.substr(0, 3) !== '-->') {
    // (3) next characters must match '-->'
    throw new Error('Malformed time stamp (time stamps must be separated by \'-->\'): ' + oInput);
  }
  input = input.substr(3);
  skipWhitespace();
  cue.endTime = consumeTimeStamp(); // (5) collect cue end time

  // 4.1 WebVTT cue settings list.
  skipWhitespace();
  consumeCueSettings(input, cue);
}

function fixLineBreaks(input) {
  return input.replace(/<br(?: \/)?>/gi, '\n');
}

VTTParser.prototype = {
  parse: function parse(data) {
    var self = this;

    // If there is no data then we won't decode it, but will just try to parse
    // whatever is in buffer already. This may occur in circumstances, for
    // example when flush() is called.
    if (data) {
      // Try to decode the data that we received.
      self.buffer += self.decoder.decode(data, { stream: true });
    }

    function collectNextLine() {
      var buffer = self.buffer;
      var pos = 0;

      buffer = fixLineBreaks(buffer);

      while (pos < buffer.length && buffer[pos] !== '\r' && buffer[pos] !== '\n') {
        ++pos;
      }

      var line = buffer.substr(0, pos);
      // Advance the buffer early in case we fail below.
      if (buffer[pos] === '\r') {
        ++pos;
      }

      if (buffer[pos] === '\n') {
        ++pos;
      }

      self.buffer = buffer.substr(pos);
      return line;
    }

    // 3.2 WebVTT metadata header syntax
    function parseHeader(input) {
      parseOptions(input, function (k, v) {
        switch (k) {
          case 'Region':
            // 3.3 WebVTT region metadata header syntax
            // console.log('parse region', v);
            // parseRegion(v);
            break;
        }
      }, /:/);
    }

    // 5.1 WebVTT file parsing.
    try {
      var line = void 0;
      if (self.state === 'INITIAL') {
        // We can't start parsing until we have the first line.
        if (!/\r\n|\n/.test(self.buffer)) {
          return this;
        }

        line = collectNextLine();
        // strip of UTF-8 BOM if any
        // https://en.wikipedia.org/wiki/Byte_order_mark#UTF-8
        var m = line.match(/^(ï»¿)?WEBVTT([ \t].*)?$/);
        if (!m || !m[0]) {
          throw new Error('Malformed WebVTT signature.');
        }

        self.state = 'HEADER';
      }

      var alreadyCollectedLine = false;
      while (self.buffer) {
        // We can't parse a line until we have the full line.
        if (!/\r\n|\n/.test(self.buffer)) {
          return this;
        }

        if (!alreadyCollectedLine) {
          line = collectNextLine();
        } else {
          alreadyCollectedLine = false;
        }

        switch (self.state) {
          case 'HEADER':
            // 13-18 - Allow a header (metadata) under the WEBVTT line.
            if (/:/.test(line)) {
              parseHeader(line);
            } else if (!line) {
              // An empty line terminates the header and starts the body (cues).
              self.state = 'ID';
            }
            continue;
          case 'NOTE':
            // Ignore NOTE blocks.
            if (!line) {
              self.state = 'ID';
            }

            continue;
          case 'ID':
            // Check for the start of NOTE blocks.
            if (/^NOTE($|[ \t])/.test(line)) {
              self.state = 'NOTE';
              break;
            }
            // 19-29 - Allow any number of line terminators, then initialize new cue values.
            if (!line) {
              continue;
            }

            self.cue = new vttcue(0, 0, '');
            self.state = 'CUE';
            // 30-39 - Check if self line contains an optional identifier or timing data.
            if (line.indexOf('-->') === -1) {
              self.cue.id = line;
              continue;
            }
          // Process line as start of a cue.
          /* falls through */
          case 'CUE':
            // 40 - Collect cue timings and settings.
            try {
              parseCue(line, self.cue, self.regionList);
            } catch (e) {
              // In case of an error ignore rest of the cue.
              self.cue = null;
              self.state = 'BADCUE';
              continue;
            }
            self.state = 'CUETEXT';
            continue;
          case 'CUETEXT':
            var hasSubstring = line.indexOf('-->') !== -1;
            // 34 - If we have an empty line then report the cue.
            // 35 - If we have the special substring '-->' then report the cue,
            // but do not collect the line as we need to process the current
            // one as a new cue.
            if (!line || hasSubstring && (alreadyCollectedLine = true)) {
              // We are done parsing self cue.
              if (self.oncue) {
                self.oncue(self.cue);
              }

              self.cue = null;
              self.state = 'ID';
              continue;
            }
            if (self.cue.text) {
              self.cue.text += '\n';
            }

            self.cue.text += line;
            continue;
          case 'BADCUE':
            // BADCUE
            // 54-62 - Collect and discard the remaining cue.
            if (!line) {
              self.state = 'ID';
            }

            continue;
        }
      }
    } catch (e) {
      // If we are currently parsing a cue, report what we have.
      if (self.state === 'CUETEXT' && self.cue && self.oncue) {
        self.oncue(self.cue);
      }

      self.cue = null;
      // Enter BADWEBVTT state if header was not parsed correctly otherwise
      // another exception occurred so enter BADCUE state.
      self.state = self.state === 'INITIAL' ? 'BADWEBVTT' : 'BADCUE';
    }
    return this;
  },
  flush: function flush() {
    var self = this;
    try {
      // Finish decoding the stream.
      self.buffer += self.decoder.decode();
      // Synthesize the end of the current cue or region.
      if (self.cue || self.state === 'HEADER') {
        self.buffer += '\n\n';
        self.parse();
      }
      // If we've flushed, parsed, and we're still on the INITIAL state then
      // that means we don't have enough of the stream to parse the first
      // line.
      if (self.state === 'INITIAL') {
        throw new Error('Malformed WebVTT signature.');
      }
    } catch (e) {
      throw e;
    }
    if (self.onflush) {
      self.onflush();
    }

    return this;
  }
};



/* harmony default export */ var vttparser = (VTTParser);
// CONCATENATED MODULE: ./src/utils/cues.js


function newCue(track, startTime, endTime, captionScreen) {
  var row = void 0;
  var cue = void 0;
  var indenting = void 0;
  var indent = void 0;
  var text = void 0;
  var VTTCue = window.VTTCue || window.TextTrackCue;

  for (var r = 0; r < captionScreen.rows.length; r++) {
    row = captionScreen.rows[r];
    indenting = true;
    indent = 0;
    text = '';

    if (!row.isEmpty()) {
      for (var c = 0; c < row.chars.length; c++) {
        if (row.chars[c].uchar.match(/\s/) && indenting) {
          indent++;
        } else {
          text += row.chars[c].uchar;
          indenting = false;
        }
      }
      // To be used for cleaning-up orphaned roll-up captions
      row.cueStartTime = startTime;

      // Give a slight bump to the endTime if it's equal to startTime to avoid a SyntaxError in IE
      if (startTime === endTime) {
        endTime += 0.0001;
      }

      cue = new VTTCue(startTime, endTime, fixLineBreaks(text.trim()));

      if (indent >= 16) {
        indent--;
      } else {
        indent++;
      }

      // VTTCue.line get's flakey when using controls, so let's now include line 13&14
      // also, drop line 1 since it's to close to the top
      if (navigator.userAgent.match(/Firefox\//)) {
        cue.line = r + 1;
      } else {
        cue.line = r > 7 ? r - 2 : r + 1;
      }

      cue.align = 'left';
      // Clamp the position between 0 and 100 - if out of these bounds, Firefox throws an exception and captions break
      cue.position = Math.max(0, Math.min(100, 100 * (indent / 32) + (navigator.userAgent.match(/Firefox\//) ? 50 : 0)));
      track.addCue(cue);
    }
  }
}
// CONCATENATED MODULE: ./src/utils/cea-608-parser.js
function cea_608_parser__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 * This code was ported from the dash.js project at:
 *   https://github.com/Dash-Industry-Forum/dash.js/blob/development/externals/cea608-parser.js
 *   https://github.com/Dash-Industry-Forum/dash.js/commit/8269b26a761e0853bb21d78780ed945144ecdd4d#diff-71bc295a2d6b6b7093a1d3290d53a4b2
 *
 * The original copyright appears below:
 *
 * The copyright in this software is being made available under the BSD License,
 * included below. This software may be subject to other third party and contributor
 * rights, including patent rights, and no such rights are granted under this license.
 *
 * Copyright (c) 2015-2016, DASH Industry Forum.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *  1. Redistributions of source code must retain the above copyright notice, this
 *  list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright notice,
 *  this list of conditions and the following disclaimer in the documentation and/or
 *  other materials provided with the distribution.
 *  2. Neither the name of Dash Industry Forum nor the names of its
 *  contributors may be used to endorse or promote products derived from this software
 *  without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS AS IS AND ANY
 *  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 *  IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 *  INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 *  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 *  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 *  WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 *  POSSIBILITY OF SUCH DAMAGE.
 */
/**
     *  Exceptions from regular ASCII. CodePoints are mapped to UTF-16 codes
     */

var specialCea608CharsCodes = {
  0x2a: 0xe1, // lowercase a, acute accent
  0x5c: 0xe9, // lowercase e, acute accent
  0x5e: 0xed, // lowercase i, acute accent
  0x5f: 0xf3, // lowercase o, acute accent
  0x60: 0xfa, // lowercase u, acute accent
  0x7b: 0xe7, // lowercase c with cedilla
  0x7c: 0xf7, // division symbol
  0x7d: 0xd1, // uppercase N tilde
  0x7e: 0xf1, // lowercase n tilde
  0x7f: 0x2588, // Full block
  // THIS BLOCK INCLUDES THE 16 EXTENDED (TWO-BYTE) LINE 21 CHARACTERS
  // THAT COME FROM HI BYTE=0x11 AND LOW BETWEEN 0x30 AND 0x3F
  // THIS MEANS THAT \x50 MUST BE ADDED TO THE VALUES
  0x80: 0xae, // Registered symbol (R)
  0x81: 0xb0, // degree sign
  0x82: 0xbd, // 1/2 symbol
  0x83: 0xbf, // Inverted (open) question mark
  0x84: 0x2122, // Trademark symbol (TM)
  0x85: 0xa2, // Cents symbol
  0x86: 0xa3, // Pounds sterling
  0x87: 0x266a, // Music 8'th note
  0x88: 0xe0, // lowercase a, grave accent
  0x89: 0x20, // transparent space (regular)
  0x8a: 0xe8, // lowercase e, grave accent
  0x8b: 0xe2, // lowercase a, circumflex accent
  0x8c: 0xea, // lowercase e, circumflex accent
  0x8d: 0xee, // lowercase i, circumflex accent
  0x8e: 0xf4, // lowercase o, circumflex accent
  0x8f: 0xfb, // lowercase u, circumflex accent
  // THIS BLOCK INCLUDES THE 32 EXTENDED (TWO-BYTE) LINE 21 CHARACTERS
  // THAT COME FROM HI BYTE=0x12 AND LOW BETWEEN 0x20 AND 0x3F
  0x90: 0xc1, // capital letter A with acute
  0x91: 0xc9, // capital letter E with acute
  0x92: 0xd3, // capital letter O with acute
  0x93: 0xda, // capital letter U with acute
  0x94: 0xdc, // capital letter U with diaresis
  0x95: 0xfc, // lowercase letter U with diaeresis
  0x96: 0x2018, // opening single quote
  0x97: 0xa1, // inverted exclamation mark
  0x98: 0x2a, // asterisk
  0x99: 0x2019, // closing single quote
  0x9a: 0x2501, // box drawings heavy horizontal
  0x9b: 0xa9, // copyright sign
  0x9c: 0x2120, // Service mark
  0x9d: 0x2022, // (round) bullet
  0x9e: 0x201c, // Left double quotation mark
  0x9f: 0x201d, // Right double quotation mark
  0xa0: 0xc0, // uppercase A, grave accent
  0xa1: 0xc2, // uppercase A, circumflex
  0xa2: 0xc7, // uppercase C with cedilla
  0xa3: 0xc8, // uppercase E, grave accent
  0xa4: 0xca, // uppercase E, circumflex
  0xa5: 0xcb, // capital letter E with diaresis
  0xa6: 0xeb, // lowercase letter e with diaresis
  0xa7: 0xce, // uppercase I, circumflex
  0xa8: 0xcf, // uppercase I, with diaresis
  0xa9: 0xef, // lowercase i, with diaresis
  0xaa: 0xd4, // uppercase O, circumflex
  0xab: 0xd9, // uppercase U, grave accent
  0xac: 0xf9, // lowercase u, grave accent
  0xad: 0xdb, // uppercase U, circumflex
  0xae: 0xab, // left-pointing double angle quotation mark
  0xaf: 0xbb, // right-pointing double angle quotation mark
  // THIS BLOCK INCLUDES THE 32 EXTENDED (TWO-BYTE) LINE 21 CHARACTERS
  // THAT COME FROM HI BYTE=0x13 AND LOW BETWEEN 0x20 AND 0x3F
  0xb0: 0xc3, // Uppercase A, tilde
  0xb1: 0xe3, // Lowercase a, tilde
  0xb2: 0xcd, // Uppercase I, acute accent
  0xb3: 0xcc, // Uppercase I, grave accent
  0xb4: 0xec, // Lowercase i, grave accent
  0xb5: 0xd2, // Uppercase O, grave accent
  0xb6: 0xf2, // Lowercase o, grave accent
  0xb7: 0xd5, // Uppercase O, tilde
  0xb8: 0xf5, // Lowercase o, tilde
  0xb9: 0x7b, // Open curly brace
  0xba: 0x7d, // Closing curly brace
  0xbb: 0x5c, // Backslash
  0xbc: 0x5e, // Caret
  0xbd: 0x5f, // Underscore
  0xbe: 0x7c, // Pipe (vertical line)
  0xbf: 0x223c, // Tilde operator
  0xc0: 0xc4, // Uppercase A, umlaut
  0xc1: 0xe4, // Lowercase A, umlaut
  0xc2: 0xd6, // Uppercase O, umlaut
  0xc3: 0xf6, // Lowercase o, umlaut
  0xc4: 0xdf, // Esszett (sharp S)
  0xc5: 0xa5, // Yen symbol
  0xc6: 0xa4, // Generic currency sign
  0xc7: 0x2503, // Box drawings heavy vertical
  0xc8: 0xc5, // Uppercase A, ring
  0xc9: 0xe5, // Lowercase A, ring
  0xca: 0xd8, // Uppercase O, stroke
  0xcb: 0xf8, // Lowercase o, strok
  0xcc: 0x250f, // Box drawings heavy down and right
  0xcd: 0x2513, // Box drawings heavy down and left
  0xce: 0x2517, // Box drawings heavy up and right
  0xcf: 0x251b // Box drawings heavy up and left
};

/**
 * Utils
 */
var getCharForByte = function getCharForByte(byte) {
  var charCode = byte;
  if (specialCea608CharsCodes.hasOwnProperty(byte)) {
    charCode = specialCea608CharsCodes[byte];
  }

  return String.fromCharCode(charCode);
};

var NR_ROWS = 15,
    NR_COLS = 100;
// Tables to look up row from PAC data
var rowsLowCh1 = { 0x11: 1, 0x12: 3, 0x15: 5, 0x16: 7, 0x17: 9, 0x10: 11, 0x13: 12, 0x14: 14 };
var rowsHighCh1 = { 0x11: 2, 0x12: 4, 0x15: 6, 0x16: 8, 0x17: 10, 0x13: 13, 0x14: 15 };
var rowsLowCh2 = { 0x19: 1, 0x1A: 3, 0x1D: 5, 0x1E: 7, 0x1F: 9, 0x18: 11, 0x1B: 12, 0x1C: 14 };
var rowsHighCh2 = { 0x19: 2, 0x1A: 4, 0x1D: 6, 0x1E: 8, 0x1F: 10, 0x1B: 13, 0x1C: 15 };

var backgroundColors = ['white', 'green', 'blue', 'cyan', 'red', 'yellow', 'magenta', 'black', 'transparent'];

/**
 * Simple logger class to be able to write with time-stamps and filter on level.
 */
var cea_608_parser_logger = {
  verboseFilter: { 'DATA': 3, 'DEBUG': 3, 'INFO': 2, 'WARNING': 2, 'TEXT': 1, 'ERROR': 0 },
  time: null,
  verboseLevel: 0, // Only write errors
  setTime: function setTime(newTime) {
    this.time = newTime;
  },
  log: function log(severity, msg) {
    var minLevel = this.verboseFilter[severity];
    if (this.verboseLevel >= minLevel) {
      // console.log(this.time + ' [' + severity + '] ' + msg);
    }
  }
};

var numArrayToHexArray = function numArrayToHexArray(numArray) {
  var hexArray = [];
  for (var j = 0; j < numArray.length; j++) {
    hexArray.push(numArray[j].toString(16));
  }

  return hexArray;
};

var PenState = function () {
  function PenState(foreground, underline, italics, background, flash) {
    cea_608_parser__classCallCheck(this, PenState);

    this.foreground = foreground || 'white';
    this.underline = underline || false;
    this.italics = italics || false;
    this.background = background || 'black';
    this.flash = flash || false;
  }

  PenState.prototype.reset = function reset() {
    this.foreground = 'white';
    this.underline = false;
    this.italics = false;
    this.background = 'black';
    this.flash = false;
  };

  PenState.prototype.setStyles = function setStyles(styles) {
    var attribs = ['foreground', 'underline', 'italics', 'background', 'flash'];
    for (var i = 0; i < attribs.length; i++) {
      var style = attribs[i];
      if (styles.hasOwnProperty(style)) {
        this[style] = styles[style];
      }
    }
  };

  PenState.prototype.isDefault = function isDefault() {
    return this.foreground === 'white' && !this.underline && !this.italics && this.background === 'black' && !this.flash;
  };

  PenState.prototype.equals = function equals(other) {
    return this.foreground === other.foreground && this.underline === other.underline && this.italics === other.italics && this.background === other.background && this.flash === other.flash;
  };

  PenState.prototype.copy = function copy(newPenState) {
    this.foreground = newPenState.foreground;
    this.underline = newPenState.underline;
    this.italics = newPenState.italics;
    this.background = newPenState.background;
    this.flash = newPenState.flash;
  };

  PenState.prototype.toString = function toString() {
    return 'color=' + this.foreground + ', underline=' + this.underline + ', italics=' + this.italics + ', background=' + this.background + ', flash=' + this.flash;
  };

  return PenState;
}();

/**
 * Unicode character with styling and background.
 * @constructor
 */


var StyledUnicodeChar = function () {
  function StyledUnicodeChar(uchar, foreground, underline, italics, background, flash) {
    cea_608_parser__classCallCheck(this, StyledUnicodeChar);

    this.uchar = uchar || ' '; // unicode character
    this.penState = new PenState(foreground, underline, italics, background, flash);
  }

  StyledUnicodeChar.prototype.reset = function reset() {
    this.uchar = ' ';
    this.penState.reset();
  };

  StyledUnicodeChar.prototype.setChar = function setChar(uchar, newPenState) {
    this.uchar = uchar;
    this.penState.copy(newPenState);
  };

  StyledUnicodeChar.prototype.setPenState = function setPenState(newPenState) {
    this.penState.copy(newPenState);
  };

  StyledUnicodeChar.prototype.equals = function equals(other) {
    return this.uchar === other.uchar && this.penState.equals(other.penState);
  };

  StyledUnicodeChar.prototype.copy = function copy(newChar) {
    this.uchar = newChar.uchar;
    this.penState.copy(newChar.penState);
  };

  StyledUnicodeChar.prototype.isEmpty = function isEmpty() {
    return this.uchar === ' ' && this.penState.isDefault();
  };

  return StyledUnicodeChar;
}();

/**
 * CEA-608 row consisting of NR_COLS instances of StyledUnicodeChar.
 * @constructor
 */


var Row = function () {
  function Row() {
    cea_608_parser__classCallCheck(this, Row);

    this.chars = [];
    for (var i = 0; i < NR_COLS; i++) {
      this.chars.push(new StyledUnicodeChar());
    }

    this.pos = 0;
    this.currPenState = new PenState();
  }

  Row.prototype.equals = function equals(other) {
    var equal = true;
    for (var i = 0; i < NR_COLS; i++) {
      if (!this.chars[i].equals(other.chars[i])) {
        equal = false;
        break;
      }
    }
    return equal;
  };

  Row.prototype.copy = function copy(other) {
    for (var i = 0; i < NR_COLS; i++) {
      this.chars[i].copy(other.chars[i]);
    }
  };

  Row.prototype.isEmpty = function isEmpty() {
    var empty = true;
    for (var i = 0; i < NR_COLS; i++) {
      if (!this.chars[i].isEmpty()) {
        empty = false;
        break;
      }
    }
    return empty;
  };

  /**
     *  Set the cursor to a valid column.
     */


  Row.prototype.setCursor = function setCursor(absPos) {
    if (this.pos !== absPos) {
      this.pos = absPos;
    }

    if (this.pos < 0) {
      cea_608_parser_logger.log('ERROR', 'Negative cursor position ' + this.pos);
      this.pos = 0;
    } else if (this.pos > NR_COLS) {
      cea_608_parser_logger.log('ERROR', 'Too large cursor position ' + this.pos);
      this.pos = NR_COLS;
    }
  };

  /**
     * Move the cursor relative to current position.
     */


  Row.prototype.moveCursor = function moveCursor(relPos) {
    var newPos = this.pos + relPos;
    if (relPos > 1) {
      for (var i = this.pos + 1; i < newPos + 1; i++) {
        this.chars[i].setPenState(this.currPenState);
      }
    }
    this.setCursor(newPos);
  };

  /**
     * Backspace, move one step back and clear character.
     */


  Row.prototype.backSpace = function backSpace() {
    this.moveCursor(-1);
    this.chars[this.pos].setChar(' ', this.currPenState);
  };

  Row.prototype.insertChar = function insertChar(byte) {
    if (byte >= 0x90) {
      // Extended char
      this.backSpace();
    }
    var char = getCharForByte(byte);
    if (this.pos >= NR_COLS) {
      cea_608_parser_logger.log('ERROR', 'Cannot insert ' + byte.toString(16) + ' (' + char + ') at position ' + this.pos + '. Skipping it!');
      return;
    }
    this.chars[this.pos].setChar(char, this.currPenState);
    this.moveCursor(1);
  };

  Row.prototype.clearFromPos = function clearFromPos(startPos) {
    var i = void 0;
    for (i = startPos; i < NR_COLS; i++) {
      this.chars[i].reset();
    }
  };

  Row.prototype.clear = function clear() {
    this.clearFromPos(0);
    this.pos = 0;
    this.currPenState.reset();
  };

  Row.prototype.clearToEndOfRow = function clearToEndOfRow() {
    this.clearFromPos(this.pos);
  };

  Row.prototype.getTextString = function getTextString() {
    var chars = [];
    var empty = true;
    for (var i = 0; i < NR_COLS; i++) {
      var char = this.chars[i].uchar;
      if (char !== ' ') {
        empty = false;
      }

      chars.push(char);
    }
    if (empty) {
      return '';
    } else {
      return chars.join('');
    }
  };

  Row.prototype.setPenStyles = function setPenStyles(styles) {
    this.currPenState.setStyles(styles);
    var currChar = this.chars[this.pos];
    currChar.setPenState(this.currPenState);
  };

  return Row;
}();

/**
 * Keep a CEA-608 screen of 32x15 styled characters
 * @constructor
*/


var CaptionScreen = function () {
  function CaptionScreen() {
    cea_608_parser__classCallCheck(this, CaptionScreen);

    this.rows = [];
    for (var i = 0; i < NR_ROWS; i++) {
      this.rows.push(new Row());
    } // Note that we use zero-based numbering (0-14)

    this.currRow = NR_ROWS - 1;
    this.nrRollUpRows = null;
    this.reset();
  }

  CaptionScreen.prototype.reset = function reset() {
    for (var i = 0; i < NR_ROWS; i++) {
      this.rows[i].clear();
    }

    this.currRow = NR_ROWS - 1;
  };

  CaptionScreen.prototype.equals = function equals(other) {
    var equal = true;
    for (var i = 0; i < NR_ROWS; i++) {
      if (!this.rows[i].equals(other.rows[i])) {
        equal = false;
        break;
      }
    }
    return equal;
  };

  CaptionScreen.prototype.copy = function copy(other) {
    for (var i = 0; i < NR_ROWS; i++) {
      this.rows[i].copy(other.rows[i]);
    }
  };

  CaptionScreen.prototype.isEmpty = function isEmpty() {
    var empty = true;
    for (var i = 0; i < NR_ROWS; i++) {
      if (!this.rows[i].isEmpty()) {
        empty = false;
        break;
      }
    }
    return empty;
  };

  CaptionScreen.prototype.backSpace = function backSpace() {
    var row = this.rows[this.currRow];
    row.backSpace();
  };

  CaptionScreen.prototype.clearToEndOfRow = function clearToEndOfRow() {
    var row = this.rows[this.currRow];
    row.clearToEndOfRow();
  };

  /**
     * Insert a character (without styling) in the current row.
     */


  CaptionScreen.prototype.insertChar = function insertChar(char) {
    var row = this.rows[this.currRow];
    row.insertChar(char);
  };

  CaptionScreen.prototype.setPen = function setPen(styles) {
    var row = this.rows[this.currRow];
    row.setPenStyles(styles);
  };

  CaptionScreen.prototype.moveCursor = function moveCursor(relPos) {
    var row = this.rows[this.currRow];
    row.moveCursor(relPos);
  };

  CaptionScreen.prototype.setCursor = function setCursor(absPos) {
    cea_608_parser_logger.log('INFO', 'setCursor: ' + absPos);
    var row = this.rows[this.currRow];
    row.setCursor(absPos);
  };

  CaptionScreen.prototype.setPAC = function setPAC(pacData) {
    cea_608_parser_logger.log('INFO', 'pacData = ' + JSON.stringify(pacData));
    var newRow = pacData.row - 1;
    if (this.nrRollUpRows && newRow < this.nrRollUpRows - 1) {
      newRow = this.nrRollUpRows - 1;
    }

    // Make sure this only affects Roll-up Captions by checking this.nrRollUpRows
    if (this.nrRollUpRows && this.currRow !== newRow) {
      // clear all rows first
      for (var i = 0; i < NR_ROWS; i++) {
        this.rows[i].clear();
      }

      // Copy this.nrRollUpRows rows from lastOutputScreen and place it in the newRow location
      // topRowIndex - the start of rows to copy (inclusive index)
      var topRowIndex = this.currRow + 1 - this.nrRollUpRows;
      // We only copy if the last position was already shown.
      // We use the cueStartTime value to check this.
      var lastOutputScreen = this.lastOutputScreen;
      if (lastOutputScreen) {
        var prevLineTime = lastOutputScreen.rows[topRowIndex].cueStartTime;
        if (prevLineTime && prevLineTime < cea_608_parser_logger.time) {
          for (var _i = 0; _i < this.nrRollUpRows; _i++) {
            this.rows[newRow - this.nrRollUpRows + _i + 1].copy(lastOutputScreen.rows[topRowIndex + _i]);
          }
        }
      }
    }

    this.currRow = newRow;
    var row = this.rows[this.currRow];
    if (pacData.indent !== null) {
      var indent = pacData.indent;
      var prevPos = Math.max(indent - 1, 0);
      row.setCursor(pacData.indent);
      pacData.color = row.chars[prevPos].penState.foreground;
    }
    var styles = { foreground: pacData.color, underline: pacData.underline, italics: pacData.italics, background: 'black', flash: false };
    this.setPen(styles);
  };

  /**
     * Set background/extra foreground, but first do back_space, and then insert space (backwards compatibility).
     */


  CaptionScreen.prototype.setBkgData = function setBkgData(bkgData) {
    cea_608_parser_logger.log('INFO', 'bkgData = ' + JSON.stringify(bkgData));
    this.backSpace();
    this.setPen(bkgData);
    this.insertChar(0x20); // Space
  };

  CaptionScreen.prototype.setRollUpRows = function setRollUpRows(nrRows) {
    this.nrRollUpRows = nrRows;
  };

  CaptionScreen.prototype.rollUp = function rollUp() {
    if (this.nrRollUpRows === null) {
      cea_608_parser_logger.log('DEBUG', 'roll_up but nrRollUpRows not set yet');
      return; // Not properly setup
    }
    cea_608_parser_logger.log('TEXT', this.getDisplayText());
    var topRowIndex = this.currRow + 1 - this.nrRollUpRows;
    var topRow = this.rows.splice(topRowIndex, 1)[0];
    topRow.clear();
    this.rows.splice(this.currRow, 0, topRow);
    cea_608_parser_logger.log('INFO', 'Rolling up');
    // logger.log('TEXT', this.get_display_text())
  };

  /**
    * Get all non-empty rows with as unicode text.
    */


  CaptionScreen.prototype.getDisplayText = function getDisplayText(asOneRow) {
    asOneRow = asOneRow || false;
    var displayText = [];
    var text = '';
    var rowNr = -1;
    for (var i = 0; i < NR_ROWS; i++) {
      var rowText = this.rows[i].getTextString();
      if (rowText) {
        rowNr = i + 1;
        if (asOneRow) {
          displayText.push('Row ' + rowNr + ': \'' + rowText + '\'');
        } else {
          displayText.push(rowText.trim());
        }
      }
    }
    if (displayText.length > 0) {
      if (asOneRow) {
        text = '[' + displayText.join(' | ') + ']';
      } else {
        text = displayText.join('\n');
      }
    }
    return text;
  };

  CaptionScreen.prototype.getTextAndFormat = function getTextAndFormat() {
    return this.rows;
  };

  return CaptionScreen;
}();

// var modes = ['MODE_ROLL-UP', 'MODE_POP-ON', 'MODE_PAINT-ON', 'MODE_TEXT'];

var Cea608Channel = function () {
  function Cea608Channel(channelNumber, outputFilter) {
    cea_608_parser__classCallCheck(this, Cea608Channel);

    this.chNr = channelNumber;
    this.outputFilter = outputFilter;
    this.mode = null;
    this.verbose = 0;
    this.displayedMemory = new CaptionScreen();
    this.nonDisplayedMemory = new CaptionScreen();
    this.lastOutputScreen = new CaptionScreen();
    this.currRollUpRow = this.displayedMemory.rows[NR_ROWS - 1];
    this.writeScreen = this.displayedMemory;
    this.mode = null;
    this.cueStartTime = null; // Keeps track of where a cue started.
  }

  Cea608Channel.prototype.reset = function reset() {
    this.mode = null;
    this.displayedMemory.reset();
    this.nonDisplayedMemory.reset();
    this.lastOutputScreen.reset();
    this.currRollUpRow = this.displayedMemory.rows[NR_ROWS - 1];
    this.writeScreen = this.displayedMemory;
    this.mode = null;
    this.cueStartTime = null;
    this.lastCueEndTime = null;
  };

  Cea608Channel.prototype.getHandler = function getHandler() {
    return this.outputFilter;
  };

  Cea608Channel.prototype.setHandler = function setHandler(newHandler) {
    this.outputFilter = newHandler;
  };

  Cea608Channel.prototype.setPAC = function setPAC(pacData) {
    this.writeScreen.setPAC(pacData);
  };

  Cea608Channel.prototype.setBkgData = function setBkgData(bkgData) {
    this.writeScreen.setBkgData(bkgData);
  };

  Cea608Channel.prototype.setMode = function setMode(newMode) {
    if (newMode === this.mode) {
      return;
    }

    this.mode = newMode;
    cea_608_parser_logger.log('INFO', 'MODE=' + newMode);
    if (this.mode === 'MODE_POP-ON') {
      this.writeScreen = this.nonDisplayedMemory;
    } else {
      this.writeScreen = this.displayedMemory;
      this.writeScreen.reset();
    }
    if (this.mode !== 'MODE_ROLL-UP') {
      this.displayedMemory.nrRollUpRows = null;
      this.nonDisplayedMemory.nrRollUpRows = null;
    }
    this.mode = newMode;
  };

  Cea608Channel.prototype.insertChars = function insertChars(chars) {
    for (var i = 0; i < chars.length; i++) {
      this.writeScreen.insertChar(chars[i]);
    }

    var screen = this.writeScreen === this.displayedMemory ? 'DISP' : 'NON_DISP';
    cea_608_parser_logger.log('INFO', screen + ': ' + this.writeScreen.getDisplayText(true));
    if (this.mode === 'MODE_PAINT-ON' || this.mode === 'MODE_ROLL-UP') {
      cea_608_parser_logger.log('TEXT', 'DISPLAYED: ' + this.displayedMemory.getDisplayText(true));
      this.outputDataUpdate();
    }
  };

  Cea608Channel.prototype.ccRCL = function ccRCL() {
    // Resume Caption Loading (switch mode to Pop On)
    cea_608_parser_logger.log('INFO', 'RCL - Resume Caption Loading');
    this.setMode('MODE_POP-ON');
  };

  Cea608Channel.prototype.ccBS = function ccBS() {
    // BackSpace
    cea_608_parser_logger.log('INFO', 'BS - BackSpace');
    if (this.mode === 'MODE_TEXT') {
      return;
    }

    this.writeScreen.backSpace();
    if (this.writeScreen === this.displayedMemory) {
      this.outputDataUpdate();
    }
  };

  Cea608Channel.prototype.ccAOF = function ccAOF() {// Reserved (formerly Alarm Off)

  };

  Cea608Channel.prototype.ccAON = function ccAON() {// Reserved (formerly Alarm On)

  };

  Cea608Channel.prototype.ccDER = function ccDER() {
    // Delete to End of Row
    cea_608_parser_logger.log('INFO', 'DER- Delete to End of Row');
    this.writeScreen.clearToEndOfRow();
    this.outputDataUpdate();
  };

  Cea608Channel.prototype.ccRU = function ccRU(nrRows) {
    // Roll-Up Captions-2,3,or 4 Rows
    cea_608_parser_logger.log('INFO', 'RU(' + nrRows + ') - Roll Up');
    this.writeScreen = this.displayedMemory;
    this.setMode('MODE_ROLL-UP');
    this.writeScreen.setRollUpRows(nrRows);
  };

  Cea608Channel.prototype.ccFON = function ccFON() {
    // Flash On
    cea_608_parser_logger.log('INFO', 'FON - Flash On');
    this.writeScreen.setPen({ flash: true });
  };

  Cea608Channel.prototype.ccRDC = function ccRDC() {
    // Resume Direct Captioning (switch mode to PaintOn)
    cea_608_parser_logger.log('INFO', 'RDC - Resume Direct Captioning');
    this.setMode('MODE_PAINT-ON');
  };

  Cea608Channel.prototype.ccTR = function ccTR() {
    // Text Restart in text mode (not supported, however)
    cea_608_parser_logger.log('INFO', 'TR');
    this.setMode('MODE_TEXT');
  };

  Cea608Channel.prototype.ccRTD = function ccRTD() {
    // Resume Text Display in Text mode (not supported, however)
    cea_608_parser_logger.log('INFO', 'RTD');
    this.setMode('MODE_TEXT');
  };

  Cea608Channel.prototype.ccEDM = function ccEDM() {
    // Erase Displayed Memory
    cea_608_parser_logger.log('INFO', 'EDM - Erase Displayed Memory');
    this.displayedMemory.reset();
    this.outputDataUpdate(true);
  };

  Cea608Channel.prototype.ccCR = function ccCR() {
    // Carriage Return
    cea_608_parser_logger.log('CR - Carriage Return');
    this.writeScreen.rollUp();
    this.outputDataUpdate(true);
  };

  Cea608Channel.prototype.ccENM = function ccENM() {
    // Erase Non-Displayed Memory
    cea_608_parser_logger.log('INFO', 'ENM - Erase Non-displayed Memory');
    this.nonDisplayedMemory.reset();
  };

  Cea608Channel.prototype.ccEOC = function ccEOC() {
    // End of Caption (Flip Memories)
    cea_608_parser_logger.log('INFO', 'EOC - End Of Caption');
    if (this.mode === 'MODE_POP-ON') {
      var tmp = this.displayedMemory;
      this.displayedMemory = this.nonDisplayedMemory;
      this.nonDisplayedMemory = tmp;
      this.writeScreen = this.nonDisplayedMemory;
      cea_608_parser_logger.log('TEXT', 'DISP: ' + this.displayedMemory.getDisplayText());
    }
    this.outputDataUpdate(true);
  };

  Cea608Channel.prototype.ccTO = function ccTO(nrCols) {
    // Tab Offset 1,2, or 3 columns
    cea_608_parser_logger.log('INFO', 'TO(' + nrCols + ') - Tab Offset');
    this.writeScreen.moveCursor(nrCols);
  };

  Cea608Channel.prototype.ccMIDROW = function ccMIDROW(secondByte) {
    // Parse MIDROW command
    var styles = { flash: false };
    styles.underline = secondByte % 2 === 1;
    styles.italics = secondByte >= 0x2e;
    if (!styles.italics) {
      var colorIndex = Math.floor(secondByte / 2) - 0x10;
      var colors = ['white', 'green', 'blue', 'cyan', 'red', 'yellow', 'magenta'];
      styles.foreground = colors[colorIndex];
    } else {
      styles.foreground = 'white';
    }
    cea_608_parser_logger.log('INFO', 'MIDROW: ' + JSON.stringify(styles));
    this.writeScreen.setPen(styles);
  };

  Cea608Channel.prototype.outputDataUpdate = function outputDataUpdate() {
    var dispatch = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    var t = cea_608_parser_logger.time;
    if (t === null) {
      return;
    }

    if (this.outputFilter) {
      if (this.cueStartTime === null && !this.displayedMemory.isEmpty()) {
        // Start of a new cue
        this.cueStartTime = t;
      } else {
        if (!this.displayedMemory.equals(this.lastOutputScreen)) {
          if (this.outputFilter.newCue) {
            this.outputFilter.newCue(this.cueStartTime, t, this.lastOutputScreen);
            if (dispatch === true && this.outputFilter.dispatchCue) {
              this.outputFilter.dispatchCue();
            }
          }
          this.cueStartTime = this.displayedMemory.isEmpty() ? null : t;
        }
      }
      this.lastOutputScreen.copy(this.displayedMemory);
    }
  };

  Cea608Channel.prototype.cueSplitAtTime = function cueSplitAtTime(t) {
    if (this.outputFilter) {
      if (!this.displayedMemory.isEmpty()) {
        if (this.outputFilter.newCue) {
          this.outputFilter.newCue(this.cueStartTime, t, this.displayedMemory);
        }

        this.cueStartTime = t;
      }
    }
  };

  return Cea608Channel;
}();

var Cea608Parser = function () {
  function Cea608Parser(field, out1, out2) {
    cea_608_parser__classCallCheck(this, Cea608Parser);

    this.field = field || 1;
    this.outputs = [out1, out2];
    this.channels = [new Cea608Channel(1, out1), new Cea608Channel(2, out2)];
    this.currChNr = -1; // Will be 1 or 2
    this.lastCmdA = null; // First byte of last command
    this.lastCmdB = null; // Second byte of last command
    this.bufferedData = [];
    this.startTime = null;
    this.lastTime = null;
    this.dataCounters = { 'padding': 0, 'char': 0, 'cmd': 0, 'other': 0 };
  }

  Cea608Parser.prototype.getHandler = function getHandler(index) {
    return this.channels[index].getHandler();
  };

  Cea608Parser.prototype.setHandler = function setHandler(index, newHandler) {
    this.channels[index].setHandler(newHandler);
  };

  /**
     * Add data for time t in forms of list of bytes (unsigned ints). The bytes are treated as pairs.
     */


  Cea608Parser.prototype.addData = function addData(t, byteList) {
    var cmdFound = void 0,
        a = void 0,
        b = void 0,
        charsFound = false;

    this.lastTime = t;
    cea_608_parser_logger.setTime(t);

    for (var i = 0; i < byteList.length; i += 2) {
      a = byteList[i] & 0x7f;
      b = byteList[i + 1] & 0x7f;
      if (a === 0 && b === 0) {
        this.dataCounters.padding += 2;
        continue;
      } else {
        cea_608_parser_logger.log('DATA', '[' + numArrayToHexArray([byteList[i], byteList[i + 1]]) + '] -> (' + numArrayToHexArray([a, b]) + ')');
      }
      cmdFound = this.parseCmd(a, b);
      if (!cmdFound) {
        cmdFound = this.parseMidrow(a, b);
      }

      if (!cmdFound) {
        cmdFound = this.parsePAC(a, b);
      }

      if (!cmdFound) {
        cmdFound = this.parseBackgroundAttributes(a, b);
      }

      if (!cmdFound) {
        charsFound = this.parseChars(a, b);
        if (charsFound) {
          if (this.currChNr && this.currChNr >= 0) {
            var channel = this.channels[this.currChNr - 1];
            channel.insertChars(charsFound);
          } else {
            cea_608_parser_logger.log('WARNING', 'No channel found yet. TEXT-MODE?');
          }
        }
      }
      if (cmdFound) {
        this.dataCounters.cmd += 2;
      } else if (charsFound) {
        this.dataCounters.char += 2;
      } else {
        this.dataCounters.other += 2;
        cea_608_parser_logger.log('WARNING', 'Couldn\'t parse cleaned data ' + numArrayToHexArray([a, b]) + ' orig: ' + numArrayToHexArray([byteList[i], byteList[i + 1]]));
      }
    }
  };

  /**
     * Parse Command.
     * @returns {Boolean} Tells if a command was found
     */


  Cea608Parser.prototype.parseCmd = function parseCmd(a, b) {
    var chNr = null;

    var cond1 = (a === 0x14 || a === 0x1C) && b >= 0x20 && b <= 0x2F;
    var cond2 = (a === 0x17 || a === 0x1F) && b >= 0x21 && b <= 0x23;
    if (!(cond1 || cond2)) {
      return false;
    }

    if (a === this.lastCmdA && b === this.lastCmdB) {
      this.lastCmdA = null;
      this.lastCmdB = null; // Repeated commands are dropped (once)
      cea_608_parser_logger.log('DEBUG', 'Repeated command (' + numArrayToHexArray([a, b]) + ') is dropped');
      return true;
    }

    if (a === 0x14 || a === 0x17) {
      chNr = 1;
    } else {
      chNr = 2;
    } // (a === 0x1C || a=== 0x1f)

    var channel = this.channels[chNr - 1];

    if (a === 0x14 || a === 0x1C) {
      if (b === 0x20) {
        channel.ccRCL();
      } else if (b === 0x21) {
        channel.ccBS();
      } else if (b === 0x22) {
        channel.ccAOF();
      } else if (b === 0x23) {
        channel.ccAON();
      } else if (b === 0x24) {
        channel.ccDER();
      } else if (b === 0x25) {
        channel.ccRU(2);
      } else if (b === 0x26) {
        channel.ccRU(3);
      } else if (b === 0x27) {
        channel.ccRU(4);
      } else if (b === 0x28) {
        channel.ccFON();
      } else if (b === 0x29) {
        channel.ccRDC();
      } else if (b === 0x2A) {
        channel.ccTR();
      } else if (b === 0x2B) {
        channel.ccRTD();
      } else if (b === 0x2C) {
        channel.ccEDM();
      } else if (b === 0x2D) {
        channel.ccCR();
      } else if (b === 0x2E) {
        channel.ccENM();
      } else if (b === 0x2F) {
        channel.ccEOC();
      }
    } else {
      // a == 0x17 || a == 0x1F
      channel.ccTO(b - 0x20);
    }
    this.lastCmdA = a;
    this.lastCmdB = b;
    this.currChNr = chNr;
    return true;
  };

  /**
     * Parse midrow styling command
     * @returns {Boolean}
     */


  Cea608Parser.prototype.parseMidrow = function parseMidrow(a, b) {
    var chNr = null;

    if ((a === 0x11 || a === 0x19) && b >= 0x20 && b <= 0x2f) {
      if (a === 0x11) {
        chNr = 1;
      } else {
        chNr = 2;
      }

      if (chNr !== this.currChNr) {
        cea_608_parser_logger.log('ERROR', 'Mismatch channel in midrow parsing');
        return false;
      }
      var channel = this.channels[chNr - 1];
      channel.ccMIDROW(b);
      cea_608_parser_logger.log('DEBUG', 'MIDROW (' + numArrayToHexArray([a, b]) + ')');
      return true;
    }
    return false;
  };
  /**
     * Parse Preable Access Codes (Table 53).
     * @returns {Boolean} Tells if PAC found
     */


  Cea608Parser.prototype.parsePAC = function parsePAC(a, b) {
    var chNr = null;
    var row = null;

    var case1 = (a >= 0x11 && a <= 0x17 || a >= 0x19 && a <= 0x1F) && b >= 0x40 && b <= 0x7F;
    var case2 = (a === 0x10 || a === 0x18) && b >= 0x40 && b <= 0x5F;
    if (!(case1 || case2)) {
      return false;
    }

    if (a === this.lastCmdA && b === this.lastCmdB) {
      this.lastCmdA = null;
      this.lastCmdB = null;
      return true; // Repeated commands are dropped (once)
    }

    chNr = a <= 0x17 ? 1 : 2;

    if (b >= 0x40 && b <= 0x5F) {
      row = chNr === 1 ? rowsLowCh1[a] : rowsLowCh2[a];
    } else {
      // 0x60 <= b <= 0x7F
      row = chNr === 1 ? rowsHighCh1[a] : rowsHighCh2[a];
    }
    var pacData = this.interpretPAC(row, b);
    var channel = this.channels[chNr - 1];
    channel.setPAC(pacData);
    this.lastCmdA = a;
    this.lastCmdB = b;
    this.currChNr = chNr;
    return true;
  };

  /**
     * Interpret the second byte of the pac, and return the information.
     * @returns {Object} pacData with style parameters.
     */


  Cea608Parser.prototype.interpretPAC = function interpretPAC(row, byte) {
    var pacIndex = byte;
    var pacData = { color: null, italics: false, indent: null, underline: false, row: row };

    if (byte > 0x5F) {
      pacIndex = byte - 0x60;
    } else {
      pacIndex = byte - 0x40;
    }

    pacData.underline = (pacIndex & 1) === 1;
    if (pacIndex <= 0xd) {
      pacData.color = ['white', 'green', 'blue', 'cyan', 'red', 'yellow', 'magenta', 'white'][Math.floor(pacIndex / 2)];
    } else if (pacIndex <= 0xf) {
      pacData.italics = true;
      pacData.color = 'white';
    } else {
      pacData.indent = Math.floor((pacIndex - 0x10) / 2) * 4;
    }
    return pacData; // Note that row has zero offset. The spec uses 1.
  };

  /**
     * Parse characters.
     * @returns An array with 1 to 2 codes corresponding to chars, if found. null otherwise.
     */


  Cea608Parser.prototype.parseChars = function parseChars(a, b) {
    var channelNr = null,
        charCodes = null,
        charCode1 = null;

    if (a >= 0x19) {
      channelNr = 2;
      charCode1 = a - 8;
    } else {
      channelNr = 1;
      charCode1 = a;
    }
    if (charCode1 >= 0x11 && charCode1 <= 0x13) {
      // Special character
      var oneCode = b;
      if (charCode1 === 0x11) {
        oneCode = b + 0x50;
      } else if (charCode1 === 0x12) {
        oneCode = b + 0x70;
      } else {
        oneCode = b + 0x90;
      }

      cea_608_parser_logger.log('INFO', 'Special char \'' + getCharForByte(oneCode) + '\' in channel ' + channelNr);
      charCodes = [oneCode];
    } else if (a >= 0x20 && a <= 0x7f) {
      charCodes = b === 0 ? [a] : [a, b];
    }
    if (charCodes) {
      var hexCodes = numArrayToHexArray(charCodes);
      cea_608_parser_logger.log('DEBUG', 'Char codes =  ' + hexCodes.join(','));
      this.lastCmdA = null;
      this.lastCmdB = null;
    }
    return charCodes;
  };

  /**
    * Parse extended background attributes as well as new foreground color black.
    * @returns{Boolean} Tells if background attributes are found
    */


  Cea608Parser.prototype.parseBackgroundAttributes = function parseBackgroundAttributes(a, b) {
    var bkgData = void 0,
        index = void 0,
        chNr = void 0,
        channel = void 0;

    var case1 = (a === 0x10 || a === 0x18) && b >= 0x20 && b <= 0x2f;
    var case2 = (a === 0x17 || a === 0x1f) && b >= 0x2d && b <= 0x2f;
    if (!(case1 || case2)) {
      return false;
    }

    bkgData = {};
    if (a === 0x10 || a === 0x18) {
      index = Math.floor((b - 0x20) / 2);
      bkgData.background = backgroundColors[index];
      if (b % 2 === 1) {
        bkgData.background = bkgData.background + '_semi';
      }
    } else if (b === 0x2d) {
      bkgData.background = 'transparent';
    } else {
      bkgData.foreground = 'black';
      if (b === 0x2f) {
        bkgData.underline = true;
      }
    }
    chNr = a < 0x18 ? 1 : 2;
    channel = this.channels[chNr - 1];
    channel.setBkgData(bkgData);
    this.lastCmdA = null;
    this.lastCmdB = null;
    return true;
  };

  /**
     * Reset state of parser and its channels.
     */


  Cea608Parser.prototype.reset = function reset() {
    for (var i = 0; i < this.channels.length; i++) {
      if (this.channels[i]) {
        this.channels[i].reset();
      }
    }
    this.lastCmdA = null;
    this.lastCmdB = null;
  };

  /**
     * Trigger the generation of a cue, and the start of a new one if displayScreens are not empty.
     */


  Cea608Parser.prototype.cueSplitAtTime = function cueSplitAtTime(t) {
    for (var i = 0; i < this.channels.length; i++) {
      if (this.channels[i]) {
        this.channels[i].cueSplitAtTime(t);
      }
    }
  };

  return Cea608Parser;
}();

/* harmony default export */ var cea_608_parser = (Cea608Parser);
// CONCATENATED MODULE: ./src/utils/output-filter.js
function output_filter__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OutputFilter = function () {
  function OutputFilter(timelineController, trackName) {
    output_filter__classCallCheck(this, OutputFilter);

    this.timelineController = timelineController;
    this.trackName = trackName;
    this.startTime = null;
    this.endTime = null;
    this.screen = null;
  }

  OutputFilter.prototype.dispatchCue = function dispatchCue() {
    if (this.startTime === null) {
      return;
    }

    this.timelineController.addCues(this.trackName, this.startTime, this.endTime, this.screen);
    this.startTime = null;
  };

  OutputFilter.prototype.newCue = function newCue(startTime, endTime, screen) {
    if (this.startTime === null || this.startTime > startTime) {
      this.startTime = startTime;
    }

    this.endTime = endTime;
    this.screen = screen;
    this.timelineController.createCaptionsTrack(this.trackName);
  };

  return OutputFilter;
}();

/* harmony default export */ var output_filter = (OutputFilter);
// CONCATENATED MODULE: ./src/utils/webvtt-parser.js



// String.prototype.startsWith is not supported in IE11
var startsWith = function startsWith(inputString, searchString, position) {
  return inputString.substr(position || 0, searchString.length) === searchString;
};

var cueString2millis = function cueString2millis(timeString) {
  var ts = parseInt(timeString.substr(-3));
  var secs = parseInt(timeString.substr(-6, 2));
  var mins = parseInt(timeString.substr(-9, 2));
  var hours = timeString.length > 9 ? parseInt(timeString.substr(0, timeString.indexOf(':'))) : 0;

  if (isNaN(ts) || isNaN(secs) || isNaN(mins) || isNaN(hours)) {
    return -1;
  }

  ts += 1000 * secs;
  ts += 60 * 1000 * mins;
  ts += 60 * 60 * 1000 * hours;

  return ts;
};

// From https://github.com/darkskyapp/string-hash
var hash = function hash(text) {
  var hash = 5381;
  var i = text.length;
  while (i) {
    hash = hash * 33 ^ text.charCodeAt(--i);
  }

  return (hash >>> 0).toString();
};

var calculateOffset = function calculateOffset(vttCCs, cc, presentationTime) {
  var currCC = vttCCs[cc];
  var prevCC = vttCCs[currCC.prevCC];

  // This is the first discontinuity or cues have been processed since the last discontinuity
  // Offset = current discontinuity time
  if (!prevCC || !prevCC.new && currCC.new) {
    vttCCs.ccOffset = vttCCs.presentationOffset = currCC.start;
    currCC.new = false;
    return;
  }

  // There have been discontinuities since cues were last parsed.
  // Offset = time elapsed
  while (prevCC && prevCC.new) {
    vttCCs.ccOffset += currCC.start - prevCC.start;
    currCC.new = false;
    currCC = prevCC;
    prevCC = vttCCs[currCC.prevCC];
  }

  vttCCs.presentationOffset = presentationTime;
};

var WebVTTParser = {
  parse: function parse(vttByteArray, syncPTS, vttCCs, cc, callBack, errorCallBack) {
    // Convert byteArray into string, replacing any somewhat exotic linefeeds with "\n", then split on that character.
    var re = /\r\n|\n\r|\n|\r/g;
    // Uint8Array.prototype.reduce is not implemented in IE11
    var vttLines = Object(id3["b" /* utf8ArrayToStr */])(new Uint8Array(vttByteArray)).trim().replace(re, '\n').split('\n');

    var cueTime = '00:00.000';
    var mpegTs = 0;
    var localTime = 0;
    var presentationTime = 0;
    var cues = [];
    var parsingError = void 0;
    var inHeader = true;
    // let VTTCue = VTTCue || window.TextTrackCue;

    // Create parser object using VTTCue with TextTrackCue fallback on certain browsers.
    var parser = new vttparser();

    parser.oncue = function (cue) {
      // Adjust cue timing; clamp cues to start no earlier than - and drop cues that don't end after - 0 on timeline.
      var currCC = vttCCs[cc];
      var cueOffset = vttCCs.ccOffset;

      // Update offsets for new discontinuities
      if (currCC && currCC.new) {
        if (localTime !== undefined) {
          // When local time is provided, offset = discontinuity start time - local time
          cueOffset = vttCCs.ccOffset = currCC.start;
        } else {
          calculateOffset(vttCCs, cc, presentationTime);
        }
      }

      if (presentationTime) {
        // If we have MPEGTS, offset = presentation time + discontinuity offset
        cueOffset = presentationTime + vttCCs.ccOffset - vttCCs.presentationOffset;
      }

      cue.startTime += cueOffset - localTime;
      cue.endTime += cueOffset - localTime;

      // Create a unique hash id for a cue based on start/end times and text.
      // This helps timeline-controller to avoid showing repeated captions.
      cue.id = hash(cue.startTime.toString()) + hash(cue.endTime.toString()) + hash(cue.text);

      // Fix encoding of special characters. TODO: Test with all sorts of weird characters.
      cue.text = decodeURIComponent(encodeURIComponent(cue.text));
      if (cue.endTime > 0) {
        cues.push(cue);
      }
    };

    parser.onparsingerror = function (e) {
      parsingError = e;
    };

    parser.onflush = function () {
      if (parsingError && errorCallBack) {
        errorCallBack(parsingError);
        return;
      }
      callBack(cues);
    };

    // Go through contents line by line.
    vttLines.forEach(function (line) {
      if (inHeader) {
        // Look for X-TIMESTAMP-MAP in header.
        if (startsWith(line, 'X-TIMESTAMP-MAP=')) {
          // Once found, no more are allowed anyway, so stop searching.
          inHeader = false;
          // Extract LOCAL and MPEGTS.
          line.substr(16).split(',').forEach(function (timestamp) {
            if (startsWith(timestamp, 'LOCAL:')) {
              cueTime = timestamp.substr(6);
            } else if (startsWith(timestamp, 'MPEGTS:')) {
              mpegTs = parseInt(timestamp.substr(7));
            }
          });
          try {
            // Calculate subtitle offset in milliseconds.
            // If sync PTS is less than zero, we have a 33-bit wraparound, which is fixed by adding 2^33 = 8589934592.
            syncPTS = syncPTS < 0 ? syncPTS + 8589934592 : syncPTS;
            // Adjust MPEGTS by sync PTS.
            mpegTs -= syncPTS;
            // Convert cue time to seconds
            localTime = cueString2millis(cueTime) / 1000;
            // Convert MPEGTS to seconds from 90kHz.
            presentationTime = mpegTs / 90000;

            if (localTime === -1) {
              parsingError = new Error('Malformed X-TIMESTAMP-MAP: ' + line);
            }
          } catch (e) {
            parsingError = new Error('Malformed X-TIMESTAMP-MAP: ' + line);
          }
          // Return without parsing X-TIMESTAMP-MAP line.
          return;
        } else if (line === '') {
          inHeader = false;
        }
      }
      // Parse line by default.
      parser.parse(line + '\n');
    });

    parser.flush();
  }
};

/* harmony default export */ var webvtt_parser = (WebVTTParser);
// CONCATENATED MODULE: ./src/controller/timeline-controller.js
function timeline_controller__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function timeline_controller__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function timeline_controller__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * Timeline Controller
*/









function reuseVttTextTrack(inUseTrack, manifestTrack) {
  return inUseTrack && inUseTrack.label === manifestTrack.name && !(inUseTrack.textTrack1 || inUseTrack.textTrack2);
}

function intersection(x1, x2, y1, y2) {
  return Math.min(x2, y2) - Math.max(x1, y1);
}

var timeline_controller_TimelineController = function (_EventHandler) {
  timeline_controller__inherits(TimelineController, _EventHandler);

  function TimelineController(hls) {
    timeline_controller__classCallCheck(this, TimelineController);

    var _this = timeline_controller__possibleConstructorReturn(this, _EventHandler.call(this, hls, events["a" /* default */].MEDIA_ATTACHING, events["a" /* default */].MEDIA_DETACHING, events["a" /* default */].FRAG_PARSING_USERDATA, events["a" /* default */].FRAG_DECRYPTED, events["a" /* default */].MANIFEST_LOADING, events["a" /* default */].MANIFEST_LOADED, events["a" /* default */].FRAG_LOADED, events["a" /* default */].LEVEL_SWITCHING, events["a" /* default */].INIT_PTS_FOUND));

    _this.hls = hls;
    _this.config = hls.config;
    _this.enabled = true;
    _this.Cues = hls.config.cueHandler;
    _this.textTracks = [];
    _this.tracks = [];
    _this.unparsedVttFrags = [];
    _this.initPTS = undefined;
    _this.cueRanges = [];
    _this.captionsTracks = {};

    _this.captionsProperties = {
      textTrack1: {
        label: _this.config.captionsTextTrack1Label,
        languageCode: _this.config.captionsTextTrack1LanguageCode
      },
      textTrack2: {
        label: _this.config.captionsTextTrack2Label,
        languageCode: _this.config.captionsTextTrack2LanguageCode
      }
    };

    if (_this.config.enableCEA708Captions) {
      var channel1 = new output_filter(_this, 'textTrack1');
      var channel2 = new output_filter(_this, 'textTrack2');

      _this.cea608Parser = new cea_608_parser(0, channel1, channel2);
    }
    return _this;
  }

  TimelineController.prototype.addCues = function addCues(trackName, startTime, endTime, screen) {
    // skip cues which overlap more than 50% with previously parsed time ranges
    var ranges = this.cueRanges;
    var merged = false;
    for (var i = ranges.length; i--;) {
      var cueRange = ranges[i];
      var overlap = intersection(cueRange[0], cueRange[1], startTime, endTime);
      if (overlap >= 0) {
        cueRange[0] = Math.min(cueRange[0], startTime);
        cueRange[1] = Math.max(cueRange[1], endTime);
        merged = true;
        if (overlap / (endTime - startTime) > 0.5) {
          return;
        }
      }
    }
    if (!merged) {
      ranges.push([startTime, endTime]);
    }

    this.Cues.newCue(this.captionsTracks[trackName], startTime, endTime, screen);
  };

  // Triggered when an initial PTS is found; used for synchronisation of WebVTT.


  TimelineController.prototype.onInitPtsFound = function onInitPtsFound(data) {
    var _this2 = this;

    if (typeof this.initPTS === 'undefined') {
      this.initPTS = data.initPTS;
    }

    // Due to asynchrony, initial PTS may arrive later than the first VTT fragments are loaded.
    // Parse any unparsed fragments upon receiving the initial PTS.
    if (this.unparsedVttFrags.length) {
      this.unparsedVttFrags.forEach(function (frag) {
        _this2.onFragLoaded(frag);
      });
      this.unparsedVttFrags = [];
    }
  };

  TimelineController.prototype.getExistingTrack = function getExistingTrack(trackName) {
    var media = this.media;

    if (media) {
      for (var i = 0; i < media.textTracks.length; i++) {
        var textTrack = media.textTracks[i];
        if (textTrack[trackName]) {
          return textTrack;
        }
      }
    }
    return null;
  };

  TimelineController.prototype.createCaptionsTrack = function createCaptionsTrack(trackName) {
    var _captionsProperties$t = this.captionsProperties[trackName],
        label = _captionsProperties$t.label,
        languageCode = _captionsProperties$t.languageCode;

    var captionsTracks = this.captionsTracks;
    if (!captionsTracks[trackName]) {
      // Enable reuse of existing text track.
      var existingTrack = this.getExistingTrack(trackName);
      if (!existingTrack) {
        var textTrack = this.createTextTrack('captions', label, languageCode);
        if (textTrack) {
          // Set a special property on the track so we know it's managed by Hls.js
          textTrack[trackName] = true;
          captionsTracks[trackName] = textTrack;
        }
      } else {
        captionsTracks[trackName] = existingTrack;
        clearCurrentCues(captionsTracks[trackName]);
        sendAddTrackEvent(captionsTracks[trackName], this.media);
      }
    }
  };

  TimelineController.prototype.createTextTrack = function createTextTrack(kind, label, lang) {
    var media = this.media;
    if (media) {
      return media.addTextTrack(kind, label, lang);
    }
  };

  TimelineController.prototype.destroy = function destroy() {
    event_handler.prototype.destroy.call(this);
  };

  TimelineController.prototype.onMediaAttaching = function onMediaAttaching(data) {
    this.media = data.media;
    this._cleanTracks();
  };

  TimelineController.prototype.onMediaDetaching = function onMediaDetaching() {
    var captionsTracks = this.captionsTracks;

    Object.keys(captionsTracks).forEach(function (trackName) {
      clearCurrentCues(captionsTracks[trackName]);
      delete captionsTracks[trackName];
    });
  };

  TimelineController.prototype.onManifestLoading = function onManifestLoading() {
    this.lastSn = -1; // Detect discontiguity in fragment parsing
    this.prevCC = -1;
    this.vttCCs = { ccOffset: 0, presentationOffset: 0 }; // Detect discontinuity in subtitle manifests
    this._cleanTracks();
  };

  TimelineController.prototype._cleanTracks = function _cleanTracks() {
    // clear outdated subtitles
    var media = this.media;
    if (media) {
      var textTracks = media.textTracks;
      if (textTracks) {
        for (var i = 0; i < textTracks.length; i++) {
          clearCurrentCues(textTracks[i]);
        }
      }
    }
  };

  TimelineController.prototype.onManifestLoaded = function onManifestLoaded(data) {
    var _this3 = this;

    this.textTracks = [];
    this.unparsedVttFrags = this.unparsedVttFrags || [];
    this.initPTS = undefined;
    this.cueRanges = [];

    if (this.config.enableWebVTT) {
      this.tracks = data.subtitles || [];
      var inUseTracks = this.media ? this.media.textTracks : [];

      this.tracks.forEach(function (track, index) {
        var textTrack = void 0;
        if (index < inUseTracks.length) {
          var inUseTrack = inUseTracks[index];
          // Reuse tracks with the same label, but do not reuse 608/708 tracks
          if (reuseVttTextTrack(inUseTrack, track)) {
            textTrack = inUseTrack;
          }
        }
        if (!textTrack) {
          textTrack = _this3.createTextTrack('subtitles', track.name, track.lang);
        }

        if (track.default) {
          textTrack.mode = _this3.hls.subtitleDisplay ? 'showing' : 'hidden';
        } else {
          textTrack.mode = 'disabled';
        }

        _this3.textTracks.push(textTrack);
      });
    }
  };

  TimelineController.prototype.onLevelSwitching = function onLevelSwitching() {
    this.enabled = this.hls.currentLevel.closedCaptions !== 'NONE';
  };

  TimelineController.prototype.onFragLoaded = function onFragLoaded(data) {
    var frag = data.frag,
        payload = data.payload;
    if (frag.type === 'main') {
      var sn = frag.sn;
      // if this frag isn't contiguous, clear the parser so cues with bad start/end times aren't added to the textTrack
      if (sn !== this.lastSn + 1) {
        var cea608Parser = this.cea608Parser;
        if (cea608Parser) {
          cea608Parser.reset();
        }
      }
      this.lastSn = sn;
    } // eslint-disable-line brace-style
    // If fragment is subtitle type, parse as WebVTT.
    else if (frag.type === 'subtitle') {
        if (payload.byteLength) {
          // We need an initial synchronisation PTS. Store fragments as long as none has arrived.
          if (typeof this.initPTS === 'undefined') {
            this.unparsedVttFrags.push(data);
            return;
          }

          var decryptData = frag.decryptdata;
          // If the subtitles are not encrypted, parse VTTs now. Otherwise, we need to wait.
          if (decryptData == null || decryptData.key == null || decryptData.method !== 'AES-128') {
            this._parseVTTs(frag, payload);
          }
        } else {
          // In case there is no payload, finish unsuccessfully.
          this.hls.trigger(events["a" /* default */].SUBTITLE_FRAG_PROCESSED, { success: false, frag: frag });
        }
      }
  };

  TimelineController.prototype._parseVTTs = function _parseVTTs(frag, payload) {
    var vttCCs = this.vttCCs;
    if (!vttCCs[frag.cc]) {
      vttCCs[frag.cc] = { start: frag.start, prevCC: this.prevCC, new: true };
      this.prevCC = frag.cc;
    }
    var textTracks = this.textTracks,
        hls = this.hls;

    // Parse the WebVTT file contents.
    webvtt_parser.parse(payload, this.initPTS, vttCCs, frag.cc, function (cues) {
      var currentTrack = textTracks[frag.trackId];
      // WebVTTParser.parse is an async method and if the currently selected text track mode is set to "disabled"
      // before parsing is done then don't try to access currentTrack.cues.getCueById as cues will be null
      // and trying to access getCueById method of cues will throw an exception
      if (currentTrack.mode === 'disabled') {
        hls.trigger(events["a" /* default */].SUBTITLE_FRAG_PROCESSED, { success: false, frag: frag });
        return;
      }
      // Add cues and trigger event with success true.
      cues.forEach(function (cue) {
        // Sometimes there are cue overlaps on segmented vtts so the same
        // cue can appear more than once in different vtt files.
        // This avoid showing duplicated cues with same timecode and text.
        if (!currentTrack.cues.getCueById(cue.id)) {
          try {
            currentTrack.addCue(cue);
          } catch (err) {
            var textTrackCue = new window.TextTrackCue(cue.startTime, cue.endTime, cue.text);
            textTrackCue.id = cue.id;
            currentTrack.addCue(textTrackCue);
          }
        }
      });
      hls.trigger(events["a" /* default */].SUBTITLE_FRAG_PROCESSED, { success: true, frag: frag });
    }, function (e) {
      // Something went wrong while parsing. Trigger event with success false.
      logger["b" /* logger */].log('Failed to parse VTT cue: ' + e);
      hls.trigger(events["a" /* default */].SUBTITLE_FRAG_PROCESSED, { success: false, frag: frag });
    });
  };

  TimelineController.prototype.onFragDecrypted = function onFragDecrypted(data) {
    var decryptedData = data.payload,
        frag = data.frag;

    if (frag.type === 'subtitle') {
      if (typeof this.initPTS === 'undefined') {
        this.unparsedVttFrags.push(data);
        return;
      }

      this._parseVTTs(frag, decryptedData);
    }
  };

  TimelineController.prototype.onFragParsingUserdata = function onFragParsingUserdata(data) {
    // push all of the CEA-708 messages into the interpreter
    // immediately. It will create the proper timestamps based on our PTS value
    if (this.enabled && this.config.enableCEA708Captions) {
      for (var i = 0; i < data.samples.length; i++) {
        var ccdatas = this.extractCea608Data(data.samples[i].bytes);
        this.cea608Parser.addData(data.samples[i].pts, ccdatas);
      }
    }
  };

  TimelineController.prototype.extractCea608Data = function extractCea608Data(byteArray) {
    var count = byteArray[0] & 31;
    var position = 2;
    var tmpByte = void 0,
        ccbyte1 = void 0,
        ccbyte2 = void 0,
        ccValid = void 0,
        ccType = void 0;
    var actualCCBytes = [];

    for (var j = 0; j < count; j++) {
      tmpByte = byteArray[position++];
      ccbyte1 = 0x7F & byteArray[position++];
      ccbyte2 = 0x7F & byteArray[position++];
      ccValid = (4 & tmpByte) !== 0;
      ccType = 3 & tmpByte;

      if (ccbyte1 === 0 && ccbyte2 === 0) {
        continue;
      }

      if (ccValid) {
        if (ccType === 0) {
          // || ccType === 1
          actualCCBytes.push(ccbyte1);
          actualCCBytes.push(ccbyte2);
        }
      }
    }
    return actualCCBytes;
  };

  return TimelineController;
}(event_handler);

/* harmony default export */ var timeline_controller = (timeline_controller_TimelineController);
// CONCATENATED MODULE: ./src/controller/subtitle-track-controller.js
var subtitle_track_controller__createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function subtitle_track_controller__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function subtitle_track_controller__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function subtitle_track_controller__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * subtitle track controller
*/





function filterSubtitleTracks(textTrackList) {
  var tracks = [];
  for (var i = 0; i < textTrackList.length; i++) {
    if (textTrackList[i].kind === 'subtitles') {
      tracks.push(textTrackList[i]);
    }
  }
  return tracks;
}

var subtitle_track_controller_SubtitleTrackController = function (_EventHandler) {
  subtitle_track_controller__inherits(SubtitleTrackController, _EventHandler);

  function SubtitleTrackController(hls) {
    subtitle_track_controller__classCallCheck(this, SubtitleTrackController);

    var _this = subtitle_track_controller__possibleConstructorReturn(this, _EventHandler.call(this, hls, events["a" /* default */].MEDIA_ATTACHED, events["a" /* default */].MEDIA_DETACHING, events["a" /* default */].MANIFEST_LOADING, events["a" /* default */].MANIFEST_LOADED, events["a" /* default */].SUBTITLE_TRACK_LOADED));

    _this.tracks = [];
    _this.trackId = -1;
    _this.media = null;

    /**
     * @member {boolean} subtitleDisplay Enable/disable subtitle display rendering
     */
    _this.subtitleDisplay = true;
    return _this;
  }

  SubtitleTrackController.prototype._onTextTracksChanged = function _onTextTracksChanged() {
    // Media is undefined when switching streams via loadSource()
    if (!this.media) {
      return;
    }

    var trackId = -1;
    var tracks = filterSubtitleTracks(this.media.textTracks);
    for (var id = 0; id < tracks.length; id++) {
      if (tracks[id].mode === 'hidden') {
        // Do not break in case there is a following track with showing.
        trackId = id;
      } else if (tracks[id].mode === 'showing') {
        trackId = id;
        break;
      }
    }

    // Setting current subtitleTrack will invoke code.
    this.subtitleTrack = trackId;
  };

  SubtitleTrackController.prototype.destroy = function destroy() {
    event_handler.prototype.destroy.call(this);
  };

  // Listen for subtitle track change, then extract the current track ID.


  SubtitleTrackController.prototype.onMediaAttached = function onMediaAttached(data) {
    var _this2 = this;

    this.media = data.media;
    if (!this.media) {
      return;
    }

    if (this.queuedDefaultTrack) {
      this.subtitleTrack = this.queuedDefaultTrack;
      delete this.queuedDefaultTrack;
    }

    this.trackChangeListener = this._onTextTracksChanged.bind(this);

    this.useTextTrackPolling = !(this.media.textTracks && 'onchange' in this.media.textTracks);
    if (this.useTextTrackPolling) {
      this.subtitlePollingInterval = setInterval(function () {
        _this2.trackChangeListener();
      }, 500);
    } else {
      this.media.textTracks.addEventListener('change', this.trackChangeListener);
    }
  };

  SubtitleTrackController.prototype.onMediaDetaching = function onMediaDetaching() {
    if (!this.media) {
      return;
    }

    if (this.useTextTrackPolling) {
      clearInterval(this.subtitlePollingInterval);
    } else {
      this.media.textTracks.removeEventListener('change', this.trackChangeListener);
    }

    this.media = null;
  };

  // Reset subtitle tracks on manifest loading


  SubtitleTrackController.prototype.onManifestLoading = function onManifestLoading() {
    this.tracks = [];
    this.trackId = -1;
  };

  // Fired whenever a new manifest is loaded.


  SubtitleTrackController.prototype.onManifestLoaded = function onManifestLoaded(data) {
    var _this3 = this;

    var tracks = data.subtitles || [];
    this.tracks = tracks;
    this.trackId = -1;
    this.hls.trigger(events["a" /* default */].SUBTITLE_TRACKS_UPDATED, { subtitleTracks: tracks });

    // loop through available subtitle tracks and autoselect default if needed
    // TODO: improve selection logic to handle forced, etc
    tracks.forEach(function (track) {
      if (track.default) {
        // setting this.subtitleTrack will trigger internal logic
        // if media has not been attached yet, it will fail
        // we keep a reference to the default track id
        // and we'll set subtitleTrack when onMediaAttached is triggered
        if (_this3.media) {
          _this3.subtitleTrack = track.id;
        } else {
          _this3.queuedDefaultTrack = track.id;
        }
      }
    });
  };

  // Trigger subtitle track playlist reload.


  SubtitleTrackController.prototype.onTick = function onTick() {
    var trackId = this.trackId;
    var subtitleTrack = this.tracks[trackId];
    if (!subtitleTrack) {
      return;
    }

    var details = subtitleTrack.details;
    // check if we need to load playlist for this subtitle Track
    if (!details || details.live) {
      // track not retrieved yet, or live playlist we need to (re)load it
      logger["b" /* logger */].log('(re)loading playlist for subtitle track ' + trackId);
      this.hls.trigger(events["a" /* default */].SUBTITLE_TRACK_LOADING, { url: subtitleTrack.url, id: trackId });
    }
  };

  SubtitleTrackController.prototype.onSubtitleTrackLoaded = function onSubtitleTrackLoaded(data) {
    var _this4 = this;

    if (data.id < this.tracks.length) {
      logger["b" /* logger */].log('subtitle track ' + data.id + ' loaded');
      this.tracks[data.id].details = data.details;
      // check if current playlist is a live playlist
      if (data.details.live && !this.timer) {
        // if live playlist we will have to reload it periodically
        // set reload period to playlist target duration
        this.timer = setInterval(function () {
          _this4.onTick();
        }, 1000 * data.details.targetduration, this);
      }
      if (!data.details.live && this.timer) {
        // playlist is not live and timer is armed : stopping it
        this._stopTimer();
      }
    }
  };

  /** get alternate subtitle tracks list from playlist **/


  /**
   * This method is responsible for validating the subtitle index and periodically reloading if live.
   * Dispatches the SUBTITLE_TRACK_SWITCH event, which instructs the subtitle-stream-controller to load the selected track.
   * @param newId - The id of the subtitle track to activate.
   */
  SubtitleTrackController.prototype.setSubtitleTrackInternal = function setSubtitleTrackInternal(newId) {
    var hls = this.hls,
        tracks = this.tracks;

    if (typeof newId !== 'number' || newId < -1 || newId >= tracks.length) {
      return;
    }

    this._stopTimer();
    this.trackId = newId;
    logger["b" /* logger */].log('switching to subtitle track ' + newId);
    hls.trigger(events["a" /* default */].SUBTITLE_TRACK_SWITCH, { id: newId });
    if (newId === -1) {
      return;
    }

    // check if we need to load playlist for this subtitle Track
    var subtitleTrack = tracks[newId];
    var details = subtitleTrack.details;
    if (!details || details.live) {
      // track not retrieved yet, or live playlist we need to (re)load it
      logger["b" /* logger */].log('(re)loading playlist for subtitle track ' + newId);
      hls.trigger(events["a" /* default */].SUBTITLE_TRACK_LOADING, { url: subtitleTrack.url, id: newId });
    }
  };

  SubtitleTrackController.prototype._stopTimer = function _stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  };

  /**
   * Disables the old subtitleTrack and sets current mode on the next subtitleTrack.
   * This operates on the DOM textTracks.
   * A value of -1 will disable all subtitle tracks.
   * @param newId - The id of the next track to enable
   * @private
   */


  SubtitleTrackController.prototype._toggleTrackModes = function _toggleTrackModes(newId) {
    var media = this.media,
        subtitleDisplay = this.subtitleDisplay,
        trackId = this.trackId;

    if (!media) {
      return;
    }

    var textTracks = filterSubtitleTracks(media.textTracks);
    if (newId === -1) {
      [].slice.call(textTracks).forEach(function (track) {
        track.mode = 'disabled';
      });
    } else {
      var oldTrack = textTracks[trackId];
      if (oldTrack) {
        oldTrack.mode = 'disabled';
      }
    }

    var nextTrack = textTracks[newId];
    if (nextTrack) {
      nextTrack.mode = subtitleDisplay ? 'showing' : 'hidden';
    }
  };

  subtitle_track_controller__createClass(SubtitleTrackController, [{
    key: 'subtitleTracks',
    get: function get() {
      return this.tracks;
    }

    /** get index of the selected subtitle track (index in subtitle track lists) **/

  }, {
    key: 'subtitleTrack',
    get: function get() {
      return this.trackId;
    }

    /** select a subtitle track, based on its index in subtitle track lists**/
    ,
    set: function set(subtitleTrackId) {
      if (this.trackId !== subtitleTrackId) {
        this._toggleTrackModes(subtitleTrackId);
        this.setSubtitleTrackInternal(subtitleTrackId);
      }
    }
  }]);

  return SubtitleTrackController;
}(event_handler);

/* harmony default export */ var subtitle_track_controller = (subtitle_track_controller_SubtitleTrackController);
// EXTERNAL MODULE: ./src/crypt/decrypter.js + 3 modules
var decrypter = __webpack_require__(7);

// CONCATENATED MODULE: ./src/controller/subtitle-stream-controller.js
function subtitle_stream_controller__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function subtitle_stream_controller__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function subtitle_stream_controller__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * Subtitle Stream Controller
*/






var subtitle_stream_controller__window = window,
    subtitle_stream_controller_performance = subtitle_stream_controller__window.performance;


var subtitle_stream_controller_State = {
  STOPPED: 'STOPPED',
  IDLE: 'IDLE',
  KEY_LOADING: 'KEY_LOADING',
  FRAG_LOADING: 'FRAG_LOADING'
};

var subtitle_stream_controller_SubtitleStreamController = function (_TaskLoop) {
  subtitle_stream_controller__inherits(SubtitleStreamController, _TaskLoop);

  function SubtitleStreamController(hls) {
    subtitle_stream_controller__classCallCheck(this, SubtitleStreamController);

    var _this = subtitle_stream_controller__possibleConstructorReturn(this, _TaskLoop.call(this, hls, events["a" /* default */].MEDIA_ATTACHED, events["a" /* default */].ERROR, events["a" /* default */].KEY_LOADED, events["a" /* default */].FRAG_LOADED, events["a" /* default */].SUBTITLE_TRACKS_UPDATED, events["a" /* default */].SUBTITLE_TRACK_SWITCH, events["a" /* default */].SUBTITLE_TRACK_LOADED, events["a" /* default */].SUBTITLE_FRAG_PROCESSED));

    _this.config = hls.config;
    _this.vttFragSNsProcessed = {};
    _this.vttFragQueues = undefined;
    _this.currentlyProcessing = null;
    _this.state = subtitle_stream_controller_State.STOPPED;
    _this.currentTrackId = -1;
    _this.decrypter = new decrypter["a" /* default */](hls.observer, hls.config);
    return _this;
  }

  SubtitleStreamController.prototype.onHandlerDestroyed = function onHandlerDestroyed() {
    this.state = subtitle_stream_controller_State.STOPPED;
  };

  // Remove all queued items and create a new, empty queue for each track.


  SubtitleStreamController.prototype.clearVttFragQueues = function clearVttFragQueues() {
    var _this2 = this;

    this.vttFragQueues = {};
    this.tracks.forEach(function (track) {
      _this2.vttFragQueues[track.id] = [];
    });
  };

  // If no frag is being processed and queue isn't empty, initiate processing of next frag in line.


  SubtitleStreamController.prototype.nextFrag = function nextFrag() {
    if (this.currentlyProcessing === null && this.currentTrackId > -1 && this.vttFragQueues[this.currentTrackId].length) {
      var frag = this.currentlyProcessing = this.vttFragQueues[this.currentTrackId].shift();
      this.fragCurrent = frag;
      this.hls.trigger(events["a" /* default */].FRAG_LOADING, { frag: frag });
      this.state = subtitle_stream_controller_State.FRAG_LOADING;
    }
  };

  // When fragment has finished processing, add sn to list of completed if successful.


  SubtitleStreamController.prototype.onSubtitleFragProcessed = function onSubtitleFragProcessed(data) {
    if (data.success) {
      this.vttFragSNsProcessed[data.frag.trackId].push(data.frag.sn);
    }

    this.currentlyProcessing = null;
    this.state = subtitle_stream_controller_State.IDLE;
    this.nextFrag();
  };

  SubtitleStreamController.prototype.onMediaAttached = function onMediaAttached() {
    this.state = subtitle_stream_controller_State.IDLE;
  };

  // If something goes wrong, procede to next frag, if we were processing one.


  SubtitleStreamController.prototype.onError = function onError(data) {
    var frag = data.frag;
    // don't handle frag error not related to subtitle fragment
    if (frag && frag.type !== 'subtitle') {
      return;
    }

    if (this.currentlyProcessing) {
      this.currentlyProcessing = null;
      this.nextFrag();
    }
  };

  SubtitleStreamController.prototype.doTick = function doTick() {
    var _this3 = this;

    switch (this.state) {
      case subtitle_stream_controller_State.IDLE:
        var tracks = this.tracks;
        var trackId = this.currentTrackId;

        var processedFragSNs = this.vttFragSNsProcessed[trackId],
            fragQueue = this.vttFragQueues[trackId],
            currentFragSN = this.currentlyProcessing ? this.currentlyProcessing.sn : -1;

        var alreadyProcessed = function alreadyProcessed(frag) {
          return processedFragSNs.indexOf(frag.sn) > -1;
        };

        var alreadyInQueue = function alreadyInQueue(frag) {
          return fragQueue.some(function (fragInQueue) {
            return fragInQueue.sn === frag.sn;
          });
        };

        // exit if tracks don't exist
        if (!tracks) {
          break;
        }

        var trackDetails;

        if (trackId < tracks.length) {
          trackDetails = tracks[trackId].details;
        }

        if (typeof trackDetails === 'undefined') {
          break;
        }

        // Add all fragments that haven't been, aren't currently being and aren't waiting to be processed, to queue.
        trackDetails.fragments.forEach(function (frag) {
          if (!(alreadyProcessed(frag) || frag.sn === currentFragSN || alreadyInQueue(frag))) {
            // Load key if subtitles are encrypted
            if (frag.encrypted) {
              logger["b" /* logger */].log('Loading key for ' + frag.sn);
              _this3.state = subtitle_stream_controller_State.KEY_LOADING;
              _this3.hls.trigger(events["a" /* default */].KEY_LOADING, { frag: frag });
            } else {
              // Frags don't know their subtitle track ID, so let's just add that...
              frag.trackId = trackId;
              fragQueue.push(frag);
              _this3.nextFrag();
            }
          }
        });
    }
  };

  // Got all new subtitle tracks.


  SubtitleStreamController.prototype.onSubtitleTracksUpdated = function onSubtitleTracksUpdated(data) {
    var _this4 = this;

    logger["b" /* logger */].log('subtitle tracks updated');
    this.tracks = data.subtitleTracks;
    this.clearVttFragQueues();
    this.vttFragSNsProcessed = {};
    this.tracks.forEach(function (track) {
      _this4.vttFragSNsProcessed[track.id] = [];
    });
  };

  SubtitleStreamController.prototype.onSubtitleTrackSwitch = function onSubtitleTrackSwitch(data) {
    this.currentTrackId = data.id;
    if (!this.tracks || this.currentTrackId === -1) {
      return;
    }

    // Check if track was already loaded and if so make sure we finish
    // downloading its frags, if not all have been downloaded yet
    var currentTrack = this.tracks[this.currentTrackId];
    if (currentTrack && currentTrack.details) {
      this.tick();
    }
  };

  // Got a new set of subtitle fragments.


  SubtitleStreamController.prototype.onSubtitleTrackLoaded = function onSubtitleTrackLoaded() {
    this.tick();
  };

  SubtitleStreamController.prototype.onKeyLoaded = function onKeyLoaded() {
    if (this.state === subtitle_stream_controller_State.KEY_LOADING) {
      this.state = subtitle_stream_controller_State.IDLE;
      this.tick();
    }
  };

  SubtitleStreamController.prototype.onFragLoaded = function onFragLoaded(data) {
    var fragCurrent = this.fragCurrent,
        decryptData = data.frag.decryptdata;
    var fragLoaded = data.frag,
        hls = this.hls;
    if (this.state === subtitle_stream_controller_State.FRAG_LOADING && fragCurrent && data.frag.type === 'subtitle' && fragCurrent.sn === data.frag.sn) {
      // check to see if the payload needs to be decrypted
      if (data.payload.byteLength > 0 && decryptData != null && decryptData.key != null && decryptData.method === 'AES-128') {
        var startTime = void 0;
        try {
          startTime = subtitle_stream_controller_performance.now();
        } catch (error) {
          startTime = Date.now();
        }
        // decrypt the subtitles
        this.decrypter.decrypt(data.payload, decryptData.key.buffer, decryptData.iv.buffer, function (decryptedData) {
          var endTime = void 0;
          try {
            endTime = subtitle_stream_controller_performance.now();
          } catch (error) {
            endTime = Date.now();
          }
          hls.trigger(events["a" /* default */].FRAG_DECRYPTED, { frag: fragLoaded, payload: decryptedData, stats: { tstart: startTime, tdecrypt: endTime } });
        });
      }
    }
  };

  return SubtitleStreamController;
}(task_loop);

/* harmony default export */ var subtitle_stream_controller = (subtitle_stream_controller_SubtitleStreamController);
// CONCATENATED MODULE: ./src/controller/eme-controller.js
var eme_controller__createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function eme_controller__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function eme_controller__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function eme_controller__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @author Stephan Hesse <disparat@gmail.com> | <tchakabam@gmail.com>
 *
 * DRM support for Hls.js
 */







var eme_controller__window = window,
    eme_controller_XMLHttpRequest = eme_controller__window.XMLHttpRequest;


var MAX_LICENSE_REQUEST_FAILURES = 3;

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/requestMediaKeySystemAccess
 */
var KeySystems = {
  WIDEVINE: 'com.widevine.alpha',
  PLAYREADY: 'com.microsoft.playready'
};

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaKeySystemConfiguration
 * @param {Array<string>} audioCodecs List of required audio codecs to support
 * @param {Array<string>} videoCodecs List of required video codecs to support
 * @param {object} drmSystemOptions Optional parameters/requirements for the key-system
 * @returns {Array<MediaSystemConfiguration>} An array of supported configurations
 */

var createWidevineMediaKeySystemConfigurations = function createWidevineMediaKeySystemConfigurations(audioCodecs, videoCodecs, drmSystemOptions) {
  /* jshint ignore:line */
  var baseConfig = {
    // initDataTypes: ['keyids', 'mp4'],
    // label: "",
    // persistentState: "not-allowed", // or "required" ?
    // distinctiveIdentifier: "not-allowed", // or "required" ?
    // sessionTypes: ['temporary'],
    videoCapabilities: [
      // { contentType: 'video/mp4; codecs="avc1.42E01E"' }
    ]
  };

  videoCodecs.forEach(function (codec) {
    baseConfig.videoCapabilities.push({
      contentType: 'video/mp4; codecs="' + codec + '"'
    });
  });

  return [baseConfig];
};

/**
 * The idea here is to handle key-system (and their respective platforms) specific configuration differences
 * in order to work with the local requestMediaKeySystemAccess method.
 *
 * We can also rule-out platform-related key-system support at this point by throwing an error or returning null.
 *
 * @param {string} keySystem Identifier for the key-system, see `KeySystems` enum
 * @param {Array<string>} audioCodecs List of required audio codecs to support
 * @param {Array<string>} videoCodecs List of required video codecs to support
 * @returns {Array<MediaSystemConfiguration> | null} A non-empty Array of MediaKeySystemConfiguration objects or `null`
 */
var getSupportedMediaKeySystemConfigurations = function getSupportedMediaKeySystemConfigurations(keySystem, audioCodecs, videoCodecs) {
  switch (keySystem) {
    case KeySystems.WIDEVINE:
      return createWidevineMediaKeySystemConfigurations(audioCodecs, videoCodecs);
    default:
      throw Error('Unknown key-system: ' + keySystem);
  }
};

/**
 * Controller to deal with encrypted media extensions (EME)
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Encrypted_Media_Extensions_API
 *
 * @class
 * @constructor
 */

var eme_controller_EMEController = function (_EventHandler) {
  eme_controller__inherits(EMEController, _EventHandler);

  /**
     * @constructs
     * @param {Hls} hls Our Hls.js instance
     */
  function EMEController(hls) {
    eme_controller__classCallCheck(this, EMEController);

    var _this = eme_controller__possibleConstructorReturn(this, _EventHandler.call(this, hls, events["a" /* default */].MEDIA_ATTACHED, events["a" /* default */].MANIFEST_PARSED));

    _this._widevineLicenseUrl = hls.config.widevineLicenseUrl;
    _this._licenseXhrSetup = hls.config.licenseXhrSetup;
    _this._emeEnabled = hls.config.emeEnabled;

    _this._requestMediaKeySystemAccess = hls.config.requestMediaKeySystemAccessFunc;

    _this._mediaKeysList = [];
    _this._media = null;

    _this._hasSetMediaKeys = false;
    _this._isMediaEncrypted = false;

    _this._requestLicenseFailureCount = 0;
    return _this;
  }

  /**
     *
     * @param {string} keySystem Identifier for the key-system, see `KeySystems` enum
     * @returns {string} License server URL for key-system (if any configured, otherwise causes error)
     */


  EMEController.prototype.getLicenseServerUrl = function getLicenseServerUrl(keySystem) {
    var url = void 0;
    switch (keySystem) {
      case KeySystems.WIDEVINE:
        url = this._widevineLicenseUrl;
        break;
      default:
        url = null;
        break;
    }

    if (!url) {
      logger["b" /* logger */].error('No license server URL configured for key-system "' + keySystem + '"');
      this.hls.trigger(events["a" /* default */].ERROR, {
        type: errors["b" /* ErrorTypes */].KEY_SYSTEM_ERROR,
        details: errors["a" /* ErrorDetails */].KEY_SYSTEM_LICENSE_REQUEST_FAILED,
        fatal: true
      });
    }

    return url;
  };

  /**
     * Requests access object and adds it to our list upon success
     * @private
     * @param {string} keySystem System ID (see `KeySystems`)
     * @param {Array<string>} audioCodecs List of required audio codecs to support
     * @param {Array<string>} videoCodecs List of required video codecs to support
     */


  EMEController.prototype._attemptKeySystemAccess = function _attemptKeySystemAccess(keySystem, audioCodecs, videoCodecs) {
    var _this2 = this;

    // TODO: add other DRM "options"

    var mediaKeySystemConfigs = getSupportedMediaKeySystemConfigurations(keySystem, audioCodecs, videoCodecs);

    if (!mediaKeySystemConfigs) {
      logger["b" /* logger */].warn('Can not create config for key-system (maybe because platform is not supported):', keySystem);
      return;
    }

    logger["b" /* logger */].log('Requesting encrypted media key-system access');

    // expecting interface like window.navigator.requestMediaKeySystemAccess
    this.requestMediaKeySystemAccess(keySystem, mediaKeySystemConfigs).then(function (mediaKeySystemAccess) {
      _this2._onMediaKeySystemAccessObtained(keySystem, mediaKeySystemAccess);
    }).catch(function (err) {
      logger["b" /* logger */].error('Failed to obtain key-system "' + keySystem + '" access:', err);
    });
  };

  /**
     * Handles obtaining access to a key-system
     *
     * @param {string} keySystem
     * @param {MediaKeySystemAccess} mediaKeySystemAccess https://developer.mozilla.org/en-US/docs/Web/API/MediaKeySystemAccess
     */
  EMEController.prototype._onMediaKeySystemAccessObtained = function _onMediaKeySystemAccessObtained(keySystem, mediaKeySystemAccess) {
    var _this3 = this;

    logger["b" /* logger */].log('Access for key-system "' + keySystem + '" obtained');

    var mediaKeysListItem = {
      mediaKeys: null,
      mediaKeysSession: null,
      mediaKeysSessionInitialized: false,
      mediaKeySystemAccess: mediaKeySystemAccess,
      mediaKeySystemDomain: keySystem
    };

    this._mediaKeysList.push(mediaKeysListItem);

    mediaKeySystemAccess.createMediaKeys().then(function (mediaKeys) {
      mediaKeysListItem.mediaKeys = mediaKeys;

      logger["b" /* logger */].log('Media-keys created for key-system "' + keySystem + '"');

      _this3._onMediaKeysCreated();
    }).catch(function (err) {
      logger["b" /* logger */].error('Failed to create media-keys:', err);
    });
  };

  /**
     * Handles key-creation (represents access to CDM). We are going to create key-sessions upon this
     * for all existing keys where no session exists yet.
     */


  EMEController.prototype._onMediaKeysCreated = function _onMediaKeysCreated() {
    var _this4 = this;

    // check for all key-list items if a session exists, otherwise, create one
    this._mediaKeysList.forEach(function (mediaKeysListItem) {
      if (!mediaKeysListItem.mediaKeysSession) {
        mediaKeysListItem.mediaKeysSession = mediaKeysListItem.mediaKeys.createSession();
        _this4._onNewMediaKeySession(mediaKeysListItem.mediaKeysSession);
      }
    });
  };

  /**
     *
     * @param {*} keySession
     */


  EMEController.prototype._onNewMediaKeySession = function _onNewMediaKeySession(keySession) {
    var _this5 = this;

    logger["b" /* logger */].log('New key-system session ' + keySession.sessionId);

    keySession.addEventListener('message', function (event) {
      _this5._onKeySessionMessage(keySession, event.message);
    }, false);
  };

  EMEController.prototype._onKeySessionMessage = function _onKeySessionMessage(keySession, message) {
    logger["b" /* logger */].log('Got EME message event, creating license request');

    this._requestLicense(message, function (data) {
      logger["b" /* logger */].log('Received license data, updating key-session');
      keySession.update(data);
    });
  };

  EMEController.prototype._onMediaEncrypted = function _onMediaEncrypted(initDataType, initData) {
    logger["b" /* logger */].log('Media is encrypted using "' + initDataType + '" init data type');

    this._isMediaEncrypted = true;
    this._mediaEncryptionInitDataType = initDataType;
    this._mediaEncryptionInitData = initData;

    this._attemptSetMediaKeys();
    this._generateRequestWithPreferredKeySession();
  };

  EMEController.prototype._attemptSetMediaKeys = function _attemptSetMediaKeys() {
    if (!this._hasSetMediaKeys) {
      // FIXME: see if we can/want/need-to really to deal with several potential key-sessions?
      var keysListItem = this._mediaKeysList[0];
      if (!keysListItem || !keysListItem.mediaKeys) {
        logger["b" /* logger */].error('Fatal: Media is encrypted but no CDM access or no keys have been obtained yet');
        this.hls.trigger(events["a" /* default */].ERROR, {
          type: errors["b" /* ErrorTypes */].KEY_SYSTEM_ERROR,
          details: errors["a" /* ErrorDetails */].KEY_SYSTEM_NO_KEYS,
          fatal: true
        });
        return;
      }

      logger["b" /* logger */].log('Setting keys for encrypted media');

      this._media.setMediaKeys(keysListItem.mediaKeys);
      this._hasSetMediaKeys = true;
    }
  };

  EMEController.prototype._generateRequestWithPreferredKeySession = function _generateRequestWithPreferredKeySession() {
    var _this6 = this;

    // FIXME: see if we can/want/need-to really to deal with several potential key-sessions?
    var keysListItem = this._mediaKeysList[0];
    if (!keysListItem) {
      logger["b" /* logger */].error('Fatal: Media is encrypted but not any key-system access has been obtained yet');
      this.hls.trigger(events["a" /* default */].ERROR, {
        type: errors["b" /* ErrorTypes */].KEY_SYSTEM_ERROR,
        details: errors["a" /* ErrorDetails */].KEY_SYSTEM_NO_ACCESS,
        fatal: true
      });
      return;
    }

    if (keysListItem.mediaKeysSessionInitialized) {
      logger["b" /* logger */].warn('Key-Session already initialized but requested again');
      return;
    }

    var keySession = keysListItem.mediaKeysSession;
    if (!keySession) {
      logger["b" /* logger */].error('Fatal: Media is encrypted but no key-session existing');
      this.hls.trigger(events["a" /* default */].ERROR, {
        type: errors["b" /* ErrorTypes */].KEY_SYSTEM_ERROR,
        details: errors["a" /* ErrorDetails */].KEY_SYSTEM_NO_SESSION,
        fatal: true
      });
    }

    var initDataType = this._mediaEncryptionInitDataType;
    var initData = this._mediaEncryptionInitData;

    logger["b" /* logger */].log('Generating key-session request for "' + initDataType + '" init data type');

    keysListItem.mediaKeysSessionInitialized = true;

    keySession.generateRequest(initDataType, initData).then(function () {
      logger["b" /* logger */].debug('Key-session generation succeeded');
    }).catch(function (err) {
      logger["b" /* logger */].error('Error generating key-session request:', err);
      _this6.hls.trigger(events["a" /* default */].ERROR, {
        type: errors["b" /* ErrorTypes */].KEY_SYSTEM_ERROR,
        details: errors["a" /* ErrorDetails */].KEY_SYSTEM_NO_SESSION,
        fatal: false
      });
    });
  };

  /**
     * @param {string} url License server URL
     * @param {ArrayBuffer} keyMessage Message data issued by key-system
     * @param {function} callback Called when XHR has succeeded
     * @returns {XMLHttpRequest} Unsent (but opened state) XHR object
     */


  EMEController.prototype._createLicenseXhr = function _createLicenseXhr(url, keyMessage, callback) {
    var xhr = new eme_controller_XMLHttpRequest();
    var licenseXhrSetup = this._licenseXhrSetup;

    try {
      if (licenseXhrSetup) {
        try {
          licenseXhrSetup(xhr, url);
        } catch (e) {
          // let's try to open before running setup
          xhr.open('POST', url, true);
          licenseXhrSetup(xhr, url);
        }
      }
      // if licenseXhrSetup did not yet call open, let's do it now
      if (!xhr.readyState) {
        xhr.open('POST', url, true);
      }
    } catch (e) {
      // IE11 throws an exception on xhr.open if attempting to access an HTTP resource over HTTPS
      logger["b" /* logger */].error('Error setting up key-system license XHR', e);
      this.hls.trigger(events["a" /* default */].ERROR, {
        type: errors["b" /* ErrorTypes */].KEY_SYSTEM_ERROR,
        details: errors["a" /* ErrorDetails */].KEY_SYSTEM_LICENSE_REQUEST_FAILED,
        fatal: true
      });
      return;
    }

    xhr.responseType = 'arraybuffer';
    xhr.onreadystatechange = this._onLicenseRequestReadyStageChange.bind(this, xhr, url, keyMessage, callback);
    return xhr;
  };

  /**
     * @param {XMLHttpRequest} xhr
     * @param {string} url License server URL
     * @param {ArrayBuffer} keyMessage Message data issued by key-system
     * @param {function} callback Called when XHR has succeeded
     *
     */


  EMEController.prototype._onLicenseRequestReadyStageChange = function _onLicenseRequestReadyStageChange(xhr, url, keyMessage, callback) {
    switch (xhr.readyState) {
      case 4:
        if (xhr.status === 200) {
          this._requestLicenseFailureCount = 0;
          logger["b" /* logger */].log('License request succeeded');
          callback(xhr.response);
        } else {
          logger["b" /* logger */].error('License Request XHR failed (' + url + '). Status: ' + xhr.status + ' (' + xhr.statusText + ')');

          this._requestLicenseFailureCount++;
          if (this._requestLicenseFailureCount <= MAX_LICENSE_REQUEST_FAILURES) {
            var attemptsLeft = MAX_LICENSE_REQUEST_FAILURES - this._requestLicenseFailureCount + 1;
            logger["b" /* logger */].warn('Retrying license request, ' + attemptsLeft + ' attempts left');
            this._requestLicense(keyMessage, callback);
            return;
          }

          this.hls.trigger(events["a" /* default */].ERROR, {
            type: errors["b" /* ErrorTypes */].KEY_SYSTEM_ERROR,
            details: errors["a" /* ErrorDetails */].KEY_SYSTEM_LICENSE_REQUEST_FAILED,
            fatal: true
          });
        }
        break;
    }
  };

  /**
     * @param {object} keysListItem
     * @param {ArrayBuffer} keyMessage
     * @returns {ArrayBuffer} Challenge data posted to license server
     */


  EMEController.prototype._generateLicenseRequestChallenge = function _generateLicenseRequestChallenge(keysListItem, keyMessage) {
    var challenge = void 0;

    if (keysListItem.mediaKeySystemDomain === KeySystems.PLAYREADY) {
      logger["b" /* logger */].error('PlayReady is not supported (yet)');

      // from https://github.com/MicrosoftEdge/Demos/blob/master/eme/scripts/demo.js
      /*
        if (this.licenseType !== this.LICENSE_TYPE_WIDEVINE) {
            // For PlayReady CDMs, we need to dig the Challenge out of the XML.
            var keyMessageXml = new DOMParser().parseFromString(String.fromCharCode.apply(null, new Uint16Array(keyMessage)), 'application/xml');
            if (keyMessageXml.getElementsByTagName('Challenge')[0]) {
                challenge = atob(keyMessageXml.getElementsByTagName('Challenge')[0].childNodes[0].nodeValue);
            } else {
                throw 'Cannot find <Challenge> in key message';
            }
            var headerNames = keyMessageXml.getElementsByTagName('name');
            var headerValues = keyMessageXml.getElementsByTagName('value');
            if (headerNames.length !== headerValues.length) {
                throw 'Mismatched header <name>/<value> pair in key message';
            }
            for (var i = 0; i < headerNames.length; i++) {
                xhr.setRequestHeader(headerNames[i].childNodes[0].nodeValue, headerValues[i].childNodes[0].nodeValue);
            }
        }
        */
    } else if (keysListItem.mediaKeySystemDomain === KeySystems.WIDEVINE) {
      // For Widevine CDMs, the challenge is the keyMessage.
      challenge = keyMessage;
    } else {
      logger["b" /* logger */].error('Unsupported key-system:', keysListItem.mediaKeySystemDomain);
    }

    return challenge;
  };

  EMEController.prototype._requestLicense = function _requestLicense(keyMessage, callback) {
    logger["b" /* logger */].log('Requesting content license for key-system');

    var keysListItem = this._mediaKeysList[0];
    if (!keysListItem) {
      logger["b" /* logger */].error('Fatal error: Media is encrypted but no key-system access has been obtained yet');
      this.hls.trigger(events["a" /* default */].ERROR, {
        type: errors["b" /* ErrorTypes */].KEY_SYSTEM_ERROR,
        details: errors["a" /* ErrorDetails */].KEY_SYSTEM_NO_ACCESS,
        fatal: true
      });
      return;
    }

    var url = this.getLicenseServerUrl(keysListItem.mediaKeySystemDomain);
    var xhr = this._createLicenseXhr(url, keyMessage, callback);

    logger["b" /* logger */].log('Sending license request to URL: ' + url);

    xhr.send(this._generateLicenseRequestChallenge(keysListItem, keyMessage));
  };

  EMEController.prototype.onMediaAttached = function onMediaAttached(data) {
    var _this7 = this;

    if (!this._emeEnabled) {
      return;
    }

    var media = data.media;

    // keep reference of media
    this._media = media;

    // FIXME: also handle detaching media !

    media.addEventListener('encrypted', function (e) {
      _this7._onMediaEncrypted(e.initDataType, e.initData);
    });
  };

  EMEController.prototype.onManifestParsed = function onManifestParsed(data) {
    if (!this._emeEnabled) {
      return;
    }

    var audioCodecs = data.levels.map(function (level) {
      return level.audioCodec;
    });
    var videoCodecs = data.levels.map(function (level) {
      return level.videoCodec;
    });

    this._attemptKeySystemAccess(KeySystems.WIDEVINE, audioCodecs, videoCodecs);
  };

  eme_controller__createClass(EMEController, [{
    key: 'requestMediaKeySystemAccess',
    get: function get() {
      if (!this._requestMediaKeySystemAccess) {
        throw new Error('No requestMediaKeySystemAccess function configured');
      }

      return this._requestMediaKeySystemAccess;
    }
  }]);

  return EMEController;
}(event_handler);

/* harmony default export */ var eme_controller = (eme_controller_EMEController);
// CONCATENATED MODULE: ./src/utils/mediakeys-helper.js
var requestMediaKeySystemAccess = function () {
  if (typeof window !== 'undefined' && window.navigator && window.navigator.requestMediaKeySystemAccess) {
    return window.navigator.requestMediaKeySystemAccess.bind(window.navigator);
  } else {
    return null;
  }
}();


// CONCATENATED MODULE: ./src/config.js
/**
 * HLS config
 */






// import FetchLoader from './utils/fetch-loader';












var hlsDefaultConfig = {
  autoStartLoad: true, // used by stream-controller
  startPosition: -1, // used by stream-controller
  defaultAudioCodec: undefined, // used by stream-controller
  debug: false, // used by logger
  capLevelOnFPSDrop: false, // used by fps-controller
  capLevelToPlayerSize: false, // used by cap-level-controller
  initialLiveManifestSize: 1, // used by stream-controller
  maxBufferLength: 30, // used by stream-controller
  maxBufferSize: 60 * 1000 * 1000, // used by stream-controller
  maxBufferHole: 0.5, // used by stream-controller

  lowBufferWatchdogPeriod: 0.5, // used by stream-controller
  highBufferWatchdogPeriod: 3, // used by stream-controller
  nudgeOffset: 0.1, // used by stream-controller
  nudgeMaxRetry: 3, // used by stream-controller
  maxFragLookUpTolerance: 0.25, // used by stream-controller
  liveSyncDurationCount: 3, // used by stream-controller
  liveMaxLatencyDurationCount: Infinity, // used by stream-controller
  liveSyncDuration: undefined, // used by stream-controller
  liveMaxLatencyDuration: undefined, // used by stream-controller
  liveDurationInfinity: false, // used by buffer-controller
  maxMaxBufferLength: 600, // used by stream-controller
  enableWorker: true, // used by demuxer
  enableSoftwareAES: true, // used by decrypter
  manifestLoadingTimeOut: 10000, // used by playlist-loader
  manifestLoadingMaxRetry: 1, // used by playlist-loader
  manifestLoadingRetryDelay: 1000, // used by playlist-loader
  manifestLoadingMaxRetryTimeout: 64000, // used by playlist-loader
  startLevel: undefined, // used by level-controller
  levelLoadingTimeOut: 10000, // used by playlist-loader
  levelLoadingMaxRetry: 4, // used by playlist-loader
  levelLoadingRetryDelay: 1000, // used by playlist-loader
  levelLoadingMaxRetryTimeout: 64000, // used by playlist-loader
  fragLoadingTimeOut: 20000, // used by fragment-loader
  fragLoadingMaxRetry: 6, // used by fragment-loader
  fragLoadingRetryDelay: 1000, // used by fragment-loader
  fragLoadingMaxRetryTimeout: 64000, // used by fragment-loader
  startFragPrefetch: false, // used by stream-controller
  fpsDroppedMonitoringPeriod: 5000, // used by fps-controller
  fpsDroppedMonitoringThreshold: 0.2, // used by fps-controller
  appendErrorMaxRetry: 3, // used by buffer-controller
  loader: xhr_loader,
  // loader: FetchLoader,
  fLoader: undefined, // used by fragment-loader
  pLoader: undefined, // used by playlist-loader
  xhrSetup: undefined, // used by xhr-loader
  licenseXhrSetup: undefined, // used by eme-controller
  // fetchSetup: undefined,
  abrController: abr_controller,
  bufferController: buffer_controller,
  capLevelController: cap_level_controller,
  fpsController: fps_controller,
  stretchShortVideoTrack: false, // used by mp4-remuxer
  maxAudioFramesDrift: 1, // used by mp4-remuxer
  forceKeyFrameOnDiscontinuity: true, // used by ts-demuxer
  abrEwmaFastLive: 3, // used by abr-controller
  abrEwmaSlowLive: 9, // used by abr-controller
  abrEwmaFastVoD: 3, // used by abr-controller
  abrEwmaSlowVoD: 9, // used by abr-controller
  abrEwmaDefaultEstimate: 5e5, // 500 kbps  // used by abr-controller
  abrBandWidthFactor: 0.95, // used by abr-controller
  abrBandWidthUpFactor: 0.7, // used by abr-controller
  abrMaxWithRealBitrate: false, // used by abr-controller
  maxStarvationDelay: 4, // used by abr-controller
  maxLoadingDelay: 4, // used by abr-controller
  minAutoBitrate: 0, // used by hls
  emeEnabled: false, // used by eme-controller
  widevineLicenseUrl: undefined, // used by eme-controller
  requestMediaKeySystemAccessFunc: requestMediaKeySystemAccess // used by eme-controller
};

if (true) {
  hlsDefaultConfig.subtitleStreamController = subtitle_stream_controller;
  hlsDefaultConfig.subtitleTrackController = subtitle_track_controller;
  hlsDefaultConfig.timelineController = timeline_controller;
  hlsDefaultConfig.cueHandler = cues_namespaceObject; // used by timeline-controller
  hlsDefaultConfig.enableCEA708Captions = true; // used by timeline-controller
  hlsDefaultConfig.enableWebVTT = true; // used by timeline-controller
  hlsDefaultConfig.captionsTextTrack1Label = 'English'; // used by timeline-controller
  hlsDefaultConfig.captionsTextTrack1LanguageCode = 'en'; // used by timeline-controller
  hlsDefaultConfig.captionsTextTrack2Label = 'Spanish'; // used by timeline-controller
  hlsDefaultConfig.captionsTextTrack2LanguageCode = 'es'; // used by timeline-controller
}

if (true) {
  hlsDefaultConfig.audioStreamController = audio_stream_controller;
  hlsDefaultConfig.audioTrackController = audio_track_controller;
}

if (true) {
  hlsDefaultConfig.emeController = eme_controller;
}
// CONCATENATED MODULE: ./src/hls.js
var hls__createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function hls__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }





















// polyfill for IE11
__webpack_require__(13);

/**
 * @module Hls
 * @class
 * @constructor
 */

var hls_Hls = function () {

  /**
   * @type {boolean}
   */
  Hls.isSupported = function isSupported() {
    return is_supported_isSupported();
  };

  /**
   * @type {HlsEvents}
   */


  hls__createClass(Hls, null, [{
    key: 'version',

    /**
     * @type {string}
     */
    get: function get() {
      return "0.10.0";
    }
  }, {
    key: 'Events',
    get: function get() {
      return events["a" /* default */];
    }

    /**
     * @type {HlsErrorTypes}
     */

  }, {
    key: 'ErrorTypes',
    get: function get() {
      return errors["b" /* ErrorTypes */];
    }

    /**
     * @type {HlsErrorDetails}
     */

  }, {
    key: 'ErrorDetails',
    get: function get() {
      return errors["a" /* ErrorDetails */];
    }

    /**
     * @type {HlsConfig}
     */

  }, {
    key: 'DefaultConfig',
    get: function get() {
      if (!Hls.defaultConfig) {
        return hlsDefaultConfig;
      }

      return Hls.defaultConfig;
    }

    /**
     * @type {HlsConfig}
     */
    ,
    set: function set(defaultConfig) {
      Hls.defaultConfig = defaultConfig;
    }

    /**
     * Creates an instance of an HLS client that can attach to exactly one `HTMLMediaElement`.
     *
     * @constructs Hls
     * @param {HlsConfig} config
     */

  }]);

  function Hls() {
    var _this = this;

    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    hls__classCallCheck(this, Hls);

    var defaultConfig = Hls.DefaultConfig;

    if ((config.liveSyncDurationCount || config.liveMaxLatencyDurationCount) && (config.liveSyncDuration || config.liveMaxLatencyDuration)) {
      throw new Error('Illegal hls.js config: don\'t mix up liveSyncDurationCount/liveMaxLatencyDurationCount and liveSyncDuration/liveMaxLatencyDuration');
    }

    for (var prop in defaultConfig) {
      if (prop in config) continue;
      config[prop] = defaultConfig[prop];
    }

    if (config.liveMaxLatencyDurationCount !== undefined && config.liveMaxLatencyDurationCount <= config.liveSyncDurationCount) {
      throw new Error('Illegal hls.js config: "liveMaxLatencyDurationCount" must be gt "liveSyncDurationCount"');
    }

    if (config.liveMaxLatencyDuration !== undefined && (config.liveMaxLatencyDuration <= config.liveSyncDuration || config.liveSyncDuration === undefined)) {
      throw new Error('Illegal hls.js config: "liveMaxLatencyDuration" must be gt "liveSyncDuration"');
    }

    Object(logger["a" /* enableLogs */])(config.debug);
    this.config = config;
    this._autoLevelCapping = -1;
    // observer setup
    var observer = this.observer = new events_default.a();
    observer.trigger = function trigger(event) {
      for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        data[_key - 1] = arguments[_key];
      }

      observer.emit.apply(observer, [event, event].concat(data));
    };

    observer.off = function off(event) {
      for (var _len2 = arguments.length, data = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        data[_key2 - 1] = arguments[_key2];
      }

      observer.removeListener.apply(observer, [event].concat(data));
    };
    this.on = observer.on.bind(observer);
    this.off = observer.off.bind(observer);
    this.once = observer.once.bind(observer);
    this.trigger = observer.trigger.bind(observer);

    // core controllers and network loaders

    /**
     * @member {AbrController} abrController
     */
    var abrController = this.abrController = new config.abrController(this);

    var bufferController = new config.bufferController(this);
    var capLevelController = new config.capLevelController(this);
    var fpsController = new config.fpsController(this);
    var playListLoader = new playlist_loader(this);
    var fragmentLoader = new fragment_loader(this);
    var keyLoader = new key_loader(this);
    var id3TrackController = new id3_track_controller(this);

    // network controllers

    /**
     * @member {LevelController} levelController
     */
    var levelController = this.levelController = new level_controller(this);

    // FIXME: FragmentTracker must be defined before StreamController because the order of event handling is important
    var fragmentTracker = new fragment_tracker_FragmentTracker(this);

    /**
     * @member {StreamController} streamController
     */
    var streamController = this.streamController = new stream_controller(this, fragmentTracker);

    var networkControllers = [levelController, streamController];

    // optional audio stream controller
    /**
     * @var {ICoreComponent | Controller}
     */
    var Controller = config.audioStreamController;
    if (Controller) {
      networkControllers.push(new Controller(this, fragmentTracker));
    }

    /**
     * @member {INetworkController[]} networkControllers
     */
    this.networkControllers = networkControllers;

    /**
     * @var {ICoreComponent[]}
     */
    var coreComponents = [playListLoader, fragmentLoader, keyLoader, abrController, bufferController, capLevelController, fpsController, id3TrackController, fragmentTracker];

    // optional audio track and subtitle controller
    Controller = config.audioTrackController;
    if (Controller) {
      var audioTrackController = new Controller(this);

      /**
       * @member {AudioTrackController} audioTrackController
       */
      this.audioTrackController = audioTrackController;
      coreComponents.push(audioTrackController);
    }

    Controller = config.subtitleTrackController;
    if (Controller) {
      var subtitleTrackController = new Controller(this);

      /**
       * @member {SubtitleTrackController} subtitleTrackController
       */
      this.subtitleTrackController = subtitleTrackController;
      coreComponents.push(subtitleTrackController);
    }

    Controller = config.emeController;
    if (Controller) {
      var emeController = new Controller(this);

      /**
       * @member {EMEController} emeController
       */
      this.emeController = emeController;
      coreComponents.push(emeController);
    }

    // optional subtitle controller
    [config.subtitleStreamController, config.timelineController].forEach(function (Controller) {
      if (Controller) {
        coreComponents.push(new Controller(_this));
      }
    });

    /**
     * @member {ICoreComponent[]}
     */
    this.coreComponents = coreComponents;
  }

  /**
   * Dispose of the instance
   */


  Hls.prototype.destroy = function destroy() {
    logger["b" /* logger */].log('destroy');
    this.trigger(events["a" /* default */].DESTROYING);
    this.detachMedia();
    this.coreComponents.concat(this.networkControllers).forEach(function (component) {
      component.destroy();
    });
    this.url = null;
    this.observer.removeAllListeners();
    this._autoLevelCapping = -1;
  };

  /**
   * Attach a media element
   * @param {HTMLMediaElement} media
   */


  Hls.prototype.attachMedia = function attachMedia(media) {
    logger["b" /* logger */].log('attachMedia');
    this.media = media;
    this.trigger(events["a" /* default */].MEDIA_ATTACHING, { media: media });
  };

  /**
   * Detach from the media
   */


  Hls.prototype.detachMedia = function detachMedia() {
    logger["b" /* logger */].log('detachMedia');
    this.trigger(events["a" /* default */].MEDIA_DETACHING);
    this.media = null;
  };

  /**
   * Set the source URL. Can be relative or absolute.
   * @param {string} url
   */


  Hls.prototype.loadSource = function loadSource(url) {
    url = url_toolkit_default.a.buildAbsoluteURL(window.location.href, url, { alwaysNormalize: true });
    logger["b" /* logger */].log('loadSource:' + url);
    this.url = url;
    // when attaching to a source URL, trigger a playlist load
    this.trigger(events["a" /* default */].MANIFEST_LOADING, { url: url });
  };

  /**
   * Start loading data from the stream source.
   * Depending on default config, client starts loading automatically when a source is set.
   *
   * @param {number} startPosition Set the start position to stream from
   * @default -1 None (from earliest point)
   */


  Hls.prototype.startLoad = function startLoad() {
    var startPosition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;

    logger["b" /* logger */].log('startLoad(' + startPosition + ')');
    this.networkControllers.forEach(function (controller) {
      controller.startLoad(startPosition);
    });
  };

  /**
   * Stop loading of any stream data.
   */


  Hls.prototype.stopLoad = function stopLoad() {
    logger["b" /* logger */].log('stopLoad');
    this.networkControllers.forEach(function (controller) {
      controller.stopLoad();
    });
  };

  /**
   * Swap through possible audio codecs in the stream (for example to switch from stereo to 5.1)
   */


  Hls.prototype.swapAudioCodec = function swapAudioCodec() {
    logger["b" /* logger */].log('swapAudioCodec');
    this.streamController.swapAudioCodec();
  };

  /**
   * When the media-element fails, this allows to detach and then re-attach it
   * as one call (convenience method).
   *
   * Automatic recovery of media-errors by this process is configurable.
   */


  Hls.prototype.recoverMediaError = function recoverMediaError() {
    logger["b" /* logger */].log('recoverMediaError');
    var media = this.media;
    this.detachMedia();
    this.attachMedia(media);
  };

  /**
   * @type {QualityLevel[]}
   */


  hls__createClass(Hls, [{
    key: 'levels',
    get: function get() {
      return this.levelController.levels;
    }

    /**
     * Index of quality level currently played
     * @type {number}
     */

  }, {
    key: 'currentLevel',
    get: function get() {
      return this.streamController.currentLevel;
    }

    /**
     * Set quality level index immediately .
     * This will flush the current buffer to replace the quality asap.
     * That means playback will interrupt at least shortly to re-buffer and re-sync eventually.
     * @type {number} -1 for automatic level selection
     */
    ,
    set: function set(newLevel) {
      logger["b" /* logger */].log('set currentLevel:' + newLevel);
      this.loadLevel = newLevel;
      this.streamController.immediateLevelSwitch();
    }

    /**
     * Index of next quality level loaded as scheduled by stream controller.
     * @type {number}
     */

  }, {
    key: 'nextLevel',
    get: function get() {
      return this.streamController.nextLevel;
    }

    /**
     * Set quality level index for next loaded data.
     * This will switch the video quality asap, without interrupting playback.
     * May abort current loading of data, and flush parts of buffer (outside currently played fragment region).
     * @type {number} -1 for automatic level selection
     */
    ,
    set: function set(newLevel) {
      logger["b" /* logger */].log('set nextLevel:' + newLevel);
      this.levelController.manualLevel = newLevel;
      this.streamController.nextLevelSwitch();
    }

    /**
     * Return the quality level of the currently or last (of none is loaded currently) segment
     * @type {number}
     */

  }, {
    key: 'loadLevel',
    get: function get() {
      return this.levelController.level;
    }

    /**
     * Set quality level index for next loaded data in a conservative way.
     * This will switch the quality without flushing, but interrupt current loading.
     * Thus the moment when the quality switch will appear in effect will only be after the already existing buffer.
     * @type {number} newLevel -1 for automatic level selection
     */
    ,
    set: function set(newLevel) {
      logger["b" /* logger */].log('set loadLevel:' + newLevel);
      this.levelController.manualLevel = newLevel;
    }

    /**
     * get next quality level loaded
     * @type {number}
     */

  }, {
    key: 'nextLoadLevel',
    get: function get() {
      return this.levelController.nextLoadLevel;
    }

    /**
     * Set quality level of next loaded segment in a fully "non-destructive" way.
     * Same as `loadLevel` but will wait for next switch (until current loading is done).
     * @type {number} level
     */
    ,
    set: function set(level) {
      this.levelController.nextLoadLevel = level;
    }

    /**
     * Return "first level": like a default level, if not set,
     * falls back to index of first level referenced in manifest
     * @type {number}
     */

  }, {
    key: 'firstLevel',
    get: function get() {
      return Math.max(this.levelController.firstLevel, this.minAutoLevel);
    }

    /**
     * Sets "first-level", see getter.
     * @type {number}
     */
    ,
    set: function set(newLevel) {
      logger["b" /* logger */].log('set firstLevel:' + newLevel);
      this.levelController.firstLevel = newLevel;
    }

    /**
     * Return start level (level of first fragment that will be played back)
     * if not overrided by user, first level appearing in manifest will be used as start level
     * if -1 : automatic start level selection, playback will start from level matching download bandwidth
     * (determined from download of first segment)
     * @type {number}
     */

  }, {
    key: 'startLevel',
    get: function get() {
      return this.levelController.startLevel;
    }

    /**
     * set  start level (level of first fragment that will be played back)
     * if not overrided by user, first level appearing in manifest will be used as start level
     * if -1 : automatic start level selection, playback will start from level matching download bandwidth
     * (determined from download of first segment)
     * @type {number} newLevel
     */
    ,
    set: function set(newLevel) {
      logger["b" /* logger */].log('set startLevel:' + newLevel);
      var hls = this;
      // if not in automatic start level detection, ensure startLevel is greater than minAutoLevel
      if (newLevel !== -1) {
        newLevel = Math.max(newLevel, hls.minAutoLevel);
      }

      hls.levelController.startLevel = newLevel;
    }

    /**
     * Capping/max level value that should be used by automatic level selection algorithm (`ABRController`)
     * @type {number}
     */

  }, {
    key: 'autoLevelCapping',
    get: function get() {
      return this._autoLevelCapping;
    }

    /**
     * Capping/max level value that should be used by automatic level selection algorithm (`ABRController`)
     * @type {number}
     */
    ,
    set: function set(newLevel) {
      logger["b" /* logger */].log('set autoLevelCapping:' + newLevel);
      this._autoLevelCapping = newLevel;
    }

    /**
     * True when automatic level selection enabled
     * @type {boolean}
     */

  }, {
    key: 'autoLevelEnabled',
    get: function get() {
      return this.levelController.manualLevel === -1;
    }

    /**
     * Level set manually (if any)
     * @type {number}
     */

  }, {
    key: 'manualLevel',
    get: function get() {
      return this.levelController.manualLevel;
    }

    /**
     * min level selectable in auto mode according to config.minAutoBitrate
     * @type {number}
     */

  }, {
    key: 'minAutoLevel',
    get: function get() {
      var hls = this,
          levels = hls.levels,
          minAutoBitrate = hls.config.minAutoBitrate,
          len = levels ? levels.length : 0;
      for (var i = 0; i < len; i++) {
        var levelNextBitrate = levels[i].realBitrate ? Math.max(levels[i].realBitrate, levels[i].bitrate) : levels[i].bitrate;
        if (levelNextBitrate > minAutoBitrate) {
          return i;
        }
      }
      return 0;
    }

    /**
     * max level selectable in auto mode according to autoLevelCapping
     * @type {number}
     */

  }, {
    key: 'maxAutoLevel',
    get: function get() {
      var hls = this;
      var levels = hls.levels;
      var autoLevelCapping = hls.autoLevelCapping;
      var maxAutoLevel = void 0;
      if (autoLevelCapping === -1 && levels && levels.length) {
        maxAutoLevel = levels.length - 1;
      } else {
        maxAutoLevel = autoLevelCapping;
      }

      return maxAutoLevel;
    }

    /**
     * next automatically selected quality level
     * @type {number}
     */

  }, {
    key: 'nextAutoLevel',
    get: function get() {
      var hls = this;
      // ensure next auto level is between  min and max auto level
      return Math.min(Math.max(hls.abrController.nextAutoLevel, hls.minAutoLevel), hls.maxAutoLevel);
    }

    /**
     * this setter is used to force next auto level.
     * this is useful to force a switch down in auto mode:
     * in case of load error on level N, hls.js can set nextAutoLevel to N-1 for example)
     * forced value is valid for one fragment. upon succesful frag loading at forced level,
     * this value will be resetted to -1 by ABR controller.
     * @type {number}
     */
    ,
    set: function set(nextLevel) {
      var hls = this;
      hls.abrController.nextAutoLevel = Math.max(hls.minAutoLevel, nextLevel);
    }

    /**
     * @type {AudioTrack[]}
     */

  }, {
    key: 'audioTracks',
    get: function get() {
      var audioTrackController = this.audioTrackController;
      return audioTrackController ? audioTrackController.audioTracks : [];
    }

    /**
     * index of the selected audio track (index in audio track lists)
     * @type {number}
     */

  }, {
    key: 'audioTrack',
    get: function get() {
      var audioTrackController = this.audioTrackController;
      return audioTrackController ? audioTrackController.audioTrack : -1;
    }

    /**
     * selects an audio track, based on its index in audio track lists
     * @type {number}
     */
    ,
    set: function set(audioTrackId) {
      var audioTrackController = this.audioTrackController;
      if (audioTrackController) {
        audioTrackController.audioTrack = audioTrackId;
      }
    }

    /**
     * @type {Seconds}
     */

  }, {
    key: 'liveSyncPosition',
    get: function get() {
      return this.streamController.liveSyncPosition;
    }

    /**
     * get alternate subtitle tracks list from playlist
     * @type {SubtitleTrack[]}
     */

  }, {
    key: 'subtitleTracks',
    get: function get() {
      var subtitleTrackController = this.subtitleTrackController;
      return subtitleTrackController ? subtitleTrackController.subtitleTracks : [];
    }

    /**
     * index of the selected subtitle track (index in subtitle track lists)
     * @type {number}
     */

  }, {
    key: 'subtitleTrack',
    get: function get() {
      var subtitleTrackController = this.subtitleTrackController;
      return subtitleTrackController ? subtitleTrackController.subtitleTrack : -1;
    }

    /**
     * select an subtitle track, based on its index in subtitle track lists
     * @type{number}
     */
    ,
    set: function set(subtitleTrackId) {
      var subtitleTrackController = this.subtitleTrackController;
      if (subtitleTrackController) {
        subtitleTrackController.subtitleTrack = subtitleTrackId;
      }
    }

    /**
     * @type {boolean}
     */

  }, {
    key: 'subtitleDisplay',
    get: function get() {
      var subtitleTrackController = this.subtitleTrackController;
      return subtitleTrackController ? subtitleTrackController.subtitleDisplay : false;
    }

    /**
     * Enable/disable subtitle display rendering
     * @type {boolean}
     */
    ,
    set: function set(value) {
      var subtitleTrackController = this.subtitleTrackController;
      if (subtitleTrackController) {
        subtitleTrackController.subtitleDisplay = value;
      }
    }
  }]);

  return Hls;
}();

/* harmony default export */ var src_hls = __webpack_exports__["default"] = (hls_Hls);

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

function webpackBootstrapFunc (modules) {
/******/  // The module cache
/******/  var installedModules = {};

/******/  // The require function
/******/  function __webpack_require__(moduleId) {

/******/    // Check if module is in cache
/******/    if(installedModules[moduleId])
/******/      return installedModules[moduleId].exports;

/******/    // Create a new module (and put it into the cache)
/******/    var module = installedModules[moduleId] = {
/******/      i: moduleId,
/******/      l: false,
/******/      exports: {}
/******/    };

/******/    // Execute the module function
/******/    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/    // Flag the module as loaded
/******/    module.l = true;

/******/    // Return the exports of the module
/******/    return module.exports;
/******/  }

/******/  // expose the modules object (__webpack_modules__)
/******/  __webpack_require__.m = modules;

/******/  // expose the module cache
/******/  __webpack_require__.c = installedModules;

/******/  // identity function for calling harmony imports with the correct context
/******/  __webpack_require__.i = function(value) { return value; };

/******/  // define getter function for harmony exports
/******/  __webpack_require__.d = function(exports, name, getter) {
/******/    if(!__webpack_require__.o(exports, name)) {
/******/      Object.defineProperty(exports, name, {
/******/        configurable: false,
/******/        enumerable: true,
/******/        get: getter
/******/      });
/******/    }
/******/  };

/******/  // getDefaultExport function for compatibility with non-harmony modules
/******/  __webpack_require__.n = function(module) {
/******/    var getter = module && module.__esModule ?
/******/      function getDefault() { return module['default']; } :
/******/      function getModuleExports() { return module; };
/******/    __webpack_require__.d(getter, 'a', getter);
/******/    return getter;
/******/  };

/******/  // Object.prototype.hasOwnProperty.call
/******/  __webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/  // __webpack_public_path__
/******/  __webpack_require__.p = "/";

/******/  // on error function for async loading
/******/  __webpack_require__.oe = function(err) { console.error(err); throw err; };

  var f = __webpack_require__(__webpack_require__.s = ENTRY_MODULE)
  return f.default || f // try to call default if defined to also support babel esmodule exports
}

var moduleNameReqExp = '[\\.|\\-|\\+|\\w|\/|@]+'
var dependencyRegExp = '\\((\/\\*.*?\\*\/)?\s?.*?(' + moduleNameReqExp + ').*?\\)' // additional chars when output.pathinfo is true

// http://stackoverflow.com/a/2593661/130442
function quoteRegExp (str) {
  return (str + '').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&')
}

function getModuleDependencies (sources, module, queueName) {
  var retval = {}
  retval[queueName] = []

  var fnString = module.toString()
  var wrapperSignature = fnString.match(/^function\s?\(\w+,\s*\w+,\s*(\w+)\)/)
  if (!wrapperSignature) return retval
  var webpackRequireName = wrapperSignature[1]

  // main bundle deps
  var re = new RegExp('(\\\\n|\\W)' + quoteRegExp(webpackRequireName) + dependencyRegExp, 'g')
  var match
  while ((match = re.exec(fnString))) {
    if (match[3] === 'dll-reference') continue
    retval[queueName].push(match[3])
  }

  // dll deps
  re = new RegExp('\\(' + quoteRegExp(webpackRequireName) + '\\("(dll-reference\\s(' + moduleNameReqExp + '))"\\)\\)' + dependencyRegExp, 'g')
  while ((match = re.exec(fnString))) {
    if (!sources[match[2]]) {
      retval[queueName].push(match[1])
      sources[match[2]] = __webpack_require__(match[1]).m
    }
    retval[match[2]] = retval[match[2]] || []
    retval[match[2]].push(match[4])
  }

  return retval
}

function hasValuesInQueues (queues) {
  var keys = Object.keys(queues)
  return keys.reduce(function (hasValues, key) {
    return hasValues || queues[key].length > 0
  }, false)
}

function getRequiredModules (sources, moduleId) {
  var modulesQueue = {
    main: [moduleId]
  }
  var requiredModules = {
    main: []
  }
  var seenModules = {
    main: {}
  }

  while (hasValuesInQueues(modulesQueue)) {
    var queues = Object.keys(modulesQueue)
    for (var i = 0; i < queues.length; i++) {
      var queueName = queues[i]
      var queue = modulesQueue[queueName]
      var moduleToCheck = queue.pop()
      seenModules[queueName] = seenModules[queueName] || {}
      if (seenModules[queueName][moduleToCheck] || !sources[queueName][moduleToCheck]) continue
      seenModules[queueName][moduleToCheck] = true
      requiredModules[queueName] = requiredModules[queueName] || []
      requiredModules[queueName].push(moduleToCheck)
      var newModules = getModuleDependencies(sources, sources[queueName][moduleToCheck], queueName)
      var newModulesKeys = Object.keys(newModules)
      for (var j = 0; j < newModulesKeys.length; j++) {
        modulesQueue[newModulesKeys[j]] = modulesQueue[newModulesKeys[j]] || []
        modulesQueue[newModulesKeys[j]] = modulesQueue[newModulesKeys[j]].concat(newModules[newModulesKeys[j]])
      }
    }
  }

  return requiredModules
}

module.exports = function (moduleId, options) {
  options = options || {}
  var sources = {
    main: __webpack_require__.m
  }

  var requiredModules = options.all ? { main: Object.keys(sources) } : getRequiredModules(sources, moduleId)

  var src = ''

  Object.keys(requiredModules).filter(function (m) { return m !== 'main' }).forEach(function (module) {
    var entryModule = 0
    while (requiredModules[module][entryModule]) {
      entryModule++
    }
    requiredModules[module].push(entryModule)
    sources[module][entryModule] = '(function(module, exports, __webpack_require__) { module.exports = __webpack_require__; })'
    src = src + 'var ' + module + ' = (' + webpackBootstrapFunc.toString().replace('ENTRY_MODULE', JSON.stringify(entryModule)) + ')({' + requiredModules[module].map(function (id) { return '' + JSON.stringify(id) + ': ' + sources[module][id].toString() }).join(',') + '});\n'
  })

  src = src + '(' + webpackBootstrapFunc.toString().replace('ENTRY_MODULE', JSON.stringify(moduleId)) + ')({' + requiredModules.main.map(function (id) { return '' + JSON.stringify(id) + ': ' + sources.main[id].toString() }).join(',') + '})(self);'

  var blob = new window.Blob([src], { type: 'text/javascript' })
  if (options.bare) { return blob }

  var URL = window.URL || window.webkitURL || window.mozURL || window.msURL

  var workerUrl = URL.createObjectURL(blob)
  var worker = new window.Worker(workerUrl)
  worker.objectURL = workerUrl

  return worker
}


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__demux_demuxer_inline__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__events__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_logger__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_events__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_events___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_events__);
/* demuxer web worker.
 *  - listen to worker message, and trigger DemuxerInline upon reception of Fragments.
 *  - provides MP4 Boxes back to main thread using [transferable objects](https://developers.google.com/web/updates/2011/12/Transferable-Objects-Lightning-Fast) in order to minimize message passing overhead.
 */






var DemuxerWorker = function DemuxerWorker(self) {
  // observer setup
  var observer = new __WEBPACK_IMPORTED_MODULE_3_events___default.a();
  observer.trigger = function trigger(event) {
    for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      data[_key - 1] = arguments[_key];
    }

    observer.emit.apply(observer, [event, event].concat(data));
  };

  observer.off = function off(event) {
    for (var _len2 = arguments.length, data = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      data[_key2 - 1] = arguments[_key2];
    }

    observer.removeListener.apply(observer, [event].concat(data));
  };

  var forwardMessage = function forwardMessage(ev, data) {
    self.postMessage({ event: ev, data: data });
  };

  self.addEventListener('message', function (ev) {
    var data = ev.data;
    // console.log('demuxer cmd:' + data.cmd);
    switch (data.cmd) {
      case 'init':
        var config = JSON.parse(data.config);
        self.demuxer = new __WEBPACK_IMPORTED_MODULE_0__demux_demuxer_inline__["a" /* default */](observer, data.typeSupported, config, data.vendor);
        try {
          Object(__WEBPACK_IMPORTED_MODULE_2__utils_logger__["a" /* enableLogs */])(config.debug === true);
        } catch (err) {
          console.warn('demuxerWorker: unable to enable logs');
        }
        // signal end of worker init
        forwardMessage('init', null);
        break;
      case 'demux':
        self.demuxer.push(data.data, data.decryptdata, data.initSegment, data.audioCodec, data.videoCodec, data.timeOffset, data.discontinuity, data.trackSwitch, data.contiguous, data.duration, data.accurateTimeOffset, data.defaultInitPTS);
        break;
      default:
        break;
    }
  });

  // forward events to main thread
  observer.on(__WEBPACK_IMPORTED_MODULE_1__events__["a" /* default */].FRAG_DECRYPTED, forwardMessage);
  observer.on(__WEBPACK_IMPORTED_MODULE_1__events__["a" /* default */].FRAG_PARSING_INIT_SEGMENT, forwardMessage);
  observer.on(__WEBPACK_IMPORTED_MODULE_1__events__["a" /* default */].FRAG_PARSED, forwardMessage);
  observer.on(__WEBPACK_IMPORTED_MODULE_1__events__["a" /* default */].ERROR, forwardMessage);
  observer.on(__WEBPACK_IMPORTED_MODULE_1__events__["a" /* default */].FRAG_PARSING_METADATA, forwardMessage);
  observer.on(__WEBPACK_IMPORTED_MODULE_1__events__["a" /* default */].FRAG_PARSING_USERDATA, forwardMessage);
  observer.on(__WEBPACK_IMPORTED_MODULE_1__events__["a" /* default */].INIT_PTS_FOUND, forwardMessage);

  // special case for FRAG_PARSING_DATA: pass data1/data2 as transferable object (no copy)
  observer.on(__WEBPACK_IMPORTED_MODULE_1__events__["a" /* default */].FRAG_PARSING_DATA, function (ev, data) {
    var transferable = [];
    var message = { event: ev, data: data };
    if (data.data1) {
      message.data1 = data.data1.buffer;
      transferable.push(data.data1.buffer);
      delete data.data1;
    }
    if (data.data2) {
      message.data2 = data.data2.buffer;
      transferable.push(data.data2.buffer);
      delete data.data2;
    }
    self.postMessage(message, transferable);
  });
};

/* harmony default export */ __webpack_exports__["default"] = (DemuxerWorker);

/***/ }),
/* 13 */
/***/ (function(module, exports) {

/*! http://mths.be/endswith v0.2.0 by @mathias */
if (!String.prototype.endsWith) {
	(function() {
		'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
		var defineProperty = (function() {
			// IE 8 only supports `Object.defineProperty` on DOM elements
			try {
				var object = {};
				var $defineProperty = Object.defineProperty;
				var result = $defineProperty(object, object, object) && $defineProperty;
			} catch(error) {}
			return result;
		}());
		var toString = {}.toString;
		var endsWith = function(search) {
			if (this == null) {
				throw TypeError();
			}
			var string = String(this);
			if (search && toString.call(search) == '[object RegExp]') {
				throw TypeError();
			}
			var stringLength = string.length;
			var searchString = String(search);
			var searchLength = searchString.length;
			var pos = stringLength;
			if (arguments.length > 1) {
				var position = arguments[1];
				if (position !== undefined) {
					// `ToInteger`
					pos = position ? Number(position) : 0;
					if (pos != pos) { // better `isNaN`
						pos = 0;
					}
				}
			}
			var end = Math.min(Math.max(pos, 0), stringLength);
			var start = end - searchLength;
			if (start < 0) {
				return false;
			}
			var index = -1;
			while (++index < searchLength) {
				if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
					return false;
				}
			}
			return true;
		};
		if (defineProperty) {
			defineProperty(String.prototype, 'endsWith', {
				'value': endsWith,
				'configurable': true,
				'writable': true
			});
		} else {
			String.prototype.endsWith = endsWith;
		}
	}());
}


/***/ })
/******/ ])["default"];
});
//# sourceMappingURL=hls.js.map

/***/ })
/******/ ]);
});
//# sourceMappingURL=hls.js.map