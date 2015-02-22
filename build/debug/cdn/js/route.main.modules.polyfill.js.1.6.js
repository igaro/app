module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {"en":"This library prototypes Javascript 1.6 (IE8). The following functions are provided:\\n%s"},
            author : { 
                name:'Andrew Charnley', 
                link:'http://www.andrewcharnley.com' 
            }
        };

        [
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
        ].forEach(function (x) {
            Object.keys(data.desc).forEach(function (l) {
                data.desc[l] = data.desc[l].replace('</ul>', '<li><a href="'+x[1]+'">'+x[0]+'</a></li></ul>');
            });
        });

        model.parent.stash.childsupport(data,model);

    };

};