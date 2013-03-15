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
   //var params    = new Array('User_ID', userId);
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
         var arr    = JSON.decode(response);  

         if (arr.length > 0) {
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

var sendEmail = function() {

   //var emailBox = $('emailBox');
   var recipient = $('emailRecipient'),
       subject   = $('emailSubject'),
       mailmsg   = $('emailMessage'),
       sender    = $('emailSender');

   var request = new Request({
      method    : 'post',
      url       : './assets/php/send_email.php',
      data      : {
         'email_op'  : 'send',
         'recipient' : recipient,
         'subject'   : subject,
         'message'   : mailmsg,
         'sender'    : sender
      },
      onSuccess : function(response) {
/*
         var arr    = JSON.decode(response);  

         if (arr.length > 0) {
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
*/
alert(response);
         new mBox.Notice({
            type    : 'ok',
            content : "Email Sent!"
         });
      }
   }).send();

}

var showEmailPopup = function() {

   var emailBox = new mBox.Modal({
      title   : 'Send Email to Participant?',
      content : 'emailBox',
      width   : '800px',
      height  : '450px',
      overlay : true,
      closeOnBodyClick : false,
      buttons : [
         { title : 'Cancel',
           event : function() {
              new mBox.Notice({
                 type    : 'info',
                 content : "Email Canceled"
               });
              this.close();
           },
         },
         { title : 'Submit' ,
           event : function() { sendEmail(); this.close(); },
           addClass : 'button_green' }
      ],
   }).open();

   //emailBox.open();

}

