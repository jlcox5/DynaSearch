var confirmDelete = function() {
   return confirm("Are you sure you want to delete this asset?\n(This action cannot be undone)");
}
/*
$$("form.assetForm").submit(function() {
alert("works");
   return false;
});*/


var makeFileSizeStr = function(size) {
   var i     = -1; 
   var units = ['kB', 'MB', 'GB'];
   do {
      size = size / 1024;
      ++i;
   } while (size >= 1024);
   return Math.max(size, 0.1).toFixed(1) + ' ' + units[i];
}


var previewAsset = function(type) {

   var asset        = $(type + "Select").value;
   var assetPreview = $(type + "Preview");
   var assetFileSize = $(type + "FileSize");
   $(type + "SelectedAsset").value = asset;

   switch (type) {
   case "images" :
      assetPreview.setProperty('src', assetDir + asset);
      var request = new Request({
         method    : 'post',
         url       : './assets/php/file_util.php',
         data      : {
            'fileop'   : 'read',
            'filepath' : assetDir + asset
         },
         onSuccess : function(response) {
            var arr = JSON.decode(response);
            //alert(arr['fileSize']);
            assetFileSize.set('html', makeFileSizeStr( arr['fileSize'] ) );
         }
      }).send();
      break;

   default :

      var request = new Request({
         method    : 'post',
         url       : './assets/php/file_util.php',
         data      : {
            'fileop'   : 'read',
            'filepath' : assetDir + asset
         },
         onSuccess : function(response) {
            var arr = JSON.decode(response);
            //alert(response);
            //alert(arr['fileSize']);
            assetFileSize.set('html', makeFileSizeStr( arr['fileSize'] ) );
            assetPreview.value = arr['fileContent'];
            assetPreview.setProperty('disabled', '');
            $(type + "SaveBtn").setProperty('disabled', '');
            $(type + "SaveAsBtn").setProperty('disabled', '');
         }
      }).send();;

   }

}


var newAsset = function(type) {

   var assetPreview = $(type + "Preview");

   if( (assetPreview == "") ||
       (confirm('Are you sure you want to make a new asset?\n\nAll changes since your last save will be lost.')) ) {

      $(type + "SaveBtn").setProperty('disabled', 'disabled');
      $(type + "SaveAsBtn").setProperty('disabled', '');
      $(type + "Preview").setProperty('disabled', '');
      assetPreview.value = "";
   }

}


var saveAsset = function(type) {

   var asset        = $(type + "SelectedAsset").value;
   var assetPreview = $(type + "Preview");

   //alert(assetPreview.value);

   switch (type) {
   case "images" :

      break;

   default :

      var request = new Request({
         method    : 'post',
         url       : './assets/php/file_util.php',
         data      : {
            'fileop'   : 'write',
            'filepath' : assetDir + asset,
            'contents' : assetPreview.value
         },
         onSuccess : function(response) {
            //var arr = JSON.decode(response);
            alert("File saved!\n\n" + asset);
            //assetPreview.set('html', arr['fileContent']);
         }
      }).send();

   }

}


var saveAssetAs = function(type) {

   var newAsset = prompt("Please enter the name to save as.\n This must be different than the original's name.", "");

   if (newAsset) {
      var request = new Request({
         method    : 'post',
         url       : './assets/php/file_util.php',
         data      : {
            'fileop'   : 'exists',
            'filepath' : (assetDir + type + '/' + newAsset)
         },
         onSuccess : function(response) {
            var arr    = JSON.decode(response);
            var exists = arr['exists'];
            if (exists) {
               saveAssetAs(type);
            } else {
               $(type + "SelectedAsset").value = type + '/' + newAsset;
               saveAsset(type);
               window.location.reload()
            }
         }
      }).send();
   }

}


window.addEvent('domready', function(){
  new Fx.Accordion($('accordion'), '#accordion h2', '#accordion .content');
});
