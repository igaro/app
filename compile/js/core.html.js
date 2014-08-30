module.exports = function(app) {

    return {

    	to : function(v) {
	    	var o = v.replace(/\</g,"\&lt;"); 
	    	o = o.replace(/\>/g,"\&gt;"); 
	    	o = o.replace(/\|/g,"\&#124;"); 
	    	o = o.replace(/  /g," \&nbsp;"); 
	    	o = o.replace(/'/g,"\&#39;");
	    	o = o.replace(/"/gi,"\&quot;");
	    	o = o.replace(/\n\n/gi,"<p>");
	    	o = o.replace(/\n/gi,"<br>");
	    	return o;
	    },

		from : function(v) { 
			var o = t.replace(/\&lt;/g,"\<");
			o = o.replace(/\&gt;/g,"\>");
			o = o.replace(/\&#124;/g,"\|");
			o = o.replace(/ \&nbsp;/g,"  ");
			o = o.replace(/\&#39;/g,"\'");
			o = o.replace(/\&#039;/g,"\'");
			o = o.replace(/\&quot;/g,"\"");
			return o;
		},
		
		strip : function(v) { 
			var n = v.replace(/(<([^>]+)>)/ig,"");
			n = n.replace(/\r\n/g,"");
			n = n.replace(/\n/g,"");
			n = n.replace(/\r/g,"");
			n = n.replace("&nbsp;", "");
			n = n.replace(/^\s+|\s+$/g,"");
			if (n == '<>' || n == '>' || n == '<') n = '';
			return n;
		}

    }

};