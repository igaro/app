(function() {

'use strict';

module.requires = [
    { name: 'instance.toast.css' },
    { name: 'core.language.js' }
];

module.exports = function(app) {

    var language = app['core.language'],
        dom = app['core.dom'];

    var showTime = {
        short : 2000,
        long : 4000
    };

    var container = dom.mk('div',document.body,null,'instance-toast'),
        wrapper = dom.mk('div',container);

    var recentInstanceToastMessages = [];

    var InstanceToast = function(o) {
        bless.call(this,{
            name:'instance.toast',
            parent:o.parent,
            asRoot:true
        });
        var dom = this.managers.dom,
            duration = o.duration || 'short',
            position = o.position,
            txt = o.message,
            str = JSON.stringify(txt);

        // prevent toasting of same message within limited period
        if (recentInstanceToastMessages.indexOf(str) > -1)
            return;
        recentInstanceToastMessages.push(str);
        setTimeout(function() {
            recentInstanceToastMessages.splice(recentInstanceToastMessages.indexOf(str),1);
        },1000);

        // phonegap InstanceToast plugin
        if (window.plugins && window.plugins.toast)
            return window.plugins.toast.show(typeof txt === 'object'? language.mapKey(txt) : txt,duration,position);
        
        // html InstanceToast
        var c = this.container = dom.mk('div',wrapper,txt,duration);
        container.style.display = 'table';
        var self = this;
        setTimeout(function() {
            dom.rm(c);
            if (! wrapper.hasChildNodes())
                container.style.display = '';
        }, showTime[duration]+200);
    };

    return InstanceToast;

};

})();