(function() {

"use strict";

module.requires = [
    { name: 'route.main.faq.css' }
];

module.exports = function(app) {

    return function(model) {

        var domMgr = model.managers.dom,
            wrapper = model.wrapper;

        model.stash.title= _tr("FAQ");

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

        domMgr.mk('h1',wrapper,_tr("3rd Party Integration"));

        domMgr.mk('p',wrapper,_tr("Existing code can be rapidly integrated into the Igaro App framework."));

        domMgr.mk('p',wrapper,_tr("Generally speaking you may utilize all 3rd party libraries (i.e JQuery) with the Igaro App framework. We've included several of the common ones in the main repository."));

        domMgr.mk('h1',wrapper,_tr("Dependencies"));

        domMgr.mk('p',wrapper,_tr("Igaro App is entirely free of dependencies. It doesn't require JQuery or any other third party library."));

        domMgr.mk('h1',wrapper,_tr("Is Igaro App like x,y,z?"));

        domMgr.mk('p',wrapper,_tr("Probably not. Frameworks like Angular, Backbone and React use HTML and data binding and hence are inheritly inefficient. On the face of it they appear easy to learn but fall flat on large scale App development. If you need glue to stick a mess together, they work well. Igaro App is simply better engineered - it doesn't need a digest cycle or virtual DOM. There must be a reason why Angular 'sponsored by Google' isn't used in any of Googles products?"));

    };

};

})();
