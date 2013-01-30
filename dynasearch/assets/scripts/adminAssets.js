var confirmDelete = function() {
   return confirm("Are you sure you want to delete this asset?\n(This action cannot be undone)");
}
/*
$$("form.assetForm").submit(function() {
alert("works");
   return false;
});*/

var previewAsset = function(type) {

   var asset        = $(type + "Select").value;
   //alert(asset);
   var assetPreview = $(type + "Preview");

   switch (type) {
   case "images" :
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
            alert(arr['fileSize']);
            assetPreview.set('html', arr['fileContent']);
         }
      }).send();;

   }

}

var saveAsset = function(type) {

   var asset        = $(type + "Select").value;
   //alert(asset);
   var assetPreview = $(type + "Preview");

   switch (type) {
   case "images" :
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
            alert(arr['fileSize']);
            assetPreview.set('html', arr['fileContent']);
         }
      }).send();;

   }

}
