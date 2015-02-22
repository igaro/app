(function() {

"use strict";

module.requires = [
    { name: 'route.main.css' },
    { name: 'core.language.js' }
];

module.exports = function(app) {

    var language = app['core.language'], 
        router = app['core.router'],
        dom = app['core.dom'],
        Amd = app['instance.amd'];

    return function(model) {

        var view = model.view, 
            wrapper = model.wrapper, 
            header = model.stash.header = dom.mk('div',wrapper,null,'header'),
            main = dom.mk('div',wrapper,null,'main');
        
        // header
        dom.mk('span',header,_tr("Welcome to <b>Igaro App</b>"));
        dom.mk('button',header,_tr("Begin")).addEventListener('click', function() {
            this.disabled=true;
            var self = this;
            new Amd().get({ modules:[{ name:'route-ext.main.js' }] }).then(
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
            ).catch(function (e) {
                model.managers.debug.handle(e);
            });
        });

        // sequence
        model.addSequence({ container:main, promises:[

            // code edit
            model.addInstance('pagemessage',{
                type:'info',
                message: _tr("You can see the code behind any page in this app by clicking the menu icon in the top right corner."),
                hideable: {
                    model:model,
                    id:'hintcode'
                }
            }),

            // menu
            model.addInstance('list').then(function (list) {

                var l = [
                    ['overview', _tr("Overview")],
                    ['features', _tr("Features")],
                    ['install', _tr("Install")],
                    ['faq', _tr("FAQ")],
                    ['support', _tr("Support")]
                ];
                l.forEach(function(o) { 
                    list.add({ id:o[0] }); 
                });
                model.stash.menu=list;

                list.pool
                    .map(function (o) {
                        var v = dom.mk('a',o.li);
                        v.href = '#!/' + o.id;
                        v.addEventListener('click', function (evt) { 
                            evt.preventDefault();
                            router.to(model.uriPath.concat(o.id));
                        });
                        return dom.mk('div',v);
                    })
                    .forEach(function (n,i) { 
                        list.managers.dom.setContent(n, l[i][1]);
                    });
                
                return {
                    container: dom.mk('section', null, [
                        dom.mk('h1', null, _tr('Insight')),
                        dom.mk('p', null, _tr('An amazing architecture, developed by professionals, loaded with features.')),
                        list.container
                    ])
                };
            }),

            model.addInstance('list').then(function (list) {
                var l = [
                    ['structure',_tr("Structure")],
                    ['async', _tr("Async")],
                    ['design', _tr("Design")],
                    ['modules',_tr("Modules")],
                    ['locale', _tr("Locale")],
                    ['mobile', _tr("Mobile")]
                ];
                l.forEach(function(o) { 
                    list.add({ id:o[0] }); 
                });
                model.stash.menu=list;
                
                list.pool
                    .map(function (o) {
                        var v = dom.mk('a',o.li);
                        v.href = '#!/' + o.id;
                        v.addEventListener('click', function (evt) { 
                            evt.preventDefault();
                            router.to(model.uriPath.concat(o.id));
                        });
                        return dom.mk('div',v);
                    })
                    .forEach(function (n,i) { 
                        list.managers.dom.setContent(n,l[i][1]); 
                    }); 
                    
                return {
                    container: dom.mk('section', null, [
                        dom.mk('h1', null, _tr("Documentation")),
                        dom.mk('p', null, _tr("Learn, develop and deploy a custom application. All modules are fully documented.")),
                        list.container
                    ])
                };

            })

        ]});
    };
};

})();
