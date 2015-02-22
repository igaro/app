module.exports = function(app) {

    return function(route) {

        var data = {
            desc : {"en":"Provides a Router framework to manage navigation and storage of routes. A route represents a resource and manages child routes. Routes can be loaded from multiple API & file servers transparently to the user and do not necessarily correspond to the URI that the user sees. They may form a page or merely a section on a page."},
            author : { 
                name:'Andrew Charnley', 
                link:'http://www.andrewcharnley.com' 
            },
            usage : {
                class : true
            }
        };
            
        data.objects = {

            route : { 
                name:'Route',
                desc: {"en":"Logic and data for managing a route."},
                attributes : [
                    { 
                        name:'addInstance', 
                        type:'function',
                        desc : {"en":"Adds an instance module, instantiates and optionally inserts any returning element into the wrapper. Lazy loads the module if unloaded."},
                        attributes: [
                            { 
                                type:'string/object', 
                                required:true,
                                desc: {"en":"If string will prepend 'instance.' onto the value and if unloaded then load from the default repo."},
                                attributes : [
                                    {
                                        name : 'fullname',
                                        type: 'string',
                                        desc : {"en":"The full name of the module to be loaded and instantiated."}
                                    },
                                    {
                                        name : 'repo',
                                        type: 'string',
                                        desc : {"en":"The repo location to load the module from should it be unloaded."}
                                    }
                                ]
                            },
                            { 
                                type:'object', 
                                required:true,
                                desc: {"en":"Additional options."},
                                attributes : [
                                    {
                                        name : 'insertBefore',
                                        type: 'element',
                                        desc : {"en":"If the instance returns a DOM element then insert into the DOM before the specified element."}
                                    },
                                    {
                                        name : 'insertAfter',
                                        type: 'element',
                                        desc : {"en":"If the instance returns a DOM element then insert into the DOM after the specified element."}
                                    }
                                ]
                            },
                        ],
                        returns: {
                            attributes:[
                                {
                                    instanceof: {
                                        name:'Promise',
                                        desc: {"en":"On success returns the requested instance."}
                                    }
                                }
                            ]
                        }
                    },
                    { 
                        name:'addChildren', 
                        type:'function',
                        attributes: [
                            { 
                                type:'object', 
                                required:true,
                                attributes:[
                                    {
                                        name:'list',
                                        instanceof:'Array',
                                        required:true,
                                        desc: {"en":"Names of the children to load. The source provider decides what to do with these. For file based routes typically the name is appended onto that of the parent route."}
                                    },
                                    {
                                        name:'before',
                                        'instanceof': function() { return data.objects.route; },
                                        desc: {"en":"The container for a route will append into the parent container but may be overridden by specifying an element"}
                                    }
                                ]
                            }
                        ],
                        returns: {
                            attributes:[
                                {
                                    instanceof: {
                                        name:'Promise',
                                        desc: {"en":"On success returns the route."}
                                    }
                                }
                            ]
                        },
                        desc : {"en":"Attempts to load a child route. If loaded an enter() event is fired on the routes event manager. Use this to force code reload. An init() event is fired the first time a route is loaded. Use this to set-up a view and parameters that keep state."}
                    },
                    {
                        name:'addSequence',
                        type:'function',
                        desc: {"en":"Executes a pool of promises and reduces the returned values using the pool order. For an example see file route.main.js. If a promise returns nothing or rejects it is ignored."},
                        attributes : [
                            {
                                type:'object',
                                required : true,
                                attributes : [
                                    {
                                        name:'promises',
                                        type:'array',
                                        required:true,
                                        desc : {"en":"The array of promises to execute."},
                                    },
                                    {
                                        name:'container',
                                        type:'element',
                                        desc : {"en":"The container for which to append the returned values into."}
                                    }
                                ]
                            },
                        ]
                    },
                    { 
                        name:'autoShow', 
                        type:'boolean', 
                        desc : {"en":"Determines if a view will be automatically shown if requested via user navigation. Default is true."},
                    },
                    { 
                        name:'children', 
                        instanceof:'Array',
                        desc : {"en":"A list of loaded child routes."},
                    },
                    { 
                        name:'cssElement', 
                        type:'element',
                        desc : {"en":"Inline CSS provided by an API. Automatically appended."}
                    },
                    { 
                        name:'container',
                        type:'element', 
                        desc : {"en":"The display element."}
                    },
                    { 
                        name:'defaultHideChildren', 
                        type:'boolean', 
                        desc : {"en":"If a view is cached and it's children are displayed they will be automatically hidden when the view is reshown. Set to false to disable."}
                    },
                    { 
                        name:'defaultHideParentViewWrapper', 
                        type:'boolean', 
                        desc : {"en":"Typically a child view will hide the wrapper content of it's parent. Set to false to disable."}
                    },
                    { 
                        name:'displayCount', 
                        type:'number',
                        desc : {"en":"Useful for preventing animation repeat or differentiated content. Appended to the container element for use with CSS selectors."}
                    },
                    {
                        name:'getChildByName',
                        type:'function',
                        desc : {"en":"Returns a Route matching a name."},
                        attributes : [
                            {
                                type:'string',
                                required:true,
                                attributes: [
                                    {
                                        desc : {"en":"Handling name for the Route."},
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name:'hideChildren',
                        type:'function',
                        desc: {"en":"Hides all child' containers."}
                    },
                    { 
                        name:'isVisible', 
                        type:'boolean',
                        desc : {"en":"Use to abort/pause XHR and polling operations."}
                    },
                    { 
                        name:'meta', 
                        type:'object',
                        desc : {"en":"A collection of meta data for the route."}
                    },
                    { 
                        name:'name', 
                        type:'string',
                        desc : {"en":"A uniquely identifying name. Not to be used for user display."}
                    },
                    { 
                        name:'on', 
                        type:'function',
                        desc : {"en":"References core.events.on() but registers the route as a dependency to reduce code overhead. Functionally identical."}
                    },
                    {
                        name:'removeChildren',
                        type:'function',
                        desc: {"en":"Takes an Array of Routes in which to destroy."}
                    },
                    { 
                        name:'scrollPosition', 
                        type:['number','boolean'], 
                        desc : {"en":"When a route has current scope the window scroll position will be saved to this value. If the user navigates away and returns later they'll be placed at the same position they left off. Set to false to disable."}
                    },
                    { 
                        name:'setMeta', 
                        type:'function',
                        desc : {"en":"Sets the value and fires an event."},
                        attributes: [
                            { 
                                type:'*', 
                                required:true,
                            }
                        ]
                    },
                    { 
                        name:'uriPath', 
                        instanceof:'Array',
                        desc : {"en":"May be shown to the user (non localised). Used for history.pushstate. Not to be confused with route.path."},
                    },
                    { 
                        name:'wrapper', 
                        type:'element', 
                        desc : {"en":"The container element contains a wrapper and normally view elements go into this. Child routes go into the container."}
                    }
                ]
            },
            

        },

        data.attributes = [
            {
                name:'addProvider',
                type:'function',
                desc: {"en":"Appends a route provider."},
                attributes: [
                    {
                        type:'object', 
                        required:true, 
                        desc: {"en":"Contains the configuration."},
                        attributes: [
                            { 
                                name:'fetch', 
                                type:'function', 
                                required:true, 
                                desc: {"en":"Fetches either a route file or the data and view from an API."}
                            },
                            {
                                name:'handles', 
                                type:'function',
                                required:true, 
                                desc: {"en":"If a handler for the requested resource it should return true."},
                                attributes : [{
                                    type:'string',
                                    desc: {"en":"The path of the requested resource."}
                                }]
                            },
                        ]
                    }
                ]
            },
            {
                name:'current', 
                instanceof: function() { return data.objects.route; },
                desc: {"en":"References the last loaded route from any call to .to()."}
            },
            {
                name:'providers',
                instanceof:'Array',
                desc: {"en":"Pool of route providers. Note: the discoverer traverses backwards."}
            },
            { 
                name:'root',
                instanceof: function() { return data.objects.route; }, 
                desc: {"en":"A root route with a container appended into document.body"}
            },
            { 
                name:'to',
                type:'function',
                attributes: [
                    {
                        instanceof:'Array',
                        desc: {"en":"Values represent a path which is handled by a source provider. The path may contain URI data which will be parsed out by route logic."},
                    },
                    {
                        name:'search',
                        type:'object',
                        desc: {"en":"Search data (anything after the ? in the URL) may be supplied here. Useful to supply global parameters to all routes."}
                    },
                    {
                        name:'hash',
                        type:'object',
                        desc: {"en":"Hash data (anything after the # in the URL) may be supplied here. Designed for page navigation, misused to supply global parameters."}
                    },
                    { 
                        name:'state', 
                        type:['boolean','string'],
                        desc: {"en":"Supply false to disable pushing the location into the URL bar or a string to customise."}
                    }
                ],
                returns : {
                    attributes: [
                        {
                            instanceof: 'Promise'
                        }
                    ]
                },
                desc: {"en":"Loads multiple resources beginning at root and enumerating through each request. Used for user actioned navigation. A to-begin event is fired which can be used to abort the load by returning a literal containing .stopImmediatePropogation. An event to-in-progress() is fired as the function iterates and to-loaded() fires on success."}
            }
        ];

        route.parent.stash.childsupport(data,route);

    };

};
