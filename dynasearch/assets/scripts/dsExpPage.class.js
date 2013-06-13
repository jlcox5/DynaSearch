// To move to util file

/*Array.implement( 'getSize', function() {
   var count = 0;
   this.each( function( item, index ) {
      count++;
   });
   return count;
});*/

var /*DSWINDOW_RESIZE_ICON_PATH = 'assets/images/resize_icon.png',
    DSWINDOW_EDIT_ICON_PATH   = 'assets/images/icon-info.png',
    
    DS_ADMIN_ASSET_DIR        = '',
    
    DS_IMAGEWINDOW_DEFAULT_SRC = 'assets/images/test_icon.png',*/
    DS_EXP_INFO_PAGE_OPTIONS     = {},
    
    DS_EXP_CUSTOM_PAGE_OPTIONS   = {},
    
    DS_EXP_QUEST_PAGE_OPTIONS    = {};



var DS_EXP_INFO_PAGE_TAG   = 'info',
    DS_EXP_CUSTOM_PAGE_TAG = 'custom',
    DS_EXP_QUEST_PAGE_TAG  = 'quest',
    DS_EXP_BRANCH_TAG      = 'branch';

var DS_PAGE_CONSTRUCTOR = function( options ) {
   switch( options.type ) {
   
      case DS_EXP_INFO_PAGE_TAG :
         return new ExpInfoPage( options );
         
      case DS_EXP_CUSTOM_PAGE_TAG :
         return new ExpCustomPage( options );
         
      case DS_EXP_QUEST_PAGE_TAG :
         return new ExpQuestPage( options );
         
      case DS_EXP_BRANCH_TAG :
         return new ExpBranch( options );
         
      default :
         alert('ERROR : Undefined page type!');
         break;
   }
};


var ExpPage = new Class({
   Implements : [Options],
   options : {
      type       : '',
      //experiment : null,
      //title : '',
      //id        : -1,
   },

	initialize : function( options ) {
      this.setOptions( options );
      
      this.type = this.options.type;
	},
   
   setHolder : function ( holder ) {
      this.holder = holder;
   },
   
   handleDelete : function () {
      if ( this.holder ) {
         this.holder.removePage( this );
      } else {
         alert('Error : Page not associated with a Holder!');
      }
   },
   
   destroy : function () {
      this.el.destroy();
   },
   
   getElement : function () {
      var self = this;
      
      var el = new Element(
         'div',
         {
            'class' : 'rounded-box page_bar ',
         }
      );
         
      //var wrapper = new Element('div');
   
      // Handle
      el.adopt( 
         new Element(
            'span',
            {
               'class' : 'drag-handle',
            }
         )
      );

      // Page Label
      /*this.barContent = new Element(
         'div',
         {
            //'class' : 'page_bar_item',
           // html    : 'Between Subjects Branch',
         }
      );
      el.adopt( this.barContent );*/
      
      // Delete Icon
      var deleteIcon = new Element(
         'span',
         {
            'class' : 'delete-icon',
            events  : {
               'click' : self.handleDelete.bind(self),
            }
         }
      );
      deleteIcon.adopt( new Element('img', {'src' : 'assets/images/delete.png'}) );
      el.adopt( deleteIcon );
      
      //el.adopt( new Element('div', { 'class' : 'clear-float' }) );
      this.el = el;
      
      this.el.obj = this;
      
      return this.el;
   },
   
   serialize : function() {
      return { type : this.type, };
   },
});

/**
 * Information Page Class
 *
 */
