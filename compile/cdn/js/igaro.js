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

        // common private helpers
        var promiseSequencer = function(o,fn) {
            var r=[];
            return o.reduce(function(a,b,i) {
                return a.then(function() {
                    return Promise.resolve().then(function() {
                        return fn(b,i);
                    }).then(function(g) {
                        r.push(g);
                        return g;
                    });
                });
            }, Promise.resolve()).then(function() {
                return r;
            });
        };

        // core.events: built-in
        (function() {
            var eventEmitters = [];

            var EventEmitter = function(parent) {
                this.events = {};
                this.parent = parent;
                eventEmitters.push(this);
            };

            EventEmitter.prototype.destroy = function() {
                eventEmitters.slice().splice(this,1);
                this.events = {};
                this.parent = null;
                return Promise.resolve();
            };

            EventEmitter.prototype.on = function(evt,fn,o) {
                var self = this;
                if (evt instanceof Array) {
                    return evt.forEach(function (n) {
                        self.on(n,fn,o);
                    });
                }
                var pool = this.events,
                    p = { fn:fn, deps:o && o.deps? o.deps : [] };
                if (! pool[evt])
                    pool[evt] = [];
                var m = pool[evt];
                if (o && o.prepend) {
                    m.unshift(p);
                } else {
                    m.push(p);
                }
                return this;
            };

            // remove an event by function or dependency
            EventEmitter.prototype.remove = function(fn,event) {
                var self = this;
                if (fn instanceof Array) {
                    return fn.forEach(function (f) {
                        self.remove(f,event);
                    });
                }
                var events = this.events;
                (event? [event] : Object.keys(this.events)).forEach(function (key) {
                    events[key].slice(0).forEach(function (evt, i) {
                        if (evt.fn === fn || evt.deps.indexOf(fn) > -1)
                            events[key].splice(i,1);
                    });
                });
            };

            EventEmitter.prototype.dispatch = function(evt, params) {
                var self = this;
                return promiseSequencer(this.events[evt] || [], function(t) {
                    var r = null;
                    try {
                        r = t.fn.call(t, params);
                    } catch(e) {
                        console.error(e, t, t.fn);
                        throw e;
                    }
                    var handleReturn = function(v) {
                        if (typeof v !== 'object')
                            return;
                        if (v.removeEventListener)
                            self.remove(t.fn,evt);
                        if (v.stopImmediatePropagation)
                            throw v;
                    };
                    if (r instanceof Promise)
                        return r.then(function(a) {
                            return handleReturn(a);
                        });
                    handleReturn(r);
                // catch errors which aren't stopImmediatePropagation
                }).catch(function(e) {
                    if (typeof e === 'object' && ! e.stopImmediatePropagation)
                        throw {
                            event:evt,
                            params:params,
                            error:e,
                        };
                }).then(function(rV) {
                    // check not asRoot, is representing an object, that object has a parent, and a Promise didn't return stopPropagation
                    var parent = self.parent;
                    if (! parent || parent.asRoot || ! parent.parent || rV.some(function(p) {
                        return typeof p === 'object' && p.stopPropagation;
                    })) return;
                    // eventMgr representing an object. Propagate to parent eventMmg;
                    var x = {
                        value:params,
                        x:parent
                    };
                    return parent.parent.managers.event.dispatch(parent.name+'.'+evt, x, self);
                });
            };

            app['core.events'] = {
                rootEmitter : new EventEmitter(),
                createMgr : function(parent) {
                    return new EventEmitter(parent);
                },
                clean : function(dep,name) {
                    eventEmitters.forEach(function(eventEmitter) {
                        return eventEmitter.remove(dep,name);
                    });
                }
            };

        })();

        // core.debug: built-in
        (function() {
            var rootEmitter = app['core.events'].rootEmitter;
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
                        return rootEmitter.dispatch('core.debug.log.append',{ path:path, event:event, value:value });
                    }
                },
                handle : function(value,path,event) {
                    return rootEmitter.dispatch('core.debug.handle', { path:path, value:value, event:event });
                },
                createMgr : function(parent) {
                    return new CoreDebugMgr(parent);
                }
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
                this.parent.managers.event.on('destroy', function() {
                    return dom.rm(r);
                }, { deps:[r] });
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
                                if ((! (k instanceof Node)) && k.container)
                                    k = k.container;
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
                        xMgr.remove(f,'setEnv');
                    f = r.igaroPlaceholderFn = function() {
                        r.placeholder = language.mapKey(l);
                    };
                    xMgr.on('setEnv', f, { deps:[r] });
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
                    if (typeof c === 'object') {
                        if (c instanceof HTMLElement || c instanceof DocumentFragment) {
                            r.appendChild(c);
                        } else if (c.hasOwnProperty('container')) {
                            r.appendChild(c.container);
                        } else {
                            var language = app['core.language'];
                            if (! language)
                                throw new Error('core.dom -> core.language is not loaded.');
                            var xMgr = language.managers.event,
                                lf = r.igaroLangFn;
                            if (lf) {
                                xMgr.remove(lf,'setEnv');
                                delete r.igaroLangFn;
                            }
                            var f = r.igaroLangFn = function() {
                                if (r.nodeName === 'META') {
                                    r.content = language.mapKey(c);
                                } else if (! (r.nodeName === 'INPUT' && r.type && r.type === 'submit') && 'innerHTML' in r) {
                                    r.innerHTML = language.mapKey(c);
                                } else if ('value' in r) {
                                    r.value = language.mapKey(c);
                                }
                            };
                            xMgr.on('setEnv', f, { deps:[r] });
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

            var debounceStore=[];

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
                debounce : function(target,timeout) {
                    return new Promise(function(resolve) {
                        var place = function(into) {
                            var ref = setTimeout(function() {
                                resolve();
                                debounceStore.splice(debounceStore.indexOf(into,1));
                            },timeout || 300);
                            if (into) {
                                into.ref = ref;
                            } else {
                                into = { target:target, ref:ref };
                                debounceStore.push(into);
                            }
                        };
                        if (! debounceStore.slice().some(function(o) {
                            if (o.target === target) {
                                clearTimeout(o.ref);
                                place(o);
                                return true;
                            }
                        })) {
                            place();
                        }
                    });
                },
                createMgr : function(parent) {
                    return new CoreObjectMgr(parent);
                },
                promiseSequencer : promiseSequencer,
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
                        ['event',app['core.events']],
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
                            // auto remove destroyed child
                            eventMgr.on(child+'.destroy', function(s) {
                                a.splice(a.indexOf(s.x),1);
                            });
                        });
                        delete this.children;
                    }
                    var thisMgrsEvt = thisManagers.event;
                    // parent->child event propagation
                    if (parent) {
                        var pme = parent.managers.event;
                        // destroy
                        pme.on('destroy', function() {
                            return self.destroy();
                        }, { deps:[self] });
                        // disable
                        pme.on('disable', function() {
                            return thisMgrsEvt.dispatch('disable');
                        }, { deps:[self] });
                    }
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
                        return thisMgrsEvt.dispatch('disable',v);
                    };
                    this.isDisabled = function() {
                        return this.disabled || (this.parent? this.parent.isDisabled() : false);
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
                if (!p)
                    return;
                var type = typeof p;
                if (type === 'string') {
                    this.res = p;
                    return;
                }
                if (type !== 'object')
                    throw new TypeError('Config argument must be an object literal.');
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
                if (p.responseType)
                    this.xhr.responseType = p.responseType;
            };
            var bless = app['core.object'].bless,
                rootEmitter = app['core.events'].rootEmitter;
            var onLoad = function() {
                var self = this,
                    xhr = this.xhr;
                this.response = true;
                this.lastUrlRequest = this.res;
                rootEmitter.dispatch('instance.xhr.response',this).then(function(o) {
                    if (typeof o === 'object' && o.stopImmediatePropagation)
                        return;
                    var response = (! xhr.responseType) || xhr.responseType.match(/^.{0}$|text/)? xhr.responseText : xhr.response,
                        status = xhr.status;
                    if (status === 0 && (! response || response.length === 0))
                        self.connectionFalure = true;
                    if (status === 200 || (status === 0 && response.length > 0)) {
                        var cv = xhr.getResponseHeader("Content-Type");
                        if (self.expectedContentType && cv && cv.indexOf('/'+self.expectedContentType) === -1)
                            throw(400);
                        var data = ! cv || cv.indexOf('/json') === -1? response : JSON.parse(response);
                        self._promise.resolve(data,xhr);
                        return rootEmitter.dispatch('instance.xhr.success',self);
                    } else {
                        throw(status);
                    }

                }).catch(function (e) {
                    return onError.call(self,e);
                }).then(function() {
                    return rootEmitter.dispatch('instance.xhr.end',self);
                }).catch(function (e) {
                    return self.managers.debug.handle(e);
                });
            };
            var onError = function() {
                this.response = true;
                this._promise.reject({ error:e, x:this });
                if (! this.silent)
                    return rootEmitter.dispatch('instance.xhr.error', { x:this, error:e });
            };
            var InstanceXhr = function(o) {
                this.name = 'instance.xhr';
                this.asRoot = true;
                bless.call(this,o);
                var self = this,
                    xhr = this.xhr = new XMLHttpRequest(),
                    response = false,
                    eventMgr = this.managers.event;
                this.res='';
                this.withCredentials=false;
                this.vars = {};
                this.silent = false;
                this.aborted = false;
                this.connectionFailure = false;
                this.headers = {};
                this.response = false;
                this.formdata = {};
                this.id = Math.floor((Math.random()*9999)+1);
                setBits.call(this,o);
                eventMgr.on('destroy',function() {
                    return self.abort();
                });
                // XHR 1
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4)
                        onLoad.call(self);
                };
                // XHR 2
                xhr.onload = function() {
                    onLoad.call(self);
                };
                xhr.onerror = function(e) {
                    onError.call(self,e);
                };
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
                return rootEmitter.dispatch('instance.xhr.start',self).then(function() {
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
                    self.response = false;
                    xhr.send(isPUTorPOST? self._uri:null);
                });
            };
            InstanceXhr.prototype.exec = function(action, p) {
                var self = this;
                setBits.call(this,p);
                this.action = action;
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
                var self = this;
                return rootEmitter.dispatch('instance.xhr.aborted',self).then(function() {
                    return rootEmitter.dispatch('instance.xhr.end',self);
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
                workerEventChannel = new app['core.events'].createMgr(),
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
                var self = this,
                    swrks = self.workers = [];
                if (p)
                    setBits.call(this,p);
                return new Promise(function(resolve, reject) {
                    var chkComplete = function() {
                        if (swrks.every(function (w) {
                            return w.done;
                        })) {
                            end();
                            resolve();
                        }
                    };
                    var workerSucEvt = function(o) {
                        if (swrks.indexOf(o.x) === -1)
                            return;
                        if (self.onProgress)
                            self.onProgress();
                        chkComplete();
                    };
                    var workerErrEvt = function(o) {
                        if (swrks.indexOf(o.x) > -1) {
                            end();
                            reject(o);
                        }
                    };
                    var end = function() {
                        workerEventChannel.remove(workerErrEvt,'error');
                        workerEventChannel.remove(workerSucEvt,'success');
                    };

                    workerEventChannel.on('success', workerSucEvt);
                    workerEventChannel.on('error', workerErrEvt);

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
                    self = this;
                return  workerEventChannel.dispatch('start').then(function() {
                    return xhr.get({ res:file }).then(function(data) {
                        switch (type) {
                            case 'js':
                                var module = {
                                    requires:[],
                                    exports:null
                                };
                                eval(data);
                                var code = self.code = module.exports ? module.exports : null;
                                return Promise.resolve().then(function() {
                                    if (module.requires.length)
                                        return new InstanceAmd().get({
                                            repo:mod.depRepoRevert? repo : mod.repo,
                                            modules:module.requires
                                        });
                                }).then(function() {
                                    var u = null,
                                        m = self.module.name,
                                        s = m.substr(0,m.length-3);
                                    if (code)
                                        u = code(app,{ conf:appConf });
                                    return (u instanceof Promise? u : Promise.resolve(u)).then(function (data) {
                                        if (data)
                                            app[s] = data;
                                    });
                                });
                            case 'css':
                                dom.mk('style',head,data);
                        }
                    }).then(function() {
                        self.done = true;
                        self.xhr = null; // gc
                        return workerEventChannel.dispatch('success', { x: self });
                    }).catch(function (e) {
                        return workerEventChannel.dispatch('error', { x: self, error:e });
                    }).then(function(e) {
                        self.running = false;
                        return workerEventChannel.dispatch('end', { x: self, error:e });
                    });
                });
            };
        })();

        var InstanceAmd = app['instance.amd'],
            rootEmitter = app['core.events'].rootEmitter;
        // load externals
        return new InstanceAmd().get({ modules:modules }).then(function() {
            var ii = appConf.init;
            if (ii && ii.onProgress)
                ii.onProgress(app,appConf);
            return rootEmitter.dispatch('state.init').then(function() {
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
