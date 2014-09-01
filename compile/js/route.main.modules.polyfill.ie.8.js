module.requires = [
    { name:'core.language.js'}
];

module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {
                en : 'This library prototypes missing IE8 functionality. \
Due to deficiencies with IE8/9 (CORS,CSS3,SVG), both are unsupported by Igaro App and probably won\'t work well out the box. \
<p></p>The following are provided;<p></p><ul></ul>',
                fr : 'Cette bibliothèque prototypes manquants fonctionnalité IE8. \
En raison de lacunes avec IE8 / 9 (CORS, CSS3, SVG), les deux sont pris en charge par Igaro App et probablement ne fonctionnera pas bien sur la boîte. \
<p></p>Les éléments suivants sont fournis;<p></p><ul></ul>'
            },
            author : { 
                name:'Andrew Charnley', 
                link:'mailto:andrew.charnley@igaro.com' 
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

        model.parent.store.childsupport(data,model);

    };

};
