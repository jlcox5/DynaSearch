
var theCustomPage;

submit_page = function() {
   var clickResults = theCustomPage.getClickResults();
   
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
         'action' : 'custom_page.php',
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

window.addEvent('domready', function()
{


	var ifr = document.createElement("div");
	ifr.style.display = 'none';
	ifr.innerHTML = '<img id="HM" src="assets/images/hurricane_map_1.png" />';
	document.body.appendChild(ifr);

   //alert(CP_DATA);
   //var options = JSON.parse( CP_DATA );
   //alert(options);
   var options = Object.merge(  
      JSON.parse( CP_DATA ),
      {
         id             : CP_ID,
         name           : CP_NAME,
         editMode       : false,
         //saveFunction   : save_function,
         //loadFunction   : load_function,
         //deleteFunction : delete_function,
         timeoutFunction : submit_page,
      }
   );
   
   //alert(options.windows[0].type);
   
   //Object.each(options, function(opt) { alert(opt) });
   
   //options.append();
   theCustomPage = new CustomPage(options);
   //customPage.addWindow();
   //$('test').addEvent('click', function() { customPage.newPage(); } );
   
	
   
   // Take away the resizing and dragging if not in edit mode
	/*for(var i=0;i<updatables.length;++i)
	{
	   if(updatables[i].type != 'toolbar'){
   	   updatables[i].dragobj.droppables[0] = document.getElementById('trashBinToDeleteWindows_55555');
	   }			
	}*/
   
}); 