
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

function dce(type){ return document.createElement(type); }

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



function findPos(obj){
   var left = !!obj.offsetLeft ? obj.offsetLeft : 0;
   var top = !!obj.offsetTop ? obj.offsetTop : 0;

   while(obj = obj.offsetParent){
      left += !!obj.offsetLeft ? obj.offsetLeft : 0;
      top += !!obj.offsetTop ? obj.offsetTop : 0;
   }
   return[left, top];
}

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

var load_all = function(file)
{
	var req = new Request({
	url: file,
	async: false,
	onComplete: function(response)
		{

			var totalHeight = 0;
			//alert(response);
			var windows = response.split('&');
			for(var i=0;i<windows.length;++i)
			{
				var attributes = windows[i].split(',');
				var handle = '';
				
				// Figure out the type
				var type = hex_to_str(attributes[0]);
				if( type == 'text' || type == 'text_nohide')
				{
					handle = new TextWindow(type=='text_nohide');		
					handle.set_trashable(true);	
					handle.div.getElement('.handle').innerHTML = hex_to_str(attributes[1]);
					
					//Position and Size
					var posx = ( hex_to_str(attributes[2]) );
					var posy = ( hex_to_str(attributes[3]) );
					var width = ( hex_to_str(attributes[4]) );
					var height = ( hex_to_str(attributes[5]) );

					handle.div.style.left = posx*window.scaleW+'px';
					handle.div.style.top = posy*window.scaleH+'px';
					//alert("style: " + handle.div.style.left + " " + handle.div.style.top);
					handle.div.style.width = width*window.scaleW + 'px';
					handle.div.style.height = height*window.scaleH + 'px';
					
					//alert(window.scaleW);
					handle.div.style.fontSize = 16*(window.scaleW/55.0);
					//alert(handle.div.style.fontSize);
										
					// Content
					handle.div.getElement('.content').innerHTML = hex_to_str(attributes[6]);
					var newId = handle.div.getElement('.handle').innerHTML.replace( /[^\w]/gi ,'');	// Get rid of spaces and weird symbols
					handle.div.getElement('.content').id = newId;
					handle.content.id = newId;
					
					var content = handle.content;
					content.id = newId;
					//alert("New id: " + newId);
					if(typeof editing == 'undefined' && type == 'text_nohide')
		      			{
			 		   coverText(content.id,height);
		      			}
				}
				else if( type == 'table' )
				{
					handle = new TableWindow(window.experiment_shortname, hex_to_str(attributes[6]) );
					handle.set_trashable(true);				
					handle.div.getElement('.handle').innerHTML = hex_to_str(attributes[1]);
					
					//Position and Size
					var posx = ( hex_to_str(attributes[2]) );
					var posy = ( hex_to_str(attributes[3]) );
					var width = ( hex_to_str(attributes[4]) );
					var height = ( hex_to_str(attributes[5]) );

					handle.div.style.left = posx*window.scaleW+'px';
					handle.div.style.top = posy*window.scaleH+'px';
					handle.div.style.width = width*window.scaleW + 'px';
					handle.div.style.height = height*window.scaleH + 'px';
					handle.div.style.fontSize = 16*(window.scaleW/55.0);
					
					// Jon test stuff
      			document.getElementById((i+1)+'_content').style.width = width*window.scaleW + 'px';
      			document.getElementById((i+1)+'_content').style.height = (height*window.scaleH)-21 + 'px';
      			document.getElementById((i+1)+'_content').style.fontSize = 16*(window.scaleW/55.0);
					
					if(typeof editing == 'undefined')
		         {
   		         //var pdh = this.parentNode.parentNode.getElement('.handle');
   		      	var table_name = handle.div.getElement('.handle').innerHTML.replace( /[^\w]/gi ,'');	// Get rid of spaces and weird symbols
   		      	//alert("Table Name: " + table_name);
			 		   coverTable(	handle.table.id , handle.table.id+"_"+table_name+"_");
		      	}
				}
				else if( type == 'ext_table' )
				{
					handle = new InteractiveTableWindow(window.experiment_shortname, hex_to_str(attributes[6]) );
					handle.set_trashable(true);				
					handle.div.getElement('.handle').innerHTML = hex_to_str(attributes[1]);
					
					//Position and Size
					var posx = ( hex_to_str(attributes[2]) );
					var posy = ( hex_to_str(attributes[3]) );
					var width = ( hex_to_str(attributes[4]) );
					var height = ( hex_to_str(attributes[5]) );

					handle.div.style.left = posx*window.scaleW+'px';
					handle.div.style.top = posy*window.scaleH+'px';
					handle.div.style.width = width*window.scaleW + 'px';
					handle.div.style.height = height*window.scaleH + 'px';
					handle.div.style.fontSize = 16*(window.scaleW/55.0);
					
					// Jon test stuff
      			document.getElementById((i+1)+'_content').style.width = width*window.scaleW + 'px';
      			document.getElementById((i+1)+'_content').style.height = (height*window.scaleH)-21 + 'px';
      			document.getElementById((i+1)+'_content').style.fontSize = 16*(window.scaleW/55.0);
					
				  if(typeof editing == 'undefined')
		          {
   		             //var pdh = this.parentNode.parentNode.getElement('.handle');
   		      	     //var table_name = handle.div.getElement('.handle').innerHTML.replace( /[^\w]/gi ,'');	// Get rid of spaces and weird symbols
                     var table_name = handle.tabID;
   		      	     //alert("Table Name: " + table_name);
			 		 //coverTable(	handle.table.id , handle.table.id+"_"+table_name+"_");
                     attachTimerFuncs(handle,table_name);
		      	  }
				}
				else if( type == 'image' ){
               //alert(hex_to_str(attributes[7]));
					handle = new ImageWindow(window.experiment_shortname, hex_to_str(attributes[6]), hex_to_str(attributes[7]) );
					handle.set_trashable(true);				
					handle.div.getElement('.handle').innerHTML = hex_to_str(attributes[1]);
					
					//Position and Size
					var posx = ( hex_to_str(attributes[2]) );
					var posy = ( hex_to_str(attributes[3]) );
					var width = ( hex_to_str(attributes[4]) );
					var height = ( hex_to_str(attributes[5]) );

					handle.div.style.left = posx*window.scaleW+'px';
					handle.div.style.top = posy*window.scaleH+'px';
					handle.div.style.width = width*window.scaleW + 'px';
					handle.div.style.height = height*window.scaleH + 'px';
					handle.div.style.fontSize = 16*(window.scaleW/55.0);
					
					// Jon test stuff
      			document.getElementById((i+1)+'_content').style.width = width*window.scaleW + 'px';
      			document.getElementById((i+1)+'_content').style.height = (height*window.scaleH)-21 + 'px';
      			document.getElementById((i+1)+'_content').style.fontSize = 16*(window.scaleW/55.0);
					
            }
				else if( type == 'object' ){
               handle = new ObjectWindow(window.experiment_shortname, hex_to_str(attributes[6]));
               handle.set_trashable(true);
					
					//Position and Size
					var posx = ( hex_to_str(attributes[2]) );
					var posy = ( hex_to_str(attributes[3]) );
					var width = ( hex_to_str(attributes[4]) );
					var height = ( hex_to_str(attributes[5]) );

					handle.div.style.left = posx*window.scaleW+'px';
					handle.div.style.top = posy*window.scaleH+'px';
					handle.div.style.width = width*window.scaleW + 'px';
					handle.div.style.height = height*window.scaleH + 'px';
					handle.div.style.fontSize = 16*(window.scaleW/55.0);
					
					// Jon test stuff
      			document.getElementById((i+1)+'_content').style.width = width*window.scaleW + 'px';
      			document.getElementById((i+1)+'_content').style.height = (height*window.scaleH)-21 + 'px';
      			document.getElementById((i+1)+'_content').style.fontSize = 16*(window.scaleW/55.0);
            }

			else if( type == 'clock' ){
   				if(typeof editing != 'undefined'){
      				//Position and Size
      				handle = new ClockWindow();
					   handle.set_trashable(true);
					   handle.time = attributes[6];
					   
					   var posx = ( hex_to_str(attributes[2]) );
					   var posy = ( hex_to_str(attributes[3]) );
					   var width = ( hex_to_str(attributes[4]) );
					   var height = ( hex_to_str(attributes[5]) );

					   handle.div.style.left = posx*window.scaleW+'px';
					   handle.div.style.top = posy*window.scaleH+'px';
	                   handle.div.style.width = width*window.scaleW + 'px';
					   handle.div.style.height = height*window.scaleH + 'px';
					   handle.div.style.fontSize = 16*(window.scaleW/55.0);
				   }	
   		      if(typeof editing == 'undefined'){
      		      //Position and Size
      				handle = new ClockWindow();
					   handle.time = attributes[6];
					   toSend =  handle.div.getElement('.content');
					   for(i=0; i < updatables.length; i++){
   					   if(updatables[i].type == 'clock'){ 
      					   id = i; 
      					   break;
      					}
					   }
					   
					   //startPageTimer(attributes[6], 0, toSend);
					   
					   var posx = ( hex_to_str(attributes[2]) );
					   var posy = ( hex_to_str(attributes[3]) );
					   var width = ( hex_to_str(attributes[4]) );
					   var height = ( hex_to_str(attributes[5]) );

					   handle.div.style.left = posx*window.scaleW+'px';
					   handle.div.style.top = posy*window.scaleH+'px';
	                   handle.div.style.width = width*window.scaleW + 'px';
					   handle.div.style.height = height*window.scaleH + 'px';
					   handle.div.style.fontSize = 16*(window.scaleW/55.0);
					   startPageTimer(attributes[6], 0, id);
			         //startPageTimer(attributes[6], 0);
		         }
	         }
				
				//Add it to the page
				if(posy*window.scaleH + height*window.scaleH > totalHeight){
				   totalHeight =  posy*window.scaleH + height*window.scaleH;
			   }

			}
			
			document.getElementById('main_editor').style.height = totalHeight+'px';
						
			if(typeof editing == 'undefined')
			{
   			document.getElementById('doneWithPage').style.top = totalHeight+'px';
				// Take away the resizing and dragging if not in edit mode
				for(var i=0;i<updatables.length;++i)
				{
					updatables[i].dragobj.detach();
					updatables[i].resizeobj.detach();
				}
			}
		   
		}
	}).send();
}

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

