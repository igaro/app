module.exports = function(app) {

    return function(model) {

        var data = {
            desc : _tr("Handles debug messages and fires an event when one comes in."),
            author : { 
                name:'Andrew Charnley', 
                link:'http://www.igaro.com/ppl/ac' 
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
                    desc: _tr("Defines whether the framework is in debug mode.")
                },
                {
                    name:'handle',
                    type:'function',
                    desc:_tr("A generic error handling mechanism for functions that don't do it themselves. Useful for hyperlink invoked commands."),
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
                    name:'log',
                    type:'object',
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
                        }
                    ]
                }
            ]
        };

        model.parent.stash.childsupport(data,model);

    };
};