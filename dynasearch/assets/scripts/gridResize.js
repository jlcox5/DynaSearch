// Resize Grid

function resizeGrid(scaleW, scaleH) {
   document.getElementById('grid').height =  parseInt(5*scaleH);
   document.getElementById('grid').width = parseInt(5*scaleW);
   alert(document.getElementById('grid').height + " " + document.getElementById('grid').width + " " + scaleW + " " + scaleH);
}

function resizeBorder(scaleW, scaleH) {
   //document.getElementById('maincontainer').style.height = 20*scaleH+'px';
   //document.getElementById('maincontainer').style.width = parseInt(20*scaleW)+'px';
   //document.getElementById('maincontainer').style.padding = "0 0";
   //document.getElementById('maincontainer').style.background = "#4f4f4f";
   //alert(scaleW + " " + scaleH);
}

window.onload=function() {
   resizeBorder(window.scaleW, window.scaleH);
}