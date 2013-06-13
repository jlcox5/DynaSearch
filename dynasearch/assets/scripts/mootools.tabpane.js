/*
---
description: TabPane Class

license: MIT-style

authors: akaIDIOT

version: 0.5.1

requires:
  core/1.4:
  - Class
  - Class.Extras
  - Event
  - Element
  - Element.Event
  - Element.Delegation

provides: TabPane
...
*/

//(function() {

// make typeOf usable for MooTools 1.2 through 1.4
var typeOf = this.typeOf || this.$type;

var TabPane = new Class({

	Implements: [Events, Options],

	options: {
      tabContainer: '.tabs',
		tabSelector: '.tab',
		contentSelector: '.content',
		activeClass: 'active'
	},

	container: null,

	initialize: function(container, options, showNow) {
		this.setOptions(options);
      
      // Check if MooTools Element has been passed as container
      if ( typeOf(container) == 'element' ) {
			this.container = container;
         
		} else {
			this.container = $(container);
		}
      
      this.tabContainer = this.container.getChildren( this.options.tabContainer )[0];
      if ( !this.tabContainer ) {
         //this.container
         alert ( 'Tab Error :  Not implemented!' );
      }
      
		// hide all the content parts by default
		this.container.getElements(this.options.contentSelector).setStyle('display', 'none');

		// add a relayed click event to handle switching tabs
		this.container.addEvent('click:relay(' + this.options.tabSelector + ')', function(event, tab) {
			this.show(tab);
		}.bind(this));

		// determine what tab to show right now (default to the 'leftmost' one)
		if (typeOf(showNow) == 'function') {
			showNow = showNow();
		} else {
			showNow = showNow || 0;
		}

		this.show( showNow );
	},

	get: function(index) {
		if (typeOf(index) == 'element') {
			// call get with the index of the supplied element (NB: will break if indexOf returns -1)
			return this.get(this.indexOf(index));
		} else {
			var tab = this.tabContainer.getChildren(this.options.tabSelector)[index];
			var content = this.container.getChildren(this.options.contentSelector)[index];
			return [tab, content];
		}
	},

	indexOf: function(element) {
		if (element.match(this.options.tabSelector)) {
			return this.tabContainer.getChildren(this.options.tabSelector).indexOf(element);
		} else if (element.match(this.options.contentSelector)) {
			return this.container.getChildren(this.options.contentSelector).indexOf(element);
		} else {
			// element is neither tab nor content, return -1 per convention
			return -1;
		}
	},

	show: function(what) {
		if (typeOf(what) != 'number') {
			// turn the argument into its usable form: a number
			what = this.indexOf(what);
		}

		// if only JavaScript had tuple unpacking...
		var items = this.get(what);
		var tab = items[0];
		var content = items[1];

		if (tab) {
			this.tabContainer.getChildren(this.options.tabSelector).removeClass(this.options.activeClass);
			this.container.getChildren(this.options.contentSelector).setStyle('display', 'none');
			tab.addClass(this.options.activeClass);
			content.setStyle('display', 'block');
			this.fireEvent('change', what);
		}
		// no else, not clear what to do
	},
   
   add: function(tab, content, showNow, location) {
		if (typeOf(location) == 'number') {
			var before = this.get(location);
			tab.inject(before[0], 'before');
			content.inject(before[1], 'before');
		} else {
			//tab.inject(this.container.getElements(this.options.tabSelector).getLast(), 'after');
			this.tabContainer.adopt( tab );
			content.setStyle('display', 'none');
			//content.inject(this.container.getElements(this.options.contentSelector).getLast(), 'after');
			this.container.adopt( content );
		}

		this.fireEvent('add', this.indexOf(tab));

		if (showNow) {
			this.show(tab);
		}
	},
	
	close: function(what) {
		if (typeOf(what) != 'number') {
			what = this.indexOf(what);
		}

		var items = this.get(what);
		var tab = items[0]
		var content = items[1];

		if (tab) {
			var tabs = this.container.getElements(this.options.tabSelector);
			var selected = tabs.indexOf(this.container.getElement('.' + this.options.activeClass)); // will always be equal to index if the closing element matches tabSelector 

			tab.destroy();
			content.destroy();
			this.fireEvent('close', what);
			
			this.show(selected.limit(0, tabs.length - 2)); // a tab was removed, length is 1 less now 
		}
	},

});

//})();
