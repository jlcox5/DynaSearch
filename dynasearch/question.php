<?php
    include("assets/php/config.php");
    include("assets/php/std_api.php");
    require_once("assets/php/db_util.php");
    mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
    mysql_select_db($DB_NAME) or die("Unable to select database.");
	
	$notice = "";
	
   
      /////////////////////////////////////////////////
      // Get the title and content
      /////////////////////////////////////////////////
      $username = $_SESSION['username'];
	
      // Get our current page.
      $result = query_db('select * from t_user where User_ID=\''. $username .'\'');
      $row = mysql_fetch_array($result, MYSQL_BOTH);
      $current_position = $row['current_position'];
   
      $questName = hexToStr( getExpPageProperty($current_position-1, "src") );

      // Current Questionaire
      $query = "SELECT Value FROM sur_question WHERE Name='".mysql_real_escape_string($questName)."'";
      $result  = mysql_query($query);
      if($result){
         $assoc = mysql_fetch_assoc($result);
         $quest  = $assoc['Value'];
      }
      //echo hexToStr($quest);

	/////////////////////////////////////////////////


   if(isset($_POST['doneWithPage'])){
      //$questName = "Test5"; // TODO
      $fileToOpen ="./userData/".$_SESSION['username'].".txt";
      //$handle = fopen($fileToOpen, 'a+');

      $resultStr = $questName . ":";
	   
	   // Test to make sure questions are actually answered
	   $quest_finished = TRUE;
      /*
	   $numQuestions = (int)$_POST['numQuest'];
	   for($i=0; $i<$numQuestions; $i++){
	     if($_POST[$curQuest] == ""){
		   $quest_finished = FALSE;
		   $notice = "<p> Please note that all fields must be filled out before preceding to the next screen. </p>";
		 }
	   }
      */

      if($quest_finished == TRUE){
         if($_SESSION['hwSet'] == 0){
            //TODO : DO WE NEED THIS?
            $width = $_SESSION['scaleW'];
            $height = $_SESSION['scaleH'];
            //fwrite($handle, $_SESSION['scaleW']);
            //fwrite($handle, ", ");
            //fwrite($handle, $_SESSION['scaleH']);
            //fwrite($handle, ", ");
            $_SESSION['hwSet'] = 1;
         }
	   
	     //$numQuestions = (int)$_POST['numQuest'];
         $Questions = explode(" ",$_POST['questions']);
        /*
	     for($i=0; $i<$numQuestions; $i++){
		    $curQuest = 'q'.$i;
		    $_POST[$curQuest] = str_replace(',', '`', $_POST[$curQuest]);
	        fwrite($handle, $_POST[$curQuest]);
	        if($i+1 < $numQuestions){
		      fwrite($handle, ", ");
	        }
         }
         */
         for($i=0; $i<count($Questions); $i++){
            $curQuest = $Questions[$i];
            $_POST[$curQuest] = str_replace(',', '`', $_POST[$curQuest]);
            //fwrite($handle, $_POST[$curQuest]);          // OLD
            $resultStr = $resultStr . $_POST[$curQuest]; // NEW
            if($i+1 < count($Questions)){
               //fwrite($handle, ", ");             // OLD
               $resultStr = $resultStr . ", ";    // NEW
            }
         }

         //fclose($handle);
         $username  = $_SESSION['username'];
         $userExpId = $_SESSION['userExpId'];
         $resultStr = mysql_real_escape_string($resultStr . '&');
         $query = "UPDATE t_user_output " .
                  "SET QuestOutput=IFNULL(CONCAT(QuestOutput, '$resultStr'), '$resultStr') " .
                  "WHERE User_ID='$username' AND Experiment_ID='$userExpId';";
         mysql_query($query);
	 redirect("advance.php");
	   }
    }
    
    // Are we supposed to be here?
   if(isset($_SESSION['page_sig'])) {
   	if($_SESSION['page_sig'] != 'question.php') {
		redirect('assets/php/user.php?logout=true');
	}
   }
   else
   {
   	redirect('assets/php/user.php?logout=true');
   }


   $_SESSION['curQ'] = "";
	
	$page_title = "DynaSearch";
	$style_file = "style.css";
	
	$template_style_array  = array($style_file, "accordian.css");
	$template_script_array = array("accordian.js", "questEditor.js");
	
	include("assets/php/standard.php");

	// Code to prevent backtracking
   //checkPage(4);

?>

<body onLoad="constructQuestion(true)">
<div id="maincontainer">
<center><h1>DynaSearch</h1></center>
<br/>
<table id="two_column_opening"> <!-- Begin main page columns  -->
<td width="50%">
Please fillout the following questionaire.  The areas can be expanded by clicking on the respective titlebars.

<?php echo $notice; ?>

<form id='To_Load'>
   <input type='hidden' id='currentQuestStr' value="<?php echo $quest; ?>" />
   <input type='hidden' id='questStr' value="" />
</form>
<script type="text/javascript">
/*
   function mkQuest(){
      //var qStr = document.forms['To_Load'].elements['questStr'].value.trim();
      //parseQuestionnaireString(qStr);

      constructQuestion();
      var qC = document.getElementsByName('questContainer')[0];
      qC.appendChild(theQuest.genElement(true));
      //
      doAccordions();
   }
   var script = document.createElement('script');
       script.type   = 'text/javascript';
       script.src    = 'assets/scripts/questEditor.js';
       script.onreadystatechange =
       script.onload             = mkQuest;

   document.getElementsByTagName('head')[0].appendChild(script);
   //document.addEventListener('domready',mkQuest);
*/
</script>

<form action="" id="question_form" method="post">

   <div name="questContainer">
                  <div id="accordion">
                     <div id="newQuest">
      <?php // echo $page_content; ?>
   </div>
   <input type="submit" id="doneWithPage" name="doneWithPage" value="Submit" />
</form>
<br/> <br/>

</td>
</table> <!-- End main page columns  -->
</div>
</body>
</html>
