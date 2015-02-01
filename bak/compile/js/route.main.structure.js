module.requires = [
    { name:'route.main.structure.css' },
    { name:'core.language.js' }
];

module.exports = function(app) {

    return function(model) {

        var view = model.view;

        var wrapper = view.wrapper;

        model.meta.set('title', {
            en : 'Structure',
            fr : 'Structure'
        });

        view.createAppend('p',wrapper,{
            en : 'The Igaro App git repository contains three key folders; <b>compile</b>, <b>phonegap</b> and <b>output</b>.',
            fr : 'Le dépôt git Igaro App contient trois dossiers clés; <b>compilation </b>, <b>phonegap</b> et <b>sortie</b>.'
        });

        view.createAppend('div',wrapper,null,'root');

        view.createAppend('h1',wrapper,'output');

        view.createAppend('p',wrapper,{
            en : 'This folder contains two folders, /deploy, which contains code ready for inclusion on a web server and CDN, and /debug, which contains the raw js sources required for testing and debugging. \
Inside these folders is a cdn folder which can live anywhere you so choose and a filename index.html. This file defines where the cdn folder lives. \
and loads the main javascript library and displays errors that occur during the initial load.',
            fr : 'Ce dossier contient deux dossiers, /deploy, qui contient le code prêt à être inclus sur un serveur web et CDN, et /debug, qui contient les sources js premières nécessaires pour les tests et le débogage. \
Dans ces dossiers est un dossier cdn qui peut vivre n\'importe où vous le souhaitez et un nom de fichier index.html. Ce fichier définit où le dossier cdn vit. \
et charge les bibliothèques javascript et affiche principales erreurs qui se produisent lors de la charge initiale.'
        });

        view.createAppend('h2',wrapper,'js/css');

        view.createAppend('p',wrapper,{
            en : 'Grunt and Compass compress your code into these folders.',
            fr : 'Grunt et Compass compresser votre code dans ces dossiers.'
        });

        view.createAppend('h1',wrapper,'compile');

        view.createAppend('p',wrapper,{
            en : 'Within this folder are several subfolders, the important two being <b>js</b> and <b>css</b>.',
            fr : 'Dans ce dossier, plusieurs sous-dossiers, les deux étant importante <b>js</b> et <b>css</b>.'
        });

        view.createAppend('div',wrapper,null,'cssjs');

        view.createAppend('h2',wrapper,'css');

        view.createAppend('p',wrapper,{
            en : 'This folder contains the stylesheets used by the application, the name of which typically corresponds to the module. \
Igaro App uses classes over id\'s for inheritance and because classes use fullstops the fullstops in module names are replaced with a hyphen \
(this will make more sense if you look at one of the files inside this folder). \
Compass can base64 encode images into the css and generally the subfolders here generally contain such files. \
igaro.scss contains the initial style for the body, loader and error output. It doesn\'t necessarily have anything to do with the actual style of the main application, which will load other stylesheets depending on the modules utilised.',
            fr : 'Ce dossier contient les feuilles de style utilisées par l\'application, le nom correspond généralement au module. \
Igaro App utilise des classes sur l\'identifiant de l\'héritage et parce que les classes utilisent fullstops les fullstops noms de modules sont remplacés par un trait d\'union \
(ce qui fera plus de sens si vous regardez l\'un des fichiers à l\'intérieur de ce dossier). \
Compass peuvent base64 encoder les images dans le css et généralement les sous-dossiers ici contiennent généralement ces fichiers. \
igaro.scss contient le modèle initial pour le corps, d\'une chargeuse et la sortie d\'erreur. Il ne doit pas nécessairement quelque chose à voir avec le style actuel de l\'application principale, qui sera charger d\'autres feuilles de style en fonction des modules utilisés.'
        });

        view.createAppend('h2',wrapper,'js');

        view.createAppend('p',wrapper,{
            en : 'Within this folder is a filename igaro.js. This loads the AMD module, passes lists of the module files that your application uses, handles error events and reports progress back to the user. \
At the top you\'ll see the location of the subdomain of the module files, which may seem odd, given the modules are in sub-directories, \
but is required because the AMD loader can load from external locations \
and the app isn\'t necessarily sitting on window.location.href. \
If it is, or you\'re bundling on a device rather than over the web, then it\'s fine to use a relative path instead.',
            fr : 'Dans ce dossier, est un nom de fichier igaro.js. Cette charge le module AMD, passe listes des fichiers de module que votre application utilise, gère les événements d\'erreur et l\'évolution des rapports à l\'utilisateur. \
En haut, vous verrez l\'emplacement du sous-domaine des fichiers de module, ce qui peut sembler étrange, puisque les modules sont dans les sous-répertoires, \
mais est nécessaire car le chargeur peut charger AMD à partir d\'emplacements externes \
et l\'application n\'est pas nécessairement assis sur window.location.href. \
Si c\'est le cas, ou si vous êtes le regroupement sur ​​un dispositif plutôt que sur le web, alors il est bon d\'utiliser un chemin relatif à la place.'
        });

        view.createAppend('p',wrapper,{
            en : 'Next are the module files, grouped by type. \
The javascript group requires a bit more intelligence as some modules require others to load first. \
When you add modules or no longer require them you can add or comment out there inclusion here. \
The remaining part of the file offers error control and fires a loaded event.',
            fr : 'Viennent ensuite les fichiers de module, regroupés par type. \
Le groupe javascript nécessite un peu plus d\'intelligence que certains modules nécessitent d\'autres à se charger en premier. \
Lorsque vous ajoutez des modules ou n\'en ont plus besoin, vous pouvez ajouter ou commenter là-bas inclusion ici. \
La partie restante du fichier offre un contrôle d\'erreur et déclenche un événement chargé.'
        });

        view.createAppend('h3',wrapper,{
            en : 'Module Files',
            fr : 'Fichiers Module'
        });

        view.createAppend('p',wrapper,{
            en : 'When a module is read into the system any errors are trapped and handled.',
            fr : 'Lorsqu\'un module est lu dans le système d\'erreurs sont piégés et manipulés.'
        });

        view.createAppend('p',wrapper,{
            en : 'A module may export a function into <b>module.exports</b>. \
The function is passed a reference to the app, parameters passed when the app began (useful for defaults or overriding), and callback routines (onCompletion, onError)<sup>1</sup>. \
This function normally exports data into the app reference using the module name and afterwards returns true to indicate it has completed, otherwise it must trigger the callback routine<sup>1</sup> to complete the module load \
(this is rarely required but a module may need to fetch resources before it can be utilised).',
            fr : 'Un module peut exporter une fonction dans <b>module.exports </b>. \
La fonction est passée d\'une référence à l\'application, les paramètres passés lorsque l\'application a commencé (utile pour les valeurs par défaut ou dominante), et des routines de rappel (onCompletion, onError) <sup>1</sup>. \
Cette fonction exporte normalement données dans la référence de l\'application en utilisant le nom du module et retourne après true pour indiquer qu\'il a terminé, sinon il doit déclencher la routine de rappel <sup>1</sup> pour compléter la charge du module \
(ce qui est rarement nécessaire, mais un module peut avoir besoin d\'aller chercher des ressources avant de pouvoir être utilisé).'
        }); 

        view.createAppend('p',wrapper,{
            en : 'A module may define a list of dependencies using <b>module.requires</b>, \
and if so the calling of <b>module.exports</b> will delay until this list is processed.',
            fr : 'Un module peut définir une liste des dépendances à l\'aide <b>module.requires</b>, \
et si oui, l\'appel de <b>module.exports</b> va retarder jusqu\'à ce que cette liste est traitée.'
        });

        view.createAppend('h3',wrapper,'core.*');

        view.createAppend('p',wrapper,{
            en : 'Core files are libraries, never to be instantiated, and provide global functionality. \
Functionality specific to the App instance should be added as a new core file. \
Core files are usually required by other modules (such as routes) and shouldn\'t contain language. \
A general list of key core files is loaded when the App starts. \
Core files shouldn\'t output to the DOM.',
            fr : 'Fichiers de base des bibliothèques, de ne jamais être instanciés, et fournissent des fonctionnalités mondiale. \
Des fonctionnalités spécifiques à l\'instance App devrait être ajoutée comme un nouveau fichier de base. \
Fichiers de base sont généralement tenus par d\'autres modules (comme les routes) et ne doivent pas contenir de propos. \
Une liste générale des fichiers de base de clés est chargé lorsque l\'application démarre. \
Fichiers de base ne devrait pas sortie de la DOM.'
        });

        view.createAppend('h3',wrapper,'conf.*');

        view.createAppend('p',wrapper,{
            en : 'These files configure the core and may bridge events to one another. Conf files don\'t provide functionality and don\'t output to the DOM.',
            fr : 'Ces fichiers configurent le noyau et peuvent combler les événements à l\'autre. Conf ne fournissent pas de fonctionnalités et n\'émettent pas au DOM.'
        });

        view.createAppend('h3',wrapper,'route.*');

        view.createAppend('p',wrapper,{
            en : 'These files provide MVC model and view data.',
            fr : 'Ces fichiers MVC modèle et afficher les données.'
        });

        view.createAppend('h3',wrapper,'route-ext.*');

        view.createAppend('p',wrapper,{
            en : 'These files provide additional route data to be loaded upon request. This reduces initial load time.',
            fr : 'Ces fichiers fournissent des données de route supplémentaires pour être chargés sur demande. Cela réduit le temps de chargement initial.'
        });


        view.createAppend('h3',wrapper,'instance.*');

        view.createAppend('p',wrapper,{
            en : 'These files provide a single function to be instantiated. \
The instance may manage a feature embedded into the view of the App (i.e if you were to put a slideshow into your App) or may provide an instance of functionality, such as an XHR.',
            fr : 'Ces fichiers fournissent une fonction unique pour être instancié. \
L\'instance peut gérer une fonctionnalité intégrée dans la vue de l\'application (par exemple, si vous deviez mettre un diaporama dans votre App) ou peut fournir un exemple de fonctionnalité, comme un XHR.'
        });

        view.createAppend('h3',wrapper,'service.*');

        view.createAppend('p',wrapper,{
            en : 'A service module watches particular events and takes action when they fire. \
Unlike a core file, a service module rarely provides callable functionality.',
            fr : 'Un module de service montres événements particuliers et prend des mesures quand ils tirent. \
Contrairement à un fichier de base, un module de service fournit rarement des fonctionnalités appelable.'
        });      

        view.createAppend('h3',wrapper,'polyfix.*');

        view.createAppend('p',wrapper,{
            en : 'Generally Igaro App requires Internet Explorer 10 and later, which roughly translates to Javascript 1.8.5. \
The polyfix files prototype missing Javascript functionality for older web browsers. \
Note that this can\'t work around limitations such as CORS on IE8/9 or the lack of CSS3 on IE8. \
Igaro App modules may version check when loaded by the AMD loader and may signal an abort if requirements aren\'t met. \
Polyfix files should be loaded by the index.html file not by the AMD loader.',
            fr : 'Généralement Igaro App nécessite Internet Explorer 10 et plus tard, ce qui se traduit à peu près à Javascript 1.8.5. \
Les fichiers Polyfix prototypes manquant fonctionnalité Javascript pour les anciens navigateurs. \
Notez que cela ne peut pas contourner les limitations telles que la SCRO sur IE8 / 9 ou le manque de CSS3 sur IE8. \
Modules Igaro Application peuvent vérification de version quand il est chargé par le chargeur AMD et peuvent signaler un abandon si ces exigences ne sont pas remplies. \
Fichiers Polyfix doivent être chargés par le fichier index.html pas par le chargeur AMD.'
        });  

        view.createAppend('h3',wrapper,'3rdparty.*');

        view.createAppend('p',wrapper,{
            en : 'Modules and libraries provided by 3rd parties are placed here. Igaro App allows you to utilise any Javascript code in your app.',
            fr : 'Modules et des bibliothèques fournies par 3e parties sont placés ici. Igaro App vous permet d\'utiliser n\'importe quel code Javascript dans votre application.'
        });  

        view.createAppend('h1',wrapper,'phonegap');

        view.createAppend('p',wrapper,{
            en : 'There\'s a Phonegap project in this folder. Igaro App comes ready to deploy to mobile devices.',
            fr : 'Il ya un projet PhoneGap dans ce dossier. Igaro App est prêt à déployer pour les appareils mobiles.'
        });  

    };

};
