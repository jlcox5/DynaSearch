<?php

   /**
    * PASSWORD RESET PAGE
    */

   require_once('assets/php/std_api.php');
   require_once('assets/php/config.php');

   mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");

   $page_title = "Password Reset";
   $template_style_array = array("style.css", "reset_pwd.css");
   $no_login_required = 'yay';



/*
Example

http://localhost/dynasearch/dynasearch/login.php?token=test

*/

   if( isset($_GET['error']) )
   {
      $error = $_GET['error'];
   }
   else
   {
      if( isset($_GET['token']) )
      {
         $resetToken = $_GET['token'];
      }
      else
      {
         $resetToken = '';
         $error = 'invalid_token';
      }
   }


   include("assets/php/standard.php");

?>

<body>
   <div id="maincontainer">
      <center><h1>DynaSearch</h1></center>
      <br/>

            <form class="form-reset-pwd" action="assets/php/user.php" id="reset_form" method="post">
               <input type="hidden" name="user_action" value="reset" />
               <input type="hidden" name="token" value="<?php echo $resetToken; ?>" />
               <h2 class="form-signin-heading">Reset Password</h2>

   <?php

      if( $error )
      {
         //$error = $_GET['error'];


         switch( $error )
         {
            case 'invalid_token' :
               echo '<tr><h3 style="color: red;">Bad reset link.</h3></tr>';
               break;

            case 'expired_token' :
               echo '<tr><h3 style="color: red;">Link expired.</h3></tr>';
               break;

            default :
               break;
         }
      }
      else
      {
         echo '<input name="username" type="text" placeholder="User ID" onKeyDown="if(event.keyCode == 13) $(\'reset_form\').submit();"/>' .
              '<br/>' .
              '<input name="password" type="password" placeholder="New Password" onKeyDown="if(event.keyCode == 13) $(\'reset_form\').submit();"/>' .

              '<table>' .
                 '<tr>' .
                    '<td>' .
                       '<img id="captcha" src="assets/securimage/securimage_show.php" alt="CAPTCHA Image" />' .
                    '</td>' .
                    '<td>' .
                       '<object type="application/x-shockwave-flash" data="./assets/securimage/securimage_play.swf?bgcol=#ffffff&amp;icon_file=./assets/securimage/images/audio_icon.png&amp;audio_file=./assets/securimage/securimage_play.php" height="32" width="32">' .
                          '<param name="movie" value="./assets/securimage/securimage_play.swf?bgcol=#ffffff&amp;icon_file=./assets/securimage/images/audio_icon.png&amp;audio_file=./securimage_play.php" />' .
                       '</object> ' .
                       '<a href="#" onclick="document.getElementById(\'captcha\').src = \'assets/securimage/securimage_show.php?\' + Math.random(); return false">' .
                          '<img src="./assets/securimage/images/refresh.png" alt="Reload Image" height="32" width="32" onclick="this.blur()" align="bottom" border="0" />' .
                       '</a>' .
                       '<br/>' .
                       '<strong>Enter Code*:</strong><br />' .
                       '<input type="text" name="captcha_code" size="10" maxlength="6" />' .
                    '</td>' .
                 '</tr>' .
              '</table>' .

              '<input type="submit" name="reset" value="Reset" />';

      }


   ?>


            </form>
            <br/>
            <br/>

            <a href="login.php">Login</a>

   </div>
</body>
</html>
