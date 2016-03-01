(function(env) {

    module.exports = function(app) {

        "use strict";

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

        /* Main
         * @constructor
         */
        var InstanceAmd = function(o) {

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
                            (function() {
                                eval(data);
                            }).call(env);
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
                })['catch'](function (e) {
                    return workerEventChannel.dispatch('error', { x: self, error:e });
                }).then(function(e) {
                    self.running = false;
                    return workerEventChannel.dispatch('end', { x: self, error:e });
                });
            });
        };

        return InstanceAmd;
    };

})(this);
