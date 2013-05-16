
var so = null;

var str_to_hex = function(s)
{
   var output = '';
   for(var i=0; i < s.length; i+=1)
   {
      output += s.charCodeAt(i).toString(16);
   }
   return output;
}

var hex_to_str = function(s)
{
   var output = '';
   for(var i=0; i < s.length; i+=2)
   {
      var code = parseInt('0x' + s.charAt(i).toString() + s.charAt(i+1).toString() );
      output += String.fromCharCode(code);
   }
   return output;
}

var prompt_new_experiment = function()
{
   // Destroy all the page bars. New == Reset.
   var resp = confirm('This action will discard all changes since the last save. Are you sure?');
   if(resp)
   { window.location.reload(); /*$$('.page_bar').destroy();*/ }
   else return;
}



var add_info_page = function(title, source)
{
   var newitem = new Element('div');
   newitem.setAttribute('class', 'page_bar');
   
   // Handle
   var cd = new Element('span');
   cd.setAttribute('class', 'drag_handle');
   cd.innerHTML = '';
   newitem.adopt(cd);

   // Type
   var pagetype = new Element('span');
   pagetype.setAttribute('class', 'page_bar_item');
   pagetype.innerHTML = 'Information Page';
   newitem.adopt(pagetype);
   
   // Content
   var barc = new Element('span');
   barc.setAttribute('class', 'content');

   // Content - Title
   var span = new Element('span');
   span.setAttribute('class', 'page_bar_item');
   var pageTitle = new Element('input');
   pageTitle.setAttribute('type', 'text');
   pageTitle.setAttribute('id', 'page_title');
   pageTitle.setAttribute('value', title);
   span.innerHTML = 'Title:<br>';
   span.appendChild(pageTitle);
   barc.appendChild(span);

   // Content - Source Select
   span = new Element('span');
   span.setAttribute('class', 'page_bar_item');
   var srcSelect = $('instChoice').clone();
   srcSelect.setAttribute("id", "page_source");
   srcSelect.setAttribute("style","display:inline;");
   var selectedOption = srcSelect.getFirst('option[value=' + source + ']');
   if (selectedOption != null) {
      selectedOption.setAttribute('selected','selected');
   }
   span.innerHTML = 'Source:<br>';
   span.appendChild(srcSelect);
   barc.appendChild(span);

   // Content - Delete Button
   barc.innerHTML += '<span class="bar_button" onClick="this.getParent().getParent().destroy();" style="float:right"><img src="assets/images/delete.png"/></span>';

   newitem.adopt(barc);
   
   $('page_list').adopt(newitem);
   $('page_list').sortables_obj.addItems(newitem);

};


var add_survey_page = function(title, source)
{
   var newitem = new Element('div');
   newitem.setAttribute('class', 'page_bar');
   
   // Handle
   var cd = new Element('span');
   cd.setAttribute('class', 'drag_handle');
   cd.innerHTML = '';
   newitem.adopt(cd);

   // Type
   var pagetype = new Element('span');
   pagetype.setAttribute('class', 'page_bar_item');
   pagetype.innerHTML = 'Survey Page';
   newitem.adopt(pagetype);
   
   // Content
   var barc = new Element('span');
   barc.setAttribute('class', 'content');

   
   //barc.innerHTML += '<span class="bar_button" onClick="edit_info_page_source_Name(this);" class="page_bar_item"><img src="assets/images/script_edit.png" title="Which questionairre do you want to use?" />(<span class="questionairre_name">'+survName+'</span>)</span>';

   // Content - Title
   var span = new Element('span');
   span.setAttribute('class', 'page_bar_item');
   var pageTitle = new Element('input');
   pageTitle.setAttribute('type', 'text');
   pageTitle.setAttribute('id', 'page_title');
   pageTitle.setAttribute('value', title);
   span.innerHTML = 'Title:<br>';
   span.appendChild(pageTitle);
   barc.appendChild(span);

   // Content - Source Select
   span = new Element('span');
   span.setAttribute('class', 'page_bar_item');
        var srcSelect = $('aQuests').clone();
   srcSelect.setAttribute("id", "page_source");
   srcSelect.setAttribute("style","display:inline;");
   var selectedOption = srcSelect.getFirst('option[value=' + source + ']');
   if (selectedOption != null) {
      selectedOption.setAttribute('selected','selected');
   }
   span.innerHTML = 'Source:<br>';
   span.appendChild(srcSelect);
   barc.appendChild(span);

   // Content - Survey Source Select
/*
   span = new Element('span');
   span.setAttribute('class', 'page_bar_item');
        var srcSelect = $('qChoice').clone();
   srcSelect.setAttribute("id", "page_source");
   var selectedOption = srcSelect.getFirst('option[value=' + survName + ']');
   if (selectedOption != null) {
      selectedOption.setAttribute('selected','selected');
   }
   span.innerHTML = 'Survey:<br>';
   span.appendChild(srcSelect);
   barc.appendChild(span);
*/
   // Content - Delete Button
   barc.innerHTML += '<span class="bar_button" onClick="this.getParent().getParent().destroy();" style="float:right"><img src="assets/images/delete.png"/></span>';

   
   newitem.adopt(barc);
   
   $('page_list').adopt(newitem);
   $('page_list').sortables_obj.addItems(newitem);

};


