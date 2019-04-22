// =====================================================================
// Utility functions
//
//     functions:
//      xs_GUIDGen()
//      xs_multiCallback(names, func)
//      xs_cookie(cname, cvalue, exMS)
//      xs_getURLParameter (name)
//      xs_browserType: 'iOS'|'Android'|'unknown'
//
//     events:
//      xs_wake:  detail{delta:1000}
//
// =====================================================================
// =====================================================================
// Utility functions
// =====================================================================
function chaincallBacks (n, p) {
  if (!p) return n
  return function () {
    if (p) p.apply(null, arguments)
    n.apply(null, arguments)
  }
}

function xs_multiCallback (names, func) {
  function removeMe (n) {
    var index = names.indexOf(n)
    if (index < 0) return
    names.splice(index, 1)
    if (names.length == 0) { func() }
  }
  for (var i in names) {
    var n = names[i]
    window[n] = chaincallBacks((function (n) {
      return function () { removeMe(n) }
    }(n)), window[n])
  }
}

Number.prototype.pad = function (n) {
  for (var r = this.toString(); r.length < n; r = 0 + r);
  return r
}

function xs_GUIDGen () {
  function S4 () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }

  // then to call it, plus stitch in '4' in the third group
  return (S4() + S4() + '-' + S4() + '-4' + S4().substr(0, 3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase()
}

function setCookie (name, value, ms) {
  var expires = ''
  if (ms) {
    var date = new Date()
    date.setTime(date.getTime() + ms)
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/'
}
function getCookie (name) {
  var nameEQ = name + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}
function eraseCookie (name) {
  document.cookie = name + '=; Max-Age=-99999999;'
}

var xs_perfnow = window.performance ? xs_perfnow : null
var xs_wake_timeout = 5000
var xs_wake_lastTime = xs_perfnow ? xs_perfnow() : Date.now()
setInterval(function () {
  var currentTime = xs_perfnow ? xs_perfnow() : Date.now()
  if (currentTime > (xs_wake_lastTime + xs_wake_timeout + 2000)) {
    document.dispatchEvent(new CustomEvent('xs_wake', {
      details: {
        delta: currentTime - xs_wake_timeout
      }
    })
    )
  }
  xs_wake_lastTime = currentTime
}, xs_wake_timeout)

function ms2html (now) {
  var neg
  if (now < 0) {
    now = -now
    neg = true
  }
  var milli = (now % 1000) | 0

  var sec = ((now % 60000) / 1000) | 0

  var min = (now / 60000) | 0
  var colstr = "<span style='opacity:0.8'>:</span>"
  var ihtml = (neg ? '-' : '') +
        min.pad(2) + colstr +
        sec.pad(2) + colstr +
        milli.pad().padStart(3, '0')
  return ihtml
}

function date2html (now) {
  var milli = now.getMilliseconds()

  var sec = now.getSeconds()

  var min = now.getMinutes()

  var hou = now.getHours()

  var mo = now.getMonth()

  var dy = now.getDate()

  var yr = now.getFullYear()
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  var colstr = "<span style='opacity:0.5'>:</span>"
  var ihtml = months[mo] + ' ' +
        dy + ' ' +
        yr + ' &nbsp;' +
        hou.pad(2) + colstr +
        min.pad(2) + colstr +
        sec.pad(2) + colstr +
        milli
  return ihtml
}

function xs_getPageParameter (parameterstring, name) {
  // thanks https://davidwalsh.name/query-string-javascript
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
  var regex = new RegExp('[\\?&#]' + name + '=([^?&#]*)')
  var results = regex.exec(parameterstring)
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

function xs_getURLParameter (name) {
  var urlParam = xs_getPageParameter(window.location.search, name)
  return urlParam || xs_getPageParameter(window.location.hash, name)
}

var xs_browserType = (function getMobileOperatingSystem () {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera

  if (/windows phone/i.test(userAgent)) return 'Windows Phone'
  if (/android/i.test(userAgent)) return 'Android'
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return 'iOS'

  return 'unknown'
}())


function xs_baseHost() {
  var base = window.location.protocol+'//' + window.location.hostname
  if (window.location.port)
      base += ':' + window.location.port;
  return base
}
function xs_basePath() {
  return xs_baseHost() + window.location.pathname
}

function xs_vueHookDiv   () {
  Vue.component('hookdiv', {
    template: `<div><slot></slot></div>`,
    mounted: function () {
      this.$emit('mounted')
    },
    beforeDestroy: function () {
      this.$emit('unmounted')
    }
  })
}
