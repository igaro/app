module.exports = function(app) {

    if (typeof window.XMLHttpRequest === 'undefined') 
        throw new Error({ incompatible:true, noobject:'XMLHttpRequest' });
    
    var events = app['core.events'],

    setBits = function(p) {
      if (p.res) 
        this.res = p.res;
      if (p.headers) 
        this.headers = p.headers;
      if (p.vars) 
        this.vars = p.vars;
      if (p.withCredentials !== undefined) 
        this.withCredentials = p.withCredentials;
      if (p.form) 
        this.setForm(p.form);
    },

    y = function(p) {
        var self = this;
        this.data = null;
        this.res='';
        this.withCredentials=false;
        this.vars = {};
        this.headers = {};
        this.formdata = {};
        this.id = Math.floor((Math.random()*9999)+1);
        this.xhr = new XMLHttpRequest();
        if (p) 
            setBits.call(this,p);
    };

    y.prototype.exec = function(action, p) {
        this.action = action;
        this.jsonError=null;
        if (p) 
            setBits.call(this,p);
        var self = this;
        return new Promise(function(resolve, reject) {
            var action = self.action, xhr = self.xhr;
            xhr.onreadystatechange = function() {
                if (xhr.readyState !== 4) return;
                self.lastUrlRequest = self.res;
                if (xhr.status === 200 || (xhr.status === 0 && xhr.responseText)) {
                    var ok=false, data=null;
                    var cv = xhr.getResponseHeader("Content-Type");
                    if (cv && cv.indexOf('/json') !== -1) {
                        try {
                            data = JSON.parse(xhr.responseText);
                            ok=true;
                        }
                        catch(e) {
                            reject(e);
                            self.jsonError=e;
                            events.dispatch('instance.xhr','error', self);
                        }
                    } else {
                        data = xhr.responseText;
                        ok=true;
                    }
                    if (ok) {
                        resolve(data,xhr);
                        events.dispatch('instance.xhr','success', self);
                    }
                } else {
                    reject(xhr.status);
                    events.dispatch('instance.xhr','error', self);
                }
                events.dispatch('instance.xhr','end', self);
            };
            self.abort();
            var uri = [self.vars,self.formdata].map(function (l) {
                return Object.keys(l).map(function (k) {
                    return encodeURIComponent(key)+"="+encodeURIComponent(l[key]);
                });
            }).join('&');
            var t = self.res;
            if (action==='GET' && uri.length) {
                t += t.indexOf('?') > -1? '&' : '?';
                t += uri;
            }
            xhr.open(action,t,true);
            if ("withCredentials" in xhr) 
                xhr.withCredentials = self.withCredentials;
            Object.keys(self.headers).forEach (function (k) {
                xhr.setRequestHeader(k, self.headers[k]);
            });
            events.dispatch('instance.xhr','start', self);
            xhr.send(action!=='GET'? uri:null);
        });
    };

    y.prototype.get = function(p) { 
        return this.exec('GET',p); 
    };
    y.prototype.post = function(p) { 
        return this.exec('POST',p); 
    };
    y.prototype.put = function(p) { 
        return this.exec('PUT',p); 
    };
    y.prototype.trace = function(p) { 
        return this.exec('TRACE',p); 
    };
    y.prototype.head = function(p) { 
        return this.exec('HEAD',p); 
    };
    y.prototype.delete = function(p) { 
        return this.exec('DELETE',p); 
    };
    y.prototype.options = function(p) { 
        return this.exec('OPTIONS',p); 
    };

    y.prototype.abort = function() {
        if (this.xhr.readState === 0) 
            return;
        this.xhr.abort();
        events.dispatch('instance.xhr','aborted', this);
        events.dispatch('instance.xhr','end', this);
    };

    y.prototype.destroy = function() {
        this.abort();
    };

    y.prototype.setHeader = function(name,value) {
        if (value) { 
            this.headers[name]=value;
        } else if (this.headers[name]) {
            delete this.headers[name];
        }
    };

    y.prototype.setVar = function(name,value) {
        if (value) { 
            this.vars[name]=value;
        } else if (this.vars[name]) {
            delete this.vars[name];
        }
    };

    y.prototype.applyForm = function(form, autorefresh) {
        var fd = this.formdata = {};
        this.setHeader("Content-Type", "application/x-www-form-urlencoded");
        Array.prototype.splice.call(form.elements).forEach(function (l) {
            if (l.disabled) 
                return;
            if (l.type=="checkbox" && l.checked) {
                fd[l.name] = l.checked? 1:0;
            } else if (l.type=="select-one" && l.selectedIndex > -1) {
                if (l.options.length) 
                    fd[l.name] = l.options[l.selectedIndex].value;
            } else if (l.type=="select-multiple") {
                var t=l.options.map(function(s) {
                    if (! s.selected) 
                        return;
                    return s.value;
                }).join('\n');
                if (t.length) 
                    fd[l.name] = t;
            } else if (['hidden','password','text','radio','textarea'].indexOf(l.type) !== -1) {                  
                fd[l.name] = l.value.trim();
            }
        });
    };

    return y;

};