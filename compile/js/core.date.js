module.requires = [
    { name:'core.store.js'}
];

module.exports = function(app) {

    var store = app['core.store'],
        events = app['core.events'],

    date = {
 
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
            date = new Date(date.valueOf() + (date.getTimezoneOffset()*60000) + (this.offset.get()*60000) );
            return date;
        },
    
        strip : function(o) { 
            var str = typeof o === 'date'? o.valueOf() : o;
            return str.replace(/[^0-9]/g, ''); 
        },
    
        offset : {
            minutes : new Date().getTimezoneOffset()*-1,
            set : function(minutes) {
                if (minutes === 'undefined') 
                    minutes = new Date().getTimezoneOffset() * -1;
                if (minutes === this.minutes) 
                    return true;
                if (!(-840 <= minutes <= 840) || minutes %15) 
                    return false;
                this.minutes = minutes;
                console.log(events);
                events.dispatch('core.date','offset.set', minutes);
                return true;
            },
            get : function() { 
                return this.minutes; 
            }
        }

    };

    /* CONFIGURATION */

    // set based on saved value
    var id = store.get('core.date','offset');
    if (id) 
        date.offset.set(id);

    // save on modified
    events.on('core.date','offset.set', function(m) {
        store.set('core.date','offset',m);
    });

    return date;

};