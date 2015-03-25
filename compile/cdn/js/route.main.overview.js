(function () {

"use strict";

module.requires = [
	{ name: 'route.main.overview.css' }
];

module.exports = function(app) {

   	return function(model) {

        var wrapper = model.wrapper;

        var managers = model.managers,
            domMgr = managers.dom;

        model.setMeta('title', _tr("Overview"));

        domMgr.mk('p',wrapper,_tr("Igaro App is a Javascript based framework for developing scalable, responsive and dynamic web and mobile applications."));

        domMgr.mk('h1',wrapper,_tr("Benefits"));

        domMgr.mk('p',wrapper,domMgr.mk('ul',null,null, function() {

            domMgr.mk('li',this,_tr("Promotes best practice, enforcing structured coding for beginners."));

            domMgr.mk('li',this,_tr("Very easy to learn, just standard Object Orientated Javascript."));

            domMgr.mk('li',this,_tr("Excellent for teamwork with workflows that recompile as you work."));

            domMgr.mk('li',this,_tr("Cutting edge features, error handling and techniques."));
            
            domMgr.mk('li',this,_tr("Completely dynamic with an event driven architecture."));

            domMgr.mk('li',this,_tr("Cutting edge features, error handling and techniques."));

        }));


        domMgr.mk('h1',wrapper,_tr("Users"));

        domMgr.mk('p',wrapper,_tr("Igaro App offers something for everyone. It goes about things a different way, integrating stake holders and cutting down on the time required to role a request out the door."));

        domMgr.mk('h2',wrapper,_tr("Managers"));

        domMgr.mk('p',wrapper,_tr("Tired of delays and unexpected issues causing time-frame overruns? Tired of user hate mail? Tired of choosing a solution of the hour and investing resources in your employees only to have that knowledge devalued in three months time?"));

        domMgr.mk('h2',wrapper,_tr("Developers"));

        domMgr.mk('p',wrapper,_tr("Tired of frameworks that promise the world but which later on you discover aren't dynamic enough to emcompass the changes you are asked to make? Tired of hacky irritating code, memory leaks and random problems you can't debug?"));

        domMgr.mk('h2',wrapper,_tr("Designers"));

        domMgr.mk('p',wrapper,_tr("Want to rapidly build on the bess written SASS->CSS3 code out there? Want to do away with HTML and integrate with your developers?"));
        
        domMgr.mk('h1',wrapper,_tr("Cost"));

        domMgr.mk('p',wrapper,_tr("100% Free. No lock-ins, tie downs, advertising or premium product."));

        domMgr.mk('h1',wrapper,_tr("Where"));

        domMgr.mk('p',wrapper,_tr("Igaro App can be served to a web browser, distributed through an app store, or bundled on removeable media."));

        domMgr.mk('p',wrapper,_tr("It works great on monitors, tablets. phones and everything inbetween."));
  
        domMgr.mk('div',wrapper,null,'viewport');

    };
};


})();
