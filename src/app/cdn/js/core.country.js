//# sourceURL=core.country.js

(function(env) {

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

                var set = false;
                return promiseSequencer([
                    stored,
                    params.conf.localeCountry,
                    url.getSearchValue('localeCountry'),
                    n,
                    'US'
                ], function(code,i) {
                    if (! set && code)
                        return country.setEnv(code,true).then(
                            function() {
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
            setEnv : function(id,noStore) {

                if (typeof id !== 'string')
                    throw new TypeError('First argument must be a string (country code)');

                var self = this,
                    managers = self.managers;

                id = formatCode(id);

                return Promise.resolve().then(function () {

                    if (! self.pool[id])
                        throw new Error('Code is not in pool.');
                    self.env = id;
                    return (noStore? Promise.resolve() : managers.store.set('env',id)).then(function() {

                        return managers.event.dispatch('setEnv',id);
                    });
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
