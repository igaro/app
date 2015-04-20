module.exports = function(app) {

    return function(model) {

        var data = {
            desc : _tr("This file configures other modules such as setting supported locale, links events, registers route handlers and customizes the Igaro App framework."),
            author : { 
                name:'Andrew Charnley', 
                link:'http://people.igaro.com/ac' 
            }
        };

        model.parent.stash.childsupport(data,model);
    };
};
