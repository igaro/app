//# sourceURL=route.main.install.js

(function () {

"use strict";

module.requires = [
    { name: 'route.main.install.css' }
];

module.exports = function() {

    return function(model) {

        var wrapper = model.wrapper,
            domMgr = model.managers.dom;

        model.stash.title=function() { return this.tr((({ key:"Install" }))); };
        model.stash.description=function() { return this.tr((({ key:"Install in one step. It's free, and you'll instantly have an app ready to modify. Prepare to be impressed!" }))); };

        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"The following instructions assume a unix, linux or mac environment." }))); });

        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"By installing Igaro App you are agreeing to the license under which this software is distributed." }))); });

        domMgr.mk('p',wrapper,null,function() {

            domMgr.mk('button',this,function() { return this.tr((({ key:"Show Source" }))); }).addEventListener('click',function() {

                window.open('https://github.com/igaro/app');
            });
            domMgr.mk('button',this,function() { return this.tr((({ key:"Show License" }))); }).addEventListener('click',function() {

                model.to(['license']);
            });
        });

        domMgr.mk('h1',wrapper,function() { return this.tr((({ key:"Install" }))); });

        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"Make sure you have Node 5.8+ installed and then run the following in a terminal." }))); });

        domMgr.mk('pre',wrapper,domMgr.mk('code',null,"mkdir igaro \n\
git clone https://github.com/igaro/app.git igaro/git\n\
cd igaro/git \n\
npm install \n\
./build --recipe=devel --serve=3006 --watch",'gitcode'));

        domMgr.mk('h1',wrapper,function() { return this.tr((({ key:"Boom!" }))); });

        domMgr.mk('p',wrapper,function() { return this.substitute(this.tr((({ key:"The build script uses recipes to cater for different environments and the app is now available on port %[0]. This will rebuild as you code." }))),'<a href="http://localhost:3006">3006</a>','<a href="http://localhost:3007">3007</a>'); });

        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"That's it. Now read as much of the documentation as you need and dive in!" }))); });

    };

};

})(this);
