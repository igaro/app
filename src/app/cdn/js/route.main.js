//# sourceURL=route.main.js

(function() {

"use strict";

module.requires = [
    { name: 'route.main.css' },
    { name: 'core.language.js' }
];

module.exports = function(app) {

    var router = app['core.router'];

    return function(model) {

        var managers = model.managers,
            domMgr = managers.dom,
            objectMgr = managers.object,
            coreObject = app['core.object'];

        model.stash.title = function(l) { return l.gettext("Igaro App JavaScript Framework"); };
        model.stash.description = function(l) { return l.gettext("Igaro App is a powerful JavaScript framework for developing single page application websites (web-apps). Zero HTML, zero dependencies and beautifully engineered."); };
        model.stash.keywords = function(l) { return l.gettext("javascript, spa, app, html5, framework"); };

        var wrapper = model.wrapper,
            header = domMgr.mk('div',wrapper,null,'header');

        // header
        domMgr.mk('span',header, function(l) { return l.gettext("Welcome to <b>Igaro App</b> JavaScript Framework"); });

        var writeList = function(pool,list) {

            return coreObject.promiseSequencer(pool,function(b) {

                var id = b[0];
                return list.addItem({
                    className:id,
                    content:function(dom) {

                        return dom.mk('a',null,null,function() {

                            var url = b[2];
                            if (url) {

                                this.href = url;
                                this.addEventListener('click', function (evt) {

                                    evt.preventDefault();
                                    window.open(url);
                                });
                            } else {

                                var a = model.getUrl(id);
                                this.href = a.toString();
                                this.addEventListener('click', function (evt) {

                                    evt.preventDefault();
                                    router.to(a);
                                });
                            }
                            dom.mk('div',this,b[1]);
                        });
                    }
                });
            },Promise.resolve());
        };

        // sequence
        model.addSequence({
            container:domMgr.mk('div',wrapper,null,'main'),
            promises:[

                objectMgr.create('pagemessage',{
                    type:'info',
                    message: function(l) { return l.gettext("You can view the code behind any page in this app by clicking the curly bracket icon in the header."); },
                    hideable: true,
                    id:model.path.join('.')+'.hintcode'
                }),

                objectMgr.create('list').then(function (list) {

                    return writeList([
                        ['overview', function(l) { return l.gettext("Overview"); }],
                        ['features', function(l) { return l.gettext("Widgets"); }],
                        ['install', function(l) { return l.gettext("Install"); }],
                        ['showcase', function(l) { return l.gettext("Showcase"); }]
                    ],list).then(function() {

                        var domMgr = list.managers.dom;
                        return domMgr.mk('section', null, [
                            domMgr.mk('h1', null, function(l) { return l.gettext("Insight"); }),
                            domMgr.mk('p', null, function(l) { return l.gettext("HTML falters when used for declaring dynamic views in web-applications, and most JavaScript frameworks deal with this shortcoming by introducing sync and data binding overheads. Looking for an alternative?"); }),
                            list.container
                        ],'first');
                    });
                }),

                objectMgr.create('list').then(function (list) {

                    return writeList([
                        ['structure',function(l) { return l.gettext("Basics"); }],
                        ['bless', function(l) { return l.gettext("Bless"); }],
                        ['async', function(l) { return l.gettext("Async"); }],
                        ['events',function(l) { return l.gettext("Events"); }],
                        ['security',function(l) { return l.gettext("Security"); }],
                        ['design', function(l) { return l.gettext("Design"); }],
                        ['routes', function(l) { return l.gettext("Routes"); }],
                        ['locale', function(l) { return l.gettext("Locale"); }],
                        ['mobile', function(l) { return l.gettext("Mobile"); }],
                        ['compat',function(l) { return l.gettext("Compatibility"); }],
                        ['testing',function(l) { return l.gettext("Testing"); }],
                        ['modules',function(l) { return l.gettext("Modules"); }]
                    ],list).then(function() {

                        var domMgr = list.managers.dom;
                        return domMgr.mk('section', null, [
                            domMgr.mk('h1', null, function(l) { return l.gettext("Documentation"); }),
                            domMgr.mk('p', null, function(l) { return l.gettext("All Igaro App's modules are documented via JSDoc, but the online help is more exhaustive and comes with demos."); }),
                            list.container
                        ]);
                    });
                }),

                objectMgr.create('list').then(function (list) {

                    return writeList([
                        ['forum',function(l) { return l.gettext("Forum"); },'http://forum.igaro.com'],
                        ['report', function(l) { return l.gettext("Report"); },'https://github.com/igaro/app/issues'],
                        ['contact', function(l) { return l.gettext("Contact"); }],
                    ],list).then(function() {

                        var domMgr = list.managers.dom;
                        return domMgr.mk('section', null, [
                            domMgr.mk('h1', null, function(l) { return l.gettext("Support"); }),
                            domMgr.mk('p', null, function(l) { return l.gettext("Discuss ideas, get involved with Igaro App development, or seek help."); }),
                            list.container
                        ]);
                    });
                })
            ]
        });
    };
};

})();
