(function() {

'use strict';

module.requires = [
    { name:'instance.form.validate.css' },
    { name:'core.language.js' }
];

module.exports = function(app) {

    var msgonevent,
        bless = app['core.bless'];

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
        bless.call(this,{
            name:'instance.form.navigation',
            parent:o.parent,
            asRoot:true
        });
        var dom = this.managers.dom,
            self = this;
        if (o.form)
            this.setForm(form);
        this.inRealTime = typeof o.inRealTime === 'boolean'? o.inRealTime : true;
        this.rules = o.rules || [];
        this.onFail = o.onFail;
        this.errorDisplayAmount = 'errorDisplayAmount' in o? o.errorDisplayAmount : 1;
        this.onOk = o.onOk;
        this.runOnChange = 'runOnChange' in o? o.runOnChange : true;
        this.messages = [];
        this.resizeHooks = [];
        this.managers.event.on('destroy', function() {
            return self.clear();
        });
    };

    InstanceFormValidate.prototype.setForm = function(form) {
        var self = this;
        this.form = form;
        form.setAttribute('novalidate',true);
        form.classList.add('instance-form-validate');
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            if (self.check().then(function(v) {
                if (! v)
                    event.stopImmediatePropagation();
            }));
        });
        form.addEventListener('change', function() {
            self.onFormModify();
        });
        // fix form init bug where DOM isn't ready to traverse elements
        setTimeout(function() {
            self.addTextInputListeners();
        },200);
    };    

    InstanceFormValidate.prototype.onFormModify = function() {
        var self = this;
        if (this.inRealTime && ! this.__checkingInSitu) {
            this.__checkingInSitu = true;
            this.check().catch(function (e) {
                self.managers.debug.handle(e);
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

    InstanceFormValidate.prototype.check = function() {
        var self = this,
            dom = this.managers.dom;
        return this.clear().then(function () {
            var addMsg = function(n, msg) {
                if (! self.errorDisplayAmount || self.errorDisplayAmount > self.messages.length) {
                    var pn = n.parentNode;
                    pn.style.position='relative';
                    self.messages.push(dom.mk('div',pn,msg, function() {
                        this.className = 'validation-message';
                        var me = this;
                        var pos = function() {
                            me.style.left=n.offsetLeft + 'px';
                            me.style.top= (n.clientHeight+n.offsetTop) + 'px';
                        };
                        self.resizeHooks.push(window.addEventListener('resize',pos));
                        pos();
                    }));
                    var cl = n.classList;
                    cl.remove("validation-ok");
                    cl.add('validation-fail');
                }
            };

            var p = self.getFormElements().map(function(element) {

                if (['submit','button'].indexOf(element.type.toLowerCase()) !== -1 || element.getAttribute('no-validate'))
                    return;

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
                if (element.pattern) {
                    var r = new RegExp(element.pattern);
                    if (! r.test(value))
                        return addMsg(element, l.pattern);
                }

                // custom rules
                var elementRules = [];
                self.rules.forEach(function (o) {
                    if (element.name === o[0]) 
                        elementRules.push(o[1](value));
                });

                if (! elementRules.length)
                    return Promise.resolve(true);

                // handle async/sync values
                return new Promise(function (resolve) {
                    var at=0;
                    var doNext = function() {
                        var s = elementRules[at];
                        if (at === elementRules.length)
                            return resolve(true);
                        if (s instanceof Promise) {
                            s.then(function(v) {
                                if (! v) {
                                    addMsg(element,v);
                                    resolve();
                                } else {
                                    at++;
                                    doNext();
                                }
                            });
                        } else if (s) {
                            addMsg(element,s);
                            resolve();
                        } else {
                            at++;
                            doNext();
                        }
                    };
                    doNext();
                });

            });

            return Promise.all(p).then(function(o) {
                if (o.every(function(x) {
                    return x;
                })) {
                    if (self.onOk)
                        self.onOk();
                    return true;
                }
                if (self.onFail)
                    self.onFail();
                return false;
            });

        });
       
    };

    InstanceFormValidate.prototype.clear = function() {
        this.resizeHooks.forEach(function (h) {
            if (h)
                window.removeEventListener(h);
        });
        this.resizeHooks = [];
        this.getFormElements().forEach(function(o) {
            var cl = o.classList;
            cl.remove("validation-fail");
            cl.remove("validation-ok");
        });
        var self = this,
            dom = this.managers.dom;
        return Promise.all(this.messages.map(function (element) {
            return dom.rm(element);
        })).then(function () {
            self.messages = [];
        });
    };

    return InstanceFormValidate;

};

})();