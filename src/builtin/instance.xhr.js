(function(env) {

    'use strict';

    module.exports = function(app) {

        // no IE7!
        if (typeof XMLHttpRequest === 'undefined') {
            throw {
                error: {
                    incompatible:true,
                    noobject:'XMLHttpRequest'
                }
            };
        }

        var bless = app['core.object'].bless,
            rootEmitter = app['core.events'].rootEmitter;

        // object decorator
        var setBits = function(o) {

            if (!o)
                return;

            var type = typeof o;
            if (type === 'string') {
                this.res = o;
                return;
            }
            if (type !== 'object')
                throw new TypeError('Config argument must be an object literal.');
            if (o.res)
                this.res = o.res;
            if (o.headers)
                this.headers = o.headers;
            if (o.vars)
                this.vars = o.vars;
            if (typeof o.withCredentials === 'boolean')
                this.withCredentials = o.withCredentials;
            if (o.form)
                this.setForm(o.form);
            if (typeof o.silent === 'boolean')
                this.silent = o.silent;
            if (o.stash)
                this.stash = o.stash;
            if (typeof o.expectedContentType !== 'undefined')
                this.expectedContentType = o.expectedContentType;
            if (o.responseType)
                this.xhr.responseType = o.responseType;
        };

        // common success function
        var onLoad = function() {

            var self = this,
                xhr = this.xhr;

            this.response = true;
            this.lastUrlRequest = this.res;

            rootEmitter.dispatch('instance.xhr.response',this).then(function(o) {

                if (typeof o === 'object' && o.stopImmediatePropagation)
                    return;

                var response = (! xhr.responseType) || xhr.responseType.match(/^.{0}$|text/)? xhr.responseText : xhr.response,
                    status = xhr.status;

                if (status === 0 && (! response || response.length === 0))
                    self.connectionFalure = true;

                if (status === 200 || (status === 0 && response.length > 0)) {

                    var cv = xhr.getResponseHeader("Content-Type");

                    if (self.expectedContentType && cv && cv.indexOf('/'+self.expectedContentType) === -1)
                        throw(400);

                    var data = ! cv || cv.indexOf('/json') === -1? response : JSON.parse(response);
                    self._promise.resolve(data,xhr);
                    return rootEmitter.dispatch('instance.xhr.success',self);

                } else {

                    throw(status);
                }

            })['catch'](function (e) {

                return onError.call(self,e);
            }).then(function() {

                return rootEmitter.dispatch('instance.xhr.end',self);
            })['catch'](function (e) {

                return self.managers.debug.handle(e);
            });
        };

        // common error function
        var onError = function() {

            this.response = true;
            this._promise.reject({ error:e, x:this });
            if (! this.silent)
                return rootEmitter.dispatch('instance.xhr.error', { x:this, error:e });
        };

        /* XHR
         * @constructor
         * @params {object} [o] - config literal. See setBits and online help for attributes
         */
        var InstanceXhr = function(o) {

            this.name = 'instance.xhr';
            this.asRoot = true;
            bless.call(this,o);

            var self = this,
                xhr = this.xhr = new XMLHttpRequest(),
                response = false,
                eventMgr = this.managers.event;

            this.res='';
            this.withCredentials=false;
            this.vars = {};
            this.silent = false;
            this.aborted = false;
            this.connectionFailure = false;
            this.headers = {};
            this.response = false;
            this.formdata = {};
            this.id = Math.floor((Math.random()*9999)+1);
            setBits.call(this,o);

            eventMgr.on('destroy',function() {

                return self.abort();
            });

            // XHR 1
            xhr.onreadystatechange = function() {

                if (xhr.readyState === 4)
                    onLoad.call(self);
            };

            // XHR 2
            xhr.onload = function() {

                onLoad.call(self);
            };

            xhr.onerror = function(e) {

                onError.call(self,e);
            };
        };

        /* Sends an XHR operation. Used mainly for resend. See exec() instead.
         * @returns {Promise}
         */
        InstanceXhr.prototype.send = function() {

            var self = this,
                action = this.action,
                xhr = this.xhr,
                uri = this._uri,
                t = this.res,
                isPUTorPOST = /(PUT|POST)/.test(action);

            if (! this._promise) {
                throw new Error('instance.xhr -> Can\t send() before exec(). Send() is only for re-executing a request.');
            }

            return rootEmitter.dispatch('instance.xhr.start',self).then(function() {

                if (! isPUTorPOST && uri.length) {
                    t += t.indexOf('?') > -1? '&' : '?';
                    t += uri;
                }
                xhr.open(action,t,true);
                xhr.withCredentials = self.withCredentials? true : false;
                Object.keys(self.headers).forEach (function (k) {

                    var header = self.headers[k];
                    if (typeof header === 'function')
                        header = header();
                    if (header)
                        xhr.setRequestHeader(k,header);
                });
                self.response = false;
                xhr.send(isPUTorPOST? self._uri:null);
            });
        };

        /* Performs an XHR operation
         * @param {string} [action] - GET, POST etc. Default is GET
         * @param {object} [o] - optional config literal. See constructor, setBits and online help for attributes.
         * @returns {Promise} containing data
         */
        InstanceXhr.prototype.exec = function(action, o) {

            var self = this,
                vars = this.vars;

            setBits.call(this,o);

            if (typeof vars === 'function')
                vars = vars();

            if (typeof vars !== 'object')
                throw new TypeError("instance.xhr var function did not return an object");

            this.action = action;
            this.aborted = false;
            this.connectionFailure = false;
            this._uri = [vars,self.formdata].map(function (l) {

                return Object.keys(l).map(function (k) {

                    return encodeURIComponent(k)+"="+encodeURIComponent(l[k]);
                }).join('&');
            }).join('&');

            if (this._uri.length < 2)
                this._uri = '';

            return new Promise(function(resolve,reject) {

                self._promise = {
                    resolve : resolve,
                    reject : reject
                };
                return self.send()['catch'](reject);
            });
        };

        /* Calls .exec() with GET
         * @param {object} [o] - optional config literal.
         * @returns {Promise} containing data
         */
        InstanceXhr.prototype.get = function(o) {

            return this.exec('GET',o);
        };

        /* Calls .exec() with POST
         * @param {object} [o] - optional config literal.
         * @returns {Promise} containing data
         */
        InstanceXhr.prototype.post = function(o) {

            return this.exec('POST',o);
        };

        /* Calls .exec() with PUT
         * @param {object} [o] - optional config literal.
         * @returns {Promise} containing data
         */
        InstanceXhr.prototype.put = function(o) {

            return this.exec('PUT',o);
        };

        /* Calls .exec() with TRACE
         * @param {object} [o] - optional config literal.
         * @returns {Promise} containing data
         */
        InstanceXhr.prototype.trace = function(o) {

            return this.exec('TRACE',o);
        };

        /* Calls .exec() with HEAD
         * @param {object} [o] - optional config literal.
         * @returns {Promise} containing data
         */
        InstanceXhr.prototype.head = function(o) {

            return this.exec('HEAD',o);
        };

        /* Calls .exec() with DELETE
         * @param {object} [o] - optional config literal.
         * @returns {Promise} containing data
         */
        InstanceXhr.prototype['delete'] = function(o) {

            return this.exec('DELETE',o);
        };

        /* Calls .exec() with OPTIONS
         * @param {object} [o] - optional config literal.
         * @returns {Promise} containing data
         */
        InstanceXhr.prototype.options = function(o) {

            return this.exec('OPTIONS',o);
        };

        /* Aborts an XHR operation. Do not resend after doing this!
         * @returns {Promise}
         */
        InstanceXhr.prototype.abort = function() {

            if (this._promise)
                this._promise.reject();
            if (this.xhr.readyState === 0)
                return Promise.resolve();

            this.xhr.abort();
            this.aborted = true;
            var self = this;
            return rootEmitter.dispatch('instance.xhr.aborted',self).then(function() {

                return rootEmitter.dispatch('instance.xhr.end',self);
            });
        };

        /* Applies elements on a form to be sent with the request and sets the encoding header
         * @param {object} form - HTML FORM Element
         * @returns {null}
         */
        InstanceXhr.prototype.applyForm = function(form) {

            if (!(form instanceof Node) || ! form.elements)
                throw new TypeError("First argument must be an HTML FORM Element");

            var fd = this.formdata = {};
            this.headers["Content-Type"] = "application/x-www-form-urlencoded";
            Array.prototype.splice.call(form.elements).forEach(function (d,l) {

                if (l.disabled)
                    return;

                if (l.type === "checkbox" && l.checked) {

                    fd[l.name] = l.checked? 1:0;
                } else if (l.type === "select-one" && l.selectedIndex > -1) {

                    if (l.options.length)
                        fd[l.name] = l.options[l.selectedIndex].value;
                } else if (l.type === "select-multiple") {

                    var t=l.options.map(function(s) {
                        return ! s.selected? null : s.value;
                    }).join('\n');
                    if (t.length)
                        fd[l.name] = t;
                } else {

                    fd[l.name] = l.value.trim();
                }
            });
        };

        return InstanceXhr;
    };

})(this);
