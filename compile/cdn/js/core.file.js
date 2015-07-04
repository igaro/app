//# sourceURL=core.file.js

module.exports = function() {

    "use strict";

    return {

        formatSize : function(v) {
            if (v < 1000000)
                return (v/1000).toFixed(2)+'Kb';
            if (v < 1000000000)
                return (v/1000000).toFixed(2)+'Mb';
            if (v < 1000000000000)
                return (v/1000000000).toFixed(2)+'Gb';
            if (v < 1000000000000000)
                return (v/1000000000000).toFixed(2)+'Tb';
            return v;
        },

        getExtension : function(f) {
            var e = /^.+\.([^.]+)$/.exec(f.toUpperCase());
            return e === null? '' : e[1];
        }

    };

};
