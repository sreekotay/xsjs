// =====================================================================
// DOM functions
// =====================================================================
function xs_id (id) {return document.getElementById(id)}

function xs_get (obj, path, access) { //get "dotted" path (access is an optional user provided object for caching)
    if (this!=window) {value=obj; obj=this; }
    if (access && path in access) return access[path]
    var split = path.split(".")
    for (var i=0; i<split.length && (obj||!i); i++) 
        obj = obj[split[i]] || null
    if (access) access[path] = obj
        return obj
}


var xs_getKey = function(obj, value) { //find key give value
    if (this!=window) {value=obj; obj=this; }
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            if (obj[prop] === value) 
                return prop;
        }
    }

    return null;
}
Object.prototype.xs_get = xs_get
Object.prototype.xs_getKey = xs_getKey




// third party

/*!
 * Run a callback function after scrolling has stopped
 * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Function} callback The function to run after scrolling
 */
// modified to include start and stop
var scrollStop = function (startcb, stopcb) {

	// Make sure a valid callback was provided
	if (!stopcb && !startcb) return;
	if (!startcb && typeof startcb !== 'function') return;
	if (!stopcb && typeof stopcb !== 'function') return;

	// Setup scrolling variable
	var isScrolling, touching, mousing;

    /*
    window.addEventListener('touchstart', function (event)  {touching = true}, false)
    window.addEventListener('touchend', function (event)    {touching = false; scrollCheck()}, false)
    window.addEventListener('touchcancel', function (event) {touching = false; scrollCheck()}, false)
    */
    window.addEventListener('mousedown', function (event)   {mousing = true}, false)
    window.addEventListener('mouseup', function (event)     {mousing = false; scrollCheck()}, false)

	// Listen for scroll events
	window.addEventListener('scroll', scrollCheck, false)
	window.addEventListener('touchmove', scrollCheck, false)

    function scrollCheck() {
        if (!isScrolling && startcb) startcb()
        
        // Clear our timeout throughout the scroll
		window.clearTimeout(isScrolling);

		// Set a timeout to run after scrolling ends
		isScrolling = setTimeout(function() {
            if (touching || mousing) return scrollCheck()

			// Run the callback
            if (stopcb) stopcb();
            isScrolling = null

		}, 300);
       
    }   
   
};


// how much of an element is inview?
function inViewportPercent (element, coverage) {
    coverage = coverage || 0.1

    var eb  = element.getBoundingClientRect();

    const intersection = {
        l: Math.max(eb.left,   window.innerWidth*coverage),
        t: Math.max(eb.top,    window.innerHeight*coverage),
        r: Math.min(eb.right,  window.innerWidth*(1-coverage)),
        b: Math.min(eb.bottom, window.innerHeight*(1-coverage))
    };

    if (intersection.r<intersection.l || intersection.b<intersection.t) return 0
    return (intersection.b-intersection.t)/eb.height*(intersection.r-intersection.l)/eb.width
}

