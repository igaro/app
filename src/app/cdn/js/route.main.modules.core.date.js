//# sourceURL=route.main.modules.core.date.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {
            desc : function() { return this.tr((({ key:"Provides date and timezone functionality. Date strings should be ISO 8601 formatted. The timezone is determined from the system clock but can be overridden. ENV code is stored." }))); },
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            usage : {
                class : true
            },
            dependencies : [
                'core.store'
            ],
            blessed:true,
            extlinks : [
                {
                    href:'http://en.wikipedia.org/wiki/ISO_8601',
                    name:'ISO 8601'
                }
            ],
            related : [
                'instance.date'
            ],
            attributes : [
                {
                    name:'daysInMonth',
                    type:'function',
                    returns: {
                        attributes : [
                            {
                                type:'number'
                            }
                        ]
                    },
                    attributes: [
                        {
                            type:'number',
                            required:true,
                            attributes : [{
                                desc: function() { return this.tr((({ key:"The year value." }))); }
                            }]
                        },
                        {
                            type:'number',
                            required:true,
                            attributes : [{
                                desc: function() { return this.tr((({ key:"The month value." }))); }
                            }]
                        }
                    ],
                    desc: function() { return this.tr((({ key:"Returns the amount of days within a month for a given year." }))); },
                },
                {
                    name:'isLeapYear',
                    type:'function',
                    returns: {
                        attributes : [
                            {
                                type:'boolean'
                            }
                        ]
                    },
                    attributes: [
                        {
                            type:'number',
                            required:true,
                            attributes : [{
                                desc: function() { return this.tr((({ key:"The year to check." }))); },
                            }]
                        }
                    ],
                    desc: function() { return this.tr((({ key:"Returns true if the specified year is a leap." }))); }
                },
                {
                    name:'envOffset',
                    type:'number',
                    desc: function() { return this.tr((({ key:"Currently applied timezone offset in minutes from GMT." }))); }
                },
                {
                    name:'envOffsetAuto',
                    type:'boolean',
                    desc: function() { return this.tr((({ key:"Defines whether the ENV has been determined automatically." }))); }
                },
                {
                    name:'resetEnvOffset',
                    type:'function',
                    desc: function() { return this.tr((({ key:"Resets the timezone offset to the automatically determined value." }))); },
                    async:true
                },
                {
                    name:'setEnvOffset',
                    type:'function',
                    desc: function() { return this.tr((({ key:"Sets the timezone offset." }))); },
                    attributes : [
                        {
                            type:'number',
                            required:true,
                            attributes:[{
                                desc: function() { return this.tr((({ key:"Amount of minutes from GMT. Use null for system default." }))); }
                            }]
                        },
                        {
                            type:'boolean',
                            attributes:[{
                                desc: function() { return this.tr((({ key:"Defines if the value should be stored. Default is true." }))); }
                            }]
                        }
                    ],
                    events:['setEnvOffset'],
                    async:true
                },
                {
                    name:'userTz',
                    type:'function',
                    returns: {
                        attributes : [
                            {
                                instanceof: { name: 'Date' }
                            }
                        ]
                    },
                    attributes: [
                        {
                            type:'object',
                            required:true,
                            attributes : [{
                                desc: function() { return this.tr((({ key:"The value to convert. May also be a string respresentation." }))); },
                                instanceof : {
                                    name: 'Date'
                                }
                            }],
                        }
                    ],
                    desc: function() { return this.tr((({ key:"Returns a date object in the user's timezone." }))); }
                }
            ]
        };

        model.parent.stash.childsupport(data,model);

    };

};
