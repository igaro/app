module.exports = function(app) {

    return function(model) {

        var data = {

            demo : " \n \
view.instances.add('pagemessage', { \n \
    container:c, \n \
    type:'error', \n \
    message : { \n \
        en : 'Some sort of error occured.', \n \
        fr : 'xyz' \n \
    } \n \
}); \n \
view.instances.add('pagemessage', { \n \
    container:c, \n \
    type:'success', \n \
    id:'7x4d', \n \
    hideable: true, \n \
    message : { \n \
        en : 'After closing this message try refreshing your page.', \n \
        fr : 'Après la fermeture de ce message essayez de rafraîchir votre page.' \n \
    } \n \
});",
            desc : {
                en : 'Provides a styled message for display on a view.',
                fr : 'Fournit un message de style pour l\'affichage sur une vue.'
            },
            author : { 
                name:'Andrew Charnley', 
                link:'http://www.andrewcharnley.com' 
            },
            usage : {
                instantiate : true,
                attributes : [
                    { 
                        name:'container', 
                        type:'element',
                        desc : {
                            en : 'Container to append the instance into.',
                            fr : 'Conteneur pour ajouter l\'instance en.'
                        }
                    },
                    { 
                        name:'id', 
                        type:'string',
                        desc : {
                            en : 'The id is automatically determined by the location where the message is appended, however it can be set manually.',
                            fr : 'L\'identifiant est automatiquement déterminée par l\'endroit où le message est ajouté, mais il peut être réglée manuellement.'
                        }
                    },
                    { 
                        name:'hideable', 
                        type:'boolean',
                        desc : {
                            en : 'Allow the message to be permanently hidden.',
                            fr : 'Laisser le message caché en permanence.'
                        }
                    },
                    { 
                        name:'message', 
                        type:'object',
                        required:true,
                        desc : {
                            en : 'A standard language object to be displayed.',
                            fr : 'Un objet de langue standard à afficher.'
                        }
                    },
                    { 
                        name:'type', 
                        type:'string',
                        desc : {
                            en : 'The type defines the style. Choose between; warn, info, error, default, success and ok.',
                            fr : 'Le genre définit le style. Choisissez entre les deux; avertir, info, erreur, défaut, le succès et ok.'
                        }
                    }
                ]
            },
            attributes : [
                { 
                    name:'destroy',
                    type:'function',
                    desc: {
                        en : 'Destroys the instance, removing it from the view and cleaning up any references.',
                        fr : ''
                    }
                }
            ]
        };

        model.parent.store.childsupport(data,model);

    };
};
