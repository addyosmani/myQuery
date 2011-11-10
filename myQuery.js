
//last reference passed in to ensure undefined
//is really 'undefined'. Avoid mutable issues
//with earlier versions of ES

(function(window, undefined){
	
	// myQuery
	// Lightweight DOM library for learning purposes
	// Copyright Addy Osmani, 2011.
	// Released under an MIT license

/*
		Methods
		myQuery(selector) > supports ID, class, qSA, dom nodes
		myQuery.ready()
		myQuery.css()
		myQuery.attr()
		myQuery.bind()
		myQuery.unbind()
		myQuery.eq()
		myQuery.first()
		myQuery.last()
*/
	var myQuery = function( selector ){
		

		this.init = function( selector ){
			// As per jQuery, handle myQuery('')
			  // myQuery(null) or myQuery(undefined)
			  // by returning the instance if no 
			  // valid selectors are provided
			  if(!selector){
			    return this;
			  }


			  // Handle selections (ID, Class, all others, DOM nodes)
			  // This is extremely simplified, but I want to avoid getting it too complex
			  // It's not supposed to demonstrate Sizzle's level of interpretation by any
			  // means. Just something understandable. Perhaps cover a few more cases?
			    //DOM nodes
				if(selector.nodeType){
					this.selection = selector;
				}else{
					//Class selector
					if(selector.slice(0,1) === '.'){
						this.selection = document.getElementsByClassName(selector.slice(1, selector.length));
					}else if(selector.slice(0,1) === '#'){
						//ID selector: only grab the portion after # if using getElementById (faster than qSA)
					    this.selection = document.getElementById(selector.slice(1, selector.length));
					}else{
						//All others
						this.selection = document.querySelectorAll(selector);
					}
				}


			  // Set the local length to the selection length
			  this.length = this.selection.length || 0;
			
		}
		
		this.init(selector);
		

		//document ready handler
		//maybe we should generalize this to use .bind() as they'll both be
		//relying on more/less the same 
		this.ready  = function(callback){
			//this.bind('load', callback);
				if ( document.addEventListener ) {
					//Supported by Opera/Webkit and some other modern browsers
					//document.addEventListener( "DOMContentLoaded", callback, false );
					window.addEventListener( "load", callback, false );

				// If IE event model is used
				} else if ( document.attachEvent ) {
					// safe also for iframes
					//document.attachEvent( "onreadystatechange", callback );
					window.attachEvent( "onload", callback );
				}
			
		}

	  // Set attribute values 
	  // e.g.: el.attr(prop, val);
	  //  we call .access to access properties within a specified context
	  // so if I pass in 'attr', that means this is an attribute operation
	  // this.selection is the context and prop is the value to return. Passing
	  // in val will make this behave as a setter. Could be improved. this is rough.
	  this.attr = function(prop, val){
		if(prop && prop!== undefined && this.length < 1){
			if(val === undefined){
				//attribute getter
				return this.access('attr', this.selection, prop);
			}else{
				//attribute setter
				this.access('attr', this.selection, prop, val);
			}
		}
    
	    return this;
	  }


	  // Set CSS property values
	  // e.g.: el.css(prop, val);
	  this.css = function( prop, val ){
		
		if(prop && prop!==undefined){
		//user intent: property getter
			if(val === undefined){
				return this.access('css', this.selection, prop);
		
			}else{
				//check if setter arguments valid
				//if(prop && prop!==undefined){
					if(this.length && this.length >0){
					  //handle multiple elements
				      for(i=0; i<this.length; i++){
				        this.access('css',this.selection[i].style, prop, val);
				      }				
		
					}else{
						//handle single elements without the need to iterate
						this.access('css', this.selection.style, prop, val);
				
					}
					return this;
			}
		}

	  }

	  // A generic property setter and getter
	  this.access = function( mode, context, prop, val){
	    if(context && prop && val!==undefined && prop!==undefined){
	      context[prop] = val;
	    }else{

	///
	//getter/setter modes for CSS or attributes
		if(mode==='css'){
			var y = "";
			if (context.currentStyle){
				y = context.currentStyle[prop];
			}
			else{
				if (window.getComputedStyle){
					y = document.defaultView.getComputedStyle(context,null).getPropertyValue(prop);
				}
			}
			return y;
		}else if(mode==='attr'){
			//isnt playing as well with HTML5 data attributes
			//return context[prop];
			return context.getAttribute(prop);
		}


	///
	    }
	  }
	
	
	
	this.eq =  function( i ) {
		if(this.length > 1){
			return this.selection[i];
		}
	};

	this.first = function() {
		return this.eq( 0 );
	};

	this.last = function() {
		return this.eq( this.selection.length - 1);
	};
	



	  // Bind an eventName to a handler
	  // el.bind(eventName, handler)
	  this.bind = function(eventName, handler) {
	
		//avoid duplication in .ready() by supporting document
		//usage here.(todo)

		 var element = this.selection;
		      if (window.addEventListener) {
		        element.addEventListener(eventName, handler, false);
		      }
		      else if (document.attachEvent) {
		        element.attachEvent('on' + eventName, handler);
		      }
		      else {
		        element['on' + eventName] = handler;
		      }

	      return this;
	  };

	
	  //Unbind an eventName 
	  //el.unbind(eventName, handler)
	  this.unbind = function(eventName, handler) {
	
	    var element = this.selection;
	      if (window.removeEventListener) {
	        element.removeEventListener(eventName, handler, false);
	      }
	      else if (document.detachEvent) {
	        element.detachEvent('on' + eventName, handler);
	      }
	      else {
	        element['on' + eventName] = null;
	      }

	      return this;
	  };
	

	  this.log = function(){
	    console.log(this.selection);
	  };


	  if(this instanceof myQuery){
	    return this.myQuery;
	  }else{
	    return new myQuery(selector);
	  }

	}

	// Expose myQuery to the global object
	window.myQuery  = myQuery;
	
})( window );

