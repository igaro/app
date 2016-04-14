//# sourceURL=route.main.modules.core.debug.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {
            desc : function() { return this.gettext("Handles debug messages and fires an event when one comes in."); },
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            usage : {
                class : true
            },

            manager : 'debug',
            embedded:true,
            attributes : [
                {
                    name:'developer',
                    type:'boolean',
                    desc: function() { return this.gettext("Defines whether the framework is in debug mode."); },
                    attributes: [
                        {
                            desc: function() { return this.gettext("True for enabled, False for disabled."); },
                        }
                    ]
                },
                {
                    name:'handle',
                    type:'function',
                    async:true,
                    forManager:true,
                    desc:function() { return this.gettext("A generic error handling mechanism for functions that don't do it themselves. Useful for hyperlink invoked commands."); },
                    attributes : [
                        {
                            type:'*',
                            required:true,
                            forManager:true,
                            attributes: [{
                                desc: function() { return this.gettext("The error object or value."); }
                            }]
                        },
                        {
                            type:'string',
                            attributes: [{
                                desc: function() { return this.gettext("The scope path name."); }
                            }]
                        },
                        {
                            type:'string',
                            attributes: [{
                                desc : function() { return this.gettext("The scope event name"); }
                            }]
                        }
                    ]
                },
                {
                    name:'log',
                    type:'object',
                    forManager:true,
                    attributes : [
                        {
                            name:'append',
                            type:'function',
                            attributes: [
                                {
                                    type:'string',
                                    required:true,
                                    attributes:[{
                                        desc: function() { return this.gettext("The module name."); }
                                    }]
                                },
                                {
                                    type:'string',
                                    required:true,
                                    attributes:[{
                                        desc: function() { return this.gettext("The event name."); }
                                    }]
                                },
                                {
                                    type:'object',
                                    required:true,
                                    forManager:true,
                                    attributes:[{
                                        desc: function() { return this.gettext("A value to pass to functions registered to receive the debug event. You can pass anything here."); },
                                    }]
                                }
                            ],
                            desc: function() { return this.gettext("Appends a debug event to storage and fires a core.debug event containing the data."); },
                            async:true
                        }
                    ]
                }
            ]
        };

        model.parent.stash.childsupport(data,model);

    };
};
