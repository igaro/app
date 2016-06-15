//# sourceURL=route.main.modules.core.debug.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {
            desc : function() { return this.tr((({ key:"Handles debug messages and fires an event when one comes in." }))); },
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
                    desc: function() { return this.tr((({ key:"Defines whether the framework is in debug mode." }))); },
                    attributes: [
                        {
                            desc: function() { return this.tr((({ key:"True for enabled, False for disabled." }))); },
                        }
                    ]
                },
                {
                    name:'handle',
                    type:'function',
                    async:true,
                    events:['core.debug.handle'],
                    forManager:true,
                    desc:function() { return this.tr((({ key:"A generic error handling mechanism for functions that don't do it themselves. Useful for hyperlink invoked commands." }))); },
                    attributes : [
                        {
                            type:'*',
                            required:true,
                            forManager:true,
                            attributes: [{
                                desc: function() { return this.tr((({ key:"The error object or value." }))); }
                            }]
                        },
                        {
                            type:'string',
                            attributes: [{
                                desc: function() { return this.tr((({ key:"The scope path name." }))); }
                            }]
                        },
                        {
                            type:'string',
                            attributes: [{
                                desc : function() { return this.tr((({ key:"The scope event name" }))); }
                            }]
                        }
                    ]
                },
                {
                    name:'error',
                    type:'function',
                    events:['core.debug.error'],
                    attributes: [
                        {
                            type:'string',
                            required:true,
                            attributes:[{
                                desc: function() { return this.tr((({ key:"The module name." }))); }
                            }]
                        },
                        {
                            type:'string',
                            required:true,
                            attributes:[{
                                desc: function() { return this.tr((({ key:"The event name." }))); }
                            }]
                        },
                        {
                            type:'object',
                            required:true,
                            forManager:true,
                            attributes:[{
                                desc: function() { return this.tr((({ key:"A value to pass to functions registered to receive the debug event. You can pass anything here." }))); },
                            }]
                        }
                    ],
                    desc: function() { return this.tr((({ key:"Appends a debug event to storage and fires a core.debug event containing the data." }))); },
                    async:true
                },
                {
                    name:'log',
                    type:'function',
                    forManager:true,
                    events:['core.debug.log'],
                    attributes: [
                        {
                            type:'string',
                            required:true,
                            attributes:[{
                                desc: function() { return this.tr((({ key:"The module name." }))); }
                            }]
                        },
                        {
                            type:'string',
                            required:true,
                            attributes:[{
                                desc: function() { return this.tr((({ key:"The event name." }))); }
                            }]
                        },
                        {
                            type:'object',
                            required:true,
                            forManager:true,
                            attributes:[{
                                desc: function() { return this.tr((({ key:"A value to pass to functions registered to receive the debug event. You can pass anything here." }))); },
                            }]
                        }
                    ],
                    desc: function() { return this.tr((({ key:"Appends a debug event to storage and fires a core.debug event containing the data." }))); },
                    async:true
                }
            ]
        };

        model.parent.stash.childsupport(data,model);

    };
};
