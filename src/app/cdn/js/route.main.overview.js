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

            model.stash.title=function() { return this.gettext("Overview"); };
            model.stash.description=function() { return this.gettext("Igaro App is a JavaScript web-app framework for developing scalable, responsive and dynamic web and mobile apps."); };

            domMgr.mk('p',wrapper,function() { return this.gettext("Igaro App is a JavaScript web-app framework for developing scalable web and mobile apps. It's declarative in design and uses ECMA standards, with minimal abstraction."); });

            domMgr.mk('p',wrapper,domMgr.mk('ul',null,null, function() {

                domMgr.mk('li',this,function() { return this.gettext("ES5/6 Object Orientated JavaScript."); });
                domMgr.mk('li',this,function() { return this.gettext("Superior error handling and asynchronous techniques."); });
                domMgr.mk('li',this,function() { return this.gettext("Event driven architecture and modular plugins."); });
                domMgr.mk('li',this,function() { return this.gettext("Extreme performance and efficiency."); });
                domMgr.mk('li',this,function() { return this.gettext("Built to last, not to be flavour of the month."); });
            }));

            domMgr.mk('h1',wrapper,function() { return this.gettext("100% Free"); });

            domMgr.mk('p',wrapper,function() { return this.gettext("No lock-ins or premium product. Open Source License."); });

            domMgr.mk('h1',wrapper,function() { return this.gettext("Where"); });

            domMgr.mk('p',wrapper,function() { return this.gettext("Igaro App can be served to a web browser right the way back to IE8, distributed through an app store, or bundled on removeable media."); });

            domMgr.mk('div',wrapper,null,'viewport');

        };
    };

})();
