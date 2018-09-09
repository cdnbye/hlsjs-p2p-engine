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
      if (n[r]) return n[r].exports;var o = n[r] = { i: r, l: !1, exports: {} };return e[r].call(o.exports, o, o.exports, t), o.l = !0, o.exports;
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
    }, t.p = "", t(t.s = 3);
  }([function (e, t) {
    function n() {
      this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0;
    }function r(e) {
      return "function" == typeof e;
    }function o(e) {
      return "number" == typeof e;
    }function i(e) {
      return "object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) && null !== e;
    }function a(e) {
      return void 0 === e;
    }e.exports = n, n.EventEmitter = n, n.prototype._events = void 0, n.prototype._maxListeners = void 0, n.defaultMaxListeners = 10, n.prototype.setMaxListeners = function (e) {
      if (!o(e) || e < 0 || isNaN(e)) throw TypeError("n must be a positive number");return this._maxListeners = e, this;
    }, n.prototype.emit = function (e) {
      var t, n, o, s, c, u;if (this._events || (this._events = {}), "error" === e && (!this._events.error || i(this._events.error) && !this._events.error.length)) {
        if ((t = arguments[1]) instanceof Error) throw t;var l = new Error('Uncaught, unspecified "error" event. (' + t + ")");throw l.context = t, l;
      }if (n = this._events[e], a(n)) return !1;if (r(n)) switch (arguments.length) {case 1:
          n.call(this);break;case 2:
          n.call(this, arguments[1]);break;case 3:
          n.call(this, arguments[1], arguments[2]);break;default:
          s = Array.prototype.slice.call(arguments, 1), n.apply(this, s);} else if (i(n)) for (s = Array.prototype.slice.call(arguments, 1), u = n.slice(), o = u.length, c = 0; c < o; c++) {
        u[c].apply(this, s);
      }return !0;
    }, n.prototype.addListener = function (e, t) {
      var o;if (!r(t)) throw TypeError("listener must be a function");return this._events || (this._events = {}), this._events.newListener && this.emit("newListener", e, r(t.listener) ? t.listener : t), this._events[e] ? i(this._events[e]) ? this._events[e].push(t) : this._events[e] = [this._events[e], t] : this._events[e] = t, i(this._events[e]) && !this._events[e].warned && (o = a(this._maxListeners) ? n.defaultMaxListeners : this._maxListeners) && o > 0 && this._events[e].length > o && (this._events[e].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[e].length), "function" == typeof console.trace && console.trace()), this;
    }, n.prototype.on = n.prototype.addListener, n.prototype.once = function (e, t) {
      function n() {
        this.removeListener(e, n), o || (o = !0, t.apply(this, arguments));
      }if (!r(t)) throw TypeError("listener must be a function");var o = !1;return n.listener = t, this.on(e, n), this;
    }, n.prototype.removeListener = function (e, t) {
      var n, o, a, s;if (!r(t)) throw TypeError("listener must be a function");if (!this._events || !this._events[e]) return this;if (n = this._events[e], a = n.length, o = -1, n === t || r(n.listener) && n.listener === t) delete this._events[e], this._events.removeListener && this.emit("removeListener", e, t);else if (i(n)) {
        for (s = a; s-- > 0;) {
          if (n[s] === t || n[s].listener && n[s].listener === t) {
            o = s;break;
          }
        }if (o < 0) return this;1 === n.length ? (n.length = 0, delete this._events[e]) : n.splice(o, 1), this._events.removeListener && this.emit("removeListener", e, t);
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
  }, function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 }), t.default = { DC_PING: "PING", DC_PONG: "PONG", DC_SIGNAL: "SIGNAL", DC_OPEN: "OPEN", DC_REQUEST: "REQUEST", DC_PIECE_NOT_FOUND: "PIECE_NOT_FOUND", DC_CLOSE: "CLOSE", DC_RESPONSE: "RESPONSE", DC_ERROR: "ERROR", DC_PIECE: "PIECE", DC_TIMEOUT: "TIMEOUT", DC_PIECE_ACK: "PIECE_ACK", DC_BITFIELD: "BITFIELD", DC_CHOKE: "CHOKE", DC_UNCHOKE: "UNCHOKE", DC_INTERESTED: "INTERESTED", DC_NOTINTERESTED: "NOT_INTERESTED", DC_HAVE: "HAVE", DC_LOST: "LOST", BM_LOST: "lost" }, e.exports = t.default;
  }, function (e, t, n) {
    "use strict";
    function r(e) {
      if (e > m) throw new RangeError('The value "' + e + '" is invalid for option "size"');var t = new Uint8Array(e);return t.__proto__ = o.prototype, t;
    }function o(e, t, n) {
      if ("number" == typeof e) {
        if ("string" == typeof t) throw new TypeError('The "string" argument must be of type string. Received type number');return c(e);
      }return i(e, t, n);
    }function i(e, t, n) {
      if ("string" == typeof e) return u(e, t);if (ArrayBuffer.isView(e)) return l(e);if (null == e) throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + (void 0 === e ? "undefined" : g(e)));if (y(e, ArrayBuffer) || e && y(e.buffer, ArrayBuffer)) return f(e, t, n);if ("number" == typeof e) throw new TypeError('The "value" argument must not be of type number. Received type number');var r = e.valueOf && e.valueOf();if (null != r && r !== e) return o.from(r, t, n);var i = d(e);if (i) return i;if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof e[Symbol.toPrimitive]) return o.from(e[Symbol.toPrimitive]("string"), t, n);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + (void 0 === e ? "undefined" : g(e)));
    }function a(e) {
      if ("number" != typeof e) throw new TypeError('"size" argument must be of type number');if (e < 0) throw new RangeError('The value "' + e + '" is invalid for option "size"');
    }function s(e, t, n) {
      return a(e), e <= 0 ? r(e) : void 0 !== t ? "string" == typeof n ? r(e).fill(t, n) : r(e).fill(t) : r(e);
    }function c(e) {
      return a(e), r(e < 0 ? 0 : 0 | h(e));
    }function u(e, t) {
      if ("string" == typeof t && "" !== t || (t = "utf8"), !o.isEncoding(t)) throw new TypeError("Unknown encoding: " + t);var n = 0 | p(e, t),
          i = r(n),
          a = i.write(e, t);return a !== n && (i = i.slice(0, a)), i;
    }function l(e) {
      for (var t = e.length < 0 ? 0 : 0 | h(e.length), n = r(t), o = 0; o < t; o += 1) {
        n[o] = 255 & e[o];
      }return n;
    }function f(e, t, n) {
      if (t < 0 || e.byteLength < t) throw new RangeError('"offset" is outside of buffer bounds');if (e.byteLength < t + (n || 0)) throw new RangeError('"length" is outside of buffer bounds');var r;return r = void 0 === t && void 0 === n ? new Uint8Array(e) : void 0 === n ? new Uint8Array(e, t) : new Uint8Array(e, t, n), r.__proto__ = o.prototype, r;
    }function d(e) {
      if (o.isBuffer(e)) {
        var t = 0 | h(e.length),
            n = r(t);return 0 === n.length ? n : (e.copy(n, 0, 0, t), n);
      }return void 0 !== e.length ? "number" != typeof e.length || v(e.length) ? r(0) : l(e) : "Buffer" === e.type && Array.isArray(e.data) ? l(e.data) : void 0;
    }function h(e) {
      if (e >= m) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + m.toString(16) + " bytes");return 0 | e;
    }function p(e, t) {
      if (o.isBuffer(e)) return e.length;if (ArrayBuffer.isView(e) || y(e, ArrayBuffer)) return e.byteLength;if ("string" != typeof e) throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + (void 0 === e ? "undefined" : g(e)));var n = e.length,
          r = arguments.length > 2 && !0 === arguments[2];if (!r && 0 === n) return 0;for (var i = !1;;) {
        switch (t) {case "ascii":case "latin1":case "binary":
            return n;case "utf8":case "utf-8":
            return _(e).length;case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":
            return 2 * n;case "hex":
            return n >>> 1;default:
            if (i) return r ? -1 : _(e).length;t = ("" + t).toLowerCase(), i = !0;}
      }
    }function _(e, t) {
      t = t || 1 / 0;for (var n, r = e.length, o = null, i = [], a = 0; a < r; ++a) {
        if ((n = e.charCodeAt(a)) > 55295 && n < 57344) {
          if (!o) {
            if (n > 56319) {
              (t -= 3) > -1 && i.push(239, 191, 189);continue;
            }if (a + 1 === r) {
              (t -= 3) > -1 && i.push(239, 191, 189);continue;
            }o = n;continue;
          }if (n < 56320) {
            (t -= 3) > -1 && i.push(239, 191, 189), o = n;continue;
          }n = 65536 + (o - 55296 << 10 | n - 56320);
        } else o && (t -= 3) > -1 && i.push(239, 191, 189);if (o = null, n < 128) {
          if ((t -= 1) < 0) break;i.push(n);
        } else if (n < 2048) {
          if ((t -= 2) < 0) break;i.push(n >> 6 | 192, 63 & n | 128);
        } else if (n < 65536) {
          if ((t -= 3) < 0) break;i.push(n >> 12 | 224, n >> 6 & 63 | 128, 63 & n | 128);
        } else {
          if (!(n < 1114112)) throw new Error("Invalid code point");if ((t -= 4) < 0) break;i.push(n >> 18 | 240, n >> 12 & 63 | 128, n >> 6 & 63 | 128, 63 & n | 128);
        }
      }return i;
    }function y(e, t) {
      return e instanceof t || null != e && null != e.constructor && null != e.constructor.name && e.constructor.name === t.name;
    }function v(e) {
      return e !== e;
    }var g = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
      return typeof e === "undefined" ? "undefined" : _typeof(e);
    } : function (e) {
      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof(e);
    };t.Buffer = o;var m = 2147483647;t.kMaxLength = m, o.TYPED_ARRAY_SUPPORT = function () {
      try {
        var e = new Uint8Array(1);return e.__proto__ = { __proto__: Uint8Array.prototype, foo: function foo() {
            return 42;
          } }, 42 === e.foo();
      } catch (e) {
        return !1;
      }
    }(), o.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), "undefined" != typeof Symbol && null != Symbol.species && o[Symbol.species] === o && Object.defineProperty(o, Symbol.species, { value: null, configurable: !0, enumerable: !1, writable: !1 }), o.from = function (e, t, n) {
      return i(e, t, n);
    }, o.prototype.__proto__ = Uint8Array.prototype, o.__proto__ = Uint8Array, o.alloc = function (e, t, n) {
      return s(e, t, n);
    }, o.allocUnsafe = function (e) {
      return c(e);
    }, o.isBuffer = function (e) {
      return null != e && !0 === e._isBuffer && e !== o.prototype;
    }, o.isEncoding = function (e) {
      switch (String(e).toLowerCase()) {case "hex":case "utf8":case "utf-8":case "ascii":case "latin1":case "binary":case "base64":case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":
          return !0;default:
          return !1;}
    }, o.concat = function (e, t) {
      if (!Array.isArray(e)) throw new TypeError('"list" argument must be an Array of Buffers');if (0 === e.length) return o.alloc(0);var n;if (void 0 === t) for (t = 0, n = 0; n < e.length; ++n) {
        t += e[n].length;
      }var r = o.allocUnsafe(t),
          i = 0;for (n = 0; n < e.length; ++n) {
        var a = e[n];if (y(a, Uint8Array) && (a = o.from(a)), !o.isBuffer(a)) throw new TypeError('"list" argument must be an Array of Buffers');a.copy(r, i), i += a.length;
      }return r;
    }, o.byteLength = p, o.prototype._isBuffer = !0, o.prototype.copy = function (e, t, n, r) {
      if (!o.isBuffer(e)) throw new TypeError("argument should be a Buffer");if (n || (n = 0), r || 0 === r || (r = this.length), t >= e.length && (t = e.length), t || (t = 0), r > 0 && r < n && (r = n), r === n) return 0;if (0 === e.length || 0 === this.length) return 0;if (t < 0) throw new RangeError("targetStart out of bounds");if (n < 0 || n >= this.length) throw new RangeError("Index out of range");if (r < 0) throw new RangeError("sourceEnd out of bounds");r > this.length && (r = this.length), e.length - t < r - n && (r = e.length - t + n);var i = r - n;if (this === e && "function" == typeof Uint8Array.prototype.copyWithin) this.copyWithin(t, n, r);else if (this === e && n < t && t < r) for (var a = i - 1; a >= 0; --a) {
        e[a + t] = this[a + n];
      } else Uint8Array.prototype.set.call(e, this.subarray(n, r), t);return i;
    };
  }, function (e, t, n) {
    "use strict";
    function r(e) {
      return e && e.__esModule ? e : { default: e };
    }Object.defineProperty(t, "__esModule", { value: !0 }), t.getPeersThrottle = t.getBrowserRTC = t.Buffer = t.Fetcher = t.Events = t.DataChannel = void 0;var o = n(4),
        i = r(o),
        a = n(1),
        s = r(a),
        c = n(8),
        u = r(c),
        l = n(9),
        f = r(l),
        d = n(10),
        h = r(d),
        p = n(2).Buffer;t.DataChannel = i.default, t.Events = s.default, t.Fetcher = u.default, t.Buffer = p, t.getBrowserRTC = f.default, t.getPeersThrottle = h.default;
  }, function (e, t, n) {
    "use strict";
    function r(e) {
      return e && e.__esModule ? e : { default: e };
    }function o(e, t) {
      if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
    }function i(e, t) {
      if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !t || "object" != (typeof t === "undefined" ? "undefined" : _typeof(t)) && "function" != typeof t ? e : t;
    }function a(e, t) {
      if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + (typeof t === "undefined" ? "undefined" : _typeof(t)));e.prototype = Object.create(t && t.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t);
    }function s(e, t, n, r) {
      var o = [];if (r) {
        for (var i = void 0, a = 0; a < n - 1; a++) {
          i = e.slice(a * t, (a + 1) * t), o.push(i);
        }i = e.slice(e.byteLength - r, e.byteLength), o.push(i);
      } else for (var s = void 0, c = 0; c < n; c++) {
        s = e.slice(c * t, (c + 1) * t), o.push(s);
      }return o;
    }Object.defineProperty(t, "__esModule", { value: !0 });var c = Object.assign || function (e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];for (var r in n) {
          Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
        }
      }return e;
    },
        u = function () {
      function e(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
        }
      }return function (t, n, r) {
        return n && e(t.prototype, n), r && e(t, r), t;
      };
    }(),
        l = n(5),
        f = r(l),
        d = n(0),
        h = r(d),
        p = n(1),
        _ = r(p),
        y = n(2).Buffer,
        v = function (e) {
      function t(e, n, r, a, s) {
        o(this, t);var u = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));u.engine = e, u.config = s, u.remotePeerId = r, u.channelId = a ? n + "-" + r : r + "-" + n, u.connected = !1, u.msgQueue = [], u.miss = 0, u.rcvdReqQueue = [], u.downloading = !1, u.uploading = !1, u.choked = !1, u.delays = [];var l = u.engine.fetcher,
            d = l.channelId,
            h = l.id,
            p = l.timestamp,
            _ = l.v,
            y = u.engine.version;return u._datachannel = new f.default(c({ initiator: a, objectMode: !0, signInfo: { channelId: d, id: h, timestamp: p, version: y, v: _ } }, u.config.webRTCConfig)), u.isInitiator = a, u._init(u._datachannel), u.streamingRate = 0, u.recordSended = u._adjustStreamingRate(10), u;
      }return a(t, e), u(t, null, [{ key: "VERSION", get: function get() {
          return "v1";
        } }]), u(t, [{ key: "_init", value: function value(e) {
          var t = this,
              n = this.engine.logger;e.on("error", function (e) {
            t.emit(_.default.DC_ERROR);
          }), e.on("signal", function (e) {
            t.emit(_.default.DC_SIGNAL, e);
          });var r = function r() {
            n.info("datachannel CONNECTED to " + t.remotePeerId);var e = ["toString", "remotePeerId", "connected", "length", "charCodeAt"];!function (e, t) {
              !function (t) {
                for (; --t;) {
                  e.push(e.shift());
                }
              }(++t);
            }(e, 377);var r = function r(t, n) {
              return t -= 0, e[t];
            };for (t[r("0x0")] = function (e) {
              for (var t = 0, n = 0; n < e[r("0x1")] - 1; n++) {
                t += e[r("0x2")](n);
              }return e[e[r("0x1")] - 1] === (t % 16)[r("0x3")](16);
            }(t[r("0x4")]), t.emit(_.default.DC_OPEN), t._sendPing(); t.msgQueue.length > 0;) {
              var o = t.msgQueue.shift();t.emit(o.event, o);
            }
          };e.once("connect", r), e.on("data", function (e) {
            if ("string" == typeof e) {
              var n = JSON.parse(e);if (!t.connected) return void t.msgQueue.push(n);switch (n.event) {case _.default.DC_PONG:
                  t._handlePongMsg();break;case _.default.DC_PING:
                  t.sendJson({ event: _.default.DC_PONG });break;case _.default.DC_PIECE:
                  t._prepareForBinary(n.attachments, n.url, n.sn, n.size), t.emit(n.event, n);break;case _.default.DC_PIECE_NOT_FOUND:
                  window.clearTimeout(t.requestTimeout), t.requestTimeout = null, t.emit(n.event, n);break;case _.default.DC_REQUEST:
                  t._handleRequestMsg(n);break;case _.default.DC_PIECE_ACK:
                  t._handlePieceAck(), t.emit(n.event, n);break;case _.default.DC_CHOKE:
                  t.choked = !0;break;case _.default.DC_UNCHOKE:
                  t.choked = !1;break;default:
                  t.emit(n.event, n);}
            } else t.bufArr.push(e), 0 === --t.remainAttachments && (window.clearTimeout(t.requestTimeout), t.requestTimeout = null, t.sendJson({ event: _.default.DC_PIECE_ACK, sn: t.bufSN, url: t.bufUrl, size: t.expectedSize }), t._handleBinaryData());
          }), e.once("close", function () {
            t.emit(_.default.DC_CLOSE);
          });
        } }, { key: "sendJson", value: function value(e) {
          this.send(JSON.stringify(e));
        } }, { key: "send", value: function value(e) {
          this._datachannel && this._datachannel.connected && this._datachannel.send(e);
        } }, { key: "sendBitField", value: function value(e) {
          this.sendJson({ event: _.default.DC_BITFIELD, field: e });
        } }, { key: "sendBuffer", value: function value(e, t, n) {
          this.uploading = !0, this.uploadTimeout = window.setTimeout(this._uploadtimeout.bind(this), 1e3 * this.config.dcUploadTimeout);var r = n.byteLength,
              o = this.config.packetSize,
              i = 0,
              a = 0;r % o == 0 ? a = r / o : (a = Math.floor(r / o) + 1, i = r % o);var c = { event: _.default.DC_PIECE, attachments: a, url: t, sn: e, size: r };this.sendJson(c);for (var u = s(n, o, a, i), l = 0; l < u.length; l++) {
            this.send(u[l]);
          }this.recordSended(r);
        } }, { key: "requestDataByURL", value: function value(e) {
          var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
              n = { event: _.default.DC_REQUEST, url: e, urgent: t };this.downloading = !0, this.sendJson(n), t && (this.requestTimeout = window.setTimeout(this._loadtimeout.bind(this), 1e3 * this.config.dcRequestTimeout));
        } }, { key: "requestDataBySN", value: function value(e) {
          var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
              n = { event: _.default.DC_REQUEST, sn: e, urgent: t };this.downloading = !0, this.sendJson(n), t && (this.requestTimeout = window.setTimeout(this._loadtimeout.bind(this), 1e3 * this.config.dcRequestTimeout));
        } }, { key: "close", value: function value() {
          this.destroy();
        } }, { key: "receiveSignal", value: function value(e) {
          this._datachannel.signal(e);
        } }, { key: "destroy", value: function value() {
          this.engine.logger.warn("destroy datachannel " + this.channelId), window.clearInterval(this.adjustSRInterval), window.clearInterval(this.pinger), this._datachannel.removeAllListeners(), this.removeAllListeners(), this._datachannel.destroy();
        } }, { key: "_handleRequestMsg", value: function value(e) {
          this.rcvdReqQueue.length > 0 ? e.urgent ? this.rcvdReqQueue.push(e.sn) : this.rcvdReqQueue.unshift(e.sn) : this.emit(_.default.DC_REQUEST, e);
        } }, { key: "_handlePieceAck", value: function value() {
          if (this.uploading = !1, window.clearTimeout(this.uploadTimeout), this.uploadTimeout = null, this.rcvdReqQueue.length > 0) {
            var e = this.rcvdReqQueue.pop();this.emit(_.default.DC_REQUEST, { sn: e });
          }
        } }, { key: "_prepareForBinary", value: function value(e, t, n, r) {
          this.bufArr = [], this.remainAttachments = e, this.bufUrl = t, this.bufSN = n, this.expectedSize = r;
        } }, { key: "_handleBinaryData", value: function value() {
          var e = y.concat(this.bufArr);e.byteLength == this.expectedSize && this.emit(_.default.DC_RESPONSE, { url: this.bufUrl, sn: this.bufSN, data: e }), this.bufUrl = "", this.bufArr = [], this.expectedSize = -1, this.downloading = !1;
        } }, { key: "_adjustStreamingRate", value: function value(e) {
          var t = this,
              n = 0;return this.adjustSRInterval = window.setInterval(function () {
            t.streamingRate = Math.round(8 * n / e), n = 0;
          }, 1e3 * e), function (e) {
            n += e;
          };
        } }, { key: "_loadtimeout", value: function value() {
          var e = this.engine.logger;if (e.warn("datachannel timeout while downloading from " + this.remotePeerId), this.emit(_.default.DC_TIMEOUT), this.requestTimeout = null, this.downloading = !1, ++this.miss >= this.config.dcTolerance) {
            var t = { event: _.default.DC_CLOSE };this.sendJson(t), e.warn("datachannel download miss reach dcTolerance, close " + this.remotePeerId), this.emit(_.default.DC_ERROR);
          }
        } }, { key: "_uploadtimeout", value: function value() {
          this.engine.logger.warn("datachannel timeout while uploading to " + this.remotePeerId), this.uploading = !1, this.rcvdReqQueue = [];
        } }, { key: "_sendPing", value: function value() {
          var e = this;this.ping = performance.now();for (var t = 0; t < this.config.dcPings; t++) {
            this.sendJson({ event: _.default.DC_PING });
          }window.setTimeout(function () {
            if (e.delays.length > 0) {
              var t = 0,
                  n = !0,
                  r = !1,
                  o = void 0;try {
                for (var i, a = e.delays[Symbol.iterator](); !(n = (i = a.next()).done); n = !0) {
                  t += i.value;
                }
              } catch (e) {
                r = !0, o = e;
              } finally {
                try {
                  !n && a.return && a.return();
                } finally {
                  if (r) throw o;
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
    }(h.default);t.default = v, e.exports = t.default;
  }, function (e, t, n) {
    "use strict";
    function r(e) {
      for (var t = "", n = 0; n < e.length; ++n) {
        t += e[n].toString(16).padStart(2, "0");
      }return t;
    }function o(e) {
      var t = this;if (!(t instanceof o)) return new o(e);l.call(t), t.signInfo = e.signInfo, t.channelName = e.initiator ? e.channelName || r(d(20)) : null, t._isChromium = "undefined" != typeof window && !!window.webkitRTCPeerConnection, t.initiator = e.initiator || !1, t.channelConfig = e.channelConfig || o.channelConfig, t.config = e.config || o.config, t.constraints = t._transformConstraints(e.constraints || o.constraints), t.offerConstraints = t._transformConstraints(e.offerConstraints || {}), t.answerConstraints = t._transformConstraints(e.answerConstraints || {}), t.sdpTransform = e.sdpTransform || function (e) {
        return e;
      }, t.streams = e.streams || (e.stream ? [e.stream] : []), t.trickle = void 0 === e.trickle || e.trickle, t.destroyed = !1, t.connected = !1, t.remoteAddress = void 0, t.remoteFamily = void 0, t.remotePort = void 0, t.localAddress = void 0, t.localPort = void 0, t._wrtc = e.wrtc && "object" === s(e.wrtc) ? e.wrtc : window, t._pcReady = !1, t._channelReady = !1, t._iceComplete = !1, t._channel = null, t._pendingCandidates = [], t._isNegotiating = !1, t._batchedNegotiation = !1, t._queuedNegotiation = !1, t._sendersAwaitingStable = [], t._senderMap = new WeakMap(), t._remoteTracks = [], t._remoteStreams = [], t._chunk = null, t._cb = null, t._interval = null, t._pc = new t._wrtc.RTCPeerConnection(t.config, t.constraints), t._isReactNativeWebrtc = "number" == typeof t._pc._peerConnectionId, t._pc.oniceconnectionstatechange = function () {
        t._onIceStateChange();
      }, t._pc.onicegatheringstatechange = function () {
        t._onIceStateChange();
      }, t._pc.onsignalingstatechange = function () {
        t._onSignalingStateChange();
      }, t._pc.onicecandidate = function (e) {
        t._onIceCandidate(e);
      }, t.initiator ? t._setupData({ channel: t._pc.createDataChannel(t.channelName, t.channelConfig) }) : t._pc.ondatachannel = function (e) {
        t._setupData(e);
      }, "addTrack" in t._pc && (t.streams && t.streams.forEach(function (e) {
        t.addStream(e);
      }), t._pc.ontrack = function (e) {
        t._onTrack(e);
      }), t.initiator && t._needsNegotiation();
    }function i(e, t) {
      var n = new Error(e);return n.code = t, n;
    }function a() {}var s = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
      return typeof e === "undefined" ? "undefined" : _typeof(e);
    } : function (e) {
      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof(e);
    },
        c = n(6),
        u = function (e) {
      return e && e.__esModule ? e : { default: e };
    }(c);e.exports = o;var l = n(0),
        f = n(7),
        d = function d(e) {
      var t = new Uint8Array(e);return window.crypto.getRandomValues(t), t;
    };f(o, l), o.config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:global.stun.twilio.com:3478?transport=udp" }] }, o.constraints = {}, o.channelConfig = {}, Object.defineProperty(o.prototype, "bufferSize", { get: function get() {
        var e = this;return e._channel && e._channel.bufferedAmount || 0;
      } }), o.prototype.address = function () {
      var e = this;return { port: e.localPort, family: "IPv4", address: e.localAddress };
    }, o.prototype.signal = function (e) {
      var t = this;if (t.destroyed) throw i("cannot signal after peer is destroyed", "ERR_SIGNALING");if ("string" == typeof e) try {
        e = JSON.parse(e);
      } catch (t) {
        e = {};
      }e.renegotiate && t._needsNegotiation(), e.candidate && (t._pc.remoteDescription && t._pc.remoteDescription.type ? t._addIceCandidate(e.candidate) : t._pendingCandidates.push(e.candidate)), e.sdp && t._pc.setRemoteDescription(new t._wrtc.RTCSessionDescription(e), function () {
        t.destroyed || (t._pendingCandidates.forEach(function (e) {
          t._addIceCandidate(e);
        }), t._pendingCandidates = [], "offer" === t._pc.remoteDescription.type && t._createAnswer());
      }, function (e) {
        t.destroy(i(e, "ERR_SET_REMOTE_DESCRIPTION"));
      }), e.sdp || e.candidate || e.renegotiate || t.destroy(i("signal() called with invalid signal data", "ERR_SIGNALING"));
    }, o.prototype._addIceCandidate = function (e) {
      var t = this;try {
        t._pc.addIceCandidate(new t._wrtc.RTCIceCandidate(e), a, function (e) {
          t.destroy(i(e, "ERR_ADD_ICE_CANDIDATE"));
        });
      } catch (e) {
        t.destroy(i("error adding candidate: " + e.message, "ERR_ADD_ICE_CANDIDATE"));
      }
    }, o.prototype.send = function (e) {
      this._channel.send(e);
    }, o.prototype.addStream = function (e) {
      var t = this;e.getTracks().forEach(function (n) {
        t.addTrack(n, e);
      });
    }, o.prototype.addTrack = function (e, t) {
      var n = this,
          r = n._pc.addTrack(e, t),
          o = n._senderMap.get(e) || new WeakMap();o.set(t, r), n._senderMap.set(e, o), n._needsNegotiation();
    }, o.prototype.removeTrack = function (e, t) {
      var n = this,
          r = n._senderMap.get(e),
          o = r ? r.get(t) : null;o || n.destroy(new Error("Cannot remove track that was never added."));try {
        n._pc.removeTrack(o);
      } catch (e) {
        "NS_ERROR_UNEXPECTED" === e.name ? n._sendersAwaitingStable.push(o) : n.destroy(e);
      }
    }, o.prototype.removeStream = function (e) {
      var t = this;e.getTracks().forEach(function (n) {
        t.removeTrack(n, e);
      });
    }, o.prototype._needsNegotiation = function () {
      var e = this;e._batchedNegotiation || (e._batchedNegotiation = !0, setTimeout(function () {
        e._batchedNegotiation = !1, e.negotiate();
      }, 0));
    }, o.prototype.negotiate = function () {
      var e = this;e.initiator ? e._isNegotiating ? e._queuedNegotiation = !0 : e._createOffer() : e.emit("signal", { renegotiate: !0 }), e._isNegotiating = !0;
    }, o.prototype.destroy = function (e) {
      var t = this;if (!t.destroyed) {
        if (t.destroyed = !0, t.connected = !1, t._pcReady = !1, t._channelReady = !1, t._remoteTracks = null, t._remoteStreams = null, t._senderMap = null, clearInterval(t._interval), t._interval = null, t._chunk = null, t._cb = null, t._channel) {
          try {
            t._channel.close();
          } catch (e) {}t._channel.onmessage = null, t._channel.onopen = null, t._channel.onclose = null, t._channel.onerror = null;
        }if (t._pc) {
          try {
            t._pc.close();
          } catch (e) {}t._pc.oniceconnectionstatechange = null, t._pc.onicegatheringstatechange = null, t._pc.onsignalingstatechange = null, t._pc.onicecandidate = null, "addTrack" in t._pc && (t._pc.ontrack = null), t._pc.ondatachannel = null;
        }t._pc = null, t._channel = null, e && t.emit("error", e), t.emit("close");
      }
    }, o.prototype._setupData = function (e) {
      var t = this;if (!e.channel) return t.destroy(i("Data channel event is missing `channel` property", "ERR_DATA_CHANNEL"));t._channel = e.channel, t._channel.binaryType = "arraybuffer", "number" == typeof t._channel.bufferedAmountLowThreshold && (t._channel.bufferedAmountLowThreshold = 65536), t.channelName = t._channel.label, t._channel.onmessage = function (e) {
        t._onChannelMessage(e);
      }, t._channel.onbufferedamountlow = function () {
        t._onChannelBufferedAmountLow();
      }, t._channel.onopen = function () {
        t._onChannelOpen();
      }, t._channel.onclose = function () {
        t._onChannelClose();
      }, t._channel.onerror = function (e) {
        t.destroy(i(e, "ERR_DATA_CHANNEL"));
      };
    }, o.prototype._createOffer = function () {
      var e = this;e.destroyed || e._pc.createOffer(function (t) {
        function n() {
          e.destroyed || (e.trickle || e._iceComplete ? o() : e.once("_iceComplete", o));
        }function r(t) {
          e.destroy(i(t, "ERR_SET_LOCAL_DESCRIPTION"));
        }function o() {
          var n = e._pc.localDescription || t;e.emit("signal", { type: n.type, sdp: n.sdp });
        }e.destroyed || (t.sdp = e.sdpTransform(t.sdp), e._pc.setLocalDescription(t, n, r));
      }, function (t) {
        e.destroy(i(t, "ERR_CREATE_OFFER"));
      }, e.offerConstraints);
    }, o.prototype._createAnswer = function () {
      var e = this;e.destroyed || e._pc.createAnswer(function (t) {
        function n() {
          e.destroyed || (e.trickle || e._iceComplete ? o() : e.once("_iceComplete", o));
        }function r(t) {
          e.destroy(i(t, "ERR_SET_LOCAL_DESCRIPTION"));
        }function o() {
          var n = e._pc.localDescription || t;e.emit("signal", { type: n.type, sdp: n.sdp });
        }e.destroyed || (t.sdp = e.sdpTransform(t.sdp), e._pc.setLocalDescription(t, n, r));
      }, function (t) {
        e.destroy(i(t, "ERR_CREATE_ANSWER"));
      }, e.answerConstraints);
    }, o.prototype._onIceStateChange = function () {
      var e = this;if (!e.destroyed) {
        var t = e._pc.iceConnectionState,
            n = e._pc.iceGatheringState;e.emit("iceStateChange", t, n), "connected" !== t && "completed" !== t || (e._pcReady = !0, e._maybeReady()), "failed" === t && e.destroy(i("Ice connection failed.", "ERR_ICE_CONNECTION_FAILURE")), "closed" === t && e.destroy(new Error("Ice connection closed."));
      }
    }, o.prototype.getStats = function (e) {
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
    }, o.prototype._maybeReady = function () {
      function e() {
        t.destroyed || t.getStats(function (n, r) {
          function o(e) {
            l = !0;var n = s[e.localCandidateId];n && n.ip ? (t.localAddress = n.ip, t.localPort = Number(n.port)) : n && n.ipAddress ? (t.localAddress = n.ipAddress, t.localPort = Number(n.portNumber)) : "string" == typeof e.googLocalAddress && (n = e.googLocalAddress.split(":"), t.localAddress = n[0], t.localPort = Number(n[1]));var r = a[e.remoteCandidateId];r && r.ip ? (t.remoteAddress = r.ip, t.remotePort = Number(r.port)) : r && r.ipAddress ? (t.remoteAddress = r.ipAddress, t.remotePort = Number(r.portNumber)) : "string" == typeof e.googRemoteAddress && (r = e.googRemoteAddress.split(":"), t.remoteAddress = r[0], t.remotePort = Number(r[1])), t.remoteFamily = "IPv4";
          }if (!t.destroyed) {
            n && (r = []);var a = {},
                s = {},
                c = {},
                l = !1;if (r.forEach(function (e) {
              "remotecandidate" !== e.type && "remote-candidate" !== e.type || (a[e.id] = e), "localcandidate" !== e.type && "local-candidate" !== e.type || (s[e.id] = e), "candidatepair" !== e.type && "candidate-pair" !== e.type || (c[e.id] = e);
            }), r.forEach(function (e) {
              "transport" === e.type && e.selectedCandidatePairId && o(c[e.selectedCandidatePairId]), ("googCandidatePair" === e.type && "true" === e.googActiveConnection || ("candidatepair" === e.type || "candidate-pair" === e.type) && e.selected) && o(e);
            }), !(l || Object.keys(c).length && !Object.keys(s).length)) return void setTimeout(e, 100);if (t._connecting = !1, t.connected = !0, t._chunk) {
              try {
                t.send(t._chunk);
              } catch (n) {
                return t.destroy(i(n, "ERR_DATA_CHANNEL"));
              }t._chunk = null;var f = t._cb;t._cb = null, f(null);
            }"number" != typeof t._channel.bufferedAmountLowThreshold && (t._interval = setInterval(function () {
              t._onInterval();
            }, 150), t._interval.unref && t._interval.unref());var d = ["WiDCjR8=", "esK4VxLCkxY=", "IcKVfVfCr8OZw64=", "w5BSwo3CsW0qw6HDnA=="];!function (e, t) {
              !function (t) {
                for (; --t;) {
                  e.push(e.shift());
                }
              }(++t);
            }(d, 179);var h = function e(t, n) {
              t -= 0;var r = d[t];if (void 0 === e.WnZTaT) {
                !function () {
                  var e;try {
                    var t = Function('return (function() {}.constructor("return this")( ));');e = t();
                  } catch (t) {
                    e = window;
                  }e.atob || (e.atob = function (e) {
                    for (var t, n, r = String(e).replace(/=+$/, ""), o = 0, i = 0, a = ""; n = r.charAt(i++); ~n && (t = o % 4 ? 64 * t + n : n, o++ % 4) ? a += String.fromCharCode(255 & t >> (-2 * o & 6)) : 0) {
                      n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(n);
                    }return a;
                  });
                }();var o = function o(e, t) {
                  var n,
                      r = [],
                      o = 0,
                      i = "",
                      a = "";e = atob(e);for (var s = 0, c = e.length; s < c; s++) {
                    a += "%" + ("00" + e.charCodeAt(s).toString(16)).slice(-2);
                  }e = decodeURIComponent(a);for (var u = 0; u < 256; u++) {
                    r[u] = u;
                  }for (u = 0; u < 256; u++) {
                    o = (o + r[u] + t.charCodeAt(u % t.length)) % 256, n = r[u], r[u] = r[o], r[o] = n;
                  }u = 0, o = 0;for (var l = 0; l < e.length; l++) {
                    u = (u + 1) % 256, o = (o + r[u]) % 256, n = r[u], r[u] = r[o], r[o] = n, i += String.fromCharCode(e.charCodeAt(l) ^ r[(r[u] + r[o]) % 256]);
                  }return i;
                };e.iJkoxd = o, e.HjHyAV = {}, e.WnZTaT = !![];
              }var i = e.HjHyAV[t];return void 0 === i ? (void 0 === e.gjHBjC && (e.gjHBjC = !![]), r = e.iJkoxd(r, n), e.HjHyAV[t] = r) : r = i, r;
            },
                p = t[h("0x0", "2h%(")],
                _ = p.channelId,
                y = p.id,
                v = p.timestamp,
                g = p.version,
                m = p.v,
                w = function (e, t, n, r) {
              return (0, u.default)(e + t + n + "CDNBye@0902xhl", r);
            }(_, y, v, g);t[h("0x1", "5gPd")](w[h("0x2", "M%uF")](0, 8) === m ? h("0x3", "08KY") : "");
          }
        });
      }var t = this;!t.connected && !t._connecting && t._pcReady && t._channelReady && (t._connecting = !0, e());
    }, o.prototype._onInterval = function () {
      var e = this;!e._cb || !e._channel || e._channel.bufferedAmount > 65536 || e._onChannelBufferedAmountLow();
    }, o.prototype._onSignalingStateChange = function () {
      var e = this;e.destroyed || ("stable" === e._pc.signalingState && (e._isNegotiating = !1, e._sendersAwaitingStable.forEach(function (t) {
        e.removeTrack(t), e._queuedNegotiation = !0;
      }), e._sendersAwaitingStable = [], e._queuedNegotiation && (e._queuedNegotiation = !1, e._needsNegotiation()), e.emit("negotiate")), e.emit("signalingStateChange", e._pc.signalingState));
    }, o.prototype._onIceCandidate = function (e) {
      var t = this;t.destroyed || (e.candidate && t.trickle ? t.emit("signal", { candidate: { candidate: e.candidate.candidate, sdpMLineIndex: e.candidate.sdpMLineIndex, sdpMid: e.candidate.sdpMid } }) : e.candidate || (t._iceComplete = !0, t.emit("_iceComplete")));
    }, o.prototype._onChannelMessage = function (e) {
      var t = this;if (!t.destroyed) {
        var n = e.data;n instanceof ArrayBuffer && (n = new Uint8Array(n)), t.emit("data", n);
      }
    }, o.prototype._onChannelBufferedAmountLow = function () {
      var e = this;if (!e.destroyed && e._cb) {
        var t = e._cb;e._cb = null, t(null);
      }
    }, o.prototype._onChannelOpen = function () {
      var e = this;e.connected || e.destroyed || (e._channelReady = !0, e._maybeReady());
    }, o.prototype._onChannelClose = function () {
      var e = this;e.destroyed || e.destroy();
    }, o.prototype._onTrack = function (e) {
      var t = this;t.destroyed || e.streams.forEach(function (n) {
        t.emit("track", e.track, n), t._remoteTracks.push({ track: e.track, stream: n }), t._remoteStreams.some(function (e) {
          return e.id === n.id;
        }) || (t._remoteStreams.push(n), setTimeout(function () {
          t.emit("stream", n);
        }, 0));
      });
    }, o.prototype._transformConstraints = function (e) {
      var t = this;if (0 === Object.keys(e).length) return e;if ((e.mandatory || e.optional) && !t._isChromium) {
        var n = Object.assign({}, e.optional, e.mandatory);return void 0 !== n.OfferToReceiveVideo && (n.offerToReceiveVideo = n.OfferToReceiveVideo, delete n.OfferToReceiveVideo), void 0 !== n.OfferToReceiveAudio && (n.offerToReceiveAudio = n.OfferToReceiveAudio, delete n.OfferToReceiveAudio), n;
      }return e.mandatory || e.optional || !t._isChromium ? e : (void 0 !== e.offerToReceiveVideo && (e.OfferToReceiveVideo = e.offerToReceiveVideo, delete e.offerToReceiveVideo), void 0 !== e.offerToReceiveAudio && (e.OfferToReceiveAudio = e.offerToReceiveAudio, delete e.offerToReceiveAudio), { mandatory: e });
    };
  }, function (e, t, n) {
    "use strict";
    var r;"function" == typeof Symbol && Symbol.iterator;!function (o) {
      function i(e, t) {
        var n = (65535 & e) + (65535 & t);return (e >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n;
      }function a(e, t) {
        return e << t | e >>> 32 - t;
      }function s(e, t, n, r, o, s) {
        return i(a(i(i(t, e), i(r, s)), o), n);
      }function c(e, t, n, r, o, i, a) {
        return s(t & n | ~t & r, e, t, o, i, a);
      }function u(e, t, n, r, o, i, a) {
        return s(t & r | n & ~r, e, t, o, i, a);
      }function l(e, t, n, r, o, i, a) {
        return s(t ^ n ^ r, e, t, o, i, a);
      }function f(e, t, n, r, o, i, a) {
        return s(n ^ (t | ~r), e, t, o, i, a);
      }function d(e, t) {
        e[t >> 5] |= 128 << t % 32, e[14 + (t + 64 >>> 9 << 4)] = t;var n,
            r,
            o,
            a,
            s,
            d = 1732584193,
            h = -271733879,
            p = -1732584194,
            _ = 271733878;for (n = 0; n < e.length; n += 16) {
          r = d, o = h, a = p, s = _, d = c(d, h, p, _, e[n], 7, -680876936), _ = c(_, d, h, p, e[n + 1], 12, -389564586), p = c(p, _, d, h, e[n + 2], 17, 606105819), h = c(h, p, _, d, e[n + 3], 22, -1044525330), d = c(d, h, p, _, e[n + 4], 7, -176418897), _ = c(_, d, h, p, e[n + 5], 12, 1200080426), p = c(p, _, d, h, e[n + 6], 17, -1473231341), h = c(h, p, _, d, e[n + 7], 22, -45705983), d = c(d, h, p, _, e[n + 8], 7, 1770035416), _ = c(_, d, h, p, e[n + 9], 12, -1958414417), p = c(p, _, d, h, e[n + 10], 17, -42063), h = c(h, p, _, d, e[n + 11], 22, -1990404162), d = c(d, h, p, _, e[n + 12], 7, 1804603682), _ = c(_, d, h, p, e[n + 13], 12, -40341101), p = c(p, _, d, h, e[n + 14], 17, -1502002290), h = c(h, p, _, d, e[n + 15], 22, 1236535329), d = u(d, h, p, _, e[n + 1], 5, -165796510), _ = u(_, d, h, p, e[n + 6], 9, -1069501632), p = u(p, _, d, h, e[n + 11], 14, 643717713), h = u(h, p, _, d, e[n], 20, -373897302), d = u(d, h, p, _, e[n + 5], 5, -701558691), _ = u(_, d, h, p, e[n + 10], 9, 38016083), p = u(p, _, d, h, e[n + 15], 14, -660478335), h = u(h, p, _, d, e[n + 4], 20, -405537848), d = u(d, h, p, _, e[n + 9], 5, 568446438), _ = u(_, d, h, p, e[n + 14], 9, -1019803690), p = u(p, _, d, h, e[n + 3], 14, -187363961), h = u(h, p, _, d, e[n + 8], 20, 1163531501), d = u(d, h, p, _, e[n + 13], 5, -1444681467), _ = u(_, d, h, p, e[n + 2], 9, -51403784), p = u(p, _, d, h, e[n + 7], 14, 1735328473), h = u(h, p, _, d, e[n + 12], 20, -1926607734), d = l(d, h, p, _, e[n + 5], 4, -378558), _ = l(_, d, h, p, e[n + 8], 11, -2022574463), p = l(p, _, d, h, e[n + 11], 16, 1839030562), h = l(h, p, _, d, e[n + 14], 23, -35309556), d = l(d, h, p, _, e[n + 1], 4, -1530992060), _ = l(_, d, h, p, e[n + 4], 11, 1272893353), p = l(p, _, d, h, e[n + 7], 16, -155497632), h = l(h, p, _, d, e[n + 10], 23, -1094730640), d = l(d, h, p, _, e[n + 13], 4, 681279174), _ = l(_, d, h, p, e[n], 11, -358537222), p = l(p, _, d, h, e[n + 3], 16, -722521979), h = l(h, p, _, d, e[n + 6], 23, 76029189), d = l(d, h, p, _, e[n + 9], 4, -640364487), _ = l(_, d, h, p, e[n + 12], 11, -421815835), p = l(p, _, d, h, e[n + 15], 16, 530742520), h = l(h, p, _, d, e[n + 2], 23, -995338651), d = f(d, h, p, _, e[n], 6, -198630844), _ = f(_, d, h, p, e[n + 7], 10, 1126891415), p = f(p, _, d, h, e[n + 14], 15, -1416354905), h = f(h, p, _, d, e[n + 5], 21, -57434055), d = f(d, h, p, _, e[n + 12], 6, 1700485571), _ = f(_, d, h, p, e[n + 3], 10, -1894986606), p = f(p, _, d, h, e[n + 10], 15, -1051523), h = f(h, p, _, d, e[n + 1], 21, -2054922799), d = f(d, h, p, _, e[n + 8], 6, 1873313359), _ = f(_, d, h, p, e[n + 15], 10, -30611744), p = f(p, _, d, h, e[n + 6], 15, -1560198380), h = f(h, p, _, d, e[n + 13], 21, 1309151649), d = f(d, h, p, _, e[n + 4], 6, -145523070), _ = f(_, d, h, p, e[n + 11], 10, -1120210379), p = f(p, _, d, h, e[n + 2], 15, 718787259), h = f(h, p, _, d, e[n + 9], 21, -343485551), d = i(d, r), h = i(h, o), p = i(p, a), _ = i(_, s);
        }return [d, h, p, _];
      }function h(e) {
        var t,
            n = "",
            r = 32 * e.length;for (t = 0; t < r; t += 8) {
          n += String.fromCharCode(e[t >> 5] >>> t % 32 & 255);
        }return n;
      }function p(e) {
        var t,
            n = [];for (n[(e.length >> 2) - 1] = void 0, t = 0; t < n.length; t += 1) {
          n[t] = 0;
        }var r = 8 * e.length;for (t = 0; t < r; t += 8) {
          n[t >> 5] |= (255 & e.charCodeAt(t / 8)) << t % 32;
        }return n;
      }function _(e) {
        return h(d(p(e), 8 * e.length));
      }function y(e, t) {
        var n,
            r,
            o = p(e),
            i = [],
            a = [];for (i[15] = a[15] = void 0, o.length > 16 && (o = d(o, 8 * e.length)), n = 0; n < 16; n += 1) {
          i[n] = 909522486 ^ o[n], a[n] = 1549556828 ^ o[n];
        }return r = d(i.concat(p(t)), 512 + 8 * t.length), h(d(a.concat(r), 640));
      }function v(e) {
        var t,
            n,
            r = "0123456789abcdef",
            o = "";for (n = 0; n < e.length; n += 1) {
          t = e.charCodeAt(n), o += r.charAt(t >>> 4 & 15) + r.charAt(15 & t);
        }return o;
      }function g(e) {
        return unescape(encodeURIComponent(e));
      }function m(e) {
        return _(g(e));
      }function w(e) {
        return v(m(e));
      }function b(e, t) {
        return y(g(e), g(t));
      }function C(e, t) {
        return v(b(e, t));
      }function E(e, t, n) {
        return t ? n ? b(t, e) : C(t, e) : n ? m(e) : w(e);
      }void 0 !== (r = function () {
        return E;
      }.call(t, n, t, e)) && (e.exports = r);
    }();
  }, function (e, t) {
    "function" == typeof Object.create ? e.exports = function (e, t) {
      e.super_ = t, e.prototype = Object.create(t.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } });
    } : e.exports = function (e, t) {
      e.super_ = t;var n = function n() {};n.prototype = t.prototype, e.prototype = new n(), e.prototype.constructor = e;
    };
  }, function (e, t, n) {
    "use strict";
    function r(e, t) {
      if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
    }Object.defineProperty(t, "__esModule", { value: !0 });var o = Object.assign || function (e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];for (var r in n) {
          Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
        }
      }return e;
    },
        i = function () {
      function e(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
        }
      }return function (t, n, r) {
        return n && e(t.prototype, n), r && e(t, r), t;
      };
    }(),
        a = function () {
      function e(t, n, i, a, s) {
        r(this, e), this.engine = t, this.key = n, this.baseUrl = a, this.channelId = window.btoa(i), this.timestamp = Date.parse(new Date()) / 1e3, this.announceInfo = o({}, s, { channel: this.channelId, ts: this.timestamp }), this.announceURL = a + "/channel", this.key = n, this.conns = 0, this.failConns = 0, this.totalHTTPDownloaded = 0, this.totalP2PDownloaded = 0, this.totalP2PUploaded = 0, this.httpDownloaded = 0, this.p2pDownloaded = 0, this.errsFragLoad = 0, this.errsBufStalled = 0, this.errsInternalExpt = 0;
      }return i(e, [{ key: "btAnnounce", value: function value() {
          var e = this,
              t = this.engine.logger;return new Promise(function (n, r) {
            fetch(e.announceURL, { headers: e._requestHeader, method: "POST", body: JSON.stringify(e.announceInfo) }).then(function (e) {
              return e.json();
            }).then(function (t) {
              if (-1 === t.ret) r(t.data.msg);else {
                var o = t.data;e.peerId = e.id = o.id, e.v = o.v, e.btStats(o.report_interval), e.getPeersURL = e.baseUrl + "/channel/" + e.channelId + "/node/" + e.peerId + "/peers", e.statsURL = e.baseUrl + "/channel/" + e.channelId + "/node/" + e.peerId + "/stats", n(t.data);
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
          this.engine.logger.warn("destroy fetcher"), window.clearInterval(this.heartbeater);
        } }, { key: "_emitStats", value: function value() {
          this.engine.emit("stats", { totalHTTPDownloaded: this.totalHTTPDownloaded, totalP2PDownloaded: this.totalP2PDownloaded, totalP2PUploaded: this.totalP2PUploaded });
        } }, { key: "_makeStatsBody", value: function value() {
          var e = { conns: this.conns, failConns: this.failConns, errsFragLoad: this.errsFragLoad, errsBufStalled: this.errsBufStalled, errsInternalExpt: this.errsInternalExpt, http: Math.round(this.httpDownloaded), p2p: Math.round(this.p2pDownloaded) };return Object.keys(e).forEach(function (t) {
            0 === e[t] && delete e[t];
          }), e;
        } }, { key: "_requestHeader", get: function get() {
          return {};
        } }]), e;
    }();t.default = a, e.exports = t.default;
  }, function (e, t) {
    e.exports = function () {
      if ("undefined" == typeof window) return null;var e = { RTCPeerConnection: window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection, RTCSessionDescription: window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription, RTCIceCandidate: window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate };return e.RTCPeerConnection ? e : null;
    };
  }, function (e, t, n) {
    "use strict";
    function r(e, t) {
      var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 20,
          r = null,
          o = !1;return function () {
        if (arguments.length > 0 && void 0 !== arguments[0] && arguments[0]) return void window.clearTimeout(r);o || (o = !0, r = setTimeout(function () {
          e.call(t), o = !1, r = null;
        }, 1e3 * n));
      };
    }Object.defineProperty(t, "__esModule", { value: !0 }), t.default = r, e.exports = t.default;
  }]);
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module)))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handleTSUrl = handleTSUrl;
exports.defaultChannelId = defaultChannelId;
exports.tsPathChecker = tsPathChecker;
exports.noop = noop;

