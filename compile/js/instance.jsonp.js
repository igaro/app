module.exports = function(app) {

    var events = app['core.events'];

    var setBits = function(p) {
      if (p.res) this.res = p.res;
      if (p.callbackName) this.callbackName = p.callbackName;
    }

    var y = function(p) {
        this.res='';
        this.callbackName = 'callback';
        this.uid = 'jsonp'+Math.round(Math.random()*1000001);
        var t = this.jsonp = document.createElement('script');
        if (p) setBits.call(this,p);
    };

    y.prototype.get = function(p) {
        this.abort();
        if (p) setBits.call(this,p);
        var self = this, jsonp = this.jsonp, s = this.res;
        s += s.indexOf('?') === -1? '?' : '&';
        s += this.callbackName + '=' + this.uid;
        return new Promise(function(resolve, reject) {
            window[self.uid] = function(data) {
                delete window[self.uid];
                events.dispatch('instance.xhr','success', self);
                events.dispatch('instance.xhr','end', self);
                resolve(data);
            };
            jsonp.src = s;
            jsonp.onerror = function(err) {
                delete window[self.uid];
                reject(err);
                events.dispatch('instance.xhr','error', { error:err, jsonp:self });
                events.dispatch('instance.xhr','end', self);
            }
            document.getElementsByTagName('head')[0].appendChild(jsonp);
            events.dispatch('instance.xhr','start', self);
        });
    }

    y.prototype.abort = function() {
        var j = this.jsonp;
        if (! j.parentNode) return;
        j.parentNode.removeChild(j);
        events.dispatch('instance.xhr','aborted', this);
        events.dispatch('instance.xhr','end', this);
    };

    y.prototype.destructor = function() {
        this.abort();
    }

    return y;

};