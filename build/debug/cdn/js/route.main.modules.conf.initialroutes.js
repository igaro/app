module.exports = function(app) {

    return function(model) {

        var data = {

            desc : {
                en : 'Defines hardcoded router routes which otherwise would be sourced from an API.',
                fr : 'définit les routes en dur router initiales qui seraient autrement provenant d\'une API.'
            },

            author : { 
                name:'Andrew Charnley', 
                link:'http://www.andrewcharnley.com' 
            }

        };

        model.parent.stash.childsupport(data,model);
    };
};
