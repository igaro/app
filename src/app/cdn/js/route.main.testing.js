//# sourceURL=route.main.testing.js

(function() {

"use strict";

module.requires = [
    { name: 'route.main.testing.css' }
];

module.exports = function() {

    return function(model) {

        var wrapper = model.wrapper,
            managers = model.managers,
            domMgr = managers.dom,
            objMgr = managers.object;

        model.stash.title=function() { return this.tr((({ key:"Testing" }))); };
        model.stash.desc = function() { return this.tr((({ key:"End2End and Unit tests are included and run in web browsers via Selenium WebDriver." }))); };

        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"Igaro App utilizes NightwatchJS for E2E testing via the Selenium WebDriver. Unit tests are performed by Mocha & Chai." }))); });
        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"Before launching the test suite the following requisites are required;" }))); });
        domMgr.mk('p',wrapper,null, function() {
            domMgr.mk('ul',this,null, function() {
                domMgr.mk('li',this,function() { return this.substitute(this.tr((({ key:"Download %[0] into the lib folder." }))),'<a href="http://selenium-release.storage.googleapis.com/index.html">Selenium</a>'); });
                domMgr.mk('li',this,function() { return this.substitute(this.tr((({ key:"For Chrome support, download the %[0]Selenium driver%[1] into the lib folder." }))),'<a href="https://code.google.com/p/selenium/wiki/ChromeDriver">','</a>'); });
                domMgr.mk('li',this,function() { return this.substitute(this.tr((({ key:"For Internet Explorer support, download the %[0]Selenium driver%[1] into the lib folder." }))),'<a href="https://code.google.com/p/selenium/wiki/InternetExplorerDriver">','</a>'); });
                domMgr.mk('li',this,function() { return this.tr((({ key:"Verify the tests/nightwatch.json and package.json files match your browser support requirements and the Selenium version matches what you downloaded." }))); });
            });
        });

        domMgr.mk('h1',wrapper,function() { return this.tr((({ key:"Running & Adding Tests" }))); });
        domMgr.mk('p',wrapper);

        return objMgr.create('pagemessage', {
            type:'warn',
            message:function() { return this.tr((({ key:"Testing is being overhauled to use PhantomJS, Mocha, Chai and Selenium directly within Node. Nightwatch will be removed." }))); },
            container:wrapper
        }).then(function() {
            domMgr.mk('p',wrapper,function() { return this.tr((({ key:"Begin the test suite using the command below." }))); });
            domMgr.mk('pre',wrapper,domMgr.mk('code',null,"npm test"));
            domMgr.mk('p',wrapper,function() { return this.tr((({ key:"Customise and add your own E2E tests in the tests/src folder. Unit tests are found in tests/unit." }))); });
            domMgr.mk('p',wrapper,function() { return this.tr((({ key:"Individual tests can be run in Firefox by setting about:config->security.fileuri.strict_origin_policy to false." }))); });
            domMgr.mk('p',wrapper,null,function() {

                domMgr.mk('button',this,function() { return this.tr((({ key:"Next Chapter - Modules" }))); }).addEventListener('click',function() {

                    model.parent.to(['modules']);
                });
            });
        });
    };
};

})();
