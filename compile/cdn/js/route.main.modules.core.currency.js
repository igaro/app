//# sourceURL=route.main.modules.core.currency.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {

            desc : _tr("Provides currency switching and related functionality. Supported currencies are set via an API or configuration file. Uses ISO 4217. ENV code is stored."),
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
                    href:'http://en.wikipedia.org/wiki/ISO_4217',
                    name:'ISO 4217'
                }
            ],
            attributes : [
                {
                    name:'decimalise',
                    type:'function',
                    attributes: [
                        {
                            type:'float',
                            required:true,
                            attributes : [{
                                desc: _tr("The value to process.")
                            }]
                        },
                    ],
                    desc: _tr("Takes a denomination and formats it to two decimal places."),
                    returns: {
                        attributes : [
                            {
                                type:'float'
                            }
                        ]
                    }
                },
                {
                    name:'getFromPoolById',
                    type:'function',
                    attributes: [
                        {
                            type:'string',
                            required:true,
                            attributes:[{
                                desc: _tr("The code to match."),
                            }]
                        }
                    ],
                    desc: _tr("Returns an object literal from the pool for a specified code."),
                    returns: {
                        attributes : [
                            {
                                type:'object'
                            }
                        ]
                    }
                },
                {
                    name:'env',
                    type:'string',
                    desc: _tr("The currently applied currency code.")
                },
                {
                    name:'isAuto',
                    type:'boolean',
                    desc: _tr("Defines if the current ENV is automatically chosen.")
                },
                {
                    name:'pool',
                    type:'object',
                    desc: _tr("A literal list of supported currency codes.")
                },
                {
                    name:'reset',
                    type:'function',
                    desc: _tr("Resets the ENV to the automatically defined value."),
                    async:true,
                },
                {
                    name:'setEnv',
                    type:'function',
                    desc: _tr("Sets the currently applied currency code."),
                    attributes : [
                        {
                            type:'string',
                            required:true,
                            attributes:[{
                                desc: _tr("The code must exist in the current pool and is case sensitive."),
                            }]
                        },
                        {
                            type:'boolean',
                            attributes:[{
                                desc: _tr("Defines whether the value should be saved. Default is true."),
                            }]
                        }
                    ],
                    async:true
                },
                {
                    name:'setPool',
                    type:'function',
                    desc: _tr("Sets the supported currency codes."),
                    attributes : [{
                        type:'string',
                        required:true,
                        attributes:[{
                            desc: _tr("See conf.app.js for an example."),
                        }]
                    }],
                    async:true
                },
                {
                    name:'substitute',
                    type:'function',
                    desc: _tr("Parses each key on a literal replacing %[n] with any arguments."),
                    attributes : [{
                        type:'object',
                        required:true,
                        attributes:[{
                            instanceof : { name: 'Array' },
                            desc: _tr("The first element is the object literal, Further elements correspond to the value of n."),
                        }]
                    }],
                    returns: {
                        attributes : [
                            {
                                type:'object'
                            }
                        ]
                    }
                },
                {
                    name:'validate',
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
                            type:'float',
                            required:true,
                            attributes : [{
                                desc: _tr("The value to validate."),
                            }]
                        },
                        {
                            type:'boolean',
                            attributes : [{
                                desc: _tr("Allow negative values. Default is false."),
                            }]
                        }
                    ],
                    desc: _tr("Takes a denomination and returns true if the value has no fraction or is of two decimal place.")
                }
            ]
        };

        model.parent.stash.childsupport(data,model);
    };
};