var add_training_page = function(title, source)
{
   var newitem = new Element('div');
   newitem.setAttribute('class', 'page_bar');

   // Handle
   var cd = new Element('span');
   cd.setAttribute('class', 'drag_handle');
   cd.innerHTML = '';
   newitem.adopt(cd);

   // Type
   var pagetype = new Element('span');
   pagetype.setAttribute('class', 'page_bar_item');
   pagetype.innerHTML = 'Training Screen';
   newitem.adopt(pagetype);
   
   // Content
   var barc = new Element('span');
   barc.setAttribute('class', 'content');

   // Title
   var span = new Element('span');
   span.setAttribute('class', 'page_bar_item');
   var pageTitle = new Element('input');
   pageTitle.setAttribute('type', 'text');
   pageTitle.setAttribute('id', 'page_title');
   pageTitle.setAttribute('value', title);
   span.innerHTML = 'Title:<br>';
   span.appendChild(pageTitle);
   barc.appendChild(span);

   // Source Select
   span = new Element('span');
   span.setAttribute('class', 'page_bar_item');
        var srcSelect = $('advChoice').clone();
   srcSelect.setAttribute("style","display:inline;");
   srcSelect.setAttribute("id", "page_source");
   var selectedOption = srcSelect.getFirst('option[value=' + source + ']');
   if (selectedOption != null) {
      selectedOption.setAttribute('selected','selected');
   }
   span.innerHTML = 'Source:<br>';
   span.appendChild(srcSelect);
   barc.appendChild(span);

   // Delete Button
   barc.innerHTML += '<span class="bar_button" onClick="this.getParent().getParent().destroy();" style="float:right"><img src="assets/images/delete.png"/></span>';

   newitem.adopt(barc);
   
   $('page_list').adopt(newitem);
   $('page_list').sortables_obj.addItems(newitem);

};



var construct_exp_string = function() {

   //Construct the string for the Experiment
   var bars = $$('div.page_bar');
   var final_str = '';

   // Used for saving surveys
   var filepath = '';
   var req = null;
   
   // Added by Jon
   // Creates directory if needed // TODO, do we still need this?
/*
   req = new Request({
         url: 'assets/php/create_dir.php', 
         async: false, method: 'post', 
         data: {
            'name': short_name
         }, 
         onComplete: function(r) {} 
   }).send();*/

   // Add experiment Pages to string   
   for (var i = 0; i < bars.length; i++) {
      if (i > 0) { final_str += '$'; }

      var type = bars[i].getFirst('.page_bar_item').innerHTML;
      var c = bars[i].getFirst('.content').getChildren();
               
      // Seperated by Jon
      if(type == 'Survey Page') {      

         // Reads from text Input and Select
         var page_title = String( c[0].getFirst('#page_title').getProperty('value') );
         var page_src   = String( c[1].getFirst('#page_source').getSelected().getProperty('value') );
         var survName    = "";//String( c[2].getFirst('#survey_name').getSelected().getProperty('value') );

         //final_str += 'type=' + str_to_hex(type) + '&page=' + i + '&title=' + str_to_hex(page_title) + '&src=' + str_to_hex(page_src) + '&advnum='+ str_to_hex(survName);
         final_str += 'type=' + str_to_hex(type) + '&page=' + i + '&title=' + str_to_hex(page_title) + '&src=' + str_to_hex(page_src);

      } else if(type == 'Information Page') {

         // Reads from text Input and Select
         var page_title = String( c[0].getFirst('#page_title').getProperty('value') );
         var page_src   = String( c[1].getFirst('#page_source').getSelected().getProperty('value') );

         final_str += 'type=' + str_to_hex(type) + '&page=' + i + '&title=' + str_to_hex(page_title) + '&src=' + str_to_hex(page_src);

         // Added by Jon - Copy instruction file to experiment directory TODO
/*
         req = new Request({
               url: 'assets/php/copy_inst.php', 
               async: false, method: 'post', 
               data: {
                   'fileName': page_src, //c[1].getFirst('.page_source').innerHTML, // Edited by Jordan
                   'expName': short_name,
               }, 
                onComplete: function(r) {} 
         }).send();*/

      } else {

         // Reads from text Input and Select
         var page_title = String( c[0].getFirst('#page_title').getProperty('value') );
         var page_src   = String( c[1].getFirst('#page_source').getSelected().getProperty('value') );

         //var adv_num    = c[2].getFirst('.advisory_number').innerHTML // TODO?

         // Added by Jon - Copy advisory file to experiment directory
/*
         req = new Request({
               url: 'assets/php/copy_adv.php', 
               async: false, method: 'post', 
               data: {
                   'fileName': page_src,//c[1].getFirst('.page_source').innerHTML,
                   'expName': short_name,
               }, 
                onComplete: function(r) {} 
         }).send();*/
         //final_str += 'type=' + str_to_hex(type) + '&page=' + i + '&title=' + str_to_hex(page_title) + '&src=' + str_to_hex(page_src) + '&advnum=' + str_to_hex(adv_num);
         final_str += 'type=' + str_to_hex(type) + '&page=' + i + '&title=' + str_to_hex(page_title) + '&src=' + str_to_hex(page_src);
      }
   }

   return final_str;
}


