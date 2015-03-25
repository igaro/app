(function() {

"use strict";

module.requires = [
    { name: 'route.main.async.css' },
    { name: 'core.language.js' }
];

module.exports = function(app) {

    return function(model) {

        var wrapper = model.wrapper,
            domMgr = model.managers.dom,
            router = app['core.router'];
        
        model.setMeta('title', _tr("Asynchronous"));

        domMgr.mk('p',wrapper,_tr("Igaro App is an asynchronous framework using Promises and Event Management to manage delayed notification and value convergence. Callbacks are a thing of the past, and most functions in Igaro App return Promises rather than values."));

        domMgr.mk('p', wrapper, _tr("Most functions dispatch an event at the end of execution which while sychronous in terms of a chain may contain asynchronous operations. Step-over execution should only occur once registered handles for the event complete hence requiring a Promise to be returned."));

        domMgr.mk('p', wrapper, _tr("Functions modified at a later date to include asynchronous code break callers that expect a value. For compatibility with future code it is better to return a Promise even if the operation is not currently asynchronous."));

        domMgr.mk('h1',wrapper,_tr("Promises"));

        domMgr.mk('p',wrapper,_tr("Standard Promises (ES6, A+) are used to replace callback routines. Promises allow for chainable asynchronous operation with error control and are native to modern browsers. Older browsers have a polyfill library loaded automatically."));

        domMgr.mk('button',wrapper,_tr("Promises"), function() {
            this.addEventListener('click', function() {
                window.open("https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise");
            });
        });

        domMgr.mk('h1',wrapper,_tr("Event Management"));

        domMgr.mk('p',wrapper,_tr("Promises are for objects initiating work, not for objects wishing to be notified when the state of the work has changed. To provide this feature Igaro App uses a complex and powerful event management system. Data and identifiers are returned to each registered party and are propagated vertically through parent objects. It works similarily to the native DOM event system, but it's for objects not elements!"));

        domMgr.mk('p', wrapper, _tr("Igaro App's event management system is cleaner than Object.observe() and signficiantly faster than any other framework's implementation. Events are linked to dependencies, which can be other objects or DOM elements and are automatically released, avoiding memory leaks by removing circular references and allowing Javascripts garbage collector to do it's job. The entire process is automatic."));
   
        domMgr.mk('button',wrapper,'core.events', function() {
            this.addEventListener('click', function() {            
                router.to(['modules','core.events']);
            });
        });

    };

};

})();
