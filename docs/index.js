!function(e){function t(t){for(var r,o,i=t[0],c=t[1],s=0,l=[];s<i.length;s++)o=i[s],n[o]&&l.push(n[o][0]),n[o]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(e[r]=c[r]);for(d&&d(t);l.length;)l.shift()()}var r={},n={0:0};var o={};var i={3:function(){return{"./aqablerweb":{__wbg_regsreset_dce646cd9c4056ed:function(){return r[1].exports.__wbg_regsreset_dce646cd9c4056ed()},__wbg_regsaddrow_b3c03b2dc3c72c8c:function(e,t,n){return r[1].exports.__wbg_regsaddrow_b3c03b2dc3c72c8c(e,t,n)},__wbindgen_throw:function(e,t){return r[1].exports.__wbindgen_throw(e,t)}}}}};function c(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,c),n.l=!0,n.exports}c.e=function(e){var t=[],r=n[e];if(0!==r)if(r)t.push(r[2]);else{var s=new Promise(function(t,o){r=n[e]=[t,o]});t.push(r[2]=s);var l,a=document.getElementsByTagName("head")[0],d=document.createElement("script");d.charset="utf-8",d.timeout=120,c.nc&&d.setAttribute("nonce",c.nc),d.src=function(e){return c.p+""+e+".index.js"}(e),l=function(t){d.onerror=d.onload=null,clearTimeout(u);var r=n[e];if(0!==r){if(r){var o=t&&("load"===t.type?"missing":t.type),i=t&&t.target&&t.target.src,c=new Error("Loading chunk "+e+" failed.\n("+o+": "+i+")");c.type=o,c.request=i,r[1](c)}n[e]=void 0}};var u=setTimeout(function(){l({type:"timeout",target:d})},12e4);d.onerror=d.onload=l,a.appendChild(d)}return({1:[3]}[e]||[]).forEach(function(e){var r=o[e];if(r)t.push(r);else{var n,s=i[e](),l=fetch(c.p+"aqabler.wasm");if(s instanceof Promise&&"function"==typeof WebAssembly.compileStreaming)n=Promise.all([WebAssembly.compileStreaming(l),s]).then(function(e){return WebAssembly.instantiate(e[0],e[1])});else if("function"==typeof WebAssembly.instantiateStreaming)n=WebAssembly.instantiateStreaming(l,s);else{n=l.then(function(e){return e.arrayBuffer()}).then(function(e){return WebAssembly.instantiate(e,s)})}t.push(o[e]=n.then(function(t){return c.w[e]=(t.instance||t).exports}))}}),Promise.all(t)},c.m=e,c.c=r,c.d=function(e,t,r){c.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},c.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.t=function(e,t){if(1&t&&(e=c(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(c.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)c.d(r,n,function(t){return e[t]}.bind(null,n));return r},c.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return c.d(t,"a",t),t},c.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},c.p="",c.oe=function(e){throw console.error(e),e},c.w={};var s=window.webpackJsonp=window.webpackJsonp||[],l=s.push.bind(s);s.push=t,s=s.slice();for(var a=0;a<s.length;a++)t(s[a]);var d=l;c(c.s=0)}([function(e,t,r){let n=document.getElementById("source"),o=document.getElementById("result"),i=document.getElementById("registers"),c=document.querySelector(".registers"),s=document.getElementById("run");function l(e){o.innerText=e,setTimeout(()=>{"Success"!=o.innerText&&"Ready"!=o.innerText?o.classList.add("error"):o.classList.remove("error")},0)}window.regs_add_row=((e,t)=>{let r=document.createElement("tr"),n=document.createElement("td");n.innerText="R"+e;let o=document.createElement("td");o.innerText=t,r.appendChild(n),r.appendChild(o),i.appendChild(r)}),window.regs_reset=(()=>{for(;i.firstChild;)i.removeChild(i.firstChild)}),window.addEventListener("load",()=>{if(!("WebAssembly"in window))return void l("Web browser isn't supported :-(");r.e(1).then(r.bind(null,1)).then(e=>{l("Ready");let t=!0;s.addEventListener("click",()=>{try{t&&(t=!1,c.classList.remove("hidden"));let r=n.value;l(e.run(r))}catch(e){l("Internal Error"),console.error(e)}})}).catch(e=>{l("Failed to load Aqabler"),console.error(e)});let e=document.querySelector(".reference .overview"),t=void 0;for(let r of e.querySelectorAll(".heading"))r.addEventListener("click",e=>{let r=e.target.nextElementSibling;t&&t!=r&&t.classList.remove("expanded"),(t=r).classList.toggle("expanded")});let o=void 0,i=document.querySelector(".reference .title"),a=document.querySelector(".reference .page-title"),d=a.querySelector(".reference .page-title .title");document.querySelector(".reference .page-title .back").addEventListener("click",()=>{o&&(o.classList.add("hidden"),o=void 0),e.classList.remove("hidden"),i.classList.remove("hidden"),a.classList.add("hidden")});for(let t of e.querySelectorAll("li"))t.addEventListener("click",t=>{let r=t.target.innerText,n=document.getElementById("ref-"+r.replace(" ","-").toLowerCase());n?(d.innerText=r,n.classList.remove("hidden"),e.classList.add("hidden"),i.classList.add("hidden"),a.classList.remove("hidden"),o=n):console.error("Missing refrence page for "+r)})}),"serviceWorker"in navigator?navigator.serviceWorker.register("service.js",{scope:"./"}).then(()=>console.info("Service Worker Registered")).catch(e=>{console.error("Service Worker Registration Failed"),console.error(e)}):console.warn("Service Worker Unsupported")}]);