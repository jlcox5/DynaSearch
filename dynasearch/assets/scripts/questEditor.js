// These functions are used by questEditor.php to facilitate building custom surveys

//Helper stuff

/*
function hexEncode(str){
   if(str.length == 1) return "";

   var rep = str.charCodeAt(i).toString(16);
   for(var i=1; i < str.length; ++i)
      rep += '.' + str.charCodeAt(i).toString(16);

   return rep;
}
*/

function hexEncode(str){
   return str.split("").map(function(strchar){return strchar.charCodeAt(0).toString(16);}).join('.');
}

function hexDecode(str){
   return str.split('.').map(function(hexchar){return String.fromCharCode(parseInt(hexchar,16));}).join("");
}

function dce(type){
   return document.createElement(type);
}

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

var Questionnaire = new Class(
{
   initialize: function(nName){
      this.name      = (nName==undefined)?"anonymous":nName;
      this.elements  = new Array();
      this.sections  = {};
      this.iid       = 0;
   },
   getItemId: function(){
      return this.iid++;
   },
   filter: function(callback,othis){
      this.elements = this.elements.filter(callback,othis);
   },
   registerSection:  function(nsec){
      //this.sections[secName] = new QuestSection({Q:this,title:secName});
      //this.elements.push(this.sections[secName]);

      this.sections[nsec.title] = nsec;
   },
   unregisterSection:  function(secName){
      //this.sections[secName] = undefined;
      delete this.sections[secName];
      //var ndx = this.sections.indexOf(secName);
      //this.sections.splice(ndx,1);
   },
   push: function(el){
      this.elements.push(el);
   },
   getName: function(){
      return (this.name==null)?"(root)":this.name;
   },
   setName: function(nname){
      this.name = nname;
   },
   genQuestionString: function(){
      var qarr = [];
      for(var i=0; i < this.elements.length; ++i){
          qarr = qarr.concat(this.elements[i].genQuestions());
      }
      return qarr.join(' ');
   },
   genString:  function(){
      var str  = "<questionnaire name='"+hexEncode(this.name)+"'>";
      for(var i=0; i < this.elements.length; ++i)
          str += this.elements[i].genString();
      return str + "</questionnaire>";
   },
   genElement:  function(forreal){
      if(forreal == undefined) forreal = false;
      var quest = document.createElement('div');
          quest.id = "accordion";
          quest.className = "questionairre";
          quest.name = this.name;
      for(var i=0; i < this.elements.length; ++i){
          quest.appendChild(this.elements[i].genElement(forreal));
         /*
         var cur_el = this.elements[i].genElement(forreal);
         if(forreal && this.elements[i].type == 'section'){
            while(cur_el.childNodes.length != 0){
              var guy = cur_el.removeChild(cur_el.firstChild);
              quest.appendChild(guy);
              // alert(cur_el.childNodes[ci].tagName);
               //quest.appendChild(cur_el.childNodes[ci]);
            }
         }else{
            quest.appendChild(cur_el);
         }
         */
      }

      if(forreal){
         var questionstring = this.genQuestionString();
         var hiddenqs = dce('input');
             hiddenqs.type  = 'hidden';
             hiddenqs.name  = 'questions';
             hiddenqs.value = questionstring;

         quest.appendChild(hiddenqs);
      }

      return quest;
   },
   wrapElement: function(element,item){
      var wrapper = document.createElement('div');
          wrapper.className = "element_wrapper";

      var row = document.createElement('tr');
      var d1  = document.createElement('td'); //Resection
      var d2  = document.createElement('td'); //Up
      var d3  = document.createElement('td'); //Down
      var d4  = document.createElement('td'); //Delete

      var selectSection = document.createElement('select');
      if(item.type == 'section'){
         var optsec = document.createElement('option');
             optsec.value = optsec.innerHTML = '---';
         selectSection.appendChild(optsec);
      }else{
         var optnone = document.createElement('option');
             optnone.value = optnone.innerHTML = '(none)';
         if(item.section === null) optnone.selected = true;
         selectSection.appendChild(optnone);
         for (sec in theQuest.sections ){
            if(sec === item.title) continue;
            var opt = document.createElement('option');
                opt.value = opt.innerHTML = sec;
            if(sec == item.section) opt.selected = true;
            selectSection.appendChild(opt);
         }
         selectSection.onchange = function(){item.handleResection(selectSection.value);};
      }
      d1.appendChild(selectSection);

      var img2 = document.createElement('img');
          img2.src = './assets/images/glyph_up.png';
      //    img2.width = img2.height = '16px';
          img2.onclick = function(){item.handleUp();};
      var img3 = document.createElement('img');
          img3.src = './assets/images/glyph_down.png';
       //   img3.width = img3.height = '16px';
          img3.onclick = function(){item.handleDown();};
      var img4 = document.createElement('img');
          img4.src = './assets/images/glyph_remove.png';
        //  img4.width = img4.height = '16px';
          img4.onclick = function(){item.handleDelete();};

      d2.appendChild(img2);
      d3.appendChild(img3);
      d4.appendChild(img4);

      row.appendChild(d1);
      row.appendChild(d2);
      row.appendChild(d3);
      row.appendChild(d4);

      wrapper.appendChild(row);
      wrapper.appendChild(element);

      return wrapper;
   },
   draw: function(forreal){
      if(forreal == undefined) forreal = false;
      document.getElementById('newQuest').innerHTML = "";
      document.getElementById('newQuest').appendChild(this.genElement(forreal));
   }
}
);

