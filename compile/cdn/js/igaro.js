//# sourceURL=igaro.js

(function () {

    "use strict";

    var app = {};

    // conf is in a global literal. Move ref into private then undef it.
    var appConf = __igaroapp; //jshint ignore:line
    __igaroapp = undefined; //jshint ignore:line

    return Promise.resolve().then(function () {

        var modules = [],
            libs = appConf.libs;

        // local libraries
        if (libs.local && document.location.protocol === 'file:')
            modules.push.apply(modules,libs.local);

        // network libraries
        if (libs.network && document.location.protocol !== 'file:')
            modules.push.apply(modules,libs.network);

        // touch libraries
        var maxTouchPoints = window.navigator.maxTouchPoints || window.navigator.msMaxTouchPoints;
        if (libs.touch && ((maxTouchPoints === undefined && 'ontouchstart' in window) || (typeof maxTouchPoints === 'number' && maxTouchPoints > 1)))
            modules.push.apply(modules,libs.touch);

        // fonts
        if (libs.fonts) {
            var b,d,e,f,g,
                h=document.body,
                a=document.createElement("div");
            a.innerHTML='<span style="'+["position:absolute","width:auto","font-size:128px","left:-99999px"].join(" !important;")+'">'+(new Array(100)).join("wi")+"</span>";
            a=a.firstChild;
            b=function(b){
                a.style.fontFamily=b;
                h.appendChild(a);
                g=a.clientWidth;
                h.removeChild(a);
                return g;
            };
            d=b("monospace");
            e=b("serif");
            f=b("sans-serif");
            libs.fonts.forEach(function (font) {
                var a = font.name;
                if (! (d!==b(a+",monospace") || f!==b(a+",sans-serif") ||e!==b(a+",serif")))
                    modules.push(font.module);
            });
        }

        // further modules - must inc conf
        modules.push.apply(modules,libs.load);

        // core.debug: built-in
        (function() {
            var CoreDebugMgr = function(parent) {
                this.parent = parent;
            };
            CoreDebugMgr.prototype.log = function(e,evt) {
                return debug.log.append({ error:e, scope:this.parent }, this.parent.path, evt);
            };
            CoreDebugMgr.prototype.handle = function(e) {
                return debug.handle({ error:e, scope:this.parent }, this.parent.path);
            };
            CoreDebugMgr.prototype.destroy = function() {
                this.parent = null;
            };
            var debug = app['core.debug'] = {
                developer : appConf.debug,
                log : {
                    append : function(value,path,event) {
                        if (window.console && debug.developer) {
                            var p = path instanceof Array? path.join('.') : path;
                            if (event)
                                p += ':'+event;
                            console.error(p,value);
                        }
                        return events.dispatch('core.debug','log.append',{ path:path, event:event, value:value });
                    }
                },
                handle : function(value,path,event) {
                    return events.dispatch('core.debug','handle', { path:path, value:value, event:event });
                },
                createMgr : function(parent) {
                    return new CoreDebugMgr(parent);
                }
            };
        })();

        // core.events: built-in
        (function() {
            var debug = app['core.debug'];
            var events = app['core.events'] = {
                pool : {},
                on : function(name,evt,fn,o) {
                    var self = this;
                    if (name instanceof Array) {
                        return name.forEach(function (n) {
                            self.on(n,evt,fn,o);
                        });
                    }
                    var target = null,
                        deps = [],
                        ev;
                    if (typeof evt === 'object') {
                        ev = evt.shift();
                        if (evt.length) {
                            target = evt.shift();
                            if (target)
                                deps.push(target);
                            if (evt.length)
                                deps.concat(evt.shift());
                        }
                    } else {
                        ev = evt;
                    }
                    var pool = this.pool,
                        prepend = o && o.prepend === true,
                        p = { fn:fn, target:target, deps:deps, name:name, evt:ev };
                    if (! pool[name])
                        pool[name] = {};
                    if (! pool[name][ev])
                        pool[name][ev] = [];
                    var m = pool[name][ev];
                    if (prepend) {
                        m.unshift(p);
                    } else {
                        m.push(p);
                    }
                },

                // removes dependencies from events and the event itself if the dependency is a target.
                clean : function(dep, name, event) {
                    var pool = this.pool,
                    t = function(name) {
                        var d = pool[name];
                        var h = function(event) {
                            var m = d[event];
                            m.forEach(function(x,i) {
                                x.deps.splice(x.deps.indexOf(dep), 1);
                                if (x.target === dep)
                                    m.splice(i,1);
                            });
                        };
                        if (! event) {
                            Object.keys(pool[name]).forEach(h);
                        } else {
                            h(event);
                        }
                    };
                    if (typeof name !== 'string') {
                        Object.keys(pool).forEach(t);
                    } else {
                        t(name);
                    }
                    return this;
                },

                // remove an event by function
                remove : function(fn,name,event) {
                    var obj = fn;
                    var self = this;
                    if (fn instanceof Array) {
                        fn.forEach(function (f) {
                            self.remove(f,name,event);
                        });
                        return;
                    }
                    var pool = this.pool,
                    t = function(name) {
                        var d = pool[name];
                        var h = function(event) {
                            var p = d[event];
                            for (var i=0; i < p.length; ++i) {
                                if ((obj && p[i] !== obj) || (! obj && p[i].fn !== fn))
                                    continue;
                                p.splice(i,1);
                                break;
                            }
                        };
                        if (! event) {
                            Object.keys(pool[name]).forEach(h);
                        } else {
                            h(event);
                        }
                    };
                    if (typeof name !== 'string') {
                        Object.keys(pool).forEach(t);
                    } else {
                        t(name);
                    }
                    return this;
                },
                dispatch : function(name, evt, params) {
                    var pool = this.pool,
                        self = this,
                        target = null,
                        pn = pool[name],
                        toCall = [];
                    if (evt instanceof Array) {
                        target=evt[1];
                        evt = evt[0];
                    }
                    if (! pn || ! pn[evt])
                        return Promise.resolve();
                    pn[evt].forEach(function(t) {
                        if (! t.target || target === t.target)
                            toCall.push(t);
                    });
                    return toCall.reduce(function(a,t) {
                        return a.then(function() {
                            var r = null;
                            if (! t || ! t.fn)
                                return;
                            try {
                                r = t.fn.call(t, params);
                            } catch(e) {
                                if (window.console && debug.developer)
                                    console.error(e, t, t.fn);
                                throw e;
                            }
                            var handleReturn = function(v) {
                                if (typeof v !== 'object')
                                    return;
                                if (v.removeEventListener)
                                    self.remove(t.fn,name,evt);
                                if (v.stopImmediatePropagation)
                                    throw v;
                            };
                            if (r instanceof Promise)
                                return r.then(function(a) {
                                    handleReturn(a);
                                });
                            handleReturn(r);
                        });
                    }, Promise.resolve()).catch(function(e) {
                        if (typeof e !== 'object' || ! e.stopImmediatePropagation)
                            throw {
                                name:name,
                                process:evt,
                                params:params,
                                target:target,
                                error:e,
                            };
                    });
                }
            };
            var CoreEventMgr = function(x) {
                this.deps = [];
                if (! x)
                    throw new Error('Event Manager must represent an object.');
                this.x = x;
            };
            var appendDeps = function() {
                var selfdeps = this.deps;
                Array.prototype.slice.call(arguments).forEach(function (arg) {
                    if (arg instanceof CoreEventMgr) {
                        Array.prototype.push.apply(selfdeps, arg.deps);
                    } else if (arg instanceof Array) {
                        Array.prototype.push.apply(selfdeps, arg);
                    } else {
                        selfdeps.push(arg);
                    }
                });
                return this;
            };
            CoreEventMgr.prototype.extend = function(deps) {
                var c = new CoreEventMgr(this.x);
                appendDeps.call(c,this.deps);
                appendDeps.call(c,deps);
                return c;
            };
            CoreEventMgr.prototype.createMgr = function(x) {
                var c = new CoreEventMgr(x);
                return appendDeps.call(c,this.x);
            };
            CoreEventMgr.prototype.on = function(evt,fn,o) {
                var self = this;
                if (! (evt instanceof Array))
                    evt = [evt];
                evt.forEach(function(v) {
                    events.on(self.x.name,[v,self.x,self.deps],fn,o);
                });
                return this;
            };
            CoreEventMgr.prototype.remove = function(fn,evt) {
                events.remove(fn,this.x.name,evt);
                return this;
            };
            CoreEventMgr.prototype.clean = function(dep,evt) {
                events.clean(dep,this.x.name,evt);
                return this;
            };
            CoreEventMgr.prototype.dispatch = function(evt,value) {
                var obj = this.x;
                if (! obj && console)
                    console.error({ error:'EventMgr represents no object.', mgr:this });
                var parent = obj.parent,
                    x = {
                        value:value,
                        x:obj
                    };
                return events.dispatch(obj.name,[evt,obj],x).then(function(o) {
                    // send up the chain?
                    if (typeof o === 'object' && (o.stopPropagation || o.stopImmediatePropagation))
                        return o;
                    if (parent && ! obj.asRoot)
                        return parent.managers.event.dispatch(obj.name+'.'+evt, x, obj).then(function() {
                            return o;
                        });
                    return o;
                });
            };
            CoreEventMgr.prototype.destroy = function() {
                this.x = null;
                return Promise.resolve();
            };
            events.createMgr = function(x) {
                return new CoreEventMgr(x);
            };
        })();

        // core.dom: built in
        (function() {
            var events = app['core.events'],
                pQ = function(o) {
                    if (!(o instanceof HTMLElement || o instanceof DocumentFragment) && o.container)
                        return o.container;
                    return o;
                };
            var CoreDomMgr = function(parent) {
                this.parent = parent;
            };
            CoreDomMgr.prototype.mk = function(t,o,c,m) {
                var r = dom.mk.call(this,t,o,c,m);
                this.parent.managers.event.extend(r).on('destroy', function() {
                    return dom.rm(r);
                });
                return r;
            };
            CoreDomMgr.prototype.destroy = function() {
                this.parent = null;
                return Promise.resolve();
            };
            var dom = app['core.dom'] = {
                head : document.getElementsByTagName('head')[0],
                mk : function(t,o,c,m) {
                    var r,
                        i,
                        self = this,
                        type = t.indexOf('[');
                    if (type !== -1) {
                        r = document.createElement(t.substr(0,type));
                        r.type = t.slice(type+1,-1);
                    } else {
                        r = document.createElement(t);
                    }
                    if (t === 'a')
                        r.href='';
                    if (o && typeof o === 'object') {
                        if (o instanceof HTMLElement || o instanceof DocumentFragment) {
                            o.appendChild(r);
                        } else if (o.prepend) {
                            i.parentNode.insertBefore(r,i.parentNode.firstChild);
                        } else if (o.insertBefore) {
                            i = o.insertBefore;
                            if (!(i instanceof HTMLElement))
                                i = i.container;
                            i.parentNode.insertBefore(r,i);
                        } else if (o.insertAfter) {
                            i = o.insertAfter;
                            if (!(i instanceof HTMLElement))
                                i = i.container;
                            i.parentNode.insertBefore(r,i.nextSibling);
                        } else if (o.container) {
                            o.container.appendChild(r);
                        }
                    }
                    switch (typeof m) {
                        case 'string' :
                            r.className=m;
                            break;
                        case 'function' :
                            m.call(r);
                            break;
                    }
                    if (typeof c !== 'undefined' && c !== null) {
                        if (typeof c === 'function') {
                            c = c(self);
                        } else if (c instanceof Array) {
                            var d = document.createDocumentFragment();
                            c.forEach(function(k) {
                                d.appendChild(k);
                            });
                            c=d;
                        }
                        if (c !== null && typeof c !== 'undefined')
                            dom.setContent(r,c);
                    }
                    return r;
                },
                setPlaceholder : function(r,l) {
                    var f = r.igaroPlaceholderFn;
                    var language = app['core.language'];
                    if (! language)
                        throw new Error('core.dom -> core.language is not loaded.');
                    var xMgr = language.managers.event;
                    if (f)
                        xMgr.clean(r.igaroPlaceholderFn,'setEnv');
                    f = r.igaroPlaceholderFn = function() {
                        r.placeholder = language.mapKey(l);
                    };
                    xMgr.extend(r).on('setEnv', f);
                    f();
                },
                hide : function(r,v) {
                    if (! (r instanceof Node))
                        throw new Error('No DOM element supplied');
                    if (typeof v === 'boolean' && v === false)
                        return this.show(r);
                    r.classList.add('core-dom-hide');
                },
                isHidden : function(r) {
                    var t = r;
                    while (t.parentNode && ! t.classList.contains('core-dom-hide')) {
                        t = t.parentNode;
                    }
                    if (! (t instanceof HTMLDocument))
                        return true;
                    var style = window.getComputedStyle(r);
                    return style.visibility === 'hidden' || style.display === 'none';
                },
                toggleVisibility : function(r) {
                    if (! (r instanceof Node))
                        throw new Error('No DOM element supplied');
                    return this.hide(r,! r.classList.contains('core-dom-hide'));
                },
                show : function(r) {
                    if (! (r instanceof Node))
                        throw new Error('No DOM element supplied');
                    r.classList.remove('core-dom-hide');
                },
                offset : function(r) {
                    if (! (r instanceof Node))
                        throw new Error('No DOM element supplied');
                    var x = 0,
                        y = 0;
                    while(r) {
                        x += (r.offsetLeft - r.scrollLeft + r.clientLeft);
                        y += (r.offsetTop - r.scrollTop + r.clientTop);
                        r = r.offsetParent;
                    }
                    return { x:x, y:y };
                },
                append : function(r,c,o) {
                    var self = this;
                    if (c instanceof Array)
                        return c.forEach(function(a) {
                            self.append(r,a,o);
                        });
                    r = pQ(r);
                    c = pQ(c);
                    if (o && o.insertBefore) {
                        r.insertBefore(c,pQ(o.insertBefore));
                    } else if (o && o.insertAfter) {
                        var insertAfter = pQ(o.insertAfter);
                        if (insertAfter.nextElementSibling) {
                            r.insertBefore(c, insertAfter.nextElementSibling);
                        } else {
                            r.appendChild(c);
                        }
                    } else {
                        r.appendChild(c);
                    }
                },
                setContent : function(r,c,o) {
                    if (! o)
                        this.purge(r,true);
                    r.innerHTML = '';
                    var lf = r.igaroLangFn;
                    if (lf) {
                        app['core.language'].managers.event.clean(r);
                        delete r.igaroLangFn;
                    }
                    if (typeof c === 'object') {
                        if (c instanceof HTMLElement || c instanceof DocumentFragment) {
                            r.appendChild(c);
                        } else {
                            // language literal
                            var language = app['core.language'];
                            if (! language)
                                throw new Error('core.dom -> core.language is not loaded.');
                            var f = r.igaroLangFn = function() {
                                if (r.nodeName === 'META') {
                                    r.content = language.mapKey(c);
                                } else if (! (r.nodeName === 'INPUT' && r.type && r.type === 'submit') && 'innerHTML' in r) {
                                    r.innerHTML = language.mapKey(c);
                                } else if ('value' in r) {
                                    r.value = language.mapKey(c);
                                }
                            };
                            language.managers.event.extend(r).on('setEnv', f);
                            f();
                        }
                    } else {
                        r.innerHTML = c;
                    }
                },
                purge : function(element,leaveRoot) {
                    var self = this,
                        node = element.lastChild;
                    while (node) {
                        self.purge(node);
                        events.clean(node);
                        node = node.lastChild;
                    }
                    if (! leaveRoot) {
                        self.rm(element);
                        events.clean(element);
                    }
                },
                empty : function(element) {
                    while (element.firstChild)
                        element.removeChild(element.firstChild);
                    element.innerHTML = '';
                },
                rm : function(element) {
                    var p = element.parentNode;
                    if (p)
                        p.removeChild(element);
                },
                sort : function(o) {
                    var slice = o.slice,
                        on = o.on || function(o) { return o.innerHTML; },
                        nodes = Array.prototype.slice.call(o.nodes || o.root.childNodes),
                        root = o.root || (o.nodes.length? o.nodes[0].parentNode : null);
                    if (! root)
                        return;
                    if (slice)
                        nodes = nodes.slice(slice[0],slice[1]);
                    var insertBefore = nodes[nodes.length-1].nextElementSibling;
                    nodes = nodes.sort(function(a, b) {
                        a = on(a);
                        b = on(b);
                        return a === b? 0: (a > b ? 1 : -1);
                    });
                    if (o.reverse)
                        nodes = nodes.reverse();
                    nodes.forEach(function (o) {
                        root.insertBefore(o,insertBefore);
                    });
                },
                createMgr : function(parent) {
                    return new CoreDomMgr(parent);
                }
            };
        })();

        // core.object: built in
        (function() {
            var events = app['core.events'],
                dom = app['core.dom'];
            var CoreObjectMgr = function(parent) {
                this.parent = parent;
            };
            CoreObjectMgr.prototype.create = function(t,o) {
                if (! o)
                    o = {};
                if (typeof t === 'string')
                    t = { name:t };
                var Amd = app['instance.amd'],
                    parent = this.parent,
                    name = t.fullname? t.fullname : 'instance.'+t.name,
                    p = {
                        modules : [{ name: name+'.js' }],
                        repo : t.repo? t.repo : null
                    };
                return new Amd({ parent:parent }).get(p).then(function () {
                    o.parent = parent;
                    var i = new app[name](o);
                    if (! i.init)
                        throw { module:name, error:'No init() constructor' };
                    return i.init(o).then(function() {
                        return i;
                    });
                });
            };
            CoreObjectMgr.prototype.destroy = function() {
                this.parent = null;
                return Promise.resolve();
            };

            app['core.object'] = {
                arrayInsert : function(a,v,o) {
                    if (! o)
                        o = {};
                    if (o.prepend) {
                        a.unshift(v);
                    } else if (o.insertBefore) {
                        a.splice(a.indexOf(o.insertBefore)-1,0,v);
                    } else if (o.insertAfter) {
                        a.splice(a.indexOf(o.insertAfter),0,v);
                    } else {
                        a.push(v);
                    }
                },
                createMgr : function(parent) {
                    return new CoreObjectMgr(parent);
                },
                promiseSequencer : function(o,fn) {
                    var r=[];
                    return o.reduce(function(a,b) {
                        return a.then(function() {
                            return fn(b).then(function(g) {
                                r.push(g);
                                return g;
                            });
                        });
                    }, Promise.resolve()).then(function() {
                        return r;
                    });
                },
                bless :  function(o) {
                    if (!o)
                        o = {};
                    var self = this,
                        name = this.name,
                        managers = this.managers || [],
                        parent = this.parent = o.parent,
                        path = this.path = [name],
                        container = this.container,
                        thisManagers = this.managers = {},
                        children = this.children,
                        asRoot = this.asRoot;
                    this.stash = o.stash || {};
                    // build path using parents?
                    if (! asRoot) {
                        var x = this;
                        while (x.parent) {
                            path.unshift(x.parent.name);
                            x = x.parent;
                            if (x.asRoot)
                                break;
                        }
                    }
                    // append managers
                    var mgrs = [
                        ['event',parent?parent.managers.event : events],
                        ['debug',app['core.debug']],
                        ['dom',app['core.dom']],
                        ['object',app['core.object']]
                    ].concat(Object.keys(managers).map(function(k) {
                        return [k,managers[k]];
                    })).map(function (o) {
                        var mgr = thisManagers[o[0]] = o[1].createMgr(self);
                        return mgr;
                    });

                    // create child arrays
                    if (children) {
                        var eventMgr = self.managers.event;
                        Object.keys(children).forEach(function (k) {
                            var child = children[k],
                                a = self[k] = [];
                            eventMgr.on(child+'.destroy', function(s) {
                                a.splice(a.indexOf(s.value.x),1);
                            });
                        });
                        delete this.children;
                    }
                    // parent->child autodestroy
                    if (parent)
                        parent.managers.event.on('destroy', function() {
                            return self.destroy();
                        });
                    var thisMgrsEvt = thisManagers.event;
                    this.destroy = function() {
                        // purge container beforehand to prevent any reapply
                        if (self.container) {
                            dom.purge(self.container);
                            delete self.container;
                        }
                        return thisMgrsEvt.dispatch('destroy').then(function() {
                            self.destroyed = true;
                            events.clean(self);
                            return Promise.all(mgrs.map(function(o) {
                                return o.destroy();
                            })).then(function() {
                                delete self.parent;
                                return ;
                            });
                        });
                    };
                    this.disable = function(v) {
                        v = this.disabled = ! (typeof v === 'boolean' && ! v);
                        var container = self.container;
                        if (container) {
                            container.setAttribute('disabled',v);
                            container.setAttribute('inert',v);
                        }
                    };
                    if (container) {
                        if (typeof container === 'function')
                            self.container = container = container(self.managers.dom);
                        if (asRoot)
                            container.classList.add(name.replace(/\./g,'-'));
                        this.hide = function(v) {
                            dom.hide(container,v);
                        };
                        this.show = function() {
                            dom.show(container);
                        };
                        if (o.hidden)
                            this.hide();
                    }
                    if (o.disabled)
                        return this.disable();
                }
            };
        })();

        // instance.xhr: built-in
        (function() {
            if (typeof XMLHttpRequest === 'undefined')
                throw {
                    error: {
                        incompatible:true,
                        noobject:'XMLHttpRequest'
                    }
                };
            var setBits = function(p) {
              if (p.res)
                this.res = p.res;
              if (p.headers)
                this.headers = p.headers;
              if (p.vars)
                this.vars = p.vars;
              if (typeof p.withCredentials === 'boolean')
                this.withCredentials = p.withCredentials;
              if (p.form)
                this.setForm(p.form);
              if (typeof p.silent === 'boolean')
                this.silent = p.silent;
              if (p.stash)
                this.stash = p.stash;
              if (typeof p.expectedContentType !== 'undefined')
                this.expectedContentType = p.expectedContentType;
            };
            var bless = app['core.object'].bless;
            var InstanceXhr = function(o) {
                this.name = 'instance.xhr';
                this.asRoot = true;
                bless.call(this,o);
                var self = this,
                    xhr = this.xhr = new XMLHttpRequest(),
                    eventMgr = this.managers.event;
                this.res='';
                this.withCredentials=false;
                this.vars = {};
                this.silent = false;
                this.aborted = false;
                this.connectionFailure = false;
                this.headers = {};
                this.formdata = {};
                this.id = Math.floor((Math.random()*9999)+1);
                if (o)
                    setBits.call(this,o);
                xhr.onreadystatechange = function() {
                    if (xhr.readyState !== 4)
                        return;
                    self.lastUrlRequest = self.res;
                    eventMgr.dispatch('response').then(function(o) {
                        if (typeof o === 'object' && o.stopImmediatePropagation)
                            return;
                        var response = (! xhr.responseType) || xhr.responseType.match(/^.{0}$|text/)? xhr.responseText : xhr.response,
                            status = xhr.status;
                        if (status === 0 && ! response.length)
                            self.connectionFalure = true;
                        if (status === 200 || (status === 0 && response.length > 0)) {
                            var cv = xhr.getResponseHeader("Content-Type");
                            if (self.expectedContentType && cv && cv.indexOf('/'+self.expectedContentType) === -1)
                                throw(400);
                            var data = ! cv || cv.indexOf('/json') === -1? response : JSON.parse(response);
                            self._promise.resolve(data,xhr);
                            return eventMgr.dispatch('success');
                        } else {
                            throw(status);
                        }

                    }).catch(function (e) {
                        self._promise.reject({ error:e, x:self });
                        if (! self.silent)
                            return eventMgr.dispatch('error', e);
                    }).then(function() {
                        return eventMgr.dispatch('end');
                    }).catch(function (e) {
                        return self.managers.debug.handle(e);
                    });
                };
                eventMgr.on('destroy',function() {
                    return self.abort();
                });
            };
            InstanceXhr.prototype.init = function() {
                return Promise.resolve();
            };
            InstanceXhr.prototype.send = function() {
                var self = this,
                    action = this.action,
                    xhr = this.xhr,
                    uri = this._uri,
                    t = this.res,
                    isPUTorPOST = /(PUT|POST)/.test(action);
                if (! this._promise)
                    throw new Error('instance.xhr -> Can\t send() before exec(). Send() is only for re-executing a request.');
                xhr.abort();
                return this.managers.event.dispatch('start').then(function() {
                    if (! isPUTorPOST && uri.length) {
                        t += t.indexOf('?') > -1? '&' : '?';
                        t += uri;
                    }
                    xhr.open(action,t,true);
                    xhr.withCredentials = self.withCredentials? true : false;
                    Object.keys(self.headers).forEach (function (k) {
                        var header = self.headers[k];
                        var v = typeof header === 'function'? header() : header;
                        if (v)
                            xhr.setRequestHeader(k,v);
                    });
                    xhr.send(isPUTorPOST? self._uri:null);
                });
            };
            InstanceXhr.prototype.exec = function(action, p) {
                var self = this;
                if (p)
                    setBits.call(this,p);
                this.action = action;
                this.abort();
                this.aborted = false;
                this.connectionFailure = false;
                var vars = typeof self.vars === 'function'? self.vars(): self.vars;
                this._uri = [vars,self.formdata].map(function (l) {
                    return Object.keys(l).map(function (k) {
                        return encodeURIComponent(k)+"="+encodeURIComponent(l[k]);
                    }).join('&');
                }).join('&');
                if (this._uri.length < 2)
                    this._uri = '';
                return new Promise(function(resolve,reject) {
                    self._promise = {
                        resolve : resolve,
                        reject : reject
                    };
                    return self.send().catch(reject);
                });
            };
            InstanceXhr.prototype.get = function(p) {
                return this.exec('GET',p);
            };
            InstanceXhr.prototype.post = function(p) {
                return this.exec('POST',p);
            };
            InstanceXhr.prototype.put = function(p) {
                return this.exec('PUT',p);
            };
            InstanceXhr.prototype.trace = function(p) {
                return this.exec('TRACE',p);
            };
            InstanceXhr.prototype.head = function(p) {
                return this.exec('HEAD',p);
            };
            InstanceXhr.prototype.delete = function(p) {
                return this.exec('DELETE',p);
            };
            InstanceXhr.prototype.options = function(p) {
                return this.exec('OPTIONS',p);
            };
            InstanceXhr.prototype.abort = function() {
                if (this._promise) {
                    this._promise.reject();
                }
                if (this.xhr.readyState === 0)
                    return Promise.resolve();
                this.xhr.abort();
                this.aborted = true;
                var eventMgr = this.managers.event;
                return eventMgr.dispatch('aborted').then(function() {
                    return eventMgr.dispatch('end');
                });
            };
            InstanceXhr.prototype.applyForm = function(form) {
                var fd = this.formdata = {};
                this.headers["Content-Type"] = "application/x-www-form-urlencoded";
                Array.prototype.splice.call(form.elements).forEach(function (l) {
                    if (l.disabled)
                        return;
                    if (l.type === "checkbox" && l.checked) {
                        fd[l.name] = l.checked? 1:0;
                    } else if (l.type === "select-one" && l.selectedIndex > -1) {
                        if (l.options.length)
                            fd[l.name] = l.options[l.selectedIndex].value;
                    } else if (l.type === "select-multiple") {
                        var t=l.options.map(function(s) {
                            return ! s.selected? null : s.value;
                        }).join('\n');
                        if (t.length)
                            fd[l.name] = t;
                    } else {
                        fd[l.name] = l.value.trim();
                    }
                });
            };
            app['instance.xhr'] = InstanceXhr;
        })();

        // instance.amd: built-in
        (function() {
            var repo = appConf.cdn,
                InstanceXhr = app['instance.xhr'],
                events = app['core.events'],
                bless = app['core.object'].bless,
                dom = app['core.dom'],
                head = dom.head,
                workers = [
                    'core.events',
                    'core.object',
                    'core.debug',
                    'core.dom',
                    'instance.xhr',
                    'instance.amd'
                ].map(function(m,i) {
                    return { uid:i*-1-1, done:true, module: { name:m+'.js' }};
                }),
                setBits = function(p) {
                    if (p.modules)
                        this.modules = p.modules;
                    if (p.repo)
                        this.repo = p.repo;
                    if (p.depRepoRevert)
                        this.depRepoRevert = true;
                    if (p.onProgress)
                        this.onProgress = p.onProgress;
                };
            var InstanceAmd = app['instance.amd'] = function(o) {
                this.name='instance.amd';
                this.asRoot = true;
                this.depRepoRevert = false;
                bless.call(this,o);
                this.uid = Math.floor((Math.random() * 9999));
                this.repo = repo;
                if (o)
                    setBits.call(this,o);
            };
            InstanceAmd.prototype.get = function(p) {
                var self = this;
                if (p)
                    setBits.call(this,p);
                return new Promise(function(resolve, reject) {
                    var swrks = self.workers = [];
                    var chkComplete = function() {
                        if (self.workers.every(function (w) {
                            return w.done;
                        })) {
                            return end();
                        }
                    };
                    var workerSucEvt = events.on('instance.amd','worker.success', function(o) {
                        if (swrks.indexOf(o.x) === -1)
                            return;
                        if (self.onProgress)
                            self.onProgress();
                        return chkComplete();
                    });
                    // prevent race checking
                    var checking = false;
                    var amdComEvt = events.on('instance.amd','complete', function(o) {
                        checking = true;
                        if (! checking && o.x !== self)
                            return chkComplete().catch().then(function() {
                                checking = false;
                            });
                        checking = false;
                    });
                    var workerErrEvt = events.on('instance.amd','worker.error', function(o) {
                        if (swrks.indexOf(o.x) !== -1)
                            return end(o);
                    });
                    var end = function(e) {
                        events.remove(workerErrEvt,'instance.amd','worker.error');
                        events.remove(workerSucEvt,'instance.amd','worker.success');
                        events.remove(amdComEvt,'instance.amd','complete');
                        return self.managers.event.dispatch(e? 'error' : 'complete', e).then(function() {
                            if (e) {
                                reject(e);
                            } else {
                                resolve();
                            }
                        });
                    };
                    self.modules.forEach(function (m) {
                        if (typeof m.repo === 'undefined' && repo)
                            m.repo = repo;
                        if (! m.requires)
                            m.requires = [];
                        var wk,
                            n = m.name;
                        // if there's already a worker for this module, find it, else create one
                        if (! workers.some(function (w) {
                            if (w.module.name === n) {
                                wk = w;
                                return true;
                            }
                        })) {
                            wk = new InstanceAmdWorker({
                                module:m,
                                parent:self
                            });
                        }
                        if (! wk.done) {
                            swrks.push(wk);
                            wk.run();
                        } else if (self.onProgress) {
                            self.onProgress();
                        }
                    });
                    chkComplete();
                });
            };
            var InstanceAmdWorker = function(o) {
                this.name = 'instance.amd';
                bless.call(this,o);
                this.uid = Math.floor((Math.random() * 9999));
                var mod = this.module = o.module,
                    modname = this.module.name;
                if (! this.type) {
                    // attempt to discover type from extension
                    var e = /^.+\.([^.]+)$/.exec(modname.toLowerCase());
                    this.type = e === null? '' : e[1];
                }
                var type = this.type;
                this.file = mod.repo+'/'+(mod.nosub? '' : type+'/')+modname;
                if (['css','js'].indexOf(type) === -1)
                    throw new Error('instance.amd can\'t handle file type: '+modname);
                this.done = false;
                workers.push(this);
            };
            InstanceAmdWorker.prototype.run = function() {
                if (this.done || this.running)
                    return;
                this.running = true;
                var xhr = this.xhr = new InstanceXhr(),
                    file = this.file,
                    type = this.type,
                    mod = this.module,
                    eventMgr = this.managers.event,
                    self = this;
                return  eventMgr.dispatch('worker.start').then(function() {
                    return xhr.get({ res:file }).then(function(data) {
                        switch (type) {
                            case 'js':
                                var module = {
                                    requires:[],
                                    exports:null
                                };
                                eval(data);
                                var code = self.code = module.exports ? module.exports : null;
                                return (module.requires.length?
                                    new InstanceAmd().get({
                                        repo:mod.depRepoRevert? repo : mod.repo,
                                        modules:module.requires
                                    })
                                : Promise.resolve()).then(function() {
                                    var u = null,
                                        m = self.module.name,
                                        s = m.substr(0,m.length-3);
                                    if (code)
                                        u = code(app,{ conf:appConf });
                                    return (u instanceof Promise? u : Promise.resolve(u)).then(function (data) {
                                        if (data)
                                            app[s] = data;
                                        return self.loaded();
                                    });
                                });
                            case 'css':
                                dom.mk('style',head,data);
                                return self.loaded();
                        }
                    }).catch(function (e) {
                        return eventMgr.dispatch('worker.error',e);
                    }).then(function(e) {
                        self.running = false;
                        return eventMgr.dispatch('worker.end', e);
                    });
                });
            };
            InstanceAmdWorker.prototype.loaded = function() {
                this.done = true;
                this.xhr = null; // gc
                return this.managers.event.dispatch('worker.success');
            };
        })();

        var InstanceAmd = app['instance.amd'],
            events = app['core.events'];
        // load externals
        return new InstanceAmd().get({ modules:modules }).then(function() {
            var ii = appConf.init;
            if (ii && ii.onProgress)
                ii.onProgress(app,appConf);
            return events.dispatch('','state.init').then(function() {
                if (ii && ii.onReady)
                    ii.onReady(app,appConf);
                return app;
            });
        });

    }).catch(function (e) {
        var ii = appConf.init;
        if (ii && ii.onError)
            ii.onError(app,appConf,e);
        return app['core.debug'].log.append(e);
    }).catch (function(e) {
        // capture error in this handler ... and handle. Ideally shouldn't happen.
        if (console)
            console.error(e);
    });

})();
