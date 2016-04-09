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

    // detects the language to use
    var detect = function() {

        return language.managers.store.get('env').then(function (stored) {

            var set = false;
            return promiseSequencer([
                stored,
                params.conf.localeLanguage,
                url.getSearchValue('localeLanguage'),
                window.navigator.userLanguage || window.navigator.language,
                'en-US',
                'en'
            ], function(code,i) {
                if (! set && code)
                    return language.setEnv(code,true).then(
                        function() {
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

    // case standarizer
    var formatCode = function(id) {

        return id.substr(0,3).toLowerCase()+id.substr(3).toUpperCase();
    };

    // service
    var language = {

        name:'core.language',
        managers : {
            store : store
        },
        env : null,
        rtl:false,
        pool : {},

        /* Sets the language code pool
         * @param {object} o - an object literal of codes. See app.conf for an example
         * @returns {Promise}
         */
        setPool : function(o) {

            this.pool = o;
            return this.managers.event.dispatch('setPool');
        },

        /* Makes a language pool code active
         * @param {string} id - the language code to use, i.e 'en-US'
         * @param {boolean} [noStore] - don't store the code for persistance. Default false.
         * @returns {Promise}
         */
        setEnv : function(id,noStore) {

            if (typeof id !== 'string')
                throw new TypeError('First argument must be a string (language code)');

            var self = this,
                managers = this.managers;

            return Promise.resolve().then(function () {

                id = formatCode(id);

                var o = self.pool[id];
                if (! o)
                    throw { error:'Code is not in pool.', value:id, pool:self.pool };

                self.env = id;
                document.body.style.textAlign = o.rL? 'right' : 'left';
                self.rtl = o.rtl === true;

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
        },

        /* Language string substitution
         * @param {string} id - containing \d or %[n] placeholders
         * @param {string} id - text to place into holder. Can supply further arguments.
         * @returns {string} the replaced strings
         */
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

        /* Language key mapper
         * @param {(object|function)} c - containing or returning the object to use.
         * @returns {string} the env language is used on the object to return the value, reverting to denomator and default language if unavailable.
         */
        mapKey : function(c) {

            if (! /function|object/.test(typeof c))
                throw new TypeError('First argument must be an object or function supplying it.');

            var l = language.env;

            // functions can provide literal to use
            if (typeof c === 'function')
                c = c();

            // must now be an object
            if (typeof c !== 'object')
                throw new TypeError('language mapKey can not work on a non object');

            // try to fetch, try denominator
            if (l) {
                if (c[l])
                    return c[l];
                var t = l.split('-')[0],
                    v = c[t];
                if (v)
                    return v;
            }

            // couldn't find, use English
            if (c.en)
                return c.en;

            // key unsupported
            throw new Error('No language support:'+JSON.stringify(c));
        }
    };

    // bless service
    bless.call(language);

    // attempt to reapply active code incase it's been removed from the pool
    language.managers.event.on('setPool', function() {
        return detect();
    });

    return language;
};
