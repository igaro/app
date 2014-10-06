module.requires = [
    { name:'instance.pagemessage.css' },
    { name:'core.language.js' },
    { name:'core.store.js' }
];

module.exports = function(app) {

    var language = app['core.language'],
        store = app['core.store'],
        events = app['core.events'];
       
    var pageMessage = function(o) {
        this.id = o.id? o.id : null;
        this.container = null;
        this.message = o.message;

        var hideable = o && o.hideable? o.hideable : null;
        if (hideable) {
            var id = hideable.model? hideable.model.path+this.id : this.id,
                dd = store.get('instance.pagemessage',id);
            if (dd && dd.hidden) 
                return;
        }

    	var wrapper = document.createElement('div'),
            container = this.container = document.createElement('div'),
            msg = document.createElement('div'),
            self = this;

        container.className = 'instance-pagemessage';
        if (o.id) 
            container.classList.add(o.id);
        container.appendChild(wrapper);
        wrapper.appendChild(msg);
        wrapper.className = o.type || 'default';
        if (hideable) {
            var id = hideable.model? hideable.model.path+this.id : this.id,
                p = document.createElement('div');
            p.className = 'hidethis';
            p.addEventListener('click', function() {
                self.destroy();
                store.set('instance.pagemessage',id, { hidden:true });
            });
            wrapper.appendChild(p);
        }
        if (o.container) 
            o.container.appendChild(m);
        var evt = this.eventLang = function() {
            self.container.firstChild.firstChild.innerHTML = language.mapKey(self.message);
        };
        evt();
        events.on('core.language','code.set',evt);
    };
    
    pageMessage.prototype.destroy = function() {
        var c = this.container;
        if (c && c.parentNode)
            c.parentNode.removeChild(c);
        events.remove(this.eventLang, 'core.language','code.set');
    };

    return pageMessage;

};