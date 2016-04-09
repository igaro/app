if (! window.addEventListener)
    append("js/polyfill.ie.8.js");
if (! Array.prototype.map)
    append("js/polyfill.js.1.6.js");
if (! String.prototype.trim)
    append("js/polyfill.js.1.8.1.js");
if (! Object.keys)
    append("js/polyfill.js.1.8.5.js");
if (! (document.createElement("_").classList))
    append("js/polyfill.js.classList.js");
if (! window.Promise)
    append("js/polyfill.es6.js");
if (! Array.prototype.includes)
    append("js/polyfill.es7.js");

