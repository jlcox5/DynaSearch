<?php
   include("assets/php/config.php");
   include("assets/php/std_api.php");
   require_once("assets/php/db_util.php");
   
   // Create empty error log for the page
   $_SESSION['log'] = Array();
   
   mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");
	
	$notice = "";
	
   
      /////////////////////////////////////////////////
      // Get the title and content
      /////////////////////////////////////////////////
   $username = $_SESSION['username'];
   $expId    = $_SESSION['userExpId'];
	
   // Save Questionnaire Results
   if ( isset($_POST['qResults']) )
   {
      $qResults = $_POST['qResults'];
      $query = "UPDATE t_user_output " .
               "SET QuestOutput=IFNULL(CONCAT(QuestOutput, '$qResults'), '$qResults') " .
               "WHERE User_ID='$username' AND Experiment_ID='$expId';";
      mysql_query($query);
      redirect("advance.php");
   }

      // Get our current page.
      $result = query_db('select * from t_user where User_ID=\''. $username .'\'');
      $row = mysql_fetch_array($result, MYSQL_BOTH);
      $current_position = $row['current_position'];
   
      // Get Experiment Data
      $expData = $_SESSION['expData'];
      $expPageData = $expData[ $current_position-1 ];
      $qId = $expPageData['source'];
      $pageTitle = $expPageData['title'];

      // Current Questionaire
      $query = "SELECT * FROM sur_question " .
               "WHERE id='$qId';";
      $result  = mysql_query($query);
      if( $result )
      {
         $row = mysql_fetch_assoc($result);
         $qName  = $row['Name'];
         $qData  = $row['Value'];
      }

	/////////////////////////////////////////////////
    
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


   //$_SESSION['curQ'] = "";
	
   // Page Header and Nav Bar Setup
   $page_title = "DynaSearch";
   $template_style_array  = array('style.css', "accordian.css");
   $template_script_array = array("accordian.js", "questionnaire.js", "question.js");
   include("assets/php/standard.php");
?>

<body>
   <div id="maincontainer">
      <center><h1>DynaSearch</h1></center>
      <br/>
      <table id="two_column_opening"> <!-- Begin main page columns  -->
         <td width="50%">
            Please fillout the following questionaire.  The areas can be expanded by clicking on the respective titlebars.

            <?php echo $notice; ?>

            <div name="questContainer">
               <div id="accordion">
                  <div id="newQuest"></div>
               </div>
            </div>
            <button type="button" onClick="submitQuest();">Submit</button>
            <br/>
            <br/>

         </td>
      </table> <!-- End main page columns  -->
   </div>
   <script type="text/javascript">
      var PAGE_TITLE = <?php echo json_encode($pageTitle); ?>,
          Q_DATA     = <?php echo json_encode($qData); ?>;
   </script>

</body>
</html>
