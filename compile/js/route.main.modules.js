'use strict';

module.requires = [
    { name: 'route.main.modules.css' },
    { name: 'core.language.js' }
];

module.exports = function(app) {

    var language = app['core.language'],
        mvc = app['core.mvc'];
   
    return function(model) {

        var view = model.view,
            wrapper = view.wrapper,
            events = model.events;

        model.meta.set('title', {
            en : 'Modules',
            fr : 'Modules'
        });

        view.createAppend('h1',wrapper,{
            en : 'Igaro Reposfitory'
        });

        view.createAppend('button',view.createAppend('p',wrapper), { 
            en : 'View on Github',
            fr : 'Voir sur Github' 
        }).addEventListener('click', function() {
            window.open('https://github.com/igaro/');
        });

        view.instances.add('table',{
            container:wrapper,
            searchable:true,
            header : {
                rows : [
                    {
                        columns : [
                            {
                                lang : {
                                    en : 'Name',
                                    fr : 'Nom'
                                }
                            },
                            {
                                lang : {
                                    en : 'Description'
                                }
                            }
                        ]
                    }
                ]
            },
            body : {
                rows : [
                    ['3rdparty.fastclick', {
                        en : 'Removes 300ms click delay on mobile platforms. Useful for Cordova/Phonegap.',
                        fr : 'Supprime 300ms clic retard sur les plateformes mobiles. Utile pour Cordova / PhoneGap.'
                    }],
                    ['3rdparty.hammer', {
                        en : 'Enables Tap, DoubleTap, Swipe, Drag, Pinch, and Rotate gesture events.',
                        fr : 'Permet Tap, DoubleTap, glisser, glisser, pincer, et les événements de mouvement de rotation.'
                    }],
                    ['3rdparty.jquery.2', {
                        en : 'Non-standard library. Some insist on using it.',
                        fr : 'Bibliothèque non standard. Certains insistent sur ​​son utilisation.'
                    }],
                    ['3rdparty.moment', {
                        en : 'Date/time formatting using timezone and language.',
                        fr : 'Formatage à l\'aide fuseau horaire et la langue de date / heure.'
                    }],
                    ['3rdparty.observe', {
                        en : 'Data binding with polyfill for browsers lacking Object.observe.',
                        fr : 'La liaison de données avec polyfill pour les navigateurs qui n\'ont pas Object.observe.'
                    }],
                    ['conf.initialroutes', {
                        en : 'Initial route definitions.',
                        fr : 'Définitions route initiale.'
                    }],
                    ['conf.internalroutes', {
                        en : 'MVC source defination using the App\'s relative path.',
                        fr : 'MVC source defination using the App\'s relative path.'
                    }],
                    ['core.country', {
                        en : 'Country selection, related functionality.',
                        fr : 'MVC defination source en utilisant le chemin relatif de l\'App.'
                    }],
                    ['core.currency', {
                        en : 'Currency selection, related functionality.',
                        fr : 'Sélection de la devise, les fonctionnalités associées.'
                    }],
                    ['core.date', {
                        en : 'Timezone selection, date related functionality.',
                        fr : 'Sélection du fuseau horaire, la date des fonctionnalités liées.'
                    }],
                    ['core.debug', {
                        en : 'Centralised debug management.',
                        fr : 'Gestion centralisée de débogage.'
                    }],
                    ['core.events', {
                        en : 'Event management, registration and dispatch.',
                        fr : 'La gestion de l\'événement, l\'enregistrement et l\'envoi.'
                    }],
                    ['core.file', {
                        en : 'Filename parsing.',
                        fr : 'Nom du fichier analyse.'
                    }],
                    ['core.html', {
                        en : 'HTML parsing, conversion.',
                        fr : 'Analyse HTML, conversion.'
                    }],
                    ['core.language', {
                        en : 'Language selection, formatting.',
                        fr : 'Sélection de la langue, le formatage.'
                    }],
                    ['core.mvc', {
                        en : 'Model-view-controller architecture with use of routes.',
                        fr : 'L\'architecture modèle-vue-contrôleur à l\'utilisation des routes.'
                    }],
                    ['core.status', {
                        en : 'Status management for user feedback.',
                        fr : 'Gestion de l\'état de la rétroaction des utilisateurs.'
                    }],
                    ['core.store', {
                        en : 'Session, local and cookie store access.',
                        fr : 'Session, l\'accès au magasin local et biscuit.'
                    }],
                    ['core.url', {
                        en : 'Url parsing, related functionality.',
                        fr : 'Url analyse, les fonctionnalités associées.'
                    }],
                    ['instance.amd', {
                        en : 'Async loading of resources with requires.',
                        fr : 'Async chargement des ressources avec l\'exige.'
                    }],
                    ['instance.bookmark', {
                        en : 'Basic social media bookmarks.',
                        fr : 'Base signets de médias sociaux.'
                    }],
                    ['instance.date', {
                        en : 'Date output with language switching & timezone correction.',
                        fr : 'Date de sortie avec changement de langue et de fuseau horaire correction.'
                    }],
                    ['instance.form.validate', {
                        en : 'Form element value validation routines.',
                        fr : 'Former des routines de validation de la valeur de l\'élément.'
                    }],
                    ['instance.jsonp', {
                        en : 'Retrieve JSON data without CORS limitation.',
                        fr : 'Récupérer des données JSON sans limitation CORS.'
                    }],
                    ['instance.list', {
                        en : 'LI list management with re-ordering functionality.',
                        fr : 'Gestion de la liste LI avec la fonctionnalité de réorganisation.'
                    }],
                    ['instance.modaldialog', {
                        en : 'Async dialog boxes to replace alert() and confirm().',
                        fr : 'Boîtes de dialogue Async pour remplacer alert() et confirm().'
                    }],
                    ['instance.navigation', {
                        en : 'Navigation controls (tabs, dropdown etc).',
                        fr : 'Les contrôles de navigation (onglets, menu déroulant, etc).'
                    }],
                    ['instance.pagemessage', {
                        en : 'Displays formatted message on the page with persistent hide.',
                        fr : 'Affiche formatés message sur la page de cache persistant.'
                    }],
                    ['instance.rte', {
                        en : 'Rich text data entry and display.',
                        fr : 'Rich entrée de données de texte et d\'affichage.'
                    }],
                    ['instance.samespace', {
                        en : 'Elements in same space with navigation and animation.',
                        fr : 'Éléments dans un même espace avec la navigation et de l\'animation.'
                    }],
                    ['instance.table', {
                        en : 'Table display with row/column management.',
                        fr : 'Affichage de la table avec la direction de ligne/colonne.'
                    }],
                    ['instance.xhr', {
                        en : 'XHR (Ajax) functionality.',
                        fr : 'XHR (Ajax) fonctionnalité.'
                    }],
                    ['polyfill.es6.promises', {
                        en : 'A+ Promises for async chainable processes.',
                        fr : 'A+ Promises pour processus pouvant être enchaînées asynchrones.'
                    }],
                    ['polyfill.ie.8', {
                        en : 'Polyfill for Internet Explorer 8.',
                        fr : 'Polyfill pour Internet Explorer 8.'
                    }],
                    ['polyfill.js.1.6', {
                        en : 'Polyfill very old browsers to Mozilla 1.6 specification.',
                        fr : 'Polyfill très vieux navigateurs à la spécification Mozilla 1.6.'
                    }],
                    ['polyfill.js.1.8.1', {
                        en : 'Polyfill old browsers to Mozilla 1.8.1 specification.',
                        fr : 'Polyfill vieux navigateurs à la spécification Mozilla 1.8.1.'
                    }],
                    ['polyfill.js.1.8.5', {
                        en : 'Polyfill old browsers to Mozilla 1.8.5 specification.',
                        fr : 'Polyfill vieux navigateurs à la spécification Mozilla 1.8.5.'
                    }],
                    ['polyfill.js.classList', {
                        en : 'Polyfill HTML5 classList helpers onto DOM elements.',
                        fr : 'Polyfill aides HTML5 classList sur ​​les éléments DOM.'
                    }],
                    ['service.consoledebug', {
                        en : 'Routes debug data to the console log.',
                        fr : 'Routes déboguer données dans le journal de la console.'
                    }],
                    ['service.errormanagement', {
                        en : 'Error management, user feedback, phone home functionality.',
                        fr : 'La gestion des erreurs, la rétroaction des utilisateurs, la fonctionnalité téléphone à la maison.'
                    }],
                    ['service.status', {
                        en : 'User status update functionality.',
                        fr : 'Fonctionnalité de mise à jour de statut de l\'utilisateur.'
                    }]
                ].map(function (o) {
                    var n = o[0];
                    var a = view.createAppend('a',null,n);
                    a.href=view.path+'/'+n;
                    a.addEventListener('click', function(evt) {
                        evt.preventDefault();
                        mvc.to(model.path+'/'+n);
                    });
                    return {
                        columns : [
                            {
                                append:a, search:function() { return a.innerHTML; }
                            },
                            {
                                lang:o[1]
                            }
                        ]
                    };
                })
            }
        });

        model.store.childsupport = function(data, m) {

            var createTable = function(data,container) {

                view.createAppend('p',container,{
                    en : '* = required',
                    fr : '* = requis'
                });
                view.instances.add('table',{
                    container:container,
                    header : {
                        rows : [
                            {
                                columns : [
                                    {
                                        lang : {
                                            en : 'Name',
                                            fr : 'Nom'
                                        }
                                    },
                                    {
                                        lang : {
                                            en : 'Type'
                                        }
                                    },
                                    {
                                        lang : {
                                            en : 'Description'
                                        }
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
                                    { lang:s.name? { en: s.name + (s.required? ' *' : '') } : null }
                                ]
                            });
                            row.belongsTo=[];
                            if (at) {
                                row.belongsTo = at.belongsTo.concat([at]);
                                row.element.className = 'shade'+row.belongsTo.length;
                            }
                            var cc = row.addColumn(),
                                ce = cc.element,
                                rr = row.addColumn({ lang:s.desc?s.desc:null });
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
                                view.createAppend('span',ce,' = ');
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
                                    rr.setContent({ lang:q });
                                } else {
                                    var sa = m.name;
                                    if (m.required) 
                                        sa += ' *';
                                    var a = view.createAppend('a',ce,sa);
                                    a.href = m.href? m.href : 'https://developer.mozilla.org/en/docs/Web/API/'+m.name;
                                    if (m.desc) 
                                        rr.setContent({ lang:m.desc });
                                }
                            } else if (s.attributes && (s.type!=='function' || s.instanceof)) {
                                makeahref(row,s,ce,s.type);
                            } else {
                                view.createAppend('span',ce,s.type);
                            }

                            if (s.attributes && (s.type==='function' || s.instanceof)) {
                                view.createAppend('span',ce,' (');
                                s.attributes.forEach(function (m,i) {
                                    if (i !== 0) 
                                        view.createAppend('span',ce,',');
                                    //if (m.instanceof) {
                                    //    makeahref(row,m,ce,m.instanceof().name);
                                    if (m.instanceof || m.attributes) { 
                                        makeahref(row,m,ce,m.instanceof? m.instanceof().name : m.type); 
                                    } else { 
                                        view.createAppend('span',ce,m.type); 
                                    }
                                    if (m.required) 
                                        view.createAppend('sup',ce,'*');
                                });
                                view.createAppend('span',ce,')');
                            }
                        });
                    };
                    g(data);
                });
            };

            var v = m.view.wrapper;
            m.meta.set('title', { en : m.name });

            if (data.desc) {
                view.createAppend('h1',v,{
                    en: 'Description'
                });
                view.createAppend('p',v,data.desc);
            }

            if (data.download !== false) {
                var l = data.download? data.download : 'https://github.com/igaro/app/blob/master/app/compile/js/'+m.name+'.js';
                view.createAppend('button',v,{
                    en: 'Download'
                }).addEventListener('click', function() {
                    window.open(l);
                });
            }

            if (data.usage) {
                var u = data.usage;
                view.createAppend('h1',v,{
                    en: 'Usage'
                });
                if (u.instantiate || u.class) {
                    var o = u.instantiate? {
                        en : 'Create a new instance using <b>new <MODNAME></b>.',
                        fr : 'Créer une nouvelle instance en utilisant <b>new <MODNAME></b>.'
                    } : {
                        en : 'Access <b><MODNAME></b> directly without instantiating.',
                        fr : 'Accès <b><MODNAME></b> sans instancier.'
                    };
                    var n= 'app[\''+m.name+'\']';
                    if (u.attributes) 
                        n += '(o)';
                    Object.keys(o).forEach(function (p) { 
                        o[p]=o[p].replace(/\<MODNAME\>/g,n);
                    });
                    view.createAppend('p',v,o);
                } else if (u.direct) {
                    view.createAppend('p',v,{
                        en : 'Access the features of this library directly.',
                        fr : 'Accès aux fonctions de cette bibliothèque directement.'
                    });
                }
                if (u.attributes) {
                    view.createAppend('p',v, {
                        en : 'Where <b>o</b> is an object containing attributes from the following table.'
                    });
                    createTable(u.attributes, view.createAppend('p',v));
                }
            }        

            if (data.demo) {
                view.createAppend('h1',v,{
                    en : 'Demo',
                    fr : 'Démo'
                });
                view.createAppend('h2',v,{
                    en : 'Code'
                });

                view.createAppend('p',v);

                var dr = view.createAppend('pre',v, data.demo.trim(), 'democode');

                view.instances.add('pagemessage',{ 
                    type:'info',
                    message: {
                        en : 'Note: In demo code <b>view</b> references model.view and <b>c</b> references view.wrapper.'
                    },
                    hideable: {
                        model:model,
                        id:'democode'
                    }
                }).then(function(cp) {
                    v.insertBefore(cp.container,dr);
                });
                
                view.createAppend('h2',v,{
                    en : 'Output'
                });
                var c=view.createAppend('p',v);
                eval(data.demo);
            }

            if (data.attributes) {
                view.createAppend('h1',v,{
                    en : 'Attributes',
                    fr : 'Attributs'
                });
                createTable(data.attributes, view.createAppend('p',v));
            }

            if (data.dependencies) {
                view.createAppend('h1',v,{
                    en : 'Dependencies',
                    fr : 'Dépendances'
                });
                var p = view.createAppend('p',v);
                data.dependencies.forEach(function(o) { 
                    view.createAppend('button',p,o).addEventListener('click', function(evt) {
                        evt.preventDefault();
                        this.disabled = true;
                        var self= this;
                        mvc.to(model.path+'/'+this.value).catch().then(function () {
                            self.disabled = false;
                        });
                    }); 
                    
                });
            }

            if (data.related) {
                view.createAppend('h1',v,{
                    en : 'Related',
                    fr : 'Connexe'
                });
                var p = view.createAppend('p',v);
                data.related.forEach(function(o) { 
                    view.createAppend('button',p,o).addEventListener('click', function(evt) {
                        evt.preventDefault();
                        this.disabled = true;
                        var self= this;
                        mvc.to(model.path+'/'+this.value).catch().then(function () {
                            self.disabled = false;
                        });
                    });
                });
            }

            if (data.author) {
                view.createAppend('h1',v,{
                    en : 'Author',
                    fr : 'Auteur'
                });
                var d = data.author;
                if (typeof d === 'array') {
                    d.forEach(function (a) {
                        view.createAppend('a',view.createAppend('p',v,null),a.name).href = a.link;
                    });
                } else {
                    view.createAppend('a',view.createAppend('p',v,null),d.name).href = d.link;
                }
            }

            if (data.extlinks) {
                view.createAppend('h1',v,{
                    en : 'External Links',
                    fr : 'Liens Externes'
                });
                data.extlinks.forEach(function(o) {
                    var name,href;
                    if (typeof o === 'string') {
                        name = href = o;
                    } else {
                        name = o.name;
                        href = o.href;
                    }
                    view.createAppend('a',view.createAppend('p',v),name).href = href;
                });
            }

        };
    };
};