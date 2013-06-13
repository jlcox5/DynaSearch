

var DSWINDOW_RESIZE_ICON_PATH = 'assets/images/resize_icon.png',
    DSWINDOW_EDIT_ICON_PATH   = 'assets/images/icon-info.png',
    
    DS_ADMIN_ASSET_DIR        = '',
    
    DS_IMAGEWINDOW_DEFAULT_SRC = 'assets/images/test_icon.png',
    DS_IMAGEWINDOW_OPTIONS     = new Array(),
    
    DS_TABLEWINDOW_OPTIONS     = new Array(),
    
    DS_APPLETWINDOW_OPTIONS    = new Array(),
    
    WINDOW_SCALE_X = 1,
    WINDOW_SCALE_Y = 1;

    
var dsGetSize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
    

    
/**
 * Window Base Class
 *
 */
var Window = new Class({
   Implements : [Options],
   options : {
      page            : null,
      title           : 'Untitled',
   
      showTitle       : true,
      editable        : true,
      draggable       : true,
      resizable       : true,
      /*lockAspectRatio : false,*/
      trashable       : true,
      x               : 0,
      y               : 0,
      width           : null,
      height          : null,
   },

	initialize: function( options ) {
   
      this.setOptions( options );
		
      this.title     = this.options.title;
      this.showTitle = this.options.showTitle;
      this.editable  = this.options.editable;
      this.draggable = this.options.draggable;
      this.resizable = this.options.resizable;
      this.trashable = this.options.trashable;
      this.x         = this.options.x      * WINDOW_SCALE_X;
      this.y         = this.options.y      * WINDOW_SCALE_Y;
      if ( this.options.width ) {
         this.width  = this.options.width  * WINDOW_SCALE_X;
      } else {
         this.width  = 320;
      }
      if ( this.options.height ) {
         this.height = this.options.height * WINDOW_SCALE_Y;
         //alert(this.height);
      } else {
         this.height = 180;
      }
//alert(this.options.width);
      //this.manageAspectRatio();
      //this.manageAspectRatio();
      
      /*
		
		
		add_updatable(this);*/
	},
   
   setPage : function( page ) {
      this.page = page;
   },

   /*
   manageAspectRatio: function( ) {
      if ( this.lockAspectRatio ) {
         var width  = this.getWidth(),
             height = this.getHeight();
             
         // Check is Aspect Ratio has been set
         if ( !this.aspectRatio ) {
            this.aspectRatio =  width / height;
         }
         
         if ( width > height ) {
            var dimension = 'height',
                value     = width / this.aspectRatio;
         } else {
            var dimension = 'width',
                value     = height * this.aspectRatio;
         }
         
         this.el.setStyle( dimension, value.round() + 'px' );
      }
      
	},*/
   
   onResizeStart : function( el ) {
      el.setStyle( 'opacity', 0.7 );
	},
   
   onResizeComplete : function( el ) {
      el.setStyle( 'opacity', 1.0 );
      
      var size    = el.getSize();
      this.width  = size.x;
      this.height = size.y;
      
      this.page.update();
	},
   
   onResizeDrag : function( el, event ) {
      //self.manageAspectRatio();
	},
   
   getElement : function( editMode ) {
   
      var self = this;
   
      if ( !this.el ) {      
         // Element has not been created yet
         var el = new Element(
            'div',
            {
               //'id' : 'toolbar' + # + 'div',
               'class'     : 'drag',
               'trashable' : self.trashable,
               styles      : {
                  'left'   : self.x,
                  'top'    : self.y,
                  'width'  : self.width,
                  'height' : self.height,
               },
               events      : {
                  'mousedown' : self.handleClick.bind(self),
                  //'mouseup'   : self.handleClick.bind(self),
               }
            }
         );
         
         // Construct Titlebar
         self.titleDiv = new Element(
            'div',
            {
               'class' : 'handle',
               html    : self.title 
            }
         );
         el.adopt( self.titleDiv );
         el.adopt( self.getContentDiv(editMode) );

         // Check if editing is enabled
         if ( editMode ) {
         
         
         // Check if Editable
         if ( self.editable ) {
            var editIcon = new Element(
               'img',
               {
                  'class' : 'edit-icon',
                  'src'   : DSWINDOW_EDIT_ICON_PATH,
                  events  : {
                     click : self.editAction.bind(self)
                  }
               }
            );
            el.adopt( editIcon );
         }
         
         // Check if Draggable
         if ( self.draggable ) {
            self.dragHandle = self.titleDiv;
            self.drag = el.makeDraggable({
               handle     : self.dragHandle,
               onStart    : function() { el.setStyle( 'opacity', 0.7 ); },
               onComplete : function() {
                  el.setStyle( 'opacity', 1.0 );
                  
                  // Set new position
                  var pos = el.getPosition();
                  self.setPosition( pos.x, pos.y );
                  
                  self.page.update();
               },
               droppables : '.trashbin',
               onDrop     : function(el, over, event){
                  // Check if dropped on trashbin
                  if( over )
                  {
                     var win = el.win;
                     if ( win.trashable && self.page ) {
                        self.page.removeWindow( win );
                     }
                  }
               },
               onEnter    : function(el, d){
                  el.setAttribute('class','drag_enter'); 
               },
               onLeave    : function(el, d){
                  el.setAttribute('class','drag');
               }
            });
         }
         
         // Check if Resizable
         if ( self.resizable ) {
            // Attach resize icon
            var resizeIcon = new Element(
               'img',
               {
                  'class' : 'icon',
                  'src'   : DSWINDOW_RESIZE_ICON_PATH
               }
            );
            var resizeHandle = new Element(
               'div',
               {
                  'class' : 'resize'
               }
            );
            resizeHandle.adopt( resizeIcon );
            el.adopt( resizeHandle );
             
             // Make Resizable
            el.makeResizable({
               handle: resizeHandle,
               onStart    : self.onResizeStart.bind( this ),
               onDrag     : self.onResizeDrag.bind( this ),
               onComplete : self.onResizeComplete.bind( this ),
            });
         }
         
         }
         // Check if Trashable
         //if ( self.trashable ) {
            
         //}
         
         el.win = self;
         
         self.el = el;
      }
      
      self.update();
      return self.el;
   },

   getContentDiv : function( editing ) {
      var self = this;
   
      if ( !self.contentDiv ) {      
         // Content div has not been created yet
         var content = new Element( 'div', { 'class' : 'content' } );
         self.contentDiv = content;
      }
      
      return self.contentDiv;
   },
   
   setPosition : function( x, y ) {
      this.x = x;
      this.y = y;
      //this.el.setStyles({
      //   'left' : x,
      //   'top'  : y,
      //});
	},
   
   startDrag : function( event ) {
      if ( this.draggable ) {
         this.drag.start( event );
      }
	},
   
   addEditDialogContent : function( div ) {
      var self = this;
   
      // Creat Title Input
      this.editTitleInput = new Element(
         'input',
         {
            'type'  : 'text',
            'value' : self.title
         }
      );
      // Create title label
      var lbl = new Element(
         'label',
         { html : 'Window Title : ' }
      );
      lbl.adopt(self.editTitleInput);
      div.adopt( lbl );
      
      // Creat Show Title Checkbox
      this.showTitleInput = new Element(
         'input',
         {
            'type'  : 'checkbox',
            'checked' : self.showTitle 
         }
      );
      // Create show title label
      lbl = new Element(
         'label',
         { html : 'Show Title Bar : ' }
      );
      lbl.adopt(self.showTitleInput);
      div.adopt( lbl );
   },
   
   edit : function() {
      this.title     = this.editTitleInput.get('value');
      this.showTitle = this.showTitleInput.get('value');
   },
   
   editAction : function() {
      var self    = this;
      
      // Create main div for mBox content
      var dialogDiv = new Element( 'div' );
      
      // Add dialog editing content
      this.addEditDialogContent( dialogDiv );
      
      // Create mBox      
      var editDialog = new mBox.Modal({
         title   : 'Edit Window',
         content : dialogDiv,
      /*width   : '800px',
      height  : '450px',*/
         overlay : true,
         closeOnBodyClick : false,
         buttons : [
            { title : 'Cancel' },
            {
               title : 'OK' ,
               event : function() {
                  editDialog.close();
                  
                  // Edit window data
                  self.edit();
                  
                  // Update Window
                  self.update();

           },
           addClass : 'button-green' }
         ],
      }).open();
   },
   
   destroy : function() {
      this.el.destroy();
   },
   
   /*getHandleOffsetY: function()   { return this.div.getElement('.infohandle').getSize().y + this.div.getElement('.resize').getSize().y;},
   getHandleOffsetX: function()   { return this.div.getElement('.infohandle').getSize().x + this.div.getElement('.resize').getSize().x;},
	getWidth  : function()       { return this.el.getSize().x;     },
	getHeight : function()       { return this.el.getSize().y;     },
	get_x	   : function()         { return this.div.getPosition().x; },
	set_trashable: function(bool) { this.div.trashable = bool;       },*/
   
   
	update : function() {
      var size    = this.el.getSize();
      this.width  = size.x;
      this.height = size.y;
   
      this.titleDiv.set('html', this.title);
   },
   
   handleClick : function( event ) {
      //alert(event.target.get('class'));
      
      //alert(event.page.x)
     // alert(this.title)
      //alert('hi');
      //event.extra = 'test';
      event.stop();
      this.page.onMouseDown( event, 'test' );
      
     /* var click = {
         'count'         : 0,
         'id'            : '',
         'time'          : '',
         'startPosition' : startPos,
         'endPosition'   : endPos,
      };*/
   },
   
   genData : function( data ) {
      //data.type = this.type;
      data.title = this.title;
      data.type  = this.options.type;
      
      data.x      = this.x      / WINDOW_SCALE_X;
      data.y      = this.y      / WINDOW_SCALE_Y;
      data.width  = this.width  / WINDOW_SCALE_X;
      data.height = this.height / WINDOW_SCALE_Y;
      //data.
   },
   
});



