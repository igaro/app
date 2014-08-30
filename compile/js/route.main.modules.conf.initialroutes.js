module.exports = function(app) {

    return function(model) {

        var data = {

            desc : {
                en : 'Defines hardcoded mvc routes which otherwise would be sourced from an API.',
                fr : 'définit les routes en dur mvc initiales qui seraient autrement provenant d\'une API.'
            },

            author : { 
                name:'Andrew Charnley', 
                link:'mailto:andrew.charnley@igaro.com' 
            }

        };

        model.parent.store.childsupport(data,model);
    };
};
