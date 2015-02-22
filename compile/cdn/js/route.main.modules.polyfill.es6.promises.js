module.exports = function(app) {

    return function(model) {

        var data = {
            desc : _tr("This module polyfills standard Promise A+ spec into older browsers. The following functions are provided:\n%s"),
            author : { 
                name:'Andrew Charnley', 
                link:'http://www.andrewcharnley.com' 
            },
            extlinks : [
                'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise'
            ]
        };

        model.parent.stash.childsupport(data,model);

    };

};
