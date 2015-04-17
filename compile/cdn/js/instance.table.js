(function() {

'use strict';

module.requires = [
    { name:'core.language.js'},
    { name:'instance.table.css'}
];

module.exports = function(app) {

    var bless = app['core.bless'];

    var InstanceTableDomainRowColumn = function(o) {
        this.name='column';
        this.container=function(dom) {
            return dom.mk('td',o.parent,o.content,o.className);
        };
        bless.call(this,o);
    };

    var InstanceTableDomainRow = function(o) {
        this.name = 'row';
        this.container=function(dom) {
            return dom.mk('tr', o.insertBefore? {insertBefore:o.insertBefore} : o.parent,null,o.className);
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
        var col = new InstanceTableDomainRowColumn(o);
        this.columns.push(col);
        return this.managers.event.dispatch('addColumn',col).then(function() {
            return col;
        });
    };
    InstanceTableDomainRow.prototype.addColumns = function(o) {
        var self = this;
        return o.reduce(function(a,b) {
            return a.then(function() {
                return self.addColumn(b);
            });
        }, Promise.resolve());
    };

    var InstanceTableDomain = function(o) {
        this.name='domain';
        this.container=function(dom) {
            return dom.mk(o.type,o.parent,null,o.className);
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
        var r = new InstanceTableDomainRow(o),
            rows = this.rows;
        if (o.insertBefore) {
            rows.splice(rows.indexOf(o.insertBefore),0,r);
        } else {
            rows.push(r);
        }
        return this.managers.event.dispatch('addRow',r).then(function () {
            if (o.columns)
                return r.addColumns(o.columns);
        }).then(function() {
            return r;
        });
    };
    InstanceTableDomain.prototype.addRows = function(o) {
        var self = this;
        return o.reduce(function(a,b) {
            return a.then(function() {
                return self.addRow(b);
            });
        }, Promise.resolve());
    };
    InstanceTableDomain.prototype.deleteRows = function() {
        return Promise.all(
            this.rows.slice(0).map(function(r) {
                return r.destroy();
            })
        );
    };

    var searchExec = function(input,x) {
        var tr = input.parentNode.parentNode,
            hcols;
        x.header.rows.some(function (o) {
            if (o.container === tr) { 
                hcols = o.columns; 
                return true; 
            }
        });
        x.body.rows.forEach(function (r) {
            var cols = r.columns;
            r.container.style.display = hcols.some(function (h, i) {
                var search = h.container.firstChild.value.trim().toLowerCase();
                if (! search.length || cols.length < i) 
                    return;
                var cc = cols[i],
                    value = cc.search? cc.search() : cc.container.innerHTML;
                if (! value.toLowerCase().match(search) ) 
                    return true;
            })? 'none' : '';
        });
    };

    var InstanceTable = function(o) {
        this.name='instance.table';
        this.asRoot=true;
        this.container=function(dom) {
            return dom.mk('table',o,null,o.className);
        };
        bless.call(this,o);
        this.header = new InstanceTableDomain({ parent:this, type:'thead', className:o.header? o.header.className:null });
        this.body = new InstanceTableDomain({ parent:this, type:'tbody', className:o.body? o.body.className:null });
        this.footer = new InstanceTableDomain({ parent:this,type:'tfoot', className:o.footer? o.footer.className:null});
    }

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

    InstanceTable.prototype.addSearchColumn = function(type) {
        var row = this.searchRow;
        return row.addColumn({
            content: function(dom) {
                if(type === 'text') {
                    return dom.mk('input[text]',null,null, function() {
                        dom.setPlaceholder(this,_tr('Search'));
                        this.addEventListener('input', function() { 
                            searchExec(this,self);
                        });
                    });
                }
            }
        });
    };

    return InstanceTable;
};

})();
