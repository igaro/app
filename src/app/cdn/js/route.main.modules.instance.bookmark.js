//# sourceURL=route.main.modules.instance.bookmark.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {

            demo : "model.managers.object.create('bookmark', { container:c }) ",
            desc : function() { return this.tr((({ key:"Provides a simple bookmark toolbar for the major social platforms." }))); },
            blessed:true,
            usage : {
                instantiate : true,
                attributes : [
                    {
                        name:'url',
                        type:'string',
                        desc : function() { return this.tr((({ key:"The URL to bookmark. Defaults to the current." }))); }
                    },
                    {
                        name:'title',
                        type:'string',
                        desc : function() { return this.tr((({ key:"Title to pass over to the external service." }))); }
                    },
                    {
                        name:'container',
                        type:'object',
                        attributes:[{
                            instanceof: { name:'Element' }
                        }],
                        desc : function() { return this.tr((({ key:"Container to append the instance into." }))); }
                    }
                ]
            },

            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            attributes : [
                {
                    name:'setURL',
                    type:'function',
                    desc: function() { return this.tr((({ key:"Sets the URL and optional title to pass over to the external service." }))); },
                    attributes : [
                        {
                            type:'object',
                            attributes : [
                                {
                                    name:'url',
                                    type:'string',
                                    desc : function() { return this.tr((({ key:"URL to bookmark. Defaults to the current." }))); }
                                },
                                {
                                    name:'title',
                                    type:'string',
                                    desc : function() { return this.tr((({ key:"Title to pass over." }))); }
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        model.parent.stash.childsupport(data,model);

    };

};
