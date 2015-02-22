module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {"en":"Provides url and uri related functionality."},
            author : { 
                name:'Andrew Charnley', 
                link:'http://www.andrewcharnley.com' 
            },
            usage : {
                class : true
            },
            attributes : [
                { 
                    name:'getCurrent', 
                    type:'function',
                    attributes: [
                        { 
                            type:'object',
                            attributes : [
                                {
                                    name:'search',
                                    type:'boolean',
                                    desc: {"en":"Pass false to strip the search data (after ?). Default is true."}
                                },
                                {
                                    name:'path',
                                    type:'boolean',
                                    desc: {"en":"Pass false to strip the path. Default is true."}
                                }
                            ]
                        }
                    ],
                    desc: {"en":"Returns the current fully qualified domain name."}
                },
                { 
                    name:'getParam', 
                    type:'function',
                    attributes: [
                        { 
                            type:'string', 
                            required:true, 
                            attributes : [{
                                desc: {"en":"The name to search."}
                            }]
                        },
                        { 
                            type:'string',
                            attributes : [{
                                desc: {"en":"The URL to use (defaults to the current URL)."}
                            }]
                        }
                    ],
                    desc: {"en":"Parses a string for params and on match returns the value."}
                },
                { 
                    name:'replaceParam', 
                    type:'function',
                    attributes: [
                        { 
                            type:'string', 
                            required:true, 
                            attributes: [{
                                desc: {"en":"The name of to replace or append."}
                            }]
                        },
                        { 
                            type:'string', 
                            required:true, 
                            attributes: [{
                                desc: {"en":"The value to use. If the value contains special characters pass encodeURIComponent(value) beforehand."},
                            }]
                        },
                        {
                            type:'string', 
                            attributes: [{
                                desc: {"en":"The URL to use (defaults to the current URL)."}
                            }]
                        }
                    ],
                    desc: {"en":"Parses a URL and replaces or appends a new param, returning the new URL."}
                }
            ]

        };

        model.parent.stash.childsupport(data,model);

    };

};
