module.requires = [
    { name: 'route.main.faq.css' },
    { name:'core.language.js' }
];

module.exports = function(app) {

    return function(model) {

        var view = model.view;
        var wrapper = view.wrapper;

        model.meta.set('title', {
            en : 'FAQ'
        });

        view.createAppend('h1',wrapper,{
            en : 'Compatibility',
            fr : 'Compatibilité'
        });

        view.createAppend('h2',wrapper,{
            en : 'Internet Explorer 8/9'
        });

        view.createAppend('p',wrapper,{
            en : 'By default Igaro App will work with these browsers but with CSS3/CORS/SVG limitations.',
            fr : 'Par défaut Igaro App travaillera avec ces navigateurs mais avec des limitations de CSS3/CORS/SVG.'
        });

        view.createAppend('h2',wrapper,{
            en : 'Existing Javascript',
            fr : 'Javascript Existante'
        });

        view.createAppend('p',wrapper,{
            en : 'You can use all your existing Javascript and easily convert your old views and code to use the Igaro App framework.',
            fr : 'ous pouvez utiliser tout votre Javascript existante et facilement convertir vos vieux vues et code pour utiliser le cadre Igaro App.'
        });

        view.createAppend('h2',wrapper,{
            en : 'Existing Libraries',
            fr : 'Bibliothèques Existantes'
        });

        view.createAppend('p',wrapper,{
            en : 'You can use generally use all 3rd party libraries (i.e JQuery, YetAnotherJS) with the Igaro App framework. We\'ve even included a few in the repo.',
            fr : 'Vous pouvez utiliser généralement utiliser toutes les bibliothèques 3ème partie (c.-à JQuery, YetAnotherJS) avec le cadre Igaro App. Nous avons même inclus quelques-uns dans le dépôt.'
        });

        view.createAppend('h1',wrapper,{
            en : 'Dependencies',
            fr : 'Dépendances'
        });

        view.createAppend('p',wrapper,{
            en : 'Igaro App is free of dependencies.',
            fr : 'Igaro App est libre de dépendances.'
        });

        view.createAppend('h1',wrapper,{
            en : 'Efficiency',
            fr : 'Efficacité'
        });

        view.createAppend('h2',wrapper,{
            en : 'Operational',
            fr : 'Opérationnel'
        });

        view.createAppend('p',wrapper,{
            en : 'Igaro App works directly on the DOM. It removes elements keeping the DOM super clean and organised. You\'ll notice how fast Igaro App is compared to similar frameworks.',
            fr : 'Igaro App fonctionne directement sur le DOM. Il supprime des éléments de maintien de la DOM super propre et organisé. Vous remarquerez la rapidité Igaro App est comparée à des cadres similaires.'
        });

        view.createAppend('h2',wrapper,{
            en : 'Learning',
            fr : 'Apprentissage'
        });

        view.createAppend('p',wrapper,{
            en : 'Igaro App is pure Javascript. There\'s no templating or methodology to learn. If you know Javascript, then you know Igaro App.',
            fr : 'Igaro App est pur Javascript. Il n\'y a pas de gabarits ou méthodologie à apprendre. Si vous connaissez Javascript, vous savez Igaro App.'
        });

    }

};