module.exports = function(app) {

    return function(model) {

        var data = {

            demo : " \n \
model.managers.object.create('list',{ \n\
    container:c, \n\
    items : [ \n\
        { content:{ en : '1' }}, \n\
        { content:{ en : '2' }}, \n\
        { content:{ en : '3' }} \n\
    ] \n \
}).then(function(l) { \n\
    var x = l.items[0]; \n\
    dom.mk('button',c,'Move #1 down').addEventListener('click', function() { \n\
        l.shift(x,1); \n\
    }); \n \
});",
            desc : _tr("Provides an array like list mapped to a UL and LI elements."),
            blessed: {
                container:true
            },
            objects : {
                item : {
                    name:'Item',
                    blessed : true,
                    attributes : [
                        {
                            name:'container',
                            instanceof : { name:'Element' },
                            desc: _tr("An LI container for the object.")
                        }
                    ]
                }
            },
            usage : {
                decorateWithContainer:true,
                instantiate : true,
                attributes : [
                    {
                        name:'items',
                        instanceof: { name:'Array' },
                        desc : _tr("Initial items to use for the list. See addItem() for attributes.")
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
                    type:'function',
                    returns : {
                        instanceof: function() { return data.objects.item; },
                    },
                    desc : _tr("Adds an object to the list optionally shifting it to a specified position. The object will have an LI element appended at the same position."),
                    attributes : [
                        {
                            type:'object',
                            required:true,
                            decorateWithContainer:true,
                            attributes:[
                                {
                                    name:'content',
                                    type:'object',
                                    desc: _tr("The content to supply to the DOM creator (see core.dom.mk).")
                                }
                            ]
                        }
                    ]
                },
                {
                    name:'addItems',
                    async:true,
                    type:'function',
                    desc : _tr("Calls .addItem() in sequence and returns the new items."),
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
                                    desc: _tr("Items to insert.")
                                }
                            ]
                        }
                    ]
                },
                {
                    name:'items',
                    instanceof : { name:'Array' },
                    desc : _tr("The list's items.")
                },
                {
                    name:'shift',
                    type:'function',
                    desc : _tr("Moves an object in the list by a number of places."),
                    attributes:[
                        {
                            type:'object',
                            required:true,
                            attributes:[{
                                desc: _tr("The object in the list to move.")
                            }]
                        },
                        {
                            type:'number',
                            required:true,
                            attributes:[{
                                desc: _tr("The number of places to move the item in the list up or down..")
                            }]
                        }
                    ]
                }
            ]
        };

        model.parent.stash.childsupport(data,model);
    };
};
