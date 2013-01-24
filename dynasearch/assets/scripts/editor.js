// Popup functions

var currentPopup,
    currentObj,
    popupCallback;

var setupAssetPopups = function() {
   
}

var openAssetPopup = function(assetType, callback) {
   //currentObj = object;
   popupCallback = callback;

   var assetPopup = $(assetType + 'Popup');
   assetPopup.setProperty('style', 'display:inline-block;');
   //alert(assetType + 'Popup');
}

var selectAsset = function(assetType) {

   var assetSelect = $(assetType + 'PopupSelect');
   var asset = assetSelect.getSelected().get('value') + '';

           //currentObj.def_imgbase = asset;
            //currentObj.img.src = currentObj.def_imgsrc  = "admins/jgestring/assets/images/"+currentObj.def_imgbase.trim();
   popupCallback(asset);

   var assetPopup = $(assetType + 'Popup');
   assetPopup.setProperty('style', 'display:none;');

}

var dismissAssetPopup = function(assetType) {
   var assetPopup = $(assetType + 'Popup');
   assetPopup.setProperty('style', 'display:none;');
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

var table_data = []
var table_parser = function(experiment, file, receiver)
{
	//filepath = 'hurricane_data/' + experiment + '/' + file;
	filepath = assetDir+file;

	//alert(filepath);
   var req = new Request({
      url        : filepath,
      async      : false,
      onComplete : function(response) {
         var result = [];

         if (response != undefined) {
            var lines = response.split('\n');

         } else {
            var lines = [];
         }

         for(var l=0; l < lines.length; l+=1) {
            // And split into an array of tokens
            result[l] = lines[l].split(',');
            result[l].splice(result[l].length-1);
         }			
         table_data[file] = result;

      },
   }).send();
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
	
	alert(filepath);
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

// Window Class
var Window = new Class({
	initialize: function(content, title) {
		// Increment the total count
		IncrementToolbarCount(1);
		
		// Create the Div with relavent XHTML
		this.div = document.createElement('div');
		this.div.trashable = this.trashable = true;
		this.div.barnum = GetToolbarCount();
		this.div.setAttribute('id', 'toolbar' + (GetToolbarCount()).toString() + 'div');
		this.div.setAttribute('class','drag');
		if(content === undefined) { content = ''; }
		if(title === undefined) { title = "Untitled Window"; }
		this.div.innerHTML = '<div class="handle">' + title + '</h4>';
		if(typeof editing != 'undefined')
		{
			this.div.innerHTML += '<div class="resize" style="position:absolute; right:0px; bottom: 0px;"><img src="assets/images/resize_icon.png" style="padding: 0 0; margin: 0 0;"/></div>';
			this.div.innerHTML += '<div class="infohandle" style="position:absolute; right:0px; top: 0px;"><img class="icon" src="assets/images/icon-info.png" style="padding: 0 0; margin: 0 0;" onmousedown="event.preventDefault();" /></div>';
			this.div.getElement('.infohandle').getElement('.icon').parent_div = this.div;

	     // Changed zIndex to 0 and commented out the interHTML to have the infoIcons layer correctly...  Not sure what the iframe stuff is there for but it
		 //  seems to be ok for now.  If wierd behavior creeps up, be sure to come back to this.  Jon 21JAN13
         this.div.getElement('.infohandle').style.zIndex="0";
         this.div.getElement('.resize').style.zIndex="0";
			//this.div.innerHTML += '<iframe class="resizeShim"     style="position:absolute; right:0px; bottom: 0px; width: 15px; height: 15px; background: none; border:none; z-index:9;"/>';
			//this.div.innerHTML += '<iframe class="infohandleShim" style="position:absolute; right:0px; top: 0px;    width: 33px; height: 33px; background: none; border:none; z-index:9;"/>';
		}
		this.div.innerHTML += '<div class="content" id="'+ this.div.barnum +'_content">'+ content +'</div>';

		//Add to the page
		//document.getElementById('holdCanvas').appendChild(this.div);
		//document.body.appendChild(this.div);
		document.getElementById('main_editor').appendChild(this.div);
		this.content = this.div.getElement('.content');
		this.div.classpointer = this;
		
		var el = this.div;							
		var dr_alpha = .7;
		var drag_options = {
			onStart:function() { el.setOpacity(dr_alpha); },
			onComplete:function() { el.setOpacity(1); },
			handle: el.getElements('.handle')[0],
			droppables: '.trashbin',
			onDrop: function(el, d, event){
   			//alert("D: " + d);
   			if(d)
   			{
      			 //alert("Tried to delete!");
					 if(el.trashable) { el.destroy(); }
		      }
			},
			onEnter: function(el, d){
				el.setAttribute('class','drag_enter');
			},
			onLeave: function(el, d){
				el.setAttribute('class','drag');
			}
		};

      //this.aspect = 0.0;
      var win = this;
		var resize_options = {
			onStart:function() { el.setOpacity(dr_alpha); },
			onComplete:function() { 
            el.setOpacity(1);
       //     if(win.aspect != 0.0){
        //       el.style.width = el.getSize().y*win.aspect + "px";
         //   }
            var H = el.getElement('.content').style.height = (el.getSize().y - el.getElement('.handle').getSize().y - 3) + "px"; 

            if(win.resizeCB != undefined) win.resizeCB(win);
         },
			handle: el.getElements('.resize')[0]
		};

		this.dragobj = el.makeDraggable(drag_options);
		this.resizeobj = el.makeResizable(resize_options);
		
		add_updatable(this);
	},
   getHandleOffsetY: function()   { return this.div.getElement('.infohandle').getSize().y + this.div.getElement('.resize').getSize().y;},
   getHandleOffsetX: function()   { return this.div.getElement('.infohandle').getSize().x + this.div.getElement('.resize').getSize().x;},
	get_width  : function()       { return this.div.getSize().x;     },
	get_height : function()       { return this.div.getSize().y;     },
	get_x	   : function()         { return this.div.getPosition().x; },
	set_trashable: function(bool) { this.div.trashable = bool;       },
	update : function(o)          {                                  },
});

// Toolbar class
var Toolbar = new Class({
	Extends: Window,
	initialize: function() {
		this.type = 'toolbar';
		this.parent(undefined,'Toolbar');
		this.trashable = false;
		this.div.getElement('.infohandle').destroy();
		this.div.id='EditingToolbar';
		var save_button = document.createElement('button');
      this.div.adopt(document.createElement('hr'));
      save_button.style.fontSize = '25px';
      save_button.style.marginLeft = save_button.style.marginRight = '10%';
		save_button.innerHTML = 'Save';
		save_button.onclick = function() { save_all(); };
		this.div.adopt(save_button);
		/* 
                 * Changed by Jordan
		 * Leave the z-index out so that each new window is added in front
                 */
		//this.div.style.zIndex=1000;
		var load_button = document.createElement('input');
		load_button.type = 'submit';
		//load_button.onclick = function() { document.forms["main_editor"].submit(); }
		load_button.value = 'Load';
		load_button.id = 'expLoad';
		load_button.name = 'expLoad';
		load_button.style.marginLeft = load_button.style.marginRight = '10%';
      this.div.adopt(load_button);
      this.div.adopt(document.createElement('hr'));
      var list_files = document.createElement('p');
      list_files.innerHTML = window.editorFiles;
      list_files.id = 'listFiles';
      list_files.name = 'listFiles';
      this.div.adopt(list_files);
	},
	add_icon: function(icon) { this.div.getElement('.content').appendChild(icon.el); }
});

// Image Selection Window

// Image Window
var ImageAssetDir = assetDir;
var ImageWindow = new Class({
	Extends: Window,
	initialize: function(experiment,file,ntableLink) {

   //alert(ntableLink);
      this.experiment = experiment;
		this.type='image';
		this.parent(undefined,'Image Window');
		this.trashable = false;


      this.img = document.createElement('img');
      this.def_imgbase = file==null?"test_icon.png":file.trim();
      this.def_imgsrc  = this.img.src = ImageAssetDir+this.def_imgbase;

      var imgwin = this;
      var aspCB = function(){
         imgwin.aspect = this.getSize().x/this.getSize().y;
      }
      this.img.addEventListener('load',aspCB);

      this.div.getElement(".content").adopt(this.img);
		this.div.getElement(".content").style.padding = "3px 3px";


//      var thisthis = this;
//      this.img.onload=function(){thisthis.iwidth = this.offsetWidth; thisthis.iheight = this.offsetHeight;};

      //this.eventID = this.img.src.split('/').pop().trim();
      this.tableLink = ntableLink==null?"":ntableLink;
      this.img.style.position="relative";
      this.img.style.top="0%";
      this.img.style.bottom="0%";
      this.img.style.left="0%";
      this.img.style.right="0%";
      this.img.style.width="100%";
      this.img.style.height="auto";
      this.img.style.overflow="visible";
      this.img.style.display="inline";
      this.img.id = "theImage";
	  this.div.style.height = this.img.getSize().y + "px";

      var This = this;
      this.resizeCB = function(){
	     if(typeof editing == 'undefined'){
		    //var tempHeight = This.img.getSize().y - 50;
		    //This.div.getElement(".content").style.height = tempHeight + "px";
            //This.div.style.height = This.img.getSize().y - 100 +"px";
		 }
		 else{
		    This.div.style.height = This.img.getSize().y + This.getHandleOffsetY() + 5 +"px";
		 }
         //This.div.getElement(".content").style.height = This.img.getSize().y + "px";
         //This.div.style.height = This.img.getSize().y + This.getHandleOffsetY() + 5 +"px";
		 //This.div.style.height = This.img.getSize().y + 5 +"px";
      };

      //var eventID = this.img.src.split('/').pop().trim();
      //document.addEventListener(eventID,this.eventHandler,false);
      var me = this;
      var eventSymTab = {
         img : function(signal,args){
                  switch(signal){
                     case "mouseup":
                        me.img.src = me.def_imgsrc;
                        break;
                     case "mousedown":
                        if(args.length < 1) return;
                        //me.img.src = "assets/images/" + args[0].trim();
                        me.img.src = ImageAssetDir + args[0].trim();
                        break;
                  }
         },
         doCommand: function(com,signal,args){
                       com = com.trim();
                       if(com in this){
                          //var argTok = args.split(/\s+/).filter(function(element,index,array){return !(/^\s*$/.test(element));});
                          this[com](signal,args);
                       }
         }
      }
      var eventHandler = function(evt){
         //if(evt.eventID != me.eventID) return;
         //alert("Event fired from " + evt.tabID + " table and received by ImageWindow with eventID " + evt.eventID);
         if(evt.tabID != me.tableLink) return;
         //alert("Event fired from " + evt.tabID + " table and received by ImageWindow with eventID " + evt.eventID);
         eventSymTab.doCommand(evt.com,evt.signal,evt.cargs);
      }

      document.addEventListener("ImageWindowEvent",eventHandler,false);

		//this.div.getElement(".content").innerHTML = "<img src='" + this.source + "'/>";

      var IWThis = this;

		if(typeof editing != 'undefined') {
		this.div.getElement(".infohandle").getElement(".icon").onmouseup = function()
			{ 
				var pd = this.parentNode.parentNode;
				var pdc = pd.getElement('.content');			
				var pdh = pd.getElement('.handle');

var cb = function(asset) {
            me.def_imgbase = asset;
            me.img.src = me.def_imgsrc  = assetDir+me.def_imgbase.trim();

            me.tableLink = prompt("Please enter an associated table ID.",me.tableLink);
}

openAssetPopup('images', cb);

/*
            //var img = pd.getElementById("theImage");
            //me.img.src = prompt("Please enter the server local filename of the image to source.", me.img.src);
            me.def_imgbase = prompt("Please enter the server local filename of the image to source.", me.def_imgbase);
            me.img.src = me.def_imgsrc  = ImageAssetDir+me.def_imgbase.trim();
            //var eventID = prompt("Please enter an associated event name.",me.img.src.split('/').pop().trim());
            //me.eventID = prompt("Please enter an associated event name.",me.img.src.split('/').pop().trim());
            me.tableLink = prompt("Please enter an associated table ID.",me.tableLink);
*/
            //me.createEventListener();
			}
		}
      this.resizeobj.fireEvent("onComplete");

	},
	//update: function(o) { this.div.getElement('.handle').innerHTML = o.index + hurricane_frame_num; },
   update: function(o) { },
});

// Text Window
var TextWindow = new Class({
	Extends: Window,
	initialize: function(isHideable) {

      if(isHideable == undefined) isHideable = true;
      this.isHideable = isHideable;

		this.type=this.isHideable?'text':'text_nohide';
		this.parent(undefined,this.isHideable?'Text Window':'Text Window (Always Visible)');
		this.trashable = false;

		this.div.getElement(".content").innerHTML = "This is some sample text. Press the Info Button to edit me.";
		this.div.getElement(".content").style.padding = "3px 3px";

		if(typeof editing != 'undefined') {
		this.div.getElement(".infohandle").getElement(".icon").onmouseup = function()
			{ 
				var pd = this.parentNode.parentNode;
				var pdc = pd.getElement('.content');			
				var pdh = pd.getElement('.handle');

				pdc.innerHTML = prompt("Please enter your new text for this box, or press Okay to keep the current text.", pdc.innerHTML);
				pdh.innerHTML = prompt("Please enter your new title for this box, or press Okay to keep the current text.", pdh.innerHTML);
				while(pdh.innerHTML == ''){
				   pdh.innerHTML = prompt("A title is required for this element.  Please enter a title here.", pdh.innerHTML);;
				}
			}
		}

	},
	update: function(o) { this.div.getElement('.handle').innerHTML = o.index + hurricane_frame_num; },
});
/*
var TextUnHiddenWindow = new Class({
	Extends: TextWindow,
	initialize: function() {
		this.type='text_NoHide';
		this.parent();
   }
});
*/

var ClockWindow = new Class({
	Extends: Window,
	timeToString: function(d)
	{
   	// Obselete
		return d.getFullYear() + '.' + (1+d.getMonth()) + '.' + (d.getDate()) + '.' + (d.getHours()) + '.' + (d.getMinutes());
	},
	stringToTime: function(s)
	{
   	// Obselete
		var arr = s.split('.');
		return new Date(parseInt(arr[0]), parseInt(arr[1])-1, parseInt(arr[2]), parseInt(arr[3]), parseInt(arr[4])).getTime();
	},
	initialize: function() {
   	//alert("Initializing clock!");
		this.type='clock';
		this.id = 'clockX_X';
		this.parent(undefined, 'Clock');
		this.trashable = false;
		this.time = 20;
		
		if(typeof editing != 'undefined') {
		 this.div.getElement(".infohandle").getElement(".icon").onmouseup = function()
		 { 
			var pd = this.parentNode.parentNode; //this.parent_div;
			var pdc = pd.getElement('.content');			
			var pdh = pd.getElement('.handle');
			var c = pd.classpointer;
			
			var new_time = prompt("Please enter the time limit for this page in minutes.", c.time);
			//prompt("Please enter the start time for data on this page. ('Year.Month.Day.Hour.Minute')", c.timeToString(new Date(c.starttime)) );
			//var new_end = prompt("Please enter the end time for data on this page. ('Year.Month.Day.Hour.Minute')", c.timeToString(new Date(c.endtime)) );
			
			c.time = new_time;
			//c.time = c.stringToTime(new_start);
			//c.endtime   = c.stringToTime(new_end);
		 }
	   }		
	},
	update: function(o) 
	{
	   return;
	},
});

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

// Object Window
var nameTable = {};
var ObjectWindow = new Class({
	Extends: Window,
	initialize: function(experiment,nobjSrc) {

      this.experiment = experiment;
		this.type='object';
		this.parent(undefined,'Object Window');
		this.trashable = false;

		//this.div.getElement(".content").innerHTML = "This is some sample text. Press the Info Button to edit me.";
		//this.div.getElement(".content").style.padding = "3px 3px";

      this.objSourceBase = (nobjSrc==null) ? "(null)" : nobjSrc;

      var owThis = this;

      function getInstanceCount(name){
         if( nameTable[name] === undefined ){
            nameTable[name] = 0;
            return 0;
         }
         else return ++nameTable[name];
      }

      function genContent(){
         var content = owThis.div.getElement(".content");
         function mkObjStr(src,name,dir){
            //var objStr = "<object class='obj' data='" + src + "'/>";
            //return objStr;
            var object = document.createElement("object");
                object.class = 'obj';
                object.data  = src;
            return object;
         }
         function mkSwfStr(src,name,dir){
            //var swfStr = "<object class='obj' data='" + src + "' type='application/x-shockwave-flash'>"
            //           + "<param name='wmode' value='transparent'/>"
            //           + "<a href='http://www.adobe.com/go/getflash'>"
            //           + "<img src='http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player'/></a>"
            //           + "</object>";
            //return swfStr;
            var object = document.createElement("object");
                object.class = 'obj';
                object.data  = src;
                object.type  = 'application/x-shockwave-flash';
                object.innerHTML = "<a href='http://www.adobe.com/go/getflash'>"
                                 + "<img src='http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player'/></a>";
                object.appendChild(mkParam('wmode','transparent'));
            return object;
         }
         function mkJarStr(src,name,dir){
            //var jarStr = "<object type='application/x-java-applet' class='obj' id='javaobj'>"
            //           + "<param name='type' value='application/x-java-applet'/>" 
            //           + "<param name='code' value='" + name + ".class'/>" 
            //           + "<param name='codebase' value='" + dir + "'/>" 
            //           + "<param name='archive' value='" + name + ".jar'/>" 
            //           + "<param name='scriptable' value='true'/>" 
            //           + "</object>";
            //return jarStr;
            var object = document.createElement("object");
                object.class = 'obj';
                object.id    = 'javaobj';
                //object.data  = src;
                object.type  = 'application/x-java-applet';
                object.innerHTML = "[Failed to load]";
                object.standby   = "[Loading]... Please wait...";
                object.appendChild(mkParam('classid','java:'+name+'.class'));
                object.appendChild(mkParam('code',src));
                object.appendChild(mkParam('codebase',dir));
                object.appendChild(mkParam('archive',name + '.jar'));
                object.appendChild(mkParam('mayscript','true'));
                object.appendChild(mkParam('scriptable','true'));
            return object;
         }
// <WEBGL> - by Jordan
         function mkWebGLStr(src,name,dir){

            var object = document.createElement("div");
                object.class = 'webgl';
                object.id    = 'webglobj';
                object.innerHTML = "";

                // Create Canvas to render WebGL context on
                var c = document.createElement('canvas');
                c.setAttribute('class','webgl');
                c.setAttribute('id','webgl_canvas');
                object.appendChild(c);

                // Run WebGL script
                var s = document.createElement('script');
                s.setAttribute('type','text/javascript');
                s.setAttribute('src',src);
//alert(src);
                object.appendChild(s);

                object.standby   = "[Loading]... Please wait...";
            return object;
         }
// </WEBGL>
         function mkClsStr(src,name,dir){
            //var ClsStr = "<iframe><object classid='java:" + name + ".class' type='application/x-java-applet' class='obj' id='javaobj'>"
            //           + "<param name='codebase' value='" + dir + "'/>" 
            //           + "<param name='scriptable' value='true'/>" 
            //           + "</object></iframe>";
            //return ClsStr;

            var object = document.createElement("object");
                object.class = 'obj';
                object.id    = 'javaobj';
                //object.data  = src;
                object.type  = 'application/x-java-applet';
                object.innerHTML = "[Failed to load]";
                object.standby   = "[Loading]... Please wait...";
                object.appendChild(mkParam('classid','java:'+name+'.class'));
                object.appendChild(mkParam('code',src));
                object.appendChild(mkParam('codebase',dir));
                object.appendChild(mkParam('mayscript','true'));
                object.appendChild(mkParam('scriptable','true'));
            return object;
         }mkSpyLib = mkClsStr;
         if(owThis.objSourceBase === "(null)"){
            content.innerHTML = "[No content loaded]";
            owThis.objType = "none";
         }else{
            content.innerHTML = "";
            //content.adopt(mkObj("assets/userObjects/" + owThis.objSourceBase));
            var fields = owThis.objSourceBase.split(".");
            var suffix = fields[fields.length-1];
            var name = owThis.objName = owThis.objSourceBase.substr(0,owThis.objSourceBase.length-suffix.length-1);
            var srcDir = "assets/userObjects/";
            var objSrc = srcDir + owThis.objSourceBase;
            if(fields.length != 0){
               switch(suffix){
                  case 'swf':
                     //content.innerHTML = mkSwfStr(objSrc,name,srcDir);
                     owThis.styleObject = owThis.contentObject = mkSwfStr(objSrc,name,srcDir);
                     content.appendChild(owThis.contentObject);
                     owThis.objType = "swf";
                     break;
                  case 'jar':
                     //content.innerHTML = mkJarStr(objSrc,name,srcDir);
                     owThis.styleObject = owThis.contentObject = mkJarStr(objSrc,name,srcDir);
                     content.appendChild(owThis.contentObject);
                     //var ifr = document.createElement("iframe");
                     //    content.appendChild(ifr);
                     //    ifr.scrolling   = 'no';
                     //    ifr.frameborder = '0';
                     //    ifr.contentDocument.body.appendChild(owThis.contentObject);
                     //owThis.styleObject = ifr;
                     //owThis.contentObject.style.width='100%';
                     //owThis.contentObject.style.height='100%';
                     //owThis.contentObject.style.position='relative';
                     //owThis.objType = "jar";
                     break;
// <WEBGL> - Jordan - registers .js files as webgl scripts
                  case 'js':
                     owThis.styleObject = owThis.contentObject = mkWebGLStr(objSrc,name,srcDir);
                     content.appendChild(owThis.contentObject);
                     owThis.objType = "webgl";
                     break;
// </WEBGL>
                  case 'class':
                     //content.innerHTML = mkClsStr(objSrc,name,srcDir);
                     //owThis.contentObject = mkClsStr(objSrc,name,srcDir);


                     owThis.styleObject = owThis.contentObject = mkClsStr(objSrc,name,srcDir);
                     content.appendChild(owThis.contentObject);

                     /*
                     owThis.contentObject = mkClsStr(objSrc,name,srcDir);
                     owThis.styleObject   = document.createElement("div");
                     content.appendChild(owThis.styleObject);
                     owThis.styleObject.appendChild(owThis.contentObject);
                     */
                     
                     /*
                     var ifr = document.createElement("iframe");
                         content.appendChild(ifr);
                         ifr.scrolling   = 'no';
                         ifr.frameborder = '0';
                         ifr.marginwidth = ifr.marginheight = "0";
                         ifr.contentDocument.body.appendChild(owThis.contentObject);
                     owThis.styleObject = ifr;
                     owThis.contentObject.style.width='100%';
                     owThis.contentObject.style.height='100%';
                     owThis.contentObject.style.position='relative';
                     */
                     
                     owThis.objType = "class";
                     break;
                  case 'html':
                     //content.innerHTML = mkObjStr(objSrc,name,srcDir);
                     owThis.styleObject = owThis.contentObject = mkObjStr(objSrc,name,srcDir);
                     content.appendChild(owThis.contentObject);
                     owThis.objType = "html";
                     break;
                  default:
                     //content.innerHTML = mkObjStr(objSrc,name,srcDir);
                     owThis.styleObject = owThis.contentObject = mkObjStr(objSrc,name,srcDir);
                     content.appendChild(owThis.contentObject);
                     owThis.objType = "other";
                     break;
               }
            }else{
                     content.innerHTML = mkObjStr(objSrc,name,srcDir);
            }
            //owThis.contentObject = content.getElement(".obj");
            //owThis.contentObject = content.getElementsByTagName("OBJECT")[0];
            owThis.styleObject.style.width    = "100%";
            owThis.styleObject.style.height   = "90%";
            owThis.styleObject.style.position = "absolute";
            //owThis.styleObject.style.zIndex = "0";

            switch(owThis.objType){
               case "jar":
               case "class":
                  var appname = owThis.objName + "_" + getInstanceCount(owThis.objName); 
                  owThis.contentObject.setName(appname);
                  owThis.contentObject.name = appname;

                  //alert(owThis.contentObject.Packages.java.lang.Thread.currentThread().getName());

//                  var nspyEQ = document.getElementById('spyObj').mkSpyEQ(appname);
//                  var toolkit = owThis.contentObject.Packages.java.awt.Toolkit.getDefaultToolkit();
//                  toolkit.getSystemEventQueue().push(nspyEQ);
                  try{
                     document.getElementById('spyObj').attachSpyTo(appname);

                     //owThis.contentObject.firePropertyChange("gogogadgetthreadhook",1748.8471,1830.0381);
                  }catch(e){
                     alert(e);
                  }
                  break;
               default:
                  break;
            }
         }
      }

      genContent();

      if(typeof editing != 'undefined') {
         this.div.getElement(".infohandle").getElement(".icon").onmouseup = function() { 

            var cb = function(asset) {
               owThis.objSourceBase = asset;
               owThis.objSourceBase = owThis.objSourceBase.trim();
               genContent();

            }

            openAssetPopup('applets', cb);

         }
      }

   },
	//update: function(o) { this.div.getElement('.handle').innerHTML = o.index + hurricane_frame_num; },
   update: function(o) { },
});


var InteractiveTableWindow = new Class({
   Extends: Window,
   initialize: function(experiment, file)
   {
      this.table = new Element('table');
      this.experiment = experiment;
		this.file = file == null ? '' : file;
		this.type='ext_table';
		this.parent(undefined,'InteractiveTable');

      this.border = '1';

      this.fromFile();

      var myself = this;
            
      if(typeof editing != 'undefined') {
         this.div.getElement(".infohandle").getElement(".icon").onmouseup = function(){ 

            var pd = this.parentNode.parentNode.getElement('.content');
            var pdh = this.parentNode.parentNode.getElement('.handle');
            var file = "";
            var pdChild = pd.getChildren();
            pdChild = pdChild[0];
         
            var cb = function(asset) {

               file = asset;
               pdh.innerHTML = prompt("Please enter your new title for this box, or press Okay to keep the current text.", pdh.innerHTML);
               while(pdh.innerHTML == ''){
                  pdh.innerHTML = prompt("A title is required for this element.  Please enter a title here.", pdh.innerHTML);;
               }

               myself.fromFile(file);
            }

            openAssetPopup('image_tables', cb);

         }
      }
   
   },
   fromFile: function(file){
      if(file != null) this.file = file;

//      this.table = new Element('table');
      this.table.setAttribute('class', 'dynaview_ext_table');
      this.table.tabID = this.file+"_";
      this.table.setAttribute('id', this.tabID);
      this.table.innerHTML = "";

      this.table.style.width="100%";
      this.table.style.height="90%";
      this.table.style.position="absolute";
      this.table.style.top="1em";

      this.toTrack = [];

      ext_table_parser(this.experiment,this.file,this.div.id);
      var data = ext_table_data[this.file];

      var rhead = data.row_header;
      var r_N   = data.num_rows;
      var chead = data.col_header;
      var c_N   = data.num_cols;
      var User_tableID = data.tabID;

      //var mkCell = function(label,eventID,tabID){
      var mkTD = function(cell){
          var tdel = new Element('td');
          /*
          if(eventID != ""){
             tdel.onmouseup = function(){
               var sig = document.createEvent("Event");
                   sig.tabID   = tabID;
                   sig.eventID = eventID;
                   //sig.initEvent(eventID,true,true);
                   sig.initEvent("ImageWindowEvent",true,true);
               document.dispatchEvent(sig);
             }

          }
          */
          tdel.style.padding = tdel.style.margins = "0";
          tdel.style.textalign = "center";
          if(cell['com'] != ""){
             tdel.style.cursor = "pointer";
             tdel.onmouseup = function(){
               var sig = document.createEvent("Event");
                   sig.signal    = "mouseup"
                   sig.tabID   = User_tableID;
                   sig.com     = cell.com;
                   sig.cargs   = cell.cargs;
                   sig.initEvent("ImageWindowEvent",true,true);
               toHandle = null;
               document.dispatchEvent(sig);
             }
             tdel.onmousedown = function(){
               var sig = document.createEvent("Event");
                   sig.signal    = "mousedown"
                   sig.tabID   = User_tableID;
                   sig.com     = cell.com;
                   sig.cargs   = cell.cargs;
                   sig.initEvent("ImageWindowEvent",true,true);
               toHandle = this;
               document.dispatchEvent(sig);
             }
             tdel.onmouseover = function(){
                this.oldbgcolor = this.style.backgroundColor;
                this.style.backgroundColor = "#FFFFFF";
             }
             tdel.onmouseout = function(){
                this.style.backgroundColor = this.oldbgcolor;
             }

          }else{
             tdel.style.cursor = "crosshair";
          }
          tdel.style.fontSize = 16*(window.scaleW/55.0);
          tdel.innerHTML = '<center>' + cell.label + '</center>';

          return tdel;
      }

      /*
      var rhead_html = new Element('tr');
          rhead_html.fontSize = 16*(window.scaleW/55.0);
      for(int i=0; i < r_N; ++i){
         var td = mkCell(rhead[i],"",this.tabID);
         rhead_html.adopt(td);
      }
      this.table.adopt(rhead_html);
      */

      for(var j=0; j < r_N; ++j){
         var tr = new Element('tr');
             tr.fontSize = 16*(window.scaleW/55.0);
         for(var i=0; i < c_N; ++i ){
            var cell = data[c_N*j + i];
            //var td = mkCell(cell.label,cell.eventID,this.file);
            var td = mkTD(cell);
            td.id = "x_toTrackExtTable_" + this.table.tabID + j + "_" + i;
            if(j*i==0){
               td.style.fontWeight="600";
               td.style.fontStyle="Oblique";
            }
            td.style.border="inherit";
            tr.adopt(td);
            this.toTrack.push(td);
         }
         this.table.adopt(tr);
      }

      this.content.adopt(this.table);

      //mkUnselectable(this.content);
      mkUnselectable(this.div);

   },
});

var TableWindow = new Class({
   Extends: Window,
   initialize: function(experiment, file)
   {
      this.file = file == null ? '' : file;
      this.type='table';
      this.parent(undefined,'Table');
      if (true)//typeof editing != 'undefined')
      {	
         // If we get here, the user is performing an actual experiment
         // Insert the actual table
         this.table  = new Element('table');
         this.table.setAttribute('class', 'dynaview_table');
         this.table.setAttribute('id', file+"_");
         this.border = '1';
         //this.table.setAttribute('fontSize',16*(window.scaleW/55.0))+"px";
			
			
         //alert(this.div.id);
         table_parser(experiment, this.file, this.div.id);

         var data = table_data[this.file];
			
         for(var i=0; i < data.length; i+=1)
         {
            var tr = new Element('tr');
            this.table.adopt(tr);
            tr.style.fontSize = 16*(window.scaleW/55.0);
				
            for(var j=0; j < data[i].length;j+=1)
            {
               var td = new Element('td');
               tr.adopt(td);
               td.style.fontSize = 16*(window.scaleW/55.0);
               td.innerHTML = '<center>' + data[i][j] + '</center>';
            }
         }
			
					
         if(typeof editing != 'undefined')
         {
            this.div.getElement(".infohandle").getElement(".icon").onmouseup = function()
            { 
               var pd = this.parentNode.parentNode.getElement('.content');
               var pdh = this.parentNode.parentNode.getElement('.handle');
               var file = "";
               var pdChild = pd.getChildren();
               pdChild = pdChild[0];
               var i;
               var curFile = "";
               for(var i=0; i < updatables.length; i+=1)
               {		
                  var w = updatables[i];
                  if(w.type == 'table')
                  {
                     if(pd === w.content)
                     {
                        curFile = w.file;
                     }
                  }
               }
               
            /*
               file = prompt("Please enter the name of the table file that you wish to use.", curFile);
               pdh.innerHTML = prompt("Please enter your new title for this box, or press Okay to keep the current text.", pdh.innerHTML);
				   
				
               for(var i=0; i < updatables.length; i+=1)
               {		
                  w = updatables[i];
                  if(w.type == 'table'){
                     if(pd === w.content){
                        w.file = file;
                        //pdChild = new Element('table');
                        pdChild.setAttribute('class', 'dynaview_table');
                        pdChild.setAttribute('id', w.file+"_");
                        pdChild.innerHTML = "";
                        table_parser(experiment, w.file, pdChild.id);
                        var data = table_data[w.file];
                        for(var i=0; i < data.length; i+=1){
                           var tr = new Element('tr');
                           pdChild.adopt(tr);
                           for(var j=0; j < data[i].length;j+=1){
                              var td = new Element('td');
                              tr.adopt(td);
                              td.innerHTML = '<center>' + data[i][j] + '</center>';
                           }
                        }
                     }
                  }
               }
*/

var cb = function(asset) {
file = asset;

				   
				
               for(var i=0; i < updatables.length; i+=1)
               {		
                  w = updatables[i];
                  if(w.type == 'table'){
                     if(pd === w.content){
                        w.file = file;
                        //pdChild = new Element('table');
                        pdChild.setAttribute('class', 'dynaview_table');
                        pdChild.setAttribute('id', w.file+"_");
                        pdChild.innerHTML = "";
                        table_parser(experiment, w.file, pdChild.id);
                        var data = table_data[w.file];
                        for(var i=0; i < data.length; i+=1){
                           var tr = new Element('tr');
                           pdChild.adopt(tr);
                           for(var j=0; j < data[i].length;j+=1){
                              var td = new Element('td');
                              tr.adopt(td);
                              td.innerHTML = '<center>' + data[i][j] + '</center>';
                           }
                        }
                     }
                  }
               }

               pdh.innerHTML = prompt("Please enter your new title for this box, or press Okay to keep the current text.", pdh.innerHTML);
			   	while(pdh.innerHTML == ''){
				   pdh.innerHTML = prompt("A title is required for this element.  Please enter a title here.", pdh.innerHTML);;
				}

}

openAssetPopup('tables', cb);
            }
         }
		
         this.content.adopt(this.table);		
      }
   },
});

//////////////////////////////////////////
// ICONS
//////////////////////////////////////////

function addEventListenerRec(root, type, listener, useCapture){
   root.addEventListener(type,listener,useCapture);
   for(var i=0; i < root.childNodes.length; ++i)
      addEventListenerRec(root.childNodes[i],type,listener,useCapture);
}

function addClassRec(root,classname){
   if(root.classList == undefined) return;
   root.classList.add(classname);
   for(var i=0; i < root.childNodes.length; ++i)
      addClassRec(root.childNodes[i],classname);
}

function chIdRec(root,nid){
   if(root.setAttribute == undefined) return;
   root.setAttribute('id',nid);
   for(var i=0; i < root.childNodes.length; ++i)
      chIdRec(root.childNodes[i],nid);
}

var newdiv;
// Icon to go on the toolbar
var ToolbarIcon = new Class({
	initialize: function(_image, type, draggable, description) {
		
		// Setup the image
      this.description = description;
		this.image = 'assets/images/'+_image;

      /*
		this.el = document.createElement('img');
      this.el.className = 'toolbarIcon';
		this.el.src   = this.image;
		this.el.title = this.description;
      */
      if( type == 'trash' ){
         this.el = document.createElement('div');
         this.el.title = this.description;
         var img = document.createElement('img');
             img = document.createElement('img');
             img.className = 'toolbarIcon';
             img.src   = this.image;
             img.title = this.description;
         var label = document.createElement('span');
             label.innerHTML = 'Drag Here to Delete';
             label.style.textAlign='justify';
             label.style.verticalAlign='middle';

         //this.el.appendChild(img);
         //this.el.appendChild(label);
         var tr = document.createElement('tr');
         var td1 = document.createElement('td');
             td1.appendChild(img);
             td1.style.verticalAlign='middle';
         var td2 = document.createElement('td');
             td2.appendChild(label);
             td2.style.verticalAlign='middle';
         tr.appendChild(td1);
         tr.appendChild(td2);

         var bd = '1px solid black';
         td1.style.borderLeft   = bd;
         td1.style.borderTop    = bd;
         td1.style.borderBottom = bd;
         td2.style.borderRight  = bd;
         td2.style.borderTop    = bd;
         td2.style.borderBottom = bd;

         td1.style.position = "relative";
         td2.style.position = "relative";
         td1.style.width   = "50%";
         td2.style.width   = "50%";
         tr.style.width    = "100%";
         
         this.el.appendChild(tr);
         this.el.appendChild(document.createElement('hr'));
             
      }else{
         this.el = document.createElement('img');
         this.el.className = 'toolbarIcon';
         this.el.src   = this.image;
         this.el.title = this.description;
      }
		
		//this.el.candrag = draggable !== undefined;
		this.el.candrag = draggable;
		
		this.el.onmousedown = function(event) 
		{ 
			if(this.candrag)
			{
				// Create the new toolbar and the dragging functionality.
				var tb2;
				
				if( type == 'text_window') tb2 = new TextWindow();
				else if( type == 'text_nohide_window') tb2 = new TextWindow(false);
				else if( type == 'object_window') tb2 = new ObjectWindow();
				else if( type == 'clock_window') tb2 = new ClockWindow();
				else if( type == 'table_window') tb2 = new TableWindow();
				else if( type == 'ext_table_window') tb2 = new InteractiveTableWindow();
				else if( type == 'image_window') tb2 = new ImageWindow();

				newdiv = tb2.div;
				newdiv.style.top = event.pageY + "px"; 
				newdiv.style.left = event.pageX + "px";
				
				// A bit of a hack...
				document.onmousemove = function(e) { 
					newdiv.style.top = e.pageY + "px"; 
					newdiv.style.left = e.pageX + "px"; 
					this.onmouseup = function(e) { this.onmousemove = this.onmouseup = null; } 
				};
				
				// Cancel dragging the image most likely.
				event.preventDefault(); 
			}
			else { event.preventDefault(); }
		};
	}
});

var ToolbarIcon_Trashbin = new Class({
	Extends: ToolbarIcon,
	initialize: function() {
		this.parent('/toolbar/glyph_trash.png', 'trash', false, 'Drag here to delete');
		//this.el.setAttribute('class','trashbin');
		//this.el.classList.add('trashbin');
      addClassRec(this.el,'trashbin');
		//this.el.setAttribute('id', 'trashBinToDeleteWindows_55555');
      chIdRec(this.el,'trashBinToDeleteWindows_55555');
	}
});

var ToolbarIcon_ImageWindow = new Class({
	Extends: ToolbarIcon,
	initialize: function() {
		this.parent('/toolbar/glyph_image.png', 'image_window', true, 'Create Image');
	}
});

var ToolbarIcon_TextWindow = new Class({
	Extends: ToolbarIcon,
	initialize: function() {
		this.parent('/toolbar/glyph_text.png', 'text_window', true, 'Create Text');
	}
});

var ToolbarIcon_TextWindow_NoHide = new Class({
	Extends: ToolbarIcon,
	initialize: function() {
		this.parent('/toolbar/glyph_text_nohide.png', 'text_nohide_window', true, 'Create Text (Always Visible)');
	}
});

var ToolbarIcon_ClockWindow = new Class({
	Extends: ToolbarIcon,
	initialize: function() {
		this.parent('/toolbar/glyph_clock.png', 'clock_window', true, 'Create Clock');
	}
});

var ToolbarIcon_ObjectWindow = new Class({
	Extends: ToolbarIcon,
	initialize: function() {
		this.parent('/toolbar/glyph_object.png', 'object_window', true, 'Create HTML5/Java/SWF Object');
	}
});

var ToolbarIcon_TableWindow = new Class({
	Extends: ToolbarIcon,
	initialize: function() {
		this.parent('/toolbar/glyph_table.png', 'table_window', true, 'Create Table');
	}
});

var ToolbarIcon_ext_TableWindow = new Class({
	Extends: ToolbarIcon,
	initialize: function() {
		this.parent('/toolbar/glyph_interactivetable.png', 'ext_table_window', true, 'Create Interactive Table');
	}
});

function update_stuff(el)
{
	var content = 'Location: ' + el.getPosition()['x'] + ' , ' + el.getPosition()['y'] + '<br/>';
	content += 'Size: ' + el.getSize().x + ' , ' + el.getSize().y;
}

var save_all = function()
{
	var save_string = '';
	var saveName = prompt("Please enter a name to save this file as", "");
	var windows_added_so_far = 0;
	
	var pos = new Array();
	//alert("Starting!");
	
	for(var i=0; i < updatables.length; i+=1)
	{		
		var w = updatables[i];
		if(w.type == 'toolbar') { continue; } // Don't save toolbars
		if(w.div.getElement('.handle') == null) { continue; }
		
		//
		var type = str_to_hex(w.type);
		
		//
		var title = str_to_hex(w.div.getElement('.handle').innerHTML);
		
		//
		pos = findPos(w.div);
		var top_left_x = pos[0]/window.scaleW;
		var top_left_y = pos[1]/window.scaleH;
		// Edited by Jon to support resizing
		var window_width = w.get_width()/window.scaleW;
		var window_height = w.get_height()/window.scaleH;		
		var rect = str_to_hex( top_left_x.toString() ) + ',' + str_to_hex( top_left_y.toString() ) + ',' + str_to_hex( window_width.toString() ) + ',' + str_to_hex( window_height.toString() );
		//alert(rect);
		
		//
		save_string += type + ',' + title + ',' + rect + ',';
		
		
		if(w.type == 'text' || w.type == 'text_nohide')
		{
			save_string += str_to_hex(w.div.getElement('.content').innerHTML);
		}
		else if(w.type == 'table')
		{
			save_string += str_to_hex(w.file);
		}
		else if(w.type == 'ext_table')
		{
          save_string += str_to_hex(w.file);
        }
		else if(w.type == 'image')
		{
          save_string += str_to_hex(w.def_imgbase);
          //alert(w.tableLink);
          save_string += ',' + str_to_hex(w.tableLink);
        }
		else if(w.type == 'object')
		{
          save_string += str_to_hex(w.objSourceBase);
        }
	    else if(w.type == 'clock')
	    {
   	      save_string += w.time;
	    }
		
		save_string += '&';
	}
	
	// Clip off the last extra '&'
	save_string = save_string.substring(0,save_string.length-1);
	
	// Send var myHTMLRequest = new Request.HTML({url:'load/'}).get({'user_id': 25});
	//var filepath = 'expResources/advisory/'+experiment_shortname+'_training_adv_'+pageadvnum+'.txt';
	//$assetBaseDir = "./admins/" . $username . "/assets/";
	//var filepath = 'expResources/advisory/'+saveName+'.txt';
	var filepath = assetDir + "training/" + saveName + '.txt';
	alert(filepath);
	 
	//alert("just before: " + filepath);
	var req = new Request({
		url: 'assets/php/save_training.php', 
		async: false, method: 'post', 
		data: {
			'num': pageadvnum, 
			'file_path': filepath,
			'data_string': save_string
			}, 
		onComplete: function(r) { } 
	}).send();
	
	alert(req);
}

window.addEvent('domready', function()
{
	var ifr = document.createElement("div");
	ifr.style.display = 'none';
	ifr.innerHTML = '<img id="HM" src="assets/images/hurricane_map_1.png" />';
	document.body.appendChild(ifr);

	if(typeof editing != 'undefined')
	{
    	var tb = new Toolbar();
   	tb.add_icon(new ToolbarIcon_Trashbin());
   	tb.add_icon(new ToolbarIcon_TextWindow());
   	tb.add_icon(new ToolbarIcon_TextWindow_NoHide());
   	tb.add_icon(new ToolbarIcon_ObjectWindow());
   	tb.add_icon(new ToolbarIcon_ImageWindow());
   	tb.add_icon(new ToolbarIcon_ClockWindow());
   	tb.add_icon(new ToolbarIcon_TableWindow());
   	tb.add_icon(new ToolbarIcon_ext_TableWindow());
   }
   
   // Take away the resizing and dragging if not in edit mode
	for(var i=0;i<updatables.length;++i)
	{
	   if(updatables[i].type != 'toolbar'){
   	   updatables[i].dragobj.droppables[0] = document.getElementById('trashBinToDeleteWindows_55555');
	   }			
	}
   
});
