//# sourceURL=route.main.modules.polyfill.js.classList.js

module.exports = function(app) {

    "use strict";

    var coreLanguage = app['core.language'];

    return function(model) {

        var data = {
            desc : _tr("This library prototypes classList, a group of functions for managing the CSS className property on Elements. The following features are provided; %[0]."),
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            }
        };

        data.desc = coreLanguage.substitute(data.desc, [
            ['Element.classList','https://developer.mozilla.org/en-US/docs/Web/API/Element.classList']
        ].map(function(x) {
            return '<a href="'+x[1]+'">'+x[0]+'</a></li>';
        }).join(', '));

        model.parent.stash.childsupport(data,model);

    };

};
