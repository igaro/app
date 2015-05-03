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

        domMgr.mk('p',wrapper,_tr("Igaro App is <b>100%</b> asynchronous, using Promises."));

        domMgr.mk('p', wrapper, _tr("In Igaro App most functions dispatch an event at the end of execution which includes a reference to itself and a value. While events are synchronous in chain and hierarchy, each event may contain asynchronous code. This is why most functions return a Promise."));

        domMgr.mk('h1',wrapper,_tr("Promise Standard"));

        domMgr.mk('p',wrapper,_tr("Standard Promises (ES6, A+) are used throughout."));

        domMgr.mk('button',wrapper,_tr("Learn More"), function() {
            this.addEventListener('click', function() {
                window.open("https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise");
            });
        });

        domMgr.mk('h1',wrapper,_tr("Sequencing"));

        domMgr.mk('p',wrapper,_tr("Unfortunately Promises can become verbose, especially for sequencing (applying the output from multiple Promises in the order they were supplied in). While future versions of Javascript attempt to address this, a standard is many years away."));

        domMgr.mk('p',wrapper,_tr("To assist, many instance modules provide pluralized creation functions, i.e .addItem() and addItems(), and core.router provides .addSequence()."));

        domMgr.mk('p', wrapper, _tr("Igaro App's event management system is cleaner than Object.observe() and signficiantly faster than any other framework's implementation. Events are linked to dependencies, which can be other objects or DOM elements and are automatically released, avoiding memory leaks by removing circular references and allowing Javascripts garbage collector to do it's job. The entire process is automatic."));

    };

};

})();
