
// ===============================
//
//  xs_HTTP (method, url, data, headers, options)
//  xs_HTTPCancel (method, url, data, headers, options)
//  xs_HTTPProxy (method, url, data, headers, options)
//
//  options:
//    cachems
//    noAutoHeader (global headers from xs_Headers)
//    immedate  --- only from cache
//  
// ===============================

// promise polyfill
!(function (e, n) { typeof exports === 'object' && typeof module !== 'undefined' ? n() : typeof define === 'function' && define.amd ? define(n) : n() }(0, function () { 'use strict'; function e (e) { var n = this.constructor; return this.then(function (t) { return n.resolve(e()).then(function () { return t }) }, function (t) { return n.resolve(e()).then(function () { return n.reject(t) }) }) } function n () {} function t (e) { if (!(this instanceof t)) throw new TypeError('Promises must be constructed via new'); if (typeof e !== 'function') throw new TypeError('not a function'); this._state = 0, this._handled = !1, this._value = undefined, this._deferreds = [], u(e, this) } function o (e, n) { for (;e._state === 3;)e = e._value; e._state !== 0 ? (e._handled = !0, t._immediateFn(function () { var t = e._state === 1 ? n.onFulfilled : n.onRejected; if (t !== null) { var o; try { o = t(e._value) } catch (f) { return void i(n.promise, f) }r(n.promise, o) } else (e._state === 1 ? r : i)(n.promise, e._value) })) : e._deferreds.push(n) } function r (e, n) { try { if (n === e) throw new TypeError('A promise cannot be resolved with itself.'); if (n && (typeof n === 'object' || typeof n === 'function')) { var o = n.then; if (n instanceof t) return e._state = 3, e._value = n, void f(e); if (typeof o === 'function') return void u((function (e, n) { return function () { e.apply(n, arguments) } }(o, n)), e) }e._state = 1, e._value = n, f(e) } catch (r) { i(e, r) } } function i (e, n) { e._state = 2, e._value = n, f(e) } function f (e) { e._state === 2 && e._deferreds.length === 0 && t._immediateFn(function () { e._handled || t._unhandledRejectionFn(e._value) }); for (var n = 0, r = e._deferreds.length; r > n; n++)o(e, e._deferreds[n]); e._deferreds = null } function u (e, n) { var t = !1; try { e(function (e) { t || (t = !0, r(n, e)) }, function (e) { t || (t = !0, i(n, e)) }) } catch (o) { if (t) return; t = !0, i(n, o) } } var c = setTimeout; t.prototype['catch'] = function (e) { return this.then(null, e) }, t.prototype.then = function (e, t) { var r = new this.constructor(n); return o(this, new function (e, n, t) { this.onFulfilled = typeof e === 'function' ? e : null, this.onRejected = typeof n === 'function' ? n : null, this.promise = t }(e, t, r)), r }, t.prototype['finally'] = e, t.all = function (e) { return new t(function (n, t) { function o (e, f) { try { if (f && (typeof f === 'object' || typeof f === 'function')) { var u = f.then; if (typeof u === 'function') return void u.call(f, function (n) { o(e, n) }, t) }r[e] = f, --i == 0 && n(r) } catch (c) { t(c) } } if (!e || typeof e.length === 'undefined') throw new TypeError('Promise.all accepts an array'); var r = Array.prototype.slice.call(e); if (r.length === 0) return n([]); for (var i = r.length, f = 0; r.length > f; f++)o(f, r[f]) }) }, t.resolve = function (e) { return e && typeof e === 'object' && e.constructor === t ? e : new t(function (n) { n(e) }) }, t.reject = function (e) { return new t(function (n, t) { t(e) }) }, t.race = function (e) { return new t(function (n, t) { for (var o = 0, r = e.length; r > o; o++)e[o].then(n, t) }) }, t._immediateFn = typeof setImmediate === 'function' && function (e) { setImmediate(e) } || function (e) { c(e, 0) }, t._unhandledRejectionFn = function (e) { void 0 !== console && console && console.warn('Possible Unhandled Promise Rejection:', e) }; var l = (function () { if (typeof self !== 'undefined') return self; if (typeof window !== 'undefined') return window; if (typeof global !== 'undefined') return global; throw Error('unable to locate global object') }()); 'Promise' in l ? l.Promise.prototype['finally'] || (l.Promise.prototype['finally'] = e) : l.Promise = t }))

