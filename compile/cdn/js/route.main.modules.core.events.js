//# sourceURL=route.main.modules.core.events.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {

            desc : _tr("Dispatches events and manages handles to functions."),
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            usage : {
                class : true
            },
            manager:'event',
            embedded:true,
            attributes : [
                {
                    name:'clean',
                    type:'function',
                    forManager:false,
                    desc: _tr("Removes events on all event emitters where the registered function or a dependency matches the supplied value."),
                    attributes : [
                        {
                            type:'*',
                            required:true,
                            attributes : [{
                                desc: _tr("An object or function.")
                            }]
                        }
                    ]
                },
                {
                    name:'rootEmitter',
                    type:'object',
                    desc: _tr("Contains a root Emitter used for system wide events. The root Emitter is a Manager (see below)."),
                },
                {
                    name:'dispatch',
                    type:'function',
                    forManager:true,
                    onlyManager:true,
                    async:true,
                    attributes: [
                        {
                            type:'string',
                            required:true,
                            forManager:true,
                            onlyManager:true,
                            attributes : [{
                                desc: _tr("The event name..")
                            }]
                        },
                        {
                            type:'*',
                            forManager:true,
                            attributes : [{
                                desc: _tr("An object or value to pass on to each event handler.")
                            }]
                        }
                    ],
                    desc: _tr("Triggers registered event handlers. A handler may return an object literal or a Promise, which in turn may return { stopPropagation:true } to prevent the event firing up the chain or { stopImmediatePropagation } to prevent the event reaching further sibling handlers. If { removeEventListener:true } is returned the event handler will be removed.")
                },
                {
                    name:'on',
                    forManager:true,
                    onlyManager:true,
                    type:'function',
                    attributes: [
                        {
                            type:'*',
                            required:true,
                            forManager:true,
                            attributes: [
                                {
                                    desc: _tr("The event name. An array can be passed instead to add a handler to multiple events.")
                                }
                            ]
                        },
                        {
                            type:'function',
                            required:true,
                            forManager:true,
                            attributes: [
                                {
                                    desc: _tr("Function to execute on event trigger.")
                                }
                            ]
                        },
                        {
                            type:'object',
                            forManager:true,
                            attributes : [
                                {
                                    name:'prepend',
                                    type:'boolean',
                                    desc: _tr("Defines whether the event handler should be added to the beginning of the array. Use if the function may cancel propagation.")
                                },
                                {
                                    name:'deps',
                                    type:'Array',
                                    desc: _tr("An event can be linked to dependencies. Use this to automatically clear up handlers when objects are destroyed.")
                                }
                            ]
                        }
                    ],
                    returns: {
                        attributes : [
                            {
                                type:'object',
                                desc:_tr("The event manager is returned allowing for linked actions.")
                            }
                        ]
                    },
                    desc: _tr("Registers a callback using the module name and event.")
                },
                {
                    name:'remove',
                    type:'function',
                    onlyManager:true,
                    forManager:true,
                    attributes: [
                        {
                            type:'function',
                            required:true,
                            forManager:true,
                            attributes : [{
                                desc: _tr("The function previously registered.")
                            }]
                        },
                        {
                            type:'string',
                            forManager:true,
                            attributes : [{
                                desc: _tr("The event name to be used to lookup the function. This makes the lookup faster and prevents the function being deregistered from all event names.")
                            }]
                        }
                    ],
                    returns: {
                        attributes : [
                            {
                                type:'object',
                                desc:_tr("The event manager is returned allowing for linked actions.")
                            }
                        ]
                    },
                    desc: _tr("Deregisters a function from the event pool.")
                }
            ]
        };

        model.parent.stash.childsupport(data,model);

    };

};
