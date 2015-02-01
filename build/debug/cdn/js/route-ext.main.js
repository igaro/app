(function() {

"use strict";

module.requires = [
    { name: 'instance.samespace.js' },
    { name: 'route-ext.main.css' }
];

module.exports = function(app) {

    var language = app['core.language'],
        router = app['core.router'];

    return function(model) {

        var wrapper = model.wrapper,
            header = model.stash.header,
            dom = model.managers.dom;

        model.managers.dom.empty(header);

        model.addInstance(
            'samespace',
            {
                spaces: [
                    { content: dom.mk('span', null, {"fr":"","en":"Your App, on <b>IE</b>, <b>Firefox</b>, <b>Safari</b> and <b>Chrome</b>"}) },
                    { content: dom.mk('span', null, {"fr":"","en":"Your App, on <b>IOS</b>, <b>Android</b> and <b>Windows Mobile</b>"}) },
                    { content: dom.mk('span', null, {"fr":"","en":"ECMA Standard Javascript with ES6 Promises"}) },
                    { content: dom.mk('span', null, {"fr":"","en":"Advanced router Framework with Multiple Sources"}) },
                    { content: dom.mk('span', null, {"fr":"","en":"Async Modules, Lazy Loading & Event Management"}) },
                    { content: dom.mk('span', null, {"fr":"","en":"Language, Currency, Timezone and Country Support"}) },
                    { content: dom.mk('span', null, {"fr":"","en":"Welcome to <b>Igaro App</b>"}) }
                ],
                container:header,
                effect:'slowswipe',
                navOff:true,
                loop:false,
                delay:4500,
                autostart:true,
                transparent:true
            }
        ).then(function() {

            // spinners
            dom.mk('div',wrapper,
                ['firefox','chrome','ie','android','ios','wm'].map(function(o) {
                    return dom.mk('div',null,null,o);
                }),
                'spinners');

            // cycle languages
            setTimeout(function() {
                var available = language.pool.get(),
                    availkeys = Object.keys(available),
                    saved = language.code.get(),
                    i = availkeys.indexOf(saved)+1,
                    looper = setInterval(function() {
                        if (i === availkeys.length) 
                            i=0;
                        language.code.set(availkeys[i]);
                        i++;
                    }, 500);
                setTimeout(function() {
                    clearInterval(looper);
                    language.code.set(saved);
                },2500);
            },25000);

            // end presentation
            setTimeout(function() {
                model.children.remove(model);
            },28000);

        });

    };

};

})();
