function jQuery(selector) {		// Global variable
	var m

	if ( selector && selector.constructor == Function) {
		return jQuery(document).ready(selector);
	}
	
	if (this === window ) {    // Note: "this" cannot be the Window object in strict mode. See 1.2.1 for a workaround
		return new jQuery(selector);
	} else {			// reach here if new jQuery executed.				
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
      // Remember that the DOM is ready
      jQuery.isReady = true;
			
      // If there are functions bound, to execute
      if ( jQuery.readyList ) {
         // Execute all of them
         for ( var i = 0; i < jQuery.readyList.length; i++ ) {
            jQuery.readyList[i].apply( document );
		 }		
         // Reset the list of functions
         jQuery.readyList = null;
      }
   }
}

jQuery.prototype = {   
   ready: function(f) {
      if ( jQuery.isReady ) {
         f.apply( document );  // Execute the function immediately
      } else {
         jQuery.readyList.push( f );  // Add the function to the wait list
      }
	
      return this;
   }
};

document.addEventListener("DOMContentLoaded", jQuery.ready, false);
