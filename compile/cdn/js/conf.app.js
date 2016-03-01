//# sourceURL=conf.app.js

(function(env) {

    @@include('../../../conf/block_incompatible_browsers.js');

    module.requires = [
        { name: 'core.router.js' },
        { name: 'core.language.js' },
        { name: 'core.currency.js'},
        { name: 'core.country.js' },
        { name: 'instance.toast.js' },
        { name: 'instance.modaldialog.js' }
    ];

    module.exports = function(app, params) {

        "use strict";

        var rootEmitter = app['core.events'].rootEmitter,
            Amd = app['instance.amd'],
            router = app['core.router'],
            debug = app['core.debug'],
            language = app['core.language'],
            currency = app['core.currency'],
            country = app['core.country'],
            ModalDialog = app['instance.modaldialog'],
            Toast = app['instance.toast'],
            dom = app['core.dom'];

        return Promise.all([

            // add supported languages - IETF
            language.setPool(

                @@include('../../../conf/languages.json')
            ),

            // add supported countries - ISO 3166-2
            country.setPool(

                @@include('../../../conf/countries.json')
            ),

            // add supported currencies - ISO 4217
            currency.setPool(

                @@include('../../../conf/currencies.json')
            )

        ]).then(function () {

            @@include('../../../conf/native_alert.js');
            @@include('../../../conf/route_provider_local.js');
            @@include('../../../conf/debug_handling.js');
            @@include('../../../conf/route_loading_overlay.js');
            @@include('../../../conf/router_error_handling.js');
            @@include('../../../conf/http_401_oauth.js');

            // route XHR errors (404 etc) to Toast
            var httpCodeTextMap = @@include('../../../conf/http_codes.json');
            @@include('../../../conf/http_code_toast.js');

            // setup page with core routes
            rootEmitter.on('state.init', function() {

                // conf
                var init = @@include('../../../conf/router_base.json');

                // define root path level
                router.rootPathLevel = init.base.level;

                // load initial routes
                return router.root.addRoutes(
                    init.routes.map(function(name) {

                        return { name:name };
                    })
                ).then(function(m) {

                    m.forEach(function(v,i) {

                        // set route as current
                        if (i === init.base.index)
                            router.current = router.base = v;

                        // auto show
                        if (v.autoShow)
                            v.show();
                    });

                    @@include('../../../conf/route_html_head.js');

                    // handle error here
                    return rootEmitter.dispatch('state.base').then(function() {

                        return rootEmitter.dispatch('state.ready');
                    })['catch'](function (e) {

                        // don't return the handle - doing so will prevent the parent model from displaying and will show the generic load error.
                        if (e !== 0) // connection issues are handled by a pageMessage
                            debug.handle(e);
                    });
                }).then(function() {

                    return { removeEventListener:true };
                });
            });

        });

    };

})(this);
