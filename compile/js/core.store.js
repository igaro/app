module.requires = [
    { name:'core.debug.js' }
];

module.exports = function(app) {

    var events = app['core.events'];
    var debug = app['core.debug']

    return new function() {
        this.set = function (name,id,value,o) {
            var type = o && o.type? o.type : 'local';
            var expiry = o && o.expiry? o.expiry.getTime() : null;
            var uid = name+':'+id; 
            if (type === 'cookie') {
                if (typeof value === 'undefined') {
                    document.cookie = uid + '=\'\';path=/;expires=Sun, 17-Jan-1980 00:00:00 GMT;\n';
                } else {
                    value = JSON.stringify(value);
                    document.cookie = uid +'='+(expiry === null? +escape(value)+';path=/;\n' : escape(value)+';path=/;expires='+expiry+';\n');
                }
            } else {
                value = typeof value === 'undefined' || value === null? null : JSON.stringify({ value:value, expiry:expiry });
                if (type === 'local') {
                    try { return localStorage.setItem(uid,value); } catch (e) { return e; }
                } else if (type === 'session') {
                    try { return sessionStorage.setItem(uid,value); } catch (e) { return e; }
                }
            }
            events.dispatch('core.store','set', { name:name, id:id, value:value });
            return true;
        };
        this.get = function (name,id,o) {
            var oid = name+':'+id; 
            var type = o && o.type? o.type : 'local';
            if (type === 'cookie') {
                oid = oid + '='; var j = -1; var done = false; var t;
                while ((j < document.cookie.length) && done == false) { j++;
                    if (document.cookie.substring(j, j + oid.length) != oid) continue;
                    var k = 0; var x = 'a';
                    while (x != '' && x != ';') { k++; x = document.cookie.substring(j + oid.length + k, j + oid.length + k - 1); }
                    t = unescape(document.cookie.substring(j + + oid.length, j + oid.length + k - 1));
                    done = true;
                }
                return t? t : null;   
            } else {
                var v;
                try { 
                    if (type === 'local') {
                        var l = localStorage.getItem(oid);
                        if (l) v = JSON.parse(l); 
                    } else if (type === 'session') {
                        var s = sessionStorage.getItem(oid);
                        if (s) v = JSON.parse(l);
                    }
                    if (! v) return null;
                    if (v.expiry && v.expiry < new Date().getTime()) {
                        this.set(name,id,null);
                        return null;
                    }
                    return v.value;
                }
                catch (e) { debug.log.append({ module:'core.store', action:'get', error:e }) }
            }
            return null;
        };
    };

};
