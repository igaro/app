module.requires = [
    { name: 'route.main.features.css' },
    { name: 'core.language.js' },
    { name: 'core.currency.js' }
];

module.exports = function(app) {

    return function(model) {

        var view = model.view,
            wrapper = model.wrapper,
            currency = app['core.currency'];

        model.setMeta('title', _tr('Features'));

        dom.mk('p',wrapper,_tr("This framework comes with the kitchen sink! Pick the modules you want to use, all standarized to the same high quality of code."));
        dom.mk('p',wrapper,_tr("Below is a small selection from the base repository. You'll find a complete list on the module page (see instance.* files)."));
        dom.mk('h1',wrapper,'instance.samespace');
        dom.mk('p',wrapper,_tr("This module displays elements in the same space using CSS3 effects to transition between them. It's great for slideshows!"));

        return model.addSequence({
            container:wrapper,
            promises:[

                model.addInstance(
                    'samespace',
                    {
                        spaces:[0,1,2].map(function(x,i) { return { id:'a'+i }; }),
                        effect:'fade'
                    }
                ),

                model.addInstance('xhr').then(function(xhr) {
                    var container = document.createDocumentFragment();
                    dom.mk('h1',container,'instance.xhr');
                    dom.mk('p',container,_tr("This example contacts the Youtube API which returns JSON. From it three Justin Bieber videos are loaded. Enjoy the great music!"));
                    dom.mk('button',container,_tr("Execute")).addEventListener('click', function() {
                        var self = this;
                        xhr.get({
                            res:'http://gdata.youtube.com/feeds/users/JustinBieberVEVO/uploads?alt=json&format=5&max-results=3'
                        }).then(
                            function(data) {
                                dom.mk('iframe',null,null,function() {
                                    this.className = 'youtube';
                                    var playlist = data.feed.entry.map(function(o) { 
                                        return o.id.$t.substring(38); 
                                    });
                                    this.src = 'http://www.youtube.com/embed/'+playlist[0]+'?wmode=transparent&amp;HD=1&amp;rel=0&amp;showinfo=1&amp;controls=1&amp;autoplay=0;playlist='+playlist.slice(1).join(',');
                                    self.parentNode.insertBefore(this,self);
                                });
                                dom.rm(self);
                            }
                        ).catch(function() { 
                            model.managers.debug.handle(e);
                            self.disabled = false; 
                        });
                        self.disabled = true;
                    });
                    return container;
                }),

                model.addInstance('form.validate').then(function(formValidate) {
                    var container = document.createDocumentFragment();
                    dom.mk('h1',container,'instance.form.validate');
                    dom.mk('p',container,_tr("Try entering an invalid currency denomination into the box below."));
                    dom.mk('form',container,null,function() {
                        this.className = 'currencycheck';
                        formValidate.setForm(this);
                        dom.mk('label',this,_tr("Deposit"));

                        var v = dom.mk('input[text]',this,null,function() {
                                this.placeholder='xx.xx'; 
                                this.name='amount';
                                this.required = true;
                            }),
                            b = dom.mk('submit',this,_tr("Transfer"), function() {
                                this.disabled = true;
                            }),
                            self = this;

                        formValidate.rules = [
                            [
                              'amount', 
                              function(v) {
                                  if (! currency.validate(v))  
                                    return _tr("Invalid amount");
                                  if (v == 0)
                                    return _tr("Must be positive.");
                              }
                            ]
                        ];

                        this.addEventListener('submit',function() {
                            v.value='';
                            model.addInstance('toast',{
                                message: _tr("Transaction Successful.")
                            });
                        });
                    });
                    return container;
                }),

                model.addInstance('rte').then(function(rte) {
                    var container = document.createDocumentFragment();
                    dom.mk('h1',container,'instance.rte');
                    dom.mk('p',container);
                    container.appendChild(rte.container);
                    return container;
                })

            ]
        });

    };

};
