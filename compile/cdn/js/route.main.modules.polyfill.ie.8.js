//# sourceURL=route.main.modules.polyfill.ie.8.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {
            desc : _tr("This library prototypes missing IE8 functionality. Due to deficiencies with IE8/9 (CORS,CSS3,SVG), both are unsupported by Igaro App and probably won't work well out the box."),
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            }
        };

        [
            ['EventTarget.addEventListener','https://developer.mozilla.org/en/docs/Web/API/EventTarget.addEventListener'],
            ['EventTarget.removeEventListener','https://developer.mozilla.org/en/docs/Web/API/EventTarget.removeEventListener'],
            ['Date.toISOString','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString'],
            ['event.preventDefault','https://developer.mozilla.org/en/docs/Web/API/event.preventDefault'],
            ['event.stopPropagation', 'https://developer.mozilla.org/en/docs/Web/API/event.stopPropagation']
        ].forEach(function (x) {
            Object.keys(data.desc).forEach(function (l) {
                data.desc[l] = data.desc[l].replace('</ul>', '<li><a href="'+x[1]+'">'+x[0]+'</a></li></ul>');
            });
        });

        model.parent.stash.childsupport(data,model);

    };

};
