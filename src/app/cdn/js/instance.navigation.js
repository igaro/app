//# sourceURL=instance.navigation.js

(function(env) {

    module.requires = [
        { name:'instance.navigation.css' },
        { name:'core.language.js' }
    ];

    module.exports = function(app) {

        "use strict";

        var object = app['core.object'],
            bless = object.bless,
            arrayInsert = object.arrayInsert;

/*------------------------------------------------------------------------------------------------*/

        /* Option
         * @constructor
         * @param {object} o - config literal. See online help for attributes
         */
        var InstanceNavigationMenuOption = function(o) {

            var self = this,
                parent = o.parent;

            this.name = 'option';
            this.container = function (dom) {

                return dom.mk('li',parent.container,null,function() {

                    if (o.className)
                        this.classList.add(o.className);

                    dom.mk('a',this,null,function() {

                        dom.mk('span',this,o.title);

                        if (o.href)
                            this.href = o.href;

                        this.addEventListener('click',function(event) {

                            event.preventDefault();
                            if (self.disabled)
                                return event.stopImmediatePropagation();

                            return Promise.resolve().then(function() {

                                return (self.onClick? self.onClick.call(self,event) : Promise.resolve()).then(function() {

                                    return (parent.onClick? parent.onClick.call(parent,event) : Promise.resolve()).then(function() {

                                        self.setActive();
                                    });
                                });
                            })['catch'](function(e) {

                                event.stopImmediatePropagation();
                                return self.managers.debug.handle(e);
                            });
                        });
                    });
                });
            };

            bless.call(this,o);

            this.managers.event.on('disable', function() {

               self.setActive(self.disabled);
            });
            this.onClick = o.onClick;
            this.status = 0;

            if (o.active)
                this.setActive();
        };

        /* Sets option as active, unless disabled
         * @param {boolean} [s] - optional value
         * @param {boolean} [nodeact] set silbings inactive, default true
         * @returns {Promise}
         */
        InstanceNavigationMenuOption.prototype.setActive = function(s,nodeact) {

            if (this.disabled)
                return;

            s = typeof s !== 'boolean' || s;

            if (this.active === s)
                return;

            this.active = s;

            var li = this.container,
                self = this,
                cl = li.classList;

            cl.remove('active');

            if (s)
                cl.add('active');

            if (! nodeact) {
                this.parent.options.forEach(function (o) {

                    if (o !== self)
                        o.setActive(false,true);
                });
            }

            return this.managers.event.dispatch('setActive',s);
        };

/*------------------------------------------------------------------------------------------------*/

        /* Menu
         * @constructor
         * @param {object} o - config literal. See online help for attributes
         */
        var InstanceNavigationMenu = function(o) {

            this.name = 'menu';
            this.children = {
                options:'option'
            };
            this.container = function(dom) {

                return dom.mk('ul',o.parent.container);
            };
            bless.call(this,o);
            this.onClick = o.onClick;
        };

        /* Add multiple options to the menu
         * @param {Array} o
         * @returns {Promise} containing options
         */
        InstanceNavigationMenu.prototype.addOptions = function(o) {

            var self = this;
            return object.promiseSequencer(o,function(a) {

                return self.addOption(a);
            });
        };

        /* Add an option to the menu
         * @param {object} [o] config literal - see online help for attributes
         * @returns {Promise} containing an InstanceNavigationMenuOption
         */
        InstanceNavigationMenu.prototype.addOption = function(o) {

            o = o|| {};
            o.parent = this;
            var t = new InstanceNavigationMenuOption(o);
            arrayInsert(this.options,t,o);
            return this.managers.event.dispatch('addOption',t).then(function() {

                return o.menu? t.addMenu(o.menu).then(function() {

                    return t;
                }): t;
            });
        };

        /* Destroys options on a menu
         * @param {Array} [o] optional options to destroy. Default is all.
         * @returns {Promise}
         */
        InstanceNavigationMenu.prototype.clear = function(o) {

            return Promise.all((o? o:this.options).map(function (p) {

                return p.destroy();
            }));
        };

/*------------------------------------------------------------------------------------------------*/

        /* Navigation
         * @param {object} [o] - config literal. See online help for attributes
         * @constructor
         */
        var InstanceNavigation = function(o) {

            o = o || {};
            this.name = 'instance.navigation';
            this.asRoot = true;
            this.container = function(dom) {

                return dom.mk('nav',o,null,o.className);
            };
            bless.call(this,o);
            var menu = this.menu = new InstanceNavigationMenu({
                parent:this,
                onClick:o.onClick
            });
            this.managers.event.on('destroy', function() {

                return menu.destroy();
            });
        };

        /* Async Constructor
         * @param {object} [o] - config literal. See online help for attributes
         * @returns {Promise}
         */
        InstanceNavigation.prototype.init = function(o) {

            if (o && o.options)
                return this.menu.addOptions(o.options);
        };

        return InstanceNavigation;

    };

})(this);
