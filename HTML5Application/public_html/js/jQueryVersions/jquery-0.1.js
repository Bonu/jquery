//"use strict";
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode (search for "function fun")
function jQuery(selector) {		// Global variable
	if (this === window ) {    // Note: "this" cannot be the Window object in strict mode. See 1.2.1 for a workaround
		return new jQuery(selector);
	} else {			// reach here if new jQuery executed.
		var elements;
	
		elements = document.querySelectorAll(selector);	// DOM
		this.length = 0;
		[].push.apply( this, elements );	// make "this" look like an array.
	}
}

var $ = jQuery;		// Global variable
