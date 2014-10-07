module.exports = function(app) {

    return function(model) {

        var data = {

            demo : " \n \
view.instances.add('table', {\n \
    container:c, \n \
    header: {\n \
        rows : [ \n \
            {\n \
                columns : [\n \
                    {\n \
                        lang : { \n \
                            en : '1'\n \
                        } \n \
                    },\n \
                    {\n \
                        lang : { \n \
                            en : '2'\n \
                        } \n \
                    }\n \
                ] \n \
            },\n \
        ]\n \
    },\n \
    body: {\n \
        rows : [ \n \
            {\n \
                columns : [\n \
                    {\n \
                        lang : { \n \
                            en : 'Lorem ipsum'\n \
                        } \n \
                    },\n \
                    {\n \
                        lang : { \n \
                            en : 'dolor sit amet'\n \
                        } \n \
                    }\n \
                ] \n \
            }\n \
        ]\n \
    }\n \
});",
            desc : {
                en : 'Creates a table with header,body,footer objects.',
            },
            author : { 
                name:'Andrew Charnley', 
                link:'http://www.andrewcharnley.com' 
            },
            attributes : [
                {
                    name : 'body',
                    instanceof : function() { return data.objects.domain; }
                },
                { 
                    name:'container', 
                    type:'element',
                    desc : {
                        en : 'UL element containing the LI siblings.'
                    }
                },
                {
                    name : 'footer',
                    instanceof : function() { return data.objects.domain; }
                },
                {
                    name : 'header',
                    instanceof : function() { return data.objects.domain; }
                }
            ],
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
                        name:'body',
                        type:'Array',
                        desc : {
                            en : 'Creates rows on the fly. See Domain.addRow'
                        }
                    },
                    {
                        name:'footer',
                        type:'Array',
                        desc: {
                            en : 'Creates rows on the fly. See Domain.addRow'
                        }
                    },
                    {
                        name : 'header',
                        type : 'Array',
                        desc: {
                            en : 'Creates rows on the fly. See Domain.addRow',
                        }
                    },
                    {
                        name : 'searchable',
                        type: 'boolean',
                        desc : {
                            en : 'Defines whether the contents of the table are searchable. Default is false.',
                        }
                    }
                ]
            }
        };

        data.objects = {

            column : {
                name : 'Column',
                desc : {
                    en : 'A column object for a row object.',
                },
                attributes : [
                    {
                        name:'element',
                        type:'element',
                        desc : {
                            en : 'A TD DOM element.'
                        }
                    }
                ]
            },

            row : {
                name : 'Row',
                desc : {
                    en : 'A row object for a Domain object.'
                },
                attributes : [
                    {
                        name : 'columns',
                        type : 'Array',
                        desc : {
                            en : 'Column objects belonging to the Row.'
                        }
                    },
                    {
                        name:'element',
                        type:'element',
                        desc : {
                            en : 'A TR DOM element.'
                        }
                    },
                    {
                        name : 'addColumn',
                        type : 'function',
                        desc : {
                            en : 'Adds a Column.'
                        },
                        attributes : [
                            {
                                type:'object',
                                attributes : [
                                    {
                                        name:'append',
                                        type:'element',
                                        desc: {
                                            en : 'Appends DOM elements or an HTMLFragment.'
                                        }
                                    },
                                    {
                                        name : 'lang',
                                        type : 'object',
                                        desc: {
                                            en : 'Appends and manages a language literal.'
                                        }
                                    },
                                    {
                                        name : 'className',
                                        type: 'string',
                                        desc : {
                                            en : 'Sets the className.'
                                        }
                                    }
                                ]
                            }
                        ],
                        returns : {
                            'instanceof' : function() { return data.objects.column; }
                        }
                    }
                ]
            },

            domain : {
                name : 'Domain',
                desc : {
                    en : 'Represents a header, body or footer object, which in turn contains Row objects.'
                },
                attributes : [
                    {
                        name : 'addRow',
                        type: 'function',
                        desc : {
                            en : 'Adds a Row object to the Domain',
                        },
                        attributes : [
                            {
                                type: 'object',
                                attributes : [
                                    {
                                        name : 'insertBefore',
                                        instanceof : function() { return data.objects.row; },
                                        desc : {
                                            en : 'Inserts a row at a position other than the end. An index can be supplied instead of a current Row.'
                                        }
                                    },
                                    {
                                        name : 'searchable',
                                        type: 'boolean',
                                        desc : {
                                            en : 'Defines whether the contents of the row are searchable.'
                                        }
                                    },
                                    {
                                        name : 'className',
                                        type : 'string',
                                        desc : {
                                            en : 'Specifies the className for the row element.'
                                        }
                                    },
                                    {
                                        name : 'columns',
                                        type : 'Array',
                                        desc : {
                                            en : 'Inserts columns. See Row.addColumn.'
                                        }
                                    }
                                ]
                            }
                        ],
                        returns : {
                            instanceof : function() { return data.objects.row; }
                        }
                    },
                    {
                        name:'deleteRow',
                        type:'function',
                        desc : {
                            en : 'Removes a Row object.'
                        },
                        attributes : [
                            {
                                instanceof : function() { return data.objects.row; },        
                            }
                        ]
                    },
                    {
                        name:'element',
                        type:'element',
                        desc : {
                            en : 'A THEAD, TBODY or TFOOT DOM element.'
                        }
                    },
                    {
                        name:'rows',
                        type:'Array',
                        desc : {
                            en : 'Row objects belonging to the Domain.'
                        }
                    }
                ]
            }
        };

        model.parent.store.childsupport(data,model);

    };
};
