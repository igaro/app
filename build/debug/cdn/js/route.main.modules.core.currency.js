module.exports = function(app) {

    return function(model) {

        var data = {

            desc : {"en":"Provides currency switching and related functionality. Supported currencies are set via an API or configuration file. Uses ISO 4217. Env code is stored."},
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
                            type:['float','number'], 
                            required:true, 
                            attributes : [{
                                desc: {"en":"The value to process."}
                            }]
                        },
                    ],
                    desc: {"en":"Takes a denomination and formats it to two decimal places."},
                        
                },
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
                {    
                    name:'substitute',
                    type:'function',
                    desc: {"en":"Parses and replaces %s with any arguments."},
                    attributes : [{
                        instanceof:'Array',
                        required:true,
                        attributes:[{
                            desc: {"en":"The first element is the object literal, Further elements correspond to each %s to be switched."},
                        }]
                    }]
                },
                { 
                    name:'validate', 
                    type:'function',
                    attributes: [
                        { 
                            type:['float','number'], 
                            required:true, 
                            attributes : [{
                                desc: {"en":"The value to validate."},
                            }]
                        },
                        { 
                            type:'boolean', 
                            required:false, 
                            attributes : [{
                                desc: {"en":"Allow negative values. Default is false."},
                            }]
                        }
                    ],
                    desc: {"en":"Takes a denomination and returns true if the value has no fraction or is of two decimal place."}
                }
            ]
        };

        model.parent.stash.childsupport(data,model);
    };
};
