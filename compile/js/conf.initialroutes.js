module.requires = [
    { name:'core.mvc.js' }
];

module.exports = function(app) {

    // on core ready
    app['core.events'].on('core','ready.init', function(o) {

        // adds route.* files as a model source
        var mvc = app['core.mvc'], mvcrc = mvc.root.children, mvcv = mvc.root.view, protocol = document.location.protocol;

        // load initial models
        mvcrc.add({ list:['header','location','main','footer'] }).then(function(m) {
            m.forEach(function(x) { var v = x.view; if (v.autoShow) v.show() });
            if (protocol !== 'file:') {
                var p = window.location.pathname.substr(1);
                if (p.length) p = '/'+p;
                else return;
                mvc.to(m[2].path+p);
            }
        });

        // popstate handler
        if (protocol !== 'file:') {
            window.addEventListener('popstate', function(evt) {
                var p = window.location.pathname === '/'? '' : window.location.pathname;
                // find model view that matches this path
                mvc.to('/main'+p, true);
            });
        }

    });
};