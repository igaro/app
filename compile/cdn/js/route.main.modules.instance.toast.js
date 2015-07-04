//# sourceURL=route.main.modules.instance.toast.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {

            demo : "model.managers.dom.mk('button',c, { en:'Execute' }).addEventListener('click', function() {\n\
    model.managers.object.create('toast', {\n\
        message:{ en: 'Successful' }\n\
    }).catch(function (e) {\n\
        model.managers.debug.handle(e);\n\
    });\n\
});",
            desc : _tr("Provides a popup notification message using native OS features where available with a CSS fallback."),
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
                        desc : _tr("Language literal containing the message to display. Keep it short.")
                    },
                    {
                        name:'duration',
                        type:'string',
                        desc : _tr("Currently only long and short are supplied. Default is short.")
                    },
                    {
                        name:'position',
                        type:'string',
                        desc : _tr("Used to define where the message is displayed. Default is bottom center. Native toast's may not permit position change.")
                    },
                ]
            }
        };

        model.parent.stash.childsupport(data,model);

    };
};
