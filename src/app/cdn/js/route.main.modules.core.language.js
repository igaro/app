//# sourceURL=route.main.modudles.core.language.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {

            desc : function() { return this.tr((({ key:"Provides language switching and related functionality. Supported languages are set via an API or configuration file. Uses IETF Tags. Env code is stored." }))); },
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
                    href:'http://en.wikipedia.org/wiki/IETF_language_tag',
                    name:'IETF Tag'
                }
            ],
            attributes : [
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
                    name:'pool',
                    type:'object',
                    desc: function() { return this.tr((({ key:"A literal list of supported currency codes." }))); }
                },
                {
                    name:'setEnv',
                    type:'function',
                    async:true,
                    desc: function() { return this.tr((({ key:"Applies a currency code to the current environment." }))); },
                    events:['setEnv'],
                    attributes : [{
                        type:'string',
                        required:true,
                        attributes:[{
                            desc: function() { return this.tr((({ key:"The code must exist in the current pool and is case sensitive." }))); },
                        }]
                    }]
                },
                {
                    name:'setPool',
                    type:'function',
                    desc: function() { return this.tr((({ key:"Sets supported currency data." }))); },
                    async:true,
                    events:['setPool'],
                    attributes : [{
                        type:'string',
                        required:true,
                        attributes:[{
                            desc: function() { return this.tr((({ key:"See conf.app.js for an example." }))); },
                        }]
                    }]
                },
                {
                    name:'tr',
                    type:'function',
                    attributes: [
                        {
                            type:'object',
                            required:true,
                            attributes:[{
                                desc: function() { return this.tr((({ key:"An object containing translation data by way of attributes; key, plural, context and comment, and a dictionary if the builder embedded one or an API returned one. Note: the builder will only extract strings where the object is wrapped in double brackets, so the call must match .tr((({" }))); }
                            }]
                        },
                        {
                            type:'number',
                            attributes:[{
                                desc: function() { return this.tr((({ key:"A pluralization value." }))); }
                            }]
                        }
                    ],
                    returns: {
                        attributes : [
                            {
                                type:'string'
                            }
                        ]
                    },
                    desc: function() { return this.tr((({ key:"Selects the correct translation from a dictionary for a key, context and pluralization value." }))); }
                }
            ]
        };

        model.parent.stash.childsupport(data,model);

    };
};
