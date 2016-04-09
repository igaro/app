//# sourceURL=route.main.modules.instance.amd.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {
            desc : function(l) { return l.gettext("Asynchronously loads modules and there dependencies using XHR and appends Igaro App modules into the namespace."); },
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            blessed:true,
            usage : {
                instantiate : true,
                attributes : [
                    {
                        name:'repo',
                        type:'string',
                        desc : function(l) { return l.gettext("The repository (i.e URL) from which to load files. Defaults to the location where the application was loaded from."); },
                    },
                    {
                        name:'modules',
                        required:true,
                        type:'object',
                        desc : function(l) { return l.gettext("Modules to load. Each is represented by an object in the array."); },
                        attributes : [
                            {
                                instanceof: { name:'Array' }
                            },
                            {
                                name:'name',
                                type:'string',
                                required:true,
                                desc:function(l) { return l.gettext("The name of the module excluding any file extension."); }
                            },
                            {
                                name:'nosub',
                                type:'boolean',
                                desc : function(l) { return l.gettext("By default a folder /js will be appended to the repo location. Pass true to disable this."); }
                            },
                            {
                                name:'repo',
                                type:'string',
                                desc : function(l) { return l.gettext("The module will use the default or last loaded module repo value unless this is defined."); }
                            },
                            {
                                name:'requires',
                                type:'object',
                                desc : function(l) { return l.gettext("A module usually defines its dependencies, but they can also be specified here. A dependency follows the same format as this object."); },
                                attributes : [{
                                    instanceof: { name:'Array' }
                                }]
                            },
                            {
                                name:'version',
                                type:'string',
                                desc : function(l) { return l.gettext("Supply a version to append to the request URL. This is in addition to the app build version."); }
                            },
                        ]
                    },
                    {
                        name:'onProgress',
                        type:'function',
                        desc : function(l) { return l.gettext("Callback when progress is made. It includes workers for the request and child dependencies (and any dependencies they require)."); }
                    }
                ]
            },
            attributes : [
                {
                    name:'get',
                    type:'function',
                    attributes: [
                        {
                            type:'object',
                            attributes : [
                                {
                                    desc: function(l) { return l.gettext("Any of the instantiated attributes can be passed here to update the instance before executing the Promise, else the default or previously set values will be used."); }
                                }
                            ]
                        }
                    ],
                    async:true
                }
            ]

        };

        model.parent.stash.childsupport(data,model);
    };

};
