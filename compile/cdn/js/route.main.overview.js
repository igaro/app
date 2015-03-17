(function () {

"use strict";

module.requires = [
	{ name: 'route.main.overview.css' }
];

module.exports = function(app) {

   	return function(model) {

        var wrapper = model.wrapper;

        model.setMeta('title', _tr("Overview"));

        dom.mk('p',wrapper,_tr("Igaro App is a Javascript based framework for developing scalable, responsive and dynamic web and mobile applications."));

        dom.mk('li',wrapper,_tr("Promotes best practice - write great code even if you're not an expert."));

        dom.mk('li',wrapper,_tr("Very easy to learn - Igaro App is standard Object Orientated Javascript."));

        dom.mk('li',wrapper,_tr("Excellent for teamwork - automates compile, debug and deploy workflows."));

        dom.mk('li',wrapper,_tr("Outperforms other frameworks - cutting edge features, error handling and smart logic."));

        dom.mk('h1',wrapper,_tr("Where"));

        dom.mk('p',wrapper,_tr("Igaro App can be served to a web browser, distributed through an app store, or bundled on removeable media. It works great on monitors, tablets. phones and everything inbetween."));
  
        dom.mk('div',wrapper,null,'viewport');

        dom.mk('h1',wrapper,_tr("Goals"));

        return model.managers.object.create('table', { 
            container:dom.mk('p',wrapper),
            header : {
                rows : [
                    {
                        columns : [
                            {
                                content : _tr("Domain")
                            },
                            {
                                content : _tr("Details")
                            },
                            {
                                content : _tr("Status")
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
                                content : _tr("Security")
                            },
                            {
                                content : _tr("No public variables. Military-grade security. No memory leaks. Automatic oAuth initilization with Promise replay.")
                            },
                            {
                                className : 'green'
                            }
                        ]
                    },
                    {
                        columns : [
                            {
                                content : _tr("Locale")
                            },
                            {
                                content : _tr("Multi-language support via PO files. Realtime language switching. Multi-currency, date w/offset, and country functionality.")
                            },
                            {
                                className : 'green'
                            }
                        ]
                    },
                    {
                        columns : [
                            {
                                content : _tr("Testing")
                            },
                            {
                                content : _tr("Automated test suite exhaustively testing all features across all modules.")
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