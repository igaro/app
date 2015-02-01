module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {
                en : 'JQuery 2 is provided to allow for code written with this library to be easy imported. It isn\'t required by Igaro App and isn\'t loaded by default.',
                fr : 'JQuery 2 est prévu pour permettre le code écrit avec cette bibliothèque à facile importé. Il n\'est pas nécessaire de Igaro App et n\'est pas chargé par défaut.'
            },
            usage : {
                direct : true,
            },
            extlinks : [
                'http://www.jquery.com'
            ]
        };

        model.parent.store.childsupport(data,model);

    };

};
