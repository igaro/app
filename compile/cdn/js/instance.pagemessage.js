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
        
        bless.call(this,{
            name:'instance.pagemessage',
            parent:o.parent,
            asRoot:true,
            managers: {
                store:app['core.store']
            }
        });
        var managers = this.managers,
            storeMgr = managers.store,
            eventMgr = managers.event,
            debugMgr = managers.debug,
            dom = managers.dom;

        this.id = o.id? o.id : null;
        var self = this;
        var hideable = o && o.hideable? o.hideable : null,
            id = hideable && hideable.model? hideable.model.path+this.id : this.id;
        return Promise.all(hideable? [storeMgr.get(id)] : []).then(function(d) {
            if (d.length && d[0] && d[0].hidden)
                return self.destroy();
            var container = self.container = dom.mk('div',o.container,null,'instance-pagemessage'),
                wrapper = dom.mk('div',container,null,o.type || 'default');
                if (o.hide)
                    self.hide();
            dom.mk('div',wrapper,o.message);
            if (self.id) 
                container.classList.add(self.id);
            if (hideable) {
                dom.mk('a',wrapper,null,function() {
                    this.addEventListener('click', function(event) {
                        event.preventDefault();
                        self.destroy();
                        storeMgr.set(id, { hidden:true }).catch(function(e) {
                            debugMgr.handle(e);
                        });
                    });
                });
            }
            return self;
        });
    };

    InstancePageMessage.prototype.hide = function(v) {
        this.managers.dom.hide(this.container,v);
    };
    
    InstancePageMessage.prototype.show = function() {
        this.managers.dom.show(this.container);
    };

    return InstancePageMessage;

};

})();