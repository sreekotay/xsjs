var xs_perfnow = window.performance ? xs_perfnow : null

// =====================================================================
// accuTimer
// =====================================================================
function accuTimer (timer, repeatArgument, callbackArgument) {
  var counter = 1
  var timeStart
  var stopped

  var init = (t) => {
    timeStart = xs_perfnow ? xs_perfnow() : new Date().getTime()
    setTimeout(function () {
      if (!stopped) {
        var fix = xs_perfnow ? xs_perfnow() : new Date().getTime()
        fix = (fix - timeStart) - timer
        init(t - fix)
        counter++

        // event to be repeated max times
        repeatArgument()
      } else {
        // event to be executed at animation end
        if (callbackArgument) callbackArgument()
      }
    }, t)
  }
  var o = {
    start: function () { counter = 1; stopped = false; init(timer) },
    stop: function () { stopped = true },
    counter: function () { return counter }
  }
  o.start()
  return o
}

// =====================================================================
// accuServer
// =====================================================================
function accuServer () {
  var browserType = (function getMobileOperatingSystem () {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera

    if (/windows phone/i.test(userAgent)) return 'Windows Phone'
    if (/android/i.test(userAgent)) return 'Android'
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return 'iOS'

    return 'unknown'
  }())

  var ac = {
    diff: 0,
    diffBase: 0,
    retries: 0,
    shift: 0
  }

  ac.date = function () {
    var client_ms = xs_perfnow ? window.performance.timing.navigationStart + xs_perfnow() : (new Date()).getTime()
    return new Date(client_ms + ac.diffBase + ac.shift)
  }

  ac.when = function () {
    var client_ms = xs_perfnow ? window.performance.timing.navigationStart + xs_perfnow() : (new Date()).getTime()
    return client_ms + ac.diffBase + ac.shift
  }

  ac.forceSync = function () {
    var syncTimeframe = 1000 * 60 * 60 * 24 // 24 Hours
    var lastSyncKey = 'lastSyncWithTimeServer'
    var timeDiffKey = 'Local-Server-timeDiff'

    var retryMax = 100
    var retryMin = 6
    var retryCount = 0
    var acceptedDelay = 2
    var runningNarrow = 0
    var runningMax = 5
    var timeDiff = 0; var timeDiffArr = []

    // read stored
    lastSync = new Date(window.localStorage.getItem(lastSyncKey))
    if (Math.abs((new Date()) - lastSync) < syncTimeframe) {
      timeDiff = parseInt(window.localStorage.getItem(timeDiffKey), 10)
      timeDiffArr.push(timeDiff)
    }
    syncTime()
    ac.diffBase = timeDiff
    ac.diff = ac.diffBase + ac.shift

    function standardDeviation (values, avg) {
      avg = typeof (avg) === 'number' ? avg : average(values)

      var squareDiffs = values.map(function (value) {
        var diff = value - avg
        var sqrDiff = diff * diff
        return sqrDiff
      })

      var avgSquareDiff = average(squareDiffs)

      var stdDev = Math.sqrt(avgSquareDiff)
      return stdDev
    }

    function average (data) {
      var sum = data.reduce(function (sum, value) {
        return sum + value
      }, 0)

      var avg = sum / data.length
      return avg
    }

    function filterOutliers (someArray) {
      // Copy the values, rather than operating on references to existing values
      var values = someArray.concat()

      // Then sort
      values.sort(function (a, b) {
        return a - b
      })

      /* Then find a generous IQR. This is generous because if (values.length / 4)
            * is not an int, then really you should average the two elements on either
            * side to find q1.
            */
      var p = 5
      var q1 = values[Math.floor((values.length / p))]
      // Likewise for q3.
      var q3 = values[Math.ceil((values.length * ((p - 1) / p)))]
      var iqr = q3 - q1

      // Then find min and max values
      var maxValue = q3 + iqr * 1.25
      var minValue = q1 - iqr * 1.25

      var avg = average(someArray)
      if (1) {
        var stddev = standardDeviation(someArray, avg)
        maxValue = avg + stddev * 1
        manValue = avg - stddev * 1
      }

      var sum = 0; var cnt = 0
      for (var i in values) {
        var x = values[i]
        if (x <= maxValue && x >= minValue) {
          sum += x
          cnt++
        }
      }

      if (cnt == 0) return avg

      return sum / cnt
    }

    function syncTime () {
      var StartTime = new Date()
      var StartNow = xs_perfnow ? xs_perfnow() : 0

      function completeTimeCheck (stime) {
        var EndTime = new Date()
        var EndNow = xs_perfnow ? xs_perfnow() : 0

        // console.log (`client ${EndTime.toISOString()} server ${stime.toISOString()}`)
        var dtime = StartNow ? (EndNow - StartNow) : (EndTime - StartTime)
        timeDiff = stime - EndTime + dtime / 2
        // if (EndNow) timeDiff = stime.getTime() - performance.timing.navigationStart - EndNow + dtime/2

        timeDiffArr.push(timeDiff)

        retryCount++
        timeDiff = filterOutliers(timeDiffArr) | 0
        var done = false
        var thresh = Math.abs(timeDiff - ac.diffBase) > acceptedDelay
        if (thresh) runningNarrow = 0
        else runningNarrow++
        ac.retries = retryCount
        if (retryCount < retryMax && (retryCount < retryMin || runningNarrow < runningMax)) {
          syncTime()
          // console.log (Math.abs(timeDiff-ac.diff))
        } else {
          console.log('attempts [' + timeDiffArr + ']\n[completed sync] retries: ' + retryCount)
          console.log('[completed sync] delta: ' + timeDiff)
          if (window.onAccuServerReady) window.onAccuServerReady()
          document.dispatchEvent(new CustomEvent('xs_accuServerReady', {}))
          done = true
        }
        if (1) {
          if (done) {
            window.localStorage.setItem(lastSyncKey, '' + (new Date()))
            window.localStorage.setItem(timeDiffKey, timeDiff)
          }
          ac.diffBase = timeDiff
          ac.diff = ac.diffBase + ac.shift
        }
      }

      xhr = new XMLHttpRequest()
      // xhr.open("HEAD", "//www.googleapis.com",true);
      // xhr.open("HEAD", "//s3.amazonaws.com/gopuff-locales/locales.csv",true);
      // xhr.open("GET", "/sync",true);
      xhr.open('GET', '//jssync.azurewebsites.net/sync', true)
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          var stime
          try {
            stime = new Date(xhr.getResponseHeader('Date'))
          } catch (err) {}
          try {
            var json = JSON.parse(xhr.responseText)
            stime = new Date(json.time)
          } catch (err) {}
          completeTimeCheck(stime) // date object
        }
      }
      xhr.send(null)
    }
  }

  document.addEventListener('DOMContentLoaded', function (event) {
    // the event occurred
    ac.forceSync()
  })
  return ac
}

// =====================================================================
// instantiate
// =====================================================================
var xs_accuServer = accuServer() // create instance

// resync on wake up
document.addEventListener('xs_wake', function (e) {
  xs_accuServer.forceSync()
})
