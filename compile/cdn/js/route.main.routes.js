//# sourceURL=route.main.routes.js

(function() {

"use strict";

module.requires = [
    { name: 'route.main.routes.css' }
];

module.exports = function() {

    return function(model) {

        var wrapper = model.wrapper,
            domMgr = model.managers.dom;

        model.stash.title=_tr("Routes");
        model.stash.description=_tr("Igaro App's router is dynamic and loads routes from file systems and API's. It's a beautiful way to serve pages be it for a website or a mobile app.");

        domMgr.mk('p',wrapper,_tr("Igaro App is <b>100%</b> MVC free."));

        domMgr.mk('p',wrapper,_tr("Most users will use the core.router module to serve pages. This router is dynamic, it begins at root and loads further routes as children. A route builds content by either appending elements or embedding instances."));

        domMgr.mk('p',wrapper,_tr("By default a route's container is appended into the parent route's container and siblings are hidden. By default routes are cached and retain state."));

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

        domMgr.mk('pre',wrapper,'/books/73434348/pages/23');

        domMgr.mk('p',wrapper,_tr("For the example above 'books' and 'pages' are routes. The book route must capture the book id and show details of the book. The router then skips this id and loads pages as a route. This does the same, and so on."));

        domMgr.mk('p',wrapper,_tr("The router doesn't load routes directly. Instead it iterates a list of providers which handle one or more or all routes, and which when called returns the physically location of the route. Thus, the books route could be loaded from a web server in one location, while pages could load from an API in another. This is transparent to the user and forms the basis of Igaro App's ability to serve dynamic content from an API."));

        domMgr.mk('p',wrapper,_tr("URI data for a route is accessible on the route. This allows for quick hyperlinking to child routes."));

        domMgr.mk('h1', wrapper,_tr("Partials"));

        domMgr.mk('p',wrapper,_tr("A route can load child routes as partials without assigning a URL."));

        domMgr.mk('h1', wrapper,_tr("Navigation"));

        domMgr.mk('p',wrapper,_tr("The router provides .to() which is ideal for DOM event handlers. It contains a built in error handler. This function takes a path, search (?xxx), hash (#xxx) and state."));

        domMgr.mk('pre',wrapper,domMgr.mk('code', null,"model.managers.dom.mk('a',wrapper,_tr(\"Store\")).addEventListener('click',function(event) {\
\n  event.preventDefault();\
\n  router.to(['store'],'welcome');\
\n});"));

    };

};

})();
