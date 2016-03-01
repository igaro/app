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

        model.stash.title=_tr("Locale");
        model.stash.description=_tr("Which framework offers multiple language, currency, country and timezone support without restarting it's core? Igaro App. And that's it.");

        domMgr.mk('p',wrapper,_tr("Igaro App provides <b>core.country</b>, <b>core.language</b>, <b>core.currency</b> and <b>core.date</b> (timezone offset) for seamless locale support. International recognized standards; ISO 3166.1, IETF and ISO 4217 are employed. Right-to-Left text is supported."));

        domMgr.mk('h1',wrapper,_tr("Selection"));

        domMgr.mk('p',wrapper,_tr("The users country is sourced from the OS/browser and from this the most likely language and currency is derived and selected. If a language is unavailable the numerator is tried, followed by the app default, and then the fallback, en."));
        domMgr.mk('p',wrapper,_tr("Dates are formatted using the user's timezone, which is also sourced from the browser."));
        domMgr.mk('p',wrapper,_tr("Locale can be set manually and is applied in realtime without any need to restart the app / refresh the page. Modules fire events on which other objects can register to reconfigure themselves."));

        domMgr.mk('h1',wrapper,_tr("Translation (getText)"));

        domMgr.mk('p',wrapper,_tr("The build manager updates a standard .pot file as the codebase is edited and includes .po files as they are created. The applicable string is pulled at runtime and many helper functions such as <b>dom.mk</b> register the event handle for you."));

        domMgr.mk('pre',wrapper,domMgr.mk('code', null,'domMgr.mk("p",wrapper,_tr_("This text will be translated by the builder and inserted by the app. It will react to the core.language setEnv event."));'));

        domMgr.mk('p',wrapper,_tr("The builder switches the translation for a literal of IETF tags."));

        domMgr.mk('pre',wrapper,domMgr.mk('code',null,'{\
\n    en : "Good Morning",\
\n    fr : "Bonjour"\
\n}'));

        domMgr.mk('p',wrapper,_tr("<b>core.language</b> provides getText parsing routines including support for both %[n] (where n is an integer) and %d (next argument) placeholders."));

        domMgr.mk('p',wrapper,null,function() {

            domMgr.mk('button',this,_tr("Next Chapter - Mobile")).addEventListener('click',function() {

                model.parent.to(['mobile']);
            });
        });

    };

};
