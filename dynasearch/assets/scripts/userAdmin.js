function validate() {
  // var availabilityTag = $("availabilityTag");
alert("test");
   /*var request = new Request({
      method    : 'post',
      url       : 'db_util.php',
      onSuccess : function(response) {
         availabilityTag.set('html', response);
      }
   });

   request.send();*/
}

var checkAvailability = function() {

   var availabilityTag = $("availabilityTag");
   var saveButton = $("saveButton");
   var userId    = $("pId").get("value");
   var params    = new Array('User_ID', userId);
   var request = new Request({
      method    : 'post',
      url       : './assets/php/db_util.php',
      data      : {
         'query'  : 'select',
         'table'  : 't_user',
         'params' : params,
         'ret'    : 'User_ID'
      },
      onSuccess : function(response) {

         if (response == userId) {
            // ID exists, not available
            availabilityTag.set('html', 'Not Available');
            availabilityTag.setProperty('style', 'color:red;');
            saveButton.setProperty('disabled', 'disabled');

         } else {
            // ID does not exist, available
            availabilityTag.set('html', 'Available');
            availabilityTag.setProperty('style', 'color:green;');
            saveButton.setProperty('disabled', '');
         }
      }
   });

   saveButton.setProperty('disabled', 'disabled');
   request.send();
}

var changeExp = function() {

   var conf = confirm("Are you sure you want to assign a different experiment?\n\nIf you save this change, the participants progress will be reset.");

   if (conf) {
      var expDisplay = $("expDisplay");
      expDisplay.setProperty('style', "display:none;");

      var expSelect = $("pExps");
      expSelect.removeProperty("hidden");

      var pProgress = $("pProgress");
      pProgress.setProperty("value", "0");
   }
}

var resetExpInfo = function() {

   var expDisplay = $("expDisplay");
   expDisplay.removeProperty('style');

   var expSelect = $("pExps");
   expSelect.setProperty("hidden", "hidden");

}

