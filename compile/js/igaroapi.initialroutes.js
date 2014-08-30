module.requires = [
    { name:'igaroapi.corecontrollerroutefetch.js'},
    { name:'core.mvc' }
];

module.exports = function(app,params) {

    var events = app['core.events'];

    events.on('core','ready.init', function(o) {

        var onError = o.onError? o.onError : null;
        var onProgress = o.onProgress? o.onProgress : null;
        var onCompletion = o.onCompletion? o.onCompletion : null;

        // load controller
        var mo = app['core.mvc'];
        mo.root.load({
            onCompletion:function(m, data) {
                data.modules.forEach( function(w) {
                    mo.root.children.add({ name:w, onError:onError, onCompletion: function() {
                        if (onProgress) onProgress(Math.round((mo.root.children.loaded.length/data.modules.length)*100));
                        if (mo.root.children.loaded.length !== data.modules.length) return;
                        var h = setInterval(function() {
                            if (mo.root.children.loading.sum() > 0) return;
                            mo.to(window.location.pathname.substr(mo.path.length));
                            clearInterval(h);
                        }, 100);
                    }});
                });
            },
            onError:onError
        });

    });

};

