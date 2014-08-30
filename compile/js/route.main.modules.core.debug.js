module.requires = [
    { name:'core.language.js'}
];

module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {
                en : 'Handles debug messages and fires an event when one comes in.',
                fr : 'Poignées messages de débogage et déclenche un événement lorsque l\'on entre en jeu.'
            },
            author : { 
                name:'Andrew Charnley', 
                link:'mailto:andrew.charnley@igaro.com' 
            },
            usage : {
                class : true
            },
            attributes : [
                {
                    type:'object',
                    name:'log',
                    desc : {
                        en : 'Manages and stores the log data.',
                        fr : 'Gère et stocke les données du journal.'
                    },
                    attributes : [
                        { 
                            name:'append',
                            type:'function',
                            attributes: [
                                { 
                                    type:'string',
                                    required:true, 
                                    attributes:[{
                                        desc: {
                                            en : 'The module name.',
                                            fr : 'Le nom du module.'
                                        }
                                    }]
                                },
                                { 
                                    type:'string',
                                    required:true, 
                                    attributes:[{
                                        desc: {
                                            en : 'The event name.',
                                            fr : 'Le nom de l\'événement.'
                                        }
                                    }]
                                },
                                { 
                                    type:'object', 
                                    required:true, 
                                    attributes:[{
                                        desc: {
                                            en : 'A value to pass to functions registered to receive the debug event. You can pass anything here.',
                                            fr : 'Une valeur à passer à des fonctions inscrit pour recevoir l\'événement de débogage. Vous pouvez passer quelque chose ici.'
                                        }
                                    }]
                                }
                            ],
                            desc: {
                                en : 'Appends a debug event to storage and fires a core.debug event containing the data.',
                                fr : 'Ajoute un événement de mise au point pour le stockage et déclenche un événement de core.debug contenant les données.'
                            }
                        },
                        { 
                            name:'data',
                            type:'array', 
                            desc : {
                                en : 'Contains debug data appended since program execution.',
                                fr : 'Contient des données de débogage annexés depuis l\'exécution du programme.'
                            }   
                        },
                    ]
                }
            ]
        };

        model.parent.store.childsupport(data,model);

    };
};