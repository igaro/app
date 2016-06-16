//# sourceURL=route.main.modules.polyfill.js.1.8.1.js

module.exports = function() {

    "use strict";

    var polyfillFns = [
        ['String.trim','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim']
    ].map(function(x) {

        return '<a href="'+x[1]+'">'+x[0]+'</a>';
    }).join(', ');
    return function(model) {

        var data = {
            desc :  function() { return this.substitute(this.tr((({ key:"This module prototypes Javascript 1.8.1 (IE9). The following are provided; %[0]" }))),polyfillFns); },
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            }
        };

        model.parent.stash.childsupport(data,model);
    };
};