/**
 * Toolbar Window Class
 *
 */
var Toolbar = new Class({
	Extends : Window,
   options : {
      title    : 'Toolbar',
      editable : false,
   },
   
	initialize: function( options ) {
      this.parent( options );
      //alert(this.options.editable);
      
      this.icons   = [];
      this.buttons = [];

      /*
		
      var list_files = document.createElement('p');
      list_files.innerHTML = window.editorFiles;
      list_files.id = 'listFiles';
      list_files.name = 'listFiles';
      this.div.adopt(list_files);*/
	},
   
      
   addWindowFunction : function() {
      alert('Toolbar: not implemented');
   },
   
	addIcon : function( icon ) {
      var self = this;
      icon.addWindowFunction = self.addWindowFunction;
      self.icons.push( icon );
   },
   
   addActionBtn : function( label, callback ) {
      var self = this;
      var btn = new Element(
         'button',
         {
            html : label,
            events  : {
               click : callback
            }
         }
      );
      this.buttons.push( btn );
      return btn;
   },
   
   getContentDiv : function( editMode ) {
      var self = this;
   
      if ( !self.contentDiv ) {      
         // Content div has not been created yet
         var content = new Element(
            'div',
            { 'class' : 'content' }
         );
         
         // Load Icons
         for ( var i = 0; i < self.icons.length; i++ ) {
            content.adopt( self.icons[i].getElement() );
         }
         
         // Buttons
         for ( var i = 0; i < self.buttons.length; i++ ) {
            content.adopt( self.buttons[i] );
         }

         self.contentDiv = content;
      }
      
      return self.contentDiv;
   },
   
   editAction : function() {
      alert('subclass');
   },
});



/**
 * Clock Window Class
 *
 */
var ClockWindow = new Class({
	Extends: Window,
   options : {
      type             : 'clock',
      title            : 'Clock',
      enforceTimeLimit : true,
      time             : 20,
      
      trashable        : false,
   },
   
	initialize: function( options ) {
   	//alert("Initializing clock!");
		//this.type='clock';
      
		//this.id = 'clockX_X';
		this.parent( options );
      
      this.time             = this.options.time;
      this.enforceTimeLimit = this.options.enforceTimeLimit;
      
      this.timeElapsed      = 0;
		//this.trashable = false;
		
     
	},
   
   getContentDiv : function( editMode ) {
      var self = this;
   
      if ( !self.contentDiv ) {      
         // Content div has not been created yet
         var content = new Element(
            'div',
            {
               'class' : 'content',
               'html'  : 'Time Limit : ' + self.time + ' minutes',
            }
         );

         self.contentDiv = content;
      }
      
      return self.contentDiv;
   },
   
   addEditDialogContent : function( div ) {
      this.parent( div );
   
      this.minInput = new Element(
         'input',
         {
            'type'  : 'number',
            'value' : parseInt(this.time / 60),
         }
      );
      
      this.secInput = new Element(
         'input',
         {
            'type'  : 'number',
            'value' : (this.time % 60),
         }
      );
      
      // Create Image Label
      var lbl = new Element(
         'label',
         { html : 'Time Limit : ' }
      );
      lbl.adopt( this.minInput );
      lbl.appendText( ' : ' );
      lbl.adopt( this.secInput );
      div.adopt( lbl );
   },
   
   edit : function() {
      this.parent();
      
      var min = parseInt( this.minInput.get('value') ),
          sec = parseInt( this.secInput.get('value') );
   
      this.time = (min * 60) + sec;
   },
   
	update: function()
	{
      var self = this;
      this.parent();
      
      var min = parseInt(this.time / 60),
          sec = this.time % 60;
          
      // Pad seconds with zeros
      sec = (sec < 10) ? ('0' + sec) : (sec);
      
      if ( this.page.options.editMode ) {
         this.contentDiv.set('html', 'Time Limit : ' + min + ':' + sec);
      
      } else {
         if ( this.time > 0 ) {

            this.contentDiv.set( 'html', min + ':' + sec + ' remaining.' );
            
            this.time -= 1;
            setTimeout(self.update.bind(self), 1000);
         } else {
            this.contentDiv.set( 'html', 'Time Expired.' );
            
            if ( this.enforceTimeLimit ) {
               alert('You have reached the time limit for this page!');
               this.page.timeout();
            }
         }
      }
   },
   
   genData : function( data ) {
      //data.type = this.type;
      this.parent( data );
      
      data.time             = this.time;
      data.enforceTimeLimit = this.enforceTimeLimit;
   },
});


/**
 * Text Window Class
 *
 */
