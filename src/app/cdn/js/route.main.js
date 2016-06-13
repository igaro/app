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

        model.stash.title = function() { return this.tr((({ key:"Igaro App JavaScript Framework" }))); };
        model.stash.titletest = function() { return this.tr((({ key:"One \" Framework", plural:"Two Things" })),3); };
        model.stash.description = function() { return this.tr((({ key:"Igaro App is a powerful JavaScript framework for developing single page application websites (web-apps). Zero HTML, zero dependencies and beautifully engineered." }))); };
        model.stash.keywords = function() { return this.tr((({ key:"javascript, spa, app, html5, framework" }))); };

        var wrapper = model.wrapper,
            header = domMgr.mk('div',wrapper,null,'header');

        // header
        domMgr.mk('span',header, function() { return this.tr((({ key:"Welcome to <b>Igaro App</b> JavaScript Framework" }))); });

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
                    message: function() { return this.tr((({ key:"You can view the code behind any page in this app by clicking the curly bracket icon in the header." }))); },
                    hideable: true,
                    id:model.path.join('.')+'.hintcode'
                }),

                objectMgr.create('list').then(function (list) {

                    return writeList([
                        ['overview', function() { return this.tr((({ key:"Overview" }))); }],
                        ['features', function() { return this.tr((({ key:"Widgets" }))); }],
                        ['install', function() { return this.tr((({ key:"Install" }))); }],
                        ['showcase', function() { return this.tr((({ key:"Showcase" }))); }]
                    ],list).then(function() {

                        var domMgr = list.managers.dom;
                        return domMgr.mk('section', null, [
                            domMgr.mk('h1', null, function() { return this.tr((({ key:"Insight" }))); }),
                            domMgr.mk('p', null, function() { return this.tr((({ key:"HTML falters when used for declaring dynamic views in web-applications, and most JavaScript frameworks deal with this shortcoming by introducing sync and data binding overheads. Looking for an alternative?" }))); }),
                            list.container
                        ],'first');
                    });
                }),

                objectMgr.create('list').then(function (list) {

                    return writeList([
                        ['structure',function() { return this.tr((({ key:"Basics" }))); }],
                        ['bless', function() { return this.tr((({ key:"Bless" }))); }],
                        ['async', function() { return this.tr((({ key:"Async" }))); }],
                        ['events',function() { return this.tr((({ key:"Events" }))); }],
                        ['security',function() { return this.tr((({ key:"Security" }))); }],
                        ['design', function() { return this.tr((({ key:"Design" }))); }],
                        ['routes', function() { return this.tr((({ key:"Routes" }))); }],
                        ['locale', function() { return this.tr((({ key:"Locale" }))); }],
                        ['mobile', function() { return this.tr((({ key:"Mobile" }))); }],
                        ['compat',function() { return this.tr((({ key:"Compatibility" }))); }],
                        ['testing',function() { return this.tr((({ key:"Testing" }))); }],
                        ['modules',function() { return this.tr((({ key:"Modules" }))); }]
                    ],list).then(function() {

                        var domMgr = list.managers.dom;
                        return domMgr.mk('section', null, [
                            domMgr.mk('h1', null, function() { return this.tr((({ key:"Documentation" }))); }),
                            domMgr.mk('p', null, function() { return this.tr((({ key:"All Igaro App's modules are documented via JSDoc, but the online help is more exhaustive and comes with demos." }))); }),
                            list.container
                        ]);
                    });
                }),

                objectMgr.create('list').then(function (list) {

                    return writeList([
                        ['forum',function() { return this.tr((({ key:"Forum" }))); },'http://forum.igaro.com'],
                        ['report', function() { return this.tr((({ key:"Report" }))); },'https://github.com/igaro/app/issues'],
                        ['contact', function() { return this.tr((({ key:"Contact" }))); }],
                    ],list).then(function() {

                        var domMgr = list.managers.dom;
                        return domMgr.mk('section', null, [
                            domMgr.mk('h1', null, function() { return this.tr((({ key:"Support" }))); }),
                            domMgr.mk('p', null, function() { return this.tr((({ key:"Discuss ideas, get involved with Igaro App development, or seek help." }))); }),
                            list.container
                        ]);
                    });
                })
            ]
        });
    };
};

})();
