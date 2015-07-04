//# sourceURL=route.main.showcase.js

(function () {

"use strict";

module.requires = [
    { name: 'route.main.showcase.css' }
];

module.exports = function(app) {

    return function(model) {

        var wrapper = model.wrapper,
            domMgr = model.managers.dom,
            router = app['core.router'];

        model.stash.title=_tr("Showcase");
        model.stash.description=_tr("A showcase of App's and examples.");

        domMgr.mk('p',wrapper,_tr("Igaro App is a new framework! We're on the lookout for examples where it's being used. Made something? Send us a link!"));

        domMgr.mk('h1',wrapper,"TodoMVC");

        domMgr.mk('p',wrapper,_tr("The TodoMVC project aims to compare Frameworks."));

        domMgr.mk('div',wrapper,null,"todomvc");

        domMgr.mk('button',wrapper,_tr("Show Igaro App Implementation")).addEventListener('click',function() {
            router.to(model.uriPath.concat('todomvc'));
        });

    };

};

})();
