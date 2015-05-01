(function() {

'use strict';

module.exports = function(app) {

	var bless = app['core.object'].bless;

    var coreStatus = {
        append : function(o) {
            return this.managers.event.dispatch('append',o);
        }
    };

    bless.call(coreStatus, {
        name:'core.status'
    });

    return coreStatus;

};

})();
