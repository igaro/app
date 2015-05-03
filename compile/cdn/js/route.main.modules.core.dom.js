module.exports = function(app) {

    return function(model) {

        var data = {
            desc : _tr("Provides DOM helpers to reduce repetitive coding. Automates dependency management and provides object destruction cleanup. Does not try to be JQuery."),
            author : { 
                name:'Andrew Charnley', 
                link:'http://www.igaro.com/ppl/ac' 
            },
            usage : {
                class : true
            },
            providesManager:true,
            embedded:true,
            attributes : [
                {
                    name:'head',
                    type:'element',
                    desc:_tr("Shorthand for accessing the body>head element")
                },
                {
                    name:'empty',
                    type:'function',
                    desc:_tr("Empties an element of any child elements or content."),
                    attributes : [
                        {
                            type:'object',
                            required:true,
                            desc: _tr("The element to empty.")
                        }
                    ]
                },
                {
                    name:'purge',
                    type:'function',
                    desc:_tr("Destroys an element, all child elements, and dereferences from dependencies."),
                    attributes : [
                        {
                            type:'object',
                            required:true,
                            desc: _tr("The element to remove.")
                        },
                        {
                            type:'boolean',
                            desc: _tr("If true, the element isn't removed from it's parent. Default is false.")
                        }
                    ]
                },
                {
                    name:'rm',
                    type:'function',
                    desc:_tr("Removes an element from it's parent node."),
                    attributes : [
                        {
                            type:'object',
                            required:true,
                            desc: _tr("The element to remove.")
                        }
                    ]
                },
                {
                    name:"isHidden",
                    type:"function",
                    desc:_tr("Returns whether an element is hidden or visible."),
                    returns: {
                        attributes : [
                            {
                                desc:_tr("True for hidden, False for visible."),
                                instanceof : { name:'Boolean' }
                            }
                        ]
                    }
                },
                {
                    name:"hide",
                    type:"function",
                    desc:_tr("Hides an element."),
                    attributes : [
                        { 
                            type:'object',
                            required:true,
                            desc: _tr("The element to hide.")
                        },
                        {
                            type:'boolean',
                            desc: _tr("Set to false to invert the operation (show the element). Default is true.")
                        }
                    ]
                },
                {
                    name:'mk',
                    type:'function',
                    desc:_tr("A generic error handling mechanism for functions that don't do it themselves. Useful for hyperlink invoked commands. Try to use the manager provided by core.object's bless instead."),
                    attributes : [
                        { 
                            type:'*',
                            required:true,
                            desc: _tr("The error object or value.")
                        },
                        {
                            type:'string',
                            desc: _tr("The scope path name.")
                        },
                        { 
                            type:'string',
                            desc : _tr("The scope event name")
                        }
                    ]
                },
                {
                    name:'setPlaceholder',
                    type:'object',
                    desc : _tr("Manages and stores the log data."),
                    attributes : [
                        { 
                            name:'append',
                            type:'function',
                            attributes: [
                                { 
                                    type:'string',
                                    required:true, 
                                    attributes:[{
                                        desc: _tr("The module name.")
                                    }]
                                },
                                { 
                                    type:'string',
                                    required:true, 
                                    attributes:[{
                                        desc: _tr("The event name.")
                                    }]
                                },
                                { 
                                    type:'object', 
                                    required:true, 
                                    attributes:[{
                                        desc: _tr("A value to pass to functions registered to receive the debug event. You can pass anything here."),
                                    }]
                                }
                            ],
                            desc: _tr("Appends a debug event to storage and fires a core.debug event containing the data.")
                        },
                        { 
                            name:'data',
                            instanceof:'Array', 
                            desc : _tr("Contains debug data appended since program execution."),
                        },
                    ]
                },
                {
                    name:'append',
                    type:'function',
                    desc:_tr("Appends an element into another optionally pre/appending before a sibling."),
                    attributes : [
                        { 
                            type:'object',
                            required:true,
                            desc: _tr("The container for the element to be appended into.")
                        },
                        {
                            type:'object',
                            required:true,
                            desc: _tr("An element or array of elements to append.")
                        },
                        { 
                            type:'object',
                            desc : _tr("Optional parameters to insert before or after a sibling."),
                            attributes:[
                                {
                                    name:"insertAfter",
                                    type:"object",
                                    desc:_tr("Specify a sibling element to insert after. Can also be a blessed object with a container element.")
                                },
                                {
                                    name:"insertBefore",
                                    type:"object",
                                    desc:_tr("Specify a sibling element to insert before. Can also be a blessed object with a container element.")
                                }
                            ]
                        }
                    ]
                },
                {
                    name:'setContent',
                    type:'function',
                    desc:_tr("Sets the content of an element, correctly handing dependencies in the process."),
                    attributes : [
                        { 
                            type:'object',
                            required:true,
                            desc: _tr("The element of which to set the content.")
                        },
                        {
                            type:'object',
                            required:true,
                            desc: _tr("Element, elements (in Array), string or language literal to use for the content")
                        },
                        { 
                            type:'boolean',
                            desc : _tr("By default the element will be purged of content prior to new content being written. If this value is true, the element will be cleared (shallow).")
                        }
                    ]
                },
                {
                    name:'show',
                    type:'function',
                    desc:_tr("Shows an element."),
                    attributes : [
                        { 
                            type:'object',
                            required:true,
                            desc: _tr("Shows an element. Element must have been previously hidden with .hide(). Overriding styles and className strings are unsupported.")
                        }
                    ]
                }
            ]
        };

        model.parent.stash.childsupport(data,model);

    };
};
