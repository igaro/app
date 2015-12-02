//# sourceURL=route.main.modules.polyfill.es6.promises.js

module.exports = function(app) {

    "use strict";

    var coreLanguage = app['core.language'];

    return function(model) {

        var data = {
            desc : _tr("This module prototypes some ES6 features. The following features are provided; %[0]."),
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            extlinks : [
                'https://github.com/jakearchibald/es6-promise'
            ]
        };

        data.desc = coreLanguage.substitute(data.desc, [
            ['Array.find','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find'],
            ['Array.findIndex','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex'],
            ['Promise','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise'],
            ['Object.assign','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign']
        ].map(function(x) {
            return '<a href="'+x[1]+'">'+x[0]+'</a>';
        }).join(', '));

        model.parent.stash.childsupport(data,model);
    };

};
