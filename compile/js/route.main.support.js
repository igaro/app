module.requires = [
    { name: 'route.main.support.css' },
    { name:'core.language.js' }
];

module.exports = function(app) {

    return function(model) {

        var view = model.view;

        var wrapper = view.wrapper;
        var events = model.events;

        model.meta.set('title', {
	        en : 'Support',
	        fr : 'Soutien'
	    });

        view.createAppend('p',wrapper,{
            en : 'Igaro App is supported by a small but growing amount of developers who will do their best to answer your questions.',
            fr : 'Igaro App est soutenue par un nombre restreint mais croissant montant de développeurs qui feront de leur mieux pour répondre à vos questions.'
        });

        var inbut = view.createAppend('p',wrapper);
        new Array(
            { 
                'value' : {
                    en : 'Report Issue',
                    fr : 'Rapport émission'
                },
                'url' : 'https://github.com/igaro/igaro/issues'
            },
            {
                'value' : {
                    en : 'Offer Suggestions',
                    fr : 'Offrez Suggestions'
                },
                'url' : 'https://trello.com/igaro'
            }
        ).forEach(function (n) {
            view.createAppend('button',inbut,n.value).addEventListener('click', function() {
                window.open(n.url);
            });
        });

        view.createAppend('h1',wrapper,{
            en : 'Newsgroup / Forum'
        });

        view.createAppend('p',wrapper,{
            en : 'Until Igaro API is up and running we\'re using a <a href=\"https://groups.google.com/d/forum/igaro-app\" target=\"_blank\">google group</a>.',
            fr : 'Jusqu\'à API Igaro est en marche, nous n\'en utilisant un <a href=\"https://groups.google.com/d/forum/igaro-app\" target=\"_blank\">google group</a>.'
        });

        view.createAppend('p',wrapper,{
            en : '<a href=\"http://stackoverflow.com\">stackoverflow</a> is also a good source for help. Be sure to include \'Igaro App\' in your title!.',
            fr : '<a href=\"http://stackoverflow.com\"> stackoverflow </ a> est également une bonne source pour de l\'aide. N\'oubliez pas d\'inclure \"Igaro App\" dans votre titre!.'
        });

        view.createAppend('h1',wrapper,'IRC');

        view.createAppend('p',wrapper,{
            en : 'The <b>Freenode #igaro</b> channel is used by the developers to bounce around new ideas.',
            fr : 'Le <b>Freenode #igaro</b> canal est utilisé par les développeurs pour rebondir autour de nouvelles idées.'
        });

        view.createAppend('p',wrapper,{
            en : 'If nobody is around ask your question and check back later for a reply.',
            fr : 'Si personne n\'est là poser votre question et revenez plus tard pour une réponse.'
        });

        view.createAppend('h1',wrapper,{
            en : 'Priority Service',
            fr : 'Service Prioritaire'
        });

        view.createAppend('p',wrapper,{
            en : 'The priority service is offered to those requiring a guaranteed service level. To join, email your requirements to <a href=\"mailto:support.priority.join@igaro.com\">support.priority.join@igaro.com</a>',
            fr : 'Le service prioritaire est offert à ceux qui ont besoin d\'un niveau de service garanti. Pour vous inscrire, envoyer un courriel à vos besoins à <a href=\"mailto:support.priority.join@igaro.com\">support.priority.join@igaro.com</a>'
        });

        view.createAppend('p',wrapper,{
            en : 'Priority service members receive a unique email address and a response within a pre-agreed time frame.',
            fr : 'Membres prioritaires de services reçoivent une adresse électronique unique et une réponse dans un délai convenu à l\'avance.'
        });

    }

};
