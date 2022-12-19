(function(env) {

  module.exports = (app, params) => {

    const repo = appConf.cdn,
      InstanceXhr = app['instance.xhr'],
      { bless } = app['core.object'],
      dom = app['core.dom'],
      { head } = dom,
      appVerStr = "appBuildTs="+encodeURIComponent(params.buildTs)+"&appVersion="+encodeURIComponent(params.version),
      workerEventChannel = new app['core.events'].createMgr();

    const workers = [
      'core.events',
      'core.object',
      'core.debug',
      'core.dom',
      'instance.xhr',
      'instance.amd'
    ].map((m,i) => ({ uid:i*-1-1, done:true, module: { name:m+'.js' }}));

    const setBits = function(o) {

      if (o.modules) {
        this.modules = o.modules;
      }
      if (o.repo) {
        this.repo = o.repo;
      }
      if (o.depRepoRevert) {
        this.depRepoRevert = true;
      }
      if (o.onProgress) {
        this.onProgress = o.onProgress;
      }
    };

/*------------------------------------------------------------------------------------------------*/

    /* Main Manager
     * @constructor
     */
    const InstanceAmd = function(o) {

      o = o || {};
      this.name='instance.amd';
      this.asRoot = true;
      this.depRepoRevert = false;
      this.uid = Math.floor((Math.random() * 9999));
      this.repo = repo;
      bless.call(this,o);
      if (o) {
        setBits.call(this,o);
      }
    };

    /* Fetches and loads one or more modules, plus any dependencies
     * @param {object} [p] config literal. See setBits() and online doc for attributes
     * @returns {Promise}
     */
    InstanceAmd.prototype.get = function(o) {

      const self = this,
        swrks = self.workers = [];

      if (o) {
        setBits.call(this,o);
      }

      return new Promise(function(resolve, reject) {

        const end = () => {

          workerEventChannel.remove(workerErrEvt,'error');
          workerEventChannel.remove(workerSucEvt,'success');
          workerEventChannel.remove(workerProgressEvt,'progress');
        };

        const chkComplete = () => {

          if (swrks.every(w => w.done)) {
            end();
            resolve();
          }
        };

        const workerSucEvt = o => {

          if (swrks.includes(o.x)) {
            onProgress(o.children);
            chkComplete();
          }
        };

        const workerErrEvt = o => {

          if (swrks.includes(o.x)) {
            end();
            reject(o);
          }
        };

        const workerProgressEvt = o => {

          if (swrks.includes(o.x)) {
            onProgress(o.children);
          }
        };

        const onProgress = children => {

          if (self.onProgress) {
            self.onProgress({ workers:swrks, children });
          }
        };

        workerEventChannel.on('progress', workerProgressEvt)
          .on('success', workerSucEvt)
          .on('error', workerErrEvt);

        self.modules
          .forEach(module => {

            if (typeof module.repo === 'undefined' && repo) {
              module.repo = repo;
            }
            if (! module.requires) {
              module.requires = [];
            }

            // if there's already a worker for this module use it otherwise create one
            const wk = workers.find(w => w.module.name === module.name) || new InstanceAmdWorker({
              module,
              parent:self
            });

            if (! wk.done) {
              swrks.push(wk);
              wk.run();
            }
          });

        onProgress();
        chkComplete();
      });
    };

/*------------------------------------------------------------------------------------------------*/

    /* Worker
     * @constructor
     */
    const InstanceAmdWorker = function(o) {

      this.name = 'instance.amd';
      this.uid = Math.floor((Math.random() * 9999));

      const mod = this.module = o.module,
        modname = this.module.name,
        modVersion = mod.version;

      bless.call(this,o);

      let type = this.type || this.module.type;

      if (! type) {
        // attempt to auto discover type from extension
        const e = /^.+\.([^.]+)$/.exec(modname.toLowerCase());
        type = this.type = e === null? '' : e[1];
      }

      // must be js or css
      if (! /css|js/.test(type)) {
        throw new Error('instance.amd can\'t handle file type: '+modname);
      }

      let file;
      if (! this.module.external) {
        file = mod.repo+'/'+(mod.nosub? '' : type+'/')+modname+'?';

        // add version
        if (modVersion) {
          file += 'v='+modVersion+'&';
        }

        // add app version
        file += appVerStr;
        this.file = file;
      } else {
        this.file = modname;
      }

      workers.push(this);
    };

    /* Runs a worker, which fetches a module and notifies managers.
     * @returns {Promise}
     */
    InstanceAmdWorker.prototype.run = async function() {

      if (this.done || this.running) {
        return;
      }

      var xhr = this.xhr = new InstanceXhr(),
        file = this.file,
        type = this.type,
        mod = this.module,
        self = this;

      try {

        const onProgress = o => workerEventChannel.dispatch('progress', { x:self, children:o });

        this.running = true;

        await workerEventChannel.dispatch('start');

        const data = await xhr.get({
          res: file,
          headers: {
            "Access-Control-Allow-Origin": "*"
          }
        });

        switch (type) {
          case 'js':

            // can't pass anything
            Object.keys(module)
              .forEach(key => delete module[key]);

            (function() {
              eval(data); //jshint ignore:line
            }).call(env);

            const exports = self.code = module.exports ? module.exports : null;

            // resolve dependencies
            if (Array.isArray(module.requires) && module.requires.length) {
              await new InstanceAmd().get({
                repo:mod.depRepoRevert? repo: mod.repo,
                modules:module.requires,
                onProgress : onProgress
              });
            }

            // don't leave in memory
            Object.keys(module)
              .forEach(key => delete module[key]);

            // run function
            if (typeof exports === 'function') {
              const data = await exports(app,{ conf:appConf });
              if (data) {
                const myName = self.module.name.slice(0,-3);
                app[myName] = data;
              }
            }

            break;

          case 'css':
            dom.mk('style',head).textContent = data;
        }

        self.done = true;
        self.xhr = null; // gc
        self.running = false;
        await workerEventChannel.dispatch('success', { x: self });
        await workerEventChannel.dispatch('end', { x: self });

      } catch (error) {

        self.running = false;
        await workerEventChannel.dispatch('error', { x: self, error });
        await workerEventChannel.dispatch('end', { x: self, error });
      };
    };

    return InstanceAmd;
  };

})(this);
