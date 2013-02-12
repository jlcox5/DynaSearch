
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
   { $$('.page_bar').destroy(); }
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

/*
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
*/
/*
   barc.innerHTML  = '<span class="bar_button" onClick="edit_page_title(this);" class="page_bar_item"><img src="assets/images/page_edit.png" title="Edit this page\'s title" /><span class="page_title">New Page</span></span>';
   barc.innerHTML += '<span class="bar_button" onClick="edit_info_page_source_instruction(this);" class="page_bar_item"><img src="assets/images/script_edit.png" title="Edit this page\'s text source" />(<span class="page_source">unassigned</span>)</span>';
   barc.innerHTML += '<span class="bar_button" onClick="this.getParent().getParent().destroy();" style="float:right"><img src="assets/images/delete.png"/></span>';
   newitem.adopt(barc);
*/
/*

   // Title
   var span = new Element('span');
   span.setAttribute('class', 'page_bar_item');
   var pageTitle = new Element('input');
   pageTitle.setAttribute('type', 'text');
   pageTitle.setAttribute('id', 'page_title');
   span.innerHTML = 'Title:';
   span.appendChild(pageTitle);
   barc.appendChild(span);

   // Source Select
   span = new Element('span');
   span.setAttribute('class', 'page_bar_item');
        var srcSelect = $('instChoice').clone();
   srcSelect.setAttribute("id", "page_source");
   span.innerHTML = 'Source:';
   span.appendChild(srcSelect);
   barc.appendChild(span);

   // Delete Button
   barc.innerHTML += '<span class="bar_button" onClick="this.getParent().getParent().destroy();" style="float:right"><img src="assets/images/delete.png"/></span>';
   newitem.adopt(barc);
   
   $('page_list').adopt(newitem);
   $('page_list').sortables_obj.addItems(newitem);
*/
};

/*
var add_info_page_sourced = function(title, source)
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

   //barc.innerHTML  = '<span class="bar_button" onClick="edit_page_title(this);" class="page_bar_item"><img src="assets/images/page_edit.png" title="Edit this page\'s title" /><span class="page_title">'+ title +'</span></span>';
   //barc.innerHTML += '<span class="bar_button" onClick="edit_info_page_source_instruction(this);" class="page_bar_item"><img src="assets/images/script_edit.png" title="Edit this page\'s text source" />(<span class="page_source">'+ source +'</span>)</span>';
   //barc.innerHTML += '<span class="bar_button" onClick="this.getParent().getParent().destroy();" style="float:right"><img src="assets/images/delete.png"/></span>';

   // Title
   var span = new Element('span');
   span.setAttribute('class', 'page_bar_item');
   var pageTitle = new Element('input');
   pageTitle.setAttribute('type', 'text');
   pageTitle.setAttribute('id', 'page_title');
   pageTitle.setAttribute('value', title);
   span.innerHTML = 'Title:';
   span.appendChild(pageTitle);
   barc.appendChild(span);

   // Source Select
   span = new Element('span');
   span.setAttribute('class', 'page_bar_item');
        var srcSelect = $('instChoice').clone();
   srcSelect.setAttribute("id", "page_source");
   var selectedOption = srcSelect.getFirst('option[value=' + source + ']');
   if (selectedOption != null) {
      selectedOption.setAttribute('selected','selected');
   }
   span.innerHTML = 'Source:';
   span.appendChild(srcSelect);
   barc.appendChild(span);

   // Delete Button
   barc.innerHTML += '<span class="bar_button" onClick="this.getParent().getParent().destroy();" style="float:right"><img src="assets/images/delete.png"/></span>';

   newitem.adopt(barc);
   
   $('page_list').adopt(newitem);
   $('page_list').sortables_obj.addItems(newitem);
};
*/

var add_survey_page = function(title, source, survName)
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
        var srcSelect = $('qChoice').clone();
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

   // Content - Delete Button
   barc.innerHTML += '<span class="bar_button" onClick="this.getParent().getParent().destroy();" style="float:right"><img src="assets/images/delete.png"/></span>';

   
   newitem.adopt(barc);
   
   $('page_list').adopt(newitem);
   $('page_list').sortables_obj.addItems(newitem);
