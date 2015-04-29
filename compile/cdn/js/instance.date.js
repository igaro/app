(function() {

'use strict';

module.requires = [
    { name:'core.date.js'},
    { name:'core.language.js'},
    { name:'3rdparty.moment.js'}
];

module.exports = function(app) {

    var date = app['core.date'],
        dom = app['core.dom'],
        moment = app['3rdparty.moment'],
        language = app['core.language'],
        bless = app['core.object'].bless;

    var dateEventMgr = date.managers.event,
        languageEventMgr = language.managers.event;

    var InstanceDate = function(o) {
        this.name='instance.date';
        this.asRoot=true;
        this.container=function(dom) {
            return dom.mk('span',o.container,null,o.className);
        };
        bless.call(this,o);
        this.date = o.date;
        this.countDown = 60;
        this.countUp = 0;
        var self = this,
            m = self.moment = moment(o.date),
                erf = {
                    lang : function() {
                        m.lang(language.env);
                        self.format();
                    },
                    tzoffset : function(v) {
                        if (! self.ov) 
                            self.offset(date.envOffset,true);
                    }
                };
        if (o.format) 
            this.f = o.format;
        if (o.offset) {
            this.offset(o.offset);
        if (typeof o.countDown === 'number')
            this.countDown = o.countDown;
        if (typeof o.countUp === 'number')
            this.countUp = o.countUp;
        } else {
            this.offset(date.envOffset,true);
        }
        dateEventMgr.extend(this).on('setEnvOffset',erf.tzoffset);
        languageEventMgr.extend(this).on('setEnv',erf.lang);
        erf.lang();
    };

    InstanceDate.prototype.init = function() {
        return this.managers.event.dispatch('init');
    };
    
    InstanceDate.prototype.set = function(date) {
        this.date = date;
        this.moment = moment(date);
        this.format();
        return this.managers.event.dispatch('set',date);
    };

    InstanceDate.prototype.offset = function(offset,nostore) {
        this.moment.zone(offset);
        if (! nostore) 
            this.ov = offset;
        this.format();
    };

    InstanceDate.prototype.relative = function() {
        var self = this;
        var f = function() {
            var date = self.date,
                diff = parseInt((date.getTime()-(new Date()).getTime()) / 1000);
            dom.setContent(
                self.countUp !== self.countDown && self.countUp <= diff && diff <= self.countDown
                ?
                language.mapKey(language.substitute(diff === 1? (diff < 0? _tr("%[0] seconds ago") : _tr("%[0] second")) : (diff < 0? _tr("%d seconds ago") : _tr("%d seconds")),diff))
                :
                self.moment.fromNow()
            );
        };
        f();
        return setInterval(f,1000);
    };

    InstanceDate.prototype.format = function(f) {
        if (f) 
            this.f = f;
        this.container.innerHTML = this.moment.format(this.f);
    };

    return InstanceDate;

};

})();


