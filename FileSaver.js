/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs=saveAs||function(e){"use strict";if(!("undefined"==typeof e||"undefined"!=typeof navigator&&/MSIE [1-9]\./.test(navigator.userAgent))){var t=e.document,n=function(){return e.URL||e.webkitURL||e},o=t.createElementNS("http://www.w3.org/1999/xhtml","a"),r="download"in o,a=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},i=/constructor/i.test(e.HTMLElement)||e.safari,d=/CriOS\/[\d]+/.test(navigator.userAgent),f=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},s="application/octet-stream",u=4e4,c=function(e){var t=function(){"string"==typeof e?n().revokeObjectURL(e):e.remove()};setTimeout(t,u)},l=function(e,t,n){t=[].concat(t);for(var o=t.length;o--;){var r=e["on"+t[o]];if("function"==typeof r)try{r.call(e,n||e)}catch(a){f(a)}}},v=function(e){return/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)?new Blob([String.fromCharCode(65279),e],{type:e.type}):e},p=function(t,f,u){u||(t=v(t));var p,w=this,m=t.type,y=m===s,S=function(){l(w,"writestart progress write writeend".split(" "))},h=function(){if((d||y&&i)&&e.FileReader){var o=new FileReader;return o.onloadend=function(){var t=d?o.result:o.result.replace(/^data:[^;]*;/,"data:attachment/file;"),n=e.open(t,"_blank");n||(e.location.href=t),t=void 0,w.readyState=w.DONE,S()},o.readAsDataURL(t),void(w.readyState=w.INIT)}if(p||(p=n().createObjectURL(t)),y)e.location.href=p;else{var r=e.open(p,"_blank");r||(e.location.href=p)}w.readyState=w.DONE,S(),c(p)};return w.readyState=w.INIT,r?(p=n().createObjectURL(t),void setTimeout(function(){o.href=p,o.download=f,a(o),S(),c(p),w.readyState=w.DONE})):void h()},w=p.prototype,m=function(e,t,n){return new p(e,t||e.name||"download",n)};return"undefined"!=typeof navigator&&navigator.msSaveOrOpenBlob?function(e,t,n){return t=t||e.name||"download",n||(e=v(e)),navigator.msSaveOrOpenBlob(e,t)}:(w.abort=function(){},w.readyState=w.INIT=0,w.WRITING=1,w.DONE=2,w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null,m)}}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||this);"undefined"!=typeof module&&module.exports?module.exports.saveAs=saveAs:"undefined"!=typeof define&&null!==define&&null!==define.amd&&define("FileSaver.js",function(){return saveAs});