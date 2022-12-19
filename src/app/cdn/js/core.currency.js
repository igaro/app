//# sourceURL=core.currency.js

(function () {

  module.requires = [
    { name : 'core.currency.css' },
    { name : 'core.store.js' },
    { name : 'core.country.js' },
    { name : 'core.url.js' }
  ]

  module.exports = function (app, params) {

    const store = app['core.store'],
      country = app['core.country'],
      dom = app['core.dom'],
      url = app['core.url'],
      coreObject = app['core.object'],
      bless = coreObject.bless;

      // detects the currency to use
      const detect = async () => {

        const stored = await currency.managers.store.get('env');

        const countryEnv = country.env;
        const pool = [
          stored,
          params.conf.localeCurrency,
          url.getSearchValue('localeCurrency'),
          countryEnv && country.config.pool && country.config.pool[countryEnv] && country.config.pool[countryEnv].currency? country.config.pool[country.env].currency[0] : null,
          currency.config.default
        ].filter(v => typeof v === 'string' && v.length);

        let success;
        for (let code of pool) {
          try {
            await currency.setEnv(code, true);
            success = true;
            break;
          } catch (e) {

          }
        }

        if (! success) {
          throw { error: 'Currency failed to set', attempted: pool, config:currency.config }
        }
      }

    // case standarizer
    const formatCode = id => id.toUpperCase();

    // service
    const currency = {

      name: 'core.currency',
      managers: {
        store
      },
      env: null,
      config: {},

      /* Sets the currency code pool
       * @param {object} config - an object literal of codes. See app.conf for an example
       * @returns {Promise}
       */
      setConfig: async function (config) {

        this.config = config;
        return this.managers.event.dispatch('setConfig');
      },

      /* Makes a currency code active
       * @param {string} id - the currency code to use, i.e 'USD'
       * @param {boolean} [noStore] - don't store the code for persistance. Default false.
       * @returns {Promise}
       */
      setEnv: async function (id, noStore) {

        if (typeof id !== 'string') {
          throw new TypeError('First argument must be a string (currency code)');
        }

        id = formatCode(id);

        const { config, managers } = this;
        if (! config.pool[id]) {
          throw { error:'Code is not in pool.', value:id, config };
        }

        this.env = id;

        if (! noStore) {
          await managers.store.set('env', id);
        }
        return managers.event.dispatch('setEnv', id);
      },

      /* Resets the active code to the system default (usually browser supplied)
       * @returns {Promise} containing the detected code
       */
      reset: async function () {

        await this.managers.store.set('env');
        return detect()
      },

      /* Validates a currency code
       * @param {(string|number|float)} s - the amount to validate
       * @param {object} [o] - config literal, currency only to permit negative values
       * @returns {boolean}
       */
      validate: (s, o) => new RegExp(o && o.allowNeg? /^-?\d+(\.\d{2})?$/ : /^\d+(\.\d{2})?$/).test(String(s).trim()),

      /* Gets a country literal object by its id
       * @param {string} id - the country code to use
       * @returns {Promise} containing the detected code
       */
      getFromPoolById: function (id) {

        if (typeof id !== 'string') {
          throw new TypeError('First argument must be a string (currency code)');
        }

        id = formatCode(id);
        return this.config.pool[id];
      },

      /* Comma delimits a value, ie 2, 000.00
       * @param {(number|float|string)} v - value to format
       * @returns {string}
       */
      commarize: function (v) {

        let t = parseFloat(v);
        const isNeg = t < 0,
          o = v.split('.', 2);

        if (isNeg) {
          t *= -1;
        }
        t = o[0]
          .split('')
          .reverse()
          .join('')
          .match(/.{1,3}/g)
          .join(',')
          .split('')
          .reverse()
          .join('');
        if (o.length === 2) {
          t += '.' + o[1];
        }
        return isNeg? '-' + t : t;
      },

      /* Formats a value with a positive spin on it (or negative!)
       * @param {number} v - value to format
       * @param {*} [q] - the value to use, plus any prepend text, $100, 000.00 USD
       * @returns {object} span dom element
       */
      colorize: function (v, q) {

        if (typeof v !== 'number'){
          throw new TypeError("First argument must be a number");
        }
        return dom.mk('span', null, q, function () {
          if (v !== 0) {
            this.className = 'core-currency-' + (v>0? 'positive': 'negative');
          }
        });
      },

      /* A helper which commarizes, adds a symbol and colourizes
       * @param {number} v - value to format
       * @param {*} [o] - a config literal to switch ops on/off
       * @returns {object} span dom element
       */
      format: function (v, o) {

        if (typeof v !== 'number') {
          throw new TypeError("First argument must be a number");
        }
        var c = o && o.type? o.type : this.env,
          t = this.config.pool[c],
          f = t.format,
          p = t.prefix || '',
          s = t.symbol || '' ,
          a = t.affix || '',
          q = f? f.call(this, v, o) : (v < 0? '-': '') + p + s + this.commarize((Number(v < 0? v*-1 : v)/100).toFixed(2) + a);
        if (o && o.colorize) {
          q = this.colorize(v, q);
        }
        return dom.mk('span', null, q, 'core-currency-formatted');
      }
    }

    // bless service
    bless.call(currency);

    // attempt to reapply active code incase it's been removed from the pool
    currency.managers.event.on('setConfig', () =>  detect());

    return currency;
  }

})(this)
