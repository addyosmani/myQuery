/*!
 * myQuery
 * A lightweight DOM manipulation library for 
 * learning purposes.
 *
 * Copyright 2011, Addy Osmani
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */


// 'undefined' is passed in here to ensure undefined
// is really 'undefined'. This avoids mutable issues
// with earlier versions of ES.

(function(window, undefined){

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

		// Initializes this instance of myQuery using
		// a provided selector
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
		

		//Use the load-time configuration pattern
		//to cache what events are best applicable for
		//event handling with the current browser
		this.addListener, this.removeListener = null;

		if (typeof window.addEventListener === 'function') {
		    this.addListener = function (el, type, fn) {
		        el.addEventListener(type, fn, false);
		    };
		    this.removeListener = function (el, type, fn) {
		        el.removeEventListener(type, fn, false);
		    };
		} else if (typeof document.attachEvent === 'function') { // IE
		    this.addListener = function (el, type, fn) {
		        el.attachEvent('on' + type, fn);
		    };
		    utils.removeListener = function (el, type, fn) {
		        el.detachEvent('on' + type, fn);
		    };
		} else { // older browsers
		   	this.addListener = function (el, type, fn) {
		        el['on' + type] = fn;
		    };
		    this.removeListener = function (el, type, fn) {
		        el['on' + type] = null;
		    };
		}
		
		
		//document ready handler
		this.ready  = function(callback){
				this.addListener(window, 'load', callback);
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


	    }
	  }
	
	
	// Return an element at a particular index in a selection
	this.eq =  function( i ) {
		if(this.length > 1){
			return this.selection[i];
		}
	};
	
	// Return the first element in a selection
	this.first = function() {
		return this.eq( 0 );
	};

	// Return the last element in a selection
	this.last = function() {
		return this.eq( this.selection.length - 1);
	};
	



	// Bind an eventName to a handler
	// el.bind(eventName, handler)
	this.bind = function(eventType, handler){
		this.addListener(this.selection, eventType, handler);
		return this;
	}

	
	  //Unbind an eventName 
	  //el.unbind(eventName, handler)
	this.unbind = function(eventType, handler){
		this.removeListener(this.selection, eventType, handler);
		return this;
	}
	

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