//var theQuest = new Questionnaire();
var theQuest;
//window.addEvent('domready', function(){theQuest.draw();});

function parseItem(root){
   switch(root.tagName){
      case 'section':
      case 'SECTION':
         var command = {};
             command.Q = theQuest;
             command.id    = parseInt(root.attributes['id'].value,10);
             command.title = hexDecode(root.attributes['title'].value);
         var nsection = new QuestSection(command);
         theQuest.registerSection(nsection);

         for(var i=0; i < root.childNodes.length; ++i){
            var nitem = parseItem(root.childNodes[i]);
                nitem.section = command.title;
            nsection.addItem(nitem);
         }

         return nsection;
         break;
      case 'textquestion':
      case 'TEXTQUESTION':
         var command = {};
             command.Q = theQuest;
             command.id            = parseInt(root.attributes['id'].value,10);
             command.fieldLength   = root.attributes['fieldLength'].value;
             command.text          = hexDecode(root.textContent);
         return new TextQuest(command);
         break;
      case 'textline':
      case 'TEXTLINE':
         var command = {};
             command.Q = theQuest;
             command.id   = parseInt(root.attributes['id'].value,10);
             command.text = hexDecode(root.textContent);
         return new TextLine(command);
         break;
      case 'radioquestion':
      case 'RADIOQUESTION':
         var N   = parseInt(root.attributes['num'].value,10);
         answers = new Array(N);
         answerNodes = root.getElementsByTagName('ans');
         for(var i=0; i < answerNodes.length; ++i){
            var node_i = answerNodes[i];
            var ndx    = parseInt(node_i.attributes['num'].value,10);
            answers[ndx] = hexDecode(node_i.textContent);
         }
         var command = {};
             command.Q = theQuest;
             command.id      = parseInt(root.attributes['id'].value,10);
             command.answers = answers;
             command.text    = hexDecode(root.getElementsByTagName('question')[0].textContent);
         return new RadioQuest(command);
         break;
   }
}

function parseQuestionnaireString(stringRep){
   var questDoc;
   if( window.DOMParser ){
      parser = new DOMParser();
      questDoc = parser.parseFromString(stringRep,'text/xml');
   }else{
      questDoc = new ActiveXObject('Microsoft.XMLDOM');
      questDoc.async=false;
      questDoc.loadXML(stringRep);
   }

   var root = questDoc.documentElement;

   theQuest = new Questionnaire();
   theQuest.setName(hexDecode(root.attributes['name'].value));

   for(var i=0; i < root.childNodes.length; ++i)
      theQuest.push(parseItem(root.childNodes[i]));
}


