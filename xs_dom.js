// =====================================================================
// DOM functions
// =====================================================================
function xs_id (id) {return document.getElementById(id)}

function xs_get (ctx, path, access) {
    if (access && path in access) return access[path]
    var split = path.split(".")
    for (var i=0; i<split.length && (ctx||!i); i++) 
        ctx = ctx[split[i]] || null
    if (access) access[path] = ctx
    return ctx
}



// third party

 //minimal mustach implementation
/* MIT License Copyright (c) 2018 Aishikaty - https://github.com/aishikaty/tiny-mustache */
//usage: xs_mustache (template, obj)
function xs_mustache (template, self, parent, invert, access) {
    var render = xs_mustache
    var output = ""
    var access = {}

    function get (ctx, path, access) {
        if (access && path in access) return access[path]
        var split = path.split(".")
        for (var i=0; i<split.length && (ctx||!i); i++) 
            ctx = ctx[split[i]] || null
        if (access) access[path] = ctx
        return ctx
        }

    self = Array.isArray(self) ? self : (self ? [self] : [])
    self = invert ? (0 in self) ? [] : [1] : self

    for (var i = 0; i < self.length; i++) {
        var childCode = ''
        var depth = 0
        var inverted
        var ctx = (typeof self[i] == "object") ? self[i] : {}
        ctx = Object.assign({}, parent, ctx)
        ctx[""] = {"": self[i]}

        template.replace(/([\s\S]*?)({{((\/)|(\^)|#)(.*?)}}|$)/g,
            function(match, code, y, z, close, invert, name) {
                if (!depth) {
                    output += code.replace(/{{{(.*?)}}}|{{(!?)(&?)(>?)(.*?)}}/g,
                        function(match, raw, comment, isRaw, partial, name) {
                            return raw ? get(ctx, raw, access)
                                : isRaw ? get(ctx, name, access)
                                : partial ? render(get(ctx, name, access), ctx)
                                : !comment ? new Option(get(ctx, name, access)).innerHTML
                                : ""
                            }
                        )
                    inverted = invert
                } else childCode += depth && !close || depth > 1 ? match : code

                if (close) {
                    if (!--depth) {
                        name = get(ctx, name, acce)
                        if (/^f/.test(typeof name)) {
                            output += name.call(ctx, childCode, function (template) {
                                return render(template, ctx)
                            })
                        } else {
                            output += render(childCode, name, ctx, inverted)
                        }
                        childCode = ""
                        }
                } else ++depth
            }
        )
    }
    return output
}

/* squirrely */
// https://github.com/nebrelbug/squirrelly -- MIT license

!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports.Sqrl=n():e.Sqrl=n()}("undefined"!=typeof self?self:this,function(){return function(e){var n={};function r(t){if(n[t])return n[t].exports;var i=n[t]={i:t,l:!1,exports:{}};return e[t].call(i.exports,i,i.exports,r),i.l=!0,i.exports}return r.m=e,r.c=n,r.d=function(e,n,t){r.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,n){if(1&n&&(e=r(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(r.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var i in e)r.d(t,i,function(n){return e[n]}.bind(null,i));return t},r.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(n,"a",n),n},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},r.p="",r(r.s=1)}([function(e,n){e.exports=require("fs")},function(e,n,r){"use strict";r.r(n);var t={};r.r(t),r.d(t,"H",function(){return i}),r.d(t,"Compile",function(){return F}),r.d(t,"defineFilter",function(){return P}),r.d(t,"defineHelper",function(){return j}),r.d(t,"defineNativeHelper",function(){return k}),r.d(t,"definePartial",function(){return _}),r.d(t,"Render",function(){return q}),r.d(t,"renderFile",function(){return C}),r.d(t,"load",function(){return E}),r.d(t,"__express",function(){return I}),r.d(t,"F",function(){return y}),r.d(t,"setDefaultFilters",function(){return b}),r.d(t,"autoEscaping",function(){return S}),r.d(t,"defaultTags",function(){return c});var i={},u=/{{ *?(?:(?:(?:(?:([\w$]+ *?(?:[^\s\w($][^\n]*?)*?))|(?:@(?:([\w$]+:|(?:\.\.\/)+))? *(.+?) *))(?: *?(\| *?[\w$]+? *?)+?)?)|(?:([\w$]+) *?\(([^\n]*?)\) *?([\w$]*))|(?:\/ *?([\w$]+))|(?:# *?([\w$]+))|(?:([\w$]+) *?\(([^\n]*?)\) *?\/)|(?:!--[^]+?--)) *?}}\n?/g,o={s:"{{",e:"}}"},l=/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[\\]@(?:[\w$]*:)?[\w$]+|@(?:([\w$]*):)?([\w$]+)/g,f=u,a=o;function c(e){s(e[0],e[1]),u=f,o=a}function s(e,n){var r=e+f.source.slice(a.s.length,0-(a.e.length+3))+n+"\\n?",t=f.lastIndex;a={s:e,e:n},(f=RegExp(r,"g")).lastIndex=t}function d(e){return e=e.replace(l,function(e,n,r){return void 0===r?e:(void 0===n&&(n=""),"hvals"+n+"."+r)})}var v={if:{helperStart:function(e){return"if("+e+"){"},helperEnd:function(){return"}"},blocks:{else:function(){return"}else{"}}},each:{helperStart:function(e,n){return"for(var i=0;i<"+e+".length; i++){tR+=(function(hvals){var tR='';var hvals"+n+"=hvals;"},helperEnd:function(e){return"return tR})({this:"+e+"[i],index:i})};"}},foreach:{helperStart:function(e,n){return"for(var key in "+e+"){if(!"+e+".hasOwnProperty(key)) continue;tR+=(function(hvals){var tR='';var hvals"+n+"=hvals;"},helperEnd:function(e){return"return tR})({this:"+e+"[key], key: key})};"}},log:{selfClosing:function(e){return"console.log("+e+");"}},tags:{selfClosing:function(e){return s(e.slice(0,e.indexOf(",")).trim(),e.slice(e.indexOf(",")+1).trim()),""}},js:{selfClosing:function(e){return e+";"}}},p={"&":"&amp;","<":"&lt;",'"':"&quot;","'":"&#39;"};function h(e){return p[e]}var g=/[&<"']/g,x=/[&<"']/,y={e:function(e){var n=String(e);return x.test(n)?n.replace(g,h):n}},R={},m={start:"",end:""};function b(e){if("clear"===e)R={};else for(var n in e)e.hasOwnProperty(n)&&(R[n]=e[n]);!function(){for(var e in m={start:"",end:""},R)R.hasOwnProperty(e)&&R[e]&&(m.start+="Sqrl.F."+e+"(",m.end+=")")}()}var w=!0;function S(e){return w=e}function $(e,n){var r,t=!1,i="",u="";if(n&&""!==n){r=n.split("|");for(var o=0;o<r.length;o++)r[o]=r[o].trim(),""!==r[o]&&("safe"!==r[o]?(i="Sqrl.F."+r[o]+"("+i,u+=")"):t=!0)}return i+=m.start,u+=m.end,!t&&w&&(i+="Sqrl.F.e(",u+=")"),i+e+u}var O={};var F=function(e){var n,r=0,t="",i=[],l=-1,c=0,s={};for(a=o,(f=u).lastIndex=0;null!==(n=f.exec(e));){if(""===t?t+="var tR='"+e.slice(r,n.index).replace(/'/g,"\\'")+"';":r!==n.index&&(t+="tR+='"+e.slice(r,n.index).replace(/'/g,"\\'")+"';"),r=n[0].length+n.index,n[1])t+="tR+="+P(n[1],n[4])+";";else if(n[3])t+="tR+="+j(n[3],n[2],n[4])+";";else if(n[5]){var p=n[7];""!==p&&null!==p||(p=c,c++);var h=v.hasOwnProperty(n[5]);l+=1;var g=n[6]||"";g=d(g),h||(g="["+g+"]");var x={name:n[5],id:p,params:g,native:h};i[l]=x,h?(t+=v[n[5]].helperStart(g,p),r=f.lastIndex):t+="tR+=Sqrl.H."+n[5]+"("+g+",function(hvals){var hvals"+p+"=hvals;var tR='';"}else if(n[8]){var y=i[l];y&&y.name===n[8]?(l-=1,!0===y.native?t+=v[y.name].helperEnd(y.params,y.id):s[y.id]?t+="return tR}});":t+="return tR});"):console.error("Helper beginning & end don't match.")}else if(n[9]){var R=i[l];if(R.native){var m=v[R.name];m.blocks&&m.blocks[n[9]]?(t+=m.blocks[n[9]](R.id),r=f.lastIndex):console.warn("Native helper '%s' doesn't accept that block.",R.name)}else s[R.id]?t+="return tR},"+n[9]+":function(hvals){var hvals"+R.id+"=hvals;var tR='';":(t+="return tR},{"+n[9]+":function(hvals){var hvals"+R.id+"=hvals;var tR='';",s[R.id]=!0)}else if(n[10]){var b=n[11]||"";if(b=d(b),"include"===n[10]){var w=e.slice(0,n.index),S=e.slice(n.index+n[0].length),F=b.replace(/'|"/g,"");e=w+O[F]+S,r=f.lastIndex=n.index}else v.hasOwnProperty(n[10])&&v[n[10]].hasOwnProperty("selfClosing")?(t+=v[n[10]].selfClosing(b),r=f.lastIndex):t+="tR+=Sqrl.H."+n[10]+"("+b+");"}function P(e,n){return $("options."+e,n)}function j(e,n,r){return $(void 0!==n?"hvals"+(/(?:\.\.\/)+/g.test(n)?i[l-n.length/3-1].id:n.slice(0,-1))+"."+e:"hvals."+e,r)}}return""===t?t+="var tR='"+e.slice(r,e.length).replace(/'/g,"\\'")+"';":r!==e.length&&(t+="tR+='"+e.slice(r,e.length).replace(/'/g,"\\'")+"';"),t+="return tR",new Function("options","Sqrl",t.replace(/\n/g,"\\n").replace(/\r/g,"\\r"))};function P(e,n){y[e]=n}function j(e,n){i[e]=n}function k(e,n){v[e]=n}function q(e,n){return"function"==typeof e?e(n,t):"string"==typeof e?E(n,e)(n,t):void 0}function _(e,n){O[e]=n}var H={};function E(e,n){var t=e.$file,i=e.$name,u=e.$cache;if(!1===u)return F(n);if(t){if(H[t])return H[t];var o=r(0).readFileSync(t,"utf8");return H[t]=F(o),H[t]}return i?H[i]?H[i]:n?(H[i]=F(n),H[i]):void 0:n?!0===u?H[n]?H[n]:(H[n]=F(n),H[n]):F(n):"Error"}function C(e,n){return n.$file=e,E(n)(n,t)}function I(e,n,r){return r(null,C(e,n))}r.d(n,"H",function(){return i}),r.d(n,"Compile",function(){return F}),r.d(n,"defineFilter",function(){return P}),r.d(n,"defineHelper",function(){return j}),r.d(n,"defineNativeHelper",function(){return k}),r.d(n,"definePartial",function(){return _}),r.d(n,"Render",function(){return q}),r.d(n,"renderFile",function(){return C}),r.d(n,"load",function(){return E}),r.d(n,"__express",function(){return I}),r.d(n,"F",function(){return y}),r.d(n,"setDefaultFilters",function(){return b}),r.d(n,"autoEscaping",function(){return S}),r.d(n,"defaultTags",function(){return c})}])});



/*! animate.js v1.4.0 | (c) 2018 Josh Johnson | https://github.com/jshjohnson/animate.js */
!function(t,i){"function"==typeof define&&define.amd?define(i):"object"==typeof exports?module.exports=i():t.Animate=i()}(this,function(){"use strict";var t=function(t){var i=document.createElement("fakeelement");this.supports="querySelector"in document&&"addEventListener"in window&&"classList"in i&&Function.prototype.bind,this.options=this._extend({target:"[data-animate]",animatedClass:"js-animated",offset:[.5,.5],delay:0,remove:!0,scrolled:!1,reverse:!1,onLoad:!0,onScroll:!0,onResize:!1,disableFilter:null,callbackOnInit:function(){},callbackOnInView:function(){},callbackOnAnimate:function(){}},t||{}),this.elements=document.querySelectorAll(this.options.target),this.initialised=!1,this.verticalOffset=this.options.offset,this.horizontalOffset=this.options.offset,this._isType("Array",this.options.offset)&&(this.verticalOffset=this.options.offset[0],this.horizontalOffset=this.options.offset[1]?this.options.offset[1]:this.options.offset[0]),this.throttledEvent=this._debounce(function(){this.render()}.bind(this),15)};return t.prototype._debounce=function(n,o,s){var a;return function(){var t=this,i=arguments,e=s&&!a;clearTimeout(a),a=setTimeout(function(){a=null,s||n.apply(t,i)},o),e&&n.apply(t,i)}},t.prototype._extend=function(){for(var e={},t=arguments.length,i=function(t){for(var i in t)Object.hasOwnProperty.call(t,i)&&(e[i]=t[i])},n=0;n<t;n++){var o=arguments[n];this._isType("Object",o)?i(o):console.error("Custom options must be an object")}return e},t.prototype._whichAnimationEvent=function(){var t,i=document.createElement("fakeelement"),e={animation:"animationend",OAnimation:"oAnimationEnd",MozAnimation:"animationend",WebkitAnimation:"webkitAnimationEnd"};for(t in e)if(Object.hasOwnProperty.call(e,t)&&void 0!==i.style[t])return e[t]},t.prototype._isAboveScrollPos=function(t){var i=t.getBoundingClientRect(),e=window.scrollY||window.pageYOffset;return i.top+i.height*this.verticalOffset<e},t.prototype._getElementOffset=function(t){var i=t.getAttribute("data-animation-offset"),e=[this.verticalOffset,this.horizontalOffset];if(i){var n=i.split(",");e=1===n.length?[parseFloat(n[0]),parseFloat(n[0])]:[parseFloat(n[0]),parseFloat(n[1])]}return e},t.prototype._isInView=function(t){var i=t.getBoundingClientRect(),e=window.innerHeight||document.documentElement.clientHeight,n=window.innerWidth||document.documentElement.clientWidth,o=this._getElementOffset(t),s=o[0],a=o[1],r=0<i.bottom-i.height*s,l=i.top+i.height*s<e,c=r&&l,d=0<i.right-i.width*a,h=i.left+i.width*a<n;return c&&(d&&h)},t.prototype._isVisible=function(t){return"true"===t.getAttribute("data-visibility")},t.prototype._hasAnimated=function(t){return"true"===t.getAttribute("data-animated")},t.prototype._isType=function(t,i){var e=Object.prototype.toString.call(i).slice(8,-1);return null!=i&&e===t},t.prototype._addAnimation=function(i){if(!this._isVisible(i)){this._doCallback(this.options.callbackOnInView,i);var t=i.getAttribute("data-animation-classes");if(t){i.setAttribute("data-visibility",!0);var e=t.split(" "),n=parseInt(i.getAttribute("data-animation-delay"),10)||this.options.delay,o=function(t){i.classList.add(t)};n&&this._isType("Number",n)&&0!==n?setTimeout(function(){e.forEach(o)},n):e.forEach(o),this._completeAnimation(i)}else console.error("No animation classes were given")}},t.prototype._removeAnimation=function(i){var t=i.getAttribute("data-animation-classes");if(t){i.setAttribute("data-visibility",!1),i.removeAttribute("data-animated");var e=t.split(" "),n=parseInt(i.getAttribute("data-animation-delay"),10),o=function(t){i.classList.remove(t)};e.push(this.options.animatedClass),n&&this._isType("Number",n)?setTimeout(function(){e.forEach(o)},n):e.forEach(o)}else console.error("No animation classes were given")},t.prototype._doCallback=function(t){var i=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null;t&&this._isType("Function",t)?t(i):console.error("Callback is not a function")},t.prototype._completeAnimation=function(i){var t=this._whichAnimationEvent();i.addEventListener(t,function(){if("false"!==i.getAttribute("data-animation-remove")&&this.options.remove){i.getAttribute("data-animation-classes").split(" ").forEach(function(t){i.classList.remove(t)})}i.classList.add(this.options.animatedClass),i.setAttribute("data-animated",!0),this._doCallback(this.options.callbackOnAnimate,i)}.bind(this))},t.prototype.removeEventListeners=function(){this.options.onResize&&window.removeEventListener("resize",this.throttledEvent,!1),this.options.onScroll&&window.removeEventListener("scroll",this.throttledEvent,!1)},t.prototype.addEventListeners=function(){this.options.onLoad&&document.addEventListener("DOMContentLoaded",function(){this.render(!0)}.bind(this)),this.options.onResize&&window.addEventListener("resize",this.throttledEvent,!1),this.options.onScroll&&window.addEventListener("scroll",this.throttledEvent,!1)},t.prototype.init=function(){this.supports&&(this.initialised=!0,this.addEventListeners(),this._doCallback(this.options.callbackOnInit))},t.prototype.kill=function(){this.initialised&&(this.removeEventListeners(),this.options=null,this.initialised=!1)},t.prototype.render=function(t){if(this.initialised){if(this.options.disableFilter&&this._isType("Function",this.options.disableFilter))if(!0===this.options.disableFilter())return;for(var i=this.elements,e=i.length-1;0<=e;e--){var n=i[e];if(this._isInView(n))this._addAnimation(n);else if(this._hasAnimated(n)){"false"!==n.getAttribute("data-animation-reverse")&&this.options.reverse&&this._removeAnimation(n)}else if(t){var o=n.getAttribute("data-animation-scrolled");(this.options.scrolled||o)&&this._isAboveScrollPos(n)&&this._addAnimation(n)}}}},t});


