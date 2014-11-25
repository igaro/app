module.exports = function (app,params) {

    if (typeof window.XMLHttpRequest === 'undefined') 
        throw new Error({ incompatible:true, noobject:'XMLHttpRequest' });

    var debug = params && params.appconf.debug? true : false,
        workers = [({ uid:-1, done:true, module: { name:'instance.amd.js' }})],
        head = document.getElementsByTagName('head')[0],
        actors = [],

        promise = function(self) {
            if (debug) 
                console.error('instance.amd:'+self.uid+':'+self.modules.map(function(n) { 
                    return n.name; 
                }).join(','));
            return new Promise(function(resolve, reject) {
                self.abort = false;
                self.workers = [];
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
                        wk = new worker({ module:m });
                    }
                    self.workers.push(wk);
                });

                actors.push(
                    function(worker,e) {
                        //if (actorsdone.indexOf(this) !== -1)
                            //return;
                        if (self.abort)
                            return;
                        // are we interested in this worker?
                        if (self.workers.indexOf(worker) === -1)
                            return;
                        // error?
                        if (e) {
                            self.abort = true;
                            actors[actors.indexOf(this)] = null;
                            return reject(e);
                        }
                        // progress made!
                        if (self.onProgress)
                            self.onProgress();
                        // all workers complete?
                        if (self.workers.every(function (w) {
                            return w.done;
                        })) {
                            if (debug) 
                                console.error('instance.amd:'+self.uid+':'+self.modules.map(function(n) { 
                                    return n.name; 
                                }).join(',')+':resolved');
                            resolve();
                            actors[actors.indexOf(this)] = null;
                        }
                    }
                );
                self.workers.forEach(function(wk) {
                    wk.run();
                });
            });
        },

        setBits = function(p) {
            if (p.modules)
                this.modules = p.modules;
            if (p.repo)
                this.repo = p.repo;
            if (p.onProgress)
                this.onProgress = p.onProgress;
        };

    var amd = function(o) {
        this.uid = Math.floor((Math.random() * 9999));
        this.repo = params.repo;
        if (o)
            setBits.call(this,o);
    };
 
    amd.prototype.get = function(p) {
        if (p) 
            setBits.call(this,p);
        return new promise(this);
    };

    var worker = function(o) {
        this.uid = Math.floor((Math.random() * 9999));
        workers.push(this);
        var mod = this.module = o.module,
            modname = this.module.name,
            e = /^.+\.([^.]+)$/.exec(modname.toLowerCase()),
            type=this.type = e === null? '' : e[1],
            file = this.file = mod.repo+(mod.nosub? '' : '/'+type+'/')+modname;
        if (debug) 
            console.error('instance.amd:worker:'+this.uid+':'+this.file);
        this.done = false;
    };

    worker.prototype.run = function() {
        if (this.done) {
            return this.runActors();
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
                    var module = {
                        requires:[],
                        exports:null
                    };
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
                        new amd().get({ 
                            repo:mod.repo, 
                            modules:module.requires,
                        }).then(
                            function() { 
                                return self.execCode(); 
                            }
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
                if (events) 
                    events.dispatch('instance.xhr','success', fxhr);
            } else {
                self.error({ worker:self });
                if (events) 
                    events.dispatch('instance.xhr','error', fxhr);
            }
            if (events) 
                events.dispatch('instance.xhr','end', fxhr);
        };
        xhr.open('GET',file,true);
        xhr.send();
        if (events)
            events.dispatch('instance.xhr','start', fxhr);
    };

    worker.prototype.runActors = function(e) {
        var self = this;
        actors.forEach(function(actor) {
            if (actor)
                actor.call(actor, self, e);
        });
    };

    worker.prototype.execCode = function() {
        var code = this.code;
        var self = this;
        if (! code) {
            this.loaded();
            return Promise.resolve();
        }
        return new Promise(function(resolve) {
            var u = code(app,params),
                m = self.module.name,
                s = m.substr(0,m.length-3);
            if (typeof u === 'object' && u instanceof Promise) {
                return u().then(
                    function(res) {
                        app[s] = res;
                        self.loaded();
                        resolve();
                    }
                );
            }
            app[s] = u;
            self.loaded();
            resolve();
            //}
        }).catch(function(e) {
            self.error({ error:e, worker:self });
        });
    };

    worker.prototype.loaded = function() {
        this.done=true;
        this.running = false;
        if (debug) 
            console.error('instance.amd:worker:'+this.uid+':'+this.file+':loaded');
        this.runActors();
    };

    worker.prototype.error = function(e) {
        if (debug) 
            console.error('instance.amd:worker:'+this.uid+':'+this.file+':error');
        this.runActors(e);
        this.running = false;
    };

    if (debug) {
        var dumper = function(o) {
            console.error('');
            workers.forEach(function (a) {
                console.error('instance.amd:worker:'+a.uid+':'+a.module.name+':'+a.done);
            });
        };
        setTimeout(dumper, 3000);
    }

    return amd;
};
