/**
 * A global variable, that will hold this pages instance of the
 * CustomPage class to manage windows and click data.
 */
var theCustomPage;



/**
 * Creates and submits a form with the the variable 'results'
 * containing a JSON string of the Custom Page's recorded
 * click data.
 */
submit_page = function() {
   // Get click results
   var clickResults = theCustomPage.getClickResults();
   
   // Create result object for page and stringify
   var results = {
      name   : PAGE_NAME,
      clicks : clickResults,
   };
   var resultString  = JSON.stringify( results );

   //alert(resultString);
   //return;
   
   // Create form 
   var form = new Element(
      'form',
      {
         'method' : 'post',
         'hidden' : 'hidden',
      }
   );
   
   // Add input with data
   form.adopt(
      new Element(
         'input',
         {
            'name'  : 'results',
            'value' : resultString,
         }
      )
   );
   
   // Adopt and submit form
   document.body.adopt( form );
   form.submit();
};



/**
 * Add 'domready' function to the window to create the CustomPage
 * class based on the options set up by the administrator.
 */
window.addEvent('domready', function()
{
   // Merge the JSON data with parameters for running experiment
   var options = Object.merge(  
      JSON.parse( CP_DATA ),
      {
         id              : CP_ID,
         name            : CP_NAME,
         editMode        : false,
         timeoutFunction : submit_page,
      }
   );
   
   // Create the CustomPage instance
   theCustomPage = new CustomPage( options );
}); 