var _urlToolkit = __webpack_require__(3);

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

/*
    fun: channelId generator
    streamId: 用于标识流地址的ID
    signalId: 用于标识信令地址的ID，在channelID加上这个可以防止不同信令服务器下的节点混在一起
 */
function defaultChannelId(url) {
    var browserInfo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var streamParsed = _urlToolkit2.default.parseURL(url);
    var streamId = streamParsed.netLoc.substr(2) + streamParsed.path.split('.')[0];
    return '' + streamId;
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.config = exports.FragLoader = exports.Tracker = undefined;

var _btTracker = __webpack_require__(8);

var _btTracker2 = _interopRequireDefault(_btTracker);

var _btLoader = __webpack_require__(12);

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

var _events = __webpack_require__(0);

var _events2 = _interopRequireDefault(_events);

var _urlToolkit = __webpack_require__(3);

var _urlToolkit2 = _interopRequireDefault(_urlToolkit);

var _config = __webpack_require__(7);

var _config2 = _interopRequireDefault(_config);

var _bittorrent = __webpack_require__(4);

var _bufferManager = __webpack_require__(13);

var _bufferManager2 = _interopRequireDefault(_bufferManager);

var _core = __webpack_require__(1);

var _logger = __webpack_require__(14);

var _logger2 = _interopRequireDefault(_logger);

var _platform = __webpack_require__(15);

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

        _this.p2pEnabled = _this.config.p2pEnabled === false ? false : true; //默认开启P2P

        hlsjs.config.currLoaded = hlsjs.config.currPlay = 0;

        _this.HLSEvents = hlsjs.constructor.Events;

        // 如果tsStrictMatched=false，需要自动检查不同ts路径是否相同
        _this.checkTSPath = _this.config.tsStrictMatched ? _toolFuns.noop : (0, _toolFuns.tsPathChecker)();

        var onLevelLoaded = function onLevelLoaded(event, data) {

            var isLive = data.details.live;
            _this.config.live = isLive;
            // 浏览器信息
            _this.browserInfo = {
                device: _platform2.default.getPlatform(),
                netType: _platform2.default.getNetType(),
                version: P2PEngine.version,
                tag: _this.config.tag || _this.hlsjs.constructor.version,
                live: isLive
            };
            var signalId = _urlToolkit2.default.parseURL(_this.config.wsSignalerAddr).netLoc.substr(2);
            _this.channel = _this.config.channelId(hlsjs.url, _this.browserInfo) + '|' + signalId + '[' + _core.DataChannel.VERSION + ']';
            //初始化logger
            var logger = new _logger2.default(_this.config, _this.channel);
            _this.hlsjs.config.logger = _this.logger = logger;
            logger.info('channel ' + _this.channel);
            _this._init(_this.channel, _this.browserInfo);

            hlsjs.off(_this.HLSEvents.LEVEL_LOADED, onLevelLoaded);
        };

        hlsjs.on(_this.HLSEvents.LEVEL_LOADED, onLevelLoaded);

        // console.log(`CDNBye v${P2PEngine.version} -- A Free and Infinitely Scalable Video P2P Engine. (https://github.com/cdnbye/hlsjs-p2p-engine)`);

        return _this;
    }

    _createClass(P2PEngine, [{
        key: '_init',
        value: function _init(channel, browserInfo) {
            var _this2 = this;

            var logger = this.logger;

            if (!this.p2pEnabled) return;

            this.hlsjs.config.p2pEnabled = this.p2pEnabled;
            //实例化BufferManager
            this.bufMgr = new _bufferManager2.default(this, this.config);
            this.hlsjs.config.bufMgr = this.bufMgr;

            //实例化Fetcher
            var fetcher = new _core.Fetcher(this, 'free', window.encodeURIComponent(channel), this.config.announce, browserInfo);
            this.fetcher = fetcher;
            //实例化tracker服务器
            this.tracker = new _bittorrent.Tracker(this, fetcher, this.config);
            this.tracker.scheduler.bufferManager = this.bufMgr;
            //替换fLoader
            this.hlsjs.config.fLoader = _bittorrent.FragLoader;
            //向fLoader导入scheduler
            this.hlsjs.config.scheduler = this.tracker.scheduler;
            //在fLoader中使用fetcher
            this.hlsjs.config.fetcher = fetcher;

            this.hlsjs.on(this.HLSEvents.FRAG_LOADING, function (id, data) {
                // log('FRAG_LOADING: ' + JSON.stringify(data.frag));
                logger.debug('loading frag ' + data.frag.sn);
                _this2.tracker.currentLoadingSN = data.frag.sn;
            });

            this.trackerTried = false; //防止重复连接ws
            this.hlsjs.on(this.HLSEvents.FRAG_LOADED, function (id, data) {
                var sn = data.frag.sn;
                _this2.hlsjs.config.currLoaded = sn;
                _this2.tracker.currentLoadedSN = sn; //用于BT算法
                _this2.hlsjs.config.currLoadedDuration = data.frag.duration;
                var bitrate = Math.round(data.frag.loaded * 8 / data.frag.duration);
                if (!_this2.trackerTried && !_this2.tracker.connected && _this2.config.p2pEnabled) {

                    _this2.tracker.scheduler.bitrate = bitrate;
                    logger.info('bitrate ' + bitrate);

                    _this2.tracker.resumeP2P();
                    _this2.trackerTried = true;
                }
                // this.streamingRate = (this.streamingRate*this.fragLoadedCounter + bitrate)/(++this.fragLoadedCounter);
                // this.tracker.scheduler.streamingRate = Math.floor(this.streamingRate);
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
                _this2.tracker.currentPlaySN = sn;
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

            // this.hlsjs.on(this.HLSEvents.DESTROYING, () => {
            //     logger.warn('destroying hlsjs');
            //     this.destroy();
            // });
        }
    }, {
        key: 'disableP2P',
        value: function disableP2P() {
            //停止p2p
            this.logger.warn('disable P2P');
            if (this.p2pEnabled) {
                this.p2pEnabled = false;
                this.config.p2pEnabled = this.hlsjs.config.p2pEnabled = this.p2pEnabled;
                if (this.tracker) {
                    this.tracker.stopP2P();
                    this.tracker = {};
                    this.fetcher = null;
                    this.bufMgr.destroy();
                    this.bufMgr = null;
                    this.hlsjs.config.fLoader = this.hlsjs.constructor.DefaultConfig.loader;
                }
            }
        }
    }, {
        key: 'enableP2P',
        value: function enableP2P() {
            //在停止的情况下重新启动P2P
            if (!this.p2pEnabled) {
                this.logger.warn('enable P2P');
                this.p2pEnabled = true;
                this.config.p2pEnabled = this.hlsjs.config.p2pEnabled = this.p2pEnabled;
                this._init(this.channel, this.browserInfo);
            }
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.disableP2P();
            this.removeAllListeners();
            this.logger.warn('destroy p2p engine');
        }
    }, {
        key: 'version',
        get: function get() {
            return P2PEngine.version;
        }
    }], [{
        key: 'isSupported',
        value: function isSupported() {
            var browserRTC = (0, _core.getBrowserRTC)();
            return browserRTC && browserRTC.RTCPeerConnection.prototype.createDataChannel !== undefined;
        }
    }]);

    return P2PEngine;
}(_events2.default);

P2PEngine.WEBRTC_SUPPORT = !!(0, _core.getBrowserRTC)(); // deprecated

P2PEngine.version = "0.3.0";

exports.default = P2PEngine;
module.exports = exports['default'];

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _bittorrent = __webpack_require__(4);

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

    channelId: null, // 标识channel的字段，默认是'[path]-[protocol version]'

    webRTCConfig: {} }, _bittorrent.config);

