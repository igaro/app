//# sourceURL=instance.list.js

module.requires = [
    { name: 'core.language.js' },
    { name: 'instance.list.css' }
];

module.exports = function(app) {

    "use strict";

    var object = app['core.object'],
        bless = object.bless,
        arrayInsert = object.arrayInsert;

    var InstanceListItem = function(o) {
        this.name = 'item';
        this.container = function(dom) {
            return dom.mk('li',o.parent,o.content,o.className);
        };
        bless.call(this,o);
    };

    var InstanceList = function(o) {
        this.name='instance.list';
        this.asRoot=true;
        this.container=function(dom) {
            return dom.mk('ol',o,null,o.className);
        };
        this.children = {
            items:'item'
        };
        bless.call(this,o);
    };

    InstanceList.prototype.init = function(o) {
        var self = this;
        return (o.items?
            self.addItems(o.items)
            :
            Promise.resolve()
        ).then(function() {
            return self.managers.event.dispatch('init');
        });
    };

    InstanceList.prototype.addItems = function(o) {
        var self = this;
        return object.promiseSequencer(o,function(a) {
            return self.addItem(a);
        });
    };

    InstanceList.prototype.addItem = function(o) {
        o.parent = this;
        var t = new InstanceListItem(o);
        arrayInsert(this.items,t,o);
        return this.managers.event.dispatch('addItem',t).then(function() {
            return t;
        });
    };
    InstanceList.prototype.clear = function() {
        return Promise.all([
            this.items.slice(0).map(function (o) {
                return o.destroy();
            })
        ]);
    };

    InstanceList.prototype.shift = function(o,places) {
        var items = this.items,
            c = this.container,
            li = o.container,
            i = items.indexOf(o);
        if (places+i >= items.length) {
            places = places+i;
            while (places >= 0) {
                places -= items.length;
            }
            --places;
        }
        if (li.parentNode)
            c.removeChild(li);
        items.splice(i+places,0,items.splice(i,1)[0]);
        i = items.indexOf(o);
        if (i === items.length-1) {
            c.appendChild(li);
        } else {
            c.insertBefore(li,items[i+1].container);
        }
    };

    return InstanceList;
};
