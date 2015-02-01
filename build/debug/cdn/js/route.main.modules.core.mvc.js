module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {
                en : 'Provides a Model-View-Controller framework to manage navigation and storage for models. A model represents a resource and manages child models. Each model has a view. Models can be loaded from multiple API & file servers transparently to the user.',
                fr : 'Fournit un cadre Model-View-Controller pour gérer les navigation et de stockage pour les modèles. Un modèle représente une ressource et gère les modèles de l\'enfant. Chaque modèle dispose d\'une vue. Les modèles peuvent être chargés à partir de plusieurs serveurs de fichiers API et transparente pour l\'utilisateur.'
            },
            author : { 
                name:'Andrew Charnley', 
                link:'http://www.andrewcharnley.com' 
            },
            usage : {
                class : true
            }
        }
            
        data.objects = {

            model : { 
                name:'Model',
                desc: {
                    en : 'Logic and data for managing a view.',
                    fr : 'Logique et les données pour la gestion d\'un point de vue.' 
                },
                attributes : [
                    { 
                        name:'children', 
                        type:'object',
                        'instanceof': function() { return data.objects.children }
                    },
                    { 
                        name:'events', 
                        type:'object',
                        desc : {
                            en : 'References core.events but with a mechanism for removing events upon model removed. Functionally identical. View code should not use core.events.',
                            fr : 'Références core.events mais avec un mécanisme pour enlever des événements lorsque le modèle est éliminé. Fonctionnellement identique. Voir code doit utiliser ce pas core.events.'
                        }
                    },
                    { 
                        name:'meta', 
                        type:'object',
                        'instanceof': function() { return data.objects.meta }
                    },
                    { 
                        name:'name', 
                        type:'string',
                        desc : {
                            en : 'Last folder name from .path. Not to be used for user display.',
                            fr : 'Nom de dossier de chemin. Pour ne pas être utilisée pour l\'affichage de l\'utilisateur.'
                        }
                    },
                    { 
                        name:'parent', 
                        type:'object',
                        'instanceof': function() { return data.objects.model },
                        desc : {
                            en : 'Circular reference to the models parent.',
                            fr : 'Référence circulaire pour le parent de modèles.'
                        }
                    },
                    { 
                        name:'path', 
                        type:'string',
                        desc : {
                            en : 'Internal path, i.e /main/software/desktop/mac. Not to be confused with view.path.',
                            fr : 'Chemin intérieur, i.e /main/software/desktop/mac. À ne pas confondre avec view.path.'
                        }
                    },
                    { 
                        name:'store', 
                        type:'object',
                        desc : {
                            en : 'Storage dump for views to keep the model object uncluttered.',
                            fr : 'Vidage de la mémoire pour les vues de garder l\'objet modèle épuré.'
                        }
                    },
                    { 
                        name:'view', 
                        type:'object',
                        'instanceof': function() { return data.objects.view },
                        desc : {
                            en : 'References the view.',
                            fr : 'Références de la vue.'
                        }
                    },

                ]
            },
    
            view : {
                name:'View',
                desc: {
                    en : 'Represents what the user sees as a collection of elements and functionality to handle them.',
                    fr: 'Représente ce que l\'utilisateur voit comme une collection d\'éléments et de fonctionnalité pour les traiter.'
                },
                attributes : [
                    {
                        name:'addSequence',
                        type:'function',
                        desc: {
                            en : 'Executes a pool of promises asychronously and reduces the returned values using the pool order. For an example see file route.main.js.',
                            fr : 'Exécute une piscine de promesses de manière asynchrone et réduit les valeurs retournées à l\'aide de l\'ordre de la piscine. Pour un exemple, voir route.main.js de fichiers.'
                        },
                        attributes : [
                            {
                                type:'object',
                                required : true,
                                attributes : [
                                    {
                                        name:'promises',
                                        type:'array',
                                        required:true,
                                        desc : {
                                            en : 'The array of promises to execute.',
                                            fr : 'Le tableau de promesses à exécuter.'
                                        }
                                    },
                                    {
                                        name:'container',
                                        type:'element',
                                        desc : {
                                            en : 'The container for which to append the returned values into.',
                                            fr : 'Le conteneur pour lequel ajouter les valeurs renvoyées en.'
                                        }
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        name:'createAppend',
                        type:'function',
                        desc: {
                            en : 'Create and append DOM elements into the view, with optional locale support.',
                            fr : 'Créer et ajouter des éléments DOM dans la vue, avec le support des locales en option.'
                        },
                        attributes : [
                            {
                                type:'string',
                                required:true,
                                attributes : [{
                                    desc: {
                                        en : 'The type of DOM element to create. Where type is required this can be supplied in brackets, i.e input[submit].',
                                        fr : 'Le type d\'élément DOM pour créer. Lorsque ce type est requis peut être fourni entre parenthèses, c\'est à dire input[submit].'
                                    }
                                }]
                            },
                            {
                                type:'element',
                                attributes : [{
                                    desc: {
                                        en : 'If supplied the new DOM element will be appended into this element.',
                                        fr : 'Si fourni le nouvel élément DOM sera ajouté dans cet élément.'
                                    }
                                }]
                            },
                            {
                                type:'*',
                                attributes : [{
                                    desc : {
                                        en : 'The content for the new element. Supply a language object for automatic locale switching, a string or another DOM element.',
                                        fr : 'Le contenu du nouvel élément. Fournir un objet langage pour la commutation locale automatique, une chaîne ou un autre élément DOM.'
                                    }
                                }]
                            },
                            {
                                type:'string',
                                attributes : [{
                                    desc : {
                                        en : 'A value to use for the class.',
                                        fr : 'Une valeur à utiliser pour la classe.'
                                    }
                                }]
                            }
                        ]
                    },
                    { 
                        name:'autoShow', 
                        type:'boolean', 
                        desc : {
                            en : 'Determines if a view will be automatically shown if requested via user navigation. Default is true.',
                            fr : 'Détermine si une vue sera automatiquement affiché si demandé par la navigation de l\'utilisateur. Par défaut est true.'
                        }
                    },
                    { 
                        name:'cssElement', 
                        type:'element',
                        desc : {
                            en : 'Inline CSS provided by an API. Automatically appended.',
                            fr : 'CSS en ligne est fournie par une API. Automatiquement ajouté.'
                        }
                    },
                    { 
                        name:'container',
                        type:'element', 
                        desc : {
                            en : 'The root display element.',
                            fr : 'L\'élément d\'affichage de la racine.'
                        }
                    },
                    { 
                        name:'defaultHideChildren', 
                        type:'boolean', 
                        desc : {
                            en : 'If a view is cached and it\'s children are displayed they will be automatically hidden when the view is reshown. Set to false to disable.',
                            fr : 'Si une vue est mis en cache et les enfants sont affichés, ils seront automatiquement masquées lorsque la vue est à nouveau affichée. Mettre à false pour désactiver.'
                        }
                    },
                    { 
                        name:'defaultHideParentViewWrapper', 
                        type:'boolean', 
                        desc : {
                            en : 'Usually a child view will hide the wrapper content of it\'s parent. Set to false to disable.',
                            fr : 'Habituellement, une vue de l\'enfant va se cacher le contenu de wrapper de son parent. Mettre à false pour désactiver.'
                        }
                    },
                    { 
                        name:'displayCount', 
                        type:'number',
                        desc : {
                            en : 'Useful for preventing animation repeat or differentiated content. Appended to the container element for use with CSS selectors.',
                            fr : 'Utile pour prévenir la répétition de l\'animation ou de différencier le contenu. Annexée à l\'élément conteneur pour une utilisation avec les sélecteurs CSS.'
                        }
                    },
                    { 
                        name:'instances', 
                        type:'object',
                        'instanceof': function() { return data.objects.instances },
                        desc : {
                            en : 'A circular reference to the views model.',
                            fr : 'Une référence circulaire pour le modèle de vue.'
                        }
                    },
                    { 
                        name:'isVisible', 
                        type:'boolean',
                        desc : {
                            en : 'Use to abort ajax callback code and polling operations.',
                            fr : 'Utilisez pour annuler ajax Code de rappel et les opérations de vote.'
                        }
                    },
                    { 
                        name:'model', 
                        type:'object',
                        'instanceof': function() { return data.objects.model },
                        desc : {
                            en : 'A circular reference to the views model.',
                            fr : 'Une référence circulaire pour le modèle de vue.'
                        }
                    },
                    { 
                        name:'path', 
                        type:'string', 
                        desc : {
                            en : 'May be shown to the user (non localised). Used for history.pushstate. Not to be confused with model.path.',
                            fr : 'Peut être montré à l\'utilisateur (non localisée). Utilisé pour history.pushstate. À ne pas confondre avec model.path.'
                        }
                    },
                    { 
                        name:'scrollPosition', 
                        type:'number/boolean', 
                        desc : {
                            en : 'When a model attains current scope on the root controller its view will have the window scroll position saved here. If the user navigates away and returns later they\'ll be placed at the same position they left off. Set to false to disable.',
                            fr : 'Quand un modèle atteint champ d\'application actuel sur le contrôleur de racine son point de vue sera la position de défilement de la fenêtre enregistrée ici. Si l\'utilisateur quitte et retourne plus tard, ils vont être placés à la même position qu\'ils avaient laissé. Mettre à false pour désactiver.'
                        }
                    },
                    { 
                        name:'wrapper', 
                        type:'element', 
                        desc : {
                            en : 'A view has a wrapper. Normally the views elements go into this. When using an element to be displayed along with children views you may append the element into the container instead.',
                            fr : 'Une vue a une enveloppe. Normalement, les éléments de vues vont dans ce. Lors de l\'utilisation d\'un élément à afficher avec les enfants considère que vous pouvez ajouter l\'élément dans le conteneur à la place.'
                        }
                    }
                ]
            },

            instances : { 
                name:'Instances',
                desc : {
                    en : 'Creates a new object from instance.* and stores it on the view. Lazy loads the module if unloaded. Allows for automatic object destruction. Use this instead of instantiating an instance.* module.',
                    fr : 'Crée un nouvel objet de instance.* et les stocke sur le point de vue. Lazy charge le module si déchargé. Permet de destruction automatique d\'objets. Utiliser à la place de l\'instanciation d\'un instance.* module.'
                },
                attributes: [
                    { 
                        name:'add', 
                        type:'function',
                        desc : {
                            en : 'Adds an instance, optionally inserting it into the view.',
                            fr : 'Ajoute une instance, éventuellement de l\'insérer dans la vue.'
                        },
                        attributes: [
                            { 
                                type:'string/object', 
                                required:true,
                                desc: {
                                    en : 'If string will prepend \'instance.\' onto the value and if unloaded then load from the default repo.',
                                    fr : 'Si la chaîne sera précéder \'instance.\' sur la valeur et si déchargé chargera de la pension par défaut.'
                                },
                                attributes : [
                                    {
                                        name : 'fullname',
                                        type: 'string',
                                        desc : {
                                            en : 'The full name of the module to be loaded and instantiated.',
                                            fr : 'Le nom complet du module à charger et instancié.'
                                        }
                                    },
                                    {
                                        name : 'repo',
                                        type: 'string',
                                        desc : {
                                            en : 'The repo location to load the module from should it be unloaded.',
                                            fr : 'L\'emplacement des prises en pension de charger le module de devrait pas être déchargé.'
                                        }
                                    }
                                ]
                            },
                            { 
                                type:'object', 
                                required:true,
                                desc: {
                                    en : 'Additional options.',
                                    fr : 'Des options supplémentaires.'
                                },
                                attributes : [
                                    {
                                        name : 'insertBefore',
                                        type: 'element',
                                        desc : {
                                            en : 'If the instance can be embedded then insert into the DOM after the specified element.',
                                            fr : 'Si l\'instance peut être intégré ensuite l\'insérer dans le DOM après l\'élément spécifié.'
                                        }
                                    },
                                    {
                                        name : 'insertAfter',
                                        type: 'element',
                                        desc : {
                                            en : 'If the instance can be embedded then insert into the DOM after the specified element.',
                                            fr : 'Si l\'instance peut être intégré ensuite l\'insérer dans le DOM après l\'élément spécifié.'
                                        }
                                    }
                                ]
                            },

                        ],
                        returns: {
                            attributes:[
                                {
                                    instanceof: {
                                        name:'Promise',
                                        desc: {
                                            en : 'On success returns the requested instance.',
                                            fr : 'En cas de succès renvoie l\'instance demandée.'
                                        }
                                    }
                                }
                            ]
                        },


                    },
                    { 
                        name:'remove', 
                        type:'function',
                        desc : {
                            en : 'Remove an instance, destructing and dereferencing it.',
                            fr : 'Supprimer une instance, autodestruction et de-son référencement.'
                        },
                        attributes: [
                            { 
                                'instanceof': function() { return data.objects.instances }
                            }
                        ]
                    }
                ]
            },

            meta : { 
                name:'Meta',
                desc : {
                    en : 'Like .store but fires a setMeta event.',
                    fr : 'Comme .store mais déclenche un setMeta événement.'
                },
                attributes: [
                    { 
                        name:'get', 
                        type:'function',
                        desc : {
                            en : 'Returns a value from the store.',
                            fr : 'Retourne la valeur.'
                        },
                        attributes: [
                            { 
                                type:'*', 
                                required:true,
                            }
                        ]
                    },
                    { 
                        name:'set', 
                        type:'function',
                        desc : {
                            en : 'Sets the value.',
                            fr : 'Définit la valeur'
                        },
                        attributes: [
                            { 
                                type:'*', 
                                required:true,
                            }
                        ]
                    }
                ]
            },

            children : { 
                name : 'Children',
                desc : {
                    en : 'Manages child models.',
                    fr : 'Gère les modèles enfant.'
                },
                attributes: [
                    { 
                        name:'loaded', 
                        type:'array',
                        desc : {
                            en : 'Currently loaded children.',
                            fr : 'Enfants actuellement chargés.'
                        }
                    },
                    { 
                        name:'add', 
                        type:'function',
                        attributes: [
                            { 
                                type:'object', 
                                required:true,
                                attributes:[
                                    {
                                        name:'list',
                                        type:'array',
                                        required:true,
                                        desc: {
                                            en : 'Names of the children to load. These normally match parent resources, although the source provider may use a different approach.',
                                            fr : 'Les noms des enfants à charge. Ceux-ci correspondent normalement ressources pour les parents, même si le fournisseur de source peut utiliser une approche différente.'
                                        }
                                    },
                                    {
                                        name:'before',
                                        'instanceof': function() { return data.objects.model },
                                        desc: {
                                            en : 'Views for loaded models will append into the parent container unless you supply an existing model to insert before.',
                                            fr : 'Vues de modèles chargés seront ajouter dans le conteneur parent, sauf si vous fournissez un modèle existant à insérer avant.'
                                        }
                                    }
                                ]

                            }
                        ],
                        returns: {
                            attributes:[
                                {
                                    instanceof: {
                                        name:'Promise',
                                        desc: {
                                            en : 'On success returns the loaded model.',
                                            fr : 'En cas de succès renvoie le modèle chargé.'
                                        }
                                    }
                                }
                            ]
                        },
                        desc : {
                            en : 'Attempts to load a child. If the model has already been loaded it will check for an attribute on it named .cacheLevel. A value of 1 indicates data should be re-fetched, 2 indicates no re-fetch. On failure fires a model.load.error event and returns the error.',
                            fr : 'Tente de charger un enfant. Si le modèle a déjà été chargé il va vérifier pour un attribut dessus nommé .cacheLevel. Une valeur de 1 indique que les données doivent être re-tiré par les cheveux, 2 indique pas de re-chercher. En cas d\'échec déclenche un événement de model.load.error et renvoie l\'erreur.'
                        }
                    },
                    {
                        name:'getByName',
                        type:'function',
                        desc : {
                            en : 'Returns a model matching a name.',
                            fr : 'Renvoie un modèle correspondant à un nom.'
                        },
                        attributes : [
                            {
                                type:'string',
                                required:true,
                                attributes: [
                                    {
                                        desc : {
                                            en : 'Name (derived from the path) of the model to return.',
                                            fr : 'Nom (dérivé de la trajectoire) du modèle de revenir.'
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name:'remove',
                        type:'function',
                        desc : {
                            en : 'Removes a model, it\'s view and children models. Events are deregistered, connections aborted and instances destroyed. Fires a model.removed event.',
                            fr : 'Supprime un modèle, il est vue et modèles pour enfants. Les événements sont radiées, les connexions interrompues et instances détruits. Déclenche un événement model.removed.'
                        },
                        attributes : [
                            {
                                'instanceof': function() { return data.objects.model },
                                required:true,
                            }
                        ]
                    },
                    {
                        name:'hide',
                        type:'function',
                        desc: {
                            en : 'Hides this models children',
                            fr : 'Masquer cette modèles enfants.'
                        }

                    }
                ]
            }

        }

        data.attributes = [
            { 
                name:'root',
                type:'object',
                'instanceof': function() { return data.objects.model; }, 
                desc: {
                    en : 'Set at runtime (path:/). The view\'s container is document.body.',
                    fr : 'Situé à l\'exécution (chemin :/). Le conteneur de la vue est document.body.' 
                }
            },
            {
                name:'current', 
                type:'object',
                'instanceof': function() { return data.objects.model; },
                desc: {
                    en : 'Last loaded model reference for .to().' ,
                    fr : 'Référence de modèle à charger pour .to().'
                }
            },
            { 
                name:'to',
                type:'function',
                attributes: [
                    { 
                        type:'object', 
                        required:true, 
                        attributes: [
                            { 
                                name:'historypush', 
                                type:'boolean',
                                desc: {
                                    en : 'Set to false to disable pushing the location into window.history.',
                                    fr : 'Mettre à false pour désactiver poussant l\'emplacement dans window.history.'
                                }
                            },
                            { 
                                name:'path', 
                                type:'string', 
                                required:true, 
                                desc: {
                                    en : 'Internal path for the resource.',
                                    fr : 'Voie interne pour la ressource.'
                                }
                            },
                            { 
                                name:'statusnextto', 
                                type:'element',
                                desc: {
                                    en : 'An element to contain the loading status.',
                                    fr : 'Un élément pour contenir l\'état de chargement.'
                                }
                            }
                        ]
                    }
                ],
                returns : {
                    attributes: [
                        {
                            instanceof: {
                                name:'Promise',
                                desc: {
                                    en : 'On success returns the loaded model to the callback.',
                                    fr : 'On success returns the loaded model to the callback.'
                                }
                            }
                        }
                    ]
                },
                desc: {
                    en : 'Loads multiple resources beginning at root and enumerating through each directory. This function\'s role is to provide user actioned navigation.',
                    fr : 'Charges de multiples ressources à partir de la racine et énumérant dans chaque répertoire. Le rôle de cette fonction est de fournir une navigation actionnées utilisateur.'
                }
            },
            { 
                name:'source', 
                type:'object',
                desc: {
                    en : 'The foreign location is determined by querying predefined sources. A source provides a fetch function.',
                    fr : 'L\'emplacement étrangère est déterminé en interrogeant les sources prédéfinies. Une source fournit une fonction d\'extraction.'
                },
                attributes: [
                    {
                        name:'append',
                        type:'function',
                        desc: {
                            en : 'Append a source.',
                            fr : 'Ajouter une source.'
                        },
                        attributes: [
                            {
                                type:'object', 
                                required:true, 
                                desc: {
                                    en : 'Contains the source configuration.',
                                    fr : 'Contient la configuration de la source.'
                                }, 
                                attributes: [
                                    { 
                                        name:'fetch', 
                                        type:'Function', 
                                        required:true, 
                                        desc: {
                                            en : 'Fetches either a route file or the data and view from an API.',
                                            fr : 'Récupère soit un fichier de route les données et la vue de l\'API.'
                                        }
                                    },
                                    {
                                        name:'handles', 
                                        type:'function',
                                        required:true, 
                                        desc: {
                                            en : 'If a handler for the requested resource it should return true.',
                                            fr : 'Si un gestionnaire pour la ressource demandée, il doit retourner true.'
                                        },
                                        attributes : [{
                                            type:'string',
                                            desc: {
                                                en : 'The path of the requested resource.',
                                                fr : 'Le chemin de la ressource demandée.'
                                            }
                                        }]
                                    },
                                ]
                            }
                        ]
                    },
                    {
                        name:'pool',
                        type:'array',
                        desc : {
                            en : 'An array containing resource sources. Note: the source discoverer traverses backwards.',
                            fr : 'Un tableau contenant des sources de ressources. Remarque: le découvreur de la source traverse arrière.'
                        }
                    }
                ]
            }
        ];

        model.parent.stash.childsupport(data,model);

    };

};
