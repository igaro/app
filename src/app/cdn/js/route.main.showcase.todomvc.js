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

        model.stash.title=function() { return this.tr((({ key:"TodoMVC" }))); };
        model.stash.description=function() { return this.tr((({ key:"An example of the TodoMVC Widget." }))); };

        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"The TodoMVC project aims to compare Frameworks." }))); });

        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"The code for this widget isn't documented but is relatively easy to follow." }))); });

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

        domMgr.mk('h1',wrapper,function() { return this.tr((({ key:"Spec Divergence" }))); });

        domMgr.mk('p',wrapper,
            domMgr.mk('ul',null,[
                domMgr.mk('li',null,function() { return this.tr((({ key:"The CSS has been improved using CSS3 selectors." }))); }),
                domMgr.mk('li',null,function() { return this.tr((({ key:"The CSS input overlays have bee removed (they didn't work well in Firefox)." }))); }),
                domMgr.mk('li',null,function() { return this.tr((({ key:"The delete button doesn't use :hover, as touch users wont see it." }))); }),
                domMgr.mk('li',null,function() { return this.tr((({ key:"Item edit uses contentEditable instead of a separate input[text] element." }))); })
            ])
        );

        domMgr.mk('h1',wrapper,function() { return this.tr((({ key:"Limitations" }))); });

        domMgr.mk('p',wrapper,
            domMgr.mk('ul',wrapper,[
                domMgr.mk('li',null,function() { return this.tr((({ key:"Routing for filters isn't implemented." }))); })
            ])
        );

        domMgr.mk('h1',wrapper,function() { return this.tr((({ key:"Demo" }))); });

        return model.managers.object.create('todomvc', { container:wrapper });

    };

};

})();