// Remove items from an array based on another list of items
Array.prototype.removeItems = function(itemsToRemove) {

    if (!/Array/.test(itemsToRemove.constructor)) {
        itemsToRemove = [ itemsToRemove ];
    }

    var j;
    for (var i = 0; i < itemsToRemove.length; i++) {
        j = 0;
        while (j < this.length) {
            if (this[j] == itemsToRemove[i]) {
                this.splice(j, 1);
            } else {
                j++;
            }
        }
    }
}


//var timer = new BTimer(100, system_tick, []);
var randab = function(a,b) { return a + (b-a)*Math.random(); };

///////////////////////////////////////////////////////////////

// Handle the total count of Toolbars
var updatables = [];
function add_updatable(e)
{ updatables.push(e); }

var ___ToolbarCount=0;
function IncrementToolbarCount(d)
{ ___ToolbarCount += 1; }
function GetToolbarCount()
{ return ___ToolbarCount; }


//////////////////////////////////////////
// ICONS
//////////////////////////////////////////

function addEventListenerRec(root, type, listener, useCapture){
   root.addEventListener(type,listener,useCapture);
   for(var i=0; i < root.childNodes.length; ++i)
      addEventListenerRec(root.childNodes[i],type,listener,useCapture);
}



function update_stuff(el)
{
	var content = 'Location: ' + el.getPosition()['x'] + ' , ' + el.getPosition()['y'] + '<br/>';
	content += 'Size: ' + el.getSize().x + ' , ' + el.getSize().y;
}


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
   
   document.body.adopt( form );
   form.submit();
}


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

/*Asset.javascript(
   DS_SCRIPT_BASE_PATH + 'dsCustomPage.js',
   {
      onLoad : function() {
  */  
  
  
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


