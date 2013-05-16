<?php
   require_once('assets/php/std_api.php');
   require_once('assets/php/config.php');

   $page_title = "DynaSearch";
   $template_style_array = array("style.css");
   $no_login_required = 'yay';

   // Check if still logged in
   if( isset($_SESSION['logged_in']) )
   {
      if( $_SESSION['logged_in'] == 'true' )
      {

         switch( $_SESSION['User_Type'] ) {
         case 'A' :
            redirect('admin.php');
            break;

         case 'U' :
            redirect('director.php');
            break;


         }
/*
         if( $_SESSION['User_Type'] == 'A' )
         {
            redirect('admin.php');
         }
         else
         {
            redirect('director.php');
         }*/
      }

   }


   // Check for password reset
   if( isset($_GET['reset']) )
   {
      $resetToken = $_GET['reset'];
      echo $resetToken;
/*
      if( $_SESSION['logged_in'] == 'true' )
      {
         if( $_SESSION['User_Type'] == 'A' )
         {
            redirect('admin.php');
         }
         else
         {
            redirect('director.php');
         }
      }
*/

   }

   include("assets/php/standard.php");
	
	// Code to prevent backtracking
	//checkPage(0);

?>
 <style type="text/css">

      .form-signin {
        max-width: 300px;
        padding: 19px 29px 29px;
        margin: 0 auto 20px;
        background-color: #fff;
        border: 1px solid #cdcdcd;
        -webkit-border-radius: 5px;
           -moz-border-radius: 5px;
                border-radius: 5px;
        -webkit-box-shadow: 0 2px 3px rgba(0,0,0,.5);
           -moz-box-shadow: 0 2px 3px rgba(0,0,0,.5);
                box-shadow: 0 2px 3px rgba(0,0,0,.5);
      }
      .form-signin .form-signin-heading,
      .form-signin .checkbox {
        margin-bottom: 10px;
      }
      .form-signin input[type="text"],
      .form-signin input[type="password"] {
        font-size: 16px;
        height: auto;
        margin-bottom: 15px;
        padding: 7px 9px;
      }

    </style>
<body>
   <div id="maincontainer">
      <center><h1>DynaSearch</h1></center>
      <br/>

            <form class="form-signin" action="assets/php/user.php" id="login_form" method="post">
               <h2 class="form-signin-heading">Please provide your login information</h2>
   <?php
      if( isset($_GET['error']) )
      {
         if($_GET['error'] == 'wrong_pass')
         {
            echo '<h3 style="color: red;">Incorrect Password.</h3>';
         }
      }
   ?>
               <input type="hidden" name="user_action" value="login" />
               <input name="username" type="text" placeholder="User ID" onKeyDown="if(event.keyCode == 13) $('login_form').submit();"/>
               <input name="password" type="password" placeholder="Password" onKeyDown="if(event.keyCode == 13) $('login_form').submit();"/>
               <br/>
               <button class="button-blue" type="submit">Login</button>
               <br/>
               <br/>
               <!-- Commented out on 21JAN13 by Jon -->
               <a href="#">Having trouble logging in?</a>
            </form>

            <br/>



   </div>
</body>
</html>