/*!
 * in-view 0.6.1 - Get notified when a DOM element enters or exits the viewport.
 * Copyright (c) 2016 Cam Wiegert <cam@camwiegert.com> - https://camwiegert.github.io/in-view
 * License: MIT
 */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.inView=e():t.inView=e()}(this,function(){return function(t){function e(r){if(n[r])return n[r].exports;var i=n[r]={exports:{},id:r,loaded:!1};return t[r].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}var i=n(2),o=r(i);t.exports=o["default"]},function(t,e){function n(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}t.exports=n},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(9),o=r(i),u=n(3),f=r(u),s=n(4),c=function(){if("undefined"!=typeof window){var t=100,e=["scroll","resize","load"],n={history:[]},r={offset:{},threshold:0,test:s.inViewport},i=(0,o["default"])(function(){n.history.forEach(function(t){n[t].check()})},t);e.forEach(function(t){return addEventListener(t,i)}),window.MutationObserver&&addEventListener("DOMContentLoaded",function(){new MutationObserver(i).observe(document.body,{attributes:!0,childList:!0,subtree:!0})});var u=function(t){if("string"==typeof t){var e=[].slice.call(document.querySelectorAll(t));return n.history.indexOf(t)>-1?n[t].elements=e:(n[t]=(0,f["default"])(e,r),n.history.push(t)),n[t]}};return u.offset=function(t){if(void 0===t)return r.offset;var e=function(t){return"number"==typeof t};return["top","right","bottom","left"].forEach(e(t)?function(e){return r.offset[e]=t}:function(n){return e(t[n])?r.offset[n]=t[n]:null}),r.offset},u.threshold=function(t){return"number"==typeof t&&t>=0&&t<=1?r.threshold=t:r.threshold},u.test=function(t){return"function"==typeof t?r.test=t:r.test},u.is=function(t){return r.test(t,r)},u.offset(0),u}};e["default"]=c()},function(t,e){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),i=function(){function t(e,r){n(this,t),this.options=r,this.elements=e,this.current=[],this.handlers={enter:[],exit:[]},this.singles={enter:[],exit:[]}}return r(t,[{key:"check",value:function(){var t=this;return this.elements.forEach(function(e){var n=t.options.test(e,t.options),r=t.current.indexOf(e),i=r>-1,o=n&&!i,u=!n&&i;o&&(t.current.push(e),t.emit("enter",e)),u&&(t.current.splice(r,1),t.emit("exit",e))}),this}},{key:"on",value:function(t,e){return this.handlers[t].push(e),this}},{key:"once",value:function(t,e){return this.singles[t].unshift(e),this}},{key:"emit",value:function(t,e){for(;this.singles[t].length;)this.singles[t].pop()(e);for(var n=this.handlers[t].length;--n>-1;)this.handlers[t][n](e);return this}}]),t}();e["default"]=function(t,e){return new i(t,e)}},function(t,e){"use strict";function n(t,e){var n=t.getBoundingClientRect(),r=n.top,i=n.right,o=n.bottom,u=n.left,f=n.width,s=n.height,c={t:o,r:window.innerWidth-u,b:window.innerHeight-r,l:i},a={x:e.threshold*f,y:e.threshold*s};return c.t>e.offset.top+a.y&&c.r>e.offset.right+a.x&&c.b>e.offset.bottom+a.y&&c.l>e.offset.left+a.x}Object.defineProperty(e,"__esModule",{value:!0}),e.inViewport=n},function(t,e){(function(e){var n="object"==typeof e&&e&&e.Object===Object&&e;t.exports=n}).call(e,function(){return this}())},function(t,e,n){var r=n(5),i="object"==typeof self&&self&&self.Object===Object&&self,o=r||i||Function("return this")();t.exports=o},function(t,e,n){function r(t,e,n){function r(e){var n=x,r=m;return x=m=void 0,E=e,w=t.apply(r,n)}function a(t){return E=t,j=setTimeout(h,e),M?r(t):w}function l(t){var n=t-O,r=t-E,i=e-n;return _?c(i,g-r):i}function d(t){var n=t-O,r=t-E;return void 0===O||n>=e||n<0||_&&r>=g}function h(){var t=o();return d(t)?p(t):void(j=setTimeout(h,l(t)))}function p(t){return j=void 0,T&&x?r(t):(x=m=void 0,w)}function v(){void 0!==j&&clearTimeout(j),E=0,x=O=m=j=void 0}function y(){return void 0===j?w:p(o())}function b(){var t=o(),n=d(t);if(x=arguments,m=this,O=t,n){if(void 0===j)return a(O);if(_)return j=setTimeout(h,e),r(O)}return void 0===j&&(j=setTimeout(h,e)),w}var x,m,g,w,j,O,E=0,M=!1,_=!1,T=!0;if("function"!=typeof t)throw new TypeError(f);return e=u(e)||0,i(n)&&(M=!!n.leading,_="maxWait"in n,g=_?s(u(n.maxWait)||0,e):g,T="trailing"in n?!!n.trailing:T),b.cancel=v,b.flush=y,b}var i=n(1),o=n(8),u=n(10),f="Expected a function",s=Math.max,c=Math.min;t.exports=r},function(t,e,n){var r=n(6),i=function(){return r.Date.now()};t.exports=i},function(t,e,n){function r(t,e,n){var r=!0,f=!0;if("function"!=typeof t)throw new TypeError(u);return o(n)&&(r="leading"in n?!!n.leading:r,f="trailing"in n?!!n.trailing:f),i(t,e,{leading:r,maxWait:e,trailing:f})}var i=n(7),o=n(1),u="Expected a function";t.exports=r},function(t,e){function n(t){return t}t.exports=n}])});



