//# sourceURL=route.main.modules.instance.pagemessage.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {

            demo : " \n \
model.managers.object.create('pagemessage', { \n \
    container:c, \n \
    type:'error', \n \
    message : { \n \
        en : 'Some sort of error occured.', \n \
    } \n \
}); \n \
model.managers.object.create('pagemessage', { \n \
    container:c, \n \
    type:'success', \n \
    id:'7x4d', \n \
    hideable: true, \n \
    message : { \n \
        en : 'After closing this message try refreshing your page.', \n \
    } \n \
});",
            desc : _tr("Provides a styled message for display on a view."),
            blessed:{
                container:true
            },
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            usage : {
                decorateWithContainer:true,
                instantiate : true,
                attributes : [
                    {
                        name:'id',
                        type:'string',
                        desc : _tr("Used to retain a hidden state, where applicable.")
                    },
                    {
                        name:'hideable',
                        type:'boolean',
                        desc : _tr("Allow the message to be permanently hidden.")
                    },
                    {
                        name:'message',
                        type:'object',
                        required:true,
                        desc : _tr("A language literal to be displayed.")
                    },
                    {
                        name:'type',
                        type:'string',
                        desc : _tr("Defines the style. Choose between; warn, info, error, default, success and ok, or make your own.")
                    }
                ]
            }
        };

        model.parent.stash.childsupport(data,model);

    };
};
