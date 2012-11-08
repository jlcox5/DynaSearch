var rowIndex = 0;
var cellIndex = 0;
var nTable = "";
var nRows = 0;
var nCells = 0;

function findPos(obj){
   var left = !!obj.offsetLeft ? obj.offsetLeft : 0;
   var top = !!obj.offsetTop ? obj.offsetTop : 0;

   while(obj = obj.offsetParent){
      left += !!obj.offsetLeft ? obj.offsetLeft : 0;
      top += !!obj.offsetTop ? obj.offsetTop : 0;
   }
   return[left, top];
}
    
function coverTable(tableName){
   nTable = document.getElementById(tableName);
   nRows = nTable.rows.length;
   nCells = nTable.rows[0].cells.length;
   var pos = new Array();
   var canvas = '';
   alert('booooom');
   document.getElementById('holdCanvas').innerHTML += '<div id="table1">';
   for (i=0; i<nRows; i++){
      for (n=0; n<nCells; n++){
         pos = findPos(nTable.rows[i].cells[n]);
         document.getElementById('holdCanvas').innerHTML += '<canvas id="'+tableName+i+'_'+n+'" onmousedown="showCell(\''+tableName+'\','+i+','+n+', event)" style="position: absolute; left:'+pos[0]+'px; top:'+pos[1]+'px;"></canvas>';
         canvas = document.getElementById(tableName+i+'_'+n);
         canvas.width = nTable.rows[i].cells[n].offsetWidth;
         canvas.height = nTable.rows[i].cells[n].offsetHeight;
	  }
   }
   document.getElementById('holdCanvas').innerHTML += '</div>';
   var ctx;
   for (i=0; i<nRows; i++){
      for (n=0; n<nCells; n++){
         canvas = document.getElementById(tableName+i+'_'+n);
         ctx = canvas.getContext("2d");
         ctx.fillStyle = "rgb(255,255,255)";
         ctx.fillRect(1,1, canvas.width-1, canvas.height-1);
	  }
   }	    
}
    
function showCell(tableName, i, n, event){
   startTimer(event);
   cell = document.getElementById(tableName+i+'_'+n);
   cell.style.visibility = "hidden";
   //alert("here!");
}
    
function hideCell(tableName, i, n, event){
   endTimer(event);
   cell = document.getElementById(tableName+i+'_'+n);
   cell.style.visibility = "visible";
}