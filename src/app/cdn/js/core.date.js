//# sourceURL=core.date.js

module.requires = [
    { name: 'core.store.js' }
];

module.exports = function(app) {

    "use strict";

    var store = app['core.store'],
        bless = app['core.object'].bless;

    // service
    var coreDate = {

        name:'core.date',
        managers : {
            store : store
        },
        envOffset : new Date().getTimezoneOffset()*-1,

        /* Works out if a year is a leap
         * @param {number} t - year to use
         * @returns {boolean}
         */
        isLeapYear : function(y) {

            return (new Date(y,1,29).getDate() === 29)? true:false;
        },

        /* Works out how many days in a month
         * @param {number} y - year to use
         * @param {number} m - month to use
         * @returns {number}
         */
        daysInMonth : function (y,m) {

            if (m === 4 || m === 6 || m === 9 || m === 11)
                return 30;
            if (m === 2)
                return (this.isLeapYear(y))? 29:28;
            return 31;
        },

        /* Supplies a date object with the users timezone offset applied
         * @param {(string|Date)} tz - date to offset
         * @returns {Date}
         */
        userTz : function(tz) { //ISO 8601

            var date = typeof tz === 'string'? new Date(tz) : tz;

            if (! (date instanceof Date))
                throw new TypeError("Invalid parameter passed to function. Use string or date object.");

            date = new Date(date.valueOf() + (date.getTimezoneOffset()*60000) + (this.envOffset*60000) );
            return date;
        },

        /* Resets the active code to the system default (browser supplied)
         * @returns {Promise} containing the detected code
         */
        resetEnvOffset : function() {

            var self = this;
            return this.managers.store.set('envOffset').then(function() {
                return self.setEnvOffset(null,true);
            });
        },

        /* Set env Offset
         * @param {number} [minutes] - offset to use. If null, uses automatic
         * @param {boolean} [noStore] - don't store the code for persistance. Default false.
         * @returns {Promise}
         */
        setEnvOffset : function(minutes, noStore) {

            var self = this,
                managers = this.managers;
            return Promise.resolve().then(function() {

                if (typeof minutes !== 'number')
                    minutes = new Date().getTimezoneOffset() * -1;

                if (!((-840 <= minutes <= 840) || minutes %15))
                    throw new Error('Timezone offset must be between +-840 and divide exactly by 15.');

                self.envOffset = minutes;
                return (noStore? Promise.resolve() : managers.store.set('envOffset',minutes)).then(function() {

                    return managers.event.dispatch('setEnvOffset', minutes);
                });
            });
        }
    };

    // bless service
    bless.call(coreDate);

    // get offset and return service
    return coreDate.managers.store.get('envOffset').then(function(minutes) {

        return coreDate.setEnvOffset(minutes,true).then(function() {
            return coreDate;
        });
    });

};