/* scroll into view - Copyright (c) 2014 Kory Nunn - https://github.com/korynunn/scroll-into-view */
/*
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
    var COMPLETE="complete",CANCELED="canceled";function raf(e){if("requestAnimationFrame"in window)return window.requestAnimationFrame(e);setTimeout(e,16)}function setElementScroll(e,t,n){e.self===e?e.scrollTo(t,n):(e.scrollLeft=t,e.scrollTop=n)}function getTargetScrollLocation(e,t,n){var l,i,r,a,o,s,f,c=e.getBoundingClientRect(),d=n&&null!=n.left?n.left:.5,u=n&&null!=n.top?n.top:.5,m=n&&null!=n.leftOffset?n.leftOffset:0,g=n&&null!=n.topOffset?n.topOffset:0,h=d,p=u;if(t.self===t)s=Math.min(c.width,t.innerWidth),f=Math.min(c.height,t.innerHeight),i=c.left+t.pageXOffset-t.innerWidth*h+s*h,r=c.top+t.pageYOffset-t.innerHeight*p+f*p,r-=g,a=(i-=m)-t.pageXOffset,o=r-t.pageYOffset;else{s=c.width,f=c.height,l=t.getBoundingClientRect();var E=c.left-(l.left-t.scrollLeft),v=c.top-(l.top-t.scrollTop);i=E+s*h-t.clientWidth*h,r=v+f*p-t.clientHeight*p,i=Math.max(Math.min(i,t.scrollWidth-t.clientWidth),0),r=Math.max(Math.min(r,t.scrollHeight-t.clientHeight),0),r-=g,a=(i-=m)-t.scrollLeft,o=r-t.scrollTop}return{x:i,y:r,differenceX:a,differenceY:o}}function animate(e){var t=e._scrollSettings;if(t){var n=getTargetScrollLocation(t.target,e,t.align),l=Date.now()-t.startTime,i=Math.min(1/t.time*l,1);if(l>t.time&&t.endIterations>3)return setElementScroll(e,n.x,n.y),e._scrollSettings=null,t.end(COMPLETE);t.endIterations++;var r=1-t.ease(i);if(setElementScroll(e,n.x-n.differenceX*r,n.y-n.differenceY*r),l>=t.time)return animate(e);raf(animate.bind(null,e))}}function transitionScrollTo(e,t,n,l){var i,r=!t._scrollSettings,a=t._scrollSettings,o=Date.now();function s(e){t._scrollSettings=null,t.parentElement&&t.parentElement._scrollSettings&&t.parentElement._scrollSettings.end(e),l(e),t.removeEventListener("touchstart",i,{passive:!0}),t.removeEventListener("wheel",i,{passive:!0})}a&&a.end(CANCELED),t._scrollSettings={startTime:a?a.startTime:Date.now(),endIterations:0,target:e,time:n.time+(a?o-a.startTime:0),ease:n.ease,align:n.align,end:s},i=s.bind(null,CANCELED),t.addEventListener("touchstart",i,{passive:!0}),t.addEventListener("wheel",i,{passive:!0}),r&&animate(t)}function defaultIsScrollable(e){return"pageXOffset"in e||(e.scrollHeight!==e.clientHeight||e.scrollWidth!==e.clientWidth)&&"hidden"!==getComputedStyle(e).overflow}function defaultValidTarget(){return!0}module.exports=function(e,t,n){if(e){"function"==typeof t&&(n=t,t=null),t||(t={}),t.time=isNaN(t.time)?1e3:t.time,t.ease=t.ease||function(e){return 1-Math.pow(1-e,e/2)};for(var l=e.parentElement,i=0,r=t.validTarget||defaultValidTarget,a=t.isScrollable;l;){if(r(l,i)&&(a?a(l,defaultIsScrollable):defaultIsScrollable(l))&&(i++,transitionScrollTo(e,l,t,o)),!(l=l.parentElement))return;"BODY"===l.tagName&&(l=(l=l.ownerDocument).defaultView||l.ownerWindow)}}function o(e){--i||n&&n(e)}};
    
    },{}],2:[function(require,module,exports){
    window.scrollIntoView=require("./scrollIntoView");
    
    },{"./scrollIntoView":1}]},{},[2]);
*/
var COMPLETE = 'complete',
    CANCELED = 'canceled';

