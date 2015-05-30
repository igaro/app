module.exports = function(app) {

    return function(model) {

        var data = {

            demo : " \n \
model.managers.object.create('accordion',{ \n \
    container:c, \n \
    sections : [ \n \
        { title: { en:'1' }, content:{ en : 'Blue' }}, \n \
        { title: { en:'2' }, content:{ en : 'Black' }}, \n \
        { title: { en:'3' }, content:{ en : 'Red' }, disabled:true } \n \
    ] \n \
});",
            desc : _tr("Creates a list that can expand and collapse nodes. Useful to condense information for when navigation is important or where space is limited."), 
            blessed:true,
            objects : {
                section : { 
                    name:'Section',
                    blessed : true,
                    attributes : [
                        { 
                            name:'addRoute', 
                            type:'function',
                            attributes: [
                                { 
                                    type:'object', 
                                    required:true,
                                    attributes:[
                                        {
                                            name:'container',
                                            instanceof : { name:'Element' },
                                            desc: _tr("A DL container for the object.")
                                        },
                                        {
                                            name:'content',
                                            instanceof : { name:'Element' },
                                            desc: _tr("A DD element representing the content.")
                                        },
                                        {
                                            name:'header',
                                            instanceof : { name:'Element' },
                                            desc: _tr("A DT element representing the header.")
                                        },
                                        {
                                            name:'selector',
                                            instanceof : { name:'Element' },
                                            desc: _tr("A SPAN element representing the selection status of the content. For example a SELECT element could write it's current value.")
                                        },
                                        {
                                            name:'title',
                                            instanceof : { name:'Element' },
                                            desc: _tr("A SPAN element representing the title inside the header.")
                                        }
                                    ]
                                }
                            ],
                            async:true,
                            returns: {
                                attributes:[
                                    {
                                        instanceof: function() { return data.objects.route; },
                                    }
                                ]
                            },
                            desc : _tr("Attempts to load a child route. If loaded an enter event is fired on the routes event manager. Use this to force code reload. An init event is fired the first time a route is loaded. Use this to set-up a view and parameters that keep state.")
                        }
                    ]
                }
            },

            usage : {
                instantiate : true,
                attributes : [
                    { 
                        name:'container', 
                        type:'object',
                        desc : _tr("Container to append the instance into."),
                        attributes : [{
                            instanceof : { name:'Element' }
                        }]
                    },
                    {
                        name:'multiExpand',
                        type:'boolean',
                        desc:_tr("Pass true to allow more than one section to expand. If false (default) then open sections contract prior to another section opening.")
                    },
                    { 
                        name:'sections', 
                        type:'object',
                        attributes : [{
                            instanceof : { name:'Array' }
                        }],
                        desc : _tr("Initial sections to create. Calls .addSections() with the list.")
                    }
                ]
            },
            author : { 
                name:'Andrew Charnley', 
                link:'http://www.igaro.com/ppl/ac' 
            },
            attributes : [
                { 
                    name:'addSection', 
                    type:'function',
                    async:true,
                    desc : _tr("Adds a new section to the accordion."),
                    returns : {
                        instanceof: function() { return data.objects.section; },
                    },
                    attributes : [
                        {
                            type:'object',
                            required:true,
                            attributes:[
                                {
                                    name:'content',
                                    type:'object',
                                    desc: _tr("A language literal, content or other Element.")
                                },
                                {
                                    name:'expand',
                                    type:'boolean',
                                    desc:_tr("Sets the initial mode to be expanded.")
                                },
                                {
                                    name:'title',
                                    type:'object',
                                    desc: _tr("A language literal or string.")
                                }
                            ]
                        }
                    ]
                },
                {
                    name:'addSections',
                    type:'function',
                    async:true,
                    desc: _tr("Calls .addSection() with each item in the array and returns the added sections."),
                    attributes : [{
                        type:'object',
                        attributes : [{
                            instanceof : { name:'Array' }
                        }]
                    }],
                    returns : {
                        attributes : [{
                            instanceof : { name:'Array' }
                        }],
                    }
                },
                {
                    name:'collapseAll',
                    type:'function',
                    async:true,
                    desc: _tr("Collapses all sections"),
                },
                { 
                    name:'container', 
                    instanceof : { name:'Element' },
                    desc : _tr("The UL element that contains the LI siblings") 
                },
                {
                    name:'expandAll',
                    type:'function',
                    async:true,
                    desc: _tr("Expands all sections. multiExpand must be enabled for this to work."),
                },
                { 
                    name:'sections', 
                    instanceof : { name:'Array' },
                    desc : _tr("The sections added to the accordion.")
                }
            ]
        };

        model.parent.stash.childsupport(data,model);
    };
};
