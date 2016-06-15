//# sourceURL=route.main.modules.instance.accordion.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {

            demo : 'model.managers.object.create("accordion",{\n\
    container:c,\n\
    sections : [\n\
        { title: function() { return this.tr({ key:"1" }); }, content:function() { return this.tr({ key:"Blue" }); } },\n\
        { title: function() { return this.tr({ key:"2" }); }, content:function() { return this.tr({ key:"Black" }); } },\n\
        { title: function() { return this.tr({ key:"3" }); }, content:function() { return this.tr({ key:"Red" }); }, disabled:true }\n\
    ]\n\
});',
            desc : function() { return this.tr((({ key:"Creates a list that can expand and collapse nodes. Useful to condense information for when navigation is important or where space is limited." }))); },
            blessed: {
                container:true,
                children:['sections']
            },
            objects : {
                section : {
                    name:'Section',
                    blessed : {
                        container:true
                    },
                    attributes : [
                        {
                            name:'expand',
                            type:'function',
                            async:true,
                            events:['expand'],
                            desc:function() { return this.tr((({ key:"Expands the section." }))); }
                        },
                        {
                            name:'collapse',
                            type:'function',
                            async:true,
                            events:['collapse'],
                            desc:function() { return this.tr((({ key:"Collapses the section." }))); }
                        }
                    ]
                }
            },

            usage : {
                instantiate : true,
                decorateWithContainer : true,
                attributes : [
                    {
                        name:'multiExpand',
                        type:'boolean',
                        desc:function() { return this.tr((({ key:"Pass true to allow more than one section to expand. If false (default) then open sections contract prior to another section opening." }))); }
                    },
                    {
                        name:'sections',
                        type:'object',
                        attributes : [{
                            instanceof : { name:'Array' }
                        }],
                        desc : function() { return this.tr((({ key:"Initial sections to create. Calls .addSections() with the list." }))); }
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
                    events:['addSection'],
                    desc : function() { return this.tr((({ key:"Adds a new section to the accordion." }))); },
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
                                    desc: function() { return this.tr((({ key:"A language literal, content or other Element." }))); }
                                },
                                {
                                    name:'expand',
                                    type:'boolean',
                                    desc:function() { return this.tr((({ key:"Sets the initial mode to be expanded." }))); }
                                },
                                {
                                    name:'title',
                                    type:'object',
                                    desc: function() { return this.tr((({ key:"A language literal or string." }))); }
                                }
                            ]
                        }
                    ]
                },
                {
                    name:'addSections',
                    type:'function',
                    async:true,
                    desc: function() { return this.tr((({ key:"Calls .addSection() with each item in the array and returns the added sections." }))); },
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
                    events:['collapseAll'],
                    async:true,
                    desc: function() { return this.tr((({ key:"Collapses all sections" }))); },
                },
                {
                    name:'expandAll',
                    type:'function',
                    async:true,
                    events:['expandAll'],
                    desc: function() { return this.tr((({ key:"Expands all sections. multiExpand must be enabled for this to work." }))); },
                }
            ]
        };

        model.parent.stash.childsupport(data,model);
    };
};
