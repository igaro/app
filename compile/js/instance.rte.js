module.requires = [
    { name:'instance.navigation.js' },
    { name:'instance.rte.css' },
    { name:'core.language.js' }
];

module.exports = function(app) {

    if (! ('contentEditable' in document.body)) 
        throw new Error({ incompatible:true, noobject:'contentEditable' });
    if (! ('getSelection' in window)) 
        throw new Error({ incompatible:true, noobject:'getSelection' });

    var events = app['core.events'],
    language = app['core.language'],

    a = function(o) {
        var self = this;
        this.hasFocus = false;
        this.savedRange = null;
        this.onChange = o && o.onChange? o.onChange : null;
        var c = this.container = document.createElement('div');
        c.className='instance-rte';
        if (o && o.container) 
            o.container.appendChild(c);
        this.onChangeTimerid = null;
        var rte = this.rte = document.createElement('div');
        rte.className = 'editable';
        rte.contentEditable = true;
        if (o && o.html) 
            rte.innerHTML = o.html;
        rte.styleWithCSS=false;
        rte.insertBrOnReturn=false;

        var html = this.html = document.createElement('div');
        html.className = 'html';
            var raw = this.raw = document.createElement('textarea');
            if (o && o.html) 
                raw.value = o.html;
        html.appendChild(raw);

        var onChange = function(callback) {
            if (self.onChangeTimerid) clearTimeout(self.onChangeTimerid);
            if (callback) {
                if (html.parentNode) { 
                    rte.innerHTML = raw.value; 
                } else { 
                    raw.value = rte.innerHTML; 
                }
                if (self.onChange) 
                    self.onChange(self.getContentLength === 0? '' : raw.value.trim());
            } else {
                self.onChangeTimerid = setTimeout(function() { 
                    onChange(true); 
                },300);
            }
        };

        /* var restoreSelection = function() {
            if (self.hasFocus === true) return;
            self.hasFocus = true;
            rte.focus();
            if (self.savedRange === null) return;
            var s = window.getSelection();
            if (s.rangeCount > 0) s.removeAllRanges();
            //s.addRange(self.savedRange);
        }; */

        var saveRange = function() {
            self.savedRange = window.getSelection().getRangeAt(0);
        };

        rte.addEventListener("input", onChange);
        rte.addEventListener("change", onChange);
        rte.addEventListener("blur", function () { 
            self.hasFocus = false; 
        });
        /* rte.addEventListener("mousedown", restoreSelection);
        rte.addEventListener("click", restoreSelection);
        rte.addEventListener("focus", restoreSelection); */
        rte.addEventListener("mouseup", saveRange);
        rte.addEventListener("keyup", saveRange);
        raw.addEventListener("input", onChange);
        raw.addEventListener("change", onChange);
        
        var wysiwyg = document.createElement('div');
        wysiwyg.className = 'wysiwyg';
            var panels = this.panels = {
                container: document.createElement('div'),
                wrapper : document.createElement('div'),
                menu : new app['instance.navigation']({
                    container: wysiwyg,
                    type:'tabs'
                }).menu,
                pool : []
            };
            panels.container.className = 'panels';

        new app['instance.navigation']({
            container: c,
            type:'tabs',
            pool:[
                { 
                    title: {
                        en : 'WYSIWYG'
                    },
                    active:true,
                    onClick : function() {
                        if (wysiwyg.parentNode) return;
                        c.appendChild(wysiwyg);
                        c.removeChild(html);
                        this.toggle();
                        rte.focus();
                    }
                }, { 
                    title: {
                        en : 'HTML'
                    },
                    onClick : function() {
                        if (html.parentNode) return;
                        c.appendChild(html);
                        c.removeChild(wysiwyg);
                        this.toggle();
                        raw.focus();
                    }
                }
            ]
        });

        c.appendChild(wysiwyg);
        wysiwyg.appendChild(panels.container);
        wysiwyg.appendChild(rte);

        // main formatting panel
        var main = document.createElement('div');
        main.className='main';
        this.addPanel({
            en : 'Main',
            fr : 'Principal'
        },main,true);
        var style = document.createElement('select');
        main.appendChild(style);
        style.addEventListener('change', function() {
            if (this.selectedIndex === 0) 
                return;
            self.execCommand('formatblock', this.options[this.selectedIndex].value);
            this.selectedIndex=0;
        });

        o = document.createElement('option');
        o.innerHTML = '[Style]';
        style.appendChild(o);
        var headers = [o];
        headers = headers.concat([1,2,3,4,5,6].map(function (n) {
            o = document.createElement('option');
            o.value = '<h'+n+'>';
            style.appendChild(o);
            return o;
        }));
        headers.push(o = document.createElement('option'));
        o.value='<pre>';
        style.appendChild(o);
        var f = function() {
            var l = [
                {
                    en : '[Style]'
                },
                {
                    en : 'Heading 1',
                    fr : 'Titre 1'
                },
                {
                    en : 'Heading 2',
                    fr : 'Titre 2'
                },
                {
                    en : 'Heading 3',
                    fr : 'Titre 3'
                },
                {
                    en : 'Heading 4',
                    fr : 'Titre 4'
                },
                {
                    en : 'Heading 5',
                    fr : 'Titre 5'
                },
                {
                    en : 'Heading 6',
                    fr : 'Titre 6'
                },
                {
                    en : '[Formatted]',
                    fr : '[Mise en forme]'
                }
            ];
            headers.forEach(function (o,i) {
                o.innerHTML = language.mapKey(l[i]);
            });
        };
        events.on('core.language','code.set', function() {
            f();
        });
        f();

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
            var i = document.createElement('input');
            i.type = 'button';
            i.className = id;
            i.addEventListener('click', function() { 
                self.execCommand(this.className,''); 
            });
            main.appendChild(i);
        });

        // character
        var ch = document.createElement('div');
        ch.className='character';
        this.addPanel({
            en : 'Character',
            fr : 'Caractère'
        },ch);
        ["cent","euro","pound","curren","yen","copy","reg","trade","divide","times","plusmn","frac14","frac12","frac34","deg","sup1","sup2","sup3","micro","laquo","raquo","quot","lsquo","rsquo","lsaquo","rsaquo","sbquo","bdquo","ldquo","rdquo","iexcl","brvbar","sect","not","macr","para","middot","cedil","iquest","fnof","mdash","ndash","bull","hellip","permil","ordf","ordm","szlig","dagger","Dagger","eth","ETH","oslash","Oslash","thorn","THORN","oelig","OElig","scaron","Scaron","acute","circ","tilde","uml","agrave","aacute","acirc","atilde","auml","aring","aelig","Agrave","Aacute","Acirc","Atilde","Auml","Aring","AElig","ccedil","Ccedil","egrave","eacute","ecirc","euml","Egrave","Eacute","Ecirc","Euml","igrave","iacute","icirc","iuml","Igrave","Iacute","Icirc","Iuml","ntilde","Ntilde","ograve","oacute","ocirc","otilde","ouml","Ograve","Oacute","Ocirc","Otilde","Ouml","ugrave","uacute","ucirc","uuml","Ugrave","Uacute","Ucirc","Uuml","yacute","yuml","Yacute","Yuml"].forEach(function(chr) {
            var a = document.createElement('div');
            a.innerHTML='&'+chr+';';
            a.addEventListener('click', function() {
                self.insertHTML('&'+chr+';');
            });
            ch.appendChild(a);
        });

        // colors
        var colors = ['FFFFFF','FFCCCC','FFCC99','FFFF99','FFFFCC','99FF99','99FFFF','CCFFFF','CCCCFF','FFCCFF','CCCCCC','FF6666','FF9966','FFFF33','66FF99','33FFFF','66FFFF','9999FF','FF99FF','C0C0C0','FF0000','FF9900','FFCC66','FFFF00','33FF33','66CCCC','33CCFF','6666CC','CC66CC','999999','CC0000','FF6600','FFCC33','FFCC00','33CC00','00CCCC','3366FF','6633FF','CC33CC','666666','990000','CC6600','CC9933','999900','009900','339999','3333FF','6600CC','993399','333333','660000','993300','996633','666600','006600','336666','000099','333399','663366','000000','330000','663300','663333','333300','003300','003333','000066','330099','330033'];
        [
            ['backcolor', {
                en : 'Backcolor',
                'en-GB' : 'Backcolour',
                fr : 'Couleur Retour'
            }],
            ['forecolor', {
                en : 'Forecolor',
                'en-GB' : 'Forecolour',
                fr : 'Couleur de Fore'
            }],
            ['hilitecolor', {
                en : 'Highlight',
                fr : 'Surligner'
            }]
        ].forEach(function (o) {
            var a = document.createElement('div');
            a.className=o[0];
            self.addPanel(o[1],a);
            colors.forEach(function (color) {
                var b = document.createElement('div');
                b.style.backgroundColor = '#'+color;
                b.addEventListener('click', function() {
                    self.execCommand(o[0], '#'+color);
                });
                a.appendChild(b);
            });

        });
    };

    a.prototype.execCommand = function(command, option) {
        this.rte.focus();
        document.execCommand(command, false, option);
        //if (! dc) this.onChange();
    };

    a.prototype.insertHTML = function(html) {
        this.rte.focus();
        document.execCommand('insertHTML', false, html);
        //this.onChange();
    };

    a.prototype.getHTML = function() {
        return this.html.parentNode? this.raw.value.trim() : this.rte.innerHTML.trim();
    };

    a.prototype.addPanel = function(l,div,active) {
        var panels = this.panels;
        var pc = panels.container;
        var o = panels.menu.addOption({
            title:l,
            active:active,
            onClick : function() {
                if (pc.firstChild) 
                    pc.removeChild(pc.firstChild);
                pc.appendChild(div);
                this.setStatus('active');
            }
        });
        if (active) 
            pc.appendChild(div);
    };

    return a;

};
