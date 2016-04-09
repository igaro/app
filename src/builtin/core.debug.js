(function(env) {

    "use strict";

    module.exports = function(app,appConf) {

        var rootEmitter = app['core.events'].rootEmitter;

        // private log helper
        var logHelper = function(type,data,path,evt) {

            if (env.console && this.developer) {
                var p = path instanceof Array? path.join('.') : path;
                if (evt)
                    p += ':'+evt;
                env.console[type](p || '[UNKNOWN PATH]',data);
            }
            return rootEmitter.dispatch('core.debug.'+type,{ path:path, event:evt, value:data });
        };

        /* Manager
         * @constructor
         */
        var CoreDebugMgr = function(parent) {

            this.parent = parent;
        };

        /* Logs a debug message
         * @param {(function|function[])} evt - the name of the event to register on, or array of
         * @param {string} [event] - optional event name to reduce enumeration
         * @returns {null}
         */
        CoreDebugMgr.prototype.log = function(e,evt) {

            return debug.log({ log:e, scope:this.parent }, this.parent.path, evt);
        };

        /* Handles a critical error. Typically invokes a helpful user display via an event trigger
         * @param {(function|function[])} evt - the name of the event to register on, or array of
         * @param {string} [event] - optional event name to reduce enumeration
         * @returns {null}
         */
        CoreDebugMgr.prototype.handle = function(e) {

            return debug.handle({ error:e, scope:this.parent }, this.parent.path);
        };

        /* Destroys the object (clean up ops)
         * @returns {Promise} containing null
         */
        CoreDebugMgr.prototype.destroy = function() {

            this.parent = null;
            return Promise.resolve();
        };

        // service
        var debug = {
            developer : appConf.debug,
            log : function(value,path,evt) {

                return logHelper.call(this,'log',value,path,evt);
            },
            error : function(value,path,evt) {

                return logHelper.call(this,'error',value,path,evt);
            },
            handle : function(value,path,evt) {

                return rootEmitter.dispatch('core.debug.handle', { path:path, value:value, event:evt });
            },
            createMgr : function(parent) {

                return new CoreDebugMgr(parent);
            }
        };

        return debug;

    };

})(this);
