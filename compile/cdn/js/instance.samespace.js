//# sourceURL=instance.samespace.js

module.requires = [
    { name:'instance.samespace.css' }
];

module.exports = function(app) {

    'use strict';

    var object = app['core.object'],
        bless = object.bless,
        arrayInsert = object.arrayInsert;

    var InstanceSameSpaceArea = function(o) {
        this.name='space';
        this.container=function(dom) {
            return dom.mk('div',null,o.content,o.className);
        };
        bless.call(this,o);
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
        this.name = 'instance.samespace';
        this.asRoot = true;
        this.children = {
            spaces:'space'
        };
        this.container = function(dom) {
            return dom.mk('div',o,null,function() {
                if (o.className)
                    this.classList.add(o.className);
                self.canvas = dom.mk('div',this,null,o.effect);
            });
        };
        this.current = -1;
        this.delay = o.delay || 5000;
        bless.call(this,o);
        var managers = this.managers,
            domMgr = managers.dom;
        this.nav = domMgr.mk('nav',this,domMgr.mk('ul'));
        if (! o.transparent)
            this.canvas.style.backgroundColor = 'black';
        this.loop = typeof o.loop === 'boolean'? o.loop : true;
        managers.event.on('destroy', function() {
            if (self.timerRef)
                window.clearInterval(self.timerRef);
        });

    };

    InstanceSameSpace.prototype.init = function(o) {
        var self = this,
            spaces = o.spaces;
        return (spaces?
            self.addSpaces(spaces)
            :
            Promise.resolve()
        ).then(function() {
            return (self.spaces.length?
                self.to(self.spaces[0])
                :
                Promise.resolve()
            ).then(function() {
                if (o.start)
                    return self.start();
            });
        });
    };

    InstanceSameSpace.prototype.addSpaces = function(o) {
        var self = this;
        return object.promiseSequencer(o,function(a) {
            return self.addSpace(a);
        });
    };

    InstanceSameSpace.prototype.addSpace = function(o) {
        o.parent = this;
        var s = new InstanceSameSpaceArea(o);
        arrayInsert(this.spaces,s,o);
        return this.managers.event.dispatch('addSpace',s);
    };

    InstanceSameSpace.prototype.stop = function() {
        if (this.timerRef)
            window.clearInterval(this.timerRef);
        this.canvas.setAttribute('status','stopped');
        return this.managers.event.dispatch('stop');
    };

    InstanceSameSpace.prototype.start = function() {
        if (this.timerRef)
            window.clearInterval(this.timerRef);
        var self = this;
        this.canvas.setAttribute('status','playing');
        this.timerRef = window.setInterval(function() {
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
