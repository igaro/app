//# sourceURL=route.main.modules.core.status.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {

            desc : function() { return this.tr((({ key:"A very simple status event emitter." }))); },
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            usage : {
                class : true
            },
            attributes : [
                {
                    name:'append',
                    type:'function',
                    attributes: [
                        {
                            type:'object',
                            required:true,
                            attributes:[{
                                desc: function() { return this.tr((({ key:"Object to pass onto the event handler." }))); },
                            }]
                        }
                    ]
                }
            ],
            related : [
                'service.status.js'
            ]
        };

        model.parent.stash.childsupport(data,model);

    };
};
