//# sourceURL=route.main.modules.instance.modaldialog.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {

            demo : " \n \
dom.mk('button',c,{ \n \
    en : 'Alert Me!', \n \
}).addEventListener('click', function() { \n \
    model.managers.object.create('modaldialog').then(function(l) { \n \
        l.alert({ message:{ \n \
            en : 'Nothing to see here.', \n \
        }}); \n \
    }); \n \
});",
            desc : function(l) { return l.gettext("Provides asynchronous dialog screens which force a user action. A replacement for alert() and confirm()."); },
            blessed:true,
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            usage : {
                instantiate : true,
            },
            attributes : [
                {
                    name:'action',
                    type:'function',
                    returns : {
                        attributes : [{
                            async:true,
                            desc : function(l) { return l.gettext("Resolves when the user selects an action. The action is returned."); }
                        }]
                    },
                    desc: function(l) { return l.gettext("Displays a list of actions."); },
                    async:true,
                    attributes : [
                        {
                            type:'object',
                            attributes : [
                                {
                                    name : 'message',
                                    type : 'object',
                                    desc: function(l) { return l.gettext("A language literal to use for the message."); }
                                },
                                {
                                    name : 'actions',
                                    type : 'Array',
                                    desc: function(l) { return l.gettext("Specifies actions to be included. A cancel action will always be appended."); },
                                    attributes : [
                                        {
                                            name : 'l',
                                            desc :  function(l) { return l.gettext("A language literal to use for the action."); }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    name:'alert',
                    type:'function',
                    async:true,
                    desc: function(l) { return l.gettext("Displays an alert dialog."); },
                    attributes : [
                        {
                            type:'object',
                            attributes : [
                                {
                                    name : 'message',
                                    type : 'object',
                                    desc: function(l) { return l.gettext("A language literal to use for the message."); }
                                }
                            ]
                        }
                    ]
                },
                {
                    name:'confirm',
                    type:'function',
                    async:true,
                    returns : {
                        attributes : [{
                            type:'boolean',
                        }]
                    },
                    desc: function(l) { return l.gettext("Displays a confirm or cancel dialog."); },
                    attributes : [
                        {
                            type:'object',
                            attributes : [
                                {
                                    name : 'message',
                                    type : 'object',
                                    desc: function(l) { return l.gettext("A language literal to use for the message."); }
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
