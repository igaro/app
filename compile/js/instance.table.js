module.requires = [
    { name:'core.language.js'},
    { name:'instance.table.css'}
];

module.exports = function(app) {

    var events = app['core.events'],
        language = app['core.language'];

    var column = function(t,o) {
        var element = this.element = document.createElement('td');
        t.element.appendChild(element);
        if (o) {
            if (o.append || o.lang) 
                this.setContent({ lang:o.lang, append:o.append });
            if (o.className) 
                this.element.classList.add(o.className);
            if (o.searchable) 
                this.setSearch(o.searchable);
        }
    };

    column.prototype.setSearch = function(o) {
        this.searchable = o;
    };

    column.prototype.setContent = function(c) {
        var td = this.element;
        while (td.firstChild) 
            td.removeChild(td.firstChild);
        if (c.append) 
            td.appendChild(c.append);
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
    };

    var row = function(t,c) {
        this.columns = [];
        var element = this.element = document.createElement('tr');
        if (c) {
            var self = this,
                d = c.insertBefore;
            if (c.searchable) { 
                this.searchable=true; 
                element.classList.add('searchable'); 
            }
            if (c.className) 
                element.classList.add(c.className);
            if (c.columns) {
                c.columns.forEach(function(o) { 
                    self.addColumn(o);
                });
            }
            if (d && (typeof d !== 'number' || d < t.rows.length)) {
                t.element.insertBefore(element,typeof d === 'number'? t.rows[d].element : d.element);
            } else {
                t.element.appendChild(element);
            }
        } else {
            t.element.appendChild(element);
        }
    };

    row.prototype.addColumn = function(o) {
        var col = new column(this,o);
        this.columns.push(col);
        return col;
    };

    var domain = function(c,type) {
        var element = this.element = document.createElement(type);
        c.container.appendChild(element);
        this.rows = [];
    };

    domain.prototype.addRow = function(o) {
        var r = new row(this,o);
        if (o && o.insertBefore) {
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

    var tblObj = function(o) {
        var self = this,
            c = this.container = document.createElement('table'),
            header = this.header = new domain(this,'thead'),
            body = this.body = new domain(this,'tbody'),
            footer = this.footer = new domain(this,'tfoot');
        c.className = 'instance-table';
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
                        var i = document.createElement('input');
                        i.addEventListener('input', function() { 
                            searchExec(this,self); 
                        });
                        i.type='text';
                        return { 
                            append:i, lang:function() {
                                i.placeholder = language.mapKey({
                                    en : 'Search',
                                    fr : 'Recherche'
                                });
                            }
                        };
                    })
                });
            }

            if (o.container) 
                o.container.appendChild(c);
            if (o.id) 
                this.setId(o.id);
        }

        var evt = this.eventLang = function() {
            [header,body,footer].forEach(function(q) {
                q.rows.forEach(function (r) {
                    r.columns.forEach(function(c) {
                        r.element.style.display='';
                        var l = c.lang;
                        if (r.searchable) 
                            c.element.firstChild.value='';
                        if (! l) 
                            return;
                        if (typeof l === 'object') { 
                            c.element.innerHTML = language.mapKey(l); 
                        } else if (typeof l === 'function') { 
                            l(); 
                        }
                    });
                });
            });
        };
        events.on('core.language','code.set',evt);
    };

    tblObj.prototype.setId = function(id) {
        this.id=id;
        this.container.className = 'instance-table'+(id?id : '');
    };

    tblObj.prototype.destroy = function() {
        var c = this.container,
            evt = this.eventFunctions;
        if (c && c.parentNode)
            c.parentNode.removeChild(c);
        events.remove(this.eventLang,'core.language','code.set');
    };

    return tblObj;
};
