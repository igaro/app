//# sourceURL=route.main.features.js

module.requires = [
    { name: 'route.main.features.css' },
    { name: 'core.currency.js' }
];

module.exports = function(app) {

    "use strict";

    return function(model) {

        var wrapper = model.wrapper,
            currency = app['core.currency'];

        model.stash.title = function(l) { return l.gettext("Widgets"); };
        model.stash.desc = function(l) { return l.gettext("The highest performing Javascript framework - read to see what Igaro App offers you."); };

        var managers = model.managers,
            domMgr= managers.dom,
            dom = app['core.dom'],
            debugMgr = managers.debug,
            objectMgr = managers.object;

        domMgr.mk('p',wrapper,function(l) { return l.gettext("Igaro App comes with a stack full of widgets, and creating new widgets is easy!"); });

        return model.addSequence({
            container:wrapper,
            promises:[

                // same space
                objectMgr.create('samespace', {
                        spaces:[0,1,2].map(function(x,i) {
                            return { className:'a'+i };
                        }),
                        effect:'fade',
                        start:true
                    }
                ).then(function(samespace) {

                    var container = document.createDocumentFragment();
                    domMgr.mk('h1',container,function(l) { return l.gettext("Same Space"); });
                    domMgr.mk('p',container,function(l) { return l.gettext("This example displays HTML elements within a common space using CSS3 effects to transition between each space. It's great for slideshows!"); });
                    dom.append(container,samespace);
                    return container;
                }),

                // xhr
                objectMgr.create('xhr').then(function(xhr) {

                    var container = document.createDocumentFragment(),
                        managers = xhr.managers,
                        domMgr = managers.dom,
                        debugMgr = managers.debug;

                    domMgr.mk('h1',container,'AJAX (XHR)');
                    domMgr.mk('p',container,function(l) { return l.gettext("This example contacts the Youtube API, which returns JSON. From it a video is loaded."); });
                    domMgr.mk('button',container,function(l) { return l.gettext("Fetch"); }).addEventListener('click', function() {

                        var self = this;
                        xhr.get({
                            res:'https://www.googleapis.com/youtube/v3/search?key=AIzaSyDNXQ5go80HlxX8MydQy2_f9AEIS3ipuJg&channelId=UC2pmfLm7iq6Ov1UwYrWYkZA&part=snippet,id&order=date&maxResults=1'
                        }).then(function(data) {

                            domMgr.mk('iframe',null,null,function() {

                                this.className = 'youtube';
                                this.src = 'http://www.youtube.com/embed/'+data.items[0].id.videoId+'?wmode=transparent&amp;HD=1&amp;rel=0&amp;showinfo=1&amp;controls=1&amp;autoplay=0';
                                self.parentNode.insertBefore(this,self);
                            });
                            dom.rm(self);
                        })['catch'](function(e) {

                            return debugMgr.handle(e);
                        });
                    });
                    return container;
                }),

                // table
                objectMgr.create('table', {
                    addSearchColumns:true,
                    header : {
                        rows : [
                            {
                                columns : [
                                    {
                                        content : function(l) { return l.gettext("Make"); }
                                    },
                                    {
                                        content : function(l) { return l.gettext("Model"); }
                                    },
                                    {
                                        content : function(l) { return l.gettext("Type"); }
                                    }
                                ]
                            }
                        ]
                    },
                    body : {
                        rows : [
                            {
                                columns : [
                                    {
                                        content : "Ford"
                                    },
                                    {
                                        content : "Mustang"
                                    },
                                    {
                                        content : "Car"
                                    }
                                ]
                            },
                            {
                                columns : [
                                    {
                                        content : "Jaguar"
                                    },
                                    {
                                        content : "XK8"
                                    },
                                    {
                                        content : "Car"
                                    }
                                ]
                            },
                            {
                                columns : [
                                    {
                                        content : "Ford"
                                    },
                                    {
                                        content : "Focus"
                                    },
                                    {
                                        content : "Car"
                                    }
                                ]
                            }
                        ]
                    }
                }).then(function(table) {

                    var container = document.createDocumentFragment();
                    domMgr.mk('h1',container,function(l) { return l.gettext("Table"); });
                    domMgr.mk('p',container,function(l) { return l.gettext("Dynamic tables with filtering. Custom filters are supported."); });
                    dom.append(container,table);
                    return container;
                }),

                // list
                objectMgr.create('list', {

                    items:['elephant','ladybug','dog','cat'].map(function(a) {

                        return { className:a };
                    })
                }).then(function(list) {

                    var container = document.createDocumentFragment(),
                        domMgr = list.managers.dom,
                        elephant = list.items[0];

                    domMgr.mk('h1',container,function(l) { return l.gettext("Lists"); });
                    domMgr.mk('p',container,function(l) { return l.gettext("Create dynamic lists without data binding!"); });
                    dom.append(container,list);
                    domMgr.mk('p',container,null,function() {
                        domMgr.mk('button',this,function(l) { return l.gettext("Move Elephant"); }).addEventListener('click', function() {

                            list.shift(elephant,1);
                        });
                    });
                    return container;
                }),

                // form validate
                objectMgr.create('form.validate').then(function(formValidate) {

                    var container = document.createDocumentFragment(),
                        managers = formValidate.managers,
                        domMgr = managers.dom,
                        objectMgr = managers.object,
                        debugMgr = managers.debug;

                    domMgr.mk('h1',container,function(l) { return l.gettext("Form Validation"); });
                    domMgr.mk('p',container,function(l) { return l.gettext("Try entering an invalid currency denomination into the box below."); });
                    domMgr.mk('form',container,null,function() {

                        this.className = 'currencycheck';
                        formValidate.setForm(this);
                        domMgr.mk('label',this,function(l) { return l.gettext("Deposit"); });
                        var form = this,
                            v = domMgr.mk('input[text]',this,null,function() {

                                this.placeholder='xx.xx';
                                this.name='amount';
                                this.required = true;
                            });
                        domMgr.mk('input[submit]',this,function(l) { return l.gettext("Transfer"); });
                        formValidate.rules = [
                            [
                              'amount',
                              function(v) {

                                  if (! currency.validate(v))
                                    return function(l) { return l.gettext("Invalid amount"); };
                                  if (v === 0)
                                    return function(l) { return l.gettext("Must be positive"); };
                              }
                            ]
                        ];
                        formValidate.onValidSubmit = function() {

                            v.value='';
                            return objectMgr.create('toast',{
                                message: function(l) { return l.gettext("Transaction Successful"); }
                            })['catch'](function (e) {

                                return debugMgr.handle(e);
                            });
                        };
                    });
                    return container;
                }),

                objectMgr.create('rte').then(function(rte) {

                    var container = document.createDocumentFragment(),
                        domMgr = rte.managers.dom;

                    domMgr.mk('h1',container,function(l) { return l.gettext("Rich Text Editor"); });
                    domMgr.mk('p',container, function(l) { return l.gettext("Full HTML based editing within the App."); });
                    dom.append(container,rte);
                    return container;
                }),

                objectMgr.create('accordion', {
                    sections : [
                        {
                            title:function(l) { return l.gettext("Suppliers"); },
                            content:function(l) { return l.gettext("Acme Ltd is bankrupt."); }
                        },
                        {
                            title:function(l) { return l.gettext("Contractors"); },
                            content:function(l) { return l.gettext("Don is off sick, again."); }
                        },
                        {
                            title:function(l) { return l.gettext("Materials"); },
                            content:function(l) { return l.gettext("Were stolen yesterday evening."); }
                        },
                        {
                            title:function(l) { return l.gettext("Accounts"); },
                            disabled:true
                        }
                    ]
                }).then(function(accordion) {

                    var container = document.createDocumentFragment(),
                        domMgr = accordion.managers.dom;

                    domMgr.mk('h1',container,function(l) { return l.gettext("Accordion"); });
                    domMgr.mk('p',container,function(l) { return l.gettext("Accordions can group items to reduce information overload."); });
                    dom.append(container,accordion);
                    return container;
                })
            ]

        });
    };
};
