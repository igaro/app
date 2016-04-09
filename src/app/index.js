(function(env) {

    "use strict";

    // cdn logic
    @@include('conf/cdn.js');

    // helpers
    var head = document.getElementsByTagName('head')[0],
        append = function(file) {
            var isCSS = file.slice(-4) === '.css',
                s = document.createElement(isCSS? 'link' : 'script');
            s[isCSS? 'href' : 'src'] = cdn+'/'+file+"?va=@@var('buildTs')";
            if (isCSS)
                s.rel = "stylesheet";
            head.appendChild(s);
        };

    // main css
    append("css/app.css");

    // polyfills
    @@include('conf/polyfills.js');

    // cordova
    if (location.protocol === 'file:')
        append("cordova");

    // initial config, including loading screen and custom load modules.
    @@include('conf/bootstrap.js');

    // loader for built in and custom modules above, usng the config file defined in bootstrap.
    @@include('builtin/exec.js');

})(this);
