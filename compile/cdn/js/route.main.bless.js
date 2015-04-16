
(function() {

"use strict";

module.requires = [
    { name: 'route.main.bless.css' }
];

module.exports = function(app) {

    return function(model) {

        var wrapper = model.wrapper,
            managers = model.managers,
            objectMgr = managers.object,
            domMgr = managers.dom;
        
        model.stash.title=_tr("Bless");

        domMgr.mk('p',wrapper,_tr("Igaro App's bless decorates standard javascript objects providing two-way parent-child event management, managers, dependency tracking, abstraction, shared routines and dynamic functions."));
        domMgr.mk('p',wrapper,_tr("Most objects bless themselves, and most objects in Igaro are blessed."));

        domMgr.mk('h1',wrapper,_tr("Usage"));

        domMgr.mk('p',wrapper,_tr("As the following code demonstrates, blessing an object is simple. Many attributes are within the <b>o</b> literal and are passed through. See the core.bless module for what this literal may contain."));
        
        domMgr.mk('pre',wrapper,"var InstanceMyWidget = function(o) {\
\n   this.name = 'instance.mywidget';\
\n   this.asRoot = true;\
\n   this.container = function(dom) {\
\n        return dom.mk('div',o.container,null,o.className);\
\n   };\
\n   o.parent = this;\
\n   app['core.bless'].call(this,o);\
\n}");

        domMgr.mk('p',wrapper,_tr("The .asRoot flag will be covered in the next chapter."));

        return objectMgr.create('accordion', {
            sections : [
                {
                    title:_tr("Parent"),
                    content:_tr("A reference to a parent object is stored on the child (while this introduces a circular dependency, it's taken care of when the object destructs).")
                },
                {
                    title:_tr("Name"),
                    content:_tr("An object is given a name which can be used to uniquely identify it or it's type. Not to be confused with instanceof!")
                },
                {
                    title:_tr("Path"),
                    content:_tr("A path is used to identify the objects location by way of it's hierarchical position. It's built using the name. Although an object may belong to another it's path may stop at the child, it doesn't necessarily have to resolve all the way to root. This is one usage of the .asRoot flag.")
                },
                {
                    title:_tr("Stash"),
                    content:_tr("Holds data that may not be attributes of the object.")
                },
                {
                    title:_tr("Managers"),
                    content:_tr("A manager is a module that uses the blessed decorations to enhance the way the original routines work. Common managers include events, debugging, object creation and dom. Additional managers can be supplied at time of blessing, i.e if the module requires a store. Any module can be a manager.")
                },
                {
                    title:_tr("Helpers"),
                    content:_tr("If a container is provided, helpers will be added to the object. These include show/hide and disable/inert.")
                },
                {
                    title:_tr("Destructor"),
                    content:_tr("A destructor is appended which when called will wipe dependencies, circular references, children, dom elements and events and will fire an event allowing dependents to do the same.")
                }
            ]
        }).then(function(accordion) {
            domMgr = accordion.managers.dom;
            domMgr.mk('h1',wrapper,_tr("Provides"));
            domMgr.mk('p',wrapper,_tr("What bless provides for an object depends on what was available and passed to it at the point of blessing."));
            domMgr.append(wrapper,accordion);
        });

    };

};

})();
