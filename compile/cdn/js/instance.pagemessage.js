(function() {

'use strict';

module.requires = [
    { name:'instance.pagemessage.css' },
    { name:'core.language.js' },
    { name:'core.store.js' }
];

module.exports = function(app) {

    var bless = app['core.bless'];

    var InstancePageMessage = function(o) {
        var self = this; 
        bless.call(this,{
            name:'instance.pagemessage',
            parent:o.parent,
            asRoot:true,
            managers: {
                store:app['core.store']
            },
            container: function(dom) {
                return dom.mk('div',o.container,null,function() {
                    if (o.className)
                        this.classList.add(o.className);
                    dom.mk('div',this,null,function() {
                        if (o.type)
                            this.className = o.type;
                        dom.mk('div',this,o.message);
                        dom.mk('a',this,null,function() {
                            this.addEventListener('click', function(event) {
                                event.preventDefault();
                                return self.managers.store.set(self.id, { hidden:true }).then(function() {
                                    return self.destroy();
                                }).catch(function(e) {
                                    return self.managers.debug.handle(e);
                                });
                            });
                        });
                    });
                });
            }
        });
        this.id = o.id;
    };

    InstancePageMessage.prototype.init = function(o) {
        var self = this,
            hideable = o.hideable;
        if (hideable)
            this.container.firstChild.classList.add('hideable');
        return self.managers.event.dispatch('init').then(function() {
            if (hideable)
                return self.managers.store.get(self.id).then(function(d) {
                    if (d && d.hidden)
                        return self.destroy();
                });
        });
    };

    return InstancePageMessage;

}

})();
