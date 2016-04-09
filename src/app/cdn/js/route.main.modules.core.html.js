//# sourceURL=route.main.modules.core.html.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {

            desc : function(l) { return l.gettext("Provides HTML related functionality and formatting."); },
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
                                desc: function(l) { return l.gettext("The value to process."); }
                            }]
                        }
                    ],
                    desc: function(l) { return l.gettext("Converts HTML special characters into print code."); }
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
                                desc: function(l) { return l.gettext("The value to process."); }
                            }]
                        }
                    ],
                    desc: function(l) { return l.gettext("Formats special characters into HTML code."); }
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
                                desc: function(l) { return l.gettext("The value to process."); }
                            }]
                        }
                    ],
                    desc: function(l) { return l.gettext("Strips HTML from a string."); }
                }
            ]

        };

        model.parent.stash.childsupport(data,model);
    };
};
