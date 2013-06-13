<?php
   include("assets/php/config.php");
   include("assets/php/std_api.php");
   require_once("assets/php/db_util.php");
   mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");

	  
	//Button hit
	//var done = $post['pageFinished'];
	//$_POST['pageFinished'] = 'true';
    if(isset($_POST['pageFinished'])){
      // At least one click on necesarry elements
      if(isset($_POST['clickNum1']) && isset($_POST['clickTime1']) && isset($_POST['elemId1'])){
         $totalClicks = $_POST['totalClicks'];
         $username = $_SESSION['username'];
         $userExpId = $_SESSION['userExpId'];
         $resultStr = 'Pagename:';

         for($x=1 ; $x <= $totalClicks; $x+=1){
            $var_clickNum = 'clickNum'.$x;
            $var_clickTime = 'clickTime'.$x;
            $var_elemId = 'elemId'.$x;
            $clickNum = $_POST[$var_clickNum];
            $clickTime = $_POST[$var_clickTime];
            $elemId = $_POST[$var_elemId ];
			   /*echo $var_clickNum;
			   echo $var_clickTime;
			   echo $var_elemId;
			   echo $clickNum;
			   echo $clickTime;
			   echo $elemId;*/
            $resultStr .= $elemId . "," . $clickTime . ( ($x < $totalClicks) ? ('$') : ('') );
         }

         $resultStr .= "&";
         $query = "UPDATE t_user_output " .
                  "SET ClickOutput=IFNULL(CONCAT(ClickOutput, '$resultStr'), '$resultStr') " .
                  "WHERE User_ID='$username' AND Experiment_ID='$userExpId';";
         mysql_query($query);
         redirect("advance.php");
      }
      else
      {
         $username = $_SESSION['username'];
         mysql_query("INSERT INTO sur_clicks SET UserName='$username', SessionNumber=0, ObjClicked='NULL', ClickLength=-1, ClickNumber=-1;");
         redirect("advance.php");
      }
   }

    // Are we supposed to be here?
   if(isset($_SESSION['page_sig'])) {
   	if($_SESSION['page_sig'] != 'dynaview.php') {
		redirect('assets/php/user.php?logout=true');
	}
   }
   else
   {
   	redirect('assets/php/user.php?logout=true');
   }

	/////////////////////////////////////////////////
	// Get the title and content
	/////////////////////////////////////////////////
	
	$username = $_SESSION['username'];
	$userAdmin = $_SESSION['userAdmin'];
    $assetBaseDir = "./admins/" . $userAdmin . "/assets/";
	echo '<script type="text/javascript"> assetDir = "' . $assetBaseDir . '"; </script> ';

	// Get our current page.
	$result = query_db('select * from t_user where User_ID=\''. $username .'\'');
	$row = mysql_fetch_array($result, MYSQL_BOTH);
	$admin = $row['Admin_ID'];
	$current_position = $row['current_position'];

   // Get Experiment Data
   $expData = $_SESSION['expData'];
   $expPageData = $expData[ $current_position-1 ];
   $pageTitle = $expPageData['title'];
   
   // Load the Custom Page Data from database
   $cpId = $expPageData['source'];
   $query = "SELECT * FROM t_custom_pages WHERE id='$cpId';";
   $res = mysql_query( $query );
   $row = mysql_fetch_array($res, MYSQL_BOTH);
            
   if( $row ) 
   {  
      $cpName = $row['Name'];
      $cpData = $row['Data'];
      //$scaleProfileId = $res['ScaleProfileID'];
      
   }
   else 
   {
      if( $DEBUG ) { echo "FileOp ERROR : LOAD --- Exp not found in database<br/>"; }
   }

   

   $page_title = "DynaSearch";
   $template_style_array  = array("style.css", "editor.css");
   $template_script_array = array("ajax-core.js", "wz_jsgraphics.js", "timer_bb.js", "timer.js", "hurricane-unisys-parser.js", "editor.js", "canvas3dapi/c3dapi.js");
   include('assets/php/standard.php');
?>

<body id="body" onmousedown="startTimer(event)" onmouseup="endTimer(event)">

<?php
if(isset($_SESSION['scaleW'])){
 echo '<script language="javascript"> <!--
		window.scaleW = '.$_SESSION['scaleW'].'; //--></script>';
}

if(isset($_SESSION['scaleH'])){
 echo '<script language="javascript"> <!--
		window.scaleH = '.$_SESSION['scaleH'].'; //--></script>';
}	 
?>

   <div id='maincontainer'>
      <div id='holdCanvas'></div>
      
      <form id="main_editor" name="main_editor" method="post" action="dynasearch.php">
<div id="test"></div>
                     <tr><td><div id="timerInfo"></div></td></tr>
                     <tr><td><div id="clickData"></div></td></tr>
                     <tr><td><div id="totalClicks"></div></td></tr>
                     <input name="advance" style="visibility:hidden;" value="true"/>
                     <input name="pageFinished" id="pageFinished" style="visibility:hidden;" value="false"/>
                     <tr><td><input type="button" id="doneWithPage" name="doneWithPage" value="Done" onClick="submitPageWithInput();" style="position:absolute;" /></td></tr>
<?php
   echo'<script type="text/javascript" src="assets/scripts/editor.js"></script><script type="text/javascript" >load_all("'.$myFile.'");</script>';
?>
         </font>
      </form>
   </div>
</body>
</html>
