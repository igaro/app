module.exports = function(app) {

    return function(model) {

        var data = {

            demo : "model.managers.object.create('date', { container:c, countUp:15, date:new Date(), relative:true, format:'LLLL' })",
            desc : _tr("Provides a managed date with automatic display and timezone conversion. By default uses 3rdparty.moment.js for formatting to the user locale."),
            usage : {
                instantiate : true,
                attributes : [
                    { 
                        name:'date', 
                        instanceof : { name:'Date' }, 
                        required:true,
                        desc: _tr("The date to use.")
                    },
                    { 
                        name:'format', 
                        type:'string',
                        desc : _tr("The format used to stringify the date object. See MomentJS for codes."),
                        required:true
                    },
                    { 
                        name:'container', 
                        instanceof : { name:'Element' }, 
                        desc : _tr("Container to append the instance into.")
                    },
                    {
                        name:'countDown',
                        type:'number',
                        desc:_tr("For relative time, will show a countdown when the delta is less than or equal to this value.")
                    },
                    {
                        name:'countUp',
                        type:'number',
                        desc:_tr("For relative time,  will show a countup when the delta is less than or equal to this value.")
                    },
                    { 
                        name:'offset', 
                        type:'number',
                        desc : _tr("By default the timezone offset will be read from core.date.js. To set a specific timezone specify the +- minutes here.")
                    },
                    {
                        name:'relative',
                        type:'boolean',
                        desc : _tr("Set to true to enable relative time.")
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
                    desc: _tr("Sets the date."),
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
                    desc: _tr("Sets the timezone offset."),
                    attributes : [
                        {
                            type:'number',
                            attributes: [{
                                desc: _tr("+- 15 minute blocks.")
                            }]
                        },
                        {
                            type:'boolean',
                            attributes: [{
                                desc:_tr("By default the offset is stored. Use true to disable.")
                            }]
                        }
                    ]
                },
                { 
                    name:'container', 
                    desc: _tr("The element the instance is appended into."),
                    instanceof : { name:'Element' }  
                },
                {
                    name:'format', 
                    type:'function',
                    desc: _tr("Formats the stringified version of the date."),
                    attributes : [
                        {
                            type:'string',
                            required:true,
                            attributes:[{
                                desc: _tr("The formatting code to pass to the plugin.")
                            }]
                        }
                    ]
                },
                {
                    name:'relative', 
                    type:'function',
                    desc: _tr("Begins a countdown/count up (if the time difference is within range).")
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
