<?php
   require_once('assets/php/std_api.php');
   include("assets/php/config.php");
   include('assets/php/db_util.php');
   include('assets/php/email_util.php');
   include('assets/php/PasswordHash.php');
   
   // Create empty error log for the page
   $_SESSION['log'] = Array();

   mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");


   //$_POST['testpost'] = "test";
   //redirect('sizeReg.php');

   $page_title = "Settings";
   $username = $_SESSION['username'];

   $template_style_array  = array("style.css", "mBoxNotice.css", "adminSettings.css");
   $template_script_array = array("ajax-core.js", "mBox.All.min.js", "adminSettings.js");

   include('assets/php/admin_dir.php');

   $noticeType = '';
   $noticeMsg  = '';

   // Change Password
   if( isset($_POST['newPassword']) )
   {

      $query = "SELECT * FROM t_user WHERE User_ID='$username';";
      $result = mysql_query( $query );
      $row = mysql_fetch_array($result);

      $oldPasswordHash = $row['PasswordHash'];
      $oldPassword     = $_POST['oldPassword'];

      if( validate_password($oldPassword, $oldPasswordHash) )
      {

         $newPassword = $_POST['newPassword'];

         if( $DEBUG )
         {
         
         }

         $passwordHash = create_hash( $newPassword );
         $passwordHashStr = mysql_escape_string( $passwordHash );
         $query = "UPDATE t_user SET PasswordHash='$passwordHashStr' WHERE User_ID='$username';";
         if( $DEBUG ) { echo $query; }
         mysql_query($query);
//echo "password changed";
         $noticeType = 'ok';
         $noticeMsg  = 'Password Updated!';

      }
      else
      {
         $noticeType = 'error';
         $noticeMsg  = 'Old Password Invalid!';
      }
   }

   // Update Email Address
   if( isset($_POST['updateEmail']) )
   {

      $emailAddr = $_POST['email'];
      if( valid_email($emailAddr) )
      {
         $emailAddrStr = mysql_escape_string( $emailAddr );

         $query = "UPDATE t_user SET Email='$emailAddrStr' WHERE User_ID='$username';";
         if( $DEBUG ) { echo $query; }
         mysql_query($query);

         $noticeType = 'ok';
         $noticeMsg  = 'Email Address Updated!';

      }
      else
      {
         $noticeType = 'error';
         $noticeMsg  = 'Email Address Invalid!';
      }
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
      $selectedScaleId = $_POST['scaleProfileId'];
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
      echo '<script type="text/javascript">' .
              'assetDir = "' . $assetBaseDir . '";' .
              'ADMIN_ID = "' . $username . '";';

      if( $noticeMsg )
      {
         echo 'setNotice("' . $noticeType . '", "' . $noticeMsg . '");';
      }

      echo '</script>';
   ?>

   <div id="maincontainer">
      <div id="wrapper" style="width:70%; margin: auto auto;">

         <h1>My Settings</h1><br/>
         <br/>

         <div id="accordion">

            <!-- Change Password -->
            <div class="toggle" hash-link="password">Change Password</div>
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

            <!-- Change Email Address -->
            <div class="toggle" hash-link="email">Change Email Address</div>
            <div class="content">
               <form id="updateEmailForm" action="adminSettings.php" method="post">
               <h3>Email : 
   <?php
      $query = "SELECT * FROM t_user " .
               "WHERE " .
               "User_ID='$username' AND Admin_ID='$username';";
      if( $DEBUG ) { echo $query; }
      $result = mysql_query($query);
      if( $row = mysql_fetch_array($result, MYSQL_BOTH) )
      {
         $emailAddr   = $row["Email"];
      }

      echo '<input type="text" name="email" value="' . $emailAddr . '" required="required" />'
   ?>
               </h3>
               <input type="submit" name="updateEmail" value="Update" />
               <br/>
               </form>

            </div>

            <!-- Screen Size Calibration -->
            <div class="toggle" hash-link="size_profile">Screen Size Profile</div>
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
