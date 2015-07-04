//# sourceURL=route.main.modules.instance.accordion.js

module.exports = function() {

    "use strict";

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
            blessed: {
                container:true,
                children:['sections']
            },
            objects : {
                section : {
                    name:'Section',
                    blessed : {
                        container:true
                    }
                }
            },

            usage : {
                instantiate : true,
                decorateWithContainer : true,
                attributes : [
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
                            decorateWithOrder:function() { return data.objects.section; },
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
                    name:'expandAll',
                    type:'function',
                    async:true,
                    desc: _tr("Expands all sections. multiExpand must be enabled for this to work."),
                }
            ]
        };

        model.parent.stash.childsupport(data,model);
    };
};
