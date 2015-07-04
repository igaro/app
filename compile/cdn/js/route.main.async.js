//# sourceURL=route.main.async.js

module.requires = [
    { name: 'route.main.async.css' }
];

module.exports = function() {

    "use strict";

    return function(model) {

        var wrapper = model.wrapper,
            domMgr = model.managers.dom;

        model.stash.title= _tr("Asynchronous");
        model.stash.desc = _tr("Standard A+ Promises throughout, with an event driven architecture and sequencing.");

        domMgr.mk('p',wrapper,_tr("Igaro App is <b>100%</b> asynchronous, using Promises."));

        domMgr.mk('p', wrapper, _tr("Most functions in Igaro App dispatch an event at the end of execution which includes a reference to itself and a value. While events are synchronous in chain and hierarchy, each event may contain asynchronous code. This is why most functions return a Promise."));

        domMgr.mk('h1',wrapper,_tr("Promise Standard"));

        domMgr.mk('p',wrapper,_tr("Standard Promises (ES6, A+) are used throughout."));

        domMgr.mk('button',wrapper,_tr("Learn More"), function() {
            this.addEventListener('click', function() {
                window.open("https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise");
            });
        });

        domMgr.mk('h1',wrapper,_tr("Sequencing"));

        domMgr.mk('p',wrapper,_tr("Unfortunately Promises can become verbose, especially for sequencing (applying the output from multiple Promises in the order they were supplied in). While future versions of Javascript attempt to address this, a standard is many years away."));

        domMgr.mk('p',wrapper,_tr("core.object provides promiseSequencer() to reduce promises in order while core.router's .addSequence() is similar but also appends DOM elements (or the container element for an instance)."));

        domMgr.mk('p',wrapper,_tr("Many instance modules provide pluralized creation functions, i.e .addItem() and addItems()."));

    };

};
