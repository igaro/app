(function() {

'use strict';

if (typeof history.pushState === 'undefined') 
    throw { incompatible:true, noobject:'history.pushState' };

module.requires = [
    { name:'core.router.css' },
    { name:'core.language.js' }
];

module.exports = function(app) {

    var events = app['core.events'], 
        language = app['core.language'], 
        Amd = app['instance.amd'],
        dom = app['core.dom'],
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
        this.cssElement=dom.mk('style',dom.head);
    };
    
    CoreRouterRoute.prototype.captureUri = function(c) {
        this.uriPieces = this.originalUri.slice(0,c).map(function(p) {
            return decodeURIComponent(p);
        });
        return this.uriPieces;
    };

    CoreRouterRoute.prototype.on = function(name,evt,fn) {
        var deps = [this],
            target = null,
            t;
        if (typeof evt === 'string') {
            t = evt;
        } else {
            if (! (evt instanceof Array))
                throw new Error('CoreRouterRoute.on: second argument must be string or array');
            t = evt.shift();
            if (evt.length)
                target = evt.shift();
            if (evt.length)
                deps.concat(evt.shift());
        }
        events.on(name,[t,target,deps],fn);
    };

    CoreRouterRoute.prototype.getUrl = function() {
        return '/'+this.uriPath.map(function (o) {
            return encodeURIComponent(o);
        }).concat('').join('/');
    };

    CoreRouterRoute.prototype.addSequence = function(o) {
        var self = this;
        return o.promises.reduce(function(sequence, cP) {
            return sequence.then(function() {
                return cP;
            }).catch(function(e) {
                if (! o.silent)
                    self.managers.debug.handle(e);
                throw e;
            }).then(function(container) {
                if (typeof container !== 'object')
                    return;
                if ((!(container instanceof Node)) && container.container instanceof Node)
                    container = container.container;
                if (container instanceof Node)
                    o.container.appendChild(container);
            });
        }, Promise.resolve());
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
            path = this.path,
            silent = o.silent,
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
                        g.cssElement.innerHTML = css;
                    var ret = j.js(g);
                    if (ret && ret instanceof Promise) {
                        return ret.then(function(h) {
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
                    var s = document.body.scrollTop || document.documentElement.scrollTop;
                    c.scrollPosition = s < 0? 0 :s;
                })
                :
                Promise.resolve()
            ).then(function() {
                return routerEventMgr.dispatch('to-begin').then(function (evt) {
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
                        if (c.scrollPosition !== false)
                            document.body.scrollTop = document.documentElement.scrollTop = c.scrollPosition;
                        if (typeof state === 'boolean' && state === false) {
                            history.replaceState({ initial:true },null);
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
                            history.pushState(state || {},null,urlPath);
                        }
                        return routerEventMgr.dispatch('to-loaded');
                    }).catch(function (e) {
                        if (typeof e === 'boolean' && e === -1600)
                            return;
                        return routerEventMgr.dispatch('to-error', e).then(function() {
                            throw e;
                        });
                    }).catch(function(e) {
                        // replace the url with whatever has managed to load
                        history.replaceState({},null,router.current.getUrl()); 
                        throw e;
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


    var f = function() {
        var w = window.location.pathname.trim().substr(1),
            s = window.location.search.split('&'),
            h = window.location.hash;
        w = w.length? w.replace(/\/+$/, "").split('/') : [];
        return router.to(w,s,h,false);
    };

    window.addEventListener('popstate', function() { f(); });

    if (document.location.protocol !== 'file:') {
        var wl = window.location;
        // add missing slash
        history.replaceState(history.state,null,wl.href.replace(/\/?(\?|#|$)/, '/$1').substr(wl.protocol.length+wl.host.length+2));
        if (wl.pathname.length > 1) {
            events.on('','state.base', function() {
                events.remove(this);
                // do not return, this prevents event aborting
                f();
            });
        }
    }

    return router;
};

})();
