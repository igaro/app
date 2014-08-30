module.requires = [
    { name:'core.mvc.js' }
];

module.exports = function(app,op) {

    var amd = app['instance.amd'];

    // adds route.* files as a model source
    app['core.mvc'].source.append({
        defaultCacheLevel:2,
        handles:function(path) { return true },
        url : op.repo,
        viewPath:function(path) {
            var p = path.substr(6);
            if (p.length || path === '/main') return p;
            return false;
        }, 
        fetch:function(o) {
            return new Promise(function(resolve, reject) {
                var name = 'route'+ o.model.path.replace(/\//g,'.');
                (new amd).get({
                    repo:op.repo, 
                    modules:new Array({ name: name+'.js' })
                }).then(
                    function() {
                        if (! app[name]) reject('File has no view!');
                        else resolve({ js: app[name] });
                    },
                    reject
                );
            });
        }
    });

};

