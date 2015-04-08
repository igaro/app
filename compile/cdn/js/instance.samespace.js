(function() {

'use strict';

module.requires = [
    { name:'instance.samespace.css' }
];

module.exports = function(app) {

    var bless = app['core.bless'];

    var InstanceSameSpaceArea = function(o) {
        bless.call(this,{
            name:'space',
            stash:o.stash,
            hidden:o.hidden,
            disabled:o.disabled,
            parent:o.parent,
            container:function(dom) {
                return dom.mk('div',null,o.content,o.className);
            }
        });
        var parent = this.parent,
            self = this;
        this.li = this.managers.dom.mk('li',parent.nav.firstChild,null,function() {
            this.addEventListener('click',function() { 
                return parent.stop().then(function() { 
                    return parent.to(self);
                }).catch(function (e) {
                    return self.managers.debug.handle(e);
                });
            });
        });
    };

    var InstanceSameSpace = function (o)  {
        var self = this;
        bless.call(this,{
            name:'instance.samespace',
            parent:o.parent,
            stash:o.stash,
            hidden:o.hidden,
            disabled:o.disabled,
            asRoot:true,
            container : function(dom) {
                return dom.mk('div',o.container,null,function() {
                    if (o.className)
                        this.classList.add(o.className);
                    self.canvas = dom.mk('div',this,null,o.effect);
                })
            }
        });
        var container = this.container,
            domMgr = this.managers.dom,
            spaces = this.spaces = [];
        this.current = -1;
        this.delay = o.delay || 5000;
        this.nav = domMgr.mk('nav',container,domMgr.mk('ul'));
        if (! o.transparent) 
            this.canvas.style.backgroundColor = 'black';
        this.loop = typeof o.loop === 'boolean'? o.loop : true;
        this.managers.event.on('space.destroy', function(space) {
            spaces.splice(spaces.indexOf(space),1);
        });
    };

    InstanceSameSpace.prototype.init = function(o) {
        var self = this,
            spaces = o.spaces;
        return (spaces
            ?
            self.addSpaces(spaces)
            :
            Promise.resolve()
        ).then(function(spaces) {
            return (self.spaces.length?
                self.to(self.spaces[0])
                :
                Promise.resolve()
            ).then(function() {
                if (typeof o.start === 'boolean' && o.start)
                    return self.start();
            });
        });
    };

    InstanceSameSpace.prototype.addSpaces = function(o) {
        var self = this;
        return o.reduce(function(a,b) {
            return a.then(function() {
                return self.addSpace(b);
            });
        },Promise.resolve());
    };

    InstanceSameSpace.prototype.addSpace = function(o) {
        o.parent = this;
        var s = new InstanceSameSpaceArea(o);
        this.spaces.push(s);
        return this.managers.event.dispatch('addSpace',s);
    };

    InstanceSameSpace.prototype.stop = function() {
        if (this.timerref) 
            clearInterval(this.timerref);
        this.canvas.setAttribute('status','stopped');
        return this.managers.event.dispatch('stop');
    };

    InstanceSameSpace.prototype.start = function() {
        if (this.timerref) 
            clearInterval(this.timerref);
        var self = this;
        this.canvas.setAttribute('status','playing');
        this.timerref = setInterval(function() {
            if (self.current === self.spaces.length-1 && ! self.loop) 
                return self.stop();
            var to = self.current === self.spaces.length-1? 0 : self.current+1;
            self.to(self.spaces[to]);
        }, self.delay);
        return this.managers.event.dispatch('start');
    };

    InstanceSameSpace.prototype.to = function(s) {
        var spaces = this.spaces,
            i = spaces.indexOf(s);
        if (i === this.current) 
            return;
        this.current = i;
        this.canvas.appendChild(s.container);
        spaces.forEach(function (a) {
            var cl = a.li.classList;
            if (s === a) {
                cl.add('active');
            } else {
                cl.remove('active');
            }
        });
        return this.managers.event.dispatch('to',s);
    };

    return InstanceSameSpace;

};

})();


