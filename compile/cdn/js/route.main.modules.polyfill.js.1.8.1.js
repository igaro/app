//# sourceURL=route.main.modules.polyfill.js.1.8.1.js

module.exports = function(app) {

    "use strict";

    var coreLanguage = app['core.language'];

    return function(model) {

        var data = {
            desc :  _tr("This module prototypes Javascript 1.8.1 (IE9). The following are provided; %[0]"),
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            }
        };

        data.desc = coreLanguage.substitute(data.desc,[
            ['String.trim','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim']
        ].map(function(x) {
            return '<a href="'+x[1]+'">'+x[0]+'</a>';
        }).join(', '));

        model.parent.stash.childsupport(data,model);

    };

};
