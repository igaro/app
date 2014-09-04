module.requires = [
    { name: 'route.main.css' },
    { name: 'core.language.js' }
];

module.exports = function(app) {

    var language = app['core.language'], 
        mvc = app['core.mvc'];

    return function(model) {

        var view = model.view, 
            wrapper = view.wrapper, 
            events = model.events;

        // header
        var header = model.store['header'] = view.createAppend('div',wrapper,null,'header');
        view.createAppend('span',header,{
            en : 'Welcome to <b>Igaro App</b>.',
            fr : 'Bienvenue à <b>Igaro App</b>.'
        });
        view.createAppend('button',header,{
            en : 'Begin',
            fr : 'Commencer'
        }).addEventListener('click', function() {
            this.disabled=true;
            var self = this;
            (new amd).get({ modules:[{ name:'route-ext.main.js' }] }).then(
                function() {
                    try {
                        app['route-ext.main'](model);
                    } catch(e) {
                        throw new Error(e);
                    }
                },
                function() {
                    self.disabled=false;
                }
            );
        });

        // sequence
        view.addSequence({ container:wrapper, promises:[

            // menu
            view.instances.add('list').then(function (list) {
                var l = [
                    ['overview', {
                        en : 'Overview',
                        fr : 'Propos'
                    }],
                    ['features', {
                        en : 'Features',
                        fr : 'Traits'
                    }],
                    ['install', {
                        en : 'Install',
                        fr : 'Installer'
                    }],
                    ['faq', {
                        en : 'FAQ',
                    }],
                    ['support', {
                        en : 'Support',
                        fr : 'Soutien'
                    }]
                ];
                l.forEach(function(o) { list.add({ id:o[0] }); });
                model.store['menu']=list;
                var f = function(to,obj) {
                    mvc.to(model.path+'/'+to);
                },
                as = list.pool.map(function (o) {
                    var v = view.createAppend('a',o.li);
                    v.href=o.id;
                    v.addEventListener('click', function (evt) { 
                        evt.preventDefault();
                        f(o.id, this);
                    });
                    return view.createAppend('div',v);
                }),
                x = function() { as.forEach(function (n,i) { n.innerHTML = language.mapKey(l[i][1]); }); };
                events.on('core.language','code.set', x);
                x();
                return {
                    container: view.createAppend('section', null, [
                        view.createAppend('h1', null, {
                            en : 'General',
                            fr : 'Général'
                        }),
                        view.createAppend('p', null, {
                            en : 'Yet another javascript web framework? Not quite. This one uses no HTML!',
                            fr : 'Pourtant, un autre framework web javascript? Pas tout à fait. Celui-ci n\'utilise pas de HTML!'
                        }),
                        view.createAppend('p', null, {
                            en : 'Igaro App offers tons of features and an amazing architecture on which to build your next SPA or mobile product.',
                            fr : 'Igaro App propose des tonnes de fonctionnalités et d\'une architecture étonnante sur laquelle bâtir votre prochain SPA ou un produit mobile.'
                        }),
                        list.container
                    ])
                };
            }),

            view.instances.add('list').then(function (list) {
                var l = [
                    ['structure',{
                        en : 'Structure',
                        fr : 'Bâtiment'
                    }],
                    ['events',{
                        en : 'Events',
                        fr : 'Evénements'
                    }],
                    ['design',{
                        en : 'Design',
                        fr : 'Conception'
                    }],
                    ['modules',{
                        en : 'Modules',
                        fr : 'Modules'
                    }],
                    ['locale', {
                        en : 'Locale',
                        fr : 'Vitrine'
                    }],
                    ['mobile', {
                        en : 'Mobile',
                        fr : 'Mobile'
                    }]
                ];
                l.forEach(function(o) { 
                    list.add({ id:o[0] }); 
                });
                model.store['menu']=list;
                var f = function(to,obj) {
                    mvc.to(model.path+'/'+to);
                },
                as = list.pool.map(function (o) {
                    var v = view.createAppend('a',o.li);
                    v.href=o.id;
                    v.addEventListener('click', function (evt) { 
                        evt.preventDefault();
                        f(o.id, this);
                    });
                    return view.createAppend('div',v);
                }),
                x = function() { as.forEach(function (n,i) { n.innerHTML = language.mapKey(l[i][1]); }); };
                events.on('core.language','code.set', x);
                x();
                
                return {
                    container: view.createAppend('section', null, [
                        view.createAppend('h1', null, {
                            en : 'Documentation',
                            fr : 'Documentation'
                        }),
                        view.createAppend('p', null, {
                            en : 'Plain Javascript Object Orientated programming, with cutting edge ES6 features. No junk, snake oil or dependencies.',
                            fr : 'Plaine Javascript Object programmation orienté, avec avant-gardistes fonctionnalités ES6. Aucune ordure, l\'huile de serpent ou des dépendances.'
                        }),
                        view.createAppend('p', null, { 
                            en : 'Learn how Igaro App works and what makes it the fastest, most efficient framework out there.',
                            fr : 'Apprenez comment Igaro App fonctionne et ce qui le rend le plus rapide cadre, plus efficace là-bas.'
                        }),
                        list.container
                    ])
                };

            })

        ]});
    };
};
