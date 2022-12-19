(function() {

  module.exports = app => {

    const coreEvents = app['core.events'],
      debounceStore = [];

    /* Manager
     * @constructor
     * @param {object} parent - parent the manager belongs to
     */
    const CoreObjectMgr = function(parent) {

      this.parent = parent;
    };

    /* Creates a new Igaro blessed object instance. Not to be confused with Object.create!
     * @param {{string|object}} t - name of instance to use, or literal containing it and a repo path
     * @param {object} o - object to pass over to the constructor function
     * @returns {Promise} containing instantiated object
     */
    CoreObjectMgr.prototype.create = async function(t, o) {

      if (! o) {
        o = {};
      }
      if (typeof t === 'string') {
        t = { name:t };
      }
      const Amd = app['instance.amd'],
        parent = this.parent,
        name = t.fullname? t.fullname : 'instance.'+t.name,
        p = {
          modules : [{ name: name+'.js' }],
          repo : t.repo? t.repo : null
        };
      await (new Amd({ parent:parent })).get(p);
      o.parent = parent;
      const i = new app[name](o);
      if (i.init) {
        if (typeof i.init !== 'function') {
          throw { module:name, error:'.init() is not a function' };
        }
        await i.init(o);
      }
      return i;
    };

    /* Destroys the manager
     * @returns {Promise}
     */
    CoreObjectMgr.prototype.destroy = async function() {

      this.parent = null;
    };

    return {

      /* Appends into an array in a defined way
       * @param {Array} a - Array to work on
       * @param {*} v - Item to add
       * @param {Object} o - config supporting insertBefore, insertAfter, prepend (default append)
       * @returns {null}
       */
      arrayInsert: function(a,v,o) {

        if (!(a instanceof Array)) {
          throw new TypeError('First argument must be an Array');
        }
        if (! o) {
          o = {};
        }
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

      /* Debounces a user action
       * @param {object} target - the control, typically a button, input box
       * @param {integer} [timeout] - delay in milliseconds on which to debounce
       * @returns {Promise} debounced actions may pass
       */
      debounce: (target,timeout) => new Promise(resolve => {

        const place = into => {
          const ref = setTimeout(() => {
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
        if (! debounceStore.slice()
          .some(o => {
            if (o.target === target) {
              clearTimeout(o.ref);
              place(o);
              return true;
            }
          })
        ) {
          place();
        }
      }),

      /* Blesses an object (attaches relationship, managers, ops)
       * @param {object} o - config, see core.object.bless online for full details
       * @returns {null}
       */
      bless: function(o) {

        if (!o) {
          o = {};
        }

        let self = this,
          { name, container, children, asRoot } = this,
          managers = this.managers || [],
          parent = this.parent = o.parent,
          path = this.path = [name],
          thisManagers = this.managers = {},
          dom = app['core.dom'];

        this.stash = o.stash || {};

        // build path using parents?
        if (! asRoot) {
          let x = this;
          while (x.parent) {
            path.unshift(x.parent.name);
            x = x.parent;
            if (x.asRoot) {
              break;
            }
          }
        }

        // append managers
        const mgrs = [
          ['event',app['core.events']],
          ['debug',app['core.debug']],
          ['dom',dom],
          ['object',app['core.object']]
        ].concat(Object.keys(managers)
          .map(k => [k,managers[k]])
        ).map(o => thisManagers[o[0]] = o[1].createMgr(self));

        // create child arrays
        if (children) {
          const eventMgr = self.managers.event;
          Object.keys(children)
            .forEach(k => {

              const child = children[k],
                a = self[k] = [];

              // auto remove destroyed child
              eventMgr.on(child+'.destroy', s => {

                a.splice(a.indexOf(s.x),1);
              });
          });
          delete this.children;
        }

        const thisMgrsEvt = thisManagers.event;

        // parent->child event propagation
        if (parent) {
          parent.managers.event
            // destroy
            .on('destroy',() => self.destroy(), { deps:[self] })
            // disable
            .on('disable',() => thisMgrsEvt.dispatch('disable'), { deps:[self] });
        }

        this.destroy = async function() {

          // purge container beforehand to prevent any reapply
          if (self.container) {
            dom.purge(self.container);
            delete self.container;
          }
          await thisMgrsEvt.dispatch('destroy');
          self.destroyed = true;
          coreEvents.clean(self);
          await Promise.all(mgrs.map(o => o.destroy()));
          delete self.parent;
        };

        this.disable = function(v) {

          v = this.disabled = ! (typeof v === 'boolean' && ! v);
          const { container } = self;
          if (container) {
            if (v) {
              container.setAttribute('disabled',v);
              container.setAttribute('inert',v);
            } else {
              container.removeAttribute('disabled');
              container.removeAttribute('inert');
            }
          }
          return thisMgrsEvt.dispatch('disable',v);
        };

        this.enable = function (v) {

          return this.disable(!! v);
        };

        this.isDisabled = function() {

          return this.disabled || (this.parent? this.parent.isDisabled() : false);
        };

        if (container) {
          if (typeof container === 'function') {
            self.container = container = container(self.managers.dom);
          }
          if (asRoot) {
            container.classList.add(name.replace(/\./g,'-'));
          }
          this.hide = v => dom.hide(container,v);
          this.show = () => dom.show(container);
          if (o.hidden) {
            this.hide();
          }
        }

        if (o.disabled) {
          return this.disable();
        }
      },

      createMgr : parent =>  new CoreObjectMgr(parent)
    };
  };

})(this);
