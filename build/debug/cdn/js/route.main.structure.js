(function () {

"use strict";

module.requires = [
    { name:'route.main.structure.css' },
    { name:'core.language.js' }
];

module.exports = function(app) {

    return function(model) {

        var wrapper = model.wrapper,
            dom = model.managers.dom,
            language = app['core.language'];

        model.setMeta('title', {"en":"Structure"});

        dom.mk('p',wrapper,{"en":"The git repository contains three main folders; <b>compile</b>, <b>cordova</b> and <b>build</b>."});

        dom.mk('button',wrapper,{"en":"View"}, function() {
            this.addEventListener('click', function() {
                window.open('https://github.com/igaro/app');
            });
        }); 

        dom.mk('h1',wrapper,'build');

        dom.mk('p',wrapper,{"en":"This folder contains three folders, /deploy, which contains code ready for inclusion on a web server and CDN, and /debug, which contains the raw js sources required for testing and debugging. Inside these folders is a cdn folder, which can live anywhere, and a file index.html. This file defines the cdn folder location, loads polyfill libraries and the main loader."});

        dom.mk('button',wrapper,{"en":"View"}, function() {
            this.addEventListener('click', function() {
                window.open('https://github.com/igaro/app/build');
            });
        }); 

        dom.mk('h2',wrapper,'js, css');

        dom.mk('p',wrapper,{"en":"Grunt and Compass compress code into these folders."});

        dom.mk('h1',wrapper,'compile');

        dom.mk('p',wrapper,{"en":"Within this folder are several subfolders, the important two being <b>js</b> and <b>css</b>."});

        dom.mk('h2',wrapper,'js');

        dom.mk('p',wrapper,{"en":"This folder contains the framework and modules."});

        dom.mk('button',wrapper,{"en":"View"}, function() {
            this.addEventListener('click', function() {
                window.open('https://github.com/igaro/app/compile/js');
            });
        }); 

        dom.mk('h3',wrapper,'igaro.js');

        dom.mk('p',wrapper,{"en":"This file begins by including built-in core modules (debug,amd,dom,xhr,events). It then loads required modules from an editable list. A module may have its own dependencies."});
        
        dom.mk('p',wrapper,{"en":"Errors are trapped, handed, potentially reported, and the user is notified."});

        dom.mk('h3',wrapper,'*.js');        

        dom.mk('p',wrapper,{"en":"A module typically exports a function into <b>module.exports</b>. The function is passed a reference to the app's root and a configuration literal and typically returns a function or literal which is then added to a corresponding namespace. Optionally, it may return a Promise while it carries out an asynchronous operation such as fetching data from an API."});

        dom.mk('p',wrapper,{"en":"A module may define dependencies using <b>module.requires</b>."});

        dom.mk('h3',wrapper,'core.*');

        dom.mk('p',wrapper,{"en":"Core files are libraries, not to be instantiated, and provide global functionality. Modifying these files is discouraged. Core files are usually required by other modules but several are built in. They shouldn't contain language or output to the DOM."});

        dom.mk('h3',wrapper,'conf.*');

        dom.mk('p',wrapper,{"en":"These files configure the app, modules, and may bridge events to one another. Conf files don't provide functionality or output to the DOM."});

        dom.mk('h3',wrapper,'route.*');

        dom.mk('p',wrapper,{"en":"These files provide router model data and build a view."});

        dom.mk('h3',wrapper,'instance.*');

        dom.mk('p',wrapper,{"en":"These files return an instantable function. The instance may be a DOM feature or functionality such as an XHR."});

        dom.mk('h3',wrapper,'polyfix.*');

        dom.mk('p',wrapper,{"en":"These files prototype missing Javascript functionality for older web browsers. They are loaded by index.html file not the AMD loader."});

        dom.mk('h3',wrapper,'3rdparty.*');

        dom.mk('p',wrapper, {"en":"These allow utilization of non Igaro code in the app. An example is JQuery. Some modules provide additional functionality by targeting bespoke system features such as Touch."});

        dom.mk('h2',wrapper,'css');

        dom.mk('p',wrapper,{"en":"This folder contains stylesheets, the name of which corresponds to a module name. Images from the /images folder are base64 encoded into these css files. igaro.scss contains an initial style base. It doesn't necessarily style the app, which will load further stylesheets depending on the modules employed."});

        dom.mk('button',wrapper,{"en":"View"}, function() {
            this.addEventListener('click', function() {
                window.open('https://github.com/igaro/app/compile/css');
            });
        });

        dom.mk('h1',wrapper,'cordova');

        dom.mk('p',wrapper,{"en":"There's an Apache cordova project in this folder. Igaro App comes ready to deploy to mobile devices."});

    };

};

})();