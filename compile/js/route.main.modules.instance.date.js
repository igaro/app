module.exports = function(app) {

    return function(model) {

        var data = {

            demo : "view.instances.add('date', { container:c, date:new Date(), format:'LLLL', })",
            desc : {
                en : 'Provides a managed date with automatic display and timezone conversion. By default uses 3rdparty.moment.js for formatting to the user locale.',
                fr : 'Fournit une date géré avec affichage automatique et la conversion de fuseau horaire. Par défaut utilise 3rdparty.moment.js de mise en forme à l\'utilisateur locale.'
            },
            usage : {
                instantiate : true,
                attributes : [
                    { 
                        name:'date', 
                        type:'date',
                        desc : {
                            en : 'The date to use.',
                            fr : 'La date à utiliser.'
                        },
                        required:true
                    },
                    { 
                        name:'format', 
                        type:'string',
                        desc : {
                            en : 'The format used to stringify the date object.',
                            fr : 'Le format utilisé pour chaîne toutes l\'objet de date.'
                        },
                        required:true
                    },
                    { 
                        name:'container', 
                        type:'element',
                        desc : {
                            en : 'Container to append the instance into.',
                            fr : 'Conteneur pour ajouter l\'instance en.'
                        }
                    },
                    { 
                        name:'offset', 
                        type:'number',
                        desc : {
                            en : 'By default the timezone offset will be read from core.date.js. To set a specific timezone specify the +- minutes here.',
                            fr : 'Par défaut, le décalage horaire sera lue à partir core.date.js. Pour définir un fuseau horaire spécifique précise les + - minutes ici.'
                        }
                    }
                ]
            },

            author : { 
                name:'Andrew Charnley', 
                link:'mailto:andrew.charnley@igaro.com' 
            },
            attributes : [
                { 
                    name:'set',
                    type:'function',
                    desc: {
                        en : 'Sets the date.',
                        fr : 'Définit la date.'
                    },
                    attributes : [
                        {
                            type:'date'
                        }
                    ]
                },
                { 
                    name:'offset',
                    type:'function',
                    desc: {
                        en : 'Sets the timezone offset.',
                        fr : 'Définit le décalage horaire.'
                    },
                    attributes : [
                        {
                            type:'number',
                            attributes: [{
                                desc: {
                                    en : '+- 15 minute blocks.',
                                    fr : '+- Blocs de 15 minutes.'
                                }
                            }]
                        },
                        {
                            type:'boolean',
                            attributes: [{
                                desc: {
                                    en : 'By default the offset is stored. Use true to disable.',
                                    fr : 'Par défaut, le décalage est stocké. Utilisez true pour désactiver.'
                                }
                            }]
                        }
                    ]
                },
                { 
                    name:'container', 
                    type:'element',
                    desc: {
                        en : 'The element the instance is appended into.',
                        fr : 'L\'élément de l\'instance est ajouté dans.'
                    }
                },
                { 
                    name:'format', 
                    type:'function',
                    desc: {
                        en : 'Formats the stringified version of the date.',
                        fr : 'Formate la version chainifiée de la date.'
                    },
                    attributes : [
                        {
                            type:'string',
                            required:true,
                            attributes:[{
                                desc: {
                                    en : 'The formatting code to pass to the plugin.',
                                    fr : 'Le code de mise en forme pour passer au plugin.'
                                }
                            }]
                        }
                    ]
                }
            ],
            related : [
                '3rdparty.moment.js',
                'core.date.js'
            ]
        };

        model.parent.store.childsupport(data,model);

    };

};
