<?php
	  include("assets/php/config.php");
      include("assets/php/std_api.php");
	  mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
      mysql_select_db($DB_NAME) or die("Unable to select database.");
	  
	  //Button hit
	  if(isset($_POST['doneWithPage'])){
	     // At least one click on necesarry elements
	     if(isset($_POST['clickNum1']) && isset($_POST['clickTime1']) && isset($_POST['elemId1'])){
    	    $totalClicks = $_POST['totalClicks'];
            $username = $_SESSION['username'];
	   		for($x=1 ; $x <= $totalClicks; $x+=1){
			   $var_clickNum = 'clickNum'.$x;
			   $var_clickTime = 'clickTime'.$x;
			   $var_elemId = 'elemId'.$x;
			   $clickNum = $_POST[$var_clickNum];
		       $clickTime = $_POST[$var_clickTime];
		       $elemId = $_POST[$var_elemId ];
			   echo $var_clickNum;
			   echo $var_clickTime;
			   echo $var_elemId;
			   echo $clickNum;
			   echo $clickTime;
			   echo $elemId;
		       mysql_query("INSERT INTO sur_clicks SET UserName='$username', SessionNumber=0, ObjClicked='$elemId', ClickLength='$clickTime', ClickNumber='$clickNum';");
			   redirect("question.php");
			 }
	     }
	  }
	  
	  $page_title = "Test Data";
      $style_file = "style.css";

      $template_style_array  = array($style_file, "resizeTest.css");
      $template_script_array = array("gridResize.js", "timer.js");
	  
	  include('assets/php/standard.php');
	  
	  // Code to prevent backtracking
     //checkPage(3);
?>

<body onload="coverTable('dataTable')" id="body" onmousedown="startTimer(event)" onmouseup="endTimer(event)">
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
   <div id="maincontainer">
      <center><h1>DynaView</h1></center>
      <br/>
               This is a crazy test screen
               <form id="configSize" name="configSize" method="post" action="testCrazyScreen.php">
                  <table id="two_column_opening">
                     <tr style="width:100%;"><td><img id="x_toTrack1" name="info" class="resize1" src="assets/images/info.jpg" style="width:100%; height:100%;" ></></td></tr>
                     <tr><td><table>
                        <td><img id="x_toTrack2" name="chart" class="resize1" src="assets/images/chart1.jpg" style="width:100%; height:100%;"></></td>
                        <td><img id="x_toTrack3" name="map" class="resize1" src="assets/images/testMap.jpg" style="width:100%; height:100%;"></></td>
                     </table></td></tr>
                     <tr style="width:100%;"><td><img id="x_toTrack4" name="timeLine" class="resize1" src="assets/images/timeLine.jpg" style="width:100%; height:100%;"></></td></tr>
                     <tr><td><table id='dataTable' align='center' width='250' border='1'>
                           <tr>
                              <td onmouseup="hideCell('dataTable', 0, 0)">Data</td>
                              <td onmouseup="hideCell('dataTable', 0, 1)">Data</td>
                              <td onmouseup="hideCell('dataTable', 0, 2)">Data</td>
                           </tr>
                           <tr>
                              <td onmouseup="hideCell('dataTable', 1, 0)">Data</td>
                              <td onmouseup="hideCell('dataTable', 1, 1)">Data</td>
                              <td onmouseup="hideCell('dataTable', 1, 2)">Data</td>
                           </tr>
                           <tr>
                              <td onmouseup="hideCell('dataTable', 2, 0)">Data</td>
                              <td onmouseup="hideCell('dataTable', 2, 1)">Data</td>
                              <td onmouseup="hideCell('dataTable', 2, 2)">Data</td>
                           </tr>
                     </table></td></tr>
                     <tr>
                         <div id='holdCanvas'></div>
                     </tr>
                     <tr><td><input type="submit" id="doneWithPage" name="doneWithPage" value="Done" /></td></tr>
                     <tr><td><div id="timerInfo"></div></td></tr>
                     <tr><td><div id="clickData"></div></td></tr>
                     <tr><td><div id="totalClicks"></div></td></tr>
                  </table>
               </form>
               <br/> <br/>
   </div>
</body>
</html>