function addItem(command){
   command.Q = theQuest;
   var ST = {
      "section"   : function(){
         var nsection = new QuestSection(command);
         theQuest.registerSection(nsection);
         theQuest.push(nsection);
      },
      "radio"     : function(){
         theQuest.push(new RadioQuest(command));
      },
      "textQuest" : function(){
         theQuest.push(new TextQuest(command));
      },
      "textLine"  : function(){
         theQuest.push(new TextLine(command));
      }
   };

   ST[command.type]();
}

/*
function constructHeader(){
   function configButton(button,fun,label){
      button.id      = 'hbutton';
      button.name    = 'hbutton';
      button.type    = 'button';
      button.value   = label;
      button.onclick = fun;
   }
   var header = dce('div');
       header.id = "qheader";
   var text       = dce('span');
       text.innerHTML = "Create: ";
   var inputLoad  = dce('input');
   configButton(inputLoad,function(){},'Load');
   var inputSave  = dce('input');
   configButton(inputSave,function(){},'Save');
   var inputClear = dce('input');
   configButton(inputClear,function(){},'Clear');

   //FINISH

   header.appendChild(inputLoad);
   header.appendChild(inputSave);
   header.appendChild(inputClear);
   header.appendChild(text);

   return header;
}
*/

function constructHeader(){
   var header    = dce('div');
       header.id = 'qheader';

   var title = dce('span');
       title.innerHTML = theQuest.getName();
       title.className = 'hquesttitle';
       title.style.fontWeight = 'bold';
       title.style.fontSize = '110%';
       title.onclick = function(){
          //RENAME
          menuState = 3;
          Update();
       }

   header.appendChild(title);

   {
      var button = dce('input');
          button.id    = 'hbutton';
          button.className = 'hbutton';
          button.alt   =
          button.title = 'Clear';
          button.type  = 'image';
          button.src   = './assets/images/glyph_clear.png';
          button.onclick = function(){
             //CLEAR
             theQuest = new Questionnaire();
             Update();
          }
      header.appendChild(button);
   }
   {
      var button = dce('input');
          button.id    = 'hbutton';
          button.className = 'hbutton';
          button.alt   =
          button.title = 'Save';
          button.type  = 'image';
          button.src   = './assets/images/glyph_save.png';
          button.onclick = function(){
             //SAVE
             /*
             menuState = 2;
             Update();
             */
             document.forms['POST_save'].elements['saveQuest'].value = theQuest.genString();
             document.forms['POST_save'].elements['questName'].value = theQuest.getName();
             document.forms['POST_save'].submit();
          }
      header.appendChild(button);
   }
   {
      var button = dce('input');
          button.id    = 'hbutton';
          button.className = 'hbutton';
          button.alt   =
          button.title = 'Load';
          button.type  = 'image';
          button.src   = './assets/images/glyph_load.png';
          button.onclick = function(){
             //LOAD
             menuState = 1;
             Update();
          }
      header.appendChild(button);
   }
   header.appendChild(dce('br'));
   var label = dce('span');
       label.innerHTML = 'Create: ';
       label.style.fontWeight = 'bold';
       label.style.fontSize = '120%';
   header.appendChild(label);
   header.appendChild(dce('hr'));

   return header;
}

var menuState = 0;
function completeMenu(results){
   addItem(results);
   menuState = 0;
   Update();
}

function cancelButton(fun){
   var cancelbutton = dce('input');
       cancelbutton.type = 'image';
       cancelbutton.name = 'cancel';
       cancelbutton.id   = 'cancel';
       cancelbutton.title     =
       cancelbutton.alt  = 'Cancel';
       cancelbutton.src  = './assets/images/glyph_cancel.png';
       if(fun != undefined)
          cancelbutton.onclick = fun;
       else
          cancelbutton.onclick = function(){menuState=0;updateMenu();};

   return cancelbutton;
}
function submitButton(fun){
   var submitbutton = dce('input');
       submitbutton.type      = 'image';
       submitbutton.className = 
       submitbutton.name      = 
       submitbutton.id        = 'menuSubmit';
       submitbutton.title     =
       submitbutton.alt       = 'Submit';
       submitbutton.src = './assets/images/glyph_create.png';
       if( fun != undefined )
          submitbutton.onclick = fun;

   return submitbutton;
}

