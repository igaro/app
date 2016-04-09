//# sourceURL=route.main.bless.js

module.requires = [
    { name: 'route.main.bless.css' }
];

module.exports = function(app) {

    "use strict";

    return function(model) {

        var wrapper = model.wrapper,
            managers = model.managers,
            objectMgr = managers.object,
            domMgr = managers.dom,
            dom = app['core.dom'];

        model.stash.title=function() { return this.tr((({ key:"Bless" }))); };
        model.stash.description=function() { return this.tr((({ key:"Igaro App's bless decorates standard JavaScript objects. It provides managers, dependency tracking and common functions." }))); };

        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"Igaro App's bless (part of <b>core.object</b>) decorates standard JavaScript objects. It provides managers (storage, events), dependency tracking, shared functionality and boilerplate. Objects usually bless themselves, and in Igaro App most objects are blessed." }))); });
        domMgr.mk('h1',wrapper,function() { return this.tr((({ key:"Managers" }))); });
        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"A manager is a module (or part of) customized to a blessed object. Any module can offer managerial functionality, for example the <b>core.dom</b> module offers a function <b>mk</b> to create elements, but do the same using a dom manager on the blessed object and that element will automatically disappear if the blessed object is destroyed." }))); });

        domMgr.mk('h1',wrapper,function() { return this.tr((({ key:"Usage" }))); });
        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"Blessing an object is accomplished with a single call. Most configuration attributes are held within an argument, while a few can be pre-set prior to call." }))); });

        domMgr.mk('pre',wrapper,domMgr.mk('code',null,"var myWidget = function(o) {\
\n\
\n   this.name = 'instance.mywidget';\
\n   this.container = function(dom) {\
\n        return dom.mk('div',o.container,null,o.className);\
\n   };\
\n   app['core.object'].bless.call(this,o);\
\n}"));

        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"In the above example the object is given a namespace of <b>instance.mywidget</b>. This is used by several managers, for example the event manager as it fires events up the chain." }))); });
        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"The power of bless will quickly become apparent when you start using Igaro App. Take your standard JavaScript object containing an array of child objects. When one of those objects is destroyed it should be removed from the array. Bless does this for you." }))); });

        return objectMgr.create('accordion', {
            sections : [
                {
                    title:function() { return this.tr((({ key:"Parent" }))); },
                    content:function() { return this.tr((({ key:"A reference to a parent object is stored on the child (while this introduces a circular dependency, it's taken care of when the object destructs)." }))); }
                },
                {
                    title:function() { return this.tr((({ key:"Name" }))); },
                    content:function() { return this.tr((({ key:"An object is given a name which can be used to uniquely identify it or it's type. Not to be confused with instanceof!" }))); }
                },
                {
                    title:function() { return this.tr((({ key:"Path" }))); },
                    content:function() { return this.tr((({ key:"A path is used to identify the objects location by way of it's hierarchical position. It's built using the name. Although an object may belong to another it's path may stop at the child, it doesn't necessarily have to resolve all the way to root. This is one usage of the .asRoot flag." }))); }
                },
                {
                    title:function() { return this.tr((({ key:"Stash" }))); },
                    content:function() { return this.tr((({ key:"Holds data that may not be attributes of the object." }))); }
                },
                {
                    title:function() { return this.tr((({ key:"Managers" }))); },
                    content:function() { return this.tr((({ key:"A manager is a module that uses the blessed decorations to enhance it's functions and/or to provide helper functions linking the blessed object as a dependency. Common managers include events, debugging, object creation and dom. Additional managers can be supplied at time of blessing, i.e if the module requires a store. Any module can offer a manager." }))); }
                },
                {
                    title:function() { return this.tr((({ key:"Helpers" }))); },
                    content:function() { return this.tr((({ key:"If a container is provided, helpers will be added to the object. These include show/hide and disable/inert." }))); }
                },
                {
                    title:function() { return this.tr((({ key:"Destructor" }))); },
                    content:function() { return this.tr((({ key:"A destructor is appended which when called will wipe dependencies, circular references, children, dom elements and events and will fire an event allowing dependents to do the same." }))); }
                }
            ]
        }).then(function(accordion) {
            var domMgr = accordion.managers.dom;
            domMgr.mk('h1',wrapper,function() { return this.tr((({ key:"Provides" }))); });
            domMgr.mk('p',wrapper,function() { return this.tr((({ key:"The features blessed to an object depend upon the configuration pre-set and passed. Some of the more common attributes are described below." }))); });
            dom.append(wrapper,accordion);
            domMgr.mk('p',wrapper,null,function() {

                domMgr.mk('button',this,function() { return this.tr((({ key:"Next Chapter - Async" }))); }).addEventListener('click',function() {

                    model.parent.to(['async']);
                });
            });
        });

    };

};