/*
   var newitem = new Element('div');
   newitem.setAttribute('class', 'page_bar');

   // Type
   var pagetype = new Element('span');
   pagetype.setAttribute('class', 'page_bar_item');
   pagetype.innerHTML = 'Survey Page';
   newitem.adopt(pagetype);
   
   // Content
   var barc = new Element('span');
   barc.setAttribute('class', 'content');
   barc.innerHTML  = '<span class="bar_button" onClick="edit_page_title(this);" class="page_bar_item"><img src="assets/images/page_edit.png" title="Edit this page\'s title" /><span class="page_title">New Page</span></span>';
   barc.innerHTML += '<span class="bar_button" onClick="edit_info_page_source_Survey(this);" class="page_bar_item"><img src="assets/images/script_edit.png" title="Name the questionairre file name." />(<span class="page_source">unassigned</span>)</span>';
   barc.innerHTML += '<span class="bar_button" onClick="edit_info_page_source_Name(this);" class="page_bar_item"><img src="assets/images/script_edit.png" title="Which questionairre do you want to use?" />(<span class="questionairre_name">unassigned</span>)</span>';
   barc.innerHTML += '<span class="bar_button" onClick="this.getParent().getParent().destroy();" style="float:right"><img src="assets/images/delete.png"/></span>';   
   newitem.adopt(barc);
   // Handle
   var cd = new Element('span');
   cd.setAttribute('class', 'drag_handle');
   cd.innerHTML = '';
   newitem.adopt(cd);
   
   $('page_list').adopt(newitem);
   $('page_list').sortables_obj.addItems(newitem);
*/
};

/*
var add_survey_page_sourced = function(title, source, survName)
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

   //barc.innerHTML  = '<span class="bar_button" onClick="edit_page_title(this);" class="page_bar_item"><img src="assets/images/page_edit.png" title="Edit this page\'s title" /><span class="page_title">'+ title +'</span></span>';
   //barc.innerHTML += '<span class="bar_button" onClick="edit_info_page_source_Survey(this);" class="page_bar_item"><img src="assets/images/script_edit.png" title="Edit this page\'s question list name" />(<span class="page_source">'+ source +'</span>)</span>';
   //barc.innerHTML += '<span class="bar_button" onClick="edit_info_page_source_Name(this);" class="page_bar_item"><img src="assets/images/script_edit.png" title="Which questionairre do you want to use?" />(<span class="questionairre_name">'+survName+'</span>)</span>';

   // Content - Title
   var span = new Element('span');
   span.setAttribute('class', 'page_bar_item');
   var pageTitle = new Element('input');
   pageTitle.setAttribute('type', 'text');
   pageTitle.setAttribute('id', 'page_title');
   pageTitle.setAttribute('value', title);
   span.innerHTML = 'Title:';
   span.appendChild(pageTitle);
   barc.appendChild(span);

   // Content - Source Select
   span = new Element('span');
   span.setAttribute('class', 'page_bar_item');
        var srcSelect = $('qChoice').clone();
   srcSelect.setAttribute("id", "page_source");
   var selectedOption = srcSelect.getFirst('option[value=' + source + ']');
   if (selectedOption != null) {
      selectedOption.setAttribute('selected','selected');
   }
   span.innerHTML = 'Source:';
   span.appendChild(srcSelect);
   barc.appendChild(span);

   // Content - Survey Source Select
   span = new Element('span');
   span.setAttribute('class', 'page_bar_item');
        var srcSelect = $('qChoice').clone();
   srcSelect.setAttribute("id", "page_source");
   var selectedOption = srcSelect.getFirst('option[value=' + survName + ']');
   if (selectedOption != null) {
      selectedOption.setAttribute('selected','selected');
   }
   span.innerHTML = 'Survey:';
   span.appendChild(srcSelect);
   barc.appendChild(span);

   // Content - Delete Button
   barc.innerHTML += '<span class="bar_button" onClick="this.getParent().getParent().destroy();" style="float:right"><img src="assets/images/delete.png"/></span>';

   
   newitem.adopt(barc);
   
   $('page_list').adopt(newitem);
   $('page_list').sortables_obj.addItems(newitem);
};
*/

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
/*
   var newitem = new Element('div');
   newitem.setAttribute('class', 'page_bar');

   // Type
   var pagetype = new Element('span');
   pagetype.setAttribute('class', 'page_bar_item');
   pagetype.innerHTML = 'Training Screen';
   newitem.adopt(pagetype);
   
   // Content
   var barc = new Element('span');
   barc.setAttribute('class', 'content');

   barc.innerHTML  = '<span onClick="edit_page_title(this);" class="page_bar_item"><img src="assets/images/page_edit.png" title="Edit this page\'s title" ></img> <span class="page_title">New Page</span></span>';
   barc.innerHTML += '<span onClick="edit_info_page_source_training(this);" class="page_bar_item"><img src="assets/images/script_edit.png" title="Edit this screens database name" />(<span class="page_source">unassigned</span>)</span>';
   //barc.innerHTML += '<span onClick="edit_advisory_number(this);" class="page_bar_item"><img src="assets/images/script_edit.png" title="Edit this screens advisory number" />(<span class="advisory_number">unassigned</span>)</span>';
   barc.innerHTML += '<span class="bar_button" onClick="this.getParent().getParent().destroy();" style="float:right"><img src="assets/images/delete.png"/></span>';
   newitem.adopt(barc);
   
   // Handle
   var cd = new Element('span');
   cd.setAttribute('class', 'drag_handle');
   cd.innerHTML = '';
   newitem.adopt(cd);
   
   $('page_list').adopt(newitem);
   $('page_list').sortables_obj.addItems(newitem);
*/
};

