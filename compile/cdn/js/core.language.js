//# sourceURL=core.language.js

module.requires = [
    { name: 'core.store.js' },
    { name: 'core.url.js' }
];

module.exports = function(app, params) {

    "use strict";

    var store = app['core.store'],
        url = app['core.url'],
        coreObject = app['core.object'],
        bless = coreObject.bless,
        promiseSequencer = coreObject.promiseSequencer;

    var detect = function() {
        return language.managers.store.get('env').then(function (stored) {
            var set = false;
            return promiseSequencer([
                stored,
                params.conf.localeLanguage,
                url.getParam('localeLanguage'),
                window.navigator.userLanguage || window.navigator.language,
                'en-US',
                'en'
            ], function(b,i) {
                if (! set)
                    return language.setEnv(b,true).then(
                        function() {
                            language.isAuto = i !== 0;
                            set = true;
                        },
                        function () { }
                    );
            }).then(
                function () {
                    if (! set)
                        throw new Error('Language failed to set');
                }
            );
        });
    };

    var language = {

        name:'core.language',
        managers : {
            store : store
        },
        env : null,
        rtl:false,
        isAuto : null,
        pool : {},

        setPool : function(o) {
            this.pool = o;
            return this.managers.event.dispatch('setPool');
        },

        reset : function() {
            var self = this;
            return this.managers.store.set('env').then(function() {
                self.isAuto = true;
                return detect();
            });
        },

        setEnv : function(id,noStore) {
            var self = this,
                managers = this.managers;
            return Promise.resolve().then(function () {
                if (id.length > 2)
                    id = id.substr(0,3)+id.substr(3).toUpperCase();
                var o = self.pool[id];
                if (! o)
                    throw { error:'Code is not in pool.', value:id, pool:self.pool };
                self.env = id;
                document.body.style.textAlign = o.rL? 'right' : 'left';
                self.rtl = o.rtl === true;
                if (! noStore)
                    self.isAuto = false;
                return (noStore? Promise.resolve() : managers.store.set('env',id)).then(function() {
                    return managers.event.dispatch('setEnv',id);
                });
            });
        },

        getFromPoolById : function(id) {
            return this.pool[id];
        },

        substitute : function() {
            var args = Array.prototype.slice.call(arguments,0),
                orig = args.shift(),
                n = {};
            Object.keys(orig).forEach(function (k) {
                n[k] = orig[k].replace(/\%\[[\d]\]/g, function(m,v) {
                    v = args[parseInt(m.substr(0,m.length-1).substr(2))];
                    if (typeof v === 'object')
                        return v[k] || m;
                    return typeof v !== 'undefined' && v !== null? v : m;
                });
            });
            return n;
        },

        mapKey : function(c) {
            if (!c)
                throw new Error('No object!');
            var l = language.env;
            if (typeof c === 'function')
                return c(l);
            if (typeof c !== 'object')
                return c;
            if (l) {
                if (c[l])
                    return c[l];
                var t = l.split('-');
                if (c[t[0]])
                    return c[t[0]];
            }
            if ('en' in c)
                return c.en;
            throw new Error('No language support:'+JSON.stringify(c));
        }
    };

    bless.call(language);

    language.managers.event.on('setPool', function() {
        return detect();
    });

    return language;
};
