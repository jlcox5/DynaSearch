<?php

   require_once('assets/php/std_api.php');
   include("assets/php/config.php");
   include('assets/php/db_util.php');

   mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");


   //$_POST['testpost'] = "test";
   //redirect('sizeReg.php');

   $page_title = "Settings";
   $username = $_SESSION['username'];

   $template_style_array  = array("style.css", "adminSettings.css");
   $template_script_array = array("ajax-core.js", "adminSettings.js");

   include('assets/php/admin_dir.php');

   // Change Password
   if( isset($_POST['newPassword']) )
   {

      $newPassword = $_POST['newPassword'];

      if( $DEBUG )
      {
         
      }

      $query = "UPDATE t_user " .
               "SET UPassword='$newPassword' " .
               "WHERE " .
               "User_ID='$username';";
      if( $DEBUG ) { echo $query; }
      mysql_query($query);
   }

   if( isset($_POST['newProfile']) )
   {
      redirect('sizeReg.php');
   }

   if( isset($_POST['switchProfile']) )
   {
      $selectedScaleId = $_SESSION['scaleProfileId'] = $_POST['scaleProfile'];
      $query = "UPDATE t_user " .
               "SET ScaleProfileID='$selectedScaleId' " .
               "WHERE " .
               "User_ID='$username';";
      if( $DEBUG ) { echo $query; }
      mysql_query($query);
   }


   if( isset($_POST['deleteProfile']) )
   {
      $selectedScaleId = $_POST['scaleProfile'];
      $query = "DELETE FROM t_scale_profiles " .
               "WHERE " .
               "Profile_ID='$selectedScaleId' AND Admin_ID='$username';";
      if( $DEBUG ) { echo $query; }
      mysql_query($query);
   }


   $profileName   = "<i>None</i>";
   $scaleProfileId = $_SESSION['scaleProfileId'];
   $query = "SELECT * FROM t_scale_profiles " .
            "WHERE " .
            "Profile_ID='$scaleProfileId' AND Admin_ID='$username';";
   if( $DEBUG ) { echo $query; }
   $result = mysql_query($query);
   if( $row = mysql_fetch_array($result, MYSQL_BOTH) )
   {
      $profileName   = $row["Name"];
      //$optionExpName = $row["ExperimentName"];
   }

   $admSizeProfiles = getAdminSizeProfiles( $username );

   include('assets/php/standard.php');



?>

<body id="body">
   <?php
      echo '<script type="text/javascript">assetDir = "' . $assetBaseDir . '"; ADMIN_ID = "' . $username . '"</script>';
   ?>

   <div id="maincontainer">
      <div id="wrapper" style="width:70%; margin: auto auto;">
   
         <h1>Settings</h1><br/>
         <br/>

         <div id="accordion">

            <!-- Change Password -->
            <h2>Change Password</h2>
            <div class="content">
               <form id="changePasswordForm" action="adminSettings.php" method="post" onsubmit="return validatePassword(this);">
               <h3>Old Password : 
                 <input type="password" id="oldPassword" name="oldPassword" value="" required="required" />
               </h3>
               <h3>New Password : 
                 <input type="password" id="newPassword" name="newPassword" value="" required="required" />
               </h3>
               <h3>Re-enter Password : 
                 <input type="password" id="newPasswordCheck" name="newPasswordCheck" value="" required="required" />
               </h3>

               <input type="submit" name="changePassword" value="Change" />
               <br/>
               </form>

            </div>

            <!-- Screen Size Calibration -->
            <h2>Screen Size Profile</h2>
            <div class="content">
               <form action="adminSettings.php" method="post">
                  <h3>Current Profile : <?php echo $profileName; ?></h3>
                  <br/>
                  <h3>My Profiles :
   <?php
      if( count($admSizeProfiles) > 0 )
      {
         echo '<select name="scaleProfile">';
foreach($admSizeProfiles as $key => $value)
{
   echo '<option value="' . $key . '">' . $value . '</option>';
}
         echo '</select> ' .
              '<input type="submit" name="switchProfile" value="Switch To"> ' .
              '<input type="submit" name="deleteProfile" value="Delete"> ';
      }
      else
      {
         echo 'No profiles created';
      }
   ?>
                     <input type="submit" name="newProfile" value="New">
                  <h3>
               </form>
            </div>

         </div>

      </div>
   </div>
   
</body>
</html>
