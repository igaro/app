//# sourceURL=route.main.modules.core.currency.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {

            desc : _tr("Provides country switching and related functionality. Supported countries are set via an API or configuration file. Uses ISO 3166-1. ENV code is stored."),
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
                    desc: _tr("The currently applied country code.")
                },
                {
                    name:'isAuto',
                    type:'boolean',
                    desc: _tr("Defines if the current ENV is automatically chosen.")
                },
                {
                    name:'pool',
                    type:'object',
                    desc: _tr("A literal list of supported country codes.")
                },
                {
                    name:'reset',
                    type:'function',
                    async:true,
                    desc: _tr("Resets the ENV to the automatically defined value."),
                },
                {
                    name:'setEnv',
                    type:'function',
                    desc: _tr("Sets the currently applied country code."),
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
                    desc: _tr("Sets the supported country codes."),
                    attributes : [{
                        type:'string',
                        required:true,
                        attributes:[{
                            desc: _tr("See conf.app.js for an example."),
                        }]
                    }],
                    async:true
                }
            ]
        };

        model.parent.stash.childsupport(data,model);
    };
};
