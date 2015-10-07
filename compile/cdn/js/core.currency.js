//# sourceURL=core.currency.js

module.requires = [
    { name : 'core.currency.css' },
    { name : 'core.store.js' },
    { name : 'core.country.js' },
    { name : 'core.url.js' }
];

module.exports = function(app, params) {

    "use strict";

    var store = app['core.store'],
        country = app['core.country'],
        dom = app['core.dom'],
        url = app['core.url'],
        bless = app['core.object'].bless;

    var detect = function() {
        return currency.managers.store.get('env').then(function (stored) {
            var set = false;
            return promiseSequencer([
                stored,
                params.conf.localeCurrency,
                url.getParam('localeCurrency'),
                country.env && country.pool[country.env] && country.pool[country.env].currency? country.pool[country.env].currency[0] : null,
                'USD'
            ], function(b,i) {
                if (! set)
                    return currency.setEnv(b,true).then(
                        function() {
                            currency.isAuto = i !== 0;
                            set = true;
                        },
                        function () { }
                    );
            }).then(
                function () {
                    if (! set)
                        throw new Error('Currency failed to set');
                }
            );
        });
    };

    var currency = {

        name:'core.currency',
        managers : {
            store : store
        },
        env : null,
        isAuto : null,
        pool : {},
        setPool : function(o) {
            this.pool = o;
            return this.managers.event.dispatch('setPool');
        },
        setEnv : function(id,noStore) {
            var self = this,
                managers = self.managers;
            return Promise.resolve().then(function() {
                if (! self.pool[id])
                    throw new Error('Code is not in pool.');
                self.env = id;
                if (! noStore)
                    self.isAuto = false;
                return (noStore? Promise.resolve() : managers.store.set('env',id)).then(function() {
                    return managers.event.dispatch('setEnv',id);
                });
            });
        },

        reset : function() {
            var self = this;
            return this.managers.store.set('env').then(function() {
                self.isAuto = true;
                return detect();
            });
        },

        validate : function(s,o) {
            return new RegExp(o && o.allowNeg? /^-?\d+(\.\d{2})?$/ : /^\d+(\.\d{2})?$/).test(String(s).trim());
        },

        getFromPoolById : function(id) {
            return this.pool[id.toUpperCase()];
        },

        normalize : function(v) {
            return parseFloat(Math.round(v * 100) / 100).toFixed(2);
        },

        commarize : function(v) {
            var t = parseFloat(v),
                isNeg = t < 0;
            if (isNeg)
                t *= -1;
            t+= '';
            var o = t.split('.',2);
            t = o[0]
                .split('')
                .reverse()
                .join('')
                .match(/.{1,3}/g)
                .join(',')
                .split('')
                .reverse()
                .join('');
            if (o.length === 2)
                t += '.' + o[1];
            return isNeg? '-'+t:t;
        },

        colorize : function(v,q) {
            v = parseFloat(v);
            return dom.mk('span',null,q,function() {
                if (v !== 0)
                    this.className = 'core-currency-' + (v>0? 'positive': 'negative');
            });
        },

        format : function(v,o) {
            v = o && o.noNormalize? parseFloat(v) : this.normalize(v);
            var c = o && o.type? o.type : this.env,
                f = this.pool[c].format,
                q = f? f(v,o) : (v < 0? '-': '') + this.pool[c].symbol + this.commarize(v < 0? v*-1 : v);
            if (o && o.colorize)
                q = this.colorize(v, q);
            return dom.mk('span',null,q,'core-currency-formatted');
        }

    };

    bless.call(currency);

    currency.managers.event.on('setPool', function() {
        return detect();
    });

    return currency;

};
