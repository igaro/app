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

        domMgr.mk('p',wrapper,_tr("<b>core.events</b> provides event management and a manager, which is used extensively by other modules to provide objects with an Event Emitter. This propagates events to parent objects, supports Promises, and tracks dependencies."));

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
                    domMgr.mk('pre',container,domMgr.mk('code', null,"app['core.language'].on('setEnv',funcToExec, { deps:[this] });"));
                    domMgr.mk('p',container,_tr("The code above demonstrates how to attach listeners to other objects event managers while retaining a dependency link. If the object <b>this</b> is destroyed, all event handles will be removed, including those on other event managers."));
                    domMgr.mk('h1',container,_tr("Event Termination"));
                    domMgr.mk('p',container,_tr("An Event Emitter supports either a throw, a rejected Promise, or an object literal containing <b>{ stopImmediatePropagation:true }</b>. To prevent propagation through parents, return <b>{ stopPropagation:true }</b>."));
                    domMgr.mk('p',container,_tr("The <b>asRoot</b> (see Bless) flag prevents a child event dispatching up to a parent. It is mostly used by instances as a parent has no need for these dispatches."));
                    domMgr.mk('h1',container,_tr("Example"));
                    domMgr.mk('p',container,_tr("At the bottom of this page is an <b>instance.date</b>. If you change the timezone using the settings icon at the top it refreshes it's container element. This is accomplished by listening for the timezone change event on <b>core.date</b>."));

                    domMgr.mk('p',container,null,function() {

                        domMgr.mk('button',this,_tr("Next Chapter - Security")).addEventListener('click',function() {

                            model.parent.to(['security']);
                        });
                    });
                    return container;
                })
            ]
        });

    };

};
