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

        domMgr.mk('p',wrapper,_tr("Igaro App loads mobile and/or touch modules upon app load. It automatically detects the environment ensuring only relevant modules are loaded."));

        domMgr.mk('p',wrapper,language.substitute(_tr("%[0] is utilized to access mobile device features such as camera, accelerometer and GPS. Many modules customise behaviour for native environments, such as <b>instance.toast</b> which switches to O/S popups."),'<a href="http://cordova.apache.org">Apache Cordova</a>'));

        domMgr.mk('h1',wrapper,_tr("Embedding Resources"));

        domMgr.mk('p',wrapper,_tr("Compass SASS is included. Base64'ing images and fonts into CSS allowing app's to perform with a native feel."));

        domMgr.mk('button',wrapper,_tr("Demo")).addEventListener('click', function() {
            domMgr.mk('div',{ insertBefore:this },null, function() {
                this.className = 'embeddedresdemo';
                domMgr.mk('div', this);
                domMgr.mk('img', this).src = 'http://www.igaro.com/misc/chinchilla.jpg?x='+ Math.floor((Math.random() * 999) + 1);
            });
            dom.rm(this);
        });

        domMgr.mk('h1',wrapper,_tr("Touch & Gestures"));

        domMgr.mk('p',wrapper,_tr("For touch screens, <b>3rdparty.fastclick</b> removes the browser 300ms click delay."));

        domMgr.mk('p',wrapper,_tr("Gesture events are available via <b>3rdparty.hammer</b>. If you have a touch screen, try some actions in the box below."));

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
                })(),
                Promise.resolve(

                    domMgr.mk('p',null,null,function() {

                        domMgr.mk('button',this,_tr("Next Chapter - Compatibility")).addEventListener('click',function() {

                            model.parent.to(['compat']);
                        });
                    })
                )
            ]
        });

    };

};

})();
