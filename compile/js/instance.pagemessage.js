module.requires = [
    { name:'instance.pagemessage.css' },
    { name:'core.language.js' },
    { name:'core.store.js' }
];

module.exports = function(app) {

    var language = app['core.language'],
        store = app['core.store'],
        events = app['core.events'],

    a = function(o) {
        this.id = o.id? o.id : null;
        this.container = null;
    	var w = document.createElement('div');
    	if (o.hideable) {
            var id = o.hideable.model? o.hideable.model.path+this.id : this.id,
                dd = store.get('instance.pagemessage',id);
            if (dd && dd.hidden) 
                return;
    		var p = document.createElement('div'),
                self = this;
    		p.className = 'hide';
    		p.addEventListener('click', function() {
    			self.remove();
                store.set('instance.pagemessage',id, { hidden:true });
    		});
    		w.appendChild(p);
    	}
        var m = this.container = document.createElement('div');
        m.className = 'instance-pagemessage';
        if (o.id) 
            m.className += ' '+o.id;
        w.className = o.type? o.type : 'default';
        m.appendChild(w);
    	var s = document.createElement('span'),
        f = function() { 
            s.innerHTML = language.mapKey(o.message); 
        };
        events.on('core.language','code.set', f);
        f();
        w.appendChild(s);
        if (o.container) 
            o.container.appendChild(m);
    };

    a.prototype.remove = function() {
        if (this.container.parentNode) 
            this.container.parentNode.removeChild(this.container);
        this.container = null;
    };

    return a;

};