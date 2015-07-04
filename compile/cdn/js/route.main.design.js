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

        domMgr.mk('p',wrapper,_tr("Igaro App is <b>100%</b> HTML free."));

        domMgr.mk('p',wrapper, _tr("<s>.getElementById, .getElementsByClassName, .getElementsByTagName, .querySelector[all]</s> are designed for HTML and are slow. Don't use them."));

        domMgr.mk('h1',wrapper,_tr("Templates"));

        domMgr.mk('p',wrapper, _tr("Igaro App has no template engine, instead it uses routes to build entire pages and partials, and excellent CSS for design and layout."));

        domMgr.mk('p',wrapper, _tr("Eliminating HTML results in smarter code, consistency, higher rendering performance and no need for data binding."));

        domMgr.mk('h1',wrapper,_tr("core.dom"));

        domMgr.mk('p',wrapper,_tr("Shorthand DOM element creation and appendation are provided by the core.dom module. Blessed objects gain a core.dom manager, which handles dependency tracking (i.e .destroy() your model and the dom elements disappear)."));

        domMgr.mk('p',wrapper,_tr("The .mk() function provided by core.dom creates elements, appends (or inserts before or after), sets content (can be a language literal) or appends other elements into it, and either sets the className or accepts a function."));

        domMgr.mk('pre',wrapper,domMgr.mk('code',null,"model.managers.dom.mk('p',wrapper,_tr(\"Localized string\"),'myClassName');\
\n\
\nmodel.managers.dom.mk('a',wrapper,_tr(\"Store\"),function() {\
\n  this.className='store'\
\n  this.addEventListener('click',function(event) {\
\n      event.preventDefault();\
\n      router.to(['store']);\
\n  }\
\n});"));
    };

};
