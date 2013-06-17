<?php
   include("assets/php/config.php");
   include("assets/php/std_api.php");
   require_once("assets/php/db_util.php");
   mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");
   
   // Create empty error log for the page
   $_SESSION['log'] = Array();
   
   // Are we supposed to be here?
   $pageSignature = ifSetElse( $_SESSION['page_sig'] );
   if ( $pageSignature != 'custom_page.php' )
   {
      redirect('assets/php/user.php?logout=true');
   }
   
   // The Basics
   $username  = $_SESSION['username'];
   $userExpId = $_SESSION['userExpId'];
   $results   = ifSetElse( $_POST['results'] );
   
   // Check if results have been submitted
   if( $results )
   {
      $resultStr = $results . ',';
      $query = "UPDATE t_user_output " .
               "SET ClickOutput=IFNULL(CONCAT(ClickOutput, '$resultStr'), '$resultStr') " .
               "WHERE User_ID='$username' AND Experiment_ID='$userExpId';";
      mysql_query($query);
      redirect("advance.php");
	}
   

	/////////////////////////////////////////////////
	// Get the title and content
	/////////////////////////////////////////////////
	
   
   // Get our current page.
   $result = query_db('select * from t_user where User_ID=\''. $username .'\'');
   $row = mysql_fetch_array($result, MYSQL_BOTH);
   $current_position = $row['current_position'];
   
   // Get Experiment Data
   $expData = $_SESSION['expData'];
   $expPageData = $expData[ $current_position - 1 ];
   $cpId = $expPageData['source'];
   $pageTitle = $expPageData['title'];

   // Current Custom Page
   $query = "SELECT * FROM t_custom_pages " .
            "WHERE ID='$cpId';";
   $result  = mysql_query($query);
   if( $result )
   {
      $row = mysql_fetch_assoc($result);
      $cpName  = $row['Name'];
      $cpData  = $row['Data'];
   }
   
   // Page Setup
   $page_title = "DynaSearch";
   $template_style_array  = array("style.css", "editor.css");
   $template_script_array = array("ajax-core.js", "wz_jsgraphics.js", "timer_bb.js", "timer.js", "hurricane-unisys-parser.js", 'dsToolbarIcon.class.js', 'dsWindow.class.js',  'dsCustomPage.class.js', "custom_page.js");
   include('assets/php/standard.php');
?>

<!-- <body id="body" onmousedown="startTimer(event)" onmouseup="endTimer(event)"> -->
<body id="body">

   <div id='maincontainer'>
      <div id='custom-page'></div>
      <br/>
      
      <button id="doneWithPage" onClick="submit_page();">Done</button>
    
   </div>

   <script type="text/javascript">
      CP_ID   = <?php echo json_encode($cpId); ?>;
      CP_NAME = <?php echo json_encode($cpName); ?>;
      CP_DATA = <?php echo json_encode($cpData); ?>;
      
      PAGE_NAME = <?php echo json_encode($pageTitle); ?>;
      
      WINDOW_SCALE_X = <?php echo json_encode($_SESSION['scaleW']); ?>;
      WINDOW_SCALE_Y = <?php echo json_encode($_SESSION['scaleH']); ?>;
   </script>
</body>
</html>
