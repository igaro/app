module.requires = [
    { name:'service.status.css' },
    { name:'core.language.js' }
];

module.exports = function (app) {

    var stc = document.createElement('div');
    stc.className = 'service-status';

    var hide = document.createElement('div');
    hide.className = 'hide';
    stc.appendChild(hide);

    var nav = document.createElement('nav');
    stc.appendChild(nav);
    var ul = document.createElement('ul');
    nav.appendChild(ul);

    var cl = app['core.language'];

    var pool = new Array();
    var remove = function(l) {
        if (l) {
            var i = pool.indexOf(l);
            if (i === -1) return;
            ul.removeChild(l);
            pool.splice(i,1);
        } else {
            pool.forEach(function (o) { ul.removeChild(o) });
        }
        if (! ul.hasChildNodes() && stc.parentNode) document.body.removeChild(stc);
    }
    var append = function(o) {
        var kl = document.createElement('li');
        pool.push(kl);
        if (! stc.parentNode) document.body.appendChild(stc);
        ul.appendChild(kl);
            var aa = document.createElement('div');
            aa.className='type';
            kl.appendChild(aa);
                var aaa = document.createElement('div');
                aaa.className=o.type? o.type : 'warn';
                aa.appendChild(aaa);
            var ab = document.createElement('div');
            ab.className='details';
            kl.appendChild(ab);
            var aba = document.createElement('div');
                aba.className=o.id? o.id : 'standard';
                ab.appendChild(aba);
                if (o.title) {
                    var g = document.createElement('div');
                    g.className='title';
                    g.innerHTML=cl.mapKey(o.title);
                    aba.appendChild(g);
                }
                o.lines.forEach(function (t) {
                    var g = document.createElement('div');
                    g.className='line';
                    g.innerHTML=cl.mapKey(t);
                    aba.appendChild(g);
                });
        setTimeout(function() { remove(kl) }, 5500);
    };

    hide.addEventListener('click', function() {
        remove();
        if (stc.parentNode) document.body.removeChild(stc);
    });

    app['core.events'].on('core.status','append', append);

};