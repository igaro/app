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

        model.stash.title = _tr("Widgets");
        model.stash.desc = _tr("The highest performing Javascript framework - read to see what Igaro App offers you.");

        var managers = model.managers,
            domMgr= managers.dom,
            dom = app['core.dom'],
            debugMgr = managers.debug,
            objectMgr = managers.object;

        domMgr.mk('p',wrapper,_tr("Igaro's comes with a stack full of widgets, and creating new widgets is easy!"));

        domMgr.mk('h1',wrapper,_tr("Widgets"));
        domMgr.mk('p',wrapper,_tr("This framework comes with the kitchen sink!"));
        domMgr.mk('p',wrapper,_tr("Below is  a sample, you'll find a complete list on the module page (instance.* files)."));
        domMgr.mk('h2',wrapper,_tr("Same Space"));
        domMgr.mk('p',wrapper,_tr("This example displays elements in the same space using CSS3 effects to transition between each space. It's great for slideshows!"));

        return model.addSequence({
            container:wrapper,
            promises:[

                objectMgr.create('table', {
                    header : {
                        rows : [
                            {
                                columns : [
                                    {
                                        content : _tr("Domain")
                                    },
                                    {
                                        content : _tr("Details")
                                    },
                                    {
                                        content : _tr("Status")
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
                                        content : _tr("Security")
                                    },
                                    {
                                        content : _tr("No public variables. Military-grade security. No memory leaks. Automatic oAuth initilization with Promise replay.")
                                    },
                                    {
                                        className : 'green'
                                    }
                                ]
                            },
                            {
                                columns : [
                                    {
                                        content : _tr("Dynamic")
                                    },
                                    {
                                        content : _tr("Expandable with modules. Decoupled architecture based on events.")
                                    },
                                    {
                                        className : 'green'
                                    }
                                ]
                            }
                        ]
                    }
                }).then(function(table) {

                    var container = document.createDocumentFragment();
                    domMgr.mk('h1',container,_tr("Table"));
                    domMgr.mk('p',container,_tr("This example displays HTML elements within a common space using CSS3 effects to transition between each space. It's great for slideshows!"));
                    dom.append(container,table);
                    return container;
                }),

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
                    domMgr.mk('h1',container,_tr("Same Space"));
                    domMgr.mk('p',container,_tr("This example displays HTML elements within a common space using CSS3 effects to transition between each space. It's great for slideshows!"));
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
                    domMgr.mk('p',container,_tr("This example contacts the Youtube API, which returns JSON. From it a video is loaded."));
                    domMgr.mk('button',container,_tr("Fetch")).addEventListener('click', function() {

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

                // form validate
                objectMgr.create('form.validate').then(function(formValidate) {

                    var container = document.createDocumentFragment(),
                        managers = formValidate.managers,
                        domMgr = managers.dom,
                        objectMgr = managers.object,
                        debugMgr = managers.debug;

                    domMgr.mk('h1',container,_tr("Form Validation"));
                    domMgr.mk('p',container,_tr("Try entering an invalid currency denomination into the box below."));
                    domMgr.mk('form',container,null,function() {

                        this.className = 'currencycheck';
                        formValidate.setForm(this);
                        domMgr.mk('label',this,_tr("Deposit"));
                        var form = this,
                            v = domMgr.mk('input[text]',this,null,function() {

                                this.placeholder='xx.xx';
                                this.name='amount';
                                this.required = true;
                            });
                        domMgr.mk('input[submit]',this,_tr("Transfer"));
                        formValidate.rules = [
                            [
                              'amount',
                              function(v) {

                                  if (! currency.validate(v))
                                    return _tr("Invalid amount");
                                  if (v === 0)
                                    return _tr("Must be positive");
                              }
                            ]
                        ];
                        formValidate.onValidSubmit = function() {

                            v.value='';
                            return objectMgr.create('toast',{
                                message: _tr("Transaction Successful")
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

                    domMgr.mk('h1',container,_tr("Rich Text Editor"));
                    domMgr.mk('p',container);
                    dom.append(container,rte);
                    return container;
                }),

                objectMgr.create('accordion', {
                    sections : [
                        {
                            title:_tr("Suppliers"),
                            content:_tr("Acme Ltd is bankrupt.")
                        },
                        {
                            title:_tr("Contractors"),
                            content:_tr("Don is off sick, again.")
                        },
                        {
                            title:_tr("Materials"),
                            content:_tr("Were stolen yesterday evening.")
                        },
                        {
                            title:_tr("Accounts"),
                            disabled:true
                        }
                    ]
                }).then(function(accordion) {

                    var container = document.createDocumentFragment(),
                        domMgr = accordion.managers.dom;

                    domMgr.mk('h1',container,_tr("Accordion"));
                    domMgr.mk('p',container);
                    dom.append(container,accordion);
                    return container;
                })
            ]

        });
    };
};
