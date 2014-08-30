module.requires = [
    { name:'core.store.js' },
    { name:'3rdparty.moment.js'}
];

module.exports = function(app) {

    var store = app['core.store'];
    var events = app['core.events'];
    var moment = app['3rdparty.moment'];

    var language = new function() {

        var self = this;

        this.pool = {
            list : {},
            set : function(o) {
                this.list = o;
                events.dispatch('core.language','pool.set', o);
                if (! o[self.code.id]) self.code.id=null;
            },
            get : function(o) {
                return this.list;
            }
        };

        this.getNameOfId = function(id) {
            return this.pool.list[id];
        };

        this.code = {
            id : null,
            set : function(id) {
                if (id.length > 2) id = id.substr(0,3)+id.substr(3).toUpperCase();
                if (! self.pool.list[id]) return false;
                this.id = id;
                moment.lang(id);
                events.dispatch('core.language','code.set', id);
                return true;
            },
            get : function() { return this.id; }
        };

        this.mapKey = function(c) {
            if (!c) throw new Error('No object!');
            var l = self.code.id;
            if (typeof c === 'function') return c(l);
            if (typeof c !== 'object') throw new Error('Bad object: '+JSON.stringify(c));
            if (l) {
                if (c[l]) return c[l];
                var t = l.split('-');
                if (c[t[0]]) return c[t[0]];
            }
            if (c['en']) return c['en'];
            throw new Error('No language support:'+JSON.stringify(c));
        };
    };

    /* CONFIGURATION */

    // add supported languages
    language.pool.set({
        'en-US' : {
            en : 'English U.S',
            fr : 'Anglais Americaines'
        },
        fr : {
            en : 'French',
            fr : 'Français'
        }
    });

    // set based on saved value
    var id = store.get('core.language','id');
    if (! (id && language.code.set(id)) &&
        ! (language.code.set(window.navigator.userLanguage || window.navigator.language)) &&
        ! (language.code.set('en-US')) //default to English U.S
    ) throw new Error('Language failed to set');

    // save on change
    events.on('core.language','code.set', function(v) {
        store.set('core.language','id',v);
    });

    return language;
};
