
// =====================================================================
// xs_sock Commands
//
//     functions:
//      xs_sockVerify(force)
//      xs_sockReady()
//      xs_sockExec (when)
//      xs_sockPush (data, [when])
//      xs_sockPop ([when])
//      xs_sockRegister (target, methdo, thisObj, func)
//
//
//     events:
//      xs_sock:  detail{msg:'error'|'open'|'close'}
//
// =====================================================================
var xs_sockCommands = []
var xs_sockCommandLock = {}
function xs_sockPush (data, when) {
  var last = xs_sockCommands.length - 1
  data.when = when || data.when || 0
  xs_sockCommands.push(data)

  xs_sockExec(data, true)

  // sort if necessary
  if (last >= 0 && xs_sockCommands[last].when <= data.when) return
  xs_sockCommands.sort(function (a, b) {
    return a.when - b.when
  })
}

function xs_sockPop (when) {
  while (xs_sockCommands.length && when >= xs_sockCommands[0].when) { return xs_sockCommands.shift() }
  return null
}

function xs_sockExec (data, immediate) {
  var tc = xs_sockCommands[data.target] = xs_sockCommands[data.target] || {}
  var tcm = tc[data.method]
  if (!tcm) {
    console.error('missing command: ' + data.method)
    return false
  }
  if (immediate) {
    if (tcm.funcImm) tcm.funcImm.call(tcm.thisObj, data) // run it
  } else {
    if (tcm.func) tcm.func.call(tcm.thisObj, data) // run it
  }
  return true
}

function xs_sockRegister (target, method, thisObj, func, funcImm) {
  var tc = xs_sockCommands[target] = xs_sockCommands[target] || {}
  if (!tc) return false
  tc[method] = {
    thisObj: thisObj,
    func: func,
    funcImm: funcImm
  }
  return true
}

// =====================================================================
// websockets
// =====================================================================
var xs_sock = 0
var xs_sockGUID = xs_GUIDGen()
function xs_sockReady () {
  return xs_sock && xs_sock.readyState == 1
}
function xs_sockVerify (force) {
  if (xs_sock == 0 || force || xs_sock.readyState != 1) {
    var urlWS = (window.location.protocol == 'http:' ? 'ws://' : 'wss://') + window.location.hostname + ':'
    urlWS += window.location.port
    // urlWS = 'wss://jssync.azurewebsites.net'
    urlWS += '?auth=1234.000'
    if (xs_sock) xs_sock.close()
    xs_sock = new WebSocket(urlWS)
    xs_sock.onopen = function (event) {
      xs_sockRemote({ socket_guid: xs_sockGUID, session_guid: xs_sessionsGUID }) // respond with GUID
      document.dispatchEvent(new CustomEvent('xs_sock', { detail: { msg: 'open' } }))
    }
    xs_sock.onclose = function (event) {
      document.dispatchEvent(new CustomEvent('xs_sock', { detail: { msg: 'close' } }))
    }
    xs_sock.onerror = function (event) {
      document.dispatchEvent(new CustomEvent('xs_sock', { detail: { msg: 'error' } }))
    }
    xs_sock.onmessage = function (evt) {
      var data = evt.data
      try {
        data = JSON.parse(data)
      } catch (err) {}

      if (data.target == 'page') {
        switch (data.method) {
          case 'reload': window.location.reload(); break
        }
        return
      }
      if (data.exclusive) {
        var exkey = data.method + (data.guid || '')
        var key = xs_sockCommandLock[exkey]
        if (key && key.exclusive > data.when) { // is exclusive greater than when?
          if (key.priority || data.priority) { // does either have a priority?
            if (key.priority > (data.priority || 0)) // is current priority greater?
            { return }
            var idx = xs_sockCommands.findIndex(key) // replace the command
            if (idx >= 0) {
              console.log('REPLACED === ', data)
              xs_sockCommands[idx] = data
            } else console.error('exclusive-priority command not found - ', key)
            return
          }
          return
        }
        xs_sockCommandLock[exkey] = data
      }
      console.log('==>', data)

      xs_sockPush(data)
    }
  }
}
if (1) {
  xs_sockVerify()
  setInterval(function () { xs_sockVerify() }, 3000)
}

function xs_sockRemote (msg, delay) {
  if (typeof (msg) !== 'string') msg = JSON.stringify(msg)
  console.log('<--', msg)
  if (!delay) xs_sock.send(msg)
  else setTimeout(function () { xs_sock.send(msg) }, delay)
}

// ========================================
// sessions
// ========================================
var xs_session = getCookie('xs_session')
var xs_sessionLocation
var xs_sessionsGUID
function xs_sessionJoin (guid, data) {
  data = Object.assign({ GUID: guid || xs_session }, data, xs_sessionLocation)
  xs_HTTP('POST', '/session/set', data)
  xs_session = guid

  setCookie('xs_session', guid, 1000 * 60 * 60 * 24) // 24 hours
  xs_sockRemote({ socket_guid: xs_sockGUID, session_guid: xs_sessionsGUID }) // respond with GUID
}

xs_geolocation(function (c) {
  if (!c) return
  xs_sessionLocation = c.coords
  if (xs_session && xs_sockReady())   xs_sessionJoin()
})

function xs_sessionRead (cb) {
  xs_HTTP('GET', '/session/get?GUID=' + xs_session)
    .then(function (result) {
      if (cb) cb(result)
    }).catch(function (err) {
      console.error(err)
      if (cb) cb(null)
    })
}

function xs_sessionList (cb, data) {
  xs_HTTP('get', data || '/session/list')
    .then(function (result) {
      if (cb) cb(result)
    }).catch(function (err) {
      console.error(err)
      if (cb) cb(null)
    })
}
