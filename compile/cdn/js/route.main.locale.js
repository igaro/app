module.requires = [
    { name: 'route.main.locale.css' },
    { name: 'lib.iso.3166.1.flags.css' },
    { name: 'core.country.js'}
];

module.exports = function(app) {

    return function(model) {

        var view = model.view,
            wrapper = model.wrapper,
            router = app['core.router'],
            events = app['core.events'],
            country = app['core.country'],
            language = app['core.language'],
            currency = app['core.currency'],

            localeSetter =  function(type) {
                dom.mk('p',wrapper,
                    function() {
                        var writeopts = function(select) {
                                while (select.firstChild)
                                    select.removeChild(select.firstChild);
                                var cme = type.code.get();
                                Object.keys(type.pool.get({ sortby:'name' })).forEach(function (o) {
                                    var opt = dom.mk('option', select, function() {
                                        return type.getNameOfId(o);
                                    } );
                                    opt.value = o;
                                    opt.selected = cme === o;
                                });
                            },
                            select = dom.mk('select');

                        writeopts(select);
                        events.on('core.language','code.set', function() {
                            writeopts(select);
                        });
                        select.addEventListener('change', function() { 
                            type.code.set(this.options[this.selectedIndex].value);
                        });
                        return select;
                    }
                );
            },

            localeModBut = function(type) {
                dom.mk('p',wrapper,
                    type.map(function (type) {
                        var v = dom.mk('input[button]',null,{
                            en : type
                        });
                        v.addEventListener('click', function() {
                            router.to('/main/modules/'+type);
                        });
                        return v;
                    })
                );
            };

        model.setMeta('title', {
            en : 'Locale',
            fr : 'Vitrine'
        });

        dom.mk('p',wrapper,{
            en : 'Igaro App comes with core modules handling locale for country, language, currency, timezone offset and dates.',
            fr : 'Igaro App est livré avec des modules de base de manipulation locale pour le pays, la langue, la monnaie, le décalage horaire et les dates.'
        });

        dom.mk('p',wrapper,{
            en : 'These define identification codes, process requests, and in the case of a manual timezone, ask for further information. Formatting may be actioned by additional modules or via an API.'
        });

        dom.mk('h1',wrapper,{
            en : 'Country',
            fr : 'Pays'
        });

        dom.mk('p',wrapper,{
            en : 'Identification is via <a href="http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2" target="_blank">ISO 3166.1</a> (i.e US, GB, FR).',
            fr : 'L\'identification se fait par <a href="http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2" target="_blank">ISO 3166.1</a> (i.e US, GB, FR).'
        });

        dom.mk('p',wrapper,{
            en : 'Country data includes related information. If a user defines their country as France the likely language and currency will be French and Euro. The default country is determined automatically via the browser / OS.'
        });

        localeSetter(country);

        dom.mk('p',wrapper,{
            en : 'A css library <i>lib.iso.3166.1.flags</i> provides SVG flags for all countries. Changing country emits an event which can be used to reconfigure all aspects of the app. The flag updates with no code between it and the select box.'
        });

        dom.mk('p',wrapper,
            function() {
                var x = dom.mk('div',null,null,country.code.get());
                events.on('core.country','code.set', function(c) {
                    x.className = c;
                });
                return x;
            },
        'lib-iso-3166-1-flags');

        localeModBut(['core.country']);

        dom.mk('h1',wrapper,{
            en : 'Language',
            fr : 'Langue'
        });

        dom.mk('p',wrapper,{
            en : 'Identification is via <a href="http://en.wikipedia.org/wiki/IETF_language_tag" target="_blank">IETF Tag</a> (i.e en-US, en-GB, FR).',
            fr : 'L\'identification se fait par <a href="http://en.wikipedia.org/wiki/IETF_language_tag" target="_blank">IETF Tag</a> (i.e en-US, en-GB, FR).'
        });

        dom.mk('p',wrapper,{
            en : 'If a language context is unavailable (i.e en-US) the root shall be tried followed by en. The default language is determined automatically via the browser / OS.'
        });

        localeSetter(language);

        localeModBut(['core.language']);

        dom.mk('h1',wrapper,{
            en : 'Currency',
            fr : 'Monnaie'
        });

        dom.mk('p',wrapper,{
            en : 'Identification is via <a href="http://en.wikipedia.org/wiki/ISO_4217" target="_blank">ISO 4217</a> (i.e USD, GBP, EUR).',
            fr : 'L\'identification se fait par <a href="http://en.wikipedia.org/wiki/ISO_4217" target="_blank">ISO 4217</a> (i.e USD, GBP, EUR).'
        });

        dom.mk('p',wrapper,{
            en : 'The default currency is determined via the core.country module (i.e if the country is France the currency will be EUR).'
        });

        localeSetter(currency);

        dom.mk('p',wrapper,{
            en : 'Values can be validated and formatted with per currency rules.'
        });

        dom.mk('p',wrapper,

            function() {

                var f = document.createElement('form'),
                    v = dom.mk('input[text]',f),
                    l = dom.mk('span',f),
                    routine = function() {
                        var vg = v.value.trim();
                        l.className = 'hide';
                        if (! vg.length) 
                            return { near:v, message: {
                                en: 'A value is required',
                                fr: 'Une valeur est requise'
                            }};
                        if (! currency.validate(vg,{ allowNeg: true })) 
                            return { near:v, message: {
                                en:'Invalid amount',
                                fr:'Montant invalide'
                            }};
                        l.className = 'show';
                        l.innerHTML = currency.format(vg, { colorize:true });
                    };

                v.placeholder='xx.xx';

                model.managers.object.create('form.validate',{
                    form:f,
                    routine:routine
                });

                events.on('core.currency','code.set', routine);

                return f;
            },

        null, 'currencycheck');

        localeModBut(['core.currency']);

        dom.mk('h1',wrapper,{
            en : 'Date/Time & Timezone',
            fr : 'et Fuseau Horaire'
        });

        dom.mk('p',wrapper,{
            en : 'The default timezone is determined automatically via the browser / OS.',
            fr : ''
        });

        dom.mk('p',wrapper,{
            en : 'instance.date formats and automatically updates date/time values upon timezone change.',
            fr : ''
        });

        var dt = dom.mk('p',wrapper);

        Promise.all(
            ['LLLL', 'LL', 'L'].map(function(c) {
                return model.managers.object.create('date', { 
                    container:dt, 
                    date:new Date(), 
                    format:c
                });
            })
        ).then(function (arr) {
            setInterval(function() {
                arr.forEach(function (date) {
                    date.set(new Date());
                });
            }, 1000);
        });

        localeModBut(['core.date','instance.date']);

    };

};
