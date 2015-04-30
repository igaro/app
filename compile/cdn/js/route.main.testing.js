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

        model.stash.title=_tr("Testing");

        domMgr.mk('p',wrapper,_tr("Igaro App utilizes NightwatchJS for E2E testing."));

        domMgr.mk('p',wrapper,language.substitute(_tr("Before launching the test suite the following requisites are required;")));
        domMgr.mk('p',wrapper,null, function() {
            domMgr.mk('ul',this,null, function() {
                domMgr.mk('li',this,language.substitute(_tr("Install %[0] into the bin/nightwatch folder."),'<a href="">NightwatchJS</a>'));
                domMgr.mk('li',this,language.substitute(_tr("Download %[0] into the lib folder."),'<a href="http://selenium-release.storage.googleapis.com/index.html">Selenium</a>'));
                domMgr.mk('li',this,language.substitute(_tr("For Chrome support, download the %[0]Selenium driver%[1] into the lib folder."),'<a href="https://code.google.com/p/selenium/wiki/ChromeDriver">','</a>'));
                domMgr.mk('li',this,language.substitute(_tr("For Internet Explorer support, download the %[0]Selenium driver%[1] into the lib folder."),'<a href="https://code.google.com/p/selenium/wiki/InternetExplorerDriver">','</a>'));
                domMgr.mk('li',this,_tr("Verify the tests/nightwatch.json and package.json files match your browser support requirements and the Selenium version matches what you downloaded."));
            });
        });

        domMgr.mk('h1',wrapper,_tr("Running & Adding Tests"));

        domMgr.mk('p',wrapper);

        return objMgr.create('pagemessage', {
            type:'warn',
            container:wrapper,
            message:_tr("At time of writing the Selenium Firefox driver contains a bug preventing NightwatchJS from starting Selenium on demand.")
        }).then(function() {
            domMgr.mk('p',wrapper,_tr("Begin the test suite with the command below."));

            domMgr.mk('pre',wrapper,"npm test");

            domMgr.mk('p',wrapper,_tr("Customise and add your own tests in the tests/src folder."));

        });

    };

};

})();
