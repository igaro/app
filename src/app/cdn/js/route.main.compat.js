//# sourceURL=route.main.compat.js

module.requires = [
    { name: 'route.main.compat.css' },
    { name: 'font.glyph.awesome.css' }
];

module.exports = function() {

    "use strict";

    return function(model) {

        var wrapper = model.wrapper;

        model.stash.title = function() { return this.gettext("Compatibiity"); };
        model.stash.desc = function() { return this.gettext("Igaro App works with any recent browser and platform. This page contains the list."); };

        var managers = model.managers,
            domMgr= managers.dom,
            objectMgr = managers.object;

        domMgr.mk('p',wrapper,function() { return this.gettext("Igaro App is compatible with the majority of web browsers going back to IE8, and mobile devices."); });

        domMgr.mk('h1',wrapper,function() { return this.gettext("Handling Requirements"); });

        domMgr.mk('p',wrapper,function() { return this.gettext("Modules are responsible for verifying requirements upon load and throwing an error if they are not met, which is handed and displayed to the user. Modules try to offer reduced functionality where possible."); });

        domMgr.mk('pre',wrapper,domMgr.mk('code',null,"if (! ('contentEditable' in document.body)) \n\
    throw new Error({ incompatible:true, noobject:'contentEditable' });"));

        return objectMgr.create('table', {
            header : {
                rows : [
                    {
                        columns : [
                            {
                                content : function() { return this.gettext("Company"); }
                            },
                            {
                                content : function() { return this.gettext("Software"); }
                            },
                            {
                                content : function() { return this.gettext("Version"); }
                            },
                            {
                                content : function() { return this.gettext("Status"); }
                            },
                            {
                                content : function() { return this.gettext("Remarks"); }
                            }
                        ]
                    }
                ]
            },
            body : {
                rows : [
                    {
                        columns : [
                            {
                                content : "Microsoft"
                            },
                            {
                                content : "Internet Explorer"
                            },
                            {
                                content : "10+"
                            },
                            {
                                className : "green",
                                content : '<span></span>'
                            },
                            {
                            }
                        ]
                    },
                    {
                        columns : [
                            {
                            },
                            {
                            },
                            {
                                content : "9"
                            },
                            {
                                className : "green",
                                content : '<span></span>'
                            },
                            {
                                content : function() { return this.gettext("Some modules may have reduced functionality."); }
                            }
                        ]
                    },
                    {
                        columns : [
                            {
                            },
                            {
                            },
                            {
                                content : "8"
                            },
                            {
                                className : "orange",
                                content : '<span></span>'
                            },
                            {
                                content : function() { return this.gettext("Some widgets may be unavailable."); }
                            }
                        ]
                    },
                    {
                        columns : [
                            {
                                content : "Mozilla"
                            },
                            {
                                content : "Firefox"
                            },
                            {
                                content : "10+"
                            },
                            {
                                className : "green",
                                content : '<span></span>'
                            },
                            {
                                content : function() { return this.gettext("Tested as far back as version 10, but may work with earlier versions."); }
                            }
                        ]
                    },
                    {
                        columns : [
                            {
                                content : ""
                            },
                            {
                                content : "Mobile"
                            },
                            {
                                content : "40+"
                            },
                            {
                                className : "green",
                                content : '<span></span>'
                            },
                            {
                                content : function() { return this.gettext("Tested as far back as version 40, but may work with earlier versions."); }
                            }
                        ]
                    },
                    {
                        columns : [
                            {
                                content : "Google"
                            },
                            {
                                content : "Chrome"
                            },
                            {
                                content : "15+"
                            },
                            {
                                className : "green",
                                content : '<span></span>'
                            },
                            {
                                content : function() { return this.gettext("Tested as far back as version 15, but may work with earlier versions."); }
                            }
                        ]
                    },
                    {
                        columns : [
                            {
                            },
                            {
                                content : "Android"
                            },
                            {
                                content : "4+"
                            },
                            {
                                className : "green",
                                content : '<span></span>'
                            },
                            {
                            }
                        ]
                    },
                    {
                        columns : [
                            {
                            },
                            {
                            },
                            {
                                content : "3"
                            },
                            {
                                className : "orange",
                                content : '<span></span>'
                            },
                            {
                                content : function() { return this.gettext("Some widgets may have reduced functionality."); }
                            }
                        ]
                    },
                    {
                        columns : [
                            {
                            },
                            {
                            },
                            {
                                content : "2"
                            },
                            {
                                className : "red",
                                content : '<span></span>'
                            },
                            {
                                content : function() { return this.gettext("Some widgets may be unavailable."); }
                            }
                        ]
                    },
                    {
                        columns : [
                            {
                                content : "Apple"
                            },
                            {
                                content : "Safari"
                            },
                            {
                                content : "5+"
                            },
                            {
                                className : "green",
                                content : '<span></span>'
                            },
                            {
                                content : function() { return this.gettext("Tested as far back as version 5, but may work with earlier versions."); }
                            }
                        ]
                    },
                    {
                        columns : [
                            {
                            },
                            {
                                content : "IOS"
                            },
                            {
                                content : "5+"
                            },
                            {
                                className : "green",
                                content : '<span></span>'
                            },
                            {
                            }
                        ]
                    },
                    {
                        columns : [
                            {
                            },
                            {
                            },
                            {
                                content : "4"
                            },
                            {
                                className : "orange",
                                content : '<span></span>'
                            },
                            {
                                content : function() { return this.gettext("Some widgets may have reduced functionality."); }
                            }
                        ]
                    },
                    {
                        columns : [
                            {
                                content:function() { return this.gettext("Opera Software"); }
                            },
                            {
                                content:function() { return this.gettext("Opera"); }
                            },
                            {
                                content : "10+"
                            },
                            {
                                className : "green",
                                content : '<span></span>'
                            },
                            {
                                content : function() { return this.gettext("Tested as far back as version 10, but may work with earlier versions."); }
                            }
                        ]
                    }
                ]
            }

        }).then(function(table) {

            domMgr.mk('h1',wrapper,function() { return this.gettext("Compatibility Table"); });

            domMgr.mk('p',wrapper,table);

            domMgr.mk('p',wrapper,null,function() {

                domMgr.mk('button',this,function() { return this.gettext("Next Chapter - Testing"); }).addEventListener('click',function() {

                    model.parent.to(['testing']);
                });
            });
        });

    };
};
