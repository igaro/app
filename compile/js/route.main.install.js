(function () {

"use strict";

module.requires = [
    { name: 'route.main.install.css' },
    { name: 'core.language.js' }
];

module.exports = function(app) {

    return function(model) {

        var view = model.view,
            wrapper = model.wrapper,
            language = app['core.language'];

        model.setMeta('title', _tr("Install"));

        dom.mk('p',wrapper,_tr("The following instructions assume a unix, linux or mac environment."));

        dom.mk('p',wrapper,_tr("By installing Igaro App you are agreeing to the license under which this software is distributed."));
  
        dom.mk('p',wrapper,
            [
                { 
                    'name' : 'source',
                    'value' : _tr("Show Source"),
                    'url' : 'https://github.com/igaro/'
                },
                {
                    'name' : 'license',
                    'value' : _tr("Show License"),
                    'route' : 'license'
                }
            ].map(function (n) {
                var i = dom.mk('button',null,n.value);
                if (n.url) i.addEventListener('click', function() {
                    window.open(n.url);
                });
                if (n.route) i.addEventListener('click', function() {
                     app['core.router'].to(model.path+'/'+n.route).then();
                });
                return i;
            })
        );

        dom.mk('h1',wrapper,_tr("Git Repository"));

        dom.mk('p',wrapper,_tr("Run the following in a terminal."));

        dom.mk('textarea',wrapper,"mkdir /igaro \n\
git clone https://github.com/igaro/app.git /igaro/git --depth=1",
'gitcode') 
        .readOnly=true;

        dom.mk('h1',wrapper,_tr("Initilize"));

        dom.mk('p',wrapper,_tr("Set up the environment to automate development processes."));

        dom.mk('p',wrapper,language.substitute(_tr("Ensure %d and %d are installed then run the following in a terminal."), '<a href="http://www.compass-style.org">Compass</a>', '<a href="http://www.gruntjs.com">Grunt</a>'));

        dom.mk('textarea',wrapper, 
'cd /igaro/git/app \n\
npm install \n\
compass compile -c compass-debug.rb',
        'gruntcode')
        .readOnly=true;

        dom.mk('h1',wrapper,_tr("Execute"));

        dom.mk('p',wrapper,_tr("Choose a mode based on whether you are developing and debugging, readying a release, or ready to deploy. All modes recompile code as you develop."));
  
        return model.addInstance(
            'navigation',
            {
                container:wrapper,
                type:'tabs'
            }
        ).then(function(navigation) {

            var div = [0,1,2].map(function(x) { 
                return dom.mk('div'); 
            }),
                p = dom.mk('p',wrapper);

            dom.mk('p', div[0], language.substitute(_tr("The following code starts a debug server. Sources will be uncompressed for ease of debugging. Navigate to: %d to see your work."), '<a href="http://localhost:3002">http://localhost:3002</a>'));
        
            dom.mk('textarea',div[0], 'grunt --gruntfile=grunt-debug').readOnly=true;

            dom.mk('p', div[1], language.substitute(_tr("The following code starts a deploy-debug server. Sources will be compressed but source maps will be written for ease of debugging. Navigate to: %d to see your work."), '<a href="http://localhost:3003">http://localhost:3003</a>'));
        
            dom.mk('textarea',div[1], 'grunt --gruntfile=grunt-deploy-debug').readOnly=true;

            dom.mk('p', div[2], language.substitute(_tr("The following code starts a deploy server. Sources will be compressed and protected, ready for release. Navigate to: %d to see your work."), '<a href="http://localhost:3004">http://localhost:3004</a>'));
        
            dom.mk('textarea',div[2], 'grunt --gruntfile=grunt-deploy').readOnly=true;

            [
                {
                    id:'debug',
                    title : _tr("Debug")
                    
                },
                {
                    id:'deploy-debug',
                    title : _tr("Deploy-Debug")
                    
                },
                {
                    id:'deploy',
                    title : _tr("Deploy")
                }
            ].forEach(function (o,i) {

                navigation.menu.addOption({
                    title:o.title,
                    id:o.id,
                    onClick: function() {
                        dom.setContent(p,div[i],{ noEmpty:true });
                        this.setActive();
                    }
                }).then(function(opt) {
                    if (! i) {
                        dom.setContent(p,div[0],{ noEmpty:true });
                        opt.setActive();
                    }
                });

            });

            navigation.menu.options[0].setActive();

        });

    };

};

})();