var ExpInfoPage = new Class({
	Extends: ExpPage,
   options : {
      type   : DS_EXP_INFO_PAGE_TAG,
      title  : '',
      source : '',
   },
   
	initialize: function( options ) {
		this.parent( options );
      
      this.title  = this.options.title;
      this.source = this.options.source;
	},
   
   getElement : function () {
   
      var self = this;
   
      if ( !this.el ) {
      
         this.parent();
      
         
         // Page Label
         this.el.adopt(
            new Element(
               'span',
               {
                  'class' : 'page_bar_item',
                  html    : 'Information Page',
               }
            )
         );
         
         // Page Title Input
         this.titleInput = new Element(
            'input',
            {
               'type'  : 'text',
               'value' : this.title,
               events  : {
                  'change' : function() { self.title = this.get('value'); },
               }
            }
         );
         
         // Page Title
         var title = new Element(
            'span',
            {
               'class' : 'page_bar_item',
               html    : 'Page Title:',
            }
         );
         title.adopt( this.titleInput );
         this.el.adopt( title );
         
         // Page Source Select
         /*this.sourceInput = new Element(
            'input',
            {
               'type'  : 'text',
               'value' : this.source,
               events  : {
                  'change' : function() { self.source = this.get('value'); },
               }
            }
         );*/
         
         // Page Source
         var source = new Element(
            'span',
            {
               'class' : 'page_bar_item',
               html    : 'Source:',
            }
         );
         
         var options = new Hash( DS_EXP_INFO_PAGE_OPTIONS );
         
         if ( options.getLength() > 0 ) {
            // Create Select
            self.sourceInput = new Element(
               'select',
               {
                  events  : {
                     'change' : function() { self.source = this.get('value'); },
                  }
               }
            );
            
            // Adopt options
            options.each( function( value, key ) {
               self.sourceInput.adopt(
                  new Element(
                     'option',
                     {
                        value : key,
                        html  : value,
                     }
                  )
               );
            });
            
            // Fire change event to ensure source is set.
            // (This also sets default when only one option is available,
            // and the 'change' event cannot be fired.)
            self.sourceInput.fireEvent('change');
            
            // Adopt Select
            source.adopt( this.sourceInput );
            
            
         } else {
            source.set( 'html', 'Source:<br/>No Sources Found!' );
         }
         
         self.el.adopt( source );     
         
      }
      
      return this.el;
   },
   
   serialize : function() {
      return Object.merge(
         this.parent(),
         {
            title  : this.title,
            source : this.source
         }
      );
   },
});



/**
 * Custom Page Class
 *
 */
var ExpCustomPage = new Class({
	Extends: ExpPage,
   options : {
      type   : DS_EXP_CUSTOM_PAGE_TAG,
      title  : '',
      source : -1,
   },
   
	initialize: function( options ) {
		this.parent( options );
      
      this.title  = this.options.title;
      this.source = this.options.source;
	},
   
   getElement : function () {
   
      var self = this;
   
      if ( !self.el ) {
      
         self.parent();
      
         // Page Label
         self.el.adopt(
            new Element(
               'span',
               {
                  'class' : 'page_bar_item',
                  html    : 'Custom Page',
               }
            )
         );
         
         // Page Title Input
         self.titleInput = new Element(
            'input',
            {
               'type'  : 'text',
               'value' : self.title,
               events  : {
                  'change' : function() { self.title = this.get('value'); },
               }
            }
         );
         
         // Page Title
         var title = new Element(
            'span',
            {
               'class' : 'page_bar_item',
               html    : 'Page Title:',
            }
         );
         title.adopt( self.titleInput );
         self.el.adopt( title );
         
         // Page Source
         var source = new Element(
            'span',
            {
               'class' : 'page_bar_item',
               html    : 'Source:',
            }
         );
         
         var options = new Hash( DS_EXP_CUSTOM_PAGE_OPTIONS );
         
         if ( options.getLength() > 0 ) {
            // Create Select
            self.sourceInput = new Element(
               'select',
               {
                  events  : {
                     'change' : function() { self.source = this.get('value'); },
                  }
               }
            );
            
            // Adopt options
            options.each( function( value, key ) {
               var option = new Element(
                  'option',
                  {
                     value : key,
                     html  : value,
                     'selected' : ( key == self.source ),
                     
                  }
               );
               self.sourceInput.adopt( option );
            });
            
            // Fire change event to ensure source is set.
            // (This also sets default when only one option is available,
            // and the 'change' event cannot be fired.)
            self.sourceInput.fireEvent('change');
            
            // Adopt Select
            source.adopt( this.sourceInput );
            
         } else {
            // No sources are available
            source.set( 'html', 'Source:<br/>No Sources Found!' );
         }
         
         // Adopt source bar item
         self.el.adopt( source );
         
      }
      
      return self.el;
   },
   
   serialize : function() {
      return Object.merge(
         this.parent(),
         {
            title  : this.title,
            source : this.source
         }
      );
   },
});



/**
 * Questionnaire Page Class
 *
 */
