(() => {

  module.exports = app => {

    const eventEmitters = [];

    /* Event Emitter
     * @constructor
     * @param {object} parent - parent the eventemitter belongs to
     */
    const EventEmitter = function(parent) {

      this.events = {};
      this.parent = parent;
      eventEmitters.push(this);
    };

    /* Destroys the Event Emitter (clean up ops)
     * @param {object} parent - belongs to
     * @returns {Promise} containing null
     */
    EventEmitter.prototype.destroy = function() {

      eventEmitters
        .splice(eventEmitters.indexOf(this),1);
      this.events = {};
      this.parent = null;
    };

    /* Used to register an event handle
     * @param {(string|string[])} evt - the name of the event to register on, or array of
     * @param {function} fn - a function to run upon event trigger
     * @param {object} o - configuration literal containing dependencies and whether to prepend
     * @returns {object} this, for chaining
     */
    EventEmitter.prototype.on = function(evt,fn,o) {

      if (evt instanceof Array) {
        return evt
          .forEach(n => this.on(n,fn,o));
      }
      const pool = this.events,
        p = { fn:fn, deps:o && o.deps? o.deps : [] };

      if (! pool[evt]) {
        pool[evt] = [];
      }
      const m = pool[evt];
      if (o && o.prepend) {
        m.unshift(p);
      } else {
        m.push(p);
      }
      if (o && o.runNow) {
        return fn();
      }
      return this;
    };

    /* Removes an event by string or function
     * @param {(function|function[])} evt - the name of the event to register on, or array of
     * @param {string} [event] - optional event name to reduce enumeration
     * @returns {null}
     */
    EventEmitter.prototype.remove = function(fn,evt) {

      if (fn instanceof Array) {
        return fn
          .forEach(f => this.remove(f,evt));
      }
      const events = this.events;
      (evt? [evt] : Object.keys(this.events))
        .forEach(key => {

          while (1) {
            const ev = events[key];
            const i = ev.findIndex(evt => {
              return evt.fn === fn || evt.deps.includes(fn);
            });
            if (i > -1) {
              ev.splice(i,1);
            } else {
              break;
            };
          }
        });
    };

    EventEmitter.prototype.dispatch = async function(evt, params) {

      const events = this.events[evt];
      let stopPropagation;
      try {
        if (events) {
          const myEvents = events.slice(0);
          for (let t of myEvents) {
            const r = await t.fn.call(t, params);
            if (typeof r === 'object') {
              if (r.stopPropagation) {
                stopPropagation = true;
              }
              if (r.removeEventListener) {
                this.remove(t.fn,evt);
              }
              if (r.stopImmediatePropagation) {
                return r;
              }
            }
          };
        }

        // check not asRoot, is representing an object, that object has a parent, and a Promise didn't return stopPropagation
        const { parent } = this;
        if (! parent || parent.asRoot || ! parent.parent || stopPropagation) {
          return;
        };

        // eventMgr representing an object. Propagate to parent eventMmg;
        await parent.parent.managers.event.dispatch(parent.name+'.'+evt, {
          value:params,
          x:parent
        });

      } catch(e) {
        console.error(e);
        throw e;
      }
    };

    // service
    return {
      rootEmitter: new EventEmitter(),
      createMgr: function (parent) { return new EventEmitter(parent); },
      clean: (dep,name) => eventEmitters
        .forEach(eventEmitter => eventEmitter.remove(dep,name))
    };
  };

})(this);
