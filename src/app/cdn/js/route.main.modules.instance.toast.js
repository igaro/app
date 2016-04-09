//# sourceURL=route.main.modules.instance.toast.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {

            demo : "model.managers.dom.mk('button',c, function() { return this.tr({ key:'Execute' }); }).addEventListener('click', function() {\n\
    model.managers.object.create('toast', {\n\
        message: function() { return this.tr({ key:'Successful' }); }\n\
    })['catch'](function (e) {\n\
        model.managers.debug.handle(e);\n\
    });\n\
});",
            desc : function() { return this.tr((({ key:"Provides a popup notification message using native OS features where available with a CSS fallback." }))); },
            blessed:true,
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            usage : {
                instantiate : true,
                attributes : [
                    {
                        name:'message',
                        type:'object',
                        required : true,
                        desc : function() { return this.tr((({ key:"Language literal containing the message to display. Keep it short." }))); }
                    },
                    {
                        name:'duration',
                        type:'string',
                        desc : function() { return this.tr((({ key:"Currently only long and short are supplied. Default is short." }))); }
                    },
                    {
                        name:'position',
                        type:'string',
                        desc : function() { return this.tr((({ key:"Used to define where the message is displayed. Default is bottom center. Native toast's may not permit position change." }))); }
                    },
                ]
            }
        };

        model.parent.stash.childsupport(data,model);
    };
};