var TextWindow = new Class({
	Extends: Window,
   options : {
      type  : 'text',
      title : 'Text Window',
      text  : 'This is some sample text. Press the Info Button to edit me.'
   },
   
	initialize: function( options ) {

      this.parent( options );
      
      this.text = this.options.text;
   /*
      if(isHideable == undefined) isHideable = true;
      this.isHideable = isHideable;

		this.type=this.isHideable?'text':'text_nohide';
		this.parent(undefined,this.isHideable?'Text Window':'Text Window (Always Visible)');
		this.trashable = false;

		this.div.getElement(".content").innerHTML = "This is some sample text. Press the Info Button to edit me.";
		this.div.getElement(".content").style.padding = "3px 3px";

		if(typeof editing != 'undefined') {
		this.div.getElement(".infohandle").getElement(".icon").onmouseup = function()
			{ 
				var pd = this.parentNode.parentNode;
				var pdc = pd.getElement('.content');			
				var pdh = pd.getElement('.handle');

				pdc.innerHTML = prompt("Please enter your new text for this box, or press Okay to keep the current text.", pdc.innerHTML);
				pdh.innerHTML = prompt("Please enter your new title for this box, or press Okay to keep the current text.", pdh.innerHTML);
				while(pdh.innerHTML == ''){
				   pdh.innerHTML = prompt("A title is required for this element.  Please enter a title here.", pdh.innerHTML);;
				}
			}
		}
      */

	},
   
   getContentDiv : function( editMode ) {
      var self = this;
   
      if ( !self.contentDiv ) {      
         // Content div has not been created yet
         var content = new Element(
            'div',
            {
               'class' : 'content',
               'html' : self.text,
            }
         );

         self.contentDiv = content;
      }
      
      return self.contentDiv;
   },
   
   addEditDialogContent : function( div ) {
      var self = this;
      self.parent( div );
   
      self.editContentInput = new Element(
         'textarea',
         {
            'value' : self.text,
            styles : {
               width  : '160px',
               height : '90px'
            }
         }
      );
      
      // Create contentlabel
      var lbl = new Element(
         'label',
         { html : 'Text : ' }
      );
      lbl.adopt( self.editContentInput );
      div.adopt( lbl );
   },
   
   edit : function() {
      this.parent();
   
      this.text = this.editContentInput.get('value');
   },
   
   update : function() {
      this.parent();
      this.contentDiv.set('html', this.text);
   },
   
   genData : function( data ) {
      //data.type = this.type;
      this.parent( data );
      
      data.text = this.text;
   },
   
});



/**
 * Image Window Class
 *
 */
var ImageWindow = new Class({
	Extends: Window,
   options : {
      type  : 'image',
      title : 'Image Window',
      file : '',
   },
   
	initialize: function( options ) {

   //alert(ntableLink);
      this.parent( options );
      
      //this.src = DS_ADMIN_ASSET_DIR + this.img;
      //this.type='image';
      //this.experiment = experiment;

		//this.trashable = false;
      
      this.file = this.options.file;
      if ( this.file ) {
         this.src = DS_ADMIN_ASSET_DIR + this.file;
         
      } else {
         this.src = DS_IMAGEWINDOW_DEFAULT_SRC;
      }
      
      

/*

      var This = this;
      this.resizeCB = function(){
	     if(typeof editing == 'undefined'){
		    //var tempHeight = This.img.getSize().y - 50;
		    //This.div.getElement(".content").style.height = tempHeight + "px";
            //This.div.style.height = This.img.getSize().y - 100 +"px";
		 }
		 else{
		    This.div.style.height = This.img.getSize().y + This.getHandleOffsetY() + 5 +"px";
		 }
         //This.div.getElement(".content").style.height = This.img.getSize().y + "px";
         //This.div.style.height = This.img.getSize().y + This.getHandleOffsetY() + 5 +"px";
		 //This.div.style.height = This.img.getSize().y + 5 +"px";
      };

      //var eventID = this.img.src.split('/').pop().trim();
      //document.addEventListener(eventID,this.eventHandler,false);
      var me = this;
      var eventSymTab = {
         img : function(signal,args){
                  switch(signal){
                     case "mouseup":
                        me.img.src = me.def_imgsrc;
                        break;
                     case "mousedown":
                        if(args.length < 1) return;
                        //me.img.src = "assets/images/" + args[0].trim();
                        me.img.src = ImageAssetDir + args[0].trim();
                        break;
                  }
         },
         doCommand: function(com,signal,args){
                       com = com.trim();
                       if(com in this){
                          //var argTok = args.split(/\s+/).filter(function(element,index,array){return !(/^\s*$/.test(element));});
                          this[com](signal,args);
                       }
         }
      }
      var eventHandler = function(evt){
         //if(evt.eventID != me.eventID) return;
         //alert("Event fired from " + evt.tabID + " table and received by ImageWindow with eventID " + evt.eventID);
         if(evt.tabID != me.tableLink) return;
         //alert("Event fired from " + evt.tabID + " table and received by ImageWindow with eventID " + evt.eventID);
         eventSymTab.doCommand(evt.com,evt.signal,evt.cargs);
      }

      document.addEventListener("ImageWindowEvent",eventHandler,false);

		//this.div.getElement(".content").innerHTML = "<img src='" + this.source + "'/>";

      var IWThis = this;

		if(typeof editing != 'undefined') {
		this.div.getElement(".infohandle").getElement(".icon").onmouseup = function()
			{ 
				var pd = this.parentNode.parentNode;
				var pdc = pd.getElement('.content');			
				var pdh = pd.getElement('.handle');

var cb = function(asset) {
            me.def_imgbase = asset;
            me.img.src = me.def_imgsrc  = assetDir+me.def_imgbase.trim();

            me.tableLink = prompt("Please enter an associated table ID.",me.tableLink);
}

openAssetPopup('images', cb);

			}
		}
      this.resizeobj.fireEvent("onComplete");
*/
	},
	//update: function(o) { this.div.getElement('.handle').innerHTML = o.index + hurricane_frame_num; },
   
   //onResizeDrag : function( el, event ) {
     // var height = this.image.getStyle('height');
     
   
      //this.contentDiv.setStyle('height', height);
  // },
   
   getContentDiv : function( editMode ) {
      var self  = this;
   
      if ( !self.contentDiv ) {      
         // Content div has not been created yet
         self.image = new Element(
            'img',
            {
               'class' : 'image',
               'src'   : self.src,
            }
         );

         self.contentDiv = new Element('div', { 'class' : 'content' });
         self.contentDiv.adopt( self.image );
      }
      
      return self.contentDiv;
   },
   
   addEditDialogContent : function( div ) {
      this.parent( div );
      
      if ( dsGetSize( DS_IMAGEWINDOW_OPTIONS ) > 0 ) {
         this.imgInput = new Element( 'select' );
         for ( var key in DS_IMAGEWINDOW_OPTIONS ) {
            var option = new Element(
               'option',
               {
                  value : key,
                  html  : DS_IMAGEWINDOW_OPTIONS[ key ]
               }
            );
            
            this.imgInput.adopt( option );
         }
         // Create Image Label
         var lbl = new Element(
            'label',
            { html : 'Image : ' }
         );
         lbl.adopt( this.imgInput );
         div.adopt( lbl );
         
      } else {
         div.appendText( 'Image : No Images Uploaded.' );
      }
   },
   
   edit : function() {
      this.parent();
      
      this.file = this.imgInput.get('value');
      this.src  = DS_ADMIN_ASSET_DIR + this.file;
   },
   
   update : function() {
      this.parent();
      
      //this.src = DS_ADMIN_ASSET_DIR + this.img;
      this.image.set('src', this.src);
   },
   
   genData : function( data ) {
      //data.type = this.type;
      this.parent( data );
      
      data.file = this.file;
   },
});



/**
 * Table Window Class
 *
 */
