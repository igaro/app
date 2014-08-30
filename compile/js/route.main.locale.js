module.requires = [
    { name: 'route.main.locale.css' },
    { name: 'core.language.js' },
    { name: 'lib.iso.3166.1.flags.css' }
];

module.exports = function(app) {

    return function(model) {

        var view = model.view;
        var wrapper = view.wrapper;

        model.meta.set('title', {
            en : 'Locale',
            fr : 'Vitrine'
        });

        view.createAppend('p',wrapper,{
            en : 'Igaro App comes with core modules handling locale for country, language, currency, timezone offset and dates.',
            fr : 'Igaro App est livré avec des modules de base de manipulation locale pour le pays, la langue, la monnaie, le décalage horaire et les dates.'
        });

        view.createAppend('p',wrapper,{
            en : 'Core modules define codes, process requests, and in the case of a manual timezone, ask for further information. The new code is passed onto the event manager and registered modules such as routes change their data appropriately. This may result in formatting or data fetching from an API.',
            fr : 'Modules de base définissent les codes, les demandes de traitement, et dans le cas d\'un fuseau horaire emploi, demande d\'informations complémentaires. Le nouveau code est passé sur le gestionnaire d\'événements et les modules enregistrés tels que les itinéraires changent leurs données de façon appropriée. Il peut en résulter une mise en forme ou d\'extraction de données à partir d\'une API.'
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
            en : 'The country data also includes approximation data. If the chosen country is France the user will likely speak French and use the Euro currency.',
            fr : 'Les données de pays comprend également des données d\'approximation. Si le pays choisi est la France l\'utilisateur sera probablement parler français et d\'utiliser l\'euro.'
        });

        view.createAppend('p',wrapper,{
            en : 'A css library <i>lib.iso.3166.1.flags</i> includes SVG flags for every country in the world. A few are shown below.',
            fr : 'Une bibliothèque de css <i>lib.iso.3166.1.flags</i> comprend drapeaux SVG pour chaque pays dans le monde. Quelques-uns sont présentés ci-dessous.'
        });

        var flags = view.createAppend('div',wrapper,null,'lib-iso-3166-1-flags');
        ['md','fr','cf','cl','my'].forEach(function (o) {
            view.createAppend('div',flags,null,o);
        })

        view.createAppend('h1',wrapper,{
            en : 'Language',
            fr : 'Langue'
        });

        view.createAppend('p',wrapper,{
            en : 'Identification is via <a href="http://en.wikipedia.org/wiki/IETF_language_tag" target="_blank">IETF Tag</a> (i.e en-US, en-GB, FR).',
            fr : 'L\'identification se fait par <a href="http://en.wikipedia.org/wiki/IETF_language_tag" target="_blank">IETF Tag</a> (i.e en-US, en-GB, FR).'
        
        });

        view.createAppend('p',wrapper,{
            en : 'If a language is unavailable core.language will revert to the root, so if <i>en-GB</i> is undefined it will then try <i>en</i>.',
            fr : 'Si une langue est disponible core.language reviendra à la racine, si <i>fr-FR </i> n\'est pas défini, il sera alors essayer <i>en</i>.'
             
        });

        view.createAppend('p',wrapper,{
            en : 'If the language is undefined a best guess will be sourced from the core.country module.',
            fr : 'Si la langue n\'est pas définie une meilleure estimation sera obtenue à partir du module de core.country.'
        });

        view.createAppend('h1',wrapper,{
            en : 'Currency',
            fr : 'Monnaie'
        });

        view.createAppend('p',wrapper,{
            en : 'Identification is via <a href="http://en.wikipedia.org/wiki/ISO_4217" target="_blank">ISO 4217</a> (i.e USD, GBP, EUR).',
            fr : 'L\'identification se fait par <a href="http://en.wikipedia.org/wiki/ISO_4217" target="_blank">ISO 4217</a> (i.e USD, GBP, EUR).',
             
        });

        view.createAppend('p',wrapper,{
            en : 'The core.currency module includes a helper functions to format and validate currencies.',
            fr : 'Le module comprend un core.currency fonctions d\'aide pour formater et valider devises.'
        });

        view.createAppend('p',wrapper,{
            en : 'If the currency is undefined a best guess will be sourced from core.country.',
            fr : 'Si la monnaie n\'est pas défini une meilleure estimation proviendra core.country.'
        });

        view.createAppend('h1',wrapper,{
            en : 'Timezone',
            fr : 'Fuseau Horaire'
        });

        view.createAppend('p',wrapper,{
            en : 'Igaro App defaults to the system timezone offset which is queried via javascript.',
            fr : 'Défaut Igaro Application à le fuseau horaire du système de compensation qui est interrogé via javascript.'
        });

        view.createAppend('p',wrapper,{
            en : 'Manual timezone configuration can be applied in steps of 15 minutes.',
            fr : 'Configuration du fuseau horaire manuelle peut être appliquée dans les étapes de 15 minutes.'
        });

    };

};
