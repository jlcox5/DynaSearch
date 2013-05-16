// These functions are used by questEditor.php to facilitate building custom surveys

function indexById(arr,id){
   for(var i=0; i < arr.length; ++i)
      if(arr[i].id == id) return i;
}
function shiftUp(arr,id){
   if(arr[0].id == id) return;

   var ndx = indexById(arr,id);

   var tmp   = arr[ndx];
   arr[ndx]   = arr[ndx-1];
   arr[ndx-1] = tmp;
}
function shiftDown(arr,id){
   if(arr[arr.length-1].id == id) return;

   var ndx = indexById(arr,id);

   var tmp   = arr[ndx];
   arr[ndx]   = arr[ndx+1];
   arr[ndx+1] = tmp;
}
//-----------

var theQuest;


function updateQuestionnaire(forReal){
   theQuest.draw(forReal);
}

function Update(forReal){
   if(forReal == undefined) forReal = false;
   updateQuestionnaire(forReal);
}



var new_quest = function() {

   $('qId').value = -1;
   $('qName').value = 'untitled';
   //$('qName').fireEvent('change');
   $('qNameDisplay').set('html','untitled');
   $('qData').value = '';

   $('quest_editor').setStyle('display', 'inline');
   $('saveBtn').set('disabled', 'disabled');
   $('saveAsBtn').set('disabled', '');
   $('deleteBtn').set('disabled', 'disabled');
   theQuest = new Questionnaire();
   Update();
};


var save_quest = function()
{
   $('qData').value = theQuest.genString();
   //alert( theQuest.genString() );

   var form = new Element('form');
   form.action = 'questEditor.php';
   form.style.visibility = 'hidden';
   form.method = 'POST';

   var op = new Element('input');
   op.name = 'op';
   op.value = 'save';
   form.adopt(op);

   form.adopt( $('qId') );
   form.adopt( $('qName') );
   form.adopt( $('qData') );

   document.body.adopt(form);
   form.submit();
};


var save_quest_as = function()
{

   var saveAsQuestBox = new mBox.Modal({
      title   : 'Save Questionnaire',
      content : 'save-as-quest',
      /*width   : '800px',
      height  : '450px',*/
      overlay : true,
      closeOnBodyClick : false,
      buttons : [
         { title : 'Cancel' },
         { title : 'Save' ,
           event : function() {

              var qName = $('qName').value;
              if (qName) {
                 var params = new Array('Name',     qName,
                                        'Admin_ID', ADMIN_ID);
                 var request = new Request({
                    method    : 'post',
                    url       : './assets/php/db_util.php',
                    data      : {
                       'query'  : 'select',
                       'table'  : 'sur_question',
                       'params' : params
                    },
                    onSuccess : function(response) {

                       var arr    = JSON.decode(response);
                       if (arr.length > 0) {
                          // Questionnaire Name exists, not available
                         alert('This questionnaire name is already in use. Please save under a unique name.');
                         //save_experiment_as();

                       } else {
                          // Save Questionnaire
                          saveAsQuestBox.close();
                          $('qId').value   = -1;
                          //$('qName').value = qName;
                          //$('qName').set('html', expName);
                          save_quest();
                       } 
                    }
                 }).send();
              }
           },
           addClass : 'button-green' }
      ],
   }).open();

};


var delete_quest = function()
{
   var form = new Element('form');
   form.action = 'questEditor.php';
   form.style.visibility = 'hidden';
   form.method = 'POST';

   var op = new Element('input');
   op.name = 'op';
   op.value = 'delete';
   form.adopt(op);

   form.adopt( $('qId') );

   document.body.adopt(form);
   form.submit();
};


var load_quest = function()
{

   var loadQuestBox = new mBox.Modal({
      title   : 'Load Questionnaire',
      content : 'load-quest',
      /*width   : '800px',
      height  : '450px',*/
      overlay : true,
      closeOnBodyClick : false,
      buttons : [
         { title : 'Cancel' },
         { title : 'Load' ,
           event : function() {
              this.close();
              var qSelect = $("aQuests");
              var form = new Element('form');
              form.action = 'questEditor.php';
              form.style.visibility = 'hidden';
              form.method = 'POST';

              var op = new Element('input');
              op.name = 'op';
              op.value = 'load';
              form.adopt(op);

              var qId = new Element('input');
              qId.name = 'qId';
              qId.value = qSelect.value;
              form.adopt(qId);

              document.body.adopt(form);
              form.submit();

           },
           addClass : 'button-green' }
      ],
   }).open();

};

