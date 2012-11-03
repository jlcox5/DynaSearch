<?php
   include("assets/php/config.php");
   include("assets/php/std_api.php");
   require_once("assets/php/db_util.php");
   mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");

$page_title = "Dynaview";

$template_style_array  = array("style.css", "editor.css");
$template_script_array = array("ajax-core.js", "wz_jsgraphics.js", "timer_bb.js", "timer.js", "hurricane-unisys-parser.js", "editor.js");

	  
	//Button hit
	//var done = $post['pageFinished'];
	//$_POST['pageFinished'] == 'true'
	if(isset($_POST['pageFinished'])){
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
			   //echo $var_clickNum;
			   //echo $var_clickTime;
			   //echo $var_elemId;
			   //echo $clickNum;
			   //echo $clickTime;
			   //echo $elemId;
		      mysql_query("INSERT INTO sur_clicks SET UserName='$username', SessionNumber=0, ObjClicked='$elemId', ClickLength='$clickTime', ClickNumber='$clickNum';");
			   redirect("advance.php");
			}
	   }
	}

function strToHex($string)
{
    $hex='';
    for ($i=0; $i < strlen($string); $i++)
    {
        $hex .= dechex(ord($string[$i]));
    }
    return $hex;
}

function hexToStr($hex)
{
    $string='';
    for ($i=0; $i < strlen($hex)-1; $i+=2)
    {
        $string .= chr( hexdec($hex[$i].$hex[$i+1]) );
    }
	return $string;
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

	// Get our current page.
	$result = query_db('select * from t_user where User_ID=\''. $username .'\'');
	$row = mysql_fetch_array($result, MYSQL_BOTH);
	$current_position = $row['current_position'];

	$expshortname = $row['experiment'];
	// Find out where we should go now.
	$result = query_db('select * from t_experiments where ExperimentShortName=\''. $expshortname .'\'');
	$row = mysql_fetch_array($result, MYSQL_BOTH);

	$expstr = $row['ExperimentString'];

	$exparr = explode('$',$expstr);
	for($i=0; $i<count($exparr);$i++)
	{
		$properties = explode('&', $exparr[$i]);
	
		for($j=0;$j < count($properties);$j++)
		{
			$item = explode('=',$properties[$j]);
			// Match up with the page we should be on.
			if($item[0] == 'page')
			{
				$pagenum = (int)$item[1];
				if($pagenum == $current_position-1)
				{
					for($k=0;$k<count($properties);$k++)
					{
						$item2 = explode('=',$properties[$k]);
						if($item2[0] == 'title')
						{
							$exp_page_title = hexToStr($item2[1]);
						}
						elseif($item2[0] == 'src')
						{
   						//echo " here again! ";
							$myFile = 'hurricane_data/'. $expshortname . '/'. hexToStr($item2[1]);
							$adv_num = $_SESSION['advNum'];
							$fh = fopen($myFile, 'r');
							$page_content = fread($fh, filesize($myFile));
							$page_content = hexToStr($page_content);
							//echo $myFile;
							fclose($fh);
						}
					}
				}				
			}
		}
	}
	/////////////////////////////////////////////////

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

<?php
   // Get user info for tracking display
   //echo('Username:'.$username);
   $result = mysql_query("SELECT FORECAST, PAST_TRACK, CONE, CURRENT FROM t_user WHERE User_ID='$username';");
   //echo('Result: '.$result);
   $toTest = mysql_fetch_array($result);
   echo '<script language="javascript"> <!--
      window.FORECAST = '.$toTest['FORECAST'].'; //--></script>';
   echo '<script language="javascript"> <!--
      window.PAST_TRACK = '.$toTest['PAST_TRACK'].'; //--></script>';
   echo '<script language="javascript"> <!--
      window.CONE = '.$toTest['CONE'].'; //--></script>';
   echo '<script language="javascript"> <!--
      window.CURRENT = '.$toTest['CURRENT'].'; //--></script>';
   //echo("alert('fc: ' + window.FORECAST + ' pt: ' + window.PAST_TRACK + ' cone: ' + window.CONE  ' cur: ' + window.CURRENT);");
   
?>

<div id='maincontainer'>
<div id='holdCanvas'></div>
<form id="main_editor" name="main_editor" method="post" action="dynaview.php">
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
</form>
</div>
</body>
</html>
