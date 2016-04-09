(function(env) {

    "use strict";

    module.exports = function(app) {

        var events = app['core.events'],
            dom = app['core.dom'],
            debounceStore=[];

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

        /* Manager
         * @constructor
         * @param {object} parent - parent the manager belongs to
         */
        var CoreObjectMgr = function(parent) {

            this.parent = parent;
        };

        /* Creates a new Igaro blessed object instance. Not to be confused with Object.create!
         * @param {{string|object}} t - name of instance to use, or literal containing it and a repo path
         * @param {object} o - object to pass over to the constructor function
         * @returns {Promise} containing instantiated object
         */
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
                return Promise.resolve().then(function() {

                    if (! i.init)
                        return;
                    if (typeof i.init !== 'function')
                        throw { module:name, error:'.init() is not a function' };
                    return i.init(o);
                }).then(function() {

                    return i;
                });
            });
        };

        /* Destroys the manager
         * @returns {Promise}
         */
        CoreObjectMgr.prototype.destroy = function() {

            this.parent = null;
            return Promise.resolve();
        };

        return {

            /* Appends into an array in a defined way
             * @param {Array} a - Array to work on
             * @param {*} v - Item to add
             * @param {Object} o - config supporting insertBefore, insertAfter, prepend (default append)
             * @returns {null}
             */
            arrayInsert : function(a,v,o) {

                if (!(a instanceof Array))
                    throw new TypeError('First argument must be an Array');
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

            /* Debounces a user action
             * @param {object} target - the control, typically a button, input box
             * @param {integer} [timeout] - delay in milliseconds on which to debounce
             * @returns {Promise} debounced actions may pass
             */
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

            // reduces an array of Promises
            promiseSequencer : promiseSequencer,

            /* Blesses an object (attaches relationship, managers, ops)
             * @param {object} o - config, see core.object.bless online for full details
             * @returns {null}
             */
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
                    asRoot = this.asRoot,
                    dom = app['core.dom'];

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
                    ['dom',dom],
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
            },

            createMgr : function(parent) {

                return new CoreObjectMgr(parent);
            }
        };
    }

})(this);
