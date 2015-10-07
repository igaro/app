//# sourceURL=core.store.js

module.exports = function() {

    "use strict";

    var CoreStoreMgr = function(parent) {
        this.parent = parent;
    };
    CoreStoreMgr.prototype.get = function(id,o) {
        var name = this.parent.name;
        return Promise.resolve().then(function() {
            var type = o && o.type? store.providers[o.type] : store.defaultProvider;
            if (! type)
                throw new Error('core.store -> invalid provider or default not set.',type);
            return type.get(name+':'+id,o);
        });
    };
    CoreStoreMgr.prototype.set = function(id,value,o) {
        var name = this.parent.name;
        return Promise.resolve().then(function() {
            var type = o && o.type? store.providers[o.type] : store.defaultProvider;
            if (! type)
                throw new Error('core.store -> invalid provider or default not set.',type);
            var expiry = o && o.expiry? o.expiry.getTime() : null;
            return type.set(name+':'+id,value,expiry,o);
        });
    };
    CoreStoreMgr.prototype.destroy = function() {
        this.parent = null;
    };

    var store = {

        defaultProvider : null,

        providers : [],

        createMgr : function(parent) {
            return new CoreStoreMgr(parent);
        },

        getProviderById : function(id) {
            return this.providers[id];
        },

        installProvider : function(id,o) {
            this.providers[id] = o;
        }
    };

    // cookie provider
    store.installProvider(
        'cookie',
        {
            get : function(id) {
                return Promise.resolve().then(function() {
                    id += '=';
                    var j = -1,
                        done = false,
                        t,
                        k,
                        x;
                    while ((j < document.cookie.length) && done === false) {
                        ++j;
                        if (document.cookie.substring(j, j + id.length) !== id)
                            continue;
                        k=0;
                        x='';
                        while (x !== '' && x !== ';') {
                            ++k;
                            x = document.cookie.substring(j + id.length + k, j + id.length + k - 1);
                        }
                        t = decodeURI(document.cookie.substring(j + id.length, j + id.length + k - 1));
                        done = true;
                    }
                    return JSON.parse(t);
                });
            },
            set : function(id,value,expiry) {
                return Promise.resolve().then(function() {
                    if (typeof value === 'undefined') {
                        document.cookie = id + '=\'\';path=/;expires=Sun, 17-Jan-1980 00:00:00 GMT;\n';
                    } else {
                        value = JSON.stringify(value);
                        document.cookie = id +'='+(expiry === null? encodeURI(value)+';path=/;\n' : encodeURI(value)+';path=/;expires='+expiry+';\n');
                    }
                });
            }
        }
    );

    // local provider
    store.installProvider(
        'local',
        {
            get : function(id) {
                return Promise.resolve().then(function() {
                    var v = localStorage.getItem(id);
                    if (v)
                        v = JSON.parse(v);
                    if (! v)
                        return;
                    if (v.expiry && v.expiry < new Date().getTime()) {
                        localStorage.setItem(id,null);
                        return;
                    }
                    return v.value;
                });
            },
            set : function(id,value,expiry) {
                return Promise.resolve().then(function() {
                    value = typeof value === 'undefined' || value === null? null : JSON.stringify({ value:value, expiry:expiry });
                    localStorage.setItem(id,value);
                });
            }
        }
    );

    // session provider
    store.installProvider(
        'session',
        {
            get : function(id) {
                return Promise.resolve().then(function() {
                    var v = sessionStorage.getItem(id);
                    if (v)
                        v = JSON.parse(v);
                    if (! v)
                        return;
                    if (v.expiry && v.expiry < new Date().getTime()) {
                        sessionStorage.setItem(id,null);
                        return;
                    }
                    return v.value;
                });
            },
            set : function(id,value,expiry) {
                return Promise.resolve().then(function() {
                    value = typeof value === 'undefined' || value === null? null : JSON.stringify({ value:value, expiry:expiry });
                    sessionStorage.setItem(id,value);
                });
            }
        }
    );

    // default provider to: LOCAL STORAGE
    store.defaultProvider = store.providers.local;

    return store;

};
