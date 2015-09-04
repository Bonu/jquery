function jQuery(selector) {		// Global variable
	var doc;
	if ( selector && selector.constructor == Function) {
		doc = jQuery(document);
		return doc.ready(selector);
	}
	
	if (this === window ) {    // Note: "this" cannot be the Window object in strict mode. See 1.2.1 for a workaround
		return new jQuery(selector); // Note: selector in this example will be document, not a css selector
	} else {  // reach here if new jQuery executed.				
		this.length = 0;
		[].push.apply( this, [selector] );	// make "this" look like an array.
	}
}

var $ = jQuery;		// Global variable

jQuery.readyList = [];
jQuery.isReady = false;
jQuery.ready = function() {   // Handle when the DOM is ready
   // Make sure that the DOM is not already loaded
   if ( !jQuery.isReady ) {
      jQuery.isReady = true; // Remember that the DOM is ready
			
      if ( jQuery.readyList ) {  // if there are functions awaiting execution
         for ( var i = 0; i < jQuery.readyList.length; i++ ) { // Execute all of them
            jQuery.readyList[i].apply( document );		// value of "this" will be document
		 }		
         jQuery.readyList = null;  // Reset the list of functions

      }
   }
}

jQuery.prototype = {   
   ready: function(f) {
      if ( jQuery.isReady ) {
         f.apply( document );  // Execute the function immediately in document context
      } else {
         jQuery.readyList.push( f );  // Add the function to the wait list
      }
	
      return this;
   }
};

// This works for chrome. jquery-1.0.js checks browser to determine what event to use.
document.addEventListener("DOMContentLoaded", jQuery.ready, false);
