//# sourceURL=core.html.js

module.exports = function() {

    "use strict";

    return {

    	to : function(v) {
	    	return v.replace(/</g,"\&lt;")
	    		.replace(/\>/g,"\&gt;")
		    	.replace(/\|/g,"\&#124;")
		    	.replace(/  /g," \&nbsp;")
		    	.replace(/'/g,"\&#39;")
		    	.replace(/"/gi,"\&quot;")
		    	.replace(/\n\n/gi,"<p>")
		    	.replace(/\n/gi,"<br>");
	    },

		from : function(v) {
			return v.replace(/\&lt;/g,"\<")
				.replace(/\&gt;/g,"\>")
				.replace(/\&#124;/g,"\|")
				.replace(/ \&nbsp;/g,"  ")
				.replace(/\&#39;/g,"\'")
				.replace(/\&#039;/g,"\'")
				.replace(/\&quot;/g,"\"");
		},

		strip : function(v) {
			var n = v.replace(/(<([^>]+)>)/ig,"")
			.replace(/\r\n/g,"")
			.replace(/\n/g,"")
			.replace(/\r/g,"")
			.replace("&nbsp;", "")
			.replace(/^\s+|\s+$/g,"");
			if (n === '<>' || n === '>' || n === '<')
				return '';
			return n;
		}

    };

};
