<?php
   include("assets/php/config.php");
   include("assets/php/std_api.php");

   mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");
	
   $_SESSION['logged_in'] = 'false';
   if( isset($_SESSION) )
   {
      session_destroy();
   }
	
   $page_title = "DynaSearch";
   $style_file = "style.css";
	
   $template_style_array  = array($style_file);

   if( isset($_GET['error']) )
   {
      $error = $_GET['error'];
   }
   else
   {
      $error = '';
   }

?>
<head>
   <link href='http://fonts.googleapis.com/css?family=Josefin+Sans:300,400,700' rel='stylesheet' type='text/css'>
	<link href="assets/style/style.css" rel="stylesheet" type="text/css" />
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
	<title>DynaSearch</title>
</head>

<body>
   <div id="maincontainer">
      <center><h1>DynaSearch</h1></center>
      <br/>
      <table id="two_column_opening"> <!-- Begin main page columns  -->
         <td width="50%">

            <form action="" id="question_form" method="post">
               <table>
                  <tr>
   <?php
      switch( $error )
      {
      case 'exp_unassigned' :
         echo 'You are not currently assigned an experiment. You have been logged out.';
         break;

      case 'exp_dne' :
         echo 'The experiment you have been assigned does not exist. Please contact your administrator.';
         break;

      default :
         echo 'Thank you for participating!  You have successfully logged out.';
      }
   ?>
                  </tr>
               </table>
            </form>
            <br/><br/>

            <a href='login.php'>Return to login screen</a>

         </td>
      </table> <!-- End main page columns  -->
   </div>
</body>
</html>
