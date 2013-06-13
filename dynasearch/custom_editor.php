<?php

   require_once('assets/php/std_api.php');
   include("assets/php/config.php");
   include('assets/php/admin_dir.php');

   mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");

   $username = $_SESSION['username'];
   $cpId     = ifSetElse( $_REQUEST['cpId'],   -1 );
   $cpName   = ifSetElse( $_REQUEST['cpName'], 'Untitled' );
   $cpData   = ifSetElse( $_REQUEST['cpData'], '{}' );

   $op = ifSetElse( $_REQUEST['op'] );   
   switch ( $op )
   {
      case 'delete' :
         if( $cpId > 0 )
         {
            $query = "DELETE FROM t_custom_pages " .
                     "WHERE id=$cpId;";
            if( $DEBUG ) { echo $query; }
            mysql_query($query);
            $cpId = -1;
         }
         else
         {
            if( $DEBUG ) { echo "Op ERROR : DELETE --- CpId not set<br/>"; }
         }
       break;

      case 'save' :
      
         $sqlName = mysql_real_escape_string( $cpName );
         $sqlData = mysql_real_escape_string( $cpData );
      
         if( $cpId > 0 )
         {
            $query = "UPDATE t_custom_pages " .
                     "SET Admin_ID='$username', Name='$sqlName', Data='$sqlData' " .
                     "WHERE id=$cpId;";
            mysql_query($query);

         }
         else
         {
            $query = "INSERT INTO t_custom_pages " .
                     "(Admin_ID, Name, Data) " .
                     "VALUES ('$username', '$sqlName', '$sqlData');";
            mysql_query($query);
            $cpId = mysql_insert_id();
            
            // Prevent multiple insertions from page refresh by redirecting
            redirect( 'custom_editor.php?op=load&cpId=' . $cpId );
         }

         if( $DEBUG ) { echo $query; }
        break;

      case 'load' :
         $query = "SELECT * FROM t_custom_pages WHERE id='$cpId';";
         $res = mysql_query( $query );
            
         if( $res ) 
         {  
            // Load the Custom Page Data
            $res = mysql_fetch_array($res, MYSQL_BOTH);
               
            $cpName = $res['Name'];
            $cpData = $res['Data'];
            //$scaleProfileId = $res['ScaleProfileID'];
           
         }
         else 
         {
            if( $DEBUG ) { echo "FileOp ERROR : LOAD --- Exp not found in database<br/>"; }
         }
         break;

      default :
         break;
   }
   
   //echo $cpName . '<br/>';
   //echo $cpData . '<br/>';
   
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
   $template_style_array  = array("style.css", "mBoxCore.css", "mBoxModal.css", "editor.css");
   $template_script_array = array("ajax-core.js", "wz_jsgraphics.js", "timer_bb.js", "timer.js", 'dsToolbarIcon.class.js', 'dsApplet.class.js', 'dsWindow.class.js',  'dsCustomPage.class.js', "custom_editor.js", "canvas3dapi/c3dapi.js", "mBox.All.min.js");

//array_push($template_script_array, "dsCustomPage.js", "classWindow.js", "dsToolbarIcon.js", "custom_editor.js");
   include('assets/php/standard.php');
/*
if(isset($_POST['expLoad'])){
   $exp_name = $_POST['instChoice'];
   $adv_num = 5;
//   echo "made it";
}
else{
   $exp_name = 'DefaultExperiment';
   $adv_num = 5;
}*/

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

   <div id='maincontainer'>
      <div id="custom-page"></div>
   </div>

<!--<div id='holdCanvas'></div>-->
<?php 
/*
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
echo '</script>';
*/
?>
<!--
<div id="test"></div>
                     <tr><td><div id="timerInfo"></div></td></tr>
                     <tr><td><div id="clickData"></div></td></tr>
                     <tr><td><div id="totalClicks"></div></td></tr>
-->
                     
                     
   <?php
      $customPageOptions = getAdminCustomPages($username);
   ?>
   <script type="text/javascript">
   
      ADMIN_ID                = <?php echo json_encode($username); ?>;
      CP_ID                   = <?php echo json_encode($cpId); ?>;
      CP_NAME                 = <?php echo json_encode($cpName); ?>;
      CP_DATA                 = <?php echo json_encode($cpData); ?>;
      
      WINDOW_SCALE_X          = <?php echo json_encode($scaleProfileW); ?>;
      WINDOW_SCALE_Y          = <?php echo json_encode($scaleProfileH); ?>;
   
      DS_ADMIN_ASSET_DIR      = <?php echo json_encode($assetBaseDir); ?>;
      DS_CUSTOMPAGE_OPTIONS   = <?php echo json_encode($customPageOptions); ?>;
      DS_IMAGEWINDOW_OPTIONS  = <?php echo json_encode($assets[0]['Options']); ?>;
      DS_TABLEWINDOW_OPTIONS  = <?php echo json_encode($assets[1]['Options']); ?>;
      DS_APPLETWINDOW_OPTIONS = <?php echo json_encode($assets[2]['Options']); ?>;
   </script>
</body>
</html>