function constructMenu(){
   var menu = dce('div');
   menu.onkeypress = function(){};
   switch(menuState){
      case 00:
         //MAIN -- CREATE
         function configbutton(button,num,fun,label){
             button.id      = 'qtype';
             button.name    = 'type';
             button.type    = 'button';
             button.value   = label;
             button.onclick = fun;
         }
         var button0 = dce('input'); //section
             configbutton(button0,0,function(){menuState=10;updateMenu();},"Section");
         var button1 = dce('input'); //radio button question
             configbutton(button1,1,function(){menuState=20;updateMenu();},"Radio Button Question");
         var button2 = dce('input'); //text question
             configbutton(button2,2,function(){menuState=30;updateMenu();},"Text Question");
         var button3 = dce('input'); //line of text
             configbutton(button3,3,function(){menuState=40;updateMenu();},"Line of Text");

         menu.appendChild(button0); menu.appendChild(dce('br'));
         menu.appendChild(button1); menu.appendChild(dce('br'));
         menu.appendChild(button2); menu.appendChild(dce('br'));
         menu.appendChild(button3); menu.appendChild(dce('br'));
         break;
      case 01:
         //MAIN -- LOAD
         var form = dce('form');
             form.method = 'post';
             form.id     = 'loadForm';
         var label = dce('span');
             label.innerHTML = 'Load: ';
         form.appendChild(label);
         /*
         var loadquestfield = dce('input');
             loadquestfield.type      = 'text';
             loadquestfield.name      = 'loadQuest';
             loadquestfield.maxlength = 128;
             loadquestfield.onkeypress = function(){};
             */
         var loadquestfield = dce('select');
             loadquestfield.required  = true;
             loadquestfield.form = 'loadForm';
             loadquestfield.name      = 'loadQuest';
         {
            var dlist = document.getElementById('loadable');
            var noopt = dce('option');
                noopt.value     = '';
                noopt.innerHTML = '---';
                noopt.selected  = noopt.defaultSelected = true;
            loadquestfield.appendChild(noopt);
            for(var i=0; i < dlist.childNodes.length; ++i){
               var opt_N = dlist.childNodes[i];
               loadquestfield.appendChild(opt_N.cloneNode(true));
            }
         }
             //loadquestfield.list = "loadable";
         form.appendChild(loadquestfield);
         form.appendChild(submitButton());
         var cancelB = cancelButton();
             cancelB.formAction = 'javascript:;';
         form.appendChild(cancelB);
         menu.appendChild(form);
         break;
      case 02:
         //MAIN -- SAVE
         break;
      case 03:
         //MAIN -- RENAME
         var form = dce('form');
             form.action = 'javascript:;';
             form.onkeypress = function(){};
         {
            var label = dce('div');
                label.innerHTML = 'Please enter a new name for the questionnaire: ';
            form.appendChild(label);
            form.appendChild(dce('hr'));
         }
         var textField = dce('input');
             textField.id        = 
             textField.name      = 
             textField.className = 'hTextField';
             textField.type      = 'text';
             textField.size      =  45;
             textField.maxlength = 256;
             textField.value     =  '';
             textField.onkeypress = function(){};

         form.appendChild(textField);
         //form.onsubmit = function(){
         var submit_func = function(){
            menuState = 0;
            theQuest.setName(textField.value);
            Update();
         }

         form.appendChild(submitButton(submit_func));
         form.appendChild(cancelButton());

         menu.appendChild(form);
         break;
      //SECTION
      case 10:
         var label = dce('p');
             label.innerHTML = 'Please enter a title for the new section:';
         var textField = dce('input');
         textField.type   = 'text';
         textField.id     = 'textField';
         textField.name   = 'textField';
         textField.value  = '';
         textField.onkeypress = function(){};

         /*
         var cancelbutton = dce('input');
             cancelbutton.type = 'image';
             cancelbutton.name = 'cancel';
             cancelbutton.id   = 'cancel';
             cancelbutton.src  = './assets/images/glyph_cancel.png';
             cancelbutton.onclick = function(){menuState=0;updateMenu();};

         var submitbutton = dce('input');
             submitbutton.type  = 'image';
             submitbutton.className = 'menuCreate';
             submitbutton.name  = 'secSubmit';
             submitbutton.id    = 'secSubmit';
             submitbutton.src = './assets/images/glyph_create.png';
             //submitbutton.onclick = function(){menuState=0;addItem({type:"section",title:this.parentNode.children["textField"].value});updateMenu();};
         */
         menu.appendChild(label);
         menu.appendChild(textField);
         menu.appendChild(submitButton(function(){completeMenu({type:"section",title:textField.value})}));
         menu.appendChild(cancelButton());
         break;
      //RADIO BUTTON QUESTION
      case 20:
         var form = dce('form');
            form.action = 'javascript:;';
            form.onkeypress = function(){};

         {
            var label = dce('div');
                label.innerHTML = 'Please enter the question:';

            form.appendChild(label);
         }

         var getQuest = dce('input');
             getQuest.type  = 'text';
             getQuest.name  = getQuest.id = 'getQuest';
             getQuest.value = '';

         form.appendChild(getQuest);

         {
            var label = dce('div');
                label.innerHTML = 'Please enter the possible answers:';

            form.appendChild(label);
         }

         var answers  = dce('div');

         var population = 0;

         var answerList = [];

         var answerProto = dce('input');

             function mkAnswer(nseq) {
                var ansClone = answerProto.cloneNode(true);
                    ansClone.sequence = nseq;
                    ansClone.oninput = answerProto.onchange;
                    ansClone.onkeypress = function(){};
                return ansClone;
             }

             answerProto.style.display = 'block';
             answerProto.type = 'text';
             answerProto.name  = answerProto.id = 'anAnswer';
             answerProto.value = '';
             answerProto.onchange = function(){
                if(      (population - this.sequence) == 0 && this.value != '') {
                   //Add one more to the answer list
                   var newAnswer = mkAnswer(++population);
                   answers.appendChild(newAnswer);
                   answerList.push(newAnswer);
                } 
                else if( (population - this.sequence) == 1 && this.value == '') {
                   //Remove last while last.value == '', append blank
                   while(population >= 0 && answerList[population].value == ''){
                      answers.removeChild(answerList.pop());
                      --population;
                   }
                   var newAnswer = mkAnswer(++population);
                   answers.appendChild(newAnswer);
                   answerList.push(newAnswer);
                }
             };

         var firstAnswer = mkAnswer(0);
         answers.appendChild(firstAnswer);
         answerList.push(firstAnswer);

         form.appendChild(answers);

         var ellipse = dce('div');
             ellipse.innerHTML = '<center>.</br>.</br>.</center>'
         form.appendChild(ellipse);

             /*
         var submitb = dce('input'); 
             submitb.type = 'image';
             submitb.className = 'menuCreate';
             submitb.src = './assets/images/glyph_create.png';
         form.appendChild(submitb);
         */

         /*
         var cancelbutton = dce('input');
             cancelbutton.type = 'image';
             cancelbutton.name = 'cancel';
             cancelbutton.id   = 'cancel';
             cancelbutton.src  = './assets/images/glyph_cancel.png';
             cancelbutton.onclick = function(){menuState=0;updateMenu();};
             */

         form.appendChild(submitButton(function(){
            /*
            var answersFinal = answers.getElementsByTagName('input');
            answersFinal = answersFinal.map(function(_v){return _v.value;});
            answersFinal.pop();
            */
            answersFinal = [];
            answersDOM   = answers.getElementsByTagName('input');
            for(var i = 0; i < answersDOM.length-1; ++i)
               answersFinal.push(answersDOM[i].value);

            completeMenu({type:'radio',text:getQuest.value,answers:answersFinal});
         }));
         form.appendChild(cancelButton());

         menu.appendChild(form);
         break;
      //TEXT QUESTION
      case 30:
         var form = dce('form');
         form.action = 'javascript:;';
         form.onkeypress = function(){};

         var textField = dce('input');
             textField.type  = 'text';
             textField.id    = 'textField';
             textField.name  = 'textField';
             textField.value = '';
             textField.onkeypress = function(){};

         var maxField = dce('input');
             maxField.type = 'number';
             maxField.name = maxField.id = 'maxField';
             maxField.value = 0;
         {
            var div = dce('div');
            var label    = dce('p');
                label.innerHTML = 'Please enter the question:';

            div.appendChild(label);
            div.appendChild(textField);

            form.appendChild(div);
         }
         {
            var div = dce('div');
            var label    = dce('div');
                label.innerHTML = 'Please enter the max size of the answer (0 -> unbounded):';

            div.appendChild(label);
            div.appendChild(maxField);

            form.appendChild(div);
         }
         /*
         var submitb = dce('input');
             submitb.type = 'image';
             submitb.className = 'menuCreate';
             submitb.src = './assets/images/glyph_create.png';

         form.appendChild(submitb);

         var cancelbutton = dce('input');
             cancelbutton.type = 'image';
             cancelbutton.name = 'cancel';
             cancelbutton.id   = 'cancel';
             cancelbutton.src  = './assets/images/glyph_cancel.png';
             cancelbutton.onclick = function(){menuState=0;updateMenu();};
             */

         form.appendChild(submitButton(function(){
            completeMenu({type:'textQuest',text:textField.value,fieldLength:maxField.value});
         }));
         form.appendChild(cancelButton());

         menu.appendChild(form);
         break;
      //LINE OF TEXT
      case 40:
         var label = dce('p');
             label.innerHTML = 'Please enter the line of text:';
         var textField = dce('input');
         textField.type   = 'text';
         textField.id     = 'textField';
         textField.name   = 'textField';
         textField.value  = '';
         textField.onkeypress = function(){};

         var submitbutton = dce('input');
             submitbutton.type  = 'image';
             submitbutton.name  = 'textlineSubmit';
             submitbutton.id    = 'textlineSubmit';
             submitbutton.className = 'menuCreate';
             submitbutton.src = './assets/images/glyph_create.png';
             submitbutton.onclick = function(){completeMenu({type:"textLine",text:textField.value})};

         menu.appendChild(label);
         menu.appendChild(textField);
         menu.appendChild(submitbutton);

         /*
         var cancelbutton = dce('input');
             cancelbutton.type = 'image';
             cancelbutton.name = 'cancel';
             cancelbutton.id   = 'cancel';
             cancelbutton.src  = './assets/images/glyph_cancel.png';
             cancelbutton.onclick = function(){menuState=0;updateMenu();};
             */
         menu.appendChild(cancelButton());

         break;
      default:
         alert("Invalid menu state: (" + menuState + ") ! Resetting.");
         menuState = 0;
         menu = constructMenu();
         break;
   }
   return menu;
}

