//# sourceURL=route.main.modules.core.currency.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {

            desc : function() { return this.gettext("Provides country switching and related functionality. Supported countries are set via an API or configuration file. Uses ISO 3166-1. ENV code is stored."); },
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
            extlinks : [
                {
                    href:'http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2',
                    name:'ISO 3166-1 Alpha 2'
                }
            ],
            blessed : true,
            attributes : [
                {
                    name:'getFromPoolById',
                    type:'function',
                    attributes: [
                        {
                            type:'string',
                            required:true,
                            attributes:[{
                                desc: function() { return this.gettext("The code to match."); },
                            }]
                        }
                    ],
                    desc: function() { return this.gettext("Returns an object literal from the pool for a specified code."); },
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
                    desc: function() { return this.gettext("The currently applied country code."); }
                },
                {
                    name:'isAuto',
                    type:'boolean',
                    desc: function() { return this.gettext("Defines if the current ENV is automatically chosen."); }
                },
                {
                    name:'pool',
                    type:'object',
                    desc: function() { return this.gettext("A literal list of supported country codes."); }
                },
                {
                    name:'reset',
                    type:'function',
                    async:true,
                    desc: function() { return this.gettext("Resets the ENV to the automatically defined value."); },
                },
                {
                    name:'setEnv',
                    type:'function',
                    desc: function() { return this.gettext("Sets the currently applied country code."); },
                    attributes : [
                        {
                            type:'string',
                            required:true,
                            attributes:[{
                                desc: function() { return this.gettext("The code must exist in the current pool and is case sensitive."); },
                            }]
                        },
                        {
                            type:'boolean',
                            attributes:[{
                                desc: function() { return this.gettext("Defines whether the value should be saved. Default is true."); },
                            }]
                        }
                    ],
                    async:true
                },
                {
                    name:'setPool',
                    type:'function',
                    desc: function() { return this.gettext("Sets the supported country codes."); },
                    attributes : [{
                        type:'string',
                        required:true,
                        attributes:[{
                            desc: function() { return this.gettext("See conf.app.js for an example."); },
                        }]
                    }],
                    async:true
                }
            ]
        };

        model.parent.stash.childsupport(data,model);
    };
};
