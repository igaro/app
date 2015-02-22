(function() {

'use strict';

module.requires = [
    { name:'instance.modaldialog.css' },
    { name:'core.language.js' }
];

module.exports = function(app) {

    var l = {
        confirm : {"en":"Confirm"},
        ok : {"en":"Ok"},
        cancel : {"en":"Cancel"}
    },
    zIndexAt = 999999,
    body = document.body,
    bodyStyle = body.style;

    var InstanceModalDialog = function(o) {
        bless.call(this,{
            name:'instance.modaldialog',
            parent:o && o.parent? o.parent : null,
            asRoot:true
        });
        this.bodyOverflowPrevious = bodyStyle.overflow;
        bodyStyle.overflow = 'hidden';
    };

    InstanceModalDialog.prototype.custom = function(o) {
        var dom = this.managers.dom,
            container = this.container = dom.mk('div',body,null, function() {
                this.className = 'instance-modaldialog';
                this.style.zIndex = zIndexAt;
            }),
            wrapper = dom.mk('div',container,null,function() {
                this.className = o.type || 'custom';
                this.addEventListener('click', function(event) {
                    event.stopPropagation();
                });
            }),
            self = this,
            canCancel = !!! o.noCancel,
            myActions = o.actions;

        zIndexAt+=1;

        return new Promise(function(resolve) {

            var msg = o.message;
            if (msg) {
                if (typeof msg === 'object') {
                    Object.keys(msg).forEach(function (k) {
                        msg[k] = msg[k].replace(/\\n/g,"<br>");
                    });
                }
                dom.mk('div',wrapper,msg,'message');
            }

            if (o.custom) // custom elements
                dom.mk('div',wrapper,o.custom,'custom');

            self.resolve = function(action) {
                bodyStyle.overflow = self.bodyOverflowPrevious;
                resolve(action);
                return self.destroy();
            };

            // actions
            if (myActions || canCancel) {
                var actionDiv = dom.mk('div',wrapper,null,'action');
                if (myActions) {
                    myActions = myActions.map(function (action) {
                        return action.element = dom.mk('button',actionDiv,action.l,function() {
                            if (action.id)
                                this.className = action.id;
                            if (action.onClick)
                                this.addEventListener('click', function(event) {
                                    if (action.onClick(event) === false)
                                        event.stopImmediatePropagation();
                                });
                            this.addEventListener('click', function() {
                                self.resolve(action).catch(function (e) {
                                    self.managers.debug.handle(e);
                                });
                            });
                        });         
                    });
                }
                if (canCancel) {
                    var r = function() {
                        self.resolve();
                    };
                    dom.mk('button',actionDiv,l.cancel,function() {
                        this.addEventListener('click', r);
                        this.focus();
                        container.addEventListener('click', function(event) {
                            event.stopPropagation();
                            r();
                        });
                    });
                }
            }

            // give dom 35ms to display
            setTimeout(function() {
                // focus singular button
                if (myActions.length === 1)
                    myActions[0].focus();
                // setup, usually used for custom focusing
                if (o.setup)    
                    o.setup();
            },35);

        });
    };

    InstanceModalDialog.prototype.action = function(o) {
        return this.custom(
            {
                type : 'action',
                message : o.message,
                actions : o.actions
            }
        );
    };

    InstanceModalDialog.prototype.alert = function(o) {
        return this.custom(
            {
                type : 'alert',
                noCancel : true,
                message : o.message,
                actions : [
                    {
                        l : l.ok
                    }
                ]
            }
        );
    };
    
    InstanceModalDialog.prototype.confirm = function(o) {
        return this.custom(
            {
                type : 'confirm',
                message : o.message,
                actions : [
                    {
                        l : l.confirm
                    }
                ]
            }
        );
    };

    return InstanceModalDialog;

};

})();