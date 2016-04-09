//# sourceURL=core.currency.js

(function(env) {

    "use strict";

    module.requires = [
        { name : 'core.currency.css' },
        { name : 'core.store.js' },
        { name : 'core.country.js' },
        { name : 'core.url.js' }
    ];

    module.exports = function(app, params) {

        var store = app['core.store'],
            country = app['core.country'],
            dom = app['core.dom'],
            url = app['core.url'],
            coreObject = app['core.object'],
            bless = coreObject.bless,
            promiseSequencer = coreObject.promiseSequencer;

        // detects the language to use
        var detect = function() {

            return currency.managers.store.get('env').then(function (stored) {

                var set = false;

                return promiseSequencer([
                    stored,
                    params.conf.localeCurrency,
                    url.getSearchValue('localeCurrency'),
                    country.env && country.pool[country.env] && country.pool[country.env].currency? country.pool[country.env].currency[0] : null,
                    'USD'
                ], function(code,i) {

                    if (! set && code)
                        return currency.setEnv(code,true).then(
                            function() {
                                set = true;
                            },
                            function () { }
                        );
                }).then(

                    function () {
                        if (! set)
                            throw new Error('Currency failed to set');
                    }
                );
            });
        };

        // case standarizer
        var formatCode = function(id) {

            return id.toUpperCase();
        };

        // service
        var currency = {

            name:'core.currency',
            managers : {
                store : store
            },
            env : null,
            pool : {},

            /* Sets the language code pool
             * @param {object} o - an object literal of codes. See app.conf for an example
             * @returns {Promise}
             */
            setPool : function(o) {

                this.pool = o;
                return this.managers.event.dispatch('setPool');
            },

            /* Makes a currency code active
             * @param {string} id - the currency code to use, i.e 'USD'
             * @param {boolean} [noStore] - don't store the code for persistance. Default false.
             * @returns {Promise}
             */
            setEnv : function(id,noStore) {

                if (typeof id !== 'string')
                    throw new TypeError('First argument must be a string (currency code)');

                var self = this,
                    managers = self.managers;

                return Promise.resolve().then(function() {

                    id = formatCode(id);

                    if (! id)
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

            /* Validates a currency code
             * @param {(string|number|float)} s - the amount to validate
             * @param {object} [o] - config literal, currency only to permit negative values
             * @returns {boolean}
             */
            validate : function(s,o) {

                return new RegExp(o && o.allowNeg? /^-?\d+(\.\d{2})?$/ : /^\d+(\.\d{2})?$/).test(String(s).trim());
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

            /* Formats a value into 2dp
             * @param {(number|float)} v - value to format
             * @returns {float}
             */
            normalize : function(v) {

                return parseFloat(Math.round(v * 100) / 100).toFixed(2);
            },

            /* Comma delimits a value, ie 2,000.00
             * @param {(number|float|string)} v - value to format
             * @returns {string}
             */
            commarize : function(v) {

                var t = parseFloat(v),
                    isNeg = t < 0;
                if (isNeg)
                    t *= -1;
                t+= '';
                var o = t.split('.',2);
                t = o[0]
                    .split('')
                    .reverse()
                    .join('')
                    .match(/.{1,3}/g)
                    .join(',')
                    .split('')
                    .reverse()
                    .join('');
                if (o.length === 2)
                    t += '.' + o[1];
                return isNeg? '-'+t:t;
            },

            /* Formats a value with a positive spin on it (or negative!)
             * @param {(number|float|string)} v - value to format
             * @param {*} [q] - the value to use, plus any prepend text, $100,000.00 USD
             * @returns {object} span dom element
             */
            colorize : function(v,q) {
                v = parseFloat(v);
                return dom.mk('span',null,q,function() {
                    if (v !== 0)
                        this.className = 'core-currency-' + (v>0? 'positive': 'negative');
                });
            },

            /* A helper which commerizes, adds a symbol and colourizes
             * @param {(number|float|string)} v - value to format
             * @param {*} [o] - a config literal to switch ops on/off
             * @returns {object} span dom element
             */
            format : function(v,o) {
                v = o && o.noNormalize? parseFloat(v) : this.normalize(v);
                var c = o && o.type? o.type : this.env,
                    f = this.pool[c].format,
                    q = f? f(v,o) : (v < 0? '-': '') + this.pool[c].symbol + this.commarize(v < 0? v*-1 : v);
                if (o && o.colorize)
                    q = this.colorize(v, q);
                return dom.mk('span',null,q,'core-currency-formatted');
            }

        };

        // bless service
        bless.call(currency);

        // attempt to reapply active code incase it's been removed from the pool
        currency.managers.event.on('setPool', function() {
            return detect();
        });

        return currency;

    };

})(this);
