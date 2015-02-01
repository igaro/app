(function () {

'use strict';

module.requires = [
    { name: 'route.main.modules.css' },
    { name: 'core.language.js' }
];

module.exports = function(app) {

    var language = app['core.language'],
        router = app['core.router'];
   
    return function(model) {

        var wrapper = model.wrapper,
            dom = model.managers.dom;
            
        model.setMeta('title', {"fr":"","en":"Modules"});

        dom.mk('h1',wrapper, {"fr":"","en":"Igaro Repository"});

        dom.mk('button',dom.mk('p',wrapper), {"fr":"","en":"View on Github"}).addEventListener('click', function() {
            window.open('https://github.com/igaro/app');
        });

        model.stash.childsupport = function(data, m) {

            var createTable = function(data,container) {

                dom.mk('p',container,{"fr":"","en":"* = required"});
                model.addInstance('table',{
                    container:container,
                    header : {
                        rows : [
                            {
                                columns : [
                                    {
                                        content : {"fr":"","en":"Name"}
                                    },
                                    {
                                        content : {"fr":"","en":"Type"}
                                    },
                                    {
                                        content : {"fr":"","en":"Description"}
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
                        return a;
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
                                dom.mk('span',ce,' = ');
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
                                    var a = dom.mk('a',ce,sa);
                                    a.href = m.href? m.href : 'https://developer.mozilla.org/en/docs/Web/API/'+m.name;
                                    if (m.desc) 
                                        rr.setContent({ content:m.desc });
                                }
                            } else if (s.attributes && (s.type!=='function' || s.instanceof)) {
                                makeahref(row,s,ce,s.type);
                            } else {
                                dom.mk('span',ce,s.type);
                            }

                            if (s.attributes && (s.type==='function' || s.instanceof)) {
                                dom.mk('span',ce,' (');
                                s.attributes.forEach(function (m,i) {
                                    if (i !== 0) 
                                        dom.mk('span',ce,',');
                                    //if (m.instanceof) {
                                    //    makeahref(row,m,ce,m.instanceof().name);
                                    if (m.instanceof || m.attributes) { 
                                        makeahref(row,m,ce,m.instanceof? m.instanceof().name : m.type); 
                                    } else { 
                                        dom.mk('span',ce,m.type); 
                                    }
                                    if (m.required) 
                                        dom.mk('sup',ce,'*');
                                });
                                dom.mk('span',ce,')');
                            }
                        });
                    };
                    g(data);
                });
            };

            var v = m.wrapper;
            m.setMeta('title', { en : m.name });

            if (data.desc) {
                dom.mk('h1',v,{"fr":"","en":"Description"});
                dom.mk('p',v,data.desc);
            }

            if (data.download !== false) {
                var l = data.download? data.download : 'https://github.com/igaro/app/blob/master/app/compile/js/'+m.name+'.js';
                dom.mk('button',v,{"fr":"","en":"Download"}).addEventListener('click', function() {
                    window.open(l);
                });
            }

            if (data.usage) {
                var u = data.usage;
                dom.mk('h1',v,{"fr":"","en":"Usage"});
                if (u.instantiate || u.class) {
                    var o = u.instantiate? 
                        {"fr":"","en":"Create a new instance using <b>new <MODNAME></b>."}
                    :
                        {"fr":"","en":"Access <b><MODNAME></b> directly without instantiating."}
                    ;
                    var n= 'app[\''+m.name+'\']';
                    if (u.attributes) 
                        n += '(o)';
                    Object.keys(o).forEach(function (p) { 
                        o[p]=o[p].replace(/\<MODNAME\>/g,n);
                    });
                    dom.mk('p',v,o);
                } else if (u.direct) {
                    dom.mk('p',v,{"fr":"","en":"Access the features of this library directly."});
                }
                if (u.attributes) {
                    dom.mk('p',v, {"fr":"","en":"Where <b>o</b> is an object containing attributes from the following table."});
                    createTable(u.attributes, dom.mk('p',v));
                }
            }        

            if (data.demo) {
                dom.mk('h1',v,{"fr":"","en":"Demo"});
                dom.mk('h2',v,{"fr":"","en":"code"});
                dom.mk('p',v);

                var dr = dom.mk('pre',v, data.demo.trim(), 'democode');

                model.addInstance('pagemessage',{ 
                    type:'info',
                    message: {"fr":"","en":"Note: In demo code <b>c</b> references model.wrapper."},
                    hideable: {
                        model:model,
                        id:'democode'
                    }
                }).then(function(cp) {
                    v.insertBefore(cp.container,dr);
                });
                
                dom.mk('h2',v,{"fr":"","en":"Output"});
                dom.mk('p',v);
                eval(data.demo);
            }

            if (data.attributes) {
                dom.mk('h1',v,{"fr":"","en":"Attributes"});
                createTable(data.attributes, dom.mk('p',v));
            }

            if (data.dependencies) {
                dom.mk('h1',v,{"fr":"","en":"Dependencies"});
                var p = dom.mk('p',v,null,function() {
                    var s = this;
                    data.dependencies.forEach(function(o) { 
                        dom.mk('button',s,o).addEventListener('click', function(evt) {
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
                dom.mk('h1',v,{"fr":"","en":"Related"});
                dom.mk('p',v,null,function() {
                    var s = this;
                    data.related.forEach(function(o) { 
                        dom.mk('button',s,o).addEventListener('click', function(evt) {
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
                dom.mk('h1',v,{"fr":"","en":"Author"});
                var d = data.author;
                if (d instanceof Array) {
                    d.forEach(function (a) {
                        dom.mk('a',dom.mk('p',v,null),a.name).href = a.link;
                    });
                } else {
                    dom.mk('a',dom.mk('p',v,null),d.name).href = d.link;
                }
            }

            if (data.extlinks) {
                dom.mk('h1',v,{"fr":"","en":"External Links"});
                data.extlinks.forEach(function(o) {
                    var name,href;
                    if (typeof o === 'string') {
                        name = href = o;
                    } else {
                        name = o.name;
                        href = o.href;
                    }
                    dom.mk('a',dom.mk('p',v),name).href = href;
                });
            }
        };

        return model.addInstance('table',{
            container:wrapper,
            searchable:true,
            header : {
                rows : [
                    {
                        columns : [
                            {
                                content : {"fr":"","en":"Name"}
                            },
                            {
                                content : {"fr":"","en":"Description"}
                            }
                        ]
                    }
                ]
            },
            body : {
                rows : [
                    ['3rdparty.fastclick', {"fr":"","en":"Removes 300ms click delay on touch platforms."}],
                    ['3rdparty.hammer', {"fr":"","en":"Enables Tap, DoubleTap, Swipe, Drag, Pinch, and Rotate gesture events."}],
                    ['3rdparty.jquery.2', {"fr":"","en":"Non-standard library. Some insist on using it."}],
                    ['3rdparty.moment', {"fr":"","en":"Date/time formatting using timezone and language."}],
                    ['3rdparty.observe', {"fr":"","en":"Data binding with polyfill for browsers lacking Object.observe."}],
                    ['conf.app', {"fr":"","en":"Main configuration file."}],
                    ['core.country', {"fr":"","en":"Country support and related functionality."}],
                    ['core.currency', {"fr":"","en":"Currency support and related functionality."}],
                    ['core.date', {"fr":"","en":"Timezone selection, date related functionality."}],
                    ['core.debug', {"fr":"","en":"Centralised debug management."}],
                    ['core.dom', {"fr":"","en":"Provides DOM management and helpers."}],
                    ['core.events', {"fr":"","en":"Event management, registration and dispatcher."}],
                    ['core.file', {"fr":"","en":"Filename parsing."}],
                    ['core.html', {"fr":"","en":"HTML parsing, conversion."}],
                    ['core.language', {"fr":"","en":"Language support, formatting, related functionality."}],
                    ['core.router', {"fr":"","en":"Router, an MVC alternative using routes to build partials."}],
                    ['core.status', {"fr":"","en":"Status management for user feedback."}],
                    ['core.store', {"fr":"","en":"Session, local, cookie and remote store access."}],
                    ['core.url', {"fr":"","en":"Url parsing, related functionality."}],
                    ['instance.amd', {"fr":"","en":"Async loading of resources, NodeJS/Require style."}],
                    ['instance.bookmark', {"fr":"","en":"Basic social media bookmarking."}],
                    ['instance.date', {"fr":"","en":"Date display with language switching & timezone correction."}],
                    ['instance.form.validate', {"fr":"","en":"Form element value validation routines."}],
                    ['instance.jsonp', {"fr":"","en":"Retrieve JSON data without CORS limitation."}],
                    ['instance.list', {"fr":"","en":"LI list management with re-ordering functionality."}],
                    ['instance.modaldialog', {"fr":"","en":"Async dialog boxes with alert() and confirm() replacements."}],
                    ['instance.navigation', {"fr":"","en":"Navigation controls (tabs, dropdown etc)."}],
                    ['instance.pagemessage', {"fr":"","en":"Displays a formatted message."}],
                    ['instance.rte', {"fr":"","en":"Rich text data entry and display."}],
                    ['instance.samespace', {"fr":"","en":"Elements in same space with navigation and animation."}],
                    ['instance.table', {"fr":"","en":"Table display with row/column management."}],
                    ['instance.toast', {"fr":"","en":"Toast notification popup and auto hide."}],
                    ['instance.xhr', {"fr":"","en":"XHR (Ajax) functionality."}],
                    ['polyfill.es6.promises', {"fr":"","en":"A+ Promises for async chainable processes."}],
                    ['polyfill.ie.8', {"fr":"","en":"Polyfill for Internet Explorer 8."}],
                    ['polyfill.js.1.6', {"fr":"","en":"Polyfill ancient browsers to Mozilla 1.6 specification."}],
                    ['polyfill.js.1.8.1', {"fr":"","en":"Polyfill old browsers to Mozilla 1.8.1 specification."}],
                    ['polyfill.js.1.8.5', {"fr":"","en":"Polyfill deprecated browsers to Mozilla 1.8.5 specification."}],
                    ['polyfill.js.classList', {"fr":"","en":"Polyfill HTML5 classList helpers onto DOM elements."}],
                ].map(function (o) {
                    var n = o[0];
                    var a = dom.mk('a',null,n);
                    a.href='#!/'+model.uriPath+'/'+n;
                    a.addEventListener('click', function(evt) {
                        evt.preventDefault();
                        router.to(model.uriPath.concat(n));
                    });
                    return {
                        columns : [
                            {
                                content:a, search:function() { return a.innerHTML; }
                            },
                            {
                                content:o[1]
                            }
                        ]
                    };
                })
            }
        });

    };
};

})();