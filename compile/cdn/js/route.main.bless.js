
(function() {

"use strict";

module.requires = [
    { name: 'route.main.bless.css' },
    { name: 'core.language.js' }
];

module.exports = function(app) {

    return function(model) {

        var wrapper = model.wrapper,
            domMgr = model.managers.dom,
            router = app['core.router'];
        
        model.setMeta('title', _tr("Bless"));

        domMgr.mk('p',wrapper,_tr("An integral feature of Igaro App is how it can decorate standard objects to enhance the parent-child relationship, to aid in dependency tracking, and to cut down on duplicate code."));
        
        domMgr.mk('p', wrapper, _tr("An object is responsible for blessing itself and does so via the core.bless module. Note: no prototypes are added onto the object."));

        domMgr.mk('h1',wrapper,_tr("Parent"));

        domMgr.mk('p', wrapper, _tr("A reference to the parent is stored on the child (while this introduces a circular dependency, it's taken care of when the object destructs)."));

        domMgr.mk('h1',wrapper,_tr("Name & Path"));

        domMgr.mk('p', wrapper, _tr("An object is given a name which can be used to uniquely identify it or it's type."));

        domMgr.mk('p', wrapper, _tr("A path is used to identify the objects location by way of it's hierarchical position."));

        domMgr.mk('h1',wrapper,_tr("Managers"));

        domMgr.mk('p', wrapper, _tr("A manager is a module that uses the blessed decorations to enhance the way the original routines work. For example when an object throws an error it is passed all up the hierarchy by way it's parent. Events then fire an error for each parental object but change the name/path. A parent can thus watch for child errors, even for a particular child."));

        domMgr.mk('p', wrapper, _tr("Common managers include events, debugging, object creation and dom. Additional managers can be supplied at time of blessing, i.e if the module requires a store. Any module can be a manager."));

        domMgr.mk('h1',wrapper,_tr("Destructor"));

        domMgr.mk('p', wrapper, _tr("A blessed object gains a universal destructor which when called will wipe out dependencies, circular references, children, dom elements and events."));
   
        domMgr.mk('button',wrapper,'core.bless', function() {
            this.addEventListener('click', function() {            
                router.to(['modules','core.bless']);
            });
        });

    };

};

})();