function constructRootMenu(){
   var root   = dce('div');
   var header = constructHeader();

   var menu   = constructMenu();

   root.appendChild(header);
   root.appendChild(menu);

   return root;
}

var ROOTMENU = null;
function updateMenu(){
   document.getElementById('questInfo').innerHTML = "";
   ROOTMENU = constructRootMenu();
   document.getElementById('questInfo').appendChild(ROOTMENU);
   draggables();
}

function updateQuestionnaire(){
   theQuest.draw();
}

function Update(){
   updateQuestionnaire();
   updateMenu();
}


var QuestItem = new Class(
{
   initialize: function(args){
      if( args.id === undefined ) this.id = args.Q.getItemId();
      else                        this.id = args.id;

      this.Q = args.Q;
      this.section = (args.section==undefined)?null:args.section;
      this.type = "item";
   },
   isRequired: function(){
      return false;
   },
   genString:  function(){
   },
   genElement:  function(forreal){
   },
   goQuietlyIntoThatNight: function(){
      var me = this;
      var rm = function(e,i,a){ return e != me ; };
      if(this.section==null) this.Q.filter(rm);
      else this.Q.sections[this.section].filter(rm);

      if(this.type == 'section') this.Q.unregisterSection(this.title);
   },
   handleDelete: function(){
      this.goQuietlyIntoThatNight();
      updateQuestionnaire();
   },
   handleUp: function(){
      if(this.section==null) shiftUp(this.Q.elements,this.id);
      else                   shiftUp(this.Q.sections[this.section].children,this.id);

      updateQuestionnaire();
   },
   handleDown: function(){
      if(this.section==null) shiftDown(this.Q.elements,this.id);
      else                   shiftDown(this.Q.sections[this.section].children,this.id);

      updateQuestionnaire();
   },
   genQuestions: function(){
      return [];
   },
   handleResection: function(nsection){
      this.goQuietlyIntoThatNight();
      if(nsection == '(none)'){
         theQuest.push(this);
         this.section = null;
      }else{
         theQuest.sections[nsection].addItem(this);
         this.section = nsection;
      }
      updateQuestionnaire();
   },
   wrapped: function(el){
      return this.Q.wrapElement(el,this);
   }
}
);

