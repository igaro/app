module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {
                en : 'This library prototypes classList, a group of functions for managing CSS className\'s on a DOM element. \
<p></p>The following are provided;<p></p><ul></ul>',
                fr : 'Cette prototypes de la bibliothèque classList, un groupe de fonctions de gestion className CSS est sur un élément DOM. \
<p></p>Les éléments suivants sont fournis;<p></p><ul></ul>'
            },
            author : { 
                name:'Andrew Charnley', 
                link:'mailto:andrew.charnley@igaro.com' 
            }
        };

        [
            ['Element.classList','https://developer.mozilla.org/en-US/docs/Web/API/Element.classList']
        ].forEach(function (x) {
            Object.keys(data.desc).forEach(function (l) {
                data.desc[l] = data.desc[l].replace('</ul>', '<li><a href="'+x[1]+'">'+x[0]+'</a></li></ul>');
            });
        });

        model.parent.store.childsupport(data,model);

    };

};