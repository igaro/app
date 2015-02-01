module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {"fr":"","en":"JQuery 2 is provided to allow for code written with this library to be easy imported. It isn't required by Igaro App and isn't loaded by default."},
            usage : {
                direct : true,
            },
            extlinks : [
                'http://www.jquery.com'
            ]
        };

        model.parent.stash.childsupport(data,model);

    };

};
