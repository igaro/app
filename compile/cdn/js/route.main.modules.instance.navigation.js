//# sourceURL=route.main.modules.instance.navigation.js

module.exports = function() {

    'use strict';

    return function(model) {

        var data = {

            demo : "model.managers.object.create('navigation', {\n\
    container:c,\n\
    onClick: function() {\n\
        alert('Option Clicked');\n\
        return Promise.resolve();\n\
    },\n\
    options: [\n\
        {\n\
            active : true,\n\
            title : {\n\
                en : '1'\n\
            }\n\
        },\n\
        {\n\
            title : {\n\
                en : '2'\n\
            }\n\
        },\n\
        {\n\
            disabled : true,\n\
            title : {\n\
                en : '3'\n\
            }\n\
        }\n\
    ]\n\
});",
            desc : _tr("Provides a universal navigation menu system using standard UL and LI elements."),
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            blessed : {
                container:true
            },
            usage : {
                instantiate : true,
                decorateWithContainer : true,
                attributes : [
                    {
                        name : 'onClick',
                        type: 'function',
                        desc : _tr("A function to run when an Option is selected.")
                    },
                    {
                        name : 'options',
                        instanceof : { name: 'Array' },
                        desc: _tr("Calls .addOption() sequentially.")
                    }
                ]
            }
        };

        data.objects = {

            menu : {
                name : 'Menu',
                desc : _tr("A menu contains option objects."),
                blessed : {
                    container:true,
                    children : ['options']
                },
                attributes : [
                    {
                        name : 'addOptions',
                        type : 'function',
                        desc : _tr("Calls .addOption() sequentially."),
                        attributes : [
                            {
                                type:'object',
                                attributes : [{
                                    instanceof : { name: 'Array' }
                                }]
                            }
                        ],
                        returns : {
                            attributes : [{
                                instanceof : { name: 'Array' }
                            }]
                        }
                    },
                    {
                        name : 'addOption',
                        type : 'function',
                        desc : _tr("Adds an option to the menu."),
                        attributes : [
                            {
                                type:'object',
                                decorateWithOrder:function() { return data.objects.option; },
                                attributes : [
                                    {
                                        name : 'active',
                                        type : 'boolean',
                                        desc : _tr("Sets the status to active.")
                                    },
                                    {
                                        name : 'href',
                                        type : 'string',
                                        desc : _tr("Sets the Element href, which may be used for display/seo purposes or actual navigation by setting onClick to open it.")
                                    },
                                    {
                                        name : 'onClick',
                                        type : 'function',
                                        desc : _tr("If specified, will override the parent onClick handler.")
                                    },
                                    {
                                        name : 'title',
                                        type : 'string',
                                        desc : _tr("Adds a label to the option's DOM element.")
                                    }
                                ]
                            }
                        ],
                        returns : {
                            'instanceof' : function() { return data.objects.option; }
                        }
                    }
                ]
            },

            option : {
                name : 'Option',
                blessed : {
                    container:true
                },
                desc : _tr("An option manages the selection of a DOM element and an optional sub menu object."),
                attributes : [
                    {
                        name : 'addMenu',
                        type : 'function',
                        desc : _tr("Adds a menu to the Option."),
                        attributes : [
                            {
                                type:'object',
                                attributes : [
                                    {
                                        name : 'options',
                                        instanceof  : { name: 'Array' },
                                        desc: _tr("A presupplied list of options and optional submenu items.")
                                    },
                                    {
                                        name : 'onClick',
                                        type: 'function',
                                        desc : _tr("A function to run when an option is selected.")
                                    }
                                ]
                            }
                        ],
                        returns : {
                            'instanceof' : function() { return data.objects.menu; }
                        }
                    },
                    {
                        name : 'setActive',
                        async : true,
                        type : 'function',
                        attributes : [
                            {
                                type:'boolean',
                                desc : _tr("If the Option is disabled this will have no effect.")
                            }
                        ]
                    }
                ]
            }

        };

        data.attributes = [
            {
                name:'menu',
                type:'object',
                instanceof: function() { return data.objects.menu; }
            }
        ];

        model.parent.stash.childsupport(data,model);

    };
};
