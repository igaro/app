{
    "USD" : {
        "symbol" : "$",
        "name" : function() { return this.gettext("United States Dollar"); }
    },
    "GBP" : {
        "symbol" : "£",
        "name" : function() { return this.gettext("British Sterling"); }
    },
    "AUD" : {
        "symbol" : "$",
        "name" : function() { return this.gettext("Australian Dollar"); },
        "format" : function(v,o) {
            var x = v <0? "-":"";
            x += "A$"+currency.commarize(v < 0? v*-1: v);
            return o && o.colorize? currency.colorize(v,x) : x;
        }
    },
    "EUR" : {
        "symbol" : "€",
        "name" : function() { return this.gettext("Euro"); }
    }
}
