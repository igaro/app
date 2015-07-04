//# sourceURL=route.main.showcase.todomvc.js

(function () {

"use strict";

module.requires = [
    { name: 'route.main.showcase.todomvc.css' }
];

module.exports = function() {

    return function(model) {

        var wrapper = model.wrapper,
            domMgr = model.managers.dom;

        model.stash.title=_tr("TodoMVC");
        model.stash.description=_tr("An example of the TodoMVC Widget.");

        domMgr.mk('p',wrapper,_tr("The TodoMVC project aims to compare Frameworks."));

        domMgr.mk('p',wrapper,_tr("The code for this widget isn't documented but is relatively easy to follow."));

        domMgr.mk('p',wrapper,null,function() {
            domMgr.mk('button',this,"TodoMVC").addEventListener('click',function() {
                window.open('http://www.todomvc.com');
            });
            domMgr.mk('button',this,"instance.todomvc.js").addEventListener('click',function() {
                window.open('https://github.com/igaro/app/blob/master/compile/cdn/js/instance.todomvc.js');
            });
            domMgr.mk('button',this,"instance.todomvc.scss").addEventListener('click',function() {
                window.open('https://github.com/igaro/app/blob/master/sass/scss/instance.todomvc.scss');
            });
        });

        domMgr.mk('h1',wrapper,_tr("Spec Divergence"));

        domMgr.mk('p',wrapper,
            domMgr.mk('ul',null,[
                domMgr.mk('li',null,_tr("The CSS has been improved using CSS3 selectors.")),
                domMgr.mk('li',null,_tr("The CSS input overlays have bee removed (they didn't work well in Firefox).")),
                domMgr.mk('li',null,_tr("The delete button doesn't use :hover, as touch users wont see it.")),
                domMgr.mk('li',null,_tr("Item edit uses contentEditable instead of a separate input[text] element."))
            ])
        );

        domMgr.mk('h1',wrapper,_tr("Limitations"));

        domMgr.mk('p',wrapper,
            domMgr.mk('ul',wrapper,[
                domMgr.mk('li',null,_tr("It doesn't use Igaro App's multi-language features (English only).")),
                domMgr.mk('li',null,_tr("It will show the same todo items across all routes (it doesn't support a route having unique items).")),
                domMgr.mk('li',null,_tr("Routing for filters isn't implemented.")),
            ])
        );

        domMgr.mk('h1',wrapper,_tr("Demo"));

        return model.managers.object.create('todomvc', { container:wrapper });

    };

};

})();
