
(function () {

"use strict";

module.requires = [
    { name: 'route.main.showcase.todomvc.css' }
];

module.exports = function() {

    return function(model) {

        var wrapper = model.wrapper;

        model.stash.title=_tr("TodoMVC");
        model.stash.description=_tr("An example of the TodoMVC Widget.");

        return model.managers.object.create('todomvc', { container:wrapper });

    };

};

})();
