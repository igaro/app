//# sourceURL=route.main.modules.core.dom.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {
            desc : function() { return this.tr((({ key:"Provides DOM helpers to reduce repetitive coding. Automates dependency management and provides object destruction cleanup. Does not try to be JQuery." }))); },
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            usage : {
                class : true
            },
            manager:'dom',
            embedded:true,
            attributes : [
                {
                    name:'append',
                    type:'function',
                    desc:function() { return this.tr((({ key:"Appends an element into another optionally pre/appending before a sibling." }))); },
                    attributes : [
                        {
                            type:'object',
                            required:true,
                            attributes : [{
                                desc: function() { return this.tr((({ key:"The container for the element to be appended into." }))); }
                            }]
                        },
                        {
                            type:'object',
                            required:true,
                            attributes : [{
                                desc: function() { return this.tr((({ key:"An element or array of elements to append." }))); }
                            }]
                        },
                        {
                            type:'object',
                            desc : function() { return this.tr((({ key:"Optional parameters to insert before or after a sibling." }))); },
                            attributes:[
                                {
                                    name:"insertAfter",
                                    type:"object",
                                    desc:function() { return this.tr((({ key:"Specify a sibling element to insert after. Can also be a blessed object with a container element." }))); }
                                },
                                {
                                    name:"insertBefore",
                                    type:"object",
                                    desc:function() { return this.tr((({ key:"Specify a sibling element to insert before. Can also be a blessed object with a container element." }))); }
                                }
                            ]
                        }
                    ]
                },
                {
                    name:'empty',
                    type:'function',
                    desc:function() { return this.tr((({ key:"Empties an element of any child elements or content." }))); },
                    attributes : [
                        {
                            type:'object',
                            required:true,
                            attributes : [
                                {
                                    desc: function() { return this.tr((({ key:"The element to empty." }))); }
                                }
                            ]
                        }
                    ]
                },
                {
                    name:'head',
                    type:'object',
                    desc:function() { return this.tr((({ key:"Shortcut for accessing the body>head element." }))); }
                },
                {
                    name:'offset',
                    type:'function',
                    desc:function() { return this.tr((({ key:"Returns the computed offset position for an element." }))); },
                    attributes : [
                        {
                            type:'object',
                            required:true,
                            attributes : [
                                {
                                    desc: function() { return this.tr((({ key:"The element to check." }))); }
                                }
                            ]
                        }
                    ],
                    returns: {
                        attributes : [
                            {
                                desc:function() { return this.tr((({ key:"Contains x and y keys." }))); },
                                type:'object'
                            }
                        ]
                    }
                },
                {
                    name:'purge',
                    type:'function',
                    desc:function() { return this.tr((({ key:"Destroys an element, all child elements, and dereferences from dependencies." }))); },
                    attributes : [
                        {
                            type:'object',
                            required:true,
                            attributes : [
                                {
                                    desc: function() { return this.tr((({ key:"The element to remove." }))); }
                                }
                            ]
                        },
                        {
                            type:'boolean',
                            attributes : [
                                {
                                    desc: function() { return this.tr((({ key:"If true, the element isn't removed from it's parent. Default is false." }))); }
                                }
                            ]
                        }
                    ]
                },
                {
                    name:"isHidden",
                    type:"function",
                    desc:function() { return this.tr((({ key:"Returns whether an element is hidden or visible." }))); },
                    returns: {
                        attributes : [
                            {
                                desc:function() { return this.tr((({ key:"True for hidden, False for visible." }))); },
                                type:'boolean'
                            }
                        ]
                    }
                },
                {
                    name:"hide",
                    type:"function",
                    desc:function() { return this.tr((({ key:"Hides an element." }))); },
                    attributes : [
                        {
                            type:'object',
                            required:true,
                            attributes : [
                                {
                                    desc: function() { return this.tr((({ key:"The element to hide." }))); }
                                }
                            ]
                        },
                        {
                            type:'boolean',
                            attributes : [
                                {
                                    desc: function() { return this.tr((({ key:"Set to false to invert the operation (show the element). Default is true." }))); }
                                }
                            ]
                        }
                    ]
                },
                {
                    name:'mk',
                    forManager:true,
                    type:'function',
                    returns : {
                        attributes : [
                            {
                                instanceof : { name:'Element' }
                            }
                        ]
                    },
                    desc:function() { return this.tr((({ key:"Creates and appends an element, optionally setting parameters and appending siblings into it." }))); },
                    attributes : [
                        {
                            type:'*',
                            forManager:true,
                            required:true,
                            attributes : [
                                {
                                    desc: function() { return this.tr((({ key:"The tag name of the element to create, i.e 'div'. A type can also be set by use of brackets, i.e 'input[password]'" }))); }
                                }
                            ]
                        },
                        {
                            type:'*',
                            forManager:true,
                            attributes : [
                                {
                                    desc: function() { return this.tr((({ key:"Appending information. Accepts either an element or an object with a container attribute linked to an element. For the later, can take insertBefore and insertAfter attributes to define the ordering of how the element is to be added. These should be either elements or objects with a container attribute linking to one. This allows you to specify a blessed element." }))); }
                                }
                            ]
                        },
                        {
                            type:'*',
                            forManager:true,
                            attributes : [
                                {
                                    desc : function() { return this.tr((({ key:"Defines the content to be appended into the element.Accepts an element, an array of elements, a string, or an " }))); }
                                }
                            ]
                        },
                        {
                            type:'*',
                            forManager:true,
                            attributes : [
                                {
                                    desc : function() { return this.tr((({ key:"May be a string to apppend to the element's className or a function. If the later, it will be called with the this keyword set to the element." }))); }
                                }
                            ]

                        }
                    ]
                },
                {
                    name:'rm',
                    type:'function',
                    desc:function() { return this.tr((({ key:"Removes an element from it's parent node." }))); },
                    attributes : [
                        {
                            type:'object',
                            required:true,
                            attributes : [
                                {
                                    desc: function() { return this.tr((({ key:"The element to remove." }))); }
                                }
                            ]
                        }
                    ]
                },
                {
                    name:'setContent',
                    type:'function',
                    desc:function() { return this.tr((({ key:"Sets the content of an element, correctly handing dependencies in the process." }))); },
                    attributes : [
                        {
                            type:'object',
                            required:true,
                            attributes : [
                                {
                                    desc: function() { return this.tr((({ key:"The element of which to set the content. It can also be an object with a container attribute (i.e instance widget)." }))); }
                                }
                            ]
                        },
                        {
                            type:'object',
                            required:true,
                            attributes : [
                                {
                                    desc: function() { return this.tr((({ key:"Element, elements (in Array), string or language literal to use for the content." }))); }
                                }
                            ]
                        },
                        {
                            type:'boolean',
                            attributes : [
                                {
                                    desc : function() { return this.tr((({ key:"By default the element will be purged of content prior to new content being written. If this value is true, the element will be cleared (shallow)." }))); }
                                }
                            ]
                        }
                    ]
                },
                {
                    name:'setPlaceholder',
                    type:'function',
                    desc : function() { return this.tr((({ key:"Sets the placeholder value of an element. This is usually required for multi-language support." }))); },
                    attributes : [
                        {
                            type:'object',
                            required:true,
                            attributes: [
                                {
                                    desc: function() { return this.tr((({ key:"The element to set." }))); }
                                }
                            ],
                            desc: function() { return this.tr((({ key:"Appends a debug event to storage and fires a core.debug event containing the data." }))); }
                        },
                        {
                            type:'*',
                            required:true,
                            attributes: [
                                {
                                    desc: function() { return this.tr((({ key:"A string or a language literal." }))); }
                                }
                            ],
                        },
                    ]
                },
                {
                    name:'sort',
                    type:'function',
                    desc:function() { return this.tr((({ key:"Sorts child elements inside an element based on content or a function." }))); },
                    attributes : [
                        {
                            type:'object',
                            required:true,
                            attributes : [
                                {
                                    name:'nodes',
                                    instanceof : { name: 'Array' },
                                    desc:function() { return this.tr((({ key:"Defines the node elements to be sorted. If not set, the root element should be instead." }))); }
                                },
                                {
                                    name:'on',
                                    type: '*',
                                    desc:function() { return this.tr((({ key:"If undefined uses the content of the child element, or define a custom function to use instead. The function will be passed the element as the first argument and follows the standard Array.sort() for legal return values." }))); }
                                },
                                {
                                    name:'reverse',
                                    type:'boolean',
                                    desc:function() { return this.tr((({ key:"Defines whether the order should be reversed." }))); }
                                },
                                {
                                    name:'root',
                                    instanceof : { name: 'Element' },
                                    desc:function() { return this.tr((({ key:"Defines the root element for which to traverse for children. This or nodes must be supplied." }))); }
                                },
                                {
                                    name: 'slice',
                                    instanceof :  { name: 'Array' },
                                    desc:function() { return this.tr((({ key:"Defines whether the compiled list should be sliced. Accepts two values like Array.slice(). Use this to stick elements to the top of a sort" }))); }
                                }


                            ]
                        }
                    ]
                },
                {
                    name:'show',
                    type:'function',
                    desc: function() { return this.tr((({ key:"Shows an element. Element must have been previously hidden with .hide(). Overriding styles and className strings are unsupported." }))); },
                    attributes : [
                        {
                            type:'object',
                            required:true,
                            attributes : [
                                {
                                    desc: function() { return this.tr((({ key:"The element to show." }))); }
                                }
                            ]
                        }
                    ]
                },
                {
                    name:'toggleVisibility',
                    type:'function',
                    desc:function() { return this.tr((({ key:"Toggles an elements visibility based on it's current status.." }))); },
                    attributes : [
                        {
                            type:'object',
                            required:true,
                            attributes : [{
                                desc: function() { return this.tr((({ key:"Calls .show() if hidden, or vice-versa." }))); }
                            }]
                        }
                    ]
                }
            ]
        };

        model.parent.stash.childsupport(data,model);

    };
};
