module.requires = [
    { name:'core.language.js'}
];

module.exports = function(app) {

    var events = app['core.events'],
        lang = app['core.language'],
        instances = [];

    var item = function(o) {
        var li = this.li = document.createElement('li');
        if (o.id) {
            this.id = o.id;
            li.className=o.id;
        }
        if (o.append) 
            li.appendChild(o.append);
        this.setText(o.text);
    };

    item.prototype.setText = function(t) {
        if (t)
            this.text = t;
        t = this.text;
        if (t && typeof t === 'object') 
            this.li.innerHTML = lang.mapKey(t);
    };

    var list = function(o) {
        var self = this,
            c = this.container = document.createElement('ul');
        c.className = 'instance-list';
        this.pool = [];
        if (o) {
            if (o.options) 
                o.options.forEach(function (o) { 
                    self.add(o); 
                });
            if (o.container) 
                o.container.appendChild(c);
        }
        var evt = this.eventLang = function() {
            self.pool.forEach(function (x) {
                x.setText(); 
            });
        };
        events.on('core.language','code.set',evt);

    };
    list.prototype.add = function(o,shift) {
        var t = new item(o);
        this.pool.push(t);
        if (shift) { 
            this.shift(t,shift); 
        } else { 
            this.container.appendChild(t.li); 
        }
    };

    list.prototype.remove = function(o) {
        if (o.li.parentNode) 
            this.container.removeChild(o.li);
        pool.splice(pool.indexOf(o),1);
    };

    list.prototype.shift = function(o,places) {
        var pool = this.pool,
            i = pool.indexOf(o);
        if (places+i >= pool.length) {
            places = places+i;
            while (places >= 0) { 
                places -= pool.length;
            }
            --places;
        }
        if (o.li.parentNode) 
            this.container.removeChild(o.li);
        pool.splice(i+places,0,pool.splice(i,1)[0]);
        i = pool.indexOf(o);
        if (i === pool.length-1) { 
            this.container.appendChild(o.li);
        } else {
            this.container.insertBefore(o.li,pool[i+1].li);
        }
    };

    list.prototype.destroy = function() {
        var c = this.container;
        if (c && c.parentNode)
            c.parentNode.removeChild(c);
        events.remove(this.eventLang, 'core.language','code.set');
    };

    return list;

};
