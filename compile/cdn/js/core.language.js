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

    var language = {

        env : null,
        pool : {},

        setPool : function(o) {
            this.pool = o;
            return this.managers.event.dispatch('setPool');
        },
        
        setEnv : function(id) {
            var self = this,
                managers = this.managers;
            return new Promise(function (resolve) {
                if (id.length > 2) 
                    id = id.substr(0,3)+id.substr(3).toUpperCase();
                if (! self.pool[id]) 
                    throw { error:'Code is not in language pool.', value:id, pool:self.pool };
                self.env = id;
                return self.managers.store.set('env',id).then(function() {
                    return self.managers.event.dispatch('setEnv',id).then(resolve);
                });
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
                    var l = args.pop();
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

    var managers = language.managers;

    managers.event.on('setPool', function() {
        return managers.store.get('env').then(function(id) {
            return Promise.all(id? [language.setEnv(id)] : []).catch(function() {}).then(function() {
                var parId = params.appconf.localeLanguage;
                return Promise.all(parId? [language.setEnv(parId)] : []).catch(function() {}).then(function() {
                    var uriId = url.getParam('localeLanguage');
                    return Promise.all(uriId? [language.setEnv(uriId)] : []).catch(function() {}).then(function() {
                        return language.setEnv(window.navigator.userLanguage || window.navigator.language).catch(function() {}).then(function() {
                            return language.setEnv('en-US').catch(function() {}).then(function() {
                                return language.setEnv('en').catch(function(e) {
                                    throw new Error('Language failed to set');
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    return language;
};

})();