// Dollar Bill Slider Function

// http://atomgiant.com/2006/05/30/resize-images-with-javascript/
//function resize(which, max) {
//  var elem = document.getElementById(which);
//  if (elem == undefined || elem == null) return false;
//  if (max == undefined) max = 100;
//  if (elem.width > elem.height) {
//    if (elem.width > max) elem.width = max;
//  } else {
//    if (elem.height > max) elem.height = max;
//  }
//}

function test() { 
   var str = ($('resizable1').width / 8.6) + '';
   //$('resizable1').height = $('resizable1').width * (6.6294 / 15.5956);
   document.getElementById('scaleW').value = $('resizable1').width/8.6;
   document.getElementById('scaleH').value = $('resizable1').height/5.5;
   document.getElementById('numbers').innerHTML = document.getElementById('scaleW').value + " " + document.getElementById('scaleH').value + " is your scale";
}

window.addEvent('domready', function() {
   $('resizable1').makeResizable();
   $('resizable1').addEvent('resize', test);
});