var append_quest = function()
{
   var appendQuestBox = new mBox.Modal({
      title   : 'Append Questionnaire',
      content : 'load-quest',
      /*width   : '800px',
      height  : '450px',*/
      overlay : true,
      closeOnBodyClick : false,
      buttons : [
         { title : 'Cancel' },
         { title : 'Append' ,
           event : function() {
              var qSelect = $("aQuests");
              alert(qSelect.value);
              var params = new Array('id', qSelect.value);
              var request = new Request({
                 method    : 'post',
                 url       : './assets/php/db_util.php',
                 data      : {
                    'query'  : 'select',
                    'table'  : 'sur_question',
                    'params' : params
                 },
                 onSuccess : function(response) {

                    var arr    = JSON.decode(response);

                    appendQuestStr = arr[0]['Value'];
                    theQuest.appendItems( appendQuestStr );
                    Update();
                    appendQuestBox.close();
                    }
                 }).send();
           },
           addClass : 'button-green' }
      ],
   }).open();
};

var detailArr = {
   'section' : {
      'title'   : 'Add Section',
      'content' : 'section-editor',
      'clear'   : function() {
         $('section-name').value = '';
      },
      'command' : function() {
         var sectionName = $('section-name').value;
         return { type : 'section', title : sectionName };
      }
   },
   'radioQuest' : {
      'title'   : 'Add Radio Question',
      'content' : 'radio-editor',
      'clear'   : function() {
         $('radio-question').value ='';
         var answers = $('radio-answers').getChildren('div');
         for ( var i = 0; i < answers.length; ++i ) {
            answers[i].dispose();
         }
      },
      'command' : function() {
         var question = $('radio-question').value;
         var answers = $('radio-answers').getChildren('div');
         var ansArr = [];
         for ( var i = 0; i < answers.length; ++i ) {
            var answer = answers[i].getElement('input');
            ansArr.push( answer.value );
         }
         return { type : 'radioQuest', text : question, answers : ansArr };
      }
   },
   'textQuest' : {
      'title'   : 'Add Text Question',
      'content' : 'text-editor',
      'clear'   : function() {
         $('text-question').value = '';
         $('text-limit').value = '';
      },
      'command' : function() {
         var question = $('text-question').value;
         var limit = $('text-limit').value;
         if ( isNaN(limit) ) {
            limit = 0;
         }
         return { type : 'textQuest', text : question,  fieldLength : limit };
      }
   },
   'textline' : {
      'title'   : 'Add Text Line',
      'content' : 'textline-editor',
      'clear'   : function() {
         $('textline-text').value = '';
      },
      'command' : function() {
         var textVal = $('textline-text').value;
         return { type : 'textline', text : textVal };
      }
   },
};

var add_quest_item = function(type) {

   var details = detailArr[type];

   var addItemBox = new mBox.Modal({
      title   : details['title'],
      content : details['content'],
      onOpen  : details['clear'],
      //width   : '800px',
      //height  : '450px',
      overlay : true,
      closeOnBodyClick : false,
      buttons : [
         { title : 'Cancel' },
         { title : 'Add' ,
           event : function() {
              this.close();
              var command = details['command']();
              command.Q = theQuest;
              var qItem = makeQuestItem( command );
              theQuest.push( qItem );
              Update();
           },
           addClass : 'button-green' }
      ],
   }).open();
};


var add_radio_answer = function() {
   var answers = $('radio-answers'),
       answer = $('radio-answer-proto').clone();
   answer.setAttribute('style', '');
   answers.adopt( answer );
   
};

var remove_radio_answer = function(button) {
   var answer = button.getParent();
   answer.dispose();
};


window.addEvent(
   'domready',
   function() {
      alert('hello!');
 
      var questStr = $('qData').value.trim();
      if ( questStr != '' ){
         //var root = parseQuestionnaireString(questStr);
         theQuest = new Questionnaire();
         //theQuest.setName(hexDecode(root.attributes['name'].value));
         theQuest.appendItems( questStr );

         Update();
      }
   }
);


/*
function draggables(){
   //window.addEventListener('domready',_draggables());
}
function _draggables(){
	var dragElement = $('drag_me');
	var dragContainer = $('drag_cont');
	var dragHandle = $('drag_me_handle');
	
    var myDrag = new Drag.Move(dragElement, {
	    // Drag.Move options
		//droppables: dropElement,
		container: dragContainer,
		// Drag options
		handle: dragHandle,
	});
}*/

