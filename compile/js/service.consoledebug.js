module.exports = function(app) {

    app['core.events'].on('core.debug','log.append', function (o) {
        if (window.console !== 'undefined') console.log(o);
    });

};