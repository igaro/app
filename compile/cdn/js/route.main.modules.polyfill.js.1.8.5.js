module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {
                en : 'This library prototypes Javascript 1.8.5 (IE9). \
<p></p>The following are provided;<p></p><ul></ul>',
                fr : 'Cette bibliothèque prototypes Javascript 1.8.5 (IE9). \
<p></p>Les éléments suivants sont fournis;<p></p><ul></ul>'
            },
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            }
        };

        [
            ['Object.keys','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys'],
            ['Array.isArray','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray'],
            ['Function.bind','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind']
        ].forEach(function (x) {
            Object.keys(data.desc).forEach(function (l) {
                data.desc[l] = data.desc[l].replace('</ul>', '<li><a href="'+x[1]+'">'+x[0]+'</a></li></ul>');
            });
        });

        model.parent.stash.childsupport(data,model);

    };

};