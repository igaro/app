module.exports = function(app) {

    var events = app['core.events'];

    events.on('core','ready.init', function(o) {

        events.on('igaroapi.credentials','login', function (o) {
            app['core.status'].append({ title:'Credentials', lines : new Array('You are now logged in.') });
        });
        events.on('igaroapi.credentials','logout', function (o) {
            app['core.status'].append({ title:'Credentials', lines : new Array('You have been logged out.') });
        });

    });

};