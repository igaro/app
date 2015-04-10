(function() {

"use strict";

module.requires = [
    { name: 'route.main.mobile.css' }
];

module.exports = function(app) {

    return function(model) {

        var wrapper = model.wrapper,
            managers = model.managers,
            domMgr = managers.dom,
            objMgr = managers.object,
            language = app['core.language'];

        model.stash.title=_tr("Mobile");

        domMgr.mk('p',wrapper,_tr("Igaro App is mobile friendly with outstanding performance and a near native mobile app experience across all platforms."));

        domMgr.mk('h1',wrapper,_tr("Responsive Layout"));

        domMgr.mk('p',wrapper,_tr("CSS3 Media queries take into account screens of all sizes. Try changing the size of this window to that of a large screen, tablet and phone. Notice how the footer disappears and how elements such as the header change height and width depending on screen ratio? While much of the work has been done you can customize the CSS to suit your own design."));

        domMgr.mk('h1',wrapper,_tr("Embedded Resources"));

        domMgr.mk('p',wrapper,_tr("Images and fonts are compiled into CSS making them available immediately. You can choose to load resources traditionally by editing the SASS files."));

        domMgr.mk('button',wrapper,_tr("Demo")).addEventListener('click', function() {
            domMgr.mk('div',{ insertBefore:this },null, function() {
                this.className = 'embeddedresdemo';
                domMgr.mk('div', this);
                domMgr.mk('img', this).src = 'http://www.igaro.com/misc/chinchilla.jpg?x='+ Math.floor((Math.random() * 999) + 1);
            });
            domMgr.rm(this);
        });

        domMgr.mk('h1',wrapper,_tr("Touch Ready"));

        domMgr.mk('p',wrapper,_tr("For touch screens the browser 300ms delay is removed. Press and hold on the shapes below to compare the difference."));

        domMgr.mk('div',wrapper,null, function() {
            this.className = 'touchdemo';
            domMgr.mk('div',this,null, function() {
                this.addEventListener('mousedown', function() {
                    this.classList.add('touched');
                });
                this.addEventListener('mouseup', function() {
                    this.classList.remove('touched');
                });
                this.addEventListener('mouseout', function() {
                    this.classList.remove('touched');
                });
            });

            domMgr.mk('div',this,null, function() {
                var timeout;
                this.addEventListener('mousedown', function() {
                    var self = this;
                    timeout = setTimeout(function() { self.classList.add('touched'); }, 300);
                });
                this.addEventListener('mouseup', function() {
                    clearTimeout(timeout);
                    this.classList.remove('touched');
                });
                this.addEventListener('mouseout', function() {
                    clearTimeout(timeout);
                    this.classList.remove('touched');
                });
            });
        });

        domMgr.mk('h1',wrapper,_tr("Gestures"));
        domMgr.mk('p',wrapper,_tr("Gesture events are available via the 3rdparty.hammer library. If you have a touch screen, try some actions in the box below."));

        return model.addSequence({

            container:wrapper,
            promises: [

                (function() {
                    if (window.Hammer) {
                        return domMgr.mk('div', null,null, function() {
                            this.className = 'gesturedemo';
                            domMgr.mk('div',this, null, function() {
                                var self = this,
                                hammertime = new Hammer(this);
                                hammertime.get('pinch').set({ enable: true });
                                hammertime.get('rotate').set({ enable: true });
                                hammertime.on('pan', function(ev) {
                                    self.className = 'pan';
                                });
                                hammertime.on('swipe', function(ev) {
                                    self.className = 'swipe';
                                });
                                hammertime.on('tap', function(ev) {
                                    self.className = 'tap';
                                });
                                hammertime.on('doubletap', function(ev) {
                                    self.className = 'doubletap';
                                });
                                hammertime.on('pinch', function(ev) {
                                    self.className = 'pinch';
                                });
                                hammertime.on('rotate', function(ev) {
                                    self.className = 'rotate';
                                });
                            });
                        });
                    }
                    return objMgr.create('pagemessage', {
                        type:'critical',
                        message : _tr("A touch screen has not been detected.")
                    });
                })(),

                objMgr.create('navigation').then(function(navigation) {
                    var c = document.createDocumentFragment();
                    domMgr.mk('h1',c,_tr("Mobile Features"));
                    domMgr.mk('p',c,language.substitute(_tr("%d is utilized to access mobile device features such as camera, accelerometer and GPS."),'<a href="http://cordova.apache.org">Apache Cordova</a>'));
                    domMgr.mk('p',c,null, function() {
                        domMgr.mk('ul',this,null, function() {
                            domMgr.mk('li',this,language.substitute(_tr("Within a terminal run %d"),'<b>cd cordova</b>'));
                            domMgr.mk('li',this,_tr("Install the platforms you wish to support."));
                            domMgr.mk('li',this,_tr("Deploy onto your device or emulator with <b>cordova run [ios][android][firefoxos]</b>. Note that by default the www folder contains files symlinked to the output/debug folder. You will want to change this to output/deploy when you are ready to release your app."));
                            domMgr.mk('li',this,_tr("Customise splashscreens and icons within the same folder."));
                        });
                    });
                    c.appendChild(navigation.container);
                    domMgr.mk('p',c);
                    var ss = domMgr.mk('div',c,null,'android');
                    return navigation.menu.addOptions([
                        {
                            id:'android',
                            title : 'Android',
                            active:true
                        },
                        {
                            id:'ios',
                            title : 'IOS'
                        }
                    ].map(function (o) {
                        o.onClick = function() { 
                            ss.className = o.id;
                            this.setActive();
                            return Promise.resolve();
                        }
                        return o;
                    })).then(function() {
                        return c;
                    });;
                })

            ]
        });

    };

};

})();
