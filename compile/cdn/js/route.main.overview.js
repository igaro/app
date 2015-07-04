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
        model.stash.description=_tr("Igaro App is a Javascript framework for developing scalable, responsive and dynamic web and mobile apps.");

        domMgr.mk('p',wrapper,_tr("Igaro App is a Javascript framework for developing scalable, responsive and dynamic web and mobile apps."));

        domMgr.mk('p',wrapper,domMgr.mk('ul',null,null, function() {

            domMgr.mk('li',this,_tr("High quality structured coding throughout."));

            domMgr.mk('li',this,_tr("Standard Object Orientated Javascript."));

            domMgr.mk('li',this,_tr("Cutting edge features, error handling and techniques."));

            domMgr.mk('li',this,_tr("Dynamic with an event driven architecture and modular plugins."));

            domMgr.mk('li',this,_tr("Extreme performance and efficiency."));

        }));

        domMgr.mk('h1',wrapper,_tr("Cost"));

        domMgr.mk('p',wrapper,_tr("100% Free. No lock-ins, tie downs, advertising or premium product."));

        domMgr.mk('h1',wrapper,_tr("Where"));

        domMgr.mk('p',wrapper,_tr("Igaro App can be served to a web browser, distributed through an app store, or bundled on removeable media."));

        domMgr.mk('p',wrapper,_tr("It works great on monitors, tablets. phones and everything inbetween."));

        domMgr.mk('div',wrapper,null,'viewport');

    };
};


})();
