//# sourceURL=instance.date.js

module.requires = [
    { name:'core.date.js'},
    { name:'core.language.js'},
    { name:'3rdparty.moment.js'}
];

module.exports = function(app) {

    "use strict";

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
        this.countUp = typeof o.countUp === 'number'? o.countUp : 0;
        this.countDown = typeof o.countDown === 'number'? o.countDown : 60;
        var self = this,
            m = self.moment = moment(o.date),
            erf = {
                lang : function() {
                    m.lang(language.env);
                    self.format();
                },
                tzoffset : function() {
                    if (! self.ov)
                        self.offset(date.envOffset,true);
                }
            };
        if (o.format)
            this.f = o.format;
        if (o.offset) {
            this.offset(o.offset);
        } else {
            this.offset(date.envOffset,true);
        }
        dateEventMgr.on('setEnvOffset',erf.tzoffset, { deps:[this] });
        languageEventMgr.on('setEnv',erf.lang, { deps:[this] });
        erf.lang();
        if (o.relative)
            this.relative();
        this.managers.event.on('destroy', function() {
            window.removeInterval(self.__relHook);
        });
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
        var self = this,
            container = self.container;
        var f = function() {
            var date = self.date,
                diff = parseInt((date.getTime()-(new Date()).getTime()) / 1000);
            if (diff !== 0) {
                if (diff < 0 && self.countUp >= (diff*-1)) {
                    diff *= -1;
                    return dom.setContent(container,language.mapKey(language.substitute(diff === 1? _tr("%[0] second ago") : _tr("%[0] seconds ago"),diff)));
                } else if (diff > 0 && diff <= self.countDown) {
                    return dom.setContent(container,language.mapKey(language.substitute(diff === 1? _tr("%[0] second") : _tr("%[0] seconds"),diff)));
                }
            }
            dom.setContent(container,self.moment.fromNow());
        };
        f();
        this.__relHook =  window.setInterval(f,1000);
    };

    InstanceDate.prototype.format = function(f) {
        if (f)
            this.f = f;
        this.container.innerHTML = this.moment.format(this.f);
    };

    return InstanceDate;

};

