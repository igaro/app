f (! window.addEventListener) {
    s = document.createElement('script');
    s.src = __igaroapp.cdn + "/js/polyfill.ie.8.js"+version;
    head.appendChild(s);
}
if (! Array.prototype.map) {
    s = document.createElement('script');
    s.src = __igaroapp.cdn + "/js/polyfill.js.1.6.js"+version;
    head.appendChild(s);
}
if (!String.prototype.trim) {
    s = document.createElement('script');
    s.src = __igaroapp.cdn + "/js/polyfill.js.1.8.1.js"+version;
    head.appendChild(s);
}
if (! Object.keys) {
    s = document.createElement('script');
    s.src = __igaroapp.cdn + "/js/polyfill.js.1.8.5.js"+version;
    head.appendChild(s);
}

if (!( "classList" in document.createElement("_"))) {
    s = document.createElement('script');
    s.src = __igaroapp.cdn + "/js/polyfill.js.classList.js"+version;
    head.appendChild(s);
}

if (! window.Promise) {
    s = document.createElement('script');
    s.src = __igaroapp.cdn + "/js/polyfill.es6.js"+version;
    head.appendChild(s);
}

if (! Array.prototype.includes) {
    s = document.createElement('script');
    s.src = __igaroapp.cdn + "/js/polyfill.es7.js"+version;
    head.appendChild(s);
}

