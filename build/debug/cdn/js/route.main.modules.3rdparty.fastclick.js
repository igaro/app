module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {"fr":"","en":"This library works around the 300ms browser click delay. This module is included when running under a local file system / Cordova."},
            usage : {
                direct : true,
            },
            extlinks : [
                'http://labs.ft.com/articles/ft-fastclick/'
            ]
        };

        model.parent.stash.childsupport(data,model);

    };

};
