//# sourceURL=instance.todomvc.js

(function() {

'use strict';

module.requires = [
    { name: 'instance.todomvc.css' },
    { name: 'core.store.js' }
];

module.exports = function(app) {

    var object = app['core.object'],
        bless = object.bless,
        arrayInsert = object.arrayInsert;

    /* item */
    var TodoMVCListItem = function(o) {
        this.name='item';
        o.container = o.parent.container;
        var self = this;
        this.container = function(dom) {
            var managers = self.managers,
                debugMgr = managers.debug;
            return dom.mk('li',o,null,function() {
                self.checkbox = dom.mk('input[checkbox]',this,null,function() {
                    this.addEventListener('click',function() {
                        self.setCompleted(this.checked).catch(function(e) {
                            return debugMgr.handle(e);
                        });
                    });
                });
                this.setAttribute('data-completed',false);
                self.desc = dom.mk('span',this,o.desc, function() {
                    this.contentEditable = true;
                    this.addEventListener('input', function() {
                        return managers.event.dispatch('updateDesc').catch(function(e) {
                            return debugMgr.handle(e);
                        });
                    });
                });
                dom.mk('button',this,'x').addEventListener('click', function() {
                    self.destroy().catch(function(e) {
                        return debugMgr.handle(e);
                    });
                });
            });
        };
        bless.call(this,o);
        this.setCompleted(o.completed || false);
    };
    TodoMVCListItem.prototype.setCompleted = function(complete) {
        this.container.setAttribute('data-completed',complete);
        this.checkbox.checked = this.completed = complete;
        return this.managers.event.dispatch('setCompleted',complete);
    };

    /* list */
    var TodoMVCList = function(o) {
        var self = this;
        this.name='list';
        this.children={
            'items' : 'item'
        };
        this.managers = {
            store:app['core.store']
        };
        this.container = function(dom) {
            return dom.mk('ul',this,null,function() {
                this.className="todo-list";
            });
        };
        bless.call(this,o);
        this.managers.event.on([
            'item.setCompleted',
            'item.destroy',
            'item.updateDesc',
            'addItem'
        ], function() {
            return self.save();
        });
    };
    TodoMVCList.prototype.save = function() {
        if (this.nosave)
            return Promise.resolve();
        var self = this,
            managers = this.managers;
        return managers.store.set('items',
            self.items.map(function (o) {
                return {
                    completed: o.completed,
                    desc : o.desc.innerHTML
                };
            })
        ).then(function() {
            return managers.event.dispatch('save');
        });
    };
    TodoMVCList.prototype.addItem = function(o) {
        o.parent = this;
        var item = new TodoMVCListItem(o);
        arrayInsert(this.items,item,o);
        return this.managers.event.dispatch('addItem',item).then(function() {
            return item;
        });
    };
    TodoMVCList.prototype.load = function() {
        var self = this;
        this.nosave = true;
        return this.managers.store.get('items').then(function(o) {
            if (o instanceof Array)
                return object.promiseSequencer(o, function(o) {
                    return self.addItem(o);
                });
        }).then(function() {
            self.nosave = false;
        });
    };
    TodoMVCList.prototype.clearCompleted = function() {
        var self = this;
        this.nosave = true;
        return Promise.all(
            this.items.slice(0).map(function (o) {
                if (o.completed)
                    return o.destroy();
            })
        ).then(function() {
            self.nosave = false;
            return self.save();
        });
    };
    TodoMVCList.prototype.toggleCompleted = function(v) {
        var self = this;
        this.nosave = true;
        return Promise.all([
            this.items.slice(0).map(function (o) {
                if (! o.completed && v || o.completed && ! v)
                    return o.setCompleted(v);
            })
        ]).then(function() {
            self.nosave = false;
            return self.save();
        });
    };
    TodoMVCList.prototype.countIncomplete = function() {
        var i = 0;
        this.items.forEach(function(o) {
            if (! o.completed)
                ++i;
        });
        return i;
    };

    /* instantiator */
    var TodoMVC = function(o) {
        this.name = 'instance.todomvc';
        this.asRoot = true;
        this.managers = {
            store : app['core.store']
        };
        this.container = function(domMgr) {
            return domMgr.mk('div',o,null,function() {
                this.setAttribute('data-filter','all');
            });
        };
        bless.call(this,o);
        var list = this.list = new TodoMVCList({
            parent:this
        });
        var self = this,
            managers = this.managers,
            domMgr = managers.dom,
            debugMgr = managers.debug;
        domMgr.mk('section',this,null,function() {
            this.className = 'header';
            domMgr.mk('input[checkbox]',this).addEventListener('change', function() {
                return list.toggleCompleted(this.checked).catch(function(e) {
                    return debugMgr.handle(e);
                });
            });
            domMgr.mk('input[text]',this,null,function() {
                this.autofocus = true;
                this.placeholder = "What needs to be done?";
            }).addEventListener('keypress', function(event) {
                if(event.keyCode === 13) {
                    var v = this.value.trim();
                    if (v.length) {
                        this.value='';
                        list.addItem({ desc:v }).catch(function (e) {
                            return debugMgr.handle(e);
                        });
                    }
                }
            });
        });
        domMgr.mk('section',this,null,function() {
            this.className = 'main';
        }).appendChild(list.container);
        domMgr.mk('section',this,null,function() {
            this.className = 'footer';
            domMgr.mk('div',this,null,function() {
                this.className='filter';
                [
                    ['all',domMgr.mk('button',this,"All")],
                    ['active',domMgr.mk('button',this,"Active")],
                    ['completed',domMgr.mk('button',this,"Completed")]
                ].forEach(function(o) {
                    o[1].addEventListener('click',function() {
                        self.container.setAttribute('data-filter',o[0]);
                    });
                });
            });
            domMgr.mk('span',this,null,function() {
                self.itemsleft = domMgr.mk('span',this);
            });
            domMgr.mk('button',this,"Clear completed","clear-completed").addEventListener('click',function() {
                return list.clearCompleted().catch(function(e) {
                    return debugMgr.handle(e);
                });
            });
        });
    };
    TodoMVC.prototype.init = function() {
        var self = this,
            list = this.list,
            managers = this.managers;
        var exec = function() {
            var incomplete = list.countIncomplete(),
                itemCnt = list.items.length;
            self.container.setAttribute('data-hasItems', itemCnt !== 0);
            self.container.setAttribute('data-hasCompleted', itemCnt-incomplete !== 0);
            self.itemsleft.innerHTML = incomplete === 1? "1 item left" : incomplete + " items left";
        };
        managers.event.on('list.save',exec);
        return list.load().then(function() {
            return exec();
        });
    };
    return TodoMVC;

};

})();
