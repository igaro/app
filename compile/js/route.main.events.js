module.requires = [
    { name: 'route.main.events.css' },
    { name: 'core.language.js' }
];

module.exports = function(app) {

    return function(model) {

        var view = model.view,
            wrapper = view.wrapper;
        
        model.meta.set('title', {
            en : 'Events',
            fr : 'Events'
        });

        view.createAppend('p',wrapper,{
            en : 'Igaro App runs asynchronously and employs two techniques to manage delayed notification and value convergence.',
            fr : 'Igaro App s\'exécute de manière asynchrone et utilise deux techniques pour gérer la notification tardive et la convergence de valeur.'
        });

        view.createAppend('h1',wrapper,{
            en : 'Promises',
            fr : 'Promesses'
        });

        view.createAppend('p',wrapper,{
            en : 'Igaro App uses Promises (ES6, A+) to replace callback routines. Promises allow for chainable asynchronous operation with error control.',
            fr : 'Igaro App utilise promesses (ES6, A+) pour remplacer les routines de rappel. Promesses permettent un fonctionnement asynchrone chaîne avec des contrôle d\'erreur.'
        });

        view.createAppend('h1',wrapper,{
            en : 'Event Management',
            fr : 'Gestion d\'événements'
        });

        view.createAppend('p',wrapper,{
            en : 'Promises are for objects initiating work and not for when the object wishes to be notified when another object executes the work. \
To provide this feature Igaro App uses an event management system. \
Key information is returned to each registered party including object identifiers to work out if the event is for an object of interest.',
            fr : 'Les promesses sont des objets lancement des travaux et non lorsque l\'objet souhaite être averti quand un autre objet exécute le travail. \
Pour fournir cette fonctionnalité Igaro App utilise un système de gestion des événements. \
Les informations clés est retourné à chaque parti enregistré y compris les identificateurs d\'objets de travailler si l\'événement est un objet d\'intérêt.'
        });

        view.createAppend('p',wrapper,{
            en : 'Using the event management system is straight forward, \
but the passing of references traditionally leads to memory leaks as the javascript garage \
collector wont destroy objects that are referenced. Two methods are employed to overcome this.',
            fr : 'En utilisant le système de gestion d\'événement est simple, \
mais le passage de références conduit traditionnellement à des fuites de mémoire que le garage javascript \
collecteur habitude de détruire les objets qui sont référencés. Deux méthodes sont utilisées pour surmonter ce produit.'
        });

        view.createAppend('h2',wrapper,{
            en : 'Auto Release',
            fr : 'Déclenchement Automatique'
        });

        view.createAppend('p',wrapper,{
            en : 'The event manager automatically removes nullified event functions. \
On registering to receive an event the provided callback function is stored directly, therefore nullifying it in the original location will cause it\'s reference to be removed from the event management system the next time it\'s event fires.',
            fr : 'Le gestionnaire d\'événements supprime automatiquement les fonctions d\'événements annulait. \
Lors de son inscription pour recevoir un événement de la fonction de rappel fourni est stocké directement, donc l\'annuler dans l\'emplacement d\'origine entraînera c\'est la référence à supprimer du système de gestion de cas, la prochaine fois, c\'est les feux de l\'événement.'
        });

        view.createAppend('h2',wrapper,{
            en : 'Semi Automatic Release',
            fr : 'Semi de Sortie Automatique'
        });

        view.createAppend('p',wrapper,{
            en : 'Igaro App modules that specifically destroy objects may include a wrapper to the event management \
library which additionally tracks event callbacks and releases them automatically. \
The controller.model object is one such example (providing model.events).',
            fr : 'Modules Igaro Application qui détruisent spécifiquement les objets peuvent inclure un wrapper pour la gestion d\'événements \
bibliothèque qui suit en outre les rappels d\'événements et les libère automatiquement. \
L\'objet de controller.model en est un exemple (à condition model.events).'
        });

    };

};
