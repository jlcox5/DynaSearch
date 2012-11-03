<?php
    include("assets/php/config.php");
    include("assets/php/std_api.php");
    mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
    mysql_select_db($DB_NAME) or die("Unable to select database.");
	
    if(isset($_POST['doneWithPage'])){
       redirect("logOut.php");
    }

    $_SESSION['curQ'] = "";

	//var_dump($_POST);
    if(isset($_POST['qLoad']) && ($_POST['qLoad']!="")){
       $toGet = $_POST['qChoice'];
       $return = mysql_query("SELECT Value FROM sur_question WHERE Name='$toGet';");
       $choice = mysql_fetch_array($return);
       //var_dump($choice);
       //var_dump($choice['Value']);
       $_SESSION['curQ'] = $choice['Value'];
    }
	
	$page_title = "Questionnaire";
	$style_file = "style.css";
	
	$template_style_array  = array($style_file, "accordian.css", "slideBar.css");
	$template_script_array = array("accordian.js", "slideBar.js");
	
	include("assets/php/standard.php");

	// Code to prevent backtracking
   // checkPage(4);

?>

<body>
<div id="maincontainer">
<center><h1>DynaView</h1></center>
<br/>
<table id="two_column_opening"> <!-- Begin main page columns  -->
<td width="50%">
Please fillout the following questionaire.  The areas can be expanded by clicking on the respective titlebars.

<form action="" id="question_form" method="post">

   <div id="accordion">
      <?php
         echo($_SESSION['curQ']);
         $return = mysql_query("SELECT Name FROM sur_question;");
         echo('<select name="qChoice" id="qChoice">');
         while($qNames = mysql_fetch_array($return)){
            $toPrint = $qNames['Name'];
            echo('<option value="'.$toPrint.'">'.$toPrint.'</option>');
         }
         echo('</select>');
         echo('<input type="submit" id="qLoad" name="qLoad" value="Load" />');
      ?>
   </div>
</form>
<br/> <br/>

</td>
</table> <!-- End main page columns  -->
</div>
</body>
</html>
