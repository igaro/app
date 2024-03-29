//# sourceURL=instance.form.validate.js

module.requires = [
    { name: 'instance.form.validate.css' },
    { name: 'core.language.js' }
]

module.exports = function (app) {

    "use strict"

    var bless = app['core.object'].bless,
        dom = app['core.dom']

    var l = {
        required : function () { return this.tr((({ key:"Required" }))) },
        pattern : function () { return this.tr((({ key:"Invalid value" }))) },
        min : function () { return this.tr((({ key:"Value too low" }))) },
        minLength : function () { return this.tr((({ key:"Length too small" }))) },
        max : function () { return this.tr((({ key:"Value too high" }))) },
        isNaN : function () { return this.tr((({ key:"Not a number" }))) },
        email : function () { return this.tr((({ key:"Invalid email" }))) },
        tel : function () { return this.tr((({ key:"Enter only digits" }))) }
    }

    /* Validation Instance
     * @constructor
     * @param {object} [o] config literal
     * @returns {InstanceFormValidate}
     */
    var InstanceFormValidate = function (o) {

        var self = this
        this.name = 'instance.form.validation'
        this.asRoot = true
        bless.call(this, o)
        this.inRealTime = typeof o.inRealTime === 'boolean'? o.inRealTime : true
        this.rules = o.rules || []
        this.errorDisplayAmount = 'errorDisplayAmount' in o? o.errorDisplayAmount : 1
        this.messages = []
        this.isValid = null
        this.resizeHooks = []
        this.onValidSubmit = o.onValidSubmit
        this.managers.event.on('destroy', function () {

            return self.clear()
        })
        if (o.form)
            this.setForm(o.form)
    }

    /* Async constructor
     * @constructor
     * @param {object} [o] config literal
     * @returns {Promise}
     */
    InstanceFormValidate.prototype.init = function () {

        return this.managers.event.dispatch('init')
    }

    /* Applies a form to the validation object
     * @param {object} form - standard form element
     * @returns {null}
     */
    InstanceFormValidate.prototype.setForm = function (form) {

        var self = this;
        this.form = form;
        form.setAttribute('novalidate', true);
        form.classList.add('instance-form-validate');

        // event: submit
        form.addEventListener('submit', async function (event) {

          try {
            event.preventDefault();
            const valid = await self.check();
            if (! valid) {
              event.stopImmediatePropagation();
            }
          } catch (e) {
            event.stopImmediatePropagation();
            return self.managers.debug.handle(e);
          }
        })

        // event: change
        form.addEventListener('change', () => self.onFormModify());

        // fix form init bug where DOM isn't ready to traverse elements
        window.setTimeout(() => self.addTextInputListeners(), 200);
    }

    /* Usually triggered upon form control modification
     * @returns {null}
     */
    InstanceFormValidate.prototype.onFormModify = function () {

        var self = this
        if (this.inRealTime && ! this.__checkingInSitu) {

            this.__checkingInSitu = true
            this.check()['catch'](function (e) {

                return self.managers.debug.handle(e)
            }).then(function () {

                self.__checkingInSitu = false
            })
        }
    }

    /* Checks the form for valididity
     * @returns {Array} of form elements
     */
    InstanceFormValidate.prototype.getFormElements = function () {

      const { form } = this;
      if (! form) {
        throw new Error('Form has not been set yet');
      }

      return Array.prototype.slice.call(form.elements)
        .map(ctl => {
          var nodeName = ctl.nodeName.toUpperCase();
          if ((! /BUTTON|FIELDSET/.test(nodeName)) && (! (nodeName === 'INPUT' && ctl.type.toUpperCase() === 'SUBMIT')))
            return ctl;
          })
        .filter(ctl => {
          if (ctl) {
            return ctl;
          }
        });
    }

    /* Serializes form elements and values
     * @returns {Object} of name/value pairs
     */
    InstanceFormValidate.prototype.getValues = function () {

      return this.getFormElements().reduce((a, b) => {

        if (b.name) {
          a[b.name] = b.value;
        }
        return a;
      }, {});

    }

    /* Adds text input listeners
     * @returns {null}
     */
    InstanceFormValidate.prototype.addTextInputListeners = function () {

        var self = this
        this.getFormElements().forEach(function (element) {

            if (element.__igaroFormValidateHooked || (! ('oninput' in element)))
                return

            element.addEventListener('input', function () {

                self.onFormModify()
            })
            element.__igaroFormValidateHooked = true
        })
    }

    /* Displays an error near a control
     * @param {object} ctl - form control
     * @param {function} msg - providing language key
     * @returns {null}
     */
    InstanceFormValidate.prototype.displayError = function (ctl, msg) {

        if (this.errorDisplayAmount && this.errorDisplayAmount <= this.messages.length)
            return

        if (! (ctl instanceof Node))
            throw new TypeError("First argument must be an instance of Node")

        if (typeof msg !== 'function')
            throw new TypeError("Second argument must be a function")

        var self = this,
            domMgr = this.managers.dom,
            pn = ctl.parentNode

        pn.style.position='relative'

        this.messages.push(domMgr.mk('div', pn, msg, function () {

          var me = this,
            pos = function () {
              me.style.left=ctl.offsetLeft + 'px'
              me.style.top= (ctl.clientHeight+ctl.offsetTop) + 'px'
            }

          this.className = 'validation-message'
          self.resizeHooks.push(pos)
          window.addEventListener('resize', pos)
          pos()
        }))

        var cl = ctl.classList
        cl.remove("validation-ok")
        cl.add('validation-fail')
    }

    /* Checks the form for valididity
     * @returns {Promise} containing boolean
     */
    InstanceFormValidate.prototype.check = function () {

        var self = this,
            eventMgr = self.managers.event,
            addMsg = function (n, l) {

                self.displayError(n, l)
                return Promise.resolve(true)
            }

        self.isValid = null

        return this.clear().then(function () {

            return Promise.all(self.getFormElements().map(function (element) {

                if (element.getAttribute('no-validate'))
                    return Promise.resolve()

                element.classList.add('validation-ok')

                var value = element.nodeName === 'SELECT'? element.value : element.value.trim(),
                    type = element.type? element.type.toLowerCase() : null

                // required
                if (element.required && ! value.length)
                    return addMsg(element, l.required)

                // valid email
                if (type === 'email' && !/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value))
                    return addMsg(element, l.email)

                // valid tel
                if (type === 'tel' && ! /^([0-9])+$/.test(value))
                    return addMsg(element, l.tel)

                // valid number
                if (type === 'number') {

                    if (isNaN(value))
                        return addMsg(element, l.isNaN)

                    if (typeof element.min !== 'undefined' && value < parseInt(element.min))
                        return addMsg(element, l.min)

                    if (typeof element.max !== 'undefined' && value > parseInt(element.max))
                        return addMsg(element, l.max)
                } else {

                    // range
                    if (typeof element.min !== 'undefined' && value.length < element.min)
                        return addMsg(element, l.minLength)
                }

                // pattern
                var pat = element.pattern
                if (pat && !new RegExp(pat).test(value)) {
                  return addMsg(element, l.pattern)
                }

                // custom rules
                return self.rules.map(function (o) {

                    if (element.name === o[0])
                        return o[1].call(o, value)

                // reduce promises
                }).reduce(function (a, b) {

                    return a.then(function () {

                        if (b instanceof Promise) {
                            return b.then(function (v) {

                                if (v)
                                    return addMsg(element, v)
                            })
                        }
                        if (b)
                            return addMsg(element, b)
                    })
                }, Promise.resolve())
            })).then(function (results) {

                var valid = self.isValid = results.every(function (o) {

                    return !o
                })
                return eventMgr.dispatch('validated', valid).then(function () {

                    return valid
                })
            })
        })
    }

    /* Clears validation warnings
     * @returns {Promise}
     */
    InstanceFormValidate.prototype.clear = function () {

        var self = this
        this.resizeHooks.forEach(function (h) {

            if (h)
                window.removeEventListener('resize', h)
        })
        this.resizeHooks = []
        this.getFormElements().forEach(function (o) {

            var cl = o.classList
            cl.remove("validation-fail")
            cl.remove("validation-ok")
        })
        return Promise.all(this.messages.map(function (element) {

            return dom.rm(element)
        })).then(function () {

            self.messages = []
            return self.managers.event.dispatch('clear')
        })
    }

    return InstanceFormValidate

}
