module.exports = function(app) {

    var events = app['core.events'];

    return new function() {

        this.log = {
            data : new Array(),
            append : function(name,event,value) {
                var p = { name:name, event:event, value:value };
                events.dispatch('core.debug','log.append', p);
                this.data.push(p);
            }
        };

    };

};
