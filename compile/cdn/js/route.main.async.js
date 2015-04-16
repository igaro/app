(function() {

"use strict";

module.requires = [
    { name: 'route.main.async.css' }
];

module.exports = function(app) {

    return function(model) {

        var wrapper = model.wrapper,
            domMgr = model.managers.dom,
            router = app['core.router'];
        
        model.stash.title= _tr("Asynchronous");

        domMgr.mk('p',wrapper,_tr("Igaro App is a <b>100%</b> asynchronous framework using Promises throughout."));

        domMgr.mk('p', wrapper, _tr("In Igaro App most functions dispatch an event at the end of execution which includes a reference to itself and a value. While events are synchronous in chain and hierarchy, each event may contain asynchronous code. This is why most functions in Igaro App return a Promise."));

        domMgr.mk('h1',wrapper,_tr("Promise Standard"));

        domMgr.mk('p',wrapper,_tr("Standard Promises (ES6, A+) are used throughout."));

        domMgr.mk('button',wrapper,_tr("Learn More"), function() {
            this.addEventListener('click', function() {
                window.open("https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise");
            });
        });

        domMgr.mk('h1',wrapper,_tr("Events"));

        domMgr.mk('p',wrapper,_tr("Promises are for objects initiating work, not for object notification when the state of said work has changed. To provide this, Igaro App uses a powerful event management system. Data and identifiers are returned to each registered party and are propagated vertically through parent objects."));

        domMgr.mk('p', wrapper, _tr("Igaro App's event management system is cleaner than Object.observe() and signficiantly faster than any other framework's implementation. Events are linked to dependencies, which can be other objects or DOM elements and are automatically released, avoiding memory leaks by removing circular references and allowing Javascripts garbage collector to do it's job. The entire process is automatic."));

    };

};

})();
