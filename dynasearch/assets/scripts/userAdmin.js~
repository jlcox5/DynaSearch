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


var resetPassword = function( pId ) {

   // Create Form
   var form = new Element('form');
   form.style.visibility = 'hidden';
   form.method = 'POST';

   var id = new Element('input');
   id.name = "pId";
   id.value = pId;
   form.adopt(id);
   
   var mode = new Element('input');
   mode.name = 'op';
   mode.value = 'resetPassword';
   form.adopt(mode);

   form.action = "userAdmin.php";
   document.body.adopt(form);
   form.submit();
   
}


var resetProgress = function( pId ) {

   // Create Form
   var form = new Element('form');
   form.style.visibility = 'hidden';
   form.method = 'POST';

   var id = new Element('input');
   id.name = "pId";
   id.value = pId;
   form.adopt(id);
   
   var mode = new Element('input');
   mode.name = 'op';
   mode.value = 'resetProgress';
   form.adopt(mode);

   form.action = "userAdmin.php";
   document.body.adopt(form);
   form.submit();
   
}


var changeExp = function() {

   var expSelectBox = new mBox.Modal({
      title   : 'Assign Experiment',
      content : 'expSelectBox',
      /*width   : '800px',
      height  : '450px',*/
      overlay : true,
      closeOnBodyClick : false,
      buttons : [
         { title : 'Cancel',
           /*event : function() {
              new mBox.Notice({
                 type    : 'info',
                 content : "Email Canceled"
               });
              this.close();
           },*/
         },
         { title : 'Assign' ,
           event : function() {
              this.close();
              var expSelect = $("pExps");
              var ndx = expSelect.selectedIndex;
              $("pExp").value = expSelect.value;
              $("expDisplay").set( 'html', expSelect[ndx].text );
              // sendEmail();

           },
           addClass : 'button-green' }
      ],
   }).open();
/*
   var conf = confirm("Are you sure you want to assign a different experiment?\n\nIf you save this change, the participants progress will be reset.");

   if (conf) {
      var expDisplay = $("expDisplay");
      expDisplay.setProperty('style', "display:none;");

      var expSelect = $("pExps");
      expSelect.removeProperty("hidden");

      var pProgress = $("pProgress");
      pProgress.setProperty("value", "0");
   }
*/
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
         { title : 'Send' ,
           event : function() { sendEmail(); this.close(); },
           addClass : 'button-green' }
      ],
   }).open();

   //emailBox.open();

}


var add_participant = function() {
   var form = new Element('form');
   form.action = 'userAdmin.php';
   form.style.visibility = 'hidden';
   form.method = 'POST';

   var op = new Element('input');
   op.name = 'op';
   op.value = 'add';
   form.adopt(op);

   var qId = new Element('input');
   qId.name = 'pId';
   qId.value = -1;
   form.adopt(qId);

   document.body.adopt(form);
   form.submit();
}

var load_participant = function() {
   var loadBox = new mBox.Modal({
      title   : 'Load Participant',
      content : 'load-participant',
      /*width   : '800px',
      height  : '450px',*/
      overlay : true,
      closeOnBodyClick : false,
      buttons : [
         { title : 'Cancel' },
         { title : 'Load' ,
           event : function() {
              this.close();
              var pSelect = $("aParticipants");
              var form = new Element('form');
              form.action = 'userAdmin.php';
              form.style.visibility = 'hidden';
              form.method = 'POST';

              var op = new Element('input');
              op.name = 'op';
              op.value = 'load';
              form.adopt(op);

              var qId = new Element('input');
              qId.name = 'pId';
              qId.value = pSelect.value;
              form.adopt(qId);

              document.body.adopt(form);
              form.submit();

           },
           addClass : 'button-green' }
      ],
   }).open();
}

var delete_participant = function() {
   var form = new Element('form');
   form.action = 'userAdmin.php';
   form.style.visibility = 'hidden';
   form.method = 'POST';

   var op = new Element('input');
   op.name = 'op';
   op.value = 'delete';
   form.adopt(op);

   form.adopt( $('pId') );

   document.body.adopt(form);
   form.submit();
}



