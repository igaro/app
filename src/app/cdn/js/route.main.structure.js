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

        model.stash.title=function() { return this.tr((({ key:"Structure" }))); };
        model.stash.description = function() { return this.tr((({ key:"Describes the files and folders that make up Igaro App. You'll use this structure as you customize and add your own files." }))); };

        domMgr.mk('p',wrapper,function() { return this.tr((({ key:"This may be your first introduction to Igaro App, and if it is, welcome!" }))); });

        return model.addSequence({
            container:wrapper,
            promises:[

                objectMgr.create('accordion').then(function(accordion) {
                    var domMgr = accordion.managers.dom;
                    domMgr.mk('h1',wrapper,function() { return this.tr((({ key:"Files & Folders" }))); });
                    domMgr.mk('p',wrapper);
                    dom.append(wrapper,accordion);

                    // src
                    return accordion.addSection({
                        title:'src'
                    }).then(function(section) {

                        var managers = section.managers;
                        managers.dom.mk('p',section.content,function() { return this.tr((({ key:"Contains files pertaining to the build process." }))); });

                        return managers.object.create('accordion', {
                            container:section.content
                        }).then(function(accordion) {

                            // app
                            return accordion.addSection({
                                title:function() { return this.tr((({ key:"app" }))); },
                                content:function() { return this.tr((({ key:"The root for the app and containing JavaScript files that are to be processed." }))); }
                            }).then(function(section) {

                                return section.managers.object.create('accordion', {
                                    container:section.content
                                }).then(function (accordion) {

                                    // cdn
                                    return accordion.addSection({
                                        title:'cdn',
                                        content:function() { return this.tr((({ key:"Contains content that may be served locally or via a CDN. This includes lazy loaded app modules." }))); }
                                    }).then(function(section) {

                                        return section.managers.object.create('accordion', {
                                            container:section.content,
                                            sections : [{
                                                title:'index.js',
                                                content:function() { return this.tr((({ key:"The main bootstrap JavaScript file which when processed will contain the configuration file data." }))); }
                                            }]
                                        }).then(function(accordion) {

                                            // js
                                            return accordion.addSection({
                                                title:'js'
                                            }).then(function(section) {

                                                return section.managers.object.create('accordion', {
                                                    container:section.content,
                                                    sections : [
                                                        {
                                                            title:'3rdparty.*.js',
                                                            content:function() { return this.tr((({ key:"Provide third party code in a structured format. Some provide an interface to system features such as touch." }))); }
                                                        },
                                                        {
                                                            title:'core.*.js',
                                                            content:function() { return this.tr((({ key:"Libraries, not instantiable, which provide global functionality. Typically required by other modules via module.requires. Don't contain language or output to the DOM." }))); }
                                                        },
                                                        {
                                                            title:'instance.*.js',
                                                            content:function() { return this.tr((({ key:"Returns an instantable function. May provide a DOM feature in form of a widget or provide functionality such as AJAX. Instantiated, used once, then destroyed." }))); }
                                                        },
                                                        {
                                                            title:'polyfix.*.js',
                                                            content:function() { return this.tr((({ key:"Prototypes missing Javascript functionality for older web browsers. Loaded by index.html if required. Modern browsers don't require them." }))); }
                                                        },
                                                        {
                                                            title:'route.*.js',
                                                            content:function() { return this.tr((({ key:"Provides router model data which is used to build and manage a view. Returns a single function which is used as a singleton." }))); }
                                                        }
                                                   ]
                                                });
                                            });
                                        });
                                    });
                                });
                            }).then(function() {

                                return accordion.addSections([
                                    {
                                        title:'builtin',
                                        content:function() { return this.tr((({ key:"Mandatory modules which would otherise be placed in the src/app/cdn/js folder are placed here." }))); }
                                    },
                                    {
                                        title:'conf',
                                        content:function() { return this.tr((({ key:"Contains configuration files which specify locale data (or where to fetch it from) as well as global services and event triggers." }))); }
                                    },
                                    {
                                        title:'cp',
                                        content:function() { return this.tr((({ key:"Files which should be added to the build without any processing can be placed here." }))); }
                                    },
                                    {
                                        title:'recipes',
                                        content:function() { return this.tr((({ key:"Recipes instruct the builder to create a tailored release specific to the environment in which the app is to be run. For example developers will most likely want debugging enabled while the final release will most likely be minified." }))); }
                                    },
                                    {
                                        title:'sass',
                                        content:function() { return this.tr((({ key:"Scss files are compiled into css. Typically a file corresponds to a JavaScript module of the same name. app.scss contains an initial style base but doesn't necessarily style the app, which will carried out by further stylesheets." }))); }
                                    },
                                    {
                                        title:'translations',
                                        content:function() { return this.tr((({ key:"Contains a gettext .pot file template with parsed keys and any .po translation files." }))); }
                                    }
                                ]);
                            });
                        });

                    }).then(function() {

                        return accordion.addSections([
                            {
                                title:'target',
                                content:function() { return this.tr((({ key:"Contains output from build process recipes (customizable)." }))); }
                            },
                            {
                                title:'tests',
                                content:function() { return this.tr((({ key:"Contains E2E test configuration and scripts for NightwatchJS." }))); }
                            }
                        ]);

                    }).then(function() {

                        return accordion;
                    });
                }),

                Promise.resolve().then(function() {

                    return [
                        domMgr.mk('h1',null,function() { return this.tr((({ key:"The App" }))); }),
                        domMgr.mk('p',null,function() { return this.tr((({ key:"Igaro App lives in a private variable, effectively sandboxing it from cross injection. It's supplied to modules as they are loaded." }))); }),
                        domMgr.mk('pre',null,domMgr.mk('code',null,"(function() {\n\
    module.exports = function(app, params) {};\n\
})();")),
                        domMgr.mk('h1',null,function() { return this.tr((({ key:"Module Format" }))); }),
                        domMgr.mk('p',null,function() { return this.tr((({ key:"Igaro modules use a CommonJS (NodeJS) format." }))); }),
                        domMgr.mk('p',null,function() { return this.tr((({ key:"A module's filename usually relates to its namespace, so whatever <b>type.name.js</b> exports will be available at <b>app['type.name']</b>." }))); }),
                        domMgr.mk('p',null,function() { return this.tr((({ key:"A module can define dependencies using <b>module.requires</b> (widgets can be lazy loaded). A path can be supplied to load modules outside of the local repository." }))); }),
                        domMgr.mk('pre',null,domMgr.mk('code',null,"(function() {\n\
    'use strict';\n\
    module.requires = [\n\
        { name : 'type.name.css', repo:'http://www.some-cdn.com' }\n\
    ];\n\
    module.exports = function(app, params) {\n\
        // return - usually a function or literal \n\
    };\n\
})();")),
                        domMgr.mk('h1',null,function() { return this.tr((({ key:"Widgets" }))); }),
                        domMgr.mk('p',null,function() { return this.tr((({ key:"Widgets (also know as instances because they are always instantiated) are typically denoted by an <b>instance.*</b> filename." }))); }),
                        domMgr.mk('p',null,function() { return this.tr((({ key:"JavaScript's <b>new</b> keyword can instantiate these, but the <b>core.object</b> module provides a helper to lazy load the module, instantiate, and call an aynchronous constructor <b>.init()</b>. Thus, a widget can be inserted using minimal code." }))); }),
                        domMgr.mk('pre',null,domMgr.mk('code',null,"this.managers.object.create('accordion').then(function(accordion) {\n\
    \\\\ do something \n\
});")),
                        domMgr.mk('p',null,function() { return this.tr((({ key:"Wondering what <b>this.managers</b> is? In Igaro App every object is blessed with services, which provide two way communication, debugging, helpers and more - all tailored to the object. This is explained in greater detail on the Bless page." }))); }),

                        domMgr.mk('h1',null,function() { return this.tr((({ key:"Bootstrap" }))); }),
                        domMgr.mk('p',null,function() { return this.tr((({ key:"The file <b>index.html</b> loads <b>index.js</b> and handles a no JavaScript condition. <b>index.js</b> appends the bootstrap CSS and appends or embeds; CDN path logic, JavaScript polyfills, Apache Cordova (if available), <b>bootstrap.js</b> and <b>exec.js</b>." }))); }),
                        domMgr.mk('p',null,function() { return this.tr((({ key:"At this point the environment is ready with ES5 and ES6 features and the app can now load." }))); }),
                        domMgr.mk('p',null,function() { return this.tr((({ key:"<b>bootstrap.js</b> tells the app which configuration file to use, defines basics like core fonts and sets up a loading screen. You may define multiple configurations and swap them out here (it's also possible to swap configuration file dynamically via a URL query parameter should you ever need it)." }))); }),
                        domMgr.mk('p',null,function() { return this.tr((({ key:"<b>exec.js</b> does most of the heavy lifting. It's compiled to contain the built in modules and loads the configuration file specified in <b>bootstrap.js</b>. The configuration file is compiled from other configuration files which customize core modules, define global services and event triggers, and gives the app a purpose. Typically an app is configured to load route files/data (header,main,footer) from a CDN or an API once <b>exec.js</b> has fired an event to indicate all modules and dependencies are loaded and configuration is complete." }))); }),

                        domMgr.mk('p',null,null,function() {

                            domMgr.mk('button',this,function() { return this.tr((({ key:"Next Chapter - Bless" }))); }).addEventListener('click',function() {

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
