
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

        domMgr.mk('p',wrapper,_tr("Igaro App decorates standard javascript objects to provide a two-way parent-child relationship, to aid in dependency tracking, and to cut down on duplicate code. It provides a level of abstraction and the ability for objects to communicate and become dynamically extendable."));

        domMgr.mk('h1',wrapper,_tr("Example Code"));
        domMgr.mk('p',wrapper,_tr("Most objects self bless (route files are the omission). Core files may require little or no blessing, while instance modules (which supply the DOM work and parent-child relationships) use it the most. The following code is typical for an instance module, but not exhaustive. See the core.bless module for what is possible."));

        domMgr.mk('pre',wrapper,"app['core.bless'].call(this,{\
\n    name:'instance.mycreation', \
\n    parent:o.parent,\
\n    asRoot:true,\
\n    hidden:o.hidden,\
\n    disabled:o.disabled,\
\n    stash:o.stash,\
\n    container:function(dom) {\
\n        return dom.mk('div',o.container,null,o.className);\
\n    }\
\n})");

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
                    content:_tr("A path is used to identify the objects location by way of it's hierarchical position. It's built using the name. Although an object may belong to another it's path may stop at the child, it doesn't necessarily have to resolve all the way to root. How this is used is covered later.")
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
                    content:_tr("If a container is provided DOM helpers will be added to the object. These include show, hide, disable and enable.")
                },
                {
                    title:_tr("Destructor"),
                    content:_tr("A destructor is appended which when called will wipe dependencies, circular references, children, dom elements and events and will fire an event allowing dependents to do the same.")
                }
            ]
        }).then(function(accordion) {
            domMgr = accordion.managers.dom;
            domMgr.mk('h1',wrapper,_tr("Provides"));
            domMgr.mk('p',wrapper);
            domMgr.append(wrapper,accordion);
        });



    };

};

})();
