module.requires = [
    { name: 'instance.samespace.js' },
    { name: 'route-ext.main.css' }
];

module.exports = function(app) {

    var language = app['core.language'];
    var mvc = app['core.mvc'];

    return function(model) {

        var view = model.view;
        var wrapper = view.wrapper;
        var events = model.events;

        var el = new Array(
            view.createAppend('span', null, { 
                en : 'Your App, on <b>IE</b>, <b>Firefox</b>, <b>Safari</b> and <b>Chrome</b>.',
                fr : 'Votre App, sur <b>IE</b>, <b>Firefox</b>, <b>Safari</b> et <b>Chrome</b>.'
            }),
            view.createAppend('span', null, { 
                en : 'Your App, on <b>IOS</b>, <b>Android</b> and <b>Windows Mobile</b>.',
                fr : 'Votre App, sur <b>IOS</b>, <b>Android</b> et <b>Windows Mobile</b>.'
            }),
            view.createAppend('span', null, { 
                en : 'ECMA Standard Javascript with EC6 Promises.',
                fr : 'ECMA Javascript avec EC6 Promeses.',
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
            })
        );
        var a = document.createDocumentFragment();
        view.createAppend('span',a, {
            en : 'Welcome to <b>Igaro App</b>. ',
            fr : 'Bienvenue à <b>Igaro App</b>. '
        });
        el.push(a);
        var header = model.store['header'];
        while (header.firstChild) { header.removeChild(header.firstChild) }
        var sp = new app['instance.samespace']({
            elements:el,
            container:header,
            effect:'slowswipe',
            navOff:true,
            loop:false,
            delay:4500,
            autostart:true,
            transparent:true
        });
        
        // spinners
        var spinners = document.createElement('div');
        spinners.className = 'spinners';
        ['firefox','chrome','ie','android','ios','wm'].forEach(function(o) {
            var f = document.createElement('div');
            f.className = o;
            spinners.appendChild(f);
        });
        wrapper.appendChild(spinners);

        // cycle languages
        setTimeout(function() {
            var available = language.pool.get();
            var availkeys = Object.keys(available);
            var saved = language.code.get();
            var i = availkeys.indexOf(saved)+1;
            var looper = setInterval(function() {
                if (i === availkeys.length) i=0;
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

    }

};
