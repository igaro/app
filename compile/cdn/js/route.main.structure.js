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
                        domMgr.mk('h1',null,_tr("The App")),
                        domMgr.mk('p',null,_tr("Igaro App lives in a private variable, effectively sandboxing it from cross injection. It's supplied to modules as they are loaded.")),
                        domMgr.mk('pre',null,domMgr.mk('code',null,"(function() {\n\
    module.exports = function(app, params) {};\n\
})();")),
                        domMgr.mk('h1',null,_tr("Module Format")),
                        domMgr.mk('p',null,_tr("Igaro modules use a CommonJS (NodeJS) format.")),
                        domMgr.mk('p',null,_tr("A module's filename usually relates to its namespace, so whatever <b>type.name.js</b> exports will be available at <b>app['type.name']</b>.")),
                        domMgr.mk('p',null,_tr("A module can define dependencies using <b>module.requires</b> (widgets can be lazy loaded). A path can be supplied to load modules outside of the local repository.")),
                        domMgr.mk('pre',null,domMgr.mk('code',null,"(function() {\n\
    'use strict';\n\
    module.requires = [\n\
        { name : 'type.name.css', repo:'http://www.some-cdn.com' }\n\
    ];\n\
    module.exports = function(app, params) {\n\
        // return - usually a function or literal \n\
    };\n\
})();")),
                        domMgr.mk('h1',null,_tr("Widgets")),
                        domMgr.mk('p',null,_tr("Widgets (also know as instances because they are always instantiated) are typically denoted by an <b>instance.*</b> filename.")),
                        domMgr.mk('p',null,_tr("JavaScript's <b>new</b> keyword can instantiate these, but the <b>core.object</b> module provides a helper to lazy load the module, instantiate, and call an aynchronous constructor <b>.init()</b>. Thus, a widget can be inserted using minimal code.")),
                        domMgr.mk('pre',null,domMgr.mk('code',null,"this.managers.object.create('accordion').then(function(accordion) {\n\
    \\\\ do something \n\
});")),
                        domMgr.mk('p',null,_tr("Wondering what <b>this.managers</b> is? In Igaro App every object is blessed with services, which provide two way communication, debugging, helpers and more - all tailored to the object. This is explained in greater detail on the Bless page.")),
                        domMgr.mk('p',null,null,function() {

                            domMgr.mk('button',this,_tr("Next Chapter - Bless")).addEventListener('click',function() {

                                model.parent.to(['bless']);
                            });
                        })
                    ];
                })
            ]

        });

    };

};

})();
