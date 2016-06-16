//# sourceURL=route.main.modules.polyfill.js.1.8.5.js

module.exports = function() {

    "use strict";

    var polyfillFns = [
        ['Array.isArray','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray'],
        ['Function.bind','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind'],
        ['Object.keys','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys']
    ].map(function(x) {

        return '<a href="'+x[1]+'">'+x[0]+'</a>';
    }).join(', ');

    return function(model) {

        var data = {
            desc :  function() { return this.substitute(this.tr((({ key:"This module prototypes Javascript 1.8.5 (IE9). The following are provided; %[0]." }))),polyfillFns); },
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            }
        };

        model.parent.stash.childsupport(data,model);
    };
};
