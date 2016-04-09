//# sourceURL=route.main.locale.js

module.requires = [
    { name: 'route.main.locale.css' }
];

module.exports = function() {

    "use strict";

    return function(model) {

        var wrapper = model.wrapper,
            managers = model.managers,
            domMgr = managers.dom;

        model.stash.title=function() { return this.tr((({ key:"Locale" }))); };
        model.stash.description=function() { return this.tr((({ key:"Which framework offers multiple language, currency, country and timezone support without restarting it's core? Igaro App. And that's it." }))); };

        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"Igaro App provides <b>core.country</b>, <b>core.language</b>, <b>core.currency</b> and <b>core.date</b> (timezone offset) for seamless locale support. International recognized standards; ISO 3166.1, IETF and ISO 4217 are employed. Right-to-Left text is supported." }))); });

        domMgr.mk('h1',wrapper,function() { return this.tr((({ key:"Selection" }))); });

        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"The users country is sourced from the OS/browser and from this the most likely language and currency is derived and selected. If a language is unavailable the numerator is tried, followed by the app default, and then the fallback, en." }))); });
        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"Dates are formatted using the user's timezone, which is also sourced from the browser." }))); });
        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"Locale can be set manually and is applied in realtime without any need to restart the app / refresh the page. Modules fire events on which other objects can register to reconfigure themselves." }))); });

        domMgr.mk('h1',wrapper,function() { return this.tr((({ key:"Translation (getText)" }))); });

        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"The build script extracts strings and metadata from source files and updates a standard .pot file. At the same time strings and metadata from .po files are embedded into the original translation object. The applicable string is pulled at runtime based upon the users current language choice." }))); });

        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"The example below shows a simple use case. The text inside the paragraph will automatically update if the user switches language." }))); });

        domMgr.mk('pre',wrapper,domMgr.mk('code', null,'domMgr.mk("p",wrapper,function() { return this.tr((({ key:"This text will be translated" }))); }'));

        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"All of gettext's features are supported including pluralization with language rulesets, comments and context switching." })));  });

        domMgr.mk('pre',wrapper,domMgr.mk('code', null,'((({ key:"%[n] apple", plural:"%[n] apples", comment:"It\'s for fruit!", context:"bad fruit" })),17)'));

        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"<b>core.language</b> provides ordered substitution support for %[n] (where n is an integer) placeholders." }))); });

        domMgr.mk('p',wrapper,null,function() {

            domMgr.mk('button',this,function() { return this.tr((({ key:"Next Chapter - Mobile" }))); }).addEventListener('click',function() {

                model.parent.to(['mobile']);
            });
        });

    };

};
