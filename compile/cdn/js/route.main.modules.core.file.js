//# sourceURL=route.main.modules.core.file.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {
            desc : _tr("Provides file related functionality and formatting."),
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
                                desc: _tr("The filename to process.")
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
                    desc: _tr("Returns a filename extension.")
                },
                {
                    name:'formatSize',
                    type:'function',
                    attributes: [
                        {
                            type:'number',
                            required:true,
                            attributes : [{
                                desc: _tr("The filesize in bytes.")
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
                    desc: _tr("Returns a formatted file size, i.e 12Kb, 35Mb, 120Gb.")
                }
            ]
        };

        model.parent.stash.childsupport(data,model);
    };
};
