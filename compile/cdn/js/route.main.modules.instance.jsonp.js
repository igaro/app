//# sourceURL=route.main.modules.instance.jsonp.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {
            desc : _tr("Asynchronously fetch JSON from a resource without hitting CORS restrictions."),
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            blessed:true,
            demo : "dom.mk('button', c, { en: 'Get JSON' }, function() {\n\
    this.addEventListener('click', function () {\n\
        var self = this;\n\
        model.managers.object.create('jsonp').then(function (jsonp) {\n\
            return jsonp.get({ res:'http://en.wikipedia.org/w/api.php?format=json&action=query&titles=India&prop=revisions&rvprop=content' }).then(\n\
                function(data) {\n\
                    c.insertBefore(dom.mk('div',null,JSON.stringify(data)), self);\n\
                    c.removeChild(self);\n\
                }\n\
            ).catch(function(e) {;\n\
                model.managers.debug.handle(e);\n\
            });\n\
        });\n\
    });\n\
});",
            usage : {
                instantiate : true,
                attributes : [
                    {
                        name:'callbackName',
                        required:false,
                        type:'string',
                        desc : _tr("For when the resource requires a callback name other than 'callback'.")
                    },
                    {
                        name:'res',
                        required:true,
                        type:'string',
                        desc : _tr("The resource to load.")
                    }
                ]
            },
            attributes : [
                {
                    name:'abort',
                    type:'function',
                    desc: _tr("Aborts the operation (if currently running.")
                },
                {
                    name:'get',
                    type:'function',
                    async:true,
                    desc: _tr("Begins the request."),
                    attributes : [{
                        type:'object',
                        attributes : [{
                            desc: _tr("Any of the instantiated data can be set here to update the XHR before it is sent.")
                        }]
                    }]
                }
            ],

            extlinks : [
                {
                    name:'JSONP @ Wikipedia',
                    href:'http://en.wikipedia.org/wiki/JSONP'
                }
            ]

        };

        model.parent.stash.childsupport(data,model);

    };

};
