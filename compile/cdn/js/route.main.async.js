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

        domMgr.mk('p',wrapper,_tr("Igaro App has an asynchronous architecture and employs standard A+ Promises."));

        domMgr.mk('p', wrapper, _tr("Functions typically dispatch an event at the end of execution, which includes a reference to itself and a passed value. While events are synchronous in chain and hierarchy, each event may contain asynchronous code. For this reason the majority of functions return a Promise."));

        domMgr.mk('h1',wrapper,_tr("ES6 Promise Standard"));

        domMgr.mk('p',wrapper,_tr("Standard Promises are used throughout."));

        domMgr.mk('button',wrapper,_tr("Learn More"), function() {
            this.addEventListener('click', function() {
                window.open("https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise");
            });
        });

        domMgr.mk('h1',wrapper,_tr("Sequencing"));

        domMgr.mk('p',wrapper,_tr("Promises can become verbose, especially for sequencing (applying the output from multiple Promises with retained order)."));

        domMgr.mk('p',wrapper,_tr("The <b>core.object</b> module provides <b>promiseSequencer()</b> to reduce Promises while <b>addSequence()</b> provided by <b>core.router</b> is similar but also appends DOM elements (or the container element for a blessed object)."));

        domMgr.mk('p',wrapper,_tr("Most widgets provide pluralized creation functions like <b>addItem()</b> and <b>addItems()</b>."));

        domMgr.mk('p',wrapper,null,function() {

            domMgr.mk('button',this,_tr("Next Chapter - Events")).addEventListener('click',function() {

                model.parent.to(['events']);
            });
        });

    };

};
