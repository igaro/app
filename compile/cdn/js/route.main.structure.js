(function () {

"use strict";

module.requires = [
    { name:'route.main.structure.css' }
];

module.exports = function(app) {

    return function(model) {

        var wrapper = model.wrapper,
            managers = model.managers,
            domMgr = managers.dom,
            objectMgr = managers.object;

        model.stash.title=_tr("Structure");
        model.stash.description = _tr("Describes the files and folders that make up Igaro App. You'll use this structure as you customize and add your own files.");

        domMgr.mk('p',wrapper,_tr("This may be your first introduction to Igaro App, and if it is, welcome!"));

        return objectMgr.create('accordion').then(function(accordion) {
            domMgr = accordion.managers.dom;
            domMgr.mk('h1',wrapper,_tr("Files & Folders"));
            domMgr.mk('p',wrapper);
            domMgr.append(wrapper,accordion);

            // build
            return accordion.addSection({
                title:'build'
            }).then(function(section) {
                var managers = section.managers;
                managers.dom.mk('p',section.content,_tr("Contains javascript and html files that should be compiled (and optionally compressed) into the build folder."));
                return managers.object.create('accordion', {
                    container:section.content,
                    sections : [
                        {
                            title:_tr("debug"),
                            content:_tr("Defines the location of the cdn folder, loads polyfill libraries, provides a loading screen, and defines a container for the app.")
                        },
                        {
                            title:_tr("deploy"),
                            content:_tr("Contains code that prints data to the console. Code remains uncompressed. Used for development and shouldn't be released.")
                        },
                        {
                            title:_tr("deploy-debug"),
                            content:_tr("As deploy, but uncompressed. Assists with debugging problems introduced by the compile cycle.")
                        }
                    ]
                });
                
            }).then(function() {

                // compile
                return accordion.addSection({
                    title:'compile' 
                }).then(function(section) {
                    var managers = section.managers;
                    managers.dom.mk('p',section.content,_tr("Contains javascript and html files that should be compiled (and optionally compressed) into the build folder."));
                    return managers.object.create('accordion', {
                        container:section.content,
                        sections : [
                            {
                                title:_tr("index.html"),
                                content:_tr("Defines the location of the cdn folder, loads polyfill libraries, provides a loading screen, and defines a container for the app.")
                            }
                        ]
                    }).then(function(accordion) {
                        // cdn
                        return accordion.addSection(
                            {
                                title:_tr("cdn")
                            }
                        ).then(function(section) {
                            var managers = section.managers;
                            managers.dom.mk('p',section.content,_tr("Contains files for relative path serving or a cdn server."));
                            return managers.object.create('accordion', {
                                container:section.content
                            }).then(function (accordion) {
                                // js
                                return accordion.addSection({
                                    title:'js'
                                }).then(function(section) {
                                    var managers = section.managers;
                                    managers.dom.mk('p',section.content,_tr("Contains the framework and modules."));
                                    return managers.object.create('accordion', {
                                        container:section.content,
                                        sections : [
                                            {
                                                title:'3rdparty.*.js',
                                                content:_tr("Provide third party code in a structured format. An example is JQuery. Some provide an interface to system features such as touch.")
                                            },
                                            {
                                                title:'igaro.js',
                                                content:_tr("Provides built-in modules and loads any additional modules. Errors are trapped, handed, potentially reported to an API, and the user is notified.")
                                            },
                                            {
                                                title:'*.js',
                                                content:_tr("Typically exports a function into module.exports. This is passed a reference to the app root and config data, and typically returns a function or object literal which is added to a corresponding namespace. Additionally dependencies can be defined using module.requires. Typically used for a corresponding CSS file as javascript files can be lazy loaded at point of request.")
                                            },
                                            {
                                                title:'conf.*.js',
                                                content:_tr("Configures the app, modules, and bridge events. They don't provide functionality or output to the DOM.")
                                            },
                                            {
                                                title:'core.*.js',
                                                content:_tr("Libraries, not instantiable, which provide global functionality. Typically required by other modules via module.requires. Don't contain language or output to the DOM.")
                                            },
                                            {
                                                title:'instance.*.js',
                                                content:_tr("Returns an instantable function. May provide a DOM feature in form of a widget or provide functionality such as AJAX. Instantiated, used once, then destroyed.")
                                            },
                                            {
                                                title:'polyfix.*.js',
                                                content:_tr("Prototypes missing Javascript functionality for older web browsers. Loaded by index.html if required. Modern browsers don't require them.")
                                            },
                                            {
                                                title:'route.*.js',
                                                content:_tr("Provides router model data which is used to build and manage a view. Returns a single function which is used as a singleton.")
                                            }
                                       ]
                                    });
                                });
                            });
                        });
                    });
                });

            }).then(function() {

                return [
                    {
                        title:'copy',
                        content:_tr("Any files/folders here are copied over to the build folder after compilation.")
                    },
                    {
                        title:'cordova',
                        content:_tr("Contains an Apache cordova project for deploying the app onto mobile devices.")
                    },
                    {
                        title:'sass',
                        content:_tr("Scss files are compiled into css. Typically a file corresponds to a javascript module of the same name. igaro.scss contains an initial style base but doesn't necessarily style the app, which will load further stylesheets.")
                    },
                    {
                        title:'translations',
                        content:_tr("Translation files produced by the compiler and translation files generated by translators are stored here and merged upon the build process.")
                    }
                ].reduce(function(a,b) {
                    return a.then(function() {
                        return accordion.addSection(b);
                    });
                }, Promise.resolve());

            });
        });

    };

};

})();
