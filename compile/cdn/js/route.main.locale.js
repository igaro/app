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

        domMgr.mk('p',wrapper,_tr("Igaro App supports country, language, currency, timezone offset and date locale."));

        domMgr.mk('h1',wrapper,_tr("Standards"));

        domMgr.mk('p',wrapper,_tr("ISO 3166.1, IETF,  ISO 4217 and Right-to-Left text are supported."));

        domMgr.mk('h1',wrapper,_tr("Selection"));

        domMgr.mk('p',wrapper,_tr("Country data is sourced from the OS/browser. From this the most likely language and currency is derived and selected. If a language is unavailable the numerator is tried, followed by the app default, and then the fallback, en."));
        domMgr.mk('p',wrapper,_tr("Dates are formatted into the user's timezone. Locale can be set manually and is applied in realtime. There's no need to restart the app."));

        domMgr.mk('h1',wrapper,_tr("Translation"));

        domMgr.mk('p',wrapper,_tr("Standard .po files are created automatically as code is edited. The applicable string is pulled at runtime."));

        domMgr.mk('pre',wrapper,'_tr(\"translate\")');

        domMgr.mk('p',wrapper,_tr("API's should provide a literal of supported language IETF tags."));

        domMgr.mk('pre',wrapper,'{\
\n    en : "Good Morning",\
\n    fr : "Bonjour"\
\n}');

        domMgr.mk('p',wrapper,_tr("core.language includes a parsing routine for embedding %[n] variables (where n is an integer)."));

    };

};
