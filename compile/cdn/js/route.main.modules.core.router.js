//# sourceURL=route.main.modules.core.router.js

module.exports = function() {

    "use strict";

    return function(route) {

        var data = {
            desc : _tr("Provides a Router framework to manage navigation and storage of routes. A route represents a resource and may contain child routes. Routes can be loaded from API & file servers transparently to the user and don't necessarily correspond to the URI that the user sees. They may form a page or a partial on it."),
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            blessed : true,
            usage : {
                class : true
            }
        };

        data.objects = {

            route : {
                name:'Route',
                blessed : {
                    container:true
                },
                attributes : [
                    {
                        name:'addManager',
                        type:'function',
                        attributes: [
                            {
                                type:'string',
                                required:true,
                                attributes:[
                                    {
                                        desc: _tr("An identifier 'x' to use for the manager, which will be accessible under .managers[x].")
                                    }
                                ]
                            },
                            {
                                type:'object',
                                required:true,
                                attributes:[
                                    {
                                        desc: _tr("The module containing the manager.")
                                    }
                                ]
                            }
                        ],
                        desc : _tr("Because a route is self blessed, bless managers other than the default must be added manually. See core.object for further information.")
                    },
                    {
                        name:'addRoute',
                        type:'function',
                        attributes: [
                            {
                                type:'object',
                                required:true,
                                decorateWithOrder:function() { return data.objects.route; },
                                attributes:[
                                    {
                                        name:'name',
                                        type:'string',
                                        desc: _tr("The name of the route to load. The source provider decides how to handle this. For file based routes typically the name corresponds to the sub resource.")
                                    },
                                    {
                                        name:'silent',
                                        type:'boolean',
                                        desc: _tr("Loads the route without user indications.")
                                    }
                                ]
                            }
                        ],
                        async:true,
                        returns: {
                            attributes:[
                                {
                                    instanceof: function() { return data.objects.route; },
                                }
                            ]
                        },
                        desc : _tr("Attempts to load a child route. If loaded an enter event is fired on the routes event manager. Use this to force code reload. An init event is fired the first time a route is loaded. Use this to set-up a view and parameters that keep state.")
                    },
                    {
                        name:'addRoutes',
                        type:'function',
                        attributes: [
                            {
                                type:'object',
                                required:true,
                                attributes:[
                                    {
                                        instanceof: { name:'Array' },
                                        required:true,
                                    }
                                ]
                            }
                        ],
                        returns: {
                            attributes:[
                                {
                                    instanceof: { name:'Array' },
                                }
                            ]
                        },
                        desc : _tr("Adds routes by calling .addRoute() in sequence.")
                    },
                    {
                        name:'addSequence',
                        type:'function',
                        desc: _tr("Reduces an array of promises and adds container elements (if any) using the reducing order. For an example see file route.main.js. If a promise rejects it is ignored."),
                        attributes : [
                            {
                                type:'object',
                                required : true,
                                attributes : [
                                    {
                                        name:'promises',
                                        instanceof: { name:'Array' },
                                        required:true,
                                        desc : _tr("The array of promises to execute."),
                                    },
                                    {
                                        name:'container',
                                        instanceof: { name:'Element' },
                                        desc : _tr("The container for which to append the returned values into. Defaults to the route's wrapper Element.")
                                    }
                                ]
                            },
                        ],
                        async:true
                    },
                    {
                        name:'autoShow',
                        type:'boolean',
                        desc : _tr("Determines if a view will be automatically shown if requested via user navigation. Default is true."),
                    },
                    {
                        name:'cssElement',
                        instanceof: { name:'Element' },
                        desc : _tr("Inline CSS provided by the route's provider. Automatically appended.")
                    },
                    {
                        name:'defaultHideRoutes',
                        type:'boolean',
                        desc : _tr("If a view is cached and it's children are displayed they will be automatically hidden when the view is reshown. Set to false to disable.")
                    },
                    {
                        name:'defaultHideParentViewWrapper',
                        type:'boolean',
                        desc : _tr("When a child view is displayed the wrapper of it's parent is usually hidden. Set to false to disable.")
                    },
                    {
                        name:'defaultShowWrapper',
                        type:'boolean',
                        desc : _tr("By default a route's wrapper is shown. Set to false to disable.")
                    },
                    {
                        name:'destroyOnLeave',
                        type:'boolean',
                        desc : _tr("By default a route is cached and retains state. Disable by setting to true.")
                    },
                    {
                        name:'getRouteByName',
                        type:'function',
                        desc : _tr("Returns a Route matching a name."),
                        attributes : [
                            {
                                type:'string',
                                required:true,
                                attributes: [
                                    {
                                        desc : _tr("Handling name for the Route."),
                                    }
                                ]
                            }
                        ],
                        returns : {
                            attributes: [{
                                instanceof: function() { return data.objects.route; },
                            }]
                        }
                    },
                    {
                        name:'hideRoutes',
                        type:'function',
                        desc: _tr("Hides all child route containers.")
                    },
                    {
                        name:'meta',
                        type:'object',
                        desc : _tr("A collection of meta data for the route.")
                    },
                    {
                        name:'name',
                        type:'string',
                        desc : _tr("A uniquely identifying name. Not to be used for user display.")
                    },
                    {
                        name:'on',
                        type:'function',
                        desc : _tr("References core.events.on() but registers the route as a dependency to reduce code overhead. For blessed objects, use the .extend() method instead.")
                    },
                    {
                        name:'originalUrl',
                        instanceof: { name:'Array' },
                        desc : _tr("Represents the URL path for this route, including captured URI data."),
                    },
                    {
                        name:'removeRoutes',
                        type:'function',
                        desc: _tr("Takes an Array of Routes in which to destroy."),
                        async:true,
                        attributes : [
                            {
                                type:'object',
                                attributes : [{
                                    instanceof: { name:'Array' }
                                }],
                            }
                        ]
                    },
                    {
                        name:'routes',
                        instanceof: { name:'Array' },
                        desc : _tr("A pool of loaded child routes."),
                    },
                    {
                        name:'scrollPosition',
                        type:'*',
                        desc : _tr("When a route has current scope the window scroll position will be saved to this value. If the user navigates away and returns later they'll be placed at the same position they left off. Set to false to disable.")
                    },
                    {
                        name:'uriPath',
                        instanceof: { name:'Array' },
                        desc : _tr("Represents the URL path once URI resources have been removed from it. This makes it useful for building a user navigation location bar."),
                    },
                    {
                        name:'uriPieces',
                        instanceof: { name:'Array' },
                        desc : _tr("The URI data extracted for this route. It is a cache for .captureUri(), which should be run by the route when it loads to capture it's data."),
                    },
                    {
                        name:'wrapper',
                        instanceof: { name:'Element' },
                        desc : _tr("The container element contains a wrapper and normally view elements append into it. Child routes go directly into the container.")
                    }
                ]
            }

        },

        data.attributes = [
            {
                name:'addProvider',
                type:'function',
                desc: _tr("Appends a route provider to the pool."),
                attributes: [
                    {
                        type:'object',
                        required:true,
                        desc: _tr("Contains the configuration."),
                        attributes: [
                            {
                                name:'fetch',
                                type:'function',
                                required:true,
                                desc: _tr("Used to fetch the resource from a fileserver or API. The function should return a Promise containing the attributes specified."),
                                returns : {
                                    attributes: [
                                        {
                                            instanceof: { name: 'Promise' }
                                        },
                                        {
                                            name:'css',
                                            type:'string',
                                            desc:_tr("The style for the route.")
                                        },
                                        {
                                            name:'js',
                                            type:'function',
                                            desc:_tr("The route setup function responsible for building a view. See any route.* file for an example. The function may return a Promise."),
                                            attributes : [{
                                                instanceof: function() { return data.objects.route; },
                                            }],
                                            returns : {
                                                attributes: [
                                                    {
                                                        instanceof: { name: 'Promise' }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                name:'handles',
                                type:'function',
                                required:true,
                                desc: _tr("Determines if the provider is a handler for a resource."),
                                attributes : [{
                                    type:'string',
                                    desc: _tr("The path of the requested resource.")
                                }],
                                returns : {
                                    attributes : [{
                                        type:'boolean'
                                    }]
                                }
                            },
                        ]
                    }
                ]
            },
            {
                name:'base',
                instanceof: function() { return data.objects.route; },
                desc: _tr("A base route with it's container most likely appended into that of the root route. The base represents the root of the URL.")
            },
            {
                name:'current',
                instanceof: function() { return data.objects.route; },
                desc: _tr("References the last successfully loaded route from any call to .to().")
            },
            {
                name:'isAtBase',
                type:'function',
                desc: _tr("Determines whether the current route is that of the base route, aka at root of the URL."),
                returns: {
                    attributes:[{
                        type:'boolean'
                    }]
                }
            },
            {
                name:'providers',
                instanceof: { name:'Array' },
                desc: _tr("Pool of route providers. Note: the discoverer traverses backwards.")
            },
            {
                name:'root',
                instanceof: function() { return data.objects.route; },
                desc: _tr("A root route with it's container appended into document.body. The root will normally have common header, main and footer routes appended into it.")
            },
            {
                name:'to',
                type:'function',
                attributes: [
                    {
                        type:'object',
                        attributes : [{
                            instanceof: { name: 'Array' },
                            desc: _tr("Values represent a URL path which is handled by a source provider. The path may contain URI data which will be parsed out by route logic."),
                        }]
                    },
                    {
                        type:'object',
                        attributes : [{
                            instanceof: { name: 'Array' },
                            desc: _tr("Search data to append after ? in the URL. This can be a function to compile the value dynamically or an array which will be joined using the = operator.")
                        }]
                    },
                    {
                        type:'string',
                        attributes : [{
                            desc: _tr("Hash data to append after # in the URL. This can be a function to compile the value dynamtically or a string."),
                        }]
                    },
                    {
                        type:"object",
                        attributes : [{
                            desc: _tr("Supply a state to push into the browsers history. This is data which moves with the URL.")
                        }]
                    }
                ],
                returns : {
                    attributes: [
                        {
                            instanceof: { name: 'Promise' }
                        }
                    ]
                },
                desc: _tr("Loads multiple resources by way of a URL beginning at the base route and enumerating through. Used for user actioned navigation. The current route can abort the load via its leave event if it returns { abort:true }. The events to-begin, to-in-progress and to-loaded() can be used to provide user feedback as routes load.")
            }
        ];

        route.parent.stash.childsupport(data,route);

    };

};