var TableWindow = new Class(
{
   Extends: Window,
   options : {
      type  : 'table',
      title : 'Table Window',
      file  : 'tables/advisory1.txt',
   },
   
   initialize: function( options )
   {
      //his.file = file == null ? 'tables/advisory1.txt' : file;
      //this.type='table';
      this.parent( options );
      //alert( this.options.src ); alert( DS_ADMIN_ASSET_DIR );
      this.src = DS_ADMIN_ASSET_DIR + this.options.file;
      this.parseTable();
      
   },
   
   
   parseTable : function()
   {
      //filepath = assetDir+file;
      var self = this;

      var req = new Request({
         url        : self.src,
         async      : false,
         onComplete : function( response ) {
            var result = [];

            if (response != undefined) {
               var lines = response.split('\n');

            } else {
               var lines = [];
            }

            for(var l=0; l < lines.length; l+=1) {
               // And split into an array of tokens
               result[l] = lines[l].split(',');
               result[l].splice(result[l].length-1);
            }			
            self.tableData = result;

         },
      }).send();
      
   },
   
   createTable : function() {
      var self = this;
   
      self.table = new Element(
         'table',
         { 'class' : 'ds-table', }
      );
         
      for ( var i = 0; i < self.tableData.length; i++ ) {
         var tr = new Element('tr');
         self.table.adopt(tr);
            //tr.style.fontSize = 16*(window.scaleW/55.0);
				
         for ( var j = 0; j < self.tableData[i].length; j++ ) {
            var td = new Element(
               'td',
               {
                  html : '<center>' + self.tableData[i][j] + '</center>',
               }
            );
            tr.adopt(td);
            //td.style.fontSize = 16*(window.scaleW/55.0);
            //td.innerHTML = '<center>' + data[i][j] + '</center>';
         }
      }
   },
   
   getContentDiv : function( editMode ) {
      var self = this;
   
      if ( !self.contentDiv ) { 
      
         // Content div has not been created yet
         self.createTable();

         var div = new Element( 'div', { 'class' : 'content' } );
         div.adopt(self.table);
         
         self.contentDiv = div;
      }
      
      return self.contentDiv;
   },
   
   addEditDialogContent : function( div ) {
      this.parent( div );
      
      var tableOptions = DS_TABLEWINDOW_OPTIONS;
      
      if ( dsGetSize( tableOptions ) > 0 ) {
         this.tableInput = new Element( 'select' );
         for ( var key in tableOptions ) {
            var option = new Element(
               'option',
               {
                  value : key,
                  html  : tableOptions[ key ]
               }
            );
            
            this.tableInput.adopt( option );
         }
         // Create Image Label
         var lbl = new Element(
            'label',
            { html : 'Table : ' }
         );
         lbl.adopt( this.tableInput );
         div.adopt( lbl );
         
      } else {
         div.appendText( 'Table : No Tables Uploaded.' );
      }
   },
   
   edit : function() {
      this.parent();
   
      this.file = this.tableInput.get('value');      
      
   },
   
   update : function() {
      this.parent();
      this.table.destroy();
      this.src = DS_ADMIN_ASSET_DIR + this.file;
      this.parseTable();
      this.createTable();
      this.contentDiv.adopt( this.table );
   },
   
   genData : function( data ) {
      //data.type = this.type;
      this.parent( data );
      
      data.file = this.file;
   },
});




// Applet Types
/*
var DS_APPLETS = {
   'swf' : {
      options    : {
         source : 'test',
      },
      getElement : function( options ) {
         var self = this;
         var options = Object.merge(self.options, options);
         alert(options.source);
      
         var source = options.source;
         var obj = new Element(
            'object',
            {
               'class' : 'obj',
               'data'  : source,
               'type'  : 'application/x-shockwave-flash'
            }
         );
         var getFlashIcon = new Element('img', { 'src'  : 'http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif'}),
             getFlash     = new Element('a',   { 'href' : 'http://www.adobe.com/go/getflash' } );
         
         getFlash.adopt( getFlashIcon );
         obj.adopt( getFlash );
         obj.adopt( new Element('param', { 'name' : 'wmode', 'value' : 'transparent'}) );
         return obj;
      },
      
      prepareInput : function( content, options ) {
         var self = this;
         var options = Object.merge(self.options, options);
         //var options = {};
         
         // Create Select
         sourceInput = new Element(
            'select',
            {
               events  : {
                  'change' : function () {
                     options.source = this.get('value');
                  }
               }
            }
         );

         // Add Options
         var appletOptions = DS_APPLETWINDOW_OPTIONS;
         for ( var key in appletOptions ) {
            var option = new Element(
               'option',
               {
                  value      : key,
                  html       : appletOptions[ key ],
                  'selected' : (key == options.source),
               }
            );
            
            sourceInput.adopt( option );
         }
      
         // Create contentlabel
         var lbl = new Element(
            'label',
            { html : 'Source : ' }
         );
         lbl.adopt( sourceInput );
         content.adopt( lbl );
         
         // options;
      },
   },
};*/