var ExpQuestPage = new Class({
	Extends: ExpPage,
   options : {
      type   : DS_EXP_QUEST_PAGE_TAG,
      title  : '',
      source : -1,
   },
   
	initialize: function( options ) {
		this.parent( options );
      
      this.title  = this.options.title;
      this.source = this.options.source;
	},
   
   getElement : function () {
   
      var self = this;
   
      if ( !self.el ) {
      
         self.parent();
      
         // Page Label
         self.el.adopt(
            new Element(
               'span',
               {
                  'class' : 'page_bar_item',
                  html    : 'Questionnaire Page',
               }
            )
         );
         
         // Page Title Input
         self.titleInput = new Element(
            'input',
            {
               'type'  : 'text',
               'value' : self.title,
               events  : {
                  'change' : function() { self.title = this.get('value'); },
               }
            }
         );
         
         // Page Title
         var title = new Element(
            'span',
            {
               'class' : 'page_bar_item',
               html    : 'Page Title:',
            }
         );
         title.adopt( self.titleInput );
         self.el.adopt( title );
         
         // Page Source
         var source = new Element(
            'span',
            {
               'class' : 'page_bar_item',
               html    : 'Source:',
            }
         );
         
         var options = new Hash( DS_EXP_QUEST_PAGE_OPTIONS );
         
         if ( options.getLength() > 0 ) {
            // Create Select
            self.sourceInput = new Element(
               'select',
               {
                  events  : {
                     'change' : function() { self.source = this.get('value'); },
                  }
               }
            );
            
            // Adopt options
            options.each( function( value, key ) {
               var option = new Element(
                  'option',
                  {
                     value : key,
                     html  : value,
                     'selected' : ( key == self.source ),
                     
                  }
               );
               self.sourceInput.adopt( option );
            });
            
            // Fire change event to ensure source is set.
            // (This also sets default when only one option is available,
            // and the 'change' event cannot be fired.)
            self.sourceInput.fireEvent('change');
            
            // Adopt Select
            source.adopt( this.sourceInput );
            
         } else {
            // No sources are available
            source.set( 'html', 'Source:<br/>No Sources Found!' );
         }
         
         // Adopt source bar item
         self.el.adopt( source );
         
      }
      
      return self.el;
   },
   
   serialize : function() {
      return Object.merge(
         this.parent(),
         {
            title  : this.title,
            source : this.source
         }
      );
   },
});



/**
 * Branch Class
 *
 */
