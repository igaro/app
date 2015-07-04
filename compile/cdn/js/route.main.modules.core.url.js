//# sourceURL=route.main.modules.core.url.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {
            desc : _tr("Provides url and uri related functionality."),
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
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
                                    desc: _tr("Pass false to strip the search data (after ?). Default is true.")
                                },
                                {
                                    name:'path',
                                    type:'boolean',
                                    desc: _tr("Pass false to strip the path. Default is true.")
                                }
                            ]
                        }
                    ],
                    desc: _tr("Returns the current fully qualified domain name."),
                    returns: {
                        attributes : [
                            {
                                type:'string'
                            }
                        ]
                    }
                },
                {
                    name:'getHashParam',
                    type:'function',
                    attributes: [
                        {
                            type:'string',
                            required:true,
                            attributes : [{
                                desc: _tr("The name to search.")
                            }]
                        },
                        {
                            type:'string',
                            attributes : [{
                                desc: _tr("The URL to parse. Defaults to the current URL.")
                            }]
                        }
                    ],
                    desc: _tr("Parses a string for params after the hash and on match of a specific key returns the value."),
                    returns: {
                        attributes : [
                            {
                                type:'string'
                            }
                        ]
                    }
                },
                {
                    name:'getHashParams',
                    type:'function',
                    attributes: [
                        {
                            type:'string',
                            required:true,
                            attributes : [{
                                desc: _tr("The URL to parse. Defaults to the current URL.")
                            }]
                        },
                    ],
                    desc: _tr("Parses a string for params after the hash."),
                    returns: {
                        attributes : [
                            {
                                type:'object'
                            }
                        ]
                    }
                },
                {
                    name:'getParam',
                    type:'function',
                    attributes: [
                        {
                            type:'string',
                            required:true,
                            attributes : [{
                                desc: _tr("The name to search.")
                            }]
                        },
                        {
                            type:'string',
                            attributes : [{
                                desc: _tr("The URL to parse. Defaults to the current URL.")
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
                    desc: _tr("Parses a string for params after the question mark and on match of a specific key returns the value.")
                },
                {
                    name:'getParams',
                    type:'function',
                    attributes: [
                        {
                            type:'string',
                            required:true,
                            attributes : [{
                                desc: _tr("The URL to parse. Defaults to the current URL.")
                            }]
                        },
                    ],
                    desc: _tr("Parses a string for params after the question mark."),
                    returns: {
                        attributes : [
                            {
                                type:'object'
                            }
                        ]
                    }
                },
                {
                    name:'replaceParam',
                    type:'function',
                    attributes: [
                        {
                            type:'string',
                            required:true,
                            attributes: [{
                                desc: _tr("The name of to replace or append.")
                            }]
                        },
                        {
                            type:'string',
                            required:true,
                            attributes: [{
                                desc: _tr("The value to use. If the value contains special characters pass encodeURIComponent(value) beforehand."),
                            }]
                        },
                        {
                            type:'string',
                            attributes: [{
                                desc: _tr("The URL to use (defaults to the current URL).")
                            }]
                        }
                    ],
                    returns : {
                        attributes : [
                            {
                                type:'string'
                            }
                        ]
                    },
                    desc: _tr("Parses a URL and replaces or appends a new param, returning the new URL.")
                }
            ]
        };

        model.parent.stash.childsupport(data,model);

    };

};
