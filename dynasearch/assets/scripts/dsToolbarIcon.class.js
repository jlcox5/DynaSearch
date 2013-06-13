var DSTOOLBARICON_DIR   = 'toolbar/'

var newdiv;

// Icon to go on the toolbar
var ToolbarIcon = new Class({
   Implements : [Options],
   options    : {
      image       : '',
      description : '',
   },

	initialize : function( options ) {
		
      this.setOptions( options );
      
		// Setup the image
      this.description = this.options.description;
		this.icon = 'assets/images/' + DSTOOLBARICON_DIR + this.options.image;
	},
   
   /*setToolbar : function( toolbar ) {
      var self = this;
   //alert(toolbar.title);
      self.toolbar = toolbar;
   },*/
   
   addWindowFunction : function () {
     alert('unimplemented');
   },
   
   setPage : function( page ) {
      this.page = page;
   },
   
   onClick : function( event ) {
      //event.preventDefault();
      //alert('hello');
      
      var win = this.getWindow();
      //alert(win.type);
      //var div = win.getElement(true);
      //$('main_editor').adopt( div );
      
      //alert( event.page.x + "," + event.page.y);
      //alert( event );
      
      win.setPosition(event.page.x, event.page.y);
      this.addWindowFunction( win );
      
      win.startDrag( event );
      
      
   },
   
   getIconImage : function() {
      var self = this;
   
      var img = new Element(
         'img',
         { 'src'   : self.icon }
      );
      
      return img;
   },
   
   getElement : function() {
   
      var self = this;
   
      var el = new Element(
         'div',
         {
            'class' : 'toolbar-icon',
            events  : {
                  'mousedown' : self.onClick.bind(this),
            },
         }
         
      );
      el.appendChild( self.getIconImage() );
      
      return el;
   
   },
});


var TrashbinToolbarIcon = new Class({
	Extends: ToolbarIcon,
   options    : {
      page        : null,
      image       : 'glyph_trash.png',
      description : 'Drag here to delete',
   },
   
	initialize: function( options ) {
		this.parent( options );
		
     // addClassRec(this.el,'trashbin');
		//this.el.setAttribute('id', 'trashBinToDeleteWindows_55555');
   //   chIdRec(this.el,'trashBinToDeleteWindows_55555');
	},
   
   getElement : function() {
      var self = this;
   
      var image = self.getIconImage(),
          label = new Element(
            'span',
            {
               html   : 'Drag Here to Delete',
            }
          );
         
         var el = new Element(
            'div',
            {
               'class' : 'toolbar-icon trashbin',
               styles  : {
                  'display' : 'block',
               },
               events  : {
                  'click' : self.onClick,
               },
            }
         );
         
         el.appendChild( image );
         el.appendChild( label );

         return el;
   }
});


var TextWindowToolbarIcon = new Class({
	Extends: ToolbarIcon,
   options    : {
      page        : null,
      image       : 'glyph_text.png',
      description : 'Create Text',
   },
   
	initialize: function( options ) {
		this.parent( options );
	},
   
   getWindow : function() {
      return new TextWindow();
   },
   
   //onClick : function( event ) {
   //   event.preventDefault();
   //},
   
   //getElement : function() {
   
   //}
});


var ImageWindowToolbarIcon = new Class({
	Extends: ToolbarIcon,
   options    : {
      page        : null,
      image       : 'glyph_image.png',
      description : 'Create Image',
   },
   
	initialize: function( options ) {
		this.parent( options );
	},
   
   getWindow : function() {
      return new ImageWindow();
   },
});




/*
var ToolbarIcon_TextWindow_NoHide = new Class({
	Extends: ToolbarIcon,
	initialize: function() {
		this.parent('/toolbar/glyph_text_nohide.png', 'text_nohide_window', true, 'Create Text (Always Visible)');
	}
});*/


var ClockWindowToolbarIcon = new Class({
	Extends: ToolbarIcon,
   options    : {
      page        : null,
      image       : 'glyph_clock.png',
      description : 'Create Clock',
   },
   
	initialize: function( options ) {
		this.parent( options );
	},
   
   getWindow : function() {
      return new ClockWindow();
   },
});

var ObjectWindowToolbarIcon = new Class({
	Extends: ToolbarIcon,
   options    : {
      page        : null,
      image       : 'glyph_object.png',
      description : 'Create HTML5/Java/SWF Object',
   },
   
	initialize: function( options ) {
		this.parent( options );
	},
   
   getWindow : function() {
      return new ObjectWindow();
   },
});


var TableWindowToolbarIcon = new Class({
	Extends: ToolbarIcon,
   options    : {
      page        : null,
      image       : 'glyph_table.png',
      description : 'Create Table',
   },
   
	initialize: function( options ) {
		this.parent( options );
	},
   
   getWindow : function() {
      return new TableWindow();
   },
});


var ToolbarIcon_ext_TableWindow = new Class({
	Extends: ToolbarIcon,
   options    : {
      page        : null,
      image       : 'glyph_interactivetable.png',
      description : 'Create Interactive Table',
   },
   
	initialize: function( options ) {
		this.parent( options );
	}
});