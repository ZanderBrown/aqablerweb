!function(e){function t(t){for(var r,o,i=t[0],s=t[1],a=0,u=[];a<i.length;a++)o=i[a],n[o]&&u.push(n[o][0]),n[o]=0;for(r in s)Object.prototype.hasOwnProperty.call(s,r)&&(e[r]=s[r]);for(l&&l(t);u.length;)u.shift()()}var r={},n={1:0};var o={};var i={7:function(){return{"./aqablerweb":{__wbg_f_regs_add_row_regs_add_row_n:function(e,t,n){return r[1].exports.__wbg_f_regs_add_row_regs_add_row_n(e,t,n)},__wbg_f_regs_reset_regs_reset_n:function(){return r[1].exports.__wbg_f_regs_reset_regs_reset_n()},__wbindgen_throw:function(e,t){return r[1].exports.__wbindgen_throw(e,t)}}}}};function s(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.e=function(e){var t=[],r=n[e];if(0!==r)if(r)t.push(r[2]);else{var a=new Promise(function(t,o){r=n[e]=[t,o]});t.push(r[2]=a);var u,c=document.getElementsByTagName("head")[0],l=document.createElement("script");l.charset="utf-8",l.timeout=120,s.nc&&l.setAttribute("nonce",s.nc),l.src=function(e){return s.p+""+e+".index.js"}(e),u=function(t){l.onerror=l.onload=null,clearTimeout(d);var r=n[e];if(0!==r){if(r){var o=t&&("load"===t.type?"missing":t.type),i=t&&t.target&&t.target.src,s=new Error("Loading chunk "+e+" failed.\n("+o+": "+i+")");s.type=o,s.request=i,r[1](s)}n[e]=void 0}};var d=setTimeout(function(){u({type:"timeout",target:l})},12e4);l.onerror=l.onload=u,c.appendChild(l)}return({0:[7]}[e]||[]).forEach(function(e){var r=o[e];if(r)t.push(r);else{var n,a=i[e](),u=fetch(s.p+""+{7:"91ee64ab5c089957ff57"}[e]+".module.wasm");if(a instanceof Promise&&"function"==typeof WebAssembly.compileStreaming)n=Promise.all([WebAssembly.compileStreaming(u),a]).then(function(e){return WebAssembly.instantiate(e[0],e[1])});else if("function"==typeof WebAssembly.instantiateStreaming)n=WebAssembly.instantiateStreaming(u,a);else{n=u.then(function(e){return e.arrayBuffer()}).then(function(e){return WebAssembly.instantiate(e,a)})}t.push(o[e]=n.then(function(t){return s.w[e]=(t.instance||t).exports}))}}),Promise.all(t)},s.m=e,s.c=r,s.d=function(e,t,r){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(s.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)s.d(r,n,function(t){return e[t]}.bind(null,n));return r},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="",s.oe=function(e){throw console.error(e),e},s.w={};var a=window.webpackJsonp=window.webpackJsonp||[],u=a.push.bind(a);a.push=t,a=a.slice();for(var c=0;c<a.length;c++)t(a[c]);var l=u;s(s.s=0)}([function(e,t,r){let n=document.getElementById("source"),o=document.getElementById("result"),i=document.getElementById("registers"),s=document.querySelector(".registers"),a=document.getElementById("run");function u(e){o.innerText=e,setTimeout(()=>{"Success"!=o.innerText&&"Ready"!=o.innerText?o.classList.add("error"):o.classList.remove("error")},0)}window.regs_add_row=((e,t)=>{let r=document.createElement("tr"),n=document.createElement("td");n.innerText="R"+e;let o=document.createElement("td");o.innerText=t,r.appendChild(n),r.appendChild(o),i.appendChild(r)}),window.regs_reset=(()=>{for(;i.firstChild;)i.removeChild(i.firstChild)}),window.addEventListener("load",()=>{r.e(0).then(r.bind(null,1)).then(e=>{u("Ready");let t=!0;a.addEventListener("click",()=>{try{t&&(t=!1,s.classList.remove("hidden"));let r=n.value;u(e.run(r))}catch(e){u("Internal Error"),console.error(e)}})})}),"serviceWorker"in navigator&&(navigator.serviceWorker.register("service.js",{scope:"./"}).then(function(e){console.log("Service Worker Registered")}),navigator.serviceWorker.ready.then(function(e){console.log("Service Worker Ready")}))}]);