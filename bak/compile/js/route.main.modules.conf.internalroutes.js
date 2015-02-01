module.exports = function(app) {

    return function(model) {

        var data = {
            
            desc : {
                en : 'Appends a source to core.mvc for the loading of internal route files. It is expected this will be the first source to be appended (so last to be called) allowing paths to be overrideable by API sources.',
                fr : 'Ajoute une source de core.mvc pour le chargement des fichiers d\'itinéraire internes. Il est prévu que ce sera la première source devra être annexée (de sorte à être appelé dernier) permettent trajets soient de dérogation possible par des sources de l\'API.'
            },

            author : { 
                name:'Andrew Charnley', 
                link:'http://www.andrewcharnley.com' 
            }
        };

        model.parent.store.childsupport(data,model);
    };
};
