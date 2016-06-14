//# sourceURL=route.main.modules.instance.date.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {

            demo : "model.managers.object.create('date', { container:c, countUp:150, date:new Date(), relative:true, format:'LLLL' })",
            blessed: {
                container:true
            },
            desc : function() { return this.tr((({ key:"Provides a managed date with automatic display and timezone conversion. By default uses 3rdparty.moment.js for formatting to the user locale." }))); },
            usage : {
                instantiate : true,
                decorateWithContainer:true,
                attributes : [
                    {
                        name:'date',
                        instanceof : { name:'Date' },
                        required:true,
                        desc: function() { return this.tr((({ key:"The date to use." }))); }
                    },
                    {
                        name:'format',
                        type:'string',
                        desc : function() { return this.tr((({ key:"The format used to stringify the date object. See MomentJS for codes." }))); },
                        required:true
                    },
                    {
                        name:'countDown',
                        type:'number',
                        desc:function() { return this.tr((({ key:"For relative time, will show a countdown when the delta is less than or equal to this value." }))); }
                    },
                    {
                        name:'countUp',
                        type:'number',
                        desc:function() { return this.tr((({ key:"For relative time,  will show a countup when the delta is less than or equal to this value." }))); }
                    },
                    {
                        name:'offset',
                        type:'number',
                        desc : function() { return this.tr((({ key:"By default the timezone offset will be read from core.date.js. To set a specific timezone specify the +- minutes here." }))); }
                    },
                    {
                        name:'relative',
                        type:'boolean',
                        desc : function() { return this.tr((({ key:"Set to true to enable relative time." }))); }
                    }
                ]
            },
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            attributes : [
                {
                    name:'set',
                    type:'function',
                    desc: function() { return this.tr((({ key:"Sets the date." }))); },
                    attributes : [
                        {
                            required:true,
                            type:'object',
                            attributes : [{
                                instanceof : { name:'Date' }
                            }]
                        }
                    ]
                },
                {
                    name:'offset',
                    type:'function',
                    desc: function() { return this.tr((({ key:"Sets the timezone offset." }))); },
                    attributes : [
                        {
                            type:'number',
                            attributes: [{
                                desc: function() { return this.tr((({ key:"+- 15 minute blocks." }))); }
                            }]
                        },
                        {
                            type:'boolean',
                            attributes: [{
                                desc:function() { return this.tr((({ key:"By default the offset is stored. Use true to disable." }))); }
                            }]
                        }
                    ]
                },
                {
                    name:'format',
                    type:'function',
                    desc: function() { return this.tr((({ key:"Formats the stringified version of the date." }))); },
                    attributes : [
                        {
                            type:'string',
                            required:true,
                            attributes:[{
                                desc: function() { return this.tr((({ key:"The formatting code to pass to the plugin." }))); }
                            }]
                        }
                    ]
                },
                {
                    name:'relative',
                    type:'function',
                    desc: function() { return this.tr((({ key:"Begins a countdown/count up (if the time difference is within range)." }))); }
                }
            ],
            related : [
                '3rdparty.moment.js',
                'core.date.js'
            ]
        };

        model.parent.stash.childsupport(data,model);

    };

};
