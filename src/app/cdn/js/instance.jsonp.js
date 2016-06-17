//# sourceURL=instance.jsonp.js

module.exports = function(app) {

    'use strict';

    var bless = app['core.object'].bless,
        dom = app['core.dom'],
        setBits = function(o) {

            if (o.res)
                this.res = o.res;
            if (o.callbackName)
                this.callbackName = o.callbackName;
        };

    /* Uses JSONP to fetch JSON via a callback, to thwart CORS
     * @constructor
     * @param {object [o] - config literal, see setBits and online help for attributes
     */
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

    /* Fetches a JSON file
     * @param {object} [o] - config literal, see setBits and online help for attributes
     * @returns {Promise} containing data
     */
    InstanceJsonP.prototype.get = function(o) {
        this.abort();
        if (o)
            setBits.call(this,o);
        var self = this,
            eventMgr = this.managers.event,
            jsonp = this.jsonp,
            res = this.res;
        res += res.indexOf('?') === -1? '?' : '&';
        res += this.callbackName + '=' + this.uid;
        return new Promise(function(resolve, reject) {

            window[self.uid] = function(data) {

                delete window[self.uid];
                resolve(data);
                return eventMgr.dispatch('success').then(function() {

                    return eventMgr.dispatch('end');
                });
            };
            jsonp.src = res;
            jsonp.onerror = function(err) {

                delete window[self.uid];
                reject(err);
                return eventMgr.dispatch('error',err).then(function() {

                    return eventMgr.dispatch('end');
                });
            };
            dom.head.appendChild(jsonp);
            return eventMgr.dispatch('start');
        });
    };

    /* Aborts a transaction
     * @returns {Promise}
     */
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
