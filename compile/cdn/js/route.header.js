//# sourceURL=route.header.js

module.requires = [
    { name:'route.header.css' },
    { name:'core.language.js' },
    { name:'core.country.js' },
    { name:'core.currency.js' },
    { name:'core.date.js' }
];

module.exports = function(app) {

    "use strict";

    var dom = app['core.dom'],
        router = app['core.router'],
        rootEmitter = app['core.events'].rootEmitter;

    return function(model) {

        var wrapper = model.wrapper,
            managers = model.managers,
            domMgr = managers.dom;

        domMgr.mk('div',wrapper,null,'logo').addEventListener('click', function() {
            router.to([]);
        });

        return model.addSequence({

            container:wrapper,
            promises : [

                managers.object.create('navigation',{
                    options : [
                        {
                            className:'app',
                            active:true
                        },
                        {
                            className:'api',
                            href : 'https://github.com/igaro/api',
                            onClick : function() {
                                window.open(this.href);
                                return Promise.resolve();
                            }
                        }
                    ]
                }),

                Promise.resolve(
                    domMgr.mk('a',null,null, function() {
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
                                            });
                                        });
                                        var write = function() {
                                            select.options.length = 0;
                                            domMgr.mk('option',select,_tr("Automatic"));
                                            domMgr.mk('option',select).disabled = true;
                                            Object.keys(mod.pool).forEach(function (o) {
                                                domMgr.mk('option',select,mod.pool[o].name).value = o;
                                            });
                                        };
                                        var sel = function() {
                                            if (mod.isAuto) {
                                                select.selectedIndex = 0;
                                            } else {
                                                var env = mod.env;
                                                Array.prototype.slice.call(select.options).some(function(o) {
                                                    if (o.value === env) {
                                                        o.selected = true;
                                                        return true;
                                                    }
                                                });
                                            }
                                        };
                                        var sort = function() {
                                            dom.sort({
                                                nodes:select.options,
                                                slice:[2]
                                            });
                                        };
                                        mod.managers.event
                                            .on('setEnv', sel, { deps:[accordion] })
                                            .on('setPool', write, { deps:[accordion] });
                                        app['core.language'].managers.event
                                            .on('setEnv', sort, { deps:[accordion] });
                                        write();
                                        sel();
                                        sort();
                                    };

                                    [
                                        [
                                            'language',
                                            _tr("Language")
                                        ],
                                        [
                                            'country',
                                            _tr("Country")
                                        ],
                                        [
                                            'currency',
                                            _tr("Currency")
                                        ]
                                    ].forEach(function(o) {
                                        accordion.addSection({
                                            title:o[1],
                                            content:domMgr.mk('select',null,null, function() {
                                                writeModuleOptions(this,o[0]);
                                            })
                                        });
                                    });
                                    accordion.addSection({
                                        title:_tr("Timezone"),
                                        content:domMgr.mk('select',null,null, function() {
                                            var self = this, h,v,m,y,
                                                date = app['core.date'],
                                                offset = date.envOffsetAuto? null : date.envOffset;
                                            domMgr.mk('option',self,_tr("Automatic"));
                                            domMgr.mk('option',self).disabled = true;
                                            var eF = function() {
                                                y = this.value = (h*60+m)*-1;
                                                if (y === offset)
                                                    this.selected = true;
                                            };
                                            for (h=14; h >= 0; h--) {
                                                v = (h < 10? '0'+h : h);
                                                for (m=45; m >= 0 && (h > 0 || m !== 0); m-=15) {
                                                    domMgr.mk('option',self,'GMT - '+v+':'+(m === 0? '00':m),eF);
                                                }
                                            }
                                            eF =  function() {
                                                y = this.value = (h*60+m);
                                                if (y === offset)
                                                    this.selected = true;
                                            };
                                            for (h=0; h <= 14; h++) {
                                                v = h < 10? '0'+h : h;
                                                for (m=0; m <= 45; m+=15) {
                                                    domMgr.mk('option',self,'GMT +'+v+':'+(m === 0? '00':m),eF);
                                                }
                                            }
                                            eventMgr.on('core.date','setEnvOffset', function() {
                                                if (date.envOffsetAuto) {
                                                    self.selectedIndex = 0;
                                                } else {
                                                    offset = date.envOffset;
                                                    self.options.some(function (o) {
                                                        if (o.value === offset) {
                                                            o.selected = true;
                                                            return true;
                                                        }
                                                    });
                                                }
                                            });
                                            this.addEventListener('change', function() {
                                                (this.selectedIndex === 0? date.resetEnvOffset() : date.setEnvOffset(parseInt(this.options[this.selectedIndex].value))).catch(function(e) {
                                                    return debugMgr.handle(e);
                                                });
                                            });

                                        })
                                    });
                                    return modal.custom({
                                        noCancel:true,
                                        title:_tr("Locale"),
                                        custom:accordion.container
                                    });
                                });
                            }).catch(function(e) {
                                return managers.debug.handle(e);
                            });
                        });
                    })
                ),

                Promise.resolve(
                    domMgr.mk('a',null,null,function() {
                        this.className = 'code';
                        this.addEventListener('click',function(event) {
                            event.preventDefault();
                            window.open('https://github.com/igaro/app/blob/master/compile/cdn/js/'+router.current.path.join('.')+'.js');
                        });
                    })
                ),

                Promise.resolve(
                    domMgr.mk('div',null,null,function() {
                        this.className = 'xhr';
                        dom.hide(this);
                        var total = 0,
                            ref,
                            self = this;
                        domMgr.mk('div', self);
                        rootEmitter.on('instance.xhr.start', function () {
                            if (total === 0 && ! ref)
                                ref=window.setTimeout(function() {
                                    dom.show(self);
                                },350);
                            total++;
                        });
                        rootEmitter.on('instance.xhr.end', function() {
                            if (total > 0)
                                total--;
                            if (total !== 0)
                                return;
                            window.clearTimeout(ref);
                            ref = null;
                            dom.hide(self);
                        });
                    })
                )
            ]
        });

    };
};
