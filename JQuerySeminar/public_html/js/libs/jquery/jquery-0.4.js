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

jQuery.event = {
    guid:0,

	add: function(element, type, handler) {
      // Make sure that the function being executed has a unique ID
      if ( !handler.guid ) {
         handler.guid = this.guid++;
      }
				
      // Init the element's event structure
      if (!element.events) {
         element.events = {};
      }		
	
	  // Get the current list of functions bound to this event
      var handlers = element.events[type];
			
      // If it hasn't been initialized yet
      if (!handlers) {
         // Init the event handler queue
         handlers = element.events[type] = {};
      }				
      // Add the function to the element's handler list
      handlers[handler.guid] = handler;
			
      // And bind the global event handler to the element
      element["on" + type] = this.handle;	
   },
   handle: function(event) {
      var c, j, returnValue;
      
      returnValue = true;
      c = this.events[event.type];
      for ( j in c ) {
         if ( c[j].apply( this, [event] ) === false ) {
            event.preventDefault();
            event.stopPropagation();
            returnValue = false;
         }
      }			
      return returnValue;      
   }
}

$.prototype = {
   bind: function(type, fn) {
      var numElements, i;
      numElements = this.length;
      for (i=0; i<numElements; i++) {
      	jQuery.event.add( this[i], type, fn );
      }
   },
   click: function(f) {
      return this.bind("click", f);
   },
};
