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
            domMgr = model.managers.dom;

        domMgr.empty(header);

        model.managers.object.create(
            'samespace',
            {
                spaces: [
                    { content: domMgr.mk('span', null, _tr("Your App, on <b>IE</b>, <b>Firefox</b>, <b>Safari</b> and <b>Chrome</b>")) },
                    { content: domMgr.mk('span', null, _tr("Your App, on <b>IOS</b>, <b>Android</b> and <b>Windows Mobile</b>")) },
                    { content: domMgr.mk('span', null, _tr("ECMA Standard Javascript with ES6 Promises")) },
                    { content: domMgr.mk('span', null, _tr("Advanced router Framework with Multiple Sources")) },
                    { content: domMgr.mk('span', null, _tr("Async Modules, Lazy Loading & Event Management")) },
                    { content: domMgr.mk('span', null, _tr("Language, Currency, Timezone and Country Support")) },
                    { content: domMgr.mk('span', null, _tr("Welcome to <b>Igaro App</b>")) }
                ],
                container:header,
                effect:'slowswipe',
                navigation:false,
                loop:false,
                delay:4500,
                start:true,
                transparent:true
            }
        ).then(function() {

            // spinners
            domMgr.mk('div',wrapper,
                ['firefox','chrome','ie','android','ios','wm'].map(function(o) {
                    return domMgr.mk('div',null,null,o);
                }),
                'spinners');

            // cycle languages
            setTimeout(function() {
                var available = language.pool,
                    availkeys = Object.keys(available),
                    saved = language.env,
                    i = availkeys.indexOf(saved)+1,
                    looper = setInterval(function() {
                        if (i === availkeys.length) 
                            i=0;
                        language.setEnv(availkeys[i]);
                        i++;
                    }, 500);
                setTimeout(function() {
                    clearInterval(looper);
                    language.setEnv(saved);
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
