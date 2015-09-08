function jQuery(selector) {		// Global variable
	var m, elements;
	
	if (this === window ) {    // Note: "this" cannot be the Window object in strict mode. See 1.2.1 for a workaround
		return new jQuery(selector);
	} else {			// reach here if new jQuery executed.
		elements = document.querySelectorAll(selector);		
		this.length = 0;
		[].push.apply( this, elements );	// make "this" look like an array.
	}
}

var $ = jQuery;		// Global variable

jQuery.fn = jQuery.prototype;  // to simplify typing

jQuery.extend = jQuery.fn.extend = function(obj,prop) {  // define extend function
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

jQuery.extend(   // Add "static" functions "each" and "attr" to jQuery
  {
	each: function( obj, fn, args ) {
       if ( obj.length == undefined ) {
          for ( var i in obj ) {
             fn.apply( obj[i], args || [i, obj[i]] );
          }
        } else {
          for ( var i = 0; i < obj.length; i++ ) {
				fn.apply( obj[i], args || [i, obj[i]] );
          }
        }
		return obj;
	}, // end each
	
    attr: function(elem, name, value) {
       var fix = {
          "for": "htmlFor",
          "class": "className",
          "float": "cssFloat",
          innerHTML: "innerHTML",
          className: "className"
       };

       if ( fix[name] ) {
          if ( value != undefined ) {
             elem[fix[name]] = value; 
          }
          return elem[fix[name]];
       } else if ( elem.getAttribute ) {
          if ( value != undefined ) {
             elem.setAttribute( name, value );
          }
          return elem.getAttribute( name, 2 );
       } else {
          name = name.replace(/-([a-z])/ig,function(z,b){return b.toUpperCase();});
          if ( value != undefined ) {
             elem[name] = value;
          }
          return elem[name];
       }
    }  // end attr
  }  // end extend argument
);  // end jQuery.extend invocation


// This should be added by extend
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


// add functions each, attr and css to jQuery.prototype
jQuery.fn.extend({
   each: function( fn, args ) {
      return jQuery.each( this, fn, args );
   },

   attr: function(key, value, type) {
      if (value !== undefined) {
         return this.each(function() {jQuery.attr(type ? this.style : this, key, value);});
	  } else {
	     return jQuery.attr(type ? this[0].style : this[0], key);
	  }
	}, 

   bind: function(type, fn) {
      var numElements, i;
      numElements = this.length;
      for (i=0; i<numElements; i++) {
      	jQuery.event.add( this[i], type, fn );
      }
      return this;  // for chaining
   },
	
   css: function( key, value ) {
      return this.attr( key, value, "curCSS" );
   },
  }  // end jQuery.fn.extend argument
); // end jQuery.fn.extend invocation

// Self-invoking anonymous function (to allow e to be a local variable)
(function(){
   var e = ("blur,focus,load,resize,scroll,unload,click,dblclick," +
            "mousedown,mouseup,mousemove,mouseover,mouseout,change,reset,select," + 
            "submit,keydown,keypress,keyup,error").split(",");

   // Go through all the event names
   for ( var i = 0; i < e.length; i++ ) new function(){			
      var o = e[i];  // since new called, o will be at different address each time.		
      // Handle event binding
      jQuery.fn[o] = function(f){
         return this.bind(o, f);   // o is in closure.
      };		
   };
})();


/* Another way to do it (new will call function)
new function(){
   var e = ("blur,focus,load,resize,scroll,unload,click,dblclick," +
            "mousedown,mouseup,mousemove,mouseover,mouseout,change,reset,select," + 
            "submit,keydown,keypress,keyup,error").split(",");

   // Go through all the event names
   for ( var i = 0; i < e.length; i++ ) new function(){			
      var o = e[i];		
      // Handle event binding
      jQuery.fn[o] = function(f){
         return this.bind(o, f);
      };		
   };
}
*/