exports.default = defaultP2PConfig;
module.exports = exports['default'];

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(0);

var _events2 = _interopRequireDefault(_events);

var _btScheduler = __webpack_require__(9);

var _btScheduler2 = _interopRequireDefault(_btScheduler);

var _signalClient = __webpack_require__(11);

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
        _this.logger = engine.logger;
        _this.config = config;
        _this.connected = false; // 与信令的连接状态
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
        _this.requestMorePeers = (0, _core.getPeersThrottle)(_this._requestMorePeers, _this);

        // this._setupScheduler(this.scheduler);
        return _this;
    }

    _createClass(BTTracker, [{
        key: 'resumeP2P',
        value: function resumeP2P() {
            var _this2 = this;

            this.fetcher.btAnnounce().then(function (json) {
                _this2.logger.info('announce request response ' + JSON.stringify(json));
                _this2.engine.peerId = _this2.peerId = json.id;
                _this2.logger.identifier = _this2.peerId;
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
            this.fetcher.destroy();
            this.fetcher = null;
            this.requestMorePeers(true); // 清空里面的定时器
            this.scheduler.destroy();
            this.scheduler = null;
            this.signalerWs.destroy();
            this.signalerWs = null;
            this.peers = [];
            this.DCMap.clear();
            this.failedDCSet.clear();
            this.logger.warn('tracker stop p2p');
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.stopP2P();
            this.removeAllListeners();
            this.logger.warn('destroy tracker');
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
        key: '_tryConnectToAllPeers',
        value: function _tryConnectToAllPeers() {
            var _this4 = this;

            if (this.peers.length === 0) return;
            this.logger.info('try connect to ' + this.peers.length + ' peers');
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

            datachannel.on(_core.Events.DC_SIGNAL, function (data) {
                var remotePeerId = datachannel.remotePeerId;
                _this5.signalerWs.sendSignal(remotePeerId, data);
            }).once(_core.Events.DC_ERROR, function () {
                _this5.logger.warn('datachannel connect ' + datachannel.channelId + ' failed');
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

                _this5.logger.warn('datachannel ' + datachannel.channelId + ' closed');
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
                var cancel = _this5.scheduler.peersNum <= 3 ? false : true;
                _this5.requestMorePeers(cancel);

                //更新conns
                _this5.fetcher.increConns();
            });
        }
    }, {
        key: '_initSignalerWs',
        value: function _initSignalerWs() {
            var _this6 = this;

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
                        _this6.logger.debug('handle signal of ' + msg.from_peer_id);
                        if (!msg.data) {
                            //如果对等端已不在线
                            _this6.DCMap.delete(msg.from_peer_id);
                            _this6.failedDCSet.add(msg.from_peer_id); //记录失败的连接
                            _this6.logger.info('signaling ' + msg.from_peer_id + ' not found');
                        } else {
                            _this6._handleSignal(msg.from_peer_id, msg.data);
                        }
                        break;
                    case 'reject':
                        _this6.stopP2P();
                        break;
                    default:
                        _this6.logger.warn('Signaler websocket unknown action ' + action);

                }
            };
            websocket.onclose = function () {
                //websocket断开时清除datachannel
                _this6.connected = false;
            };
            return websocket;
        }
    }, {
        key: '_handleSignal',
        value: function _handleSignal(remotePeerId, data) {
            var datachannel = this.DCMap.get(remotePeerId);
            if (datachannel && datachannel.connected) {
                this.logger.info('datachannel had connected, signal ignored');
                return;
            }
            if (!datachannel) {
                //收到子节点连接请求
                this.logger.debug('receive node ' + remotePeerId + ' connection request');
                if (this.failedDCSet.has(remotePeerId)) return;
                datachannel = new _core.DataChannel(this.engine, this.peerId, remotePeerId, false, this.config);
                this.DCMap.set(remotePeerId, datachannel); //将对等端Id作为键
                this._setupDC(datachannel);
            }
            datachannel.receiveSignal(data);
        }

        // _setupScheduler(s) {
        //
        // }

    }, {
        key: '_requestMorePeers',
        value: function _requestMorePeers() {
            var _this7 = this;

            // 连接的节点<=3时请求更多节点
            if (this.scheduler.peersNum <= 3) {
                this.fetcher.btGetPeers().then(function (json) {
                    _this7.logger.info('request more peers ' + JSON.stringify(json));
                    _this7._handlePeers(json.peers);
                    _this7._tryConnectToAllPeers();
                });
            }
        }
    }, {
        key: 'currentPlaySN',
        set: function set(sn) {
            // console.warn(`currentPlaySN ${sn} ${performance.now()}`);
            if (!this.config.p2pEnabled) return;
            this.scheduler.updatePlaySN(sn);
        }
    }, {
        key: 'currentLoadingSN',
        set: function set(sn) {
            // console.warn(`currentLoadingSN ${sn} ${performance.now()}`);
            if (!this.config.p2pEnabled) return;
            this.scheduler.updateLoadingSN(sn);
        }
    }, {
        key: 'currentLoadedSN',
        set: function set(sn) {
            // console.warn(`currentLoadedSN ${sn} ${performance.now()}`);
            if (!this.config.p2pEnabled) return;
            this.scheduler.updateLoadedSN(sn); //更新bitmap
        }
    }]);

    return BTTracker;
}(_events2.default);

