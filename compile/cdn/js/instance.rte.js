//# sourceURL=instance.rte.js

(function(env) {

    module.requires = [
        { name:'instance.rte.css' }
    ];

    module.exports = function(app) {

        "use strict";

        if (! ('contentEditable' in document.body))
            throw new Error({ incompatible:true, noobject:'contentEditable' });

        if (! ('getSelection' in window))
            throw new Error({ incompatible:true, noobject:'getSelection' });

        var dom = app['core.dom'],
            coreObject = app['core.object'],
            bless = coreObject.bless;

        /* RTE
         * @constructor
         * @param {object} [o] - config literal. See online help for attributes.
         */
        var InstanceRTE = function(o) {

            o = o || {};
            this.name = 'instance.rte';
            this.asRoot = true;
            this.hasFocus = false;
            this.savedRange = null;
            this.inWYSIWYG = true;
            this.container = function(dom) {

                return dom.mk('div',o,null,o.className);
            };

            bless.call(this,o);
        };

        /* Async Constructor
         * @param {object} [o] - config literal. See online help for attributes.
         * @returns {Promise}
         */
        InstanceRTE.prototype.init = function(o) {

            var self = this,
                managers = this.managers,
                domMgr = managers.dom,
                objectMgr = managers.object,
                eventMgr = managers.event;

            return objectMgr.create('navigation',{
                container: self.container,
                parent:self
            }).then(function(navMode) {

                var onChange = function() {

                    var raw = self.raw,
                        rte = self.rte;

                    if (self.inWYSIWYG) {
                        raw.value = rte.innerHTML;
                    } else {
                        rte.innerHTML = raw.value;
                    }

                    // debounce text input
                    coreObject.debounce(self,300).then(function() {

                        return eventMgr.dispatch('change', self.getHTML());
                    });
                };

                // container
                var wysiwyg = self.wysiwyg = domMgr.mk('div',self,null,function() {

                    var div = this;

                    // panels
                    self.panels = {
                        pool:[],
                        container : domMgr.mk('div',div,null,'panels')
                    };

                    // content editable
                    self.rte = domMgr.mk('div',div,null,function() {

                        this.className = 'editable';
                        this.contentEditable = true;
                        this.styleWithCSS=false;
                        this.insertBrOnReturn=false;

                        if (o.html)
                            this.innerHTML = o.html;

                        this.addEventListener("blur", function () {

                            self.hasFocus = false;
                        });
                        var saveRange = function() {

                            self.savedRange = window.getSelection().getRangeAt(0);
                        };
                        this.addEventListener("mouseup", saveRange);
                        this.addEventListener("keyup", saveRange);
                        this.addEventListener("input", onChange);
                        this.addEventListener("change", onChange);
                    });
                });

                // raw input
                var raw = self.raw = domMgr.mk('textarea',self,null,function() {

                    if (o.html)
                        this.value = o.html;

                    dom.hide(this);
                    this.addEventListener("input", onChange);
                    this.addEventListener("change", onChange);
                });

                // add menu options
                return Promise.all(
                    [
                        navMode.menu.addOptions([
                            {
                                title: 'WYSIWYG',
                                active:true,
                                onClick : function() {

                                    dom.show(wysiwyg);
                                    dom.hide(raw);
                                    self.inWYSIWYG = true;
                                    self.rte.focus();
                                    return Promise.resolve();
                                }
                            },
                            {
                                title: 'HTML',
                                onClick : function() {

                                    dom.show(raw);
                                    dom.hide(wysiwyg);
                                    self.inWYSIWYG = false;
                                    raw.focus();
                                    return Promise.resolve();
                                }
                            },
                        ]),
                        objectMgr.create('navigation',{
                            parent:self,
                            container:self.panels.container
                        }).then(function(panelNav) {

                            self.panels.menu = panelNav.menu;
                        })
                    ]
                ).then(function() {

                    // panels
                    domMgr.mk('div',self.panels.container);

                    return self.addPanels(

                        [
                            // main panel
                            {
                                title:_tr("Main"),
                                active:true,
                                content:domMgr.mk('div',null,null,function() {

                                    this.className = 'main';
                                    domMgr.mk('select',this,null,function() {

                                        this.addEventListener('change', function() {

                                            if (this.selectedIndex === 0)
                                                return;

                                            self.execCommand('formatblock', this.options[this.selectedIndex].value);
                                            this.selectedIndex=0;
                                        });
                                        domMgr.mk('option',this,_tr("Style"));
                                        domMgr.mk('option',this,_tr("Paragraph")).value = 'p';
                                        domMgr.mk('option',this,_tr("Heading 1")).value = 'h1';
                                        domMgr.mk('option',this,_tr("Heading 2")).value = 'h2';
                                        domMgr.mk('option',this,_tr("Heading 3")).value = 'h3';
                                        domMgr.mk('option',this,_tr("Heading 4")).value = 'h4';
                                        domMgr.mk('option',this,_tr("Heading 5")).value = 'h5';
                                        domMgr.mk('option',this,_tr("Heading 6")).value = 'h6';
                                        domMgr.mk('option',this,_tr("Formatted")).value = 'pre';
                                    });
                                    var self2 = this;
                                    var opts = [
                                        'bold',
                                        'italic',
                                        'underline',
                                        'strikethrough',
                                        'subscript',
                                        'superscript',
                                        'justifyleft',
                                        'justifycenter',
                                        'justifyright',
                                        'justifyfull',
                                        'inserthorizontalrule',
                                        'insertorderedlist',
                                        'insertunorderedlist',
                                        'outdent',
                                        'indent'
                                    ];

                                    if (document.queryCommandSupported('cut'))
                                        opts.push('cut','copy','paste');
                                    if (document.queryCommandSupported('undo'))
                                        opts.push('undo','redo');

                                    opts.push('removeformat');
                                    opts.forEach(function (id) {

                                        domMgr.mk('button',self2,null,function() {

                                            this.className = id;
                                            this.addEventListener('click', function() {

                                                self.execCommand(id,'');
                                            });
                                        });
                                    });
                                })
                            },

                            // character
                            {
                                title:_tr("Character"),
                                content:domMgr.mk('div',null,null,function() {

                                    this.className='character';
                                    var s = this;
                                    ["cent","euro","pound","curren","yen","copy","reg","trade","divide","times","plusmn","frac14","frac12","frac34","deg","sup1","sup2","sup3","micro","laquo","raquo","quot","lsquo","rsquo","lsaquo","rsaquo","sbquo","bdquo","ldquo","rdquo","iexcl","brvbar","sect","not","macr","para","middot","cedil","iquest","fnof","mdash","ndash","bull","hellip","permil","ordf","ordm","szlig","dagger","Dagger","eth","ETH","oslash","Oslash","thorn","THORN","oelig","OElig","scaron","Scaron","acute","circ","tilde","uml","agrave","aacute","acirc","atilde","auml","aring","aelig","Agrave","Aacute","Acirc","Atilde","Auml","Aring","AElig","ccedil","Ccedil","egrave","eacute","ecirc","euml","Egrave","Eacute","Ecirc","Euml","igrave","iacute","icirc","iuml","Igrave","Iacute","Icirc","Iuml","ntilde","Ntilde","ograve","oacute","ocirc","otilde","ouml","Ograve","Oacute","Ocirc","Otilde","Ouml","ugrave","uacute","ucirc","uuml","Ugrave","Uacute","Ucirc","Uuml","yacute","yuml","Yacute","Yuml"].forEach(function(chr) {
                                        domMgr.mk('button',s,'&'+chr+';').addEventListener('click', function() {

                                            self.insertHTML('&'+chr+';');
                                        });
                                    });
                                })
                            }
                        ]

                        // colors
                        .concat(
                            [
                                ['backcolor', _tr("Backcolor")],
                                ['forecolor', _tr("Forecolor")],
                                ['hilitecolor', _tr("Highlight")]
                            ]

                        // ready data
                        .map(function (o) {

                            return {
                                title:o[1],
                                content:domMgr.mk('div',null,null,function() {

                                    var self2 = this;
                                    this.className=o[0];

                                    ['FFFFFF','FFCCCC','FFCC99','FFFF99','FFFFCC','99FF99','99FFFF','CCFFFF','CCCCFF','FFCCFF','CCCCCC','FF6666','FF9966','FFFF33','66FF99','33FFFF','66FFFF','9999FF','FF99FF','C0C0C0','FF0000','FF9900','FFCC66','FFFF00','33FF33','66CCCC','33CCFF','6666CC','CC66CC','999999','CC0000','FF6600','FFCC33','FFCC00','33CC00','00CCCC','3366FF','6633FF','CC33CC','666666','990000','CC6600','CC9933','999900','009900','339999','3333FF','6600CC','993399','333333','660000','993300','996633','666600','006600','336666','000099','333399','663366','000000','330000','663300','663333','333300','003300','003333','000066','330099','330033'].forEach(function (color) {
                                        domMgr.mk('button',self2,null,function() {

                                            this.style.backgroundColor = '#'+color;
                                            this.addEventListener('click', function() {

                                                self.execCommand(o[0], '#'+color);
                                            });
                                        });
                                    });
                                })
                            };
                        }))
                    );
                });
            });
        };

        /* Executes an RTE command
         * @param {string} command - to execute
         * @param {*} [data] - to send to the command
         * @returns {null}
         */
        InstanceRTE.prototype.execCommand = function(command, data) {

            if (typeof command !== 'string')
                throw new TypeError("First argument must be of type string");

            this.rte.focus();
            document.execCommand(command, false, data);
        };

        /* Inserts HTML into the RTE
         * @param {string} html - to be inserted
         * @returns {null}
         */
        InstanceRTE.prototype.insertHTML = function(html) {

            if (typeof command !== 'string')
                throw new TypeError("First argument must be of type string");

            this.rte.focus();
            document.execCommand('insertHTML', false, html);
        };

        /* Returns the raw HTML from the RTE
         * @returns {string}
         */
        InstanceRTE.prototype.getHTML = function() {

            return (this.inWYSIWYG? this.rte.innerHTML : this.raw.value).trim();
        };

        /* Adds multiple panels
         * @param {Array} o - panels to add
         * @returns {Promise}
         */
        InstanceRTE.prototype.addPanels = function(o) {

            var self = this;
            return coreObject.promiseSequencer(o,function(a) {

                return self.addPanel(a);
            });
        };

        /* Adds a panel
         * @param {object} o - panel literal including; title, content
         * @returns {Promise}
         */
        InstanceRTE.prototype.addPanel = function(o) {

            var panels = this.panels,
                pc = panels.container.childNodes[1];

            return panels.menu.addOption({
                title:o.title,
                active:o.active,
                onClick : function() {

                    dom.setContent(pc,o.content,true);
                    return Promise.resolve();
                }
            }).then(function() {

                if (o.active)
                    dom.setContent(pc,o.content,true);
            });
        };

        return InstanceRTE;
    };

})(this);
