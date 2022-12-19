//# sourceURL=instance.cart.js

(function () {

    "use strict"

    module.requires = [
      { name: 'core.country.js' },
      { name: 'core.currency.js' }
    ]

    var validateCode = function (code) {

      if (
        (typeof code === 'number' && code >= 0) ||
        (typeof code === 'string' && code.length)
      ) {
        return;
      }
      throw new TypeError('First arg must be type string or number');
    }

    module.exports = function (app, params) {

      const coreCountry = app['core.country'],
        coreCurrency = app['core.currency'];

        var bless = app['core.object'].bless;

        /* A basic shopping cart widget
         * @constructor
         * @param {object} [o] config literal
         * @returns {InstanceCart}
         */
        const InstanceCart = function (o) {

          o = o || {};
          this.name = 'instance.cart';
          this.asRoot = true;
          this.products = [];
          if (typeof o.api !== 'string') {
            throw new TypeError('Object attribute api must be a string');
          }
          this.__api = o.api;
          this.quantities = {};
          this.quoteRequestData = {};
          this.requestNumber = 0;
          bless.call(this, o);

          coreCountry.managers.event.on('setEnv', () => this.calculate(), { deps:[this] });
          coreCurrency.managers.event.on('setEnv', () => this.calculate(), { deps:[this] });
        }

        InstanceCart.prototype.init = async function () {

          this.api = await this.managers.object.create('xhr');
        }

        /* Empties the cart
         * @returns {Promise}
         */
        InstanceCart.prototype.empty = function () {

          this.quantities = {};
          delete this.quote;
          this.requestNumber++;
          return this.managers.event.dispatch('calculate');
        }

        /* Requests a quotation and performs calculations
         * @returns {Promise}
         */
        InstanceCart.prototype.calculate = async function () {

          const self = this;
          const { quantities, requestNumber } = this;
          const quote = await this.api.post({ res: this.__api+'/calculate', data: Object.assign({ quantities:this.quantities, countryCode:coreCountry.env }, this.quoteRequestData) });

          // ignore old requests
          if (requestNumber !== self.requestNumber) {
            return;
          }

          // verify products and quantities
          for (let id in quantities) {
            const product = quote.products
              .find(product => product.id == id);

            if (! product) {
              delete quantities[id];
              self.managers.object.create('toast', { message: function () { return this.tr((({ key:"Unavailable" }))) }});
              break;
            }
            if (product.discontinued) {
              delete quantities[id];
              self.managers.object.create('toast', { message: function () { return this.tr((({ key:"Discontinued" }))) }});
              break;
            }
            if (! product.stock) {
              delete quantities[id];
              self.managers.object.create('toast', { message: function () { return this.tr((({ key:"No Stock" }))) }});
              break;
            }
            if (product.stock < quantities[id]) {
              quantities[id] = product.stock;
              self.managers.object.create('toast', { message: function () { return this.tr((({ key:"Stock Restricted" }))) }});
            }
          };

          // save quote
          this.quote = quote;

          // pick shipping
          if (quote.shipping.selected) {
            quote.shipping.selected = quote.shipping.services.find(option => option.id === quote.shipping.selected);
          }

          return self.managers.event.dispatch('calculate');
        }

        /* Adds a product by ID code
         * @param {number|string} code recognised by the API
         * @param {number} [quantity] to purchase
         * @returns {Promise}
         */
        InstanceCart.prototype.setProductQuantity = function (code, quantity) {

          if (typeof quantity !== 'number' || quantity < 0) {
            throw new TypeError("Second arg must be of type positive number");
          }

          const { quantities } = this;
          this.requestNumber++;
          if (quantity) {
            quantities[code] = quantity;
          } else {
            delete quantities[code];
          }
          return this.calculate();
        }

        /* Totals the items added to the cart
         * @returns {number}
         */
        InstanceCart.prototype.getCount = function () {

          return Object.values(this.quantities)
            .reduce((a, id) => a + id, 0);
        }

        /* Increase product quantity by 1
         * @param {Date} date
         * @returns {Promise}
         */
        InstanceCart.prototype.increaseProductQuantity = function (code) {

          return this.setProductQuantity(code, (this.quantities[code] || 0)+1);
        }

        /* Decrease product quantity by 1
         * @param {Date} date
         * @returns {Promise}
         */
        InstanceCart.prototype.decreaseProductQuantity = function (code) {

          const quantity = this.quantities[code];
          if (quantity > 0) {
            return this.setProductQuantity(code, quantity-1);
          }
        }

        return InstanceCart;
    }

})(this)
