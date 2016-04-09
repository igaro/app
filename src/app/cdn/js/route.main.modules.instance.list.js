//# sourceURL=route.main.modules.instance.list.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {

            demo : "model.managers.object.create('list',{ \n\
    container:c,\n\
    items : [\n\
        { content: function() { return this.tr({ key:'1' }); }},\n\
        { content: function() { return this.tr({ key:'2' }); }},\n\
        { content: function() { return this.tr({ key:'3' }); }}\n\
    ] \n \
}).then(function(l) {\n\
    var x = l.items[0];\n\
    dom.mk('button',c,'Move #1 down').addEventListener('click', function() {\n\
        l.shift(x,1); \n\
    });\n\
});",
            desc : function() { return this.tr((({ key:"Provides an array like list mapped to a UL and LI elements." }))); },
            blessed: {
                container:true,
                children:["items"]
            },
            objects : {
                item : {
                    name:'Item',
                    blessed : {
                        container: true
                    }
                }
            },
            usage : {
                decorateWithContainer:true,
                instantiate : true,
                attributes : [
                    {
                        name:'items',
                        instanceof: { name:'Array' },
                        desc : function() { return this.tr((({ key:"Initial items to use for the list. See addItem() for attributes." }))); }
                    }
                ]
            },
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            attributes : [
                {
                    name:'addItem',
                    async:true,
                    events:['addItem'],
                    type:'function',
                    returns : {
                        instanceof: function() { return data.objects.item; },
                    },
                    desc : function() { return this.tr((({ key:"Creates a new Item object." }))); },
                    attributes : [
                        {
                            type:'object',
                            required:true,
                            decorateWithContainer:true,
                            attributes:[
                                {
                                    name:'content',
                                    type:'object',
                                    desc: function() { return this.tr((({ key:"The content to supply to the DOM creator (see core.dom.mk)." }))); }
                                }
                            ]
                        }
                    ]
                },
                {
                    name:'addItems',
                    async:true,
                    type:'function',
                    desc : function() { return this.tr((({ key:"Calls .addItem() in sequence." }))); },
                    returns : {
                        attributes: [{
                            instanceof: { name:'Array' }
                        }]
                    },
                    attributes : [
                        {
                            type:'object',
                            required:true,
                            attributes:[
                                {
                                    instanceof: { name:'Array' },
                                    desc: function() { return this.tr((({ key:"Items to insert." }))); }
                                }
                            ]
                        }
                    ]
                },
                {
                    name:'shift',
                    type:'function',
                    desc : function() { return this.tr((({ key:"Moves an object in the list by a number of places." }))); },
                    attributes:[
                        {
                            type:'object',
                            required:true,
                            attributes:[{
                                desc: function() { return this.tr((({ key:"The object in the list to move." }))); }
                            }]
                        },
                        {
                            type:'number',
                            required:true,
                            attributes:[{
                                desc: function() { return this.tr((({ key:"The number of places to move the item in the list up or down.." }))); }
                            }]
                        }
                    ]
                }
            ]
        };

        model.parent.stash.childsupport(data,model);
    };
};
