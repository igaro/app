module.exports = function (app,passobj) {

    if (typeof window.XMLHttpRequest === 'undefined') throw new Error({ incompatible:true, noobject:'XMLHttpRequest' });

    var debug = false,

    workers = [({ uid:-1, done:true, module: { name:'instance.amd.js' }})],
    loaded = [],
    head = document.getElementsByTagName('head')[0],

    promise = function(self) {
        if (debug) console.log('instance.amd:'+uid+':'+this.modules.map(function(n) { return n.name }).join(','));
        return new Promise(function(resolve, reject) {
            self.abort = false;
            self.workers = [];
            self.modules.forEach(function (m) {
                if (typeof m.repo === 'undefined' && repo) m.repo = repo;
                if (! m.requires) m.requires = [];
                var wk, n=m.name;
                if (! workers.some(function (w) {
                    if (w.module.name === n) {
                        wk = w;
                        return true;
                    }
                })) wk = new worker({ module:m });
                wk.appendEventHandlers(
                    function() {
                        if (self.abort)
                            return;
                        if (self.onProgress)
                            self.onProgress();
                        if (self.workers.every(function (w) {
                            return w.done;
                        })) resolve(); 
                    },
                    function(e) {
                        if (self.abort) return;
                        self.abort = true;
                        reject(e);
                    }
                );
                self.workers.push(wk);
                wk.run();
            });
        });
    },

    setBits = function(p) {
        if (p.modules) {
            this.modules = p.modules;
        }
        if (p.repo) {
            this.repo = p.repo;
        }
        if (p.onProgress) {
            this.onProgress = p.onProgress;
        }
    },

    amd = function(o) {
        var self = this,
            repo = this.repo = passobj.repo;
        if (o) {
            setBits.call(this,o);
        }
        var uid = this.uid = Math.floor((Math.random() * 9999));
    };
 
    amd.prototype.get = function(p) {
        if(p) setBits.call(this,p);
        return new promise(this);
    };

    var worker = function(o) {
        workers.push(this);
        var self = this,
        mod = this.module = o.module,
        modname = this.module.name,
        e = /^.+\.([^.]+)$/.exec(modname.toLowerCase()),
        type=this.type = e === null? '' : e[1],
        file = this.file = mod.repo+(mod.nosub? '' : '/'+type+'/')+modname,
        uid = this.uid = Math.floor((Math.random() * 9999));
        if (debug) console.log('instance.amd:worker:'+uid+':'+this.file);
        this.eventHandlers = [];
        this.done = false;
    };

    worker.prototype.run = function() {
        if (this.done) {
            return this.runHandlers(0);
        }
        if (this.running) {
            return;
        }
        this.running = true;
        var events = app['core.events'],
        xhr = this.xhr = new XMLHttpRequest(),
        file = this.file,
        type = this.type,
        mod = this.module,
        self = this,
        fxhr = { xhr:xhr, res:file };
        xhr.onreadystatechange = function() {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status === 200 || (xhr.status === 0 && xhr.responseText)) {
                if (type === 'js') {
                    var module = {};
                    module.requires = [];
                    module.exports = null;
                    try { 
                        eval(xhr.responseText); 
                    }
                    catch(e) { 
                        if (events) {
                            fxhr.jsonError=e;
                            events.dispatch('instance.xhr','error', fxhr);
                            events.dispatch('instance.xhr','end', fxhr); 
                        }
                        return self.error({ error:e, worker:self }); 
                    }
                    self.code = module.exports ? module.exports : null;
                    if (module.requires.length) {
                        (new amd).get({ 
                            repo:mod.repo, 
                            modules:module.requires,
                        }).then(
                            function() { self.execCode(); }, 
                            function(e) { self.error(e); }
                        );
                    } else {
                        self.execCode();
                    }
                } else if (type === 'css') {
                    var sty = document.createElement('style');
                    sty.innerHTML = xhr.responseText;
                    head.appendChild(sty);
                    self.loaded();
                }
                if (events) events.dispatch('instance.xhr','success', fxhr);
            } else {
                self.error({ worker:self });
                if (events) events.dispatch('instance.xhr','error', fxhr);
            }
            if (events) events.dispatch('instance.xhr','end', fxhr);
        };
        xhr.open('GET',file,true);
        xhr.send();
        if (events) { events.dispatch('instance.xhr','start', fxhr); }
    };

    worker.prototype.appendEventHandlers = function(onSuccess, onError) {
        this.eventHandlers.push([onSuccess, onError]);
    };

    worker.prototype.runHandlers = function(type,e) {
        var v;
        while (v = this.eventHandlers.shift()) {
            v[type](e);
        }
    };

    worker.prototype.execCode = function() {
        var code = this.code;
        var self = this;
        if (! code) return this.loaded();
        try {
            var f = function() { self.loaded(); },
            u = code(app,passobj,{
                onError:function(e) { self.error(e); }, 
                onCompletion:function() { f(); }
            });
            if (['object','function'].indexOf(typeof u) !== -1) {
                var m = self.module.name;
                app[m.substr(0,m.length-3)] = u;
            }
            if (u !== false) f();
        }
        catch(e) {
            this.error({ error:e, worker:self });
        }
    };

    worker.prototype.loaded = function() {
        this.done=true;
        this.running = false;
        this.runHandlers(0);
    };

    worker.prototype.error = function(e) {
        this.runHandlers(1,e);
        this.running = false;
    };

    if (debug) {
        var dumper = function(o) {
            console.log('');
            workers.forEach(function (a) {
                console.log('instance.amd:worker:'+a.uid+':'+a.module.name+':'+a.done);
            });
        };
        setTimeout(dumper, 3000);
    }

    return amd;
};
