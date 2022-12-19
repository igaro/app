(function() {

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

        var urlEncode = function (l) {

            return Object.keys(l).map(function (k) {
                return encodeURIComponent(k)+"="+encodeURIComponent(l[k]);
            }).join('&');
        };

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
            if (o.data) {
                this.mode = typeof o.data === 'string'? 'plain' : 'json';
                this.data = o.data;
            }
            if (o.resBase) {
              this.resBase = o.resBase;
            }
            if (typeof o.withCredentials === 'boolean')
                this.withCredentials = o.withCredentials;
            if (o.form) {
                this.mode = 'urlenc';
                this.form = o.form;
            }
            if (o.mode) {
                if (! /json|plain|urlenc|multipart/.test(o.mode))
                    throw new Error('instance.xhr mode only supports json (default), urlenc (default if form), plain (default if string) and multipart (default if form and upload ctl) modes');
                this.mode = o.mode;
            }
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

                if (typeof o === 'object' && o.stopImmediatePropagation) {
                  return;
                }

                const response = (! xhr.responseType) || xhr.responseType.match(/^.{0}$|text/)? xhr.responseText : xhr.response,
                  status = xhr.status;

                if (status === 0 && (! response || response.length === 0)) {
                  self.connectionFalure = true;
                }

                const cv = xhr.getResponseHeader("Content-Type");
                if (self.expectedContentType && cv && cv.indexOf('/'+self.expectedContentType) === -1) {
                  throw({ status: 417, response:"unexpected content type" });
                }
                const data = ! cv || cv.indexOf('/json') === -1? response : JSON.parse(response);

                if ((status >= 200 && status < 400) || (status === 0 && response.length > 0)) {
                  self._promise.resolve(data,xhr);
                  return rootEmitter.dispatch('instance.xhr.success',self);
                } else {
                  throw({ status, data });
                }

            })['catch'](function (e) {

                return onError.call(self,e);
            }).then(function() {

                return rootEmitter.dispatch('instance.xhr.end',self);
            });
        };

        // common error function
        var onError = function(e) {

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
                eventMgr = this.managers.event;

            this.mode='json';
            this.res='';
            this.withCredentials=false;
            this.silent = false;
            this.aborted = false;
            this.connectionFailure = false;
            this.headers = {};
            this.response = false;
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
              data = this._data,
              res = this.res,
              mode = this.mode,
              headers = this.headers,
              isPUTorPOST = /(PUT|POST)/.test(action);

            if (! this._promise) {
                throw new Error('instance.xhr -> Can\t send() before exec(). Send() is only for re-executing a request.');
            }

            return rootEmitter.dispatch('instance.xhr.start',self).then(function() {

                if (isPUTorPOST) {
                    switch (mode) {
                        case 'urlenc':
                            data = urlEncode(data);
                            headers['Content-Type'] = 'application/x-www-form-urlencoded';
                            break;
                        case 'multipart':
                            headers['Content-Type'] = 'multipart/form-data';
                            break;
                        case 'plain':
                            data = 'data=' + encodeURIComponent(data);
                            headers['Content-Type'] = 'text/plain';
                            break;
                        default:
                            data = JSON.stringify(data);
                            headers['Content-Type'] = 'application/json';
                    }
                } else {
                    data = urlEncode(data);
                    if (data.length)
                        res += (res.indexOf('?') === -1? '?' : '&') + data;
                }

                xhr.open(action,(self.resBase || '') + res,true);
                xhr.withCredentials = self.withCredentials? true : false;
                Object.keys(self.headers).forEach (function (k) {

                    var header = self.headers[k];
                    if (typeof header === 'function')
                        header = header();
                    if (header)
                        xhr.setRequestHeader(k,header);
                });

                self.response = false;
                xhr.send(isPUTorPOST? data:null);
            });
        };

        /* Performs an XHR operation
         * @param {string} [action] - GET, POST etc. Default is GET
         * @param {object} [o] - optional config literal. See constructor, setBits and online help for attributes.
         * @returns {Promise} containing data
         */
        InstanceXhr.prototype.exec = function(action,o) {

            setBits.call(this,o);

            var self = this;

            /* if (typeof data === 'function')
                data = data();

            if (typeof vars !== 'object')
                throw new TypeError("instance.xhr var function did not return an object");
            */

            this.action = action;
            this.aborted = false;
            this.connectionFailure = false;

            var data = {};

            // shallow copy form data
            if (this.form) {
                Object.assign(data, this.formData(this.form));
            }

            // shallow copy json style data
            if (this.data) {
                Object.assign(data, this.data);
            }

            this._data = data;

            return new Promise(function(resolve,reject) {

                self._promise = {
                  resolve,
                  reject
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

        /* Produces a literal from a form elements, a copy
         * @param {object} form - HTML FORM Element
         * @returns {object}
         */
        InstanceXhr.prototype.formData = function(form) {

            if (typeof form !== 'object' || ! form.elements)
                throw new TypeError("First argument must be an HTML FORM Element");

            return Array.prototype.slice.call(form.elements).reduce(function(fd, l) {
                if (l.disabled || ! l.name)
                    return fd;
                if (l.type === "checkbox" && l.checked) {
                    fd[l.name] = l.checked? 1:0;
                } else if (l.type === "select-one" && l.selectedIndex > -1) {
                    if (l.options.length)
                        fd[l.name] = l.value;
                } else if (l.type === "select-multiple") {
                    var t=l.options.map(function(s) {
                        return ! s.selected? null : s.value;
                    }).join('\n');
                    if (t.length)
                        fd[l.name] = t;
                } else {
                    fd[l.name] = l.value.trim();
                }
                return fd;
            }, {});
        };

        return InstanceXhr;
    };

})(this);
