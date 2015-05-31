module.exports = function(app) {

    return function(model) {

        var data = {

            demo : "model.managers.object.create('rte', { container:c })",
            desc : {
                en : 'Provides data input via a rich text formatted display and html conversion.',
                fr : 'Fournit entrée de données par l\'intermédiaire d\'un texte formaté riche affichage et la conversion de html.'
            },
            usage : {
                instantiate : true,
                attributes : [
                    {
                        name:'html',
                        type:'string',
                        desc : {
                            en : 'The initial value to insert into the container.',
                            fr : 'La valeur initiale pour insérer dans le conteneur.'
                        }
                    },
                    {
                        name:'container',
                        type:'element',
                        desc : {
                            en : 'The container to append the RTE view into.',
                            fr : 'Le conteneur pour ajouter la vue RTE en.'
                        }
                    },
                    {
                        name:'onChange',
                        type:'function',
                        desc : {
                            en : 'A callback function, triggered upon data change. Returns the current data.',
                            fr : 'Une fonction de rappel, déclenché en cas de changement de données. Retourne les données actuelles.'
                        }
                    }
                ]
            },
            attributes : [
                {
                    name:'addPanel',
                    type:'function',
                    desc: {
                        en : 'This function appends a new panel (plugin) into the RTE view allowing to expand on the basic functionality.',
                        fr : 'Cette fonction ajoute un nouveau panneau (plugin) dans la vue RTE permettant de développer les fonctionnalités de base.'
                    },
                    attributes : [
                        {
                            type:'object',
                            required:true,
                            attributes : [
                                {
                                    desc: {
                                        en : 'A language object literal for the tab.',
                                        fr : 'Un littéral d\'objet pour l\'onglet de la langue.'
                                    }
                                }
                            ]
                        },
                        {
                            type:'element',
                            required:true,
                            attributes : [
                                {
                                    desc: {
                                        en : 'A div to be displayed when the tab is activated.',
                                        fr : 'Un div à afficher lorsque l\'onglet est activé.'
                                    }
                                }
                            ]
                        },
                        {
                            type:'boolean',
                            attributes : [
                                {
                                    desc: {
                                        en : 'Defines if the panel should be set as current.',
                                        fr : 'Définit si le panneau doit être défini comme courant.'
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    name:'execCommand',
                    type:'function',
                    desc: {
                        en : 'This directly executes a command on the WYSIWYG container.',
                        fr : 'Ce exécute directement une commande sur le récipient WYSIWYG.'
                    },
                    attributes : [
                        {
                            type:'string',
                            attributes : [
                                {
                                    desc : {
                                        en : 'The command to pass to the RTE.',
                                        fr : 'La commande à passer à la RTE.'
                                    }
                                }
                            ]
                        },
                        {
                            type:'*',
                            attributes : [
                                {
                                    desc : {
                                        en : 'The attribute to pass with the RTE command.',
                                        fr : 'L\'attribut de passer la commande RTE.'
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    name:'getHTML',
                    type:'function',
                    desc: {
                        en : 'This function returns the current HTML, trimmed of any white space.',
                        fr : 'Cette fonction retourne le code HTML courant, garni d\'un espace blanc.'
                    }
                },
                {
                    name:'insertHTML',
                    type:'function',
                    desc: {
                        en : 'This function inserts HTML into the current position.',
                        fr : 'Cette fonction insère du code HTML dans la position actuelle.'
                    },
                    attributes : [
                        {
                            type:'string'
                        }
                    ]
                },
                {
                    name:'raw',
                    type:'element[textarea]',
                    desc : {
                        en : 'The raw code.',
                        fr : 'Le code brut.'
                    }
                },
                {
                    name:'rte',
                    type:'element[div]',
                    desc : {
                        en : 'The element (contentEditable) containing the WYSIWYG.',
                        fr : 'L\'élément (contentEditable) contenant le WYSIWYG.'
                    }
                },
            ],
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            extlinks : [
                'https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla',
                'https://developer.mozilla.org/en-US/docs/Web/API/document.queryCommandSupported',
                'https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_Editable'
            ]
        };

        model.parent.stash.childsupport(data,model);
    };
};
