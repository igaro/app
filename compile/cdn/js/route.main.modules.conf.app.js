//# sourceURL=route.main.modules.conf.app.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {
            desc : _tr("This file configures other modules such as setting supported locale, links events, registers route handlers and customizes the Igaro App framework."),
            author : {
                name:'Andrew Charnley',
                link:'http://www.igaro.com/ppl/ac'
            }
        };

        model.parent.stash.childsupport(data,model);
    };
};
