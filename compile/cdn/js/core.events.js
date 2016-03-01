(function(env) {

    module.exports = function(app) {

        "use strict";

        var promiseSequencer = app['core.object'].promiseSequencer,
            eventEmitters = [];

        /* Event Emitter
         * @constructor
         * @param {object} parent - parent the eventemitter belongs to
         */
        var EventEmitter = function(parent) {
            this.events = {};
            this.parent = parent;
            eventEmitters.push(this);
        };

        /* Destroys the Event Emitter (clean up ops)
         * @param {object} parent - belongs to
         * @returns {Promise} containing null
         */
        EventEmitter.prototype.destroy = function() {

            eventEmitters.slice().splice(this,1);
            this.events = {};
            this.parent = null;
            return Promise.resolve();
        };

        /* Used to register an event handle
         * @param {(string|string[])} evt - the name of the event to register on, or array of
         * @param {function} fn - a function to run upon event trigger
         * @param {object} o - configuration literal containing dependencies and whether to prepend
         * @returns {object} this, for chaining
         */
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

        /* Removes an event by string or function
         * @param {(function|function[])} evt - the name of the event to register on, or array of
         * @param {string} [event] - optional event name to reduce enumeration
         * @returns {null}
         */
        EventEmitter.prototype.remove = function(fn,evt) {

            var self = this;
            if (fn instanceof Array) {
                return fn.forEach(function (f) {
                    self.remove(f,event);
                });
            }
            var events = this.events;
            (evt? [evt] : Object.keys(this.events)).forEach(function (key) {
                events[key].slice(0).forEach(function (evt, i) {
                    if (evt.fn === fn || evt.deps.indexOf(fn) > -1)
                        events[key].splice(i,1);
                });
            });
        };

        /* Dispatches an event
         * @param {string} evt - the name of the event to trigger
         * @param {*} [params] - optional passover data, usually an object
         * @returns {Promise}
         */
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
            })['catch'](function(e) {

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

        // service
        return {
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

    };

})(this);
