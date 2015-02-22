module.exports = function(app) {

    return function(model) {

        var data = {

            desc : {"en":"Provides language switching and related functionality. Supported languages are set via an API or configuration file. Uses IETF Tags. Env code is stored."},
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
                    href:'http://en.wikipedia.org/wiki/IETF_language_tag',
                    name:'IETF Tag'
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
                    desc: {"en":"The currently applied currency code."}
                },
                { 
                    name:'mapKey', 
                    type:'function',
                    attributes: [
                        { 
                            type:['function','object'], 
                            required:true, 
                            attributes:[{
                                desc: {"en":"A structure containing language codes."}
                            }]
                        }
                    ],
                    desc: {"en":"Returns the value of a function or steps into the object using the current language code and returns what's there."}
                },
                {
                    name:'pool',
                    type:'object',
                    desc: {"en":"A literal list of supported currency codes."}
                },
                {    
                    name:'setEnv',
                    type:'function',
                    desc: {"en":"Sets the currently applied currency code."},
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
                    desc: {"en":"Sets the supported currency codes."},
                    attributes : [{
                        type:'string',
                        required:true,
                        attributes:[{
                            desc: {"en":"See conf.app.js for an example."},
                        }]
                    }]
                },

            ]
        };

        model.parent.stash.childsupport(data,model);

    };
};
