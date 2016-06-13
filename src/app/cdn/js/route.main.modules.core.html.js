//# sourceURL=route.main.modules.core.html.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {

            desc : function() { return this.tr((({ key:"Provides HTML related functionality and formatting." }))); },
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            usage : {
                class : true
            },
            attributes : [
                {
                    name:'from',
                    type:'function',
                    returns: {
                        attributes : [
                            {
                                type:'string'
                            }
                        ]
                    },
                    attributes: [
                        {
                            type:'string',
                            required:true,
                            attributes : [{
                                desc: function() { return this.tr((({ key:"The value to process." }))); }
                            }]
                        }
                    ],
                    desc: function() { return this.tr((({ key:"Converts HTML special characters into print code." }))); }
                },
                {
                    name:'to',
                    type:'function',
                    returns: {
                        attributes : [
                            {
                                type:'string'
                            }
                        ]
                    },
                    attributes: [
                        {
                            type:'string',
                            required:true,
                            attributes : [{
                                desc: function() { return this.tr((({ key:"The value to process." }))); }
                            }]
                        }
                    ],
                    desc: function() { return this.tr((({ key:"Formats special characters into HTML code." }))); }
                },
                {
                    name:'strip',
                    type:'function',
                    returns: {
                        attributes : [
                            {
                                type:'string'
                            }
                        ]
                    },
                    attributes: [
                        {
                            type:'string',
                            required:true,
                            attributes : [{
                                desc: function() { return this.tr((({ key:"The value to process." }))); }
                            }]
                        }
                    ],
                    desc: function() { return this.tr((({ key:"Strips HTML from a string." }))); }
                }
            ]

        };

        model.parent.stash.childsupport(data,model);
    };
};
