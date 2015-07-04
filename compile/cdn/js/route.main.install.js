//# sourceURL=route.main.install.js

(function () {

"use strict";

module.requires = [
    { name: 'route.main.install.css' }
];

module.exports = function(app) {

    "use strict";

    return function(model) {

        var wrapper = model.wrapper,
            language = app['core.language'],
            domMgr = model.managers.dom,
            router = app['core.router'];

        model.stash.title=_tr("Install");
        model.stash.description=_tr("Install in one step. It's free, and you'll instantly have an app ready to modify. Prepare to be impressed!");

        domMgr.mk('p',wrapper,_tr("The following instructions assume a unix, linux or mac environment."));

        domMgr.mk('p',wrapper,_tr("By installing Igaro App you are agreeing to the license under which this software is distributed."));

        domMgr.mk('p',wrapper,null,function() {
            domMgr.mk('button',this,_tr("Show Source")).addEventListener('click',function() {
                window.open('https://github.com/igaro/app');
            });
            domMgr.mk('button',this,_tr("Show License")).addEventListener('click',function() {
                router.to(model.uriPath.concat('license'));
            });
        });

        domMgr.mk('h1',wrapper,_tr("Install"));

        domMgr.mk('p',wrapper,_tr("Run the following in a terminal."));

        domMgr.mk('pre',wrapper,domMgr.mk('code',null,"mkdir igaro \n\
git clone https://github.com/igaro/app.git igaro/git\n\
npm install grunt-cli \n\
sudo gem update --system \n\
sudo gem install compass \n\
cd igaro/git \n\
npm install \n\
grunt",'gitcode'));

        domMgr.mk('h1',wrapper,_tr("Boom!"));

        domMgr.mk('p',wrapper,language.substitute(_tr("Igaro compiles into two modes; debug and deploy. A web server for each can be found on ports %[0] and %[1]. These will reload automatically as you work."),'<a href="http://localhost:3006">3006</a>','<a href="http://localhost:3007">3007</a>'));

        domMgr.mk('p',wrapper,_tr("That's it. Now read as much of the documentation as you need, modify the route files behind this app, and create!"));

    };

};

})();
