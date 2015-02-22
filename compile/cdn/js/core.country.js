(function() {

'use strict';

module.requires = [
    { name:'core.store.js' },
    { name:'core.url.js' }
];

module.exports = function(app, params) {

    var store = app['core.store'],
        url = app['core.url'],
        bless = app['core.bless'];

    var country = {

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
                if (! self.pool[id])
                    throw { error:'Code is not in country pool.', value:id, pool:self.pool };
                self.env = id;
                return managers.store.set('env',id).then(function() {
                    return managers.event.dispatch('setEnv',id);
                }).then(resolve);
            });
        },

        getFromPoolById : function(id) {
            return this.pool[id.toUpperCase()];
        }
    };

    bless.call(country,{
        name:'core.country',
        managers : {
            store : store
        }
    });

    var managers = country.managers;

    managers.event.on('setPool', function() {
        return managers.store.get('env').then(function(id) {
            return Promise.all(id? [country.setEnv(id)] : []).catch(function() {}).then(function() {
                var parId = params.appconf.localeCountry;
                return Promise.all(parId? [country.setEnv(parId)] : []).catch(function() {}).then(function() {
                    var uriId = url.getParam('localeCountry');
                    return Promise.all(uriId? [country.setEnv(uriId)] : []).catch(function() {}).then(function() {
                        var n = window.navigator.userLanguage || window.navigator.language;
                        if (n.length > 3) 
                            n=n.substr(3);
                        return country.setEnv(n).catch(function() {}).then(function() {
                            return country.setEnv('US').catch(function() {
                                throw new Error('Country failed to set');
                            });
                        });
                    });
                });
            });
        });
    });

    return country;

};

})();