var QuestSection = new Class(
{
   Extends: QuestItem,
   initialize: function(args){
      this.parent(args);
      this.title    = args.title;
      this.children = new Array();
      this.type = "section";
   },
   genQuestions: function(){
      var ret = [];
      for(var i=0; i < this.children.length; ++i){
          ret = ret.concat(this.children[i].genQuestions());
      }
      return ret;
   },
   filter: function(callback,othis){
      this.children = this.children.filter(callback,othis);
   },
   addItem: function(nChild){
      this.children.push(nChild);
   },
   removeItemById: function(id2rm){
      this.children.filter(function(_v,_i,_a){return _v.id != id2rm;});
   },
   genString:  function(){
      var str  = "<section id='"+this.id+"' title='"+hexEncode(this.title)+"'>";
          //str += "<sectitle>"+this.title+"</sectitle>";
      for(var i=0; i < this.children.length; ++i)
          str += this.children[i].genString();

      return str + "</section>";
   },
   genElement:  function(forreal){
      var header = dce('h3');
          header.className = "toggler";
          header.innerHTML = this.title;
      var elements = dce('div');
          elements.className = 'element';
          //elements.className = "sectionBody";
      var ret = dce('div');

      for(var i=0; i < this.children.length; ++i)
         elements.appendChild(this.children[i].genElement(forreal));

      ret.appendChild(header);
      ret.appendChild(elements);

      return forreal?ret:this.wrapped(ret);
   }
}
);

