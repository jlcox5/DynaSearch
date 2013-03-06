

var validatePassword = function( form ) {

   var newPassword      = form.getElementById('newPassword').value,
       newPasswordCheck = form.getElementById('newPasswordCheck').value;

   if (newPassword == newPasswordCheck) {

      return true;

      // Check password matches
      var oldPassword = form.getElementById('oldPassword').value;

      var params    = new Array('User_ID', ADMIN_ID);
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

            if (arr['UPassword'] == oldPassword) {
               // Old password is correct
               form.submit('changePassword');

            } else {
               // Old password is not correct
               alert("Old password is incorrect.");
            }
         }
      }).send();   

   } else {
      // Check password does not match
      alert("No Match");
   }

   return false;

}


var notice = undefined;
var setNotice = function(noticeType, noticeContent) {
   notice = { type: noticeType, content: noticeContent };
}

window.addEvent(
   'domready',
   function() {
      new Fx.Accordion($('accordion'), '#accordion h2', '#accordion .content',
         { alwaysHide : true, display : -1 } );

      if (notice) {
         new mBox.Notice( notice );
      }
//new mBox.Notice({ type: 'ok', content : 'Aagin' });
});