var ObjectWindow = new Class({
	Extends: Window,
   options : {
      type       : 'applet',
      title      : 'Object Window',
      appletType : '',
      source     : '',
      //applet : {
      //   type    : '',
      //   options : {},
      //},
   },
   
	initialize: function( options ) {

  //    this.experiment = experiment;
//		this.type='object';
		this.parent( options );
		//this.trashable = false;
      
      this.appletType = this.options.appletType;
      this.source     = this.options.source;

/*

      this.objSourceBase = (nobjSrc==null) ? "(null)" : nobjSrc;

      var owThis = this;

      function getInstanceCount(name){
         if( nameTable[name] === undefined ){
            nameTable[name] = 0;
            return 0;
         }
         else return ++nameTable[name];
      }

      function genContent(){
         var content = owThis.div.getElement(".content");
         function mkObjStr(src,name,dir){
            //var objStr = "<object class='obj' data='" + src + "'/>";
            //return objStr;
            var object = document.createElement("object");
                object.class = 'obj';
                object.data  = src;
            return object;
         }
         function mkSwfStr(src,name,dir){
            //var swfStr = "<object class='obj' data='" + src + "' type='application/x-shockwave-flash'>"
            //           + "<param name='wmode' value='transparent'/>"
            //           + "<a href='http://www.adobe.com/go/getflash'>"
            //           + "<img src='http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player'/></a>"
            //           + "</object>";
            //return swfStr;
            var object = document.createElement("object");
                object.class = 'obj';
                object.data  = src;
                object.type  = 'application/x-shockwave-flash';
                object.innerHTML = "<a href='http://www.adobe.com/go/getflash'>"
                                 + "<img src='http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player'/></a>";
                object.appendChild(mkParam('wmode','transparent'));
            return object;
         }
         function mkJarStr(src,name,dir){
            //var jarStr = "<object type='application/x-java-applet' class='obj' id='javaobj'>"
            //           + "<param name='type' value='application/x-java-applet'/>" 
            //           + "<param name='code' value='" + name + ".class'/>" 
            //           + "<param name='codebase' value='" + dir + "'/>" 
            //           + "<param name='archive' value='" + name + ".jar'/>" 
            //           + "<param name='scriptable' value='true'/>" 
            //           + "</object>";
            //return jarStr;
            var object = document.createElement("object");
                object.class = 'obj';
                object.id    = 'javaobj';
                //object.data  = src;
                object.type  = 'application/x-java-applet';
                object.innerHTML = "[Failed to load]";
                object.standby   = "[Loading]... Please wait...";
                object.appendChild(mkParam('classid','java:'+name+'.class'));
                object.appendChild(mkParam('code',src));
                object.appendChild(mkParam('codebase',dir));
                object.appendChild(mkParam('archive',name + '.jar'));
                object.appendChild(mkParam('mayscript','true'));
                object.appendChild(mkParam('scriptable','true'));
            return object;
         }
// <WEBGL> - by Jordan
         function mkWebGLStr(src,name,dir){

            var object = document.createElement("div");
                object.class = 'webgl';
                object.id    = 'webglobj';
                object.innerHTML = "";

                // Create Canvas to render WebGL context on
                var c = document.createElement('canvas');
                c.setAttribute('class','webgl');
                c.setAttribute('id','webgl_canvas');
                object.appendChild(c);

                // Run WebGL script
                var s = document.createElement('script');
                s.setAttribute('type','text/javascript');
                s.setAttribute('src',src);
//alert(src);
                object.appendChild(s);

                object.standby   = "[Loading]... Please wait...";
            return object;
         }
// </WEBGL>
         function mkClsStr(src,name,dir){
            //var ClsStr = "<iframe><object classid='java:" + name + ".class' type='application/x-java-applet' class='obj' id='javaobj'>"
            //           + "<param name='codebase' value='" + dir + "'/>" 
            //           + "<param name='scriptable' value='true'/>" 
            //           + "</object></iframe>";
            //return ClsStr;

            var object = document.createElement("object");
                object.class = 'obj';
                object.id    = 'javaobj';
                //object.data  = src;
                object.type  = 'application/x-java-applet';
                object.innerHTML = "[Failed to load]";
                object.standby   = "[Loading]... Please wait...";
                object.appendChild(mkParam('classid','java:'+name+'.class'));
                object.appendChild(mkParam('code',src));
                object.appendChild(mkParam('codebase',dir));
                object.appendChild(mkParam('mayscript','true'));
                object.appendChild(mkParam('scriptable','true'));
            return object;
         }mkSpyLib = mkClsStr;
         if(owThis.objSourceBase === "(null)"){
            content.innerHTML = "[No content loaded]";
            owThis.objType = "none";
         }else{
            content.innerHTML = "";
            //content.adopt(mkObj("assets/userObjects/" + owThis.objSourceBase));
            var fields = owThis.objSourceBase.split(".");
            var suffix = fields[fields.length-1];
            var name = owThis.objName = owThis.objSourceBase.substr(0,owThis.objSourceBase.length-suffix.length-1);
            var srcDir = "assets/userObjects/";
            var objSrc = srcDir + owThis.objSourceBase;
            if(fields.length != 0){
               switch(suffix){
                  case 'swf':
                     //content.innerHTML = mkSwfStr(objSrc,name,srcDir);
                     owThis.styleObject = owThis.contentObject = mkSwfStr(objSrc,name,srcDir);
                     content.appendChild(owThis.contentObject);
                     owThis.objType = "swf";
                     break;
                  case 'jar':
                     //content.innerHTML = mkJarStr(objSrc,name,srcDir);
                     owThis.styleObject = owThis.contentObject = mkJarStr(objSrc,name,srcDir);
                     content.appendChild(owThis.contentObject);
                     //var ifr = document.createElement("iframe");
                     //    content.appendChild(ifr);
                     //    ifr.scrolling   = 'no';
                     //    ifr.frameborder = '0';
                     //    ifr.contentDocument.body.appendChild(owThis.contentObject);
                     //owThis.styleObject = ifr;
                     //owThis.contentObject.style.width='100%';
                     //owThis.contentObject.style.height='100%';
                     //owThis.contentObject.style.position='relative';
                     //owThis.objType = "jar";
                     break;
// <WEBGL> - Jordan - registers .js files as webgl scripts
                  case 'js':
                     owThis.styleObject = owThis.contentObject = mkWebGLStr(objSrc,name,srcDir);
                     content.appendChild(owThis.contentObject);
                     owThis.objType = "webgl";
                     break;
// </WEBGL>
                  case 'class':
                     //content.innerHTML = mkClsStr(objSrc,name,srcDir);
                     //owThis.contentObject = mkClsStr(objSrc,name,srcDir);


                     owThis.styleObject = owThis.contentObject = mkClsStr(objSrc,name,srcDir);
                     content.appendChild(owThis.contentObject);

                     
                     //owThis.contentObject = mkClsStr(objSrc,name,srcDir);
                     //owThis.styleObject   = document.createElement("div");
                     //content.appendChild(owThis.styleObject);
                     //owThis.styleObject.appendChild(owThis.contentObject);
                     
                     
                     
                    // var ifr = document.createElement("iframe");
                    //     content.appendChild(ifr);
                    //     ifr.scrolling   = 'no';
                   //      ifr.frameborder = '0';
                   //      ifr.marginwidth = ifr.marginheight = "0";
                   //      ifr.contentDocument.body.appendChild(owThis.contentObject);
                   //  owThis.styleObject = ifr;
                   //  owThis.contentObject.style.width='100%';
                   //  owThis.contentObject.style.height='100%';
                  //   owThis.contentObject.style.position='relative';
                     
                     
                     owThis.objType = "class";
                     break;
                  case 'html':
                     //content.innerHTML = mkObjStr(objSrc,name,srcDir);
                     owThis.styleObject = owThis.contentObject = mkObjStr(objSrc,name,srcDir);
                     content.appendChild(owThis.contentObject);
                     owThis.objType = "html";
                     break;
                  default:
                     //content.innerHTML = mkObjStr(objSrc,name,srcDir);
                     owThis.styleObject = owThis.contentObject = mkObjStr(objSrc,name,srcDir);
                     content.appendChild(owThis.contentObject);
                     owThis.objType = "other";
                     break;
               }
            }else{
                     content.innerHTML = mkObjStr(objSrc,name,srcDir);
            }
            //owThis.contentObject = content.getElement(".obj");
            //owThis.contentObject = content.getElementsByTagName("OBJECT")[0];
            owThis.styleObject.style.width    = "100%";
            owThis.styleObject.style.height   = "90%";
            owThis.styleObject.style.position = "absolute";
            //owThis.styleObject.style.zIndex = "0";

            switch(owThis.objType){
               case "jar":
               case "class":
                  var appname = owThis.objName + "_" + getInstanceCount(owThis.objName); 
                  owThis.contentObject.setName(appname);
                  owThis.contentObject.name = appname;
                  try{
                     document.getElementById('spyObj').attachSpyTo(appname);
                  }catch(e){
                     alert(e);
                  }
                  break;
               default:
                  break;
            }
         }
      }

      genContent();

      if(typeof editing != 'undefined') {
         this.div.getElement(".infohandle").getElement(".icon").onmouseup = function() { 

            var cb = function(asset) {
               owThis.objSourceBase = asset;
               owThis.objSourceBase = owThis.objSourceBase.trim();
               genContent();

            }

            openAssetPopup('applets', cb);

         }
      }*/

   },
   
   getContentDiv : function( editMode ) {
      var self = this;
   
      if ( !self.contentDiv ) {      
         // Content div has not been created yet
         var content = new Element( 'div', { 'class' : 'content' } );

         //<object type='application/x-java-applet' class='obj' id='javaobj'>"
            //           + "<param name='type' value='application/x-java-applet'/>" 
            //           + "<param name='code' value='" + name + ".class'/>" 
            //           + "<param name='codebase' value='" + dir + "'/>" 
            //           + "<param name='archive' value='" + name + ".jar'/>" 
            //           + "<param name='scriptable' value='true'/>" 
            //           + "</object>";
            /*
            object = document.createElement("object");
                object.class = 'obj';
                object.data  = src;
                object.type  = 'application/x-shockwave-flash';
                object.innerHTML = "<a href='http://www.adobe.com/go/getflash'>"
                                 + "<img src='http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player'/></a>";
                object.appendChild(mkParam('wmode','transparent'));
                */
                /*
         var obj = new Element('object', {'class' : 'obj', 'data' : 'assets/userObjects/test.swf', 'type' : 'application/x-shockwave-flash'});
         //obj.adopt( new Element('param', { 'name' : 'type', 'value' : 'application/x-java-applet'}) );
         var getFlashIcon = new Element('img', { 'src'  : 'http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif'}),
             getFlash     = new Element('a',   { 'href' : 'http://www.adobe.com/go/getflash' } );
         
         getFlash.adopt( getFlashIcon );
         obj.adopt( getFlash );
         //obj.adopt( new Element('param', { 'name' : 'archive', 'value' : 'AButton.jar'}) );
         obj.adopt( new Element('param', { 'name' : 'wmode', 'value' : 'transparent'}) );
         
         
         //obj.adopt( new Element('div') );
         
         content.adopt( obj );*/
         
         self.contentDiv = content;
      }
      
      return self.contentDiv;
   },
   
   addEditDialogContent : function( div ) {
      this.parent( div );
      var self = this;
      
      
      var appletOptions = DS_APPLETWINDOW_OPTIONS;
      if ( dsGetSize( appletOptions ) > 0 ) {
         
         //var appletSettings = new Element('div');
         
         this.appletTypeInput = new Element( 'select' );
         for ( var key in self.appletBuilder ) {
            var option = new Element(
               'option',
               {
                  value : key,
                  html  : key,
               }
            );
            
            this.appletTypeInput.adopt( option );
         }
         // Create Image Label
         var lbl = new Element(
            'label',
            { html : 'Applet Type: ' }
         );
         lbl.adopt( this.appletTypeInput );
         div.adopt( lbl );

         // Create Source Select
         self.sourceInput = new Element( 'select' );
         // Add Options
         var appletOptions = new Hash( DS_APPLETWINDOW_OPTIONS );
         appletOptions.each( function( value, key ) {
            var option = new Element(
               'option',
               {
                  value      : key,
                  html       : value,
                  'selected' : (key == self.source),
               }
            );
            
            self.sourceInput.adopt( option );
         });
         // Create contentlabel
         var lbl = new Element(
            'label',
            { html : 'Source : ' }
         );
         lbl.adopt( self.sourceInput );
         div.adopt( lbl );
         
         //div.adopt( appletSettings );
         
      } else {
         div.appendText( 'Applet : No Applets Uploaded.' );
      }
   },
   
   edit : function() {
      this.parent();
      
      this.appletType = this.appletTypeInput.get('value');
      this.source     = this.sourceInput.get('value');
      
      //this.applet = DS_APPLETS['swf'];
      //this.appletOptions = { 'source' : 'assets/userObjects/test.swf' };
      //alert(this.appletOptions.source);
      //this.appletType = this.appletTypeInput.get('value');;
      //this.time = this.timeInput.get('value');
   },
   
	update: function(o) 
	{
      this.parent();
	   //this.contentDiv.set('html', "Time Limit : " + this.time + " minutes");      
      
      //if ( this.applet ) {
      this.contentDiv.empty();
      if (  this.isValidAppletType() ) {
         this.applet = this.appletBuilder[ this.appletType ]( this.source );
         this.contentDiv.adopt( this.applet );
      }
      //}
      
   },
	//update: function(o) { this.div.getElement('.handle').innerHTML = o.index + hurricane_frame_num; },
   //update: function() { },
   
   genData : function( data ) {
      //data.type = this.type;
      this.parent( data );
      
      data.file = this.file;
   },
   
   isValidAppletType : function () {
      if ( this.appletBuilder[ this.appletType ] ) {
         return true;
      } else {
         return false;
      }
   },
   
   appletBuilder : {
      'Shockwave Flash' : function( source ) {
         var obj = new Element(
            'object',
            {
               'class' : 'obj',
               'data'  : DS_ADMIN_ASSET_DIR + source,
               'type'  : 'application/x-shockwave-flash',
               //html    : '[Failed to load]'
            }
         );
         var getFlashIcon = new Element('img', { 'src'  : 'http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif'}),
             getFlash     = new Element('a',   { 'href' : 'http://www.adobe.com/go/getflash' } );
         
         getFlash.adopt( getFlashIcon );
         obj.adopt( getFlash );
         obj.adopt( new Element('param', { 'name' : 'wmode', 'value' : 'transparent'}) );
         return obj;
      },
      
      'Java Applet' : function( source ) {
         var obj = new Element(
            'object',
            {
               'class'   : 'obj',
               //'data'    : source,
               'type'    : 'application/x-java-applet',
               'standby' : '[Loading]...',
               html      : '[Failed to load]',
            }
         );
         
         var startNdx = source.indexOf('/') + 1,
             endNdx   = source.lastIndexOf('.'),
             name     = source.substring(startNdx, endNdx);
         //alert(name);
         
         obj.adopt( new Element('param', { 'name' : 'archive', 'value' : DS_ADMIN_ASSET_DIR + source }) );
         obj.adopt( new Element('param', { 'name' : 'classid', 'value' : 'java:' + name + '.class'   }) );
         //obj.adopt( new Element('param', { 'name' : 'codebase', 'value' : 'assets/userObjects/'}) );
         //obj.adopt( new Element('param', { 'name' : 'code', 'value' : 'assets/userObjects/AButton.jar'}) );
         //obj.adopt( new Element('param', { 'name' : 'mayscript', 'value' : true}) );
         //obj.adopt( new Element('param', { 'name' : 'scriptable', 'value' : true}) );
         //var getFlashIcon = new Element('img', { 'src'  : 'http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif'}),
           //  getFlash     = new Element('a',   { 'href' : 'http://www.adobe.com/go/getflash' } );
         
         //getFlash.adopt( getFlashIcon );
         //obj.adopt( getFlash );
         //obj.adopt( new Element('param', { 'name' : 'wmode', 'value' : 'opaque'}) );
         return obj;
      },
      
      'WebGL' : function( source ) {
         var div = new Element( 'div', { 'class'   : 'obj'} );
         
         var startNdx = source.indexOf('/') + 1,
             endNdx   = source.lastIndexOf('.'),
             name     = source.substring(startNdx, endNdx); 
         
         // Create Canvas for rendering
         // Canvas ID is webgl_[source name]
         var canvas = new Element( 'canvas', { 'class' : 'webgl', id : 'webgl_' + name } );
         div.adopt( canvas );
         
         // Append Script
         var script = new Element(
         'script',
            {
               'type' : 'text/javascript',
               'src': DS_ADMIN_ASSET_DIR + source
            }
         );
         div.adopt( script );

         return div;
      },
   },
});