// object assign polyfill
if (typeof (Object.assign) !== 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.assign = function assign (target, varArgs) { // .length of function is 2
    'use strict'
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object')
    }

    var to = Object(target)

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index]

      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey]
          }
        }
      }
    }
    return to
  }
}

function xs_HTTPCancel (method, url, data, headers, options) {
  var opt = Object.assign({}, options)
  opt.method = method; opt.url = url; opt.data = data, opt.headers = headers
  alite_cancel(opt)
}
var isBot = /bot|crawler|spider|robot|crawling|teoma|slurp|yandex|google|baidu|bing|msn|facebook/i.test(navigator.userAgent)
function xs_HTTP (method, url, data, headers, options) {
  if (isBot) return
  if (typeof (url) === 'object') return new Promise(function (resolve, reject) { resolve(url) }) // to simplify code flow
  headers = Object.assign({}, (!options || options.noAutoHeader) ? {} : xs_DefaultHeaders, headers)
  var opt = Object.assign({}, options)
  opt.method = method; opt.url = url; opt.data = data, opt.headers = headers
  return alite(opt)
}
var xs_DefaultHeaders = {}
var xs_Proxy = {}
var xs_ProxyCache = {}
var xs_ProxMS = 30 * 1000 // 30 sec
var xs_CacheCleaner = null
var xs_CacheCB = function () {
  var d = new Date()
  var counter = 0
  for (var cn in xs_ProxyCache) {
    if (xs_ProxyCache[cn].data) {
      if (d - xs_ProxyCache[cn].ts < xs_ProxyCache[cn].cachems) { counter++ } // still valid
      else xs_ProxyCache[cn].data = null
    }
  }

  if (!counter) {
    clearInterval(xs_CacheCleaner)
    xs_CacheCleaner = null
  }
}

function successPromise (data) {
  //return new Promise(function (resolve, reject) { resolve(data) }) // to simplify code flow
  var obj = {
    then: function (f) {
      f(data)
      return obj;
    },
    catch: function (f) {
      return obj;
    }
  }
  return obj
}
function xs_Hash (s) { var h = 0, l = s.length, i = 0; while (i < l) h = (h << 5) - h + s.charCodeAt(i++) | 0; return h };
function xs_HTTPProxy (method, url, data, headers, options) {
  options = options || {}
  headers = Object.assign({}, (!options || options.noAutoHeader) ? {} : xs_DefaultHeaders, headers)
  // if (!'Content-Type' in headers) headers['Content-Type'] = 'application/json'
  var cachems = ('cachems' in options ? options.cachems : xs_ProxMS)
  if (typeof (url) === 'object') return successPromise(url) // to simplify code flow
  var cn = xs_Hash(method + url + (data ? JSON.stringify(data) : '') + (headers ? JSON.stringify(headers) : ''))
  if (xs_Proxy[cn] && cachems && !options.immedate) {
    xs_ProxyCache[cn].proxyhit = (xs_ProxyCache[cn].proxyhit || 0) + 1
    return xs_Proxy[cn]
  }
  if (xs_ProxyCache[cn] && xs_ProxyCache[cn].data && cachems &&
        xs_ProxyCache[cn].ts && new Date() - xs_ProxyCache[cn].ts < xs_ProxyCache[cn].cachems) {
    xs_ProxyCache[cn].cachehit = (xs_ProxyCache[cn].cachehit || 0) + 1
    return successPromise(xs_ProxyCache[cn].data) // to simplify code flow
  }
  if (options.immedate)
    return successPromise(null)

  xs_ProxyCache[cn] = xs_ProxyCache[cn] || {data: null, url: url }
  var opt = Object.assign({}, options)
  opt.method = method
  opt.url = url
  opt.data = data
  opt.headers = headers
  var promise = alite(opt)
  var new_promise = new Promise(function (resolve, reject) {
    promise.then(function (data) {
      xs_Proxy[cn] = null
      if (cachems) {
        xs_ProxyCache[cn].url = url
        xs_ProxyCache[cn].data = data
        xs_ProxyCache[cn].ts = new Date()
        xs_ProxyCache[cn].cachemiss = (xs_ProxyCache[cn].cachemiss || 0) + 1
        xs_ProxyCache[cn].cachems = cachems
      }
      resolve(data)
      if (!xs_CacheCleaner && xs_CacheCB) { xs_CacheCleaner = setInterval(xs_CacheCB, xs_ProxMS) } // every 30 secs
    }).catch(function (err) {
      xs_Proxy[cn] = null
      xs_ProxyCache[cn].data = null
      xs_ProxyCache[cn].ts = new Date()
      xs_ProxyCache[cn].cacheerror = (xs_ProxyCache[cn].cacheerror || 0) + 1
      reject(err)
    })
  })
  xs_Proxy[cn] = new_promise
  return new_promise
}

