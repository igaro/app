(function () {

'use strict';

module.requires = [
    { name: 'route.main.modules.css' }
];

module.exports = function(app) {

    var language = app['core.language'],
        router = app['core.router'];
   
    return function(model) {

        var wrapper = model.wrapper,
            domMgr = model.managers.dom;
            
        model.stash.title=_tr("Modules");

        domMgr.mk('h1',wrapper, _tr("Igaro Repository"));

        domMgr.mk('button',domMgr.mk('p',wrapper), _tr("View on Github")).addEventListener('click', function() {
            window.open('https://github.com/igaro/app');
        });

        model.stash.childsupport = function(data, m) {

            var createTable = function(data,container) {

                domMgr.mk('p',container,_tr("* = required"));
                model.managers.object.create('table',{
                    container:container,
                    header : {
                        rows : [
                            {
                                columns : [
                                    {
                                        content : _tr("Name")
                                    },
                                    {
                                        content : _tr("Type")
                                    },
                                    {
                                        content : _tr("Description")
                                    }
                                ]
                            }
                        ]
                    },
                    body : {
                        rows : [

                        ]
                    }
                }).then(function (tbl) {

                    var body=tbl.body, 
                        brows=body.rows;
                    var makeahref = function(row,sd,td,cc) {
                        if (sd.instanceof) 
                            sd = sd.instanceof();
                        if (! sd.attributes) 
                            return document.createElement('span');
                        var a = document.createElement('a');
                        a.addEventListener('click', function(evt) {
                            evt.preventDefault();
                            if (td.activeFor) {
                                td.className=td.activeFor.className='';
                                for (var i=0; i < brows.length; i++) {
                                    if (brows[i].belongsTo.indexOf(row) !== -1) { 
                                        body.deleteRow(brows[i]); 
                                        --i;
                                    }
                                }
                                if (td.activeFor === this) {
                                    td.activeFor=null;
                                    return;
                                }
                            }
                            td.activeFor=this;
                            g(sd.attributes.reverse(),row);
                            td.className = this.className = 'active' ;
                        });
                        if (cc) 
                            a.innerHTML = cc;
                        td.appendChild(a);


                        return Promise.all([
                            tbl.addSearchColumn('text'),
                            tbl.addSearchColumn('text')
                        ]).then(function() {
                            return a;
                        });

                    };
                    var g = function(t,at) {
                        t.forEach(function (s) {
                            var row = body.addRow({ 
                                insertBefore:at? brows.indexOf(at)+1: null, 
                                columns:[
                                    { content:s.name? { en: s.name + (s.required? ' *' : '') } : null }
                                ]
                            });
                            row.belongsTo=[];
                            if (at) {
                                row.belongsTo = at.belongsTo.concat([at]);
                                row.element.className = 'shade'+row.belongsTo.length;
                            }
                            var cc = row.addColumn(),
                                ce = cc.element,
                                rr = row.addColumn({ content:s.desc?s.desc:null });
                            if (s.returns && s.type==='function') {
                                var l,
                                    returns = s.returns;
                                if (returns.instanceof) {
                                    l = returns.instanceof().name;
                                } else if (returns.type) {
                                    l = returns.type;
                                } else {
                                    l = '⊗';
                                }
                                makeahref(row,s.returns,ce, l);
                                domMgr.mk('span',ce,' = ');
                            }
                            if (s.instanceof) {
                                var m=s.instanceof;
                                if (typeof m === 'function') { 
                                    var mm = m(),
                                        a = makeahref(row,mm,ce,mm.name),
                                        w = function() {
                                            a.title = language.mapKey(mm.desc); 
                                        };
                                    events.on('core.language','code.set', w);
                                    w();
                                    var q = JSON.parse(JSON.stringify(mm.desc));
                                    if (s.desc) {
                                        Object.keys(q).forEach(function(k) {
                                            if (s.desc[k]) 
                                                q[k] += ' '+s.desc[k];
                                        });
                                    }
                                    rr.setContent({ content:q });
                                } else {
                                    var sa = m.name;
                                    if (m.required) 
                                        sa += ' *';
                                    var a = domMgr.mk('a',ce,sa);
                                    a.href = m.href? m.href : 'https://developer.mozilla.org/en/docs/Web/API/'+m.name;
                                    if (m.desc) 
                                        rr.setContent({ content:m.desc });
                                }
                            } else if (s.attributes && (s.type!=='function' || s.instanceof)) {
                                makeahref(row,s,ce,s.type);
                            } else {
                                domMgr.mk('span',ce,s.type);
                            }

                            if (s.attributes && (s.type==='function' || s.instanceof)) {
                                domMgr.mk('span',ce,' (');
                                s.attributes.forEach(function (m,i) {
                                    if (i !== 0) 
                                        domMgr.mk('span',ce,',');
                                    //if (m.instanceof) {
                                    //    makeahref(row,m,ce,m.instanceof().name);
                                    if (m.instanceof || m.attributes) { 
                                        makeahref(row,m,ce,m.instanceof? m.instanceof().name : m.type); 
                                    } else { 
                                        domMgr.mk('span',ce,m.type); 
                                    }
                                    if (m.required) 
                                        domMgr.mk('sup',ce,'*');
                                });
                                domMgr.mk('span',ce,')');
                            }
                        });
                    };
                    g(data);
                });
            };

            var v = m.wrapper;
            m.stash.title= { en : m.name };

            if (data.desc) {
                domMgr.mk('h1',v,_tr("Description"));
                domMgr.mk('p',v,data.desc);
            }

            if (data.download !== false) {
                var l = data.download? data.download : 'https://github.com/igaro/app/blob/master/app/compile/js/'+m.name+'.js';
                domMgr.mk('button',v,_tr("Download")).addEventListener('click', function() {
                    window.open(l);
                });
            }

            if (data.usage) {
                var u = data.usage;
                domMgr.mk('h1',v,_tr("Usage"));
                if (u.instantiate || u.class) {
                    var o = u.instantiate? 
                        _tr("Create a new instance using <b>new <MODNAME></b>.")
                    :
                        _tr("Access <b><MODNAME></b> directly without instantiating.")
                    ;
                    var n= 'app[\''+m.name+'\']';
                    if (u.attributes) 
                        n += '(o)';
                    Object.keys(o).forEach(function (p) { 
                        o[p]=o[p].replace(/\<MODNAME\>/g,n);
                    });
                    domMgr.mk('p',v,o);
                } else if (u.direct) {
                    domMgr.mk('p',v,_tr("Access the features of this library directly."));
                }
                if (u.attributes) {
                    domMgr.mk('p',v, _tr("Where <b>o</b> is an object containing attributes from the following table."));
                    createTable(u.attributes, domMgr.mk('p',v));
                }
            }        

            if (data.demo) {
                domMgr.mk('h1',v,_tr("Demo"));
                domMgr.mk('h2',v,_tr("code"));
                domMgr.mk('p',v);

                var dr = domMgr.mk('pre',v, data.demo.trim(), 'democode');

                model.managers.object.create('pagemessage',{ 
                    type:'info',
                    message: _tr("Note: In demo code <b>c</b> references model.wrapper."),
                    hideable: {
                        model:model,
                        id:'democode'
                    }
                }).then(function(cp) {
                    v.insertBefore(cp.container,dr);
                });
                
                domMgr.mk('h2',v,_tr("Output"));
                domMgr.mk('p',v);
                eval(data.demo);
            }

            if (data.attributes) {
                domMgr.mk('h1',v,_tr("Attributes"));
                createTable(data.attributes, domMgr.mk('p',v));
            }

            if (data.dependencies) {
                domMgr.mk('h1',v,_tr("Dependencies"));
                var p = domMgr.mk('p',v,null,function() {
                    var s = this;
                    data.dependencies.forEach(function(o) { 
                        domMgr.mk('button',s,o).addEventListener('click', function(evt) {
                            evt.preventDefault();
                            this.disabled = true;
                            var self= this;
                            router.to(model.path+'/'+this.value).catch().then(function () {
                                self.disabled = false;
                            });
                        });
                    });
                });
            }

            if (data.related) {
                domMgr.mk('h1',v,_tr("Related"));
                domMgr.mk('p',v,null,function() {
                    var s = this;
                    data.related.forEach(function(o) { 
                        domMgr.mk('button',s,o).addEventListener('click', function(evt) {
                            evt.preventDefault();
                            this.disabled = true;
                            var self= this;
                            router.to(model.path+'/'+this.value).catch().then(function () {
                                self.disabled = false;
                            });
                        });
                    });
                });
                
            }

            if (data.author) {
                domMgr.mk('h1',v,_tr("Author"));
                var d = data.author;
                if (d instanceof Array) {
                    d.forEach(function (a) {
                        domMgr.mk('a',domMgr.mk('p',v,null),a.name).href = a.link;
                    });
                } else {
                    domMgr.mk('a',domMgr.mk('p',v,null),d.name).href = d.link;
                }
            }

            if (data.extlinks) {
                domMgr.mk('h1',v,_tr("External Links"));
                data.extlinks.forEach(function(o) {
                    var name,href;
                    if (typeof o === 'string') {
                        name = href = o;
                    } else {
                        name = o.name;
                        href = o.href;
                    }
                    domMgr.mk('a',domMgr.mk('p',v),name).href = href;
                });
            }
        };

        return model.managers.object.create('table',{
            container:wrapper,
            searchable:true,
            header : {
                rows : [
                    {
                        columns : [
                            {
                                content : _tr("Name")
                            },
                            {
                                content : _tr("Description")
                            }
                        ]
                    }
                ]
            },
            body : {
                rows : [
                    ['3rdparty.fastclick', _tr("Removes 300ms click delay on touch platforms.")],
                    ['3rdparty.hammer', _tr("Enables Tap, DoubleTap, Swipe, Drag, Pinch, and Rotate gesture events.")],
                    ['3rdparty.jquery.2', _tr("Non-standard library. Some insist on using it.")],
                    ['3rdparty.moment', _tr("Date/time formatting using timezone and language.")],
                    ['3rdparty.observe', _tr("Data binding with polyfill for browsers lacking Object.observe.")],
                    ['conf.app', _tr("Main configuration file.")],
                    ['core.country', _tr("Country support and related functionality.")],
                    ['core.currency', _tr("Currency support and related functionality.")],
                    ['core.date', _tr("Timezone selection, date related functionality.")],
                    ['core.debug', _tr("Centralised debug management.")],
                    ['core.domMgr', _tr("Provides DOM management and helpers.")],
                    ['core.events', _tr("Event management, registration and dispatcher.")],
                    ['core.file', _tr("Filename parsing.")],
                    ['core.html', _tr("HTML parsing, conversion.")],
                    ['core.language', _tr("Language support, formatting, related functionality.")],
                    ['core.router', _tr("Router, an MVC alternative using routes to build partials.")],
                    ['core.status', _tr("Status management for user feedback.")],
                    ['core.store', _tr("Session, local, cookie and remote store access.")],
                    ['core.url', _tr("Url parsing, related functionality.")],
                    ['instance.amd', _tr("Async loading of resources, NodeJS/Require style.")],
                    ['instance.bookmark', _tr("Basic social media bookmarking.")],
                    ['instance.date', _tr("Date display with language switching & timezone correction.")],
                    ['instance.form.validate', _tr("Form element value validation routines.")],
                    ['instance.jsonp', _tr("Retrieve JSON data without CORS limitation.")],
                    ['instance.list', _tr("LI list management with re-ordering functionality.")],
                    ['instance.modaldialog', _tr("Async dialog boxes with alert() and confirm() replacements.")],
                    ['instance.navigation', _tr("Navigation controls (tabs, dropdown etc).")],
                    ['instance.pagemessage', _tr("Displays a formatted message.")],
                    ['instance.rte', _tr("Rich text data entry and display.")],
                    ['instance.samespace', _tr("Elements in same space with navigation and animation.")],
                    ['instance.table', _tr("Table display with row/column management.")],
                    ['instance.toast', _tr("Toast notification popup and auto hide.")],
                    ['instance.xhr', _tr("XHR (Ajax) functionality.")],
                    ['polyfill.es6.promises', _tr("A+ Promises for async chainable processes.")],
                    ['polyfill.ie.8', _tr("Polyfill for Internet Explorer 8.")],
                    ['polyfill.js.1.6', _tr("Polyfill ancient browsers to Mozilla 1.6 specification.")],
                    ['polyfill.js.1.8.1', _tr("Polyfill old browsers to Mozilla 1.8.1 specification.")],
                    ['polyfill.js.1.8.5', _tr("Polyfill deprecated browsers to Mozilla 1.8.5 specification.")],
                    ['polyfill.js.classList', _tr("Polyfill HTML5 classList helpers onto DOM elements.")],
                ].map(function (o) {
                    var n = o[0];
                    var a = domMgr.mk('a',null,n,function() {
                        this.href=n;
                        this.addEventListener('click', function(evt) {
                            evt.preventDefault();
                            router.to(model.uriPath.concat(n));
                        });
                    });
                    return {
                        columns : [
                            {
                                content:a
                            },
                            {
                                content:o[1]
                            }
                        ]
                    };
                })
            }
        }).then(function(tbl) {
            return Promise.all([
                tbl.addSearchColumn('text'),
                tbl.addSearchColumn('text')
            ]).then(function() {
                return tbl;
            });
        });

    };
};

})();
