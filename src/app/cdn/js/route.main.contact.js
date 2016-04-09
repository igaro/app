//# sourceURL=route.main.contact.js

module.requires = [
    { name: 'route.main.contact.css' }
];

module.exports = function() {

    "use strict";

    return function(model) {

        var domMgr = model.managers.dom,
            wrapper = model.wrapper;

        model.stash.title= function(l) { return l.gettext("Contact"); };

        domMgr.mk('p',wrapper,function(l) { return l.gettext("Persons actively involved in Igaro App development have an email which is the quoted value found by their name followed by @igaro.com."); });

        domMgr.mk('h1',wrapper,function(l) { return l.gettext("Lead Developers"); });

        domMgr.mk('p',wrapper,
            domMgr.mk('ul',null,[
                ["Andrew Charnley","ac"]
            ].map(function(o) {
                return domMgr.mk('li',null,o[0] + ' "'+o[1]+'"');
            }))
        );

        domMgr.mk('h1',wrapper,'IRC');

        domMgr.mk('p',wrapper,function(l) { return l.gettext("The <b>Freenode #igaro</b> channel is used by the developers to bounce around new ideas."); });

        domMgr.mk('p',wrapper,function(l) { return l.gettext("If nobody is around ask your question and check back later for a reply."); });

        domMgr.mk('h1',wrapper,function(l) { return l.gettext("Priority Service"); });

        domMgr.mk('p',wrapper,function(l) { return l.gettext("The priority service is offered to those requiring a guaranteed service level."); });

        domMgr.mk('p',wrapper,function(l) { return l.gettext("Members receive a unique email address and a response within a pre-agreed time frame."); });

        domMgr.mk('button',wrapper,function(l) { return l.gettext("Enquire"); }, function() {
            this.addEventListener('click', function() {
                window.open('mailto:support@igaro.com');
            });
        });

    };

};
