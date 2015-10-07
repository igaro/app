//# sourceURL=route.main.events.js

module.requires = [
    { name: 'route.main.events.css' }
];

module.exports = function(app) {

    "use strict";

    return function(model) {

        var managers = model.managers,
            domMgr = managers.dom,
            dom = app['core.dom'],
            objectMgr = managers.object,
            wrapper = model.wrapper;

        model.stash.title = _tr("Events");
        model.stash.desc = _tr("Igaro App's event management system tracks dependencies and propagates events up through parent objects.");

        domMgr.mk('p',wrapper,_tr("Igaro App is <b>100%</b> event driven."));
        domMgr.mk('p',wrapper,_tr("core.events is responsible for event management. It provides a manager to core.object's bless, which is used extensively to provide objects with an Event Emitter. Unlike the EventEmitter you may know from NodeJS, this one propagates events up to parents, supports Promises, and events track dependencies."));

        return model.addSequence({
            container:wrapper,
            promises:[
                objectMgr.create('accordion', {
                    sections : [
                        {
                            title:_tr("on"),
                            content:_tr("This registers an event handle onto an emitter. It takes three arguments; the event name, a function, and an object literal. The object literal defines whether the event is prepended and which dependencies should be linked to the event. This allows you to 'bolt on' events to other objects' event emitters without worrying about memory release.")
                        },
                        {
                            title:_tr("dispatch"),
                            content:_tr("A dispatch may be sent with a value. If the object is a child 'car' of another object 'warehouse', the parent will also receive the dispatch.")
                        },
                        {
                            title:_tr("remove"),
                            content:_tr("This removes an event either by its registered function or a dependency.")
                        }
                    ]
                }).then(function(accordion) {
                    var container = document.createDocumentFragment(),
                        domMgr = accordion.managers.dom;
                    domMgr.mk('h1',container,_tr("The Event Emitter"));
                    domMgr.mk('p',container);
                    dom.append(container,accordion);
                    domMgr.mk('h1',container,_tr("Event Termination"));
                    domMgr.mk('p',container,_tr("The event emitter supports either a rejected Promise or an object literal containing { stopImmediatePropagation:true }. To prevent propagation through parents, return { stopPropagation:true }."));
                    domMgr.mk('p',container,_tr("The .asRoot (see Bless) flag prevents a child event dispatching any further through a parent chain. It is mostly used by instances as a parent has no need for these dispatches. Some instances, such as instance.xhr fire events on the root emitter."));
                    domMgr.mk('h1',container,_tr("Example"));
                    domMgr.mk('p',container,_tr("At the bottom of this page is an instance.date formatted with moment.js. When you change the timezone or language of the this app using the settings icon at the top, moment.js has it's mode switched and instance.date.js refreshes it's DOM elements. Try it for yourself."));

                    return container;
                })
            ]
        });

    };

};
