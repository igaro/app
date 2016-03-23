//# sourceURL=route.main.compat.js

module.requires = [
    { name: 'route.main.compat.css' },
    { name: 'font.glyph.awesome.css' }
];

module.exports = function() {

    "use strict";

    return function(model) {

        var wrapper = model.wrapper;

        model.stash.title = _tr("Compatibiity");
        model.stash.desc = _tr("Igaro App works with any recent browser and platform. This page contains the list.");

        var managers = model.managers,
            domMgr= managers.dom,
            objectMgr = managers.object;

        domMgr.mk('p',wrapper,_tr("Igaro App is compatible with all modern web browsers and mobile devices."));

        domMgr.mk('p',wrapper,_tr("Modules are responsible for verifying requirements upon load. Upon an error a message is displayed to the user."));

        return objectMgr.create('table', {
            container:wrapper,
            header : {
                rows : [
                    {
                        columns : [
                            {
                                content : _tr("Company")
                            },
                            {
                                content : _tr("Software")
                            },
                            {
                                content : _tr("Version")
                            },
                            {
                                content : _tr("Status")
                            },
                            {
                                content : _tr("Remarks")
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
                                content : _tr("Some modules may have reduced functionality.")
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
                                content : _tr("Some widgets may be unavailable.")
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
                                content : _tr("Tested as far back as version 10, but may work with earlier versions.")
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
                                content : _tr("Tested as far back as version 40, but may work with earlier versions.")
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
                                content : _tr("Tested as far back as version 15, but may work with earlier versions.")
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
                                content : _tr("Some widgets may have reduced functionality.")
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
                                content : _tr("Some widgets may be unavailable.")
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
                                content : _tr("Tested as far back as version 5, but may work with earlier versions.")
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
                                content : _tr("Some widgets may have reduced functionality.")
                            }
                        ]
                    },
                    {
                        columns : [
                            {
                                content:_tr("Opera Software")
                            },
                            {
                                content:_tr("Opera")
                            },
                            {
                                content : "10+"
                            },
                            {
                                className : "green",
                                content : '<span></span>'
                            },
                            {
                                content : _tr("Tested as far back as version 10, but may work with earlier versions.")
                            }
                        ]
                    }
                ]
            }

        });

    };
};
