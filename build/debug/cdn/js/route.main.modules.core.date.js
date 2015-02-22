module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {"en":"Provides date and timezone functionality. Date strings should be ISO 8601 formatted. The timezone is determined from the system clock but can be overridden. Env code is stored."},
            author : { 
                name:'Andrew Charnley', 
                link:'http://www.andrewcharnley.com' 
            },
            usage : {
                class : true
            },
            dependencies : [
                'core.store'
            ],
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
                    attributes: [
                        { 
                            type:'number', 
                            required:true, 
                            attributes : [{
                                desc: {"en":"The year value."}
                            }]
                        },
                        { 
                            type:'number', 
                            required:true, 
                            attributes : [{
                                desc: {"en":"The month value."}
                            }]
                        }
                    ],
                    desc: {"en":"Returns the amount of days within a month for a given year."},
                },
                { 
                    name:'isLeapYear', 
                    type:'function',
                    attributes: [
                        { 
                            type:'number', 
                            required:true, 
                            attributes : [{
                                desc: {"en":"The year to check."},
                            }]
                        }
                    ],
                    desc: {"en":"Returns true if the specified year is a leap."}
                },
                {
                    name:'envOffset',
                    type:'number',
                    desc: {"en":"Currently applied timezone offset in minutes from GMT."}
                },
                { 
                    name:'setOffset',
                    type:'function',
                    desc: {"en":"Sets the timezone offset."},
                    attributes : [{
                        type:'number',
                        required:true,
                        attributes:[{
                            desc: {"en":"Amount of minutes from GMT. Use null for system default."}
                        }]
                    }]
                },
                { 
                    name:'strip', 
                    type:'function',
                    attributes: [
                        { 
                            type:['date','string'], 
                            required:true, 
                            attributes : [{
                                desc: {"en":"The value to parse."}
                            }]
                        }
                    ],
                    desc: {"en":"Removes anything non-numeric and returns the remainder. Useful for generating an id."}
                },
                { 
                    name:'userTz', 
                    type:'function',
                    attributes: [
                        { 
                            type:'date', 
                            required:true, 
                            attributes : [{
                                desc: {"en":"The value to convert."}
                            }]
                        }
                    ],
                    desc: {"en":"Returns a date object in the user's timezone."}
                }
            ]
        };

        model.parent.stash.childsupport(data,model);

    };

};
