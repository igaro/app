
module.requires = [
    { name: 'route.main.modules.css' }
];

module.exports = function(app) {

    'use strict';

    var language = app['core.language'],
        router = app['core.router'],
        dom = app['core.dom'];

    return function(model) {

        var wrapper = model.wrapper,
            managers = model.managers,
            domMgr = managers.dom,
            objectMgr = managers.object,
            coreObject = app['core.object'],
            debugMgr = managers.debug;

        model.stash.title=_tr("Modules");
        model.stash.description=_tr("All main respository module documentation can be found on this page.");

        domMgr.mk('h1',wrapper, _tr("Igaro Repository"));
        domMgr.mk('button',domMgr.mk('p',wrapper), _tr("View on Github")).addEventListener('click', function() {
            window.open('https://github.com/igaro/app');
        });

        model.stash.childsupport = function(data, m) {

            var showBlessed = false;

            var addRows = function(meta,at,manager,reverse,tbl) {

                var makeahref = function(col,meta,content,manager) {
                    if (typeof meta.instanceof === 'function')
                        meta = meta.instanceof();
                    if (! meta.attributes && ! meta.blessed && ! meta.decorateWithContainer && ! meta.decorateWithOrder)
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
                                brows.forEach(function(br) {
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
                            addRows(meta,row,manager,null,tbl).catch(function (e) {
                                return debugMgr.handle(e);
                            });
                        });
                    });
                };

                var body=tbl.body,
                    brows=body.rows,
                    attributes = meta.attributes? meta.attributes.slice(0) : [],
                    blessed = meta.blessed,
                    decorateWithOrder = meta.decorateWithOrder;

                if (meta.decorateWithContainer) {
                    attributes.push(
                        {
                            name:"className",
                            desc: _tr("Appends a className onto the container."),
                            type:'object'
                        },
                        {
                            name:"container",
                            desc: _tr("A container in which to append the new object's container. May be an Element or an object with a container."),
                            type:'object'
                        },
                        {
                            name:'prepend',
                            type:'boolean',
                            desc:_tr("Inserts the new object's container at the beginning of the specified container.")
                        },
                        {
                            name:'insertAfter',
                            desc:_tr("Inserts the new object's container after the index of a specified object. The object can be an Element or an object with a container."),
                            type:'object'
                        },
                        {
                            name:'insertBefore',
                            desc:_tr("Inserts the new object's container before before the index of a specified object. The object can be an Element or an object with a container."),
                            type:'object'
                        }
                    );
                }

                if (decorateWithOrder) {
                    attributes.push(
                        {
                            name:'prepend',
                            type:'boolean',
                            desc:_tr("Inserts any container and the object into the beginning of parent array(s).")
                        }
                    );
                    if (typeof decorateWithOrder === 'function') {
                        attributes.push(
                            {
                                name:'insertAfter',
                                desc:_tr("Inserts any container and the object into parent array(s) after the index of a specified object."),
                                instanceof : decorateWithOrder
                            },
                            {
                                name:'insertBefore',
                                desc:_tr("Inserts any container and the object into parent array(s) before the index of a specified object."),
                                instanceof : decorateWithOrder
                            }
                        );
                    }
                }

                if (blessed) {
                    var isObject = typeof blessed === 'object',
                        managers = ['debug','dom','object','event'].map(function(o) { return [o,'core.'+o]; });
                    if (isObject && blessed.managers)
                        managers.push(blessed.managers);
                    attributes.push(
                        {
                            name:"destroy",
                            async:true,
                            desc: _tr("Call this to destroy the object. Cleanup (dependencies, DOM container, events, parent array removal) is automatic."),
                            type:"function"
                        },
                        {
                            name:"disable",
                            type:"function",
                            desc: _tr("Sets the disabled flag. This does not affect object functionality which should manually check the flag and adjust it's response. If the object has a container Element of an INPUT type then this will be disabled."),
                            attributes:[{
                                type:'boolean',
                                attributes:[{
                                   desc:_tr("Define false to enable. Default is true.")
                                }]
                            }]
                        },
                        {
                            name:"disabled",
                            type:"boolean",
                            desc: _tr("Indicates if the object is disabled.")
                        },
                        {
                            name:'managers',
                            desc:_tr("Provides customised module functionality. See core.object documentation."),
                            type:'object',
                            attributes:managers.map(function(o) {
                                return {
                                    name:o[0],
                                    type:'object',
                                    desc:language.substitute(_tr("A manager. See %[0]."), o[1])
                                };
                            })
                        },
                        {
                            name:"name",
                            desc: _tr("A value identifying the object type. Used by managers, for building the path, debugging, and events."),
                            type:"string"
                        },
                        {
                            name:"parent",
                            desc: _tr("Reference to the parent object, if applicable."),
                            type:'object'
                        },
                        {
                            name:"path",
                            desc: _tr("An internal path to the object type which indicates the module it came from and it's location in the instantiation tree. Not to be confused with URL path."),
                            instanceof : { name:'Array' }
                        }
                    );

                    if (isObject) {
                        if (blessed.container) {
                            attributes.push(
                                {
                                    name:"container",
                                    desc: _tr("A container Element representing the object."),
                                    instanceof : { name:'Element' }
                                },
                                {
                                    name:"hide",
                                    type:"function",
                                    desc: _tr("Hides the container Element."),
                                    attributes:[{
                                        type:'boolean',
                                        attributes:[{
                                           desc:_tr("Define false to show. Default is true.")
                                        }]
                                    }]
                                },
                                {
                                    name:"hidden",
                                    type:"boolean",
                                    desc: _tr("Indicates if the container Element is hidden.")
                                },
                                {
                                    name:"show",
                                    type:"function",
                                    desc: _tr("Shows the container Element.")
                                },
                                {
                                    name:"toggleVisibility",
                                    type:"function",
                                    desc: _tr("Toggles whether the container Element between visible and hidden.")
                                }
                            );
                        }
                        if (blessed.children) {
                            blessed.children.forEach(function(o) {
                                attributes.push({
                                    name:o,
                                    instanceof : { name:'Array' },
                                    desc:_tr("A pool of child objects.")
                                });
                            });
                        }
                    }
                }

                attributes = attributes.sort(function(a,b) {
                    if(a.name > b.name)
                        return -1;
                    if(a.name < b.name)
                        return 1;
                    return 0;
                });

                if (reverse)
                    attributes = attributes.reverse();

                var rows = [];
                if (manager) {
                    attributes.forEach(function(o) {
                        if (o.forManager)
                            rows.push(o);
                    });
                } else {
                    attributes.forEach(function(o) {
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
                                    var l,
                                        blessed;
                                    if (typeof returns.instanceof === 'function') {
                                        l = returns.instanceof();
                                        blessed = l.blessed;
                                        l = l.name;
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
                                    if (blessed)
                                        showBlessed = true;
                                    domMgr.mk('span',cc,' = ');
                                }
                                var m=s.instanceof;
                                if (m) {
                                    if (typeof m === 'function') {
                                        m = m();
                                        makeahref(cc,m,m.name,manager);
                                        if (m.blessed)
                                            showBlessed = true;
                                        if (m.desc) {
                                            var q = JSON.parse(JSON.stringify(m.desc));
                                            if (s.desc) {
                                                Object.keys(q).forEach(function(k) {
                                                    if (s.desc[k])
                                                        q[k] += ' '+s.desc[k];
                                                });
                                            }
                                            dom.setContent(rr, q);
                                        }
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
                                    domMgr.mk(s.async? 'u' : 'span',cc,s.type);
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

            var createTable = function(meta,container,manager) {
                domMgr.mk('p',container,language.substitute(_tr("%[0] - required, %[1]underlined%[2] - asynchronous (%[3])"),'<b>*</b>','<b><u>','</u></b>','<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise">Promise</a>'));
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
                    return addRows(meta,null,manager,true,tbl);
                }).catch(function(e) {
                    return debugMgr.handle(e);
                });
            };

            var v = m.wrapper;
            m.stash.title= { en : m.name };

            if (data.desc) {
                domMgr.mk('h1',v,_tr("Description"));
                domMgr.mk('p',v,data.desc);
                m.stash.description=data.desc;
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
                    var n= 'app[\''+m.name+'\']';
                    if (u.attributes)
                        n += '(o)';
                    if (u.instantiate) {
                        domMgr.mk('p',v,_tr("Blessed objects lazy load and instantiate via <b>[object].managers.object.create()</b>."));
                        domMgr.mk('p',v,language.substitute(_tr("Unblessed objects use <b>new %[0]</b>."),n));
                    } else {
                        domMgr.mk('p',v,language.substitute(_tr("Access <b>%[0]</b> directly without instantiating."),n));
                    }
                } else if (u.direct) {
                    domMgr.mk('p',v,_tr("Access the features of this library directly."));
                }
                if (data.manager) {
                    domMgr.mk('p',v, _tr("Provides a manager for a blessed object. See Manager below."));
                }
                if (u.attributes) {
                    domMgr.mk('p',v, _tr("Where <b>o</b> is an object containing attributes from the following table."));
                    createTable(u, domMgr.mk('p',v));
                }
            }

            if (data.attributes || data.blessed) {
                domMgr.mk('h1',v,_tr("Attributes"));
                if (data.blessed)
                    showBlessed = true;
                createTable(data, domMgr.mk('p',v));
            }

            if (data.manager) {
                domMgr.mk('h1',v,_tr("Manager"));
                domMgr.mk('p',v,_tr("A blessed object can use this module as a manager. Functions shown here should be used over those of the same name in Attributes to reduce coding complexity and to aid automation and efficiency."));
                if (typeof data.manager === 'string')
                    domMgr.mk('p',v,language.substitute(_tr("You can access this manager using <b>[object].managers.%[0]</b>."),data.manager));
                createTable(data, domMgr.mk('p',v), true);
            }

            if (data.demo) {
                domMgr.mk('h1',v,_tr("Demo"));
                domMgr.mk('h2',v,_tr("Code"));
                var cc = domMgr.mk('p',v);

                model.managers.object.create('pagemessage',{
                    type:'info',
                    message: _tr("Hint: <b>c</b> is a container element. For blessed objects this will default to the objects container."),
                    container:cc,
                    hideable: true,
                    id:model.path.join('.')+'.democode'
                }).catch(function(e) {
                    debugMgr.handle(e);
                });
                domMgr.mk('pre',v, data.demo.trim(), 'democode');
                domMgr.mk('h2',v,_tr("Output"));
                var c = domMgr.mk('p',v); //jshint ignore:line
                try {
                    var r = eval(data.demo);
                    if (r instanceof Promise) {
                        r.catch(function (e) {
                            debugMgr.handle(e);
                        });
                    }
                } catch(e) {
                    debugMgr.handle(e);
                }
            }

            if (data.dependencies) {
                domMgr.mk('h1',v,_tr("Dependencies"));
                domMgr.mk('p',v,null,function() {
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

            if (showBlessed || data.manager) {
                if (!(data.related instanceof Array))
                    data.related = [];
                if (! data.related.some(function(relation) {
                    return relation === 'core.object';
                })) data.related.push('core.object');
            }

            if (data.related) {
                domMgr.mk('h1',v,_tr("Related"));
                domMgr.mk('p',v,null,function() {
                    var s = this;
                    data.related.sort().forEach(function(o) {
                        domMgr.mk('button',s,o).addEventListener('click', function(evt) {
                            evt.preventDefault();
                            this.disabled = true;
                            var self= this;
                            router.to(model.uriPath.concat(this.innerHTML)).catch().then(function () {
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
                    ['3rdparty.moment', _tr("Date/time formatting using timezone and language.")],
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
                    ['core.object', _tr("Bless, Promise sequencer, form debounce, Array insertion and other helpers.")],
                    ['core.router', _tr("Router, an MVC alternative using routes to build partials.")],
                    ['core.store', _tr("Session, local, cookie and remote store access.")],
                    ['core.url', _tr("URL parsing, related functionality.")],
                    ['instance.accordion', _tr("Creates a list which can expand and collapse nodes.")],
                    ['instance.amd', _tr("Async loading of resources, NodeJS/Require style.")],
                    ['instance.bookmark', _tr("Basic social media bookmarking.")],
                    ['instance.date', _tr("Date display with language switching & timezone correction.")],
                    ['instance.form.validate', _tr("Form element value validation routines.")],
                    ['instance.jsonp', _tr("Retrieve JSON data without CORS limitation.")],
                    ['instance.list', _tr("LI list management with re-ordering functionality.")],
                    ['instance.modaldialog', _tr("Async dialog boxes with alert() and confirm() replacements.")],
                    ['instance.navigation', _tr("Navigation controls (tabs, dropdown etc).")],
                    ['instance.oauth2', _tr("Handles the standard authentication credential sign-in process.")],
                    ['instance.pagemessage', _tr("Displays a formatted message.")],
                    ['instance.rte', _tr("Rich text data entry and display.")],
                    ['instance.samespace', _tr("Elements in same space with navigation and animation.")],
                    ['instance.table', _tr("Table display with row/column management.")],
                    ['instance.toast', _tr("Toast notification popup and auto hide.")],
                    ['instance.xhr', _tr("XHR (Ajax) functionality.")],
                    ['polyfill.es6', _tr("A+ Promises, Array and Object sugar helpers.")],
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
