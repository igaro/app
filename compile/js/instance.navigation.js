module.requires = [
    { name:'instance.navigation.css' },
    { name:'core.language.js' }
];

module.exports = function(app) {

    var language = app['core.language'],
        events = app['core.events'];

    var opt = function(e) {
        var li = this.li = document.createElement('li'),
            self = this, 
            parent = this.parent = e.parent;
        this.id = e.id || null;
        this.status = null;
        if (this.id) 
            li.className = this.id;
        if (e.active) 
            e.status = 'active';
        this.setStatus(e.status || 'inactive',true);
        this.onClick = e.onClick || null;
        if (e.insertBefore) {
            parent.ul.insertBefore(li,e.insertBefore.li);
        } else {
            parent.ul.appendChild(li);
        }
        var w = this.wrapper = document.createElement('div');
        w.className = 'wrapper';
        li.appendChild(w);
        var a = this.title = document.createElement('div');
        a.className = 'text';
        if (e.title)
            this.updateTitle(e.title);
        li.addEventListener('click',function(event) {
            if (self.status ==='disabled' || ('selectable' in e && e.selectable === false)) 
                return;
            if (self.onClick) {
                self.onClick(event);
            } else if (self.parent.onClick) { 
                self.parent.onClick.call(self,event); 
            }
            event.stopPropagation();
        },false);
        var children = e.children;
        if (children && children.pool) 
            this.menu = this.addMenu({ 
                pool:children.pool, 
                onClick:children.onClick || null
            });
    };

    opt.prototype.updateTitle = function(t) {
        var self = this;
        if (! t) {
            if (this.title.parentNode) 
                this.wrapper.removeChild(this.title);
            if (this.eventLang)
                events.remove(this.eventLang,'core.language','code.set');
        } else {
            var f = function() {
                self.title.innerHTML = language.mapKey(t);
                self.parent.sort();
            };
            if (! this.title.parentNode) {
                this.wrapper.appendChild(this.title);
                this.eventLang = events.on('core.language','code.set', f);
            }
            f();
        }
    };

    opt.prototype.addMenu = function(o) {
        var cc = document.createElement('div');
        cc.className = 'children';
        var children = this.children = new menu({ 
            autosort:o && 'autosort' in o || this.parent.autosort, 
            parent:this, 
            container:cc, 
            pool:o && o.pool?o.pool:null, 
            onClick:o && o.onClick? o.onClick:null 
        });
        return children;
    };

    opt.prototype.removeMenu = function() {
        if (! this.children) 
            return;
        this.children.removeOptions();
        this.children.container.removeChild(this.children.ul);
        this.children = null;
    };

    opt.prototype.setStatus = function(s,nodeact) {
        if (s === this.status) 
            return;
        var li = this.li,
            self = this,
            cl = li.classList;

        this.status = s;

        if (s === 'active') {
            cl.remove('inactive');
            cl.add('active');
        } else {
            cl.add('inactive');
            cl.remove('active');
        }

        // show children
        var children = this.children;
        if (children) {
            if (s === 'active') {
                this.wrapper.appendChild(this.children.container);
            } else {
                this.wrapper.removeChild(this.children.container);
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

    opt.prototype.toggle = function() {
        if (this.status === 'disabled') 
            return;
        this.setStatus(this.status === 'active'? 'inactive' : 'active');
    };

    var menu = function(o) {
        this.parent = o.parent;
        this.onClick = o.onClick? o.onClick : null;
        this.autosort = !! o.autosort;        
        var m = this.container = o.container,
            self = this;
        this.ul = document.createElement('ul');
        m.appendChild(this.ul);
        this.options = o.pool? o.pool.map(function(x) {
            x.parent = self;
            return new opt(x);
        }) : [];
    };

    menu.prototype.sort = function(sort) {
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

    menu.prototype.addOptions = function(o) {
        var self = this;
        o.forEach(function (a) { 
            self.addOption(a); 
        });
    };

    menu.prototype.addOption = function(o) {
        o.parent = this;
        var t = new opt(o);
        this.options.push(t);
        this.sort();
        this.container.classList.remove('hide');
        return t;
    };

    menu.prototype.removeOption = function(o) {
        o.parent.ul.removeChild(o.li);
        if (o.eventLang)
            events.remove(o.eventLang,'core.language','code.set');
        this.options.pop(this.options.indexOf(o));
        if (! this.options.length)
            this.container.classList.add('hide');
    };

    menu.prototype.removeOptions = function(o) {
        (o? o:this.options).forEach(function (p) { 
            this.removeOption(p); 
        });
    };

    var navObj = function(o) {
        var div = this.container = document.createElement('div');
        div.className = 'instance-navigation';
        var nav = document.createElement('nav');
        div.appendChild(nav);
        this.menu = new menu({ 
            autosort:'autosort' in o? o.autosort : true, 
            parent:this, 
            container:nav, 
            pool:o.pool, 
            onClick:o.onClick?o.onClick:null 
        });
        if (o.container) 
            o.container.appendChild(div);
        this.type = {
            value : null,
            set : function(type) {
                this.value=type;
                nav.className=type;
            }
        };
        this.type.set(o.type? o.type : 'default');
    };

    navObj.prototype.destroy = function() {
        var c = this.container;
        if (c && c.parentNode)
            c.parentNode.removeChild(c);
        this.removeOptions();
    };

    return navObj;

};