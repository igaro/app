module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {
                en : 'This module polyfills standard Promise A+ spec into older browsers. \
Promise.all(), Promise.race() and all standard functions are provided. \
This module is only loaded if required.',
                fr : 'Cette polyfills module Promesse norme A + spec dans les navigateurs plus anciens. \
Promise.all (), Promise.race () et toutes les fonctions standard sont fournis. \
Ce module est chargé uniquement si nécessaire.'
            },
            author : { 
                name:'Andrew Charnley', 
                link:'http://www.andrewcharnley.com' 
            },
            extlinks : [
                'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise'
            ]
        };

        model.parent.stash.childsupport(data,model);

    };

};
