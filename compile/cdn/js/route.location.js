(function() {

"use strict";

module.requires = [
    { name:'route.location.css' }
];

module.exports = function(app) {

    var router = app['core.router'];

    return function(model) {

        var domMgr = model.managers.dom,
            wrapper = domMgr.mk('div',model.wrapper);

        domMgr.mk('a',wrapper,null,function() {
            this.className = 'home';
            this.href = '/';
            this.addEventListener('click', function(evt) { 
                evt.preventDefault(); 
                router.to([]); 
            });
        });

        model.autoShow = false;
        model.hide();

        // location
        domMgr.mk('div',wrapper,null, function() {
            var self = this,
                paths = domMgr.mk('div',this,null,'paths'),
                params = domMgr.mk('div',this,null,'params'),
                paramsw = domMgr.mk('div',params);

            this.className = 'location';
            domMgr.hide(params);
            router.managers.event.extend(model)
                .on('to-start', function() {
                    domMgr.hide(params);
                })
                .on('to-in-progress', function() {
                    if (! router.isAtBase()) {
                        model.show();
                        domMgr.empty(paths);
                        domMgr.empty(paramsw);
                        var c = router.current;
                        while (! c.isBase()) {
                            var m = domMgr.mk(c === router.current? 'span':'a',null, c.stash.title || c.name);
                            if (c !== router.current) {
                                m.href=c.getUrl();
                                var b = c.uriPath;
                                m.addEventListener('click', function(evt) {
                                    evt.preventDefault();
                                    router.to(b); 
                                });
                            }
                            paths.insertBefore(m,paths.firstChild);
                            c = c.parent;
                        }
                    } else {
                        model.hide();
                    }
                })
            ;
        });

    };

};

})();
