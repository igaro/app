module.requires = [
    { name:'core.date.js'},
    { name:'core.language.js'},
    { name:'3rdparty.moment.js'}
];

module.exports = function(app) {

    var events = app['core.events'];
    var date = app['core.date'];
    var moment = app['3rdparty.moment'];
    var lang = app['core.language'];

    var instances = new Array();

    events.on('core.date','offset.set', function(v) {
        instances.forEach(function (o) {
            if (! o._ov) o.offset(v,true);
        });
    });

    events.on('core.language','code.set', function(v) {
        moment.lang(v);
        instances.forEach(function (o) {
            o.format();
        });
    });

    var x = function(o) {
        var self = this;
        var m = this.moment = moment(o.date);
        var e = this.container = document.createElement('span');
        if (o.container) o.container.appendChild(e);
        e.className = 'instance-date';
        if (o.format) this.f = o.format;
        if (o.offset) {
            this.offset(o.offset);
        } else {
            this.offset(date.offset.get(),true);
        }
        instances.push(this);
    };
    
    x.prototype.set = function(date) {
        this.moment.set(date);
        this.format();
    };

    x.prototype.offset = function(offset,nostore) {
        this.moment.zone(offset);
        if (! nostore) this.ov = offset;
        this.format();
    };

    x.prototype.format = function(f) {
        if (f) this.f = f;
        this.container.innerHTML = this.moment.format(this.f);
    };

    return x;


}




