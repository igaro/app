//# sourceURL=instance.navigation.js

(function () {

  module.requires = [
    { name: 'instance.navigation.css' },
    { name: 'core.language.js' }
  ];

  module.exports = app => {

    const coreObject = app['core.object'],
      dom = app['core.dom'],
      { bless, arrayInsert } = coreObject;

/*------------------------------------------------------------------------------------------------*/

    /* Option
     * @constructor
     * @param {object} o - config literal. See online help for attributes
     */
    const InstanceNavigationMenuOption = function (o) {

      const self = this,
        { parent } = o;

      this.name = 'option';
      this.container = domMgr => {

        return domMgr.mk('li', parent.container, null, function () {

          if (o.className) {
            this.classList.add(o.className);
          }

          dom.mk('a', this, null, function () {

            dom.mk('span', this, o.title);

            if (o.href) {
              this.href = o.href;
            }

            this.addEventListener('click', async function (event) {

              event.preventDefault()
              if (self.disabled) {
                return event.stopImmediatePropagation();
              }

              try {
                let result;
                if (self.onClick) {
                  result = await self.onClick.call(self, event);
                }
                if (parent.onClick) {
                  await parent.onClick.call(parent, event);
                }
                self.setActive(typeof result === 'boolean'? result:true);
              } catch (e) {
                event.stopImmediatePropagation();
                return self.managers.debug.handle(e);
              }
            });
          });
        });
      };

      bless.call(this, o)
      this.managers.event.on('disable', () => self.setActive(self.disabled));
      this.onClick = o.onClick;
      this.status = 0;
      if (o.active) {
        this.setActive();
      }
      if (o.onCreate) {
        o.onCreate(this);
      }
    }

    /* Sets option as active, unless disabled
     * @param {boolean} [s] - optional value
     * @param {boolean} [nodeact] set silbings inactive, default true
     * @returns {Promise}
     */
    InstanceNavigationMenuOption.prototype.setActive = async function (s, nodeact) {

      if (this.disabled) {
        return;
      }

      s = typeof s !== 'boolean' || s;

      if (this.active === s) {
        return;
      }

      this.active = s;

      const li = this.container,
        self = this,
        cl = li.classList;

      cl.remove('active');

      if (s) {
        cl.add('active');
      }

      if (! nodeact) {
        this.parent.options
          .forEach(o => {
            if (o !== self) {
              o.setActive(false, true);
            }
        })
      }

      await this.managers.event.dispatch('setActive', s);
    }

/*------------------------------------------------------------------------------------------------*/

    /* Menu
     * @constructor
     * @param {object} o - config literal. See online help for attributes
     */
    const InstanceNavigationMenu = function (o) {

      this.name = 'menu';
      this.children = {
        options: 'option'
      }
      this.container = dom => dom.mk('ul', o.parent.container);
      bless.call(this, o);
      this.onClick = o.onClick;
    }

    /* Add multiple options to the menu
     * @param {Array} o
     * @returns {Promise} containing options
     */
    InstanceNavigationMenu.prototype.addOptions = async function (o) {

      const options = [];
      for (let option of o) {
        options.push(await this.addOption(option));
      }
      return options;
    }

    /* Add an option to the menu
     * @param {object} [o] config literal - see online help for attributes
     * @returns {Promise} containing an InstanceNavigationMenuOption
     */
    InstanceNavigationMenu.prototype.addOption = async function (o) {

      o = o || {};
      o.parent = this;
      var t = new InstanceNavigationMenuOption(o);
      arrayInsert(this.options, t, o);
      await this.managers.event.dispatch('addOption', t);
      if (o.menu) {
        return t.addMenu(o.menu);
      }
    }

    /* Destroys options on a menu
     * @param {Array} [o] optional options to destroy. Default is all.
     * @returns {Promise}
     */
    InstanceNavigationMenu.prototype.clear = function (o) {

      return Promise.all((o? o: this.options)
        .map(p => p.destroy()));
    }

/*------------------------------------------------------------------------------------------------*/

    /* Navigation
     * @param {object} [o] - config literal. See online help for attributes
     * @constructor
     */
    var InstanceNavigation = function (o) {

      o = o || {};
      this.name = 'instance.navigation';
      this.asRoot = true;
      this.container = dom => dom.mk('nav', o, null, o.className);
      bless.call(this, o);
      this.menu = new InstanceNavigationMenu({
        parent: this,
        onClick: o.onClick
      });
      this.managers.event.on('destroy', () => menu.destroy());
    }

    /* Async Constructor
     * @param {object} [o] - config literal. See online help for attributes
     * @returns {Promise}
     */
    InstanceNavigation.prototype.init = function (o) {

      if (o && o.options) {
        return this.menu.addOptions(o.options);
      }
    }

    return InstanceNavigation;
}

})(this);
