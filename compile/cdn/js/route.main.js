(function() {

"use strict";

module.requires = [
    { name: 'route.main.css' },
    { name: 'core.language.js' }
];

module.exports = function(app) {

    var language = app['core.language'], 
        router = app['core.router'],
        Amd = app['instance.amd'];

    return function(model) {

        var managers = model.managers,
            domMgr = managers.dom,
            debugMgr = managers.debug;

        var wrapper = model.wrapper, 
            header = model.stash.header = domMgr.mk('div',wrapper,null,'header');
        
        // header
        domMgr.mk('span',header,_tr("Welcome to <b>Igaro App</b>"));
        domMgr.mk('button',header,_tr("Begin")).addEventListener('click', function() {
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
                debugMgr.handle(e);
            });
        });

        // sequence
        model.addSequence({ 
            container:domMgr.mk('div',wrapper,null,'main'), 
            promises:[

                model.managers.object.create('pagemessage',{
                    type:'info',
                    message: _tr("You can see the code behind any page in this app by clicking the menu icon in the top right corner."),
                    hideable: {
                        model:model,
                        id:'hintcode'
                    }
                }),

                model.managers.object.create('list').then(function (list) {
                    var domMgr = list.managers.dom;
                    var l = [
                        ['overview', _tr("Overview")],
                        ['features', _tr("Features")],
                        ['install', _tr("Install")],
                        ['faq', _tr("FAQ")],
                        ['support', _tr("Support")]
                    ];
                    return Promise.all(
                        l.map(function(o) { 
                            return list.add({ id:o[0] }); 
                        })
                    ).then(function() {
                        list.pool.forEach(function (o,i) {
                            domMgr.mk('a',o.li,null,function() {
                                this.href = '#!/' + o.id;
                                this.addEventListener('click', function (evt) { 
                                    evt.preventDefault();
                                    router.to(model.uriPath.concat(o.id));
                                });
                                domMgr.mk('div',this,l[i][1]);
                            });
                        });
                        return {
                            container: domMgr.mk('section', null, [
                                domMgr.mk('h1', null, _tr('Insight')),
                                domMgr.mk('p', null, _tr('An amazing architecture, developed by professionals, loaded with features.')),
                                list.container
                            ])
                        };
                    });
                }),

                model.managers.object.create('list').then(function (list) {
                    var domMgr = list.managers.dom;
                    var l = [
                        ['structure',_tr("Structure")],
                        ['async', _tr("Async")],
                        ['bless', _tr("Bless")],
                        ['design', _tr("Design")],
                        ['modules',_tr("Modules")],
                        ['locale', _tr("Locale")],
                        ['mobile', _tr("Mobile")]
                    ]
                    return Promise.all(
                        l.map(function(o) { 
                            return list.add({ id:o[0] }); 
                        })
                    ).then(function() {
                        list.pool.forEach(function (o,i) {
                            domMgr.mk('a',o.li,null,function() {
                                this.href = '#!/' + o.id;
                                this.addEventListener('click', function (evt) { 
                                    evt.preventDefault();
                                    router.to(model.uriPath.concat(o.id));
                                });
                                domMgr.mk('div',this,l[i][1]);
                            });
                        });
                        return {
                            container: domMgr.mk('section', null, [
                                domMgr.mk('h1', null, _tr("Documentation")),
                                domMgr.mk('p', null, _tr("Learn, develop and deploy a custom application. All modules are fully documented.")),
                                list.container
                            ])
                        };
                    });
                })
            ]
        });
    };
};

})();