function raf(task){
    if('requestAnimationFrame' in window){
        return window.requestAnimationFrame(task);
    }

    setTimeout(task, 16);
}

function setElementScroll(element, x, y){
    if(element.self === element){
        element.scrollTo(x, y);
    }else{
        element.scrollLeft = x;
        element.scrollTop = y;
    }
}

function getTargetScrollLocation(target, parent, align, preventInsideScroll){
    var targetPosition = target.getBoundingClientRect(),
        parentPosition,
        x,
        y,
        differenceX,
        differenceY,
        targetWidth,
        targetHeight,
        leftAlign = align && align.left != null ? align.left : 0.5,
        topAlign = align && align.top != null ? align.top : 0.5,
        leftOffset = align && align.leftOffset != null ? align.leftOffset : 0,
        topOffset = align && align.topOffset != null ? align.topOffset : 0,
        leftScalar = leftAlign,
        topScalar = topAlign;

    if(parent.self === parent){
        targetWidth = Math.min(targetPosition.width, parent.innerWidth);
        targetHeight = Math.min(targetPosition.height, parent.innerHeight);
        x = targetPosition.left + parent.pageXOffset - parent.innerWidth * leftScalar + targetWidth * leftScalar;
        y = targetPosition.top + parent.pageYOffset - parent.innerHeight * topScalar + targetHeight * topScalar;
        x -= leftOffset;
        y -= topOffset;

        if (preventInsideScroll) {
            if (targetPosition.left<=0 && targetPosition.right>window.innerWidth)   x =  parent.pageXOffset
            if (targetPosition.top<=0 && targetPosition.bottom>window.innerHeight)  y =  parent.pageYOffset
        }

        differenceX = x - parent.pageXOffset;
        differenceY = y - parent.pageYOffset;
    }else{
        targetWidth = targetPosition.width;
        targetHeight = targetPosition.height;
        parentPosition = parent.getBoundingClientRect();
        var offsetLeft = targetPosition.left - (parentPosition.left - parent.scrollLeft);
        var offsetTop = targetPosition.top - (parentPosition.top - parent.scrollTop);
        x = offsetLeft + (targetWidth * leftScalar) - parent.clientWidth * leftScalar;
        y = offsetTop + (targetHeight * topScalar) - parent.clientHeight * topScalar;
        x = Math.max(Math.min(x, parent.scrollWidth - parent.clientWidth), 0);
        y = Math.max(Math.min(y, parent.scrollHeight - parent.clientHeight), 0);
        x -= leftOffset;
        y -= topOffset;

        if (preventInsideScroll) {
            if (targetPosition.left<=0 && targetPosition.right>window.innerWidth)   x =  parent.scrollLeft
            if (targetPosition.top<=0 && targetPosition.bottom>window.innerHeight)  y =  parent.scrollTop
        }

        differenceX = x - parent.scrollLeft;
        differenceY = y - parent.scrollTop;
    }

    return {
        x: x,
        y: y,
        differenceX: differenceX,
        differenceY: differenceY
    };
}

