(function () {

"use strict";

module.requires = [
    { name: 'route.main.support.css' },
    { name: 'core.language.js' }
];

module.exports = function(app) {

    return function(model) {

        var dom = model.managers.dom,
            wrapper = model.wrapper;

        model.setMeta('title', {"fr":"","en":"Support"});

        dom.mk('p',wrapper,{"fr":"","en":"Igaro App is supported by a small but growing amount of developers. You can open and view issues on the github tracker or offer suggestions on the trello board."});

        dom.mk('p',wrapper, 
            [
                [ 
                    {"fr":"","en":"Report Issue"},
                    'https://github.com/igaro/app/issues'
                ],
                [
                    {"fr":"","en":"Offer Suggestion"},
                    'https://trello.com/igaro'
                ]
            ].map(function (n) {
                return dom.mk('button',null,n[0],function() {
                    this.addEventListener('click', function() {
                        window.open(n[1]);
                    });
                });
            })
        );

        dom.mk('h1',wrapper,{"fr":"","en":"Community"});

        dom.mk('p',wrapper,{"fr":"","en":"Until Igaro API is up and running we've set up a forum. This is the best place to ask questions. Stackoverflow is also a good source for help - be sure to include 'Igaro App' in your title!."});

        dom.mk('p',wrapper, 
            [
                [ 
                    {"fr":"","en":"Forum"},
                    'http://forum.igaro.com'
                ],
                [
                    {"fr":"","en":"StackOverflow"},
                    'https://stackoverflow.com'
                ]
            ].map(function (n) {
                return dom.mk('button',null,n[0],function() {
                    this.addEventListener('click', function() {
                        window.open(n[1]);
                    });
                });
            })
        );

        dom.mk('h1',wrapper,'IRC');

        dom.mk('p',wrapper,{"fr":"","en":"The <b>Freenode #igaro</b> channel is used by the developers to bounce around new ideas."});

        dom.mk('p',wrapper,{"fr":"","en":"If nobody is around ask your question and check back later for a reply."});

        dom.mk('h1',wrapper,{"fr":"","en":"Priority Service"});
        
        dom.mk('p',wrapper,{"fr":"","en":"The priority service is offered to those requiring a guaranteed service level."});

        dom.mk('p',wrapper,{"fr":"","en":"Members receive a unique email address and a response within a pre-agreed time frame."});
        
        dom.mk('button',wrapper,{"fr":"","en":"Enquire"}, function() {
            this.addEventListener('click', function() {
                window.open('mailto:support@igaro.com');
            });
        }); 

    };

};

})();
