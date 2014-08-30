module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {
                en : 'Asynchronously loads modules and there dependencies using XHR and appends Igaro App modules into the namespace.',
                fr : 'Charge asynchrone modules et il dépendances en utilisant XHR et ajoute des modules Igaro Application dans l\'espace de noms.'
            },
            author : { 
                name:'Andrew Charnley', 
                link:'mailto:andrew.charnley@igaro.com' 
            },
            usage : {
                instantiate : true,
                attributes : [
                    { 
                        name:'repo',
                        type:'string',
                        desc : {
                            en : 'The repository (i.e URL) from which to load files. Defaults to the location where the application was loaded from.',
                            fr : 'Le dépôt (à savoir l\'URL) pour charger les fichiers. Par défaut, le lieu où la demande a été chargé à partir.'
                        }
                    },
                    { 
                        name:'modules', 
                        required:true,
                        type:'array',
                        desc : {
                            en : 'Modules to load. Each is represented by an object.',
                            fr : 'Modules à charger. Chacun d\'eux est représenté par un objet.'
                        },
                        attributes : [
                            {
                                name:'name',
                                type:'string',
                                required:true,
                                desc: {
                                    en : 'The name of the module excluding extension.',
                                    fr : 'Le nom du module excluant l\'extension.'
                                }
                            },
                            {
                                name:'nosub',
                                type:'boolean',
                                desc : {
                                    en : 'By default a folder /js will be appended to the repo location. Set to true to disable this.',
                                    fr : 'Par défaut un dossier /js seront ajoutés à l\'emplacement des prises en pension. Affectez la valeur true pour le désactiver.'
                                }
                            },
                            {
                                name:'onProgress',
                                type:'function',
                                desc : {
                                    en : 'Callback for when an individual part of the loading process has completed.',
                                    fr : 'Rappel pour quand une partie individuelle du processus de chargement est terminé.'
                                }
                            },
                            {
                                name:'repo',
                                type:'string',
                                desc : {
                                    en : 'The module will use the instantiated repo value unless this is set.',
                                    fr : 'Le module utilise la valeur des pensions instancié sauf si cela est réglé.'
                                }
                            },
                            {
                                name:'requires',
                                type:'array',
                                desc : {
                                    en : 'A module usually defines its dependencies, but they can also be specified here. A dependency follows the same format as this object.',
                                    fr : 'Un module définit habituellement ses dépendances, mais ils peuvent aussi être spécifié ici. Une dépendance suit le même format que cet objet.'
                                }
                            }
                        ]
                    }
                ]
            },
            attributes : [
                { 
                    name:'get',
                    type:'function', 
                    attributes: [
                        { 
                            type:'object', 
                            desc: {
                                en : 'Any of the instantiated attributes can be passed here to update the instance before executing the Promise, else the default or previously set values will be used.',
                                fr : 'L\'un des attributs instanciés peut être passé ici pour mettre à jour l\'instance avant d\'exécuter la promesse, sinon le défaut ou les valeurs précédemment définies seront utilisées.'
                            }
                        }
                    ],
                    returns : {
                        attributes : [{
                            instanceof: { name: 'Promise' },
                            desc : {
                                en : 'Resolves when all modules and dependencies are loaded.',
                                fr : 'Décide quand tous les modules et les dépendances sont chargées.'
                            }
                        }]
                    },
                }
            ]

        };

        model.parent.store.childsupport(data,model);
    };

};
