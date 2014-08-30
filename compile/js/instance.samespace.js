module.requires = [
    { name:'instance.samespace.css' }
];

module.exports = function(app) {

    var a = function (o)  {

        var delay = o.delay? o.delay : 5000;
        var self = this;
        this.current = -1;
        this.spaces = new Array();
        var container = this.container = document.createElement('div');
        var canvas = this.canvas = document.createElement('div');
        var navigation = this.navigation = document.createElement('nav');
        var navMenu = this.navMenu = document.createElement('ul');
        this.navPrevious = document.createElement('div');
        this.navNext = document.createElement('div');
        navigation.appendChild(navMenu);
        this.canvas.className = 'canvas';
        if (o.effect) this.setEffect(o.effect);
        container.appendChild(canvas);
        container.className = 'instance-samespace';
        if (! o.transparent) container.style.backgroundColor = 'black';
        if (o.container) o.container.appendChild(container);
        if (o.elements) {
            var elements = this.elements = o.elements;
            if (o.shuffle) {
                var len = spaces.length;
                var i = len;
                while (i--) {
                    var p = parseInt(Math.random()*len);
                    elements[i] = elements[p];
                    elements[p] = elements[i];
                }
            }
            elements.forEach(function (s) { self.addSpace(s); });
            if (! o.navOff && elements.length > 1) this.toggleNavigation(true);
            this.to(this.spaces[0]);
        }
        this.loop = 'loop' in o? o.loop : true;
        if (o.autostart !== false) {
            this.canvas.setAttribute('status','playing');
            this.timerref = setInterval(function() {
                if (self.current === self.spaces.length-1 && ! self.loop) return self.stop();
                var to = self.current === self.spaces.length-1? 0 : self.current+1;
                self.to(self.spaces[to]);
            }, delay);
        }
    };

    a.prototype.setEffect = function(name) {
        this.canvas.className = 'canvas '+name;
    }

    a.prototype.addSpace = function(element) {
        var self = this;
        var div = document.createElement('div');
        if (element) div.appendChild(element);
        var li = document.createElement('li');
        this.navMenu.appendChild(li);
        div.className = 'a'+this.spaces.length;
        var s = { div:div, li:li };
        this.spaces.push(s);
        li.addEventListener('click',function() { self.stop(); self.to(s); });
    };

    a.prototype.stop = function() {
        if (this.timerref) clearInterval(this.timerref);
        this.canvas.setAttribute('status','stopped');
    };

    a.prototype.to = function(s) {
        var i = this.spaces.indexOf(s);
        if (i === this.current) { return; }
        this.current = i;
        var div = s.div;
        if (div.parentNode) div.parentNode.removeChild(s.div);
        var self = this;
        self.canvas.appendChild(s.div);
        this.spaces.forEach(function (a) {
            a.li.className = a.li === s.li? 'active' : '';
        });
    }

    a.prototype.toggleNavigation = function(p) {
        var navigation = this.navigation;
        var h = navigation.parentNode;
        if (p && ! h) this.container.appendChild(navigation);
        else if (h) this.container.removeChild(navigation);
    }

    return a;

};


