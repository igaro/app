(function() {

"use strict";

module.requires = [
    { name: 'route.main.events.css' }
];

module.exports = function(app) {

    return function(model) {

        var managers = model.managers,
            domMgr = managers.dom,
            dom = app['core.dom'],
            objectMgr = managers.object,
            wrapper = model.wrapper;

        model.stash.title = _tr("Events");
        
        domMgr.mk('p',wrapper,_tr("Igaro App is <b>100%</b> event driven."));

        domMgr.mk('p',wrapper,_tr("core.events is responsible for event management. It provides a manager to core.object's bless, and this is used extensively throughout the Igaro App framework.")); 

        return model.addSequence({
            container:wrapper,
            promises:[
                objectMgr.create('accordion', {
                    sections : [
                        {
                            title:_tr("Path"),
                            content:_tr("Typically taken from the object path attribute, as defined by core.object's bless.")
                        },
                        {
                            title:_tr("Name"),
                            content:_tr("Typically matches the name of the executing function.")
                        },
                        {
                            title:_tr("Target"),
                            content:_tr("Defines if any event is for a particular object. Using the event manager provided by core.object's bless sets this automatically to the object.")
                        },
                        {
                            title:_tr("Dependencies"),
                            content:_tr("Allows the event to be cleaned/deregistered when any of the dependencies are destroyed.")
                        },
                        {
                            title:_tr("Value"),
                            content:_tr("Any value passed to the event and a reference to the target if applicable.")
                        }
                    ]
                }).then(function(accordion) {
                    var container = document.createDocumentFragment(),
                        domMgr = accordion.managers.dom;
                    domMgr.mk('h1',container,_tr("The Dispatch"));
                    domMgr.mk('p',container);
                    dom.append(container,accordion),
                    domMgr.mk('h1',container,_tr("Parent & Children"));
                    domMgr.mk('p',container,_tr("When an event dispatches on a child it propagates up through the parent. A rejected Promise or a literal containing stopPropagation can abort this."));
                    domMgr.mk('p',container,_tr("As the event propagates the path and name change. This allows parents to listen for child events. For example an object with parent 'materials' of name 'metal' which dispatches an event of 'cut' of value true, will also dispatch an event on 'materials' called 'metal.cut'. The value will be replaced with a child reference and original value."));
                    domMgr.mk('p',container,_tr("The .asRoot() flag prevents a child event dispatching on the parent. It is mostly used by instances. A parent has no need for these dispatches since it can access the instance event manager directly."));
                    domMgr.mk('h1',container,_tr("By Instance/Singleton"));
                    domMgr.mk('p',container,_tr("Listening to events on modules is accomplished by accessing the event manager on the object and calling extend on it. This adds your object as a dependency (should it later be destroyed the event will be cleaned up automatically)."));

                    domMgr.mk('pre',container,_tr("(object).managers.event.extend(this).on('eventName',fn);"));

                    domMgr.mk('h1',container,_tr("By Path/Type"));
                    domMgr.mk('p',container,_tr("Listening to the event manager on an instance will only provide events for that particular instance, not the instance type."));

                    domMgr.mk('p',container,_tr("In this App, each time an instance.r start and end event fire we keep a tally and display an icon in the header. This is an example of monitoring by type and is accomplished via core.events, not through a manager. View route.header.js and take a look at the code used to do this."));
                    
                    domMgr.mk('pre',container,_tr("app['core.events'].on('instance.xhr','start',fn);"));

                    return container; 
                })
            ]
        });

    };

};

})();
