//# sourceURL=instance.toast.js

module.requires = [
    { name: 'instance.toast.css' },
    { name: 'core.language.js' }
];

module.exports = function(app) {

    "use strict";

    var language = app['core.language'],
        dom = app['core.dom'],
        bless = app['core.object'].bless;

    var showTime = {
        short : 2000,
        long : 4000
    };

    var container = dom.mk('div',document.body,null,'igaro-instance-toast'),
        recentInstanceToastMessages = [];

    var InstanceToast = function(o) {
        bless.call(this,{
            name:'instance.toast',
            parent:o.parent,
            asRoot:true
        });
        var domMgr = this.managers.dom,
            duration = o.duration || 'short',
            position = o.position,
            txt = o.message,
            str = JSON.stringify(txt);

        // self destruct
        var self = this;
        window.setTimeout(function() {
            self.destroy();
        }, showTime[duration]+200);

        // prevent toasting of same message within limited period
        if (recentInstanceToastMessages.indexOf(str) > -1)
            return;
        recentInstanceToastMessages.push(str);
        window.setTimeout(function() {
            recentInstanceToastMessages.splice(recentInstanceToastMessages.indexOf(str),1);
        },1000);

        // phonegap InstanceToast plugin
        if (window.plugins && window.plugins.toast)
            return window.plugins.toast.show(typeof txt === 'object'? language.mapKey(txt) : txt,duration,position);

        // html InstanceToast
        domMgr.mk('div',container,txt,duration);
    };

    InstanceToast.prototype.init = function() {
        return Promise.resolve();
    };

    return InstanceToast;

};
