//# sourceURL=route.main.modules.instance.oauth2.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {
            desc : _tr("Provides a Oauth2 credential mechanism for login services. Note: the demo asks for a token, but this can be automated (see /security)."),
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            demo : "dom.mk('button', c, { en: 'Get Google API Token' }, function() {\n\
    this.addEventListener('click', function () {\n\
        var self = this;\n\
        model.managers.object.create('oauth2').then(function (oauth2) {\n\
            return oauth2.exec({\n\
    authUrl : 'https://accounts.google.com/o/oauth2/auth?response_type=token&scope=[SCOPE]&client_id=[DEVID]&redirect_uri=[CALLBACKURL]',\n\
    callbackUrl : 'http://www.igaro.com/misc/oauth2callbackUrl.html',\n\
    devid:'998965944286-o80o481vg1a888teboqpj8n5gr3dfuqi.apps.googleusercontent.com',\n\
    scope:'profile',\n\
    tokenName:'access_token'\n\
            }).then(\n\
                function(o) {\n\
                    if (o.token)\n\
                        dom.setContent(c, o.token);\n\
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
                        name:'authUrl',
                        required:true,
                        type:'string',
                        desc : _tr("A provider's oauth2 login page. Use [DEVID], [CALLBACKURL] and [SCOPE] to embed params.")
                    },
                    {
                        name:'callbackUrl',
                        required:true,
                        type:'string',
                        desc : _tr("A URL to load once access is granted. This must fire a postMessage event containing the URL and should be blank.")
                    },
                    {
                        name:'devid',
                        required : true,
                        type:'string',
                        desc: _tr("This identifies you to the provider. Typically you register your App with a provider and they provide this key.")
                    },
                    {
                        name:'scope',
                        type:'string',
                        desc : _tr("A provider may require you to define a scope which defines what access privileges you are seeking to attain.")
                    },
                    {
                        name:'tokenName',
                        required:true,
                        type:'string',
                        desc : _tr("The name of the token to extract from the callback URL.")
                    }
                ]
            },
            blessed : true,
            attributes : [
                {
                    name:'exec',
                    type:'function',
                    async:true,
                    desc: _tr("Begins the authentication process. Any of the instantiation attributes can be passed to update the object."),
                    attributes : [{
                        type:'object',
                        attributes : [{
                            desc: _tr("Any of the instantiated data can be set here to update the XHR before it is sent.")
                        }]
                    }]
                },
                {
                    name:'inProgress',
                    type:'boolean',
                    desc: _tr("Defines whether the oauth2 process is in situ.")
                }
            ],

            extlinks : [
                {
                    name:'Oauth @ Wikipedia',
                    href:'http://en.wikipedia.org/wiki/OAuth'
                }
            ]

        };

        model.parent.stash.childsupport(data,model);

    };

};
