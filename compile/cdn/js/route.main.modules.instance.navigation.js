module.exports = function(app) {

    return function(model) {

        var data = {

            demo : " \n \
model.addInstance('navigation', {\n \
    container:c, \n \
    type:'tabs',\n \
    pool: [\n \
        {\n \
            title : {\n \
                en : '1'\n \
            }\n \
        },\n \
        {\n \
            title : {\n \
                en : '2'\n \
            }\n \
        }\n \
    ].map(function (o) {\n \
        return {\n \
            title:o.title,\n \
            onClick: function() {\n \
                this.setStatus('active');\n \
            },\n \
        };\n \
    })\n \
});",
            desc : {
                en : 'Provides a universal navigation menu system using standard UL and LI elements with definable CSS styles.',
                fr : 'Fournit un système de menu de navigation universelle utilisant des éléments UL et LI standards avec des styles CSS définissables.'
            },
            author : { 
                name:'Andrew Charnley', 
                link:'http://www.andrewcharnley.com' 
            },
            usage : {
                instantiate : true,
                attributes : [
                    { 
                        name:'container', 
                        type:'element',
                        desc : {
                            en : 'Container to append the instance into.',
                            fr : 'Conteneur pour ajouter l\'instance en.'
                        }
                    },
                    {
                        name:'type',
                        type:'string',
                        desc : {
                            en : 'Defines the type of navigation. CSS styling relates to this value.'
                        }
                    },
                    {
                        name:'autosort',
                        type:'boolean',
                        desc: {
                            en : 'Defines if options are ordered by title. Default is to inherit a sub menu value. Default for root is true.'
                        }
                    },
                    {
                        name : 'pool',
                        type : 'Array',
                        desc: {
                            en : 'A presupplied list of options and optional submenu items.'
                        }
                    },
                    {
                        name : 'onClick',
                        type: 'function',
                        desc : {
                            en : 'A function to run when an option is selected.'
                        }
                    }
                ]
            }
        };

        data.objects = {

            menu : {
                name : 'Menu',
                desc : {
                    en : 'A menu contains option objects.'
                },
                attributes : [
                    {
                        name : 'addOptions',
                        type : 'function',
                        desc : {
                            en : 'Shorthand for calling addOption repeatedly.'
                        },
                        attributes : [
                            {
                                type:'Array',
                                desc: {
                                    en : 'A list of Options to iterate through. See addOption.'
                                }
                            }
                        ]
                    },
                    {
                        name : 'addOption',
                        type : 'function',
                        desc : {
                            en : 'Adds an option to the menu.'
                        },
                        attributes : [
                            {
                                type:'object',
                                attributes : [
                                    {
                                        name : 'active',
                                        type : 'boolean',
                                        desc : {
                                            en : 'Sets the status to active.'
                                        }
                                    },
                                    {
                                        name : 'id',
                                        type : 'string',
                                        desc : {
                                            en : 'An identifier for the option. Will be appended to className.'
                                        }
                                    },
                                    {
                                        name : 'insertBefore',
                                        instanceof : function() { return data.objects.option; },
                                        desc : {
                                            en : 'To specify where the option should be inserted, specify another option.'
                                        }
                                    },
                                    {
                                        name : 'href',
                                        type : 'string',
                                        desc : {
                                            en : 'Instead of onClick you can set an href directly. Should be used only or external linking.'
                                        }
                                    },
                                    {
                                        name : 'onClick',
                                        type : 'function',
                                        desc : {
                                            en : 'If specified, will override the menu onClick handler.'
                                        }
                                    },
                                    {
                                        name : 'seo',
                                        type : 'string',
                                        desc : {
                                            en : 'Appends a Google style #!/ onto the end of the ahref along with the href value. Use with onClick and href.'
                                        }
                                    },
                                    {
                                        name : 'status',
                                        type : 'string',
                                        desc : {
                                            en : 'Default is inactive. Alternatively specify active or disabled.'
                                        }
                                    },
                                    {
                                        name : 'title',
                                        type : 'string',
                                        desc : {
                                            en : 'Adds a label to the option\'s DOM element.'
                                        }
                                    }
                                ]
                            }
                        ],
                        returns : {
                            'instanceof' : function() { return data.objects.option; }
                        }
                    },
                    {
                        name : 'removeOption',
                        type : 'function',
                        desc : {
                            en : 'Removes an option from a Menu.'
                        },
                        attributes : [
                            {
                                'instanceof' : function() { return data.objects.option; }
                            }
                        ]
                    },
                    {
                        name : 'removeOptions',
                        type : 'function',
                        desc : {
                            en : 'Removes all options from a Menu.'
                        },
                    },
                    {
                        name : 'sort',
                        type : 'function',
                        desc : {
                            en : 'If autosort is true will sort options by title. This is used internally when a new option is added.'
                        },
                        attributes : [
                            {
                                type:'boolean',
                                attributes : [
                                    {
                                        desc: {
                                            en : 'Optional boolean to set autosort before sort is executed.'
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },

            option : {
                name : 'Option',
                desc : {
                    en : 'An option manages the selection of a DOM element and an optional sub menu object.'
                },
                attributes : [
                    {
                        name : 'addMenu',
                        type : 'function',
                        desc : {
                            en : 'Adds a menu to the Option.'
                        },
                        attributes : [
                            {
                                type:'object',
                                attributes : [
                                    {
                                        name:'autosort',
                                        type:'boolean',
                                        desc: {
                                            en : 'Defines if options are ordered by title. Default is false.'
                                        }
                                    },
                                    {
                                        name : 'pool',
                                        type : 'Array',
                                        desc: {
                                            en : 'A presupplied list of options and optional submenu items.',
                                            fr : ''
                                        }
                                    },
                                    {
                                        name : 'onClick',
                                        type: 'function',
                                        desc : {
                                            en : 'A function to run when an option is selected.'
                                        }
                                    }
                                ]
                            }
                        ],
                        returns : {
                            'instanceof' : function() { return data.objects.menu; }
                        }
                    },
                    {
                        name : 'removeMenu',
                        type : 'function',
                        desc : {
                            en : 'Removes a menu and any options from it.',
                            fr : ''
                        }
                    },
                    {
                        name : 'setStatus',
                        type : 'function',
                        attributes : [
                            {
                                type:'string',
                                desc : {
                                    en : 'Specify active, ianctive or disabled.'
                                }
                            }
                        ]
                    },
                    {
                        name : 'toggle',
                        type : 'function',
                        desc : {
                            en : 'Toggles the status between active and inactive.'
                        }
                    },
                    {
                        name : 'updateTitle',
                        type : 'function',
                        attributes : [
                            {
                                type : 'string',
                                desc : {
                                    en : 'Updates a title, or if null will remove any existing title on an option.',
                                }
                            }
                        ]
                    }
                ]
            }

        };

        data.attributes = [
            { 
                name:'container', 
                type:'element',
                desc : {
                    en : 'Element containing the UI/LI siblings.',
                    fr : ''
                }
            },
            {
                name:'menu',
                type:'object',
                instanceof: function() { return data.objects.menu; }
            },
            { 
                name:'type',
                type:'object',
                desc: {
                    en : 'Defines the display style.',
                    fr : ''
                },
                attributes : [
                    {
                        name : 'set',
                        type : 'function',
                        desc: {
                            en : 'A language object to use for the message.',
                            fr : ''
                        },
                        attributes : [
                            {
                                type:'string',
                                attributes : [
                                    {
                                        desc: {
                                            en : 'A name which matches the css class.'
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];

        model.parent.stash.childsupport(data,model);

    };
};
