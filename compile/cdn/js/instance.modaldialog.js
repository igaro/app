//# sourceURL=instance.modaldialog.js

module.requires = [
    { name:'instance.modaldialog.css' },
    { name:'core.language.js' }
];

module.exports = function(app,params) {

    "use strict";

    var zIndexAt = 999999,
        body = document.body,
        bodyStyle = body.style,
        activeCnt = 0,
        bless = app['core.object'].bless;

    var InstanceModalDialog = function(o) {
        this.name='instance.modaldialog';
        this.asRoot=true;
        bless.call(this,o);
    };

    InstanceModalDialog.prototype.init = function() {
        return this.managers.event.dispatch('init');
    };

    InstanceModalDialog.prototype.custom = function(o) {
        if (! o)
            o = {};
        var domMgr = this.managers.dom,
            self = this,
            container = this.container = domMgr.mk('div',body,null, function() {
                this.className = 'igaro-instance-modaldialog';
                this.style.zIndex = zIndexAt;
                if (! o.noClose) {
                    this.addEventListener('click', function() {
                        return self.resolve();
                    });
                }
            }),
            wrapper = domMgr.mk('div',container,null,function() {
                this.className = o.type || 'custom';
                this.addEventListener('click', function(event) {
                    event.stopPropagation();
                });
            }),
            myActions = o.actions || [];

        zIndexAt+=1;
        activeCnt++;
        bodyStyle.overflow = 'hidden';
        params.conf.noBodyStyleOverflowReset = true;

        return new Promise(function(resolve) {

            if (o.title)
                o.header = domMgr.mk('h1',null,o.title);
            if (o.header)
                domMgr.mk('div',wrapper,o.header,'header');

            domMgr.mk('div',wrapper,null,function() {
                var self = this,
                    msg = o.message;
                this.className = 'body';
                if (msg) {
                    if (typeof msg === 'object') {
                        Object.keys(msg).forEach(function (k) {
                            msg[k] = msg[k].replace(/\\n/g,"<br>");
                        });
                    }
                    domMgr.mk('div',self,msg,'message');
                }
                if (o.custom) // custom elements
                    domMgr.mk('div',self,o.custom,'custom');
            });

            self.resolve = function(action) {
                activeCnt--;
                if (! activeCnt) {
                    bodyStyle.overflow = '';
                    params.conf.noBodyStyleOverflowReset = false;
                }
                resolve(action);
                return self.destroy();
            };

            // add cancel or close
            if (o.addCancel || ! myActions.length) {
               myActions.push({
                    l:o.addCancel? _tr("Cancel") : _tr("Close")
               });
            }

            domMgr.mk('div',wrapper,null,function() {
                this.className = 'action';
                var actDiv = this;
                myActions = myActions.map(function (action) {
                    action.element = domMgr.mk('button',actDiv,action.l,function() {
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
                    return action.element;
                });
            });

            // give dom time to update
            window.setTimeout(function() {
                // focus singular button
                if (myActions && myActions.length === 1)
                    myActions[0].focus();
                // setup, usually used for custom focusing
                if (o.setup)
                    o.setup();
            },50);

        });
    };

    InstanceModalDialog.prototype.action = function(o) {
        return this.custom(
            {
                type : 'action',
                message : o.message,
                custom: o.custom,
                title: o.title,
                actions : o.actions
            }
        );
    };

    InstanceModalDialog.prototype.alert = function(o) {
        return this.custom(
            {
                type : 'alert',
                message : o.message,
                custom: o.custom,
                title : o.title,
                actions : [
                    {
                        l : _tr("Ok")
                    }
                ]
            }
        );
    };

    InstanceModalDialog.prototype.confirm = function(o) {
        var confirmAction = {
            l : _tr("Confirm")
        };
        return this.custom({
            type : 'confirm',
            message : o.message,
            custom: o.custom,
            title: o.title,
            actions : [confirmAction],
            addCancel : true
        }).then(function(action) {
            return action === confirmAction;
        });
    };

    return InstanceModalDialog;

};
