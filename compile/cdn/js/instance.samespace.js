(function() {

'use strict';

module.requires = [
    { name:'instance.samespace.css' },
    { name:'core.language.js' }
];

module.exports = function(app) {

    var dom = app['core.dom'],
        bless = app['core.bless'];

    var InstanceSameSpaceArea = function(o) {
        bless.call(this,{
            name:'space',
            parent:o.parent
        });
        var parent = o.parent,
            dom = this.managers.dom,
            self = this;
        this.li = dom.mk('li',parent.navMenu,null, function() {
            this.addEventListener('click',function() { 
                parent.stop(); 
                parent.to(self); 
            });
        });
        this.div = dom.mk('div',null,o.content,o.id);
    };

    var InstanceSameSpace = function (o)  {
        bless.call(this,{
            name:'instance.samespace',
            parent:o.parent,
            asRoot:true
        });
        var dom = this.managers.dom,
            spaces = this.spaces = [];
        this.current = -1;
        this.navNext = dom.mk('div');
        this.navPrevious = dom.mk('div');
        var delay = o.delay? o.delay : 5000,
            self = this,
            container = this.container = dom.mk('div',o.container,null,'instance-samespace'),
            canvas = this.canvas = dom.mk('div',container,null,'canvas'),
            navigation = this.navigation = document.createElement('nav'),
            navMenu = this.navMenu = dom.mk('ul',navigation);
        if (o.effect) 
            this.setEffect(o.effect);
        if (! o.transparent) 
            container.style.backgroundColor = 'black';
        if (o.spaces) {
            var elements = o.spaces;
            if (o.shuffle) {
                var len = spaces.length,
                    i = len;
                while (--i) {
                    var p = parseInt(Math.random()*len);
                    elements[i] = elements[p];
                    elements[p] = elements[i];
                }
            }
            elements.forEach(function (s) { 
                self.addSpace(s); 
            });
            if (! o.navOff && elements.length > 1) 
                this.toggleNavigation(true);
            this.to(this.spaces[0]);
        }
        this.loop = 'loop' in o? o.loop : true;
        if (o.autostart !== false) {
            this.canvas.setAttribute('status','playing');
            this.timerref = setInterval(function() {
                if (self.current === self.spaces.length-1 && ! self.loop) 
                    return self.stop();
                var to = self.current === self.spaces.length-1? 0 : self.current+1;
                self.to(self.spaces[to]);
            }, delay);
        }
        this.managers.event.on('space.destroy', function(space) {
            spaces.splice(spaces.indexOf(space),1);
        });
    };

    InstanceSameSpace.prototype.setEffect = function(name) {
        this.canvas.className = 'canvas '+name;
    };

    InstanceSameSpace.prototype.addSpace = function(o) {
        if (! o) 
            o={};
        o.parent = this;
        var s = new InstanceSameSpaceArea(o);
        this.spaces.push(s);
        return s;
    };

    InstanceSameSpace.prototype.stop = function() {
        if (this.timerref) 
            clearInterval(this.timerref);
        this.canvas.setAttribute('status','stopped');
    };

    InstanceSameSpace.prototype.to = function(s) {
        var spaces = this.spaces,
            i = spaces.indexOf(s);
        if (i === this.current) 
            return;
        this.current = i;
        var div = s.div;
        if (div.parentNode) 
            div.parentNode.removeChild(div);
        this.canvas.appendChild(div);
        spaces.forEach(function (a) {
            var cl = a.li.classList;
            if (s === a) {
                cl.add('active');
            } else {
                cl.remove('active');
            }
        });
    };

    InstanceSameSpace.prototype.hide = function(v) {
        this.managers.dom.hide(this.container,v);
    };
    
    InstanceSameSpace.prototype.show = function() {
        this.managers.dom.show(this.container);
    };

    InstanceSameSpace.prototype.toggleNavigation = function(p) {
        var navigation = this.navigation,
            h = navigation.parentNode;
        if (p && ! h) { 
            this.container.appendChild(navigation);
        } else if (h) {
            this.container.removeChild(navigation);
        }
    };

    return InstanceSameSpace;

};

})();


