(function() {

"use strict";

module.requires = [
    { name:'route.header.css' },
    { name:'core.language.js' },
    { name:'core.country.js' },
    { name:'core.currency.js' },
    { name:'core.date.js' }
];

module.exports = function(app) {

    var events = app['core.events'], 
        language = app['core.language'], 
        router = app['core.router'], 
        xcti = app['core.date'];

    return function(model) {

        var view = model.view, 
            wrapper = model.wrapper,
            managers = model.managers,
            domMgr = managers.dom;

        domMgr.mk('div',wrapper,null,'logo').addEventListener('click', function() {
            router.to([]);
        });

        return model.addSequence({

            container:wrapper,
            promises : [

                managers.object.create({ name:'navigation'},{
                    type:'headermn',
                    pool : [
                        { 
                            id:'app', 
                            active:true 
                        }, 
                        { 
                            id:'api', 
                            href : 'http://api.igaro.com'
                        }
                    ]
                }),

                new Promise(function(resolve) {
                    return resolve(domMgr.mk('a',null,null, function() {
                        this.className = 'settings';
                        this.addEventListener('click', function(event) {
                            event.preventDefault();
                            managers.object.create('modaldialog').then(function(modal) {
                                return modal.managers.object.create('accordion').then(function(accordion) {
                                   
                                    var managers = accordion.managers,
                                        domMgr = managers.dom,
                                        debugMgr = managers.debug,
                                        eventMgr = managers.event;

                                     // country/lang/currency
                                    var writeModuleOptions = function(select,name) {
                                        name = 'core.'+name;
                                        var mod = app[name];
                                        select.addEventListener('change', function() {
                                            (this.selectedIndex === 0? mod.reset() : mod.setEnv(this.options[this.selectedIndex].value)).catch(function(e) {
                                                return debugMgr.handle(e);
                                            })
                                        });
                                        var write = function() {
                                            select.options.length = 0;
                                            domMgr.mk('option',select,_tr("Auto"),'auto');
                                            Object.keys(mod.pool).forEach(function (o) {
                                                domMgr.mk('option',select,mod.pool[o].name, function() {
                                                    this.value = o;
                                                    this.selected = ! mod.isAuto && o===mod.env;
                                                });
                                            });
                                        };
                                        eventMgr.on(name,'code.set', function(c) {
                                            select.options.forEach(function(o) {
                                                o.selected = o.id === c;
                                            });
                                        });
                                        eventMgr.on(name,'pool.set', write);
                                        write();
                                    };

                                    // timezone
                                    var writeTimezone = function(tzmenu) {
                                        var tzval = function() {
                                            var cti = xcti.offset.get(),
                                                t = language.mapKey({
                                                    en : 'GMT [t] [h]h [m]m'
                                                }),
                                                isNeg = cti < 0? true:false;
                                            t = t.replace('[t]',isNeg? '-' : '+');
                                            if (cti < 0) 
                                                cti *= -1;
                                            var h = cti > 0? parseInt(cti/60) : 0;
                                            t = t.replace('[h]',h);
                                            var m = cti % 60;
                                            t = t.replace('[m]',m);
                                            return t;
                                        },
                                        tzvalueopt = tzmenu.addOption({ title:tzval, active:true });
                                        events.on('core.date','offset.set', function() {
                                            var offset = tzval();
                                            tzvalueopt.updateTitle(offset);
                                        });
                                        tzmenu.addOption({
                                            title:{
                                                en : 'Set',
                                                fr : 'Spécifier'
                                            }, 
                                            onClick:function() {
                                                var cti = xcti.offset.get(),
                                                    isNeg = cti < 0? true:false,
                                                    hrs = cti > 0? parseInt(cti/60) : 0,
                                                    min = cti % 60,
                                                    i,
                                                    frag = document.createDocumentFragment(),
                                                    type = domMgr.mk('select',frag);
                                                ['+','-'].forEach(function (o) { 
                                                    type.options[type.options.length] = new Option(o); 
                                                });
                                                if (isNeg) 
                                                    type.options[1].selected = true;
                                                var hours = domMgr.mk('select',frag);
                                                for (i=0; i <= 14; i++) {
                                                    hours.options[hours.options.length] = new Option(i);
                                                    if (hrs === i) 
                                                        hours.options[hours.options.length-1].selected = true;
                                                }
                                                var minutes = domMgr.mk('select',frag);
                                                for (i=0; i < 60; i+=15) {
                                                    minutes.options[minutes.options.length] = new Option(i);
                                                    if (min === i) 
                                                        minutes.options[minutes.options.length-1].selected = true;
                                                }
                                                model.managers.object.create('modaldialog').then(function(g) {
                                                    g.confirm({
                                                        message: {
                                                            en : 'Please specify your timezone offset in terms of hours and minutes.',
                                                            fr : 'S\'il vous plaît indiquer décalage en termes d\'heures et de minutes de votre fuseau horaire.'
                                                        },
                                                        inputs : frag
                                                    }).then(function(ac) {
                                                        if (ac.cancel) 
                                                            return;
                                                        var m = hours.selectedIndex*60;
                                                        m += minutes.selectedIndex*15;
                                                        if (type.selectedIndex === 1) 
                                                            m *= -1;
                                                        xcti.offset.set(m);
                                                    });
                                                });
                                            } 
                                        });
                                    };

                                    accordion.addSection({ 
                                        title:_tr("Language"), 
                                        content:domMgr.mk('select',null,null, function() {
                                            writeModuleOptions(this,'language');
                                        })
                                    });
                                    accordion.addSection({ 
                                        title:_tr("Timezone"), 
                                        content:domMgr.mk('select',null,null, function() {

                                         //   writeModuleOptions(this,'language');

                                        })
                                    });
                                    accordion.addSection({ 
                                        title:_tr("Currency"), 
                                        content:domMgr.mk('select',null,null, function() {

                                            writeModuleOptions(this,'currency');

                                        })
                                    });
                                    accordion.addSection({ 
                                        title:_tr("Country"), 
                                        content:domMgr.mk('select',null,null, function() {

                                            writeModuleOptions(this,'country');

                                        })
                                    });

                                    return modal.custom({
                                        noCancel:true,
                                        title:_tr("Locale"),
                                        custom:accordion.container
                                    });
                                })
                            }).catch(function(e) {
                                return managers.debug.handle(e);
                            }); 
                        });    
                    }));
                }),

                new Promise(function(resolve) {
                     var xhricon = domMgr.mk('div',null,null,'xhr'),
                        w = domMgr.mk('div', xhricon),
                        total=0, ref;
                        model.on('instance.xhr','start', function () {
                            if (total === 0 && ! xhricon.parentNode && ! ref) 
                                ref=setTimeout(function() { 
                                    wrapper.appendChild(xhricon);
                                },350);
                            total++;
                        });
                        model.on('instance.xhr','end', function() {
                            if (total > 0) 
                                total--; 
                            if (total !== 0) 
                                return;
                            clearTimeout(ref);ref=null;
                            if (xhricon.parentNode) 
                                xhricon.parentNode.removeChild(xhricon);
                        });
                    return resolve(w);
                })
            ]
        });

    };
};

})();
