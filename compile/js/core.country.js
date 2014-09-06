module.requires = [
    { name:'core.store.js' }
];

module.exports = function(app) {

    var events = app['core.events'],
        store = app['core.store'],
    
    country = {

        pool : {
            list : {},
            set : function(o) {
                this.list = o;
                events.dispatch('core.country','pool.set', o);
                if (! o[country.code.id]) 
                    country.code.id=null;
            },
            get : function() {
                return this.list;
            }
        },

        code : {
            id : null,
            set : function(id) {
                if (! country.pool.list[id]) 
                    return false;
                this.id = id;
                events.dispatch('core.country','code.set', id);
                return true;
            },
            get : function() { 
                return this.id; 
            }
        },

        getNameOfId : function(id) {
            return this.pool.list[id].name;
        }

    };

    /* CONFIGURATION */

    // add supported countries - iso 3166-2
    country.pool.set({
        us : {
            currency : 'USD',
            language : 'en-US',
            name : {
                en : 'United States',
                fr : 'États-Unis'
            }
        },
        fr : {
            currency : 'EUR',
            language : 'fr',
            name : {
                en : 'France',
                fr : 'Francais'
            }
        },
    });

    // set based on saved value
    var id = store.get('core.country','id');
    if (! country.code.set(id) &&
        ! (__igaroapp.geocountry && country.code.set(__igaroapp.geocountry)) &&
        ! ((function () { // attempt to set using navigator.language
            var n = window.systemLanguage || window.navigator.language;
            if (n.length > 3) n=n.substr(3).toLowerCase();
            return country.code.set(n);
        })()) && 
        ! country.code.set('us')
    ) throw new Error('Country failed to set');

    // save on modify
    events.on('core.country','code.set', function(v) {
        store.set('core.country','id',v);
    });

    return country;

};
