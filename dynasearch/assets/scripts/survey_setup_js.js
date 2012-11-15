
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

// TODO: Since we are now using a text input for the name, we do not need this function
/*
var edit_survey_name = function(el)
{
   var resp = prompt("Please input the new name for the survey.", el.innerHTML );
   if (resp.length == 0) { resp = 'TitleHere'; }
   el.innerHTML = resp;

}
*/

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
   var bars = $$('.page_bar'); //.each(function(li) { alert(li.getFirst('.content').innerHTML); });
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

   // Add size check data to string
   // TODO - record boolean and default X/Y scale
   var changeSize = false;
   var scaleX = 50, 
       scaleY = 50;
   final_str += 'type=' + str_tohex('dynamicSize') + 
                'changeSize=' + changeSize
                'scaleX=' + scaleY
                'scaleY=' + scaleX;


   // Add experiment Pages to string   
   for(var i=0; i<bars.length; i+=1)
   {
      if(i>0) { final_str += '$'; }
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
         var survName    = String( c[2].getFirst('#survey_name').getSelected().getProperty('value') );


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

var load_file = function()
{
   var list = $("load_select_list");
   var d = list.options[list.selectedIndex];
   
   var form = new Element('form');
   form.action = 'survey_setup.php';
   form.style.visibility = 'hidden';
   form.method = 'POST';
   
   var fo = new Element('input');
   fo.name = 'fileop';
   fo.value = 'load';
   
   var file = new Element('input');
   file.name = 'file';
   file.value = d.value;
   
   form.adopt(fo);
   form.adopt(file);
   
   document.body.adopt(form);
   form.submit();
   
//   window.location='survey_setup.php?fileop=load&file=' + d.value;
}



// Take in a bar div and prompt for a new title for that bar's page
/*
var edit_page_title = function(bar)
{
   bar.getChildren('.page_title')[0].innerHTML = prompt('Please enter a new title for this page.', bar.getChildren('.page_title')[0].innerHTML);
};

var edit_info_page_source = function(bar)
{
   bar.getChildren('.page_source')[0].innerHTML = prompt('Please enter the name of the page\'s script.', bar.getChildren('.page_source')[0].innerHTML);
};

var edit_info_page_source_instruction = function(bar)
{
   bar.getChildren('.page_source')[0].innerHTML = prompt('Please enter the name of the page\'s script.', document.getElement('#instChoice').value);
};
var edit_info_page_source_training = function(bar)
{
   bar.getChildren('.page_source')[0].innerHTML = prompt('Please enter the name of the page\'s script.', document.getElement('#advChoice').value);
};

var edit_info_page_source_Survey = function(bar)
{
   bar.getChildren('.page_source')[0].innerHTML = prompt('Please enter a file name to save for the page\'s script.', bar.getChildren('.page_source')[0].innerHTML);
};
var edit_info_page_source_Name = function(bar)
{
   //bar.getChildren('.questionairre_name')[0].innerHTML = prompt('Please give the questionairre name that you would like to use.', bar.getChildren('.questionairre_name')[0].innerHTML);
   bar.getChildren('.questionairre_name')[0].innerHTML = prompt('Please give the questionairre name that you would like to use.', document.getElement('#qChoice').value);
};
*/
var edit_advisory_number = function(bar)
{
   bar.getChildren('.advisory_number')[0].innerHTML = prompt('Please enter the number of the advisory.', bar.getChildren('.advisory_number')[0].innerHTML);
};


window.addEvent('domready', function(){
   so = $('page_list').sortables_obj = new Sortables( $('page_list_ol'), {clone:true, opacity: 0.5, handle:'.drag_handle'} );
});

