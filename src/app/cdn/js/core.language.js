//# sourceURL=core.language.js

module.requires = [
  { name: 'core.store.js' },
  { name: 'core.url.js' }
]

module.exports = function (app, params) {

  const store = app['core.store'],
    coreUrl = app['core.url'],
    coreObject = app['core.object'];

  // detects the language to use
  const detect = async () => {

    const stored = await language.managers.store.get('env');

    const pool = [
      stored,
      params.conf.localeLanguage,
      coreUrl.getSearchValue('localeLanguage'),
      window.navigator.userLanguage || window.navigator.language,
      'en-US',
      'en'
    ].filter(v => typeof v === 'string' && v.length);

    let success;
    for (let code of pool) {
      try {
        await language.setEnv(code, true);
        success = true;
        break;
      } catch (e) {

      }
    }

    if (! success) {
      throw { error:'Language failed to set', attempted:pool, config:language.config }
    }
  }

  // case standarizer
  const formatCode = id => id.substr(0, 3).toLowerCase()+id.substr(3).toUpperCase();

  /* Language key mapper
   * @param {(object|function)} c - containing or returning the object to use.
   * @returns {string} the env language is used on the object to return the value, reverting to denomator and default language if unavailable.
   */
  const getCurrentIdForDict = c => {

      if (! /function|object/.test(typeof c)) {
        throw new TypeError('First argument must be an object or function supplying it.');
      }

      var l = language.env,
        pool = language.pool;

      // functions can provide literal to use
      if (typeof c === 'function') {
        c = c();
      }

      // must now be an object
      if (typeof c !== 'object') {
        throw new TypeError('language mapKey can not work on a non object');
      }

      // try to fetch, try denominator
      if (l) {
        if (c[l]) {
          return l;
        }
        var t = l.split('-')[0],
          v = c[t];
        if (v && pool[v]) {
            return t;
        }
      }

      // couldn't find, use English
      if (c.en && pool.en) {
        return 'en';
      }
  }

  // service
  const language = {

    name: 'core.language',
    managers: {
      store
    },
    env: null,
    rtl: false,
    config : {},

    /* Sets the language code pool
     * @param {object} config - an object literal of codes. See app.conf for an example
     * @returns {Promise}
     */
    setConfig: async function (config) {

      if (typeof config !== 'object') {
        throw new TypeError('First argument must be an object literal');
      }

      const { pool } = config;

      //  validate
      Object.keys(pool)
        .forEach(key => {

          const item = pool[key],
            pluralForms = item.pluralForms;

          if (typeof pluralForms !== 'object') {
            throw new TypeError("Language pool object "+key+ " missing pluralForms key")
          }

          const pluralLogic = pluralForms.logic;
          if (typeof pluralLogic !== 'string') {
            throw new TypeError("Language pool object "+key+ " missing plural logic key")
          }

          pluralForms.logic = eval("(function (n) { return (" + pluralLogic + "); })");
        });

      this.config = config;
      return this.managers.event.dispatch('setConfig');
    },

    /* Makes a language pool code active
     * @param {string} id - the language code to use, i.e 'en-US'
     * @param {boolean} [noStore] - don't store the code for persistance. Default false.
     * @returns {Promise}
     */
    setEnv : async function (id, noStore) {

      if (typeof id !== 'string') {
        throw new TypeError('First argument must be a string (language code)');
      }

      id = formatCode(id);

      const { config, managers } = this;
      const o = config.pool[id];

      if (! o) {
        throw { error: 'Code is not in pool.', value: id, config }
      }

      this.env = id;
      document.body.style.textAlign = o.rL? 'right' : 'left';
      this.rtl = o.rtl === true;

      if (! noStore) {
        await managers.store.set('env', id);
      }

      return managers.event.dispatch('setEnv', id);
    },

    /* Resets the active code to the system default (usually browser supplied)
     * @returns {Promise} containing the detected code
     */
    reset: async function () {

      // remove any url param
      const url = coreUrl.getCurrent();
      if (url.search.localeLanguage) {
        delete url.search.localeLanguage;
        coreUrl.setCurrent(url);
      }

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
        return this.config.pool[id];
    },

    /* Language string substitution
     * @param {string} id - containing %[n] placeholders
     * @param {string} id - text to place into holder. Can supply further arguments.
     * @returns {string} the replaced strings
     */
    substitute : function () {

      const args = Array.prototype.slice.call(arguments, 0),
        str = args.shift();

      if (typeof str !== 'string') {
        throw new TypeError("First argument must be of type string");
      }

      return str.replace(/\%\[[\d]\]/g, (m, v) => {
        v = args[parseInt(m.substr(0, m.length-1).substr(2))];
        return typeof v !== 'undefined' && v !== null? v : m;
      })
    },

    /* Translation (using gettext data) - exposed via core.dom, do not use 'this'
     * @param {object} data - containing a key, optional plural, comment and context, and hopefully a gettext dictionary containing translation data
     * @returns {number} [pluralCnt] - the number used to pick the correct phase, ie apple (1) and apples (0, 2+) - for most languages.
     * @returns {string} containing translated text
     */
    tr: function (data, pluralCnt) {

      if (typeof data !== 'object') {
        throw new TypeError("First argument must be of type object");
      }

      if (typeof data.key !== 'string') {
        throw new TypeError("First argument object must contain a key attribute of type string");
      }

      let hasPluralCnt = false;
      if (pluralCnt !== null && pluralCnt !== undefined) {
        if (typeof pluralCnt !== 'number') {
          throw new TypeError("Second argument must be of type number");
        } else {
          hasPluralCnt = true;
        }
      }

      // basic plural index
      const key = data.key;
      let pluralIndex = hasPluralCnt? pluralCnt === 1? 1: 0:1,
        dict = data.dict;

      // gettext data support
      if (dict) {
        const langId = getCurrentIdForDict(dict);
        if (langId) {
          if (pluralCnt) {
            pluralIndex = language.pool[langId].pluralForms.logic(pluralCnt);
          }

          // select language
          dict = dict[langId];

          // try to map and return
          var mapping = dict[pluralIndex]
          if (typeof mapping === 'string' && mapping.length) {
            return mapping;
          } else {
            // force English pluralization
            if (pluralIndex > 1) {
              pluralIndex = 0;
            }
          }
        }
      }

      // pick from the raw keys
      return [data.plural || key, key][pluralIndex];
    }
  }

  // bless service
  coreObject.bless.call(language);

  // attempt to reapply active code incase it's been removed from the pool
  language.managers.event.on('setConfig', () => detect());

  return language;
}
