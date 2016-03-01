//# sourceURL=instance.table.js

(function(env) {

    module.requires = [
        { name:'core.language.js'},
        { name:'instance.table.css'}
    ];

    module.exports = function(app) {

        "use strict";

        var object = app['core.object'],
            dom = app['core.dom'],
            bless = object.bless,
            arrayInsert = object.arrayInsert;

    /*------------------------------------------------------------------------------------------------*/

        /* Table -> Domain -> Row -> Column
         * @constructor
         * @param {object} [o] - config literal, see online help for attributes
         */
        var InstanceTableDomainRowColumn = function(o) {

            this.name='column';
            this.container=function(dom) {

                return dom.mk('td',o,o.content,o.className);
            };
            bless.call(this,o);
        };

    /*------------------------------------------------------------------------------------------------*/

        /* Table -> Domain -> Row
         * @constructor
         * @param {object} [o] - config literal, see online help for attributes
         */
        var InstanceTableDomainRow = function(o) {

            o = o || {};
            this.name = 'row';
            this.container=function(dom) {

                return dom.mk('tr',o,null,o.className);
            };
            this.children = {
                columns:'column'
            };
            bless.call(this,o);
        };

        /* Add multiple rows
         * @param {Array} [o] - containing objects (rows to add). See addRow.
         * @returns {Promise} containing Array of InstanceTableDomainRow
         */
        InstanceTableDomainRow.prototype.addColumn = function(o) {

            o = o || {};
            o.parent = this;
            o.container = this.container;
            var col = new InstanceTableDomainRowColumn(o);
            arrayInsert(this.columns,col,o);
            return this.managers.event.dispatch('addColumn',col).then(function() {

                return col;
            });
        };

        /* Add multiple rows
         * @param {Array} o - containing objects (rows to add). See addRow.
         * @returns {Promise} containing Array of InstanceTableDomainRow
         */
        InstanceTableDomainRow.prototype.addColumns = function(o) {

            var self = this;
            return object.promiseSequencer(o,function(a) {

                return self.addColumn(a);
            });
        };

    /*------------------------------------------------------------------------------------------------*/

        /* Table -> Domain
         * @constructor
         * @param {object} [o] - config literal, see online help for attributes
         */
        var InstanceTableDomain = function(o) {

            o = o || {};
            this.name='domain';
            this.container=function(dom) {

                return dom.mk(o.type,o.parent.table,null,o.className);
            };
            this.children = {
                rows:'row'
            };
            bless.call(this,o);
        };

        /* Adds a rows
         * @param {object} [o] - row data. See online help for attributes.
         * @returns {Promise} containing InstanceTableDomainRow
         */
        InstanceTableDomain.prototype.addRow = function(o) {

            o = o || {};
            o.parent = this;
            o.container = this.container;
            var r = new InstanceTableDomainRow(o);
            arrayInsert(this.rows,r,o);
            return this.managers.event.dispatch('addRow',r).then(function () {

                if (o.columns)
                    return r.addColumns(o.columns);
            }).then(function() {

                return r;
            });
        };

        /* Add multiple rows
         * @param {Array} o - containing objects (rows to add). See addRow.
         * @returns {Promise} containing Array of InstanceTableDomainRow
         */
        InstanceTableDomain.prototype.addRows = function(o) {

            var self = this;
            return object.promiseSequencer(o,function(a) {

                return self.addRow(a);
            });
        };

    /*------------------------------------------------------------------------------------------------*/

        /* Table
         * @constructor
         * @param {object} [o] - config literal. See online help for attributes
         */
        var InstanceTable = function(o) {

            var self = this;
            o = o || {};
            this.name='instance.table';
            this.asRoot=true;
            this.container=function(dom) {

                var table = self.table = dom.mk('table');
                return dom.mk('div',o,table,o.className);
            };
            bless.call(this,o);
            self.header = new InstanceTableDomain({ parent:self, type:'thead', className:o.header? o.header.className:null });
            self.body = new InstanceTableDomain({ parent:self, type:'tbody', className:o.body? o.body.className:null });
            self.footer = new InstanceTableDomain({ parent:self,type:'tfoot', className:o.footer? o.footer.className:null});
        };

        /* Async Constructor
         * @param {object} [o] - config literal. See online help for attributes.
         * @returns {Promise}
         */
        InstanceTable.prototype.init = function(o) {

            var self = this;
            o = o || {};
            return this.body.addRow().then(function(row) {

                self.searchRow = row;
                return Promise.all([[self.header,o.header],[self.body,o.body],[self.footer,o.footer]].map( function(o) {

                    var opt = o[1];
                    if (opt && opt.rows)
                        return o[0].addRows(opt.rows);
                }));
            });
        };


        /* Executes a search function held on the columns of the first row, switching display
         * @returns {null}
         */
        InstanceTable.prototype.execSearch = function() {

            try {

                var src = this.searchRow.columns,
                    srcc;
                this.body.rows.slice(1).forEach(function (r) {

                    r.container.style.display = r.columns.every(function (h, i) {

                        srcc = src[i];
                        if (srcc.searchFn)
                            return srcc.searchFn(h);
                        return true;
                    })? '' : 'none';
                });
            } catch(e) {

                this.managers.debug.handle(e);
            }
        };

        /* Adds a search column and method to the built in search row.
         * @param {object} [o] - same as addColumn values but content defaults to a textbox
         * @returns {InstanceTableDomainRowColumn}
         */
        InstanceTable.prototype.addSearchColumn = function(o) {

            var self = this;
            o = o || {};
            if (! o.content) {
                o.content = function(domMgr) {

                    return domMgr.mk('input[text]',null,null, function() {

                        dom.setPlaceholder(this,_tr('Search'));
                        var s = this;
                        domMgr.parent.searchFn = function(column) {

                            var v = s.value.toLowerCase().trim();
                            if (v.length === 0)
                                return true;
                            return column.container.innerHTML.toLowerCase().match(v);
                        };
                        this.addEventListener('input', function() {

                            self.execSearch();
                        });
                    });
                };
            }
            return this.searchRow.addColumn(o).then(function(col) {

                if (o.searchFn)
                    col.searchFn = o.searchFn;
                return col;
            });
        };

        /* Adds a row with search columns
         * @param {Array} [o] - columns to add, defaults to all being text based
         * @returns {Array} containing InstanceTableDomainRowColumn
         */
        InstanceTable.prototype.addSearchColumns = function(o) {

            var self = this;
            if (! o) { // default to creating a text search on every column
                o = this.header.rows[0].columns.map(function() {
                    return {};
                });
            }
            return object.promiseSequencer(o,function(a) {

                return self.addSearchColumn(a);
            });
        };

        return InstanceTable;
    };

})(this);
