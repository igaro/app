//# sourceURL=route.main.security.js

(function() {

"use strict";

module.requires = [
    { name: 'route.main.security.css' }
];

module.exports = function() {

    return function(model) {

        var managers = model.managers,
            domMgr = managers.dom,
            wrapper = model.wrapper;

        model.stash.title = _tr("Security");
        model.stash.desc = _tr("Igaro App is the only Javascript Framework with zero public variables, effectively sandboxing it's libraries from code injection.");

        domMgr.mk('p',wrapper,_tr("Igaro App is <b>100%</b> secure."));
        domMgr.mk('p',wrapper,_tr("Initially index.html bootstraps igaro.js using a public variable. This is then removed and the only singular reference to the app is stored privately. Only modules loaded by Igaro App gain access to this variable, and since everything goes through it, the entire codebase is sandboxed from code injection."));

        domMgr.mk('h1',wrapper,_tr("OAuth2 Credentials"));
        domMgr.mk('p',wrapper,_tr("Igaro App recommends using OAuth2 for authentication and provides a module, instance.oauth2, to make access to any provider simple."));

        domMgr.mk('h1',wrapper,_tr("Automated Authentication"));
        domMgr.mk('p',wrapper,_tr("Igaro App supports automated authentication transparent to code (which needs no handling) and the user (no URL change or redirection)."));
        domMgr.mk('p',wrapper,_tr("A service which requires credentials emits a HTTP 401 which is captured and invokes an OAuth2 mechanism. Once complete the previous request and any that have came in since are then completed."));

        domMgr.mk('h2',wrapper,_tr("Example"));
        domMgr.mk('p',wrapper,_tr("Place the code below into your app conf file and on any XHR request to a Google API, simply add auth:'google' to the stash."));

        domMgr.mk('pre',wrapper,domMgr.mk('code',null,"var auths = {\n\
    google : {\n\
        mech : new app['instance.oauth2']({ /* conf here */ }),\n\
        replay : [],\n\
        set : function(o) { this.cred=o?o:{}; return Promise.resolve(); },\n\
        cred : {}\n\
    }\n\
};\n\
events.on('instance.xhr','start', function(p) {\n\
    var o = p.x,\n\
        auth = o.stash.auth;\n\
    if (auth) \n\
        o.headers['Authorization'] = 'Bearer '+auths[auth].cred.token;\n\
});\n\
events.on('instance.xhr','response', function(p) {\n\
    var o = p.x;\n\
    if (o.xhr.status !== 401 || ! o.stash.auth)\n\
        return;\n\
    var auth = auths[o.stash.auth],\n\
        mech = auth.mech,\n\
        replay = auth.replay;\n\
    replay.push(o);\n\
    if (mech.inProgress)\n\
        return {\n\
            stopImmediatePropagation:true\n\
        };\n\
    return auth.set().then(function() {\n\
        return mech.exec().then(function (o) {\n\
            return auth.set(o).then(function() {\n\
                replay.forEach(function(xhr,i) {\n\
                    if (! xhr)\n\
                        return;\n\
                    replay[i] = null;\n\
                    if (o.token) {\n\
                        xhr.send(); // no return\n\
                    } else {\n\
                        xhr.abort(); // no return\n\
                    }\n\
                });\n\
            });\n\
        });\n\
    }).then(function() {\n\
        return {\n\
            stopImmediatePropagation:true\n\
        };\n\
    });\n\
},{ prepend:true });"));

        domMgr.mk('h1',wrapper,_tr("XHR CORS"));
        domMgr.mk('p',wrapper,_tr("Is fully supported."));
    };

};

})();
