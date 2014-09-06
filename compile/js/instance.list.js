module.requires = [
    { name:'core.language.js'}
];

module.exports = function(app) {

    var events = app['core.events'];
    var lang = app['core.language'];

    var instances = [];
    events.on('core.language','code.set', function(v) {
        instances.forEach(function (o) {
            o.pool.forEach(setOptLang);
        });
    });

    var setOptLang = function(o) {
        if (o.text && typeof o.text === 'object') o.li.innerHTML = lang.mapKey(o.text);
    }

    var x = function(o) {
        var self = this;
        var c = this.container = document.createElement('ul');
        c.className = 'instance-list';
        this.pool = [];
        if (o) {
            if (o.options) o.options.forEach(function (o) { self.add(o) });
            if (o.container) o.container.appendChild(c);
        }
        instances.push(this);
    };
    x.prototype.add = function(o,shift) {
        var li = o.li = document.createElement('li');
        if (o.id) li.className=o.id;
        if (o.append) li.appendChild(o.append);
        setOptLang(o);
        this.pool.push(o);
        if (shift) { this.shift(o,shift); }
        else { this.container.appendChild(li) }
    };

    x.prototype.remove = function(o) {
        if (o.li.parentNode) this.container.removeChild(o.li);
        pool.splice(pool.indexOf(o),1);
    };

    x.prototype.shift = function(o,places) {
        var pool = this.pool;
        var i = pool.indexOf(o);
        if (places+i >= pool.length) {
            places = places+i;
            while (places >= 0) { places -= pool.length; }
            places--;
        }
        if (o.li.parentNode) this.container.removeChild(o.li);
        pool.splice(i+places,0,pool.splice(i,1)[0]);
        i = pool.indexOf(o);
        if (i === pool.length-1) this.container.appendChild(o.li);
        else this.container.insertBefore(o.li,pool[i+1].li);
    };

    return x;

}
