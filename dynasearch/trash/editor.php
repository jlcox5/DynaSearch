<?php

   require_once('assets/php/std_api.php');
   include("assets/php/config.php");
   include('assets/php/admin_dir.php');

   mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");


   // Load Scale Profile
   $scaleProfileId = $_SESSION['scaleProfileId'];
   $query = "SELECT * FROM t_scale_profiles " .
            "WHERE " .
            "Profile_ID='$scaleProfileId' AND Admin_ID='$username';";
      if( $DEBUG ) { echo $query; }
      $result = mysql_query($query);
      if( $row = mysql_fetch_array($result, MYSQL_BOTH) )
      {
         $scaleProfileName   = $row["Name"];
         $scaleProfileW      = $row["ScaleW"];
         $scaleProfileH      = $row["ScaleH"];
      }
      else
      {
         $host  = $_SERVER['HTTP_HOST'];
         $uri   = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
         echo '<script type="text/javascript">
                  alert("You must have a Scale Profile selected in order to create a training page.");
                  window.location = "http://'. $host . $uri .'/adminSettings.php";
               </script> ';
      }

   $page_title = "Editor";

   $template_style_array  = array("style.css", "editor.css");
   $template_script_array = array("ajax-core.js", "wz_jsgraphics.js", "timer_bb.js", "timer.js",  "hurricane-unisys-parser.js", "canvas3dapi/c3dapi.js");

// There is a little bit of a dependency issue with the editor.js file needing to have assetDir defined before it can run.  It would be nice to be
// able to clean this up a little more at some point, but it works for now... I guess. -- Jon


echo '<script type="text/javascript"> assetDir = "' . $assetBaseDir . '"; </script> ';

array_push($template_script_array, "editor.js");
include('assets/php/standard.php');

if(isset($_POST['expLoad'])){
   $exp_name = $_POST['instChoice'];
   $adv_num = 5;
//   echo "made it";
}
else{
   $exp_name = 'DefaultExperiment';
   $adv_num = 5;
}

	//$assetBaseDir = "admins/" . $username . "/assets/training/";
	//echo '<script language="javascript"> <!-- 
	 //   window.assetBaseDir = "' . $assetBaseDir . '"; //--></script>';
//echo "Load: ".$exp_name;
?>

<body id="body" >

   <?php



      echo '<script language="javascript"> <!--
               window.scaleW = '.$scaleProfileW.';
               window.scaleH = '.$scaleProfileH.';
            //--></script>';

/*
if(isset($_SESSION['scaleW'])){
 echo '<script language="javascript"> <!--
		window.scaleW = '.$_SESSION['scaleW'].'; //--></script>';
}

if(isset($_SESSION['scaleH'])){
 echo '<script language="javascript"> <!--
		window.scaleH = '.$_SESSION['scaleH'].'; //--></script>';
}*/
   ?>

<?php
	// Added by Jon - Display all saved editor pages
	//$assetBaseDir = "admins/" . $username . "/assets/training/";
	 //echo '<script language="javascript"> <!-- 
	  //   window.assetBaseDir = "' . $assetBaseDir . '"; //--></script>';
	
	echo '<script language="javascript"> <!--
	   window.editorFiles = "<select name=\"instChoice\" id=\"instChoice\">"; //--></script>';
	   if($handle = opendir($assetBaseDir . "training/")){
   	   while(false !== ($file = readdir($handle))){
      	   if($file !== '.' && $file !== '..'){
         	   echo '<script language="javascript"> <!--
                  window.editorFiles = window.editorFiles + "<option value=\"'.$file.'\">'.$file.'</option>"; //--></script>';
            }
         }
      }
      echo '<script language="javascript"> <!--
	      window.editorFiles = window.editorFiles+"</select>"; //--></script>';
?>


<?php 
   for($i = 0; $i < count($assets); $i++)
   {
      $currAsset = &$assets[$i];

      echo '<div id="' . $currAsset["Tag"] . 'Popup" class="assetPopup">' . '';

      $assetOptions = &$currAsset["Options"];
      $assetOptionCount = count($assetOptions);
      if ( $assetOptionCount > 0)
      {

         echo '<select id="'. $currAsset["Tag"] .'PopupSelect">';
         foreach ($assetOptions as $key => $value)
         {
            echo '<option value="' . $key . '">' . $value . '</option>';
         }
         echo '</select>';
         $disable = '';

      }
      else
      {
         echo 'No Assets Uploaded';
         $disable = 'disabled="disabled"';
      }

      echo    '<br>' .
              '<input type="button" value="Cancel" onclick="dismissAssetPopup(\'' . $currAsset["Tag"] . '\');" />' .
              '<input type="button" value="Select" onclick="selectAsset(\'' . $currAsset["Tag"] . '\');" ' . $disable .' />' .
           '</div>';
   }
?>

<form action="editor.php" id="main_editor" name="main_editor" method="post">

<div id='holdCanvas'></div>
<?php 
echo '<script type="text/javascript"> var pageadvnum = '. $adv_num .'; var experiment_shortname = "'. $exp_name .'"; var editing=true;';

   //$assetBaseDir = "./admins/" . $username . "/assets/training/";
   echo 'assetDir = "' . $assetBaseDir . '";';


if($exp_name != 'DefaultExperiment'){
   $exists_already = file_exists($assetBaseDir. 'training/' .$exp_name);
   if($exists_already)
   {
      echo 'load_all("'.$assetBaseDir. 'training/' .$exp_name.'");';   
   }
}
else{
   $exists_already = file_exists($assetBaseDir.$exp_name.'_training_adv_' . $adv_num . '.txt');
   if($exists_already)
   {
      echo $assetBaseDir.$exp_name.'_training_adv_' . $adv_num . '.txt';
      //echo 'load_all('.$assetBaseDir.$exp_name.'_training_adv_' . $adv_num . '.txt");';   
   }
}
echo '</script>'; ?>


<div id="test"></div>
                     <tr><td><div id="timerInfo"></div></td></tr>
                     <tr><td><div id="clickData"></div></td></tr>
                     <tr><td><div id="totalClicks"></div></td></tr>

</body>
</html>
