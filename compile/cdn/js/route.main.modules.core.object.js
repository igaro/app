//# sourceURL=route.main.modules.core.object.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {
            desc : _tr("Provides Igaro's bless mechanism and helper functions for objects such as Promises."),
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            usage : {
                class : true
            },

            embedded:true,
            manager:'object',
            attributes : [
                {
                    name:'arrayInsert',
                    type:'function',
                    desc:_tr("Pushes a value into an array either at the end or before/after an already appended value."),
                    attributes : [
                        {
                            type : 'object',
                            required:true,
                            attributes : [{
                                instanceof: {
                                    name: 'Array'
                                },
                                desc:_tr("The array to manipulate.")
                            }]
                        },
                        {
                            type:'*',
                            required:true,
                            attributes : [
                                {
                                    desc:_tr("The value to use for the insertion.")
                                }
                            ],

                        },
                        {
                            type:'object',
                            attributes : [
                                {
                                    name:'insertAfter',
                                    type:'*',
                                    desc:_tr("If defined, the insertion will occur after the index of the value.")
                                },
                                {
                                    name:'insertBefore',
                                    type:'*',
                                    desc:_tr("If defined, the insertion will occur before the index of the value.")
                                },
                                {
                                    name:'prepend',
                                    type:'boolean',
                                    desc:_tr("Adds the item at the beginning of the array.")
                                }
                            ]
                        }
                    ]
                },
                {
                    name:'bless',
                    type:'function',
                    desc:_tr("Configures an object with additional attributes and functionality based on current object attributes and supplied arguments. This function must be accessed with .call, with the first argument being the object to be blessed. Several arguments. This function does not return a value, but for the purposes of documentation the return value of this function describes the features that may be added to an object, the list of which depends on the pre-attributes of the object and the arguments supplied to this function call. OBJECT has the value read from the object. PARAM means the value is read from the argument literal passed to bless(). Both OBJECT & PARAM mean both locations are tried (in stated order). Most PARAM attributes are added to the object using the same name."),
                    attributes : [
                        {
                            type : 'object',
                            attributes : [
                                {
                                    name:'asRoot',
                                    type:'boolean',
                                    desc:_tr("OBJECT - Defines whether the object should act as Root even if it has a parent. One such use is the event manager uses this to prevent events propagating further.")
                                },
                                {
                                    name:'children',
                                    type:'object',
                                    desc:_tr("OBJECT - Creates arrays on the object using the keys of this object. The key name should match that of the child object bless name. When a child is destroyed it is removed from the array.")
                                },
                                {
                                    name:'container',
                                    instanceof : { name:'Element' },
                                    desc:_tr("OBJECT - A DOM element for the object.")
                                },
                                {
                                    name:'destroy',
                                    type:'function',
                                    desc:_tr("A destructor method that automatically cleans the object for memory collection, destroys any child objects and removes dependencies."),
                                    async:true
                                },
                                {
                                    name:'disable',
                                    type:'function',
                                    desc:_tr("Switches the object's state. This is mainly used to prevent DOM data entry and events firing."),
                                    attributes:[
                                        {
                                            type:'boolean',
                                            desc:_tr("Defines if the object should be disabled. Default is true.")
                                        }
                                    ]
                                },
                                {
                                    name:'disabled',
                                    type:'boolean',
                                    desc:_tr("The object state. No object properties are blocked, it is merely an indication which other methods can use to switch logic. Default is false. Not to be confused with .isDisabled().")
                                },
                                {
                                    name:'hide',
                                    type:'function',
                                    desc:_tr("A shortcut to app['core.dom'].hide() using the objects container element. This function is only added if the object has a container.")
                                },
                                {
                                    name:'hidden',
                                    type:'boolean',
                                    desc:_tr("PARAM - Defines if the object should be hidden. Only applicable if the object has a container. Default is false.")
                                },
                                {
                                    name:'isDisabled',
                                    type:'function',
                                    desc:_tr("Returns whether the object is disabled, propogating the check to the parent object. This is not to be confused with .disabled"),
                                    returns: {
                                        attributes : [
                                            {
                                                instanceof : { name:'Boolean' }
                                            }
                                        ]
                                    }
                                },
                                {
                                    name:'managers',
                                    instanceof : { name:'Array' },
                                    desc:_tr("OBJECT - Managers use the blessed values to customize their operation and response. All blessed objects are given a core.debug, core.dom, core.event and core.object manager. Additional managers are loaded by defining an array, with each element being an array containing a name to use for accessing the manager and the providing object, i.e to load a store manager use; this.managers = [['store',app['core.store']].")
                                },
                                {
                                    name:'name',
                                    type:'string',
                                    desc:_tr("OBJECT - A name used to define the object type. If the object is a singleton (route) then this value is unique, else it is shared across object type.")
                                },
                                {
                                    name:'path',
                                    instanceof : { name:'Array' },
                                    desc:_tr("OBJECT - Normally this is not defined as the path is otherwise automatically build by iterating through the parent objects. It is a collection of .name values.")
                                },
                                {
                                    name:'parent',
                                    type:'object',
                                    desc:_tr("PARAM|OBJECT - Defines how the object relates to another. This is used to define a parent-child relationship. This is accessible via object.parent.")
                                },
                                {
                                    name:'show',
                                    type:'function',
                                    desc:_tr("A shortcut to app['core.dom'].show() using the objects container element. This function is only added if the object has a container.")
                                },
                                {
                                    name:'stash',
                                    type:'object',
                                    desc:_tr("PARAM - Defines a stash object to store on the object. This is accessible via object.stash.")
                                }
                            ]
                        }
                    ]
                },
                {
                    name:'create',
                    type:'function',
                    desc:_tr("Creates a new object (by default from an instance module), automatically loading a providing module if required."),
                    forManager:true,
                    onlyManager:true,
                    attributes: [
                        {
                            type:'*',
                            required:true,
                            desc: _tr("The first argument may also be a string, in which case the value represents the name of the object to create. "),
                            forManager:true,
                            attributes: [
                                {
                                    name:'name',
                                    type:'string',
                                    desc:_tr("Defines the name of the object. Usually this matches the x in instance.x.js")
                                },
                                {
                                    name:'fullname',
                                    type:'string',
                                    desc:_tr("By default the module where the object resides is 'instance.'. Specify a custom module name here.")
                                },
                                {
                                    name:'repo',
                                    type:'object',
                                    desc: _tr("The repo to use for loading the module (if it is currently unloaded). See instance.amd for further information.")
                                }
                            ]
                        },
                        {
                            type:'object',
                            forManager:true,
                            desc: _tr("Object instantiation attributes. Usually an object literal.")
                        }
                    ],
                    async:true
                },
                {
                    name:'debounce',
                    type:'function',
                    desc:_tr("Debounces an operation by reference and delay. Useful for form inputs fields."),
                    attributes: [
                        {
                            type:'*',
                            required:true,
                            desc: _tr("A unique reference, typically the object being debounced."),
                        },
                        {
                            type:'number',
                            desc: _tr("The delay to debounce, typically before the Promise is resolved. This defaults to 300 (ms) which is typical for input[text] and similar fields.")
                        }
                    ],
                    async:true
                },
                {
                    name:'promiseSequencer',
                    type:'function',
                    desc:_tr("Reduces an array of Promises synchronously. Returns an array containing the output from each Promise."),
                    attributes : [
                        {
                            type : 'object',
                            required:true,
                            attributes : [{
                                instanceof: {
                                    name: 'Array'
                                },
                                desc:_tr("The array of Promises to reduce.")
                            }]
                        },
                        {
                            type:'function',
                            required:true,
                            attributes : [
                                {
                                    desc:_tr("The function to call for each Promise.")
                                }
                            ],
                        }
                    ],
                    async:true,
                    returns: {
                        attributes : [
                            {
                                instanceof : { name:'Array' }
                            }
                        ]
                    }
                }
            ]
        };

        model.parent.stash.childsupport(data,model);

    };
};
