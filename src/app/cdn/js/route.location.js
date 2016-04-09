//# sourceURL=route.location.js

(function(env) {

    "use strict";

    module.requires = [
        { name:'route.location.css' }
    ];

    module.exports = function(app) {

        var router = app['core.router'],
            dom = app['core.dom'],
            coreUrl = app['core.url'];

        return function(model) {

            var domMgr = model.managers.dom,
                wrapper = domMgr.mk('div',model.wrapper);

            // home
            domMgr.mk('a',wrapper,null,function() {

                var url = coreUrl.fromComponents([]);
                this.className = 'home';
                this.href = url.toString();
                this.addEventListener('click', function(event) {

                    event.preventDefault();
                    router.to(url);
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
                    .on('to-in-progress', function(loaded) {

                        if (! loaded.isAtBase()) {

                            model.show();
                            dom.empty(paths);
                            dom.empty(paramsw);

                            var c = loaded,
                                isThisCurrent = true;

                            while (! c.isAtBase()) {

                                domMgr.mk(isThisCurrent? 'span':'a',null,c.stash.title || c.name,function() {

                                    if (! isThisCurrent) {

                                        var url = c.getUrl();
                                        this.href = url.toString();
                                        this.addEventListener('click',function(event) {

                                            event.preventDefault();
                                            router.to(url);
                                        });
                                    }
                                    paths.insertBefore(this,paths.firstChild);
                                });

                                c = c.parent;
                                isThisCurrent = false;
                            }
                        } else {

                            model.hide();
                        }
                    }, { deps:[model] })
                ;
            });

        };

    };

})(this);