var RadioQuest = new Class(
{
   Extends: QuestItem,
   initialize: function(args){
      this.parent(args);

      this.text    = args.text;
      this.answers = args.answers;
      this.type = "radioquest";
   },
   isRequired: function(){
      return true;
   },
   genQuestions: function(){
      return ['q'+this.id];
   },
   genString:  function(){
      var str  = "<radioquestion id='"+this.id+"' num='"+this.answers.length+"'>";
          str += "<question>"+hexEncode(this.text)+"</question>";
      for(var i=0; i < this.answers.length; ++i){
         str += "<ans num='"+i+"'>"+hexEncode(this.answers[i])+"</ans>";
      }
      return str+"</radioquestion>";
   },
   genElement:  function(forreal){
      var bq1  = document.createElement("blockquote");
      var para = document.createElement("p");
          para.innerHTML = this.text;
      var bq2  = document.createElement("blockquote");
          bq2.innerHTML = '';
      for(var i=0; i < this.answers.length; ++i){
         //var na = document.createElement("input");
         //    na.type="radio";
         //    na.id="q"+this.id;
         //    na.value=i;
         var answerText    = this.answers[i];
         var answerURItext = encodeURI(answerText);
         bq2.innerHTML += '<input type="radio" id="q' + this.id + '" name="q' + this.id + '" value="' + answerURItext + (forreal?'" required />':'" />') + answerText + '&#160;&#160;&#160;&#160;&#160;';
      }
      bq1.appendChild(para);
      bq1.appendChild(bq2);

      return forreal?bq1:this.wrapped(bq1);
   }
}
);

