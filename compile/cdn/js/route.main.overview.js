//# sourceURL=route.main.overview.js

(function () {

    "use strict";

    module.requires = [
        { name: 'route.main.overview.css' }
    ];

    module.exports = function() {

        return function(model) {

            var wrapper = model.wrapper;

            var managers = model.managers,
                domMgr = managers.dom;

            model.stash.title=_tr("Overview");
            model.stash.description=_tr("Igaro App is a JavaScript web-app framework for developing scalable, responsive and dynamic web and mobile apps.");

            domMgr.mk('p',wrapper,_tr("Igaro App is a JavaScript web-app framework for developing scalable web and mobile apps. It's declarative in design and uses ECMA standards, with minimal abstraction."));

            domMgr.mk('p',wrapper,domMgr.mk('ul',null,null, function() {

                domMgr.mk('li',this,_tr("ES5/6 Object Orientated JavaScript."));
                domMgr.mk('li',this,_tr("Superior error handling and asynchronous techniques."));
                domMgr.mk('li',this,_tr("Event driven architecture and modular plugins."));
                domMgr.mk('li',this,_tr("Extreme performance and efficiency."));
                domMgr.mk('li',this,_tr("Built to last, not to be flavour of the month."));
            }));

            domMgr.mk('h1',wrapper,_tr("100% Free"));

            domMgr.mk('p',wrapper,_tr("No lock-ins or premium product. Open Source License."));

            domMgr.mk('h1',wrapper,_tr("Where"));

            domMgr.mk('p',wrapper,_tr("Igaro App can be served to a web browser right the way back to IE8, distributed through an app store, or bundled on removeable media."));

            domMgr.mk('div',wrapper,null,'viewport');

        };
    };

})();
