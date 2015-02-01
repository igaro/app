module.requires = [
    { name: 'route.main.design.css' },
    { name: 'core.language.js' }
];

module.exports = function(app) {

    return function(model) {

        var view = model.view;
        var wrapper = view.wrapper;

        model.meta.set('title', {
            en : 'Design',
            fr : 'Désign'
        });

        view.createAppend('p',wrapper,{
            en : "The design you choose to use for your app is flexible, \
but out the box Igaro App offers well structured SCSS and folders to store your content. \
This doesn't mean you must accept, can't modify, or throw the default \
convention used in the App out the window.", 
            fr : "La conception que vous choisissez d'utiliser pour votre \
application est flexible, mais la boîte Igaro App propose des SCSS \
et des dossiers bien structuré pour stocker votre contenu. \
Cela ne signifie pas que vous devez accepter, ne pouvez pas modifier ou \
jeter la convention par défaut par la fenêtre." 
        });

        view.createAppend('h1',wrapper,{
            en : 'Controller-Model-View (MVC)'
        });

        view.createAppend('p',wrapper,{
            en : 'Igaro App contains a controller module responsible for providing navigation. \
Upon load it instantiates a model object as root. \
A model object stores data, provides management, and instantiates child models, and \
thus a hierarchical and inheritable structure of \'panes\' is born. \
A pane contains a view and a view contains DOM elements.',
            fr : 'Igaro App contient un module chargé de fournir la navigation du contrôleur. \
À charge, il instancie un objet de modèle en tant que root. \
Un objet de modèle de données stocke, assure la gestion, et instancie les modèles enfant, et \
ainsi une structure hierarcical et héréditaire de vitres est né. \
Un volet contient une vue et une vue contient des éléments DOM.'
        });

        var d = view.createAppend('p',view.createAppend('div',wrapper,null,'viewblock'),'1');
        view.createAppend('div',d,'1.1');
        view.createAppend('div',d,'1.2');

        view.createAppend('p',wrapper,{
            en : 'By default a view is appended to the parent container and fellow siblings are hidden.Model and view are cached so if the user navigates to a different view outside of the current hierarchy they can return to it later and be at the same state.',
            fr : 'Par défaut, une vue est ajouté au conteneur parent et la fratrie sont cachés. Modèle et vue sont mises en cache si l\'utilisateur accède à un point de vue différent en dehors de la hiérarchie actuelle, ils peuvent revenir plus tard et être en même état​​.'
        });

        view.createAppend('h2',wrapper,{
            en : 'Routes'
        });     

        view.createAppend('p',wrapper,{
            en : 'A router system provides the MVC framework with the location of data needed for model and view creation.',
            fr : 'Un système de routeur fournit le framework MVC avec l\'emplacement des données nécessaires pour le modèle et création de la vue.'
        }); 

        view.createAppend('p',wrapper,{
            en : 'The router can be configured with multiple sources and can fetch routes on demand. \
The app you are currently using has routes defined through modules routes.*, while infrequent and larger routes  \
fetched on demand either from the local filesystem or via a url.',
            fr : 'Le routeur peut être configuré avec de multiples sources et peut aller chercher des itinéraires sur demande. \
L\'application que vous utilisez actuellement a itinéraires définis par modules routes.*, Alors que les routes rares et les plus lourds sont récupérés à la demande soit du système de fichiers local ou via une URL.'
        });  

        view.createAppend('p',wrapper,{
            en : 'The router can also query an API for it\'s data, which adds access control and dynamic content. Igaro API is a provider of this service.',
            fr : 'Le routeur peut également interroger une API pour ses données, ce qui ajoute le contrôle d\'accès et le contenu dynamique. Igaro API est un fournisseur de ce service.'
        }); 

        view.createAppend('h1',wrapper,{
            en : 'Containers & Wrappers',
            fr : 'Conteneurs et Emballages'
        });             

        view.createAppend('p',wrapper,{
            en : 'The root element from an instantiated module (instance.*) is typically stored on the instance as instance.container. \
On instantiating the module you can pass a parent element through a key called \'container\' into which the instance will append it\'s container once it becomes ready. \
If you use view.instance.add within the MVC framework to add the instance it\'s element will append into the correct place on your container regardless of whether further elements have since appended into it.',
            fr : 'L\'élément racine à partir d\'un module instancié (instance. *) sont généralement stockées sur l\'instance que instance.container. \
Sur l\'instanciation du module, vous pouvez passer d\'un élément parent par une clé appelée "conteneur" dans lequel l\'instance ajoutera son conteneur une fois qu\'il est prêt. \
Si vous utilisez view.instance.add dans le cadre MVC pour ajouter l\'instance c\'est élément va ajouter dans le bon endroit sur votre récipient indépendamment du fait que d\'autres éléments ont depuis ajouté en elle.'
        }); 

        view.createAppend('p',wrapper,{
            en : 'A wrapper element can usually be found inside a container. \
For the MVC framework, wrapper\'s mostly contain the DOM elements to be displayed for the pertaining view, while child views go into the container directly.',
            fr : 'Un élément wrapper se trouve généralement dans un conteneur. \
Pour le framework MVC, emballage de la plupart contiennent les éléments DOM à afficher pour la vue relative, alors que les opinions de l\'enfant vont directement dans le récipient.'
        }); 

        view.createAppend('h1',wrapper,{
            en : 'No Templates',
            fr : 'Pas Modèles'
        });             

        view.createAppend('p',wrapper,{
            en : 'Igaro App has no template engine but instead works directly on the DOM. ',
            fr : 'Igaro App n\'a pas de moteur de modèle mais fonctionne directement sur le DOM.'
        });    

        view.createAppend('h1',wrapper,{
            en : 'DOM'
        });   

        view.createAppend('p',wrapper,{
            en : 'Igaro App carefully manages DOM elements ensuring the app performs well regardless of how much content and features are added.',
            fr : 'Igaro App gère soigneusement les éléments DOM assurant l\'application se comporte bien, indépendamment de la quantité de contenu et de fonctionnalités sont ajoutées.'
        });   

        view.createAppend('h2',wrapper,{
            en : 'Goodbye .getElementById, .getElementsByClassName, .getElementsByTagName and .querySelector[all]',
            fr : 'Au revoir .getElementById, .getElementsByClassName, .getElementsByTagName et .querySelector[all]'
        });   

        view.createAppend('p',wrapper,{
            en : 'These slow traversal routines are applicable when references to DOM elements must be sought. With Igaro App this is not the case, as references are stored within instances and the MVC framework.',
            fr : 'Ces routines de parcours lents sont applicables lorsque les références aux éléments DOM doivent être recherchées. Avec Igaro App ce n\'est pas le cas, car les références sont stockées au sein des instances et le framework MVC.'
        });   

        view.createAppend('h2',wrapper,null,'classid');   

        view.createAppend('h2',wrapper,{
            en : 'Append & Removal',
            fr : 'Ajouter et Enlèvement'
        });   

        view.createAppend('p',wrapper,{
            en : 'Rather than hiding DOM elements, Igaro App removes unseen elements from the DOM and reinserts them when they need to be shown. The browser doesn\'t need to consider them in it\'s rendering, which improves performance.',
            fr : 'Plutôt que de se cacher des éléments DOM, Igaro App supprime des éléments invisibles de la DOM et les réinsère quand ils ont besoin d\'être démontré. Le navigateur n\'a pas besoin d\'en tenir compte dans cette prestation, qui améliore les performances.'
        });   

        view.createAppend('p',wrapper,{
            en : 'See this for yourself by using the DOM inspector of your browser as you use this app.',
            fr : 'Voir par vous-même en utilisant l\'inspecteur DOM de votre navigateur que vous utilisez cette application.'
        });   

        view.createAppend('h1',wrapper,{
            en : 'Animation'
        });  

        view.createAppend('p',wrapper,{
            en : 'Igaro App includes minimalistic CSS3 based animation to either show an operation is in progress or to make an object appear as if it belongs to or comes from another. For the MVC framework, a counter on the view allows you to set animation parameters based on how many times the view has been visited.',
            fr : 'Igaro App comprend minimaliste animation basée CSS3 soit montrer une opération est en cours ou pour faire apparaître un objet comme si elle appartient ou provient d\'un autre. Pour le framework MVC, un compteur sur la vue vous permet de définir les paramètres d\'animation basé sur combien de vue a été visité.'
        });  

        view.createAppend('p',wrapper,{
            en : 'Animation which serves only to irritate has been omitted. Customing animation is simple, but Igaro App\'s removal (instead of hiding of) DOM elements prevents animating elements as they disappear.',
            fr : 'Animation qui ne sert qu\'à irriter a été omis. Customing animation est simple, mais le retrait de Igaro App (au lieu de se cacher des) éléments DOM empêche éléments qui les animent comme ils disparaissent.'
        });  

    };

};