function animate(parent){
    var scrollSettings = parent._scrollSettings;
    if(!scrollSettings){
        return;
    }

    var location = getTargetScrollLocation(scrollSettings.target, parent, scrollSettings.align, scrollSettings.preventInsideScroll),
        time = Date.now() - scrollSettings.startTime,
        timeValue = Math.min(1 / scrollSettings.time * time, 1);

    

    if(
        time > scrollSettings.time &&
        scrollSettings.endIterations > 3
    ){
        setElementScroll(parent, location.x, location.y);
        parent._scrollSettings = null;
        return scrollSettings.end(COMPLETE);
    }

    scrollSettings.endIterations++;

    var easeValue = 1 - scrollSettings.ease(timeValue);

    setElementScroll(parent,
        location.x - location.differenceX * easeValue,
        location.y - location.differenceY * easeValue
    );

    // At the end of animation, loop synchronously
    // to try and hit the taget location.
    if(time >= scrollSettings.time){
        return animate(parent);
    }

    raf(animate.bind(null, parent));
}
function transitionScrollTo(target, parent, settings, callback){
    var idle = !parent._scrollSettings,
        lastSettings = parent._scrollSettings,
        now = Date.now(),
        endHandler;

    if(lastSettings){
        lastSettings.end(CANCELED);
    }

    function end(endType){
        parent._scrollSettings = null;
        if(parent.parentElement && parent.parentElement._scrollSettings){
            parent.parentElement._scrollSettings.end(endType);
        }
        callback(endType);
        parent.removeEventListener('touchstart', endHandler, { passive: true });
        parent.removeEventListener('wheel', endHandler, { passive: true });
    }

    parent._scrollSettings = {
        startTime: lastSettings ? lastSettings.startTime : Date.now(),
        endIterations: 0,
        preventInsideScroll: settings.preventInsideScroll,
        target: target,
        time: settings.time + (lastSettings ? now - lastSettings.startTime : 0),
        ease: settings.ease,
        align: settings.align,
        end: end
    };

    endHandler = end.bind(null, CANCELED);
    parent.addEventListener('touchstart', endHandler, { passive: true });
    parent.addEventListener('wheel', endHandler, { passive: true });

    if(idle){
        animate(parent);
    }
}

function defaultIsScrollable(element){
    return (
        'pageXOffset' in element ||
        (
            element.scrollHeight !== element.clientHeight ||
            element.scrollWidth !== element.clientWidth
        ) &&
        getComputedStyle(element).overflow !== 'hidden'
    );
}

function defaultValidTarget(){
    return true;
}


scrollIntoView = function(target, settings, callback){
    if(!target){
        return;
    }

    if(typeof settings === 'function'){
        callback = settings;
        settings = null;
    }

    if(!settings){
        settings = {};
    }

    settings.time = isNaN(settings.time) ? 1000 : settings.time;
    settings.ease = settings.ease || function(v){return 1 - Math.pow(1 - v, v / 2);};

    var parent = target.parentElement,
        parents = 0;

    function done(endType){
        parents--;
        if(!parents){
            callback && callback(endType);
        }
    }

    var validTarget = settings.validTarget || defaultValidTarget;
    var isScrollable = settings.isScrollable;

    while(parent){
        if(validTarget(parent, parents) && (isScrollable ? isScrollable(parent, defaultIsScrollable) : defaultIsScrollable(parent))){
            parents++;
            transitionScrollTo(target, parent, settings, done);
        }

        parent = parent.parentElement;

        if(!parent){
            return;
        }

        if(parent.tagName === 'BODY'){
            parent = parent.ownerDocument;
            parent = parent.defaultView || parent.ownerWindow;
        }
    }
};

/* squirrely */
// https://github.com/nebrelbug/squirrelly -- MIT license

