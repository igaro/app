(function() {

"use strict";

module.requires = [
    { name: 'route.main.mobile.css' },
    { name: 'core.language.js'}
];

module.exports = function(app) {

    return function(model) {

        var wrapper = model.wrapper,
            dom = model.managers.dom,
            language = app['core.language'];

        model.setMeta('title', {"en":"Mobile"});

        dom.mk('p',wrapper,{"en":"Igaro App is made for mobile, with it's outstanding performance offering a near native mobile app experience across all platforms."});

        dom.mk('h1',wrapper,{"en":"Responsive Layout"});

        dom.mk('p',wrapper,{"en":"Media queries take into account screens of all sizes. Try changing the size of this window to that of a large screen, tablet and phone. Notice how the footer disappears and how elements such as the header change height and width depending on screen ratio."});

        dom.mk('h1',wrapper,{"en":"Embedded Resources"});

        dom.mk('p',wrapper,{"en":"Images, fonts and other media are compiled into CSS making them immediately available."});

        dom.mk('button',wrapper,{"en":"Demo"}).addEventListener('click', function() {
            dom.mk('div',{ insertBefore:this },null, function() {
                this.className = 'embeddedresdemo';
                dom.mk('div', this);
                dom.mk('img', this).src = 'http://www.igaro.com/misc/chinchilla.jpg?x='+ Math.floor((Math.random() * 999) + 1);
            });
            dom.rm(this);
        });

        dom.mk('h1',wrapper,{"en":"Touch Ready"});

        dom.mk('p',wrapper,{"en":"For touch screens the browser 300ms delay is removed. Press and hold on the shapes below to compare the difference."});

        dom.mk('div',wrapper,null, function() {
            this.className = 'touchdemo';
            dom.mk('div',this,null, function() {
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

            dom.mk('div',this,null, function() {
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

        dom.mk('h1',wrapper,{"en":"Gestures"});
        dom.mk('p',wrapper,{"en":"Swipe, pinch, tap, double tap, rotate and pan gesture events are available. If you have a touch screen, try some actions in the box below."});

        return model.addSequence({

            container:wrapper,
            promises: [

                (function() {
                    if (window.Hammer) {
                        return dom.mk('div', null,null, function() {
                            this.className = 'gesturedemo';
                            dom.mk('div',this, null, function() {
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
                    return model.addInstance('pagemessage', {
                        type:'critical',
                        message : {"en":"A touch screen has not been detected."}
                    });
                })(),

                model.addInstance(
                    'navigation',
                    {
                        type:'tabs'
                    }
                ).then(function(navigation) {
                    var c = document.createDocumentFragment();
                    dom.mk('h1',c,{"en":"Device Features"});
                    dom.mk('p',c,language.substitute({"en":"%d is utilized to access mobile device features such as camera, accelerometer and GPS."},'<a href="http://cordova.apache.org">Apache Cordova</a>'));
                    dom.mk('div',c,null,'cordova');
                    dom.mk('p',c,null, function() {
                        dom.mk('ul',this,null, function() {
                            dom.mk('li',this,language.substitute({"en":"Within a terminal run %d"},'<b>cd /igaro/git/app/cordova</b>'));
                            dom.mk('li',this,{"en":"Install the platforms you wish to support."});
                            dom.mk('li',this,{"en":"Deploy onto your device or emulator with <b>cordova run [ios][android][firefoxos]</b>. Note that by default the www folder contains files symlinked to the output/debug folder. You will want to change this to output/deploy when you are ready to release your app."});
                            dom.mk('li',this,{"en":"Customise splashscreens and icons within the same folder."});
                        });
                    });
                    c.appendChild(navigation.container);
                    var p = dom.mk('p', c);
                    [
                        {
                            id:'android',
                            title : 'Android'
                            
                        },
                        {
                            id:'ios',
                            title : 'IOS'
                            
                        },
                        {
                            id:'wm',
                            title : 'Windows Mobile'
                        }
                    ].forEach(function (o,i) {
                        var div = dom.mk('div',null,null,o.id);
                        navigation.menu.addOption({
                            title:o.title,
                            id:o.id,
                            onClick: function() {
                                dom.setContent(p,div,{ noEmpty:true });
                                this.setActive();
                            }
                        }).then(function(opt) {
                            if (! i) {
                                dom.setContent(p,div,{ noEmpty:true });
                                opt.setActive();
                            }
                        });
                    });
                    navigation.menu.options[0].setActive();
                    return c;
                })

            ]
        });

    };

};

})();
