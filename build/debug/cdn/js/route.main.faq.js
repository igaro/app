(function() {

"use strict";

module.requires = [
    { name: 'route.main.faq.css' },
    { name: 'core.language.js' }
];

module.exports = function(app) {

    return function(model) {

        var dom = model.managers.dom,
            wrapper = model.wrapper;

        model.setMeta('title', {"en":"FAQ"});

        dom.mk('p',wrapper,{"en":"Hopefully the following list will satisfy your query. If not, and you feel an answer should be included for the benefit of other users, hit the button below."}); 

        dom.mk('button',wrapper,{"en":"Email Us"}, function() {
            this.addEventListener('click', function() {
                window.open('mailto:faq-add@igaro.com');
            });
        }); 

        dom.mk('h1',wrapper,{"en":"Browser Compatibility"});

        dom.mk('p',wrapper,{"en":"Igaro App includes polyfills to maximise support for older browsers. Where a browser doesn't provide a required feature the user is notified. Modules define there own requirements, which are then enforced by the main loader. Igaro App supports standardized web technology and won't target specific browser types/features."});

        dom.mk('h2',wrapper,{"en":"Internet Explorer < 10"});

        dom.mk('p',wrapper,{"en":"Support for older versions of I.E (8/9) is possible but discouraged. You'll need to regress features which can't be polyfilled such as SVG support."});

        dom.mk('h2',wrapper,{"en":"Android < 3"});

        dom.mk('p',wrapper,{"en":"Due to lack of standard features, support is disabled by default."});

        dom.mk('h1',wrapper,{"en":"Existing Javascript Integration"});

        dom.mk('p',wrapper,{"en":"You can use existing code and rapidly integrate it into the Igaro App framework where you require use of it's advanced features."});

        dom.mk('p',wrapper,{"en":"You can use generally utilize all 3rd party libraries (i.e JQuery, YetAnotherJS) with the Igaro App framework. We've included several of the common ones in the main repository."});

        dom.mk('h1',wrapper,{"en":"Dependencies"});

        dom.mk('p',wrapper,{"en":"Igaro App is entirely free of dependencies. It doesn't require JQuery or any other third party library."});

        dom.mk('h1',wrapper,{"en":"Efficiency"});

        dom.mk('p',wrapper,{"en":"As everything is built around an astonishingly efficient framework, your derived product, be it big or small, will scale and continue to work over time. And boy will it work fast! Oh, and flickering DOM updates are a thing of lesser frameworks."});

        dom.mk('h1',wrapper,{"en":"Learning Overhead"});

        dom.mk('p',wrapper,{"en":"Igaro App is pure Javascript! It's one of the only frameworks that treats Javascript as the prototypal language that it is - there's no attempt to classify. If you know Javascript, then you're ready to develop with Igaro App. If not, and you learn Igaro App through studying it's examples and code, you'll learn about the very best of Javascript and cutting edge technique."});

    };

};

})();