// alite - modified to return error statusCode code and xhr
/* Copyright (c) 2015 Chris Davies License MIT https://github.com/chrisdavies/alite#license-mit */
var xs_XHR = {}
function alite_hash (opts) {
  return xs_Hash(opts.url)// JSON.stringify({url:opts.url,hdrs:opts.headers}));
}
function alite_cancel (opts) {
  var hash = alite_hash(opts)
  if (!xs_XHR[hash]) return false
  console.log('url --- cancelled')
  xs_XHR[hash].cancel = true
  xs_XHR[hash].xhr.abort()
  return true
}
function alite (opts) {
  function noop () { }
  function response (req) {
    var responseText = req && req.responseText
    var isJson = /^[\{\[]/.test(responseText)
    if (isJson) try { return JSON.parse(responseText) } catch (err) {}
    return responseText
  }
  return new Promise(function (resolve, reject) {
    var req = (opts.xhr || noop)() || new XMLHttpRequest()
    var data = opts.data
    var hash = alite_hash(opts)

    req.onerror = function () {
      if (xs_XHR[hash] && !xs_XHR[hash].cancel) { if (window.showInternetConnection) showInternetConnection() }
    }
    req.onreadystatechange = function () {
      if (req.readyState == 2 || req.readyState == 3) {
        if (window.showInternetConnection) showInternetConnection(true)
      }
      if (req.readyState == 4) {
        if (req.status == 0 && (xs_XHR[hash] && !xs_XHR[hash].cancel)) { if (window.showInternetConnection) showInternetConnection() } else if (window.showInternetConnection) showInternetConnection(true)
        if (xs_XHR[hash]) delete xs_XHR[hash]
        if (req.status >= 200 && req.status < 300) {
          resolve(response(req), req)
        } else {
          console.log('xs_HTTP reject ' + req.status + ' > ' + req.responseURL + ' > ' + JSON.stringify(opts))
          reject({statusMessage: response(req), statusCode: req.status}, req);
        }
        (alite.ajaxStop || noop)(req, opts)
      }
    }
    req.open(opts.method, opts.url)
    !opts.raw && req.setRequestHeader('Content-Type', 'application/json')
    if (opts.headers) {
      for (var name in opts.headers) {
        req.setRequestHeader(name, opts.headers[name])
      }
    }

    (alite.ajaxStart || noop)(req, opts);
    (opts.ajaxStart || noop)(req)
    xs_XHR[hash] = {xhr: req}
    //console.error ('getting [proxy]' + opts.url)
    req.send(opts.raw ? data : (data ? JSON.stringify(data) : undefined))
  })
}
