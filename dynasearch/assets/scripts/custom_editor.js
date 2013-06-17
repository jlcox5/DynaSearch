
//ds_include('dsCustomPage.js');

var last_sidex = [0, 0];
var last_sidey = [0, 0];
var last_points=0, prev_point=0;

var toHandle = null;
var extMouseUp = function(){
   if(toHandle !== null){
      toHandle.onmouseup();
      toHandle = null;
   }
}
document.addEventListener("mouseup",extMouseUp,true);

var mkUnselectable = function(root){
   root.onselectstart = function(){return false;};
   if(root.className == undefined) root.className =   "unselectable";
   else                            root.className += " unselectable";
   //for(var child in root.childNodes) mkUnselectable(child);
   for(var i = 0; i < root.childNodes.length ; ++i ) mkUnselectable(root.childNodes[i]);
}

function mkParam(name,value){
   var param = document.createElement("param");
       param.name  = name;
       param.value = value;
   return param;
}

window.testing123 = function(){
   //alert('test');
}

var clickif = /^DS_.*/;
function registerAppletClick(cid, ctime, comp){
   if( typeof editing == 'undefined' && clickif.test(comp) ){
      registerClick(cid,ctime);
   }
}

var TRUE  = true;
var FALSE = false;
function fireThreadHook(tname){
   var target = document.getElementsByName(tname)[0];
   if( typeof(target.firePropertyChange) != 'function' ) return TRUE;
   target.firePropertyChange('gogogadgetthreadhook',1748.8471,1830.0381);
   return FALSE;
}

var curAdvisory = 1;

/*
var theSpy;
{//Add spy applet
   var spysrc = "assets/applets/eventSpy.class";
   var spyname = "eventSpy";
   var spydir = "assets/applets/";
   var spyObj = document.createElement("object");
       spyObj.id    = 'spyObj';
//       spyObj.data  = spysrc;
       spyObj.type  = 'application/x-java-applet';
       spyObj.innerHTML = "";
       spyObj.name = "spyObj";
       spyObj.standby   = "[Loading]... Please wait...";
       spyObj.appendChild(mkParam('classid','java:'+spyname+'.class'));
       spyObj.appendChild(mkParam('code',spysrc));
       spyObj.appendChild(mkParam('codebase',spydir));
       spyObj.appendChild(mkParam('mayscript','true'));
       spyObj.appendChild(mkParam('scriptable','true'));
   var spydiv = document.createElement("div");
   spydiv.appendChild(spyObj);
   document.documentElement.appendChild(spydiv);
   //window.addEvent('domready', function() { document.body.appendChild(spydiv); } );
   spyObj.style.width = spyObj.style.height = '0';
   //spyObj.style.position = "fixed";
   //spyObj.style.left = spyObj.style.top = "50%";
   //spyObj.style.width = spyObj.style.height = '50px';
   theSpy = spyObj;
}
*/

var mkProperTable = function(tab){
   if(tab.tabID === undefined)
      tab.User_tableID = tab.src_file;
   var disparity = tab.num_rows*tab.num_cols - tab.cell_N;
   while(disparity > 0){
      //tab[tab.cell_N++] = {label:"",eventID:""}
      ext_SymTab.cell([],tab);
      --disparity;
   }
   while(disparity < 0){
      delete tab[--tab.cell_N];
      ++disparity;
   }
   return tab;
}

var ext_table_data = [];

