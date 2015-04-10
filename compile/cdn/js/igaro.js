window.addEventListener('load', function() {

    "use strict";

    // app holder
    var app = {};

    // status handling
    var loadingC = document.createElement('div');
    loadingC.className='igaro';
    document.body.appendChild(loadingC);
    var loadingW = document.createElement('div');
    loadingC.appendChild(loadingW);
    var loadingD = document.createElement('div');
    loadingW.appendChild(loadingD);

    new Promise(function(r,rreject) {

        // MODULES - EDIT BELOW THIS LINE ////////////////////
        var threads = [[]];

        // phonegap (cordova)
        if (document.location.protocol === 'file:') {
            threads[threads.length-1].push(
                { name:'3rdparty.fastclick.js' },       
                { name:'3rdparty.cordova.css' }
            );
        }

        // touch screen
        if ('ontouchstart' in window || navigator.maxTouchPoints || navigator.msMaxTouchPoints) {
            threads[threads.length-1].push(
                { name:'3rdparty.hammer.js' }
            );
        }
     
        // 3rdparty libraries
        /* threads.push([
           { name:'3rdparty.jquery.2.js' }
        ]);
        */

        // fonts
        (function(fonts) {
            var b,d,e,f,g,
                h=document.body,
                a=document.createElement("div");
                a.innerHTML='<span style="'+["position:absolute","width:auto","font-size:128px","left:-99999px"].join(" !important;")+'">'+Array(100).join("wi")+"</span>";
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
                fonts.forEach(function (a) { 
                    if (! (d!==b(a+",monospace") || f!==b(a+",sans-serif") ||e!==b(a+",serif")))
                        threads[threads.length-1].push(
                            { name:'lib.fonts.'+a.replace(' ','').toLowerCase()+'.css' }
                        );
                }); 
            }
        )(
            [
                'Proxima Nova' // license required - see Adobe!
                // 'Open Sans' // open source alternative of above
            ]
        );

        // further modules
        threads.push([
            // conf
            { name:'conf.app.js' }
        ]);

        // BEGIN - DO NOT EDIT BELOW THIS LINE ////////////////////

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
                return Promise.resolve();
            };
            var debug = app['core.debug'] = {
                developer : __igaroapp.debug,
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
                // removes events linked to a particular dependency. A dependency can be a function or object.
                clean : function(target) {
                    var pool = this.pool;
                    Object.keys(pool).forEach(function(n) {
                        var t = pool[n];
                        Object.keys(t).forEach(function(e) {
                            var m = t[e];
                            m.forEach(function(x,i) {
                                if (x.deps.indexOf(target) > -1)
                                    m.splice(i,1);
                            });

                        });
                    });
                },
                // remove an event by event literal or function
                remove : function(fn,name,event) {
                    var obj = null;
                    if (typeof fn === 'object') {
                        obj = fn;
                        name = fn.name;
                        event = fn.event;
                    }
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
                },
                dispatch : function(name, evt, params, opts) {
                    var pool = this.pool,
                        self = this,
                        target = null,
                        pn = pool[name],
                        t,
                        r,
                        toCall = [];
                    return new Promise(function(resolve, reject) {
                        if (typeof evt === 'object') {
                            target=evt[1];
                            evt = evt[0];
                        }
                        if (! pn || ! pn[evt]) 
                            return resolve();
                        pn[evt].forEach(function(t) {
                            if (! t.target || target === t.target)
                                toCall.push(t);
                        });
                        var processNext = function() {
                            if (toCall.length === 0) 
                                return resolve();
                            t = toCall.shift();
                            if (! t || ! t.fn)
                                return processNext();
                            try {
                                r = t.fn.call(t, params);
                            } catch(e) {
                                if (window.console && debug.developer)
                                    console.error(e, t, t.fn);
                                return reject(e);
                            }
                            if (r instanceof Promise) {
                                r.then(function(a) {
                                    if (typeof a === 'object' && a.stopImmediatePropagation) {
                                        resolve(a);
                                    } else {
                                        processNext();
                                    } 
                                }).catch(function (e) {
                                    reject(e);
                                });
                            } else if (typeof r === 'object' && r.stopImmediatePropagation) {
                                return resolve(r);
                            } else {
                                processNext();
                            }
                        };
                        processNext();
                    }).catch(function (e) {
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
                if (! (evt instanceof Array))
                    evt = [evt];
                var self = this;
                evt.forEach(function(v) {
                    events.on(self.x.name,[v,self.x,self.deps],fn,o);
                });
                return this;
            };
            CoreEventMgr.prototype.clean = function(fn,evt) {
                events.clean(fn,this.x.name,evt);
                return this;
            };
            CoreEventMgr.prototype.remove = function(fn,evt) {
                events.remove(fn,this.x.name,evt);
                return this;
            };
            CoreEventMgr.prototype.dispatch = function(evt,value,child) {
                var obj = this.x,
                    self = this,
                    parent = obj.parent,
                    x = { 
                        child:child,
                        value:value,
                        x:obj
                    };
                return events.dispatch(obj.name,[evt,obj],x).then(function(o) {
                    // send up the chain?
                    if (typeof o === 'object' && (o.stopPropagation || o.stopImmediatePropagation))
                        return o;
                    if (parent && ! self.__asRoot)
                        return parent.managers.event.dispatch(obj.name+'.'+evt, x, obj);
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
                CoreDom = function(parent) {
                    this.parent = parent;
                    this.head = document.getElementsByTagName('head')[0];
                },
                pQ = function(o) {
                    if (!(o instanceof HTMLElement || o instanceof DocumentFragment) && o.container)
                        return o.container
                    return o;
                };
            CoreDom.prototype.mk = function(t,o,c,m) {
                var r,
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
                    } else if (o.container) {
                        o.container.appendChild(r);
                    } else if (o.insertBefore) {
                        var i = o.insertBefore;
                        if (!(i instanceof HTMLElement))
                            i = i.container;
                        i.parentNode.insertBefore(r,i);
                    } else if (o.insertAfter) {
                        var i = o.insertAfter;
                        if (!(i instanceof HTMLElement))
                            i = i.container;
                        i.parentNode.insertBefore(r,i.nextSibling);
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
                    if (c)
                        self.setContent(r,c);
                }
                // is manager?
                var parent = this.parent;
                if (parent)
                    parent.managers.event.on('destroy', function() {
                        return dom.rm(r);
                    });
                return r;
            };
            CoreDom.prototype.setPlaceholder = function(r,l) {
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
            };
            CoreDom.prototype.hide = function(r,v) {
                if (! (r instanceof Node))
                    throw new Error('No DOM element supplied');
                if (typeof v === 'boolean' && v === false)
                    return this.show(r);
                r.classList.add('core-dom-hide');
            };
            CoreDom.prototype.isHidden = function(r) {
                var s = r.style;
                return s.visibility === 'hidden' || s.display === 'none';
            };
            CoreDom.prototype.toggleVisibility = function(r) {
                if (! (r instanceof Node))
                    throw new Error('No DOM element supplied');
                return this.hide(r,! r.classList.contains('core-dom-hide'));
            }
            CoreDom.prototype.show = function(r) {
                if (! (r instanceof Node))
                    throw new Error('No DOM element supplied');
                r.classList.remove('core-dom-hide');
            };

            CoreDom.prototype.append = function(r,c,o) {
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
            };

            CoreDom.prototype.setContent = function(r,c,o) {
                if (! o)
                    this.nuke(r,true);
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
            };
            CoreDom.prototype.nuke = function(element,leaveRoot) {
                var self = this,
                    node;
                while (node = element.lastChild) {
                    self.nuke(node);
                    events.clean(node);
                }
                if (! leaveRoot) {
                    self.rm(element);
                    events.clean(element);
                }
            };
            CoreDom.prototype.empty = function(element) {
                while (element.firstChild)
                    element.removeChild(element.firstChild);
                element.innerHTML = '';
            };
            CoreDom.prototype.rm = function(element) {
                var p = element.parentNode;
                if (p)
                    p.removeChild(element);
            };
            CoreDom.prototype.sort = function(o) {
                var slice = o.slice,
                    on = o.on || function(o) { return o.innerHTML; },
                    root = o.root || o.nodes[0].parentNode,
                    nodes = Array.prototype.slice.call(o.nodes || o.root.childNodes);  
                if (slice) 
                    nodes = nodes.slice(slice[0],slice[1],slice[2]);
                var insertBefore = nodes[nodes.length-1].nextElementSibling;
                nodes = nodes.sort(function(a, b) {
                    a = on(a);
                    b = on(b);
                    return a == b? 0: (a > b ? 1 : -1);
                });
                if (o.reverse)
                    nodes = nodes.reverse();
                nodes.forEach(function (o) {
                    root.insertBefore(o,insertBefore); 
                });
            };
            CoreDom.prototype.createMgr = function(self) {
                return new CoreDom(self);
            };
            app['core.dom'] = new CoreDom();
        })();

        // core.bless: built in
        (function() {
            var events = app['core.events'];
            app['core.bless'] = function(o) {
                var self = this,
                    name = this.name = o.name,
                    managers = o.managers || [],
                    parent = this.parent = o.parent,
                    path = this.path = [name],
                    container = o.container,
                    thisManagers = this.managers = {},
                    asRoot = this.__asRoot = o.asRoot;
                this.stash = {};
                // build path using parents?
                if (! asRoot) {
                    var x = this;
                    while (x.parent) {
                        path.unshift(x.parent.name);
                        x = x.parent;
                        if (x.__asRoot)
                            break;
                    }
                }
                // append managers
                [
                    ['event',parent?parent.managers.event : events],
                    ['debug',app['core.debug']],
                    ['dom',app['core.dom']]
                ].concat(Object.keys(managers).map(function(k) {
                    return [k,managers[k]];
                }))
                .forEach(function (o) {
                    thisManagers[o[0]] = o[1].createMgr(self);
                }); 
                // add object manager
                var amd = app['instance.amd'];
                thisManagers.object = {
                    create : function(g,o) {
                        if (! o)
                            o = {};
                        var t = typeof g === 'string'? { name:g } : g,
                            container = o.container,
                            name = t.fullname? t.fullname : 'instance.'+t.name,
                            p = { 
                                modules : [{ name: name+'.js' }],
                                repo : t.repo? t.repo : null
                            };
                        if (container)
                            container = thisManagers.dom.mk('div',container);
                        return new amd({ parent:self }).get(p).then(function () {
                            o.parent = self;
                            var i = new app[name](o);
                            if (! i.init)
                                throw { module:name, error:'No init() constructor' };
                            return i.init(o).then(function() {
                                return i;
                            });
                        });
                    }
                }
                if (parent)
                    parent.managers.event.on('destroy', function() {
                        return self.destroy();
                    });
                var thisMgrsEvt = thisManagers.event;
                this.destroy = function() {
                    return thisMgrsEvt.dispatch('destroy').then(function() {
                        Object.keys(self).forEach(function(k) {
                            delete self[k];
                        });
                        self.__destroyed = true;
                        return events.clean(self);
                    });
                };
                this.disable = function() {
                    this.disabled = true;
                    return thisMgrsEvt.dispatch('disabled');
                };
                this.enable = function() {
                    this.disabled = false;
                    return thisMgrsEvt.dispatch('enabled');
                };
                if (container) {
                    var dom = this.managers.dom;
                    if (typeof container === 'function') 
                        container = container(dom);
                    self.container = container;                   
                    if (asRoot)
                        container.classList.add(name.replace(/\./g,'-'));
                    this.hide = function(v) {
                        dom.hide(container,v);
                    };
                    thisMgrsEvt
                        .on('disabled',function() {
                            container.setAttribute('disabled',true);
                            container.setAttribute('inert',true);
                        })
                        .on('enabled',function() {
                            container.setAttribute('disabled',false);
                            container.setAttribute('inert',false);
                        });
                    this.show = function() {
                        if (self.disabled)
                            return;
                        dom.show(container);
                    };
                    thisManagers.event.on('destroy',function() {
                        dom.nuke(container);
                    });
                    if (o.hidden)
                        this.hide();
                }
                if (o.disabled)
                    this.disable();
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
            var events = app['core.events'];
            var setBits = function(p) {
              if (p.res) 
                this.res = p.res;
              if (p.headers) 
                this.headers = p.headers;
              if (p.vars) 
                this.vars = p.vars;
              if (p.withCredentials !== undefined) 
                this.withCredentials = p.withCredentials;
              if (p.form) 
                this.setForm(p.form);
              if (p.silent) 
                this.silent = p.silent;
              if (p.stash)
                this.stash = p.stash;
              if (typeof p.expectedContentType !== undefined)
                this.expectedContentType = p.expectedContentType;
            };
            var bless = app['core.bless'];
            var InstanceXhr = function(o) {
                bless.call(this,{
                    name:'instance.xhr',
                    parent:o && o.parent? o.parent : null,
                    asRoot:true
                });

                var self = this,
                    xhr = this.xhr = new XMLHttpRequest(),
                    eventMgr = this.managers.event;
                this.data = null;
                this.res='';
                this.withCredentials=false;
                this.vars = {};
                this.silent = false;
                this.aborted = false;
                this.headers = {};
                this.formdata = {};
                this.expectedContentType = null;
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
                        var responseText = xhr.responseText,
                            status = xhr.status;
                        if (status === 200 || (status === 0 && responseText.length > 0)) {
                            var cv = xhr.getResponseHeader("Content-Type");
                            if (self.expectedContentType && cv && cv.indexOf('/'+self.expectedContentType) === -1)
                                throw(400);
                            var data = ! cv || cv.indexOf('/json') === -1? responseText : JSON.parse(responseText);
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
                    action = self.action, 
                    xhr = self.xhr,
                    uri = this._uri,
                    t = this.res;
                if (! this._promise)
                    throw new Error('instance.xhr -> Can\t send() before exec(). Send() is only for re-executing a request.');
                xhr.abort();
                return this.managers.event.dispatch('start').then(function() {
                    if (action==='GET' && uri.length) {
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
                    xhr.send(action!=='GET'? self._uri:null);
                });
            };
            InstanceXhr.prototype.exec = function(action, p) {
                var xhr = this.xhr,
                    self = this;
                if (p) 
                    setBits.call(this,p);
                this.action = action;
                this.abort();
                this.aborted = false;
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
                    self.send();
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
            InstanceXhr.prototype.applyForm = function(form, autorefresh) {
                var fd = this.formdata = {};
                this.headers["Content-Type"] = "application/x-www-form-urlencoded";
                Array.prototype.splice.call(form.elements).forEach(function (l) {
                    if (l.disabled) 
                        return;
                    if (l.type=="checkbox" && l.checked) {
                        fd[l.name] = l.checked? 1:0;
                    } else if (l.type=="select-one" && l.selectedIndex > -1) {
                        if (l.options.length) 
                            fd[l.name] = l.options[l.selectedIndex].value;
                    } else if (l.type=="select-multiple") {
                        var t=l.options.map(function(s) {
                            if (! s.selected) 
                                return;
                            return s.value;
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
            var repo = __igaroapp.cdn,
                InstanceXhr = app['instance.xhr'],
                events = app['core.events'],
                bless = app['core.bless'],
                dom = app['core.dom'],
                head = dom.head,
                workers = [
                    'core.events',
                    'core.bless',
                    'core.debug',
                    'core.dom',
                    'instance.xhr',
                    'instance.amd'
                ].map(function(m,i) {
                    return { uid:i*-1-1, done:true, module: { name:m+'.js' }}
                }),
                setBits = function(p) {
                    if (p.modules)
                        this.modules = p.modules;
                    if (p.repo)
                        this.repo = p.repo;
                    if (p.onProgress)
                        this.onProgress = p.onProgress;
                };
            var InstanceAmd = app['instance.amd'] = function(o) {
                bless.call(this,{
                    name:'instance.amd',
                    parent:o && o.parent?  o.parent:null,
                    asRoot:true
                });
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
                    var chk = function() {
                        return self.workers.every(function (w) {
                            return w.done;
                        });
                    };
                    var sucEvt = events.on('instance.amd','worker.success', function(o) {
                        if (swrks.indexOf(o.x) === -1)
                            return;
                        if (self.onProgress)
                            self.onProgress();
                        if (chk())
                            end();
                    });
                    var errEvt = events.on('instance.amd','worker.error', function(o) {
                        if (swrks.indexOf(o.x) !== -1)
                            end(o);
                    });
                    var end = function(e) {
                        events.remove(errEvt,'instance.amd','worker.error');
                        events.remove(sucEvt,'instance.amd','worker.success');
                        if (e) {
                            reject(e);
                        } else {
                            resolve();
                        }
                    };
                    self.modules.forEach(function (m) {
                        if (typeof m.repo === 'undefined' && repo) 
                            m.repo = repo;
                        if (! m.requires) 
                            m.requires = [];
                        var wk, 
                            n=m.name;
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
                    if (chk()) 
                        end();
                });
            };
            var InstanceAmdWorker = function(o) {
                bless.call(this,{
                    name:'instance.amd'
                });
                this.uid = Math.floor((Math.random() * 9999));
                var mod = this.module = o.module,
                    modname = this.module.name,
                    e = /^.+\.([^.]+)$/.exec(modname.toLowerCase()),
                    type=this.type = e === null? '' : e[1],
                    file = this.file = mod.repo+(mod.nosub? '' : '/'+type+'/')+modname;
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
                return eventMgr.dispatch('worker.start').then(function() {
                    return xhr.get({ res:file }).then(function(data) {
                        switch (type) {
                            case 'js':
                                var module = {
                                    requires:[],
                                    exports:null
                                };
                                eval(data);
                                var code = self.code = module.exports ? module.exports : null;
                                var promises=[];
                                if (module.requires.length) {
                                    promises.push(
                                        new InstanceAmd().get({ 
                                            repo:mod.repo, 
                                            modules:module.requires,
                                        })
                                    );
                                }
                                return Promise.all(promises).then(function(o) {
                                    var u = null,
                                        m = self.module.name,
                                        s = m.substr(0,m.length-3);
                                    if (code)
                                        u = code(app,{ appconf:__igaroapp });
                                    return Promise.all([ u instanceof Promise? u : Promise.resolve(u) ]).then(function (data) {
                                        if (data.length)
                                            app[s] = data[0];
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
                        return eventMgr.dispatch('worker.end');
                    });
                });
            };
            InstanceAmdWorker.prototype.loaded = function() {
                this.done=true;
                this.xhr = null; // gc
                return this.managers.event.dispatch('worker.success');
            };
        })();

        // external modules
        var InstanceAmd = app['instance.amd'],
            dom = app['core.dom'],
            events = app['core.events'];
        var x = [],
            m = threads.map(function(modules) {
                var y = new InstanceAmd().get({ modules:modules });
                x.push({ p:y, m:modules });
                return y;
            });
        return Promise.all(m).then(
            function() {
                return events.dispatch('','state.init').then(function() {
                    return dom.rm(loadingC);    
                });
            }
        ).catch(function(e) {
            rreject(e);
        });

    }).catch(function (e) {
        loadingW.className='error';
        var l;
        if ('core.language' in app) {
            l = app['core.language'].env || 'en';
        } else {
            l = window.navigator.userLanguage || window.navigator.language;
            l = l.substr(0,3) + l.substr(3).toUpperCase();
        }
        var t = typeof e === 'object' && e.error && e.error.incompatible? __igaroapp.browserincompat : __igaroapp.loaderr;
        if (! t[l]) {
            var c = l.split('-');  
            l = t[c[0]]? c[0] : 'en';
        }
        loadingD.innerHTML = t[l].replace(/\\n/g,'<br>');
        return app['core.debug'].log.append(e);

    }).catch(function (e) {
        if (window.console) 
            console.error(e);
    });

});

