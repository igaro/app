module.requires = [
    { name: 'route.main.compat.css' },
];

module.exports = function(app) {

    return function(model) {

        var wrapper = model.wrapper;

        model.stash.title = _tr("Compatibiity");

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
                                className : "green"
                            },
                            {
                            }
                        ]
                    },
                    {
                        columns : [
                            {
                                content : "Microsoft"
                            },
                            {
                                content : "Internet Explorer" 
                            },
                            {
                                content : "9"
                            },
                            {
                                className : "red"
                            },
                            {
                                content : _tr("Some modules lack support, especially router's .pushState. Can be made to work with some overhead.")
                            }
                        ]
                    },
                    {
                        columns : [
                            {
                                content : "Microsoft"
                            },
                            {
                                content : "Internet Explorer" 
                            },
                            {
                                content : "8"
                            },
                            {
                                className : "red"
                            },
                            {
                                content : _tr("Many modules lack workaround support for missing features that can't be prototyped. Can be made to work with significant overhead.")
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
                                className : "green"
                            },
                            {
                                content : _tr("Tested as far back as version 10, but may work with earlier versions.")
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
                                className : "green"
                            },
                            {
                                content : _tr("Tested as far back as version 15, but may work with earlier versions.")
                            }
                        ]
                    },
                    {
                        columns : [
                            {
                                content : "Google"
                            },
                            {
                                content : "Android"
                            },
                            {
                                content : "4+"
                            },
                            {
                                className : "green"
                            },
                            {
                            }
                        ]
                    },
                    {
                        columns : [
                            {
                                content : "Google"
                            },
                            {
                                content : "Android"
                            },
                            {
                                content : "3"
                            },
                            {
                                className : "orange"
                            },
                            {
                                content : _tr("Mainly CSS related limitations.")
                            }
                        ]
                    },
                    {
                        columns : [
                            {
                                content : "Google"
                            },
                            {
                                content : "Android"
                            },
                            {
                                content : "2"
                            },
                            {
                                className : "red"
                            },
                            {
                                content : _tr("Missing support for many features, especially for CSS.")
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
                                className : "green"
                            },
                            {
                                content : _tr("Tested as far back as version 5, but may work with earlier versions.")
                            }
                        ]
                    },
                    {
                        columns : [
                            {
                                content : "Apple"
                            },
                            {
                                content : "IOS" 
                            },
                            {
                                content : "5+"
                            },
                            {
                                className : "green"
                            },
                            {
                            }
                        ]
                    },
                    {
                        columns : [
                            {
                                content : "Apple"
                            },
                            {
                                content : "IOS" 
                            },
                            {
                                content : "4"
                            },
                            {
                                className : "orange"
                            },
                            {
                                content : _tr("Some missing features and many CSS issues. Not recommended.")
                            }
                        ]
                    },
                ]
            }

        });

    };
};
