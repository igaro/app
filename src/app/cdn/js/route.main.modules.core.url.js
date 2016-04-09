//# sourceURL=route.main.modules.core.url.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {
            desc : function() { return this.tr((({ key:"Provides url and uri related functionality." }))); },
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            usage : {
                class : true
            },
            objects : {
                url : {
                    name : 'Url',
                    desc : function() { return this.tr((({ key:"A URL object containing URI/Search/Hash and with functions to build a string representation." }))); },
                    attributes : [
                        {
                            name : 'path',
                            instanceof: { name:'Array' },
                            desc : function() { return this.tr((({ key:"URI pieces." }))); }
                        },
                        {
                            name : 'hash',
                            type:'string',
                            desc : function() { return this.tr((({ key:"Text after the URL #." }))); }
                        },
                        {
                            name : 'search',
                            type:'object',
                            desc : function() { return this.tr((({ key:"Key/value pairs after the URL ?." }))); }
                        },
                        {
                            name:'toString',
                            type: 'function',
                            async : true,
                            desc : function() { return this.tr((({ key:"Converts the object into a URL string used for navigation." }))); },
                            returns : {
                                attributes: [{
                                    type:'string'
                                }]
                            }
                        }
                    ]
                }
            },

            attributes : [
                {
                    name:'fromComponents',
                    type:'function',
                    attributes: [
                        {
                            type:'object',
                            required:true,
                            attributes : [{
                                instanceof: { name:'Array' },
                                desc: function() { return this.tr((({ key:"URI pieces." }))); }
                            }]
                        },
                        {
                            type:'object',
                            required:true,
                            attributes : [{
                                desc: function() { return this.tr((({ key:"Key/value pairs after the URL ?." }))); }
                            }]
                        },
                        {
                            type:'string',
                            required:true,
                            attributes : [{
                                desc : function() { return this.tr((({ key:"Text after the URL #." }))); }
                            }]
                        }
                    ],
                    desc: function() { return this.tr((({ key:"Returns a new object representation for individual components." }))); },
                    returns: {
                        attributes : [
                            {
                                instanceof : function() { return data.objects.url; }
                            }
                        ]
                    }
                },
                {
                    name:'fromUrl',
                    type:'function',
                    attributes: [
                        {
                            type:'string',
                            required:true,
                            attributes : [{
                                desc: function() { return this.tr((({ key:"The URL to parse." }))); }
                            }]
                        },
                    ],
                    desc: function() { return this.tr((({ key:"Returns a new object representation for the supplied URL." }))); },
                    returns: {
                        attributes : [
                            {
                                instanceof : function() { return data.objects.url; }
                            }
                        ]
                    }
                },
                {
                    name:'getCurrent',
                    type:'function',
                    desc: function() { return this.tr((({ key:"Returns a new object representation for the current URL." }))); },
                    returns: {
                        attributes : [
                            {
                                instanceof : function() { return data.objects.url; }
                            }
                        ]
                    }
               },
               {
                    name:'getHash',
                    type:'function',
                    attributes: [
                        {
                            type:'string',
                            attributes : [{
                                desc: function() { return this.tr((({ key:"The URL to parse. Defaults to the current URL." }))); }
                            }]
                        },
                    ],
                    desc: function() { return this.tr((({ key:"Parses a string for params after the hash." }))); },
                    returns: {
                        attributes : [
                            {
                                type:'string'
                            }
                        ]
                    }
               },
               {
                    name:'getPath',
                    type:'function',
                    attributes: [
                        {
                            type:'string',
                            attributes : [{
                                desc: function() { return this.tr((({ key:"Optional URL to parse. Defaults to the current URL." }))); }
                            }]
                        }
                    ],
                    desc: function() { return this.tr((({ key:"Parses the path URI within a URL into individual pieces." }))); },
                    returns: {
                        attributes : [
                            {
                                instanceof: { name:'Array' },
                            }
                        ]
                    }
                },
                {
                    name:'getSearch',
                    type:'function',
                    attributes: [
                        {
                            type:'string',
                            attributes : [{
                                desc: function() { return this.tr((({ key:"The name to search." }))); }
                            }]
                        },
                        {
                            type:'string',
                            attributes : [{
                                desc: function() { return this.tr((({ key:"Optional URL to parse. Defaults to the current URL." }))); }
                            }]
                        }
                    ],
                    desc: function() { return this.tr((({ key:"Parses a string for params after the hash and on match of a specific key returns the value." }))); },
                    returns: {
                        attributes : [
                            {
                                type:'string'
                            }
                        ]
                    }
                },
                {
                    name:'getSearchValue',
                    type:'function',
                    attributes: [
                        {
                            type:'string',
                            required:true,
                            attributes : [{
                                desc: function() { return this.tr((({ key:"The name to pull." }))); }
                            }]
                        },
                        {
                            type:'string',
                            attributes : [{
                                desc: function() { return this.tr((({ key:"The URL to parse. Defaults to the current URL." }))); }
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
                    desc: function() { return this.tr((({ key:"Parses a string for params after the question mark and on match of a specific key returns the value." }))); }
                }
            ]
        };

        model.parent.stash.childsupport(data,model);

    };

};
