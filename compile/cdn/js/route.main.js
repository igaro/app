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

        model.stash.title = _tr("Igaro App Javascript Framework");
        model.stash.description = _tr("Igaro App is a powerful Javascript framework for developing single page application websites (web-apps). Zero HTML, zero dependencies and beautifully engineered.");
        model.stash.keywords = _tr("javascript, spa, app, html5, framework");        

        var wrapper = model.wrapper, 
            header = domMgr.mk('div',wrapper,null,'header');
       
        // spinners
        domMgr.mk('div',wrapper,
            ['firefox','chrome','ie','android','ios','wm'].map(function(o) {
                return domMgr.mk('div',null,null,o);
            }),
            'spinners');
 
        // header
        domMgr.mk('span',header,_tr("Welcome to <b>Igaro App</b> Javascript Framework"));

        var writeList = function(pool,list) {
            return pool.reduce(function(a,b) { 
                return a.then(function() {
                    var id = b[0];
                    return list.add({ 
                        className:id,
                        content:function(dom) {
                            return dom.mk('a',null,null,function() {
                                var a = model.uriPath.concat(id);
                                this.href = '/' + a.join('/');
                                this.addEventListener('click', function (evt) { 
                                    evt.preventDefault();
                                    router.to(a);
                                });
                                dom.mk('div',this,b[1]);
                            });
                        } 
                    });
                }); 
            },Promise.resolve());
        };

        // sequence
        model.addSequence({ 
            container:domMgr.mk('div',wrapper,null,'main'), 
            promises:[

                model.managers.object.create('pagemessage',{
                    type:'info',
                    message: _tr("You can view the code behind any page in this app by clicking the parenthesis icon in the header."),
                    hideable: {
                        id:model.path.join('.')+'.hintcode'
                    }
                }),

                model.managers.object.create('list').then(function (list) {
                    return writeList([
                        ['overview', _tr("Overview")],
                        ['features', _tr("Features")],
                        ['install', _tr("Install")],
                        ['faq', _tr("FAQ")],
                        ['support', _tr("Support")]
                    ],list).then(function() {
                        var domMgr = list.managers.dom;
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
                    return writeList([
                        ['structure',_tr("Structure")],
                        ['async', _tr("Async")],
                        ['bless', _tr("Bless")],
                        ['design', _tr("Design")],
                        ['routes', _tr("Routes")],
                        ['locale', _tr("Locale")],
                        ['mobile', _tr("Mobile")],
                        ['modules',_tr("Modules")]
                    ],list).then(function() {
                        var domMgr = list.managers.dom;
                        return {
                            container: domMgr.mk('section', null, [
                                domMgr.mk('h1', null, _tr("Documentation")),
                                domMgr.mk('p', null, _tr("Learn, develop and deploy an app. All modules are fully documented.")),
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
