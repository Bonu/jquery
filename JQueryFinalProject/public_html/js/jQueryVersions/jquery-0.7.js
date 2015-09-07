function jQuery(selector) {		// Global variable
	var elements;
	
	if (this === window ) {    // Note: "this" cannot be the Window object in strict mode. See 1.2.1 for a workaround
		return new jQuery(selector);
	} else {			// reach here if new jQuery executed.
		elements = document.querySelectorAll(selector);		
		this.length = 0;
		[].push.apply( this, [element] );	// make "this" look like an array.
	}
}

var $ = jQuery;		// Global variable

jQuery.extend = jQuery.prototype.extend = function(obj,prop) {
	var i;

	if (prop === undefined) { 
		prop = obj; 
		obj = this; 
	}
	
	for (i in prop ) {
		obj[i] = prop[i];
	}
	
	return obj;
};

jQuery.extend(
	{
	ajax: function( type, url, data, ret, ifModified ) {
		// If only a single argument was passed in,
		// assume that it is a object of key/value pairs
		if ( !url ) {
			ret = type.complete;
			var success = type.success;
			var error = type.error;
			data = type.data;
			url = type.url;
			type = type.type;
		}
		
		// Watch for a new set of requests
		if ( ! jQuery.active++ )
			jQuery.event.trigger( "ajaxStart" );

		var requestDone = false;
	
		// Create the request object
		var xml = new XMLHttpRequest();
	
		// Open the socket
		xml.open(type || "GET", url, true);
		
		// Set the correct header, if data is being sent
		if ( data )
			xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		
		// Set the If-Modified-Since header, if ifModified mode.
		if ( ifModified )
			xml.setRequestHeader("If-Modified-Since",
				jQuery.lastModified[url] || "Thu, 01 Jan 1970 00:00:00 GMT" );
		
		// Set header so calling script knows that it's an XMLHttpRequest
		xml.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	
		// Make sure the browser sends the right content length
		if ( xml.overrideMimeType )
			xml.setRequestHeader("Connection", "close");
		
		// Wait for a response to come back
		var onreadystatechange = function(istimeout){
			// The transfer is complete and the data is available, or the request timed out
			if ( xml && (xml.readyState == 4 || istimeout == "timeout") ) {
				requestDone = true;

				var status = jQuery.httpSuccess( xml ) && istimeout != "timeout" ?
					ifModified && jQuery.httpNotModified( xml, url ) ? "notmodified" : "success" : "error";
				
				// Make sure that the request was successful or notmodified
				if ( status != "error" ) {
					// Cache Last-Modified header, if ifModified mode.
					var modRes = xml.getResponseHeader("Last-Modified");
					if ( ifModified && modRes ) jQuery.lastModified[url] = modRes;
					
					// If a local callback was specified, fire it
					if ( success ) success( xml, status );
					
					// Fire the global callback
					jQuery.event.trigger( "ajaxSuccess" );
				
				// Otherwise, the request was not successful
				} else {
					// If a local callback was specified, fire it
					if ( error ) error( xml, status );
					
					// Fire the global callback
					jQuery.event.trigger( "ajaxError" );
				}
				
				// The request was completed
				jQuery.event.trigger( "ajaxComplete" );
				
				// Handle the global AJAX counter
				if ( ! --jQuery.active )
					jQuery.event.trigger( "ajaxStop" );
	
				// Process result
				if ( ret ) ret(xml, status);
				
				// Stop memory leaks
				xml.onreadystatechange = function(){};
				xml = null;
				
			}
		};
		xml.onreadystatechange = onreadystatechange;
		
		// Timeout checker
		if(jQuery.timeout > 0)
			setTimeout(function(){
				// Check to see if the request is still happening
				if (xml) {
					// Cancel the request
					xml.abort();

					if ( !requestDone ) onreadystatechange( "timeout" );

					// Clear from memory
					xml = null;
				}
			}, jQuery.timeout);
		
		// Send the data
		xml.send(data);
	},

}  // {...})
);  // end jQuery.extend({...});

