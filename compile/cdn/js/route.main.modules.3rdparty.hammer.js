//# sourceURL=route.main.modules.3rdparty.hammer.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {
            desc : _tr("This library provides touch events and is loaded when a touch screen is detected."),
            usage : {
                direct : true
            },
            extlinks : [
                'http://eightmedia.github.io/hammer.js/'
            ]
        };

        model.parent.stash.childsupport(data,model);

    };

};
