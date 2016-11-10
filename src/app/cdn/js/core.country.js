//# sourceURL=core.country.js

(function() {

    "use strict";

    module.requires = [
        { name:'core.store.js' },
        { name:'core.url.js' }
    ];

    module.exports = function(app, params) {

        var store = app['core.store'],
            url = app['core.url'],
            coreObject = app['core.object'],
            bless = coreObject.bless,
            promiseSequencer = coreObject.promiseSequencer;

        // detects the country to use
        var detect = function() {

            var n = window.navigator.userLanguage || window.navigator.language;
            if (n.length > 3)
                n=n.substr(3);

            return country.managers.store.get('env').then(function (stored) {

                var pool = [
                    stored,
                    params.conf.localeCountry,
                    url.getSearchValue('localeCountry'),
                    n,
                    'US'
                ].filter(function(v) {
                    return typeof v === 'string' && v.length;
                });

                return promiseSequencer(pool, function(code) {
                    return Promise.resolve().then(function() {
                        return country.setEnv(code,true).then(function() {
                            throw { id:22976543 };
                        });
                    })['catch'](function (e) {
                        if (typeof e !== 'object' || e.id !== 38628137)
                            throw e;
                    });
                })['catch'](function(e) {
                    if (typeof e !== 'object' || e.id !== 22976543)
                        throw { e:e, error:'Country failed to set', attempted:pool, pool:country.pool };
                });
            });
        };

        // case standarizer
        var formatCode = function(id) {

            return id.toUpperCase();
        };

        // service
        var country = {

            name:'core.country',
            managers : {
                store : store
            },
            env : null,
            pool : {},

            /* Sets the country pool code
             * @param {object} o - an object literal of codes. See app.conf for an example
             * @returns {Promise}
             */
            setPool : function(o) {

                this.pool = o;
                return this.managers.event.dispatch('setPool');
            },

            /* Makes a country pool code active
             * @param {string} id - the country code to use, i.e 'FR, GR'
             * @param {boolean} [noStore] - don't store the code for persistance. Default false.
             * @returns {Promise}
             */
            setEnv : function(id, noStore) {

                if (typeof id !== 'string')
                    throw new TypeError('First argument must be a string (country code)');

                id = formatCode(id);

                if (! this.pool[id])
                    throw { id:38628137, error:'Code is not in pool.', value:id, pool:this.pool };

                this.env = id;

                var managers = this.managers;
                return (noStore? Promise.resolve() : managers.store.set('env',id)).then(function() {

                    return managers.event.dispatch('setEnv',id);
                });
            },

            /* Resets the active code to the system default (usually browser supplied)
             * @returns {Promise} containing the detected code
             */
            reset : function() {

                return this.managers.store.set('env').then(function() {

                    return detect();
                });
            },

            /* Gets a country literal object by its id
             * @param {string} id - the country code to use
             * @returns {Promise} containing the detected code
             */
            getFromPoolById : function(id) {

                if (typeof id !== 'string')
                    throw new TypeError('First argument must be a string (language code)');

                id = formatCode(id);

                return this.pool[id];
            }
        };

        // bless service
        bless.call(country);

        // attempt to reapply active code incase it's been removed from the pool
        country.managers.event.on('setPool', function() {
            return detect();
        });

        return country;
    };

})(this);
