// Grabs the time an element has been clicked on

// Dreaded global variables!!!!
var startTime = 0.0;
var endTime = 0.0;
var clickNum = 0;
var runningExp = 0;
var id;

var rowIndex = 0;
var cellIndex = 0;
var nTable = "";
var nRows = 0;
var nCells = 0;
var tableNum = 0;
var cRow;
var cCol;
var curAdv;

function submitPageWithInput(){

   // Check if user really wants to submit
   if ( confirm('Are you sure you want to leave this page?') ) {
      document.getElementById("pageFinished").value = 'true';
      document.forms[0].submit();
   }
}

function startPageTimer(pageTime, j, id){
    runningExp = 0;

    if(j < parseInt(pageTime)*60){    
       j++;
       setTimeout("startPageTimer("+pageTime+","+j+","+id+");", 1000);
       updatables[id].div.getElement('.content').innerHTML =  "You have " + parseInt( (parseInt(pageTime)*60-j)/60 ) + ":" + (parseInt(pageTime)*60-j)%60 + " remaining.";
    }
    else{
       stopPageTimer();
    }
       //alert("You have " + pageTime + " minutes to finish this page.");
    
    //setTimeout("stopPageTimer();", parseInt(pageTime)*60*1000);
}

function stopPageTimer(){
   runningExp = 1;
   alert("Your time has expired for this page.");
   submitPageWithInput(); 
}

function startTimer(event){
   //alert("In function: startTimer");
   //alert(event.win);
   if(runningExp == 0){
	   event.preventDefault();
	   var today = new Date();
	   startTime = today.getTime();
	   id = event.target.id;
//alert(event.target.get('class'));
	   id = (event.tdid==undefined)?event.target.id:event.tdid;
   }
}

function startTimerAlt(nid){
   if(nid == undefined)return;
   if(runningExp==0){
	   var today = new Date();
	   startTime = today.getTime();
      id = nid;
   }
}

function registerClick(cid,ctime){
   //alert("In function: registerClick");
   clickNum = clickNum + 1;
	   document.getElementById('clickData').innerHTML += "<input type='hidden' id='clickNum" + clickNum + "' name='clickNum" + clickNum + "' value= " + clickNum + " /> <input type='hidden' id='elemId" + clickNum + "' name='elemId" + clickNum + "' value= " + cid + " /> <input type='hidden' id='clickTime" + clickNum + "' name='clickTime" + clickNum + "' value= " + ctime/1000 + "/>";
	   document.getElementById('totalClicks').innerHTML=  "<input type='hidden' id='totalClicks' name='totalClicks' value=" + clickNum + " />";
}

