module.requires = [
    { name: 'instance.samespace.js' },
    { name: 'route-ext.main.css' }
];

module.exports = function(app) {

    var language = app['core.language'],
        mvc = app['core.mvc'];

    return function(model) {

        var view = model.view,
            wrapper = view.wrapper,
            events = model.events,
            header = model.store['header'];

        while (header.firstChild) 
            header.removeChild(header.firstChild);

        view.instances.add(
            'samespace',
            {
                elements: [
                    view.createAppend('span', null, { 
                        en : 'Your App, on <b>IE</b>, <b>Firefox</b>, <b>Safari</b> and <b>Chrome</b>.',
                        fr : 'Votre App, sur <b>IE</b>, <b>Firefox</b>, <b>Safari</b> et <b>Chrome</b>.'
                    }),
                    view.createAppend('span', null, { 
                        en : 'Your App, on <b>IOS</b>, <b>Android</b> and <b>Windows Mobile</b>.',
                        fr : 'Votre App, sur <b>IOS</b>, <b>Android</b> et <b>Windows Mobile</b>.'
                    }),
                    view.createAppend('span', null, { 
                        en : 'ECMA Standard Javascript with ES6 Promises.',
                        fr : 'ECMA Javascript avec ES6 Promeses.',
                    }),
                    view.createAppend('span', null, { 
                        en : 'Advanced MVC Framework with Multiple Sources.',
                        fr : 'MVC Framework avancée avec des sources multiples.',
                    }),
                    view.createAppend('span', null, { 
                        en : 'AMD Modules, Lazy Loading & Event Management.',
                        fr : 'Modules AMD, le chargement différé et la gestion d\'événements.',
                    }),
                    view.createAppend('span', null, { 
                        en : 'Multiple Language, Currency, Timezone and Country Support.',
                        fr : 'En plusieurs langues, devise, fuseau horaire et l\'appui aux pays.',
                    }),
                    view.createAppend('span',null, {
                        en : 'Welcome to <b>Igaro App</b>. ',
                        fr : 'Bienvenue à <b>Igaro App</b>. '
                    })
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
            view.createAppend('div',wrapper,
                ['firefox','chrome','ie','android','ios','wm'].map(function(o) {
                    return view.createAppend('div',null,null,o);
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
