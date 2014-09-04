module.requires = [
    { name: 'route.main.mobile.css' },
    { name: 'instance.navigation.js' },
    { name: 'core.language.js'}
];

module.exports = function(app) {

    return function(model) {

        var view = model.view;
        var wrapper = view.wrapper;

        model.meta.set('title', {
            en : 'Deploy',
            fr : 'Communauté'
        });

        var l = {
            'ios' : { 
                en : 'IOS'
            },
            'android' : {
                en : 'Android'
            },
            'wm' : {
                en : 'Windows Mobile'
            }
        };

        view.createAppend('p',wrapper,{
            en : 'Igaro App uses the same codebase for all environments with optional loading of additional components to enhance the user experience.',
            fr : 'Igaro App utilise le même code de base pour tous les environnements avec charge facultative des composants supplémentaires pour améliorer l\'expérience utilisateur.'
        });

        view.createAppend('h1',wrapper,{
            en : 'Web Server',
            fr : 'Serveur Web'
        });

        view.createAppend('p',wrapper,{
            en : 'Igaro App requires no CGI access - it\'s simply a collection of static files. It serves well through Apache, NGinx, IIS or NodeJS.',
            fr : 'Igaro App nécessite pas d\'accès CGI - c\'est simplement une collection de fichiers statiques. Il sert bien par Apache, Nginx, IIS ou NodeJS.'
        });

        view.createAppend('h1',wrapper,{
            en : 'Removable Media',
            fr : 'Support Amovible'
        });

        view.createAppend('p',wrapper,{
            en : 'Igaro App is compiled into a single folder which will serve from any web server or a USB stick via it\'s single index.html file.',
            fr : 'Igaro App est compilé dans un seul dossier qui servira de n\'importe quel serveur web ou une clé USB via son fichier index.html unique.'
        });

        view.createAppend('h1',wrapper,{
            en : 'Mobile Platforms',
            fr : 'Plate-forme Mobile'
        });

        view.createAppend('p',wrapper,{
            en : 'Igaro App comes ready to deploy to mobile devices and by default it automatically loads cordova and fastclicks.',
            fr : 'Igaro App est prêt à déployer des appareils mobiles et par défaut, il charge automatiquement cordova et fastclicks.'
        });

        view.createAppend('div',wrapper,null,'cordova');

        view.createAppend('p',wrapper,{
            en : 'Simply install <a href="http://phonegap.com/install/" target="_blank">Phonegap</a> and follow the instructions below.',
            fr : 'Il suffit d\'installer <a href="http://phonegap.com/install/" target="_blank">Phonegap</a> et suivez les instructions ci-dessous.'
        });

        var ul = view.createAppend('ul',view.createAppend('p',wrapper));
        [
            {
                en : 'Within your console, navigate to <b>/igaro/git/phonegap</b>',
                fr : 'Au sein de votre console, accédez à <b>/igaro/git/phonegap</b>'
            },
            {
                en : 'Install the <a href="http://docs.phonegap.com/en/edge/guide_platforms_index.md.html">platforms</a> that you wish to support.',
                fr : 'Installez les plates-formes <a href="http://docs.phonegap.com/en/edge/guide_platforms_index.md.html"></a> que vous souhaitez soutenir.'
            },
            {
                en : 'Deploy onto your device or emulator with <b>phonegap run [ios][android][firefoxos]</b>. Note that by default the www folder contains files symlinked to the output/debug folder. You will want to change to output/deploy when ready to release the app.',
                fr : 'Déployer sur votre appareil ou émulateur avec <b>phonegap terme [ios] [Android] [firefoxos]</b>. Notez que par défaut, le répertoire www contient les fichiers des liens symboliques dans le output/debug de débogage. Vous aurez envie de changer de output/deploy lorsque vous êtes prêt à libérer l\'application.'
            },
            {
                en : 'Customise Phonegap screens and icons within the same folder.',
                fr : 'Personnalisez les écrans et les icônes PhoneGap dans le même dossier.'
            }
        ].forEach(function (n) { view.createAppend('li',ul,n) });

        var p = view.createAppend('p');

        new app['instance.navigation']({
            container:wrapper,
            type:'tabs',
            pool: new Array(
                {
                    id:'android',
                    title : {
                        en : 'Android'
                    }
                },
                {
                    id:'ios',
                    title : {
                        en : 'Ios'
                    }
                },
                {
                    id:'wm',
                    title : {
                        en : 'Windows Mobile'
                    }
                }
            ).map(function (o) {
                var d = view.createAppend('div',null,null,o.id);
                return {
                    title:o.title,
                    onClick: function() {
                        if (p.firstChild) p.removeChild(p.firstChild);
                        p.appendChild(d);
                        this.setStatus('active');
                    }, 
                };
            })

        }).menu.options[0].li.click();
        wrapper.appendChild(p);
    };

};