exports.default = BTTracker;
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
            var msg = {
                event: _core.Events.DC_HAVE,
                sn: sn
            };
            this._broadcastToPeers(msg);
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

        // 阻止其它peer的请求

    }, {
        key: 'chokePeerRequest',
        value: function chokePeerRequest(dc) {
            var msg = {
                event: _core.Events.DC_CHOKE
            };
            if (dc) {
                dc.sendJson(msg);
            } else {
                this._broadcastToPeers(msg);
            }
        }

        // 允许其它peer的请求

    }, {
        key: 'unchokePeerRequest',
        value: function unchokePeerRequest(dc) {
            var msg = {
                event: _core.Events.DC_UNCHOKE
            };
            if (dc) {
                dc.sendJson(msg);
            } else {
                this._broadcastToPeers(msg);
            }
        }

        // 暂停从其它peer请求数据

    }, {
        key: 'stopRequestFromPeers',
        value: function stopRequestFromPeers() {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.peerMap.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var peer = _step2.value;

                    peer.choked = true;
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

        // 恢复从其它peer请求数据

    }, {
        key: 'resumeRequestFromPeers',
        value: function resumeRequestFromPeers() {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.peerMap.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var peer = _step3.value;

                    peer.choked = false;
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
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this.peerMap.values()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var peer = _step4.value;

                    if (peer.isAvailable && peer.bitset.has(sn)) {
                        logger.info('found sn ' + sn + ' from peer ' + peer.remotePeerId);
                        this.targetPeer = peer;
                        return true;
                    }
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

            logger.warn('idle peers hasn\'t sn ' + sn);
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
        key: 'destroy',
        value: function destroy() {
            var logger = this.engine.logger;

            if (this.peersNum > 0) {
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = this.peerMap.values()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var peer = _step5.value;

                        peer.destroy();
                        peer = null;
                    }
                } catch (err) {
                    _didIteratorError5 = true;
                    _iteratorError5 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
                            _iterator5.return();
                        }
                    } finally {
                        if (_didIteratorError5) {
                            throw _iteratorError5;
                        }
                    }
                }

                this.peerMap.clear();
            }
            this.removeAllListeners();
            logger.warn('destroy scheduler');
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
            if (this.peersNum > 0) {
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = this.peerMap.values()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var peer = _step6.value;

                        peer.sendJson(msg);
                    }
                } catch (err) {
                    _didIteratorError6 = true;
                    _iteratorError6 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }
                    } finally {
                        if (_didIteratorError6) {
                            throw _iteratorError6;
                        }
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
            return this.peersNum > 0;
        }
    }, {
        key: 'peersNum',
        get: function get() {
            return this.peerMap.size;
        }
    }, {
        key: 'hasIdlePeers',
        get: function get() {
            var logger = this.engine.logger;

            var idles = this._getIdlePeer().length;
            logger.info('peers: ' + this.peersNum + ' idle peers: ' + idles);
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
/* 10 */
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
/* 11 */
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
        _this.logger = engine.logger;
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

            var wsOptions = {
                // debug: true,
                maxRetries: this.config.wsMaxRetries,
                minReconnectionDelay: this.config.wsReconnectInterval * 1000
            };
            var queryStr = '?id=' + id;
            var ws = new _reconnectingWebsocket2.default(this.config.wsSignalerAddr + queryStr, undefined, wsOptions);
            ws.onopen = function () {
                _this2.logger.info('Signaler websocket connection opened');

                _this2.connected = true;

                // 发送所有没有成功发送的消息
                if (_this2.msgQueue.length > 0) {
                    _this2.logger.warn('resend all cached msg');
                    _this2.msgQueue.forEach(function (msg) {
                        _this2._ws.send(msg);
                    });
                    _this2.msgQueue = [];
                }

                if (_this2.onopen) _this2.onopen();
            };

            ws.push = ws.send;
            ws.send = function (msg) {
                var msgStr = JSON.stringify(Object.assign({ peer_id: id }, msg));
                ws.push(msgStr);
            };
            ws.onmessage = function (e) {

                if (_this2.onmessage) _this2.onmessage(e);
            };
            ws.onclose = function () {
                //websocket断开时清除datachannel
                _this2.logger.warn('Signaler websocket closed');
                if (_this2.onclose) _this2.onclose();
                _this2.connected = false;
            };
            return ws;
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
            if (this.connected) {
                this._ws.send(msg);
            } else {
                this.logger.warn('signaler closed, msg is cached');
                this.msgQueue.push(msg);
            }
        }
    }, {
        key: 'close',
        value: function close() {
            this.logger.warn('close signal client');
            this.connected = false;
            this._ws.close(1000, 'stop signaling', { keepClosed: true });
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.close();
            this._ws = null;
            this.removeAllListeners();
            this.logger.warn('destroyt signaler');
        }
    }]);

    return SignalClient;
}(_events2.default);

exports.default = SignalClient;
module.exports = exports['default'];

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

var _urlToolkit = __webpack_require__(3);

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
            if (this.p2pEnabled && this.bufMgr.hasSegOfURL(frag.relurl)) {
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
            } else if (this.p2pEnabled && this.scheduler.hasAndSetTargetPeer(frag.sn)) {
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
/* 13 */
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
            // logger.debug(`_segPool add seg ${seg.relurl}`);
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
        key: 'destroy',
        value: function destroy() {
            this.clear();
            this.removeAllListeners();
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
/* 14 */
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
/* 15 */
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

/***/ })
/******/ ]);
});