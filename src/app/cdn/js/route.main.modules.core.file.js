//# sourceURL=route.main.modules.core.file.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {
            desc : function() { return this.tr((({ key:"Provides file related functionality and formatting." }))); },
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            usage : {
                class : true
            },
            attributes : [
                {
                    name:'getExtension',
                    type:'function',
                    attributes: [
                        {
                            type:'string',
                            required:true,
                            attributes : [{
                                desc: function() { return this.tr((({ key:"The filename to process." }))); }
                            }]
                        }
                    ],
                    returns: {
                        attributes : [
                            {
                                type:'string'
                            }
                        ]
                    },
                    desc: function() { return this.tr((({ key:"Returns a filename extension." }))); }
                },
                {
                    name:'formatSize',
                    type:'function',
                    attributes: [
                        {
                            type:'number',
                            required:true,
                            attributes : [{
                                desc: function() { return this.tr((({ key:"The filesize in bytes." }))); }
                            }]
                        }
                    ],
                    returns: {
                        attributes : [
                            {
                                type:'string'
                            }
                        ]
                    },
                    desc: function() { return this.tr((({ key:"Returns a formatted file size, i.e 12Kb, 35Mb, 120Gb." }))); }
                }
            ]
        };

        model.parent.stash.childsupport(data,model);
    };
};
