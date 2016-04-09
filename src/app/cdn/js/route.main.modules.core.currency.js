//# sourceURL=route.main.modules.core.currency.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {

            desc : function() { return this.tr((({ key:"Provides currency switching and related functionality. Supported currencies are set via an API or configuration file. Uses ISO 4217. ENV code is stored." }))); },
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
                                desc: function() { return this.tr((({ key:"The value to process." }))); }
                            }]
                        },
                    ],
                    desc: function() { return this.tr((({ key:"Takes a denomination and formats it to two decimal places." }))); },
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
                                desc: function() { return this.tr((({ key:"The code to match." }))); },
                            }]
                        }
                    ],
                    desc: function() { return this.tr((({ key:"Returns an object literal from the pool for a specified code." }))); },
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
                    desc: function() { return this.tr((({ key:"The currently applied currency code." }))); }
                },
                {
                    name:'isAuto',
                    type:'boolean',
                    desc: function() { return this.tr((({ key:"Defines if the current ENV is automatically chosen." }))); }
                },
                {
                    name:'pool',
                    type:'object',
                    desc: function() { return this.tr((({ key:"A literal list of supported currency codes." }))); }
                },
                {
                    name:'reset',
                    type:'function',
                    desc: function() { return this.tr((({ key:"Resets the ENV to the automatically defined value." }))); },
                    async:true,
                },
                {
                    name:'setEnv',
                    type:'function',
                    desc: function() { return this.tr((({ key:"Sets the currently applied currency code." }))); },
                    events:['setEnv'],
                    attributes : [
                        {
                            type:'string',
                            required:true,
                            attributes:[{
                                desc: function() { return this.tr((({ key:"The code must exist in the current pool and is case sensitive." }))); },
                            }]
                        },
                        {
                            type:'boolean',
                            attributes:[{
                                desc: function() { return this.tr((({ key:"Defines whether the value should be saved. Default is true." }))); },
                            }]
                        }
                    ],
                    async:true
                },
                {
                    name:'setPool',
                    type:'function',
                    events:['setPool'],
                    desc: function() { return this.tr((({ key:"Sets the supported currency codes." }))); },
                    attributes : [{
                        type:'string',
                        required:true,
                        attributes:[{
                            desc: function() { return this.tr((({ key:"See conf.app.js for an example." }))); },
                        }]
                    }],
                    async:true
                },
                {
                    name:'substitute',
                    type:'function',
                    desc: function() { return this.tr((({ key:"Parses each key on a literal replacing %[n] with any arguments." }))); },
                    attributes : [{
                        type:'object',
                        required:true,
                        attributes:[{
                            instanceof : { name: 'Array' },
                            desc: function() { return this.tr((({ key:"The first element is the object literal, Further elements correspond to the value of n." }))); },
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
                                desc: function() { return this.tr((({ key:"The value to validate." }))); },
                            }]
                        },
                        {
                            type:'boolean',
                            attributes : [{
                                desc: function() { return this.tr((({ key:"Allow negative values. Default is false." }))); },
                            }]
                        }
                    ],
                    desc: function() { return this.tr((({ key:"Takes a denomination and returns true if the value has no fraction or is of two decimal place." }))); }
                }
            ]
        };

        model.parent.stash.childsupport(data,model);
    };
};
