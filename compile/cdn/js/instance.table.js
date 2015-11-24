//# sourceURL=instance.table.js

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

    var InstanceTableDomainRowColumn = function(o) {
        this.name='column';
        this.container=function(dom) {
            return dom.mk('td',o,o.content,o.className);
        };
        bless.call(this,o);
    };

    var InstanceTableDomainRow = function(o) {
        this.name = 'row';
        this.container=function(dom) {
            return dom.mk('tr',o,null,o.className);
        };
        this.children = {
            columns:'column'
        };
        bless.call(this,o);
    };
    InstanceTableDomainRow.prototype.addColumn = function(o) {
        if (! o)
            o = {};
        o.parent = this;
        o.container = this.container;
        var col = new InstanceTableDomainRowColumn(o);
        arrayInsert(this.columns,col,o);
        return this.managers.event.dispatch('addColumn',col).then(function() {
            return col;
        });
    };
    InstanceTableDomainRow.prototype.addColumns = function(o) {
        var self = this;
        return object.promiseSequencer(o,function(a) {
            return self.addColumn(a);
        });
    };

    var InstanceTableDomain = function(o) {
        this.name='domain';
        this.container=function(dom) {
            return dom.mk(o.type,o.parent.table,null,o.className);
        };
        this.children = {
            rows:'row'
        };
        bless.call(this,o);
    };
    InstanceTableDomain.prototype.addRow = function(o) {
        if (! o)
            o = {};
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
    InstanceTableDomain.prototype.addRows = function(o) {
        var self = this;
        return object.promiseSequencer(o,function(a) {
            return self.addRow(a);
        });
    };

    var InstanceTable = function(o) {
        var self = this;
        this.name='instance.table';
        this.asRoot=true;
        this.container=function(dom) {
            var table = self.table = dom.mk('table');
            return dom.mk('div',o,table,o.className);
        };
        bless.call(this,o);
        var header = self.header = new InstanceTableDomain({ parent:self, type:'thead', className:o.header? o.header.className:null });
        var body = self.body = new InstanceTableDomain({ parent:self, type:'tbody', className:o.body? o.body.className:null });
        var footer = self.footer = new InstanceTableDomain({ parent:self,type:'tfoot', className:o.footer? o.footer.className:null});
    };

    InstanceTable.prototype.init = function(o) {
        var self = this;
        return this.body.addRow().then(function(row) {
            self.searchRow = row;
            return Promise.all([[self.header,o.header],[self.body,o.body],[self.footer,o.footer]].map( function(o) {
                var opt = o[1];
                if (opt && opt.rows)
                    return o[0].addRows(opt.rows);
            }));
        });
    };

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

    InstanceTable.prototype.addSearchColumn = function(o) {
        var self = this;
        if (! o)
            o = {};
        if (! o.content)
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
        return this.searchRow.addColumn(o).then(function(col) {
            if (o.searchFn)
                col.searchFn = o.searchFn;
            return col;
        });
    };

    InstanceTable.prototype.addSearchColumns = function(o) {
        if (! o) // default to creating a text search on every column
            o = this.header.rows[0].columns.map(function() {
                return {};
            });
        var self = this;
        return object.promiseSequencer(o,function(a) {
            return self.addSearchColumn(a);
        });
    };

    return InstanceTable;
};
