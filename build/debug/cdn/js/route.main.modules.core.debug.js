module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {"en":"Handles debug messages and fires an event when one comes in."},
            author : { 
                name:'Andrew Charnley', 
                link:'http://www.andrewcharnley.com' 
            },
            usage : {
                class : true
            },
            embedded:true,
            providesManager:true,
            attributes : [
                {
                    name:'developer',
                    type:'boolean',
                    desc: {"en":"Defines whether the framework is in debug mode."}
                },
                {
                    name:'handle',
                    type:'function',
                    desc:{"en":"A generic error handling mechanism for functions that don't do it themselves. Useful for hyperlink invoked commands. Try to use the manager provided by core.bless instead."},
                    attributes : [
                        { 
                            type:'*',
                            required:true,
                            desc: {"en":"The error object or value."}
                        },
                        {
                            type:'string',
                            desc: {"en":"The scope path name."}
                        },
                        { 
                            type:'string',
                            desc : {"en":"The scope event name"}
                        }
                    ]
                },

                {
                    name:'log',
                    type:'object',
                    desc : {"en":"Manages and stores the log data."},
                    attributes : [
                        { 
                            name:'append',
                            type:'function',
                            attributes: [
                                { 
                                    type:'string',
                                    required:true, 
                                    attributes:[{
                                        desc: {"en":"The module name."}
                                    }]
                                },
                                { 
                                    type:'string',
                                    required:true, 
                                    attributes:[{
                                        desc: {"en":"The event name."}
                                    }]
                                },
                                { 
                                    type:'object', 
                                    required:true, 
                                    attributes:[{
                                        desc: {"en":"A value to pass to functions registered to receive the debug event. You can pass anything here."},
                                    }]
                                }
                            ],
                            desc: {"en":"Appends a debug event to storage and fires a core.debug event containing the data."}
                        },
                        { 
                            name:'data',
                            instanceof:'Array', 
                            desc : {"en":"Contains debug data appended since program execution."},
                        },
                    ]
                }
            ]
        };

        model.parent.stash.childsupport(data,model);

    };
};