// These functions are used by questEditor.php to facilitate building custom surveys


var theQuest;


function updateQuestionnaire(forReal){
   theQuest.draw(forReal);
}

function Update(forReal){
   if(forReal == undefined) forReal = false;
   updateQuestionnaire(forReal);
}

function submitQuest() {

//alert('hi');

qRes = Element('div').adopt( theQuest.genResult(PAGE_TITLE) ).get('html');
//alert( theQuest.genResult('title') );

   var form = new Element('form');
   form.action = 'question.php';
   form.style.visibility = 'hidden';
   form.method = 'POST';

/*
   var op = new Element('input');
   op.name = 'op';
   op.value = 'save';
   form.adopt(op);
*/

   var results = new Element('input');
   results.name = 'qResults';
   results.value = qRes;
   form.adopt(results);

   document.body.adopt(form);
   form.submit();
//new Element('div').adopt(el).get('html')
}

window.addEvent(
   'domready',
   function() {
      alert('hello!');
 
      if ( Q_DATA != '' ){
         theQuest = new Questionnaire();
         theQuest.appendItems( Q_DATA );

         Update(true);
      }

      doAccordions();
   }
);

