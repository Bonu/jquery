function jQuery(selector) {		// Global variable
	var m, element;
	
	if (this === window ) {    // Note: "this" cannot be the Window object in strict mode. See 1.2.1 for a workaround
		return new jQuery(selector);
	} else {			// reach here if new jQuery executed.
		m = /^[^<]*(<.+>)[^>]*$/.exec(selector);
		if ( m ) {
			element = jQuery.clean( [ m[1] ] );
		}
		
		this.length = 0;
		[].push.apply( this, [element] );	// make "this" look like an array.
	}
}

var $ = jQuery;		// Global variable

$.clean = function(tag) {
  var div;
		
  div = document.createElement("div");
  div.innerHTML = tag;
  return div.childNodes[0];
}

$.prototype = {
	html: function(text) {
		var i, len, el;
		len = this.length;
		for (i=0; i<len; i++) {		// because "this" is array-like
			el = this[i];
			el.innerHTML = text;	// DOM
		}
	}, 
};
