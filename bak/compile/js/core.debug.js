module.exports = function(app) {

    var events = app['core.events'];

    return {

        log : {
            data : [],
            append : function(name,event,value) {
                var p = { name:name, event:event, value:value };
                events.dispatch('core.debug','log.append', p);
                this.data.push(p);
            }
        }

    };

};
