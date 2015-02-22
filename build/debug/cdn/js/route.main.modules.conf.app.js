module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {"en":"This file configures other modules such as setting supported locale, links events, registers route handlers and customizes the Igaro App framework."},
            author : { 
                name:'Andrew Charnley', 
                link:'http://www.andrewcharnley.com' 
            }
        };

        model.parent.stash.childsupport(data,model);
    };
};
