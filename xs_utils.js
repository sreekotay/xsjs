// =====================================================================
// Utility functions
// =====================================================================
function xs_multiCallback (names, func) {
    function removeMe(n) {
        var index = names.indexOf(n)
        if (index<0) return
        names.splice(index, 1)
        if (names.length==0)   {func(); return}
    }
    for (var i in names) {
        var n = names[i]
        var f = window[n] 
        window[n] = function(n, f) {return function() {removeMe(n); if (f) f()}} (n);
    }
}
Number.prototype.pad = function(n) {
  for (var r = this.toString(); r.length < n; r = 0 + r);
  return r;
};


function xs_GUIDGen() {
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
    }
     
    // then to call it, plus stitch in '4' in the third group
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}



function xs_cookie(cname, cvalue, exMS) {
    //set
    if (cvalue===null) {
      document.cookie = cname+'=; Max-Age=-99999999;';
      return null;
    }
    if (cvalue!==undefined) {
        var expires = ''
        if (exMS) {
            var d = new Date();
            d.setTime(d.getTime() + exMS);
            expires = ";expires="+ d.toUTCString();
        }
        document.cookie = cname + "=" + encodeURIComponent(cvalue) + expires + ";path=/";
        return cvalue;
    }
    //get
    try {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ')
              c = c.substring(1);
          if (c.indexOf(name) == 0)
              return c.substring(name.length, c.length);
      }
    } catch (err) {
      console.log(err)
    }
    return "";
}


function ms2html (now) {
    var milli = (now%1000)|0,
        sec = ((now%60000)/1000)|0,
        min = (now/60000)|0;
    var colstr = "<span style='opacity:0.8'>:</span>"
    var ihtml = '' +
        min.pad(2) + colstr +
        sec.pad(2) + colstr +
        milli.pad().padStart(3, '0');
    return ihtml
}

function date2html (now) {
    var milli = now.getMilliseconds(),
        sec = now.getSeconds(),
        min = now.getMinutes(),
        hou = now.getHours(),
        mo = now.getMonth(),
        dy = now.getDate(),
        yr = now.getFullYear();
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var colstr = "<span style='opacity:0.5'>:</span>"
    var ihtml = months[mo] + ' ' + 
        dy + ' ' + 
        yr + ' &nbsp;' + 
        hou.pad(2) + colstr +
        min.pad(2) + colstr +
        sec.pad(2) + colstr +
        milli;
    return ihtml
}

var xs_getKey = function(obj, value) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            if (obj[prop] === value) 
                return prop;
        }
    }

    return null;
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

  
 var xs_browserType = function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/windows phone/i.test(userAgent))                           return "Windows Phone";
    if (/android/i.test(userAgent))                                 return "Android";
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)     return "iOS";

    return "unknown";
}();

