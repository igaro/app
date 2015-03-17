(function() {

'use strict';

module.exports = function(app) {

    var CoreStoreMgr = function(parent) {
        this.parent = parent;
    };
    CoreStoreMgr.prototype.get = function(id,o) {
        var self = this,
            name = this.parent.name;
        return new Promise(function (resolve, reject) {
            var type = o && o.type? store.providers[o.type] : store.defaultProvider;
            if (! type)
                throw new Error('core.store -> invalid provider or default not set.',type);
            return type.get(name+':'+id,o).then(function(data) {
                resolve(data || null);
            }).catch(function (e) {
                reject(e);
                throw e;
            });
        });
    };
    CoreStoreMgr.prototype.set = function(id,value,o) {
        var name = this.parent.name;
        return new Promise(function (resolve, reject) {
            var type = o && o.type? store.providers[o.type] : store.defaultProvider;
            if (! type)
                throw new Error('core.store -> invalid provider or default not set.',type);
            var expiry = o && o.expiry? o.expiry.getTime() : null;
            return type.set(name+':'+id,value,expiry,o).then(function() {
                resolve();
            }).catch(function (e) {
                reject(e);
                throw e;
            });
        });
    };

    var store = {

        defaultProvider : null,

        providers : [],

        createMgr : function(parent) {
            return new CoreStoreMgr(parent);
        },

        installProvider : function(name,o) {
            this.providers[name] = o;
        }
    };

    // cookie provider
    store.installProvider(
        'cookie',
        { 
            get : function(id) {
                return new Promise(function (resolve) {
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
                        t = unescape(document.cookie.substring(j + id.length, j + id.length + k - 1));
                        done = true;
                    }
                    resolve(JSON.parse(t));
                });
            },
            set : function(id,value,expiry) {
                return new Promise(function (resolve) {
                    if (typeof value === 'undefined') {
                        document.cookie = id + '=\'\';path=/;expires=Sun, 17-Jan-1980 00:00:00 GMT;\n';
                    } else {
                        value = JSON.stringify(value);
                        document.cookie = id +'='+(expiry === null? escape(value)+';path=/;\n' : escape(value)+';path=/;expires='+expiry+';\n');
                    }
                    resolve();
                });
            }
        }
    );

    // local provider
    store.installProvider(
        'local',
        { 
            get : function(id) {
                return new Promise(function (resolve) {
                    var v = localStorage.getItem(id);
                    if (v) 
                        v = JSON.parse(v);
                    if (! v) 
                        return resolve();
                    if (v.expiry && v.expiry < new Date().getTime()) {
                        localStorage.setItem(id,null);
                        return resolve();
                    }
                    return resolve(v.value);
                });
            },
            set : function(id,value,expiry) {
                return new Promise(function (resolve) {
                    value = typeof value === 'undefined' || value === null? null : JSON.stringify({ value:value, expiry:expiry });
                    localStorage.setItem(id,value);
                    resolve();
                });
            }
        }
    );

    // session provider
    store.installProvider(
        'session',
        {
            set : function(id) {
                return new Promise(function (resolve) {
                    var v = sessionStorage.getItem(id);
                    if (v) 
                        v = JSON.parse(v);
                    if (! v) 
                        return resolve();
                    if (v.expiry && v.expiry < new Date().getTime()) {
                        sessionStorage.setItem(id,null);
                        return resolve();
                    }
                    return resolve(v.value);
                });
            },
            get : function(id,value,expiry) {
                return new Promise(function (resolve) {
                    value = typeof value === 'undefined' || value === null? null : JSON.stringify({ value:value, expiry:expiry });
                    sessionStorage.setItem(id,value);
                    resolve();
                });
            }
        }
    );

    // default provider to: LOCAL STORAGE
    store.defaultProvider = store.providers.local;

    return store;

};

})();
