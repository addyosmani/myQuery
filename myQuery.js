/*!
 * myQuery
 * A lightweight DOM manipulation library for
 * learning purposes.
 *
 * Copyright 2011, Addy Osmani, Andrée Hansson
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
// 'undefined' is passed in here to ensure undefined
// is really 'undefined'. This avoids mutable issues
// with earlier versions of ES.
(function(window, document, undefined) {

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
    var myQuery = function(selector) {

            // Initializes this instance of myQuery using
            // a provided selector
            this.init = function(selector) {
                // As per jQuery, handle myQuery('')
                // myQuery(null) or myQuery(undefined)
                // by returning the instance if no 
                // valid selectors are provided
                if (!selector) {
                    return this;
                }

                // Handle selections (ID, Class, all others, DOM nodes)
                // This is extremely simplified, but I want to avoid getting it too complex
                // It's not supposed to demonstrate Sizzle's level of interpretation by any
                // means. Just something understandable. Perhaps cover a few more cases?
                // DOM nodes
                if (selector.nodeType) {
                    this.selection = selector;
                } else {
                    // Class selector
                    if (/^\.\w+$/.test(selector)) {
                        this.selection = document.getElementsByClassName(selector.slice(1, selector.length));
                    } else if (/^\#\w+$/.test(selector)) {
                        // ID selector: only grab the portion after # if using getElementById (faster than qSA)
                        this.selection = document.getElementById(selector.slice(1, selector.length));
                    } else {
                        // All others
                        this.selection = document.querySelectorAll(selector);
                    }
                }

                // Set the local length to the selection length
                this.length = this.selection.length || 0;
            };


            // Initialize this internal instance
            this.init(selector);


            // Use the load-time configuration pattern
            // to cache what events are best applicable for
            // event handling with the current browser
            // TODO: Move this elsewhere, these methods don't need to be invoked
            //       more than once, or am I misunderstanding the pattern here?
            //       Anyway -- refactor this into something less repetitive

            /*
            Todo response: So, the idea here is that we're caching
            the addListener and removeListener events on page load
            so that we don't need to worry about repeating this check
            each time. In jQuery core, this (I believe) is done multiple
            times, but the below trick could solve it. How would you
            improve? :)
            */
            this.addListener = this.removeListener = null;

            if (typeof window.addEventListener === 'function') {
                this.addListener = function(el, type, fn) {
                    el.addEventListener(type, fn, false);
                };
                this.removeListener = function(el, type, fn) {
                    el.removeEventListener(type, fn, false);
                };
            } else if (typeof document.attachEvent === 'function') { // IE
                this.addListener = function(el, type, fn) {
                    el.attachEvent('on' + type, fn);
                };
                this.removeListener = function(el, type, fn) {
                    el.detachEvent('on' + type, fn);
                };
            } else { // older browsers
                this.addListener = function(el, type, fn) {
                    el['on' + type] = fn;
                };
                this.removeListener = function(el, type, fn) {
                    el['on' + type] = null;
                };
            };


            // Document ready handler
            // TODO: Could probably be a one-time thing and check if a private var `isReady`
            //       With this, anything triggered after window `load` event won't be invoked
            this.ready = function(callback) {
                this.addListener(window, 'load', callback);
            };


            // Set attribute values 
            // E.g.: el.attr(prop, val);
            // We call .access to access properties within a specified context
            // so if I pass in `attr`, that means this is an attribute operation
            // `this.selection` is the `context` and `prop` is the value to return.
            // Passing in `val` will make this behave as a setter.
            // TODO: A bit rough, needs more work (probably)
            this.attr = function(prop, val) {
                if (prop && this.length) {
                    if (val === undefined) {
                        //attribute getter
                        return this.access('attr', this.selection, prop);
                    } else {
                        //attribute setter
                        this.access('attr', this.selection, prop, val);
                    }
                }

                return this;
            };


            // Set CSS property values
            // E.g.: el.css(prop, val);
            this.css = function(prop, val) {
                if (prop) {
                    // No value means getting CSS property value
                    if (val === undefined) {
                        return this.access('css', this.selection, prop);

                    } else {
                        // Check if setter arguments valid
                        if (this.length) {
                            // Handle multiple elements
                            for (i = 0; i < this.length; i++) {
                                this.access('css', this.selection[i].style, prop, val);
                            }

                        } else {
                            // Handle single elements without the need to iterate
                            this.access('css', this.selection.style, prop, val);

                        }

                        return this;
                    }
                }
            };


            // A generic property setter and getter
            this.access = function(mode, context, prop, val) {
                if (context && prop && val !== undefined) {
                    context[prop] = val;
                } else {

                    // Getter/setter modes for CSS or attributes
                    if (mode === 'css') {
                        var y = "";

                        if (context.currentStyle) {
                            y = context.currentStyle[prop];
                        } else {
                            if (window.getComputedStyle) {
                                y = document.defaultView.getComputedStyle(context, null).getPropertyValue(prop);
                            }
                        }

                        return y;
                    } else if (mode === 'attr') {
                        // Isn't very compatible with the HTML5 data-* attributes
                        // return context[prop];
                        return context.getAttribute(prop);
                    }
                }
            };


            // Return an element at a particular index in a selection
            this.eq = function(i) {
                var elem = this.selection[i];
                return elem ? new myQuery(elem) : this;
            };


            // Return the first element in a selection
            this.first = function() {
                return this.eq(0);
            };


            // Return the last element in a selection
            this.last = function() {
                return this.eq(this.selection.length - 1);
            };


            // Bind an eventName to a handler
            // el.bind(eventName, handler)
            this.bind = function(eventType, handler) {
                this.addListener(this.selection, eventType, handler);
                return this;
            };


            // Unbind an eventName 
            // el.unbind(eventName, handler)
            this.unbind = function(eventType, handler) {
                this.removeListener(this.selection, eventType, handler);
                return this;
            };


            // Easy log fn
            this.log = (window.console && typeof console.log === 'function') ?
                function() {
                    console.log(this.selection);
                } :
                function() {
                    //TODO: create alternative logging
                };


            return this instanceof myQuery ?
                this.myQuery :
                new myQuery(selector);
        }

        // Expose myQuery to the global object
        window.myQuery = myQuery;
})(window, document);