/*
var add_training_page_sourced = function(title, source)
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

   //barc.innerHTML  = '<span onClick="edit_page_title(this);" class="page_bar_item"><img src="assets/images/page_edit.png" title="Edit this page\'s title" ></img> <span class="page_title">'+ title +'</span></span>';
   //barc.innerHTML += '<span onClick="edit_info_page_source_training(this);" class="page_bar_item"><img src="assets/images/script_edit.png" title="Edit this screens database name" />(<span class="page_source">'+ source +'</span>)</span>';
   //barc.innerHTML += '<span onClick="edit_advisory_number(this);" class="page_bar_item"><img src="assets/images/script_edit.png" title="Edit this screens advisory number" />(<span class="advisory_number">'+ adv +'</span>)</span>';
   //barc.innerHTML += '<span onClick="window.location=\'editor.php?exp='+ document.getElementById('exp_short_name').innerHTML +'&adv='+ adv +'\';" class="page_bar_item"><img src="assets/images/script_edit.png" title="Edit this screens advisory number" />(<span class="advisory_number">'+ adv +'</span>)</span>';
   
   // Title
   var span = new Element('span');
   span.setAttribute('class', 'page_bar_item');
   var pageTitle = new Element('input');
   pageTitle.setAttribute('type', 'text');
   pageTitle.setAttribute('id', 'page_title');
   pageTitle.setAttribute('value', title);
   span.innerHTML = 'Title:';
   span.appendChild(pageTitle);
   barc.appendChild(span);

   // Source Select
   span = new Element('span');
   span.setAttribute('class', 'page_bar_item');
        var srcSelect = $('advChoice').clone();
   srcSelect.setAttribute("id", "page_source");
   srcSelect.getFirst('option[value=' + source + ']').setAttribute('selected','selected');
   span.innerHTML = 'Source:';
   span.appendChild(srcSelect);
   barc.appendChild(span);

   // Delete Button
   barc.innerHTML += '<span class="bar_button" onClick="this.getParent().getParent().destroy();" style="float:right"><img src="assets/images/delete.png"/></span>';

   newitem.adopt(barc);
   
   $('page_list').adopt(newitem);
   $('page_list').sortables_obj.addItems(newitem);
};
*/


