<?php
    $no_login_required = 'yay';
    $errorMsg = "";
    
    include("assets/php/config.php");
    include("assets/php/std_api.php");
    $con = mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
    mysql_select_db($DB_NAME) or die("Unable to select database.");
	
    //if(isset($_POST['doneWithPage'])){
    //   redirect("logOut.php");
    //}
	$result = mysql_query("SELECT * FROM sur_randquestion;");
	$_SESSION['numQuest'] = count($result);
    $page_title = "Questionnaire";
    $style_file = "style.css";
	
    $template_style_array  = array($style_file, "questEditor.css", "accordian.css");
    $template_script_array = array("accordian.js", "randQuestEditor.js");
	
    #include("assets/php/standard.php");

    // Question should be saved
    if(isset($_POST['save'])){
	   //echo var_dump($_POST['desig']);
	   //echo var_dump($_POST['toSave']);
	   if(isset($_POST['desig']) && isset($_POST['toSave'])){
	      $desig = $_POST['desig'];
	      $text = $_POST['toSave'];
	      $sql = mysql_query("INSERT INTO sur_randquestion SET Designator='$desig', Value='$text';");
	   }
    }
	
    include('assets/php/standard.php');

?>

<body onLoad="constructQuestion();">
<div id="drag_cont">
<div id="maincontainer">
<center><h1>DynaView</h1></center>
<br/>
<table id="two_column_opening"> <!-- Begin main page columns  -->
<td width="50%">
Use this editor to create questions that will be used frequently.  They can be added to questionnaires through the Questionnaire Editor.

<form action="randQuestEditor.php" id="rand_question_editor" name="rand_question_editor" method="post">
   <div id="accordion">
      <div id="newQuest">

      </div>
   </div>
</form>
</td>
</table> <!-- End main page columns  -->
</div>
   <div id="drag_me">
      <div id="drag_me_handle"><span>Question Constructor</span></div>
      <div id="questInfo"></div>
   </div>
</div>
</body>
</html>
