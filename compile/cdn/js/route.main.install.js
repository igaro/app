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

        dom.mk('h1',wrapper,_tr("Install"));

        dom.mk('p',wrapper,_tr("Run the following in a terminal."));

        dom.mk('textarea',wrapper,"mkdir igaro \n\
git clone https://github.com/igaro/app.git igaro/git --depth=1 \n\
sudo npm install -g grunt-cli \n\
sudo gem update --system \n\
sudo gem install compass \n\
cd igaro/git \n\
npm install \n\
compass compile -c compass.rb \n\
grunt",'gitcode') 
        .readOnly=true;

        dom.mk('h1',wrapper,_tr("View"));

        dom.mk('p',wrapper,language.substitute(_tr("Igaro compiles into three modes; debug, deploy-debug and deploy. You'll find a web server for each of these modes on ports %d, %d and %d."),'<a href="http://localhost:3006">3006</a>','<a href="http://localhost:3007">3007</a>','<a href="http://localhost:3008">3008</a>'));

    };

};

})();
