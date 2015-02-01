(function() {

"use strict";

module.requires = [
    { name: 'route.main.design.css' }
];

module.exports = function(app) {

    return function(model) {

        var view = model.view;
        var wrapper = model.wrapper;

        model.setMeta('title', {"fr":"","en":"Design"});

        dom.mk('p',wrapper,{"fr":"","en":"Igaro App offers a flexible design where everything is customizable, with structured SASS and folders to bootstrap your product."});

        dom.mk('h1',wrapper, {"fr":"","en":"Router"});

        dom.mk('p',wrapper,{"fr":"","en":"Igaro App isn't MVC. Traditionally, frameworks start with a view, assign a controller and this contains a model."});

        dom.mk('p',wrapper,{"fr":"","en":"Igaro App has a router, which begins at root, and loads route files. Route files encapsulate logic (controller) and are provided with a model template. They build the content of a view by either writing to the DOM or calling reuseable instance files."});

        dom.mk('p',wrapper,{"fr":"","en":"Multiple routes can be visible as a route doesn't necessarily have to be a navable via URL. Thus, the header, main and footer of a page are all routes. A route has children and events are propagated to parents."});

        dom.mk('p',wrapper,{"fr":"","en":"By default a route's view is appended to the parent route's view and fellow siblings are hidden. Routes are cached so if the user navigates to a different view outside of the current hierarchy they can return to it later with the same state."});

        dom.mk('p',wrapper,{"fr":"","en":"The router can be configured to use multiple sources. This app has routes defined through routes.* files but routing rules permit loading from a CDN (i.e close to the user's location) or an API (for dynamic views or secure content delivery) on a per request basis."});

        dom.mk('h2', wrapper,{"fr":"","en":"Example"});

        dom.mk('p',wrapper,null, function() {

            dom.mk('h3',this,{"fr":"","en":"/news"});
            
            dom.mk('div',this,null,function() {
                this.className = 'viewblock';
                dom.mk('span',this,{"fr":"","en":"Root"});
                dom.mk('div',this,{"fr":"","en":"Header"});
                dom.mk('div',this,null, function() {
                    dom.mk('span',this,{"fr":"","en":"Main"});
                    dom.mk('div',this,{"fr":"","en":"News content"});
                });
                dom.mk('div',this,{"fr":"","en":"footer"});
            });
        });

        dom.mk('h1',wrapper,dom.mk('s',null,{"fr":"","en":"Templates"}));
         
        dom.mk('p',wrapper, {"fr":"","en":"Igaro App has no template engine, relying instead on reuseable modules and first-class CSS structure to define layouts. It's a radical way of working, but you'll love it!"});

        dom.mk('h1',wrapper,{"fr":"","en":"DOM"});

        dom.mk('p',wrapper,{"fr":"","en":"core.dom provides DOM management, dependency tracking and event linkage. Any blessed object gains a core.dom manager. This manager works alongside the native DOM controls, and unlike JQuery it doesn't provide duplicatate functionality. It helps you to write highly structured, minimal code."});

        dom.mk('h2',wrapper, '<s>.getElementById, .getElementsByClassName, .getElementsByTagName and .querySelector[all]</s>');

        dom.mk('p',wrapper,{"fr":"","en":"These slow traversal routines are applicable when references to DOM elements are sought. With Igaro App references are stored within instances, on router models, and as dependencies. Subsequently, expect blistering performance compared to competing frameworks such as Angular and React."});

    };

};

})();