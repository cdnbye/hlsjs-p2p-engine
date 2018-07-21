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
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
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
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(28)
var ieee754 = __webpack_require__(29)
var isArray = __webpack_require__(30)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

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
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
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

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
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
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
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
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

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
function defaultClearTimeout () {
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
} ())
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
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
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
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
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
    while(len) {
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

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


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

var pna = __webpack_require__(9);
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
var util = __webpack_require__(6);
util.inherits = __webpack_require__(4);
/*</replacement>*/

var Readable = __webpack_require__(12);
var Writable = __webpack_require__(15);

util.inherits(Duplex, Readable);

{
  // avoid scope creep, the keys array can then be collected
  var keys = objectKeys(Writable.prototype);
  for (var v = 0; v < keys.length; v++) {
    var method = keys[v];
    if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
  }
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

Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
});

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  pna.nextTick(onEndNT, this);
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

  pna.nextTick(cb, err);
};

/***/ }),
/* 6 */
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2).Buffer))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getBrowserRTC = exports.Buffer = exports.Fetcher = exports.Events = exports.DataChannel = undefined;

var _datachannel = __webpack_require__(26);

var _datachannel2 = _interopRequireDefault(_datachannel);

var _events = __webpack_require__(18);

var _events2 = _interopRequireDefault(_events);

var _fetcher = __webpack_require__(46);

var _fetcher2 = _interopRequireDefault(_fetcher);

var _getBrowserRtc = __webpack_require__(47);

var _getBrowserRtc2 = _interopRequireDefault(_getBrowserRtc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// export * from 'core';


var Buffer = __webpack_require__(2).Buffer;

exports.DataChannel = _datachannel2.default;
exports.Events = _events2.default;
exports.Fetcher = _fetcher2.default;
exports.Buffer = Buffer;
exports.getBrowserRTC = _getBrowserRtc2.default;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable node/no-deprecated-api */
var buffer = __webpack_require__(2);
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
/* WEBPACK VAR INJECTION */(function(process) {

if (!process.version || process.version.indexOf('v0.') === 0 || process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = { nextTick: nextTick };
} else {
  module.exports = process;
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handleTSUrl = handleTSUrl;
exports.throttle = throttle;
exports.defaultChannelId = defaultChannelId;

var _urlToolkit = __webpack_require__(19);

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

// 函数节流
function throttle(method, context) {
    var colddown = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 15;


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

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.config = exports.FragLoader = exports.Tracker = undefined;

var _btTracker = __webpack_require__(24);

var _btTracker2 = _interopRequireDefault(_btTracker);

var _btLoader = __webpack_require__(49);

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
/* 12 */
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

var pna = __webpack_require__(9);
/*</replacement>*/

module.exports = Readable;

/*<replacement>*/
var isArray = __webpack_require__(37);
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
var Stream = __webpack_require__(13);
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

/*<replacement>*/
var util = __webpack_require__(6);
util.inherits = __webpack_require__(4);
/*</replacement>*/

/*<replacement>*/
var debugUtil = __webpack_require__(38);
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function debug() {};
}
/*</replacement>*/

var BufferList = __webpack_require__(39);
var destroyImpl = __webpack_require__(14);
var StringDecoder;

util.inherits(Readable, Stream);

var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn);

  // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.
  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}

function ReadableState(options, stream) {
  Duplex = Duplex || __webpack_require__(5);

  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.
  var isDuplex = stream instanceof Duplex;

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var readableHwm = options.readableHighWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;

  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (readableHwm || readableHwm === 0)) this.highWaterMark = readableHwm;else this.highWaterMark = defaultHwm;

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
    if (!StringDecoder) StringDecoder = __webpack_require__(16).StringDecoder;
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
  if (!StringDecoder) StringDecoder = __webpack_require__(16).StringDecoder;
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
    if (state.sync) pna.nextTick(emitReadable_, stream);else emitReadable_(stream);
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
    pna.nextTick(maybeReadMore_, stream, state);
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
  if (state.endEmitted) pna.nextTick(endFn);else src.once('end', endFn);

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
        pna.nextTick(nReadingNextTick, this);
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
    pna.nextTick(resume_, stream, state);
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
  var _this = this;

  var state = this._readableState;
  var paused = false;

  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) _this.push(chunk);
    }

    _this.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = _this.push(chunk);
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
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
  }

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  this._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return this;
};

Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.highWaterMark;
  }
});

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
    pna.nextTick(endReadableNT, state, stream);
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

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(3)))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(0).EventEmitter;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*<replacement>*/

var pna = __webpack_require__(9);
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
      pna.nextTick(emitErrorNT, this, err);
    }
    return this;
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
      pna.nextTick(emitErrorNT, _this, err);
      if (_this._writableState) {
        _this._writableState.errorEmitted = true;
      }
    } else if (cb) {
      cb(err);
    }
  });

  return this;
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
/* 15 */
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

var pna = __webpack_require__(9);
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
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = __webpack_require__(6);
util.inherits = __webpack_require__(4);
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: __webpack_require__(43)
};
/*</replacement>*/

/*<replacement>*/
var Stream = __webpack_require__(13);
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

var destroyImpl = __webpack_require__(14);

util.inherits(Writable, Stream);

function nop() {}

function WritableState(options, stream) {
  Duplex = Duplex || __webpack_require__(5);

  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.
  var isDuplex = stream instanceof Duplex;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var writableHwm = options.writableHighWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;

  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (writableHwm || writableHwm === 0)) this.highWaterMark = writableHwm;else this.highWaterMark = defaultHwm;

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
      if (this !== Writable) return false;

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
  pna.nextTick(cb, er);
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
    pna.nextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;
  var isBuf = !state.objectMode && _isUint8Array(chunk);

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

Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
});

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
    pna.nextTick(cb, er);
    // this can emit finish, and it will always happen
    // after error
    pna.nextTick(finishMaybe, stream, state);
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
    state.bufferedRequestCount = 0;
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      state.bufferedRequestCount--;
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
      pna.nextTick(callFinal, stream, state);
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
    if (state.finished) pna.nextTick(cb);else stream.once('finish', cb);
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(41).setImmediate, __webpack_require__(1)))

/***/ }),
/* 16 */
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



/*<replacement>*/

var Buffer = __webpack_require__(44).Buffer;
/*</replacement>*/

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
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
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
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
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
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd';
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

// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd';
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
/* 17 */
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
var util = __webpack_require__(6);
util.inherits = __webpack_require__(4);
/*</replacement>*/

util.inherits(Transform, Duplex);

function afterTransform(er, data) {
  var ts = this._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) {
    return this.emit('error', new Error('write callback called multiple times'));
  }

  ts.writechunk = null;
  ts.writecb = null;

  if (data != null) // single equals check for both `null` and `undefined`
    this.push(data);

  cb(er);

  var rs = this._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    this._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = {
    afterTransform: afterTransform.bind(this),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    writeencoding: null
  };

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
  this.on('prefinish', prefinish);
}

function prefinish() {
  var _this = this;

  if (typeof this._flush === 'function') {
    this._flush(function (er, data) {
      done(_this, er, data);
    });
  } else {
    done(this, null, null);
  }
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
  var _this2 = this;

  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
    _this2.emit('close');
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  if (data != null) // single equals check for both `null` and `undefined`
    stream.push(data);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  if (stream._writableState.length) throw new Error('Calling transform done when ws.length != 0');

  if (stream._transformState.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by xieting on 2018/4/3.
 */

exports.default = {
    //data-channel
    DC_PING: 'PING',
    DC_PONG: 'PONG',
    DC_SIGNAL: 'SIGNAL',
    DC_OPEN: 'OPEN',
    DC_REQUEST: 'REQUEST',
    DC_PIECE_NOT_FOUND: 'PIECE_NOT_FOUND', //当请求的数据找不到时触发
    DC_CLOSE: 'CLOSE',
    DC_RESPONSE: 'RESPONSE',
    DC_ERROR: 'ERROR',
    DC_PIECE: "PIECE",
    DC_TIMEOUT: "TIMEOUT",
    DC_PIECE_ACK: "PIECE_ACK",
    //---------------------------vod---------------------------------------------------------
    DC_BITFIELD: "BITFIELD",
    DC_CHOKE: "CHOKE",
    DC_UNCHOKE: "UNCHOKE",
    DC_INTERESTED: "INTERESTED",
    DC_NOTINTERESTED: "NOT_INTERESTED",
    DC_HAVE: "HAVE",
    DC_LOST: "LOST",
    //buffer-manager
    BM_LOST: 'lost'
};
module.exports = exports['default'];

/***/ }),
/* 19 */
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
/* 20 */
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
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = __webpack_require__(22);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Hlsjs;
if (false) {
    Hlsjs = require('hls.js/dist/hls.light');
} else {
    Hlsjs = __webpack_require__(53);
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
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(0);

var _events2 = _interopRequireDefault(_events);

var _config = __webpack_require__(23);

var _config2 = _interopRequireDefault(_config);

var _bittorrent = __webpack_require__(11);

var _bufferManager = __webpack_require__(50);

var _bufferManager2 = _interopRequireDefault(_bufferManager);

var _core = __webpack_require__(7);

var _logger = __webpack_require__(51);

var _logger2 = _interopRequireDefault(_logger);

var _platform = __webpack_require__(52);

var _platform2 = _interopRequireDefault(_platform);

var _toolFuns = __webpack_require__(10);

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

            hlsjs.off(hlsjs.constructor.Events.LEVEL_LOADED, onLevelLoaded);
        };

        hlsjs.on(hlsjs.constructor.Events.LEVEL_LOADED, onLevelLoaded);

        // 免费版需要打印版本信息
        if (_this.config.key === 'free') {
            console.log('CDNBye v' + P2PEngine.version + ' -- A Free and Infinitely Scalable Video P2P Engine. (https://github.com/cdnbye/hlsjs-p2p-engine)');
        }
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
            var fetcher = new _core.Fetcher(this, this.config.key, window.encodeURIComponent(channel), this.config.announce, browserInfo);
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
                logger.debug('loading frag ' + data.frag.sn);
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
            });

            this.hlsjs.on(this.hlsjs.constructor.Events.FRAG_CHANGED, function (id, data) {
                // log('FRAG_CHANGED: '+JSON.stringify(data.frag, null, 2));
                logger.debug('frag changed: ' + data.frag.sn);
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

P2PEngine.version = "0.1.7";

exports.default = P2PEngine;
module.exports = exports['default'];

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _bittorrent = __webpack_require__(11);

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

    packetSize: 64 * 1024, //每次通过datachannel发送的包的大小
    maxBufSize: 1024 * 1024 * 50, //p2p缓存的最大数据量
    loadTimeout: 3, //p2p下载的超时时间
    tsStrictMatched: false, //p2p传输的ts是否要严格匹配（去掉查询参数），默认false

    enableLogUpload: false, //上传log到服务器，默认false
    logUploadAddr: "wss://api.cdnbye.com/trace", //log上传地址
    logUploadLevel: 'warn', //log上传level，分为debug、info、warn、error、none，默认warn
    logLevel: 'none', //log的level，分为debug、info、warn、error、none，设为true等于debug，设为false等于none，默认none

    tag: '', //用户自定义标签，可用于在后台查看参数调整效果

    channelId: null }, _bittorrent.config);

exports.default = defaultP2PConfig;
module.exports = exports['default'];

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(0);

var _events2 = _interopRequireDefault(_events);

var _btScheduler = __webpack_require__(25);

var _btScheduler2 = _interopRequireDefault(_btScheduler);

var _signalClient = __webpack_require__(48);

var _signalClient2 = _interopRequireDefault(_signalClient);

var _core = __webpack_require__(7);

