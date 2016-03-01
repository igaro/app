//# sourceURL=igaro.js

(function () {

    "use strict";

    var app = {};

    // conf is in a global literal. Move ref into private then undef it.
    var appConf = __igaroapp; //jshint ignore:line
    __igaroapp = undefined; //jshint ignore:line

    // root async chain
    return Promise.resolve().then(function () {

        var modules = [],
            libs = appConf.libs;

        // local libraries
        if (libs.local && document.location.protocol === 'file:')
            modules.push.apply(modules,libs.local);

        // network libraries
        if (libs.network && document.location.protocol !== 'file:')
            modules.push.apply(modules,libs.network);

        // touch libraries
        var maxTouchPoints = window.navigator.maxTouchPoints || window.navigator.msMaxTouchPoints;
        if (libs.touch && ((maxTouchPoints === undefined && 'ontouchstart' in window) || (typeof maxTouchPoints === 'number' && maxTouchPoints > 1)))
            modules.push.apply(modules,libs.touch);

        // fonts
        if (libs.fonts) {
            var b,d,e,f,g,
                h=document.body,
                a=document.createElement("div");
            a.innerHTML='<span style="'+["position:absolute","width:auto","font-size:128px","left:-99999px"].join(" !important;")+'">'+(new Array(100)).join("wi")+"</span>";
            a=a.firstChild;
            b=function(b){
                a.style.fontFamily=b;
                h.appendChild(a);
                g=a.clientWidth;
                h.removeChild(a);
                return g;
            };
            d=b("monospace");
            e=b("serif");
            f=b("sans-serif");
            libs.fonts.forEach(function (font) {
                var a = font.name;
                if (! (d!==b(a+",monospace") || f!==b(a+",sans-serif") ||e!==b(a+",serif")))
                    modules.push(font.module);
            });
        }

        // further modules - must inc conf
        modules.push.apply(modules,libs.load);

        // include built in modules (via builder)
        (function() {
            var module = {};
            @@include('core.object.js');
            app['core.object'] = module.exports(app);
        }).call(window);
        (function() {
            var module = {};
            @@include('core.events.js');
            app['core.events'] = module.exports(app);
        }).call(window);
        (function() {
            var module = {};
            @@include('core.debug.js');
            app['core.debug'] = module.exports(app);
        }).call(window);
        (function() {
            var module = {};
            @@include('core.object.js');
            app['core.object'] = module.exports(app);
        }).call(window);
        (function() {
            var module = {};
            @@include('core.dom.js');
            app['core.dom'] = module.exports(app);
        }).call(window);
        (function() {
            var module = {};
            @@include('instance.xhr.js');
            app['instance.xhr'] = module.exports(app);
        }).call(window);
        (function() {
            var module = {};
            @@include('instance.amd.js');
            app['instance.amd'] = module.exports(app);
        }).call(window);

        // load external modules
        return new app['instance.amd']().get({ modules:modules }).then(function() {
            var ii = appConf.init;
            if (ii && ii.onProgress)
                ii.onProgress(app,appConf);
            return app['core.events'].rootEmitter.dispatch('state.init').then(function() {
                if (ii && ii.onReady)
                    ii.onReady(app,appConf);
                return app;
            });
        });

    })['catch'](function (e) {

        try {
            var ii = appConf.init;
            if (ii && ii.onError)
                ii.onError(app,appConf,e);
            return app['core.debug'].error(e);
        } catch(eN) {
            throw { error:e, originalError:eN };
        }

    })['catch'](function(e) {

        // capture error in this handler ... and handle. Ideally shouldn't happen.
        if (window && window.console)
            console.error(e);
    });

})();
