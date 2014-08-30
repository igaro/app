module.exports = function(app) {

    return function(model) {

        var data = {

            desc : {
                en : 'Provides centralised currency switching and related functionality. Supported currencies are defined at the bottom of the file but may be set via an API or configuration file. Use ISO 4217. If the code isn\'t set core.country will be queried to determine it. This configuration also saves the applied code using core.store.',
                fr : 'Fournit la commutation de monnaie centralisée et les fonctionnalités associées. Devises prises en charge sont définis à la fin du fichier, mais peuvent être réglés via une API ou un fichier de configuration. Utilisez ISO 4217. Si le code n\'est pas réglé core.country sera demandé de le déterminer. Cette configuration permet également d\'économiser le code appliqué à l\'aide core.store.'
            },
            author : { 
                name:'Andrew Charnley', 
                link:'mailto:andrew.charnley@igaro.com' 
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
                    href:'http://en.wikipedia.org/wiki/ISO_4217',
                    name:'ISO 4217'
                }
            ],
            attributes : [
                { 
                    name:'code',
                    type:'object',
                    desc: {
                        en : 'Application of a permissible currency code.',
                        fr : 'L\'application d\'un code de monnaie admissible.'
                    },
                    attributes : [
                        {
                            name:'id',
                            type:'string',
                            desc: {
                                en : 'The currently applied currency code. Use .get() instead.',
                                fr : 'Le code de monnaie actuellement en vigueur. Utilisez .get() à la place.'
                            }
                        },
                        {
                            name:'set',
                            type:'function',
                            desc: {
                                en : 'Sets the currently applied currency code. Returns boolean to indicate success.',
                                fr : 'Définit le code de la monnaie actuellement en vigueur. Retours booléen pour indiquer la réussite.'
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
                                en : 'Returns the currently applied currency code.',
                                fr : 'Retourne le code de la monnaie actuellement en vigueur.'
                            }
                        }
                    ]
                },
                { 
                    name:'decimalise', 
                    type:'function',
                    attributes: [
                        { 
                            type:'float/number', 
                            required:true, 
                            attributes : [{
                                desc: {
                                    en : 'The value to process.',
                                    fr : 'La valeur à traiter.'
                                }
                            }]
                        },
                    ],
                    desc: {
                        en : 'Takes a denomination and returns it to two decimal places.',
                        fr : 'Prend une dénomination et la renvoie à deux décimales.' 
                    }
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
                        en : 'Returns a currency object for the specified code.',
                        fr : 'Renvoie un objet de devises pour le code spécifié.'
                    }
                },
                { 
                    name:'pool',
                    type:'object',
                    desc: {
                        en : 'Management of permissible currency codes.',
                        fr : 'Gestion des codes de devises admissibles.'
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
                                en : 'Collection of currency codes.',
                                fr : 'Collection des codes de devises.'
                            }
                        },
                        {
                            name:'set',
                            type:'function',
                            desc: {
                                en : 'Sets the pool to a new array of codes.',
                                fr : 'Définit la piscine pour un nouveau tableau de codes.'
                            }
                        }
                    ]
                },
                { 
                    name:'validate', 
                    type:'function',
                    attributes: [
                        { 
                            type:'float/number', 
                            required:true, 
                            attributes : [{
                                desc: {
                                    en : 'The value to validate.',
                                    fr : 'La valeur à valider.'
                                }
                            }]
                        },
                        { 
                            type:'boolean', 
                            required:false, 
                            attributes : [{
                                desc: {
                                    en : 'Allow negative values. Default is no.',
                                    fr : 'Autoriser les valeurs négatives. Défaut est non.'
                                }
                            }]
                        }
                    ],
                    desc: {
                        en : 'Takes a denomination and returns true if the value has no fraction or is of two decimal place.',
                        fr : 'Prend une dénomination et renvoie true si la valeur n\'a pas de fraction ou est de deux décimale'
                    }
                }
            ]
        };

        model.parent.store.childsupport(data,model);
    };
};
