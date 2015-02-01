(function() {

"use strict";

module.requires = [
    { name: 'route.main.async.css' },
    { name: 'core.language.js' }
];

module.exports = function(app) {

    return function(model) {

        var wrapper = model.wrapper,
            dom = model.managers.dom,
            router = app['core.router'];
        
        model.setMeta('title', {"fr":"","en":"Asynchronous"});

        dom.mk('p',wrapper,{"fr":"","en":"Igaro App is an asynchronous framework using Promises and Event Management to manage delayed notification and value convergence. Callbacks are a thing of the past, and most functions in Igaro App return Promises rather than values."});

        dom.mk('p', wrapper, {"fr":"","en":"This design choice was made for two reasons;"});

        dom.mk('li', wrapper, {"fr":"","en":"Most functions dispatch an event at the end of execution, which is an async operation. Step-over execution should only occur once registered handles for this event complete hence requiring the event Promise to be returned."});

        dom.mk('li', wrapper, {"fr":"","en":"Functions that are later modified to include asynchronous code break callers that expect a value. For compatibility with future code it is better to return a Promise even if the operation is not currently asynchronous."});

        dom.mk('h1',wrapper,{"fr":"","en":"Promises"});

        dom.mk('p',wrapper,{"fr":"","en":"Standard Promises (ES6, A+) are used to replace callback routines. Promises allow for chainable asynchronous operation with error control and are native to modern browsers. Older browsers have a polyfill library loaded automatically."});

        dom.mk('button',wrapper,{"fr":"","en":"Promises"}, function() {
            this.addEventListener('click', function() {
                window.open("https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise");
            });
        });

        dom.mk('h1',wrapper,{"fr":"","en":"Event Management"});

        dom.mk('p',wrapper,{"fr":"","en":"Promises are for objects initiating work but not for when the object wishes to be notified when another object executes the work. To provide this feature Igaro App uses an event management system. Data and identifiers are returned to each registered party and are propagated vertically through parent objects. It works similarily to the native DOM event system, but it's for objects not elements!"});

        dom.mk('p', wrapper, {"fr":"","en":"Igaro App's event management system is cleaner than Object.observe() and signficiantly faster than any other framework's implementation. Events are linked to dependencies, which can be other objects or DOM elements and are automatically released, avoiding memory leaks by removing circular references and allowing Javascripts garbage collector to do it's job. The entire process is automatic."});
   
        dom.mk('p',wrapper,{"fr":"","en":"Any blessed object (most objects in Igaro App are blessed) gains an event manager."});

        dom.mk('button',wrapper,'core.bless', function() {
            this.addEventListener('click', function() {
                router.to(['modules','core.bless']);
            });
        });

        dom.mk('button',wrapper,'core.events', function() {
            this.addEventListener('click', function() {            
                router.to(['modules','core.events']);
            });
        });

    };

};

})();