module.requires = [
    { name:'instance.rte.css' },
    { name:'core.language.js' },
    { name:'instance.navigation.js' }
];

module.exports = function(app) {

    if (! ('contentEditable' in document.body)) 
        throw new Error({ incompatible:true, noobject:'contentEditable' });
    if (! ('getSelection' in window)) 
        throw new Error({ incompatible:true, noobject:'getSelection' });

    var events = app['core.events'],
        language = app['core.language'],
        bless = app['core.bless'],
        navigation = app['instance.navigation'];

    var rteObj = function(o) {
        bless.call(this,{
            name:'instance.rte',
            parent:o.parent,
            container:function(dom) { 
                return dom.mk('div',null,null,'instance-rte'); 
            },
            disabled:o.disabled,
            hidden:o.hidden
        });
        var self = this,
            managers = this.managers,   
            eventMgr = managers.event,
            domMgr = managers.dom;
        this.hasFocus = false;
        this.savedRange = null;
        this.onChangeTimerid = null;
        this.wysiwyg = true;
        var container = this.container;
        var saveRange = function() {
            self.savedRange = window.getSelection().getRangeAt(0);
        };
        var rte = self.rte = domMgr.mk('div',null,null,function() {
            this.className = 'editable';
            this.contentEditable = true;
            this.styleWithCSS=false;
            this.insertBrOnReturn=false;
            if (o.html) 
                this.innerHTML = o.html;
            this.addEventListener("blur", function () { 
                self.hasFocus = false; 
            });
            /* rte.addEventListener("mousedown", restoreSelection);
            this.addEventListener("click", restoreSelection);
            this.addEventListener("focus", restoreSelection); */
            this.addEventListener("mouseup", saveRange);
            this.addEventListener("keyup", saveRange);
        });
        var html = this.html = domMgr.mk('div',null,null,'html');
        domMgr.hide(html);
        var onChange = function(dispatch) {
            clearTimeout(self.onChangeTimerid);
            if (self.wysiwyg) { 
                raw.value = rte.innerHTML; 
            } else { 
                rte.innerHTML = raw.value; 
            }
            if (dispatch) 
                return eventMgr.dispatch('change', self.getHTML());
            self.onChangeTimerid = setTimeout(function() { 
                onChange(true); 
            },300);
            
        };
        var raw = this.raw = domMgr.mk('textarea',html,null,function() {
            if (o.html) 
                this.value = o.html;
        });

        rte.addEventListener("input", onChange);
        rte.addEventListener("change", onChange);
        raw.addEventListener("input", onChange);
        raw.addEventListener("change", onChange);

        new navigation({
            container: container,
            parent:this,
            type:'tabs',
            pool:[
                { 
                    title: 'WYSIWYG',
                    active:true,
                    onClick : function() {
                        domMgr.show(wysiwyg);
                        domMgr.hide(html);
                        self.wysiwyg = true;
                        rte.focus();
                        return Promise.resolve();
                    }
                }, 
                { 
                    title: 'HTML',
                    onClick : function() {
                        domMgr.show(html);
                        domMgr.hide(wysiwyg);
                        self.wysiwyg = false;
                        raw.focus();
                        return Promise.resolve();
                    }
                },
            ]
        });

        container.appendChild(html);

        /* var restoreSelection = function() {
            if (self.hasFocus === true) return;
            self.hasFocus = true;
            rte.focus();
            if (self.savedRange === null) return;
            var s = window.getSelection();
            if (s.rangeCount > 0) s.removeAllRanges();
            //s.addRange(self.savedRange);
        }; */


        var wysiwyg = domMgr.mk('div',container,null,function() {
            var s = this;
            this.className = 'wysiwyg';
            self.panels = {
                menu : new navigation({
                    parent:self,
                    container: s,
                    type:'tabs'
                }).menu,
                container: domMgr.mk('div',s,null,'panels'),
                pool : []
            };
            this.appendChild(rte);
        });

        // main panel
        this.addPanel(_tr("Main"),domMgr.mk('div',null,null,function() {
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
            var s = this,
                f = [
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
                f.push('cut','copy','paste');
            if (document.queryCommandSupported('undo')) 
                f.push('undo','redo');
            f.push('removeformat');
            f.forEach(function (id) {
                domMgr.mk('button',s,null,function() {
                    this.className = id;
                    this.addEventListener('click', function() { 
                        self.execCommand(id,''); 
                    });
                });
            });
        }),true);

        // character
        this.addPanel(_tr("Character"),domMgr.mk('div',null,null,function() {
            this.className='character';
            var s = this;
            ["cent","euro","pound","curren","yen","copy","reg","trade","divide","times","plusmn","frac14","frac12","frac34","deg","sup1","sup2","sup3","micro","laquo","raquo","quot","lsquo","rsquo","lsaquo","rsaquo","sbquo","bdquo","ldquo","rdquo","iexcl","brvbar","sect","not","macr","para","middot","cedil","iquest","fnof","mdash","ndash","bull","hellip","permil","ordf","ordm","szlig","dagger","Dagger","eth","ETH","oslash","Oslash","thorn","THORN","oelig","OElig","scaron","Scaron","acute","circ","tilde","uml","agrave","aacute","acirc","atilde","auml","aring","aelig","Agrave","Aacute","Acirc","Atilde","Auml","Aring","AElig","ccedil","Ccedil","egrave","eacute","ecirc","euml","Egrave","Eacute","Ecirc","Euml","igrave","iacute","icirc","iuml","Igrave","Iacute","Icirc","Iuml","ntilde","Ntilde","ograve","oacute","ocirc","otilde","ouml","Ograve","Oacute","Ocirc","Otilde","Ouml","ugrave","uacute","ucirc","uuml","Ugrave","Uacute","Ucirc","Uuml","yacute","yuml","Yacute","Yuml"].forEach(function(chr) {
                domMgr.mk('button',s,'&'+chr+';').addEventListener('click', function() {
                    self.insertHTML('&'+chr+';');
                });
            });
        }));

        // colors
        [
            ['backcolor', _tr("Backcolor")],
            ['forecolor', _tr("Forecolor")],
            ['hilitecolor', _tr("Highlight")]
        ].forEach(function (o) {
            self.addPanel(o[1],domMgr.mk('div',null,null,function() {
                this.className=o[0];
                var s = this;
                ['FFFFFF','FFCCCC','FFCC99','FFFF99','FFFFCC','99FF99','99FFFF','CCFFFF','CCCCFF','FFCCFF','CCCCCC','FF6666','FF9966','FFFF33','66FF99','33FFFF','66FFFF','9999FF','FF99FF','C0C0C0','FF0000','FF9900','FFCC66','FFFF00','33FF33','66CCCC','33CCFF','6666CC','CC66CC','999999','CC0000','FF6600','FFCC33','FFCC00','33CC00','00CCCC','3366FF','6633FF','CC33CC','666666','990000','CC6600','CC9933','999900','009900','339999','3333FF','6600CC','993399','333333','660000','993300','996633','666600','006600','336666','000099','333399','663366','000000','330000','663300','663333','333300','003300','003333','000066','330099','330033'].forEach(function (color) {
                    domMgr.mk('button',s,null,function() {
                        this.style.backgroundColor = '#'+color;
                        this.addEventListener('click', function() {
                            self.execCommand(o[0], '#'+color);
                        });
                    });
                });
            }));
        });
    };

    rteObj.prototype.execCommand = function(command, option) {
        this.rte.focus();
        document.execCommand(command, false, option);
    };

    rteObj.prototype.insertHTML = function(html) {
        this.rte.focus();
        document.execCommand('insertHTML', false, html);
    };

    rteObj.prototype.getHTML = function() {
        return (this.wysiwyg? this.rte.innerHTML : this.raw.value).trim();
    };

    rteObj.prototype.addPanel = function(l,div,active) {
        var self = this;
        var panels = this.panels,
            pc = panels.container,
            o = panels.menu.addOption({
            title:l,
            active:active,
            onClick : function() {
                self.managers.dom.setContent(pc,div,true);
                return Promise.resolve();
            }
        });
        if (active) 
            pc.appendChild(div);
    };

    return rteObj;
};
