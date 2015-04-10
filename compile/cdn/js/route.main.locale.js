module.requires = [
    { name: 'route.main.locale.css' }
];

module.exports = function(app) {

    return function(model) {

        var wrapper = model.wrapper,
            managers = model.managers,
            domMgr = managers.dom;

        model.stash.title=_tr("Locale");

        domMgr.mk('p',wrapper,_tr("Igaro App includes core support for country, language, currency, timezone offset and dates."));

        domMgr.mk('h1',wrapper,_tr("Standards"));

        domMgr.mk('p',wrapper,_tr("ISO 3166.1, IETF and ISO 4217 are supported."));

        domMgr.mk('h1',wrapper,_tr("Selection"));

        domMgr.mk('p',wrapper,_tr("The user's country data is sourced from the OS/browser. From this country, the most likely language and currency is derived and selected."));
        domMgr.mk('p',wrapper,_tr("When a language context is unavailable the root (if available) is tried, followed by the app default, and then the fallback, en."));
        domMgr.mk('p',wrapper,_tr("All dates are formatted into the user's timezone. By default this is set to the user's system timezone."));
        domMgr.mk('p',wrapper,_tr("All selections can be set manually and upon change update the app in realtime. There's no need to restart it."));

        domMgr.mk('h1',wrapper,_tr("Translation"));

        domMgr.mk('p',wrapper,_tr("Standard .po files are created automatically as code is edited. The applicable string is pulled at runtime."));
        domMgr.mk('p',wrapper,_tr("core.language includes a parsing routine for embedding %s variables."));

        domMgr.mk('h1',wrapper,_tr("Extras"));
        
        domMgr.mk('p',wrapper,_tr("A css based library <i>lib.iso.3166.1.flags</i> provides SVG flags for all countries."));

        domMgr.mk('p',wrapper,_tr("Currencies can be validated and formatted with per currency rules."));

    };

};