var TextQuest = new Class(
{
   Extends: QuestItem,
   initialize: function(args){
      this.parent(args);

      this.text        = args.text;
      this.fieldLength = args.fieldLength;
      this.type = "textquest";
   },
   isRequired: function(){
      return true;
   },
   genQuestions: function(){
      return ['q'+this.id];
   },
   genString:  function(){
      return "<textquestion id='"+this.id+"' fieldLength='"+this.fieldLength+"'>"
            +hexEncode(this.text)+"</textquestion>";
   },
   genElement:  function(forreal){
      var element = document.createElement("blockquote");
      var innerBQ = document.createElement("blockquote");
      var para    = document.createElement("p");
          para.innerHTML = this.text;
      var input   = document.createElement("input");
          input.type = "text";
          input.required = forreal;
          input.size = 96;
          if(this.fieldLength > 0) input.maxlength = this.fieldLength;
          input.maxlength = this.fieldLength;
          input.name =
          input.id   = "q" + this.id;

      innerBQ.appendChild(input);

      element.appendChild(para);
      element.appendChild(innerBQ);

      return forreal?element:this.wrapped(element);
   }
}
);

var TextLine = new Class(
{
   Extends: QuestItem,
   initialize: function(args){
      this.parent(args);

      this.text = args.text;
      this.type = "textline";
   },
   genString:  function(){
      return "<textline id='"+this.id+"'>"+hexEncode(this.text)+"</textline>";
   },
   genElement:  function(forreal){
      var element = document.createElement('p');
          element.innerHTML = this.text;
      return forreal?element:this.wrapped(element);
   }
}
);


/*
// Flag used to determine which option is selected
var option = -1;

// Used to name radio questions fed into database
var totalQuestions = 0;
var totalElem = 0;
var elem = 0;

// Holds html of final result
var frontR = new Array();
var elemId = new Array();

var sectionSet = 0;
*/

function constructQuestion(){

   var questStr = document.forms['To_Load'].elements['questStr'].value.trim();
   if(questStr != ""){
      //var questStr = document.forms['To_Load'].elements['questStr'].value;
      parseQuestionnaireString(questStr);
   }else{
      theQuest = new Questionnaire();
   }
   Update();
	
	//document.getElementById('questInfo').innerHTML = "<p>Please select the Item you would like to create:</p><blockquote><input id='qtype' name='type' type='radio' value='0' onclick='setOption(0)'/>Section<br/><input id='qtype' name='type' type='radio' value='1' onclick='setOption(1)'/>Radio Button Question<br/><input id='qtype' name='type' type='radio' value='2' onclick='setOption(2)'/>Text Question<br/><input id='qtype' name='type' type='radio' value='3' onclick='setOption(3)'/>Line of Text<br/></blockquote><input type='submit' id='questSub' name='questSub' value='Next' onclick='buildQuestion()'/><input type='submit' id='questSave' name='questSave' value='Save' onclick='saveQuestion()'/>";

   //ROOTMENU = constructRootMenu();
   //var qinfo = document.getElementById('questInfo');
   //qinfo.innerHTML = "";
   //qinfo.appendChild(ROOTMENU);
}

function draggables(){
   window.addEventListener('domready',_draggables());
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
}

/*
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
*/

//window.addEventListener('domready',draggables());
