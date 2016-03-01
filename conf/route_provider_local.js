// adds route.* files as a route provider
router.addProvider({
    handles : function() {

        return true;
    },
    url : params.repo,
    fetch : function(o) {

        var name = o.path.join('.');
        return new Amd().get({

            modules:[{ name: name+'.js' }]
        }).then(function() {

            if (! app[name])
                throw {
                    msg:'invalid route file',
                    route:name
                };
            return {
                js: app[name]
            };
        });
    }
});
