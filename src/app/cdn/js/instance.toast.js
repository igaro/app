//# sourceURL=instance.toast.js

(function (env) {

  module.requires = [
    { name: 'instance.toast.css' },
    { name: 'core.language.js' }
  ];

  module.exports = app => {

    const coreDom = app['core.dom'],
      coreBless = app['core.object'].bless

    const showTime = {
      short: 2250,
      long: 4250
    }

    const container = dom.mk('div', document.body, null, 'igaro-instance-toast'),
      recentInstanceToastMessages = [];

    /* Toast
     * @constructor
     * @param {object} o - config literal. See online help for attributes.
     */
    const InstanceToast = function (o) {

      bless.call(this, {
        name: 'instance.toast',
        parent: o.parent,
        asRoot: true
      });

      const domMgr = this.managers.dom,
        duration = o.duration || 'short',
        position = o.position,
        txt = o.message,
        str = JSON.stringify(txt);

      // self destruct
      window.setTimeout(() => {

        this.destroy();
      }, showTime[duration]+200);

      // prevent toasting of same message within limited period
      if (recentInstanceToastMessages.indexOf(str) > -1) {
        return;
      }

      recentInstanceToastMessages
        .push(str);

      window.setTimeout(() => {

        recentInstanceToastMessages
          .splice(recentInstanceToastMessages
            .indexOf(str), 1)
      }, 1000);

      // phonegap InstanceToast plugin
      if (env.plugins && env.plugins.toast) {
        return env.plugins.toast.show(typeof txt === 'function'? txt() : txt, duration, position);
      }

      // html
      domMgr.mk('div', container, txt, duration);
    }

    return InstanceToast;
  }

})(this);
