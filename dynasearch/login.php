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
         if( $_SESSION['User_Type'] == 'A' )
         {
            redirect('admin.php');
         }
         else
         {
            redirect('director.php');
         }
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

<body>
   <div id="maincontainer">
      <center><h1>DynaSearch</h1></center>
      <br/>
      <table id="two_column_opening"> <!-- Begin main page columns  -->
         <td width="50%">
            Please provide your login information:

            <form action="assets/php/user.php" id="login_form" method="post">
               <input type="hidden" name="user_action" value="login" />
               <table>
   <?php
      if( isset($_GET['error']) )
      {
         if($_GET['error'] == 'wrong_pass')
         {
            echo '<tr><h3 style="color: red;">Incorrect Password.</h3></tr>';
         }
      }
   ?>
                  <tr>
                     <td width="125px" class="input_prompt">User Name</td>
                     <td><input name="username"  onKeyDown="if(event.keyCode == 13) $('login_form').submit();"/></td>
                  </tr>

                  <tr>
                     <td class="input_prompt">Password</td>
                     <td><input name="password" type="password" onKeyDown="if(event.keyCode == 13) $('login_form').submit();"/></td>
                  </tr>

                  <tr>
                     <td><button type="submit">Login</button></td>
                  </tr>
               </table>
            </form>
            <br/>
            <br/>

<!-- Commented out on 21JAN13 by Jon -->
<!-- <a href="#">Having trouble logging in?</a> -->

         </td>
         <td>
<!-- Commented out on 21JAN13 by Jon -->
<!-- DynaSearch is a system for (...) -->
         </td>
      </table> <!-- End main page columns  -->
   </div>
</body>
</html>
