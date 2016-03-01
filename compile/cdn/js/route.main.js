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

        model.stash.title = _tr("Igaro App JavaScript Framework");
        model.stash.description = _tr("Igaro App is a powerful JavaScript framework for developing single page application websites (web-apps). Zero HTML, zero dependencies and beautifully engineered.");
        model.stash.keywords = _tr("javascript, spa, app, html5, framework");

        var wrapper = model.wrapper,
            header = domMgr.mk('div',wrapper,null,'header');

        // header
        domMgr.mk('span',header, _tr("Welcome to <b>Igaro App</b> JavaScript Framework"));

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
                    message: _tr("You can view the code behind any page in this app by clicking the curly bracket icon in the header."),
                    hideable: true,
                    id:model.path.join('.')+'.hintcode'
                }),

                objectMgr.create('list').then(function (list) {

                    return writeList([
                        ['overview', _tr("Overview")],
                        ['features', _tr("Widgets")],
                        ['install', _tr("Install")],
                        ['showcase', _tr("Showcase")]
                    ],list).then(function() {

                        var domMgr = list.managers.dom;
                        return domMgr.mk('section', null, [
                            domMgr.mk('h1', null, _tr('Insight')),
                            domMgr.mk('p', null, _tr("HTML falters when used for declaring dynamic views in web-applications, and most JavaScript frameworks deal with this shortcoming by introducing sync and data binding overheads. Looking for an alternative?")),
                            list.container
                        ],'first');
                    });
                }),

                objectMgr.create('list').then(function (list) {

                    return writeList([
                        ['structure',_tr("Basics")],
                        ['bless', _tr("Bless")],
                        ['async', _tr("Async")],
                        ['events',_tr("Events")],
                        ['security',_tr("Security")],
                        ['design', _tr("Design")],
                        ['routes', _tr("Routes")],
                        ['locale', _tr("Locale")],
                        ['mobile', _tr("Mobile")],
                        ['compat',_tr("Compatibility")],
                        ['testing',_tr("Testing")],
                        ['modules',_tr("Modules")]
                    ],list).then(function() {

                        var domMgr = list.managers.dom;
                        return domMgr.mk('section', null, [
                            domMgr.mk('h1', null, _tr("Documentation")),
                            domMgr.mk('p', null, _tr("All Igaro App's modules are documented via JSDoc, but the online help is more exhaustive and comes with demos.")),
                            list.container
                        ]);
                    });
                }),

                objectMgr.create('list').then(function (list) {

                    return writeList([
                        ['forum',_tr("Forum"),'http://forum.igaro.com'],
                        ['report', _tr("Report"),'https://github.com/igaro/app/issues'],
                        ['contact', _tr("Contact")],
                    ],list).then(function() {

                        var domMgr = list.managers.dom;
                        return domMgr.mk('section', null, [
                            domMgr.mk('h1', null, _tr("Support")),
                            domMgr.mk('p', null, _tr("Discuss ideas, get involved with Igaro App development, or seek help.")),
                            list.container
                        ]);
                    });
                })
            ]
        });
    };
};

})();
