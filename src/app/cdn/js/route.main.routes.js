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

        model.stash.title=function() { return this.tr((({ key:"Routes" }))); };
        model.stash.description=function() { return this.tr((({ key:"Igaro App's router is dynamic and loads routes from file systems and API's. It's a beautiful way to serve pages be it for a website or a mobile app." }))); };

        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"Igaro App provides <b>core.router</b> to serve pages, and a page is represented by a navable route. A route contains display logic and events but doesn't necessarily have to be navable, which allows partials (parts of a page) to also be built from routes." }))); });

        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"By default routes are cached and retain state. State retention does not use <b>history.pushState</b>, and compatibiity is provided back to IE8." }))); });

        domMgr.mk('p',wrapper,null, function() {
            domMgr.mk('div',this,null,function() {
                this.className = 'viewblock';
                domMgr.mk('span',this,function() { return this.tr((({ key:"Root" }))); });
                domMgr.mk('div',this,function() { return this.tr((({ key:"Header" }))); });
                domMgr.mk('div',this,null, function() {
                    domMgr.mk('span',this,function() { return this.tr((({ key:"Main" }))); });
                    domMgr.mk('div',this,function() { return this.tr((({ key:"Overview" }))); });
                    domMgr.mk('div',this,function() { return this.tr((({ key:"Features" }))); });
                    domMgr.mk('div',this,function() { return this.tr((({ key:"Install" }))); });
                });
                domMgr.mk('div',this,function() { return this.tr((({ key:"footer" }))); });
            });
        });

        domMgr.mk('h1',wrapper,function() { return this.tr((({ key:"URL" }))); });

        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"A URL may contain a combination of route and URI data. A route instructs the router to capture URI data, which is in turn stored on the route." }))); });

        domMgr.mk('pre',wrapper,'/books/73434348/pages/23');

        domMgr.mk('pre',wrapper,domMgr.mk('code', null,"var uriPieces = route.captureUri(1);"));

        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"For the URL above 'books' and 'pages' are routes. The book route captures the book id. The router then skips this URI piece and loads 'pages' as a route." }))); });

        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"Although the path may look like a folder structure to the user, the actual location of these routes is determined by a provider. Providers allow multiple API's to serve routing data. There availability can be determined by any measure, which could be as simple as using a server closest to the users location." }))); });

        domMgr.mk('pre',wrapper,domMgr.mk('code', null,"app['core.router'].addProvider({\n\
    handles : function() {\n\
        return true;\n\
    },\n\
    url : params.repo,\n\
    fetch : function(o) {\n\
        var name = o.path.join('.');\n\
        return new Amd().get({\n\
            modules:[{ name: name+'.js' }]\n\
        }).then(function() {\n\
            if (! app[name])\n\
                throw {\n\
                    msg:'invalid route file',\n\
                    route:name\n\
                };\n\
            return {\n\
                js: app[name]\n\
            };\n\
        });\n\
    }\n\
});"));

        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"The simple provider code shown above handles any route by way of <b>instance.amd</b>, using the default repo as the location to load from." }))); });

        domMgr.mk('h1', wrapper,function() { return this.tr((({ key:"Navigation" }))); });

        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"<b>core.router</b> provides <b>to()</b> which is ideal for DOM event handlers as it contains built in error handling. The same function is available on routes for relative based navigation." }))); });

        domMgr.mk('pre',wrapper,domMgr.mk('code', null,"model.managers.dom.mk('a',wrapper,_tr(\"Store\")).addEventListener('click',function(event) {\
\n  event.preventDefault();\
\n  model.to(['store'],'welcome');\
\n});"));

        domMgr.mk('p',wrapper,null,function() {

            domMgr.mk('button',this,function() { return this.tr((({ key:"Next Chapter - Locale" }))); }).addEventListener('click',function() {

                model.parent.to(['locale']);
            });
        });

    };

};

})();
