//# sourceURL=route.location.js

module.requires = [
    { name:'route.location.css' }
];

module.exports = function(app) {

    "use strict";

    var router = app['core.router'],
        dom = app['core.dom'];

    return function(model) {

        var domMgr = model.managers.dom,
            wrapper = domMgr.mk('div',model.wrapper);

        domMgr.mk('a',wrapper,null,function() {
            this.className = 'home';
            this.href = '/';
            this.addEventListener('click', function(event) {
                event.preventDefault();
                router.to([]);
            });
        });

        model.autoShow = false;
        model.hide();

        // location
        domMgr.mk('div',wrapper,null, function() {
            var paths = domMgr.mk('div',this,null,'paths'),
                params = domMgr.mk('div',this,null,'params'),
                paramsw = domMgr.mk('div',params);

            this.className = 'location';
            dom.hide(params);
            router.managers.event
                .on('to-start', function() {
                    dom.hide(params);
                }, { deps:[model] })
                .on('to-in-progress', function() {
                    if (! router.isAtBase()) {
                        model.show();
                        dom.empty(paths);
                        dom.empty(paramsw);
                        var c = router.current,
                            eF=function(event) {
                                event.preventDefault();
                                router.to(b);
                            };
                        while (! c.isBase()) {
                            var m = domMgr.mk(c === router.current? 'span':'a',null, c.stash.title || c.name);
                            if (c !== router.current) {
                                m.href=c.getUrl();
                                var b = c.uriPath;
                                m.addEventListener('click', eF);
                            }
                            paths.insertBefore(m,paths.firstChild);
                            c = c.parent;
                        }
                    } else {
                        model.hide();
                    }
                }, { deps:[model] })
            ;
        });

    };

};
