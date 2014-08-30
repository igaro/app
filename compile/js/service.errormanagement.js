module.requires = [
    { name:'core.status.js' },
    { name:'core.debug.js' },
    { name:'core.language.js' }
];

module.exports = function(app,op) {

    var l = {

        'appfail' : {
            en : 'An error has occured. You may experience display or functionality issues. If this error perists please contact our support team for a solution.',
            fr : 'Une erreur s\'est produite. Vous pouvez rencontrer des problèmes d\'affichage ou de fonctionnalité. Si cette erreur perists s\'il vous plaît contacter notre équipe de soutien à une solution.'
        },

        'routefail' : {
            en : 'The resource you requested has failed to load.<p>You may experience display or functionality issues.',
            fr : 'La ressource que vous avez demandé n\'a pas réussi à charger.<p>Nous vous avons dirigés vers c\'est ressources pour les parents à la place.'
        },

        'apperr' : {
            'title' : {
                en : 'Application Error',
                fr : 'Erreur d\'application'
            },
            'message' : {
                en : 'The current operation has been aborted.',
                fr : 'L\'opération en cours a été interrompu.'
            }
        }
    };

    var events = app['core.events'];
    var language = app['core.language'];
    var debug = app['core.debug'];

    // pass mvc errors to debug
    ['model.children.add.error','view.error'].forEach(function (k) {
        events.on('core.mvc',k, function (o) {
            debug.log.append('core.mvc',k, o);
        });
    });

    // pass event dispatch function failures
    events.on('core.events','dispatch.error', function (o) {
        debug.log.append('core.events','dispatch', o);
    });

    // this feedback handles errors before the pretty model/view code is loaded
    var evt = function() {
        alert(language.mapKey(l.appfail));
    };

    //events.on('core.events','dispatch',function() { evt() });
    events.on('core.mvc','model.children.add.error',function() { evt() });
    events.on('core.mvc','view.error',function() { evt() });
    //events.on('core.mvc','to.error',function() { evt() });

    // on core ready
    events.on('core','ready.init', function(o) {
        // this feedback replaces the above and provides pretty feedback, with async
        var status = app['core.status'];
        evt = function() {
        	// display nice message instead
            status.append( { type:'critical', title:l.apperr.title, lines:new Array(l.apperr.message) });
        };

        // route non-json errors (404 etc) to status
        events.on('instance.xhr','error', function (o) {
            if (o.jsonError) return;
            var xhr = o.xhr;
            var type = xhr.status === 401? 'critical' : 'warn';
            var title = xhr.status === 0? {
                en : 'Connection Failure',
                fr : 'Echec de la Connexion'
            } : { en: xhr.status + ' ('+xhr.statusText+')' };
            status.append( { type:type, title:title, lines:new Array({ en: o.res }) });
        });

    });

};

