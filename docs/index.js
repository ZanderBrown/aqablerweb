!function(e){function t(t){for(var r,o,i=t[0],l=t[1],c=0,s=[];c<i.length;c++)o=i[c],n[o]&&s.push(n[o][0]),n[o]=0;for(r in l)Object.prototype.hasOwnProperty.call(l,r)&&(e[r]=l[r]);for(d&&d(t);s.length;)s.shift()()}var r={},n={0:0};function o(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.e=function(e){var t=[],r=n[e];if(0!==r)if(r)t.push(r[2]);else{var i=new Promise(function(t,o){r=n[e]=[t,o]});t.push(r[2]=i);var l,c=document.createElement("script");c.charset="utf-8",c.timeout=120,o.nc&&c.setAttribute("nonce",o.nc),c.src=function(e){return o.p+""+e+".index.js"}(e),l=function(t){c.onerror=c.onload=null,clearTimeout(d);var r=n[e];if(0!==r){if(r){var o=t&&("load"===t.type?"missing":t.type),i=t&&t.target&&t.target.src,l=new Error("Loading chunk "+e+" failed.\n("+o+": "+i+")");l.type=o,l.request=i,r[1](l)}n[e]=void 0}};var d=setTimeout(function(){l({type:"timeout",target:c})},12e4);c.onerror=c.onload=l,document.head.appendChild(c)}return Promise.all(t)},o.m=e,o.c=r,o.d=function(e,t,r){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(o.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)o.d(r,n,function(t){return e[t]}.bind(null,n));return r},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o.oe=function(e){throw console.error(e),e};var i=window.webpackJsonp=window.webpackJsonp||[],l=i.push.bind(i);i.push=t,i=i.slice();for(var c=0;c<i.length;c++)t(i[c]);var d=l;o(o.s=0)}([function(e,t,r){let n=document.getElementById("source"),o=document.getElementById("result"),i=document.getElementById("run");function l(e){o.innerText=e,setTimeout(()=>{"Success"!=o.innerText&&"Ready"!=o.innerText?o.classList.add("error"):o.classList.remove("error")},0)}function c(e,t,r){for(;e.firstChild;)e.removeChild(e.firstChild);let n=t.getRegCount();for(let o=0;o<n;o++){let n=document.createElement("div"),i=document.createElement("span");i.innerText="R"+o;let l=document.createElement("span");l.innerText=t.getReg(o,r),n.appendChild(i),n.appendChild(l),e.appendChild(n)}}let d=null;window.addEventListener("load",()=>{if(!("WebAssembly"in window))return void l("Web browser isn't supported :-(");let e=document.getElementById("registers"),t=document.querySelector(".registers"),o=document.getElementById("reg-mode");o.addEventListener("change",t=>{d&&c(e,d,"signed"==o.value)}),r.e(1).then(r.t.bind(null,1,7)).then(r=>{l("Ready");let s=!0;i.addEventListener("click",()=>{s&&(s=!1,t.classList.remove("hidden"));let i=n.value;try{l((d=new r.Context).run(i))}catch(e){l("Internal Error"),console.error(e)}c(e,d,"signed"==o.value)})}).catch(e=>{l("Failed to load Aqabler"),console.error(e)});let s=document.querySelector(".reference .overview"),a=void 0,u=(e,t)=>{e.addEventListener("click",e=>{e.preventDefault(),t(e.target)}),e.addEventListener("keyup",e=>{" "==e.key&&(e.preventDefault(),t(e.target))})},f=e=>{let t=e.nextElementSibling;a&&a!=t&&a.classList.remove("expanded"),(a=t).classList.toggle("expanded")};for(let e of s.querySelectorAll(".heading"))u(e,f);let p=void 0,v=document.querySelector(".reference .title"),m=document.querySelector(".reference .page-title"),g=m.querySelector(".reference .page-title .title h2");u(document.querySelector(".reference .page-title .back"),e=>{p&&(p.classList.add("hidden"),p=void 0),s.classList.remove("hidden"),v.classList.remove("hidden"),m.classList.add("hidden")});let h=e=>{let t=e.innerText,r=document.getElementById("ref-"+t.replace(" ","-").toLowerCase());r?(g.innerText=t,r.classList.remove("hidden"),s.classList.add("hidden"),v.classList.add("hidden"),m.classList.remove("hidden"),p=r):console.error("Missing refrence page for "+t)};for(let e of s.querySelectorAll("li"))u(e,h)}),"serviceWorker"in navigator?navigator.serviceWorker.register("service.js",{scope:"./"}).then(()=>console.info("Service Worker Registered")).catch(e=>{console.error("Service Worker Registration Failed"),console.error(e)}):console.warn("Service Worker Unsupported")}]);