var _toolFuns = __webpack_require__(10);

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
                _this2.peerId = json.peer_id;
                logger.identifier = _this2.peerId;
                _this2.fetcher.btHeartbeat(json.heartbeat_interval);
                _this2.fetcher.btStatsStart(json.report_limit);
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
            logger.info('try connect to Peer ' + remotePeerId);
            var datachannel = new _core.DataChannel(this.engine, this.peerId, remotePeerId, true, this.config);
            this.DCMap.set(remotePeerId, datachannel); //将对等端Id作为键
            this._setupDC(datachannel);
        }
    }, {
        key: '_setupDC',
        value: function _setupDC(datachannel) {
            var _this4 = this;

            var logger = this.engine.logger;

            datachannel.on(_core.Events.DC_SIGNAL, function (data) {
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
            }).once(_core.Events.DC_ERROR, function () {
                logger.warn('datachannel connect ' + datachannel.channelId + ' failed');
                _this4.scheduler.deletePeer(datachannel);
                _this4.DCMap.delete(datachannel.remotePeerId);
                _this4.failedDCSet.add(datachannel.remotePeerId); //记录失败的连接
                _this4._tryConnectToPeer();
                datachannel.destroy();

                _this4.requestMorePeers();

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
            }).once(_core.Events.DC_CLOSE, function () {

                logger.warn('datachannel ' + datachannel.channelId + ' closed');
                _this4.scheduler.deletePeer(datachannel);
                _this4.DCMap.delete(datachannel.remotePeerId);
                _this4.failedDCSet.add(datachannel.remotePeerId); //记录断开的连接
                _this4._tryConnectToPeer();

                datachannel.destroy();

                _this4.requestMorePeers();

                //更新conns
                _this4.fetcher.decreConns();
            }).once(_core.Events.DC_OPEN, function () {

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
                    logger.info('request more peers ' + JSON.stringify(json));
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
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(0);

var _events2 = _interopRequireDefault(_events);

var _core = __webpack_require__(7);

var _toolFuns = __webpack_require__(10);

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
        key: 'load',
        value: function load(context, config, callbacks) {
            var logger = this.engine.logger;

            this.context = context;
            var frag = context.frag;
            var handledUrl = (0, _toolFuns.handleTSUrl)(frag.relurl, this.config.tsStrictMatched);
            this.callbacks = callbacks;
            this.stats = { trequest: performance.now(), retry: 0, tfirst: 0, tload: 0, loaded: 0 };
            this.criticalSeg = { sn: frag.sn, relurl: handledUrl };

            var target = void 0;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.peerMap.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var peer = _step2.value;

                    if (peer.bitset.has(frag.sn)) {
                        target = peer;
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

            if (target) {
                // target.requestDataBySN(frag.sn, true);
                target.requestDataByURL(handledUrl, true); //critical的根据url请求
                logger.info('request criticalSeg url ' + frag.relurl + ' at ' + frag.sn);
            }
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
                    _this3.criticaltimeouter = null;
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
                    _this3.callbacks.onSuccess(response, stats, _this3.context);
                } else {
                    _this3.bufMgr.addBuffer(response.sn, response.url, response.data);
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
                window.clearTimeout(_this3.criticaltimeouter); //清除定时器
                _this3.criticaltimeouter = null;
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

            logger.warn('critical request timeout');
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

function handleUrl(url) {
    // return url;
    return url.split("?")[0];
}

exports.default = BTScheduler;
module.exports = exports['default'];

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _simpleChannel = __webpack_require__(27);

var _simpleChannel2 = _interopRequireDefault(_simpleChannel);

var _events = __webpack_require__(0);

var _events2 = _interopRequireDefault(_events);

var _events3 = __webpack_require__(18);

var _events4 = _interopRequireDefault(_events3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by xieting on 2018/4/2.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

// import SimpleChannel from 'simple-peer';


var Buffer = __webpack_require__(2).Buffer;

var DataChannel = function (_EventEmitter) {
    _inherits(DataChannel, _EventEmitter);

    _createClass(DataChannel, null, [{
        key: 'VERSION',
        get: function get() {
            return 'v1';
        }
    }]);

    function DataChannel(engine, peerId, remotePeerId, isInitiator, config) {
        _classCallCheck(this, DataChannel);

        var _this = _possibleConstructorReturn(this, (DataChannel.__proto__ || Object.getPrototypeOf(DataChannel)).call(this));

        _this.engine = engine;
        _this.config = config;
        _this.remotePeerId = remotePeerId;
        _this.channelId = isInitiator ? peerId + '-' + remotePeerId : remotePeerId + '-' + peerId; //标识该channel
        // console.warn(`this.channelId ${this.channelId}`);
        _this.connected = false;
        _this.msgQueue = [];
        _this.miss = 0; //超时或者错误的次数

        //下载控制
        _this.rcvdReqQueue = []; //接收到的请求的队列    队列末尾优先级最高 sn
        _this.downloading = false;
        _this.uploading = false;

        //延迟计算
        _this.delays = [];

        _this._datachannel = new _simpleChannel2.default({ initiator: isInitiator, objectMode: true });
        _this.isInitiator = isInitiator; //是否主动发起连接的
        _this._init(_this._datachannel);

        _this.streamingRate = 0; //单位bit/s
        //记录发送的数据量，用于计算streaming rate
        _this.recordSended = _this._adjustStreamingRate(10);

        return _this;
    }

    _createClass(DataChannel, [{
        key: '_init',
        value: function _init(datachannel) {
            var _this2 = this;

            var logger = this.engine.logger;

            datachannel.on('error', function (err) {
                // logger.warn('datachannel error', err);
                _this2.emit(_events4.default.DC_ERROR);
            });

            datachannel.on('signal', function (data) {
                _this2.emit(_events4.default.DC_SIGNAL, data);
            });

            var _onConnect = function _onConnect() {

                logger.info('datachannel CONNECTED to ' + _this2.remotePeerId);
                _this2.connected = true;
                _this2.emit(_events4.default.DC_OPEN);
                //测试延迟
                _this2._sendPing();
                //发送消息队列中的消息
                while (_this2.msgQueue.length > 0) {
                    var msg = _this2.msgQueue.shift();
                    _this2.emit(msg.event, msg);
                }
            };

            datachannel.once('connect', _onConnect);

            datachannel.on('data', function (data) {
                if (typeof data === 'string') {
                    // logger.debug('datachannel receive string: ' + data + 'from ' + this.remotePeerId);

                    var msg = JSON.parse(data);
                    //如果还没连接，则先保存在消息队列中
                    if (!_this2.connected) {
                        _this2.msgQueue.push(msg);
                        // _onConnect();
                        return;
                    }
                    var event = msg.event;
                    switch (event) {
                        case _events4.default.DC_PONG:
                            _this2._handlePongMsg();
                            break;
                        case _events4.default.DC_PING:
                            _this2.sendJson({
                                event: _events4.default.DC_PONG
                            });
                            break;
                        case _events4.default.DC_PIECE:
                            _this2._prepareForBinary(msg.attachments, msg.url, msg.sn, msg.size);
                            _this2.emit(msg.event, msg);
                            break;
                        case _events4.default.DC_PIECE_NOT_FOUND:
                            window.clearTimeout(_this2.requestTimeout); //清除定时器
                            _this2.requestTimeout = null;
                            _this2.emit(msg.event, msg);
                            break;
                        case _events4.default.DC_REQUEST:
                            _this2._handleRequestMsg(msg);
                            break;
                        case _events4.default.DC_PIECE_ACK:
                            _this2._handlePieceAck();
                            _this2.emit(msg.event, msg);
                            break;
                        default:
                            _this2.emit(msg.event, msg);

                    }
                } else {
                    //binary data
                    // console.warn(`datachannel receive binary data size ${data.byteLength}`);
                    _this2.bufArr.push(data);
                    _this2.remainAttachments--;
                    if (_this2.remainAttachments === 0) {
                        window.clearTimeout(_this2.requestTimeout); //清除定时器
                        _this2.requestTimeout = null;
                        _this2.sendJson({ //发送给peer确认信息
                            event: _events4.default.DC_PIECE_ACK,
                            sn: _this2.bufSN,
                            url: _this2.bufUrl,
                            size: _this2.expectedSize
                        });
                        _this2._handleBinaryData();
                    }
                }
            });

            datachannel.once('close', function () {
                _this2.emit(_events4.default.DC_CLOSE);
            });
        }
    }, {
        key: 'sendJson',
        value: function sendJson(json) {
            this.send(JSON.stringify(json));
        }
    }, {
        key: 'send',
        value: function send(data) {
            if (this._datachannel && this._datachannel.connected) {
                this._datachannel.send(data);
            }
        }
    }, {
        key: 'sendBitField',
        value: function sendBitField(field) {
            this.sendJson({ //向peer发送bitfield
                event: _events4.default.DC_BITFIELD,
                field: field
            });
        }
    }, {
        key: 'sendBuffer',
        value: function sendBuffer(sn, url, payload) {
            this.uploading = true;
            //开始计时
            this.uploadTimeout = window.setTimeout(this._uploadtimeout.bind(this), this.config.dcUploadTimeout * 1000);

            var dataSize = payload.byteLength,
                //二进制数据大小
            packetSize = this.config.packetSize,
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
                event: _events4.default.DC_PIECE,
                attachments: attachments,
                url: url,
                sn: sn,
                size: dataSize
            };
            this.sendJson(response);
            var bufArr = dividePayload(payload, packetSize, attachments, remainder);
            for (var j = 0; j < bufArr.length; j++) {
                this.send(bufArr[j]);
            }
            //记录streaming rate
            this.recordSended(dataSize);
        }
    }, {
        key: 'requestDataByURL',
        value: function requestDataByURL(relurl) {
            var urgent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            //由于需要阻塞下载数据，因此request请求用新的API
            var msg = {
                event: _events4.default.DC_REQUEST,
                url: relurl,
                urgent: urgent
            };
            this.downloading = true;
            this.sendJson(msg);
            //urgent请求才计时
            if (urgent) {
                this.requestTimeout = window.setTimeout(this._loadtimeout.bind(this), this.config.dcRequestTimeout * 1000);
            }
        }
    }, {
        key: 'requestDataBySN',
        value: function requestDataBySN(sn) {
            var urgent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            //用于BT算法
            var msg = {
                event: _events4.default.DC_REQUEST,
                sn: sn, //ts数据的播放序号
                urgent: urgent //是否紧急
            };
            this.downloading = true;
            this.sendJson(msg);
            //urgent请求才计时
            if (urgent) {
                this.requestTimeout = window.setTimeout(this._loadtimeout.bind(this), this.config.dcRequestTimeout * 1000);
            }
        }
    }, {
        key: 'close',
        value: function close() {
            this.destroy();
        }
    }, {
        key: 'receiveSignal',
        value: function receiveSignal(data) {
            this._datachannel.signal(data);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            // window.clearInterval(this.keepAliveInterval);
            // this.keepAliveInterval = null;
            // window.clearTimeout(this.keepAliveAckTimeout);
            // this.keepAliveAckTimeout = null;
            window.clearInterval(this.adjustSRInterval);
            window.clearInterval(this.pinger);
            this._datachannel.removeAllListeners();
            this.removeAllListeners();
            this._datachannel.destroy();
        }
    }, {
        key: '_handleRequestMsg',
        value: function _handleRequestMsg(msg) {
            if (this.rcvdReqQueue.length > 0) {
                if (msg.urgent) {
                    this.rcvdReqQueue.push(msg.sn); //urgent的放在队列末尾
                } else {
                    this.rcvdReqQueue.unshift(msg.sn);
                }
            } else {
                this.emit(_events4.default.DC_REQUEST, msg);
            }
        }
    }, {
        key: '_handlePieceAck',
        value: function _handlePieceAck() {
            this.uploading = false;
            window.clearTimeout(this.uploadTimeout);
            this.uploadTimeout = null;
            if (this.rcvdReqQueue.length > 0) {
                var sn = this.rcvdReqQueue.pop();
                this.emit(_events4.default.DC_REQUEST, { sn: sn });
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
        key: '_handleBinaryData',
        value: function _handleBinaryData() {
            var payload = Buffer.concat(this.bufArr);
            if (payload.byteLength == this.expectedSize) {
                //校验数据
                this.emit(_events4.default.DC_RESPONSE, { url: this.bufUrl, sn: this.bufSN, data: payload });
            }
            this.bufUrl = '';
            this.bufArr = [];
            this.expectedSize = -1;

            this.downloading = false;
        }
    }, {
        key: '_adjustStreamingRate',
        value: function _adjustStreamingRate(interval) {
            var _this3 = this;

            //每隔一段时间计算streaming rate，单位bit/s
            var sended = 0;
            this.adjustSRInterval = window.setInterval(function () {
                _this3.streamingRate = Math.round(sended * 8 / interval);
                sended = 0;
                // console.warn(`streamingRate ${this.streamingRate/8/1024}KB/s`);
            }, interval * 1000);
            return function (increment) {
                sended += increment;
            };
        }
    }, {
        key: '_loadtimeout',
        value: function _loadtimeout() {
            //下载超时
            var logger = this.engine.logger;

            logger.warn('datachannel timeout while downloading from ' + this.remotePeerId);
            this.emit(_events4.default.DC_TIMEOUT);
            this.requestTimeout = null;
            this.downloading = false;
            this.miss++;
            if (this.miss >= this.config.dcTolerance) {
                var msg = {
                    event: _events4.default.DC_CLOSE
                };
                this.sendJson(msg);
                logger.warn('datachannel download miss reach dcTolerance, close ' + this.remotePeerId);
                this.emit(_events4.default.DC_ERROR);
            }
        }
    }, {
        key: '_uploadtimeout',
        value: function _uploadtimeout() {
            //上传超时
            var logger = this.engine.logger;

            logger.warn('datachannel timeout while uploading to ' + this.remotePeerId);
            this.uploading = false;
            // if (this.rcvdReqQueue.length > 0) {
            //     let sn = this.rcvdReqQueue.pop();
            //     this.emit(Events.DC_REQUEST, {sn})
            // }
            this.rcvdReqQueue = []; //清空请求队列
        }
    }, {
        key: '_sendPing',
        value: function _sendPing() {
            var _this4 = this;

            this.ping = performance.now();
            for (var i = 0; i < this.config.dcPings; i++) {
                this.sendJson({
                    event: _events4.default.DC_PING
                });
            }
            window.setTimeout(function () {
                if (_this4.delays.length > 0) {
                    var sum = 0;
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = _this4.delays[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var delay = _step.value;

                            sum += delay;
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

                    _this4.delay = sum / _this4.delays.length;
                    _this4.delays = [];
                }
            }, 100);
        }
    }, {
        key: '_handlePongMsg',
        value: function _handlePongMsg() {
            var delay = performance.now() - this.ping;
            this.delays.push(delay);
        }
    }, {
        key: 'setupStats',
        value: function setupStats() {
            var _this5 = this;

            var logger = this.engine.logger;

            setInterval(function () {

                _this5._datachannel.getStats(function (err, reports) {
                    logger.warn('reports: ' + JSON.stringify(reports, null, 1));
                });
            }, 10000);
        }
    }]);

    return DataChannel;
}(_events2.default);

function dividePayload(payload, packetSize, attachments, remainder) {
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

exports.default = DataChannel;
module.exports = exports['default'];

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = Peer;

var debug = __webpack_require__(31)('simple-channel');
var getBrowserRTC = __webpack_require__(34);
var inherits = __webpack_require__(4);
var randombytes = __webpack_require__(35);
var stream = __webpack_require__(36);

var MAX_BUFFERED_AMOUNT = 64 * 1024;

inherits(Peer, stream.Duplex);

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
        if (self._pc.remoteDescription && self._pc.remoteDescription.type) self._addIceCandidate(data.candidate);else self._pendingCandidates.push(data.candidate);
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
            self.destroy(err);
        });
    }
    if (!data.sdp && !data.candidate) {
        self.destroy(new Error('signal() called with invalid signal data'));
    }
};

Peer.prototype._addIceCandidate = function (candidate) {
    var self = this;
    try {
        self._pc.addIceCandidate(new self._wrtc.RTCIceCandidate(candidate), noop, function (err) {
            self.destroy(err);
        });
    } catch (err) {
        self.destroy(new Error('error adding candidate: ' + err.message));
    }
};

/**
 * Send text/binary data to the remote peer.
 * @param {TypedArrayView|ArrayBuffer|Buffer|string|Blob|Object} chunk
 */
Peer.prototype.send = function (chunk) {
    var self = this;
    self._channel.send(chunk);
};

// TODO: Delete this method once readable-stream is updated to contain a default
// implementation of destroy() that automatically calls _destroy()
// See: https://github.com/nodejs/readable-stream/issues/283
Peer.prototype.destroy = function (err) {
    var self = this;
    self._destroy(err, function () {});
};

Peer.prototype._destroy = function (err, cb) {
    var self = this;
    if (self.destroyed) return;

    self._debug('destroy (error: %s)', err && (err.message || err));

    self.readable = self.writable = false;

    if (!self._readableState.ended) self.push(null);
    if (!self._writableState.finished) self.end();

    self.destroyed = true;
    self.connected = false;
    self._pcReady = false;
    self._channelReady = false;
    self._previousStreams = null;

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
    cb();
};

Peer.prototype._setupData = function (event) {
    var self = this;
    if (!event.channel) {
        // In some situations `pc.createDataChannel()` returns `undefined` (in wrtc),
        // which is invalid behavior. Handle it gracefully.
        // See: https://github.com/feross/simple-peer/issues/163
        return self.destroy(new Error('Data channel event is missing `channel` property'));
    }

    self._channel = event.channel;
    self._channel.binaryType = 'arraybuffer';

    if (typeof self._channel.bufferedAmountLowThreshold === 'number') {
        self._channel.bufferedAmountLowThreshold = MAX_BUFFERED_AMOUNT;
    }

    self.channelName = self._channel.label;

    self._channel.onmessage = function (event) {
        self._onChannelMessage(event);
    };
    self._channel.onbufferedamountlow = function () {
        self._onChannelBufferedAmountLow();
    };
    self._channel.onopen = function () {
        self._onChannelOpen();
    };
    self._channel.onclose = function () {
        self._onChannelClose();
    };
    self._channel.onerror = function (err) {
        self.destroy(err);
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
            return self.destroy(err);
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
            self.destroy();
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
            self.destroy(err);
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
        self.destroy(err);
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
            self.destroy(err);
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
        self.destroy(err);
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
                self.destroy();
            }, self.reconnectTimer);
        } else {
            self.destroy();
        }
    }
    if (iceConnectionState === 'failed') {
        self.destroy(new Error('Ice connection failed.'));
    }
    if (iceConnectionState === 'closed') {
        self.destroy();
    }
};

Peer.prototype.getStats = function (cb) {
    var self = this;

    // Promise-based getStats() (standard)
    if (self._pc.getStats.length === 0) {
        self._pc.getStats().then(function (res) {
            var reports = [];
            res.forEach(function (report) {
                // console.warn(`[getStats] ${JSON.stringify(report, null, 1)}`)
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

            // Ignore candidate pair selection in browsers like Safari 11 that do not have any local or remote candidates
            // But wait until at least 1 candidate pair is available
            if (!foundSelectedCandidatePair && (!Object.keys(candidatePairs).length || Object.keys(localCandidates).length)) {
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
                    return self.destroy(err);
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
        });
    }
    findCandidatePair();
};

Peer.prototype._onInterval = function () {
    var self = this;
    if (!self._cb || !self._channel || self._channel.bufferedAmount > MAX_BUFFERED_AMOUNT) {
        return;
    }
    self._onChannelBufferedAmountLow();
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
    self.destroy();
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2).Buffer))

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = ((uint8[i] << 16) & 0xFF0000) + ((uint8[i + 1] << 8) & 0xFF00) + (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 29 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 30 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(32);
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 32 */
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
exports.humanize = __webpack_require__(33);

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
/* 33 */
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
/* 34 */
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
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {

function oldBrowser() {
  throw new Error('Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11');
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(3)))

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports = module.exports = __webpack_require__(12);
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = __webpack_require__(15);
exports.Duplex = __webpack_require__(5);
exports.Transform = __webpack_require__(17);
exports.PassThrough = __webpack_require__(45);

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

/***/ }),
/* 38 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Buffer = __webpack_require__(8).Buffer;
var util = __webpack_require__(40);

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

if (util && util.inspect && util.inspect.custom) {
  module.exports.prototype[util.inspect.custom] = function () {
    var obj = util.inspect({ length: this.length });
    return this.constructor.name + ' ' + obj;
  };
}

/***/ }),
/* 40 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(42);
// On some exotic environments, it's not clear which object `setimmeidate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
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
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
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
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
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
        registerImmediate = function(handle) {
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
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(3)))

/***/ }),
/* 43 */
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable node/no-deprecated-api */
var buffer = __webpack_require__(2)
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}


/***/ }),
/* 45 */
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

var Transform = __webpack_require__(17);

/*<replacement>*/
var util = __webpack_require__(6);
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
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by xieting on 2018/4/3.
 */

var Fetcher = function () {
    function Fetcher(engine, key, room, baseUrl, info) {
        _classCallCheck(this, Fetcher);

        this.engine = engine;
        //-----------bt---------------------
        var queryStr = '?key=' + window.encodeURIComponent(key) + '&info_hash=' + room;
        this.announceURL = baseUrl + '/announce/' + queryStr + makeQueryStr(info);
        this.heartbeatURL = baseUrl + '/heartbeat/' + queryStr;
        this.getPeersURL = baseUrl + '/get_peers/' + queryStr;
        this.statsURL = baseUrl + '/stats/' + queryStr;

        //上报参数
        this.limit = 10 * 1024; //上报流量的阈值（单位：KB）

        //连接情况上报
        this.conns = 0; //连接的peer的增量
        this.failConns = 0; //连接失败的peer的增量

        //流量上报(单位：KB)
        this.totalHTTPDownloaded = 0; // HTTP累积量
        this.totalP2PDownloaded = 0; // P2P下载累积量
        this.totalP2PUploaded = 0; // P2P上传累积量
        this.httpDownloaded = 0;
        this.p2pDownloaded = 0;

        //播放情况上报
        this.errsFragLoad = 0; //数据下载错误数（包括错误和超时）
        this.errsBufStalled = 0; //播放卡顿数
        this.errsInternalExpt = 0; //插件内部错误
    }

    _createClass(Fetcher, [{
        key: 'btAnnounce',
        value: function btAnnounce() {
            var _this = this;

            var logger = this.engine.logger;

            return new Promise(function (resolve, reject) {
                fetch(_this.announceURL).then(function (response) {
                    return response.json();
                }).then(function (json) {
                    if (json.ret && json.ret === -1) {
                        reject(json.msg);
                    } else {
                        _this.peerId = json.peer_id; //保存peerId
                        resolve(json);
                    }
                }).catch(function (err) {
                    logger.error('btAnnounce error ' + err);
                    reject(err);
                });
            });
        }
    }, {
        key: 'btHeartbeat',
        value: function btHeartbeat() {
            var _this2 = this;

            var interval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
            var logger = this.engine.logger;

            this.heartbeater = window.setInterval(function () {
                fetch(_this2.heartbeatURL + ('&peer_id=' + _this2.peerId)).then(function (response) {}).catch(function (err) {
                    window.clearInterval(_this2.heartbeater);
                    logger.error('btHeartbeat error ' + err);
                });
            }, interval * 1000);
        }
    }, {
        key: 'btGetPeers',
        value: function btGetPeers() {
            var _this3 = this;

            var logger = this.engine.logger;

            return new Promise(function (resolve, reject) {
                fetch(_this3.getPeersURL + ('&peer_id=' + _this3.peerId)).then(function (response) {
                    return response.json();
                }).then(function (json) {
                    resolve(json);
                }).catch(function (err) {
                    logger.error('btGetPeers error ' + err);
                    reject(err);
                });
            });
        }
    }, {
        key: 'increConns',
        value: function increConns() {
            //主动连接的负责报告(增量)
            this.conns++;
        }
    }, {
        key: 'decreConns',
        value: function decreConns() {
            this.conns--;
        }
    }, {
        key: 'increFailConns',
        value: function increFailConns() {
            this.failConns++;
        }
    }, {
        key: 'btStatsStart',
        value: function btStatsStart(limit) {
            this.limit = limit * 1024; //MB转KB
        }
    }, {
        key: 'reportFlow',
        value: function reportFlow(stats) {
            var p2p = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            var flow = Math.round(stats.total / 1024);
            if (p2p) {
                this.p2pDownloaded += flow;
                this.totalP2PDownloaded += flow;
            } else {
                this.httpDownloaded += flow;
                this.totalHTTPDownloaded += flow;
            }
            this._emitStats();
            this._checkFlowLimit();
            // log(`cdnDownloaded ${this.cdnDownloaded} p2pDownloaded ${this.p2pDownloaded}`)
        }

        // 上报上传的数据量

    }, {
        key: 'reportUploaded',
        value: function reportUploaded() {
            var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            this.totalP2PUploaded += Math.round(size / 1024);
            this._emitStats();
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            window.clearInterval(this.heartbeater);
        }
    }, {
        key: '_emitStats',
        value: function _emitStats() {
            this.engine.emit('stats', {
                totalHTTPDownloaded: this.totalHTTPDownloaded,
                totalP2PDownloaded: this.totalP2PDownloaded,
                totalP2PUploaded: this.totalP2PUploaded
            });
        }
    }, {
        key: '_checkFlowLimit',
        value: function _checkFlowLimit() {
            var _this4 = this;

            //检查是否需要上报流量
            var logger = this.engine.logger;

            if (this.p2pDownloaded >= this.limit || this.httpDownloaded >= this.limit) {
                //只有流量达到阈值才上报(单位：KB)
                var body = {
                    source: Math.round(this.httpDownloaded), //上报以KB为单位
                    p2p: Math.round(this.p2pDownloaded)
                };
                if (this.conns !== 0) {
                    body.conns = this.conns;
                }
                if (this.failConns > 0) {
                    body.failConns = this.failConns;
                }
                if (this.errsFragLoad > 0) {
                    body.errsFragLoad = this.errsFragLoad;
                }
                if (this.errsBufStalled > 0) {
                    body.errsBufStalled = this.errsBufStalled;
                }
                if (this.errsInternalExpt > 0) {
                    body.errsInternalExpt = this.errsInternalExpt;
                }
                logger.info('reporting traffic p2p ' + this.p2pDownloaded + ' http ' + this.httpDownloaded);
                fetch(this.statsURL + ('&peer_id=' + this.peerId), {
                    method: 'POST', // 指定是POST请求
                    body: JSON.stringify(body)
                }).then(function (response) {
                    if (response.ok) {
                        logger.info('sucessfully report traffic');
                        _this4.httpDownloaded = 0;
                        _this4.p2pDownloaded = 0;
                        _this4.conns = 0;
                        _this4.failConns = 0;
                        _this4.errsFragLoad = 0;
                        _this4.errsBufStalled = 0;
                        _this4.errsInternalExpt = 0;
                    }
                }).catch(function (err) {
                    logger.error('stats upload error ' + err);
                });
            }
        }
    }]);

    return Fetcher;
}();

function makeQueryStr(obj) {
    var str = "&";
    for (var prop in obj) {
        str += prop + '=' + obj[prop] + '&';
    }
    return str;
}

exports.default = Fetcher;
module.exports = exports['default'];

/***/ }),
/* 47 */
/***/ (function(module, exports) {

// originally pulled out of simple-peer

module.exports = function getBrowserRTC () {
  if (typeof window === 'undefined') return null
  var wrtc = {
    RTCPeerConnection: window.RTCPeerConnection || window.mozRTCPeerConnection ||
      window.webkitRTCPeerConnection,
    RTCSessionDescription: window.RTCSessionDescription ||
      window.mozRTCSessionDescription || window.webkitRTCSessionDescription,
    RTCIceCandidate: window.RTCIceCandidate || window.mozRTCIceCandidate ||
      window.webkitRTCIceCandidate
  }
  if (!wrtc.RTCPeerConnection) return null
  return wrtc
}


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(0);

var _events2 = _interopRequireDefault(_events);

var _reconnectingWebsocket = __webpack_require__(20);

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
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(0);

var _events2 = _interopRequireDefault(_events);

var _urlToolkit = __webpack_require__(19);

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
                logger.debug('P2P load ' + frag.relurl + ' at ' + frag.sn);
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
                    logger.debug('HTTP load ' + frag.relurl + ' at ' + frag.sn);
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
                    logger.debug('P2P load ' + frag.relurl + ' at ' + frag.sn);
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
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(0);

var _events2 = _interopRequireDefault(_events);

var _core = __webpack_require__(7);

var _toolFuns = __webpack_require__(10);

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
            var handledUrl = (0, _toolFuns.handleTSUrl)(url, this.config.tsStrictMatched);
            var payloadBuf = _core.Buffer.from(data);
            var byteLength = payloadBuf.byteLength;
            var targetBuffer = new _core.Buffer(byteLength);
            payloadBuf.copy(targetBuffer);

            var segment = {
                sn: sn,
                relurl: handledUrl,
                data: targetBuffer,
                size: byteLength
            };

            this.addSeg(segment);
            this.sn2Url.set(sn, handledUrl);
        }
    }, {
        key: 'addBuffer',
        value: function addBuffer(sn, url, buf) {
            //直接缓存
            var handledUrl = (0, _toolFuns.handleTSUrl)(url, this.config.tsStrictMatched);
            var segment = {
                sn: sn,
                relurl: handledUrl,
                data: buf,
                size: buf.byteLength
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
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reconnectingWebsocket = __webpack_require__(20);

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
/* 52 */
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
/* 53 */
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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return enableLogs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return logger; });
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

/*globals self: false */

//let lastCallTime;
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

function consolePrintFn(type) {
  var func = self.console[type];
  if (func) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args[0]) {
        args[0] = formatMsg(type, args[0]);
      }
      func.apply(self.console, args);
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
    //'trace',
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
/* harmony default export */ __webpack_exports__["a"] = ({
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
  // fired when a level switch is requested - data: { level : id of new level } // deprecated in favor LEVEL_SWITCHING
  LEVEL_SWITCH: 'hlsLevelSwitch',
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
  // fired when an audio track switch occurs - data: { id : audio track id } // deprecated in favor AUDIO_TRACK_SWITCHING
  AUDIO_TRACK_SWITCH: 'hlsAudioTrackSwitch',
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
  //triggered when FPS drop triggers auto level capping - data: { level, droppedlevel }
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
});

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
  // Identifier for a mux Error (demuxing/remuxing)
  MUX_ERROR: 'muxError',
  // Identifier for all other errors
  OTHER_ERROR: 'otherError'
};

