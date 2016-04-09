//# sourceURL=instance.pagemessage.js

(function(env) {

    module.requires = [
        { name:'instance.pagemessage.css' },
        { name:'core.language.js' },
        { name:'core.store.js' }
    ];

    module.exports = function(app) {

        "use strict";

        var bless = app['core.object'].bless;

        /* Page Message
         * @constructor
         * @param {object} [o] - config literal. See online help for attributes
         */
        var InstancePageMessage = function(o) {

            var self = this;
            o = o || {};
            this.name='instance.pagemessage';
            this.asRoot=true;
            this.managers = {
                store:app['core.store']
            };
            this.container = function(dom) {

                var managers = self.managers;

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
                                return managers.store.set(self.id, { hidden:true }).then(function() {

                                    return self.destroy();
                                })['catch'](function(e) {

                                    return managers.debug.handle(e);
                                });
                            });
                        });
                    });
                });
            };
            this.id = o.id;
            bless.call(this,o);
        };

        /* Async Constructor
         * @param {object} [o] - config literal. See online help for attributes
         * @returns {Promise}
         */
        InstancePageMessage.prototype.init = function(o) {

            o = o || {};
            var self = this,
                hideable = o.hideable,
                managers = this.managers;

            if (hideable)
                this.container.firstChild.classList.add('hideable');

            return managers.event.dispatch('init').then(function() {

                if (hideable) {
                    return managers.store.get(self.id).then(function(d) {

                        if (d && d.hidden)
                            return self.destroy();
                    });
                }
            });
        };

        return InstancePageMessage;
    };

})(this);
