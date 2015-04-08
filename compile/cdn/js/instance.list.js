(function() {

'use strict';

module.requires = [
    { name: 'core.language.js' },
    { name: 'instance.list.css' }
];


module.exports = function(app) {

    var bless = app['core.bless'];

    var InstanceListItem = function(o) {
        bless.call(this,{
            name:'item',
            stash:o.stash,
            parent:o.parent,
            container:function(dom) {
                return dom.mk('li',null,o.content,o.className);
            }
        });
    };

    var InstanceList = function(o) {
        if (!o)
            o={};
        bless.call(this,{
            name:'instance.list',
            parent:o.parent,
            stash:o.stash,
            asRoot:true,
            container:function(dom) {
                return dom.mk('ol',o.container,null,o.className);
            }
        });
        var pool = this.pool = [],
            self = this;
        this.managers.event
            .on('item.destroy',function(i) {
                pool.splice(pool.indexOf(i),1);
            });
    };

    InstanceList.prototype.init = function(o) {
        var self = this;
        return (o.options
            ? 
            o.options.reduce(function (a,b) {
                return a.then(function() {
                    return self.add(b);
                }); 
            }, Promise.resolve())
            :
            Promise.resolve()
        ).then(function() {
            return self.managers.event.dispatch('init');
        });
    };

    InstanceList.prototype.add = function(o,shift) {
        o.parent = this;
        var t = new InstanceListItem(o);
        this.pool.push(t);
        if (shift) { 
            this.shift(t,shift); 
        } else { 
            this.container.appendChild(t.container); 
        }
        return this.managers.event.dispatch('add',t).then(function() {
            return t;
        });
    };
    InstanceList.prototype.clear = function() {
        return Promise.all([
            this.pool.slice(0).map(function (o) {
                return o.destroy();
            })
        ]);
    };

    InstanceList.prototype.shift = function(o,places) {
        var pool = this.pool,
            c = this.container,
            li = o.container,
            i = pool.indexOf(o);
        if (places+i >= pool.length) {
            places = places+i;
            while (places >= 0) { 
                places -= pool.length;
            }
            --places;
        }
        if (li.parentNode) 
            c.removeChild(li);
        pool.splice(i+places,0,pool.splice(i,1)[0]);
        i = pool.indexOf(o);
        if (i === pool.length-1) { 
            c.appendChild(li);
        } else {
            c.insertBefore(li,pool[i+1].li);
        }
    };

    return InstanceList;
};

})();
