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

    /* Validation Instance
     * @constructor
     * @param {object} [o] config literal
     * @returns {InstanceFormValidate}
     */
    var InstanceFormValidate = function(o) {

        this.name = 'instance.form.validation';
        this.asRoot = true;
        bless.call(this,o);
        this.inRealTime = typeof o.inRealTime === 'boolean'? o.inRealTime : true;
        this.rules = o.rules || [];
        this.errorDisplayAmount = 'errorDisplayAmount' in o? o.errorDisplayAmount : 1;
        this.messages = [];
        this.resizeHooks = [];
        this.onValidSubmit = o.onValidSubmit;
        this.managers.event.on('destroy', function() {
            return this.clear();
        });
        if (o.form)
            this.setForm(o.form);
    };

    /* Async constructor
     * @constructor
     * @param {object} [o] config literal
     * @returns {Promise}
     */
    InstanceFormValidate.prototype.init = function(o) {

        return this.managers.event.dispatch('init');
    };

    /* Applies a form to the validation object
     * @param {object} form - standard form element
     * @returns {null}
     */
    InstanceFormValidate.prototype.setForm = function(form) {

        var self = this;
        this.form = form;
        this.__allowThrough = false;
        form.setAttribute('novalidate',true);
        form.classList.add('instance-form-validate');

        // event: submit
        form.addEventListener('submit', function(event) {

            event.preventDefault();
            if (self.__allowThough) {
                self.__allowThrough = false;
                return false;
            }
            event.stopImmediatePropagation();
            return self.check().then(function(valid) {

                if (valid) {
                    self.__allowThrough = true;
                    return self.onValidSubmit.call(self);
                }
            })['catch'](function() {

                return self.managers.debug.handle();
            });
        });

        // event: change
        form.addEventListener('change', function() {
            self.onFormModify();
        });

        // fix form init bug where DOM isn't ready to traverse elements
        window.setTimeout(function() {

            self.addTextInputListeners();
        },200);
    };

    /* Usually triggered upon form control modification
     * @returns {null}
     */
    InstanceFormValidate.prototype.onFormModify = function() {

        var self = this;
        if (this.inRealTime && ! this.__checkingInSitu) {

            this.__checkingInSitu = true;
            this.check()['catch'](function (e) {

                return self.managers.debug.handle(e);
            }).then(function() {

                self.__checkingInSitu = false;
            });
        }
    };

    /* Checks the form for valididity
     * @returns {Array} of form elements
     */
    InstanceFormValidate.prototype.getFormElements = function() {

        return Array.prototype.slice.call(this.form.elements).map(function(ctl) {

            if (! /BUTTON|FIELDSET/.test(ctl.nodeName.toUpperCase()))

                return ctl;
        });
    };

    /* Adds text input listeners
     * @returns {null}
     */
    InstanceFormValidate.prototype.addTextInputListeners = function() {

        var self = this;
        this.getFormElements().forEach(function (element) {

            if (element.__igaroFormValidateHooked || (! ('oninput' in element)))
                return;

            element.addEventListener('input', function() {

                self.onFormModify();
            });
            element.__igaroFormValidateHooked = true;
        });
    };

    /* Displays an error near a control
     * @param {object} ctl - form control
     * @param {object} msg - language literal to pull text from
     * @returns {null}
     */
    InstanceFormValidate.prototype.displayError = function(ctl, msg) {

        if (this.errorDisplayAmount && this.errorDisplayAmount < this.messages.length)
            return;

        if (! (ctl instanceof Node))
            throw new TypeError("First argument must be an instance of Node");

        if (typeof msg !== 'object')
            throw new TypeError("Second argument must be an object");

        var self = this,
            domMgr = this.managers.dom,
            pn = ctl.parentNode;

        pn.style.position='relative';

        this.messages.push(domMgr.mk('div',pn,msg,function() {

            var me = this,
                pos = function() {

                    me.style.left=ctl.offsetLeft + 'px';
                    me.style.top= (ctl.clientHeight+ctl.offsetTop) + 'px';
                };

            this.className = 'validation-message';
            self.resizeHooks.push(pos);
            window.addEventListener('resize',pos);
            pos();
        }));

        var cl = ctl.classList;
        cl.remove("validation-ok");
        cl.add('validation-fail');
    };

    /* Checks the fform for valididity
     * @returns {Promise} containing boolean
     */
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

                // required
                if (element.required && ! value.length)
                    return addMsg(element, l.required);

                // valid email
                if (type === 'email' && ! /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value))
                    return addMsg(element, l.email);

                // valid tel
                if (type === 'tel' && ! /^([0-9])+$/.test(value))
                    return addMsg(element, l.tel);

                // valid number
                if (type === 'number') {

                    if (isNaN(value))
                        return addMsg(element, l.isNaN);

                    if (typeof element.min !== 'undefined' && value < parseInt(element.min))
                        return addMsg(element, l.min);

                    if (typeof element.max !== 'undefined' && value < parseInt(element.max))
                        return addMsg(element, l.max);
                }

                // range
                if (typeof element.min !== 'undefined' && value.length < element.min)
                    return addMsg(element, l.minLength);

                // pattern
                if (element.pattern && ! new RegExp(element.pattern).test(value))
                    return addMsg(element, l.pattern);

                // custom rules
                return self.rules.map(function (o) {

                    if (element.name === o[0])
                        return o[1].call(o,value);

                // reduce promises
                }).reduce(function(a,b) {

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

    /* Clears validation warnings
     * @returns {Promise}
     */
    InstanceFormValidate.prototype.clear = function() {

        var self = this;
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
        return Promise.all(this.messages.map(function (element) {

            return dom.rm(element);
        })).then(function () {

            self.messages = [];
            return self.managers.event.dispatch('clear');
        });
    };

    return InstanceFormValidate;

};
