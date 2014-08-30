module.requires = [
    { name: 'route.main.css' },
    { name: 'core.language.js' }
];

module.exports = function(app) {

    var language = app['core.language'];
    var mvc = app['core.mvc'];

    return function(model) {

        var view = model.view;
        var wrapper = view.wrapper;
        var events = model.events;

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
                        alert(e);
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
                    ['deploy', {
                        en : 'Deploy',
                        fr : 'Communauté'
                    }],
                    ['faq', {
                        en : 'FAQ',
                    }],
                    ['support', {
                        en : 'Support',
                        fr : 'Soutien'
                    }],
                    ['news', {
                        en : 'News'
                    }]
                ]
                l.forEach(function(o) { list.add({ id:o[0] }) });
                model.store['menu']=list;
                var f = function(to,obj) {
                    mvc.to(model.path+'/'+to);
                };
                var as = list.pool.map(function (o) {
                    var v = view.createAppend('a',o.li);
                    v.href=o.id;
                    v.addEventListener('click', function (evt) { 
                        evt.preventDefault();
                        f(o.id, this) 
                    });
                    return view.createAppend('div',v);
                });
                var x = function() { as.forEach(function (n,i) { n.innerHTML = language.mapKey(l[i][1]); }); };
                events.on('core.language','code.set', x);
                x();
                return list;
            }),

            // github stats
            new Promise(function(resolve) {
                view.instances.add('xhr').then(function (xhr) {
                    xhr.get({ res:'https://api.github.com/orgs/igaro/repos' }).then(
                        function(data) {
                            var stats = view.createAppend('div',null,null,'stats');
                            var x = view.createAppend('div',stats,null);
                            view.createAppend('h2',x, {
                                en : 'Last Update',
                                fr : 'Dernière mise à Jour'
                            });
                            var a = view.createAppend('a',x);
                            a.href = 'https://github.com/igaro/igaro';
                            view.instances.add('date', {
                                date:data[0].updated_at,
                                format:'LLLL',
                                container:a
                            })
                            x = view.createAppend('div',stats,null);
                            view.createAppend('h2',x, 'Andrew Charnley');
                            view.createAppend('a',x,'www.andrewcharnley.com').href='http://www.andrewcharnley.com';
                            x = view.createAppend('div',stats,null);
                            view.createAppend('h2',x, {
                                en : 'Open Issues',
                                fr : 'Questions en Suspens'
                            });
                            view.createAppend('a',x,data[0].open_issues).href='https://github.com/igaro/igaro/issues';
                            resolve({ container:stats });
                        },
                        resolve
                    );
                });
            }),

            // bookmark
            view.instances.add('bookmark', { url:'http://app.igaro.com' })

        ]});
    }
};
