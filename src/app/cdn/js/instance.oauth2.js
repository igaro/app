//# sourceURL=instance.oauth2.js

(function () {

  "use strict";

  module.requires = [
    { name: 'instance.oauth2.css' },
    { name: 'core.url.js' }
  ];

  module.exports = app => {

    const coreUrl = app['core.url'],
      { bless } = app['core.object'];

    const setBits = function (p) {

      if (p.scope) {
        this.scope = p.scope;
      }
      if (p.devid) {
        this.devid = p.devid;
      }
      if (p.callbackUrl) {
        this.callbackUrl = p.callbackUrl;
      }
      if (p.authUrl) {
        this.authUrl = p.authUrl;
      }
      if (p.tokenName) {
        this.tokenName = p.tokenName;
      }
      if (p.stash) {
        this.stash = p.stash;
      }
    }

    /* Manager
     * @constructor
     * @param {object} [o] - config literal. See setBits and online help for attributes
     */
    const InstanceOauth2 = function (o) {

      var self = this;
      o = o || {};
      this.name = 'instance.oauth2';
      this.asRoot = true;
      this.container = dom => dom.mk('div', null, null, function () {

        this.className = 'igaro-instance-oauth2'

        if (o.className) {
          this.classList.add(o.className);
        }

        self.win = dom.mk('iframe', this);
        dom.mk('a', this, null, function () {

          this.addEventListener('click', event => {

            event.preventDefault();
            self._resolve({ cancel: true });
          })
        });
      });

      bless.call(this, o);
      this.inProgress = false;
      setBits.call(this, o);

      const msglist = event => {

        const callbackUrl = self.callbackUrl,
          tokenName = self.tokenName,
          url = event.data;

        if (url && url.substr(0, callbackUrl.length) === callbackUrl) {
          self._resolve({
            token: coreUrl.getSearchValue(tokenName, url),
            url
          });
        }
      }
      window.addEventListener('message', msglist);
      this.managers.event.on('destroy', () => {

          window.removeEventListener('message', msglist);
      });
    }

    /* Executes Authentication
     * @param {object} [o] - config literal. See online help for attributes
     * @returns {Promise}
     */
    InstanceOauth2.prototype.exec = function (o) {

      if (o) {
        setBits.call(this, o);
      }

      const self = this,
        { body } = document,
        { container } = this;

      this.inProgress = true;
      this.win.src = this.authUrl
        .replace('[CALLBACKURL]', encodeURIComponent(this.callbackUrl))
        .replace('[SCOPE]', encodeURIComponent(this.scope))
        .replace('[DEVID]', encodeURIComponent(this.devid));

      body.appendChild(container);
      return new Promise(resolve => {

        self._resolve = o => {

          self.inProgress = false;
          if (container.parentNode) {
            body.removeChild(container);
          }
          resolve(o);
        }
      });
    }

    return InstanceOauth2;
  };

})(this);
