module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {
                en : 'This library provides touch events. It is not loaded by default.',
                fr : 'Cette bibliothèque fournit les événements tactiles. Il n\'est pas chargé par défaut.'
            },
            usage : {
                direct : true
            },
            extlinks : [
                'http://eightmedia.github.io/hammer.js/'
            ]
        };

        model.parent.store.childsupport(data,model);

    };

};
