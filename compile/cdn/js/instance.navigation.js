//# sourceURL=instance.navigation.js

module.requires = [
    { name:'instance.navigation.css' },
    { name:'core.language.js' }
];

module.exports = function(app) {

    "use strict";

    var object = app['core.object'],
        bless = object.bless,
        arrayInsert = object.arrayInsert;

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
                        }).catch(function(e) {
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
        if (! nodeact)
            this.parent.options.forEach(function (o) {
                if (o !== self)
                    o.setActive(false,true);
            });
    };

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
    InstanceNavigationMenu.prototype.addOptions = function(o) {
        var self = this;
        return object.promiseSequencer(o,function(a) {
            return self.addOption(a);
        });
    };
    InstanceNavigationMenu.prototype.addOption = function(o) {
        o.parent = this;
        var t = new InstanceNavigationMenuOption(o);
        arrayInsert(this.options,t,o);
        return this.managers.event.dispatch('addOption',t).then(function() {
            return o.menu? t.addMenu(o.menu).then(function() {
                return t;
            }): t;
        });
    };
    InstanceNavigationMenu.prototype.clear = function(o) {
        return Promise.all((o? o:this.options).map(function (p) {
            return p.destroy();
        }));
    };

    var InstanceNavigation = function(o) {
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
    InstanceNavigation.prototype.init = function(o) {
        if (o.options)
            return this.menu.addOptions(o.options);
        return Promise.resolve();
    };

    return InstanceNavigation;

};
