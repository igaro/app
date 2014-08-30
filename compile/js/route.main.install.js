module.requires = [
    { name: 'route.main.install.css' },
    { name: 'core.language.js' }
];

module.exports = function(app) {

    return function(model) {

        var view = model.view;

        var wrapper = view.wrapper;

        model.meta.set('title', {
            en : 'Install',
            fr : 'Installer'
        });

        view.createAppend('p',wrapper,{
            en : 'These instructions assume a unix, linux or mac environment with an installation of <a href=\"http://www.git-scm.com\" target=\"_blank\">Git</a>.',
            fr : 'Ces instructions supposent un unix, linux ou mac environnement avec une installation de <a href=\"http://www.git-scm.com\" target=\"_blank\">Git</a>.'
        });

        view.createAppend('p',wrapper,{
            en : 'By installing Igaro App you are agreeing to the license under which this software is distributed.',
            fr : 'En installant Igaro App vous acceptez la licence sous laquelle ce logiciel est distribué.'
        });

        var inbut = view.createAppend('p',wrapper);
        new Array(
            { 
                'name' : 'source',
                'value' : {
                    en : 'Show Source',
                    fr : 'Afficher Source'
                },
                'url' : 'https://github.com/igaro/'
            },
            {
                'name' : 'license',
                'value' : {
                    en : 'Show License',
                    fr : 'Afficher Licence'
                },
                'route' : 'license'
            }
        ).forEach(function (n) {
            var i = view.createAppend('input[button]',inbut,n.value);
            if (n.url) i.addEventListener('click', function() {
                window.open(n.url);
            });
            if (n.route) i.addEventListener('click', function() {
                 app['core.mvc'].to(model.path+'/'+n.route).then();
            });
        });

        view.createAppend('h1',wrapper,{
            en : 'Git Repository',
            fr : 'Git Dépôt'
        });

        view.createAppend('p',wrapper,{
            en : 'Run the following in a terminal.',
            fr : 'Exécutez la commande suivante dans un terminal.'
        });

        var t = view.createAppend('textarea',wrapper,
'mkdir /igaro \n\
git clone https://github.com/igaro/app.git /igaro/git --depth=1'); 
        t.readOnly=true;
        t.className='gitcode';

        view.createAppend('h1',wrapper,{
            en : 'Compile'
        });

        view.createAppend('p',wrapper,{
            en : 'The SCSS sources must be compiled into CSS. Compass and Grunt will do this for you on the fly.',
            fr : 'Les sources SCSS doivent être compilés en CSS. Compass et Grunt vont le faire pour vous à la volée.'
        });

        view.createAppend('h2',wrapper,'Compass');

        view.createAppend('p',wrapper,{
            en : 'Ensure <a href=\"http://compass-style.org\" target=\"_blank\">Compass</a> is installed.',
            fr : 'Assurer <a href=\"http://compass-style.org\" target=\"_blank\">Compass</a> est installé.'
        });

        view.createAppend('h2',wrapper,'Grunt');

        view.createAppend('p',wrapper,{
            en : 'Ensure <a href=\"http://www.npmjs.com\" target=\"_blank\">NPM</a> is installed then run the following in a terminal.',
            fr : 'Assurer <a href=\"http://www.npmjs.com\" target=\"_blank\">NPM</a> est installé puis exécutez la commande suivante dans un terminal.'
        });

        var t = view.createAppend('textarea',wrapper, 
'cd /igaro/git/app \n\
npm install \n\
compass compile -c compass-debug.rb \n\
grunt --gruntfile=grunt-debug &');
        t.readOnly=true;
        t.className='gruntcode';

        view.createAppend('h1',wrapper,{
            en : 'Run it!',
            fr : 'Lancez-le!'
        });

        view.createAppend('p',wrapper,{
            en : 'Open output/debug/index.html in your favourite web browser.',
            fr : 'Lancement <a href=\"http://igaroapp.localhost\" target=\"_blank\">http://igaroapp.localhost</a>'
        });

        view.createAppend('p',wrapper,{
            en : 'Igaro App also includes a simple NodeJS server. Choose your flavour from below.',
            fr : 'Igaro App comprend également un serveur NodeJS simple. Choisissez votre saveur de dessous.'
        });

        var p = view.createAppend('p');

        var nav = [0,1].map(function(x) { return document.createDocumentFragment() });

        view.createAppend('p', nav[0], {
            en : 'Run the following to start a debug server, then navigate to: <a href="http://localhost:3000">http://localhost:3000</a>',
            fr : 'Un gruntfile qui minifies /js de libération est utilisé pour le déploiement. Exécutez la commande suivante pour démarrer un serveur de déploiement, puis accédez à: <a href="http://localhost:3001">localhost:3001</a>'
        });
        view.createAppend('textarea',nav[0], 
'cd /igaro/git/app/nodejs-httpd\n\
node debug.js').readOnly=true;

        view.createAppend('p', nav[1], {
            en : 'A gruntfile which minifies /js for release is used for deployment. Run the following to start a deploy server, then navigate to: <a href="http://localhost:3001">localhost:3001</a>',
            fr : 'Un gruntfile qui minifies /js de libération est utilisé pour le déploiement. Exécutez la commande suivante pour démarrer un serveur de déploiement, puis accédez à: <a href="http://localhost:3001">localhost: 3001 </a>'
        });
        view.createAppend('textarea',nav[1], 
'cd /igaro/git/app\n\
compass compile -c compass-deploy.rb\n\
grunt --gruntfile=grunt-deploy &\n\
cd /igaro/git/app/nodejs-httpd\n\
node deploy.js').readOnly=true;

        new app['instance.navigation']({
            container:wrapper,
            type:'tabs',
            pool: new Array(
                {
                    id:'debug',
                    title : {
                        en : 'Debug'
                    }
                },
                {
                    id:'deploy',
                    title : {
                        en : 'Deploy',
                        fr : 'Déployer'
                    }
                }
            ).map(function (o, i) {
                var d = view.createAppend('div',null,null,o.id);
                d.appendChild(nav[i]);
                return {
                    title:o.title,
                    onClick: function() {
                        if (p.firstChild) p.removeChild(p.firstChild);
                        p.appendChild(d);
                        this.setStatus('active');
                    }, 
                };
            })

        });
        wrapper.appendChild(p);

    };

};
