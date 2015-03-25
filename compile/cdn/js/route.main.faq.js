(function() {

"use strict";

module.requires = [
    { name: 'route.main.faq.css' },
    { name: 'core.language.js' }
];

module.exports = function(app) {

    return function(model) {

        var domMgr = model.managers.dom,
            wrapper = model.wrapper;

        model.setMeta('title', _tr("FAQ"));

        domMgr.mk('p',wrapper,_tr("If on reading this FAQ you feel a question and answer is missing please contact us.")); 

        domMgr.mk('button',wrapper,_tr("Email Us"), function() {
            this.addEventListener('click', function() {
                window.open('mailto:faq-app@igaro.com');
            });
        }); 

        domMgr.mk('h1',wrapper,_tr("Browser Compatibility"));

        domMgr.mk('p',wrapper,_tr("Igaro App includes polyfills to maximise support for older browsers. Where a browser doesn't provide a required feature the user is notified. Modules define there own requirements, which are then enforced by the main loader. Igaro App supports standardized web technology and won't target specific browser types/features."));

        domMgr.mk('h2',wrapper,_tr("Internet Explorer < 10"));

        domMgr.mk('p',wrapper,_tr("Support for older versions of I.E (8/9) is possible but discouraged. You'll need to regress features which can't be polyfilled such as SVG support."));

        domMgr.mk('h2',wrapper,_tr("Android < 3"));

        domMgr.mk('p',wrapper,_tr("Due to lack of standard features, support is disabled by default."));

        domMgr.mk('h1',wrapper,_tr("3rd Party Javascript Integration"));

        domMgr.mk('p',wrapper,_tr("Existing code can be rapidly integrated into the Igaro App framework."));

        domMgr.mk('p',wrapper,_tr("Generally speaking you may utilize all 3rd party libraries (i.e JQuery) with the Igaro App framework. We've included several of the common ones in the main repository."));

        domMgr.mk('h1',wrapper,_tr("Dependencies"));

        domMgr.mk('p',wrapper,_tr("Zero. Ziltch. Igaro App is entirely free of dependencies. It doesn't require JQuery or any other third party library."));

        domMgr.mk('h1',wrapper,_tr("Prototype or Classes?"));

        domMgr.mk('p',wrapper,_tr("Neither. Igaro App blesses Javascript Objects. See the core.bless module."));

        domMgr.mk('h1',wrapper,_tr("Is Igaro App like x,y,z?"));

        domMgr.mk('p',wrapper,_tr("No. Frameworks like Angular, Backbone and React use HTML, data binding and are inefficient. They appear powerful and easy to learn but fall flat when you try to make a real App with them, and that's because they have been designed to sell, not to do things right. There's a reason why Angular 'sponsored by Google' isn't used in any of Googles products."));

    };

};

})();
