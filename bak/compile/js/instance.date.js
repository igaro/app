module.requires = [
    { name:'core.date.js'},
    { name:'core.language.js'},
    { name:'3rdparty.moment.js'}
];

module.exports = function(app) {

    var events = app['core.events'],
        date = app['core.date'],
        moment = app['3rdparty.moment'],
        lang = app['core.language'];

    var dateObj = function(o) {
        var m = this.moment = moment(o.date),
            self = this,
            e = this.container = document.createElement('span'),
            erf = this.eventFunctions = {
                lang : function(v) {
                    moment.lang(v);
                    self.format();
                },
                tzoffset : function(v) {
                    if (! self.ov) 
                        self.offset(v,true);
                }
            };
        if (o.container) 
            o.container.appendChild(e);
        if (o.format) 
            this.f = o.format;
        if (o.offset) {
            this.offset(o.offset);
        } else {
            this.offset(date.offset.get(),true);
        }
        e.className = 'instance-date';
        events.on('core.date','offset.set', erf.tzoffset);
        events.on('core.language','code.set', erf.tzoffset);
    };
    
    dateObj.prototype.set = function(date) {
        this.moment = moment(date);
        this.format();
    };

    dateObj.prototype.offset = function(offset,nostore) {
        this.moment.zone(offset);
        if (! nostore) 
            this.ov = offset;
        this.format();
    };

    dateObj.prototype.format = function(f) {
        if (f) 
            this.f = f;
        this.container.innerHTML = this.moment.format(this.f);
    };

    dateObj.prototype.destroy = function() {
        var c = this.container,
            evt = this.eventFunctions;
        if (c && c.parentNode)
            c.parentNode.removeChild(c);
        events.remove(evt.tzoffset,'core.date','offset.set');
        events.remove(evt.language,'core.language','code.set');
    };

    return dateObj;

};