ext_SymTab = {

parseCommand: function(line,tab){
                 var pTok = line.split(/\s+/).filter(function(element,index,array){return !(/^\s*$/.test(element));});
                 var pCom = pTok[0].trim();

                 if(pCom in this){
                    pTok.shift();
                    this[pCom](pTok,tab);
                 }else{
                    this.cell(pTok,tab);
                 }
             },

row_header : function(args,tab){
                //var args = argstr.split('/\s+/');
                tab.num_rows = args.length;
                tab.row_head = args;
             },
col_header : function(args,tab){
                //var args = argstr.split('/\s+/');
                tab.num_cols = args.length + 1;
                tab.col_head = args;
             },
tableID  : function(args,tab){
              var ident = args[0].trim();
              tab.tabID = ident;
           },
num_rows : function(args,tab){
              var val = parseInt(args[0].trim(),10);
              tab.num_rows = isNaN(val) ? 0 : val;
           },
num_cols : function(args,tab){
              var val = parseInt(args[0].trim(),10);
              tab.num_cols = isNaN(val) ? 0 : val;
           },
cell : function(args,tab){
          //tab["cell".concat(tab.cell_N.toString())] = args[0],args.length>1?args[1]:"";
          tab[tab.cell_N++] = {
                                 label   : (args.length>0?args[0].trim():"")
                                //,eventID : (args.length>1?args[1].trim():"")
                                ,com : (args.length>1?args[1].trim():"")
                                ,cargs : (args.length>2?args.slice(2):[])
                              };
       }
}
var ext_table_parser = function(experiment, file, receiver)
{
	//filepath = 'hurricane_data/' + experiment + '/' + file;
	
	// Changed by Jon
	filepath = assetDir+file;
	
	var req = new Request({
		url: filepath,
		async: false,
		onComplete: function(response) 
		{ 
                   var table = {src_file:file,num_rows:0,num_cols:0,cell_N:0};

         if (response != undefined) {
            var lines = response.split('\n').filter(function(element,index,array){return !(/^\s*$/.test(element));});

         } else {
            var lines = [];
         }
			
			var result = [];
			for(var l=0; l < lines.length; l+=1)
			{
				// And split into an array of tokens
		//		result[l] = lines[l].split(',');
		//		result[l].splice(result[l].length-1);

         /*
            var pTok = lines[l].split('/\s+/');
            var pCom = pTok[0].trim(); 

            pTok.shift();
            ext_SymTab[pCom](pTok,table);
         */
            ext_SymTab.parseCommand(lines[l],table);
			}			
			//table_data[file] = result;

         /**FINISH TABLE CONSTRUCTION**/
			ext_table_data[file] = mkProperTable(table);
		},
	}).send();
}



/**
 * Creates and submits a form containig the op command
 * 'save' and the ID, name, and data of the current Custom Page
 *
 * @param int    id   - The ID of the custom page to be saved
 * @param string name - The name of the custom page to be saved
 * @param string data - The data describing the custom page to be saved
 */
var save_function = function( id, name, data ) {

   var form = new Element(
      'form',
      {
         'method' : 'post',
         'action' : 'custom_editor.php',
         'hidden' : 'hidden',
      }
   );
   
   form.adopt(
      new Element(
         'input',
         {
            'name'  : 'op',
            'value' : 'save',
         }
      )
   );
   
   form.adopt(
      new Element(
         'input',
         {
            'name'  : 'cpId',
            'value' : id,
         }
      )
   );
   
   form.adopt(
      new Element(
         'input',
         {
            'name'  : 'cpName',
            'value' : name,
         }
      )
   );
   
   form.adopt(
      new Element(
         'input',
         {
            'name'  : 'cpData',
            'value' : data,
         }
      )
   );
   //alert(data);
   document.body.adopt( form );
   form.submit();
}



/**
 * Creates and submits a form containig the op command
 * 'load' and the ID of a Custom Page in the database
 *
 * @param int id - The ID of the custom page to be deleted
 */
var load_function = function( id ) {

   var form = new Element(
      'form',
      {
         'method' : 'post',
         'action' : 'custom_editor.php',
         'hidden' : 'hidden',
      }
   );
   
   form.adopt(
      new Element(
         'input',
         {
            'name'  : 'op',
            'value' : 'load',
         }
      )
   );
   
   form.adopt(
      new Element(
         'input',
         {
            'name'  : 'cpId',
            'value' : id,
         }
      )
   );
   
   document.body.adopt( form );
   form.submit();
}



/**
 * Creates and submits a form containig the op command
 * 'delete' and the ID of the current Custom Page
 *
 * @param int id - The ID of the custom page to be deleted
 */
var delete_function = function( id ) {

   var form = new Element(
      'form',
      {
         'method' : 'post',
         'action' : 'custom_editor.php',
         'hidden' : 'hidden',
      }
   );
   
   form.adopt(
      new Element(
         'input',
         {
            'name'  : 'op',
            'value' : 'delete',
         }
      )
   );
   
   form.adopt(
      new Element(
         'input',
         {
            'name'  : 'cpId',
            'value' : id,
         }
      )
   );
   
   document.body.adopt( form );
   form.submit();
}


  
/**
 * Add a DOMReady event to the page which will create and instance
 * of the Custom Page object described by the currrently loaded data.
 */
window.addEvent('domready', function()
{

   //alert(CP_DATA);
   //var options = JSON.parse( CP_DATA );
   //alert(options);
   var options = Object.merge(  
      JSON.parse( CP_DATA ),
      {
         id             : CP_ID,
         name           : CP_NAME,
         editMode       : true,
         saveFunction   : save_function,
         loadFunction   : load_function,
         deleteFunction : delete_function,
      }
   );
   
   //alert(options.windows[0].type);
   
   //Object.each(options, function(opt) { alert(opt) });
   
   //options.append();
   var customPage = new CustomPage(options);
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
/*  
      },
   }
);*/


