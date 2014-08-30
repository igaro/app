module.exports = function(app) {

	var events = app['core.events'];

    return {
        append : function(o) {
            events.dispatch('core.status','append',o);
        }
    };

};