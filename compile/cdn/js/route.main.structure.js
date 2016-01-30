//# sourceURL=route.main.structure.js

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
            dom = app['core.dom'],
            objectMgr = managers.object;

        model.stash.title=_tr("Structure");
        model.stash.description = _tr("Describes the files and folders that make up Igaro App. You'll use this structure as you customize and add your own files.");

        domMgr.mk('p',wrapper,_tr("This may be your first introduction to Igaro App, and if it is, welcome!"));

        return model.addSequence({
            container:wrapper,
            promises:[

                objectMgr.create('accordion').then(function(accordion) {
                    var domMgr = accordion.managers.dom;
                    domMgr.mk('h1',wrapper,_tr("Files & Folders"));
                    domMgr.mk('p',wrapper);
                    dom.append(wrapper,accordion);

                    // build
                    return accordion.addSection({

                        title:'build'
                    }).then(function(section) {

                        var managers = section.managers;
                        managers.dom.mk('p',section.content,_tr("Contains the output from the build process."));
                        return managers.object.create('accordion', {
                            container:section.content,
                            sections : [
                                {
                                    title:_tr("debug"),
                                    content:_tr("The output folder for the debug compliation process.")
                                },
                                {
                                    title:_tr("deploy"),
                                    content:_tr("The output folder for the deploy compilation process.")
                                }
                            ]
                        });
                    }).then(function() {

                        // compile
                        return accordion.addSection({
                            title:'compile'
                        }).then(function(section) {

                            var managers = section.managers;
                            managers.dom.mk('p',section.content,_tr("Contains files to be compiled and optionally compressed into the build folder."));

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
                                    managers.dom.mk('p',section.content,_tr("Contains files for relative path serving or for a cdn server."));

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
                                                        content:_tr("Provide third party code in a structured format. Some provide an interface to system features such as touch.")
                                                    },
                                                    {
                                                        title:'igaro.js',
                                                        content:_tr("Provides built-in modules and loads any additional modules. Errors are trapped, handed, potentially reported to an API, and the user is notified.")
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

                        return accordion.addSections([
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
                                title:'tests',
                                content:_tr("Contains E2E test configuration and scripts for NightwatchJS.")
                            },
                            {
                                title:'translations',
                                content:_tr("Translation files produced by the compiler and translation files generated by translators are stored here and merged upon the build process.")
                            }
                        ]);

                    }).then(function() {

                        return accordion;
                    });
                }),

                Promise.resolve().then(function() {

                    return [
                        domMgr.mk('h1',null,_tr("Module Format")),
                        domMgr.mk('p',null,_tr("Igaro modules use a CommonJS (NodeJS) format. All modules have access to the private app variable, so only load modules from locations you trust.")),
                        domMgr.mk('p',null,_tr("A module's filename usually corresponds to its namespace, so 'type.name.js' will be available at app['type.name'].")),
                        domMgr.mk('p',null,_tr("Dependencies can be added to the module.requires list at the top of the file, however instance modules can be lazy loaded and need not. A custom path can be supplied to load outside of the local repository (not shown).")),
                        domMgr.mk('pre',null,domMgr.mk('code',null,"(function() {\n\
    'use strict';\n\
    module.requires = [\n\
        { name : 'type.name.css' },\n\
    ];\n\
    module.exports = function(app, params) {\n\
        // return - usually a function or literal \n\
    };\n\
    })();")),
                        domMgr.mk('h1',null,_tr("Instances")),
                        domMgr.mk('p',null,_tr("Instances (also know as widgets) can be called anything, but Igaro supplied instances are denoted by an instance.* filename.")),
                        domMgr.mk('p',null,_tr("An instance module exports a function which is instantiated upon need. Although JavaScript's <b>new</b> keyword can do this, core.object's bless (covered in the next chapter) provides a helper to lazy load the module, call <b>new</b> and then a second constructor .init(). Unlike <b>new</b>, .init() is asynchronous.")),
                        domMgr.mk('p',null,_tr("Using the icon at the top of this App view the code behind this page to learn how an accordion instance is added. Notice how instances can be children of instances?"))
                    ];
                })
            ]

        });

    };

};

})();
