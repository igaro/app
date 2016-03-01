//# sourceURL=core.router.js

(function(env) {

    'use strict';

    module.requires = [
        { name:'core.router.css' },
        { name:'core.language.js' },
        { name:'core.url.js' }
    ];

    module.exports = function(app) {

        var dom = app['core.dom'],
            object = app['core.object'],
            coreUrl = app['core.url'],
            bless = object.bless,
            arrayInsert = object.arrayInsert;

        /* A route, which represents a path or folder(s) on a url
         * @constructor
         */
        var CoreRouterRoute = function(o) {

            var self = this;
            this.name = o.name;
            this.container = function(dom) {

                return dom.mk('div',o.container,null,function() {

                    this.className = 'route';
                    self.wrapper = dom.mk('div',this,null,'wrapper');
                    if (typeof o.name === 'string')
                        this.classList.add(o.name.replace(/\./g,'--'));
                });
            };
            this.routes = [];
            this.uriPieces = [];
            this.originalUri = [];
            this.destroyOnLeave = false;
            this.defaultHideRoutes=true;
            this.defaultHideParentViewWrapper=true;
            this.defaultShowWrapper=true;
            this.autoShow = true;
            this.scrollPosition=0;
            this.modules = {};
            bless.call(this,o);
        };

        /* Counts the level at which the route sits within the tree
         * @returns {number}
         */
        CoreRouterRoute.prototype.getTreeLevel = function() {

            var i = -1,
                parent = this;

            while (parent) {
                ++i;
                parent = parent.parent;
            }
            return i;
        };

        /* Works out if the route is base or a sibling of (therefore at the same tree level)
         * @returns {Boolean}
         */
        CoreRouterRoute.prototype.isAtBase = function() {

            return this.getTreeLevel() === router.rootPathLevel;
        };

        /* Returns a routes full uri based path
         * @returns {Array} containing paths / uri data
         */
        CoreRouterRoute.prototype.uriPath = function() {

            var parent = this,
                path = [],
                rootPathLevel = router.rootPathLevel;

            while (parent && ! parent.isAtBase()) {

                path = path.concat(parent.originalUri.slice(0,parent.uriPieces).reverse());
                path.push(parent.name);
                parent = parent.parent;
            }

            return path.reverse();
        };

        /* Shortcut to append child paths onto a routes path and call router.to
         * @param {Array} path - path(s) to append
         * @param {object [search] - query to pass
         * @param {string} [hash] - hash to pass
         * @returns {Promise}
         */
        CoreRouterRoute.prototype.to = function(path,search,hash) {

            if (! (path instanceof Array))
                throw new TypeError("First argument must be instanceof Array");

            return router.to(this.uriPath().concat(path),search,hash);
        };

        /* Dynamically adds a manager to an route after its been blessed
         * @param {string} name - of manager to add
         * @param {string} module - the module containing the manager
         * @returns (object} the manager
         */
        CoreRouterRoute.prototype.addManager = function(name,module) {

            if (typeof name !== 'string')
                throw new TypeError("First argument must be of type string");

            if (typeof module !== 'object' || ! module.createMgr)
                throw new TypeError("Second argument must be an object supplying a manager");

            if (this.managers[name])
                throw new Error('Manager already appended. Unable to add twice.');

            var m = this.managers[name] = module.createMgr(this);
            return m;
        };

        /* Captures uri data and assigns to the route to identify children.
         * For /route/data/childroute/data/, this function extracts the data, assigns to the routes
         * Further children can then be identified by the router. See online help for detailed info.
         * @param {number} n - the pieces to pull from the uri
         * @returns {Array} containing the uri parts
         */
        CoreRouterRoute.prototype.captureUri = function(n) {

            if (typeof n !== 'number' || n < 1)
                throw new TypeError("First argument must be a number with a value greater than 0");

            this.uriPieces = this.originalUri.slice(0,n).map(function(p) {

                return decodeURIComponent(p);
            });
            return this.uriPieces;
        };

        /* Shortcut to access a route's event manager .on function
         * @param {string} evt - event name
         * @param {function} fn - function to register
         * @param {object} [o] - optional conf, see core.events.on
         * @returns {object} event handler
         */
        CoreRouterRoute.prototype.on = function(evt,fn,o) {

            return this.managers.event.on(evt,fn,o);
        };

        /* Produces a path based on a route's path data.
         * @param {Array} [path] - containing folders
         * @param {object} [search] - containing query data
         * @param {string} [hash] - url hash
         * @returns {string} a url
         */
        CoreRouterRoute.prototype.getUrl = function(path,search,hash) {

            if (! path)
                path = [];

            return coreUrl.fromComponents(this.uriPath().concat(path),search,hash);
        };

        /* Reduces an array of Promises, appending dom containers upon each resolve
         * @param {object} o - config containing; o.promises, o.silent
         * @returns {Promise} containing an array of values from each Promise
         */
        CoreRouterRoute.prototype.addSequence = function(o) {

            var self = this,
                values = [];

            return o.promises.reduce(function(sequence, cP) {

                return sequence.then(function() {
                    return cP;

                })['catch'](function(e) {

                    if (! o.silent)
                        self.managers.debug.handle(e);
                    throw e;
                }).then(function(container) {

                    values.push(container);
                    if (typeof container === 'object' && (container instanceof Array || container instanceof Node || container.container))
                        dom.append(o.container, container);

                });
            }, Promise.resolve()).then(function() {

                return values;
            });
        };

        /* Shortcut to allow a route to detect if it's the base root (ie main within header/main/footer
         * @returns {boolean}
         */
        CoreRouterRoute.prototype.isBase = function() {

            return this === router.base;
        };

        /* Returns a child route by its name (aka folder on the uri)
         * @param {string} name - to search for
         * @returns {CoreRouterRoute}
         */
        CoreRouterRoute.prototype.getRouteByName = function(name) {

            if (typeof name !== 'string')
                throw new TypeError('First argument must be of type string');

            return this.routes.find(function(route) {

                return pool[i].name === name;
            });
        };

        /* Adds child routes in sequence. See .addRoute
         * @param {Array} routes - to add by name
         * @returns {Promise} containing array of routes
         */
        CoreRouterRoute.prototype.addRoutes = function(routes) {

            var self = this;
            return object.promiseSequencer(routes,function(a) {
                return self.addRoute(a);
            });
        };

        /* Adds a child route to a route
         * @param {object} config - containing; o.name
         * @returns {Promise} containing route
         */
        CoreRouterRoute.prototype.addRoute = function(o) {

            var pool = this.routes,
                self = this,
                name = o.name,
                fetcher;

            // find existing
            var g = pool.find(function(route) {

                return route.name === name;
            });

            // not found
            if (! g) {

                // instantiate new route
                g = new CoreRouterRoute({
                    parent:self,
                    container:self.container,
                    name:name
                });

                // add common cleanup methods
                g.managers.event.on('destroy', function() {

                    // remove from pool
                    pool.splice(pool.indexOf(g),1);

                    // remove linked css
                    if (g.cssElement)
                        g.managers.dom.rm(g.cssElement);

                    // if current route is this, set current to parent
                    if (router.current === g)
                        router.current = g.parent;
                });

                // get a provider for the route
                var provider = router.getProviderForPath(g.path);
                if (! provider)
                    throw { error:'No Route provider for path', route:g };
                g.url = provider.url;

                // designate fetcher
                fetcher = provider.fetch(g).then(function(j) {

                    if (j.css)
                        g.cssElement=dom.mk('style',dom.head, j.css);
                    var ret = j.js(g);
                    if (typeof ret === 'object' && ret instanceof Promise) {
                        return ret.then(function() {

                            return g;
                        });
                    } else {
                        return g;
                    }
                }).then(function() {

                    arrayInsert(pool,g,o);
                    return self.managers.event.dispatch('addRoute',g);
                });
            }

            // fetch if required
            return (fetcher? fetcher : Promise.resolve()).then(function() {

                g.originalUri = o.uri || [];

                // fire events
                return g.managers.event.dispatch('enter').then(function() {

                    if (!g._initilized)
                        return g.managers.event.dispatch('init').then(function() {

                            g._initilized = true;
                        });
                }).then(function() {

                    // show
                    if (g.defaultShowWrapper)
                        dom.show(g.wrapper);
                    if (g.defaultHideRoutes)
                        g.hideRoutes();
                    if (g.defaultHideParentViewWrapper)
                        dom.hide(g.parent.wrapper);
                    return g;
                });
            })['catch'](function (e) {

                // destroy route
                return g.destroy().then(function() {

                    throw e;
                });
            });
        };

        /* Destroys all child routes
         * @returns {Promise}
         */
        CoreRouterRoute.prototype.removeRoutes = function() {

            return Promise.all(this.routes.map(function (m) {

                return m.destroy();
            }));
        };

        /* Hides all child routes
         * @returns {null}
         */
        CoreRouterRoute.prototype.hideRoutes = function() {

            this.routes.forEach(function (m) {

                m.hide();
            });
        };

/*------------------------------------------------------------------------------------------------*/

        // service
        var router = {

            name:'core.router',
            requestId : 0,
            base:null,
            current:null,
            rootPathLevel:0,

            // detects if the current route is at base (typically the browser url is at /)
            isAtBase : function() {

                return this.current === this.base;
            },

            children : {
                providers : 'provider'
            },

            // gets a provider for a path
            getProviderForPath : function(path) {

                var providers = this.providers;
                for (var i=providers.length-1; i>=0; --i) {
                    if (providers[i].handles(path))
                        return providers[i];
                }
            },

            // adds a provider to the pool, allowing for multiple route sources
            addProvider : function(o) {

                o.name = 'provider';
                bless.call(o, {
                    parent:this
                });
                arrayInsert(this.providers,o,o);
            },

            /* The main routing function. Handles errors making it user event sane
             * @param {(CoreURLMgr|Array)} [a] - see core.url (or make one using router.getUrl). Can also take an array of path data.
             * @param {(object|boolean)} [b] - if a is Array, this is search query data, otherwise it prevents url update. Default is null|false.
             * @param {(string|boolean)} [c] - if a is Array, this is hash data, otherwise it is unused.
             * @param {boolean} [d] - if a is Array, this defines if the url shouldn't be updated. Default is false.
             * @returns {Promise} indicating success
             */
            to : function(a,b,c,d) {

                if (a instanceof coreUrl.__CoreURLMgr) {

                    var path = a.path,
                        search =a.search,
                        hash = a.hash,
                        noPush = b;

                } else if (a instanceof Array) {

                    var path = a,
                        search = b,
                        hash = c,
                        noPush = d;
                } else {

                    throw new TypeError("First argument must be instance of CoreURLMgr or Array");
                }

                ++this.requestId;

                var base = router.base.path.slice(1),
                    paths = path? base.concat(path) : base,
                    model = this.root,
                    c = this.current,
                    v = this.requestId,
                    routerEventMgr = router.managers.event;

                // attempt to leave the current route
                return (c?
                    c.managers.event.dispatch('leave').then(function(o) {

                        // unique abort identifier
                        if (o && o.abort)
                            throw -14443864;

                        // auto destroy on leave (route wont retain state)
                        if(c.destroyOnLeave)
                            return c.destroy();

                        // disable route
                        return c.disable().then(function() {

                            // save scroll position for user return
                            var s = document.body.scrollTop || document.documentElement.scrollTop;
                            c.scrollPosition = s < 0? 0 :s;
                        });
                    })
                    :
                    Promise.resolve()
                ).then(function() {

                    return routerEventMgr.dispatch('to-begin').then(function () {

                        // load paths in sequence
                        return paths.reduce(function(a,b,i) {

                            return a.then(function() {

                                // add the next route
                                return model.addRoute({
                                    name:paths[i],
                                    uri : paths.slice(i+1),
                                    silent : true,

                                }).then(function(m) {

                                    // abort the load, another request has since came in
                                    if (router.requestId !== v)
                                        throw -1600;

                                    // loaded, set as current
                                    c = router.current = model = m;

                                    // skip paths?
                                    i += model.uriPieces.length;

                                    // show it now?
                                    if (model.autoShow)
                                        model.show();

                                    // so far so good
                                    return routerEventMgr.dispatch('to-in-progress',model);
                                });
                            });
                        }, Promise.resolve()).then(function() {

                            if (! noPush) {

                                // path
                                var urlPath = '/'+path.map(function(f) {

                                    return encodeURIComponent(f);
                                }).join('/');

                                // search
                                if (search) {
                                    if (typeof search === 'function')
                                        search = search();
                                    urlPath += '?' + search.map(function (f) {

                                        return encodeURIComponent(f[0]) + '=' + encodeURIComponent(f[1]);
                                    });
                                }

                                // hash
                                if (hash) {
                                    if (typeof hash === 'function')
                                        hash = hash();
                                    urlPath += '#'+hash;
                                }

                                // apply
                                env.location.hash = '#' + urlPath;
                            }

                            // scroll to y?
                            if (typeof c.scrollPosition === 'number')
                                document.body.scrollTop = document.documentElement.scrollTop = c.scrollPosition;

                            // all done
                            return routerEventMgr.dispatch('to-loaded', model).then(function() {

                                routerEventMgr.dispatch('to-end', model);
                            });
                        })['catch'](function (e) {

                            // handle url user mind change code
                            if (typeof e !== 'boolean' && e !== -1600)
                                return routerEventMgr.dispatch('to-error', { x:model, error:e }).then(function() {
                                    throw e;
                                });
                        })['catch'](function(e) {

                            // replace the url with whatever has managed to load
                            ///window.history.replaceState({},null,router.current.getUrl());
                            return routerEventMgr.dispatch('to-end', { x:model, error:e }).then(function() {

                                throw e;
                            });
                        });
                    });
                })['catch'](function (e) {

                    if (e !== -14443864)
                        throw e;
                });
            }
        };

        bless.call(router);

        // create root route
        router.root = new CoreRouterRoute({
            name:'route'
        });

        // use the managers from the root route to drop the service out of the chain
        router.managers = router.root.managers;

        // default current to root
        var mrv = router.current = router.root;
        mrv.container.className = 'core-router';

        //mrv.show();
        document.body.appendChild(mrv.container);

        // private helper to run router on current url
        var autoRouter = function() {

            return router.to(coreUrl.getCurrent(),true);
        };

        // window url change
        window.addEventListener('hashchange', autoRouter);

        // handle current url, if not on local filesystem (aka Phonegap app)
        if (document.location.protocol !== 'file:') {

            var path = coreUrl.getPath();

            if (path.length) {
                app['core.events'].rootEmitter.on('state.base', function() {

                    // DO NOT return autoRouter - this would abort event
                    autoRouter();

                    // gc: remove one shot event
                    return { removeEventListener: true };
                });
            }
        }

        return router;
    };

})(this);
