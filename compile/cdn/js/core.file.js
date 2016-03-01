//# sourceURL=core.file.js

(function(env) {

    "use strict";

    module.exports = function() {

        // service
        return {

            /* Provides an indicative bit of text after the size
             * @param {number} bytes
             * @returns (string} sane representation
             */
            formatSize : function(v) {

                if (typeof v !== 'number')
                    throw new TypeError('First argument must be of type number');

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

            /* Returns the extension for a filename
             * @param {string} filename
             * @returns (string} extension
             */
            getExtension : function(f) {

                if (typeof f !== 'string')
                    throw new TypeError('First argument must be of type string');

                var e = /^.+\.([^.]+)$/.exec(f.toUpperCase());
                return e === null? '' : e[1];
            }

        };
    };

})(this);
