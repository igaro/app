module.requires = [
    { name:'route.location.css' },
    { name:'core.language.js' }
];

module.exports = function(app) {

    var events = app['core.events'];
    var language = app['core.language'];
    var mvc = app['core.mvc'];

    return function(model) {

        var view = model.view,
            wrapper = view.wrapper;

        view.autoShow=false;

        // location bar
        var home = document.createElement('a');
        home.className = 'home';
        home.href='';
        home.addEventListener('click', function(evt) { 
            evt.preventDefault(); 
            mvc.to('/main'); 
        } );
        wrapper.appendChild(home);
        var path = document.createElement('div');
        path.className = 'path';
        wrapper.appendChild(path);

        var f = function(o) {
            var c = mvc.current;
            if (c.view && c.view.path.length) {
                view.show({ after:model.parent.children.getByName('header') });
                while (path.firstChild) { 
                    path.removeChild(path.firstChild); 
                }
                while (c.view.path.length) {
                    var m = document.createElement(c === mvc.current? 'span' : 'a');
                    m.setAttribute('path',c.path);
                    m.innerHTML = language.mapKey(c.meta.get('title')) || c.name;
                    if (c !== mvc.current) {
                        m.href='#!/'+c.view.path;
                        m.addEventListener('click', function(evt) {
                            evt.preventDefault();
                            mvc.to(this.getAttribute('path')); 
                        });
                    }
                    path.insertBefore(m,path.firstChild);
                    c = c.parent;
                }
            } else {
                view.hide();
            }
        };

        events.on('core.mvc','to.in-progress', f),
       // events.on('core.language','code.set', f),
        events.on('core.mvc','meta.set', function (o) {
            if (o.model === model && o.name === 'title') 
                f();
        });

    };

};