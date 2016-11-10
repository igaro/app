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
        promiseSequencer = coreObject.promiseSequencer;

    // detects the language to use
    var detect = function() {

        return language.managers.store.get('env').then(function (stored) {

            var pool = [
                stored,
                params.conf.localeLanguage,
                url.getSearchValue('localeLanguage'),
                window.navigator.userLanguage || window.navigator.language,
                'en-US',
                'en'
            ].filter(function(v) {
                return typeof v === 'string' && v.length;
            });

            return promiseSequencer(pool, function(code) {
                return Promise.resolve().then(function() {
                    return language.setEnv(code,true).then(function() {
                        throw { id:22976543 };
                    });
                })['catch'](function (e) {
                    if (typeof e !== 'object' || e.id !== 38628137)
                        throw e;
                });
            })['catch'](function(e) {
                if (typeof e !== 'object' || e.id !== 22976543)
                    throw { e:e, error:'Language failed to set', attempted:pool, pool:language.pool };
            });
        });
    };

    // case standarizer
    var formatCode = function(id) {

        return id.substr(0,3).toLowerCase()+id.substr(3).toUpperCase();
    };

    /* Language key mapper
     * @param {(object|function)} c - containing or returning the object to use.
     * @returns {string} the env language is used on the object to return the value, reverting to denomator and default language if unavailable.
     */
    var getCurrentIdForDict = function(c) {

        if (! /function|object/.test(typeof c))
            throw new TypeError('First argument must be an object or function supplying it.');

        var l = language.env,
            pool = language.pool;

        // functions can provide literal to use
        if (typeof c === 'function')
            c = c();

        // must now be an object
        if (typeof c !== 'object')
            throw new TypeError('language mapKey can not work on a non object');

        // try to fetch, try denominator
        if (l) {
            if (c[l])
                return l;
            var t = l.split('-')[0],
                v = c[t];
            if (v && pool[v])
                return t;
        }

        // couldn't find, use English
        if (c.en && pool.en)
            return 'en';
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

            if (typeof o !== 'object')
                throw new TypeError('First argument must be an object literal');

            this.pool = o;
			Object.keys(o).forEach(function(key) {

				var item = o[key],
					pluralForms = item.pluralForms;

				if (typeof pluralForms !== 'object')
					throw new TypeError("Language pool object "+key+ " missing pluralForms key");

				var pluralLogic = pluralForms.logic;
				if (typeof pluralLogic !== 'string')
					throw new TypeError("Language pool object "+key+ " missing plural logic key");

				pluralForms.logic = eval("(function(n) { return (" + pluralLogic + "); })");
			});

            return this.managers.event.dispatch('setPool');
        },

        /* Makes a language pool code active
         * @param {string} id - the language code to use, i.e 'en-US'
         * @param {boolean} [noStore] - don't store the code for persistance. Default false.
         * @returns {Promise}
         */
        setEnv : function(id, noStore) {

            if (typeof id !== 'string')
                throw new TypeError('First argument must be a string (language code)');

            id = formatCode(id);

            var o = this.pool[id];
            if (! o)
                throw { id:38628137, error:'Code is not in pool.', value:id, pool:this.pool };

            this.env = id;
            document.body.style.textAlign = o.rL? 'right' : 'left';
            this.rtl = o.rtl === true;

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
        },

        /* Language string substitution
         * @param {string} id - containing %[n] placeholders
         * @param {string} id - text to place into holder. Can supply further arguments.
         * @returns {string} the replaced strings
         */
        substitute : function() {

            var args = Array.prototype.slice.call(arguments,0),
                str = args.shift();

            if (typeof str !== 'string')
                throw new TypeError("First argument must be of type string");

            return str.replace(/\%\[[\d]\]/g, function(m,v) {
                v = args[parseInt(m.substr(0,m.length-1).substr(2))];
                return typeof v !== 'undefined' && v !== null? v : m;
            });
        },

        /* Translation (using gettext data) - exposed via core.dom, do not use 'this'
         * @param {object} data - containing a key, optional plural, comment and context, and hopefully a gettext dictionary containing translation data
         * @returns {number} [pluralCnt] - the number used to pick the correct phase, ie apple (1) and apples (0,2+) - for most languages.
         * @returns {string} containing translated text
         */
		tr : function (data, pluralCnt) {

			if (typeof data !== 'object')
				throw new TypeError("First argument must be of type object");

			if (typeof data.key !== 'string')
				throw new TypeError("First argument object must contain a key attribute of type string");

            var hasPluralCnt = false;
            if (pluralCnt !== null && pluralCnt !== undefined) {
                if (typeof pluralCnt !== 'number') {
                    throw new TypeError("Second argument must be of type number");
                } else {
                    hasPluralCnt = true;
                }
            }

            // basic plural index
			var pluralIndex = hasPluralCnt? pluralCnt === 1? 1:0:1,
                key = data.key,
                dict = data.dict;

			// gettext data support
            if (dict) {
                var langId = getCurrentIdForDict(dict);
                if (langId) {
                    if (pluralCnt)
                        pluralIndex = language.pool[langId].pluralForms.logic(pluralCnt);

                    // select language
                    dict = dict[langId];

                    // try to map and return
                    var mapping = dict[pluralIndex];
                    if (typeof mapping === 'string' && mapping.length) {
                        return mapping;
                    } else {
                        // force English pluralization
                        if (pluralIndex > 1)
                            pluralIndex = 0;
                    }
                }
            }

			// pick from the raw keys
            return [data.plural || key, key][pluralIndex];
		},

    };

    // bless service
    coreObject.bless.call(language);

    // attempt to reapply active code incase it's been removed from the pool
    language.managers.event.on('setPool', function() {
        return detect();
    });

    return language;
};
