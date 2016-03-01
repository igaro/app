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

        domMgr.mk('p',wrapper,_tr("Initially <b>index.html</b> bootstraps <b>igaro.js</b> using a public variable (there's no way around this). This is then removed and the only singular reference to the app is stored privately. Only modules loaded by the app gain access to this variable meaning the entire codebase is sandboxed from code injection. That's right, there's nothing added to the <b>window</b> object!"));

        domMgr.mk('h1',wrapper,_tr("Credentials"));
        domMgr.mk('p',wrapper,_tr("Igaro App recommends using OAuth2 for authentication and provides <b>instance.oauth2</b>."));

        domMgr.mk('h2',wrapper,_tr("Automation"));
        domMgr.mk('p',wrapper,_tr("Igaro App supports automated authentication transparent to code (which needs no handling) and the user (no URL change or redirection)."));
        domMgr.mk('p',wrapper,_tr("A service which requires credentials emits a HTTP 401 which is captured and invokes an OAuth2 mechanism. Once complete the previous request and any that have came in since are then actioned."));

        domMgr.mk('h3',wrapper,_tr("Example"));
        domMgr.mk('p',wrapper,_tr("The code below adds automated credential handling to the app. An entry for <i>google</i> has been added, all that requires adding is the developer id and other details described in the <b>instance.oauth2</b> documentation."));

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

        domMgr.mk('h1',wrapper,_tr("CORS"));
        domMgr.mk('p',wrapper,_tr("<b>instance.xhr</b> supports CORS (browser dependent)."));
        domMgr.mk('p',wrapper,null,function() {

            domMgr.mk('button',this,_tr("Next Chapter - Design")).addEventListener('click',function() {

                model.parent.to(['design']);
            });
        });
    };

};

})();
