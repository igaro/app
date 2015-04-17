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
        bless = app['core.bless'];

    // ROUTE
    var CoreRouterRoute = function(o) {
        var self = this;
        this.name = o.name,
        this.container =  function(dom) {
            return dom.mk('div',o.container,null,function() {
                this.className = 'route';
                self.wrapper = dom.mk('div',this,null,'wrapper');
                if (typeof o.name === 'string')
                    this.classList.add(o.name.replace(/\./g,'--'));
            });
        }
        bless.call(this,o);
        this.uriPath = [];
        this.children = [];
        this.uriPieces = [];
        this.originalUri = [];
        this.defaultHideChildren=true;
        this.defaultHideParentViewWrapper=true;
        this.defaultShowWrapper=true;
        this.scrollPosition=0;
        this.cssElement=dom.mk('style',dom.head);
    };
    
    CoreRouterRoute.prototype.captureUri = function(c) {
        var p = this.uriPieces = this.originalUri.slice(0,c).map(function(p) {
            return decodeURIComponent(p);
        });
        return p && p.length? p : null;
    };

    CoreRouterRoute.prototype.on = function(name,evt,fn) {
        var deps = [this],
            target = null,
            t;
        if (typeof evt === 'string') {
            t = evt;
        } else {
            if (! evt instanceof Array)
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
        }).join('/');
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

    CoreRouterRoute.prototype.getChildByName = function(name) {
        var pool = this.children;
        for (var i=0; i< pool.length; ++i) {
            if (pool[i].name === name)
                return pool[i];
        }
        return null;
    };

    CoreRouterRoute.prototype.addChildren = function(o) {
        var pool = this.children,
            self = this,
            path = this.path,
            silent=o.silent,
            arr = [];
        return new Promise(function(resolve,reject) {
            o.list.map(function(name) {
                var g,
                    doAction = [];
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
                    var provider = router.getProviderForPath(g.path);
                    if (! provider) 
                        throw new Error('No Route provider for path!');
                    g.url = provider.url;
                    doAction = [provider.fetch(g).then(
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
                        pool.push(g);
                        g.managers.event
                            .on('destroy', function() {
                                pool.splice(pool.indexOf(g), 1);
                            });
                        return self.managers.event.dispatch('addChildren',g);
                    })];
                }
                return Promise.all(doAction).then(function() {
                    g.originalUri = o.uri;
                    return g.managers.event.dispatch('enter').then(function() {
                        if (!g._initilized)
                            return g.managers.event.dispatch('init').then(function() {
                                g._initilized = true;
                            });
                    }).then(function() {
                        if (g.defaultShowWrapper)
                            g.managers.dom.show(g.wrapper);
                        if (g.defaultHideChildren) 
                            g.hideChildren();
                        if (g.defaultHideParentViewWrapper) 
                            g.managers.dom.hide(g.parent.wrapper);
                        return g;
                    });
                }).catch(function (e) {
                    g.destroy();
                    throw e;
                });
            }).reduce(function(sequence, cP) {
                return sequence.then(function() {
                    return cP;
                }).then(function(model) {
                    arr.push(model);
                    if(arr.length===o.list.length) 
                        resolve(arr);
                }).catch(function(e) {
                    reject(e);
                });
            }, Promise.resolve());
        });
    };

    CoreRouterRoute.prototype.removeChildren = function() {
        return Promise.all(this.children.map(function (m) { 
            return m.destroy(); 
        }));
    };
    
    CoreRouterRoute.prototype.hideChildren = function() {
        this.children.forEach(function (m) { 
            m.hide(); 
        });
    };

    // PROVIDER
    var routerProvider = function(o) {


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
            this.providers.push(o);
        },
        
        to : function(path, search, hash, state) {
            this.requestId++;
            var base = router.base.path.slice(1),
                ra = path? base.concat(path) : base,
                model = this.root, 
                self = this, 
                c=this.current, 
                v = this.requestId,
                routerEventMgr = router.managers.event;
               // action=[];
            //if (c) {
                //if (c.scrollPosition !== false) 
                //    c.scrollPosition = document.body.scrollTop || document.documentElement.scrollTop;
            var putHistory = function() {
            };
            return (c
                ?
                c.managers.event.dispatch('leave')
                :
                Promise.resolve()
            ).then(function() {
                return routerEventMgr.dispatch('to-begin').then(function (evt) {
                    return ra.reduce(function(a,b,i) {
                        return a.then(function() {
                            return model.addChildren({
                                    list:[ra[i]],
                                    uri : ra.slice(i+1),
                                    silent : true
                            }).then(function(m) {
                                    // abort the load, another request has since came in
                                    if (self.requestId !== v) 
                                        throw -1600;
                                    c = self.current = model = m[0];
                                    i += model.uriPieces.length;
                                    model.uriPath = ra.slice(base.length,i+1);
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
                            var urlPath = path.map(function(f) {
                                return encodeURIComponent(f);
                            }).join('/');
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
                            history.pushState(state || {},null,'/'+urlPath);
                        }
                        return routerEventMgr.dispatch('to-loaded');
                    }).catch(function (e) {
                        if (typeof e === 'boolean' && e === -1600)
                            return;
                        return routerEventMgr.dispatch('to-error', e).then(function() {
                            throw e;
                        });
                    });
                });

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

    window.addEventListener('scroll', function(evt) {
        var s = document.body.scrollTop || document.documentElement.scrollTop;
        if (s < 0) 
            s=0;
        if (router.current) 
            router.current.scrollPosition = s;
        document.body.setAttribute('scrollposition',s);
    });
    document.body.setAttribute('scrollposition',0);

    var f = function() {
        var w = window.location.pathname.trim().substr(1),
            s = window.location.search.split('&'),
            h = window.location.hash;
        w = w.length? w.replace(/\/+$/, "").split('/') : [];
        return router.to(w,s,h,false);
    };

    window.addEventListener('popstate', function() { f(); });

    // load route from url if not served from fs
    if (document.location.protocol !== 'file:') {
        events.on('','state.root', function() {
            events.remove(this);
            return router.to([],null,null,false).then(function() {
                var p = [];
                if (window.location.pathname.length > 1)
                    p.push(f());
                return Promise.all(p).then(function() {
                    events.remove(this);
                    events.on('','state.complete');
                });
            });
        });
    }

    return router;
};

})();
