//# sourceURL=route.main.modules.3rdparty.moment.js

module.exports = function() {

    "use strict";

    return function(model) {

        var data = {
            desc : _tr("Moment is a date manipulation and display library. The library has been slightly modified to allow for exporting the library into the Igaro App namespace. Ideally you should access the functionality of this module through instance.date."),
            usage : {
                class : true
            },
            related : [
                'instance.date'
            ],
            extlinks : [
                'http://www.momentjs.com'
            ]
        };

        model.parent.stash.childsupport(data,model);

    };
};
