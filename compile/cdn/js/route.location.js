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

        var wrapper = model.wrapper,
            dom = model.managers.dom;

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
            this.className = 'path';
            dom.hide(params);
            router.managers.event
                .on('to-start', function() {
                    params.classList.add('hide');
                })
                .on('to-in-progress', function() {
                    var c = router.current;
                    if (! c.isBase()) {
                        model.show();
                        dom.empty(paths);
                        dom.empty(paramsw);
                        while (! c.isBase()) {
                            var m = dom.mk(c === router.current? 'span':'a',null, c.getMeta('title') || c.name);
                            var f = c.path;
                            if (c !== router.current) {
                                m.href='#!/'+c.getUrl();
                                m.addEventListener('click', function(evt) {
                                    evt.preventDefault();
                                    router.to(f); 
                                });
                            }
                            var acc = c.getMeta('account');
                            if (acc) {
                                dom.show(params);
                                dom.mk('span', paramsw, acc.id);
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