module.exports = function(app) {

    return function(model) {

        var data = {

            demo : "model.managers.object.create('bookmark', { container:c }) ",
            desc : {
                en : 'Provides a simple bookmark toolbar for the major social platforms.',
                fr : 'Fournit une barre de signets simple pour les principales plates-formes sociales.'
            },
            usage : {
                instantiate : true,
                attributes : [
                    { 
                        name:'url', 
                        type:'string',
                        desc : {
                            en : 'The URL to bookmark. Defaults to the current.',
                            fr : 'L\' URL pour l\'ajouter. Par défaut, le courant.'
                        }
                    },
                    { 
                        name:'title', 
                        type:'string',
                        desc : {
                            en : 'Title to pass over to the external service.',
                            fr : 'Titre de passer au service externe.'
                        }
                    },
                    { 
                        name:'container', 
                        type:'element',
                        desc : {
                            en : 'Container to append the instance into.',
                            fr : 'Conteneur pour ajouter l\'instance en.'
                        }
                    }
                ]
            },

            author : { 
                name:'Andrew Charnley', 
                link:'http://people.igaro.com/ac' 
            },
            attributes : [
                { 
                    name:'setURL',
                    type:'function',
                    desc: {
                        en : 'Sets the URL and optional title to pass over to the external service.',
                        fr : 'Définit l\'URL et le titre facultatif à passer au service externe.'
                    },
                    attributes : [
                        {
                            type:'object',
                            attributes : [
                                { 
                                    name:'url', 
                                    type:'string',
                                    desc : {
                                        en : 'URL to bookmark. Defaults to the current.',
                                        fr : 'URL de signet. Par défaut, le courant.'
                                    }
                                },
                                { 
                                    name:'title', 
                                    type:'string',
                                    desc : {
                                        en : 'Title to pass over.',
                                        fr : 'Titre de passer au-dessus.'
                                    }
                                }
                            ]
                        }
                    ]
                },
                { 
                    name:'container', 
                    type:'element',
                    desc: {
                        en : 'Element the instance is appended into.',
                        fr : 'L\'élément instance est ajouté dans.'
                    }
                }
            ]
        };

        model.parent.stash.childsupport(data,model);

    };

};
