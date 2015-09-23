//# sourceURL=instance.form.validate.js

module.requires = [
    { name:'instance.form.validate.css' },
    { name:'core.language.js' }
];

module.exports = function(app) {

    "use strict";

    var bless = app['core.object'].bless,
        dom = app['core.dom'];

    var l = {
        required : _tr("Value required"),
        pattern : _tr("Invalid value"),
        min : _tr("Value too low"),
        minLength : _tr("Length too small"),
        max : _tr("Value too high"),
        isNaN : _tr("Not a number"),
        email : _tr("Invalid email"),
        tel : _tr("Enter only digits")
    };

    var InstanceFormValidate = function(o) {
        this.name = 'instance.form.validation';
        this.asRoot = true;
        bless.call(this,o);
        this.inRealTime = typeof o.inRealTime === 'boolean'? o.inRealTime : true;
        this.rules = o.rules || [];
        this.errorDisplayAmount = 'errorDisplayAmount' in o? o.errorDisplayAmount : 1;
        this.messages = [];
        this.resizeHooks = [];
        if (o.form)
            this.setForm(o.form);
        this.onValidSubmit = o.onValidSubmit;
        this.managers.event.on('destroy', function() {
            return this.clear();
        });
    };

    InstanceFormValidate.prototype.init = function() {
        return this.managers.event.dispatch('init');
    };

    InstanceFormValidate.prototype.setForm = function(form) {
        var self = this;
        this.form = form;
        form.setAttribute('novalidate',true);
        form.classList.add('instance-form-validate');
        this.__allowThrough = false;
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            if (self.__allowThough) {
                self.__allowThrough= false;
                return false;
            }
            event.stopImmediatePropagation();
            return self.check().then(function(valid) {
                if (valid) {
                    self.__allowThrough = true;
                    return self.onValidSubmit.call(self);
                }
            }).catch(function() {
                return self.managers.debug.handle();
            });
        });
        form.addEventListener('change', function() {
            self.onFormModify();
        });
        // fix form init bug where DOM isn't ready to traverse elements
        window.setTimeout(function() {
            self.addTextInputListeners();
        },200);
    };

    InstanceFormValidate.prototype.onFormModify = function() {
        var self = this;
        if (this.inRealTime && ! this.__checkingInSitu) {
            this.__checkingInSitu = true;
            this.check().catch(function (e) {
                return self.managers.debug.handle(e);
            }).then(function() {
                self.__checkingInSitu = false;
            });
        }
    };

    InstanceFormValidate.prototype.getFormElements = function() {
        var m = this.form.elements,
            x = [];
        for(var i=0; i < m.length; ++i) {
            if (['BUTTON','FIELDSET'].indexOf(m[i].nodeName) === -1)
                x.push(m[i]);
        }
        return x;
    };

    InstanceFormValidate.prototype.addTextInputListeners = function() {
        var self = this;
        var m = this.getFormElements();
        m.forEach(function (element) {
            if (element.__igaroFormValidateHooked || (! ('oninput' in element)))
                return;
            element.addEventListener('input', function() {
                self.onFormModify();
            });
            element.__igaroFormValidateHooked = true;
        });
    };

    InstanceFormValidate.prototype.displayError = function(n, msg) {
        if (! this.errorDisplayAmount || this.errorDisplayAmount > this.messages.length) {
            var self = this,
                domMgr = this.managers.dom,
                pn = n.parentNode;
            pn.style.position='relative';
            this.messages.push(domMgr.mk('div',pn,msg, function() {
                this.className = 'validation-message';
                var me = this;
                var pos = function() {
                    me.style.left=n.offsetLeft + 'px';
                    me.style.top= (n.clientHeight+n.offsetTop) + 'px';
                };
                self.resizeHooks.push(pos);
                window.addEventListener('resize',pos);
                pos();
            }));
            var cl = n.classList;
            cl.remove("validation-ok");
            cl.add('validation-fail');
        }
    };

    InstanceFormValidate.prototype.check = function() {
        var self = this,
            eventMgr = self.managers.event,
            addMsg = function(n,l) {
                self.displayError(n,l);
                return Promise.resolve(true);
            };
        return this.clear().then(function () {
            return Promise.all(self.getFormElements().map(function(element) {
                if (element.getAttribute('no-validate'))
                    return Promise.resolve();
                element.classList.add('validation-ok');
                var value = element.nodeName === 'SELECT'? element.options[element.selectedIndex].value  : element.value.trim(),
                    type = element.type? element.type.toLowerCase() : null;
                if (element.required && ! value.length) {
                    return addMsg(element, l.required);
                }
                if (type === 'email') {
                    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                    if (! filter.test(value))
                        return addMsg(element, l.email);
                }
                if (type === 'tel' && ! /^([0-9])+$/.test(value)) {
                    return addMsg(element, l.tel);
                }
                if (type === 'number') {
                    if (isNaN(value))
                        return addMsg(element, l.isNaN);
                    if (typeof element.min !== 'undefined' && value < parseInt(element.min))
                        return addMsg(element, l.min);
                    if (typeof element.max !== 'undefined' && value < parseInt(element.max))
                        return addMsg(element, l.max);
                }
                if (typeof element.min !== 'undefined' && value.length < element.min)
                    return addMsg(element, l.minLength);
                if (element.pattern && ! new RegExp(element.pattern).test(value))
                    return addMsg(element, l.pattern);

                // custom rules
                var elementRules = [];
                self.rules.forEach(function (o) {
                    if (element.name === o[0])
                        elementRules.push(o[1].call(o,value));
                });

                // reduce promises
                return elementRules.reduce(function(a,b) {
                    return a.then(function() {
                        if (b instanceof Promise) {
                            return b.then(function(v) {
                                if (v)
                                    return addMsg(element,v);
                            });
                        }
                        if (b)
                            return addMsg(element,b);
                    });
                }, Promise.resolve());
            })).then(function(results) {
                var valid = results.every(function(o) {
                    return !o;
                });
                return eventMgr.dispatch('validated',valid).then(function() {
                    return valid;
                });
            });
        });
    };

    InstanceFormValidate.prototype.clear = function() {
        this.resizeHooks.forEach(function (h) {
            if (h)
                window.removeEventListener('resize',h);
        });
        this.resizeHooks = [];
        this.getFormElements().forEach(function(o) {
            var cl = o.classList;
            cl.remove("validation-fail");
            cl.remove("validation-ok");
        });
        var self = this;
        return Promise.all(this.messages.map(function (element) {
            return dom.rm(element);
        })).then(function () {
            self.messages = [];
            return self.managers.event.dispatch('clear');
        });
    };

    return InstanceFormValidate;

};
