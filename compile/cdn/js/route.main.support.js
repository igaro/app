(function () {

"use strict";

module.requires = [
    { name: 'route.main.support.css' }
];

module.exports = function(app) {

    return function(model) {

        var domMgr = model.managers.dom,
            wrapper = model.wrapper;

        model.stash.title= _tr("Support");

        domMgr.mk('p',wrapper,_tr("Igaro App is supported by a small but growing amount of developers. You can open and view issues on the github tracker or offer suggestions on the trello board."));

        domMgr.mk('p',wrapper, 
            [
                [ 
                    _tr("Report Issue"),
                    'https://github.com/igaro/app/issues'
                ],
                [
                    _tr("Offer Suggestion"),
                    'https://trello.com/igaro'
                ]
            ].map(function (n) {
                return domMgr.mk('button',null,n[0],function() {
                    this.addEventListener('click', function() {
                        window.open(n[1]);
                    });
                });
            })
        );

        domMgr.mk('h1',wrapper,_tr("Community"));

        domMgr.mk('p',wrapper,_tr("Until Igaro API is up and running we've set up a forum. This is the best place to ask questions. Stackoverflow is also a good source for help - be sure to include 'Igaro App' in your title!."));

        domMgr.mk('p',wrapper, 
            [
                [ 
                    _tr("Forum"),
                    'http://forum.igaro.com'
                ],
                [
                    _tr("StackOverflow"),
                    'https://stackoverflow.com'
                ]
            ].map(function (n) {
                return domMgr.mk('button',null,n[0],function() {
                    this.addEventListener('click', function() {
                        window.open(n[1]);
                    });
                });
            })
        );

        domMgr.mk('h1',wrapper,'IRC');

        domMgr.mk('p',wrapper,_tr("The <b>Freenode #igaro</b> channel is used by the developers to bounce around new ideas."));

        domMgr.mk('p',wrapper,_tr("If nobody is around ask your question and check back later for a reply."));

        domMgr.mk('h1',wrapper,_tr("Priority Service"));
        
        domMgr.mk('p',wrapper,_tr("The priority service is offered to those requiring a guaranteed service level."));

        domMgr.mk('p',wrapper,_tr("Members receive a unique email address and a response within a pre-agreed time frame."));
        
        domMgr.mk('button',wrapper,_tr("Enquire"), function() {
            this.addEventListener('click', function() {
                window.open('mailto:support@igaro.com');
            });
        }); 

    };

};

})();
