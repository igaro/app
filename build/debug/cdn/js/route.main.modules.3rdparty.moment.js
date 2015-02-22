module.exports = function(app) {

    return function(model) {

        var data = {
            desc : {"en":"Moment is a date manipulation and display library. The library has been slightly modified to allow for exporting the library into the Igaro App namespace. Ideally you should access the functionality of this module through instance.date."},
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
