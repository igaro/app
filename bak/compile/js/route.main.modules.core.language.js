module.exports = function(app) {

    return function(model) {

        var data = {

            desc : {
                en : 'Provides centralised language switching and related functionality. Supported languages are defined at the bottom of the file but may be set via an API or configuration file. Use IETF Tags. If the code isn\'t set core.country will be queried to determine it. This configuration also saves the applied code using core.store.',
                fr : 'Fournit la commutation de langue centralisé et les fonctionnalités associées. Langues prises en charge sont définis à la fin du fichier, mais peuvent être réglés via une API ou un fichier de configuration. Utilisez IETF clefs. Si le code n\'est pas réglé core.country seront interrogés à déterminer. Cette configuration permet également d\'économiser le code appliqué à l\'aide core.store.'
            },
            author : { 
                name:'Andrew Charnley', 
                link:'http://www.andrewcharnley.com' 
            },
            usage : {
                class : true
            },
            dependencies : [
                'core.store',
                'core.country'
            ],
            extlinks : [
                {
                    href:'http://en.wikipedia.org/wiki/IETF_language_tag',
                    name:'IETF Tag'
                }
            ],
            attributes : [
                { 
                    name:'code',
                    type:'object',
                    desc: {
                        en : 'Application of a permissible language code.',
                        fr : 'L\'application d\'un code de langue admissible.'
                    },
                    attributes : [
                        {
                            name:'set',
                            type:'function',
                            desc: {
                                en : 'Sets the currently applied language code. Returns boolean to indicate success.',
                                fr : 'Définit le code de la langue actuellement en vigueur. Retours booléen pour indiquer la réussite.'
                            },
                            attributes : [{
                                type:'string',
                                required:true,
                                attributes:[{
                                    desc: {
                                        en : 'The code must exist in the current pool and is case sensitive.',
                                        fr : 'Le code doit exister dans le bassin actuel et est sensible à la casse.'
                                    }
                                }]

                            }]
                        },
                        {
                            name:'get',
                            type:'function',
                            desc: {
                                en : 'Returns the currently applied language code.',
                                fr : 'Retourne le code de la langue actuellement en vigueur.'
                            }
                        }
                    ]
                },
                { 
                    name:'getNameOfId', 
                    type:'function',
                    attributes: [
                        { 
                            type:'string', 
                            required:true,
                            attributes:[{
                                desc: {
                                    en : 'The ID to match.',
                                    fr : 'Le code de match.'
                                }
                            }]
                        }
                    ],
                    desc: {
                        en : 'Returns a language object for the specified code.',
                        fr : 'Renvoie un objet de langue pour le code spécifié.'
                    }
                },
                { 
                    name:'mapKey', 
                    type:'function',
                    attributes: [
                        { 
                            type:'function/object', 
                            required:true, 
                            attributes:[{
                                desc: {
                                    en : 'A structure containing language codes.',
                                    fr : 'Codes ou de la fonction de langue de retourner la valeur.'
                                }
                            }]
                        }
                    ],
                    desc: {
                        en : 'Returns the value of a function or steps into the object using the current language code and returns what\'s there.',
                        fr : 'Retourne la valeur d\'une fonction ou pas dans l\'objet en utilisant le code de langue actuel et retourne ce qui est là.'
                    }
                },
                { 
                    name:'pool',
                    type:'object',
                    desc: {
                        en : 'Management of permissible language codes.',
                        fr : 'Gestion des codes de langue admissibles.'
                    },
                    attributes : [
                        {
                            name:'list',
                            type:'object',
                            desc: {
                                en : 'Collection of language codes.',
                                fr : 'Collection des codes de langue.'
                            }
                        },
                        {
                            name:'set',
                            type:'function',
                            desc: {
                                en : 'Sets the pool to a new array of codes.',
                                fr : 'Définit la piscine pour un nouveau tableau de codes.'
                            }
                        },
                        {
                            name:'get',
                            type:'function',
                            desc: {
                                en : 'Returns the list. Use this instead of accessing the list directly.',
                                fr : 'Renvoie la liste. Utilisez ce lieu d\'accéder à la liste directement.'
                            }
                        }
                    ]
                }
            ],
            related : [
                'conf.language.js'
            ]
        };

        model.parent.store.childsupport(data,model);

    };
};
