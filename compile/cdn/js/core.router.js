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
        bless.call(this,{
            name:o.name,
            parent:o.parent? o.parent : null
        });
        var self = this,
            name = this.name,
            parent = this.parent;
        this.meta = {};
        this.uriPath = name.length?
            parent? parent.uriPath.slice(0).concat(name) : [name]
            :
            []
        ;
        this.children = [];
        this.uriPieces = [];
        this.originalUri = [];
        this.displayCount=0;
        this.defaultHideChildren=true;
        this.defaultHideParentViewWrapper=true;
        this.isVisible=false;
        this.autoShow=true;
        this.scrollPosition=0;
        this.displayPath=[];
        this.container = dom.mk('div',null,null,function() {
            this.className = 'route';
            if (o.name)
                this.classList.add(o.name);
            self.wrapper = dom.mk('div',this,null,'wrapper');
            dom.hide(this);
            this.setAttribute('displaycount',0);
            if (typeof name === 'string' && name.length)
                this.classList.add(name.replace(/\./g,'--'));
        });
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
        return this.uriPath.map(function (o) {
            return encodeURIComponent(o);
        }).join('/');
    };

    CoreRouterRoute.prototype.hide = function() {
        this.managers.dom.hide(this.container);
        this.isVisible=false;
        return this.managers.event.dispatch('hide');
    };

    CoreRouterRoute.prototype.show = function(o) {
        var c=this.container;
        this.managers.dom.show(c);
        c.setAttribute('displaycount',this.displayCount);
        this.displayCount++;
        this.managers.dom.show(this.wrapper);
        this.isVisible=true;
        return this.managers.event.dispatch('show'); 
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
                if (! container)
                    return;
                if (typeof container === 'object' && (! (container instanceof Node))) {
                    if (! container.container)
                        throw { error:'Promise returned an object without a container element.', sequence:sequence, value:container };
                    container = container.container;
                }
                if (! (container instanceof Node)) 
                    throw { error:'Promise container is not a DOM element.', sequence:sequence, value:container };
                o.container.appendChild(container);
            });
        }, Promise.resolve());
    };

    CoreRouterRoute.prototype.setMeta = function(n,v) {
        this.meta[n] = v;
        return this.managers.event.dispatch('setMeta', { name:n, value:v });
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
                        name:name
                    });
                    var provider = router.getProvider(g.path);
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
                        g.managers.event.on('destroy', function() {
                            pool.splice(pool.indexOf(g), 1);
                        });
                        return self.managers.event.dispatch('addChildren',g);
                    })];
                }
                return Promise.all(doAction).then(function() {
                    g.originalUri = o.uri;
                    return g.managers.event.dispatch('enter').then(function() {
                        var act = g._initilized? [] : [g.managers.event.dispatch('init')];
                        return Promise.all(act).then(
                            function() {
                                g._initilized = true;
                                return g;
                            }
                        );
                    });
                }).catch(function (e) {
                    g.destroy();
                    throw e;
                });
            }).reduce(function(sequence, cP) {
                return sequence.then(function() {
                    return cP;
                }).then(function(model) {
                    if (model.defaultHideChildren) 
                        model.hideChildren();
                    if (model.defaultHideParentViewWrapper) 
                        dom.hide(model.parent.wrapper);
                    if (! model.container.parentNode) {
                        var p = model.parent.container;
                        if (o.before) {
                            p.insertBefore(model.container,o.before.container);
                        } else {
                            p.appendChild(model.container);
                        }
                    }
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

    // CONTROLLER
    var router = {
        requestId : 0,
        base:null,
        current:null,
        isAtBase : function() {
            return this.current === this.base;
        },
        providers : [],
        getProvider : function(path) {
            var providers = this.providers;
            for (var i=providers.length-1; i>=0; --i) {
                if (providers[i].handles(path)) 
                    return providers[i];
            }
        },
        addProvider : function(o) {
            o.parent = this;
            var providers = this.providers;
            bless.call(o, {
                name:'provider'
            });
            o.managers.event.on('destroy', function() {
                providers.splice(providers.indexOf(o), 1);
            });
            providers.push(o);
        },
        to : function(path, search, hash, state) {
            this.requestId++;
            var base = router.base.path.slice(1),
                ra = path? base.concat(path) : base,
                model = this.root, 
                self = this, 
                c=this.current, 
                v = this.requestId,
                routerEventMgr = router.managers.event,
                action=[];
            if (c) {
                if (c.scrollPosition !== false) 
                    c.scrollPosition = document.body.scrollTop || document.documentElement.scrollTop;
                action = [c.managers.event.dispatch('leave')];
            }
            return Promise.all(action).then(function() {
                var putHistory = function() {
                    var model = router.current;
                    if (typeof state === 'boolean' && state === false) {
                        history.replaceState({ initial:true },null);
                    } else {
                        var urlPath = model.path.slice(router.base.path.length).map(function(f) {
                            return encodeURIComponent(f);
                        }).join('/');
                        if (search) {
                            urlPath += '?' + search.map(function (f) {
                                return encodeURIComponent(f[0]) + '=' + encodeURIComponent(f[1]);
                            });
                        }
                        if (hash)
                            urlPath += '#'+hash;
                        history.pushState(state || {},null,urlPath);
                    }
                };
                return routerEventMgr.dispatch('to-begin').then(function (evt) {
                    if (evt && evt.stopImmediatePropagation)
                        return;
                    return new Promise(function(resolve) {
                        var uid = self.requestId,
                            t = function (at) {
                                model.addChildren({ 
                                    list:[ra[at]],
                                    uri : ra.slice(at+1),
                                    silent : true
                                }).then(
                                    function(m) {
                                        // abort the load, another request has since came in
                                        if (uid !== v) 
                                            return;
                                        self.current = model = m[0];
                                        at += model.uriPieces.length;
                                        model.uriPath = ra.slice(base.length,at+1);
                                        model.show();
                                        return routerEventMgr.dispatch('to-in-progress',model).then(function() {
                                            if (at < ra.length-1) { 
                                                t(at+1); 
                                                return; 
                                            }
                                            if (model.scrollPosition !== false) 
                                                document.body.scrollTop = document.documentElement.scrollTop = model.scrollPosition;
                                            resolve();
                                            putHistory();
                                            return routerEventMgr.dispatch('to-loaded');
                                        });
                                    }, 
                                    function(e) {
                                        putHistory();
                                        resolve(e);
                                        return routerEventMgr.dispatch('to-error', { error:e, child:ra[at] });
                                    }
                                );
                            };
                        t(0);
                    });
                });

            });
            
        }
    };

    bless.call(router, {
        name:'core.router'
    });
    
    router.root = new CoreRouterRoute({
        name:'route'
    });
    router.managers = router.root.managers;

    // remove 

    // default current to root
    var mrv = router.current = router.root;
    mrv.container.className = 'core-router';
    mrv.show();
    document.body.appendChild(mrv.container);

    window.addEventListener('scroll', function(evt) {
        var s = document.body.scrollTop || document.documentElement.scrollTop;
        if (s < 0) 
            s=0;
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
