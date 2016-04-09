//# sourceURL=core.store.js

(function(env) {

    "use strict";

    module.exports = function() {

        // private
        var providers = [];

        /* Manager
         * @constructor
         * @param {object} parent - parent the dom manager belongs to
         */
        var CoreStoreMgr = function(parent) {

            this.parent = parent;
        };

        /* Returns a value in a store
         * @param {string} id - name of value to return, dot notation. Doesn't require object namespace
         * @param {object} [o] - config literal to switch provider and potentially supply other flags to the provider
         * @returns {*Promise} containg the held value
         */
        CoreStoreMgr.prototype.get = function(id,o) {

            var name = this.parent.name;
            return Promise.resolve().then(function() {

                var type = o && o.type? providers[o.type] : store.defaultProvider;
                if (! type)
                    throw new Error('core.store -> invalid provider or default not set.',type);

                return type.get(name+':'+id,o);
            });
        };

        /* Sets a value in a store
         * @param {string} id - name of value to set, dot notation. Doesn't require object namespace
         * @param {*} [value] - value to set. Null or undefined will delete the key.
         * @param {object} [o] - config literal to switch provider, set expiry date/time, and potentially supply other flags to the provider
         * @returns {Promise} once set
         */
        CoreStoreMgr.prototype.set = function(id,value,o) {

            var name = this.parent.name;
            return Promise.resolve().then(function() {

                var type = o && o.type? providers[o.type] : store.defaultProvider;
                if (! type)
                    throw new Error('core.store -> invalid provider or default not set.',type);

                var expiry = o && o.expiry? o.expiry.getTime() : null;
                return type.set(name+':'+id,value,expiry,o);
            });
        };

        /* Destroys the object (clean up ops)
         * @returns {Promise} containing null
         */
        CoreStoreMgr.prototype.destroy = function() {

            this.parent = null;
        };

        // service
        var store = {

            defaultProvider : null,

            /* Manager
             * @param {object} parent - parent the dom manager belongs to
             * @returns {CoreStoreMgr} a manager
             */
            createMgr : function(parent) {

                return new CoreStoreMgr(parent);
            },

            /* Returns a Provider by its ID
             * @param {string} id - such as 'cookie'
             * @returns {object} a provider
             */
            getProviderById : function(id) {

                if (typeof id !== 'string')
                    throw new TypeError("First argument must be of type string");

                return providers[id];
            },

            /* Installs a new provider
             * @param {string} id - such as 'cookie'
             * @param {object} service - containing getter, setter
             * @returns {null}
             */
            installProvider : function(id,service) {

                if (typeof id !== 'string')
                    throw new TypeError("First argument must be of type string");

                providers[id] = service;
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

                        if (typeof value === 'undefined' || value === null) {
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
        store.defaultProvider = providers.local;

        return store;
    };

})(this);
