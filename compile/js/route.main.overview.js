module.requires = [
	{ name: 'route.main.overview.css' },
    { name: 'core.language.js' }
];

module.exports = function(app) {

   	return function(model) {

        var view = model.view, wrapper = view.wrapper, events = model.events;

        model.meta.set('title', {
	        en : 'Overview',
	        fr : 'Perspicacité'
	    });

	    view.createAppend('p',wrapper,{
            en : 'Igaro App blurs the distinction between a website and a mobile variant by deploying a scalable, responsive and dynamic app into multiple environments.',
            fr : 'Igaro App brouille la distinction entre un site Web et une variante mobile en déployant une application évolutive, souple et dynamique dans de multiples environnements.'
        });

	    view.createAppend('p',wrapper,{
            en : 'Utilising pure Javascript and SASS, a developer needn\'t learn about data binding and templating - because there are none! There\'s no HTML either!',
            fr : 'Utilisant pur Javascript et SASS, un développeur n\'a pas besoin d\'en apprendre davantage sur la liaison de données et de gabarits - car il n\'y en a pas! Il n\'y a pas HTML soit!'
        });

        view.createAppend('p',wrapper,{
            en : 'Igaro App comes with XHR, AMD, Promises, Event Management, Locale and many more modules. It\'s as ready as you are, plus you can use all your current Javascript code.',
            fr : 'Igaro App est livré avec XHR, AMD, promesses, Gestion d\'événements, Locale et beaucoup plus de modules. C\'est aussi prêt que vous êtes, plus vous pouvez utiliser tout le code Javascript actuelle.'
        });

        view.createAppend('h1',wrapper,{
            en : 'For',
            fr : 'Pour'
        });

        view.createAppend('div',wrapper,null,'viewport');

        view.createAppend('p',wrapper,{
            en : 'Igaro App can be served from a web server and ran as a single page application, distributed through an app store, or bundled on removeable media.',
            fr : 'Igaro App peut être servi à partir d\'un serveur Web et a couru comme une seule demande de la page, distribué par un App Store, ou livré sur support amovible.'
        });

        view.createAppend('h2',wrapper,{
            en : 'Websites',
            fr : 'Sites'
        });

        view.createAppend('p',wrapper,{
            en : 'Dramatically lighten your server load by shifting processing to the client. Keeping your data separate, Igaro App renders content using the renown MVC architecture.',
            fr : 'Considérablement alléger la charge du serveur en déplaçant le traitement au client. Garder vos données séparé, Igaro App affiche le contenu en utilisant la renommée architecture MVC.'
        });

        view.createAppend('p',wrapper,{
            en : 'Impress app qualities upon your users for enhanced speed, reliability and an excellent user experience.',
            fr : 'Impressionnez qualités d\'applications sur vos utilisateurs pour une meilleure vitesse, la fiabilité et une excellente expérience utilisateur.'
        });

        view.createAppend('h2',wrapper,{
            en : 'Mobile'
        });

        view.createAppend('p',wrapper,{
            en : 'Igaro App utilises open-source Cordova (Phonegap) and deploys to iOS, Android and Windows Mobile.',
            fr : 'Igaro App utilise open-source Cordova (PhoneGap) et se déploie sur iOS, Android et Windows Mobile.'
        });

        view.createAppend('p',wrapper,{
            en : 'It scales to different viewports and uses CSS media selectors to adjust how content is displayed.',
            fr : 'Il s\'adapte aux différentes fenêtres et utilise les sélecteurs de médias CSS pour régler comment le contenu est affiché.'
        });

        view.createAppend('h1',wrapper,{
            en : 'Development',
            fr : 'Développement'
        });

        view.createAppend('p',wrapper,{
            en : 'Avoid the pitfalls of poor programming by following a beautifully designed framework.',
            fr : 'Éviter les pièges d\'une mauvaise programmation en suivant un cadre magnifiquement conçu.'
        });

        view.createAppend('p',wrapper,{
            en : 'Igaro App\'s infrastructure is loosely coupled, modular and object-oriented, and the very latest technologies and practices are employed throughout.',
            fr : 'Infrastructure Figaro Apps est faiblement couplés, modulaire et orientée objet, et les dernières technologies et les pratiques peuvent être employés partout.'
        });

        view.createAppend('p',wrapper,{
            en : 'Igaro App comes with built-in error control, recovery and reporting.',
            fr : 'Igaro App est livré avec contrôle d\'erreur intégré, la récupération et le reporting.'
        });

        view.createAppend('h2',wrapper,{
            en : 'Standards',
            fr : 'Normes'
        });

        view.createAppend('p',wrapper,{
            en : 'Igaro App uses standard EC5 Javascript. No external frameworks (aka JQuery) are required.',
            fr : 'Igaro App utilise la norme EC5 Javascript. Pas de cadres externes (aka JQuery) sont nécessaires.'
        });

        view.createAppend('p',wrapper,{
            en : 'Grunt and Compass (SASS) are used to automatically compress your Javascript and CSS ready for release.',
            fr : 'Grunt et Compass (SASS) sont utilisés pour compresser automatiquement votre Javascript et CSS prêt à sortir.'
        });

        view.createAppend('h1',wrapper,{
            en : 'Data',
            fr : 'Données'
        });

        view.createAppend('p',wrapper,{
            en : 'Data and resources can be bundled and requested from an external API.',
            fr : 'Les données et les ressources peuvent être regroupées et ont demandé à partir d\'une API externe.'
        });

        view.createAppend('p',wrapper,{
            en : 'Caching and storage routines are used to minimize connection overheads.',
            fr : 'Mise en cache et de stockage routines sont utilisés pour minimiser les frais généraux de connexion.'
        });

        view.createAppend('p',wrapper,{
            en : 'Igaro App smartly handles internet connectivity issues.',
            fr : 'Igaro App gère intelligemment les problèmes de connectivité Internet.'
        });

        view.createAppend('h1',wrapper,{
            en : 'Security',
            fr : 'Sécurité'
        });

        view.createAppend('p',wrapper,{
            en : 'With no public variables, Igaro App is sandboxed from rogue javascript injection.',
            fr : 'En l\'absence de variables publiques, Igaro App est en sandbox de voyous javascript injection.'
        });

        view.createAppend('p',wrapper,{
            en : 'Use Igaro API to load your data and views with dynamic content and military-grade security.',
            fr : 'Utilisez Igaro API pour charger vos données et les vues avec du contenu dynamique et de la sécurité de niveau militaire.'
        });

    }
};