!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports.Sqrl=n():e.Sqrl=n()}("undefined"!=typeof self?self:this,function(){return function(e){var n={};function r(t){if(n[t])return n[t].exports;var i=n[t]={i:t,l:!1,exports:{}};return e[t].call(i.exports,i,i.exports,r),i.l=!0,i.exports}return r.m=e,r.c=n,r.d=function(e,n,t){r.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,n){if(1&n&&(e=r(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(r.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var i in e)r.d(t,i,function(n){return e[n]}.bind(null,i));return t},r.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(n,"a",n),n},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},r.p="",r(r.s=1)}([function(e,n){e.exports=require("fs")},function(e,n,r){"use strict";r.r(n);var t={};r.r(t),r.d(t,"H",function(){return i}),r.d(t,"Compile",function(){return F}),r.d(t,"defineFilter",function(){return P}),r.d(t,"defineHelper",function(){return j}),r.d(t,"defineNativeHelper",function(){return k}),r.d(t,"definePartial",function(){return _}),r.d(t,"Render",function(){return q}),r.d(t,"renderFile",function(){return C}),r.d(t,"load",function(){return E}),r.d(t,"__express",function(){return I}),r.d(t,"F",function(){return y}),r.d(t,"setDefaultFilters",function(){return b}),r.d(t,"autoEscaping",function(){return S}),r.d(t,"defaultTags",function(){return c});var i={},u=/{{ *?(?:(?:(?:(?:([\w$]+ *?(?:[^\s\w($][^\n]*?)*?))|(?:@(?:([\w$]+:|(?:\.\.\/)+))? *(.+?) *))(?: *?(\| *?[\w$]+? *?)+?)?)|(?:([\w$]+) *?\(([^\n]*?)\) *?([\w$]*))|(?:\/ *?([\w$]+))|(?:# *?([\w$]+))|(?:([\w$]+) *?\(([^\n]*?)\) *?\/)|(?:!--[^]+?--)) *?}}\n?/g,o={s:"{{",e:"}}"},l=/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[\\]@(?:[\w$]*:)?[\w$]+|@(?:([\w$]*):)?([\w$]+)/g,f=u,a=o;function c(e){s(e[0],e[1]),u=f,o=a}function s(e,n){var r=e+f.source.slice(a.s.length,0-(a.e.length+3))+n+"\\n?",t=f.lastIndex;a={s:e,e:n},(f=RegExp(r,"g")).lastIndex=t}function d(e){return e=e.replace(l,function(e,n,r){return void 0===r?e:(void 0===n&&(n=""),"hvals"+n+"."+r)})}var v={if:{helperStart:function(e){return"if("+e+"){"},helperEnd:function(){return"}"},blocks:{else:function(){return"}else{"}}},each:{helperStart:function(e,n){return"for(var i=0;i<"+e+".length; i++){tR+=(function(hvals){var tR='';var hvals"+n+"=hvals;"},helperEnd:function(e){return"return tR})({this:"+e+"[i],index:i})};"}},foreach:{helperStart:function(e,n){return"for(var key in "+e+"){if(!"+e+".hasOwnProperty(key)) continue;tR+=(function(hvals){var tR='';var hvals"+n+"=hvals;"},helperEnd:function(e){return"return tR})({this:"+e+"[key], key: key})};"}},log:{selfClosing:function(e){return"console.log("+e+");"}},tags:{selfClosing:function(e){return s(e.slice(0,e.indexOf(",")).trim(),e.slice(e.indexOf(",")+1).trim()),""}},js:{selfClosing:function(e){return e+";"}}},p={"&":"&amp;","<":"&lt;",'"':"&quot;","'":"&#39;"};function h(e){return p[e]}var g=/[&<"']/g,x=/[&<"']/,y={e:function(e){var n=String(e);return x.test(n)?n.replace(g,h):n}},R={},m={start:"",end:""};function b(e){if("clear"===e)R={};else for(var n in e)e.hasOwnProperty(n)&&(R[n]=e[n]);!function(){for(var e in m={start:"",end:""},R)R.hasOwnProperty(e)&&R[e]&&(m.start+="Sqrl.F."+e+"(",m.end+=")")}()}var w=!0;function S(e){return w=e}function $(e,n){var r,t=!1,i="",u="";if(n&&""!==n){r=n.split("|");for(var o=0;o<r.length;o++)r[o]=r[o].trim(),""!==r[o]&&("safe"!==r[o]?(i="Sqrl.F."+r[o]+"("+i,u+=")"):t=!0)}return i+=m.start,u+=m.end,!t&&w&&(i+="Sqrl.F.e(",u+=")"),i+e+u}var O={};var F=function(e){var n,r=0,t="",i=[],l=-1,c=0,s={};for(a=o,(f=u).lastIndex=0;null!==(n=f.exec(e));){if(""===t?t+="var tR='"+e.slice(r,n.index).replace(/'/g,"\\'")+"';":r!==n.index&&(t+="tR+='"+e.slice(r,n.index).replace(/'/g,"\\'")+"';"),r=n[0].length+n.index,n[1])t+="tR+="+P(n[1],n[4])+";";else if(n[3])t+="tR+="+j(n[3],n[2],n[4])+";";else if(n[5]){var p=n[7];""!==p&&null!==p||(p=c,c++);var h=v.hasOwnProperty(n[5]);l+=1;var g=n[6]||"";g=d(g),h||(g="["+g+"]");var x={name:n[5],id:p,params:g,native:h};i[l]=x,h?(t+=v[n[5]].helperStart(g,p),r=f.lastIndex):t+="tR+=Sqrl.H."+n[5]+"("+g+",function(hvals){var hvals"+p+"=hvals;var tR='';"}else if(n[8]){var y=i[l];y&&y.name===n[8]?(l-=1,!0===y.native?t+=v[y.name].helperEnd(y.params,y.id):s[y.id]?t+="return tR}});":t+="return tR});"):console.error("Helper beginning & end don't match.")}else if(n[9]){var R=i[l];if(R.native){var m=v[R.name];m.blocks&&m.blocks[n[9]]?(t+=m.blocks[n[9]](R.id),r=f.lastIndex):console.warn("Native helper '%s' doesn't accept that block.",R.name)}else s[R.id]?t+="return tR},"+n[9]+":function(hvals){var hvals"+R.id+"=hvals;var tR='';":(t+="return tR},{"+n[9]+":function(hvals){var hvals"+R.id+"=hvals;var tR='';",s[R.id]=!0)}else if(n[10]){var b=n[11]||"";if(b=d(b),"include"===n[10]){var w=e.slice(0,n.index),S=e.slice(n.index+n[0].length),F=b.replace(/'|"/g,"");e=w+O[F]+S,r=f.lastIndex=n.index}else v.hasOwnProperty(n[10])&&v[n[10]].hasOwnProperty("selfClosing")?(t+=v[n[10]].selfClosing(b),r=f.lastIndex):t+="tR+=Sqrl.H."+n[10]+"("+b+");"}function P(e,n){return $("options."+e,n)}function j(e,n,r){return $(void 0!==n?"hvals"+(/(?:\.\.\/)+/g.test(n)?i[l-n.length/3-1].id:n.slice(0,-1))+"."+e:"hvals."+e,r)}}return""===t?t+="var tR='"+e.slice(r,e.length).replace(/'/g,"\\'")+"';":r!==e.length&&(t+="tR+='"+e.slice(r,e.length).replace(/'/g,"\\'")+"';"),t+="return tR",new Function("options","Sqrl",t.replace(/\n/g,"\\n").replace(/\r/g,"\\r"))};function P(e,n){y[e]=n}function j(e,n){i[e]=n}function k(e,n){v[e]=n}function q(e,n){return"function"==typeof e?e(n,t):"string"==typeof e?E(n,e)(n,t):void 0}function _(e,n){O[e]=n}var H={};function E(e,n){var t=e.$file,i=e.$name,u=e.$cache;if(!1===u)return F(n);if(t){if(H[t])return H[t];var o=r(0).readFileSync(t,"utf8");return H[t]=F(o),H[t]}return i?H[i]?H[i]:n?(H[i]=F(n),H[i]):void 0:n?!0===u?H[n]?H[n]:(H[n]=F(n),H[n]):F(n):"Error"}function C(e,n){return n.$file=e,E(n)(n,t)}function I(e,n,r){return r(null,C(e,n))}r.d(n,"H",function(){return i}),r.d(n,"Compile",function(){return F}),r.d(n,"defineFilter",function(){return P}),r.d(n,"defineHelper",function(){return j}),r.d(n,"defineNativeHelper",function(){return k}),r.d(n,"definePartial",function(){return _}),r.d(n,"Render",function(){return q}),r.d(n,"renderFile",function(){return C}),r.d(n,"load",function(){return E}),r.d(n,"__express",function(){return I}),r.d(n,"F",function(){return y}),r.d(n,"setDefaultFilters",function(){return b}),r.d(n,"autoEscaping",function(){return S}),r.d(n,"defaultTags",function(){return c})}])});

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



