//# sourceURL=route.main.modules.polyfill.js.classList.js

module.exports = function() {

    "use strict";

    var polyfillFns = [
        ['Element.classList','https://developer.mozilla.org/en-US/docs/Web/API/Element.classList']
    ].map(function(x) {

        return '<a href="'+x[1]+'">'+x[0]+'</a>';
    }).join(', ');

    return function(model) {

        var data = {
            desc : function() { return this.substitute(this.tr((({ key:"This library prototypes classList, a group of functions for managing the CSS className property on Elements. The following features are provided; %[0]." }))),polyfillFns); },
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            }
        };

        model.parent.stash.childsupport(data,model);
    };
};
