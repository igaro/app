module.exports = function(app) {

    return function(model) {

        var data = {
            desc : _tr("Provides date and timezone functionality. Date strings should be ISO 8601 formatted. The timezone is determined from the system clock but can be overridden. Env code is stored."),
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
                                desc: _tr("The year value.")
                            }]
                        },
                        { 
                            type:'number', 
                            required:true, 
                            attributes : [{
                                desc: _tr("The month value.")
                            }]
                        }
                    ],
                    desc: _tr("Returns the amount of days within a month for a given year."),
                },
                { 
                    name:'isLeapYear', 
                    type:'function',
                    attributes: [
                        { 
                            type:'number', 
                            required:true, 
                            attributes : [{
                                desc: _tr("The year to check."),
                            }]
                        }
                    ],
                    desc: _tr("Returns true if the specified year is a leap.")
                },
                {
                    name:'envOffset',
                    type:'number',
                    desc: _tr("Currently applied timezone offset in minutes from GMT.")
                },
                { 
                    name:'setOffset',
                    type:'function',
                    desc: _tr("Sets the timezone offset."),
                    attributes : [{
                        type:'number',
                        required:true,
                        attributes:[{
                            desc: _tr("Amount of minutes from GMT. Use null for system default.")
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
                                desc: _tr("The value to parse.")
                            }]
                        }
                    ],
                    desc: _tr("Removes anything non-numeric and returns the remainder. Useful for generating an id.")
                },
                { 
                    name:'userTz', 
                    type:'function',
                    attributes: [
                        { 
                            type:'date', 
                            required:true, 
                            attributes : [{
                                desc: _tr("The value to convert.")
                            }]
                        }
                    ],
                    desc: _tr("Returns a date object in the user's timezone.")
                }
            ]
        };

        model.parent.stash.childsupport(data,model);

    };

};
