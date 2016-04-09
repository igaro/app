var app = {};

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
            if (! (d!==b(a+",monospace") || f!==b(a+",sans-serif") ||e!==b(a+",serif"))) {
                font.name ='font.'+a.toLowerCase().replace(/\ /, function() {
                    return '';
                })+'.css';
                modules.push(font);
            }
        });
    }

    // further modules - must inc conf
    modules.push.apply(modules,libs.load);

    // include built in modules (via builder)
    (function() {

        var module = {};
        @@include('builtin/core.object.js');
        app['core.object'] = module.exports(app,appConf);
    }).call(env);

    (function() {

        var module = {};
        @@include('builtin/core.events.js');
        app['core.events'] = module.exports(app,appConf);
    }).call(env);

    (function() {

        var module = {};
        @@include('builtin/core.debug.js');
        app['core.debug'] = module.exports(app,appConf);
    }).call(env);

    (function() {

        var module = {};
        @@include('builtin/core.object.js');
        app['core.object'] = module.exports(app,appConf);
    }).call(env);

    (function() {

        var module = {};
        @@include('builtin/core.dom.js');
        app['core.dom'] = module.exports(app,appConf);
    }).call(env);

    (function() {

        var module = {};
        @@include('builtin/instance.xhr.js');
        app['instance.xhr'] = module.exports(app,appConf);
    }).call(env);

    (function() {

        var module = {};
        @@include('builtin/instance.amd.js');
        app['instance.amd'] = module.exports(app,appConf);
    }).call(env);

    // load requested modules
    var ai = appConf.init || {};
    return new app['instance.amd']().get({
        modules:modules,
        onProgress:ai.onProgress? function(v) {

            ai.onProgress(app,appConf,v);
        } : null
    }).then(function(v) {

        return app['core.events'].rootEmitter.dispatch('state.init').then(function() {

            if (ai.onReady)
                ai.onReady(app,appConf);
            return app;
        });
    });

})['catch'](function (e) {

    try {

        var init = appConf.init;
        if (init && init.onError)
            init.onError(app,appConf,e);
        return app['core.debug'].error(e);
    } catch(eN) {

        throw { error:eN, originalError:e };
    }

})['catch'](function(e) {

    // capture error in this handler ... and handle (should only happen if core.debug threw).
    if (env.console)
        env.console.error(e);
});
