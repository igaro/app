module.exports = function(app) {

    return function(model) {

        var data = {

            desc : {
                en : 'Dispatches events and manages handles to functions.',
                fr : 'Distribue des événements et gère poignées de fonctions.'
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
                    name:'dispatch', 
                    type:'function',
                    attributes: [
                        { 
                            type:'string', 
                            required:true,
                            attributes : [{
                                desc: {
                                    en : 'Module name.',
                                    fr : 'Nom du module.'
                                }
                            }]
                        },
                        { 
                            type:'string', 
                            required:true,
                            attributes : [{
                                desc: {
                                    en : 'Event name.',
                                    fr : 'Nom de l\'événement.'
                                }
                            }]
                        },
                        { 
                            type:'object',
                            attributes : [{
                                desc: {
                                    en : 'An object to pass to the function. Other data types are also possible.',
                                    fr : 'Un objet à passer à la fonction. D\'autres types de données sont également possibles.'
                                }
                            }]
                        }
                    ],
                   
                    desc: {
                        en : 'Triggers registered event callbacks.',
                        fr : 'Déclenche rappels d\'événements enregistrés.'
                    }
                },
                { 
                    name:'on', 
                    type:'function',
                    attributes: [
                        { 
                            type:'string', 
                            required:true, 
                            attributes: [ 
                                {
                                    desc: {
                                        en : 'The module name.',
                                        fr : 'Le nom du module.'
                                    }
                                }
                            ]
                        },
                        { 
                            type:'string', 
                            required:true,
                            attributes: [ 
                                {
                                    desc: {
                                        en : 'The event name.',
                                        fr : 'Le nom de l\'événement.'
                                    }
                                }
                            ]
                        },
                        { 
                            type:'function', 
                            required:true,
                            attributes: [ 
                                {
                                    desc: {
                                        en : 'Function to execute on event trigger.',
                                        fr : 'Fonction à exécuter sur l\'événement déclencheur.'
                                    }
                                }
                            ]
                        }
                    ],
                    desc: {
                        en : 'Registers a callback using the module name and event.',
                        fr : 'Enregistre un rappel à l\'aide du nom du module et l\'événement.'
                    }
                },
                { 
                    name:'remove', 
                    type:'function',
                    attributes: [
                        { 
                            type:'function',
                            required:true,
                            attributes : [{
                                desc: {
                                    en : 'The function that was previously registered.',
                                    fr : 'La fonction qui a été précédemment enregistré.'
                                }
                            }]
                        },
                        {
                            type:'string',
                            attributes : [{
                                desc: {
                                    en : 'The module name to be used to lookup the function. This makes the lookup faster and prevents the function being deregistered from all module names.',
                                    fr : 'Le nom du module à utiliser pour rechercher la fonction. Cela rend la recherche plus rapidement et empêche la fonction est radié de tous les noms de modules.'
                                }
                            }]
                        },
                        { 
                            type:'string',
                            attributes : [{
                                desc: {
                                    en : 'The event name to be used to lookup the function. This makes the lookup faster and prevents the function being deregistered from all event names.',
                                    fr : 'Le nom de l\'événement à être utilisé pour rechercher la fonction. Cela rend la recherche plus rapidement et empêche la fonction est radié de tous les noms d\'événements.'
                                }
                            }]
                        }
                    ],
                    desc: {
                        en : 'Deregisters a function from the event pool.',
                        fr : 'Radie une fonction dans la piscine de l\'événement.'
                    }
                }
            ]
        };

        model.parent.store.childsupport(data,model);

    };

};
