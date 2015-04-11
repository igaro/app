(function() {

'use strict';

module.requires = [
    { name:'instance.navigation.css' },
    { name:'core.language.js' }
];

module.exports = function(app) {

    var bless = app['core.bless'];

    var InstanceNavigationMenuOption = function(o) {
        var self = this;
        this.onClick = o.onClick;
        this.status = 0;
        bless.call(this,{
            name:'option',
            stash:o.stash,
            parent:o.parent,
            disabled:o.disabled,
            hidden:o.hidden,
            container:function (dom) {
                return dom.mk('li',o.parent.container,null,function() {
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
            }
        });
        this.managers.event.on('disabled', function() {
           self.setActive(false);
        });
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
            this.parent.pool.forEach(function (o) {
                if (o !== self) 
                    o.setActive(false,true);
            });
    };

    var InstanceNavigationMenu = function(o) {
        var self = this;
        this.onClick = o.onClick;
        bless.call(this,{
            name:'menu',
            parent:o.parent,
            stash:o.stash,
            container:function(dom) {
                return dom.mk('ul',o.parent.container);
            }
        });
        var pool = this.pool = [];
        this.managers.event
            .on('option.destroy', function(o) {
                pool.splice(pool.indexOf(o.value, 1));
            });
    };

    InstanceNavigationMenu.prototype.addOptions = function(o) {
        var self = this;
        return o.reduce(function(a,b) {
            return a.then(function() {
                return self.addOption(b);
            });
        }, Promise.resolve());
    };
    InstanceNavigationMenu.prototype.addOption = function(o) {
        o.parent = this;
        var t = new InstanceNavigationMenuOption(o);
        this.pool.push(t);
        return this.managers.event.dispatch('addOption',t).then(function() {
            if (o.menu) {
                return t.addMenu(o.menu).then(function() {
                    return t;
                });
            }
            return t;
        });
    };
    InstanceNavigationMenu.prototype.clear = function(o) {
        return Promise.all((o? o:this.pool).map(function (p) {
            return p.destroy(); 
        }));
    };

    var InstanceNavigation = function(o) {
        bless.call(this,{
            name:'instance.navigation',
            parent:o.parent,
            stash:o.stash,
            asRoot:true,
            container:function(dom) {
                return dom.mk('nav',o.container,null,o.className);
            }
        });
        this.menu = new InstanceNavigationMenu({ 
            parent:this, 
            onClick:o.onClick 
        });
    };
    InstanceNavigation.prototype.init = function(o) {
        if (o.pool)
            return this.menu.addOptions(o.pool);
        return Promise.resolve();
    };

    return InstanceNavigation;

};

})();
