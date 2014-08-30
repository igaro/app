module.requires = [
    { name:'instance.navigation.css' },
    { name:'core.language.js' }
];

module.exports = function(app) {

    var language = app['core.language'];
    var events = app['core.events'];

    var opt = function(e) {
        var li = this.li = document.createElement('li');
        var self = this, parent = this.parent = e.parent;
        this.id = e.id? e.id : null;
        this.status = null;
        if (this.id) li.className = this.id;
        if (e.active) e.status = 'active';
        this.setStatus(e.status? e.status : 'inactive',true);
        this.onClick = e.onClick ? e.onClick : null;
        if (e.insertBefore) {
            parent.ul.insertBefore(li,e.insertBefore);
        } else {
            parent.ul.appendChild(li);
        }
        var w = this.wrapper = document.createElement('div');
        w.className = 'wrapper';
        li.appendChild(w);
        var a = this.title = document.createElement('div');
        a.className = 'text';
        if (e.title) {
            w.appendChild(a);
            var f = function() {
                a.innerHTML = language.mapKey(e.title);
                parent.sort();
            };
            f();
            events.on('core.language','code.set', f);
        }
        li.addEventListener('click',function(event) {
            if (self.status ==='disabled' || ('selectable' in e && e.selectable === false)) return;
            if (self.onClick) { self.onClick(event); }
            else if (self.parent.onClick) { self.parent.onClick.call(self,event); }
            event.stopPropagation();
        },false);
        var children = e.children;
        if (children && children.pool) this.menu = this.addMenu({ pool:children.pool, onClick:children.onClick?children.onClick:null });
    };

    opt.prototype.updateTitle = function(t) {
        if (! t) {
            if (this.title.parentNode) this.wrapper.removeChild(this.title);
        } else {
            if (! this.title.parentNode) this.wrapper.appendChild(this.title);
            this.title.innerHTML = t;
        }
    };

    opt.prototype.addMenu = function(o) {
        var cc = document.createElement('div');
        cc.className = 'children';
        return this.children = new menu({ autosort:o && o.autosort?true:false, parent:this, container:cc, pool:o && o.pool?o.pool:null, onClick:o && o.onClick?o.onClick:null });
    };

    opt.prototype.removeMenu = function() {
        if (! this.children) return;
        this.children.removeOption();
        this.children.container.removeChild(this.children.ul);
        this.children = null;
    };

    opt.prototype.setStatus = function(s,nodeact) {
        if (s === this.status) return;
        var li = this.li;
        var a = li.className.split(' ');
        var i = a.indexOf(this.status);
        if (i !== -1) a.splice(i,1);
        a.push(s);
        li.className = a.join(' ');
        this.status = s;
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
        if (nodeact || ! this.parent || ! this.parent.options) return;
        var self = this;
        this.parent.options.forEach(function (o) {
            if (o !== self && o.status !== 'disabled') o.setStatus('inactive',true);
        });
    };

    opt.prototype.toggle = function() {
        if (this.status === 'disabled') return;
        this.setStatus(this.status === 'active'? 'inactive' : 'active');
    };

    var menu = function(o) {
        this.parent = o.parent;
        this.onClick = o.onClick? o.onClick : null;
        this.autosort = o.autosort? true:false;
        var m = this.container = o.container;
        var self = this;
        this.ul = document.createElement('ul');
        m.appendChild(this.ul);
        this.options = o.pool? o.pool.map(function(x) {
            x.parent = self;
            return new opt(x);
        }) : new Array();
    };

    menu.prototype.sort = function() {
        if (! this.autosort) return;
        var ul = this.ul;
        var p = this.options.map(function (o) {
            return {
                option:o,
                title:o.title.innerHTML
            }
        });
        p.sort(function(a,b) {
            var x = a.title.toLowerCase();
            var y = b.title.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0
        });
        p.forEach(function (o) {
            var li = o.option.li
            ul.removeChild(li);
            ul.appendChild(li);
        });
    };

    menu.prototype.addOptions = function(o) {
        var self = this;
        o.forEach(function (a) { self.addOption(a) });
    };

    menu.prototype.addOption = function(o) {
        o.parent = this;
        var t = new opt(o);
        this.options.push(t);
        this.sort();
        return t;
    };

    menu.prototype.removeOption = function(o) {
        o.parent.ul.removeChild(o.li);
        //if (p.onRemove) p.onRemove();
        this.options.pop(this.options.indexOf(o));
    };

    menu.prototype.removeOptions = function(o) {
        (o? o:this.options).forEach(function (p) { this.removeOption(p) });
    };

    return function(o) {
        var div = this.container = document.createElement('div');
        div.className = 'instance-navigation';
        var nav = document.createElement('nav');
        div.appendChild(nav);
        this.menu = new menu({ autosort:o.autosort, parent:this, container:nav, pool:o.pool, onClick:o.onClick?o.onClick:null });
        if (o.container) o.container.appendChild(div);
        this.type = {
            value : null,
            set : function(type) {
                this.value=type;
                nav.className=type;
            }
        }
        this.type.set(o.type? o.type : 'default');
    };

};