/*
var last_sidex = [0, 0];
var last_sidey = [0, 0];
var last_points=0, prev_point=0;

var toHandle = null;
var extMouseUp = function(){
   if(toHandle !== null){
      toHandle.onmouseup();
      toHandle = null;
   }
}
document.addEventListener("mouseup",extMouseUp,true);

var mkUnselectable = function(root){
   root.onselectstart = function(){return false;};
   if(root.className == undefined) root.className =   "unselectable";
   else                            root.className += " unselectable";
   //for(var child in root.childNodes) mkUnselectable(child);
   for(var i = 0; i < root.childNodes.length ; ++i ) mkUnselectable(root.childNodes[i]);
}

function mkParam(name,value){
   var param = document.createElement("param");
       param.name  = name;
       param.value = value;
   return param;
}

var clickif = /^DS_.;
function registerAppletClick(cid, ctime, comp){
   if( typeof editing == 'undefined' && clickif.test(comp) ){
      registerClick(cid,ctime);
   }
}

var TRUE  = true;
var FALSE = false;
function fireThreadHook(tname){
   var target = document.getElementsByName(tname)[0];
   if( typeof(target.firePropertyChange) != 'function' ) return TRUE;
   target.firePropertyChange('gogogadgetthreadhook',1748.8471,1830.0381);
   return FALSE;
}

// Object Window
var nameTable = {};
var ObjectWindow = new Class({
	Extends: Window,
	initialize: function(experiment,nobjSrc) {

      this.experiment = experiment;
		this.type='object';
		this.parent(undefined,'Object Window');
		this.trashable = false;

		//this.div.getElement(".content").innerHTML = "This is some sample text. Press the Info Button to edit me.";
		//this.div.getElement(".content").style.padding = "3px 3px";

      this.objSourceBase = (nobjSrc==null) ? "(null)" : nobjSrc;

      var owThis = this;

      function getInstanceCount(name){
         if( nameTable[name] === undefined ){
            nameTable[name] = 0;
            return 0;
         }
         else return ++nameTable[name];
      }

      function genContent(){
         var content = owThis.div.getElement(".content");
         function mkObjStr(src,name,dir){
            //var objStr = "<object class='obj' data='" + src + "'/>";
            //return objStr;
            var object = document.createElement("object");
                object.class = 'obj';
                object.data  = src;
            return object;
         }
         function mkSwfStr(src,name,dir){
            //var swfStr = "<object class='obj' data='" + src + "' type='application/x-shockwave-flash'>"
            //           + "<param name='wmode' value='transparent'/>"
            //           + "<a href='http://www.adobe.com/go/getflash'>"
            //           + "<img src='http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player'/></a>"
            //           + "</object>";
            //return swfStr;
            var object = document.createElement("object");
                object.class = 'obj';
                object.data  = src;
                object.type  = 'application/x-shockwave-flash';
                object.innerHTML = "<a href='http://www.adobe.com/go/getflash'>"
                                 + "<img src='http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player'/></a>";
                object.appendChild(mkParam('wmode','transparent'));
            return object;
         }
         function mkJarStr(src,name,dir){
            //var jarStr = "<object type='application/x-java-applet' class='obj' id='javaobj'>"
            //           + "<param name='type' value='application/x-java-applet'/>" 
            //           + "<param name='code' value='" + name + ".class'/>" 
            //           + "<param name='codebase' value='" + dir + "'/>" 
            //           + "<param name='archive' value='" + name + ".jar'/>" 
            //           + "<param name='scriptable' value='true'/>" 
            //           + "</object>";
            //return jarStr;
            var object = document.createElement("object");
                object.class = 'obj';
                object.id    = 'javaobj';
                //object.data  = src;
                object.type  = 'application/x-java-applet';
                object.innerHTML = "[Failed to load]";
                object.standby   = "[Loading]... Please wait...";
                object.appendChild(mkParam('classid','java:'+name+'.class'));
                object.appendChild(mkParam('code',src));
                object.appendChild(mkParam('codebase',dir));
                object.appendChild(mkParam('archive',name + '.jar'));
                object.appendChild(mkParam('mayscript','true'));
                object.appendChild(mkParam('scriptable','true'));
            return object;
         }
// <WEBGL> - by Jordan
         function mkWebGLStr(src,name,dir){

            var object = document.createElement("div");
                object.class = 'webgl';
                object.id    = 'webglobj';
                object.innerHTML = "";

                // Create Canvas to render WebGL context on
                var c = document.createElement('canvas');
                c.setAttribute('class','webgl');
                c.setAttribute('id','webgl_canvas');
                object.appendChild(c);

                // Run WebGL script
                var s = document.createElement('script');
                s.setAttribute('type','text/javascript');
                s.setAttribute('src',src);
//alert(src);
                object.appendChild(s);

                object.standby   = "[Loading]... Please wait...";
            return object;
         }
// </WEBGL>
         function mkClsStr(src,name,dir){
            //var ClsStr = "<iframe><object classid='java:" + name + ".class' type='application/x-java-applet' class='obj' id='javaobj'>"
            //           + "<param name='codebase' value='" + dir + "'/>" 
            //           + "<param name='scriptable' value='true'/>" 
            //           + "</object></iframe>";
            //return ClsStr;

            var object = document.createElement("object");
                object.class = 'obj';
                object.id    = 'javaobj';
                //object.data  = src;
                object.type  = 'application/x-java-applet';
                object.innerHTML = "[Failed to load]";
                object.standby   = "[Loading]... Please wait...";
                object.appendChild(mkParam('classid','java:'+name+'.class'));
                object.appendChild(mkParam('code',src));
                object.appendChild(mkParam('codebase',dir));
                object.appendChild(mkParam('mayscript','true'));
                object.appendChild(mkParam('scriptable','true'));
            return object;
         }mkSpyLib = mkClsStr;
         if(owThis.objSourceBase === "(null)"){
            content.innerHTML = "[No content loaded]";
            owThis.objType = "none";
         }else{
            content.innerHTML = "";
            //content.adopt(mkObj("assets/userObjects/" + owThis.objSourceBase));
            var fields = owThis.objSourceBase.split(".");
            var suffix = fields[fields.length-1];
            var name = owThis.objName = owThis.objSourceBase.substr(0,owThis.objSourceBase.length-suffix.length-1);
            var srcDir = "assets/userObjects/";
            var objSrc = srcDir + owThis.objSourceBase;
            if(fields.length != 0){
               switch(suffix){
                  case 'swf':
                     //content.innerHTML = mkSwfStr(objSrc,name,srcDir);
                     owThis.styleObject = owThis.contentObject = mkSwfStr(objSrc,name,srcDir);
                     content.appendChild(owThis.contentObject);
                     owThis.objType = "swf";
                     break;
                  case 'jar':
                     //content.innerHTML = mkJarStr(objSrc,name,srcDir);
                     owThis.styleObject = owThis.contentObject = mkJarStr(objSrc,name,srcDir);
                     content.appendChild(owThis.contentObject);
                     //var ifr = document.createElement("iframe");
                     //    content.appendChild(ifr);
                     //    ifr.scrolling   = 'no';
                     //    ifr.frameborder = '0';
                     //    ifr.contentDocument.body.appendChild(owThis.contentObject);
                     //owThis.styleObject = ifr;
                     //owThis.contentObject.style.width='100%';
                     //owThis.contentObject.style.height='100%';
                     //owThis.contentObject.style.position='relative';
                     //owThis.objType = "jar";
                     break;
// <WEBGL> - Jordan - registers .js files as webgl scripts
                  case 'js':
                     owThis.styleObject = owThis.contentObject = mkWebGLStr(objSrc,name,srcDir);
                     content.appendChild(owThis.contentObject);
                     owThis.objType = "webgl";
                     break;
// </WEBGL>
                  case 'class':
                     //content.innerHTML = mkClsStr(objSrc,name,srcDir);
                     //owThis.contentObject = mkClsStr(objSrc,name,srcDir);


                     owThis.styleObject = owThis.contentObject = mkClsStr(objSrc,name,srcDir);
                     content.appendChild(owThis.contentObject);

                     
                     //owThis.contentObject = mkClsStr(objSrc,name,srcDir);
                     //owThis.styleObject   = document.createElement("div");
                     //content.appendChild(owThis.styleObject);
                     //owThis.styleObject.appendChild(owThis.contentObject);
                     
                     
                     
                    // var ifr = document.createElement("iframe");
                    //     content.appendChild(ifr);
                    //     ifr.scrolling   = 'no';
                   //      ifr.frameborder = '0';
                   //      ifr.marginwidth = ifr.marginheight = "0";
                   //      ifr.contentDocument.body.appendChild(owThis.contentObject);
                   //  owThis.styleObject = ifr;
                   //  owThis.contentObject.style.width='100%';
                   //  owThis.contentObject.style.height='100%';
                  //   owThis.contentObject.style.position='relative';
                     
                     
                     owThis.objType = "class";
                     break;
                  case 'html':
                     //content.innerHTML = mkObjStr(objSrc,name,srcDir);
                     owThis.styleObject = owThis.contentObject = mkObjStr(objSrc,name,srcDir);
                     content.appendChild(owThis.contentObject);
                     owThis.objType = "html";
                     break;
                  default:
                     //content.innerHTML = mkObjStr(objSrc,name,srcDir);
                     owThis.styleObject = owThis.contentObject = mkObjStr(objSrc,name,srcDir);
                     content.appendChild(owThis.contentObject);
                     owThis.objType = "other";
                     break;
               }
            }else{
                     content.innerHTML = mkObjStr(objSrc,name,srcDir);
            }
            //owThis.contentObject = content.getElement(".obj");
            //owThis.contentObject = content.getElementsByTagName("OBJECT")[0];
            owThis.styleObject.style.width    = "100%";
            owThis.styleObject.style.height   = "90%";
            owThis.styleObject.style.position = "absolute";
            //owThis.styleObject.style.zIndex = "0";

            switch(owThis.objType){
               case "jar":
               case "class":
                  var appname = owThis.objName + "_" + getInstanceCount(owThis.objName); 
                  owThis.contentObject.setName(appname);
                  owThis.contentObject.name = appname;
                  try{
                     document.getElementById('spyObj').attachSpyTo(appname);
                  }catch(e){
                     alert(e);
                  }
                  break;
               default:
                  break;
            }
         }
      }

      genContent();

      if(typeof editing != 'undefined') {
         this.div.getElement(".infohandle").getElement(".icon").onmouseup = function() { 

            var cb = function(asset) {
               owThis.objSourceBase = asset;
               owThis.objSourceBase = owThis.objSourceBase.trim();
               genContent();

            }

            openAssetPopup('applets', cb);

         }
      }

   },
	//update: function(o) { this.div.getElement('.handle').innerHTML = o.index + hurricane_frame_num; },
   update: function(o) { },
});


var InteractiveTableWindow = new Class({
   Extends: Window,
   initialize: function(experiment, file)
   {
      this.table = new Element('table');
      this.experiment = experiment;
		this.file = file == null ? '' : file;
		this.type='ext_table';
		this.parent(undefined,'InteractiveTable');

      this.border = '1';

      this.fromFile();

      var myself = this;
            
      if(typeof editing != 'undefined') {
         this.div.getElement(".infohandle").getElement(".icon").onmouseup = function(){ 

            var pd = this.parentNode.parentNode.getElement('.content');
            var pdh = this.parentNode.parentNode.getElement('.handle');
            var file = "";
            var pdChild = pd.getChildren();
            pdChild = pdChild[0];
         
            var cb = function(asset) {

               file = asset;
               pdh.innerHTML = prompt("Please enter your new title for this box, or press Okay to keep the current text.", pdh.innerHTML);
               while(pdh.innerHTML == ''){
                  pdh.innerHTML = prompt("A title is required for this element.  Please enter a title here.", pdh.innerHTML);;
               }

               myself.fromFile(file);
            }

            openAssetPopup('image_tables', cb);

         }
      }
   
   },
   fromFile: function(file){
      if(file != null) this.file = file;

//      this.table = new Element('table');
      this.table.setAttribute('class', 'dynaview_ext_table');
      this.table.tabID = this.file+"_";
      this.table.setAttribute('id', this.tabID);
      this.table.innerHTML = "";

      this.table.style.width="100%";
      this.table.style.height="90%";
      this.table.style.position="absolute";
      this.table.style.top="1em";

      this.toTrack = [];

      ext_table_parser(this.experiment,this.file,this.div.id);
      var data = ext_table_data[this.file];

      var rhead = data.row_header;
      var r_N   = data.num_rows;
      var chead = data.col_header;
      var c_N   = data.num_cols;
      var User_tableID = data.tabID;

      //var mkCell = function(label,eventID,tabID){
      var mkTD = function(cell){
          var tdel = new Element('td');
          
         // if(eventID != ""){
         //    tdel.onmouseup = function(){
         //      var sig = document.createEvent("Event");
         //          sig.tabID   = tabID;
         //          sig.eventID = eventID;
         //          //sig.initEvent(eventID,true,true);
        //           sig.initEvent("ImageWindowEvent",true,true);
        //       document.dispatchEvent(sig);
       //      }

      
	  }
  //        
          tdel.style.padding = tdel.style.margins = "0";
          tdel.style.textalign = "center";
          if(cell['com'] != ""){
             tdel.style.cursor = "pointer";
             tdel.onmouseup = function(){
               var sig = document.createEvent("Event");
                   sig.signal    = "mouseup"
                   sig.tabID   = User_tableID;
                   sig.com     = cell.com;
                   sig.cargs   = cell.cargs;
                   sig.initEvent("ImageWindowEvent",true,true);
               toHandle = null;
               document.dispatchEvent(sig);
             }
             tdel.onmousedown = function(){
               var sig = document.createEvent("Event");
                   sig.signal    = "mousedown"
                   sig.tabID   = User_tableID;
                   sig.com     = cell.com;
                   sig.cargs   = cell.cargs;
                   sig.initEvent("ImageWindowEvent",true,true);
               toHandle = this;
               document.dispatchEvent(sig);
             }
             tdel.onmouseover = function(){
                this.oldbgcolor = this.style.backgroundColor;
                this.style.backgroundColor = "#FFFFFF";
             }
             tdel.onmouseout = function(){
                this.style.backgroundColor = this.oldbgcolor;
             }

          }else{
             tdel.style.cursor = "crosshair";
          }
          tdel.style.fontSize = 16*(window.scaleW/55.0);
          tdel.innerHTML = '<center>' + cell.label + '</center>';

          return tdel;
      }

      
      //var rhead_html = new Element('tr');
      //    rhead_html.fontSize = 16*(window.scaleW/55.0);
     // for(int i=0; i < r_N; ++i){
     //    var td = mkCell(rhead[i],"",this.tabID);
     //    rhead_html.adopt(td);
     // }
    //  this.table.adopt(rhead_html);
      

      for(var j=0; j < r_N; ++j){
         var tr = new Element('tr');
             tr.fontSize = 16*(window.scaleW/55.0);
         for(var i=0; i < c_N; ++i ){
            var cell = data[c_N*j + i];
            //var td = mkCell(cell.label,cell.eventID,this.file);
            var td = mkTD(cell);
            td.id = "x_toTrackExtTable_" + this.table.tabID + j + "_" + i;
            if(j*i==0){
               td.style.fontWeight="600";
               td.style.fontStyle="Oblique";
            }
            td.style.border="inherit";
            tr.adopt(td);
            this.toTrack.push(td);
         }
         this.table.adopt(tr);
      }

      this.content.adopt(this.table);

      //mkUnselectable(this.content);
      mkUnselectable(this.div);

   },
});

var TableWindow = new Class(
{
   Extends: Window,
   initialize: function(experiment, file)
   {
      this.file = file == null ? '' : file;
      this.type='table';
      this.parent(undefined,'Table');
      if (true)
	  {	
         this.table  = new Element('table');
         this.table.setAttribute('class', 'dynaview_table');
         this.table.setAttribute('id', file+"_");
         this.border = '1';

         table_parser(experiment, this.file, this.div.id);

         var data = table_data[this.file];
			
         for(var i=0; i < data.length; i+=1)
		 {
            var tr = new Element('tr');
            this.table.adopt(tr);
            tr.style.fontSize = 16*(window.scaleW/55.0);
				
            for(var j=0; j < data[i].length;j+=1)
			{
               var td = new Element('td');
               tr.adopt(td);
               td.style.fontSize = 16*(window.scaleW/55.0);
               td.innerHTML = '<center>' + data[i][j] + '</center>';
            }
         }
					
         if(typeof editing != 'undefined')
         {
            this.div.getElement(".infohandle").getElement(".icon").onmouseup = function()
            { 
               var pd = this.parentNode.parentNode.getElement('.content');
               var pdh = this.parentNode.parentNode.getElement('.handle');
               var file = "";
               var pdChild = pd.getChildren();
               pdChild = pdChild[0];
			   
               var curFile = "";
               for(var k=0; k < updatables.length; k+=1)
               {		
                  var w = updatables[k];
                  if(w.type == 'table')
                  {
                     if(pd === w.content)
                     {
                        curFile = w.file;
                     }
                  }
               }

               var cb = function(asset)
			   {
                  file = asset;
                  for(var i=0; i < updatables.length; i+=1)
                  {
                     w = updatables[i];
                     if(w.type == 'table')
					 {
                        if(pd === w.content)
						{
                           w.file = file;
                           //pdChild = new Element('table');
                           pdChild.setAttribute('class', 'dynaview_table');
                           pdChild.setAttribute('id', w.file+"_");
                           pdChild.innerHTML = "";
		  				
                           table_parser(experiment, w.file, pdChild.id);
                           var data = table_data[w.file];
                           for(var r=0; r < data.length; r+=1)
						   {
                              var tr = new Element('tr');
                              pdChild.adopt(tr);
                              for(var j=0; j < data[r].length;j+=1)
							  {
                                 var td = new Element('td');
                                 tr.adopt(td);
                                 td.innerHTML = '<center>' + data[r][j] + '</center>';
                              }
                           }
                        }
                     }
                  }

                  pdh.innerHTML = prompt("Please enter your new title for this box, or press Okay to keep the current text.", pdh.innerHTML);
			   	   while(pdh.innerHTML == ''){
				      pdh.innerHTML = prompt("A title is required for this element.  Please enter a title here.", pdh.innerHTML);;
                   }

               }

               openAssetPopup('tables', cb);
            }
         }
		
         this.content.adopt(this.table);		
      }
   },
});*/
