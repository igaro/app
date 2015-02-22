module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {"en":"Observe.js is part of the Polymer suite. It allows for data binding where Object.observe() isn't available. At time of writing implementation was buggy."},
            usage : {
                direct : true
            },
            extlinks : [
                'https://github.com/Polymer/observe-js'
            ]
        };

        model.parent.stash.childsupport(data,model);

    };
};