
build_js_log_table = function ( log ) {
   // Construct Table
   var table = new Element('table');
   
   // Construct Header Row
   var header = new Element('tr');
   header.adopt([
      new Element( 'th', { html : 'Message' } ),
      new Element( 'th', { html : 'URL'     } ),
      new Element( 'th', { html : 'Line'    } ),
   ]);
   table.adopt( header );
   
   // Populate rows
   log.each( function(entry) {
      // Construct table row
      var row = new Element('tr');
      
      row.adopt([
         new Element( 'td', { html : entry['message'] } ),
         new Element( 'td', { html : entry['url']     } ),
         new Element( 'td', { html : entry['line']    } ),
      ]);
      
      table.adopt( row );
   });
   
   return table;
};


var php_error_levels = {
   1    : 'ERROR',
   2    : 'WARNING',
   8    : 'NOTICE',
   256  : 'USER ERROR',
   512  : 'USER_WARNING',
   1024 : 'USER_NOTICE',
   8191 : 'ERROR ALL',
}
build_php_log_table = function ( log ) {
   // Construct Table
   var table = new Element('table');
   
   // Construct Header Row
   var header = new Element('tr');
   header.adopt([
      new Element( 'th', { html : 'Level' } ),
      new Element( 'th', { html : 'Message' } ),
      new Element( 'th', { html : 'URL'     } ),
      new Element( 'th', { html : 'Line'    } ),
   ]);
   table.adopt( header );
   
   // Populate rows
   log.each( function(entry) {
      // Construct table row
      var row = new Element('tr');
      
      // Get PHP Error Level 
      var level = entry['level'];
          code  = php_error_levels[ level ];
      
      row.adopt([
         new Element( 'td', { html : '[' + level  + '] ' + code } ),
         new Element( 'td', { html : entry['message']          } ),
         new Element( 'td', { html : entry['file']             } ),
         new Element( 'td', { html : entry['line']             } ),
      ]);
      
      table.adopt( row );
   });
   
   return table;
};


display_bug_report = function( id ) {
   var display = true;//confirm( 'Display report?' );
   
   if ( display ) {
      var bug = BUGS[id];
      
      // Report ID Input and display
      $('reportId').set(      'html',  id );
      $('reportIdInput').set( 'value', id );
      
      // User and Status
      $('userId').set(    'html',  bug['user'] );
      $('status').set(    'value', bug['status'] );
      $('timestamp').set( 'html',  bug['timestamp'] );
      
      // Logs
      //var jsLog  = JSON.parse( bug['jslog']  );
      //    phpLog = JSON.parse( bug['phplog'] );
      $('jsLog').empty();
      $('jsLog').adopt( build_js_log_table( bug['jslog'] ) );
      
      $('phpLog').empty();
      $('phpLog').adopt( build_php_log_table( bug['phplog'] ) );
      
      // Description
      $('description').set( 'html', bug['description'] );
      
      // Description
      $('comments').set( 'html', bug['comments'] );
   }
};

window.addEvent(
   'domready',
   function() {
      
      // Create Accordions
      $$('.accordion').each( function( accordion ) {
         new Fx.Accordion(
            accordion,
            accordion.getElements('.toggle'),
            accordion.getElements('.content'),
            {
               display    : -1,
               alwaysHide : true,
            }
         );
      });
/*
            var myAccordion = new Fx.Accordion($('accordion'), '.toggle', '.content', {
               alwaysHide : true,
		         opacity: false,
		         onActive: function(toggler, element){
			         //toggler.setStyle('color', '#1464DE');
		         },
		         onBackground: function(toggler, element){
			         //toggler.setStyle('color', '#28CE0A');
		         }
	         });*/
   }
);