(function() {

'use strict';

module.requires = [
    { name: 'core.store.js' },
    { name: 'core.url.js' }
];

module.exports = function(app, params) {

    var store = app['core.store'],
        url = app['core.url'],
        bless = app['core.bless'];

    var detect = function() {
        return language.managers.store.get('env').then(function (stored) {
            return [
                stored,
                params.appconf.localeLanguage,
                url.getParam('localeLanguage'),
                window.navigator.userLanguage || window.navigator.language,
                'en-US',
                'en'
            ].reduce(
                function(a,b,i) {
                    return a.then(function() {
                        return language.setEnv(b,true).then(
                            function() {
                                language.isAuto = i !== 0;
                                throw null;
                            },
                            function () {}
                        );
                    }); 
                },
                Promise.resolve()
            ).then(
                function () {
                    throw new Error('Language failed to set');
                },
                function() { }
            );
        });
    }

    var language = {

        env : null,
        isAuto : null,
        pool : {},

        setPool : function(o) {
            this.pool = o;
            return this.managers.event.dispatch('setPool');
        },
        
        reset : function() {
            var self = this;
            return this.managers.store.set('env').then(function() {
                self.isAuto = false;
                return detect();
            });
        },

        setEnv : function(id,noStore) {
            var self = this,
                managers = this.managers;
            return new Promise(function (resolve) {
                if (id.length > 2) 
                    id = id.substr(0,3)+id.substr(3).toUpperCase();
                if (! self.pool[id]) 
                    throw { error:'Code is not in pool.', value:id, pool:self.pool };
                self.env = id;
                if (! noStore)
                    self.isAuto = false;
                return Promise.all([ noStore? null : managers.store.set('env',id)]).then(function() {
                    return managers.event.dispatch('setEnv',id);
                }).then(resolve);
            });
        },

        getPoolItemById : function(id) {
            return this.pool[id];
        },
    
        substitute : function() {
            var args = Array.prototype.slice.call(arguments,0);
            var n = JSON.parse(JSON.stringify(args.shift()));
            Object.keys(n).forEach(function (k) {
                n[k] = n[k].replace(/\%d/g,function() {
                    if (! args.length)
                        throw new Error('Argument length error', n);
                    var l = args.shift();
                    if (typeof l === 'object') 
                        return l[k];
                    return l;
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

    bless.call(language,{
        name:'core.language',
        managers : {
            store : store
        }
    });

    language.managers.event.on('setPool', function() {
        return detect();
    });

    return language;
};

})();
