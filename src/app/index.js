(function() {

    "use strict";

    @@include('conf/cdn.js');

    var head = document.getElementsByTagName('head')[0],
        append = function(file) {
            var isCSS = file.slice(0,-2) === 'ss',
                s = document.createElement(isCSS? 'link' : 'script');
            s.src = cdn+'/'+file+"?va=@@var('buildTs')";
            if (isCSS) {
                s.type = "text/css";
                s.reli = "stylesheet";
            }
            head.appendChild(s);
        };

    append("css/app.css");

    // polyfill env
    if (location.protocol === 'file:')
        append("cordova");
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

    // initial config, including loading screen and custom load modules.
    @@include('conf/bootstrap.js');

    // loader for built in and custom modules above, usng the config above.
    // Will load conf.app.js which defines the apps behaviour
    @@include('builtin/loader.js');

})();
