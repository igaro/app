module.requires = [
    { name:'core.store.js' },
    { name:'core.country.js' }
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
                if (! self.pool.list[o]) 
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
            if (o && o.allowneg) 
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
    /* var id = store.get('core.currency','id');
    if (
        ! (id && currency.code.set(id)) &&
        ! ((function () { // set based on country value
            var c = country.code.get();
            if (c && country.pool.list[c].currency && currency.code.set(country.pool.list[c].currency)) return true;
        })()) &&
        ! (currency.code.set('USD')) //default to U.S dollar
    ) throw new Error('Currency failed to set');

    // save on change
    events.on('core.currency','code.set', function(v) {
        store.set('core.currency','id',v);
    });

     */

    return currency;

   
};
