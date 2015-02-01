(function () {

"use strict";

module.requires = [
	{ name: 'route.main.overview.css' }
];

module.exports = function(app) {

   	return function(model) {

        var wrapper = model.wrapper;

        model.setMeta('title', {"fr":"","en":"Overview"});

        dom.mk('p',wrapper,{"fr":"","en":"Igaro App is a Javascript based framework for developing scalable, responsive and dynamic web and mobile applications."});

        dom.mk('li',wrapper,{"fr":"","en":"Promotes best practice - write great code even if you're not an expert."});

        dom.mk('li',wrapper,{"fr":"","en":"Very easy to learn - Igaro App is standard Object Orientated Javascript."});

        dom.mk('li',wrapper,{"fr":"","en":"Excellent for teamwork - automates compile, debug and deploy workflows."});

        dom.mk('li',wrapper,{"fr":"","en":"Outperforms other frameworks - cutting edge features, error handling and smart logic."});

        dom.mk('h1',wrapper,{"fr":"","en":"Where"});

        dom.mk('p',wrapper,{"fr":"","en":"Igaro App can be served to a web browser, distributed through an app store, or bundled on removeable media. It works great on monitors, tablets. phones and everything inbetween."});
  
        dom.mk('div',wrapper,null,'viewport');

        dom.mk('h1',wrapper,{"fr":"","en":"Goals"});

        return model.addInstance('table', { 
            container:dom.mk('p',wrapper),
            header : {
                rows : [
                    {
                        columns : [
                            {
                                content : {"fr":"","en":"Domain"}
                            },
                            {
                                content : {"fr":"","en":"Details"}
                            },
                            {
                                content : {"fr":"","en":"Status"}
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
                                content : {"fr":"","en":"Security"}
                            },
                            {
                                content : {"fr":"","en":"No public variables. Military-grade security. No memory leaks. Automatic oAuth initilization with Promise replay."}
                            },
                            {
                                className : 'green'
                            }
                        ]
                    },
                    {
                        columns : [
                            {
                                content : {"fr":"","en":"Locale"}
                            },
                            {
                                content : {"fr":"","en":"Multi-language support via PO files. Realtime language switching. Multi-currency, date w/offset, and country functionality."}
                            },
                            {
                                className : 'green'
                            }
                        ]
                    },
                    {
                        columns : [
                            {
                                content : {"fr":"","en":"Testing"}
                            },
                            {
                                content : {"fr":"","en":"Automated test suite exhaustively testing all features across all modules."}
                            },
                            {
                                className : 'red'
                            }
                        ]
                    }
                ]
            }
        });
    };
};


})();