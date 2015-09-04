function jQuery(selector) {		// Global variable
	var m, element;
	
	if (this === window ) {    // Note: "this" cannot be the Window object in strict mode. See 1.2.1 for a workaround
		return new jQuery(selector);
	} else {			// reach here if new jQuery executed.
		m = /^[^<]*(<.+>)[^>]*$/.exec(selector);	// e.g. $("<p>")
		if ( m ) {
			element = jQuery.clean( [ m[1] ] );     // remove illegal attributes, etc.
		}
		
		this.length = 0;
		[].push.apply( this, [element] );	// make "this" look like an array.
	}
}

var $ = jQuery;		// Global variable

jQuery.clean = function(tag) {
  var div;
		
  div = document.createElement("div");
  div.innerHTML = tag;   // browser will interpret tag, cleaning it up, before it adds it to div
  return div.childNodes[0];
}

jQuery.attr = function(elem, name, value) {
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
         return this;
      } else {
      	return elem[fix[name]];		// break chaining
      }
   } else if ( elem.getAttribute ) {
      if ( value != undefined ) {
         elem.setAttribute( name, value );
         return this;
      } else {
      	return elem.getAttribute( name, 2 );
      }
    } else {
      name = name.replace(/-([a-z])/ig,function(z,b){return b.toUpperCase();});
      if ( value != undefined ) {
         elem[name] = value;
         return this;
      } else {
      	return elem[name];		// break chaining
      }
    }
}

$.prototype = {
	attr: function(key, value, type) {
	   var i;
	   if (value !== undefined) {
	      for (i=0; i<this.length; i++) {
             jQuery.attr(type ? this[i].style : this[i],
                      key, value);
          }
          return this;
       } else {
          return jQuery.attr(type ? this[0].style : this[0], key, value);
       }
	}, 
	
	css: function( key, value ) {
		return this.attr( key, value, "curCSS" );
	},
};
