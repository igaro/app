//# sourceURL=instance.date.js

(function(env) {

    module.requires = [
        { name:'core.date.js'},
        { name:'core.language.js'},
        { name:'3rdparty.moment.js'}
    ];

    module.exports = function(app) {

        "use strict";

        var date = app['core.date'],
            dom = app['core.dom'],
            moment = app['3rdparty.moment'],
            language = app['core.language'],
            bless = app['core.object'].bless;

        var dateEventMgr = date.managers.event,
            languageEventMgr = language.managers.event;

        /* Date Widget - not to be confused with the date library. This disconnects moment js
         * @constructor
         * @param {object} [o] config literal
         * @returns {InstanceDate}
         */
        var InstanceDate = function(o) {

            o = o || {};
            this.name='instance.date';
            this.asRoot=true;
            this.date = o.date;
            this.countUp = typeof o.countUp === 'number'? o.countUp : 0;
            this.countDown = typeof o.countDown === 'number'? o.countDown : 60;
            this.container=function(dom) {

                return dom.mk('span',o,null,o.className);
            };

            bless.call(this,o);

            var self = this,
                m = self.moment = moment(o.date),
                erf = {
                    lang : function() {

                        m.lang(language.env);
                        self.format();
                    },
                    tzoffset : function() {

                        if (! self.ov)
                            self.offset(date.envOffset,true);
                    }
                };

            if (o.format)
                this.formatCode = o.format;

            if (o.offset) {
                this.offset(o.offset);
            } else {
                this.offset(date.envOffset,true);
            }

            dateEventMgr.on('setEnvOffset',erf.tzoffset, { deps:[this] });
            languageEventMgr.on('setEnv',erf.lang, { deps:[this] });
            erf.lang();

            if (o.relative)
                this.relative();

            this.managers.event.on('destroy', function() {

                removeInterval(self.__relHook);
            });
        };

        /* Async constructor
         * @param {object} [o] config literal
         * @returns {Promise}
         */
        InstanceDate.prototype.init = function(o) {

            return this.managers.event.dispatch('init');
        };

        /* Sets the date
         * @param {Date} date
         * @returns {Promise}
         */
        InstanceDate.prototype.set = function(date) {

            if (!(date instanceof Date))
                throw new TypeError("First argument must be instance of Date");

            this.date = date;
            this.moment = moment(date);
            this.format();
            return this.managers.event.dispatch('set',date);
        };

        /* Sets the timezone offset
         * @param {number} offset - in minutes
         * @param {boolean} nostore - defines whether the offset should be retained, default true
         * @returns {null}
         */
        InstanceDate.prototype.offset = function(offset,nostore) {

            this.moment.zone(offset);
            if (! nostore)
                this.ov = offset;
            this.format();
        };

        /* Sets the view to be relative, i.e 'n seconds ago' rather than the absolute time.
         * @returns {null}
         */
        InstanceDate.prototype.relative = function() {

            var self = this,
                container = self.container;

            var formatter = function() {

                var date = self.date,
                    diff = parseInt((date.getTime()-(new Date()).getTime()) / 1000);
                if (diff !== 0) {
                    if (diff < 0 && self.countUp >= (diff*-1)) {

                        diff *= -1;
                        return dom.setContent(container,language.mapKey(language.substitute(diff === 1? _tr("%[0] second ago") : _tr("%[0] seconds ago"),diff)));
                    } else if (diff > 0 && diff <= self.countDown) {

                        return dom.setContent(container,language.mapKey(language.substitute(diff === 1? _tr("%[0] second") : _tr("%[0] seconds"),diff)));
                    }
                }
                dom.setContent(container,self.moment.fromNow());
            };

            formatter();
            this.__relHook = setInterval(formatter,1000);
        };

        /* Sets the view middleware - see moment.js codes!
         * @param {*} code
         * @returns {null}
         */
        InstanceDate.prototype.format = function(code) {

            if (code)
                this.formatCode = code;
            this.container.innerHTML = this.moment.format(this.formatCode);
        };

        return InstanceDate;

    };

})(this);
