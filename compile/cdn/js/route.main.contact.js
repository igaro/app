//# sourceURL=route.main.contact.js

module.requires = [
    { name: 'route.main.contact.css' }
];

module.exports = function() {

    "use strict";

    return function(model) {

        var domMgr = model.managers.dom,
            wrapper = model.wrapper;

        model.stash.title= _tr("Contact");

        domMgr.mk('p',wrapper,_tr("Persons actively involved in Igaro App development have an email which is the quoted value found by their name followed by @igaro.com."));

        domMgr.mk('h1',wrapper,_tr("Lead Developers"));

        domMgr.mk('p',wrapper,
            domMgr.mk('ul',null,[
                ["Andrew Charnley","ac"]
            ].map(function(o) {
                return domMgr.mk('li',null,o[0] + ' "'+o[1]+'"');
            }))
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
