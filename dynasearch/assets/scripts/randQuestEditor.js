// These functions are used by questEditor.php to facilitate building custom surveys

// Flag used to determine which option is selected
var option = -1;

// Used to name radio questions fed into database
var totalElem = 0;
var elem = 0;

// Holds html of final result
var frontR = new Array();
var elemId = new Array();

var sectionSet = 0;


function constructQuestion(){

	document.getElementById('questInfo').innerHTML = "<p>Please select the item you would like to create:</p><blockquote><input id='qtype' name='type' type='radio' value='1' onclick='setOption(1)'/>Radio Button Question<br/><input id='qtype' name='type' type='radio' value='2' onclick='setOption(2)'/>Text Question<br/></blockquote><input type='submit' id='questSub' name='questSub' value='Next' onclick='buildQuestion()'/><input type='submit' id='questSave' name='questSave' value='Save' onclick='saveQuestion()'/>";
	
}

function setOption(choice){
    option = choice;
}

function buildQuestion(){
	
	// User wants to create a radio question
	if(option == 1){
	    document.getElementById('questInfo').innerHTML = "<p>Please enter the question text:</p><blockquote><input type='text' id='radioTitle' name='radioTitle'/></blockquote>";
		document.getElementById('questInfo').innerHTML += "<p>Please enter the number of buttons (integer value):</p><blockquote><input type='text' id='radioNum' name='radioNum'/></blockquote><input type='submit' id='questSub' name='questSub' value='Next' onclick='setRadioQuest()'/>";
	}
	// Wants to create a text based button
	else if(option == 2){
	    document.getElementById('questInfo').innerHTML = "<p>Please enter the question text:</p><blockquote><input type='text' id='textTitle' name='textTitle'/></blockquote>";
		document.getElementById('questInfo').innerHTML += "<p>Please enter the length of the text field (integer value):</p><blockquote><input type='text' id='textNum' name='textNum'/></blockquote><input type='submit' id='questSub' name='questSub' value='Save' onclick='saveTextQuest()'/>";
	}
	option = -1;
	
}

// Forms radio question
function setRadioQuest(){
    var questText = document.getElementById('radioTitle').value;
	var x = parseInt(document.getElementById('radioNum').value);
	var i = 0;
	
	frontR[totalElem] = '<blockquote><p>' + questText + '</p><blockquote>';
	elemId[totalElem] = elem;
    totalElem += 1;
	document.getElementById('questInfo').innerHTML = "";
    for(i=0; i<x; i++){
		document.getElementById('questInfo').innerHTML += "<p>Please enter the value for answer " + i + "</p><blockquote><input type='text' id='a" + i + "' name='a" + i + "'/>";
	}
    document.getElementById('questInfo').innerHTML += "<input type='submit' id='questSub' name='questSub' value='Next' onclick='saveRadio(" + x + ")'/>";
	
}

// Saves radio question
function saveRadio(x){
   var i = 0;
   var elName = '';
   
   for(i=0; i<x; i++){
	   elName = 'a' + i;
       frontR[totalElem] = '<input type="radio" id="RandomQuestion" name="RandomQuestion" value="' + i + '" />' + $(elName).value + '&#160;&#160;&#160;&#160;&#160;';
	   elemId[totalElem] = elem;
	   totalElem += 1;
   }
   frontR[totalElem] = '</blockquote></blockquote>';
   elemId[totalElem] = elem;
   elem++;
   totalElem += 1;	
   writeQuestionaire();
   saveQuestion();
   pleaseSave();
}


function saveTextQuest(){
    var questText = document.getElementById('textTitle').value;
	var x = parseInt(document.getElementById('textNum').value);
	
	frontR[totalElem] = '<blockquote><p>' + questText + '</p><blockquote><input type="text" size="' + x +'" id="RandomQuestion" name="RandomQuestion"  /></blockquote></blockquote>';
	elemId[totalElem] = elem;
	totalElem += 1;
	elem++;
	writeQuestionaire();
	saveQuestion();
	pleaseSave();
}

function saveQuestion(){
   if(sectionSet == 1){
	   frontR[totalElem] = '</div>';
	   totalElem++;
   }
   document.getElementById('newQuest').innerHTML += "<p>Please a designator for the question:</p><blockquote><input type='text' size='15' id='desig' name='desig'/></blockquote><input type='submit' id='save' name='save' value='Save'/>";

}

function writeQuestionaire(){
   var x = 0;
   lastElem = -1;
   document.getElementById('newQuest').innerHTML = "";
   toReturn = "";
   toSave = "";
   // Append front items
   for(x=0; x < totalElem; x++){
	   if( (lastElem != elemId[x]) && (elemId[x] != -2) ){
		   lastElem = elemId[x];
		   toReturn += "<img src='./assets/images/delete.png' alt='Delete Button' height='16px' width='16px' onclick='deleteElem(" + elemId[x] + ")'/>";
	   }
	   toReturn += frontR[x];
	   toSave += frontR[x];
   }
   if(sectionSet == 1){
      toReturn += "</div>";
   }
   document.getElementById('newQuest').innerHTML=toReturn;
   document.getElementById('newQuest').innerHTML += "<input type='hidden' value='" + toSave + "' id='toSave' name='toSave' />";
   
}

function pleaseSave(){
	
	document.getElementById('questInfo').innerHTML = "<p>Please save this questiton to continue</p>";
	
}

function deleteElem(y){
   for(x=0; x < totalElem; x++){
      if(elemId[x] == y){
	     frontR[x] = "";
		 elemId[x] = -2;
	  }
   }
   // If blank, create new arrays
   var empty = 0;
   for(x=0; x < totalElem; x++){
	   if( elemId[x] != -2 ){
	      empty = 1;
	   }
   }
   if( empty == 0 ){
      frontR = new Array();
	  elemId = new Array();
	  sectionSet = 0;
	  totalQuestion = 0;
	  totalElem = 0;
	  elem = 0;
   }
   writeQuestionaire();
}


window.addEvent('domready', function() {
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
	
});