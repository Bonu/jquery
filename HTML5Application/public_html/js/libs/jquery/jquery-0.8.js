function jQuery(selector) {		// Global variable
	var m, elements;
	
	if (this === window ) {    // Note: "this" cannot be the Window object in strict mode. See 1.2.1 for a workaround
		return new jQuery(selector);
	} else {			// reach here if new jQuery executed.
//		elements = document.querySelectorAll(selector);		
		elements = jQuery.find(selector);
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
	init: function(){
		jQuery.initDone = true;
		
		// attr convenience functions
		jQuery.each( jQuery.macros.attr, function(jqName,domName){
			domName = domName || jqName;
			jQuery.fn[ jqName ] = function(value) {
				return value == undefined ?
					this.length ? this[0][domName] : null :
					this.attr(domName, value);
			};
		});
		
		// css convenience functions
		jQuery.each( jQuery.macros.css, function(i,cssName){
			jQuery.fn[ cssName ] = function(value) {
				return value == undefined ?
					( this.length ? this.css(cssName ) : null ) :
					this.css( cssName, value );
			};
		});		
	},
	
	find: function(t) {	// t is the css selector
		var ret = [document];
		var done = [];
		var last = null;
	
		while ( t.length > 0 && last != t ) {
			var r = [];
			last = t;
			var foundToken = false;
			for ( var i = 0; i < jQuery.token.length; i += 2 ) {
				var re = new RegExp("^(" + jQuery.token[i] + ")");
				var m = re.exec(t);
				
				if ( m ) {
					r = ret = jQuery.map( ret, jQuery.token[i+1] );
					t = t.replace( re, "" ).trim();
					foundToken = true;
				}
			}
			
			if (!foundToken) {
				if (t.indexOf(",") === 0) {  // begins with ,
					done = jQuery.merge( done, ret );
					r = ret = [];
					t = " " + t.substr(1, t.length);  // get rid of ,
				} else {
					var re2 = /^([#.]?)([a-z0-9\\*_-]*)/i;
					var m = re2.exec(t);
		
					if ( m[1] == "#" ) {  // looking for id
						var oid = document.getElementById(m[2]);
						r = ret = oid ? [oid] : [];
						t = t.replace( re2, "" );  // replace what got matched
					} else {
						for ( var i = 0; i < ret.length; i++ ) {
							r = jQuery.merge( r,
								m[1] === "." ?
									jQuery.getAll(ret[i]) :
									ret[i].getElementsByTagName(m[2])
							);
						}
					}
				}
			}
	
			if ( t ) {
				var val = jQuery.filter(t,r);
				ret = r = val.r;
				t = val.t.trim();
			}			
		}
	
		done = jQuery.merge( done, ret );
	
		return done;
	},
	
	
	filter: function(t, r) {
		var re = /^([:.#]*)([a-z*_-][a-z0-9_-]*)/i
		while ( t && /^[a-z[({<*:.#]/i.test(t) ) {
			var m = re.exec(t);
			t = t.replace( re, "" );		// remove what we just matched
			var f = jQuery.expr[m[1]];
			if ( f.constructor != String ) {
				f = jQuery.expr[m[1]][m[2]];
			}					
			// Build a custom macro to enclose it
			eval("f = function(a,i){" + 
					( m[1] == "@" ? "z=jQuery.attr(a,m[3]);" : "" ) + 
					"return " + f + "}");
				
			// Execute it against the current filter
			r = jQuery.grep( r, f );
		}
		// Return an array of filtered elements (r)
		// and the modified expression string (t)
		return { r: r, t: t };
	},

	merge: function(first, second) {
		var result, i;
		
		result = [];
		
		for (i = 0; i < first.length; i++) {
			result.push(first[i]);
		}

		for (i = 0; i < second.length; i++) {
			result.push(second[i]);
		}
		return result;		
	},
	
	grep: function(elems, fn) {
		// If a string is passed in for the function, make a function
		// for it (a handy shortcut)
		if ( fn.constructor == String )
			fn = new Function("a","i","return " + fn);
			
		var result = [];
		
		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0; i < elems.length; i++ )
			if (fn(elems[i],i)) {
				result.push( elems[i] );
			}
		
		return result;
	},
	
	map: function(elems, fn) {
		// If a string is passed in for the function, make a function
		// for it (a handy shortcut)
		if ( fn.constructor == String )
			fn = new Function("a","return " + fn);
		
		var result = [];
		
		// Go through the array, translating each of the items to their
		// new value (or values).
		for ( var i = 0; i < elems.length; i++ ) {
			var val = fn(elems[i],i);

			if ( val !== null && val != undefined ) {
				if ( val.constructor != Array ) { 
					val = [val];
				}
				
				result = jQuery.merge( result, val );
			}
		}

		return result;
	},

	getAll: function(o,r) {
		r = r || [];
		var s = o.childNodes;
		for ( var i = 0; i < s.length; i++ )
			if ( s[i].nodeType == 1 ) {
				r.push( s[i] );
				jQuery.getAll( s[i], r );
			}
		return r;
	},
	  
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
   }
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
jQuery.extend(
	{
	sibling: function(elem, pos, not) {
		var elems = [];

		var siblings = elem.parentNode.childNodes;
		for ( var i = 0; i < siblings.length; i++ ) {
			if ( not === true && siblings[i] == elem ) continue;

			if ( siblings[i].nodeType == 1 )
				elems.push( siblings[i] );
			if ( siblings[i] == elem )
				elems.n = elems.length - 1;
		}

		return jQuery.extend( elems, {
			last: elems.n == elems.length - 1,
			cur: pos == "even" && elems.n % 2 == 0 || pos == "odd" && elems.n % 2 || elems[pos] == elem,
			prev: elems[elems.n - 1],
			next: elems[elems.n + 1]
		});
	},
	token: [
		">", "jQuery.sibling(a.firstChild)",
		"\\+", "jQuery.sibling(a).next",
	],
	
	  className: {
		add: function(o,c){
			if (jQuery.className.has(o,c)) return;
			o.className += ( o.className ? " " : "" ) + c;
		},
		remove: function(o,c){
			o.className = !c ? "" :
				o.className.replace(
					new RegExp("(^|\\s*\\b[^-])"+c+"($|\\b(?=[^-]))", "g"), "");
		},
		has: function(e,a) {
           if ( e.className != undefined ) {
              e = e.className;
           }
           return new RegExp("(^|\\s)" + a + "(\\s|$)").test(e);
        }
	  },

	  expr: {
		"": "m[2]== '*'||a.nodeName.toUpperCase()==m[2].toUpperCase()",
		"#": "a.getAttribute('id')&&a.getAttribute('id')==m[2]",
		":": {
			// Position Checks
			lt: "i<m[3]-0",
			gt: "i>m[3]-0",
			nth: "m[3]-0==i",
			eq: "m[3]-0==i",
			first: "i==0",
			last: "i==r.length-1",
			even: "i%2==0",
			odd: "i%2",
			
			// Child Checks
			"first-child": "jQuery.sibling(a,0).cur",
			"last-child": "jQuery.sibling(a,0).last",
			"only-child": "jQuery.sibling(a).length==1",
			
			// Parent Checks
			parent: "a.childNodes.length",
			empty: "!a.childNodes.length",
			
			// Text Check
			contains: "(a.innerText||a.innerHTML).indexOf(m[3])>=0",
			
			// Visibility
			visible: "a.type!='hidden'&&jQuery.css(a,'display')!='none'&&jQuery.css(a,'visibility')!='hidden'",
			hidden: "a.type=='hidden'||jQuery.css(a,'display')=='none'||jQuery.css(a,'visibility')=='hidden'",
			
			// Form elements
			enabled: "!a.disabled",
			disabled: "a.disabled",
			checked: "a.checked",
			selected: "a.selected"
		},  // end of ":"
		".": "jQuery.className.has(a,m[2])",
		"@": {
			"=": "z==m[4]",
			"!=": "z!=m[4]",
			"^=": "!z.indexOf(m[4])",
			"$=": "z.substr(z.length - m[4].length,m[4].length)==m[4]",
			"*=": "z.indexOf(m[4])>=0",
			"": "z"
		}, // end of "@"
		"[": "jQuery.find(m[2],a).length"
	}  // end of "expr"
	}),
	

jQuery.macros = {
	attr: {
		val: "value",
		html: "innerHTML",
		id: null,
		title: null,
		name: null,
		href: null,
		src: null,
		rel: null
	},
	
	css: "width,height,top,left,position,float,overflow,color,background".split(",")	
};
jQuery.init();

