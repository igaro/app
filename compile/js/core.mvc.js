module.requires = [
    { name:'core.mvc.css' },
    { name:'core.language.js' }
];

module.exports = function(app) {

    var events = app['core.events'], 
    language = app['core.language'], 
    amd = app['instance.amd'],

    // MODEL
    mvcModel = function(o) {
        var self = this;
        this.path = o.path;
        this.name = o.path.substr(o.path.lastIndexOf('/')+1);
        this.parent = o.parent;
        this.store = {};
        this.meta = new meta(this);
        this.view = new mvcView(this);
        this.children = new children(this);
        this.events = new evts();
    },

    // MODULE INSTANCES
    instances = function(model) {
        this.pool = [];
    };
    instances.prototype.add = function(g,o) {
        var self=this,
        t = typeof g === 'string'? { name:g } : g,
        container = o && o.container? o.container : null;
        if (container) {
            var d = document.createElement('div');
            container.appendChild(d);
            container = d;
            delete o.container;
        }
        return new Promise(function(resolve, reject) {
            var name = t.fullname? t.fullname : 'instance.'+t.name,
            p = { 
                modules : [{ name: name+'.js' }],
                repo : t.repo? t.repo : null
            };
            new amd().get(p).then(function () {
                var i = new app[name](o);
                self.pool.push(i);
                if (container) {
                    container.parentNode.insertBefore(i.container, container);
                    container.parentNode.removeChild(container);
                } else if (g.insertAfter) {
                    if (g.insertAfter.nextElementSibling) {
                        g.insertAfter.parentNode.insertBefore(i.container, g.insertAfter.nextElementSibling);
                    } else {
                        g.insertAfter.parentNode.appendChild(i.container);
                    }
                } else if (g.insertBefore) {
                    g.insertAfter.parentNode.insertBefore(i.container, g.insertBefore);
                }
                resolve(i);
            }).catch(function(e) {
                if (container) {
                    container.parentNode.removeChild(container);
                }
                events.dispatch('core.mvc','view.error',e);
                reject();
            });
        });
    };
    instances.prototype.remove = function(n) {
        this.pool.splice(this.pool.indexOf(n),1);
        if (n.container && n.container.parentNode) {
            n.container.parentNode.removeChild(n.container);
        }
        return null;
    };

    // VIEW
    var head = document.getElementsByTagName('head')[0],
    mvcView = function(model) {
        this.model = model;
        this.displayCount=0;
        this.defaultHideChildren=true;
        this.defaultHideParentViewWrapper=true;
        this.isVisible=false;
        this.autoShow=true;
        this.scrollPosition=0;
        this.instances = new instances();
        var c = this.container = this.createAppend('div',null,null,'core-mvc '+model.name.replace(/\./g,'--')+ ' hide');
        c.setAttribute('displaycount',0);
        this.wrapper = this.createAppend('div',c,null,'wrapper');
        this.cssElement=this.createAppend('style',head);
    };
    mvcView.prototype.hide = function(o) {
        if (o) {
            o.classList.add('hide');
            return;
        }
        var c = this.container;
        this.hide(c);
        this.isVisible=false;
        events.dispatch('core.mvc','view.hidden', this);
    };
    mvcView.prototype.show = function(o) {
        if (o && o.element) {
            o.element.classList.remove('hide');
            return;
        }
        var c=this.container, model=this.model;
        this.show({ element:c });
        c.className = 'core-mvc '+model.name.replace(/\./g,'--');
        c.setAttribute('displaycount',this.displayCount);
        this.displayCount++;
        this.show({ element: this.wrapper });
        this.isVisible=true;
        events.dispatch('core.mvc','view.shown', this); 
    };
    mvcView.prototype.createAppend = function(t,o,c,m) {
        var r, type = t.indexOf('[');
        if (type !== -1) {
            r = document.createElement(t.substr(0,type));
            r.type = t.slice(type+1,-1);
        } else {
            r = document.createElement(t);
        }
        if (t === 'a') {
            r.href='';
        }
        if (o && typeof o === 'object') {
            if (o instanceof HTMLElement || o instanceof DocumentFragment) {
                o.appendChild(r);
            } else {
                if (o.insertBefore) {
                    o.insertBefore.parentNode.insertBefore(r, o.insertBefore);
                } else if (o.insertAfter) {
                    o.insertAfter.parentNode.insertBefore(r, o.insertAfter.nextSibling);
                }
            } 
        }
        if (m) {
            r.className=m;
        }
        if (typeof c !== 'undefined' && c !== null) {
            if (typeof o === 'function') {
                r.appendChild(o());
            } else if (c instanceof Array) {
                c.forEach(function (o) { 
                    if (typeof o === 'function') {
                        o = o();
                    }
                    r.appendChild(o); 
                });
            } else if (typeof c === 'object') {
                if (c instanceof HTMLElement || c instanceof DocumentFragment) {
                    r.appendChild(c);
                } else {
                    // language literal 
                    var f = function() {
                        if (t.substr(0,5) === 'input') {
                            r.value = language.mapKey(c);
                        } else {
                            r.innerHTML = language.mapKey(c);
                        }
                    };
                    this.model.events.on('core.language','code.set', f);
                    f();
                }
            } else {
                r.innerHTML = c;
            }
        }
        return r;
    };
    mvcView.prototype.addSequence = function(o) {
        return o.promises.reduce(function(sequence, cP) {
            return sequence.then(function() {
                return cP;
            }).then(function(content) {
                if (content && content.container) 
                    o.container.appendChild(content.container);
            }).catch(function(e) {
                events.dispatch('core.mvc','view.error',e);
            });
        }, Promise.resolve());
    };

    // META
    var meta = function(model) {
        this.model = model;
        this.pool = {};
    };
    meta.prototype.set = function(n,v) {
        this.pool[n] = v;
        events.dispatch('core.mvc','meta.set', { model:this.model, name:n, value:v });
    };
    meta.prototype.get = function(n) {
        return this.pool[n]? this.pool[n] : null;
    };

    // EVENTS
    var evts = function() {
        this.pool = [];
    };
    evts.prototype.on = function(name,event,fn) {
        events.on(name,event,fn);
        this.pool.push([name,event,fn]);
    };
    evts.prototype.remove = function(fn,name,event) {
        events.remove(fn,name,event);
        var pool = this.pool;
        for(var i=0; i<pool.length;i++) {
            if ((!name || pool[0] === name) && (! event || pool[1] === event) && fn === pool[2]) {
                pool.splice(i,1);
                --i;
            }
        }
    };
    evts.prototype.dispatch = function(name, event, params) {
        events.dispatch(name,event,params);
    };

    // CHILDREN
    var children = function(model) {
        this.model = model;
        this.loaded = [];
    };
    children.prototype.getByName = function(name) {
        for (var i=0; i< this.loaded.length; i++) {
            if (this.loaded[i].name === name) {
                return this.loaded[i];
            }
        }
        return null;
    };
    children.prototype.add = function(o) {
        var loaded=this.loaded, 
        m=this.model, 
        path=m.path,
        onEnd = function(g) {
            events.dispatch('core.mvc','model.load.end',g);
        },
        d = function(name) {
            return new Promise(function(resolve, reject) {
                var g;
                if (! loaded.some(function(y) {
                    if (y.name !== name)
                        return;
                    g = y;
                    return true;
                })) {
                    g = new mvcModel({ parent:m, path:(path.substr(-1,1) == '/'? path.substr(0,-1) : path)+'/'+name });
                } else if (g.cacheLevel === 2) {
                    onEnd(g);
                    resolve(g);
                    return;
                }
                var onError = function(e) {
                    events.dispatch('core.mvc','model.load.error', { model:g, error:e });
                    reject(e);
                    onEnd(g);
                },
                source = mvcCon.source.get(g.path);

                if (! source) 
                    return onError('No MVC source for path!');
                g.url = source.url;
                g.view.path = source.viewPath(g.path);
                if (typeof g.cacheLevel === 'undefined') g.cacheLevel = source.defaultCacheLevel;
                source.fetch({ model:g }).then(
                    function(j) {
                        try {
                            if (j.css) {
                                var e = g.view.cssElement;
                                e.innerHTML = css;
                            }
                            j.js(g);
                            loaded.push(g);
                        }
                        catch(e) {
                            onError(e);
                        }
                        finally {
                            onEnd(g);
                            resolve(g);
                        }
                    },
                    onError
                );
            });
        };
        return new Promise(function(resolve,reject) {
            var arr = [],
            p = o.list.map(d);
            p.reduce(function(sequence, cP) {
                return sequence.then(function() {
                    return cP;
                }).then(function(model) {
                    var v = model.view;
                    if (v.defaultHideChildren) 
                        model.children.hide();
                    if (v.defaultHideParentViewWrapper) 
                        model.parent.view.hide(model.parent.view.wrapper);
                    if (! v.container.parentNode) {
                        if (o.before) {
                            model.parent.view.container.insertBefore(v.container,o.before.view.container);
                        } else {
                            model.parent.view.container.appendChild(v.container);
                        }
                    }
                    arr.push(model);
                    if(arr.length===p.length) 
                        resolve(arr);
                }).catch(function(e) {
                    events.dispatch('core.mvc','model.children.add.error',e);
                    reject(e);
                });
            }, Promise.resolve());
        });

    };
    children.prototype.remove = function(model) {
        if (this.loaded.indexOf(model) === -1) 
            return;
        while (model.children.loaded) { 
            child.children.remove(model.children.loaded[0]); 
        }
        model.view.container.parentNode.removeChild(model.view.container);
        model.meta=model.children=model.view=null; // break circular refs
        model.events.pool.forEach(function (m) { 
            model.remove(m[2],m[0],m[1]); 
        });
        this.instances.forEach(function (m) { 
            if (m && m.destructor) 
                m.destructor(); 
        });
        this.instances.length=0;
        this.loaded.splice(this.loaded.indexOf(model),1);
        events.dispatch('core.mvc','model.removed',model);
        return true;
    };
    children.prototype.hide = function() {
        this.loaded.forEach(function (m) { 
            m.view.hide(); 
        });
    };

    // CONTROLLER
    var mvcCon = {
        current : null,
        requestId : 0,
        root : new mvcModel({ path:'/', parent: { view : { container:document.body }} }),
        source : {
            pool : [],
            append : function(o) {
                this.pool.push(o);
                events.dispatch('core.mvc','source.append',o);
            },
            remove : function(source) {
                var s = this.pool.indexOf(source);
                if (s===-1) return;
                this.pool.splice(s,1);
                events.dispatch('core.mvc','source.remove',source);
            },
            get: function(path) {
                for (var i=this.pool.length-1; i>=0; i--) {
                    if (this.pool[i].handles(path)) return this.pool[i];
                }
            }
        },
        to : function(path, nopushstate) {
            this.requestId++;
            var ra = path.split('/'),
                model = this.root, 
                self = this, 
                c=this.current, 
                v = this.requestId;
            if (c && c.view.scrollPosition !== false) 
                c.view.scrollPosition = document.body.scrollTop || document.documentElement.scrollTop;
            return new Promise(function(resolve, reject) {
                var uid = self.requestId,
                t = function (at) {
                    model.children.add({ 
                        list:[ra[at]]
                    }).then(function(m) {
                        // abort the load, another request has since came in
                        if (uid !== v) return;
                        self.current = model = m[0];
                        var view = model.view;
                        if (view.scrollPosition !== false) 
                            document.body.scrollTop = document.documentElement.scrollTop = view.scrollPosition;
                        view.show();
                        events.dispatch('core.mvc','to.in-progress',model);
                        if (at < ra.length-1) { 
                            t(at+1); return; 
                        }
                        if (! nopushstate && history.pushState && document.location.protocol !== 'file:') 
                            history.pushState({},null,'/'+view.path);
                        resolve();
                        events.dispatch('core.mvc','to.loaded');
                    }, function(e) {
                        events.dispatch('core.mvc','to.error',e);
                        reject(e);
                    });
                };
                t(1);
            });
        }
    },

    mrv = mvcCon.root.view;
    mrv.show();
    mrv.container.className = 'core-mvc';
    document.body.appendChild(mrv.container);

    window.addEventListener('scroll', function(evt) {
        var s = document.body.scrollTop || document.documentElement.scrollTop;
        if (s < 0) s=0;
        document.body.setAttribute('scrollposition',s);
    });
    document.body.setAttribute('scrollposition',0);

    return mvcCon;
};