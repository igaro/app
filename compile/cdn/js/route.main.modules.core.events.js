module.exports = function(app) {

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
                    desc: _tr("Removes an event linked to a dependency."), 
                    attributes : [
                        { 
                            type:'*', 
                            required:true,
                            attributes : [{
                                desc: _tr("An object or function.")
                            }]
                        },
                    ]
                },
                { 
                    name:'dispatch', 
                    type:'function',
                    forManager:true,
                    returns: {
                        attributes : [
                            {
                                instanceof : { name:'Promise' }
                            }
                        ]
                    },
                    attributes: [
                        { 
                            type:'string', 
                            required:true,
                            attributes : [{
                                desc: _tr("Module name.")
                            }]
                        },
                        { 
                            type:'*', 
                            required:true,
                            attributes : [{
                                desc: _tr("If string, it is the event name. If an array, the first value is the string name and the second is the target for the event. If a target is supplied, only registered agents which have no target or which match this target will be executed.")
                            }]
                        },
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
                    desc: _tr("Triggers registered event handlers. A handler may return an object literal or a Promise, which in turn may return { stopPropagation:true } to prevent the event firing up the chain and { stopImmediatePropagation } to prevent the event reaching further sibling handlers.")
                },
                { 
                    name:'extend', 
                    type:'function',
                    forManager:true,
                    onlyManager:true,
                    attributes: [
                        { 
                            type:'*',
                            forManager:true,
                            required:true,
                            attributes : [{
                                desc: _tr("An object or function to add as a dependency.")
                            }]
                        },
                    ],
                    desc: _tr("Creates a clone of the event manager but with an additional dependency.")
                },
                { 
                    name:'on', 
                    forManager:true,
                    type:'function',
                    attributes: [
                        { 
                            type:'*', 
                            required:true,
                            forManager:true, 
                            attributes: [ 
                                {
                                    desc: _tr("If string, it will be the module name. If array, the function will iterate for each string within it allowing you to register the same function for multiple event names.")
                                }
                            ]
                        },
                        { 
                            type:'*',
                            required:true,
                            attributes: [ 
                                {
                                    desc: _tr("If string, it will be the event name. If array, the first value is the string name, the second is a target in which the event applies to (this is automatically registered as a dependency) and the third is any additional dependencies.")
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
                                }
                            ]
                        }
                    ],
                    desc: _tr("Registers a callback using the module name and event.")
                },
                { 
                    name:'remove', 
                    type:'function',
                    attributes: [
                        { 
                            type:'function',
                            required:true,
                            attributes : [{
                                desc: _tr("The function handler previously registered.")
                            }]
                        },
                        {
                            type:'string',
                            attributes : [{
                                desc: _tr("The module name to be used to lookup the function. This makes the lookup faster and prevents the function being deregistered from all module names.")
                            }]
                        },
                        { 
                            type:'string',
                            attributes : [{
                                desc: _tr("The event name to be used to lookup the function. This makes the lookup faster and prevents the function being deregistered from all event names.")
                            }]
                        }
                    ],
                    desc: _tr("Deregisters a function from the event pool.")
                }
            ]
        };

        model.parent.stash.childsupport(data,model);

    };

};
