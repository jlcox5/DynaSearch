<?php
$page_title = "Editor";

$template_style_array  = array("style.css", "editor.css");
$template_script_array = array("ajax-core.js", "wz_jsgraphics.js", "timer_bb.js", "timer.js",  "hurricane-unisys-parser.js", "editor.js", "canvas3dapi/c3dapi.js");

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
//echo "Load: ".$exp_name;
?>

<body id="body" >

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
	// Added by Jon - Display all saved editor pages
	echo '<script language="javascript"> <!--
	   window.editorFiles = "<select name=\"instChoice\" id=\"instChoice\">"; //--></script>';
	   if($handle = opendir('./expResources/advisory')){
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


<form action="editor.php" id="main_editor" name="main_editor" method="post">

<div id='holdCanvas'></div>
<?php 
echo '<script type="text/javascript"> var pageadvnum = '. $adv_num .'; var experiment_shortname = "'. $exp_name .'"; var editing=true;';
if($exp_name != 'DefaultExperiment'){
   $exists_already = file_exists('expResources/advisory/'.$exp_name);
   if($exists_already)
   {
      echo 'load_all("expResources/advisory/'.$exp_name.'");';   
   }
}
else{
   $exists_already = file_exists('expResources/advisory/'.$exp_name.'_training_adv_' . $adv_num . '.txt');
   if($exists_already)
   {
      echo 'load_all("expResources/advisory/'.$exp_name.'_training_adv_' . $adv_num . '.txt");';   
   }
}
echo '</script>'; ?>
<div id="test"></div>
                     <tr><td><div id="timerInfo"></div></td></tr>
                     <tr><td><div id="clickData"></div></td></tr>
                     <tr><td><div id="totalClicks"></div></td></tr>

</body>
</html>
