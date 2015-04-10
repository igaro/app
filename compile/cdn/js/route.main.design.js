(function() {

"use strict";

module.requires = [
    { name: 'route.main.design.css' }
];

module.exports = function(app) {

    return function(model) {

        var view = model.view,
            wrapper = model.wrapper,
            domMgr = model.managers.dom;

        model.stash.title=_tr("Design");

        domMgr.mk('p',wrapper,_tr("This page explains a little bit about the design principles employed in Igaro App (by Design, we're talking about what you see on a page)."));

        domMgr.mk('p',wrapper,_tr("After reading this information we strongly recommend looking at the code used to generate this page."));

        domMgr.mk('h1',wrapper,_tr("Templates"));
         
        domMgr.mk('p',wrapper, _tr("Igaro App has no template engine, relying instead on reuseable modules and first-class CSS to define layout, not just design."));

        domMgr.mk('h2',wrapper,_tr("Why?"));

        domMgr.mk('p',wrapper, _tr("Separating designers and developers by having designers generate HTML and CSS and developers insert the logic is nothing new, but in reality designers end up producing questionable code which doesn't work well with logic, and developers playing catch up while overly frustrated at the way the design doesn't cater for logic they need to stick in."));

        domMgr.mk('p',wrapper, _tr("With Igaro App designers write routes, style it in CSS and hand it over for logic insertion. In other words, both use the same technology. Both are literally, on the same page."));

        domMgr.mk('p',wrapper, _tr("For widgets, or reusable code, developers write the code and designers style it."));

        domMgr.mk('p',wrapper, _tr("Finally, this method renders much faster. It's one of the reasons why Igaro App is so fast."));

        domMgr.mk('h1',wrapper,_tr("core.dom"));

        domMgr.mk('p',wrapper,_tr("Shorthand DOM element creation and appendation are provided by core.dom. Blessed objects gain a core.dom manager which handles dependency tracking (i.e .destroy() your model and the dom elements disappear).")); 

        domMgr.mk('h2',wrapper, '<s>.getElementById, .getElementsByClassName, .getElementsByTagName, .querySelector[all]</s>');

        domMgr.mk('p',wrapper,_tr("The DOM is only used for output, it isn't traversed. These functions are used when references to DOM elements are sought. Instead, references are stored within instances, on routes, and as dependencies. Don't use these slow routines - they are designed for HTML."));

    };

};

})();
