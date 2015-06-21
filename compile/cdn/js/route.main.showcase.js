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

        domMgr.mk('button',wrapper,_tr("TodoMVC")).addEventListener('click',function() {
            router.to(model.uriPath.concat('todomvc'));
        });

    };

};

})();
