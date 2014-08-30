module.exports = function(app) {

    return function(model) {

        var data = {

            desc : {
                en : 'Provides centralised country switching and related functionality. Supported countries are defined at the bottom of the file but may be set via an API or configuration file. Use ISO 3166-1. This configuration also saves the applied code using core.store.',
                fr : 'Permet de passer de pays centralisé et les fonctionnalités associées. Pays pris en charge sont définis à la fin du fichier, mais peuvent être réglés via une API ou un fichier de configuration.'
            },
            author : { 
                name:'Andrew Charnley', 
                link:'mailto:andrew.charnley@igaro.com' 
            },
            usage : {
                class : true
            },
            dependencies : [
                'core.store'
            ],
            extlinks : [
                {
                    href:'http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2',
                    name:'ISO 3166-1 Alpha 2'
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
                            name:'get',
                            type:'function',
                            desc: {
                                en : 'Returns the currently applied language code.',
                                fr : 'Retourne le code de langue actuellement appliqué.'
                            }
                        },
                        {
                            name:'set',
                            type:'function',
                            desc: {
                                en : 'Sets the currently applied language code. Returns boolean to indicate success.',
                                fr : 'Définit le code de langue actuellement appliqué. Retours booléen pour indiquer la réussite.'
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
                                    en : 'The code to match.',
                                    fr : 'Le code de match.'
                                }
                            }]
                        }
                    ],
                    desc: {
                        en : 'Returns a language object for the specified code.',
                        fr : 'Renvoie un objet de langage pour le code spécifié.'
                    }
                },
                { 
                    name:'pool',
                    type:'object',
                    desc: {
                        en : 'Management of codes.',
                        fr : 'Gestion des codes.'
                    },
                    attributes : [
                        {
                            name:'get',
                            type:'function',
                            desc: {
                                en : 'Returns the list. Use this instead of accessing the list directly.',
                                fr : 'Renvoie la liste. Utilisez ce lieu d\'accéder à la liste directement.'
                            }
                        },
                        {
                            name:'list',
                            type:'object',
                            desc: {
                                en : 'Collection of language id.',
                                fr : 'Collection de Identifiant de la langue.'
                            }
                        },
                        {
                            name:'set',
                            type:'function',
                            desc: {
                                en : 'Sets the pool to a new array of id.',
                                fr : 'Définit la piscine pour un nouveau tableau de id.'
                            }
                        }
                    ]
                },
            ]
        };

        model.parent.store.childsupport(data,model);
    };
};