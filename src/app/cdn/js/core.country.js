//# sourceURL=core.country.js

(function () {

  module.requires = [
    { name: 'core.store.js' },
    { name: 'core.url.js' }
  ];

  module.exports = (app, params) => {

    const store = app['core.store'],
      url = app['core.url'],
      coreObject = app['core.object'],
      bless = coreObject.bless;

    // detects the country to use
    const detect = async () => {

      let n = window.navigator.userLanguage || window.navigator.language;
      if (n.length > 3) {
        n = n.substr(3);
      }

      const stored = await country.managers.store.get('env');

      const pool = [
        stored,
        params.conf.localeCountry,
        url.getSearchValue('localeCountry'),
        n,
        'US'
      ].filter(v => typeof v === 'string' && v.length);

      let success;
      for (let code of pool) {
        try {
          await country.setEnv(code, true);
          success = true;
          break;
        } catch (e) {

        }
      }
      if (! success) {
        throw { error: 'Country failed to set', attempted: pool, config: country.config }
      }
    }

    // case standarizer
    const formatCode = id => id.toUpperCase();

    // service
    const country = {

      name: 'core.country',
      managers : {
        store
      },
      env : null,
      config : {},

      /* Sets the country pool code
       * @param {object} config - an object literal of codes. See app.conf for an example
       * @returns {Promise}
       */
      setConfig: async function (config) {

        this.config = config;
        return this.managers.event.dispatch('setConfig');
      },

      /* Makes a country pool code active
       * @param {string} id - the country code to use, i.e 'FR, GR'
       * @param {boolean} [noStore] - don't store the code for persistance. Default false.
       * @returns {Promise}
       */
      setEnv: async function (id, noStore) {

        if (typeof id !== 'string') {
          throw new TypeError('First argument must be a string (country code)');
        }

        id = formatCode(id);

        const { config, managers } = this;
        if (! config.pool[id]) {
          throw { error:'Code is not in pool.', value: id, config };
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
        return detect();
      },

      /* Gets a country literal object by its id
       * @param {string} id - the country code to use
       * @returns {Promise} containing the detected code
       */
      getFromPoolById : function (id) {

          if (typeof id !== 'string') {
            throw new TypeError('First argument must be a string (language code)');
          }
          id = formatCode(id);
          return this.pool[id];
      }
    }

    // bless service
    bless.call(country);

    // attempt to reapply active code incase it's been removed from the pool
    country.managers.event.on('setConfig', () => detect());

    return country;
  }

})(this);
