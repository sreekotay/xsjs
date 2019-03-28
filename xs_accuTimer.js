// =====================================================================
// accuTimer
// =====================================================================
function accuTimer(timer, repeatArgument, callbackArgument){
  var counter = 1;
  var started = false;
  var timeStart

  var init = function (t) {
    var timeLast = window.performance.now ?  window.performance.now() :  new Date().getTime();
    if (counter==1) timeStart = timeLast
    setTimeout(function () {
      if (counter) {
        if (!started && callbackArgument) callbackArgument(false);
        started = true
        var curTime = window.performance.now ?  window.performance.now() : new Date().getTime()
        var fix = (curTime - timeStart)%timer;

        counter++
        init(t - fix); //multiply the error to try and compensate?
        repeatArgument((curTime - timeLast)>timer);
        
      } else {
      // event to be executed at animation end
        if (started && callbackArgument) callbackArgument(true);
        started = false
      }
    }, t);
  }
  
  var o = {
      start:    function ()  {counter=1; init(timer)},
      stop:     function()   {counter=0;},
      counter:  function()   {return counter}
  }
  o.start()
  return o
}


// =====================================================================
// accuServer
// =====================================================================
function accuServer () {
    var browserType = function getMobileOperatingSystem() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        if (/windows phone/i.test(userAgent))                           return "Windows Phone";
        if (/android/i.test(userAgent))                                 return "Android";
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)     return "iOS";

        return "unknown";
    }();

    var ac = {
        diff: 0,
        diffBase: 0,
        retries: 0,
        shift: -33.3,
        extra_av:  -141.7
    }

    var av_key = 'local-av-offset-v3'

    switch (browserType) {
        case 'Android':
            ac.extra_av = 0
            break;
        case 'iOS':
            ac.shift = 0
            ac.extra_av = 0
            break;
    }

    ac.shift_av = function () {
        return ac.extra_av-ac.shift
    }

    ac.adjustTime = function (delta, doShift)  {
        if (doShift) ac.shift+=delta 
        else ac.extra_av+=delta
        ac.diff = ac.diffBase + ac.shift
        xs_cookie(av_key, ac.extra_av, 2147483647);
    }

    ac.date = function(av) {
        var client_ms = window.performance.now ? window.performance.timing.navigationStart + window.performance.now() : (new Date()).getTime()
        return new Date(client_ms + ac.diffBase + (av ? ac.extra_av : ac.shift))
    }

    ac.when = function(av) {
        var client_ms = window.performance.now ? window.performance.timing.navigationStart + window.performance.now() : (new Date()).getTime()
        return client_ms + ac.diffBase + (av ? ac.extra_av : ac.shift)
    }
   

    ac.forceSync = function () {
        var syncTimeframe = 1000 * 60 * 60 * 24; // 24 Hours
        var lastSyncKey = 'lastSyncWithTimeServer';
        var timeDiffKey = 'Local-Server-timeDiff';

        var retryMax = 100;
        var retryMin = 10;
        var retryCount = 0;
        var acceptedDelay = 2;
        var runningNarrow = 0;
        var runningMax = 10;
        var timeDiff = 0, timeDiffArr = []

        var eav = xs_cookie(av_key);
        if(eav || eav!=="") ac.extra_av = +eav

       
        // read stored
        lastSync = new Date(window.localStorage.getItem(lastSyncKey));
        if ( Math.abs((new Date()) - lastSync) < syncTimeframe) {
            timeDiff = parseInt(window.localStorage.getItem(timeDiffKey), 10);
            timeDiffArr.push (timeDiff)
        }
        syncTime();
        ac.diffBase = timeDiff
        ac.diff = ac.diffBase + ac.shift
    

        function standardDeviation(values, avg){
        avg = typeof(avg)=='number' ? avg : average(values);
        
        var squareDiffs = values.map(function(value){
            var diff = value - avg;
            var sqrDiff = diff * diff;
            return sqrDiff;
        });
        
        var avgSquareDiff = average(squareDiffs);

        var stdDev = Math.sqrt(avgSquareDiff);
        return stdDev;
        }

        function average(data){
        var sum = data.reduce(function(sum, value){
            return sum + value;
        }, 0);

        var avg = sum / data.length;
        return avg;
        }

        function filterOutliers(someArray) {  

            // Copy the values, rather than operating on references to existing values
            var values = someArray.concat();

            // Then sort
            values.sort( function(a, b) {
                    return a - b;
                });

            /* Then find a generous IQR. This is generous because if (values.length / 4) 
            * is not an int, then really you should average the two elements on either 
            * side to find q1.
            */     
            var p = 5
            var q1 = values[Math.floor((values.length / p))];
            // Likewise for q3. 
            var q3 = values[Math.ceil((values.length * ((p-1) / p)))];
            var iqr = q3 - q1;

            // Then find min and max values
            var maxValue = q3 + iqr*1.25;
            var minValue = q1 - iqr*1.25;

            var avg = average(someArray)
            if (1) {
                var stddev = standardDeviation(someArray, avg)
                maxValue = avg + stddev*1
                manValue = avg - stddev*1
            }

            var sum = 0, cnt = 0
            for (var i in values) {
                var x = values[i]
                if  (x <= maxValue && x >= minValue) {
                    sum += x;
                    cnt++
                }
            }

            if (cnt==0) return avg

            return sum/cnt
        }

        function syncTime() {
            var StartTime = new Date();
            var StartNow = window.performance.now ? window.performance.now() : 0

            xhr = new XMLHttpRequest();
            //xhr.open("HEAD", "//www.googleapis.com",true);
            //xhr.open("HEAD", "//s3.amazonaws.com/gopuff-locales/locales.csv",true);
            //xhr.open("GET", "sync",true);
            xhr.open("GET", "//jssync.azurewebsites.net/sync",true);
            xhr.onreadystatechange=function() {
                if (xhr.readyState==4) {
                    var stime = new Date(xhr.getResponseHeader("Date")) 
                    try {
                    var json = JSON.parse (xhr.responseText)
                    stime = new Date(json.time)
                    } catch (err) {}

                    var EndTime = new Date();
                    var EndNow = window.performance.now ? window.performance.now() : 0

                    //console.log (`client ${EndTime.toISOString()} server ${stime.toISOString()}`)
                    var dtime = StartNow ? (EndNow - StartNow) : (EndTime - StartTime)
                    timeDiff = stime - EndTime +  dtime/2 
                    //if (EndNow) timeDiff = stime.getTime() - performance.timing.navigationStart - EndNow + dtime/2

                    timeDiffArr.push (timeDiff)
            
                    retryCount++
                    timeDiff = filterOutliers(timeDiffArr)|0
                    var done = false
                    var thresh =  Math.abs(timeDiff-ac.diffBase)> acceptedDelay
                    if (thresh) runningNarrow = 0 
                    else runningNarrow++
                    ac.retries = retryCount
                    if (retryCount < retryMax && (retryCount<retryMin || runningNarrow<runningMax)) {
                        syncTime();
                    //console.log (Math.abs(timeDiff-ac.diff))
                    } else {
                        console.log ("attempts [" + timeDiffArr + "]\n[completed sync] retries: " + retryCount )
                        console.log ("[completed sync] delta: " + timeDiff)
                        if (window.onAccuServerReady) window.onAccuServerReady()
                        done = true
                    }
                    if (1) {                    
                        if (done) {
                            window.localStorage.setItem(lastSyncKey, '' + (new Date()));
                            window.localStorage.setItem(timeDiffKey, timeDiff);
                        }
                        ac.diffBase = timeDiff
                        ac.diff = ac.diffBase + ac.shift
                    }
                }
            }
            xhr.send(null);
        }
    }

    ac.forceSync();  
    return ac
}


