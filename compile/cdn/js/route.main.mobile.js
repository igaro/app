//# sourceURL=route.main.mobile.js

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
            dom = app['core.dom'],
            language = app['core.language'];

        model.stash.title=_tr("Mobile");
        model.stash.description=_tr("Ready for all mobile devices, with outstanding performance and one codebase for all platforms.");

        domMgr.mk('p',wrapper,_tr("Igaro App is <b>100%</b> mobile ready."));

        domMgr.mk('p',wrapper,language.substitute(_tr("%[0] is utilized to access mobile device features such as camera, accelerometer and GPS."),'<a href="http://cordova.apache.org">Apache Cordova</a>'));
        domMgr.mk('p',wrapper,null, function() {
            domMgr.mk('ul',this,null, function() {
                domMgr.mk('li',this,language.substitute(_tr("Within a terminal run %[0]"),'<b>cd cordova</b>'));
                domMgr.mk('li',this,_tr("Install the platforms you wish to support."));
                domMgr.mk('li',this,_tr("Deploy onto your device or emulator with <b>cordova run [ios][android][firefoxos]</b>. Note that by default the www folder contains files symlinked to the output/debug folder. You'll want to change this to output/deploy when you are ready to release your app."));
                domMgr.mk('li',this,_tr("Customise splashscreens and icons within the same folder."));
            });
        });

        domMgr.mk('h1',wrapper,_tr("Embedding Resources"));

        domMgr.mk('p',wrapper,_tr("Compiling images and fonts into CSS reduces latency over slower networks and allows app's to perform with a native feel."));

        domMgr.mk('button',wrapper,_tr("Demo")).addEventListener('click', function() {
            domMgr.mk('div',{ insertBefore:this },null, function() {
                this.className = 'embeddedresdemo';
                domMgr.mk('div', this);
                domMgr.mk('img', this).src = 'http://www.igaro.com/misc/chinchilla.jpg?x='+ Math.floor((Math.random() * 999) + 1);
            });
            dom.rm(this);
        });

        domMgr.mk('h1',wrapper,_tr("Touch & Gestures"));

        domMgr.mk('p',wrapper,_tr("For touch screens the browser 300ms click delay is removed."));

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
                                hammertime = new window.Hammer(this);
                                hammertime.get('pinch').set({ enable: true });
                                hammertime.get('rotate').set({ enable: true });
                                hammertime.on('pan', function() {
                                    self.className = 'pan';
                                });
                                hammertime.on('swipe', function() {
                                    self.className = 'swipe';
                                });
                                hammertime.on('tap', function() {
                                    self.className = 'tap';
                                });
                                hammertime.on('doubletap', function() {
                                    self.className = 'doubletap';
                                });
                                hammertime.on('pinch', function() {
                                    self.className = 'pinch';
                                });
                                hammertime.on('rotate', function() {
                                    self.className = 'rotate';
                                });
                            });
                        });
                    }
                    return objMgr.create('pagemessage', {
                        type:'critical',
                        message : _tr("A touch screen has not been detected.")
                    });
                })()
            ]
        });

    };

};

})();
