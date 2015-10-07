(function() {

'use strict';

module.requires = [
    { name: 'core.language.js' },
    { name: 'core.currency.js'},
    { name: 'core.country.js' },
    { name: 'instance.modaldialog.js' }
];

module.exports = function(app, params) {

    var events = app['core.events'],
        Amd = app['instance.amd'],
        debug = app['core.debug'],
        language = app['core.language'],
        currency = app['core.currency'],
        country = app['core.country'];

    return Promise.all([

    // add supported languages - IETF
    language.setPool({
        en : { 
            name:"English"
        }
      }),

      // add supported countries - iso 3166-2
      country.setPool({
        "FR": {
          "callingCode": [
            "13"
          ],
          "currency": [
            "EUR",
          ],
          "name": { en:"France" }
        },
        "US": {
          "callingCode": [
            "1"
          ],
          "currency": [
            "USD",
          ],
          "name": { en:"United States" }
        },
      })

    ]).then(function () {

      // add supported currencies - ISO 4217
      return currency.setPool({
          USD : {
              symbol : '$',
              name : { en:"United States Dollar" }
          }
      }).then(function() {

        // debug handling
        var displaying = false;
        events.rootEmitter.on('core.debug.handle', function (o) {
            document.body.classList.add('error');
            return debug.log.append(o.value,o.path,o.event);
        });

      });

  });

};

})();