var ErrorDetails = {
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
  // Identifier for fragment loop loading error - data: { frag : fragment object}
  FRAG_LOOP_LOADING_ERROR: 'fragLoopLoadingError',
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
      //look for 'ID3' identifier
      if (data[offset] === 0x49 && data[offset + 1] === 0x44 && data[offset + 2] === 0x33) {
        //check version is within range
        if (data[offset + 3] < 0xFF && data[offset + 4] < 0xFF) {
          //check size is within range
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
      //look for '3DI' identifier
      if (data[offset] === 0x33 && data[offset + 1] === 0x44 && data[offset + 2] === 0x49) {
        //check version is within range
        if (data[offset + 3] < 0xFF && data[offset + 4] < 0xFF) {
          //check size is within range
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
      //ID3 header is 10 bytes
      length += 10;

      var size = ID3._readSize(data, offset + 6);
      length += size;

      if (ID3.isFooter(data, offset + 10)) {
        //ID3 footer is 10 bytes
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

    //skip frame id, size, and flags
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
      //skip past ID3 header
      offset += 10;
      var end = offset + size;
      //loop through frames in the ID3 tag
      while (offset + 8 < end) {
        var frameData = ID3._getFrameData(id3Data.subarray(offset));
        var frame = ID3._decodeFrame(frameData);
        if (frame) {
          frames.push(frame);
        }
        //skip frame header and frame data
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
        timestamp += 47721858.84; // 2^32 / 90
      }

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
/* 4 */
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

  AESDecryptor.prototype.decrypt = function decrypt(inputArrayBuffer, offset, aesIV) {
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

    var ksRow, i;
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

    return outputInt32.buffer;
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

// CONCATENATED MODULE: ./src/crypt/decrypter.js
function decrypter__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }








/*globals self: false */

var decrypter_Decrypter = function () {
  function Decrypter(observer, config) {
    decrypter__classCallCheck(this, Decrypter);

    this.observer = observer;
    this.config = config;
    this.logEnabled = true;
    try {
      var browserCrypto = crypto ? crypto : self.crypto;
      this.subtle = browserCrypto.subtle || browserCrypto.webkitSubtle;
    } catch (e) {}
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
      callback(decryptor.decrypt(data, 0, iv));
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
      this.observer.trigger(Event.ERROR, { type: errors["b" /* ErrorTypes */].MEDIA_ERROR, details: errors["a" /* ErrorDetails */].FRAG_DECRYPT_ERROR, fatal: true, reason: err.message });
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
/* 5 */
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// see https://tools.ietf.org/html/rfc1808

/* jshint ignore:start */
(function(root) { 
/* jshint ignore:end */

  var URL_REGEX = /^((?:[^\/;?#]+:)?)(\/\/[^\/\;?#]*)?(.*?)??(;.*?)?(\?.*?)?(#.*?)?$/;
  var FIRST_SEGMENT_REGEX = /^([^\/;?#]*)(.*)$/;
  var SLASH_DOT_REGEX = /(?:\/|^)\.(?=\/)/g;
  var SLASH_DOT_DOT_REGEX = /(?:\/|^)\.\.\/(?!\.\.\/).*?(?=\/)/g;

  var URLToolkit = { // jshint ignore:line
    // If opts.alwaysNormalize is true then the path will always be normalized even when it starts with / or //
    // E.g
    // With opts.alwaysNormalize = false (default, spec compliant)
    // http://a.com/b/cd + /e/f/../g => http://a.com/e/f/../g
    // With opts.alwaysNormalize = true (default, not spec compliant)
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
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./src/events.js
var events = __webpack_require__(1);

// EXTERNAL MODULE: ./src/errors.js
var errors = __webpack_require__(2);

// EXTERNAL MODULE: ./src/crypt/decrypter.js + 3 modules
var crypt_decrypter = __webpack_require__(4);

// EXTERNAL MODULE: ./src/utils/logger.js
var logger = __webpack_require__(0);

// CONCATENATED MODULE: ./src/demux/adts.js
/**
 *  ADTS parser helper
 */



function getAudioConfig(observer, data, offset, audioCodec) {
  var adtsObjectType,
      // :int
  adtsSampleingIndex,
      // :int
  adtsExtensionSampleingIndex,
      // :int
  adtsChanelConfig,
      // :int
  config,
      userAgent = navigator.userAgent.toLowerCase(),
      manifestCodec = audioCodec,
      adtsSampleingRates = [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350];
  // byte 2
  adtsObjectType = ((data[offset + 2] & 0xC0) >>> 6) + 1;
  adtsSampleingIndex = (data[offset + 2] & 0x3C) >>> 2;
  if (adtsSampleingIndex > adtsSampleingRates.length - 1) {
    observer.trigger(Event.ERROR, { type: errors["b" /* ErrorTypes */].MEDIA_ERROR, details: errors["a" /* ErrorDetails */].FRAG_PARSING_ERROR, fatal: true, reason: 'invalid ADTS sampling index:' + adtsSampleingIndex });
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
  return !!(data[offset + 1] & 0x01) ? 7 : 9;
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
  var headerLength, frameLength, stamp;
  var length = data.length;

  // The protection skip bit tells us if we have 2 bytes of CRC data at the end of the ADTS header
  headerLength = getHeaderLength(data, offset);
  // retrieve frame size
  frameLength = getFullFrameLength(data, offset);
  frameLength -= headerLength;

  if (frameLength > 0 && offset + headerLength + frameLength <= length) {
    stamp = pts + frameIndex * frameDuration;
    //logger.log(`AAC frame, offset/length/total/pts:${offset+headerLength}/${frameLength}/${data.byteLength}/${(stamp/90).toFixed(0)}`);
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

    //logger.log(`AAC frame, offset/length/total/pts:${offset+headerLength}/${frameLength}/${data.byteLength}/${(stamp/90).toFixed(0)}`);
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
var id3 = __webpack_require__(3);

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
        //nothing found, keep looking
        offset++;
      }
    }

    this.remuxer.remux(track, { samples: [] }, { samples: id3Samples, inputTimeScale: 90000 }, { samples: [] }, timeOffset, contiguous, accurateTimeOffset);
  };

  AACDemuxer.prototype.destroy = function destroy() {};

  return AACDemuxer;
}();

/* harmony default export */ var aacdemuxer = (aacdemuxer_AACDemuxer);
// CONCATENATED MODULE: ./src/demux/mp4demuxer.js
function mp4demuxer__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * MP4 demuxer
 */



var UINT32_MAX = Math.pow(2, 32) - 1;

var mp4demuxer_MP4Demuxer = function () {
  function MP4Demuxer(observer, remuxer) {
    mp4demuxer__classCallCheck(this, MP4Demuxer);

    this.observer = observer;
    this.remuxer = remuxer;
  }

  MP4Demuxer.prototype.resetTimeStamp = function resetTimeStamp(initPTS) {
    this.initPTS = initPTS;
  };

  MP4Demuxer.prototype.resetInitSegment = function resetInitSegment(initSegment, audioCodec, videoCodec, duration) {
    //jshint unused:false
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
      this.observer.trigger(events["a" /* default */].FRAG_PARSING_INIT_SEGMENT, { tracks: tracks });
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
        i,
        size,
        type,
        end,
        subresults,
        start,
        endbox;

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
                logger["b" /* logger */].log('MP4Demuxer:' + type + ':' + codecType + ' found');
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
    var trafs, baseTimes, result;

    // we need info from two childrend of each track fragment box
    trafs = MP4Demuxer.findBox(fragment, ['moof', 'traf']);

    // determine the start times for each track
    baseTimes = [].concat.apply([], trafs.map(function (traf) {
      return MP4Demuxer.findBox(traf, ['tfhd']).map(function (tfhd) {
        var id, scale, baseTime;

        // get the track id from the tfhd
        id = MP4Demuxer.readUint32(tfhd, 4);
        // assume a 90kHz clock if no timescale was specified
        scale = initData[id].timescale || 90e3;

        // get the base media decode time from the tfdt
        baseTime = MP4Demuxer.findBox(traf, ['tfdt']).map(function (tfdt) {
          var version, result;

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
      this.resetInitSegment(data, this.audioCodec, this.videoCodec);
      initData = this.initData;
    }
    var startDTS = void 0,
        initPTS = this.initPTS;
    if (initPTS === undefined) {
      var _startDTS = MP4Demuxer.getStartDTS(initData, data);
      this.initPTS = initPTS = _startDTS - timeOffset;
      this.observer.trigger(events["a" /* default */].INIT_PTS_FOUND, { initPTS: initPTS });
    }
    MP4Demuxer.offsetStartDTS(initData, data, initPTS);
    startDTS = MP4Demuxer.getStartDTS(initData, data);
    this.remuxer.remux(initData.audio, initData.video, null, null, startDTS, contiguous, accurateTimeOffset, data);
  };

  MP4Demuxer.prototype.destroy = function destroy() {};

  return MP4Demuxer;
}();

/* harmony default export */ var mp4demuxer = (mp4demuxer_MP4Demuxer);
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
    var skipBytes; // :int
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
    var leadingZeroCount; // :uint
    for (leadingZeroCount = 0; leadingZeroCount < this.bitsAvailable; ++leadingZeroCount) {
      if (0 !== (this.word & 0x80000000 >>> leadingZeroCount)) {
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
    return 1 === this.readBits(1);
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
        j,
        deltaScale;
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
        profileIdc,
        profileCompat,
        levelIdc,
        numRefFramesInPicOrderCntCycle,
        picWidthInMbsMinus1,
        picHeightInMapUnitsMinus1,
        frameMbsOnlyFlag,
        scalingListCount,
        i,
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
    levelIdc = readUByte(); //level_idc u(8)
    skipUEG(); // seq_parameter_set_id
    // some profiles have more optional data we don't need
    if (profileIdc === 100 || profileIdc === 110 || profileIdc === 122 || profileIdc === 244 || profileIdc === 44 || profileIdc === 83 || profileIdc === 86 || profileIdc === 118 || profileIdc === 128) {
      var chromaFormatIdc = readUEG();
      if (chromaFormatIdc === 3) {
        skipBits(1); // separate_colour_plane_flag
      }
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
      readUEG(); //log2_max_pic_order_cnt_lsb_minus4
    } else if (picOrderCntType === 1) {
      skipBits(1); // delta_pic_order_always_zero_flag
      skipEG(); // offset_for_non_ref_pic
      skipEG(); // offset_for_top_to_bottom_field
      numRefFramesInPicOrderCntCycle = readUEG();
      for (i = 0; i < numRefFramesInPicOrderCntCycle; i++) {
        skipEG(); // offset_for_ref_frame[ i ]
      }
    }
    skipUEG(); // max_num_ref_frames
    skipBits(1); // gaps_in_frame_num_value_allowed_flag
    picWidthInMbsMinus1 = readUEG();
    picHeightInMapUnitsMinus1 = readUEG();
    frameMbsOnlyFlag = readBits(1);
    if (frameMbsOnlyFlag === 0) {
      skipBits(1); // mb_adaptive_frame_field_flag
    }
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
    this.decrypter = new crypt_decrypter["a" /* default */](observer, config);
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
  video: 0,
  audio: 1,
  id3: 2,
  text: 3
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
    var start,
        len = data.length,
        stt,
        pid,
        atf,
        offset,
        pes,
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
              if (avcData && (pes = parsePES(avcData))) {
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
              if (audioData && (pes = parsePES(audioData))) {
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
              if (id3Data && (pes = parsePES(id3Data))) {
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
    if (avcData && (pes = parsePES(avcData))) {
      parseAVCPES(pes, true);
      avcTrack.pesData = null;
    } else {
      // either avcData null or PES truncated, keep it for next frag parsing
      avcTrack.pesData = avcData;
    }

    if (audioData && (pes = parsePES(audioData))) {
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

    if (id3Data && (pes = parsePES(id3Data))) {
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
    //logger.log('PMT PID:'  + this._pmtId);
  };

  TSDemuxer.prototype._parsePMT = function _parsePMT(data, offset, mpegSupported, isSampleAes) {
    var sectionLength,
        tableEnd,
        programInfoLength,
        pid,
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
          //logger.log('AAC PID:'  + pid);
          if (result.audio === -1) {
            result.audio = pid;
          }
          break;

        // Packetized metadata (ID3)
        case 0x15:
          //logger.log('ID3 PID:'  + pid);
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
          //logger.log('AVC PID:'  + pid);
          if (result.avc === -1) {
            result.avc = pid;
          }
          break;

        // ISO/IEC 11172-3 (MPEG-1 audio)
        // or ISO/IEC 13818-3 (MPEG-2 halved sample rate audio)
        case 0x03:
        case 0x04:
          //logger.log('MPEG PID:'  + pid);
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
        frag,
        pesFlags,
        pesPrefix,
        pesLen,
        pesHdrLen,
        pesData,
        pesPts,
        pesDts,
        payloadStartOffset,
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
    //retrieve PTS/DTS from first fragment
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
      //reassemble PES packet
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

    //logger.log('parse new PES');
    var track = this._avcTrack,
        units = this._parseAVCNALu(pes.data),
        debug = false,
        expGolombDecoder,
        avcSample = this.avcSample,
        push,
        spsfound = false,
        i,
        pushAccesUnit = this.pushAccesUnit.bind(this),
        createAVCSample = function createAVCSample(key, pts, dts, debug) {
      return { key: key, pts: pts, dts: dts, units: [], debug: debug };
    };
    //free pes.data to save up some memory
    pes.data = null;

    // if new NAL units found and last sample still there, let's push ...
    // this helps parsing streams with missing AUD (only do this if AUD never found)
    if (avcSample && units.length && !track.audFound) {
      pushAccesUnit(avcSample, track);
      avcSample = this.avcSample = createAVCSample(false, pes.pts, pes.dts, '');
    }

    units.forEach(function (unit) {
      switch (unit.type) {
        //NDR
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
            //if (sliceType === 2 || sliceType === 7) {
            if (sliceType === 2 || sliceType === 4 || sliceType === 7 || sliceType === 9) {
              avcSample.key = true;
            }
          }
          break;
        //IDR
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
        //SEI
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
        //SPS
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
        //PPS
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
        value,
        overflow,
        track = this._avcTrack,
        state = track.naluState || 0,
        lastState = state;
    var units = [],
        unit,
        unitType,
        lastUnitStart = -1,
        lastUnitType;
    //logger.log('PES:' + Hex.hexDump(array));

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
          //logger.log('pushing NALU, type/size:' + unit.type + '/' + unit.data.byteLength);
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
              //logger.log('first NALU found with overflow:' + overflow);
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
          //logger.log('find NALU @ offset:' + i + ',type:' + unitType);
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
      //logger.log('pushing NALU, type/size/state:' + unit.type + '/' + unit.data.byteLength + '/' + state);
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
        newLength,
        newData;

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
        frameDuration,
        frameIndex,
        offset,
        stamp,
        len;
    if (aacOverFlow) {
      var tmp = new Uint8Array(aacOverFlow.byteLength + data.byteLength);
      tmp.set(aacOverFlow, 0);
      tmp.set(data, aacOverFlow.byteLength);
      //logger.log(`AAC: append overflowing ${aacOverFlow.byteLength} bytes to beginning of new PES`);
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
      var reason, fatal;
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

    //scan for aac samples
    while (offset < len) {
      if (isHeader(data, offset) && offset + 5 < len) {
        var frame = appendFrame(track, data, offset, pts, frameIndex);
        if (frame) {
          //logger.log(`${Math.round(frame.sample.pts)} : AAC`);
          offset += frame.length;
          stamp = frame.sample.pts;
          frameIndex++;
        } else {
          //logger.log('Unable to parse AAC frame');
          break;
        }
      } else {
        //nothing found, keep looking
        offset++;
      }
    }

    if (offset < len) {
      aacOverFlow = data.subarray(offset, len);
      //logger.log(`AAC: overflow detected:${len-offset}`);
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
          //logger.log('Unable to parse Mpeg audio frame');
          break;
        }
      } else {
        //nothing found, keep looking
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
    var offset, length;
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
          //logger.log('Unable to parse Mpeg audio frame');
          break;
        }
      } else if (id3["a" /* default */].isHeader(data, offset)) {
        id3Data = id3["a" /* default */].getID3Data(data, offset);
        id3Samples.push({ pts: stamp, dts: stamp, data: id3Data });
        offset += id3Data.length;
      } else {
        //nothing found, keep looking
        offset++;
      }
    }

    this.remuxer.remux(track, { samples: [] }, { samples: id3Samples, inputTimeScale: 90000 }, { samples: [] }, timeOffset, contiguous, accurateTimeOffset);
  };

  MP3Demuxer.prototype.destroy = function destroy() {};

  return MP3Demuxer;
}();

/* harmony default export */ var mp3demuxer = (mp3demuxer_MP3Demuxer);
// CONCATENATED MODULE: ./src/helper/aac.js
function aac__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *  AAC helper
 */

var AAC = function () {
  function AAC() {
    aac__classCallCheck(this, AAC);
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

/* harmony default export */ var aac = (AAC);
// CONCATENATED MODULE: ./src/remux/mp4-generator.js
function mp4_generator__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Generate MP4 Box
*/

//import Hex from '../utils/hex';

var mp4_generator_UINT32_MAX = Math.pow(2, 32) - 1;

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

    var i;
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
    0x00, 0x00, 0x00, 0x00]);
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
        result;
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
    var upperWordDuration = Math.floor(duration / (mp4_generator_UINT32_MAX + 1));
    var lowerWordDuration = Math.floor(duration % (mp4_generator_UINT32_MAX + 1));
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
    sequenceNumber >> 24, sequenceNumber >> 16 & 0xFF, sequenceNumber >> 8 & 0xFF, sequenceNumber & 0xFF]) // sequence_number
    );
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
    var upperWordDuration = Math.floor(duration / (mp4_generator_UINT32_MAX + 1));
    var lowerWordDuration = Math.floor(duration % (mp4_generator_UINT32_MAX + 1));
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
        flags,
        i;
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
        i,
        data,
        len;
    // assemble the SPSs

    for (i = 0; i < track.sps.length; i++) {
      data = track.sps[i];
      len = data.byteLength;
      sps.push(len >>> 8 & 0xFF);
      sps.push(len & 0xFF);
      sps = sps.concat(Array.prototype.slice.call(data)); // SPS
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
    //console.log('avcc:' + Hex.hexDump(avcc));
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
    0x12, 0x64, 0x61, 0x69, 0x6C, //dailymotion/hls.js
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
    0x00, 0x01, //es_id
    0x00, // stream_priority

    0x04, // descriptor_type
    0x0f + configlen, // length
    0x40, //codec : mpeg4_audio
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
        upperWordDuration = Math.floor(duration / (mp4_generator_UINT32_MAX + 1)),
        lowerWordDuration = Math.floor(duration % (mp4_generator_UINT32_MAX + 1));
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
        upperWordBaseMediaDecodeTime = Math.floor(baseMediaDecodeTime / (mp4_generator_UINT32_MAX + 1)),
        lowerWordBaseMediaDecodeTime = Math.floor(baseMediaDecodeTime % (mp4_generator_UINT32_MAX + 1));
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
        i,
        sample,
        duration,
        size,
        flags,
        cts;
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
        result;
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
      //logger.log('nb AAC samples:' + audioTrack.samples.length);
      if (nbAudioSamples) {
        // if initSegment was generated without video samples, regenerate it again
        if (!audioTrack.timescale) {
          logger["b" /* logger */].warn('regenerate InitSegment as audio detected');
          this.generateIS(audioTrack, videoTrack, timeOffset);
        }
        var audioData = this.remuxAudio(audioTrack, audioTimeOffset, contiguous, accurateTimeOffset);
        //logger.log('nb AVC samples:' + videoTrack.samples.length);
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
        var videoData = void 0;
        //logger.log('nb AVC samples:' + videoTrack.samples.length);
        if (nbVideoSamples) {
          videoData = this.remuxVideo(videoTrack, videoTimeOffset, contiguous, accurateTimeOffset);
        }
        if (videoData && audioTrack.codec) {
          this.remuxEmptyAudio(audioTrack, audioTimeOffset, contiguous, videoData);
        }
      }
    }
    //logger.log('nb ID3 samples:' + audioTrack.samples.length);
    if (id3Track.samples.length) {
      this.remuxID3(id3Track, timeOffset);
    }
    //logger.log('nb ID3 samples:' + audioTrack.samples.length);
    if (textTrack.samples.length) {
      this.remuxText(textTrack, timeOffset);
    }
    //notify end of parsing
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
        initPTS,
        initDTS;

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
        mp4SampleDuration,
        mdat,
        moof,
        firstPTS,
        firstDTS,
        nextDTS,
        lastPTS,
        lastDTS,
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
      return deltadts ? deltadts : deltapts ? deltapts : a.id - b.id;
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
            // see if the delta to the next segment is longer than the minimum of maxBufferHole and
            // maxSeekHole. If so, playback would potentially get stuck, so we artificially inflate
            // the duration of the last frame to minimize any potential gap between segments.
            var maxBufferHole = config.maxBufferHole,
                maxSeekHole = config.maxSeekHole,
                gapTolerance = Math.floor(Math.min(maxBufferHole, maxSeekHole) * timeScale),
                deltaToFrameEnd = (audioTrackLength ? firstPTS + audioTrackLength * timeScale : this.nextAudioPts) - avcSample.pts;
            if (deltaToFrameEnd > gapTolerance) {
              // We subtract lastFrameDuration from deltaToFrameEnd to try to prevent any video
              // frame overlap. maxBufferHole/maxSeekHole should be >> lastFrameDuration anyway.
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

      //console.log('PTS/DTS/initDTS/normPTS/normDTS/relative PTS : ${avcSample.pts}/${avcSample.dts}/${initDTS}/${ptsnorm}/${dtsnorm}/${(avcSample.pts/4294967296).toFixed(3)}');
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

    var offset,
        mp4Sample,
        fillFrame,
        mdat,
        moof,
        firstPTS,
        lastPTS,
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

        //console.log(Math.round(pts) + '/' + Math.round(nextPts) + '/' + Math.round(delta));
        var duration = Math.abs(1000 * delta / inputTimeScale);

        // If we're overlapping by more than a duration, drop this sample
        if (delta <= -maxAudioFramesDrift * inputSampleDuration) {
          logger["b" /* logger */].warn('Dropping 1 audio frame @ ' + (nextPts / inputTimeScale).toFixed(3) + 's due to ' + Math.round(duration) + ' ms overlap.');
          inputSamples.splice(i, 1);
          track.len -= sample.unit.length;
          // Don't touch nextPtsNorm or i
        }

        // Insert missing frames if:
        // 1: We're more than maxAudioFramesDrift frame away
        // 2: Not more than MAX_SILENT_FRAME_DURATION away
        // 3: currentTime (aka nextPtsNorm) is not 0
        else if (delta >= maxAudioFramesDrift * inputSampleDuration && duration < MAX_SILENT_FRAME_DURATION && nextPts) {
            var missing = Math.round(delta / inputSampleDuration);
            logger["b" /* logger */].warn('Injecting ' + missing + ' audio frame @ ' + (nextPts / inputTimeScale).toFixed(3) + 's due to ' + Math.round(1000 * delta / inputTimeScale) + ' ms gap.');
            for (var j = 0; j < missing; j++) {
              var newStamp = Math.max(nextPts, 0);
              fillFrame = aac.getSilentFrame(track.manifestCodec || track.codec, track.channelCount);
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
              //logger.log(`Invalid frame delta ${Math.round(delta + inputSampleDuration)} at PTS ${Math.round(pts / 90)} (should be ${Math.round(inputSampleDuration)}).`);
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
      //logger.log(`Audio/PTS:${Math.round(pts/90)}`);
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
                fillFrame = aac.getSilentFrame(track.manifestCodec || track.codec, track.channelCount);
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
          fillFrame = aac.getSilentFrame(track.manifestCodec || track.codec, track.channelCount);
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
      //console.log('PTS/DTS/initDTS/normPTS/normDTS/relative PTS : ${audioSample.pts}/${audioSample.dts}/${initDTS}/${ptsnorm}/${dtsnorm}/${(audioSample.pts/4294967296).toFixed(3)}');
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
    //set last sample duration as being identical to previous sample
    if (nbSamples >= 2) {
      lastSampleDuration = outputSamples[nbSamples - 2].duration;
      mp4Sample.duration = lastSampleDuration;
    }
    if (nbSamples) {
      // next audio sample PTS should be equal to last sample PTS + duration
      this.nextAudioPts = nextAudioPts = lastPTS + scaleFactor * lastSampleDuration;
      //logger.log('Audio/PTS/PTSend:' + audioSample.pts.toFixed(0) + '/' + this.nextAacDts.toFixed(0));
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
    silentFrame = aac.getSilentFrame(track.manifestCodec || track.codec, track.channelCount);

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
        sample;
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
        sample;
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
    var offset;
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
      nb: 1,
      dropped: 0
    });
    //notify end of parsing
    observer.trigger(events["a" /* default */].FRAG_PARSED);
  };

  return PassThroughRemuxer;
}();

/* harmony default export */ var passthrough_remuxer = (passthrough_remuxer_PassThroughRemuxer);
// CONCATENATED MODULE: ./src/demux/demuxer-inline.js
function demuxer_inline__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*  inline demuxer.
 *   probe fragments and instantiate appropriate demuxer depending on content type (TSDemuxer, AACDemuxer, ...)
 */











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
      var startTime;
      try {
        startTime = performance.now();
      } catch (error) {
        startTime = Date.now();
      }
      decrypter.decrypt(data, decryptdata.key.buffer, decryptdata.iv.buffer, function (decryptedData) {
        var endTime;
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
    // in case of continuity change, we might switch from content type (AAC container to TS container for example)
    // so let's check that current demuxer is still valid
    discontinuity && !this.probe(data)) {
      var observer = this.observer;
      var typeSupported = this.typeSupported;
      var config = this.config;
      // probing order is TS/AAC/MP3/MP4
      var muxConfig = [{ demux: tsdemuxer, remux: mp4_remuxer }, { demux: mp4demuxer, remux: passthrough_remuxer }, { demux: aacdemuxer, remux: mp4_remuxer }, { demux: mp3demuxer, remux: mp4_remuxer }];

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
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var cues_namespaceObject = {};
__webpack_require__.d(cues_namespaceObject, "newCue", function() { return newCue; });

// EXTERNAL MODULE: ./node_modules/url-toolkit/src/url-toolkit.js
var url_toolkit = __webpack_require__(6);
var url_toolkit_default = /*#__PURE__*/__webpack_require__.n(url_toolkit);

// EXTERNAL MODULE: ./src/events.js
var events = __webpack_require__(1);

// EXTERNAL MODULE: ./src/errors.js
var errors = __webpack_require__(2);

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
    this.unregisterListeners();
  };

  EventHandler.prototype.isEventHandler = function isEventHandler() {
    return _typeof(this.handledEvents) === 'object' && this.handledEvents.length && typeof this.onEvent === 'function';
  };

  EventHandler.prototype.registerListeners = function registerListeners() {
    if (this.isEventHandler()) {
      this.handledEvents.forEach(function (event) {
        if (event === 'hlsEventGeneric') {
          throw new Error('Forbidden event name: ' + event);
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
      logger["b" /* logger */].error('internal error happened while processing ' + event + ':' + err.message);
      this.hls.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].OTHER_ERROR, details: errors["a" /* ErrorDetails */].INTERNAL_EXCEPTION, fatal: false, event: event, err: err });
    }
  };

  return EventHandler;
}();

/* harmony default export */ var event_handler = (event_handler_EventHandler);
// CONCATENATED MODULE: ./src/utils/attr-list.js
function attr_list__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DECIMAL_RESOLUTION_REGEX = /^(\d+)x(\d+)$/;
var ATTR_LIST_REGEX = /\s*(.+?)\s*=((?:\".*?\")|.*?)(?:,|$)/g;

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
    var match,
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
    return MediaSource.isTypeSupported((type || 'video') + '/mp4;codecs="' + codec + '"');
}


// CONCATENATED MODULE: ./src/loader/playlist-loader.js
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function playlist_loader__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Playlist Loader
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

var playlist_loader_LevelKey = function () {
  function LevelKey() {
    playlist_loader__classCallCheck(this, LevelKey);

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

var playlist_loader_Fragment = function () {
  function Fragment() {
    playlist_loader__classCallCheck(this, Fragment);

    this._url = null;
    this._byteRange = null;
    this._decryptdata = null;
    this.tagList = [];
  }

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
      decryptdata = new playlist_loader_LevelKey();
      decryptdata.method = levelkey.method;
      decryptdata.baseuri = levelkey.baseuri;
      decryptdata.reluri = levelkey.reluri;
      decryptdata.iv = this.createInitializationVector(segmentNumber);
    }

    return decryptdata;
  };

  Fragment.prototype.cloneObj = function cloneObj(obj) {
    return JSON.parse(JSON.stringify(obj));
  };

  _createClass(Fragment, [{
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
      if (!this._byteRange) {
        var byteRange = this._byteRange = [];
        if (this.rawByteRange) {
          var params = this.rawByteRange.split('@', 2);
          if (params.length === 1) {
            var lastByteRangeEndOffset = this.lastByteRangeEndOffset;
            byteRange[0] = lastByteRangeEndOffset ? lastByteRangeEndOffset : 0;
          } else {
            byteRange[0] = parseInt(params[1]);
          }
          byteRange[1] = parseInt(params[0]) + byteRange[0];
        }
      }
      return this._byteRange;
    }
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
  }]);

  return Fragment;
}();

function findGroup(groups, mediaGroupId) {
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
}

var playlist_loader_PlaylistLoader = function (_EventHandler) {
  _inherits(PlaylistLoader, _EventHandler);

  function PlaylistLoader(hls) {
    playlist_loader__classCallCheck(this, PlaylistLoader);

    var _this = _possibleConstructorReturn(this, _EventHandler.call(this, hls, events["a" /* default */].MANIFEST_LOADING, events["a" /* default */].LEVEL_LOADING, events["a" /* default */].AUDIO_TRACK_LOADING, events["a" /* default */].SUBTITLE_TRACK_LOADING));

    _this.loaders = {};
    return _this;
  }

  PlaylistLoader.prototype.destroy = function destroy() {
    for (var loaderName in this.loaders) {
      var loader = this.loaders[loaderName];
      if (loader) {
        loader.destroy();
      }
    }
    this.loaders = {};
    event_handler.prototype.destroy.call(this);
  };

  PlaylistLoader.prototype.onManifestLoading = function onManifestLoading(data) {
    this.load(data.url, { type: 'manifest' });
  };

  PlaylistLoader.prototype.onLevelLoading = function onLevelLoading(data) {
    this.load(data.url, { type: 'level', level: data.level, id: data.id });
  };

  PlaylistLoader.prototype.onAudioTrackLoading = function onAudioTrackLoading(data) {
    this.load(data.url, { type: 'audioTrack', id: data.id });
  };

  PlaylistLoader.prototype.onSubtitleTrackLoading = function onSubtitleTrackLoading(data) {
    this.load(data.url, { type: 'subtitleTrack', id: data.id });
  };

  PlaylistLoader.prototype.load = function load(url, context) {
    var loader = this.loaders[context.type];
    if (loader !== undefined) {
      var loaderContext = loader.context;
      if (loaderContext && loaderContext.url === url) {
        logger["b" /* logger */].trace('playlist request ongoing');
        return;
      } else {
        logger["b" /* logger */].warn('abort previous loader for type:' + context.type);
        loader.abort();
      }
    }
    var config = this.hls.config,
        maxRetry = void 0,
        timeout = void 0,
        retryDelay = void 0,
        maxRetryDelay = void 0;
    if (context.type === 'manifest') {
      maxRetry = config.manifestLoadingMaxRetry;
      timeout = config.manifestLoadingTimeOut;
      retryDelay = config.manifestLoadingRetryDelay;
      maxRetryDelay = config.manifestLoadingMaxRetryTimeout;
    } else if (context.type === 'level') {
      // Disable internal loader retry logic, since we are managing retries in Level Controller
      maxRetry = 0;
      timeout = config.levelLoadingTimeOut;
    } else {
      // TODO Introduce retry settings for audio-track and subtitle-track, it should not use level retry config
      maxRetry = config.levelLoadingMaxRetry;
      timeout = config.levelLoadingTimeOut;
      retryDelay = config.levelLoadingRetryDelay;
      maxRetryDelay = config.levelLoadingMaxRetryTimeout;
      logger["b" /* logger */].log('loading playlist for ' + context.type + ' ' + (context.level || context.id));
    }
    loader = this.loaders[context.type] = context.loader = typeof config.pLoader !== 'undefined' ? new config.pLoader(config) : new config.loader(config);
    context.url = url;
    context.responseType = '';

    var loaderConfig = void 0,
        loaderCallbacks = void 0;
    loaderConfig = { timeout: timeout, maxRetry: maxRetry, retryDelay: retryDelay, maxRetryDelay: maxRetryDelay };
    loaderCallbacks = { onSuccess: this.loadsuccess.bind(this), onError: this.loaderror.bind(this), onTimeout: this.loadtimeout.bind(this) };
    loader.load(context, loaderConfig, loaderCallbacks);
  };

  PlaylistLoader.prototype.resolve = function resolve(url, baseUrl) {
    return url_toolkit_default.a.buildAbsoluteURL(baseUrl, url, { alwaysNormalize: true });
  };

  PlaylistLoader.prototype.parseMasterPlaylist = function parseMasterPlaylist(string, baseurl) {
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
      level.url = this.resolve(result[2], baseurl);

      var resolution = attrs.decimalResolution('RESOLUTION');
      if (resolution) {
        level.width = resolution.width;
        level.height = resolution.height;
      }
      level.bitrate = attrs.decimalInteger('AVERAGE-BANDWIDTH') || attrs.decimalInteger('BANDWIDTH');
      level.name = attrs.NAME;

      setCodecs([].concat((attrs.CODECS || '').split(/[ ,]+/)), level);

      if (level.videoCodec && level.videoCodec.indexOf('avc1') !== -1) {
        level.videoCodec = this.avc1toavcoti(level.videoCodec);
      }

      levels.push(level);
    }
    return levels;
  };

  PlaylistLoader.prototype.parseMasterPlaylistMedia = function parseMasterPlaylistMedia(string, baseurl, type) {
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
          media.url = this.resolve(attrs.URI, baseurl);
        }
        media.lang = attrs.LANGUAGE;
        if (!media.name) {
          media.name = media.lang;
        }
        if (audioGroups.length) {
          var groupCodec = findGroup(audioGroups, media.groupId);
          media.audioCodec = groupCodec ? groupCodec.codec : audioGroups[0].codec;
        }
        media.id = id++;
        medias.push(media);
      }
    }
    return medias;
  };

  PlaylistLoader.prototype.avc1toavcoti = function avc1toavcoti(codec) {
    var result,
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

  PlaylistLoader.prototype.parseLevelPlaylist = function parseLevelPlaylist(string, baseurl, id, type) {
    var currentSN = 0,
        totalduration = 0,
        level = { type: null, version: null, url: baseurl, fragments: [], live: true, startSN: 0 },
        levelkey = new playlist_loader_LevelKey(),
        cc = 0,
        prevFrag = null,
        frag = new playlist_loader_Fragment(),
        result,
        i;

    LEVEL_PLAYLIST_REGEX_FAST.lastIndex = 0;

    while ((result = LEVEL_PLAYLIST_REGEX_FAST.exec(string)) !== null) {
      var duration = result[1];
      if (duration) {
        // INF
        frag.duration = parseFloat(duration);
        // avoid sliced strings    https://github.com/video-dev/hls.js/issues/939
        var title = (' ' + result[2]).slice(1);
        frag.title = title ? title : null;
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
          frag.baseurl = baseurl;
          // avoid sliced strings    https://github.com/video-dev/hls.js/issues/939
          frag.relurl = (' ' + result[3]).slice(1);

          level.fragments.push(frag);
          prevFrag = frag;
          totalduration += frag.duration;

          frag = new playlist_loader_Fragment();
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
              levelkey = new playlist_loader_LevelKey();
              if (decrypturi && ['AES-128', 'SAMPLE-AES'].indexOf(decryptmethod) >= 0) {
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
            //TIME-OFFSET can be 0
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
            frag = new playlist_loader_Fragment();
            break;
          default:
            logger["b" /* logger */].warn('line parsed but not handled: ' + result);
            break;
        }
      }
    }
    frag = prevFrag;
    //logger.log('found ' + level.fragments.length + ' fragments');
    if (frag && !frag.relurl) {
      level.fragments.pop();
      totalduration -= frag.duration;
    }
    level.totalduration = totalduration;
    level.averagetargetduration = totalduration / level.fragments.length;
    level.endSN = currentSN - 1;
    level.startCC = level.fragments[0] ? level.fragments[0].cc : 0;
    level.endCC = cc;
    return level;
  };

  PlaylistLoader.prototype.loadsuccess = function loadsuccess(response, stats, context) {
    var networkDetails = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    var string = response.data,
        url = response.url,
        type = context.type,
        id = context.id,
        level = context.level,
        hls = this.hls;

    this.loaders[type] = undefined;
    // responseURL not supported on some browsers (it is used to detect URL redirection)
    // data-uri mode also not supported (but no need to detect redirection)
    if (url === undefined || url.indexOf('data:') === 0) {
      // fallback to initial URL
      url = context.url;
    }
    stats.tload = performance.now();
    //stats.mtime = new Date(target.getResponseHeader('Last-Modified'));
    if (string.indexOf('#EXTM3U') === 0) {
      if (string.indexOf('#EXTINF:') > 0) {
        var isLevel = type !== 'audioTrack' && type !== 'subtitleTrack',
            levelId = !isNaN(level) ? level : !isNaN(id) ? id : 0,
            levelDetails = this.parseLevelPlaylist(string, url, levelId, type === 'audioTrack' ? 'audio' : type === 'subtitleTrack' ? 'subtitle' : 'main');
        levelDetails.tload = stats.tload;
        if (type === 'manifest') {
          // first request, stream manifest (no master playlist), fire manifest loaded event with level details
          hls.trigger(events["a" /* default */].MANIFEST_LOADED, { levels: [{ url: url, details: levelDetails }], audioTracks: [], url: url, stats: stats, networkDetails: networkDetails });
        }
        stats.tparsed = performance.now();
        if (levelDetails.targetduration) {
          if (isLevel) {
            hls.trigger(events["a" /* default */].LEVEL_LOADED, { details: levelDetails, level: level || 0, id: id || 0, stats: stats, networkDetails: networkDetails });
          } else {
            if (type === 'audioTrack') {
              hls.trigger(events["a" /* default */].AUDIO_TRACK_LOADED, { details: levelDetails, id: id, stats: stats, networkDetails: networkDetails });
            } else if (type === 'subtitleTrack') {
              hls.trigger(events["a" /* default */].SUBTITLE_TRACK_LOADED, { details: levelDetails, id: id, stats: stats, networkDetails: networkDetails });
            }
          }
        } else {
          hls.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].NETWORK_ERROR, details: errors["a" /* ErrorDetails */].MANIFEST_PARSING_ERROR, fatal: true, url: url, reason: 'invalid targetduration', networkDetails: networkDetails });
        }
      } else {
        var levels = this.parseMasterPlaylist(string, url);
        // multi level playlist, parse level info
        if (levels.length) {
          var audioGroups = levels.map(function (l) {
            return { id: l.attrs.AUDIO, codec: l.audioCodec };
          });
          var audioTracks = this.parseMasterPlaylistMedia(string, url, 'AUDIO', audioGroups);
          var subtitles = this.parseMasterPlaylistMedia(string, url, 'SUBTITLES');
          if (audioTracks.length) {
            // check if we have found an audio track embedded in main playlist (audio track without URI attribute)
            var embeddedAudioFound = false;
            audioTracks.forEach(function (audioTrack) {
              if (!audioTrack.url) {
                embeddedAudioFound = true;
              }
            });
            // if no embedded audio track defined, but audio codec signaled in quality level, we need to signal this main audio track
            // this could happen with playlists with alt audio rendition in which quality levels (main) contains both audio+video. but with mixed audio track not signaled
            if (embeddedAudioFound === false && levels[0].audioCodec && !levels[0].attrs.AUDIO) {
              logger["b" /* logger */].log('audio codec signaled in quality level, but no embedded audio track signaled, create one');
              audioTracks.unshift({ type: 'main', name: 'main' });
            }
          }
          hls.trigger(events["a" /* default */].MANIFEST_LOADED, { levels: levels, audioTracks: audioTracks, subtitles: subtitles, url: url, stats: stats, networkDetails: networkDetails });
        } else {
          hls.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].NETWORK_ERROR, details: errors["a" /* ErrorDetails */].MANIFEST_PARSING_ERROR, fatal: true, url: url, reason: 'no level found in manifest', networkDetails: networkDetails });
        }
      }
    } else {
      hls.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].NETWORK_ERROR, details: errors["a" /* ErrorDetails */].MANIFEST_PARSING_ERROR, fatal: true, url: url, reason: 'no EXTM3U delimiter', networkDetails: networkDetails });
    }
  };

  PlaylistLoader.prototype.loaderror = function loaderror(response, context) {
    var networkDetails = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var details,
        fatal,
        loader = context.loader;
    switch (context.type) {
      case 'manifest':
        details = errors["a" /* ErrorDetails */].MANIFEST_LOAD_ERROR;
        fatal = true;
        break;
      case 'level':
        details = errors["a" /* ErrorDetails */].LEVEL_LOAD_ERROR;
        fatal = false;
        break;
      case 'audioTrack':
        details = errors["a" /* ErrorDetails */].AUDIO_TRACK_LOAD_ERROR;
        fatal = false;
        break;
    }
    if (loader) {
      loader.abort();
      this.loaders[context.type] = undefined;
    }
    this.hls.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].NETWORK_ERROR, details: details, fatal: fatal, url: loader.url, loader: loader, response: response, context: context, networkDetails: networkDetails });
  };

  PlaylistLoader.prototype.loadtimeout = function loadtimeout(stats, context) {
    var networkDetails = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var details,
        fatal,
        loader = context.loader;
    switch (context.type) {
      case 'manifest':
        details = errors["a" /* ErrorDetails */].MANIFEST_LOAD_TIMEOUT;
        fatal = true;
        break;
      case 'level':
        details = errors["a" /* ErrorDetails */].LEVEL_LOAD_TIMEOUT;
        fatal = false;
        break;
      case 'audioTrack':
        details = errors["a" /* ErrorDetails */].AUDIO_TRACK_LOAD_TIMEOUT;
        fatal = false;
        break;
    }
    if (loader) {
      loader.abort();
      this.loaders[context.type] = undefined;
    }
    this.hls.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].NETWORK_ERROR, details: details, fatal: fatal, url: loader.url, loader: loader, context: context, networkDetails: networkDetails });
  };

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
    event_handler.prototype.destroy.call(this);
  };

  FragmentLoader.prototype.onFragLoading = function onFragLoading(data) {
    var frag = data.frag,
        type = frag.type,
        loader = this.loaders[type],
        config = this.hls.config;

    frag.loaded = 0;
    if (loader) {
      logger["b" /* logger */].warn('abort previous fragment loader for type:' + type);
      loader.abort();
    }
    loader = this.loaders[type] = frag.loader = typeof config.fLoader !== 'undefined' ? new config.fLoader(config) : new config.loader(config);

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
    loaderConfig = { timeout: config.fragLoadingTimeOut, maxRetry: 0, retryDelay: 0, maxRetryDelay: config.fragLoadingMaxRetryTimeout };
    loaderCallbacks = { onSuccess: this.loadsuccess.bind(this), onError: this.loaderror.bind(this), onTimeout: this.loadtimeout.bind(this), onProgress: this.loadprogress.bind(this) };
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
// CONCATENATED MODULE: ./src/helper/buffer-helper.js
/**
 * Buffer Helper utils, providing methods dealing buffer length retrieval
*/

var BufferHelper = {
  isBuffered: function isBuffered(media, position) {
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
  },

  bufferInfo: function bufferInfo(media, pos, maxHoleDuration) {
    try {
      if (media) {
        var vbuffered = media.buffered,
            buffered = [],
            i;
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
  },

  bufferedInfo: function bufferedInfo(buffered, pos, maxHoleDuration) {
    var buffered2 = [],

    // bufferStart and bufferEnd are buffer boundaries around current video position
    bufferLen,
        bufferStart,
        bufferEnd,
        bufferStartNext,
        i;
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
      //logger.log('buf start/end:' + buffered.start(i) + '/' + buffered.end(i));
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
  }
};

/* harmony default export */ var buffer_helper = (BufferHelper);
// EXTERNAL MODULE: ./src/demux/demuxer-inline.js + 12 modules
var demuxer_inline = __webpack_require__(7);

// EXTERNAL MODULE: ./node_modules/events/events.js
var events_events = __webpack_require__(5);
var events_default = /*#__PURE__*/__webpack_require__.n(events_events);

// EXTERNAL MODULE: ./node_modules/webworkify-webpack/index.js
var webworkify_webpack = __webpack_require__(9);
var webworkify_webpack_default = /*#__PURE__*/__webpack_require__.n(webworkify_webpack);

// CONCATENATED MODULE: ./src/helper/mediasource-helper.js
/**
 * MediaSource helper
 */

function getMediaSource() {
  if (typeof window !== 'undefined') {
    return window.MediaSource || window.WebKitMediaSource;
  }
}
// CONCATENATED MODULE: ./src/demux/demuxer.js
function demuxer__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }









var demuxer_MediaSource = getMediaSource();

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
      mp4: demuxer_MediaSource.isTypeSupported('video/mp4'),
      mpeg: demuxer_MediaSource.isTypeSupported('audio/mpeg'),
      mp3: demuxer_MediaSource.isTypeSupported('audio/mp4; codecs="mp3"')
    };
    // navigator.vendor is not always available in Web Worker
    // refer to https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/navigator
    var vendor = navigator.vendor;
    if (config.enableWorker && typeof Worker !== 'undefined') {
      logger["b" /* logger */].log('demuxing in webworker');
      var w = void 0;
      try {
        w = this.w = webworkify_webpack_default()(/*require.resolve*/(10));
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
          URL.revokeObjectURL(w.objectURL);
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
    //console.log('onWorkerMessage:' + data.event);
    switch (data.event) {
      case 'init':
        // revoke the Object URL that was used to create demuxer worker, so as not to leak it
        URL.revokeObjectURL(this.w.objectURL);
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
// CONCATENATED MODULE: ./src/helper/level-helper.js
/**
 * Level Helper class, providing methods dealing with playlist sliding and drift
*/



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
  var fragIdx, fragments, i;
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
  //logger.log(`                                            frag start/end:${startPTS.toFixed(3)}/${endPTS.toFixed(3)}`);

  return drift;
}

function mergeDetails(oldDetails, newDetails) {
  var start = Math.max(oldDetails.startSN, newDetails.startSN) - newDetails.startSN,
      end = Math.min(oldDetails.endSN, newDetails.endSN) - newDetails.startSN,
      delta = newDetails.startSN - oldDetails.startSN,
      oldfragments = oldDetails.fragments,
      newfragments = newDetails.fragments,
      ccOffset = 0,
      PTSFrag;

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
// CONCATENATED MODULE: ./src/utils/timeRanges.js
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

/* harmony default export */ var timeRanges = (TimeRanges);
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
  if (details.PTSKnown === false && lastLevel && lastLevel.details) {
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

var stream_controller_StreamController = function (_EventHandler) {
  stream_controller__inherits(StreamController, _EventHandler);

  function StreamController(hls) {
    stream_controller__classCallCheck(this, StreamController);

    var _this = stream_controller__possibleConstructorReturn(this, _EventHandler.call(this, hls, events["a" /* default */].MEDIA_ATTACHED, events["a" /* default */].MEDIA_DETACHING, events["a" /* default */].MANIFEST_LOADING, events["a" /* default */].MANIFEST_PARSED, events["a" /* default */].LEVEL_LOADED, events["a" /* default */].KEY_LOADED, events["a" /* default */].FRAG_LOADED, events["a" /* default */].FRAG_LOAD_EMERGENCY_ABORTED, events["a" /* default */].FRAG_PARSING_INIT_SEGMENT, events["a" /* default */].FRAG_PARSING_DATA, events["a" /* default */].FRAG_PARSED, events["a" /* default */].ERROR, events["a" /* default */].AUDIO_TRACK_SWITCHING, events["a" /* default */].AUDIO_TRACK_SWITCHED, events["a" /* default */].BUFFER_CREATED, events["a" /* default */].BUFFER_APPENDED, events["a" /* default */].BUFFER_FLUSHED));

    _this.config = hls.config;
    _this.audioCodecSwap = false;
    _this.ticks = 0;
    _this._state = State.STOPPED;
    _this.ontick = _this.tick.bind(_this);
    return _this;
  }

  StreamController.prototype.destroy = function destroy() {
    this.stopLoad();
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    event_handler.prototype.destroy.call(this);
    this.state = State.STOPPED;
  };

  StreamController.prototype.startLoad = function startLoad(startPosition) {
    if (this.levels) {
      var lastCurrentTime = this.lastCurrentTime,
          hls = this.hls;
      this.stopLoad();
      if (!this.timer) {
        this.timer = setInterval(this.ontick, 100);
      }
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
      this.fragCurrent = null;
    }
    this.fragPrevious = null;
    if (this.demuxer) {
      this.demuxer.destroy();
      this.demuxer = null;
    }
    this.state = State.STOPPED;
    this.forceStartLoad = false;
  };

  StreamController.prototype.tick = function tick() {
    this.ticks++;
    if (this.ticks === 1) {
      this.doTick();
      if (this.ticks > 1) {
        setTimeout(this.tick, 1);
      }
      this.ticks = 0;
    }
  };

  StreamController.prototype.doTick = function doTick() {
    switch (this.state) {
      case State.ERROR:
        //don't do anything in error state to avoid breaking further ...
        break;
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
        var now = performance.now();
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

    var bufferInfo = buffer_helper.bufferInfo(this.mediaBuffer ? this.mediaBuffer : media, pos, config.maxBufferHole),
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
    if (levelDetails === undefined || levelDetails.live === true && this.levelLastLoaded !== level) {
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
      this._loadFragmentOrKey(frag, level, levelDetails, pos, bufferEnd);
    }
    return;
  };

  StreamController.prototype._ensureFragmentAtLivePoint = function _ensureFragmentAtLivePoint(levelDetails, bufferEnd, start, end, fragPrevious, fragments, fragLen) {
    var config = this.hls.config,
        media = this.media;

    var frag = void 0;

    // check if requested position is within seekable boundaries :
    //logger.log(`start/pos/bufEnd/seeking:${start.toFixed(3)}/${pos.toFixed(3)}/${bufferEnd.toFixed(3)}/${this.media.seeking}`);
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
    var frag = void 0;
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
      //logger.log(`level/sn/start/end/bufEnd:${level}/${candidate.sn}/${candidate.start}/${(candidate.start+candidate.duration)}/${bufferEnd}`);
      // Set the lookup tolerance to be small enough to detect the current segment - ensures we don't skip over very small segments
      var candidateLookupTolerance = Math.min(maxFragLookUpTolerance, candidate.duration + (candidate.deltaPTS ? candidate.deltaPTS : 0));
      if (candidate.start + candidate.duration - candidateLookupTolerance <= bufferEnd) {
        return 1;
      } // if maxFragLookUpTolerance will have negative value then don't return -1 for first element
      else if (candidate.start - candidateLookupTolerance > bufferEnd && candidate.start) {
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
      var curSNIdx = frag.sn - levelDetails.startSN;
      var sameLevel = fragPrevious && frag.level === fragPrevious.level;
      var prevFrag = fragments[curSNIdx - 1];
      var nextFrag = fragments[curSNIdx + 1];
      //logger.log('find SN matching with pos:' +  bufferEnd + ':' + frag.sn);
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
              // decrement previous frag load counter to avoid frag loop loading error when next fragment will get reloaded
              fragPrevious.loadCounter--;
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
              if (prevFrag.loadCounter) {
                prevFrag.loadCounter--;
              }
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

  StreamController.prototype._loadFragmentOrKey = function _loadFragmentOrKey(frag, level, levelDetails, pos, bufferEnd) {
    var hls = this.hls,
        config = hls.config;

    //logger.log('loading frag ' + i +',pos/bufEnd:' + pos.toFixed(3) + '/' + bufferEnd.toFixed(3));
    if (frag.decryptdata && frag.decryptdata.uri != null && frag.decryptdata.key == null) {
      logger["b" /* logger */].log('Loading key for ' + frag.sn + ' of [' + levelDetails.startSN + ' ,' + levelDetails.endSN + '],level ' + level);
      this.state = State.KEY_LOADING;
      hls.trigger(events["a" /* default */].KEY_LOADING, { frag: frag });
    } else {
      logger["b" /* logger */].log('Loading ' + frag.sn + ' of [' + levelDetails.startSN + ' ,' + levelDetails.endSN + '],level ' + level + ', currentTime:' + pos.toFixed(3) + ',bufferEnd:' + bufferEnd.toFixed(3));
      // ensure that we are not reloading the same fragments in loop ...
      if (this.fragLoadIdx !== undefined) {
        this.fragLoadIdx++;
      } else {
        this.fragLoadIdx = 0;
      }
      if (frag.loadCounter) {
        frag.loadCounter++;
        var maxThreshold = config.fragLoadingLoopThreshold;
        // if this frag has already been loaded 3 times, and if it has been reloaded recently
        if (frag.loadCounter > maxThreshold && Math.abs(this.fragLoadIdx - frag.loadIdx) < maxThreshold) {
          hls.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].MEDIA_ERROR, details: errors["a" /* ErrorDetails */].FRAG_LOOP_LOADING_ERROR, fatal: false, frag: frag });
          return;
        }
      } else {
        frag.loadCounter = 1;
      }
      frag.loadIdx = this.fragLoadIdx;
      frag.autoLevel = hls.autoLevelEnabled;
      frag.bitrateTest = this.bitrateTest;

      this.fragCurrent = frag;
      this.startFragRequested = true;
      // Don't update nextLoadPosition for fragments which are not buffered
      if (!isNaN(frag.sn) && !frag.bitrateTest) {
        this.nextLoadPosition = frag.start + frag.duration;
      }
      hls.trigger(events["a" /* default */].FRAG_LOADING, { frag: frag });
      // lazy demuxer init, as this could take some time ... do it during frag loading
      if (!this.demuxer) {
        this.demuxer = new demux_demuxer(hls, 'main');
      }
      this.state = State.FRAG_LOADING;
      return;
    }
  };

  StreamController.prototype.getBufferedFrag = function getBufferedFrag(position) {
    return binary_search.search(this._bufferedFrags, function (frag) {
      if (position < frag.startPTS) {
        return -1;
      } else if (position > frag.endPTS) {
        return 1;
      }
      return 0;
    });
  };

  StreamController.prototype.followingBufferedFrag = function followingBufferedFrag(frag) {
    if (frag) {
      // try to get range of next fragment (500ms after this range)
      return this.getBufferedFrag(frag.endPTS + 0.5);
    }
    return null;
  };

  StreamController.prototype._checkFragmentChanged = function _checkFragmentChanged() {
    var fragPlayingCurrent,
        currentTime,
        video = this.media;
    if (video && video.readyState && video.seeking === false) {
      currentTime = video.currentTime;
      /* if video element is in seeked state, currentTime can only increase.
        (assuming that playback rate is positive ...)
        As sometimes currentTime jumps back to zero after a
        media decode error, check this, to avoid seeking back to
        wrong position after a media decode error
      */
      if (currentTime > video.playbackRate * this.lastCurrentTime) {
        this.lastCurrentTime = currentTime;
      }
      if (buffer_helper.isBuffered(video, currentTime)) {
        fragPlayingCurrent = this.getBufferedFrag(currentTime);
      } else if (buffer_helper.isBuffered(video, currentTime + 0.1)) {
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
    // increase fragment load Index to avoid frag loop loading error after buffer flush
    if (this.fragLoadIdx !== undefined) {
      this.fragLoadIdx += 2 * this.config.fragLoadingLoopThreshold;
    }
    // flush everything
    this.flushMainBuffer(0, Number.POSITIVE_INFINITY);
  };

  /*
     on immediate level switch end, after new fragment has been buffered :
      - nudge video decoder by slightly adjusting video currentTime (if currentTime buffered)
      - resume the playback if needed
  */


  StreamController.prototype.immediateLevelSwitchEnd = function immediateLevelSwitchEnd() {
    var media = this.media;
    if (media && media.buffered.length) {
      this.immediateSwitch = false;
      if (buffer_helper.isBuffered(media, media.currentTime)) {
        // only nudge if currentTime is buffered
        media.currentTime -= 0.0001;
      }
      if (!this.previouslyPaused) {
        media.play();
      }
    }
  };

  StreamController.prototype.nextLevelSwitch = function nextLevelSwitch() {
    /* try to switch ASAP without breaking video playback :
       in order to ensure smooth but quick level switching,
      we need to find the next flushable buffer range
      we should take into account new segment fetch time
    */
    var media = this.media;
    // ensure that media is defined and that metadata are available (to retrieve currentTime)
    if (media && media.readyState) {
      var fetchdelay = void 0,
          fragPlayingCurrent = void 0,
          nextBufferedFrag = void 0;
      if (this.fragLoadIdx !== undefined) {
        // increase fragment load Index to avoid frag loop loading error after buffer flush
        this.fragLoadIdx += 2 * this.config.fragLoadingLoopThreshold;
      }
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
      //logger.log('fetchdelay:'+fetchdelay);
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

    // reset fragment loading counter on MSE detaching to avoid reporting FRAG_LOOP_LOADING_ERROR after error recovery
    var levels = this.levels;
    if (levels) {
      // reset fragment load counter
      levels.forEach(function (level) {
        if (level.details) {
          level.details.fragments.forEach(function (fragment) {
            fragment.loadCounter = undefined;
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
    var bufferInfo = buffer_helper.bufferInfo(mediaBuffer, currentTime, this.config.maxBufferHole);
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
    // avoid reporting fragment loop loading error in case user is seeking several times on same position
    if (this.state !== State.FRAG_LOADING && this.fragLoadIdx !== undefined) {
      this.fragLoadIdx += 2 * config.fragLoadingLoopThreshold;
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
    this._bufferedFrags = [];
    this.stalled = false;
    this.startPosition = this.lastCurrentTime = 0;
  };

  StreamController.prototype.onManifestParsed = function onManifestParsed(data) {
    var aac = false,
        heaac = false,
        codec;
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
    //trigger handler right now
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
      var stats = data.stats,
          currentLevel = this.levels[fragCurrent.level],
          details = currentLevel.details;
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
        stats.tparsed = stats.tbuffered = performance.now();
        this.hls.trigger(events["a" /* default */].FRAG_BUFFERED, { stats: stats, frag: fragCurrent, id: 'main' });
        this.tick();
      } else if (fragLoaded.sn === 'initSegment') {
        this.state = State.IDLE;
        stats.tparsed = stats.tbuffered = performance.now();
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
          trackName,
          track;

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
      //trigger handler right now
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

      logger["b" /* logger */].log('Parsed ' + data.type + ',PTS:[' + data.startPTS.toFixed(3) + ',' + data.endPTS.toFixed(3) + '],DTS:[' + data.startDTS.toFixed(3) + '/' + data.endDTS.toFixed(3) + '],nb:' + data.nb + ',dropped:' + (data.dropped || 0));

      // Detect gaps in a fragment  and try to fix it by finding a keyframe in the previous fragment (see _findFragments)
      if (data.type === 'video') {
        frag.dropped = data.dropped;
        if (frag.dropped) {
          if (!frag.backtracked) {
            var levelDetails = level.details;
            if (levelDetails && frag.sn === levelDetails.startSN) {
              logger["b" /* logger */].warn('missing video frame(s) on first frag, appending with gap');
            } else {
              logger["b" /* logger */].warn('missing video frame(s), backtracking fragment');
              // Return back to the IDLE state without appending to buffer
              // Causes findFragments to backtrack a segment and find the keyframe
              // Audio fragments arriving before video sets the nextLoadPosition, causing _findFragments to skip the backtracked fragment
              frag.backtracked = true;
              this.nextLoadPosition = data.startPTS;
              this.state = State.IDLE;
              this.fragPrevious = frag;
              this.tick();
              return;
            }
          } else {
            logger["b" /* logger */].warn('Already backtracked on this fragment, appending with the gap');
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
      //trigger handler right now
      this.tick();
    }
  };

  StreamController.prototype.onFragParsed = function onFragParsed(data) {
    var fragCurrent = this.fragCurrent;
    var fragNew = data.frag;
    if (fragCurrent && data.id === 'main' && fragNew.sn === fragCurrent.sn && fragNew.level === fragCurrent.level && this.state === State.PARSING) {
      this.stats.tparsed = performance.now();
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
    //trigger handler right now
    if (this.state === State.PARSED && (!this.appended || !this.pendingBuffering)) {
      var frag = this.fragCurrent;
      if (frag) {
        var media = this.mediaBuffer ? this.mediaBuffer : this.media;
        logger["b" /* logger */].log('main buffered : ' + timeRanges.toString(media.buffered));
        // filter fragments potentially evicted from buffer. this is to avoid memleak on live streams
        var bufferedFrags = this._bufferedFrags.filter(function (frag) {
          return buffer_helper.isBuffered(media, (frag.startPTS + frag.endPTS) / 2);
        });
        // push new range
        bufferedFrags.push(frag);
        // sort frags, as we use BinarySearch for lookup in getBufferedFrag ...
        this._bufferedFrags = bufferedFrags.sort(function (a, b) {
          return a.startPTS - b.startPTS;
        });
        this.fragPrevious = frag;
        var stats = this.stats;
        stats.tbuffered = performance.now();
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
    var mediaBuffered = !!this.media && buffer_helper.isBuffered(this.media, this.media.currentTime) && buffer_helper.isBuffered(this.media, this.media.currentTime + 0.5);

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
            // reset load counter to avoid frag loop loading error
            frag.loadCounter = 0;
            logger["b" /* logger */].warn('mediaController: frag loading failed, retry in ' + delay + ' ms');
            this.retryDate = performance.now() + delay;
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
      case errors["a" /* ErrorDetails */].FRAG_LOOP_LOADING_ERROR:
        if (!data.fatal) {
          // if buffer is not empty
          if (mediaBuffered) {
            // try to reduce max buffer length : rationale is that we could get
            // frag loop loading error because of buffer eviction
            this._reduceMaxBufferLength(frag.duration);
            this.state = State.IDLE;
          } else {
            // buffer empty. report as fatal if in manual mode or if lowest level.
            // level controller takes care of emergency switch down logic
            if (!frag.autoLevel || frag.level === 0) {
              // switch error to fatal
              data.fatal = true;
              this.state = State.ERROR;
            }
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
      if (this.fragLoadIdx !== undefined) {
        // increase fragment load Index to avoid frag loop loading error after buffer flush
        this.fragLoadIdx += 2 * config.fragLoadingLoopThreshold;
      }
    }
  };

  StreamController.prototype._checkBuffer = function _checkBuffer() {
    var media = this.media,
        config = this.config;
    // if ready state different from HAVE_NOTHING (numeric value 0), we are allowed to seek
    if (media && media.readyState) {
      var currentTime = media.currentTime,
          mediaBuffer = this.mediaBuffer ? this.mediaBuffer : media,
          buffered = mediaBuffer.buffered;
      // adjust currentTime to start position on loaded metadata
      if (!this.loadedmetadata && buffered.length) {
        this.loadedmetadata = true;
        // only adjust currentTime if different from startPosition or if startPosition not buffered
        // at that stage, there should be only one buffered range, as we reach that code after first fragment has been buffered
        var startPosition = media.seeking ? currentTime : this.startPosition,
            startPositionBuffered = buffer_helper.isBuffered(mediaBuffer, startPosition),
            firstbufferedPosition = buffered.start(0),
            startNotBufferedButClose = !startPositionBuffered && Math.abs(startPosition - firstbufferedPosition) < config.maxSeekHole;
        // if currentTime not matching with expected startPosition or startPosition not buffered but close to first buffered
        if (currentTime !== startPosition || startNotBufferedButClose) {
          logger["b" /* logger */].log('target start position:' + startPosition);
          // if startPosition not buffered, let's seek to buffered.start(0)
          if (startNotBufferedButClose) {
            startPosition = firstbufferedPosition;
            logger["b" /* logger */].log('target start position not buffered, seek to buffered.start(0) ' + startPosition);
          }
          logger["b" /* logger */].log('adjust currentTime from ' + currentTime + ' to ' + startPosition);
          media.currentTime = startPosition;
        }
      } else if (this.immediateSwitch) {
        this.immediateLevelSwitchEnd();
      } else {
        var bufferInfo = buffer_helper.bufferInfo(media, currentTime, 0),
            expectedPlaying = !(media.paused || // not playing when media is paused
        media.ended || // not playing when media is ended
        media.buffered.length === 0),
            // not playing if nothing buffered
        jumpThreshold = 0.5,
            // tolerance needed as some browsers stalls playback before reaching buffered range end
        playheadMoving = currentTime !== this.lastCurrentTime;

        if (playheadMoving) {
          // played moving, but was previously stalled => now not stuck anymore
          if (this.stallReported) {
            logger["b" /* logger */].warn('playback not stuck anymore @' + currentTime + ', after ' + Math.round(performance.now() - this.stalled) + 'ms');
            this.stallReported = false;
          }
          this.stalled = undefined;
          this.nudgeRetry = 0;
        } else {
          // playhead not moving
          if (expectedPlaying) {
            // playhead not moving BUT media expected to play
            var tnow = performance.now();
            var hls = this.hls;
            if (!this.stalled) {
              // stall just detected, store current time
              this.stalled = tnow;
              this.stallReported = false;
            } else {
              // playback already stalled, check stalling duration
              // if stalling for more than a given threshold, let's try to recover
              var stalledDuration = tnow - this.stalled;
              var bufferLen = bufferInfo.len;
              var nudgeRetry = this.nudgeRetry || 0;
              // have we reached stall deadline ?
              if (bufferLen <= jumpThreshold && stalledDuration > config.lowBufferWatchdogPeriod * 1000) {
                // report stalled error once
                if (!this.stallReported) {
                  this.stallReported = true;
                  logger["b" /* logger */].warn('playback stalling in low buffer @' + currentTime);
                  hls.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].MEDIA_ERROR, details: errors["a" /* ErrorDetails */].BUFFER_STALLED_ERROR, fatal: false, buffer: bufferLen });
                }
                // if buffer len is below threshold, try to jump to start of next buffer range if close
                // no buffer available @ currentTime, check if next buffer is close (within a config.maxSeekHole second range)
                var nextBufferStart = bufferInfo.nextStart,
                    delta = nextBufferStart - currentTime;
                if (nextBufferStart && delta < config.maxSeekHole && delta > 0) {
                  this.nudgeRetry = ++nudgeRetry;
                  var nudgeOffset = nudgeRetry * config.nudgeOffset;
                  // next buffer is close ! adjust currentTime to nextBufferStart
                  // this will ensure effective video decoding
                  logger["b" /* logger */].log('adjust currentTime from ' + media.currentTime + ' to next buffered @ ' + nextBufferStart + ' + nudge ' + nudgeOffset);
                  media.currentTime = nextBufferStart + nudgeOffset;
                  // reset stalled so to rearm watchdog timer
                  this.stalled = undefined;
                  hls.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].MEDIA_ERROR, details: errors["a" /* ErrorDetails */].BUFFER_SEEK_OVER_HOLE, fatal: false, hole: nextBufferStart + nudgeOffset - currentTime });
                }
              } else if (bufferLen > jumpThreshold && stalledDuration > config.highBufferWatchdogPeriod * 1000) {
                // report stalled error once
                if (!this.stallReported) {
                  this.stallReported = true;
                  logger["b" /* logger */].warn('playback stalling in high buffer @' + currentTime);
                  hls.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].MEDIA_ERROR, details: errors["a" /* ErrorDetails */].BUFFER_STALLED_ERROR, fatal: false, buffer: bufferLen });
                }
                // reset stalled so to rearm watchdog timer
                this.stalled = undefined;
                this.nudgeRetry = ++nudgeRetry;
                if (nudgeRetry < config.nudgeMaxRetry) {
                  var _currentTime = media.currentTime;
                  var targetTime = _currentTime + nudgeRetry * config.nudgeOffset;
                  logger["b" /* logger */].log('adjust currentTime from ' + _currentTime + ' to ' + targetTime);
                  // playback stalled in buffered area ... let's nudge currentTime to try to overcome this
                  media.currentTime = targetTime;
                  hls.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].MEDIA_ERROR, details: errors["a" /* ErrorDetails */].BUFFER_NUDGE_ON_STALL, fatal: false });
                } else {
                  logger["b" /* logger */].error('still stuck in high buffer @' + currentTime + ' after ' + config.nudgeMaxRetry + ', raise fatal error');
                  hls.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].MEDIA_ERROR, details: errors["a" /* ErrorDetails */].BUFFER_STALLED_ERROR, fatal: true });
                }
              }
            }
          }
        }
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
    this._bufferedFrags = this._bufferedFrags.filter(function (frag) {
      return buffer_helper.isBuffered(media, (frag.startPTS + frag.endPTS) / 2);
    });

    if (this.fragLoadIdx !== undefined) {
      // increase fragment load Index to avoid frag loop loading error after buffer flush
      this.fragLoadIdx += 2 * this.config.fragLoadingLoopThreshold;
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
}(event_handler);

/* harmony default export */ var stream_controller = (stream_controller_StreamController);
// CONCATENATED MODULE: ./src/controller/level-controller.js
var level_controller__createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function level_controller__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function level_controller__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function level_controller__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * Level Controller
*/







var level_controller_LevelController = function (_EventHandler) {
  level_controller__inherits(LevelController, _EventHandler);

  function LevelController(hls) {
    level_controller__classCallCheck(this, LevelController);

    var _this = level_controller__possibleConstructorReturn(this, _EventHandler.call(this, hls, events["a" /* default */].MANIFEST_LOADED, events["a" /* default */].LEVEL_LOADED, events["a" /* default */].FRAG_LOADED, events["a" /* default */].ERROR));

    _this.canload = false;
    _this.currentLevelIndex = null;
    _this.manualLevelIndex = -1;
    _this.timer = null;
    return _this;
  }

  LevelController.prototype.destroy = function destroy() {
    this.cleanTimer();
    this.manualLevelIndex = -1;
  };

  LevelController.prototype.cleanTimer = function cleanTimer() {
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
      if (chromeOrFirefox === true && level.audioCodec && level.audioCodec.indexOf('mp4a.40.34') !== -1) {
        level.audioCodec = undefined;
      }

      levelFromSet = levelSet[level.bitrate];

      if (levelFromSet === undefined) {
        level.url = [level.url];
        level.urlId = 0;
        levelSet[level.bitrate] = level;
        levels.push(level);
      } else {
        levelFromSet.url.push(level.url);
      }
    });

    // remove audio-only level if we also have levels with audio+video codecs signalled
    if (videoCodecFound === true && audioCodecFound === true) {
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
        altAudio: audioTracks.length > 0
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
      this.cleanTimer();
      if (this.currentLevelIndex !== newLevel) {
        logger["b" /* logger */].log('switching to level ' + newLevel);
        this.currentLevelIndex = newLevel;
        var levelProperties = levels[newLevel];
        levelProperties.level = newLevel;
        // LEVEL_SWITCH to be deprecated in next major release
        hls.trigger(events["a" /* default */].LEVEL_SWITCH, levelProperties);
        hls.trigger(events["a" /* default */].LEVEL_SWITCHING, levelProperties);
      }
      var level = levels[newLevel],
          levelDetails = level.details;
      // check if we need to load playlist for this level
      if (!levelDetails || levelDetails.live === true) {
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
    if (data.fatal === true) {
      if (data.type === errors["b" /* ErrorTypes */].NETWORK_ERROR) {
        this.cleanTimer();
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
      case errors["a" /* ErrorDetails */].FRAG_LOOP_LOADING_ERROR:
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

    if (levelError === true) {
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
        this.cleanTimer();
        // switch error to fatal
        errorEvent.fatal = true;
        return;
      }
    }

    // Try any redundant streams if available for both errors: level and fragment
    // If level.loadError reaches redundantLevels it means that we tried them all, no hope  => let's switch down
    if (levelError === true || fragmentError === true) {
      redundantLevels = level.url.length;

      if (redundantLevels > 1 && level.loadError < redundantLevels) {
        logger["b" /* logger */].warn('level controller, ' + errorDetails + ' for level ' + levelIndex + ': switching to redundant stream id ' + level.urlId);
        level.urlId = (level.urlId + 1) % redundantLevels;
        level.details = undefined;
      } else {
        // Search for available level
        if (this.manualLevelIndex === -1) {
          // When lowest level has been reached, let's start hunt from the top
          nextLevel = levelIndex === 0 ? this._levels.length - 1 : levelIndex - 1;
          logger["b" /* logger */].warn('level controller, ' + errorDetails + ': switch to ' + nextLevel);
          this.hls.nextAutoLevel = this.currentLevelIndex = nextLevel;
        } else if (fragmentError === true) {
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
    if (levelId === this.currentLevelIndex) {
      var curLevel = this._levels[levelId];
      // reset level load error counter on successful level loaded only if there is no issues with fragments
      if (curLevel.fragmentError === false) {
        curLevel.loadError = 0;
        this.levelRetryCount = 0;
      }
      var newDetails = data.details;
      // if current playlist is a live playlist, arm a timer to reload it
      if (newDetails.live) {
        var reloadInterval = 1000 * (newDetails.averagetargetduration ? newDetails.averagetargetduration : newDetails.targetduration),
            curDetails = curLevel.details;
        if (curDetails && newDetails.endSN === curDetails.endSN) {
          // follow HLS Spec, If the client reloads a Playlist file and finds that it has not
          // changed then it MUST wait for a period of one-half the target
          // duration before retrying.
          reloadInterval /= 2;
          logger["b" /* logger */].log('same live playlist, reload twice faster');
        }
        // decrement reloadInterval with level loading delay
        reloadInterval -= performance.now() - data.stats.trequest;
        // in any case, don't reload more than every second
        reloadInterval = Math.max(1000, Math.round(reloadInterval));
        logger["b" /* logger */].log('live playlist, reload in ' + reloadInterval + ' ms');
        this.timer = setTimeout(function () {
          return _this3.loadLevel();
        }, reloadInterval);
      } else {
        this.cleanTimer();
      }
    }
  };

  LevelController.prototype.loadLevel = function loadLevel() {
    var level = void 0,
        urlIndex = void 0;

    if (this.currentLevelIndex !== null && this.canload === true) {
      level = this._levels[this.currentLevelIndex];
      if (level !== undefined && level.url.length > 0) {
        urlIndex = level.urlId;
        this.hls.trigger(events["a" /* default */].LEVEL_LOADING, { url: level.url[urlIndex], level: this.currentLevelIndex, id: urlIndex });
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
        if (this.currentLevelIndex !== newLevel || levels[newLevel].details === undefined) {
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
var id3 = __webpack_require__(3);

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
    if (!this.media) {
      return;
    }
  };

  ID3TrackController.prototype.onMediaDetaching = function onMediaDetaching() {
    this.media = undefined;
  };

  ID3TrackController.prototype.onFragParsingMetadata = function onFragParsingMetadata(data) {
    var fragment = data.frag;
    var samples = data.samples;

    // create track dynamically
    if (!this.id3Track) {
      this.id3Track = this.media.addTextTrack('metadata', 'id3');
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
// CONCATENATED MODULE: ./src/helper/is-supported.js


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

    //console.log('instant bw:'+ Math.round(bandwidth));
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
      //console.log('slow estimate:'+ Math.round(this.slow_.getEstimate()));
      //console.log('fast estimate:'+ Math.round(this.fast_.getEstimate()));
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
        this.timer = setInterval(this.onCheck, 100);
      }
      // lazy init of bw Estimator, rationale is that we use different params for Live/VoD
      // so we need to wait for stream manifest / playlist type to instantiate it.
      if (!this._bwEstimator) {
        var hls = this.hls,
            level = data.frag.level,
            isLive = hls.levels[level].details.live,
            config = hls.config,
            ewmaFast = void 0,
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
      this.fragCurrent = frag;
    }
  };

  AbrController.prototype._abandonRulesCheck = function _abandonRulesCheck() {
    /*
      monitor fragment retrieval time...
      we compute expected time of arrival of the complete fragment.
      we compare it to expected time of buffer starvation
    */
    var hls = this.hls,
        v = hls.media,
        frag = this.fragCurrent,
        loader = frag.loader,
        minAutoLevel = hls.minAutoLevel;

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
    if (v && stats && (!v.paused && v.playbackRate !== 0 || !v.readyState) && frag.autoLevel && frag.level) {
      var requestDelay = performance.now() - stats.trequest,
          playbackRate = Math.abs(v.playbackRate);
      // monitor fragment load progress after half of expected fragment duration,to stabilize bitrate
      if (requestDelay > 500 * frag.duration / playbackRate) {
        var levels = hls.levels,
            loadRate = Math.max(1, stats.bw ? stats.bw / 8 : stats.loaded * 1000 / requestDelay),
            // byte/s; at least 1 byte/s to avoid division by zero
        // compute expected fragment length using frag duration and level bitrate. also ensure that expected len is gte than already loaded size
        level = levels[frag.level],
            levelBitrate = level.realBitrate ? Math.max(level.realBitrate, level.bitrate) : level.bitrate,
            expectedLen = stats.total ? stats.total : Math.max(stats.loaded, Math.round(frag.duration * levelBitrate / 8)),
            pos = v.currentTime,
            fragLoadedDelay = (expectedLen - stats.loaded) / loadRate,
            bufferStarvationDelay = (buffer_helper.bufferInfo(v, pos, hls.config.maxBufferHole).end - pos) / playbackRate;
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
            //abort fragment loading
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
    var stats = data.stats,
        frag = data.frag;
    // only update stats on first frag buffering
    // if same frag is loaded multiple times, it might be in browser cache, and loaded quickly
    // and leading to wrong bw estimation
    // on bitrate test, also only update stats once (if tload = tbuffered == on FRAG_LOADED)
    if (stats.aborted !== true && frag.loadCounter === 1 && frag.type === 'main' && !isNaN(frag.sn) && (!frag.bitrateTest || stats.tload === stats.tbuffered)) {
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
      var v = hls.media,
          currentLevel = this.lastLoadedFragLevel,
          currentFragDuration = this.fragCurrent ? this.fragCurrent.duration : 0,
          pos = v ? v.currentTime : 0,

      // playbackRate is the absolute value of the playback rate; if v.playbackRate is 0, we use 1 to load as
      // if we're playing back at the normal rate.
      playbackRate = v && v.playbackRate !== 0 ? Math.abs(v.playbackRate) : 1.0,
          avgbw = this._bwEstimator ? this._bwEstimator.getEstimate() : config.abrEwmaDefaultEstimate,

      // bufferStarvationDelay is the wall-clock time left until the playback buffer is exhausted.
      bufferStarvationDelay = (buffer_helper.bufferInfo(v, pos, config.maxBufferHole).end - pos) / playbackRate;

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
        videoExpected = data.video || data.levels.length && data.audio,
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
      //Media Source listeners
      this.onmso = this.onMediaSourceOpen.bind(this);
      this.onmse = this.onMediaSourceEnded.bind(this);
      this.onmsc = this.onMediaSourceClose.bind(this);
      ms.addEventListener('sourceopen', this.onmso);
      ms.addEventListener('sourceended', this.onmse);
      ms.addEventListener('sourceclose', this.onmsc);
      // link video and media Source
      media.src = URL.createObjectURL(ms);
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
        URL.revokeObjectURL(this._objectUrl);

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
    this.hls.trigger(events["a" /* default */].BUFFER_APPENDED, { parent: parent, pending: pending });

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
      }
      var mediaSource = this.mediaSource;
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
    //Notify the media element that it now has all of the media data
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
        //logger.log(`sb appending in progress`);
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
              //logger.log(`appending ${segment.content} ${type} SB, size:${segment.data.length}, ${segment.parent}`);
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
              return;
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
            return;
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
    var sb,
        i,
        bufStart,
        bufEnd,
        flushStart,
        flushEnd,
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
            //logger.log('abort ' + type + ' append in progress');
            // this will abort any appending in progress
            //sb.abort();
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

    return cap_level_controller__possibleConstructorReturn(this, _EventHandler.call(this, hls, events["a" /* default */].FPS_DROP_LEVEL_CAPPING, events["a" /* default */].MEDIA_ATTACHING, events["a" /* default */].MANIFEST_PARSED));
  }

  CapLevelController.prototype.destroy = function destroy() {
    if (this.hls.config.capLevelToPlayerSize) {
      this.media = this.restrictedLevels = null;
      this.autoLevelCapping = Number.POSITIVE_INFINITY;
      if (this.timer) {
        this.timer = clearInterval(this.timer);
      }
    }
  };

  CapLevelController.prototype.onFpsDropLevelCapping = function onFpsDropLevelCapping(data) {
    // Don't add a restricted level more than once
    if (CapLevelController.isLevelAllowed(data.droppedLevel, this.restrictedLevels)) {
      this.restrictedLevels.push(data.droppedLevel);
    }
  };

  CapLevelController.prototype.onMediaAttaching = function onMediaAttaching(data) {
    this.media = data.media instanceof HTMLVideoElement ? data.media : null;
  };

  CapLevelController.prototype.onManifestParsed = function onManifestParsed(data) {
    var hls = this.hls;
    this.restrictedLevels = [];
    if (hls.config.capLevelToPlayerSize) {
      this.autoLevelCapping = Number.POSITIVE_INFINITY;
      this.levels = data.levels;
      hls.firstLevel = this.getMaxLevel(data.firstLevel);
      clearInterval(this.timer);
      this.timer = setInterval(this.detectPlayerSize.bind(this), 1000);
      this.detectPlayerSize();
    }
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
      var video = this.video = data.media instanceof HTMLVideoElement ? data.media : null;
      if (typeof video.getVideoPlaybackQuality === 'function') {
        this.isVideoPlaybackQualityAvailable = true;
      }
      clearInterval(this.timer);
      this.timer = setInterval(this.checkFPSInterval.bind(this), config.fpsDroppedMonitoringPeriod);
    }
  };

  FPSController.prototype.checkFPS = function checkFPS(video, decodedFrames, droppedFrames) {
    var currentTime = performance.now();
    if (decodedFrames) {
      if (this.lastTime) {
        var currentPeriod = currentTime - this.lastTime,
            currentDropped = droppedFrames - this.lastDroppedFrames,
            currentDecoded = decodedFrames - this.lastDecodedFrames,
            droppedFPS = 1000 * currentDropped / currentPeriod,
            hls = this.hls;
        hls.trigger(events["a" /* default */].FPS_DROP, { currentDropped: currentDropped, currentDecoded: currentDecoded, totalDroppedFrames: droppedFrames });
        if (droppedFPS > 0) {
          //logger.log('checkFPS : droppedFPS/decodedFPS:' + droppedFPS/(1000 * currentDecoded / currentPeriod));
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
    this.stats = { trequest: performance.now(), retry: 0 };
    this.retryDelay = config.retryDelay;
    this.loadInternal();
  };

  XhrLoader.prototype.loadInternal = function loadInternal() {
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

/*
 * audio track controller
*/






var audio_track_controller_AudioTrackController = function (_EventHandler) {
  audio_track_controller__inherits(AudioTrackController, _EventHandler);

  function AudioTrackController(hls) {
    audio_track_controller__classCallCheck(this, AudioTrackController);

    var _this = audio_track_controller__possibleConstructorReturn(this, _EventHandler.call(this, hls, events["a" /* default */].MANIFEST_LOADING, events["a" /* default */].MANIFEST_PARSED, events["a" /* default */].AUDIO_TRACK_LOADED, events["a" /* default */].ERROR));

    _this.ticks = 0;
    _this.ontick = _this.tick.bind(_this);
    return _this;
  }

  AudioTrackController.prototype.destroy = function destroy() {
    this.cleanTimer();
    event_handler.prototype.destroy.call(this);
  };

  AudioTrackController.prototype.cleanTimer = function cleanTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  };

  AudioTrackController.prototype.tick = function tick() {
    this.ticks++;
    if (this.ticks === 1) {
      this.doTick();
      if (this.ticks > 1) {
        setTimeout(this.tick, 1);
      }
      this.ticks = 0;
    }
  };

  AudioTrackController.prototype.doTick = function doTick() {
    this.updateTrack(this.trackId);
  };

  AudioTrackController.prototype.onError = function onError(data) {
    if (data.fatal && data.type === errors["b" /* ErrorTypes */].NETWORK_ERROR) {
      this.cleanTimer();
    }
  };

  AudioTrackController.prototype.onManifestLoading = function onManifestLoading() {
    // reset audio tracks on manifest loading
    this.tracks = [];
    this.trackId = -1;
  };

  AudioTrackController.prototype.onManifestParsed = function onManifestParsed(data) {
    var _this2 = this;

    var tracks = data.audioTracks || [];
    var defaultFound = false;
    this.tracks = tracks;
    this.hls.trigger(events["a" /* default */].AUDIO_TRACKS_UPDATED, { audioTracks: tracks });
    // loop through available audio tracks and autoselect default if needed
    var id = 0;
    tracks.forEach(function (track) {
      if (track.default && !defaultFound) {
        _this2.audioTrack = id;
        defaultFound = true;
        return;
      }
      id++;
    });
    if (defaultFound === false && tracks.length) {
      logger["b" /* logger */].log('no default audio track defined, use first audio track as default');
      this.audioTrack = 0;
    }
  };

  AudioTrackController.prototype.onAudioTrackLoaded = function onAudioTrackLoaded(data) {
    if (data.id < this.tracks.length) {
      logger["b" /* logger */].log('audioTrack ' + data.id + ' loaded');
      this.tracks[data.id].details = data.details;
      // check if current playlist is a live playlist
      if (data.details.live && !this.timer) {
        // if live playlist we will have to reload it periodically
        // set reload period to playlist target duration
        this.timer = setInterval(this.ontick, 1000 * data.details.targetduration);
      }
      if (!data.details.live && this.timer) {
        // playlist is not live and timer is armed : stopping it
        this.cleanTimer();
      }
    }
  };

  /** get alternate audio tracks list from playlist **/


  AudioTrackController.prototype.setAudioTrackInternal = function setAudioTrackInternal(newId) {
    // check if level idx is valid
    if (newId >= 0 && newId < this.tracks.length) {
      // stopping live reloading timer if any
      this.cleanTimer();
      this.trackId = newId;
      logger["b" /* logger */].log('switching to audioTrack ' + newId);
      var audioTrack = this.tracks[newId],
          hls = this.hls,
          type = audioTrack.type,
          url = audioTrack.url,
          eventObj = { id: newId, type: type, url: url };
      // keep AUDIO_TRACK_SWITCH for legacy reason
      hls.trigger(events["a" /* default */].AUDIO_TRACK_SWITCH, eventObj);
      hls.trigger(events["a" /* default */].AUDIO_TRACK_SWITCHING, eventObj);
      // check if we need to load playlist for this audio Track
      var details = audioTrack.details;
      if (url && (details === undefined || details.live === true)) {
        // track not retrieved yet, or live playlist we need to (re)load it
        logger["b" /* logger */].log('(re)loading playlist for audioTrack ' + newId);
        hls.trigger(events["a" /* default */].AUDIO_TRACK_LOADING, { url: url, id: newId });
      }
    }
  };

  AudioTrackController.prototype.updateTrack = function updateTrack(newId) {
    // check if level idx is valid
    if (newId >= 0 && newId < this.tracks.length) {
      // stopping live reloading timer if any
      this.cleanTimer();
      this.trackId = newId;
      logger["b" /* logger */].log('updating audioTrack ' + newId);
      var audioTrack = this.tracks[newId],
          url = audioTrack.url;
      // check if we need to load playlist for this audio Track
      var details = audioTrack.details;
      if (url && (details === undefined || details.live === true)) {
        // track not retrieved yet, or live playlist we need to (re)load it
        logger["b" /* logger */].log('(re)loading playlist for audioTrack ' + newId);
        this.hls.trigger(events["a" /* default */].AUDIO_TRACK_LOADING, { url: url, id: newId });
      }
    }
  };

  audio_track_controller__createClass(AudioTrackController, [{
    key: 'audioTracks',
    get: function get() {
      return this.tracks;
    }

    /** get index of the selected audio track (index in audio track lists) **/

  }, {
    key: 'audioTrack',
    get: function get() {
      return this.trackId;
    }

    /** select an audio track, based on its index in audio track lists**/
    ,
    set: function set(audioTrackId) {
      if (this.trackId !== audioTrackId || this.tracks[audioTrackId].details === undefined) {
        this.setAudioTrackInternal(audioTrackId);
      }
    }
  }]);

  return AudioTrackController;
}(event_handler);

/* harmony default export */ var audio_track_controller = (audio_track_controller_AudioTrackController);
// CONCATENATED MODULE: ./src/controller/audio-stream-controller.js
var audio_stream_controller__createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function audio_stream_controller__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function audio_stream_controller__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function audio_stream_controller__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * Audio Stream Controller
*/











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

var audio_stream_controller_AudioStreamController = function (_EventHandler) {
  audio_stream_controller__inherits(AudioStreamController, _EventHandler);

  function AudioStreamController(hls) {
    audio_stream_controller__classCallCheck(this, AudioStreamController);

    var _this = audio_stream_controller__possibleConstructorReturn(this, _EventHandler.call(this, hls, events["a" /* default */].MEDIA_ATTACHED, events["a" /* default */].MEDIA_DETACHING, events["a" /* default */].AUDIO_TRACKS_UPDATED, events["a" /* default */].AUDIO_TRACK_SWITCHING, events["a" /* default */].AUDIO_TRACK_LOADED, events["a" /* default */].KEY_LOADED, events["a" /* default */].FRAG_LOADED, events["a" /* default */].FRAG_PARSING_INIT_SEGMENT, events["a" /* default */].FRAG_PARSING_DATA, events["a" /* default */].FRAG_PARSED, events["a" /* default */].ERROR, events["a" /* default */].BUFFER_RESET, events["a" /* default */].BUFFER_CREATED, events["a" /* default */].BUFFER_APPENDED, events["a" /* default */].BUFFER_FLUSHED, events["a" /* default */].INIT_PTS_FOUND));

    _this.config = hls.config;
    _this.audioCodecSwap = false;
    _this.ticks = 0;
    _this._state = audio_stream_controller_State.STOPPED;
    _this.ontick = _this.tick.bind(_this);
    _this.initPTS = [];
    _this.waitingFragment = null;
    _this.videoTrackCC = null;
    return _this;
  }

  AudioStreamController.prototype.destroy = function destroy() {
    this.stopLoad();
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    event_handler.prototype.destroy.call(this);
    this.state = audio_stream_controller_State.STOPPED;
  };

  //Signal that video PTS was found


  AudioStreamController.prototype.onInitPtsFound = function onInitPtsFound(data) {
    var demuxerId = data.id,
        cc = data.frag.cc,
        initPTS = data.initPTS;
    if (demuxerId === 'main') {
      //Always update the new INIT PTS
      //Can change due level switch
      this.initPTS[cc] = initPTS;
      this.videoTrackCC = cc;
      logger["b" /* logger */].log('InitPTS for cc:' + cc + ' found from video track:' + initPTS);

      //If we are waiting we need to demux/remux the waiting frag
      //With the new initPTS
      if (this.state === audio_stream_controller_State.WAITING_INIT_PTS) {
        this.tick();
      }
    }
  };

  AudioStreamController.prototype.startLoad = function startLoad(startPosition) {
    if (this.tracks) {
      var lastCurrentTime = this.lastCurrentTime;
      this.stopLoad();
      if (!this.timer) {
        this.timer = setInterval(this.ontick, 100);
      }
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
      this.fragCurrent = null;
    }
    this.fragPrevious = null;
    if (this.demuxer) {
      this.demuxer.destroy();
      this.demuxer = null;
    }
    this.state = audio_stream_controller_State.STOPPED;
  };

  AudioStreamController.prototype.tick = function tick() {
    this.ticks++;
    if (this.ticks === 1) {
      this.doTick();
      if (this.ticks > 1) {
        setTimeout(this.tick, 1);
      }
      this.ticks = 0;
    }
  };

  AudioStreamController.prototype.doTick = function doTick() {
    var pos,
        track,
        trackDetails,
        hls = this.hls,
        config = hls.config;
    //logger.log('audioStream:' + this.state);
    switch (this.state) {
      case audio_stream_controller_State.ERROR:
      //don't do anything in error state to avoid breaking further ...
      case audio_stream_controller_State.PAUSED:
      //don't do anything in paused state either ...
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
            bufferInfo = buffer_helper.bufferInfo(media, pos, config.maxBufferHole),
            mainBufferInfo = buffer_helper.bufferInfo(videoBuffer, pos, config.maxBufferHole),
            bufferLen = bufferInfo.len,
            bufferEnd = bufferInfo.end,
            fragPrevious = this.fragPrevious,

        // ensure we buffer at least config.maxBufferLength (default 30s)
        // once we reach that threshold, don't buffer more than video (mainBufferInfo.len)
        maxBufLen = Math.max(config.maxBufferLength, mainBufferInfo.len),
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
          }
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
                //logger.log(`level/sn/start/end/bufEnd:${level}/${candidate.sn}/${candidate.start}/${(candidate.start+candidate.duration)}/${bufferEnd}`);
                // Set the lookup tolerance to be small enough to detect the current segment - ensures we don't skip over very small segments
                var candidateLookupTolerance = Math.min(maxFragLookUpTolerance, candidate.duration);
                if (candidate.start + candidate.duration - candidateLookupTolerance <= bufferEnd) {
                  return 1;
                } // if maxFragLookUpTolerance will have negative value then don't return -1 for first element
                else if (candidate.start - candidateLookupTolerance > bufferEnd && candidate.start) {
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
                //logger.log('find SN matching with pos:' +  bufferEnd + ':' + frag.sn);
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
            //logger.log('      loading frag ' + i +',pos/bufEnd:' + pos.toFixed(3) + '/' + bufferEnd.toFixed(3));
            if (frag.decryptdata && frag.decryptdata.uri != null && frag.decryptdata.key == null) {
              logger["b" /* logger */].log('Loading key for ' + frag.sn + ' of [' + trackDetails.startSN + ' ,' + trackDetails.endSN + '],track ' + trackId);
              this.state = audio_stream_controller_State.KEY_LOADING;
              hls.trigger(events["a" /* default */].KEY_LOADING, { frag: frag });
            } else {
              logger["b" /* logger */].log('Loading ' + frag.sn + ', cc: ' + frag.cc + ' of [' + trackDetails.startSN + ' ,' + trackDetails.endSN + '],track ' + trackId + ', currentTime:' + pos + ',bufferEnd:' + bufferEnd.toFixed(3));
              // ensure that we are not reloading the same fragments in loop ...
              if (this.fragLoadIdx !== undefined) {
                this.fragLoadIdx++;
              } else {
                this.fragLoadIdx = 0;
              }
              if (frag.loadCounter) {
                frag.loadCounter++;
                var maxThreshold = config.fragLoadingLoopThreshold;
                // if this frag has already been loaded 3 times, and if it has been reloaded recently
                if (frag.loadCounter > maxThreshold && Math.abs(this.fragLoadIdx - frag.loadIdx) < maxThreshold) {
                  hls.trigger(events["a" /* default */].ERROR, { type: errors["b" /* ErrorTypes */].MEDIA_ERROR, details: errors["a" /* ErrorDetails */].FRAG_LOOP_LOADING_ERROR, fatal: false, frag: frag });
                  return;
                }
              } else {
                frag.loadCounter = 1;
              }
              frag.loadIdx = this.fragLoadIdx;
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
        break;
      case audio_stream_controller_State.WAITING_TRACK:
        track = this.tracks[this.trackId];
        // check if playlist is already loaded
        if (track && track.details) {
          this.state = audio_stream_controller_State.IDLE;
        }
        break;
      case audio_stream_controller_State.FRAG_LOADING_WAITING_RETRY:
        var now = performance.now();
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

    // reset fragment loading counter on MSE detaching to avoid reporting FRAG_LOOP_LOADING_ERROR after error recovery
    var tracks = this.tracks;
    if (tracks) {
      // reset fragment load counter
      tracks.forEach(function (track) {
        if (track.details) {
          track.details.fragments.forEach(function (fragment) {
            fragment.loadCounter = undefined;
          });
        }
      });
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
    // avoid reporting fragment loop loading error in case user is seeking several times on same position
    if (this.fragLoadIdx !== undefined) {
      this.fragLoadIdx += 2 * this.config.fragLoadingLoopThreshold;
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
      if (!this.timer) {
        this.timer = setInterval(this.ontick, 100);
      }
    }

    //should we switch tracks ?
    if (altAudio) {
      this.audioSwitch = true;
      //main audio track are handled by stream-controller, just do something if switching to alt audio track
      this.state = audio_stream_controller_State.IDLE;
      // increase fragment load Index to avoid frag loop loading error after buffer flush
      if (this.fragLoadIdx !== undefined) {
        this.fragLoadIdx += 2 * this.config.fragLoadingLoopThreshold;
      }
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
        //this.liveSyncPosition = this.computeLivePosition(sliding, curDetails);
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
    //trigger handler right now
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

        stats.tparsed = stats.tbuffered = performance.now();
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
        //Check if we have video initPTS
        // If not we need to wait for it
        var initPTS = this.initPTS[cc];
        var initSegmentData = details.initSegment ? details.initSegment.data : [];
        if (details.initSegment || initPTS !== undefined) {
          this.pendingBuffering = true;
          logger["b" /* logger */].log('Demuxing ' + sn + ' of [' + details.startSN + ' ,' + details.endSN + '],track ' + trackId);
          // time Offset is accurate if level PTS is known, or if playlist is not sliding (not live)
          var accurateTimeOffset = false; //details.PTSKnown || !details.live;
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
        //trigger handler right now
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

      logger["b" /* logger */].log('parsed ' + data.type + ',PTS:[' + data.startPTS.toFixed(3) + ',' + data.endPTS.toFixed(3) + '],DTS:[' + data.startDTS.toFixed(3) + '/' + data.endDTS.toFixed(3) + '],nb:' + data.nb);
      updateFragPTSDTS(track.details, fragCurrent, data.startPTS, data.endPTS);

      var audioSwitch = this.audioSwitch,
          media = this.media,
          appendOnBufferFlush = false;
      //Only flush audio from old audio tracks when PTS is known on new audio track
      if (audioSwitch && media) {
        if (media.readyState) {
          var currentTime = media.currentTime;
          logger["b" /* logger */].log('switching audio track : currentTime:' + currentTime);
          if (currentTime >= data.startPTS) {
            logger["b" /* logger */].log('switching audio track : flushing all audio');
            this.state = audio_stream_controller_State.BUFFER_FLUSHING;
            hls.trigger(events["a" /* default */].BUFFER_FLUSHING, { startOffset: 0, endOffset: Number.POSITIVE_INFINITY, type: 'audio' });
            appendOnBufferFlush = true;
            //Lets announce that the initial audio track switch flush occur
            this.audioSwitch = false;
            hls.trigger(events["a" /* default */].AUDIO_TRACK_SWITCHED, { id: trackId });
          }
        } else {
          //Lets announce that the initial audio track switch flush occur
          this.audioSwitch = false;
          hls.trigger(events["a" /* default */].AUDIO_TRACK_SWITCHED, { id: trackId });
        }
      }

      var pendingData = this.pendingData;
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
      //trigger handler right now
      this.tick();
    }
  };

  AudioStreamController.prototype.onFragParsed = function onFragParsed(data) {
    var fragCurrent = this.fragCurrent;
    var fragNew = data.frag;
    if (fragCurrent && data.id === 'audio' && fragNew.sn === fragCurrent.sn && fragNew.level === fragCurrent.level && this.state === audio_stream_controller_State.PARSING) {
      this.stats.tparsed = performance.now();
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
    //trigger handler right now
    if (this.state === audio_stream_controller_State.PARSED && (!this.appended || !this.pendingBuffering)) {
      var frag = this.fragCurrent,
          stats = this.stats,
          hls = this.hls;
      if (frag) {
        this.fragPrevious = frag;
        stats.tbuffered = performance.now();
        hls.trigger(events["a" /* default */].FRAG_BUFFERED, { stats: stats, frag: frag, id: 'audio' });
        var media = this.mediaBuffer ? this.mediaBuffer : this.media;
        logger["b" /* logger */].log('audio buffered : ' + timeRanges.toString(media.buffered));
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
            // reset load counter to avoid frag loop loading error
            frag.loadCounter = 0;
            // exponential backoff capped to config.fragLoadingMaxRetryTimeout
            var delay = Math.min(Math.pow(2, loadError - 1) * config.fragLoadingRetryDelay, config.fragLoadingMaxRetryTimeout);
            logger["b" /* logger */].warn('audioStreamController: frag loading failed, retry in ' + delay + ' ms');
            this.retryDate = performance.now() + delay;
            // retry loading state
            this.state = audio_stream_controller_State.FRAG_LOADING_WAITING_RETRY;
          } else {
            logger["b" /* logger */].error('audioStreamController: ' + data.details + ' reaches max retry, redispatch as fatal ...');
            // switch error to fatal
            data.fatal = true;
            this.state = audio_stream_controller_State.ERROR;
          }
        }
        break;
      case errors["a" /* ErrorDetails */].FRAG_LOOP_LOADING_ERROR:
      case errors["a" /* ErrorDetails */].AUDIO_TRACK_LOAD_ERROR:
      case errors["a" /* ErrorDetails */].AUDIO_TRACK_LOAD_TIMEOUT:
      case errors["a" /* ErrorDetails */].KEY_LOAD_ERROR:
      case errors["a" /* ErrorDetails */].KEY_LOAD_TIMEOUT:
        //  when in ERROR state, don't switch back to IDLE state in case a non-fatal error is received
        if (this.state !== audio_stream_controller_State.ERROR) {
          // if fatal error, stop processing, otherwise move to IDLE to retry loading
          this.state = data.fatal ? audio_stream_controller_State.ERROR : audio_stream_controller_State.IDLE;
          logger["b" /* logger */].warn('audioStreamController: ' + data.details + ' while loading frag,switch to ' + this.state + ' state ...');
        }
        break;
      case errors["a" /* ErrorDetails */].BUFFER_FULL_ERROR:
        // if in appending state
        if (data.parent === 'audio' && (this.state === audio_stream_controller_State.PARSING || this.state === audio_stream_controller_State.PARSED)) {
          var media = this.mediaBuffer,
              currentTime = this.media.currentTime,
              mediaBuffered = media && buffer_helper.isBuffered(media, currentTime) && buffer_helper.isBuffered(media, currentTime + 0.5);
          // reduce max buf len if current position is buffered
          if (mediaBuffered) {
            var _config = this.config;
            if (_config.maxMaxBufferLength >= _config.maxBufferLength) {
              // reduce max buffer length as it might be too high. we do this to avoid loop flushing ...
              _config.maxMaxBufferLength /= 2;
              logger["b" /* logger */].warn('audio:reduce max buffer length to ' + _config.maxMaxBufferLength + 's');
              // increase fragment load Index to avoid frag loop loading error after buffer flush
              this.fragLoadIdx += 2 * _config.fragLoadingLoopThreshold;
            }
            this.state = audio_stream_controller_State.IDLE;
          } else {
            // current position is not buffered, but browser is still complaining about buffer full error
            // this happens on IE/Edge, refer to https://github.com/video-dev/hls.js/pull/708
            // in that case flush the whole audio buffer to recover
            logger["b" /* logger */].warn('buffer full error also media.currentTime is not buffered, flush audio buffer');
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
      logger["b" /* logger */].log('appending pending audio data on Buffer Flushed');
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
}(event_handler);

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
    var m;
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
            console.log('parse region', v);
            //parseRegion(v);
            break;
        }
      }, /:/);
    }

    // 5.1 WebVTT file parsing.
    try {
      var line;
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
          /*falls through*/
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
  var row;
  var cue;
  var indenting;
  var indent;
  var text;
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
      //To be used for cleaning-up orphaned roll-up captions
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
            console.log(this.time + ' [' + severity + '] ' + msg);
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
            //Extended char
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
        var i;
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
            this.rows.push(new Row()); // Note that we use zero-based numbering (0-14)
        }
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

        //Make sure this only affects Roll-up Captions by checking this.nrRollUpRows
        if (this.nrRollUpRows && this.currRow !== newRow) {
            //clear all rows first
            for (var i = 0; i < NR_ROWS; i++) {
                this.rows[i].clear();
            }

            //Copy this.nrRollUpRows rows from lastOutputScreen and place it in the newRow location
            //topRowIndex - the start of rows to copy (inclusive index)
            var topRowIndex = this.currRow + 1 - this.nrRollUpRows;
            //We only copy if the last position was already shown.
            //We use the cueStartTime value to check this.
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
        this.insertChar(0x20); //Space
    };

    CaptionScreen.prototype.setRollUpRows = function setRollUpRows(nrRows) {
        this.nrRollUpRows = nrRows;
    };

    CaptionScreen.prototype.rollUp = function rollUp() {
        if (this.nrRollUpRows === null) {
            cea_608_parser_logger.log('DEBUG', 'roll_up but nrRollUpRows not set yet');
            return; //Not properly setup
        }
        cea_608_parser_logger.log('TEXT', this.getDisplayText());
        var topRowIndex = this.currRow + 1 - this.nrRollUpRows;
        var topRow = this.rows.splice(topRowIndex, 1)[0];
        topRow.clear();
        this.rows.splice(this.currRow, 0, topRow);
        cea_608_parser_logger.log('INFO', 'Rolling up');
        //logger.log('TEXT', this.get_display_text())
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

//var modes = ['MODE_ROLL-UP', 'MODE_POP-ON', 'MODE_PAINT-ON', 'MODE_TEXT'];

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

    Cea608Channel.prototype.ccAOF = function ccAOF() {
        // Reserved (formerly Alarm Off)
        return;
    };

    Cea608Channel.prototype.ccAON = function ccAON() {
        // Reserved (formerly Alarm On)
        return;
    };

    Cea608Channel.prototype.ccDER = function ccDER() {
        // Delete to End of Row
        cea_608_parser_logger.log('INFO', 'DER- Delete to End of Row');
        this.writeScreen.clearToEndOfRow();
        this.outputDataUpdate();
    };

    Cea608Channel.prototype.ccRU = function ccRU(nrRows) {
        //Roll-Up Captions-2,3,or 4 Rows
        cea_608_parser_logger.log('INFO', 'RU(' + nrRows + ') - Roll Up');
        this.writeScreen = this.displayedMemory;
        this.setMode('MODE_ROLL-UP');
        this.writeScreen.setRollUpRows(nrRows);
    };

    Cea608Channel.prototype.ccFON = function ccFON() {
        //Flash On
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
        //Erase Non-Displayed Memory
        cea_608_parser_logger.log('INFO', 'ENM - Erase Non-displayed Memory');
        this.nonDisplayedMemory.reset();
    };

    Cea608Channel.prototype.ccEOC = function ccEOC() {
        //End of Caption (Flip Memories)
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
        var cmdFound,
            a,
            b,
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

        var cond1 = (a === 0x14 || a === 0x1C) && 0x20 <= b && b <= 0x2F;
        var cond2 = (a === 0x17 || a === 0x1F) && 0x21 <= b && b <= 0x23;
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
            chNr = 2; // (a === 0x1C || a=== 0x1f)
        }

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
            //a == 0x17 || a == 0x1F
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

        if ((a === 0x11 || a === 0x19) && 0x20 <= b && b <= 0x2f) {
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

        var case1 = (0x11 <= a && a <= 0x17 || 0x19 <= a && a <= 0x1F) && 0x40 <= b && b <= 0x7F;
        var case2 = (a === 0x10 || a === 0x18) && 0x40 <= b && b <= 0x5F;
        if (!(case1 || case2)) {
            return false;
        }

        if (a === this.lastCmdA && b === this.lastCmdB) {
            this.lastCmdA = null;
            this.lastCmdB = null;
            return true; // Repeated commands are dropped (once)
        }

        chNr = a <= 0x17 ? 1 : 2;

        if (0x40 <= b && b <= 0x5F) {
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
        if (0x11 <= charCode1 && charCode1 <= 0x13) {
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
        } else if (0x20 <= a && a <= 0x7f) {
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
        var bkgData, index, chNr, channel;

        var case1 = (a === 0x10 || a === 0x18) && 0x20 <= b && b <= 0x2f;
        var case2 = (a === 0x17 || a === 0x1f) && 0x2d <= b && b <= 0x2f;
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
  function OutputFilter(timelineController, track) {
    output_filter__classCallCheck(this, OutputFilter);

    this.timelineController = timelineController;
    this.track = track;
    this.startTime = null;
    this.endTime = null;
    this.screen = null;
  }

  OutputFilter.prototype.dispatchCue = function dispatchCue() {
    if (this.startTime === null) {
      return;
    }
    this.timelineController.addCues('textTrack' + this.track, this.startTime, this.endTime, this.screen);
    this.startTime = null;
  };

  OutputFilter.prototype.newCue = function newCue(startTime, endTime, screen) {
    if (this.startTime === null || this.startTime > startTime) {
      this.startTime = startTime;
    }
    this.endTime = endTime;
    this.screen = screen;
    this.timelineController.createCaptionsTrack(this.track);
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








function clearCurrentCues(track) {
  if (track && track.cues) {
    while (track.cues.length > 0) {
      track.removeCue(track.cues[0]);
    }
  }
}

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

    if (_this.config.enableCEA708Captions) {
      var channel1 = new output_filter(_this, 1);
      var channel2 = new output_filter(_this, 2);

      _this.cea608Parser = new cea_608_parser(0, channel1, channel2);
    }
    return _this;
  }

  TimelineController.prototype.addCues = function addCues(channel, startTime, endTime, screen) {
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
    this.Cues.newCue(this[channel], startTime, endTime, screen);
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

  TimelineController.prototype.getExistingTrack = function getExistingTrack(channelNumber) {
    var media = this.media;
    if (media) {
      for (var i = 0; i < media.textTracks.length; i++) {
        var textTrack = media.textTracks[i];
        var propName = 'textTrack' + channelNumber;
        if (textTrack[propName] === true) {
          return textTrack;
        }
      }
    }
    return null;
  };

  TimelineController.prototype.sendAddTrackEvent = function sendAddTrackEvent(track, media) {
    var e = null;
    try {
      e = new window.Event('addtrack');
    } catch (err) {
      //for IE11
      e = document.createEvent('Event');
      e.initEvent('addtrack', false, false);
    }
    e.track = track;
    media.dispatchEvent(e);
  };

  TimelineController.prototype.createCaptionsTrack = function createCaptionsTrack(track) {
    var trackVar = 'textTrack' + track;
    if (!this[trackVar]) {
      //Enable reuse of existing text track.
      var existingTrack = this.getExistingTrack(track);
      if (!existingTrack) {
        var textTrack = this.createTextTrack('captions', this.config['captionsTextTrack' + track + 'Label'], this.config.captionsTextTrack1LanguageCode);
        if (textTrack) {
          textTrack[trackVar] = true;
          this[trackVar] = textTrack;
        }
      } else {
        this[trackVar] = existingTrack;
        clearCurrentCues(this[trackVar]);

        this.sendAddTrackEvent(this[trackVar], this.media);
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
    clearCurrentCues(this.textTrack1);
    clearCurrentCues(this.textTrack2);
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
        textTrack.mode = track.default ? 'showing' : 'hidden';
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
    }
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
    var tmpByte, ccbyte1, ccbyte2, ccValid, ccType;
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
        if (ccType === 0) // || ccType === 1
          {
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
    _this.media = undefined;
    _this.subtitleDisplay = false;
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
      if (tracks[id].mode === 'showing') {
        trackId = id;
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

    if (this.queuedDefaultTrack !== undefined) {
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

    this.media = undefined;
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
    if (details === undefined || details.live === true) {
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
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  };

  /** get alternate subtitle tracks list from playlist **/


  SubtitleTrackController.prototype.setSubtitleTrackInternal = function setSubtitleTrackInternal(newId) {
    // check if level idx is valid
    if (newId < -1 || newId >= this.tracks.length) {
      return;
    }

    // stopping live reloading timer if any
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    var textTracks = filterSubtitleTracks(this.media.textTracks);

    // hide currently enabled subtitle track
    if (this.trackId !== -1 && this.subtitleDisplay) {
      textTracks[this.trackId].mode = 'hidden';
    }

    this.trackId = newId;
    logger["b" /* logger */].log('switching to subtitle track ' + newId);
    this.hls.trigger(events["a" /* default */].SUBTITLE_TRACK_SWITCH, { id: newId });

    if (newId === -1) {
      return;
    }

    var subtitleTrack = this.tracks[newId];
    if (this.subtitleDisplay) {
      textTracks[newId].mode = 'showing';
    }

    // check if we need to load playlist for this subtitle Track
    var details = subtitleTrack.details;
    if (details === undefined || details.live === true) {
      // track not retrieved yet, or live playlist we need to (re)load it
      logger["b" /* logger */].log('(re)loading playlist for subtitle track ' + newId);
      this.hls.trigger(events["a" /* default */].SUBTITLE_TRACK_LOADING, { url: subtitleTrack.url, id: newId });
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
        // || this.tracks[subtitleTrackId].details === undefined) {
        this.setSubtitleTrackInternal(subtitleTrackId);
      }
    }
  }]);

  return SubtitleTrackController;
}(event_handler);

/* harmony default export */ var subtitle_track_controller = (subtitle_track_controller_SubtitleTrackController);
// EXTERNAL MODULE: ./src/crypt/decrypter.js + 3 modules
var decrypter = __webpack_require__(4);

// CONCATENATED MODULE: ./src/controller/subtitle-stream-controller.js
function subtitle_stream_controller__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function subtitle_stream_controller__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function subtitle_stream_controller__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * Subtitle Stream Controller
*/






var subtitle_stream_controller_State = {
  STOPPED: 'STOPPED',
  IDLE: 'IDLE',
  KEY_LOADING: 'KEY_LOADING',
  FRAG_LOADING: 'FRAG_LOADING'
};

var subtitle_stream_controller_SubtitleStreamController = function (_EventHandler) {
  subtitle_stream_controller__inherits(SubtitleStreamController, _EventHandler);

  function SubtitleStreamController(hls) {
    subtitle_stream_controller__classCallCheck(this, SubtitleStreamController);

    var _this = subtitle_stream_controller__possibleConstructorReturn(this, _EventHandler.call(this, hls, events["a" /* default */].MEDIA_ATTACHED, events["a" /* default */].ERROR, events["a" /* default */].KEY_LOADED, events["a" /* default */].FRAG_LOADED, events["a" /* default */].SUBTITLE_TRACKS_UPDATED, events["a" /* default */].SUBTITLE_TRACK_SWITCH, events["a" /* default */].SUBTITLE_TRACK_LOADED, events["a" /* default */].SUBTITLE_FRAG_PROCESSED));

    _this.config = hls.config;
    _this.vttFragSNsProcessed = {};
    _this.vttFragQueues = undefined;
    _this.currentlyProcessing = null;
    _this.state = subtitle_stream_controller_State.STOPPED;
    _this.currentTrackId = -1;
    _this.ticks = 0;
    _this.decrypter = new decrypter["a" /* default */](hls.observer, hls.config);
    return _this;
  }

  SubtitleStreamController.prototype.destroy = function destroy() {
    event_handler.prototype.destroy.call(this);
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

  SubtitleStreamController.prototype.tick = function tick() {
    var _this3 = this;

    this.ticks++;
    if (this.ticks === 1) {
      this.doTick();
      if (this.ticks > 1) {
        setTimeout(function () {
          _this3.tick();
        }, 1);
      }
      this.ticks = 0;
    }
  };

  SubtitleStreamController.prototype.doTick = function doTick() {
    var _this4 = this;

    switch (this.state) {
      case subtitle_stream_controller_State.IDLE:
        var tracks = this.tracks;
        var trackId = this.currentTrackId;

        var processedFragSNs = this.vttFragSNsProcessed[trackId],
            fragQueue = this.vttFragQueues[trackId],
            currentFragSN = !!this.currentlyProcessing ? this.currentlyProcessing.sn : -1;

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
            if (frag.decryptdata && frag.decryptdata.uri != null && frag.decryptdata.key == null) {
              logger["b" /* logger */].log('Loading key for ' + frag.sn);
              _this4.state = subtitle_stream_controller_State.KEY_LOADING;
              _this4.hls.trigger(events["a" /* default */].KEY_LOADING, { frag: frag });
            } else {
              // Frags don't know their subtitle track ID, so let's just add that...
              frag.trackId = trackId;
              fragQueue.push(frag);
              _this4.nextFrag();
            }
          }
        });
    }
  };

  // Got all new subtitle tracks.


  SubtitleStreamController.prototype.onSubtitleTracksUpdated = function onSubtitleTracksUpdated(data) {
    var _this5 = this;

    logger["b" /* logger */].log('subtitle tracks updated');
    this.tracks = data.subtitleTracks;
    this.clearVttFragQueues();
    this.vttFragSNsProcessed = {};
    this.tracks.forEach(function (track) {
      _this5.vttFragSNsProcessed[track.id] = [];
    });
  };

  SubtitleStreamController.prototype.onSubtitleTrackSwitch = function onSubtitleTrackSwitch(data) {
    this.currentTrackId = data.id;
    this.clearVttFragQueues();
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
        var startTime;
        try {
          startTime = performance.now();
        } catch (error) {
          startTime = Date.now();
        }
        // decrypt the subtitles
        this.decrypter.decrypt(data.payload, decryptData.key.buffer, decryptData.iv.buffer, function (decryptedData) {
          var endTime;
          try {
            endTime = performance.now();
          } catch (error) {
            endTime = Date.now();
          }
          hls.trigger(events["a" /* default */].FRAG_DECRYPTED, { frag: fragLoaded, payload: decryptedData, stats: { tstart: startTime, tdecrypt: endTime } });
        });
      }
    }
  };

  return SubtitleStreamController;
}(event_handler);

/* harmony default export */ var subtitle_stream_controller = (subtitle_stream_controller_SubtitleStreamController);
// CONCATENATED MODULE: ./src/config.js
/**
 * HLS config
 */






//import FetchLoader from './utils/fetch-loader';









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
  maxSeekHole: 2, // used by stream-controller
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
  fragLoadingLoopThreshold: 3, // used by stream-controller
  startFragPrefetch: false, // used by stream-controller
  fpsDroppedMonitoringPeriod: 5000, // used by fps-controller
  fpsDroppedMonitoringThreshold: 0.2, // used by fps-controller
  appendErrorMaxRetry: 3, // used by buffer-controller
  loader: xhr_loader,
  //loader: FetchLoader,
  fLoader: undefined,
  pLoader: undefined,
  xhrSetup: undefined,
  fetchSetup: undefined,
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
  minAutoBitrate: 0 // used by hls
};

if (true) {
  hlsDefaultConfig.subtitleStreamController = subtitle_stream_controller;
  hlsDefaultConfig.subtitleTrackController = subtitle_track_controller;
  hlsDefaultConfig.timelineController = timeline_controller;
  hlsDefaultConfig.cueHandler = cues_namespaceObject;
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
// CONCATENATED MODULE: ./src/hls.js
var hls__createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function hls__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * HLS interface
 */
















var hls_Hls = function () {
  Hls.isSupported = function isSupported() {
    return is_supported_isSupported();
  };

  hls__createClass(Hls, null, [{
    key: 'version',
    get: function get() {
      return "0.8.9";
    }
  }, {
    key: 'Events',
    get: function get() {
      return events["a" /* default */];
    }
  }, {
    key: 'ErrorTypes',
    get: function get() {
      return errors["b" /* ErrorTypes */];
    }
  }, {
    key: 'ErrorDetails',
    get: function get() {
      return errors["a" /* ErrorDetails */];
    }
  }, {
    key: 'DefaultConfig',
    get: function get() {
      if (!Hls.defaultConfig) {
        return hlsDefaultConfig;
      }
      return Hls.defaultConfig;
    },
    set: function set(defaultConfig) {
      Hls.defaultConfig = defaultConfig;
    }
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
      if (prop in config) {
        continue;
      }
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
    this.trigger = observer.trigger.bind(observer);

    // core controllers and network loaders
    var abrController = this.abrController = new config.abrController(this);
    var bufferController = new config.bufferController(this);
    var capLevelController = new config.capLevelController(this);
    var fpsController = new config.fpsController(this);
    var playListLoader = new playlist_loader(this);
    var fragmentLoader = new fragment_loader(this);
    var keyLoader = new key_loader(this);
    var id3TrackController = new id3_track_controller(this);

    // network controllers
    var levelController = this.levelController = new level_controller(this);
    var streamController = this.streamController = new stream_controller(this);
    var networkControllers = [levelController, streamController];

    // optional audio stream controller
    var Controller = config.audioStreamController;
    if (Controller) {
      networkControllers.push(new Controller(this));
    }
    this.networkControllers = networkControllers;

    var coreComponents = [playListLoader, fragmentLoader, keyLoader, abrController, bufferController, capLevelController, fpsController, id3TrackController];

    // optional audio track and subtitle controller
    Controller = config.audioTrackController;
    if (Controller) {
      var audioTrackController = new Controller(this);
      this.audioTrackController = audioTrackController;
      coreComponents.push(audioTrackController);
    }

    Controller = config.subtitleTrackController;
    if (Controller) {
      var subtitleTrackController = new Controller(this);
      this.subtitleTrackController = subtitleTrackController;
      coreComponents.push(subtitleTrackController);
    }

    // optional subtitle controller
    [config.subtitleStreamController, config.timelineController].forEach(function (Controller) {
      if (Controller) {
        coreComponents.push(new Controller(_this));
      }
    });
    this.coreComponents = coreComponents;
  }

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

  Hls.prototype.attachMedia = function attachMedia(media) {
    logger["b" /* logger */].log('attachMedia');
    this.media = media;
    this.trigger(events["a" /* default */].MEDIA_ATTACHING, { media: media });
  };

  Hls.prototype.detachMedia = function detachMedia() {
    logger["b" /* logger */].log('detachMedia');
    this.trigger(events["a" /* default */].MEDIA_DETACHING);
    this.media = null;
  };

  Hls.prototype.loadSource = function loadSource(url) {
    url = url_toolkit_default.a.buildAbsoluteURL(window.location.href, url, { alwaysNormalize: true });
    logger["b" /* logger */].log('loadSource:' + url);
    this.url = url;
    // when attaching to a source URL, trigger a playlist load
    this.trigger(events["a" /* default */].MANIFEST_LOADING, { url: url });
  };

  Hls.prototype.startLoad = function startLoad() {
    var startPosition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;

    logger["b" /* logger */].log('startLoad(' + startPosition + ')');
    this.networkControllers.forEach(function (controller) {
      controller.startLoad(startPosition);
    });
  };

  Hls.prototype.stopLoad = function stopLoad() {
    logger["b" /* logger */].log('stopLoad');
    this.networkControllers.forEach(function (controller) {
      controller.stopLoad();
    });
  };

  Hls.prototype.swapAudioCodec = function swapAudioCodec() {
    logger["b" /* logger */].log('swapAudioCodec');
    this.streamController.swapAudioCodec();
  };

  Hls.prototype.recoverMediaError = function recoverMediaError() {
    logger["b" /* logger */].log('recoverMediaError');
    var media = this.media;
    this.detachMedia();
    this.attachMedia(media);
  };

  /** Return all quality levels **/


  hls__createClass(Hls, [{
    key: 'levels',
    get: function get() {
      return this.levelController.levels;
    }

    /** Return current playback quality level **/

  }, {
    key: 'currentLevel',
    get: function get() {
      return this.streamController.currentLevel;
    }

    /* set quality level immediately (-1 for automatic level selection) */
    ,
    set: function set(newLevel) {
      logger["b" /* logger */].log('set currentLevel:' + newLevel);
      this.loadLevel = newLevel;
      this.streamController.immediateLevelSwitch();
    }

    /** Return next playback quality level (quality level of next fragment) **/

  }, {
    key: 'nextLevel',
    get: function get() {
      return this.streamController.nextLevel;
    }

    /* set quality level for next fragment (-1 for automatic level selection) */
    ,
    set: function set(newLevel) {
      logger["b" /* logger */].log('set nextLevel:' + newLevel);
      this.levelController.manualLevel = newLevel;
      this.streamController.nextLevelSwitch();
    }

    /** Return the quality level of current/last loaded fragment **/

  }, {
    key: 'loadLevel',
    get: function get() {
      return this.levelController.level;
    }

    /* set quality level for current/next loaded fragment (-1 for automatic level selection) */
    ,
    set: function set(newLevel) {
      logger["b" /* logger */].log('set loadLevel:' + newLevel);
      this.levelController.manualLevel = newLevel;
    }

    /** Return the quality level of next loaded fragment **/

  }, {
    key: 'nextLoadLevel',
    get: function get() {
      return this.levelController.nextLoadLevel;
    }

    /** set quality level of next loaded fragment **/
    ,
    set: function set(level) {
      this.levelController.nextLoadLevel = level;
    }

    /** Return first level (index of first level referenced in manifest)
    **/

  }, {
    key: 'firstLevel',
    get: function get() {
      return Math.max(this.levelController.firstLevel, this.minAutoLevel);
    }

    /** set first level (index of first level referenced in manifest)
    **/
    ,
    set: function set(newLevel) {
      logger["b" /* logger */].log('set firstLevel:' + newLevel);
      this.levelController.firstLevel = newLevel;
    }

    /** Return start level (level of first fragment that will be played back)
        if not overrided by user, first level appearing in manifest will be used as start level
        if -1 : automatic start level selection, playback will start from level matching download bandwidth (determined from download of first segment)
    **/

  }, {
    key: 'startLevel',
    get: function get() {
      return this.levelController.startLevel;
    }

    /** set  start level (level of first fragment that will be played back)
        if not overrided by user, first level appearing in manifest will be used as start level
        if -1 : automatic start level selection, playback will start from level matching download bandwidth (determined from download of first segment)
    **/
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

    /** Return the capping/max level value that could be used by automatic level selection algorithm **/

  }, {
    key: 'autoLevelCapping',
    get: function get() {
      return this._autoLevelCapping;
    }

    /** set the capping/max level value that could be used by automatic level selection algorithm **/
    ,
    set: function set(newLevel) {
      logger["b" /* logger */].log('set autoLevelCapping:' + newLevel);
      this._autoLevelCapping = newLevel;
    }

    /* check if we are in automatic level selection mode */

  }, {
    key: 'autoLevelEnabled',
    get: function get() {
      return this.levelController.manualLevel === -1;
    }

    /* return manual level */

  }, {
    key: 'manualLevel',
    get: function get() {
      return this.levelController.manualLevel;
    }

    /* return min level selectable in auto mode according to config.minAutoBitrate */

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

    /* return max level selectable in auto mode according to autoLevelCapping */

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

    // return next auto level

  }, {
    key: 'nextAutoLevel',
    get: function get() {
      var hls = this;
      // ensure next auto level is between  min and max auto level
      return Math.min(Math.max(hls.abrController.nextAutoLevel, hls.minAutoLevel), hls.maxAutoLevel);
    }

    // this setter is used to force next auto level
    // this is useful to force a switch down in auto mode : in case of load error on level N, hls.js can set nextAutoLevel to N-1 for example)
    // forced value is valid for one fragment. upon succesful frag loading at forced level, this value will be resetted to -1 by ABR controller
    ,
    set: function set(nextLevel) {
      var hls = this;
      hls.abrController.nextAutoLevel = Math.max(hls.minAutoLevel, nextLevel);
    }

    /** get alternate audio tracks list from playlist **/

  }, {
    key: 'audioTracks',
    get: function get() {
      var audioTrackController = this.audioTrackController;
      return audioTrackController ? audioTrackController.audioTracks : [];
    }

    /** get index of the selected audio track (index in audio track lists) **/

  }, {
    key: 'audioTrack',
    get: function get() {
      var audioTrackController = this.audioTrackController;
      return audioTrackController ? audioTrackController.audioTrack : -1;
    }

    /** select an audio track, based on its index in audio track lists**/
    ,
    set: function set(audioTrackId) {
      var audioTrackController = this.audioTrackController;
      if (audioTrackController) {
        audioTrackController.audioTrack = audioTrackId;
      }
    }
  }, {
    key: 'liveSyncPosition',
    get: function get() {
      return this.streamController.liveSyncPosition;
    }

    /** get alternate subtitle tracks list from playlist **/

  }, {
    key: 'subtitleTracks',
    get: function get() {
      var subtitleTrackController = this.subtitleTrackController;
      return subtitleTrackController ? subtitleTrackController.subtitleTracks : [];
    }

    /** get index of the selected subtitle track (index in subtitle track lists) **/

  }, {
    key: 'subtitleTrack',
    get: function get() {
      var subtitleTrackController = this.subtitleTrackController;
      return subtitleTrackController ? subtitleTrackController.subtitleTrack : -1;
    }

    /** select an subtitle track, based on its index in subtitle track lists**/
    ,
    set: function set(subtitleTrackId) {
      var subtitleTrackController = this.subtitleTrackController;
      if (subtitleTrackController) {
        subtitleTrackController.subtitleTrack = subtitleTrackId;
      }
    }
  }, {
    key: 'subtitleDisplay',
    get: function get() {
      var subtitleTrackController = this.subtitleTrackController;
      return subtitleTrackController ? subtitleTrackController.subtitleDisplay : false;
    },
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
/* 9 */
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

// http://stackoverflow.com/a/2593661/130442
function quoteRegExp (str) {
  return (str + '').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&')
}

function getModuleDependencies (module) {
  var retval = []
  var fnString = module.toString()
  var wrapperSignature = fnString.match(/^function\s?\(\w+,\s*\w+,\s*(\w+)\)/)
  if (!wrapperSignature) return retval

  var webpackRequireName = wrapperSignature[1]
  var re = new RegExp('(\\\\n|\\W)' + quoteRegExp(webpackRequireName) + '\\((\/\\*.*?\\*\/)?\s?.*?([\\.|\\-|\\w|\/|@]+).*?\\)', 'g') // additional chars when output.pathinfo is true
  var match
  while ((match = re.exec(fnString))) {
    retval.push(match[3])
  }
  return retval
}

function getRequiredModules (sources, moduleId) {
  var modulesQueue = [moduleId]
  var requiredModules = []
  var seenModules = {}

  while (modulesQueue.length) {
    var moduleToCheck = modulesQueue.pop()
    if (seenModules[moduleToCheck] || !sources[moduleToCheck]) continue
    seenModules[moduleToCheck] = true
    requiredModules.push(moduleToCheck)
    var newModules = getModuleDependencies(sources[moduleToCheck])
    modulesQueue = modulesQueue.concat(newModules)
  }

  return requiredModules
}

module.exports = function (moduleId, options) {
  options = options || {}
  var sources = __webpack_require__.m

  var requiredModules = options.all ? Object.keys(sources) : getRequiredModules(sources, moduleId)
  var src = '(' + webpackBootstrapFunc.toString().replace('ENTRY_MODULE', JSON.stringify(moduleId)) + ')({' + requiredModules.map(function (id) { return '' + JSON.stringify(id) + ': ' + sources[id].toString() }).join(',') + '})(self);'

  var blob = new window.Blob([src], { type: 'text/javascript' })
  if (options.bare) { return blob }

  var URL = window.URL || window.webkitURL || window.mozURL || window.msURL

  var workerUrl = URL.createObjectURL(blob)
  var worker = new window.Worker(workerUrl)
  worker.objectURL = workerUrl

  return worker
}


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__demux_demuxer_inline__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__events__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_logger__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_events__ = __webpack_require__(5);
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
    //console.log('demuxer cmd:' + data.cmd);
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

/***/ })
/******/ ])["default"];
});
//# sourceMappingURL=hls.js.map

/***/ })
/******/ ]);
});
//# sourceMappingURL=hls.js.map