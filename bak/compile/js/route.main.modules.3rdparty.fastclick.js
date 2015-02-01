module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {
                en : 'This library works around the 300ms browser click delay for a better user experience when deploying Igaro App on mobile devices. This module is included by default.',
                fr : 'Cette bibliothèque fonctionne dans le navigateur, cliquez 300ms de retard pour une meilleure expérience utilisateur lors du déploiement Igaro App sur les appareils mobiles. Ce module est inclus par défaut.'
            },
            usage : {
                direct : true,
            },
            extlinks : [
                'http://labs.ft.com/articles/ft-fastclick/'
            ]
        };

        model.parent.store.childsupport(data,model);

    };

};
