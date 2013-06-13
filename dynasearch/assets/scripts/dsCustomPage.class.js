//Asset.javascript( DS_SCRIPT_BASE_PATH + 'classWindow.js', { onLoad : function() {
//ds_include('classWindow.js');


var DS_CUSTOMPAGE_OPTIONS     = {};

// Custom Page Class

var DS_WINDOW_CONSTRUCTOR = function( options ) {
   switch( options.type ) {
   
      case 'clock' :
         return new ClockWindow( options );
         
      case 'text' :
         return new TextWindow( options );
         
      case 'image' :
         return new ImageWindow( options );
         
      case 'table' :
         return new TableWindow( options );
         
      case 'applet' :
         return new AppletWindow( options );
         
      default :
         alert('ERROR : Undefined window type!');
         break;
   }
};

var CustomPage = new Class({
   Implements : [Options],
   options : {
      container       : 'custom-page',
      id              : -1,
      editMode        : false,
      responsive      : true,
      recordAllClicks : false,
      windows         : [],
      
      timeoutFunction : function() {},
   },

	initialize : function( options ) {
   
      this.setOptions( options );
      
      this.el = $(this.options.container);
      
      this.id   = this.options.id;
      this.name = this.options.name;
      
		//this.name = 'test';
      //this.title     = (typeof title   === 'undefined') ? 'Untitled' : title;
      
      this.windows = new Array();
      //this.windows.push( 0 );
      //this.windows.push( 0 );
      
      var self = this;
      if ( this.options.editMode ) {
         this.setupToolbar();
         this.el.adopt( this.toolbar.getElement(true) );
      
      } else {
         // Setup Click Recording
         self.clicks = [];
         $(document.body).addEvent( 'mousedown', self.onMouseDown.bind(self) );
         $(document.body).addEvent( 'mouseup',   self.onMouseUp.bind(self)   );
      }
      //this.manageAspectRatio();
      //this.manageAspectRatio();
      
      /*
		
		
		add_updatable(this);*/
      
      // Check for windows to load
      //alert(this.options.windows[0].type);
      var self = this;
      this.options.windows.each( function( winData ) {
         //alert('adding window');
         //alert(winData.type);
         var win = DS_WINDOW_CONSTRUCTOR( winData );
         self.addWindow( win );
      });
      
      this.update();

	},
   
   setupToolbar : function() {
   //alert('tb');
      var self = this;
   
      self.toolbar = new Toolbar({
         page : self,
         width  : (320 / WINDOW_SCALE_X),
         height : (180 / WINDOW_SCALE_Y),
      });
      self.toolbar.addWindowFunction = self.addWindow.bind(self);
      
   	self.toolbar.addIcon( new TrashbinToolbarIcon() );
      self.toolbar.addIcon( new ClockWindowToolbarIcon() );
   	self.toolbar.addIcon( new TextWindowToolbarIcon() );
      //tb.addIcon( new ToolbarIcon_TextWindow_NoHide() );
      self.toolbar.addIcon( new ImageWindowToolbarIcon() );
      self.toolbar.addIcon( new TableWindowToolbarIcon() );
   	self.toolbar.addIcon( new ObjectWindowToolbarIcon() );
   	//self.toolbar.addIcon( new ToolbarIcon_ext_TableWindow() );
      
      self.btnNew    = self.toolbar.addActionBtn( 'New',       self.newPage.bind(self)    );
      self.btnSave   = self.toolbar.addActionBtn( 'Save',      self.savePage.bind(self)   );
      self.btnSaveAs = self.toolbar.addActionBtn( 'Save As..', self.savePageAs.bind(self) );
      self.btnLoad   = self.toolbar.addActionBtn( 'Load...',   self.loadPage.bind(self)   );
      self.btnDelete = self.toolbar.addActionBtn( 'Delete',    self.deletePage.bind(self) );
      
      if ( self.id == -1 ) {
         self.btnSave.set('disabled', 'disabled');
         self.btnDelete.set('disabled', 'disabled');
      }
      
      if ( dsGetSize( DS_CUSTOMPAGE_OPTIONS ) == 0  ) {
         self.btnLoad.set('disabled', 'disabled');
      }
   },
   
   addWindow : function( win ) {
      // Associate window with this page
      win.setPage( this );
      
      //win.editable = this.editMode;
      
      // Add window
      this.windows.push( win );
      
      // Add window DOM element to page
      this.el.adopt( win.getElement( this.options.editMode ) );
   },
   
   removeWindow : function( win ) {
      // Remove window from page
      this.windows.erase( win );
      
      // Destroy window DOM element
      win.destroy();
   },
   
   newPage : function() {
      
      this.windows.each( function( win ) {
         win.destroy();
         //alert(win);
      });
      this.windows.empty();

      this.id = -1;
      
      this.btnSave.set('disabled', 'disabled');
      this.btnDelete.set('disabled', 'disabled');
   },
   
   savePage : function() {
      
      // Generate Page Data
      
      var data = {
         windows : [],
      }; 
      
      this.windows.each( function( win ) {
         //win.destroy();
         var winData = {};
         win.genData( winData );
         data.windows.push( winData );
         //dataStr += win.genData();
         //dataStr += '&';
         //alert(win);
      });
      
      var dataStr = JSON.stringify( data );
      alert( dataStr );
      //this.data = dataStr;
      // Clip off the last extra '&'
	   //dataStr = dataStr.substring( 0, dataStr.length - 1 );
	
	//var pos = new Array();
	//alert("Starting!");
	
   /*
	for(var i=0; i < updatables.length; i+=1)
	{		
		var w = updatables[i];
		if(w.type == 'toolbar') { continue; } // Don't save toolbars
		if(w.div.getElement('.handle') == null) { continue; }
		
		//
		var type = str_to_hex(w.type);
		
		//
		var title = str_to_hex(w.div.getElement('.handle').innerHTML);
		
		//
		pos = findPos(w.div);
		var top_left_x = pos[0]/window.scaleW;
		var top_left_y = pos[1]/window.scaleH;
		// Edited by Jon to support resizing
		var window_width = w.get_width()/window.scaleW;
		var window_height = w.get_height()/window.scaleH;		
		var rect = str_to_hex( top_left_x.toString() ) + ',' + str_to_hex( top_left_y.toString() ) + ',' + str_to_hex( window_width.toString() ) + ',' + str_to_hex( window_height.toString() );
		//alert(rect);
		
		//
		save_string += type + ',' + title + ',' + rect + ',';
		
		
		if(w.type == 'text' || w.type == 'text_nohide')
		{
			save_string += str_to_hex(w.div.getElement('.content').innerHTML);
		}
		else if(w.type == 'table')
		{
			save_string += str_to_hex(w.file);
		}
		else if(w.type == 'ext_table')
		{
          save_string += str_to_hex(w.file);
        }
		else if(w.type == 'image')
		{
          save_string += str_to_hex(w.def_imgbase);
          //alert(w.tableLink);
          save_string += ',' + str_to_hex(w.tableLink);
        }
		else if(w.type == 'object')
		{
          save_string += str_to_hex(w.objSourceBase);
        }
	    else if(w.type == 'clock')
	    {
   	      save_string += w.time;
	    }
		
		save_string += '&';
	}*/
      
      
      if ( this.options.saveFunction ) {
         this.options.saveFunction( this.id, this.name, dataStr );
      }

   },
   
   savePageAs : function() {
      var self = this;
      var nameInput = new Element( 'input', { 'type' : 'text' } );
      
      var label = new Element('label', { html : 'Custom Page Name : ' } );
      label.adopt( nameInput );
      
      // Display 'Save As' mBox dialog
      var saveAsBox = new mBox.Modal({
         title   : 'Save Custom Page',
         content : label,
         overlay : true,
         closeOnBodyClick : false,
         buttons : [
            { title : 'Cancel', },
            {
               title : 'Save' ,
               event : function() {

                  var name = nameInput.get( 'value' );

                  if ( name ) {
                  
                     // Check if name is already used
                     var params = new Array(
                        'Name', name,
                        'Admin_ID', ADMIN_ID);
                     var request = new Request({
                        method    : 'post',
                        url       : './assets/php/db_util.php',
                        data      : {
                           'query'  : 'select',
                           'table'  : 't_custom_pages',
                           'params' : params
                        },
                        onSuccess : function(response) {

                           var arr    = JSON.decode(response);
                           if (arr.length > 0) {
                              // Name exists, not available
                              alert('This name is already in use. Please save under a unique name.');

                           } else {
                              // Close mBox
                              saveAsBox.close();
                              
                              // Set default ID and new Name
                              self.id   = -1;
                              self.name = name;
                     
                              // Execute Save
                              self.savePage();
                           } 
                        }
                     }).send();
                  }
               },
               addClass : 'button-green' }
         ],
      }).open();

   },
   
   loadPage : function() {
      var self = this;
      
      var idSelect = new Element( 'select' );
      for ( var key in DS_CUSTOMPAGE_OPTIONS ) {
         var option = new Element(
            'option',
            {
               value : key,
               html  : DS_CUSTOMPAGE_OPTIONS[ key ]
            }
         );
            
         idSelect.adopt( option );
      }
      
      // Create Image Label
      var label = new Element(
         'label',
         { html : 'My Custom Pages : ' }
      );
      label.adopt( idSelect );
      
      // Display 'Load' mBox dialog
      var loadBox = new mBox.Modal({
         title   : 'Load Custom Page',
         content : label,
         overlay : true,
         closeOnBodyClick : false,
         buttons : [
            { title : 'Cancel', },
            {
               title : 'Load' ,
               event : function() {
                  // Close mBox
                  loadBox.close();
                  
                  // Call load function if defined
                  if ( self.options.loadFunction ) {
                     self.options.loadFunction( idSelect.get( 'value' ) );
                  }
                  
               },
               addClass : 'button-green' }
         ],
      }).open();
   },
   
   deletePage : function() {
      var self = this;
      //if
      if ( self.options.deleteFunction ) {
          self.options.deleteFunction( self.id );
      }
      //alert('todo');
   },
   
   calculateHeight : function() {
      var self = this;
      var height = 0;
      self.windows.each( function( win ) {
         var size      = win.el.getSize();
         var position  = win.el.getPosition();
         var vertSpace = size.y + position.y;
         //alert(size.y);
         
         if ( vertSpace > height ) {
            height = vertSpace;
         }
      });
      
      var offset  = self.el.getPosition().y;
      return height - offset;
   },
   
	update : function() {
      if ( this.options.responsive ) {
         var height = this.calculateHeight();
         this.el.setStyle('height', height + 'px');
      }
   },
   
   timeout : function() {
      if ( this.options.timeoutFunction ) {
         this.options.timeoutFunction();
      }
   },
   
   // Manage Click Data
   registerClick : function() {
      var self      = this;
      var id        = self.currentClick.id;
      var startTime = self.currentClick.startTime;
      var endTime   = self.currentClick.endTime;
      var duration  = endTime - startTime;
      var startPos  = self.currentClick.startPos;
      var endPos    = self.currentClick.startPos;
      
      if ( id || self.options.recordAllClicks ) {
         // If id is null, click was not on window
         id = ( id ? id : 'Page Body' );
      
         // Create Click
         var click = {
            id       : id,
            duration : duration,
            startPos : startPos,
            endPos   : endPos,
            
         };
         self.clicks.push( click );
      }
   },
   
   onMouseDown : function( event, id ) {
      // Stop Bubbling
      event.stop();
      
      // Start Time
	   var today = new Date();
      
	   var click = {
         startTime : today.getTime(),
         id        : id,
         startPos  : event.page,
      };
      this.currentClick = click;
      
      //alert(today.getTime());
	   //id = event.target.id;
//alert(event.target.get('class'));
	   //id = (event.tdid==undefined)?event.target.id:event.tdid;
   },
   
   onMouseUp : function( event ) {
      // Increment Click Counter
      //this.clickCount += 1;
      
      // Stop Bubbling
      event.stop();

      // Record stop time
		var today                 = new Date();
      this.currentClick.endTime = today.getTime();
      this.currentClick.endPos  = event.page;
      //alert(today.getTime());
      // Register Click
      this.registerClick();
      
		//document.getElementById('clickData').innerHTML += "<input type='hidden' id='clickNum" + clickNum + "' name='clickNum" + clickNum + "' value= " + clickNum + " /> <input type='hidden' id='elemId" + clickNum + "' name='elemId" + clickNum + "' value= " + id + " /> <input type='hidden' id='clickTime" + clickNum + "' name='clickTime" + clickNum + "' value= " + newTime/1000 + "/>";
		//document.getElementById('totalClicks').innerHTML=  "<input type='hidden' id='totalClicks' name='totalClicks' value=" + clickNum + " />";
   },
   
   getClickResults : function() {
      return this.clicks;
   },
});

   /*},

});*/