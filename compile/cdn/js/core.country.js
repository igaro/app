//# sourceURL=core.country.js

module.requires = [
    { name:'core.store.js' },
    { name:'core.url.js' }
];

module.exports = function(app, params) {

    "use strict";

    var store = app['core.store'],
        url = app['core.url'],
        coreObject = app['core.object'],
        bless = coreObject.bless,
        promiseSequencer = coreObject.promiseSequencer;

    var detect = function() {
        var n = window.navigator.userLanguage || window.navigator.language;
        if (n.length > 3)
            n=n.substr(3);
        return country.managers.store.get('env').then(function (stored) {
            var set = false;
            return promiseSequencer([
                stored,
                params.conf.localeCountry,
                url.getParam('localeCountry'),
                n,
                'US'
            ], function(b,i) {
                if (! set)
                    return country.setEnv(b,true).then(
                        function() {
                            country.isAuto = i !== 0;
                            set = true;
                        },
                        function () { }
                    );
            }).then(
                function () {
                    if (! set)
                        throw new Error('Country failed to set');
                }
            );
        });
    };

    var country = {

        name:'core.country',
        managers : {
            store : store
        },
        env : null,
        isAuto : null,
        pool : {},

        setPool : function(o) {
            this.pool = o;
            return this.managers.event.dispatch('setPool');
        },

        setEnv : function(id,noStore) {
            var self = this,
                managers = self.managers;
            return Promise.resolve().then(function () {
                if (! self.pool[id])
                    throw new Error('Code is not in pool.');
                self.env = id;
                if (! noStore)
                    self.isAuto = false;
                return (noStore? Promise.resolve() : managers.store.set('env',id)).then(function() {
                    return managers.event.dispatch('setEnv',id);
                });
            });
        },

        reset : function() {
            var self = this;
            return this.managers.store.set('env').then(function() {
                self.isAuto = true;
                return detect();
            });
        },

        getFromPoolById : function(id) {
            return this.pool[id.toUpperCase()];
        }
    };

    bless.call(country);

    country.managers.event.on('setPool', function() {
        return detect();
    });

    return country;

};
