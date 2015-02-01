module.requires = [
    { name: 'route.main.locale.css' },
    { name: 'lib.iso.3166.1.flags.css' },
    { name: 'core.country.js'}
];

module.exports = function(app) {

    return function(model) {

        var view = model.view,
            wrapper = view.wrapper,
            mvc = app['core.mvc'],
            events = app['core.events'],
            country = app['core.country'],
            language = app['core.language'],
            currency = app['core.currency'],

            localeSetter =  function(type) {
                view.createAppend('p',wrapper,
                    function() {
                        var writeopts = function(select) {
                                while (select.firstChild)
                                    select.removeChild(select.firstChild);
                                var cme = type.code.get();
                                Object.keys(type.pool.get({ sortby:'name' })).forEach(function (o) {
                                    var opt = view.createAppend('option', select, function() {
                                        return type.getNameOfId(o);
                                    } );
                                    opt.value = o;
                                    opt.selected = cme === o;
                                });
                            },
                            select = view.createAppend('select');

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
                view.createAppend('p',wrapper,
                    type.map(function (type) {
                        var v = view.createAppend('input[button]',null,{
                            en : type
                        });
                        v.addEventListener('click', function() {
                            mvc.to('/main/modules/'+type);
                        });
                        return v;
                    })
                );
            };

        model.meta.set('title', {
            en : 'Locale',
            fr : 'Vitrine'
        });

        view.createAppend('p',wrapper,{
            en : 'Igaro App comes with core modules handling locale for country, language, currency, timezone offset and dates.',
            fr : 'Igaro App est livré avec des modules de base de manipulation locale pour le pays, la langue, la monnaie, le décalage horaire et les dates.'
        });

        view.createAppend('p',wrapper,{
            en : 'These define identification codes, process requests, and in the case of a manual timezone, ask for further information. Formatting may be actioned by additional modules or via an API.',
            fr : ''
        });

        view.createAppend('h1',wrapper,{
            en : 'Country',
            fr : 'Pays'
        });

        view.createAppend('p',wrapper,{
            en : 'Identification is via <a href="http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2" target="_blank">ISO 3166.1</a> (i.e US, GB, FR).',
            fr : 'L\'identification se fait par <a href="http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2" target="_blank">ISO 3166.1</a> (i.e US, GB, FR).'
        });

        view.createAppend('p',wrapper,{
            en : 'Country data includes related information. If a user defines their country as France the likely language and currency will be French and Euro. The default country is determined automatically via the browser / OS.',
            fr : ''
        });

        localeSetter(country);

        view.createAppend('p',wrapper,{
            en : 'A css library <i>lib.iso.3166.1.flags</i> provides SVG flags for all countries. Changing country emits an event which can be used to reconfigure all aspects of the app. The flag updates with no code between it and the select box.',
            fr : ''
        });

        view.createAppend('p',wrapper,
            function() {
                var x = view.createAppend('div',null,null,country.code.get());
                events.on('core.country','code.set', function(c) {
                    x.className = c;
                });
                return x;
            },
        'lib-iso-3166-1-flags');

        localeModBut(['core.country']);

        view.createAppend('h1',wrapper,{
            en : 'Language',
            fr : 'Langue'
        });

        view.createAppend('p',wrapper,{
            en : 'Identification is via <a href="http://en.wikipedia.org/wiki/IETF_language_tag" target="_blank">IETF Tag</a> (i.e en-US, en-GB, FR).',
            fr : 'L\'identification se fait par <a href="http://en.wikipedia.org/wiki/IETF_language_tag" target="_blank">IETF Tag</a> (i.e en-US, en-GB, FR).'
        });

        view.createAppend('p',wrapper,{
            en : 'If a language context is unavailable (i.e en-US) the root shall be tried followed by en. The default language is determined automatically via the browser / OS.',
            fr : ''
        });

        localeSetter(language);

        localeModBut(['core.language']);

        view.createAppend('h1',wrapper,{
            en : 'Currency',
            fr : 'Monnaie'
        });

        view.createAppend('p',wrapper,{
            en : 'Identification is via <a href="http://en.wikipedia.org/wiki/ISO_4217" target="_blank">ISO 4217</a> (i.e USD, GBP, EUR).',
            fr : 'L\'identification se fait par <a href="http://en.wikipedia.org/wiki/ISO_4217" target="_blank">ISO 4217</a> (i.e USD, GBP, EUR).'
        });

        view.createAppend('p',wrapper,{
            en : 'The default currency is determined via the core.country module (i.e if the country is France the currency will be EUR).',
            fr : ''
        });

        localeSetter(currency);

        view.createAppend('p',wrapper,{
            en : 'Values can be validated and formatted with per currency rules.',
            fr : ''
        });

        view.createAppend('p',wrapper,

            function() {

                var f = document.createElement('form'),
                    v = view.createAppend('input[text]',f),
                    l = view.createAppend('span',f),
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

                view.instances.add('form.validate',{
                    form:f,
                    routine:routine
                });

                events.on('core.currency','code.set', routine);

                return f;
            },

        null, 'currencycheck');

        localeModBut(['core.currency']);

        view.createAppend('h1',wrapper,{
            en : 'Date/Time & Timezone',
            fr : 'et Fuseau Horaire'
        });

        view.createAppend('p',wrapper,{
            en : 'The default timezone is determined automatically via the browser / OS.',
            fr : ''
        });

        view.createAppend('p',wrapper,{
            en : 'instance.date formats and automatically updates date/time values upon timezone change.',
            fr : ''
        });

        var dt = view.createAppend('p',wrapper);

        Promise.all(
            ['LLLL', 'LL', 'L'].map(function(c) {
                return view.instances.add('date', { 
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
