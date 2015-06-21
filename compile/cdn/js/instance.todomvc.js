
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

    /* list item */
    var TodoMVCListItem = function(o) {
        this.name='item';
        o.container = o.parent.container;
        var self = this;
        this.container = function(dom) {
            return dom.mk('li',o,null,function() {
                self.checkbox = dom.mk('input[checkbox]',this);
                dom.mk('span',this,o.content, function() {
                    this.contentEditable = true;

                });
                dom.mk('button',this).addEventListener('click', function() {
                    self.destroy();
                });
            });
        };
        this.completed = false;
        this.desc = o.content;
        bless.call(this,o);
    };
    TodoMVCListItem.prototype.setCompleted = function(complete) {
        this.checkbox.checked = this.completed = complete;
        return this.managers.event.dispatch('setCompleted',complete);
    };
    TodoMVCListItem.prototype.updateDesc = function(text) {
        this.desc = text;
        this.managers.dom.setContent(this.container,text);
        return this.managers.event.dispatch('updateValue',text);
    };

    /* list */
    var TodoMVCList = function(o) {
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

        var self = this;
        this.managers.event.on([
            'item.setCompleted',
            'item.destroy',
            'item.updateValue',
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
        return managers.store.set('localStore', {
            data : self.items.map(function (o) {
                return {
                    completed: o.completed,
                    desc : o.desc
                };
            })
        }).then(function() {
            return managers.event.dispatch('save');
        });
    };
    TodoMVCList.prototype.addItem = function(o) {
        o.parent = this;
        var t = new TodoMVCListItem(o);
        arrayInsert(this.items,t,o);
        return this.managers.event.dispatch('addItem',t).then(function() {
            return t;
        });
    };
    TodoMVCList.prototype.addItems = function(o) {
        o.parent = this;
        var t = new TodoMVCListItem(o);
        arrayInsert(this.items,t,o);
        return this.managers.event.dispatch('addItem',t).then(function() {
            return t;
        });
    };
    TodoMVCList.prototype.clearCompleted = function() {
        var self = this;
        this.nosave = true;
        return Promise.all([
            this.items.slice(0).map(function (o) {
                if (o.completed)
                    return o.destroy();
            })
        ]).then(function() {
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
        return this.items.reduce(function(a,b) {
            return a + b.completed? 0:1;
        }, 0);
    };

    /* instantiator */
    var TodoMVC = function(o) {
        this.name = 'instance.todomvc';
        this.asRoot = true;
        this.container = function(domMgr) {
            return domMgr.mk('section',o);
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
            domMgr.mk('input[checkbox]',this,null,"toggle-all").addEventListener('change', function() {
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
                        list.addItem({ content:v }).catch(function (e) {
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
                domMgr.mk('button',this,"All");
                domMgr.mk('button',this,"Active");
                domMgr.mk('button',this,"Completed");
            });
            domMgr.mk('span',this,null,function() {
                domMgr.mk('strong',this,0);
                self.itemsleft = domMgr.mk('span',this);
            });
            domMgr.mk('button',this,"Clear completed","clear-completed");
        });

        managers.event.on('list.save', function() {
            var inComplete = list.countIncomplete();
            self.itemsleft.innerHTML = inComplete === 1? "1 item left" : inComplete + " items left";
        });

    };

    TodoMVC.prototype.init = function() {
        return Promise.resolve();
    };

    return TodoMVC;

};

})();
