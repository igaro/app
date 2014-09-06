module.requires = [
    { name: 'route.main.modules.instance.samespace.css' },
];

module.exports = function(app) {

    return function(model) {

        var data = {

            demo : "view.instances.add('samespace', { \n \
    container:c, \n \
    elements:[null,null,null], \n \
    effect:'fade', \n \
    transparent:true \n \
});",
            desc : {
                en : 'Provides a means for multiple elements to occupy the same space on a page with navigation and CSS3 transition effects.',
                fr : 'Fournit un moyen de multiples éléments à occuper le même espace sur une page avec navigation et CSS3 effets de transition.'
            },
            usage : {
                instantiate : true,
                attributes : [
                    {
                        name:'autostart',
                        type:'boolean',
                        desc : {
                            en : 'Set to true to begin a slideshow of the elements.',
                            fr : 'Mettre à true pour commencer un diaporama des éléments.'
                        }
                    },
                    { 
                        name:'container',
                        type:'element',
                        desc : {
                            en : 'The container to append the instance into.',
                            fr : 'Le conteneur pour ajouter l\'instance en.'
                        }
                    },
                    { 
                        name:'delay',
                        type:'number',
                        desc : {
                            en : 'In slideshow mode this is the delay between transitions, measured in milliseconds.',
                            fr : 'En mode diaporama c\'est le délai entre les transitions, mesuré en millisecondes.'
                        }
                    },
                    {
                        name:'elements',
                        type:'array',
                        desc : {
                            en : 'A list of HTML elements (typically div\'s but you can supply any type). The element will be added to a div, thus supplying null still gives you the option to style the container. This is how the demo works.',
                            fr : 'Une liste des éléments HTML (généralement div\'s mais vous pouvez fournir n\'importe quel type). L\'élément sera ajouté à une div, fournissant ainsi null vous donne toujours la possibilité de coiffer le récipient. C\'est ainsi que la démo fonctionne.'
                        }
                    },
                    { 
                        name:'effect', 
                        type:'string',
                        desc : {
                            en : 'The name of the CSS effect to apply (see relevant scss file).',
                            fr : 'Le nom de l\'effet de CSS à appliquer (voir fichier scss pertinente).'
                        }
                    },
                    {
                        name:'navOff',
                        type:'boolean',
                        desc : {
                            en : 'Set to true to disable the internal navigation controls.',
                            fr : 'Mettre à true pour désactiver les contrôles de navigation internes.'
                        }
                    },
                    {
                        name:'loop',
                        type:'boolean',
                        desc : {
                            en : 'Set to true to loop when the navigation cycle reaches the end.',
                            fr : 'Affectez la valeur true à la boucle lorsque le cycle de navigation arrive à la fin.'
                        }
                    },
                    {
                        name:'shuffle',
                        type:'boolean',
                        desc : {
                            en : 'Set to true to initially shuffle the elements into a random order.',
                            fr : 'Affectez la valeur true à mélanger d\'abord les éléments dans un ordre aléatoire.'
                        }
                    },
                    {
                        name:'transparent',
                        type:'boolean',
                        desc : {
                            en : 'By default the container will have its background set to black. Supply true to disable.',
                            fr : 'Par défaut, le conteneur sera mis à fond noir. Fournir true pour désactiver.'
                        }
                    }
                ]
            },
            attributes : [
                { 
                    name:'addSpace',
                    type:'function',
                    desc: {
                        en : 'Appends an item to the end of the list.',
                        fr : 'Ajoute un élément à la fin de la liste.'
                    },
                    attributes : [
                        {
                            type:'element',
                            attributes : [
                                {
                                    desc : {
                                        en : 'Element to append.',
                                        fr : 'Élément à ajouter.'
                                    }
                                }
                            ]
                        }
                    ]
                },
                { 
                    name:'setEffect',
                    type:'function',
                    desc: {
                        en : 'Applies a transition effect between element rotation.',
                        fr : 'Applique un effet de transition entre l\'élément de rotation.'
                    },
                    attributes : [
                        {
                            type:'string',
                            required:true,
                            attributes : [
                                {
                                    desc: {
                                        en : 'The name of the effect must match that in the relevant css file.',
                                        fr : 'Le nom de l\'effet doit correspondre à celle dans le fichier css pertinente.'
                                    }
                                }
                            ]
                        }
                    ]
                },
                { 
                    name:'stop', 
                    type:'function',
                    desc: {
                        en : 'Stops the automated transitioning between elements.',
                        fr : 'Arrête la transition automatique entre les éléments.'
                    }
                },
                { 
                    name:'to',
                    type:'function',
                    desc: {
                        en : 'Navigates to a particular element.',
                        fr : 'Navigue à un élément particulier.'
                    },
                    attributes : [
                        {
                            type:'element',
                            required: true,
                        }
                    ]
                },
                { 
                    name:'toggleNavigation', 
                    type:'function',
                    desc : {
                        en : 'Display the navigation controls.',
                        fr : 'Afficher les commandes de navigation.'
                    },
                    attributes : [
                        {
                            type:'boolean'
                        }
                    ]
                }
            ],
            author : { 
                name:'Andrew Charnley', 
                link:'mailto:andrew.charnley@igaro.com' 
            }
        };

        model.parent.store.childsupport(data,model);
    };
};