function endTimer(event){
	//Cell Data
	//alert("In function: endTimer");
	
	if(runningExp == 0){
	 if(id.substring(0,15) == 'x_toTrackTable_'){
	   hideCell(id, 0, 0, event);
	   clickNum = clickNum + 1;
       event.preventDefault();
	   var today = new Date();
	   endTime = today.getTime();
	   var newTime = endTime - startTime;
	   //document.getElementById('timerInfo').innerHTML = "<p>You have clicked on " + id + " for " + newTime/1000 + " seconds.</p><p>Start click: " + startTime + " End click: " + endTime;
	   document.getElementById('clickData').innerHTML += "<input type='hidden' id='clickNum" + clickNum + "' name='clickNum" + clickNum + "' value= " + clickNum + " /> <input type='hidden' id='elemId" + clickNum + "' name='elemId" + clickNum + "' value= " + id + " /> <input type='hidden' id='clickTime" + clickNum + "' name='clickTime" + clickNum + "' value= " + newTime/1000 + "/>";
	   document.getElementById('totalClicks').innerHTML=  "<input type='hidden' id='totalClicks' name='totalClicks' value=" + clickNum + " />";
	 }
	 //Other Element
	 else if(id.substring(0,14) == 'x_toTrackText_'){
	   clickNum = clickNum + 1;
	   hideText(id, event);
       event.preventDefault();
	   var today = new Date();
	   endTime = today.getTime();
	   var newTime = endTime - startTime;
	   //document.getElementById('timerInfo').innerHTML = "<p>You have clicked on " + id + " for " + newTime/1000 + " seconds.</p><p>Start click: " + startTime + " End click: " + endTime;
	   document.getElementById('clickData').innerHTML += "<input type='hidden' id='clickNum" + clickNum + "' name='clickNum" + clickNum + "' value= " + clickNum + " /> <input type='hidden' id='elemId" + clickNum + "' name='elemId" + clickNum + "' value= " + id + " /> <input type='hidden' id='clickTime" + clickNum + "' name='clickTime" + clickNum + "' value= " + newTime/1000 + "/>";
	   document.getElementById('totalClicks').innerHTML=  "<input type='hidden' id='totalClicks' name='totalClicks' value=" + clickNum + " />";
	 }
	 else if(id.substring(0,18) == 'x_toTrackExtTable_'){
	   clickNum = clickNum + 1;
	   event.preventDefault();
	   var today = new Date();
	   endTime = today.getTime();
	   var newTime = endTime - startTime;
	   document.getElementById('clickData').innerHTML += "<input type='hidden' id='clickNum" + clickNum + "' name='clickNum" + clickNum + "' value= " + clickNum + " /> <input type='hidden' id='elemId" + clickNum + "' name='elemId" + clickNum + "' value= " + id + " /> <input type='hidden' id='clickTime" + clickNum + "' name='clickTime" + clickNum + "' value= " + newTime/1000 + "/>";
	   document.getElementById('totalClicks').innerHTML=  "<input type='hidden' id='totalClicks' name='totalClicks' value=" + clickNum + " />";
    }
	
	// WebGL - Detect clicks, added by Jordan
	else if (id.substring(0,12) == 'webgl_canvas') {
		clickNum = clickNum + 1;
		var today = new Date();
		endTime = today.getTime();
		var newTime = endTime - startTime;
		document.getElementById('clickData').innerHTML += "<input type='hidden' id='clickNum" + clickNum + "' name='clickNum" + clickNum + "' value= " + clickNum + " /> <input type='hidden' id='elemId" + clickNum + "' name='elemId" + clickNum + "' value= " + id + " /> <input type='hidden' id='clickTime" + clickNum + "' name='clickTime" + clickNum + "' value= " + newTime/1000 + "/>";
		document.getElementById('totalClicks').innerHTML=  "<input type='hidden' id='totalClicks' name='totalClicks' value=" + clickNum + " />";
    }

    //else{
    //   alert("event not handled : " + event.target.id + " : " + id);
    //}
	 //document.configSize.submit();
   }
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

function attachTimerFuncs(iTable,tabName){
   for(var i=0; i < iTable.toTrack.length; ++i){
      var td = iTable.toTrack[i];
      td.addEventListener("mousedown"
                         //,function(e){if(e.target.nodeName!="TD"){e.target=td;alert("wot");}startTimer(e);}
                         //,function(e){e.tdid=this.id;startTimer(e);}
                         ,function(e){e.preventDefault();e.stopImmediatePropagation();startTimerAlt(this.id);}
                         ,true);
   }
}
    
function coverTable(grabTable,tableName){
   nTable = document.getElementById(grabTable);
   nRows = nTable.rows.length;
   nCells = nTable.rows[0].cells.length;
   var pos = new Array();
   var canvas = '';
   toInsPar = document.getElementById("body");
   
   //alert('Rows: '+nRows+'  Cells: '+nCells);
   for (i=0; i<nRows; i++){
      for (n=0; n<nCells; n++){
         pos = findPos(nTable.rows[i].cells[n]);
         canvas = document.createElement('CANVAS');
         canvas.setAttribute('style.zIndex', 100);
         canvas.setAttribute('id', 'x_toTrackTable_'+tableName+i+'_'+n);
         canvas.setAttribute('width', nTable.rows[i].cells[n].offsetWidth);
         canvas.setAttribute('height', nTable.rows[i].cells[n].offsetHeight);
         canvas.setAttribute('style', 'position: absolute; left:'+pos[0]+'px; top:'+pos[1]+'px;');
         canvas.setAttribute('onmousedown', "showCell(\'"+tableName+'\','+i+','+n+', event)');
         toInsPar.appendChild(canvas);
         //toAdd += '<canvas id="x_toTrackTable_'+tableName+i+'_'+n+'" onmousedown="showCell(\''+tableName+'\','+i+','+n+', event)" style="visibility: visible; z-index: 100; position: absolute; left:'+pos[0]+'px; top:'+pos[1]+'px;"></canvas>';
	  }
   }
   

   for (i=1; i<nRows; i++){
      for (n=1; n<nCells; n++){
         canvas = document.getElementById('x_toTrackTable_'+tableName+i+'_'+n);
         canvas.style.zIndex=100;
         canvas.width = nTable.rows[i].cells[n].offsetWidth;
         canvas.height = nTable.rows[i].cells[n].offsetHeight;
      }
   }         
   var ctx;
   for (i=1; i<nRows; i++){
      for (n=1; n<nCells; n++){
         canvas = document.getElementById('x_toTrackTable_'+tableName+i+'_'+n);
         ctx = canvas.getContext("2d");
         ctx.fillStyle = "rgb(255,255,255)";
         ctx.fillRect(1,1, canvas.width-1, canvas.height-1);
	  }
   }
}

function coverText(textName,h){
   nText = document.getElementById(textName);
   var canvas = '';
   var toAdd = '';
   var toInsPar = '';
   var toInsBef = '';
   var pos = new Array();
   pos = findPos(nText);

   canvas = document.createElement('CANVAS');
   canvas.setAttribute('style.zIndex', 100);
   canvas.setAttribute('id', 'x_toTrackText_'+textName);
   canvas.setAttribute('width', nText.offsetWidth);
   canvas.setAttribute('height', nText.offsetHeight);
   canvas.setAttribute('style', 'position: absolute; left:'+pos[0]+'px; top:'+pos[1]+'px;');
   canvas.setAttribute('onmousedown', "showText(\'"+textName+"\', event)");
   
   toInsPar = document.getElementById("body");
   toInsPar.appendChild(canvas);
   
   //alert(canvas.id + " " + pos[0] + " " + pos[1] + " " + canvas.style.zIndex);
   
   var ctx;
   ctx = canvas.getContext("2d");
   ctx.fillStyle = "rgb(255, 255, 255)";
   ctx.fillRect(1, 1, canvas.width-1, canvas.height-1);
}

function showText(textName, event){
   if(runningExp == 0){
      startTimer(event);
      toShow = document.getElementById('x_toTrackText_'+textName);
      toShow.style.visibility = "hidden";
   }
}

function hideText(textName, event){
   toHide = document.getElementById(textName);
   toHide.style.visibility = "visible";
}
    
function showCell(tableName, i, n, event){
   if(runningExp == 0){
      startTimer(event);
      cRow = i;
      cCol = n;
      cell = document.getElementById('x_toTrackTable_'+tableName+i+'_'+n);
      cell.style.visibility = "hidden";
   }
}
    
function hideCell(tableName, i, n, event){
   cell = document.getElementById(id);
   cell.style.visibility = "visible";
}
