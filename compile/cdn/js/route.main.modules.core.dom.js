module.exports = function(app) {

    return function(model) {

        var data = {
            desc : _tr("Provides DOM helpers to reduce repetitive coding. Automates dependency management and provides object destruction cleanup. Does not try to be JQuery."),
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
                    name:'empty',
                    type:'function',
                    desc:_tr("A generic error handling mechanism for functions that don't do it themselves. Useful for hyperlink invoked commands. Try to use the manager provided by core.bless instead."),
                    attributes : [
                        { 
                            type:'*',
                            required:true,
                            desc: _tr("The error object or value.")
                        }
                    ]
                },
                {
                    name:'hide',
                    type:'function',
                    desc:_tr("A generic error handling mechanism for functions that don't do it themselves. Useful for hyperlink invoked commands. Try to use the manager provided by core.bless instead."),
                    attributes : [
                        { 
                            type:'*',
                            required:true,
                            desc: _tr("The error object or value.")
                        },
                        {
                            type:'string',
                            desc: _tr("The scope path name.")
                        },
                        { 
                            type:'string',
                            desc : _tr("The scope event name")
                        }
                    ]
                },
                {
                    name:'mk',
                    type:'function',
                    desc:_tr("A generic error handling mechanism for functions that don't do it themselves. Useful for hyperlink invoked commands. Try to use the manager provided by core.bless instead."),
                    attributes : [
                        { 
                            type:'*',
                            required:true,
                            desc: _tr("The error object or value.")
                        },
                        {
                            type:'string',
                            desc: _tr("The scope path name.")
                        },
                        { 
                            type:'string',
                            desc : _tr("The scope event name")
                        }
                    ]
                },
                {
                    name:'rm',
                    type:'function',
                    desc:_tr("A generic error handling mechanism for functions that don't do it themselves. Useful for hyperlink invoked commands. Try to use the manager provided by core.bless instead."),
                    attributes : [
                        { 
                            type:'*',
                            required:true,
                            desc: _tr("The error object or value.")
                        },
                        {
                            type:'string',
                            desc: _tr("The scope path name.")
                        },
                        { 
                            type:'string',
                            desc : _tr("The scope event name")
                        }
                    ]
                },
                {
                    name:'setPlaceholder',
                    type:'object',
                    desc : _tr("Manages and stores the log data."),
                    attributes : [
                        { 
                            name:'append',
                            type:'function',
                            attributes: [
                                { 
                                    type:'string',
                                    required:true, 
                                    attributes:[{
                                        desc: _tr("The module name.")
                                    }]
                                },
                                { 
                                    type:'string',
                                    required:true, 
                                    attributes:[{
                                        desc: _tr("The event name.")
                                    }]
                                },
                                { 
                                    type:'object', 
                                    required:true, 
                                    attributes:[{
                                        desc: _tr("A value to pass to functions registered to receive the debug event. You can pass anything here."),
                                    }]
                                }
                            ],
                            desc: _tr("Appends a debug event to storage and fires a core.debug event containing the data.")
                        },
                        { 
                            name:'data',
                            instanceof:'Array', 
                            desc : _tr("Contains debug data appended since program execution."),
                        },
                    ]
                },
                {
                    name:'setContent',
                    type:'function',
                    desc:_tr("A generic error handling mechanism for functions that don't do it themselves. Useful for hyperlink invoked commands. Try to use the manager provided by core.bless instead."),
                    attributes : [
                        { 
                            type:'*',
                            required:true,
                            desc: _tr("The error object or value.")
                        },
                        {
                            type:'string',
                            desc: _tr("The scope path name.")
                        },
                        { 
                            type:'string',
                            desc : _tr("The scope event name")
                        }
                    ]
                },
                {
                    name:'show',
                    type:'function',
                    desc:_tr("A generic error handling mechanism for functions that don't do it themselves. Useful for hyperlink invoked commands. Try to use the manager provided by core.bless instead."),
                    attributes : [
                        { 
                            type:'*',
                            required:true,
                            desc: _tr("The error object or value.")
                        },
                        {
                            type:'string',
                            desc: _tr("The scope path name.")
                        },
                        { 
                            type:'string',
                            desc : _tr("The scope event name")
                        }
                    ]
                }
            ]
        };

        model.parent.stash.childsupport(data,model);

    };
};