var ExpBranch = new Class({
	Extends: ExpPage,
   options : {
      type       : DS_EXP_BRANCH_TAG,
      condition  : '',
      levels     : [],
   },
   
	initialize: function( options ) {
		this.parent( options );
      
      this.condition  = this.options.condition;
      
      this.levels = new Array();
      
      // Make sure element is created before loading
      this.getElement();
      
      // Load Levels
      var self = this;
      this.options.levels.each( function(level) {
         self.addLevel( level.title, level.pages );
      });
	},
   
   genLevelTitle : function( offset ) {
      if ( typeOf(offset) != 'number' ) {
         offset = 1;
      }
      
      var title = 'Level_' + (this.levels.length + offset);
      
      var exists = false;
      this.levels.each( function( lvl, index ) {
         if ( lvl.title == title ) {
            exists = true;
         }
      });
      
      if ( exists ) {
         return this.genLevelTitle( offset + 1 );
      } else {
         return title;
      }
   },
   
   addLevel : function ( title, pages ) {
      //var title = 'title', content = 'content';
      if ( typeOf(title) != 'string' ) {
         title = this.genLevelTitle();
      }
      
      var level = new Object();
      level.title = title;
      level.pages = new Array();
      
      this.levels.push( level );
      this.createTab( level );
      
      level.sortables = new Sortables(
         level.content,
         {
            clone   : true,
            opacity : 0.5,
            handle  : '.drag-handle',
         }
      );
      
      // Add Pages
      if ( typeOf(pages) != 'array' ) {
         pages = [];
      }
      
      var self = this;
      pages.each( function( page ) {
         self.addPage( level, page );
      });
   },
   
   addPage : function ( level, options ) {
      
      var page = DS_PAGE_CONSTRUCTOR( options );
      
      level.pages.push( page );
      page.setHolder( this );
      page.level = level;
      
      var pageEl = page.getElement();
      level.content.adopt( pageEl );
      level.sortables.addItems( pageEl );
   },
   
   removePage : function ( page ) {
      var level = page.level;
      
      // Remove window from page
      level.pages.erase( page );
      
      // Destroy window DOM element
      page.destroy();
      //alert('at least we got here!');
   },
   
   changeLevelTitle : function ( level ) {
      var title = level.titleInput.get('value');
      //alert(title);
      
      var exists = false;
      this.levels.each( function( lvl, index ) {
         if ( lvl.title == title ) {
            exists = true;
         }
      });
      
      if ( exists ) {
         // Title is already in use, reset
         alert( 'Level identifiers must be unique!' );
         level.titleInput.set( 'value', level.title );
         
      } else {
         // Change to new title
         level.title = title;
         level.tabText.set( 'text', title );
      }
   },
   
   createPageLink : function ( level, text, type ) {
      var self = this;
      var addIcon = new Element('img', { 'src' : 'assets/images/add.png' });
      // Add Info Page
      var pageLink = new Element(
         'a',
         {
            events  : {
               'click' : self.addPage.bind( self, level, { 'type' : type })
            }
         }
      );
      pageLink.adopt( addIcon.clone() );
      pageLink.appendText( ' ' + text );
      
      return pageLink;
   },
   
   createTab : function( level ) {
      var self = this;
      
      var deleteIcon = new Element('img',  {'class' : 'tab-delete', 'src'  : 'assets/images/delete.png', });
      level.tabText    = new Element('span', {'text' : level.title});
      var titleEl   = new Element('li', {'class': 'tab'}).adopt(level.tabText).adopt(deleteIcon);
      titleEl.level = level;
      
		var contentEl = new Element('div', {'class': 'tab-content', text: 'Level Identifier : '}).setStyle('display', 'none');
      
      
      level.titleInput = new Element(
            'input',
            {
               'type'      : 'text',
               'maxlength' : 10,
               'value'     : level.title,
               events      : {
                  'change' : self.changeLevelTitle.bind(self, level),
               }
            }
      );
      contentEl.adopt( level.titleInput );
      contentEl.adopt( new Element('br') );
      
      
      var addIcon = new Element('img', { 'src' : 'assets/images/add.png' });
      
      // Add Info Page
      contentEl.adopt( self.createPageLink( level, 'Add Information Page',   DS_EXP_INFO_PAGE_TAG   ) );
      contentEl.adopt( self.createPageLink( level, 'Add Custom Page',        DS_EXP_CUSTOM_PAGE_TAG ) );
      contentEl.adopt( self.createPageLink( level, 'Add Questionnaire Page', DS_EXP_QUEST_PAGE_TAG  ) );
      contentEl.adopt( self.createPageLink( level, 'Add Branch',             DS_EXP_BRANCH_TAG      ) );
      
      level.content = new Element( 'div' );
      contentEl.adopt( level.content );
      //alert(this.tabPane);
      this.tabPane.add( titleEl, contentEl, true );
   },
   
   getElement : function () {
   
      var self = this;
   
      if ( !this.el ) {
         this.parent();
         
         // Page Label
         this.el.adopt(
            new Element(
               'span',
               {
                  'class' : 'page_bar_item',
                  html    : 'Between Subjects Branch',
               }
            )
         );
         
         // Branch Condition Input
         this.conditionInput = new Element(
            'input',
            {
               'type'  : 'text',
               'value' : this.condition,
               events  : {
                  'change' : function() { self.condition = this.get('value'); },
               }
            }
         );
         
         // Branch Condition
         var condition = new Element(
            'span',
            {
               'class' : 'page_bar_item',
               html    : 'Condition:',
            }
         );
         condition.adopt( this.conditionInput );
         this.el.adopt( condition );
         
         // Add Level Control
         var addIcon = new Element('img', { 'src' : 'assets/images/add.png' });
         var addLevel = new Element(
            'a',
            {
               events  : {
                  'click' : self.addLevel.bind(self)
               }
            }
         );
         addLevel.adopt( addIcon );
         addLevel.appendText( ' Add Level' );
         var control = new Element('span', { 'class' : 'page_bar_item' }).adopt( addLevel );
         this.el.adopt( control );
         
         this.el.adopt( new Element('div', { 'class' : 'clear-float' }) );
         
         // Content Div
         var content = new Element(
            'div',
            {
               'class' : 'page_bar_content',
            }
         );
         content.adopt( new Element( 'ul', { 'class' : 'tabs' } ) );
         this.el.adopt( content );
         
         // Create Tabs
         this.tabPane = new TabPane(
            content,
            {
               contentSelector : '.tab-content'
            }
         );
         
         content.addEvent('click:relay(.tab-delete)', function( event ) {
				// stop the event from bubbling up and causing a native click
            event.stop();
            
            var parent = this.getParent('.tab');
            var level = parent.level;
            self.levels.erase(level);
				// close the tab (closeTab takes care of selecting an adjacent tab) 
            self.tabPane.close(parent);
         });
         
        
         
         //this.addLevel();
         //this.addLevel();
   
      }
      
      return this.el;
   },
   
   serializeLevels : function() {
      //var self = this;
      var levels = [];
      
      this.levels.each( function( level ) {
         // Serialize Pages
         var pages = level.sortables.serialize(false, function(element, index) {
            var page = element.obj;
            return page.serialize();
         });
         
         // Serialize Level
         levels.push({
            title : level.title,
            pages : pages,
         });
      });
   
      return levels;
   },
   
   serialize : function() {
      return Object.merge(
         this.parent(),
         {
            condition : this.condition,
            levels    : this.serializeLevels(),
         }
      );
   },
});