//# sourceURL=route.main.design.js

module.requires = [
    { name: 'route.main.design.css' }
];

module.exports = function() {

    "use strict";

    return function(model) {

        var wrapper = model.wrapper,
            domMgr = model.managers.dom;

        model.stash.title=_tr("Design");
        model.stash.description=_tr("Only the best frameworks can do away with HTML. No templates or MVC, instead consistency and staggering performance.");

        domMgr.mk('p',wrapper,_tr("Igaro App used <b>no HTML templating</b>, meaning operations that cause performance penalties; getElementById, getElementsByClassName, getElementsByTagName, querySelector[all], wont slow down your app."));

        domMgr.mk('p',wrapper,_tr("Until recently the trend was to decouple JavaScript from HTML using data binding (Angular) and later to redraw containers (React). Igaro goes one step further by directly associating HTML containers with JavaScript objects, in effect removing the need for HTML and shifting the style aspect over to smart CSS selectors."));

        domMgr.mk('h1',wrapper,_tr("Templates"));

        domMgr.mk('p',wrapper, _tr("Igaro App has no template engine (you are free to use one if you must). Instead it uses the concept of routes to build partials (non-navable) and pages (navable). On the downside, Igaro App is less suited for development teams that use casual developers to do templating work."));

        domMgr.mk('h1',wrapper,_tr("DOM"));

        domMgr.mk('p',wrapper,_tr("The <b>core.dom</b> module provides functionality and a manager (for blessed objects). These are used to cut down on repetitive DOM manipulation work and permit the creation of elements while setting attributes, events and insertion in one go."));

        domMgr.mk('p',wrapper,_tr("The <b>mk</b> function creates elements, appends (or inserts before or after), sets content (which can be a language literal) or appends other elements into it, and sets the className or accepts a function to provide further control."));

        domMgr.mk('p',wrapper,_tr("The module is little more than sugar for the native DOM API, which you are still recommended to use where it makes sense to do so. It doesn't aim to replace the API (aka jQuery), so there's no className manipulation - which is where you'd use the standard <b>Element.classList</b> API."));

        domMgr.mk('pre',wrapper,domMgr.mk('code',null,"model.managers.dom.mk('p',wrapper,_tr(\"Localized string\"),'myClassName');\
\n\
\nmodel.managers.dom.mk('a',wrapper,_tr(\"Store\"),function() {\
\n  this.className='store'\
\n  this.addEventListener('click',function(event) {\
\n      event.preventDefault();\
\n      router.to(['store']);\
\n  }\
\n});"));

        domMgr.mk('p',wrapper,null,function() {

            domMgr.mk('button',this,_tr("Next Chapter - Routes")).addEventListener('click',function() {

                model.parent.to(['routes']);
            });
        });

    };

};
