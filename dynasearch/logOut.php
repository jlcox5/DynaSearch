<?php 
	include("assets/php/config.php");
    include("assets/php/std_api.php");
	 mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
    mysql_select_db($DB_NAME) or die("Unable to select database.");
	
	$_SESSION['logged_in'] = 'false';
	if( isset($_SESSION)) {	session_destroy(); }
	
	$page_title = "DynaSearch";
	$style_file = "style.css";
	
	$template_style_array  = array($style_file);
	//include("assets/php/standard.php");

	// Code to prevent backtracking
   //checkPage(5);

?>
<head>
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
      <tr>Thank you for participating!  You have successfully logged out.</tr>
   </table>
</form>
<br/> <br/>

</td>
</table> <!-- End main page columns  -->
</div>
</body>
</html>
