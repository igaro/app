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
        dom.mk('span',header,{"fr":"","en":"Welcome to <b>Igaro App</b>"});
        dom.mk('button',header,{"fr":"","en":"Begin"}).addEventListener('click', function() {
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
                message: {"fr":"","en":"You can see the code behind any page in this app by clicking the menu icon in the top right corner."},
                hideable: {
                    model:model,
                    id:'hintcode'
                }
            }),

            // menu
            model.addInstance('list').then(function (list) {

                var l = [
                    ['overview', {"fr":"","en":"Overview"}],
                    ['features', {"fr":"","en":"Features"}],
                    ['install', {"fr":"","en":"Install"}],
                    ['faq', {"fr":"","en":"FAQ"}],
                    ['support', {"fr":"","en":"Support"}]
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
                        dom.mk('h1', null, {"fr":"","en":"Insight"}),
                        dom.mk('p', null, {"fr":"","en":"An amazing architecture, developed by professionals, loaded with features."}),
                        list.container
                    ])
                };
            }),

            model.addInstance('list').then(function (list) {
                var l = [
                    ['structure',{"fr":"","en":"Structure"}],
                    ['async', {"fr":"","en":"Async"}],
                    ['design', {"fr":"","en":"Design"}],
                    ['modules',{"fr":"","en":"Modules"}],
                    ['locale', {"fr":"","en":"Locale"}],
                    ['mobile', {"fr":"","en":"Mobile"}]
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
                        dom.mk('h1', null, {"fr":"","en":"Documentation"}),
                        dom.mk('p', null, {"fr":"","en":"Learn, develop and deploy a custom application. All modules are fully documented."}),
                        list.container
                    ])
                };

            })

        ]});
    };
};

})();
