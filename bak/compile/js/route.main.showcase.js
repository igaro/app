module.requires = [
    { name:'route.main.showcase.css' },
    { name:'core.language.js' }
];

module.exports = function(app) {

    return function(model) {

        var view = model.view;

        var wrapper = view.wrapper;

        model.meta.set('title', {
	        en : 'Showcase',
	        fr : 'Vitrine'
	    });

        view.createAppend('p',wrapper,{
            en : 'Igaro App is newly released and is still gaining traction, hence this showcase is rather empty right now.',
            fr : 'Igaro App est nouvellement libéré et est toujours gagne du terrain, d\'où cette vitrine est maintenant plutôt vide.'
        });

        view.createAppend('p',wrapper,{
            en : 'If you\'ve used Igaro App for your project, <a href=\"mailto:showcase@igaro.com\">send us</a> a screenshot and a description for inclusion in this page.',
            fr : 'Si vous avez utilisé Igaro App pour votre projet, <a href=\"mailto:showcase@igaro.com\">envoyez-nous</a> une capture d\'écran et une description pour l\'inclusion dans cette page.'
        });

        view.createAppend('h1',wrapper,{
            en : 'History',
            fr : 'Histoire'
        });

        view.createAppend('p',wrapper,{
            en : 'Igaro App\'s roots began at <a href=\"http://www.binary.com\" target=\"_blank\">binary.com</a> when the author <a href=\"http://www.andrewcharnley.com\" target=\"_blank\">Andrew Charnley</a> began working on the companies mobile product.',
            fr : 'Les racines de Igaro Application commencé à <a href=\"http://www.binary.com\" target=\"_blank\"> binary.com </ a> lorsque l\'auteur <a href=\"http://www.andrewcharnley.com \"target=\"_blank\"> Andrew Charnley </a> a commencé à travailler sur le produit mobile de sociétés.'
        });

        view.createAppend('p',wrapper,{
            en : 'While Phonegap was an established method for serving a product, the YetAnotherJS frameworks were all working around a
problem that needed not exist; trying to make a website behave like an app. The author chose to build his own; a framework
that threw HTML and templating out, and resorted to pure Javascript and SASS.',
            fr : 'Alors que PhoneGap est une méthode établie pour servir un produit, les cadres de YetAnotherJS travaillaient tous autour d\'une 
problème sur lequel il n\'existait pas; essayer de faire un site web se comporter comme une application. L\'auteur a choisi de construire son propre; un cadre 
qui a jeté HTML et structurant sur​​, et eu recours à pur Javascript et des SASS.'
        });

        view.createAppend('div',wrapper,null,'binarycom');

    };
};