module.exports = function(app) {

    return function(model) {

        var data = {

            desc : _tr("Dispatches events and manages handles to functions."),
            author : { 
                name:'Andrew Charnley', 
                link:'http://www.andrewcharnley.com' 
            },
            usage : {
                class : true
            },
            providesManager:true,
            embedded:true,
            attributes : [
                {
                    name:'clean',
                    type:'function',
                    desc: _tr("Removes an event linked to a dependency (object). This function is called automatically via the manager exposed via core.bless when any blessed object is destroyed."),
                    attributes : [
                        { 
                            type:'object', 
                            required:true,
                            attributes : [{
                                desc: _tr("The dependency.")
                            }]
                        },
                    ]
                },
                { 
                    name:'dispatch', 
                    type:'function',
                    attributes: [
                        { 
                            type:'string', 
                            required:true,
                            attributes : [{
                                desc: _tr("Module name.")
                            }]
                        },
                        { 
                            type:['string','object'], 
                            required:true,
                            attributes : [{
                                desc: _tr("If string, it is the event name. If array, the first value is the string name and the second is the target for the event. If a target is supplied, only registered agents which have no target or which match this target will be executed.")
                            }]
                        },
                        { 
                            type:'*',
                            attributes : [{
                                desc: _tr("An object or value to pass on to the registered function.")
                            }]
                        }
                    ],
                    desc: _tr("Triggers registered event handlers. Any handler can return { stopPropagation:true } to abort the iteration.")
                },
                { 
                    name:'on', 
                    type:'function',
                    attributes: [
                        { 
                            type:['string','array'], 
                            required:true, 
                            attributes: [ 
                                {
                                    desc: _tr("If string, it is the module name. If array, the function will iterate for each string within it allowing you to register the same function for multiple event names.")
                                }
                            ]
                        },
                        { 
                            type:['string','object'],
                            required:true,
                            attributes: [ 
                                {
                                    desc: _tr("If string, it is the event name. If array, the first value is the string name, the second is a target in which the event applies to (this is automatically registered as a dependency) and the third is any additional dependencies.")
                                }
                            ]
                        },
                        { 
                            type:'function', 
                            required:true,
                            attributes: [ 
                                {
                                    desc: _tr("Function to execute on event trigger.")
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
                                desc: _tr("The function that was previously registered.")
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
                    desc: _tr("Unregisters a function from the event pool.")
                }
            ]
        };

        model.parent.stash.childsupport(data,model);

    };

};
