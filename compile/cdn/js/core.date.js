(function() {

'use strict';

module.requires = [
    { name: 'core.store.js' }
];

module.exports = function(app) {

    var store = app['core.store'],
        bless = app['core.object'].bless;

    var coreDate = {

        name:'core.date',
        managers : {
            store : store
        },
        envOffset : new Date().getTimezoneOffset()*-1,
        envOffsetAuto : null,

        isLeapYear : function(y) {
            return (new Date(y,1,29).getDate() === 29)? true:false;
        },
    
        daysInMonth : function (cYear,cMonth) {
            if (cMonth === 4 || cMonth === 6 || cMonth === 9 || cMonth === 11) 
                return 30;
            if (cMonth === 2) 
                return (this.isleapyear(cYear))? 29:28;
            return 31;
        },

        userTz : function(tz) { //ISO 8601
            var date = typeof tz === 'string'? new Date(tz) : tz;
            date = new Date(date.valueOf() + (date.getTimezoneOffset()*60000) + (this.uiOffset*60000) );
            return date;
        },
    
        strip : function(o) { 
            var str = typeof o === Date? o.valueOf() : o;
            return str.replace(/[^0-9]/g, ''); 
        },
            
        resetEnvOffset : function() {
            var self = this;
            return this.managers.store.set('envOffset').then(function() {
                self.envOffsetAuto = true;
                return self.setEnvOffset(null,true);
            });
        },

        setEnvOffset : function(minutes, noStore) {
            var self = this,
                managers = this.managers;
            return new Promise(function(resolve) {
                if (typeof minutes !== 'number') {
                    minutes = new Date().getTimezoneOffset() * -1;
                } else if (! noStore) {
                    self.envOffsetAuto = false;
                }
                //if (minutes === self.envOffset) 
                //    return resolve();
                if (!((-840 <= minutes <= 840) || minutes %15)) 
                    throw new Error('Timezone offset must be between +-840 and divide exactly by 15.');
                self.envOffset = minutes;
                return Promise.all([ noStore? null : managers.store.set('envOffset',minutes)]).then(function() {
                    return managers.event.dispatch('setEnvOffset', minutes);    
                }).then(resolve);
            });
        }
    };

    bless.call(coreDate);

    return coreDate.managers.store.get('envOffset').then(function(minutes) {
        coreDate.envOffsetAuto = typeof minutes !== 'number';
        return coreDate.setEnvOffset(minutes,true).then(function() {
            return coreDate;
        });
    });

};

})();
