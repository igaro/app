(function() {

'use strict';

module.exports = function(app) {

    var bless = app['core.object'].bless,
        setBits = function(p) {
            if (p.res) 
                this.res = p.res;
            if (p.callbackName) 
                this.callbackName = p.callbackName;
        };

    var InstanceJsonP = function(o) {
        this.name = 'instance.jsonp';
        this.asRoot = true;
        bless.call(this,o);
        this.res='';
        this.callbackName = 'callback';
        this.uid = 'jsonp'+Math.round(Math.random()*1000001);
        this.jsonp = document.createElement('script');
        var self = this;
        setBits.call(this,o);
        this.managers.event.on('destroy', function() {
            return self.abort();
        });
    };

    InstanceJsonP.prototype.init = function() {
        return this.managers.event.dispatch('init');
    };

    InstanceJsonP.prototype.get = function(o) {
        this.abort();
        if (o) 
            setBits.call(this,o);
        var self = this, 
            eventMgr = this.managers.event,
            dom = this.managers.dom,
            jsonp = this.jsonp, 
            s = this.res +
                s.indexOf('?') === -1? '?' : '&' +
                this.callbackName + '=' + this.uid;
        return new Promise(function(resolve, reject) {
            window[self.uid] = function(data) {
                delete window[self.uid];
                resolve(data).then(function() {
                    return eventMgr.dispatch('success').then(function() {
                        return eventMgr.dispatch('end');
                    });
                });
            };
            jsonp.src = s;
            jsonp.onerror = function(err) {
                delete window[self.uid];
                reject(err).then(function() {
                    return eventMgr.dispatch('error',err).then(function() {
                        return eventMgr.dispatch('end');   
                    });
                });
            };
            dom.head.appendChild(jsonp);
            return eventMgr.dispatch('start');
        });
    };

    InstanceJsonP.prototype.abort = function() {
        var j = this.jsonp;
        if (! j.parentNode) 
            return Promise.resolve();
        j.parentNode.removeChild(j);
        var eventMgr = this.managers.event;
        return eventMgr.dispatch('aborted').then(function() {
            return eventMgr.dispatch('end');    
        });
    };

    return InstanceJsonP;

};

})();
