//# sourceURL=instance.samespace.js

(function () {

  module.requires = [
    { name: 'instance.samespace.css' }
  ];

  module.exports = app => {

    const coreObject = app['core.object'],
      dom = app['core.dom'],
      { bless, arrayInsert } = coreObject;

/*------------------------------------------------------------------------------------------------*/

    /* Area
     * @constructor
     * @param {object} [o] - config literal. See online help
     */
    const InstanceSameSpaceArea = function (o) {

      this.name = 'space';
      this.container = domMgr => domMgr.mk('div', null, o.content, o.className);

      bless.call(this, o);

      var parent = this.parent,
        self = this;

      this.li = dom.mk('li', parent.nav.firstChild, null, function () {
        this.addEventListener('click', async () => {
          try {
            await parent.stop();
            await parent.to(self);
          } catch (e) {
            return self.managers.debug.handle(e);
          }
        });
      });
    }

/*------------------------------------------------------------------------------------------------*/

    /* Manager
     * @constructor
     * @param {object} [o] - config literal. See online help
     */
    const InstanceSameSpace = function (o)  {

      o = o || {};
      var self = this;
      this.name = 'instance.samespace';
      this.asRoot = true;
      this.children = {
        spaces: 'space'
      };
      this.container = domMgr => domMgr.mk('div', o, null, function () {
        if (o.className) {
          this.classList.add(o.className);
        }
        self.canvas = dom.mk('div', this, null, o.effect);
      });
      this.current = -1;
      this.delay = o.delay || 5000;

      bless.call(this, o);

      this.nav = dom.mk('nav', this, dom.mk('ul'));
      this.loop = typeof o.loop === 'boolean'? o.loop : true;

      if (! o.transparent) {
        this.canvas.style.backgroundColor = 'black';
      }

      this.managers.event.on('destroy', () => {
        if (this.timerRef) {
            window.clearInterval(this.timerRef);
        }
      });
    }

    /* Async Constructor
     * @constructor
     * @param {object} [o] - config literal. See online help
     * @returns {Promise}
     */
    InstanceSameSpace.prototype.init = async function (o) {

      const { spaces } = o;
      if (spaces) {
        await this.addSpaces(spaces);
      }
      if (this.spaces.length) {
        await this.to(this.spaces[0]);
      }
      if (o.start) {
        return this.start();
      }
    }

    /* Adds multiple spaces
     * @param {Array} o - spaces
     * @returns {Promise}
     */
    InstanceSameSpace.prototype.addSpaces = async function (spaces) {

      const newSpaces = [];
      for (space of spaces) {
        newSpaces.push(await this.addSpace(space));
      }
      return newSpaces;
    }

    /* Adds a space
     * @param {Array} o - spaces
     * @returns {Promise} containing InstanceSameSpace
     */
    InstanceSameSpace.prototype.addSpace = async function (o) {

      o.parent = this;
      const s = new InstanceSameSpaceArea(o);
      arrayInsert(this.spaces, s, o);
      dom.hide(s.container);
      this.canvas.appendChild(s.container);
      await this.managers.event.dispatch('addSpace', s);
      return s;
    }

    /* Stops transition
     * @returns {Promise}
     */
    InstanceSameSpace.prototype.stop = async function () {

      if (this.timerRef) {
        window.clearInterval(this.timerRef);
      }
      this.canvas.setAttribute('status', 'stopped');
      await this.managers.event.dispatch('stop');
    }

    /* Starts transition
     * @returns {Promise}
     */
    InstanceSameSpace.prototype.start = async function () {

      if (this.timerRef) {
        window.clearInterval(this.timerRef);
      }

      const self = this;
      this.canvas.setAttribute('status', 'playing');
      this.timerRef = window.setInterval(() => {

        if (self.current === self.spaces.length-1 && ! self.loop) {
          return self.stop();
        }
        const to = self.current === self.spaces.length-1? 0 : self.current+1;
        self.to(self.spaces[to]);
      }, self.delay);

      await this.managers.event.dispatch('start');
    }

    /* Moves to a particular space
     * @returns {Promise}
     */
    InstanceSameSpace.prototype.to = async function (s) {

      if (! (s instanceof InstanceSameSpaceArea)) {
        throw new TypeError("First argument must be of type InstanceSameSpaceArea");
      }

      const { spaces } = this,
        i = spaces.indexOf(s);

      if (i === -1) {
        throw new Error("InstanceSameSpaceArea does not exist in InstanceSameSpace pool");
      }

      if (i === this.current) {
        return;
      }

      if (this.current > -1) {
        dom.hide(spaces[this.current].container);
      }
      this.current = i;
      dom.show(s.container);
      spaces
        .forEach(space=> space.li.classList[s === space? 'add' : 'remove']('active'));
      await this.managers.event.dispatch('to', s);
    }

    return InstanceSameSpace;
  }

})(this);
