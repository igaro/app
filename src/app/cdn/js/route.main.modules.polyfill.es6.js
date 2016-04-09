//# sourceURL=route.main.modules.polyfill.es6.promises.js

module.exports = function() {

    "use strict";

    var polyfillFns = [
        ['Array.find','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find'],
        ['Array.findIndex','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex'],
        ['Promise','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise'],
        ['Object.assign','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign']
    ].map(function(x) {

        return '<a href="'+x[1]+'">'+x[0]+'</a>';
    }).join(', ');

    return function(model) {

        var data = {
            desc : function() {

                return this.substitute(this.tr((({ key:"This module prototypes some ES6 features. The following features are provided; %[0]." }))),polyfillFns); },
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            },
            extlinks : [
                'https://github.com/jakearchibald/es6-promise'
            ]
        };

        model.parent.stash.childsupport(data,model);
    };
};
