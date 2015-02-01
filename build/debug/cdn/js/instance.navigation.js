(function() {

'use strict';

module.requires = [
    { name:'instance.navigation.css' },
    { name:'core.language.js' }
];

module.exports = function(app) {

    var bless = app['core.bless'];

    var InstanceNavigationMenuOption = function(o) {
        bless.call(this,{
            name:'option',
            parent:o.parent,
        });
        var dom = this.managers.dom,
            li = this.li = dom.mk('li',null,null,o.className),
            w = this.wrapper = dom.mk('a',li),
            self = this, 
            parent = this.parent = o.parent,
            children = o.children;
        this.id = o.id || null;
        this.status = null;
        this.title = dom.mk('span',w,o.title);
        if (this.id) 
            li.classList.add(this.id);
        if (o.active) 
            o.status = 'active';
        this.setStatus(o.status || 'inactive',true);
        this.onClick = o.onClick || null;
        if (o && o.insertBefore) {
            parent.ul.insertBefore(li,o.insertBefore.li);
        } else {
            parent.ul.appendChild(li);
        }
        if (o.hide)
            this.hide();
        if (o.seo) {
            w.href = '#!/' + o.seo;
        } else if (o.href) {
            w.href = o.href;
        }
        if (! o.href) 
            w.addEventListener('click',function(event) {
                event.preventDefault();
                if (self.status ==='disabled' || ('selectable' in o && o.selectable === false)) 
                    return event.stopPropagation();
                if (self.onClick)
                    self.onClick(event);
            });
        if (children && children.pool) 
            this.menu = this.addMenu({ 
                pool:children.pool, 
                onClick:children.onClick || null
            });
        this.managers.event.on('destroy', function() {
            return dom.rm(li);
        });
    };
    InstanceNavigationMenuOption.prototype.addMenu = function(o) {
        var menu = this.children = new InstanceNavigationMenu({ 
            autosort:o && 'autosort' in o? o.autosort : this.parent.autosort, 
            parent:this, 
            container:dom.mk('div',null,null,'children'), 
            pool:o && o.pool?o.pool:null, 
            onClick:o && o.onClick? o.onClick:null 
        });
        this.managers.event.dispatch('addMenu',menu).then(function() {
            return menu;
        });
    };
    InstanceNavigationMenuOption.prototype.hide = function(v) {
        this.managers.dom.hide(this.li,v);
    };
    InstanceNavigationMenuOption.prototype.show = function() {
        this.managers.dom.show(this.li);
    };
    InstanceNavigationMenuOption.prototype.setActive = function() {
        return this.setStatus('active');
    };
    InstanceNavigationMenuOption.prototype.setInactive = function() {
        return this.setStatus('inactive');
    };
    InstanceNavigationMenuOption.prototype.setStatus = function(s,nodeact) {
        if (s === this.status) 
            return;
        var li = this.li,
            self = this,
            cl = li.classList,
            wrapper = this.wrapper,
            children = this.children;

        this.status = s;
        if (s === 'active') {
            cl.remove('inactive');
            cl.add('active');
        } else {
            cl.add('inactive');
            cl.remove('active');
        }
        // show children
        if (children) {
            if (s === 'active') {
                wrapper.appendChild(children.container);
            } else {
                wrapper.removeChild(children.container);
            }
        }
        // deactivate all parent siblings
        if (nodeact || ! this.parent || ! this.parent.options) 
            return;
        this.parent.options.forEach(function (o) {
            if (o !== self && o.status !== 'disabled') 
                o.setStatus('inactive',true);
        });
    };
    InstanceNavigationMenuOption.prototype.toggle = function() {
        if (this.status === 'disabled') 
            return;
        this.setStatus(this.status === 'active'? 'inactive' : 'active');
    };

    var InstanceNavigationMenu = function(o) {
        bless.call(this,{
            name:'menu',
            parent:o.parent
        });
        this.onClick = o.onClick? o.onClick : null;
        this.autosort = !! o.autosort;        
        var m = this.container = o.container,
            dom = this.managers.dom,
            self = this,
            ul = this.ul = dom.mk('ul',m, null, function() {
                this.addEventListener('click',function(event) {
                    if (self.onClick)
                        self.onClick.call(self,event);
                });
            }),
            opts = this.options = o.pool? o.pool.map(function(x) {
                x.parent = self;
                return new InstanceNavigationMenuOption(x);
            }) : [];
        this.managers.event
            .on('option.destroy', function(o) {
                opts.splice(opts.indexOf(o.value, 1));
            });
    };
    InstanceNavigationMenu.prototype.sort = function(sort) {
        if (typeof sort === 'boolean') 
            this.autosort = sort;
        if (! this.autosort || ! this.options) 
            return;
        var ul = this.ul,
            p = this.options.map(function (o) {
                return {
                    option:o,
                    title:o.title.innerHTML
                };
            });
        p.sort(function(a,b) {
            var x = a.title.toLowerCase(),
                y = b.title.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        });
        p.forEach(function (o) {
            var li = o.option.li;
            ul.removeChild(li);
            ul.appendChild(li);
        });
    };
    InstanceNavigationMenu.prototype.addOptions = function(o) {
        var self = this;
        return o.map(function (a) { 
            return self.addOption(a); 
        });
    };
    InstanceNavigationMenu.prototype.addOption = function(o) {
        o.parent = this;
        var t = new InstanceNavigationMenuOption(o);
        this.options.push(t);
        this.sort();
        dom.show(this.container);
        return this.managers.event.dispatch('addOption',t).then(function() {
            return t;
        });
    };
    InstanceNavigationMenu.prototype.clear = function(o) {
        return Promise.all((o? o:this.options).map(function (p) {
            return p.destroy(); 
        }));
    };

    var InstanceNavigation = function(o) {
        bless.call(this,{
            name:'instance.navigation',
            parent:o.parent,
            asRoot:true
        });
        var managers = this.managers,
            eventMgr = managers.event,
            dom = this.managers.dom,
            container = this.container = dom.mk('div',o.container,null,'instance-navigation'),
            nav = dom.mk('nav',container),
            self = this;
        this.menu = new InstanceNavigationMenu({ 
            autosort:'autosort' in o? o.autosort : true, 
            parent:this, 
            container:nav, 
            pool:o.pool, 
            onClick:o.onClick?o.onClick:null 
        });
        this.type = {
            value : null,
            set : function(type) {
                this.value=type;
                nav.className=type;
            }
        };
        this.type.set(o.type? o.type : 'default');
    };
    InstanceNavigation.prototype.hide = function(v) {
        this.managers.dom.hide(this.container,v);
    };
    InstanceNavigation.prototype.show = function() {
        this.managers.dom.show(this.container);
    };

    return InstanceNavigation;

};

})();