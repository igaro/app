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
            managers = model.managers,
            domMgr = managers.dom,  
            objectMgr = managers.object,
            coreObject = app['core.object'],
            debugMgr = managers.debug;
            
        model.stash.title=_tr("Modules");

        domMgr.mk('h1',wrapper, _tr("Igaro Repository"));

        domMgr.mk('button',domMgr.mk('p',wrapper), _tr("View on Github")).addEventListener('click', function() {
            window.open('https://github.com/igaro/app');
        });

        model.stash.childsupport = function(data, m) {

            var createTable = function(data,container,manager) {

                var mgrForRow = false;

                domMgr.mk('p',container,_tr("* = required"));
                return objectMgr.create('table',{
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
                    }
                }).then(function (tbl) {

                    var body=tbl.body, 
                        brows=body.rows,
                        domMgr = tbl.managers.dom;
                    var makeahref = function(col,meta,content,manager) {
                        if (meta.instanceof) 
                            meta = meta.instanceof();
                        if (! meta.attributes) 
                            return document.createElement('span');
                        var stash = col.stash,
                            container = col.container,
                            row = col.parent;
                        return domMgr.mk('a',col,content,function() {
                            stash.hyperlinks.push(this);
                            this.addEventListener('click', function(evt) {
                                evt.preventDefault();
                                var rem = this.className === 'active';
                                stash.hyperlinks.forEach(function(a) {
                                    a.className = '';
                                }); 
                                if (stash.activeFor) {
                                    container.className=stash.activeFor.container.className='';
                                    brows.forEach(function(br,i) {
                                        if (br.stash.belongsTo && br.stash.belongsTo.indexOf(row) !== -1) { 
                                            br.destroy().catch(function (e) {
                                                return debugMgr.handle(e);
                                            });
                                        }
                                    });
                                    if (stash.activeFor === col) {
                                        stash.activeFor=null;
                                        if (rem)
                                            return;
                                    }
                                }
                                stash.activeFor=col;
                                container.className = this.className = 'active';
                                addRows(meta.attributes.reverse(),row,manager).catch(function (e) {
                                    return debugMgr.handle(e);
                                });
                            });
                        });
                    };
                    var addRows = function(r,at,manager) {
                        var rows = [];
                        if (manager) {
                            r.forEach(function(o) {
                                if (o.forManager)
                                    rows.push(o);
                            });
                        } else {
                            r.forEach(function(o) {
                                if (! o.onlyManager)
                                    rows.push(o);
                            });
                        }
                        return coreObject.promiseSequencer(rows, function(s) {
                            return body.addRow({ 
                                insertAfter:at, 
                                columns:[
                                    { 
                                        content:s.name? { en: s.name + (s.required? ' *' : '') } : null
                                    }
                                ]
                            }).then(function(row) {
                                var stash = row.stash;
                                stash.belongsTo=[];
                                if (at) {
                                    stash.belongsTo = at.stash.belongsTo.concat([at]);
                                    row.container.classList.add('shade'+stash.belongsTo.length);
                                }
                                return row.addColumn().then(function(cc) {
                                    var domMgr = cc.managers.dom;
                                    return row.addColumn({ 
                                        content:s.desc?s.desc:null 
                                    }).then(function(rr) {
                                        cc.stash.hyperlinks = [];
                                        var returns = s.returns;
                                        if (returns && s.type==='function') {
                                            var l;
                                            if (returns.instanceof) {
                                                l = returns.instanceof().name;
                                            } else if (returns.type) {
                                                l = returns.type;
                                            } else {
                                                l = '⊗';
                                            }
                                            if (returns.attributes)
                                                returns.attributes.forEach(function(o) {
                                                    o.forManager = s.forManager;
                                                });
                                            makeahref(cc,returns,l,manager);
                                            domMgr.mk('span',cc,' = ');
                                        }
                                        var m=s.instanceof;
                                        if (m) {
                                            if (typeof m === 'function') { 
                                                m = m();
                                                makeahref(cc,m,m.name,manager);
                                                var q = JSON.parse(JSON.stringify(m.desc));
                                                if (s.desc) {
                                                    Object.keys(q).forEach(function(k) {
                                                        if (s.desc[k]) 
                                                            q[k] += ' '+s.desc[k];
                                                    });
                                                }
                                                dom.setContent(rr, q);
                                            } else {
                                                var sa = m.name;
                                                if (m.required) 
                                                    sa += ' *';
                                                domMgr.mk('a',cc,sa).href = m.href? m.href : 'https://developer.mozilla.org/en-US/search?q='+m.name;
                                                if (m.desc) 
                                                    dom.setContent(rr,m.desc);
                                            }
                                        } else if (s.attributes && s.type!=='function') {
                                            s.attributes.forEach(function(o) {
                                                o.forManager = s.forManager;
                                            });
                                            makeahref(cc,s,s.type,manager);
                                        } else {
                                            domMgr.mk('span',cc,s.type);
                                        }

                                        if (s.attributes && (s.type==='function' || s.instanceof)) {
                                            var j = 0;
                                            s.attributes.forEach(function (m) {
                                                if (manager && ! m.forManager)
                                                    return;
                                                if (! manager && m.onlyManager)
                                                    return;
                                                if (! j)
                                                    domMgr.mk('span',cc,' (');
                                                if (j) 
                                                    domMgr.mk('span',cc,',');
                                                var mIO = m.instanceof;
                                                if (mIO || m.attributes) { 
                                                    if (m.attributes) {
                                                        m.attributes.forEach(function(o) {
                                                            o.forManager = m.forManager;
                                                        });
                                                    }
                                                    makeahref(cc,m,mIO? mIO().name : m.type,manager); 
                                                } else { 
                                                    domMgr.mk('span',cc,m.type); 
                                                }
                                                if (m.required) 
                                                    domMgr.mk('sup',cc,'*');
                                                j++;
                                            });
                                            if (j)
                                                domMgr.mk('span',cc,')');
                                        }
                                    });
                                });
                            });
                        });
                    };
                    return addRows(data,null,manager);
                }).catch(function(e) {
                    return debugMgr.handle(e);
                });
            };

            var v = m.wrapper;
            m.stash.title= { en : m.name };

            if (data.desc) {
                domMgr.mk('h1',v,_tr("Description"));
                domMgr.mk('p',v,data.desc);
            }

            if (data.embedded)
                domMgr.mk('p',v,_tr("This module is embedded into igaro.js"));

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
                        _tr("Create a new instance using <b>new %[0]</b>.")
                    :
                        _tr("Access <b>%[0]</b> directly without instantiating.")
                    ;
                    var n= 'app[\''+m.name+'\']';
                    if (u.attributes) 
                        n += '(o)';
                    domMgr.mk('p',v,language.substitute(o,n));
                } else if (u.direct) {
                    domMgr.mk('p',v,_tr("Access the features of this library directly."));
                }
                if (data.manager) {
                    domMgr.mk('p',v, _tr("Provides a manager for a blessed object. See Manager below."));
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

            if (data.attributes || data.blessed) {
                domMgr.mk('h1',v,_tr("Attributes"));
                if (data.blessed)
                    domMgr.mk('p',v,_tr("This object is blessed. See core.object documentation."));
                if (data.attributes)
                    createTable(data.attributes, domMgr.mk('p',v));
            }

            if (data.manager) {
                domMgr.mk('h1',v,_tr("Manager"));
                domMgr.mk('p',v,_tr("A blessed object can use this module as a manager (see core.object). These functions should be used over those in Attributes to reduce coding duplicity and to set and manage relations and dependencies."));
                if (typeof data.manager === 'string')
                    domMgr.mk('p',v,language.substitute(_tr("You can access this manager using <b>[object].managers.%[0]</b>."),data.manager));
                createTable(data.attributes, domMgr.mk('p',v), true);
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
                    ['core.dom', _tr("Provides DOM management and helpers.")],
                    ['core.events', _tr("Event management, registration and dispatcher.")],
                    ['core.file', _tr("Filename parsing.")],
                    ['core.html', _tr("HTML parsing, conversion.")],
                    ['core.language', _tr("Language support, formatting, related functionality.")],
                    ['core.object', _tr("Bless and other object helper functionality.")],
                    ['core.router', _tr("Router, an MVC alternative using routes to build partials.")],
                    ['core.store', _tr("Session, local, cookie and remote store access.")],
                    ['core.url', _tr("URL parsing, related functionality.")],
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
            return tbl.addSearchColumns().then(function() {
                return tbl;
            });
        });

    };
};

})();
