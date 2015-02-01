module.requires = [
    { name : 'core.currency.css' },
    { name : 'core.store.js' },
    { name : 'core.country.js' }
];

module.exports = function(app) {

    var events = app['core.events'],
        store = app['core.store'],
        country = app['core.country'],

    currency = {

        pool : {
            list : {},
            set : function(o) {
                this.list = o;
                events.dispatch('core.currency','pool.set', o);
                if (! o[currency.code.id]) 
                    currency.code.id=null;
            },
            get : function(o) {
                return this.list;
            }
        },
        
        code : {
            id : null,
            set : function(o) {
                if (! currency.pool.list[o]) 
                    return false;
                this.id = o;
                events.dispatch('core.currency','code.set', o);
                return true;
            },
            get : function() { 
                return this.id; 
            }
        },

        validate : function(s,o) {
            if (o && o.allowNeg) 
                return RegExp(/^-?\d+(\.\d{2})?$/).test(String(s).trim());
            return RegExp(/^\d+(\.\d{2})?$/).test(String(s).trim());
        },

        decimalise : function(o) {
            o = Math.round(parseFloat(o)*100)/100;
            o = o+'';
            if (o.indexOf('.') == -1) 
                return o+'.00';
            if (o.substr(o.length-2,1) == '.') 
                return o+'0';
            return o;
        },

        getNameOfId : function(id) {
            return this.pool.list[id].name;
        },

        commarize : function(v) {
            v = parseFloat(v);
            var isNeg = v < 0;
            if (isNeg)
                v *= -1;
            v+= '';
            var o = v.split('.',2), 
                t = '';
            for (var i=o[0].length;i>3;i-=3) { 
                t += ','+o[0].substr(i-3,3); 
            } 
            t = o[0].substr(0,i)+t;
            if (o.length === 2)
                t += '.' + o[1]; 
            return isNeg? '-'+t:t;
        },

        colorize : function(v, q) {
            if (v > 0)
                return '<span class="core-currency-positive">'+q+'</span>';
            if (v < 0)
                return '<span class="core-currency-negative">'+q+'</span>';
        },

        format : function(v,o) {
            var c = o && o.type? o.type : this.code.id,
                f = this.pool.list[c].format,
                q = f? f(v,o) : (v < 0? '-': '') + this.pool.list[c].symbol + this.commarize(v < 0? v*-1: v);
            if (o && o.colorize)
                q = this.colorize(v, q);
            return q;
        }

    };

    // add supported currencies - use ISO 4217
    currency.pool.set({
        USD : {
            symbol : '$',
            name : {
                en : 'United States Dollar',
                fr : 'Dollar Américain'
            }
        },
        GBP : {
            symbol : '£',
            name : {
                en : 'British Sterling',
                fr : 'Sterling Britannique'
            }
        },
        AUD : {
            symbol : '$',
            name : {
                en : 'Australian Dollar',
                fr : 'Dollar Australien'
            },
            format : function(v,o) {
                var x = (v<0?'-':'')+ 'A$'+currency.commarize(v < 0? v*-1: v);
                if (o && o.colorize) {
                    x = currency.colorize(v,x);
                }
                return x;
            }
        },
        EUR : {
            symbol : '€',
            name : {
                en : 'Euro'
            }
        }
    });

    /* CONFIGURATION */

    // set based on saved value
    var id = store.get('core.currency','id');
    if (
        ! (id && currency.code.set(id)) &&
        ! ((function () { // set based on country value
            var c = country.code.get();
            if (c && country.pool.list[c].currency && currency.code.set(country.pool.list[c].currency)) 
                return true;
        })()) &&
        ! (currency.code.set('USD')) //default to U.S dollar
    ) throw new Error('Currency failed to set');

    // save on change
    events.on('core.currency','code.set', function(v) {
        store.set('core.currency','id',v);
    });

    return currency;

};
