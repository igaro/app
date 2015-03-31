(function() {

"use strict";

module.requires = [
    { name: 'route.main.routes.css' }
];

module.exports = function(app) {

    return function(model) {

        var view = model.view,
            wrapper = model.wrapper,
            domMgr = model.managers.dom;

        model.setMeta('title', _tr("Routes"));

        domMgr.mk('p',wrapper,_tr("Igaro App isn't MVC. This article explains how pages are built."));

        domMgr.mk('h1',wrapper,_tr("core.router"));

        domMgr.mk('p',wrapper,_tr("The router begins at root and loads further routes. Routes encapsulate logic (controller and a model). They build the content of a view by either writing to the DOM or calling instance files (widgets) for common features."));

        domMgr.mk('p',wrapper,_tr("By default a route's view is appended into the parent route's view and fellow siblings are hidden. Routes are cached so that if the user navigates to a route outside of the current hierarchy and return later it will have retained state."));

        domMgr.mk('p',wrapper,_tr("The following example demonstrates a small portion of this app. Each box is a route."));

        domMgr.mk('p',wrapper,null, function() {

            domMgr.mk('div',this,null,function() {
                this.className = 'viewblock';
                domMgr.mk('span',this,_tr("Root"));
                domMgr.mk('div',this,_tr("Header"));
                domMgr.mk('div',this,null, function() {
                    domMgr.mk('span',this,_tr("Main"));
                    domMgr.mk('div',this,_tr("Overview"));
                    domMgr.mk('div',this,_tr("Features"));
                    domMgr.mk('div',this,_tr("Install"));
                });
                domMgr.mk('div',this,_tr("footer"));
            });
        });

        domMgr.mk('h1',wrapper,_tr("URL"));

        domMgr.mk('p',wrapper,_tr("The URL contains route and URI data. A route tells the router to capture URI data, which is then returned and stored on the route."));

        domMgr.mk('h2',wrapper,_tr("Example"));

        domMgr.mk('pre',wrapper,'/books/73434348/pages/23');

        domMgr.mk('p',wrapper,_tr("For the URL below 'books' and 'pages' are routes. The book route must capture the book id and show details of the book. The router then ignores this id and knows that pages is also a route. This does the same, and so on."));

        domMgr.mk('p',wrapper,_tr("The router doesn't load routes directly. Instead it asks a provider which has preregistered itself as a handle for particular (or all) routes, and which when called returns the location of the route. Thus, the books route could be loaded from a web server in one location, while pages could load from an API in another. This is transparent to the user and forms the basis of Igaro App's ability to serve dynamic content from an API."));

        domMgr.mk('p',wrapper,_tr("Uri data for a route is stored under .uriPath. This allows for quick hyperlinking to child routes."));

        domMgr.mk('h1', wrapper,_tr("Route Data [Files/API]"));

        domMgr.mk('p',wrapper,_tr("Simple routes print data to a page (see the code behind this one). More complicated routes may contain an init function that runs the first time the route is loaded, and an enter function that runs when the route is viewed."));

        domMgr.mk('p',wrapper,_tr("By default routes save state (aka are cached) but this is overrideable."));

        domMgr.mk('h1', wrapper,_tr("Finally..."));

        domMgr.mk('p',wrapper,_tr("A route doesn't need to load via the URL. A route can load children without using the router. This can be useful for embedding multiple view/panes, especially when they are shared among routes."));






    };

};

})();
