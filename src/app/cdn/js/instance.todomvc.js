//# sourceURL=instance.todomvc.js

(function() {

    'use strict';

    module.requires = [
        { name: 'instance.todomvc.css' },
        { name: 'core.store.js' }
    ];

    module.exports = function(app) {

        var object = app['core.object'],
            dom = app['core.dom'],
            bless = object.bless,
            arrayInsert = object.arrayInsert;

/*------------------------------------------------------------------------------------------------*/

        var makeIncompleteStr = function(incomplete) {

            return this.substitute(this.tr((({ key:"%[0] item left", plural:"%[0] items left" })),incomplete),incomplete);
        };

/*------------------------------------------------------------------------------------------------*/

        /* List Item (aka LI)
         * @params {object} [o] - config literal. See online help for attributes.
         * @constructor
         * */
        var TodoMVCListItem = function(o) {

            var self = this;
            this.name='item';
            o.container = o.parent.container;

            // called by bless
            this.container = function(domMgr) {

                var managers = self.managers,
                    debugMgr = managers.debug;

                // li Element
                return domMgr.mk('li',o,null,function() {

                    // saves checkbox onto object
                    self.checkbox = domMgr.mk('input[checkbox]',this,null,function() {

                        this.addEventListener('click',function() {

                            self.setCompleted(this.checked)['catch'](function(e) {

                                return debugMgr.handle(e);
                            });
                        });
                    });

                    // saves span onto object
                    self.desc = domMgr.mk('span',this,o.desc, function() {

                        this.contentEditable = true;
                        this.addEventListener('input', function() {

                            return managers.event.dispatch('updateDesc')['catch'](function(e) {

                                return debugMgr.handle(e);
                            });
                        });
                    });

                    // delete button
                    domMgr.mk('button',this,'x').addEventListener('click', function() {

                        self.destroy()['catch'](function(e) {
                            return debugMgr.handle(e);
                        });
                    });

                    this.setAttribute('data-completed',false);
                });
            };

            bless.call(this,o);
            this.setCompleted(o.completed || false);
        };

        /* Sets an item's status
         * @param {boolean} complete
         * @returns {Promise}
         */
        TodoMVCListItem.prototype.setCompleted = function(complete) {

            if (typeof complete !== 'boolean')
                throw new TypeError("First argument is not of type boolean");

            this.container.setAttribute('data-completed',complete);
            this.checkbox.checked = this.completed = complete;
            return this.managers.event.dispatch('setCompleted',complete);
        };

/*------------------------------------------------------------------------------------------------*/

        /* List item (aka UL)
         * @param {object} [o] - config literal. See online help for attributes.
         * @constructor
         * */
        var TodoMVCList = function(o) {

            var self = this;
            this.name = 'list';
            this.children = {
                'items' : 'item'
            };
            this.managers   = {
                store:app['core.store']
            };
            this.container = function(domMgr) {

                return domMgr.mk('ul',this,null,"todo-list");
            };

            bless.call(this,o);

            // auto save on events
            this.managers.event.on([
                'item.setCompleted',
                'item.destroy',
                'item.updateDesc',
                'addItem'
            ], function() {

                return self.save();
            });
        };

        /* Save a list to the store
         * @returns {Promise}
         */
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

        /* Adds a new item to the list
         * @returns {Promise} containing a TodoMVCListItem
         */
        TodoMVCList.prototype.addItem = function(o) {

            o.parent = this;
            var item = new TodoMVCListItem(o);
            arrayInsert(this.items,item,o);
            return this.managers.event.dispatch('addItem',item).then(function() {

                return item;
            });
        };

        /* Loads all items from the store into the list
         * @returns {Promise}
         */
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

        /* Clears all items from the list. Saves manually for efficiency.
         * @returns {Promise}
         */
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

        /* Toggles the state of multiple items. Saves manually for efficiency.
         * @returns {Promise}
         */
        TodoMVCList.prototype.toggleCompleted = function(status) {

            var self = this;
            this.nosave = true;
            return Promise.all([
                this.items.slice(0).map(function (o) {

                    if (! o.completed && status || o.completed && ! status)
                        return o.setCompleted(status);
                })
            ]).then(function() {

                self.nosave = false;
                return self.save();
            });
        };

        /* Counts the incomplete items
         * @returns {number}
         */
        TodoMVCList.prototype.countIncomplete = function() {

            return this.items.filter(function(item) {

                return ! item.completed;
            }).length;
        };

/*------------------------------------------------------------------------------------------------*/

        /* Manager
         * @constructor
         * @param {object} [o] - config literal - see online help for attributes
         */
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

            // add new list
            var list = this.list = new TodoMVCList({

                parent:this
            });

            var self = this,
                managers = this.managers,
                domMgr = managers.dom,
                debugMgr = managers.debug;

            // header
            domMgr.mk('section',this,null,function() {

                this.className = 'header';

                domMgr.mk('input[checkbox]',this, null, function() {

                    this.addEventListener('change', function() {

                        return list.toggleCompleted(this.checked)['catch'](function(e) {

                            return debugMgr.handle(e);
                        });
                    });
                });

                domMgr.mk('input[text]',this,null,function() {

                    this.autofocus = true;
                    this.placeholder = "What needs to be done?";
                    this.addEventListener('keypress', function(event) {

                        if(event.keyCode === 13) {
                            var v = this.value.trim();
                            if (v.length) {
                                this.value='';
                                list.addItem({ desc:v })['catch'](function (e) {

                                    return debugMgr.handle(e);
                                });
                            }
                        }
                    });
                });
            });

            // main
            domMgr.mk('section',this,null,function() {

                this.className = 'main';
                this.appendChild(list.container);
            });

            // footer
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

                    self.itemsleft = domMgr.mk('span',this,function() {

                        return makeIncompleteStr.call(this,list.countIncomplete());
                    });
                });

                domMgr.mk('button',this,"Clear completed",function() {

                    this.className = "clear-completed";
                    this.addEventListener('click',function() {

                        return list.clearCompleted()['catch'](function(e) {

                            return debugMgr.handle(e);
                        });
                    });
                });
            });
        };

        /* Async Constructor
         * @returns {Promise}
         */
        TodoMVC.prototype.init = function() {

            var container = this.container,
                list = this.list,
                managers = this.managers,
                self = this;

            var exec = function() {

                var incomplete = list.countIncomplete(),
                    itemCnt = list.items.length;
                container.setAttribute('data-hasItems', itemCnt !== 0);
                container.setAttribute('data-hasCompleted', itemCnt-incomplete !== 0);
                dom.setContent(self.itemsleft, function() { return makeIncompleteStr.call(this,list.countIncomplete()); });
            };

            managers.event.on('list.save',exec);

            return list.load().then(function() {

                return exec();
            });
        };
        return TodoMVC;

    };

})(this);
