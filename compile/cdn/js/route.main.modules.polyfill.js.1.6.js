//# sourceURL=route.main.modules.polyfill.js.1.6.js

module.exports = function(app) {

    "use strict";

    var coreLanguage = app['core.language'];

    return function(model) {

        var data = {
            desc : _tr("This module: prototypes Javascript 1.6 (IE8). The following features are provided; %[0]."),
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            }
        };

        data.desc = coreLanguage.substitute(data.desc, [
            ['Array.every','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every'],
            ['Array.filter','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter'],
            ['Array.forEach','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach'],
            ['Array.indexOf','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf'],
            ['Array.lastIndexOf','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf'],
            ['Array.map','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map'],
            ['Array.reduce','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce'],
            ['Array.reduceLeft','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceLeft'],
            ['Array.some','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some'],
            ['Array.unshift','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift'],
            ['[document/Element].getElementsByClassName]','https://developer.mozilla.org/en-US/docs/Web/API/document.getElementsByClassName'],
        ].map(function(x) {
            return '<a href="'+x[1]+'">'+x[0]+'</a>';
        }).join(', '));

        model.parent.stash.childsupport(data,model);
    };

};
