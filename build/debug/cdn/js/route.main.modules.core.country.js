module.exports = function(app) {

    return function(model) {

        var data = {

            desc : {"en":"Provides country switching and related functionality. Supported countries are set via an API or configuration file. Uses ISO 3166-1. Env code is stored."},
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
                    href:'http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2',
                    name:'ISO 3166-1 Alpha 2'
                }
            ],
            attributes : [
                { 
                    name:'getNameOfId', 
                    type:'function',
                    attributes: [
                        {
                            type:'string', 
                            required:true,
                            attributes:[{
                                desc: {"en":"The code to match."},
                            }]
                        }
                    ],
                    desc: {"en":"Returns an object literal from the pool for a specified code."}
                },
                {
                    name:'env',
                    type:'object',
                    desc: {"en":"The currently applied country code."}
                },
                {
                    name:'pool',
                    type:'object',
                    desc: {"en":"A literal list of supported country codes."}
                },
                {    
                    name:'setEnv',
                    type:'function',
                    desc: {"en":"Sets the currently applied country code."},
                    attributes : [{
                        type:'string',
                        required:true,
                        attributes:[{
                            desc: {"en":"The code must exist in the current pool and is case sensitive."},
                        }]
                    }]
                },
                {    
                    name:'setPool',
                    type:'function',
                    desc: {"en":"Sets the supported country codes."},
                    attributes : [{
                        type:'string',
                        required:true,
                        attributes:[{
                            desc: {"en":"See conf.app.js for an example."},
                        }]
                    }]
                }
            ]
        };

        model.parent.stash.childsupport(data,model);
    };
};