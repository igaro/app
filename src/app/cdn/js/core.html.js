//# sourceURL=core.html.js

(function(env) {

    "use strict";

    module.exports = function() {

        return {

            /* Encodes HTML
             * @param {string} v - text to replace
             * @returns {string}
             */
            to : function(v) {

                if (typeof v !== 'string')
                    throw new TypeError('First argument must be of type string');

                return v.replace(/</g,"\&lt;")
                    .replace(/\>/g,"\&gt;")
                    .replace(/\|/g,"\&#124;")
                    .replace(/  /g," \&nbsp;")
                    .replace(/'/g,"\&#39;")
                    .replace(/"/gi,"\&quot;")
                    .replace(/\n\n/gi,"<p>")
                    .replace(/\n/gi,"<br>");
            },

            /* Decodes HTML
             * @param {string} v - text to replace
             * @returns {string}
             */
            from : function(v) {

                if (typeof v !== 'string')
                    throw new TypeError('First argument must be of type string');

                return v.replace(/\&lt;/g,"\<")
                    .replace(/\&gt;/g,"\>")
                    .replace(/\&#124;/g,"\|")
                    .replace(/ \&nbsp;/g,"  ")
                    .replace(/\&#39;/g,"\'")
                    .replace(/\&#039;/g,"\'")
                    .replace(/\&quot;/g,"\"");
            },

            /* Strips HTML
             * @param {string} v - text to replace
             * @returns {string}
             */
            strip : function(v) {

                if (typeof v !== 'string')
                    throw new TypeError('First argument must be of type string');

                v = v.replace(/(<([^>]+)>)/ig,"")
                    .replace(/\r\n/g,"")
                    .replace(/\n/g,"")
                    .replace(/\r/g,"")
                    .replace("&nbsp;", "")
                    .replace(/^\s+|\s+$/g,"");

                return v === '<>' || v === '>' || v === '<'? '' : v;
            }

        };

    };

})(this);
