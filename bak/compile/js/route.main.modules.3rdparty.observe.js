module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {
                en : 'Observe.js is part of the Polymer suite. It allows for data binding where Object.observe() isn\'t available.',
                fr : 'Observe.js fait partie de la combinaison polymère pour permettre la liaison de données où Object.observe() n\'est pas disponible.'
            },
            usage : {
                direct : true
            },
            extlinks : [
                'https://github.com/Polymer/observe-js'
            ]
        };

        model.parent.store.childsupport(data,model);

    };
};