module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {
                en : 'Provides url and uri related functionality.',
                fr : 'Fournit url et fonctionnalités uri connexe.'
            },
            author : { 
                name:'Andrew Charnley', 
                link:'http://www.andrewcharnley.com' 
            },
            usage : {
                class : true
            },
            attributes : [
                { 
                    name:'getCurrent', 
                    type:'function',
                    attributes: [
                        { 
                            type:'object',
                            attributes : [
                                {
                                    name:'search',
                                    type:'boolean',
                                    desc: {
                                        en : 'Pass false to strip the search data (after ?). Default is true.',
                                        fr : 'Passer false pour dépouiller les données de recherche (après?). Par défaut est true.'
                                    }
                                },
                                {
                                    name:'path',
                                    type:'boolean',
                                    desc: {
                                        en : 'Pass false to strip the path. Default is true.',
                                        fr : 'Passer false pour dépouiller le chemin. Par défaut est true.'
                                    }
                                }
                            ]
                        }
                    ],
                    desc: {
                        en : 'Returns the current fully qualified domain name.',
                        fr : 'Retourne le nom de domaine complet actuel.'
                    }
                },
                { 
                    name:'getParam', 
                    type:'function',
                    attributes: [
                        { 
                            type:'string', 
                            required:true, 
                            attributes : [{
                                desc: {
                                    en : 'The name to search.',
                                    fr : 'Le nom de la recherche.'
                                }
                            }]
                        },
                        { 
                            type:'string',
                            attributes : [{
                                desc: {
                                    en : 'The URL to use (defaults to the current URL).',
                                    fr : 'L\'URL à utiliser (par défaut l\'URL courante).'
                                }
                            }]
                        }
                    ],
                    desc: {
                        en : 'Parses a string for params and on match returns the value.',
                        fr : 'Analyse une chaîne pour params et sur ​​le match retourne la valeur.'
                    }
                },
                { 
                    name:'replaceParam', 
                    type:'function',
                    attributes: [
                        { 
                            type:'string', 
                            required:true, 
                            attributes: [{
                                desc: {
                                    en : 'The name of to replace or append.',
                                    fr : 'Le nom de remplacer ou ajouter.'
                                }
                            }]
                        },
                        { 
                            type:'string', 
                            required:true, 
                            attributes: [{
                                desc: {
                                    en : 'The value to use. If the value contains special characters pass encodeURIComponent(value) beforehand.',
                                    fr : 'La valeur à utiliser. Si la valeur contient des caractères spéciaux passent encodeURIComponent(valeur) à l\'avance.'
                                }
                            }]
                        },
                        {
                            type:'string', 
                            attributes: [{
                                desc: {
                                    en : 'The URL to use (defaults to the current URL).',
                                    fr : 'L\'URL à utiliser (par défaut l\'URL courante).'
                                }
                            }]
                        }
                    ],
                    desc: {
                        en : 'Parses a URL and replaces or appends a new param, returning the new URL.',
                        fr : 'Analyse une URL et remplace ou ajoute un nouveau paramètre, le retour de la nouvelle URL.'
                    }
                }
            ]

        };

        model.parent.store.childsupport(data,model);

    };

    return true;

};
