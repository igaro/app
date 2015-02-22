(function() {

'use strict';

module.requires = [
    { name:'core.language.js'},
    { name:'instance.table.css'}
];

module.exports = function(app) {

    var dom = app['core.dom'],
        bless = app['core.bless'];

    var InstanceTableDomainRowColumn = function(o) {
        bless.call(this,{
            name:'column',
            parent:o.parent,
        });
        var dom = this.managers.dom,
            parent = this.parent,
            element = this.element = dom.mk('td',parent.element,o.content,o.className);
        parent.element.appendChild(element);
        if (o && o.searchable) 
            this.setSearch(o.searchable);
        this.managers.event.on('destroy', function() {
            return dom.rm(element);
        });
    };
    InstanceTableDomainRowColumn.prototype.setSearch = function(o) {
        this.searchable = o;
    };

    var InstanceTableDomainRow = function(o) {
        bless.call(this,{
            name:'row',
            parent:o.parent,
        });
        var dom = this.managers.dom,
            columns = this.columns = [],
            parent = this.parent;
        this.stash = {};
        var element = this.element = dom.mk('tr',null,null,o.className),
            self = this,
            d = o.insertBefore;
        if (o.searchable) { 
            this.searchable=true; 
            element.classList.add('searchable'); 
        }
        if (o.stash)
            self.stash = o.stash;
        if (o.columns) {
            o.columns.forEach(function(o) { 
                o.parent = self;
                self.addColumn(o);
            });
        }
        if (typeof d !== 'undefined') {
            parent.element.insertBefore(element,typeof d === 'number'? t.rows[d].element : d.element);
        } else {
            parent.element.appendChild(element);
        }
        this.managers.event
            .on('column.destroy', function(o) {
                columns.splice(columns.indexOf(o.value,1));
            });
    };
    InstanceTableDomainRow.prototype.addColumn = function(o) {
        o.parent = this;
        var col = new InstanceTableDomainRowColumn(o);
        this.columns.push(col);
        return this.managers.event.dispatch('addColumn',col).then(function() {
            return col;
        });
    };

    var InstanceTableDomain = function(o) {
        bless.call(this,{
            name:'domain',
            parent:o.parent
        });
        this.rows = [];
        this.element = dom = this.managers.dom.mk(o.type,o.parent.container);
    };
    InstanceTableDomain.prototype.addRow = function(o) {
        o.parent = this;
        var r = new InstanceTableDomainRow(o);
        if (o && o.insertBefore) {
            this.rows.splice(typeof o.insertBefore === 'number'? o.insertBefore : this.rows.indexOf(o.insertBefore),0,r);
        } else {
            this.rows.push(r);
        }
        return this.managers.event.dispatch('addRow',r).then(function () {
            return r;
        });
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
            if (o.element === tr) { 
                hcols = o.columns; 
                return true; 
            }
        });
        x.body.rows.forEach(function (r) {
            var cols = r.columns;
            r.element.style.display = hcols.some(function (h, i) {
                var search = h.element.firstChild.value.trim().toLowerCase();
                if (! search.length || cols.length < i) 
                    return;
                var cc = cols[i],
                    value = cc.search? cc.search() : cc.element.innerHTML;
                if (! value.toLowerCase().match(search) ) 
                    return true;
            })? 'none' : '';
        });
    };

    var InstanceTable = function(o) {
        bless.call(this,{
            name:'instance.table',
            parent:o.parent,
            asRoot:true
        });
        var dom = this.managers.dom,
            container = this.container = dom.mk('table',o.container,null,'instance-table'),
            self = this,
            header = this.header = new InstanceTableDomain({ parent:this, type:'thead' }),
            body = this.body = new InstanceTableDomain({ parent:this, type:'tbody'}),
            footer = this.footer = new InstanceTableDomain({ parent:this,type:'tfoot'});
        if (o) {
            [[header,o.header],[body,o.body],[footer,o.footer]].forEach( function(o) {
                var domain = o[0],
                    opt = o[1];
                if (! opt) 
                    return;
                if (opt.rows) 
                    opt.rows.forEach(function (r) { 
                        domain.addRow(r);
                    });
                if (opt.className) 
                    domain.element.classList.add(opt.className);
            });

            if (o.searchable) {
                var i = header.rows.length;
                header.addRow({
                    searchable:true,
                    columns : header.rows[0].columns.map(function() {
                        return dom.mk('input[text]',null,null, function() {
                            this.addEventListener('input', function() { 
                                searchExec(this,self);
                                dom.setPlaceholder(this,{"en":"Search"});
                            });
                        });
                    })
                });
            }
        }
        this.managers.event.on('destroy', function() {
            return dom.rm(container);
        });
    };

    InstanceTable.prototype.hide = function(v) {
        this.managers.dom.hide(this.container,v);
    };

    InstanceTable.prototype.show = function() {
        this.managers.dom.show(this.container);
    };

    return InstanceTable;
};

})();