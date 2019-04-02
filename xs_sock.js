
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
function xs_sockPush(data, when) {
    var last = xs_sockCommands.length-1
    data.when = when || data.when || 0
    xs_sockCommands.push(data)

    //sort if necessary
    if (last>=0 && xs_sockCommands[last].when<=data.when) return; 
    xs_sockCommands.sort (function (a,b) {
        return a.when - b.when
    })
}

function xs_sockPop(when) {
    while (xs_sockCommands.length && when>=xs_sockCommands[0].when)
        return xs_sockCommands.shift()
    return null
}

function xs_sockExec(data) {
    var tc = xs_sockCommands [data.target] =  xs_sockCommands [data.target] || {}
    if (!tc[data.method]) {
        console.error('missing command: ' + data.method);
        return false
    }
    tc[data.method].func.call (tc[data.method].thisObj, data) //run it
    return true
}

function xs_sockRegister(target, method, thisObj, func) {
    var tc = xs_sockCommands [target] =  xs_sockCommands [target] || {}
    if (!tc) return false
    tc[method]= {
        thisObj: thisObj,
        func: func
    }
    return true
}



// =====================================================================
// websockets
// =====================================================================
var xs_sock=0;
var xs_sockGUID = xs_GUIDGen()
function xs_sockReady() {
    return xs_sock && xs_sock.readyState==1
}
function xs_sockVerify(force) {
    if (xs_sock==0 || force || xs_sock.readyState!=1) {
        var urlWS = (window.location.protocol=='http:' ? 'ws://' : 'wss://') + window.location.hostname + ':'
        urlWS += window.location.port 
        urlWS = 'wss://jssync.azurewebsites.net/'
        if (xs_sock) xs_sock.close()
        xs_sock = new WebSocket(urlWS);
        xs_sock.onopen = function (event) {
            xs_sockRemote ({socket_guid:xs_sockGUID}) //respond with GUID
            document.dispatchEvent(new CustomEvent('xs_sock'), {detail:{msg:'open'}})
            };
        xs_sock.onclose = function (event) {
            document.dispatchEvent(new CustomEvent('xs_sock'), {detail:{msg:'close'}})
            };
        xs_sock.onerror = function (event) {
            document.dispatchEvent(new CustomEvent('xs_sock'), {detail:{msg:'error'}})
            };
        xs_sock.onmessage = function(evt) {
            //console.log("A spanner has been updated. Please refresh the page to see changes.");
            var data = evt.data
            try {
                data = JSON.parse(data)
            } catch (err) {}
            console.log('==>',data);

            if (data.target=='page') {
                switch (data.method) {
                    case 'reload': window.location.reload(); break;
                }
                return;
            }
            xs_sockPush(data)
        }
    }
}
if (1){
    xs_sockVerify();
    setInterval(function(){xs_sockVerify();}, 3000);
}
function xs_sockRemote(msg, delay) {
    if (typeof(msg)!='string') msg = JSON.stringify(msg)
    console.log('<--',msg);
    if (!delay) xs_sock.send(msg);
    else setTimeout (function() {xs_sock.send(msg)}, delay) 
}