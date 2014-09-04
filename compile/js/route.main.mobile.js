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
            en : 'Mobile',
            fr : 'Mobile'
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
            en : 'Igaro App loves mobile! It\'s outstanding performance offers users a near native mobile app experience across all platforms.',
            fr : ''
        }); 

        view.createAppend('p',wrapper,{
            en : 'Several additional modules are loaded automatically when Igaro App detects a mobile environment and/or a touch screen. These enhance user experience and provide additional features for developers.',
            fr : ''
        });

        view.createAppend('h1',wrapper,{
            en : 'Responsive (CSS3)',
            fr : 'Serveur Web'
        });

        view.createAppend('p',wrapper,{
            en : 'Media queries take into account screens of all sizes. Try changing the size of this window to that of a large screen, tablet and phone. Notice how the footer disappears and how elements such as the header change height as well as width depending on the screen ratio.',
            fr : ''
        });

        view.createAppend('h1',wrapper,{
            en : 'Embedded Resources',
            fr : 'Serveur Web'
        });

        view.createAppend('p',wrapper,{
            en : 'Images, fonts and other media are compiled into CSS so that they are available immediately.',
            fr : ''
        });

        view.createAppend('input[button]',wrapper,{
            en : 'Demo',
            fr : ''
        }).addEventListener('click', function() {
            view.createAppend('div',{ insertBefore:this },[
                document.createElement('div'),
                function () {
                    var m = document.createElement('img');
                    m.src = 'http://www.igaro.com/misc/chinchilla.jpg?x='+ Math.floor((Math.random() * 999) + 1);
                    return m;
                }
            ], 'embeddedresdemo');
            this.parentNode.removeChild(this);
        });

        view.createAppend('h1',wrapper,{
            en : 'Touch Ready (<a href="http://ftlabs.github.io/fastclick/">fastclicks.js</a>)',
            fr : ''
        });

        view.createAppend('p',wrapper,{
            en : 'The renown web-app 300ms delay is removed, giving a native app responsiveness. Press and hold on the shapes below to compare the difference.',
            fr : ''
        });

        view.createAppend('div',wrapper,[

            function() {
                var touch = document.createElement('div');
                touch.addEventListener('mousedown', function() {
                    this.classList.add('touched');
                });
                touch.addEventListener('mouseup', function() {
                    this.classList.remove('touched');
                });
                touch.addEventListener('mouseout', function() {
                    this.classList.remove('touched');
                });
                return touch;
            },

            function() {
                var touch = document.createElement('div'),
                    timeout;
                touch.addEventListener('mousedown', function() {
                    var self = this;
                    timeout = setTimeout(function() { self.classList.add('touched'); }, 300);
                });
                touch.addEventListener('mouseup', function() {
                    clearTimeout(timeout);
                    this.classList.remove('touched');
                });
                touch.addEventListener('mouseout', function() {
                    clearTimeout(timeout);
                    this.classList.remove('touched');
                });
                return touch;
            }

        ], 'touchdemo');


        view.createAppend('h1',wrapper,{
            en : 'Gestures (<a href="http://hammerjs.github.io/">hammer.js</a>)',
            fr : ''
        });

        view.createAppend('p',wrapper,{
            en : 'Swipe, pinch, tap, doubletap, rotate and pan gesture events are available. If you have a touch screen, try some actions in the box below.',
            fr : ''
        });

        if (window.Hammer) {

            var gd = view.createAppend('div',
                view.createAppend('div', wrapper, null, 'gesturedemo')
            );
            var hammertime = new Hammer(gd);
            hammertime.get('pinch').set({ enable: true });
            hammertime.get('rotate').set({ enable: true });

            hammertime.on('pan', function(ev) {
                gd.className = 'pan';
            });
            hammertime.on('swipe', function(ev) {
                gd.className = 'swipe';
            });
            hammertime.on('tap', function(ev) {
                gd.className = 'tap';
            });
            hammertime.on('doubletap', function(ev) {
                gd.className = 'doubletap';
            });
            hammertime.on('pinch', function(ev) {
                gd.className = 'pinch';
            });
            hammertime.on('rotate', function(ev) {
                gd.className = 'rotate';
            });

        } else {
            view.instances.add('pagemessage', {
                container:wrapper,
                type:'critical',
                message : { 
                    en : 'A touch screen has not been detected.',
                    fr : ''
                }
            });
        }

        view.createAppend('h1',wrapper,{
            en : 'Device Features'
        });       

        view.createAppend('p',wrapper,{
            en : 'Cordova / Phonegap is an API to access mobile device features such as camera, accelerometer and GPS.',
            fr : ''
        });        

        view.createAppend('div',wrapper,null,'cordova');

        view.createAppend('p',wrapper,{
            en : 'Simply install <a href="http://phonegap.com/install/" target="_blank">Phonegap</a> and follow the instructions below.',
            fr : 'Il suffit d\'installer <a href="http://phonegap.com/install/" target="_blank">Phonegap</a> et suivez les instructions ci-dessous.'
        });

        var ul = view.createAppend('ul',view.createAppend('p',wrapper));
        [
            {
                en : 'Within your console, navigate to <b>/igaro/git/app/phonegap</b>',
                fr : 'Au sein de votre console, accédez à <b>/igaro/git/app/phonegap</b>'
            },
            {
                en : 'Install the <a href="http://docs.phonegap.com/en/edge/guide_platforms_index.md.html">platforms</a> that you wish to support.',
                fr : 'Installez les plates-formes <a href="http://docs.phonegap.com/en/edge/guide_platforms_index.md.html"></a> que vous souhaitez soutenir.'
            },
            {
                en : 'Deploy onto your device or emulator with <b>phonegap run [ios][android][firefoxos]</b>. Note that by default the www folder contains files symlinked to the output/debug folder. You will want to change this to output/deploy when you are ready to release the app.',
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
