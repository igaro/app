//# sourceURL=route.main.modules.instance.table.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {

            demo : " \n \
model.managers.object.create('table', {\n \
    container:c, \n \
    header: {\n \
        rows : [ \n \
            {\n \
                columns : [\n \
                    {\n \
                        content : { \n \
                            en : '1'\n \
                        } \n \
                    },\n \
                    {\n \
                        content : { \n \
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
                        content : { \n \
                            en : 'Lorem ipsum'\n \
                        } \n \
                    },\n \
                    {\n \
                        content : { \n \
                            en : 'dolor sit amet'\n \
                        } \n \
                    }\n \
                ] \n \
            }\n \
        ]\n \
    }\n \
});",
            desc : _tr("Creates a table with header,body,footer objects."),
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            blessed : {
                container:true
            },
            attributes : [
                {
                    name : 'body',
                    instanceof : function() { return data.objects.domain; }
                },
                {
                    name : 'footer',
                    instanceof : function() { return data.objects.domain; }
                },
                {
                    name : 'header',
                    instanceof : function() { return data.objects.domain; }
                },
                {
                    name : 'searchRow',
                    instanceof : function() { return data.objects.row; },
                    desc : _tr("A search row is always added to the body. Use .addColumn() to insert blank column or tbl.addSearchColumn() to insert a search column.")
                }
            ],
            usage : {
                instantiate : true,
                decorateWithContainer:true,
                attributes : [
                    {
                        name : 'addSearchColumn',
                        type : 'function',
                        async: true,
                        desc : _tr("Adds a search column to the built in search row."),
                        attributes : [
                            {
                                type:'object',
                                decorateWithOrder : function() { return data.objects.column; },
                                attributes : [
                                    {
                                        name : 'content',
                                        type : 'object',
                                        desc: _tr("The DOM Element control or similar which takes input and calls .searchExec() to perform the search.")
                                    },
                                    {
                                        name :'searchFn',
                                        type :'function',
                                        desc : _tr("On .searchExec(), this function is passed the column and should return true if a match is found.")
                                    }
                                ]
                            }
                        ],
                        returns : {
                            instanceof : function() { return data.objects.column; }
                        }
                    },
                    {
                        name:'addSearchColumns',
                        type: 'function',
                        async : true,
                        desc : _tr("Calls .addSearchColumn() sequentially."),
                        attributes : [
                            {
                                type: 'object',
                                required:true,
                                attributes : [{
                                    instanceof : { name:'Array' }
                                }]
                            }
                        ],
                        returns : {
                            attributes: [{
                                instanceof : { name:'Array' }
                            }]
                        }
                    },
                    {
                        name:'body',
                        instanceof : { name:'Array' },
                        desc : _tr("Calls .Domain.addRow() sequentially.")
                    },
                    {
                        name:'execSearch',
                        type:'function',
                        desc:_tr("Executes the search mechanism. A column will only be searched if it has a .searchFn() function. See .addSearchColumn()")
                    },
                    {
                        name:'footer',
                        instanceof : { name:'Array' },
                        desc : _tr("Calls .Domain.addRow() sequentially.")
                    },
                    {
                        name : 'header',
                        instanceof : { name:'Array' },
                        desc : _tr("Calls .Domain.addRow() sequentially.")
                    }
                ]
            }
        };

        data.objects = {

            column : {
                name : 'Column',
                blessed : {
                    container:true
                }
            },

            row : {
                name : 'Row',
                blessed : {
                    container:true,
                    children:['columns']
                },
                desc : _tr("A row object for a Domain object."),
                attributes : [
                    {
                        name : 'addColumn',
                        type : 'function',
                        async: true,
                        desc : _tr("Adds a Column to a Row."),
                        attributes : [
                            {
                                type:'object',
                                decorateWithOrder : function() { return data.objects.column; },
                                attributes : [
                                    {
                                        name : 'content',
                                        type : 'object',
                                        desc: _tr("Appends a language literal, DOM element or text.")
                                    }
                                ]
                            }
                        ],
                        returns : {
                            instanceof : function() { return data.objects.column; }
                        }
                    },
                    {
                        name:'addColumns',
                        type: 'function',
                        async : true,
                        desc : _tr("Calls .addColumn() sequentially."),
                        attributes : [
                            {
                                type: 'object',
                                required:true,
                                attributes : [{
                                    instanceof : { name:'Array' }
                                }]
                            }
                        ],
                        returns : {
                            attributes: [{
                                instanceof : { name:'Array' }
                            }]
                        }
                    }
                ]
            },

            domain : {
                name : 'Domain',
                desc : _tr("Represents a header, body or footer object, which in turn contains Row objects."),
                blessed : {
                    container:true,
                    children:['rows']
                },
                attributes : [
                    {
                        name : 'addRow',
                        type: 'function',
                        async : true,
                        desc : _tr("Adds a Row object to the Domain."),
                        attributes : [
                            {
                                type: 'object',
                                decorateWithOrder : function() { return data.objects.row; },
                                attributes : [
                                    {
                                        name : 'columns',
                                        instanceof : { name:'Array' },
                                        desc : _tr("Inserts columns sequentially. See Row.addColumn().")
                                    }
                                ]
                            }
                        ],
                        returns : {
                            instanceof : function() { return data.objects.row; }
                        }
                    },
                    {
                        name:'addRows',
                        type: 'function',
                        async : true,
                        desc : _tr("Calls .addRow() sequentially."),
                        attributes : [
                            {
                                type: 'object',
                                required:true,
                                attributes : [{
                                    instanceof : { name:'Array' }
                                }]
                            }
                        ],
                        returns : {
                            attributes: [{
                                instanceof : { name:'Array' }
                            }]
                        }

                    }
                ]
            }
        };

        model.parent.stash.childsupport(data,model);

    };
};
