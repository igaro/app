//# sourceURL=core.router.js

(function() {

'use strict';

if (typeof window.history.pushState === 'undefined')
    throw { incompatible:true, noobject:'history.pushState' };

module.requires = [
    { name:'core.router.css' },
    { name:'core.language.js' }
];

module.exports = function(app) {

    var dom = app['core.dom'],
        object = app['core.object'],
        bless = object.bless,
        arrayInsert = object.arrayInsert;

    // ROUTE
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
        bless.call(this,o);
        this.uriPath = [];
        this.uriPieces = [];
        this.originalUri = [];
        this.destroyOnLeave = false;
        this.defaultHideRoutes=true;
        this.defaultHideParentViewWrapper=true;
        this.defaultShowWrapper=true;
        this.autoShow = true;
        this.scrollPosition=0;
        this.modules = {};
    };

    CoreRouterRoute.prototype.addManager = function(name,module) {
        if (this.managers[name])
            throw new Error('Manager already appended. Unable to add twice.');
        var m = this.managers[name] = module.createMgr(this);
        return m;
    };

    CoreRouterRoute.prototype.captureUri = function(c) {
        this.uriPieces = this.originalUri.slice(0,c).map(function(p) {
            return decodeURIComponent(p);
        });
        return this.uriPieces;
    };

    CoreRouterRoute.prototype.on = function(evt,fn,o) {
        return this.managers.event.on(evt,fn,o);
    };

    CoreRouterRoute.prototype.getUrl = function() {
        return '/'+this.uriPath.map(function (o) {
            return encodeURIComponent(o);
        }).concat('').join('/');
    };

    CoreRouterRoute.prototype.addSequence = function(o) {
        var self = this,
            values = [];
        return o.promises.reduce(function(sequence, cP) {
            return sequence.then(function() {
                return cP;
            }).catch(function(e) {
                if (! o.silent)
                    self.managers.debug.handle(e);
                throw e;
            }).then(function(container) {
                values.push(container);
                if (typeof container !== 'object')
                    return;
                if ((!(container instanceof Node)) && container.container instanceof Node) //jshint ignore: line
                    container = container.container;
                if (container instanceof Node) // jshint ignore: line
                    o.container.appendChild(container);
            });
        }, Promise.resolve()).then(function() {
            return values;
        });
    };

    CoreRouterRoute.prototype.isBase = function() {
        return this === router.base;
    };

    CoreRouterRoute.prototype.getRouteByName = function(name) {
        var pool = this.routes;
        for (var i=0; i< pool.length; ++i) {
            if (pool[i].name === name)
                return pool[i];
        }
        return null;
    };

    CoreRouterRoute.prototype.addRoutes = function(o) {
        var self = this;
        return object.promiseSequencer(o,function(a) {
            return self.addRoute(a);
        });
    };

    CoreRouterRoute.prototype.addRoute = function(o) {
        var pool = this.routes,
            self = this,
            name = o.name,
            g,
            fetcher;
        if (! pool.some(function(y) {
            if (y.name === name) {
                g = y;
                return true;
            }
        })) {
            g = new CoreRouterRoute({
                parent:self,
                container:self.container,
                name:name
            });
            g.managers.event.on('destroy', function() {
                pool.splice(pool.indexOf(g),1);
                if (g.cssElement)
                    g.managers.dom.rm(g.cssElement);
                if (router.current === g)
                    router.current = g.parent;
            });
            var provider = router.getProviderForPath(g.path);
            if (! provider)
                throw { error:'No Route provider for path', route:g };
            g.url = provider.url;
            fetcher = provider.fetch(g).then(
                function(j) {
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
                }
            ).then(function() {
                arrayInsert(pool,g,o);
                return self.managers.event.dispatch('addRoute',g);
            });
        }
        return (fetcher? fetcher : Promise.resolve()).then(function() {
            g.originalUri = o.uri;
            return g.managers.event.dispatch('enter').then(function() {
                if (!g._initilized)
                    return g.managers.event.dispatch('init').then(function() {
                        g._initilized = true;
                    });
            }).then(function() {
                if (g.defaultShowWrapper)
                    dom.show(g.wrapper);
                if (g.defaultHideRoutes)
                    g.hideRoutes();
                if (g.defaultHideParentViewWrapper)
                    dom.hide(g.parent.wrapper);
                return g;
            });
        }).catch(function (e) {
            return g.destroy().then(function() {
                throw e;
            });
        });
    };

    CoreRouterRoute.prototype.removeRoutes = function() {
        return Promise.all(this.routes.map(function (m) {
            return m.destroy();
        }));
    };

    CoreRouterRoute.prototype.hideRoutes = function() {
        this.routes.forEach(function (m) {
            m.hide();
        });
    };

    // CONTROLLER
    var router = {
        name:'core.router',
        requestId : 0,
        base:null,
        current:null,
        isAtBase : function() {
            return this.current === this.base;
        },
        children : {
            providers : 'provider'
        },
        getProviderForPath : function(path) {
            var providers = this.providers;
            for (var i=providers.length-1; i>=0; --i) {
                if (providers[i].handles(path))
                    return providers[i];
            }
        },
        addProvider : function(o) {
            o.name = 'provider';
            bless.call(o, {
                parent:this
            });
            arrayInsert(this.providers,o,o);
        },

        to : function(path, search, hash, state) {
            this.requestId++;
            var base = router.base.path.slice(1),
                ra = path? base.concat(path) : base,
                model = this.root,
                self = this,
                c = this.current,
                v = this.requestId,
                routerEventMgr = router.managers.event;
            return (c?
                c.managers.event.dispatch('leave').then(function(o) {
                    if (o && o.abort)
                        throw -14443864;
                    if(c.destroyOnLeave)
                        return c.destroy();
                    // disable route
                    return c.disable().then(function() {
                        // save scroll position
                        var s = document.body.scrollTop || document.documentElement.scrollTop;
                        c.scrollPosition = s < 0? 0 :s;
                    });
                })
                :
                Promise.resolve()
            ).then(function() {
                return routerEventMgr.dispatch('to-begin').then(function () {
                    return ra.reduce(function(a,b,i) {
                        return a.then(function() {
                            return model.addRoute({
                                    name:ra[i],
                                    uri : ra.slice(i+1),
                                    silent : true
                            }).then(function(m) {
                                    // abort the load, another request has since came in
                                    if (self.requestId !== v)
                                        throw -1600;
                                    c = self.current = model = m;
                                    i += model.uriPieces.length;
                                    model.uriPath = ra.slice(base.length,i+1);
                                    if (model.autoShow)
                                        model.show();
                                    return routerEventMgr.dispatch('to-in-progress',model);
                            });
                        });
                    }, Promise.resolve()).then(function() {
                        if (typeof state === 'boolean' && state === false) {
                            window.history.replaceState({ initial:true },null);
                        } else {
                            var urlPath = '/'+path.map(function(f) {
                                return encodeURIComponent(f);
                            }).concat('').join('/');
                            if (search) {
                                if (typeof search === 'function')
                                    search = search();
                                urlPath += '?' + search.map(function (f) {
                                    return encodeURIComponent(f[0]) + '=' + encodeURIComponent(f[1]);
                                });
                            }
                            if (hash) {
                                if (typeof hash === 'function')
                                    hash = hash();
                                urlPath += '#'+hash;
                            }
                            window.history.pushState(state || {},null,urlPath);
                        }
                        if (typeof c.scrollPosition === 'number')
                            document.body.scrollTop = document.documentElement.scrollTop = c.scrollPosition;
                        return routerEventMgr.dispatch('to-loaded', model).then(function() {
                            routerEventMgr.dispatch('to-end', model);
                        });
                    }).catch(function (e) {
                        // handle url user mind change code
                        if (typeof e !== 'boolean' && e !== -1600)
                            return routerEventMgr.dispatch('to-error', { x:model, error:e }).then(function() {
                                throw e;
                            });
                    }).catch(function(e) {
                        // replace the url with whatever has managed to load
                        window.history.replaceState({},null,router.current.getUrl());
                        return routerEventMgr.dispatch('to-end', { x:model, error:e }).then(function() {
                            throw e;
                        });
                    });
                });
            }).catch(function (e) {
                if (e !== -14443864)
                    throw e;
            });
        }
    };

    bless.call(router);

    router.root = new CoreRouterRoute({
        name:'route'
    });
    router.managers = router.root.managers;

    // default current to root
    var mrv = router.current = router.root;
    mrv.container.className = 'core-router';
    mrv.show();
    document.body.appendChild(mrv.container);

    // window URL change
    var autoRouter = function() {
        var w = window.location.pathname.trim().substr(1),
            s = window.location.search.split('&'),
            h = window.location.hash;
        w = w.length? w.replace(/\/+$/, "").split('/') : [];
        return router.to(w,s,h,false);
    };
    window.addEventListener('popstate', autoRouter);

    if (document.location.protocol !== 'file:') {
        var wl = window.location;
        // add missing slash
        window.history.replaceState(window.history.state,null,wl.href.replace(/\/?(\?|#|$)/, '/$1').substr(wl.protocol.length+wl.host.length+2));
        if (wl.pathname.length > 1) {
            app['core.events'].rootEmitter.on('state.base', function() {
                // do not return, this prevents event aborting
                autoRouter();
                return { removeEventListener: true };
            });
        }
    }

    return router;
};

})();
