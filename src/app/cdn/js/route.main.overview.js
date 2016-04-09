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

            model.stash.title=function(l) { return l.gettext("Overview"); };
            model.stash.description=function(l) { return l.gettext("Igaro App is a JavaScript web-app framework for developing scalable, responsive and dynamic web and mobile apps."); };

            domMgr.mk('p',wrapper,function(l) { return l.gettext("Igaro App is a JavaScript web-app framework for developing scalable web and mobile apps. It's declarative in design and uses ECMA standards, with minimal abstraction."); });

            domMgr.mk('p',wrapper,domMgr.mk('ul',null,null, function() {

                domMgr.mk('li',this,function(l) { return l.gettext("ES5/6 Object Orientated JavaScript."); });
                domMgr.mk('li',this,function(l) { return l.gettext("Superior error handling and asynchronous techniques."); });
                domMgr.mk('li',this,function(l) { return l.gettext("Event driven architecture and modular plugins."); });
                domMgr.mk('li',this,function(l) { return l.gettext("Extreme performance and efficiency."); });
                domMgr.mk('li',this,function(l) { return l.gettext("Built to last, not to be flavour of the month."); });
            }));

            domMgr.mk('h1',wrapper,function(l) { return l.gettext("100% Free"); });

            domMgr.mk('p',wrapper,function(l) { return l.gettext("No lock-ins or premium product. Open Source License."); });

            domMgr.mk('h1',wrapper,function(l) { return l.gettext("Where"); });

            domMgr.mk('p',wrapper,function(l) { return l.gettext("Igaro App can be served to a web browser right the way back to IE8, distributed through an app store, or bundled on removeable media."); });

            domMgr.mk('div',wrapper,null,'viewport');

        };
    };

})();
