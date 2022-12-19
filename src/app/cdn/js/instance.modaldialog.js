//# sourceURL=instance.modaldialog.js

(function () {

  "use strict"

  module.requires = [
    { name: 'instance.modaldialog.css' },
    { name: 'core.language.js' }
  ];

  module.exports = (app, params) => {

    const { body } = document,
      bodyStyle = body.style,
      { bless } = app['core.object'];

    let activeCnt = 0,
      zIndexAt = 999999;

    /* Manager
     * @constructor
     */
    const InstanceModalDialog = function (o) {

      this.name='instance.modaldialog';
      this.asRoot=true;
      bless.call(this, o);
      this.managers.event.on('destroy', () => {
        if (this.isActive) {
          activeCnt--;
          if (! activeCnt) {
            bodyStyle.overflow = '';
            params.conf.noBodyStyleOverflowReset = false;
          }
        }
      });
    }

    /* Displays a custom modal dialog
     * @param {object} [o] - config literal. see online help for attributes.
     * @returns {Promise} containing action
     */
    InstanceModalDialog.prototype.custom = function (o) {

      o = o || {};
      const domMgr = this.managers.dom,
        self = this;

      let myActions = o.actions || [];

      const container = this.container = domMgr.mk('div', body, null, function () {

        this.className = 'igaro-instance-modaldialog'
        this.style.zIndex = zIndexAt
        if (! o.noClose) {
          this.addEventListener('click', () => this.resolve());
        }
      });

      const wrapper = domMgr.mk('div', container, null, function () {

        this.className = o.type || 'custom';
        this.addEventListener('click', event => event.stopPropagation());
      });

      zIndexAt += 1;
      activeCnt++;
      this.isActive = true;
      bodyStyle.overflow = 'hidden';
      params.conf.noBodyStyleOverflowReset = true;

      return new Promise(resolve => {

        if (o.title) {
          o.header = domMgr.mk('h1', null, o.title);
        }
        if (o.header) {
          domMgr.mk('div', wrapper, o.header, 'header');
        }

        domMgr.mk('div', wrapper, null, function () {

          const { message } = o;
          this.className = 'body';
          if (message) {
            domMgr.mk('div', this, function () { return message.call(this, domMgr); }, 'message');
          }
          // custom elements
          if (o.custom) {
            domMgr.mk('div', this, o.custom, 'custom');
          }
        });

        this.resolve = async action => {

          await this.destroy();
          resolve(action);
        };

        // add cancel or close
        if (o.addCancel || (! o.noClose && ! myActions.length)) {
          myActions.push({
            l: function () {
              return o.addCancel? this.tr((({ key: "Cancel" }))) : this.tr((( { key:"Close" })))
            }
          });
        }

        domMgr.mk('div', wrapper, null, function () {

          this.className = 'action';
          myActions = myActions
            .map(action => {
              action.element = domMgr.mk('button', this, action.l, function () {

                if (action.id) {
                  this.className = action.id;
                }
                if (action.onClick) {
                  this.addEventListener('click', event => {

                    if (action.onClick(event) === false) {
                      event.stopImmediatePropagation();
                    }
                  });
                }
                this.addEventListener('click', () => {

                  self.resolve(action)
                    .catch(e => self.managers.debug.handle(e));
                })
              })
              return action.element;
          })
        });

        // give dom time to update
        window.setTimeout(() => {

          // focus singular button
          if (myActions && myActions.length === 1) {
            myActions[0].focus();
          }

          // setup, usually used for custom focusing
          if (o.setup) {
            o.setup();
          }
        }, 50);
      });
    }

    /* Creates an busy modal dialog which blocks the user
     * @param {object} o - config literal. see online help for attributes.
     * @returns {Promise} containing action
     */
    InstanceModalDialog.prototype.busy = function (o) {

      if (!o) {
        o = {};
      }

      return this.custom(
        {
          type : 'busy',
          message : o.message,
          custom: o.custom || this.managers.dom.mk('div', null, null, 'spinner'),
          title: o.title || function () { return this.tr((({ key:"Working..." }))) },
          noClose: true,
          addCancel: o.canCancel
        }
      );
    }

    /* Creates an action modal dialog
     * @param {object} o - config literal. see online help for attributes.
     * @returns {Promise} containing action
     */
    InstanceModalDialog.prototype.action = function (o) {

      return this.custom(
        {
          type : 'action',
          message : o.message,
          custom: o.custom,
          title: o.title,
          actions : o.actions
        }
      );
    }

    /* Creates an alert (one ok button)
     * @param {object} [o] - config literal. see online help for attributes.
     * @returns {Promise}
     */
    InstanceModalDialog.prototype.alert = function (o) {

      return this.custom(
        {
          type : 'alert',
          message : o.message,
          custom: o.custom,
          title : o.title,
          actions : [
            {
              l: function () { return this.tr((({ key:"Ok" }))) }
            }
          ]
        }
      );
    }

    /* Creates an alert (ok and cancel button)
     * @param {object} [o] - config literal. see online help for attributes.
     * @returns {Promise} containing boolean
     */
    InstanceModalDialog.prototype.confirm = async function (o) {

      const confirmAction = {
        l: function () { return this.tr((({ key:"Confirm" }))) }
      }
      const action = await this.custom({
        type : 'confirm',
        message : o.message,
        custom: o.custom,
        title: o.title,
        actions : [confirmAction],
        addCancel : true
      });
      return action === confirmAction;
    }

  return InstanceModalDialog;
}

})(this);
