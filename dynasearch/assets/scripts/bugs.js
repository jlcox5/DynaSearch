/*
 * Any Javascript errors after this point are logged for debugging
 * purposes
 */
var JS_ERROR_LOG = []; 
window.onerror = function (msg, url, num) {
   var error = {
      message : msg,
      url     : url,
      line    : num,
   };
   JS_ERROR_LOG.push(error);
   return false;
};

/*
 * This function is triggered by the bug icon on the menu bar.
 *
 * Creates and displays an mBox popup window to gather bug report
 * or feature request information.
 *
 * On submission of this report, a request is generated and sent
 * to 'bug_report.php' which performs the operation of inserting
 * the report into the database.
 */
var submit_bug_report = function() {
   //var b;
   //alert( b.no );
   var bugForm = new Element( 'div', { 'class' : 'bug-report-form' } );
   
   var reportTypeSelect = new Element('select');
   reportTypeSelect.adopt([
      new Element( 'option', { value : 'bug_report' ,      html : 'Bug Report'} ),
      new Element( 'option', { value : 'feature_request' , html : 'Feature Request'} ),
   ]);
   var label = new Element( 'label', { html : 'Report Type : ' } );
   label.adopt( reportTypeSelect );
   bugForm.adopt( label );
   
   var descriptionInput = new Element('textarea', {  });
   bugForm.adopt( new Element('div', { html : 'Description (Please be as detailed as possible)'}) );
   bugForm.adopt( descriptionInput );

   var bugBox = new mBox.Modal({
      title   : 'Bug Report',
      content : bugForm,
      overlay : true,
      closeOnBodyClick : false,
      buttons : [
         { title : 'Cancel' },
         {
            title : 'Submit' ,
            event : function() {
           
               var reportType  = reportTypeSelect.get( 'value' );
               var description = descriptionInput.get( 'value' );
               
               if ( description ) {
                  // Stringify JS Error Log
                  var jsLog = JSON.stringify(JS_ERROR_LOG);
                  
                  // Create and submit request
                  var request = new Request({
                     method    : 'post',
                     url       : './assets/php/bug_report.php',
                     data      : {
                        'reportType'  : reportType,
                        'description' : description,
                        'jsErrorLog'  : jsLog,
                     },
                     onSuccess : function ( response ) {
                        // Response will indicate query success
                        if ( response ) {
                           // Bug report submitted
                           bugBox.close();
                           new mBox.Notice({
                              type    : 'ok',
                              content : 'Thank you for your report.<br/>We will attend to the issue as soon as possible.',
                           });
                        } else {
                           // Bug report not submitted
                           new mBox.Notice({
                              type    : 'error',
                              content : 'There was an error submitting the report.<br/>Please try submitting it again.',
                           });
                        }
                     }
                  }).send();
                  
               } else {
                  // User did not enter a description
                  alert( 'Please enter a description so that we can work on this issue.' );
               }
            },
            addClass : 'button-green',
         }
      ],
   }).open();
};