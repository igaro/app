module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {
                en : 'Provides date and timezone functionality. Date strings should be of ISO 8601. The timezone is determined from the system clock but can be overridden. On overriding the value is stored using core.store.',
                fr : 'La date et la fonctionnalité de fuseau horaire fournit. Date de chaînes devraient être la norme ISO 8601. Le fuseau horaire est déterminée à partir de l\'horloge système, mais peut être remplacée. Sur le remplacement de la valeur est stockée en utilisant core.store.'
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
            attributes : [
                { 
                    name:'daysInMonth', 
                    type:'function',
                    attributes: [
                        { 
                            type:'number', 
                            required:true, 
                            attributes : [{
                                desc: {
                                    en : 'The year value.',
                                    fr : 'La valeur de l\'année.'
                                }
                            }]
                        },
                        { 
                            type:'number', 
                            required:true, 
                            attributes : [{
                                desc: {
                                    en : 'The month value.',
                                    fr : 'La valeur du mois.'
                                }
                            }]
                        }
                    ],
                    desc: {
                        en : 'Returns the amount of days within a month for a given year.',
                        fr : 'Retourne le nombre de jours dans un mois pour une année donnée.'
                    }
                },
                { 
                    name:'isLeapYear', 
                    type:'function',
                    attributes: [
                        { 
                            type:'number', 
                            required:true, 
                            attributes : [{
                                desc: {
                                    en : 'The year to check.',
                                    fr : 'L\'année à vérifier.'
                                }
                            }]
                        }
                    ],
                    desc: {
                        en : 'Returns true if the specified year is a leap.',
                        fr : 'Retourne true si l\'année spécifiée est un saut.'
                    }
                },
                { 
                    name:'offset', 
                    type:'object',
                    desc: {
                        en : 'Minutes to use as the timezone offset from GMT.',
                        fr : 'Minutes à utiliser comme le décalage de fuseau horaire GMT.'
                    },
                    attributes : [
                        {
                            name:'get',
                            type:'function',
                            desc: {
                                en : 'Returns the offset value.',
                                fr : 'Retourne la valeur de décalage.'
                            }
                        },
                        {
                            name:'set',
                            type:'function',
                            desc: {
                                en : 'Sets the timezone offset.',
                                fr : 'Définit le décalage horaire.'
                            },
                            attributes : [{
                                type:'number',
                                required:true,
                                attributes:[{
                                    desc: {
                                        en : 'Amount of minutes. Use null for system default.',
                                        fr : 'Montant de minutes. Utilisez nulle pour défaut du système.'
                                    }
                                }]
                            }]
                        }
                    ]
                },
                { 
                    name:'strip', 
                    type:'function',
                    attributes: [
                        { 
                            type:'date/string', 
                            required:true, 
                            attributes : [{
                                desc: {
                                    en : 'The value to parse.',
                                    fr : 'La valeur à analyser.'
                                }
                            }]
                        }
                    ],
                    desc: {
                        en : 'Removes anything non-numeric and returns the remainder. Useful for generating an id.',
                        fr : 'Supprime tout ce non-numérique et renvoie le reste. Utile pour générer un identifiant.'
                    }
                },
                { 
                    name:'userTz', 
                    type:'function',
                    attributes: [
                        { 
                            type:'date', 
                            required:true, 
                            attributes : [{
                                desc: {
                                    en : 'The value to convert.',
                                    fr : 'La valeur à convertir.'
                                }
                            }]
                        }
                    ],
                    desc: {
                        en : 'Returns a date object in the user\'s timezone.',
                        fr : 'Renvoie un objet de date dans le fuseau horaire de l\'utilisateur.'
                    }
                }
            ]
        };

        model.parent.store.childsupport(data,model);

    };

    return true;

};
