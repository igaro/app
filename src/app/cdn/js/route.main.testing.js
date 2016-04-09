//# sourceURL=route.main.testing.js

(function() {

"use strict";

module.requires = [
    { name: 'route.main.testing.css' }
];

module.exports = function(app) {

    return function(model) {

        var wrapper = model.wrapper,
            managers = model.managers,
            domMgr = managers.dom,
            objMgr = managers.object,
            language = app['core.language'];

        model.stash.title=function(l) { return l.gettext("Testing"); };
        model.stash.desc = function(l) { return l.gettext("End2End and Unit tests are included and run in web browsers via Selenium WebDriver."); };

        domMgr.mk('p',wrapper,function(l) { return l.gettext("Igaro App utilizes NightwatchJS for E2E testing via the Selenium WebDriver. Unit tests are performed by Mocha & Chai."); });
        domMgr.mk('p',wrapper,language.substitute(function(l) { return l.gettext("Before launching the test suite the following requisites are required;"); }));
        domMgr.mk('p',wrapper,null, function() {
            domMgr.mk('ul',this,null, function() {
                domMgr.mk('li',this,language.substitute(function(l) { return l.gettext("Download %[0] into the lib folder."); },'<a href="http://selenium-release.storage.googleapis.com/index.html">Selenium</a>'));
                domMgr.mk('li',this,language.substitute(function(l) { return l.gettext("For Chrome support, download the %[0]Selenium driver%[1] into the lib folder."); },'<a href="https://code.google.com/p/selenium/wiki/ChromeDriver">','</a>'));
                domMgr.mk('li',this,language.substitute(function(l) { return l.gettext("For Internet Explorer support, download the %[0]Selenium driver%[1] into the lib folder."); },'<a href="https://code.google.com/p/selenium/wiki/InternetExplorerDriver">','</a>'));
                domMgr.mk('li',this,function(l) { return l.gettext("Verify the tests/nightwatch.json and package.json files match your browser support requirements and the Selenium version matches what you downloaded."); });
            });
        });

        domMgr.mk('h1',wrapper,function(l) { return l.gettext("Running & Adding Tests"); });
        domMgr.mk('p',wrapper);

        return objMgr.create('pagemessage', {
            type:'warn',
            message:function(l) { return l.gettext("Testing is being overhauled to use PhantomJS, Mocha, Chai and Selenium directly within Node. Nightwatch will be removed."); },
            container:wrapper
        }).then(function() {
            domMgr.mk('p',wrapper,function(l) { return l.gettext("Begin the test suite using the command below."); });
            domMgr.mk('pre',wrapper,domMgr.mk('code',null,"npm test"));
            domMgr.mk('p',wrapper,function(l) { return l.gettext("Customise and add your own E2E tests in the tests/src folder. Unit tests are found in tests/unit."); });
            domMgr.mk('p',wrapper,function(l) { return l.gettext("Individual tests can be run in Firefox by setting about:config->security.fileuri.strict_origin_policy to false."); });
            domMgr.mk('p',wrapper,null,function() {

                domMgr.mk('button',this,function(l) { return l.gettext("Next Chapter - Modules"); }).addEventListener('click',function() {

                    model.parent.to(['modules']);
                });
            });
        });

    };

};

})();
