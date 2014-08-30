module.requires = [
    { name:'core.mvc.js' }
];

module.exports = function(app) {

    var api = 'http://api.'+l+'.'+window.location.hostname+'/igaro_cgi.pl?';

    app['core.mvc'].source.append({
        handles:function(path) { return true },
        fetch:function(o) {
            var resource = o.resource;
            var name = 'route'+ resource.replace(/\//g,'.');
            var c = new app['instance.xhr']({
                withCredentials:true,
                resource: api+v.resource,
            });
            c.promise.then(
                o.onCompletion,
                o.onError
            );
            return c;
        }
    });

};