var save_experiment = function()
{
   var experiment_name = $('survey_name').value;

   var short_name = experiment_name.replace( /[^\w]/gi ,'');   // Get rid of spaces and weird symbols
   //alert('saving as ' + short_name);
   
   //Construct the string for the Experiment
   var i=0;
   var bars = $$('div.page_bar'); //.each(function(li) { alert(li.getFirst('.content').innerHTML); });
   var final_str = '';
   // Used for saving surveys
   var filepath = '';
   var req = null;
   
   // Added by Jon
   // Creates directory if needed
   req = new Request({
         url: 'assets/php/create_dir.php', 
         async: false, method: 'post', 
         data: {
            'name': short_name
         }, 
         onComplete: function(r) {} 
   }).send();
   
   //alert(bars);

   // Add experiment Pages to string   
   for (var i=0; i<bars.length; i+=1)
   {
      if (i > 0) { final_str += '$'; }
	  //alert(i + ": " + bars[i]);

      var type = bars[i].getFirst('.page_bar_item').innerHTML;
      var c = bars[i].getFirst('.content').getChildren();
               
      // Seperated by Jon
      if(type == 'Survey Page'){      
         //var page_title = c[0].getFirst('.page_title').innerHTML;
         //var page_src   = c[1].getFirst('.page_source').innerHTML;
         //var survName = c[2].getFirst('.questionairre_name').innerHTML;

         // Edited by Jordan - Now reads from text Input and Select
         var page_title = String( c[0].getFirst('#page_title').getProperty('value') );
         var page_src   = String( c[1].getFirst('#page_source').getSelected().getProperty('value') );
         var survName    = "";//String( c[2].getFirst('#survey_name').getSelected().getProperty('value') );


         final_str += 'type=' + str_to_hex(type) + '&page=' + i + '&title=' + str_to_hex(page_title) + '&src=' + str_to_hex(page_src) + '&advnum='+ str_to_hex(survName);
         //final_str += 'type=' + str_to_hex(type) + '&page=' + i + '&title=' + str_to_hex(page_title) + '&src=' + str_to_hex(page_src);
         
         
         filepath = 'hurricane_data/'+short_name+'/'+page_src;
         //alert('Name: '+c[2].getFirst('.questionairre_name').innerHTML);
         req = new Request({
               url: 'assets/php/save_survey.php', 
               async: false, method: 'post', 
               data: {
                   'name': survName, //c[2].getFirst('.questionairre_name').innerHTML,
                   'file_path': filepath
               }, 
                onComplete: function(r) {} 
         }).send();
      }
      else if(type == 'Information Page')
      {
         //var page_title = c[0].getFirst('.page_title').innerHTML;

         // Edited by Jordan - Now reads from text Input and Select
         var page_title = String( c[0].getFirst('#page_title').getProperty('value') );
         var page_src   = String( c[1].getFirst('#page_source').getSelected().getProperty('value') );


         final_str += 'type=' + str_to_hex(type) + '&page=' + i + '&title=' + str_to_hex(page_title) + '&src=' + str_to_hex(page_src);
         // Added by Jon - Copy instruction file to experiment directory
         req = new Request({
               url: 'assets/php/copy_inst.php', 
               async: false, method: 'post', 
               data: {
                   'fileName': page_src, //c[1].getFirst('.page_source').innerHTML, // Edited by Jordan
                   'expName': short_name,
               }, 
                onComplete: function(r) {} 
         }).send();
      }
      else
      {
         //var page_title = c[0].getFirst('.page_title').innerHTML;
         //var page_src   = c[1].getFirst('.page_source').innerHTML;

         // Edited by Jorda - Now reads from text Input and Select
         var page_title = String( c[0].getFirst('#page_title').getProperty('value') );
         var page_src   = String( c[1].getFirst('#page_source').getSelected().getProperty('value') );

         //var adv_num    = c[2].getFirst('.advisory_number').innerHTML // TODO?

         // Added by Jon - Copy advisory file to experiment directory
         req = new Request({
               url: 'assets/php/copy_adv.php', 
               async: false, method: 'post', 
               data: {
                   'fileName': page_src,//c[1].getFirst('.page_source').innerHTML,
                   'expName': short_name,
               }, 
                onComplete: function(r) {} 
         }).send();
         //final_str += 'type=' + str_to_hex(type) + '&page=' + i + '&title=' + str_to_hex(page_title) + '&src=' + str_to_hex(page_src) + '&advnum=' + str_to_hex(adv_num);
         final_str += 'type=' + str_to_hex(type) + '&page=' + i + '&title=' + str_to_hex(page_title) + '&src=' + str_to_hex(page_src);
      }
   }
   //alert(final_str);
   
   var form = new Element('form');
   form.style.visibility = 'hidden';
   form.method = 'POST';

   //var customScaling = new Element('input');
   //customScaling.name = 'customScaling';
   //customScaling.value = $('customScaling').checked;
   //form.adopt(customScaling);

   var scaleProfile = new Element('input');
   scaleProfile.name = 'scaleProfile';
   scaleProfile.value = $('scaleProfile').value;
   form.adopt(scaleProfile);

   var data = new Element('input');
   data.name = 'data';
   data.value = final_str;
   form.adopt(data);

   var shortname = new Element('input');
   shortname.name = 'shortname';
   shortname.value = short_name;
   form.adopt(shortname);
   
   var fullname = new Element('input');
   fullname.name = 'fullname';
   fullname.value = experiment_name;
   form.adopt(fullname);
   
   var mode = new Element('input');
   mode.name = 'fileop';
   mode.value = 'save';
   form.adopt(mode);

   form.action = "survey_setup.php";
   document.body.adopt(form);
   form.submit();
};


var save_experiment_copy = function()
{
   var expName = $('survey_name').value;

   var short_name = experiment_name.replace( /[^\w]/gi ,'');   // Get rid of spaces and weird symbols
   //alert('saving as ' + short_name);
   
   var params    = new Array('ExperimentName', expName);
   var request = new Request({
      method    : 'post',
      url       : './assets/php/db_util.php',
      data      : {
         'query'  : 'select',
         'table'  : 't_experiments',
         'params' : params,
         'ret'    : 'User_ID'
      },
      onSuccess : function(response) {
         var arr    = JSON.decode(response);  

         if (arr['User_ID'] == userId) {
            // ID exists, not available
            availabilityTag.set('html', 'Not Available');
            availabilityTag.setProperty('style', 'color:red;');
            saveButton.setProperty('disabled', 'disabled');

         } else {
            // ID does not exist, available
            availabilityTag.set('html', 'Available');
            availabilityTag.setProperty('style', 'color:green;');
            saveButton.setProperty('disabled', '');
         }
      }
   }).send();



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

