//# sourceURL=instance.table.js

(function () {

  "use strict";

  module.requires = [
    { name: 'core.language.js'},
    { name: 'instance.table.css'}
  ];

  module.exports = app => {

    const coreObject = app['core.object'],
      dom = app['core.dom'],
      { bless, arrayInsert } = coreObject;

  /*------------------------------------------------------------------------------------------------*/

    /* Table -> Domain -> Row -> Column
     * @constructor
     * @param {object} [o] - config literal, see online help for attributes
     */
    const InstanceTableDomainRowColumn = function (o) {

      this.name='column';
      this.container = domMgr => {

        return domMgr.mk('td', o, o.content, function () {
          if (o.className) {
            this.className = o.className;
          }
          if (o.colSpan) {
            this.colSpan = o.colSpan;
          }
        });
      };
      bless.call(this, o)
    }

  /*------------------------------------------------------------------------------------------------*/

    /* Table -> Domain -> Row
     * @constructor
     * @param {object} [o] - config literal, see online help for attributes
     */
    const InstanceTableDomainRow = function (o) {

      o = o || {};
      this.name = 'row';
      this.container= domMgr => domMgr.mk('tr', o, null, o.className);
      this.children = {
        columns: 'column'
      };
      bless.call(this, o);
    }

    /* Add multiple rows
     * @param {Array} [o] - containing objects (rows to add). See addRow.
     * @returns {Promise} containing Array of InstanceTableDomainRow
     */
    InstanceTableDomainRow.prototype.addColumn = async function (o) {

      o = o || {};
      o.parent = this;
      o.container = this.container;
      var col = new InstanceTableDomainRowColumn(o);
      arrayInsert(this.columns, col, o);
      await this.managers.event.dispatch('addColumn', col);
      return col;
    }

    /* Add multiple rows
     * @param {Array} o - containing objects (rows to add). See addRow.
     * @returns {Promise} containing Array of InstanceTableDomainRow
     */
    InstanceTableDomainRow.prototype.addColumns = async function (o) {

      const columns = [];
      for (let column of o) {
        columns.push(await this.addColumn(column));
      }
      return columns;
    }

  /*------------------------------------------------------------------------------------------------*/

    /* Table -> Domain
     * @constructor
     * @param {object} [o] - config literal, see online help for attributes
     */
    const InstanceTableDomain = function (o) {

      o = o || {};
      this.name = 'domain';
      this.container = domMgr => domMgr.mk(o.type, o.parent.table, null, o.className);
      this.children = {
        rows: 'row'
      }
      bless.call(this, o);
    };

    /* Adds a rows
     * @param {object} [o] - row data. See online help for attributes.
     * @returns {Promise} containing InstanceTableDomainRow
     */
    InstanceTableDomain.prototype.addRow = async function (o) {

      o = o || {};
      o.parent = this;
      o.container = this.container;
      var r = new InstanceTableDomainRow(o);
      arrayInsert(this.rows, r, o);
      await this.managers.event.dispatch('addRow', r);
      if (o.columns) {
        await r.addColumns(o.columns);
      }
      return r;
    }

    /* Add multiple rows
     * @param {Array} o - containing objects (rows to add). See addRow.
     * @returns {Promise} containing Array of InstanceTableDomainRow
     */
    InstanceTableDomain.prototype.addRows = async function (o) {

      const rows = [];
      for (let row of o) {
        rows.push(await this.addRow(row));
      }
      return rows;
    }

    /* remove multiple rows
     * @returns {Promise}
     */
    InstanceTableDomain.prototype.removeAllRows = function () {

      return Promise.all(this.rows.map(row => row.destroy()));
    }

    /*------------------------------------------------------------------------------------------------*/

    /* Table
     * @constructor
     * @param {object} [o] - config literal. See online help for attributes
     */
    const InstanceTable = function (o) {

      o = o || {};
      this.name = 'instance.table';
      this.asRoot = true;
      this.container = domMgr => {

        const table = this.table = dom.mk('table');
        return domMgr.mk('div', o, table, o.className);
      }
      bless.call(this, o);
      this.header = new InstanceTableDomain({ parent: this, type:'thead', className:o.header? o.header.className:null });
      this.body = new InstanceTableDomain({ parent: this, type:'tbody', className:o.body? o.body.className:null });
      this.footer = new InstanceTableDomain({ parent: this, type:'tfoot', className:o.footer? o.footer.className:null});
    }

    /* Async Constructor
     * @param {object} [o] - config literal. See online help for attributes.
     * @returns {Promise}
     */
    InstanceTable.prototype.init = async function (o) {

      o = o || {};
      const row = await this.body.addRow();
      this.searchRow = row;
      await Promise.all(
        [
          [this.header, o.header],
          [this.body, o.body],
          [this.footer, o.footer]
        ].map(o => {
          const opt = o[1]
          if (opt && opt.rows) {
            return o[0].addRows(opt.rows);
          }
        })
      );
      if (o.addSearchColumns) {
        await this.addSearchColumns();
      }
    }

    /* Executes a search function held on the columns of the first row, switching display
     * @returns {null}
     */
    InstanceTable.prototype.execSearch = function () {

      try {
        let src = this.searchRow.columns,
          srcc;

        this.body.rows.slice(1)
          .forEach(r => {
            r.container.style.display = r.columns
              .every((h,i) => {
                srcc = src[i];
                if (srcc.searchFn) {
                  return srcc.searchFn(h)
                }
                return true;
            })? '' : 'none';
          })
      } catch(e) {
        this.managers.debug.handle(e)
      }
    }

    /* Adds a search column and method to the built in search row.
     * @param {object} [o] - same as addColumn values but content defaults to a textbox
     * @returns {InstanceTableDomainRowColumn}
     */
    InstanceTable.prototype.addSearchColumn = async function (o) {

      var self = this;
      o = o || {};

      if (! o.content) {
        o.content = domMgr => {

          return dom.mk('input[text]', null, null, function () {

            dom.setPlaceholder(this, function () { return this.tr((({ key: "Search" }))) });
            domMgr.parent.searchFn = column => {
              const v = this.value.toLowerCase().trim();
              if (v.length === 0) {
                return true;
              }
              return column.container.innerHTML.toLowerCase().match(v);
            }
            this.addEventListener('input', () => self.execSearch());
          });
        }
      }
      const col = await this.searchRow.addColumn(o);
      if (o.searchFn) {
        col.searchFn = o.searchFn;
      }
      return col;
    }

    /* Adds a row with search columns
     * @param {Array} [o] - columns to add, defaults to all being text based
     * @returns {Array} containing InstanceTableDomainRowColumn
     */
    InstanceTable.prototype.addSearchColumns = async function (o) {

      if (! o) { // default to creating a text search on every column
        o = this.header.rows[0].columns.map(() => ({}));
      }
      const columns = [];
      for (let column of o) {
        columns.push(await this.addSearchColumn(a));
      };
      return columns;
    }

    return InstanceTable;
  }

})(this);
