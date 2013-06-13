
// Custom Page Class



var Experiment = new Class({
   Implements : [Options],
   options : {
      container : 'custom-page',
      id        : -1,
      pages     : [],
   },

	initialize : function( options ) {
   
      this.setOptions( options );
      
      this.el = $(this.options.container);
      
      this.id   = this.options.id;
      this.name = this.options.name;
      
      this.type = 'experiment';
      
		//this.name = 'test';
      //this.title     = (typeof title   === 'undefined') ? 'Untitled' : title;
      
      this.pages = new Array();
      //this.windows.push( 0 );
      //this.windows.push( 0 );
      
      this.sortables = new Sortables(
         this.el,
         {
            clone   : true,
            opacity : 0.5,
            handle  : '.drag-handle',
         }
      );
      
      //this.manageAspectRatio();
      //this.manageAspectRatio();
      
      /*
		
		
		add_updatable(this);*/
      
      // Check for windows to load
      //alert(this.options.windows[0].type);
      var self = this;
      this.options.pages.each( function( pageData ) {
         var page = DS_PAGE_CONSTRUCTOR( pageData );
         self.addPage( page );
      });
	},
   
   
   addPage : function( page ) {
      // Associate window with this page
      //win.setPage( this );
      
      // Add window
      this.pages.push( page );
      page.setHolder( this );
      
      var pageEl = page.getElement();
      
      // Add window DOM element to page
      this.el.adopt( pageEl );
      
      this.sortables.addItems( pageEl );
   },
   
   removePage : function( page ) {
      // Remove window from page
      this.pages.erase( page );
      
      // Destroy window DOM element
      page.destroy();
      //alert(page.type);
   },
   
   newExperiment : function() {
      /*
      this.windows.each( function( win ) {
         win.destroy();
         //alert(win);
      });
      this.windows.empty();

      this.id = -1;
      
      this.btnSave.set('disabled', 'disabled');
      this.btnDelete.set('disabled', 'disabled');
      */
   },
   
   saveExperiment : function() {
      
      // Generate Page Data
      var data = {
         pages : [],
      };
      
      data.pages = this.sortables.serialize(false, function(element, index) {
         var page = element.obj;
         return page.serialize();
      });
alert( JSON.stringify( data ) );
      return JSON.stringify( data );
   },
   
   savePageAs : function() {
      /*var self = this;
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
      */
   },
   
   loadPage : function() {
      /*var self = this;
      
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
      */
   },
   
   deletePage : function() {
   /*
      var self = this;
      //if
      if ( self.options.deleteFunction ) {
          self.options.deleteFunction( self.id );
      }
      //alert('todo');
      */
   },
   
	update : function() {
      //this.titleDiv.set('html', this.title);
      //this.contentDiv.set('html', this.content);
   },
});

   /*},

});*/