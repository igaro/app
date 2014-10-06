module.requires = [
    { name:'instance.samespace.css' }
];

module.exports = function(app) {

    var a = function (o)  {

        this.current = -1;
        this.spaces = [];
        this.navNext = document.createElement('div');
        this.navPrevious = document.createElement('div');

        var delay = o.delay? o.delay : 5000,
            self = this,
            container = this.container = document.createElement('div'),
            canvas = this.canvas = document.createElement('div'),
            navigation = this.navigation = document.createElement('nav'),
            navMenu = this.navMenu = document.createElement('ul');
        
        canvas.className = 'canvas';
        navigation.appendChild(navMenu);
        container.appendChild(canvas);
        container.className = 'instance-samespace';

        if (o.effect) 
            this.setEffect(o.effect);
        if (! o.transparent) 
            container.style.backgroundColor = 'black';
        if (o.container) 
            o.container.appendChild(container);
        if (o.elements) {
            var elements = this.elements = o.elements;
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
    };

    a.prototype.setEffect = function(name) {
        this.canvas.className = 'canvas '+name;
    };

    a.prototype.addSpace = function(element) {
        var self = this,
            div = document.createElement('div'),
            li = document.createElement('li'),
            s = { div:div, li:li };
        if (element) 
            div.appendChild(element);
        this.navMenu.appendChild(li);
        div.className = 'a'+this.spaces.length;
        this.spaces.push(s);
        li.addEventListener('click',function() { 
            self.stop(); 
            self.to(s); 
        });
    };

    a.prototype.stop = function() {
        if (this.timerref) 
            clearInterval(this.timerref);
        this.canvas.setAttribute('status','stopped');
    };

    a.prototype.to = function(s) {
        var i = this.spaces.indexOf(s);
        if (i === this.current) 
            return;
        this.current = i;
        var div = s.div;
        if (div.parentNode) 
            div.parentNode.removeChild(div);
        this.canvas.appendChild(div);
        this.spaces.forEach(function (a) {
            a.li.className = a.li === s.li? 'active' : '';
        });
    };

    a.prototype.toggleNavigation = function(p) {
        var navigation = this.navigation,
            h = navigation.parentNode;
        if (p && ! h) { 
            this.container.appendChild(navigation);
        } else if (h) {
            this.container.removeChild(navigation);
        }
    };

    a.prototype.destroy = function() {
        var c = this.container;
        if (c && c.parentNode)
            c.parentNode.removeChild(c);
    };

    return a;

};


