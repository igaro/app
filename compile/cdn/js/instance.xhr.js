(function(env) {

    'use strict';

    module.exports = function(app) {

        // no IE7!
        if (typeof XMLHttpRequest === 'undefined')
            throw {
                error: {
                    incompatible:true,
                    noobject:'XMLHttpRequest'
                }
            };

        var setBits = function(p) {
            if (!p)
                return;
            var type = typeof p;
            if (type === 'string') {
                this.res = p;
                return;
            }
            if (type !== 'object')
                throw new TypeError('Config argument must be an object literal.');
            if (p.res)
                this.res = p.res;
            if (p.headers)
                this.headers = p.headers;
            if (p.vars)
                this.vars = p.vars;
            if (typeof p.withCredentials === 'boolean')
                this.withCredentials = p.withCredentials;
            if (p.form)
                this.setForm(p.form);
            if (typeof p.silent === 'boolean')
                this.silent = p.silent;
            if (p.stash)
                this.stash = p.stash;
            if (typeof p.expectedContentType !== 'undefined')
                this.expectedContentType = p.expectedContentType;
            if (p.responseType)
                this.xhr.responseType = p.responseType;
        };

        var bless = app['core.object'].bless,
            rootEmitter = app['core.events'].rootEmitter;

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

        var onError = function() {

            this.response = true;
            this._promise.reject({ error:e, x:this });
            if (! this.silent)
                return rootEmitter.dispatch('instance.xhr.error', { x:this, error:e });
        };

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

        InstanceXhr.prototype.init = function() {

            return Promise.resolve();
        };

        InstanceXhr.prototype.send = function() {

            var self = this,
                action = this.action,
                xhr = this.xhr,
                uri = this._uri,
                t = this.res,
                isPUTorPOST = /(PUT|POST)/.test(action);
            if (! this._promise)
                throw new Error('instance.xhr -> Can\t send() before exec(). Send() is only for re-executing a request.');
            return rootEmitter.dispatch('instance.xhr.start',self).then(function() {
                if (! isPUTorPOST && uri.length) {
                    t += t.indexOf('?') > -1? '&' : '?';
                    t += uri;
                }
                xhr.open(action,t,true);
                xhr.withCredentials = self.withCredentials? true : false;
                Object.keys(self.headers).forEach (function (k) {
                    var header = self.headers[k];
                    var v = typeof header === 'function'? header() : header;
                    if (v)
                        xhr.setRequestHeader(k,v);
                });
                self.response = false;
                xhr.send(isPUTorPOST? self._uri:null);
            });
        };

        InstanceXhr.prototype.exec = function(action, p) {

            var self = this;
            setBits.call(this,p);
            this.action = action;
            this.aborted = false;
            this.connectionFailure = false;
            var vars = typeof self.vars === 'function'? self.vars(): self.vars;
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
                return self.send().catch(reject);
            });
        };

        InstanceXhr.prototype.get = function(p) {

            return this.exec('GET',p);
        };

        InstanceXhr.prototype.post = function(p) {

            return this.exec('POST',p);
        };

        InstanceXhr.prototype.put = function(p) {

            return this.exec('PUT',p);
        };

        InstanceXhr.prototype.trace = function(p) {

            return this.exec('TRACE',p);
        };

        InstanceXhr.prototype.head = function(p) {

            return this.exec('HEAD',p);
        };

        InstanceXhr.prototype.delete = function(p) {

            return this.exec('DELETE',p);
        };

        InstanceXhr.prototype.options = function(p) {

            return this.exec('OPTIONS',p);
        };

        InstanceXhr.prototype.abort = function() {

            if (this._promise) {
                this._promise.reject();
            }
            if (this.xhr.readyState === 0)
                return Promise.resolve();
            this.xhr.abort();
            this.aborted = true;
            var self = this;
            return rootEmitter.dispatch('instance.xhr.aborted',self).then(function() {
                return rootEmitter.dispatch('instance.xhr.end',self);
            });
        };

        InstanceXhr.prototype.applyForm = function(form) {

            var fd = this.formdata = {};
            this.headers["Content-Type"] = "application/x-www-form-urlencoded";
            Array.prototype.splice.call(form.elements).forEach(function (l) {
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
