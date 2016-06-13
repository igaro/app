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
                    name:'mapKey',
                    type:'function',
                    attributes: [
                        {
                            type:'*',
                            required:true,
                            attributes:[{
                                desc: function() { return this.tr((({ key:"A structure containing language codes." }))); }
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
                    desc: function() { return this.tr((({ key:"Executes a function then/or steps into an object literal using the current language code and returns what's there." }))); }
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
                    attributes : [{
                        type:'string',
                        required:true,
                        attributes:[{
                            desc: function() { return this.tr((({ key:"See conf.app.js for an example." }))); },
                        }]
                    }]
                },

            ]
        };

        model.parent.stash.childsupport(data,model);

    };
};