var save_experiment = function()
{
   var expId   = $('exp_id').value;
   var expName = $('survey_name').get('html');
   var short_name = expName.replace( /[^\w]/gi ,'');   // Get rid of spaces and weird symbols

   // Save Experiment
   var form = new Element('form');
   form.style.visibility = 'hidden';
   form.method = 'POST';

   var scaleProfile = new Element('input');
   scaleProfile.name = 'scaleProfile';
   scaleProfile.value = $('scaleProfile').value;
   form.adopt(scaleProfile);

   var data = new Element('input');
   data.name = 'data';
   data.value = construct_exp_string();
   form.adopt(data);

   var id = new Element('input');
   id.name = 'expId';
   id.value = expId;
   form.adopt(id);

   var shortname = new Element('input');
   shortname.name = 'shortname';
   shortname.value = short_name;
   form.adopt(shortname);
   
   var fullname = new Element('input');
   fullname.name = 'fullname';
   fullname.value = expName;
   form.adopt(fullname);
   
   var mode = new Element('input');
   mode.name = 'fileop';
   mode.value = 'save';
   form.adopt(mode);

   form.action = "survey_setup.php";
   document.body.adopt(form);
   form.submit();

};


var save_experiment_as = function()
{

   var expName = prompt("Please enter a name for the experiment:");

   if (expName) {
      var params    = new Array('ExperimentName', expName,
                             'Admin_ID',       ADMIN_ID);
      var request = new Request({
         method    : 'post',
         url       : './assets/php/db_util.php',
         data      : {
            'query'  : 'select',
            'table'  : 't_experiments',
            'params' : params
         },
         onSuccess : function(response) {

            var arr    = JSON.decode(response);
            if (arr.length > 0) {
               // Experiment Name exists, not available
              alert('This experiment name is already in use. Please save under a unique name.');
              save_experiment_as();

            } else {
               // Save Experiment
               $('exp_id').value      = -1;
               $('survey_name').set('html', expName);
               save_experiment();
            } 
         }
      }).send();
   }

};


var delete_experiment = function()
{

   if ( confirm("Are you sure you want to delete this experiment?\n(This action cannot be undone)") ) {

      var expId   = $('exp_id').value;

      // Delete Experiment
      var form = new Element('form');
      form.style.visibility = 'hidden';
      form.method = 'POST';

      var id = new Element('input');
      id.name = 'expId';
      id.value = expId;
      form.adopt(id);
   
      var mode = new Element('input');
      mode.name = 'fileop';
      mode.value = 'delete';
      form.adopt(mode);

      form.action = "survey_setup.php";
      document.body.adopt(form);
      form.submit();
   }
};


var load_file = function()
{

   var form = new Element('form');
   form.action = 'survey_setup.php';
   form.style.visibility = 'hidden';
   form.method = 'POST';

   var fo = new Element('input');
   fo.name = 'fileop';
   fo.value = 'load';
   form.adopt(fo);

   var expId = new Element('input');
   expId.name = 'expId';
   expId.value = $("expId").value;
   form.adopt(expId);

   document.body.adopt(form);
   form.submit();

}




var edit_advisory_number = function(bar)
{
   bar.getChildren('.advisory_number')[0].innerHTML = prompt('Please enter the number of the advisory.', bar.getChildren('.advisory_number')[0].innerHTML);
};


window.addEvent('domready', function(){
   so = $('page_list').sortables_obj = new Sortables( $('page_list_ol'), {clone:true, opacity: 0.5, handle:'.drag_handle'} );
});