// =====================================================================
// accuServer Commands
// =====================================================================
var xs_accuCommands = []
function xs_accuPush(data, when) {
    var last = xs_accuCommands.length-1
    data.when = when || data.when || xs_accuServer.when()
    xs_accuCommands.push(data)

    //sort if necessary
    if (last>=0 && xs_accuCommands[last].when<=data.when) return; 
    xs_accuCommands.sort (function (a,b) {
        return a.when - b.when
    })
}

function xs_accuPop(when) {
    var shift_av = xs_accuServer.shift_av()
    when = (when || xs_accuServer.when()) + 3 //bias
    while (xs_accuCommands.length && when+(xs_accuCommands[0].type=='av' ? shift_av : 0)>=xs_accuCommands[0].when)
        return xs_accuCommands.shift()
    return null
}

function xs_accuExec(data) {
    var tc = xs_accuCommands [data.target] =  xs_accuCommands [data.target] || {}
    if (!tc[data.method]) {
        console.error('missing command: ' + data.method);
        return false
    }
    tc[data.method].func.call (tc[data.method].thisObj, data) //run it
    return true
}

function xs_accuRegister(target, method, thisObj, func) {
    var tc = xs_accuCommands [target] =  xs_accuCommands [target] || {}
    if (!tc) return false
    tc[method]= {
        thisObj: thisObj,
        func: func
    }
    return true
}



// =====================================================================
// instantiate
// =====================================================================
var xs_accuServer = accuServer() //create instance

