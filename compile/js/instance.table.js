module.requires = [
    { name:'core.language.js'},
    { name:'instance.table.css'}
];

module.exports = function(app) {

    var events = app['core.events'];
    var language = app['core.language'];

    var instances = new Array();
    events.on('core.language','code.set', function(v) {
        instances.forEach(function (o) {
            [o.header,o.body,o.footer].forEach( function(q) {
                q.rows.forEach(function (r) {
                    r.columns.forEach(function (c) {
                        if (r.search) c.element.firstChild.value=''; 
                        r.element.style.display='';
                        var l = c.lang;
                        if (! l) return;
                        if (typeof l === 'object') { c.element.innerHTML = language.mapKey(l); }
                        else if (typeof l === 'function') { l(); }
                    })
                })
            });
        });
    });

    var column = function(t,o) {
        var element = this.element = document.createElement('td');
        t.element.appendChild(element);
        if (o) {
            if (o.append || o.lang) this.setContent({ lang:o.lang, append:o.append });
            if (o.className) this.setClass(o.className);
            if (o.search) this.setSearch(o.search);
        }
    }

    column.prototype.setClass = function(c) {
        this.element.className = c;
    }

    column.prototype.setSearch = function(o) {
        this.search = o;
    }

    column.prototype.setContent = function(c) {
        var td = this.element;
        while (td.firstChild) td.removeChild(td.firstChild);
        if (c.append) td.appendChild(c.append);
        if (c.lang) {
            c = this.lang = c.lang;
            if (typeof c === 'object') {
                this.element.innerHTML = language.mapKey(c);
            } else if (typeof c === 'function') {
                c();
            }
        } else {
            this.lang=null;
        }
    }

    var row = function(t,c) {
        var self = this;
        var element = this.element = document.createElement('tr');
        var d = c.insertBefore;
        if (c.insertBefore && (typeof d !== 'number' || d < t.rows.length)) {
            t.element.insertBefore(element,typeof d === 'number'? t.rows[d].element : d.element);
        } else {
            t.element.appendChild(element);
        }
        this.columns = new Array();
        if (c) {
            if (c.search) { this.search=true; this.setClass('searchable'); }
            if (c.className) this.setClass(c.className);
            if (c.columns) c.columns.forEach(function(o) { self.addColumn(o) });
        }
    }

    row.prototype.addColumn = function(o) {
        var col = new column(this,o);
        this.columns.push(col);
        return col;
    }

    row.prototype.setClass = function(c) {
        this.element.className = c;
    }

    var domain = function(c,type) {
        var element = this.element = document.createElement(type);
        c.container.appendChild(element);
        this.rows = new Array();
    }

    domain.prototype.addRow = function(o) {
        var r = new row(this,o);
        if (o.insertBefore) {
            this.rows.splice(typeof o.insertBefore === 'number'? o.insertBefore : this.rows.indexOf(o.insertBefore),0,r);
        } else {
            this.rows.push(r);
        }
        return r;
    };

    domain.prototype.deleteRow = function(r) {
        r.element.parentNode.removeChild(r.element);
        this.rows.splice(this.rows.indexOf(r),1);
    };


    var searchExec = function(input,x) {
        var tr = input.parentNode.parentNode;
        var hcols;
        x.header.rows.some(function (o) {
            if (o.element === tr) { hcols = o.columns; return true; }
        });
        x.body.rows.forEach(function (r) {
            var cols = r.columns;
            r.element.style.display = hcols.some(function (h, i) {
                var search = h.element.firstChild.value.trim().toLowerCase();
                if (! search.length || cols.length < i) return;
                var cc = cols[i];
                var value = cc.search? cc.search() : cc.element.innerHTML;
                if (! value.toLowerCase().match(search) ) return true;
            })? 'none' : '';
        });
    }

    var x = function(o) {
        var self = this;
        var c = this.container = document.createElement('table');
        c.className = 'instance-table';
        var header = this.header = new domain(this,'thead');
        var body = this.body = new domain(this,'tbody');
        var footer = this.footer = new domain(this,'tfoot');
        if (o) {
            [[header,o.header],[body,o.body],[footer,o.footer]].forEach( function(o) {
                var domain = o[0];
                var opt = o[1];
                if (! opt) return;
                if (opt.rows) opt.rows.forEach(function (r) { domain.addRow(r) });
                if (opt.className) domain.setClass(opt.className);
            });

            if (o.searchable) {
                var i = header.rows.length;
                header.addRow({
                    search:true,
                    columns : header.rows[0].columns.map(function() {
                        var i = document.createElement('input');
                        i.addEventListener('input', function() { searchExec(this,self); });
                        i.type='text';
                        return { append:i, lang:function() {
                            i.placeholder = language.mapKey({
                                en : 'Search',
                                fr : 'Recherche'
                            });
                        }}
                    })
                });
            }

            if (o.container) o.container.appendChild(c);
            if (o.id) this.setId(o.id);
        }
        instances.push(this);
    };

    x.prototype.setId = function(id) {
        this.id=id;
        this.container.className = 'instance-table'+(id?id : '');
    }

    return x;
}
