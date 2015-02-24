(function() {

"use strict";

module.requires = [
    { name:'route.location.css' },
    { name:'core.language.js' }
];

module.exports = function(app) {

    var language = app['core.language'],
        router = app['core.router'];

    return function(model) {

        var dom = model.managers.dom,
            wrapper = dom.mk('div',model.wrapper);
            
        //model.autoShow=false;

        dom.mk('a',wrapper,null,function() {
            this.className = 'home';
            this.href = '';
            this.addEventListener('click', function(evt) { 
                evt.preventDefault(); 
                router.to([]); 
            });
        });

        // location
        dom.mk('div',wrapper,null, function() {
            var self = this,
                paths = dom.mk('div',this,null,'paths'),
                params = dom.mk('div',this,null,'params'),
                paramsw = dom.mk('div',params);

            this.className = 'location';
            dom.hide(params);
            router.managers.event
                .on('to-start', function() {
                    dom.hide(params);
                })
                .on('to-in-progress', function() {
                    if (! router.isAtBase()) {
                        model.show();
                        dom.empty(paths);
                        dom.empty(paramsw);
                        var c = router.current;
                        while (! c.isBase()) {
                            var m = dom.mk(c === router.current? 'span':'a',null, c.meta.title || c.name);
                            if (c !== router.current) {
                                m.href='#!/'+c.getUrl();
                                var b = c.uriPath;
                                m.addEventListener('click', function(evt) {
                                    evt.preventDefault();
                                    router.to(b); 
                                });
                            }
                            //var acc = c.meta.account;
                            //if (acc) {
                            //    dom.show(params);
                            //    dom.mk('span', paramsw, acc.id);
                            //}
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
